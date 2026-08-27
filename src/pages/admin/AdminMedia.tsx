import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  ExternalLink, 
  Search, 
  Trash2, 
  Filter, 
  Tag, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { MediaItem } from '../../types';

interface AdminMediaProps {
  token: string | null;
}

export const AdminMedia: React.FC<AdminMediaProps> = ({ token }) => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const authHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/media', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setMediaList(Array.isArray(data) ? data : (data?.media || data?.files || []));
      }
    } catch (err) {
      console.error('Error fetching media:', err);
      setMediaList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [token]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('category', selectedCategory === 'all' ? 'general' : selectedCategory);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          // Also save metadata to media index
          await fetch('/api/admin/media', {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({
              url: data.url,
              filename: data.filename || file.name,
              category: selectedCategory === 'all' ? 'general' : selectedCategory,
              sizeBytes: file.size,
              mimeType: file.type
            })
          });
        }
      }
      await fetchMedia();
    } catch (err) {
      alert('Lỗi tải file lên máy chủ');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (id: string, url: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa file media này khỏi thư viện?')) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        setSelectedMedia(null);
        await fetchMedia();
      }
    } catch (err) {
      alert('Lỗi xóa media');
    }
  };

  const handleUpdateMediaMeta = async (item: MediaItem) => {
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(item)
      });
      if (res.ok) {
        await fetchMedia();
      }
    } catch (err) {
      alert('Lỗi cập nhật thông tin media');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const safeMediaList = Array.isArray(mediaList) ? mediaList : [];
  const filteredMedia = safeMediaList.filter((m) => {
    if (!m) return false;
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      m.filename?.toLowerCase().includes(q) ||
      m.altText?.toLowerCase().includes(q) ||
      m.caption?.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">Thư viện Media & Tệp tin</h2>
          <p className="text-xs text-neutral-400">
            Quản lý tập trung toàn bộ hình ảnh, bản vẽ và tài liệu kỹ thuật dùng trên toàn website
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2 bg-[#f27d26] hover:bg-[#d96716] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-md">
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Đang tải lên...' : 'Tải lên hình ảnh mới'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </label>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-[#18181b]/50 border-2 border-dashed border-[#27272a] hover:border-[#f27d26] rounded-xl p-8 text-center transition-colors">
        <label className="cursor-pointer flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 bg-[#27272a] rounded-full flex items-center justify-center text-[#f27d26]">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold text-white text-sm block">
              {uploading ? 'Đang tải tệp tin lên máy chủ...' : 'Kéo thả hoặc nhấn để chọn file tải lên'}
            </span>
            <span className="text-xs text-neutral-400">
              Hỗ trợ định dạng JPG, PNG, WEBP, SVG (Tối đa 15MB/file)
            </span>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
        </label>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm tên tệp, ghi chú alt..."
            className="w-full bg-[#18181b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#f27d26]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'projects', 'articles', 'blueprints', 'general'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#f27d26] text-white'
                  : 'bg-[#18181b] text-neutral-400 hover:text-white border border-[#27272a]'
              }`}
            >
              {cat === 'all'
                ? 'Tất cả'
                : cat === 'projects'
                ? 'Dự án'
                : cat === 'articles'
                ? 'Bài viết'
                : cat === 'blueprints'
                ? 'Bản vẽ'
                : 'Chung'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Media with Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Media Grid */}
        <div className={`${selectedMedia ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
          {loading ? (
            <div className="p-12 text-center text-xs text-neutral-500 font-mono">
              ĐANG TẢI THƯ VIỆN MEDIA...
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-12 text-center space-y-3">
              <ImageIcon className="w-8 h-8 mx-auto text-neutral-500" />
              <p className="text-sm font-medium text-neutral-300">Chưa có tệp tin media nào</p>
              <p className="text-xs text-neutral-500">Tải lên hình ảnh đầu tiên để sử dụng trong nội dung</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMedia(item)}
                  className={`bg-[#18181b] border rounded-xl overflow-hidden cursor-pointer group transition-all ${
                    selectedMedia?.id === item.id
                      ? 'border-[#f27d26] ring-2 ring-[#f27d26]/30'
                      : 'border-[#27272a] hover:border-[#3f3f46]'
                  }`}
                >
                  <div className="aspect-square bg-[#121215] overflow-hidden relative">
                    <img
                      src={item.url}
                      alt={item.altText || item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(item.url);
                        }}
                        className="p-1.5 bg-black/70 hover:bg-black text-white rounded backdrop-blur-sm"
                        title="Sao chép link"
                      >
                        {copiedUrl === item.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5 space-y-0.5">
                    <p className="text-xs font-medium text-neutral-200 truncate">{item.filename}</p>
                    <p className="text-[10px] text-neutral-500">{formatFileSize(item.sizeBytes)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Media Details Inspector */}
        {selectedMedia && (
          <div className="lg:col-span-4 bg-[#18181b] border border-[#27272a] rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Chi tiết tệp tin
              </span>
              <button
                onClick={() => setSelectedMedia(null)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                Đóng
              </button>
            </div>

            <div className="aspect-video bg-[#121215] border border-[#3f3f46] rounded-lg overflow-hidden">
              <img
                src={selectedMedia.url}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-neutral-400 block text-[11px] mb-1">Tên file</label>
                <p className="text-neutral-200 font-mono break-all">{selectedMedia.filename}</p>
              </div>

              <div>
                <label className="text-neutral-400 block text-[11px] mb-1">Đường dẫn URL</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={selectedMedia.url}
                    className="w-full bg-[#121215] border border-[#3f3f46] rounded px-2.5 py-1 text-[11px] font-mono text-neutral-300 select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedMedia.url)}
                    className="p-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded shrink-0 cursor-pointer"
                  >
                    {copiedUrl === selectedMedia.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block text-[11px] mb-1">Alt Text (Mô tả trợ năng/SEO)</label>
                <input
                  type="text"
                  value={selectedMedia.altText || ''}
                  onChange={(e) => {
                    const updated = { ...selectedMedia, altText: e.target.value };
                    setSelectedMedia(updated);
                    handleUpdateMediaMeta(updated);
                  }}
                  placeholder="Mô tả nội dung hình ảnh..."
                  className="w-full bg-[#121215] border border-[#3f3f46] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                />
              </div>

              <div>
                <label className="text-neutral-400 block text-[11px] mb-1">Phân loại thư mục</label>
                <select
                  value={selectedMedia.category || 'general'}
                  onChange={(e) => {
                    const updated = { ...selectedMedia, category: e.target.value };
                    setSelectedMedia(updated);
                    handleUpdateMediaMeta(updated);
                  }}
                  className="w-full bg-[#121215] border border-[#3f3f46] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                >
                  <option value="projects">Dự án (Projects)</option>
                  <option value="articles">Bài viết (Articles)</option>
                  <option value="blueprints">Bản vẽ kỹ thuật (Blueprints)</option>
                  <option value="general">Chung (General)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#27272a] flex items-center justify-between">
                <a
                  href={selectedMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Mở trong tab mới
                </a>

                <button
                  onClick={() => handleDeleteMedia(selectedMedia.id, selectedMedia.url)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Xóa tệp này
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
