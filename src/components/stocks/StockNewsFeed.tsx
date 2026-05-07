import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Sparkles } from 'lucide-react';

interface StockNews {
  id: string;
  symbol: string;
  title: string;
  summary: string | null;
  source: string;
  url: string | null;
  image_url: string | null;
  published_at: string;
  ai_translated: boolean;
}

interface Props {
  ticker?: string; // optional: filter to one ticker; otherwise all
  limit?: number;
}

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}p trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h trước`;
  const d = Math.floor(h / 24);
  return `${d} ngày trước`;
};

const StockNewsFeed: React.FC<Props> = ({ ticker, limit = 30 }) => {
  const [news, setNews] = useState<StockNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      let q = supabase.from('stock_news').select('*').eq('ai_translated', true).order('published_at', { ascending: false }).limit(limit);
      if (ticker) q = q.eq('symbol', ticker);
      const { data, error } = await q;
      if (!cancelled) {
        if (!error && data) setNews(data as StockNews[]);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [ticker, limit]);

  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">
          📰 Tin {ticker ? `· ${ticker}` : '· Tất cả mã'}
        </span>
        {news.length > 0 && <span className="text-[9px] font-mono text-muted-foreground/60">{news.length} tin</span>}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-white/5">
        {loading ? (
          <div className="p-6 text-center text-[11px] text-muted-foreground/60">Đang tải tin...</div>
        ) : news.length === 0 ? (
          <div className="p-6 text-center text-[11px] text-muted-foreground/60">
            Chưa có tin tức{ticker ? ` cho ${ticker}` : ''}.<br />
            <span className="text-[9px]">Tin sẽ xuất hiện sau khi auto-fetch chạy.</span>
          </div>
        ) : (
          news.map(n => (
            <a
              key={n.id}
              href={n.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 hover:bg-white/[0.03] transition-colors group"
            >
              <div className="flex items-start gap-2.5">
                {n.image_url ? (
                  <img src={n.image_url} alt="" loading="lazy" className="w-14 h-14 rounded object-cover flex-shrink-0 bg-white/5" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div className="w-14 h-14 rounded bg-gradient-to-br from-cyan-500/10 to-purple-500/10 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-400 flex-shrink-0">
                    {n.symbol}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-mono font-bold text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10">{n.symbol}</span>
                    {n.ai_translated && (
                      <span className="text-[8px] font-mono text-purple-300 flex items-center gap-0.5">
                        <Sparkles className="w-2 h-2" /> AI
                      </span>
                    )}
                    <span className="text-[9px] font-mono text-muted-foreground/60">· {n.source}</span>
                    <span className="text-[9px] font-mono text-muted-foreground/40 ml-auto">{timeAgo(n.published_at)}</span>
                  </div>
                  <div className="text-[12px] font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors">
                    {n.title}
                  </div>
                  {n.summary && (
                    <div className="text-[10.5px] text-muted-foreground/80 line-clamp-2 mt-1 leading-snug">{n.summary}</div>
                  )}
                </div>
                <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-cyan-400 flex-shrink-0 mt-1" />
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
};

export default StockNewsFeed;
