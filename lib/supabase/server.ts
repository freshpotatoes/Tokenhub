/**
 * Supabase 服务端客户端
 *
 * 使用 SERVICE_ROLE_KEY 认证,拥有最高权限(绕过 RLS),
 * 用于:数据写入、监控状态更新、审核等需要写权限的操作。
 *
 * ⚠️ 这个文件只能在服务端组件 / Route Handler / Server Action 中使用。
 * 前置守卫:import 'server-only' 确保构建时报错而非泄漏到客户端。
 */

import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * 创建具有 service_role 权限的 Supabase 客户端
 * SUPABASE_SERVICE_ROLE_KEY 不以 NEXT_PUBLIC_ 开头,不会暴露到浏览器
 */
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      '缺少 Supabase 环境变量。请检查 .env.local 是否设置了:\n' +
      '  NEXT_PUBLIC_SUPABASE_URL\n' +
      '  SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      // 服务端不需要用户认证,关闭 autoRefresh 减少请求
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** 单例缓存 — 避免每次请求都 new 一个 client */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _cached: any;

export function getServerClient() {
  if (!_cached) {
    _cached = createServerClient();
  }
  return _cached as ReturnType<typeof createClient>;
}
