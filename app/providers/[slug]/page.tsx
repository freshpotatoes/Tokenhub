/**
 * 中转站详情页
 *
 * 展示内容:
 * - 完整字段信息
 * - 价格变动历史(表格)
 * - 社群链接
 * - 信誉评分 + 跑路风险(突出展示)
 * - 免责声明
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProviderBySlug, getPriceHistory } from '@/lib/db';
import {
  MODEL_LABELS,
  PAYMENT_LABELS,
  BILLING_LABELS,
  SIGNUP_BARRIER_LABELS,
  COMMUNITY_LABELS,
  STATUS_LABELS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import ReputationScore from '@/components/ReputationScore';
import RunawayRiskTag from '@/components/RunawayRiskTag';
import Disclaimer from '@/components/Disclaimer';

export const revalidate = 3600; // 每小时从 Supabase 重新生成

// ===== 动态 Meta =====

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const provider = await getProviderBySlug(params.slug);
  if (!provider) return { title: '中转站不存在' };

  const modelList = provider.supported_models
    .slice(0, 5)
    .map((m) => MODEL_LABELS[m])
    .join('、');

  return {
    title: `${provider.name} — API 中转站详情`,
    description: `${provider.name}:${provider.description.slice(0, 120)}。支持模型:${modelList}。价格:官方价${provider.price_multiplier}x。状态:${STATUS_LABELS[provider.status]}`,
    robots: { index: true, follow: true },
  };
}

// ===== 页面组件 =====

export default async function ProviderDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const provider = await getProviderBySlug(params.slug);
  if (!provider) notFound();

  const priceHistory = await getPriceHistory(params.slug);

  // 首字母头像
  const firstChar = provider.name.charAt(0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* 返回链接 */}
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 no-underline hover:text-gray-700"
      >
        ← 返回列表
      </Link>

      {/* ---- 头部:Logo + 名称 + 状态 ---- */}
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
          {firstChar}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
          <div className="mt-1 flex items-center gap-3">
            <StatusBadge status={provider.status} />
            <a
              href={provider.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              访问站点 ↗
            </a>
          </div>
        </div>
      </div>

      {/* ---- 用途分类徽标 ---- */}
      {provider.categories && provider.categories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {provider.categories.map((cat) => (
            <span
              key={cat}
              className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_COLORS[cat]}`}
            >
              {CATEGORY_LABELS[cat]}
            </span>
          ))}
        </div>
      )}

      {/* ---- 描述 ---- */}
      <p className="mb-6 text-sm leading-relaxed text-gray-600">
        {provider.description}
      </p>

      {/* ---- 口碑 + 风险(突出展示) ---- */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="mb-1 text-xs text-gray-400">信誉评分</p>
          <ReputationScore score={provider.reputation_score} size="lg" />
          <p className="mt-1 text-[10px] text-gray-400">
            {provider.reputation_score >= 4
              ? '口碑良好,社区评价较高'
              : provider.reputation_score >= 2.5
              ? '评价一般,建议关注社区动态'
              : '评价较低,请谨慎使用'}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="mb-1 text-xs text-gray-400">跑路风险评估</p>
          <div className="mt-1 flex justify-center">
            <RunawayRiskTag risk={provider.runaway_risk} size="md" />
          </div>
          <p className="mt-1 text-[10px] text-gray-400">
            {provider.runaway_risk === 'low'
              ? '运营稳定,暂无跑路迹象'
              : provider.runaway_risk === 'medium'
              ? '建议保持关注,小额使用'
              : '高风险,不建议大额充值'}
          </p>
        </div>
      </div>

      {/* ---- 详细信息 ---- */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-900">基本信息</h2>
        </div>
        <div className="divide-y divide-gray-50 px-5 text-sm">
          <InfoRow label="上线时间" value={provider.founded_at} />
          <InfoRow
            label="价格倍率"
            value={`${provider.price_multiplier}x 官方价`}
            highlight
          />
          <InfoRow label="计费方式" value={BILLING_LABELS[provider.billing_type]} />
          <InfoRow
            label="免费额度"
            value={provider.has_free_quota ? '✅ 有' : '❌ 无'}
          />
          <InfoRow label="注册门槛" value={SIGNUP_BARRIER_LABELS[provider.signup_barrier]} />
          <InfoRow label="速率限制" value={provider.rate_limit_note || '未公开'} />
          <InfoRow
            label="并发限制"
            value={provider.concurrency_limit !== null ? `${provider.concurrency_limit} 并发` : '未公开'}
          />
        </div>
      </div>

      {/* ---- 模型支持 ---- */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-900">模型支持</h2>
        </div>
        <div className="px-5 py-3">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {provider.supported_models.map((model) => (
              <span
                key={model}
                className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
              >
                {MODEL_LABELS[model]}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
            <span>
              OpenAI 兼容:{' '}
              <span className={provider.openai_compatible ? 'text-green-600' : 'text-red-400'}>
                {provider.openai_compatible ? '✅ 是' : '❌ 否'}
              </span>
            </span>
            <span>
              Streaming:{' '}
              <span className={provider.supports_streaming ? 'text-green-600' : 'text-red-400'}>
                {provider.supports_streaming ? '✅ 支持' : '❌ 不支持'}
              </span>
            </span>
            <span>
              Function Call:{' '}
              <span className={provider.supports_function_call ? 'text-green-600' : 'text-red-400'}>
                {provider.supports_function_call ? '✅ 支持' : '❌ 不支持'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ---- 支付方式 ---- */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-900">支付方式</h2>
        </div>
        <div className="px-5 py-3">
          <div className="flex flex-wrap gap-1.5">
            {provider.payment_methods.map((pm) => (
              <span
                key={pm}
                className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              >
                {PAYMENT_LABELS[pm]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---- 社群链接 ---- */}
      {provider.community_links.length > 0 && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-3">
            <h2 className="text-sm font-semibold text-gray-900">社群链接</h2>
          </div>
          <div className="divide-y divide-gray-50 px-5 text-sm">
            {provider.community_links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2.5 text-blue-600 no-underline hover:underline"
              >
                <span className="text-gray-400">
                  {COMMUNITY_LABELS[link.type]}
                </span>
                <span>{link.label}</span>
                <span className="text-gray-300">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ---- 价格变动历史 ---- */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-900">
            价格变动历史
            <span className="ml-2 text-xs font-normal text-gray-400">
              (当前为模拟数据,接入 Supabase 后展示真实记录)
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto px-5 py-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-400">
                <th className="py-2 pr-4 font-medium">日期</th>
                <th className="py-2 pr-4 font-medium">模型</th>
                <th className="py-2 font-medium">倍率</th>
              </tr>
            </thead>
            <tbody>
              {priceHistory.slice(0, 18).map((record) => (
                <tr key={record.id} className="border-b border-gray-50">
                  <td className="py-2 pr-4 text-gray-500">{record.recorded_at}</td>
                  <td className="py-2 pr-4 text-gray-700">
                    {MODEL_LABELS[record.model]}
                  </td>
                  <td className="py-2">
                    <span
                      className={`font-semibold ${
                        record.price_multiplier <= provider.price_multiplier
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {record.price_multiplier}x
                    </span>
                  </td>
                </tr>
              ))}
              {priceHistory.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-400">
                    暂无价格历史记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- 最后检测时间 ---- */}
      <p className="mb-6 text-xs text-gray-400">
        最近检测时间:{provider.last_checked_at}
        <span className="mx-1">·</span>
        数据更新时间:{provider.updated_at}
      </p>

      {/* ---- 免责声明 ---- */}
      <Disclaimer compact />
    </div>
  );
}

// ---- 子组件 ----

function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-gray-500">{label}</span>
      <span className={highlight ? 'font-semibold text-gray-900' : 'text-gray-700'}>
        {value}
      </span>
    </div>
  );
}
