'use client';

export default function Footer() {
  return (
    <footer className="border-t border-binance-border bg-binance-card mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-binance-yellow rounded-full flex items-center justify-center">
                <span className="text-binance-dark font-black text-xs">B</span>
              </div>
              <span className="text-white font-bold">BinanceAI Scout</span>
            </div>
            <p className="text-binance-text text-sm leading-relaxed">
              AI-powered crypto intelligence. Real-time market monitoring, smart alerts, and educational tools — all in one place.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Features</h4>
            <ul className="space-y-1.5 text-binance-text text-sm">
              <li>📊 Real-time Market Prices</li>
              <li>🧠 AI Market Intelligence Briefs</li>
              <li>🔔 Smart Price Alerts</li>
              <li>📁 Portfolio Tracker</li>
              <li>📊 DCA Calculator</li>
              <li>📚 Crypto Education</li>
            </ul>
          </div>

          {/* Contest info */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">About</h4>
            <p className="text-binance-text text-sm leading-relaxed mb-3">
              Built for the <span className="text-binance-yellow font-medium">Binance OpenClaw AI Contest 2026</span>. 
              Combining real-time market data with AI-generated insights to help every crypto user make smarter decisions.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-binance-border text-binance-text px-2 py-1 rounded-full">OpenClaw AI</span>
              <span className="text-xs bg-binance-border text-binance-text px-2 py-1 rounded-full">CoinGecko API</span>
              <span className="text-xs bg-binance-border text-binance-text px-2 py-1 rounded-full">Next.js 14</span>
              <span className="text-xs bg-binance-border text-binance-text px-2 py-1 rounded-full">Telegram Bot</span>
            </div>
          </div>
        </div>

        <div className="border-t border-binance-border/50 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-binance-text text-xs">
            © 2026 BinanceAI Scout. Built with ❤️ using OpenClaw AI.
          </p>
          <p className="text-binance-text text-xs">
            ⚠️ Not financial advice. For educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
