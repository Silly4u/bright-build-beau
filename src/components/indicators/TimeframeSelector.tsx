import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Plus, Star, ChevronUp } from 'lucide-react';

// Map between display labels and internal engine timeframes.
// Engine supports: M1, M5, M15, M30, H1, H4, D1, W1
// Other intervals are mapped to the closest supported engine timeframe.
type Item = { label: string; tf: string; star?: boolean };
type Group = { name: string; items: Item[] };

const GROUPS: Group[] = [
  {
    name: 'TICKS',
    items: [
      { label: '1 tick', tf: 'M1' },
      { label: '10 ticks', tf: 'M1' },
      { label: '100 ticks', tf: 'M1' },
      { label: '1000 ticks', tf: 'M1' },
    ],
  },
  {
    name: 'SECONDS',
    items: [
      { label: '1 second', tf: 'M1' },
      { label: '5 seconds', tf: 'M1' },
      { label: '10 seconds', tf: 'M1' },
      { label: '15 seconds', tf: 'M1' },
      { label: '30 seconds', tf: 'M1' },
      { label: '45 seconds', tf: 'M1' },
    ],
  },
  {
    name: 'MINUTES',
    items: [
      { label: '1 minute', tf: 'M1' },
      { label: '2 minutes', tf: 'M1' },
      { label: '3 minutes', tf: 'M5' },
      { label: '5 minutes', tf: 'M5' },
      { label: '10 minutes', tf: 'M15' },
      { label: '15 minutes', tf: 'M15' },
      { label: '30 minutes', tf: 'M30' },
      { label: '45 minutes', tf: 'M30' },
    ],
  },
  {
    name: 'HOURS',
    items: [
      { label: '1 hour', tf: 'H1', star: true },
      { label: '2 hours', tf: 'H1' },
      { label: '3 hours', tf: 'H1' },
      { label: '4 hours', tf: 'H4' },
    ],
  },
  {
    name: 'DAYS',
    items: [
      { label: '1 day', tf: 'D1' },
    ],
  },
  {
    name: 'WEEKS',
    items: [
      { label: '1 week', tf: 'W1' },
    ],
  },
];

// Compact label shown on the trigger button
const SHORT_LABEL: Record<string, string> = {
  M1: '1m',
  M5: '5m',
  M15: '15m',
  M30: '30m',
  H1: '1h',
  H4: '4h',
  D1: '1D',
  W1: '1W',
};

interface Props {
  activeTf: string;
  onSelect: (tf: string) => void;
  className?: string;
}

const TimeframeSelector: React.FC<Props> = ({ activeTf, onSelect, className }) => {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const shortLabel = SHORT_LABEL[activeTf] ?? activeTf;

  return (
    <div className={`relative ${className || ''}`} ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-mono font-bold text-[#eaecef] bg-[#1e2329] border border-[#2b3139] hover:border-[#fcd535]/40 transition-all"
      >
        <span>{shortLabel}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-64 max-h-[480px] overflow-y-auto bg-[#1e2329] border border-white/10 rounded-md shadow-2xl z-50 py-1">
          {/* Add custom interval (header) */}
          <button className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-mono text-[#eaecef] hover:bg-white/5 border-b border-white/5">
            <Plus className="w-3.5 h-3.5" />
            <span>Add custom interval...</span>
          </button>

          {GROUPS.map(group => {
            const isCollapsed = collapsed[group.name];
            return (
              <div key={group.name} className="border-b border-white/5 last:border-b-0">
                <button
                  onClick={() => setCollapsed(c => ({ ...c, [group.name]: !c[group.name] }))}
                  className="w-full flex items-center justify-between px-3 pt-2 pb-1 text-[9px] font-mono text-[#848e9c] uppercase tracking-wider hover:text-[#eaecef]"
                >
                  <span>{group.name}</span>
                  {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                </button>
                {!isCollapsed && group.items.map(item => {
                  const isActive = activeTf === item.tf;
                  return (
                    <button
                      key={item.label}
                      onClick={() => { onSelect(item.tf); setOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono transition-colors ${
                        isActive
                          ? 'bg-white/10 text-[#fcd535]'
                          : 'text-[#eaecef] hover:bg-white/5'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.star && <Star className="w-3 h-3 fill-[#eaecef] text-[#eaecef]" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimeframeSelector;
