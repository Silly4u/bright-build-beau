import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIndicatorPresets, IndicatorPreset } from '@/hooks/useIndicatorPresets';
import { useToast } from '@/hooks/use-toast';

interface Props {
  currentPair: string;
  currentTimeframe: string;
  enabledIndicators: string[];
  onLoad: (preset: IndicatorPreset) => void;
}

const LayoutPresets: React.FC<Props> = ({ currentPair, currentTimeframe, enabledIndicators, onLoad }) => {
  const { user } = useAuth();
  const { presets, savePreset, deletePreset } = useIndicatorPresets();
  const { toast } = useToast();
  const [showSave, setShowSave] = useState(false);
  const [name, setName] = useState('');

  const handleSave = async () => {
    if (!name.trim()) return;
    const { error } = await savePreset(name.trim(), currentPair, currentTimeframe, enabledIndicators);
    if (error) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: '✓ Đã lưu preset', description: `"${name}" sẵn sàng dùng lại.` });
      setName('');
      setShowSave(false);
    }
  };

  const handleDelete = async (id: string, presetName: string) => {
    const { error } = await deletePreset(id);
    if (!error) toast({ title: '🗑️ Đã xóa', description: `"${presetName}"` });
  };

  if (!user) {
    return (
      <div className="border border-[#2b3139] rounded-lg overflow-hidden">
        <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest">
          🧩 PRESET
        </div>
        <div className="bg-[#161a1e] p-2.5 text-[10px] font-mono text-[#5e6673] text-center space-y-2">
          <p>Đăng nhập để lưu combo chỉ báo cá nhân</p>
          <Link
            to="/auth"
            className="inline-block px-3 py-1 bg-[#fcd535]/10 border border-[#fcd535]/30 text-[#fcd535] rounded font-bold hover:bg-[#fcd535]/20 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#2b3139] rounded-lg overflow-hidden">
      <div className="bg-[#1e2329] px-2 py-1.5 text-[10px] font-mono font-bold text-muted-foreground tracking-widest flex items-center justify-between">
        <span>🧩 PRESET ({presets.length})</span>
        <button
          onClick={() => setShowSave(s => !s)}
          className="text-[10px] text-[#fcd535] hover:underline"
        >
          {showSave ? 'Hủy' : '+ Lưu'}
        </button>
      </div>
      <div className="bg-[#161a1e] p-2 space-y-1.5">
        {showSave && (
          <div className="flex gap-1 mb-1">
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Tên preset (e.g. Scalp M15)"
              className="flex-1 bg-[#0b0e11] border border-[#2b3139] rounded px-2 py-1 text-[10px] font-mono text-[#eaecef] placeholder:text-[#5e6673]"
            />
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-2 py-1 bg-[#fcd535] text-[#0b0e11] rounded text-[10px] font-bold disabled:opacity-40"
            >
              OK
            </button>
          </div>
        )}
        {presets.length === 0 ? (
          <p className="text-[10px] font-mono text-[#5e6673] text-center py-1">
            Chưa có preset. Bật chỉ báo + Lưu để dùng lại nhanh.
          </p>
        ) : (
          presets.map(p => (
            <div
              key={p.id}
              className="group flex items-center justify-between bg-[#0b0e11] border border-[#2b3139] rounded px-2 py-1.5 hover:border-[#fcd535]/50 transition-colors"
            >
              <button
                onClick={() => onLoad(p)}
                className="flex-1 text-left"
                title={`Tải ${p.pair} ${p.timeframe} với ${p.enabled_indicators.length} chỉ báo`}
              >
                <div className="text-[10px] font-mono font-bold text-[#eaecef] truncate">{p.name}</div>
                <div className="text-[9px] font-mono text-[#5e6673]">
                  {p.pair} • {p.timeframe} • {p.enabled_indicators.length} ind
                </div>
              </button>
              <button
                onClick={() => handleDelete(p.id, p.name)}
                className="opacity-0 group-hover:opacity-100 text-[#f6465d] hover:text-[#f6465d] text-[12px] px-1 transition-opacity"
                title="Xóa"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LayoutPresets;
