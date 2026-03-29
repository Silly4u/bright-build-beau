import { useMemo } from 'react';
import type { Candle } from '@/hooks/useMarketData';
import { computeSupportResistance, type SupportResistanceResult } from '@/lib/supportResistance';

export type { SupportResistanceResult } from '@/lib/supportResistance';

export function useSupportResistance(
  candles: Candle[],
  enabled: boolean,
): SupportResistanceResult | null {
  return useMemo(() => {
    if (!enabled || candles.length < 50) return null;
    try {
      return computeSupportResistance(candles);
    } catch (e) {
      console.error('Support/Resistance computation error:', e);
      return null;
    }
  }, [candles, enabled]);
}
