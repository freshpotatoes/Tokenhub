/**
 * 用户提交 API
 *
 * POST /api/submit
 *
 * 接收用户提交的中转站信息,存储为待审核草稿。
 * 当前 MVP 阶段:仅做校验并返回成功,数据由前端存入 localStorage。
 *
 * TODO: 接入 Supabase 后:
 *   const supabase = createClient(...);
 *   const { data, error } = await supabase.from('drafts').insert({...});
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 基础校验
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json({ error: '中转站名称不能为空' }, { status: 400 });
    }

    if (!body.website_url || typeof body.website_url !== 'string' || !body.website_url.trim()) {
      return NextResponse.json({ error: '网站地址不能为空' }, { status: 400 });
    }

    // 校验 URL 格式
    try {
      new URL(body.website_url);
    } catch {
      return NextResponse.json({ error: '网站地址格式不正确' }, { status: 400 });
    }

    // TODO: 接入 Supabase 后写入 drafts 表
    // const { data, error } = await supabase.from('drafts').insert({
    //   name: body.name.trim(),
    //   website_url: body.website_url.trim(),
    //   suggested_models: body.suggested_models || [],
    //   suggested_price_multiplier: body.suggested_price_multiplier || null,
    //   submitter_note: body.submitter_note || '',
    //   contact_email: body.contact_email || null,
    //   status: 'pending',
    // });
    // if (error) throw error;

    console.log('[submit] 收到新提交:', {
      name: body.name,
      website_url: body.website_url,
      models: body.suggested_models,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: '提交成功,等待审核',
        id: `draft_${Date.now()}`,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[submit] 处理失败:', message);
    return NextResponse.json({ error: '提交处理失败,请稍后重试' }, { status: 500 });
  }
}
