import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { X, ArrowUpRight, Sparkles } from 'lucide-react';

interface PromoPopupModalProps {
  navigate: (path: string) => void;
  openQuoteModal: (service?: string) => void;
}

export const PromoPopupModal: React.FC<PromoPopupModalProps> = ({ navigate, openQuoteModal }) => {
  const { lang, t } = useLanguage();
  const { settings } = useData();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if popup is enabled
    if (!settings.popupEnabled) return;

    // Check if user already dismissed it in current session
    const isDismissed = sessionStorage.getItem('debriq_popup_dismissed');
    if (settings.popupShowOnce !== false && isDismissed === 'true') {
      return;
    }

    const delayMs = (settings.popupDelaySeconds ?? 3) * 1000;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [settings.popupEnabled, settings.popupDelaySeconds, settings.popupShowOnce]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('debriq_popup_dismissed', 'true');
  };

  const handleCtaClick = () => {
    handleClose();
    if (settings.popupCtaLink) {
      if (settings.popupCtaLink.startsWith('http')) {
        window.open(settings.popupCtaLink, '_blank', 'noopener,noreferrer');
      } else if (settings.popupCtaLink.startsWith('/')) {
        navigate(settings.popupCtaLink);
      } else if (settings.popupCtaLink === 'quote') {
        openQuoteModal();
      }
    } else {
      openQuoteModal();
    }
  };

  if (!isOpen) return null;

  const titleText = typeof settings.popupTitle === 'object'
    ? t(settings.popupTitle)
    : (settings.popupTitle || (lang === 'vi' ? 'HỒ SƠ KỸ THUẬT & DỊCH VỤ DEBRIQ' : 'DEBRIQ ENGINEERING PORTFOLIO'));

  const descText = typeof settings.popupDescription === 'object'
    ? t(settings.popupDescription)
    : (settings.popupDescription || (lang === 'vi' 
        ? 'Đối tác tin cậy đồng hành cùng các tổng thầu trong triển khai Shopdrawing kết cấu, hoàn thiện, BIM/Revit và biện pháp thi công thực chiến.' 
        : 'Dedicated technical engineering partner delivering precise shopdrawings, BIM Revit models, and construction methodologies.'));

  const ctaText = typeof settings.popupCtaText === 'object'
    ? t(settings.popupCtaText)
    : (settings.popupCtaText || (lang === 'vi' ? 'NHẬN TƯ VẤN & BÁO GIÁ' : 'GET A PROPOSAL'));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono-tech select-none"
      onClick={handleClose}
    >
      
      {/* Floating Close Button for Mobile / Desktop */}
      <button
        onClick={handleClose}
        className="hidden sm:flex fixed top-4 right-4 z-50 w-11 h-11 bg-[#F27D26] hover:bg-[#D86616] active:scale-95 text-white rounded-full items-center justify-center shadow-2xl cursor-pointer border border-white/20"
        title="Đóng (Esc)"
        aria-label="Đóng popup"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Container: Bottom Sheet on Mobile, Centered Card on Desktop */}
      <div 
        className="relative w-full sm:max-w-lg md:max-w-xl bg-[#18181C] border-t sm:border border-[#333] rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white animate-slide-up sm:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Mobile Header Close Bar */}
        <div className="flex sm:hidden items-center justify-between p-4 border-b border-[#2C2C32] bg-[#141416]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-pulse" />
            <span className="font-bold text-xs uppercase tracking-wider text-[#F27D26]">
              DEBRIQ ANNOUNCEMENT
            </span>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#27272A] text-white flex items-center justify-center cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Optional Image / Poster Banner */}
        {settings.popupImageUrl ? (
          <div className="relative aspect-[16/9] w-full bg-[#111] overflow-hidden border-b border-[#333]">
            <img 
              src={settings.popupImageUrl} 
              alt={titleText}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181C] via-transparent to-transparent opacity-80" />
          </div>
        ) : (
          <div className="p-6 sm:p-8 bg-blueprint-dark border-b border-[#2C2C32] relative overflow-hidden">
            <div className="inline-block px-2.5 py-1 mb-3 text-[10px] font-bold tracking-widest bg-[#F27D26] text-white uppercase rounded">
              {lang === 'vi' ? 'THÔNG BÁO NỔI BẬT' : 'FEATURED NOTICE'}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white leading-snug">
              {titleText}
            </h3>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-4 bg-[#18181C]">
          {settings.popupImageUrl && (
            <h3 className="text-lg sm:text-xl font-bold font-display tracking-tight text-white leading-snug">
              {titleText}
            </h3>
          )}

          <p className="text-xs sm:text-sm text-[#B0B0A8] font-sans leading-relaxed">
            {descText}
          </p>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleCtaClick}
              className="w-full sm:flex-1 py-3.5 bg-[#F27D26] hover:bg-[#D86616] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer font-sans"
            >
              <span>{ctaText}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleClose}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#26262B] hover:bg-[#32323A] text-[#BBB] hover:text-white rounded-xl text-xs uppercase font-medium transition-colors cursor-pointer font-sans border border-[#3A3A42]"
            >
              {lang === 'vi' ? 'Đóng lại' : 'Dismiss'}
            </button>
          </div>

          <div className="text-center pt-1">
            <span className="text-[10px] text-[#666] font-sans">
              {lang === 'vi' ? 'Bấm bất kỳ đâu bên ngoài để tắt thông báo' : 'Click outside to close this notice'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
