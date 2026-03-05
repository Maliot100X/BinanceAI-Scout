import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BinanceAI Scout — AI-Powered Crypto Intelligence',
  description:
    'Real-time crypto market monitoring, AI-generated market briefs, smart price alerts, and DCA tools. Powered by OpenClaw AI.',
  keywords: ['Binance', 'crypto', 'AI', 'trading', 'Bitcoin', 'BNB', 'portfolio'],
  openGraph: {
    title: 'BinanceAI Scout',
    description: 'Your AI-Powered Crypto Intelligence Assistant',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-binance-dark text-white font-sans antialiased min-h-screen">{children}</body>
    </html>
  );
}
