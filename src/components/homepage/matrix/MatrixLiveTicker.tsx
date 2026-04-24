import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Ticker {
  symbol: string;
  display: string;
  price: number | null;
  change: number | null;
  loading: boolean;
}

const PAIRS: { symbol: string; display: string }[] = [
  { symbol: 'BTCUSDT', display: 'BTC/USDT' },
  { symbol: 'ETHUSDT', display: 'ETH/USDT' },
  { symbol: 'SOLUSDT', display: 'SOL/USDT' },
];

const formatPrice = (p: number) =>
  p >= 1000 ? p.toLocaleString('en-US', { maximumFractionDigits: 0 }) : p.toFixed(2);

const MatrixLiveTicker: React.FC = () => {
  const [tickers, setTickers] = useState<Ticker[]>(
    PAIRS.map(p => ({ ...p, price: null, change: null, loading: true }))
  );

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.allSettled(
        PAIRS.map(p =>
          supabase.functions.invoke('binance-proxy', {
            body: null,
            method: 'GET',
            headers: { 'x-symbol': p.symbol },
          }).then(({ data, error }) => {
            if (error) throw error;
            return data;
          })
        )
      );
      setTickers(prev =>
        prev.map((t, i) => {
          const r = results[i];
          if (r.status === 'fulfilled' && r.value?.lastPrice) {
            return {
              ...t,
              price: parseFloat(r.value.lastPrice),
              change: parseFloat(r.value.priceChangePercent),
              loading: false,
            };
          }
          return { ...t, loading: false };
        })
      );
    };
    fetchAll();
    const i = setInterval(fetchAll, 8000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="bg-[#0D0F16] border border-white/10 relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-[linear-gradient(90deg,#00F0FF_0%,transparent_100%)]" />
      <div className="p-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h3 className="font-mono text-xs text-foreground font-bold tracking-[0.2em]">LIVE_TICKER</h3>
        <div className="flex gap-1">
          <div className="size-1.5 bg-cyan-brand rounded-full animate-bounce" />
          <div className="size-1.5 bg-cyan-brand rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="size-1.5 bg-cyan-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
      <div className="flex flex-col">
        {tickers.map((t, i) => {
          const up = (t.change ?? 0) >= 0;
          return (
            <div
              key={t.symbol}
              className={`p-3 lg:p-4 flex items-center justify-between hover:bg-white/5 transition-colors ${
                i < tickers.length - 1 ? 'border-b border-white/5' : ''
              }`}
            >
              <div>
                <div className="font-mono font-bold text-sm lg:text-base text-foreground">{t.display}</div>
                <div className={`font-mono text-[10px] ${up ? 'text-neon-green' : 'text-neon-red'}`}>
                  {t.loading ? '...' : `${up ? '+' : ''}${t.change?.toFixed(2)}%`}
                </div>
              </div>
              <div className="font-mono text-base lg:text-lg font-bold text-foreground tabular-nums">
                {t.loading || t.price === null ? '...' : formatPrice(t.price)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatrixLiveTicker;
