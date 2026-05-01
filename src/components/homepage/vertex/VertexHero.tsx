import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Sparkles, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/contact';
import { fetchBinanceTickers } from '@/lib/binance';
import sphereLogo from '@/assets/vertex-btc-sphere.png';
import heroCoin from '@/assets/vertex-eth-coin.png';
import heroShape from '@/assets/hero-chart.png';

const VertexHero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const [btc, setBtc] = useState<{ price: number | null; change: number | null }>({ price: null, change: null });
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const map = await fetchBinanceTickers(['BTCUSDT']);
        const t = map['BTCUSDT'];
        if (mounted && t?.lastPrice) {
          setBtc({
            price: parseFloat(t.lastPrice),
            change: parseFloat(t.priceChangePercent ?? '0'),
          });
        }
      } catch { /* keep last */ }
    };
    load();
    const id = setInterval(load, 15000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 80, damping: 18, mass: 0.4 });

  const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const tx1 = useTransform(sx, (v) => v * -40);
  const ty1 = useTransform(sy, (v) => v * -40);
  const tx2 = useTransform(sx, (v) => v * 60);
  const ty2 = useTransform(sy, (v) => v * 60);
  const tx3 = useTransform(sx, (v) => v * -90);
  const ty3 = useTransform(sy, (v) => v * -90);
  const tx4 = useTransform(sx, (v) => v * 120);
  const ty4 = useTransform(sy, (v) => v * 120);
  const rotLogo = useTransform(sx, (v) => v * 24);

  return (
    <section
      ref={ref}
      onMouseMove={handleMouse}
      className="relative min-h-[100svh] w-full pt-32 md:pt-40 pb-12 overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <motion.div
        style={{ scale, opacity, y }}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
      >
        {/* Copy */}
        <div className="lg:col-span-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs md:text-sm text-white/80"
          >
            <Sparkles size={14} className="text-[#00D2D3]" />
            <span className="font-mono uppercase tracking-widest">v3 · LIVE SIGNALS ĐANG HOẠT ĐỘNG</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="font-display mt-5 text-5xl sm:text-6xl lg:text-7xl xl:text-[5.2rem] leading-[0.95] font-bold"
          >
            Giao dịch{' '}
            <span className="text-accent-gradient">có chiến lược</span>
            <br />
            <span className="text-white/85">Cho </span>
            <em className="not-italic font-display">trader Việt</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-6 text-base md:text-lg text-white/60 max-w-xl leading-relaxed"
          >
            Tín hiệu giao dịch crypto chính xác, phân tích Smart Money thời gian thực và cộng đồng trader chuyên nghiệp.
            Tham gia ngay cùng hơn 2,400 trader tại Việt Nam.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/auth"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm md:text-base"
            >
              Bắt đầu ngay
              <ArrowUpRight size={18} />
            </Link>
            <a
              href={CONTACT_INFO.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm md:text-base"
            >
              <MessageCircle size={16} />
              Telegram VIP
            </a>
            <Link
              to="/services"
              className="text-white/60 hover:text-white font-mono text-sm uppercase tracking-widest underline underline-offset-4 px-2 py-3 transition-colors"
            >
              Xem dịch vụ →
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-10 flex items-center gap-6 text-xs md:text-sm text-white/45 font-mono uppercase tracking-widest"
          >
            <span>Win Rate 78%</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>2,400+ Members</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span>400+ Signals</span>
          </motion.div>
        </div>

        {/* 3D Scene */}
        <div className="lg:col-span-6 relative h-[420px] sm:h-[520px] lg:h-[620px]">
          <div className="absolute -inset-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-[#FF5B22]/20 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-[#00D2D3]/20 blur-3xl" />
            <div className="absolute top-1/2 right-1/3 w-60 h-60 rounded-full bg-[#D926A9]/15 blur-3xl" />
          </div>

          {/* Center sphere */}
          <motion.div
            style={{ x: tx1, y: ty1, rotate: rotLogo }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.img
              src={sphereLogo}
              alt="Bitcoin 3D sphere"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: 0.4 }}
              className="w-[300px] sm:w-[380px] lg:w-[460px] drop-shadow-[0_30px_80px_rgba(217,38,169,0.35)]"
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <div className="w-[420px] sm:w-[520px] lg:w-[620px] h-[420px] sm:h-[520px] lg:h-[620px] rounded-full border border-white/5" />
            </motion.div>
          </motion.div>

          {/* Portfolio card */}
          <motion.div
            style={{ x: tx3, y: ty3 }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="absolute top-6 left-2 sm:left-6"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="glass rounded-3xl p-3 w-44 shadow-2xl"
            >
              <div className="text-[10px] uppercase tracking-widest text-white/50 font-mono">Win Rate</div>
              <div className="mt-1 font-display text-2xl font-semibold">78.4%</div>
              <div className="text-xs text-[#00D2D3] mt-0.5">+2.1% tuần này</div>
              <div className="mt-3 h-10 flex items-end gap-1">
                {[8, 14, 10, 18, 22, 16, 26, 30, 24, 36].map((h, i) => (
                  <span key={i} style={{ height: `${h}px` }} className="w-1.5 rounded-full bg-gradient-to-t from-[#FF5B22] to-[#D926A9]" />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Coin */}
          <motion.div
            style={{ x: tx2, y: ty2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.9 }}
            className="absolute bottom-4 right-2 sm:right-8"
          >
            <motion.img
              src={heroCoin}
              alt="Ethereum 3D coin"
              animate={{ y: [0, 12, 0], rotate: [0, 6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="w-32 sm:w-44 lg:w-56 object-contain drop-shadow-[0_20px_60px_rgba(217,38,169,0.45)]"
            />
          </motion.div>

          {/* Live ticker pill */}
          <motion.div
            style={{ x: tx4, y: ty4 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.9 }}
            className="absolute bottom-10 left-4 sm:left-10"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="glass rounded-full px-4 py-2.5 flex items-center gap-3 shadow-xl"
            >
              <span className="w-2 h-2 rounded-full bg-[#00D2D3] animate-pulse" />
              <span className="font-mono text-xs text-white/80">BTC</span>
              <span className="font-display text-sm font-semibold tabular-nums">
                {btc.price !== null ? `$${btc.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '...'}
              </span>
              <span className={`font-mono text-xs ${(btc.change ?? 0) >= 0 ? 'text-[#00D2D3]' : 'text-[#FF5B22]'}`}>
                {btc.change !== null ? `${btc.change >= 0 ? '+' : ''}${btc.change.toFixed(2)}%` : '...'}
              </span>
            </motion.div>
          </motion.div>

          {/* Trading chart preview */}
          <motion.div
            style={{ x: tx3, y: ty3 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1.2 }}
            className="absolute top-1/4 right-4 sm:right-6 lg:right-10"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="glass rounded-2xl p-1.5 shadow-2xl border border-white/10 overflow-hidden"
            >
              <img
                src={heroShape}
                alt="Live trading signals chart"
                className="w-20 sm:w-24 lg:w-32 rounded-xl object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-[10px] font-mono uppercase tracking-[0.3em] flex flex-col items-center gap-2 pointer-events-none"
      >
        <span>Cuộn xuống</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default VertexHero;
