import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIndicatorPermissions } from '@/hooks/useIndicatorPermissions';
import { supabase } from '@/integrations/supabase/client';

interface MiniCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const SYMBOL_MAP: Record<string, string> = {
  'BTC/USDT': 'BTCUSDT',
  'ETH/USDT': 'ETHUSDT',
  'SOL/USDT': 'SOLUSDT',
  'BNB/USDT': 'BNBUSDT',
  'XRP/USDT': 'XRPUSDT',
};

interface MiniChartProps {
  pair: string;
  onSelect?: (pair: string) => void;
  onUnpin?: (pair: string) => void;
  premium: boolean;
}

const MiniChart: React.FC<MiniChartProps> = ({ pair, onSelect, onUnpin, premium }) => {
  const [candles, setCandles] = useState<MiniCandle[]>([]);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const symbol = SYMBOL_MAP[pair];
      if (!symbol) return;
      const { data } = await supabase.functions.invoke('signal-bot', {
        body: { mode: 'candles', symbol, timeframe: 'H1', limit: 60 },
      });
      if (!cancelled && data?.candles) {
        setCandles(data.candles);
        if (data.candles.length) setLivePrice(data.candles[data.candles.length - 1].close);
      }
    })();

    const symbol = (SYMBOL_MAP[pair] || '').toLowerCase();
    if (!symbol) return;
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@kline_1h`);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.e !== 'kline') return;
        const k = msg.k;
        const c: MiniCandle = {
          time: k.t,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
        };
        setLivePrice(c.close);
        setCandles(prev => {
          if (prev.length === 0) return prev;
          const last = prev[prev.length - 1];
          if (last.time === c.time) {
            const next = [...prev];
            next[next.length - 1] = c;
            return next;
          }
          return [...prev, c].slice(-60);
        });
      } catch {/* ignore */}
    };
    return () => {
      cancelled = true;
      try { ws.close(1000); } catch { /* ignore */ }
    };
  }, [pair]);

  // Sparkline from closes
  const closes = candles.map(c => c.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = Math.max(max - min, 1e-9);
  const w = 100;
  const h = 28;
  const path = closes
    .map((c, i) => {
      const x = (i / Math.max(closes.length - 1, 1)) * w;
      const y = h - ((c - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  const first = closes[0] || 0;
  const last = closes[closes.length - 1] || 0;
  const change = first > 0 ? ((last - first) / first) * 100 : 0;
  const up = change >= 0;

  return (
    <div
      className="group bg-[#0b0e11] border border-[#2b3139] rounded p-1.5 cursor-pointer hover:border-[#fcd535]/40 transition-colors"
      onClick={() => premium && onSelect?.(pair)}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[9px] font-mono font-bold text-[#eaecef]">{pair.split('/')[0]}</span>
        <button
          onClick={e => { e.stopPropagation(); onUnpin?.(pair); }}
          className="opacity-0 group-hover:opacity-100 text-[#5e6673] hover:text-[#f6465d] text-[10px] leading-none"
          title="Bỏ ghim"
        >
          ×
        </button>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="none">
        <path d={path} fill="none" stroke={up ? '#0ecb81' : '#f6465d'} strokeWidth="1.2" />
      </svg>
      <div className="flex items-center justify-between mt-0.5">
        <span className="text-[9px] font-mono text-[#eaecef]">
          {livePrice ? livePrice.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
        </span>
        <span className={`text-[9px] font-mono font-bold ${up ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
          {up ? '+' : ''}{change.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

interface Props {
  activePair: string;
  onSelect: (pair: string) => void;
  availablePairs: string[];
}

const STORAGE_KEY = 'pinned-mini-charts-v1';

const PinnedMiniCharts: React.FC<Props> = ({ activePair, onSelect, availablePairs }) => {
  const { user } = useAuth();
  const { hasAccess } = useIndicatorPermissions();
  const isPremium = hasAccess('multi_chart');
  const [pinned, setPinned] = useState<string[]>([]);
  const [picker, setPicker] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPinned(JSON.parse(raw));
      else setPinned(['ETH/USDT', 'SOL/USDT']);
    } catch { setPinned(['ETH/USDT', 'SOL/USDT']); }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pinned)); } catch {/* ignore */}
  }, [pinned]);

  const pin = (p: string) => { if (!pinned.includes(p)) setPinned(prev => [...prev, p].slice(0, 6)); setPicker(false); };
  const unpin = (p: string) => setPinned(prev => prev.filter(x => x !== p));
  const visible = pinned.filter(p => p !== activePair && SYMBOL_MAP[p]);

  return (
    <div className="border border-[#2b3139] rounded-lg overflow-hidden">
      <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest flex items-center justify-between">
        <span>📌 PIN MINI ({visible.length})</span>
        <button
          onClick={() => setPicker(s => !s)}
          className="text-[10px] text-[#fcd535] hover:underline"
        >
          {picker ? 'Hủy' : '+ Pin'}
        </button>
      </div>
      <div className="bg-[#161a1e] p-2 space-y-1.5">
        {!user && (
          <p className="text-[9px] font-mono text-[#5e6673] mb-1">
            <Link to="/auth" className="text-[#fcd535] hover:underline">Đăng nhập</Link> để click chuyển cặp nhanh.
          </p>
        )}
        {picker && (
          <div className="grid grid-cols-3 gap-1 mb-1.5">
            {availablePairs
              .filter(p => !pinned.includes(p) && p !== activePair && SYMBOL_MAP[p])
              .map(p => (
                <button
                  key={p}
                  onClick={() => pin(p)}
                  className="text-[9px] font-mono px-1.5 py-1 bg-[#0b0e11] border border-[#2b3139] rounded text-[#eaecef] hover:border-[#fcd535] hover:text-[#fcd535]"
                >
                  {p.split('/')[0]}
                </button>
              ))}
          </div>
        )}
        {visible.length === 0 && !picker ? (
          <p className="text-[10px] font-mono text-[#5e6673] text-center py-2">
            Pin cặp khác để theo dõi cùng lúc
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-1.5">
            {visible.map(p => (
              <MiniChart key={p} pair={p} onSelect={onSelect} onUnpin={unpin} premium={isPremium || !!user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PinnedMiniCharts;
