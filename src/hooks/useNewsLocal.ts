import { useState, useEffect, useCallback } from 'react';

const KEYS = {
  bookmarks: 'news:bookmarks',
  history: 'news:history',
  reactions: 'news:reactions',
  comments: 'news:comments',
  follows: 'news:follows',
  hidden: 'news:hidden',
  views: 'news:views',
  progress: 'news:progress',
  poll: 'news:poll',
  streak: 'news:streak',
} as const;

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS<T>(key: string, val: T) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new CustomEvent(`ls:${key}`));
  } catch {
    // ignore quota
  }
}

function useLSState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => readLS(key, initial));
  useEffect(() => {
    const onChange = () => setVal(readLS(key, initial));
    window.addEventListener(`ls:${key}`, onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener(`ls:${key}`, onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [key]);
  const set = useCallback((v: T | ((p: T) => T)) => {
    setVal(prev => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
      writeLS(key, next);
      return next;
    });
  }, [key]);
  return [val, set];
}

// ─── Bookmarks ───────────────────────────
export interface BookmarkItem {
  id: string;
  title: string;
  stream: string;
  saved_at: string;
}

export function useBookmarks() {
  const [items, setItems] = useLSState<BookmarkItem[]>(KEYS.bookmarks, []);
  const isBookmarked = useCallback((id: string) => items.some(b => b.id === id), [items]);
  const toggle = useCallback((item: Omit<BookmarkItem, 'saved_at'>) => {
    setItems(prev => {
      const exists = prev.find(b => b.id === item.id);
      if (exists) return prev.filter(b => b.id !== item.id);
      return [{ ...item, saved_at: new Date().toISOString() }, ...prev].slice(0, 100);
    });
  }, [setItems]);
  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(b => b.id !== id));
  }, [setItems]);
  return { bookmarks: items, isBookmarked, toggle, remove };
}

// ─── Read History ───────────────────────────
export interface HistoryItem {
  id: string;
  title: string;
  stream: string;
  read_at: string;
}

export function useReadHistory() {
  const [items, setItems] = useLSState<HistoryItem[]>(KEYS.history, []);
  const markRead = useCallback((item: Omit<HistoryItem, 'read_at'>) => {
    setItems(prev => {
      const filtered = prev.filter(h => h.id !== item.id);
      return [{ ...item, read_at: new Date().toISOString() }, ...filtered].slice(0, 50);
    });
  }, [setItems]);
  const isRead = useCallback((id: string) => items.some(h => h.id === id), [items]);
  const clear = useCallback(() => setItems([]), [setItems]);
  return { history: items, markRead, isRead, clear };
}

// ─── Reactions ───────────────────────────
export type ReactionType = 'fire' | 'like' | 'shock' | 'bull' | 'bear';
export interface ReactionState {
  counts: Record<ReactionType, number>;
  mine: ReactionType | null;
}

const DEFAULT_COUNTS: Record<ReactionType, number> = {
  fire: 0, like: 0, shock: 0, bull: 0, bear: 0,
};

export function useReactions(articleId: string) {
  const [all, setAll] = useLSState<Record<string, ReactionState>>(KEYS.reactions, {});
  const state = all[articleId] || { counts: { ...DEFAULT_COUNTS }, mine: null };

  // Generate stable random base counts (simulate community)
  useEffect(() => {
    if (!all[articleId]) {
      let hash = 0;
      for (let i = 0; i < articleId.length; i++) hash = ((hash << 5) - hash + articleId.charCodeAt(i)) | 0;
      const seed = Math.abs(hash);
      const base: Record<ReactionType, number> = {
        fire: (seed % 47) + 12,
        like: ((seed >> 3) % 38) + 8,
        shock: ((seed >> 6) % 19) + 3,
        bull: ((seed >> 9) % 24) + 5,
        bear: ((seed >> 12) % 21) + 4,
      };
      setAll(prev => ({ ...prev, [articleId]: { counts: base, mine: null } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const react = useCallback((type: ReactionType) => {
    setAll(prev => {
      const cur = prev[articleId] || { counts: { ...DEFAULT_COUNTS }, mine: null };
      const counts = { ...cur.counts };
      if (cur.mine === type) {
        counts[type] = Math.max(0, counts[type] - 1);
        return { ...prev, [articleId]: { counts, mine: null } };
      }
      if (cur.mine) counts[cur.mine] = Math.max(0, counts[cur.mine] - 1);
      counts[type] = counts[type] + 1;
      return { ...prev, [articleId]: { counts, mine: type } };
    });
  }, [articleId, setAll]);

  return { ...state, react };
}

// ─── Comments ───────────────────────────
export interface CommentItem {
  id: string;
  article_id: string;
  author: string;
  text: string;
  created_at: string;
}

export function useComments(articleId: string) {
  const [all, setAll] = useLSState<Record<string, CommentItem[]>>(KEYS.comments, {});
  const list = all[articleId] || [];

  const add = useCallback((author: string, text: string) => {
    if (!text.trim()) return;
    const item: CommentItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      article_id: articleId,
      author: author.trim() || 'Trader ẩn danh',
      text: text.trim().slice(0, 500),
      created_at: new Date().toISOString(),
    };
    setAll(prev => ({ ...prev, [articleId]: [item, ...(prev[articleId] || [])].slice(0, 50) }));
  }, [articleId, setAll]);

  const remove = useCallback((id: string) => {
    setAll(prev => ({ ...prev, [articleId]: (prev[articleId] || []).filter(c => c.id !== id) }));
  }, [articleId, setAll]);

  return { comments: list, add, remove };
}

// ─── Followed Topics (streams) ───────────────────────────
export function useFollowedTopics() {
  const [topics, setTopics] = useLSState<string[]>(KEYS.follows, []);
  const isFollowed = useCallback((id: string) => topics.includes(id), [topics]);
  const toggle = useCallback((id: string) => {
    setTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }, [setTopics]);
  return { topics, isFollowed, toggle };
}

// ─── Hidden Articles ───────────────────────────
export function useHiddenArticles() {
  const [hidden, setHidden] = useLSState<string[]>(KEYS.hidden, []);
  const isHidden = useCallback((id: string) => hidden.includes(id), [hidden]);
  const hide = useCallback((id: string) => {
    setHidden(prev => prev.includes(id) ? prev : [id, ...prev].slice(0, 200));
  }, [setHidden]);
  const unhideAll = useCallback(() => setHidden([]), [setHidden]);
  return { hidden, isHidden, hide, unhideAll };
}

// ─── View Counts (deterministic + per-user increment) ───────────────────────────
export function useViewCount(articleId: string) {
  // Deterministic base from id (simulate community), local +1 when read
  const [views, setViews] = useLSState<Record<string, number>>(KEYS.views, {});
  let hash = 0;
  for (let i = 0; i < articleId.length; i++) hash = ((hash << 5) - hash + articleId.charCodeAt(i)) | 0;
  const base = (Math.abs(hash) % 4800) + 220;
  const total = base + (views[articleId] || 0);
  const incr = useCallback(() => {
    setViews(prev => ({ ...prev, [articleId]: (prev[articleId] || 0) + 1 }));
  }, [articleId, setViews]);
  return { views: total, incr };
}

// ─── Reading Progress per article ───────────────────────────
export function useReadingProgress() {
  const [map, setMap] = useLSState<Record<string, number>>(KEYS.progress, {});
  const set = useCallback((id: string, pct: number) => {
    setMap(prev => ({ ...prev, [id]: Math.max(prev[id] || 0, Math.min(100, Math.round(pct))) }));
  }, [setMap]);
  const get = useCallback((id: string) => map[id] || 0, [map]);
  return { progress: map, set, get };
}

// ─── Daily Poll ───────────────────────────
export type PollChoice = 'bull' | 'bear' | 'side';
export interface PollState {
  date: string; // YYYY-MM-DD
  votes: Record<PollChoice, number>;
  mine: PollChoice | null;
}
function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
export function useDailyPoll() {
  const [state, setState] = useLSState<PollState | null>(KEYS.poll, null);
  const today = todayKey();
  const cur: PollState = state && state.date === today ? state : (() => {
    let h = 0;
    for (let i = 0; i < today.length; i++) h = ((h << 5) - h + today.charCodeAt(i)) | 0;
    const seed = Math.abs(h);
    return {
      date: today,
      votes: {
        bull: (seed % 230) + 180,
        bear: ((seed >> 4) % 180) + 120,
        side: ((seed >> 8) % 120) + 60,
      },
      mine: null,
    };
  })();

  useEffect(() => {
    if (!state || state.date !== today) setState(cur);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  const vote = useCallback((choice: PollChoice) => {
    setState(prev => {
      const base: PollState = prev && prev.date === today ? prev : cur;
      if (base.mine === choice) return base;
      const votes = { ...base.votes };
      if (base.mine) votes[base.mine] = Math.max(0, votes[base.mine] - 1);
      votes[choice] = votes[choice] + 1;
      return { ...base, votes, mine: choice };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, setState]);

  const total = cur.votes.bull + cur.votes.bear + cur.votes.side;
  return { poll: cur, vote, total };
}

// ─── Reading Streak ───────────────────────────
export interface StreakState {
  count: number;
  lastDate: string;
}
export function useReadingStreak() {
  const [s, setS] = useLSState<StreakState>(KEYS.streak, { count: 0, lastDate: '' });
  const ping = useCallback(() => {
    const today = todayKey();
    setS(prev => {
      if (prev.lastDate === today) return prev;
      const yest = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
      const count = prev.lastDate === yest ? prev.count + 1 : 1;
      return { count, lastDate: today };
    });
  }, [setS]);
  return { streak: s, ping };
}

// ─── Article meta helpers (deterministic) ───────────────────────────
export interface ArticleMeta {
  readMinutes: number;
  impact: 'Cao' | 'Trung Bình' | 'Thấp';
  impactColor: string;
}
export function getArticleMeta(article: { id: string; full_content?: string; summary?: string; title: string; stream: string }): ArticleMeta {
  const text = (article.full_content || article.summary || article.title || '').trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  // Vietnamese reading speed ~ 220 wpm
  const readMinutes = Math.max(1, Math.round(words / 220));
  let h = 0;
  for (let i = 0; i < article.id.length; i++) h = ((h << 5) - h + article.id.charCodeAt(i)) | 0;
  const seed = Math.abs(h);
  const streamWeight = article.stream === 'hot' || article.stream === 'macro' ? 2 : article.stream === 'whale' ? 1 : 0;
  const score = (seed % 10) + streamWeight;
  if (score >= 8) return { readMinutes, impact: 'Cao', impactColor: 'text-rose-400 border-rose-400/40 bg-rose-400/10' };
  if (score >= 4) return { readMinutes, impact: 'Trung Bình', impactColor: 'text-amber-400 border-amber-400/40 bg-amber-400/10' };
  return { readMinutes, impact: 'Thấp', impactColor: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10' };
}
