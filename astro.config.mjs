// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://robinhale.studio',
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) })],
});
