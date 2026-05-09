import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, LogOut, Shield, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIndicatorPermissions } from '@/hooks/useIndicatorPermissions';
import sphereLogo from '@/assets/uncletrader-logo.png';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const navLinks = [
  { href: '/', label: 'Trang Chủ' },
  { href: '/tin-tuc', label: 'Tin Tức' },
  { href: '/co-phieu', label: 'Cổ Phiếu' },
  { href: '/phan-tich', label: 'Phân Tích' },
  { href: '/indicators', label: 'Indicators' },
  { href: '/lich-kinh-te', label: 'Lịch Kinh Tế' },
  { href: '/services', label: 'Dịch Vụ' },
  { href: '/hoc-vien', label: 'Học Viện' },
  { href: '/contact', label: 'Liên Hệ' },
];

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isSuperAdmin } = useIndicatorPermissions();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className={`fixed top-3 md:top-5 left-2.5 right-2.5 sm:left-3.5 sm:right-3.5 lg:left-5 lg:right-5 2xl:left-auto 2xl:w-[1400px] z-50 rounded-[28px] transition-all duration-500 ${
          scrolled ? 'glass-strong' : 'glass'
        }`}
      >
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 sm:px-4 lg:px-5 py-1.5 md:py-2 min-w-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group min-w-0 max-w-full">
            <img
              src={sphereLogo}
              alt="UncleTrader"
              className="w-7 h-7 lg:w-8 lg:h-8 object-cover rounded-full ring-1 ring-white/15 drop-shadow-[0_0_12px_rgba(245,158,11,0.45)] transition-transform duration-700 group-hover:rotate-[360deg] shrink-0"
            />
            <div className="flex flex-col leading-none min-w-0">
              <span className="font-display text-[12px] sm:text-[13px] xl:text-sm font-semibold tracking-tight text-foreground truncate">
                UNCLETRADER
              </span>
              <span className="hidden 2xl:block text-[8px] font-mono text-white/40 tracking-[0.2em] uppercase mt-1 truncate">
                Smart Money Analysis
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 min-w-0 overflow-hidden">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-full text-[11px] xl:text-[12px] 2xl:text-[13px] font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-foreground bg-white/10'
                      : 'text-white/65 hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center justify-end gap-1 shrink-0 min-w-fit">
            {isSuperAdmin && (
              <Link
                to="/admin"
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 transition-all"
              >
                <Shield className="w-3 h-3" />
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={async () => { await signOut(); navigate('/'); }}
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Đăng Xuất</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="hidden md:inline-flex btn-primary items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-[11.5px] whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                Đăng Nhập
                <ArrowUpRight className="w-3.5 h-3.5 hidden xl:inline" />
              </Link>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition shrink-0"
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden px-3 pb-3 pt-1 flex flex-col gap-1"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-2.5 rounded-2xl text-sm font-medium ${
                    isActive ? 'text-foreground bg-white/10' : 'text-white/75 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {user ? (
              <button
                onClick={async () => { await signOut(); navigate('/'); setOpen(false); }}
                className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold bg-white/5 border border-white/10"
              >
                <LogOut className="w-4 h-4" /> Đăng Xuất
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm"
              >
                <LogIn className="w-4 h-4" /> Đăng Nhập / Đăng Ký
              </Link>
            )}
          </motion.div>
        )}
      </motion.header>
    </>
  );
};

export default Header;
