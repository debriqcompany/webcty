import React, { useState } from 'react';
import { PageContent } from '../../types';
import { Save, Check } from 'lucide-react';

interface AdminPagesProps {
  pages: Record<string, PageContent>;
  refreshData: () => Promise<void>;
  token: string | null;
}

export const AdminPages: React.FC<AdminPagesProps> = ({ pages, refreshData, token }) => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [pageData, setPageData] = useState<Record<string, PageContent>>(pages);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentPage = pageData[selectedPage] || {
    id: selectedPage,
    slug: selectedPage,
    title: { vi: '', en: '' },
    metaDescription: { vi: '', en: '' },
    sections: {}
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch(`/api/admin/pages/${selectedPage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(currentPage)
      });

      if (!res.ok) throw new Error('Lỗi khi lưu trang');

      await refreshData();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu nội dung trang');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-mono-tech text-xs">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1E1E1E] p-4 border border-[#333]">
        <div>
          <h2 className="text-base font-bold text-[#F3F2EE] uppercase">QUẢN LÝ NỘI DUNG CÁC TRANG</h2>
          <p className="text-[11px] text-[#777]">Chỉnh sửa tiêu đề, mô tả và nội dung các section</p>
        </div>

        <div className="flex items-center gap-2">
          {['home', 'about', 'join-debriq'].map(p => (
            <button
              key={p}
              onClick={() => setSelectedPage(p)}
              className={`px-3 py-1.5 uppercase font-bold ${
                selectedPage === p ? 'bg-[#F27D26] text-white' : 'bg-[#2A2A2A] text-[#AAA]'
              }`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-[#181818] border border-[#333] p-6 sm:p-8 space-y-6">
        
        {success && (
          <div className="p-3 bg-green-950 border border-green-800 text-green-300 font-bold">
            ĐÃ CẬP NHẬT NỘI DUNG TRANG {selectedPage.toUpperCase()} THÀNH CÔNG!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#AAA] font-bold mb-1">TIÊU ĐỀ TRANG (TIẾNG VIỆT) *</label>
            <input
              type="text"
              value={currentPage.title?.vi || ''}
              onChange={(e) => setPageData({
                ...pageData,
                [selectedPage]: {
                  ...currentPage,
                  title: { ...currentPage.title, vi: e.target.value }
                }
              })}
              className="w-full bg-[#111] border border-[#444] p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-[#AAA] font-bold mb-1">TIÊU ĐỀ TRANG (ENGLISH)</label>
            <input
              type="text"
              value={currentPage.title?.en || ''}
              onChange={(e) => setPageData({
                ...pageData,
                [selectedPage]: {
                  ...currentPage,
                  title: { ...currentPage.title, en: e.target.value }
                }
              })}
              className="w-full bg-[#111] border border-[#444] p-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#AAA] font-bold mb-1">MÔ TẢ META SEO (TIẾNG VIỆT)</label>
          <textarea
            rows={3}
            value={currentPage.metaDescription?.vi || ''}
            onChange={(e) => setPageData({
              ...pageData,
              [selectedPage]: {
                ...currentPage,
                metaDescription: { ...currentPage.metaDescription, vi: e.target.value }
              }
            })}
            className="w-full bg-[#111] border border-[#444] p-2 text-white font-sans text-sm"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-[#333]">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#F27D26] hover:bg-[#D86616] text-white px-8 py-3 uppercase tracking-wider font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
