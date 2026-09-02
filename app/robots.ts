import type { MetadataRoute } from 'next';

const siteUrl = 'https://delongkevin.github.io/FullStackEngineer';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}