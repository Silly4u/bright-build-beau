import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArticleMeta } from '@/hooks/useNewsLocal';
import type { NewsArticle } from '@/hooks/useNewsData';

const STREAM_META: Record<string, { label: string; icon: string; color: string }> = {
  hot: { label: 'Tin Nóng', icon: '🔥', color: 'text-rose-400' },
  whale: { label: 'Cá Voi', icon: '🐋', color: 'text-cyan-400' },
  macro: { label: 'Vĩ Mô', icon: '🏛️', color: 'text-violet-400' },
  event: { label: 'Sự Kiện', icon: '📅', color: 'text-amber-400' },
  sentiment: { label: 'Tâm Lý', icon: '📊', color: 'text-emerald-400' },
};

const DailyDigest: React.FC<{ articles: NewsArticle[] }> = ({ articles }) => {
  const [open, setOpen] = useState(true);

  const top5 = useMemo(() => {
    // Bài có impact Cao + mới trong 24h, sort theo published_at
    const cutoff = Date.now() - 86400_000;
    const scored = articles
      .filter(a => new Date(a.published_at).getTime() >= cutoff)
      .map(a => {
        const meta = getArticleMeta(a);
        const score = (meta.impact === 'Cao' ? 100 : meta.impact === 'Trung Bình' ? 50 : 20)
          + Math.max(0, 24 - Math.floor((Date.now() - new Date(a.published_at).getTime()) / 3600_000));
        return { article: a, meta, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    // Fallback: nếu không đủ trong 24h, lấy top 5 chung
    if (scored.length < 3) {
      return articles.slice(0, 5).map(a => ({ article: a, meta: getArticleMeta(a), score: 0 }));
    }
    return scored;
  }, [articles]);

  if (top5.length === 0) return null;

  const today = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-[#0d1526] to-rose-500/10 border border-amber-400/20 rounded-2xl overflow-hidden mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">☕</span>
          <div className="text-left">
            <div className="text-sm font-display font-bold text-foreground">Bản Tin Sáng</div>
            <div className="text-[10px] text-muted-foreground/70 font-mono uppercase tracking-wider">{today} · 5 tin quan trọng</div>
          </div>
        </div>
        <span className={`text-amber-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <ol className="divide-y divide-white/5 border-t border-white/5">
          {top5.map(({ article, meta }, idx) => {
            const sm = STREAM_META[article.stream] || STREAM_META.hot;
            return (
              <li key={article.id}>
                <Link
                  to={`/tin-tuc/${article.id}?stream=${article.stream}`}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-white/5 transition-colors group"
                >
                  <span className="text-2xl font-display font-black text-amber-400/40 group-hover:text-amber-400 transition-colors w-7 shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold ${sm.color}`}>{sm.icon} {sm.label}</span>
                      <span className="text-white/20">·</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${meta.impactColor}`}>
                        {meta.impact}
                      </span>
                      <span className="text-white/20">·</span>
                      <span className="text-[10px] text-muted-foreground/60 font-mono">{meta.readMinutes}p</span>
                    </div>
                    <div className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-cyan-400 transition-colors leading-snug">
                      {article.title}
                    </div>
                    {article.summary && (
                      <div className="text-[11px] text-muted-foreground/70 line-clamp-1 mt-1">
                        {article.summary}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};

export default DailyDigest;
