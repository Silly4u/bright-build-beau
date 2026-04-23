import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIndicatorPermissions } from '@/hooks/useIndicatorPermissions';
import TradingChart from '@/components/indicators/TradingChart';
import { useMarketData } from '@/hooks/useMarketData';

const PAIR_OPTIONS = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT', 'DOGE/USDT'];
const TF_OPTIONS = ['M15', 'H1', 'H4', 'D1'];

interface CellProps {
  pair: string;
  timeframe: string;
  onChangePair: (p: string) => void;
  onChangeTf: (t: string) => void;
}

const Cell: React.FC<CellProps> = ({ pair, timeframe, onChangePair, onChangeTf }) => {
  const md = useMarketData(pair, timeframe);
  const last = md.candles[md.candles.length - 1];
  const prev = md.candles[md.candles.length - 2];
  const change = last && prev ? ((last.close - prev.close) / prev.close) * 100 : 0;

  return (
    <div className="bg-[#0b0e11] border border-[#2b3139] rounded overflow-hidden flex flex-col">
      <div className="flex items-center justify-between bg-[#1e2329] px-2 py-1 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <select
            value={pair}
            onChange={e => onChangePair(e.target.value)}
            className="bg-[#0b0e11] border border-[#2b3139] rounded px-1 py-0.5 text-[10px] font-mono text-[#eaecef]"
          >
            {PAIR_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            value={timeframe}
            onChange={e => onChangeTf(e.target.value)}
            className="bg-[#0b0e11] border border-[#2b3139] rounded px-1 py-0.5 text-[10px] font-mono text-[#eaecef]"
          >
            {TF_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {last && (
          <div className="flex items-center gap-2">
            <span className="text-[#eaecef] font-bold">{last.close.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            <span className={change >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 min-h-[280px]">
        {md.loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-5 h-5 border-2 border-[#fcd535] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <TradingChart
            key={`${pair}-${timeframe}`}
            candles={md.candles}
            indicators={md.indicators}
            zones={md.zones}
            trendline={null}
            trendlineResistance={null}
            enabledIndicators={[]}
            height={280}
            smcAnalysis={null}
            alphaNetData={null}
            matrixData={null}
            engineData={null}
            tpSlData={null}
            buySellData={null}
            proEmaData={null}
            srData={null}
            wyckoffData={null}
            alphaLHData={null}
            alphaEventData={null}
            alphaProData={null}
            onLoadMore={md.fetchOlderCandles}
          />
        )}
      </div>
    </div>
  );
};

interface Props {
  initialPairs?: string[];
  defaultTimeframe?: string;
}

const MultiChartGrid: React.FC<Props> = ({
  initialPairs = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'XAU/USDT'],
  defaultTimeframe = 'H1',
}) => {
  const { user } = useAuth();
  const { hasAccess, loading } = useIndicatorPermissions();
  const isPremium = hasAccess('multi_chart');
  const [cells, setCells] = useState(
    initialPairs.slice(0, 4).map(p => ({ pair: p, timeframe: defaultTimeframe })),
  );

  const updateCell = (idx: number, patch: Partial<{ pair: string; timeframe: string }>) => {
    setCells(prev => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  if (!user) {
    return (
      <div className="border border-[#2b3139] rounded-lg p-6 bg-[#161a1e] text-center text-[10px] font-mono space-y-3">
        <p className="text-[#eaecef]">🎯 Multi-chart 4 cặp đồng thời — yêu cầu đăng nhập + Premium</p>
        <Link to="/auth" className="inline-block px-4 py-2 bg-[#fcd535]/10 border border-[#fcd535]/30 text-[#fcd535] rounded font-bold hover:bg-[#fcd535]/20">
          Đăng nhập
        </Link>
      </div>
    );
  }
  if (loading) return null;
  if (!isPremium) {
    return (
      <div className="border border-[#fcd535]/30 rounded-lg p-6 bg-[#161a1e] text-center text-[10px] font-mono space-y-2">
        <p className="text-[#fcd535] font-bold text-sm">🎯 Multi-chart 4 cặp — PREMIUM</p>
        <p className="text-[#eaecef]">Xem BTC + ETH + SOL + XAU đồng thời, mỗi ô khung TG riêng.</p>
        <p className="text-[#5e6673]">Liên hệ admin cấp quyền <code className="text-[#fcd535]">multi_chart</code>.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {cells.map((c, i) => (
        <Cell
          key={i}
          pair={c.pair}
          timeframe={c.timeframe}
          onChangePair={p => updateCell(i, { pair: p })}
          onChangeTf={t => updateCell(i, { timeframe: t })}
        />
      ))}
    </div>
  );
};

export default MultiChartGrid;
