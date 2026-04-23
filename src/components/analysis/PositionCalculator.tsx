import React, { useState, useMemo } from 'react';
import { Calculator } from 'lucide-react';

const PositionCalculator: React.FC = () => {
  const [accountSize, setAccountSize] = useState(1000);
  const [riskPct, setRiskPct] = useState(1);
  const [entry, setEntry] = useState(0);
  const [stop, setStop] = useState(0);
  const [target, setTarget] = useState(0);
  const [side, setSide] = useState<'long' | 'short'>('long');

  const calc = useMemo(() => {
    if (!entry || !stop || entry === stop) return null;
    const riskAmount = accountSize * (riskPct / 100);
    const stopDistance = Math.abs(entry - stop);
    const positionSize = riskAmount / stopDistance;
    const positionValue = positionSize * entry;
    const leverage = positionValue / accountSize;
    let rr = 0;
    let potentialProfit = 0;
    if (target && target !== entry) {
      const targetDistance = Math.abs(target - entry);
      rr = targetDistance / stopDistance;
      potentialProfit = positionSize * targetDistance;
    }
    // Validity: long needs stop<entry<target, short needs stop>entry>target
    let valid = true;
    if (side === 'long' && (stop >= entry || (target && target <= entry))) valid = false;
    if (side === 'short' && (stop <= entry || (target && target >= entry))) valid = false;

    return { riskAmount, stopDistance, positionSize, positionValue, leverage, rr, potentialProfit, valid };
  }, [accountSize, riskPct, entry, stop, target, side]);

  return (
    <div className="glass-card rounded-xl p-3 space-y-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <Calculator className="w-3.5 h-3.5 text-violet-400" />
        <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Position Calculator</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setSide('long')}
          className={`py-1 rounded text-[10px] font-bold transition-all ${
            side === 'long' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-muted-foreground border border-white/10'
          }`}
        >
          📈 LONG
        </button>
        <button
          onClick={() => setSide('short')}
          className={`py-1 rounded text-[10px] font-bold transition-all ${
            side === 'short' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-white/5 text-muted-foreground border border-white/10'
          }`}
        >
          📉 SHORT
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Tài khoản ($)" value={accountSize} onChange={setAccountSize} />
        <Field label="Risk %" value={riskPct} onChange={setRiskPct} step={0.1} />
        <Field label="Entry" value={entry} onChange={setEntry} step={0.01} />
        <Field label="Stop Loss" value={stop} onChange={setStop} step={0.01} />
        <Field label="Take Profit" value={target} onChange={setTarget} step={0.01} className="col-span-2" />
      </div>

      {calc && (
        <div className={`pt-2 border-t border-white/5 space-y-1 ${calc.valid ? '' : 'opacity-50'}`}>
          {!calc.valid && (
            <div className="text-[9px] text-amber-400 font-mono mb-1">⚠ Stop/TP không hợp lý cho {side === 'long' ? 'LONG' : 'SHORT'}</div>
          )}
          <Row label="Risk amount" value={`$${calc.riskAmount.toFixed(2)}`} />
          <Row label="Position size" value={calc.positionSize.toFixed(4)} />
          <Row label="Notional value" value={`$${calc.positionValue.toFixed(2)}`} />
          <Row label="Leverage cần" value={`${calc.leverage.toFixed(2)}x`} highlight={calc.leverage > 10 ? 'red' : calc.leverage > 5 ? 'amber' : 'emerald'} />
          {calc.rr > 0 && (
            <>
              <Row label="R:R" value={`1 : ${calc.rr.toFixed(2)}`} highlight={calc.rr >= 2 ? 'emerald' : calc.rr >= 1 ? 'amber' : 'red'} />
              <Row label="Potential profit" value={`$${calc.potentialProfit.toFixed(2)}`} highlight="emerald" />
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; value: number; onChange: (v: number) => void; step?: number; className?: string }> =
  ({ label, value, onChange, step = 1, className = '' }) => (
    <div className={className}>
      <label className="block text-[9px] text-muted-foreground/60 font-mono uppercase mb-0.5">{label}</label>
      <input
        type="number"
        value={value || ''}
        step={step}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="w-full bg-[#0b1120] border border-white/10 rounded px-2 py-1 text-[11px] font-mono text-foreground focus:border-cyan-400/40 outline-none"
      />
    </div>
  );

const Row: React.FC<{ label: string; value: string; highlight?: 'emerald' | 'amber' | 'red' }> = ({ label, value, highlight }) => {
  const colorClass = highlight === 'emerald' ? 'text-emerald-400' : highlight === 'amber' ? 'text-amber-400' : highlight === 'red' ? 'text-red-400' : 'text-foreground';
  return (
    <div className="flex items-center justify-between text-[10px]">
      <span className="text-muted-foreground/70 font-mono">{label}</span>
      <span className={`font-mono font-bold ${colorClass}`}>{value}</span>
    </div>
  );
};

export default PositionCalculator;
