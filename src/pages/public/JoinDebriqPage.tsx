import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
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
              // {lang === 'vi' ? 'MẠNG LƯỚI KỸ SƯ CHUYÊN GIA' : 'TALENT NETWORK & COLLABORATORS'}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#151515] leading-[1.05]">
              {lang === 'vi' ? 'Gia nhập mạng lưới kỹ sư DEBRIQ' : 'Join the Engineer Network'}
            </h1>
            <p className="type-body-lg text-base sm:text-lg text-[#555] leading-relaxed font-sans">
              {lang === 'vi'
                ? 'DEBRIQ luôn tìm kiếm các Kỹ sư Kết cấu, Hoàn thiện và Chuyên viên BIM tài năng để cùng triển khai các đại dự án sân bay, cao ốc và đô thị phức hợp.'
                : 'Join our collaborative network of 25+ specialist engineers handling high-density structural and architectural drawing packages.'}
            </p>
          </div>
        </div>
      </section>

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
                  {lang === 'vi' ? 'Tại sao nên đồng hành cùng DEBRIQ?' : 'Why Collaborate With DEBRIQ?'}
                </h2>
              </div>

              <div className="space-y-6">
                
                <div className="border-l-2 border-[#F27D26] pl-4 space-y-1.5">
                  <h3 className="font-sans text-sm font-semibold text-[#151515]">
                    {lang === 'vi' ? 'Dự án quy mô lớn & thử thách kỹ thuật' : 'Landmark mega-scale projects'}
                  </h3>
                  <p className="text-xs text-[#555] leading-relaxed font-sans">
                    {lang === 'vi'
                      ? 'Cơ hội trực tiếp tham gia các công trình cấp quốc gia (Sân bay quốc tế, Khách sạn 5 sao, Đại đô thị 200+ ha), nâng tầm profile cá nhân.'
                      : 'Work on national aviation hubs, 5-star hotels, and 200+ hectare townships.'}
                  </p>
                </div>

                <div className="border-l-2 border-[#151515] pl-4 space-y-1.5">
                  <h3 className="font-sans text-sm font-semibold text-[#151515]">
                    {lang === 'vi' ? 'Thu nhập cạnh tranh & minh bạch khối lượng' : 'Transparent output-based earnings'}
                  </h3>
                  <p className="text-xs text-[#555] leading-relaxed font-sans">
                    {lang === 'vi'
                      ? 'Cơ chế thù lao rõ ràng theo khối lượng bản vẽ và chất lượng hồ sơ được phê duyệt. Thanh toán đúng hạn, sòng phẳng.'
                      : 'Clear compensation based on delivered drawing volume and QA approval.'}
                  </p>
                </div>

                <div className="border-l-2 border-[#8D8D88] pl-4 space-y-1.5">
                  <h3 className="font-sans text-sm font-semibold text-[#151515]">
                    {lang === 'vi' ? 'Linh hoạt thời gian & địa điểm' : 'Flexible remote collaboration'}
                  </h3>
                  <p className="text-xs text-[#555] leading-relaxed font-sans">
                    {lang === 'vi'
                      ? 'Làm việc từ xa hoặc bán thời gian với hệ thống quản lý task và tiêu chuẩn CAD/BIM đồng bộ, chuyên nghiệp.'
                      : 'Work remotely with synchronized CAD standards and task boards.'}
                  </p>
                </div>

              </div>

              {/* Verified Badge */}
              <div className="p-4 bg-[#EAE9E4] border border-[#D9D8D3] font-sans text-xs text-[#666] flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#F27D26] shrink-0" />
                <span className="leading-relaxed">
                  {lang === 'vi' 
                    ? 'Hồ sơ cộng tác viên được bảo mật thông tin và ký kết thỏa thuận hợp tác chuyên môn chính thức.' 
                    : 'All collaborator details remain strictly confidential under mutual NDA agreements.'}
                </span>
              </div>

            </div>

            {/* Right: Application Form */}
            <div className="lg:col-span-7 bg-[#EAE9E4] border border-[#D9D8D3] p-6 sm:p-10 shadow-sm">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4 font-sans">
                  <div className="w-16 h-16 bg-[#F27D26]/10 border border-[#F27D26] text-[#F27D26] mx-auto flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#151515] font-display">
                    {lang === 'vi' ? 'Hồ sơ của bạn đã được ghi nhận!' : 'Application Successfully Received!'}
                  </h3>
                  <p className="text-sm text-[#666] max-w-md mx-auto font-sans leading-relaxed">
                    {lang === 'vi'
                      ? 'Ban Kỹ thuật DEBRIQ sẽ xem xét profile và liên hệ trao đổi phương án hợp tác trong vòng 48 giờ làm việc.'
                      : 'DEBRIQ Engineering Board will review your credentials and contact you within 48 working hours.'}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-[#151515] text-white px-6 py-2.5 font-semibold text-xs uppercase tracking-wider hover:bg-[#F27D26] transition-colors cursor-pointer"
                    >
                      {lang === 'vi' ? 'Gửi hồ sơ khác' : 'Submit another application'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="border-b border-[#D9D8D3] pb-4 mb-6">
                    <span className="type-section-label block mb-1">
                      // {lang === 'vi' ? 'BIỂU MẪU ỨNG TUYỂN KỸ SƯ' : 'ENGINEER APPLICATION FORM'}
                    </span>
                    <h2 className="font-display text-2xl font-bold text-[#151515] tracking-tight">
                      {lang === 'vi' ? 'Đăng ký gia nhập mạng lưới cộng tác viên' : 'Apply for the collaborator network'}
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
                          {lang === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder={lang === 'vi' ? 'Kỹ sư Nguyễn Văn A' : 'Engineer John Doe'}
                          className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-sans focus:outline-none"
                        />
                      </div>

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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#333] uppercase type-meta-label mb-1">
                          {lang === 'vi' ? 'Email liên hệ *' : 'Email Address *'}
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="engineer@domain.com"
                          className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-sans focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[#333] uppercase type-meta-label mb-1">
                          {lang === 'vi' ? 'Chuyên môn chính' : 'Primary Discipline'}
                        </label>
                        <select
                          value={formData.discipline}
                          onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                          className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-sans focus:outline-none"
                        >
                          <option value="Shopdrawing kết cấu RC">Shopdrawing Kết cấu Bê tông cốt thép</option>
                          <option value="Shopdrawing hoàn thiện">Shopdrawing Hoàn thiện Kiến trúc</option>
                          <option value="BIM / Revit Specialist">BIM / Revit Modeler & Coordination</option>
                          <option value="Biện pháp thi công">Biện pháp thi công & Tầng hầm Top-down</option>
                          <option value="Bóc tách khối lượng & BBS">Bóc tách khối lượng & BBS Thép</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#333] uppercase type-meta-label mb-1">
                          {lang === 'vi' ? 'Số năm kinh nghiệm' : 'Years of Experience'}
                        </label>
                        <select
                          value={formData.experienceYears}
                          onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                          className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-sans focus:outline-none"
                        >
                          <option value="1-2 năm">1 - 2 năm kinh nghiệm</option>
                          <option value="3-5 năm">3 - 5 năm kinh nghiệm (Ưu tiên)</option>
                          <option value="5-8 năm">5 - 8 năm kinh nghiệm</option>
                          <option value="Trên 8 năm">Trên 8 năm (Senior / Lead)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[#333] uppercase type-meta-label mb-1">
                          {lang === 'vi' ? 'Phần mềm thành thạo' : 'Software Mastery'}
                        </label>
                        <input
                          type="text"
                          value={formData.softwareSkills}
                          onChange={(e) => setFormData({ ...formData, softwareSkills: e.target.value })}
                          placeholder="AutoCAD, Revit, KataPro, Navisworks..."
                          className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-sans focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#333] uppercase type-meta-label mb-1">
                        {lang === 'vi' ? 'Link CV / Portfolio / Bản vẽ mẫu (Google Drive / LinkedIn)' : 'Portfolio / Sample Drawing Link (Drive / LinkedIn)'}
                      </label>
                      <input
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        placeholder="https://drive.google.com/... hoặc https://linkedin.com/in/..."
                        className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-mono-tech focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#333] uppercase type-meta-label mb-1">
                        {lang === 'vi' ? 'Tóm tắt các dự án / công trình đã từng tham gia' : 'Summary of Past Projects & Relevant Experience'}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.experienceSummary}
                        onChange={(e) => setFormData({ ...formData, experienceSummary: e.target.value })}
                        placeholder={lang === 'vi' ? 'Ví dụ: Đã từng tham gia Shopdrawing kết cấu hầm và thân cao ốc 30 tầng tại Coteccons/Ricons...' : 'e.g. Delivered structural shopdrawings for 30-story towers...'}
                        className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-2.5 text-sm font-sans focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#151515] hover:bg-[#F27D26] text-white py-4 uppercase tracking-wider font-semibold inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>{submitting ? (lang === 'vi' ? 'Đang gửi hồ sơ...' : 'Submitting...') : (lang === 'vi' ? 'Nộp hồ sơ gia nhập mạng lưới' : 'Submit application')}</span>
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
