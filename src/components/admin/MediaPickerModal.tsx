import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Search, 
  Check, 
  Image as ImageIcon, 
  Filter, 
  Loader2, 
  FolderPlus,
  ArrowRight
} from 'lucide-react';
import { MediaFile } from '../../types';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: { url: string; altText?: string; filename?: string }) => void;
  token: string | null;
  title?: string;
  defaultCategory?: 'projects' | 'services' | 'general' | 'drawings' | 'partners' | 'articles';
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  token,
  title = 'Chọn hình ảnh từ Thư viện Media',
  defaultCategory = 'general'
}) => {
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MediaFile | null>(null);
  const [customAltText, setCustomAltText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch media items from server
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
      console.error('Failed to load media files:', err);
      setMediaList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
      setSelectedItem(null);
      setCustomAltText('');
      setActiveTab('library');
    }
  }, [isOpen]);

  // Handle direct file upload
  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('category', defaultCategory);
        if (customAltText) formData.append('altText', customAltText);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData
        });

        if (res.ok) {
          const newMedia = await res.json();
          // Auto select the newly uploaded media
          onSelect({
            url: newMedia.url,
            altText: customAltText || file.name,
            filename: newMedia.filename || file.name
          });
          onClose();
          return;
        }
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Không thể tải ảnh lên máy chủ');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  // Filter media items
  const safeMediaList = Array.isArray(mediaList) ? mediaList : [];
  const filteredMedia = safeMediaList.filter(item => {
    if (!item) return false;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      (item.originalName && item.originalName.toLowerCase().includes(q)) ||
      (item.filename && item.filename.toLowerCase().includes(q)) ||
      (item.altText && item.altText.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  const handleConfirmSelect = () => {
    if (!selectedItem) return;
    onSelect({
      url: selectedItem.url || selectedItem.path,
      altText: customAltText || selectedItem.altText || selectedItem.originalName,
      filename: selectedItem.filename || selectedItem.originalName
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#27272a] flex items-center justify-between bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#f27d26]/10 border border-[#f27d26]/30 flex items-center justify-center text-[#f27d26]">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">{title}</h2>
              <p className="text-xs text-neutral-400">Chọn tệp từ thư viện hoặc tải trực tiếp lên VPS</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-[#27272a] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#27272a] bg-[#141417] px-5 pt-3 gap-3 text-xs">
          <button
            onClick={() => setActiveTab('library')}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'library'
                ? 'border-[#f27d26] text-[#f27d26]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Thư viện Media ({safeMediaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 font-medium transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#f27d26] text-[#f27d26]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Tải tệp mới</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'upload' ? (
            <div className="space-y-4 max-w-xl mx-auto py-6">
              <div className="border-2 border-dashed border-[#3f3f46] hover:border-[#f27d26] rounded-xl p-8 text-center transition-colors bg-[#1f1f23]">
                <label className="cursor-pointer flex flex-col items-center justify-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#27272a] flex items-center justify-center text-[#f27d26]">
                    {uploading ? (
                      <Loader2 className="w-7 h-7 animate-spin" />
                    ) : (
                      <Upload className="w-7 h-7" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-semibold text-white block">
                      {uploading ? 'Đang lưu tệp lên máy chủ...' : 'Nhấp để tải lên hoặc kéo thả tệp'}
                    </span>
                    <span className="text-xs text-neutral-400 block">
                      Hỗ trợ định dạng ảnh PNG, JPG, WEBP, SVG tối ưu hóa tự động
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    className="hidden"
                    onChange={(e) => handleUpload(e.target.files)}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Văn bản thay thế (Alt Text) / Chú thích ảnh
                </label>
                <input
                  type="text"
                  value={customAltText}
                  onChange={(e) => setCustomAltText(e.target.value)}
                  placeholder="Mô tả nội dung hình ảnh..."
                  className="w-full bg-[#1f1f23] border border-[#3f3f46] rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#f27d26]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên tệp, alt text..."
                    className="w-full bg-[#1f1f23] border border-[#3f3f46] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#f27d26]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-neutral-400 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Phân loại:
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-[#1f1f23] border border-[#3f3f46] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                  >
                    <option value="all">Tất cả mục</option>
                    <option value="projects">Dự án</option>
                    <option value="articles">Bài viết</option>
                    <option value="partners">Đối tác</option>
                    <option value="services">Dịch vụ</option>
                    <option value="general">Chung</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {loading ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-2 text-neutral-400 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-[#f27d26]" />
                  <span>Đang tải danh sách media...</span>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-[#27272a] rounded-xl bg-[#18181b] space-y-3">
                  <ImageIcon className="w-8 h-8 mx-auto text-neutral-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-neutral-300">Chưa có hình ảnh nào</p>
                    <p className="text-xs text-neutral-500">Chuyển sang tab "Tải tệp mới" để thêm ảnh đầu tiên</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-3.5 py-1.5 bg-[#f27d26] text-white rounded-lg text-xs font-semibold hover:bg-[#d96716] cursor-pointer"
                  >
                    Tải ảnh ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
                  {filteredMedia.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    const displayUrl = item.url || item.path;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedItem(item);
                          setCustomAltText(item.altText || item.originalName);
                        }}
                        className={`group relative rounded-lg overflow-hidden border cursor-pointer transition-all bg-[#121215] aspect-square flex flex-col ${
                          isSelected
                            ? 'border-[#f27d26] ring-2 ring-[#f27d26]/40 shadow-lg'
                            : 'border-[#27272a] hover:border-neutral-500'
                        }`}
                      >
                        <img
                          src={displayUrl}
                          alt={item.altText || item.originalName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          loading="lazy"
                        />

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#f27d26] text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 text-[11px] text-white truncate">
                          {item.originalName || item.filename}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Selected Item Info & Alt Text Editor */}
              {selectedItem && (
                <div className="p-3.5 bg-[#121215] border border-[#27272a] rounded-lg flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={selectedItem.url || selectedItem.path}
                    alt={selectedItem.altText}
                    className="w-14 h-14 rounded object-cover border border-[#3f3f46] shrink-0"
                  />
                  <div className="flex-1 w-full space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white truncate max-w-xs">
                        {selectedItem.originalName || selectedItem.filename}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {selectedItem.size ? `${Math.round(selectedItem.size / 1024)} KB` : ''}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={customAltText}
                      onChange={(e) => setCustomAltText(e.target.value)}
                      placeholder="Nhập Alt Text / Chú thích cho ảnh này..."
                      className="w-full bg-[#1f1f23] border border-[#3f3f46] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#27272a] bg-[#121215] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white rounded-lg hover:bg-[#27272a] transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>

          {activeTab === 'library' && (
            <button
              onClick={handleConfirmSelect}
              disabled={!selectedItem}
              className={`px-5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                selectedItem
                  ? 'bg-[#f27d26] text-white hover:bg-[#d96716]'
                  : 'bg-[#27272a] text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>Chèn ảnh đã chọn</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
