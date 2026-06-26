'use client';

import Link from 'next/link';
import { Provider, MODEL_LABELS, PAYMENT_LABELS, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types';
import StatusBadge from './StatusBadge';
import ReputationScore from './ReputationScore';
import RunawayRiskTag from './RunawayRiskTag';
import { useCompare } from './CompareProvider';

interface ProviderCardProps {
  provider: Provider;
}

/**
 * 中转站卡片
 * 展示关键信息:状态、名称、模型标签、价格、支付方式、口碑
 */
export default function ProviderCard({ provider }: ProviderCardProps) {
  const { isSelected, toggle } = useCompare();
  const selected = isSelected(provider.slug);

  // 首字母头像(fallback)
  const firstChar = provider.name.charAt(0);

  return (
    <div
      className={`group relative rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
        selected ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'
      }`}
    >
      {/* ---- 对比勾选框 ---- */}
      <div className="absolute right-3 top-3">
        <button
          onClick={() => toggle(provider.slug)}
          className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-colors ${
            selected
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-gray-300 bg-white hover:border-blue-300'
          }`}
          aria-label={selected ? `取消对比 ${provider.name}` : `选择对比 ${provider.name}`}
        >
          {selected && (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
      </div>

      {/* ---- 顶部:Logo + 名称 + 状态 ---- */}
      <div className="mb-3 flex items-start gap-3 pr-8">
        {/* Logo / 首字母头像 */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
          {firstChar}
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href={`/providers/${provider.slug}`}
            className="font-semibold text-gray-900 no-underline hover:text-blue-600"
          >
            {provider.name}
          </Link>
          <div className="mt-0.5">
            <StatusBadge status={provider.status} size="sm" />
          </div>
        </div>
      </div>

      {/* ---- 描述(截断) ---- */}
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-gray-500">
        {provider.description}
      </p>

      {/* ---- 模型标签 ---- */}
      <div className="mb-3 flex flex-wrap gap-1">
        {provider.supported_models.slice(0, 5).map((model) => (
          <span
            key={model}
            className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600"
          >
            {MODEL_LABELS[model]}
          </span>
        ))}
        {provider.supported_models.length > 5 && (
          <span className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-400">
            +{provider.supported_models.length - 5}
          </span>
        )}
      </div>

      {/* ---- 用途分类徽标 ---- */}
      {/* 每种分类用专属颜色显示,方便快速识别站点用途 */}
      {provider.categories && provider.categories.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1">
          {provider.categories.slice(0, 4).map((cat) => (
            <span
              key={cat}
              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[cat]}`}
            >
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
          {provider.categories.length > 4 && (
            <span className="inline-block rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-400">
              +{provider.categories.length - 4}
            </span>
          )}
        </div>
      )}

      {/* ---- 关键指标行 ---- */}
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
        {/* 价格倍率 */}
        <span className="inline-flex items-center gap-1">
          <span className="text-gray-400">💰</span>
          <span className="font-semibold text-gray-900">
            {provider.price_multiplier}x
          </span>
          <span className="text-gray-400">官方价</span>
        </span>

        {/* 支付方式 */}
        <span className="inline-flex items-center gap-1">
          <span className="text-gray-400">💳</span>
          {provider.payment_methods.slice(0, 3).map((pm) => (
            <span key={pm} className="text-gray-500">{PAYMENT_LABELS[pm]}</span>
          ))}
        </span>

        {/* 免费额度 */}
        {provider.has_free_quota && (
          <span className="inline-flex items-center gap-1 rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
            🎁 免费额度
          </span>
        )}
      </div>

      {/* ---- 底部:口碑 + 风险 ---- */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <ReputationScore score={provider.reputation_score} size="sm" />
        <RunawayRiskTag risk={provider.runaway_risk} size="sm" />
      </div>
    </div>
  );
}
