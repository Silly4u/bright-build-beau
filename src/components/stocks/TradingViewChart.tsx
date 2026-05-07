import React, { useEffect, useRef } from 'react';

interface Props {
  symbol: string; // e.g. NASDAQ:NVDA
  height?: number;
  watchlist?: string[]; // TradingView symbols to show in the "+" / watchlist panel
}

const TradingViewChart: React.FC<Props> = ({ symbol, height = 520, watchlist }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.height = '100%';
    widgetDiv.style.width = '100%';
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: 'D',
      timezone: 'Asia/Ho_Chi_Minh',
      theme: 'dark',
      style: '1',
      locale: 'vi_VN',
      backgroundColor: 'rgba(13, 15, 22, 1)',
      gridColor: 'rgba(255, 255, 255, 0.06)',
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      watchlist: watchlist && watchlist.length ? watchlist : undefined,
      compareSymbols: watchlist && watchlist.length
        ? watchlist.filter(s => s !== symbol).map(s => ({ symbol: s, position: 'NewPriceScale' }))
        : undefined,
      details: true,
      withdateranges: true,
      support_host: 'https://www.tradingview.com',
    });
    containerRef.current.appendChild(script);
  }, [symbol, watchlist]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container rounded-xl overflow-hidden border border-white/10"
      style={{ height }}
    />
  );
};

export default TradingViewChart;
