import React from 'react';
import { useBookmarks } from '@/hooks/useNewsLocal';

interface Props {
  id: string;
  title: string;
  stream: string;
  size?: 'sm' | 'md';
}

const BookmarkButton: React.FC<Props> = ({ id, title, stream, size = 'sm' }) => {
  const { isBookmarked, toggle } = useBookmarks();
  const saved = isBookmarked(id);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle({ id, title, stream }); }}
      className={`${size === 'sm' ? 'w-8 h-8' : 'w-10 h-10'} rounded-full flex items-center justify-center border transition-all ${
        saved
          ? 'bg-amber-400/20 border-amber-400/50 text-amber-400'
          : 'bg-white/5 border-white/10 text-muted-foreground hover:border-amber-400/30 hover:text-amber-400'
      }`}
      title={saved ? 'Bỏ lưu' : 'Lưu để đọc sau'}
      aria-label={saved ? 'Bỏ lưu' : 'Lưu'}
    >
      <svg viewBox="0 0 24 24" className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${saved ? 'fill-current' : 'fill-none stroke-current stroke-2'}`}>
        <path d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-4-7 4V5z" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default BookmarkButton;
