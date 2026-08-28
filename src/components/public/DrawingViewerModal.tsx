import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, ZoomIn, ZoomOut, Maximize2, ShieldCheck } from 'lucide-react';
import { ProjectImage } from '../../types';

interface DrawingViewerModalProps {
  image?: ProjectImage | null;
  isOpen?: boolean;
  initialCategory?: string;
  onClose: () => void;
}

export const DrawingViewerModal: React.FC<DrawingViewerModalProps> = ({ 
  image, 
  isOpen = false, 
  onClose 
}) => {
  const { lang, t } = useLanguage();
  const [zoom, setZoom] = useState(1);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // If neither an active image nor isOpen flag is active, do not render
  if (!image && !isOpen) return null;

  const displayImage: ProjectImage = image || {
    id: 'sample-drawing',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    caption: { vi: 'Hồ sơ bản vẽ kỹ thuật chi tiết', en: 'Technical Shopdrawing Detail' },
    type: 'drawing'
  };

  const imageType = (displayImage.type || 'HÌNH ẢNH').toUpperCase();
  const captionText = typeof displayImage.caption === 'object' 
    ? t(displayImage.caption) 
    : (displayImage.caption || 'Hồ sơ bản vẽ chi tiết');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in font-mono-tech select-none"
      onClick={onClose}
    >
      {/* Floating prominent close button for mobile & desktop */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed top-3 right-3 z-50 w-10 h-10 bg-[#F27D26] hover:bg-[#D86616] active:scale-95 text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer border border-white/20 transition-transform"
        aria-label="Đóng xem ảnh"
        title="Đóng (Esc)"
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="relative w-full max-w-5xl h-[90vh] sm:h-[85vh] bg-[#181818] border border-[#333] flex flex-col shadow-2xl overflow-hidden rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Control Bar */}
        <div className="bg-[#1F1F1F] border-b border-[#333] px-3 sm:px-4 py-2.5 sm:py-3 flex justify-between items-center text-xs text-[#AAA] gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <span className="bg-[#F27D26] text-white px-2 py-0.5 font-bold uppercase tracking-wider text-[9px] sm:text-[10px] shrink-0">
              {imageType}
            </span>
            <span className="text-[#DDD] font-semibold truncate text-[11px] sm:text-xs">
              {captionText}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setZoom(prev => Math.max(0.75, prev - 0.25))}
              className="p-1.5 border border-[#444] hover:bg-[#333] text-[#DDD] rounded cursor-pointer"
              title="Thu nhỏ"
            >
              <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <span className="text-[10px] sm:text-[11px] px-1 font-mono text-[#DDD]">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
              className="p-1.5 border border-[#444] hover:bg-[#333] text-[#DDD] rounded cursor-pointer"
              title="Phóng to"
            >
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 border border-[#444] hover:bg-[#333] text-[#DDD] hidden sm:inline-block rounded cursor-pointer"
              title="Kích thước gốc"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-[#F27D26] hover:bg-[#D86616] text-white ml-1 rounded flex items-center justify-center cursor-pointer font-bold"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Area */}
        <div 
          className="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center bg-[#141414] bg-blueprint-dark relative cursor-grab active:cursor-grabbing"
          onClick={onClose}
        >
          <div 
            className="transition-transform duration-200 ease-out origin-center max-w-full"
            style={{ transform: `scale(${zoom})` }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={displayImage.url}
              alt={displayImage.alt || captionText}
              className="max-h-[70vh] sm:max-h-[65vh] max-w-full object-contain border border-[#333] shadow-2xl rounded"
            />
          </div>
        </div>

        {/* Bottom Technical Status Bar */}
        <div className="bg-[#1A1A1A] border-t border-[#333] px-3 sm:px-4 py-2 flex flex-col sm:flex-row justify-between items-center text-[9px] sm:text-[10px] text-[#777] gap-1 select-none">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
            <span className="truncate">
              {lang === 'vi' 
                ? 'HỒ SƠ ĐÃ ĐƯỢC KIỂM TRA & BẢO MẬT THEO QUY ĐỊNH DEBRIQ' 
                : 'DOCUMENT INSPECTED & SANITIZED IN COMPLIANCE WITH DEBRIQ QA STANDARDS'}
            </span>
          </div>
          <div className="hidden sm:block">
            <span>BẤM NGOÀI HOẶC BẤM NÚT [✕] ĐỂ ĐÓNG</span>
          </div>
        </div>

      </div>
    </div>
  );
};
