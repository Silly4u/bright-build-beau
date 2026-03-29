import { useMemo } from 'react';
import type { Candle } from '@/hooks/useMarketData';

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════
export interface SwingPoint {
  index: number;
  time: number;
  price: number;
  type: 'high' | 'low';
}

/**
 * A drawn structure line (BOS or CHoCH).
 * Matches drawms_smc in Pine: x1, x2, y, txt, css, style
 */
export interface StructureBreak {
  x1Time: number;      // start time of horizontal line
  x2Time: number;      // end time of horizontal line
  price: number;       // y level
  label: string;       // 'BOS' | 'CHoCH' | 'x'
  direction: 'bull' | 'bear';
  /** line style: 'solid' | 'dashed' | 'dotted' */
  lineStyle: 'solid' | 'dashed' | 'dotted';
}

export interface OrderBlock {
  top: number;
  bottom: number;
  avg: number;
  startTime: number;   // loc (xloc.bar_time)
  bull: boolean;
  mitigated: boolean;
  mitigatedTime?: number;   // bbloc
  volume: number;
  /** buy/sell activity tracking */
  blPosTime: number;   // xlocbl
  brPosTime: number;   // xlocbr
}

export interface FairValueGap {
  top: number;
  bottom: number;
  time: number;
  index: number;
  bull: boolean;
  mitigated: boolean;
  mitigatedTime?: number;
}

export interface TrendZone {
  top: number;
  bottom: number;
  startTime: number;
  endTime: number;
  type: 'resistance' | 'support';
}

export interface EngineData {
  swings: SwingPoint[];
  structures: StructureBreak[];
  orderBlocks: OrderBlock[];
  fvgs: FairValueGap[];
  trendZones: TrendZone[];
  trend: number;
}

// ═══════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════
function computeATR(candles: Candle[], period: number, endIdx?: number): number {
  const end = endIdx ?? candles.length - 1;
  const start = Math.max(1, end - period + 1);
  if (start > end) return 0;
  let sum = 0, count = 0;
  for (let i = start; i <= end; i++) {
    const tr = Math.max(
      candles[i].high - candles[i].low,
      Math.abs(candles[i].high - candles[i - 1].close),
      Math.abs(candles[i].low - candles[i - 1].close),
    );
    sum += tr; count++;
  }
  return count > 0 ? sum / count : 0;
}

/** ATR(200) at bar i, cached for performance */
function buildATR200(candles: Candle[]): Float64Array {
  const out = new Float64Array(candles.length);
  for (let i = 0; i < candles.length; i++) {
    out[i] = computeATR(candles, 200, i);
  }
  return out;
}

// ═══════════════════════════════════════════════════════════════
// Pivot detection (ta.pivothigh / ta.pivotlow)
// ═══════════════════════════════════════════════════════════════
function detectPivots(candles: Candle[], strength: number): SwingPoint[] {
  const pivots: SwingPoint[] = [];
  for (let i = strength; i < candles.length - strength; i++) {
    let isHigh = true, isLow = true;
    for (let j = 1; j <= strength; j++) {
      if (candles[i].high <= candles[i - j].high || candles[i].high <= candles[i + j].high) isHigh = false;
      if (candles[i].low >= candles[i - j].low || candles[i].low >= candles[i + j].low) isLow = false;
      if (!isHigh && !isLow) break;
    }
    if (isHigh) pivots.push({ index: i, time: candles[i].time, price: candles[i].high, type: 'high' });
    if (isLow) pivots.push({ index: i, time: candles[i].time, price: candles[i].low, type: 'low' });
  }
  return pivots;
}

// ═══════════════════════════════════════════════════════════════
// find_smc: find highest/lowest bar between current bar and a
// reference index. Mirrors the Pine find_smc method.
// ═══════════════════════════════════════════════════════════════
function findExtreme(
  candles: Candle[],
  currentIdx: number,
  refIdx: number,
  useMax: boolean,
  useSweepRef: boolean,
  sweepRefIdx: number,
  useOB: boolean,
): number {
  const from = useSweepRef ? sweepRefIdx : refIdx;
  const rangeEnd = currentIdx;
  const rangeStart = Math.max(0, Math.min(from, rangeEnd));

  let bestIdx = rangeStart;
  if (useMax) {
    for (let k = rangeStart; k <= rangeEnd; k++) {
      if (candles[k].high > candles[bestIdx].high) bestIdx = k;
    }
    // useob: check if the previous bar is even higher
    if (useOB && bestIdx > 0 && candles[bestIdx - 1].high > candles[bestIdx].high) {
      bestIdx = bestIdx - 1;
    }
  } else {
    for (let k = rangeStart; k <= rangeEnd; k++) {
      if (candles[k].low < candles[bestIdx].low) bestIdx = k;
    }
    if (useOB && bestIdx > 0 && candles[bestIdx - 1].low < candles[bestIdx].low) {
      bestIdx = bestIdx - 1;
    }
  }
  return bestIdx;
}

// ═══════════════════════════════════════════════════════════════
// Market Structure Engine — faithful translation of structure_smc
// ═══════════════════════════════════════════════════════════════
const MS_LEN = 5;
const OB_LEN = 5;
const OB_MODE: 'Length' | 'Full' = 'Length';
const OB_MITI: 'Close' | 'Wick' | 'Avg' = 'Close';
const OB_LAST = 5;

interface OBInternal {
  bull: boolean;
  top: number;
  btm: number;
  avg: number;
  locTime: number;
  locIdx: number;
  volume: number;
  dir: number;    // 1 = bullish candle, -1 = bearish
  move: number;
  blPOS: number;
  brPOS: number;
  isbb: boolean;
  bblocTime: number;
}

function runStructureEngine(candles: Candle[], pivots: SwingPoint[]): {
  structures: StructureBreak[];
  orderBlocks: OrderBlock[];
  trend: number;
} {
  if (candles.length < 30) return { structures: [], orderBlocks: [], trend: 0 };

  const atr200 = buildATR200(candles);
  const atrSmc = (idx: number) => atr200[idx] / (5 / OB_LEN);

  // Pivot tracking for Adjusted Points
  const pivotHighAt = new Map<number, number>();
  const pivotLowAt = new Map<number, number>();
  for (const p of pivots) {
    if (p.type === 'high') pivotHighAt.set(p.index, p.price);
    else pivotLowAt.set(p.index, p.price);
  }

  // Recent pivot high/low arrays (like php_smc / plp_smc)
  let recentPH: { idx: number; price: number } | null = null;
  let recentPL: { idx: number; price: number } | null = null;

  // Structure state (structure_smc type)
  let trend = 0;
  let bosLevel: number | null = null;
  let chochLevel: number | null = null;
  let loc = 0;     // location of structure point
  let temp = 0;    // temp tracking
  let start = 0;   // 0=init, 1=first, 2=running
  let main = 0;    // current swing extreme
  let xloc = 0;    // sweep ref location

  // Drawing arrays (like bldw_smc / brdw_smc)
  const bullLines: StructureBreak[] = [];
  const bearLines: StructureBreak[] = [];

  // Order block arrays
  const bullOBs: OBInternal[] = [];
  const bearOBs: OBInternal[] = [];

  // crossup / crossdn detection
  let up = candles[0].high;
  let dn = candles[0].low;

  const createOB = (bull: boolean, idx: number) => {
    const c = candles[idx];
    const a = atrSmc(idx);
    let top: number, btm: number;

    if (bull) {
      // Bull OB: top = min(low + atr, high), btm = low
      top = OB_MODE === 'Length'
        ? (c.low + a > c.high ? c.high : c.low + a)
        : c.high;
      btm = c.low;
      bullOBs.unshift({
        bull: true, top, btm, avg: (top + btm) / 2,
        locTime: c.time, locIdx: idx,
        volume: c.volume,
        dir: c.close > c.open ? 1 : -1,
        move: 1, blPOS: 1, brPOS: 1,
        isbb: false, bblocTime: 0,
      });
    } else {
      // Bear OB: top = high, btm = max(high - atr, low)
      top = c.high;
      btm = OB_MODE === 'Length'
        ? (c.high - a < c.low ? c.low : c.high - a)
        : c.low;
      bearOBs.unshift({
        bull: false, top, btm, avg: (top + btm) / 2,
        locTime: c.time, locIdx: idx,
        volume: c.volume,
        dir: c.close > c.open ? 1 : -1,
        move: 1, blPOS: 1, brPOS: 1,
        isbb: false, bblocTime: 0,
      });
    }
  };

  const pushBullLine = (x1T: number, x2T: number, price: number, label: string, style: 'solid' | 'dashed' | 'dotted') => {
    bullLines.push({ x1Time: x1T, x2Time: x2T, price, label, direction: 'bull', lineStyle: style });
  };
  const pushBearLine = (x1T: number, x2T: number, price: number, label: string, style: 'solid' | 'dashed' | 'dotted') => {
    bearLines.push({ x1Time: x1T, x2Time: x2T, price, label, direction: 'bear', lineStyle: style });
  };

  const updateLastBull = (x2T: number, price?: number, label?: string, style?: 'solid' | 'dashed' | 'dotted') => {
    if (bullLines.length === 0) return;
    const last = bullLines[bullLines.length - 1];
    last.x2Time = x2T;
    if (price !== undefined) last.price = price;
    if (label !== undefined) last.label = label;
    if (style !== undefined) last.lineStyle = style;
  };
  const updateLastBear = (x2T: number, price?: number, label?: string, style?: 'solid' | 'dashed' | 'dotted') => {
    if (bearLines.length === 0) return;
    const last = bearLines[bearLines.length - 1];
    last.x2Time = x2T;
    if (price !== undefined) last.price = price;
    if (label !== undefined) last.label = label;
    if (style !== undefined) last.lineStyle = style;
  };

  for (let i = 1; i < candles.length; i++) {
    const c = candles[i];
    const prev = candles[i - 1];
    let crossup = false;
    let crossdn = false;

    if (c.high > up) { up = c.high; dn = c.low; crossup = true; }
    if (c.low < dn) { up = c.high; dn = c.low; crossdn = true; }

    // Update pivot tracking
    if (pivotHighAt.has(i)) {
      const p = pivotHighAt.get(i)!;
      if (!recentPH || p > recentPH.price) recentPH = { idx: i, price: p };
    }
    if (pivotLowAt.has(i)) {
      const p = pivotLowAt.get(i)!;
      if (!recentPL || p < recentPL.price) recentPL = { idx: i, price: p };
    }
    if (recentPH && c.high > recentPH.price) recentPH = null;
    if (recentPL && c.low < recentPL.price) recentPL = null;

    // OB find helpers: find extreme between xloc and current bar
    const idbull = findExtreme(candles, i, loc, false, false, xloc, true);
    const idbear = findExtreme(candles, i, loc, true, false, xloc, true);

    // ── Stage 0: Init ──
    if (start === 0) {
      start = 1;
      chochLevel = c.high;   // bos field in Pine init
      bosLevel = c.low;       // choch field in Pine init
      loc = i;
      temp = i;
      main = c.high; // Actually not used meaningfully in stage 1
      xloc = i;
      pushBullLine(c.time, c.time, c.high, 'CHoCH', 'dashed');
      pushBearLine(c.time, c.time, c.low, 'CHoCH', 'dashed');
      continue;
    }

    // ── Stage 1: First — waiting for initial CHoCH ──
    if (start === 1) {
      // Sweep checks first (like Pine switch order)
      // Bearish sweep on choch (low)
      if (c.low <= bosLevel! && c.close >= bosLevel!) {
        // Sweep on bear side
        updateLastBear(c.time, undefined, 'x', 'dotted');
        bosLevel = c.low;
        xloc = i;
        pushBearLine(c.time, c.time, c.low, 'CHoCH', 'dashed');
      }
      // Bullish sweep on bos (high)
      else if (c.high >= chochLevel! && c.close <= chochLevel!) {
        updateLastBull(c.time, undefined, 'x', 'dotted');
        chochLevel = c.high;
        xloc = i;
        pushBullLine(c.time, c.time, c.high, 'CHoCH', 'dashed');
      }
      // Bearish CHoCH confirm
      else if (bosLevel !== null && c.close <= bosLevel) {
        trend = -1;
        createOB(true, idbull);
        updateLastBear(c.time, undefined, undefined, 'solid');
        chochLevel = chochLevel; // stays
        bosLevel = null;
        start = 2;
        loc = i;
        main = c.low;
        temp = i;
        xloc = i;
      }
      // Bullish CHoCH confirm
      else if (chochLevel !== null && c.close >= chochLevel) {
        trend = 1;
        createOB(false, idbear);
        updateLastBull(c.time, undefined, undefined, 'solid');
        bosLevel = bosLevel; // stays (becomes choch in new trend)
        chochLevel = null;
        start = 2;
        loc = i;
        main = c.high;
        temp = i;
        xloc = i;
      }
      continue;
    }

    // ── Stage 2: Running ──
    if (trend === -1) {
      // Bear trend
      if (c.low <= main) { main = c.low; temp = i; }

      // Adjusted Points: update CHoCH with better pivot
      if (i % (MS_LEN * 2) === 0 && bosLevel !== null && recentPH && recentPH.price < (chochLevel ?? Infinity)) {
        chochLevel = recentPH.price;
        loc = recentPH.idx;
        xloc = recentPH.idx;
        temp = recentPH.idx;
        updateLastBull(c.time, recentPH.price);
        if (bullLines.length > 0) {
          bullLines[bullLines.length - 1].x1Time = candles[recentPH.idx].time;
        }
      }

      // Create BOS level on momentum
      if (bosLevel === null) {
        if (crossup && c.close > c.open && prev.close > prev.open) {
          bosLevel = main;
          loc = temp;
          xloc = loc;
          pushBearLine(candles[temp].time, c.time, candles[temp].low, 'BOS', 'dashed');
        }
      }

      // Extend lines
      if (bosLevel !== null) updateLastBear(c.time);
      if (bullLines.length > 0) updateLastBull(c.time);

      // Check BOS sweep
      if (bosLevel !== null && c.low <= bosLevel && c.close >= bosLevel) {
        updateLastBear(c.time, undefined, 'x', 'dotted');
        bosLevel = c.low;
        xloc = i;
        pushBearLine(c.time, c.time, c.low, 'BOS', 'dashed');
      }
      // Check BOS confirm
      else if (bosLevel !== null && c.close <= bosLevel) {
        createOB(false, idbear);
        const hIdx = findExtreme(candles, i, loc, true, false, xloc, false);
        updateLastBear(c.time, undefined, undefined, 'solid');
        xloc = i;
        bosLevel = null;
        chochLevel = candles[hIdx].high;
        loc = hIdx;
        // Update bull CHoCH line
        if (bullLines.length > 0) {
          const last = bullLines[bullLines.length - 1];
          last.x1Time = candles[hIdx].time;
          last.x2Time = c.time;
          last.price = candles[hIdx].high;
        }
      }

      // Check CHoCH sweep
      if (chochLevel !== null && c.high >= chochLevel && c.close <= chochLevel) {
        updateLastBull(c.time, undefined, 'x', 'dotted');
        chochLevel = c.high;
        xloc = i;
        pushBullLine(c.time, c.time, c.high, 'CHoCH', 'dashed');
      }
      // Check CHoCH confirm (trend change to bull)
      else if (chochLevel !== null && c.close >= chochLevel) {
        createOB(true, idbull);
        const lIdx = findExtreme(candles, i, loc, false, false, xloc, false);

        // Set new CHoCH for bear side
        if (bosLevel === null) {
          chochLevel = candles[lIdx].low;
          pushBearLine(c.time, c.time, candles[lIdx].low, 'BOS', 'dashed');
          if (bearLines.length > 0) {
            bearLines[bearLines.length - 1].x1Time = candles[temp].time;
          }
        } else {
          chochLevel = bosLevel;
        }

        bosLevel = null;
        main = c.high;
        trend = 1;
        loc = i;
        xloc = i;
        temp = i;

        updateLastBull(c.time, undefined, 'CHoCH', 'solid');
        if (bearLines.length > 0) {
          const last = bearLines[bearLines.length - 1];
          last.x2Time = c.time;
          last.price = chochLevel!;
          last.label = 'CHoCH';
        }
      }
    } else {
      // Bull trend
      if (c.high >= main) { main = c.high; temp = i; }

      // Create BOS level on momentum
      if (bosLevel === null) {
        if (crossdn && c.close < c.open && prev.close < prev.open) {
          bosLevel = main;
          loc = temp;
          xloc = loc;
          pushBullLine(candles[temp].time, c.time, candles[temp].high, 'BOS', 'dashed');
        }
      }

      // Adjusted Points: update CHoCH with better pivot
      if (i % (MS_LEN * 2) === 0 && bosLevel !== null && recentPL && recentPL.price > (chochLevel ?? -Infinity)) {
        chochLevel = recentPL.price;
        loc = recentPL.idx;
        xloc = recentPL.idx;
        temp = recentPL.idx;
        updateLastBear(c.time, recentPL.price);
        if (bearLines.length > 0) {
          bearLines[bearLines.length - 1].x1Time = candles[recentPL.idx].time;
        }
      }

      // Extend lines
      if (bosLevel !== null) updateLastBull(c.time);
      if (bearLines.length > 0) updateLastBear(c.time);

      // Check BOS sweep
      if (bosLevel !== null && c.high >= bosLevel && c.close <= bosLevel) {
        updateLastBull(c.time, undefined, 'x', 'dotted');
        bosLevel = c.high;
        xloc = i;
        pushBullLine(c.time, c.time, c.high, 'BOS', 'dashed');
      }
      // Check BOS confirm
      else if (bosLevel !== null && c.close >= bosLevel) {
        createOB(true, idbull);
        const lIdx = findExtreme(candles, i, loc, false, false, xloc, false);
        updateLastBull(c.time, undefined, undefined, 'solid');
        xloc = i;
        bosLevel = null;
        chochLevel = candles[lIdx].low;
        loc = lIdx;
        if (bearLines.length > 0) {
          const last = bearLines[bearLines.length - 1];
          last.x1Time = candles[lIdx].time;
          last.x2Time = c.time;
          last.price = candles[lIdx].low;
        }
      }

      // Check CHoCH sweep
      if (chochLevel !== null && c.low <= chochLevel && c.close >= chochLevel) {
        updateLastBear(c.time, undefined, 'x', 'dotted');
        chochLevel = c.low;
        xloc = i;
        pushBearLine(c.time, c.time, c.low, 'CHoCH', 'dashed');
      }
      // Check CHoCH confirm (trend change to bear)
      else if (chochLevel !== null && c.close <= chochLevel) {
        createOB(false, idbear);
        const hIdx = findExtreme(candles, i, loc, true, false, xloc, false);

        if (bosLevel === null) {
          chochLevel = candles[hIdx].high;
          pushBullLine(c.time, c.time, candles[hIdx].high, 'BOS', 'dashed');
          if (bullLines.length > 0) {
            bullLines[bullLines.length - 1].x1Time = candles[temp].time;
          }
        } else {
          chochLevel = bosLevel;
        }

        bosLevel = null;
        main = c.low;
        trend = -1;
        loc = i;
        temp = i;
        xloc = i;

        updateLastBear(c.time, undefined, 'CHoCH', 'solid');
        if (bullLines.length > 0) {
          const last = bullLines[bullLines.length - 1];
          last.x2Time = c.time;
          last.price = chochLevel!;
          last.label = 'CHoCH';
        }
      }
    }

    // ── OB Mitigation ──
    const mitigateOBs = (obs: OBInternal[]) => {
      for (let j = obs.length - 1; j >= 0; j--) {
        const ob = obs[j];
        if (!ob.isbb) {
          if (ob.bull) {
            const hit = OB_MITI === 'Close' ? Math.min(c.close, c.open) < ob.btm
              : OB_MITI === 'Wick' ? c.low < ob.btm
              : c.low < ob.avg;
            if (hit) { ob.isbb = true; ob.bblocTime = c.time; }
          } else {
            const hit = OB_MITI === 'Close' ? Math.max(c.close, c.open) > ob.top
              : OB_MITI === 'Wick' ? c.high > ob.top
              : c.high > ob.avg;
            if (hit) { ob.isbb = true; ob.bblocTime = c.time; }
          }
        } else {
          // Breaker mitigation
          if (ob.bull) {
            if (OB_MITI === 'Close' ? Math.max(c.close, c.open) > ob.top : c.high > ob.top) {
              obs.splice(j, 1);
            }
          } else {
            if (OB_MITI === 'Close' ? Math.min(c.close, c.open) < ob.btm : c.low < ob.btm) {
              obs.splice(j, 1);
            }
          }
        }
      }
    };
    mitigateOBs(bullOBs);
    mitigateOBs(bearOBs);

    // ── OB volume metrics tracking ──
    const updateMetric = (ob: OBInternal) => {
      if (ob.dir === 1) {
        if (ob.move === 1) { ob.blPOS++; ob.move = 2; }
        else if (ob.move === 2) { ob.blPOS++; ob.move = 3; }
        else { ob.brPOS++; ob.move = 1; }
      } else {
        if (ob.move === 1) { ob.brPOS++; ob.move = 2; }
        else if (ob.move === 2) { ob.brPOS++; ob.move = 3; }
        else { ob.blPOS++; ob.move = 1; }
      }
    };
    for (const ob of bullOBs) updateMetric(ob);
    for (const ob of bearOBs) updateMetric(ob);
  }

  // ── Remove overlap ──
  const removeOverlap = (a: OBInternal[], b: OBInternal[]) => {
    const overlaps = (s: OBInternal, cur: OBInternal) =>
      (s.btm > cur.btm && s.btm < cur.top) ||
      (s.top < cur.top && s.btm > cur.btm) ||
      (s.top > cur.top && s.btm < cur.btm) ||
      (s.top < cur.top && s.top > cur.btm);

    if (a.length > 1) {
      for (let j = a.length - 1; j >= 1; j--) {
        if (overlaps(a[j], a[0])) a.splice(j, 1);
      }
    }
    if (b.length > 1) {
      for (let j = b.length - 1; j >= 1; j--) {
        if (overlaps(b[j], b[0])) b.splice(j, 1);
      }
    }
    if (a.length > 0 && b.length > 0) {
      for (let j = a.length - 1; j >= 0; j--) {
        if (overlaps(a[j], b[0])) a.splice(j, 1);
      }
    }
    if (a.length > 0 && b.length > 0) {
      for (let j = b.length - 1; j >= 0; j--) {
        if (overlaps(b[j], a[0])) b.splice(j, 1);
      }
    }
  };
  removeOverlap(bullOBs, bearOBs);

  // ── Build output ──
  const lastTime = candles[candles.length - 1].time;
  const barDuration = candles.length > 1 ? candles[1].time - candles[0].time : 60000;

  const allOBs: OrderBlock[] = [...bullOBs, ...bearOBs]
    .slice(0, OB_LAST)
    .map(ob => ({
      top: ob.top,
      bottom: ob.btm,
      avg: ob.avg,
      startTime: ob.locTime,
      bull: ob.bull,
      mitigated: ob.isbb,
      mitigatedTime: ob.isbb ? ob.bblocTime : undefined,
      volume: ob.volume,
      blPosTime: ob.locTime + barDuration * ob.blPOS,
      brPosTime: ob.locTime + barDuration * ob.brPOS,
    }));

  // Merge bull + bear lines, keep last N
  const allStructures = [...bullLines, ...bearLines]
    .sort((a, b) => a.x1Time - b.x1Time);

  return {
    structures: allStructures,
    orderBlocks: allOBs,
    trend,
  };
}

// ═══════════════════════════════════════════════════════════════
// FVG Detection (matches Pine dFVG_smc)
// ═══════════════════════════════════════════════════════════════
function detectFVGs(candles: Candle[]): FairValueGap[] {
  const fvgs: FairValueGap[] = [];
  for (let i = 2; i < candles.length; i++) {
    const prev2 = candles[i - 2];
    const mid = candles[i - 1];
    const curr = candles[i];

    // Bullish FVG: curr.low > prev2.high AND mid candle confirmation
    if (curr.low > prev2.high && mid.close > mid.open) {
      fvgs.push({
        top: curr.low, bottom: prev2.high,
        time: candles[i - 2].time, // Pine uses time[3] relative = 3 bars back from detection
        index: i - 1, bull: true, mitigated: false,
      });
    }
    // Bearish FVG
    if (prev2.low > curr.high && mid.close < mid.open) {
      fvgs.push({
        top: prev2.low, bottom: curr.high,
        time: candles[i - 2].time,
        index: i - 1, bull: false, mitigated: false,
      });
    }
  }

  // Mitigation
  for (const fvg of fvgs) {
    for (let i = fvg.index + 2; i < candles.length; i++) {
      const c = candles[i];
      if (fvg.bull && Math.min(c.close, c.open) < fvg.bottom) {
        fvg.mitigated = true;
        fvg.mitigatedTime = c.time;
        break;
      }
      if (!fvg.bull && Math.max(c.close, c.open) > fvg.top) {
        fvg.mitigated = true;
        fvg.mitigatedTime = c.time;
        break;
      }
    }
  }

  // Remove overlapping FVGs
  const bullFvgs = fvgs.filter(f => f.bull && !f.mitigated);
  const bearFvgs = fvgs.filter(f => !f.bull && !f.mitigated);

  return [...bullFvgs.slice(-5), ...bearFvgs.slice(-5)];
}

// ═══════════════════════════════════════════════════════════════
// Trendline Zones
// ═══════════════════════════════════════════════════════════════
function detectTrendZones(candles: Candle[], pivots: SwingPoint[]): TrendZone[] {
  const zones: TrendZone[] = [];
  if (candles.length < 20 || pivots.length < 3) return zones;

  const atr = computeATR(candles, 14);
  const threshold = atr * 0.5;
  const lastTime = candles[candles.length - 1].time;

  const highs = pivots.filter(p => p.type === 'high').slice(-30);
  const lows = pivots.filter(p => p.type === 'low').slice(-30);

  const findZone = (points: SwingPoint[], type: 'resistance' | 'support') => {
    if (points.length < 2) return;
    const used = new Set<number>();
    for (let i = 0; i < points.length; i++) {
      if (used.has(i)) continue;
      let touches = 1, maxP = points[i].price, minP = points[i].price, earliest = points[i].time;
      for (let j = i + 1; j < points.length; j++) {
        if (used.has(j)) continue;
        if (Math.abs(points[j].price - points[i].price) <= threshold) {
          touches++; maxP = Math.max(maxP, points[j].price);
          minP = Math.min(minP, points[j].price);
          earliest = Math.min(earliest, points[j].time);
          used.add(j);
        }
      }
      if (touches >= 3) {
        zones.push({ top: maxP + threshold * 0.2, bottom: minP - threshold * 0.2, startTime: earliest, endTime: lastTime, type });
      }
      used.add(i);
    }
  };

  findZone(highs, 'resistance');
  findZone(lows, 'support');

  const currentPrice = candles[candles.length - 1].close;
  return zones
    .sort((a, b) => {
      const distA = Math.min(Math.abs(a.top - currentPrice), Math.abs(a.bottom - currentPrice));
      const distB = Math.min(Math.abs(b.top - currentPrice), Math.abs(b.bottom - currentPrice));
      return distA - distB;
    })
    .slice(0, 4);
}

// ═══════════════════════════════════════════════════════════════
// Main Hook
// ═══════════════════════════════════════════════════════════════
export function useEngineIndicator(candles: Candle[], enabled: boolean): EngineData | null {
  return useMemo(() => {
    if (!enabled || candles.length < 30) return null;

    const pivotStrength = MS_LEN;
    const swings = detectPivots(candles, pivotStrength);
    const { structures, orderBlocks, trend } = runStructureEngine(candles, swings);
    const fvgs = detectFVGs(candles);
    const trendZones = detectTrendZones(candles, swings);

    return { swings, structures, orderBlocks, fvgs, trendZones, trend };
  }, [candles, enabled]);
}
