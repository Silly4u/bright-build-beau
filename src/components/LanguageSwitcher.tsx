import React, { useState, useEffect, useRef } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';

type Lang = 'vi' | 'en' | 'zh';

const LANGS: { code: Lang; label: string; short: string; flag: string }[] = [
  { code: 'vi', label: 'Tiếng Việt', short: 'VI', flag: '🇻🇳' },
  { code: 'en', label: 'English',     short: 'EN', flag: '🇬🇧' },
  { code: 'zh', label: '中文',         short: 'ZH', flag: '🇨🇳' },
];

const STORAGE_KEY = 'ut_lang';

const LanguageSwitcher: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('vi');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Lang) || 'vi';
    setLang(saved);
    document.documentElement.lang = saved;
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const choose = (code: Lang) => {
    setLang(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;
    setOpen(false);
    window.dispatchEvent(new CustomEvent('langchange', { detail: code }));
  };

  const current = LANGS.find(l => l.code === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-full text-[11px] font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all whitespace-nowrap"
        aria-label="Change language"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{current.short}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-[#0f1115]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => choose(l.code)}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-[12px] font-medium transition-colors ${
                lang === l.code ? 'bg-white/10 text-white' : 'text-white/75 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{l.flag}</span>
                <span>{l.label}</span>
              </span>
              {lang === l.code && <Check className="w-3.5 h-3.5 text-amber-300" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
