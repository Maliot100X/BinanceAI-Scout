'use client';

import type { CoinData } from '@/lib/coingecko';

interface Props {
  coins: CoinData[];
}

export default function MarketTicker({ coins }: Props) {
  const items = [...coins, ...coins]; // duplicate for seamless loop

  return (
    <div className="bg-binance-card border-b border-binance-border overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-binance-yellow text-binance-dark text-xs font-bold px-3 py-2 z-10">
          LIVE
        </div>
        <div className="overflow-hidden flex-1">
          <div className="ticker-track flex whitespace-nowrap">
            {items.map((coin, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-6 py-2 text-sm">
                <span className="font-semibold text-white">{coin.symbol}/USDT</span>
                <span className="text-white">${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: coin.price < 1 ? 6 : 2 })}</span>
                <span className={coin.change24h >= 0 ? 'text-binance-green' : 'text-binance-red'}>
                  {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
