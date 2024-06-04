import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ''
    },
    sitemap: `${process.env.HOME_URL!}/sitemap.xml`
  };
}
