/**
 * Supabase 浏览器端客户端
 *
 * 使用 NEXT_PUBLIC_SUPABASE_ANON_KEY(Publishable key)认证,
 * 受 RLS 约束(仅可读公开表 + 提交 submissions)。
 *
 * 当前项目中浏览器端几乎不需要直连 Supabase —
 * 数据获取全部在服务端完成。仅保留此文件供未来扩展。
 */

import { createClient } from '@supabase/supabase-js';

/**
 * 创建浏览器端 Supabase 客户端
 * 使用 publishable key,可安全暴露在客户端
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      '缺少 Supabase 环境变量。请检查是否设置了:\n' +
      '  NEXT_PUBLIC_SUPABASE_URL\n' +
      '  NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  return createClient(supabaseUrl, supabaseKey);
}
