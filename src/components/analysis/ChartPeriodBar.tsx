import React from 'react';

// Map period button → recommended timeframe (TradingView-style)
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

interface ChartPeriodBarProps {
  activeTf?: string;
  onSelect?: (tf: string, periodId: string) => void;
  rightLabel?: string;
  className?: string;
}

const ChartPeriodBar: React.FC<ChartPeriodBarProps> = ({ activeTf, onSelect, rightLabel, className }) => {
  // Highlight the period whose tf matches the active timeframe (first match)
  const activePeriodId = PERIODS.find(p => p.tf === activeTf)?.id;

  return (
    <div className={`flex items-center justify-between px-3 py-1.5 bg-[#0b0e11] border-t border-white/5 ${className || ''}`}>
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
      {rightLabel && (
        <span className="text-[10px] font-mono text-[#848e9c]/70 ml-3 whitespace-nowrap">{rightLabel}</span>
      )}
    </div>
  );
};

export default ChartPeriodBar;
