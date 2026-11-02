import { defineConfig, devices } from '@playwright/test';

// Not 4321: a running `astro dev` there would be reused and the check would skip the build.
const PORT = 4322;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    reducedMotion: 'reduce',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // `npm run ui-check` builds first. `--ignore-lock` keeps preview in the foreground: run by an AI agent,
    // Astro detaches it into a background server Playwright can't stop. A server already on the port is
    // never reused: it would serve an old build.
    command: `npx astro preview --port ${PORT} --ignore-lock`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
