import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { X } from 'lucide-react';

interface PromoPopupModalProps {
  navigate: (path: string) => void;
  openQuoteModal: (service?: string) => void;
}

export const PromoPopupModal: React.FC<PromoPopupModalProps> = ({ navigate, openQuoteModal }) => {
  const { settings } = useData();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Listen for preview events from Admin
    const handleForceOpen = () => {
      if (settings?.popupImageUrl) {
        setIsOpen(true);
      }
    };
    window.addEventListener('debriq:open-popup', handleForceOpen);

    // Must be enabled and have an image URL
    if (!settings?.popupEnabled || !settings?.popupImageUrl) {
      return () => window.removeEventListener('debriq:open-popup', handleForceOpen);
    }

    const now = Date.now();

    // Check Start Schedule
    if (settings.popupStartDate) {
      const startMs = new Date(settings.popupStartDate).getTime();
      if (!isNaN(startMs) && now < startMs) {
        return () => window.removeEventListener('debriq:open-popup', handleForceOpen);
      }
    }

    // Check End Schedule
    if (settings.popupEndDate) {
      const endMs = new Date(settings.popupEndDate).getTime();
      if (!isNaN(endMs) && now > endMs) {
        return () => window.removeEventListener('debriq:open-popup', handleForceOpen);
      }
    }

    // Check Show Once per session (associated with current image)
    try {
      const dismissedImg = sessionStorage.getItem('debriq_popup_dismissed_img');
      if (settings.popupShowOnce !== false && dismissedImg === settings.popupImageUrl) {
        return () => window.removeEventListener('debriq:open-popup', handleForceOpen);
      }
    } catch {
      // ignore
    }

    const delayMs = Math.max(0, (settings.popupDelaySeconds ?? 2)) * 1000;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, delayMs);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('debriq:open-popup', handleForceOpen);
    };
  }, [
    settings?.popupEnabled, 
    settings?.popupImageUrl, 
    settings?.popupStartDate, 
    settings?.popupEndDate, 
    settings?.popupDelaySeconds, 
    settings?.popupShowOnce
  ]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      if (settings?.popupImageUrl) {
        sessionStorage.setItem('debriq_popup_dismissed_img', settings.popupImageUrl);
      }
    } catch {
      // ignore
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (settings?.popupCtaLink) {
      handleClose();
      if (settings.popupCtaLink.startsWith('http')) {
        window.open(settings.popupCtaLink, '_blank', 'noopener,noreferrer');
      } else if (settings.popupCtaLink.startsWith('/')) {
        navigate(settings.popupCtaLink);
      } else if (settings.popupCtaLink === 'quote') {
        openQuoteModal();
      }
    }
  };

  if (!isOpen || !settings?.popupImageUrl) return null;

  const hasClickAction = Boolean(settings?.popupCtaLink);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in select-none"
      onClick={handleClose}
    >
      {/* Container holding purely the custom PNG image and its clean close button */}
      <div 
        className="relative max-w-[92vw] sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[88vh] flex items-center justify-center animate-scale-in group"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sleek Close Button right at the top-right corner of the image */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 bg-[#F27D26] hover:bg-[#D86616] active:scale-95 text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer border-2 border-white transition-transform duration-200"
          aria-label="Đóng popup"
          title="Đóng (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* The Pure Image */}
        <img
          src={settings.popupImageUrl}
          alt="DEBRIQ Announcement"
          onClick={hasClickAction ? handleImageClick : undefined}
          className={`max-h-[85vh] max-w-full w-auto h-auto object-contain drop-shadow-2xl transition-transform duration-300 ${
            hasClickAction ? 'cursor-pointer hover:scale-[1.015]' : ''
          }`}
        />
      </div>
    </div>
  );
};
