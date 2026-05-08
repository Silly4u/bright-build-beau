import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, BookOpen, Search, Sparkles, CheckCircle2, GraduationCap, AlertTriangle, Lightbulb, HelpCircle, ListChecks, History } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { LESSONS, CATEGORIES, ACADEMY_HERO, type Lesson } from '@/data/academyLessons';

const levelColor = (lv: Lesson['level']) =>
  lv === 'Cơ bản'
    ? 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30'
    : lv === 'Trung cấp'
    ? 'text-amber-300 bg-amber-400/10 border-amber-400/30'
    : 'text-rose-300 bg-rose-400/10 border-rose-400/30';

const Academy: React.FC = () => {
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('Tất cả');

  const filtered = useMemo(() => {
    return LESSONS.filter(l => {
      const matchCat = activeCat === 'Tất cả' || l.category === activeCat;
      const q = query.trim().toLowerCase();
      const matchQ = !q || l.title.toLowerCase().includes(q) || l.excerpt.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCat]);

  if (selected) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
          <button
            onClick={() => setSelected(null)}
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
          </button>

          <div className="rounded-3xl overflow-hidden mb-8 ring-1 ring-white/10">
            <img src={selected.cover} alt={selected.title} className="w-full h-64 md:h-80 object-cover" />
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">{selected.category}</span>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${levelColor(selected.level)}`}>
              {selected.level}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-white/50">
              <Clock className="w-3 h-3" /> {selected.duration}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">{selected.title}</h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">{selected.intro}</p>

          <div className="space-y-8">
            {selected.sections.map((s, i) => (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6 border border-white/5"
              >
                <h2 className="font-display text-xl font-semibold mb-3 text-amber-200">{s.heading}</h2>
                <p className="text-white/75 leading-relaxed">{s.body}</p>
                {s.bullets && (
                  <ul className="mt-4 space-y-2">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-sm text-white/70">
                        <span className="text-amber-300 mt-1">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.section>
            ))}
          </div>

          <div className="mt-10 rounded-2xl p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/0 border border-amber-400/20">
            <h3 className="font-display text-lg font-bold mb-4 inline-flex items-center gap-2 text-amber-200">
              <Sparkles className="w-4 h-4" /> Ghi nhớ chính
            </h3>
            <ul className="space-y-2">
              {selected.takeaways.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28 pb-20 px-4 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-10 ring-1 ring-white/10">
          <img src={ACADEMY_HERO} alt="Học viện UncleTrader" className="w-full h-64 md:h-80 object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-300 uppercase tracking-widest mb-3">
              <GraduationCap className="w-4 h-4" /> Học Viện UncleTrader
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-2">Khóa Học Trader Chuyên Sâu</h1>
            <p className="text-white/70 max-w-2xl">
              Từ Price Action, Smart Money Concepts, Wyckoff đến Quản lý vốn — tất cả gói gọn trong các bài học
              tiếng Việt, súc tích và áp dụng được ngay.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Tìm bài học..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-amber-400/40 transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['Tất cả', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  activeCat === cat
                    ? 'bg-amber-400/15 border-amber-400/40 text-amber-200'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Lessons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lesson, idx) => (
            <motion.button
              key={lesson.slug}
              onClick={() => { setSelected(lesson); window.scrollTo(0, 0); }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="text-left glass rounded-2xl overflow-hidden border border-white/5 hover:border-amber-400/30 hover:-translate-y-1 transition-all group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={lesson.cover}
                  alt={lesson.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border backdrop-blur-md ${levelColor(lesson.level)}`}>
                    {lesson.level}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-widest">{lesson.category}</span>
                  <span className="text-white/30">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-white/50">
                    <Clock className="w-3 h-3" /> {lesson.duration}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold mb-2 leading-snug group-hover:text-amber-200 transition">
                  {lesson.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed line-clamp-3">{lesson.excerpt}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                  <BookOpen className="w-3.5 h-3.5" /> Bắt đầu học →
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/40">Không tìm thấy bài học phù hợp.</div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Academy;
