import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEconomicEvents } from '@/hooks/useEconomicEvents';

function fmtCountdown(target: Date): { text: string; soon: boolean; live: boolean; past: boolean } {
  const diff = target.getTime() - Date.now();
  const past = diff < -30 * 60_000;
  const live = diff <= 0 && diff > -30 * 60_000;
  const soon = diff > 0 && diff < 30 * 60_000;
  if (live) return { text: 'ĐANG DIỄN RA', soon: false, live: true, past: false };
  if (past) return { text: 'Đã kết thúc', soon: false, live: false, past: true };
  const abs = Math.abs(diff);
  const d = Math.floor(abs / 86400000);
  const h = Math.floor((abs % 86400000) / 3600000);
  const m = Math.floor((abs % 3600000) / 60000);
  if (d > 0) return { text: `còn ${d}n ${h}g`, soon: false, live: false, past: false };
  if (h > 0) return { text: `còn ${h}g ${m}p`, soon, live: false, past: false };
  return { text: `còn ${m}p`, soon: true, live: false, past: false };
}

const NewsSidebar: React.FC = () => {
  const { events } = useEconomicEvents();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  // 2-3 sao + sắp tới hoặc đang diễn ra
  const upcoming = events
    .filter(e => {
      const isHigh = e.impact === 'high' || e.impact === 'medium';
      const t = new Date(e.event_time).getTime();
      return isHigh && t > Date.now() - 30 * 60_000;
    })
    .slice(0, 3);

  return (
    <aside className="space-y-4 sticky top-24">
      {/* Lịch kinh tế 2-3 sao */}
      <div className="bg-[#0d1526] border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest">📅 Sự kiện sắp tới</span>
          <Link to="/lich-kinh-te" className="text-[10px] text-cyan-400 hover:underline">Đầy đủ →</Link>
        </div>
        <div className="divide-y divide-white/5">
          {upcoming.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground/60">
              Không có sự kiện nào sắp tới
            </div>
          )}
          {upcoming.map(ev => {
            const stars = ev.impact === 'high' ? 3 : 2;
            const cd = fmtCountdown(new Date(ev.event_time));
            void tick;
            return (
              <Link
                key={ev.id}
                to="/lich-kinh-te"
                className={`block px-4 py-3 hover:bg-white/5 transition-colors relative ${cd.soon || cd.live ? 'bg-rose-500/5' : ''}`}
              >
                {(cd.soon || cd.live) && (
                  <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-rose-400 animate-pulse" />
                )}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{ev.flag}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/70">{ev.country}</span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: stars }).map((_, i) => (
                      <span key={i} className={`text-[8px] ${stars === 3 ? 'text-rose-400' : 'text-amber-400'}`}>★</span>
                    ))}
                  </div>
                </div>
                <div className="text-xs font-semibold text-foreground line-clamp-2 mb-1">{ev.event_name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/60 font-mono">
                    {new Date(ev.event_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className={`text-[10px] font-bold font-mono ${
                    cd.live ? 'text-rose-400 animate-pulse' :
                    cd.soon ? 'text-rose-400' :
                    cd.past ? 'text-muted-foreground/40' :
                    'text-cyan-400'
                  }`}>
                    {cd.text}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA Telegram dính */}
      <a
        href="https://t.me/UNCLETRADER"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-violet-500/20 border border-cyan-400/30 rounded-2xl p-5 hover:border-cyan-400/60 hover:scale-[1.02] transition-all group"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🚀</span>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">FREE SIGNAL</span>
        </div>
        <div className="text-sm font-display font-bold text-foreground mb-1.5 leading-tight">
          Nhận tín hiệu BUY/SELL tức thì qua Telegram
        </div>
        <div className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
          • Cảnh báo trước khi tin ra<br />
          • Setup BTC/ETH/SOL hằng ngày<br />
          • Cá voi nạp/rút real-time
        </div>
        <div className="text-[11px] font-bold text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
          Tham gia miễn phí →
        </div>
      </a>
    </aside>
  );
};

export default NewsSidebar;
