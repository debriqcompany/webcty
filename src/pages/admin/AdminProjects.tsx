import React, { useState } from 'react';
import { Project, ProjectImage, ContentBlock } from '../../types';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Check, 
  X, 
  Upload, 
  Image as ImageIcon,
  ExternalLink,
  Layers,
  ArrowLeft,
  Save,
  Search,
  Building2,
  FolderGit2,
  Sparkles,
  FileText,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { RichContentEditor } from '../../components/admin/RichContentEditor';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';
import { ProjectPreviewModal } from '../../components/admin/ProjectPreviewModal';

interface AdminProjectsProps {
  projects?: Project[];
  refreshData: () => Promise<void>;
  token: string | null;
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({ projects = [], refreshData, token }) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Media Picker States
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<'hero' | 'drawing' | 'galleryNew' | { galleryIndex: number } | null>(null);

  // New Gallery Item Draft State
  const [newGalleryItem, setNewGalleryItem] = useState<{
    url: string;
    captionVi: string;
    captionEn: string;
    type: string;
    alt: string;
  }>({
    url: '',
    captionVi: '',
    captionEn: '',
    type: 'drawing',
    alt: ''
  });

  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const emptyProject: Project = {
    id: '',
    slug: '',
    name: { vi: '', en: '' },
    subtitle: { vi: '', en: '' },
    directClient: '',
    projectOwner: '',
    mainContractor: '',
    period: '2026',
    scale: { vi: '', en: '' },
    scaleMetric: '',
    scope: { vi: '', en: '' },
    scopeDetails: { 
      structural: { vi: '', en: '' }, 
      finishing: { vi: '', en: '' }, 
      infrastructure: { vi: '', en: '' } 
    },
    services: ['Shopdrawing kết cấu'],
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1200&q=80',
    drawingType: 'vector',
    drawingImageUrl: '',
    drawingCaption: { vi: '', en: '' },
    gallery: [],
    highlights: [{ vi: 'Đã hoàn thành bàn giao nghiệm thu', en: 'Completed site handover' }],
    contentBlocks: [
      {
        id: `blk-${Date.now()}-1`,
        type: 'heading',
        level: 2,
        content: { vi: 'Bối cảnh dự án & Phương án thi công', en: 'Project Background & Construction Method' }
      },
      {
        id: `blk-${Date.now()}-2`,
        type: 'paragraph',
        content: {
          vi: 'Mô tả chi tiết giải pháp Shopdrawing và biện pháp tổ chức không gian cốt thép...',
          en: 'Detailed shopdrawing specifications and rebar clash prevention methodologies...'
        }
      }
    ],
    technicalOverview: { vi: '', en: '' },
    published: true,
    featured: false,
    order: (projects?.length || 0) + 1
  };

  const handleCreateNew = () => {
    setEditingProject({ ...emptyProject, id: `proj-${Date.now()}` });
    setIsCreating(true);
    setError(null);
  };

  const handleEdit = (proj: Project) => {
    const copy = JSON.parse(JSON.stringify(proj));
    if (!copy.gallery) copy.gallery = [];
    if (!copy.drawingType) copy.drawingType = 'vector';
    if (!copy.drawingCaption) copy.drawingCaption = { vi: '', en: '' };
    setEditingProject(copy);
    setIsCreating(false);
    setError(null);
  };

  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  const handleDelete = async (id: string, nameVi: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Xóa dự án thất bại');
      await refreshData();
      setDeletingProjectId(null);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa dự án');
    }
  };

  const handleTogglePublish = async (proj: Project) => {
    try {
      const updated = { ...proj, published: !proj.published };
      const res = await fetch(`/api/admin/projects/${proj.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error('Cập nhật trạng thái thất bại');
      await refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleFeatured = async (proj: Project) => {
    try {
      const updated = { ...proj, featured: !proj.featured };
      const res = await fetch(`/api/admin/projects/${proj.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(updated)
      });
      if (!res.ok) throw new Error('Cập nhật trạng thái thất bại');
      await refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.name.vi || !editingProject.slug || !editingProject.directClient) {
      setError('Vui lòng điền đầy đủ Tên dự án (VI), Slug định danh và Khách hàng trực tiếp.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const url = isCreating ? '/api/admin/projects' : `/api/admin/projects/${editingProject.id}`;

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingProject)
      });

      if (!res.ok) throw new Error('Lưu dự án thất bại');

      await refreshData();
      setEditingProject(null);
      setIsCreating(false);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu dữ liệu dự án');
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = (media: { url: string; altText?: string }) => {
    if (!editingProject) return;

    if (activeMediaTarget === 'hero') {
      setEditingProject({ ...editingProject, heroImage: media.url });
    } else if (activeMediaTarget === 'drawing') {
      setEditingProject({ ...editingProject, drawingImageUrl: media.url, drawingType: 'custom_image' });
    } else if (activeMediaTarget === 'galleryNew') {
      setNewGalleryItem(prev => ({ ...prev, url: media.url, alt: media.altText || '' }));
    } else if (typeof activeMediaTarget === 'object' && activeMediaTarget?.galleryIndex !== undefined) {
      const idx = activeMediaTarget.galleryIndex;
      const updatedGallery = [...(editingProject.gallery || [])];
      if (updatedGallery[idx]) {
        updatedGallery[idx].url = media.url;
        setEditingProject({ ...editingProject, gallery: updatedGallery });
      }
    }

    setMediaPickerOpen(false);
    setActiveMediaTarget(null);
  };

  // Add Item to Project Gallery
  const handleAddGalleryItem = () => {
    if (!editingProject || !newGalleryItem.url) return;

    const newItem: ProjectImage = {
      id: `img-${Date.now()}`,
      url: newGalleryItem.url,
      caption: {
        vi: newGalleryItem.captionVi || 'Hình ảnh hồ sơ dự án',
        en: newGalleryItem.captionEn || newGalleryItem.captionVi || 'Project documentation archive'
      },
      type: newGalleryItem.type,
      alt: newGalleryItem.alt || newGalleryItem.captionVi
    };

    setEditingProject({
      ...editingProject,
      gallery: [...(editingProject.gallery || []), newItem]
    });

    setNewGalleryItem({
      url: '',
      captionVi: '',
      captionEn: '',
      type: 'drawing',
      alt: ''
    });
  };

  // Remove Gallery Item
  const handleRemoveGalleryItem = (index: number) => {
    if (!editingProject) return;
    const updated = [...(editingProject.gallery || [])];
    updated.splice(index, 1);
    setEditingProject({ ...editingProject, gallery: updated });
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.name.vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.directClient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Editor Modal / View */}
      {editingProject ? (
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Header Action Bar */}
          <div className="sticky top-20 z-30 bg-[#18181b]/95 backdrop-blur border border-[#27272a] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-2 hover:bg-[#27272a] text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {isCreating ? 'TẠO DỰ ÁN MỚI' : `CHỈNH SỬA: ${editingProject.name.vi || 'DỰ ÁN'}`}
                </h2>
                <span className="text-[11px] text-neutral-400 font-mono">
                  SLUG // {editingProject.slug || 'chua-dat-slug'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Language Switcher */}
              <div className="flex items-center bg-[#121215] border border-[#27272a] rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('vi')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    activeLangTab === 'vi' ? 'bg-[#f27d26] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    activeLangTab === 'en' ? 'bg-[#f27d26] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-[#f27d26] hover:bg-[#d96716] text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Đang lưu...' : 'Lưu dự án'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Form Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 Cols: Main Details, Gallery & Content Blocks */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Basic Meta Card */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#27272a] pb-2">
                  Thông tin nhận diện dự án ({activeLangTab.toUpperCase()})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Tên dự án ({activeLangTab.toUpperCase()}) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={activeLangTab === 'vi' ? editingProject.name.vi : editingProject.name.en}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingProject({
                          ...editingProject,
                          name: {
                            ...editingProject.name,
                            [activeLangTab]: val
                          },
                          slug: isCreating && activeLangTab === 'vi' ? slugify(val) : editingProject.slug
                        });
                      }}
                      placeholder="VD: Sân bay Long Thành"
                      className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1">
                      Slug đường dẫn <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.slug}
                      onChange={(e) => setEditingProject({ ...editingProject, slug: slugify(e.target.value) })}
                      placeholder="san-bay-long-thanh"
                      className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#f27d26]"
                    />
                  </div>
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Phụ đề / Gói thầu ({activeLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={activeLangTab === 'vi' ? editingProject.subtitle?.vi || '' : editingProject.subtitle?.en || ''}
                    onChange={(e) => {
                      setEditingProject({
                        ...editingProject,
                        subtitle: {
                          vi: activeLangTab === 'vi' ? e.target.value : editingProject.subtitle?.vi || '',
                          en: activeLangTab === 'en' ? e.target.value : editingProject.subtitle?.en || ''
                        }
                      });
                    }}
                    placeholder="VD: Nhà ga hàng hóa số 1 & Công trình phụ trợ"
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  />
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Phạm vi thực hiện của DEBRIQ ({activeLangTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={3}
                    value={activeLangTab === 'vi' ? editingProject.scope.vi : editingProject.scope.en}
                    onChange={(e) => {
                      setEditingProject({
                        ...editingProject,
                        scope: {
                          ...editingProject.scope,
                          [activeLangTab]: e.target.value
                        }
                      });
                    }}
                    placeholder="Mô tả phạm vi thực hiện..."
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg p-3 text-xs text-neutral-200 focus:outline-none focus:border-[#f27d26] leading-relaxed font-sans"
                  />
                </div>
              </div>

              {/* TECHNICAL DRAWING & BLUEPRINT SECTION (USER CUSTOMIZABLE) */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-4">
                <div className="border-b border-[#27272a] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#f27d26]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Bản vẽ kỹ thuật & Sơ đồ Shopdrawing nổi bật
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    HIỂN THỊ CỘT PHẢI CHI TIẾT DỰ ÁN
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-2">
                      Loại hình hiển thị bản vẽ:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className={`p-3 border rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                        editingProject.drawingType !== 'custom_image' 
                          ? 'border-[#f27d26] bg-[#f27d26]/10 text-white' 
                          : 'border-[#333] bg-[#121215] text-[#888]'
                      }`}>
                        <input
                          type="radio"
                          name="drawingType"
                          checked={editingProject.drawingType !== 'custom_image'}
                          onChange={() => setEditingProject({ ...editingProject, drawingType: 'vector' })}
                          className="sr-only"
                        />
                        <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center">
                          {editingProject.drawingType !== 'custom_image' && <div className="w-2 h-2 rounded-full bg-[#f27d26]" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs block">Sơ đồ Vector CAD tương tác mặc định</span>
                          <span className="text-[10px] text-[#777]">Tự động tạo vector nút dầm cột, hoàn thiện hoặc BIM</span>
                        </div>
                      </label>

                      <label className={`p-3 border rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
                        editingProject.drawingType === 'custom_image' 
                          ? 'border-[#f27d26] bg-[#f27d26]/10 text-white' 
                          : 'border-[#333] bg-[#121215] text-[#888]'
                      }`}>
                        <input
                          type="radio"
                          name="drawingType"
                          checked={editingProject.drawingType === 'custom_image'}
                          onChange={() => setEditingProject({ ...editingProject, drawingType: 'custom_image' })}
                          className="sr-only"
                        />
                        <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center">
                          {editingProject.drawingType === 'custom_image' && <div className="w-2 h-2 rounded-full bg-[#f27d26]" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs block">Chèn hình ảnh bản vẽ riêng</span>
                          <span className="text-[10px] text-[#777]">Upload hoặc chọn ảnh bản vẽ Shopdrawing/Blueprint</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {editingProject.drawingType === 'custom_image' && (
                    <div className="p-4 bg-[#121215] border border-[#333] rounded-lg space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingProject.drawingImageUrl || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, drawingImageUrl: e.target.value })}
                          placeholder="https://... hoặc /uploads/ban-ve-mat-bang.jpg"
                          className="flex-1 bg-[#18181b] border border-[#444] rounded px-3 py-2 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMediaTarget('drawing');
                            setMediaPickerOpen(true);
                          }}
                          className="px-3 bg-[#2A2A2E] hover:bg-[#38383E] text-white text-xs font-semibold rounded border border-[#444] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#f27d26]" />
                          <span>Chọn ảnh</span>
                        </button>
                      </div>

                      {editingProject.drawingImageUrl && (
                        <div className="aspect-video max-h-48 bg-[#000] border border-[#333] rounded overflow-hidden flex items-center justify-center">
                          <img src={editingProject.drawingImageUrl} alt="Drawing Preview" className="max-h-full object-contain" />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={editingProject.drawingCaption?.vi || ''}
                          onChange={(e) => setEditingProject({
                            ...editingProject,
                            drawingCaption: {
                              vi: e.target.value,
                              en: editingProject.drawingCaption?.en || e.target.value
                            }
                          })}
                          placeholder="Chú thích bản vẽ (Tiếng Việt)"
                          className="bg-[#18181b] border border-[#444] rounded p-2 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={editingProject.drawingCaption?.en || ''}
                          onChange={(e) => setEditingProject({
                            ...editingProject,
                            drawingCaption: {
                              vi: editingProject.drawingCaption?.vi || '',
                              en: e.target.value
                            }
                          })}
                          placeholder="Drawing Caption (English)"
                          className="bg-[#18181b] border border-[#444] rounded p-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PROJECT GALLERY & DRAWINGS MANAGER (USER REQUESTED FULL CRUD) */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-5">
                <div className="border-b border-[#27272a] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#f27d26]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Hồ sơ hình ảnh & bản vẽ (Gallery Archive) — ({editingProject.gallery?.length || 0} mục)
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    PHỐI CẢNH • HIỆN TRƯỜNG • BẢN VẼ • HÌNH ẢNH
                  </span>
                </div>

                {/* Add New Gallery Item Box */}
                <div className="bg-[#121215] border border-[#333] p-4 rounded-lg space-y-3">
                  <span className="text-xs font-bold text-[#f27d26] uppercase flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> THÊM MỤC HÌNH ẢNH / BẢN VẼ MỚI VÀO HỒ SƠ
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Category Type */}
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] text-[#AAA] mb-1">Phân loại danh mục</label>
                      <select
                        value={newGalleryItem.type}
                        onChange={(e) => setNewGalleryItem({ ...newGalleryItem, type: e.target.value })}
                        className="w-full bg-[#18181b] border border-[#444] rounded p-2 text-xs text-white"
                      >
                        <option value="drawing">📐 Bản vẽ Shopdrawing (Drawing)</option>
                        <option value="rendering">🏢 Phối cảnh 3D (Rendering)</option>
                        <option value="site_photo">🏗️ Ảnh hiện trường (Site Photo)</option>
                        <option value="photo">📷 Hình ảnh thực tế (General Photo)</option>
                      </select>
                    </div>

                    {/* URL & Media Picker */}
                    <div className="sm:col-span-8">
                      <label className="block text-[11px] text-[#AAA] mb-1">Đường dẫn hình ảnh (URL)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newGalleryItem.url}
                          onChange={(e) => setNewGalleryItem({ ...newGalleryItem, url: e.target.value })}
                          placeholder="https://... hoặc /uploads/hinh-anh.jpg"
                          className="flex-1 bg-[#18181b] border border-[#444] rounded px-3 py-2 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMediaTarget('galleryNew');
                            setMediaPickerOpen(true);
                          }}
                          className="px-3 bg-[#2A2A2E] hover:bg-[#38383E] text-white text-xs font-semibold rounded border border-[#444] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#f27d26]" />
                          <span>Chọn ảnh</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newGalleryItem.captionVi}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, captionVi: e.target.value })}
                      placeholder="Chú thích ảnh (Tiếng Việt)"
                      className="bg-[#18181b] border border-[#444] rounded p-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={newGalleryItem.captionEn}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, captionEn: e.target.value })}
                      placeholder="Caption (English)"
                      className="bg-[#18181b] border border-[#444] rounded p-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      disabled={!newGalleryItem.url}
                      onClick={handleAddGalleryItem}
                      className="bg-[#f27d26] hover:bg-[#d96716] disabled:opacity-40 text-white px-4 py-1.5 text-xs font-semibold rounded inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm vào bộ sưu tập</span>
                    </button>
                  </div>
                </div>

                {/* Existing Gallery Items List */}
                <div className="space-y-3">
                  <span className="text-[11px] text-[#AAA] uppercase font-mono block">
                    DANH SÁCH HÌNH ẢNH ĐANG CÓ TRONG HỒ SƠ:
                  </span>

                  {(!editingProject.gallery || editingProject.gallery.length === 0) ? (
                    <div className="p-4 bg-[#121215] border border-dashed border-[#333] rounded text-center text-xs text-[#777]">
                      Chưa có hình ảnh hoặc bản vẽ nào trong hồ sơ. Hãy thêm mục mới ở trên.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {editingProject.gallery.map((img, idx) => (
                        <div key={img.id || idx} className="bg-[#121215] border border-[#333] rounded-lg overflow-hidden flex flex-col justify-between">
                          <div className="relative aspect-video bg-[#000] overflow-hidden">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 bg-[#18181b]/90 border border-[#444] text-[9px] font-mono uppercase px-2 py-0.5 text-[#F27D26] rounded">
                              {img.type === 'drawing' ? 'Bản vẽ' : img.type === 'rendering' ? 'Phối cảnh' : img.type === 'site_photo' ? 'Hiện trường' : 'Hình ảnh'}
                            </span>
                          </div>

                          <div className="p-3 space-y-2">
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={typeof img.caption === 'object' ? img.caption.vi : (img.caption || '')}
                                onChange={(e) => {
                                  const updated = [...(editingProject.gallery || [])];
                                  const currentCaption = typeof updated[idx].caption === 'object' ? updated[idx].caption : { vi: '', en: '' };
                                  updated[idx].caption = {
                                    vi: e.target.value,
                                    en: (currentCaption as any).en || e.target.value
                                  };
                                  setEditingProject({ ...editingProject, gallery: updated });
                                }}
                                placeholder="Chú thích VI"
                                className="w-full bg-[#18181b] border border-[#444] p-1.5 text-xs text-white rounded"
                              />
                              <input
                                type="text"
                                value={typeof img.caption === 'object' ? img.caption.en : ''}
                                onChange={(e) => {
                                  const updated = [...(editingProject.gallery || [])];
                                  const currentCaption = typeof updated[idx].caption === 'object' ? updated[idx].caption : { vi: '', en: '' };
                                  updated[idx].caption = {
                                    vi: (currentCaption as any).vi || '',
                                    en: e.target.value
                                  };
                                  setEditingProject({ ...editingProject, gallery: updated });
                                }}
                                placeholder="Caption EN"
                                className="w-full bg-[#18181b] border border-[#444] p-1.5 text-xs text-white rounded"
                              />
                            </div>

                            <div className="flex items-center justify-between border-t border-[#2A2A2A] pt-2">
                              <select
                                value={img.type}
                                onChange={(e) => {
                                  const updated = [...(editingProject.gallery || [])];
                                  updated[idx].type = e.target.value;
                                  setEditingProject({ ...editingProject, gallery: updated });
                                }}
                                className="bg-[#18181b] border border-[#444] text-[11px] text-[#AAA] p-1 rounded"
                              >
                                <option value="drawing">Bản vẽ (Drawing)</option>
                                <option value="rendering">Phối cảnh (Rendering)</option>
                                <option value="site_photo">Hiện trường (Site Photo)</option>
                                <option value="photo">Hình ảnh (Photo)</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryItem(idx)}
                                className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded cursor-pointer transition-colors"
                                title="Xóa ảnh"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Block-based Case Study Editor */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-4">
                <div className="border-b border-[#27272a] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#f27d26]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Khối nội dung chi tiết Case Study (WordPress-like)
                    </span>
                  </div>
                </div>

                <RichContentEditor
                  blocks={editingProject.contentBlocks || []}
                  onChange={(newBlocks) => setEditingProject({ ...editingProject, contentBlocks: newBlocks })}
                  token={token}
                  activeLanguage={activeLangTab}
                />
              </div>

            </div>

            {/* Right 4 Cols: Stakeholders, Metadata & Media */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Publishing & Ordering */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#27272a] pb-2">
                  Cài đặt hiển thị
                </span>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300">Công khai dự án:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.published}
                      onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f27d26]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300">Dự án tiêu biểu (Featured):</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f27d26]"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Năm thực hiện
                  </label>
                  <input
                    type="text"
                    value={editingProject.period}
                    onChange={(e) => setEditingProject({ ...editingProject, period: e.target.value })}
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Thứ tự sắp xếp (Order)
                  </label>
                  <input
                    type="number"
                    value={editingProject.order || 1}
                    onChange={(e) => setEditingProject({ ...editingProject, order: Number(e.target.value) })}
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  />
                </div>
              </div>

              {/* Stakeholders Attribution */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#27272a] pb-2">
                  Minh bạch chủ thể tham gia
                </span>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Khách hàng trực tiếp DEBRIQ <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.directClient}
                    onChange={(e) => setEditingProject({ ...editingProject, directClient: e.target.value })}
                    placeholder="VD: Tổng thầu Coteccons"
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Chủ đầu tư dự án
                  </label>
                  <input
                    type="text"
                    value={editingProject.projectOwner || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, projectOwner: e.target.value })}
                    placeholder="VD: Kim Oanh Group"
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Tổng thầu thi công
                  </label>
                  <input
                    type="text"
                    value={editingProject.mainContractor || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, mainContractor: e.target.value })}
                    placeholder="VD: Coteccons / Central"
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Quy mô dự án
                  </label>
                  <input
                    type="text"
                    value={editingProject.scaleMetric || editingProject.scale?.vi || ''}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        scaleMetric: e.target.value,
                        scale: { vi: e.target.value, en: e.target.value }
                      })
                    }
                    placeholder="VD: GFA 185.000 m² • 35 Tầng"
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  />
                </div>
              </div>

              {/* Hero Image Card */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Ảnh đại diện dự án (Hero Image)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMediaTarget('hero');
                      setMediaPickerOpen(true);
                    }}
                    className="text-[11px] text-[#f27d26] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" /> Chọn ảnh
                  </button>
                </div>

                <div className="aspect-video bg-[#121215] border border-[#3f3f46] rounded-lg overflow-hidden">
                  {editingProject.heroImage ? (
                    <img
                      src={editingProject.heroImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
                      Chưa có ảnh
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={editingProject.heroImage}
                  onChange={(e) => setEditingProject({ ...editingProject, heroImage: e.target.value })}
                  placeholder="URL ảnh đại diện..."
                  className="w-full bg-[#121215] border border-[#3f3f46] rounded px-3 py-1 text-xs text-neutral-300 font-mono"
                />
              </div>

            </div>
          </div>
        </form>
      ) : (
        /* Projects List Table */
        <div className="space-y-4">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#18181b] p-4 rounded-xl border border-[#27272a]">
            <div>
              <h2 className="text-base font-semibold text-white">Quản lý Hồ sơ Dự án ({projects.length})</h2>
              <p className="text-xs text-neutral-400">Danh mục dự án thực tế, hồ sơ hình ảnh và bản vẽ Shopdrawing hiển thị trên website</p>
            </div>

            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-[#f27d26] hover:bg-[#d96716] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm dự án mới</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm dự án, khách hàng..."
                className="w-full bg-[#18181b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#f27d26]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121215] text-neutral-400 border-b border-[#27272a] font-medium uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Dự án</th>
                    <th className="py-3 px-4">Khách hàng trực tiếp</th>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Hồ sơ hình ảnh & bản vẽ</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a] text-neutral-300">
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-[#202024] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-9 rounded bg-[#27272a] overflow-hidden shrink-0">
                            {p.heroImage && (
                              <img src={p.heroImage} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-white block text-sm">
                              {p.name.vi}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-mono">
                              /projects/{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-white">
                        {p.directClient}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-400 font-mono">
                        {p.period}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#27272a] text-neutral-300 rounded text-[11px]">
                          <ImageIcon className="w-3 h-3 text-[#f27d26]" />
                          <span>{p.gallery?.length || 0} ảnh & bản vẽ</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(p)}
                            className={`p-1 rounded cursor-pointer ${
                              p.published ? 'text-emerald-400 hover:bg-emerald-950/50' : 'text-neutral-500 hover:bg-neutral-800'
                            }`}
                            title={p.published ? 'Đang công khai (Bấm để ẩn)' : 'Đang ẩn (Bấm để hiện)'}
                          >
                            {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(p)}
                            className={`p-1 rounded cursor-pointer ${
                              p.featured ? 'text-[#f27d26] hover:bg-[#f27d26]/20' : 'text-neutral-500 hover:bg-neutral-800'
                            }`}
                            title={p.featured ? 'Dự án tiêu biểu (Bấm để tắt)' : 'Đặt làm dự án tiêu biểu'}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-1.5 hover:bg-[#27272a] text-neutral-300 hover:text-white rounded transition-colors cursor-pointer"
                            title="Chỉnh sửa dự án"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {deletingProjectId === p.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(p.id, p.name.vi)}
                                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Xóa?
                              </button>
                              <button
                                onClick={() => setDeletingProjectId(null)}
                                className="px-1.5 py-1 bg-[#27272a] text-neutral-300 rounded text-[10px] cursor-pointer"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingProjectId(p.id)}
                              className="p-1.5 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                              title="Xóa dự án"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setActiveMediaTarget(null);
        }}
        onSelect={handleMediaSelect}
        token={token}
        title="Chọn hình ảnh dự án từ Media"
        defaultCategory="projects"
      />

    </div>
  );
};
