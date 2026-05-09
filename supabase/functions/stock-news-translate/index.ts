import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { id } = await req.json();
    if (!id) throw new Error("Missing id");

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: row, error: fetchErr } = await sb
      .from("stock_news")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (fetchErr) throw fetchErr;
    if (!row) throw new Error("Not found");

    // Already translated → return as is
    if (row.ai_translated) {
      return new Response(JSON.stringify({ article: row, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `Bạn là biên tập viên tài chính chuyên nghiệp. Dịch tin tức cổ phiếu Mỹ sau sang TIẾNG VIỆT, viết lại hấp dẫn nhà đầu tư Việt. Giữ nguyên ticker, tên công ty, số liệu. Trả về JSON:
{
  "title": "Tiêu đề tiếng Việt, hấp dẫn, <120 ký tự",
  "summary": "Tóm tắt 2-3 câu tiếng Việt",
  "full_content": "Bài viết hoàn chỉnh tiếng Việt 4-8 đoạn, có bối cảnh, phân tích tác động đến cổ phiếu, kết luận. Dùng \\n\\n giữa các đoạn."
}

TICKER: ${row.symbol}
TIÊU ĐỀ GỐC: ${row.original_title || row.title}
TÓM TẮT GỐC: ${row.summary || ""}
NỘI DUNG GỐC: ${row.full_content || row.summary || ""}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Bạn là biên tập tài chính. Trả về JSON hợp lệ duy nhất." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      console.error("AI error", aiRes.status, txt);
      if (aiRes.status === 429 || aiRes.status === 402) {
        return new Response(JSON.stringify({ article: row, error: "ai_unavailable" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI failed");
    }

    const json = await aiRes.json();
    const content = json.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    const updates = {
      title: parsed.title || row.title,
      summary: parsed.summary || row.summary,
      full_content: parsed.full_content || row.full_content,
      ai_translated: true,
    };

    const { data: updated, error: updErr } = await sb
      .from("stock_news")
      .update(updates)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (updErr) throw updErr;

    return new Response(JSON.stringify({ article: updated, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("translate error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
