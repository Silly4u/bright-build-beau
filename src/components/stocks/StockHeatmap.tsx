import React, { useMemo } from 'react';
import { STOCKS } from '@/lib/stocks';
import type { Quote } from './StockWatchlist';

interface Props {
  quotes: Record<string, Quote>;
  onSelect: (ticker: string) => void;
}

const StockHeatmap: React.FC<Props> = ({ quotes, onSelect }) => {
  const cells = useMemo(() => {
    return STOCKS.map(s => {
      const q = quotes[s.symbol];
      return { ...s, q };
    }).sort((a, b) => Math.abs(b.q?.volume ?? 0) - Math.abs(a.q?.volume ?? 0));
  }, [quotes]);

  const colorFor = (pct: number | undefined) => {
    if (pct === undefined) return 'bg-white/5';
    const p = Math.min(Math.abs(pct), 8) / 8; // saturate at 8%
    if (pct >= 0) {
      // green tint
      const alpha = 0.15 + p * 0.55;
      return '';  // we'll use inline style
    }
    return '';
  };

  const styleFor = (pct: number | undefined): React.CSSProperties => {
    if (pct === undefined) return { background: 'rgba(255,255,255,0.04)' };
    const p = Math.min(Math.abs(pct), 8) / 8;
    const alpha = 0.18 + p * 0.55;
    if (pct >= 0) return { background: `rgba(16, 185, 129, ${alpha})` };
    return { background: `rgba(239, 68, 68, ${alpha})` };
  };

  return (
    <div className="glass-card rounded-xl p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">🔥 Heatmap · Sắp xếp theo Volume</span>
        <div className="flex items-center gap-2 text-[9px] font-mono text-muted-foreground/70">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500/60" /> Tăng</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-500/60" /> Giảm</span>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1.5">
        {cells.map(c => {
          const pct = c.q?.changePercent;
          return (
            <button
              key={c.ticker}
              onClick={() => onSelect(c.ticker)}
              style={styleFor(pct)}
              className="rounded-lg p-2 text-left transition-transform hover:scale-105 hover:ring-1 hover:ring-white/30 group"
              title={c.name}
            >
              <div className="text-[11px] font-bold font-mono text-foreground">{c.ticker}</div>
              <div className="text-[10px] font-mono text-foreground/90 tabular-nums">
                {c.q ? `$${c.q.price >= 1000 ? c.q.price.toFixed(0) : c.q.price.toFixed(2)}` : '-'}
              </div>
              <div className="text-[10px] font-mono font-bold tabular-nums text-foreground">
                {pct !== undefined ? `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%` : '-'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StockHeatmap;
