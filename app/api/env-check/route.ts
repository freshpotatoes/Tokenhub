import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    url: {
      set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      prefix: (process.env.NEXT_PUBLIC_SUPABASE_URL || '').slice(0, 40),
    },
    anon: {
      set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      prefix: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').slice(0, 16),
    },
    service: {
      set: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      prefix: (process.env.SUPABASE_SERVICE_ROLE_KEY || '').slice(0, 12),
    },
    admin: {
      set: !!process.env.ADMIN_SECRET,
    },
    baseUrl: {
      set: !!process.env.NEXT_PUBLIC_BASE_URL,
      prefix: (process.env.NEXT_PUBLIC_BASE_URL || '').slice(0, 40),
    },
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'not set',
    allKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('ADMIN') || k.includes('BASE_URL') || k === 'VERCEL_ENV').sort(),
  });
}
