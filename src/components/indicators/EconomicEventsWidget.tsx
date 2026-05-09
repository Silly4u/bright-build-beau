import React from 'react';
import { Link } from 'react-router-dom';
import { useEconomicEvents } from '@/hooks/useEconomicEvents';

const impactStyle = (impact: string) => {
  const i = (impact || '').toLowerCase();
  if (i.includes('high') || i.includes('cao')) return { bg: 'bg-[#f6465d]/15', text: 'text-[#f6465d]', label: 'CAO', dot: '#f6465d' };
  if (i.includes('med') || i.includes('trung')) return { bg: 'bg-[#fcd535]/15', text: 'text-[#fcd535]', label: 'TB', dot: '#fcd535' };
  return { bg: 'bg-[#848e9c]/15', text: 'text-[#848e9c]', label: 'THẤP', dot: '#848e9c' };
};

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const tmr = new Date(now); tmr.setDate(now.getDate() + 1);
  const isTmr = d.toDateString() === tmr.toDateString();
  const hh = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
  if (sameDay) return { tag: 'HÔM NAY', time: hh };
  if (isTmr) return { tag: 'NGÀY MAI', time: hh };
  return { tag: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }), time: hh };
};

const EconomicEventsWidget: React.FC = () => {
  const { events, loading } = useEconomicEvents();
  const now = Date.now();
  const cutoff = now + 48 * 3600 * 1000;
  const upcoming = events
    .filter(e => {
      const t = new Date(e.event_time).getTime();
      return t >= now - 30 * 60 * 1000 && t <= cutoff;
    })
    .slice(0, 6);

  return (
    <div className="border border-[#2b3139] rounded-md overflow-hidden bg-[#0b0e11]">
      <div className="flex items-center justify-between bg-[#1e2329] px-2 py-1.5 border-b border-[#2b3139]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fcd535] animate-pulse" />
          <span className="text-[9px] font-mono font-bold tracking-[0.18em] text-[#fcd535]">📅 LỊCH KINH TẾ · 48H</span>
        </div>
        <Link
          to="/lich-kinh-te"
          className="text-[8px] font-mono text-[#848e9c] hover:text-[#fcd535] transition-colors uppercase tracking-wider"
        >
          Xem tất cả →
        </Link>
      </div>

      {loading ? (
        <div className="p-3 text-center">
          <div className="inline-block w-3 h-3 border-2 border-[#fcd535] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : upcoming.length === 0 ? (
        <p className="p-3 text-[10px] font-mono text-[#5e6673] text-center">Không có sự kiện 48h tới</p>
      ) : (
        <div className="max-h-[280px] overflow-y-auto divide-y divide-[#2b3139]/40">
          {upcoming.map(e => {
            const s = impactStyle(e.impact);
            const t = fmtTime(e.event_time);
            return (
              <div key={e.id} className="px-2 py-1.5 hover:bg-[#2b3139]/30 transition-colors">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[14px] leading-none">{e.flag || '🌐'}</span>
                  <span className="text-[8px] font-mono text-[#5e6673] uppercase tracking-wider">{t.tag}</span>
                  <span className="text-[10px] font-mono text-[#eaecef] font-bold tabular-nums">{t.time}</span>
                  <span className={`ml-auto px-1 py-0.5 rounded text-[8px] font-mono font-bold ${s.bg} ${s.text}`}>
                    {s.label}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-[#eaecef] leading-tight line-clamp-2">{e.event_name}</p>
                {(e.estimate || e.prev) && (
                  <div className="flex items-center gap-2 mt-0.5 text-[9px] font-mono tabular-nums">
                    {e.estimate && <span className="text-[#fcd535]">Est: {e.estimate}</span>}
                    {e.prev && <span className="text-[#5e6673]">Prev: {e.prev}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EconomicEventsWidget;
