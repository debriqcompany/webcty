import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { getBilingualText, isValidImageUrl } from '../../utils/bilingual';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { lang } = useLanguage();
  const { settings, pages } = useData();

  const page = pages?.['contact'];

  const titleStr = getBilingualText(
    page?.title,
    lang,
    'Liên hệ DEBRIQ',
    'Contact DEBRIQ'
  );

  const subtitleStr = getBilingualText(
    page?.subtitle,
    lang,
    'KẾT NỐI VÀ HỢP TÁC KỸ THUẬT',
    'GET IN TOUCH & HEADQUARTERS'
  );

  const descStr = getBilingualText(
    page?.description || page?.metaDescription,
    lang,
    'Đội ngũ kỹ sư DEBRIQ luôn sẵn sàng lắng nghe yêu cầu và đề xuất giải pháp triển khai hồ sơ phù hợp nhất cho dự án của bạn.',
    'DEBRIQ lead engineers are available to review project requirements and coordinate drawings delivery.'
  );

  const contentHtmlStr = getBilingualText(page?.contentHtml, lang, '', '');

  const rawHeroImage = page?.heroImage || page?.bannerImage;
  const heroImage = isValidImageUrl(rawHeroImage) ? rawHeroImage : undefined;
  const galleryImages = (page?.gallery || []).filter(isValidImageUrl);

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
  const formContainerRef = useRef<HTMLDivElement>(null);

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
      setTimeout(() => {
        formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
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
              // {subtitleStr}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#151515] leading-[1.05]">
              {titleStr}
            </h1>
            <p className="type-body-lg text-base sm:text-lg text-[#555] leading-relaxed font-sans">
              {descStr}
            </p>
          </div>
        </div>
      </section>

      {/* Prominent Hero Banner / Office Image if uploaded */}
      {heroImage && (
        <section className="border-b border-[#D9D8D3] bg-[#18181C]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
            <div className="border border-[#333] rounded-xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt={titleStr}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Custom Narrative HTML from Admin (if added) */}
      {contentHtmlStr && (
        <section className="py-16 border-b border-[#D9D8D3] bg-white">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
            <div 
              className="prose prose-lg max-w-none font-sans text-[#333] leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: contentHtmlStr }}
            />
          </div>
        </section>
      )}

      {/* Main Directory & Contact Form Grid */}
      <section className="py-20 border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Official Contact Credentials & Address */}
            <div className="lg:col-span-5 space-y-8">
              
              <div>
                <span className="type-section-label block mb-1">
                  // {lang === 'vi' ? 'TRỤ SỞ & LIÊN LẠC TRỰC TIẾP' : 'HEADQUARTERS & DESK'}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#151515] tracking-tight">
                  {lang === 'vi' ? 'Thông tin liên hệ chính thức' : 'Official Contact Channels'}
                </h2>
              </div>

              <div className="space-y-6 font-sans">
                
                {/* Address */}
                <div className="flex items-start gap-4 p-5 bg-[#EAE9E4] border border-[#D9D8D3]">
                  <div className="w-10 h-10 bg-[#151515] text-[#F27D26] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="type-meta-label block text-[#767670]">
                      {lang === 'vi' ? 'ĐỊA CHỈ TRỤ SỞ:' : 'OFFICE ADDRESS:'}
                    </span>
                    <p className="text-sm font-semibold text-[#151515] leading-snug">
                      {address}
                    </p>
                  </div>
                </div>

                {/* Hotline & Phone */}
                <div className="flex items-start gap-4 p-5 bg-[#EAE9E4] border border-[#D9D8D3]">
                  <div className="w-10 h-10 bg-[#151515] text-[#F27D26] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="type-meta-label block text-[#767670]">
                      {lang === 'vi' ? 'HOTLINE KỸ THUẬT:' : 'DIRECT HOTLINE:'}
                    </span>
                    <a 
                      href={`tel:${hotline.replace(/[^0-9+]/g, '')}`} 
                      className="text-lg font-bold text-[#151515] hover:text-[#F27D26] transition-colors block font-mono-tech"
                    >
                      {hotline}
                    </a>
                    <span className="text-xs text-[#767670] block">
                      {lang === 'vi' ? 'Hỗ trợ kỹ thuật 24/7 cho các dự án đang thi công' : '24/7 technical assistance for ongoing pours'}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-5 bg-[#EAE9E4] border border-[#D9D8D3]">
                  <div className="w-10 h-10 bg-[#151515] text-[#F27D26] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="type-meta-label block text-[#767670]">
                      {lang === 'vi' ? 'EMAIL TIẾP NHẬN:' : 'INTAKE EMAIL:'}
                    </span>
                    <a 
                      href={`mailto:${email}`} 
                      className="text-sm font-semibold text-[#151515] hover:text-[#F27D26] transition-colors block font-mono-tech"
                    >
                      {email}
                    </a>
                  </div>
                </div>

              </div>

            </div>

            {/* Right: Interactive Message & Consultation Form */}
            <div 
              ref={formContainerRef}
              className="lg:col-span-7 bg-[#EAE9E4] border border-[#D9D8D3] p-8 sm:p-10 scroll-mt-24"
            >
              
              <div className="border-b border-[#D9D8D3] pb-6 mb-8">
                <span className="type-section-label block mb-1">
                  // {lang === 'vi' ? 'GỬI YÊU CẦU TRỰC TUYẾN' : 'ONLINE INQUIRY'}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#151515]">
                  {lang === 'vi' ? 'Để lại thông tin dự án' : 'Send us a Technical Message'}
                </h3>
              </div>

              {submitted ? (
                <div className="bg-white border-2 border-emerald-600 p-8 text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-display font-bold text-xl text-[#151515]">
                    {lang === 'vi' ? 'Tin nhắn đã được gửi thành công!' : 'Message Sent Successfully!'}
                  </h4>
                  <p className="text-sm text-[#555] max-w-md mx-auto font-sans leading-relaxed">
                    {lang === 'vi'
                      ? 'Cảm ơn bạn đã liên hệ. Đội ngũ kỹ sư DEBRIQ sẽ phản hồi lại bạn qua Email hoặc Số điện thoại trong thời gian sớm nhất.'
                      : 'Thank you for reaching out. A DEBRIQ technical lead will respond promptly.'}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: '',
                        company: '',
                        phone: '',
                        email: '',
                        subject: 'Liên hệ hợp tác kỹ thuật',
                        message: ''
                      });
                    }}
                    className="bg-[#151515] text-white px-6 py-2.5 text-xs font-mono-tech uppercase tracking-wider font-bold cursor-pointer"
                  >
                    {lang === 'vi' ? 'Gửi tin nhắn khác' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {error && (
                    <div className="p-4 bg-red-100 border border-red-400 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="type-meta-label block mb-1">
                        {lang === 'vi' ? 'HỌ VÀ TÊN *' : 'YOUR NAME *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Nguyễn Văn A"
                        className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="type-meta-label block mb-1">
                        {lang === 'vi' ? 'CÔNG TY / ĐƠN VỊ THI CÔNG' : 'COMPANY / CONTRACTOR'}
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Công ty CP Xây dựng..."
                        className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="type-meta-label block mb-1">
                        {lang === 'vi' ? 'SỐ ĐIỆN THOẠI *' : 'PHONE NUMBER *'}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0983..."
                        className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="type-meta-label block mb-1">
                        {lang === 'vi' ? 'ĐỊA CHỈ EMAIL' : 'EMAIL ADDRESS'}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="type-meta-label block mb-1">
                      {lang === 'vi' ? 'CHỦ ĐỀ YÊU CẦU' : 'SUBJECT'}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans"
                    >
                      <option value="Liên hệ hợp tác kỹ thuật">Liên hệ hợp tác kỹ thuật & Triển khai hồ sơ</option>
                      <option value="Yêu cầu báo giá Shopdrawing kết cấu">Yêu cầu báo giá Shopdrawing kết cấu</option>
                      <option value="Yêu cầu báo giá Shopdrawing hoàn thiện">Yêu cầu báo giá Shopdrawing hoàn thiện</option>
                      <option value="Yêu cầu mô hình hóa BIM / Revit">Yêu cầu mô hình hóa BIM / Revit</option>
                      <option value="Yêu cầu hồ sơ Biện pháp thi công">Yêu cầu hồ sơ Biện pháp thi công</option>
                      <option value="Khác">Nội dung khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="type-meta-label block mb-1">
                      {lang === 'vi' ? 'NỘI DUNG TRAO ĐỔI' : 'MESSAGE / PROJECT DETAILS'}
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={lang === 'vi' ? 'Mô tả sơ bộ quy mô công trình, tiến độ và yêu cầu hồ sơ...' : 'Brief description of project scale, schedule, and drawing requirements...'}
                      className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#F27D26] hover:bg-[#D86616] text-white p-4 font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? (lang === 'vi' ? 'ĐANG GỬI...' : 'SENDING...') : (lang === 'vi' ? 'GỬI TIN NHẮN TỚI DEBRIQ' : 'SEND MESSAGE')}</span>
                  </button>

                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* Extra Image Gallery from Admin (if added) */}
      {galleryImages.length > 0 && (
        <section className="py-20 border-b border-[#D9D8D3] bg-[#F3F2EE]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
            <div>
              <span className="type-section-label block mb-1">
                // {lang === 'vi' ? 'HÌNH ẢNH VĂN PHÒNG & KẾT NỐI' : 'OFFICE & DESK GALLERY'}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#151515] tracking-tight">
                {lang === 'vi' ? 'Văn phòng & Không gian làm việc' : 'Workspace & Collaboration'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="border border-[#D9D8D3] bg-white p-2 shadow-sm rounded-lg overflow-hidden group">
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
