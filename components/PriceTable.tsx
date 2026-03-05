'use client';

import Image from 'next/image';
import type { CoinData } from '@/lib/coingecko';

interface Props {
  coins: CoinData[];
}

function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

function formatLarge(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

export default function PriceTable({ coins }: Props) {
  return (
    <div className="bg-binance-card border border-binance-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-binance-border flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-lg">Market Prices</h2>
          <p className="text-binance-text text-xs mt-0.5">Top assets • Live data</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-binance-green">
          <span className="w-2 h-2 bg-binance-green rounded-full animate-pulse" />
          Live
        </span>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-12 px-6 py-3 text-xs text-binance-text border-b border-binance-border/50 bg-binance-border/20">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-4">Asset</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-right">24h</div>
        <div className="col-span-2 text-right hidden md:block">7d</div>
        <div className="col-span-2 text-right hidden lg:block">Volume</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-binance-border/30">
        {coins.map((coin, i) => (
          <div
            key={coin.id}
            className="grid grid-cols-12 items-center px-6 py-4 hover:bg-binance-border/20 transition-colors cursor-default"
          >
            <div className="col-span-1 text-binance-text text-sm text-center">{i + 1}</div>
            <div className="col-span-4 flex items-center gap-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">{coin.symbol}</div>
                <div className="text-binance-text text-xs truncate max-w-[80px]">{coin.name}</div>
              </div>
            </div>
            <div className="col-span-2 text-right">
              <span className="text-white font-medium text-sm">{formatPrice(coin.price)}</span>
            </div>
            <div className="col-span-2 text-right">
              <span className={`text-sm font-medium ${coin.change24h >= 0 ? 'text-binance-green' : 'text-binance-red'}`}>
                {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
              </span>
            </div>
            <div className="col-span-2 text-right hidden md:block">
              <span className={`text-sm ${coin.change7d >= 0 ? 'text-binance-green' : 'text-binance-red'}`}>
                {coin.change7d >= 0 ? '+' : ''}{coin.change7d.toFixed(2)}%
              </span>
            </div>
            <div className="col-span-2 text-right hidden lg:block">
              <span className="text-binance-text text-sm">{formatLarge(coin.volume24h)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
