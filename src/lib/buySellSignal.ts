/**
 * Buy/Sell Signal indicator — TypeScript port of Alpha Net Pro Pine Script.
 *
 * Core logic:
 * - EMA crossover (fast 12 / slow 26) determines trend (Bull/Bear)
 * - Supertrend (ATR 38, Multiplier 4) generates Buy/Sell signals
 * - Wavy Tunnel (EMA 34 high/close/low) and Tunnel (EMA 144/169)
 * - Color zones: Green/Blue/LBlue/Red/Orange/Yellow
 * - StochRSI momentum confirmation
 */

import type { Candle } from '@/hooks/useMarketData';

// ── Helpers ──

function ema(values: number[], period: number): number[] {
  const result: number[] = new Array(values.length).fill(NaN);
  if (values.length === 0 || period <= 0) return result;
  const k = 2 / (period + 1);
  let prev = NaN;
  for (let i = 0; i < values.length; i++) {
    if (isNaN(values[i])) continue;
    if (isNaN(prev)) {
      prev = values[i];
    } else {
      prev = values[i] * k + prev * (1 - k);
    }
    result[i] = prev;
  }
  return result;
}

function sma(values: number[], period: number): number[] {
  const result: number[] = new Array(values.length).fill(NaN);
  for (let i = period - 1; i < values.length; i++) {
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      if (isNaN(values[j])) { sum = NaN; break; }
      sum += values[j];
    }
    result[i] = isNaN(sum) ? NaN : sum / period;
  }
  return result;
}

function rsi(closes: number[], period: number): number[] {
  const result: number[] = new Array(closes.length).fill(NaN);
  if (closes.length < period + 1) return result;
  let avgGain = 0, avgLoss = 0;
  for (let i = 1; i <= period; i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) avgGain += change; else avgLoss += Math.abs(change);
  }
  avgGain /= period;
  avgLoss /= period;
  result[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  for (let i = period + 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + (change > 0 ? change : 0)) / period;
    avgLoss = (avgLoss * (period - 1) + (change < 0 ? Math.abs(change) : 0)) / period;
    result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  }
  return result;
}

function stoch(src: number[], high: number[], low: number[], period: number): number[] {
  const result: number[] = new Array(src.length).fill(NaN);
  for (let i = period - 1; i < src.length; i++) {
    let hh = -Infinity, ll = Infinity;
    for (let j = i - period + 1; j <= i; j++) {
      if (high[j] > hh) hh = high[j];
      if (low[j] < ll) ll = low[j];
    }
    result[i] = hh === ll ? 50 : ((src[i] - ll) / (hh - ll)) * 100;
  }
  return result;
}

function atr(candles: Candle[], period: number): number[] {
  const result: number[] = new Array(candles.length).fill(NaN);
  const tr: number[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      tr.push(candles[i].high - candles[i].low);
    } else {
      tr.push(Math.max(
        candles[i].high - candles[i].low,
        Math.abs(candles[i].high - candles[i - 1].close),
        Math.abs(candles[i].low - candles[i - 1].close),
      ));
    }
  }
  // Use RMA (Wilder's smoothing) for ATR
  if (tr.length >= period) {
    let sum = 0;
    for (let i = 0; i < period; i++) sum += tr[i];
    result[period - 1] = sum / period;
    for (let i = period; i < tr.length; i++) {
      result[i] = (result[i - 1] * (period - 1) + tr[i]) / period;
    }
  }
  return result;
}

// ── Types ──

export type ColorZone = 'green' | 'blue' | 'lightblue' | 'red' | 'orange' | 'yellow' | 'none';

export interface BuySellSignal {
  index: number;
  time: number;
  type: 'BUY' | 'SELL';
  price: number;
  source: 'supertrend'; // From supertrend direction change
}

export interface BuySellData {
  // Per-bar data
  fastEMA: { time: number; value: number }[];
  slowEMA: { time: number; value: number }[];
  wavyHigh: { time: number; value: number }[];
  wavyMid: { time: number; value: number }[];
  wavyLow: { time: number; value: number }[];
  tunnel1: { time: number; value: number }[];
  tunnel2: { time: number; value: number }[];
  supertrend: { time: number; value: number; direction: number }[];
  colorZones: ColorZone[];
  signals: BuySellSignal[];
  // Current state
  currentTrend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  currentZone: ColorZone;
  currentSignal: 'BUY' | 'SELL' | null;
  takeProfitEMA: { time: number; value: number }[];
}

export function computeBuySellSignal(candles: Candle[]): BuySellData | null {
  const len = candles.length;
  if (len < 170) return null; // Need at least 169 bars for tunnel EMA

  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);

  // ── EMAs ──
  const fastEMA = ema(closes, 12);  // xprd1
  const slowEMA = ema(closes, 26);  // xprd2
  const takeProfitEMA = ema(closes, 12); // stop = EMA(close, 12)
  const wavyH = ema(highs, 34);
  const wavyC = ema(closes, 34);
  const wavyL = ema(lows, 34);
  const t1 = ema(closes, 144);
  const t2 = ema(closes, 169);

  // ── Price (smoothed = EMA 1 = raw close) ──
  const xPrice = closes; // EMA(close, 1) = close

  // ── Bull / Bear ──
  const bull: boolean[] = new Array(len).fill(false);
  const bear: boolean[] = new Array(len).fill(false);
  for (let i = 0; i < len; i++) {
    bull[i] = !isNaN(fastEMA[i]) && !isNaN(slowEMA[i]) && fastEMA[i] > slowEMA[i];
    bear[i] = !isNaN(fastEMA[i]) && !isNaN(slowEMA[i]) && fastEMA[i] < slowEMA[i];
  }

  // ── Color Zones ──
  const colorZones: ColorZone[] = new Array(len).fill('none');
  for (let i = 0; i < len; i++) {
    if (isNaN(fastEMA[i]) || isNaN(slowEMA[i])) continue;
    const p = xPrice[i];
    const fast = fastEMA[i];
    const slow = slowEMA[i];

    if (bull[i] && p > fast) colorZones[i] = 'green';
    else if (bear[i] && p > fast && p > slow) colorZones[i] = 'blue';
    else if (bear[i] && p > fast && p < slow) colorZones[i] = 'lightblue';
    else if (bear[i] && p < fast) colorZones[i] = 'red';
    else if (bull[i] && p < fast && p < slow) colorZones[i] = 'orange';
    else if (bull[i] && p < fast && p > slow) colorZones[i] = 'yellow';
  }

  // ── Supertrend (ATR Period=38, Multiplier=4) ──
  const nATRPeriod = 38;
  const nATRMultip = 4;
  const atrValues = atr(candles, nATRPeriod);

  const upperBand: number[] = new Array(len).fill(NaN);
  const lowerBand: number[] = new Array(len).fill(NaN);
  const supertrendVal: number[] = new Array(len).fill(NaN);
  const direction: number[] = new Array(len).fill(1); // 1 = up, -1 = down

  for (let i = 0; i < len; i++) {
    if (isNaN(atrValues[i])) continue;
    const hl2 = (candles[i].high + candles[i].low) / 2;
    upperBand[i] = hl2 + nATRMultip * atrValues[i];
    lowerBand[i] = hl2 - nATRMultip * atrValues[i];

    if (i > 0 && !isNaN(upperBand[i - 1])) {
      // Actual supertrend logic
      const prevLower = !isNaN(lowerBand[i - 1]) ? lowerBand[i - 1] : lowerBand[i];
      const prevUpper = !isNaN(upperBand[i - 1]) ? upperBand[i - 1] : upperBand[i];

      if (candles[i - 1].close > prevLower) {
        lowerBand[i] = Math.max(lowerBand[i], prevLower);
      }
      if (candles[i - 1].close < prevUpper) {
        upperBand[i] = Math.min(upperBand[i], prevUpper);
      }

      // Direction
      if (direction[i - 1] === -1 && candles[i].close > upperBand[i - 1]) {
        direction[i] = 1;
      } else if (direction[i - 1] === 1 && candles[i].close < lowerBand[i - 1]) {
        direction[i] = -1;
      } else {
        direction[i] = direction[i - 1];
      }

      supertrendVal[i] = direction[i] === 1 ? lowerBand[i] : upperBand[i];
    } else {
      direction[i] = 1;
      supertrendVal[i] = lowerBand[i];
    }
  }

  // ── Signals: direction change ──
  const signals: BuySellSignal[] = [];
  for (let i = 1; i < len; i++) {
    if (isNaN(direction[i]) || isNaN(direction[i - 1])) continue;
    // LONG: direction changed from -1 to 1
    if (direction[i] === 1 && direction[i - 1] === -1) {
      signals.push({
        index: i,
        time: candles[i].time,
        type: 'BUY',
        price: candles[i].low,
        source: 'supertrend',
      });
    }
    // SHORT: direction changed from 1 to -1
    if (direction[i] === -1 && direction[i - 1] === 1) {
      signals.push({
        index: i,
        time: candles[i].time,
        type: 'SELL',
        price: candles[i].high,
        source: 'supertrend',
      });
    }
  }

  // ── Build output arrays (time-series for chart) ──
  const toTimeSeries = (arr: number[]) =>
    arr.map((v, i) => ({ time: candles[i].time, value: v }))
      .filter(p => !isNaN(p.value));

  const lastIdx = len - 1;
  const lastBull = bull[lastIdx];
  const lastBear = bear[lastIdx];

  return {
    fastEMA: toTimeSeries(fastEMA),
    slowEMA: toTimeSeries(slowEMA),
    takeProfitEMA: toTimeSeries(takeProfitEMA),
    wavyHigh: toTimeSeries(wavyH),
    wavyMid: toTimeSeries(wavyC),
    wavyLow: toTimeSeries(wavyL),
    tunnel1: toTimeSeries(t1),
    tunnel2: toTimeSeries(t2),
    supertrend: supertrendVal.map((v, i) => ({
      time: candles[i].time,
      value: v,
      direction: direction[i],
    })).filter(p => !isNaN(p.value)),
    colorZones,
    signals,
    currentTrend: lastBull ? 'BULLISH' : lastBear ? 'BEARISH' : 'NEUTRAL',
    currentZone: colorZones[lastIdx],
    currentSignal: signals.length > 0 ? signals[signals.length - 1].type : null,
  };
}
