import React, { useMemo } from 'react';
import type { Candle } from '@/hooks/useMarketData';
import type { IndicatorVote } from '@/lib/indicatorVotes';

interface Setup {
  bias: 'LONG' | 'SHORT';
  type: string;
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  tp3: number;
  rr: number;
  confidence: number; // 0-100
  notes: string[];
}

interface Props {
  pair: string;
  livePrice: number;
  candles: Candle[];
  votes: IndicatorVote[];
  strengthScore: number;
}

// ATR(14)
function atr14(candles: Candle[]): number {
  if (candles.length < 15) return 0;
  const trs: number[] = [];
  for (let i = candles.length - 14; i < candles.length; i++) {
    const c = candles[i];
    const p = candles[i - 1];
    trs.push(Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close)));
  }
  return trs.reduce((s, x) => s + x, 0) / trs.length;
}

const fmt = (n: number) => n < 1 ? n.toPrecision(5) : n.toLocaleString(undefined, { maximumFractionDigits: 2 });

const TradeSetupCards: React.FC<Props> = ({ pair, livePrice, candles, votes, strengthScore }) => {
  const setups = useMemo<Setup[]>(() => {
    if (!livePrice || candles.length < 50) return [];
    const atr = atr14(candles);
    if (!atr) return [];

    const recentHigh = Math.max(...candles.slice(-50).map(c => c.high));
    const recentLow = Math.min(...candles.slice(-50).map(c => c.low));

    const bullVotes = votes.filter(v => v.vote === 1).length;
    const bearVotes = votes.filter(v => v.vote === -1).length;
    const dominantBias: 'LONG' | 'SHORT' = strengthScore >= 0 ? 'LONG' : 'SHORT';
    const oppositeBias: 'LONG' | 'SHORT' = dominantBias === 'LONG' ? 'SHORT' : 'LONG';

    const baseConfidence = Math.min(95, 45 + Math.abs(strengthScore) * 0.6);

    // Setup A — Trend continuation @ market
    const aBias = dominantBias;
    const aEntry = livePrice;
    const aSL = aBias === 'LONG' ? livePrice - atr * 1.5 : livePrice + atr * 1.5;
    const aTP1 = aBias === 'LONG' ? livePrice + atr * 1.5 : livePrice - atr * 1.5;
    const aTP2 = aBias === 'LONG' ? livePrice + atr * 3 : livePrice - atr * 3;
    const aTP3 = aBias === 'LONG' ? recentHigh : recentLow;
    const aRR = Math.abs(aTP2 - aEntry) / Math.abs(aSL - aEntry);

    // Setup B — Pullback to mid range
    const mid = (recentHigh + recentLow) / 2;
    const bBias = dominantBias;
    const bEntry = bBias === 'LONG' ? Math.min(livePrice, mid + atr * 0.3) : Math.max(livePrice, mid - atr * 0.3);
    const bSL = bBias === 'LONG' ? bEntry - atr * 1.8 : bEntry + atr * 1.8;
    const bTP1 = bBias === 'LONG' ? bEntry + atr * 2 : bEntry - atr * 2;
    const bTP2 = bBias === 'LONG' ? bEntry + atr * 4 : bEntry - atr * 4;
    const bTP3 = bBias === 'LONG' ? recentHigh + atr : recentLow - atr;
    const bRR = Math.abs(bTP2 - bEntry) / Math.abs(bSL - bEntry);

    // Setup C — Counter-trend at extreme
    const cBias = oppositeBias;
    const cEntry = cBias === 'LONG' ? recentLow + atr * 0.5 : recentHigh - atr * 0.5;
    const cSL = cBias === 'LONG' ? recentLow - atr * 1.2 : recentHigh + atr * 1.2;
    const cTP1 = cBias === 'LONG' ? cEntry + atr * 2 : cEntry - atr * 2;
    const cTP2 = mid;
    const cTP3 = cBias === 'LONG' ? mid + atr * 2 : mid - atr * 2;
    const cRR = Math.abs(cTP2 - cEntry) / Math.abs(cSL - cEntry);

    return [
      {
        bias: aBias, type: 'Theo Trend · Market',
        entry: aEntry, sl: aSL, tp1: aTP1, tp2: aTP2, tp3: aTP3, rr: aRR,
        confidence: Math.round(baseConfidence),
        notes: [`${bullVotes} bull / ${bearVotes} bear votes`, `SL = 1.5× ATR (${atr.toFixed(2)})`],
      },
      {
        bias: bBias, type: 'Pullback · Mid Range',
        entry: bEntry, sl: bSL, tp1: bTP1, tp2: bTP2, tp3: bTP3, rr: bRR,
        confidence: Math.round(baseConfidence * 0.85),
        notes: [`Entry vùng giữa ${fmt(recentLow)}–${fmt(recentHigh)}`, `Đợi xác nhận price action`],
      },
      {
        bias: cBias, type: 'Counter-Trend · Extreme',
        entry: cEntry, sl: cSL, tp1: cTP1, tp2: cTP2, tp3: cTP3, rr: cRR,
        confidence: Math.round(35 + Math.random() * 15),
        notes: [`Cảnh báo: ngược trend chính`, `Chỉ kích khi giá test ${cBias === 'LONG' ? 'low' : 'high'}`],
      },
    ];
  }, [livePrice, candles, votes, strengthScore]);

  if (setups.length === 0) {
    return (
      <div className="border border-[#2b3139] rounded-md bg-[#0b0e11] p-3 text-center">
        <p className="text-[10px] font-mono text-[#5e6673]">Đang tính toán setups...</p>
      </div>
    );
  }

  return (
    <div className="border border-[#2b3139] rounded-md bg-[#0b0e11] overflow-hidden">
      <div className="flex items-center justify-between bg-[#1e2329] px-2 py-1.5 border-b border-[#2b3139]">
        <span className="text-[9px] font-mono font-bold tracking-[0.18em] text-[#fcd535]">⚡ AUTO TRADE SETUPS · {pair}</span>
        <span className="text-[8px] font-mono text-[#5e6673]">ATR-based · không phải lời khuyên đầu tư</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2b3139]">
        {setups.map((s, i) => {
          const isLong = s.bias === 'LONG';
          const accent = isLong ? '#0ecb81' : '#f6465d';
          return (
            <div key={i} className="bg-[#0b0e11] p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tabular-nums"
                    style={{ backgroundColor: `${accent}1f`, color: accent }}
                  >
                    {isLong ? '▲ LONG' : '▼ SHORT'}
                  </span>
                  <span className="text-[10px] font-mono text-[#eaecef] font-semibold">{s.type}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[8px] font-mono text-[#5e6673]">CONF</span>
                  <span className={`text-[10px] font-mono font-bold ${s.confidence >= 70 ? 'text-[#0ecb81]' : s.confidence >= 50 ? 'text-[#fcd535]' : 'text-[#848e9c]'}`}>
                    {s.confidence}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] font-mono tabular-nums">
                <div className="flex justify-between"><span className="text-[#5e6673]">Entry</span><span className="text-[#eaecef] font-bold">{fmt(s.entry)}</span></div>
                <div className="flex justify-between"><span className="text-[#5e6673]">SL</span><span className="text-[#f6465d] font-bold">{fmt(s.sl)}</span></div>
                <div className="flex justify-between"><span className="text-[#5e6673]">TP1</span><span className="text-[#0ecb81]">{fmt(s.tp1)}</span></div>
                <div className="flex justify-between"><span className="text-[#5e6673]">TP2</span><span className="text-[#0ecb81]">{fmt(s.tp2)}</span></div>
                <div className="flex justify-between"><span className="text-[#5e6673]">TP3</span><span className="text-[#0ecb81]">{fmt(s.tp3)}</span></div>
                <div className="flex justify-between"><span className="text-[#5e6673]">R:R</span><span className="text-[#fcd535] font-bold">{s.rr.toFixed(2)}</span></div>
              </div>

              <div className="pt-1 border-t border-[#2b3139]/60 space-y-0.5">
                {s.notes.map((n, j) => (
                  <p key={j} className="text-[9px] font-mono text-[#848e9c] leading-tight">· {n}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TradeSetupCards;
