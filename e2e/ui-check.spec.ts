import { test, expect, type Page, type Response } from '@playwright/test';

/** Every existing page; used when ROUTES is empty. Update when a spec adds a route. */
export const DEFAULT_ROUTES = ['root', 'work', 'studio', 'rates', 'contact', 'privacy', '404'];

const WIDTHS = [
  { width: 375, height: 812 },
  { width: 1280, height: 800 },
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

for (const route of routes) {
  for (const { width, height } of WIDTHS) {
    for (const theme of THEMES) {
      test(`${route} ${width} ${theme}`, async ({ page, baseURL }) => {
        const problems: string[] = [];
        const origin = new URL(baseURL ?? 'http://localhost:4321').origin;
        const path = routePath(route);
        const expectsNotFound = route === '404';

        await page.setViewportSize({ width, height });
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

        expect(problems, `UI check problems on ${path}:\n${problems.join('\n')}`).toEqual([]);
      });
    }
  }
}
