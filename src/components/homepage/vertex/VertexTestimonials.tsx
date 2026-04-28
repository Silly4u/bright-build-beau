import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Minh Tuấn',
    role: 'Full-time Trader, HCM',
    quote: 'Theo signal Uncle gần 2 năm, win rate ổn định 75-80%. Quan trọng là Uncle giải thích lý do entry rõ ràng nên mình học được phương pháp.',
    initial: 'MT',
    color: '#FF5B22',
  },
  {
    name: 'Hoàng Anh',
    role: 'Swing Trader, Hà Nội',
    quote: 'Indicator AlphaNet trên trang giúp mình confluence rất nhanh. Trước phải mở 5-6 chỉ báo, giờ chỉ cần một dashboard.',
    initial: 'HA',
    color: '#00D2D3',
  },
  {
    name: 'Thu Hà',
    role: 'Part-time, Đà Nẵng',
    quote: 'Cộng đồng UncleTrader cực kỳ chất, livestream cuối tuần luôn có insight mới. Đầu tư hợp lý nhất mình từng bỏ ra.',
    initial: 'TH',
    color: '#D926A9',
  },
];

const VertexTestimonials: React.FC = () => {
  return (
    <section className="relative py-20 md:py-28 z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <p className="font-mono uppercase tracking-[0.3em] text-xs text-white/50">Trader nói gì</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1] font-bold">
            Tin từ <span className="text-accent-gradient">cộng đồng.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-3xl glass p-7 flex flex-col"
            >
              <Quote className="w-7 h-7 text-white/20" />
              <blockquote className="mt-4 text-white/80 text-base leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold text-sm"
                  style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}55` }}
                >
                  {t.initial}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-white/50 font-mono">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VertexTestimonials;
