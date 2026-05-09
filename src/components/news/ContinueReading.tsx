import React from 'react';
import { Link } from 'react-router-dom';
import { useReadingProgress, useReadHistory } from '@/hooks/useNewsLocal';
import type { NewsArticle } from '@/hooks/useNewsData';

const ContinueReading: React.FC<{ articles: NewsArticle[] }> = ({ articles }) => {
  const { progress } = useReadingProgress();
  const { history } = useReadHistory();

  // Tin đã đọc nhưng progress < 90%
  const items = history
    .map(h => {
      const a = articles.find(x => x.id === h.id);
      const pct = progress[h.id] || 0;
      if (!a || pct >= 90) return null;
      return { article: a, pct };
    })
    .filter((x): x is { article: NewsArticle; pct: number } => x !== null)
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 border border-cyan-400/20 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Đọc Tiếp</span>
        </div>
        <span className="text-[10px] text-muted-foreground/60 font-mono">{items.length} bài chưa hoàn thành</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {items.map(({ article, pct }) => (
          <Link
            key={article.id}
            to={`/tin-tuc/${article.id}?stream=${article.stream}`}
            className="bg-[#0d1526]/80 border border-white/5 rounded-xl p-3 hover:border-cyan-400/40 transition-all group"
          >
            <div className="text-xs font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-cyan-400 transition-colors">
              {article.title}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-cyan-400">{pct}%</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContinueReading;
