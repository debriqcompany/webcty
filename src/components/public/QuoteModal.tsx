import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, Send, CheckCircle, AlertCircle, Phone, Mail, FileText } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || (!formData.email && !formData.phone)) {
      setError(lang === 'vi' ? 'Vui lòng điền họ tên và email hoặc số điện thoại.' : 'Please provide your name and email or phone.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          ...formData
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gửi yêu cầu thất bại');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại hoặc liên hệ Hotline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#151515]/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#F3F2EE] border border-[#151515] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#151515] hover:bg-[#E2E1DC] border border-[#D9D8D3] focus:outline-none transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4 font-sans">
            <div className="w-16 h-16 bg-[#F27D26]/10 border border-[#F27D26] text-[#F27D26] mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#151515] font-display">
              {lang === 'vi' ? 'Yêu cầu báo giá đã được tiếp nhận' : 'Quote Request Received'}
            </h3>
            <p className="text-sm text-[#666] max-w-md mx-auto leading-relaxed">
              {lang === 'vi'
                ? 'Kỹ sư trưởng DEBRIQ sẽ liên hệ trực tiếp qua điện thoại hoặc email trong vòng 24 giờ làm việc để trao đổi phạm vi hồ sơ.'
                : 'A DEBRIQ Lead Engineer will contact you via phone or email within 24 working hours to review project documentation.'}
            </p>
            <div className="pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-[#151515] text-white px-6 py-2.5 font-sans font-semibold text-xs uppercase tracking-wider hover:bg-[#F27D26] transition-colors cursor-pointer"
              >
                {lang === 'vi' ? 'Đóng cửa sổ' : 'Close window'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="border-b border-[#D9D8D3] pb-4 mb-6">
              <span className="type-section-label block mb-1">
                // {lang === 'vi' ? 'TIẾP NHẬN HỒ SƠ DỰ ÁN' : 'PROJECT INQUIRY & QUOTATION'}
              </span>
              <h2 className="text-2xl font-bold text-[#151515] tracking-tight font-display">
                {lang === 'vi' ? 'Gửi yêu cầu báo giá shopdrawing & kỹ thuật' : 'Request a Technical Shopdrawing Quote'}
              </h2>
              <p className="text-xs text-[#767670] mt-1 font-sans">
                {lang === 'vi' 
                  ? 'Vui lòng cung cấp thông tin sơ bộ về dự án để DEBRIQ đưa ra phương án triển khai tối ưu nhất.' 
                  : 'Please provide preliminary project details for DEBRIQ engineering review.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 text-xs flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
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
                    placeholder={lang === 'vi' ? 'Nguyễn Văn A' : 'John Doe'}
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] focus:ring-0 p-2.5 text-sm font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[#333] uppercase type-meta-label mb-1">
                    {lang === 'vi' ? 'Công ty / Đơn vị thi công' : 'Company / Contractor'}
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={lang === 'vi' ? 'Tổng thầu / Ban chỉ huy...' : 'Contractor / PM Board...'}
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] focus:ring-0 p-2.5 text-sm font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#333] uppercase type-meta-label mb-1">
                    {lang === 'vi' ? 'Số điện thoại / Zalo *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0983..."
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] focus:ring-0 p-2.5 text-sm font-mono-tech"
                  />
                </div>

                <div>
                  <label className="block text-[#333] uppercase type-meta-label mb-1">
                    {lang === 'vi' ? 'Email liên hệ *' : 'Work Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.vn"
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] focus:ring-0 p-2.5 text-sm font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#333] uppercase type-meta-label mb-1">
                    {lang === 'vi' ? 'Dịch vụ quan tâm' : 'Primary Service'}
                  </label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] focus:ring-0 p-2.5 text-sm font-sans"
                  >
                    <option value="Shopdrawing kết cấu">Shopdrawing kết cấu bê tông cốt thép</option>
                    <option value="Shopdrawing hoàn thiện">Shopdrawing hoàn thiện kiến trúc</option>
                    <option value="BIM / Revit">BIM / Revit & Kiểm soát xung đột</option>
                    <option value="Biện pháp thi công">Biện pháp thi công & Tầng hầm Top-down</option>
                    <option value="Trọn gói Kết cấu + Hoàn thiện">Trọn gói Kết cấu + Hoàn thiện</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#333] uppercase type-meta-label mb-1">
                    {lang === 'vi' ? 'Quy mô / Diện tích công trình' : 'Project Scale / Area'}
                  </label>
                  <input
                    type="text"
                    value={formData.projectScale}
                    onChange={(e) => setFormData({ ...formData, projectScale: e.target.value })}
                    placeholder={lang === 'vi' ? 'Ví dụ: 3 hầm, 25 tầng nổi, 45.000 m² sàn' : 'e.g. 3 basements, 25 floors, 45,000 m²'}
                    className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] focus:ring-0 p-2.5 text-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#333] uppercase type-meta-label mb-1">
                  {lang === 'vi' ? 'Mô tả phạm vi / Yêu cầu tiến độ' : 'Scope Description & Timeline'}
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={lang === 'vi' ? 'Nhập thông tin phạm vi công việc, tiến độ cần hồ sơ, địa điểm công trình...' : 'Describe specific deliverables, milestones, site location...'}
                  className="w-full bg-white border border-[#D9D8D3] focus:border-[#F27D26] focus:ring-0 p-2.5 text-sm font-sans leading-relaxed"
                />
              </div>

              {/* Direct Hotline strip */}
              <div className="bg-[#EAE9E4] p-3 border border-[#D9D8D3] flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#666] font-sans">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span>{lang === 'vi' ? 'Tư vấn kỹ thuật nhanh qua Hotline/Zalo:' : 'Urgent review Hotline/Zalo:'} <strong className="font-mono-tech text-[#151515]">0983 147 456</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span className="font-mono-tech">contact@debriq.vn</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-[#D9D8D3] hover:border-[#151515] text-[#151515] uppercase font-semibold text-xs tracking-wider transition-colors cursor-pointer"
                >
                  {lang === 'vi' ? 'Hủy bỏ' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#151515] hover:bg-[#F27D26] text-white px-6 py-2.5 uppercase font-semibold text-xs tracking-wider inline-flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? (lang === 'vi' ? 'Đang gửi...' : 'Sending...') : (lang === 'vi' ? 'Gửi yêu cầu báo giá' : 'Submit request')}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
