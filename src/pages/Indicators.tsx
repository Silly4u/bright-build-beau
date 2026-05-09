import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import PairSelector from '@/components/indicators/PairSelector';
import MultiChartGrid from '@/components/indicators/MultiChartGrid';
import MarketOverviewBar from '@/components/indicators/MarketOverviewBar';
import TopMoversPanel from '@/components/indicators/TopMoversPanel';
import TradeSetupCards from '@/components/indicators/TradeSetupCards';
import EconomicEventsWidget from '@/components/indicators/EconomicEventsWidget';
import LiquidationHeatmap from '@/components/indicators/LiquidationHeatmap';
import { computeIndicatorVotes, aggregateStrength } from '@/lib/indicatorVotes';
import { useIndicatorTriggers, type TriggerType } from '@/hooks/useIndicatorTriggers';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  ChartCandlestick, Layers, Zap, Bell, Activity, Flame, TrendingUp,
  PanelLeft, PanelRight, ChevronDown, Sparkles, Pin, BookMarked,
} from 'lucide-react';

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
  { symbol: 'SUI/USDT', label: 'SUI', color: '#4DA2FF' },
  { symbol: 'ENA/USDT', label: 'ENA', color: '#FF5C00' },
  { symbol: 'FARTCOIN/USDT', label: 'FART', color: '#FFB347' },
  { symbol: 'AVAX/USDT', label: 'AVAX', color: '#E84142' },
  { symbol: 'LINK/USDT', label: 'LINK', color: '#2A5ADA' },
];

const TIMEFRAMES = ['M15', 'H1', 'H4', 'D1'];

const DEFAULT_INDICATORS: IndicatorConfig[] = [
  { id: 'bb_squeeze', label: 'Bollinger Bands', enabled: true, color: '#26A69A', category: 'Volatility', note: 'BB(20,2) — dải trên/dưới + đường giữa SMA20.' },
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

// ── Reusable section card ──
const SectionCard: React.FC<{ title: string; icon?: React.ReactNode; right?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, right, children, className = '' }) => (
  <div className={`bg-[#0f1318] border border-[#2b3139]/80 rounded-lg overflow-hidden shadow-[0_1px_0_rgba(255,255,255,0.02)_inset] ${className}`}>
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-[#1a1f26] to-[#13171c] border-b border-[#2b3139]/60">
      {icon && <span className="text-[#fcd535]">{icon}</span>}
      <span className="text-[10px] font-mono font-bold tracking-[0.16em] text-[#eaecef]/90 uppercase">{title}</span>
      {right && <div className="ml-auto">{right}</div>}
    </div>
    <div>{children}</div>
  </div>
);

interface IndicatorsProps { embedded?: boolean }
const Indicators: React.FC<IndicatorsProps> = ({ embedded = false }) => {
  const { user } = useAuth();
  const { hasAccess, loading: permLoading } = useIndicatorPermissions();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPair = searchParams.get('pair') && PAIRS.find(p => p.symbol === searchParams.get('pair'))
    ? (searchParams.get('pair') as string) : 'BTC/USDT';
  const initialTf = searchParams.get('tf') && TIMEFRAMES.includes(searchParams.get('tf') as string)
    ? (searchParams.get('tf') as string) : 'H4';
  const initialIndIds = (searchParams.get('ind') || '').split(',').filter(Boolean);

  const [activeView, setActiveView] = useState<'single' | 'multi'>('single');
  const [activePair, setActivePair] = useState(initialPair);
  const [activeTimeframe, setActiveTimeframe] = useState(initialTf);
  const [indicators, setIndicators] = useState<IndicatorConfig[]>(
    DEFAULT_INDICATORS.map(i => ({ ...i, enabled: initialIndIds.includes(i.id) || i.enabled })),
  );
  const [logs, setLogs] = useState<string[]>([]);
  const [watchedTriggers, setWatchedTriggers] = useState<TriggerType[]>([]);
  const [leftOpen, setLeftOpen] = useState(false); // Sheet on all sizes
  const [rightOpen, setRightOpen] = useState(false); // Mobile sheet
  const [bottomOpen, setBottomOpen] = useState(true);

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
  const isUp = priceChange >= 0;

  const votes = useMemo(
    () => computeIndicatorVotes({
      enabledIds, proEmaData, srData, wyckoffData, alphaLHData, alphaEventData,
      matrixData, engineData, tpSlData, smcAnalysis: smcResult.analysis, livePrice,
    }),
    [enabledIds, proEmaData, srData, wyckoffData, alphaLHData, alphaEventData, matrixData, engineData, tpSlData, smcResult.analysis, livePrice],
  );
  const strengthScore = useMemo(() => aggregateStrength(votes), [votes]);

  useIndicatorTriggers({
    enabled: watchedTriggers.length > 0 && !marketData.loading,
    pair: activePair, timeframe: activeTimeframe, candles: marketData.candles,
    proEmaData, wyckoffData, alphaLHData, alphaEventData, watchedTriggers,
  });

  useEffect(() => {
    if (!marketData.loading && marketData.candles.length > 0) {
      const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      setLogs(prev => [`[${now}] Đang quét nến ${activeTimeframe} cho ${activePair}...`, ...prev.slice(0, 10)]);
    }
  }, [marketData.loading, activePair, activeTimeframe]);

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

  // ── LEFT PANEL CONTENT (used in Sheet) ──
  const LeftPanelContent = (
    <div className="space-y-3 pb-6">
      <SectionCard title="Chỉ báo" icon={<Layers className="w-3 h-3" />} right={<span className="text-[9px] font-mono text-[#5e6673]">{enabledIds.length}/{indicators.length}</span>}>
        <div className="p-2">
          <IndicatorPanel indicators={indicators} onToggle={toggleIndicator} />
        </div>
      </SectionCard>

      <SectionCard title="Layout Presets" icon={<BookMarked className="w-3 h-3" />}>
        <div className="p-2">
          <LayoutPresets currentPair={activePair} currentTimeframe={activeTimeframe} enabledIndicators={enabledIds} onLoad={handleLoadPreset} />
        </div>
      </SectionCard>

      <SectionCard title="Pinned Charts" icon={<Pin className="w-3 h-3" />}>
        <div className="p-2">
          <PinnedMiniCharts activePair={activePair} onSelect={setActivePair} availablePairs={PAIRS.map(p => p.symbol)} />
        </div>
      </SectionCard>

      {tpSlEnabled && tpSlData && (
        <SectionCard title="Backtest TP/SL">
          <div className="p-2 space-y-1.5 text-[10px] font-mono">
            <div className="flex justify-between"><span className="text-[#5e6673]">Total Entries</span><span className="text-[#eaecef] font-bold">{tpSlData.stats.totalEntries}</span></div>
            <div className="flex justify-between"><span className="text-[#5e6673]">TP / SL</span><span><span className="text-emerald-400">{tpSlData.stats.tpCount}</span> / <span className="text-red-400">{tpSlData.stats.slCount}</span></span></div>
            <div className="flex justify-between"><span className="text-[#5e6673]">Winrate</span><span className={tpSlData.stats.winrate >= 50 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{tpSlData.stats.winrate.toFixed(1)}%</span></div>
          </div>
        </SectionCard>
      )}

      {proEmaEnabled && proEmaData && (
        <SectionCard title="Pro EMA">
          <div className="p-2 space-y-1 text-[10px] font-mono">
            <div className="flex justify-between"><span className="text-orange-400/70">EMA 20</span><span className="text-orange-400 font-bold">{proEmaData.lastEma20.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-yellow-400/70">EMA 50</span><span className="text-yellow-400 font-bold">{proEmaData.lastEma50.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-teal-400/70">EMA 100</span><span className="text-teal-400 font-bold">{proEmaData.lastEma100.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-purple-400/70">EMA 200</span><span className="text-purple-400 font-bold">{proEmaData.lastEma200.toFixed(2)}</span></div>
            <div className="flex justify-between pt-1 border-t border-[#2b3139]/60"><span className="text-[#5e6673]">Ribbon</span><span className={proEmaData.ribbon === 'bullish' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{proEmaData.ribbon === 'bullish' ? '🟢 BULLISH' : '🔴 BEARISH'}</span></div>
          </div>
        </SectionCard>
      )}

      {srEnabled && srData && (
        <SectionCard title="Pro S/R">
          <div className="p-2 space-y-1 text-[10px] font-mono">
            <div className="flex justify-between"><span className="text-[#5e6673]">Stoch K</span><span className={`font-bold ${srData.lastK < 30 ? 'text-emerald-400' : srData.lastK > 70 ? 'text-red-400' : 'text-yellow-400'}`}>{srData.lastK.toFixed(1)}</span></div>
            <div className="flex justify-between"><span className="text-[#5e6673]">Stoch D</span><span className={`font-bold ${srData.lastD < 30 ? 'text-emerald-400' : srData.lastD > 70 ? 'text-red-400' : 'text-yellow-400'}`}>{srData.lastD.toFixed(1)}</span></div>
            <div className="flex justify-between"><span className="text-[#5e6673]">Zones</span><span className="text-[#eaecef] font-bold">{srData.channels.length}</span></div>
          </div>
        </SectionCard>
      )}

      {wyckoffEnabled && wyckoffData && (
        <SectionCard title="Wyckoff">
          <div className="p-2 space-y-1 text-[10px] font-mono">
            <div className="flex justify-between"><span className="text-[#5e6673]">Phase</span><span className="font-bold text-[#fcd535]">{wyckoffData.currentPhase.toUpperCase()}</span></div>
            <div className="flex justify-between"><span className="text-[#5e6673]">Events</span><span className="text-[#eaecef] font-bold">{wyckoffData.events.length}</span></div>
          </div>
        </SectionCard>
      )}

      {alphaLHEnabled && (
        <SectionCard title="Alpha LH Config">
          <div className="p-2"><AlphaLHConfigPanel config={alphaLHConfig} onChange={setAlphaLHConfig} /></div>
        </SectionCard>
      )}
      {alphaEventEnabled && (
        <SectionCard title="Alpha Event Config">
          <div className="p-2"><AlphaEventConfigPanel config={alphaEventConfig} onChange={setAlphaEventConfig} /></div>
        </SectionCard>
      )}

      <EconomicEventsWidget />
    </div>
  );

  // ── RIGHT PANEL CONTENT (Tabs) ──
  const RightPanelContent = (
    <Tabs defaultValue="ai" className="w-full">
      <TabsList className="w-full h-9 bg-[#0f1318] border border-[#2b3139] rounded-lg p-0.5 grid grid-cols-5 gap-0.5">
        <TabsTrigger value="ai" className="data-[state=active]:bg-[#fcd535] data-[state=active]:text-[#0b0e11] text-[10px] font-mono font-bold rounded-md gap-1"><Sparkles className="w-3 h-3" />AI</TabsTrigger>
        <TabsTrigger value="movers" className="data-[state=active]:bg-[#fcd535] data-[state=active]:text-[#0b0e11] text-[10px] font-mono font-bold rounded-md gap-1"><TrendingUp className="w-3 h-3" />Movers</TabsTrigger>
        <TabsTrigger value="alerts" className="data-[state=active]:bg-[#fcd535] data-[state=active]:text-[#0b0e11] text-[10px] font-mono font-bold rounded-md gap-1"><Bell className="w-3 h-3" />Alerts</TabsTrigger>
        <TabsTrigger value="signals" className="data-[state=active]:bg-[#fcd535] data-[state=active]:text-[#0b0e11] text-[10px] font-mono font-bold rounded-md gap-1"><Activity className="w-3 h-3" />Signals</TabsTrigger>
        <TabsTrigger value="liq" className="data-[state=active]:bg-[#fcd535] data-[state=active]:text-[#0b0e11] text-[10px] font-mono font-bold rounded-md gap-1"><Flame className="w-3 h-3" />Liq</TabsTrigger>
      </TabsList>

      <TabsContent value="ai" className="mt-3 space-y-3">
        <IndicatorStrengthMeter votes={votes} />
        <AIConfluenceCard pair={activePair} timeframe={activeTimeframe} livePrice={livePrice} votes={votes} strengthScore={strengthScore} />
      </TabsContent>
      <TabsContent value="movers" className="mt-3">
        <TopMoversPanel onSelect={(p) => { if (PAIRS.find(x => x.symbol === p)) setActivePair(p); }} />
      </TabsContent>
      <TabsContent value="alerts" className="mt-3">
        <TriggerAlertsPanel watched={watchedTriggers} onChange={setWatchedTriggers} />
      </TabsContent>
      <TabsContent value="signals" className="mt-3">
        <SectionCard title="Tín hiệu gần đây" icon={<Zap className="w-3 h-3" />} right={<span className="text-[10px] font-mono text-[#5e6673]">{signals.length}</span>}>
          <div className="p-2"><SignalFeed signals={signals} loading={signalsLoading} maxItems={6} /></div>
        </SectionCard>
      </TabsContent>
      <TabsContent value="liq" className="mt-3">
        <LiquidationHeatmap />
      </TabsContent>
    </Tabs>
  );

  return (
    <main className={embedded ? 'bg-[#0a0d11]' : 'min-h-screen bg-[#0a0d11]'}>
      {!embedded && <Header />}

      {/* Market overview ticker */}
      <div className={`${embedded ? 'pt-2' : 'pt-20'} px-2 lg:px-3`}>
        <MarketOverviewBar />
      </div>

      {/* ═══ HERO PRICE CARD + STICKY TOOLBAR ═══ */}
      <div className="px-2 lg:px-3 mt-2">
        <div className="rounded-xl overflow-hidden border border-[#2b3139] bg-gradient-to-br from-[#13171c] via-[#0f1318] to-[#0a0d11] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]">
          {/* Price hero */}
          <div className="px-4 py-3 flex items-center justify-between gap-4 flex-wrap border-b border-[#2b3139]/60">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${activePairInfo.color}20`, boxShadow: `0 0 24px ${activePairInfo.color}40` }}>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activePairInfo.color }} />
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f1318] ${isUp ? 'bg-[#0ecb81]' : 'bg-[#f6465d]'} animate-pulse`} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[14px] font-mono font-bold text-[#eaecef] tracking-wide">{activePair}</span>
                  <span className="text-[9px] font-mono text-[#5e6673] uppercase tracking-wider">{activeTimeframe}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-[28px] sm:text-[32px] font-bold font-mono leading-none tabular-nums ${isUp ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                    {marketData.loading ? '...' : `$${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </span>
                  {!marketData.loading && (
                    <span className={`flex items-center gap-1 text-[12px] font-mono font-semibold ${isUp ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                      <span>{isUp ? '↗' : '↘'}</span>
                      {isUp ? '+' : ''}{(prevCandle ? livePrice - prevCandle.close : 0).toFixed(2)}
                      <span className="text-[#848e9c]">({isUp ? '+' : ''}{priceChange.toFixed(2)}%)</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* OHLC mini grid */}
            <div className="hidden md:grid grid-cols-4 gap-3 text-[11px] font-mono tabular-nums">
              {[
                { label: 'Open', val: lastCandle?.open, color: 'text-[#eaecef]' },
                { label: 'High', val: lastCandle?.high, color: 'text-[#0ecb81]' },
                { label: 'Low', val: lastCandle?.low, color: 'text-[#f6465d]' },
                { label: 'Close', val: lastCandle?.close, color: 'text-[#fcd535]' },
              ].map(c => (
                <div key={c.label} className="flex flex-col items-end">
                  <span className="text-[9px] text-[#5e6673] uppercase tracking-wider">{c.label}</span>
                  <span className={`${c.color} font-semibold`}>${c.val ? c.val.toFixed(2) : '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Toolbar */}
          <div className="px-2 py-2 flex items-center gap-1.5 flex-wrap bg-[#0c1015]">
            <PairSelector pairs={PAIRS} activePair={activePair} onSelect={setActivePair} />

            <div className="w-px h-5 bg-[#2b3139] mx-0.5" />

            <div className="flex items-center gap-0.5 bg-[#0a0d11] rounded-md p-0.5 border border-[#2b3139]/60">
              {TIMEFRAMES.map(tf => (
                <button key={tf} onClick={() => setActiveTimeframe(tf)}
                  className={`px-2.5 py-1 rounded font-mono font-semibold text-[11px] transition-all ${
                    activeTimeframe === tf ? 'bg-[#fcd535] text-[#0b0e11] shadow-sm' : 'text-[#848e9c] hover:text-[#eaecef] hover:bg-[#2b3139]/60'
                  }`}>
                  {tf === 'M15' ? '15m' : tf === 'H1' ? '1h' : tf === 'H4' ? '4h' : 'D'}
                </button>
              ))}
              <TimeframeSelector activeTf={activeTimeframe} onSelect={setActiveTimeframe} />
            </div>

            <div className="w-px h-5 bg-[#2b3139] mx-0.5" />

            {/* Indicators button → opens left sheet */}
            <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
              <SheetTrigger asChild>
                <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-mono font-semibold text-[#eaecef] hover:bg-[#2b3139] transition-colors border border-[#2b3139]/60">
                  <PanelLeft className="w-3.5 h-3.5" />
                  <span>Chỉ báo</span>
                  {enabledIds.length > 0 && (
                    <span className="text-[9px] bg-[#fcd535]/20 text-[#fcd535] px-1.5 py-0.5 rounded font-bold">{enabledIds.length}</span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] sm:w-[360px] bg-[#0a0d11] border-r border-[#2b3139] p-3 overflow-y-auto">
                <SheetHeader className="mb-3">
                  <SheetTitle className="text-[#eaecef] font-mono text-sm tracking-widest">⚡ INDICATORS & TOOLS</SheetTitle>
                </SheetHeader>
                {LeftPanelContent}
              </SheetContent>
            </Sheet>

            {/* Mobile-only right panel trigger */}
            <Sheet open={rightOpen} onOpenChange={setRightOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-mono font-semibold text-[#eaecef] hover:bg-[#2b3139] transition-colors border border-[#2b3139]/60">
                  <PanelRight className="w-3.5 h-3.5" />
                  <span>Phân tích</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[340px] sm:w-[380px] bg-[#0a0d11] border-l border-[#2b3139] p-3 overflow-y-auto">
                <SheetHeader className="mb-3">
                  <SheetTitle className="text-[#eaecef] font-mono text-sm tracking-widest">📊 ANALYTICS</SheetTitle>
                </SheetHeader>
                {RightPanelContent}
              </SheetContent>
            </Sheet>

            {/* View tabs + Share — pushed right */}
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="flex items-center gap-0.5 bg-[#0a0d11] border border-[#2b3139] rounded-md p-0.5">
                <button onClick={() => setActiveView('single')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
                    activeView === 'single' ? 'bg-[#fcd535] text-[#0b0e11]' : 'text-[#848e9c] hover:text-[#eaecef]'
                  }`}>
                  <ChartCandlestick className="w-3 h-3" /> Single
                </button>
                <button onClick={() => setActiveView('multi')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                    activeView === 'multi' ? 'bg-[#fcd535] text-[#0b0e11]' : 'text-[#848e9c] hover:text-[#eaecef]'
                  }`}>
                  Multi
                </button>
              </div>
              <ShareSnapshot pair={activePair} timeframe={activeTimeframe} enabledIndicators={enabledIds} />
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN BODY ═══ */}
      {activeView === 'multi' ? (
        <div className="px-2 lg:px-3 py-3">
          <MultiChartGrid />
        </div>
      ) : (
        <div className="px-2 lg:px-3 mt-3">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3">
            {/* CHART */}
            <div className="rounded-xl overflow-hidden border border-[#2b3139] bg-[#0a0d11] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]">
              {marketData.loading ? (
                <div className="flex items-center justify-center h-[600px]">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-2 border-[#fcd535] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-[#848e9c] font-mono">Loading {activePair}...</span>
                  </div>
                </div>
              ) : marketData.error ? (
                <div className="flex items-center justify-center h-[600px]">
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
                  height={720}
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

            {/* RIGHT PANEL — desktop only (mobile uses Sheet) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 space-y-3">
                {RightPanelContent}
              </div>
            </aside>
          </div>

          {/* DISCLAIMER + SETUPS + LOG (collapsible bottom area) */}
          <div className="mt-3 space-y-3">
            {/* Disclaimer */}
            <div className="border border-[#f6465d]/40 bg-gradient-to-br from-[#f6465d]/10 via-[#1a0f12] to-[#0a0d11] rounded-xl overflow-hidden">
              <div className="flex items-center gap-1.5 bg-[#f6465d]/15 px-3 py-1.5 border-b border-[#f6465d]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f6465d] animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#f6465d]">⚠️ CẢNH BÁO RỦI RO · DISCLAIMER</span>
                <span className="ml-auto text-[9px] font-mono text-[#848e9c] uppercase tracking-wider hidden sm:inline">Đọc kỹ trước khi giao dịch</span>
              </div>
              <div className="p-3 grid md:grid-cols-3 gap-3 text-[10px] font-mono leading-relaxed">
                <p className="text-[#eaecef]"><span className="text-[#fcd535] font-bold">Lưu ý kỹ:</span> Tất cả chỉ báo & phân tích <span className="text-[#f6465d] font-bold">KHÔNG PHẢI lời khuyên đầu tư</span>, chỉ tham khảo & học hỏi.</p>
                <p className="text-[#848e9c]">Giao dịch <span className="text-[#fcd535]">Crypto/Futures</span> đi kèm rủi ro <span className="text-[#f6465d] font-bold">cực kỳ lớn</span>, có thể <span className="text-[#f6465d] font-bold">mất toàn bộ vốn</span>.</p>
                <p className="text-[#0ecb81]">🛡️ Bạn <span className="font-bold">phải tự chịu trách nhiệm</span> cho mọi quyết định. <span className="text-[#848e9c]">DYOR · NFA · Trade safe.</span></p>
              </div>
            </div>

            {/* Auto Trade Setups */}
            <TradeSetupCards pair={activePair} livePrice={livePrice} candles={marketData.candles} votes={votes} strengthScore={strengthScore} />

            {/* Collapsible System Log + AI SMC */}
            <div className="border border-[#2b3139] rounded-xl overflow-hidden bg-[#0f1318]">
              <button
                onClick={() => setBottomOpen(o => !o)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#1a1f26] to-[#13171c] hover:bg-[#2b3139]/40 transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-[#fcd535]" />
                <span className="text-[10px] font-mono font-bold tracking-[0.18em] text-[#eaecef]">SYSTEM LOG & AI SMC</span>
                <ChevronDown className={`w-4 h-4 text-[#848e9c] ml-auto transition-transform ${bottomOpen ? 'rotate-180' : ''}`} />
              </button>
              {bottomOpen && (
                <div className="p-3 space-y-3">
                  <div className="flex items-center gap-3 overflow-x-auto text-[10px] font-mono text-[#848e9c]">
                    {logs.length === 0 ? <span>Chờ dữ liệu...</span> : logs.slice(0, 4).map((log, i) => (
                      <span key={i} className={i === 0 ? 'text-[#fcd535]' : ''}>{log}</span>
                    ))}
                  </div>
                  {smcResult.analysis && smcResult.analysis.action_points.length > 0 && (
                    <div className="border-t border-[#2b3139] pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#fcd535]" />
                        <span className="text-[10px] font-bold text-[#eaecef] tracking-widest font-mono">AI PHÂN TÍCH SMC</span>
                        {smcResult.analysis.trade_signal.has_signal && (
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            smcResult.analysis.trade_signal.type === 'Long' ? 'text-[#0ecb81] bg-[#0ecb81]/10' : 'text-[#f6465d] bg-[#f6465d]/10'
                          }`}>
                            {smcResult.analysis.trade_signal.type === 'Long' ? '▲ LONG' : '▼ SHORT'}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {smcResult.analysis.action_points.map((point, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11px] font-mono text-[#848e9c]">
                            <span className="text-[#fcd535] shrink-0">{i + 1}.</span><span>{point}</span>
                          </div>
                        ))}
                      </div>
                      {smcResult.analysis.trade_signal.has_signal && smcResult.analysis.trade_signal.entry_price && (
                        <div className="flex items-center gap-4 mt-3 pt-2 border-t border-[#2b3139] text-[10px] font-mono flex-wrap">
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
              )}
            </div>
          </div>
        </div>
      )}

      {!embedded && <Footer />}
    </main>
  );
};

export default Indicators;
