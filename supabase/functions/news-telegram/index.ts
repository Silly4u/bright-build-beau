import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TELEGRAM_CHAT_ID = "-1003722231058";
const NEWS_THREAD_ID = 329;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Support optional article_id from request body
    let articleId: string | null = null;
    try {
      const body = await req.json();
      articleId = body?.article_id || null;
    } catch { /* no body */ }

    let article: any;
    let fetchError: any;

    if (articleId) {
      const { data, error } = await supabase
        .from("news_articles")
        .select("title, summary, source, published_at, badge, stream, image_url")
        .eq("id", articleId)
        .single();
      article = data;
      fetchError = error;
    } else {
      const { data, error } = await supabase
        .from("news_articles")
        .select("title, summary, source, published_at, badge, stream, image_url")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .single();
      article = data;
      fetchError = error;
    }

    if (fetchError || !article) {
      console.log("No news article found:", fetchError?.message);
      return new Response(JSON.stringify({ ok: true, sent: false, reason: "no_article" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Format message
    const streamEmoji: Record<string, string> = {
      crypto: "₿",
      forex: "💱",
      gold: "🥇",
      stock: "📈",
      macro: "🌍",
    };

    const emoji = streamEmoji[article.stream] || "📰";
    const badge = article.badge ? `[${article.badge}] ` : "";
    const summary = article.summary
      ? `\n\n${article.summary.slice(0, 800)}${article.summary.length > 800 ? "..." : ""}`
      : "";

    // Need article id for detail link
    let articleIdForLink = articleId;
    if (!articleIdForLink) {
      // Re-fetch with id
      const { data: idData } = await supabase
        .from("news_articles")
        .select("id")
        .eq("title", article.title)
        .eq("published_at", article.published_at)
        .limit(1)
        .single();
      articleIdForLink = idData?.id || null;
    }

    const SITE_URL = "https://bright-build-beau.lovable.app";
    const detailLink = articleIdForLink ? `${SITE_URL}/tin-tuc/${articleIdForLink}` : null;

    const caption = `${emoji} <b>${badge}${article.title}</b>${summary}

📌 Nguồn: ${article.source}`;

    // Inline keyboard with "Đọc chi tiết" button
    const inlineKeyboard = detailLink
      ? { inline_keyboard: [[{ text: "📖 Đọc chi tiết", url: detailLink }]] }
      : undefined;

    let res: Response;

    if (article.image_url) {
      res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          message_thread_id: NEWS_THREAD_ID,
          photo: article.image_url,
          caption: caption.slice(0, 1024),
          parse_mode: "HTML",
          ...(inlineKeyboard && { reply_markup: inlineKeyboard }),
        }),
      });
    } else {
      res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          message_thread_id: NEWS_THREAD_ID,
          text: caption,
          parse_mode: "HTML",
          ...(inlineKeyboard && { reply_markup: inlineKeyboard }),
        }),
      });
    }

    const result = await res.json();
    if (!res.ok) {
      console.error("Telegram error:", JSON.stringify(result));
      throw new Error(`Telegram API failed [${res.status}]: ${JSON.stringify(result)}`);
    }

    console.log("News sent to Telegram:", article.title, article.image_url ? "(with photo)" : "(text only)");

    return new Response(JSON.stringify({ ok: true, sent: true, title: article.title, hasImage: !!article.image_url }), {
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
