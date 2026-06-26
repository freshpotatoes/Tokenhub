/**
 * Supabase 浏览器端客户端
 * URL 和 anon key 是公开值,直接硬编码避免 Vercel 环境变量注入问题
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lbojcxapaabochuhrlkw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yXfq95nRHzykeY4Hy43PXA_puuS5UyE';

export function createBrowserClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
