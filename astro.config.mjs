// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sitemap from '@astrojs/sitemap';

// The site's public URL (canonical links, Open Graph images, sitemap, robots.txt).
// SITE_URL from .env or the host's build env wins; on Vercel it falls back to the project's
// production domain; otherwise the demo's placeholder domain.
// (Not BASE_URL: Astro reserves that name for the `base` sub-path.)
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const vercelUrl = env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
const site = env.SITE_URL || vercelUrl || 'https://robinhale.studio';

export default defineConfig({
  site,
  // Left out of the sitemap: the 404 page and the client galleries (noindex, spec 006).
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) && !/\/clients(\/|$)/.test(page) })],
});
