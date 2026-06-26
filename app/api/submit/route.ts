/**
 * 用户提交 API
 *
 * POST /api/submit
 *
 * 接收用户提交的中转站信息,写入 submissions 表(status=pending 待审核),
 * 不直接写入 provider 表。
 */

import { NextRequest, NextResponse } from 'next/server';
import { insertSubmission } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 基础校验 — 名称
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ error: '中转站名称不能为空' }, { status: 400 });
    }

    // 基础校验 — 网址
    if (
      !body.website_url ||
      typeof body.website_url !== 'string' ||
      !body.website_url.trim()
    ) {
      return NextResponse.json({ error: '网站地址不能为空' }, { status: 400 });
    }

    // 校验 URL 格式
    try {
      new URL(body.website_url.trim());
    } catch {
      return NextResponse.json({ error: '网站地址格式不正确' }, { status: 400 });
    }

    // 防重复:不在此处实现(需要查询已有 submissions,增加复杂度)
    // 后续可在 Supabase 中加 unique constraint 或 edge function

    // 写入 submissions 表
    const id = await insertSubmission({
      name: body.name,
      website_url: body.website_url,
      suggested_models: body.suggested_models || [],
      suggested_price_multiplier: body.suggested_price_multiplier ?? undefined,
      submitter_note: body.submitter_note || '',
      contact_email: body.contact_email || undefined,
    });

    if (!id) {
      return NextResponse.json(
        { error: '提交失败,请稍后重试' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: '提交成功,等待审核',
        id,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[submit] 处理失败:', message);
    return NextResponse.json(
      { error: '提交处理失败,请稍后重试' },
      { status: 500 }
    );
  }
}
