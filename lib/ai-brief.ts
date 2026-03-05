// lib/ai-brief.ts
// Smart AI brief generator from live market data

import { MarketData, formatPrice, formatLargeNum } from './coingecko';

export function generateMarketBrief(data: MarketData): string {
  const { coins, fearGreedIndex, fearGreedLabel, totalMarketCap, btcDominance } = data;

  const btc = coins.find((c) => c.id === 'bitcoin');
  const eth = coins.find((c) => c.id === 'ethereum');
  const bnb = coins.find((c) => c.id === 'binancecoin');

  const gainers = [...coins].sort((a, b) => b.change24h - a.change24h).slice(0, 3);
  const losers = [...coins].sort((a, b) => a.change24h - b.change24h).slice(0, 3);

  const avgChange = coins.reduce((a, c) => a + c.change24h, 0) / coins.length;
  const marketSentiment = avgChange > 3 ? 'bullish surge' : avgChange > 1 ? 'mild uptrend' : avgChange > -1 ? 'consolidation phase' : avgChange > -3 ? 'mild pullback' : 'heavy correction';

  const now = new Date();
  const timeStr = now.toUTCString().slice(0, 25);

  let brief = `🤖 **BinanceAI Scout — Market Brief**\n`;
  brief += `📅 *${timeStr}*\n\n`;

  brief += `**📊 Market Overview**\n`;
  brief += `Total Market Cap: ${formatLargeNum(totalMarketCap)}\n`;
  brief += `BTC Dominance: ${btcDominance.toFixed(1)}%\n`;
  brief += `Fear & Greed: ${fearGreedIndex}/100 — *${fearGreedLabel}*\n\n`;

  brief += `**🔑 Key Prices**\n`;
  if (btc) brief += `• BTC: ${formatPrice(btc.price)} (${btc.change24h > 0 ? '+' : ''}${btc.change24h.toFixed(2)}% 24h)\n`;
  if (eth) brief += `• ETH: ${formatPrice(eth.price)} (${eth.change24h > 0 ? '+' : ''}${eth.change24h.toFixed(2)}% 24h)\n`;
  if (bnb) brief += `• BNB: ${formatPrice(bnb.price)} (${bnb.change24h > 0 ? '+' : ''}${bnb.change24h.toFixed(2)}% 24h)\n\n`;

  brief += `**🚀 Top Gainers (24h)**\n`;
  gainers.forEach((c) => {
    brief += `• ${c.symbol}: +${c.change24h.toFixed(2)}%\n`;
  });

  brief += `\n**📉 Top Losers (24h)**\n`;
  losers.forEach((c) => {
    brief += `• ${c.symbol}: ${c.change24h.toFixed(2)}%\n`;
  });

  brief += `\n**🧠 AI Analysis**\n`;
  brief += `The market is currently in a *${marketSentiment}*. `;

  if (btcDominance > 55) {
    brief += `BTC dominance at ${btcDominance.toFixed(1)}% suggests capital is rotating to safety — altcoins may face pressure. `;
  } else if (btcDominance < 45) {
    brief += `Low BTC dominance (${btcDominance.toFixed(1)}%) signals an active altcoin season — risk appetite is high. `;
  } else {
    brief += `BTC dominance at ${btcDominance.toFixed(1)}% is neutral — balanced rotation between BTC and alts. `;
  }

  if (fearGreedIndex > 70) {
    brief += `Sentiment is *extremely greedy* — historically a signal to be cautious and take partial profits. Consider DCA exits.`;
  } else if (fearGreedIndex > 50) {
    brief += `Market sentiment leans *greedy* — momentum is positive but watch for overextension on key resistance levels.`;
  } else if (fearGreedIndex > 30) {
    brief += `Sentiment is *fearful* — historically a buying opportunity for long-term holders. DCA accumulation advised.`;
  } else {
    brief += `*Extreme fear* in the market. Historically one of the best times to accumulate quality assets with patience.`;
  }

  brief += `\n\n🤖 *Powered by BinanceAI Scout | Data: CoinGecko*`;
  return brief;
}

export function generateEducationTip(): string {
  const tips = [
    `📚 **DCA (Dollar-Cost Averaging)**\nInstead of investing a lump sum, DCA means buying a fixed amount regularly (e.g., $50 every week). This reduces the impact of volatility — you buy more when prices are low and less when they're high. Perfect for volatile assets like BTC & ETH.`,
    `📚 **What is Market Cap?**\nMarket cap = Price × Circulating Supply. A coin with a $1M market cap is far easier to move than one with $100B. Higher market cap = more stable but lower upside. Lower market cap = higher risk/reward. Never compare coins by price alone.`,
    `📚 **Understanding Fear & Greed**\nThe Fear & Greed Index measures market sentiment. When everyone is *greedy*, markets are often overbought — a good time to take profits. When everyone is *fearful*, assets are often undervalued — a good time to buy. "Be fearful when others are greedy."`,
    `📚 **BTC Dominance Explained**\nBTC Dominance = Bitcoin's % of total crypto market cap. When it rises, money flows INTO BTC (risk-off). When it falls, money flows INTO altcoins (risk-on). Watching dominance can help time alt entries/exits.`,
    `📚 **What is a Support Level?**\nSupport is a price level where buying pressure historically prevents further decline. If BTC repeatedly bounces from $60k, that's support. When support breaks, it often becomes resistance. Traders watch these levels closely for entries.`,
    `📚 **Liquidity 101**\nLiquidity = how easily you can buy or sell without moving the price. BTC and ETH are highly liquid. Small-cap tokens can be illiquid — meaning large buys spike the price up, but selling can crash it. Always check volume before trading small caps.`,
    `📚 **What is a Bull Run?**\nA bull run is a sustained period of rising prices. They're typically driven by: new institutional demand, positive regulation news, halving cycles (BTC), or macro factors like low interest rates. Bull runs test your patience when dips feel scary.`,
    `📚 **Understanding On-Chain Data**\nOn-chain data is blockchain activity — wallet movements, exchange inflows/outflows, active addresses. When BTC flows OFF exchanges to cold wallets, supply shrinks → bullish. When BTC moves TO exchanges → potential sell pressure.`,
  ];

  return tips[Math.floor(Math.random() * tips.length)];
}

export function generateDCAPlan(amount: number, frequency: string, asset: string, price: number): string {
  const periods = { daily: 365, weekly: 52, monthly: 12 };
  const periodsPerYear = periods[frequency as keyof typeof periods] ?? 12;
  const amountPerPeriod = amount / periodsPerYear;
  const coinsPerPeriod = amountPerPeriod / price;
  const totalCoins = coinsPerPeriod * periodsPerYear;

  return (
    `📊 **DCA Plan for ${asset}**\n\n` +
    `💰 Budget: $${amount.toLocaleString()}/year\n` +
    `📅 Frequency: ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}\n` +
    `💵 Per purchase: $${amountPerPeriod.toFixed(2)}\n` +
    `🪙 ${asset} per purchase: ${coinsPerPeriod.toFixed(6)}\n` +
    `📈 Total ${asset} in 1 year: ${totalCoins.toFixed(4)}\n\n` +
    `*At current price of ${formatPrice(price)}*\n\n` +
    `💡 DCA reduces emotional decision-making and averages your cost basis over time. Stay consistent!`
  );
}
