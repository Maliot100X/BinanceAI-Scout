'use client';

import { useState } from 'react';
import { Brain, Copy, Check } from 'lucide-react';

interface Props {
  brief: string;
}

// Convert markdown-style **bold** and *italic* to React spans
function renderBrief(text: string) {
  return text.split('\n').map((line, i) => {
    // Section headers
    if (line.startsWith('🤖') || line.startsWith('📅')) {
      return <p key={i} className="text-binance-yellow font-semibold text-sm mb-2">{line}</p>;
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return <p key={i} className="text-white font-semibold text-sm mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>;
    }
    if (line === '') return <br key={i} />;
    // Regular lines
    const rendered = line
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-binance-yellow">$1</em>');
    return (
      <p key={i} className="text-binance-text text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: rendered }} />
    );
  });
}

export default function AIBrief({ brief }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-binance-card border border-binance-border rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-binance-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-binance-yellow/10 rounded-lg flex items-center justify-center">
            <Brain size={16} className="text-binance-yellow" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">AI Market Brief</h2>
            <p className="text-binance-text text-xs mt-0.5">Real-time analysis • Auto-refreshes every 2 min</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-binance-text hover:text-white transition-colors bg-binance-border/50 hover:bg-binance-border px-3 py-1.5 rounded-lg"
        >
          {copied ? <Check size={12} className="text-binance-green" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="px-6 py-5 space-y-1">
        {brief ? (
          renderBrief(brief)
        ) : (
          <div className="flex items-center gap-2 text-binance-text text-sm">
            <div className="w-4 h-4 border border-binance-yellow border-t-transparent rounded-full animate-spin" />
            Generating brief...
          </div>
        )}
      </div>

      <div className="px-6 py-3 border-t border-binance-border/50 bg-binance-border/10">
        <p className="text-xs text-binance-text">
          💡 Get this brief in your Telegram with <span className="text-binance-yellow font-medium">/brief</span> command
        </p>
      </div>
    </div>
  );
}
