/**
 * 站点存活探测模块
 *
 * ===== 工作原理 =====
 * 1. 对每个中转站的 website_url 发起 HTTP HEAD 请求(默认超时 10 秒)
 * 2. 根据响应结果判断新状态:
 *    - 2xx/3xx 状态码        → online   (正常)
 *    - 超时/无响应            → suspect  (可能暂时故障)
 *    - DNS 解析失败/连接拒绝  → dead     (大概率关站)
 *    - 5xx                    → suspect  (服务器内部错误)
 * 3. 记录延迟和状态码,返回 ProbeResult
 *
 * ===== Vercel Cron 部署说明 =====
 * 1. 在项目根目录创建 vercel.json:
 *    {
 *      "crons": [{
 *        "path": "/api/monitor?secret=YOUR_CRON_SECRET",
 *        "schedule": "每30 * * * *"
 *      }]
 *    }
 * 2. 部署后 Vercel 每 30 分钟自动调用 /api/monitor
 * 3. Hobby 计划限制: cron 最小间隔 1 天; Pro 计划: 最小 1 分钟
 * 4. 可在 Vercel Dashboard → Settings → Environment Variables 设置 CRON_SECRET
 *    来保护端点不被外部随意调用
 *
 * ===== 接入 Supabase 后的更新逻辑 =====
 * 当前版本只返回探测结果,不写数据库。
 * 接入 Supabase 后在 API route 中添加:
 *   await supabase
 *     .from('providers')
 *     .update({ status: result.newStatus, last_checked_at: new Date().toISOString() })
 *     .eq('slug', result.slug);
 */

import { Provider, ProviderStatus, ProbeResult } from './types';

/**
 * 对单个 URL 发起探测请求
 * @param url       目标 URL
 * @param timeoutMs 超时毫秒数,默认 10000
 * @returns 状态码、延迟、错误信息
 */
export async function probeSite(
  url: string,
  timeoutMs: number = 10000
): Promise<{
  statusCode: number | null;
  latencyMs: number | null;
  error?: string;
}> {
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'manual', // 不自动跟随重定向,避免跳转到无关页面
      cache: 'no-store',  // 禁用缓存,确保每次都是真实请求
    });

    clearTimeout(timeout);

    return {
      statusCode: response.status,
      latencyMs: Date.now() - start,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      statusCode: null,
      latencyMs: Date.now() - start,
      error: message,
    };
  }
}

/**
 * 根据 HTTP 响应判断站点状态
 * @param statusCode HTTP 状态码(null = 请求失败)
 * @param error      错误信息
 * @returns 推断的状态
 */
export function determineStatus(
  statusCode: number | null,
  error?: string
): ProviderStatus {
  // ---- 请求完全失败 ----
  if (statusCode === null) {
    const lowerErr = (error || '').toLowerCase();
    // DNS 解析失败或 TCP 连接拒绝 → 站点很可能已关闭
    if (
      lowerErr.includes('enotfound') ||
      lowerErr.includes('econnrefused') ||
      lowerErr.includes('dns')
    ) {
      return 'dead';
    }
    // 超时或其他网络错误 → 暂时不可用,标记可疑
    return 'suspect';
  }

  // ---- HTTP 响应正常 ----
  if (statusCode >= 200 && statusCode < 400) {
    return 'online';
  }

  // ---- 服务器错误 → 暂时故障 ----
  if (statusCode >= 500) {
    return 'suspect';
  }

  // ---- 4xx 客户端错误 → 站点可达但可能改版,标记可疑 ----
  return 'suspect';
}

/**
 * 对全量中转站列表执行存活探测
 * @param providers 全量 Provider 列表
 * @returns 探测结果数组
 */
export async function probeAllProviders(
  providers: Provider[]
): Promise<ProbeResult[]> {
  // 逐个探测(避免并发过高被目标服务器封 IP)
  // 生产环境可以加 1-2 秒间隔
  const results: ProbeResult[] = [];

  for (const provider of providers) {
    const { statusCode, latencyMs, error } = await probeSite(
      provider.website_url
    );

    const newStatus = determineStatus(statusCode, error);

    results.push({
      slug: provider.slug,
      url: provider.website_url,
      oldStatus: provider.status,
      newStatus,
      statusCode,
      latencyMs,
      error,
    });
  }

  return results;
}
