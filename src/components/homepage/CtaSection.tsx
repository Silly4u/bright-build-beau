import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const visualSlots = [
  { label: 'Magic Eden', className: 'lg:left-[7%] lg:top-[4%] lg:-rotate-12 lg:w-64 lg:h-40', shape: '[clip-path:polygon(0_0,100%_25%,92%_100%,8%_88%)]' },
  { label: 'Ora', className: 'lg:left-1/2 lg:top-[5%] lg:-translate-x-1/2 lg:w-36 lg:h-48', shape: 'rounded-2xl' },
  { label: 'Gamma', className: 'lg:right-[7%] lg:top-[4%] lg:rotate-12 lg:w-72 lg:h-44', shape: '[clip-path:polygon(10%_18%,100%_0,90%_100%,0_100%)]' },
  { label: 'SwanSwap', className: 'lg:left-[10%] lg:bottom-[5%] lg:-rotate-[17deg] lg:w-60 lg:h-44', shape: 'rounded-2xl' },
  { label: 'ARamp', className: 'lg:left-1/2 lg:bottom-[2%] lg:-translate-x-1/2 lg:w-36 lg:h-52', shape: '[clip-path:polygon(8%_0,92%_0,100%_100%,0_100%)]' },
  { label: 'Coolchange', className: 'lg:right-[13%] lg:bottom-[7%] lg:rotate-[18deg] lg:w-48 lg:h-40', shape: 'rounded-2xl' },
];

const CtaSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = entry.target.querySelectorAll('.reveal-hidden');
            els.forEach((el, i) => setTimeout(() => el.classList.add('revealed'), i * 120));
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-background" />
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border/30 pointer-events-none" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 min-h-[820px] lg:min-h-[760px]">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:block">
          {visualSlots.map((slot) => (
            <div
              key={slot.label}
              className={`reveal-hidden relative lg:absolute ${slot.className}`}
            >
              <div className={`aspect-[4/3] lg:aspect-auto lg:h-full ${slot.shape} border border-border/40 bg-card/75 shadow-card-glow backdrop-blur-md`} />
              <div className="mt-3 text-center font-mono-custom text-xs text-muted-foreground">{slot.label}</div>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 lg:left-1/2 lg:right-auto lg:w-[440px] lg:-translate-x-1/2 text-center">
          <p className="reveal-hidden font-mono-custom text-base sm:text-lg leading-relaxed text-foreground">
            From trading to learning, unlock
            <br className="hidden sm:block" />
            the full potential of every setup,
            <br className="hidden sm:block" />
            <span className="text-muted-foreground">all in one disciplined place.</span>
          </p>

          <div className="reveal-hidden mt-8 inline-flex items-center gap-2 border border-border/50 bg-card/70 rounded-full px-5 py-2.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono-custom text-xs text-accent tracking-wider">CÒN 12 SLOT VIP THÁNG NÀY</span>
          </div>

          <div className="reveal-hidden mt-7 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary px-8 py-4 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 animate-pulse-glow">
              Đặt Lịch Tư Vấn
            </Link>
            <Link to="/services" className="btn-outline px-8 py-4 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2">
              Xem Bảng Giá
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
