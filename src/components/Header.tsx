import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, LogOut, Shield, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIndicatorPermissions } from '@/hooks/useIndicatorPermissions';
import EconomicTicker from './EconomicTicker';
import sphereLogo from '@/assets/vertex-sphere.png';

const navLinks = [
  { href: '/', label: 'Trang Chủ' },
  { href: '/tin-tuc', label: 'Tin Tức' },
  { href: '/phan-tich', label: 'Phân Tích' },
  { href: '/indicators', label: 'Indicators' },
  { href: '/lich-kinh-te', label: 'Lịch Kinh Tế' },
  { href: '/services', label: 'Dịch Vụ' },
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
        className={`fixed top-3 md:top-5 left-1/2 -translate-x-1/2 w-[96%] max-w-6xl z-50 rounded-full transition-all duration-500 ${
          scrolled ? 'glass-strong' : 'glass'
        }`}
      >
        <div className="flex items-center justify-between px-3 md:px-5 py-2 md:py-2.5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src={sphereLogo}
              alt="UncleTrader"
              className="w-8 h-8 md:w-9 md:h-9 object-contain drop-shadow-[0_0_12px_rgba(217,38,169,0.45)] transition-transform duration-700 group-hover:rotate-180"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-sm md:text-base font-semibold tracking-tight text-foreground">
                UNCLETRADER
              </span>
              <span className="text-[8px] font-mono text-white/40 tracking-[0.2em] uppercase mt-1">
                Smart Money Analysis
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium transition-all ${
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
          <div className="flex items-center gap-1.5">
            {isSuperAdmin && (
              <Link
                to="/admin"
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 transition-all"
              >
                <Shield className="w-3 h-3" />
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={async () => { await signOut(); navigate('/'); }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Đăng Xuất
              </button>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:inline-flex btn-primary items-center gap-1.5 px-4 py-2 rounded-full text-[12px]"
              >
                <LogIn className="w-3.5 h-3.5" />
                Đăng Nhập
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden ml-1 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition"
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
