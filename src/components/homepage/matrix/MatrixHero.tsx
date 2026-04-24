import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, MessageCircle, BarChart3 } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/contact';

const MatrixHero: React.FC = () => {
  const [version, setVersion] = useState('V.3.0.4');
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative py-8 lg:py-12 overflow-hidden">
      {/* Tag chip */}
      <div className="relative inline-flex max-w-full items-center gap-2 border border-secondary/30 bg-secondary/10 px-3 py-1.5 mb-7 shadow-violet-glow">
        <span className="size-1.5 bg-secondary rounded-full animate-ping shrink-0" />
        <span className="font-mono text-[10px] sm:text-[11px] text-secondary-foreground uppercase tracking-[0.18em] truncate">
          {version} • Hệ thống đang hoạt động • {time}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Hero Text */}
        <div className="lg:col-span-10 flex flex-col gap-7 lg:gap-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase tracking-normal leading-[0.86] text-foreground font-display max-w-[10ch]">
            Giao Dịch
            <br />
            <span className="text-primary drop-shadow-[0_0_30px_hsl(var(--primary)/0.28)]">
              Tốc Độ Quang
            </span>
            <br />
            Không Độ Trễ.
          </h1>

          <p className="font-mono text-muted-foreground text-sm sm:text-base lg:text-lg max-w-[58ch] border-l-2 border-primary/50 pl-4 leading-relaxed">
            Cắm trực tiếp vào ma trận thị trường. Tín hiệu siêu tốc, phân tích AI thời gian thực,
            cộng đồng trader chuyên nghiệp Việt Nam.
          </p>

          {/* Multi CTA */}
          <div className="flex flex-wrap items-center gap-3 lg:gap-4">
            <Link
              to="/auth"
              className="group bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm lg:text-base px-6 lg:px-8 py-3 lg:py-4 border-2 border-primary shadow-cyan-glow hover:bg-foreground hover:border-foreground transition-all duration-300 inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Đăng Ký Ngay
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={CONTACT_INFO.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-background/70 text-secondary-foreground font-bold uppercase tracking-widest text-sm lg:text-base px-6 lg:px-8 py-3 lg:py-4 border-2 border-secondary shadow-violet-glow hover:bg-secondary hover:text-secondary-foreground transition-all duration-300 inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Telegram VIP
            </a>
            <Link
              to="/services"
              className="text-muted-foreground hover:text-primary font-mono text-sm uppercase tracking-widest underline underline-offset-4 px-4 py-3 transition-colors inline-flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Xem Dịch Vụ
              <span className="text-primary">→</span>
            </Link>
          </div>
        </div>

        {/* Right side reserved for live widgets — rendered by parent */}
        <div className="lg:col-span-5" id="matrix-hero-right-anchor" />
      </div>
    </section>
  );
};

export default MatrixHero;
