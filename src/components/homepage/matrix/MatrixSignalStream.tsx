import React from 'react';
import { useSignals } from '@/hooks/useMarketData';

const MatrixSignalStream: React.FC = () => {
  const { signals, loading } = useSignals();
  const top = signals.slice(0, 5);

  const isBuy = (conditions: string[]) =>
    conditions.some(c => ['Breakout', 'Support Bounce', 'Confluence', 'BB Squeeze'].includes(c));

  return (
    <div className="bg-[#0D0F16] border border-white/10">
      <div className="p-3 border-b border-white/5 bg-uv/5 flex items-center justify-between">
        <h3 className="font-mono text-xs text-uv font-bold tracking-[0.2em] flex items-center gap-2">
          <div className="size-2 bg-uv shadow-[0_0_8px_#D926A9]" />
          SIGNAL_STREAM
        </h3>
        <span className="font-mono text-[10px] text-muted-foreground">{signals.length} TÍN HIỆU</span>
      </div>
      <div className="p-3 lg:p-4 flex flex-col gap-2 max-h-[280px] overflow-y-auto">
        {loading && [...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-white/5 animate-pulse rounded" />
        ))}
        {!loading && top.length === 0 && (
          <div className="text-center py-6 font-mono text-xs text-muted-foreground">Chưa có tín hiệu</div>
        )}
        {top.map(s => {
          const buy = isBuy(s.conditions);
          const time = new Date(s.sent_at);
          const timeStr = time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          const dateStr = time.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
          return (
            <div
              key={s.id}
              className={`border-l-2 ${
                buy ? 'border-neon-green bg-neon-green/[0.03]' : 'border-neon-red bg-neon-red/[0.03]'
              } pl-3 py-2 font-mono`}
            >
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>[{timeStr} • {dateStr}]</span>
                <span className="text-cyan-brand">#{s.id.slice(0, 6).toUpperCase()}</span>
              </div>
              <div className="flex gap-2 items-center text-sm flex-wrap">
                <span
                  className={`px-1.5 py-0.5 font-bold text-[10px] ${
                    buy ? 'bg-neon-green text-navy' : 'bg-neon-red text-foreground'
                  }`}
                >
                  {buy ? 'LONG' : 'SHORT'}
                </span>
                <span className="text-foreground font-bold">{s.symbol}</span>
                <span className="text-cyan-brand">@ {Number(s.price).toLocaleString()}</span>
                <span className="text-muted-foreground text-[10px]">{s.timeframe}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatrixSignalStream;
