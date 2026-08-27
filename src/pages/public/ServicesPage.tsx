import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { 
  ArrowUpRight, 
  Check
} from 'lucide-react';
import { 
  TechnicalDrawingBeamRebar, 
  TechnicalFinishingDetail, 
  TechnicalBimClashNode, 
  TechnicalBasementMethod 
} from '../../utils/visuals';

interface ServicesPageProps {
  navigate: (path: string) => void;
  openQuoteModal: (service?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate, openQuoteModal }) => {
  const { lang } = useLanguage();
  const { services } = useData();

  const workflowSteps = [
    {
      num: '01',
      titleVi: 'Tiếp nhận hồ sơ & Khảo sát yêu cầu',
      titleEn: 'Blueprint Intake & Site Requirements',
      descVi: 'Tiếp nhận hồ sơ thiết kế cơ sở/bản vẽ thi công, tiêu chuẩn kỹ thuật (Spec) và tiến độ các đợt đổ bê tông/hoàn thiện từ Ban chỉ huy.',
      descEn: 'Receiving approved design blueprints, project specifications, and staged milestone schedule from Site Management.'
    },
    {
      num: '02',
      titleVi: 'Rà soát xung đột & Lập RFI',
      titleEn: 'Conflict Review & Technical RFI',
      descVi: 'Kiểm tra xung đột hình học, sai lệch cao độ giữa Kiến trúc - Kết cấu - Cơ điện; phát hành RFI bằng văn bản gửi Tư vấn thiết kế & TVGS.',
      descEn: 'Cross-checking geometry discrepancies across Arch-Struct-MEP disciplines and issuing formal RFIs for resolution.'
    },
    {
      num: '03',
      titleVi: 'Triển khai Shopdrawing & Bóc tách BBS',
      titleEn: 'Shopdrawing Drafting & BBS Optimization',
      descVi: 'Mô hình hóa chi tiết cốt thép, nút khung dầm cột, chia ron hoàn thiện; xuất bảng thống kê cốt thép (BBS) tối ưu chiều dài cắt để giảm hao hụt.',
      descEn: 'Drafting millimeter-precise rebar layouts and generating Bar Bending Schedules optimized to minimize steel cutting waste.'
    },
    {
      num: '04',
      titleVi: 'Kiểm soát nội bộ 2 cấp (QA/QC)',
      titleEn: '2-Tier Senior QA/QC Review',
      descVi: 'Kỹ sư trưởng rà soát đối chiếu tiêu chuẩn TCVN, tính khả thi thi công thực tế tại công trường trước khi xuất bản hồ sơ.',
      descEn: 'Lead structural engineers cross-audit drawings against TCVN codes and real-world construction tolerances.'
    },
    {
      num: '05',
      titleVi: 'Bàn giao & Đồng hành nghiệm thu',
      titleEn: 'Handover & Field Inspection Support',
      descVi: 'Bàn giao file DWG/PDF, hỗ trợ giải trình bảo vệ hồ sơ với Tư vấn giám sát và hỗ trợ kỹ thuật nghiệm thu thực tế trên công trường.',
      descEn: 'Delivering final CAD/PDF sets, supporting drawing approval with Supervision Consultants, and assisting field inspections.'
    }
  ];

  return (
    <div className="bg-[#F3F2EE] min-h-screen text-[#151515] font-display selection:bg-[#F27D26] selection:text-white">
      
      {/* Header Banner */}
      <section className="border-b border-[#D9D8D3] bg-[#EAE9E4] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono-tech text-xs tracking-widest text-[#F27D26] uppercase block font-bold">
              // {lang === 'vi' ? 'NĂNG LỰC DỊCH VỤ CHUYÊN MÔN' : 'SPECIALIZED ENGINEERING CAPABILITIES'}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#151515] uppercase leading-none">
              {lang === 'vi' ? 'DỊCH VỤ KỸ THUẬT' : 'TECHNICAL SERVICES'}
            </h1>
            <p className="font-sans text-lg text-[#555] leading-relaxed">
              {lang === 'vi'
                ? 'Giải pháp Shopdrawing kết cấu, hoàn thiện, mô hình thông tin công trình BIM/Revit và hồ sơ biện pháp thi công. Triển khai chuẩn xác theo tiến độ dự án.'
                : 'Full-spectrum shopdrawing drafting, BIM modeling, and construction method engineering designed for high-density site execution.'}
            </p>
          </div>
        </div>
      </section>

      {/* 4 Core Services In-Depth Sections */}
      <section className="py-16 sm:py-20 border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-24">
          
          {/* Service 1: Structural RC */}
          <div id="structural" className="scroll-mt-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono-tech text-xs bg-[#F27D26] text-white px-2.5 py-1 font-bold">
                    SERVICE // 01
                  </span>
                  <span className="font-mono-tech text-xs text-[#8D8D88] uppercase">
                    AutoCAD • KataPro • Revit
                  </span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#151515]">
                  {lang === 'vi' ? 'Shopdrawing Kết Cấu Bê Tông Cốt Thép' : 'Reinforced Concrete Structural Shopdrawing'}
                </h2>

                <p className="font-sans text-base sm:text-lg text-[#333] leading-relaxed">
                  {lang === 'vi'
                    ? 'Triển khai bản vẽ Shopdrawing kết cấu phục vụ gia công cốt thép và đổ bê tông trực tiếp tại công trường. Hồ sơ tuân thủ tiêu chuẩn TCVN 5574:2018, bảo đảm tính khả thi thi công tại các nút giao rebar mật độ cao.'
                    : 'Field-ready structural reinforced concrete shopdrawings conforming to TCVN 5574:2018. Designed to eliminate rebar congestion at dense beam-column intersections.'}
                </p>

                <div className="space-y-3 font-mono-tech text-xs text-[#444] bg-[#EAE9E4] p-5 border border-[#D9D8D3]">
                  <span className="font-bold text-[#151515] uppercase block mb-1">
                    {lang === 'vi' ? 'HỒ SƠ BÀN GIAO BAO GỒM:' : 'STANDARD DELIVERABLES:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Shopdrawing móng, đài cọc, giằng móng</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Shopdrawing cột, vách thang máy</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Shopdrawing dầm, sàn ứng lực / RC</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Bảng thống kê thép (BBS) tối ưu cắt</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => openQuoteModal('Shopdrawing kết cấu')}
                    className="inline-flex items-center gap-2 bg-[#151515] hover:bg-[#F27D26] text-white px-6 py-3.5 font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    <span>{lang === 'vi' ? 'YÊU CẦU BÁO GIÁ KẾT CẤU' : 'REQUEST STRUCTURAL QUOTE'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="border-2 border-[#151515] bg-[#181818] p-2 shadow-xl">
                  <TechnicalDrawingBeamRebar />
                </div>
              </div>

            </div>
          </div>

          {/* Service 2: Finishing */}
          <div id="finishing" className="scroll-mt-28 border-t border-[#D9D8D3] pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 lg:order-2 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono-tech text-xs bg-[#F27D26] text-white px-2.5 py-1 font-bold">
                    SERVICE // 02
                  </span>
                  <span className="font-mono-tech text-xs text-[#8D8D88] uppercase">
                    AutoCAD • Architectural Drafting
                  </span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#151515]">
                  {lang === 'vi' ? 'Shopdrawing Hoàn Thiện Kiến Trúc' : 'Architectural Finishing Shopdrawing'}
                </h2>

                <p className="font-sans text-base sm:text-lg text-[#333] leading-relaxed">
                  {lang === 'vi'
                    ? 'Triển khai chi tiết từng lớp hoàn thiện cho các công trình cao ốc, đại đô thị và khách sạn cao cấp. Kiểm soát mốc cao độ sàn, mạch ốp lát, khe co giãn và liên kết vật liệu.'
                    : 'Millimeter-grade detailing of all architectural finishes: masonry layouts, screed slopes, tile modulation grids, suspended ceiling framing, and waterproofing upstands.'}
                </p>

                <div className="space-y-3 font-mono-tech text-xs text-[#444] bg-[#EAE9E4] p-5 border border-[#D9D8D3]">
                  <span className="font-bold text-[#151515] uppercase block mb-1">
                    {lang === 'vi' ? 'HỒ SƠ BÀN GIAO BAO GỒM:' : 'STANDARD DELIVERABLES:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Định vị tường xây, lanh-tô, bổ trụ</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Mặt bằng chia ron gạch & mốc ốp lát</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Chi tiết trần thạch cao & khe hắt</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Chi tiết chống thấm & len chân tường</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => openQuoteModal('Shopdrawing hoàn thiện')}
                    className="inline-flex items-center gap-2 bg-[#151515] hover:bg-[#F27D26] text-white px-6 py-3.5 font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    <span>{lang === 'vi' ? 'YÊU CẦU BÁO GIÁ HOÀN THIỆN' : 'REQUEST FINISHING QUOTE'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 lg:order-1">
                <div className="border-2 border-[#151515] bg-[#181818] p-2 shadow-xl">
                  <TechnicalFinishingDetail />
                </div>
              </div>

            </div>
          </div>

          {/* Service 3: BIM / Revit */}
          <div id="bim" className="scroll-mt-28 border-t border-[#D9D8D3] pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono-tech text-xs bg-[#F27D26] text-white px-2.5 py-1 font-bold">
                    SERVICE // 03
                  </span>
                  <span className="font-mono-tech text-xs text-[#8D8D88] uppercase">
                    Revit • Navisworks • BIM 360
                  </span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#151515]">
                  {lang === 'vi' ? 'Dịch Vụ BIM / Revit & Kiểm Soát Xung Đột' : 'BIM / Revit & Clash Detection'}
                </h2>

                <p className="font-sans text-base sm:text-lg text-[#333] leading-relaxed">
                  {lang === 'vi'
                    ? 'Dựng mô hình thông tin công trình BIM (LOD 300 - LOD 350) cho phần Kết cấu và Kiến trúc. Rà soát phát hiện xung đột không gian với hệ thống Cơ điện (MEP) trước khi thi công thực tế.'
                    : 'BIM modeling at LOD 300-350 for Structure and Architecture. Navisworks multi-trade clash detection ensuring zero spatial collisions on site.'}
                </p>

                <div className="space-y-3 font-mono-tech text-xs text-[#444] bg-[#EAE9E4] p-5 border border-[#D9D8D3]">
                  <span className="font-bold text-[#151515] uppercase block mb-1">
                    {lang === 'vi' ? 'HỒ SƠ BÀN GIAO BAO GỒM:' : 'STANDARD DELIVERABLES:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Model Revit Structure & Architecture LOD 350</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Báo cáo va chạm Navisworks Clash Report</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Bản vẽ 2D xuất trực tiếp từ Revit</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Bóc tách khối lượng tham số từ Model</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => openQuoteModal('BIM / Revit')}
                    className="inline-flex items-center gap-2 bg-[#151515] hover:bg-[#F27D26] text-white px-6 py-3.5 font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    <span>{lang === 'vi' ? 'YÊU CẦU BÁO GIÁ BIM/REVIT' : 'REQUEST BIM QUOTE'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="border-2 border-[#151515] bg-[#181818] p-2 shadow-xl">
                  <TechnicalBimClashNode />
                </div>
              </div>

            </div>
          </div>

          {/* Service 4: Construction Method */}
          <div id="method" className="scroll-mt-28 border-t border-[#D9D8D3] pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6 lg:order-2 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono-tech text-xs bg-[#F27D26] text-white px-2.5 py-1 font-bold">
                    SERVICE // 04
                  </span>
                  <span className="font-mono-tech text-xs text-[#8D8D88] uppercase">
                    AutoCAD • Construction Engineering
                  </span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#151515]">
                  {lang === 'vi' ? 'Biện Pháp Thi Công & Tầng Hầm Top-down' : 'Construction Method Statements & Top-down'}
                </h2>

                <p className="font-sans text-base sm:text-lg text-[#333] leading-relaxed">
                  {lang === 'vi'
                    ? 'Lập hồ sơ biện pháp thi công cho phần ngầm phức tạp (Semi Top-down, Top-down, Kingpost, Strutting) và biện pháp thi công thân công trình cao tầng.'
                    : 'Method statements and engineered shopdrawings for deep basements, diaphragm walls, steel strutting, and site logistics planning.'}
                </p>

                <div className="space-y-3 font-mono-tech text-xs text-[#444] bg-[#EAE9E4] p-5 border border-[#D9D8D3]">
                  <span className="font-bold text-[#151515] uppercase block mb-1">
                    {lang === 'vi' ? 'HỒ SƠ BÀN GIAO BAO GỒM:' : 'STANDARD DELIVERABLES:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Biện pháp đào hầm & hệ shoring/kingpost</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Mặt bằng bố trí cẩu tháp & vận thăng</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Sơ đồ phân đợt đổ bê tông khối lớn</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                      <span>Hệ giàn giáo bao che & an toàn lao động</span>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => openQuoteModal('Biện pháp thi công')}
                    className="inline-flex items-center gap-2 bg-[#151515] hover:bg-[#F27D26] text-white px-6 py-3.5 font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    <span>{lang === 'vi' ? 'YÊU CẦU BÁO GIÁ BIỆN PHÁP' : 'REQUEST METHOD QUOTE'}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 lg:order-1">
                <div className="border-2 border-[#151515] bg-[#181818] p-2 shadow-xl">
                  <TechnicalBasementMethod />
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5-Step Quality Assurance Process */}
      <section className="py-20 lg:py-28 bg-[#EAE9E4] border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="border-b border-[#D9D8D3] pb-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="font-mono-tech text-xs tracking-widest text-[#F27D26] uppercase block mb-1 font-bold">
                // {lang === 'vi' ? 'QUY TRÌNH PHỐI HỢP & QA/QC' : '5-STAGE ENGINEERING WORKFLOW'}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-[#151515] uppercase tracking-tight">
                {lang === 'vi' ? '5 BƯỚC TRIỂN KHAI HỒ SƠ DEBRIQ' : 'THE 5-STEP DRAWING DELIVERY PROCESS'}
              </h2>
            </div>
            <p className="font-mono-tech text-xs text-[#666] max-w-sm">
              TCVN 5574:2018 • ISO 9001 QUALITY AUDIT • REAL-TIME SITE COLLABORATION
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {workflowSteps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-[#F3F2EE] border border-[#D9D8D3] p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="font-display font-black text-2xl text-[#F27D26]">
                    {step.num}
                  </span>
                  <h3 className="font-display font-bold text-base text-[#151515] uppercase leading-snug">
                    {lang === 'vi' ? step.titleVi : step.titleEn}
                  </h3>
                  <p className="text-xs text-[#555] leading-relaxed">
                    {lang === 'vi' ? step.descVi : step.descEn}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#D9D8D3] font-mono-tech text-[10px] text-[#888]">
                  STAGE {step.num} OF 05
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
