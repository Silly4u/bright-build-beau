import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Calendar, Newspaper, ChevronDown, AlertCircle } from 'lucide-react';

const Stars: React.FC<{ count: number }> = ({ count }) => (
  <span className="inline-flex gap-px" aria-label={`${count} sao`}>
    {[1, 2, 3].map(i => (
      <span key={i} className={`text-[10px] leading-none ${i <= count ? (count === 3 ? 'text-neon-red' : 'text-yellow-400') : 'text-white/15'}`}>★</span>
    ))}
  </span>
);

function useCountdown(target: string): { label: string; soon: boolean; live: boolean; past: boolean } {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = new Date(target).getTime() - now;
  if (diff <= -30 * 60 * 1000) return { label: 'đã ra', soon: false, live: false, past: true };
  if (diff <= 0) return { label: 'ĐANG DIỄN RA', soon: true, live: true, past: false };
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const label = h > 0 ? `${h}g ${m}p` : m > 0 ? `${m}p ${s}s` : `${s}s`;
  return { label, soon: diff <= 30 * 60 * 1000, live: false, past: false };
}

const EventRow: React.FC<{ ev: EconEvent; isLast: boolean }> = ({ ev, isLast }) => {
  const t = new Date(ev.event_time);
  const timeStr = t.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = t.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  const stars = ev.impact === 'high' ? 3 : 2;
  const cd = useCountdown(ev.event_time);

  return (
    <Link
      to="/lich-kinh-te"
      className={`block p-3 hover:bg-white/5 transition-colors relative ${isLast ? '' : 'border-b border-white/5'} ${cd.live ? 'bg-neon-red/10' : cd.soon ? 'bg-yellow-400/[0.04]' : ''}`}
    >
      {cd.soon && !cd.past && (
        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-neon-red animate-pulse" />
      )}
      <div className="flex justify-between items-start gap-2 mb-1">
        <span className="font-mono text-[10px] text-muted-foreground">
          {timeStr} • {dateStr}
        </span>
        <div className="flex items-center gap-1.5">
          {cd.soon && !cd.past && (
            <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase font-bold text-neon-red">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-red opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neon-red" />
              </span>
              {cd.label}
            </span>
          )}
          {!cd.soon && !cd.past && (
            <span className="font-mono text-[9px] text-muted-foreground/60">{cd.label}</span>
          )}
          <Stars count={stars} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-base">{ev.flag}</span>
        <span className={`text-sm line-clamp-2 leading-tight ${cd.past ? 'text-muted-foreground/60' : 'text-foreground'}`}>{ev.event_name}</span>
      </div>
    </Link>
  );
};

interface NewsItem {
  id: string;
  title: string;
  summary: string | null;
  image_url: string | null;
  badge: string | null;
  published_at: string;
}

interface EconEvent {
  id: string;
  event_time: string;
  event_name: string;
  country: string;
  flag: string;
  impact: string;
}

const HOW_STEPS = [
  { num: '01', title: 'ĐĂNG KÝ TÀI KHOẢN', desc: 'Tạo tài khoản miễn phí trong 30 giây. Truy cập ngay vào platform.', to: '/auth' },
  { num: '02', title: 'KẾT NỐI TELEGRAM', desc: 'Tham gia kênh VIP để nhận tín hiệu real-time và phân tích chuyên sâu.', to: '/services' },
  { num: '03', title: 'NHẬN TÍN HIỆU', desc: 'AI phân tích 24/7 và gửi setup chính xác đến bạn ngay khi cơ hội xuất hiện.', to: '/indicators' },
  { num: '04', title: 'GIAO DỊCH AN TOÀN', desc: 'Theo dõi performance, quản lý risk, và scale lệnh có hệ thống.', to: '/phan-tich' },
];

const FAQS = [
  {
    q: 'Tín hiệu được tạo ra như thế nào?',
    a: 'Hệ thống dùng AI multi-model (Gemini Pro + GPT-5) kết hợp 10+ chỉ báo kỹ thuật (Smart Money Concept, AlphaNet, Wyckoff, BB, RSI, Volume Profile) để quét 24/7 trên BTC, ETH, XAU và các coin top.',
  },
  {
    q: 'Tỉ lệ thắng thực tế là bao nhiêu?',
    a: 'Win-rate trung bình 30 ngày gần nhất là 87.4% trên các tín hiệu CỰC MẠNH (3+ confluence). Toàn bộ lịch sử lệnh được lưu công khai tại trang Phân tích.',
  },
  {
    q: 'Có mất phí gì không?',
    a: 'Truy cập trang web, tin tức và lịch kinh tế hoàn toàn miễn phí. Telegram VIP và indicator pro yêu cầu gói tháng — xem chi tiết tại Dịch vụ.',
  },
  {
    q: 'Tôi mới giao dịch, có theo được không?',
    a: 'Có. Mỗi tín hiệu đều có Entry / TP / SL rõ ràng và phần giải thích logic bằng tiếng Việt. Ngoài ra có Từ điển và bài Phân tích miễn phí để học theo.',
  },
];

const MatrixContentDiscovery: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EconEvent[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    (async () => {
      const [newsRes, eventRes] = await Promise.all([
        supabase
          .from('news_articles')
          .select('id,title,summary,image_url,badge,published_at')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(3),
        supabase
          .from('economic_events')
          .select('id,event_time,event_name,country,flag,impact')
          .gte('event_time', new Date().toISOString())
          .in('impact', ['high', 'medium'])
          .order('event_time', { ascending: true })
          .limit(4),
      ]);
      if (newsRes.data) setNews(newsRes.data);
      if (eventRes.data) setEvents(eventRes.data);
    })();
  }, []);

  return (
    <section className="px-6 lg:px-12 py-16 space-y-16">
      {/* News + Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured News (2 cols) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-xs text-cyan-brand font-bold tracking-[0.2em] flex items-center gap-2">
              <Newspaper className="w-4 h-4" />
              TIN_NÓNG
            </h2>
            <Link
              to="/tin-tuc"
              className="font-mono text-[10px] text-muted-foreground hover:text-cyan-brand uppercase tracking-widest flex items-center gap-1"
            >
              XEM TẤT CẢ <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.length === 0 &&
              [...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse" />
              ))}
            {news.map(n => (
              <Link
                key={n.id}
                to={`/tin-tuc/${n.id}`}
                className="group bg-[#0D0F16] border border-white/10 hover:border-cyan-brand/40 transition-all overflow-hidden flex flex-col"
              >
                {n.image_url && (
                  <div className="aspect-video overflow-hidden bg-navy">
                    <img
                      src={n.image_url}
                      alt={n.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col gap-2">
                  {n.badge && (
                    <span className="font-mono text-[10px] text-uv uppercase tracking-widest w-max border border-uv/30 bg-uv/5 px-1.5 py-0.5">
                      {n.badge}
                    </span>
                  )}
                  <h3 className="font-bold text-sm text-foreground line-clamp-3 group-hover:text-cyan-brand transition-colors">
                    {n.title}
                  </h3>
                  <span className="mt-auto font-mono text-[10px] text-muted-foreground">
                    {new Date(n.published_at).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Economic Calendar Preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-xs text-uv font-bold tracking-[0.2em] flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              SỰ_KIỆN_SẮP_TỚI
            </h2>
            <Link
              to="/lich-kinh-te"
              className="font-mono text-[10px] text-muted-foreground hover:text-uv uppercase tracking-widest flex items-center gap-1"
            >
              LỊCH ĐẦY ĐỦ <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-[#0D0F16] border border-white/10">
            {events.length === 0 &&
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-white/5 animate-pulse border-b border-white/5" />
              ))}
            {events.map((e, i) => {
              const t = new Date(e.event_time);
              const timeStr = t.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
              const dateStr = t.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
              const impactColor =
                e.impact === 'high' ? 'text-neon-red border-neon-red/30 bg-neon-red/5' : 'text-cyan-brand border-cyan-brand/30 bg-cyan-brand/5';
              return (
                <Link
                  key={e.id}
                  to="/lich-kinh-te"
                  className={`block p-3 hover:bg-white/5 transition-colors ${i < events.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {timeStr} • {dateStr}
                    </span>
                    <span className={`font-mono text-[9px] uppercase border px-1.5 py-0.5 ${impactColor}`}>
                      {e.impact}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{e.flag}</span>
                    <span className="text-sm text-foreground line-clamp-2 leading-tight">{e.event_name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div>
        <div className="text-center mb-8">
          <span className="font-mono text-xs text-cyan-brand uppercase tracking-[0.3em]">// QUY_TRÌNH</span>
          <h2 className="font-display text-3xl lg:text-5xl font-bold uppercase tracking-tight mt-3 text-foreground">
            Cách <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#00F0FF,#D926A9)]">Vận Hành</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/5 p-[1px]">
          {HOW_STEPS.map((step, i) => (
            <Link
              key={step.num}
              to={step.to}
              className="bg-[#0D0F16] p-6 hover:bg-[#161A26] transition-colors group relative block"
            >
              <div
                className={`font-mono text-5xl font-bold mb-4 ${
                  i % 2 === 0 ? 'text-cyan-brand' : 'text-uv'
                } group-hover:drop-shadow-[0_0_15px_currentColor] transition-all`}
              >
                {step.num}
              </div>
              <h3 className="font-bold text-foreground text-sm mb-2 tracking-wider group-hover:text-cyan-brand transition-colors">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="font-mono text-xs text-uv uppercase tracking-[0.3em]">// CÂU_HỎI</span>
          <h2 className="font-display text-3xl lg:text-5xl font-bold uppercase tracking-tight mt-3 text-foreground">
            Thường <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#D926A9,#00F0FF)]">Gặp</span>
          </h2>
        </div>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <button
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left bg-[#0D0F16] border border-white/10 hover:border-cyan-brand/40 transition-colors"
            >
              <div className="p-4 flex items-center justify-between gap-4">
                <span className="font-mono text-sm text-foreground font-semibold">
                  <span className="text-cyan-brand mr-2">[{String(i + 1).padStart(2, '0')}]</span>
                  {f.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                    openFaq === i ? 'rotate-180 text-cyan-brand' : ''
                  }`}
                />
              </div>
              {openFaq === i && (
                <div className="px-4 pb-4 pt-0 border-t border-white/5">
                  <p className="text-sm text-muted-foreground leading-relaxed pt-3">{f.a}</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MatrixContentDiscovery;
