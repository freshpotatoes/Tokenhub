'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

interface Submission {
  id: string;
  name: string;
  website_url: string;
  submitter_note: string;
  suggested_models: string[];
  suggested_price_multiplier: number | null;
  contact_email: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminPanel() {
  const searchParams = useSearchParams();
  const urlSecret = searchParams.get('secret') || '';

  const [secret, setSecret] = useState(urlSecret);
  const [authenticated, setAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 首次加载时尝试验证
  useEffect(() => {
    if (urlSecret) {
      setSecret(urlSecret);
      fetchSubmissions(urlSecret);
    }
  }, [urlSecret]);

  const fetchSubmissions = async (s: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?secret=${encodeURIComponent(s)}`);
      if (res.status === 401) {
        setAuthenticated(false);
        setMessage('密钥不正确');
      } else if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
        setAuthenticated(true);
        setMessage('');
      }
    } catch {
      setMessage('网络错误');
    }
    setLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubmissions(secret);
  };

  const handleAction = useCallback(
    async (action: 'approve' | 'reject', submissionId: string) => {
      setMessage('');
      try {
        const res = await fetch(
          `/api/admin/${action}?secret=${encodeURIComponent(secret)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ submissionId }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          setMessage(`✅ ${action === 'approve' ? '通过' : '拒绝'}成功`);
          fetchSubmissions(secret);
        } else {
          setMessage(`❌ ${data.error || '操作失败'}`);
        }
      } catch {
        setMessage('网络错误');
      }
    },
    [secret]
  );

  // ---- 未认证:显示密钥输入框 ----
  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-24">
        <h1 className="mb-6 text-center text-xl font-bold">管理后台</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="请输入管理密钥"
            className="w-full rounded-lg border px-4 py-2 text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            验证
          </button>
          {message && (
            <p className="text-center text-sm text-red-500">{message}</p>
          )}
        </form>
      </div>
    );
  }

  // ---- 已认证:显示审核列表 ----
  const pending = submissions.filter((s) => s.status === 'pending');
  const processed = submissions.filter((s) => s.status !== 'pending');

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">管理后台 — 审核中心</h1>
        <span className="text-sm text-gray-400">
          待审核 {pending.length} / 共 {submissions.length}
        </span>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-2 text-sm ${
            message.startsWith('✅')
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {message}
        </div>
      )}

      {/* 待审核 */}
      <h2 className="mb-3 text-sm font-semibold text-orange-600">
        ⏳ 待审核 ({pending.length})
      </h2>
      {pending.length === 0 ? (
        <p className="mb-6 text-sm text-gray-400">暂无待审核提交</p>
      ) : (
        <div className="mb-8 space-y-3">
          {pending.map((sub) => (
            <div
              key={sub.id}
              className="rounded-lg border border-orange-200 bg-orange-50/50 p-4"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{sub.name}</h3>
                  <a
                    href={sub.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {sub.website_url}
                  </a>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(sub.created_at).toLocaleDateString('zh-CN')}
                </span>
              </div>

              {sub.submitter_note && (
                <p className="mb-2 text-sm text-gray-600">{sub.submitter_note}</p>
              )}

              <div className="mb-3 flex flex-wrap gap-1">
                {sub.suggested_models?.map((m) => (
                  <span
                    key={m}
                    className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500"
                  >
                    {m}
                  </span>
                ))}
                {sub.suggested_price_multiplier && (
                  <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-600">
                    {sub.suggested_price_multiplier}x
                  </span>
                )}
                {sub.contact_email && (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                    {sub.contact_email}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleAction('approve', sub.id)}
                  className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                >
                  通过
                </button>
                <button
                  onClick={() => handleAction('reject', sub.id)}
                  className="rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
                >
                  拒绝
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 已处理 */}
      <h2 className="mb-3 text-sm font-semibold text-gray-500">
        📋 已处理 ({processed.length})
      </h2>
      {processed.length === 0 ? (
        <p className="text-sm text-gray-400">暂无已处理记录</p>
      ) : (
        <div className="space-y-2">
          {processed.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between rounded border border-gray-200 px-4 py-2"
            >
              <div>
                <span className="text-sm font-medium text-gray-700">
                  {sub.name}
                </span>
                <span className="ml-2 text-xs text-gray-400">
                  {sub.website_url}
                </span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  sub.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {sub.status === 'approved' ? '已通过' : '已拒绝'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 刷新 */}
      <button
        onClick={() => fetchSubmissions(secret)}
        disabled={loading}
        className="mt-6 rounded-lg border border-gray-300 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? '加载中...' : '刷新列表'}
      </button>
    </div>
  );
}
