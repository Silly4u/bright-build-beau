import React from 'react';
import type { SmartSignal } from '@/hooks/useSmartSignal';

interface Props {
  signal: SmartSignal;
  style: { bg: string; border: string; text: string; dot: string; label: string };
  currentPrice?: number;
  now: number;
  onClick?: () => void;
}

function relativeTime(ts: number, now: number): string {
  const diff = Math.max(0, now - ts);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s trước`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  const day = Math.floor(hr / 24);
  return `${day} ngày trước`;
}

const Sparkline: React.FC<{ data: number[]; up: boolean }> = ({ data, up }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 56;
  const h = 18;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
  const stroke = up ? 'hsl(152 76% 50%)' : 'hsl(0 84% 60%)';
  const fill = up ? 'hsl(152 76% 50% / 0.15)' : 'hsl(0 84% 60% / 0.15)';
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} className="shrink-0">
      <polygon points={area} fill={fill} />
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
};

const SignalCard: React.FC<Props> = ({ signal, style, currentPrice, now, onClick }) => {
  const ageMs = now - signal.createdAt;
  const isFresh = ageMs < 2 * 60 * 1000; // <2 phút
  const delta = currentPrice && signal.price ? ((currentPrice - signal.price) / signal.price) * 100 : null;
  const sparkUp = signal.sparkline.length >= 2
    ? signal.sparkline[signal.sparkline.length - 1] >= signal.sparkline[0]
    : true;
  const timeStr = new Date(signal.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 ${signal.isNew ? 'bg-primary/5' : ''} hover:bg-foreground/[0.04] focus:bg-foreground/[0.05] transition-colors block`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-1.5 h-1.5 rounded-full ${style.dot} ${signal.isNew ? 'animate-pulse' : ''}`} />
        <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${style.bg} ${style.border} border ${style.text}`}>
          {style.label}
        </span>
        {isFresh && (
          <span className="text-[8px] font-bold font-mono px-1 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 animate-pulse">
            NEW
          </span>
        )}
        <span className="ml-auto text-[9px] text-muted-foreground/60 font-mono">{signal.symbol}</span>
      </div>

      <p className="text-[10px] text-muted-foreground/80 leading-relaxed pl-3.5 mb-1.5">
        {signal.message}
      </p>

      <div className="flex items-center justify-between gap-2 pl-3.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkline data={signal.sparkline} up={sparkUp} />
          {signal.price > 0 && (
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] font-mono text-muted-foreground/60">@ {signal.price.toLocaleString('en-US', { maximumFractionDigits: signal.price < 100 ? 2 : 0 })}</span>
              {delta !== null && (
                <span className={`text-[9px] font-mono font-bold ${delta >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}%
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[9px] text-muted-foreground/70 font-mono">{relativeTime(signal.createdAt, now)}</span>
          <span className="text-[9px] text-muted-foreground/40 font-mono">{timeStr}</span>
        </div>
      </div>
    </button>
  );
};

export default SignalCard;
