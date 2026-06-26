/**
 * 站点存活监控 API
 *
 * GET /api/monitor
 *
 * 功能:对全量中转站执行 HTTP HEAD 探测,返回每个站点的状态变化。
 * 当前版本:只读探测,不写数据库(因使用 mock JSON)。
 *
 * ===== Vercel Cron 接入步骤 =====
 * 1. 部署项目到 Vercel
 * 2. 在 Vercel Dashboard → Settings → Cron Jobs 添加:
 *    - 路径: /api/monitor
 *    - 频率: 每30分钟 (cron: 每30 * * * *)
 *    - 或手动创建 vercel.json:
 *      {
 *        "crons": [{
 *          "path": "/api/monitor",
 *          "schedule": "每30 * * * *"
 *        }]
 *      }
 * 3. Vercel 会自动注入 CRON_SECRET 环境变量保护端点
 * 4. Hobby 计划最小间隔为 1 天,Pro 计划支持分钟级
 *
 * ===== 接入 Supabase 后的写入逻辑 =====
 * 在 probeResults.forEach 后添加:
 *   const supabase = createClient(...);
 *   for (const r of results) {
 *     await supabase
 *       .from('providers')
 *       .update({ status: r.newStatus, last_checked_at: new Date().toISOString() })
 *       .eq('slug', r.slug);
 *   }
 */

import { NextResponse } from 'next/server';
import { getAllProviders } from '@/lib/db';
import { probeAllProviders, probeSite, determineStatus } from '@/lib/monitor';

export async function GET(request: Request) {
  // ---- 安全校验:Vercel Cron Secret ----
  // 部署后 Vercel 会自动在 Cron 请求头中携带 Authorization
  // 也可以设置环境变量 CRON_SECRET 作为 query param 验证
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const expectedSecret = process.env.CRON_SECRET;

  // 如果设置了 CRON_SECRET 且不匹配,返回 401
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const providers = getAllProviders();

    // 执行全量探测(逐个进行,避免并发过高)
    const results = await probeAllProviders(providers);

    // 统计变化
    const changed = results.filter((r) => r.oldStatus !== r.newStatus);
    const summary = {
      total: results.length,
      changed: changed.length,
      online: results.filter((r) => r.newStatus === 'online').length,
      suspect: results.filter((r) => r.newStatus === 'suspect').length,
      dead: results.filter((r) => r.newStatus === 'dead').length,
    };

    return NextResponse.json({
      checked_at: new Date().toISOString(),
      summary,
      // 仅返回状态发生变化的站点详情,减少响应体积
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
