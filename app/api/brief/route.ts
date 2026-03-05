// app/api/brief/route.ts
import { NextResponse } from 'next/server';
import { fetchMarketData } from '@/lib/coingecko';
import { generateMarketBrief } from '@/lib/ai-brief';

export const revalidate = 120;

export async function GET() {
  try {
    const data = await fetchMarketData();
    const brief = generateMarketBrief(data);
    return NextResponse.json({ brief, timestamp: Date.now() }, {
      headers: {
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240',
      },
    });
  } catch (err) {
    console.error('[brief] error:', err);
    return NextResponse.json({ error: 'Failed to generate brief' }, { status: 500 });
  }
}
