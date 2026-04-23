import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { INDICATOR_META } from '@/lib/indicatorMeta';

interface Props {
  indicatorId: string;
}

const STRENGTH_LABEL: Record<string, { text: string; color: string }> = {
  beginner: { text: 'Cơ bản', color: 'text-[#0ecb81]' },
  intermediate: { text: 'Trung cấp', color: 'text-[#fcd535]' },
  advanced: { text: 'Nâng cao', color: 'text-[#f6465d]' },
};

const IndicatorTooltip: React.FC<Props> = ({ indicatorId }) => {
  const meta = INDICATOR_META[indicatorId];
  if (!meta) return null;
  const strength = STRENGTH_LABEL[meta.strength];

  return (
    <HoverCard openDelay={150} closeDelay={50}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="text-[#5e6673] hover:text-[#fcd535] text-[10px] leading-none transition-colors"
          aria-label="Giải thích chỉ báo"
        >
          ⓘ
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        className="w-72 bg-[#1e2329] border-[#2b3139] text-[#eaecef] p-3"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="text-[11px] font-bold font-mono text-[#fcd535] leading-tight">{meta.title}</h4>
          <span className={`text-[8px] font-mono shrink-0 ${strength.color}`}>{strength.text}</span>
        </div>
        <div className="space-y-2 text-[10px] font-mono">
          <div>
            <div className="text-[#5e6673] mb-0.5">📖 Là gì?</div>
            <div className="text-[#eaecef] leading-relaxed">{meta.what}</div>
          </div>
          <div>
            <div className="text-[#5e6673] mb-0.5">🎯 Khi nào dùng?</div>
            <div className="text-[#eaecef] leading-relaxed">{meta.when}</div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#2b3139]">
            <span className="text-[#5e6673]">Khung thời gian tối ưu</span>
            <span className="text-[#0ecb81] font-bold">{meta.bestTF}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default IndicatorTooltip;
