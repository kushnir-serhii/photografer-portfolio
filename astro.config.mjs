// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://robinhale.studio',
  // Left out of the sitemap: the 404 page and the client galleries (noindex, spec 006).
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) && !/\/clients(\/|$)/.test(page) })],
});
