import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Vote {
  id: string;
  label: string;
  vote: -1 | 0 | 1;
  reason: string;
}

interface Body {
  pair: string;
  timeframe: string;
  livePrice: number;
  votes: Vote[];
  strengthScore: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const body = (await req.json()) as Body;
    if (!body.pair || !Array.isArray(body.votes)) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const voteSummary = body.votes
      .map((v) => `- ${v.label}: ${v.vote === 1 ? "BULLISH" : v.vote === -1 ? "BEARISH" : "NEUTRAL"} (${v.reason})`)
      .join("\n");

    const systemPrompt =
      "Bạn là trader chuyên nghiệp đọc nhiều chỉ báo kỹ thuật để ra quyết định. Trả lời TIẾNG VIỆT, ngắn gọn, thực dụng. Không lan man. Không lời khuyên đầu tư chung chung.";

    const userPrompt = `Cặp: ${body.pair} - ${body.timeframe}
Giá hiện tại: ${body.livePrice}
Điểm Strength tổng (-100 đến +100): ${body.strengthScore}

Các chỉ báo đang bật:
${voteSummary}

Hãy phân tích sự đồng thuận giữa các chỉ báo và đưa ra QUYẾT ĐỊNH cuối cùng.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
        tools: [
          {
            type: "function",
            function: {
              name: "confluence_decision",
              description: "Đưa ra quyết định confluence dựa trên các chỉ báo",
              parameters: {
                type: "object",
                properties: {
                  decision: { type: "string", enum: ["STRONG_BUY", "BUY", "WAIT", "SELL", "STRONG_SELL"] },
                  confidence: { type: "number", minimum: 0, maximum: 100 },
                  bias: { type: "string", enum: ["bullish", "bearish", "neutral"] },
                  summary: { type: "string", description: "Tóm tắt 1-2 câu lý do chính" },
                  pros: { type: "array", items: { type: "string" }, description: "2-4 yếu tố ủng hộ quyết định" },
                  cons: { type: "array", items: { type: "string" }, description: "1-3 rủi ro/yếu tố ngược" },
                  action: { type: "string", description: "Hành động cụ thể: vào lệnh ở đâu, chờ gì" },
                },
                required: ["decision", "confidence", "bias", "summary", "pros", "cons", "action"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "confluence_decision" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Đã vượt giới hạn AI, thử lại sau ít phút." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Hết credits AI. Liên hệ admin để nạp thêm." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway lỗi" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI không trả tool_call");
    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-confluence error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
