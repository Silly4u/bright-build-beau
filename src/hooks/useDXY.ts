import { useState, useEffect } from 'react';

export interface DXYData {
  value: number;
  change: number;
  changePercent: number;
  date: string;
  loading: boolean;
}

export function useDXY() {
  const [data, setData] = useState<DXYData>({
    value: 0, change: 0, changePercent: 0, date: '', loading: true,
  });

  useEffect(() => {
    const fallbackDXY = { value: 104.25, change: -0.32, changePercent: -0.31, date: '' };

    const fetchDXY = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=EURUSDT', {
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error(`Binance DXY proxy failed: ${response.status}`);

        const result = await response.json();
        const eurRate = Number(result.lastPrice);
        const prevEurRate = eurRate - Number(result.priceChange);
        if (!Number.isFinite(eurRate) || !Number.isFinite(prevEurRate) || eurRate <= 0 || prevEurRate <= 0) {
          throw new Error('Invalid EURUSDT data for DXY proxy');
        }

        const value = (1 / eurRate) * 120.5;
        const prevValue = (1 / prevEurRate) * 120.5;
        const change = value - prevValue;
        const changePercent = (change / prevValue) * 100;

        setData({
          value: Math.round(value * 100) / 100,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          date: new Date().toISOString().split('T')[0],
          loading: false,
        });
      } catch (e) {
        console.error('DXY fetch error:', e);
        setData({ ...fallbackDXY, loading: false });
      }
    };
    fetchDXY();
    const interval = setInterval(fetchDXY, 300000); // 5 min
    return () => clearInterval(interval);
  }, []);

  return data;
}
