'use client';

import { useEffect, useState, useCallback } from 'react';
import type { MarketData } from '@/lib/coingecko';
import Header from '@/components/Header';
import MarketTicker from '@/components/MarketTicker';
import StatBar from '@/components/StatBar';
import PriceTable from '@/components/PriceTable';
import AIBrief from '@/components/AIBrief';
import MoversPanel from '@/components/MoversPanel';
import FearGauge from '@/components/FearGauge';
import TelegramCTA from '@/components/TelegramCTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [market, setMarket] = useState<MarketData | null>(null);
  const [brief, setBrief] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [mRes, bRes] = await Promise.all([
        fetch('/api/market'),
        fetch('/api/brief'),
      ]);
      const mData = await mRes.json();
      const bData = await bRes.json();
      setMarket(mData);
      setBrief(bData.brief ?? '');
      setLastUpdated(new Date());
    } catch (e) {
      console.error('fetch error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <div className="min-h-screen bg-binance-dark">
      <Header lastUpdated={lastUpdated} onRefresh={refresh} />
      {market && <MarketTicker coins={market.coins} />}
      {market && <StatBar market={market} />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-2 border-binance-yellow border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-binance-text text-sm">Loading market intelligence...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <PriceTable coins={market?.coins ?? []} />
                <AIBrief brief={brief} />
              </div>
              <div className="space-y-6">
                <FearGauge
                  index={market?.fearGreedIndex ?? 50}
                  label={market?.fearGreedLabel ?? 'Neutral'}
                />
                <MoversPanel coins={market?.coins ?? []} />
                <TelegramCTA />
              </div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
