<<<<<<< HEAD
# BinanceAI-Scout
=======
# BinanceAI Scout 🤖📊

> **Binance OpenClaw AI Contest 2026 Entry**
> 
> AI-Powered Crypto Portfolio Intelligence — Real-time market monitoring, AI-generated briefs, smart alerts, DCA tools, and a full Telegram bot.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/binance-ai-scout)

## 🚀 Features

- **📊 Live Market Dashboard** — Real-time prices, 24h/7d changes, market cap, volume for top 10 assets
- **🧠 AI Market Brief** — Intelligent market analysis auto-generated from live data
- **🔥 Top Movers Panel** — Biggest gainers & losers at a glance
- **😱 Fear & Greed Gauge** — Visual sentiment meter with strategy tips
- **🤖 Full Telegram Bot** — 12 commands covering everything from alerts to DCA calculators
- **📚 Crypto Education** — Built-in tips explaining key concepts in plain English
- **🔔 Price Alerts** — Set target prices and get notified instantly

## 🤖 Telegram Bot Commands

| Command | Description |
|---|---|
| `/start` | Welcome & overview |
| `/prices` | Live prices for top 10 coins |
| `/brief` | Full AI market intelligence brief |
| `/movers` | Top gainers & losers (24h) |
| `/bnb` | BNB Chain focus report |
| `/alert BTC 100000` | Set price alert |
| `/dca ETH 1000 weekly` | DCA calculator |
| `/portfolio BTC:0.5,ETH:2` | Portfolio snapshot |
| `/fear` | Fear & Greed index |
| `/dominance` | BTC market dominance |
| `/learn` | Random crypto education tip |
| `/help` | All commands |

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (Binance dark theme)
- **Market Data:** CoinGecko API (free, no key required)
- **Bot:** Telegram Bot API with webhook
- **Deploy:** Vercel (one-click)

## 🚀 Deploy to Vercel

1. **Clone the repo**
```bash
git clone https://github.com/yourusername/binance-ai-scout
cd binance-ai-scout
```

2. **Install dependencies**
```bash
npm install
```

3. **Set environment variables** (copy `.env.example` → `.env.local`)
```
TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

4. **Deploy to Vercel**
```bash
npx vercel --prod
```

5. **Register the Telegram webhook** (one-time, after deploy)
```
GET https://your-app.vercel.app/api/setup-webhook
```

## 🏗️ Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## 📁 Project Structure

```
binance-ai-scout/
├── app/
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tailwind + custom styles
│   └── api/
│       ├── market/           # Live market data endpoint
│       ├── brief/            # AI brief endpoint
│       ├── setup-webhook/    # One-time webhook setup
│       └── telegram/webhook/ # Telegram bot handler
├── components/
│   ├── Header.tsx
│   ├── MarketTicker.tsx      # Live price ticker strip
│   ├── StatBar.tsx           # Market stats bar
│   ├── PriceTable.tsx        # Full price table
│   ├── AIBrief.tsx           # AI analysis panel
│   ├── MoversPanel.tsx       # Top gainers/losers
│   ├── FearGauge.tsx         # Fear & Greed meter
│   ├── TelegramCTA.tsx       # Bot call-to-action
│   └── Footer.tsx
└── lib/
    ├── coingecko.ts          # Market data fetcher
    ├── ai-brief.ts           # Brief & education generator
    └── telegram.ts           # Bot API helpers
```

## ⚠️ Disclaimer

This tool is for educational and informational purposes only. Not financial advice. Always do your own research.

---

*Built with ❤️ using OpenClaw AI × Next.js × Telegram API*
>>>>>>> ebe94e0 (feat: Initial commit for BinanceAI Scout — AI-Powered Intelligence Assistant 🤖📊)
