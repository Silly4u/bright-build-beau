import React, { useState } from 'react';
import { useStreak } from '@/hooks/useAnalysisLocal';
import { Flame, Check } from 'lucide-react';
import { toast } from 'sonner';

const StreakBadge: React.FC = () => {
  const { count, longest, canCheckIn, checkIn } = useStreak();
  const [animating, setAnimating] = useState(false);

  const handleCheckIn = () => {
    if (!canCheckIn) return;
    checkIn();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 1500);
    toast.success(`🔥 Streak +1 — Bạn đã ${count + 1} ngày liên tiếp!`, {
      description: count + 1 >= 7 ? 'Đẳng cấp Trader chuyên nghiệp 💎' : 'Tiếp tục giữ phong độ mỗi ngày!',
    });
  };

  const tier = count >= 30 ? { label: 'DIAMOND', color: 'text-cyan-300', glow: 'shadow-cyan-500/30' }
    : count >= 14 ? { label: 'GOLD', color: 'text-amber-300', glow: 'shadow-amber-500/30' }
    : count >= 7 ? { label: 'SILVER', color: 'text-slate-300', glow: 'shadow-slate-500/30' }
    : { label: 'STARTER', color: 'text-orange-400', glow: 'shadow-orange-500/30' };

  return (
    <button
      onClick={handleCheckIn}
      disabled={!canCheckIn}
      className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all ${
        canCheckIn
          ? 'border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 hover:border-orange-400/60 cursor-pointer'
          : `border-white/10 bg-white/[0.03] cursor-default ${tier.glow} shadow-lg`
      } ${animating ? 'animate-pulse scale-105' : ''}`}
      title={canCheckIn ? 'Nhấn để check-in hôm nay' : `Đã check-in · Streak ${count} ngày · Tier ${tier.label}`}
    >
      <Flame className={`w-4 h-4 ${canCheckIn ? 'text-orange-400 animate-pulse' : tier.color} transition-colors`} />
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-bold font-mono ${canCheckIn ? 'text-orange-400' : tier.color}`}>{count}</span>
        <span className="text-[9px] text-muted-foreground/70 uppercase tracking-wider">{canCheckIn ? 'check-in' : 'ngày'}</span>
      </div>
      {!canCheckIn && (
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10">
          <Check className="w-2.5 h-2.5 text-emerald-400" />
          <span className={`text-[8px] font-bold ${tier.color}`}>{tier.label}</span>
        </div>
      )}
      {longest > count && longest > 0 && !canCheckIn && (
        <span className="text-[9px] text-muted-foreground/50 font-mono">best: {longest}</span>
      )}
    </button>
  );
};

export default StreakBadge;
