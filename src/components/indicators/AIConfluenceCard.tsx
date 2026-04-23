import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useIndicatorPermissions } from '@/hooks/useIndicatorPermissions';
import type { IndicatorVote } from '@/lib/indicatorVotes';

interface Props {
  pair: string;
  timeframe: string;
  livePrice: number;
  votes: IndicatorVote[];
  strengthScore: number;
}

interface Decision {
  decision: 'STRONG_BUY' | 'BUY' | 'WAIT' | 'SELL' | 'STRONG_SELL';
  confidence: number;
  bias: 'bullish' | 'bearish' | 'neutral';
  summary: string;
  pros: string[];
  cons: string[];
  action: string;
}

const decisionStyle: Record<Decision['decision'], { color: string; bg: string }> = {
  STRONG_BUY: { color: '#0ecb81', bg: 'bg-[#0ecb81]/15' },
  BUY: { color: '#0ecb81', bg: 'bg-[#0ecb81]/10' },
  WAIT: { color: '#fcd535', bg: 'bg-[#fcd535]/10' },
  SELL: { color: '#f6465d', bg: 'bg-[#f6465d]/10' },
  STRONG_SELL: { color: '#f6465d', bg: 'bg-[#f6465d]/15' },
};

const AIConfluenceCard: React.FC<Props> = ({ pair, timeframe, livePrice, votes, strengthScore }) => {
  const { user } = useAuth();
  const { hasAccess, loading: permLoading } = useIndicatorPermissions();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastKeyRef = useRef<string>('');

  const isPremium = hasAccess('ai_confluence');

  const analyze = useCallback(async () => {
    if (!isPremium || votes.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke('ai-confluence', {
        body: { pair, timeframe, livePrice, votes, strengthScore },
      });
      if (fnErr) throw new Error(fnErr.message || 'AI error');
      if (data?.error) throw new Error(data.error);
      setDecision(data as Decision);
    } catch (e: any) {
      setError(e.message || 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  }, [isPremium, pair, timeframe, livePrice, votes, strengthScore]);

  // Auto-analyze when context changes (debounced via key)
  useEffect(() => {
    if (!isPremium || votes.length < 2) return;
    const key = `${pair}|${timeframe}|${votes.map(v => v.id + v.vote).join(',')}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;
    const t = setTimeout(() => analyze(), 800);
    return () => clearTimeout(t);
  }, [pair, timeframe, votes, isPremium, analyze]);

  // Locked / not premium
  if (!user) {
    return (
      <div className="border border-[#2b3139] rounded-lg overflow-hidden">
        <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest">
          🤖 AI CONFLUENCE
          <span className="ml-2 text-[#fcd535]">PREMIUM</span>
        </div>
        <div className="bg-[#161a1e] p-3 text-[10px] font-mono text-[#5e6673] text-center space-y-2">
          <p>AI đọc tất cả chỉ báo → quyết định BUY/SELL/WAIT kèm % độ tin cậy.</p>
          <Link
            to="/auth"
            className="inline-block px-3 py-1 bg-[#fcd535]/10 border border-[#fcd535]/30 text-[#fcd535] rounded font-bold hover:bg-[#fcd535]/20 transition-colors"
          >
            Đăng nhập để mở khóa
          </Link>
        </div>
      </div>
    );
  }
  if (permLoading) {
    return (
      <div className="border border-[#2b3139] rounded-lg p-3 bg-[#161a1e] text-[10px] font-mono text-[#5e6673]">
        Đang kiểm tra quyền...
      </div>
    );
  }
  if (!isPremium) {
    return (
      <div className="border border-[#fcd535]/30 rounded-lg overflow-hidden">
        <div className="bg-[#fcd535]/10 px-2 py-1.5 text-[10px] font-mono font-bold tracking-widest flex items-center justify-between">
          <span className="text-[#fcd535]">🤖 AI CONFLUENCE</span>
          <span className="text-[#fcd535] text-[9px]">PREMIUM</span>
        </div>
        <div className="bg-[#161a1e] p-3 text-[10px] font-mono space-y-2">
          <p className="text-[#eaecef]">
            🔓 Mở khóa AI phân tích tổng hợp tất cả chỉ báo → ra quyết định BUY/SELL/WAIT kèm độ tin cậy %, lý do và điểm vào.
          </p>
          <p className="text-[#5e6673]">
            Liên hệ admin để cấp quyền premium <code className="text-[#fcd535]">ai_confluence</code>.
          </p>
        </div>
      </div>
    );
  }

  // Premium UI
  return (
    <div className="border border-[#2b3139] rounded-lg overflow-hidden">
      <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest flex items-center justify-between">
        <span>🤖 AI CONFLUENCE</span>
        <button
          onClick={analyze}
          disabled={loading || votes.length === 0}
          className="text-[10px] text-[#fcd535] hover:underline disabled:opacity-40"
        >
          {loading ? '⟳' : '↻ Làm mới'}
        </button>
      </div>
      <div className="bg-[#161a1e] p-2.5">
        {votes.length === 0 ? (
          <p className="text-[10px] font-mono text-[#5e6673] text-center py-2">
            Bật ít nhất 2 chỉ báo để AI phân tích
          </p>
        ) : loading && !decision ? (
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#fcd535] py-3 justify-center">
            <div className="w-3 h-3 border-2 border-[#fcd535] border-t-transparent rounded-full animate-spin" />
            AI đang đọc {votes.length} chỉ báo...
          </div>
        ) : error ? (
          <p className="text-[10px] font-mono text-[#f6465d] py-2">⚠️ {error}</p>
        ) : decision ? (
          <div className="space-y-2.5">
            {/* Decision banner */}
            <div className={`${decisionStyle[decision.decision].bg} rounded p-2`}>
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-sm font-bold font-mono"
                  style={{ color: decisionStyle[decision.decision].color }}
                >
                  {decision.decision.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-[#eaecef]">
                  Độ tin cậy <span className="font-bold" style={{ color: decisionStyle[decision.decision].color }}>{decision.confidence}%</span>
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#eaecef] leading-relaxed">{decision.summary}</p>
            </div>

            {/* Action */}
            <div className="bg-[#0b0e11] rounded p-2 border border-[#2b3139]">
              <div className="text-[9px] font-mono text-[#5e6673] tracking-widest mb-1">🎯 HÀNH ĐỘNG</div>
              <p className="text-[10px] font-mono text-[#eaecef] leading-relaxed">{decision.action}</p>
            </div>

            {/* Pros */}
            {decision.pros.length > 0 && (
              <div>
                <div className="text-[9px] font-mono text-[#0ecb81] tracking-widest mb-1">✓ ỦNG HỘ</div>
                <ul className="space-y-0.5">
                  {decision.pros.map((p, i) => (
                    <li key={i} className="text-[10px] font-mono text-[#eaecef] flex gap-1.5">
                      <span className="text-[#0ecb81]">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cons */}
            {decision.cons.length > 0 && (
              <div>
                <div className="text-[9px] font-mono text-[#f6465d] tracking-widest mb-1">⚠ RỦI RO</div>
                <ul className="space-y-0.5">
                  {decision.cons.map((c, i) => (
                    <li key={i} className="text-[10px] font-mono text-[#eaecef] flex gap-1.5">
                      <span className="text-[#f6465d]">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="text-[10px] font-mono text-[#5e6673] text-center py-2">
            Click "↻ Làm mới" để AI phân tích
          </p>
        )}
      </div>
    </div>
  );
};

export default AIConfluenceCard;
