import { useState, useEffect, useCallback } from 'react';

const KEYS = {
  bookmarks: 'news:bookmarks',
  history: 'news:history',
  reactions: 'news:reactions',
  comments: 'news:comments',
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
