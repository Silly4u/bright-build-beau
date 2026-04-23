import React, { useState } from 'react';
import { useTradeJournal, type TradeEntry } from '@/hooks/useAnalysisLocal';
import { BookOpen, Plus, X, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

const TradeJournal: React.FC = () => {
  const { trades, addTrade, closeTrade, removeTrade, stats } = useTradeJournal();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ symbol: 'BTC', side: 'long' as 'long' | 'short', entry: 0, size: 0, note: '' });
  const [closingId, setClosingId] = useState<string | null>(null);
  const [closeExit, setCloseExit] = useState(0);

  const submitNew = () => {
    if (!form.symbol || !form.entry || !form.size) {
      toast.error('Nhập đủ symbol, entry, size');
      return;
    }
    addTrade(form);
    setForm({ symbol: 'BTC', side: 'long', entry: 0, size: 0, note: '' });
    setShowForm(false);
    toast.success(`Đã ghi nhận lệnh ${form.side.toUpperCase()} ${form.symbol}`);
  };

  const submitClose = (t: TradeEntry) => {
    if (!closeExit) {
      toast.error('Nhập giá đóng');
      return;
    }
    closeTrade(t.id, closeExit);
    setClosingId(null);
    setCloseExit(0);
    toast.success(`Đã đóng lệnh ${t.symbol}`);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Trade Journal</span>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="text-cyan-400 hover:text-cyan-300">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats */}
      {stats.totalClosed > 0 && (
        <div className="grid grid-cols-3 gap-px bg-white/5 border-b border-white/5">
          <div className="bg-[#0d1526] px-2 py-1.5 text-center">
            <div className="text-[9px] text-muted-foreground/60 font-mono">WINRATE</div>
            <div className={`text-[11px] font-bold font-mono ${stats.winrate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>{stats.winrate.toFixed(0)}%</div>
          </div>
          <div className="bg-[#0d1526] px-2 py-1.5 text-center">
            <div className="text-[9px] text-muted-foreground/60 font-mono">W/L</div>
            <div className="text-[11px] font-bold font-mono text-foreground">{stats.wins}/{stats.losses}</div>
          </div>
          <div className="bg-[#0d1526] px-2 py-1.5 text-center">
            <div className="text-[9px] text-muted-foreground/60 font-mono">PnL</div>
            <div className={`text-[11px] font-bold font-mono ${stats.totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* New trade form */}
      {showForm && (
        <div className="p-2.5 border-b border-white/5 bg-white/[0.02] space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            <input
              placeholder="Symbol"
              value={form.symbol}
              onChange={e => setForm(f => ({ ...f, symbol: e.target.value.toUpperCase() }))}
              className="bg-[#0b1120] border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:border-cyan-400/40 outline-none"
            />
            <select
              value={form.side}
              onChange={e => setForm(f => ({ ...f, side: e.target.value as 'long' | 'short' }))}
              className="bg-[#0b1120] border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:border-cyan-400/40 outline-none"
            >
              <option value="long">📈 LONG</option>
              <option value="short">📉 SHORT</option>
            </select>
            <input
              type="number" placeholder="Entry"
              value={form.entry || ''} step={0.01}
              onChange={e => setForm(f => ({ ...f, entry: parseFloat(e.target.value) || 0 }))}
              className="bg-[#0b1120] border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:border-cyan-400/40 outline-none"
            />
            <input
              type="number" placeholder="Size"
              value={form.size || ''} step={0.001}
              onChange={e => setForm(f => ({ ...f, size: parseFloat(e.target.value) || 0 }))}
              className="bg-[#0b1120] border border-white/10 rounded px-2 py-1 text-[10px] font-mono text-foreground focus:border-cyan-400/40 outline-none"
            />
          </div>
          <input
            placeholder="Note (lý do, setup...)"
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            maxLength={100}
            className="w-full bg-[#0b1120] border border-white/10 rounded px-2 py-1 text-[10px] text-foreground focus:border-cyan-400/40 outline-none"
          />
          <button onClick={submitNew} className="w-full py-1.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 text-[10px] font-bold hover:bg-cyan-500/30">
            ✓ Ghi nhận
          </button>
        </div>
      )}

      <div className="divide-y divide-white/5 max-h-[260px] overflow-y-auto scrollbar-thin">
        {trades.length === 0 ? (
          <div className="px-3 py-4 text-center text-[10px] text-muted-foreground/60">Chưa có lệnh nào — Nhấn + để ghi nhận</div>
        ) : trades.slice(0, 20).map(t => {
          const isClosing = closingId === t.id;
          return (
            <div key={t.id} className="px-3 py-1.5 group">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {t.side === 'long' ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-red-400" />}
                  <span className="text-[10px] font-bold font-mono text-foreground">{t.symbol}</span>
                  <span className="text-[9px] text-muted-foreground/60 font-mono">@{t.entry}</span>
                </div>
                {t.status === 'closed' ? (
                  <span className={`text-[10px] font-bold font-mono ${(t.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {(t.pnl || 0) >= 0 ? '+' : ''}${(t.pnl || 0).toFixed(2)}
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setClosingId(t.id); setCloseExit(0); }} className="text-[9px] text-amber-400 hover:text-amber-300 font-mono">
                      Đóng
                    </button>
                    <button onClick={() => removeTrade(t.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
              {t.note && <div className="text-[9px] text-muted-foreground/60 mt-0.5 italic line-clamp-1">"{t.note}"</div>}
              {isClosing && (
                <div className="flex gap-1 mt-1.5">
                  <input
                    type="number" placeholder="Exit price" autoFocus
                    value={closeExit || ''} step={0.01}
                    onChange={e => setCloseExit(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-[#0b1120] border border-white/10 rounded px-2 py-0.5 text-[10px] font-mono focus:border-cyan-400/40 outline-none"
                  />
                  <button onClick={() => submitClose(t)} className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 text-[9px] font-bold">✓</button>
                  <button onClick={() => setClosingId(null)} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted-foreground text-[9px]">✕</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TradeJournal;
