import type { Candle } from '@/hooks/useMarketData';
import type { AITrendline } from '@/components/indicators/TradingChart';

interface Pivot {
  idx: number;
  price: number;
  time: number;
}

/**
 * ATR(14) — simple True Range moving average. Trả về mảng đồng độ dài candles
 * (giá trị đầu = NaN cho các bar chưa đủ dữ liệu).
 */
function computeATR(candles: Candle[], period = 14): number[] {
  const tr: number[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (i === 0) { tr.push(candles[0].high - candles[0].low); continue; }
    const c = candles[i], p = candles[i - 1];
    tr.push(Math.max(
      c.high - c.low,
      Math.abs(c.high - p.close),
      Math.abs(c.low - p.close),
    ));
  }
  const atr: number[] = new Array(candles.length).fill(NaN);
  let sum = 0;
  for (let i = 0; i < tr.length; i++) {
    sum += tr[i];
    if (i >= period) sum -= tr[i - period];
    if (i >= period - 1) atr[i] = sum / period;
  }
  return atr;
}

/**
 * Pivot detection: high/low chặt — cao/thấp hơn nghiêm ngặt windowSize bar 2 bên.
 */
function findPivots(candles: Candle[], windowSize = 5): { lows: Pivot[]; highs: Pivot[] } {
  const lows: Pivot[] = [];
  const highs: Pivot[] = [];

  for (let i = windowSize; i < candles.length - windowSize; i++) {
    let isLow = true, isHigh = true;
    for (let j = 1; j <= windowSize; j++) {
      if (candles[i].low >= candles[i - j].low || candles[i].low >= candles[i + j].low) isLow = false;
      if (candles[i].high <= candles[i - j].high || candles[i].high <= candles[i + j].high) isHigh = false;
    }
    if (isLow) lows.push({ idx: i, price: candles[i].low, time: candles[i].time });
    if (isHigh) highs.push({ idx: i, price: candles[i].high, time: candles[i].time });
  }
  return { lows, highs };
}

function lineFromTwoPivots(a: Pivot, b: Pivot) {
  const slope = (b.price - a.price) / (b.idx - a.idx);
  const intercept = a.price - slope * a.idx;
  return { slope, intercept };
}

/**
 * Score & validate một line:
 *  - Tolerance touch/break tính theo ATR cục bộ tại từng bar (không fix %).
 *  - Đường bị "phá" trong khoảng [a.idx, b.idx] thì loại bỏ.
 *  - Sau b.idx, tiếp tục quét xem có break không → trả brokenIdx (>=0 nếu có).
 */
function scoreAndValidate(
  pivots: Pivot[],
  candles: Candle[],
  atr: number[],
  slope: number,
  intercept: number,
  type: 'support' | 'resistance',
  startIdx: number,
  endIdx: number,
): { touches: number; valid: boolean; brokenIdx: number } {
  // Validate trong phạm vi anchor
  for (let i = startIdx; i <= endIdx && i < candles.length; i++) {
    const lineY = slope * i + intercept;
    const a = isFinite(atr[i]) ? atr[i] : 0;
    const breakTol = a * 1.0; // 1 * ATR
    if (type === 'support' && candles[i].close < lineY - breakTol) return { touches: 0, valid: false, brokenIdx: -1 };
    if (type === 'resistance' && candles[i].close > lineY + breakTol) return { touches: 0, valid: false, brokenIdx: -1 };
  }

  // Đếm touch
  let touches = 0;
  for (const p of pivots) {
    if (p.idx < startIdx || p.idx > endIdx) continue;
    const lineY = slope * p.idx + intercept;
    const tol = (isFinite(atr[p.idx]) ? atr[p.idx] : 0) * 0.5; // 0.5 * ATR = touch
    if (Math.abs(p.price - lineY) <= tol) touches++;
  }

  // Quét broken sau b.idx (close vượt > 1 ATR)
  let brokenIdx = -1;
  for (let i = endIdx + 1; i < candles.length; i++) {
    const lineY = slope * i + intercept;
    const a = isFinite(atr[i]) ? atr[i] : 0;
    const breakTol = a * 1.0;
    if (type === 'support' && candles[i].close < lineY - breakTol) { brokenIdx = i; break; }
    if (type === 'resistance' && candles[i].close > lineY + breakTol) { brokenIdx = i; break; }
  }

  return { touches, valid: true, brokenIdx };
}

/**
 * Tìm trendline tốt nhất.
 * Score = touches*10 + recencyBonus + nearPriceBonus
 *   - recencyBonus: ưu tiên đường mà b.idx (anchor cuối) gần nến hiện tại.
 *   - nearPriceBonus: ưu tiên đường mà giá hiện tại đang gần line (≤ 2*ATR).
 *   - Đường BROKEN bị giảm điểm 50% nhưng vẫn giữ lại nếu broken trong vòng 8 bar gần nhất (vai trò role-reversal).
 */
function findBestTrendline(
  pivots: Pivot[],
  candles: Candle[],
  atr: number[],
  type: 'support' | 'resistance',
): AITrendline | null {
  if (pivots.length < 2 || candles.length < 30) return null;

  const recent = pivots.slice(-14);
  const lastIdx = candles.length - 1;
  const avgBarMs = (candles[lastIdx].time - candles[0].time) / Math.max(1, lastIdx);
  const lastPrice = candles[lastIdx].close;
  const refAtr = isFinite(atr[lastIdx]) ? atr[lastIdx] : (candles[lastIdx].high - candles[lastIdx].low);

  let best: { line: AITrendline; score: number } | null = null;

  for (let i = 0; i < recent.length - 1; i++) {
    for (let j = i + 1; j < recent.length; j++) {
      const a = recent[i], b = recent[j];
      if (b.idx - a.idx < 5) continue;

      const { slope, intercept } = lineFromTwoPivots(a, b);
      const slopePerBar = slope;
      // Slope sanity: tính theo ATR — không cho line dốc vô lý.
      // |slope| / ATR ≤ 0.5 nghĩa là mỗi bar không nhảy quá 0.5 ATR.
      if (refAtr > 0 && Math.abs(slopePerBar) / refAtr > 0.5) continue;
      // Hướng cơ bản: support không quá dốc xuống, resistance không quá dốc lên.
      if (type === 'support' && slopePerBar < -refAtr * 0.15) continue;
      if (type === 'resistance' && slopePerBar > refAtr * 0.15) continue;

      const sv = scoreAndValidate(pivots, candles, atr, slope, intercept, type, a.idx, b.idx);
      if (!sv.valid) continue;
      if (sv.touches < 2) continue;

      const broken = sv.brokenIdx >= 0;
      // Loại đường bị phá quá lâu (>10 bar) — không còn ý nghĩa
      const brokenAge = broken ? lastIdx - sv.brokenIdx : 0;
      if (broken && brokenAge > 10) continue;

      // Recency: b.idx càng gần lastIdx càng tốt
      const recency = 1 - Math.min(1, (lastIdx - b.idx) / Math.max(20, lastIdx));
      // Nearness: giá hiện tại gần line không?
      const lineAtNow = slope * lastIdx + intercept;
      const dist = Math.abs(lastPrice - lineAtNow) / Math.max(refAtr, 1e-9);
      const nearness = Math.max(0, 1 - dist / 4); // 0 nếu cách >4 ATR

      let score = sv.touches * 10 + recency * 5 + nearness * 6;
      if (broken) score *= 0.5;

      // Project end forward 15 bar nếu chưa broken, hoặc dừng tại brokenIdx
      const projectionBars = broken ? 0 : 15;
      const endIdxLogical = broken
        ? sv.brokenIdx
        : Math.min(lastIdx + projectionBars, lastIdx + 30);
      const endIdxClamped = Math.min(endIdxLogical, lastIdx + 30);
      const startTime = candles[a.idx].time;
      const endTime = endIdxClamped <= lastIdx
        ? candles[endIdxClamped].time
        : candles[lastIdx].time + (endIdxClamped - lastIdx) * avgBarMs;

      const candidate: AITrendline = {
        start: { time: startTime, price: slope * a.idx + intercept },
        end: { time: endTime, price: slope * endIdxClamped + intercept },
        broken,
        brokenAt: broken ? candles[sv.brokenIdx].time : undefined,
        slopePerBar,
        touches: sv.touches,
      };

      if (!best || score > best.score) best = { line: candidate, score };
    }
  }

  return best?.line ?? null;
}

export function computeTrendline(candles: Candle[]): AITrendline | null {
  if (candles.length < 30) return null;
  const atr = computeATR(candles, 14);
  const { lows, highs } = findPivots(candles, 5);
  const support = findBestTrendline(lows, candles, atr, 'support');
  const resistance = findBestTrendline(highs, candles, atr, 'resistance');
  return support || resistance;
}

export function computeDualTrendlines(candles: Candle[]): {
  support: AITrendline | null;
  resistance: AITrendline | null;
} {
  if (candles.length < 30) return { support: null, resistance: null };
  const atr = computeATR(candles, 14);
  const { lows, highs } = findPivots(candles, 5);
  return {
    support: findBestTrendline(lows, candles, atr, 'support'),
    resistance: findBestTrendline(highs, candles, atr, 'resistance'),
  };
}
