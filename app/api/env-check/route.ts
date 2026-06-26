import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    supabaseUrl: 'hardcoded',
    anonKey: 'hardcoded',
    serviceKey: {
      set: !!process.env.TOKENHUB_SERVICE_KEY,
    },
    adminSecret: {
      set: !!process.env.ADMIN_SECRET,
    },
    baseUrl: 'hardcoded',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'not set',
    allKeys: Object.keys(process.env).filter(k =>
      k.includes('SUPABASE') || k.includes('ADMIN') || k === 'VERCEL_ENV'
    ).sort(),
  });
}
