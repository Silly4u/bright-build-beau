import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Zone {
  top: number;
  bottom: number;
  type: 'support' | 'resistance';
}

export interface Indicators {
  bb: { upper: number[]; middle: number[]; lower: number[]; bandwidth: number[] };
  rsi: number[];
  ema20: number[];
  ema50: number[];
  ema200: number[];
  macd: { macdLine: number[]; signalLine: number[]; histogram: number[] };
  volAvg: number[];
}

export interface MarketData {
  candles: Candle[];
  indicators: Indicators | null;
  zones: Zone[];
  actions: { entry: number; target: number; stopLoss: number } | null;
  loading: boolean;
  error: string | null;
}

const SYMBOL_MAP: Record<string, string> = {
  'BTC/USDT': 'BTCUSDT',
  'ETH/USDT': 'ETHUSDT',
  'XAU/USDT': 'XAUUSDT',
  'SOL/USDT': 'SOLUSDT',
  'BNB/USDT': 'BNBUSDT',
  'XRP/USDT': 'XRPUSDT',
  'DOGE/USDT': 'DOGEUSDT',
  'WLD/USDT': 'WLDUSDT',
  'HYPE/USDT': 'HYPEUSDT',
  'PEPE/USDT': 'PEPEUSDT',
};

const TF_TO_BINANCE: Record<string, string> = {
  'M1': '1m', 'M5': '5m', 'M15': '15m', 'M30': '30m',
  'H1': '1h', 'H4': '4h', 'D1': '1d', 'W1': '1w',
};

export function useMarketData(pair: string, timeframe: string) {
  const [data, setData] = useState<MarketData>({
    candles: [], indicators: null, zones: [], actions: null, loading: true, error: null
  });
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const symbol = SYMBOL_MAP[pair] || pair.replace('/', '');
      const { data: result, error } = await supabase.functions.invoke('signal-bot', {
        body: { mode: 'indicators', symbol, timeframe, limit: 300 }
      });

      if (error) throw error;

      setData({
        candles: result.candles || [],
        indicators: result.indicators || null,
        zones: result.zones || [],
        actions: result.actions || null,
        loading: false,
        error: null,
      });
    } catch (e: any) {
      console.error('Market data fetch error:', e);
      setData(prev => ({ ...prev, loading: false, error: e.message || 'Failed to fetch data' }));
    }
  }, [pair, timeframe]);

  // Initial fetch + periodic full refresh (every 5 min for indicators recalc)
  useEffect(() => {
    setData(prev => ({ ...prev, loading: true }));
    fetchData();

    intervalRef.current = setInterval(fetchData, 300000); // 5 min
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchData]);

  // Binance WebSocket for real-time candle updates
  useEffect(() => {
    const symbol = (SYMBOL_MAP[pair] || pair.replace('/', '')).toLowerCase();
    const interval = TF_TO_BINANCE[timeframe] || '4h';

    // XAU is not on Binance - skip WebSocket for it
    if (symbol === 'xauusdt') return;

    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`;
    
    const connect = () => {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.e !== 'kline') return;

          const k = msg.k;
          const wsCandle: Candle = {
            time: k.t, // open time in ms
            open: parseFloat(k.o),
            high: parseFloat(k.h),
            low: parseFloat(k.l),
            close: parseFloat(k.c),
            volume: parseFloat(k.v),
          };

          setData(prev => {
            if (prev.candles.length === 0) return prev;

            const lastCandle = prev.candles[prev.candles.length - 1];
            const newCandles = [...prev.candles];

            if (lastCandle.time === wsCandle.time) {
              // Update existing candle
              newCandles[newCandles.length - 1] = wsCandle;
            } else if (wsCandle.time > lastCandle.time) {
              // New candle formed
              newCandles.push(wsCandle);
              // Keep max 300 candles
              if (newCandles.length > 300) newCandles.shift();
            }

            return { ...prev, candles: newCandles };
          });
        } catch {
          // ignore parse errors
        }
      };

      ws.onclose = (e) => {
        // Reconnect after 3s unless intentionally closed
        if (e.code !== 1000) {
          setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on cleanup
        wsRef.current.close(1000);
        wsRef.current = null;
      }
    };
  }, [pair, timeframe]);

  return data;
}

export interface Signal {
  id: string;
  symbol: string;
  timeframe: string;
  conditions: string[];
  strength: string;
  price: number;
  rsi: number | null;
  vol_ratio: number | null;
  candle_time: string;
  sent_at: string;
}

export function useSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      const { data, error } = await supabase
        .from('signals')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setSignals(data as unknown as Signal[]);
      }
      setLoading(false);
    };

    fetchSignals();

    // Subscribe to realtime
    const channel = supabase
      .channel('signals-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'signals' }, (payload) => {
        setSignals(prev => [payload.new as unknown as Signal, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { signals, loading };
}
