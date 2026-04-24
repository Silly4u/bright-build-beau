export interface BinanceTicker {
  symbol: string;
  lastPrice?: string;
  priceChangePercent?: string;
}

const EDGE_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/binance-proxy`;
const BINANCE_BASE_URL = 'https://api.binance.com/api/v3/ticker/24hr';
const CACHE_TTL_MS = 5_000;
const EDGE_COOLDOWN_MS = 5 * 60 * 1000;

const tickerCache = new Map<string, { expiresAt: number; ticker: BinanceTicker }>();
const inflightRequests = new Map<string, Promise<Record<string, BinanceTicker>>>();

let edgeDisabledUntil = 0;

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

const readCachedTickers = (symbols: string[]) => {
  const now = Date.now();

  return symbols.reduce<Record<string, BinanceTicker>>((acc, symbol) => {
    const cached = tickerCache.get(symbol);
    if (cached && cached.expiresAt > now) acc[symbol] = cached.ticker;
    return acc;
  }, {});
};

const storeCachedTickers = (tickers: Record<string, BinanceTicker>) => {
  const expiresAt = Date.now() + CACHE_TTL_MS;
  Object.entries(tickers).forEach(([symbol, ticker]) => {
    tickerCache.set(symbol, { expiresAt, ticker });
  });
};

const fetchJson = async (url: string) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  return { ok: response.ok, status: response.status, data };
};

const fetchFromEdge = async (symbols: string[]) => {
  const search = new URLSearchParams(
    symbols.length === 1
      ? { symbol: symbols[0] }
      : { symbols: JSON.stringify(symbols) }
  );

  const { ok, data } = await fetchJson(`${EDGE_BASE_URL}?${search.toString()}`);
  if (!ok || (data && typeof data === 'object' && 'fallback' in data && data.fallback)) {
    edgeDisabledUntil = Date.now() + EDGE_COOLDOWN_MS;
    return {};
  }

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

  const cachedTickers = readCachedTickers(normalizedSymbols);
  const missingCachedSymbols = normalizedSymbols.filter((symbol) => !cachedTickers[symbol]);

  if (missingCachedSymbols.length === 0) return cachedTickers;

  const requestKey = missingCachedSymbols.join(',');
  const existingRequest = inflightRequests.get(requestKey);
  if (existingRequest) {
    const inflightTickers = await existingRequest;
    return { ...cachedTickers, ...inflightTickers };
  }

  const request = (async () => {
    const directTickers = await fetchFromBinance(missingCachedSymbols).catch(() => ({}));
    const missingDirectSymbols = missingCachedSymbols.filter((symbol) => !directTickers[symbol]);

    if (missingDirectSymbols.length === 0) {
      storeCachedTickers(directTickers);
      return directTickers;
    }

    const canUseEdge = Date.now() >= edgeDisabledUntil;
    const edgeTickers = canUseEdge ? await fetchFromEdge(missingDirectSymbols).catch(() => {
      edgeDisabledUntil = Date.now() + EDGE_COOLDOWN_MS;
      return {};
    }) : {};

    const merged = { ...directTickers, ...edgeTickers };
    storeCachedTickers(merged);
    return merged;
  })();

  inflightRequests.set(requestKey, request);

  const fetchedTickers = await request.finally(() => {
    inflightRequests.delete(requestKey);
  });

  const mergedTickers = { ...cachedTickers, ...fetchedTickers };
  const missingSymbols = normalizedSymbols.filter((symbol) => !mergedTickers[symbol]);

  if (missingSymbols.length === 0) return mergedTickers;

  return mergedTickers;
};

export const fetchBinanceTicker = async (symbol: string) => {
  const normalizedSymbol = symbol.trim().toUpperCase();
  const tickers = await fetchBinanceTickers([normalizedSymbol]);
  return tickers[normalizedSymbol] ?? null;
};