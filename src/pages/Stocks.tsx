import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StockHeatmap from '@/components/stocks/StockHeatmap';
import { type Quote } from '@/components/stocks/StockWatchlist';
import StockNewsFeed from '@/components/stocks/StockNewsFeed';
import TradingViewChart from '@/components/stocks/TradingViewChart';
import { STOCKS, getStockByTicker, isUSMarketOpen } from '@/lib/stocks';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';

const Stocks: React.FC = () => {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [selected, setSelected] = useState<string>('NVDA');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [marketOpen, setMarketOpen] = useState(isUSMarketOpen());

  const selectedStock = useMemo(() => getStockByTicker(selected), [selected]);
  const selectedQuote = selectedStock ? quotes[selectedStock.symbol] : undefined;

  // Fetch quotes
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const tick = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('stocks-quotes');
        if (cancelled) return;
        if (!error && data?.quotes) {
          const map: Record<string, Quote> = {};
          (data.quotes as Quote[]).forEach(q => { map[q.symbol] = q; });
          setQuotes(map);
          setLastUpdate(new Date());
        }
      } catch (e) {
        console.error('quotes fetch err', e);
      } finally {
        setLoading(false);
        const open = isUSMarketOpen();
        setMarketOpen(open);
        const delay = open ? 5000 : 30000;
        if (!cancelled) timer = setTimeout(tick, delay);
      }
    };

    tick();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, []);

  // Aggregate market stats
  const stats = useMemo(() => {
    const arr = Object.values(quotes);
    if (arr.length === 0) return { gainers: 0, losers: 0, avg: 0, totalVol: 0 };
    const gainers = arr.filter(q => q.changePercent > 0).length;
    const losers = arr.filter(q => q.changePercent < 0).length;
    const avg = arr.reduce((s, q) => s + q.changePercent, 0) / arr.length;
    const totalVol = arr.reduce((s, q) => s + q.volume, 0);
    return { gainers, losers, avg, totalVol };
  }, [quotes]);

  useEffect(() => {
    document.title = 'Cổ Phiếu Mỹ - NVDA, TSLA, AAPL Real-time | UncleTrader';
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <Header />

      <main className="pt-24 md:pt-28 pb-16 px-3 sm:px-4 lg:px-6 max-w-[1600px] mx-auto">
        {/* Hero stats bar */}
        <section className="mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground tracking-tight">
                Cổ Phiếu Mỹ <span className="text-cyan-brand">Real-time</span>
              </h1>
              <p className="text-[11px] text-muted-foreground/70 font-mono mt-0.5">
                {STOCKS.length} mã · Nguồn: Bitunix Perpetuals · Tin: Finnhub + AI Dịch
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${marketOpen ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/40 bg-amber-500/10 text-amber-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${marketOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {marketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
              </span>
              {lastUpdate && (
                <span className="flex items-center gap-1 text-muted-foreground/70">
                  <Clock className="w-3 h-3" /> {lastUpdate.toLocaleTimeString('vi-VN')}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="glass-card rounded-lg p-3">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-mono">Mã tăng</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-emerald-400 tabular-nums">{stats.gainers}</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
            <div className="glass-card rounded-lg p-3">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-mono">Mã giảm</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-red-400 tabular-nums">{stats.losers}</span>
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              </div>
            </div>
            <div className="glass-card rounded-lg p-3">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-mono">Trung bình</div>
              <div className={`text-xl font-bold tabular-nums mt-0.5 ${stats.avg >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.avg >= 0 ? '+' : ''}{stats.avg.toFixed(2)}%
              </div>
            </div>
            <div className="glass-card rounded-lg p-3">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground/60 font-mono">Tổng Vol 24h</div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold text-cyan-brand tabular-nums">
                  ${stats.totalVol >= 1e9 ? `${(stats.totalVol/1e9).toFixed(2)}B` : `${(stats.totalVol/1e6).toFixed(0)}M`}
                </span>
                <Activity className="w-3.5 h-3.5 text-cyan-brand" />
              </div>
            </div>
          </div>
        </section>

        {/* Heatmap */}
        <section className="mb-4">
          <StockHeatmap quotes={quotes} onSelect={setSelected} />
        </section>

        {/* Main grid: Chart + Selected info | News */}
        <section className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-3" style={{ minHeight: 600 }}>
          {/* Center: chart */}
          <div className="flex flex-col gap-3">
            {/* Selected stock header */}
            {selectedStock && (
              <div className="glass-card rounded-xl p-3 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold font-mono text-foreground">{selectedStock.ticker}</h2>
                    <span className="text-[12px] text-muted-foreground/80">{selectedStock.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-muted-foreground/70">{selectedStock.sector}</span>
                  </div>
                  {selectedQuote && (
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-2xl font-bold tabular-nums text-foreground">${selectedQuote.price.toFixed(2)}</span>
                      <span className={`flex items-center gap-1 text-sm font-mono font-bold ${selectedQuote.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {selectedQuote.changePercent >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {selectedQuote.changePercent >= 0 ? '+' : ''}{selectedQuote.change.toFixed(2)} ({selectedQuote.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  )}
                </div>
                {selectedQuote && (
                  <div className="grid grid-cols-3 gap-3 text-[10px] font-mono">
                    <div><div className="text-muted-foreground/60 uppercase tracking-wider">Mở</div><div className="text-foreground tabular-nums">${selectedQuote.open.toFixed(2)}</div></div>
                    <div><div className="text-muted-foreground/60 uppercase tracking-wider">Cao</div><div className="text-emerald-400 tabular-nums">${selectedQuote.high.toFixed(2)}</div></div>
                    <div><div className="text-muted-foreground/60 uppercase tracking-wider">Thấp</div><div className="text-red-400 tabular-nums">${selectedQuote.low.toFixed(2)}</div></div>
                  </div>
                )}
              </div>
            )}

            {/* TradingView chart with all 21 tickers in built-in watchlist (the "+" panel) */}
            {selectedStock && (
              <TradingViewChart
                symbol={selectedStock.tvSymbol}
                height={600}
                watchlist={STOCKS.map(s => s.tvSymbol)}
              />
            )}

            {/* News for selected ticker - mobile/tablet shows here */}
            <div className="xl:hidden">
              <StockNewsFeed ticker={selected} limit={15} />
            </div>
          </div>

          {/* Right: news (desktop only column) */}
          <div className="hidden xl:block xl:max-h-[820px]">
            <StockNewsFeed ticker={selected} limit={20} />
          </div>
        </section>

        {/* All news */}
        <section className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3" style={{ height: 500 }}>
          <StockNewsFeed limit={30} />
          <div className="glass-card rounded-xl p-4 flex flex-col">
            <h3 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-2">📊 Top Movers</h3>
            <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto scrollbar-thin">
              <div>
                <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-1.5">🟢 Top Gainers</div>
                <div className="space-y-1">
                  {Object.values(quotes).sort((a,b)=>b.changePercent-a.changePercent).slice(0,8).map(q => (
                    <button key={q.ticker} onClick={() => setSelected(q.ticker)} className="w-full flex justify-between items-center px-2 py-1.5 rounded hover:bg-white/5 text-[11px] font-mono">
                      <span className="font-bold text-foreground">{q.ticker}</span>
                      <span className="text-muted-foreground/70 tabular-nums">${q.price.toFixed(2)}</span>
                      <span className="text-emerald-400 font-bold tabular-nums">+{q.changePercent.toFixed(2)}%</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-red-400 uppercase tracking-wider mb-1.5">🔴 Top Losers</div>
                <div className="space-y-1">
                  {Object.values(quotes).sort((a,b)=>a.changePercent-b.changePercent).slice(0,8).map(q => (
                    <button key={q.ticker} onClick={() => setSelected(q.ticker)} className="w-full flex justify-between items-center px-2 py-1.5 rounded hover:bg-white/5 text-[11px] font-mono">
                      <span className="font-bold text-foreground">{q.ticker}</span>
                      <span className="text-muted-foreground/70 tabular-nums">${q.price.toFixed(2)}</span>
                      <span className="text-red-400 font-bold tabular-nums">{q.changePercent.toFixed(2)}%</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Stocks;
