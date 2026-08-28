import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { ArrowUpRight, Filter } from 'lucide-react';
import { ScrollReveal } from '../../components/common/ScrollReveal';

interface ProjectsPageProps {
  navigate: (path: string) => void;
  openQuoteModal: (service?: string, project?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ navigate, openQuoteModal }) => {
  const { lang, t } = useLanguage();
  const { projects } = useData();

  const [selectedService, setSelectedService] = useState<string>('all');

  const filterOptions = [
    { id: 'all', labelVi: 'TẤT CẢ DỰ ÁN (9)', labelEn: 'ALL PROJECTS (9)' },
    { id: 'Shopdrawing kết cấu', labelVi: 'KẾT CẤU BÊ TÔNG', labelEn: 'STRUCTURAL RC' },
    { id: 'Shopdrawing hoàn thiện', labelVi: 'HOÀN THIỆN KIẾN TRÚC', labelEn: 'FINISHING' },
    { id: 'Shopdrawing hạ tầng', labelVi: 'HẠ TẦNG KỸ THUẬT', labelEn: 'INFRASTRUCTURE' }
  ];

  const filteredProjects = projects.filter(p => {
    if (!p.published) return false;
    if (selectedService === 'all') return true;
    return p.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()));
  });

  return (
    <div className="bg-[#F3F2EE] min-h-screen text-[#151515] font-display selection:bg-[#F27D26] selection:text-white">
      
      {/* Page Header */}
      <section className="border-b border-[#D9D8D3] bg-[#EAE9E4] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="type-section-label">
              // {lang === 'vi' ? 'HỒ SƠ NĂNG LỰC DỰ ÁN' : 'TECHNICAL PROJECT ARCHIVE'}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#151515] leading-[1.05]">
              {lang === 'vi' ? 'Danh mục dự án thực tế' : 'Verified Project Portfolio'}
            </h1>
            <p className="type-body-lg text-base sm:text-lg text-[#555] leading-relaxed font-sans">
              {lang === 'vi'
                ? 'Tổng hợp các công trình DEBRIQ đã và đang trực tiếp triển khai hồ sơ Shopdrawing, BIM và biện pháp thi công. Mỗi dự án đại diện cho một gói thầu thực tế với khách hàng và phạm vi xác thực.'
                : 'Verified portfolio of projects where DEBRIQ delivered structural, finishing, BIM, and method documentation for tier-1 contractors.'}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-20 z-30 bg-[#F3F2EE]/95 backdrop-blur-md border-b border-[#D9D8D3] py-4">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 type-meta-label text-[#767670] mr-2">
              <Filter className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>{lang === 'vi' ? 'BỘ LỌC:' : 'FILTER:'}</span>
            </div>

            {filterOptions.map(opt => {
              const active = selectedService === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedService(opt.id)}
                  className={`px-3.5 py-1.5 font-sans text-xs tracking-wider uppercase transition-all cursor-pointer ${
                    active
                      ? 'bg-[#151515] text-white font-semibold shadow-sm'
                      : 'bg-[#EAE9E4] hover:bg-white text-[#262626] border border-[#D9D8D3]'
                  }`}
                >
                  {lang === 'vi' ? opt.labelVi : opt.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Editorial Showcase Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="space-y-16 sm:space-y-20">
            {filteredProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              return (
                <ScrollReveal key={project.id} variant="fade-up" delay={index * 60}>
                  <article
                    className="bg-[#F3F2EE] border border-[#D9D8D3] hover:border-[#151515] transition-all p-6 sm:p-8 lg:p-10 shadow-sm"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                      
                      {/* Visual Media Column */}
                      <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div
                          className="relative group overflow-hidden border border-[#D9D8D3] aspect-[16/10] bg-[#1E1E1E] cursor-pointer"
                          onClick={() => navigate(`/projects/${project.slug}`)}
                        >
                          <img
                            src={project.heroImage}
                            alt={t(project.name)}
                            className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/80 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />

                          {/* Badges Overlay */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                            {project.featured && (
                              <span className="bg-[#F27D26] text-white font-mono-tech text-[10px] px-2 py-0.5 uppercase font-bold tracking-wider">
                                FEATURED PROJECT
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end font-mono-tech text-[11px] text-white">
                            <span className="bg-[#151515]/90 px-2.5 py-1 border border-[#444]">
                              {project.directClient} // {project.period}
                            </span>
                            <span className="bg-white text-[#151515] px-2.5 py-1 font-bold">
                              {lang === 'vi' ? 'XEM CHI TIẾT' : 'DETAILS'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Metadata & Technical Facts Column */}
                      <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                        
                        {/* Top Header */}
                        <div className="flex items-center justify-between border-b border-[#D9D8D3] pb-3">
                          <span className="type-section-label font-medium">
                            PRJ-0{index + 1} / {project.period}
                          </span>
                          <div className="flex flex-wrap gap-1.5 font-sans">
                            {project.services.map((svc, i) => (
                              <span key={i} className="text-[11px] bg-[#E2E1DC] text-[#262626] px-2.5 py-0.5 font-medium rounded-none">
                                {svc}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Project Title */}
                        <div>
                          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#151515] tracking-tight leading-snug">
                            {t(project.name)}
                          </h2>
                          {project.subtitle && (
                            <p className="font-sans text-sm text-[#666] mt-1 italic">
                              {t(project.subtitle)}
                            </p>
                          )}
                        </div>

                        {/* Client Matrix Table */}
                        <div className="grid grid-cols-2 gap-4 bg-[#EAE9E4] p-4 border border-[#D9D8D3]">
                          <div>
                            <span className="type-meta-label block mb-1">
                              {lang === 'vi' ? 'KHÁCH HÀNG TRỰC TIẾP' : 'DIRECT CLIENT'}
                            </span>
                            <span className="type-meta-value text-sm font-medium">{project.directClient}</span>
                          </div>
                          <div>
                            <span className="type-meta-label block mb-1">
                              {lang === 'vi' ? 'QUY MÔ THAM CHIẾU' : 'PROJECT SCALE'}
                            </span>
                            <span className="type-meta-value text-sm text-[#F27D26] font-medium">
                              {project.scaleMetric || t(project.scale)}
                            </span>
                          </div>
                        </div>

                        {/* DEBRIQ Contract Scope */}
                        <div className="space-y-1.5">
                          <span className="type-meta-label block">
                            // {lang === 'vi' ? 'PHẠM VI CÔNG VIỆC THỰC HIỆN' : 'CONTRACTED DEBRIQ SCOPE'}
                          </span>
                          <p className="type-body-base text-sm sm:text-[15px] text-[#3D3D3A] leading-relaxed font-sans">
                            {t(project.scope)}
                          </p>
                        </div>

                        {/* Action Links */}
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => navigate(`/projects/${project.slug}`)}
                            className="inline-flex items-center gap-2 bg-[#151515] hover:bg-[#F27D26] text-white px-5 py-3 font-sans text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
                          >
                            <span>{lang === 'vi' ? 'Xem hồ sơ case study' : 'View case study'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openQuoteModal(project.services[0], t(project.name))}
                            className="inline-flex items-center gap-1.5 border border-[#D9D8D3] hover:border-[#151515] hover:bg-white text-[#262626] px-4 py-3 font-sans text-xs uppercase font-semibold transition-colors cursor-pointer"
                          >
                            <span>{lang === 'vi' ? 'Báo giá tương tự' : 'Similar quote'}</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center text-[#8D8D88] font-mono-tech text-sm">
              {lang === 'vi' ? 'Không tìm thấy dự án phù hợp với bộ lọc.' : 'No projects matched the selected filter.'}
            </div>
          )}

        </div>
      </section>

    </div>
  );
};
