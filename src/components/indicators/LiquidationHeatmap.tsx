import React, { useEffect, useMemo, useState } from 'react';

interface LiqRow {
  symbol: string;
  longLiq: number;
  shortLiq: number;
  total: number;
}

interface Props {
  symbol?: string; // BTC, ETH...
}

// Coinglass public liquidation data is paywalled. Use Binance forced orders aggregate proxy:
// We fetch global 24h liquidation totals via CoinGlass-free fallback (binance ws is realtime only).
// Strategy: derive heuristic from Binance 24h funding + price drop * OI delta is complex.
// Practical approach: poll our own edge function-free public API: blockchain.info & coinglass mirror not stable.
// Instead use binance forced orders WS to accumulate per session.

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT'];

const LiquidationHeatmap: React.FC<Props> = () => {
  const [rows, setRows] = useState<Record<string, LiqRow>>(() =>
    Object.fromEntries(SYMBOLS.map(s => [s, { symbol: s, longLiq: 0, shortLiq: 0, total: 0 }]))
  );
  const [connected, setConnected] = useState(false);
  const [startedAt] = useState(Date.now());

  useEffect(() => {
    let ws: WebSocket | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      try {
        ws = new WebSocket('wss://fstream.binance.com/ws/!forceOrder@arr');
        ws.onopen = () => setConnected(true);
        ws.onmessage = (ev) => {
          try {
            const msg = JSON.parse(ev.data);
            const o = msg?.o;
            if (!o) return;
            const sym = o.s as string;
            if (!SYMBOLS.includes(sym)) return;
            const qty = parseFloat(o.q);
            const price = parseFloat(o.ap || o.p);
            if (!qty || !price) return;
            const usd = qty * price;
            // side === 'SELL' means a long position was liquidated (force-sold)
            const isLongLiq = o.S === 'SELL';
            setRows(prev => {
              const cur = prev[sym] ?? { symbol: sym, longLiq: 0, shortLiq: 0, total: 0 };
              const longLiq = cur.longLiq + (isLongLiq ? usd : 0);
              const shortLiq = cur.shortLiq + (!isLongLiq ? usd : 0);
              return { ...prev, [sym]: { symbol: sym, longLiq, shortLiq, total: longLiq + shortLiq } };
            });
          } catch {/* ignore */}
        };
        ws.onclose = () => {
          setConnected(false);
          retry = setTimeout(connect, 4000);
        };
        ws.onerror = () => { ws?.close(); };
      } catch {
        retry = setTimeout(connect, 4000);
      }
    };

    connect();
    return () => {
      if (retry) clearTimeout(retry);
      if (ws) { ws.onclose = null; ws.close(); }
    };
  }, []);

  const sorted = useMemo(() => Object.values(rows).sort((a, b) => b.total - a.total), [rows]);
  const maxTotal = Math.max(1, ...sorted.map(r => r.total));
  const grandTotal = sorted.reduce((s, r) => s + r.total, 0);
  const grandLong = sorted.reduce((s, r) => s + r.longLiq, 0);
  const grandShort = sorted.reduce((s, r) => s + r.shortLiq, 0);

  const fmt = (n: number) =>
    n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` :
    n >= 1e3 ? `$${(n / 1e3).toFixed(1)}K` :
    `$${n.toFixed(0)}`;

  const elapsed = Math.floor((Date.now() - startedAt) / 60000);

  return (
    <div className="border border-[#2b3139] rounded-md overflow-hidden bg-[#0b0e11]">
      <div className="flex items-center justify-between bg-[#1e2329] px-2 py-1.5 border-b border-[#2b3139]">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-[#0ecb81] animate-pulse' : 'bg-[#5e6673]'}`} />
          <span className="text-[9px] font-mono font-bold tracking-[0.18em] text-[#fcd535]">🔥 LIQUIDATIONS · LIVE</span>
        </div>
        <span className="text-[8px] font-mono text-[#5e6673]">{elapsed}m session</span>
      </div>

      {/* Summary bar */}
      <div className="px-2 py-1.5 border-b border-[#2b3139]/60 bg-[#161a1e]/50">
        <div className="flex items-center justify-between text-[10px] font-mono tabular-nums">
          <span className="text-[#5e6673]">Tổng phiên</span>
          <span className="text-[#eaecef] font-bold">{fmt(grandTotal)}</span>
        </div>
        {grandTotal > 0 && (
          <div className="flex h-1 mt-1 rounded-full overflow-hidden bg-[#2b3139]">
            <div className="bg-[#0ecb81]" style={{ width: `${(grandLong / grandTotal) * 100}%` }} title={`Long liq ${fmt(grandLong)}`} />
            <div className="bg-[#f6465d]" style={{ width: `${(grandShort / grandTotal) * 100}%` }} title={`Short liq ${fmt(grandShort)}`} />
          </div>
        )}
        <div className="flex items-center justify-between mt-0.5 text-[8px] font-mono">
          <span className="text-[#0ecb81]">▼ Long {grandTotal > 0 ? ((grandLong / grandTotal) * 100).toFixed(0) : 0}%</span>
          <span className="text-[#f6465d]">▲ Short {grandTotal > 0 ? ((grandShort / grandTotal) * 100).toFixed(0) : 0}%</span>
        </div>
      </div>

      <div className="divide-y divide-[#2b3139]/40 max-h-[200px] overflow-y-auto">
        {sorted.map(r => {
          const pct = (r.total / maxTotal) * 100;
          return (
            <div key={r.symbol} className="px-2 py-1 relative">
              <div
                className="absolute inset-y-0 left-0 bg-[#fcd535]/5 transition-all"
                style={{ width: `${pct}%` }}
              />
              <div className="relative flex items-center justify-between text-[10px] font-mono tabular-nums">
                <span className="text-[#eaecef] font-bold w-12">{r.symbol.replace('USDT', '')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#0ecb81]" title="Long liquidated">▼ {fmt(r.longLiq)}</span>
                  <span className="text-[#f6465d]" title="Short liquidated">▲ {fmt(r.shortLiq)}</span>
                  <span className="text-[#fcd535] font-bold w-16 text-right">{fmt(r.total)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {grandTotal === 0 && (
        <p className="px-2 py-3 text-[9px] font-mono text-[#5e6673] text-center">
          Đang lắng nghe forced orders... Số liệu cập nhật khi có thanh lý mới.
        </p>
      )}
      <div className="px-2 py-1 bg-[#161a1e]/50 border-t border-[#2b3139]/60">
        <p className="text-[8px] font-mono text-[#5e6673] leading-tight">
          ▼ = Long bị thanh lý (force sell) · ▲ = Short bị thanh lý (force buy) · Nguồn: Binance Futures
        </p>
      </div>
    </div>
  );
};

export default LiquidationHeatmap;
