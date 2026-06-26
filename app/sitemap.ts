/**
 * Sitemap 生成
 *
 * Next.js App Router 约定:
 * 导出默认函数即可自动生成 /sitemap.xml
 *
 * 包含:
 * - 首页(最高优先级)
 * - 每个中转站详情页
 * - 每个用途分类聚合页
 * - 对比页(较低优先级)
 * - 提交页
 */

import { MetadataRoute } from 'next';
import { getAllProviders } from '@/lib/db';
import { CATEGORY_LABELS, type CategoryType } from '@/lib/types';

/** 所有合法的分类 slug,用于生成分类页 sitemap */
const ALL_CATEGORIES: CategoryType[] = [
  'chat', 'coding', 'image_gen', 'video_gen',
  'image_understanding', 'audio_tts', 'audio_asr', 'embedding', 'rerank',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hubsoftoken.vercel.app';

  const providers = await getAllProviders();

  const providerPages: MetadataRoute.Sitemap = providers.map((p) => ({
    url: `${baseUrl}/providers/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 用途分类聚合页
  const categoryPages: MetadataRoute.Sitemap = ALL_CATEGORIES.map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...categoryPages,
    ...providerPages,
  ];
}
