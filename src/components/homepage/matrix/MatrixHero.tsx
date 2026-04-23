import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, MessageCircle, BarChart3 } from 'lucide-react';
import heroMatrixBg from '@/assets/hero-matrix-bg.mp4.asset.json';

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
    <section className="relative pt-20 pb-12 px-6 lg:px-12 overflow-hidden">
      {/* Tag chip */}
      <div className="inline-flex items-center gap-2 border border-uv/30 bg-uv/5 px-3 py-1.5 mb-8 shadow-[0_0_15px_rgba(217,38,169,0.4)]">
        <span className="size-1.5 bg-uv rounded-full animate-ping" />
        <span className="font-mono text-[11px] text-uv uppercase tracking-[0.2em]">
          {version} • Hệ thống đang hoạt động • {time}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Hero Text */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase tracking-tight leading-[0.85] text-foreground font-display">
            Giao Dịch
            <br />
            <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#00F0FF_0%,#D926A9_100%)] drop-shadow-[0_0_30px_rgba(0,240,255,0.3)]">
              Tốc Độ Quang
            </span>
            <br />
            Không Độ Trễ.
          </h1>

          <p className="font-mono text-muted-foreground text-base lg:text-lg max-w-[55ch] border-l-2 border-cyan-brand/50 pl-4 leading-relaxed">
            Cắm trực tiếp vào ma trận thị trường. Tín hiệu siêu tốc, phân tích AI thời gian thực,
            cộng đồng trader chuyên nghiệp Việt Nam.
          </p>

          {/* Multi CTA */}
          <div className="flex flex-wrap items-center gap-3 lg:gap-4">
            <Link
              to="/auth"
              className="group bg-cyan-brand text-navy font-bold uppercase tracking-widest text-sm lg:text-base px-6 lg:px-8 py-3 lg:py-4 border-2 border-cyan-brand shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:bg-white hover:border-white transition-all duration-300 inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Đăng Ký Ngay
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://t.me/uncletraderVN"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-navy text-uv font-bold uppercase tracking-widest text-sm lg:text-base px-6 lg:px-8 py-3 lg:py-4 border-2 border-uv shadow-[inset_0_0_15px_rgba(217,38,169,0.4)] hover:bg-uv hover:text-white transition-all duration-300 inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Telegram VIP
            </a>
            <Link
              to="/services"
              className="text-muted-foreground hover:text-cyan-brand font-mono text-sm uppercase tracking-widest underline underline-offset-4 px-4 py-3 transition-colors inline-flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Xem Dịch Vụ
              <span className="text-cyan-brand">→</span>
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
