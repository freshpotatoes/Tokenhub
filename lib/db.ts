/**
 * 数据读取层
 *
 * 优先从 Supabase 读取数据;Supabase 未配置或查询失败时,
 * 自动回退到本地 data/providers.json (mock 数据兜底)。
 *
 * 安全分层:
 * - 读操作(provider 列表/详情/价格历史) → 使用 anon key(受 RLS 约束)
 * - 写操作(submissions 插入/监控状态更新) → 使用 service_role key
 *
 * 切换方式:
 *   在 .env.local 中设置 NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   即自动走 Supabase;缺少即回退 mock。
 */

import { Provider, PriceHistoryRecord } from './types';
import { getServerClient } from './supabase/server';
import { createBrowserClient } from './supabase/client';
import providersData from '@/data/providers.json';

// ===== 兜底判断 =====

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** 获取用于只读查询的 anon 客户端 */
function getAnonClient() {
  return createBrowserClient();
}

// ===== Provider 查询(使用 anon key,受 RLS 保护) =====

export async function getAllProviders(): Promise<Provider[]> {
  if (!isSupabaseConfigured()) {
    return providersData as Provider[];
  }

  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .order('reputation_score', { ascending: false });

    if (error) {
      console.error('[db] getAllProviders 查询失败:', error.message);
      return providersData as Provider[];
    }

    return data as Provider[];
  } catch (err) {
    console.error('[db] Supabase 连接异常,回退 mock:', String(err));
    return providersData as Provider[];
  }
}

export async function getProviderBySlug(
  slug: string
): Promise<Provider | undefined> {
  if (!isSupabaseConfigured()) {
    return (providersData as Provider[]).find((p) => p.slug === slug);
  }

  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`[db] getProviderBySlug("${slug}") 查询失败:`, error.message);
      return (providersData as Provider[]).find((p) => p.slug === slug);
    }

    return data as Provider;
  } catch (err) {
    console.error('[db] Supabase 连接异常,回退 mock:', String(err));
    return (providersData as Provider[]).find((p) => p.slug === slug);
  }
}

export async function getProviderSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return (providersData as Provider[]).map((p) => p.slug);
  }

  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase.from('providers').select('slug');

    if (error) {
      console.error('[db] getProviderSlugs 查询失败:', error.message);
      return (providersData as Provider[]).map((p) => p.slug);
    }

    return (data as { slug: string }[]).map((row) => row.slug);
  } catch (err) {
    console.error('[db] Supabase 连接异常,回退 mock:', String(err));
    return (providersData as Provider[]).map((p) => p.slug);
  }
}

// ===== 价格历史查询(使用 anon key) =====

export async function getPriceHistory(
  slug: string
): Promise<PriceHistoryRecord[]> {
  if (!isSupabaseConfigured()) {
    const provider = (providersData as Provider[]).find((p) => p.slug === slug);
    if (!provider) return [];
    return generateMockPriceHistory(provider);
  }

  try {
    const provider = await getProviderBySlug(slug);
    if (!provider) return [];

    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('provider_id', provider.id)
      .order('recorded_at', { ascending: false });

    if (error) {
      console.error('[db] getPriceHistory 查询失败:', error.message);
      return generateMockPriceHistory(provider);
    }

    return (data || []) as PriceHistoryRecord[];
  } catch (err) {
    console.error('[db] Supabase 连接异常,回退 mock:', String(err));
    const provider = (providersData as Provider[]).find((p) => p.slug === slug);
    if (!provider) return [];
    return generateMockPriceHistory(provider);
  }
}

// ===== 用户提交(使用 service_role key,绕过 RLS 写入) =====

export interface SubmitPayload {
  name: string;
  website_url: string;
  suggested_models: string[];
  suggested_price_multiplier?: number;
  submitter_note: string;
  contact_email?: string;
}

export async function insertSubmission(
  payload: SubmitPayload
): Promise<string | null> {
  // 写入需要 service_role key
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('[db] Supabase 写入未配置,提交仅记录到控制台:', payload);
    return `mock_${Date.now()}`;
  }

  try {
    const supabase = getServerClient();
    const { data, error } = await (supabase as any)
      .from('submissions')
      .insert({
        name: payload.name.trim(),
        website_url: payload.website_url.trim(),
        suggested_models: payload.suggested_models,
        suggested_price_multiplier: payload.suggested_price_multiplier ?? null,
        submitter_note: payload.submitter_note,
        contact_email: payload.contact_email ?? null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[db] insertSubmission 失败:', error.message);
      return null;
    }

    return data.id as string;
  } catch (err) {
    console.error('[db] Supabase 连接异常:', String(err));
    return null;
  }
}

// ===== Mock 价格历史生成(仅 Supabase 无数据时使用) =====

function generateMockPriceHistory(provider: Provider): PriceHistoryRecord[] {
  const basePrice = provider.price_multiplier;
  const models = provider.supported_models.slice(0, 3);
  const records: PriceHistoryRecord[] = [];

  models.forEach((model) => {
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const jitter =
        Math.sin(i * 1.7 + provider.id.charCodeAt(0)) * 0.1 + 0.02;
      const multiplier =
        Math.round((basePrice + jitter) * 100) / 100;

      records.push({
        id: `ph_${provider.id}_${model}_${i}`,
        provider_id: provider.id,
        model,
        price_multiplier: multiplier > 0.1 ? multiplier : basePrice,
        recorded_at: date.toISOString().split('T')[0],
      });
    }
  });

  return records.sort(
    (a, b) =>
      new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
  );
}
