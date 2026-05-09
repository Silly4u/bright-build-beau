import React from 'react';
import { useDailyPoll, type PollChoice } from '@/hooks/useNewsLocal';

const CHOICES: { id: PollChoice; label: string; icon: string; color: string; bar: string }[] = [
  { id: 'bull', label: 'Tăng 🚀', icon: '🟢', color: 'text-emerald-400', bar: 'bg-emerald-400' },
  { id: 'side', label: 'Sideway', icon: '⚪', color: 'text-amber-400', bar: 'bg-amber-400' },
  { id: 'bear', label: 'Giảm 📉', icon: '🔴', color: 'text-rose-400', bar: 'bg-rose-400' },
];

const MiniPoll: React.FC = () => {
  const { poll, vote, total } = useDailyPoll();
  const voted = poll.mine !== null;

  return (
    <div className="bg-[#0d1526] border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-violet-400/90 uppercase tracking-widest">🎯 Khảo Sát Hôm Nay</span>
        <span className="text-[10px] text-muted-foreground/60 font-mono">{total} votes</span>
      </div>
      <div className="p-4">
        <div className="text-xs font-semibold text-foreground mb-3 leading-snug">
          BTC sẽ đi đâu trong 24 giờ tới?
        </div>
        <div className="space-y-2">
          {CHOICES.map(c => {
            const count = poll.votes[c.id];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const mine = poll.mine === c.id;
            return (
              <button
                key={c.id}
                onClick={() => vote(c.id)}
                className={`w-full relative overflow-hidden rounded-lg border text-left transition-all ${
                  mine ? 'border-cyan-400/60 bg-cyan-400/5' : 'border-white/5 hover:border-white/20'
                }`}
              >
                {voted && (
                  <div
                    className={`absolute inset-y-0 left-0 ${c.bar} opacity-15 transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between px-3 py-2">
                  <span className={`text-xs font-bold ${c.color}`}>{c.label}</span>
                  {voted && (
                    <span className="text-[10px] font-mono font-bold text-foreground">
                      {pct}% · {count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {!voted && (
          <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
            👆 Bình chọn để xem kết quả
          </p>
        )}
        {voted && (
          <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
            Reset mỗi ngày · Cảm ơn bạn đã tham gia!
          </p>
        )}
      </div>
    </div>
  );
};

export default MiniPoll;
