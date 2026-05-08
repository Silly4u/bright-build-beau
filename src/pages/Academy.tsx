import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, BookOpen, Search, Sparkles, CheckCircle2, GraduationCap,
  AlertTriangle, Lightbulb, HelpCircle, ListChecks, History, Layers, Hash,
  ChevronUp, ChevronLeft, ChevronRight, Filter, ArrowDownAZ, Route, Library,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { LESSONS, CATEGORIES, ACADEMY_HERO, type Lesson } from '@/data/academyLessons';

type Level = Lesson['level'];
type SortMode = 'curriculum' | 'shortest' | 'longest';

const LEVEL_ORDER: Record<Level, number> = { 'Cơ bản': 0, 'Trung cấp': 1, 'Nâng cao': 2 };

const levelColor = (lv: Level) =>
  lv === 'Cơ bản'
    ? 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30'
    : lv === 'Trung cấp'
    ? 'text-amber-300 bg-amber-400/10 border-amber-400/30'
    : 'text-rose-300 bg-rose-400/10 border-rose-400/30';

const slugifyHeading = (h: string) =>
  h
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const parseDuration = (s: string) => {
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
};

// Sắp xếp chuyên mục theo lộ trình học (cấp độ phổ biến nhất tăng dần)
const orderedCategories = (() => {
  const score: Record<string, number> = {};
  const count: Record<string, number> = {};
  LESSONS.forEach(l => {
    score[l.category] = (score[l.category] ?? 0) + LEVEL_ORDER[l.level];
    count[l.category] = (count[l.category] ?? 0) + 1;
  });
  return [...CATEGORIES].sort((a, b) => score[a] / count[a] - score[b] / count[b]);
})();

const Academy: React.FC = () => {
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('Tất cả');
  const [activeLevel, setActiveLevel] = useState<'Tất cả' | Level>('Tất cả');
  const [sortMode, setSortMode] = useState<SortMode>('curriculum');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = LESSONS.filter(l => {
      const matchCat = activeCat === 'Tất cả' || l.category === activeCat;
      const matchLv = activeLevel === 'Tất cả' || l.level === activeLevel;
      const matchQ =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.excerpt.toLowerCase().includes(q) ||
        l.sections.some(s => s.heading.toLowerCase().includes(q));
      return matchCat && matchLv && matchQ;
    });
    if (sortMode === 'shortest') return [...list].sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
    if (sortMode === 'longest') return [...list].sort((a, b) => parseDuration(b.duration) - parseDuration(a.duration));
    // curriculum: theo cấp độ rồi theo thứ tự gốc
    return [...list].sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  }, [query, activeCat, activeLevel, sortMode]);

  const stats = useMemo(() => {
    const totalMinutes = LESSONS.reduce((acc, l) => acc + parseDuration(l.duration), 0);
    return {
      lessons: LESSONS.length,
      hours: Math.round(totalMinutes / 60),
      categories: CATEGORIES.length,
    };
  }, []);

  const categoryCount = useMemo(() => {
    const m: Record<string, number> = {};
    LESSONS.forEach(l => { m[l.category] = (m[l.category] ?? 0) + 1; });
    return m;
  }, []);

  const openLesson = (l: Lesson) => {
    setSelected(l);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  if (selected) return <LessonView lesson={selected} onBack={() => setSelected(null)} onOpen={openLesson} />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28 pb-20 px-4 max-w-7xl mx-auto">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden mb-8 ring-1 ring-white/10">
          <img src={ACADEMY_HERO} alt="Học viện UncleTrader" className="w-full h-64 md:h-80 object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-300 uppercase tracking-widest mb-3">
              <GraduationCap className="w-4 h-4" /> Học Viện UncleTrader
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-2">Khóa Học Trader Chuyên Sâu</h1>
            <p className="text-white/70 max-w-2xl">
              Lộ trình từ Price Action căn bản đến Smart Money, Order Flow, Options Gamma — viết bằng tiếng Việt,
              ví dụ thực chiến, có checklist và FAQ cho từng bài.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          <StatCard icon={<Library className="w-4 h-4" />} label="Bài học" value={stats.lessons.toString()} />
          <StatCard icon={<Clock className="w-4 h-4" />} label="Tổng thời lượng" value={`${stats.hours}+ giờ`} />
          <StatCard icon={<Layers className="w-4 h-4" />} label="Chuyên mục" value={stats.categories.toString()} />
        </div>

        {/* Learning Path */}
        <div className="rounded-2xl p-5 md:p-6 mb-8 bg-gradient-to-br from-amber-500/10 via-white/5 to-transparent border border-amber-400/20">
          <div className="flex items-center gap-2 mb-3 text-amber-200">
            <Route className="w-4 h-4" />
            <h2 className="font-display text-sm font-bold uppercase tracking-widest">Lộ trình học gợi ý</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['Cơ bản', 'Trung cấp', 'Nâng cao'] as Level[]).map((lv, i) => {
              const count = LESSONS.filter(l => l.level === lv).length;
              return (
                <button
                  key={lv}
                  onClick={() => { setActiveLevel(lv); setActiveCat('Tất cả'); }}
                  className={`text-left rounded-xl p-4 border transition hover:-translate-y-0.5 ${levelColor(lv)} hover:brightness-125`}
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest opacity-80 mb-1">Bước {i + 1}</div>
                  <div className="font-display font-bold text-base mb-1">{lv}</div>
                  <div className="text-xs opacity-80">{count} bài học</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Tìm bài học theo tên, mô tả hoặc section..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-amber-400/40 transition"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs">
              <ArrowDownAZ className="w-4 h-4 text-white/50" />
              <select
                value={sortMode}
                onChange={e => setSortMode(e.target.value as SortMode)}
                className="bg-transparent text-white/80 text-xs focus:outline-none cursor-pointer"
              >
                <option value="curriculum" className="bg-background">Theo lộ trình</option>
                <option value="shortest" className="bg-background">Ngắn nhất trước</option>
                <option value="longest" className="bg-background">Dài nhất trước</option>
              </select>
            </div>
          </div>

          {/* Level chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-white/40 mr-1">
              <Filter className="w-3 h-3" /> Cấp độ
            </span>
            {(['Tất cả', 'Cơ bản', 'Trung cấp', 'Nâng cao'] as const).map(lv => (
              <button
                key={lv}
                onClick={() => setActiveLevel(lv)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  activeLevel === lv
                    ? 'bg-amber-400/15 border-amber-400/40 text-amber-200'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {lv}
              </button>
            ))}
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-white/40 mr-1">
              <Layers className="w-3 h-3" /> Chuyên mục
            </span>
            <button
              onClick={() => setActiveCat('Tất cả')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                activeCat === 'Tất cả'
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-200'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              Tất cả <span className="opacity-60 ml-1">({LESSONS.length})</span>
            </button>
            {orderedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  activeCat === cat
                    ? 'bg-amber-400/15 border-amber-400/40 text-amber-200'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat} <span className="opacity-60 ml-1">({categoryCount[cat]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-white/50">
            Hiển thị <span className="text-white font-semibold">{filtered.length}</span> / {LESSONS.length} bài học
          </p>
          {(activeCat !== 'Tất cả' || activeLevel !== 'Tất cả' || query) && (
            <button
              onClick={() => { setActiveCat('Tất cả'); setActiveLevel('Tất cả'); setQuery(''); }}
              className="text-xs text-amber-300 hover:underline"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Lessons grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lesson, idx) => (
            <motion.button
              key={lesson.slug}
              onClick={() => openLesson(lesson)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx, 8) * 0.04 }}
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
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 border border-white/10">
                  <BookOpen className="w-3 h-3" /> {lesson.sections.length} section
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
                <h3 className="font-display text-lg font-bold mb-2 leading-snug group-hover:text-amber-200 transition line-clamp-2">
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
          <div className="text-center py-20 text-white/40">
            Không tìm thấy bài học phù hợp với bộ lọc.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="rounded-2xl p-4 bg-white/5 border border-white/10 text-center md:text-left">
    <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 mb-1">
      {icon} {label}
    </div>
    <div className="font-display text-xl md:text-2xl font-bold text-amber-200">{value}</div>
  </div>
);

// ===================== Lesson Detail View =====================

const LessonView: React.FC<{
  lesson: Lesson;
  onBack: () => void;
  onOpen: (l: Lesson) => void;
}> = ({ lesson, onBack, onOpen }) => {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const articleRef = useRef<HTMLDivElement>(null);

  // Reading progress + scroll-to-top visibility
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0;
      setProgress(pct);
      setShowTop(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lesson.slug]);

  // Active section highlight via IntersectionObserver
  useEffect(() => {
    const els = lesson.sections.map((s, i) => document.getElementById(`s-${i}-${slugifyHeading(s.heading)}`));
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    els.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [lesson.slug, lesson.sections]);

  const idx = LESSONS.findIndex(l => l.slug === lesson.slug);
  const prev = idx > 0 ? LESSONS[idx - 1] : null;
  const next = idx >= 0 && idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null;
  const related = LESSONS.filter(l => l.category === lesson.category && l.slug !== lesson.slug).slice(0, 3);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-transparent z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-200 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="pt-28 pb-20 px-4 max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
          {/* Article */}
          <article ref={articleRef} className="min-w-0">
            <div className="rounded-3xl overflow-hidden mb-8 ring-1 ring-white/10">
              <img src={lesson.cover} alt={lesson.title} className="w-full h-64 md:h-80 object-cover" />
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">{lesson.category}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${levelColor(lesson.level)}`}>
                {lesson.level}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-white/50">
                <Clock className="w-3 h-3" /> {lesson.duration}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-white/50">
                <BookOpen className="w-3 h-3" /> {lesson.sections.length} phần
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 leading-tight">{lesson.title}</h1>
            <p className="text-white/70 text-lg leading-relaxed mb-6">{lesson.intro}</p>

            {lesson.history && (
              <div className="mb-10 rounded-2xl p-5 bg-white/5 border border-white/10">
                <h3 className="font-display text-sm font-bold mb-2 inline-flex items-center gap-2 text-white/80 uppercase tracking-widest">
                  <History className="w-4 h-4" /> Bối cảnh lịch sử
                </h3>
                <p className="text-white/65 text-sm leading-relaxed">{lesson.history}</p>
              </div>
            )}

            <div className="space-y-8">
              {lesson.sections.map((s, i) => {
                const id = `s-${i}-${slugifyHeading(s.heading)}`;
                return (
                  <motion.section
                    id={id}
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.03 }}
                    className="glass rounded-2xl p-6 border border-white/5 scroll-mt-28"
                  >
                    <h2 className="font-display text-xl font-semibold mb-3 text-amber-200 group flex items-start gap-2">
                      <a
                        href={`#${id}`}
                        onClick={e => { e.preventDefault(); jumpTo(id); history.replaceState(null, '', `#${id}`); }}
                        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 mt-1 transition"
                        aria-label="Anchor link"
                      >
                        <Hash className="w-4 h-4" />
                      </a>
                      <span>{s.heading}</span>
                    </h2>
                    {s.image && (
                      <div className="mb-4 rounded-xl overflow-hidden ring-1 ring-white/10">
                        <img src={s.image} alt={s.heading} loading="lazy" className="w-full object-cover" />
                      </div>
                    )}
                    <p className="text-white/75 leading-relaxed whitespace-pre-line">{s.body}</p>
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
                    {s.example && (
                      <div className="mt-4 rounded-xl p-4 bg-emerald-400/5 border border-emerald-400/20">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-300 mb-1.5">
                          <Lightbulb className="w-3.5 h-3.5" /> Ví dụ thực chiến
                        </div>
                        <p className="text-sm text-white/75 leading-relaxed whitespace-pre-line">{s.example}</p>
                      </div>
                    )}
                    {s.pitfall && (
                      <div className="mt-3 rounded-xl p-4 bg-rose-400/5 border border-rose-400/20">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-300 mb-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Sai lầm thường gặp
                        </div>
                        <p className="text-sm text-white/75 leading-relaxed whitespace-pre-line">{s.pitfall}</p>
                      </div>
                    )}
                  </motion.section>
                );
              })}
            </div>

            <div className="mt-10 rounded-2xl p-6 bg-gradient-to-br from-amber-500/10 to-amber-500/0 border border-amber-400/20">
              <h3 className="font-display text-lg font-bold mb-4 inline-flex items-center gap-2 text-amber-200">
                <Sparkles className="w-4 h-4" /> Ghi nhớ chính
              </h3>
              <ul className="space-y-2">
                {lesson.takeaways.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {lesson.checklist && lesson.checklist.length > 0 && (
              <div className="mt-6 rounded-2xl p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-500/0 border border-emerald-400/20">
                <h3 className="font-display text-lg font-bold mb-4 inline-flex items-center gap-2 text-emerald-200">
                  <ListChecks className="w-4 h-4" /> Checklist trước khi vào lệnh
                </h3>
                <ul className="space-y-2">
                  {lesson.checklist.map((c, i) => (
                    <li key={i} className="flex gap-3 text-sm text-white/80">
                      <span className="mt-0.5 w-4 h-4 rounded border border-emerald-400/40 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lesson.faqs && lesson.faqs.length > 0 && (
              <div className="mt-6 rounded-2xl p-6 bg-white/5 border border-white/10">
                <h3 className="font-display text-lg font-bold mb-2 inline-flex items-center gap-2 text-white/90">
                  <HelpCircle className="w-4 h-4 text-amber-300" /> Câu hỏi thường gặp
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {lesson.faqs.map((f, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="border-white/10">
                      <AccordionTrigger className="text-left text-sm text-white/85 hover:no-underline">
                        {f.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-white/65 leading-relaxed whitespace-pre-line">
                        {f.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Prev / Next */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
              {prev ? (
                <button
                  onClick={() => onOpen(prev)}
                  className="text-left p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-amber-400/30 hover:-translate-y-0.5 transition group"
                >
                  <div className="text-[10px] uppercase tracking-widest text-white/40 inline-flex items-center gap-1">
                    <ChevronLeft className="w-3 h-3" /> Bài trước
                  </div>
                  <div className="font-display font-semibold text-sm mt-1 group-hover:text-amber-200 line-clamp-2">
                    {prev.title}
                  </div>
                </button>
              ) : <div />}
              {next ? (
                <button
                  onClick={() => onOpen(next)}
                  className="text-right p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-amber-400/30 hover:-translate-y-0.5 transition group"
                >
                  <div className="text-[10px] uppercase tracking-widest text-white/40 inline-flex items-center gap-1 justify-end w-full">
                    Bài tiếp theo <ChevronRight className="w-3 h-3" />
                  </div>
                  <div className="font-display font-semibold text-sm mt-1 group-hover:text-amber-200 line-clamp-2">
                    {next.title}
                  </div>
                </button>
              ) : <div />}
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="mt-10">
                <h3 className="font-display text-lg font-bold mb-4 inline-flex items-center gap-2 text-white/90">
                  <Layers className="w-4 h-4 text-amber-300" /> Bài học liên quan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {related.map(r => (
                    <button
                      key={r.slug}
                      onClick={() => onOpen(r)}
                      className="text-left p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-amber-400/30 hover:-translate-y-0.5 transition group"
                    >
                      <div className="text-[10px] font-mono text-amber-300 uppercase tracking-widest mb-1">{r.category}</div>
                      <div className="font-display font-semibold text-sm group-hover:text-amber-200 line-clamp-2">{r.title}</div>
                      <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-white/50">
                        <Clock className="w-3 h-3" /> {r.duration}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* TOC sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-3">
              <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
                <div className="text-[10px] uppercase tracking-widest text-white/50 mb-3 inline-flex items-center gap-1.5">
                  <ListChecks className="w-3 h-3" /> Mục lục bài học
                </div>
                <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                  {lesson.sections.map((s, i) => {
                    const id = `s-${i}-${slugifyHeading(s.heading)}`;
                    const isActive = activeId === id;
                    return (
                      <button
                        key={id}
                        onClick={() => jumpTo(id)}
                        className={`w-full text-left text-xs py-1.5 px-2 rounded-md border-l-2 transition ${
                          isActive
                            ? 'border-amber-400 bg-amber-400/10 text-amber-200'
                            : 'border-transparent text-white/55 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {s.heading}
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="rounded-2xl p-4 bg-white/5 border border-white/10 text-xs text-white/60">
                <div className="flex items-center justify-between mb-2">
                  <span>Tiến độ đọc</span>
                  <span className="font-mono text-amber-200">{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-200" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Scroll to top */}
        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-amber-400 text-black shadow-lg hover:bg-amber-300 transition flex items-center justify-center"
            aria-label="Lên đầu trang"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Academy;
