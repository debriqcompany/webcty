import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Maximize2
} from 'lucide-react';
import { ProjectImage } from '../../types';
import { DrawingViewerModal } from '../../components/public/DrawingViewerModal';
import { ContentBlockRenderer } from '../../components/public/ContentBlockRenderer';
import { 
  TechnicalDrawingBeamRebar, 
  TechnicalFinishingDetail, 
  TechnicalBimClashNode, 
  TechnicalBasementMethod 
} from '../../utils/visuals';

interface ProjectDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
  openQuoteModal: (service?: string, project?: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ slug, navigate, openQuoteModal }) => {
  const { lang, t } = useLanguage();
  const { projects, getProjectBySlug } = useData();

  const [activeImage, setActiveImage] = useState<ProjectImage | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'drawing' | 'rendering' | 'site_photo' | 'photo'>('all');

  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F3F2EE] px-4 font-mono-tech">
        <h1 className="text-2xl font-bold text-[#151515] mb-2">404 — KHÔNG TÌM THẤY DỰ ÁN</h1>
        <p className="text-xs text-[#777] mb-6">Dự án yêu cầu không tồn tại hoặc đã được chuyển hướng.</p>
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 bg-[#151515] text-white px-5 py-2.5 text-xs uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VỀ DANH SÁCH DỰ ÁN</span>
        </button>
      </div>
    );
  }

  // Related projects (exclude current)
  const relatedProjects = projects.filter(p => p.id !== project.id && p.published).slice(0, 2);

  return (
    <div className="bg-[#F3F2EE] min-h-screen text-[#151515] font-display selection:bg-[#F27D26] selection:text-white">
      
      {/* Lightbox Modal */}
      <DrawingViewerModal image={activeImage} onClose={() => setActiveImage(null)} />

      {/* Top Breadcrumb & Return Bar */}
      <div className="border-b border-[#D9D8D3] bg-[#EAE9E4] py-3.5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between font-sans text-xs">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 text-[#262626] hover:text-[#F27D26] font-medium uppercase tracking-wider transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Quay lại tất cả dự án' : 'Back to projects'}</span>
          </button>

          <div className="flex items-center gap-2 text-[#767670] hidden sm:flex">
            <span>Portfolio</span>
            <span>/</span>
            <span className="text-[#151515] font-medium truncate max-w-xs">{t(project.name)}</span>
          </div>
        </div>
      </div>

      {/* Case Study Header Banner */}
      <section className="py-12 sm:py-20 border-b border-[#D9D8D3] bg-[#F3F2EE]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="space-y-6">
            
            {/* Project ID & Service Tags */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="type-meta-label bg-[#F27D26] text-white px-2.5 py-1">
                CASE STUDY / {project.period}
              </span>
              {project.services.map((svc, i) => (
                <span key={i} className="font-sans text-xs bg-[#E2E1DC] text-[#151515] px-3 py-1 font-medium">
                  {svc}
                </span>
              ))}
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-[#151515] tracking-tight leading-[1.05]">
                {t(project.name)}
              </h1>
              {project.subtitle && (
                <p className="font-sans text-lg sm:text-2xl text-[#555] mt-2 italic max-w-4xl">
                  {t(project.subtitle)}
                </p>
              )}
            </div>

            {/* Transparent Stakeholder Attribution Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#EAE9E4] p-5 border border-[#D9D8D3]">
              
              <div className="border-b sm:border-b-0 sm:border-r border-[#D9D8D3] pb-3 sm:pb-0 pr-2">
                <span className="type-meta-label block mb-1">
                  // {lang === 'vi' ? 'KHÁCH HÀNG TRỰC TIẾP DEBRIQ' : 'DIRECT DEBRIQ CLIENT'}
                </span>
                <span className="type-meta-value text-sm font-medium">{project.directClient}</span>
              </div>

              <div className="border-b sm:border-b-0 lg:border-r border-[#D9D8D3] pb-3 sm:pb-0 pr-2">
                <span className="type-meta-label block mb-1">
                  // {lang === 'vi' ? 'CHỦ ĐẦU TƯ DỰ ÁN' : 'PROJECT DEVELOPER / OWNER'}
                </span>
                <span className="type-meta-value text-xs font-normal text-[#262626]">{project.projectOwner || 'Chủ đầu tư'}</span>
              </div>

              <div className="border-b sm:border-b-0 sm:border-r border-[#D9D8D3] pb-3 sm:pb-0 pr-2">
                <span className="type-meta-label block mb-1">
                  // {lang === 'vi' ? 'TỔNG THẦU THI CÔNG' : 'MAIN CONTRACTOR'}
                </span>
                <span className="type-meta-value text-xs font-normal text-[#262626]">{project.mainContractor || project.directClient}</span>
              </div>

              <div>
                <span className="type-meta-label block mb-1">
                  // {lang === 'vi' ? 'QUY MÔ THAM CHIẾU' : 'BENCHMARK SCALE'}
                </span>
                <span className="type-meta-value text-sm text-[#F27D26] font-medium">{project.scaleMetric || t(project.scale)}</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Case Study Main Content & Hero Image */}
      <section className="py-16 sm:py-20 border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
          
          {/* Main Hero Visual Presentation */}
          <div className="border border-[#D9D8D3] bg-[#1E1E1E] overflow-hidden relative shadow-lg">
            <img
              src={project.heroImage}
              alt={t(project.name)}
              className="w-full max-h-[600px] object-cover contrast-105"
            />
            <div className="bg-[#151515] p-4 text-white font-mono-tech text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-t border-[#333]">
              <div>
                <span className="text-[#F27D26] font-bold">PROJECT SITE //</span> {t(project.name)} • {project.period}
              </div>
              <div className="text-[10px] text-[#888]">
                AUTHENTIC JOB-SITE SPECIFICATION & COORDINATION ARCHIVE
              </div>
            </div>
          </div>

          {/* Deep Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Col: Scope Breakdown & Technical Facts */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* 1. Scope Section */}
              <div className="space-y-4">
                <div className="border-b border-[#D9D8D3] pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#F27D26]" />
                  <h2 className="type-section-label font-bold text-[#151515]">
                    {lang === 'vi' ? 'PHẠM VI THỰC HIỆN CỦA DEBRIQ' : 'DEBRIQ CONTRACTED SCOPE'}
                  </h2>
                </div>
                
                <p className="font-sans text-xl text-[#262626] leading-relaxed">
                  {t(project.scope)}
                </p>

                {/* Sub-scope breakdowns if available */}
                {project.scopeDetails && (
                  <div className="space-y-3 pt-2">
                    {project.scopeDetails.structural && (
                      <div className="p-4 bg-[#EAE9E4] border-l-2 border-[#F27D26] space-y-1">
                        <span className="type-meta-label text-[#151515] block">
                          {lang === 'vi' ? 'PHẠM VI KẾT CẤU BÊ TÔNG CỐT THÉP:' : 'STRUCTURAL RC SCOPE:'}
                        </span>
                        <p className="text-xs text-[#444] leading-relaxed font-sans">
                          {t(project.scopeDetails.structural)}
                        </p>
                      </div>
                    )}

                    {project.scopeDetails.finishing && (
                      <div className="p-4 bg-[#EAE9E4] border-l-2 border-[#151515] space-y-1">
                        <span className="type-meta-label text-[#151515] block">
                          {lang === 'vi' ? 'PHẠM VI HOÀN THIỆN KIẾN TRÚC:' : 'ARCHITECTURAL FINISHING SCOPE:'}
                        </span>
                        <p className="text-xs text-[#444] leading-relaxed font-sans">
                          {t(project.scopeDetails.finishing)}
                        </p>
                      </div>
                    )}

                    {project.scopeDetails.infrastructure && (
                      <div className="p-4 bg-[#EAE9E4] border-l-2 border-[#8D8D88] space-y-1">
                        <span className="type-meta-label text-[#151515] block">
                          {lang === 'vi' ? 'PHẠM VI HẠ TẦNG KỸ THUẬT:' : 'CIVIL INFRASTRUCTURE SCOPE:'}
                        </span>
                        <p className="text-xs text-[#444] leading-relaxed font-sans">
                          {t(project.scopeDetails.infrastructure)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Scale Information */}
              <div className="space-y-4">
                <div className="border-b border-[#D9D8D3] pb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#F27D26]" />
                  <h2 className="type-section-label font-bold text-[#151515]">
                    {lang === 'vi' ? 'THÔNG TIN QUY MÔ THAM CHIẾU' : 'BENCHMARK SCALE & CAPACITY'}
                  </h2>
                </div>
                <p className="text-sm text-[#444] leading-relaxed font-sans">
                  {t(project.scale)}
                </p>
              </div>

              {/* 3. Technical Overview */}
              {project.technicalOverview && (
                <div className="space-y-4">
                  <div className="border-b border-[#D9D8D3] pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#F27D26]" />
                    <h2 className="type-section-label font-bold text-[#151515]">
                      {lang === 'vi' ? 'NĂNG LỰC & GIẢI PHÁP KỸ THUẬT' : 'TECHNICAL EXECUTION & QA/QC'}
                    </h2>
                  </div>
                  <p className="text-sm text-[#444] leading-relaxed font-sans">
                    {t(project.technicalOverview)}
                  </p>
                </div>
              )}

              {/* 4. Project Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="space-y-4">
                  <div className="border-b border-[#D9D8D3] pb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#F27D26]" />
                    <h2 className="type-section-label font-bold text-[#151515]">
                      {lang === 'vi' ? 'ĐIỂM NỔI BẬT CỦA DỰ ÁN' : 'PROJECT HIGHLIGHTS'}
                    </h2>
                  </div>
                  <ul className="space-y-2.5">
                    {project.highlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#333] font-sans">
                        <span className="font-mono-tech text-xs text-[#F27D26] font-semibold mt-0.5">0{i+1}.</span>
                        <span>{t(hl)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 5. Rich Content Blocks (CMS Article / Detailed Engineering Story) */}
              {project.contentBlocks && project.contentBlocks.length > 0 && (
                <div className="pt-6 border-t border-[#D9D8D3]">
                  <ContentBlockRenderer blocks={project.contentBlocks} />
                </div>
              )}

            </div>

            {/* Right Col: Technical Blueprint & Action Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Dynamic Technical Vector or Custom Drawing Image */}
              <div className="border-2 border-[#151515] bg-[#181818] p-2 shadow-md">
                {project.drawingType === 'custom_image' && project.drawingImageUrl ? (
                  <div className="relative group overflow-hidden bg-[#111]">
                    <img
                      src={project.drawingImageUrl}
                      alt={project.drawingCaption ? t(project.drawingCaption) : 'Technical Drawing'}
                      className="w-full max-h-[380px] object-contain cursor-pointer group-hover:scale-105 transition-transform duration-300"
                      onClick={() => setActiveImage({
                        id: 'custom-drawing',
                        url: project.drawingImageUrl!,
                        caption: project.drawingCaption || { vi: 'Bản vẽ kỹ thuật dự án', en: 'Project technical drawing' },
                        type: 'drawing'
                      })}
                    />
                    <div className="p-2.5 bg-[#1A1A1A] border-t border-[#333] flex justify-between items-center text-[10px] font-mono-tech text-[#AAA]">
                      <span className="text-[#F27D26] font-bold">APPROVED SHOPDRAWING ARCHIVE</span>
                      <span className="text-white flex items-center gap-1 cursor-pointer" onClick={() => setActiveImage({
                        id: 'custom-drawing',
                        url: project.drawingImageUrl!,
                        caption: project.drawingCaption || { vi: 'Bản vẽ kỹ thuật dự án', en: 'Project technical drawing' },
                        type: 'drawing'
                      })}>
                        <Maximize2 className="w-3 h-3" /> Phóng to
                      </span>
                    </div>
                  </div>
                ) : project.slug === 'the-one-world-one-era' ? (
                  <TechnicalFinishingDetail />
                ) : project.slug === 'opera-tay-ho-nha-hat-ngoc-trai' ? (
                  <TechnicalBimClashNode />
                ) : project.slug === 'trung-tam-hanh-chinh-thu-thiem' || project.slug === 'spring-ville' ? (
                  <TechnicalBasementMethod />
                ) : (
                  <TechnicalDrawingBeamRebar />
                )}
              </div>

              {/* Inquiry CTA Box */}
              <div className="bg-[#151515] text-[#F3F2EE] p-6 sm:p-8 space-y-5 border border-[#333]">
                <span className="type-section-label text-[#F27D26] block">
                  // {lang === 'vi' ? 'TƯ VẤN TRIỂN KHAI DỰ ÁN' : 'PROJECT CONSULTATION'}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {lang === 'vi' ? 'Cần báo giá cho gói thầu tương tự?' : 'Need a quote for a similar scope?'}
                </h3>
                <p className="text-sm text-[#A0A09A] leading-relaxed font-sans">
                  {lang === 'vi'
                    ? 'Kỹ sư DEBRIQ sẵn sàng rà soát sơ bộ hồ sơ thiết kế và lập kế hoạch bàn giao bản vẽ theo từng giai đoạn thi công.'
                    : 'DEBRIQ engineers are ready to review your blueprints and schedule staged drawing packages tailored to your pour cycles.'}
                </p>
                <button
                  onClick={() => openQuoteModal(project.services[0], t(project.name))}
                  className="w-full bg-[#F27D26] hover:bg-white hover:text-[#151515] text-white py-3.5 font-sans font-semibold text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>{lang === 'vi' ? 'Gửi yêu cầu báo giá' : 'Request a quote'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Gallery & Shopdrawing Lightbox Strip */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-[#D9D8D3]">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="type-section-label text-[#F27D26] block mb-1">
                    // {lang === 'vi' ? 'HỒ SƠ HÌNH ẢNH & BẢN VẼ' : 'DRAWINGS & SITE GALLERY'}
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#151515] tracking-tight">
                    {lang === 'vi' ? 'Hình ảnh hiện trường & bản vẽ Shopdrawing' : 'Drawings & Site Photography'}
                  </h2>
                </div>

                {/* Filter Tabs for Gallery */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono-tech text-[11px]">
                  <button
                    onClick={() => setGalleryFilter('all')}
                    className={`px-3 py-1 border transition-colors cursor-pointer ${
                      galleryFilter === 'all'
                        ? 'bg-[#151515] text-white border-[#151515] font-bold'
                        : 'bg-[#EAE9E4] text-[#666] border-[#D9D8D3] hover:border-[#999]'
                    }`}
                  >
                    {lang === 'vi' ? 'TẤT CẢ' : 'ALL'} ({project.gallery.length})
                  </button>
                  <button
                    onClick={() => setGalleryFilter('drawing')}
                    className={`px-3 py-1 border transition-colors cursor-pointer ${
                      galleryFilter === 'drawing'
                        ? 'bg-[#151515] text-white border-[#151515] font-bold'
                        : 'bg-[#EAE9E4] text-[#666] border-[#D9D8D3] hover:border-[#999]'
                    }`}
                  >
                    📐 {lang === 'vi' ? 'BẢN VẼ' : 'DRAWINGS'}
                  </button>
                  <button
                    onClick={() => setGalleryFilter('rendering')}
                    className={`px-3 py-1 border transition-colors cursor-pointer ${
                      galleryFilter === 'rendering'
                        ? 'bg-[#151515] text-white border-[#151515] font-bold'
                        : 'bg-[#EAE9E4] text-[#666] border-[#D9D8D3] hover:border-[#999]'
                    }`}
                  >
                    🏢 {lang === 'vi' ? 'PHỐI CẢNH' : 'RENDERS'}
                  </button>
                  <button
                    onClick={() => setGalleryFilter('site_photo')}
                    className={`px-3 py-1 border transition-colors cursor-pointer ${
                      galleryFilter === 'site_photo'
                        ? 'bg-[#151515] text-white border-[#151515] font-bold'
                        : 'bg-[#EAE9E4] text-[#666] border-[#D9D8D3] hover:border-[#999]'
                    }`}
                  >
                    🏗️ {lang === 'vi' ? 'HIỆN TRƯỜNG' : 'SITE'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.gallery
                  .filter(img => {
                    if (galleryFilter === 'all') return true;
                    return img.type === galleryFilter;
                  })
                  .map((img) => (
                    <div
                      key={img.id}
                      className="group border border-[#D9D8D3] bg-[#EAE9E4] overflow-hidden cursor-pointer hover:border-[#151515] transition-all"
                      onClick={() => setActiveImage(img)}
                    >
                      <div className="relative aspect-[4/3] bg-[#222] overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.alt || t(img.caption)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-[#151515]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-[#151515] text-white px-3 py-1 font-sans text-[11px] uppercase tracking-wider font-medium flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5" />
                            {lang === 'vi' ? 'Phóng to' : 'Enlarge'}
                          </span>
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="bg-[#151515]/90 text-white font-mono-tech text-[9px] px-2 py-0.5 uppercase border border-[#444]">
                            {img.type === 'drawing' ? 'Bản vẽ Shopdrawing' : img.type === 'rendering' ? 'Phối cảnh 3D' : img.type === 'site_photo' ? 'Hiện trường' : 'Hình ảnh'}
                          </span>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-sans text-xs text-[#333] truncate font-medium">
                          {t(img.caption)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Related Projects Section */}
          {relatedProjects.length > 0 && (
            <div className="pt-16 border-t border-[#D9D8D3] space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="type-section-label text-[#F27D26] block mb-1">
                    // {lang === 'vi' ? 'DỰ ÁN KHÁC' : 'OTHER PROJECTS'}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-[#151515] tracking-tight">
                    {lang === 'vi' ? 'Công trình liên quan' : 'Related Case Studies'}
                  </h3>
                </div>
                <button
                  onClick={() => navigate('/projects')}
                  className="font-sans text-xs font-medium text-[#767670] hover:text-[#151515] underline cursor-pointer"
                >
                  {lang === 'vi' ? 'Xem tất cả 9 dự án' : 'View all 9 projects'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedProjects.map(rp => (
                  <div
                    key={rp.id}
                    onClick={() => {
                      navigate(`/projects/${rp.slug}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="border border-[#D9D8D3] bg-[#EAE9E4] p-6 hover:border-[#151515] transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center type-meta-label text-[#767670]">
                        <span>{rp.directClient}</span>
                        <span className="text-[#F27D26] font-medium">{rp.period}</span>
                      </div>
                      <h4 className="font-display text-xl font-bold text-[#151515] group-hover:text-[#F27D26] transition-colors leading-snug">
                        {t(rp.name)}
                      </h4>
                      <p className="text-xs text-[#555] line-clamp-2 font-sans">
                        {t(rp.scope)}
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-[#D9D8D3] flex items-center justify-between font-sans text-xs font-medium text-[#151515]">
                      <span>{rp.scaleMetric || t(rp.scale)}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#F27D26]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
};
