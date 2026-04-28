import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/contact';
import sphereLogo from '@/assets/vertex-sphere.png';

const VertexCTA: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rot = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={ref} className="relative py-24 md:py-32 z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="relative rounded-[2.5rem] overflow-hidden glass-strong p-10 md:p-16">
          {/* Background blobs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#FF5B22]/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#00D2D3]/20 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-[#D926A9]/15 blur-3xl" />
          </div>

          {/* Floating sphere */}
          <motion.div
            style={{ y, rotate: rot }}
            className="absolute right-0 md:right-10 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 md:opacity-100"
          >
            <img src={sphereLogo} alt="" className="w-44 md:w-72 drop-shadow-[0_30px_80px_rgba(217,38,169,0.4)]" />
          </motion.div>

          <div className="relative max-w-2xl">
            <p className="font-mono uppercase tracking-[0.3em] text-xs text-white/50">Sẵn sàng?</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 font-bold leading-[1]">
              Tham gia <span className="text-accent-gradient">UncleTrader</span> hôm nay.
            </h2>
            <p className="mt-5 text-white/65 text-base md:text-lg max-w-xl">
              Đăng ký miễn phí, kết nối Telegram VIP, và bắt đầu trade theo hệ thống đã được kiểm chứng cùng cộng đồng trader Việt.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/auth" className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm md:text-base">
                Bắt đầu miễn phí <ArrowUpRight size={18} />
              </Link>
              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm md:text-base"
              >
                <MessageCircle size={16} />
                Liên hệ Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VertexCTA;
