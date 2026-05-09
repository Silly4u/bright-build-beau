import { useState, useEffect, useRef, useCallback } from 'react';
import type { Candle, Indicators, Zone } from '@/hooks/useMarketData';

export interface SmartSignal {
  id: string;
  time: string;
  createdAt: number; // ms epoch — for relative time
  message: string;
  type: 'buy' | 'sell' | 'alert' | 'info' | 'breakout' | 'support_touch' | 'volume_anomaly';
  symbol: string;
  badge: string;
  price: number;          // giá lúc tín hiệu xuất hiện
  sparkline: number[];    // 20 close gần nhất tính tới candle đó
  isNew?: boolean;
}

const SIGNAL_MESSAGES: Record<string, { badge: string; type: SmartSignal['type'] }> = {
  volume_anomaly: { badge: 'VOLUME', type: 'volume_anomaly' },
  breakout: { badge: 'BREAKOUT', type: 'breakout' },
  support_touch: { badge: 'HỖ TRỢ', type: 'support_touch' },
  bb_squeeze: { badge: 'BB SQUEEZE', type: 'alert' },
  bb_breakout: { badge: 'BB BREAK', type: 'buy' },
  bb_oversold: { badge: 'VIP SIGNAL', type: 'buy' },
  momentum: { badge: 'MOMENTUM', type: 'alert' },
  momentum_down: { badge: 'MOMENTUM', type: 'sell' },
  volume_spike: { badge: 'VOL SPIKE', type: 'volume_anomaly' },
  rsi_divergence: { badge: 'RSI DIV', type: 'alert' },
  rsi_div_bear: { badge: 'RSI DIV', type: 'sell' },
  support_bounce: { badge: 'BOUNCE', type: 'buy' },
  // SELL-side đối xứng
  breakdown: { badge: 'BREAKDOWN', type: 'sell' },
  resistance_touch: { badge: 'KHÁNG CỰ', type: 'alert' },
  bb_breakdown: { badge: 'BB BREAK', type: 'sell' },
  bb_overbought: { badge: 'VIP SHORT', type: 'sell' },
  resistance_reject: { badge: 'REJECT', type: 'sell' },
  dump: { badge: 'DUMP', type: 'sell' },
};

interface PickedCondition {
  key: string;
  msg: string;
}

function detectAt(
  candles: Candle[],
  indicators: Indicators | null,
  zones: Zone[],
  sym: string,
  n: number,
): PickedCondition[] {
  if (!indicators) return [];
  const curr = candles[n];
  const prev = candles[n - 1];
  if (!curr || !prev) return [];

  const volumes = candles.map(c => c.volume);
  const start = Math.max(0, n - 9);
  const slice = volumes.slice(start, n + 1);
  const volAvg10 = slice.reduce((a, b) => a + b, 0) / Math.max(1, slice.length);
  const volRatio = volAvg10 > 0 ? curr.volume / volAvg10 : 1;
  const rsiVal = indicators.rsi[n];
  const bbUpper = indicators.bb.upper[n];
  const bbLower = indicators.bb.lower[n];
  const bbWidth = indicators.bb.bandwidth[n];
  const prevBbWidth = indicators.bb.bandwidth[n - 1];
  const supportZones = zones.filter(z => z.type === 'support');
  const resistanceZones = zones.filter(z => z.type === 'resistance');

  const conditions: PickedCondition[] = [];

  if (volRatio > 2) {
    conditions.push({ key: 'volume_anomaly', msg: `Volume ${sym} tăng ${(volRatio * 100).toFixed(0)}% so với trung bình — dấu hiệu bất thường` });
  }
  if (resistanceZones.some(z => prev.close < z.top && curr.close > z.top)) {
    conditions.push({ key: 'breakout', msg: `${sym} breakout khỏi vùng kháng cự — momentum tăng mạnh` });
  }
  if (supportZones.some(z => Math.abs(curr.close - (z.top + z.bottom) / 2) / curr.close < 0.005)) {
    conditions.push({ key: 'support_touch', msg: `${sym} chạm vùng hỗ trợ AI — theo dõi phản ứng giá` });
  }
  if (bbWidth && prevBbWidth && bbWidth < prevBbWidth * 0.92) {
    conditions.push({ key: 'bb_squeeze', msg: `BB Squeeze trên ${sym} — BB width giảm ${((1 - bbWidth / prevBbWidth) * 100).toFixed(1)}%` });
  }
  if (bbUpper && curr.close > bbUpper) {
    conditions.push({ key: 'bb_breakout', msg: `${sym} phá vỡ BB Upper — tín hiệu breakout mạnh` });
  }
  if (bbLower && curr.close <= bbLower && supportZones.some(z => curr.close >= z.bottom && curr.close <= z.top)) {
    conditions.push({ key: 'bb_oversold', msg: `🔥 VIP: ${sym} chạm BB Lower + vùng hỗ trợ AI — cơ hội mua cực tốt` });
  }
  const twoBack = candles[n - 2];
  if (twoBack) {
    const pct = ((curr.close - twoBack.close) / twoBack.close) * 100;
    const threshold = sym === 'XAU' || sym === 'GOLD' ? 0.8 : 1.5;
    if (Math.abs(pct) > threshold) {
      conditions.push({ key: 'momentum', msg: `${sym} ${pct > 0 ? 'tăng' : 'giảm'} ${Math.abs(pct).toFixed(2)}% trong 2 nến — momentum ${pct > 0 ? 'mạnh' : 'yếu'}` });
    }
  }
  if (volRatio > 1.5 && Math.abs(curr.close - curr.open) / curr.open > 0.002) {
    const dir = curr.close > curr.open ? 'tăng' : 'giảm';
    conditions.push({ key: 'volume_spike', msg: `Volume spike ${sym} (${(volRatio * 100).toFixed(0)}%) + nến ${dir} — xác nhận xu hướng` });
  }
  if (rsiVal && rsiVal > 60 && curr.close > prev.close && rsiVal < (indicators.rsi[n - 1] || 50)) {
    conditions.push({ key: 'rsi_divergence', msg: `RSI divergence bearish trên ${sym} — giá tăng nhưng RSI giảm` });
  }
  if (rsiVal && rsiVal < 40 && curr.close < prev.close && rsiVal > (indicators.rsi[n - 1] || 50)) {
    conditions.push({ key: 'rsi_divergence', msg: `RSI divergence bullish trên ${sym} — giá giảm nhưng RSI tăng` });
  }
  if (supportZones.some(z => prev.low >= z.bottom * 0.998 && prev.low <= z.top * 1.002) &&
      curr.close > prev.close && curr.close > curr.open) {
    conditions.push({ key: 'support_bounce', msg: `${sym} bounce từ hỗ trợ AI — nến đảo chiều tăng` });
  }
  return conditions;
}

function buildSignal(
  candles: Candle[],
  indicators: Indicators | null,
  zones: Zone[],
  symbol: string,
  n: number,
  pickStrategy: 'random' | 'first' = 'random',
  isNew = false,
): SmartSignal | null {
  const conditions = detectAt(candles, indicators, zones, symbol.replace('/USDT', '').replace('/', ''), n);
  if (conditions.length === 0) return null;
  const sym = symbol.replace('/USDT', '').replace('/', '');
  const picked = pickStrategy === 'first'
    ? conditions[0]
    : conditions[Math.floor(Math.random() * conditions.length)];
  const meta = SIGNAL_MESSAGES[picked.key] || { badge: 'ALERT', type: 'alert' as const };
  const curr = candles[n];
  const closes = candles.slice(Math.max(0, n - 19), n + 1).map(c => c.close);
  const ts = curr.time; // ms
  const d = new Date(ts);
  return {
    id: `smart-${sym}-${ts}-${picked.key}`,
    time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    createdAt: ts,
    message: picked.msg,
    type: meta.type,
    symbol: sym,
    badge: meta.badge,
    price: curr.close,
    sparkline: closes,
    isNew,
  };
}

export function useSmartSignals(
  candles: Candle[],
  indicators: Indicators | null,
  zones: Zone[],
  symbol: string,
  loading: boolean,
) {
  const [signals, setSignals] = useState<SmartSignal[]>([]);
  const seededRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Seed once: scan back over recent candles to surface real, recent signals
  useEffect(() => {
    if (seededRef.current) return;
    if (loading || !candles.length || !indicators) return;
    const scanFrom = Math.max(2, candles.length - 60);
    const collected: SmartSignal[] = [];
    let lastKey = '';
    for (let n = scanFrom; n < candles.length; n++) {
      const sig = buildSignal(candles, indicators, zones, symbol, n, 'first', false);
      if (!sig) continue;
      // Avoid back-to-back identical types
      if (sig.type === lastKey) continue;
      lastKey = sig.type;
      collected.push(sig);
    }
    // Keep last 8 (most recent)
    const seeded = collected.slice(-8).reverse();
    if (seeded.length > 0) {
      setSignals(seeded);
    }
    seededRef.current = true;
  }, [loading, candles, indicators, zones, symbol]);

  const generate = useCallback(() => {
    if (loading || !candles.length) return;
    const n = candles.length - 1;
    const signal = buildSignal(candles, indicators, zones, symbol, n, 'random', true);
    if (!signal) return;
    setSignals(prev => {
      // Skip if same id already present
      if (prev.some(s => s.id === signal.id)) return prev;
      return [signal, ...prev.map(s => ({ ...s, isNew: false }))].slice(0, 20);
    });
    setTimeout(() => {
      setSignals(prev => prev.map(s => s.id === signal.id ? { ...s, isNew: false } : s));
    }, 2500);
  }, [candles, indicators, zones, symbol, loading]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(generate, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [generate]);

  return signals;
}
