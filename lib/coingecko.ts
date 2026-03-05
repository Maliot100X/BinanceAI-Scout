// lib/coingecko.ts
// Free public API — no key required

export const TRACKED_COINS = [
  'bitcoin',
  'ethereum',
  'binancecoin',
  'solana',
  'ripple',
  'cardano',
  'dogecoin',
  'avalanche-2',
  'polkadot',
  'chainlink',
];

export const COIN_META: Record<string, { symbol: string; name: string }> = {
  bitcoin: { symbol: 'BTC', name: 'Bitcoin' },
  ethereum: { symbol: 'ETH', name: 'Ethereum' },
  binancecoin: { symbol: 'BNB', name: 'BNB' },
  solana: { symbol: 'SOL', name: 'Solana' },
  ripple: { symbol: 'XRP', name: 'XRP' },
  cardano: { symbol: 'ADA', name: 'Cardano' },
  dogecoin: { symbol: 'DOGE', name: 'Dogecoin' },
  'avalanche-2': { symbol: 'AVAX', name: 'Avalanche' },
  polkadot: { symbol: 'DOT', name: 'Polkadot' },
  chainlink: { symbol: 'LINK', name: 'Chainlink' },
};

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  image: string;
}

export interface MarketData {
  coins: CoinData[];
  fearGreedIndex: number;
  fearGreedLabel: string;
  totalMarketCap: number;
  btcDominance: number;
  timestamp: number;
}

const BASE = 'https://api.coingecko.com/api/v3';

export async function fetchMarketData(): Promise<MarketData> {
  const [coinsRes, globalRes] = await Promise.all([
    fetch(
      `${BASE}/coins/markets?vs_currency=usd&ids=${TRACKED_COINS.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h,7d`,
      { next: { revalidate: 60 } }
    ),
    fetch(`${BASE}/global`, { next: { revalidate: 120 } }),
  ]);

  const coinsJson = await coinsRes.json();
  const globalJson = await globalRes.json();

  const coins: CoinData[] = coinsJson.map((c: any) => ({
    id: c.id,
    symbol: c.symbol.toUpperCase(),
    name: c.name,
    price: c.current_price,
    change24h: c.price_change_percentage_24h ?? 0,
    change7d: c.price_change_percentage_7d_in_currency ?? 0,
    marketCap: c.market_cap,
    volume24h: c.total_volume,
    image: c.image,
  }));

  const g = globalJson.data;
  const totalMarketCap = g.total_market_cap?.usd ?? 0;
  const btcDominance = g.market_cap_percentage?.btc ?? 0;

  // Synthetic Fear & Greed from avg 24h change
  const avgChange = coins.reduce((a, c) => a + c.change24h, 0) / coins.length;
  let fearGreedIndex = 50 + avgChange * 3;
  fearGreedIndex = Math.max(0, Math.min(100, fearGreedIndex));

  const fearGreedLabel =
    fearGreedIndex >= 75
      ? 'Extreme Greed'
      : fearGreedIndex >= 55
      ? 'Greed'
      : fearGreedIndex >= 45
      ? 'Neutral'
      : fearGreedIndex >= 25
      ? 'Fear'
      : 'Extreme Fear';

  return { coins, fearGreedIndex: Math.round(fearGreedIndex), fearGreedLabel, totalMarketCap, btcDominance, timestamp: Date.now() };
}

export function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (price >= 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

export function formatLargeNum(num: number): string {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}
