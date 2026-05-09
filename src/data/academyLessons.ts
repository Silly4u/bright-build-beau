import academyHero from '@/assets/academy-hero.jpg';
import coverContinuation from '@/assets/lesson-continuation-candles.jpg';
import coverReversal from '@/assets/lesson-reversal-candles.jpg';
import coverSmc from '@/assets/lesson-smc.jpg';
import coverWyckoff from '@/assets/lesson-wyckoff.jpg';
import coverRisk from '@/assets/lesson-risk-management.jpg';
import coverFib from '@/assets/lesson-fibonacci.jpg';
import coverElliott from '@/assets/lesson-elliott-wave.jpg';
import coverRsiMacd from '@/assets/lesson-rsi-macd.jpg';
import coverPsychology from '@/assets/lesson-psychology.jpg';
import coverIchimoku from '@/assets/lesson-ichimoku.jpg';
import coverOrderflow from '@/assets/lesson-orderflow.jpg';
import coverVolumeProfile from '@/assets/lesson-volume-profile.jpg';
import coverIct from '@/assets/lesson-ict-liquidity.jpg';
import coverGex from '@/assets/lesson-gamma-exposure.jpg';
import coverRiskPro from '@/assets/lesson-risk-pro.jpg';

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
      'Bộ sưu tập đầy đủ các mẫu nến tiếp diễn xu hướng — từ Rising/Falling Three Methods, Tasuki Gap đến Three Line Strike, kèm cách giao dịch thực chiến, win-rate thống kê và checklist xác nhận.',
    duration: '40 phút',
    level: 'Trung cấp',
    cover: coverContinuation,
    intro:
      'Mẫu nến tiếp diễn (continuation pattern) là tín hiệu cho biết xu hướng hiện tại có khả năng cao tiếp tục sau giai đoạn nghỉ ngắn. Khác với mẫu đảo chiều, các mẫu này xuất hiện GIỮA xu hướng và là cơ hội vào lệnh thuận xu hướng với rủi ro thấp — đặc biệt phù hợp với chiến lược "buy the dip / sell the rally". Bài học tổng hợp 34 mẫu nến tiếp diễn quan trọng nhất, chia theo 6 nhóm để bạn dễ ghi nhớ và áp dụng.',
    history:
      'Mẫu nến Nhật Bản được Munehisa Homma — thương nhân gạo Sakata thế kỷ 18 — phát triển khi quan sát thị trường gạo Dojima. Năm 1991, Steve Nison giới thiệu kỹ thuật này tới phương Tây qua cuốn "Japanese Candlestick Charting Techniques", và Thomas Bulkowski sau đó kiểm chứng tỷ lệ thành công của 100+ mẫu nến trên 38.500 chart, công bố trong "Encyclopedia of Candlestick Charts" (2008) — nguồn dữ liệu thống kê được trích dẫn trong bài này.',
    sections: [
      {
        heading: '1. Rising Three Methods (Tăng Ba Bước)',
        body: 'Một nến tăng dài, theo sau là 3 nến giảm nhỏ nằm gọn trong thân nến đầu tiên, kết thúc bằng một nến tăng mạnh phá đỉnh nến đầu. Đây là tín hiệu tiếp tục xu hướng tăng cực mạnh — Bulkowski thống kê win-rate 72% trên timeframe Daily.',
        bullets: [
          'Vào lệnh BUY khi nến số 5 đóng cửa trên đỉnh nến số 1',
          'Stop-loss đặt dưới đáy thấp nhất của 3 nến giảm (vùng "phòng tuyến" của bên mua)',
          'Take-profit theo độ dài nến số 1 nhân 1.5–2 (measured move)',
          'Volume nến số 5 phải lớn hơn TB 3 nến giảm để xác nhận lực mua quay lại',
        ],
        example:
          'BTC/USDT D1, 14/03/2024: nến tăng dài từ 65.500 → 71.200, sau đó 3 nến giảm về 68.800 (vẫn nằm trong thân nến đầu), nến thứ 5 đóng tại 73.500 phá đỉnh — entry cho mục tiêu 78.500 (đạt sau 4 phiên).',
        pitfall:
          'Nếu 1 trong 3 nến giảm có thân vượt khỏi đáy nến đầu → mẫu vô hiệu. Đừng cố ép pattern khi không đúng.',
      },
      {
        heading: '2. Falling Three Methods (Giảm Ba Bước)',
        body: 'Phiên bản đảo ngược: nến giảm dài, 3 nến tăng nhỏ trong thân, rồi nến giảm mạnh phá đáy. Tiếp diễn xu hướng giảm — win-rate ~68%.',
        bullets: [
          'SELL khi nến số 5 đóng dưới đáy nến số 1',
          'Stop-loss trên đỉnh cao nhất của 3 nến tăng',
          'Phù hợp nhất trong downtrend mạnh có EMA 50 dốc xuống',
        ],
      },
      {
        heading: '3. Upside / Downside Tasuki Gap',
        body: 'Mẫu 3 nến có khoảng trống (gap) cùng chiều xu hướng. Nến thứ 3 ngược chiều nhưng KHÔNG lấp đầy gap — báo hiệu xu hướng còn nguyên động lực.',
        bullets: [
          'Upside Tasuki: gap up + 1 nến tăng + 1 nến giảm chưa đóng gap → BUY tại close nến 3',
          'Áp dụng nhiều ở cổ phiếu/forex sau gap mở phiên hơn là crypto 24/7',
        ],
        pitfall: 'Nếu nến số 3 lấp đầy gap → mẫu fail, ưu tiên thoát lệnh.',
      },
      {
        heading: '4. Bullish / Bearish Three Line Strike',
        body: '3 nến cùng chiều xu hướng nối tiếp, sau đó 1 nến ngược chiều "nhấn chìm" cả 3 nến trước. Nghịch lý: đây vẫn là tín hiệu TIẾP DIỄN, vì nến ngược chiều chỉ là cú rũ bỏ trước khi đi tiếp. Bulkowski xếp đây là mẫu tiếp diễn có win-rate cao nhất — 84% trên Daily.',
        example:
          'NQ futures Q1/2024 nhiều lần xuất hiện Bullish Three Line Strike trên H4 — nến strike thường khớp với fake breakdown của EMA 20.',
      },
      {
        heading: '5. Mat Hold Pattern',
        body: 'Tương tự Rising Three nhưng nến thứ 2 mở cửa với gap tăng — cho thấy lực mua mạnh hơn nhiều. Độ tin cậy cao hơn Rising Three Methods (~78%).',
      },
      {
        heading: '6. Separating Lines',
        body: 'Hai nến cùng giá mở cửa nhưng ngược chiều. Nến thứ 2 cùng chiều xu hướng → tiếp diễn. Thường xuất hiện sau nhịp pullback nhẹ.',
      },
      {
        heading: '7. Side-by-Side White/Black Lines',
        body: 'Hai nến cùng màu, cùng giá mở cửa và độ dài tương đương, xuất hiện sau gap. Thị trường nghỉ chân ngang trước khi tiếp tục bứt phá.',
        bullets: [
          'White Lines (xu hướng tăng): cả 2 nến tăng → xác nhận động lực còn',
          'Black Lines (xu hướng giảm): cả 2 nến giảm → xác nhận lực bán',
        ],
      },
      {
        heading: '8. On-Neck / In-Neck / Thrusting Pattern',
        body: 'Nhóm 3 mẫu nến trong xu hướng giảm: nến tăng nhỏ không thể lấy lại được vùng giảm trước đó → người mua yếu, xu hướng giảm tiếp diễn.',
        bullets: [
          'On-Neck: nến tăng đóng cửa = đáy nến giảm trước (yếu nhất)',
          'In-Neck: đóng cửa hơi cao hơn đáy (vẫn yếu)',
          'Thrusting: đóng cửa giữa thân nến giảm trước (mạnh hơn nhưng vẫn tiếp diễn giảm nếu nằm dưới EMA 200)',
        ],
      },
      {
        heading: '9. Bullish/Bearish Flag & Pennant (mẫu nến tổng hợp)',
        body: 'Sau một "cột cờ" tăng/giảm mạnh, giá tích luỹ trong kênh dốc ngược (flag) hoặc tam giác hội tụ (pennant). Khi giá phá vỡ theo hướng cờ → tiếp diễn với mục tiêu = chiều dài cột cờ.',
        bullets: [
          'Cột cờ phải có volume bùng nổ, nhịp tích luỹ volume cạn dần',
          'Breakout phải kèm volume gấp đôi 20-bar SMA',
          'Phù hợp đa khung từ M5 đến D1',
        ],
        example: 'ETH/USDT H1 27/02/2024: cột cờ +6%, tam giác pennant 8 giờ, breakout +5.8% (gần đúng measured move).',
      },
      {
        heading: '10. Ascending / Descending Triangle (tổng hợp)',
        body: 'Tam giác tăng (đỉnh ngang + đáy cao dần) thường tiếp diễn xu hướng tăng; tam giác giảm ngược lại. Win-rate 68–73% khi breakout đúng hướng xu hướng chính.',
      },
    ],
    takeaways: [
      'Mẫu tiếp diễn = cơ hội vào lệnh THUẬN xu hướng — luôn an toàn hơn bắt đảo chiều',
      'Luôn xác nhận với volume: nến phá vỡ phải có volume tăng ít nhất 1.5x TB 20',
      'Kết hợp với EMA 50/200 để lọc tín hiệu giả: chỉ trade pattern cùng chiều EMA 200',
      'Đặt SL kỷ luật, không bao giờ "hy vọng" — Bulkowski chứng minh ngay cả mẫu mạnh nhất cũng fail 16–28%',
      'Multi-timeframe: pattern trên H4 mạnh hơn 3x pattern trên M15',
    ],
    checklist: [
      '☐ Xu hướng chính (EMA 200 D1) cùng chiều pattern?',
      '☐ Volume xác nhận trên nến phá vỡ?',
      '☐ Vùng SL có nằm xa quá 2x ATR không (rủi ro chấp nhận được)?',
      '☐ R:R mục tiêu ≥ 1:2?',
      '☐ Không có resistance/support lớn trong vòng 1x ATR phía trước?',
      '☐ Kiểm tra news lịch kinh tế trong 4h tới?',
    ],
    faqs: [
      {
        question: 'Mẫu tiếp diễn có hoạt động tốt trên crypto không?',
        answer:
          'Có, đặc biệt Flag/Pennant và Three Methods cho kết quả rất tốt trên BTC/ETH H1–H4. Tuy nhiên Tasuki Gap ít xuất hiện do crypto giao dịch 24/7 hiếm có gap đáng kể.',
      },
      {
        question: 'Khung thời gian nào tốt nhất?',
        answer:
          'D1 và H4 cho tín hiệu chất lượng nhất. M5–M15 nhiễu nhiều, chỉ phù hợp scalper có kinh nghiệm và đã có context từ khung lớn.',
      },
      {
        question: 'Win-rate thấp dù pattern đẹp, tôi sai gì?',
        answer:
          'Kiểm tra 3 lỗi phổ biến: (1) trade ngược xu hướng EMA 200, (2) bỏ qua xác nhận volume, (3) entry quá xa vùng pattern khiến SL rộng → R:R tệ.',
      },
    ],
  },
  {
    slug: 'mau-nen-dao-chieu',
    category: 'Price Action',
    title: 'Mẫu Nến Đảo Chiều Quan Trọng Nhất',
    excerpt:
      'Hammer, Shooting Star, Engulfing, Morning/Evening Star, Tweezer, Three Inside/Outside — những mẫu nến giúp bạn bắt đỉnh đáy chính xác.',
    duration: '28 phút',
    level: 'Cơ bản',
    cover: coverReversal,
    intro:
      'Mẫu nến đảo chiều (reversal pattern) xuất hiện ở cuối xu hướng và báo hiệu khả năng đảo ngược dòng tiền. Khái niệm này được Steve Nison phổ biến ra phương Tây năm 1991 qua cuốn "Japanese Candlestick Charting Techniques", dù người Nhật đã dùng từ thế kỷ 18 để giao dịch gạo. Bài học bóc tách 10 mẫu mạnh nhất, kèm bối cảnh, ví dụ thực chiến và bẫy thường gặp — tất cả công cụ cốt lõi của Price Action mà mọi trader cần thuộc lòng.',
    history:
      'Munehisa Homma (1724–1803), thương gia gạo Nhật Bản, được xem là cha đẻ của biểu đồ nến. Ông dùng nó để dự báo giá gạo tại sàn Dojima. Phương pháp lan sang phương Tây năm 1991 nhờ Steve Nison và đến nay vẫn là ngôn ngữ giao dịch chuẩn mực.',
    sections: [
      {
        heading: '1. Hammer & Hanging Man',
        body: 'Nến có thân nhỏ ở phía trên, bóng dưới dài gấp ít nhất 2 lần thân, gần như không có bóng trên. Cùng hình dạng nhưng ý nghĩa phụ thuộc bối cảnh: Hammer ở đáy downtrend = đảo chiều tăng; Hanging Man ở đỉnh uptrend = cảnh báo đảo chiều giảm.',
        bullets: [
          'Bóng dưới ≥ 2× thân nến',
          'Bóng trên không quá 10% tổng độ dài nến',
          'Phải xuất hiện ở vùng hỗ trợ/kháng cự rõ ràng',
        ],
        example: 'BTCUSDT 4H ngày 11/03/2024 hình thành Hammer chuẩn tại $61,200 sau 5 nến giảm liên tiếp; nến xác nhận tăng 3.2% và mở ra nhịp tăng lên $73,000.',
        pitfall: 'Hammer giữa sideway gần như vô nghĩa — chỉ giao dịch khi có xu hướng rõ trước đó.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Candlestick_chart_scheme_03-en.svg/640px-Candlestick_chart_scheme_03-en.svg.png',
      },
      {
        heading: '2. Shooting Star & Inverted Hammer',
        body: 'Hình ảnh đối xứng của Hammer: thân nhỏ ở dưới, bóng trên dài. Shooting Star ở đỉnh báo lực bán đè mạnh sau khi phe mua thử phá kháng cự bất thành. Inverted Hammer ở đáy thể hiện phe mua bắt đầu phản công.',
        bullets: [
          'Bóng trên ≥ 2× thân, bóng dưới rất ngắn',
          'Shooting Star tin cậy hơn nếu kèm volume cao',
          'Inverted Hammer cần nến xác nhận tăng kế tiếp',
        ],
        pitfall: 'Đừng nhầm Shooting Star với Inverted Hammer — vị trí trong xu hướng quyết định ý nghĩa.',
      },
      {
        heading: '3. Bullish & Bearish Engulfing',
        body: 'Mẫu 2 nến: nến thứ 2 ngược chiều và thân nhấn chìm hoàn toàn thân nến thứ 1. Engulfing là một trong những mẫu đảo chiều có winrate cao nhất theo nghiên cứu của Thomas Bulkowski ("Encyclopedia of Candlestick Charts"), đặc biệt khi xuất hiện tại vùng S/R kết hợp Fibonacci 0.618.',
        bullets: [
          'Thân nến 2 phải lớn hơn thân nến 1 (không cần bao bóng)',
          'Volume nến 2 nên gấp 1.5–2× volume trung bình',
          'Vào lệnh ngay khi nến 2 đóng cửa, SL sau bóng dài hơn của 2 nến',
        ],
        example: 'EURUSD H4 ngày 02/10/2023 cho Bullish Engulfing tại 1.0450 (vùng demand H1 + Fib 0.618), giá tăng 280 pip trong 4 ngày kế tiếp.',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Candlestick_chart_scheme_02-en.svg/640px-Candlestick_chart_scheme_02-en.svg.png',
      },
      {
        heading: '4. Morning Star & Evening Star',
        body: 'Mẫu 3 nến cổ điển: nến 1 lớn cùng xu hướng cũ → nến 2 thân nhỏ (doji/spinning top) thể hiện do dự → nến 3 lớn ngược chiều, đóng cửa ít nhất giữa thân nến 1. Báo hiệu chuyển giao quyền lực rõ ràng giữa bên mua và bên bán.',
        bullets: [
          'Nến 2 lý tưởng có gap so với nến 1 và nến 3',
          'Nến 3 đóng cửa càng sâu vào thân nến 1 càng mạnh',
          'TP1 = đỉnh/đáy gần nhất, TP2 = mở rộng Fib 1.618',
        ],
        pitfall: 'Trên crypto 24/7, gap giữa các nến hiếm — tiêu chí "gap" có thể bỏ qua, nhưng tỉ lệ thân nến vẫn phải đúng.',
      },
      {
        heading: '5. Three Inside Up/Down & Three Outside Up/Down',
        body: 'Three Inside Up = Bullish Harami + nến xác nhận tăng phá đỉnh nến mẹ. Three Outside Up = Bullish Engulfing + nến xác nhận. Theo Bulkowski, Three Outside có tỉ lệ đảo chiều thành công ~78%, cao nhất trong nhóm 3 nến.',
      },
      {
        heading: '6. Tweezer Top & Tweezer Bottom',
        body: 'Hai (hoặc nhiều) nến liên tiếp có cùng đỉnh (Tweezer Top) hoặc cùng đáy (Tweezer Bottom). Thị trường thử phá vùng giá 2 lần đều thất bại → vùng đó trở thành kháng cự/hỗ trợ vững chắc.',
        bullets: [
          'Càng có nhiều nến chạm cùng đỉnh/đáy càng mạnh',
          'Hiệu quả nhất ở vùng round number (1.1000, 70,000…)',
        ],
      },
      {
        heading: '7. Piercing Pattern & Dark Cloud Cover',
        body: 'Phiên bản "nhẹ" hơn của Engulfing: nến 2 ngược chiều và đóng cửa vượt qua trung điểm thân nến 1 nhưng không nhấn chìm hoàn toàn. Tin cậy ~65–70% khi đi kèm volume tăng và vùng S/R.',
      },
      {
        heading: '8. Doji & Spinning Top — Tín hiệu lưỡng lự',
        body: 'Thân rất nhỏ (Doji gần như không thân), thể hiện cân bằng cung-cầu. Phân loại: Standard Doji, Long-legged Doji, Dragonfly (đáy), Gravestone (đỉnh). Khi xuất hiện sau xu hướng dài + tại vùng S/R + RSI quá mua/quá bán → cảnh báo đảo chiều sớm.',
        pitfall: 'Doji giữa range thấp biến động chỉ là noise, đừng giao dịch theo.',
      },
      {
        heading: '9. Three White Soldiers & Three Black Crows',
        body: 'Ba nến cùng chiều liên tiếp, thân lớn, mỗi nến đóng cửa gần đỉnh/đáy nến đó. Xuất hiện ở cuối downtrend (Three White Soldiers) hoặc uptrend (Three Black Crows) → đảo chiều rất mạnh, thường mở ra một xu hướng mới.',
      },
      {
        heading: '10. Cách lọc tín hiệu đảo chiều — Quy tắc 4 lớp',
        body: 'Một mẫu nến đẹp chưa đủ. Áp dụng quy tắc 4 lớp xác nhận: (1) Vị trí — phải tại S/R đa khung; (2) Bối cảnh — sau xu hướng dài, không trong sideway; (3) Volume — nến tín hiệu kèm volume bứt phá; (4) Đa chỉ báo — RSI phân kỳ, MACD cắt, hoặc OB/FVG đồng pha.',
        bullets: [
          'Lớp 1: Khung HTF có vùng S/R rõ ràng',
          'Lớp 2: Khung trade có mẫu nến đảo chiều',
          'Lớp 3: Volume + indicator xác nhận',
          'Lớp 4: Risk-Reward ≥ 1:2 trước khi vào lệnh',
        ],
      },
    ],
    takeaways: [
      'Mẫu đảo chiều CHỈ có ý nghĩa khi xuất hiện ở vùng S/R quan trọng',
      'Luôn chờ nến xác nhận sau mẫu đảo chiều rồi mới vào lệnh',
      'Volume tăng đột biến = độ tin cậy cao hơn nhiều lần',
      'Engulfing và Three Outside có winrate cao nhất theo Bulkowski',
      'Kết hợp đa khung (HTF context + LTF entry) để giảm tín hiệu giả',
    ],
    checklist: [
      'Xu hướng trước đó có rõ ràng không (≥ 5 nến cùng chiều)?',
      'Mẫu nến đang ở vùng S/R, Fibonacci hoặc OB/FVG?',
      'Volume nến tín hiệu có ≥ 1.5× volume trung bình 20 nến?',
      'Có chỉ báo phụ xác nhận (RSI phân kỳ, MACD cross)?',
      'R:R ≥ 1:2 với SL hợp lý sau bóng nến tín hiệu?',
    ],
    faqs: [
      {
        question: 'Mẫu nến đảo chiều có hiệu quả trên khung thời gian thấp như M5/M15 không?',
        answer: 'Có, nhưng nhiễu cao hơn nhiều. Khuyến nghị dùng từ H1 trở lên cho swing, M15 trở lên cho intraday và luôn xác nhận với khung HTF.',
      },
      {
        question: 'Nên đặt SL ở đâu cho an toàn?',
        answer: 'Đặt sau bóng dài nhất của mẫu nến tín hiệu, cộng thêm 0.2–0.5× ATR(14) để tránh bị quét bởi spread/biến động bất thường.',
      },
      {
        question: 'Crypto không có gap, Morning Star có còn hiệu lực?',
        answer: 'Có. Trên crypto 24/7, bỏ qua tiêu chí gap và tập trung vào tỉ lệ thân nến cùng vị trí trong xu hướng. Mẫu vẫn cho tín hiệu tốt.',
      },
    ],
  },
  {
    slug: 'smc-co-ban',
    category: 'Smart Money Concepts',
    title: 'Smart Money Concepts (SMC) Từ A-Z',
    excerpt:
      'Order Block, Fair Value Gap, Liquidity, BOS, CHOCH, Mitigation, Premium/Discount — hiểu cách "cá mập" thực sự giao dịch.',
    duration: '45 phút',
    level: 'Nâng cao',
    cover: coverSmc,
    intro:
      'Smart Money Concepts (SMC) là phương pháp giao dịch theo dấu chân của tổ chức lớn — những người tạo ra xu hướng. Thay vì đoán theo đám đông, SMC dạy bạn nhận ra nơi smart money đang gom hàng và xả hàng. Phương pháp được phát triển từ nền tảng Wyckoff và ICT (Inner Circle Trader) của Michael J. Huddleston, hiện là khung phân tích phổ biến nhất trong cộng đồng trader chuyên nghiệp 2020–2025.',
    history:
      'SMC bắt nguồn từ Wyckoff (1900s) → phát triển thành ICT bởi Michael Huddleston (2010s) → được rút gọn và phổ biến thành "SMC" trên YouTube/Twitter từ 2019. Hiện chiếm khoảng 60% nội dung phân tích kỹ thuật trong cộng đồng trader trẻ toàn cầu.',
    sections: [
      {
        heading: '1. Market Structure — Cấu trúc thị trường',
        body: 'Nền tảng của SMC. Một xu hướng tăng (bullish) tạo Higher High (HH) và Higher Low (HL) liên tục. Xu hướng giảm tạo Lower High (LH) và Lower Low (LL). Mọi khái niệm khác trong SMC đều xoay quanh việc đọc đúng cấu trúc này trên nhiều khung.',
        bullets: [
          'Xác định cấu trúc trên 3 khung: HTF (D1/H4) → MTF (H1) → LTF (M15)',
          'Chỉ trade theo hướng cấu trúc HTF',
          'LTF dùng để tìm entry chính xác',
        ],
        image: 'https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=800&q=80',
      },
      {
        heading: '2. BOS (Break of Structure)',
        body: 'Phá vỡ cấu trúc CÙNG CHIỀU xu hướng — xác nhận xu hướng còn tiếp diễn. Trong uptrend, BOS xảy ra khi giá phá đỉnh HH gần nhất. Đây là tín hiệu tiếp tục, không phải tín hiệu đảo chiều.',
        example: 'BTCUSDT H4 sau khi tạo HL tại $58,000 đã BOS qua $65,000 ngày 26/02/2024, mở đường cho rally lên $73,000.',
      },
      {
        heading: '3. CHOCH (Change of Character)',
        body: 'Phá vỡ cấu trúc NGƯỢC CHIỀU xu hướng — tín hiệu đầu tiên của đảo chiều. Trong uptrend, CHOCH xảy ra khi giá phá đáy HL gần nhất. Sau CHOCH thường có pullback về OB rồi mới chạy thật sự.',
        pitfall: 'Nhiều trader nhầm CHOCH với BOS — luôn xác định rõ swing high/low gần nhất TRƯỚC khi gọi tên tín hiệu.',
      },
      {
        heading: '4. Order Block (OB)',
        body: 'Là nến giảm cuối cùng trước một move tăng mạnh (Bullish OB), hoặc nến tăng cuối cùng trước move giảm mạnh (Bearish OB). OB chứa lệnh chưa khớp hết của tổ chức — khi giá quay lại, họ tiếp tục đẩy theo hướng cũ. Đây là vùng entry có winrate cao nhất trong SMC.',
        bullets: [
          'OB hợp lệ phải kèm move impulsive (≥ 3 nến cùng chiều bứt phá)',
          'OB chưa được mitigated (chưa bị quay lại lấp) tin cậy hơn',
          'Refined OB = chỉ lấy phần thân nến + FVG kế tiếp để vào lệnh chính xác',
        ],
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
      },
      {
        heading: '5. Fair Value Gap (FVG) / Imbalance',
        body: 'Khoảng trống giá giữa 3 nến: bóng nến 1 và bóng nến 3 không chạm nhau, để lại "khe hở" trong phạm vi nến 2. Thị trường có xu hướng quay lại lấp đầy FVG để cân bằng cung-cầu. FVG vừa là vùng entry pullback vừa là target take-profit hiệu quả.',
        bullets: [
          'FVG cùng chiều BOS = vùng entry có R:R cao',
          'FVG ngược chiều = target TP khi giá đang chạy xa khỏi điểm vào',
          'FVG trên HTF (H4, D1) tin cậy hơn nhiều so với LTF',
        ],
      },
      {
        heading: '6. Liquidity (Thanh khoản) & Liquidity Sweep',
        body: 'Liquidity là vùng tập trung stop-loss của retail trader (trên đỉnh equal highs, dưới đáy equal lows, dưới trendline rõ ràng). Smart money cần thanh khoản để khớp lệnh lớn, nên thường đẩy giá QUÉT (sweep) các vùng này trước khi đi theo hướng thật. Liquidity sweep + CHOCH ngay sau là combo entry kinh điển.',
        example: 'XAUUSD ngày 13/05/2024 quét đáy đôi tại $2,332 (sweep liquidity bear), tạo CHOCH H1 và bật lên $2,385 trong 18 giờ.',
        pitfall: 'Đừng vào lệnh ngay khi thấy sweep — chờ CHOCH xác nhận hoặc nến đảo chiều mạnh tại vùng OB/FVG.',
      },
      {
        heading: '7. Premium & Discount Zones',
        body: 'Chia range giữa swing high và swing low gần nhất theo Fibonacci. Vùng trên 0.5 = Premium (đắt, ưu tiên SELL); vùng dưới 0.5 = Discount (rẻ, ưu tiên BUY); vùng 0.5–0.618 = Equilibrium (cân bằng). SMC chỉ BUY ở Discount và SELL ở Premium — không đu đỉnh, không bắt đáy giữa range.',
      },
      {
        heading: '8. Mitigation Block & Breaker Block',
        body: 'Mitigation Block là OB ngược chiều bị giá phá qua rồi quay lại test → trở thành kháng cự/hỗ trợ mới. Breaker Block là OB cũ bị BOS phá qua, sau đó được tái sử dụng làm vùng entry theo hướng ngược lại. Hai khái niệm này giúp tận dụng lại các zone đã "vô hiệu" theo cách thông minh.',
      },
      {
        heading: '9. Quy trình Top-Down Analysis chuẩn SMC',
        body: 'Bước 1: D1 xác định bias (bullish/bearish) qua cấu trúc. Bước 2: H4 tìm POI (Point of Interest = OB/FVG chưa mitigated) trong vùng Discount/Premium. Bước 3: H1 chờ giá tới POI và tạo liquidity sweep. Bước 4: M15 chờ CHOCH + entry tại OB/FVG nhỏ bên trong. Bước 5: SL sau OB, TP1 = liquidity gần nhất, TP2 = OB ngược chiều HTF.',
        bullets: [
          'Luôn đi từ HTF xuống LTF, không bao giờ ngược lại',
          'Mỗi POI chỉ trade tối đa 1–2 lần, không "trả thù"',
          'Ghi nhật ký: POI nào hoạt động, POI nào fail để tinh chỉnh',
        ],
      },
    ],
    takeaways: [
      'SMC hiệu quả nhất trên timeframe H1, H4, D1',
      'Luôn phân tích từ HTF (D1) xuống LTF (M15) để đồng pha',
      'OB + FVG + Liquidity Sweep + CHOCH = combo entry mạnh nhất',
      'Chỉ BUY ở Discount, SELL ở Premium — tuyệt đối không đu giữa range',
      'POI chưa mitigated luôn ưu tiên hơn POI đã test nhiều lần',
    ],
    checklist: [
      'Đã xác định bias HTF (D1/H4) chưa?',
      'POI nằm trong vùng Discount (BUY) hoặc Premium (SELL) chưa?',
      'Đã có liquidity sweep tại POI chưa?',
      'CHOCH trên LTF (M15/M5) đã xác nhận chưa?',
      'SL sau OB và R:R ≥ 1:3 chưa?',
    ],
    faqs: [
      {
        question: 'SMC có khác gì so với ICT?',
        answer: 'ICT là bộ khung gốc rất chi tiết (gồm Killzones, Power of 3, OTE…) của Michael Huddleston. SMC là phiên bản rút gọn, dễ tiếp cận hơn, tập trung vào BOS/CHOCH/OB/FVG/Liquidity. Bài "Liquidity & ICT Concepts" trong khoá Pro đào sâu hơn.',
      },
      {
        question: 'SMC có dùng được cho stocks và crypto không?',
        answer: 'Có. SMC hoạt động tốt trên mọi thị trường có thanh khoản cao: forex, crypto (BTC/ETH/large caps), futures (ES/NQ), gold. Hiệu quả kém trên cổ phiếu small-cap thanh khoản thấp.',
      },
      {
        question: 'Bao lâu mới thành thạo SMC?',
        answer: 'Hiểu lý thuyết: 2–4 tuần. Áp dụng có lời ổn định: 6–12 tháng backtest + forward test ít nhất 200 lệnh. Đừng vội nạp tiền thật trước khi qua giai đoạn demo.',
      },
    ],
  },
  {
    slug: 'wyckoff-method',
    category: 'Phân Tích Cấu Trúc',
    title: 'Phương Pháp Wyckoff — Đọc Vị Tay To',
    excerpt:
      '4 pha thị trường: Tích lũy, Tăng giá, Phân phối, Giảm giá. Spring và Upthrust là tín hiệu vàng — kèm 9 quy luật và VSA.',
    duration: '50 phút',
    level: 'Nâng cao',
    cover: coverWyckoff,
    intro:
      'Richard Demille Wyckoff (1873–1934) là một trong "5 huyền thoại" của Wall Street cùng J.P. Morgan, Jesse Livermore. Phương pháp ông phát triển dựa trên quan sát hành vi của "Composite Man" — nhân vật giả định đại diện cho dòng tiền tổ chức. Đến nay Wyckoff vẫn là một trong những framework mạnh nhất để hiểu chu kỳ thị trường, được giảng dạy chính thức tại Wyckoff Analytics và là nền tảng của SMC, VSA hiện đại.',
    history:
      'Wyckoff sáng lập "Magazine of Wall Street" năm 1907, sau đó mở Wyckoff Course đào tạo trader chuyên nghiệp. Phương pháp được Hank Pruden hệ thống hoá lại trong cuốn "The Three Skills of Top Trading" (2007) và hiện được Wyckoff Analytics (Roman Bogomazov) duy trì giảng dạy.',
    sections: [
      {
        heading: '1. Composite Man — Triết lý nền tảng',
        body: 'Wyckoff đề xuất hãy hình dung toàn bộ thị trường được điều khiển bởi MỘT cá nhân siêu giàu — Composite Man. CM thực hiện 4 việc lặp lại: tích lũy âm thầm, đẩy giá lên, phân phối âm thầm, đẩy giá xuống. Mọi hành động giá đều có chủ đích — nhiệm vụ trader là đọc ý đồ đó qua Price + Volume + Time.',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80',
      },
      {
        heading: '2. 4 Pha của Chu Kỳ Wyckoff',
        body: 'Accumulation (tích lũy) → Markup (tăng giá) → Distribution (phân phối) → Markdown (giảm giá). Chu kỳ này lặp lại trên mọi tài sản và mọi timeframe — từ M5 BTCUSDT đến biểu đồ tháng SPX. Hiểu mình đang ở pha nào quan trọng hơn việc đoán giá đi đâu.',
        bullets: [
          'Accumulation: range sau downtrend, volume giảm dần',
          'Markup: bứt phá mạnh kèm volume, các pullback nông',
          'Distribution: range sau uptrend, volume cao bất thường ở các đỉnh giả',
          'Markdown: phá đáy range, panic selling, volume bùng nổ',
        ],
      },
      {
        heading: '3. Pha Tích Lũy (Accumulation) — 5 sự kiện then chốt',
        body: 'Sau downtrend dài, giá đi sideway trong range. Smart money âm thầm gom hàng. Các sự kiện chính theo thứ tự: PS (Preliminary Support — đáy đầu tiên có volume cao) → SC (Selling Climax — panic dump tạo đáy range) → AR (Automatic Rally — bật mạnh tạo đỉnh range) → ST (Secondary Test — test lại SC với volume thấp hơn) → Spring (giả phá đáy) → Test (test Spring với volume thấp) → SOS (Sign of Strength — bứt phá mạnh ra khỏi range) → LPS (Last Point of Support — pullback cuối cùng vào OB).',
        example: 'BTCUSDT D1 từ 11/2022 đến 01/2023 hình thành Accumulation Schematic #1 hoàn chỉnh: SC tại $15,500 → Spring tại $16,000 → SOS qua $21,000, mở rally lên $73,000.',
      },
      {
        heading: '4. Spring — Tín hiệu mua mạnh nhất',
        body: 'Giá phá đáy range trong giây lát rồi đóng cửa quay lại trên — quét stop-loss của bear. Theo thống kê của Wyckoff Analytics, Spring có winrate ~75% khi đi kèm volume bùng nổ và test sau đó với volume thấp. Đây là điểm vào lệnh BUY có R:R tốt nhất trong toàn bộ chu kỳ Wyckoff (thường 1:5 đến 1:10).',
        bullets: [
          'Spring #1: phá nông, không có follow-through (mạnh nhất)',
          'Spring #2: phá sâu hơn, có nến hồi mạnh',
          'Spring #3: phá rất sâu, cần xác nhận bằng nhiều nến',
          'Entry: tại Test sau Spring, không phải Spring',
        ],
        pitfall: 'Đừng vào lệnh tại Spring — nhiều khi đó là phá đáy thật. Luôn chờ Test với volume giảm.',
      },
      {
        heading: '5. Pha Phân Phối (Distribution) & UTAD',
        body: 'Sau uptrend dài, smart money xả hàng cho retail FOMO. Cấu trúc gương ngược của Accumulation: PSY → BC (Buying Climax) → AR → ST → UTAD (Upthrust After Distribution — giả phá đỉnh) → SOW (Sign of Weakness) → LPSY (Last Point of Supply). UTAD là tín hiệu SELL có winrate cao tương tự Spring nhưng ngược chiều.',
      },
      {
        heading: '6. 9 Quy luật Wyckoff (Wyckoff Laws)',
        body: 'Wyckoff đúc kết 3 luật cơ bản và 9 quy luật phụ. 3 luật chính: (1) Law of Supply & Demand — giá thay đổi theo tương quan cung cầu; (2) Law of Cause & Effect — độ rộng range tích lũy quyết định độ dài move sau đó (đếm bằng Point & Figure); (3) Law of Effort vs Result — volume (effort) phải tương xứng với biên độ giá (result), không tương xứng = cảnh báo đảo chiều.',
        bullets: [
          'Volume tăng + giá tăng = healthy uptrend',
          'Volume tăng nhưng giá đi ngang = phân phối bí mật',
          'Volume giảm trong pullback = pullback lành mạnh',
          'Volume cao tại đỉnh + nến nhỏ = đảo chiều sắp tới',
        ],
      },
      {
        heading: '7. Volume Spread Analysis (VSA) — Mở rộng của Wyckoff',
        body: 'VSA do Tom Williams (cựu syndicate trader) phát triển từ 1990s, mở rộng khái niệm Effort vs Result của Wyckoff. Phân tích mỗi nến qua 3 yếu tố: Spread (biên độ), Volume, Close position trong nến. Các tín hiệu kinh điển: No Demand (nến tăng nhỏ + volume thấp), Stopping Volume (nến giảm có bóng dưới dài + volume cực cao = bottom), Climactic Action (volume bùng nổ tại đỉnh/đáy).',
      },
      {
        heading: '8. Point & Figure — Đo "Cause" để dự báo "Effect"',
        body: 'Wyckoff dùng biểu đồ P&F (chỉ vẽ X cho tăng, O cho giảm, không có thời gian) để đếm số ô trong pha tích lũy → quy đổi thành mục tiêu giá sau breakout. Công thức: Price Target = Số ô tích lũy × Box Size × Reversal. P&F lọc nhiễu cực tốt, hiện vẫn được institutional dùng cho swing/position trading.',
      },
      {
        heading: '9. Quy trình Wyckoff trade chuẩn — 5 bước',
        body: 'Bước 1: Xác định xu hướng HTF (D1/W1) — tìm range tích lũy/phân phối. Bước 2: Đánh dấu các sự kiện (PS, SC, AR, ST, Spring/UTAD). Bước 3: Đợi Spring/UTAD + Test với volume giảm. Bước 4: Vào lệnh tại LPS/LPSY, SL sau Spring/UTAD. Bước 5: TP1 = mép trên/dưới range, TP2 = mục tiêu P&F.',
      },
    ],
    takeaways: [
      'Wyckoff dạy bạn THỜI ĐIỂM (when), không chỉ HƯỚNG (where)',
      'Spring/UTAD là 2 entry có winrate cao nhất (~75%)',
      'Volume là chìa khoá — luôn đọc Effort vs Result',
      'Composite Man chỉ làm 4 việc: gom, đẩy lên, xả, đẩy xuống — lặp mãi',
      'Kết hợp VSA để xác nhận pha và Point & Figure để đặt mục tiêu',
    ],
    checklist: [
      'Đã xác định range tích lũy/phân phối trên HTF chưa?',
      'Đã đánh dấu đủ PS, SC, AR, ST chưa?',
      'Có Spring/UTAD và Test sau đó với volume giảm chưa?',
      'Volume tại điểm vào có hợp lý theo luật Effort vs Result?',
      'Mục tiêu P&F có cho R:R ≥ 1:3 không?',
    ],
    faqs: [
      {
        question: 'Wyckoff khác gì SMC?',
        answer: 'Wyckoff là gốc — tập trung vào pha thị trường, volume và cấu trúc range. SMC là phiên bản hiện đại tập trung vào Order Block, FVG, Liquidity sweep. Bản chất giống nhau (đọc dấu chân smart money), chỉ khác cách diễn đạt và công cụ.',
      },
      {
        question: 'Phương pháp này có dùng cho intraday được không?',
        answer: 'Được, nhưng cần kinh nghiệm cao. Khung phù hợp nhất là H4/D1 cho swing. Trên M15/M30 cấu trúc Wyckoff vẫn xuất hiện nhưng nhiễu nhiều, dễ nhận diện sai pha.',
      },
      {
        question: 'Sách nào nên đọc?',
        answer: '"The Three Skills of Top Trading" (Hank Pruden), "Trades About to Happen" (David Weis), "Wyckoff 2.0" (Rubén Villahermosa). Tránh các nguồn YouTube tóm tắt vì thường thiếu phần Cause & Effect và P&F.',
      },
    ],
  },
  {
    slug: 'risk-management',
    category: 'Quản Lý Vốn',
    title: 'Quản Lý Vốn — Yếu Tố Sống Còn',
    excerpt:
      'Position sizing, R:R ratio, drawdown control, Kelly đơn giản, expectancy. 90% trader thua không phải vì sai chiến lược mà vì sai quản lý vốn.',
    duration: '30 phút',
    level: 'Cơ bản',
    cover: coverRisk,
    intro:
      'Bạn có thể đúng 70% tín hiệu nhưng vẫn cháy tài khoản nếu quản lý vốn sai. Theo nghiên cứu của Brett Steenbarger và dữ liệu công khai từ FTMO/MyForexFunds (2020–2023), 87–93% trader retail mất tiền — và lý do số một KHÔNG phải là chiến lược tệ, mà là quản lý vốn sai. Bài học này là nền tảng bắt buộc trước khi học bất kỳ chiến lược entry nào.',
    history:
      'Khái niệm position sizing hiện đại bắt nguồn từ Ralph Vince ("Portfolio Management Formulas", 1990) và Van K. Tharp ("Trade Your Way to Financial Freedom", 1998). Tharp là người đầu tiên phổ biến khái niệm "R-multiple" — đo lợi nhuận theo bội số rủi ro thay vì theo tiền tuyệt đối.',
    sections: [
      {
        heading: '1. Quy tắc 1–2% mỗi lệnh',
        body: 'Không bao giờ đặt rủi ro quá 2% tài khoản cho 1 lệnh. Với mức risk 1%/lệnh, ngay cả khi thua 20 lệnh liên tiếp (xác suất ~0.0001% với hệ thống winrate 50%), bạn chỉ mất 18.2% — vẫn còn vốn để phục hồi. Mức 2% là trần tuyệt đối cho người mới.',
        bullets: [
          'Tài khoản $1,000 → rủi ro tối đa $10–20/lệnh',
          'Tài khoản $10,000 → $100–200/lệnh',
          'Trader prop firm thường giới hạn 0.5–1% do max drawdown 5–10%',
        ],
        example: 'Tài khoản $5,000, risk 1% = $50/lệnh. Vào BTCUSDT tại $65,000 với SL $64,000 (cách 1.54%). Position size = $50 ÷ $1,000 = 0.05 BTC = $3,250 notional. Nếu hit SL chỉ mất đúng $50.',
        pitfall: 'Nhiều trader risk theo "cảm giác" thay vì tính toán — đó là lý do số 1 dẫn đến cháy tài khoản.',
      },
      {
        heading: '2. Risk : Reward tối thiểu 1:2',
        body: 'Nếu winrate 50% với R:R 1:2, bạn lời 0.5×2R − 0.5×1R = 0.5R/lệnh. Nếu winrate 40% với R:R 1:3, bạn vẫn lời 0.4×3R − 0.6×1R = 0.6R/lệnh. Đừng vào lệnh nếu TP không gấp ít nhất 2 lần SL — toán học không cho phép bạn lời dài hạn.',
        image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&q=80',
      },
      {
        heading: '3. Expectancy — Công thức "lời/lệnh trung bình"',
        body: 'Expectancy = (Win% × Avg Win) − (Loss% × Avg Loss). Hệ thống có expectancy dương mới đáng giao dịch. Ví dụ: Win 45%, Avg Win = 2R, Loss 55%, Avg Loss = 1R → Expectancy = 0.45×2 − 0.55×1 = 0.35R/lệnh. Trade 100 lệnh kỳ vọng lời 35R. Với risk 1%/lệnh = +35% account.',
        bullets: [
          'Expectancy < 0 → dừng giao dịch ngay',
          'Expectancy 0.1–0.3R → hệ thống ổn',
          'Expectancy > 0.5R → hệ thống xuất sắc',
        ],
      },
      {
        heading: '4. Position Sizing đúng — Công thức chuẩn',
        body: 'Khối lượng lệnh = (Vốn × %Risk) ÷ Khoảng cách SL. Forex: Lot = (Equity × Risk%) ÷ (SL pips × Pip value). Crypto: Coin amount = (Equity × Risk%) ÷ (Entry − SL). Stocks: Shares = (Equity × Risk%) ÷ (Entry − SL). Luôn tính TRƯỚC khi vào lệnh — không bao giờ "ước lượng".',
        example: 'EURUSD: $10,000 × 1% = $100 risk. SL 25 pips. Pip value với 1 lot = $10 → Lot size = $100 ÷ (25 × $10) = 0.4 lot.',
      },
      {
        heading: '5. Kelly Criterion (đơn giản hoá) — Tính % tối ưu',
        body: 'Công thức Kelly: f* = (W × R − (1−W)) ÷ R, trong đó W = winrate, R = avg win/avg loss. Ví dụ W=0.55, R=2 → f* = (0.55×2 − 0.45)/2 = 32.5%. Tuy nhiên trong thực tế, dùng Half-Kelly (16.25%) hoặc Quarter-Kelly (8%) để tránh drawdown khủng. Người mới: bỏ Kelly, dùng cố định 1%.',
      },
      {
        heading: '6. Drawdown Control & Circuit Breaker',
        body: 'Drawdown = % giảm từ đỉnh equity. Áp dụng quy tắc bậc thang: DD 5% — review từng lệnh. DD 10% — giảm size xuống 50%. DD 15% — giảm xuống 25%. DD 20% — DỪNG giao dịch, nghỉ ít nhất 1 tuần, viết lại playbook. Không bao giờ "gồng" để gỡ — đây là cách nhanh nhất cháy tài khoản.',
        bullets: [
          'Daily loss limit: -3% account → tắt máy ngay',
          'Weekly loss limit: -6% → nghỉ trade tuần đó',
          'Max consecutive losses: 5 lệnh → giảm size 50%',
        ],
      },
      {
        heading: '7. Portfolio Heat & Tương quan',
        body: 'Portfolio Heat = tổng risk của các lệnh đang mở. Giới hạn ở 4–6% tổng tài khoản. Quan trọng: các cặp tương quan cao (EURUSD+GBPUSD, BTC+ETH+SOL) tính như MỘT lệnh vì nếu sai sẽ cùng SL. Đừng tự lừa mình rằng đa dạng hoá khi tất cả đều cùng chiều.',
      },
      {
        heading: '8. Tâm lý + Quản lý vốn — Cặp đôi không thể tách',
        body: 'Quản lý vốn tốt giúp tâm lý ổn định: bạn không sợ thua khi chỉ mất 1% vốn. Tâm lý ổn định giúp quản lý vốn tốt: bạn không revenge trade, không tăng size sau thắng. Hai yếu tố này tự củng cố lẫn nhau — đây là vòng lặp tích cực của trader chuyên nghiệp.',
      },
    ],
    takeaways: [
      'Bảo toàn vốn quan trọng hơn kiếm lợi nhuận',
      'Không bao giờ thay đổi SL theo cảm xúc — chỉ dời theo quy tắc trailing đã định trước',
      'Tâm lý ổn định = quản lý vốn tốt = giàu bền vững',
      'Expectancy dương + risk 1%/lệnh + 100+ lệnh = lợi nhuận tất yếu theo xác suất',
      'Drawdown 50% cần lời 100% để hoà vốn — ưu tiên phòng thủ hơn tấn công',
    ],
    checklist: [
      'Đã tính position size theo công thức chuẩn TRƯỚC khi vào lệnh chưa?',
      'Risk lệnh này có vượt 2% tài khoản không?',
      'R:R có ≥ 1:2 không?',
      'Tổng portfolio heat (gồm lệnh đang mở) có vượt 6% không?',
      'Hôm nay đã hit daily loss limit -3% chưa? Nếu có → dừng.',
    ],
    faqs: [
      {
        question: 'Risk 1% có quá thận trọng không, tôi muốn lời nhanh hơn?',
        answer: 'Risk cao = drawdown cao theo cấp số. Risk 5%/lệnh + thua 10 lệnh = mất 40% (cần lời 67% để hoà). Risk 1% + thua 10 lệnh = mất 9.6% (cần lời 10.6%). Toán học không cho phép bạn "lời nhanh" mà không gánh rủi ro huỷ diệt.',
      },
      {
        question: 'Khi nào nên tăng risk lên 2–3%?',
        answer: 'Sau ít nhất 100 lệnh thực tế có expectancy dương ổn định, max DD < 10%, và bạn vượt qua được tâm lý FOMO/revenge. Hầu hết trader chuyên không bao giờ vượt 2%.',
      },
      {
        question: 'Có nên dùng Kelly Criterion không?',
        answer: 'Kelly giả định bạn biết chính xác winrate và payoff — gần như không thể với trading. Dùng Half/Quarter-Kelly nếu có dữ liệu 200+ lệnh. Người mới: bỏ Kelly, cố định 1%/lệnh.',
      },
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
    cover: coverFib,
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
      {
        heading: '4. Fibonacci Cluster — "Vùng vàng đa khung"',
        body: 'Vẽ Fib trên 2–3 swing khác nhau (HTF + LTF) trên cùng một chart. Khi nhiều mức Fib từ các swing khác nhau hội tụ trong một vùng giá hẹp (cluster) → đây là vùng phản ứng mạnh nhất, "smart money zone".',
        bullets: [
          'Cách vẽ: Fib 1 từ đáy lớn nhất → đỉnh lớn nhất; Fib 2 từ đáy gần nhất → đỉnh gần nhất',
          'Cluster lý tưởng: 0.618 của Fib lớn trùng 0.786 của Fib nhỏ trong khoảng giá < 0.5% biên độ',
          'Phù hợp đặc biệt cho swing trader giữ lệnh 3–10 ngày',
        ],
        example:
          'BTC 11/2023: Fib từ đáy 15.500 (FTX) → đỉnh 31.800 cho 0.382 = 25.580. Fib từ đáy 24.700 → đỉnh 31.800 cho 0.618 = 27.450. Cluster 25.500–27.500 → giá chạm và bật mạnh 4 lần liên tiếp.',
      },
      {
        heading: '5. Fibonacci Time Zones',
        body: 'Vẽ các đường dọc theo dãy Fibonacci (1, 2, 3, 5, 8, 13, 21 nến) từ đỉnh/đáy quan trọng. Các đường này hay trùng với thời điểm đảo chiều ngắn hạn — không chính xác như mức giá nhưng hữu ích để cảnh báo "sắp có biến động".',
        pitfall:
          'Time Zones thường gây ảo tưởng "tự thực hiện". Chỉ dùng làm bộ lọc phụ, không bao giờ làm tín hiệu chính.',
      },
      {
        heading: '6. Fibonacci Fans & Arcs (nâng cao)',
        body: 'Fan: 3 đường chéo từ swing low qua các mức 0.382/0.5/0.618 — hoạt động như trendline động. Arc: vòng cung dựa trên các mức Fib — đo cả thời gian lẫn giá. Phổ biến hơn trong cổ phiếu Mỹ và Forex.',
      },
      {
        heading: '7. Quy tắc vẽ Fibonacci đúng',
        body: 'Quy tắc 5 bước để tránh sai lệch:',
        bullets: [
          '1. Xác định xu hướng chính trên D1 (EMA 200 dốc lên/xuống)',
          '2. Chọn swing impulse RÕ RÀNG nhất (≥ 3 nến cùng chiều, không có chồng lấp lớn)',
          '3. Vẽ từ đầu sóng đến đỉnh sóng — dùng giá đóng cửa, không dùng râu nến (trừ khi râu rất ngắn)',
          '4. Trong xu hướng tăng: vẽ từ low → high. Trong xu hướng giảm: vẽ từ high → low',
          '5. Update Fib sau khi swing mới hình thành — đừng giữ Fib cũ "hi vọng"',
        ],
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
    cover: coverElliott,
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
        heading: '5. Wave Personality — "Tính cách" của từng sóng',
        body: 'Mỗi sóng có đặc điểm tâm lý và volume riêng. Nắm được "personality" giúp bạn xác định mình đang ở sóng nào dù chưa kết thúc.',
        bullets: [
          'Sóng 1: Volume thấp, tin tức tiêu cực, đa số nghĩ là pullback',
          'Sóng 2: Sợ hãi tột độ, retail capitulate; volume giảm dần — KHÔNG được vượt đáy sóng 1',
          'Sóng 3: Volume cao nhất, breakout S/R lớn, tin tức bắt đầu xoay chiều, FOMO',
          'Sóng 4: Tích luỹ choppy, trader bị stop-loss liên tục — TRÁNH trade',
          'Sóng 5: Volume thấp hơn sóng 3, divergence RSI/MACD, retail "all in" — chuẩn bị thoát',
          'Sóng A: Tin xấu nhẹ, đa số nghĩ chỉ là correction',
          'Sóng B: Bounce yếu, "bull trap" hoàn hảo — không trade',
          'Sóng C: Capitulation, volume tăng vọt, panic — đáy thật chuẩn bị hình thành',
        ],
      },
      {
        heading: '6. Mẫu sóng đặc biệt cần thuộc',
        body: 'Khoảng 30% chu kỳ Elliott không "chuẩn 5-3" mà rơi vào các biến thể sau:',
        bullets: [
          'Extension: 1 trong 3 sóng đẩy (thường sóng 3) kéo dài thành 5 sub-wave nhỏ',
          'Truncated 5th: Sóng 5 không vượt đỉnh sóng 3 — dấu hiệu yếu, đảo chiều mạnh',
          'Leading Diagonal (sóng 1 hoặc A): 5 sub-wave kiểu chồng lấp trong kênh hội tụ',
          'Ending Diagonal (sóng 5 hoặc C): wedge cuối xu hướng — báo đảo chiều mạnh',
          'Double/Triple Three: 2–3 mẫu A-B-C nối nhau bằng sóng X — điều chỉnh phức tạp',
        ],
      },
      {
        heading: '7. Quy tắc chia khung (Degree) Elliott',
        body: 'Elliott phân chia sóng theo cấp (degree) từ Grand Supercycle (200+ năm) xuống Subminuette (vài giờ). Quy tắc vàng: phân tích từ HTF xuống LTF, không bao giờ ngược lại.',
        bullets: [
          'D1/W1 → đếm sóng cấp Primary/Intermediate cho swing trade',
          'H4 → cấp Minor cho position 3–10 ngày',
          'H1/M15 → cấp Minute/Subminuette cho intraday',
          'Sóng cấp dưới luôn nằm bên trong sóng cấp trên — fractal',
        ],
      },
      {
        heading: '8. Áp dụng thực chiến',
        body: 'Entry tốt nhất là cuối sóng 2 (vào theo sóng 3 — sóng dài nhất). Tránh trade sóng 4 (choppy). Sóng 5 thường có divergence với RSI/MACD — cảnh báo sắp đảo chiều.',
        example:
          'BTC W1 từ đáy 15.500 → đếm sóng cấp Primary. Trên D1: sóng 2 hoàn tất tại Fib 0.618 (19.500), RSI oversold + Bullish Engulfing → entry BUY, TP 1.618 × sóng 1 = ~35.000.',
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
    cover: coverRsiMacd,
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
        heading: '4. MACD Histogram — Tín hiệu sớm hơn cross',
        body: 'Histogram là khoảng cách giữa MACD và Signal. Nó chuyển dấu TRƯỚC khi cross xảy ra → cho tín hiệu sớm 1–3 nến.',
        bullets: [
          'Histogram thu hẹp 3 nến liên tiếp ở vùng dương → cảnh báo top sắp đến',
          'Histogram mở rộng từ âm sang dương → động lượng tăng đang quay lại',
          '"Squeeze" — histogram nhỏ dần về 0 = trước biến động lớn (kết hợp BB)',
        ],
      },
      {
        heading: '5. Hidden Divergence — "Vũ khí bí mật" tiếp diễn',
        body: 'Khác với regular divergence (đảo chiều), hidden divergence là tín hiệu tiếp diễn xu hướng — entry lý tưởng để vào theo trend sau pullback.',
        bullets: [
          'Hidden Bullish: Giá tạo đáy CAO HƠN, RSI tạo đáy THẤP HƠN → tiếp tục TĂNG',
          'Hidden Bearish: Giá tạo đỉnh THẤP HƠN, RSI tạo đỉnh CAO HƠN → tiếp tục GIẢM',
          'Win-rate cao hơn regular divergence vì trade thuận xu hướng',
        ],
        example:
          'BTC H4 02/2024 trong uptrend: pullback tạo đáy 51.500 (cao hơn đáy trước 50.800), RSI lại xuống 38 (thấp hơn 42 trước đó) → Hidden Bullish, entry BUY hoàn hảo, giá lên 56.000 sau 3 ngày.',
      },
      {
        heading: '6. Divergence Cheat Sheet — Bảng tra nhanh',
        body: 'Phân loại 4 dạng divergence theo chiều giá và RSI:',
        bullets: [
          'Class A (mạnh nhất): Giá đỉnh cao hơn nhiều, RSI đỉnh THẤP HƠN nhiều → reversal mạnh',
          'Class B: Giá tạo double top/bottom, RSI tạo đỉnh/đáy lệch nhau → reversal trung bình',
          'Class C (yếu nhất): Giá đỉnh cao hơn, RSI đỉnh ngang → cảnh báo nhẹ, không entry độc lập',
          'Hidden: Tín hiệu tiếp diễn — chỉ trade khi xu hướng chính rõ ràng',
        ],
        pitfall:
          'Divergence cần CONFIRMATION. Đừng vào lệnh ngay khi thấy divergence — chờ giá break trendline ngắn hạn hoặc xuất hiện mẫu nến đảo chiều.',
      },
      {
        heading: '7. Settings tối ưu theo timeframe',
        body: 'RSI mặc định 14 phù hợp đa số. MACD mặc định 12-26-9 chuẩn cho swing. Tuy nhiên có thể tinh chỉnh:',
        bullets: [
          'Scalping (M1–M5): RSI 7–9, MACD 5-13-5 (nhạy, nhanh)',
          'Day trading (M15–H1): RSI 14, MACD 12-26-9 (chuẩn)',
          'Swing trading (H4–D1): RSI 14–21, MACD 19-39-9 (mượt hơn, ít noise)',
          'Position trading (D1–W1): RSI 21, MACD 50-100-9 (lọc cực mạnh)',
        ],
      },
      {
        heading: '8. Hệ thống RSI + MACD thực chiến',
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
    cover: coverPsychology,
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
      {
        heading: '6. 7 Cognitive Bias chính của trader',
        body: 'Hiểu các bias để nhận diện chúng đang ảnh hưởng quyết định của bạn:',
        bullets: [
          'Confirmation Bias: Chỉ tìm thông tin xác nhận quan điểm sẵn có → bỏ qua tín hiệu ngược chiều',
          'Anchoring Bias: Bám vào giá mua đầu tiên → từ chối cắt lỗ vì "giá sẽ về"',
          'Recency Bias: Coi trọng sự kiện gần đây quá mức → over-react sau 1 đêm crash',
          'Hindsight Bias: "Tôi đã biết trước rồi" → tự tin sai lầm cho lệnh sau',
          'Sunk Cost Fallacy: Đã thua nhiều rồi nên gồng tiếp → hố sâu hơn',
          'Gambler\u2019s Fallacy: "Đã thua 5 lệnh rồi nên lệnh sau chắc thắng" → mỗi lệnh độc lập với nhau',
          'Bandwagon Effect: Theo đám đông Twitter/Telegram → bị xả hàng cho',
        ],
      },
      {
        heading: '7. Pre-Mortem — Tự tưởng tượng thất bại trước',
        body: 'Kỹ thuật của Gary Klein: TRƯỚC khi vào lệnh, dành 60 giây tưởng tượng "lệnh này thua thảm vì sao?". Liệt kê 3 kịch bản thất bại lớn nhất.',
        bullets: [
          'Buộc não chuyển từ FOMO sang phân tích rủi ro',
          'Phát hiện scenarios bạn chưa lập kế hoạch (gap, tin bất ngờ, slippage)',
          'Khi đã "chấp nhận" thất bại trước → ít panic khi giá ngược chiều',
        ],
        example:
          'Trước khi BUY BTC tại 64.000: pre-mortem 3 kịch bản → (1) FED hawkish bất ngờ → -8%, (2) ETF outflow lớn → -5%, (3) Mt.Gox refund → flash crash. Giải pháp: SL chặt 2%, position size nhỏ hơn 30%.',
      },
      {
        heading: '8. Mental Capital — Vốn tinh thần',
        body: 'Như tài khoản tiền, bạn có "tài khoản tinh thần" cũng cạn dần qua mỗi lệnh thua, mỗi giờ stress. Hết Mental Capital → không thể trade tốt dù còn tiền.',
        bullets: [
          'Daily reset: thiền 10 phút trước phiên, walk 20 phút sau phiên',
          'Weekly reset: 1 ngày OFF hoàn toàn — không xem chart, không news',
          'Monthly reset: 2–3 ngày OFF nếu drawdown > 5%',
          'Sleep: 7–8 giờ là KHÔNG THƯƠNG LƯỢNG. Thiếu ngủ = trade kém như say rượu',
        ],
      },
      {
        heading: '9. Trading Journal — Vũ khí #1 chống bias',
        body: 'Mỗi lệnh ghi chép 8 trường: (1) Setup name, (2) Entry/SL/TP, (3) Lý do entry, (4) Cảm xúc lúc vào, (5) Cảm xúc trong khi giữ, (6) Lý do exit, (7) Kết quả, (8) Bài học. Review 1 lần/tuần.',
        pitfall:
          'Đa số trader chỉ ghi entry/exit + P&L → vô dụng. Phải ghi CẢM XÚC và LÝ DO mới phát hiện bias lặp lại.',
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
    cover: coverIchimoku,
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
        body: 'Kumo Twist: Senkou A và B đổi chỗ trong tương lai → cảnh báo đảo chiều xu hướng dài hạn 26 phiên trước khi xảy ra (đặc tính dịch tiến của Senkou). Kumo Breakout: giá phá Mây sau giai đoạn tích lũy → tín hiệu vào lệnh mạnh, R:R cao.',
        bullets: [
          'Twist trong Kumo tương lai = "lá cờ cảnh báo" sớm nhất của Ichimoku',
          'Breakout: chờ 1 nến xác nhận đóng cửa hoàn toàn ngoài Mây',
          'Volume tại nến breakout phải ≥ 1.5× SMA20 volume',
        ],
        example:
          'BTC D1 10/2023: Kumo Twist xanh xuất hiện trong tương lai khi giá còn dưới Mây ở 28k. Sau 18 ngày, giá phá Mây tại 31k → entry BUY chuẩn, đạt 44k trong 5 tuần.',
      },
      {
        heading: '6. Chikou Span — "Quá khứ" xác nhận hiện tại',
        body: 'Chikou Span là giá đóng cửa hôm nay dịch lùi 26 phiên. Quy tắc: Chikou phải ở khoảng "trống" — không bị nến quá khứ cản → xác nhận xu hướng "trong sạch".',
        bullets: [
          'Chikou trên giá quá khứ + tách rời rõ → bullish strong',
          'Chikou dưới giá quá khứ + tách rời → bearish strong',
          'Chikou bị "kẹt" vào nến quá khứ → tín hiệu yếu, hoãn entry',
        ],
        pitfall:
          '90% trader bỏ qua Chikou — đây chính là "lá chắn" lọc fake breakout. Bộ Hosoda thiết kế Chikou để "double confirm" mọi setup.',
      },
      {
        heading: '7. TK Cross — Phân loại 3 cấp độ',
        body: 'Không phải mọi TK Cross đều giá trị như nhau. Phân loại theo vị trí so với Mây:',
        bullets: [
          'Strong Cross (cấp 1): Cross XẢY RA TRÊN Mây (cho BUY) — winrate ~75%',
          'Neutral Cross (cấp 2): Cross XẢY RA TRONG Mây — winrate ~55%, chờ confirm',
          'Weak Cross (cấp 3): Cross XẢY RA DƯỚI Mây — winrate ~35%, chỉ trade nếu có context khác mạnh',
        ],
      },
      {
        heading: '8. Hệ thống "Ichimoku Pure" — không cần chỉ báo khác',
        body: 'Quy trình 6 bước trade chuẩn Ichimoku Pure:',
        bullets: [
          '1. Xác định xu hướng D1 qua vị trí giá vs Mây',
          '2. Chuyển xuống H4: chờ TK Cross cùng chiều xu hướng D1',
          '3. Đếm 5/5 điều kiện (TK cross + trên/dưới Mây + Chikou + Mây tương lai)',
          '4. Entry tại nến đóng cửa xác nhận, SL dưới/trên Kijun-sen',
          '5. TP1 tại Mây tiếp theo, TP2 tại extension 1.618 swing trước',
          '6. Trail SL theo Kijun-sen: thoát khi giá đóng cửa qua Kijun',
        ],
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
  // ===================== PRO TRADER LESSONS =====================
  {
    slug: 'order-flow-footprint',
    category: 'Pro Trader',
    title: 'Order Flow & Footprint Chart — Đọc Dòng Lệnh Như Market Maker',
    excerpt:
      'Phân tích delta, imbalance, absorption và stacked imbalances trên footprint chart. Cách Bookmap/Sierra/ATAS hiển thị dòng lệnh thực và 7 setup pro thường dùng trên ES, NQ, BTC.',
    duration: '45 phút',
    level: 'Nâng cao',
    cover: coverOrderflow,
    intro:
      'Order Flow là việc đọc CHÍNH XÁC ai đang mua và ai đang bán tại từng mức giá — không phải đoán qua nến. Footprint chart hiển thị bid volume vs ask volume bên trong mỗi nến, cho phép bạn thấy được "dấu chân" của Big Money: họ đang absorb (hấp thụ) lệnh đối thủ, hay đang exhaust (kiệt sức)? Đây là layer cao cấp nhất của price action — thứ mà các prop trader ở Jane Street, Jump, Cumberland đều dùng.',
    history:
      'Footprint được Trevor Harnett (MarketDelta, 2003) phát minh sau khi CME chuyển từ pit trading sang điện tử (Globex). Trước đó trader dùng "tape reading" trên ticker giấy của Edwin Lefèvre (Reminiscences of a Stock Operator, 1923). Khi liquidity di chuyển vào order book, các nền tảng như Sierra Chart, ATAS, Bookmap và TradingView (footprint beta 2024) đã chuẩn hóa cách hiển thị bid×ask volume. Trong crypto, Tensor Charts và Exocharts là 2 công cụ hàng đầu cho BTC/ETH spot + perp.',
    sections: [
      {
        heading: '1. Bid Volume vs Ask Volume — Khái niệm gốc',
        body:
          'Mỗi giao dịch thực hiện cần 1 bên MARKET ORDER (chủ động) và 1 bên LIMIT ORDER (bị động). Khi market buy chạm vào limit sell tại ask → +1 cho ask volume. Khi market sell chạm limit buy tại bid → +1 cho bid volume. Footprint hiển thị 2 con số này tại MỖI mức giá trong nến.\n\nDelta = Ask Volume − Bid Volume. Delta dương → người mua chủ động hơn. Delta âm → người bán chủ động hơn. Nhưng delta KHÔNG đồng nghĩa với hướng giá — đây là điểm pro trader khác biệt với newbie.',
        bullets: [
          'Cumulative Delta (CVD) — tổng delta theo thời gian, dùng tìm divergence với giá',
          'Delta % = Delta / Total Volume × 100 — đo cường độ áp đảo',
          'Max Delta / Min Delta trong 1 nến — đo "intra-bar pressure"',
        ],
        example:
          'BTC nến H1 đỏ giảm $400 nhưng delta = +2,500 (mua chủ động lấn át). Đây là signal ABSORPTION — limit sellers đang hấp thụ tất cả lệnh mua. Khi sellers cạn, giá sẽ bật mạnh. Setup này đã hoạt động rất rõ tại đáy BTC $61,200 ngày 1/8/2024.',
        pitfall:
          'Không dùng delta thô mà bỏ qua bối cảnh. Delta +5,000 trên uptrend = bình thường (chase). Delta +5,000 sau khi giá giảm 2% và không break low = signal đảo chiều.',
      },
      {
        heading: '2. Imbalance — Mất cân bằng theo đường chéo',
        body:
          'Imbalance xuất hiện khi tại 1 mức giá, ask volume vượt bid volume ở mức giá CAO HƠN nó >300% (hoặc ngược lại — bid > ask của mức thấp hơn). Đây là dấu hiệu một bên đã "ăn sạch" liquidity và sẵn sàng đẩy giá tiếp.\n\nNgưỡng chuẩn ngành: 300% trên ES/NQ futures, 400% trên crypto (do volatility cao hơn). ATAS mặc định 200% — quá nhạy, hãy nâng lên.',
        bullets: [
          'Buy imbalance: ask[N] / bid[N-1] ≥ 3 → demand áp đảo',
          'Sell imbalance: bid[N] / ask[N+1] ≥ 3 → supply áp đảo',
          'Stacked Imbalances ≥ 3 mức liên tiếp = signal mạnh, vùng đó thành S/R',
          'Stacked ≥ 5 = institutional footprint, gần như chắc chắn quay lại test',
        ],
        example:
          'NQ trên timeframe 5m: 4 stacked buy imbalances liên tiếp tại 20,150–20,158 lúc mở cửa NY. Đây là vùng "được khẳng định" — pullback về đó là entry long với SL dưới 20,148. R:R thường đạt 4:1 vì có institutional flow đỡ.',
        pitfall:
          'Imbalance ở vùng low volume node (LVN) trên Volume Profile thường giả — không có liquidity nền. Chỉ tin imbalance xuất hiện tại HVN hoặc Value Area boundaries.',
      },
      {
        heading: '3. Absorption — Khi limit orders nuốt chửng market orders',
        body:
          'Absorption là PATTERN QUAN TRỌNG NHẤT trong order flow. Định nghĩa: volume rất lớn được giao dịch tại 1 mức giá nhưng giá KHÔNG di chuyển ra khỏi mức đó. Có nghĩa là lệnh limit ở phía đối diện đủ dày để "hấp thụ" mọi lệnh thị trường tấn công.\n\nDấu hiệu trên Footprint: 1 cell có volume gấp 5–10 lần các cell xung quanh, nến đóng cửa gần mức đó (râu dài về phía bị tấn công). Trên Bookmap: dải sáng đậm dày trên DOM tại level đó.',
        bullets: [
          'Buy Absorption (đáy): bid volume cực lớn, giá test xuống nhưng không phá → đảo chiều tăng',
          'Sell Absorption (đỉnh): ask volume cực lớn, giá test lên không phá → đảo chiều giảm',
          'Volume cluster + nến doji/pin bar = absorption signal mạnh nhất',
          'Confirm bằng CVD divergence: giá làm low mới nhưng CVD không',
        ],
        example:
          'ES futures 9/2024: tại 5,720 xuất hiện cell volume 18,000 contracts (trung bình 1,500/cell). Giá chạm 5,720 5 lần trong 30 phút mà không phá. CVD giảm dần (sellers exhausted). Long entry 5,722, SL 5,718, target 5,745 — chạm trong 90 phút.',
        pitfall:
          'Absorption ở giữa range = bẫy. Tín hiệu chỉ có giá trị ở EXTREMES (HVN của session, VWAP bands ±2σ, hoặc swing high/low rõ ràng).',
      },
      {
        heading: '4. Exhaustion — Khi market orders cạn kiệt',
        body:
          'Ngược với absorption, exhaustion là khi 1 bên ATTACK liên tục với volume LỚN nhưng giá di chuyển CÀNG LÚC CÀNG ÍT. Như đấm vào tường — lực còn nhưng tay đã mỏi.\n\nNhận diện: volume cao nhưng range nến co lại, delta dương lớn nhưng close gần open, bid/ask spread mở rộng (market makers rút lui).',
        bullets: [
          'Volume tăng + range giảm = climax (đỉnh hoặc đáy)',
          'Climax sau 3+ nến cùng hướng = setup đảo chiều cao xác suất',
          'Kết hợp với Wyckoff: SC (Selling Climax) hoặc BC (Buying Climax)',
        ],
      },
      {
        heading: '5. Cumulative Volume Delta (CVD) Divergence',
        body:
          'CVD = tích lũy delta từ đầu session. Nó đo "ai thắng" cuộc chiến market orders trong cả phiên. Khi giá tạo high mới mà CVD KHÔNG tạo high mới → bearish divergence. Mua chủ động yếu dần dù giá còn lên = thanh khoản đang được phân phối cho retail.',
        bullets: [
          'Bearish CVD divergence ở đỉnh range = setup short',
          'Bullish CVD divergence ở đáy range = setup long',
          'CVD perp vs CVD spot (crypto): divergence cho thấy ai đang đẩy giá thật sự',
          'Hidden divergence: giá làm HL nhưng CVD làm LL = strong continuation',
        ],
        example:
          'BTC 10/2024: giá làm HH $69,800 nhưng spot CVD đi ngang, perp CVD lập HH mạnh. Nghĩa là chỉ có leverage longs (perp) đẩy giá, spot không xác nhận. 18 giờ sau giá flush về $66,200.',
      },
      {
        heading: '6. POC trong nến và Volume Clusters',
        body:
          'POC (Point of Control) trong từng nến = mức giá có volume lớn nhất bên trong nến đó. Khi nhiều POC liên tiếp xếp ngang nhau → tạo "magnet level" — giá có xu hướng quay lại test. Khi POC dịch chuyển dần lên (rising POC) trong uptrend → trend khỏe.',
        bullets: [
          'POC migration up = trend bullish được xác nhận',
          'POC ở giữa nến = balance, ở đỉnh nến = exhaustion buyer, ở đáy = exhaustion seller',
          'Volume cluster (3+ POC cùng level) trở thành intraday support/resistance',
        ],
      },
      {
        heading: '7. Setup Pro: Iceberg Detection',
        body:
          'Iceberg order là lệnh limit khổng lồ chỉ hiển thị 1 phần nhỏ trên DOM, refresh liên tục khi bị ăn. Đây là dấu hiệu CHẮC CHẮN của institutional player. Phát hiện iceberg = cơ hội piggy-back theo họ.\n\nDấu hiệu: 1 level liên tục bị "đánh" mà bid/ask size hiển thị nhỏ nhưng volume traded tại đó cực lớn (>10x size hiển thị).',
        bullets: [
          'Bookmap heatmap: dải sáng "tái hiện" liên tục dù bị xuyên = iceberg refresh',
          'Footprint: cell volume 20× trung bình mà nến không phá level',
          'Strategy: vào lệnh CÙNG hướng iceberg, SL chỉ 1–2 tick phía sau iceberg level',
        ],
        example:
          'ES 5,650: iceberg buy phát hiện qua 8 lần refresh liên tiếp trong 20 phút, mỗi lần 200 contracts hiển thị nhưng đã ăn 4,800 thật. Long 5,651, SL 5,648, TP 5,672. Iceberg = "floor" không bị phá.',
        pitfall:
          'Spoofing: 1 số HFT đặt lệnh giả lớn rồi rút (illegal nhưng vẫn xảy ra). Cách lọc: iceberg THẬT sẽ có volume traded khớp; spoofing chỉ HIỂN THỊ size mà không có trade.',
      },
      {
        heading: '8. Công cụ và setup khuyên dùng',
        body:
          'Phần mềm chuyên: Bookmap (heatmap + DOM, $99–199/tháng), Sierra Chart (footprint chuyên sâu, $36/tháng), ATAS (Nga, mạnh footprint, $59/tháng), Exocharts (crypto, $40/tháng). Data feed: Rithmic/CQG cho futures (chính xác từng tick), Bybit/Binance WebSocket cho crypto.\n\nTradingView footprint mới (2024) hỗ trợ ES/NQ/CL/Gold + crypto top, đủ dùng cho retail.',
        bullets: [
          'Timeframe pro thường dùng: 30 second, 1 min, 5 min cho intraday futures',
          'Crypto: 1m–5m cho scalp, 15m cho swing',
          'Imbalance threshold: 300% futures, 400% crypto, 200% forex',
          'Cell aggregation: 0.25 ES, 0.25 NQ, 1 USD BTC, 0.1 ETH',
        ],
      },
    ],
    takeaways: [
      'Order flow đọc HÀNH ĐỘNG thực tại từng mức giá, không suy đoán qua nến',
      'Delta = ask vol − bid vol; CVD = tích lũy delta cả session',
      'Absorption: volume cao + giá không di chuyển = đảo chiều',
      'Stacked imbalances ≥3 = institutional footprint, vùng đó thành S/R bền',
      'Iceberg detection cho phép piggy-back theo Smart Money',
      'Luôn lọc tín hiệu order flow bằng bối cảnh (HVN/LVN, VWAP, session high/low)',
    ],
    checklist: [
      'Tôi đang ở khung 1m–5m phù hợp với footprint?',
      'Có HVN/Value Area Edge gần đây làm bối cảnh?',
      'Cell volume tại mức cần phân tích có gấp ≥5x trung bình?',
      'Delta có xác nhận hay phân kỳ với hướng nến?',
      'Stacked imbalances ≥ 3 đã hình thành chưa?',
      'CVD spot có xác nhận chuyển động giá perp (nếu crypto)?',
      'SL có đặt sau iceberg/absorption level (1–2 tick) không?',
    ],
    faqs: [
      {
        question: 'Tôi cần data feed gì để xem order flow?',
        answer:
          'Futures (ES/NQ/CL): cần CME bundle qua Rithmic ($35/tháng) hoặc CQG. Crypto: WebSocket trực tiếp Binance/Bybit/OKX là MIỄN PHÍ và chính xác hơn cả TradingView. Forex: KHÔNG có order flow đáng tin (decentralized) — chỉ Currency Futures (6E, 6J trên CME) mới có.',
      },
      {
        question: 'Order flow có dùng được trên crypto không?',
        answer:
          'CỰC TỐT trên perp (Bybit, Binance Futures) vì exchange tập trung. Spot khó hơn vì fragmented. Tensor Charts và Exocharts đã giải quyết bằng cách aggregate top 5 sàn.',
      },
      {
        question: 'Cần bao lâu để master order flow?',
        answer:
          'Tối thiểu 6 tháng học liên tục + 1,000+ giờ screen time với footprint. Đây là kỹ năng "muscle memory" — không thể học tắt. Bắt đầu chỉ với 1 cặp (ES hoặc BTC), 1 timeframe (1m), 1 setup (absorption tại HVN).',
      },
      {
        question: 'Có cần kết hợp với chỉ báo khác không?',
        answer:
          'CÓ — Volume Profile (xác định HVN/LVN), VWAP (anchor mean), Market Profile (TPO, IB). Tránh các indicator lagging (MA, MACD, RSI) vì sẽ làm bạn rối.',
      },
    ],
  },
  {
    slug: 'volume-profile-market-profile',
    category: 'Pro Trader',
    title: 'Volume Profile & Market Profile (TPO) — Auction Theory Toàn Tập',
    excerpt:
      'POC, Value Area, HVN/LVN, Volume Composite, TPO Initial Balance, Single Prints. Cách Steidlmayer xây Market Profile và 9 setup pro trên ES, NQ, CL, Gold, BTC.',
    duration: '50 phút',
    level: 'Nâng cao',
    cover: coverVolumeProfile,
    intro:
      'Volume Profile (VP) và Market Profile (MP/TPO) là 2 cách trực quan hóa AUCTION THEORY — nguyên lý cho rằng thị trường là cuộc đấu giá liên tục, di chuyển từ vùng thiếu cân bằng sang vùng cân bằng. Đây là framework PRO duy nhất giúp bạn biết: vùng nào institutional THỰC SỰ tham gia, vùng nào chỉ là "fluff" của retail.',
    history:
      'J. Peter Steidlmayer (CBOT, 1984) phát minh Market Profile khi CBOT cần cách giúp non-pit trader hiểu giao dịch trong pit. Ông dùng chữ cái A–Z (TPO = Time Price Opportunity) để mark mỗi 30 phút giá xuất hiện ở đâu. Sau này Don Jones, Jim Dalton (Mind Over Markets, 1993) phổ biến hóa. Volume Profile là phiên bản tiến hóa: dùng VOLUME thay vì TIME — phù hợp hơn với electronic markets. Sierra Chart, Bookmap, ATAS, TradingView Premium đều hỗ trợ.',
    sections: [
      {
        heading: '1. Auction Theory — Nền tảng triết lý',
        body:
          'Thị trường có 2 trạng thái: BALANCE (cân bằng — giá dao động trong range, buyer = seller) và IMBALANCE (mất cân bằng — trending, một bên áp đảo). Mục đích của auction là tìm "fair value" — mức giá mà cả 2 bên đồng ý giao dịch nhiều nhất.\n\n80% thời gian thị trường ở balance. 20% là imbalance (trend). Pro trader ăn tiền lớn ở giai đoạn TRANSITION giữa hai trạng thái này.',
        bullets: [
          'Balance → range trade (fade extremes)',
          'Imbalance → trend trade (breakout, momentum)',
          'Transition (rotation → directional) = setup R:R cao nhất',
        ],
      },
      {
        heading: '2. Volume Profile — Anatomy',
        body:
          'VP plot phân bố volume theo TRỤC GIÁ (ngang) thay vì trục thời gian (dọc). Các thành phần chính:\n\n• POC (Point of Control): mức giá có volume lớn nhất — "fair value" của period đó\n• VAH (Value Area High) & VAL (Value Area Low): biên trên/dưới của Value Area chứa 70% tổng volume\n• HVN (High Volume Node): cụm volume lớn — vùng "magnet", giá trở lại nhiều lần\n• LVN (Low Volume Node): "khoảng trống" — giá chạy nhanh qua vì ít liquidity',
        bullets: [
          'Value Area 70% = 1 standard deviation của distribution (giả định normal)',
          'POC trở thành S/R cực mạnh ở session sau',
          'Naked POC (POC chưa được test lại) = magnet, 80% sẽ được test trong 5 ngày',
          'LVN giữa 2 HVN = "barrier" — phá qua = setup continuation mạnh',
        ],
        example:
          'ES daily: POC hôm trước 5,680, VAH 5,705, VAL 5,665. Sáng nay open 5,690 (trong VA). Giá giảm chạm VAL 5,665 → bounce mạnh (VAL = institutional bid). Long 5,667 SL 5,660 TP POC 5,680 → +13 ticks ($162.50/contract).',
        pitfall:
          'Dùng VP của period quá ngắn (vài giờ) cho intraday — không đủ data. Tối thiểu 1 ngày RTH cho ES, 1 tuần cho crypto.',
      },
      {
        heading: '3. Profile Shapes — 5 dạng cốt lõi',
        body:
          'Hình dạng VP/TPO tiết lộ trạng thái auction. Pro trader phân loại nhanh để chọn chiến lược:',
        bullets: [
          'D-Profile (Normal/Balanced): chuông đối xứng → balance, fade extremes',
          'P-Profile (P-shape): bulge ở trên → short covering rally, thường thất bại — fade từ trên',
          'b-Profile: bulge ở dưới → long liquidation, thường bottom — buy từ dưới',
          'B-Profile (Double Distribution): 2 bulge, LVN ở giữa → trending day, vào theo break LVN',
          'Trend Day / Thin Profile: kéo dài 1 chiều, ít overlap → momentum, không fade',
        ],
        example:
          'NQ ngày 5/11/2024 (post-election): B-profile rõ rệt với 2 distribution 20,400 và 20,800, LVN 20,600. Phá 20,600 → giá lao thẳng đến distribution 2. Long 20,605 SL 20,580 TP 20,790 = R:R 7:1.',
      },
      {
        heading: '4. Market Profile (TPO) — Khác gì VP?',
        body:
          'MP dùng THỜI GIAN (mỗi TPO = 30 phút), VP dùng VOLUME. MP cho biết "giá ở mức nào BAO LÂU" → đo "acceptance". VP cho biết "giá nào được giao dịch BAO NHIÊU" → đo "interest".\n\nMP có khái niệm độc đáo:\n• IB (Initial Balance): range của 60 phút đầu phiên — định khung đầu cho institutional\n• IB Extension: phá IB → directional day\n• Single Prints: chỉ 1 chữ cái xuất hiện ở 1 mức → "gap" trong TPO, magnet cao\n• Poor High / Poor Low: nhiều TPO chạm cùng đỉnh/đáy mà không vượt → unfinished business, sẽ test lại',
        bullets: [
          'IB lớn (>50% range trung bình) → range day, fade IB highs/lows',
          'IB nhỏ → khả năng cao trend day, vào theo break',
          'Range Extension lên + xuống cùng ngày = neutral day (rotation)',
          'Single prints sẽ được "lấp" trong 3–5 phiên',
        ],
      },
      {
        heading: '5. Volume Composite — VP cho khung lớn',
        body:
          'Composite Profile = gộp VP nhiều ngày/tuần/tháng để xác định KEY LEVELS dài hạn. Đây là "bản đồ" mà Smart Money dùng cho swing trades.',
        bullets: [
          'Composite tuần: dùng cho daytrade khung 5–15m',
          'Composite tháng: dùng cho swing khung H1–H4',
          'Composite năm: dùng cho position khung daily',
          'HVN dài hạn = institutional accumulation/distribution zone',
        ],
        example:
          'BTC composite Q3 2024: HVN lớn nhất 64,800 (3 tuần consolidation). Khi giá phá xuống 62k và bounce về 64,800 → đó chính là VWAP của Smart Money buy zone, R:R 5:1 nếu long với SL 64,200.',
      },
      {
        heading: '6. Setup Pro 1: Open Drive vs Open Auction',
        body:
          '15–30 phút đầu phiên là quan trọng nhất. Pro phân loại:\n\n• Open Drive: giá lập tức bứt khỏi yesterday range, không pull back → trend day, đu theo\n• Open Test Drive: test 1 hướng rồi reverse → đảo chiều mạnh, fade test extreme\n• Open Auction in Range: dao động trong yesterday VA → balance day, fade VAH/VAL\n• Open Auction out of Range: open ngoài VA nhưng accept lại → expand range mới',
        example:
          'ES 9:30 EST mở $5,720 (above VAH $5,710 hôm trước). 10:00 quay vào VA → Open Auction Out of Range failed → short rotation về POC $5,690. Setup ngắn 30 ticks.',
      },
      {
        heading: '7. Setup Pro 2: VAH/VAL Rejection',
        body:
          'Khi giá test VAH (hoặc VAL) lần đầu trong phiên → high probability rejection vì đó là biên acceptance. 70% thời gian giá quay về POC sau khi test edge.\n\nXác suất tăng nếu: (1) test với volume thấp dần (exhaustion), (2) có absorption candle, (3) HTF (H4/D1) ở vùng tương ứng.',
        bullets: [
          'Entry: ngay sau pin bar/engulfing tại VAH/VAL',
          'SL: 1 ATR(14) bên ngoài VAH/VAL',
          'TP1: POC, TP2: opposite VA edge',
          'Skip nếu IB extension đã >2× IB (trend mode đã xác lập)',
        ],
      },
      {
        heading: '8. Setup Pro 3: Failed Auction (Excess vs No Excess)',
        body:
          'Excess = đỉnh/đáy có "tail dài" trên TPO (single prints liên tiếp) — institutional rejection mạnh, ÍT khả năng test lại. No Excess = đỉnh/đáy "thẳng" không có tail — UNFINISHED, giá sẽ test lại.\n\nPro short trên No Excess high vào ngày sau, long trên No Excess low.',
        example:
          'CL crude oil: hôm trước high $74.20 không có excess (3 TPO chạm đều đặn). Hôm sau giá test lại $74.15 và reject → short $74.10 SL $74.40 TP $73.50, hit trong 4 giờ.',
      },
      {
        heading: '9. Setup Pro 4: Composite POC Magnet',
        body:
          'Khi giá đi xa khỏi composite POC tuần/tháng > 2 ATR(20) mà không có catalyst mới → Magnet effect. Mean reversion về POC trong 3–7 phiên.\n\nĐây là setup ưa thích của hedge fund vì high probability + R:R rõ ràng.',
        pitfall:
          'KHÔNG dùng setup này khi có macro event (FOMC, NFP, CPI) trong 24h — catalyst sẽ override mean reversion.',
      },
    ],
    takeaways: [
      'Auction theory: thị trường tìm fair value, di chuyển giữa balance ↔ imbalance',
      'POC = giá có volume lớn nhất; VA = 70% volume; HVN/LVN = magnet/gap',
      'Profile shapes (D, P, b, B, Trend) cho biết chiến lược nên dùng',
      'IB và Single Prints chỉ có ở Market Profile (TPO), không có ở Volume Profile',
      'Composite Profile xác định key levels dài hạn cho swing',
      'Naked POC có 80% xác suất test lại trong 5 ngày',
    ],
    checklist: [
      'Đã xác định hôm nay là Trend Day hay Range Day chưa?',
      'POC, VAH, VAL hôm trước ở đâu?',
      'Có Naked POC nào chưa test trong 5 ngày qua?',
      'IB đã hình thành chưa, lớn hay nhỏ so với 20 ngày?',
      'Composite POC tuần đang ở mức nào, distance hiện tại?',
      'Profile shape phiên hiện tại là gì (D/P/b/B/Trend)?',
      'Có Single Prints chưa lấp gần đây không?',
    ],
    faqs: [
      {
        question: 'VP hay MP — nên dùng cái nào?',
        answer:
          'Cả hai bổ sung cho nhau. VP cho thấy WHERE volume xảy ra (microstructure). MP cho thấy WHEN/HOW LONG giá ở đó (acceptance). Pro thường overlay cả hai trên 1 chart. Nếu chỉ chọn 1 cho crypto → VP (vì crypto 24/7, TPO 30 phút mất ý nghĩa).',
      },
      {
        question: 'Value Area có phải lúc nào cũng là 70% không?',
        answer:
          'Mặc định 70% (1 standard deviation). Bạn có thể đổi 68% (theo CBOT chuẩn) hoặc 80% cho chiến lược conservative. Đừng đổi liên tục — phải nhất quán.',
      },
      {
        question: 'VP cho session nào trên crypto khi không có RTH?',
        answer:
          'Crypto thường dùng "UTC daily" (00:00–24:00 UTC) hoặc "weekly" (Sun 00:00 UTC). Một số trader dùng session theo region: Asia (00–08 UTC), London (08–16), NY (13–21). Test trên backtest để chọn — BTC phản ứng tốt với weekly profile hơn daily.',
      },
      {
        question: 'Anchored VWAP có thay được Volume Profile không?',
        answer:
          'KHÔNG — chúng đo 2 thứ khác nhau. VWAP cho mean của volume theo thời gian. VP cho phân bố volume theo giá. Pro dùng cả hai: VWAP làm anchor, VP để tìm điểm vào.',
      },
    ],
  },
  {
    slug: 'liquidity-ict-concepts',
    category: 'Pro Trader',
    title: 'Liquidity & ICT Concepts — Smart Money Hunt Stop Như Thế Nào',
    excerpt:
      'Liquidity pools, FVG, IFVG, Breaker Block, Mitigation, OTE, PD Array, Killzones, Silver Bullet. Hệ thống ICT đầy đủ của Michael Huddleston cho Forex/Indices/Crypto.',
    duration: '55 phút',
    level: 'Nâng cao',
    cover: coverIct,
    intro:
      'ICT (Inner Circle Trader) là framework do Michael J. Huddleston phát triển từ kinh nghiệm 30 năm trading interbank forex. Cốt lõi: Smart Money (banks, hedge funds) cần LIQUIDITY để fill lệnh khổng lồ — họ chủ động "săn" stop loss của retail để tạo liquidity. Bài này hệ thống hóa 12 concepts ICT quan trọng nhất, áp dụng cho Forex, Indices (NAS100, US30) và Crypto.',
    history:
      'Michael Huddleston từng là junior trader tại sàn forex, học từ Larry Williams và tape reading của Richard Wyckoff. Ông tổng hợp khái niệm "liquidity engineering" từ 1996, công bố public 2010 trên YouTube với mentorship 2016–2022. Mặc dù gây tranh cãi (nhiều cáo buộc cherry-pick), framework ICT đã ảnh hưởng đến cả thế hệ prop trader, đặc biệt FTMO/MyForexFunds passers.',
    sections: [
      {
        heading: '1. Liquidity là gì và ở đâu',
        body:
          'Liquidity = pending orders (stop losses + breakout buys/sells) tích tụ tại các mức giá rõ ràng. Smart Money cần liquidity vì họ giao dịch size lớn — không thể fill mà không "đánh động" thị trường. Họ chủ động đẩy giá đến vùng liquidity để fill, sau đó đảo chiều thật sự.\n\nVùng liquidity điển hình: trên equal highs (buy stops), dưới equal lows (sell stops), trên/dưới swing high/low rõ ràng, trên trendline (trendline liquidity).',
        bullets: [
          'Buy Side Liquidity (BSL): trên equal highs, swing highs — chứa buy stops của shorts',
          'Sell Side Liquidity (SSL): dưới equal lows, swing lows — chứa sell stops của longs',
          'Trendline Liquidity: dưới đường nối swing lows trong uptrend',
          'Asia Range Liquidity: high/low của Asia session — bị quét trong London',
        ],
        example:
          'EURUSD có 3 đỉnh equal tại 1.0850. Đây là cluster buy stops khổng lồ. Smart Money đẩy giá lên 1.0852 (quét stops), drop mạnh 80 pips về 1.0770. Đây là Liquidity Sweep + Reversal — pattern ICT signature.',
      },
      {
        heading: '2. Fair Value Gap (FVG) / Imbalance',
        body:
          'FVG = vùng giá mà thị trường di chuyển QUÁ NHANH, để lại "khoảng trống" không được giao dịch đầy đủ. Nhận diện qua 3 nến: nếu wick của nến 1 không overlap với wick nến 3 → khoảng giữa = FVG (bullish hoặc bearish).\n\nFVG là magnet — giá có xu hướng quay lại "fill" (lấp đầy) FVG để rebalance liquidity. Đây là vùng entry pro thường dùng.',
        bullets: [
          'Bullish FVG: low của nến 3 > high của nến 1 → vùng [high nến 1, low nến 3] = demand zone',
          'Bearish FVG: high của nến 3 < low của nến 1 → vùng [high nến 3, low nến 1] = supply zone',
          'IFVG (Inverted FVG): FVG bị phá hoàn toàn → đảo vai trò support/resistance',
          'BPR (Balanced Price Range): 2 FVG ngược chiều chồng lên nhau → vùng cực mạnh',
        ],
        example:
          'NAS100 H1: bullish FVG hình thành 19,800–19,830 sau impulse mạnh. 2 ngày sau giá pullback chạm 19,825 → bounce mạnh +200 điểm. Long 19,827 SL 19,790 TP 20,030.',
        pitfall:
          'KHÔNG phải FVG nào cũng được fill. FVG ngược trend lớn (HTF) thường giữ lâu. FVG cùng trend HTF có khả năng fill cao hơn.',
      },
      {
        heading: '3. Order Block (OB) & Breaker Block',
        body:
          'Order Block = nến cuối cùng NGƯỢC HƯỚNG trước impulse mạnh. Đó là nơi institutional đã đặt lệnh limit cuối cùng trước khi đẩy giá. Khi giá quay về OB → high probability bounce.\n\nBreaker Block = OB bị "phá" và sau đó được test lại từ phía ngược. Ví dụ: bearish OB bị break lên trên (giá tăng vượt) → khi giá quay xuống test, OB đó trở thành SUPPORT.',
        bullets: [
          'Bullish OB: nến đỏ cuối trước impulse tăng mạnh',
          'Bearish OB: nến xanh cuối trước impulse giảm mạnh',
          'OB chỉ valid khi nó tạo BOS (Break of Structure)',
          'Mitigated OB = đã được test và phản ứng → giảm độ tin cậy',
          'Unmitigated OB = chưa test → setup chính của ICT',
        ],
        example:
          'BTC H4: bearish OB tại 68,500–68,800 (nến xanh trước drop về 64k). 5 ngày sau giá hồi 68,650 → reject mạnh, drop 4k. Short setup hoàn hảo với SL trên 68,850.',
      },
      {
        heading: '4. PD Array — Premium & Discount',
        body:
          'ICT chia mọi range thành 2 nửa qua đường EQ (Equilibrium = 50% Fibonacci):\n• Premium (50–100%): vùng "đắt" → chỉ short\n• Discount (0–50%): vùng "rẻ" → chỉ long\n\nKhi giá trade ở Premium của HTF range → tìm setup short. Ở Discount → tìm setup long. Đây là filter cực mạnh để loại 70% setup tệ.',
        bullets: [
          'OTE Zone (Optimal Trade Entry): Fibonacci 0.618–0.79 trong discount/premium',
          'Sweet spot ICT: 0.705 (giữa 0.618 và 0.79)',
          'Kết hợp OTE + FVG + OB cùng vùng = "triple confluence"',
        ],
      },
      {
        heading: '5. Market Structure — BOS vs CHoCH (MSS)',
        body:
          'BOS (Break of Structure) = giá phá swing high/low cùng hướng trend hiện tại → trend tiếp diễn.\nCHoCH (Change of Character) hay MSS (Market Structure Shift) = giá phá swing NGƯỢC trend → đảo chiều.\n\nQuy tắc ICT: chờ MSS trên LTF (M5/M15) để confirm reversal đã start trên HTF (H1/H4). Đây là "trigger" để vào lệnh.',
        bullets: [
          'BOS bullish: phá swing high gần nhất',
          'CHoCH bullish: phá swing high của downtrend leg → đảo chiều lên',
          'MSS thường đi kèm với FVG mới — đó là entry zone lý tưởng',
        ],
        example:
          'GBPUSD downtrend H1. M5 hình thành CHoCH lên trên (phá micro high). Một bullish FVG hình thành ngay sau CHoCH tại 1.2680. Long 1.2682 SL 1.2670 TP 1.2730 = 4R.',
      },
      {
        heading: '6. Killzones — Thời điểm vàng của Smart Money',
        body:
          'Smart Money active nhất tại các "killzone" (giờ NY):\n• Asian Killzone: 20:00–00:00 (range building)\n• London Killzone: 02:00–05:00 (high volatility, sweep Asia)\n• NY Killzone AM: 07:00–10:00 (sweep London, set day direction)\n• London Close: 10:00–12:00 (reversal frequent)\n• NY PM: 13:30–16:00 (continuation hoặc fade)\n\nSilver Bullet: 10:00–11:00 NY — 1 setup trong 1 giờ, cực high probability theo ICT.',
        bullets: [
          'Trade trong killzone, KHÔNG trade dead hours',
          'Mỗi killzone có 1 "purpose" riêng (sweep, expand, reverse)',
          'Silver Bullet: chỉ trade FVG đầu tiên hình thành sau 10:00 NY',
        ],
      },
      {
        heading: '7. Liquidity Sweep & Stop Hunt',
        body:
          'Pattern ICT classic: giá quét NGOÀI swing high/low (lấy liquidity) → quay đầu mạnh ngược lại. Đây là "fingerprint" của Smart Money.\n\nNhận diện: nến quét vượt level X pip nhưng đóng cửa quay lại bên trong (long wick). Volume thường spike.',
        bullets: [
          'Sweep + MSS trên LTF = setup A+ của ICT',
          'Stop hunt thường xảy ra trước news (CPI, NFP) 5–15 phút',
          'Asia high/low bị sweep trong London 80% thời gian',
        ],
        example:
          'XAUUSD ngày NFP: 8:25 NY (5 phút trước số liệu) sweep low Asia 2,640 xuống 2,637 → reverse mạnh lên 2,665 sau news. Setup long từ 2,640 sau sweep, SL 2,635, TP 2,665 = 5R trong 90 phút.',
      },
      {
        heading: '8. Power of 3 (PO3) / AMD',
        body:
          'Mỗi phiên/ngày/tuần thường theo cấu trúc 3 pha:\n• Accumulation: range hẹp đầu phiên (Asia)\n• Manipulation: sweep ngược hướng thật (London open)\n• Distribution: di chuyển hướng thật (NY session)\n\nPro trader đợi pha Manipulation (sweep liquidity) rồi vào ngược hướng sweep — đó là pha Distribution thật.',
        example:
          'EURUSD: Asia range 1.0820–1.0840. London 02:00 sweep xuống 1.0810 (manipulation). NY 08:00 reverse lên 1.0890 (distribution). Long 1.0815 sau sweep, SL 1.0800, TP 1.0880 = 4R.',
      },
      {
        heading: '9. Daily Bias — Xác định hướng ngày',
        body:
          'Trước mỗi ngày, ICT trader xác định "bias" (hướng) bằng:\n• Vị trí giá so với HTF PD Array (Premium/Discount H4–D1)\n• Liquidity nào còn unmitigated trên HTF\n• Trạng thái PO3 hôm trước\n• News risk\n\nBias đúng → tránh fade trend, chỉ trade theo hướng. Bias sai → cắt lỗ nhanh, không gồng.',
        bullets: [
          'Bullish bias: giá ở Discount HTF + có BSL phía trên unmitigated',
          'Bearish bias: giá ở Premium HTF + có SSL phía dưới unmitigated',
          'Neutral: balanced PD, cả 2 phía đều có liquidity → trade range',
        ],
      },
    ],
    takeaways: [
      'Smart Money cần liquidity → săn stop loss retail là behavior thường ngày',
      'FVG là magnet — giá có xu hướng quay lại fill imbalance',
      'OB và Breaker Block là vùng institutional đặt lệnh limit',
      'PD Array (Premium/Discount) là filter quan trọng nhất — đừng buy Premium, đừng sell Discount',
      'CHoCH/MSS trên LTF xác nhận reversal → trigger entry',
      'Killzones (London, NY AM, Silver Bullet) là khung giờ Smart Money active',
      'Power of 3: Accumulation → Manipulation → Distribution là cấu trúc ngày phổ biến',
    ],
    checklist: [
      'Đã xác định Daily Bias (bullish/bearish/neutral) chưa?',
      'Giá đang ở Premium hay Discount của HTF range?',
      'Có FVG hoặc OB unmitigated trên HTF gần entry?',
      'Có liquidity sweep gần đây làm trigger?',
      'CHoCH/MSS đã hình thành trên LTF (M5–M15)?',
      'Đang trong killzone (London, NY AM, Silver Bullet)?',
      'SL có đặt sau swing/OB an toàn (ít nhất 1 ATR)?',
      'R:R tối thiểu 3:1 từ entry đến TP1?',
    ],
    faqs: [
      {
        question: 'ICT có hoạt động trên crypto không?',
        answer:
          'CÓ, nhưng cần điều chỉnh killzones theo UTC. BTC active nhất 13:00–21:00 UTC (NY session) và 08:00–12:00 UTC (London). FVG và OB hoạt động tốt vì crypto có nhiều institutional flow (Cumberland, Galaxy, hedge funds). Tránh trade weekend — liquidity quá mỏng.',
      },
      {
        question: 'ICT có phải scam không?',
        answer:
          'Framework có giá trị thật (liquidity, FVG, OB là khái niệm chuẩn ngành). Nhưng cách Huddleston cherry-pick examples và mentorship đắt đỏ ($5,000+) bị chỉ trích nhiều. Học miễn phí từ YouTube series 2016–2022 là đủ — không cần mua mentorship.',
      },
      {
        question: 'Tôi nên dùng ICT trên timeframe nào?',
        answer:
          'HTF analysis: D1 → H4 → H1. LTF execution: M15 → M5 → M1. Bias trên HTF, entry trên LTF. KHÔNG trade ICT trên M1 nếu chưa có 1,000+ giờ screen time — quá nhiều noise.',
      },
      {
        question: 'OTE 0.705 vs Fibonacci truyền thống 0.618 — khác nhau?',
        answer:
          'ICT thích 0.705 (giữa 0.618 và 0.79) vì test backtest cho thấy đó là sweet spot giữa "vào sớm" (0.618) và "an toàn" (0.79). Bạn có thể dùng cả range 0.62–0.79 thay vì 1 mức cứng.',
      },
    ],
  },
  {
    slug: 'options-flow-gamma-exposure',
    category: 'Pro Trader',
    title: 'Options Flow & GEX — Bí Mật Dealer Hedging Trên SPX/NDX',
    excerpt:
      'Gamma Exposure (GEX), Vanna, Charm, Dealer Positioning, Max Pain, 0DTE flow, Charm dump. Hiểu cách MM hedge để dự đoán SPX/NDX/QQQ — framework SpotGamma & SqueezeMetrics.',
    duration: '50 phút',
    level: 'Nâng cao',
    cover: coverGex,
    intro:
      'Sau 2020, options chiếm hơn 50% volume danh nghĩa của S&P 500 (theo Goldman Sachs research 2024). 0DTE (zero days to expiry) chiếm 50% volume options SPX hằng ngày. Điều này nghĩa là SPX/NDX không còn được "định giá" bởi spot flow — mà bởi DEALER HEDGING. Hiểu Gamma Exposure (GEX), Vanna, Charm là cách duy nhất để dự đoán intraday move của indices Mỹ trong môi trường hậu COVID.',
    history:
      'Khái niệm Gamma Exposure được Cem Karsan (Kai Volatility) và SpotGamma (2018+) phổ biến hóa cho retail. Trước đó chỉ có hedge fund options desk dùng. SqueezeMetrics (2017) công bố nghiên cứu "Dark Index" và GEX công khai. Sự kiện COVID 3/2020 và meme stocks 1/2021 (GME, AMC) chứng minh sức mạnh của gamma squeeze. Từ 2023, 0DTE flow trở thành driver chính của intraday SPX move (JP Morgan QDS report).',
    sections: [
      {
        heading: '1. Greeks cốt lõi: Delta, Gamma, Vega, Theta, Vanna, Charm',
        body:
          'Để hiểu dealer hedging, bạn cần grasp 6 greeks:\n• Delta: thay đổi giá option theo $1 thay đổi underlying. Long call delta 0–1, long put -1–0.\n• Gamma: thay đổi delta theo $1 thay đổi underlying — đo "convexity"\n• Vega: thay đổi giá option theo 1% thay đổi IV\n• Theta: thay đổi giá option theo 1 ngày trôi qua\n• Vanna: thay đổi delta theo IV (cross-greek vol-spot)\n• Charm: thay đổi delta theo thời gian (delta decay)',
        bullets: [
          'Pro trader đọc dealer book qua aggregate gamma/vanna/charm exposure',
          'Gamma quan trọng nhất cho intraday',
          'Vanna và Charm quan trọng cho overnight/multi-day move',
        ],
      },
      {
        heading: '2. Dealer Positioning — Ai short, ai long gamma?',
        body:
          'Market makers (dealers) là COUNTERPARTY của retail. Khi retail mua call → dealer SHORT call → dealer phải hedge bằng cách MUA underlying. Khi retail bán put (premium income strategies) → dealer LONG put → dealer cũng MUA underlying để hedge.\n\nNet position của dealer thường: SHORT GAMMA (bán options ròng cho retail) vào market top, LONG GAMMA vào market bottom hoặc khi retail mua puts panic.',
        bullets: [
          'Long Gamma dealer → SELL high, BUY low → giảm volatility (volatility suppression)',
          'Short Gamma dealer → BUY high, SELL low → tăng volatility (volatility expansion)',
          'GEX = aggregate dealer gamma exposure (positive = long gamma, negative = short)',
        ],
        example:
          'SPX GEX +$5B (long gamma): SPX dao động trong range 30 điểm cả ngày. Dealer mua dip bán rip → mean reversion. Đây là "pinned market".\n\nSPX GEX −$3B (short gamma): SPX move 80 điểm mỗi phiên với 2 directional swings. Dealer chase market → momentum amplification.',
      },
      {
        heading: '3. Gamma Flip Level (Zero Gamma) — "Đường ranh giới"',
        body:
          'Mức giá mà dealer chuyển từ long gamma sang short gamma = Zero Gamma Level (hay Gamma Flip). Trên mức đó: long gamma → mean reverting. Dưới: short gamma → momentum. Mức này thay đổi mỗi ngày nhưng SpotGamma/Tier1Alpha công bố hằng ngày.',
        bullets: [
          'SPX > Zero Gamma: vol suppressed, range-bound',
          'SPX < Zero Gamma: vol expanded, trending',
          'Cross qua Zero Gamma = setup change of regime, breakout',
          'Distance đến Zero Gamma = magnet (giá thường về test)',
        ],
        example:
          'Tháng 8/2024: SPX zero gamma 5,300. Khi SPX giảm dưới 5,300 ngày 5/8, vol bùng nổ — VIX nhảy từ 16 lên 65 (yen carry trade unwind). Dealers bị forced sell theo. Cross zero gamma = signal sớm regime change.',
      },
      {
        heading: '4. Max Pain & Open Interest Walls',
        body:
          'Max Pain = strike option mà aggregate option holders LỖ NHẤT khi expiry — đồng thời là mức dealer LÃI nhất. Có lý thuyết (gây tranh cãi) rằng giá có xu hướng "trôi" về max pain vào ngày OPEX (option expiration).\n\nReal value: Open Interest (OI) walls — strikes có OI cực lớn → trở thành magnet/barrier vì dealer hedging tập trung tại đó.',
        bullets: [
          'OPEX dates: 3rd Friday mỗi tháng, mạnh nhất Q-end (Mar/Jun/Sep/Dec)',
          'Call wall lớn = resistance, Put wall lớn = support',
          'Distance từ spot đến wall < 1% → giá có xu hướng pin',
          'OPEX week thường low vol, post-OPEX (Mon-Tue) có "vol expansion"',
        ],
      },
      {
        heading: '5. Vanna & Charm Flow — Điều khiển trend dài hạn',
        body:
          'Vanna: delta tăng/giảm theo IV. Khi VIX giảm (fear giảm) → calls trở nên ITM-er → dealer mua thêm để hedge → giá lên thêm. Đây là FEEDBACK LOOP "Vanna Rally" classic vào quý 4 (window dressing + IV crush).\n\nCharm: delta decay theo thời gian. OTM calls/puts mất delta khi gần expiry → dealer unhedge → bán underlying (nếu net long calls) → "charm dump" vào chiều thứ Sáu OPEX.',
        bullets: [
          'Vanna flow positive: VIX giảm → dealer buy SPX (Q4 rally classic)',
          'Charm flow negative: thứ 4–thứ 6 OPEX week, dealer sell SPX nhẹ',
          'Vanna unwind: khi VIX spike → dealer sell SPX panic (positioning unwind)',
        ],
        example:
          'Q4 2023: VIX giảm từ 22 xuống 12 (Oct→Dec). SPX tăng từ 4,100 lên 4,800 — phần lớn là vanna flow. Khi IV ở mức thấp như vậy, mọi sự tăng IV nhẹ đều gây mean reversion (Q1 2024 đầu năm pullback nhẹ).',
      },
      {
        heading: '6. 0DTE Flow — Game changer hậu 2022',
        body:
          '0DTE (zero days to expiry) options expire trong vòng 24h. Hiện chiếm 50% volume SPX options. Tác động cực lớn lên intraday vì:\n• Gamma cực cao gần ATM (ngày T)\n• Dealer phải hedge cực nhanh → magnify intraday move\n• Charm decay cực nhanh trong ngày → afternoon flow predictable',
        bullets: [
          '0DTE call buying retail → dealer buy SPX → tăng intraday momentum',
          '0DTE put selling (covered) → dealer hedge calmer → suppress vol',
          '0DTE volume spike sau 14:00 NY = "afternoon gamma squeeze"',
          'Max gamma strike intraday = magnet đến close',
        ],
        example:
          '8/3/2024: SPX mở 5,150, 0DTE call wall lớn 5,180. Suốt ngày SPX climb đều đến 5,178 lúc 15:55 NY (5 phút trước close). Dealer hedge buy đẩy lên — pin near wall.',
      },
      {
        heading: '7. Dark Pool Index (DIX) & Hidden Orders',
        body:
          'DIX (Dark Pool Index) đo % volume giao dịch ở dark pools (institutional venues, không hiển thị public). DIX cao → institutional accumulating quietly → bullish forward 1–2 tuần. DIX thấp → distributing → bearish.\n\nSqueezeMetrics công bố DIX hằng ngày miễn phí. Đây là 1 trong vài leading indicator đáng tin.',
        bullets: [
          'DIX > 45% trong 3 ngày liên tiếp → bullish setup 5–10 ngày',
          'DIX < 38% liên tục → distribution signal',
          'GEX + DIX combination: GEX âm + DIX cao = bullish reversal sớm',
        ],
      },
      {
        heading: '8. Setup Pro: GEX Regime Trading',
        body:
          'Strategy framework dựa trên gamma regime:\n\n• Positive GEX > $3B: SHORT IRON CONDOR / sell strangles (vol suppressed)\n• Positive GEX nhỏ ($0–3B): TREND day theo VWAP\n• Negative GEX: LONG STRADDLE / buy options (vol expanding)\n• Cross zero gamma: directional bet theo direction phá\n\nMỗi regime đòi hỏi position sizing khác nhau. Negative GEX → giảm size 50% vì swing rộng.',
      },
      {
        heading: '9. Công cụ và data sources',
        body:
          'Chuyên nghiệp: SpotGamma ($99/tháng — best UI), Tier1Alpha ($149 — institutional grade), Menthor Q ($99 — VN cũng dùng), Unusual Whales ($60/tháng — flow alert).\n\nFree: SqueezeMetrics DIX (miễn phí), CBOE GEX (delayed), TradingView gamma indicator (community).\n\nData feed cần: OPRA (options) — qua Polygon ($199/tháng) hoặc Tradier free tier.',
      },
    ],
    takeaways: [
      'Hậu 2020, dealer hedging là driver chính của SPX/NDX intraday',
      'GEX dương → vol suppressed; GEX âm → vol expanded',
      'Zero Gamma Level là "regime boundary" — cross qua = breakout signal',
      'Vanna flow điều khiển trend Q4 (year-end rally classic)',
      'Charm dump xảy ra chiều thứ 6 OPEX khi delta decay',
      '0DTE chiếm 50% volume SPX options → magnify intraday move',
      'DIX là leading indicator institutional accumulation đáng tin',
      'Max gamma strike intraday = magnet đến close',
    ],
    checklist: [
      'GEX hiện tại dương hay âm, magnitude bao nhiêu?',
      'Zero Gamma Level hôm nay ở đâu?',
      'Distance từ spot đến nearest call/put wall lớn?',
      'Có OPEX trong tuần không? (Friday 3rd)',
      'VIX trend (vanna direction)?',
      'DIX 5-day average — accumulating hay distributing?',
      '0DTE volume hôm nay so với trung bình?',
      'Position sizing đã điều chỉnh theo gamma regime chưa?',
    ],
    faqs: [
      {
        question: 'Tôi không trade options, hiểu GEX để làm gì?',
        answer:
          'GEX/Vanna ảnh hưởng trực tiếp đến SPX/NDX/QQQ futures và spot. Equity trader, futures trader, ETF trader đều cần hiểu để tránh "fight the tape" trong gamma regime sai. Ví dụ: short SPX trong long gamma regime = sai — vì dealer sẽ buy mọi dip.',
      },
      {
        question: 'GEX có dùng được cho stocks lẻ không?',
        answer:
          'CÓ với mega-caps có options market lớn: AAPL, NVDA, TSLA, AMD, META. Single-stock GEX driver mạnh hơn index. NVDA/TSLA squeeze classic là combination của GEX + retail flow. Stocks small-cap không có đủ liquidity options để GEX có ý nghĩa.',
      },
      {
        question: 'GEX có hoạt động trên crypto/forex không?',
        answer:
          'Crypto: BTC/ETH options trên Deribit có GEX nhưng chỉ ~5% spot volume → ảnh hưởng nhỏ hơn nhiều so với SPX. Vẫn hữu ích quanh major expiry (last Friday). Forex: gần như không (FX options OTC, không centralized).',
      },
      {
        question: 'Tôi cần bao nhiêu vốn để trade GEX framework?',
        answer:
          'Equity/Futures: $25,000 (PDT rule) + $5k buffer cho ES micro. Options: $5,000 đủ start, nhưng học 6 tháng paper trade trước. Đừng trade options thật khi chưa hiểu Greeks — losses 100% capital là chuyện thường.',
      },
    ],
  },
  {
    slug: 'risk-management-pro',
    category: 'Pro Trader',
    title: 'Risk Management Cấp Pro — Kelly, R-Multiple, Portfolio Heat & Tail Risk',
    excerpt:
      'Kelly Criterion, fractional Kelly, R-multiple system, portfolio heat, correlation matrix, drawdown management, tail risk hedging. Framework từ Van Tharp, Ed Seykota, Paul Tudor Jones.',
    duration: '40 phút',
    level: 'Nâng cao',
    cover: coverRiskPro,
    intro:
      'Hơn 90% pro trader thất bại không phải vì hệ thống tệ, mà vì position sizing sai. Một edge 60% win rate có thể blow account nếu sizing 25% capital/trade. Bài này hệ thống hóa risk management cấp institutional: từ Kelly Criterion (do John Kelly 1956 phát minh cho Bell Labs), R-multiple của Van Tharp, đến portfolio heat của Ed Seykota và tail risk hedging kiểu Universa Investments.',
    history:
      'John L. Kelly Jr. (Bell Labs, 1956) công bố "A New Interpretation of Information Rate" — công thức Kelly tối ưu hóa long-term geometric growth. Ed Thorp ("Beat the Dealer", 1962) áp dụng cho blackjack và Wall Street. Van Tharp ("Trade Your Way to Financial Freedom", 1998) phổ biến R-multiple cho retail. Paul Tudor Jones nổi tiếng với câu "5:1 R:R minimum" và Mark Spitznagel (Universa) chứng minh tail hedge tăng CAGR dài hạn dù lỗ nhỏ thường xuyên.',
    sections: [
      {
        heading: '1. R-Multiple System — Đơn vị đo chuẩn',
        body:
          'R = Risk per trade (số tiền mất nếu chạm SL). Mọi trade đo bằng R-multiple, không bằng %.\n• Win 2R = lãi gấp 2 lần risk\n• Lose 1R = chạm SL chuẩn\n• Lose 2R = mistake (slippage hoặc gồng lệnh)\n\nVí dụ: Account $10,000, risk 1% = $100 = 1R. Trade kiếm $300 = +3R. Trade mất $150 (slippage) = -1.5R.',
        bullets: [
          'Mọi journal phải log R-multiple cho mỗi trade',
          'Expectancy = (Win% × Avg Win R) − (Loss% × Avg Loss R)',
          'Expectancy > 0.5R = good system',
          'Expectancy > 1R = excellent (rare)',
          'System với 40% win rate + 3R avg win = expectancy 0.6R (rất tốt)',
        ],
        example:
          'Pro trader 100 trades: 45 win avg +2.5R, 55 loss avg -1R.\nExpectancy = (0.45 × 2.5) − (0.55 × 1) = 1.125 − 0.55 = +0.575R/trade.\nVới 100 trades/năm risk 1% → return = 57.5%/năm trước drawdown.',
      },
      {
        heading: '2. Kelly Criterion — Tối ưu hóa geometric growth',
        body:
          'Kelly Formula cho biết % capital tối ưu để bet:\nf* = (bp − q) / b\nTrong đó:\n• b = odds (avg win / avg loss)\n• p = xác suất thắng\n• q = 1 − p (xác suất thua)\n\nVí dụ: System 60% win, avg win = 1.5× avg loss → b = 1.5, p = 0.6, q = 0.4\nf* = (1.5 × 0.6 − 0.4) / 1.5 = (0.9 − 0.4) / 1.5 = 0.333 = 33.3% capital/trade!\n\nNHƯNG: Full Kelly RẤT VOLATILE. 50% drawdown thường xuyên. Pro dùng FRACTIONAL KELLY (1/4 hoặc 1/2 Kelly).',
        bullets: [
          'Full Kelly: max long-term growth nhưng drawdown khủng',
          '1/4 Kelly: 75% growth của Full Kelly với 25% volatility',
          '1/2 Kelly: 87.5% growth với 50% volatility',
          'Hầu hết hedge fund dùng 1/4 Kelly hoặc nhỏ hơn',
        ],
        example:
          'Edge 60% win, 1.5b → Full Kelly 33%. Áp dụng 1/4 Kelly = 8.3% per trade. Vẫn aggressive — retail nên dùng 1/8 Kelly = 4% hoặc fixed 1–2%/trade.',
        pitfall:
          'Edge ƯỚC TÍNH (sample <100 trades) thường overestimate. Discount Kelly thêm 50% để safety margin.',
      },
      {
        heading: '3. Position Sizing Models',
        body:
          'Có 4 model chính, từ đơn giản đến phức tạp:\n\n1. Fixed Dollar: $X per trade. Sai vì không scale theo account.\n2. Fixed Fractional (% Risk): X% account per trade — phổ biến nhất, recommended cho retail. Chuẩn 1–2%.\n3. Volatility-based (ATR Sizing): position size = (% Risk × Equity) / (ATR × Multiplier). Trade nhiều shares hơn khi vol thấp, ít hơn khi vol cao.\n4. Kelly Fractional: theo công thức Kelly đã tính.',
        bullets: [
          'Retail dưới $50k → fixed 1% per trade',
          'Account $50k–$500k → 1.5% với volatility scaling',
          'Trên $500k → Kelly fractional + portfolio heat',
        ],
        example:
          'Account $20,000, risk 1% = $200. ATR(14) của BTC = $1,500. SL 2× ATR = $3,000 từ entry. Position size = $200 / $3,000 = 0.066 BTC. Tự động scale: BTC vol cao hơn → size nhỏ hơn.',
      },
      {
        heading: '4. Portfolio Heat — Tổng risk lúc nào',
        body:
          'Portfolio Heat = tổng % risk của TẤT CẢ positions đang mở. Ed Seykota khuyến nghị max 6%. Trader-Coach Linda Raschke dùng 4%.\n\nNếu mở 4 trades 1.5% mỗi cái → heat = 6%. Nếu thêm 2 trade nữa cùng correlation cao → real heat có thể 10%+ vì correlated drawdown.',
        bullets: [
          'Hard cap: 6% portfolio heat tổng',
          'Correlation-adjusted heat: nhân heat × avg correlation',
          'Crypto trader: BTC, ETH, SOL có correlation 0.85 → effective heat = nominal × 0.9',
          'Forex: EUR/USD và GBP/USD correlation 0.7 → reduce 1 trong 2 size',
        ],
      },
      {
        heading: '5. Correlation Matrix & Diversification',
        body:
          'Diversification THẬT đòi hỏi correlation < 0.3 giữa positions. Tính correlation 90 ngày qua returns:\n• ρ = 1: hoàn toàn tương quan (BTC-ETH thường 0.85)\n• ρ = 0: không tương quan\n• ρ = -1: tương quan ngược (Gold-DXY thường -0.6)\n\nRule pro: max 2 positions correlation > 0.7. 3+ correlated positions = 1 mega-trade trá hình.',
        bullets: [
          'Gold + Silver + Platinum = 1 trade (precious metals)',
          'BTC + ETH + SOL = 1 trade (crypto majors)',
          'AAPL + MSFT + GOOG = 1 trade (mega-cap tech)',
          'Kiểm tra correlation matrix tuần 1 lần',
        ],
      },
      {
        heading: '6. Drawdown Management — Khi mọi thứ sai',
        body:
          'Mọi system sẽ trải qua drawdown. Quan trọng là KIỂM SOÁT, không tránh. Quy tắc pro:\n\n• Drawdown 10%: review trades, không thay đổi system\n• Drawdown 15%: giảm size 50%\n• Drawdown 20%: pause 2 tuần, review hoàn toàn\n• Drawdown 25%: STOP TRADING, review tâm lý + system\n• Drawdown 33%: cần kiếm 50% để hồi vốn — danger zone\n\nMath cứng: lỗ 50% cần lãi 100% để hồi. Lỗ 67% cần lãi 200%. Bảo vệ vốn là số 1.',
        bullets: [
          'Set max daily loss: 3% account',
          'Set max weekly loss: 6%',
          'Set max monthly drawdown: 10%',
          'Vi phạm = forced break minimum 1 tuần',
        ],
      },
      {
        heading: '7. Tail Risk Hedging — Kiểu Universa/Spitznagel',
        body:
          'Mark Spitznagel (Universa Investments) chứng minh: dùng 0.5%/tháng mua deep OTM puts làm hedge → CAGR cao hơn long-only S&P 500 trong dài hạn 30 năm. Mặc dù 90%+ thời gian các puts hết hạn vô giá trị.\n\nLý do: trong tail event (March 2020, GFC 2008), puts payoff 50–500× → bù lại nhiều năm "phí bảo hiểm".\n\nRetail apply: dành 1% portfolio mua VIX calls hoặc SPY puts xa OTM (delta 0.05–0.10) hằng quý.',
        bullets: [
          'Buy SPY puts strike 20% OTM, expiry 6 tháng',
          'Buy VIX calls strike 30, expiry 3 tháng',
          'Roll mỗi quý',
          'Hedge cost ~2–3%/năm — chấp nhận như insurance',
        ],
        example:
          'March 2020: Universa kiếm +4,144% trên hedge book trong khi SPX -32%. Net portfolio của họ +17% Q1/2020 trong khi market bleed.',
      },
      {
        heading: '8. Risk of Ruin — Xác suất phá sản',
        body:
          'Risk of Ruin (RoR) = xác suất account về 0 hoặc dưới ngưỡng "no-recovery" (thường 50% drawdown).\n\nCông thức đơn giản: RoR = ((1 - edge) / (1 + edge))^units\nVới edge = win% − loss%, units = số lần risk capital có thể chịu.\n\nVí dụ: edge 20% (60% win), risk 2% account/trade, units = 50:\nRoR = (0.8/1.2)^50 = 0.0007% → cực thấp.\n\nNếu risk 10%/trade, units = 10: RoR = (0.8/1.2)^10 = 1.7% → vẫn thấp nhưng nguy hiểm.\nNếu risk 25%/trade, units = 4: RoR = (0.8/1.2)^4 = 19.7% → 1/5 phá sản!',
        bullets: [
          'Risk per trade ≤ 2% → RoR < 1% trong hầu hết edge tốt',
          'Risk per trade 5% → đỉnh của zone an toàn',
          'Risk per trade > 10% → gambler territory',
          'Edge thấp (50–55% win) cần size NHỎ hơn nhiều',
        ],
      },
    ],
    takeaways: [
      'R-multiple là đơn vị đo chuẩn — mọi trade đo bằng R, không bằng %',
      'Expectancy > 0.5R/trade là threshold của system tốt',
      'Kelly cho biết bet size tối ưu — luôn dùng Fractional Kelly (1/4 hoặc nhỏ hơn)',
      'Position sizing dựa trên ATR scale tự động theo volatility',
      'Portfolio heat tổng max 6%, điều chỉnh theo correlation',
      'Max 2 positions có correlation > 0.7 — diversification thật',
      'Drawdown levels có quy tắc cứng (10/15/20/25%) cho action',
      'Tail risk hedging tăng CAGR dài hạn dù lỗ phí bảo hiểm thường xuyên',
    ],
    checklist: [
      'Risk per trade ≤ 1–2% account chưa?',
      'SL đặt theo cấu trúc + buffer ATR, không cảm tính?',
      'Position size đã tính theo volatility (ATR) chưa?',
      'Portfolio heat hiện tại ≤ 6%?',
      'Có position nào correlation > 0.7 với position cũ không?',
      'Daily/weekly/monthly loss limit đã set chưa?',
      'Có hedge tail risk cho portfolio dài hạn không?',
      'R-multiple journal đã ghi cho mỗi trade?',
    ],
    faqs: [
      {
        question: 'Tôi có $1,000 thôi, áp dụng risk management thế nào?',
        answer:
          'Account nhỏ < $5k thực sự rất khó vì: (1) commission/slippage chiếm % lớn, (2) 1% = $10 không đủ trade futures/forex chuẩn. Đề xuất: paper trade với $50k giả lập 6 tháng để build edge và kỷ luật, song song save thêm vốn. KHÔNG over-leverage để "fast track" — đó là con đường blow account chắc chắn.',
      },
      {
        question: 'Kelly Criterion có dùng được cho swing/position trading không?',
        answer:
          'CÓ, nhưng cần ước tính edge từ sample LỚN (>100 trades). Swing trader thường ít data hơn day trader → edge estimate noisy → dùng 1/8 Kelly hoặc nhỏ hơn để safe. Position trader (1–2 trade/tháng) gần như không dùng được Kelly — chỉ fixed 2–3%.',
      },
      {
        question: 'Portfolio heat 6% có quá conservative không?',
        answer:
          'Cho retail KHÔNG. Pro hedge fund với multi-strategy có thể 8–10% nhưng họ có hedge layer phức tạp. Bạn không phải Citadel — giữ 6% là sweet spot giữa growth và safety. Khi prove được edge consistent 12 tháng → có thể nâng lên 8%.',
      },
      {
        question: 'Tail risk hedging có cần thiết cho retail không?',
        answer:
          'Cho account < $50k: KHÔNG ưu tiên — phí bảo hiểm cao tương đối. Cho account > $100k và horizon > 5 năm: NÊN. Đặc biệt nếu portfolio long-only equity. Black swan (COVID, GFC) có thể wipe 40%+ trong vài tuần — hedge là insurance, không phải optional.',
      },
    ],
  },
];

export const CATEGORIES = Array.from(new Set(LESSONS.map(l => l.category)));
