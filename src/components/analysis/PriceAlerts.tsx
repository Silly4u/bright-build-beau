import React, { useEffect, useState } from 'react';
import { usePriceAlerts, ensureNotificationPermission, fireNotification } from '@/hooks/useAnalysisLocal';
import { Bell, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XAUUSDT'];

const PriceAlerts: React.FC = () => {
  const { alerts, add, remove, trigger, reset } = usePriceAlerts();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ symbol: 'BTCUSDT', direction: 'above' as 'above' | 'below', target: 0 });
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});

  // Poll live prices
  useEffect(() => {
    const symbols = Array.from(new Set(alerts.map(a => a.symbol)));
    if (symbols.length === 0) return;
    let cancelled = false;
    const fetchPrices = async () => {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(JSON.stringify(symbols))}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const map: Record<string, number> = {};
        data.forEach((d: { symbol: string; price: string }) => { map[d.symbol] = parseFloat(d.price); });
        setLivePrices(map);
      } catch { /* ignore */ }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 10_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [alerts]);

  // Trigger logic
  useEffect(() => {
    alerts.forEach(a => {
      if (a.triggered) return;
      const live = livePrices[a.symbol];
      if (!live) return;
      const hit = a.direction === 'above' ? live >= a.target_price : live <= a.target_price;
      if (hit) {
        trigger(a.id);
        toast.warning(`🔔 ${a.display} đã ${a.direction === 'above' ? 'vượt' : 'phá xuống'} $${a.target_price}`, {
          description: `Giá hiện tại: $${live}`,
          duration: 12_000,
        });
        fireNotification(`${a.display} ${a.direction === 'above' ? '↑' : '↓'} $${a.target_price}`, `Giá: $${live}`);
      }
    });
  }, [livePrices, alerts, trigger]);

  const submit = async () => {
    if (!form.target) { toast.error('Nhập target price'); return; }
    await ensureNotificationPermission();
    const display = form.symbol.replace('USDT', '');
    add(form.symbol, display, form.direction, form.target);
    setForm({ symbol: 'BTCUSDT', direction: 'above', target: 0 });
    setShowForm(false);
    toast.success(`Đã tạo alert ${display} ${form.direction === 'above' ? '>' : '<'} $${form.target}`);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Price Alerts</span>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="text-cyan-400 hover:text-cyan-300">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {showForm && (
        <div className="p-2.5 border-b border-white/5 bg-white/[0.02] space-y-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            <select
              value={form.symbol}
              onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))}
              className="bg-[#0b1120] border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:border-cyan-400/40 outline-none"
            >
              {SYMBOLS.map(s => <option key={s} value={s}>{s.replace('USDT', '')}</option>)}
            </select>
            <select
              value={form.direction}
              onChange={e => setForm(f => ({ ...f, direction: e.target.value as 'above' | 'below' }))}
              className="bg-[#0b1120] border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:border-cyan-400/40 outline-none"
            >
              <option value="above">↑ vượt</option>
              <option value="below">↓ phá</option>
            </select>
          </div>
          <input
            type="number" placeholder="Target price" autoFocus
            value={form.target || ''} step={0.01}
            onChange={e => setForm(f => ({ ...f, target: parseFloat(e.target.value) || 0 }))}
            className="w-full bg-[#0b1120] border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:border-cyan-400/40 outline-none"
          />
          <button onClick={submit} className="w-full py-1.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 text-[10px] font-bold hover:bg-cyan-500/30">
            ✓ Tạo Alert
          </button>
        </div>
      )}

      <div className="divide-y divide-white/5 max-h-[200px] overflow-y-auto scrollbar-thin">
        {alerts.length === 0 ? (
          <div className="px-3 py-4 text-center text-[10px] text-muted-foreground/60">Chưa có alert — Nhấn + để tạo</div>
        ) : alerts.slice(0, 10).map(a => {
          const live = livePrices[a.symbol];
          const distance = live ? ((a.target_price - live) / live) * 100 : 0;
          return (
            <div key={a.id} className={`px-3 py-1.5 flex items-center justify-between gap-2 group ${a.triggered ? 'bg-amber-500/10' : ''}`}>
              <div className="flex items-center gap-1.5 min-w-0">
                {a.triggered ? <span className="text-amber-400 text-xs">🔔</span> : <span className={a.direction === 'above' ? 'text-emerald-400 text-xs' : 'text-red-400 text-xs'}>{a.direction === 'above' ? '↑' : '↓'}</span>}
                <span className="text-[10px] font-bold font-mono text-foreground">{a.display}</span>
                <span className="text-[10px] text-muted-foreground/70 font-mono">${a.target_price}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {!a.triggered && live && (
                  <span className={`text-[9px] font-mono ${Math.abs(distance) < 1 ? 'text-amber-400' : 'text-muted-foreground/60'}`}>
                    {distance > 0 ? '+' : ''}{distance.toFixed(2)}%
                  </span>
                )}
                {a.triggered && (
                  <button onClick={() => reset(a.id)} className="text-[9px] text-cyan-400 hover:text-cyan-300 font-mono">↺ Reset</button>
                )}
                <button onClick={() => remove(a.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-red-400">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriceAlerts;
