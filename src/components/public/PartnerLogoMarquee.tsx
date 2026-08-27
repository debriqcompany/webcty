import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Partner } from '../../types';
import { ShieldCheck } from 'lucide-react';

interface PartnerLogoMarqueeProps {
  partners?: Partner[];
  title?: string;
  subtitle?: string;
}

export const PartnerLogoMarquee: React.FC<PartnerLogoMarqueeProps> = ({
  partners = [],
  title,
  subtitle
}) => {
  const { lang, t } = useLanguage();

  const safePartners = Array.isArray(partners) ? partners : [];
  // Filter active partners
  const activePartners = safePartners.filter(p => p && p.active !== false);

  if (activePartners.length === 0) return null;

  // Duplicate for seamless infinite loop
  const marqueeItems = [...activePartners, ...activePartners, ...activePartners];

  return (
    <div className="border-b border-[#262626] bg-[#111113] py-10 overflow-hidden font-display">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="type-section-label">
              // {lang === 'vi' ? 'ĐỐI TÁC & KHÁCH HÀNG ĐỒNG HÀNH' : 'COLLABORATING PARTNERS & CLIENTS'}
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#F3F2EE] font-display mt-0.5">
              {title || (lang === 'vi' ? 'Mạng lưới Tổng thầu & Chủ đầu tư' : 'Clients & General Contractors')}
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono-tech text-xs text-[#888]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F27D26]" />
            <span>{lang === 'vi' ? 'Minh bạch năng lực' : 'Verified attribution'}</span>
          </div>
        </div>
      </div>

      {/* Infinite Scrolling Track */}
      <div className="relative w-full overflow-hidden flex mask-radial">
        <div className="flex gap-6 animate-marquee shrink-0 items-center py-2">
          {marqueeItems.map((partner, idx) => {
            const partnerLogo = partner.logoUrl || (partner as any).logo;
            const partnerName = partner.name || '';
            const initial = partnerName ? partnerName.substring(0, 2).toUpperCase() : 'P';
            const roleLabelText = partner.roleLabel
              ? (typeof partner.roleLabel === 'string' ? partner.roleLabel : t(partner.roleLabel))
              : '';

            return (
              <div
                key={`${partner.id || idx}-${idx}`}
                className="bg-[#18181b] border border-[#27272a] hover:border-[#F27D26] p-3.5 px-5 rounded-lg flex items-center gap-4 transition-all duration-200 shrink-0 hover:bg-[#222226] hover:scale-105 hover:shadow-xl hover:shadow-[#F27D26]/10 cursor-pointer group"
              >
                {partnerLogo ? (
                  <div className="w-12 h-12 bg-white/95 border border-[#333] rounded-md flex items-center justify-center p-1.5 shrink-0 group-hover:bg-white transition-colors shadow-sm">
                    <img
                      src={partnerLogo}
                      alt={partnerName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md bg-[#252528] border border-[#3a3a40] flex items-center justify-center text-[#F27D26] font-mono-tech font-bold text-sm shrink-0 group-hover:border-[#F27D26] transition-colors">
                    {initial}
                  </div>
                )}

                <div className="space-y-0.5">
                  <span className="font-display font-bold text-xs sm:text-sm text-[#F3F2EE] uppercase tracking-tight block group-hover:text-white transition-colors">
                    {partnerName}
                  </span>
                  <div className="flex items-center gap-2 font-mono-tech text-[10px] text-[#8D8D88]">
                    <span className="truncate max-w-[160px]">{roleLabelText}</span>
                    {partner.relationshipType && (
                      <span className="bg-[#27272a] text-[#F27D26] px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">
                        {partner.relationshipType === 'direct_client' ? 'Direct' : 'Partner'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
