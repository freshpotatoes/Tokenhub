/**
 * 审核拒绝 API
 * POST /api/admin/reject
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: `缺少 Supabase 环境变量` }, { status: 500 });
  }

  try {
    const { submissionId } = await request.json();
    if (!submissionId) {
      return NextResponse.json({ error: '缺少 submissionId' }, { status: 400 });
    }
    const supabase = createClient(url, key);
    const { error } = await (supabase as any)
      .from('submissions').update({ status: 'rejected' })
      .eq('id', submissionId).eq('status', 'pending');
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
