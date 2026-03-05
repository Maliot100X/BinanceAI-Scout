'use client';

interface Props {
  index: number;
  label: string;
}

export default function FearGauge({ index, label }: Props) {
  const color =
    index >= 75
      ? '#0ECB81'
      : index >= 55
      ? '#9ef01a'
      : index >= 45
      ? '#F0B90B'
      : index >= 25
      ? '#f77f00'
      : '#F6465D';

  const emoji =
    index >= 75 ? '🤑' : index >= 55 ? '😊' : index >= 45 ? '😐' : index >= 25 ? '😰' : '😱';

  const rotation = (index / 100) * 180 - 90; // -90 to +90 degrees

  return (
    <div className="bg-binance-card border border-binance-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-binance-border">
        <h3 className="text-white font-semibold">Fear & Greed Index</h3>
        <p className="text-binance-text text-xs mt-0.5">Market sentiment meter</p>
      </div>

      <div className="px-5 py-6 flex flex-col items-center">
        {/* Gauge Arc */}
        <div className="relative w-40 h-20 overflow-hidden mb-2">
          <svg viewBox="0 0 160 90" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 10 80 A 70 70 0 0 1 150 80"
              fill="none"
              stroke="#2B3139"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Color arc segments */}
            <path d="M 10 80 A 70 70 0 0 1 45 22" fill="none" stroke="#F6465D" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
            <path d="M 45 22 A 70 70 0 0 1 80 10" fill="none" stroke="#f77f00" strokeWidth="12" opacity="0.6" />
            <path d="M 80 10 A 70 70 0 0 1 115 22" fill="none" stroke="#F0B90B" strokeWidth="12" opacity="0.6" />
            <path d="M 115 22 A 70 70 0 0 1 150 80" fill="none" stroke="#0ECB81" strokeWidth="12" strokeLinecap="round" opacity="0.6" />
            {/* Needle */}
            <g transform={`rotate(${rotation}, 80, 80)`}>
              <line x1="80" y1="80" x2="80" y2="20" stroke={color} strokeWidth="3" strokeLinecap="round" />
              <circle cx="80" cy="80" r="6" fill={color} />
            </g>
          </svg>
        </div>

        {/* Score */}
        <div className="text-center">
          <div className="text-4xl font-black" style={{ color }}>{index}</div>
          <div className="text-sm font-semibold mt-1" style={{ color }}>{emoji} {label}</div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between w-full mt-4 text-xs text-binance-text">
          <span>Extreme Fear</span>
          <span>Neutral</span>
          <span>Extreme Greed</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-binance-border rounded-full h-2 mt-2">
          <div
            className="h-2 rounded-full transition-all duration-1000"
            style={{ width: `${index}%`, backgroundColor: color }}
          />
        </div>
      </div>

      <div className="px-5 py-3 border-t border-binance-border/50 bg-binance-border/10">
        <p className="text-xs text-binance-text text-center">
          Use <span className="text-binance-yellow font-medium">/fear</span> on Telegram
        </p>
      </div>
    </div>
  );
}
