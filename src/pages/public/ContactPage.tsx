import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Clock
} from 'lucide-react';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { lang } = useLanguage();
  const { settings } = useData();

  const hotline = settings?.hotline || '0983 147 456';
  const email = settings?.email || 'contact@debriq.vn';
  const address = settings?.address || '71 Quốc Lộ 13, Tổ 2, Khu Phố Bàu Bàng, Xã Bàu Bàng, Thành phố Hồ Chí Minh';

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    phone: '',
    email: '',
    subject: 'Liên hệ hợp tác kỹ thuật',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || (!formData.email && !formData.phone)) {
      setError(lang === 'vi' ? 'Vui lòng điền họ tên và thông tin liên lạc (Email hoặc Số điện thoại).' : 'Please enter your name and phone or email.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          ...formData
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gửi liên hệ thất bại');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi gửi thông tin liên hệ. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F3F2EE] min-h-screen text-[#151515] font-display selection:bg-[#F27D26] selection:text-white">
      
      {/* Header Banner */}
      <section className="border-b border-[#D9D8D3] bg-[#EAE9E4] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="type-section-label">
              // {lang === 'vi' ? 'KẾT NỐI VÀ HỢP TÁC' : 'GET IN TOUCH & HEADQUARTERS'}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#151515] leading-[1.05]">
              {lang === 'vi' ? 'Liên hệ DEBRIQ' : 'Contact DEBRIQ'}
            </h1>
            <p className="type-body-lg text-base sm:text-lg text-[#555] leading-relaxed font-sans">
              {lang === 'vi'
                ? 'Đội ngũ kỹ sư DEBRIQ luôn sẵn sàng lắng nghe yêu cầu và đề xuất giải pháp triển khai hồ sơ phù hợp nhất cho dự án của bạn.'
                : 'DEBRIQ lead engineers are available to review project requirements and coordinate drawings delivery.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Directory & Contact Form Grid */}
      <section className="py-20 border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Official Contact Credentials & Address */}
            <div className="lg:col-span-5 space-y-8">
              
              <div>
                <span className="type-section-label block mb-1">
                  // {lang === 'vi' ? 'THÔNG TIN PHÁP NHÂN' : 'CORPORATE CREDENTIALS'}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#151515] tracking-tight">
                  CÔNG TY TNHH KỸ THUẬT DEBRIQ
                </h2>
                <p className="font-sans text-xs text-[#767670] mt-1 uppercase font-medium">
                  DEBRIQ ENGINEERING COMPANY LIMITED
                </p>
              </div>

              <div className="space-y-6 font-sans text-xs">
                
                {/* Phone / Hotline */}
                <div className="p-4 bg-[#EAE9E4] border border-[#D9D8D3] flex items-start gap-4">
                  <div className="p-2.5 bg-[#151515] text-[#F27D26]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="type-meta-label block">{lang === 'vi' ? 'HOTLINE / ZALO KỸ THUẬT' : 'TECHNICAL HOTLINE / ZALO'}</span>
                    <a href={`tel:${hotline.replace(/\s/g, '')}`} className="text-base font-bold text-[#151515] hover:text-[#F27D26] block mt-0.5 font-mono-tech">
                      {hotline}
                    </a>
                    <span className="text-xs text-[#767670]">{lang === 'vi' ? 'Hỗ trợ tư vấn báo giá dự án 24/7' : '24/7 Drawing review support'}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="p-4 bg-[#EAE9E4] border border-[#D9D8D3] flex items-start gap-4">
                  <div className="p-2.5 bg-[#151515] text-[#F27D26]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="type-meta-label block">{lang === 'vi' ? 'EMAIL TIẾP NHẬN HỒ SƠ' : 'OFFICIAL WORK EMAIL'}</span>
                    <a href={`mailto:${email}`} className="text-base font-bold text-[#151515] hover:text-[#F27D26] block mt-0.5 font-mono-tech">
                      {email}
                    </a>
                    <span className="text-xs text-[#767670]">{lang === 'vi' ? 'Tiếp nhận bản vẽ thiết kế & đề bài dự toán' : 'Receiving CAD/BIM specifications'}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="p-4 bg-[#EAE9E4] border border-[#D9D8D3] flex items-start gap-4">
                  <div className="p-2.5 bg-[#151515] text-[#F27D26]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="type-meta-label block">{lang === 'vi' ? 'ĐỊA CHỈ TRỤ SỞ' : 'REGISTERED OFFICE'}</span>
                    <p className="text-xs text-[#262626] font-sans font-medium mt-0.5 leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="p-4 bg-[#EAE9E4] border border-[#D9D8D3] flex items-start gap-4">
                  <div className="p-2.5 bg-[#151515] text-[#F27D26]">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="type-meta-label block">{lang === 'vi' ? 'THỜI GIAN LÀM VIỆC' : 'WORKING HOURS'}</span>
                    <p className="text-xs text-[#262626] font-sans font-medium mt-0.5">
                      Thứ Hai - Thứ Bảy: 08:00 - 18:00 (Trực hotline dự án 24/7)
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Right: Interactive Message Form */}
            <div className="lg:col-span-7 bg-[#EAE9E4] border border-[#D9D8D3] p-6 sm:p-10 shadow-sm">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4 font-sans">
                  <div className="w-16 h-16 bg-[#F27D26]/10 border border-[#F27D26] text-[#F27D26] mx-auto flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#151515] font-display">
                    {lang === 'vi' ? 'Tin nhắn đã được gửi thành công' : 'Message Sent Successfully'}
                  </h3>
                  <p className="text-sm text-[#666] max-w-md mx-auto font-sans leading-relaxed">
                    {lang === 'vi'
                      ? 'Cảm ơn bạn đã liên hệ với DEBRIQ. Kỹ sư phụ trách sẽ phản hồi qua email hoặc số điện thoại trong thời gian sớm nhất.'
                      : 'Thank you for contacting DEBRIQ. A lead engineer will respond promptly via email or phone.'}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-[#151515] text-white px-6 py-2.5 font-semibold text-xs uppercase tracking-wider hover:bg-[#F27D26] transition-colors cursor-pointer"
                    >
                      {lang === 'vi' ? 'Gửi tin nhắn mới' : 'Send another message'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="border-b border-[#D9D8D3] pb-4 mb-6">
                    <span className="type-section-label block mb-1">
                      // {lang === 'vi' ? 'HỘP THƯ TRỰC TUYẾN' : 'ONLINE INQUIRY'}
                    </span>
                    <h2 className="font-display text-2xl font-bold text-[#151515] tracking-tight">
                      {lang === 'vi' ? 'Gửi tin nhắn / yêu cầu cho DEBRIQ' : 'Send an inquiry to DEBRIQ'}
                    </h2>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2 font-sans">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#333] uppercase type-meta-label mb-1">
                          {lang === 'vi' ? 'Họ và tên *' : 'Your Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                          className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-sans focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[#333] uppercase type-meta-label mb-1">
                          {lang === 'vi' ? 'Công ty / Dự án' : 'Company / Project'}
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder={lang === 'vi' ? 'Tổng thầu / Đơn vị thi công...' : 'Contractor / Company...'}
                          className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-sans focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#333] uppercase type-meta-label mb-1">
                          {lang === 'vi' ? 'Số điện thoại / Zalo *' : 'Phone / Zalo *'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0983..."
                          className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-mono-tech focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[#333] uppercase type-meta-label mb-1">
                          {lang === 'vi' ? 'Email *' : 'Email Address *'}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@domain.vn"
                          className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-sans focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#333] uppercase type-meta-label mb-1">
                        {lang === 'vi' ? 'Tiêu đề / Mục đích liên hệ' : 'Subject'}
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-sans focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#333] uppercase type-meta-label mb-1">
                        {lang === 'vi' ? 'Nội dung tin nhắn *' : 'Message Content *'}
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={lang === 'vi' ? 'Mô tả thông tin cần trao đổi, yêu cầu kỹ thuật hoặc đặt lịch hẹn...' : 'Describe your project or meeting request...'}
                        className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-sans focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#151515] hover:bg-[#F27D26] text-white py-4 uppercase tracking-wider font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>{submitting ? (lang === 'vi' ? 'Đang gửi...' : 'Sending...') : (lang === 'vi' ? 'Gửi tin nhắn' : 'Send message')}</span>
                      </button>
                    </div>

                  </form>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
