/**
 * 用途分类聚合页
 *
 * 路由: /category/[slug]
 * 例如 /category/image_gen → 展示所有"文生图"类中转站
 *
 * 继承首页的 ProviderCard 组件,筛选条件固定为该分类。
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProviders } from '@/lib/db';
import { CATEGORY_LABELS, type CategoryType } from '@/lib/types';
import ProviderCard from '@/components/ProviderCard';

/** 所有合法的分类 slug 用于 404 保护 */
const VALID_CATEGORIES: CategoryType[] = [
  'chat', 'coding', 'image_gen', 'video_gen',
  'image_understanding', 'audio_tts', 'audio_asr', 'embedding', 'rerank',
];

export const revalidate = 0; // 每次请求实时数据

// ===== 动态 Meta =====

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const slug = params.slug;
  if (!VALID_CATEGORIES.includes(slug as CategoryType)) {
    return { title: '分类不存在' };
  }

  const label = CATEGORY_LABELS[slug as CategoryType];
  const descriptions: Record<string, string> = {
    chat: '聚合支持 AI 对话/聊天功能的中转站,包括 OpenAI、Claude、Gemini、国产大模型等。',
    coding: '聚合支持代码生成与编程辅助的 API 中转站,适合开发者工具集成。',
    image_gen: '聚合支持文生图功能的中转站,覆盖 DALL-E、Stable Diffusion 等模型。',
    video_gen: '聚合支持文生视频功能的中转站,覆盖 Sora、Runway 等视频生成模型。',
    image_understanding: '聚合支持图片理解/识别功能的中转站,支持 GPT-4V 等多模态视觉模型。',
    audio_tts: '聚合支持语音合成(TTS)功能的中转站,文本转语音服务。',
    audio_asr: '聚合支持语音识别(ASR)功能的中转站,语音转文本服务。',
    embedding: '聚合支持文本向量/Embedding 的中转站,适合 RAG 和语义搜索场景。',
    rerank: '聚合支持重排序/Rerank 的中转站,提升搜索和检索结果的相关性。',
  };

  return {
    title: `${label} API 中转站 — 按用途分类`,
    description: descriptions[slug] || `浏览所有支持${label}功能的API中转站,对比价格、口碑、运营状态。`,
    robots: { index: true, follow: true },
  };
}

// ===== 页面组件 =====

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

  // 非法 slug → 404
  if (!VALID_CATEGORIES.includes(slug as CategoryType)) {
    notFound();
  }

  const category = slug as CategoryType;
  const label = CATEGORY_LABELS[category];

  // 从全量数据中筛选出包含该分类的中转站
  const allProviders = await getAllProviders();
  const filtered = allProviders.filter(
    (p) => p.categories && p.categories.includes(category)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* 面包屑 */}
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="no-underline hover:text-gray-700">
          首页
        </Link>
        <span>/</span>
        <span className="text-gray-900">{label}</span>
      </div>

      {/* 标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {label} 中转站
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          共 {filtered.length} 个支持{label}功能的中转站
        </p>
      </div>

      {/* 站点卡片网格 */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-400">暂无该分类的中转站</p>
          <Link
            href="/"
            className="mt-2 inline-block text-sm text-blue-600 no-underline hover:underline"
          >
            返回首页浏览全部
          </Link>
        </div>
      )}

      {/* 返回链接 */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-blue-600 no-underline hover:underline"
        >
          ← 返回全部站点列表
        </Link>
      </div>
    </div>
  );
}
