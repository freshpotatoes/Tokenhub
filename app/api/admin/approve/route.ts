/**
 * 审核通过 API
 * POST /api/admin/approve
 *
 * 将 submissions 表中的一条待审核记录转为正式 providers 记录。
 * 需要 ADMIN_SECRET 验证。
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  // 安全校验
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { submissionId } = await request.json();
    if (!submissionId) {
      return NextResponse.json({ error: '缺少 submissionId' }, { status: 400 });
    }

    const supabase = getServerClient();

    // 读取 submissions 记录
    const { data: sub, error: readErr } = await (supabase as any)
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (readErr || !sub) {
      return NextResponse.json({ error: '未找到该提交' }, { status: 404 });
    }

    if (sub.status !== 'pending') {
      return NextResponse.json({ error: `该提交已处理(状态: ${sub.status})` }, { status: 400 });
    }

    // 生成 slug
    const slug = sub.name
      .toLowerCase()
      .replace(/[^a-z0-9一-鿿]+/g, '-')
      .replace(/^-|-$/g, '');

    // 写入 providers 表
    const { data: provider, error: insertErr } = await (supabase as any)
      .from('providers')
      .insert({
        name: sub.name,
        slug,
        website_url: sub.website_url,
        supported_models: sub.suggested_models || [],
        price_multiplier: sub.suggested_price_multiplier ?? 1.0,
        description: sub.submitter_note || '',
        status: 'online',
        signup_barrier: 'medium',
        reputation_score: 2.5,
        runaway_risk: 'medium',
        billing_type: 'prepaid',
        payment_methods: [],
        community_links: [],
        categories: ['chat'],
      })
      .select('id')
      .single();

    if (insertErr) {
      return NextResponse.json({ error: `写入失败: ${insertErr.message}` }, { status: 500 });
    }

    // 更新 submissions 状态
    await (supabase as any)
      .from('submissions')
      .update({ status: 'approved' })
      .eq('id', submissionId);

    return NextResponse.json({
      success: true,
      providerId: provider.id,
      slug,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
