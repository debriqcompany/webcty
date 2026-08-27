import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Check,
  Globe,
  Clock,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Save,
  Upload,
  AlertCircle,
  FileText,
  Tag
} from 'lucide-react';
import { Article, ContentBlock } from '../../types';
import { RichContentEditor } from '../../components/admin/RichContentEditor';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';
import { ArticlePreviewModal } from '../../components/admin/ArticlePreviewModal';

interface AdminArticlesProps {
  articles: Article[];
  token: string | null;
  onRefresh: () => void;
}

export const AdminArticles: React.FC<AdminArticlesProps> = ({ articles = [], token, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');

  const categories = [
    { id: 'all', label: 'Tất cả danh mục' },
    { id: 'shopdrawing-standard', label: 'Tiêu chuẩn Shopdrawing' },
    { id: 'rebar-optimization', label: 'Tối ưu hóa cốt thép' },
    { id: 'bim-revit-coordination', label: 'BIM / Revit phối hợp' },
    { id: 'site-qa-qc', label: 'QA/QC & Nghiệm thu' },
    { id: 'case-study', label: 'Phân tích ca điển hình' }
  ];

  // Helper to slugify string
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

  const handleStartCreate = () => {
    setCurrentArticle({
      title: { vi: '', en: '' },
      slug: '',
      category: 'shopdrawing-standard',
      excerpt: { vi: '', en: '' },
      heroImage: '/assets/blueprint-placeholder.svg',
      author: 'Ban Kỹ Thuật DEBRIQ',
      readingTimeMinutes: 5,
      featured: false,
      published: true,
      tags: ['Shopdrawing', 'Revit'],
      contentBlocks: [
        {
          id: `blk-${Date.now()}-1`,
          type: 'heading',
          level: 2,
          content: { vi: 'Tổng quan và bối cảnh kỹ thuật', en: 'Technical Background & Overview' }
        },
        {
          id: `blk-${Date.now()}-2`,
          type: 'paragraph',
          content: {
            vi: 'Nội dung phân tích chuyên sâu về quy trình và giải pháp triển khai bản vẽ...',
            en: 'Detailed technical analysis on shopdrawing methodologies and workflows...'
          }
        }
      ],
      seo: {
        metaTitle: '',
        metaDescription: ''
      }
    });
    setIsEditing(true);
  };

  const handleStartEdit = (art: Article) => {
    setCurrentArticle(JSON.parse(JSON.stringify(art)));
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentArticle.title?.vi || !currentArticle.slug) {
      alert('Vui lòng nhập tiêu đề tiếng Việt và đường dẫn slug');
      return;
    }

    setSaving(true);
    try {
      const isNew = !currentArticle.id;
      const url = isNew ? '/api/admin/articles' : `/api/admin/articles/${currentArticle.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(currentArticle)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Lỗi lưu bài viết');
      }

      await onRefresh();
      setIsEditing(false);
    } catch (err: any) {
      alert(`Lỗi: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const [deletingArticleId, setDeletingArticleId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        onRefresh();
      }
      setDeletingArticleId(null);
    } catch (err) {
      console.error('Lỗi xóa bài viết', err);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      art.title?.vi?.toLowerCase().includes(q) ||
      art.title?.en?.toLowerCase().includes(q) ||
      art.slug?.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Media Picker */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(media) => {
          setCurrentArticle({ ...currentArticle, heroImage: media.url });
        }}
        token={token}
        defaultCategory="articles"
        title="Chọn ảnh đại diện bài viết"
      />

      {/* Article Preview Modal */}
      <ArticlePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        article={currentArticle as Article}
      />

      {isEditing ? (
        /* Edit / Create Screen */
        <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
          {/* Top Sticky Action Bar */}
          <div className="sticky top-20 z-30 bg-[#18181b]/95 backdrop-blur-md p-4 rounded-xl border border-[#27272a] flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#27272a] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="px-3.5 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#f27d26]" />
                <span>Xem trước bài viết</span>
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-1.5 bg-[#f27d26] hover:bg-[#d96716] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Đang lưu...' : 'Lưu bài viết'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Main Editorial Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Primary Info Card */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#f27d26]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Thông tin bài viết
                    </span>
                  </div>

                  {/* Language switch */}
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

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Tiêu đề bài viết ({activeLangTab.toUpperCase()}) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={activeLangTab === 'vi' ? currentArticle.title?.vi || '' : currentArticle.title?.en || ''}
                    onChange={(e) => {
                      const newTitle = {
                        vi: activeLangTab === 'vi' ? e.target.value : currentArticle.title?.vi || '',
                        en: activeLangTab === 'en' ? e.target.value : currentArticle.title?.en || ''
                      };
                      const updates: any = { title: newTitle };
                      if (activeLangTab === 'vi' && !currentArticle.id) {
                        updates.slug = slugify(e.target.value);
                      }
                      setCurrentArticle({ ...currentArticle, ...updates });
                    }}
                    placeholder={activeLangTab === 'vi' ? 'Nhập tiêu đề bài viết...' : 'Enter article title...'}
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
                        if (currentArticle.title?.vi) {
                          setCurrentArticle({ ...currentArticle, slug: slugify(currentArticle.title.vi) });
                        }
                      }}
                      className="text-[11px] text-[#f27d26] hover:underline"
                    >
                      Tự động tạo từ tiêu đề
                    </button>
                  </div>
                  <div className="flex items-center bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-2 text-xs font-mono text-neutral-400">
                    <span className="text-neutral-500 mr-1">/insights/</span>
                    <input
                      type="text"
                      required
                      value={currentArticle.slug || ''}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, slug: slugify(e.target.value) })}
                      className="flex-1 bg-transparent text-white focus:outline-none"
                      placeholder="tieu-chuan-shopdrawing-cot-thep"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Đoạn tóm tắt / Lời dẫn ({activeLangTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={3}
                    value={activeLangTab === 'vi' ? currentArticle.excerpt?.vi || '' : currentArticle.excerpt?.en || ''}
                    onChange={(e) => {
                      const newExcerpt = {
                        vi: activeLangTab === 'vi' ? e.target.value : currentArticle.excerpt?.vi || '',
                        en: activeLangTab === 'en' ? e.target.value : currentArticle.excerpt?.en || ''
                      };
                      setCurrentArticle({ ...currentArticle, excerpt: newExcerpt });
                    }}
                    placeholder={activeLangTab === 'vi' ? 'Tóm tắt ngắn gọn nội dung bài viết hiển thị ở danh mục và thẻ meta...' : 'Brief summary...'}
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg p-3 text-xs text-neutral-200 focus:outline-none focus:border-[#f27d26] leading-relaxed"
                  />
                </div>
              </div>

              {/* Block-based Content Editor */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 sm:p-6 space-y-4">
                <div className="border-b border-[#27272a] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#f27d26]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Nội dung bài viết (Trình soạn thảo Block)
                    </span>
                  </div>
                </div>

                <RichContentEditor
                  blocks={currentArticle.contentBlocks || []}
                  onChange={(newBlocks) => setCurrentArticle({ ...currentArticle, contentBlocks: newBlocks })}
                  token={token}
                  activeLanguage={activeLangTab}
                />
              </div>

            </div>

            {/* Right 4 Cols: Publishing Settings & Metadata */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Publishing Status Card */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#27272a] pb-2">
                  Trạng thái phát hành
                </span>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300">Công khai bài viết:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentArticle.published !== false}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, published: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f27d26]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300">Ghim bài nổi bật:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!currentArticle.featured}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, featured: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f27d26]"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Danh mục chuyên môn
                  </label>
                  <select
                    value={currentArticle.category || 'shopdrawing-standard'}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  >
                    <option value="shopdrawing-standard">Tiêu chuẩn Shopdrawing</option>
                    <option value="rebar-optimization">Tối ưu hóa cốt thép</option>
                    <option value="bim-revit-coordination">BIM / Revit phối hợp</option>
                    <option value="site-qa-qc">QA/QC & Nghiệm thu</option>
                    <option value="case-study">Phân tích ca điển hình</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Tác giả / Ban chuyên môn
                  </label>
                  <input
                    type="text"
                    value={currentArticle.author || ''}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, author: e.target.value })}
                    placeholder="Ban Kỹ Thuật DEBRIQ"
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Thời lượng đọc (phút)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={currentArticle.readingTimeMinutes || 5}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, readingTimeMinutes: Number(e.target.value) })}
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  />
                </div>
              </div>

              {/* Hero Image Card */}
              <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Ảnh đại diện bài viết
                  </span>
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="text-[11px] text-[#f27d26] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" /> Chọn ảnh
                  </button>
                </div>

                <div className="aspect-[16/10] bg-[#121215] border border-[#3f3f46] rounded-lg overflow-hidden">
                  {currentArticle.heroImage ? (
                    <img
                      src={currentArticle.heroImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
                      Chưa chọn ảnh
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  value={currentArticle.heroImage || ''}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, heroImage: e.target.value })}
                  placeholder="URL ảnh đại diện..."
                  className="w-full bg-[#121215] border border-[#3f3f46] rounded px-3 py-1 text-xs text-neutral-300 font-mono"
                />
              </div>

            </div>
          </div>
        </form>
      ) : (
        /* Articles List Table */
        <div className="space-y-4">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#18181b] p-4 rounded-xl border border-[#27272a]">
            <div>
              <h2 className="text-base font-semibold text-white">Quản lý Bài viết & Góc nhìn Kỹ thuật</h2>
              <p className="text-xs text-neutral-400">Tạo, cập nhật và phát hành bài viết phân tích chuyên sâu chuẩn SEO</p>
            </div>

            <button
              onClick={handleStartCreate}
              className="px-4 py-2 bg-[#f27d26] hover:bg-[#d96716] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm bài viết mới</span>
            </button>
          </div>

          {/* Filter & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tiêu đề, đường dẫn slug..."
                className="w-full bg-[#18181b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#f27d26]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#f27d26] w-full sm:w-auto"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Articles Table */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-sm">
            {filteredArticles.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <FileText className="w-8 h-8 mx-auto text-neutral-500" />
                <p className="text-sm font-medium text-neutral-300">Chưa có bài viết nào</p>
                <button
                  onClick={handleStartCreate}
                  className="px-4 py-2 bg-[#f27d26] text-white rounded-lg text-xs font-semibold hover:bg-[#d96716] cursor-pointer"
                >
                  Tạo bài viết đầu tiên
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121215] text-neutral-400 border-b border-[#27272a] font-medium uppercase text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Bài viết</th>
                      <th className="py-3 px-4">Danh mục</th>
                      <th className="py-3 px-4">Trạng thái</th>
                      <th className="py-3 px-4">Khối nội dung</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272a] text-neutral-300">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-[#202024] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-9 rounded bg-[#27272a] overflow-hidden shrink-0">
                              {art.heroImage && (
                                <img src={art.heroImage} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-white block text-sm">
                                {art.title?.vi || 'Không có tiêu đề'}
                              </span>
                              <span className="text-[11px] text-neutral-500 font-mono">
                                /insights/{art.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="bg-[#27272a] text-neutral-300 px-2 py-0.5 rounded text-[11px]">
                            {art.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            {art.published ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded text-[11px] font-medium">
                                <Check className="w-3 h-3" /> Công khai
                              </span>
                            ) : (
                              <span className="text-neutral-500 bg-[#27272a] px-2 py-0.5 rounded text-[11px]">
                                Bản nháp
                              </span>
                            )}
                            {art.featured && (
                              <span className="text-[#f27d26] bg-[#f27d26]/10 px-2 py-0.5 rounded text-[11px] font-bold">
                                Nổi bật
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-neutral-400">
                          {art.contentBlocks?.length || 0} khối block
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setCurrentArticle(art);
                                setPreviewOpen(true);
                              }}
                              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-[#27272a] transition-colors cursor-pointer"
                              title="Xem trước"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStartEdit(art)}
                              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-[#27272a] transition-colors cursor-pointer"
                              title="Chỉnh sửa bài viết"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {deletingArticleId === art.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(art.id)}
                                  className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded cursor-pointer"
                                >
                                  Xóa?
                                </button>
                                <button
                                  onClick={() => setDeletingArticleId(null)}
                                  className="px-1.5 py-0.5 bg-[#333] hover:bg-[#444] text-[#AAA] text-[10px] rounded cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingArticleId(art.id)}
                                className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/30 transition-colors cursor-pointer"
                                title="Xóa bài viết"
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};
