import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import TradingViewChart from '@/components/stocks/TradingViewChart';
import { getStockByTicker } from '@/lib/stocks';
import {
  ArrowLeft, ExternalLink, Sparkles, Clock, TrendingUp, TrendingDown,
  Share2, Bookmark, ChevronRight, Loader2,
} from 'lucide-react';

interface StockNews {
  id: string;
  symbol: string;
  title: string;
  original_title: string | null;
  summary: string | null;
  full_content: string | null;
  source: string;
  url: string | null;
  image_url: string | null;
  published_at: string;
  ai_translated: boolean;
}

interface Quote {
  symbol: string;
  price: number;
  changePercent: number;
  volume: number;
}

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  return `${d} ngày trước`;
};

const StockNewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<StockNews | null>(null);
  const [related, setRelated] = useState<StockNews[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [translating, setTranslating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [readProgress, setReadProgress] = useState(0);

  // Read progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setReadProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Load article
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('stock_news')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setLoading(false);
        return;
      }
      setArticle(data as StockNews);
      setLoading(false);

      // If not translated OR content too short → expand via AI
      const wc = (data.full_content || '').trim().split(/\s+/).filter(Boolean).length;
      if (!data.ai_translated || wc < 1200) {
        setTranslating(true);
        try {
          const { data: res } = await supabase.functions.invoke('stock-news-translate', {
            body: { id: data.id, force: wc < 1200 },
          });
          if (!cancelled && res?.article) setArticle(res.article as StockNews);
        } catch (e) {
          console.error('translate err', e);
        } finally {
          if (!cancelled) setTranslating(false);
        }
      }

      // Load related (same ticker)
      const { data: rel } = await supabase
        .from('stock_news')
        .select('*')
        .eq('symbol', data.symbol)
        .neq('id', data.id)
        .order('published_at', { ascending: false })
        .limit(6);
      if (!cancelled && rel) setRelated(rel as StockNews[]);
    })();
    return () => { cancelled = true; };
  }, [id]);

  // Load live quote
  useEffect(() => {
    if (!article) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.functions.invoke('stocks-quotes');
        if (cancelled || !data?.quotes) return;
        const sym = `${article.symbol}USDT`;
        const q = (data.quotes as Quote[]).find(x => x.symbol === sym);
        if (q) setQuote(q);
      } catch {/* ignore */}
    })();
    return () => { cancelled = true; };
  }, [article]);

  useEffect(() => {
    if (article) document.title = `${article.title} | UncleTrader`;
  }, [article]);

  const stockMeta = article ? getStockByTicker(article.symbol) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center text-muted-foreground">Đang tải bài viết…</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center text-muted-foreground">
          Không tìm thấy bài viết.{' '}
          <Link to="/co-phieu" className="text-cyan-400 underline">Quay lại trang Cổ phiếu</Link>
        </div>
      </div>
    );
  }

  const blocks = (article.full_content || article.summary || '')
    .split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  // Detect markdown image: ![alt](url)
  const imgRe = /^!\[([^\]]*)\]\(([^)]+)\)$/;
  // Detect heading: ## title or ### title
  const hRe = /^(#{2,4})\s+(.*)$/;
  // Inline bold **text**
  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      /^\*\*[^*]+\*\*$/.test(p)
        ? <strong key={i} className="text-foreground font-bold">{p.slice(2, -2)}</strong>
        : <React.Fragment key={i}>{p}</React.Fragment>
    );
  };

  const isUp = quote ? quote.changePercent >= 0 : true;

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: article.title, url }); } catch {/* ignore */}
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Header />

      {/* Read progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-40 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <main className="pt-24 md:pt-28 pb-16 px-3 sm:px-4 lg:px-6 max-w-[1400px] mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 mb-4 font-mono">
          <Link to="/co-phieu" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Cổ phiếu
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/co-phieu" className="hover:text-cyan-400 transition-colors">{article.symbol}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground/80 truncate">Tin tức</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* MAIN COLUMN */}
          <article className="min-w-0">
            {/* Hero */}
            <div className="glass-card rounded-2xl overflow-hidden mb-5">
              {article.image_url && (
                <div className="aspect-[16/8] bg-black/30 overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="p-5 sm:p-7">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    {article.symbol}
                  </span>
                  {stockMeta && (
                    <span className="text-[11px] text-muted-foreground/80">{stockMeta.name} · {stockMeta.sector}</span>
                  )}
                  {article.ai_translated ? (
                    <span className="text-[10px] font-mono text-purple-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10">
                      <Sparkles className="w-2.5 h-2.5" /> AI dịch
                    </span>
                  ) : translating ? (
                    <span className="text-[10px] font-mono text-amber-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10">
                      <Loader2 className="w-2.5 h-2.5 animate-spin" /> Đang dịch sang tiếng Việt…
                    </span>
                  ) : null}
                  <span className="text-[11px] text-muted-foreground/60 font-mono flex items-center gap-1 ml-auto">
                    <Clock className="w-3 h-3" /> {timeAgo(article.published_at)}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight leading-tight mb-3">
                  {article.title}
                </h1>

                {article.summary && (
                  <p className="text-[14px] sm:text-[15px] text-muted-foreground leading-relaxed border-l-2 border-cyan-500/40 pl-3 italic">
                    {article.summary}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-5 text-[11px] font-mono text-muted-foreground/70">
                  <span>Nguồn: <span className="text-foreground/80">{article.source}</span></span>
                  <span className="text-muted-foreground/40">·</span>
                  <button onClick={share} className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                    <Share2 className="w-3 h-3" /> Chia sẻ
                  </button>
                  {article.url && (
                    <>
                      <span className="text-muted-foreground/40">·</span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> Đọc bản gốc
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Inline live quote card */}
            {quote && stockMeta && (
              <div className="glass-card rounded-2xl p-4 mb-5 flex items-center justify-between flex-wrap gap-3 border-l-4" style={{ borderLeftColor: isUp ? '#22c55e' : '#ef4444' }}>
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">Giá hiện tại · {stockMeta.name}</div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-2xl font-bold text-foreground font-mono">${quote.price.toFixed(2)}</span>
                    <span className={`text-sm font-mono font-bold flex items-center gap-1 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {isUp ? '+' : ''}{quote.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <Link
                  to={`/co-phieu`}
                  state={{ ticker: article.symbol }}
                  className="px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold transition-colors"
                >
                  Xem chart đầy đủ →
                </Link>
              </div>
            )}

            {/* Body */}
            <div className="glass-card rounded-2xl p-5 sm:p-7 mb-5">
              {paragraphs.length === 0 && translating ? (
                <div className="text-center py-10 text-muted-foreground/70 text-[13px]">
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  Đang dịch nội dung sang tiếng Việt…
                </div>
              ) : (
                <div className="prose prose-invert max-w-none">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="text-[14.5px] sm:text-[15px] leading-[1.8] text-foreground/90 mb-4">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {/* Mini TradingView inline */}
              {stockMeta && (
                <div className="mt-6">
                  <div className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-2">
                    📈 Biểu đồ {article.symbol} · TradingView
                  </div>
                  <TradingViewChart symbol={stockMeta.tvSymbol} height={420} />
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-6 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                <div className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest mb-1">
                  ⚠️ Lưu ý
                </div>
                <p className="text-[11.5px] text-muted-foreground/80 leading-relaxed">
                  Bài viết được dịch & biên tập bằng AI từ nguồn quốc tế. Đây không phải lời khuyên đầu tư.
                  Hãy tự nghiên cứu (DYOR) và quản trị rủi ro trước mọi quyết định giao dịch.
                </p>
              </div>
            </div>

            {/* Related news */}
            {related.length > 0 && (
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[11px] font-mono font-bold text-foreground uppercase tracking-widest">
                    📰 Đọc tiếp về {article.symbol}
                  </h2>
                  <Link to="/co-phieu" className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300">
                    Xem tất cả →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {related.map(r => (
                    <Link
                      key={r.id}
                      to={`/co-phieu/tin/${r.id}`}
                      className="flex gap-3 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group border border-white/5"
                    >
                      {r.image_url ? (
                        <img src={r.image_url} alt="" className="w-20 h-20 rounded object-cover flex-shrink-0" loading="lazy" />
                      ) : (
                        <div className="w-20 h-20 rounded bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 flex-shrink-0">
                          {r.symbol}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-semibold text-foreground line-clamp-2 group-hover:text-cyan-300 transition-colors leading-tight">
                          {r.title}
                        </div>
                        <div className="text-[10px] font-mono text-muted-foreground/60 mt-1">
                          {r.source} · {timeAgo(r.published_at)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-24 self-start">
            {stockMeta && (
              <div className="glass-card rounded-2xl p-4">
                <div className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-2">Về cổ phiếu</div>
                <div className="text-base font-bold text-foreground">{stockMeta.name}</div>
                <div className="text-[11px] text-muted-foreground/70">{stockMeta.ticker} · {stockMeta.sector}</div>
                {quote && (
                  <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <div className="text-muted-foreground/60">Giá</div>
                      <div className="text-foreground font-bold">${quote.price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground/60">24h</div>
                      <div className={isUp ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {isUp ? '+' : ''}{quote.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                )}
                <Link
                  to="/co-phieu"
                  className="mt-3 w-full inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-foreground transition-colors"
                >
                  Mở dashboard cổ phiếu →
                </Link>
              </div>
            )}

            <div className="glass-card rounded-2xl p-4">
              <div className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest mb-3">⚡ Hành động nhanh</div>
              <div className="space-y-2">
                <button
                  onClick={share}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[12px] text-foreground transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Chia sẻ bài viết
                </button>
                <a
                  href="https://t.me/uncletraderchannel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-[12px] text-cyan-300 transition-colors"
                >
                  📡 Tham gia Telegram VIP
                </a>
                <Link
                  to="/chi-bao"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[12px] text-foreground transition-colors"
                >
                  🎯 Xem indicator AI
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StockNewsDetail;
