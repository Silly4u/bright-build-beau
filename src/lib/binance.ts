export interface BinanceTicker {
  symbol: string;
  lastPrice?: string;
  priceChangePercent?: string;
}

const EDGE_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/binance-proxy`;
const BINANCE_BASE_URL = 'https://api.binance.com/api/v3/ticker/24hr';

const normalizeSymbols = (symbols: string[]) =>
  [...new Set(symbols.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean))];

const isTicker = (value: unknown): value is BinanceTicker =>
  typeof value === 'object' && value !== null && typeof (value as { symbol?: unknown }).symbol === 'string';

const toTickerMap = (payload: unknown, expectedSymbols: string[]) => {
  const items = Array.isArray(payload) ? payload.filter(isTicker) : isTicker(payload) ? [payload] : [];

  return expectedSymbols.reduce<Record<string, BinanceTicker>>((acc, symbol) => {
    const match = items.find((item) => item.symbol === symbol && typeof item.lastPrice === 'string');
    if (match) acc[symbol] = match;
    return acc;
  }, {});
};

const fetchJson = async (url: string) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  return { ok: response.ok, data };
};

const fetchFromEdge = async (symbols: string[]) => {
  const search = new URLSearchParams(
    symbols.length === 1
      ? { symbol: symbols[0] }
      : { symbols: JSON.stringify(symbols) }
  );

  const { ok, data } = await fetchJson(`${EDGE_BASE_URL}?${search.toString()}`);
  if (!ok || (data && typeof data === 'object' && 'fallback' in data && data.fallback)) return {};

  return toTickerMap(data, symbols);
};

const fetchFromBinance = async (symbols: string[]) => {
  const search = new URLSearchParams(
    symbols.length === 1
      ? { symbol: symbols[0] }
      : { symbols: JSON.stringify(symbols) }
  );

  const { ok, data } = await fetchJson(`${BINANCE_BASE_URL}?${search.toString()}`);
  if (!ok) return {};

  return toTickerMap(data, symbols);
};

export const fetchBinanceTickers = async (symbols: string[]) => {
  const normalizedSymbols = normalizeSymbols(symbols);
  if (normalizedSymbols.length === 0) return {};

  const edgeTickers = await fetchFromEdge(normalizedSymbols).catch(() => ({}));
  const missingSymbols = normalizedSymbols.filter((symbol) => !edgeTickers[symbol]);

  if (missingSymbols.length === 0) return edgeTickers;

  const fallbackTickers = await fetchFromBinance(missingSymbols).catch(() => ({}));
  return { ...edgeTickers, ...fallbackTickers };
};

export const fetchBinanceTicker = async (symbol: string) => {
  const normalizedSymbol = symbol.trim().toUpperCase();
  const tickers = await fetchBinanceTickers([normalizedSymbol]);
  return tickers[normalizedSymbol] ?? null;
};