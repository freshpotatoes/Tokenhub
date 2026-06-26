/**
 * 数据读取层
 *
 * 当前阶段(MVP): 从本地 data/providers.json 读取 mock 数据
 *
 * TODO: 接入 Supabase 后替换实现:
 * ```ts
 * import { createClient } from '@supabase/supabase-js';
 * const supabase = createClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 * );
 *
 * export async function getAllProviders(): Promise<Provider[]> {
 *   const { data, error } = await supabase
 *     .from('providers')
 *     .select('*')
 *     .order('reputation_score', { ascending: false });
 *   if (error) throw error;
 *   return data as Provider[];
 * }
 * ```
 */

import { Provider, PriceHistoryRecord } from './types';
import providersData from '@/data/providers.json';

/** 获取所有中转站数据 */
export function getAllProviders(): Provider[] {
  return providersData as Provider[];
}

/** 根据 slug 获取单个中转站 */
export function getProviderBySlug(slug: string): Provider | undefined {
  return (providersData as Provider[]).find((p) => p.slug === slug);
}

/** 获取所有 slug 列表(用于 sitemap 和静态生成) */
export function getProviderSlugs(): string[] {
  return (providersData as Provider[]).map((p) => p.slug);
}

/**
 * 获取某个中转站的价格历史
 * 当前为 mock 数据:基于当前 price_multiplier 反向生成几条历史记录
 * TODO: 接入 Supabase 后从 price_history 表查询:
 *   const { data } = await supabase
 *     .from('price_history')
 *     .select('*')
 *     .eq('provider_id', id)
 *     .order('recorded_at', { ascending: false });
 */
export function getPriceHistory(slug: string): PriceHistoryRecord[] {
  const provider = getProviderBySlug(slug);
  if (!provider) return [];

  // 基于当前价格反向生成 6 条模拟历史记录(制造小幅波动的假象)
  const basePrice = provider.price_multiplier;
  const models = provider.supported_models.slice(0, 3); // 取前 3 个模型生成历史
  const records: PriceHistoryRecord[] = [];

  models.forEach((model) => {
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      // 在当前价格基础上加随机波动(±15%),模拟价格变化
      const jitter = (Math.sin(i * 1.7 + provider.id.charCodeAt(0)) * 0.1 + 0.02);
      const multiplier = Math.round((basePrice + jitter) * 100) / 100;

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
    (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
  );
}
