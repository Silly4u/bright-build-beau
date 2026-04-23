import React from 'react';
import { IndicatorVote, aggregateStrength, strengthLabel } from '@/lib/indicatorVotes';

interface Props {
  votes: IndicatorVote[];
}

const IndicatorStrengthMeter: React.FC<Props> = ({ votes }) => {
  const score = aggregateStrength(votes);
  const { text, tone } = strengthLabel(score);
  const bulls = votes.filter(v => v.vote === 1).length;
  const bears = votes.filter(v => v.vote === -1).length;
  const neutrals = votes.filter(v => v.vote === 0).length;

  // Map score [-100, +100] to angle [-90deg, +90deg] for needle
  const angle = (score / 100) * 90;

  const toneColor =
    tone === 'bull' ? '#0ecb81' : tone === 'bear' ? '#f6465d' : '#fcd535';

  if (votes.length === 0) {
    return (
      <div className="border border-[#2b3139] rounded-lg overflow-hidden">
        <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest">
          ⚖️ STRENGTH METER
        </div>
        <div className="bg-[#161a1e] p-3 text-[10px] font-mono text-[#5e6673] text-center">
          Bật ít nhất 1 chỉ báo để xem điểm tổng
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#2b3139] rounded-lg overflow-hidden">
      <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest flex items-center justify-between">
        <span>⚖️ STRENGTH METER</span>
        <span className="text-[#5e6673]">{votes.length} ind</span>
      </div>
      <div className="bg-[#161a1e] p-3">
        {/* Gauge SVG */}
        <div className="relative flex items-center justify-center mb-2">
          <svg viewBox="0 0 200 110" className="w-full max-w-[180px]">
            {/* Bear arc (red) */}
            <path d="M 20 100 A 80 80 0 0 1 70 30" fill="none" stroke="#f6465d" strokeWidth="8" opacity="0.85" />
            {/* Neutral arc (yellow) */}
            <path d="M 70 30 A 80 80 0 0 1 130 30" fill="none" stroke="#fcd535" strokeWidth="8" opacity="0.85" />
            {/* Bull arc (green) */}
            <path d="M 130 30 A 80 80 0 0 1 180 100" fill="none" stroke="#0ecb81" strokeWidth="8" opacity="0.85" />
            {/* Needle */}
            <g transform={`translate(100,100) rotate(${angle})`}>
              <line x1="0" y1="0" x2="0" y2="-72" stroke={toneColor} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="0" cy="0" r="5" fill={toneColor} />
              <circle cx="0" cy="0" r="2" fill="#0b0e11" />
            </g>
            {/* Tick labels */}
            <text x="20" y="108" fill="#5e6673" fontSize="8" fontFamily="monospace">-100</text>
            <text x="92" y="22" fill="#5e6673" fontSize="8" fontFamily="monospace">0</text>
            <text x="168" y="108" fill="#5e6673" fontSize="8" fontFamily="monospace">+100</text>
          </svg>
        </div>
        <div className="text-center mb-3">
          <div className="text-2xl font-bold font-mono" style={{ color: toneColor }}>
            {score > 0 ? '+' : ''}{score}
          </div>
          <div className="text-[10px] font-mono font-bold tracking-widest" style={{ color: toneColor }}>
            {text}
          </div>
        </div>
        {/* Vote breakdown */}
        <div className="grid grid-cols-3 gap-1 text-center text-[9px] font-mono mb-3">
          <div className="bg-[#0ecb81]/10 rounded py-1">
            <div className="text-[#0ecb81] font-bold">{bulls}</div>
            <div className="text-[#5e6673]">BULL</div>
          </div>
          <div className="bg-[#fcd535]/10 rounded py-1">
            <div className="text-[#fcd535] font-bold">{neutrals}</div>
            <div className="text-[#5e6673]">NEU</div>
          </div>
          <div className="bg-[#f6465d]/10 rounded py-1">
            <div className="text-[#f6465d] font-bold">{bears}</div>
            <div className="text-[#5e6673]">BEAR</div>
          </div>
        </div>
        {/* Per-indicator votes */}
        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
          {votes.map(v => (
            <div key={v.id} className="flex items-center gap-1.5 text-[9px] font-mono">
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  v.vote === 1 ? 'bg-[#0ecb81]' : v.vote === -1 ? 'bg-[#f6465d]' : 'bg-[#fcd535]'
                }`}
              />
              <span className="text-[#eaecef] shrink-0 w-16 truncate">{v.label}</span>
              <span className="text-[#5e6673] truncate flex-1">{v.reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndicatorStrengthMeter;
