/**
 * 横向对比页
 *
 * URL 驱动: /compare?slugs=openrouter-china,apihub,oneapi-cloud
 * 支持两种进入方式:
 * 1. 从列表页勾选 → 浮动栏点击「开始对比」→ 带 slugs 参数跳转
 * 2. 直接访问 /compare → 展示空状态,引导用户回列表页勾选
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { getProviderBySlug } from '@/lib/db';
import CompareTable from '@/components/CompareTable';
import Disclaimer from '@/components/Disclaimer';

export const metadata: Metadata = {
  title: '横向对比 — API 中转站',
  description:
    '选择多个 API 中转站进行横向对比:价格、模型支持、支付方式、信誉评分、跑路风险等维度一目了然。',
  robots: { index: true, follow: true },
};

interface ComparePageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function ComparePage({ searchParams }: ComparePageProps) {
  // 从 URL 读取要对比的 slug 列表
  const slugsParam = searchParams.slugs;
  const slugs =
    typeof slugsParam === 'string'
      ? slugsParam.split(',').filter(Boolean)
      : [];

  const providers = slugs
    .map((slug) => getProviderBySlug(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProviderBySlug>>[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">横向对比</h1>
        <p className="mt-1 text-sm text-gray-500">
          {providers.length > 0
            ? `正在对比 ${providers.length} 个中转站`
            : '请先从列表页勾选需要对比的中转站'}
        </p>
      </div>

      {/* 对比表格 */}
      {providers.length > 0 ? (
        <>
          <CompareTable providers={providers} />

          {/* 返回继续选择 */}
          <div className="mt-6 flex items-center justify-between">
            <Link
              href="/"
              className="text-sm text-blue-600 no-underline hover:underline"
            >
              ← 返回列表继续选择
            </Link>

            {/* 重新选择提示 */}
            <span className="text-xs text-gray-400">
              可直接修改 URL 中的 slugs 参数来调整对比列表
            </span>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-4xl">📊</p>
          <p className="mt-3 text-gray-500">尚未选择中转站</p>
          <p className="mt-1 text-sm text-gray-400">
            请前往列表页,勾选 2-5 个中转站后点击「开始对比」
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white no-underline hover:bg-blue-700"
          >
            前往列表页
          </Link>
        </div>
      )}

      {/* 免责声明 */}
      <div className="mt-8">
        <Disclaimer compact />
      </div>
    </div>
  );
}
