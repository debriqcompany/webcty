import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck 
} from 'lucide-react';

interface JoinDebriqPageProps {
  navigate: (path: string) => void;
}

export const JoinDebriqPage: React.FC<JoinDebriqPageProps> = () => {
  const { lang } = useLanguage();
  const { pages } = useData();

  const page = pages?.['join-debriq'];

  const titleStr = typeof page?.title === 'object'
    ? (lang === 'vi' ? page.title.vi : (page.title.en || page.title.vi))
    : (page?.title || (lang === 'vi' ? 'Gia nhập mạng lưới kỹ sư DEBRIQ' : 'Join the Engineer Network'));

  const subtitleStr = typeof page?.subtitle === 'object'
    ? (lang === 'vi' ? page.subtitle.vi : (page.subtitle.en || page.subtitle.vi))
    : (page?.subtitle || (lang === 'vi' ? 'MẠNG LƯỚI KỸ SƯ CHUYÊN GIA' : 'TALENT NETWORK & COLLABORATORS'));

  const descStr = typeof page?.description === 'object'
    ? (lang === 'vi' ? page.description.vi : (page.description.en || page.description.vi))
    : (page?.description || (lang === 'vi'
        ? 'DEBRIQ luôn tìm kiếm các Kỹ sư Kết cấu, Hoàn thiện và Chuyên viên BIM tài năng để cùng triển khai các đại dự án sân bay, cao ốc và đô thị phức hợp.'
        : 'Join our collaborative network of 25+ specialist engineers handling high-density structural and architectural drawing packages.'));

  const contentHtmlStr = typeof page?.contentHtml === 'object'
    ? (lang === 'vi' ? page.contentHtml.vi : (page.contentHtml.en || page.contentHtml.vi))
    : (page?.contentHtml || '');

  const heroImage = page?.heroImage || page?.bannerImage;
  const galleryImages = page?.gallery || [];

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
    if (!formData.fullName || !formData.phone || !formData.email) {
      setError(lang === 'vi' ? 'Vui lòng điền đủ họ tên, số điện thoại và email.' : 'Please fill all required contact fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'candidate',
          ...formData
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gửi hồ sơ thất bại');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi gửi hồ sơ ứng tuyển. Vui lòng thử lại.');
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
      <section className="py-20 border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Why Join DEBRIQ Network */}
            <div className="lg:col-span-5 space-y-8">
              
              <div>
                <span className="type-section-label block mb-1">
                  // {lang === 'vi' ? 'QUYỀN LỢI & MÔI TRƯỜNG' : 'NETWORK ADVANTAGES'}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#151515] tracking-tight">
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

            {/* Right: Application Form */}
            <div className="lg:col-span-7 bg-[#EAE9E4] border border-[#D9D8D3] p-8 sm:p-10">
              
              <div className="border-b border-[#D9D8D3] pb-6 mb-8">
                <span className="type-section-label block mb-1">
                  // {lang === 'vi' ? 'BIỂU MẪU ĐĂNG KÝ HỒ SƠ' : 'ENGINEER APPLICATION FORM'}
                </span>
                <h3 className="font-display text-2xl font-bold text-[#151515]">
                  {lang === 'vi' ? 'Thông tin kỹ sư cộng tác' : 'Submit Your Engineering Profile'}
                </h3>
              </div>

              {submitted ? (
                <div className="bg-white border-2 border-emerald-600 p-8 text-center space-y-4">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="font-display font-bold text-xl text-[#151515]">
                    {lang === 'vi' ? 'Hồ sơ đã được gửi thành công!' : 'Profile Submitted Successfully!'}
                  </h4>
                  <p className="text-sm text-[#555] max-w-md mx-auto font-sans leading-relaxed">
                    {lang === 'vi'
                      ? 'Bộ phận Quản lý Kỹ thuật DEBRIQ sẽ xem xét hồ sơ và liên hệ trao đổi trực tiếp cùng bạn trong vòng 24 - 48 giờ làm việc.'
                      : 'Our Technical Director will review your credentials and contact you within 24-48 business hours.'}
                  </p>
                  <button
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
                    className="bg-[#151515] text-white px-6 py-2.5 text-xs font-mono-tech uppercase tracking-wider font-bold cursor-pointer"
                  >
                    {lang === 'vi' ? 'Gửi hồ sơ khác' : 'Submit Another Profile'}
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
                        {lang === 'vi' ? 'HỌ VÀ TÊN *' : 'FULL NAME *'}
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
                        {lang === 'vi' ? 'SỐ ĐIỆN THOẠI / ZALO *' : 'PHONE / ZALO *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0983..."
                        className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="type-meta-label block mb-1">
                      {lang === 'vi' ? 'ĐỊA CHỈ EMAIL *' : 'EMAIL ADDRESS *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="engineer@example.com"
                      className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="type-meta-label block mb-1">
                        {lang === 'vi' ? 'CHUYÊN MÔN CHÍNH' : 'PRIMARY DISCIPLINE'}
                      </label>
                      <select
                        value={formData.discipline}
                        onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                        className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans"
                      >
                        <option value="Shopdrawing kết cấu RC">Shopdrawing Kết cấu Bê tông cốt thép</option>
                        <option value="Shopdrawing hoàn thiện">Shopdrawing Hoàn thiện Kiến trúc</option>
                        <option value="BIM / Revit Modeler">Dựng mô hình BIM / Revit (LOD 350)</option>
                        <option value="Biện pháp thi công">Thiết kế Biện pháp thi công / Hầm sâu</option>
                      </select>
                    </div>

                    <div>
                      <label className="type-meta-label block mb-1">
                        {lang === 'vi' ? 'SỐ NĂM KINH NGHIỆM' : 'YEARS OF EXPERIENCE'}
                      </label>
                      <select
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                        className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans"
                      >
                        <option value="1-2 năm">1 - 2 năm kinh nghiệm</option>
                        <option value="3-5 năm">3 - 5 năm kinh nghiệm</option>
                        <option value="5-8 năm">5 - 8 năm kinh nghiệm</option>
                        <option value="Trên 8 năm">Trên 8 năm (Chuyên gia/Lead)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="type-meta-label block mb-1">
                      {lang === 'vi' ? 'PHẦN MỀM THÀNH THẠO' : 'SOFTWARE PROFICIENCY'}
                    </label>
                    <input
                      type="text"
                      value={formData.softwareSkills}
                      onChange={(e) => setFormData({ ...formData, softwareSkills: e.target.value })}
                      placeholder="AutoCAD, Revit, KataPro, Navisworks..."
                      className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="type-meta-label block mb-1">
                      {lang === 'vi' ? 'LINK HỒ SƠ / BẢN VẼ MẪU (GOOGLE DRIVE / DROPBOX)' : 'PORTFOLIO LINK'}
                    </label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      placeholder="https://drive.google.com/..."
                      className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="type-meta-label block mb-1">
                      {lang === 'vi' ? 'TÓM TẮT DỰ ÁN ĐÃ THAM GIA' : 'KEY PROJECTS & SUMMARY'}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.experienceSummary}
                      onChange={(e) => setFormData({ ...formData, experienceSummary: e.target.value })}
                      placeholder={lang === 'vi' ? 'Các công trình tiêu biểu, loại hình kết cấu đã từng triển khai...' : 'Highlight key landmark projects handled...'}
                      className="w-full bg-white border border-[#D9D8D3] p-3 text-sm focus:border-[#F27D26] outline-none font-sans leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#F27D26] hover:bg-[#D86616] text-white p-4 font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? (lang === 'vi' ? 'ĐANG GỬI HỒ SƠ...' : 'SUBMITTING...') : (lang === 'vi' ? 'GỬI HỒ SƠ ỨNG TUYỂN DEBRIQ' : 'SUBMIT CANDIDATE PROFILE')}</span>
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
