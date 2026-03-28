import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll('.page-reveal');
    els.forEach((el, i) => setTimeout(() => el.classList.add('revealed'), 200 + i * 150));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-navy grain-overlay">
      <Header />

      <section className="relative pt-32 pb-20 overflow-hidden line-grid">
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="reveal-hidden page-reveal inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8">
            <span className="font-mono-custom text-xs text-cyan-brand tracking-wider">LIÊN HỆ</span>
          </div>
          <h1 className="reveal-hidden page-reveal font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground tracking-tight mb-6">
            Kết Nối Với{' '}<span className="text-gradient-cyan italic">UNCLETRADER</span>
          </h1>
          <p className="reveal-hidden page-reveal text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Tư vấn miễn phí 30 phút. Chúng tôi sẵn sàng giúp bạn tìm giải pháp trading phù hợp nhất.
          </p>
        </div>
      </section>

      <section className="py-16 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-display font-bold text-2xl text-foreground mb-8">Thông Tin Liên Hệ</h2>
              <div className="space-y-6">
                {[
                  { icon: '💬', label: 'Telegram', value: '@uncletrader', href: '#' },
                  { icon: '📧', label: 'Email', value: 'contact@uncletrader.com', href: 'mailto:contact@uncletrader.com' },
                  { icon: '📱', label: 'Zalo', value: 'UNCLETRADER', href: '#' },
                ].map((item) => (
                  <a key={item.label} href={item.href} className="glass-card glass-card-hover rounded-xl p-5 flex items-center gap-4 block">
                    <div className="w-12 h-12 bg-cyan-brand/10 border border-cyan-brand/20 rounded-xl flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-mono-custom text-xs text-cyan-brand tracking-wider mb-1">{item.label}</div>
                      <div className="text-foreground font-medium">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-10 glass-card rounded-xl p-6">
                <h3 className="font-display font-semibold text-lg text-foreground mb-4">Giờ Hoạt Động</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between"><span>Hỗ trợ chat</span><span className="text-cyan-brand">24/7</span></div>
                  <div className="flex justify-between"><span>Tư vấn 1-1</span><span>9:00 - 21:00 (GMT+7)</span></div>
                  <div className="flex justify-between"><span>Live Trading Room</span><span>20:00 - 23:00 (GMT+7)</span></div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card rounded-2xl p-8 cyber-border">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-6">✅</div>
                  <h3 className="font-display font-bold text-2xl text-foreground mb-3">Gửi Thành Công!</h3>
                  <p className="text-muted-foreground">Chúng tôi sẽ liên hệ lại trong vòng 2 giờ.</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display font-bold text-2xl text-foreground mb-6">Gửi Tin Nhắn</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block font-mono-custom text-xs text-muted-foreground tracking-wider mb-2">HỌ TÊN</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="crypto-input w-full rounded-xl px-4 py-3"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-custom text-xs text-muted-foreground tracking-wider mb-2">EMAIL</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="crypto-input w-full rounded-xl px-4 py-3"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-custom text-xs text-muted-foreground tracking-wider mb-2">SỐ ĐIỆN THOẠI</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="crypto-input w-full rounded-xl px-4 py-3"
                        placeholder="0912 345 678"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-custom text-xs text-muted-foreground tracking-wider mb-2">NỘI DUNG</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="crypto-input w-full rounded-xl px-4 py-3 resize-none"
                        placeholder="Tôi muốn tìm hiểu về gói dịch vụ..."
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full py-4 rounded-xl text-base font-semibold">
                      Gửi Tin Nhắn
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
