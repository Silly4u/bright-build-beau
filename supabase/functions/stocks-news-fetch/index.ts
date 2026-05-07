import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const TICKERS = [
  "NVDA","TSLA","AAPL","MSFT","GOOGL","AMZN","META","NFLX","AVGO","TSM",
  "ORCL","PLTR","COIN","HOOD","MSTR","BABA","PYPL","INTC","AMD","CRCL","SNDK",
];

interface FinnhubNews {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

async function fetchCompanyNews(ticker: string, apiKey: string, fromDays = 3): Promise<FinnhubNews[]> {
  const to = new Date();
  const from = new Date(Date.now() - fromDays * 86400000);
  const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fmtDate(from)}&to=${fmtDate(to)}&token=${apiKey}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Finnhub ${ticker} -> ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(`Finnhub ${ticker} fetch error:`, e);
    return [];
  }
}

async function aiTranslate(items: { ticker: string; title: string; summary: string }[]): Promise<{ title: string; summary: string }[]> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY || items.length === 0) return items.map(i => ({ title: i.title, summary: i.summary }));

  const prompt = `Bạn là biên tập viên tài chính. Dịch và viết lại các tin tức cổ phiếu Mỹ sang TIẾNG VIỆT chuyên nghiệp, ngắn gọn, hấp dẫn nhà đầu tư Việt. Giữ nguyên tên công ty, ticker, số liệu. Trả về JSON ARRAY chính xác cùng số phần tử input, mỗi phần tử có { "title": string (tiếng Việt, <100 ký tự), "summary": string (tiếng Việt, 2-3 câu) }.

Input:
${JSON.stringify(items, null, 2)}`;

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Bạn dịch tin tức tài chính. Trả về JSON hợp lệ duy nhất, không markdown." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!res.ok) {
      console.error("AI translate failed:", res.status, await res.text());
      return items.map(i => ({ title: i.title, summary: i.summary }));
    }
    const json = await res.json();
    const content = json.choices?.[0]?.message?.content || "[]";
    const parsed = JSON.parse(content);
    const arr = Array.isArray(parsed) ? parsed : (parsed.items || parsed.results || parsed.data || []);
    return items.map((orig, i) => ({
      title: arr[i]?.title || orig.title,
      summary: arr[i]?.summary || orig.summary,
    }));
  } catch (e) {
    console.error("AI translate error:", e);
    return items.map(i => ({ title: i.title, summary: i.summary }));
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const FINNHUB_API_KEY = Deno.env.get("FINNHUB_API_KEY");
    if (!FINNHUB_API_KEY) throw new Error("FINNHUB_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1) Fetch company news for each ticker (parallel, up to 5 articles each)
    const all: { ticker: string; n: FinnhubNews }[] = [];
    const results = await Promise.all(TICKERS.map(t => fetchCompanyNews(t, FINNHUB_API_KEY)));
    results.forEach((arr, i) => {
      const ticker = TICKERS[i];
      arr.slice(0, 5).forEach(n => all.push({ ticker, n }));
    });

    if (all.length === 0) {
      return new Response(JSON.stringify({ inserted: 0, message: "No news from Finnhub" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2) Dedup against existing external_ids
    const externalIds = all.map(x => `${x.ticker}:${x.n.id}`);
    const { data: existing } = await sb
      .from("stock_news")
      .select("symbol, external_id")
      .in("external_id", externalIds);
    const existSet = new Set((existing || []).map((r: any) => `${r.symbol}:${r.external_id}`));

    const fresh = all.filter(x => !existSet.has(`${x.ticker}:${x.n.id}`));
    if (fresh.length === 0) {
      return new Response(JSON.stringify({ inserted: 0, message: "All news already exist" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3) Pick top 10 most recent for AI translation, rest stay English
    fresh.sort((a, b) => b.n.datetime - a.n.datetime);
    const top10 = fresh.slice(0, 10);
    const rest = fresh.slice(10);

    const translated = await aiTranslate(top10.map(x => ({
      ticker: x.ticker,
      title: x.n.headline,
      summary: x.n.summary,
    })));

    // 4) Build rows
    const rows = [
      ...top10.map((x, i) => ({
        symbol: x.ticker,
        title: translated[i].title,
        original_title: x.n.headline,
        summary: translated[i].summary,
        full_content: x.n.summary,
        source: x.n.source || "Finnhub",
        url: x.n.url,
        image_url: x.n.image || null,
        published_at: new Date(x.n.datetime * 1000).toISOString(),
        ai_translated: true,
        external_id: String(x.n.id),
      })),
      ...rest.map(x => ({
        symbol: x.ticker,
        title: x.n.headline,
        original_title: x.n.headline,
        summary: x.n.summary,
        full_content: x.n.summary,
        source: x.n.source || "Finnhub",
        url: x.n.url,
        image_url: x.n.image || null,
        published_at: new Date(x.n.datetime * 1000).toISOString(),
        ai_translated: false,
        external_id: String(x.n.id),
      })),
    ];

    const { error } = await sb.from("stock_news").insert(rows);
    if (error) throw error;

    return new Response(JSON.stringify({
      inserted: rows.length,
      ai_translated: top10.length,
      english_only: rest.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("stocks-news-fetch error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
