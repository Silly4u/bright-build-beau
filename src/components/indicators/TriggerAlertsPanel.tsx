import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIndicatorPermissions } from '@/hooks/useIndicatorPermissions';
import type { TriggerType } from '@/hooks/useIndicatorTriggers';

const TRIGGERS: { id: TriggerType; label: string; desc: string }[] = [
  { id: 'pro_ema_cross', label: 'Pro EMA Cross', desc: 'EMA20/50 giao cắt' },
  { id: 'wyckoff_spring', label: 'Wyckoff Spring', desc: 'Spring/Upthrust xuất hiện' },
  { id: 'alpha_lh_grab', label: 'Alpha LH Grab', desc: 'Liquidity grab' },
  { id: 'alpha_event_signal', label: 'Alpha Event', desc: 'Tín hiệu Buy/Sell mới' },
];

interface Props {
  watched: TriggerType[];
  onChange: (next: TriggerType[]) => void;
}

const TriggerAlertsPanel: React.FC<Props> = ({ watched, onChange }) => {
  const { user } = useAuth();
  const { hasAccess, loading } = useIndicatorPermissions();
  const isPremium = hasAccess('trigger_alerts');
  const [permState, setPermState] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default',
  );

  const toggle = (t: TriggerType) => {
    onChange(watched.includes(t) ? watched.filter(x => x !== t) : [...watched, t]);
  };

  const requestPerm = async () => {
    if (typeof Notification === 'undefined') return;
    const p = await Notification.requestPermission();
    setPermState(p);
  };

  if (!user) {
    return (
      <div className="border border-[#2b3139] rounded-lg overflow-hidden">
        <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest">
          🔔 ALERT
          <span className="ml-2 text-[#fcd535]">PREMIUM</span>
        </div>
        <div className="bg-[#161a1e] p-3 text-[10px] font-mono text-[#5e6673] text-center space-y-2">
          <p>Nhận thông báo khi indicator trigger (EMA cross, Wyckoff Spring...)</p>
          <Link
            to="/auth"
            className="inline-block px-3 py-1 bg-[#fcd535]/10 border border-[#fcd535]/30 text-[#fcd535] rounded font-bold hover:bg-[#fcd535]/20"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }
  if (loading) return null;
  if (!isPremium) {
    return (
      <div className="border border-[#fcd535]/30 rounded-lg overflow-hidden">
        <div className="bg-[#fcd535]/10 px-2 py-1.5 text-[10px] font-mono font-bold tracking-widest flex items-center justify-between">
          <span className="text-[#fcd535]">🔔 ALERT</span>
          <span className="text-[#fcd535] text-[9px]">PREMIUM</span>
        </div>
        <div className="bg-[#161a1e] p-3 text-[10px] font-mono space-y-2">
          <p className="text-[#eaecef]">Nhận browser notification khi indicator trigger.</p>
          <p className="text-[#5e6673]">Liên hệ admin cấp quyền <code className="text-[#fcd535]">trigger_alerts</code>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#2b3139] rounded-lg overflow-hidden">
      <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest flex items-center justify-between">
        <span>🔔 ALERT ({watched.length})</span>
        {permState !== 'granted' && (
          <button onClick={requestPerm} className="text-[10px] text-[#fcd535] hover:underline">
            Bật notification
          </button>
        )}
      </div>
      <div className="bg-[#161a1e] p-2 space-y-1">
        {permState === 'denied' && (
          <p className="text-[9px] font-mono text-[#f6465d] mb-1">
            Browser đã chặn notification. Hãy cho phép trong cài đặt trang.
          </p>
        )}
        {TRIGGERS.map(t => {
          const on = watched.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => toggle(t.id)}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-colors ${
                on ? 'bg-[#fcd535]/10 border border-[#fcd535]/30' : 'bg-[#0b0e11] border border-[#2b3139] hover:border-[#fcd535]/20'
              }`}
            >
              <div className="text-left">
                <div className={`text-[10px] font-mono font-bold ${on ? 'text-[#fcd535]' : 'text-[#eaecef]'}`}>{t.label}</div>
                <div className="text-[9px] font-mono text-[#5e6673]">{t.desc}</div>
              </div>
              <span
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] ${
                  on ? 'border-[#fcd535] bg-[#fcd535]/20 text-[#fcd535]' : 'border-[#2b3139]'
                }`}
              >
                {on ? '✓' : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TriggerAlertsPanel;
