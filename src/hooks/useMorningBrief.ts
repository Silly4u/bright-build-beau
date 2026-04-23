import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MorningBriefScenario {
  title: string;
  condition: string;
  entry: string;
  target: string;
  stop: string;
  probability: number;
}

export interface MorningBrief {
  id: string;
  brief_date: string;
  recap: string;
  outlook: string;
  scenarios: MorningBriefScenario[];
  created_at: string;
}

export function useMorningBrief() {
  const [brief, setBrief] = useState<MorningBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToday = useCallback(async () => {
    setLoading(true);
    setError(null);
    const today = new Date().toISOString().slice(0, 10);
    const { data, error: dbError } = await supabase
      .from('morning_briefs')
      .select('*')
      .eq('brief_date', today)
      .maybeSingle();
    if (dbError) {
      setError(dbError.message);
    } else if (data) {
      setBrief({
        ...data,
        scenarios: (data.scenarios as unknown as MorningBriefScenario[]) || [],
      });
    } else {
      setBrief(null);
    }
    setLoading(false);
  }, []);

  const generate = useCallback(async () => {
    setGenerating(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-morning-brief');
      if (fnError) throw fnError;
      if (data?.error) {
        if (data.error === 'rate_limited') setError('AI đang quá tải, thử lại sau 1 phút');
        else if (data.error === 'credit_required') setError('Hết credit AI — admin cần nạp thêm');
        else setError(data.error);
      } else if (data?.brief) {
        setBrief({
          ...data.brief,
          scenarios: data.brief.scenarios || [],
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lỗi không xác định');
    } finally {
      setGenerating(false);
    }
  }, []);

  useEffect(() => {
    fetchToday();
  }, [fetchToday]);

  return { brief, loading, generating, error, generate, refetch: fetchToday };
}
