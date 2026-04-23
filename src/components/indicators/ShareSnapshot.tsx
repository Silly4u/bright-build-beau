import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  pair: string;
  timeframe: string;
  enabledIndicators: string[];
}

export function buildShareUrl(pair: string, timeframe: string, enabledIndicators: string[]): string {
  const params = new URLSearchParams();
  params.set('pair', pair);
  params.set('tf', timeframe);
  if (enabledIndicators.length > 0) params.set('ind', enabledIndicators.join(','));
  return `${window.location.origin}/indicators?${params.toString()}`;
}

const ShareSnapshot: React.FC<Props> = ({ pair, timeframe, enabledIndicators }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = buildShareUrl(pair, timeframe, enabledIndicators);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: '🔗 Đã copy link', description: 'Dán & chia sẻ với đồng nghiệp' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Không copy được', description: url, variant: 'destructive' });
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-2.5 py-1.5 rounded font-mono font-bold transition-all text-[11px] bg-[#1e2329] border border-[#2b3139] text-[#848e9c] hover:text-[#fcd535] hover:border-[#fcd535]/30 flex items-center gap-1.5"
      title="Copy link snapshot"
    >
      {copied ? '✓ Copied' : '🔗 Share'}
    </button>
  );
};

export default ShareSnapshot;
