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
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { Article, ContentBlock } from '../../types';
import { WysiwygEditor } from '../../components/admin/WysiwygEditor';
import { MediaPickerModal } from '../../components/admin/MediaPickerModal';

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
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'vi' | 'en'>('vi');

  const categories = [
    { id: 'all', label: 'Tất cả danh mục' },
    { id: 'Kỹ thuật Shopdrawing', label: 'Kỹ thuật Shopdrawing' },
    { id: 'Tiêu chuẩn TCVN', label: 'Tiêu chuẩn TCVN & Quốc tế' },
    { id: 'BIM / Revit', label: 'BIM / Revit phối hợp' },
    { id: 'Biện pháp thi công', label: 'Biện pháp thi công' },
    { id: 'QA/QC Hiện trường', label: 'QA/QC & Nghiệm thu' }
  ];

  // Helper to convert legacy contentBlocks or contentHtml to string
  const getArticleHtml = (art: Partial<Article>, lang: 'vi' | 'en'): string => {
    if (art.contentHtml) {
      if (typeof art.contentHtml === 'object') {
        return (art.contentHtml as any)[lang] || (art.contentHtml as any).vi || '';
      }
      return (art.contentHtml as string) || '';
    }
    if (art.contentBlocks && art.contentBlocks.length > 0) {
      return art.contentBlocks.map(b => {
        const text = typeof b.content === 'object' ? (b.content as any)[lang] : (b.content || '');
        if (b.type === 'heading') return `<h${b.level || 2}>${text}</h${b.level || 2}>`;
        if (b.type === 'callout') return `<div class="my-6 p-4 bg-[#1E1E22] border-l-4 border-[#F27D26] text-[#DDD] rounded-r"><strong class="text-[#F27D26] font-mono-tech text-xs uppercase block">${typeof b.title === 'object' ? (b.title as any)[lang] : (b.title || 'LƯU Ý KỸ THUẬT')}</strong><p>${text}</p></div>`;
        if (b.type === 'image') return `<figure class="my-6"><img src="${b.src}" alt="${b.alt || ''}" class="rounded shadow-lg max-w-full" />${b.caption ? `<figcaption class="text-center text-xs text-[#888] mt-2">${typeof b.caption === 'object' ? (b.caption as any)[lang] : b.caption}</figcaption>` : ''}</figure>`;
        if (b.type === 'quote') return `<blockquote><p>${text}</p></blockquote>`;
        return `<p>${text}</p>`;
      }).join('\n');
    }
    return '';
  };

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
      category: 'Kỹ thuật Shopdrawing',
      excerpt: { vi: '', en: '' },
      coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      author: 'Ban Kỹ Thuật DEBRIQ',
      readingTimeMinutes: 5,
      featured: false,
      published: true,
      tags: ['Shopdrawing', 'Kết cấu'],
      contentHtml: {
        vi: '<h2>1. Đặt vấn đề và thực tiễn thi công tại công trường</h2><p>Mô tả chi tiết phân tích hồ sơ kỹ thuật, các điểm xung đột cốt thép hoặc biện pháp tổ chức thi công thực tế...</p>',
        en: '<h2>1. Technical Background & Site Execution Overview</h2><p>Detailed analysis of shopdrawing methodologies, rebar detailing tolerances, and coordination workflows...</p>'
      },
      seo: {
        metaTitle: '',
        metaDescription: ''
      }
    });
    setIsEditing(true);
    setActiveLangTab('vi');
  };

  const handleStartEdit = (art: Article) => {
    const copy = JSON.parse(JSON.stringify(art));
    // Ensure contentHtml is populated
    if (!copy.contentHtml) {
      copy.contentHtml = {
        vi: getArticleHtml(copy, 'vi'),
        en: getArticleHtml(copy, 'en')
      };
    } else if (typeof copy.contentHtml === 'string') {
      copy.contentHtml = {
        vi: copy.contentHtml,
        en: copy.contentHtml
      };
    }
    setCurrentArticle(copy);
    setIsEditing(true);
    setActiveLangTab('vi');
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
        await onRefresh();
        setDeletingArticleId(null);
      }
    } catch (err) {
      console.error('Lỗi khi xóa bài viết:', err);
    }
  };

  const filteredArticles = articles.filter(a => {
    const titleVi = a.title?.vi || '';
    const titleEn = a.title?.en || '';
    const matchSearch = titleVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6 font-mono-tech text-xs">
      
      {/* Editor Modal / View */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Header Bar */}
          <div className="sticky top-20 z-30 bg-[#1C1C20]/95 backdrop-blur border border-[#333] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-[#2A2A30] text-[#AAA] hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {currentArticle.id ? `CHỈNH SỬA: ${currentArticle.title?.vi || 'BÀI VIẾT'}` : 'SOẠN THẢO BÀI VIẾT MỚI'}
                </h2>
                <span className="text-[11px] text-[#777] font-mono">
                  SLUG // {currentArticle.slug || 'chua-dat-slug'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Language Switcher */}
              <div className="flex items-center bg-[#141416] border border-[#333] rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('vi')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    activeLangTab === 'vi' ? 'bg-[#F27D26] text-white' : 'text-[#AAA] hover:text-white'
                  }`}
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    activeLangTab === 'en' ? 'bg-[#F27D26] text-white' : 'text-[#AAA] hover:text-white'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-[#F27D26] hover:bg-[#D86616] text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Đang lưu...' : 'LƯU BÀI VIẾT'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Main Content Area (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Title & Slug */}
              <div className="bg-[#18181B] border border-[#2D2D32] rounded-xl p-5 sm:p-6 space-y-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#2D2D32] pb-2">
                  Tiêu đề & Định danh ({activeLangTab.toUpperCase()})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#AAA] mb-1 font-medium">
                      TIÊU ĐỀ BÀI VIẾT ({activeLangTab.toUpperCase()}) *
                    </label>
                    <input
                      type="text"
                      required
                      value={activeLangTab === 'vi' ? (currentArticle.title?.vi || '') : (currentArticle.title?.en || '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        const currentTitle = currentArticle.title || { vi: '', en: '' };
                        setCurrentArticle({
                          ...currentArticle,
                          title: {
                            vi: activeLangTab === 'vi' ? val : (currentTitle.vi || ''),
                            en: activeLangTab === 'en' ? val : (currentTitle.en || '')
                          },
                          slug: !currentArticle.id && activeLangTab === 'vi' ? slugify(val) : currentArticle.slug
                        });
                      }}
                      placeholder="VD: Kiểm soát xung đột cốt thép nút khung dầm cột"
                      className="w-full bg-[#111] border border-[#444] rounded-lg p-2.5 text-white font-sans text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#AAA] mb-1 font-medium">SLUG ĐƯỜNG DẪN *</label>
                    <input
                      type="text"
                      required
                      value={currentArticle.slug || ''}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, slug: slugify(e.target.value) })}
                      placeholder="kiem-soat-xung-dot-cot-thep"
                      className="w-full bg-[#111] border border-[#444] rounded-lg p-2.5 text-white font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#AAA] mb-1 font-medium">
                    TÓM TẮT BÀI VIẾT / EXCERPT ({activeLangTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={2}
                    value={activeLangTab === 'vi' ? (currentArticle.excerpt?.vi || '') : (currentArticle.excerpt?.en || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      const currentEx = currentArticle.excerpt || { vi: '', en: '' };
                      setCurrentArticle({
                        ...currentArticle,
                        excerpt: {
                          vi: activeLangTab === 'vi' ? val : (currentEx.vi || ''),
                          en: activeLangTab === 'en' ? val : (currentEx.en || '')
                        }
                      });
                    }}
                    placeholder="Mô tả tóm tắt 1-2 câu xuất hiện ở danh sách bài viết và thẻ chia sẻ..."
                    className="w-full bg-[#111] border border-[#444] rounded-lg p-2.5 text-white font-sans text-xs"
                  />
                </div>
              </div>

              {/* WYSIWYG Rich Text Editor (TinyMCE Style) */}
              <div className="bg-[#18181B] border border-[#2D2D32] rounded-xl p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between border-b border-[#2D2D32] pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F27D26]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Trình Soạn Thảo Văn Bản WYSIWYG ({activeLangTab.toUpperCase()})
                    </span>
                  </div>
                  <span className="text-[10px] text-[#777] font-mono">
                    SOẠN THẢO TRỰC QUAN • ĐẦY ĐỦ CÔNG CỤ
                  </span>
                </div>

                <WysiwygEditor
                  key={activeLangTab}
                  value={getArticleHtml(currentArticle, activeLangTab)}
                  onChange={(html) => {
                    const currentHtml = typeof currentArticle.contentHtml === 'object' 
                      ? currentArticle.contentHtml 
                      : { vi: '', en: '' };
                    
                    setCurrentArticle({
                      ...currentArticle,
                      contentHtml: {
                        vi: activeLangTab === 'vi' ? html : ((currentHtml as any).vi || ''),
                        en: activeLangTab === 'en' ? html : ((currentHtml as any).en || '')
                      }
                    });
                  }}
                  token={token}
                  placeholder="Nhập nội dung bài viết phân tích kỹ thuật, chèn hình ảnh, bảng biểu tại đây..."
                />
              </div>

            </div>

            {/* Sidebar Meta (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Publishing & Category */}
              <div className="bg-[#18181B] border border-[#2D2D32] rounded-xl p-5 space-y-4">
                <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-[#2D2D32] pb-2">
                  Cài đặt hiển thị & Phân loại
                </span>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#CCC]">Công khai bài viết:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentArticle.published !== false}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, published: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#27272A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F27D26]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#CCC]">Bài viết nổi bật (Featured):</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(currentArticle.featured)}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, featured: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#27272A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F27D26]"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-[#AAA] mb-1 font-medium">CHUYÊN MỤC BÀI VIẾT</label>
                  <select
                    value={currentArticle.category || 'Kỹ thuật Shopdrawing'}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                    className="w-full bg-[#111] border border-[#444] rounded-lg p-2 text-white"
                  >
                    <option value="Kỹ thuật Shopdrawing">Kỹ thuật Shopdrawing</option>
                    <option value="Tiêu chuẩn TCVN">Tiêu chuẩn TCVN & Quốc tế</option>
                    <option value="BIM / Revit">BIM / Revit phối hợp</option>
                    <option value="Biện pháp thi công">Biện pháp thi công</option>
                    <option value="QA/QC Hiện trường">QA/QC & Nghiệm thu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#AAA] mb-1 font-medium">TÁC GIẢ</label>
                  <input
                    type="text"
                    value={currentArticle.author || 'Ban Kỹ Thuật DEBRIQ'}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, author: e.target.value })}
                    className="w-full bg-[#111] border border-[#444] rounded-lg p-2 text-white font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[#AAA] mb-1 font-medium">THỜI GIAN ĐỌC (PHÚT)</label>
                  <input
                    type="number"
                    value={currentArticle.readingTimeMinutes || 5}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, readingTimeMinutes: parseInt(e.target.value, 10) || 5 })}
                    className="w-full bg-[#111] border border-[#444] rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="bg-[#18181B] border border-[#2D2D32] rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#2D2D32] pb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Ảnh bìa bài viết (Cover Image)
                  </span>
                  <button
                    type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="text-[11px] text-[#F27D26] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" /> Chọn ảnh
                  </button>
                </div>

                <div className="aspect-video bg-[#111] border border-[#333] rounded-lg overflow-hidden flex items-center justify-center">
                  {currentArticle.coverImage || currentArticle.heroImage ? (
                    <img
                      src={currentArticle.coverImage || currentArticle.heroImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-xs text-[#666]">Chưa có ảnh bìa</div>
                  )}
                </div>

                <input
                  type="text"
                  value={currentArticle.coverImage || currentArticle.heroImage || ''}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, coverImage: e.target.value, heroImage: e.target.value })}
                  placeholder="URL ảnh bìa bài viết..."
                  className="w-full bg-[#111] border border-[#444] rounded p-2 text-xs text-white font-mono"
                />
              </div>

            </div>

          </div>
        </form>
      ) : (
        /* Articles List Table */
        <div className="space-y-4">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#1C1C20] p-4 rounded-xl border border-[#333]">
            <div>
              <h2 className="text-base font-bold text-white uppercase">QUẢN LÝ BÀI VIẾT KỸ THUẬT ({articles.length})</h2>
              <p className="text-xs text-[#777]">Soạn thảo bài viết, phân tích chuyên môn và cẩm nang thi công công trường</p>
            </div>

            <button
              onClick={handleStartCreate}
              className="px-4 py-2 bg-[#F27D26] hover:bg-[#D86616] text-white rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>VIẾT BÀI MỚI (WYSIWYG)</span>
            </button>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full bg-[#18181B] border border-[#333] rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#F27D26]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#18181B] border border-[#333] text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#F27D26]"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-[#18181B] border border-[#333] rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121215] text-[#888] border-b border-[#333] font-mono uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Bài viết</th>
                    <th className="py-3 px-4">Chuyên mục</th>
                    <th className="py-3 px-4">Tác giả</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2E] text-[#CCC]">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-[#666]">Không tìm thấy bài viết nào.</td>
                    </tr>
                  ) : (
                    filteredArticles.map((a) => (
                      <tr key={a.id} className="hover:bg-[#202024] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-9 rounded bg-[#27272A] overflow-hidden shrink-0">
                              {(a.coverImage || a.heroImage) && (
                                <img src={a.coverImage || a.heroImage} alt="" className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-white block text-sm font-sans">
                                {a.title?.vi || 'Chưa đặt tiêu đề'}
                              </span>
                              <span className="text-[11px] text-[#666] font-mono">
                                /insights/{a.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-white">
                          <span className="bg-[#242428] px-2 py-0.5 border border-[#3A3A40] rounded text-[11px]">
                            {a.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-[#AAA] font-sans">
                          {a.author || 'DEBRIQ'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.published !== false ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {a.published !== false ? 'CÔNG KHAI' : 'BẢN NHÁP'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStartEdit(a)}
                              className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded transition-colors cursor-pointer"
                              title="Chỉnh sửa bài viết"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {deletingArticleId === a.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(a.id)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                >
                                  Xóa?
                                </button>
                                <button
                                  onClick={() => setDeletingArticleId(null)}
                                  className="px-1.5 py-1 bg-[#27272A] text-[#AAA] rounded text-[10px] cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingArticleId(a.id)}
                                className="p-1.5 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                                title="Xóa bài viết"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(media) => {
          setCurrentArticle(prev => ({
            ...prev,
            coverImage: media.url,
            heroImage: media.url
          }));
          setMediaPickerOpen(false);
        }}
        token={token}
        title="Chọn ảnh bìa bài viết"
        defaultCategory="articles"
      />

    </div>
  );
};
