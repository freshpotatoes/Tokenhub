/**
 * 审核通过 API
 * POST /api/admin/approve
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    return NextResponse.json({ error: '缺少 SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
  }

  const SUPABASE_URL = 'https://lbojcxapaabochuhrlkw.supabase.co';

  try {
    const { submissionId } = await request.json();
    if (!submissionId) {
      return NextResponse.json({ error: '缺少 submissionId' }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, key);

    const { data: sub, error: readErr } = await (supabase as any)
      .from('submissions').select('*').eq('id', submissionId).single();
    if (readErr || !sub) {
      return NextResponse.json({ error: '未找到该提交' }, { status: 404 });
    }
    if (sub.status !== 'pending') {
      return NextResponse.json({ error: `已处理(状态:${sub.status})` }, { status: 400 });
    }

    const slug = sub.name.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, '-').replace(/^-|-$/g, '');

    const { data: provider, error: insertErr } = await (supabase as any)
      .from('providers').insert({
        name: sub.name, slug, website_url: sub.website_url,
        supported_models: sub.suggested_models || [],
        price_multiplier: sub.suggested_price_multiplier ?? 1.0,
        description: sub.submitter_note || '',
        status: 'online', signup_barrier: 'medium',
        reputation_score: 2.5, runaway_risk: 'medium',
        billing_type: 'prepaid', payment_methods: [],
        community_links: [], categories: ['chat'],
      }).select('id').single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    await (supabase as any).from('submissions').update({ status: 'approved' }).eq('id', submissionId);

    return NextResponse.json({ success: true, providerId: provider.id, slug });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
