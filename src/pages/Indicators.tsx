import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useIndicatorPermissions } from '@/hooks/useIndicatorPermissions';
import Footer from '@/components/Footer';
import TradingChart from '@/components/indicators/TradingChart';

import IndicatorPanel, { IndicatorConfig } from '@/components/indicators/IndicatorPanel';
import SignalFeed from '@/components/indicators/SignalFeed';
import { useMarketData, useSignals } from '@/hooks/useMarketData';
import { useSmcAnalysis } from '@/hooks/useSmcAnalysis';
import { useMatrixIndicator } from '@/hooks/useMatrixIndicator';
import { useEngineIndicator } from '@/hooks/useEngineIndicator';
import { useTpSlIndicator } from '@/hooks/useTpSlIndicator';

import { useProEma } from '@/hooks/useProEma';
import { useSupportResistance } from '@/hooks/useSupportResistance';
import { useWyckoff } from '@/hooks/useWyckoff';
import { computeDualTrendlines } from '@/lib/computeTrendline';
import { useAlphaLH, defaultAlphaLHConfig } from '@/hooks/useAlphaLH';
import AlphaLHConfigPanel from '@/components/indicators/AlphaLHConfig';
import { useAlphaEventSignal, defaultAlphaEventConfig } from '@/hooks/useAlphaEventSignal';
import AlphaEventConfigPanel from '@/components/indicators/AlphaEventConfig';

import IndicatorStrengthMeter from '@/components/indicators/IndicatorStrengthMeter';
import AIConfluenceCard from '@/components/indicators/AIConfluenceCard';
import LayoutPresets from '@/components/indicators/LayoutPresets';
import ShareSnapshot from '@/components/indicators/ShareSnapshot';
import TriggerAlertsPanel from '@/components/indicators/TriggerAlertsPanel';
import PinnedMiniCharts from '@/components/indicators/PinnedMiniCharts';
import TimeframeSelector from '@/components/indicators/TimeframeSelector';
import MultiChartGrid from '@/components/indicators/MultiChartGrid';
import { computeIndicatorVotes, aggregateStrength } from '@/lib/indicatorVotes';
import { useIndicatorTriggers, type TriggerType } from '@/hooks/useIndicatorTriggers';

const PAIRS = [
  { symbol: 'BTC/USDT', label: 'BTC', color: '#F7931A' },
  { symbol: 'ETH/USDT', label: 'ETH', color: '#627EEA' },
  { symbol: 'XAU/USDT', label: 'XAU', color: '#FFD700' },
  { symbol: 'SOL/USDT', label: 'SOL', color: '#9945FF' },
  { symbol: 'XRP/USDT', label: 'XRP', color: '#23292F' },
  { symbol: 'BNB/USDT', label: 'BNB', color: '#F3BA2F' },
  { symbol: 'DOGE/USDT', label: 'DOGE', color: '#C2A633' },
  { symbol: 'WLD/USDT', label: 'WLD', color: '#1DB4D5' },
  { symbol: 'HYPE/USDT', label: 'HYPE', color: '#A855F7' },
  { symbol: 'PEPE/USDT', label: 'PEPE', color: '#4CAF50' },
];

const TIMEFRAMES = ['M15', 'H1', 'H4', 'D1'];

const DEFAULT_INDICATORS: IndicatorConfig[] = [
  { id: 'matrix', label: 'Matrix NWE', enabled: false, color: '#00BCD4', category: 'Envelope' },
  { id: 'engine', label: 'MS Engine', enabled: false, color: '#FF9800', category: 'Structure' },
  { id: 'tp_sl', label: 'TP/SL Zones', enabled: false, color: '#E91E63', category: 'Risk' },
  { id: 'pro_ema', label: 'Pro EMA', enabled: false, color: '#FFA726', category: 'Trend' },
  { id: 'support_resistance', label: 'Pro S/R', enabled: false, color: '#00E676', category: 'S/R' },
  { id: 'wyckoff', label: 'Wyckoff', enabled: false, color: '#B388FF', category: 'Structure' },
  { id: 'alpha_lh', label: 'Alpha LH', enabled: false, color: '#F59E0B', category: 'Liquidity', note: 'Hoạt động tốt ở khung M15 trở xuống.' },
  { id: 'alpha_event', label: 'Alpha Event', enabled: false, color: '#E879F9', category: 'Signal' },
  { id: 'prev_week_fib', label: 'Fib Tuần Cũ', enabled: false, color: '#FFD54F', category: 'Fibonacci', note: 'Tự vẽ Fibonacci theo High/Low của tuần trước, cập nhật mỗi tuần.' },
];

const Indicators: React.FC = () => {
  const { user } = useAuth();
  const { hasAccess, loading: permLoading } = useIndicatorPermissions();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Initialise state from URL share-link if present ──
  const initialPair = searchParams.get('pair') && PAIRS.find(p => p.symbol === searchParams.get('pair'))
    ? (searchParams.get('pair') as string)
    : 'BTC/USDT';
  const initialTf = searchParams.get('tf') && TIMEFRAMES.includes(searchParams.get('tf') as string)
    ? (searchParams.get('tf') as string)
    : 'H4';
  const initialIndIds = (searchParams.get('ind') || '').split(',').filter(Boolean);

  const [activeView, setActiveView] = useState<'single' | 'multi'>('single');
  const [activePair, setActivePair] = useState(initialPair);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTimeframe, setActiveTimeframe] = useState(initialTf);
  const [indicators, setIndicators] = useState<IndicatorConfig[]>(
    DEFAULT_INDICATORS.map(i => ({ ...i, enabled: initialIndIds.includes(i.id) || i.enabled })),
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [watchedTriggers, setWatchedTriggers] = useState<TriggerType[]>([]);

  const marketData = useMarketData(activePair, activeTimeframe);
  const { fetchOlderCandles } = marketData;
  const { signals, loading: signalsLoading } = useSignals();
  const liqHunterEnabled = indicators.find(i => i.id === 'liq_hunter')?.enabled ?? false;
  const smcResult = useSmcAnalysis(marketData.candles, activePair, activeTimeframe, liqHunterEnabled && !marketData.loading);
  const matrixEnabled = indicators.find(i => i.id === 'matrix')?.enabled ?? false;
  const matrixData = useMatrixIndicator(marketData.candles, matrixEnabled && !marketData.loading);
  const engineEnabled = indicators.find(i => i.id === 'engine')?.enabled ?? false;
  const engineData = useEngineIndicator(marketData.candles, engineEnabled && !marketData.loading);
  const tpSlEnabled = indicators.find(i => i.id === 'tp_sl')?.enabled ?? false;
  const tpSlData = useTpSlIndicator(marketData.candles, tpSlEnabled && !marketData.loading);
  const proEmaEnabled = indicators.find(i => i.id === 'pro_ema')?.enabled ?? false;
  const proEmaData = useProEma(marketData.candles, proEmaEnabled && !marketData.loading);
  const srEnabled = indicators.find(i => i.id === 'support_resistance')?.enabled ?? false;
  const srData = useSupportResistance(marketData.candles, srEnabled && !marketData.loading);
  const wyckoffEnabled = indicators.find(i => i.id === 'wyckoff')?.enabled ?? false;
  const wyckoffData = useWyckoff(marketData.candles, wyckoffEnabled && !marketData.loading);
  const alphaLHEnabled = indicators.find(i => i.id === 'alpha_lh')?.enabled ?? false;
  const [alphaLHConfig, setAlphaLHConfig] = useState(defaultAlphaLHConfig);
  const alphaLHData = useAlphaLH(marketData.candles, alphaLHEnabled && !marketData.loading, alphaLHConfig);
  const alphaEventEnabled = indicators.find(i => i.id === 'alpha_event')?.enabled ?? false;
  const [alphaEventConfig, setAlphaEventConfig] = useState(defaultAlphaEventConfig);
  const alphaEventData = useAlphaEventSignal(marketData.candles, alphaEventEnabled && !marketData.loading, alphaEventConfig);

  const trendlines = useMemo(() => {
    if (!engineEnabled || marketData.loading || marketData.candles.length < 30) return { support: null, resistance: null };
    return computeDualTrendlines(marketData.candles);
  }, [marketData.candles, marketData.loading, engineEnabled]);

  const toggleIndicator = (id: string) => {
    setIndicators(prev => prev.map(ind => ind.id === id ? { ...ind, enabled: !ind.enabled } : ind));
  };

  const enabledIds = indicators.filter(i => i.enabled).map(i => i.id);
  const activePairInfo = PAIRS.find(p => p.symbol === activePair) || PAIRS[0];

  const lastCandle = marketData.candles[marketData.candles.length - 1];
  const livePrice = lastCandle ? lastCandle.close : 0;
  const prevCandle = marketData.candles[marketData.candles.length - 2];
  const priceChange = prevCandle ? ((livePrice - prevCandle.close) / prevCandle.close * 100) : 0;

  // ── Strength Meter votes ──
  const votes = useMemo(
    () => computeIndicatorVotes({
      enabledIds,
      proEmaData,
      srData,
      wyckoffData,
      alphaLHData,
      alphaEventData,
      matrixData,
      engineData,
      tpSlData,
      smcAnalysis: smcResult.analysis,
      livePrice,
    }),
    [enabledIds, proEmaData, srData, wyckoffData, alphaLHData, alphaEventData, matrixData, engineData, tpSlData, smcResult.analysis, livePrice],
  );
  const strengthScore = useMemo(() => aggregateStrength(votes), [votes]);

  // ── Trigger Alerts ──
  useIndicatorTriggers({
    enabled: watchedTriggers.length > 0 && !marketData.loading,
    pair: activePair,
    timeframe: activeTimeframe,
    candles: marketData.candles,
    proEmaData,
    wyckoffData,
    alphaLHData,
    alphaEventData,
    watchedTriggers,
  });

  useEffect(() => {
    if (!marketData.loading && marketData.candles.length > 0) {
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      setLogs(prev => [
        `[${now}] Đang quét nến ${activeTimeframe} cho ${activePair}...`,
        ...prev.slice(0, 10),
      ]);
    }
  }, [marketData.loading, activePair, activeTimeframe]);

  // Sync URL params (debounced via deps) so refresh keeps state
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set('pair', activePair);
    params.set('tf', activeTimeframe);
    if (enabledIds.length) params.set('ind', enabledIds.join(','));
    else params.delete('ind');
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePair, activeTimeframe, enabledIds.join(',')]);

  const handleLoadPreset = (preset: { pair: string; timeframe: string; enabled_indicators: string[] }) => {
    setActivePair(preset.pair);
    setActiveTimeframe(preset.timeframe);
    setIndicators(prev => prev.map(i => ({ ...i, enabled: preset.enabled_indicators.includes(i.id) })));
  };

  return (
    <main className="min-h-screen bg-[#0b0e11]">
      <Header />

      {/* ═══ BINANCE-STYLE TOP BAR ═══ */}
      <div className="pt-24 px-1.5 lg:px-3">
        <div className="bg-[#161a1e] border-b border-[#2b3139] px-3 py-2 flex flex-wrap items-center gap-2 text-xs">
          {/* Symbol + Price */}
          <div className="flex items-center gap-3 pr-4 border-r border-[#2b3139]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${activePairInfo.color}20` }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activePairInfo.color }} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#eaecef] font-mono leading-tight">{activePair}</span>
                <span className="text-[9px] text-[#848e9c] font-mono">Perpetual</span>
              </div>
            </div>
            <div className="flex flex-col items-end ml-2">
              <span className={`text-lg font-bold font-mono leading-tight ${priceChange >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                {marketData.loading ? '...' : `$${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </span>
              {!marketData.loading && (
                <span className={`text-[11px] font-mono font-bold ${priceChange >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                </span>
              )}
            </div>
          </div>

          {/* Market stats */}
          <div className="flex items-center gap-4 px-3 border-r border-[#2b3139]">
            <div className="flex flex-col">
              <span className="text-[9px] text-[#848e9c] font-mono">24h High</span>
              <span className="text-[11px] text-[#eaecef] font-mono font-medium">
                {lastCandle ? `$${lastCandle.high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-[#848e9c] font-mono">24h Low</span>
              <span className="text-[11px] text-[#eaecef] font-mono font-medium">
                {lastCandle ? `$${lastCandle.low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-[#848e9c] font-mono">24h Vol</span>
              <span className="text-[11px] text-[#eaecef] font-mono font-medium">
                {lastCandle ? `${(lastCandle.volume / 1e6).toFixed(2)}M` : '—'}
              </span>
            </div>
          </div>

          {/* Coin pair selector */}
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 flex-wrap">
              {PAIRS.map(p => (
                <button key={p.symbol} onClick={() => setActivePair(p.symbol)}
                  className={`px-2.5 py-1.5 rounded font-mono font-bold transition-all text-[11px] ${
                    activePair === p.symbol
                      ? 'text-[#fcd535] bg-[#fcd535]/10'
                      : 'text-[#848e9c] hover:text-[#eaecef] hover:bg-[#2b3139]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-5 bg-[#2b3139]" />

          {/* Timeframe — quick buttons + full dropdown (TradingView-style) */}
          <div className="flex items-center gap-1">
            {TIMEFRAMES.map(tf => (
              <button key={tf} onClick={() => setActiveTimeframe(tf)}
                className={`hidden sm:inline-flex px-2.5 py-1.5 rounded font-mono font-bold text-[11px] transition-all ${
                  activeTimeframe === tf
                    ? 'bg-[#fcd535]/10 text-[#fcd535]'
                    : 'text-[#848e9c] hover:text-[#eaecef] hover:bg-[#2b3139]'
                }`}>
                {tf}
              </button>
            ))}
            <TimeframeSelector activeTf={activeTimeframe} onSelect={setActiveTimeframe} />
          </div>

          <div className="w-px h-5 bg-[#2b3139] hidden md:block" />

          {/* View tabs + Share */}
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="flex items-center gap-1 bg-[#0b0e11] border border-[#2b3139] rounded p-0.5">
              <button
                onClick={() => setActiveView('single')}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  activeView === 'single' ? 'bg-[#fcd535] text-[#0b0e11]' : 'text-[#848e9c] hover:text-[#eaecef]'
                }`}
              >
                📊 Single
              </button>
              <button
                onClick={() => setActiveView('multi')}
                className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  activeView === 'multi' ? 'bg-[#fcd535] text-[#0b0e11]' : 'text-[#848e9c] hover:text-[#eaecef]'
                }`}
              >
                🎯 Multi-chart
              </button>
            </div>
            <ShareSnapshot pair={activePair} timeframe={activeTimeframe} enabledIndicators={enabledIds} />
          </div>
        </div>
      </div>

      {/* ═══ MULTI-CHART VIEW ═══ */}
      {activeView === 'multi' ? (
        <div className="px-1.5 lg:px-3 py-3">
          <MultiChartGrid />
        </div>
      ) : (
        <>
      {/* ═══ 3-PANEL LAYOUT ═══ */}
      <div className="px-1.5 lg:px-3 py-1">
        <div className={`grid grid-cols-1 ${sidebarOpen ? 'lg:grid-cols-[210px_1fr_320px]' : 'lg:grid-cols-[1fr_320px]'} gap-px min-h-[75vh] bg-[#2b3139] rounded overflow-hidden transition-all duration-300`}>

          {/* ── Collapsed sidebar handle ── */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed left-1 top-1/2 -translate-y-1/2 z-30 bg-[#1e2329] border border-[#2b3139] rounded-r-lg px-1 py-4 hover:bg-[#2b3139] transition-colors group"
              title="Mở chỉ báo"
            >
              <svg className="w-3.5 h-3.5 text-[#848e9c] group-hover:text-[#fcd535] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* ── LEFT: Indicator Checklist + Presets + Pin ── */}
          {sidebarOpen && (
          <div className="bg-[#161a1e] p-3 relative space-y-3 overflow-y-auto max-h-[calc(100vh-180px)]">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-[#848e9c] tracking-widest uppercase font-mono">CHỈ BÁO</h3>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-[#5e6673]">{enabledIds.length}/{indicators.length}</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-0.5 rounded hover:bg-[#2b3139] transition-colors group"
                  title="Thu gọn"
                >
                  <svg className="w-3.5 h-3.5 text-[#5e6673] group-hover:text-[#fcd535] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-[9px] text-[#5e6673] font-mono -mt-2">Bật/Tắt + hover ⓘ để xem hướng dẫn</p>
            <IndicatorPanel indicators={indicators} onToggle={toggleIndicator} />

            {/* Layout Presets (login required) */}
            <LayoutPresets
              currentPair={activePair}
              currentTimeframe={activeTimeframe}
              enabledIndicators={enabledIds}
              onLoad={handleLoadPreset}
            />

            {/* Pinned mini-charts */}
            <PinnedMiniCharts
              activePair={activePair}
              onSelect={setActivePair}
              availablePairs={PAIRS.map(p => p.symbol)}
            />

            {/* TP/SL Backtesting Dashboard */}
            {tpSlEnabled && tpSlData && (
              <div className="border border-[#2b3139] rounded-lg overflow-hidden">
                <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest">
                  BACKTESTING
                </div>
                <div className="bg-[#161a1e] p-2 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#5e6673]">Total Entries</span>
                    <span className="text-[#eaecef] font-bold">{tpSlData.stats.totalEntries}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#5e6673]">TP / SL Hit</span>
                    <span className="text-[#eaecef] font-bold">
                      <span className="text-emerald-400">{tpSlData.stats.tpCount}</span>
                      {' / '}
                      <span className="text-red-400">{tpSlData.stats.slCount}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#5e6673]">Winrate</span>
                    <span className={`font-bold ${tpSlData.stats.winrate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {tpSlData.stats.winrate.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Pro EMA Dashboard */}
            {proEmaEnabled && proEmaData && (
              <div className="border border-[#2b3139] rounded-lg overflow-hidden">
                <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest">
                  PRO EMA
                </div>
                <div className="bg-[#161a1e] p-2 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-orange-400/60">EMA 20</span>
                    <span className="text-orange-400 font-bold">{proEmaData.lastEma20.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-yellow-400/60">EMA 50</span>
                    <span className="text-yellow-400 font-bold">{proEmaData.lastEma50.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-teal-400/60">EMA 100</span>
                    <span className="text-teal-400 font-bold">{proEmaData.lastEma100.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-purple-400/60">EMA 200</span>
                    <span className="text-purple-400 font-bold">{proEmaData.lastEma200.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#5e6673]">Ribbon</span>
                    <span className={`font-bold ${proEmaData.ribbon === 'bullish' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {proEmaData.ribbon === 'bullish' ? '🟢 BULLISH' : '🔴 BEARISH'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#5e6673]">Crosses</span>
                    <span className="text-[#eaecef] font-bold">{proEmaData.crosses.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Pro Support/Resistance Dashboard */}
            {srEnabled && srData && (
              <div className="border border-[#2b3139] rounded-lg overflow-hidden">
                <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest">
                  PRO S/R
                </div>
                <div className="bg-[#161a1e] p-2 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#5e6673]">Stoch K</span>
                    <span className={`font-bold ${srData.lastK < 30 ? 'text-emerald-400' : srData.lastK > 70 ? 'text-red-400' : 'text-yellow-400'}`}>
                      {srData.lastK.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#5e6673]">Stoch D</span>
                    <span className={`font-bold ${srData.lastD < 30 ? 'text-emerald-400' : srData.lastD > 70 ? 'text-red-400' : 'text-yellow-400'}`}>
                      {srData.lastD.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#5e6673]">S/R Zones</span>
                    <span className="text-[#eaecef] font-bold">{srData.channels.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Wyckoff Dashboard */}
            {wyckoffEnabled && wyckoffData && (
              <div className="border border-[#2b3139] rounded-lg overflow-hidden">
                <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest">
                  WYCKOFF
                </div>
                <div className="bg-[#161a1e] p-2 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#5e6673]">Phase</span>
                    <span className={`font-bold ${
                      wyckoffData.currentPhase === 'accumulation' ? 'text-emerald-400' :
                      wyckoffData.currentPhase === 'distribution' ? 'text-red-400' :
                      wyckoffData.currentPhase === 'bullish' ? 'text-lime-400' :
                      wyckoffData.currentPhase === 'bearish' ? 'text-purple-400' :
                      'text-muted-foreground'
                    }`}>
                      {wyckoffData.currentPhase.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#5e6673]">Events</span>
                    <span className="text-[#eaecef] font-bold">{wyckoffData.events.length}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Alpha LH Dashboard + Config */}
            {alphaLHEnabled && (
              <div>
                <AlphaLHConfigPanel config={alphaLHConfig} onChange={setAlphaLHConfig} />
                {alphaLHData && (
                  <div className="mt-2 border border-[#2b3139] rounded-lg overflow-hidden">
                    <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest">
                      ALPHA LH STATS
                    </div>
                    <div className="bg-[#161a1e] p-2 space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-[#5e6673]">Total Entries</span>
                        <span className="text-[#eaecef] font-bold">{alphaLHData.stats.totalEntries}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-[#5e6673]">Winrate</span>
                        <span className={`font-bold ${alphaLHData.stats.winrate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {alphaLHData.stats.winrate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Alpha Event Dashboard + Config */}
            {alphaEventEnabled && (
              <div>
                <AlphaEventConfigPanel config={alphaEventConfig} onChange={setAlphaEventConfig} />
              </div>
            )}
          </div>
          )}

          {/* ── CENTER: Main Chart ── */}
          <div className="bg-[#0b0e11] overflow-hidden flex flex-col">
            <div className="flex-1">
              {marketData.loading ? (
                <div className="flex items-center justify-center h-[560px] bg-[#0b0e11]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#fcd535] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-[#848e9c] font-mono">Loading {activePair}...</span>
                  </div>
                </div>
              ) : marketData.error ? (
                <div className="flex items-center justify-center h-[560px] bg-[#0b0e11]">
                  <div className="text-center">
                    <span className="text-[#f6465d] text-sm font-mono">⚠️ {marketData.error}</span>
                    <p className="text-[#848e9c] text-xs mt-2 font-mono">Đang sử dụng dữ liệu demo</p>
                  </div>
                </div>
              ) : (
                <TradingChart
                  key={`${activePair}-${activeTimeframe}-${enabledIds.join('.')}`}
                  candles={marketData.candles}
                  indicators={marketData.indicators}
                  zones={marketData.zones}
                  trendline={trendlines.support}
                  trendlineResistance={trendlines.resistance}
                  enabledIndicators={enabledIds}
                  height={750}
                  smcAnalysis={smcResult.analysis}
                  alphaNetData={null}
                  matrixData={matrixData}
                  engineData={engineData}
                  tpSlData={tpSlData}
                  buySellData={null}
                  proEmaData={proEmaData}
                  srData={srData}
                  wyckoffData={wyckoffData}
                  alphaLHData={alphaLHData}
                  alphaEventData={alphaEventData}
                  alphaProData={null}
                  onLoadMore={fetchOlderCandles}
                />
              )}
            </div>
          </div>

          {/* ── RIGHT: Strength Meter + AI Confluence + Triggers + Signals ── */}
          <div className="bg-[#161a1e] p-3 flex flex-col min-h-0 space-y-3 overflow-y-auto max-h-[calc(100vh-180px)]">
            <IndicatorStrengthMeter votes={votes} />
            <AIConfluenceCard
              pair={activePair}
              timeframe={activeTimeframe}
              livePrice={livePrice}
              votes={votes}
              strengthScore={strengthScore}
            />
            <TriggerAlertsPanel watched={watchedTriggers} onChange={setWatchedTriggers} />

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-bold text-[#848e9c] tracking-widest uppercase font-mono">TÍN HIỆU GẦN ĐÂY</h3>
                <span className="text-[10px] font-mono text-[#5e6673]">{signals.length}</span>
              </div>
              <div className="min-h-0">
                <SignalFeed signals={signals} loading={signalsLoading} maxItems={5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ SYSTEM LOG ═══ */}
      <div className="px-1.5 lg:px-3 pb-3">
        <div className="bg-[#161a1e] border-t border-[#2b3139] px-4 py-2 flex items-center gap-3 overflow-x-auto">
          <span className="text-[10px] font-bold text-[#5e6673] tracking-widest shrink-0 font-mono">SYSTEM LOG</span>
          <div className="w-px h-3 bg-[#2b3139]" />
          <div className="flex gap-4 text-[10px] font-mono text-[#848e9c]">
            {logs.slice(0, 4).map((log, i) => (
              <span key={i} className={i === 0 ? 'text-[#fcd535]' : ''}>{log}</span>
            ))}
            {logs.length === 0 && <span>Chờ dữ liệu...</span>}
          </div>
        </div>

        {/* AI SMC Action Points */}
        {smcResult.analysis && smcResult.analysis.action_points.length > 0 && (
          <div className="mt-1 bg-[#161a1e] border border-[#2b3139] rounded px-4 py-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold text-[#848e9c] tracking-widest font-mono">🤖 AI PHÂN TÍCH SMC</span>
              {smcResult.analysis.trade_signal.has_signal && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  smcResult.analysis.trade_signal.type === 'Long'
                    ? 'text-[#0ecb81] bg-[#0ecb81]/10'
                    : 'text-[#f6465d] bg-[#f6465d]/10'
                }`}>
                  {smcResult.analysis.trade_signal.type === 'Long' ? '▲ LONG' : '▼ SHORT'}
                </span>
              )}
              {smcResult.loading && (
                <span className="text-[10px] text-[#fcd535] font-mono animate-pulse">Đang phân tích...</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {smcResult.analysis.action_points.map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] font-mono text-[#848e9c]">
                  <span className="text-[#fcd535] shrink-0">{i + 1}.</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
            {smcResult.analysis.trade_signal.has_signal && smcResult.analysis.trade_signal.entry_price && (
              <div className="flex items-center gap-4 mt-2 pt-2 border-t border-[#2b3139] text-[10px] font-mono">
                <span className="text-[#848e9c]">Entry: <span className="text-[#eaecef]">${smcResult.analysis.trade_signal.entry_price?.toLocaleString()}</span></span>
                <span className="text-[#0ecb81]">TP1: ${smcResult.analysis.trade_signal.TP1?.toLocaleString()}</span>
                <span className="text-[#0ecb81]">TP2: ${smcResult.analysis.trade_signal.TP2?.toLocaleString()}</span>
                <span className="text-[#0ecb81]">TP3: ${smcResult.analysis.trade_signal.TP3?.toLocaleString()}</span>
                <span className="text-[#f6465d]">SL: ${smcResult.analysis.trade_signal.SL?.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </div>
        </>
      )}

      <Footer />
    </main>
  );
};

export default Indicators;
