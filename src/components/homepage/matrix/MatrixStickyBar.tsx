import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const MatrixStickyBar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [countdown, setCountdown] = useState({ m: 4, s: 12 });

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(prev => {
        let { m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) {
          m--;
          s = 59;
        } else {
          m = 4;
          s = 59;
        }
        return { m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D0F16]/95 backdrop-blur-lg border-t border-cyan-brand/30 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] animate-fade-up">
      <div className="px-4 lg:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-3 max-w-7xl mx-auto">
        <div className="hidden md:block flex-1">
          <p className="font-mono text-cyan-brand text-xs uppercase tracking-[0.2em] font-bold">
            // CƠ HỘI KHÔNG CHỜ ĐỢI · MATRIX ĐANG HOẠT ĐỘNG
          </p>
          <p className="text-xs text-muted-foreground">
            Tín hiệu độc quyền tiếp theo trong{' '}
            <span className="text-cyan-brand font-mono font-bold tabular-nums">
              {String(countdown.m).padStart(2, '0')}:{String(countdown.s).padStart(2, '0')}
            </span>
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-3 items-center">
          <Link
            to="/services"
            className="flex-1 md:flex-none bg-cyan-brand/10 text-cyan-brand border border-cyan-brand px-4 lg:px-6 py-2 font-mono text-xs uppercase tracking-widest hover:bg-cyan-brand hover:text-navy transition-colors text-center"
          >
            Xem Gói
          </Link>
          <Link
            to="/auth"
            className="flex-1 md:flex-none bg-cyan-brand text-navy font-bold font-mono text-xs uppercase tracking-widest px-4 lg:px-8 py-2 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:bg-white transition-colors text-center"
          >
            Bắt Đầu
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground p-1"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatrixStickyBar;
