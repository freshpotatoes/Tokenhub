/**
 * 首页:中转站列表
 *
 * 架构:
 * - 服务端组件:读取 URL searchParams → 筛选数据 → 渲染卡片
 * - 客户端组件(FilterBar):读取/更新 URL 参数实现筛选
 *
 * 这样筛选结果可以被分享 URL、被搜索引擎索引。
 */

export const revalidate = 0; // 每次请求实时数据

import { getAllProviders } from '@/lib/db';
import { filterProviders, parseSearchParams } from '@/lib/filters';
import FilterBar from '@/components/FilterBar';
import ProviderCard from '@/components/ProviderCard';
import CompareFloatingBar from '@/components/CompareFloatingBar';

interface HomePageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const allProviders = await getAllProviders();
  const filterParams = parseSearchParams(searchParams);
  const filteredProviders = filterProviders(allProviders, filterParams);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">API 中转站列表</h1>
        <p className="mt-1 text-sm text-gray-500">
          共 {filteredProviders.length} / {allProviders.length} 个站点
          {filterParams.search && (
            <span>
              ,搜索「<span className="text-gray-700">{filterParams.search}</span>」
            </span>
          )}
        </p>
      </div>

      {/* 筛选栏(客户端组件) */}
      <div className="mb-6">
        <FilterBar />
      </div>

      {/* 卡片网格 */}
      {filteredProviders.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-gray-400">没有匹配的中转站</p>
          <p className="mt-1 text-sm text-gray-400">
            尝试调整筛选条件或搜索关键词
          </p>
        </div>
      )}

      {/* 浮动对比栏(客户端组件) */}
      <CompareFloatingBar />
    </div>
  );
}
