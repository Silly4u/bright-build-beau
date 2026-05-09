import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VertexTestimonials: React.FC = () => {
  const { t } = useTranslation();
  const TESTIMONIALS = [
    { key: 't1', initial: 'MT', color: '#FF5B22' },
    { key: 't2', initial: 'HA', color: '#00D2D3' },
    { key: 't3', initial: 'TH', color: '#D926A9' },
  ];
  return (
    <section className="relative py-20 md:py-28 z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <p className="font-mono uppercase tracking-[0.3em] text-xs text-white/50">{t('testimonials.eyebrow')}</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1] font-bold">
            {t('testimonials.title1')} <span className="text-accent-gradient">{t('testimonials.title2')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((tt, i) => (
            <motion.figure
              key={tt.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-3xl glass p-7 flex flex-col"
            >
              <Quote className="w-7 h-7 text-white/20" />
              <blockquote className="mt-4 text-white/80 text-base leading-relaxed flex-1">
                "{t(`testimonials.items.${tt.key}.quote`)}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold text-sm"
                  style={{ background: `${tt.color}22`, color: tt.color, border: `1px solid ${tt.color}55` }}
                >
                  {tt.initial}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t(`testimonials.items.${tt.key}.name`)}</div>
                  <div className="text-xs text-white/50 font-mono">{t(`testimonials.items.${tt.key}.role`)}</div>
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
