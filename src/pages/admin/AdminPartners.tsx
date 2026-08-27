import React, { useState, useRef } from 'react';
import { Partner } from '../../types';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  ShieldCheck, 
  Image as ImageIcon, 
  Upload, 
  FolderOpen, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';

interface AdminPartnersProps {
  partners?: Partner[];
  refreshData: () => Promise<void>;
  token: string | null;
}

export const AdminPartners: React.FC<AdminPartnersProps> = ({ partners = [], refreshData, token }) => {
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const safePartners = Array.isArray(partners) ? partners : [];

  const emptyPartner: Partner = {
    id: '',
    name: '',
    logoUrl: '',
    logoText: '',
    roleLabel: { vi: 'Khách hàng trực tiếp', en: 'Direct Client' },
    description: { vi: '', en: '' },
    projectRefs: [],
    published: true
  };

  const handleCreateNew = () => {
    setEditingPartner({ ...emptyPartner, id: `partner-${Date.now()}` });
    setIsCreating(true);
    setError(null);
  };

  const handleEdit = (p: Partner) => {
    setEditingPartner(JSON.parse(JSON.stringify(p)));
    setIsCreating(false);
    setError(null);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Xóa đối tác thất bại');
      await refreshData();
      setDeletingId(null);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa đối tác');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPartner) return;

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('files', file);

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      if (!res.ok) throw new Error('Không thể tải ảnh logo lên máy chủ');
      const data = await res.json();
      const uploadedFile = data.files?.[0];

      if (uploadedFile?.url) {
        setEditingPartner(prev => prev ? { ...prev, logoUrl: uploadedFile.url } : null);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tải ảnh logo.');
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner || !editingPartner.name) return;

    setSaving(true);
    setError(null);

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const url = isCreating ? '/api/admin/partners' : `/api/admin/partners/${editingPartner.id}`;

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingPartner)
      });

      if (!res.ok) throw new Error('Lỗi khi lưu đối tác');

      await refreshData();
      setEditingPartner(null);
      setIsCreating(false);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-mono-tech text-xs">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1E1E1E] p-4 border border-[#333]">
        <div>
          <h2 className="text-base font-bold text-[#F3F2EE] uppercase">QUẢN LÝ ĐỐI TÁC & KHÁCH HÀNG ({safePartners.length})</h2>
          <p className="text-[11px] text-[#777]">Quản lý danh sách tổng thầu, chủ đầu tư, ảnh logo thương hiệu vuông (1:1) và thông tin liên kết</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="bg-[#F27D26] hover:bg-[#D86616] text-white px-4 py-2 uppercase font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM ĐỐI TÁC MỚI</span>
        </button>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {safePartners.map((partner) => {
          const roleText = typeof partner.roleLabel === 'string' 
            ? partner.roleLabel 
            : partner.roleLabel?.vi || partner.roleLabel?.en || '';
          
          const descText = typeof partner.description === 'string'
            ? partner.description
            : partner.description?.vi || partner.description?.en || '';

          const projectRefs = Array.isArray(partner.projectRefs) ? partner.projectRefs : [];
          const logoImage = partner.logoUrl || (partner as any).logo;

          return (
            <div key={partner.id} className="bg-[#181818] border border-[#333] p-5 space-y-4 flex flex-col justify-between hover:border-[#555] transition-colors">
              <div className="space-y-3">
                
                {/* Header with Square Logo & Name */}
                <div className="flex items-start gap-3">
                  {/* Square Logo Box */}
                  <div className="w-14 h-14 bg-[#111] border border-[#333] rounded-lg flex items-center justify-center shrink-0 overflow-hidden p-1 relative group">
                    {logoImage ? (
                      <img 
                        src={logoImage} 
                        alt={partner.name} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#252528] text-[#F27D26] font-bold text-xs">
                        {partner.logoText || partner.name?.substring(0, 2)?.toUpperCase() || 'P'}
                      </div>
                    )}
                  </div>

                  {/* Partner Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-display font-bold text-base text-[#FFF] tracking-tight truncate block">
                        {partner.name}
                      </span>
                      {partner.logoText && (
                        <span className="text-[9px] bg-[#2A2A2A] text-[#F27D26] px-1.5 py-0.5 border border-[#444] font-mono shrink-0">
                          {partner.logoText}
                        </span>
                      )}
                    </div>
                    <span className="text-[#F27D26] text-[10px] uppercase font-medium block mt-0.5 truncate">
                      {roleText}
                    </span>
                  </div>
                </div>

                <p className="text-[#AAA] font-sans text-xs leading-relaxed line-clamp-3">
                  {descText || 'Chưa có mô tả chi tiết.'}
                </p>

                {projectRefs.length > 0 && (
                  <div className="border-t border-[#2A2A2A] pt-2 text-[10px] text-[#888]">
                    <span className="text-[#666]">DỰ ÁN:</span> {projectRefs.join(', ')}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-3">
                <div className="flex items-center gap-1.5 text-[10px] text-[#666]">
                  {logoImage ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> Logo ảnh vuông
                    </span>
                  ) : (
                    <span className="text-amber-400">Dùng logo chữ</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(partner)}
                    className="p-1.5 border border-[#444] hover:bg-[#333] text-[#DDD] cursor-pointer"
                    title="Chỉnh sửa"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {deletingId === partner.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(partner.id, partner.name)}
                        className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded cursor-pointer"
                      >
                        Xóa thật?
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-1.5 py-1 bg-[#333] text-[#AAA] text-[10px] rounded cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(partner.id)}
                      className="p-1.5 border border-red-900/50 hover:bg-red-950 text-red-400 cursor-pointer"
                      title="Xóa đối tác"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editing / Creation Modal */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#181818] border border-[#444] text-[#DDD] p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#333] pb-4 mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-[#FFF] uppercase">
                  {isCreating ? 'THÊM ĐỐI TÁC MỚI' : 'CHỈNH SỬA ĐỐI TÁC'}
                </h3>
                <p className="text-[11px] text-[#888] font-sans">
                  Nhập hình ảnh logo vuông (1:1), tên công ty và các dự án đồng hành
                </p>
              </div>
              <button 
                onClick={() => setEditingPartner(null)} 
                className="p-1.5 border border-[#444] hover:bg-[#333] text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="mb-4 p-2.5 bg-red-950 border border-red-800 text-red-300 text-xs">{error}</div>}

            <form onSubmit={handleSave} className="space-y-5">
              
              {/* =========================================================================
                  SQUARE LOGO IMAGE INPUT SECTION
                  ========================================================================= */}
              <div className="p-4 bg-[#141416] border border-[#333] rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[#F27D26] font-bold text-xs uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    HÌNH ẢNH LOGO ĐỐI TÁC (TỈ LỆ 1:1 VUÔNG) *
                  </label>
                  <span className="text-[10px] text-[#777]">Khuyên dùng ảnh PNG/SVG trong suốt</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  
                  {/* 1:1 Square Preview Box */}
                  <div className="w-24 h-24 bg-[#202024] border-2 border-dashed border-[#444] hover:border-[#F27D26] rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative group p-2 shadow-inner">
                    {editingPartner.logoUrl ? (
                      <>
                        <img
                          src={editingPartner.logoUrl}
                          alt="Logo Preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setEditingPartner({ ...editingPartner, logoUrl: '' })}
                          className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mb-1" />
                          <span>GỠ LOGO</span>
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-1 space-y-1">
                        <ImageIcon className="w-6 h-6 mx-auto text-[#666]" />
                        <span className="text-[9px] text-[#777] block leading-tight">Chưa có logo vuông</span>
                      </div>
                    )}
                  </div>

                  {/* Actions & URL Input */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                        className="hidden"
                        onChange={handleFileUpload}
                      />

                      {/* Upload from Computer */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingLogo}
                        className="bg-[#2A2A2A] hover:bg-[#383838] border border-[#555] text-[#EEE] px-3 py-1.5 text-xs font-semibold rounded inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#F27D26]" />
                        <span>{uploadingLogo ? 'Đang tải lên...' : 'Tải ảnh từ máy tính'}</span>
                      </button>

                      {/* Pick from Media Library */}
                      <button
                        type="button"
                        onClick={() => setMediaPickerOpen(true)}
                        className="bg-[#2A2A2A] hover:bg-[#383838] border border-[#555] text-[#EEE] px-3 py-1.5 text-xs font-semibold rounded inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-[#F27D26]" />
                        <span>Chọn từ Thư viện Media</span>
                      </button>
                    </div>

                    {/* Direct URL input */}
                    <div>
                      <input
                        type="text"
                        value={editingPartner.logoUrl || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, logoUrl: e.target.value })}
                        placeholder="Hoặc dán trực tiếp đường dẫn URL hình ảnh logo (/uploads/... hoặc https://...)"
                        className="w-full bg-[#0A0A0C] border border-[#444] focus:border-[#F27D26] p-2 text-white font-mono text-xs rounded"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* General Partner Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AAA] mb-1 font-semibold">TÊN ĐỐI TÁC / KHÁCH HÀNG *</label>
                  <input
                    type="text"
                    required
                    value={editingPartner.name || ''}
                    onChange={(e) => setEditingPartner({
                      ...editingPartner,
                      name: e.target.value,
                      logoText: editingPartner.logoText || e.target.value.substring(0, 10).toUpperCase()
                    })}
                    placeholder="VD: COTECCONS, TẬP ĐOÀN ĐẠT PHƯƠNG..."
                    className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded"
                  />
                </div>

                <div>
                  <label className="block text-[#AAA] mb-1 font-semibold">LOGO TEXT (TÊN VIẾT TẮT NẾU THIẾU ẢNH)</label>
                  <input
                    type="text"
                    value={editingPartner.logoText || ''}
                    onChange={(e) => setEditingPartner({ ...editingPartner, logoText: e.target.value })}
                    placeholder="COTECCONS / HANCORP..."
                    className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AAA] mb-1 font-semibold">VAI TRÒ / NHÃN PHÂN LOẠI (TIẾNG VIỆT)</label>
                  <input
                    type="text"
                    value={typeof editingPartner.roleLabel === 'string' ? editingPartner.roleLabel : editingPartner.roleLabel?.vi || ''}
                    onChange={(e) => setEditingPartner({
                      ...editingPartner,
                      roleLabel: typeof editingPartner.roleLabel === 'string' 
                        ? { vi: e.target.value, en: editingPartner.roleLabel }
                        : { ...editingPartner.roleLabel, vi: e.target.value }
                    })}
                    placeholder="Khách hàng trực tiếp / Tổng thầu liên kết..."
                    className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded"
                  />
                </div>

                <div>
                  <label className="block text-[#AAA] mb-1 font-semibold">ROLE LABEL (ENGLISH)</label>
                  <input
                    type="text"
                    value={typeof editingPartner.roleLabel === 'string' ? '' : editingPartner.roleLabel?.en || ''}
                    onChange={(e) => setEditingPartner({
                      ...editingPartner,
                      roleLabel: typeof editingPartner.roleLabel === 'string'
                        ? { vi: editingPartner.roleLabel, en: e.target.value }
                        : { ...editingPartner.roleLabel, en: e.target.value }
                    })}
                    placeholder="Direct Client / General Contractor..."
                    className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#AAA] mb-1 font-semibold">MÔ TẢ HỢP TÁC (TIẾNG VIỆT)</label>
                <textarea
                  rows={3}
                  value={typeof editingPartner.description === 'string' ? editingPartner.description : editingPartner.description?.vi || ''}
                  onChange={(e) => setEditingPartner({
                    ...editingPartner,
                    description: typeof editingPartner.description === 'string'
                      ? { vi: e.target.value, en: editingPartner.description }
                      : { ...editingPartner.description, vi: e.target.value }
                  })}
                  placeholder="Mô tả tóm tắt mối quan hệ hợp tác hoặc phạm vi thực hiện..."
                  className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white font-sans text-xs rounded"
                />
              </div>

              <div>
                <label className="block text-[#AAA] mb-1 font-semibold">DỰ ÁN TIÊU BIỂU (PHÂN CÁCH BẰNG DẤU PHẨY)</label>
                <input
                  type="text"
                  value={Array.isArray(editingPartner.projectRefs) ? editingPartner.projectRefs.join(', ') : ''}
                  onChange={(e) => setEditingPartner({
                    ...editingPartner,
                    projectRefs: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="Sân bay Long Thành, The Global City, The One World..."
                  className="w-full bg-[#111] border border-[#444] focus:border-[#F27D26] p-2.5 text-white rounded"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-[#333] pt-4">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="px-5 py-2.5 border border-[#444] text-[#DDD] hover:bg-[#252525] rounded font-semibold cursor-pointer"
                >
                  HỦY BỎ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#F27D26] hover:bg-[#D86616] text-white px-8 py-2.5 uppercase font-bold rounded cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {saving ? 'ĐANG LƯU...' : 'LƯU ĐỐI TÁC'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Media Picker Modal for selecting partner logo */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        token={token}
        onSelect={(item) => {
          if (editingPartner) {
            setEditingPartner({ ...editingPartner, logoUrl: item.url });
          }
          setMediaPickerOpen(false);
        }}
      />

    </div>
  );
};
