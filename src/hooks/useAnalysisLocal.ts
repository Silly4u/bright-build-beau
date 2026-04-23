import { useState, useEffect, useCallback } from 'react';

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function writeLS<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new CustomEvent(`ls:${key}`));
  } catch { /* ignore */ }
}

function useLSState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => readLS(key, initial));
  useEffect(() => {
    const onChange = () => setVal(readLS(key, initial));
    window.addEventListener(`ls:${key}`, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(`ls:${key}`, onChange);
      window.removeEventListener('storage', onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback((v: T | ((p: T) => T)) => {
    setVal(prev => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
      writeLS(key, next);
      return next;
    });
  }, [key]);
  return [val, set];
}

// ─── STREAK (manual check-in) ───────────────────────────
export interface StreakState {
  count: number;
  last_check_date: string | null; // YYYY-MM-DD
  longest: number;
}

function todayStr() { return new Date().toISOString().slice(0, 10); }
function yesterdayStr() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function useStreak() {
  const [state, setState] = useLSState<StreakState>('analysis:streak', { count: 0, last_check_date: null, longest: 0 });
  const today = todayStr();

  // Auto-reset if missed >1 day (visible on next check-in)
  const checkedToday = state.last_check_date === today;
  const canCheckIn = !checkedToday;

  const checkIn = useCallback(() => {
    setState(prev => {
      const t = todayStr();
      if (prev.last_check_date === t) return prev;
      const continuing = prev.last_check_date === yesterdayStr();
      const newCount = continuing ? prev.count + 1 : 1;
      return {
        count: newCount,
        last_check_date: t,
        longest: Math.max(prev.longest, newCount),
      };
    });
  }, [setState]);

  // Effective streak (display 0 if missed >1 day)
  const effectiveCount = (() => {
    if (!state.last_check_date) return 0;
    if (state.last_check_date === today || state.last_check_date === yesterdayStr()) return state.count;
    return 0;
  })();

  return { ...state, count: effectiveCount, checkedToday, canCheckIn, checkIn };
}

// ─── WATCHLIST ───────────────────────────
export interface WatchlistItem {
  symbol: string; // BINANCE format e.g. ETHUSDT, SOLUSDT
  display: string; // ETH, SOL, etc
  added_at: string;
}
const DEFAULT_WATCHLIST: WatchlistItem[] = [
  { symbol: 'ETHUSDT', display: 'ETH', added_at: new Date().toISOString() },
  { symbol: 'SOLUSDT', display: 'SOL', added_at: new Date().toISOString() },
  { symbol: 'BNBUSDT', display: 'BNB', added_at: new Date().toISOString() },
  { symbol: 'DOGEUSDT', display: 'DOGE', added_at: new Date().toISOString() },
];

export function useWatchlist() {
  const [items, setItems] = useLSState<WatchlistItem[]>('analysis:watchlist', DEFAULT_WATCHLIST);
  const add = useCallback((symbol: string, display: string) => {
    setItems(prev => prev.find(i => i.symbol === symbol) ? prev : [...prev, { symbol, display, added_at: new Date().toISOString() }].slice(0, 12));
  }, [setItems]);
  const remove = useCallback((symbol: string) => {
    setItems(prev => prev.filter(i => i.symbol !== symbol));
  }, [setItems]);
  return { items, add, remove };
}

// ─── TRADE JOURNAL ───────────────────────────
export interface TradeEntry {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  entry: number;
  exit: number | null;
  size: number; // qty
  pnl: number | null;
  status: 'open' | 'closed';
  note: string;
  opened_at: string;
  closed_at: string | null;
}

export function useTradeJournal() {
  const [trades, setTrades] = useLSState<TradeEntry[]>('analysis:journal', []);

  const addTrade = useCallback((t: Omit<TradeEntry, 'id' | 'opened_at' | 'pnl' | 'status' | 'exit' | 'closed_at'>) => {
    const entry: TradeEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...t,
      exit: null,
      pnl: null,
      status: 'open',
      opened_at: new Date().toISOString(),
      closed_at: null,
    };
    setTrades(prev => [entry, ...prev].slice(0, 200));
  }, [setTrades]);

  const closeTrade = useCallback((id: string, exit: number) => {
    setTrades(prev => prev.map(t => {
      if (t.id !== id) return t;
      const direction = t.side === 'long' ? 1 : -1;
      const pnl = (exit - t.entry) * t.size * direction;
      return { ...t, exit, pnl, status: 'closed' as const, closed_at: new Date().toISOString() };
    }));
  }, [setTrades]);

  const removeTrade = useCallback((id: string) => {
    setTrades(prev => prev.filter(t => t.id !== id));
  }, [setTrades]);

  // Stats
  const closed = trades.filter(t => t.status === 'closed' && t.pnl !== null);
  const wins = closed.filter(t => (t.pnl || 0) > 0).length;
  const losses = closed.filter(t => (t.pnl || 0) <= 0).length;
  const winrate = closed.length > 0 ? (wins / closed.length) * 100 : 0;
  const totalPnl = closed.reduce((s, t) => s + (t.pnl || 0), 0);

  return { trades, addTrade, closeTrade, removeTrade, stats: { wins, losses, winrate, totalPnl, totalClosed: closed.length } };
}

// ─── PRICE ALERTS ───────────────────────────
export interface PriceAlert {
  id: string;
  symbol: string; // BTCUSDT
  display: string; // BTC
  direction: 'above' | 'below';
  target_price: number;
  triggered: boolean;
  created_at: string;
  triggered_at: string | null;
}

export function usePriceAlerts() {
  const [alerts, setAlerts] = useLSState<PriceAlert[]>('analysis:alerts', []);

  const add = useCallback((symbol: string, display: string, direction: 'above' | 'below', target_price: number) => {
    const a: PriceAlert = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      symbol, display, direction, target_price,
      triggered: false,
      created_at: new Date().toISOString(),
      triggered_at: null,
    };
    setAlerts(prev => [a, ...prev].slice(0, 50));
  }, [setAlerts]);

  const remove = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, [setAlerts]);

  const trigger = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, triggered: true, triggered_at: new Date().toISOString() } : a));
  }, [setAlerts]);

  const reset = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, triggered: false, triggered_at: null } : a));
  }, [setAlerts]);

  return { alerts, add, remove, trigger, reset };
}

// Browser notifications helper
export async function ensureNotificationPermission(): Promise<boolean> {
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const r = await Notification.requestPermission();
  return r === 'granted';
}

export function fireNotification(title: string, body: string) {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon: '/favicon.ico' });
    } catch { /* ignore */ }
  }
}
