/**
 * Supabase 服务端客户端
 * URL 硬编码(公开值),service_role key 从环境变量读取(机密,仅服务端)
 */

import 'server-only';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lbojcxapaabochuhrlkw.supabase.co';

export function createServerClient() {
  const supabaseKey = process.env.TOKENHUB_SERVICE_KEY;
  if (!supabaseKey) {
    throw new Error('缺少 TOKENHUB_SERVICE_KEY 环境变量');
  }
  return createClient(SUPABASE_URL, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

let _cached: any;
export function getServerClient() {
  if (!_cached) _cached = createServerClient();
  return _cached as ReturnType<typeof createClient>;
}
