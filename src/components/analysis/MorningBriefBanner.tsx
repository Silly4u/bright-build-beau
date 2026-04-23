import React, { useState } from 'react';
import { useMorningBrief } from '@/hooks/useMorningBrief';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const MorningBriefBanner: React.FC = () => {
  const { brief, loading, generating, error, generate } = useMorningBrief();
  const [expanded, setExpanded] = useState(true);

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-4 animate-pulse h-32" />
    );
  }

  // No brief yet today → CTA to generate
  if (!brief) {
    return (
      <div className="glass-card rounded-xl p-5 border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-sm font-bold text-foreground">Morning Brief chưa có cho hôm nay</div>
              <div className="text-[10px] text-muted-foreground/70">AI sẽ tự sinh báo cáo lúc 7:30 sáng VN, hoặc tạo ngay bây giờ</div>
            </div>
          </div>
          <button
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 disabled:opacity-50 transition-all"
          >
            {generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            {generating ? 'AI đang phân tích...' : '✨ Tạo Brief AI'}
          </button>
        </div>
        {error && <div className="text-[10px] text-red-400 mt-2 font-mono">⚠ {error}</div>}
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-violet-500/[0.04] overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </span>
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <div className="text-left">
            <div className="text-sm font-bold text-foreground">Morning Brief — {new Date(brief.brief_date).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}</div>
            <div className="text-[10px] text-muted-foreground/60 font-mono">Cập nhật {new Date(brief.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} · AI Phân tích</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); generate(); }}
            disabled={generating}
            className="text-[10px] text-muted-foreground hover:text-cyan-400 disabled:opacity-50"
            title="Tạo lại"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          {/* Recap & Outlook */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
              <div className="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest mb-1.5">📊 24h qua</div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{brief.recap}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-lg p-3">
              <div className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest mb-1.5">🔮 24h tới</div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{brief.outlook}</p>
            </div>
          </div>

          {/* Scenarios */}
          {brief.scenarios.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-violet-400/80 uppercase tracking-widest mb-2">🎯 3 kịch bản hôm nay</div>
              <div className="grid md:grid-cols-3 gap-2">
                {brief.scenarios.map((s, i) => {
                  const isBull = s.title.toUpperCase().includes('BULL');
                  const isBear = s.title.toUpperCase().includes('BEAR');
                  const color = isBull ? 'emerald' : isBear ? 'red' : 'amber';
                  return (
                    <div key={i} className={`bg-${color}-500/5 border border-${color}-500/20 rounded-lg p-3 space-y-1.5`}>
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[10px] font-bold text-${color}-400 uppercase`}>{s.title}</span>
                        <span className="text-[10px] font-mono text-muted-foreground/60">{s.probability}%</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground/80 leading-snug">{s.condition}</div>
                      <div className="grid grid-cols-3 gap-1 text-[9px] font-mono pt-1 border-t border-white/5">
                        <div><span className="text-muted-foreground/50">E:</span> <span className="text-foreground">{s.entry}</span></div>
                        <div><span className="text-emerald-400/60">T:</span> <span className="text-emerald-400">{s.target}</span></div>
                        <div><span className="text-red-400/60">S:</span> <span className="text-red-400">{s.stop}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MorningBriefBanner;
