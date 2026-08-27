import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ContentBlock, ProjectImage } from '../../types';
import { 
  Quote, 
  AlertCircle, 
  Code2, 
  Maximize2, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { DrawingViewerModal } from './DrawingViewerModal';

interface ContentBlockRendererProps {
  blocks?: ContentBlock[];
}

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({ blocks }) => {
  const { lang, t } = useLanguage();
  const [activeImage, setActiveImage] = useState<ProjectImage | null>(null);

  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-10 my-8">
      {/* Lightbox Modal */}
      <DrawingViewerModal image={activeImage} onClose={() => setActiveImage(null)} />

      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading': {
            const HeadingTag = block.level === 3 ? 'h3' : 'h2';
            return (
              <div key={block.id || index} className="pt-4 border-b border-[#D9D8D3] pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-[#F27D26]" />
                  <span className="font-mono-tech text-[10px] uppercase text-[#F27D26] tracking-widest font-bold">
                    // SECTION {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <HeadingTag
                  className={`font-display font-black text-[#151515] uppercase tracking-tight ${
                    block.level === 3 ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
                  }`}
                >
                  {t(block.content)}
                </HeadingTag>
              </div>
            );
          }

          case 'paragraph':
            return (
              <div key={block.id || index} className="font-sans text-base sm:text-lg text-[#2A2A2A] leading-relaxed whitespace-pre-line">
                {t(block.content)}
              </div>
            );

          case 'quote':
            return (
              <div
                key={block.id || index}
                className="my-6 p-6 sm:p-8 bg-[#EAE9E4] border-l-4 border-[#F27D26] space-y-4"
              >
                <div className="flex items-start gap-4">
                  <Quote className="w-8 h-8 text-[#F27D26] shrink-0 opacity-80" />
                  <div className="space-y-2">
                    <p className="font-display italic text-lg sm:text-xl font-bold text-[#151515] leading-relaxed">
                      "{t(block.content)}"
                    </p>
                    {block.caption && (
                      <span className="font-mono-tech text-xs text-[#777] uppercase block tracking-wider font-semibold">
                        — {t(block.caption)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );

          case 'image':
            return (
              <div
                key={block.id || index}
                className={`my-8 space-y-2 ${
                  block.alignment === 'full' ? '-mx-4 sm:-mx-8 lg:-mx-12' : ''
                }`}
              >
                <div
                  className="relative group border border-[#D9D8D3] bg-[#1E1E1E] overflow-hidden cursor-pointer shadow-sm"
                  onClick={() =>
                    setActiveImage({
                      id: `content-${block.id || index}`,
                      url: block.src || '',
                      type: 'Shopdrawing',
                      caption: block.caption ? t(block.caption) : undefined
                    })
                  }
                >
                  <img
                    src={block.src}
                    alt={block.alt || 'Bản vẽ kỹ thuật'}
                    className="w-full object-cover max-h-[550px] transition-transform duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 bg-[#151515]/90 text-white px-4 py-2 text-xs font-mono-tech uppercase">
                      <Maximize2 className="w-4 h-4 text-[#F27D26]" /> Phóng to chi tiết
                    </span>
                  </div>
                </div>
                {block.caption && (
                  <p className="font-mono-tech text-xs text-[#666] italic text-center sm:text-left pt-1">
                    // {t(block.caption)}
                  </p>
                )}
              </div>
            );

          case 'two_column_image':
            return (
              <div key={block.id || index} className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {block.images?.map((img, i) => (
                  <div key={i} className="space-y-2">
                    <div
                      className="relative group border border-[#D9D8D3] bg-[#1E1E1E] overflow-hidden cursor-pointer aspect-[4/3]"
                      onClick={() =>
                        setActiveImage({
                          id: img.id || `two-column-${block.id || index}-${i}`,
                          url: img.url,
                          type: 'Shopdrawing',
                          caption: img.caption ? t(img.caption) : undefined
                        })
                      }
                    >
                      <img
                        src={img.url}
                        alt={img.alt || 'Bản vẽ'}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    {img.caption && (
                      <p className="font-mono-tech text-xs text-[#666] italic">
                        // {t(img.caption)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );

          case 'gallery':
            return (
              <div key={block.id || index} className="my-8 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {block.images?.map((img, i) => (
                    <div key={i} className="space-y-1.5">
                      <div
                        className="relative group border border-[#D9D8D3] bg-[#1E1E1E] overflow-hidden cursor-pointer aspect-video"
                        onClick={() =>
                        setActiveImage({
                          id: img.id || `gallery-${block.id || index}-${i}`,
                          url: img.url,
                            type: 'Shopdrawing',
                            caption: img.caption ? t(img.caption) : undefined
                          })
                        }
                      >
                        <img
                          src={img.url}
                          alt={img.alt || 'Ảnh dự án'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      {img.caption && (
                        <p className="font-mono-tech text-[11px] text-[#777] italic truncate">
                          {t(img.caption)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'bullet_list':
            return (
              <div key={block.id || index} className="my-4 space-y-2.5">
                <ul className="space-y-2 font-sans text-base text-[#2A2A2A]">
                  {block.items?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] mt-2.5 shrink-0" />
                      <span className="leading-relaxed">{t(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case 'numbered_list':
            return (
              <div key={block.id || index} className="my-4 space-y-2.5">
                <ol className="space-y-3 font-sans text-base text-[#2A2A2A]">
                  {block.items?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-[#EAE9E4] p-3.5 border border-[#D9D8D3]">
                      <span className="font-mono-tech font-bold text-[#F27D26] text-sm shrink-0">
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      <span className="leading-relaxed text-[#151515] font-medium">{t(item)}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );

          case 'callout':
            return (
              <div
                key={block.id || index}
                className="my-6 p-5 bg-[#EAE9E4] border-l-4 border-[#F27D26] font-mono-tech text-xs space-y-2"
              >
                {block.title && (
                  <div className="flex items-center gap-2 font-bold text-[#151515] uppercase tracking-wider text-sm">
                    <AlertCircle className="w-4 h-4 text-[#F27D26]" />
                    <span>{t(block.title)}</span>
                  </div>
                )}
                <p className="font-sans text-sm text-[#444] leading-relaxed">
                  {t(block.content)}
                </p>
              </div>
            );

          case 'tech_box':
            return (
              <div
                key={block.id || index}
                className="my-6 p-5 bg-[#151515] text-[#D9D8D3] border border-[#262626] font-mono-tech text-xs space-y-2 shadow-inner"
              >
                {block.title && (
                  <div className="flex items-center gap-2 font-bold text-[#F27D26] uppercase tracking-wider text-xs border-b border-[#2A2A2A] pb-2">
                    <Code2 className="w-4 h-4" />
                    <span>// {t(block.title)}</span>
                  </div>
                )}
                <p className="text-[#A0A09A] leading-relaxed text-xs">
                  {t(block.content)}
                </p>
              </div>
            );

          case 'divider':
            return (
              <div key={block.id || index} className="py-6">
                <hr className="border-t border-[#D9D8D3]" />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
