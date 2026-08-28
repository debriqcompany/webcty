import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { 
  ArrowUpRight, 
  ChevronRight,
  Layers,
  Compass,
  Building2,
  Cpu,
  Users
} from 'lucide-react';
import { 
  TechnicalDrawingBeamRebar, 
  TechnicalFinishingDetail, 
  TechnicalBimClashNode, 
  TechnicalBasementMethod 
} from '../../utils/visuals';
import { ScrollReveal } from '../../components/common/ScrollReveal';

// Typewriter Effect Component for Hero Title
const TypewriterHeroTitle: React.FC<{ lang: 'vi' | 'en' }> = ({ lang }) => {
  const line1 = lang === 'vi' ? 'Kỹ thuật' : 'Engineering';
  const line2 = lang === 'vi' ? 'phía sau' : 'behind';
  const line3 = lang === 'vi' ? 'công trình' : 'the build';

  const fullText = `${line1}\n${line2}\n${line3}`;
  const [displayedCount, setDisplayedCount] = React.useState(0);

  React.useEffect(() => {
    setDisplayedCount(0);
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedCount(index);
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 45);
    return () => clearInterval(interval);
  }, [lang, fullText]);

  // Split displayed text into lines
  const currentStr = fullText.slice(0, displayedCount);
  const parts = currentStr.split('\n');
  const curLine1 = parts[0] || '';
  const curLine2 = parts[1] || '';
  const curLine3 = parts[2] || '';
  const isTypingLine3 = displayedCount > (line1.length + line2.length + 1);

  return (
    <h1 className="type-display-hero text-4xl sm:text-6xl lg:text-[72px] xl:text-[78px] mb-6 sm:mb-8 text-[#151515] max-w-xl font-bold font-display leading-[1.05] tracking-tight">
      <span className="block min-h-[1.1em]">
        {curLine1}
        {displayedCount <= line1.length && <span className="text-[#F27D26] animate-pulse">|</span>}
      </span>
      {displayedCount > line1.length && (
        <span className="block min-h-[1.1em]">
          {curLine2}
          {displayedCount > line1.length && !isTypingLine3 && <span className="text-[#F27D26] animate-pulse">|</span>}
        </span>
      )}
      {isTypingLine3 && (
        <span className="block min-h-[1.1em] text-[#F27D26]">
          {curLine3}
          <span className="text-[#F27D26] animate-pulse">|</span>
        </span>
      )}
    </h1>
  );
};

interface HomePageProps {
  navigate: (path: string) => void;
  openQuoteModal: (service?: string, project?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, openQuoteModal }) => {
  const { lang, t } = useLanguage();
  const { projects, services, partners } = useData();

  const featuredProjects = projects.filter(p => p.featured && p.published).slice(0, 6);
  const heroProject = featuredProjects[0] || projects[0];

  return (
    <div className="bg-[#F3F2EE] text-[#151515] min-h-screen">
      
      {/* =========================================================================
          1. IMMERSIVE HERO SECTION (Split Architectural Layout)
          ========================================================================= */}
      <section className="border-b border-[#D9D8D3] bg-[#F3F2EE] relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
          
          {/* Left Column: Bold Typography & Positioning */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-14 lg:border-r border-[#D9D8D3] z-10 bg-[#F3F2EE]">
            <div className="mt-4 sm:mt-6">
              <div className="inline-block px-2.5 py-1 mb-6 text-[11px] font-mono-tech font-medium tracking-[0.1em] bg-[#151515] text-[#F3F2EE] uppercase">
                {lang === 'vi' ? 'HỒ SƠ NĂNG LỰC KỸ THUẬT' : 'TECHNICAL PARTNER'}
              </div>
              
              {/* Typewriter Hero Heading */}
              <TypewriterHeroTitle lang={lang} />

              <p className="type-body-lg text-base sm:text-[18px] text-[#3D3D3A] leading-[1.65] max-w-md font-sans">
                {lang === 'vi'
                  ? 'Đối tác kỹ thuật đồng hành cùng các đơn vị thi công, từ hồ sơ thiết kế đến giai đoạn triển khai thực tế tại công trường.'
                  : 'Technical engineering partner supporting construction contractors, from design blueprints to active on-site execution.'}
              </p>
            </div>

            <div className="flex flex-col gap-8 mt-10">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => openQuoteModal()}
                  className="w-fit px-7 sm:px-9 py-3.5 sm:py-4 bg-[#F27D26] text-white font-semibold text-xs sm:text-sm tracking-[0.06em] uppercase hover:bg-[#151515] transition-colors cursor-pointer inline-flex items-center gap-2.5 shadow-sm font-sans"
                >
                  <span>{lang === 'vi' ? 'NHẬN BÁO GIÁ DỊCH VỤ' : 'GET A QUOTE'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/projects')}
                  className="px-6 py-3.5 sm:py-4 border border-[#151515] text-[#151515] font-semibold text-xs tracking-[0.06em] uppercase hover:bg-[#151515] hover:text-white transition-colors cursor-pointer font-sans"
                >
                  {lang === 'vi' ? 'DỰ ÁN TIÊU BIỂU' : 'VIEW PORTFOLIO'}
                </button>
              </div>

              {/* Scale Metrics Bar */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#D9D8D3]">
                <div>
                  <p className="type-meta-label mb-1">RESOURCES</p>
                  <p className="text-base sm:text-lg font-semibold text-[#151515] font-sans">
                    {lang === 'vi' ? '5+ Kỹ sư' : '5+ Engineers'}
                  </p>
                </div>
                <div>
                  <p className="type-meta-label mb-1">CAPACITY</p>
                  <p className="text-base sm:text-lg font-semibold text-[#151515] font-sans">
                    {lang === 'vi' ? '25+ Cộng tác viên' : '25+ Network'}
                  </p>
                </div>
                <div>
                  <p className="type-meta-label mb-1">LANDMARKS</p>
                  <p className="text-base sm:text-lg font-semibold text-[#F27D26] font-sans">
                    {lang === 'vi' ? '9+ Dự án lớn' : '9+ Projects'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Immersive Visual & Featured Project Display */}
          <div className="w-full lg:w-1/2 relative flex flex-col justify-between bg-[#151515]">
            
            {/* Upper Featured Project Showcase */}
            <div 
              className="flex-1 bg-[#1E1E1E] relative overflow-hidden min-h-[380px] lg:min-h-[460px] flex flex-col justify-between p-8 sm:p-10 cursor-pointer group"
              onClick={() => heroProject && navigate(`/projects/${heroProject.slug}`)}
            >
              {/* Background Project Image with Immersive Treatment */}
              {heroProject?.heroImage && (
                <img
                  src={heroProject.heroImage}
                  alt={t(heroProject.name)}
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700 ease-out"
                />
              )}

              {/* Watermark Numeral */}
              <div className="text-[#F3F2EE] text-[14rem] sm:text-[18rem] lg:text-[22rem] opacity-5 font-black absolute -top-12 -right-10 pointer-events-none select-none font-display">
                01
              </div>

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-[#151515]/50 to-transparent" />

              {/* Top Tag & Project Title */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="inline-block px-2.5 py-1 text-[9px] font-bold tracking-[0.2em] bg-white/10 backdrop-blur-sm border border-white/20 text-white uppercase">
                  {lang === 'vi' ? 'DỰ ÁN TRỌNG ĐIỂM' : 'FEATURED PROJECT'}
                </div>
                <span className="font-mono-tech text-xs text-[#8D8D88] uppercase">
                  {heroProject?.period || '2024 - NAY'}
                </span>
              </div>

              {/* Bottom Project Metadata Details */}
              <div className="relative z-10 space-y-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-3 py-1 border border-white/30 rounded-full text-[9px] text-white uppercase tracking-wider bg-white/10 backdrop-blur-sm font-mono-tech">
                    {heroProject?.category === 'structural' 
                      ? 'Structural Shopdrawing' 
                      : heroProject?.category === 'finishing' 
                      ? 'Finishing Shopdrawing' 
                      : 'BIM / Revit'}
                  </span>
                  <span className="px-3 py-1 border border-[#F27D26]/60 rounded-full text-[9px] text-[#F27D26] uppercase tracking-wider bg-[#F27D26]/10 font-mono-tech">
                    {heroProject?.directClient || 'COTECCONS'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white font-bold tracking-tight drop-shadow-md">
                  {heroProject ? t(heroProject.name) : 'Sân bay quốc tế Long Thành'}
                </h2>

                <p className="text-white/80 text-xs sm:text-sm max-w-lg leading-relaxed line-clamp-2">
                  {heroProject ? t(heroProject.scope) : 'Triển khai Shopdrawing kết cấu nhà ga hàng hóa số 1 và các hạng mục phụ trợ công suất 550,000 tấn/năm.'}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-mono-tech text-[#F27D26] uppercase tracking-wider font-bold group-hover:translate-x-1 transition-transform">
                  <span>{lang === 'vi' ? 'XEM CHI TIẾT HỒ SƠ BẢN VẼ' : 'EXPLORE BLUEPRINTS & SPECS'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Bottom Latest Clients Strip */}
            <div className="h-auto sm:h-[180px] bg-[#151515] p-8 sm:p-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-t border-[#2A2A2A]">
              <div className="flex flex-col gap-3">
                <p className="text-[10px] text-[#8D8D88] tracking-widest uppercase font-mono-tech">
                  {lang === 'vi' ? 'ĐƠN VỊ HỢP TÁC TRỰC TIẾP' : 'LATEST CLIENTS'}
                </p>
                <div className="flex flex-wrap gap-6 items-center">
                  <span className="text-sm font-bold text-white tracking-wider hover:text-[#F27D26] transition-colors cursor-pointer" onClick={() => navigate('/partners')}>
                    COTECCONS
                  </span>
                  <span className="text-sm font-bold text-white tracking-wider hover:text-[#F27D26] transition-colors cursor-pointer" onClick={() => navigate('/partners')}>
                    HANCORP
                  </span>
                  <span className="text-sm font-bold text-white tracking-wider hover:text-[#F27D26] transition-colors cursor-pointer" onClick={() => navigate('/partners')}>
                    TÂN MINH NHÂN
                  </span>
                  <span className="text-sm font-bold text-white tracking-wider hover:text-[#F27D26] transition-colors cursor-pointer" onClick={() => navigate('/partners')}>
                    RICONS
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">
                <button
                  onClick={() => navigate('/projects')}
                  className="w-16 h-16 sm:w-20 sm:h-20 border border-[#D9D8D3]/20 flex items-center justify-center group cursor-pointer hover:border-[#F27D26] hover:bg-[#202020] transition-colors"
                  aria-label="View Project Portfolio"
                >
                  <svg className="w-7 h-7 text-[#F27D26] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </button>
                <p className="text-[9px] text-[#8D8D88] tracking-[0.2em] uppercase font-mono-tech mt-2 hidden sm:block">
                  PORTFOLIO
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          2. CORE POSITIONING & PHILOSOPHY SECTION
          ========================================================================= */}
      <section className="py-20 lg:py-24 border-b border-[#D9D8D3] bg-[#F3F2EE]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-3">
              <ScrollReveal variant="slide-left" delay={0}>
                <span className="type-section-label">
                  01 // {lang === 'vi' ? 'ĐỊNH VỊ KỸ THUẬT' : 'CORE POSITIONING'}
                </span>
                <h2 className="type-h2 text-3xl sm:text-4xl lg:text-[38px] text-[#151515] max-w-lg mt-2">
                  {lang === 'vi'
                    ? 'Kinh nghiệm phối hợp thực chiến trong hệ thống các tổng thầu lớn.'
                    : 'Field-proven coordination in tier-1 contractor workflows.'}
                </h2>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal variant="fade-up" delay={100}>
                <p className="type-body-lg text-lg sm:text-[20px] text-[#222222] leading-[1.6] max-w-2xl font-sans">
                  {lang === 'vi'
                    ? 'DEBRIQ không quảng bá bằng các khẩu hiệu chung chung. Tên dự án thực tế, các tổng thầu đã hợp tác và chất lượng hồ sơ giao nộp tại công trường là bằng chứng rõ ràng nhất về năng lực.'
                    : 'We avoid generic marketing slogans. Authentic project names, verified direct clients, genuine scopes, and site-tested shopdrawings are our primary evidence of engineering competence.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  
                  <div className="border-l-2 border-[#F27D26] pl-5 space-y-2">
                    <h3 className="type-meta-label text-xs tracking-[0.14em] text-[#151515]">
                      {lang === 'vi' ? 'PHỐI HỢP TRỰC TIẾP TẠI CÔNG TRƯỜNG' : 'DIRECT JOBSITE INTEGRATION'}
                    </h3>
                    <p className="type-body-base text-sm text-[#444] leading-relaxed">
                      {lang === 'vi'
                        ? 'Khả năng phối hợp trực tiếp với Ban chỉ huy công trường, các nhà thầu chuyên ngành và bộ phận thiết kế/kỹ thuật trong toàn bộ quá trình xử lý hồ sơ.'
                        : 'Seamless day-to-day coordination with Project Management Boards, Subcontractors, and Design Engineering teams.'}
                    </p>
                  </div>

                  <div className="border-l-2 border-[#151515] pl-5 space-y-2">
                    <h3 className="type-meta-label text-xs tracking-[0.14em] text-[#151515]">
                      {lang === 'vi' ? 'MẠNG LƯỚI NGUỒN LỰC LINH HOẠT' : 'SCALABLE RESOURCE NETWORK'}
                    </h3>
                    <p className="type-body-base text-sm text-[#444] leading-relaxed">
                      {lang === 'vi'
                        ? 'Đội ngũ kỹ sư nòng cốt kết hợp cùng 25+ cộng tác viên chuyên sâu cho phép DEBRIQ mở rộng năng lực xử lý hồ sơ đáp ứng những đợt giao nộp gấp.'
                        : 'A core team of 5+ senior engineers backed by 25+ specialist collaborators empowers fast ramp-up for critical delivery milestones.'}
                    </p>
                  </div>

                </div>
              </ScrollReveal>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. FEATURED PROJECTS SHOWCASE (Immersive Architectural Grid)
          ========================================================================= */}
      <section className="py-20 lg:py-24 border-b border-[#D9D8D3] bg-[#EAE9E4]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Section Header */}
          <ScrollReveal variant="fade-up" delay={0}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#D9D8D3] pb-6 mb-12 gap-4">
              <div>
                <span className="type-section-label mb-1">
                  02 / {lang === 'vi' ? 'DỰ ÁN TIÊU BIỂU' : 'FEATURED BUILDS'}
                </span>
                <h2 className="type-h2 text-3xl sm:text-4xl text-[#151515]">
                  {lang === 'vi' ? 'Hồ sơ dự án thực tế' : 'Verified Project Portfolio'}
                </h2>
              </div>
              
              <button
                onClick={() => navigate('/projects')}
                className="inline-flex items-center gap-2 type-nav text-[#151515] hover:text-[#F27D26] transition-colors cursor-pointer font-sans"
              >
                <span>{lang === 'vi' ? 'Xem toàn bộ 9 dự án' : 'View all 9 projects'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

          {/* Project List */}
          <div className="space-y-12">
            {featuredProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              return (
                <ScrollReveal key={project.id} variant="fade-up" delay={index * 100}>
                  <div 
                    className="bg-[#F3F2EE] border border-[#D9D8D3] hover:border-[#151515] transition-all p-6 sm:p-8 lg:p-10 relative overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      
                      {/* Project Metadata & Scope Column */}
                      <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                        
                        <div className="flex items-center justify-between border-b border-[#D9D8D3] pb-3">
                          <span className="type-section-label">
                            0{index + 1} / {project.period}
                          </span>
                          <div className="flex flex-wrap gap-1.5 font-sans">
                            {project.services.map((svc, i) => (
                              <span key={i} className="text-[11px] bg-[#E2E1DC] text-[#262626] px-2.5 py-0.5 font-medium rounded-none">
                                {svc}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="type-h3 text-2xl sm:text-3xl text-[#151515] font-semibold">
                            {t(project.name)}
                          </h3>
                          {project.subtitle && (
                            <p className="type-body-sm text-[#666] mt-1 italic font-sans">
                              {t(project.subtitle)}
                            </p>
                          )}
                        </div>

                        {/* Client & Scale Matrix */}
                        <div className="grid grid-cols-2 gap-4 bg-[#EAE9E4] p-4 border border-[#D9D8D3]">
                          <div>
                            <span className="type-meta-label block mb-1">{lang === 'vi' ? 'KHÁCH HÀNG TRỰC TIẾP' : 'DIRECT CLIENT'}</span>
                            <span className="type-meta-value text-sm font-medium">{project.directClient}</span>
                          </div>
                          <div>
                            <span className="type-meta-label block mb-1">{lang === 'vi' ? 'QUY MÔ THAM CHIẾU' : 'PROJECT SCALE'}</span>
                            <span className="type-meta-value text-sm text-[#F27D26] font-medium">{project.scaleMetric || t(project.scale)}</span>
                          </div>
                        </div>

                        {/* Scope Summary */}
                        <div className="space-y-1.5">
                          <span className="type-meta-label block">
                            // {lang === 'vi' ? 'PHẠM VI THỰC HIỆN' : 'CONTRACTED SCOPE'}
                          </span>
                          <p className="type-body-base text-sm sm:text-[15px] text-[#3D3D3A] leading-relaxed max-w-xl font-sans">
                            {t(project.scope)}
                          </p>
                        </div>

                        {/* Link to Case Study */}
                        <div className="pt-2">
                          <button
                            onClick={() => navigate(`/projects/${project.slug}`)}
                            className="inline-flex items-center gap-2 bg-[#151515] hover:bg-[#F27D26] text-white px-5 py-3 font-sans text-xs tracking-wider uppercase font-semibold transition-colors cursor-pointer"
                          >
                            <span>{lang === 'vi' ? 'Chi tiết dự án & hồ sơ bản vẽ' : 'View case study & drawings'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>

                      {/* Project Large Photography & Visual */}
                      <div className={`lg:col-span-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                        <div 
                          className="relative group overflow-hidden border border-[#D9D8D3] aspect-[16/10] bg-[#1E1E1E] cursor-pointer"
                          onClick={() => navigate(`/projects/${project.slug}`)}
                        >
                          <img
                            src={project.heroImage}
                            alt={t(project.name)}
                            className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                          
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end font-mono-tech text-[11px] text-white">
                            <span className="bg-[#151515]/90 px-2.5 py-1 border border-[#444]">
                              {project.directClient} // {project.period}
                            </span>
                            <span className="bg-[#F27D26] px-2.5 py-1 text-white font-medium">
                              CASE STUDY
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Bottom Button to View Full 9 Projects */}
          <ScrollReveal variant="fade-up" delay={200}>
            <div className="text-center pt-12">
              <button
                onClick={() => navigate('/projects')}
                className="inline-flex items-center gap-3 bg-[#F27D26] hover:bg-[#151515] text-white px-8 py-4 font-semibold text-xs tracking-widest uppercase transition-all shadow-md cursor-pointer font-sans"
              >
                <span>{lang === 'vi' ? 'XEM TOÀN BỘ 9 DỰ ÁN TRONG PORTFOLIO' : 'EXPLORE ALL 9 PROJECTS IN PORTFOLIO'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =========================================================================
          4. 4 TECHNICAL SERVICES SECTION
          ========================================================================= */}
      <section className="py-20 lg:py-24 border-b border-[#D9D8D3] bg-[#F3F2EE]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <ScrollReveal variant="fade-up" delay={0}>
            <div className="border-b border-[#D9D8D3] pb-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <span className="type-section-label mb-1">
                  03 / {lang === 'vi' ? 'DỊCH VỤ CHUYÊN MÔN' : 'CORE SERVICES'}
                </span>
                <h2 className="type-h2 text-3xl sm:text-4xl text-[#151515]">
                  {lang === 'vi' ? '4 nhóm dịch vụ kỹ thuật' : '4 Core Technical Disciplines'}
                </h2>
              </div>
              <p className="type-body-base text-base text-[#555] max-w-md font-sans">
                {lang === 'vi'
                  ? 'Quy trình kiểm soát chất lượng hồ sơ nghiêm ngặt, bám sát tiêu chuẩn xây dựng và điều kiện thi công tại công trường.'
                  : 'Rigorous drawing QA/QC processes aligned with construction codes and jobsite execution constraints.'}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Service 1: Structural */}
            <ScrollReveal variant="fade-up" delay={50}>
              <div className="bg-[#EAE9E4] border border-[#D9D8D3] p-8 space-y-6 flex flex-col justify-between hover:border-[#151515] transition-colors h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-start font-mono-tech text-xs">
                    <span className="text-[#F27D26] font-medium">01 / STRUCTURAL</span>
                    <span className="text-[#767670]">AutoCAD • KataPro • Revit</span>
                  </div>
                  <h3 className="type-h3 text-2xl text-[#151515] font-semibold">
                    {lang === 'vi' ? 'Shopdrawing kết cấu' : 'Structural Shopdrawing'}
                  </h3>
                  <p className="type-body-base text-sm text-[#444] leading-relaxed font-sans">
                    {lang === 'vi'
                      ? 'Triển khai bản vẽ Shopdrawing kết cấu bê tông cốt thép phục vụ thi công dựa trên hồ sơ thiết kế được phê duyệt. Kinh nghiệm từ công trình cao tầng, khu đô thị đến hạ tầng hàng không.'
                      : 'Comprehensive reinforced concrete shopdrawings for high-rise, townships, and airport infrastructure.'}
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#555] border-t border-[#D9D8D3] pt-4 font-sans">
                    <li>• Mặt bằng bố trí thép móng, dầm, cột, vách, sàn</li>
                    <li>• Bảng thống kê thép & cắt uốn (BBS) tối ưu hao hụt</li>
                    <li>• Chi tiết nút khung, dầm chuyển và mạch ngừng đổ bê tông</li>
                  </ul>
                </div>
                <button
                  onClick={() => navigate('/services')}
                  className="inline-flex items-center gap-2 text-[#F27D26] text-xs font-semibold uppercase hover:underline cursor-pointer font-sans pt-4"
                >
                  <span>{lang === 'vi' ? 'Xem quy trình kết cấu' : 'View structural workflow'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>

            {/* Service 2: Finishing */}
            <ScrollReveal variant="fade-up" delay={150}>
              <div className="bg-[#EAE9E4] border border-[#D9D8D3] p-8 space-y-6 flex flex-col justify-between hover:border-[#151515] transition-colors h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-start font-mono-tech text-xs">
                    <span className="text-[#F27D26] font-medium">02 / FINISHING</span>
                    <span className="text-[#767670]">AutoCAD • Revit Arch</span>
                  </div>
                  <h3 className="type-h3 text-2xl text-[#151515] font-semibold">
                    {lang === 'vi' ? 'Shopdrawing hoàn thiện' : 'Finishing Shopdrawing'}
                  </h3>
                  <p className="type-body-base text-sm text-[#444] leading-relaxed font-sans">
                    {lang === 'vi'
                      ? 'Triển khai Shopdrawing các hạng mục hoàn thiện kiến trúc: Xây, Tô, Cán nền, Ốp lát, Trần, Sơn và các chi tiết tiếp giáp vật liệu liên quan.'
                      : 'Detailed shopdrawings for masonry, plastering, floor screeds, tiling patterns, ceiling frameworks, and paint details.'}
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#555] border-t border-[#D9D8D3] pt-4 font-sans">
                    <li>• Định vị tường xây, bổ trụ, giằng tường, lanh-tô</li>
                    <li>• Mặt bằng chia ron gạch, mốc ốp lát, dốc sàn thoát nước</li>
                    <li>• Chi tiết giật cấp trần thạch cao & khe hắt đèn</li>
                  </ul>
                </div>
                <button
                  onClick={() => navigate('/services')}
                  className="inline-flex items-center gap-2 text-[#F27D26] text-xs font-semibold uppercase hover:underline cursor-pointer font-sans pt-4"
                >
                  <span>{lang === 'vi' ? 'Xem quy trình hoàn thiện' : 'View finishing workflow'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>

            {/* Service 3: BIM / Revit */}
            <ScrollReveal variant="fade-up" delay={200}>
              <div className="bg-[#EAE9E4] border border-[#D9D8D3] p-8 space-y-6 flex flex-col justify-between hover:border-[#151515] transition-colors h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-start font-mono-tech text-xs">
                    <span className="text-[#F27D26] font-medium">03 / BIM & REVIT</span>
                    <span className="text-[#767670]">Revit • Navisworks</span>
                  </div>
                  <h3 className="type-h3 text-2xl text-[#151515] font-semibold">
                    {lang === 'vi' ? 'BIM / Revit' : 'BIM / Revit Services'}
                  </h3>
                  <p className="type-body-base text-sm text-[#444] leading-relaxed font-sans">
                    {lang === 'vi'
                      ? 'Dựng mô hình BIM từ hồ sơ thiết kế, phối hợp và kiểm tra xung đột không gian (Clash Detection), xuất bản vẽ thi công trực tiếp từ Revit.'
                      : '3D BIM modeling from 2D designs, multi-trade spatial clash detection, and direct documentation generation.'}
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#555] border-t border-[#D9D8D3] pt-4 font-sans">
                    <li>• Dựng Model Kết cấu & Kiến trúc chuẩn LOD 350</li>
                    <li>• Kiểm tra va chạm dầm - lỗ mở cơ điện (MEP)</li>
                    <li>• Xuất bản vẽ và bóc tách khối lượng tham số tự động</li>
                  </ul>
                </div>
                <button
                  onClick={() => navigate('/services')}
                  className="inline-flex items-center gap-2 text-[#F27D26] text-xs font-semibold uppercase hover:underline cursor-pointer font-sans pt-4"
                >
                  <span>{lang === 'vi' ? 'Xem năng lực BIM' : 'View BIM capability'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>

            {/* Service 4: Construction Method */}
            <ScrollReveal variant="fade-up" delay={250}>
              <div className="bg-[#EAE9E4] border border-[#D9D8D3] p-8 space-y-6 flex flex-col justify-between hover:border-[#151515] transition-colors h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-start font-mono-tech text-xs">
                    <span className="text-[#F27D26] font-medium">04 / METHOD & LOGISTICS</span>
                    <span className="text-[#767670]">AutoCAD • Etabs • SAP</span>
                  </div>
                  <h3 className="type-h3 text-2xl text-[#151515] font-semibold">
                    {lang === 'vi' ? 'Biện pháp thi công' : 'Construction Method'}
                  </h3>
                  <p className="type-body-base text-sm text-[#444] leading-relaxed font-sans">
                    {lang === 'vi'
                      ? 'Bản vẽ biện pháp thi công kết cấu, biện pháp tầng hầm (Top-down / Semi Top-down), mặt bằng tổng thể tổ chức thi công, cẩu tháp, trình tự thi công.'
                      : 'Deep basement construction methods (Top-down, Semi Top-down), heavy falsework design, and site logistics layouts.'}
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#555] border-t border-[#D9D8D3] pt-4 font-sans">
                    <li>• Biện pháp tầng hầm sâu & hệ giằng chống kingpost</li>
                    <li>• Mặt bằng định vị cẩu tháp, vận thăng, kho bãi</li>
                    <li>• Sơ đồ phân đợt và trình tự đổ bê tông</li>
                  </ul>
                </div>
                <button
                  onClick={() => navigate('/services')}
                  className="inline-flex items-center gap-2 text-[#F27D26] text-xs font-semibold uppercase hover:underline cursor-pointer font-sans pt-4"
                >
                  <span>{lang === 'vi' ? 'Xem biện pháp thi công' : 'View method statements'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* =========================================================================
          5. DIRECT CLIENTS & CONTRACTOR NETWORK STRIP
          ========================================================================= */}
      <section className="py-16 lg:py-20 border-b border-[#D9D8D3] bg-[#F3F2EE]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <ScrollReveal variant="fade-up" delay={0}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#D9D8D3] pb-4 mb-8 gap-2">
              <div>
                <span className="type-section-label mb-1">
                  04 / {lang === 'vi' ? 'ĐỐI TÁC & KHÁCH HÀNG' : 'CLIENTS & PARTNERS'}
                </span>
                <h2 className="type-h2 text-2xl sm:text-3xl text-[#151515]">
                  {lang === 'vi' ? 'Đồng hành cùng các tổng thầu & nhà thầu' : 'Collaborating With Leading Contractors'}
                </h2>
              </div>
              <button
                onClick={() => navigate('/partners')}
                className="text-xs type-nav text-[#767670] hover:text-[#151515] underline cursor-pointer font-sans"
              >
                {lang === 'vi' ? 'Xem chi tiết quan hệ hợp tác' : 'View partner details'}
              </button>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((partner, pIndex) => (
              <ScrollReveal key={partner.id} variant="fade-up" delay={pIndex * 60}>
                <div 
                  className="border border-[#D9D8D3] bg-[#EAE9E4] p-5 text-center flex flex-col justify-center items-center hover:border-[#151515] transition-colors group min-h-[110px] h-full"
                >
                  <span className="font-display font-bold text-base sm:text-lg text-[#151515] tracking-tight group-hover:text-[#F27D26] transition-colors">
                    {partner.logoText}
                  </span>
                  <span className="type-meta-label text-[10px] text-[#767670] mt-1 leading-tight">
                    {t(partner.roleLabel)}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal variant="fade-up" delay={200}>
            <div className="mt-6 p-4 bg-[#EAE9E4] border border-[#D9D8D3] flex items-center gap-3 text-xs text-[#555] font-sans">
              <span className="w-2 h-2 bg-[#F27D26] shrink-0" />
              <span>
                {lang === 'vi'
                  ? 'DEBRIQ phân định minh bạch giữa Khách hàng trực tiếp giao việc và Tổng thầu / Chủ đầu tư dự án nhằm đảm bảo tính xác thực thông tin.'
                  : 'DEBRIQ strictly distinguishes between Direct Contracting Clients and Master Project Developers to preserve partner confidentiality.'}
              </span>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =========================================================================
          6. DUAL CALL TO ACTION BANNER (Immersive Dark)
          ========================================================================= */}
      <section className="py-20 lg:py-24 bg-[#151515] text-[#F3F2EE] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Card: Request a Quote */}
            <ScrollReveal variant="slide-left" delay={50}>
              <div className="border border-[#333] bg-[#1C1C1C] p-8 sm:p-10 space-y-6">
                <span className="type-section-label">
                  // {lang === 'vi' ? 'DÀNH CHO TỔNG THẦU & NHÀ THẦU' : 'FOR GENERAL CONTRACTORS'}
                </span>
                <h3 className="type-h3 text-2xl sm:text-3xl text-[#F3F2EE] font-semibold">
                  {lang === 'vi' ? 'Gửi yêu cầu báo giá kỹ thuật' : 'Request a Technical Quotation'}
                </h3>
                <p className="type-body-base text-sm text-[#A0A09A] leading-relaxed max-w-md font-sans">
                  {lang === 'vi'
                    ? 'Gửi thông tin quy mô công trình, tiến độ yêu cầu và phạm vi gói thầu để nhận đề xuất kỹ thuật và báo giá chi tiết từ DEBRIQ.'
                    : 'Submit project parameters, milestones, and scope specifications for rapid technical proposal and pricing.'}
                </p>
                <button
                  onClick={() => openQuoteModal()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F27D26] hover:bg-[#151515] hover:border hover:border-[#F27D26] text-white py-4 font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer font-sans"
                >
                  <span>{lang === 'vi' ? 'GỬI YÊU CẦU BÁO GIÁ' : 'REQUEST A QUOTE'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </ScrollReveal>

            {/* Right Card: Join Engineer Network */}
            <ScrollReveal variant="slide-right" delay={150}>
              <div className="border border-[#333] bg-[#1C1C1C] p-8 sm:p-10 space-y-6">
                <span className="type-section-label">
                  // {lang === 'vi' ? 'DÀNH CHO KỸ SƯ & CỘNG TÁC VIÊN' : 'FOR ENGINEERS & COLLABORATORS'}
                </span>
                <h3 className="type-h3 text-2xl sm:text-3xl text-[#F3F2EE] font-semibold">
                  {lang === 'vi' ? 'Gia nhập mạng lưới kỹ sư' : 'Join the Engineer Network'}
                </h3>
                <p className="type-body-base text-sm text-[#A0A09A] leading-relaxed max-w-md font-sans">
                  {lang === 'vi'
                    ? 'Cơ hội hợp tác lâu dài cùng DEBRIQ trên các dự án quy mô lớn (Sân bay, Đại đô thị cao tầng), nâng cao kinh nghiệm và phát triển chuyên môn.'
                    : 'Long-term partnership opportunities on landmark mega-projects (Airports, High-rise Townships) with competitive earnings.'}
                </p>
                <button
                  onClick={() => navigate('/join-debriq')}
                  className="w-full inline-flex items-center justify-center gap-2 border border-[#555] hover:border-white text-white hover:bg-[#2A2A2A] py-4 font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer font-sans"
                >
                  <span>{lang === 'vi' ? 'GIA NHẬP MẠNG LƯỚI KỸ SƯ DEBRIQ' : 'APPLY TO JOIN NETWORK'}</span>
                  <ChevronRight className="w-4 h-4 text-[#8D8D88]" />
                </button>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

    </div>
  );
};
