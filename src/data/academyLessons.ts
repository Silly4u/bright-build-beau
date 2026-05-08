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
  {
    slug: 'fibonacci-trading',
    category: 'Phân Tích Kỹ Thuật',
    title: 'Fibonacci Retracement & Extension Toàn Tập',
    excerpt:
      'Tỷ lệ vàng 0.618, vùng "golden pocket" 0.5–0.618, extension 1.272/1.618 — công cụ định lượng pullback và mục tiêu giá chính xác.',
    duration: '22 phút',
    level: 'Trung cấp',
    cover: bullishCont,
    intro:
      'Fibonacci không phải "ma thuật". Nó là công cụ thống kê mô tả tỷ lệ pullback và mở rộng mà thị trường lặp lại do hành vi đám đông và thuật toán đặt lệnh tại các mức tâm lý. Bài này dạy bạn vẽ Fibonacci đúng cách, kết hợp confluence và tránh các bẫy phổ biến.',
    history:
      'Leonardo Fibonacci (1170–1250) giới thiệu dãy số Fibonacci tới châu Âu trong cuốn Liber Abaci (1202). Tỷ lệ vàng φ ≈ 1.618 xuất hiện trong tự nhiên (vỏ ốc, hoa hướng dương). Ralph Nelson Elliott và sau đó Robert Prechter ứng dụng vào thị trường tài chính từ thập niên 1930. Ngày nay Fibonacci là công cụ chuẩn trong mọi nền tảng biểu đồ.',
    sections: [
      {
        heading: '1. Các mức Fibonacci Retracement quan trọng',
        body: 'Sau một sóng đẩy (impulse), giá thường pullback về một trong các mức: 0.236, 0.382, 0.5, 0.618, 0.786. Vùng 0.5–0.618 được gọi là "golden pocket" — nơi smart money thường gom hàng.',
        bullets: [
          '0.382 — pullback nông, xu hướng cực mạnh',
          '0.5 — không phải Fibonacci thật nhưng là mức tâm lý 50%',
          '0.618 — tỷ lệ vàng, retracement chuẩn nhất',
          '0.786 — pullback sâu, ranh giới giữa pullback và đảo chiều',
        ],
        example:
          'BTC tháng 10/2023: sóng tăng từ 26.000 → 35.000. Pullback về 31.500 (≈ 0.382) → bật mạnh tiếp tục lên 44.000. Vào BUY tại 0.382 với SL dưới 0.618 đạt R:R 1:5.',
        pitfall:
          'Vẽ Fib từ đáy/đỉnh sai (chọn nến râu thay vì giá đóng cửa) khiến mọi mức lệch. Quy tắc: dùng giá đóng cửa của swing high/low rõ ràng nhất.',
      },
      {
        heading: '2. Fibonacci Extension — Đặt mục tiêu giá',
        body: 'Sau khi pullback hoàn tất, dùng Extension để tính TP: 1.272, 1.414, 1.618, 2.618. Mức 1.618 là TP "vàng" cho hầu hết chiến lược swing.',
        bullets: [
          'TP1: 1.272 — chốt 50% vị thế',
          'TP2: 1.618 — chốt 30% vị thế',
          'TP3: 2.618 — runner cho xu hướng mạnh',
        ],
      },
      {
        heading: '3. Confluence — Chìa khóa winrate cao',
        body: 'Fibonacci ĐƠN LẺ không đủ tin cậy. Luôn kết hợp với: vùng S/R ngang, EMA 50/200, mẫu nến đảo chiều, OB/FVG (SMC). Khi 3+ tín hiệu chồng lên cùng vùng giá → entry winrate trên 70%.',
        example:
          'ETH 2024-Q1: Fib 0.618 trùng với EMA 200 H4 và Order Block bullish. Khi giá chạm vùng này xuất hiện Bullish Engulfing → entry hoàn hảo, R:R 1:4.',
      },
    ],
    takeaways: [
      'Vùng 0.5–0.618 (golden pocket) là entry tốt nhất trong xu hướng',
      'TP chuẩn theo Extension 1.618; SL dưới 0.786',
      'Fibonacci chỉ mạnh khi có CONFLUENCE với S/R, EMA, mẫu nến',
      'Vẽ Fib bằng giá đóng cửa, không bằng râu nến',
    ],
    checklist: [
      'Đã xác định swing high/low rõ ràng?',
      'Vùng Fib có trùng EMA 50/200 hoặc S/R quan trọng?',
      'Có mẫu nến xác nhận tại vùng Fib?',
      'Volume tại vùng pullback giảm dần (cạn lực bán)?',
      'R:R tới Fib Extension 1.618 ≥ 1:2?',
    ],
    faqs: [
      {
        question: 'Tại sao Fibonacci hoạt động trên thị trường?',
        answer:
          'Vì hàng triệu trader và bot cùng đặt lệnh tại các mức Fib quen thuộc → tạo phản ứng giá tự thực hiện (self-fulfilling prophecy). Đây là tâm lý đám đông được lượng hóa.',
      },
      {
        question: 'Nên dùng Fib trên timeframe nào?',
        answer:
          'H4 và D1 cho swing trade — đáng tin nhất. M15–H1 cho intraday nhưng nhiều nhiễu hơn. M1–M5 thường KHÔNG hiệu quả vì noise quá lớn.',
      },
      {
        question: 'Mức 0.5 có phải Fibonacci không?',
        answer:
          'Không. 0.5 không thuộc dãy Fibonacci nhưng được thêm vào do giá trị tâm lý "phân nửa". Thực tế nó là một trong những mức phản ứng mạnh nhất.',
      },
    ],
  },
  {
    slug: 'elliott-wave',
    category: 'Phân Tích Cấu Trúc',
    title: 'Sóng Elliott — Đếm Sóng Như Pro',
    excerpt:
      '5 sóng đẩy + 3 sóng điều chỉnh. Quy tắc bất di bất dịch, các mẫu sóng phổ biến và cách áp dụng vào giao dịch thực chiến.',
    duration: '40 phút',
    level: 'Nâng cao',
    cover: bearishCont,
    intro:
      'Lý thuyết Sóng Elliott cho rằng thị trường di chuyển theo các mẫu sóng lặp lại do tâm lý đám đông. Mặc dù bị chỉ trích về tính chủ quan, đây vẫn là framework mạnh để hiểu cấu trúc thị trường ở mọi timeframe.',
    history:
      'Ralph Nelson Elliott (1871–1948), một kế toán viên người Mỹ, phát hiện ra mẫu sóng khi nghiên cứu 75 năm dữ liệu chứng khoán. Ông xuất bản "The Wave Principle" năm 1938. Robert Prechter phổ biến lý thuyết vào thập niên 1980, dự đoán chính xác bull market 1982-2000.',
    sections: [
      {
        heading: '1. Cấu trúc cơ bản: 5 sóng đẩy + 3 sóng điều chỉnh',
        body: 'Mỗi chu kỳ Elliott gồm 8 sóng: 5 sóng đẩy (1-2-3-4-5) cùng chiều xu hướng, theo sau 3 sóng điều chỉnh (A-B-C) ngược chiều. Mẫu này lặp lại trên mọi timeframe (fractal).',
        bullets: [
          'Sóng 1: Khởi đầu, ít người tin',
          'Sóng 2: Pullback, không bao giờ vượt đáy sóng 1',
          'Sóng 3: DÀI NHẤT và mạnh nhất',
          'Sóng 4: Điều chỉnh, không chồng lên sóng 1',
          'Sóng 5: Hoàn tất xu hướng, thường yếu hơn sóng 3',
          'A-B-C: Điều chỉnh ngược chiều xu hướng chính',
        ],
      },
      {
        heading: '2. 3 quy tắc BẤT DI BẤT DỊCH',
        body: 'Vi phạm 1 trong 3 = đếm sóng SAI, phải đếm lại.',
        bullets: [
          'Sóng 2 KHÔNG BAO GIỜ retrace quá 100% sóng 1',
          'Sóng 3 KHÔNG BAO GIỜ là sóng ngắn nhất trong 1, 3, 5',
          'Sóng 4 KHÔNG BAO GIỜ chồng lấn vùng giá của sóng 1',
        ],
        pitfall:
          'Người mới hay "ép" đếm sóng theo ý mình. Nếu phải bẻ cong quy tắc để khớp đếm sóng → bạn đang sai. Hãy đếm lại từ swing rõ ràng hơn.',
      },
      {
        heading: '3. Tỷ lệ Fibonacci trong Elliott',
        body: 'Sóng 2 thường retrace 0.5–0.618 sóng 1. Sóng 3 thường = 1.618 × sóng 1. Sóng 4 thường retrace 0.382 sóng 3.',
        example:
          'BTC từ 15.500 (đáy 11/2022) → 25.000 (sóng 1 = 9.500). Sóng 2 về 19.500 (≈ 0.618). Sóng 3 mục tiêu = 19.500 + 9.500 × 1.618 = 34.870 — gần đúng đỉnh 35.000 tháng 7/2023.',
      },
      {
        heading: '4. Các mẫu sóng điều chỉnh',
        body: 'Sóng A-B-C có 3 dạng chính:',
        bullets: [
          'Zigzag (5-3-5): Điều chỉnh sắc, mạnh',
          'Flat (3-3-5): Điều chỉnh ngang',
          'Triangle (3-3-3-3-3): Tam giác hội tụ ở sóng 4 hoặc B',
        ],
      },
      {
        heading: '5. Áp dụng thực chiến',
        body: 'Entry tốt nhất là cuối sóng 2 (vào theo sóng 3 — sóng dài nhất). Tránh trade sóng 4 (choppy). Sóng 5 thường có divergence với RSI/MACD — cảnh báo sắp đảo chiều.',
        example:
          'Đếm sóng trên D1, xác nhận trên H4. Khi sóng 2 hoàn tất tại Fib 0.618 + RSI oversold → entry BUY, TP tại 1.618 × sóng 1.',
      },
    ],
    takeaways: [
      'Elliott là framework, KHÔNG phải tín hiệu — luôn cần xác nhận',
      'Entry an toàn nhất: cuối sóng 2, vào theo sóng 3',
      'Sóng 5 + divergence = chuẩn bị reversal',
      'Đếm sóng từ HTF (D1, W1) xuống LTF — không bao giờ ngược lại',
    ],
    checklist: [
      'Đã xác định degree (cấp sóng) đang phân tích?',
      'Cách đếm có thỏa cả 3 quy tắc bất di bất dịch?',
      'Tỷ lệ Fibonacci giữa các sóng có hợp lý?',
      'Có alternative count (đếm phương án 2) phòng khi sai?',
      'Volume xác nhận: sóng 3 có volume cao nhất?',
    ],
    faqs: [
      {
        question: 'Elliott Wave có chính xác không?',
        answer:
          'Có và không. Đếm sóng đúng cho dự báo chính xác đáng kinh ngạc, nhưng tính chủ quan cao — 10 trader có thể có 10 cách đếm. Luôn duy trì 2 phương án và sẵn sàng chuyển khi giá vi phạm quy tắc.',
      },
      {
        question: 'Bao lâu thì thành thạo Elliott?',
        answer:
          'Tối thiểu 6–12 tháng thực hành. Đọc "Elliott Wave Principle" của Frost & Prechter và đếm sóng thủ công 100+ biểu đồ trước khi áp dụng vào tiền thật.',
      },
    ],
  },
  {
    slug: 'rsi-macd-indicators',
    category: 'Chỉ Báo Kỹ Thuật',
    title: 'RSI & MACD — Bộ Đôi Chỉ Báo Bất Tử',
    excerpt:
      'RSI quá mua/quá bán, divergence; MACD crossover, histogram. Cách kết hợp 2 chỉ báo này thành hệ thống winrate cao.',
    duration: '20 phút',
    level: 'Cơ bản',
    cover: academyHero,
    intro:
      '90% trader dùng RSI và MACD SAI — coi RSI > 70 là bán, RSI < 30 là mua. Bài này dạy cách dùng đúng: tập trung vào DIVERGENCE và xu hướng động lượng, không phải mức số học.',
    history:
      'RSI được J. Welles Wilder Jr. phát triển năm 1978 trong cuốn "New Concepts in Technical Trading Systems". MACD do Gerald Appel tạo ra cuối thập niên 1970. Cả hai vẫn là tiêu chuẩn vàng sau gần 50 năm.',
    sections: [
      {
        heading: '1. RSI — Đo sức mạnh xu hướng',
        body: 'RSI = 100 - 100/(1 + RS), với RS = trung bình tăng / trung bình giảm trong 14 phiên. Dao động 0–100. Trên 70 = quá mua, dưới 30 = quá bán.',
        pitfall:
          'SAI LẦM PHỔ BIẾN: thấy RSI > 70 liền SELL. Trong xu hướng tăng MẠNH, RSI có thể duy trì trên 70 nhiều tuần. Quy tắc đúng: trong uptrend, dùng vùng 40–80 (không phải 30–70).',
      },
      {
        heading: '2. RSI Divergence — Tín hiệu mạnh nhất',
        body: 'Phân kỳ xảy ra khi giá tạo đỉnh/đáy mới NHƯNG RSI thì không. Đây là cảnh báo sớm cho đảo chiều.',
        bullets: [
          'Bullish Divergence: Giá đáy thấp hơn, RSI đáy cao hơn → đảo chiều TĂNG',
          'Bearish Divergence: Giá đỉnh cao hơn, RSI đỉnh thấp hơn → đảo chiều GIẢM',
          'Hidden Divergence: Tín hiệu tiếp diễn xu hướng',
        ],
        example:
          'BTC 11/2021 đỉnh 69k: giá tạo đỉnh cao hơn 64k, NHƯNG RSI đỉnh 67 (thấp hơn 79 trước đó) → bearish divergence rõ rệt. Sau đó BTC giảm 75% về 15.5k.',
      },
      {
        heading: '3. MACD — Đo động lượng và crossover',
        body: 'MACD = EMA12 – EMA26. Signal Line = EMA9 của MACD. Histogram = MACD – Signal. MACD cắt Signal từ dưới lên = MUA, từ trên xuống = SELL.',
        bullets: [
          'MACD trên 0 → xu hướng tăng đang chiếm ưu thế',
          'MACD dưới 0 → xu hướng giảm',
          'Histogram thu hẹp = động lượng giảm dần (cảnh báo)',
          'Histogram mở rộng = động lượng tăng',
        ],
      },
      {
        heading: '4. Hệ thống RSI + MACD',
        body: 'Chỉ vào lệnh khi 2 chỉ báo cùng tín hiệu. VD entry BUY: RSI thoát vùng oversold + MACD cross bullish trên đường 0. Winrate hệ thống này thường 60–70% trên H4.',
        example:
          'ETH H4 ngày 10/01/2024: RSI từ 28 lên 35 (thoát oversold) + MACD histogram chuyển dương + cross trên signal → BUY tại 2.250, TP 2.500 (R:R 1:2.5).',
      },
    ],
    takeaways: [
      'KHÔNG dùng RSI 70/30 máy móc — phải xét theo xu hướng',
      'Divergence > Crossover về độ tin cậy',
      'MACD histogram = chỉ báo SỚM hơn cross',
      'Kết hợp 2 chỉ báo + price action = hệ thống mạnh',
    ],
    checklist: [
      'Xu hướng chính (D1) là gì? Trade thuận xu hướng?',
      'RSI có divergence với giá không?',
      'MACD đã cross Signal Line chưa?',
      'Histogram đang mở rộng hay thu hẹp?',
      'Có xác nhận bằng mẫu nến tại vùng vào lệnh?',
    ],
    faqs: [
      {
        question: 'Nên đặt RSI bao nhiêu period?',
        answer:
          'Mặc định 14 là chuẩn. Một số trader dùng 9 (nhạy hơn, nhiều tín hiệu giả) hoặc 21 (mượt hơn). Quan trọng là CONSISTENT.',
      },
      {
        question: 'MACD và RSI cái nào quan trọng hơn?',
        answer:
          'Bổ sung cho nhau. RSI tốt cho phát hiện divergence và overbought/oversold. MACD tốt cho xác nhận xu hướng và động lượng. Dùng cả hai luôn tốt hơn một.',
      },
    ],
  },
  {
    slug: 'trading-psychology',
    category: 'Tâm Lý Giao Dịch',
    title: 'Tâm Lý Trader — Trận Chiến Trong Đầu Bạn',
    excerpt:
      'FOMO, Revenge Trading, Loss Aversion, Overconfidence — 4 con quỷ giết chết tài khoản của 95% trader. Cách nhận diện và chế ngự.',
    duration: '18 phút',
    level: 'Cơ bản',
    cover: bullishCont,
    intro:
      'Mark Douglas, tác giả "Trading in the Zone", từng nói: "Trading 80% là tâm lý, 20% là chiến lược". Bạn có thể có chiến lược tốt nhất thế giới nhưng vẫn cháy nếu không kiểm soát được cảm xúc.',
    history:
      'Daniel Kahneman (Nobel Kinh tế 2002) cùng Amos Tversky đặt nền móng cho "Behavioral Economics" — chứng minh con người không ra quyết định lý trí. Áp dụng vào trading: chúng ta sợ thua nhiều hơn vui khi thắng (Loss Aversion ratio ≈ 2:1).',
    sections: [
      {
        heading: '1. FOMO — Fear Of Missing Out',
        body: 'Cảm giác "phải vào lệnh ngay nếu không sẽ mất cơ hội". Đặc biệt nguy hiểm khi giá pump mạnh: bạn vào ở đỉnh, smart money xả hàng cho bạn.',
        pitfall:
          'BTC tháng 11/2021 đạt 69k. Hàng triệu retail FOMO mua đỉnh. Sau 12 tháng BTC về 15.5k — giảm 77%.',
        example:
          'Quy tắc 3-1-3: Khi muốn vào lệnh do FOMO → đợi 3 phút, hít thở 3 lần, hỏi 3 câu (Có khớp setup? R:R đủ? Đã có entry plan?). Nếu trả lời "không" cho bất kỳ câu nào → KHÔNG vào.',
      },
      {
        heading: '2. Revenge Trading — Trả thù thị trường',
        body: 'Sau 1 lệnh thua, bạn cố vào lệnh ngay để "lấy lại". Thường size lớn hơn, bỏ qua quy tắc → vòng xoáy chết chóc.',
        pitfall:
          'Quy tắc cứng: thua 2 lệnh liên tiếp → TẮT máy, đi bộ 30 phút. Thua 3 lệnh trong 1 ngày → nghỉ 24 giờ, không xem biểu đồ.',
      },
      {
        heading: '3. Loss Aversion — Sợ thua thái quá',
        body: 'Bạn dời SL với hy vọng giá sẽ quay lại. Hoặc chốt lời quá sớm vì sợ mất phần lời nhỏ. Kết quả: lệnh thắng nhỏ, lệnh thua to → âm dài hạn.',
        bullets: [
          'KHÔNG BAO GIỜ dời SL ra xa hơn',
          'Đặt SL/TP NGAY khi vào lệnh, sau đó RỜI khỏi máy',
          'Trail SL theo cấu trúc, không theo cảm xúc',
        ],
      },
      {
        heading: '4. Overconfidence — Tự tin thái quá',
        body: 'Sau chuỗi 5–10 lệnh thắng, bạn tin mình là "thiên tài". Tăng size lên 2-3 lần → 1 lệnh thua xoá toàn bộ lợi nhuận tháng.',
        example:
          'Trader X có 8 lệnh thắng với 1% risk → +12%. Tự tin tăng lên 5% risk cho lệnh thứ 9 → thua 5%. Lệnh 10 cũng 5% → thua nốt. Net: +12% – 10% = +2%.',
      },
      {
        heading: '5. Quy tắc vàng để chế ngự cảm xúc',
        body: 'Quy trình 4 bước trước MỌI lệnh:',
        bullets: [
          'Trade Plan: viết ra giấy entry, SL, TP, lý do',
          'Position Size: tính theo % risk cố định (1-2%)',
          'Vào lệnh, đặt SL/TP, KHÔNG nhìn biểu đồ trong 1h',
          'Ghi nhật ký: cảm xúc lúc vào lệnh, kết quả, bài học',
        ],
      },
    ],
    takeaways: [
      'Tâm lý ổn định = lợi nhuận bền vững',
      'Quy tắc cứng > kỷ luật mềm — viết quy tắc và tuân thủ tuyệt đối',
      'Trade journal là vũ khí mạnh nhất chống lại bias cảm xúc',
      'Nghỉ ngơi sau chuỗi thua — thị trường mở cửa mỗi ngày',
    ],
    checklist: [
      'Hôm nay tôi có cảm xúc tốt để trade không?',
      'Đã viết Trade Plan rõ ràng trước khi vào lệnh?',
      'Risk có vượt 2% tài khoản không?',
      'Đã đặt SL/TP cứng chưa?',
      'Tôi có đang revenge trade hay FOMO không?',
    ],
    faqs: [
      {
        question: 'Làm sao biết mình đang trade theo cảm xúc?',
        answer:
          'Dấu hiệu: vào lệnh không có Trade Plan, dời SL, tăng size sau khi thắng/thua, refresh biểu đồ liên tục, kiểm tra P&L mỗi vài phút. Có 2+ dấu hiệu → DỪNG ngay.',
      },
      {
        question: 'Có nên trade khi đang stress hoặc mệt?',
        answer:
          'Tuyệt đối KHÔNG. Stress làm prefrontal cortex (vùng não ra quyết định) suy giảm → ra quyết định cảm tính. Nguyên tắc: ngủ đủ 7h, không trade khi vừa cãi nhau.',
      },
      {
        question: 'Sách tâm lý trading nào nên đọc?',
        answer:
          '"Trading in the Zone" - Mark Douglas (kinh điển), "The Psychology of Trading" - Brett Steenbarger, "Thinking, Fast and Slow" - Daniel Kahneman.',
      },
    ],
  },
  {
    slug: 'ichimoku-cloud',
    category: 'Phân Tích Kỹ Thuật',
    title: 'Ichimoku Kinko Hyo — Hệ Thống Toàn Diện',
    excerpt:
      'Mây Kumo, Tenkan, Kijun, Chikou Span — chỉ báo Nhật Bản 5-trong-1 cho phép xác định xu hướng, S/R, momentum chỉ trong 1 cái nhìn.',
    duration: '25 phút',
    level: 'Trung cấp',
    cover: bearishCont,
    intro:
      'Ichimoku Kinko Hyo (一目均衡表 — "biểu đồ cân bằng trong nháy mắt") là hệ thống tích hợp xu hướng + động lượng + S/R + tín hiệu vào/ra trong 1 chỉ báo duy nhất. Phù hợp với swing trader trên H4–D1.',
    history:
      'Goichi Hosoda — nhà báo Nhật Bản — phát triển Ichimoku trong 30 năm, công bố năm 1969. Phải đến thập niên 1990 mới phổ biến ở phương Tây nhờ Manesh Patel.',
    sections: [
      {
        heading: '1. 5 thành phần của Ichimoku',
        body: 'Ichimoku gồm 5 đường, mỗi đường có vai trò riêng:',
        bullets: [
          'Tenkan-sen (Conversion Line): (High9 + Low9) / 2 — momentum nhanh',
          'Kijun-sen (Base Line): (High26 + Low26) / 2 — momentum chậm, dùng làm SL',
          'Senkou Span A: (Tenkan + Kijun) / 2, dịch tới 26 phiên — viền trên Mây',
          'Senkou Span B: (High52 + Low52) / 2, dịch tới 26 phiên — viền dưới Mây',
          'Chikou Span: Giá đóng cửa hôm nay, dịch lùi 26 phiên — xác nhận xu hướng',
        ],
      },
      {
        heading: '2. Mây Kumo — Trái tim của Ichimoku',
        body: 'Vùng giữa Senkou A và Senkou B = Mây (Kumo). Mây xanh (A > B) = xu hướng tăng. Mây đỏ (A < B) = xu hướng giảm. Mây dày = S/R mạnh, mây mỏng = dễ phá vỡ.',
        example:
          'BTC D1 tháng 1/2024: giá phá lên trên Mây xanh dày (vùng 35–38k là support cực mạnh). Khi pullback về test Mây không thủng → xác nhận uptrend, BUY tại 38k đạt TP 48k.',
      },
      {
        heading: '3. Tín hiệu giao dịch chuẩn Ichimoku',
        body: 'Setup BUY hoàn hảo (TK Cross + 5 điều kiện):',
        bullets: [
          'Tenkan cắt Kijun từ dưới lên (TK Cross bullish)',
          'Cross xảy ra TRÊN Mây',
          'Giá đóng cửa TRÊN Mây',
          'Chikou Span KHÔNG bị cản bởi giá quá khứ',
          'Mây phía trước (kumo future) là MÀU XANH',
        ],
        pitfall:
          'Trade chỉ với TK Cross mà bỏ qua các điều kiện khác → winrate dưới 40%. Đủ 5/5 điều kiện → winrate có thể đạt 70%+.',
      },
      {
        heading: '4. Kijun-sen làm Trailing Stop',
        body: 'Kijun là đường "trung bình động cân bằng" — giá trong xu hướng mạnh hiếm khi đóng cửa dưới Kijun. Dùng Kijun làm trailing stop: khi giá đóng cửa dưới Kijun (BUY) → thoát lệnh.',
      },
      {
        heading: '5. Kumo Twist & Kumo Breakout',
        body: 'Kumo Twist: Senkou A và B đổi chỗ → cảnh báo đảo chiều xu hướng dài hạn. Kumo Breakout: giá phá Mây sau giai đoạn tích lũy → tín hiệu vào lệnh mạnh, R:R cao.',
      },
    ],
    takeaways: [
      'Ichimoku là hệ thống HOÀN CHỈNH — không cần kết hợp nhiều chỉ báo',
      'Luôn kiểm tra ĐỦ 5 điều kiện trước khi vào lệnh',
      'Mây Kumo = vùng S/R quan trọng nhất',
      'Hoạt động tốt nhất trên H4 và D1',
    ],
    checklist: [
      'Giá đang ở phía nào của Mây Kumo?',
      'TK Cross đã xảy ra ở vị trí đúng?',
      'Chikou Span có bị cản không?',
      'Mây tương lai cùng chiều với entry?',
      'Kijun-sen ở vị trí phù hợp làm SL?',
    ],
    faqs: [
      {
        question: 'Ichimoku có dùng được cho scalp không?',
        answer:
          'Không hiệu quả. Các tham số (9, 26, 52) được Hosoda thiết kế cho thị trường Nhật xưa với 6 phiên/tuần. Trên M1–M15 quá nhiều noise. Tốt nhất dùng H4–D1.',
      },
      {
        question: 'Có nên đổi tham số Ichimoku không?',
        answer:
          'KHÔNG NÊN. Bộ 9-26-52 đã được tối ưu hơn 30 năm và toàn thị trường thế giới đang dùng. Đổi tham số = mất tính self-fulfilling. Nếu quá chậm, hãy chuyển sang timeframe nhỏ hơn.',
      },
    ],
  },
];

export const CATEGORIES = Array.from(new Set(LESSONS.map(l => l.category)));
