import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { 
  Users, 
  Layers,
  Building,
  CheckCircle,
  FileText
} from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
  openQuoteModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = () => {
  const { lang } = useLanguage();
  const { pages, settings } = useData();

  const page = pages?.['about'];

  const titleStr = typeof page?.title === 'object'
    ? (lang === 'vi' ? page.title.vi : (page.title.en || page.title.vi))
    : (page?.title || (lang === 'vi' ? 'Về chúng tôi — DEBRIQ' : 'About DEBRIQ Engineering'));

  const subtitleStr = typeof page?.subtitle === 'object'
    ? (lang === 'vi' ? page.subtitle.vi : (page.subtitle.en || page.subtitle.vi))
    : (page?.subtitle || (lang === 'vi' ? 'HỒ SƠ NĂNG LỰC DOANH NGHIỆP' : 'COMPANY PROFILE & BACKGROUND'));

  const descStr = typeof page?.description === 'object'
    ? (lang === 'vi' ? page.description.vi : (page.description.en || page.description.vi))
    : (page?.description || (lang === 'vi'
        ? 'Đội ngũ kỹ sư chuyên sâu về Shopdrawing kết cấu, hoàn thiện, BIM/Revit và biện pháp thi công. Đồng hành cùng các nhà thầu và dự án lớn từ năm 2022.'
        : 'Specialist engineering team dedicated to structural RC, finishing shopdrawings, BIM modeling, and constructability solutions since 2022.'));

  const contentHtmlStr = typeof page?.contentHtml === 'object'
    ? (lang === 'vi' ? page.contentHtml.vi : (page.contentHtml.en || page.contentHtml.vi))
    : (page?.contentHtml || '');

  const heroImage = page?.heroImage || page?.bannerImage;
  const galleryImages = page?.gallery || [];

  return (
    <div className="bg-[#F3F2EE] min-h-screen text-[#151515] font-display selection:bg-[#F27D26] selection:text-white">
      
      {/* Page Header */}
      <section className="border-b border-[#D9D8D3] bg-[#EAE9E4] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="type-section-label">
              // {subtitleStr}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#151515] leading-[1.05]">
              {titleStr}
            </h1>
            <p className="type-body-lg text-base sm:text-lg text-[#555] leading-relaxed font-sans">
              {descStr}
            </p>
          </div>
        </div>
      </section>

      {/* Prominent Hero Image (if uploaded via Admin) */}
      {heroImage && (
        <section className="border-b border-[#D9D8D3] bg-[#18181C]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
            <div className="border border-[#333] rounded-xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt={titleStr}
                className="w-full max-h-[550px] object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Custom Narrative HTML from Admin (if added) */}
      {contentHtmlStr && (
        <section className="py-16 border-b border-[#D9D8D3] bg-white">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
            <div 
              className="prose prose-lg max-w-none font-sans text-[#333] leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: contentHtmlStr }}
            />
          </div>
        </section>
      )}

      {/* Core Company Narrative & Founding History */}
      <section className="py-20 border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="type-section-label">
                01 / {lang === 'vi' ? 'LỊCH SỬ HÌNH THÀNH' : 'ORIGIN & HERITAGE'}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#151515] leading-tight">
                {lang === 'vi'
                  ? 'Kỹ thuật thực chiến sinh ra từ công trường.'
                  : 'Constructability engineered from the field.'}
              </h2>

              <div className="p-5 bg-[#EAE9E4] border border-[#D9D8D3] space-y-3 font-sans text-xs">
                <div>
                  <span className="type-meta-label block mb-0.5">TÊN PHÁP NHÂN ĐĂNG KÝ:</span>
                  <span className="font-semibold text-[#151515] text-sm font-sans">
                    {settings?.legalName || 'CÔNG TY TNHH KỸ THUẬT DEBRIQ'}
                  </span>
                </div>
                <div>
                  <span className="type-meta-label block mb-0.5">THỜI ĐIỂM HOẠT ĐỘNG:</span>
                  <span className="font-medium text-[#151515]">
                    {lang === 'vi' ? 'Đội ngũ hoạt động từ năm 2022' : 'Engineering team operating since 2022'}
                  </span>
                </div>
                <div>
                  <span className="type-meta-label block mb-0.5">LĨNH VỰC TRỌNG TÂM:</span>
                  <span className="text-[#F27D26] font-medium">Shopdrawing • BIM • Biện pháp thi công</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 font-sans text-base sm:text-lg text-[#333] leading-relaxed">
              <p>
                {lang === 'vi'
                  ? 'Đội ngũ DEBRIQ bắt đầu hoạt động từ năm 2022 với định hướng tập trung chuyên sâu vào công tác triển khai hồ sơ Shopdrawing và mô hình thông tin công trình (BIM). Thay vì cung cấp dịch vụ chung chung, chúng tôi lựa chọn giải quyết các bài toán kỹ thuật phức tạp nhất tại công trường: nút giao cốt thép mật độ cao, xử lý xung đột không gian MEP và tổ chức biện pháp thi công tầng hầm sâu.'
                  : 'DEBRIQ engineering team commenced operations in 2022 with a focused mandate: delivering field-ready shopdrawings and BIM coordination. Instead of generalist design services, we specialize in high-stakes construction engineering: dense rebar joints, MEP clash resolution, and deep basement methods.'}
              </p>

              <p>
                {lang === 'vi'
                  ? 'Kinh nghiệm phối hợp trong hệ thống các tổng thầu lớn (Coteccons, Hancorp, Tân Minh Nhân...) giúp DEBRIQ am hiểu tường tận quy trình nghiệm thu hồ sơ, chuẩn hóa form mẫu và đáp ứng áp lực tiến độ gắt gao của từng đợt đổ bê tông.'
                  : 'Deep integration experience within tier-1 general contractor systems enables DEBRIQ to master rigorous drawing approval workflows, CAD standards, and aggressive concrete pour milestones.'}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Human Resources & Operating Model */}
      <section className="py-20 bg-[#EAE9E4] border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="border-b border-[#D9D8D3] pb-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="type-section-label block mb-1">
                02 / {lang === 'vi' ? 'CƠ CẤU NGUỒN LỰC' : 'ENGINEERING CAPACITY'}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#151515] tracking-tight">
                {lang === 'vi' ? 'Đội ngũ nòng cốt & Mạng lưới chuyên gia' : 'Core Engineers & Collaborator Network'}
              </h2>
            </div>
            <p className="type-meta-label text-[#767670]">
              SCALABLE RESOURCE DEPLOYMENT MODEL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Core Team Card */}
            <div className="bg-[#F3F2EE] border border-[#D9D8D3] p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-display font-bold text-4xl text-[#151515]">
                    {settings?.teamCount || '5+'}
                  </span>
                  <h3 className="font-display font-bold text-xl text-[#151515] mt-1">
                    {lang === 'vi' ? 'Kỹ sư nòng cốt' : 'Core Lead Engineers'}
                  </h3>
                </div>
                <Users className="w-8 h-8 text-[#F27D26]" />
              </div>

              <p className="text-sm text-[#555] leading-relaxed font-sans">
                {lang === 'vi'
                  ? 'Đội ngũ kỹ sư nòng cốt phụ trách quản lý kỹ thuật, kiểm soát QA/QC 2 cấp, trực tiếp xử lý RFI với Tư vấn thiết kế và điều phối tiến độ tổng thể các gói thầu.'
                  : 'Senior engineers overseeing technical QA/QC, handling formal design RFIs, and orchestrating milestone deliveries.'}
              </p>

              <div className="space-y-2 font-sans text-xs text-[#555] border-t border-[#D9D8D3] pt-4 font-medium">
                <div>• Kỹ sư trưởng Kết cấu Bê tông cốt thép (Lead Structural)</div>
                <div>• Kỹ sư trưởng Hoàn thiện Kiến trúc (Lead Finishing)</div>
                <div>• Kỹ sư Điều phối BIM / Revit (BIM Coordinator)</div>
                <div>• Kỹ sư Biện pháp thi công & An toàn (Method Specialist)</div>
              </div>
            </div>

            {/* Collaborator Network Card */}
            <div className="bg-[#F3F2EE] border border-[#D9D8D3] p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-display font-bold text-4xl text-[#F27D26]">
                    {settings?.collaboratorsCount || settings?.collaboratorCount || '25+'}
                  </span>
                  <h3 className="font-display font-bold text-xl text-[#151515] mt-1">
                    {lang === 'vi' ? 'Cộng tác viên chuyên môn' : 'Specialist Collaborators'}
                  </h3>
                </div>
                <Layers className="w-8 h-8 text-[#151515]" />
              </div>

              <p className="text-sm text-[#555] leading-relaxed font-sans">
                {lang === 'vi'
                  ? 'Mạng lưới kỹ sư cộng tác viên được sàng lọc kỹ năng, đã kinh qua các dự án lớn, sẵn sàng huy động bổ sung để đáp ứng những đợt tăng tải tiến độ bàn giao hồ sơ.'
                  : 'Pre-vetted freelance structural and CAD engineers deployed on-demand for rapid scaling during heavy pour cycles.'}
              </p>

              <div className="space-y-2 font-sans text-xs text-[#555] border-t border-[#D9D8D3] pt-4 font-medium">
                <div>• Huy động linh hoạt theo từng giai đoạn dự án</div>
                <div>• Tuân thủ nghiêm ngặt tiêu chuẩn CAD standard DEBRIQ</div>
                <div>• Tối ưu chi phí quản lý cho các đối tác tổng thầu</div>
                <div>• Đáp ứng khối lượng bản vẽ lớn trong thời gian ngắn</div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Extra Image Gallery from Admin (if added) */}
      {galleryImages.length > 0 && (
        <section className="py-20 border-b border-[#D9D8D3] bg-[#F3F2EE]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
            <div>
              <span className="type-section-label block mb-1">
                // {lang === 'vi' ? 'HÌNH ẢNH HOẠT ĐỘNG & HIỆN TRƯỜNG' : 'FIELD & DRAWING GALLERY'}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#151515] tracking-tight">
                {lang === 'vi' ? 'Hình ảnh triển khai & Hồ sơ thực tế' : 'Field Execution & Deliverables'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="border border-[#D9D8D3] bg-white p-2 shadow-sm rounded-lg overflow-hidden group">
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Software & Technical Tools Standard */}
      <section className="py-20 border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="border-b border-[#D9D8D3] pb-6 mb-12">
            <span className="type-section-label block mb-1">
              03 / {lang === 'vi' ? 'CÔNG CỤ KỸ THUẬT' : 'SOFTWARE & STANDARDS'}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#151515] tracking-tight">
              {lang === 'vi' ? 'Tiêu chuẩn công nghệ áp dụng' : 'Engineering Tooling Ecosystem'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="border border-[#D9D8D3] bg-[#EAE9E4] p-6 space-y-3">
              <span className="type-meta-label text-[#F27D26] block">TOOL // 01</span>
              <h3 className="font-display font-bold text-xl text-[#151515]">AutoCAD</h3>
              <p className="text-xs text-[#555] leading-relaxed font-sans">
                {lang === 'vi'
                  ? 'Triển khai bản vẽ 2D chi tiết, hệ thống layer chuẩn hóa, dimstyle/textstyle đồng bộ theo quy định của từng Ban chỉ huy dự án.'
                  : 'Standardized 2D CAD drafting with synchronized layer structures and dimension styles.'}
              </p>
            </div>

            <div className="border border-[#D9D8D3] bg-[#EAE9E4] p-6 space-y-3">
              <span className="type-meta-label text-[#F27D26] block">TOOL // 02</span>
              <h3 className="font-display font-bold text-xl text-[#151515]">Autodesk Revit</h3>
              <p className="text-xs text-[#555] leading-relaxed font-sans">
                {lang === 'vi'
                  ? 'Mô hình hóa kết cấu và kiến trúc 3D chuẩn LOD 350, phát hiện va chạm không gian và trích xuất khối lượng tự động.'
                  : '3D BIM modeling at LOD 350, spatial clash coordination, and parametric quantity takeoffs.'}
              </p>
            </div>

            <div className="border border-[#D9D8D3] bg-[#EAE9E4] p-6 space-y-3">
              <span className="type-meta-label text-[#F27D26] block">TOOL // 03</span>
              <h3 className="font-display font-bold text-xl text-[#151515]">KataPro</h3>
              <p className="text-xs text-[#555] leading-relaxed font-sans">
                {lang === 'vi'
                  ? 'Phần mềm chuyên dụng bóc tách thống kê cốt thép, tối ưu chiều dài cắt uốn để giảm thiểu hao hụt thép thực tế tại công trường.'
                  : 'Specialized Bar Bending Schedule (BBS) optimization minimizing rebar wastage.'}
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
