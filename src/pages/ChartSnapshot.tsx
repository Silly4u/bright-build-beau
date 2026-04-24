import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, LineSeries, type IChartApi } from 'lightweight-charts';
import { useMarketData } from '@/hooks/useMarketData';
import type { Candle, Indicators, Zone } from '@/hooks/useMarketData';

const ENABLED_INDICATORS = [
  'bb_squeeze', 'breakout', 'breakdown', 'confluence',
  'momentum', 'vol_spike', 'rsi_div', 'sup_bounce',
  'macd_cross', 'prev_week_fib',
];

interface SnapshotChartProps {
  candles: Candle[];
  indicators: Indicators | null;
  zones: Zone[];
  height?: number;
  label: string;
  onDrawn: () => void;
}

const SnapshotChart: React.FC<SnapshotChartProps> = ({ candles, indicators, zones, height = 620, label, onDrawn }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || candles.length === 0) return;

    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: '#0b0e11' },
        textColor: '#848e9c',
        fontFamily: "'JetBrains Mono', 'SF Mono', 'Menlo', monospace",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.04)' },
        horzLines: { color: 'rgba(255,255,255,0.04)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.08)',
        scaleMargins: { top: 0.08, bottom: 0.16 },
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.08)',
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 7,
        rightOffset: 8,
      },
      width: Math.max(800, container.clientWidth),
      height,
    });
    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#0ecb81',
      downColor: '#f6465d',
      borderUpColor: '#0ecb81',
      borderDownColor: '#f6465d',
      wickUpColor: '#0ecb81',
      wickDownColor: '#f6465d',
      title: label,
    });

    const chartData = candles.map((c) => ({
      time: Math.floor(c.time / 1000) as any,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }));
    candleSeries.setData(chartData);

    if (indicators?.bb) {
      const addLine = (values: number[], color: string, width: 1 | 2 = 1) => {
        const series = chart.addSeries(LineSeries, {
          color,
          lineWidth: width,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        const data = values
          .map((value, index) => ({ time: Math.floor(candles[index]?.time / 1000) as any, value }))
          .filter((point) => Number.isFinite(point.value) && Number.isFinite(point.time));
        if (data.length) series.setData(data);
      };
      addLine(indicators.bb.upper, 'rgba(66,165,245,0.9)', 1);
      addLine(indicators.bb.middle, 'rgba(255,193,7,0.85)', 1);
      addLine(indicators.bb.lower, 'rgba(66,165,245,0.9)', 1);
    }

    zones.slice(0, 4).forEach((zone) => {
      const color = zone.type === 'support' ? 'rgba(38,166,154,0.55)' : 'rgba(239,83,80,0.55)';
      [zone.top, zone.bottom].forEach((price) => {
        const line = chart.addSeries(LineSeries, {
          color,
          lineWidth: 1,
          lineStyle: 2,
          priceLineVisible: false,
          lastValueVisible: false,
        });
        line.setData([
          { time: chartData[0].time, value: price },
          { time: chartData[chartData.length - 1].time, value: price },
        ]);
      });
    });

    const visibleBars = 160;
    const to = candles.length - 1 + 8;
    chart.timeScale().setVisibleLogicalRange({ from: Math.max(0, to - visibleBars), to });
    candleSeries.priceScale().applyOptions({ autoScale: true });

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: Math.max(800, container.clientWidth), height });
    });
    resizeObserver.observe(container);

    const t = window.setTimeout(onDrawn, 800);

    return () => {
      window.clearTimeout(t);
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [candles, indicators, zones, height, label, onDrawn]);

  return <div ref={containerRef} className="w-full" style={{ height }} />;
};

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

  const hasChartData = data.candles.length > 0 && !data.loading;

  // Mark page as ready only after TradingChart has mounted with non-empty candles.
  // TradingChart creates its canvas on mount, so mounting it with empty candles
  // leaves Microlink with only the legend/header and a blank chart area.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
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
          <SnapshotChart
            key={`${asset}-${tf}-${data.candles.length}`}
            candles={data.candles}
            indicators={data.indicators}
            zones={data.zones}
            height={620}
            label={label}
            onDrawn={() => setReady(true)}
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
