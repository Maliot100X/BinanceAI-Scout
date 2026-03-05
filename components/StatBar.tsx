'use client';

import type { MarketData } from '@/lib/coingecko';

interface Props {
  market: MarketData;
}

function formatCap(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  return `$${n.toLocaleString()}`;
}

export default function StatBar({ market }: Props) {
  const { totalMarketCap, btcDominance, fearGreedIndex, fearGreedLabel, coins } = market;
  const totalVolume = coins.reduce((a, c) => a + c.volume24h, 0);

  const stats = [
    { label: 'Total Market Cap', value: formatCap(totalMarketCap) },
    { label: '24h Volume', value: formatCap(totalVolume) },
    { label: 'BTC Dominance', value: `${btcDominance.toFixed(1)}%` },
    { label: 'Fear & Greed', value: `${fearGreedIndex}/100`, sub: fearGreedLabel },
    { label: 'Active Assets', value: `${coins.length} tracked` },
  ];

  return (
    <div className="bg-binance-card border-b border-binance-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-x-8 gap-y-2 py-3 text-sm overflow-x-auto">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-binance-text">{s.label}:</span>
              <span className="text-white font-medium">{s.value}</span>
              {s.sub && <span className="text-binance-yellow text-xs">({s.sub})</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
