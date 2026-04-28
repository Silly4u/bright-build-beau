import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type Candle = { time: number; open: number; high: number; low: number; close: number; volume: number };

// ── Fetch klines from Binance (BTC) ──
async function fetchBinanceKlines(symbol: string, interval: string, limit = 200): Promise<Candle[]> {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Binance ${symbol} ${interval}: ${res.status}`);
  const raw = await res.json();
  return raw.map((k: any[]) => ({
    time: Math.floor(k[0] / 1000),
    open: +k[1], high: +k[2], low: +k[3], close: +k[4], volume: +k[5],
  }));
}

// ── Fetch XAU/USD from FCS API via Finnhub fallback (or Twelve Data style) ──
// We reuse the existing dxy-proxy pattern: try Yahoo Finance for XAU=X
async function fetchYahooKlines(yahooSymbol: string, interval: string, range: string): Promise<Candle[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=${interval}&range=${range}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Yahoo ${yahooSymbol}: ${res.status}`);
  const j = await res.json();
  const result = j?.chart?.result?.[0];
  if (!result) throw new Error("Yahoo: no result");
  const ts: number[] = result.timestamp ?? [];
  const q = result.indicators.quote[0];
  const candles: Candle[] = [];
  for (let i = 0; i < ts.length; i++) {
    if (q.open[i] == null || q.close[i] == null) continue;
    candles.push({
      time: ts[i],
      open: q.open[i], high: q.high[i], low: q.low[i], close: q.close[i], volume: q.volume[i] ?? 0,
    });
  }
  return candles;
}

// ── Compute simple support/resistance from recent candles ──
function computeZones(candles: Candle[]) {
  if (candles.length < 50) return { support: 0, resistance: 0 };
  const recent = candles.slice(-100);
  const highs = recent.map(c => c.high).sort((a, b) => b - a);
  const lows = recent.map(c => c.low).sort((a, b) => a - b);
  // Use 90th/10th percentile to avoid spikes
  const resistance = highs[Math.floor(highs.length * 0.1)];
  const support = lows[Math.floor(lows.length * 0.1)];
  return { support, resistance };
}

// ── Compute previous-week Fibonacci levels ──
function computePrevWeekFib(daily: Candle[]) {
  if (daily.length < 14) return null;
  // Group last ~14 days, find previous ISO week (Mon-Sun) in UTC
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun..6=Sat
  const diffToMon = (day + 6) % 7; // days since Monday
  const thisMonday = new Date(now);
  thisMonday.setUTCHours(0, 0, 0, 0);
  thisMonday.setUTCDate(thisMonday.getUTCDate() - diffToMon);
  const prevMonday = new Date(thisMonday);
  prevMonday.setUTCDate(prevMonday.getUTCDate() - 7);
  const prevSundayEnd = new Date(thisMonday);
  prevSundayEnd.setUTCSeconds(-1);

  const startSec = Math.floor(prevMonday.getTime() / 1000);
  const endSec = Math.floor(prevSundayEnd.getTime() / 1000);
  const weekCandles = daily.filter(c => c.time >= startSec && c.time <= endSec);
  if (weekCandles.length === 0) return null;

  const high = Math.max(...weekCandles.map(c => c.high));
  const low = Math.min(...weekCandles.map(c => c.low));
  const range = high - low;
  return {
    high, low,
    fib_236: high - range * 0.236,
    fib_382: high - range * 0.382,
    fib_500: high - range * 0.500,
    fib_618: high - range * 0.618,
    fib_786: high - range * 0.786,
  };
}

// ── Compute trendline slope from pivots (simple) ──
function computeTrendlineSummary(candles: Candle[]) {
  if (candles.length < 30) return null;
  const recent = candles.slice(-60);
  const firstClose = recent[0].close;
  const lastClose = recent[recent.length - 1].close;
  const slope = ((lastClose - firstClose) / firstClose) * 100;
  // pivot lows for support trendline direction
  const pivotLows: number[] = [];
  const pivotHighs: number[] = [];
  for (let i = 3; i < recent.length - 3; i++) {
    const c = recent[i];
    if (recent.slice(i - 3, i).every(x => x.low > c.low) && recent.slice(i + 1, i + 4).every(x => x.low > c.low)) pivotLows.push(c.low);
    if (recent.slice(i - 3, i).every(x => x.high < c.high) && recent.slice(i + 1, i + 4).every(x => x.high < c.high)) pivotHighs.push(c.high);
  }
  const lowTrend = pivotLows.length >= 2 ? (pivotLows[pivotLows.length - 1] - pivotLows[0]) / pivotLows[0] * 100 : 0;
  const highTrend = pivotHighs.length >= 2 ? (pivotHighs[pivotHighs.length - 1] - pivotHighs[0]) / pivotHighs[0] * 100 : 0;
  let pattern = "Đi ngang";
  if (lowTrend > 0.5 && highTrend > 0.5) pattern = "Uptrend (đáy + đỉnh nâng dần)";
  else if (lowTrend < -0.5 && highTrend < -0.5) pattern = "Downtrend (đáy + đỉnh giảm dần)";
  else if (lowTrend > 0 && highTrend < 0) pattern = "Tam giác hội tụ (siết)";
  else if (lowTrend < 0 && highTrend > 0) pattern = "Tam giác mở rộng (broadening)";
  return { slope_pct: +slope.toFixed(2), pattern, pivot_lows: pivotLows.length, pivot_highs: pivotHighs.length };
}

// ── Compute RSI(14) ──
function computeRSI(candles: Candle[], period = 14): number | null {
  if (candles.length < period + 1) return null;
  const closes = candles.map(c => c.close);
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(diff, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-diff, 0)) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return +(100 - 100 / (1 + rs)).toFixed(2);
}

// ── Build asset analysis bundle ──
async function buildAssetBundle(asset: "BTC" | "XAU") {
  const useBinance = asset === "BTC";
  const symbol = useBinance ? "BTCUSDT" : null;
  const yahoo = asset === "XAU" ? "GC=F" : null; // Gold futures

  const [h4, daily] = useBinance
    ? await Promise.all([
        fetchBinanceKlines(symbol!, "4h", 200),
        fetchBinanceKlines(symbol!, "1d", 60),
      ])
    : await Promise.all([
        fetchYahooKlines(yahoo!, "1h", "60d").then(c => c.slice(-200)),
        fetchYahooKlines(yahoo!, "1d", "60d").then(c => c.slice(-60)),
      ]);

  const last = h4[h4.length - 1];
  const lastDaily = daily[daily.length - 1];
  const prevDaily = daily[daily.length - 2];
  const change24h = prevDaily ? ((lastDaily.close - prevDaily.close) / prevDaily.close) * 100 : 0;

  const zones = computeZones(h4);
  const fib = computePrevWeekFib(daily);
  const trendline = computeTrendlineSummary(h4);
  const rsi = computeRSI(h4);

  // Naive entry/TP/SL
  const range = zones.resistance - zones.support;
  const entry = last.close;
  const isUp = trendline?.pattern.includes("Uptrend");
  const target = isUp ? zones.resistance : zones.support;
  const stopLoss = isUp ? entry - range * 0.3 : entry + range * 0.3;

  return {
    asset,
    price: +last.close.toFixed(2),
    change_24h_pct: +change24h.toFixed(2),
    support: +zones.support.toFixed(2),
    resistance: +zones.resistance.toFixed(2),
    entry: +entry.toFixed(2),
    target: +target.toFixed(2),
    stop_loss: +stopLoss.toFixed(2),
    rsi,
    trendline,
    fibonacci: fib ? {
      week_high: +fib.high.toFixed(2),
      week_low: +fib.low.toFixed(2),
      fib_236: +fib.fib_236.toFixed(2),
      fib_382: +fib.fib_382.toFixed(2),
      fib_500: +fib.fib_500.toFixed(2),
      fib_618: +fib.fib_618.toFixed(2),
      fib_786: +fib.fib_786.toFixed(2),
    } : null,
  };
}

// ── Fetch DXY ──
async function fetchDXY() {
  try {
    const candles = await fetchYahooKlines("DX-Y.NYB", "1d", "5d");
    if (candles.length < 2) return null;
    const last = candles[candles.length - 1];
    const prev = candles[candles.length - 2];
    return {
      value: +last.close.toFixed(2),
      change_pct: +(((last.close - prev.close) / prev.close) * 100).toFixed(2),
    };
  } catch { return null; }
}

const SYSTEM_PROMPT = `Bạn là chuyên gia phân tích kỹ thuật chuyên nghiệp, viết nhận định thị trường mỗi sáng bằng tiếng Việt.

Yêu cầu:
- Viết 180-250 từ, phong cách bản tin sáng cho trader
- Cấu trúc rõ ràng: Tổng quan xu hướng → Mức Fibonacci & vùng giá then chốt → Tín hiệu trendline & RSI → Kịch bản giao dịch (long/short) → Cảnh báo
- Nêu cụ thể các con số (giá, fib levels, support/resistance, entry, TP, SL)
- Tham chiếu mức Fibonacci tuần trước khi phân tích vùng phản ứng
- Nhận xét hình thái trendline (uptrend/downtrend/tam giác/đi ngang)
- Ngôn ngữ tự tin, súc tích, không vòng vo
- KHÔNG dùng markdown heading, dùng emoji điểm tin (📊 📈 📉 🎯 ⚠️)
- Chia đoạn rõ ràng, dễ đọc trên mobile`;

function buildPrompt(bundle: any, dxy: any) {
  const isGold = bundle.asset === "XAU";
  const name = isGold ? "Vàng (XAU/USD)" : "Bitcoin (BTC/USDT)";
  const fib = bundle.fibonacci;
  const tl = bundle.trendline;
  return `Viết bản tin nhận định sáng cho ${name} — ${new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}.

DỮ LIỆU KỸ THUẬT (khung H4):
• Giá hiện tại: $${bundle.price} (${bundle.change_24h_pct >= 0 ? "+" : ""}${bundle.change_24h_pct}% 24h)
• Hỗ trợ gần: $${bundle.support} | Kháng cự gần: $${bundle.resistance}
• RSI(14): ${bundle.rsi ?? "N/A"}
• Trendline: ${tl ? `${tl.pattern} | độ dốc ${tl.slope_pct}% | ${tl.pivot_lows} pivot đáy, ${tl.pivot_highs} pivot đỉnh` : "không đủ dữ liệu"}

FIBONACCI TUẦN TRƯỚC:
${fib ? `• High tuần: $${fib.week_high} — Low tuần: $${fib.week_low}
• Fib 0.236: $${fib.fib_236}
• Fib 0.382: $${fib.fib_382}
• Fib 0.500: $${fib.fib_500}
• Fib 0.618: $${fib.fib_618} ← vùng vàng
• Fib 0.786: $${fib.fib_786}` : "Không đủ dữ liệu"}

KẾ HOẠCH ĐỀ XUẤT:
• Entry: $${bundle.entry} | Target: $${bundle.target} | Stop Loss: $${bundle.stop_loss}

BỐI CẢNH VĨ MÔ:
• DXY: ${dxy ? `${dxy.value} (${dxy.change_pct >= 0 ? "+" : ""}${dxy.change_pct}%)` : "N/A"}

Yêu cầu phân tích: Liên hệ giá hiện tại với các mức Fibonacci (đang ở vùng nào?), nhận xét trendline (đã breakout chưa, hay đang test?), kết hợp RSI để đánh giá động lượng, đưa ra 1-2 kịch bản entry kèm điều kiện kích hoạt cụ thể.`;
}

async function generateCommentary(apiKey: string, bundle: any, dxy: any): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n${buildPrompt(bundle, dxy)}` }] }],
        generationConfig: { temperature: 0.5 },
      }),
    }
  );
  if (!res.ok) {
    if (res.status === 429) throw new Error("rate_limited");
    const txt = await res.text();
    console.error("Gemini error:", res.status, txt);
    throw new Error(`Gemini ${res.status}`);
  }
  const j = await res.json();
  return j?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log("[daily-commentary] Starting morning analysis…");

    // Fetch all in parallel
    const [btcBundle, xauBundle, dxy] = await Promise.all([
      buildAssetBundle("BTC").catch(e => { console.error("BTC bundle failed:", e); return null; }),
      buildAssetBundle("XAU").catch(e => { console.error("XAU bundle failed:", e); return null; }),
      fetchDXY(),
    ]);

    console.log("[daily-commentary] Bundles ready. BTC:", !!btcBundle, "XAU:", !!xauBundle, "DXY:", !!dxy);

    const [btcCommentary, xauCommentary] = await Promise.all([
      btcBundle ? generateCommentary(GEMINI_API_KEY, btcBundle, dxy) : Promise.resolve(""),
      xauBundle ? generateCommentary(GEMINI_API_KEY, xauBundle, dxy) : Promise.resolve(""),
    ]);

    const today = new Date().toISOString().slice(0, 10);
    const upserts = [];
    if (btcCommentary && btcBundle) {
      upserts.push(sb.from("market_commentaries").upsert({
        asset: "BTC",
        commentary_date: today,
        commentary: btcCommentary,
        market_data: { ...btcBundle, dxy },
      }, { onConflict: "asset,commentary_date" }));
    }
    if (xauCommentary && xauBundle) {
      upserts.push(sb.from("market_commentaries").upsert({
        asset: "XAU",
        commentary_date: today,
        commentary: xauCommentary,
        market_data: { ...xauBundle, dxy },
      }, { onConflict: "asset,commentary_date" }));
    }
    await Promise.all(upserts);

    console.log("[daily-commentary] Done. Saved", upserts.length, "commentaries");

    return new Response(JSON.stringify({
      success: true,
      date: today,
      btc: btcBundle ? { commentary: btcCommentary, data: btcBundle } : null,
      xau: xauBundle ? { commentary: xauCommentary, data: xauBundle } : null,
      dxy,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("daily-market-commentary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
