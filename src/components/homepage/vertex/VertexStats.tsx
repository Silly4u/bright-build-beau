import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { label: 'Tỉ lệ thắng', value: 78, prefix: '', suffix: '%', decimals: 0 },
  { label: 'Thành viên cộng đồng', value: 2.4, prefix: '', suffix: 'K+', decimals: 1 },
  { label: 'Signals đã gửi', value: 400, prefix: '', suffix: '+', decimals: 0 },
  { label: 'Năm kinh nghiệm', value: 7, prefix: '', suffix: '+', decimals: 0 },
];

const Counter: React.FC<{ to: number; decimals?: number; prefix?: string; suffix?: string }> = ({ to, decimals = 0, prefix = '', suffix = '' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(eased * to);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref} className="font-display tabular-nums">
      {prefix}{val.toFixed(decimals)}{suffix}
    </span>
  );
};

const VertexStats: React.FC = () => {
  return (
    <section className="relative py-20 md:py-28 z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-5">
            <p className="font-mono uppercase tracking-[0.3em] text-xs text-white/50">Bằng số liệu</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 font-bold leading-[1]">
              Xây như <span className="text-accent-gradient">hạ tầng</span>.
            </h2>
            <p className="mt-5 text-white/55 max-w-md">
              Số liệu công khai, signal có lịch sử rõ ràng, kết quả minh bạch — kiểm tra mọi lúc trên dashboard.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 gap-4 md:gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                className="rounded-3xl glass p-6 md:p-8"
              >
                <div className="text-5xl md:text-6xl font-bold leading-none">
                  <span className="text-accent-gradient">
                    <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals} />
                  </span>
                </div>
                <div className="mt-3 text-sm text-white/60 font-mono uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VertexStats;
