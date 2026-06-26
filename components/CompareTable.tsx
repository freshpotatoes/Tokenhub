'use client';

import Link from 'next/link';
import {
  type Provider,
  MODEL_LABELS,
  PAYMENT_LABELS,
  BILLING_LABELS,
  SIGNUP_BARRIER_LABELS,
} from '@/lib/types';
import StatusBadge from './StatusBadge';
import ReputationScore from './ReputationScore';
import RunawayRiskTag from './RunawayRiskTag';

interface CompareTableProps {
  providers: Provider[];
}

/**
 * 横向对比表格
 *
 * 布局:属性作为行,中转站作为列
 * 移动端:水平滚动
 *
 * 每行对比一个维度:
 * 状态 | 价格倍率 | 计费方式 | 支持模型 | API兼容 | Streaming | FunctionCall
 * 限额 | 支付方式 | 注册门槛 | 免费额度 | 信誉 | 跑路风险 | 上线时间
 */
export default function CompareTable({ providers }: CompareTableProps) {
  if (providers.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        请选择至少一个中转站进行对比
      </div>
    );
  }

  // 定义对比行
  const rows: { label: string; render: (p: Provider) => React.ReactNode }[] = [
    {
      label: '运营状态',
      render: (p) => <StatusBadge status={p.status} />,
    },
    {
      label: '价格倍率',
      render: (p) => (
        <span className="font-semibold">{p.price_multiplier}x <span className="font-normal text-gray-400">官方价</span></span>
      ),
    },
    {
      label: '计费方式',
      render: (p) => BILLING_LABELS[p.billing_type],
    },
    {
      label: '支持模型',
      render: (p) => (
        <div className="flex flex-wrap gap-0.5">
          {p.supported_models.map((m) => (
            <span key={m} className="rounded bg-gray-100 px-1 py-0.5 text-[10px] text-gray-600">
              {MODEL_LABELS[m]}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: 'OpenAI 兼容',
      render: (p) => <BoolBadge value={p.openai_compatible} />,
    },
    {
      label: 'Streaming',
      render: (p) => <BoolBadge value={p.supports_streaming} />,
    },
    {
      label: 'Function Call',
      render: (p) => <BoolBadge value={p.supports_function_call} />,
    },
    {
      label: '速率限制',
      render: (p) => <span className="text-xs">{p.rate_limit_note || '未公开'}</span>,
    },
    {
      label: '并发限制',
      render: (p) => (
        <span className="text-xs">
          {p.concurrency_limit !== null ? `${p.concurrency_limit} 并发` : '未公开'}
        </span>
      ),
    },
    {
      label: '支付方式',
      render: (p) => (
        <div className="flex flex-wrap gap-0.5">
          {p.payment_methods.map((pm) => (
            <span key={pm} className="rounded bg-gray-100 px-1 py-0.5 text-[10px] text-gray-600">
              {PAYMENT_LABELS[pm]}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: '注册门槛',
      render: (p) => (
        <span
          className={`text-xs font-medium ${
            p.signup_barrier === 'low'
              ? 'text-green-600'
              : p.signup_barrier === 'medium'
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}
        >
          {SIGNUP_BARRIER_LABELS[p.signup_barrier]}
        </span>
      ),
    },
    {
      label: '免费额度',
      render: (p) => <BoolBadge value={p.has_free_quota} trueLabel="有" falseLabel="无" />,
    },
    {
      label: '信誉评分',
      render: (p) => <ReputationScore score={p.reputation_score} />,
    },
    {
      label: '跑路风险',
      render: (p) => <RunawayRiskTag risk={p.runaway_risk} size="sm" />,
    },
    {
      label: '上线时间',
      render: (p) => <span className="text-xs">{p.founded_at}</span>,
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[600px] text-sm">
        {/* 表头:中转站名称 */}
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-500">
              对比维度
            </th>
            {providers.map((p) => (
              <th key={p.id} className="px-4 py-3 text-center">
                <Link
                  href={`/providers/${p.slug}`}
                  className="font-semibold text-gray-900 no-underline hover:text-blue-600"
                >
                  {p.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>

        {/* 表体:逐行对比 */}
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className={`border-b border-gray-100 ${
                i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
              }`}
            >
              <td className="sticky left-0 z-10 bg-inherit px-4 py-2.5 text-xs font-medium text-gray-500">
                {row.label}
              </td>
              {providers.map((p) => (
                <td key={p.id} className="px-4 py-2.5 text-center text-xs text-gray-700">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 布尔值徽标 */
function BoolBadge({
  value,
  trueLabel = '✅',
  falseLabel = '❌',
}: {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}) {
  return (
    <span className={`text-xs font-medium ${value ? 'text-green-600' : 'text-red-400'}`}>
      {value ? trueLabel : falseLabel}
    </span>
  );
}
