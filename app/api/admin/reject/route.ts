/**
 * 审核拒绝 API
 * POST /api/admin/reject
 *
 * 将 submissions 表中的一条待审核记录标记为 rejected。
 * 需要 ADMIN_SECRET 验证。
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
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

    const { error } = await (supabase as any)
      .from('submissions')
      .update({ status: 'rejected' })
      .eq('id', submissionId)
      .eq('status', 'pending');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
