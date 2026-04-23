import React, { useEffect, useState } from 'react';
import { useWatchlist } from '@/hooks/useAnalysisLocal';
import { Plus, X, TrendingUp, TrendingDown } from 'lucide-react';

interface Ticker {
  symbol: string;
  price: number;
  change: number;
}

const POPULAR = ['ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'DOGEUSDT', 'XRPUSDT', 'ADAUSDT', 'AVAXUSDT', 'LINKUSDT', 'DOTUSDT', 'MATICUSDT'];

const Watchlist: React.FC = () => {
  const { items, add, remove } = useWatchlist();
  const [tickers, setTickers] = useState<Record<string, Ticker>>({});
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const symbols = JSON.stringify(items.map(i => i.symbol));
        const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const map: Record<string, Ticker> = {};
        data.forEach((t: { symbol: string; lastPrice: string; priceChangePercent: string }) => {
          map[t.symbol] = { symbol: t.symbol, price: parseFloat(t.lastPrice), change: parseFloat(t.priceChangePercent) };
        });
        setTickers(map);
      } catch { /* ignore */ }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [items]);

  const formatPrice = (p: number) => {
    if (p >= 100) return p.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (p >= 1) return p.toFixed(2);
    return p.toFixed(4);
  };

  const availableToAdd = POPULAR.filter(s => !items.find(i => i.symbol === s));

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">📊 Watchlist</span>
        </div>
        <button
          onClick={() => setShowAdd(s => !s)}
          className="text-cyan-400 hover:text-cyan-300"
          title="Thêm coin"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {showAdd && availableToAdd.length > 0 && (
        <div className="p-2 border-b border-white/5 bg-white/[0.02]">
          <div className="text-[9px] text-muted-foreground/60 mb-1.5 font-mono uppercase tracking-wider">Thêm nhanh</div>
          <div className="flex flex-wrap gap-1">
            {availableToAdd.map(s => {
              const display = s.replace('USDT', '');
              return (
                <button
                  key={s}
                  onClick={() => { add(s, display); setShowAdd(false); }}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
                >
                  + {display}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="divide-y divide-white/5 max-h-[260px] overflow-y-auto scrollbar-thin">
        {items.length === 0 ? (
          <div className="px-3 py-4 text-center text-[10px] text-muted-foreground/60">Chưa có coin nào</div>
        ) : items.map(item => {
          const t = tickers[item.symbol];
          const up = t && t.change >= 0;
          return (
            <div key={item.symbol} className="px-3 py-1.5 flex items-center justify-between gap-2 hover:bg-white/[0.02] group">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-bold font-mono text-foreground">{item.display}</span>
                <span className="text-[9px] text-muted-foreground/40 font-mono">USDT</span>
              </div>
              <div className="flex items-center gap-2">
                {t ? (
                  <>
                    <span className="text-[11px] font-mono text-foreground">${formatPrice(t.price)}</span>
                    <span className={`flex items-center gap-0.5 text-[10px] font-mono font-bold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                      {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      {Math.abs(t.change).toFixed(2)}%
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] text-muted-foreground/40 font-mono">...</span>
                )}
                <button
                  onClick={() => remove(item.symbol)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-red-400 transition-opacity"
                  title="Xoá"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Watchlist;
