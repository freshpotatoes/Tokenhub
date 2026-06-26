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
