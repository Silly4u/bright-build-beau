import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TradingChart from '@/components/indicators/TradingChart';
import SignalFeed from '@/components/indicators/SignalFeed';
import ChartPeriodBar from '@/components/analysis/ChartPeriodBar';
import { useMarketData, useSignals } from '@/hooks/useMarketData';
import { useSmartSignals } from '@/hooks/useSmartSignal';
import { useDXY } from '@/hooks/useDXY';
import { supabase } from '@/integrations/supabase/client';
import html2canvas from 'html2canvas';
import { computeDualTrendlines } from '@/lib/computeTrendline';
import { Sparkles, RefreshCw, History } from 'lucide-react';
import MorningBriefBanner from '@/components/analysis/MorningBriefBanner';
import StreakBadge from '@/components/analysis/StreakBadge';
import EventReminders from '@/components/analysis/EventReminders';

import PriceAlerts from '@/components/analysis/PriceAlerts';
import SignalCard from '@/components/analysis/SignalCard';

const TIMEFRAMES = ['M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1'];

const SIGNAL_COLORS: Record<string, { bg: string; border: string; text: string; dot: string; label: string }> = {
  buy: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'MUA' },
  sell: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-400', label: 'BÁN' },
  alert: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'CẢNH BÁO' },
  breakout: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-300', dot: 'bg-violet-400', label: 'BREAKOUT' },
  support_touch: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/25', text: 'text-cyan-300', dot: 'bg-cyan-400', label: 'HỖ TRỢ' },
  volume_anomaly: { bg: 'bg-orange-500/10', border: 'border-orange-500/25', text: 'text-orange-300', dot: 'bg-orange-400', label: 'VOLUME' },
  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/25', text: 'text-blue-300', dot: 'bg-blue-400', label: 'INFO' },
};

const ENABLED_INDICATORS = ['bb_squeeze', 'breakout', 'breakdown', 'confluence', 'momentum', 'vol_spike', 'rsi_div', 'sup_bounce', 'macd_cross', 'prev_week_fib'];

const Analysis: React.FC = () => {
  const navigate = useNavigate();
  // Read ?asset=BTC|XAU from URL so screenshot service / deep-links open the right tab.
  const initialAsset = ((): 'BTC' | 'XAU' => {
    if (typeof window === 'undefined') return 'BTC';
    const p = new URLSearchParams(window.location.search).get('asset')?.toUpperCase();
    return p === 'XAU' ? 'XAU' : 'BTC';
  })();
  const [activeAsset, setActiveAsset] = useState<'BTC' | 'XAU'>(initialAsset);
  const [btcTimeframe, setBtcTimeframe] = useState('H4');
  const [goldTimeframe, setGoldTimeframe] = useState('H4');
  const [logs, setLogs] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanLabel, setScanLabel] = useState('');
  const [autoSignal, setAutoSignal] = useState(false);
  const [sendingSignal, setSendingSignal] = useState<string | null>(null);
  const [btcCommentary, setBtcCommentary] = useState('');
  const [xauCommentary, setXauCommentary] = useState('');
  const [commentaryLoading, setCommentaryLoading] = useState(false);
  const [commentaryFailed, setCommentaryFailed] = useState(false);
  const [commentaryTime, setCommentaryTime] = useState('');
  const [commentaryDate, setCommentaryDate] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<{ asset: string; commentary: string; commentary_date: string; created_at: string }[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const btcChartRef = useRef<HTMLDivElement>(null);
  const goldChartRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Data hooks
  const btcData = useMarketData('BTC/USDT', btcTimeframe);
  const goldData = useMarketData('XAU/USDT', goldTimeframe);
  const { signals: dbSignals, loading: signalsLoading } = useSignals();
  const btcSignals = useSmartSignals(btcData.candles, btcData.indicators, btcData.zones, 'BTC/USDT', btcData.loading);
  const goldSignals = useSmartSignals(goldData.candles, goldData.indicators, goldData.zones, 'XAU/USDT', goldData.loading);
  const dxy = useDXY();

  // Merge signals for sidebar — dedup theo id và theo (symbol+message) trong cửa sổ 5 phút
  const mergedSignals = (() => {
    const sorted = [...btcSignals, ...goldSignals].sort(
      (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || (b.createdAt ?? 0) - (a.createdAt ?? 0),
    );
    const result: typeof sorted = [];
    const seenIds = new Set<string>();
    const FIVE_MIN = 5 * 60 * 1000;
    for (const s of sorted) {
      if (seenIds.has(s.id)) continue;
      // Trùng nội dung gần nhau?
      const dup = result.find(
        r => r.symbol === s.symbol && r.message === s.message && Math.abs((r.createdAt ?? 0) - (s.createdAt ?? 0)) < FIVE_MIN,
      );
      if (dup) continue;
      // Chỉ giữ symbol có data live (BTC/GOLD/XAU)
      if (!['BTC', 'GOLD', 'XAU'].includes(s.symbol)) continue;
      seenIds.add(s.id);
      result.push(s);
      if (result.length >= 30) break;
    }
    return result;
  })();

  // Filter state for signal feed
  const [signalSymbolFilter, setSignalSymbolFilter] = useState<'ALL' | 'BTC' | 'GOLD'>('ALL');
  const [signalTypeFilter, setSignalTypeFilter] = useState<'ALL' | 'breakout' | 'support_touch' | 'volume_anomaly' | 'buy' | 'alert'>('ALL');

  const allSignals = mergedSignals.filter(s => {
    if (signalSymbolFilter !== 'ALL' && s.symbol !== signalSymbolFilter) return false;
    if (signalTypeFilter !== 'ALL' && s.type !== signalTypeFilter) return false;
    return true;
  });

  // Tick "now" mỗi 30s để relative time tự cập nhật
  const [nowTs, setNowTs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowTs(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Live prices
  const btcPrice = btcData.candles[btcData.candles.length - 1]?.close ?? 0;
  const btcPrev = btcData.candles[btcData.candles.length - 2]?.close ?? btcPrice;
  const btcChange = btcPrev ? ((btcPrice - btcPrev) / btcPrev * 100) : 0;
  const goldPrice = goldData.candles[goldData.candles.length - 1]?.close ?? 0;
  const goldPrev = goldData.candles[goldData.candles.length - 2]?.close ?? goldPrice;
  const goldChange = goldPrev ? ((goldPrice - goldPrev) / goldPrev * 100) : 0;

  // AI action points
  const getAIPoints = (data: typeof btcData, symbol: string) => {
    if (!data.actions || data.zones.length === 0) return null;
    const sup = data.zones.find(z => z.type === 'support');
    const res = data.zones.find(z => z.type === 'resistance');
    const lastPrice = data.candles[data.candles.length - 1]?.close ?? 0;
    const trend = data.actions.target > lastPrice ? 'Tăng (Bullish)' : 'Giảm (Bearish)';
    return {
      trend,
      support: sup ? (sup.top + sup.bottom) / 2 : 0,
      resistance: res ? (res.top + res.bottom) / 2 : 0,
      entry: data.actions.entry,
      target: data.actions.target,
      stopLoss: data.actions.stopLoss,
      action: data.actions.target > lastPrice
        ? 'Đợi Breakout hoặc mua tại vùng hỗ trợ'
        : 'Đợi Rebound tại kháng cự hoặc bán',
    };
  };
  const btcAI = getAIPoints(btcData, 'BTC');
  const goldAI = getAIPoints(goldData, 'XAU');

  // ── Load today's commentary from DB first ──
  useEffect(() => {
    const loadToday = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from('market_commentaries')
        .select('asset, commentary, commentary_date, created_at')
        .eq('commentary_date', today);
      if (data && data.length > 0) {
        const btcRow = data.find(r => r.asset === 'BTC');
        const xauRow = data.find(r => r.asset === 'XAU');
        if (btcRow) setBtcCommentary(btcRow.commentary);
        if (xauRow) setXauCommentary(xauRow.commentary);
        const latest = data.reduce((a, b) => a.created_at > b.created_at ? a : b);
        setCommentaryTime(new Date(latest.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
        setCommentaryDate(today);
      }
    };
    loadToday();
  }, []);

  // ── Fetch AI Commentary ──
  const fetchCommentary = useCallback(async () => {
    if (commentaryLoading) return;
    if (!btcAI && !goldAI) return;
    setCommentaryLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('market-commentary', {
        body: {
          btc: btcAI ? { price: btcPrice, trend: btcAI.trend, support: btcAI.support, resistance: btcAI.resistance, entry: btcAI.entry, target: btcAI.target, stopLoss: btcAI.stopLoss, timeframe: btcTimeframe } : null,
          gold: goldAI ? { price: goldPrice, trend: goldAI.trend, support: goldAI.support, resistance: goldAI.resistance, entry: goldAI.entry, target: goldAI.target, stopLoss: goldAI.stopLoss, timeframe: goldTimeframe } : null,
          dxy: { value: dxy.value, changePercent: dxy.changePercent },
        },
      });
      if (error) throw error;
      if (data.credit_error || data.rate_limited) {
        setCommentaryFailed(true);
      } else {
        setBtcCommentary(data.btc_commentary || '');
        setXauCommentary(data.xau_commentary || '');
        setCommentaryFailed(false);
        setCommentaryDate(data.commentary_date || new Date().toISOString().slice(0, 10));
      }
      setCommentaryTime(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      console.error('Commentary error:', e);
      setCommentaryFailed(true);
    } finally {
      setCommentaryLoading(false);
    }
  }, [btcAI, goldAI, btcPrice, goldPrice, dxy.value, dxy.changePercent, btcTimeframe, goldTimeframe, commentaryLoading]);

  // Auto-fetch commentary when AI points are ready.
  // Re-fetch if any asset is missing its commentary once its AI data arrives.
  useEffect(() => {
    if (commentaryLoading || commentaryFailed) return;
    const btcMissing = !!btcAI && !btcCommentary;
    const goldMissing = !!goldAI && !xauCommentary;
    if (btcMissing || goldMissing) fetchCommentary();
  }, [btcAI, goldAI, btcCommentary, xauCommentary]);

  // ── Load history ──
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from('market_commentaries')
      .select('asset, commentary, commentary_date, created_at')
      .lt('commentary_date', today)
      .order('commentary_date', { ascending: false })
      .limit(20);
    setHistory(data || []);
    setHistoryLoading(false);
  }, []);

  // ── Compute trendlines from candle data ──
  const btcTrendlines = useMemo(() => computeDualTrendlines(btcData.candles), [btcData.candles]);
  const goldTrendlines = useMemo(() => computeDualTrendlines(goldData.candles), [goldData.candles]);

  // Scan animation
  const triggerScan = useCallback(() => {
    setScanning(true);
    setScanLabel('🔍 Gemini AI đang phân tích dữ liệu nến mới...');
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    setLogs(prev => [`[${now}] 🔄 Gemini AI scanning BTC:${btcTimeframe} / Gold:${goldTimeframe}...`, ...prev].slice(0, 15));
    setTimeout(() => {
      setScanLabel('✅ Phân tích hoàn tất — Trendline & Zones đã cập nhật');
      setLogs(prev => [`[${now}] ✅ AI scan complete — trendlines & zones updated`, ...prev].slice(0, 15));
    }, 2500);
    setTimeout(() => { setScanning(false); setScanLabel(''); }, 4000);
  }, [btcTimeframe, goldTimeframe]);

  // Trigger scan on data load & timeframe change
  useEffect(() => {
    if (!btcData.loading && btcData.candles.length > 0) {
      triggerScan();
    }
  }, [btcTimeframe, goldTimeframe, btcData.loading]);

  // ── Auto H4 scan timer: trigger every 4 hours ──
  useEffect(() => {
    if (btcTimeframe !== 'H4' && goldTimeframe !== 'H4') return;
    const now = new Date();
    const nextH4 = new Date(now);
    // Round up to next 4-hour mark
    const h = nextH4.getUTCHours();
    const nextH = Math.ceil((h + 1) / 4) * 4;
    nextH4.setUTCHours(nextH, 0, 10, 0); // 10s after candle close
    if (nextH4 <= now) nextH4.setUTCHours(nextH4.getUTCHours() + 4);
    const msUntilNext = nextH4.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      triggerScan();
      // Then repeat every 4 hours
      const interval = setInterval(triggerScan, 4 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }, msUntilNext);

    return () => clearTimeout(timeout);
  }, [btcTimeframe, goldTimeframe, triggerScan]);

  // Screenshot
  const handleScreenshot = useCallback(async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, { backgroundColor: '#0a0f1e', scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = `analysis_${btcTimeframe}_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) { console.error('Screenshot failed:', e); }
  }, [btcTimeframe]);

  // Send signal with chart screenshot
  const handleSendSignal = useCallback(async (symbol: string) => {
    setSendingSignal(symbol);
    const now = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    try {
      // Capture chart screenshot
      const chartRef = symbol === 'BTCUSDT' ? btcChartRef : goldChartRef;
      let chartImage: string | null = null;
      if (chartRef.current) {
        try {
          const canvas = await html2canvas(chartRef.current, {
            backgroundColor: '#0b0e11',
            scale: 2,
            useCORS: true,
            logging: false,
          });
          chartImage = canvas.toDataURL('image/png');
        } catch (e) {
          console.warn('Chart capture failed:', e);
        }
      }

      await supabase.functions.invoke('signal-bot', {
        body: {
          mode: 'scan',
          symbols: [symbol],
          timeframe: symbol === 'BTCUSDT' ? btcTimeframe : goldTimeframe,
          chartImage,
        }
      });
      setLogs(prev => [`[${now}] ✅ Signal ${symbol} sent (with chart)`, ...prev].slice(0, 15));
    } catch (e: any) {
      setLogs(prev => [`[${now}] ❌ Failed: ${e.message}`, ...prev].slice(0, 15));
    } finally { setSendingSignal(null); }
  }, [btcTimeframe, goldTimeframe]);

  // Auto-signal
  useEffect(() => {
    if (autoSignal) {
      const run = async () => {
        const ts = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        setLogs(prev => [`[${ts}] 🤖 Auto scanning...`, ...prev].slice(0, 15));
        try {
          await supabase.functions.invoke('signal-bot', {
            body: { mode: 'scan', symbols: ['BTCUSDT', 'XAUUSDT'], timeframe: btcTimeframe }
          });
          setLogs(prev => [`[${ts}] ✅ Auto scan done`, ...prev].slice(0, 15));
        } catch { setLogs(prev => [`[${ts}] ❌ Auto scan failed`, ...prev].slice(0, 15)); }
      };
      run();
      autoRef.current = setInterval(run, 60000);
    } else {
      if (autoRef.current) clearInterval(autoRef.current);
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [autoSignal, btcTimeframe]);

  const formatPrice = (p: number, isGold = false) =>
    isGold ? `$${p.toFixed(2)}` : `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const AIActionCard = ({ ai, symbol, isGold }: { ai: ReturnType<typeof getAIPoints>; symbol: string; isGold?: boolean }) => {
    if (!ai) return (
      <div className="glass-card rounded-xl p-4 space-y-2 animate-pulse">
        <div className="h-4 bg-foreground/5 rounded w-3/4" />
        <div className="h-3 bg-foreground/5 rounded w-1/2" />
        <div className="h-3 bg-foreground/5 rounded w-2/3" />
      </div>
    );
    return (
      <div className="rounded-lg border border-border/10 bg-card/55 p-4 shadow-card-glow">
        <div className="flex items-center justify-between gap-3 border-b border-border/10 pb-3 mb-3">
          <div>
            <span className="text-xs font-bold text-accent font-mono">{symbol}</span>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">AI "3 Điểm Hành Động"</div>
          </div>
          <span className="rounded-sm border border-accent/20 bg-accent/10 px-2 py-1 text-[10px] font-bold text-accent font-mono">LIVE PLAN</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div className="rounded-md bg-background/55 border border-border/10 p-3">
            <div className="flex items-start gap-2">
              <span className="text-base">📈</span>
              <div>
              <div className="text-[10px] text-muted-foreground/60 font-mono uppercase">Xu hướng hiện tại</div>
              <div className={`text-xs font-bold ${ai.trend.includes('Tăng') ? 'text-emerald-400' : 'text-red-400'}`}>
                {ai.trend}
              </div>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-background/55 border border-border/10 p-3">
            <div className="flex items-start gap-2">
              <span className="text-base">🗝️</span>
              <div>
              <div className="text-[10px] text-muted-foreground/60 font-mono uppercase">Vùng giá then chốt</div>
              <div className="text-xs text-foreground">
                <span className="text-emerald-400">Hỗ trợ: {formatPrice(ai.support, isGold)}</span>
                {' — '}
                <span className="text-red-400">Kháng cự: {formatPrice(ai.resistance, isGold)}</span>
              </div>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-background/55 border border-border/10 p-3">
            <div className="flex items-start gap-2">
              <span className="text-base">🎯</span>
              <div>
              <div className="text-[10px] text-muted-foreground/60 font-mono uppercase">Kế hoạch hành động</div>
              <div className="text-xs text-accent font-medium">{ai.action}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                Entry: {formatPrice(ai.entry, isGold)} | TP: {formatPrice(ai.target, isGold)} | SL: {formatPrice(ai.stopLoss, isGold)}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* ── TOP BAR ── */}
      <div className="pt-24 px-2 lg:px-4">
        <div className="glass-card rounded-lg px-4 py-2.5 flex flex-wrap items-center gap-3 text-xs">
          {/* Pair badges */}
          <div className="flex items-center gap-2">
            <span onClick={() => navigate('/phan-tich/btc')} className="px-2.5 py-1 rounded font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 cursor-pointer hover:bg-amber-500/20 transition-all">₿ BTC/USDT</span>
            <span onClick={() => navigate('/phan-tich/xau')} className="px-2.5 py-1 rounded font-mono font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 cursor-pointer hover:bg-yellow-500/20 transition-all">🥇 XAU/USD</span>
          </div>


          <div className="w-px h-5 bg-foreground/10" />

          {/* Live Prices */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground font-mono font-bold text-sm">
                {btcData.loading ? '...' : formatPrice(btcPrice)}
              </span>
              <span className={`font-mono text-[10px] ${btcChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {btcChange >= 0 ? '+' : ''}{btcChange.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-foreground font-mono font-bold text-sm">
                {goldData.loading ? '...' : formatPrice(goldPrice, true)}
              </span>
              <span className={`font-mono text-[10px] ${goldChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {goldChange >= 0 ? '+' : ''}{goldChange.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex-1" />

          {/* Streak + Scan + Screenshot */}
          <StreakBadge />
          <button onClick={triggerScan}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-primary border border-primary/20 hover:bg-primary/10 transition-all text-[10px] font-bold">
            🔄 Phân tích lại
          </button>
          <button onClick={handleScreenshot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all">
            📸
          </button>
        </div>

        {/* ── MORNING BRIEF BANNER ── */}
        <div className="mt-3">
          <MorningBriefBanner />
        </div>
      </div>

      {/* Scan overlay moved inside TradingChart */}

      {/* ── MAIN LAYOUT ── */}
      <div ref={dashboardRef} className="px-2 lg:px-4 py-2">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3">

          {/* ── LEFT: Charts + Commentary ── */}
          <div className="space-y-3 min-w-0">
            {/* Asset tabs */}
            <div className="flex items-center gap-2 rounded-lg border border-border/10 bg-card/40 p-1">
              <button
                onClick={() => setActiveAsset('BTC')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all border ${
                  activeAsset === 'BTC'
                    ? 'bg-accent/15 border-accent/40 text-accent'
                    : 'bg-foreground/5 border-foreground/10 text-muted-foreground hover:text-foreground'
                }`}
              >
                ₿ BTC/USDT
              </button>
              <button
                onClick={() => setActiveAsset('XAU')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all border ${
                  activeAsset === 'XAU'
                    ? 'bg-accent/15 border-accent/40 text-accent'
                    : 'bg-foreground/5 border-foreground/10 text-muted-foreground hover:text-foreground'
                }`}
              >
                🥇 XAU/USD
              </button>
              <div className="flex-1" />
              <button
                onClick={() => navigate(activeAsset === 'BTC' ? '/phan-tich/btc' : '/phan-tich/xau')}
                className="text-[10px] text-muted-foreground hover:text-primary transition-colors font-mono"
              >
                Xem chi tiết →
              </button>
            </div>

            {/* Single chart panel */}
              <div className="space-y-3 min-w-0 rounded-lg border border-border/10 bg-background/80 p-2 shadow-card-glow">
              {activeAsset === 'BTC' ? (
                <>
                  <div
                    id="chart-btc"
                    data-screenshot-target="btc"
                      className="bg-background border border-border/10 rounded-md overflow-hidden flex flex-col"
                    ref={btcChartRef}
                  >
                    {btcData.loading ? (
                      <div className="flex items-center justify-center h-[440px]">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-muted-foreground font-mono">Loading BTC/USDT...</span>
                        </div>
                      </div>
                    ) : btcData.error ? (
                      <div className="flex items-center justify-center h-[440px]">
                        <span className="text-destructive text-sm">⚠️ {btcData.error}</span>
                      </div>
                    ) : (
                      <>
                        <TradingChart
                          key={`btc-${btcTimeframe}`}
                          candles={btcData.candles}
                          indicators={btcData.indicators}
                          zones={btcData.zones}
                          trendline={btcTrendlines.support}
                          trendlineResistance={btcTrendlines.resistance}
                          enabledIndicators={ENABLED_INDICATORS}
                          height={440}
                          label="₿ BTC/USDT · Binance"
                          scanning={scanning}
                          scanLabel={scanLabel}
                          timeframe={btcTimeframe}
                          onTimeframeChange={setBtcTimeframe}
                          priceLineLabels="minimal"
                        />
                        <ChartPeriodBar
                          activeTf={btcTimeframe}
                          onSelect={(tf) => setBtcTimeframe(tf)}
                          rightLabel={new Date().toUTCString().slice(17, 25) + ' UTC'}
                        />
                      </>
                    )}
                  </div>
                  <AIActionCard ai={btcAI} symbol="₿ BTC/USDT" />
                </>
              ) : (
                <>
                  <div
                    id="chart-xau"
                    data-screenshot-target="xau"
                      className="bg-background border border-border/10 rounded-md overflow-hidden flex flex-col"
                    ref={goldChartRef}
                  >
                    {goldData.loading ? (
                      <div className="flex items-center justify-center h-[440px]">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                          <span className="text-xs text-muted-foreground font-mono">Loading XAU/USD...</span>
                        </div>
                      </div>
                    ) : goldData.error ? (
                      <div className="flex items-center justify-center h-[440px]">
                        <span className="text-destructive text-sm">⚠️ {goldData.error}</span>
                      </div>
                    ) : (
                      <>
                        <TradingChart
                          key={`gold-${goldTimeframe}`}
                          candles={goldData.candles}
                          indicators={goldData.indicators}
                          zones={goldData.zones}
                          trendline={goldTrendlines.support}
                          trendlineResistance={goldTrendlines.resistance}
                          enabledIndicators={ENABLED_INDICATORS}
                          height={440}
                          label="🥇 XAU/USD (Gold)"
                          scanning={scanning}
                          scanLabel={scanLabel}
                          timeframe={goldTimeframe}
                          onTimeframeChange={setGoldTimeframe}
                          priceLineLabels="minimal"
                        />
                        <ChartPeriodBar
                          activeTf={goldTimeframe}
                          onSelect={(tf) => setGoldTimeframe(tf)}
                          rightLabel={new Date().toUTCString().slice(17, 25) + ' UTC'}
                        />
                      </>
                    )}
                  </div>
                  <AIActionCard ai={goldAI} symbol="🥇 XAU/USD" isGold />
                </>
              )}
            </div>


          </div>

          {/* ── RIGHT SIDEBAR: Watchlist + Events + Alerts + Signal Feed ── */}
          <div className="space-y-3">

            {/* Event Reminders */}
            <EventReminders />

            {/* Price Alerts */}
            <PriceAlerts />

            {/* Signal Feed */}
            <div className="glass-card rounded-xl border border-foreground/5 overflow-hidden">
              <div className="px-3 py-2 border-b border-foreground/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-foreground tracking-wider font-mono">📡 TÍN HIỆU REALTIME</span>
                <span className="text-[9px] text-muted-foreground/50 font-mono">{allSignals.length} / {mergedSignals.length}</span>
              </div>

              {/* Filter chips */}
              <div className="px-2 py-2 border-b border-foreground/5 space-y-1.5">
                <div className="flex gap-1 overflow-x-auto scrollbar-thin">
                  {(['ALL', 'BTC', 'GOLD'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSignalSymbolFilter(s)}
                      className={`shrink-0 text-[9px] font-mono font-bold px-2 py-1 rounded-md border transition-colors ${
                        signalSymbolFilter === s
                          ? 'bg-primary/15 border-primary/40 text-primary'
                          : 'bg-foreground/[0.02] border-foreground/10 text-muted-foreground/60 hover:text-foreground'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1 overflow-x-auto scrollbar-thin">
                  {([
                    { v: 'ALL' as const, l: 'Tất cả' },
                    { v: 'breakout' as const, l: 'Breakout' },
                    { v: 'support_touch' as const, l: 'Hỗ trợ' },
                    { v: 'volume_anomaly' as const, l: 'Volume' },
                    { v: 'buy' as const, l: 'Mua' },
                    { v: 'alert' as const, l: 'Cảnh báo' },
                  ]).map(t => (
                    <button
                      key={t.v}
                      onClick={() => setSignalTypeFilter(t.v)}
                      className={`shrink-0 text-[9px] font-mono px-2 py-1 rounded-md border transition-colors ${
                        signalTypeFilter === t.v
                          ? 'bg-cyan-brand/15 border-cyan-brand/40 text-cyan-brand'
                          : 'bg-foreground/[0.02] border-foreground/10 text-muted-foreground/60 hover:text-foreground'
                      }`}
                    >
                      {t.l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="max-h-[520px] overflow-y-auto">
                {allSignals.length === 0 ? (
                  <div className="p-4 text-center text-[10px] text-muted-foreground/40">
                    Không có tín hiệu khớp bộ lọc
                  </div>
                ) : (
                  <div className="divide-y divide-foreground/5">
                    {allSignals.map(sig => {
                      const style = SIGNAL_COLORS[sig.type] || SIGNAL_COLORS.info;
                      const currentPrice =
                        sig.symbol === 'BTC' ? btcPrice :
                        sig.symbol === 'GOLD' || sig.symbol === 'XAU' ? goldPrice :
                        undefined;
                      const handleClick = () => {
                        if (sig.symbol === 'BTC') {
                          setActiveAsset('BTC');
                          requestAnimationFrame(() => btcChartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
                        } else if (sig.symbol === 'GOLD' || sig.symbol === 'XAU') {
                          setActiveAsset('XAU');
                          requestAnimationFrame(() => goldChartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
                        }
                      };
                      return (
                        <SignalCard
                          key={sig.id}
                          signal={sig}
                          style={style}
                          currentPrice={currentPrice}
                          now={nowTs}
                          onClick={handleClick}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* DXY Widget */}
            <div className="glass-card rounded-xl p-3 border border-foreground/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-foreground font-mono">💵 DXY Index</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-foreground font-mono">
                    {dxy.loading ? '...' : dxy.value?.toFixed(2)}
                  </span>
                  {!dxy.loading && dxy.changePercent !== null && (
                    <span className={`text-[10px] font-mono ${dxy.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {dxy.changePercent >= 0 ? '+' : ''}{dxy.changePercent.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* System Log */}
            <div className="glass-card rounded-xl border border-foreground/5 overflow-hidden">
              <div className="px-3 py-2 border-b border-foreground/5">
                <span className="text-[10px] font-bold text-muted-foreground/40 tracking-widest font-mono">⚙️ SYSTEM LOG</span>
              </div>
              <div className="px-3 py-2 max-h-[160px] overflow-y-auto space-y-1">
                {logs.length === 0 ? (
                  <span className="text-[9px] text-muted-foreground/30 font-mono">Chưa có log...</span>
                ) : (
                  logs.slice(0, 8).map((log, i) => (
                    <div key={i} className={`text-[9px] font-mono leading-relaxed ${i === 0 ? 'text-primary/70' : 'text-muted-foreground/50'}`}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="glass-card rounded-xl p-3 border border-foreground/5 space-y-2">
              <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider font-mono">🚀 HÀNH ĐỘNG</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSendSignal('BTCUSDT')}
                  disabled={!!sendingSignal}
                  className="px-2 py-2 rounded-lg text-[10px] font-bold text-amber-400 border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all disabled:opacity-50 font-mono"
                >
                  {sendingSignal === 'BTCUSDT' ? '⏳...' : '📤 BTC Signal'}
                </button>
                <button
                  onClick={() => handleSendSignal('XAUUSDT')}
                  disabled={!!sendingSignal}
                  className="px-2 py-2 rounded-lg text-[10px] font-bold text-yellow-400 border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all disabled:opacity-50 font-mono"
                >
                  {sendingSignal === 'XAUUSDT' ? '⏳...' : '📤 XAU Signal'}
                </button>
              </div>
              <button
                onClick={() => setAutoSignal(!autoSignal)}
                className={`w-full px-2 py-2 rounded-lg text-[10px] font-bold font-mono border transition-all ${
                  autoSignal
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                    : 'text-muted-foreground/60 border-foreground/10 hover:bg-foreground/5'
                }`}
              >
                {autoSignal ? '🟢 Auto Scan: ON' : '⚪ Auto Scan: OFF'}
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Analysis;
