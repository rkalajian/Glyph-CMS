import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_NOINDEX === 'true') {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN;
  return {
    rules: { userAgent: '*', allow: '/' },
    ...(domain ? { sitemap: `https://${domain}/sitemap.xml` } : {}),
  };
}
