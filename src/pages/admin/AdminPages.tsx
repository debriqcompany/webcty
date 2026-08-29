import React, { useState, useRef, useMemo } from 'react';
import { PageContent } from '../../types';
import { DEFAULT_PAGE_CONTENTS } from '../../data/defaultPages';
import { 
  Save, 
  Upload, 
  Image as ImageIcon, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Layers, 
  Sparkles, 
  Eye, 
  Globe, 
  Info,
  Building,
  Users,
  Handshake,
  PhoneCall,
  Home,
  RotateCcw,
  Wrench
} from 'lucide-react';

interface AdminPagesProps {
  pages: Record<string, PageContent>;
  refreshData: () => Promise<void>;
  token: string | null;
}

export const AdminPages: React.FC<AdminPagesProps> = ({ pages, refreshData, token }) => {
  const [selectedPageKey, setSelectedPageKey] = useState<string>('about');
  const [pageData, setPageData] = useState<Record<string, PageContent>>(pages || {});
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const PAGE_TABS = [
    { key: 'about', labelVi: 'Về chúng tôi', labelEn: 'About Us', path: '/about', icon: Building },
    { key: 'services', labelVi: 'Dịch vụ kỹ thuật', labelEn: 'Services Page', path: '/services', icon: Wrench },
    { key: 'partners', labelVi: 'Đối tác & Khách hàng', labelEn: 'Partners & Clients', path: '/partners', icon: Handshake },
    { key: 'join-debriq', labelVi: 'Mạng lưới kỹ sư', labelEn: 'Engineers Network', path: '/join-debriq', icon: Users },
    { key: 'contact', labelVi: 'Liên hệ & Hợp tác', labelEn: 'Contact Desk', path: '/contact', icon: PhoneCall },
    { key: 'home', labelVi: 'Trang Chủ', labelEn: 'Home Page', path: '/', icon: Home },
  ];

  const currentTab = PAGE_TABS.find(t => t.key === selectedPageKey) || PAGE_TABS[0];
  const defaultPage = DEFAULT_PAGE_CONTENTS[selectedPageKey] || {
    id: `page-${selectedPageKey}`,
    slug: selectedPageKey,
    title: { vi: currentTab.labelVi, en: currentTab.labelEn },
    subtitle: { vi: '', en: '' },
    description: { vi: '', en: '' },
    heroImage: '',
    bannerImage: '',
    gallery: [],
    contentHtml: { vi: '', en: '' },
    metaDescription: { vi: '', en: '' },
    sections: {}
  };

  // Merge loaded database page with default template so no field is unexpectedly blank
  const rawPage = pageData[selectedPageKey];
  const currentPage: PageContent = useMemo(() => {
    if (!rawPage) return defaultPage;
    return {
      ...defaultPage,
      ...rawPage,
      title: rawPage.title || defaultPage.title,
      subtitle: rawPage.subtitle !== undefined && rawPage.subtitle !== '' ? rawPage.subtitle : defaultPage.subtitle,
      description: rawPage.description !== undefined && rawPage.description !== '' ? rawPage.description : defaultPage.description,
      contentHtml: rawPage.contentHtml !== undefined ? rawPage.contentHtml : defaultPage.contentHtml,
      metaDescription: rawPage.metaDescription || defaultPage.metaDescription,
      heroImage: rawPage.heroImage !== undefined ? rawPage.heroImage : defaultPage.heroImage,
      bannerImage: rawPage.bannerImage !== undefined ? rawPage.bannerImage : defaultPage.bannerImage,
      gallery: rawPage.gallery || defaultPage.gallery || []
    };
  }, [rawPage, defaultPage, selectedPageKey]);

  const updateCurrentPage = (partial: Partial<PageContent>) => {
    setPageData(prev => ({
      ...prev,
      [selectedPageKey]: {
        ...currentPage,
        ...partial
      }
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm(`Bạn có chắc muốn nạp lại nội dung mặc định chuẩn cho trang "${currentTab.labelVi}"?`)) {
      setPageData(prev => ({
        ...prev,
        [selectedPageKey]: { ...defaultPage }
      }));
      setSuccessMsg(`Đã nạp lại nội dung chuẩn cho trang ${currentTab.labelVi}. Nhấn "LƯU TRANG" để lưu lên hệ thống.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'general');

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload ảnh thất bại');

      updateCurrentPage({
        heroImage: data.url,
        bannerImage: data.url
      });
      setSuccessMsg('Tải ảnh đại diện thành công!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi upload ảnh');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGallery(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'general');

    try {
      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload ảnh thất bại');

      const existingGallery = currentPage.gallery || [];
      updateCurrentPage({
        gallery: [...existingGallery, data.url]
      });
      setSuccessMsg('Thêm ảnh vào bộ sưu tập trang thành công!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi upload ảnh');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const existingGallery = [...(currentPage.gallery || [])];
    existingGallery.splice(index, 1);
    updateCurrentPage({ gallery: existingGallery });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/pages/${selectedPageKey}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(currentPage)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Lỗi khi lưu trang');
      }

      await refreshData();
      setSuccessMsg(`ĐÃ LƯU THÀNH CÔNG NỘI DUNG TRANG: ${currentTab.labelVi.toUpperCase()}`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu nội dung trang');
    } finally {
      setSaving(false);
    }
  };

  // Helper getters for bilingual fields
  const getBilingualValue = (field: any, lang: 'vi' | 'en'): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || '';
  };

  const setBilingualValue = (fieldName: keyof PageContent, val: string, lang: 'vi' | 'en') => {
    const prevField = (currentPage[fieldName] as any) || { vi: '', en: '' };
    const updated = typeof prevField === 'object'
      ? { ...prevField, [lang]: val }
      : { vi: prevField, en: val, [lang]: val };
    
    updateCurrentPage({ [fieldName]: updated });
  };

  return (
    <div className="space-y-6 font-mono-tech text-xs">
      
      {/* Top Header Bar with Page Selection Tabs */}
      <div className="bg-[#18181C] border border-[#2E2E34] p-4 sm:p-5 rounded-xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white uppercase flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#F27D26]" />
              <span>QUẢN LÝ NỘI DUNG & HÌNH ẢNH CÁC TRANG (PAGE CMS)</span>
            </h2>
            <p className="text-[11px] text-[#A0A09A] font-sans mt-0.5">
              Tự do chỉnh sửa tiêu đề, mô tả, nội dung bài viết giới thiệu, ảnh banner và bộ sưu tập hình ảnh cho từng trang web.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 bg-[#26262B] hover:bg-[#333] text-[#F27D26] border border-[#444] rounded-lg inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
              title="Khôi phục nội dung văn bản chuẩn ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mẫu chuẩn</span>
            </button>

            <a
              href={currentTab.path}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#26262B] hover:bg-[#333] text-white border border-[#444] rounded-lg inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Xem trang thực tế</span>
              <ExternalLink className="w-3 h-3 text-[#888]" />
            </a>
          </div>
        </div>

        {/* Page Selector Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#2A2A30]">
          {PAGE_TABS.map(tab => {
            const TabIcon = tab.icon;
            const isSelected = selectedPageKey === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setSelectedPageKey(tab.key);
                  setSuccessMsg(null);
                  setErrorMsg(null);
                }}
                className={`px-3.5 py-2 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer text-xs ${
                  isSelected
                    ? 'bg-[#F27D26] text-white shadow-md'
                    : 'bg-[#222226] text-[#A0A09A] hover:text-white hover:bg-[#2A2A30] border border-[#333]'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span>{tab.labelVi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Edit Form */}
      <form onSubmit={handleSave} className="bg-[#18181C] border border-[#2E2E34] rounded-xl p-6 sm:p-8 space-y-8 shadow-xl">
        
        {/* Status Alerts */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-lg font-bold flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 text-rose-300 rounded-lg font-bold flex items-center gap-2 animate-fade-in">
            <Info className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Language Switcher */}
        <div className="flex items-center justify-between border-b border-[#2E2E34] pb-4">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
            <Globe className="w-4 h-4 text-[#F27D26]" />
            <span>NGÔN NGỮ NỘI DUNG ĐANG SOẠN THẢO:</span>
          </div>
          <div className="flex items-center gap-1 bg-[#111] p-1 border border-[#333] rounded-lg">
            <button
              type="button"
              onClick={() => setActiveLang('vi')}
              className={`px-3 py-1 font-bold rounded cursor-pointer transition-all ${
                activeLang === 'vi' ? 'bg-[#F27D26] text-white' : 'text-[#888] hover:text-white'
              }`}
            >
              TIẾNG VIỆT (VI)
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('en')}
              className={`px-3 py-1 font-bold rounded cursor-pointer transition-all ${
                activeLang === 'en' ? 'bg-[#F27D26] text-white' : 'text-[#888] hover:text-white'
              }`}
            >
              ENGLISH (EN)
            </button>
          </div>
        </div>

        {/* Section 1: Page Titles & Top Introduction */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#F27D26] uppercase tracking-wider flex items-center gap-2">
            <span>// 1. TIÊU ĐỀ & MÔ TẢ ĐẦU TRANG ({activeLang.toUpperCase()})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A0A09A] font-bold mb-1.5">
                TIÊU ĐỀ TRANG ({activeLang.toUpperCase()}) *
              </label>
              <input
                type="text"
                value={getBilingualValue(currentPage.title, activeLang)}
                onChange={(e) => setBilingualValue('title', e.target.value, activeLang)}
                placeholder={activeLang === 'vi' ? 'Ví dụ: Về chúng tôi — DEBRIQ' : 'e.g. About DEBRIQ Engineering'}
                className="w-full bg-[#111] border border-[#3A3A40] focus:border-[#F27D26] p-3 text-white rounded-lg outline-none font-sans text-sm"
              />
            </div>

            <div>
              <label className="block text-[#A0A09A] font-bold mb-1.5">
                PHỤ ĐỀ / TAGLINE HEADER ({activeLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={getBilingualValue(currentPage.subtitle, activeLang)}
                onChange={(e) => setBilingualValue('subtitle', e.target.value, activeLang)}
                placeholder={activeLang === 'vi' ? 'HỒ SƠ NĂNG LỰC DOANH NGHIỆP' : 'COMPANY PROFILE & BACKGROUND'}
                className="w-full bg-[#111] border border-[#3A3A40] focus:border-[#F27D26] p-3 text-white rounded-lg outline-none font-sans text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A0A09A] font-bold mb-1.5">
              ĐOẠN MÔ TẢ TỔNG QUAN HEADER ({activeLang.toUpperCase()})
            </label>
            <textarea
              rows={3}
              value={getBilingualValue(currentPage.description || currentPage.metaDescription, activeLang)}
              onChange={(e) => {
                setBilingualValue('description', e.target.value, activeLang);
                setBilingualValue('metaDescription', e.target.value, activeLang);
              }}
              placeholder={activeLang === 'vi' ? 'Đoạn giới thiệu ngắn gọn hiển thị ngay dưới tiêu đề lớn ở đầu trang...' : 'Introductory overview paragraph below main title...'}
              className="w-full bg-[#111] border border-[#3A3A40] focus:border-[#F27D26] p-3 text-white rounded-lg outline-none font-sans text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Banner / Hero Image */}
        <div className="space-y-4 pt-4 border-t border-[#2E2E34]">
          <h3 className="text-xs font-bold text-[#F27D26] uppercase tracking-wider flex items-center gap-2">
            <span>// 2. HÌNH ẢNH BANNER / HERO ĐẠI DIỆN TRANG</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3">
              <p className="text-[11px] text-[#A0A09A] font-sans leading-relaxed">
                Ảnh đại diện sẽ hiển thị nổi bật ở khu vực giới thiệu của trang, giúp tăng tính sinh động và trực quan chuyên nghiệp. Hỗ trợ định dạng `.webp`, `.png`, `.jpg`.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={currentPage.heroImage || currentPage.bannerImage || ''}
                  onChange={(e) => updateCurrentPage({ heroImage: e.target.value, bannerImage: e.target.value })}
                  placeholder="/uploads/general/... hoặc https://..."
                  className="flex-1 bg-[#111] border border-[#3A3A40] focus:border-[#F27D26] p-2.5 text-white rounded-lg outline-none font-mono text-xs"
                />

                <input
                  type="file"
                  ref={heroFileInputRef}
                  onChange={handleHeroUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={uploadingHero}
                  onClick={() => heroFileInputRef.current?.click()}
                  className="px-4 py-2.5 bg-[#2A2A30] hover:bg-[#333] text-white border border-[#444] rounded-lg font-bold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-[#F27D26]" />
                  <span>{uploadingHero ? 'ĐANG TẢI...' : 'TẢI ẢNH LÊN'}</span>
                </button>
              </div>
            </div>

            {/* Image Preview Box */}
            <div className="lg:col-span-5">
              {currentPage.heroImage || currentPage.bannerImage ? (
                <div className="relative border border-[#333] rounded-lg overflow-hidden bg-black/40 group aspect-video flex items-center justify-center">
                  <img
                    src={currentPage.heroImage || currentPage.bannerImage}
                    alt="Page Hero"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => updateCurrentPage({ heroImage: '', bannerImage: '' })}
                    className="absolute top-2 right-2 p-1.5 bg-black/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#333] rounded-lg aspect-video flex flex-col items-center justify-center text-[#666] p-4 text-center">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-[11px]">Chưa cài đặt ảnh banner</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Detailed Rich Narrative / Article HTML */}
        <div className="space-y-4 pt-4 border-t border-[#2E2E34]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="text-xs font-bold text-[#F27D26] uppercase tracking-wider">
              // 3. BÀI VIẾT / NỘI DUNG GIỚI THIỆU CHI TIẾT ({activeLang.toUpperCase()})
            </h3>
            <span className="text-[10px] text-[#888]">Hỗ trợ định dạng HTML (Thẻ &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;img&gt;...)</span>
          </div>

          <p className="text-[11px] text-[#A0A09A] font-sans leading-relaxed">
            Bạn có thể nhập các đoạn văn bản chi tiết về lịch sử công ty, triết lý hoạt động, tiêu chuẩn kỹ thuật hoặc thông tin hướng dẫn liên hệ. Đoạn văn này sẽ được hiển thị với phông chữ kỹ thuật hiện đại.
          </p>

          <textarea
            rows={10}
            value={getBilingualValue(currentPage.contentHtml, activeLang)}
            onChange={(e) => setBilingualValue('contentHtml', e.target.value, activeLang)}
            placeholder={activeLang === 'vi' 
              ? '<p>Đội ngũ DEBRIQ bắt đầu hoạt động từ năm 2022 với định hướng chuyên sâu...</p>\n<h2>Nguyên tắc triển khai</h2>\n<p>Luôn bám sát tiêu chuẩn hiện trường và tối ưu tiến độ...</p>'
              : '<p>DEBRIQ engineering team has been operating since 2022...</p>'}
            className="w-full bg-[#111] border border-[#3A3A40] focus:border-[#F27D26] p-4 text-white rounded-lg outline-none font-mono text-xs leading-relaxed"
          />
        </div>

        {/* Section 4: Extra Image Gallery */}
        <div className="space-y-4 pt-4 border-t border-[#2E2E34]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-xs font-bold text-[#F27D26] uppercase tracking-wider">
                // 4. BỘ SƯU TẬP HÌNH ẢNH BỔ SUNG (GALLERY)
              </h3>
              <p className="text-[11px] text-[#A0A09A] font-sans mt-0.5">
                Thêm các hình ảnh chụp thực tế hiện trường, ảnh bản vẽ kỹ thuật hoặc ảnh đội ngũ.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={galleryFileInputRef}
                onChange={handleGalleryUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                disabled={uploadingGallery}
                onClick={() => galleryFileInputRef.current?.click()}
                className="px-3.5 py-2 bg-[#F27D26]/20 hover:bg-[#F27D26]/30 text-[#F27D26] border border-[#F27D26]/40 rounded-lg font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{uploadingGallery ? 'ĐANG TẢI...' : 'THÊM ẢNH MỚI'}</span>
              </button>
            </div>
          </div>

          {currentPage.gallery && currentPage.gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
              {currentPage.gallery.map((imgUrl, gIdx) => (
                <div key={gIdx} className="relative group border border-[#333] rounded-lg overflow-hidden bg-black/40 aspect-video">
                  <img
                    src={imgUrl}
                    alt={`Gallery item ${gIdx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(gIdx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                    title="Xóa ảnh này"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-[#333] rounded-lg p-6 text-center text-[#666]">
              <p className="text-xs">Chưa có ảnh bổ sung trong bộ sưu tập của trang này.</p>
            </div>
          )}
        </div>

        {/* Section 5: SEO Meta Information */}
        <div className="space-y-4 pt-4 border-t border-[#2E2E34]">
          <h3 className="text-xs font-bold text-[#F27D26] uppercase tracking-wider">
            // 5. TỐI ƯU MÔ TẢ SEO (GOOGLE SEARCH & LINK PREVIEW)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#A0A09A] font-bold mb-1.5">
                TIÊU ĐỀ SEO MẠNG XÃ HỘI (OG TITLE)
              </label>
              <input
                type="text"
                value={currentPage.ogTitle || ''}
                onChange={(e) => updateCurrentPage({ ogTitle: e.target.value })}
                placeholder="DEBRIQ ENGINEERING — Kỹ thuật thi công & Shopdrawing..."
                className="w-full bg-[#111] border border-[#3A3A40] focus:border-[#F27D26] p-3 text-white rounded-lg outline-none font-sans text-sm"
              />
            </div>

            <div>
              <label className="block text-[#A0A09A] font-bold mb-1.5">
                MÔ TẢ SEO META (GOOGLE DESCRIPTION)
              </label>
              <input
                type="text"
                value={currentPage.ogDescription || getBilingualValue(currentPage.metaDescription, 'vi')}
                onChange={(e) => updateCurrentPage({ ogDescription: e.target.value })}
                placeholder="Mô tả tóm tắt chuẩn SEO xuất hiện khi chia sẻ liên kết..."
                className="w-full bg-[#111] border border-[#3A3A40] focus:border-[#F27D26] p-3 text-white rounded-lg outline-none font-sans text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[#2E2E34]">
          <span className="text-[11px] text-[#777]">
            * Nhấn "LƯU NỘI DUNG TRANG" để lưu và cập nhật ngay lên website `debriq.vn`.
          </span>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-[#F27D26] hover:bg-[#D86616] active:scale-95 text-white px-8 py-3.5 rounded-xl uppercase tracking-wider font-bold inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'ĐANG LƯU DỮ LIỆU...' : `LƯU TRANG ${currentTab.labelVi.toUpperCase()}`}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
