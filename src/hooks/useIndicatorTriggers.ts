import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Candle } from '@/hooks/useMarketData';

export type TriggerType = 'pro_ema_cross' | 'wyckoff_spring' | 'alpha_lh_grab' | 'alpha_event_signal';

interface Args {
  enabled: boolean;
  pair: string;
  timeframe: string;
  candles: Candle[];
  proEmaData?: any;
  wyckoffData?: any;
  alphaLHData?: any;
  alphaEventData?: any;
  watchedTriggers: TriggerType[];
  onTrigger?: (trigger: TriggerType, message: string) => void;
}

const TRIGGER_LABELS: Record<TriggerType, string> = {
  pro_ema_cross: 'Pro EMA giao cắt',
  wyckoff_spring: 'Wyckoff Spring',
  alpha_lh_grab: 'Alpha LH Liquidity Grab',
  alpha_event_signal: 'Alpha Event tín hiệu mới',
};

function notify(title: string, body: string) {
  if (typeof Notification === 'undefined') return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon: '/favicon.ico' });
    } catch {
      /* ignore */
    }
  }
}

/**
 * Detect indicator-trigger events on each new closed candle and fire browser
 * notifications + toast. Tracks last fired time per trigger to avoid spamming
 * the same candle.
 */
export function useIndicatorTriggers(args: Args) {
  const { toast } = useToast();
  const lastFiredRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!args.enabled) return;
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => undefined);
    }
  }, [args.enabled]);

  useEffect(() => {
    if (!args.enabled || args.candles.length === 0) return;
    const lastCandle = args.candles[args.candles.length - 1];
    const ctx = `${args.pair}|${args.timeframe}`;

    const fire = (trigger: TriggerType, detail: string) => {
      const key = `${ctx}|${trigger}`;
      if (lastFiredRef.current[key] === lastCandle.time) return;
      lastFiredRef.current[key] = lastCandle.time;
      const title = `🔔 ${args.pair} ${args.timeframe}`;
      const body = `${TRIGGER_LABELS[trigger]} — ${detail}`;
      toast({ title, description: body });
      notify(title, body);
      args.onTrigger?.(trigger, body);
    };

    if (args.watchedTriggers.includes('pro_ema_cross') && args.proEmaData?.crosses?.length > 0) {
      const lastCross = args.proEmaData.crosses[args.proEmaData.crosses.length - 1];
      if (lastCross?.time === lastCandle.time) {
        fire('pro_ema_cross', `${lastCross.type || 'cross'} @ ${lastCandle.close.toFixed(2)}`);
      }
    }

    if (args.watchedTriggers.includes('wyckoff_spring') && args.wyckoffData?.events?.length > 0) {
      const lastEvent = args.wyckoffData.events[args.wyckoffData.events.length - 1];
      if (lastEvent?.time === lastCandle.time && /spring|upthrust/i.test(lastEvent?.label || '')) {
        fire('wyckoff_spring', `${lastEvent.label} @ ${lastCandle.close.toFixed(2)}`);
      }
    }

    if (args.watchedTriggers.includes('alpha_lh_grab') && args.alphaLHData?.markers?.length > 0) {
      const recent = args.alphaLHData.markers[args.alphaLHData.markers.length - 1];
      if (recent?.time === lastCandle.time && /grab|liquidity/i.test(recent?.text || '')) {
        fire('alpha_lh_grab', `${recent.text} @ ${lastCandle.close.toFixed(2)}`);
      }
    }

    if (args.watchedTriggers.includes('alpha_event_signal') && args.alphaEventData?.markers?.length > 0) {
      const recent = args.alphaEventData.markers[args.alphaEventData.markers.length - 1];
      if (recent?.time === lastCandle.time && /Buy|Sell/.test(recent?.text || '')) {
        fire('alpha_event_signal', `${recent.text} @ ${lastCandle.close.toFixed(2)}`);
      }
    }
  }, [args, toast]);
}
