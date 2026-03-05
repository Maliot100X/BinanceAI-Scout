// app/api/market/route.ts
import { NextResponse } from 'next/server';
import { fetchMarketData } from '@/lib/coingecko';

export const revalidate = 60; // cache 60s

export async function GET() {
  try {
    const data = await fetchMarketData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    console.error('[market] error:', err);
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
