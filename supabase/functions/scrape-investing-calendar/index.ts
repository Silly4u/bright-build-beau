import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ─── Country → Flag mapping ───
const FLAG_MAP: Record<string, string> = {
  "Mỹ": "🇺🇸", "Hoa Kỳ": "🇺🇸", "US": "🇺🇸",
  "Anh": "🇬🇧", "Vương Quốc Anh": "🇬🇧", "UK": "🇬🇧",
  "Nhật Bản": "🇯🇵", "Nhật": "🇯🇵", "JP": "🇯🇵",
  "Eurozone": "🇪🇺", "Khu vực Eurozone": "🇪🇺", "EU": "🇪🇺",
  "Úc": "🇦🇺", "Australia": "🇦🇺", "AU": "🇦🇺",
  "Canada": "🇨🇦", "CA": "🇨🇦",
  "Thụy Sĩ": "🇨🇭", "CH": "🇨🇭",
  "New Zealand": "🇳🇿", "NZ": "🇳🇿",
  "Trung Quốc": "🇨🇳", "CN": "🇨🇳",
  "Đức": "🇩🇪", "DE": "🇩🇪",
  "Pháp": "🇫🇷", "FR": "🇫🇷",
  "Ý": "🇮🇹", "Italy": "🇮🇹", "IT": "🇮🇹",
  "Tây Ban Nha": "🇪🇸", "ES": "🇪🇸",
  "Hàn Quốc": "🇰🇷", "KR": "🇰🇷",
  "Ấn Độ": "🇮🇳", "IN": "🇮🇳",
  "Brazil": "🇧🇷", "BR": "🇧🇷",
  "Mexico": "🇲🇽", "MX": "🇲🇽",
  "Singapore": "🇸🇬", "SG": "🇸🇬",
  "Hồng Kông": "🇭🇰", "HK": "🇭🇰",
  "Indonesia": "🇮🇩", "ID": "🇮🇩",
  "Thái Lan": "🇹🇭", "TH": "🇹🇭",
  "Malaysia": "🇲🇾", "MY": "🇲🇾",
  "Philippines": "🇵🇭", "PH": "🇵🇭",
  "Việt Nam": "🇻🇳", "VN": "🇻🇳",
  "Nam Phi": "🇿🇦", "ZA": "🇿🇦",
  "Thổ Nhĩ Kỳ": "🇹🇷", "TR": "🇹🇷",
  "Nga": "🇷🇺", "RU": "🇷🇺",
  "Hà Lan": "🇳🇱", "NL": "🇳🇱",
  "Bỉ": "🇧🇪", "BE": "🇧🇪",
  "Áo": "🇦🇹", "AT": "🇦🇹",
  "Bồ Đào Nha": "🇵🇹", "PT": "🇵🇹",
  "Hy Lạp": "🇬🇷", "GR": "🇬🇷",
  "Ireland": "🇮🇪", "IE": "🇮🇪",
  "Phần Lan": "🇫🇮", "FI": "🇫🇮",
  "Na Uy": "🇳🇴", "NO": "🇳🇴",
  "Thụy Điển": "🇸🇪", "SE": "🇸🇪",
  "Đan Mạch": "🇩🇰", "DK": "🇩🇰",
  "Ba Lan": "🇵🇱", "PL": "🇵🇱",
  "Séc": "🇨🇿", "CZ": "🇨🇿",
  "Hungary": "🇭🇺", "HU": "🇭🇺",
  "Romania": "🇷🇴", "RO": "🇷🇴",
  "Israel": "🇮🇱", "IL": "🇮🇱",
  "Ả Rập Saudi": "🇸🇦", "SA": "🇸🇦",
};

// Country-code → Vietnamese name (Investing uses 2-letter codes in VN page)
const CC_TO_VN: Record<string, string> = {
  US: "Mỹ", JP: "Nhật Bản", EU: "Eurozone", UK: "Anh",
  AU: "Úc", CA: "Canada", CH: "Thụy Sĩ", NZ: "New Zealand",
  CN: "Trung Quốc", DE: "Đức", FR: "Pháp", IT: "Ý",
  ES: "Tây Ban Nha", KR: "Hàn Quốc", IN: "Ấn Độ",
  BR: "Brazil", MX: "Mexico", SG: "Singapore",
  HK: "Hồng Kông", ID: "Indonesia", TH: "Thái Lan",
  MY: "Malaysia", PH: "Philippines", VN: "Việt Nam",
  ZA: "Nam Phi", TR: "Thổ Nhĩ Kỳ", RU: "Nga",
  NL: "Hà Lan", BE: "Bỉ", AT: "Áo", PT: "Bồ Đào Nha",
  GR: "Hy Lạp", IE: "Ireland", FI: "Phần Lan",
  NO: "Na Uy", SE: "Thụy Điển", DK: "Đan Mạch",
  PL: "Ba Lan", CZ: "Séc", HU: "Hungary",
  RO: "Romania", IL: "Israel", SA: "Ả Rập Saudi",
};

const CC_TO_CCY: Record<string, string> = {
  US: "USD", JP: "JPY", EU: "EUR", UK: "GBP",
  AU: "AUD", CA: "CAD", CH: "CHF", NZ: "NZD",
  CN: "CNY", DE: "EUR", FR: "EUR", IT: "EUR",
  ES: "EUR", KR: "KRW", IN: "INR", BR: "BRL",
  MX: "MXN", SG: "SGD", HK: "HKD", ID: "IDR",
  TH: "THB", MY: "MYR", PH: "PHP", VN: "VND",
  ZA: "ZAR", TR: "TRY", RU: "RUB", NL: "EUR",
  BE: "EUR", AT: "EUR", PT: "EUR", GR: "EUR",
  IE: "EUR", FI: "EUR", NO: "NOK", SE: "SEK",
  DK: "DKK", PL: "PLN", CZ: "CZK", HU: "HUF",
  RO: "RON", IL: "ILS", SA: "SAR",
};

const IMPACT_MAP: Record<number, string> = { 1: "low", 2: "medium", 3: "high" };

// ─── IMPORTANCE OVERRIDES (hardcoded - applied AFTER AI) ───
const OVERRIDE_DOWN_TO_1: string[] = [
  "thất nghiệp nhật", "bán lẻ nhật",
  "pboc", "lãi suất cho vay cơ bản",
  "bán lẻ canada", "doanh số bán lẻ canada",
  "thay đổi việc làm úc",
  "cpi pháp",
  "goolsbee",
  "đấu giá hối phiếu", "đấu giá tín phiếu",
  "fdi trung quốc",
  "chi tiêu thẻ tín dụng",
  "hoạt động quốc gia của fed chi nhánh chicago",
];

const OVERRIDE_TO_2: string[] = [
  "chicago pmi",
  "thất nghiệp đức", "tỷ lệ thất nghiệp đức",
  "cpi ý", "italy cpi",
  "cpi eurozone", "eurozone cpi",
  "core cpi eurozone", "cpi lõi eurozone",
  "gdp canada", "gdp mom canada",
  "fed barr", "barr",
];

const OVERRIDE_UP_TO_3: string[] = [
  "pmi sản xuất", "pmi dịch vụ", "ism pmi",
  "jobless claims", "đơn xin trợ cấp thất nghiệp", "đề nghị trợ cấp thất nghiệp",
  "trump", "powell", "lagarde",
  "cb consumer confidence", "niềm tin tiêu dùng cb",
  "jolts", "cơ hội việc làm jolts",
  "lãi suất fed", "fed funds", "fomc",
  "ecb rate", "lãi suất ecb",
  "boe rate", "lãi suất boe",
  "boj rate", "lãi suất boj",
  "rba rate", "lãi suất rba",
  "non-farm", "phi nông nghiệp", "nfp",
  "cpi mỹ", "us cpi", "core cpi mỹ",
  "gdp mỹ", "us gdp",
  "tỷ lệ thất nghiệp mỹ", "us unemployment",
];

function applyOverrides(name: string, country: string, aiImportance: number): number {
  const text = `${name} ${country}`.toLowerCase();
  for (const kw of OVERRIDE_UP_TO_3) if (text.includes(kw)) return 3;
  for (const kw of OVERRIDE_TO_2) if (text.includes(kw)) return 2;
  for (const kw of OVERRIDE_DOWN_TO_1) if (text.includes(kw)) return 1;
  return aiImportance;
}

// ─── Fetch via Jina Reader (bypasses Cloudflare) ───
async function fetchViaJina(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  const res = await fetch(jinaUrl, {
    headers: {
      "Accept": "text/plain",
      "X-Return-Format": "markdown",
    },
  });
  if (!res.ok) throw new Error(`Jina fetch failed: ${res.status}`);
  return await res.text();
}

// ─── AI extraction with fallback chain ───
async function extractWithAI(
  markdown: string,
  apiKey: string,
  models: string[],
  dateHint: string
): Promise<any[] | null> {
  const systemPrompt = `You are a strict economic-calendar extractor. Return ONLY a valid JSON array, no markdown fences, no explanation.

Each object: { date, time, country_code, name, actual, forecast, previous, importance }

IMPORTANCE CLASSIFICATION (BE STRICT — IMPORTANCE MUST BE ACCURATE):

importance=3 (HIGH — market-moving, top tier ONLY):
- Interest rate decisions of major banks (Fed, ECB, BOE, BOJ, RBA, BOC, SNB, RBNZ)
- Non-Farm Payrolls (NFP)
- CPI / Core CPI HEADLINE for US, EU, UK, JP, AU, CA (YoY only)
- GDP HEADLINE (advance/preliminary) for US, EU, UK, JP
- Unemployment Rate for US, EU, UK, JP, AU, CA
- ISM Manufacturing/Services PMI (US only)
- Speeches by Fed Chair (Powell), ECB President (Lagarde), BOJ Governor, BOE Governor
- FOMC Minutes / Statement / Press Conference
- Retail Sales HEADLINE for US
- Trump speeches/policy announcements

importance=2 (MEDIUM):
- Country-specific PMI (Manufacturing/Services/Composite for DE, FR, UK, JP, AU, CA)
- CPI for smaller economies (CH, NZ, CA, AU)
- Core inflation sub-readings, MoM CPI
- Trade Balance, Current Account (major economies)
- Jobless Claims (Initial, Continuing) — US only
- Industrial Production, Factory Orders
- Consumer Confidence (CB, UoM, GfK), Business Confidence (IFO, ZEW)
- Housing Starts, Building Permits, Existing/New Home Sales
- PPI, Import/Export Prices
- Central bank member speeches (NOT chairs)
- Bond Auctions for 10Y, 30Y of major economies

importance=1 (LOW):
- T-bill auctions (3M, 6M, 4-week)
- Small/emerging country data
- Revised/Final readings (when preliminary already released)
- Money supply, credit data
- Holiday markers, regional Fed manufacturing indices (KC, Richmond, Dallas)
- FDI, Foreign Reserves
- Credit card spending, vehicle sales

CRITICAL RULES:
- Times in source may be EST/EDT (ForexFactory uses ET). CONVERT to GMT+7 (Vietnam) before output. ET → GMT+7: add 11 hours during EST (Nov-Mar), add 12 hours during EDT (Mar-Nov). If timezone unclear, assume input is already GMT+7 from vn.investing.
- Date must be ${dateHint} unless content explicitly shows a different date
- Use 2-letter country code (US, JP, EU, UK, AU, CA, CH, NZ, CN, DE, FR, IT, ES, KR, IN, BR, MX, SG, HK, ID, TH, MY, PH, VN, ZA, TR, RU, NL, BE, AT, PT, GR, IE, FI, NO, SE, DK, PL, CZ, HU, RO, IL, SA). ForexFactory uses currency codes — map: USD→US, EUR→EU (or DE/FR if specified), GBP→UK, JPY→JP, AUD→AU, CAD→CA, CHF→CH, NZD→NZ, CNY→CN.
- name: TRANSLATE to Vietnamese if source is English. Keep concise, professional tone. e.g. "Non-Farm Payrolls" → "Bảng Lương Phi Nông Nghiệp", "CPI y/y" → "CPI (Năm trên năm)".
- actual/forecast/previous: string or null (preserve % and units)
- EXCLUDE holidays, ads, navigation links, "Tentative" timed items with no data
- BE STRICT WITH IMPORTANCE — when in doubt, use lower tier`;

  const userPrompt = `Extract ALL economic events from this calendar content. Default date: ${dateHint}.

Content:
${markdown}`;

  const parseContent = (content: string): any[] | null => {
    try { const r = JSON.parse(content); if (Array.isArray(r)) return r; } catch { /* */ }
    const fence = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) { try { return JSON.parse(fence[1].trim()); } catch { /* */ } }
    const arr = content.match(/\[[\s\S]*\]/);
    if (arr) { try { return JSON.parse(arr[0]); } catch { /* */ } }
    return null;
  };

  // ─── Try Gemini direct FIRST (Lovable AI often rate-limited / out of credits) ───
  const geminiKey = Deno.env.get("GEMINI_API_KEY");
  if (geminiKey) {
    const geminiModels = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
    for (const gm of geminiModels) {
      console.log(`Trying Gemini direct: ${gm}`);
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${gm}:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
              generationConfig: { temperature: 0.05, responseMimeType: "application/json" },
            }),
          }
        );
        if (!res.ok) {
          console.error(`Gemini ${gm} failed: ${res.status} - ${(await res.text()).slice(0, 200)}`);
          continue;
        }
        const data = await res.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const events = parseContent(content);
        if (events && events.length > 0) {
          console.log(`Gemini ${gm} extracted ${events.length} events`);
          return events;
        }
      } catch (e) {
        console.error(`Gemini ${gm} error:`, e);
      }
    }
  }

  // ─── FALLBACK: Lovable AI Gateway ───
  for (const model of models) {
    console.log(`Trying model (Lovable fallback): ${model}`);
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.05,
        }),
      });
      if (!res.ok) {
        console.error(`Lovable ${model} failed: ${res.status}`);
        continue;
      }
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "";
      const events = parseContent(content);
      if (events && events.length > 0) {
        console.log(`Lovable ${model} extracted ${events.length} events`);
        return events;
      }
    } catch (e) {
      console.error(`Lovable ${model} error:`, e);
    }
  }

  return null;
}

// ─── Second AI pass: re-validate importance for HIGH events ───
async function validateImportance(
  events: any[],
  apiKey: string
): Promise<any[]> {
  // Only re-check events flagged HIGH (cheapest, highest impact on UX)
  const highEvents = events.filter(e => e.importance === 3);
  if (highEvents.length === 0) return events;

  const list = highEvents.map((e, i) =>
    `${i}. [${e.country_code}] ${e.name} (date=${e.date} time=${e.time})`
  ).join("\n");

  const prompt = `You are a strict reviewer. The following events were tagged importance=3 (HIGH). For each, decide if it TRULY belongs to importance=3 by these rules:

KEEP at 3 ONLY if:
- Major central bank rate decision (Fed/ECB/BOE/BOJ/RBA/BOC/SNB/RBNZ)
- NFP, US CPI/Core CPI headline (YoY), US GDP headline, US Unemployment Rate, ISM PMI
- CPI/Unemployment headline for EU, UK, JP, AU, CA
- Speech by Powell, Lagarde, BOJ Gov, BOE Gov
- FOMC minutes / press conference
- Trump policy announcement

DOWNGRADE to 2 if it's a country PMI (DE/FR/UK/JP), Jobless Claims, Consumer Confidence, Trade Balance, smaller-economy CPI.
DOWNGRADE to 1 if it's an auction, FDI, regional Fed index, revised reading, credit-card spending, holiday.

Events to review:
${list}

Respond ONLY with JSON array of {"index": number, "importance": 1|2|3} for each. No explanation.`;

  // Helper: try Lovable then Gemini direct
  const callAI = async (): Promise<string | null> => {
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "user", content: prompt }],
          temperature: 0,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        return d.choices?.[0]?.message?.content || null;
      }
      console.warn("Validate Lovable failed:", res.status);
    } catch (e) { console.warn("Validate Lovable err:", e); }

    const gKey = Deno.env.get("GEMINI_API_KEY");
    if (!gKey) return null;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${gKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0, responseMimeType: "application/json" },
          }),
        }
      );
      if (!res.ok) { console.warn("Validate Gemini failed:", res.status); return null; }
      const d = await res.json();
      return d.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch (e) { console.warn("Validate Gemini err:", e); return null; }
  };

  try {
    const content = await callAI();
    if (!content) return events;

    let decisions: { index: number; importance: number }[];
    try { decisions = JSON.parse(content); }
    catch {
      const m = content.match(/\[[\s\S]*\]/);
      if (!m) return events;
      decisions = JSON.parse(m[0]);
    }

    let downgraded = 0;
    for (const d of decisions) {
      const orig = highEvents[d.index];
      if (!orig) continue;
      if (d.importance !== 3) {
        const idx = events.indexOf(orig);
        if (idx >= 0) {
          events[idx].importance = d.importance;
          downgraded++;
        }
      }
    }
    console.log(`Validation: downgraded ${downgraded}/${highEvents.length} HIGH events`);
    return events;
  } catch (e) {
    console.warn("Validate pass error:", e);
    return events;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Mode: 'today' (default), 'week' (Mon-Sun current week), '3day' (yesterday/today/tomorrow)
    let mode = "today";
    let customUrl: string | null = null;
    try {
      const body = await req.json();
      if (body?.mode) mode = body.mode;
      if (body?.url) customUrl = body.url;
    } catch { /* default */ }

    // Compute today in VN time (GMT+7) for date hint
    const nowUtc = new Date();
    const vnNow = new Date(nowUtc.getTime() + 7 * 3600 * 1000);
    const vnToday = `${vnNow.getUTCFullYear()}-${String(vnNow.getUTCMonth() + 1).padStart(2, "0")}-${String(vnNow.getUTCDate()).padStart(2, "0")}`;

    // ─── Build list of (url, dateHint) pairs to scrape ───
    // forexfactory.com supports ?day=mmmddd.YYYY for any single date and renders full HTML (Jina-friendly)
    const ffMonth = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
    const ffDayUrl = (d: Date) => {
      const m = ffMonth[d.getUTCMonth()];
      const day = String(d.getUTCDate()).padStart(2, "0");
      const y = d.getUTCFullYear();
      return `https://www.forexfactory.com/calendar?day=${m}${day}.${y}`;
    };
    const fmtVnKey = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;

    const targets: { url: string; dateHint: string }[] = [];
    if (customUrl) {
      targets.push({ url: customUrl, dateHint: vnToday });
    } else if (mode === "today") {
      targets.push({ url: "https://vn.investing.com/economic-calendar/", dateHint: vnToday });
    } else if (mode === "3day") {
      for (const offset of [-1, 0, 1]) {
        const d = new Date(vnNow); d.setUTCDate(vnNow.getUTCDate() + offset);
        targets.push({ url: ffDayUrl(d), dateHint: fmtVnKey(d) });
      }
    } else if (mode === "week") {
      // Monday → Sunday in VN time
      const dow = vnNow.getUTCDay(); // 0=Sun..6=Sat
      const diffToMonday = dow === 0 ? -6 : 1 - dow;
      const monday = new Date(vnNow); monday.setUTCDate(vnNow.getUTCDate() + diffToMonday);
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday); d.setUTCDate(monday.getUTCDate() + i);
        targets.push({ url: ffDayUrl(d), dateHint: fmtVnKey(d) });
      }
    } else {
      targets.push({ url: "https://vn.investing.com/economic-calendar/", dateHint: vnToday });
    }

    console.log(`Mode: ${mode}, vnToday: ${vnToday}, targets: ${targets.length}`);

    const MODELS = [
      "google/gemini-2.5-flash",
      "google/gemini-2.5-flash-lite",
      "openai/gpt-5-nano",
    ];

    let events: any[] = [];
    for (const t of targets) {
      try {
        console.log(`Fetching: ${t.url} (date=${t.dateHint})`);
        const md = await fetchViaJina(t.url);
        console.log(`  → markdown length: ${md.length}`);
        if (md.length < 3000) { console.warn(`  → too short, skip`); continue; }

        // Trim to events portion
        const candidates = [
          md.indexOf("Thời Gian Hiện Tại"),
          md.indexOf("Time"),
          md.indexOf("Currency"),
        ].filter(i => i > 0);
        const tableStart = candidates.length ? Math.min(...candidates) : 0;
        const trimmed = md.slice(tableStart, tableStart + 50000);

        const partial = await extractWithAI(trimmed, LOVABLE_API_KEY, MODELS, t.dateHint);
        if (partial && partial.length > 0) {
          for (const ev of partial) if (!ev.date) ev.date = t.dateHint;
          events.push(...partial);
          console.log(`  → +${partial.length} events`);
        }
      } catch (e) {
        console.error(`Target ${t.url} failed:`, e instanceof Error ? e.message : e);
      }
    }

    if (events.length === 0) throw new Error("No events extracted from any target");
    console.log(`Total events extracted: ${events.length}`);

    // ─── Second pass: validate HIGH importance ───
    events = await validateImportance(events, LOVABLE_API_KEY);

    // Upsert
    let inserted = 0, updated = 0, skipped = 0, importanceRevised = 0;

    for (const ev of events) {
      if (!ev.date || !ev.name || !ev.country_code) { skipped++; continue; }

      const country = CC_TO_VN[ev.country_code] || ev.country_code;
      const flag = FLAG_MAP[country] || FLAG_MAP[ev.country_code] || "🌐";

      // Apply hardcoded overrides as final pass
      const aiImp = typeof ev.importance === "number" ? ev.importance : 2;
      const finalImportance = applyOverrides(ev.name, country, aiImp);
      if (finalImportance !== aiImp) importanceRevised++;
      const impact = IMPACT_MAP[finalImportance] || "medium";

      const eventTime = ev.time
        ? `${ev.date}T${ev.time}:00+07:00`
        : `${ev.date}T00:00:00+07:00`;

      // Check existing
      const { data: existing } = await supabase
        .from("economic_events")
        .select("id, actual, estimate, prev, impact")
        .eq("event_name", ev.name)
        .eq("country", country)
        .gte("event_time", `${ev.date}T00:00:00+07:00`)
        .lte("event_time", `${ev.date}T23:59:59+07:00`)
        .limit(1);

      if (existing && existing.length > 0) {
        const ex = existing[0];
        const needsUpdate =
          (ev.actual && ev.actual !== ex.actual) ||
          (ev.forecast && ev.forecast !== ex.estimate) ||
          (ev.previous && ev.previous !== ex.prev) ||
          (impact !== ex.impact);

        if (needsUpdate) {
          await supabase
            .from("economic_events")
            .update({
              actual: ev.actual || ex.actual,
              estimate: ev.forecast || ex.estimate,
              prev: ev.previous || ex.prev,
              impact,
            })
            .eq("id", ex.id);
          updated++;
        } else {
          skipped++;
        }
      } else {
        const { error: insertErr } = await supabase
          .from("economic_events")
          .insert({
            event_time: eventTime,
            country,
            flag,
            event_name: ev.name,
            impact,
            actual: ev.actual || null,
            estimate: ev.forecast || null,
            prev: ev.previous || null,
          });
        if (insertErr) {
          console.error("Insert error:", ev.name, insertErr.message);
          skipped++;
        } else {
          inserted++;
        }
      }
    }

    const result = {
      ok: true,
      mode,
      vnToday,
      total_extracted: events.length,
      inserted,
      updated,
      skipped,
      importance_revised_by_overrides: importanceRevised,
    };
    console.log("Result:", JSON.stringify(result));

    return new Response(JSON.stringify(result), {
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
