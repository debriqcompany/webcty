import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, Send, CheckCircle2, AlertCircle, Phone, Mail, Sparkles } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
  servicePrefill?: string;
  initialProject?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ 
  isOpen, 
  onClose, 
  initialService, 
  servicePrefill, 
  initialProject 
}) => {
  const { lang } = useLanguage();
  const modalContentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    serviceInterest: servicePrefill || initialService || 'Shopdrawing kết cấu',
    projectScale: '',
    message: initialProject ? `Quan tâm triển khai tương tự dự án: ${initialProject}` : ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update prefilled service if changed
  useEffect(() => {
    if (servicePrefill || initialService) {
      setFormData(prev => ({
        ...prev,
        serviceInterest: servicePrefill || initialService || prev.serviceInterest
      }));
    }
  }, [servicePrefill, initialService]);

  // Reset modal scroll when opening or after submit
  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen, submitted]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error
    setError(null);

    const name = formData.fullName.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();

    if (!name) {
      setError(lang === 'vi' ? 'Vui lòng nhập họ và tên của bạn.' : 'Please enter your full name.');
      return;
    }

    if (!phone && !email) {
      setError(lang === 'vi' ? 'Vui lòng nhập Số điện thoại (hoặc Email) để kỹ sư liên hệ báo giá.' : 'Please provide either a phone number or email.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          fullName: name,
          company: formData.company.trim(),
          phone: phone,
          email: email,
          serviceInterest: formData.serviceInterest,
          projectScale: formData.projectScale.trim(),
          message: formData.message.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gửi yêu cầu thất bại');
      }

      setSubmitted(true);
      if (modalContentRef.current) {
        modalContentRef.current.scrollTop = 0;
      }
    } catch (err: any) {
      setError(err.message || (lang === 'vi' ? 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại hoặc gọi Hotline 0983 147 456.' : 'Error sending request. Please call our hotline.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setError(null);
    setFormData({
      fullName: '',
      company: '',
      email: '',
      phone: '',
      serviceInterest: 'Shopdrawing kết cấu',
      projectScale: '',
      message: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#151515]/85 backdrop-blur-md animate-fade-in touch-manipulation">
      {/* Backdrop overlay for outside tap */}
      <div className="fixed inset-0 -z-10" onClick={handleResetAndClose} />

      <div 
        ref={modalContentRef}
        className="relative w-full max-w-xl bg-[#F3F2EE] border-2 border-[#151515] shadow-2xl p-5 sm:p-8 max-h-[92vh] overflow-y-auto rounded-xl sm:rounded-none"
      >
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-[#151515] hover:bg-[#E2E1DC] border border-[#D9D8D3] focus:outline-none transition-colors cursor-pointer rounded-full sm:rounded-none z-10"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* Mobile Optimized Success Confirmation Popup */
          <div className="py-8 sm:py-10 text-center space-y-5 font-sans animate-fade-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/15 border-2 border-emerald-600 text-emerald-600 mx-auto flex items-center justify-center rounded-full shadow-lg">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 font-mono-tech text-xs font-bold uppercase rounded-full">
                {lang === 'vi' ? '✓ ĐÃ TIẾP NHẬN THÀNH CÔNG' : '✓ REQUEST RECEIVED'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#151515] font-display uppercase tracking-tight">
                {lang === 'vi' ? 'DEBRIQ ĐÃ NHẬN YÊU CẦU' : 'QUOTE INQUIRY RECEIVED'}
              </h3>
              <p className="text-sm sm:text-base text-[#444] max-w-md mx-auto leading-relaxed pt-1">
                {lang === 'vi'
                  ? 'Kỹ sư trưởng DEBRIQ sẽ trực tiếp liên hệ lại bạn qua Số điện thoại / Zalo hoặc Email trong vòng 24 giờ để trao đổi giải pháp và gửi bảng dự toán tối ưu nhất.'
                  : 'A DEBRIQ Lead Engineer will contact you via Phone/Zalo or Email within 24 business hours.'}
              </p>
            </div>

            {/* Quick Hotline action */}
            <div className="p-4 bg-[#EAE9E4] border border-[#D9D8D3] rounded-lg text-xs text-[#555] max-w-md mx-auto space-y-2">
              <span className="font-bold text-[#151515] block uppercase">
                {lang === 'vi' ? 'CẦN TƯ VẤN GẤP TIẾN ĐỘ ĐỔ BÊ TÔNG / HỒ SƠ?' : 'URGENT TIMELINE INQUIRY?'}
              </span>
              <a
                href="tel:0983147456"
                className="inline-flex items-center gap-2 bg-[#F27D26] hover:bg-[#D86616] text-white px-5 py-2.5 font-bold font-mono-tech text-xs rounded uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>GỌI HOTLINE: 0983 147 456</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto bg-[#151515] hover:bg-[#333] text-white px-8 py-3.5 font-sans font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer rounded-lg sm:rounded-none shadow-md"
              >
                {lang === 'vi' ? 'ĐÓNG CỬA SỔ' : 'CLOSE WINDOW'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="border-b border-[#D9D8D3] pb-4 mb-5 pr-8">
              <span className="type-section-label block mb-1">
                // {lang === 'vi' ? 'TIẾP NHẬN HỒ SƠ DỰ ÁN' : 'PROJECT INQUIRY & QUOTATION'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#151515] tracking-tight font-display uppercase">
                {lang === 'vi' ? 'Yêu cầu báo giá Shopdrawing & Kỹ thuật' : 'Request a Technical Quote'}
              </h2>
              <p className="text-xs text-[#767670] mt-1 font-sans">
                {lang === 'vi' 
                  ? 'Vui lòng cung cấp thông tin sơ bộ để kỹ sư DEBRIQ đưa ra phương án triển khai tối ưu.' 
                  : 'Please provide preliminary project details for technical review.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-800 text-xs flex items-center gap-2 font-sans font-medium rounded animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[#333] uppercase type-meta-label mb-1 font-bold">
                    {lang === 'vi' ? 'Họ và tên *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-3 text-sm font-sans rounded-md sm:rounded-none outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#333] uppercase type-meta-label mb-1 font-bold">
                    {lang === 'vi' ? 'Công ty / Nhà thầu' : 'Company / Contractor'}
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={lang === 'vi' ? 'Tổng thầu / Ban chỉ huy...' : 'Contractor / PM Board...'}
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-3 text-sm font-sans rounded-md sm:rounded-none outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[#333] uppercase type-meta-label mb-1 font-bold">
                    {lang === 'vi' ? 'Số điện thoại / Zalo *' : 'Phone / Zalo *'}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0983..."
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-3 text-sm font-mono-tech rounded-md sm:rounded-none outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#333] uppercase type-meta-label mb-1 font-bold">
                    {lang === 'vi' ? 'Email liên hệ' : 'Work Email'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.vn"
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-3 text-sm font-sans rounded-md sm:rounded-none outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[#333] uppercase type-meta-label mb-1 font-bold">
                    {lang === 'vi' ? 'Dịch vụ quan tâm' : 'Primary Service'}
                  </label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-3 text-sm font-sans rounded-md sm:rounded-none outline-none"
                  >
                    <option value="Shopdrawing kết cấu">Shopdrawing kết cấu bê tông cốt thép</option>
                    <option value="Shopdrawing hoàn thiện">Shopdrawing hoàn thiện kiến trúc</option>
                    <option value="BIM / Revit">BIM / Revit & Kiểm soát xung đột</option>
                    <option value="Biện pháp thi công">Biện pháp thi công & Tầng hầm Top-down</option>
                    <option value="Trọn gói Kết cấu + Hoàn thiện">Trọn gói Kết cấu + Hoàn thiện</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#333] uppercase type-meta-label mb-1 font-bold">
                    {lang === 'vi' ? 'Quy mô / Diện tích công trình' : 'Project Scale / Area'}
                  </label>
                  <input
                    type="text"
                    value={formData.projectScale}
                    onChange={(e) => setFormData({ ...formData, projectScale: e.target.value })}
                    placeholder={lang === 'vi' ? 'Ví dụ: 3 hầm, 25 tầng, 45.000 m²' : 'e.g. 3 basements, 25 floors...'}
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-3 text-sm font-sans rounded-md sm:rounded-none outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#333] uppercase type-meta-label mb-1 font-bold">
                  {lang === 'vi' ? 'Mô tả phạm vi / Yêu cầu tiến độ' : 'Scope Description & Timeline'}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={lang === 'vi' ? 'Nhập thông tin phạm vi công việc, tiến độ cần hồ sơ, địa điểm công trình...' : 'Describe deliverables, milestones, site location...'}
                  className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] p-3 text-sm font-sans leading-relaxed rounded-md sm:rounded-none outline-none"
                />
              </div>

              {/* Direct Hotline strip */}
              <div className="bg-[#EAE9E4] p-3 border border-[#D9D8D3] rounded-md sm:rounded-none flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#666] font-sans">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span>{lang === 'vi' ? 'Hotline/Zalo:' : 'Hotline/Zalo:'} <strong className="font-mono-tech text-[#151515]">0983 147 456</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span className="font-mono-tech">contact@debriq.vn</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-3 border border-[#D9D8D3] hover:border-[#151515] text-[#151515] uppercase font-bold text-xs tracking-wider transition-colors cursor-pointer text-center rounded-md sm:rounded-none"
                >
                  {lang === 'vi' ? 'HỦY BỎ' : 'CANCEL'}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-[#F27D26] hover:bg-[#D86616] active:scale-95 text-white px-8 py-3.5 uppercase font-bold text-xs tracking-wider inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer rounded-md sm:rounded-none shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? (lang === 'vi' ? 'ĐANG GỬI...' : 'SENDING...') : (lang === 'vi' ? 'GỬI YÊU CẦU BÁO GIÁ' : 'SUBMIT REQUEST')}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
