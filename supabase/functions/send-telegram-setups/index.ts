import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2/cors";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
const TELEGRAM_CHAT_ID = "-1003722231058";

const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const SITE_BASE = "https://tbndigital.xyz";
const MAX_CAPTION = 1024; // Telegram caption limit

const PROB_MAP: Record<string, string> = {
  high: "🟢 Cao",
  medium: "🟡 Trung bình",
  low: "🔴 Thấp",
};

const ASSET_META: Record<string, { emoji: string; name: string; query: string }> = {
  BTC: { emoji: "₿", name: "Bitcoin (BTC/USDT)", query: "BTC" },
  XAU: { emoji: "🥇", name: "Vàng (XAU/USD)", query: "XAU" },
};

/** Build Telegram caption for ONE asset (max 1024 chars). */
function formatAssetCaption(setup: any, dateDisplay: string): string {
  const meta = ASSET_META[setup.asset] || { emoji: "📈", name: setup.asset, query: setup.asset };
  let msg = `${meta.emoji} <b>${meta.name}</b> — ${dateDisplay}\n`;
  if (setup.current_price) {
    const change = setup.price_change_24h ?? 0;
    const arrow = change >= 0 ? "▲" : "▼";
    msg += `💰 $${Number(setup.current_price).toLocaleString()} ${arrow} ${change.toFixed(2)}%\n`;
  }
  msg += `\n🧠 <i>${setup.ai_summary}</i>\n\n`;

  for (const s of setup.scenarios || []) {
    const label = s.scenario === "A" ? "📈" : s.scenario === "B" ? "➡️" : "📉";
    msg += `${label} <b>${s.scenario}. ${s.title}</b>\n`;
    msg += `• ĐK: ${s.condition}\n`;
    msg += `• Hành động: ${s.action}\n`;
    if (s.targets?.length) {
      msg += `• TP: ${s.targets.map((t: number) => `$${t.toLocaleString()}`).join(" → ")}\n`;
    }
    msg += `• Hủy: ${s.invalidation}\n`;
    msg += `• Xác suất: ${PROB_MAP[s.probability] || s.probability}\n\n`;
  }

  msg += `👉 ${SITE_BASE}/phan-tich`;

  if (msg.length > MAX_CAPTION) {
    msg = msg.substring(0, MAX_CAPTION - 30) + "\n…\n👉 Xem tại web";
  }
  return msg;
}

/**
 * Build a Microlink.io screenshot URL that captures ONLY the specific chart
 * container (#chart-btc or #chart-xau) on the live /phan-tich page.
 * Microlink crops to the matched element so the image is just the chart.
 */
function buildChartScreenshotUrl(asset: string): string {
  const target = `${SITE_BASE}/phan-tich?asset=${asset}`;
  const elementId = asset === "XAU" ? "#chart-xau" : "#chart-btc";
  const params = new URLSearchParams({
    url: target,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    element: elementId, // crop to this DOM element only
    "viewport.width": "1440",
    "viewport.height": "900",
    "viewport.deviceScaleFactor": "2",
    waitForSelector: elementId,
    waitForTimeout: "8000", // allow chart + indicators to fully render
    overlay: "false",
  });
  return `https://api.microlink.io/?${params.toString()}`;
}

/** Send one Telegram photo with caption. Returns message_id. */
async function sendTelegramPhoto(asset: string, caption: string): Promise<number> {
  const photoUrl = buildChartScreenshotUrl(asset);
  console.log(`[${asset}] Photo URL: ${photoUrl}`);

  const res = await fetch(`${TG_API}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      photo: photoUrl,
      caption,
      parse_mode: "HTML",
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    // Fallback: send as plain text if photo upload fails (e.g. Microlink slow / 429)
    console.error(`[${asset}] sendPhoto failed, falling back to sendMessage:`, JSON.stringify(data));
    const msgRes = await fetch(`${TG_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: caption,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const msgData = await msgRes.json();
    if (!msgRes.ok) throw new Error(`Telegram error: ${JSON.stringify(msgData)}`);
    return msgData.result?.message_id;
  }

  return data.result?.message_id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const now = new Date();
    const vnDate = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const dateStr = vnDate.toISOString().split("T")[0];
    const dateDisplay = `${vnDate.getDate().toString().padStart(2, "0")}/${(vnDate.getMonth() + 1).toString().padStart(2, "0")}/${vnDate.getFullYear()}`;

    let body: any = {};
    try { body = await req.json(); } catch {}
    const force = body.force === true;

    // Fetch today's setups
    let { data: setups, error } = await supabase
      .from("daily_setups")
      .select("*")
      .eq("setup_date", dateStr)
      .in("asset", ["BTC", "XAU"])
      .order("asset");

    if (error) throw error;

    // If no setups, generate them first
    if (!setups || setups.length === 0) {
      console.log("No setups found, generating...");
      const genRes = await fetch(`${SUPABASE_URL}/functions/v1/generate-daily-setups`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ force: true }),
      });

      if (!genRes.ok) {
        const errText = await genRes.text();
        throw new Error(`Generate failed: ${errText}`);
      }

      const refetch = await supabase
        .from("daily_setups")
        .select("*")
        .eq("setup_date", dateStr)
        .in("asset", ["BTC", "XAU"])
        .order("asset");

      setups = refetch.data;
      if (!setups || setups.length === 0) throw new Error("Failed to generate setups");
    }

    // Skip if all already sent
    const allSent = setups.every((s: any) => s.telegram_message_id);
    if (allSent && !force) {
      return new Response(JSON.stringify({ ok: true, status: "already_sent" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send each asset as its own message with chart screenshot
    const results: Record<string, any> = {};
    // Force order: XAU first then BTC (or vice versa) — keep alphabetical for predictability
    const ordered = [...setups].sort((a, b) => {
      const order: Record<string, number> = { XAU: 0, BTC: 1 };
      return (order[a.asset] ?? 99) - (order[b.asset] ?? 99);
    });

    for (const setup of ordered) {
      // Skip individually-sent setups unless force
      if (setup.telegram_message_id && !force) {
        results[setup.asset] = { status: "already_sent", message_id: setup.telegram_message_id };
        continue;
      }

      try {
        const caption = formatAssetCaption(setup, dateDisplay);
        const messageId = await sendTelegramPhoto(setup.asset, caption);

        await supabase
          .from("daily_setups")
          .update({ telegram_message_id: messageId })
          .eq("id", setup.id);

        results[setup.asset] = { status: "sent", message_id: messageId };

        // Small gap between messages so chat order is clean and Microlink isn't hammered
        await new Promise((r) => setTimeout(r, 1500));
      } catch (e: any) {
        console.error(`[${setup.asset}] send failed:`, e);
        results[setup.asset] = { status: "error", error: e.message };
      }
    }

    return new Response(JSON.stringify({ ok: true, date: dateStr, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
