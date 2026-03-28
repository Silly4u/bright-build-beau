import type { Candle } from '@/hooks/useMarketData';

export interface LiquidityZone {
  price: number;
  type: 'high' | 'low';
  startIndex: number;
  endIndex: number;
}

export interface LiquidityGrab {
  index: number;
  type: 'buyside' | 'sellside';
  price: number;
}

export interface TradeEntry {
  entryIndex: number;
  entryPrice: number;
  type: 'Long' | 'Short';
  slTarget: number;
  tp1: number;
  tp2: number;
  tp3: number;
  exitIndex?: number;
  exitPrice?: number;
  result?: 'TP1' | 'TP2' | 'TP3' | 'SL';
  grabIndex: number;
  grabPrice: number;
}

export interface LiquidityResult {
  zones: LiquidityZone[];
  grabs: LiquidityGrab[];
  trades: TradeEntry[];
  stats: { total: number; tp: number; losses: number; winrate: number };
}

/**
 * Alpha Net Liquidity Hunter — faithful port of the Pine Script.
 *
 * Flow:
 * 1. Compute "higher timeframe" session highs/lows (using barLength window)
 * 2. Detect liquidity grabs (price breaking session high/low)
 * 3. Wait for MSS (Market Structure Shift) to confirm entry
 * 4. Calculate TP1/TP2/TP3 + SL
 * 5. Track trade outcome
 */
export function computeLiquidityZones(
  candles: Candle[],
  mssOffset: number = 10,
  htfMultiplier: number = 4,   // how many current bars = 1 HTF bar
  breakoutMethod: 'Wick' | 'Close' = 'Wick',
  tpPercent: number = 0.3,
  slPercent: number = 0.4,
): LiquidityResult {
  const len = candles.length;
  if (len < mssOffset * 2 + 1) return { zones: [], grabs: [], trades: [], stats: { total: 0, tp: 0, losses: 0, winrate: 0 } };

  const barLength = Math.max(htfMultiplier, 4);

  // Pre-compute rolling highest/lowest for HTF session and MSS
  const sessionHigh = new Float64Array(len);
  const sessionLow = new Float64Array(len);
  const mssHigh = new Float64Array(len);
  const mssLow = new Float64Array(len);

  for (let i = 0; i < len; i++) {
    let hh = -Infinity, ll = Infinity;
    for (let j = Math.max(0, i - barLength + 1); j <= i; j++) {
      if (candles[j].high > hh) hh = candles[j].high;
      if (candles[j].low < ll) ll = candles[j].low;
    }
    sessionHigh[i] = hh;
    sessionLow[i] = ll;

    let mh = -Infinity, ml = Infinity;
    for (let j = Math.max(0, i - mssOffset + 1); j <= i; j++) {
      if (candles[j].high > mh) mh = candles[j].high;
      if (candles[j].low < ml) ml = candles[j].low;
    }
    mssHigh[i] = mh;
    mssLow[i] = ml;
  }

  // ATR (5)
  const atrLen = 5;
  const atr = new Float64Array(len);
  for (let i = 0; i < len; i++) {
    if (i === 0) { atr[i] = candles[i].high - candles[i].low; continue; }
    let sum = 0, count = 0;
    for (let j = Math.max(0, i - atrLen + 1); j <= i; j++) {
      const tr = Math.max(
        candles[j].high - candles[j].low,
        Math.abs(candles[j].high - candles[j > 0 ? j - 1 : 0].close),
        Math.abs(candles[j].low - candles[j > 0 ? j - 1 : 0].close),
      );
      sum += tr;
      count++;
    }
    atr[i] = sum / count;
  }

  const zones: LiquidityZone[] = [];
  const grabs: LiquidityGrab[] = [];
  const trades: TradeEntry[] = [];

  // State machine per the Pine Script
  type State = 'waiting' | 'execution' | 'entry' | 'done';

  let state: State = 'waiting';
  let lastHourHigh = 0;
  let lastHourLow = 0;
  let grabIndex = -1;
  let grabPrice = 0;
  let entryType: 'Long' | 'Short' = 'Long';
  let grabSide: 'buyside' | 'sellside' = 'sellside';
  let entryIndex = -1;
  let entryPrice = 0;
  let slTarget = 0;
  let tp1 = 0, tp2 = 0, tp3 = 0;
  let hitTP1 = false, hitTP2 = false, hitTP3 = false;

  const slATRMult = 3.5; // "Low" risk setting as default
  const RR = 0.9;

  // Only process recent bars (last ~500 for performance)
  const startIdx = Math.max(barLength + mssOffset, len - 500);

  for (let i = startIdx; i < len; i++) {
    const c = candles[i];
    const brkVal = breakoutMethod === 'Close' ? c.close : undefined;

    if (state === 'waiting' || state === 'done') {
      // Reset for new trade search
      lastHourHigh = sessionHigh[i];
      lastHourLow = sessionLow[i];

      // Add zone visualization
      const zoneStart = Math.max(0, i - barLength + 1);
      zones.push({ price: lastHourHigh, type: 'high', startIndex: zoneStart, endIndex: i });
      zones.push({ price: lastHourLow, type: 'low', startIndex: zoneStart, endIndex: i });

      state = 'waiting';

      // Check for liquidity break on this bar
      const lowBreak = (brkVal !== undefined ? brkVal : c.low) < lastHourLow;
      const highBreak = (brkVal !== undefined ? brkVal : c.high) > lastHourHigh;

      if (lowBreak) {
        grabSide = 'sellside';
        grabIndex = i;
        grabPrice = lastHourLow;
        entryType = 'Long'; // Classic method
        state = 'execution';
        grabs.push({ index: i, type: 'sellside', price: c.low });
      } else if (highBreak) {
        grabSide = 'buyside';
        grabIndex = i;
        grabPrice = lastHourHigh;
        entryType = 'Short'; // Classic method
        state = 'execution';
        grabs.push({ index: i, type: 'buyside', price: c.high });
      }
    }

    if (state === 'execution' && i > grabIndex) {
      // Wait for MSS confirmation
      const prevMssHigh = mssHigh[i - 1];
      const prevMssLow = mssLow[i - 1];

      if (entryType === 'Short') {
        const breakBelow = (brkVal !== undefined ? brkVal : c.low) < prevMssLow;
        if (breakBelow) {
          entryPrice = brkVal !== undefined ? c.close : prevMssLow;
          entryIndex = i;
          // Dynamic TP/SL
          slTarget = mssHigh[i] + atr[i] * slATRMult;
          const tpTarget = entryPrice - (Math.abs(entryPrice - slTarget) * RR);
          tp1 = entryPrice + (tpTarget - entryPrice) * 0.33;
          tp2 = entryPrice + (tpTarget - entryPrice) * 0.66;
          tp3 = tpTarget;
          hitTP1 = false; hitTP2 = false; hitTP3 = false;
          state = 'entry';
        }
      } else {
        const breakAbove = (brkVal !== undefined ? brkVal : c.high) > prevMssHigh;
        if (breakAbove) {
          entryPrice = brkVal !== undefined ? c.close : prevMssHigh;
          entryIndex = i;
          slTarget = mssLow[i] - atr[i] * slATRMult;
          const tpTarget = entryPrice + (Math.abs(entryPrice - slTarget) * RR);
          tp1 = entryPrice + (tpTarget - entryPrice) * 0.33;
          tp2 = entryPrice + (tpTarget - entryPrice) * 0.66;
          tp3 = tpTarget;
          hitTP1 = false; hitTP2 = false; hitTP3 = false;
          state = 'entry';
        }
      }
    }

    if (state === 'entry' && i >= entryIndex) {
      // Check TP hits
      if (!hitTP1) {
        if ((entryType === 'Long' && c.high >= tp1) || (entryType === 'Short' && c.low <= tp1)) hitTP1 = true;
      }
      if (!hitTP2) {
        if ((entryType === 'Long' && c.high >= tp2) || (entryType === 'Short' && c.low <= tp2)) hitTP2 = true;
      }
      if (!hitTP3) {
        if ((entryType === 'Long' && c.high >= tp3) || (entryType === 'Short' && c.low <= tp3)) hitTP3 = true;
      }

      let result: TradeEntry['result'] | undefined;
      let exitPrice2 = 0;

      if (hitTP3) {
        result = 'TP3'; exitPrice2 = tp3;
      } else if (hitTP2 && ((entryType === 'Long' && c.low <= tp1) || (entryType === 'Short' && c.high >= tp1))) {
        result = 'TP2'; exitPrice2 = tp2;
      } else if (hitTP1 && ((entryType === 'Long' && c.low <= entryPrice) || (entryType === 'Short' && c.high >= entryPrice))) {
        result = 'TP1'; exitPrice2 = tp1;
      } else if (!hitTP1 && ((entryType === 'Long' && c.low <= slTarget) || (entryType === 'Short' && c.high >= slTarget))) {
        result = 'SL'; exitPrice2 = slTarget;
      }

      if (result) {
        trades.push({
          entryIndex, entryPrice, type: entryType,
          slTarget, tp1, tp2, tp3,
          exitIndex: i, exitPrice: exitPrice2, result,
          grabIndex, grabPrice,
        });
        state = 'done';
      }
    }
  }

  // If trade is still open, push it without exit
  if (state === 'entry') {
    trades.push({
      entryIndex, entryPrice, type: entryType,
      slTarget, tp1, tp2, tp3,
      grabIndex, grabPrice,
    });
  }

  // Keep only recent zones (avoid clutter)
  const recentZones = zones.slice(-40);

  // Stats
  const completedTrades = trades.filter(t => t.result);
  const tpCount = completedTrades.filter(t => t.result?.startsWith('TP')).length;
  const slCount = completedTrades.filter(t => t.result === 'SL').length;
  const total = tpCount + slCount;

  return {
    zones: recentZones,
    grabs,
    trades,
    stats: {
      total,
      tp: tpCount,
      losses: slCount,
      winrate: total > 0 ? (tpCount / total) * 100 : 0,
    },
  };
}
