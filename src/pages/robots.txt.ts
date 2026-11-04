import type { APIRoute } from 'astro';
import { site as siteData } from '../data/site';

// AI crawlers and AI-training opt-out tokens, named so the block holds even for bots that skip `*`.
const aiBots = [
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'Google-Extended', 'GoogleOther', 'Applebot-Extended', 'PerplexityBot', 'Perplexity-User', 'CCBot',
  'Bytespider', 'Meta-ExternalAgent', 'Meta-ExternalFetcher', 'FacebookBot', 'Amazonbot', 'cohere-ai',
  'Diffbot', 'DuckAssistBot', 'MistralAI-User', 'YouBot', 'Timpibot', 'ImagesiftBot', 'omgili',
];

export const GET: APIRoute = ({ site }) => {
  // Closed site (the demo): search engines, AI crawlers and every other robot are asked to stay out,
  // and no sitemap is advertised.
  const body = siteData.indexable
    ? // `site` is set in astro.config.mjs; the sitemap line is absolute.
      `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`
    : [...aiBots, '*'].map((bot) => `User-agent: ${bot}`).join('\n') + '\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
