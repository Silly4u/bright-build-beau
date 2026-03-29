import { useMemo } from 'react';
import type { Candle } from '@/hooks/useMarketData';
import { computeBuySellSignal, type BuySellData } from '@/lib/buySellSignal';

export type { BuySellData } from '@/lib/buySellSignal';

export function useBuySellSignal(candles: Candle[], enabled: boolean): BuySellData | null {
  return useMemo(() => {
    if (!enabled || candles.length < 170) return null;
    return computeBuySellSignal(candles);
  }, [candles, enabled]);
}
