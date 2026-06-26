'use client';

import Link from 'next/link';
import { useCompare } from './CompareProvider';

/**
 * 底部浮动对比栏
 * 当用户勾选了至少 2 个中转站时显示
 */
export default function CompareFloatingBar() {
  const { slugs, clear } = useCompare();

  if (slugs.length < 2) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-white px-5 py-3 shadow-lg">
        <span className="text-sm font-medium text-gray-700">
          已选择 <span className="text-blue-600">{slugs.length}</span> 个中转站
        </span>

        <Link
          href={`/compare?slugs=${slugs.join(',')}`}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white no-underline hover:bg-blue-700"
        >
          开始对比
        </Link>

        <button
          onClick={clear}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          清除
        </button>
      </div>
    </div>
  );
}
