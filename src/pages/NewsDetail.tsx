import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNewsData } from '@/hooks/useNewsData';
import { useReadHistory } from '@/hooks/useNewsLocal';
import BookmarkButton from '@/components/news/BookmarkButton';
import ReactionBar from '@/components/news/ReactionBar';
import ShareButtons from '@/components/news/ShareButtons';
import CommentSection from '@/components/news/CommentSection';
import NewsSidebar from '@/components/news/NewsSidebar';
import { CONTACT_INFO } from '@/lib/contact';

const STREAM_META: Record<string, { icon: string; label: string; color: string; ctaLink: string; ctaLabel: string; ctaIcon: string }> = {
  hot: { icon: '🔥', label: 'Tin Nóng', color: 'text-rose-400', ctaLink: CONTACT_INFO.telegramUrl, ctaLabel: 'Theo dõi BOT SIGNAL Telegram', ctaIcon: '🚀' },
  whale: { icon: '🐋', label: 'Cá Voi', color: 'text-cyan-400', ctaLink: CONTACT_INFO.telegramUrl, ctaLabel: 'Cảnh báo Cá Voi trên Telegram', ctaIcon: '🐋' },
  macro: { icon: '🏛️', label: 'Vĩ Mô', color: 'text-violet-400', ctaLink: CONTACT_INFO.telegramUrl, ctaLabel: 'Cập nhật Vĩ Mô qua Telegram', ctaIcon: '📡' },
  event: { icon: '📅', label: 'Sự Kiện', color: 'text-amber-400', ctaLink: 'https://www.okx.com/join/UNCLETRADER', ctaLabel: 'Trade ngay trên OKX — giảm 20% phí', ctaIcon: '💰' },
  sentiment: { icon: '📊', label: 'Tâm Lý', color: 'text-emerald-400', ctaLink: CONTACT_INFO.telegramUrl, ctaLabel: 'Phân tích Tâm Lý trên Telegram', ctaIcon: '📊' },
};

function renderMarkdown(content: string): React.ReactNode[] {
  return content.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={i} />;
    if (trimmed.startsWith('## ')) {
      return <h2 key={i} id={`h-${i}`} className="text-lg font-display font-bold text-foreground mt-6 mb-3 scroll-mt-32">{trimmed.slice(3)}</h2>;
    }
    if (trimmed.startsWith('### ')) {
      return <h3 key={i} id={`h-${i}`} className="text-base font-bold text-foreground mt-4 mb-2 scroll-mt-32">{trimmed.slice(4)}</h3>;
    }
    if (trimmed.match(/^[-•]\s/)) {
      return (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground ml-4 mb-1">
          <span className="text-cyan-400 mt-0.5">•</span>
          <span>{parseInline(trimmed.replace(/^[-•]\s/, ''))}</span>
        </li>
      );
    }
    if (trimmed.match(/^\d+\.\s/)) {
      return (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground ml-4 mb-1">
          <span className="text-amber-400 mt-0.5 font-mono text-xs">{trimmed.match(/^\d+/)?.[0]}.</span>
          <span>{parseInline(trimmed.replace(/^\d+\.\s/, ''))}</span>
        </li>
      );
    }
    return <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3">{parseInline(trimmed)}</p>;
  });
}

function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/\*(.+?)\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) parts.push(remaining.slice(0, boldMatch.index));
      parts.push(<strong key={key++} className="text-foreground font-semibold">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) parts.push(remaining.slice(0, italicMatch.index));
      parts.push(<em key={key++} className="italic text-foreground/80">{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
    } else {
      parts.push(remaining);
      break;
    }
  }
  return <>{parts}</>;
}

function parseBullets(summary: string): string[] {
  return summary.split('\n').map(l => l.trim()).filter(Boolean).map(l => l.replace(/^[•\-*]\s*/, ''));
}

// Extract H2/H3 from content for TOC
function extractToc(content: string): { id: string; text: string; level: number }[] {
  const toc: { id: string; text: string; level: number }[] = [];
  content.split('\n').forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('## ')) toc.push({ id: `h-${i}`, text: t.slice(3), level: 2 });
    else if (t.startsWith('### ')) toc.push({ id: `h-${i}`, text: t.slice(4), level: 3 });
  });
  return toc;
}

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const stream = searchParams.get('stream') || 'hot';
  const { articles } = useNewsData(stream);
  const { markRead } = useReadHistory();

  const [progress, setProgress] = useState(0);

  const article = articles.find(a => a.id === id);
  const meta = STREAM_META[stream] || STREAM_META.hot;

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mark as read once article is loaded
  useEffect(() => {
    if (article) {
      markRead({ id: article.id, title: article.title, stream: article.stream });
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.id]);

  // Related articles
  const related = useMemo(() =>
    articles.filter(a => a.id !== id && a.stream === stream).slice(0, 3),
    [articles, id, stream]
  );

  // Next article (auto-suggest)
  const nextArticle = useMemo(() => {
    const idx = articles.findIndex(a => a.id === id);
    if (idx === -1 || idx >= articles.length - 1) return articles.find(a => a.id !== id);
    return articles[idx + 1];
  }, [articles, id]);

  // Time to read
  const timeToRead = useMemo(() => {
    if (!article) return 1;
    const text = (article.full_content || article.summary || article.title);
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [article]);

  // TOC
  const toc = useMemo(() => article?.full_content ? extractToc(article.full_content) : [], [article]);

  if (!article) {
    return (
      <main className="min-h-screen bg-[#0b1120]">
        <Header />
        <div className="pt-32 text-center">
          <div className="text-5xl mb-4">📰</div>
          <h1 className="text-xl font-bold text-foreground mb-2">Không tìm thấy bài viết</h1>
          <Link to="/tin-tuc" className="text-cyan-400 text-sm hover:underline">← Quay lại Tin Tức</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const bullets = parseBullets(article.summary || '');

  return (
    <main className="min-h-screen bg-[#0b1120]">
      <Header />

      {/* Reading progress bar */}
      <div className="fixed top-[64px] left-0 right-0 h-[2px] bg-white/5 z-40">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="pt-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main content */}
          <article className="max-w-3xl">
            {/* Breadcrumb + meta actions */}
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-3">
                <Link to="/tin-tuc" className="text-muted-foreground text-sm hover:text-cyan-400 transition-colors">← Tin Tức</Link>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.color} bg-white/5`}>
                  {meta.icon} {meta.label}
                </span>
                <span className="text-[10px] text-muted-foreground/60 font-mono">⏱ {timeToRead} phút đọc</span>
              </div>
              <BookmarkButton id={article.id} title={article.title} stream={article.stream} size="md" />
            </div>

            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden mb-6 h-64 md:h-80">
              <img src={article.image_url || `https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=1200&h=600&fit=crop`}
                alt={article.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-[#0b1120]/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight mb-3">
                  {article.title}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  {article.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${article.badge_color}`}>
                      {article.badge}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{article.source}</span>
                  <span className="text-xs text-muted-foreground/60">
                    {new Date(article.published_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Reactions + Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
              <ReactionBar articleId={article.id} />
              <ShareButtons title={article.title} />
            </div>

            {/* TOC for long content */}
            {toc.length >= 3 && (
              <div className="bg-[#0d1526] border border-white/5 rounded-xl p-4 mb-6">
                <div className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest mb-2">📑 Mục lục</div>
                <ul className="space-y-1">
                  {toc.map(t => (
                    <li key={t.id} className={t.level === 3 ? 'pl-4' : ''}>
                      <a href={`#${t.id}`} className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors">
                        {t.level === 2 ? '▸' : '·'} {t.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Summary */}
            {bullets.length > 0 && (
              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5 mb-6">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">✨ AI Tóm Tắt</div>
                <ul className="space-y-2">
                  {bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="text-cyan-400 mt-0.5 shrink-0">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Content */}
            <div className="prose-custom mb-8">
              {article.full_content ? (
                renderMarkdown(article.full_content)
              ) : (
                <div className="space-y-4">
                  <h2 className="text-lg font-display font-bold text-foreground">Tổng Quan</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {article.title}. {article.summary?.replace(/[•\-*]\s*/g, '').replace(/\n/g, ' ')}
                  </p>
                  <h2 className="text-lg font-display font-bold text-foreground">Kết Luận</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Thị trường đang có những biến động đáng chú ý. Theo dõi chặt chẽ các vùng giá quan trọng và tín hiệu từ BOT SIGNAL để có quyết định giao dịch tốt nhất.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom reactions + share again */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 py-5 border-y border-white/5">
              <div>
                <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-2">Bài này thế nào?</div>
                <ReactionBar articleId={article.id} />
              </div>
              <ShareButtons title={article.title} />
            </div>

            {/* CTA Banner */}
            <a href={meta.ctaLink} target="_blank" rel="noopener noreferrer"
              className={`block rounded-xl p-5 border ${meta.color === 'text-amber-400' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-cyan-500/10 border-cyan-500/30'} hover:scale-[1.01] transition-transform mb-8`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{meta.ctaIcon}</span>
                <div>
                  <div className={`text-sm font-bold ${meta.color}`}>{meta.ctaLabel}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Nhận tín hiệu giao dịch miễn phí</div>
                </div>
              </div>
            </a>

            {/* Comments */}
            <div className="mb-8">
              <CommentSection articleId={article.id} />
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">📚 Bài viết liên quan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.map(r => (
                    <Link key={r.id} to={`/tin-tuc/${r.id}?stream=${r.stream}`}
                      className="bg-[#0d1526] border border-white/5 rounded-xl p-4 hover:border-cyan-400/30 transition-all group">
                      <h4 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-cyan-400 transition-colors">{r.title}</h4>
                      <span className="text-[10px] text-muted-foreground/60">{r.source}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Next article auto-suggest */}
            {nextArticle && (
              <Link to={`/tin-tuc/${nextArticle.id}?stream=${nextArticle.stream}`}
                className="block bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-cyan-500/10 border border-cyan-400/20 rounded-2xl p-5 hover:border-cyan-400/50 transition-all group mb-12">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">⏭ Đọc tiếp</div>
                    <div className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-cyan-400 transition-colors">
                      {nextArticle.title}
                    </div>
                  </div>
                  <div className="text-2xl text-cyan-400 group-hover:translate-x-1 transition-transform">→</div>
                </div>
              </Link>
            )}
          </article>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <NewsSidebar />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default NewsDetail;
