import React, { useEffect, useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { STOCKS, type StockMeta } from '@/lib/stocks';

export interface Quote {
  symbol: string;
  ticker: string;
  price: number;
  open: number;
  high: number;
  low: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface Props {
  quotes: Record<string, Quote>;
  selected: string;
  onSelect: (ticker: string) => void;
  loading?: boolean;
}

type SortKey = 'ticker' | 'price' | 'changePercent' | 'volume';

const StockWatchlist: React.FC<Props> = ({ quotes, selected, onSelect, loading }) => {
  const [filter, setFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('changePercent');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const rows = useMemo(() => {
    const arr: (StockMeta & { q?: Quote })[] = STOCKS.map(s => ({ ...s, q: quotes[s.symbol] }));
    const f = filter.trim().toUpperCase();
    const filtered = f ? arr.filter(r => r.ticker.includes(f) || r.name.toUpperCase().includes(f)) : arr;
    const dir = sortDir === 'asc' ? 1 : -1;
    return filtered.sort((a, b) => {
      const av = sortKey === 'ticker' ? a.ticker : (a.q?.[sortKey] ?? -Infinity);
      const bv = sortKey === 'ticker' ? b.ticker : (b.q?.[sortKey] ?? -Infinity);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [quotes, filter, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir(k === 'ticker' ? 'asc' : 'desc'); }
  };

  const fmtPrice = (p: number) => p >= 1000 ? p.toLocaleString('en-US', { maximumFractionDigits: 2 }) : p.toFixed(2);
  const fmtVol = (v: number) => v >= 1e9 ? `${(v/1e9).toFixed(2)}B` : v >= 1e6 ? `${(v/1e6).toFixed(2)}M` : `${(v/1e3).toFixed(1)}K`;

  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-white/5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Watchlist · {STOCKS.length} mã</span>
        </div>
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Tìm..."
            className="pl-6 pr-2 py-1 text-[10px] rounded bg-white/5 border border-white/10 text-foreground w-24 focus:w-32 transition-all focus:outline-none focus:border-cyan-500/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-1.5 border-b border-white/5 text-[9px] uppercase tracking-wider text-muted-foreground/60 font-mono">
        <button onClick={() => toggleSort('ticker')} className="text-left hover:text-foreground">Mã {sortKey==='ticker'&&(sortDir==='asc'?'↑':'↓')}</button>
        <button onClick={() => toggleSort('price')} className="text-right hover:text-foreground">Giá {sortKey==='price'&&(sortDir==='asc'?'↑':'↓')}</button>
        <button onClick={() => toggleSort('changePercent')} className="text-right hover:text-foreground">% {sortKey==='changePercent'&&(sortDir==='asc'?'↑':'↓')}</button>
        <button onClick={() => toggleSort('volume')} className="text-right hover:text-foreground w-12">Vol {sortKey==='volume'&&(sortDir==='asc'?'↑':'↓')}</button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-white/5">
        {rows.map(r => {
          const q = r.q;
          const up = (q?.changePercent ?? 0) >= 0;
          const isActive = selected === r.ticker;
          return (
            <button
              key={r.ticker}
              onClick={() => onSelect(r.ticker)}
              className={`w-full grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-2 items-center text-left transition-colors ${
                isActive ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400' : 'hover:bg-white/[0.03] border-l-2 border-l-transparent'
              }`}
            >
              <div className="min-w-0">
                <div className="text-[11px] font-bold font-mono text-foreground">{r.ticker}</div>
                <div className="text-[9px] text-muted-foreground/60 truncate">{r.name}</div>
              </div>
              <div className="text-[11px] font-mono text-foreground tabular-nums text-right">
                {q ? `$${fmtPrice(q.price)}` : (loading ? '...' : '-')}
              </div>
              <div className={`flex items-center justify-end gap-0.5 text-[10px] font-mono font-bold tabular-nums ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                {q ? (
                  <>
                    {up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    {up ? '+' : ''}{q.changePercent.toFixed(2)}%
                  </>
                ) : '-'}
              </div>
              <div className="text-[9px] font-mono text-muted-foreground/70 text-right w-12 tabular-nums">
                {q ? fmtVol(q.volume) : '-'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StockWatchlist;
