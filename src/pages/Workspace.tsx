import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartCandlestick, LayoutDashboard, FileText, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Analysis from './Analysis';
import { PAIRS, TIMEFRAMES } from './Indicators';

// Lazy-load heavy tabs (chỉ tải lần đầu, sau đó giữ mounted)
const Indicators = lazy(() => import('./Indicators'));
const AnalysisDetail = lazy(() => import('./AnalysisDetail'));

type TabKey = 'chart' | 'overview' | 'daily';

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'chart', label: 'Biểu đồ', icon: ChartCandlestick },
  { key: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { key: 'daily', label: 'Phân tích ngày', icon: FileText },
];

// Các pair được hỗ trợ ở Tổng quan + Phân tích ngày (chỉ BTC & XAU)
const ANALYSIS_PAIRS = new Set(['BTC/USDT', 'XAU/USDT']);

const Workspace: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as TabKey) || 'chart';
  const pair = params.get('pair') || 'BTC/USDT';
  const tf = params.get('tf') || 'H4';

  // Sub-tab cho Phân tích ngày (BTC | XAU). Lấy theo pair toàn cục nếu hợp lệ.
  const initialDailySymbol = pair === 'XAU/USDT' ? 'xau' : 'btc';
  const [dailySymbol, setDailySymbol] = useState<'btc' | 'xau'>(initialDailySymbol);

  // Track first-time mount cho từng tab nặng → keep-alive sau khi đã render
  const [chartEverShown, setChartEverShown] = useState(tab === 'chart');
  const [overviewEverShown, setOverviewEverShown] = useState(tab === 'overview');
  const [dailyEverShown, setDailyEverShown] = useState(tab === 'daily');
  useEffect(() => {
    if (tab === 'chart') setChartEverShown(true);
    if (tab === 'overview') setOverviewEverShown(true);
    if (tab === 'daily') setDailyEverShown(true);
  }, [tab]);

  // Sync dailySymbol với pair toàn cục khi user đổi pair (nếu là BTC/XAU)
  useEffect(() => {
    if (pair === 'BTC/USDT') setDailySymbol('btc');
    else if (pair === 'XAU/USDT') setDailySymbol('xau');
  }, [pair]);

  const setTab = (t: TabKey) => {
    const next = new URLSearchParams(params);
    next.set('tab', t);
    setParams(next, { replace: false });
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };
  const setPair = (p: string) => {
    const next = new URLSearchParams(params);
    next.set('pair', p);
    setParams(next, { replace: true });
  };
  const setTf = (t: string) => {
    const next = new URLSearchParams(params);
    next.set('tf', t);
    setParams(next, { replace: true });
  };
  const setDailySub = (s: 'btc' | 'xau') => {
    setDailySymbol(s);
    // đồng bộ lại pair toàn cục cho Biểu đồ
    setPair(s === 'btc' ? 'BTC/USDT' : 'XAU/USDT');
  };

  // Đảm bảo URL luôn có tab
  useEffect(() => {
    if (!params.get('tab')) {
      const next = new URLSearchParams(params);
      next.set('tab', 'chart');
      setParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activePairInfo = PAIRS.find(p => p.symbol === pair) ?? PAIRS[0];

  // Khi đang ở tab Tổng quan / Phân tích ngày → các pair không phải BTC/XAU sẽ bị disable
  const restrictPair = tab === 'overview' || tab === 'daily';
  const isPairUnsupported = restrictPair && !ANALYSIS_PAIRS.has(pair);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* TABS + QUICK PAIR/TF SWITCHER (sync 2 chiều với từng tab qua URL) */}
      <div className="pt-20 px-2 lg:px-4">
        <div className="glass rounded-2xl p-2 flex flex-wrap items-center gap-2 justify-between">
          {/* Tabs */}
          <div role="tablist" className="flex items-center gap-1">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.key)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/30'
                      : 'text-white/65 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Quick pair switcher */}
          <div className="flex items-center gap-2">
            {restrictPair && (
              <span
                title="Tab này chỉ hỗ trợ BTC/USDT và XAU/USDT"
                className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-md bg-amber-400/10 text-amber-300/90 border border-amber-300/20"
              >
                Chỉ dành cho Biểu đồ
              </span>
            )}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-background/60 border ${
              isPairUnsupported ? 'border-amber-400/30' : 'border-white/10'
            }`}>
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activePairInfo.color }}
                aria-hidden
              />
              <select
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className="bg-transparent text-xs font-mono focus:outline-none cursor-pointer"
                aria-label="Chọn cặp giao dịch"
              >
                {PAIRS.map((p) => {
                  const supported = !restrictPair || ANALYSIS_PAIRS.has(p.symbol);
                  return (
                    <option
                      key={p.symbol}
                      value={p.symbol}
                      disabled={!supported}
                      className="bg-background"
                    >
                      {p.symbol}{!supported ? ' · chỉ Biểu đồ' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-white/10 bg-background/60">
              {TIMEFRAMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTf(t)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition ${
                    tf === t ? 'bg-white/10 text-white' : 'text-white/55 hover:text-white'
                  }`}
                  aria-pressed={tf === t}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT — render cả 3 tab, ẩn bằng CSS để keep state */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-3"
      >
        {/* Chart */}
        <div className={tab === 'chart' ? '' : 'hidden'} aria-hidden={tab !== 'chart'}>
          {chartEverShown ? (
            <Suspense fallback={<TabFallback label="biểu đồ" />}>
              <Indicators embedded />
            </Suspense>
          ) : null}
        </div>

        {/* Overview */}
        <div className={tab === 'overview' ? '' : 'hidden'} aria-hidden={tab !== 'overview'}>
          {overviewEverShown ? <Analysis embedded /> : null}
        </div>

        {/* Daily Analysis (BTC + XAU sub-tabs) */}
        <div className={tab === 'daily' ? '' : 'hidden'} aria-hidden={tab !== 'daily'}>
          {dailyEverShown ? (
            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-2 rounded-lg border border-border/10 bg-card/40 p-1 mb-3">
                <button
                  onClick={() => setDailySub('btc')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all border ${
                    dailySymbol === 'btc'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-foreground/5 border-foreground/10 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  ₿ BTC/USDT
                </button>
                <button
                  onClick={() => setDailySub('xau')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all border ${
                    dailySymbol === 'xau'
                      ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300'
                      : 'bg-foreground/5 border-foreground/10 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  🥇 XAU/USD
                </button>
                <div className="flex-1" />
                <span className="text-[10px] text-muted-foreground/70 font-mono pr-2">Bài phân tích AI hằng ngày</span>
              </div>

              <Suspense fallback={<TabFallback label="bài phân tích" />}>
                {/* Render cả 2 và ẩn để keep state khi đổi sub-tab */}
                <div className={dailySymbol === 'btc' ? '' : 'hidden'}>
                  <AnalysisDetail symbolOverride="btc" embedded />
                </div>
                <div className={dailySymbol === 'xau' ? '' : 'hidden'}>
                  <AnalysisDetail symbolOverride="xau" embedded />
                </div>
              </Suspense>
            </div>
          ) : null}
        </div>
      </motion.section>

      {/* DISCLAIMER CHUNG */}
      <section className="px-2 lg:px-4 mt-8">
        <div className="glass rounded-2xl p-4 border border-red-500/20 text-xs text-white/55 leading-relaxed">
          <span className="text-red-300 font-mono uppercase tracking-[0.2em]">⚠ Cảnh báo rủi ro</span>
          {' · '}Mọi tín hiệu, phân tích và indicator trên trang chỉ mang tính tham khảo, <span className="text-amber-300">không phải khuyến nghị đầu tư</span>.
          Crypto/Futures có rủi ro cực cao — trader phải tự nghiên cứu (DYOR) và chịu trách nhiệm với quyết định của mình (NFA).
        </div>
      </section>

      <Footer />
    </main>
  );
};

const TabFallback: React.FC<{ label: string }> = ({ label }) => (
  <div className="px-2 lg:px-4 py-20 flex items-center justify-center">
    <div className="flex items-center gap-3 text-white/60 text-sm">
      <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
      Đang tải {label}...
    </div>
  </div>
);

export default Workspace;
