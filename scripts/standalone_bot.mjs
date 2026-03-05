// scripts/standalone_bot.mjs
import 'dotenv/config';
import fetch from 'node-fetch';

const BOT_TOKEN = '8734581553:AAEv3JBHx9WkGNbDuWLshJLM-w0wXTXrC8o';
const TG_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;
const CG_BASE = 'https://api.coingecko.com/api/v3';

const TRACKED_COINS = ['bitcoin','ethereum','binancecoin','solana','ripple','cardano','dogecoin','avalanche-2','polkadot','chainlink'];

async function fetchMarketData() {
    const [coinsRes, globalRes] = await Promise.all([
        fetch(`${CG_BASE}/coins/markets?vs_currency=usd&ids=${TRACKED_COINS.join(',')}&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`),
        fetch(`${CG_BASE}/global`)
    ]);
    const coins = await coinsRes.json();
    const global = await globalRes.json();
    return { coins, global: global.data };
}

async function sendMessage(chatId, text) {
    await fetch(`${TG_BASE}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
}

async function pollUpdates() {
    let offset = 0;
    console.log("🤖 Standalone BinanceAI Scout Bot is Polling...");
    
    while (true) {
        try {
            const res = await fetch(`${TG_BASE}/getUpdates?offset=${offset}&timeout=30`);
            const data = await res.json();
            
            if (data.result && data.result.length > 0) {
                for (const update of data.result) {
                    offset = update.update_id + 1;
                    if (update.message && update.message.text) {
                        const chatId = update.message.chat.id;
                        const text = update.message.text;
                        const name = update.message.from.first_name;
                        
                        console.log(`[MSG] ${name}: ${text}`);
                        
                        if (text === '/start') {
                            await sendMessage(chatId, `🤖 *Welcome, ${name}!* I am your BinanceAI Scout.\n\nCommands:\n/prices - Live Prices\n/movers - Top Gainers\n/help - All Commands`);
                        } else if (text === '/prices') {
                            const data = await fetchMarketData();
                            let msg = "💰 *Live Prices*\n\n";
                            data.coins.forEach(c => {
                                msg += `• *${c.symbol.toUpperCase()}*: $${c.current_price.toLocaleString()} (${c.price_change_percentage_24h.toFixed(2)}%)\n`;
                            });
                            await sendMessage(chatId, msg);
                        } else if (text === '/help') {
                            await sendMessage(chatId, "❓ *Commands*\n/start - Start\n/prices - Prices\n/movers - Gainers\n/fear - Sentiment");
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
