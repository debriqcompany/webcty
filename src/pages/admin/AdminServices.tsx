import React, { useState } from 'react';
import { ServiceItem, BilingualText } from '../../types';
import { Plus, Edit3, Trash2, Check, X, Layers, Globe } from 'lucide-react';

interface AdminServicesProps {
  services: ServiceItem[];
  refreshData: () => Promise<void>;
  token: string | null;
}

export const AdminServices: React.FC<AdminServicesProps> = ({ services, refreshData, token }) => {
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formLang, setFormLang] = useState<'vi' | 'en'>('vi');

  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const emptyService: ServiceItem = {
    id: '',
    slug: '',
    title: { vi: '', en: '' },
    subtitle: { vi: '', en: '' },
    description: { vi: '', en: '' },
    deliverables: [],
    methodologies: [],
    toolsUsed: ['AutoCAD', 'Revit'],
    visualType: 'structural',
    featured: true,
    published: true,
    sortOrder: (services?.length || 0) + 1
  };

  const handleCreateNew = () => {
    setEditingService({ ...emptyService, id: `svc-${Date.now()}` });
    setIsCreating(true);
    setError(null);
    setFormLang('vi');
  };

  const handleEdit = (svc: ServiceItem) => {
    // Normalize data structure
    const copy: ServiceItem = JSON.parse(JSON.stringify(svc));
    if (!copy.title) copy.title = { vi: '', en: '' };
    if (typeof copy.title === 'string') copy.title = { vi: copy.title, en: copy.title };
    if (!copy.title.en) copy.title.en = copy.title.vi || '';

    if (!copy.subtitle) copy.subtitle = { vi: '', en: '' };
    if (typeof copy.subtitle === 'string') copy.subtitle = { vi: copy.subtitle, en: copy.subtitle };
    if (!copy.subtitle.en) copy.subtitle.en = copy.subtitle.vi || '';

    if (!copy.description) copy.description = { vi: copy.subtitle?.vi || '', en: copy.subtitle?.en || '' };
    if (typeof copy.description === 'string') copy.description = { vi: copy.description, en: copy.description };

    setEditingService(copy);
    setIsCreating(false);
    setError(null);
    setFormLang('vi');
  };

  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(null);

  const handleDelete = async (id: string, nameVi: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Xóa dịch vụ thất bại');
      await refreshData();
      setDeletingServiceId(null);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa dịch vụ');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    if (!editingService.title?.vi || !editingService.slug) {
      setError('Vui lòng nhập tên dịch vụ (Tiếng Việt) và slug.');
      return;
    }

    // Ensure English fields have at least fallback to VI
    if (!editingService.title.en) {
      editingService.title.en = editingService.title.vi;
    }
    if (!editingService.subtitle?.en && editingService.subtitle?.vi) {
      editingService.subtitle.en = editingService.subtitle.vi;
    }
    if (!editingService.description?.en && editingService.description?.vi) {
      editingService.description.en = editingService.description.vi;
    }

    setSaving(true);
    setError(null);

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const url = isCreating ? '/api/admin/services' : `/api/admin/services/${editingService.id}`;

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingService)
      });

      if (!res.ok) throw new Error('Lỗi khi lưu dịch vụ');

      await refreshData();
      setEditingService(null);
      setIsCreating(false);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setSaving(false);
    }
  };

  // Helper to extract deliverables as text lines for specific language
  const getDeliverablesText = (lang: 'vi' | 'en'): string => {
    if (!editingService?.deliverables) return '';
    const delivs = editingService.deliverables;
    if (Array.isArray(delivs)) {
      return delivs.map(d => {
        if (typeof d === 'string') return d;
        return d[lang] || d.vi || '';
      }).join('\n');
    }
    if (delivs && typeof delivs === 'object') {
      return (delivs as any)[lang]?.join('\n') || '';
    }
    return '';
  };

  const setDeliverablesFromText = (text: string, lang: 'vi' | 'en') => {
    if (!editingService) return;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const existing = Array.isArray(editingService.deliverables) ? editingService.deliverables : [];
    
    // Merge or create bilingual deliverables list
    const maxLen = Math.max(lines.length, existing.length);
    const newDeliverables: BilingualText[] = [];
    
    for (let i = 0; i < maxLen; i++) {
      const exItem = existing[i];
      const exVi = typeof exItem === 'string' ? exItem : (exItem?.vi || '');
      const exEn = typeof exItem === 'string' ? exItem : (exItem?.en || exVi);
      
      if (lang === 'vi') {
        if (i < lines.length) {
          newDeliverables.push({
            vi: lines[i],
            en: exEn || lines[i]
          });
        }
      } else {
        if (i < lines.length || i < existing.length) {
          newDeliverables.push({
            vi: exVi || (lines[i] || ''),
            en: lines[i] || exEn || exVi
          });
        }
      }
    }

    setEditingService({
      ...editingService,
      deliverables: newDeliverables
    });
  };

  return (
    <div className="space-y-6 font-mono-tech text-xs">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1E1E1E] p-4 border border-[#333]">
        <div>
          <h2 className="text-base font-bold text-[#F3F2EE] uppercase">QUẢN LÝ DỊCH VỤ SONG NGỮ ({services?.length || 0})</h2>
          <p className="text-[11px] text-[#777]">Cấu hình các nhóm dịch vụ kỹ thuật và danh mục hồ sơ bàn giao (Hỗ trợ VI / EN)</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="bg-[#F27D26] hover:bg-[#D86616] text-white px-4 py-2 uppercase font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM DỊCH VỤ MỚI</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(services || []).map((svc) => (
          <div key={svc.id} className="bg-[#181818] border border-[#333] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[#F27D26] font-bold">SLUG // {svc.slug}</span>
                <span className="text-[10px] bg-[#2A2A2A] text-[#AAA] px-2 py-0.5 border border-[#444]">
                  ORDER {svc.sortOrder || svc.order || 1}
                </span>
              </div>

              {/* Bilingual Title */}
              <div>
                <h3 className="font-display text-lg font-bold text-[#FFF] uppercase">
                  🇻🇳 {svc.title?.vi || (typeof svc.title === 'string' ? svc.title : 'Chưa đặt tên')}
                </h3>
                <h4 className="text-xs text-[#888] font-sans italic mt-0.5">
                  🇬🇧 {svc.title?.en || svc.title?.vi || 'No English Title'}
                </h4>
              </div>

              <p className="text-[#AAA] font-sans text-xs line-clamp-2 leading-relaxed">
                {svc.subtitle?.vi || svc.shortDesc?.vi || svc.description?.vi || ''}
              </p>

              <div className="border-t border-[#2A2A2A] pt-3 font-mono-tech text-[11px] text-[#777] space-y-1">
                <div>TOOLS: {(svc.toolsUsed || svc.tools || []).join(', ')}</div>
                <div>DELIVERABLES: {Array.isArray(svc.deliverables) ? svc.deliverables.length : 0} mục</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#2A2A2A] pt-3">
              <button
                onClick={() => handleEdit(svc)}
                className="px-3 py-1.5 border border-[#444] hover:bg-[#333] text-[#DDD] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>CHỈNH SỬA (VI / EN)</span>
              </button>
              {deletingServiceId === svc.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(svc.id, svc.title.vi)}
                    className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded cursor-pointer"
                  >
                    Xác nhận xóa?
                  </button>
                  <button
                    onClick={() => setDeletingServiceId(null)}
                    className="px-2 py-1.5 bg-[#333] hover:bg-[#444] text-[#AAA] text-xs rounded cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeletingServiceId(svc.id)}
                  className="px-3 py-1.5 border border-red-900/50 hover:bg-red-950 text-red-400 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>XÓA</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Editing / Creating Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#181818] border border-[#444] text-[#DDD] p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-[#333] pb-4 mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-[#FFF] uppercase">
                  {isCreating ? 'TẠO DỊCH VỤ MỚI' : 'CHỈNH SỬA DỊCH VỤ KỸ THUẬT'}
                </h3>
                <span className="text-[11px] text-[#777]">Nhập đầy đủ thông tin tiếng Việt và tiếng Anh</span>
              </div>
              <button onClick={() => setEditingService(null)} className="p-1 border border-[#444] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="mb-4 p-2 bg-red-950 text-red-300 text-xs">{error}</div>}

            {/* Language Selector Switch */}
            <div className="flex items-center gap-2 mb-6 border-b border-[#333] pb-3">
              <span className="text-[11px] text-[#888] uppercase mr-2 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#F27D26]" /> Ngôn ngữ chỉnh sửa:
              </span>
              <button
                type="button"
                onClick={() => setFormLang('vi')}
                className={`px-4 py-1.5 font-bold uppercase transition-colors cursor-pointer ${
                  formLang === 'vi' 
                    ? 'bg-[#F27D26] text-white' 
                    : 'bg-[#262626] text-[#AAA] hover:bg-[#333]'
                }`}
              >
                🇻🇳 Tiếng Việt (VI)
              </button>
              <button
                type="button"
                onClick={() => setFormLang('en')}
                className={`px-4 py-1.5 font-bold uppercase transition-colors cursor-pointer ${
                  formLang === 'en' 
                    ? 'bg-[#F27D26] text-white' 
                    : 'bg-[#262626] text-[#AAA] hover:bg-[#333]'
                }`}
              >
                🇬🇧 English (EN)
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Basic Meta Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AAA] mb-1">
                    TÊN DỊCH VỤ ({formLang.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formLang === 'vi' ? (editingService.title?.vi || '') : (editingService.title?.en || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingService({
                        ...editingService,
                        title: {
                          vi: formLang === 'vi' ? val : (editingService.title?.vi || ''),
                          en: formLang === 'en' ? val : (editingService.title?.en || '')
                        }
                      });
                    }}
                    placeholder={formLang === 'vi' ? "Shopdrawing kết cấu" : "Structural Shopdrawing"}
                    className="w-full bg-[#111] border border-[#444] p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#AAA] mb-1">SLUG ĐỊNH DANH *</label>
                  <input
                    type="text"
                    required
                    value={editingService.slug}
                    onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                    placeholder="shopdrawing-ket-cau"
                    className="w-full bg-[#111] border border-[#444] p-2 text-white"
                  />
                </div>
              </div>

              {/* Subtitle / Tagline */}
              <div>
                <label className="block text-[#AAA] mb-1">
                  MÔ TẢ NGẮN / PHỤ ĐỀ ({formLang.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={formLang === 'vi' 
                    ? (editingService.subtitle?.vi || editingService.description?.vi || '')
                    : (editingService.subtitle?.en || editingService.description?.en || '')
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingService({
                      ...editingService,
                      subtitle: {
                        vi: formLang === 'vi' ? val : (editingService.subtitle?.vi || ''),
                        en: formLang === 'en' ? val : (editingService.subtitle?.en || '')
                      },
                      description: {
                        vi: formLang === 'vi' ? val : (editingService.description?.vi || ''),
                        en: formLang === 'en' ? val : (editingService.description?.en || '')
                      }
                    });
                  }}
                  placeholder={formLang === 'vi' ? "Triển khai chi tiết cốt thép dầm sàn móng..." : "Detailed rebar shopdrawing for foundations and superstructure..."}
                  className="w-full bg-[#111] border border-[#444] p-2 text-white font-sans text-xs"
                />
              </div>

              {/* Deliverables per Language */}
              <div>
                <label className="block text-[#AAA] mb-1">
                  DANH MỤC HỒ SƠ BÀN GIAO ({formLang.toUpperCase()}) — (MỖI DÒNG 1 MỤC)
                </label>
                <textarea
                  rows={4}
                  value={getDeliverablesText(formLang)}
                  onChange={(e) => setDeliverablesFromText(e.target.value, formLang)}
                  placeholder={formLang === 'vi' 
                    ? "Mặt bằng bố trí thép sàn\nChi tiết uốn cắt cốt thép (BBS)\nBản vẽ biện pháp thi công móng"
                    : "Floor slab rebar layouts\nBar Bending Schedules (BBS)\nFoundation method drawings"}
                  className="w-full bg-[#111] border border-[#444] p-2 text-white font-sans text-xs"
                />
              </div>

              {/* Tools & Ordering */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AAA] mb-1">CÔNG CỤ ÁP DỤNG (PHÂN CÁCH BẰNG DẤU PHẨY)</label>
                  <input
                    type="text"
                    value={(editingService.toolsUsed || editingService.tools || []).join(', ')}
                    onChange={(e) => {
                      const tools = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      setEditingService({
                        ...editingService,
                        toolsUsed: tools,
                        tools: tools
                      });
                    }}
                    className="w-full bg-[#111] border border-[#444] p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#AAA] mb-1">THỨ TỰ HIỂN THỊ (SORT ORDER)</label>
                  <input
                    type="number"
                    value={editingService.sortOrder || 1}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      sortOrder: parseInt(e.target.value, 10) || 1
                    })}
                    className="w-full bg-[#111] border border-[#444] p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#333] pt-4">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 border border-[#444] text-[#DDD] cursor-pointer"
                >
                  HỦY BỎ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#F27D26] hover:bg-[#D86616] text-white px-6 py-2 uppercase font-bold cursor-pointer"
                >
                  {saving ? 'ĐANG LƯU...' : 'LƯU DỊCH VỤ'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
