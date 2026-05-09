import React, { Suspense, lazy, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChartCandlestick, LayoutDashboard, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Analysis from './Analysis';

// Lazy-load heavy chart workspace
const Indicators = lazy(() => import('./Indicators'));

const PAIRS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'DOGE/USDT'];
const TFS = ['M15', 'H1', 'H4', 'D1'];
type TabKey = 'chart' | 'overview';

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'chart', label: 'Biểu đồ', icon: ChartCandlestick },
  { key: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
];

const Workspace: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as TabKey) || 'chart';
  const pair = params.get('pair') || 'BTC/USDT';
  const tf = params.get('tf') || 'H4';

  const setTab = (t: TabKey) => {
    const next = new URLSearchParams(params);
    next.set('tab', t);
    setParams(next, { replace: false });
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

  // Ensure default tab in URL on first mount
  useEffect(() => {
    if (!params.get('tab')) {
      const next = new URLSearchParams(params);
      next.set('tab', 'chart');
      setParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* TABS + QUICK PAIR SWITCHER */}
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

          {/* Quick pair switcher (toàn cục) */}
          <div className="flex items-center gap-2">
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              className="bg-background/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:border-amber-300/50 outline-none"
              aria-label="Chọn cặp giao dịch"
            >
              {PAIRS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-white/10 bg-background/60">
              {TFS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTf(t)}
                  className={`px-2 py-1 rounded text-[11px] font-mono transition ${
                    tf === t ? 'bg-white/10 text-white' : 'text-white/55 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <motion.section
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-2"
      >
        {tab === 'chart' ? (
          <Suspense fallback={<ChartFallback />}>
            <Indicators embedded />
          </Suspense>
        ) : (
          <Analysis embedded />
        )}
      </motion.section>

      {/* SHARED DISCLAIMER */}
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

const ChartFallback: React.FC = () => (
  <div className="px-2 lg:px-4 py-20 flex items-center justify-center">
    <div className="flex items-center gap-3 text-white/60 text-sm">
      <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
      Đang tải workspace biểu đồ...
    </div>
  </div>
);

export default Workspace;
