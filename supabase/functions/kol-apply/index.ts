import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function sanitize(s: unknown, max = 500): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const payload = {
      full_name: sanitize(body.full_name, 100),
      email: sanitize(body.email, 255),
      phone: sanitize(body.phone, 30),
      telegram: sanitize(body.telegram, 100),
      channel_url: sanitize(body.channel_url, 500),
      platform: sanitize(body.platform, 30),
      followers: Number.isFinite(+body.followers) ? Math.min(+body.followers, 100_000_000) : null,
      audience_vn_percent: Number.isFinite(+body.audience_vn_percent)
        ? Math.max(0, Math.min(100, +body.audience_vn_percent))
        : null,
      experience: sanitize(body.experience, 1000),
      reason: sanitize(body.reason, 2000),
    };

    if (!payload.full_name || !payload.email || !payload.channel_url || !payload.platform || !payload.reason) {
      return new Response(JSON.stringify({ error: "Thiếu trường bắt buộc" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return new Response(JSON.stringify({ error: "Email không hợp lệ" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase
      .from("kol_applications")
      .insert(payload)
      .select("id")
      .single();

    if (error) throw error;

    // Notify Telegram
    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = "-1003722231058";
    if (token) {
      const text =
        `🤝 <b>ĐƠN KOL HỢP TÁC MỚI</b>\n\n` +
        `👤 ${payload.full_name}\n` +
        `📧 ${payload.email}\n` +
        (payload.phone ? `📞 ${payload.phone}\n` : "") +
        (payload.telegram ? `💬 ${payload.telegram}\n` : "") +
        `🌐 ${payload.platform} · ${payload.followers ?? "?"} followers · VN ${payload.audience_vn_percent ?? "?"}%\n` +
        `🔗 ${payload.channel_url}\n\n` +
        `📝 ${payload.reason.slice(0, 400)}`;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
      }).catch((e) => console.error("telegram err", e));
    }

    return new Response(JSON.stringify({ ok: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("kol-apply error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
