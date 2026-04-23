import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Stat {
  label: string;
  value: number;
  suffix: string;
  format: 'number' | 'percent';
  borderColor: string;
  to: string;
}

function useCountUp(target: number, duration = 1500): number {
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);
  useEffect(() => {
    if (target === 0 || startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(target * eased));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

const StatBox: React.FC<{ stat: Stat }> = ({ stat }) => {
  const animated = useCountUp(stat.value);
  const display =
    stat.format === 'percent'
      ? (animated / 10).toFixed(1)
      : animated >= 1000
      ? animated.toLocaleString('en-US')
      : animated.toString();
  return (
    <div className={`bg-[#0D0F16] p-5 lg:p-6 border-b-2 ${stat.borderColor}`}>
      <p className="font-mono text-[10px] lg:text-xs text-muted-foreground uppercase mb-2 tracking-widest">
        {stat.label}
      </p>
      <p className="font-mono text-2xl lg:text-4xl font-bold text-foreground tabular-nums">
        {display}
        {stat.suffix}
      </p>
    </div>
  );
};

const MatrixStats: React.FC = () => {
  const [counts, setCounts] = useState({ users: 142854, signals: 0, winRate: 874 });

  useEffect(() => {
    (async () => {
      const { count } = await supabase.from('signals').select('*', { count: 'exact', head: true });
      setCounts(prev => ({ ...prev, signals: count || 8492 }));
    })();
  }, []);

  const stats: Stat[] = [
    { label: 'NODE_USERS', value: counts.users, suffix: '', format: 'number', borderColor: 'border-cyan-brand' },
    { label: 'SIGNALS_FIRED', value: counts.signals, suffix: '', format: 'number', borderColor: 'border-uv' },
    { label: 'WIN_RATE', value: counts.winRate, suffix: '%', format: 'percent', borderColor: 'border-neon-green' },
  ];

  return (
    <section className="px-6 lg:px-12 py-8">
      <div className="grid grid-cols-3 gap-[1px] bg-white/5 p-[1px]">
        {stats.map(s => (
          <StatBox key={s.label} stat={s} />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 lg:gap-6 mt-6 font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="text-cyan-brand">[#]</span>BẢO MẬT END-TO-END
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyan-brand">[#]</span>BINANCE LIQUIDITY
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyan-brand">[#]</span>TELEGRAM VERIFIED
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyan-brand">[#]</span>AI POWERED
        </div>
      </div>
    </section>
  );
};

export default MatrixStats;
