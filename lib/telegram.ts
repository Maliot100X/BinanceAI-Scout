// lib/telegram.ts
// Telegram Bot API helper

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TG_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendMessage(
  chatId: number | string,
  text: string,
  options: Record<string, unknown> = {}
): Promise<void> {
  await fetch(`${TG_BASE}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
      ...options,
    }),
  });
}

export async function sendPhoto(
  chatId: number | string,
  photoUrl: string,
  caption?: string
): Promise<void> {
  await fetch(`${TG_BASE}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoUrl,
      caption,
      parse_mode: 'Markdown',
    }),
  });
}

export async function setWebhook(webhookUrl: string): Promise<unknown> {
  const res = await fetch(`${TG_BASE}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ['message', 'callback_query'],
      drop_pending_updates: true,
    }),
  });
  return res.json();
}

export async function setMyCommands(): Promise<unknown> {
  const commands = [
    { command: 'start', description: '🚀 Welcome & overview' },
    { command: 'prices', description: '💰 Live crypto prices' },
    { command: 'brief', description: '🧠 AI market intelligence brief' },
    { command: 'movers', description: '🔥 Top gainers & losers today' },
    { command: 'bnb', description: '🟡 BNB Chain focus report' },
    { command: 'alert', description: '🔔 Set a price alert (e.g. /alert BTC 90000)' },
    { command: 'dca', description: '📊 DCA calculator (e.g. /dca BTC 1000 weekly)' },
    { command: 'learn', description: '📚 Random crypto education tip' },
    { command: 'portfolio', description: '📁 Track your portfolio (e.g. /portfolio BTC:0.5,ETH:2)' },
    { command: 'fear', description: '😱 Fear & Greed Index' },
    { command: 'dominance', description: '📊 BTC market dominance' },
    { command: 'help', description: '❓ Show all commands' },
  ];

  const res = await fetch(`${TG_BASE}/setMyCommands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commands }),
  });
  return res.json();
}

// In-memory alert store (ephemeral — resets on cold start)
// For production: use a DB (Vercel KV / Redis)
export const alertStore: Map<string, { symbol: string; targetPrice: number; direction: 'above' | 'below'; chatId: string }[]> = new Map();

export function addAlert(chatId: string, symbol: string, targetPrice: number, direction: 'above' | 'below') {
  const existing = alertStore.get(chatId) ?? [];
  existing.push({ symbol, targetPrice, direction, chatId });
  alertStore.set(chatId, existing);
}
