import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

interface PartnersPageProps {
  navigate: (path: string) => void;
  openQuoteModal: (service?: string) => void;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({ openQuoteModal }) => {
  const { lang, t } = useLanguage();
  const { partners } = useData();

  return (
    <div className="bg-[#F3F2EE] min-h-screen text-[#151515] font-display selection:bg-[#F27D26] selection:text-white">
      
      {/* Header Banner */}
      <section className="border-b border-[#D9D8D3] bg-[#EAE9E4] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="type-section-label">
              // {lang === 'vi' ? 'HỆ THỐNG ĐỐI TÁC VÀ KHÁCH HÀNG' : 'CLIENTS & STRATEGIC PARTNERS'}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#151515] leading-[1.05]">
              {lang === 'vi' ? 'Đối tác & Khách hàng' : 'Partners & Clients'}
            </h1>
            <p className="type-body-lg text-base sm:text-lg text-[#555] leading-relaxed font-sans">
              {lang === 'vi'
                ? 'Minh bạch và chuẩn xác trong mối quan hệ hợp tác. DEBRIQ tự hào đồng hành cùng các tổng thầu hàng đầu và các nhà thầu chuyên ngành trên các đại công trình.'
                : 'Transparent attribution and proven reliability. DEBRIQ collaborates with tier-1 main contractors and specialized engineering firms across landmark builds.'}
            </p>
          </div>
        </div>
      </section>

      {/* Ethics & Transparency Statement */}
      <section className="py-12 bg-[#F3F2EE] border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="p-6 bg-[#EAE9E4] border-l-4 border-[#F27D26] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="type-section-label text-[#151515] block">
                {lang === 'vi' ? 'NGUYÊN TẮC MINH BẠCH VỀ QUAN HỆ HỢP TÁC // DEBRIQ ETHICS' : 'DEBRIQ TRANSPARENCY PRINCIPLE'}
              </span>
              <p className="text-[#555] max-w-3xl font-sans text-sm leading-relaxed">
                {lang === 'vi'
                  ? 'DEBRIQ phân định rõ ràng giữa Khách hàng trực tiếp ký hợp đồng / giao việc và Tổng thầu / Chủ đầu tư dự án nhằm tôn trọng thỏa thuận bảo mật và phản ánh đúng thực tế năng lực.'
                  : 'We strictly distinguish between Direct Contracting Clients and Project Developers/General Contractors to honor NDA confidentiality and ensure authentic competence records.'}
              </p>
            </div>
            <ShieldCheck className="w-8 h-8 text-[#F27D26] shrink-0" />
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <div 
                key={partner.id}
                className="bg-[#EAE9E4] border border-[#D9D8D3] p-8 space-y-6 flex flex-col justify-between hover:border-[#151515] transition-all"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="type-section-label">
                      PARTNER // 0{index + 1}
                    </span>
                    <span className="type-meta-label bg-[#D9D8D3] text-[#262626] px-2 py-0.5">
                      VERIFIED
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {partner.logoUrl ? (
                      <div className="w-14 h-14 bg-white border border-[#D9D8D3] p-1.5 rounded flex items-center justify-center shrink-0 shadow-sm">
                        <img 
                          src={partner.logoUrl} 
                          alt={partner.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-[#D9D8D3] text-[#151515] font-bold text-sm flex items-center justify-center shrink-0 font-mono-tech rounded">
                        {partner.logoText || partner.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h2 className="font-display font-bold text-xl text-[#151515] tracking-tight truncate">
                        {partner.name}
                      </h2>
                      <span className="type-meta-label text-[#767670] block mt-0.5">
                        {t(partner.roleLabel)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#444] leading-relaxed font-sans">
                    {t(partner.description)}
                  </p>
                </div>

                {partner.projectRefs && partner.projectRefs.length > 0 && (
                  <div className="border-t border-[#D9D8D3] pt-4 space-y-1 font-sans text-xs">
                    <span className="type-meta-label text-[#767670] block mb-1">
                      {lang === 'vi' ? 'DỰ ÁN TIÊU BIỂU PHỐI HỢP:' : 'PROJECT REFERENCES:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {partner.projectRefs.map((ref, i) => (
                        <span key={i} className="bg-[#F3F2EE] border border-[#D9D8D3] px-2 py-0.5 text-xs text-[#151515] font-medium">
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA Box */}
      <section className="py-20 bg-[#151515] text-[#F3F2EE]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-6">
          <span className="type-section-label text-[#F27D26] block">
            // {lang === 'vi' ? 'HỢP TÁC KỸ THUẬT' : 'TECHNICAL COLLABORATION'}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {lang === 'vi' ? 'Sẵn sàng đồng hành cùng gói thầu tiếp theo' : 'Ready for your next construction milestone'}
          </h2>
          <p className="text-sm sm:text-base text-[#A0A09A] max-w-xl mx-auto font-sans leading-relaxed">
            {lang === 'vi'
              ? 'DEBRIQ tiếp nhận yêu cầu báo giá và hỗ trợ rà soát sơ bộ hồ sơ thiết kế 24/7.'
              : 'DEBRIQ provides 24/7 preliminary blueprint review and rapid quotation for general contractors.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => openQuoteModal()}
              className="bg-[#F27D26] hover:bg-[#E06B15] text-white px-8 py-4 font-sans font-semibold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>{lang === 'vi' ? 'Gửi yêu cầu báo giá' : 'Request a quote'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
