import React, { useEffect, useState } from 'react';

interface Ticker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  quoteVolume: string;
}

interface MoverRow {
  symbol: string;
  display: string;
  price: number;
  change: number;
  vol: number;
}

const FILTER = (s: string) =>
  s.endsWith('USDT') &&
  !s.includes('UP') && !s.includes('DOWN') &&
  !s.includes('BULL') && !s.includes('BEAR') &&
  !s.startsWith('USD');

interface Props {
  onSelect?: (pair: string) => void;
}

const TopMoversPanel: React.FC<Props> = ({ onSelect }) => {
  const [tab, setTab] = useState<'gainers' | 'losers' | 'volume'>('gainers');
  const [rows, setRows] = useState<MoverRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const r = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        if (!r.ok) return;
        const data: Ticker[] = await r.json();
        if (cancelled) return;
        const filtered = data
          .filter(d => FILTER(d.symbol))
          .map(d => ({
            symbol: d.symbol,
            display: `${d.symbol.replace('USDT', '')}/USDT`,
            price: parseFloat(d.lastPrice),
            change: parseFloat(d.priceChangePercent),
            vol: parseFloat(d.quoteVolume),
          }))
          .filter(d => d.vol > 5_000_000); // min liquidity
        setRows(filtered);
      } catch {
        // silent
      }
    };
    fetchData();
    const t = setInterval(fetchData, 30_000);
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  const sorted = React.useMemo(() => {
    if (!rows) return [];
    if (tab === 'gainers') return [...rows].sort((a, b) => b.change - a.change).slice(0, 10);
    if (tab === 'losers') return [...rows].sort((a, b) => a.change - b.change).slice(0, 10);
    return [...rows].sort((a, b) => b.vol - a.vol).slice(0, 10);
  }, [rows, tab]);

  const fmtVol = (v: number) =>
    v >= 1e9 ? `${(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : `${(v / 1e3).toFixed(0)}K`;

  return (
    <div className="border border-[#2b3139] rounded-md overflow-hidden bg-[#0b0e11]">
      <div className="flex items-center justify-between bg-[#1e2329] px-2 py-1.5">
        <span className="text-[9px] font-mono font-bold tracking-[0.18em] text-[#fcd535]">MOVERS · 24H</span>
        <div className="flex items-center gap-0 bg-[#0b0e11] rounded p-0.5">
          {(['gainers', 'losers', 'volume'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-colors ${
                tab === t ? 'bg-[#fcd535] text-[#0b0e11]' : 'text-[#848e9c] hover:text-[#eaecef]'
              }`}
            >
              {t === 'gainers' ? '▲' : t === 'losers' ? '▼' : 'VOL'}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-[260px] overflow-y-auto">
        {!rows ? (
          <div className="p-3 text-center">
            <div className="inline-block w-3 h-3 border-2 border-[#fcd535] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <p className="p-3 text-[10px] font-mono text-[#5e6673] text-center">Không có dữ liệu</p>
        ) : (
          <table className="w-full text-[10px] font-mono tabular-nums">
            <thead className="text-[8px] text-[#5e6673] uppercase tracking-wider">
              <tr className="border-b border-[#2b3139]">
                <th className="text-left px-2 py-1 font-normal">Cặp</th>
                <th className="text-right px-2 py-1 font-normal">Giá</th>
                <th className="text-right px-2 py-1 font-normal">% 24h</th>
                <th className="text-right px-2 py-1 font-normal">Vol</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(r => (
                <tr
                  key={r.symbol}
                  onClick={() => onSelect?.(r.display)}
                  className="border-b border-[#2b3139]/40 hover:bg-[#2b3139]/40 cursor-pointer"
                >
                  <td className="px-2 py-1 text-[#eaecef] font-bold">{r.symbol.replace('USDT', '')}</td>
                  <td className="px-2 py-1 text-right text-[#eaecef]">
                    {r.price < 1 ? r.price.toPrecision(4) : r.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className={`px-2 py-1 text-right font-bold ${r.change >= 0 ? 'text-[#0ecb81]' : 'text-[#f6465d]'}`}>
                    {r.change >= 0 ? '+' : ''}{r.change.toFixed(2)}%
                  </td>
                  <td className="px-2 py-1 text-right text-[#848e9c]">{fmtVol(r.vol)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TopMoversPanel;
