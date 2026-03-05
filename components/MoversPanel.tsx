'use client';

import type { CoinData } from '@/lib/coingecko';

interface Props {
  coins: CoinData[];
}

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

export default function MoversPanel({ coins }: Props) {
  if (coins.length === 0) return null;

  const sorted = [...coins].sort((a, b) => b.change24h - a.change24h);
  const gainers = sorted.slice(0, 3);
  const losers = sorted.slice(-3).reverse();

  return (
    <div className="bg-binance-card border border-binance-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-binance-border">
        <h3 className="text-white font-semibold">Top Movers</h3>
        <p className="text-binance-text text-xs mt-0.5">24h performance</p>
      </div>

      <div className="divide-y divide-binance-border/40">
        <div className="px-5 py-3">
          <p className="text-xs font-semibold text-binance-green mb-2">🚀 GAINERS</p>
          <div className="space-y-2">
            {gainers.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.name} className="w-6 h-6 rounded-full" />
                  <span className="text-white text-sm font-medium">{c.symbol}</span>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">{formatPrice(c.price)}</div>
                  <div className="text-binance-green text-xs font-medium">+{c.change24h.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-3">
          <p className="text-xs font-semibold text-binance-red mb-2">📉 LOSERS</p>
          <div className="space-y-2">
            {losers.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.name} className="w-6 h-6 rounded-full" />
                  <span className="text-white text-sm font-medium">{c.symbol}</span>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">{formatPrice(c.price)}</div>
                  <div className="text-binance-red text-xs font-medium">{c.change24h.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-binance-border/50 bg-binance-border/10">
        <p className="text-xs text-binance-text text-center">
          Use <span className="text-binance-yellow font-medium">/movers</span> on Telegram
        </p>
      </div>
    </div>
  );
}
