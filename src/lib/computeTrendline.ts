import type { Candle } from '@/hooks/useMarketData';
import type { AITrendline } from '@/components/indicators/TradingChart';

/**
 * Find pivot lows (swing lows) and pivot highs (swing highs)
 * then fit the best trendline through 3+ points.
 */
function findPivots(candles: Candle[], windowSize = 5) {
  const lows: { idx: number; price: number; time: number }[] = [];
  const highs: { idx: number; price: number; time: number }[] = [];

  for (let i = windowSize; i < candles.length - windowSize; i++) {
    let isLow = true;
    let isHigh = true;
    for (let j = 1; j <= windowSize; j++) {
      if (candles[i].low >= candles[i - j].low || candles[i].low >= candles[i + j].low) isLow = false;
      if (candles[i].high <= candles[i - j].high || candles[i].high <= candles[i + j].high) isHigh = false;
    }
    if (isLow) lows.push({ idx: i, price: candles[i].low, time: candles[i].time });
    if (isHigh) highs.push({ idx: i, price: candles[i].high, time: candles[i].time });
  }

  return { lows, highs };
}

/**
 * Fit a line through pivots using least squares, return start/end points.
 * Only returns if 3+ pivots exist.
 */
function fitLine(
  pivots: { idx: number; price: number; time: number }[],
  candles: Candle[]
): AITrendline | null {
  if (pivots.length < 3) return null;

  // Use last N pivots for recency
  const pts = pivots.slice(-6);
  const n = pts.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (const p of pts) {
    sumX += p.idx;
    sumY += p.price;
    sumXY += p.idx * p.price;
    sumXX += p.idx * p.idx;
  }
  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  const startIdx = pts[0].idx;
  const endIdx = Math.min(candles.length - 1, pts[pts.length - 1].idx + 10);

  return {
    start: {
      time: candles[startIdx].time,
      price: slope * startIdx + intercept,
    },
    end: {
      time: candles[endIdx].time,
      price: slope * endIdx + intercept,
    },
  };
}

/**
 * Compute the most significant trendline from candle data.
 * Returns support trendline (upward from lows) or resistance trendline (downward from highs)
 * whichever has more pivot touches.
 */
export function computeTrendline(candles: Candle[]): AITrendline | null {
  if (candles.length < 20) return null;

  const { lows, highs } = findPivots(candles, 3);

  const supportLine = fitLine(lows, candles);
  const resistanceLine = fitLine(highs, candles);

  // Return whichever has more pivots, prefer support
  if (supportLine && resistanceLine) {
    return lows.length >= highs.length ? supportLine : resistanceLine;
  }
  return supportLine || resistanceLine;
}

/**
 * Compute both support and resistance trendlines
 */
export function computeDualTrendlines(candles: Candle[]): {
  support: AITrendline | null;
  resistance: AITrendline | null;
} {
  if (candles.length < 20) return { support: null, resistance: null };
  const { lows, highs } = findPivots(candles, 3);
  return {
    support: fitLine(lows, candles),
    resistance: fitLine(highs, candles),
  };
}
