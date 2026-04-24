import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import slotImage01 from '@/assets/cta-slot-01.png';
import slotImage02 from '@/assets/cta-slot-02.png';
import slotImage03 from '@/assets/cta-slot-03.png';
import slotImage04 from '@/assets/cta-slot-04.png';
import slotImage05 from '@/assets/cta-slot-05.png';
import slotImage06 from '@/assets/cta-slot-06.png';

const visualSlots = [
  { label: 'Slot 01', image: slotImage01, className: 'lg:left-[3%] lg:top-[10%] lg:w-72 lg:h-44 lg:-rotate-[10deg]', animation: 'animate-float-card-slow' },
  { label: 'Slot 02', image: slotImage02, className: 'lg:left-[31%] lg:top-[3%] lg:w-48 lg:h-64 lg:rotate-[7deg]', animation: 'animate-float-card-medium' },
  { label: 'Slot 03', image: slotImage03, className: 'lg:right-[3%] lg:top-[12%] lg:w-80 lg:h-48 lg:rotate-[12deg]', animation: 'animate-float-card-delayed' },
  { label: 'Slot 04', image: slotImage04, className: 'lg:left-[6%] lg:bottom-[9%] lg:w-80 lg:h-52 lg:rotate-[8deg]', animation: 'animate-float-card-delayed' },
  { label: 'Slot 05', image: slotImage05, className: 'lg:left-[37%] lg:bottom-[2%] lg:w-52 lg:h-72 lg:-rotate-[6deg]', animation: 'animate-float-card-slow' },
  { label: 'Slot 06', image: slotImage06, className: 'lg:right-[9%] lg:bottom-[11%] lg:w-64 lg:h-48 lg:-rotate-[13deg]', animation: 'animate-float-card-medium' },
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
    <section ref={sectionRef} className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-background" />
      <div className="absolute inset-0 pointer-events-none opacity-25 matrix-grid-bg" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 min-h-[860px] lg:min-h-[780px]">
        <div className="relative grid grid-cols-2 gap-x-7 gap-y-10 pt-4 sm:grid-cols-3 lg:block lg:pt-0 lg:min-h-[780px]">
          {visualSlots.map((slot) => (
            <div
              key={slot.label}
              className={`reveal-hidden relative lg:absolute ${slot.className}`}
            >
              <div className={`${slot.animation} group relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden rounded-[1.75rem] border border-border/20 bg-card/55 shadow-card-glow backdrop-blur-xl transition-transform duration-500 hover:scale-[1.025]`}>
                <img
                  src={slot.image}
                  alt={`${slot.label} trading chart preview`}
                  className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-background/5 via-transparent to-background/35" />
                <div className="absolute inset-[1px] rounded-[1.7rem] border border-foreground/5" />
              </div>
            </div>
          ))}
        </div>

        <div className="pointer-events-auto absolute inset-x-6 top-1/2 z-20 mx-auto max-w-[470px] -translate-y-1/2 text-center lg:left-1/2 lg:right-auto lg:w-[470px] lg:-translate-x-1/2">
          <p className="reveal-hidden font-mono-custom text-base sm:text-lg leading-relaxed text-foreground">
            From trading to community, unlock
            <br className="hidden sm:block" />
            the full potential of UNCLETRADER,
            <br className="hidden sm:block" />
            <span className="text-muted-foreground">all in one secure place.</span>
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
