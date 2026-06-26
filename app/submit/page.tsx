/**
 * 数据提交页
 *
 * 用户可以提交新的中转站信息。
 * 提交后存入 drafts 表(当前用 localStorage 模拟),
 * 状态为 pending,等待人工审核后转为正式条目。
 */

import { Metadata } from 'next';
import SubmitForm from './SubmitForm';
import Disclaimer from '@/components/Disclaimer';

export const metadata: Metadata = {
  title: '提交中转站信息',
  description: '发现新的 API 中转站？提交信息帮助我们完善数据库。提交的内容将经过人工审核后发布。',
  robots: { index: true, follow: true },
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900">提交中转站信息</h1>
      <p className="mt-1 text-sm text-gray-500">
        发现新的 API 中转站？填写以下表单提交信息。
        提交后将进入审核队列,审核通过后会出现在列表中。
      </p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <SubmitForm />
      </div>

      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-xs text-blue-800">
          💡 <span className="font-semibold">提示:</span>{' '}
          请尽量填写完整信息。提交后一般 1-3 个工作日内完成审核。
          如有疑问,可通过审核通知中的联系方式与我们沟通。
        </p>
      </div>

      <div className="mt-6">
        <Disclaimer compact />
      </div>
    </div>
  );
}
