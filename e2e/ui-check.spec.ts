import { test, expect, type Page, type Response } from '@playwright/test';

/** Every existing page; used when ROUTES is empty. Update when a spec adds a route. */
export const DEFAULT_ROUTES = ['root', 'work', 'studio', 'rates', 'contact', 'privacy', '404', 'clients', 'clients/harbour-content-day'];

// 375 is emulated as a phone (overlay scrollbars, touch), 1280 as a desktop.
const WIDTHS = [
  { width: 375, height: 812, isMobile: true },
  { width: 1280, height: 800, isMobile: false },
] as const;
const THEMES = ['night', 'day'] as const;

const SPEC = process.env.SPEC?.trim() || 'all';
const ROUTES = (process.env.ROUTES ?? '')
  .split(',')
  .map((r) => r.trim().replace(/^\/+|\/+$/g, ''))
  .filter((r) => r !== '');
const routes = ROUTES.length > 0 ? ROUTES : DEFAULT_ROUTES;

function routePath(route: string): string {
  if (route === 'root') return '/';
  if (route === '404') return '/this-page-does-not-exist/';
  return `/${route}/`;
}

/** Scroll to the bottom and back so lazy images load and observers fire. */
async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight / 2, 200);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 100));
    window.scrollTo(0, 0);
  });
  // Off-screen lazy images (e.g. in a horizontal slider) never scroll into view: force them.
  await page.evaluate(() => {
    for (const img of document.images) img.loading = 'eager';
  });
  await page.waitForLoadState('networkidle');
  // Web fonts change the page height; measure and capture only after they have swapped in.
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images).map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) return resolve();
            const done = () => resolve();
            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
            setTimeout(done, 8000);
          }),
      ),
    ),
  );
}

/**
 * Visible elements that stick out past the left or right edge of the viewport, outside any container
 * that clips them on purpose (slider, marquee, frames). Only the outermost offender is listed.
 */
async function findOffscreen(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const clipped = (el: Element): boolean => {
      // `.sh-page` is the page wrapper: its clip hides mistakes, so it doesn't count as intended.
      for (let p = el.parentElement; p && p !== document.body && !p.classList.contains('sh-page'); p = p.parentElement) {
        if (getComputedStyle(p).overflowX !== 'visible') return true;
      }
      return false;
    };
    const describe = (el: Element): string =>
      el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.classList.length ? `.${[...el.classList].join('.')}` : '');
    const found: Element[] = [];
    for (const el of document.body.querySelectorAll('*')) {
      if (found.some((f) => f.contains(el))) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (r.right <= vw + 1 && r.left >= -1) continue;
      if (!el.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue;
      if (getComputedStyle(el).position === 'fixed' || clipped(el)) continue;
      found.push(el);
    }
    return found.map((el) => {
      const r = el.getBoundingClientRect();
      return `${describe(el)} (${Math.round(r.left)}..${Math.round(r.right)}px, screen ${vw}px)`;
    });
  });
}

for (const { width, height, isMobile } of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height }, isMobile, hasTouch: isMobile });

    for (const route of routes) {
      for (const theme of THEMES) {
        test(`${route} ${width} ${theme}`, async ({ page, baseURL }) => {
          const problems: string[] = [];
          const origin = new URL(baseURL ?? 'http://localhost:4322').origin;
          const path = routePath(route);
          const expectsNotFound = route === '404';

          await page.addInitScript((t: string) => {
            try { localStorage.setItem('sh-theme', t); } catch { /* storage unavailable */ }
          }, theme);

          page.on('console', (msg) => {
            if (msg.type() !== 'error') return;
            // The browser logs the expected 404 of the 404 route's own document as a console error.
            const isExpected404 =
              expectsNotFound &&
              msg.text().includes('status of 404') &&
              new URL(msg.location().url || origin).pathname === path;
            if (!isExpected404) problems.push(`console.error: ${msg.text()}`);
          });
          page.on('pageerror', (err) => problems.push(`pageerror: ${err.message}`));
          page.on('requestfailed', (req) => {
            if (new URL(req.url()).origin === origin) {
              problems.push(`request failed: ${req.url()} (${req.failure()?.errorText ?? 'unknown'})`);
            }
          });
          page.on('response', (res: Response) => {
            const url = new URL(res.url());
            if (url.origin !== origin || res.status() < 400) return;
            const isMainDoc = res.request().isNavigationRequest() && url.pathname === path;
            if (expectsNotFound && isMainDoc && res.status() === 404) return;
            problems.push(`HTTP ${res.status()}: ${res.url()}`);
          });

          const response = await page.goto(path);
          await page.waitForLoadState('load');
          if (expectsNotFound && response?.status() !== 404) {
            problems.push(`expected HTTP 404 for ${path}, got ${response?.status()}`);
          }

          const actualTheme = await page.evaluate(() => document.documentElement.dataset.theme);
          if (actualTheme !== theme) problems.push(`theme is "${actualTheme}", expected "${theme}"`);

          await settle(page);

          const file = `${route.replace(/\//g, '-')}-${width}-${theme}.png`;
          await page.screenshot({ path: `e2e/screenshots/${SPEC}/${file}`, fullPage: true });

          const { scrollWidth, innerWidth } = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
          }));
          if (scrollWidth > innerWidth) {
            problems.push(`horizontal overflow: scrollWidth ${scrollWidth} > innerWidth ${innerWidth}`);
          }
          // `.sh-page` clips overflow-x, so content wider than the screen is cut off instead of scrolling.
          for (const el of await findOffscreen(page)) problems.push(`cut off at the screen edge: ${el}`);

          expect(problems, `UI check problems on ${path}:\n${problems.join('\n')}`).toEqual([]);
        });
      }
    }
  });
}
