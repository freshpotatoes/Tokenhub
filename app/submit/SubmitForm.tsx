'use client';

import { useState } from 'react';
import { MODEL_LABELS, type ModelFamily } from '@/lib/types';

/**
 * 中转站信息提交表单(客户端组件)
 *
 * 当前 MVP 阶段:
 * - 提交后将数据存入 localStorage(模拟草稿表)
 * - 同时发送 POST 到 /api/submit
 *
 * TODO: 接入 Supabase 后改为直接写入 drafts 表
 */

export default function SubmitForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    // 收集选中的模型
    const selectedModels: ModelFamily[] = [];
    form.querySelectorAll<HTMLInputElement>('input[name="models"]:checked').forEach((el) => {
      selectedModels.push(el.value as ModelFamily);
    });

    const payload = {
      name: formData.get('name') as string,
      website_url: formData.get('website_url') as string,
      suggested_models: selectedModels,
      suggested_price_multiplier: formData.get('price_multiplier')
        ? parseFloat(formData.get('price_multiplier') as string)
        : undefined,
      submitter_note: formData.get('note') as string,
      contact_email: formData.get('contact_email') as string || undefined,
    };

    // 基础校验
    if (!payload.name.trim()) {
      setError('请填写中转站名称');
      setSubmitting(false);
      return;
    }
    if (!payload.website_url.trim()) {
      setError('请填写网站地址');
      setSubmitting(false);
      return;
    }

    try {
      // 1. 存入 localStorage(本地草稿)
      const drafts = JSON.parse(localStorage.getItem('tokenhub-drafts') || '[]');
      drafts.push({
        ...payload,
        id: `draft_${Date.now()}`,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('tokenhub-drafts', JSON.stringify(drafts));

      // 2. 发送到 API route(部署后接入 Supabase)
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn('API 提交失败,已存入本地草稿:', await res.text());
      }

      setSubmitted(true);
      form.reset();
    } catch (err) {
      console.error('提交失败:', err);
      setError('提交失败,请稍后重试。数据已保存在本地。');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <p className="text-3xl">✅</p>
        <p className="mt-2 text-lg font-semibold text-gray-900">提交成功!</p>
        <p className="mt-1 text-sm text-gray-500">
          感谢您的贡献。我们将在 1-3 个工作日内完成审核。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 名称 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          中转站名称 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="例如:OpenRouter China"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* 网站地址 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          网站地址 <span className="text-red-400">*</span>
        </label>
        <input
          type="url"
          name="website_url"
          required
          placeholder="https://example.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* 支持模型 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          支持模型(可多选)
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(MODEL_LABELS) as [ModelFamily, string][]).map(([key, label]) => (
            <label
              key={key}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs hover:border-blue-300 has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700"
            >
              <input
                type="checkbox"
                name="models"
                value={key}
                className="h-3 w-3 accent-blue-600"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* 价格倍率 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          价格倍率(选填)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            name="price_multiplier"
            step="0.01"
            min="0.1"
            max="5"
            placeholder="例如:0.65"
            className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <span className="text-xs text-gray-400">倍官方价(1.0 = 与官方同价)</span>
        </div>
      </div>

      {/* 备注 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          补充说明(选填)
        </label>
        <textarea
          name="note"
          rows={3}
          placeholder="请描述该中转站的特点:支持哪些 API 格式、支付方式、注册门槛、免费额度等..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
        />
      </div>

      {/* 联系方式 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          您的联系方式(选填,用于审核沟通)
        </label>
        <input
          type="email"
          name="contact_email"
          placeholder="your@email.com"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? '提交中...' : '提交信息'}
      </button>

      <p className="text-center text-xs text-gray-400">
        提交即表示您同意我们将此信息公开在平台上
      </p>
    </form>
  );
}
