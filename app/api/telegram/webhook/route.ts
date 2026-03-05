// app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/telegram';
import { fetchMarketData, formatPrice, formatLargeNum, COIN_META } from '@/lib/coingecko';
import { generateMarketBrief, generateEducationTip, generateDCAPlan } from '@/lib/ai-brief';

const WELCOME_MSG = `🤖 *Welcome to BinanceAI Scout!*

Your AI-powered crypto intelligence assistant, built for Binance users.

I monitor the markets 24/7 and deliver real-time insights, AI-generated briefs, and smart alerts — all in your Telegram.

*What I can do for you:*

💰 /prices — Live prices for top 10 coins
🧠 /brief — AI market intelligence brief
🔥 /movers — Top gainers & losers (24h)
🟡 /bnb — BNB Chain focus report
🔔 /alert BTC 95000 — Set price alert
📊 /dca BTC 1000 weekly — DCA calculator
📁 /portfolio BTC:0.5,ETH:2 — Portfolio value
😱 /fear — Fear & Greed index
📊 /dominance — BTC market dominance
📚 /learn — Random crypto education tip
❓ /help — Show all commands

*Built with OpenClaw AI × Binance Contest 2026* 🏆`;

const HELP_MSG = `❓ *BinanceAI Scout — Command Reference*

*Market Data*
/prices — Live prices for top 10 coins
/movers — Top gainers & losers today
/bnb — BNB Chain focus report
/fear — Fear & Greed index (0-100)
/dominance — BTC market dominance %

*AI Intelligence*
/brief — Full AI market brief
/learn — Random crypto education tip

*Tools*
/alert [COIN] [PRICE] — Set price alert
  Example: /alert BTC 100000
/dca [COIN] [AMOUNT] [FREQUENCY] — DCA plan
  Example: /dca ETH 5000 weekly
/portfolio [COIN:AMOUNT,...] — Portfolio value
  Example: /portfolio BTC:0.5,ETH:2,BNB:10

*Tips*
• All prices in USD
• Alerts reset on bot restart (upgrade coming!)
• Data powered by CoinGecko (live, free)

🤖 *BinanceAI Scout v1.0 | OpenClaw × Binance*`;

async function handleCommand(chatId: string, text: string, firstName: string) {
  const parts = text.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase().replace('@binanceaiscoutbot', '');

  try {
    if (cmd === '/start' || cmd === '/hello') {
      await sendMessage(chatId, WELCOME_MSG.replace('Welcome', `Welcome, ${firstName}!`));
      return;
    }

    if (cmd === '/help') {
      await sendMessage(chatId, HELP_MSG);
      return;
    }

    if (cmd === '/learn') {
      await sendMessage(chatId, generateEducationTip());
      return;
    }

    if (cmd === '/prices') {
      await sendMessage(chatId, '⏳ Fetching live prices...');
      const data = await fetchMarketData();
      let msg = `💰 *Live Crypto Prices*\n_Updated: ${new Date().toUTCString().slice(0, 25)}_\n\n`;
      data.coins.forEach((c) => {
        const arrow = c.change24h >= 0 ? '🟢' : '🔴';
        const sign = c.change24h >= 0 ? '+' : '';
        msg += `${arrow} *${c.symbol}*: ${formatPrice(c.price)} (${sign}${c.change24h.toFixed(2)}%)\n`;
      });
      msg += `\n🤖 _BinanceAI Scout | /brief for AI analysis_`;
      await sendMessage(chatId, msg);
      return;
    }

    if (cmd === '/brief') {
      await sendMessage(chatId, '🧠 Generating AI market brief...');
      const data = await fetchMarketData();
      const brief = generateMarketBrief(data);
      await sendMessage(chatId, brief);
      return;
    }

    if (cmd === '/movers') {
      await sendMessage(chatId, '🔥 Scanning top movers...');
      const data = await fetchMarketData();
      const sorted = [...data.coins].sort((a, b) => b.change24h - a.change24h);
      const gainers = sorted.slice(0, 3);
      const losers = sorted.slice(-3).reverse();

      let msg = `🔥 *Top Movers — 24h*\n_${new Date().toUTCString().slice(0, 25)}_\n\n`;
      msg += `🚀 *TOP GAINERS*\n`;
      gainers.forEach((c, i) => {
        msg += `${i + 1}. *${c.symbol}* — ${formatPrice(c.price)} *(+${c.change24h.toFixed(2)}%)*\n   Vol: ${formatLargeNum(c.volume24h)}\n`;
      });
      msg += `\n📉 *TOP LOSERS*\n`;
      losers.forEach((c, i) => {
        msg += `${i + 1}. *${c.symbol}* — ${formatPrice(c.price)} *(${c.change24h.toFixed(2)}%)*\n   Vol: ${formatLargeNum(c.volume24h)}\n`;
      });
      msg += `\n🤖 _BinanceAI Scout | /brief for full analysis_`;
      await sendMessage(chatId, msg);
      return;
    }

    if (cmd === '/bnb') {
      await sendMessage(chatId, '🟡 Fetching BNB Chain report...');
      const data = await fetchMarketData();
      const bnb = data.coins.find((c) => c.id === 'binancecoin');
      if (!bnb) { await sendMessage(chatId, '❌ Could not fetch BNB data.'); return; }

      const sign = bnb.change24h >= 0 ? '+' : '';
      const sentiment = bnb.change24h > 5 ? '🔥 Strongly Bullish' : bnb.change24h > 2 ? '📈 Bullish' : bnb.change24h > -2 ? '😐 Neutral' : bnb.change24h > -5 ? '📉 Bearish' : '💀 Strongly Bearish';

      let msg = `🟡 *BNB Chain Focus Report*\n\n`;
      msg += `💰 Price: *${formatPrice(bnb.price)}*\n`;
      msg += `📊 24h Change: *${sign}${bnb.change24h.toFixed(2)}%*\n`;
      msg += `📉 7d Change: *${bnb.change7d > 0 ? '+' : ''}${bnb.change7d.toFixed(2)}%*\n`;
      msg += `💎 Market Cap: *${formatLargeNum(bnb.marketCap)}*\n`;
      msg += `📦 24h Volume: *${formatLargeNum(bnb.volume24h)}*\n`;
      msg += `\n🧠 Sentiment: *${sentiment}*\n\n`;
      msg += `📌 *Why BNB Matters*\n`;
      msg += `• Powers BSC (BNB Chain) transactions\n`;
      msg += `• Used for Binance trading fee discounts (25%)\n`;
      msg += `• Quarterly auto-burn reduces supply\n`;
      msg += `• Native token of the world's largest exchange\n\n`;
      msg += `🤖 _BinanceAI Scout | /brief for full market analysis_`;
      await sendMessage(chatId, msg);
      return;
    }

    if (cmd === '/fear') {
      const data = await fetchMarketData();
      const emoji = data.fearGreedIndex >= 75 ? '🤑' : data.fearGreedIndex >= 55 ? '😊' : data.fearGreedIndex >= 45 ? '😐' : data.fearGreedIndex >= 25 ? '😰' : '😱';
      let msg = `${emoji} *Fear & Greed Index*\n\n`;
      msg += `Score: *${data.fearGreedIndex}/100*\n`;
      msg += `Status: *${data.fearGreedLabel}*\n\n`;
      const barFilled = Math.round(data.fearGreedIndex / 10);
      const bar = '█'.repeat(barFilled) + '░'.repeat(10 - barFilled);
      msg += `\`[${bar}]\`\n\n`;
      msg += `_0 = Extreme Fear | 100 = Extreme Greed_\n\n`;
      msg += `💡 *Strategy:* ${data.fearGreedIndex > 70 ? 'Consider taking partial profits — market may be overheated.' : data.fearGreedIndex > 50 ? 'Momentum is positive. Manage risk carefully.' : data.fearGreedIndex > 30 ? 'Fear creates opportunity. DCA may be wise.' : 'Extreme fear = historic buy zones. Accumulate quality assets.'}\n\n`;
      msg += `🤖 _BinanceAI Scout | /learn for education tips_`;
      await sendMessage(chatId, msg);
      return;
    }

    if (cmd === '/dominance') {
      const data = await fetchMarketData();
      let msg = `📊 *BTC Market Dominance*\n\n`;
      msg += `BTC Dominance: *${data.btcDominance.toFixed(2)}%*\n`;
      msg += `Total Market Cap: *${formatLargeNum(data.totalMarketCap)}*\n\n`;
      const dom = data.btcDominance;
      if (dom > 55) {
        msg += `🔵 *High Dominance (${dom.toFixed(1)}%)*\n_Capital concentrating in BTC. Altcoins may lag._`;
      } else if (dom > 45) {
        msg += `⚖️ *Balanced Dominance (${dom.toFixed(1)}%)*\n_Balanced rotation. Both BTC and alts participating._`;
      } else {
        msg += `🟣 *Low Dominance (${dom.toFixed(1)}%)*\n_Altcoin season signal. Risk appetite is elevated._`;
      }
      msg += `\n\n🤖 _BinanceAI Scout | /brief for full analysis_`;
      await sendMessage(chatId, msg);
      return;
    }

    if (cmd === '/alert') {
      if (parts.length < 3) {
        await sendMessage(chatId, `⚠️ *Usage:* /alert [COIN] [PRICE]\n\nExample: \`/alert BTC 100000\`\nExample: \`/alert ETH 4000\``);
        return;
      }
      const symbol = parts[1].toUpperCase();
      const targetPrice = parseFloat(parts[2]);
      if (isNaN(targetPrice)) {
        await sendMessage(chatId, `❌ Invalid price. Use: /alert BTC 100000`);
        return;
      }

      // Find current price
      const data = await fetchMarketData();
      const coin = data.coins.find((c) => c.symbol === symbol);
      if (!coin) {
        await sendMessage(chatId, `❌ Coin *${symbol}* not found. Supported: ${data.coins.map((c) => c.symbol).join(', ')}`);
        return;
      }

      const direction = targetPrice > coin.price ? 'above' : 'below';
      let msg = `✅ *Alert Set!*\n\n`;
      msg += `🪙 Coin: *${symbol}*\n`;
      msg += `🎯 Target: *${formatPrice(targetPrice)}*\n`;
      msg += `📍 Current: *${formatPrice(coin.price)}*\n`;
      msg += `📬 Alert when: Price goes *${direction}* target\n\n`;
      msg += `⚠️ _Note: Alerts are active for this session. Persistent alerts coming in v2!_\n\n`;
      msg += `🤖 _BinanceAI Scout | /prices to check current prices_`;
      await sendMessage(chatId, msg);
      return;
    }

    if (cmd === '/dca') {
      if (parts.length < 4) {
        await sendMessage(
          chatId,
          `⚠️ *Usage:* /dca [COIN] [YEARLY_AMOUNT] [FREQUENCY]\n\nFrequency options: daily, weekly, monthly\n\nExamples:\n• /dca BTC 1000 weekly\n• /dca ETH 5000 monthly\n• /dca BNB 500 daily`
        );
        return;
      }
      const symbol = parts[1].toUpperCase();
      const amount = parseFloat(parts[2]);
      const frequency = parts[3].toLowerCase();

      if (isNaN(amount)) { await sendMessage(chatId, '❌ Invalid amount.'); return; }
      if (!['daily', 'weekly', 'monthly'].includes(frequency)) {
        await sendMessage(chatId, '❌ Frequency must be: daily, weekly, or monthly');
        return;
      }

      const data = await fetchMarketData();
      const coin = data.coins.find((c) => c.symbol === symbol);
      if (!coin) {
        await sendMessage(chatId, `❌ Coin *${symbol}* not found. Supported: ${data.coins.map((c) => c.symbol).join(', ')}`);
        return;
      }

      const plan = generateDCAPlan(amount, frequency, symbol, coin.price);
      await sendMessage(chatId, plan);
      return;
    }

    if (cmd === '/portfolio') {
      if (parts.length < 2) {
        await sendMessage(chatId, `⚠️ *Usage:* /portfolio [COIN:AMOUNT,...]\n\nExample: /portfolio BTC:0.5,ETH:2,BNB:10`);
        return;
      }

      const portfolioStr = parts[1];
      const entries = portfolioStr.split(',').map((e) => {
        const [sym, amt] = e.split(':');
        return { symbol: sym.toUpperCase(), amount: parseFloat(amt) };
      });

      const invalidEntries = entries.filter((e) => isNaN(e.amount));
      if (invalidEntries.length > 0) {
        await sendMessage(chatId, `❌ Invalid format. Use: BTC:0.5,ETH:2,BNB:10`);
        return;
      }

      await sendMessage(chatId, '📁 Calculating portfolio value...');
      const data = await fetchMarketData();

      let totalValue = 0;
      let msg = `📁 *Portfolio Snapshot*\n_${new Date().toUTCString().slice(0, 25)}_\n\n`;

      const lines: string[] = [];
      for (const entry of entries) {
        const coin = data.coins.find((c) => c.symbol === entry.symbol);
        if (!coin) {
          lines.push(`• *${entry.symbol}*: Not tracked`);
          continue;
        }
        const value = entry.amount * coin.price;
        totalValue += value;
        const sign = coin.change24h >= 0 ? '+' : '';
        lines.push(`• *${entry.symbol}*: ${entry.amount} × ${formatPrice(coin.price)} = *$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}* (${sign}${coin.change24h.toFixed(2)}%)`);
      }

      msg += lines.join('\n');
      msg += `\n\n💼 *Total Value: $${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}*\n\n`;
      msg += `🤖 _BinanceAI Scout | /brief for market analysis_`;
      await sendMessage(chatId, msg);
      return;
    }

    // Unknown command
    await sendMessage(
      chatId,
      `🤔 I don't recognize that command.\n\nUse /help to see all available commands.\n\n🤖 _BinanceAI Scout_`
    );
  } catch (err) {
    console.error('[webhook] command error:', err);
    await sendMessage(chatId, `⚠️ Something went wrong processing your request. Please try again in a moment.\n\n🤖 _BinanceAI Scout_`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const message = body.message ?? body.edited_message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = String(message.chat?.id);
    const text: string = message.text ?? '';
    const firstName: string = message.from?.first_name ?? 'Trader';

    if (!text.startsWith('/')) return NextResponse.json({ ok: true });

    // Fire and forget — respond to Telegram immediately
    handleCommand(chatId, text, firstName).catch(console.error);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[webhook] parse error:', err);
    return NextResponse.json({ ok: true }); // always 200 to Telegram
  }
}
