import React from 'react';
import { useViewCount, getArticleMeta } from '@/hooks/useNewsLocal';

interface Props {
  article: { id: string; full_content?: string; summary?: string; title: string; stream: string };
  compact?: boolean;
}

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

const ArticleStats: React.FC<Props> = ({ article, compact = false }) => {
  const { views } = useViewCount(article.id);
  const meta = getArticleMeta(article);

  return (
    <div className={`flex items-center gap-2 flex-wrap ${compact ? 'text-[10px]' : 'text-[11px]'} text-muted-foreground/80 font-mono`}>
      <span className="inline-flex items-center gap-1">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {formatViews(views)}
      </span>
      <span className="text-white/20">·</span>
      <span className="inline-flex items-center gap-1">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" strokeLinecap="round" />
        </svg>
        {meta.readMinutes} phút đọc
      </span>
      <span className="text-white/20">·</span>
      <span className={`px-1.5 py-0.5 rounded border font-bold ${meta.impactColor}`}>
        {meta.impact}
      </span>
    </div>
  );
};

export default ArticleStats;
