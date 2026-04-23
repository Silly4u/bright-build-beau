import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface IndicatorPreset {
  id: string;
  name: string;
  pair: string;
  timeframe: string;
  enabled_indicators: string[];
  is_default: boolean;
  created_at: string;
}

export function useIndicatorPresets() {
  const { user } = useAuth();
  const [presets, setPresets] = useState<IndicatorPreset[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setPresets([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('indicator_presets')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setPresets(data as IndicatorPreset[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const savePreset = useCallback(
    async (name: string, pair: string, timeframe: string, enabledIndicators: string[]) => {
      if (!user) return { error: new Error('Cần đăng nhập') };
      const { error } = await supabase.from('indicator_presets').insert({
        user_id: user.id,
        name,
        pair,
        timeframe,
        enabled_indicators: enabledIndicators,
      });
      if (!error) await refresh();
      return { error };
    },
    [user, refresh],
  );

  const deletePreset = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('indicator_presets').delete().eq('id', id);
      if (!error) await refresh();
      return { error };
    },
    [refresh],
  );

  return { presets, loading, savePreset, deletePreset, refresh };
}
