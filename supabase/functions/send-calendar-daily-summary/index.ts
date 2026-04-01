import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TELEGRAM_CHAT_ID = "-1003722231058";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN not configured");

    const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine target date (default: today GMT+7)
    let targetDate: string;
    try {
      const body = await req.json();
      targetDate = body?.date || "";
    } catch { targetDate = ""; }

    if (!targetDate) {
      const now = new Date();
      const vn = new Date(now.getTime() + 7 * 3600 * 1000);
      targetDate = vn.toISOString().split("T")[0];
    }

    console.log("Daily summary for:", targetDate);

    const dayStart = `${targetDate}T00:00:00+07:00`;
    const dayEnd = `${targetDate}T23:59:59+07:00`;

    // Query ALL events with importance >= 2 (not just USD)
    const { data: events, error: fetchErr } = await supabase
      .from("economic_events")
      .select("*")
      .in("impact", ["high", "medium"])
      .gte("event_time", dayStart)
      .lte("event_time", dayEnd)
      .order("event_time", { ascending: true });

    if (fetchErr) throw new Error(`DB error: ${fetchErr.message}`);

    const allEvents = events || [];

    if (allEvents.length === 0) {
      return new Response(JSON.stringify({ ok: true, sent: false, reason: "no_events" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const highImpact = allEvents.filter(e => e.impact === "high");
    const mediumImpact = allEvents.filter(e => e.impact === "medium");

    // Format date in Vietnamese
    const dateObj = new Date(`${targetDate}T12:00:00+07:00`);
    const days = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
    const pad = (n: number) => String(n).padStart(2, "0");
    const vnDate = `${days[dateObj.getDay()]}, ${pad(dateObj.getDate())}/${pad(dateObj.getMonth() + 1)}/${dateObj.getFullYear()}`;

    // ─── Generate AI Thumbnail via Gemini API ───
    let imageUrl: string | null = null;
    if (GEMINI_KEY) {
      try {
        const imgPrompt = `Create a professional financial news thumbnail.
Style: Modern financial dashboard aesthetic with dark blue/navy background, subtle tech grid lines, gold accents.
Include visual elements: globe icon, calendar icon, clock icon connected by dotted arrows in a flow diagram.
Title text: "LỊCH KINH TẾ QUỐC TẾ" in large bold white font at the top.
Show date box: "${vnDate}" on the left.
Show two circular stat badges: "${allEvents.length} sự kiện" (green circle) and "${highImpact.length} quan trọng" (red/orange circle).
Clean, premium financial infographic style. No busy backgrounds. Aspect ratio 16:9.`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_KEY}`;
        const imgRes = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: imgPrompt }] }],
            generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
          }),
        });

        if (imgRes.ok) {
          const imgData = await imgRes.json();
          const parts = imgData.candidates?.[0]?.content?.parts || [];
          const imgPart = parts.find((p: any) => p.inlineData);

          if (imgPart?.inlineData?.data) {
            const mimeType = imgPart.inlineData.mimeType || "image/png";
            const ext = mimeType.includes("jpeg") || mimeType.includes("jpg") ? "jpg" : "png";
            const bytes = Uint8Array.from(atob(imgPart.inlineData.data), c => c.charCodeAt(0));
            const fileName = `calendar/${targetDate}-daily-summary.${ext}`;

            const { error: uploadErr } = await supabase.storage
              .from("news-images")
              .upload(fileName, bytes, { contentType: mimeType, upsert: true });

            if (!uploadErr) {
              const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(fileName);
              imageUrl = urlData?.publicUrl || null;
              console.log("Thumbnail uploaded:", imageUrl);
            } else {
              console.error("Upload error:", uploadErr);
            }
          }
        } else {
          console.error("Image gen failed:", imgRes.status);
        }
      } catch (imgErr) {
        console.error("Image generation error:", imgErr);
      }
    }

    // ─── Build caption matching the screenshot format ───
    const formatEventTime = (eventTime: string): string => {
      const evTime = new Date(eventTime);
      const vnTime = new Date(evTime.getTime() + 7 * 3600 * 1000);
      return `${pad(vnTime.getUTCHours())}:${pad(vnTime.getUTCMinutes())}`;
    };

    let caption = `🗓 <b>LỊCH KINH TẾ — ${vnDate}</b>\n`;
    caption += `🌍 Tổng: ${allEvents.length} sự kiện | 🔴 Quan trọng: ${highImpact.length} | 🟡 TB: ${mediumImpact.length}\n\n`;

    // High impact events
    if (highImpact.length > 0) {
      caption += `🔴 <b>SỰ KIỆN QUAN TRỌNG:</b>\n`;
      for (const ev of highImpact) {
        const timeStr = formatEventTime(ev.event_time);
        const estimate = ev.estimate ? ` (dự kiến: ${ev.estimate})` : "";
        caption += `🕐 ${timeStr} | ${ev.flag} ${ev.event_name}${estimate}\n`;
      }
      caption += `\n`;
    }

    // Medium impact events
    if (mediumImpact.length > 0) {
      caption += `🟡 <b>SỰ KIỆN TRUNG BÌNH:</b>\n`;
      for (const ev of mediumImpact) {
        const timeStr = formatEventTime(ev.event_time);
        caption += `🕐 ${timeStr} | ${ev.flag} ${ev.event_name}\n`;
      }
      caption += `\n`;
    }

    caption += `🔗 Xem chi tiết đầy đủ`;

    // ─── Send to Telegram ───
    let res: Response;

    if (imageUrl) {
      // Send photo first, then message separately (caption limit 1024)
      res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          photo: imageUrl,
          caption: "",
        }),
      });

      const photoResult = await res.json();
      if (!res.ok) {
        console.error("Photo send error:", JSON.stringify(photoResult));
      }

      // Send text message
      res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: caption,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });
    } else {
      res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: caption,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });
    }

    const result = await res.json();
    if (!res.ok) {
      console.error("Telegram error:", JSON.stringify(result));
      throw new Error(`Telegram API failed: ${JSON.stringify(result)}`);
    }

    console.log("Daily summary sent to Telegram");

    return new Response(JSON.stringify({
      ok: true,
      sent: true,
      date: targetDate,
      eventCount: allEvents.length,
      highImpactCount: highImpact.length,
      mediumImpactCount: mediumImpact.length,
      hasImage: !!imageUrl,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
