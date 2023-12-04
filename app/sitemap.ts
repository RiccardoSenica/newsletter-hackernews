import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: process.env.HOME_URL!,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1
    },
    {
      url: `${process.env.HOME_URL!}/subscribe`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8
    },
    {
      url: `${process.env.HOME_URL!}/unsubscribe`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5
    }
  ];
}
