import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const STOCK_SYMBOLS = new Set([
  "NVDAUSDT","TSLAUSDT","AAPLUSDT","MSFTUSDT","GOOGLUSDT","AMZNUSDT","METAUSDT",
  "NFLXUSDT","AVGOUSDT","TSMUSDT","ORCLUSDT","PLTRUSDT","COINUSDT","HOODUSDT",
  "MSTRUSDT","BABAUSDT","PYPLUSDT","INTCUSDT","AMDUSDT","CRCLUSDT","SNDKUSDT",
]);

interface BitunixTicker {
  symbol: string;
  markPrice: string;
  lastPrice: string;
  open: string;
  last: string;
  quoteVol: string;
  baseVol: string;
  high: string;
  low: string;
}

interface Quote {
  symbol: string;
  ticker: string;
  price: number;
  open: number;
  high: number;
  low: number;
  change: number;        // absolute
  changePercent: number; // %
  volume: number;        // quote volume USDT
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch("https://fapi.bitunix.com/api/v1/futures/market/tickers", {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: ctrl.signal,
    });
    clearTimeout(t);

    if (!res.ok) {
      return new Response(JSON.stringify({ error: "Bitunix upstream error", status: res.status }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await res.json();
    const data: BitunixTicker[] = Array.isArray(json?.data) ? json.data : [];

    const quotes: Quote[] = [];
    for (const t of data) {
      if (!STOCK_SYMBOLS.has(t.symbol)) continue;
      const price = parseFloat(t.lastPrice || t.markPrice || t.last || "0");
      const open = parseFloat(t.open || "0");
      const high = parseFloat(t.high || "0");
      const low = parseFloat(t.low || "0");
      const change = open > 0 ? price - open : 0;
      const changePercent = open > 0 ? (change / open) * 100 : 0;
      quotes.push({
        symbol: t.symbol,
        ticker: t.symbol.replace("USDT", ""),
        price, open, high, low, change, changePercent,
        volume: parseFloat(t.quoteVol || "0"),
      });
    }

    return new Response(JSON.stringify({ quotes, fetchedAt: new Date().toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=3" },
    });
  } catch (e) {
    console.error("stocks-quotes error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
