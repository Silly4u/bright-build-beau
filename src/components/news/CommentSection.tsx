import React, { useState } from 'react';
import { useComments } from '@/hooks/useNewsLocal';

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

const CommentSection: React.FC<{ articleId: string }> = ({ articleId }) => {
  const { comments, add, remove } = useComments(articleId);
  const [author, setAuthor] = useState(() => {
    try { return localStorage.getItem('news:author') || ''; } catch { return ''; }
  });
  const [text, setText] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    try { localStorage.setItem('news:author', author); } catch { /* ignore */ }
    add(author, text);
    setText('');
  };

  return (
    <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-bold text-foreground">
          💬 Bình luận <span className="text-muted-foreground/60 font-mono">({comments.length})</span>
        </h3>
        <span className="text-[9px] text-muted-foreground/50 font-mono">Lưu local · Ẩn danh</span>
      </div>

      <form onSubmit={submit} className="space-y-2 mb-4">
        <input
          type="text"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Tên hiển thị (tuỳ chọn)"
          maxLength={30}
          className="w-full bg-[#0b1120] border border-white/10 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-cyan-400/40 outline-none"
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Chia sẻ góc nhìn của bạn..."
          rows={2}
          maxLength={500}
          className="w-full bg-[#0b1120] border border-white/10 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-cyan-400/40 outline-none resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground/60 font-mono">{text.length}/500</span>
          <button
            type="submit"
            disabled={!text.trim()}
            className="px-4 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 text-[11px] font-bold hover:bg-cyan-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Gửi bình luận
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {comments.length === 0 && (
          <div className="text-center py-6 text-xs text-muted-foreground/60">
            Chưa có bình luận. Hãy là người đầu tiên!
          </div>
        )}
        {comments.map(c => (
          <div key={c.id} className="bg-[#0b1120] border border-white/5 rounded-lg p-3 group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white">
                  {c.author.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-foreground">{c.author}</span>
                <span className="text-[10px] text-muted-foreground/60 font-mono">{timeAgo(c.created_at)}</span>
              </div>
              <button
                onClick={() => remove(c.id)}
                className="text-[10px] text-muted-foreground/40 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                title="Xoá (chỉ máy bạn)"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pl-8">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
