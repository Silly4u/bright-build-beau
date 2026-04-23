import React from 'react';
import { useReactions, type ReactionType } from '@/hooks/useNewsLocal';

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'fire', emoji: '🔥', label: 'Hot' },
  { type: 'bull', emoji: '🚀', label: 'Bullish' },
  { type: 'bear', emoji: '📉', label: 'Bearish' },
  { type: 'shock', emoji: '😱', label: 'Sốc' },
  { type: 'like', emoji: '👍', label: 'Hay' },
];

const ReactionBar: React.FC<{ articleId: string; compact?: boolean }> = ({ articleId, compact = false }) => {
  const { counts, mine, react } = useReactions(articleId);

  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? '' : ''}`}>
      {REACTIONS.map(r => {
        const active = mine === r.type;
        return (
          <button
            key={r.type}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); react(r.type); }}
            className={`flex items-center gap-1 ${compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-xs'} rounded-full border transition-all ${
              active
                ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-400'
                : 'border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground'
            }`}
            title={r.label}
            aria-label={`${r.label}: ${counts[r.type]}`}
          >
            <span className={compact ? 'text-xs' : 'text-sm'}>{r.emoji}</span>
            <span className="font-mono font-bold">{counts[r.type]}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ReactionBar;
