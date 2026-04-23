import React, { useState } from 'react';

const ShareButtons: React.FC<{ title: string; url?: string }> = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  const link = url || (typeof window !== 'undefined' ? window.location.href : '');
  const text = encodeURIComponent(title);
  const enc = encodeURIComponent(link);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mr-1">Chia sẻ</span>
      <a
        href={`https://t.me/share/url?url=${enc}&text=${text}`}
        target="_blank" rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 flex items-center justify-center text-cyan-400 transition-all"
        title="Chia sẻ Telegram"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${enc}&text=${text}`}
        target="_blank" rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-foreground transition-all"
        title="Chia sẻ X"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`}
        target="_blank" rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 flex items-center justify-center text-blue-400 transition-all"
        title="Chia sẻ Facebook"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073"/></svg>
      </a>
      <button
        onClick={copy}
        className={`px-3 h-8 rounded-full border text-[10px] font-bold transition-all ${
          copied ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-400' : 'border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/20'
        }`}
        title="Copy link"
      >
        {copied ? '✓ ĐÃ COPY' : '🔗 COPY LINK'}
      </button>
    </div>
  );
};

export default ShareButtons;
