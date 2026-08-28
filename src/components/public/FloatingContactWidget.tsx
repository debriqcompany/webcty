import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Phone, ArrowUpRight, X, Sparkles } from 'lucide-react';

interface FloatingContactWidgetProps {
  openQuoteModal: (service?: string) => void;
}

export const FloatingContactWidget: React.FC<FloatingContactWidgetProps> = ({ openQuoteModal }) => {
  const { lang } = useLanguage();
  const { settings } = useData();
  const [isOpen, setIsOpen] = useState(false);

  // If settings not loaded yet or explicitly disabled in admin settings, do not render
  if (settings && settings.floatingZaloEnabled === false) {
    return null;
  }

  // Format Zalo link: supports phone number like 090... or direct URL like https://zalo.me/...
  const rawZalo = settings?.zaloUrl || settings?.zalo || '0983147456';
  const zaloHref = rawZalo.startsWith('http') 
    ? rawZalo 
    : `https://zalo.me/${rawZalo.replace(/[^0-9]/g, '')}`;

  const hotlineHref = `tel:${(settings?.hotline || '0983147456').replace(/[^0-9+]/g, '')}`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end font-mono-tech select-none">
      
      {/* Expanded Quick Contact Menu Popover */}
      {isOpen && (
        <div 
          className="mb-3 w-72 sm:w-80 bg-[#18181C]/95 backdrop-blur-md border border-[#333] rounded-2xl shadow-2xl p-4 space-y-3 animate-fade-in text-xs text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2E2E34] pb-2.5">
            <div className="flex items-center gap-2">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt="DEBRIQ" className="w-5 h-5 object-contain" />
              ) : (
                <div className="w-5 h-5 bg-[#F27D26] text-white flex items-center justify-center font-bold text-[10px] rounded">
                  DQ
                </div>
              )}
              <span className="font-bold uppercase tracking-wider text-[11px] text-white">
                {lang === 'vi' ? 'KẾT NỐI KỸ THUẬT' : 'TECHNICAL DESK'}
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-[#2A2A30] rounded-full text-[#888] hover:text-white transition-colors cursor-pointer"
              aria-label="Đóng menu liên hệ"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-[#A0A09A] font-sans leading-relaxed">
            {lang === 'vi' 
              ? 'Tư vấn trực tiếp hồ sơ Shopdrawing, báo giá hoặc trao đổi yêu cầu kỹ thuật cùng Ban Điều Hành:'
              : 'Direct consultation on Shopdrawing blueprints and technical proposals:'}
          </p>

          {/* Quick Actions List */}
          <div className="space-y-2 pt-1 font-sans">
            
            {/* Direct Zalo Boss */}
            <a
              href={zaloHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 bg-[#0068FF]/15 hover:bg-[#0068FF]/25 border border-[#0068FF]/40 rounded-xl text-white transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src="https://img.icons8.com/?size=100&id=0m71tmRjlxEe&format=png&color=000000"
                  alt="Zalo"
                  className="w-6 h-6 p-0.5 bg-white rounded-full object-contain shrink-0"
                />
                <div className="text-left">
                  <span className="font-bold text-xs block text-[#38BDF8] group-hover:text-white">
                    {lang === 'vi' ? 'Chat Zalo Kỹ Thuật' : 'Chat via Zalo'}
                  </span>
                  <span className="text-[10px] text-[#A0A09A] font-mono">
                    {settings?.zaloUrl || settings?.zalo || '0983 147 456'}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Hotline Call */}
            {settings?.hotline && (
              <a
                href={hotlineHref}
                className="flex items-center justify-between p-2.5 bg-[#222226] hover:bg-[#2C2C32] border border-[#3A3A40] rounded-xl text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-xs block text-white">
                      {lang === 'vi' ? 'Hotline Trực Tiếp' : 'Direct Call'}
                    </span>
                    <span className="text-[10px] text-[#A0A09A] font-mono">
                      {settings.hotline}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#888] group-hover:text-white transition-colors" />
              </a>
            )}

            {/* Request Quote Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                openQuoteModal();
              }}
              className="w-full flex items-center justify-between p-2.5 bg-[#F27D26] hover:bg-[#D86616] rounded-xl text-white font-bold transition-all shadow-md cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider font-mono">
                  {lang === 'vi' ? 'Gửi Yêu Cầu Báo Giá' : 'Request a Quote'}
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <div className="flex items-center gap-2">
        
        {/* Helper Pill on Desktop (Hidden when menu open) */}
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-[#18181C]/90 backdrop-blur-md border border-[#333] hover:border-[#F27D26] px-3.5 py-2 rounded-full shadow-xl text-xs text-white cursor-pointer group transition-all hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold font-sans text-xs">
              {lang === 'vi' ? 'Tư vấn Zalo / Báo giá' : 'Zalo Support'}
            </span>
          </div>
        )}

        {/* Circular Floating Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-br from-[#18181C] to-[#0D0D10] hover:from-[#F27D26] hover:to-[#D86616] border-2 border-[#F27D26] rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-all duration-300 transform active:scale-95 group overflow-hidden"
          aria-label="Liên hệ Zalo và Tư vấn"
          title="Liên hệ Zalo / Báo giá kỹ thuật"
        >
          {/* Subtle Wave Ping Animation */}
          <span className="absolute inset-0 rounded-full bg-[#F27D26]/30 animate-ping pointer-events-none" />

          {isOpen ? (
            <X className="w-6 h-6 text-white relative z-10 transition-transform rotate-0 group-hover:rotate-90" />
          ) : (
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              {/* Official Zalo Icon */}
              <img
                src="https://img.icons8.com/?size=100&id=0m71tmRjlxEe&format=png&color=000000"
                alt="Zalo"
                className="w-7 h-7 sm:w-8 sm:h-8 p-1 bg-white rounded-full object-contain shadow-md group-hover:scale-110 transition-transform"
              />
            </div>
          )}
        </button>

      </div>

    </div>
  );
};
