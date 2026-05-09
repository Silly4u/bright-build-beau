import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const wordCount = (s: string | null | undefined) =>
  (s || "").trim().split(/\s+/).filter(Boolean).length;

// Stable, no-API-key image sources (Unsplash redirect + Picsum fallback)
const buildImagePool = (symbol: string, sector?: string) => {
  const seed = symbol.toLowerCase();
  const kwSector = (sector || "finance").toLowerCase().replace(/\s+/g, ",");
  return [
    `https://source.unsplash.com/1200x630/?${seed},stock,trading`,
    `https://source.unsplash.com/1200x630/?${kwSector},business,technology`,
    `https://source.unsplash.com/1200x630/?wallstreet,chart,${seed}`,
    `https://picsum.photos/seed/${seed}-1/1200/630`,
    `https://picsum.photos/seed/${seed}-2/1200/630`,
  ];
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { id, force } = await req.json();
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

    // Skip only if already translated AND long enough
    const wc = wordCount(row.full_content);
    if (!force && row.ai_translated && wc >= 1200) {
      return new Response(JSON.stringify({ article: row, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const imagePool = buildImagePool(row.symbol);

    const prompt = `Bạn là biên tập viên tài chính cao cấp viết cho nhà đầu tư Việt Nam. Hãy mở rộng và viết lại tin tức cổ phiếu Mỹ sau thành MỘT BÀI BÁO HOÀN CHỈNH BẰNG TIẾNG VIỆT, TỐI THIỂU 1500 TỪ, thật hấp dẫn, sâu sắc, có bối cảnh ngành, phân tích kỹ thuật cơ bản, so sánh đối thủ, ý nghĩa với nhà đầu tư, kịch bản tăng/giảm và kết luận hành động.

YÊU CẦU NỘI DUNG (BẮT BUỘC):
- Tối thiểu 1500 từ tiếng Việt (đếm từ thực tế).
- Cấu trúc rõ ràng với 5-7 tiểu mục Markdown bắt đầu bằng "## " (vd: "## Bối cảnh thị trường", "## Phân tích tác động", "## So sánh ngành", "## Kịch bản giá", "## Khuyến nghị nhà đầu tư"...).
- Chèn ÍT NHẤT 2 hình minh hoạ trong bài bằng cú pháp Markdown ảnh: ![mô tả ngắn](URL). Chỉ dùng các URL trong DANH SÁCH ẢNH dưới đây, mỗi ảnh dùng 1 lần, đặt giữa các đoạn phù hợp.
- Giữ nguyên ticker (${row.symbol}), tên công ty, số liệu gốc; bổ sung số liệu/ngữ cảnh phổ biến nhà đầu tư cần biết.
- Văn phong chuyên nghiệp, dễ hiểu, có cảm xúc, KHÔNG sao chép nguyên văn.

DANH SÁCH ẢNH (chọn ít nhất 2, dùng nguyên URL):
${imagePool.map((u, i) => `${i + 1}. ${u}`).join("\n")}

TRẢ VỀ JSON HỢP LỆ DUY NHẤT:
{
  "title": "Tiêu đề tiếng Việt hấp dẫn, <120 ký tự",
  "summary": "Tóm tắt 2-3 câu tiếng Việt nêu insight chính",
  "full_content": "Bài viết Markdown đầy đủ ≥1500 từ, có ## tiểu mục và ![](url) ảnh, dùng \\n\\n giữa các đoạn"
}

DỮ LIỆU NGUỒN:
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
          { role: "system", content: "Bạn là biên tập tài chính chuyên sâu. Trả về JSON hợp lệ duy nhất, không markdown code fence." },
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

    let fullContent: string = parsed.full_content || row.full_content || "";

    // Safety net: if AI returned a body without any image, inject the first 2 images
    const hasImage = /!\[[^\]]*\]\([^)]+\)/.test(fullContent);
    if (!hasImage && fullContent) {
      const paras = fullContent.split(/\n\n+/);
      const inject = (idx: number, url: string, alt: string) => {
        if (idx < paras.length) {
          paras.splice(idx, 0, `![${alt}](${url})`);
        }
      };
      inject(2, imagePool[0], `${row.symbol} - minh hoạ thị trường`);
      inject(Math.min(paras.length - 1, 6), imagePool[1], `${row.symbol} - phân tích ngành`);
      fullContent = paras.join("\n\n");
    }

    // Use article image_url if missing — fallback to first image from pool
    let imageUrl = row.image_url;
    if (!imageUrl) imageUrl = imagePool[0];

    const updates = {
      title: parsed.title || row.title,
      summary: parsed.summary || row.summary,
      full_content: fullContent,
      image_url: imageUrl,
      ai_translated: true,
    };

    const { data: updated, error: updErr } = await sb
      .from("stock_news")
      .update(updates)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (updErr) throw updErr;

    return new Response(JSON.stringify({
      article: updated,
      cached: false,
      word_count: wordCount(fullContent),
    }), {
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
