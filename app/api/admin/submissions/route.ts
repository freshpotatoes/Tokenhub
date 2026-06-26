/**
 * 获取所有提交记录
 * GET /api/admin/submissions?secret=xxx
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 诊断:逐变量检查
  const key = process.env.TOKENHUB_SERVICE_KEY;
  if (!key) {
    return NextResponse.json({ error: '缺少 TOKENHUB_SERVICE_KEY' }, { status: 500 });
  }

  const SUPABASE_URL = 'https://lbojcxapaabochuhrlkw.supabase.co';

  try {
    const supabase = createClient(SUPABASE_URL, key);
    const { data, error } = await (supabase as any)
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ submissions: data || [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
