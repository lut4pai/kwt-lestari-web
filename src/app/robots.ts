import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/tentang-kami'],
        disallow: ['/admin', '/api/'],
      },
    ],
  };
}
