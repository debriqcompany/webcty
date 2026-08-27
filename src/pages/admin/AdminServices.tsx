import React, { useState } from 'react';
import { ServiceItem, BilingualText } from '../../types';
import { Plus, Edit3, Trash2, Check, X, Layers } from 'lucide-react';

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
    sortOrder: (services?.length || 0) + 1
  };

  const handleCreateNew = () => {
    setEditingService({ ...emptyService, id: `svc-${Date.now()}` });
    setIsCreating(true);
    setError(null);
  };

  const handleEdit = (svc: ServiceItem) => {
    setEditingService(JSON.parse(JSON.stringify(svc)));
    setIsCreating(false);
    setError(null);
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

    if (!editingService.title.vi || !editingService.slug) {
      setError('Vui lòng nhập tên dịch vụ và slug.');
      return;
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

  // Helper to extract deliverables as text lines
  const getDeliverablesText = (delivs: BilingualText[] | { vi: string[]; en: string[] } | undefined): string => {
    if (!delivs) return '';
    if (Array.isArray(delivs)) {
      return delivs.map(d => typeof d === 'string' ? d : d.vi).join('\n');
    }
    return delivs.vi?.join('\n') || '';
  };

  const setDeliverablesFromText = (text: string) => {
    if (!editingService) return;
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const newDeliverables: BilingualText[] = lines.map(line => ({ vi: line, en: line }));
    setEditingService({
      ...editingService,
      deliverables: newDeliverables
    });
  };

  return (
    <div className="space-y-6 font-mono-tech text-xs">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1E1E1E] p-4 border border-[#333]">
        <div>
          <h2 className="text-base font-bold text-[#F3F2EE] uppercase">QUẢN LÝ DỊCH VỤ ({services?.length || 0})</h2>
          <p className="text-[11px] text-[#777]">Cấu hình các nhóm dịch vụ kỹ thuật và danh mục hồ sơ bàn giao</p>
        </div>

        <button
          onClick={handleCreateNew}
          className="bg-[#F27D26] hover:bg-[#D86616] text-white px-4 py-2 uppercase font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>THÊM DỊCH VỤ MỚI</span>
        </button>
      </div>

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

              <h3 className="font-display text-xl font-bold text-[#FFF] uppercase">
                {svc.title.vi}
              </h3>

              <p className="text-[#AAA] font-sans text-xs line-clamp-2 leading-relaxed">
                {svc.subtitle?.vi || svc.shortDesc?.vi || svc.description?.vi}
              </p>

              <div className="border-t border-[#2A2A2A] pt-3 font-mono-tech text-[11px] text-[#777]">
                <div>TOOLS: {(svc.toolsUsed || svc.tools || []).join(', ')}</div>
                <div>DELIVERABLES: {Array.isArray(svc.deliverables) ? svc.deliverables.length : 0} items</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#2A2A2A] pt-3">
              <button
                onClick={() => handleEdit(svc)}
                className="px-3 py-1.5 border border-[#444] hover:bg-[#333] text-[#DDD] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>CHỈNH SỬA</span>
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

      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#181818] border border-[#444] text-[#DDD] p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-[#333] pb-4 mb-6">
              <h3 className="font-display text-lg font-bold text-[#FFF] uppercase">
                {isCreating ? 'TẠO DỊCH VỤ MỚI' : 'CHỈNH SỬA DỊCH VỤ'}
              </h3>
              <button onClick={() => setEditingService(null)} className="p-1 border border-[#444]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && <div className="mb-4 p-2 bg-red-950 text-red-300 text-xs">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AAA] mb-1">TÊN DỊCH VỤ (VI) *</label>
                  <input
                    type="text"
                    required
                    value={editingService.title.vi}
                    onChange={(e) => setEditingService({
                      ...editingService,
                      title: { ...editingService.title, vi: e.target.value }
                    })}
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
                    className="w-full bg-[#111] border border-[#444] p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#AAA] mb-1">MÔ TẢ NGẮN (VI)</label>
                <textarea
                  rows={2}
                  value={editingService.subtitle?.vi || editingService.description?.vi || ''}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    subtitle: { vi: e.target.value, en: e.target.value },
                    description: { vi: e.target.value, en: e.target.value }
                  })}
                  className="w-full bg-[#111] border border-[#444] p-2 text-white font-sans text-xs"
                />
              </div>

              <div>
                <label className="block text-[#AAA] mb-1">DANH MỤC HỒ SƠ BÀN GIAO (MỖI DÒNG 1 MỤC)</label>
                <textarea
                  rows={4}
                  value={getDeliverablesText(editingService.deliverables)}
                  onChange={(e) => setDeliverablesFromText(e.target.value)}
                  placeholder="Mặt bằng bố trí thép..."
                  className="w-full bg-[#111] border border-[#444] p-2 text-white font-sans text-xs"
                />
              </div>

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

              <div className="flex justify-end gap-3 border-t border-[#333] pt-4">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 border border-[#444] text-[#DDD]"
                >
                  HỦY BỎ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#F27D26] hover:bg-[#D86616] text-white px-6 py-2 uppercase font-bold"
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
