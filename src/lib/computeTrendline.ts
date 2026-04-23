import type { Candle } from '@/hooks/useMarketData';
import type { AITrendline } from '@/components/indicators/TradingChart';

interface Pivot {
  idx: number;
  price: number;
  time: number;
}

/**
 * Find pivot lows and pivot highs using a strict swing detection.
 * A pivot low: candle.low is strictly lower than `windowSize` candles on both sides.
 * A pivot high: candle.high is strictly higher than `windowSize` candles on both sides.
 */
function findPivots(candles: Candle[], windowSize = 5): { lows: Pivot[]; highs: Pivot[] } {
  const lows: Pivot[] = [];
  const highs: Pivot[] = [];

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
 * Build a line from two pivots: y = slope * x + intercept
 */
function lineFromTwoPivots(a: Pivot, b: Pivot) {
  const slope = (b.price - a.price) / (b.idx - a.idx);
  const intercept = a.price - slope * a.idx;
  return { slope, intercept };
}

/**
 * Count how many pivots "touch" the line within a tolerance (% of average price).
 * For a SUPPORT (low) trendline: no candle low should violate the line by more than tolerance.
 * For a RESISTANCE (high) trendline: no candle high should violate the line by more than tolerance.
 */
function scoreLine(
  pivots: Pivot[],
  candles: Candle[],
  slope: number,
  intercept: number,
  type: 'support' | 'resistance',
  startIdx: number,
  endIdx: number,
  avgPrice: number,
): { touches: number; valid: boolean } {
  const touchTolerance = avgPrice * 0.003; // 0.3% — counts as a touch
  const breakTolerance = avgPrice * 0.005; // 0.5% — beyond this the line is broken

  let touches = 0;
  let valid = true;

  // Check that no candle BREAKS the line between startIdx and endIdx
  for (let i = startIdx; i <= endIdx && i < candles.length; i++) {
    const lineY = slope * i + intercept;
    if (type === 'support') {
      // Candle low should not go significantly below the line
      if (candles[i].low < lineY - breakTolerance) {
        valid = false;
        break;
      }
    } else {
      // Candle high should not go significantly above the line
      if (candles[i].high > lineY + breakTolerance) {
        valid = false;
        break;
      }
    }
  }

  if (!valid) return { touches: 0, valid: false };

  // Count pivot touches
  for (const p of pivots) {
    if (p.idx < startIdx || p.idx > endIdx) continue;
    const lineY = slope * p.idx + intercept;
    if (Math.abs(p.price - lineY) <= touchTolerance) touches++;
  }

  return { touches, valid: true };
}

/**
 * Find the BEST price-action trendline from a set of pivots.
 * Approach:
 *  1. Try every pair of pivots (last ~12 pivots) as anchor points.
 *  2. For support: require slope to be non-strongly-negative AND each subsequent pivot makes a higher low (rough check).
 *  3. Score each candidate by # of touches; require it not be broken by intervening candles.
 *  4. Pick the line with the most touches (min 2 anchors + at least 1 extra touch preferred).
 */
function findBestTrendline(
  pivots: Pivot[],
  candles: Candle[],
  type: 'support' | 'resistance',
): AITrendline | null {
  if (pivots.length < 2) return null;

  // Use most recent pivots only
  const recent = pivots.slice(-12);
  const avgPrice = candles.reduce((s, c) => s + c.close, 0) / candles.length;

  let best: { line: AITrendline; touches: number } | null = null;

  for (let i = 0; i < recent.length - 1; i++) {
    for (let j = i + 1; j < recent.length; j++) {
      const a = recent[i];
      const b = recent[j];
      if (b.idx - a.idx < 5) continue; // pivots too close

      const { slope, intercept } = lineFromTwoPivots(a, b);

      // Direction sanity: support should be flat-to-rising, resistance flat-to-falling.
      // Allow gentle counter-slope (consolidation) but reject strong wrong-way.
      const slopePerBar = slope;
      const slopePct = (slopePerBar / avgPrice) * 100; // % per bar
      if (type === 'support' && slopePct < -0.5) continue;
      if (type === 'resistance' && slopePct > 0.5) continue;

      const score = scoreLine(pivots, candles, slope, intercept, type, a.idx, b.idx, avgPrice);
      if (!score.valid) continue;
      if (score.touches < 2) continue; // need at least the 2 anchors

      // Extend line forward up to ~10 bars beyond last candle for projection
      const startIdx = a.idx;
      const endIdx = Math.min(candles.length - 1, b.idx + 15);

      const candidate: AITrendline = {
        start: { time: candles[startIdx].time, price: slope * startIdx + intercept },
        end: { time: candles[endIdx].time, price: slope * endIdx + intercept },
      };

      if (!best || score.touches > best.touches) {
        best = { line: candidate, touches: score.touches };
      }
    }
  }

  return best?.line ?? null;
}

/**
 * Compute the most significant trendline (support OR resistance, whichever is stronger).
 */
export function computeTrendline(candles: Candle[]): AITrendline | null {
  if (candles.length < 30) return null;

  const { lows, highs } = findPivots(candles, 5);
  const support = findBestTrendline(lows, candles, 'support');
  const resistance = findBestTrendline(highs, candles, 'resistance');

  if (support && resistance) {
    // Prefer the one with steeper recent relevance — fall back to support
    return support;
  }
  return support || resistance;
}

/**
 * Compute both support and resistance trendlines using strict price-action rules.
 */
export function computeDualTrendlines(candles: Candle[]): {
  support: AITrendline | null;
  resistance: AITrendline | null;
} {
  if (candles.length < 30) return { support: null, resistance: null };
  const { lows, highs } = findPivots(candles, 5);
  return {
    support: findBestTrendline(lows, candles, 'support'),
    resistance: findBestTrendline(highs, candles, 'resistance'),
  };
}
