import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { PartnerLogoMarquee } from './PartnerLogoMarquee';

interface FooterProps {
  navigate: (path: string) => void;
  openQuoteModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate, openQuoteModal }) => {
  const { lang } = useLanguage();
  const { settings, partners } = useData();

  const hotline = settings?.hotline || '0983 147 456';
  const email = settings?.email || 'contact@debriq.vn';
  const address = settings?.address || '71 Quốc Lộ 13, Tổ 2, Khu Phố Bàu Bàng, Xã Bàu Bàng, Thành phố Hồ Chí Minh';

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#151515] text-[#D9D8D3] border-t border-[#262626] font-display selection:bg-[#F27D26] selection:text-white">
      {/* Infinite Partner & Client Logo Slider */}
      <PartnerLogoMarquee partners={partners} />

      {/* Upper Technical Banner */}
      <div className="border-b border-[#262626] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <div className="lg:col-span-8">
              <span className="type-section-label text-[#F27D26] block mb-2">
                // {lang === 'vi' ? 'HỢP TÁC KỸ THUẬT DỰ ÁN' : 'TECHNICAL PROJECT PARTNERSHIP'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F3F2EE] leading-tight">
                {lang === 'vi' 
                  ? 'Đồng hành từ hồ sơ thiết kế đến nghiệm thu thực tế trên công trường.' 
                  : 'Accompanying projects from design blueprints to field inspection on site.'}
              </h2>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={openQuoteModal}
                className="inline-flex items-center justify-between bg-[#F27D26] hover:bg-white hover:text-[#151515] text-white px-6 py-3.5 font-sans font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                <span>{lang === 'vi' ? 'Gửi yêu cầu báo giá' : 'Request a quote'}</span>
                <ArrowUpRight className="w-4 h-4 ml-2" />
              </button>

              <button
                onClick={() => handleNav('/join-debriq')}
                className="inline-flex items-center justify-between border border-[#444] hover:border-[#D9D8D3] text-[#F3F2EE] hover:bg-[#202020] px-6 py-3.5 font-sans font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                <span>{lang === 'vi' ? 'Gia nhập mạng lưới kỹ sư' : 'Join engineer network'}</span>
                <ArrowUpRight className="w-4 h-4 ml-2 text-[#8D8D88]" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Directory Body */}
      <div className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            
            {/* Col 1: Brand & Legal Information */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <span className="font-display text-2xl font-bold text-[#F3F2EE] tracking-tight">
                  DEBRIQ
                </span>
                <p className="font-sans text-xs text-[#8D8D88] mt-1 tracking-wider uppercase font-medium">
                  CÔNG TY TNHH KỸ THUẬT DEBRIQ
                </p>
              </div>

              <p className="text-sm text-[#A0A09A] leading-relaxed max-w-sm font-sans">
                {lang === 'vi' 
                  ? 'Đội ngũ DEBRIQ bắt đầu hoạt động từ năm 2022. Giải pháp Shopdrawing kết cấu, hoàn thiện, BIM/Revit và hồ sơ biện pháp thi công cho các công trình quy mô lớn.' 
                  : 'DEBRIQ engineering team has been operating since 2022. Delivering structural, finishing shopdrawings, BIM/Revit, and construction method statements for landmark projects.'}
              </p>

              <div className="pt-2 font-mono-tech text-xs text-[#777] space-y-1">
                <div>CORE TOOLS: AutoCAD • Revit • KataPro</div>
                <div>RESOURCES: 5+ Engineers • 25+ Collaborators</div>
              </div>
            </div>

            {/* Col 2: Services Directory */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="type-meta-label text-[#F3F2EE] border-b border-[#2A2A2A] pb-2 block">
                {lang === 'vi' ? 'DỊCH VỤ CHUYÊN MÔN' : 'CORE SERVICES'}
              </h3>
              <ul className="space-y-2 text-sm text-[#A0A09A] font-sans">
                <li>
                  <button onClick={() => handleNav('/services')} className="hover:text-[#F27D26] transition-colors text-left cursor-pointer">
                    {lang === 'vi' ? 'Shopdrawing kết cấu bê tông cốt thép' : 'Structural RC Shopdrawing'}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('/services')} className="hover:text-[#F27D26] transition-colors text-left cursor-pointer">
                    {lang === 'vi' ? 'Shopdrawing hoàn thiện kiến trúc' : 'Architectural Finishing Shopdrawing'}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('/services')} className="hover:text-[#F27D26] transition-colors text-left cursor-pointer">
                    {lang === 'vi' ? 'BIM / Revit & Kiểm soát xung đột' : 'BIM / Revit & Clash Coordination'}
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('/services')} className="hover:text-[#F27D26] transition-colors text-left cursor-pointer">
                    {lang === 'vi' ? 'Biện pháp thi công & Tầng hầm Top-down' : 'Construction Method Statements'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Key Projects */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="type-meta-label text-[#F3F2EE] border-b border-[#2A2A2A] pb-2 block">
                {lang === 'vi' ? 'DỰ ÁN TIÊU BIỂU' : 'FEATURED BUILDS'}
              </h3>
              <ul className="space-y-2 text-sm text-[#A0A09A] font-sans">
                <li>
                  <button onClick={() => handleNav('/projects/san-bay-long-thanh')} className="hover:text-[#F27D26] transition-colors text-left cursor-pointer">
                    Sân bay Long Thành
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('/projects/the-global-city')} className="hover:text-[#F27D26] transition-colors text-left cursor-pointer">
                    The Global City
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('/projects/opera-tay-ho-nha-hat-ngoc-trai')} className="hover:text-[#F27D26] transition-colors text-left cursor-pointer">
                    Opera Tây Hồ
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('/projects/san-bay-phu-quoc')} className="hover:text-[#F27D26] transition-colors text-left cursor-pointer">
                    Sân bay Phú Quốc
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNav('/projects/eco-retreat')} className="hover:text-[#F27D26] transition-colors text-left cursor-pointer">
                    Eco Retreat (220 ha)
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Official Contact Information */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="type-meta-label text-[#F3F2EE] border-b border-[#2A2A2A] pb-2 block">
                {lang === 'vi' ? 'THÔNG TIN LIÊN HỆ' : 'HEADQUARTERS'}
              </h3>
              <div className="space-y-3 text-sm text-[#A0A09A] font-sans">
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#F27D26] mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-xs text-[#767670] type-meta-label">HOTLINE / ZALO</span>
                    <a href={`tel:${hotline.replace(/\s/g, '')}`} className="text-[#F3F2EE] font-mono-tech hover:text-[#F27D26]">
                      {hotline}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-[#F27D26] mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-xs text-[#767670] type-meta-label">EMAIL</span>
                    <a href={`mailto:${email}`} className="text-[#F3F2EE] font-mono-tech hover:text-[#F27D26]">
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#F27D26] mt-0.5 shrink-0" />
                  <div>
                    <span className="block text-xs text-[#767670] type-meta-label">ĐỊA CHỈ TRỤ SỞ</span>
                    <span className="text-xs text-[#A0A09A] leading-normal font-sans">
                      {address}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-[#D9D8D3]/10 py-6 bg-[#0E0E0E]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono-tech text-[#8D8D88]">
          <div>
            © {new Date().getFullYear()} DEBRIQ ENGINEERING. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6">
            <span>TCVN 5574:2018</span>
            <span>BIM / REVIT / AUTOCAD</span>
            <span>ISO 9001 QUALITY PROCESS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
