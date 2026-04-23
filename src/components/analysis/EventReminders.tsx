import React, { useEffect, useMemo, useState } from 'react';
import { useEconomicEvents } from '@/hooks/useEconomicEvents';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { ensureNotificationPermission, fireNotification } from '@/hooks/useAnalysisLocal';

function timeUntil(target: Date): { text: string; soon: boolean; live: boolean; past: boolean; ms: number } {
  const diff = target.getTime() - Date.now();
  const past = diff < -30 * 60_000;
  const live = diff <= 0 && diff > -30 * 60_000;
  const soon = diff > 0 && diff < 30 * 60_000;
  if (live) return { text: 'ĐANG DIỄN RA', soon: false, live: true, past: false, ms: diff };
  if (past) return { text: 'Đã kết thúc', soon: false, live: false, past: true, ms: diff };
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 3600_000);
  const m = Math.floor((abs % 3600_000) / 60_000);
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return { text: `${d}n ${h % 24}g`, soon: false, live: false, past: false, ms: diff };
  }
  if (h > 0) return { text: `${h}g ${m}p`, soon, live: false, past: false, ms: diff };
  return { text: `${m} phút`, soon: true, live: false, past: false, ms: diff };
}

const EventReminders: React.FC = () => {
  const { events } = useEconomicEvents();
  const [tick, setTick] = useState(0);
  const [notified, setNotified] = useState<Set<string>>(new Set());

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  // Only 2-3 star events in next 24h
  const upcoming = useMemo(() => {
    return events
      .filter(e => {
        const isHigh = e.impact === 'high' || e.impact === 'medium';
        const t = new Date(e.event_time).getTime();
        return isHigh && t > Date.now() - 30 * 60_000 && t < Date.now() + 24 * 3600_000;
      })
      .slice(0, 5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, tick]);

  // Auto trigger notification when event is <15 min away
  useEffect(() => {
    upcoming.forEach(ev => {
      const cd = timeUntil(new Date(ev.event_time));
      if (cd.ms > 0 && cd.ms < 15 * 60_000 && !notified.has(ev.id)) {
        const stars = ev.impact === 'high' ? '★★★' : '★★';
        toast.warning(`⏰ ${stars} ${ev.event_name}`, {
          description: `${ev.country} · còn ${Math.ceil(cd.ms / 60_000)} phút · Cẩn thận biến động vol`,
          duration: 8000,
        });
        fireNotification(`⏰ ${ev.event_name}`, `${ev.country} · còn ${Math.ceil(cd.ms / 60_000)} phút`);
        setNotified(prev => new Set(prev).add(ev.id));
      }
    });
  }, [upcoming, notified]);

  const enableNoti = async () => {
    const ok = await ensureNotificationPermission();
    if (ok) toast.success('Đã bật cảnh báo trình duyệt cho sự kiện');
    else toast.error('Trình duyệt từ chối cấp quyền thông báo');
  };

  if (upcoming.length === 0) {
    return (
      <div className="glass-card rounded-xl p-3 text-center">
        <div className="text-[10px] text-muted-foreground/60 font-mono">Không có sự kiện 2-3 sao trong 24h tới</div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Sự kiện 24h tới</span>
        </div>
        <button
          onClick={enableNoti}
          className="text-[9px] text-cyan-400 hover:text-cyan-300 font-mono"
          title="Cho phép cảnh báo trình duyệt"
        >
          🔔 Bật noti
        </button>
      </div>
      <div className="divide-y divide-white/5 max-h-[280px] overflow-y-auto scrollbar-thin">
        {upcoming.map(ev => {
          const stars = ev.impact === 'high' ? 3 : 2;
          const cd = timeUntil(new Date(ev.event_time));
          return (
            <div key={ev.id} className={`px-3 py-2 relative ${cd.soon || cd.live ? 'bg-rose-500/5' : ''}`}>
              {(cd.soon || cd.live) && (
                <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-rose-400 animate-pulse" />
              )}
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-xs">{ev.flag}</span>
                  <span className="text-[9px] font-mono text-muted-foreground/70">{ev.country}</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <span key={i} className={`text-[8px] ${stars === 3 ? 'text-rose-400' : 'text-amber-400'}`}>★</span>
                  ))}
                </div>
              </div>
              <div className="text-[11px] font-semibold text-foreground line-clamp-1 mb-1">{ev.event_name}</div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground/60 font-mono">
                  {new Date(ev.event_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className={`text-[9px] font-bold font-mono ${
                  cd.live ? 'text-rose-400 animate-pulse' :
                  cd.soon ? 'text-rose-400' :
                  'text-cyan-400'
                }`}>
                  {cd.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventReminders;
