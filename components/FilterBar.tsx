'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import {
  MODEL_LABELS,
  PAYMENT_LABELS,
  BILLING_LABELS,
  STATUS_LABELS,
  SIGNUP_BARRIER_LABELS,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type ModelFamily,
  type ProviderStatus,
  type BillingType,
  type PaymentMethod,
  type SignupBarrier,
  type CategoryType,
} from '@/lib/types';

/**
 * 筛选栏组件
 *
 * 交互模式:用户勾选/输入 → 更新 URL searchParams → 服务端根据 URL 筛选数据
 * 这样筛选结果可以被分享和收藏。
 */
export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 从 URL 读取当前筛选状态
  const currentStatus = searchParams.get('status')?.split(',').filter(Boolean) ?? [];
  const currentModels = searchParams.get('models')?.split(',').filter(Boolean) ?? [];
  const currentBilling = searchParams.get('billing')?.split(',').filter(Boolean) ?? [];
  const currentPayment = searchParams.get('payment')?.split(',').filter(Boolean) ?? [];
  const currentBarrier = searchParams.get('signupBarrier') ?? '';
  const currentFreeQuota = searchParams.get('hasFreeQuota') ?? '';
  const currentSearch = searchParams.get('search') ?? '';
  const currentSort = searchParams.get('sort') ?? '';
  const currentCategories = searchParams.get('categories')?.split(',').filter(Boolean) ?? [];

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [expanded, setExpanded] = useState(false);

  // 更新 URL 参数的通用方法
  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // 重置页码(如果有分页)
      params.delete('page');
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // 多选切换(追加/移除)
  const toggleMulti = useCallback(
    (key: string, value: string) => {
      const current = searchParams.get(key)?.split(',').filter(Boolean) ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      updateParams(key, next.join(','));
    },
    [searchParams, updateParams]
  );

  // 搜索提交(防抖由用户手动触发)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams('search', searchInput.trim());
  };

  // 重置所有筛选
  const resetAll = () => {
    setSearchInput('');
    router.push('/', { scroll: false });
  };

  const hasActiveFilters =
    currentStatus.length > 0 ||
    currentModels.length > 0 ||
    currentCategories.length > 0 ||
    currentBilling.length > 0 ||
    currentPayment.length > 0 ||
    currentBarrier ||
    currentFreeQuota ||
    currentSearch ||
    currentSort;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* ---- 搜索 + 排序 ---- */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="搜索名称、分类、模型、支付方式..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            搜索
          </button>
        </form>

        <select
          value={currentSort}
          onChange={(e) => updateParams('sort', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-400 focus:outline-none"
        >
          <option value="">默认排序(信誉↓)</option>
          <option value="price_asc">价格:低 → 高</option>
          <option value="price_desc">价格:高 → 低</option>
          <option value="reputation_desc">信誉:高 → 低</option>
          <option value="founded_desc">上线时间:新 → 旧</option>
          <option value="name_asc">名称:A → Z</option>
        </select>
      </div>

      {/* ---- 展开/收起 ---- */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
      >
        {expanded ? '收起筛选' : '展开筛选'}
        <svg
          className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="mt-3 space-y-4 border-t border-gray-100 pt-3">
          {/* ---- 状态 ---- */}
          <FilterGroup label="运营状态">
            {(Object.entries(STATUS_LABELS) as [ProviderStatus, string][]).map(([key, label]) => (
              <FilterChip
                key={key}
                label={label}
                active={currentStatus.includes(key)}
                onClick={() => toggleMulti('status', key)}
              />
            ))}
          </FilterGroup>

          {/* ---- 用途分类 ---- */}
          {/* 分类使用其专属颜色显示,不同分类不同色,方便用户快速识别 */}
          <FilterGroup label="用途分类">
            {(Object.entries(CATEGORY_LABELS) as [CategoryType, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => toggleMulti('categories', key)}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
                  currentCategories.includes(key)
                    ? `${CATEGORY_COLORS[key]} border-current/30 ring-1 ring-current/20`
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </FilterGroup>

          {/* ---- 模型 ---- */}
          <FilterGroup label="支持模型">
            {(Object.entries(MODEL_LABELS) as [ModelFamily, string][]).map(([key, label]) => (
              <FilterChip
                key={key}
                label={label}
                active={currentModels.includes(key)}
                onClick={() => toggleMulti('models', key)}
              />
            ))}
          </FilterGroup>

          {/* ---- 计费方式 ---- */}
          <FilterGroup label="计费方式">
            {(Object.entries(BILLING_LABELS) as [BillingType, string][]).map(([key, label]) => (
              <FilterChip
                key={key}
                label={label}
                active={currentBilling.includes(key)}
                onClick={() => toggleMulti('billing', key)}
              />
            ))}
          </FilterGroup>

          {/* ---- 支付方式 ---- */}
          <FilterGroup label="支付方式">
            {(Object.entries(PAYMENT_LABELS) as [PaymentMethod, string][]).map(([key, label]) => (
              <FilterChip
                key={key}
                label={label}
                active={currentPayment.includes(key)}
                onClick={() => toggleMulti('payment', key)}
              />
            ))}
          </FilterGroup>

          {/* ---- 注册门槛 ---- */}
          <FilterGroup label="注册门槛">
            {(Object.entries(SIGNUP_BARRIER_LABELS) as [SignupBarrier, string][]).map(
              ([key, label]) => (
                <FilterChip
                  key={key}
                  label={label}
                  active={currentBarrier === key}
                  onClick={() =>
                    updateParams('signupBarrier', currentBarrier === key ? '' : key)
                  }
                />
              )
            )}
          </FilterGroup>

          {/* ---- 免费额度 ---- */}
          <FilterGroup label="免费额度">
            <FilterChip
              label="有免费额度"
              active={currentFreeQuota === 'true'}
              onClick={() =>
                updateParams('hasFreeQuota', currentFreeQuota === 'true' ? '' : 'true')
              }
            />
            <FilterChip
              label="无免费额度"
              active={currentFreeQuota === 'false'}
              onClick={() =>
                updateParams('hasFreeQuota', currentFreeQuota === 'false' ? '' : 'false')
              }
            />
          </FilterGroup>

          {/* ---- 重置 ---- */}
          {hasActiveFilters && (
            <button
              onClick={resetAll}
              className="text-xs font-medium text-red-500 hover:text-red-600"
            >
              清除所有筛选
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---- 子组件 ----

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-medium text-gray-400">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? 'border-blue-400 bg-blue-50 text-blue-700'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
