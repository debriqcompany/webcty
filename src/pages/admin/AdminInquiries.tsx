import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Trash2, CheckCircle2, User, FileText, AlertCircle, RefreshCw } from 'lucide-react';

interface InquiryItem {
  id: string;
  type: string;
  fullName: string;
  phone?: string;
  email?: string;
  company?: string;
  serviceInterest?: string;
  projectScale?: string;
  message?: string;
  discipline?: string;
  experienceYears?: string;
  softwareSkills?: string;
  portfolioUrl?: string;
  experienceSummary?: string;
  createdAt: string;
  status?: string;
}

interface AdminInquiriesProps {
  token: string | null;
}

export const AdminInquiries: React.FC<AdminInquiriesProps> = ({ token }) => {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/inquiries', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [token]);

  const [deletingInquiryId, setDeletingInquiryId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      fetchInquiries();
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      setDeletingInquiryId(null);
    } catch (err) {
      console.error('Lỗi xóa bản ghi', err);
    }
  };

  const filtered = inquiries.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6 font-mono-tech text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1E1E1E] p-4 border border-[#333]">
        <div>
          <h2 className="text-base font-bold text-[#F3F2EE] uppercase">
            HỘP THƯ & TIẾP NHẬN HỒ SƠ ({inquiries.length})
          </h2>
          <p className="text-[11px] text-[#777]">
            Danh sách yêu cầu báo giá từ Tổng thầu và hồ sơ ứng tuyển từ Kỹ sư
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 uppercase ${filterType === 'all' ? 'bg-[#F27D26] text-white font-bold' : 'bg-[#2A2A2A] text-[#AAA]'}`}
          >
            TẤT CẢ ({inquiries.length})
          </button>
          <button
            onClick={() => setFilterType('quote')}
            className={`px-3 py-1.5 uppercase ${filterType === 'quote' ? 'bg-[#F27D26] text-white font-bold' : 'bg-[#2A2A2A] text-[#AAA]'}`}
          >
            BÁO GIÁ DỰ ÁN
          </button>
          <button
            onClick={() => setFilterType('candidate')}
            className={`px-3 py-1.5 uppercase ${filterType === 'candidate' ? 'bg-[#F27D26] text-white font-bold' : 'bg-[#2A2A2A] text-[#AAA]'}`}
          >
            ỨNG TUYỂN KỸ SƯ
          </button>
          <button
            onClick={fetchInquiries}
            className="p-1.5 bg-[#2A2A2A] hover:bg-[#333] text-[#DDD]"
            title="Làm mới"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid Layout: List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Inbox Table / List */}
        <div className="lg:col-span-6 bg-[#181818] border border-[#333] divide-y divide-[#262626] max-h-[75vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#777]">
              Chưa có yêu cầu nào được gửi đến.
            </div>
          ) : (
            filtered.map((item) => {
              const isSelected = selectedInquiry?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedInquiry(item)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#252525] border-l-2 border-[#F27D26]' : 'hover:bg-[#1E1E1E]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                      item.type === 'candidate' 
                        ? 'bg-blue-950/60 text-blue-400 border border-blue-800' 
                        : item.type === 'quote'
                        ? 'bg-orange-950/60 text-orange-400 border border-orange-800'
                        : 'bg-gray-800 text-gray-300'
                    }`}>
                      {item.type === 'candidate' ? 'ỨNG TUYỂN KỸ SƯ' : item.type === 'quote' ? 'YÊU CẦU BÁO GIÁ' : 'LIÊN HỆ'}
                    </span>
                    <span className="text-[10px] text-[#666]">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')} {new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="font-bold text-[#FFF] text-sm">
                    {item.fullName} {item.company ? `(${item.company})` : ''}
                  </div>

                  <div className="text-[11px] text-[#AAA] mt-1 line-clamp-1">
                    {item.type === 'candidate' 
                      ? `${item.discipline} • ${item.experienceYears}`
                      : `${item.serviceInterest || 'Báo giá'} • ${item.projectScale || item.message || ''}`}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Inspection Card */}
        <div className="lg:col-span-6 bg-[#181818] border border-[#333] p-6">
          {selectedInquiry ? (
            <div className="space-y-6">
              
              <div className="flex justify-between items-start border-b border-[#333] pb-4">
                <div>
                  <span className="text-[#F27D26] uppercase font-bold text-[10px]">
                    CHI TIẾT TIẾP NHẬN // {selectedInquiry.id}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white uppercase mt-1">
                    {selectedInquiry.fullName}
                  </h3>
                  {selectedInquiry.company && (
                    <span className="text-xs text-[#AAA] block">{selectedInquiry.company}</span>
                  )}
                </div>

                {deletingInquiryId === selectedInquiry.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDelete(selectedInquiry.id)}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded cursor-pointer"
                    >
                      Xóa thật?
                    </button>
                    <button
                      onClick={() => setDeletingInquiryId(null)}
                      className="px-2 py-1 bg-[#333] hover:bg-[#444] text-[#AAA] text-[11px] rounded cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletingInquiryId(selectedInquiry.id)}
                    className="p-1.5 border border-red-900/50 hover:bg-red-950 text-red-400 inline-flex items-center gap-1 cursor-pointer"
                    title="Xóa yêu cầu này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>XÓA</span>
                  </button>
                )}
              </div>

              {/* Contact strip */}
              <div className="grid grid-cols-2 gap-3 bg-[#202020] p-3 border border-[#333] text-xs">
                <div>
                  <span className="text-[#777] block text-[10px] uppercase">SỐ ĐIỆN THOẠI / ZALO:</span>
                  <a href={`tel:${selectedInquiry.phone}`} className="font-bold text-[#F27D26] hover:underline">
                    {selectedInquiry.phone || 'N/A'}
                  </a>
                </div>
                <div>
                  <span className="text-[#777] block text-[10px] uppercase">EMAIL:</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="font-bold text-[#DDD] hover:underline">
                    {selectedInquiry.email || 'N/A'}
                  </a>
                </div>
              </div>

              {/* Candidate specific fields */}
              {selectedInquiry.type === 'candidate' && (
                <div className="space-y-3 bg-[#222] p-4 border border-[#333]">
                  <div>
                    <span className="text-[#888] text-[10px] uppercase block">CHUYÊN MÔN KỸ SƯ:</span>
                    <span className="text-white font-bold">{selectedInquiry.discipline}</span>
                  </div>
                  <div>
                    <span className="text-[#888] text-[10px] uppercase block">SỐ NĂM KINH NGHIỆM:</span>
                    <span className="text-white">{selectedInquiry.experienceYears}</span>
                  </div>
                  <div>
                    <span className="text-[#888] text-[10px] uppercase block">PHẦN MỀM THÀNH THẠO:</span>
                    <span className="text-white">{selectedInquiry.softwareSkills}</span>
                  </div>
                  {selectedInquiry.portfolioUrl && (
                    <div>
                      <span className="text-[#888] text-[10px] uppercase block">PORTFOLIO / DRIVE LINK:</span>
                      <a 
                        href={selectedInquiry.portfolioUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[#F27D26] hover:underline break-all"
                      >
                        {selectedInquiry.portfolioUrl}
                      </a>
                    </div>
                  )}
                  {selectedInquiry.experienceSummary && (
                    <div>
                      <span className="text-[#888] text-[10px] uppercase block">TÓM TẮT DỰ ÁN ĐÃ THAM GIA:</span>
                      <p className="text-xs text-[#DDD] font-sans mt-1 whitespace-pre-wrap">
                        {selectedInquiry.experienceSummary}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quote specific fields */}
              {selectedInquiry.type === 'quote' && (
                <div className="space-y-3 bg-[#222] p-4 border border-[#333]">
                  <div>
                    <span className="text-[#888] text-[10px] uppercase block">DỊCH VỤ QUAN TÂM:</span>
                    <span className="text-white font-bold">{selectedInquiry.serviceInterest}</span>
                  </div>
                  {selectedInquiry.projectScale && (
                    <div>
                      <span className="text-[#888] text-[10px] uppercase block">QUY MÔ DỰ ÁN:</span>
                      <span className="text-white">{selectedInquiry.projectScale}</span>
                    </div>
                  )}
                  {selectedInquiry.message && (
                    <div>
                      <span className="text-[#888] text-[10px] uppercase block">NỘI DUNG YÊU CẦU:</span>
                      <p className="text-xs text-[#DDD] font-sans mt-1 whitespace-pre-wrap">
                        {selectedInquiry.message}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* General contact message */}
              {selectedInquiry.type === 'contact' && selectedInquiry.message && (
                <div className="space-y-2 bg-[#222] p-4 border border-[#333]">
                  <span className="text-[#888] text-[10px] uppercase block">NỘI DUNG TIN NHẮN:</span>
                  <p className="text-xs text-[#DDD] font-sans whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              )}

            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-[#666]">
              Chọn một mục ở danh sách bên trái để xem đầy đủ nội dung.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
