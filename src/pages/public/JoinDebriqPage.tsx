import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  Phone,
  Sparkles
} from 'lucide-react';
import { getBilingualText, isValidImageUrl } from '../../utils/bilingual';

interface JoinDebriqPageProps {
  navigate: (path: string) => void;
}

export const JoinDebriqPage: React.FC<JoinDebriqPageProps> = () => {
  const { lang } = useLanguage();
  const { pages } = useData();
  const formContainerRef = useRef<HTMLDivElement>(null);

  const page = pages?.['join-debriq'];

  const titleStr = getBilingualText(
    page?.title,
    lang,
    'Gia nhập mạng lưới kỹ sư DEBRIQ',
    'Join the Engineer Network'
  );

  const subtitleStr = getBilingualText(
    page?.subtitle,
    lang,
    'MẠNG LƯỚI KỸ SƯ CHUYÊN GIA',
    'TALENT NETWORK & COLLABORATORS'
  );

  const descStr = getBilingualText(
    page?.description || page?.metaDescription,
    lang,
    'DEBRIQ luôn tìm kiếm các Kỹ sư Kết cấu, Hoàn thiện và Chuyên viên BIM tài năng để cùng triển khai các đại dự án sân bay, cao ốc và đô thị phức hợp.',
    'Join our collaborative network of 25+ specialist engineers handling high-density structural and architectural drawing packages.'
  );

  const contentHtmlStr = getBilingualText(page?.contentHtml, lang, '', '');

  const rawHeroImage = page?.heroImage || page?.bannerImage;
  const heroImage = isValidImageUrl(rawHeroImage) ? rawHeroImage : undefined;
  const galleryImages = (page?.gallery || []).filter(isValidImageUrl);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    discipline: 'Shopdrawing kết cấu RC',
    experienceYears: '3-5 năm',
    softwareSkills: 'AutoCAD, KataPro',
    portfolioUrl: '',
    experienceSummary: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = formData.fullName.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();

    if (!name) {
      setError(lang === 'vi' ? 'Vui lòng điền họ và tên của bạn.' : 'Please enter your full name.');
      return;
    }

    if (!phone && !email) {
      setError(lang === 'vi' ? 'Vui lòng điền Số điện thoại (hoặc Email) để bộ phận nhân sự liên hệ.' : 'Please provide either a phone number or email.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'candidate',
          fullName: name,
          phone: phone,
          email: email,
          discipline: formData.discipline,
          experienceYears: formData.experienceYears,
          softwareSkills: formData.softwareSkills.trim(),
          portfolioUrl: formData.portfolioUrl.trim(),
          experienceSummary: formData.experienceSummary.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gửi hồ sơ thất bại');
      }

      setSubmitted(true);
      setTimeout(() => {
        formContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } catch (err: any) {
      setError(err.message || (lang === 'vi' ? 'Lỗi khi gửi hồ sơ ứng tuyển. Vui lòng thử lại hoặc gọi hotline 0983 147 456.' : 'Submission error. Please try again.'));
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

      {/* Prominent Hero Banner if uploaded */}
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

      {/* Network Benefits & Application Form Grid */}
      <section className="py-16 sm:py-20 border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left: Why Join DEBRIQ Network */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              
              <div>
                <span className="type-section-label block mb-1">
                  // {lang === 'vi' ? 'QUYỀN LỢI & MÔI TRƯỜNG' : 'NETWORK ADVANTAGES'}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#151515] tracking-tight uppercase">
                  {lang === 'vi' ? 'Tại sao hợp tác cùng DEBRIQ?' : 'Why Collaborate with DEBRIQ?'}
                </h2>
              </div>

              <div className="space-y-4 font-sans text-sm">
                <div className="bg-[#EAE9E4] p-5 border border-[#D9D8D3] space-y-2">
                  <span className="font-display font-bold text-base text-[#151515] block">
                    01. {lang === 'vi' ? 'Dự án quy mô lớn & Đa dạng' : 'Landmark Scale & Diverse Typologies'}
                  </span>
                  <p className="text-[#555] leading-relaxed">
                    {lang === 'vi' 
                      ? 'Cơ hội thực chiến với hồ sơ nhà ga hàng không, cao ốc văn phòng hạng A, đại đô thị và hạ tầng kỹ thuật phức tạp.' 
                      : 'Hands-on engagement in airport terminals, Grade-A towers, and mega townships across Vietnam.'}
                  </p>
                </div>

                <div className="bg-[#EAE9E4] p-5 border border-[#D9D8D3] space-y-2">
                  <span className="font-display font-bold text-base text-[#151515] block">
                    02. {lang === 'vi' ? 'Quy trình chuẩn hóa & Hỗ trợ kỹ thuật' : 'Standardized Framework & Lead Support'}
                  </span>
                  <p className="text-[#555] leading-relaxed">
                    {lang === 'vi' 
                      ? 'Làm việc trên nền tảng CAD standard, lisp chuyên dụng và được các Kỹ sư trưởng hỗ trợ giải quyết bài toán khó.' 
                      : 'Operate with unified CAD standards, custom automation lisps, and senior lead engineer guidance.'}
                  </p>
                </div>

                <div className="bg-[#EAE9E4] p-5 border border-[#D9D8D3] space-y-2">
                  <span className="font-display font-bold text-base text-[#151515] block">
                    03. {lang === 'vi' ? 'Chế độ minh bạch & Thanh toán đúng hẹn' : 'Transparent & Punctual Remuneration'}
                  </span>
                  <p className="text-[#555] leading-relaxed">
                    {lang === 'vi' 
                      ? 'Hợp đồng cộng tác rõ ràng theo từng gói bản vẽ; nghiệm thu chuẩn xác và thanh toán đúng tiến độ cam kết.' 
                      : 'Clear milestone agreements per drawing package with reliable, on-time disbursement.'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#151515] text-[#F3F2EE] font-mono-tech text-xs space-y-1">
                <div className="flex items-center gap-2 text-[#F27D26]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-bold">DEBRIQ TALENT COMMITMENT</span>
                </div>
                <p className="text-[#A0A09A] pt-1 leading-relaxed">
                  {lang === 'vi' 
                    ? 'Bảo mật thông tin cá nhân và tôn trọng bản quyền sản phẩm kỹ thuật theo tiêu chuẩn nghề nghiệp.' 
                    : 'Strict candidate confidentiality and adherence to professional engineering ethics.'}
                </p>
              </div>

            </div>

            {/* Right: Application Form (Anchored with ref) */}
            <div 
              ref={formContainerRef}
              className="lg:col-span-7 bg-[#EAE9E4] border-2 border-[#D9D8D3] p-6 sm:p-10 transition-all rounded-xl sm:rounded-none shadow-md min-h-[480px] flex flex-col justify-center scroll-mt-24"
            >
              
              {submitted ? (
                /* Mobile & Desktop Smooth Success Confirmation */
                <div className="bg-white border-2 border-emerald-600 p-6 sm:p-10 text-center space-y-5 rounded-lg shadow-lg animate-fade-in my-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 border-2 border-emerald-600 mx-auto flex items-center justify-center rounded-full shadow-md">
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-mono-tech text-xs font-bold uppercase rounded-full">
                      {lang === 'vi' ? '✓ ĐÃ TIẾP NHẬN HỒ SƠ KỸ SƯ' : '✓ PROFILE SUBMITTED'}
                    </span>
                    <h4 className="font-display font-extrabold text-2xl sm:text-3xl text-[#151515] uppercase tracking-tight">
                      {lang === 'vi' ? 'ỨNG TUYỂN THÀNH CÔNG!' : 'PROFILE RECEIVED!'}
                    </h4>
                    <p className="text-sm sm:text-base text-[#444] max-w-md mx-auto font-sans leading-relaxed pt-1">
                      {lang === 'vi'
                        ? 'Bộ phận Quản lý Kỹ thuật DEBRIQ đã nhận được hồ sơ của bạn và sẽ liên hệ trao đổi trực tiếp trong vòng 24 - 48 giờ làm việc.'
                        : 'Our Technical Director will review your credentials and contact you within 24-48 business hours.'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          phone: '',
                          email: '',
                          discipline: 'Shopdrawing kết cấu RC',
                          experienceYears: '3-5 năm',
                          softwareSkills: 'AutoCAD, KataPro',
                          portfolioUrl: '',
                          experienceSummary: ''
                        });
                      }}
                      className="bg-[#151515] hover:bg-[#F27D26] text-white px-8 py-3.5 text-xs font-mono-tech uppercase tracking-wider font-bold cursor-pointer transition-colors shadow-md rounded sm:rounded-none"
                    >
                      {lang === 'vi' ? 'GỬI THÊM HỒ SƠ KHÁC' : 'SUBMIT ANOTHER PROFILE'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="border-b border-[#D9D8D3] pb-4 mb-6">
                    <span className="type-section-label block mb-1">
                      // {lang === 'vi' ? 'BIỂU MẪU ĐĂNG KÝ HỒ SƠ' : 'ENGINEER APPLICATION FORM'}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-[#151515] uppercase tracking-tight">
                      {lang === 'vi' ? 'Thông tin kỹ sư cộng tác' : 'Submit Your Engineering Profile'}
                    </h3>
                  </div>

                  {error && (
                    <div className="mb-6 p-3.5 bg-red-100 border border-red-400 text-red-800 text-xs flex items-center gap-2 rounded font-medium animate-fade-in">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="type-meta-label block mb-1 font-bold">
                          {lang === 'vi' ? 'HỌ VÀ TÊN *' : 'FULL NAME *'}
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Nguyễn Văn A"
                          className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans rounded sm:rounded-none"
                        />
                      </div>

                      <div>
                        <label className="type-meta-label block mb-1 font-bold">
                          {lang === 'vi' ? 'SỐ ĐIỆN THOẠI / ZALO *' : 'PHONE / ZALO *'}
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0983..."
                          className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans rounded sm:rounded-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="type-meta-label block mb-1 font-bold">
                        {lang === 'vi' ? 'ĐỊA CHỈ EMAIL' : 'EMAIL ADDRESS'}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="engineer@example.com"
                        className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans rounded sm:rounded-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="type-meta-label block mb-1 font-bold">
                          {lang === 'vi' ? 'CHUYÊN MÔN CHÍNH' : 'PRIMARY DISCIPLINE'}
                        </label>
                        <select
                          value={formData.discipline}
                          onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                          className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans rounded sm:rounded-none"
                        >
                          <option value="Shopdrawing kết cấu RC">Shopdrawing Kết cấu Bê tông cốt thép</option>
                          <option value="Shopdrawing hoàn thiện">Shopdrawing Hoàn thiện Kiến trúc</option>
                          <option value="BIM / Revit Modeler">Dựng mô hình BIM / Revit (LOD 350)</option>
                          <option value="Biện pháp thi công">Thiết kế Biện pháp thi công / Hầm sâu</option>
                        </select>
                      </div>

                      <div>
                        <label className="type-meta-label block mb-1 font-bold">
                          {lang === 'vi' ? 'SỐ NĂM KINH NGHIỆM' : 'YEARS OF EXPERIENCE'}
                        </label>
                        <select
                          value={formData.experienceYears}
                          onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                          className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans rounded sm:rounded-none"
                        >
                          <option value="1-2 năm">1 - 2 năm kinh nghiệm</option>
                          <option value="3-5 năm">3 - 5 năm kinh nghiệm</option>
                          <option value="5-8 năm">5 - 8 năm kinh nghiệm</option>
                          <option value="Trên 8 năm">Trên 8 năm (Chuyên gia/Lead)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="type-meta-label block mb-1 font-bold">
                        {lang === 'vi' ? 'PHẦN MỀM THÀNH THẠO' : 'SOFTWARE PROFICIENCY'}
                      </label>
                      <input
                        type="text"
                        value={formData.softwareSkills}
                        onChange={(e) => setFormData({ ...formData, softwareSkills: e.target.value })}
                        placeholder="AutoCAD, Revit, KataPro, Navisworks..."
                        className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans rounded sm:rounded-none"
                      />
                    </div>

                    <div>
                      <label className="type-meta-label block mb-1 font-bold">
                        {lang === 'vi' ? 'LINK HỒ SƠ / BẢN VẼ MẪU (GOOGLE DRIVE / DROPBOX)' : 'PORTFOLIO LINK'}
                      </label>
                      <input
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://drive.google.com/..."
                        className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans rounded sm:rounded-none"
                      />
                    </div>

                    <div>
                      <label className="type-meta-label block mb-1 font-bold">
                        {lang === 'vi' ? 'TÓM TẮT DỰ ÁN ĐÃ THAM GIA' : 'KEY PROJECTS & SUMMARY'}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.experienceSummary}
                        onChange={(e) => setFormData({ ...formData, experienceSummary: e.target.value })}
                        placeholder={lang === 'vi' ? 'Các công trình tiêu biểu, loại hình kết cấu đã từng triển khai...' : 'Highlight key landmark projects handled...'}
                        className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans leading-relaxed rounded sm:rounded-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#F27D26] hover:bg-[#D86616] active:scale-95 text-white p-4 font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg rounded sm:rounded-none"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? (lang === 'vi' ? 'ĐANG GỬI HỒ SƠ...' : 'SUBMITTING...') : (lang === 'vi' ? 'GỬI HỒ SƠ ỨNG TUYỂN DEBRIQ' : 'SUBMIT CANDIDATE PROFILE')}</span>
                    </button>

                  </form>
                </div>
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
                // {lang === 'vi' ? 'HÌNH ẢNH HOẠT ĐỘNG KỸ THUẬT' : 'ENGINEERING TEAM & ACTIVITIES'}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#151515] tracking-tight">
                {lang === 'vi' ? 'Đội ngũ & Môi trường triển khai' : 'Collaborative Engineering Environment'}
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
