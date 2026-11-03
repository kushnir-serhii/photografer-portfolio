// Builders for schema.org JSON-LD. Pages pass the result to BaseLayout's `schema` prop.
import { site, business, type FaqItem } from './site';

export type JsonLdObject = Record<string, unknown>;

export function businessId(siteUrl: URL | string): string {
  return `${new URL('/', siteUrl).href.replace(/\/$/, '')}/#business`;
}

// 'tel:+442079460321' -> '+442079460321'
function e164(phoneHref: string): string {
  return phoneHref.replace(/^tel:/, '');
}

// The Instagram value is a placeholder until it has a path (a real profile).
function realProfile(url: string): string | undefined {
  try {
    return new URL(url).pathname.replace(/\//g, '') ? url : undefined;
  } catch {
    return undefined;
  }
}

export function businessSchema(siteUrl: URL | string, image: string, areaServed: string[] = business.areaServed): JsonLdObject {
  const origin = new URL('/', siteUrl).href;
  const profile = realProfile(site.instagram);
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': businessId(siteUrl),
    name: site.name,
    description: site.description,
    url: origin,
    email: site.email,
    telephone: e164(site.phoneHref),
    image: new URL(image, siteUrl).href,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressRegion: business.region,
      addressCountry: business.country,
    },
    areaServed: areaServed.map((name) => ({ '@type': 'Place', name })),
    priceRange: business.priceRange,
    ...(profile ? { sameAs: [profile] } : {}),
  };
}

export function faqSchema(items: FaqItem[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
