import React, { useEffect, useState } from 'react';

interface GlobalData {
  btcDominance: number | null;
  totalMcap: number | null;
  totalVol: number | null;
  fng: { value: number; classification: string } | null;
  btcFunding: number | null;
  longShortRatio: number | null;
  btcOI: number | null;
  ethOI: number | null;
}

const initial: GlobalData = {
  btcDominance: null, totalMcap: null, totalVol: null, fng: null,
  btcFunding: null, longShortRatio: null, btcOI: null, ethOI: null,
};

const fmtMcap = (n: number | null) => {
  if (n === null) return '—';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  return `$${(n / 1e6).toFixed(0)}M`;
};

const fngColor = (v: number) => {
  if (v < 25) return 'text-[#f6465d]';
  if (v < 45) return 'text-[#ff9332]';
  if (v < 55) return 'text-[#fcd535]';
  if (v < 75) return 'text-[#a3e635]';
  return 'text-[#0ecb81]';
};

const fngLabel = (v: number) => {
  if (v < 25) return 'Extreme Fear';
  if (v < 45) return 'Fear';
  if (v < 55) return 'Neutral';
  if (v < 75) return 'Greed';
  return 'Extreme Greed';
};

const Stat: React.FC<{ label: string; value: React.ReactNode; sub?: React.ReactNode; highlight?: 'up' | 'down' | 'warn' | 'none' }> = ({ label, value, sub, highlight = 'none' }) => {
  const valColor =
    highlight === 'up' ? 'text-[#0ecb81]' :
    highlight === 'down' ? 'text-[#f6465d]' :
    highlight === 'warn' ? 'text-[#fcd535]' : 'text-[#eaecef]';
  return (
    <div className="flex items-baseline gap-1.5 px-3 py-1 border-r border-[#2b3139]/60 shrink-0">
      <span className="text-[9px] uppercase tracking-[0.15em] text-[#5e6673] font-mono">{label}</span>
      <span className={`text-[12px] font-mono font-bold tabular-nums ${valColor}`}>{value}</span>
      {sub && <span className="text-[10px] font-mono text-[#848e9c] tabular-nums">{sub}</span>}
    </div>
  );
};

const MarketOverviewBar: React.FC = () => {
  const [data, setData] = useState<GlobalData>(initial);

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        // CoinGecko global
        const cgPromise = fetch('https://api.coingecko.com/api/v3/global')
          .then(r => r.ok ? r.json() : null).catch(() => null);
        // Fear & Greed
        const fngPromise = fetch('https://api.alternative.me/fng/?limit=1')
          .then(r => r.ok ? r.json() : null).catch(() => null);
        // Binance funding
        const fundingPromise = fetch('https://fapi.binance.com/fapi/v1/premiumIndex?symbol=BTCUSDT')
          .then(r => r.ok ? r.json() : null).catch(() => null);
        // Long/Short ratio
        const lsPromise = fetch('https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=BTCUSDT&period=1h&limit=1')
          .then(r => r.ok ? r.json() : null).catch(() => null);
        // Open Interest BTC + ETH
        const btcOIPromise = fetch('https://fapi.binance.com/fapi/v1/openInterest?symbol=BTCUSDT')
          .then(r => r.ok ? r.json() : null).catch(() => null);
        const ethOIPromise = fetch('https://fapi.binance.com/fapi/v1/openInterest?symbol=ETHUSDT')
          .then(r => r.ok ? r.json() : null).catch(() => null);

        const [cg, fng, funding, ls, btcOI, ethOI] = await Promise.all([
          cgPromise, fngPromise, fundingPromise, lsPromise, btcOIPromise, ethOIPromise
        ]);

        if (cancelled) return;

        setData({
          btcDominance: cg?.data?.market_cap_percentage?.btc ?? null,
          totalMcap: cg?.data?.total_market_cap?.usd ?? null,
          totalVol: cg?.data?.total_volume?.usd ?? null,
          fng: fng?.data?.[0] ? { value: parseInt(fng.data[0].value), classification: fng.data[0].value_classification } : null,
          btcFunding: funding?.lastFundingRate ? parseFloat(funding.lastFundingRate) * 100 : null,
          longShortRatio: ls?.[0]?.longShortRatio ? parseFloat(ls[0].longShortRatio) : null,
          btcOI: btcOI?.openInterest ? parseFloat(btcOI.openInterest) : null,
          ethOI: ethOI?.openInterest ? parseFloat(ethOI.openInterest) : null,
        });
      } catch {
        // silent
      }
    };

    fetchAll();
    const t = setInterval(fetchAll, 60000); // 1 min
    return () => { cancelled = true; clearInterval(t); };
  }, []);

  return (
    <div className="bg-[#0b0e11] border border-[#2b3139] rounded-md mb-1.5 overflow-hidden">
      <div className="flex items-center overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-1 px-3 py-1 border-r border-[#2b3139]/60 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0ecb81] animate-pulse" />
          <span className="text-[9px] font-mono text-[#0ecb81] tracking-widest">LIVE</span>
        </div>

        <Stat
          label="BTC.D"
          value={data.btcDominance !== null ? `${data.btcDominance.toFixed(2)}%` : '—'}
          highlight="warn"
        />
        <Stat
          label="MCap"
          value={fmtMcap(data.totalMcap)}
        />
        <Stat
          label="24h Vol"
          value={fmtMcap(data.totalVol)}
        />
        <Stat
          label="F&G"
          value={data.fng ? <span className={fngColor(data.fng.value)}>{data.fng.value}</span> : '—'}
          sub={data.fng ? <span className={fngColor(data.fng.value)}>{fngLabel(data.fng.value)}</span> : undefined}
        />
        <Stat
          label="BTC Funding"
          value={data.btcFunding !== null ? `${data.btcFunding >= 0 ? '+' : ''}${data.btcFunding.toFixed(4)}%` : '—'}
          highlight={data.btcFunding === null ? 'none' : data.btcFunding > 0.01 ? 'down' : data.btcFunding < -0.01 ? 'up' : 'none'}
        />
        <Stat
          label="L/S Ratio"
          value={data.longShortRatio !== null ? data.longShortRatio.toFixed(2) : '—'}
          highlight={data.longShortRatio === null ? 'none' : data.longShortRatio > 1.5 ? 'down' : data.longShortRatio < 0.7 ? 'up' : 'none'}
        />
        <Stat
          label="BTC OI"
          value={data.btcOI !== null ? `${(data.btcOI / 1000).toFixed(1)}K` : '—'}
        />
        <Stat
          label="ETH OI"
          value={data.ethOI !== null ? `${(data.ethOI / 1000).toFixed(0)}K` : '—'}
        />
        <div className="ml-auto px-3 py-1 shrink-0">
          <span className="text-[9px] font-mono text-[#5e6673]">UTC {new Date().toUTCString().slice(17, 22)}</span>
        </div>
      </div>
    </div>
  );
};

export default MarketOverviewBar;
