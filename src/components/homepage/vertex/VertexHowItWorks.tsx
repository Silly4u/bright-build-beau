import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const VertexHowItWorks: React.FC = () => {
  const { t } = useTranslation();
  const STEPS = [
    { step: '01', key: 's1' },
    { step: '02', key: 's2' },
    { step: '03', key: 's3' },
  ];
  return (
    <section className="relative py-24 md:py-28 z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-2xl mb-14">
          <p className="font-mono uppercase tracking-[0.3em] text-xs text-white/50">{t('how.eyebrow')}</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl mt-3 leading-[1] font-bold">
            {t('how.title1')} <span className="text-accent-gradient">{t('how.title2')}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {STEPS.map((s, i) => (
            <motion.article
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="relative rounded-3xl glass p-8 overflow-hidden group"
            >
              <div className="absolute -top-12 -right-8 font-display text-[180px] leading-none font-bold text-white/[0.04] select-none pointer-events-none">
                {s.step}
              </div>
              <span className="relative inline-flex items-center gap-2 font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                {t('how.stepLabel')} {s.step}
              </span>
              <h3 className="relative font-display text-2xl md:text-3xl font-semibold mt-5">{t(`how.steps.${s.key}.title`)}</h3>
              <p className="relative text-white/65 mt-3 leading-relaxed">{t(`how.steps.${s.key}.desc`)}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VertexHowItWorks;
