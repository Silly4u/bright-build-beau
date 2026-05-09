import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { Send, ShieldCheck, BadgeCheck, Award, Sparkles, Users, FileSignature, Lock, AlertTriangle, CheckCircle2, ExternalLink } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CONTACT_INFO } from '@/lib/contact';

const applicationSchema = z.object({
  full_name: z.string().trim().min(2, 'Tên tối thiểu 2 ký tự').max(100),
  email: z.string().trim().email('Email không hợp lệ').max(255),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  telegram: z.string().trim().max(100).optional().or(z.literal('')),
  channel_url: z.string().trim().url('Link không hợp lệ').max(500),
  platform: z.enum(['telegram', 'youtube', 'tiktok', 'facebook', 'x', 'other']),
  followers: z.coerce.number().int().min(0).max(100_000_000).optional(),
  audience_vn_percent: z.coerce.number().int().min(0).max(100).optional(),
  experience: z.string().trim().max(1000).optional().or(z.literal('')),
  reason: z.string().trim().min(20, 'Tối thiểu 20 ký tự').max(2000),
});

const BENEFITS = [
  { icon: Award, title: 'Chia sẻ doanh thu', desc: 'Hoa hồng hấp dẫn theo số khách hàng VIP referral, thanh toán định kỳ minh bạch.' },
  { icon: BadgeCheck, title: 'Badge "Official Partner"', desc: 'Chứng nhận chính thức từ UncleTrader, có trang verify công khai và mã hợp đồng.' },
  { icon: Sparkles, title: 'Access VIP Signals', desc: 'Quyền truy cập đầy đủ tín hiệu Smart Money + dashboard AlphaNet để tạo nội dung chất.' },
  { icon: Users, title: 'Co-branded content', desc: 'Đồng sản xuất video, livestream, bài phân tích — đẩy reach 2 chiều.' },
  { icon: FileSignature, title: 'Brand kit chuyên nghiệp', desc: 'Logo co-brand, watermark, banner, UTM riêng — chuẩn hóa hình ảnh hợp tác.' },
  { icon: ShieldCheck, title: 'Hỗ trợ pháp lý', desc: 'Hợp đồng điện tử rõ ràng, bảo vệ quyền lợi và uy tín cả hai bên.' },
];

const STEPS = [
  { n: '01', t: 'Đăng ký', d: 'Điền form bên dưới — đội ngũ phản hồi trong 48h.' },
  { n: '02', t: 'Audit & phỏng vấn', d: 'Kiểm tra chất lượng kênh, audience VN, lịch sử nội dung.' },
  { n: '03', t: 'Ký hợp đồng', d: 'Hợp đồng điện tử ràng buộc rõ ràng quyền lợi & exclusivity.' },
  { n: '04', t: 'Onboard', d: 'Nhận brand kit, mã ref, badge Official và lên lịch nội dung đầu tiên.' },
];

const TERMS = [
  { icon: Lock, title: 'Exclusivity trong ngành', desc: 'KOL không hợp tác đồng thời với các dịch vụ tín hiệu / đào tạo crypto cạnh tranh tại Việt Nam trong thời gian hiệu lực hợp đồng.' },
  { icon: FileSignature, title: 'Sở hữu nội dung co-produced', desc: 'Toàn bộ video, bài viết, signal recap được sản xuất trong khuôn khổ hợp tác thuộc quyền đồng sở hữu của UncleTrader để tái sử dụng cho mục đích quảng bá.' },
  { icon: BadgeCheck, title: 'Sử dụng đúng brand kit', desc: 'KOL cam kết dùng đúng logo, tagline, màu sắc, watermark do UncleTrader cung cấp; không tự ý chỉnh sửa làm sai lệch nhận diện thương hiệu.' },
  { icon: AlertTriangle, title: 'Anti-fraud & đạo đức', desc: 'Nghiêm cấm fake signal, pump & dump, shill token rác, hoặc bất kỳ hành vi nào gây tổn hại cộng đồng. Vi phạm sẽ chấm dứt hợp đồng và thu hồi badge.' },
  { icon: ShieldCheck, title: 'Tracking minh bạch', desc: 'Mỗi KOL có UTM + mã referral riêng để chứng minh attribution. Số liệu được kiểm toán định kỳ và công khai với KOL.' },
];

const FAQ = [
  { q: 'Tôi cần bao nhiêu followers để được duyệt?', a: 'Không có ngưỡng cứng. Quan trọng là chất lượng audience Việt, mức engagement và lịch sử nội dung chuyên môn về crypto/trading.' },
  { q: 'Có giới hạn số lượng KOL không?', a: 'Có. Để bảo đảm quyền lợi, mỗi vùng/nền tảng chỉ chọn một số lượng partner giới hạn. Nộp sớm có lợi thế.' },
  { q: 'Hợp đồng kéo dài bao lâu?', a: 'Mặc định 6 tháng có gia hạn. Có thể chấm dứt sớm bằng văn bản từ một trong hai bên với điều khoản chuyển giao rõ ràng.' },
  { q: 'Có cần KYC không?', a: 'Có. Để bảo vệ thương hiệu và đảm bảo nghĩa vụ thuế, KOL cần cung cấp giấy tờ định danh khi ký hợp đồng.' },
];

export default function Kol() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', telegram: '', channel_url: '',
    platform: 'telegram', followers: '', audience_vn_percent: '', experience: '', reason: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = applicationSchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: 'Vui lòng kiểm tra lại', description: parsed.error.errors[0]?.message, variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('kol-apply', { body: parsed.data });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      setDone(true);
      toast({ title: 'Đã gửi đơn', description: 'Chúng tôi sẽ liên hệ trong 48 giờ.' });
    } catch (err: any) {
      toast({ title: 'Gửi thất bại', description: err?.message ?? 'Vui lòng thử lại', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      <Header />

      {/* HERO */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.18),_transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-mono uppercase tracking-[0.2em] text-amber-300">
              <Sparkles className="w-3 h-3" /> KOL Partnership Program
            </div>
            <h1 className="mt-5 font-display text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Trở thành <span className="bg-gradient-to-r from-amber-300 to-pink-400 bg-clip-text text-transparent">KOL chính thức</span><br/>
              của UncleTrader
            </h1>
            <p className="mt-5 max-w-2xl text-base md:text-lg text-white/65 leading-relaxed">
              Chương trình hợp tác minh bạch, có hợp đồng pháp lý rõ ràng và badge xác thực công khai —
              bảo vệ uy tín của KOL và bảo vệ thương hiệu UncleTrader.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#apply" className="btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm">
                <Send className="w-4 h-4" /> Đăng ký hợp tác
              </a>
              <a href="#terms" className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm glass hover:bg-white/10 transition">
                Xem điều khoản bản quyền
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-white/45">Quyền lợi</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Vì sao KOL chọn UncleTrader</h2>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div key={b.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6 hover:bg-white/[0.06] transition group">
                <b.icon className="w-7 h-7 text-amber-300 group-hover:scale-110 transition-transform" />
                <h3 className="mt-4 font-display text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-white/45">Quy trình</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Bốn bước tham gia</h2>
          <div className="mt-10 grid md:grid-cols-4 gap-5">
            {STEPS.map((s) => (
              <div key={s.n} className="glass rounded-2xl p-6">
                <div className="font-mono text-xs text-amber-300">{s.n}</div>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TERMS — bản quyền */}
      <section id="terms" className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">Điều khoản & bản quyền</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">
            Khẳng định KOL <span className="text-amber-300">thuộc bản quyền</span> UncleTrader
          </h2>
          <p className="mt-3 max-w-3xl text-white/60">
            Mọi điều khoản dưới đây được cụ thể hóa bằng hợp đồng điện tử có chữ ký số trước khi onboard.
            Cam kết minh bạch — bảo vệ cả thương hiệu và KOL.
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-5">
            {TERMS.map((t) => (
              <div key={t.title} className="glass rounded-2xl p-6 border border-amber-400/10">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                    <t.icon className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                    <p className="mt-1.5 text-sm text-white/65 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLY FORM */}
      <section id="apply" className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-white/45">Đăng ký</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Gửi đơn hợp tác</h2>
          <p className="mt-3 text-white/60">Chúng tôi phản hồi trong 48 giờ làm việc.</p>

          {done ? (
            <div className="mt-10 glass rounded-2xl p-8 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="mt-4 font-display text-xl font-semibold">Đơn của bạn đã được ghi nhận</h3>
              <p className="mt-2 text-white/60 text-sm">Đội ngũ UncleTrader sẽ liên hệ qua email/Telegram trong 48 giờ.</p>
              <a href={CONTACT_INFO.telegramUrl} target="_blank" rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm glass hover:bg-white/10">
                Liên hệ nhanh qua Telegram <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 glass rounded-2xl p-6 md:p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Họ và tên *" v={form.full_name} onChange={onChange('full_name')} maxLength={100} required />
                <Field label="Email *" type="email" v={form.email} onChange={onChange('email')} maxLength={255} required />
                <Field label="Số điện thoại" v={form.phone} onChange={onChange('phone')} maxLength={30} />
                <Field label="Telegram (@username)" v={form.telegram} onChange={onChange('telegram')} maxLength={100} />
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <div className="md:col-span-1">
                  <Label>Nền tảng chính *</Label>
                  <select value={form.platform} onChange={onChange('platform')}
                    className="mt-1.5 w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-amber-300/50 outline-none">
                    <option value="telegram">Telegram</option>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                    <option value="x">X / Twitter</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <Field className="md:col-span-2" label="Link kênh chính *" v={form.channel_url} onChange={onChange('channel_url')} maxLength={500} required placeholder="https://..." />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Số lượng followers" type="number" v={form.followers} onChange={onChange('followers')} />
                <Field label="% audience Việt Nam" type="number" v={form.audience_vn_percent} onChange={onChange('audience_vn_percent')} />
              </div>

              <div>
                <Label>Kinh nghiệm về crypto / trading</Label>
                <textarea value={form.experience} onChange={onChange('experience')} maxLength={1000} rows={3}
                  className="mt-1.5 w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-amber-300/50 outline-none resize-none" />
              </div>

              <div>
                <Label>Vì sao bạn muốn hợp tác với UncleTrader? *</Label>
                <textarea value={form.reason} onChange={onChange('reason')} maxLength={2000} rows={4} required
                  className="mt-1.5 w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-amber-300/50 outline-none resize-none" />
              </div>

              <p className="text-xs text-white/40 leading-relaxed">
                Bằng cách gửi đơn, bạn đồng ý với điều khoản hợp tác phía trên và cho phép UncleTrader
                liên hệ qua thông tin đã cung cấp.
              </p>

              <button type="submit" disabled={submitting}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm disabled:opacity-50">
                {submitting ? 'Đang gửi...' : (<><Send className="w-4 h-4" /> Gửi đơn đăng ký</>)}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-white/45">FAQ</div>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold">Câu hỏi thường gặp</h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="glass rounded-2xl p-5 group">
                <summary className="cursor-pointer font-medium flex items-center justify-between">
                  {f.q}
                  <span className="text-amber-300 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-white/65 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <div className="glass rounded-2xl p-5 border border-red-500/20 text-xs text-white/50 leading-relaxed">
            <span className="text-red-300 font-mono uppercase tracking-[0.2em]">⚠ Lưu ý</span> · UncleTrader có toàn quyền
            chấp nhận hoặc từ chối đơn đăng ký. Nội dung chương trình có thể được điều chỉnh; phiên bản hiệu lực là phiên bản
            được ghi trong hợp đồng ký kết giữa hai bên.
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-mono uppercase tracking-[0.15em] text-white/55">{children}</label>;
}

function Field({
  label, v, onChange, type = 'text', required, maxLength, placeholder, className = '',
}: {
  label: string; v: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; required?: boolean; maxLength?: number; placeholder?: string; className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <input type={type} value={v} onChange={onChange} required={required} maxLength={maxLength} placeholder={placeholder}
        className="mt-1.5 w-full bg-background/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-amber-300/50 outline-none" />
    </div>
  );
}
