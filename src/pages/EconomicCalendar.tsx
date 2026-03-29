import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEconomicEvents, EconomicEvent } from '@/hooks/useEconomicEvents';

const IMPACT_STYLES: Record<string, { badge: string; dot: string; label: string }> = {
  high: { badge: 'text-red-400 bg-red-400/10 border-red-400/30', dot: 'bg-red-400', label: 'CAO' },
  medium: { badge: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', dot: 'bg-yellow-400', label: 'TB' },
  low: { badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', dot: 'bg-emerald-400', label: 'THẤP' },
};

const DATE_FILTERS = [
  { label: 'Hôm nay', value: 'today' },
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'month' },
];

function formatEventTime(timeStr: string): { date: string; time: string } {
  const d = new Date(timeStr);
  const vn = new Date(d.getTime() + 7 * 3600 * 1000);
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const pad = (n: number) => String(n).padStart(2, '0');
  const date = `${days[vn.getUTCDay()]}, ${pad(vn.getUTCDate())}/${pad(vn.getUTCMonth() + 1)}`;
  const time = `${pad(vn.getUTCHours())}:${pad(vn.getUTCMinutes())}`;
  return { date, time };
}

function Countdown({ targetTime }: { targetTime: string }) {
  const [remaining, setRemaining] = useState('');
  useEffect(() => {
    const target = new Date(targetTime);
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) { setRemaining('Đã diễn ra'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h > 0 ? h + 'g ' : ''}${m}p ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTime]);
  return <span className="font-mono-custom text-cyan-400 font-bold">{remaining}</span>;
}

const EconomicCalendar: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('week');
  const [impactFilter, setImpactFilter] = useState<string[]>(['high', 'medium', 'low']);
  const { events, loading } = useEconomicEvents();

  useEffect(() => {
    const els = document.querySelectorAll('.page-reveal');
    els.forEach((el, i) => setTimeout(() => el.classList.add('revealed'), 200 + i * 150));
  }, []);

  const toggleImpact = (level: string) => {
    setImpactFilter(prev => prev.includes(level) ? prev.filter(x => x !== level) : [...prev, level]);
  };

  const now = new Date();
  const filteredEvents = events.filter(ev => {
    if (!impactFilter.includes(ev.impact)) return false;
    const evDate = new Date(ev.event_time);
    if (dateFilter === 'today') {
      return evDate.toDateString() === now.toDateString();
    }
    if (dateFilter === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      return evDate >= startOfWeek && evDate <= endOfWeek;
    }
    if (dateFilter === 'month') {
      return evDate.getMonth() === now.getMonth() && evDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const nextHighImpact = events.find(ev => ev.impact === 'high' && !ev.actual && new Date(ev.event_time) > now);

  // Group by date
  const grouped: Record<string, EconomicEvent[]> = {};
  filteredEvents.forEach(ev => {
    const { date } = formatEventTime(ev.event_time);
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(ev);
  });

  return (
    <main className="min-h-screen bg-navy grain-overlay">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="reveal-hidden page-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 text-emerald-400 text-sm font-medium mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            Dữ liệu thực tế
          </div>
          <h1 className="reveal-hidden page-reveal font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
            Lịch <span className="text-gradient-cyan">Kinh Tế</span>
          </h1>
          <p className="reveal-hidden page-reveal text-muted-foreground text-lg max-w-2xl mx-auto">
            Theo dõi các sự kiện kinh tế quan trọng ảnh hưởng đến thị trường crypto. Chuẩn bị chiến lược giao dịch trước các tin tức lớn.
          </p>
        </div>
      </section>

      {/* Countdown Banner */}
      {nextHighImpact && (
        <section className="pb-6 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-card rounded-xl px-6 py-4 border border-red-400/20 bg-red-400/5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Sự kiện lớn tiếp theo</span>
              </div>
              <div className="flex-1 text-sm text-foreground font-medium">{nextHighImpact.flag} {nextHighImpact.event_name}</div>
              <div className="text-sm text-muted-foreground">Còn: <Countdown targetTime={nextHighImpact.event_time} /></div>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="pb-6 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-xl px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mr-1">Thời gian:</span>
              {DATE_FILTERS.map(f => (
                <button key={f.value} onClick={() => setDateFilter(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${dateFilter === f.value ? 'bg-cyan-400/20 text-cyan-400 font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mr-1">Tác động:</span>
              {(['high', 'medium', 'low'] as const).map(level => {
                const s = IMPACT_STYLES[level];
                return (
                  <button key={level} onClick={() => toggleImpact(level)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${impactFilter.includes(level) ? s.badge : 'text-muted-foreground/40 bg-transparent border-white/10'}`}>
                    <span className={`w-2 h-2 rounded-full ${impactFilter.includes(level) ? s.dot : 'bg-muted-foreground/30'}`} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Events Table */}
      <section className="py-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {loading ? (
            <div className="text-center text-muted-foreground py-12">Đang tải dữ liệu...</div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center text-muted-foreground py-12">Không có sự kiện nào trong khoảng thời gian này.</div>
          ) : (
            Object.entries(grouped).map(([date, evts]) => (
              <div key={date}>
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-8 h-px bg-cyan-400/30" />
                  {date}
                </h3>
                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 text-xs text-muted-foreground/60 uppercase tracking-wider">
                          <th className="text-left px-4 py-3">Giờ (VN)</th>
                          <th className="text-left px-4 py-3">Quốc gia</th>
                          <th className="text-left px-4 py-3">Sự kiện</th>
                          <th className="text-center px-4 py-3">Tác động</th>
                          <th className="text-right px-4 py-3">Thực tế</th>
                          <th className="text-right px-4 py-3">Dự kiến</th>
                          <th className="text-right px-4 py-3">Trước</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {evts.map(ev => {
                          const { time } = formatEventTime(ev.event_time);
                          const style = IMPACT_STYLES[ev.impact] || IMPACT_STYLES.low;
                          const actual = ev.actual || '—';
                          const estimate = ev.estimate || '—';
                          const prev = ev.prev || '—';
                          const isBeat = ev.actual && ev.estimate && parseFloat(ev.actual) > parseFloat(ev.estimate);
                          const isMiss = ev.actual && ev.estimate && parseFloat(ev.actual) < parseFloat(ev.estimate);
                          return (
                            <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-4 py-3 font-mono-custom text-muted-foreground">{time}</td>
                              <td className="px-4 py-3"><span className="mr-1">{ev.flag}</span>{ev.country}</td>
                              <td className="px-4 py-3 text-foreground font-medium">{ev.event_name}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${style.badge}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                                  {style.label}
                                </span>
                              </td>
                              <td className={`px-4 py-3 text-right font-mono-custom font-bold ${isBeat ? 'text-emerald-400' : isMiss ? 'text-red-400' : 'text-muted-foreground'}`}>
                                {actual}{isBeat && ' ▲'}{isMiss && ' ▼'}
                              </td>
                              <td className="px-4 py-3 text-right font-mono-custom text-muted-foreground">{estimate}</td>
                              <td className="px-4 py-3 text-right font-mono-custom text-muted-foreground/60">{prev}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default EconomicCalendar;
