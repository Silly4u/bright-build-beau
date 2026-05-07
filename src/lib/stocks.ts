// Stock perpetuals tracked on Bitunix futures
export interface StockMeta {
  symbol: string;       // Bitunix symbol e.g. NVDAUSDT
  ticker: string;       // Stock ticker e.g. NVDA
  name: string;         // Company name
  sector: string;
  tvSymbol: string;     // TradingView symbol e.g. NASDAQ:NVDA
}

export const STOCKS: StockMeta[] = [
  { symbol: 'NVDAUSDT',  ticker: 'NVDA',  name: 'NVIDIA',           sector: 'Semiconductors', tvSymbol: 'NASDAQ:NVDA' },
  { symbol: 'TSLAUSDT',  ticker: 'TSLA',  name: 'Tesla',            sector: 'EV / Auto',      tvSymbol: 'NASDAQ:TSLA' },
  { symbol: 'AAPLUSDT',  ticker: 'AAPL',  name: 'Apple',            sector: 'Consumer Tech',  tvSymbol: 'NASDAQ:AAPL' },
  { symbol: 'MSFTUSDT',  ticker: 'MSFT',  name: 'Microsoft',        sector: 'Software / AI',  tvSymbol: 'NASDAQ:MSFT' },
  { symbol: 'GOOGLUSDT', ticker: 'GOOGL', name: 'Alphabet',         sector: 'Internet / AI',  tvSymbol: 'NASDAQ:GOOGL' },
  { symbol: 'AMZNUSDT',  ticker: 'AMZN',  name: 'Amazon',           sector: 'E-commerce / Cloud', tvSymbol: 'NASDAQ:AMZN' },
  { symbol: 'METAUSDT',  ticker: 'META',  name: 'Meta Platforms',   sector: 'Social / AI',    tvSymbol: 'NASDAQ:META' },
  { symbol: 'NFLXUSDT',  ticker: 'NFLX',  name: 'Netflix',          sector: 'Streaming',      tvSymbol: 'NASDAQ:NFLX' },
  { symbol: 'AVGOUSDT',  ticker: 'AVGO',  name: 'Broadcom',         sector: 'Semiconductors', tvSymbol: 'NASDAQ:AVGO' },
  { symbol: 'TSMUSDT',   ticker: 'TSM',   name: 'TSMC',             sector: 'Semiconductors', tvSymbol: 'NYSE:TSM' },
  { symbol: 'ORCLUSDT',  ticker: 'ORCL',  name: 'Oracle',           sector: 'Cloud / DB',     tvSymbol: 'NYSE:ORCL' },
  { symbol: 'PLTRUSDT',  ticker: 'PLTR',  name: 'Palantir',         sector: 'AI / Defense',   tvSymbol: 'NASDAQ:PLTR' },
  { symbol: 'COINUSDT',  ticker: 'COIN',  name: 'Coinbase',         sector: 'Crypto',         tvSymbol: 'NASDAQ:COIN' },
  { symbol: 'HOODUSDT',  ticker: 'HOOD',  name: 'Robinhood',        sector: 'Fintech',        tvSymbol: 'NASDAQ:HOOD' },
  { symbol: 'MSTRUSDT',  ticker: 'MSTR',  name: 'MicroStrategy',    sector: 'BTC Treasury',   tvSymbol: 'NASDAQ:MSTR' },
  { symbol: 'BABAUSDT',  ticker: 'BABA',  name: 'Alibaba',          sector: 'E-commerce CN',  tvSymbol: 'NYSE:BABA' },
  { symbol: 'PYPLUSDT',  ticker: 'PYPL',  name: 'PayPal',           sector: 'Fintech',        tvSymbol: 'NASDAQ:PYPL' },
  { symbol: 'INTCUSDT',  ticker: 'INTC',  name: 'Intel',            sector: 'Semiconductors', tvSymbol: 'NASDAQ:INTC' },
  { symbol: 'AMDUSDT',   ticker: 'AMD',   name: 'AMD',              sector: 'Semiconductors', tvSymbol: 'NASDAQ:AMD' },
  { symbol: 'CRCLUSDT',  ticker: 'CRCL',  name: 'Circle Internet',  sector: 'Stablecoin',     tvSymbol: 'NYSE:CRCL' },
  { symbol: 'SNDKUSDT',  ticker: 'SNDK',  name: 'SanDisk',          sector: 'Storage',        tvSymbol: 'NASDAQ:SNDK' },
];

export const STOCK_SYMBOLS = STOCKS.map(s => s.symbol);
export const STOCK_TICKERS = STOCKS.map(s => s.ticker);

export function getStockBySymbol(symbol: string): StockMeta | undefined {
  return STOCKS.find(s => s.symbol === symbol);
}
export function getStockByTicker(ticker: string): StockMeta | undefined {
  return STOCKS.find(s => s.ticker === ticker.toUpperCase());
}

// US market open: Mon-Fri, 09:30-16:00 ET (regular session)
// Returns true if regular hours, used to drive faster polling.
export function isUSMarketOpen(d: Date = new Date()): boolean {
  // Convert to ET
  const et = new Date(d.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = et.getDay(); // 0 Sun, 6 Sat
  if (day === 0 || day === 6) return false;
  const mins = et.getHours() * 60 + et.getMinutes();
  return mins >= 9 * 60 + 30 && mins < 16 * 60;
}
