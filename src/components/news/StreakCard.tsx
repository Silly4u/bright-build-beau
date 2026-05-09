import React from 'react';
import { useReadingStreak, useReadHistory, useBookmarks } from '@/hooks/useNewsLocal';

const StreakCard: React.FC = () => {
  const { streak } = useReadingStreak();
  const { history } = useReadHistory();
  const { bookmarks } = useBookmarks();

  return (
    <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-4">
      <div className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest mb-3">🏆 Hoạt Động</div>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center bg-amber-400/5 border border-amber-400/20 rounded-lg p-2">
          <div className="text-lg font-display font-black text-amber-400">{streak.count}</div>
          <div className="text-[9px] text-muted-foreground/70 uppercase tracking-wide">Day Streak</div>
        </div>
        <div className="text-center bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-2">
          <div className="text-lg font-display font-black text-cyan-400">{history.length}</div>
          <div className="text-[9px] text-muted-foreground/70 uppercase tracking-wide">Đã đọc</div>
        </div>
        <div className="text-center bg-violet-400/5 border border-violet-400/20 rounded-lg p-2">
          <div className="text-lg font-display font-black text-violet-400">{bookmarks.length}</div>
          <div className="text-[9px] text-muted-foreground/70 uppercase tracking-wide">Đã lưu</div>
        </div>
      </div>
      {streak.count >= 3 && (
        <div className="mt-3 text-[10px] text-center text-amber-400/80">
          🔥 Tuyệt vời! Giữ nhịp mỗi ngày!
        </div>
      )}
    </div>
  );
};

export default StreakCard;
