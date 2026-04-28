import React from 'react';
import { motion } from 'framer-motion';
import featureWallet from '@/assets/feature-wallet.jpg';
import featureTrading from '@/assets/feature-trading.jpg';
import featureYield from '@/assets/feature-yield.jpg';

const FEATURES = [
  {
    title: 'Tín Hiệu VIP',
    tagline: 'Smart Money, Liquidity Hunter.',
    desc: 'Tín hiệu chất lượng cao theo phương pháp Smart Money Concept. Entry, SL, TP rõ ràng, gửi trực tiếp về Telegram VIP của bạn.',
    image: featureTrading,
    accent: '#FF5B22',
  },
  {
    title: 'Phân Tích AI',
    tagline: 'Confluence engine real-time.',
    desc: 'Hệ thống AlphaNet kết hợp Wyckoff, EMA Pro, S/R, Oscillator Matrix — mọi indicator chuyên nghiệp trên một biểu đồ.',
    image: featureWallet,
    accent: '#00D2D3',
  },
  {
    title: 'Cộng Đồng',
    tagline: 'Trader Việt chuyên nghiệp.',
    desc: 'Khoá học, livestream, room discussion. Học hỏi từ cộng đồng 2,400+ trader đã có kinh nghiệm thực chiến trên thị trường.',
    image: featureYield,
    accent: '#D926A9',
  },
];

const VertexFeatures: React.FC = () => {
  return (
    <section className="relative py-20 md:py-28 z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-2xl">
          <p className="font-mono uppercase tracking-[0.3em] text-xs text-white/50">Vì sao UncleTrader</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1] font-bold">
            Ba mặt trận. <span className="text-accent-gradient">Một hệ thống.</span>
          </h2>
          <p className="mt-5 text-white/55 text-base md:text-lg max-w-xl">
            Signal, công cụ phân tích chuyên sâu và cộng đồng — được thiết kế như một sản phẩm liền mạch dành riêng cho trader Việt.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
              className="rounded-3xl overflow-hidden glass glass-card-hover group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="p-7">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-widest"
                  style={{ color: f.accent, background: `${f.accent}1F`, border: `1px solid ${f.accent}66` }}
                >
                  {f.tagline}
                </div>
                <h3 className="font-display text-2xl mt-4 font-semibold">{f.title}</h3>
                <p className="text-white/65 mt-3 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VertexFeatures;
