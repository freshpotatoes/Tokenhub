/**
 * robots.txt 生成
 *
 * Next.js App Router 约定:
 * 导出默认函数即可自动生成 /robots.txt
 */

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tokenhub.example.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // API 端点不需要索引
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
