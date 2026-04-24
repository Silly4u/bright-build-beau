import React, { useEffect, useState } from 'react';
import TradingChart from '@/components/indicators/TradingChart';
import { useMarketData } from '@/hooks/useMarketData';
import { useSmartSignals } from '@/hooks/useSmartSignal';

const ENABLED_INDICATORS = [
  'bb_squeeze', 'breakout', 'breakdown', 'confluence',
  'momentum', 'vol_spike', 'rsi_div', 'sup_bounce',
  'macd_cross', 'prev_week_fib',
];

/**
 * Minimal chart-only route used by the Telegram screenshot service.
 * No header / footer / news / ticker — just one chart so Microlink can
 * render the page within its 27-second navigation timeout.
 *
 * Usage: /chart-snapshot?asset=BTC|XAU&tf=H4
 */
const ChartSnapshot: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const asset = (params.get('asset')?.toUpperCase() === 'XAU' ? 'XAU' : 'BTC') as 'BTC' | 'XAU';
  const tf = params.get('tf') || 'H4';

  const symbol = asset === 'XAU' ? 'XAU/USDT' : 'BTC/USDT';
  const data = useMarketData(symbol, tf);
  const signals = useSmartSignals(data.candles, data.indicators, data.zones, symbol, data.loading);

  const hasChartData = data.candles.length > 0 && !data.loading;

  // Mark page as ready only after TradingChart has mounted with non-empty candles.
  // TradingChart creates its canvas on mount, so mounting it with empty candles
  // leaves Microlink with only the legend/header and a blank chart area.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    if (hasChartData) {
      const t = setTimeout(() => setReady(true), 3000);
      return () => clearTimeout(t);
    }
  }, [hasChartData, asset, tf]);

  const price = data.candles[data.candles.length - 1]?.close ?? 0;
  const prev = data.candles[data.candles.length - 2]?.close ?? price;
  const change = prev ? ((price - prev) / prev) * 100 : 0;
  const positive = change >= 0;

  const label = asset === 'XAU' ? 'Vàng (XAU/USD)' : 'Bitcoin (BTC/USDT)';
  const display = price > 0
    ? (asset === 'XAU' ? `$${price.toFixed(2)}` : `$${price.toLocaleString()}`)
    : '...';

  const chartId = asset === 'XAU' ? 'chart-xau' : 'chart-btc';

  return (
    <div
      className="min-h-screen bg-background p-6"
      data-snapshot-ready={ready ? 'true' : 'false'}
    >
      <div className="mb-3 flex items-baseline justify-between">
        <h1 className="text-xl font-semibold text-foreground">{label}</h1>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-bold text-foreground">{display}</span>
          <span className={`text-sm font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
            {positive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          </span>
        </div>
      </div>

      <div id={chartId} className="rounded-lg border border-border bg-card overflow-hidden">
        {hasChartData ? (
          <TradingChart
            key={`${asset}-${tf}-${data.candles.length}`}
            candles={data.candles}
            indicators={data.indicators}
            zones={data.zones}
            signals={signals.map((s: any) => ({ time: Number(s.time), type: s.type === 'sell' ? 'sell' as const : 'buy' as const }))}
            enabledIndicators={ENABLED_INDICATORS}
            height={620}
            label={label}
            timeframe={tf}
          />
        ) : (
          <div className="flex h-[662px] items-center justify-center bg-[#0b0e11] text-sm text-muted-foreground">
            Loading {label}...
          </div>
        )}
      </div>

      {/* Marker that Microlink can wait on once chart is fully drawn */}
      {ready && <div id="snapshot-ready" style={{ position: 'fixed', width: 1, height: 1, opacity: 0 }} />}
    </div>
  );
};

export default ChartSnapshot;
