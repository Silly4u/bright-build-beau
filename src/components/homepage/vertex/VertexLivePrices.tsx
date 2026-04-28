import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { fetchBinanceTickers } from '@/lib/binance';

const COINS = [
  { symbol: 'BTC', binance: 'BTCUSDT', color: '#F7931A' },
  { symbol: 'ETH', binance: 'ETHUSDT', color: '#627EEA' },
  { symbol: 'SOL', binance: 'SOLUSDT', color: '#00D2D3' },
  { symbol: 'BNB', binance: 'BNBUSDT', color: '#F0B90B' },
  { symbol: 'XRP', binance: 'XRPUSDT', color: '#00AAE4' },
  { symbol: 'ADA', binance: 'ADAUSDT', color: '#0033AD' },
  { symbol: 'DOGE', binance: 'DOGEUSDT', color: '#C2A633' },
  { symbol: 'AVAX', binance: 'AVAXUSDT', color: '#E84142' },
  { symbol: 'LINK', binance: 'LINKUSDT', color: '#2A5ADA' },
  { symbol: 'TON', binance: 'TONUSDT', color: '#0098EA' },
];

interface Row { symbol: string; color: string; price: number; change: number; }

const fmt = (n: number) => {
  if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (n >= 1) return n.toFixed(2);
  return n.toFixed(4);
};

const VertexLivePrices: React.FC = () => {
  const [rows, setRows] = useState<Row[]>(COINS.map((c) => ({ symbol: c.symbol, color: c.color, price: 0, change: 0 })));

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const map = await fetchBinanceTickers(COINS.map((c) => c.binance));
        if (!mounted) return;
        setRows(COINS.map((c) => {
          const t = map[c.binance];
          return {
            symbol: c.symbol,
            color: c.color,
            price: t?.lastPrice ? parseFloat(t.lastPrice) : 0,
            change: t?.priceChangePercent ? parseFloat(t.priceChangePercent) : 0,
          };
        }));
      } catch { /* keep last */ }
    };
    load();
    const id = setInterval(load, 30000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  // Duplicate rows for seamless marquee
  const track = [...rows, ...rows];

  return (
    <section className="relative py-12 md:py-16 z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono uppercase tracking-[0.3em] text-xs text-white/50">Live markets</p>
          <h3 className="font-display text-2xl md:text-3xl mt-2">
            Thị trường <span className="text-accent-gradient">thời gian thực</span>
          </h3>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-white/50">
          <span className="w-2 h-2 rounded-full bg-[#00D2D3] animate-pulse" />
          streaming · Binance
        </div>
      </div>

      <div className="marquee-mask overflow-hidden">
        <div className="ticker-track flex gap-3 py-2 w-max">
          {track.map((c, i) => (
            <div
              key={`${c.symbol}-${i}`}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl glass min-w-[220px]"
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-semibold text-xs"
                style={{ background: `${c.color}22`, color: c.color, boxShadow: `0 0 18px ${c.color}33` }}
              >
                {c.symbol}
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-semibold leading-tight">
                  ${c.price > 0 ? fmt(c.price) : '...'}
                </span>
                <span className={`font-mono text-xs flex items-center gap-1 ${c.change >= 0 ? 'text-[#00D2D3]' : 'text-[#FF5B22]'}`}>
                  {c.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {c.change >= 0 ? '+' : ''}{c.change.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VertexLivePrices;
