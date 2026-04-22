import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';

// Quick-period buttons (TradingView-style)
const PERIODS: { id: string; label: string; tf: string }[] = [
  { id: '1D', label: '1D', tf: 'M5' },
  { id: '5D', label: '5D', tf: 'M30' },
  { id: '1M', label: '1M', tf: 'H1' },
  { id: '3M', label: '3M', tf: 'H4' },
  { id: '6M', label: '6M', tf: 'H4' },
  { id: 'YTD', label: 'YTD', tf: 'D1' },
  { id: '1Y', label: '1Y', tf: 'D1' },
  { id: '5Y', label: '5Y', tf: 'W1' },
  { id: 'All', label: 'All', tf: 'W1' },
];

// Full TradingView interval menu — value = internal tf used by the chart engine
type IntervalGroup = { name: string; items: { label: string; tf: string; star?: boolean }[] };
const INTERVAL_GROUPS: IntervalGroup[] = [
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
      { label: '3 minutes', tf: 'M5' },
      { label: '5 minutes', tf: 'M5' },
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

// Compact quick-interval buttons in the bottom bar
const QUICK_INTERVALS: { label: string; tf: string }[] = [
  { label: '1m', tf: 'M1' },
  { label: '5m', tf: 'M5' },
  { label: '15m', tf: 'M15' },
  { label: '30m', tf: 'M30' },
  { label: '1h', tf: 'H1' },
  { label: '4h', tf: 'H4' },
  { label: '1D', tf: 'D1' },
  { label: '1W', tf: 'W1' },
];

interface ChartPeriodBarProps {
  activeTf?: string;
  onSelect?: (tf: string, periodId?: string) => void;
  rightLabel?: string;
  className?: string;
}

const ChartPeriodBar: React.FC<ChartPeriodBarProps> = ({ activeTf, onSelect, rightLabel, className }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const activePeriodId = PERIODS.find(p => p.tf === activeTf)?.id;
  const activeQuickLabel = QUICK_INTERVALS.find(q => q.tf === activeTf)?.label ?? activeTf ?? '';

  return (
    <div className={`flex items-center justify-between gap-2 px-3 py-1.5 bg-[#0b0e11] border-t border-white/5 ${className || ''}`}>
      {/* Left: quick period buttons */}
      <div className="flex items-center gap-0.5 overflow-x-auto">
        {PERIODS.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect?.(p.tf, p.id)}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all whitespace-nowrap ${
              activePeriodId === p.id
                ? 'bg-[#fcd535]/15 text-[#fcd535]'
                : 'text-[#848e9c] hover:text-[#eaecef] hover:bg-white/5'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Right: quick intervals + dropdown + UTC */}
      <div className="flex items-center gap-1.5 ml-3 shrink-0">
        <div className="hidden md:flex items-center gap-0.5">
          {QUICK_INTERVALS.map(q => (
            <button
              key={q.label}
              onClick={() => onSelect?.(q.tf)}
              className={`px-1.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                activeTf === q.tf
                  ? 'bg-[#fcd535]/15 text-[#fcd535]'
                  : 'text-[#848e9c] hover:text-[#eaecef] hover:bg-white/5'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Dropdown trigger */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono font-bold text-[#eaecef] bg-white/5 hover:bg-white/10 transition-all"
            aria-label="Select interval"
          >
            <span>{activeQuickLabel || '1h'}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {open && (
            <div className="absolute right-0 bottom-full mb-1.5 w-56 max-h-[420px] overflow-y-auto bg-[#1e2329] border border-white/10 rounded-md shadow-2xl z-50 py-1">
              {INTERVAL_GROUPS.map(group => (
                <div key={group.name}>
                  <div className="px-3 pt-2 pb-1 text-[9px] font-mono text-[#848e9c] uppercase tracking-wider">
                    {group.name}
                  </div>
                  {group.items.map(item => {
                    const isActive = activeTf === item.tf;
                    return (
                      <button
                        key={item.label}
                        onClick={() => { onSelect?.(item.tf); setOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono transition-colors ${
                          isActive
                            ? 'bg-white/10 text-[#fcd535]'
                            : 'text-[#eaecef] hover:bg-white/5'
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.star && <Star className="w-3 h-3 fill-current" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {rightLabel && (
          <span className="text-[10px] font-mono text-[#848e9c]/70 whitespace-nowrap">{rightLabel}</span>
        )}
      </div>
    </div>
  );
};

export default ChartPeriodBar;
