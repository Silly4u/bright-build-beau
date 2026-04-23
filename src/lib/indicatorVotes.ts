// Compute bullish/bearish vote (-1, 0, +1) for each enabled indicator,
// then aggregate into a strength score in [-100, +100].

export interface IndicatorVote {
  id: string;
  label: string;
  vote: -1 | 0 | 1;
  reason: string;
}

export interface VotesContext {
  enabledIds: string[];
  proEmaData?: any;
  srData?: any;
  wyckoffData?: any;
  alphaLHData?: any;
  alphaEventData?: any;
  matrixData?: any;
  engineData?: any;
  tpSlData?: any;
  smcAnalysis?: any;
  livePrice: number;
}

const LABELS: Record<string, string> = {
  matrix: 'Matrix NWE',
  engine: 'MS Engine',
  tp_sl: 'TP/SL Zones',
  pro_ema: 'Pro EMA',
  support_resistance: 'Pro S/R',
  wyckoff: 'Wyckoff',
  alpha_lh: 'Alpha LH',
  alpha_event: 'Alpha Event',
  prev_week_fib: 'Fib Tuần Cũ',
  liq_hunter: 'SMC AI',
};

export function computeIndicatorVotes(ctx: VotesContext): IndicatorVote[] {
  const votes: IndicatorVote[] = [];

  for (const id of ctx.enabledIds) {
    const label = LABELS[id] || id;
    let vote: -1 | 0 | 1 = 0;
    let reason = 'Trung tính';

    switch (id) {
      case 'pro_ema': {
        const d = ctx.proEmaData;
        if (d) {
          if (d.ribbon === 'bullish') { vote = 1; reason = 'Ribbon EMA bullish (20>50>100>200)'; }
          else if (d.ribbon === 'bearish') { vote = -1; reason = 'Ribbon EMA bearish'; }
          else { reason = 'EMA đan xen - sideway'; }
        }
        break;
      }
      case 'support_resistance': {
        const d = ctx.srData;
        if (d) {
          if (d.lastK < 30 && d.lastD < 30) { vote = 1; reason = `Stoch oversold (K=${d.lastK.toFixed(0)})`; }
          else if (d.lastK > 70 && d.lastD > 70) { vote = -1; reason = `Stoch overbought (K=${d.lastK.toFixed(0)})`; }
          else { reason = `Stoch trung tính (K=${d.lastK.toFixed(0)})`; }
        }
        break;
      }
      case 'wyckoff': {
        const d = ctx.wyckoffData;
        if (d) {
          if (d.currentPhase === 'accumulation' || d.currentPhase === 'bullish') { vote = 1; reason = `Pha ${d.currentPhase}`; }
          else if (d.currentPhase === 'distribution' || d.currentPhase === 'bearish') { vote = -1; reason = `Pha ${d.currentPhase}`; }
          else { reason = `Pha ${d.currentPhase || 'unknown'}`; }
        }
        break;
      }
      case 'alpha_lh': {
        const d = ctx.alphaLHData;
        if (d?.stats) {
          // Use winrate as bias indicator
          if (d.stats.winrate >= 60 && d.stats.tp1Count > d.stats.losses) { vote = 1; reason = `Winrate ${d.stats.winrate.toFixed(0)}%`; }
          else if (d.stats.winrate < 40) { vote = -1; reason = `Winrate yếu ${d.stats.winrate.toFixed(0)}%`; }
          else { reason = `Winrate ${d.stats.winrate.toFixed(0)}% trung bình`; }
        }
        break;
      }
      case 'alpha_event': {
        const d = ctx.alphaEventData;
        if (d?.markers && d.markers.length > 0) {
          const recent = d.markers.slice(-5);
          const buys = recent.filter((m: any) => m.shape === 'arrowUp').length;
          const sells = recent.filter((m: any) => m.shape === 'arrowDown').length;
          if (buys > sells) { vote = 1; reason = `${buys} buy / ${sells} sell gần đây`; }
          else if (sells > buys) { vote = -1; reason = `${sells} sell / ${buys} buy gần đây`; }
          else { reason = 'Cân bằng buy/sell'; }
        }
        break;
      }
      case 'engine': {
        const d = ctx.engineData;
        if (d?.lastSignal) {
          if (d.lastSignal === 'long' || d.lastSignal === 'buy') { vote = 1; reason = 'MS bullish structure'; }
          else if (d.lastSignal === 'short' || d.lastSignal === 'sell') { vote = -1; reason = 'MS bearish structure'; }
        }
        break;
      }
      case 'matrix': {
        const d = ctx.matrixData;
        if (d?.lastSignal === 'buy') { vote = 1; reason = 'NWE buy zone'; }
        else if (d?.lastSignal === 'sell') { vote = -1; reason = 'NWE sell zone'; }
        break;
      }
      case 'tp_sl': {
        const d = ctx.tpSlData;
        if (d?.stats) {
          if (d.stats.winrate >= 55) { vote = 1; reason = `Winrate ${d.stats.winrate.toFixed(0)}%`; }
          else if (d.stats.winrate < 40) { vote = -1; reason = `Winrate yếu`; }
        }
        break;
      }
      case 'liq_hunter': {
        const d = ctx.smcAnalysis;
        if (d?.trade_signal?.has_signal) {
          if (d.trade_signal.type === 'Long') { vote = 1; reason = 'AI SMC: Long signal'; }
          else if (d.trade_signal.type === 'Short') { vote = -1; reason = 'AI SMC: Short signal'; }
        }
        break;
      }
      default:
        break;
    }

    votes.push({ id, label, vote, reason });
  }

  return votes;
}

export function aggregateStrength(votes: IndicatorVote[]): number {
  if (votes.length === 0) return 0;
  const sum = votes.reduce((acc, v) => acc + v.vote, 0);
  return Math.round((sum / votes.length) * 100);
}

export function strengthLabel(score: number): { text: string; tone: 'bull' | 'bear' | 'neutral' } {
  if (score >= 60) return { text: 'STRONG BUY', tone: 'bull' };
  if (score >= 25) return { text: 'BUY', tone: 'bull' };
  if (score > -25) return { text: 'NEUTRAL', tone: 'neutral' };
  if (score > -60) return { text: 'SELL', tone: 'bear' };
  return { text: 'STRONG SELL', tone: 'bear' };
}
