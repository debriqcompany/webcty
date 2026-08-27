import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, ZoomIn, ZoomOut, Maximize2, ShieldCheck, Download, Layers } from 'lucide-react';
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
  initialCategory, 
  onClose 
}) => {
  const { lang, t } = useLanguage();
  const [zoom, setZoom] = useState(1);

  // If neither an active image nor isOpen flag is active, do not render
  if (!image && !isOpen) return null;

  const displayImage: ProjectImage = image || {
    id: 'sample-drawing',
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    caption: { vi: 'Hồ sơ bản vẽ kỹ thuật chi tiết', en: 'Technical Shopdrawing Detail' },
    type: 'drawing'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111]/90 backdrop-blur-md animate-fade-in font-mono-tech select-none">
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#181818] border border-[#333] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="bg-[#1F1F1F] border-b border-[#333] px-4 py-3 flex justify-between items-center text-xs text-[#AAA]">
          <div className="flex items-center gap-3">
            <span className="bg-[#F27D26] text-white px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">
              {image.type.toUpperCase()}
            </span>
            <span className="text-[#DDD] font-semibold truncate max-w-xs sm:max-w-md">
              {t(image.caption)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(prev => Math.max(0.75, prev - 0.25))}
              className="p-1.5 border border-[#444] hover:bg-[#333] text-[#DDD]"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] px-2">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(2.5, prev + 0.25))}
              className="p-1.5 border border-[#444] hover:bg-[#333] text-[#DDD]"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 border border-[#444] hover:bg-[#333] text-[#DDD] hidden sm:inline-block"
              title="Reset Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 border border-[#F27D26] bg-[#F27D26] hover:bg-[#D86616] text-white ml-2"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Area */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#141414] bg-blueprint-dark relative">
          <div 
            className="transition-transform duration-200 ease-out origin-center"
            style={{ transform: `scale(${zoom})` }}
          >
            <img
              src={image.url}
              alt={image.alt || t(image.caption)}
              className="max-h-[65vh] max-w-full object-contain border border-[#333] shadow-lg"
            />
          </div>
        </div>

        {/* Bottom Technical Status Bar */}
        <div className="bg-[#1A1A1A] border-t border-[#333] px-4 py-2 flex flex-col sm:flex-row justify-between items-center text-[10px] text-[#777] gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F27D26]" />
            <span>
              {lang === 'vi' 
                ? 'HỒ SƠ ĐÃ ĐƯỢC KIỂM TRA & BẢO MẬT THÔNG TIN THEO QUY ĐỊNH DEBRIQ' 
                : 'DOCUMENT INSPECTED & SANITIZED IN COMPLIANCE WITH DEBRIQ QA STANDARDS'}
            </span>
          </div>
          <div>
            <span>FORMAT: HIGH-RES RENDER / CAD EXPORT</span>
          </div>
        </div>

      </div>
    </div>
  );
};
