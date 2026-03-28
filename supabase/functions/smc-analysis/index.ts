import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Mày là một chuyên gia giao dịch theo phương pháp Smart Money Concepts (SMC), chuyên săn thanh khoản (Liquidity Hunting) và giao dịch theo mô hình Turtle Soup.

Nhiệm vụ phân tích và trích xuất tọa độ:

1. Vùng Thanh Khoản (Liquidity Zones): Xác định 1 vùng thanh khoản bên mua (Buyside Liquidity - đỉnh cũ quan trọng) và 1 vùng thanh khoản bên bán (Sellside Liquidity - đáy cũ quan trọng). Trả về tọa độ vẽ Box.

2. Tín hiệu Entry (Turtle Soup & MSS): Kiểm tra xem giá có quét qua vùng thanh khoản nào chưa (Sweep) và có sự phá vỡ cấu trúc (MSS) để xác nhận vào lệnh không. Nếu có, hãy trả về tọa độ Entry, nếu không thì has_signal = false.

3. Mức TP / SL: Nếu có tín hiệu Entry, hãy tính toán 3 mức chốt lời (TP1, TP2, TP3) và 1 mức Stop Loss theo tỷ lệ R:R hợp lý.

4. 3 Điểm hành động: Đưa ra "3 điểm hành động" cực kỳ ngắn gọn (dưới 15 từ mỗi ý) dành cho Trader F0.

KHÔNG ĐƯỢC GIẢI THÍCH, KHÔNG CHỨA ĐỊNH DẠNG MARKDOWN. Chỉ trả về duy nhất một chuỗi JSON.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { candles, symbol, timeframe } = await req.json();

    if (!candles || !Array.isArray(candles) || candles.length < 20) {
      return new Response(
        JSON.stringify({ error: "Cần ít nhất 20 nến OHLC" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Take last 100 candles for analysis
    const recentCandles = candles.slice(-100).map((c: any) => ({
      time: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume,
    }));

    const userPrompt = `Dữ liệu đầu vào: ${symbol || "BTC/USDT"} khung ${timeframe || "H4"}.
Dưới đây là mảng dữ liệu ${recentCandles.length} nến OHLC:
${JSON.stringify(recentCandles)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "smc_analysis",
              description: "Return SMC liquidity analysis with zones, trade signal, and action points",
              parameters: {
                type: "object",
                properties: {
                  liquidity_boxes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["Buyside", "Sellside"] },
                        start_time: { type: "number", description: "Unix timestamp ms" },
                        end_time: { type: "number", description: "Unix timestamp ms" },
                        top_price: { type: "number" },
                        bottom_price: { type: "number" },
                      },
                      required: ["type", "start_time", "end_time", "top_price", "bottom_price"],
                    },
                  },
                  trade_signal: {
                    type: "object",
                    properties: {
                      has_signal: { type: "boolean" },
                      type: { type: "string", enum: ["Long", "Short"] },
                      entry_time: { type: "number", description: "Unix timestamp ms" },
                      entry_price: { type: "number" },
                      TP1: { type: "number" },
                      TP2: { type: "number" },
                      TP3: { type: "number" },
                      SL: { type: "number" },
                    },
                    required: ["has_signal"],
                  },
                  action_points: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 3,
                  },
                },
                required: ["liquidity_boxes", "trade_signal", "action_points"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "smc_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI rate limit exceeded, vui lòng thử lại sau." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Hết credits AI, vui lòng nạp thêm." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();

    // Extract tool call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("No tool call in AI response");
    }

    let analysis;
    try {
      analysis = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error("Failed to parse AI analysis JSON");
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("smc-analysis error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
