import React, { useEffect, useState } from 'react';
import { Plus, MoreHorizontal, LayoutGrid } from 'lucide-react';

interface WatchItem {
  symbol: string;
  pair: string;
  label: string;
  icon: string;
}

const DEFAULT_WATCHLIST: WatchItem[] = [
  { symbol: 'BTCUSDT', pair: 'BTC/USDT', label: 'BTCUS', icon: '₿' },
  { symbol: 'ETHUSDT', pair: 'ETH/USDT', label: 'ETHUS', icon: 'Ξ' },
  { symbol: 'SOLUSDT', pair: 'SOL/USDT', label: 'SOLUS', icon: '◎' },
  { symbol: 'BNBUSDT', pair: 'BNB/USDT', label: 'BNBUS', icon: '🟡' },
  { symbol: 'XRPUSDT', pair: 'XRP/USDT', label: 'XRPUS', icon: 'X' },
  { symbol: 'DOGEUSDT', pair: 'DOGE/USDT', label: 'DOGEU', icon: '🐕' },
  { symbol: 'PEPEUSDT', pair: 'PEPE/USDT', label: 'PEPEU', icon: '🐸' },
  { symbol: 'WLDUSDT', pair: 'WLD/USDT', label: 'WLDUS', icon: '🌍' },
  { symbol: 'HYPEUSDT', pair: 'HYPE/USDT', label: 'HYPEU', icon: 'H' },
];

interface PriceTick {
  last: number | null;
  prev: number | null;
}

interface ChartWatchlistProps {
  activePair?: string;
  onSelect?: (pair: string) => void;
  className?: string;
}

const ChartWatchlist: React.FC<ChartWatchlistProps> = ({ activePair, onSelect, className }) => {
  const [prices, setPrices] = useState<Record<string, PriceTick>>({});

  useEffect(() => {
    const streams = DEFAULT_WATCHLIST.map(w => `${w.symbol.toLowerCase()}@ticker`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        const d = msg.data;
        if (!d || !d.s) return;
        const last = parseFloat(d.c);
        const open = parseFloat(d.o);
        setPrices(prev => ({ ...prev, [d.s]: { last, prev: open } }));
      } catch {/* ignore */}
    };

    ws.onerror = () => { try { ws.close(); } catch {/* */} };

    return () => { try { ws.close(1000); } catch {/* */} };
  }, []);

  const fmt = (n: number | null | undefined) => {
    if (n == null || isNaN(n)) return '—';
    if (n >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (n >= 1) return n.toFixed(3);
    if (n >= 0.01) return n.toFixed(4);
    return n.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
  };

  return (
    <div className={`flex flex-col bg-[#0b0e11] border border-white/5 rounded-md overflow-hidden ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <span className="text-[12px] font-bold text-[#eaecef] font-mono">Watchlist</span>
        <div className="flex items-center gap-1.5 text-[#848e9c]">
          <button className="hover:text-[#eaecef] transition-colors" aria-label="Add"><Plus className="w-3.5 h-3.5" /></button>
          <button className="hover:text-[#eaecef] transition-colors" aria-label="Layout"><LayoutGrid className="w-3.5 h-3.5" /></button>
          <button className="hover:text-[#eaecef] transition-colors" aria-label="More"><MoreHorizontal className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Column header */}
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-1 border-b border-white/5 text-[9px] font-mono text-[#848e9c] uppercase tracking-wider">
        <span>Symbol</span>
        <span className="text-right">Last</span>
        <span className="text-right">Chg</span>
        <span className="text-right">Chg%</span>
      </div>

      {/* Section label */}
      <div className="px-3 py-1.5 text-[9px] font-mono text-[#848e9c]/70 uppercase tracking-wider bg-white/[0.02]">
        Indices
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto">
        {DEFAULT_WATCHLIST.map((item) => {
          const tick = prices[item.symbol];
          const last = tick?.last ?? null;
          const prev = tick?.prev ?? null;
          const chg = last != null && prev != null ? last - prev : null;
          const chgPct = last != null && prev != null && prev !== 0 ? ((last - prev) / prev) * 100 : null;
          const isUp = (chg ?? 0) >= 0;
          const isActive = activePair === item.pair;

          return (
            <button
              key={item.symbol}
              onClick={() => onSelect?.(item.pair)}
              className={`w-full grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-1.5 text-[11px] font-mono transition-colors border-l-2 ${
                isActive
                  ? 'border-[#fcd535] bg-white/[0.04]'
                  : 'border-transparent hover:bg-white/[0.03]'
              }`}
            >
              <span className="flex items-center gap-1.5 text-[#eaecef] truncate">
                <span className="text-[10px] opacity-70">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </span>
              <span className="text-right text-[#eaecef] tabular-nums">{fmt(last)}</span>
              <span className={`text-right tabular-nums ${isUp ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                {chg == null ? '—' : (isUp ? '+' : '') + fmt(Math.abs(chg))}
              </span>
              <span className={`text-right tabular-nums ${isUp ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                {chgPct == null ? '—' : `${(isUp ? '+' : '')}${chgPct.toFixed(2)}%`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChartWatchlist;
