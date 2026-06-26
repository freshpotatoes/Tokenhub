/**
 * 管理后台 — 审核用户提交
 * 访问: /admin?secret=你在ADMIN_SECRET环境变量中设置的值
 *
 * 功能:
 * - 查看所有 submissions(pending/approved/rejected)
 * - 一键通过(pending → approved + 写入 providers)
 * - 一键拒绝(pending → rejected)
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import AdminPanel from './AdminPanel';

export const metadata: Metadata = {
  title: '管理后台',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24 text-gray-400">加载中...</div>}>
      <AdminPanel />
    </Suspense>
  );
}
