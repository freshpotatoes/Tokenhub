/**
 * 站点存活监控 API
 *
 * GET /api/monitor
 *
 * 功能:对全量中转站执行 HTTP HEAD 探测,并将状态变化写回 Supabase。
 *
 * ===== Vercel Cron 接入步骤 =====
 * 1. 部署项目到 Vercel
 * 2. 在 Vercel Dashboard → Settings → Cron Jobs 添加:
 *    - 路径: /api/monitor
 *    - 频率: 每30分钟 (cron: 每30 * * * *)
 * 3. 或手动创建 vercel.json:
 *    {
 *      "crons": [{
 *        "path": "/api/monitor",
 *        "schedule": "每30 * * * *"
 *      }]
 *    }
 * 4. Vercel 会自动注入 CRON_SECRET 环境变量保护端点
 */

import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getAllProviders } from '@/lib/db';
import { probeAllProviders } from '@/lib/monitor';
import { getServerClient } from '@/lib/supabase/server';

/** 类型辅助:绕过 supabase-js v2 无 generated types 时的严格类型检查 */
function updateProviderStatus(
  supabase: SupabaseClient,
  slug: string,
  status: string,
  last_checked_at: string
) {
  return (supabase as any)
    .from('providers')
    .update({ status, last_checked_at })
    .eq('slug', slug);
}

export async function GET(request: Request) {
  // ---- 安全校验 ----
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const providers = await getAllProviders();

    // 执行全量探测(逐个进行,避免并发过高)
    const results = await probeAllProviders(providers);

    // 统计
    const changed = results.filter((r) => r.oldStatus !== r.newStatus);
    const summary = {
      total: results.length,
      changed: changed.length,
      online: results.filter((r) => r.newStatus === 'online').length,
      suspect: results.filter((r) => r.newStatus === 'suspect').length,
      dead: results.filter((r) => r.newStatus === 'dead').length,
    };

    // 将状态变化写回 Supabase
    if (changed.length > 0) {
      try {
        const supabase = getServerClient();
        const now = new Date().toISOString();

        for (const r of changed) {
          const { error } = await updateProviderStatus(
            supabase, r.slug, r.newStatus, now
          );

          if (error) {
            console.error(`[monitor] 更新 ${r.slug} 状态失败:`, error.message);
          }
        }
      } catch {
        // Supabase 未配置时 getServerClient() 会抛错;忽略,探测结果仍可返回
        console.warn('[monitor] Supabase 未配置,状态未写入数据库');
      }
    }

    return NextResponse.json({
      checked_at: new Date().toISOString(),
      summary,
      changes: changed.map((r) => ({
        slug: r.slug,
        url: r.url,
        oldStatus: r.oldStatus,
        newStatus: r.newStatus,
        statusCode: r.statusCode,
        latencyMs: r.latencyMs,
        error: r.error,
      })),
      all: results.map((r) => ({
        slug: r.slug,
        newStatus: r.newStatus,
        latencyMs: r.latencyMs,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
