/**
 * 数据读取层
 *
 * 从 Supabase 读取数据。Supabase 未配置或查询失败时返回空数据,
 * 不再 fallback 到 mock JSON,避免构建时烤入假数据。
 */

import { Provider, PriceHistoryRecord } from './types';
import { getServerClient } from './supabase/server';
import { createBrowserClient } from './supabase/client';

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function getAnonClient() {
  return createBrowserClient();
}

// ===== Provider 查询 =====

export async function getAllProviders(): Promise<Provider[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .order('reputation_score', { ascending: false });

    if (error) {
      console.error('[db] getAllProviders 查询失败:', error.message);
      return [];
    }

    return (data || []) as Provider[];
  } catch (err) {
    console.error('[db] Supabase 连接异常:', String(err));
    return [];
  }
}

export async function getProviderBySlug(
  slug: string
): Promise<Provider | undefined> {
  if (!isSupabaseConfigured()) {
    return undefined;
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
      return undefined;
    }

    return data as Provider;
  } catch (err) {
    console.error('[db] Supabase 连接异常:', String(err));
    return undefined;
  }
}

export async function getProviderSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = getAnonClient();
    const { data, error } = await supabase.from('providers').select('slug');

    if (error) {
      console.error('[db] getProviderSlugs 查询失败:', error.message);
      return [];
    }

    return (data as { slug: string }[]).map((row) => row.slug);
  } catch (err) {
    console.error('[db] Supabase 连接异常:', String(err));
    return [];
  }
}

// ===== 价格历史查询 =====

export async function getPriceHistory(
  slug: string
): Promise<PriceHistoryRecord[]> {
  if (!isSupabaseConfigured()) {
    return [];
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
      return [];
    }

    return (data || []) as PriceHistoryRecord[];
  } catch (err) {
    console.error('[db] Supabase 连接异常:', String(err));
    return [];
  }
}

// ===== 用户提交 =====

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
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[db] Supabase 写入未配置,提交失败');
    return null;
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
