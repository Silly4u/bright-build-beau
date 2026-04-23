import React, { useEffect, useState } from 'react';

interface Activity {
  user: string;
  symbol: string;
  pnl: number;
  roi: number;
}

const POOL: Activity[] = [
  { user: 'USER_847X', symbol: 'BTC/USDT', pnl: 4250, roi: 18.4 },
  { user: 'TRADER_92K', symbol: 'ETH/USDT', pnl: 1820, roi: 12.7 },
  { user: 'NODE_AB12', symbol: 'XAU/USD', pnl: 920, roi: 8.2 },
  { user: 'USER_5F7C', symbol: 'SOL/USDT', pnl: 3140, roi: 24.1 },
  { user: 'TRADER_X8', symbol: 'BNB/USDT', pnl: 670, roi: 5.5 },
  { user: 'NODE_91A4', symbol: 'BTC/USDT', pnl: 8920, roi: 31.2 },
  { user: 'USER_K2J5', symbol: 'ETH/USDT', pnl: 2410, roi: 14.8 },
];

const MatrixActivityTicker: React.FC = () => {
  const [current, setCurrent] = useState<Activity | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    let idx = 0;
    const showNext = () => {
      const item = POOL[idx % POOL.length];
      idx++;
      setCurrent(item);
      setVisible(true);
      setTimeout(() => setVisible(false), 6000);
    };
    const initialDelay = setTimeout(() => {
      showNext();
      const interval = setInterval(showNext, 12000);
      return () => clearInterval(interval);
    }, 4000);
    return () => clearTimeout(initialDelay);
  }, [dismissed]);

  if (dismissed || !current) return null;

  return (
    <div
      className={`fixed bottom-24 right-4 lg:right-6 z-50 transition-all duration-500 ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'
      }`}
    >
      <div className="bg-[#0D0F16] border border-neon-green/30 shadow-[0_0_25px_rgba(0,255,157,0.15)] backdrop-blur-md p-4 w-[300px] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-neon-green" />
        <div className="flex gap-3 items-start">
          <div className="bg-neon-green/20 text-neon-green px-1.5 py-0.5 mt-0.5">
            <span className="font-mono font-bold text-xs">[+]</span>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <p className="font-mono text-xs text-foreground">
              <span className="text-muted-foreground">{current.user}</span> chốt lời thành công
            </p>
            <p className="font-mono text-base text-neon-green font-bold drop-shadow-[0_0_5px_rgba(0,255,157,0.5)]">
              +${current.pnl.toLocaleString()}
            </p>
            <p className="font-mono text-[10px] text-muted-foreground">
              Cặp: {current.symbol} · ROI: +{current.roi}%
            </p>
          </div>
        </div>
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-neon-green/50 shadow-[0_0_5px_#00FF9D] transition-all duration-[6000ms] ease-linear"
          style={{ width: visible ? '0%' : '100%' }}
        />
      </div>
    </div>
  );
};

export default MatrixActivityTicker;
