import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EconomicEvent {
  id: string;
  event_time: string;
  country: string;
  flag: string;
  event_name: string;
  impact: string;
  actual: string | null;
  estimate: string | null;
  prev: string | null;
}

export function useEconomicEvents() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('economic_events')
        .select('*')
        .order('event_time', { ascending: true });

      if (!error && data) {
        setEvents(data as EconomicEvent[]);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return { events, loading };
}
