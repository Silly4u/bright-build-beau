export interface Term {
  id: string;
  term: string;
  english: string;
  category: string;
  categoryColor: string;
  definition: string;
  example?: string;
}

export interface TermDetail {
  term: string;
  english: string;
  category: string;
  illustration?: string;
  videoId?: string; // YouTube video ID
  relatedTerms?: string[]; // IDs of related terms
  basic: { definition: string; example: string; howToApply: string; commonMistakes: string };
  advanced: { definition: string; example: string; howToApply: string; commonMistakes: string; proTips?: string[]; keyTakeaways?: string[] };
}

export const CATEGORIES = [
  { label: 'Tất cả', color: 'text-foreground' },
  { label: 'Phân tích kỹ thuật', color: 'text-cyan-400' },
  { label: 'Chỉ báo kỹ thuật', color: 'text-violet-400' },
  { label: 'Cơ bản', color: 'text-emerald-400' },
  { label: 'Quản lý rủi ro', color: 'text-yellow-400' },
  { label: 'Giao dịch phái sinh', color: 'text-orange-400' },
  { label: 'Crypto', color: 'text-blue-400' },
  { label: 'Tâm lý thị trường', color: 'text-pink-400' },
  { label: 'Forex', color: 'text-emerald-300' },
  { label: 'DeFi', color: 'text-purple-400' },
  { label: 'Chiến lược giao dịch', color: 'text-red-400' },
];

export const TERMS: Term[] = [
  // ── Phân tích kỹ thuật ──
  { id: 'support-resistance', term: 'Hỗ Trợ & Kháng Cự', english: 'Support & Resistance', category: 'Phân tích kỹ thuật', categoryColor: 'text-cyan-400', definition: 'Vùng giá mà lực mua (hỗ trợ) hoặc lực bán (kháng cự) đủ mạnh để ngăn giá đi xa hơn.', example: 'BTC có hỗ trợ mạnh tại $60,000 — giá đã bounce 3 lần từ vùng này.' },
  { id: 'trendline', term: 'Đường Xu Hướng', english: 'Trendline', category: 'Phân tích kỹ thuật', categoryColor: 'text-cyan-400', definition: 'Đường thẳng nối các đỉnh hoặc đáy liên tiếp, thể hiện hướng đi chính của giá.', example: 'Trendline tăng kéo dài 3 tháng — mỗi đáy sau cao hơn đáy trước.' },
  { id: 'fibonacci', term: 'Fibonacci Retracement', english: 'Fibonacci Retracement', category: 'Phân tích kỹ thuật', categoryColor: 'text-cyan-400', definition: 'Công cụ vẽ các mức thoái lui (23.6%, 38.2%, 50%, 61.8%, 78.6%) dựa trên dãy Fibonacci, giúp xác định vùng giá có thể đảo chiều.', example: 'BTC pullback từ $73K về mức Fib 61.8% ($64K) rồi bật tăng mạnh — vùng Golden Zone.' },
  { id: 'chart-pattern', term: 'Mô Hình Giá', english: 'Chart Pattern', category: 'Phân tích kỹ thuật', categoryColor: 'text-cyan-400', definition: 'Các hình dạng lặp lại trên biểu đồ (Head & Shoulders, Double Top/Bottom, Triangle, Wedge, Flag) giúp dự đoán hướng giá tiếp theo.', example: 'BTC tạo mô hình Double Bottom tại $56K → phá neckline $62K → target $68K.' },
  { id: 'candlestick', term: 'Nến Nhật', english: 'Candlestick', category: 'Phân tích kỹ thuật', categoryColor: 'text-cyan-400', definition: 'Biểu đồ nến hiển thị giá Open, High, Low, Close trong 1 khung thời gian. Các mô hình nến (Doji, Hammer, Engulfing) giúp đọc tâm lý thị trường.', example: 'Nến Hammer xuất hiện tại hỗ trợ $60K với bóng dưới dài → tín hiệu đảo chiều tăng.' },
  { id: 'price-action', term: 'Price Action', english: 'Price Action', category: 'Phân tích kỹ thuật', categoryColor: 'text-cyan-400', definition: 'Phương pháp phân tích chỉ dựa trên biến động giá thuần (nến, S/R, trendline) mà không cần indicator.', example: 'Pin bar + rejection tại kháng cự → Short entry mà không cần RSI hay MACD.' },
  { id: 'supply-demand', term: 'Vùng Cung Cầu', english: 'Supply & Demand Zone', category: 'Phân tích kỹ thuật', categoryColor: 'text-cyan-400', definition: 'Vùng giá nơi lệnh mua/bán lớn tích tụ, tạo ra sự mất cân bằng cung cầu. Giá thường phản ứng mạnh khi quay lại vùng này.', example: 'Demand zone $62K-$63K: giá tạo nến tăng mạnh lần đầu → quay lại vùng này sẽ bounce.' },

  // ── Chỉ báo kỹ thuật ──
  { id: 'rsi', term: 'RSI', english: 'Relative Strength Index', category: 'Chỉ báo kỹ thuật', categoryColor: 'text-violet-400', definition: 'Chỉ báo đo lường tốc độ thay đổi giá (0-100). RSI > 70 = quá mua, RSI < 30 = quá bán.', example: 'RSI 14 chạm 28 — vùng quá bán, theo dõi tín hiệu đảo chiều tăng.' },
  { id: 'macd', term: 'MACD', english: 'Moving Average Convergence Divergence', category: 'Chỉ báo kỹ thuật', categoryColor: 'text-violet-400', definition: 'Indicator kết hợp trend + momentum. MACD cắt lên Signal = mua, cắt xuống = bán. Histogram thể hiện sức mạnh.', example: 'MACD line cắt lên Signal line + Histogram dương → Xác nhận đà tăng.' },
  { id: 'bollinger-bands', term: 'Bollinger Bands', english: 'Bollinger Bands', category: 'Chỉ báo kỹ thuật', categoryColor: 'text-violet-400', definition: 'Dải biến động gồm 3 đường: SMA 20 ± 2 độ lệch chuẩn. Khi dải siết lại (Squeeze) báo hiệu biến động lớn sắp xảy ra.', example: 'BB Squeeze 2 tuần → giá phá lên dải trên với volume lớn → Breakout xác nhận.' },
  { id: 'ema', term: 'EMA', english: 'Exponential Moving Average', category: 'Chỉ báo kỹ thuật', categoryColor: 'text-violet-400', definition: 'Đường trung bình động hàm mũ, phản ứng nhanh hơn SMA. EMA 9, 21, 50, 200 là các mức phổ biến.', example: 'EMA 9 cắt lên EMA 21 (Golden Cross ngắn hạn) → tín hiệu mua scalping.' },
  { id: 'divergence', term: 'Phân Kỳ', english: 'Divergence', category: 'Chỉ báo kỹ thuật', categoryColor: 'text-violet-400', definition: 'Khi giá và indicator đi ngược hướng. Regular Divergence báo đảo chiều, Hidden Divergence báo tiếp tục xu hướng.', example: 'BTC tạo đỉnh mới nhưng RSI đi xuống — phân kỳ giảm, cảnh báo điều chỉnh.' },
  { id: 'ichimoku', term: 'Ichimoku Cloud', english: 'Ichimoku Kinko Hyo', category: 'Chỉ báo kỹ thuật', categoryColor: 'text-violet-400', definition: 'Hệ thống indicator "nhìn một cái biết tất cả" gồm 5 đường: Tenkan, Kijun, Senkou A/B (tạo mây), Chikou. Giá trên mây = xu hướng tăng.', example: 'BTC trên mây xanh dày + Tenkan cắt lên Kijun → xác nhận xu hướng tăng mạnh.' },
  { id: 'stochastic', term: 'Stochastic', english: 'Stochastic Oscillator', category: 'Chỉ báo kỹ thuật', categoryColor: 'text-violet-400', definition: 'Chỉ báo momentum so sánh giá đóng cửa với dải giá trong 14 phiên. %K > 80 = quá mua, %K < 20 = quá bán.', example: '%K cắt lên %D tại vùng 15 → tín hiệu mua tại vùng quá bán.' },

  // ── Cơ bản ──
  { id: 'volume', term: 'Khối Lượng', english: 'Volume', category: 'Cơ bản', categoryColor: 'text-emerald-400', definition: 'Tổng số lượng tài sản được giao dịch trong một khoảng thời gian. Volume xác nhận xu hướng giá.', example: 'Giá tăng + Volume tăng = Xu hướng mạnh. Giá tăng + Volume giảm = Cảnh báo.' },
  { id: 'liquidity', term: 'Thanh Khoản', english: 'Liquidity', category: 'Cơ bản', categoryColor: 'text-emerald-400', definition: 'Khả năng mua/bán tài sản nhanh chóng mà không ảnh hưởng đáng kể đến giá. Thanh khoản cao = spread thấp.', example: 'BTC có thanh khoản cao — spread chỉ $5-10 trên Binance.' },
  { id: 'spread', term: 'Spread', english: 'Bid-Ask Spread', category: 'Cơ bản', categoryColor: 'text-emerald-400', definition: 'Chênh lệch giữa giá mua (Bid) và giá bán (Ask). Spread càng nhỏ = thanh khoản càng tốt.', example: 'EUR/USD spread 0.1 pip trên Binance, nhưng coin nhỏ spread có thể 1-2%.' },
  { id: 'market-cap', term: 'Vốn Hóa Thị Trường', english: 'Market Capitalization', category: 'Cơ bản', categoryColor: 'text-emerald-400', definition: 'Tổng giá trị thị trường = Giá × Tổng cung lưu hành. Dùng để đánh giá quy mô tài sản.', example: 'BTC market cap $1.3T — chiếm ~50% tổng vốn hóa crypto.' },
  { id: 'order-types', term: 'Các Loại Lệnh', english: 'Order Types', category: 'Cơ bản', categoryColor: 'text-emerald-400', definition: 'Market Order (mua/bán ngay), Limit Order (đặt giá chờ), Stop Order (kích hoạt khi đạt giá), OCO (One-Cancels-Other).', example: 'Limit Buy $65K — lệnh sẽ khớp khi giá BTC giảm xuống $65K.' },

  // ── Quản lý rủi ro ──
  { id: 'stop-loss', term: 'Cắt Lỗ', english: 'Stop Loss', category: 'Quản lý rủi ro', categoryColor: 'text-yellow-400', definition: 'Lệnh tự động đóng vị thế khi giá đạt mức lỗ đã định trước, bảo vệ vốn.', example: 'Entry BTC $67K — đặt SL tại $65,500 (risk 2.2%).' },
  { id: 'take-profit', term: 'Chốt Lời', english: 'Take Profit', category: 'Quản lý rủi ro', categoryColor: 'text-yellow-400', definition: 'Lệnh tự động đóng vị thế khi giá đạt mức lời đã định trước.', example: 'TP1: $69K (chốt 50%) | TP2: $71K (chốt 30%) | TP3: trailing.' },
  { id: 'risk-reward', term: 'Tỷ Lệ R:R', english: 'Risk/Reward Ratio', category: 'Quản lý rủi ro', categoryColor: 'text-yellow-400', definition: 'Tỷ lệ rủi ro/phần thưởng. Trader chuyên nghiệp yêu cầu tối thiểu 1:2. R:R = (TP - Entry) / (Entry - SL).', example: 'Entry $67K, SL $66K, TP $70K → R:R = 1:3 ✅' },
  { id: 'position-sizing', term: 'Quản Lý Khối Lượng', english: 'Position Sizing', category: 'Quản lý rủi ro', categoryColor: 'text-yellow-400', definition: 'Quy tắc xác định khối lượng giao dịch dựa trên % rủi ro trên tổng vốn. Quy tắc 1-2%: không bao giờ risk > 2% vốn/lệnh.', example: 'Vốn $10K, risk 1% = $100/lệnh. SL 2% → Position size = $5,000.' },
  { id: 'drawdown', term: 'Drawdown', english: 'Drawdown', category: 'Quản lý rủi ro', categoryColor: 'text-yellow-400', definition: 'Mức sụt giảm vốn tối đa từ đỉnh. Max Drawdown > 20% là cảnh báo đỏ về quản lý rủi ro.', example: 'Tài khoản từ $10K xuống $7.5K → Drawdown 25% — cần giảm size ngay.' },
  { id: 'trailing-stop', term: 'Trailing Stop', english: 'Trailing Stop', category: 'Quản lý rủi ro', categoryColor: 'text-yellow-400', definition: 'Stop Loss tự động dịch chuyển theo giá có lợi, khóa lời khi xu hướng tiếp tục.', example: 'Entry $67K, trailing 3% → giá lên $70K thì SL tự chuyển lên $67.9K.' },

  // ── Giao dịch phái sinh ──
  { id: 'futures', term: 'Hợp Đồng Tương Lai', english: 'Futures', category: 'Giao dịch phái sinh', categoryColor: 'text-orange-400', definition: 'Hợp đồng mua/bán tài sản ở giá định sẵn tại thời điểm tương lai. Cho phép Long (mua lên) và Short (bán xuống).', example: 'Long BTC Futures $67K × 10x → mỗi 1% tăng = lãi 10%.' },
  { id: 'leverage', term: 'Đòn Bẩy', english: 'Leverage', category: 'Giao dịch phái sinh', categoryColor: 'text-orange-400', definition: 'Vay vốn từ sàn để giao dịch lớn hơn vốn thực. 10x = giao dịch gấp 10 lần vốn. Lãi/lỗ đều nhân lên.', example: 'Vốn $1,000 × 20x = Vị thế $20,000. Giá giảm 5% → mất 100% vốn (liquidation).' },
  { id: 'margin', term: 'Ký Quỹ', english: 'Margin', category: 'Giao dịch phái sinh', categoryColor: 'text-orange-400', definition: 'Số vốn cần đặt cọc để mở vị thế có đòn bẩy. Initial Margin = mở lệnh, Maintenance Margin = duy trì.', example: 'BTC $67K × 10x, margin 10% = cần $6,700 để mở vị thế $67,000.' },
  { id: 'liquidation', term: 'Thanh Lý', english: 'Liquidation', category: 'Giao dịch phái sinh', categoryColor: 'text-orange-400', definition: 'Sàn tự động đóng vị thế khi lỗ chạm mức Maintenance Margin. Đòn bẩy cao = liquidation nhanh.', example: 'Long 50x → giá giảm 2% = mất toàn bộ margin → Liquidation.' },
  { id: 'funding-rate', term: 'Phí Funding', english: 'Funding Rate', category: 'Giao dịch phái sinh', categoryColor: 'text-orange-400', definition: 'Phí trao đổi giữa Long và Short mỗi 8 giờ trên Perpetual Futures, giữ giá futures gần spot.', example: 'Funding +0.03% → Long trả Short. Funding âm → Short trả Long.' },

  // ── Crypto ──
  { id: 'blockchain', term: 'Blockchain', english: 'Blockchain', category: 'Crypto', categoryColor: 'text-blue-400', definition: 'Sổ cái phân tán, ghi lại mọi giao dịch theo chuỗi block. Bất biến, minh bạch, phi tập trung.', example: 'Bitcoin blockchain xử lý ~7 TX/giây, Ethereum ~30 TX/giây.' },
  { id: 'wallet', term: 'Ví Crypto', english: 'Crypto Wallet', category: 'Crypto', categoryColor: 'text-blue-400', definition: 'Công cụ lưu trữ private key để quản lý crypto. Hot Wallet (online) vs Cold Wallet (offline, an toàn hơn).', example: 'Ledger Nano X (cold wallet) — lưu trữ BTC offline, chống hack.' },
  { id: 'halving', term: 'Halving', english: 'Bitcoin Halving', category: 'Crypto', categoryColor: 'text-blue-400', definition: 'Sự kiện giảm 50% phần thưởng block mining mỗi ~4 năm. Giảm cung → lịch sử cho thấy giá tăng mạnh sau halving.', example: 'Halving 2024: reward giảm từ 6.25 → 3.125 BTC/block. Giá từ $28K → $73K.' },
  { id: 'altcoin', term: 'Altcoin', english: 'Alternative Coin', category: 'Crypto', categoryColor: 'text-blue-400', definition: 'Tất cả cryptocurrency ngoài Bitcoin. Bao gồm ETH, SOL, BNB, XRP... Altseason = giai đoạn altcoin tăng mạnh.', example: 'BTC dominance giảm từ 55% → 42% → Altseason bắt đầu, ETH +80%.' },
  { id: 'whale', term: 'Cá Voi', english: 'Whale', category: 'Crypto', categoryColor: 'text-blue-400', definition: 'Cá nhân/tổ chức nắm giữ lượng lớn crypto, có thể ảnh hưởng giá thị trường khi mua/bán.', example: 'Whale chuyển 10,000 BTC lên Binance → cảnh báo bán tháo.' },

  // ── Tâm lý thị trường ──
  { id: 'fomo', term: 'FOMO', english: 'Fear Of Missing Out', category: 'Tâm lý thị trường', categoryColor: 'text-pink-400', definition: 'Sợ bỏ lỡ cơ hội — tâm lý khiến trader mua đuổi giá cao mà không có kế hoạch. Một trong các lỗi phổ biến nhất.', example: 'BTC tăng 20% trong 2 ngày → FOMO mua đỉnh → giá điều chỉnh 15% ngay sau.' },
  { id: 'fud', term: 'FUD', english: 'Fear, Uncertainty, Doubt', category: 'Tâm lý thị trường', categoryColor: 'text-pink-400', definition: 'Tin tức tiêu cực (thật hoặc giả) gây hoảng loạn, khiến nhà đầu tư bán tháo.', example: 'Tin "Trung Quốc cấm Bitcoin" lần thứ N → FUD → giá giảm 10% rồi hồi lại.' },
  { id: 'greed-fear-index', term: 'Chỉ Số Tham Lam & Sợ Hãi', english: 'Fear & Greed Index', category: 'Tâm lý thị trường', categoryColor: 'text-pink-400', definition: 'Chỉ số 0-100 đo tâm lý thị trường. < 25 = Extreme Fear (cơ hội mua), > 75 = Extreme Greed (cảnh báo bán).', example: 'Fear & Greed Index = 15 (Extreme Fear) → Warren Buffett: "Hãy tham lam khi người khác sợ hãi."' },
  { id: 'diamond-hands', term: 'Diamond Hands', english: 'Diamond Hands 💎🙌', category: 'Tâm lý thị trường', categoryColor: 'text-pink-400', definition: 'Người giữ vị thế bất chấp biến động, không bán khi giá giảm. Ngược lại: Paper Hands (bán sớm vì sợ).', example: 'HODLer BTC từ $3K → $69K → crash $16K → vẫn hold → $73K. Diamond Hands.' },

  // ── Forex ──
  { id: 'pip', term: 'Pip', english: 'Percentage In Point', category: 'Forex', categoryColor: 'text-emerald-300', definition: 'Đơn vị đo nhỏ nhất của biến động tỷ giá. 1 pip = 0.0001 (4 số thập phân). Với JPY = 0.01.', example: 'EUR/USD từ 1.0850 → 1.0870 = tăng 20 pips.' },
  { id: 'lot', term: 'Lot', english: 'Lot Size', category: 'Forex', categoryColor: 'text-emerald-300', definition: '1 Standard Lot = 100,000 đơn vị tiền tệ. Mini Lot = 10,000. Micro Lot = 1,000. Nano Lot = 100.', example: '1 lot EUR/USD: 1 pip = $10. 0.1 lot: 1 pip = $1.' },
  { id: 'dxy', term: 'DXY', english: 'US Dollar Index', category: 'Forex', categoryColor: 'text-emerald-300', definition: 'Chỉ số đo sức mạnh USD so với rổ 6 tiền tệ chính (EUR, JPY, GBP, CAD, SEK, CHF). DXY tăng → Vàng/BTC giảm.', example: 'DXY tăng từ 104 → 107 → EUR/USD giảm, Vàng giảm $50.' },
  { id: 'swap', term: 'Phí Qua Đêm', english: 'Swap / Rollover', category: 'Forex', categoryColor: 'text-emerald-300', definition: 'Phí hoặc lãi khi giữ vị thế Forex qua đêm, dựa trên chênh lệch lãi suất giữa 2 đồng tiền.', example: 'Long AUD/JPY (lãi suất AUD > JPY) → nhận swap dương mỗi đêm.' },

  // ── DeFi ──
  { id: 'defi', term: 'DeFi', english: 'Decentralized Finance', category: 'DeFi', categoryColor: 'text-purple-400', definition: 'Tài chính phi tập trung — dịch vụ tài chính (vay, cho vay, swap) chạy trên blockchain, không cần ngân hàng.', example: 'Aave: cho vay USDC, nhận lãi 5% APY. Uniswap: swap token không cần sàn tập trung.' },
  { id: 'yield-farming', term: 'Yield Farming', english: 'Yield Farming', category: 'DeFi', categoryColor: 'text-purple-400', definition: 'Cung cấp thanh khoản cho protocol DeFi để nhận phần thưởng (token + phí giao dịch). APY có thể rất cao nhưng rủi ro.', example: 'Cung cấp ETH/USDC trên Uniswap V3 → nhận phí swap ~15-40% APY.' },
  { id: 'impermanent-loss', term: 'Tổn Thất Tạm Thời', english: 'Impermanent Loss', category: 'DeFi', categoryColor: 'text-purple-400', definition: 'Khi cung cấp LP, nếu tỷ giá 2 token thay đổi nhiều so với lúc nạp → giá trị LP < giá trị nếu chỉ HODL.', example: 'Nạp ETH/USDC khi ETH $3K. ETH lên $4K → IL ~2%. ETH lên $6K → IL ~5.7%.' },
  { id: 'staking', term: 'Staking', english: 'Staking', category: 'DeFi', categoryColor: 'text-purple-400', definition: 'Khóa token trong mạng Proof-of-Stake để xác thực giao dịch và nhận phần thưởng (staking reward).', example: 'Stake 32 ETH → trở thành validator Ethereum → nhận ~4% APY.' },

  // ── Chiến lược giao dịch ──
  { id: 'breakout', term: 'Breakout', english: 'Breakout Trading', category: 'Chiến lược giao dịch', categoryColor: 'text-red-400', definition: 'Chiến lược mua/bán khi giá phá vỡ vùng S/R quan trọng với volume xác nhận. Cần phân biệt với fakeout.', example: 'BTC breakout $68K + volume 3x trung bình → Long entry tại $68.2K, SL $67K.' },
  { id: 'scalping', term: 'Scalping', english: 'Scalping', category: 'Chiến lược giao dịch', categoryColor: 'text-red-400', definition: 'Giao dịch siêu ngắn (vài giây → vài phút), kiếm lợi nhuận nhỏ nhưng nhiều lần/ngày. Yêu cầu tốc độ cao.', example: 'Scalp BTC trên khung M1: entry → TP 0.1-0.3% → lặp lại 20-50 lần/ngày.' },
  { id: 'swing-trading', term: 'Swing Trading', english: 'Swing Trading', category: 'Chiến lược giao dịch', categoryColor: 'text-red-400', definition: 'Giao dịch trung hạn (vài ngày → vài tuần), tận dụng các "nhịp swing" trong xu hướng. Phù hợp người bận.', example: 'Long ETH tại support $3,200 → TP tại resistance $3,800 sau 5 ngày. R:R = 1:3.' },
  { id: 'dca', term: 'DCA', english: 'Dollar Cost Averaging', category: 'Chiến lược giao dịch', categoryColor: 'text-red-400', definition: 'Mua đều đặn một lượng cố định theo lịch trình, bất kể giá, giảm rủi ro timing sai.', example: 'Mua $200 BTC mỗi tuần → trung bình giá entry tốt hơn so với mua 1 lần.' },
  { id: 'reversal', term: 'Đảo Chiều', english: 'Reversal Trading', category: 'Chiến lược giao dịch', categoryColor: 'text-red-400', definition: 'Chiến lược giao dịch khi xu hướng sắp thay đổi, dựa trên divergence, mô hình đảo chiều, exhaustion candle.', example: 'Double Top tại $69K + RSI bearish divergence → Short entry. TP: $64K.' },
  { id: 'grid-trading', term: 'Grid Trading', english: 'Grid Trading', category: 'Chiến lược giao dịch', categoryColor: 'text-red-400', definition: 'Đặt lưới lệnh mua/bán cách đều nhau trong một range giá. Bot tự mua thấp bán cao trong range sideway.', example: 'Grid $60K-$70K, 20 lệnh → bot tự giao dịch mỗi $500, lãi $50-100/lệnh.' },
];

export const TERMS_DETAIL: Record<string, TermDetail> = {
  'support-resistance': {
    term: 'Hỗ Trợ & Kháng Cự', english: 'Support & Resistance', category: 'Phân tích kỹ thuật',
    videoId: 'BIQFbqo1Hto',
    relatedTerms: ['trendline', 'supply-demand', 'fibonacci', 'price-action'],
    basic: { definition: 'Vùng giá mà tại đó lực mua (hỗ trợ) hoặc lực bán (kháng cự) đủ mạnh để ngăn giá đi xa hơn. S/R là VÙNG, không phải đường chính xác — hãy tưởng tượng như "sàn nhà" (hỗ trợ) và "trần nhà" (kháng cự). Khi giá chạm sàn, nó bật lên. Khi chạm trần, nó rớt xuống. Đây là nền tảng cơ bản nhất trong phân tích kỹ thuật.', example: 'BTC có hỗ trợ mạnh tại $60,000 — giá đã bounce 3 lần từ vùng này trong 2 tháng qua. Mỗi lần chạm, volume mua tăng vọt, chứng tỏ có nhiều lệnh mua chờ sẵn tại đây.', howToApply: '1. Mở chart khung H4 hoặc D1\n2. Xác định các mức giá mà giá đã đảo chiều ít nhất 2 lần\n3. Vẽ đường ngang tại các mức đó\n4. Mua gần hỗ trợ (với SL dưới hỗ trợ), bán gần kháng cự (với SL trên kháng cự)\n5. Chờ nến xác nhận (pin bar, engulfing) trước khi vào lệnh', commonMistakes: 'Đặt entry ngay tại mức S/R thay vì chờ xác nhận nến. S/R là vùng (zone), không phải đường chính xác — luôn để buffer 0.5-1%. Không kiểm tra volume khi giá chạm S/R.' },
    advanced: {
      definition: 'S/R động (Dynamic S/R) từ EMA 50/200, Bollinger Bands. S/R flipping — khi kháng cự bị phá vỡ sẽ trở thành hỗ trợ và ngược lại (một trong những concept quan trọng nhất). Institutional S/R dựa trên Volume Profile (POC, VAH, VAL) và Order Flow cho thấy vùng tích lũy lệnh lớn từ "smart money".',
      example: 'BTC phá $68K (kháng cự) → retest $68K thành hỗ trợ → Long entry với volume xác nhận tại vùng S/R flip. Volume Profile POC tại $67.5K xác nhận vùng này là "fair value" — nơi giao dịch nhiều nhất.',
      howToApply: '1. Kết hợp S/R với Volume Profile (POC, VAH, VAL) và Order Flow\n2. Xác nhận bằng nến đảo chiều + volume spike\n3. Multi-timeframe: S/R trên HTF (D1, W1) mạnh hơn LTF\n4. Tìm S/R flip zones — đây là entry có xác suất thành công cao nhất\n5. Dùng heatmap thanh khoản để thấy cluster lệnh chờ',
      commonMistakes: 'Bỏ qua context (xu hướng lớn). S/R yếu khi volume thấp hoặc đã bị test quá nhiều lần (>3 lần). Không phân biệt S/R tĩnh vs S/R động. Quên kiểm tra HTF S/R — bị trapped bởi LTF noise.',
      proTips: ['Dùng heatmap thanh khoản để xác định vùng S/R ẩn mà retail trader không thấy', 'S/R mạnh nhất là nơi có sự hội tụ (confluence) giữa Fib, EMA, và mức giá tròn', 'Round numbers ($60K, $70K) thường là S/R tâm lý cực mạnh — big players đặt lệnh tại đây', 'S/R trên Weekly chart mạnh gấp 5-10 lần so với H1 chart'],
      keyTakeaways: ['S/R là vùng, không phải đường — luôn để buffer 0.5-1%', 'S/R càng nhiều timeframe xác nhận càng mạnh', 'S/R flip (kháng cự → hỗ trợ) là setup entry tin cậy nhất', 'Volume Profile POC cho thấy S/R thật sự từ institutional flow']
    },
  },
  'trendline': {
    term: 'Đường Xu Hướng', english: 'Trendline', category: 'Phân tích kỹ thuật',
    videoId: 'MKGLBubSMvk',
    relatedTerms: ['support-resistance', 'chart-pattern', 'price-action'],
    basic: { definition: 'Đường thẳng nối các đỉnh hoặc đáy liên tiếp, thể hiện hướng đi chính của giá. Trendline tăng nối các đáy cao hơn (higher lows), trendline giảm nối các đỉnh thấp hơn (lower highs). Cần ít nhất 2 điểm chạm, 3 điểm mới xác nhận.', example: 'BTC tạo đáy $56K → $60K → $63K. Nối 3 đáy này thành trendline tăng. Giá chạm trendline lần 4 tại $66K → bounce lên $72K.', howToApply: '1. Xác định xu hướng chính (tăng hoặc giảm)\n2. Nối ít nhất 2 đáy (uptrend) hoặc 2 đỉnh (downtrend)\n3. Mua khi giá chạm trendline tăng, bán khi chạm trendline giảm\n4. Breakout trendline = tín hiệu đảo chiều tiềm năng', commonMistakes: 'Vẽ trendline chỉ qua 2 điểm rồi trade ngay — cần 3 điểm xác nhận. Ép trendline vào chart — nếu phải "uốn" trendline, nó không hợp lệ. Không chờ nến xác nhận khi giá chạm trendline.' },
    advanced: {
      definition: 'Trendline là biểu hiện của momentum và tâm lý thị trường. Trendline dốc (>45°) thường không bền — giá sẽ break và tạo trendline thoải hơn. Dynamic trendline từ EMA/SMA đáng tin hơn trendline vẽ tay. Pitchfork (Andrew\'s Pitchfork) mở rộng trendline thành kênh giá 3 đường.',
      example: 'BTC uptrend dốc 60° từ $40K → $73K trong 3 tháng → break trendline dốc → tạo trendline mới thoải hơn 30° qua $56K và $60K → xu hướng tăng vẫn intact nhưng pace chậm hơn.',
      howToApply: '1. Vẽ trendline trên HTF (D1, W1) cho hướng chính\n2. Dùng EMA 21/50 như dynamic trendline trên LTF\n3. Trendline break + retest = entry mạnh nhất\n4. Kênh song song (channel) giúp xác định target price\n5. Kết hợp với Fibonacci Fan cho góc trendline chính xác',
      commonMistakes: 'Coi mọi trendline break là đảo chiều — cần volume xác nhận. Trendline trên M5/M15 thường chỉ là noise. Không phân biệt trendline chính (HTF) và trendline phụ (LTF).',
      proTips: ['Trendline dốc hơn 45° thường sẽ bị break — chuẩn bị plan B', 'Khi trendline bị break, thường có "throwback" (retest) trước khi đi tiếp — đây là entry tốt nhất', 'Dùng log scale cho crypto chart — trendline chính xác hơn trên khung dài'],
      keyTakeaways: ['Cần ít nhất 3 điểm chạm để xác nhận trendline', 'Trendline break + volume = tín hiệu mạnh', 'HTF trendline > LTF trendline', 'EMA 21/50 là dynamic trendline đáng tin nhất']
    },
  },
  'chart-pattern': {
    term: 'Mô Hình Giá', english: 'Chart Pattern', category: 'Phân tích kỹ thuật',
    videoId: 'CF0yAsNR0Sk',
    relatedTerms: ['candlestick', 'breakout', 'support-resistance'],
    basic: { definition: 'Các hình dạng lặp lại trên biểu đồ giúp dự đoán hướng giá tiếp theo. Chia 2 nhóm: Đảo chiều (Head & Shoulders, Double Top/Bottom) và Tiếp diễn (Triangle, Wedge, Flag, Pennant). Mỗi mô hình có target giá tính được.', example: 'BTC tạo mô hình Double Bottom tại $56K → phá neckline $62K → target = $62K + ($62K - $56K) = $68K. Giá thực tế đạt $67.5K — gần chính xác!', howToApply: '1. Học nhận dạng 5 mô hình phổ biến nhất: Double Top/Bottom, H&S, Triangle, Flag, Wedge\n2. Xác nhận bằng volume (breakout cần volume tăng)\n3. Tính target price: khoảng cách mô hình cộng/trừ vào điểm breakout\n4. Đặt SL phía sau mô hình', commonMistakes: 'Thấy mô hình ở khắp nơi (apophenia) — chỉ trade mô hình rõ ràng trên H4+. Không chờ breakout xác nhận — entry sớm dễ bị fakeout. Quên tính target price.' },
    advanced: {
      definition: 'Các mô hình nâng cao: Ascending/Descending Triangle có bias hướng (ascending = bullish, descending = bearish). Cup & Handle cho tín hiệu bullish continuation mạnh. Wyckoff Accumulation/Distribution pattern phản ánh hành vi institutional money. Measured Move cho target chính xác.',
      example: 'ETH tạo Cup & Handle trên D1: Cup từ $2,800 → $3,500 (depth $700) → Handle pullback về $3,300 → Break handle + volume → Target: $3,500 + $700 = $4,200.',
      howToApply: '1. Kết hợp chart pattern với volume analysis — breakout không volume = suspect\n2. Multi-timeframe: mô hình trên HTF cho target, LTF cho entry chính xác\n3. Dùng Fibonacci Extension kết hợp Measured Move cho target\n4. Invalidation level (SL) luôn ở phía sau mô hình',
      commonMistakes: 'Trading mô hình chưa hoàn thành. Mô hình trên M5/M15 có xác suất thấp — ưu tiên H4+. Quên rằng mô hình chỉ là xác suất, không phải chắc chắn — luôn cần SL.',
      proTips: ['Ascending Triangle có xác suất break up ~68% — nhưng vẫn cần volume xác nhận', 'Mô hình càng lâu hình thành → breakout càng mạnh (tích lũy năng lượng)', 'Failed pattern (mô hình thất bại) thường cho tín hiệu ngược lại rất mạnh'],
      keyTakeaways: ['Volume xác nhận là bắt buộc cho mọi breakout mô hình', 'Target = khoảng cách mô hình + điểm breakout', 'Mô hình trên HTF đáng tin hơn LTF gấp nhiều lần', 'Failed pattern = trade ngược lại với R:R tốt']
    },
  },
  'candlestick': {
    term: 'Nến Nhật', english: 'Candlestick', category: 'Phân tích kỹ thuật',
    videoId: 'C3KRwfj9F8Q',
    relatedTerms: ['price-action', 'support-resistance', 'chart-pattern'],
    basic: { definition: 'Biểu đồ nến hiển thị 4 giá trong 1 khung thời gian: Open (mở cửa), High (cao nhất), Low (thấp nhất), Close (đóng cửa). Thân nến xanh/trắng = giá tăng (Close > Open), thân đỏ/đen = giá giảm (Close < Open). Bóng nến (shadow/wick) cho thấy vùng giá bị từ chối.', example: 'Nến Hammer xuất hiện tại hỗ trợ $60K: thân nhỏ ở trên, bóng dưới dài gấp 2-3 lần thân → cho thấy phe bán đẩy giá xuống nhưng phe mua đã mua lại mạnh → tín hiệu đảo chiều tăng.', howToApply: '1. Học 5 mô hình nến quan trọng nhất: Hammer, Engulfing, Doji, Morning/Evening Star, Pin Bar\n2. Nến chỉ có ý nghĩa tại vùng S/R quan trọng\n3. Nến trên HTF (H4, D1) đáng tin hơn nến M5\n4. Chờ nến đóng cửa hoàn toàn mới xác nhận', commonMistakes: 'Trade nến ở giữa range (không ở S/R) — xác suất thấp. Entry trước khi nến đóng cửa. Một nến đơn lẻ không đủ — cần xem context (xu hướng, S/R, volume).' },
    advanced: {
      definition: 'Nến không chỉ là hình dạng — nó kể câu chuyện của cuộc chiến mua-bán. Engulfing Pattern phản ánh sự thay đổi kiểm soát hoàn toàn. Three White Soldiers/Three Black Crows cho momentum mạnh. Order Block (ICT concept) là nến institutional tạo ra trước khi giá di chuyển mạnh.',
      example: 'Bearish Engulfing tại kháng cự $73K trên D1: nến đỏ bao trùm hoàn toàn nến xanh trước → phe bán kiểm soát. Kết hợp RSI divergence + volume spike → xác nhận đỉnh. Giá giảm 15% trong 2 tuần sau.',
      howToApply: '1. Đọc nến theo context: nến tại S/R > nến ở giữa range\n2. Kết hợp nến với volume: Hammer + volume spike = tin cậy cao\n3. Multi-candle pattern (2-3 nến) đáng tin hơn single candle\n4. Order Block: tìm nến lớn trước move mạnh → đó là vùng institutional interest',
      commonMistakes: 'Thuộc lòng tên mô hình mà không hiểu ý nghĩa. Dùng nến trên M1/M5 — quá nhiều noise. Bỏ qua volume khi đọc nến. Không xét đến xu hướng lớn (trend context).',
      proTips: ['Pin Bar (bóng dài) tại S/R key level là tín hiệu đảo chiều mạnh nhất', 'Nến D1 đóng cửa > đáng tin gấp 10 lần nến M15', 'Order Block từ ICT methodology: tìm nến cuối cùng trước move impulsive = entry zone', 'Doji tại đỉnh/đáy xu hướng = dấu hiệu indecision, chuẩn bị đảo chiều'],
      keyTakeaways: ['Nến kể câu chuyện mua-bán — học đọc story, không chỉ thuộc tên', 'Nến chỉ có ý nghĩa tại S/R key level + volume xác nhận', 'HTF candle > LTF candle — D1 close là reference quan trọng nhất', 'Kết hợp nến + context (trend, S/R, volume) = xác suất cao']
    },
  },
  'price-action': {
    term: 'Price Action', english: 'Price Action', category: 'Phân tích kỹ thuật',
    videoId: 'hVe_3TGrmpo',
    relatedTerms: ['candlestick', 'support-resistance', 'supply-demand'],
    basic: { definition: 'Phương pháp phân tích chỉ dựa trên biến động giá thuần túy: nến, S/R, trendline, mô hình — KHÔNG dùng indicator. Triết lý: "Price is King" — giá phản ánh tất cả thông tin. Indicator chỉ là "derivative" (phái sinh) từ giá, nên luôn chậm hơn price action.', example: 'BTC tạo Pin Bar dài (bóng 3x thân) + rejection tại kháng cự $73K → Short entry $72.8K, SL $73.5K mà không cần RSI hay MACD. Giá giảm 8% trong 3 ngày.', howToApply: '1. Bỏ hết indicator, chỉ dùng chart trắng + S/R\n2. Học đọc nến: ai đang kiểm soát — buyer hay seller?\n3. Tìm key level (S/R) + candlestick confirmation tại key level\n4. Entry khi có "trigger" (pin bar, engulfing, inside bar break)', commonMistakes: 'Phải hoàn toàn bỏ indicator — thực tế nên kết hợp PA + 1-2 indicator xác nhận. Giao dịch mọi tín hiệu PA — chỉ trade tại key level. Không kiên nhẫn chờ setup.' },
    advanced: {
      definition: 'ICT (Inner Circle Trader) và SMC (Smart Money Concepts) là phiên bản nâng cao của Price Action, tập trung vào cách "smart money" (institutional traders) vận hành: Order Blocks, Fair Value Gaps, Liquidity Sweeps, Market Structure Shift. Mục tiêu: trade cùng hướng với institutional money.',
      example: 'BTC sweep liquidity dưới $64K (quét SL retail) → tạo bullish Order Block → Fair Value Gap tại $65K-$66K → Long entry $65.5K khi giá fill FVG. Smart money đã accumulate xong → giá tăng 12% trong 5 ngày.',
      howToApply: '1. Xác định Market Structure (HH/HL = bullish, LH/LL = bearish)\n2. Tìm Order Blocks (nến cuối trước move impulsive)\n3. Xác định Fair Value Gaps (imbalance zones)\n4. Chờ Liquidity Sweep → Market Structure Shift → Entry tại Order Block/FVG',
      commonMistakes: 'Over-complicate với quá nhiều ICT concept — master 2-3 concept là đủ. Không xét HTF bias khi trade LTF. Coi mọi OB/FVG đều hợp lệ — cần thêm confluence.',
      proTips: ['Liquidity Sweep = Smart Money grab SL → sau đó reverse mạnh', 'Fair Value Gap fill rate ~70% — trade FVG fill là setup có xác suất cao', 'Market Structure Shift (MSS) trên HTF cho bias, entry trên LTF', 'Equal highs/equal lows = liquidity pool — giá SẼ quét qua trước khi đảo chiều'],
      keyTakeaways: ['Price Action = đọc được câu chuyện mua-bán qua nến và cấu trúc giá', 'Key level + PA trigger = entry chất lượng cao', 'SMC/ICT giúp hiểu hành vi của institutional traders', 'Kiên nhẫn là kỹ năng quan trọng nhất trong PA trading']
    },
  },
  'supply-demand': {
    term: 'Vùng Cung Cầu', english: 'Supply & Demand Zone', category: 'Phân tích kỹ thuật',
    videoId: 'pTksjJgKpBE',
    relatedTerms: ['support-resistance', 'price-action', 'volume'],
    basic: { definition: 'Vùng giá nơi lệnh mua/bán lớn tích tụ, tạo ra sự mất cân bằng cung cầu. Demand Zone (cầu): nơi lệnh mua nhiều hơn bán → giá tăng. Supply Zone (cung): nơi lệnh bán nhiều hơn mua → giá giảm. Khác S/R ở chỗ: Supply/Demand tập trung vào NGUYÊN NHÂN (lệnh), S/R tập trung vào KẾT QUẢ (đảo chiều).', example: 'Demand zone $62K-$63K: nến tăng mạnh lần đầu (move-away candle lớn) → chứng tỏ có lượng mua lớn. Khi giá quay lại vùng này → bounce vì còn lệnh mua chưa khớp.', howToApply: '1. Tìm nến lớn (impulsive move) rời khỏi một vùng giá\n2. Vùng giá trước nến lớn đó = Supply/Demand zone\n3. Chờ giá quay lại (pullback) vào zone\n4. Entry tại zone + SL ngoài zone', commonMistakes: 'Nhầm mọi S/R thành Supply/Demand — cần impulsive move rời khỏi zone mới hợp lệ. Zone đã bị test nhiều lần sẽ yếu đi (lệnh đã khớp hết). Không phân biệt fresh zone vs used zone.' },
    advanced: {
      definition: 'Rally-Base-Rally (RBR) = Demand continuation zone. Drop-Base-Drop (DBD) = Supply continuation zone. Rally-Base-Drop (RBD) = Supply reversal zone. Drop-Base-Rally (DBR) = Demand reversal zone. Reversal zones mạnh hơn continuation zones. Kết hợp Volume Profile để thấy Low Volume Nodes (LVN) = zone thật sự.',
      example: 'DBR zone tại $56K-$57K: giá giảm mạnh (drop), tạo base 3 nến nhỏ, rồi rally mạnh +15%. Zone này chưa bị retest = fresh zone. Khi giá quay lại → Long entry $56.5K, SL $55.5K, TP $62K. R:R = 1:5.5.',
      howToApply: '1. Phân loại zone: RBR, DBD, RBD, DBR\n2. Ưu tiên fresh zones (chưa bị retest)\n3. Reversal zones (RBD, DBR) > Continuation zones (RBR, DBD)\n4. Kết hợp Volume Profile: zone trùng LVN = institutional interest\n5. Multi-timeframe: HTF zone cho bias, LTF zone cho entry',
      commonMistakes: 'Trade zone đã bị test 2-3 lần — lệnh đã khớp, zone yếu. Không phân loại zone type. Quên rằng zone là VÙNG, không phải đường — entry cần flexibility.',
      proTips: ['Fresh zone + first retest = xác suất bounce cao nhất (~75%)', 'Zone mạnh nhất: move-away candle lớn + volume spike + trên HTF', 'Kết hợp Supply/Demand + Order Block + FVG = "triple confluence" setup A+'],
      keyTakeaways: ['Supply/Demand dựa trên unfilled orders — khác S/R truyền thống', 'Fresh zones > Used zones', 'Reversal zones (RBD, DBR) mạnh hơn Continuation zones', 'Kết hợp Volume Profile để validate zone']
    },
  },
  'breakout': {
    term: 'Breakout', english: 'Breakout Trading', category: 'Chiến lược giao dịch',
    videoId: 'HY5WmVpxkFo',
    relatedTerms: ['support-resistance', 'volume', 'bollinger-bands', 'chart-pattern'],
    basic: { definition: 'Khi giá phá vỡ qua vùng hỗ trợ hoặc kháng cự quan trọng với volume lớn, báo hiệu xu hướng mới bắt đầu. Breakout là "cánh cửa mở" cho một move lớn. Có 2 loại: Breakout thật (tiếp tục đi xa) và Fakeout (phá giả rồi quay lại).', example: 'ETH breakout trên $4,000 với volume tăng 250% so với trung bình. Giá đóng cửa H4 trên $4,050 → xác nhận breakout. Entry $4,060, SL $3,920, TP $4,400.', howToApply: '1. Xác định S/R quan trọng trên H4+\n2. Chờ nến đóng cửa trên/dưới S/R (không entry bằng bóng nến)\n3. Kiểm tra volume: cần > 2x trung bình 20 phiên\n4. Entry ngay hoặc chờ retest\n5. SL phía sau vùng S/R vừa phá', commonMistakes: 'FOMO vào ngay khi giá chạm S/R, không chờ nến đóng cửa xác nhận. Bỏ qua volume — breakout không volume = nghi ngờ fakeout. Entry trên LTF (M5) — breakout M5 thường là noise.' },
    advanced: {
      definition: 'Breakout with retest, failed breakout (fakeout trap), breakout từ consolidation dài (>20 nến). True Breakout cần volume > 2x trung bình + nến đóng ngoài S/R. Breakout sau Bollinger Squeeze có xác suất thành công cao nhất (~80%). Failed breakout (fakeout) có thể trade ngược lại — thường cho R:R rất tốt.',
      example: 'BTC consolidation 3 tuần trong range $65K-$68K → BB Squeeze → phá $68K + volume 3x → retest $68K hold → Long confirmed. TP1: Fib Ext 1.272 ($72K), TP2: 1.618 ($76K). R:R = 1:4.',
      howToApply: '1. Dùng multi-timeframe: breakout trên H4+ mới đáng tin\n2. Kết hợp Bollinger Squeeze + volume profile\n3. Entry 2 cách: (a) Aggressive — ngay khi nến breakout đóng, (b) Conservative — chờ retest rồi entry\n4. Failed breakout → trade ngược lại (fakeout reversal)',
      commonMistakes: 'Không phân biệt breakout thật vs fakeout. Cần volume > 2x trung bình 20 phiên. Breakout trên M5/M15 thường là noise — ưu tiên H4+. Entry aggressive mà không có SL.',
      proTips: ['Fakeout thường xảy ra khi volume thấp — luôn kiểm tra volume trước khi entry', 'Breakout sau consolidation dài (>20 nến) mạnh hơn nhiều so với consolidation ngắn', 'Đặt SL dưới/trên vùng consolidation thay vì ngay tại mức S/R vừa phá', 'BB Squeeze + Volume spike = setup breakout đáng tin nhất'],
      keyTakeaways: ['Volume là yếu tố xác nhận số 1 — không có volume = không tin', 'Retest sau breakout là entry an toàn nhất', 'Fakeout trap có thể trade ngược lại — failed breakout = reversal signal mạnh', 'Consolidation dài → breakout mạnh (tích lũy năng lượng)']
    },
  },
  'rsi': {
    term: 'RSI', english: 'Relative Strength Index', category: 'Chỉ báo kỹ thuật',
    videoId: 'wTOFr8WAMAQ',
    relatedTerms: ['divergence', 'macd', 'stochastic', 'bollinger-bands'],
    basic: { definition: 'RSI (Relative Strength Index) đo tốc độ và biên độ thay đổi giá trên thang 0-100. Được phát triển bởi J. Welles Wilder (1978). RSI > 70 = Quá mua (overbought) — giá có thể giảm. RSI < 30 = Quá bán (oversold) — giá có thể tăng. Mặc định dùng RSI 14 phiên.', example: 'BTC RSI 14 chạm 25 trên D1 tại vùng hỗ trợ $56K → vùng quá bán cực độ. Kết hợp nến Hammer → Long entry. Giá tăng 20% trong 10 ngày sau đó.', howToApply: '1. Thêm RSI (14) vào chart\n2. Quan sát vùng 70 (overbought) và 30 (oversold)\n3. Kết hợp RSI với S/R zone — RSI oversold + S/R support = setup mạnh\n4. RSI chỉ là 1 yếu tố xác nhận, KHÔNG trade RSI đơn lẻ', commonMistakes: 'Mua ngay khi RSI < 30 — trong downtrend mạnh, RSI có thể ở vùng quá bán rất lâu (RSI "dán" dưới 30). Dùng RSI đơn lẻ không kết hợp price action hoặc S/R.' },
    advanced: {
      definition: 'RSI Regular Divergence (báo đảo chiều): giá tạo đỉnh cao hơn nhưng RSI tạo đỉnh thấp hơn → momentum yếu đi → chuẩn bị giảm. Hidden Divergence (báo tiếp tục trend): giá đáy cao hơn nhưng RSI đáy thấp hơn → pullback sắp kết thúc, trend tiếp tục. RSI Failure Swing: RSI phá đỉnh/đáy trước đó — tín hiệu sớm hơn cả price action.',
      example: 'BTC tạo đỉnh $73K (RSI 78) → đỉnh $74K (RSI 65) = Bearish Regular Divergence trên D1. Momentum giảm dù giá tăng → 2 tuần sau giá giảm 18% về $60K. Tại $60K: Hidden Bullish Divergence trên H4 → xác nhận đáy → Long entry.',
      howToApply: '1. Kết hợp RSI divergence với S/R zone + volume cho entry\n2. Regular Divergence + S/R key level = counter-trend entry\n3. Hidden Divergence + trend direction = continuation entry (tin cậy hơn)\n4. RSI Failure Swing cho signal sớm nhất — RSI phá đỉnh/đáy trước giá',
      commonMistakes: 'Dùng RSI đơn lẻ không kết hợp price action. Divergence cần xác nhận bằng nến đảo chiều — đừng entry khi divergence chỉ mới hình thành (chưa confirm). RSI divergence trên M5 = noise.',
      proTips: ['RSI Failure Swing cho tín hiệu sớm hơn divergence 3-5 nến', 'Dùng RSI trên HTF (H4, D1) cho divergence — LTF quá nhiều noise', 'RSI 50 là "đường giữa" — giá trên 50 = bullish bias, dưới 50 = bearish bias', 'RSI 14 cho swing trade, RSI 7 cho scalping, RSI 21 cho position trade'],
      keyTakeaways: ['Regular Divergence = counter-trend, cần S/R confluence', 'Hidden Divergence = continuation, trade theo trend — đáng tin hơn Regular', 'Đừng entry chỉ vì RSI overbought/oversold — chờ price action xác nhận', 'RSI trên HTF (D1) divergence có xác suất thành công >70%']
    },
  },
  'macd': {
    term: 'MACD', english: 'Moving Average Convergence Divergence', category: 'Chỉ báo kỹ thuật',
    videoId: 'eob4rI0bVpg',
    relatedTerms: ['ema', 'rsi', 'divergence'],
    basic: { definition: 'MACD kết hợp trend-following và momentum. Công thức: MACD Line = EMA 12 - EMA 26. Signal Line = EMA 9 của MACD Line. Histogram = MACD Line - Signal Line. Khi MACD cắt lên Signal = mua (bullish crossover), cắt xuống = bán (bearish crossover). Zero-line crossover là tín hiệu mạnh hơn.', example: 'MACD cắt lên Signal Line + Histogram chuyển dương + giá trên EMA 200 → ba xác nhận đà tăng. Entry Long với SL dưới EMA 50.', howToApply: '1. Thêm MACD (12, 26, 9) vào chart\n2. Bullish: MACD cắt lên Signal + Histogram dương\n3. Bearish: MACD cắt xuống Signal + Histogram âm\n4. Zero-line crossover = tín hiệu mạnh hơn normal crossover\n5. Kết hợp với trend direction (EMA 200)', commonMistakes: 'MACD là lagging indicator — chậm hơn giá 3-5 nến. Không dùng MACD trong thị trường sideway — sẽ cho rất nhiều false signals. Dùng MACD crossover đơn thuần mà không xét context.' },
    advanced: {
      definition: 'MACD Histogram Divergence phát hiện momentum yếu đi sớm hơn MACD line crossover. Zero-line rejection: MACD chạm zero rồi bật lại = trend continuation cực mạnh (momentum vẫn intact). Multi-timeframe MACD: HTF cho direction, LTF cho entry timing.',
      example: 'D1 MACD trên zero (bullish bias) + H4 MACD crossover up = Long entry timing. Histogram D1 đang giảm dần (momentum yếu) nhưng chưa cross zero → trend vẫn intact nhưng chuẩn bị pullback.',
      howToApply: '1. MACD Histogram divergence cho tín hiệu sớm nhất — so sánh histogram peaks\n2. Zero-line acts as dynamic support/resistance cho MACD\n3. MACD + BB Squeeze = combo mạnh: squeeze + MACD crossover = high probability breakout\n4. MTF: D1 MACD direction + H4 MACD entry timing',
      commonMistakes: 'Sử dụng MACD crossover đơn thuần mà không xét market context. Trong sideway market, MACD cho rất nhiều false signals (whipsaw). MACD lag nhiều trên LTF (M5, M15) — ưu tiên H1+.',
      proTips: ['MACD Histogram divergence sớm hơn MACD line divergence 3-5 nến', 'Zero-line rejection là tín hiệu continuation mạnh nhất của MACD', 'Dùng MACD settings (5, 13, 1) cho scalping — phản ứng nhanh hơn default', 'MACD + RSI confirmation = combo indicator kinh điển'],
      keyTakeaways: ['MACD là trend-following indicator — chỉ dùng trong trending market', 'Histogram cho tín hiệu sớm nhất → MACD line → zero-line', 'Multi-timeframe MACD: HTF direction + LTF entry = setup tin cậy', 'MACD + Bollinger Squeeze = high probability breakout setup']
    },
  },
  'bollinger-bands': {
    term: 'Bollinger Bands', english: 'Bollinger Bands', category: 'Chỉ báo kỹ thuật',
    videoId: '3sGVjR-Jf3s',
    relatedTerms: ['rsi', 'breakout', 'ema'],
    basic: { definition: '3 dải biến động do John Bollinger phát minh: Middle Band = SMA 20, Upper Band = SMA 20 + 2σ (độ lệch chuẩn), Lower Band = SMA 20 - 2σ. Khoảng 95% giá nằm trong dải. Khi dải siết lại (BB Squeeze) = volatility thấp, báo hiệu biến động lớn sắp xảy ra. Khi dải mở rộng = volatility cao.', example: 'BB siết lại 2 tuần (Bandwidth < 4%) → giá phá lên dải trên với volume lớn → Breakout xác nhận, dải mở rộng → xu hướng tăng bắt đầu.', howToApply: '1. Thêm BB (20, 2) vào chart\n2. Squeeze (dải siết): chuẩn bị cho breakout\n3. Trong range market: mua dải dưới, bán dải trên (Mean Reversion)\n4. Trong trend market: giá "đi dạo" trên dải = uptrend mạnh\n5. Kết hợp RSI để xác nhận overbought/oversold', commonMistakes: 'Giá chạm dải trên ≠ bán ngay. Trong uptrend, giá có thể "walking the band" — đi dạo trên dải trên rất lâu. Squeeze không cho biết hướng breakout — cần indicator momentum (RSI, MACD) để xác nhận hướng.' },
    advanced: {
      definition: 'BB %B indicator (0-1) cho biết vị trí giá trong dải: %B > 1 = giá trên dải trên, %B < 0 = giá dưới dải dưới. Bandwidth indicator đo độ rộng dải — giá trị cực thấp = Squeeze cực mạnh. TTM Squeeze: khi BB nằm trong Keltner Channel = Squeeze cực mạnh, xác suất breakout lớn >80%.',
      example: 'BB nằm trong Keltner Channel (TTM Squeeze kích hoạt) → Squeeze 15 nến → TTM histogram dương + chuyển xanh → Breakout tăng mạnh 12% trong 3 ngày. %B tăng từ 0.5 → 1.2 → momentum cực mạnh.',
      howToApply: '1. TTM Squeeze (BB + Keltner) phát hiện breakout sớm — setup tin cậy nhất\n2. BB %B > 1 = overbought extension, < 0 = oversold extension\n3. Bandwidth < 4% → chuẩn bị cho explosive move\n4. Mean Reversion trong range: entry khi %B < 0.05, exit khi %B > 0.95',
      commonMistakes: 'BB hoạt động kém trong trending market mạnh — giá "walk the band". Squeeze không cho biết hướng — cần momentum indicator (MACD histogram). Dùng BB trên M1/M5 = quá nhiều noise.',
      proTips: ['TTM Squeeze là một trong những setup breakout đáng tin cậy nhất', 'BB Bandwidth cực thấp (< 4%) = volatility sắp bùng nổ — tuyệt đối không bỏ qua', 'Trong sideway: Mean Reversion — mua dải dưới, bán dải trên, SL ngoài dải', 'Double Bollinger Bands (BB 20,1 + BB 20,2) cho thấy momentum zones rõ hơn'],
      keyTakeaways: ['Squeeze = biến động lớn sắp xảy ra, nhưng không cho biết hướng', 'TTM Squeeze (BB + Keltner) mạnh hơn BB Squeeze đơn thuần', 'Trend market: trade breakout. Range market: trade mean reversion', 'Bandwidth < 4% + MACD crossover = high probability setup']
    },
  },
  'ema': {
    term: 'EMA', english: 'Exponential Moving Average', category: 'Chỉ báo kỹ thuật',
    videoId: '05Rl2YajcVs',
    relatedTerms: ['macd', 'bollinger-bands', 'ichimoku'],
    basic: { definition: 'EMA phản ứng nhanh hơn SMA vì cho trọng số lớn hơn cho giá gần nhất. Các EMA phổ biến: EMA 9 (scalping), EMA 21 (swing ngắn), EMA 50 (trend trung hạn), EMA 200 (trend dài hạn). Golden Cross: EMA ngắn cắt lên EMA dài = tín hiệu mua mạnh. Death Cross: ngược lại.', example: 'EMA 9 cắt lên EMA 21 trên H4 (Golden Cross ngắn hạn) + giá trên EMA 200 → tín hiệu mua. Entry tại EMA 21, SL dưới EMA 50.', howToApply: '1. Thêm EMA 21, 50, 200 vào chart\n2. Giá trên EMA 200 = bullish bias, dưới = bearish\n3. EMA 9 cắt EMA 21 = tín hiệu ngắn hạn\n4. EMA 50 cắt EMA 200 = tín hiệu dài hạn (Golden/Death Cross)\n5. EMA hoạt động như dynamic S/R — giá bounce từ EMA', commonMistakes: 'Trade EMA crossover trong sideway market = nhiều false signals. EMA 50/200 crossover chậm — khi xảy ra thì giá đã đi xa. Không phân biệt trend mạnh vs trend yếu bằng EMA spacing.' },
    advanced: {
      definition: 'EMA Ribbon (nhiều EMA xếp song song) cho thấy sức mạnh trend: ribbon mở rộng = trend mạnh, ribbon siết lại = trend yếu/sắp đảo chiều. Dynamic S/R từ EMA: EMA 21 cho scalping, EMA 50 cho swing, EMA 200 cho position. Khoảng cách giá-EMA 200 = đo mức "stretch" — giá xa EMA 200 quá sẽ mean-revert.',
      example: 'EMA Ribbon (9, 13, 21, 34, 50) xếp đẹp theo thứ tự tăng → trend bullish mạnh. Khi EMA 9 bắt đầu flatten và chạm EMA 21 → trend đang yếu, chuẩn bị correction hoặc consolidation.',
      howToApply: '1. EMA 200 trên D1: trend filter — chỉ Long trên EMA 200, Short dưới EMA 200\n2. EMA 21 trên H4: dynamic S/R cho swing entry\n3. EMA Ribbon cho visual confirmation sức mạnh trend\n4. Giá > 10% xa EMA 200 → chuẩn bị cho mean reversion pullback',
      commonMistakes: 'Dùng quá nhiều EMA gây rối chart. EMA crossover trên M5 = noise. Quên rằng EMA là lagging — nó xác nhận, không dự đoán.',
      proTips: ['EMA 200 trên D1 là "line in the sand" — institutional traders dùng để define trend', 'EMA 21 trên H4 là dynamic S/R phổ biến nhất cho swing trading', 'Khoảng cách EMA 9/21 cho thấy momentum: xa = mạnh, gần/cross = yếu', 'Golden Cross (EMA 50/200) trên D1/W1 chỉ xảy ra 1-2 lần/năm — rất đáng tin'],
      keyTakeaways: ['EMA 200 D1 = trend filter quan trọng nhất', 'EMA hoạt động như dynamic S/R — giá bounce từ EMA key', 'EMA Ribbon cho visual trend strength assessment', 'EMA crossover + volume + S/R confluence = high probability entry']
    },
  },
  'divergence': {
    term: 'Phân Kỳ', english: 'Divergence', category: 'Chỉ báo kỹ thuật',
    videoId: 'f4CqFjfHGEs',
    relatedTerms: ['rsi', 'macd', 'stochastic'],
    basic: { definition: 'Phân kỳ xảy ra khi giá và indicator đi ngược hướng nhau — dấu hiệu momentum đang yếu đi. Regular Divergence: báo hiệu đảo chiều sắp tới. Hidden Divergence: báo hiệu xu hướng sẽ tiếp tục sau pullback. Dùng RSI hoặc MACD để phát hiện.', example: 'BTC tạo đỉnh $73K rồi đỉnh mới $74K, nhưng RSI tạo đỉnh 78 rồi 65 (thấp hơn) → Bearish Regular Divergence → giá giảm 18% trong 2 tuần sau.', howToApply: '1. So sánh peaks/troughs trên giá vs peaks/troughs trên RSI/MACD\n2. Regular Bearish Div: giá đỉnh cao hơn + RSI đỉnh thấp hơn → sắp giảm\n3. Regular Bullish Div: giá đáy thấp hơn + RSI đáy cao hơn → sắp tăng\n4. Chờ xác nhận bằng nến đảo chiều trước khi entry', commonMistakes: 'Entry ngay khi thấy divergence mà không chờ confirm — divergence có thể kéo dài nhiều nến. Tìm divergence trên M5/M15 = noise. Quên kết hợp S/R context.' },
    advanced: {
      definition: 'Hidden Divergence (ít người biết nhưng cực kỳ hữu ích): Hidden Bullish Div: giá đáy cao hơn + RSI đáy thấp hơn → uptrend sẽ tiếp tục. Hidden Bearish Div: giá đỉnh thấp hơn + RSI đỉnh cao hơn → downtrend sẽ tiếp tục. Hidden Div trade THEO trend nên xác suất thành công cao hơn Regular Div.',
      example: 'BTC uptrend pullback: giá tạo higher low $64K (vs $60K trước) nhưng RSI tạo lower low 35 (vs 40 trước) → Hidden Bullish Divergence → uptrend continues → giá tăng từ $64K → $72K.',
      howToApply: '1. Regular Div: trade counter-trend — cần S/R key level confluence\n2. Hidden Div: trade with-trend — đáng tin hơn, R:R tốt hơn\n3. Ưu tiên divergence trên H4/D1\n4. Divergence + S/R key level + candlestick confirmation = "A+ setup"',
      commonMistakes: 'Nhầm Regular và Hidden Divergence. Regular Div xuất hiện ở đỉnh/đáy trend. Hidden Div xuất hiện ở pullback trong trend. Bỏ qua Hidden Div — thực tế nó đáng tin hơn Regular.',
      proTips: ['Hidden Divergence có winrate cao hơn Regular vì trade theo trend', 'Divergence trên D1 RSI có xác suất >70% thành công', 'Double Divergence (2 lần div liên tiếp) = tín hiệu cực mạnh', 'MACD histogram divergence sớm hơn MACD line divergence 3-5 nến'],
      keyTakeaways: ['Regular Div = counter-trend reversal signal', 'Hidden Div = trend continuation — tin cậy hơn Regular', 'Chờ price action confirmation (nến đảo chiều) trước khi entry', 'HTF divergence (H4/D1) > LTF divergence (M5/M15)']
    },
  },
  'ichimoku': {
    term: 'Ichimoku Cloud', english: 'Ichimoku Kinko Hyo', category: 'Chỉ báo kỹ thuật',
    videoId: 'f3OJF4P6Xbc',
    relatedTerms: ['ema', 'rsi', 'macd'],
    basic: { definition: 'Hệ thống indicator toàn diện "nhìn một cái biết tất cả" gồm 5 thành phần: Tenkan-sen (9) = tín hiệu ngắn hạn, Kijun-sen (26) = tín hiệu trung hạn, Senkou Span A & B tạo "mây" (cloud), Chikou Span (26) kiểm tra quá khứ. Giá trên mây = bullish, dưới mây = bearish, trong mây = neutral.', example: 'BTC trên mây xanh dày (bullish) + Tenkan cắt lên Kijun (TK Cross bullish) + Chikou Span trên giá → tất cả 5 yếu tố đồng thuận → xu hướng tăng mạnh, xác suất cao.', howToApply: '1. Giá trên mây → chỉ Long. Dưới mây → chỉ Short\n2. TK Cross (Tenkan cắt Kijun) cho entry timing\n3. Mây dày = S/R mạnh. Mây mỏng = S/R yếu, dễ phá\n4. Chikou Span trên giá = bullish confirmation\n5. Tốt nhất trên H4/D1 cho swing trading', commonMistakes: 'Dùng Ichimoku trên M5/M15 — settings gốc (9, 26, 52) được thiết kế cho D1. Chỉ nhìn mây mà bỏ qua Chikou Span. Giao dịch khi giá TRONG mây (vùng trung lập).' },
    advanced: {
      definition: 'Kumo Twist (mây đổi màu) báo hiệu thay đổi trend trong tương lai vì mây "nhìn trước" 26 phiên. Edge-to-Edge trade: khi giá vào mây → target ra khỏi mây phía bên kia. Kijun bounce = dynamic S/R trade. Multi-timeframe Ichimoku: W1 mây cho bias dài hạn, D1/H4 cho entry.',
      example: 'W1 mây xanh (bullish long-term) + D1 giá bounce từ Kijun-sen ($65K) + TK Cross bullish trên D1 → Long entry $65.5K, SL dưới mây D1 ($62K), TP tại Senkou Span A tuần sau ($72K). R:R = 1:2.',
      howToApply: '1. W1/M1 Ichimoku cho trend direction\n2. D1 Kijun bounce cho entry\n3. Kumo Twist cho early warning thay đổi trend\n4. Edge-to-Edge cho target khi giá đang trong mây\n5. Flat Kijun = magnet level — giá sẽ quay lại',
      commonMistakes: 'Settings Ichimoku cho crypto nên thay đổi: (20, 60, 120) vì crypto giao dịch 7 ngày/tuần (không phải 5 như stock). Bỏ qua Kumo Twist — nó cho thấy S/R trong tương lai. Không dùng multi-timeframe.',
      proTips: ['Flat Kijun-sen = "magnet level" — giá gần như luôn quay lại test mức này', 'Mây tương lai cho thấy S/R 26 phiên sau — trader Ichimoku "nhìn trước" market', 'TK Cross TRÊN mây = strong signal, DƯỚI mây = weak signal, TRONG mây = tránh', 'Crypto settings (20, 60, 120) có thể cho signal tốt hơn default (9, 26, 52)'],
      keyTakeaways: ['Ichimoku là hệ thống toàn diện — không cần thêm indicator khác', 'Mây = S/R động + nhìn trước 26 phiên', 'TK Cross + Cloud position + Chikou = đồng thuận → high probability', 'Tốt nhất trên D1/W1 cho swing/position trading']
    },
  },
  'stochastic': {
    term: 'Stochastic', english: 'Stochastic Oscillator', category: 'Chỉ báo kỹ thuật',
    videoId: 'TrLbEAaGmco',
    relatedTerms: ['rsi', 'divergence', 'macd'],
    basic: { definition: 'Stochastic Oscillator so sánh giá đóng cửa với dải giá trong N phiên (mặc định 14). %K = đường nhanh, %D = đường chậm (SMA 3 của %K). %K > 80 = quá mua, %K < 20 = quá bán. Khi %K cắt %D = tín hiệu giao dịch.', example: '%K cắt lên %D tại vùng 15 (oversold) + giá tại S/R support → tín hiệu mua. Entry Long, SL dưới support.', howToApply: '1. Thêm Stochastic (14, 3, 3) vào chart\n2. %K cắt lên %D dưới 20 → mua\n3. %K cắt xuống %D trên 80 → bán\n4. Chỉ trade tín hiệu cùng hướng trend chính\n5. Kết hợp S/R zone cho entry chính xác', commonMistakes: 'Dùng Stochastic trong trend mạnh — %K có thể "dán" trên 80 trong uptrend dài. Trade mọi crossover mà không xét trend context. Nhầm lẫn Stochastic và RSI — Stochastic nhạy hơn RSI.' },
    advanced: {
      definition: 'Stochastic Divergence: tương tự RSI Divergence nhưng nhạy hơn (cho signal sớm hơn). Stochastic Pop: %K vượt 80 rồi quay lại = trend mạnh đang pullback (trong uptrend). Multi-timeframe Stochastic: D1 cho direction, H4 cho timing.',
      example: 'D1 Stochastic trên 50 (bullish bias) + H4 Stochastic crossover up tại 20 (oversold bounce) → Long entry. Giá tăng 5% trong 2 ngày. Stochastic bullish divergence tại $60K (D1) xác nhận đáy.',
      howToApply: '1. D1 Stochastic > 50 = bullish bias, < 50 = bearish\n2. H4 Stochastic crossover tại oversold/overbought cho entry\n3. Stochastic divergence cho reversal signal sớm hơn RSI\n4. Stochastic Pop strategy cho momentum continuation',
      commonMistakes: 'Stochastic nhạy hơn RSI = nhiều false signals hơn → cần filter. Slow Stochastic (14, 3, 3) ổn hơn Fast Stochastic. Không dùng Stochastic đơn lẻ trong trending market.',
      proTips: ['Stochastic + RSI confirmation = "double momentum filter" mạnh', 'Stochastic tốt hơn RSI trong ranging market, RSI tốt hơn trong trending', 'Multi-timeframe Stochastic: Weekly > Daily > H4 cho alignment', 'Stochastic trên W1 cho thấy cycle lớn — rất hữu ích cho position trading'],
      keyTakeaways: ['Stochastic nhạy hơn RSI — tốt cho ranging market', '%K cắt %D + S/R zone = entry có xác suất cao', 'Trong trend mạnh, Stochastic "dán" overbought/oversold = bình thường', 'Multi-timeframe alignment tăng winrate đáng kể']
    },
  },
  'volume': {
    term: 'Khối Lượng', english: 'Volume', category: 'Cơ bản',
    videoId: 'YHxVCpX50qQ',
    relatedTerms: ['liquidity', 'breakout', 'supply-demand'],
    basic: { definition: 'Volume = tổng số lượng tài sản được giao dịch trong 1 khoảng thời gian. Volume là "nhiên liệu" của xu hướng giá. Quy tắc vàng: Giá tăng + Volume tăng = xu hướng mạnh (tin cậy). Giá tăng + Volume giảm = xu hướng yếu (cảnh báo đảo chiều). Volume spike = sự kiện bất thường, cần chú ý.', example: 'BTC breakout $68K + volume 3x trung bình 20 ngày → breakout thật, xu hướng tăng mạnh. Ngược lại: BTC tăng từ $65K lên $68K nhưng volume giảm dần → warning sign, có thể fakeout.', howToApply: '1. Luôn xem volume khi phân tích chart — volume xác nhận mọi thứ\n2. Breakout + volume > 2x trung bình = tin cậy\n3. Volume spike tại S/R = dấu hiệu institutional activity\n4. Volume giảm dần trong trend = trend đang yếu\n5. Volume climax (spike lớn) thường đánh dấu đỉnh/đáy', commonMistakes: 'Bỏ qua volume khi trade — nhiều trader chỉ nhìn giá mà quên volume. Trade breakout không kiểm tra volume. Không phân biệt volume spike và volume trend.' },
    advanced: {
      definition: 'Volume Profile: phân bổ volume theo MỨC GIÁ (không theo thời gian). POC (Point of Control) = mức giá có volume cao nhất → "fair value". VAH/VAL (Value Area High/Low) = vùng 70% volume tập trung. High Volume Node (HVN) = S/R mạnh, Low Volume Node (LVN) = giá di chuyển nhanh qua. On Balance Volume (OBV) theo dõi dòng tiền tích lũy.',
      example: 'Volume Profile cho thấy POC tại $66K (fair value). Giá dưới $66K → undervalued → Long bias. VAH $68K (kháng cự), VAL $64K (hỗ trợ). LVN tại $62K → giá sẽ rớt nhanh qua vùng này nếu mất $64K.',
      howToApply: '1. Volume Profile cho S/R chính xác hơn S/R truyền thống\n2. POC = fair value → giá luôn có xu hướng quay về POC\n3. HVN = S/R mạnh, LVN = air pocket (giá chạy nhanh)\n4. OBV divergence cho thấy smart money accumulation/distribution sớm',
      commonMistakes: 'Dùng volume theo thời gian mà bỏ qua Volume Profile. Không hiểu POC concept. Bỏ qua LVN — đây là vùng giá có thể di chuyển cực nhanh (ít thanh khoản).',
      proTips: ['Volume Profile POC = "magnet" — giá luôn có xu hướng quay về POC', 'LVN (Low Volume Node) = vùng nguy hiểm — giá xuyên qua rất nhanh', 'OBV tăng khi giá sideway = smart money accumulation → sắp tăng', 'VWAP (Volume Weighted Average Price) là benchmark institutional — giá trên VWAP = bullish intraday'],
      keyTakeaways: ['Volume xác nhận mọi price action — "Volume is King"', 'Volume Profile cho S/R chính xác từ institutional order flow', 'POC = fair value, HVN = S/R, LVN = air pocket', 'OBV divergence phát hiện smart money trước price action']
    },
  },
  'stop-loss': {
    term: 'Cắt Lỗ', english: 'Stop Loss', category: 'Quản lý rủi ro',
    videoId: '9l1fCO0AbJs',
    relatedTerms: ['take-profit', 'risk-reward', 'position-sizing', 'trailing-stop'],
    basic: { definition: 'Stop Loss (SL) là lệnh tự động đóng vị thế khi giá đạt mức lỗ đã định trước. SL bảo vệ vốn và là quy tắc #1 của risk management. Không có SL = đánh bạc, không phải trading. Đặt SL tại mức mà setup trade bị invalidate (không còn hợp lệ).', example: 'Entry BTC Long $67K. Hỗ trợ gần nhất $65.5K. Đặt SL tại $65,300 (dưới support, buffer 0.3%). Risk = 2.5%. Nếu giá break $65.3K, setup không còn hợp lệ → chấp nhận lỗ nhỏ để bảo vệ vốn lớn.', howToApply: '1. XÁC ĐỊNH SL TRƯỚC KHI VÀO LỆNH — SL là quyết định đầu tiên, không phải cuối cùng\n2. Đặt SL tại mức S/R + buffer (0.3-0.5%)\n3. Không dời SL xa hơn khi đang lỗ — đây là "averaging down" ngụy trang\n4. SL nên risk tối đa 1-2% tổng vốn/lệnh\n5. Dùng lệnh SL tự động, không cắt lỗ bằng tay', commonMistakes: 'Không đặt SL → "hy vọng" giá quay lại → lỗ ngày càng lớn. Đặt SL quá gần → bị "quét" bởi noise. Dời SL xa hơn khi đang lỗ. Đặt SL tại mức giá tròn ($65K) nơi mọi người cùng đặt → easy liquidity grab.' },
    advanced: {
      definition: 'SL dựa trên ATR (Average True Range): SL = Entry ± 1.5-2x ATR. Khi volatility cao, SL rộng hơn để tránh bị quét. SL dưới/trên swing low/high gần nhất. Cluster SL: tránh đặt SL tại vùng mà nhiều người cùng đặt (round numbers, obvious S/R) → smart money sẽ "hunt" stops tại đây.',
      example: 'ATR 14 của BTC = $1,200. Entry $67K Long. SL dựa ATR: $67K - 1.5 × $1,200 = $65,200. SL dựa swing low: swing low $65.5K → SL $65,200 (trùng!). Confluence SL = chất lượng cao. Risk = 2.7%.',
      howToApply: '1. Dùng ATR để set SL phù hợp volatility hiện tại\n2. SL dưới/trên swing structure (swing low/high)\n3. Tránh đặt SL tại round numbers ($65K) → dời 0.3% thêm\n4. SL trong mây Ichimoku = ý tưởng tốt (dynamic SL level)\n5. Break-even SL: khi giá đi đúng hướng > 1R → dời SL về entry',
      commonMistakes: 'SL quá gần (tight) trong thị trường volatile → bị quét liên tục. SL quá xa → risk quá lớn → position size sai. Không dời SL về break-even khi có cơ hội. Đặt SL tại "obvious" level → bị stop hunt.',
      proTips: ['ATR-based SL thích ứng với volatility — tốt hơn fixed % SL', 'Dời SL dưới/trên swing structure mới hình thành (trailing theo structure)', 'Stop hunt thường xảy ra trước các move lớn — SL bị quét ≠ sai hướng', 'Risk per trade KHÔNG BAO GIỜ > 2% account — quy tắc sống còn'],
      keyTakeaways: ['SL là quyết định ĐẦU TIÊN — xác định trước khi vào lệnh', 'ATR-based SL thích ứng với market conditions', 'Tránh SL tại obvious levels → smart money hunts stops', 'Max risk 1-2% account/trade — không ngoại lệ']
    },
  },
  'risk-reward': {
    term: 'Tỷ Lệ R:R', english: 'Risk/Reward Ratio', category: 'Quản lý rủi ro',
    videoId: 'N78u7jyJi2I',
    relatedTerms: ['stop-loss', 'take-profit', 'position-sizing'],
    basic: { definition: 'R:R = (Target - Entry) / (Entry - Stop Loss). Là tỷ lệ giữa phần thưởng kỳ vọng và rủi ro chấp nhận. R:R tối thiểu nên 1:2 (risk $1 để có cơ hội kiếm $2). Với R:R 1:3, chỉ cần đúng 30% lệnh vẫn có lãi tổng thể.', example: 'Entry BTC $67K, SL $66K (risk $1K), TP $70K (reward $3K) → R:R = 1:3 ✅. Nếu đúng 4/10 lệnh: +4×$3K - 6×$1K = +$6K. R:R tốt cho phép sai nhiều mà vẫn lãi.', howToApply: '1. TÍNH R:R TRƯỚC KHI ENTRY — nếu R:R < 1:2, bỏ qua setup\n2. R:R = (TP - Entry) / (Entry - SL)\n3. R:R 1:2 = minimum, 1:3 = tốt, 1:5 = xuất sắc\n4. Kết hợp R:R với winrate: R:R 1:2 + winrate 40% = profitable\n5. Không chase entry làm R:R xấu đi', commonMistakes: 'Entry muộn (chase) → R:R xấu đi. Đặt TP không dựa trên S/R thực tế → target ảo. Chỉ nhìn R:R mà quên winrate — R:R 1:10 nhưng winrate 5% = thua.' },
    advanced: {
      definition: 'Expectancy = (Winrate × Avg Win) - (Lossrate × Avg Loss). Đây mới là metric thực sự quan trọng. Expectancy > 0 = hệ thống profitable. Partial TP giúp tối ưu: TP1 (chốt 50% tại 1R), TP2 (25% tại 2R), TP3 (25% trailing). Kelly Criterion tính optimal position size dựa trên winrate và R:R.',
      example: 'Winrate 45%, R:R trung bình 1:2.5. Expectancy = (0.45 × 2.5R) - (0.55 × 1R) = 1.125 - 0.55 = +0.575R/trade. Sau 100 trade: +57.5R profit. Kelly Criterion: f* = (0.45 × 2.5 - 0.55) / 2.5 = 23% — risk 23% account/trade (thực tế dùng fractional Kelly: 5-10%).',
      howToApply: '1. Track mọi trade để tính Expectancy thực tế\n2. Partial TP: TP1 (1R, 50%), TP2 (2R, 25%), TP3 (3R+, trailing 25%)\n3. Expectancy > 0.3R = hệ thống tốt\n4. Kelly Criterion / 4 = conservative position sizing\n5. Adjust R:R target dựa trên thực tế backtest, không phải lý thuyết',
      commonMistakes: 'Chỉ focus vào winrate mà quên R:R — winrate 80% + R:R 1:0.5 = có thể vẫn lỗ. Không track Expectancy. Full Kelly Criterion = quá aggressive → dùng 1/4 Kelly.',
      proTips: ['Expectancy > 0 mới là metric duy nhất quan trọng — không phải winrate', 'Partial TP strategy giúp bảo toàn lợi nhuận + maximize upside', 'Backtest R:R trên 100+ trades trước khi live — xác nhận Expectancy > 0', 'R:R 1:3 + winrate 35% = profitable. R:R 1:1 cần winrate > 55%'],
      keyTakeaways: ['R:R minimum 1:2 — không ngoại lệ', 'Expectancy = metric thực sự quan trọng, không phải winrate đơn lẻ', 'Partial TP (1R/2R/trailing) tối ưu hóa risk-reward thực tế', 'Track mọi trade → tính Expectancy → optimize hệ thống']
    },
  },
  'leverage': {
    term: 'Đòn Bẩy', english: 'Leverage', category: 'Giao dịch phái sinh',
    videoId: '0yW5kpJDIcI',
    relatedTerms: ['margin', 'liquidation', 'futures', 'position-sizing'],
    basic: { definition: 'Vay vốn từ sàn để giao dịch lớn hơn vốn thực. 10x = kiểm soát vị thế gấp 10 lần. Lãi VÀ lỗ đều nhân lên tương ứng. Ví dụ: vốn $1,000 × 10x = vị thế $10,000. Giá tăng 5% → lãi $500 (50% vốn). Giá giảm 10% → mất 100% vốn (liquidation). Leverage là con dao 2 lưỡi — cực kỳ nguy hiểm nếu không có quản lý rủi ro.', example: 'Vốn $1,000 × 20x = Vị thế $20,000. Giá giảm 5% → mất 100% vốn (liquidation!). Nhưng với 3x: giá giảm 5% → lỗ 15% = $150. Vẫn còn $850 để trade tiếp.', howToApply: '1. Người mới: tối đa 3-5x\n2. Chuyên nghiệp: 5-20x với SL chặt chẽ\n3. KHÔNG BAO GIỜ dùng 50-125x (đánh bạc)\n4. Tính position size dựa trên risk management, KHÔNG dựa trên leverage\n5. LUÔN dùng Isolated Margin', commonMistakes: 'Dùng đòn bẩy cao (50x+) → liquidation nhanh chóng. Đòn bẩy KHÔNG tăng lợi nhuận — nó tăng SIZE và RỦI RO. Cross Margin mặc định → 1 vị thế liquidation mất toàn bộ account. Không tính position size.' },
    advanced: {
      definition: 'Cross Margin vs Isolated Margin: Cross dùng toàn bộ balance làm margin → 1 vị thế liquidation có thể mất hết account. Isolated chỉ dùng margin riêng cho mỗi vị thế → giới hạn rủi ro. Effective Leverage = Total Position / Total Equity. Kelly Criterion và Optimal f cho thấy leverage lý tưởng thường < 5x ngay cả cho professional traders.',
      example: 'Isolated 10x: vốn $1K, tối đa mất $1K. Cross 10x với balance $10K: liquidation 1 vị thế kéo toàn bộ $10K. Pro setup: Isolated + SL → risk $100 (1% account), entry $67K, SL $66K → position size = $10K = 10x leverage trên $1K margin.',
      howToApply: '1. LUÔN dùng Isolated Margin\n2. Effective Leverage nên < 5x\n3. Tính position size: Risk Amount / (Entry - SL) = Size\n4. Ví dụ: risk $100, SL 2% → size $5,000 = 5x leverage trên $1K\n5. Position size TRƯỚC, leverage SAU — không phải ngược lại',
      commonMistakes: 'Dùng Cross Margin mặc định không biết → catastrophic loss. Nhầm leverage = profit multiplier — thực tế là risk multiplier. Không tính Effective Leverage. Sàn cho 125x ≠ nên dùng 125x.',
      proTips: ['Effective Leverage < 5x là nguyên tắc vàng — ngay cả khi sàn cho 125x', 'Position Size Calculator: Risk% × Account / SL distance = Correct Size', 'Trailing Stop + Isolated Margin = combo an toàn nhất cho futures trading', 'Pro traders dùng 2-5x leverage + strict SL — KHÔNG PHẢI 50-100x'],
      keyTakeaways: ['Leverage KHÔNG tăng lợi nhuận — nó tăng SIZE và RỦI RO', 'Isolated Margin > Cross Margin trong 99% trường hợp', 'Tính position size dựa trên risk management, KHÔNG dựa trên leverage', 'Effective Leverage < 5x cho long-term survival']
    },
  },
  'scalping': {
    term: 'Scalping', english: 'Scalping', category: 'Chiến lược giao dịch',
    videoId: 'qGIgJO0po1Q',
    relatedTerms: ['swing-trading', 'breakout', 'volume'],
    basic: { definition: 'Giao dịch siêu ngắn (vài giây → vài phút), kiếm lợi nhuận nhỏ (0.1-0.5%) nhưng giao dịch rất nhiều lần/ngày (20-100 lệnh). Yêu cầu: tốc độ nhanh, sàn phí thấp, internet ổn định, và kỷ luật cắt lỗ tuyệt đối. Scalping là style khó nhất — không dành cho người mới.', example: 'Scalp BTC khung M1: giá chạm EMA 9 + volume spike → Long entry. TP +0.2% ($134 trên $67K). SL -0.1% ($67). Lặp lại 30 lần/ngày = $4,020 gross, trừ phí ~$600 = ~$3,400 net/ngày trên $50K account.', howToApply: '1. Dùng khung M1-M5\n2. Chọn sàn phí thấp (maker fee < 0.02%)\n3. Cần internet tốc độ cao và VPS gần server sàn\n4. Kỷ luật cắt lỗ NGAY — không giữ lệnh lỗ\n5. Đặt daily loss limit (ví dụ: -2% account) → dừng khi chạm', commonMistakes: 'Để lệnh lỗ chạy ("hy vọng" giá quay lại). Phí giao dịch ăn hết lợi nhuận nếu dùng market order. Overtrade khi thua → revenge trading. Scalp trong giờ volume thấp → spread rộng, slippage lớn.' },
    advanced: {
      definition: 'Order Book Scalping: đọc DOM (Depth of Market) để thấy lệnh chờ lớn, spoofing, iceberg orders → anticipate direction trước khi giá di chuyển. Tape Reading: theo dõi Time & Sales để thấy giao dịch lớn real-time (institutional prints). Footprint Chart: kết hợp price + volume tại mỗi mức giá — nhìn thấy ai đang kiểm soát (buyer/seller).',
      example: 'DOM hiện sell wall 500 BTC tại $68K → wall bị rút (spoofing) → giá sẽ phá $68K → Long scalp entry $67.9K → TP $68.3K (2 phút). Footprint Chart hiện delta âm lớn tại $68K (aggressive selling) nhưng wall biến mất → trap → reverse Long.',
      howToApply: '1. Setup: M1 chart + DOM + Time & Sales + Footprint\n2. Đọc DOM: wall lớn = S/R tạm thời, wall biến mất = spoofing trap\n3. Time & Sales: institutional prints > 10 BTC = theo dõi\n4. Footprint: delta dương = buyer control, âm = seller control\n5. Cần VPS gần server sàn để giảm latency',
      commonMistakes: 'Scalping mà không tính phí + slippage — maker/taker fee ăn 50%+ profit. Cần winrate > 60% và R:R tối thiểu 1:1.5. Overtrade khi thua → revenge trading. Scalp trong giờ thấp volume (Asian session) → khó kiếm lời.',
      proTips: ['Chỉ scalp trong giờ volume cao (London Open 14:00 VN, NY Open 20:30 VN)', 'Maker fee < Taker — dùng Limit Order thay Market Order khi có thể', 'Đặt daily loss limit (-2% account) — dừng scalp khi chạm limit', 'Scalp theo trend HTF (H1/H4) → winrate cao hơn counter-trend scalp'],
      keyTakeaways: ['Scalping không dành cho người mới — cần kỹ năng đọc order flow', 'Phí giao dịch là "kẻ thù" #1 — chọn sàn có phí thấp nhất', 'Kỷ luật > kỹ thuật: daily loss limit và SL cứng là bắt buộc', 'Chỉ scalp trong high-volume sessions']
    },
  },
  'dca': {
    term: 'DCA', english: 'Dollar Cost Averaging', category: 'Chiến lược giao dịch',
    videoId: 'LJiDfaNRBBY',
    relatedTerms: ['swing-trading', 'halving', 'staking'],
    basic: { definition: 'Mua đều đặn một lượng tiền cố định theo lịch trình, bất kể giá cao hay thấp. Giảm rủi ro "timing" sai — bạn không cần đoán đỉnh/đáy. Sau 1-2 chu kỳ, giá entry trung bình thường tốt hơn all-in. Chiến lược đơn giản nhất nhưng hiệu quả bậc nhất cho nhà đầu tư dài hạn.', example: 'Mua $200 BTC mỗi tuần trong 1 năm (52 tuần = $10,400). Giá BTC dao động $28K → $73K → $60K. Giá entry trung bình ~$45K — tốt hơn nhiều so với all-in tại $60K.', howToApply: '1. Chọn tài sản tin tưởng dài hạn (BTC, ETH)\n2. Đặt ngân sách cố định (ví dụ: $50-500/tuần)\n3. Đặt lịch mua tự động trên sàn (Binance Auto-Invest)\n4. Kiên trì ít nhất 6-12 tháng — KHÔNG dừng khi giá giảm\n5. Có kế hoạch chốt lời (DCA-out plan)', commonMistakes: 'DCA vào shitcoin — chỉ nên DCA vào tài sản top 5-10 market cap. Dừng DCA khi giá giảm (ngược lại, nên mua nhiều hơn). Không có exit plan — DCA vào nhưng không biết khi nào chốt lời.' },
    advanced: {
      definition: 'Value Averaging (VA): DCA thông minh — mua nhiều hơn khi giá dưới giá trị mục tiêu, ít hơn khi giá trên mục tiêu. Smart DCA kết hợp on-chain metrics (MVRV Z-Score, NUPL, 200-Week MA, Puell Multiple) để điều chỉnh lượng mua theo chu kỳ thị trường. Bear market = DCA aggressive. Bull market euphoria = DCA-out.',
      example: 'Smart DCA: BTC dưới 200-week MA → DCA gấp 3x ($600/tuần thay vì $200). BTC NUPL > 0.75 (Euphoria zone) → ngưng DCA, bắt đầu DCA-out (bán 10% mỗi tuần). Kết quả backtest: +40% ROI so với DCA cố định.',
      howToApply: '1. Dùng on-chain indicators để điều chỉnh DCA: MVRV < 1 → tăng size, MVRV > 3 → giảm/ngưng\n2. 200-Week MA là "đường giá trị" lịch sử — giá dưới MA = accumulation zone\n3. DCA-out plan: bán 10% mỗi khi giá tăng 50% từ ATH trước\n4. Kết hợp exit plan dựa trên Pi Cycle Top indicator',
      commonMistakes: 'DCA mù quáng không bao giờ chốt lời — cần kế hoạch exit rõ ràng. DCA vào altcoin rủi ro — 95% altcoin về 0 sau 1 chu kỳ. Không điều chỉnh size theo chu kỳ thị trường.',
      proTips: ['DCA + On-chain = Smart DCA — tăng size khi MVRV < 1, giảm khi MVRV > 3', 'Luôn có DCA-out plan (ví dụ: bán 10% mỗi khi giá tăng 50%)', 'BTC 200-week MA là "đường giá trị" lịch sử — dưới MA = golden opportunity', 'DCA hàng tuần > DCA hàng tháng (dollar cost averaging hiệu quả hơn)'],
      keyTakeaways: ['DCA đơn giản nhất nhưng hiệu quả nhất cho nhà đầu tư dài hạn', 'Value Averaging > DCA cố định khi kết hợp on-chain data', 'Luôn có kế hoạch chốt lời — DCA không có nghĩa là hold mãi mãi', 'Chỉ DCA vào top assets (BTC, ETH) — đừng DCA vào shitcoin']
    },
  },
  'fibonacci': {
    term: 'Fibonacci Retracement', english: 'Fibonacci Retracement', category: 'Phân tích kỹ thuật',
    videoId: 'KkMF5HKLZHE',
    relatedTerms: ['support-resistance', 'chart-pattern', 'breakout'],
    basic: { definition: 'Fibonacci Retracement vẽ các mức thoái lui dựa trên tỷ lệ Fibonacci: 23.6%, 38.2%, 50%, 61.8%, 78.6%. Kéo từ swing low → swing high (uptrend) hoặc swing high → swing low (downtrend). Vùng 50%-61.8% được gọi là "Golden Zone" — nơi giá có xác suất bounce cao nhất (~70% trong trending market).', example: 'BTC tăng từ $60K → $73K. Fib 61.8% = $73K - 61.8% × ($73K - $60K) = $65K. Giá pullback chính xác về $65K (Golden Zone) rồi bật tăng mạnh lên $80K.', howToApply: '1. Xác định swing low và swing high gần nhất\n2. Vẽ Fibonacci Retracement (công cụ có sẵn trên TradingView)\n3. Tìm entry tại Golden Zone (50-61.8%) với nến xác nhận\n4. SL dưới Fib 78.6% (nếu break = trend đảo chiều)\n5. TP dùng Fibonacci Extension (1.272, 1.618)', commonMistakes: 'Dùng Fibonacci đơn lẻ — cần kết hợp với S/R, trendline để tìm confluence (hội tụ). Vẽ Fib trên timeframe quá nhỏ (M1, M5). Không chờ nến xác nhận tại Fib level.' },
    advanced: {
      definition: 'Fibonacci Extension cho target price: 1.272, 1.618, 2.618 — dùng để đặt Take Profit. Fibonacci Clusters: khi nhiều mức Fib từ các swing khác nhau trùng tại 1 vùng → S/R cực mạnh (confluence). Auto-Fib dùng thuật toán pivot detection. Fibonacci Time Zones dự đoán THỜI GIAN đảo chiều.',
      example: 'Entry Golden Zone Fib 61.8% ($65K) → TP1: Fib Extension 1.272 ($76.5K), TP2: 1.618 ($82K). R:R = 1:4. Fib Cluster tại $64.5K-$65.5K (3 Fib levels từ 3 swing khác nhau trùng tại đây) = confluent demand zone cực mạnh.',
      howToApply: '1. Dùng Fib Clusters: mức Fib từ nhiều swing trùng tại 1 vùng → S/R cực mạnh\n2. Fib + EMA + S/R truyền thống = "triple confluence" → A+ entry\n3. Fibonacci Extension cho TP chính xác\n4. Multi-timeframe Fib: D1 Fib cho key levels, H4 Fib cho entry',
      commonMistakes: 'Vẽ Fib trên M1/M5 — không đáng tin. Nên H4+ trở lên. Không sử dụng Fib Extension cho TP — bỏ lỡ target chính xác. Chỉ dùng 1 Fib level — cần Fib clusters.',
      proTips: ['Golden Zone (50-61.8%) có xác suất bounce >70% trong trending market', 'Fib + round number ($65K) + EMA 200 = "Triple Confluence" — setup A+', 'Dùng Fib Extension cho TP thay vì đoán — 1.618 là target phổ biến nhất', 'Fib hoạt động vì self-fulfilling prophecy — triệu trader cùng nhìn cùng mức'],
      keyTakeaways: ['Fibonacci hoạt động vì nhiều trader cùng nhìn và giao dịch tại các mức này', 'Golden Zone (50-61.8%) là vùng entry tốt nhất', 'Luôn tìm confluence — Fib + S/R + EMA = xác suất cao nhất', 'Fib Extension cho target price chính xác']
    },
  },
  'swing-trading': {
    term: 'Swing Trading', english: 'Swing Trading', category: 'Chiến lược giao dịch',
    videoId: 'R4RDJ8RhUzs',
    relatedTerms: ['scalping', 'breakout', 'fibonacci', 'risk-reward'],
    basic: { definition: 'Giao dịch trung hạn (vài ngày → vài tuần), tận dụng các "nhịp swing" trong xu hướng. Phù hợp nhất cho người đi làm vì không cần ngồi chart cả ngày. Dùng H4/D1 để phân tích và entry. Kết hợp kỹ thuật + quản lý rủi ro.', example: 'Long ETH tại support $3,200 (EMA 50 bounce + RSI oversold) → TP1 $3,500 (chốt 50%), TP2 $3,800 (resistance) sau 5-7 ngày. R:R = 1:3. Chỉ cần check chart 2 lần/ngày.', howToApply: '1. Xác định trend chính trên D1/W1\n2. Tìm entry tại pullback (Fib Golden Zone, EMA bounce, S/R)\n3. Dùng H4 cho entry timing, D1 cho direction\n4. R:R tối thiểu 1:2, target tại S/R tiếp theo\n5. Check chart 2 lần/ngày (sáng + tối) là đủ', commonMistakes: 'Swing trade nhưng check chart mỗi 5 phút → stress và exit sớm. Không đặt SL trước khi vào lệnh. Trade ngược trend chính. Không chốt lời từng phần.' },
    advanced: {
      definition: 'Multi-timeframe swing: W1 cho trend direction, D1 cho key levels và S/R, H4 cho entry timing. Swing high/low structure cho thấy trend health: Higher Highs + Higher Lows = healthy uptrend. Kết hợp Fibonacci retracement cho entry + Extension cho TP.',
      example: 'W1: BTC uptrend (trên EMA 50 + MACD dương). D1: pullback về Fib 61.8% + EMA 50 + previous support ($65K — triple confluence). H4: Bullish Engulfing + RSI divergence → Long entry $65.2K, SL $63K, TP $72K. R:R = 1:3.',
      howToApply: '1. Weekly cho bias (chỉ trade theo hướng weekly)\n2. Daily cho key levels và S/R\n3. H4 cho entry triggers (candlestick patterns, EMA bounce, RSI)\n4. Partial TP: TP1 (1R, 50%), TP2 (2R, 30%), TP3 (trailing 20%)\n5. Dời SL về break-even sau khi chốt TP1',
      commonMistakes: 'Trade ngược W1 trend — rất nguy hiểm. Không partial TP → bỏ lỡ lợi nhuận khi giá reverse. Entry trên H4 mà không check D1/W1 context. Hold quá lâu → swing biến thành position trade.',
      proTips: ['Swing trading là style có R:R tốt nhất cho đa số traders', 'Multi-timeframe alignment (W1 + D1 + H4) tăng winrate 15-20%', 'Partial TP + trailing stop = tối ưu hóa profit per trade', 'Sunday evening + Wednesday morning là thời điểm review chart swing tốt nhất'],
      keyTakeaways: ['Phù hợp nhất cho người đi làm — check chart 2 lần/ngày', 'Multi-timeframe: W1 direction → D1 levels → H4 entry', 'R:R 1:2 minimum, target tại S/R key level', 'Partial TP + trailing stop = maximize profit']
    },
  },
  'futures': {
    term: 'Hợp Đồng Tương Lai', english: 'Futures', category: 'Giao dịch phái sinh',
    videoId: 'nRmoVxHfaFU',
    relatedTerms: ['leverage', 'margin', 'liquidation', 'funding-rate'],
    basic: { definition: 'Hợp đồng mua/bán tài sản ở giá định sẵn tại thời điểm tương lai. Trong crypto, Perpetual Futures (không hết hạn) phổ biến nhất. Cho phép Long (mua lên = lãi khi giá tăng) và Short (bán xuống = lãi khi giá giảm). Có đòn bẩy (leverage) → lãi/lỗ nhân lên.', example: 'Long BTC Futures $67K × 10x với vốn $1,000 = vị thế $10,000. Giá tăng 5% ($70.35K) → lãi $500 (50%). Giá giảm 10% → mất $1,000 = liquidation.', howToApply: '1. Hiểu rõ Long vs Short trước khi trade\n2. Bắt đầu với leverage thấp (3-5x)\n3. LUÔN đặt SL trước khi vào lệnh\n4. Dùng Isolated Margin\n5. Chỉ trade khi có setup rõ ràng — futures không phải đánh bạc', commonMistakes: 'Dùng leverage cao (50x+) mà không có SL → liquidation nhanh. Short trong uptrend mạnh. Quên funding rate (phí 8 giờ) ăn mòn lợi nhuận khi hold lâu. Trade futures khi chưa profitable trên spot.' },
    advanced: {
      definition: 'Basis (Futures price - Spot price) cho thấy sentiment: basis cao = bullish, basis âm = bearish (backwardation). Open Interest (OI) = tổng số hợp đồng đang mở → OI tăng + giá tăng = trend mạnh. Funding Rate + OI + Liquidation data = combo phân tích derivatives market mạnh nhất.',
      example: 'BTC OI tăng $2B trong 1 tuần + Funding Rate 0.01% (neutral) + giá tăng → fresh money Long → trend sẽ tiếp tục. Ngược lại: OI tăng + Funding Rate 0.1% (quá cao) → quá đông Long → chuẩn bị squeeze down.',
      howToApply: '1. Monitor Open Interest cùng price movement\n2. Funding Rate > 0.05% = cautious (quá đông Long)\n3. Liquidation heatmap cho thấy vùng giá sẽ trigger cascade\n4. Basis trade: Long Spot + Short Futures khi basis cao → kiếm từ convergence',
      commonMistakes: 'Bỏ qua Funding Rate → hold Long khi funding 0.1% = trả 0.3%/ngày. Không monitor OI. Không biết đọc liquidation data.',
      proTips: ['Funding Rate trung bình ~0.01% = thị trường cân bằng', 'Liquidation cluster = vùng giá mà giá SẼ bị hút đến → liquidity hunt', 'OI drop + price drop = forced selling (liquidation cascade) → tìm đáy', 'Basis trade (spot-futures arbitrage) = cách kiếm tiền low-risk nhất trên futures'],
      keyTakeaways: ['Chỉ trade futures khi đã profitable trên spot', 'Open Interest + Funding Rate + Liquidation = derivatives analysis toolkit', 'Isolated Margin + SL = phải có, không ngoại lệ', 'Funding Rate chi phí đáng kể khi hold position dài hạn']
    },
  },
  'fomo': {
    term: 'FOMO', english: 'Fear Of Missing Out', category: 'Tâm lý thị trường',
    videoId: 'iA1aAKcbgp0',
    relatedTerms: ['fud', 'greed-fear-index', 'diamond-hands'],
    basic: { definition: 'FOMO = Sợ bỏ lỡ cơ hội — tâm lý khiến trader mua đuổi giá cao mà không có kế hoạch, chỉ vì thấy "mọi người đang kiếm tiền". Đây là một trong những sai lầm tâm lý phổ biến và tốn kém nhất. FOMO thường xảy ra ở cuối xu hướng tăng — khi người cuối cùng mua vào, không còn ai mua tiếp → giá đảo chiều.', example: 'BTC tăng 20% trong 2 ngày, Twitter/TikTok tràn ngập "đừng bỏ lỡ" → FOMO mua tại $72K (gần đỉnh). Giá điều chỉnh 15% về $61K ngay sau → lỗ 15% trong 3 ngày. Đây là kịch bản FOMO kinh điển.', howToApply: '1. LUÔN có kế hoạch giao dịch TRƯỚC KHI giá di chuyển\n2. Nếu giá đã tăng 10%+ mà bạn chưa vào → ĐỪNG chase, chờ pullback\n3. Tắt thông báo, unfollow "influencer" gây FOMO\n4. Nhắc nhở: "Market luôn tạo cơ hội mới"\n5. Dùng lệnh Limit Order — nếu giá không về, nghĩa là trade không dành cho bạn', commonMistakes: 'Mua vì "sợ lỡ" không phải vì phân tích. Tăng position size khi FOMO (muốn "gỡ" nhanh). Không có SL khi FOMO entry → hold lỗ lớn. Nghe "guru" trên social media.' },
    advanced: {
      definition: 'FOMO là biểu hiện của cognitive bias "herding" (tâm lý bầy đàn). Smart money MUỐN bạn FOMO — họ bán cho bạn tại đỉnh. Các indicator đo FOMO: Fear & Greed Index > 80, Social Volume spike, Funding Rate > 0.05%, Google Trends spike cho "buy crypto". Khi tất cả indicators này cùng spike → chuẩn bị cho correction.',
      example: 'Tháng 3/2024: Fear & Greed = 90 (Extreme Greed), Funding Rate 0.08%, Google "buy bitcoin" +400%, TikTok crypto views ATH → Tất cả FOMO indicators spike → BTC đạt $73K rồi giảm 20% trong 2 tuần. Smart money đã phân phối (sell) cho FOMO retail.',
      howToApply: '1. Monitor Fear & Greed Index daily — > 80 = caution zone\n2. Funding Rate > 0.05% = too crowded Long → giảm exposure\n3. Social Volume spike (LunarCrush) = retail FOMO → contrarian signal\n4. Google Trends "buy bitcoin" spike = local top signal\n5. Khi TẤT CẢ social media nói mua → smart money đang BÁN',
      commonMistakes: 'Coi FOMO indicators là absolute timing tool — chúng cho thấy vùng, không phải đỉnh chính xác. FOMO có thể kéo dài (price can stay irrational). Quên rằng smart money cũng tạo FOMO có chủ đích.',
      proTips: ['Khi bạn cảm thấy FOMO mạnh nhất = thường là lúc TỆ nhất để mua', '"Be fearful when others are greedy" — Buffett', 'Lập "FOMO journal" — ghi lại mỗi lần muốn FOMO → review sau 1 tuần', 'DCA lên (scale in) thay vì all-in khi nghĩ cơ hội tốt → giảm risk FOMO'],
      keyTakeaways: ['FOMO là "kẻ giết tài khoản" phổ biến nhất', 'Smart money BÁN cho retail FOMO tại đỉnh', 'Fear & Greed > 80 + Funding Rate cao = extreme caution', 'Có kế hoạch TRƯỚC = vaccine chống FOMO']
    },
  },
  'defi': {
    term: 'DeFi', english: 'Decentralized Finance', category: 'DeFi',
    videoId: 'k9HYC0EJU6E',
    relatedTerms: ['yield-farming', 'impermanent-loss', 'staking', 'blockchain'],
    basic: { definition: 'DeFi = Tài chính phi tập trung — các dịch vụ tài chính (vay, cho vay, swap, bảo hiểm) chạy trên blockchain thông qua smart contract, không cần ngân hàng hay trung gian. "Your keys, your money" — bạn kiểm soát hoàn toàn tài sản. TVL (Total Value Locked) đo sức khỏe DeFi ecosystem.', example: 'Aave: cho vay USDC, nhận lãi 5% APY — không cần KYC, không cần ngân hàng phê duyệt. Uniswap: swap ETH → USDC ngay lập tức — không cần sàn tập trung, không cần đăng ký. Tất cả qua smart contract trên Ethereum.', howToApply: '1. Setup MetaMask wallet\n2. Mua ETH trên sàn (Binance) → chuyển về MetaMask\n3. Truy cập DeFi protocol (Aave, Uniswap, Curve)\n4. Bắt đầu với số nhỏ để học cách hoạt động\n5. Kiểm tra smart contract audit trước khi nạp tiền', commonMistakes: 'Nạp số lớn vào protocol chưa audit → risk bị hack. Không hiểu gas fee (phí giao dịch trên Ethereum). Approve unlimited token → risk bị drain wallet. Phishing sites giả DeFi protocol.' },
    advanced: {
      definition: 'Composability ("money legos"): các protocol DeFi kết hợp với nhau tạo chiến lược phức tạp. Flash Loans: vay triệu USD không cần collateral (trả trong cùng transaction). MEV (Maximal Extractable Value): bot front-run/sandwich attack giao dịch DeFi. Layer 2 DeFi (Arbitrum, Optimism) giảm gas 90%+.',
      example: 'Chiến lược DeFi nâng cao: (1) Stake ETH → nhận stETH, (2) Deposit stETH vào Aave → vay USDC, (3) Cung cấp USDC vào Curve → nhận yield 8% + CRV rewards. Tổng yield = staking 4% + lending spread + LP fees = ~15% APY. Nhưng risk = smart contract risk + liquidation risk.',
      howToApply: '1. Hiểu risk stack: mỗi protocol thêm = thêm 1 layer risk\n2. Dùng DeFi aggregators (DefiLlama, Zapper) để compare yield\n3. Check audit status, TVL, protocol age trước khi nạp\n4. Bắt đầu trên L2 (Arbitrum, Base) để giảm gas fee\n5. Revoke unused token approvals định kỳ (Revoke.cash)',
      commonMistakes: 'Chase APY cao (1000%+) = ponzi scheme risk. Không revoke token approvals. Dùng bridge không uy tín → bị hack. Không tính impermanent loss khi LP.',
      proTips: ['TVL > $100M + audit bởi Trail of Bits/OpenZeppelin = protocol đáng tin', 'Real Yield > Token emission yield — check xem yield đến từ đâu', 'L2 DeFi (Arbitrum, Base) gas fee < $0.1 — tốt hơn Ethereum mainnet nhiều', 'DeFi insurance (Nexus Mutual) cho phép mua bảo hiểm smart contract risk'],
      keyTakeaways: ['DeFi = tài chính không cần trung gian — revolutionary', 'Smart contract risk là risk #1 — chỉ dùng protocol đã audit', 'Real Yield > Token emission — yield đến từ phí thực > in token mới', 'Bắt đầu nhỏ, hiểu risk, rồi scale up']
    },
  },
};
