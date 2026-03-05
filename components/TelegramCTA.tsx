'use client';

export default function TelegramCTA() {
  const commands = [
    { cmd: '/prices', desc: 'Live prices' },
    { cmd: '/brief', desc: 'AI analysis' },
    { cmd: '/movers', desc: 'Gainers & losers' },
    { cmd: '/alert BTC 100000', desc: 'Price alert' },
    { cmd: '/dca ETH 1000 weekly', desc: 'DCA plan' },
    { cmd: '/portfolio BTC:0.5', desc: 'Portfolio value' },
    { cmd: '/fear', desc: 'Sentiment index' },
    { cmd: '/learn', desc: 'Crypto education' },
  ];

  return (
    <div className="bg-binance-card border border-binance-yellow/30 rounded-2xl overflow-hidden yellow-glow">
      {/* Header */}
      <div className="px-5 py-4 bg-binance-yellow/5 border-b border-binance-yellow/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-binance-yellow rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-binance-dark" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.09 13.868l-2.95-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.537-.194 1.006.131.053 1.689z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold">Telegram Bot</h3>
            <p className="text-binance-text text-xs">Free • No signup required</p>
          </div>
        </div>
      </div>

      {/* Commands list */}
      <div className="px-5 py-4">
        <p className="text-binance-text text-xs mb-3">Available commands:</p>
        <div className="space-y-1.5">
          {commands.map((c) => (
            <div key={c.cmd} className="flex items-center justify-between gap-2">
              <code className="text-binance-yellow text-xs bg-binance-border/50 px-2 py-0.5 rounded font-mono truncate">
                {c.cmd}
              </code>
              <span className="text-binance-text text-xs flex-shrink-0">{c.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <a
          href="https://t.me/BinanceAIScoutBot"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-binance-yellow text-binance-dark font-bold py-3 rounded-xl hover:bg-yellow-400 transition-colors text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.09 13.868l-2.95-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.537-.194 1.006.131.053 1.689z"/>
          </svg>
          Open Telegram Bot
        </a>
      </div>
    </div>
  );
}
