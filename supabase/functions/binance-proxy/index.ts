import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-symbol, x-symbols, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const isValidSymbol = (value: string) => /^[A-Z0-9]{2,20}$/.test(value);

const parseSymbols = (value: string) => {
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > 20) {
    throw new Error("'symbols' must be a JSON array with 1-20 items");
  }
  const normalized = parsed.map((s) => String(s).trim().toUpperCase());
  if (!normalized.every(isValidSymbol)) throw new Error("Invalid symbol in 'symbols'");
  return normalized;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const symbols = url.searchParams.get("symbols") ?? req.headers.get("x-symbols"); // e.g. ["BTCUSDT","XAUUSDT"]
    const symbol = url.searchParams.get("symbol") ?? req.headers.get("x-symbol");   // single symbol

    let binanceUrl: string;
    if (symbols) {
      const normalized = parseSymbols(symbols);
      binanceUrl = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(JSON.stringify(normalized))}`;
    } else if (symbol) {
      const normalized = symbol.trim().toUpperCase();
      if (!isValidSymbol(normalized)) throw new Error("Invalid 'symbol' param");
      binanceUrl = `https://api.binance.com/api/v3/ticker/24hr?symbol=${encodeURIComponent(normalized)}`;
    } else {
      return new Response(JSON.stringify({ error: "Missing 'symbols' or 'symbol' param" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(binanceUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text();
      console.error("Binance API error:", res.status, text);
      return new Response(JSON.stringify({ error: "Binance API error", status: res.status }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=5" },
    });
  } catch (e) {
    console.error("binance-proxy error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
