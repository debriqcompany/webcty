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
  Sparkles
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
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<'hero' | 'gallery' | null>(null);

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
    setEditingProject(JSON.parse(JSON.stringify(proj)));
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
      if (!res.ok) throw new Error('Cập nhật nổi bật thất bại');
      await refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.name.vi || !editingProject.slug || !editingProject.directClient) {
      setError('Vui lòng điền đủ Tên dự án (VI), Slug URL và Khách hàng trực tiếp.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const url = isCreating ? '/api/admin/projects' : `/api/admin/projects/${editingProject.id}`;
      const method = isCreating ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(editingProject)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Lỗi khi lưu dữ liệu dự án');
      }

      await refreshData();
      setEditingProject(null);
      setIsCreating(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMediaSelect = (media: { url: string; altText?: string }) => {
    if (!editingProject) return;
    if (activeMediaTarget === 'hero') {
      setEditingProject({ ...editingProject, heroImage: media.url });
    } else if (activeMediaTarget === 'gallery') {
      const gallery = [...(editingProject.gallery || [])];
      gallery.push({
        id: `gallery-${Date.now()}`,
        url: media.url,
        type: 'Shopdrawing',
        caption: media.altText ? { vi: media.altText, en: media.altText } : undefined
      });
      setEditingProject({ ...editingProject, gallery });
    }
    setMediaPickerOpen(false);
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name?.vi?.toLowerCase().includes(q) ||
      p.name?.en?.toLowerCase().includes(q) ||
      p.directClient?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q);
    const matchesCategory =
      filterCategory === 'all' || p.services.some((s) => s.toLowerCase().includes(filterCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        token={token}
        defaultCategory="projects"
        title="Chọn hình ảnh cho Dự án"
      />

      {/* Project Preview Modal */}
      {editingProject && (
        <ProjectPreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          project={editingProject}
        />
      )}

      {/* Edit Form Screen */}
      {editingProject ? (
        <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
          {/* Top Sticky Header */}
          <div className="sticky top-20 z-30 bg-[#18181b]/95 backdrop-blur-md p-4 rounded-xl border border-[#27272a] flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <button
              type="button"
              onClick={() => {
                setEditingProject(null);
                setIsCreating(false);
              }}
              className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#27272a] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách dự án</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="px-3.5 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#f27d26]" />
                <span>Xem trước dự án</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-1.5 bg-[#f27d26] hover:bg-[#d96716] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Đang lưu...' : 'Lưu dự án'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-800 text-red-200 text-xs rounded-xl flex items-center justify-between">
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Main Project Info & Block-based Case Study Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Primary Info Card */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#f27d26]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Thông tin nhận diện dự án
                    </span>
                  </div>

                  {/* Language switcher */}
                  <div className="flex items-center gap-1 bg-[#121215] p-1 rounded-lg border border-[#27272a]">
                    <button
                      type="button"
                      onClick={() => setActiveLangTab('vi')}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        activeLangTab === 'vi' ? 'bg-[#f27d26] text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Tiếng Việt
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLangTab('en')}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        activeLangTab === 'en' ? 'bg-[#f27d26] text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Tên dự án ({activeLangTab.toUpperCase()}) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activeLangTab === 'vi' ? editingProject.name.vi : editingProject.name.en}
                    onChange={(e) => {
                      const newName = {
                        ...editingProject.name,
                        [activeLangTab]: e.target.value
                      };
                      const updates: any = { name: newName };
                      if (activeLangTab === 'vi' && isCreating) {
                        updates.slug = slugify(e.target.value);
                      }
                      setEditingProject({ ...editingProject, ...updates });
                    }}
                    placeholder={activeLangTab === 'vi' ? 'VD: THE ONE WORLD (BÌNH DƯƠNG)' : 'Project title in English...'}
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3.5 py-2 text-sm font-semibold text-white focus:outline-none focus:border-[#f27d26]"
                  />
                </div>

                {/* Slug */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-neutral-300">
                      Đường dẫn tĩnh (Slug URL) <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (editingProject.name.vi) {
                          setEditingProject({ ...editingProject, slug: slugify(editingProject.name.vi) });
                        }
                      }}
                      className="text-[11px] text-[#f27d26] hover:underline"
                    >
                      Tự động tạo từ tên
                    </button>
                  </div>
                  <div className="flex items-center bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-2 text-xs font-mono text-neutral-400">
                    <span className="text-neutral-500 mr-1">/projects/</span>
                    <input
                      type="text"
                      required
                      value={editingProject.slug}
                      onChange={(e) => setEditingProject({ ...editingProject, slug: slugify(e.target.value) })}
                      className="flex-1 bg-transparent text-white focus:outline-none"
                      placeholder="the-one-world"
                    />
                  </div>
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Phụ đề định vị ({activeLangTab.toUpperCase()})
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
                    placeholder="VD: Quần thể đô thị phức hợp biểu tượng gần 50ha"
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  />
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
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
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg p-3 text-xs text-neutral-200 focus:outline-none focus:border-[#f27d26] leading-relaxed"
                  />
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
              <h2 className="text-base font-semibold text-white">Quản lý Hồ sơ Dự án (Case Studies)</h2>
              <p className="text-xs text-neutral-400">Danh mục dự án thực tế và hồ sơ kỹ thuật hiển thị trên website</p>
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
                    <th className="py-3 px-4">Khối nội dung</th>
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

                      <td className="py-3.5 px-4 text-neutral-400">
                        {p.contentBlocks?.length || 0} khối
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePublish(p)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer transition-colors ${
                              p.published
                                ? 'text-emerald-400 bg-emerald-950/40'
                                : 'text-neutral-500 bg-[#27272a]'
                            }`}
                          >
                            {p.published ? 'Công khai' : 'Nháp'}
                          </button>

                          <button
                            onClick={() => handleToggleFeatured(p)}
                            className={`p-1 rounded cursor-pointer transition-colors ${
                              p.featured ? 'text-[#f27d26]' : 'text-neutral-600 hover:text-neutral-400'
                            }`}
                            title="Đánh dấu dự án nổi bật"
                          >
                            <Star className="w-3.5 h-3.5" fill={p.featured ? '#f27d26' : 'none'} />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingProject(p);
                              setPreviewOpen(true);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-[#27272a] transition-colors cursor-pointer"
                            title="Xem trước"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-[#27272a] transition-colors cursor-pointer"
                            title="Chỉnh sửa dự án"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {deletingProjectId === p.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(p.id, p.name.vi)}
                                className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded cursor-pointer"
                              >
                                Xóa?
                              </button>
                              <button
                                onClick={() => setDeletingProjectId(null)}
                                className="px-1.5 py-0.5 bg-[#333] hover:bg-[#444] text-[#AAA] text-[10px] rounded cursor-pointer"
                              >
                                Hủy
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingProjectId(p.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/30 transition-colors cursor-pointer"
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
    </div>
  );
};
