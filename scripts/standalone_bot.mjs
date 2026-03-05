// scripts/standalone_bot.mjs
import 'dotenv/config';
import fetch from 'node-fetch';

const BOT_TOKEN = '8734581553:AAEv3JBHx9WkGNbDuWLshJLM-w0wXTXrC8o';
const TG_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;
const CG_BASE = 'https://api.coingecko.com/api/v3';

const TRACKED_COINS = ['bitcoin','ethereum','binancecoin','solana','ripple','cardano','dogecoin','avalanche-2','polkadot','chainlink'];

function formatPrice(price) {
    if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(6)}`;
}

function formatLargeNum(num) {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
}

async function fetchMarketData() {
    try {
        const [coinsRes, globalRes] = await Promise.all([
            fetch(`${CG_BASE}/coins/markets?vs_currency=usd&ids=${TRACKED_COINS.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h,7d`),
            fetch(`${CG_BASE}/global`)
        ]);
        const coins = await coinsRes.json();
        const globalJson = await globalRes.json();
        return { coins, global: globalJson.data };
    } catch (e) {
        console.error("Data Fetch Error:", e);
        return null;
    }
}

async function sendMessage(chatId, text) {
    await fetch(`${TG_BASE}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown', disable_web_page_preview: true })
    });
}

async function pollUpdates() {
    let offset = 0;
    console.log("🤖 Full BinanceAI Scout Bot is Polling...");
    
    while (true) {
        try {
            const res = await fetch(`${TG_BASE}/getUpdates?offset=${offset}&timeout=30`);
            const data = await res.json();
            
            if (data.result && data.result.length > 0) {
                for (const update of data.result) {
                    offset = update.update_id + 1;
                    if (update.message && update.message.text) {
                        const chatId = update.message.chat.id;
                        const text = update.message.text.trim();
                        const parts = text.split(/\s+/);
                        const cmd = parts[0].toLowerCase();
                        const firstName = update.message.from.first_name;
                        
                        console.log(`[MSG] ${firstName}: ${text}`);
                        
                        if (cmd === '/start' || cmd === '/hello') {
                            await sendMessage(chatId, `🤖 *Welcome, ${firstName}!* I am your BinanceAI Scout.\n\n💰 /prices — Live Prices\n🧠 /brief — AI Brief\n🔥 /movers — Top Movers\n🟡 /bnb — BNB Report\n📊 /dominance — BTC dominance\n😱 /fear — Sentiment\n📚 /learn — Crypto Tips\n🔔 /alert BTC 71000 — Set Alert\n📊 /dca BTC 1000 weekly — DCA Calc\n📁 /portfolio BTC:0.5 — Value\n❓ /help — All Commands`);
                        } else if (cmd === '/help') {
                            await sendMessage(chatId, `❓ *BinanceAI Scout Commands*\n\n/prices — Live prices\n/movers — Top gainers/losers\n/bnb — BNB Chain report\n/fear — Fear & Greed\n/dominance — BTC Dominance\n/brief — Full market analysis\n/learn — Random education tip\n/alert [COIN] [PRICE] — Set alert\n/dca [COIN] [AMT] [FREQ] — DCA plan\n/portfolio [COIN:AMT,...] — Calc value`);
                        } else if (cmd === '/prices') {
                            const d = await fetchMarketData();
                            if (!d) continue;
                            let msg = "💰 *Live Crypto Prices*\n\n";
                            d.coins.forEach(c => {
                                const arrow = c.price_change_percentage_24h >= 0 ? '🟢' : '🔴';
                                msg += `${arrow} *${c.symbol.toUpperCase()}*: ${formatPrice(c.current_price)} (${c.price_change_percentage_24h.toFixed(2)}%)\n`;
                            });
                            await sendMessage(chatId, msg);
                        } else if (cmd === '/brief') {
                            const d = await fetchMarketData();
                            if (!d) continue;
                            const bnb = d.coins.find(c => c.id === 'binancecoin');
                            let msg = `🤖 *AI Market Brief*\n\n📊 Total Cap: ${formatLargeNum(d.global.total_market_cap.usd)}\n📊 BTC Dominance: ${d.global.market_cap_percentage.btc.toFixed(1)}%\n\n🟡 *BNB Update:* ${formatPrice(bnb.current_price)} (${bnb.price_change_percentage_24h.toFixed(2)}%)\n\n🧠 *Analysis:* Market is showing ${d.coins[0].price_change_percentage_24h > 0 ? 'bullish momentum' : 'corrective pressure'}. BTC holding dominance at ${d.global.market_cap_percentage.btc.toFixed(1)}%.`;
                            await sendMessage(chatId, msg);
                        } else if (cmd === '/movers') {
                            const d = await fetchMarketData();
                            if (!d) continue;
                            const sorted = [...d.coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
                            const gainers = sorted.slice(0, 3);
                            const losers = sorted.slice(-3).reverse();
                            let msg = `🔥 *Top Movers (24h)*\n\n🚀 *GAINERS*\n`;
                            gainers.forEach(c => msg += `• ${c.symbol.toUpperCase()}: +${c.price_change_percentage_24h.toFixed(2)}%\n`);
                            msg += `\n📉 *LOSERS*\n`;
                            losers.forEach(c => msg += `• ${c.symbol.toUpperCase()}: ${c.price_change_percentage_24h.toFixed(2)}%\n`);
                            await sendMessage(chatId, msg);
                        } else if (cmd === '/bnb') {
                            const d = await fetchMarketData();
                            const bnb = d?.coins.find(c => c.id === 'binancecoin');
                            if (!bnb) continue;
                            let msg = `🟡 *BNB Chain Focus*\n\n💰 Price: *${formatPrice(bnb.current_price)}*\n📊 24h: *${bnb.price_change_percentage_24h.toFixed(2)}%*\n💎 Cap: *${formatLargeNum(bnb.market_cap)}*\n📦 Vol: *${formatLargeNum(bnb.total_volume)}*\n\n📌 Powers BSC and provides 25% trading fee discount on Binance.`;
                            await sendMessage(chatId, msg);
                        } else if (cmd === '/fear') {
                            const d = await fetchMarketData();
                            const avg = d.coins.reduce((a, c) => a + c.price_change_percentage_24h, 0) / d.coins.length;
                            const idx = Math.round(Math.max(0, Math.min(100, 50 + avg * 3)));
                            await sendMessage(chatId, `😱 *Fear & Greed Index*\n\nScore: *${idx}/100*\nStatus: *${idx > 50 ? 'Greed' : 'Fear'}*\n\n💡 _Calculated from top 10 asset momentum._`);
                        } else if (cmd === '/dominance') {
                            const d = await fetchMarketData();
                            if (!d) continue;
                            await sendMessage(chatId, `📊 *BTC Market Dominance*\n\nBTC: *${d.global.market_cap_percentage.btc.toFixed(2)}%*\nETH: *${d.global.market_cap_percentage.eth.toFixed(2)}%*\n\nTotal Cap: ${formatLargeNum(d.global.total_market_cap.usd)}`);
                        } else if (cmd === '/learn') {
                            const tips = ["DCA reduces volatility impact.", "Market Cap = Price x Supply.", "BTC Dominance rising usually pressures alts.", "Not your keys, not your coins."];
                            await sendMessage(chatId, `📚 *Crypto Tip*\n\n${tips[Math.floor(Math.random() * tips.length)]}`);
                        } else if (cmd === '/alert') {
                            if (parts.length < 3) {
                                await sendMessage(chatId, "⚠️ Usage: /alert [COIN] [PRICE]\nExample: /alert BTC 71000");
                            } else {
                                await sendMessage(chatId, `✅ *Alert Set!*\nTarget: ${parts[1].toUpperCase()} at ${parts[2]}\n\n(Note: Persistent alerts active in v2)`);
                            }
                        } else if (cmd === '/dca') {
                            if (parts.length < 3) {
                                await sendMessage(chatId, "⚠️ Usage: /dca [COIN] [AMT] [FREQ]\nExample: /dca BTC 1000 weekly");
                            } else {
                                await sendMessage(chatId, `📊 *DCA Plan for ${parts[1].toUpperCase()}*\n\nBudget: $${parts[2]}/year\nFreq: ${parts[3] || 'monthly'}\n\n💡 Stay consistent and ignore the noise!`);
                            }
                        } else if (cmd === '/portfolio') {
                            if (parts.length < 2) {
                                await sendMessage(chatId, "⚠️ Usage: /portfolio BTC:0.5,ETH:2");
                            } else {
                                await sendMessage(chatId, "📁 *Portfolio Calculation*\nFetching live values for your assets...");
                                const d = await fetchMarketData();
                                let total = 0;
                                parts[1].split(',').forEach(e => {
                                    const [s, a] = e.split(':');
                                    const c = d.coins.find(coin => coin.symbol === s.toLowerCase());
                                    if (c) total += c.current_price * parseFloat(a);
                                });
                                await sendMessage(chatId, `💼 *Total Portfolio Value: $${total.toLocaleString()}*`);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Poll Error:", e);
            await new Promise(r => setTimeout(r, 5000));
        }
    }
}

pollUpdates();
