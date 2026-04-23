// Educational metadata for each indicator: what it is, when to use, strength.

export interface IndicatorMeta {
  title: string;
  what: string;
  when: string;
  bestTF: string;
  strength: 'beginner' | 'intermediate' | 'advanced';
}

export const INDICATOR_META: Record<string, IndicatorMeta> = {
  matrix: {
    title: 'Matrix NWE (Nadaraya-Watson Envelope)',
    what: 'Vẽ kênh giá động dựa trên hồi quy hạt nhân — phát hiện vùng overbought/oversold mượt hơn Bollinger.',
    when: 'Khi thị trường đi sideway hoặc thoái lui trong xu hướng. Nến chạm biên dưới = mua, biên trên = bán.',
    bestTF: 'H1, H4',
    strength: 'intermediate',
  },
  engine: {
    title: 'MS Engine (Market Structure)',
    what: 'Tự động xác định BOS/CHOCH/Order Block — bộ não cấu trúc thị trường theo SMC.',
    when: 'Tìm điểm vào lệnh sau khi cấu trúc đảo chiều (CHOCH) hoặc tiếp diễn (BOS).',
    bestTF: 'H1, H4, D1',
    strength: 'advanced',
  },
  tp_sl: {
    title: 'TP/SL Zones (Auto Risk)',
    what: 'Tự tính vùng Take-Profit và Stop-Loss dựa trên ATR + cấu trúc gần nhất.',
    when: 'Sau khi đã có tín hiệu vào lệnh, dùng để đặt SL/TP khách quan thay vì cảm tính.',
    bestTF: 'Tất cả',
    strength: 'beginner',
  },
  pro_ema: {
    title: 'Pro EMA Ribbon (20/50/100/200)',
    what: 'Bộ 4 EMA xếp tầng — xác định xu hướng tổng quát từ ngắn đến dài hạn.',
    when: 'Xác nhận xu hướng. Ribbon dãn rộng = trend mạnh, đan xen = chuẩn bị đảo chiều.',
    bestTF: 'H4, D1',
    strength: 'beginner',
  },
  support_resistance: {
    title: 'Pro Support/Resistance + Stoch',
    what: 'Phát hiện vùng S/R quan trọng kèm Stochastic để lọc tín hiệu giả.',
    when: 'Vào lệnh khi giá test S/R + Stoch ở oversold (mua) hoặc overbought (bán).',
    bestTF: 'M15, H1, H4',
    strength: 'intermediate',
  },
  wyckoff: {
    title: 'Wyckoff Method',
    what: 'Phân tích pha thị trường: Tích lũy → Tăng giá → Phân phối → Giảm giá. Đánh dấu Spring/Upthrust.',
    when: 'Bắt đáy/đỉnh dài hạn. Spring trong Accumulation = mua mạnh; Upthrust trong Distribution = bán mạnh.',
    bestTF: 'H4, D1',
    strength: 'advanced',
  },
  alpha_lh: {
    title: 'Alpha LH (Liquidity Hunter)',
    what: 'Phát hiện smart money quét stop-loss để gom hàng — tín hiệu pro về liquidity grab.',
    when: 'Khi giá phá đỉnh/đáy giả rồi quay đầu — đó là điểm vào lệnh ngược lại với đám đông.',
    bestTF: 'M5, M15 (scalping)',
    strength: 'advanced',
  },
  alpha_event: {
    title: 'Alpha Event Signal',
    what: 'Tín hiệu BUY/SELL kèm TP tự động dựa trên giao cắt EMA + xu hướng tổng quát.',
    when: 'Trader bận, không có thời gian phân tích. Theo tín hiệu cơ học, vào/thoát theo TP gợi ý.',
    bestTF: 'H1, H4',
    strength: 'beginner',
  },
  prev_week_fib: {
    title: 'Fibonacci Tuần Trước',
    what: 'Tự kẻ Fibonacci retracement dựa trên High/Low của tuần trước đó.',
    when: 'Mức 0.5 và 0.618 là vùng phản ứng mạnh trong tuần hiện tại - nơi để chờ mua/bán.',
    bestTF: 'H4, D1',
    strength: 'intermediate',
  },
  liq_hunter: {
    title: 'AI SMC Analysis',
    what: 'AI tự động phân tích Smart Money Concepts: Order Block, FVG, Liquidity, BOS/CHOCH.',
    when: 'Cần phân tích nhanh, có entry/TP/SL gợi ý ngay từ AI.',
    bestTF: 'H1, H4',
    strength: 'intermediate',
  },
};
