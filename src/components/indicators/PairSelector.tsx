import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search, Star } from 'lucide-react';

export interface PairOption {
  symbol: string;
  label: string;
  color: string;
  /** Optional descriptive name shown in dropdown row */
  name?: string;
}

interface Props {
  pairs: PairOption[];
  activePair: string;
  onSelect: (symbol: string) => void;
  className?: string;
}

const PairSelector: React.FC<Props> = ({ pairs, activePair, onSelect, className }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const active = pairs.find(p => p.symbol === activePair) || pairs[0];
  const filtered = query
    ? pairs.filter(p =>
        p.label.toLowerCase().includes(query.toLowerCase()) ||
        p.symbol.toLowerCase().includes(query.toLowerCase()),
      )
    : pairs;

  return (
    <div className={`relative ${className || ''}`} ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-mono font-bold text-[#eaecef] bg-[#1e2329] border border-[#2b3139] hover:border-[#fcd535]/40 transition-all"
        title={active?.symbol}
      >
        <span
          className="w-2 h-2 rounded-full ring-1 ring-black/40 shrink-0"
          style={{ backgroundColor: active?.color }}
        />
        <span>{active?.label}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-72 max-h-[420px] overflow-y-auto bg-[#1e2329] border border-white/10 rounded-md shadow-2xl z-50 py-1">
          {/* Search header */}
          <div className="px-2 pt-2 pb-2 border-b border-white/5 sticky top-0 bg-[#1e2329] z-10">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#0b0e11] border border-[#2b3139]">
              <Search className="w-3.5 h-3.5 text-[#848e9c]" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Tìm coin..."
                className="flex-1 bg-transparent outline-none text-[11px] font-mono text-[#eaecef] placeholder:text-[#5e6673]"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-center text-[10px] font-mono text-[#5e6673]">
              Không tìm thấy coin nào
            </div>
          ) : (
            filtered.map(p => {
              const isActive = activePair === p.symbol;
              return (
                <button
                  key={p.symbol}
                  onClick={() => { onSelect(p.symbol); setOpen(false); setQuery(''); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-[11px] font-mono transition-colors ${
                    isActive
                      ? 'bg-white/10 text-[#fcd535]'
                      : 'text-[#eaecef] hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full ring-1 ring-black/40 shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-bold">{p.label}</span>
                    <span className="text-[#5e6673]">{p.symbol}</span>
                  </span>
                  {isActive && <Star className="w-3 h-3 fill-[#fcd535] text-[#fcd535]" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default PairSelector;
