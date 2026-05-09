import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Phone, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CONTACT_INFO } from '@/lib/contact';
import sphereLogo from '@/assets/vertex-sphere.png';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const COLUMNS = [
    {
      title: t('footer.colProduct'),
      links: [
        { label: t('footer.productLinks.news'), href: '/tin-tuc' },
        { label: t('footer.productLinks.analysis'), href: '/workspace?tab=overview' },
        { label: t('footer.productLinks.indicators'), href: '/workspace?tab=chart' },
        { label: t('footer.productLinks.calendar'), href: '/lich-kinh-te' },
      ],
    },
    {
      title: t('footer.colCommunity'),
      links: [
        { label: t('footer.communityLinks.services'), href: '/services' },
        { label: t('footer.communityLinks.dictionary'), href: '/tu-dien' },
        { label: t('footer.communityLinks.contact'), href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="relative py-16 md:py-20 z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          <div className="col-span-2 md:col-span-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src={sphereLogo} alt="UncleTrader" className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(217,38,169,0.45)]" />
              <span className="font-display text-xl font-semibold">UNCLETRADER</span>
            </Link>
            <p className="mt-4 text-sm text-white/50 max-w-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a href={CONTACT_INFO.telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Telegram"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition">
                <Send size={16} />
              </a>
              <a href={CONTACT_INFO.zaloUrl} target="_blank" rel="noopener noreferrer" aria-label="Zalo"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition">
                <MessageCircle size={16} />
              </a>
              <a href={CONTACT_INFO.phoneUrl} aria-label="Phone"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition">
                <Phone size={16} />
              </a>
            </div>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <div className="font-mono text-xs uppercase tracking-[0.25em] text-white/45">{c.title}</div>
              <ul className="mt-4 flex flex-col gap-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-sm text-white/70 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-3">
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-white/45">{t('footer.colContact')}</div>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-white/70">
              <li>Telegram: <a href={CONTACT_INFO.telegramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">{CONTACT_INFO.telegramHandle}</a></li>
              <li>Zalo: <a href={CONTACT_INFO.zaloUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">{CONTACT_INFO.zaloLabel}</a></li>
              <li>{t('footer.hotline')}: <a href={CONTACT_INFO.phoneUrl} className="hover:text-white">{CONTACT_INFO.phoneDisplay}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <span className="text-xs text-white/40 font-mono">
            © {new Date().getFullYear()} UNCLETRADER · {t('footer.copyright')}
          </span>
          <span className="text-xs text-white/40 font-mono">{t('footer.madeIn')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
