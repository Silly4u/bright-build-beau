import type { Candle } from '@/hooks/useMarketData';

/**
 * Alpha Net Pro Support/Resistance
 * Ported from Pine Script v6
 * 
 * Features:
 * - Stochastic RSI (K, D lines)
 * - Pivot-based Support/Resistance Channels
 * - Combined Buy/Sell signals (StochRSI + S/R levels)
 * - S/R broken detection
 */

// ── Helpers ──

function computeRSI(closes: number[], period: number): number[] {
  const rsi = new Array(closes.length).fill(NaN);
  if (closes.length < period + 1) return rsi;

  let gainSum = 0;
  let lossSum = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gainSum += diff;
    else lossSum += Math.abs(diff);
  }
  let avgGain = gainSum / period;
  let avgLoss = lossSum / period;
  rsi[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);

  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    rsi[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return rsi;
}

function sma(values: number[], period: number): number[] {
  const result = new Array(values.length).fill(NaN);
  for (let i = period - 1; i < values.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = i - period + 1; j <= i; j++) {
      if (!isNaN(values[j])) {
        sum += values[j];
        count++;
      }
    }
    if (count === period) result[i] = sum / count;
  }
  return result;
}

function stochastic(src: number[], high: number[], low: number[], period: number): number[] {
  const result = new Array(src.length).fill(NaN);
  for (let i = period - 1; i < src.length; i++) {
    let hh = -Infinity;
    let ll = Infinity;
    for (let j = i - period + 1; j <= i; j++) {
      if (!isNaN(high[j]) && high[j] > hh) hh = high[j];
      if (!isNaN(low[j]) && low[j] < ll) ll = low[j];
    }
    if (hh !== ll && !isNaN(src[i])) {
      result[i] = ((src[i] - ll) / (hh - ll)) * 100;
    }
  }
  return result;
}

// ── Pivot detection ──

function findPivotHigh(src: number[], leftBars: number, rightBars: number): (number | null)[] {
  const result: (number | null)[] = new Array(src.length).fill(null);
  for (let i = leftBars; i < src.length - rightBars; i++) {
    let isPivot = true;
    for (let j = 1; j <= leftBars; j++) {
      if (src[i - j] >= src[i]) { isPivot = false; break; }
    }
    if (!isPivot) continue;
    for (let j = 1; j <= rightBars; j++) {
      if (src[i + j] >= src[i]) { isPivot = false; break; }
    }
    if (isPivot) result[i] = src[i];
  }
  return result;
}

function findPivotLow(src: number[], leftBars: number, rightBars: number): (number | null)[] {
  const result: (number | null)[] = new Array(src.length).fill(null);
  for (let i = leftBars; i < src.length - rightBars; i++) {
    let isPivot = true;
    for (let j = 1; j <= leftBars; j++) {
      if (src[i - j] <= src[i]) { isPivot = false; break; }
    }
    if (!isPivot) continue;
    for (let j = 1; j <= rightBars; j++) {
      if (src[i + j] <= src[i]) { isPivot = false; break; }
    }
    if (isPivot) result[i] = src[i];
  }
  return result;
}

// ── S/R Channel computation ──

export interface SRChannel {
  top: number;
  bottom: number;
  type: 'support' | 'resistance' | 'neutral';
  strength: number;
}

export interface SRSignal {
  index: number;
  time: number;
  type: 'BUY' | 'SELL';
  price: number;
}

export interface SRBroken {
  index: number;
  time: number;
  type: 'resistance_broken' | 'support_broken';
  price: number;
}

export interface StochRSIPoint {
  time: number;
  k: number;
  d: number;
}

export interface SupportResistanceResult {
  channels: SRChannel[];
  signals: SRSignal[];
  broken: SRBroken[];
  stochRsi: StochRSIPoint[];
  lastK: number;
  lastD: number;
  pivotHighs: { time: number; price: number }[];
  pivotLows: { time: number; price: number }[];
}

export function computeSupportResistance(
  candles: Candle[],
  options?: {
    pivotPeriod?: number;
    channelWidth?: number;
    minStrength?: number;
    maxNumSR?: number;
    loopback?: number;
    smoothK?: number;
    smoothD?: number;
    lengthRSI?: number;
    lengthStoch?: number;
  }
): SupportResistanceResult {
  const prd = options?.pivotPeriod ?? 10;
  const channelW = options?.channelWidth ?? 5;
  const minstrength = options?.minStrength ?? 1;
  const maxnumsr = (options?.maxNumSR ?? 6) - 1;
  const loopback = Math.min(options?.loopback ?? 290, candles.length - 1);
  const smoothK = options?.smoothK ?? 3;
  const smoothD = options?.smoothD ?? 3;
  const lengthRSI = options?.lengthRSI ?? 14;
  const lengthStoch = options?.lengthStoch ?? 14;

  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const opens = candles.map(c => c.open);

  // ── Stochastic RSI ──
  const rsi1 = computeRSI(closes, lengthRSI);
  const stochRaw = stochastic(rsi1, rsi1, rsi1, lengthStoch);
  const k = sma(stochRaw, smoothK);
  const d = sma(k, smoothD);

  const stochRsiPoints: StochRSIPoint[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (!isNaN(k[i]) && !isNaN(d[i])) {
      stochRsiPoints.push({ time: candles[i].time, k: k[i], d: d[i] });
    }
  }

  // ── Pivots ──
  const src1 = highs; // High/Low mode
  const src2 = lows;
  const ph = findPivotHigh(src1, prd, prd);
  const pl = findPivotLow(src2, prd, prd);

  const pivotHighs: { time: number; price: number }[] = [];
  const pivotLows: { time: number; price: number }[] = [];

  // Collect pivot values and locations
  const pivotVals: number[] = [];
  const pivotLocs: number[] = [];

  const n = candles.length;

  for (let i = 0; i < n; i++) {
    if (ph[i] !== null) pivotHighs.push({ time: candles[i].time, price: ph[i]! });
    if (pl[i] !== null) pivotLows.push({ time: candles[i].time, price: pl[i]! });

    if (ph[i] !== null || pl[i] !== null) {
      pivotVals.unshift(ph[i] !== null ? ph[i]! : pl[i]!);
      pivotLocs.unshift(i);

      // Remove old pivots beyond loopback
      while (pivotVals.length > 0 && i - pivotLocs[pivotLocs.length - 1] > loopback) {
        pivotVals.pop();
        pivotLocs.pop();
      }
    }
  }

  // ── Compute S/R channels at the last bar ──
  // Find highest/lowest in last 300 bars
  const lookback = Math.min(300, n);
  let prdhighest = -Infinity;
  let prdlowest = Infinity;
  for (let i = n - lookback; i < n; i++) {
    if (i < 0) continue;
    if (highs[i] > prdhighest) prdhighest = highs[i];
    if (lows[i] < prdlowest) prdlowest = lows[i];
  }
  const cwidth = (prdhighest - prdlowest) * channelW / 100;

  // Get S/R values from current pivots
  const getSrVals = (ind: number): [number, number, number] => {
    if (ind >= pivotVals.length) return [0, 0, 0];
    let lo = pivotVals[ind];
    let hi = lo;
    let numpp = 0;
    for (let y = 0; y < pivotVals.length; y++) {
      const cpp = pivotVals[y];
      const wdth = cpp <= hi ? hi - cpp : cpp - lo;
      if (wdth <= cwidth) {
        if (cpp <= hi) lo = Math.min(lo, cpp);
        else hi = Math.max(hi, cpp);
        numpp += 20;
      }
    }
    return [hi, lo, numpp];
  };

  // Build supres array
  const supres: number[] = []; // [strength, hi, lo, strength, hi, lo, ...]
  for (let x = 0; x < pivotVals.length; x++) {
    const [hi, lo, strength] = getSrVals(x);
    supres.push(strength, hi, lo);
  }

  // Count touches for each SR zone
  for (let x = 0; x < pivotVals.length; x++) {
    const h = supres[x * 3 + 1];
    const l = supres[x * 3 + 2];
    let s = 0;
    for (let y = 0; y < Math.min(loopback, n); y++) {
      const idx = n - 1 - y;
      if (idx < 0) break;
      if ((highs[idx] <= h && highs[idx] >= l) || (lows[idx] <= h && lows[idx] >= l)) {
        s++;
      }
    }
    supres[x * 3] += s;
  }

  // Sort and select top SR channels
  const srResult: number[] = new Array(20).fill(0); // 10 pairs of [hi, lo]
  const stren: number[] = new Array(10).fill(0);
  let srcIdx = 0;

  const supresClone = [...supres];
  for (let x = 0; x < pivotVals.length && srcIdx < 10; x++) {
    let stv = -1;
    let stl = -1;
    for (let y = 0; y < pivotVals.length; y++) {
      if (supresClone[y * 3] > stv && supresClone[y * 3] >= minstrength * 20) {
        stv = supresClone[y * 3];
        stl = y;
      }
    }
    if (stl >= 0) {
      const hh = supresClone[stl * 3 + 1];
      const ll = supresClone[stl * 3 + 2];
      srResult[srcIdx * 2] = hh;
      srResult[srcIdx * 2 + 1] = ll;
      stren[srcIdx] = supresClone[stl * 3];

      // Mark overlapping as used
      for (let y = 0; y < pivotVals.length; y++) {
        if ((supresClone[y * 3 + 1] <= hh && supresClone[y * 3 + 1] >= ll) ||
            (supresClone[y * 3 + 2] <= hh && supresClone[y * 3 + 2] >= ll)) {
          supresClone[y * 3] = -1;
        }
      }
      srcIdx++;
    }
  }

  // Sort by strength
  for (let x = 0; x < 9; x++) {
    for (let y = x + 1; y < 10; y++) {
      if (stren[y] > stren[x]) {
        // Swap strength
        const tmpS = stren[y]; stren[y] = stren[x]; stren[x] = tmpS;
        // Swap SR values
        const tmpH = srResult[y * 2]; srResult[y * 2] = srResult[x * 2]; srResult[x * 2] = tmpH;
        const tmpL = srResult[y * 2 + 1]; srResult[y * 2 + 1] = srResult[x * 2 + 1]; srResult[x * 2 + 1] = tmpL;
      }
    }
  }

  // Build channels
  const channels: SRChannel[] = [];
  const lastClose = closes[n - 1];
  for (let x = 0; x <= Math.min(9, maxnumsr); x++) {
    const hi = srResult[x * 2];
    const lo = srResult[x * 2 + 1];
    if (hi === 0 && lo === 0) continue;
    const type: 'support' | 'resistance' | 'neutral' =
      hi > lastClose && lo > lastClose ? 'resistance' :
      hi < lastClose && lo < lastClose ? 'support' : 'neutral';
    channels.push({ top: hi, bottom: lo, type, strength: stren[x] });
  }

  // ── Detect broken S/R ──
  const broken: SRBroken[] = [];
  for (let i = 1; i < n; i++) {
    // Check if price is NOT in any channel
    let notInChannel = true;
    for (let x = 0; x <= Math.min(9, maxnumsr); x++) {
      if (srResult[x * 2] === 0 && srResult[x * 2 + 1] === 0) continue;
      if (closes[i] <= srResult[x * 2] && closes[i] >= srResult[x * 2 + 1]) {
        notInChannel = false;
        break;
      }
    }
    if (notInChannel) {
      for (let x = 0; x <= Math.min(9, maxnumsr); x++) {
        if (srResult[x * 2] === 0 && srResult[x * 2 + 1] === 0) continue;
        if (closes[i - 1] <= srResult[x * 2] && closes[i] > srResult[x * 2]) {
          broken.push({ index: i, time: candles[i].time, type: 'resistance_broken', price: srResult[x * 2] });
        }
        if (closes[i - 1] >= srResult[x * 2 + 1] && closes[i] < srResult[x * 2 + 1]) {
          broken.push({ index: i, time: candles[i].time, type: 'support_broken', price: srResult[x * 2 + 1] });
        }
      }
    }
  }

  // ── Combined signals: BUY when K<30 AND at support, SELL when K>70 AND at resistance ──
  const signals: SRSignal[] = [];
  for (let i = 0; i < n; i++) {
    if (isNaN(k[i])) continue;
    let atSupport = false;
    let atResistance = false;

    for (let x = 0; x <= Math.min(9, maxnumsr); x++) {
      const supportLevel = srResult[x * 2 + 1];
      const resistanceLevel = srResult[x * 2];
      if (supportLevel === 0 && resistanceLevel === 0) continue;
      const range = resistanceLevel - supportLevel;
      if (range <= 0) continue;

      if (closes[i] >= supportLevel && closes[i] <= supportLevel + range * 0.1) {
        atSupport = true;
      }
      if (closes[i] <= resistanceLevel && closes[i] >= resistanceLevel - range * 0.1) {
        atResistance = true;
      }
    }

    if (k[i] < 30 && atSupport) {
      signals.push({ index: i, time: candles[i].time, type: 'BUY', price: candles[i].low });
    }
    if (k[i] > 70 && atResistance) {
      signals.push({ index: i, time: candles[i].time, type: 'SELL', price: candles[i].high });
    }
  }

  const lastK = k[n - 1] ?? 0;
  const lastD = d[n - 1] ?? 0;

  return {
    channels,
    signals,
    broken,
    stochRsi: stochRsiPoints,
    lastK,
    lastD,
    pivotHighs,
    pivotLows,
  };
}
