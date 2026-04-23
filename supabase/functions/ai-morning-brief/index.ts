import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function fetchPrice(symbol: string) {
  try {
    const r = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

async function fetchFng() {
  try {
    const r = await fetch("https://api.alternative.me/fng/?limit=1");
    if (!r.ok) return null;
    const data = await r.json();
    return data.data?.[0] || null;
  } catch { return null; }
}

async function fetchGlobal() {
  try {
    const r = await fetch("https://api.coingecko.com/api/v3/global");
    if (!r.ok) return null;
    return (await r.json()).data || null;
  } catch { return null; }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().slice(0, 10);

    // If brief already exists for today and not forced, return cached
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "1";

    if (!force) {
      const { data: existing } = await supabase
        .from("morning_briefs")
        .select("*")
        .eq("brief_date", today)
        .maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ brief: existing, cached: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Gather market data
    const [btc, eth, fng, global] = await Promise.all([
      fetchPrice("BTCUSDT"),
      fetchPrice("ETHUSDT"),
      fetchFng(),
      fetchGlobal(),
    ]);

    const marketSnapshot = {
      btc: btc ? { price: parseFloat(btc.lastPrice), change: parseFloat(btc.priceChangePercent), volume: parseFloat(btc.quoteVolume) } : null,
      eth: eth ? { price: parseFloat(eth.lastPrice), change: parseFloat(eth.priceChangePercent) } : null,
      fng: fng ? { value: parseInt(fng.value), classification: fng.value_classification } : null,
      btc_dominance: global?.market_cap_percentage?.btc || null,
      total_mcap_change: global?.market_cap_change_percentage_24h_usd || null,
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not set");

    const systemPrompt = `Bạn là trader chuyên nghiệp viết Morning Brief tiếng Việt cho cộng đồng trader BTC/Vàng. 
Văn phong: súc tích, chuyên nghiệp, có hành động cụ thể.
KHÔNG dùng từ ngữ chung chung như "có thể tăng hoặc giảm". Phải có quan điểm rõ.`;

    const userPrompt = `Dữ liệu thị trường ngày ${today}:
- BTC: $${marketSnapshot.btc?.price.toFixed(0) || 'N/A'} (${marketSnapshot.btc?.change.toFixed(2) || 0}% / 24h), Vol: $${((marketSnapshot.btc?.volume || 0) / 1e9).toFixed(1)}B
- ETH: $${marketSnapshot.eth?.price.toFixed(0) || 'N/A'} (${marketSnapshot.eth?.change.toFixed(2) || 0}% / 24h)
- BTC.D: ${marketSnapshot.btc_dominance?.toFixed(1) || 'N/A'}%
- Total MCap Change 24h: ${marketSnapshot.total_mcap_change?.toFixed(2) || 'N/A'}%
- Fear & Greed: ${marketSnapshot.fng?.value || 'N/A'}/100 (${marketSnapshot.fng?.classification || ''})

Sinh JSON với 3 phần:
1. recap: 3-4 dòng tóm tắt diễn biến 24h qua (thực tế đã xảy ra)
2. outlook: 3-4 dòng dự báo 24h tới (kèm vùng giá quan trọng)
3. scenarios: mảng 3 kịch bản giao dịch BTC, mỗi kịch bản gồm:
   - title (BULL/BEAR/NEUTRAL kèm 1 câu mô tả)
   - condition (điều kiện kích hoạt - có vùng giá cụ thể)
   - entry (vùng entry)
   - target (mục tiêu)
   - stop (stop loss)
   - probability (xác suất % theo đánh giá)`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "morning_brief",
            description: "Generate morning trading brief",
            parameters: {
              type: "object",
              properties: {
                recap: { type: "string", description: "Recap of last 24h, 3-4 lines" },
                outlook: { type: "string", description: "Outlook for next 24h, 3-4 lines" },
                scenarios: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      condition: { type: "string" },
                      entry: { type: "string" },
                      target: { type: "string" },
                      stop: { type: "string" },
                      probability: { type: "number" },
                    },
                    required: ["title", "condition", "entry", "target", "stop", "probability"],
                  },
                },
              },
              required: ["recap", "outlook", "scenarios"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "morning_brief" } },
      }),
    });

    if (!aiResponse.ok) {
      const txt = await aiResponse.text();
      console.error("AI error:", aiResponse.status, txt);
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "rate_limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "credit_required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call returned");
    const parsed = JSON.parse(toolCall.function.arguments);

    // Upsert into DB
    const { data: saved, error: upsertErr } = await supabase
      .from("morning_briefs")
      .upsert({
        brief_date: today,
        recap: parsed.recap,
        outlook: parsed.outlook,
        scenarios: parsed.scenarios,
        market_data: marketSnapshot,
      }, { onConflict: "brief_date" })
      .select()
      .single();

    if (upsertErr) throw upsertErr;

    return new Response(JSON.stringify({ brief: saved, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("morning-brief error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
