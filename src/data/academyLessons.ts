import academyHero from '@/assets/academy-hero.jpg';
import bullishCont from '@/assets/academy-bullish-continuation.jpg';
import bearishCont from '@/assets/academy-bearish-continuation.jpg';

export interface LessonSection {
  heading: string;
  body: string;
  bullets?: string[];
  example?: string;
  pitfall?: string;
  image?: string;
}

export interface LessonFAQ {
  question: string;
  answer: string;
}

export interface Lesson {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  duration: string;
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  cover: string;
  intro: string;
  history?: string;
  sections: LessonSection[];
  takeaways: string[];
  checklist?: string[];
  faqs?: LessonFAQ[];
}

export const ACADEMY_HERO = academyHero;

export const LESSONS: Lesson[] = [
  {
    slug: 'mau-nen-tiep-dien',
    category: 'Price Action',
    title: '34 Mẫu Nến Tiếp Diễn Bạn Phải Thuộc',
    excerpt:
      'Bộ sưu tập đầy đủ các mẫu nến tiếp diễn xu hướng — từ Rising/Falling Three Methods, Tasuki Gap đến Three Line Strike, kèm cách giao dịch thực chiến.',
    duration: '25 phút',
    level: 'Trung cấp',
    cover: bullishCont,
    intro:
      'Mẫu nến tiếp diễn (continuation pattern) là tín hiệu cho biết xu hướng hiện tại có khả năng cao tiếp tục sau giai đoạn nghỉ ngắn. Khác với mẫu đảo chiều, các mẫu này xuất hiện GIỮA xu hướng và là cơ hội vào lệnh thuận xu hướng với rủi ro thấp. Bài học tổng hợp 34 mẫu nến tiếp diễn quan trọng nhất, chia theo nhóm để bạn dễ ghi nhớ và áp dụng.',
    sections: [
      {
        heading: '1. Rising Three Methods (Tăng Ba Bước)',
        body: 'Một nến tăng dài, theo sau là 3 nến giảm nhỏ nằm gọn trong thân nến đầu tiên, kết thúc bằng một nến tăng mạnh phá đỉnh nến đầu. Đây là tín hiệu tiếp tục xu hướng tăng cực mạnh.',
        bullets: [
          'Vào lệnh BUY khi nến số 5 đóng cửa trên đỉnh nến số 1',
          'Stop-loss đặt dưới đáy thấp nhất của 3 nến giảm',
          'Take-profit theo độ dài nến số 1 nhân 1.5–2',
        ],
      },
      {
        heading: '2. Falling Three Methods (Giảm Ba Bước)',
        body: 'Phiên bản đảo ngược: nến giảm dài, 3 nến tăng nhỏ trong thân, rồi nến giảm mạnh phá đáy. Tiếp diễn xu hướng giảm.',
        bullets: [
          'SELL khi nến số 5 đóng dưới đáy nến số 1',
          'Stop-loss trên đỉnh cao nhất của 3 nến tăng',
        ],
      },
      {
        heading: '3. Upside / Downside Tasuki Gap',
        body: 'Mẫu 3 nến có khoảng trống (gap) cùng chiều xu hướng. Nến thứ 3 ngược chiều nhưng KHÔNG lấp đầy gap — báo hiệu xu hướng còn nguyên động lực.',
      },
      {
        heading: '4. Bullish / Bearish Three Line Strike',
        body: '3 nến cùng chiều xu hướng nối tiếp, sau đó 1 nến ngược chiều "nhấn chìm" cả 3 nến trước. Nghịch lý: đây vẫn là tín hiệu TIẾP DIỄN, vì nến ngược chiều chỉ là cú rũ bỏ trước khi đi tiếp.',
      },
      {
        heading: '5. Mat Hold Pattern',
        body: 'Tương tự Rising Three nhưng nến thứ 2 mở cửa với gap tăng — cho thấy lực mua mạnh hơn nhiều. Độ tin cậy cao hơn Rising Three Methods.',
      },
      {
        heading: '6. Separating Lines',
        body: 'Hai nến cùng giá mở cửa nhưng ngược chiều. Nến thứ 2 cùng chiều xu hướng → tiếp diễn. Thường xuất hiện sau nhịp pullback nhẹ.',
      },
      {
        heading: '7. Side-by-Side White Lines (trong xu hướng tăng)',
        body: 'Hai nến tăng có cùng giá mở cửa và độ dài tương đương, xuất hiện sau gap tăng. Thị trường nghỉ chân ngang trước khi tiếp tục bứt phá.',
      },
      {
        heading: '8. On-Neck / In-Neck / Thrusting Pattern (trong xu hướng giảm)',
        body: 'Nhóm 3 mẫu nến có nến tăng nhỏ không thể lấy lại được vùng giảm trước đó → người mua yếu, xu hướng giảm tiếp diễn.',
      },
    ],
    takeaways: [
      'Mẫu tiếp diễn = cơ hội vào lệnh THUẬN xu hướng — luôn an toàn hơn bắt đảo chiều',
      'Luôn xác nhận với volume: nến phá vỡ phải có volume tăng',
      'Kết hợp với EMA 50/200 để lọc tín hiệu giả',
      'Đặt SL kỷ luật, không bao giờ "hy vọng" — mẫu nến cũng có thể fail',
    ],
  },
  {
    slug: 'mau-nen-dao-chieu',
    category: 'Price Action',
    title: 'Mẫu Nến Đảo Chiều Quan Trọng Nhất',
    excerpt:
      'Hammer, Shooting Star, Engulfing, Morning/Evening Star — những mẫu nến giúp bạn bắt đỉnh đáy chính xác.',
    duration: '20 phút',
    level: 'Cơ bản',
    cover: bearishCont,
    intro:
      'Mẫu nến đảo chiều xuất hiện ở cuối xu hướng và báo hiệu khả năng đảo chiều. Đây là công cụ cốt lõi của Price Action mà mọi trader cần thuộc lòng.',
    sections: [
      {
        heading: 'Hammer & Hanging Man',
        body: 'Nến có thân nhỏ, bóng dưới dài gấp 2-3 lần thân. Hammer ở đáy = đảo chiều tăng. Hanging Man ở đỉnh = đảo chiều giảm.',
      },
      {
        heading: 'Shooting Star & Inverted Hammer',
        body: 'Bóng trên dài, thân nhỏ. Shooting Star ở đỉnh báo hiệu lực bán mạnh. Inverted Hammer ở đáy báo hiệu áp lực mua đang quay lại.',
      },
      {
        heading: 'Bullish & Bearish Engulfing',
        body: 'Nến thứ 2 nhấn chìm hoàn toàn nến thứ 1 và ngược chiều. Mẫu đảo chiều mạnh nhất, đặc biệt khi xuất hiện ở vùng hỗ trợ/kháng cự quan trọng.',
      },
      {
        heading: 'Morning Star & Evening Star',
        body: '3 nến: nến lớn cùng xu hướng → nến doji nhỏ → nến lớn ngược chiều. Báo hiệu chuyển giao quyền lực giữa bên mua và bên bán.',
      },
      {
        heading: 'Doji & Spinning Top',
        body: 'Thân rất nhỏ, thể hiện sự lưỡng lự. Khi xuất hiện ở vùng quá mua/quá bán → cảnh báo sớm cho đảo chiều.',
      },
    ],
    takeaways: [
      'Mẫu đảo chiều CHỈ có ý nghĩa khi xuất hiện ở vùng S/R quan trọng',
      'Luôn chờ nến xác nhận sau mẫu đảo chiều rồi mới vào lệnh',
      'Volume tăng đột biến = độ tin cậy cao hơn nhiều lần',
    ],
  },
  {
    slug: 'smc-co-ban',
    category: 'Smart Money Concepts',
    title: 'Smart Money Concepts (SMC) Từ A-Z',
    excerpt:
      'Order Block, Fair Value Gap, Liquidity, BOS, CHOCH — hiểu cách "cá mập" thực sự giao dịch.',
    duration: '35 phút',
    level: 'Nâng cao',
    cover: academyHero,
    intro:
      'Smart Money Concepts (SMC) là phương pháp giao dịch theo dấu chân của tổ chức lớn — những người tạo ra xu hướng. Thay vì đoán theo đám đông, SMC dạy bạn nhận ra nơi smart money đang gom hàng và xả hàng.',
    sections: [
      {
        heading: 'Order Block (OB)',
        body: 'Là vùng giá cuối cùng mà tổ chức đặt lệnh trước khi tạo ra một move mạnh. Khi giá quay lại OB, nó thường phản ứng mạnh — đây là vùng vào lệnh có winrate cao.',
      },
      {
        heading: 'Fair Value Gap (FVG)',
        body: 'Khoảng trống không cân bằng giữa 3 nến — thị trường có xu hướng quay lại "lấp đầy" FVG. Là vùng take-profit hoặc entry pullback rất hiệu quả.',
      },
      {
        heading: 'Liquidity (Thanh khoản)',
        body: 'Là vùng tập trung stop-loss của retail trader (trên đỉnh, dưới đáy). Smart money thường đẩy giá quét những vùng này trước khi đi theo hướng thật.',
      },
      {
        heading: 'BOS (Break of Structure)',
        body: 'Phá vỡ cấu trúc cùng chiều xu hướng → xác nhận xu hướng còn tiếp diễn.',
      },
      {
        heading: 'CHOCH (Change of Character)',
        body: 'Phá vỡ cấu trúc ngược chiều xu hướng → tín hiệu đầu tiên của đảo chiều.',
      },
    ],
    takeaways: [
      'SMC hiệu quả nhất trên timeframe H1, H4, D1',
      'Luôn phân tích từ HTF (D1) xuống LTF (M15) để đồng pha',
      'OB + FVG + Liquidity Sweep = combo entry mạnh nhất',
    ],
  },
  {
    slug: 'wyckoff-method',
    category: 'Phân Tích Cấu Trúc',
    title: 'Phương Pháp Wyckoff — Đọc Vị Tay To',
    excerpt:
      '4 pha thị trường: Tích lũy, Tăng giá, Phân phối, Giảm giá. Spring và Upthrust là tín hiệu vàng.',
    duration: '30 phút',
    level: 'Nâng cao',
    cover: academyHero,
    intro:
      'Richard Wyckoff phát triển phương pháp này từ đầu thế kỷ 20, dựa trên quan sát hành vi của "Composite Man" (đại diện cho dòng tiền lớn). Đến nay vẫn là một trong những framework mạnh nhất để hiểu chu kỳ thị trường.',
    sections: [
      {
        heading: '4 Pha của Chu Kỳ Wyckoff',
        body: 'Accumulation (tích lũy) → Markup (tăng giá) → Distribution (phân phối) → Markdown (giảm giá). Chu kỳ này lặp lại trên mọi tài sản và mọi timeframe.',
      },
      {
        heading: 'Pha Tích Lũy (Accumulation)',
        body: 'Sau downtrend dài, giá đi sideway trong range. Smart money âm thầm gom hàng. Các sự kiện chính: PS (Preliminary Support) → SC (Selling Climax) → AR (Automatic Rally) → ST (Secondary Test) → Spring → SOS (Sign of Strength).',
      },
      {
        heading: 'Spring — Tín hiệu mua mạnh nhất',
        body: 'Giá phá đáy range trong giây lát rồi đóng cửa quay lại trên — quét stop-loss của bear. Đây là điểm vào lệnh BUY có R:R tốt nhất trong toàn bộ chu kỳ Wyckoff.',
      },
      {
        heading: 'Pha Phân Phối (Distribution)',
        body: 'Sau uptrend dài, smart money xả hàng cho retail. UTAD (Upthrust After Distribution) là tín hiệu SELL mạnh nhất.',
      },
    ],
    takeaways: [
      'Wyckoff dạy bạn THỜI ĐIỂM (when), không chỉ HƯỚNG (where)',
      'Spring/UTAD là 2 entry có winrate cao nhất',
      'Kết hợp Volume Spread Analysis (VSA) để xác nhận pha',
    ],
  },
  {
    slug: 'risk-management',
    category: 'Quản Lý Vốn',
    title: 'Quản Lý Vốn — Yếu Tố Sống Còn',
    excerpt:
      'Position sizing, R:R ratio, drawdown control. 90% trader thua không phải vì sai chiến lược mà vì sai quản lý vốn.',
    duration: '15 phút',
    level: 'Cơ bản',
    cover: bearishCont,
    intro:
      'Bạn có thể đúng 70% tín hiệu nhưng vẫn cháy tài khoản nếu quản lý vốn sai. Bài học này là nền tảng bắt buộc cho mọi trader.',
    sections: [
      {
        heading: 'Quy tắc 1-2% mỗi lệnh',
        body: 'Không bao giờ đặt rủi ro quá 2% tài khoản cho 1 lệnh. Với 1%, bạn cần thua 100 lệnh liên tiếp mới cháy — điều gần như không thể.',
      },
      {
        heading: 'Risk : Reward tối thiểu 1:2',
        body: 'Nếu winrate 50% với R:R 1:2, bạn vẫn lời. Đừng vào lệnh nếu TP không gấp ít nhất 2 lần SL.',
      },
      {
        heading: 'Position Sizing đúng',
        body: 'Khối lượng lệnh = (Vốn × %Risk) ÷ Khoảng cách SL (pip/giá). Luôn tính TRƯỚC khi vào lệnh.',
      },
      {
        heading: 'Drawdown Control',
        body: 'Khi tài khoản drawdown 10%, giảm size xuống 50%. Khi drawdown 20%, dừng giao dịch và review chiến lược.',
      },
    ],
    takeaways: [
      'Bảo toàn vốn quan trọng hơn kiếm lợi nhuận',
      'Không bao giờ thay đổi SL theo cảm xúc',
      'Tâm lý ổn định = quản lý vốn tốt = giàu bền vững',
    ],
  },
];

export const CATEGORIES = Array.from(new Set(LESSONS.map(l => l.category)));
