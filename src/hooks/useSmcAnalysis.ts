import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Candle } from '@/hooks/useMarketData';

export interface SmcLiquidityBox {
  type: 'Buyside' | 'Sellside';
  start_time: number;
  end_time: number;
  top_price: number;
  bottom_price: number;
}

export interface SmcTradeSignal {
  has_signal: boolean;
  type?: 'Long' | 'Short';
  entry_time?: number;
  entry_price?: number;
  TP1?: number;
  TP2?: number;
  TP3?: number;
  SL?: number;
}

export interface SmcAnalysis {
  liquidity_boxes: SmcLiquidityBox[];
  trade_signal: SmcTradeSignal;
  action_points: string[];
}

export function useSmcAnalysis(
  candles: Candle[],
  symbol: string,
  timeframe: string,
  enabled: boolean,
) {
  const [analysis, setAnalysis] = useState<SmcAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || candles.length < 20) {
      setAnalysis(null);
      return;
    }

    let cancelled = false;

    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('smc-analysis', {
          body: {
            candles: candles.slice(-100).map(c => ({
              time: c.time,
              open: c.open,
              high: c.high,
              low: c.low,
              close: c.close,
              volume: c.volume,
            })),
            symbol,
            timeframe,
          },
        });

        if (cancelled) return;

        if (fnError) {
          throw new Error(fnError.message || 'AI analysis failed');
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setAnalysis(data as SmcAnalysis);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Unknown error');
          setAnalysis(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAnalysis();

    return () => { cancelled = true; };
  }, [candles.length, symbol, timeframe, enabled]);

  return { analysis, loading, error };
}
