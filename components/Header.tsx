'use client';

import { RefreshCw } from 'lucide-react';

interface Props {
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export default function Header({ lastUpdated, onRefresh }: Props) {
  return (
    <header className="border-b border-binance-border bg-binance-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-binance-yellow rounded-full flex items-center justify-center">
              <span className="text-binance-dark font-black text-sm">B</span>
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">BinanceAI</span>
              <span className="text-binance-yellow font-bold text-lg tracking-tight"> Scout</span>
            </div>
            <span className="hidden sm:inline text-xs text-binance-text bg-binance-border px-2 py-0.5 rounded-full ml-1">
              AI-Powered
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="hidden md:block text-xs text-binance-text">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 text-sm text-binance-text hover:text-white transition-colors bg-binance-border hover:bg-binance-border/70 px-3 py-1.5 rounded-lg"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <a
              href="https://t.me/BinanceAIScoutBot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-binance-yellow text-binance-dark font-semibold text-sm px-4 py-1.5 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.09 13.868l-2.95-.924c-.64-.203-.654-.64.135-.954l11.566-4.458c.537-.194 1.006.131.053 1.689z"/>
              </svg>
              Telegram Bot
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
