import React from 'react';
import { X, Eye, Clock, Calendar } from 'lucide-react';
import { Article } from '../../types';
import { ContentBlockRenderer } from '../public/ContentBlockRenderer';

interface ArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
}

export const ArticlePreviewModal: React.FC<ArticlePreviewModalProps> = ({
  isOpen,
  onClose,
  article
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-display">
      <div className="bg-[#F3F2EE] text-[#151515] border border-[#D9D8D3] rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Preview Control Bar */}
        <div className="p-4 bg-[#151515] text-white border-b border-[#333] flex items-center justify-between font-mono-tech text-xs">
          <div className="flex items-center gap-3">
            <span className="bg-[#F27D26] text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Eye className="w-3 h-3" /> XEM TRƯỚC BÀI VIẾT CÔNG KHAI
            </span>
            <span className="text-[#888] hidden sm:inline">
              Mô phỏng hiển thị bài viết trên website
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-[#27272a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
          
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 font-mono-tech text-xs">
              <span className="bg-[#F27D26] text-white px-2.5 py-1 uppercase font-bold tracking-wider">
                {article.category?.replace(/-/g, ' ') || 'INSIGHTS'}
              </span>
              {article.readingTimeMinutes && (
                <span className="bg-[#E2E1DC] text-[#151515] px-3 py-1 uppercase font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F27D26]" /> {article.readingTimeMinutes} min read
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-black text-[#151515] uppercase tracking-tight leading-[1.1]">
              {article.title?.vi || 'Tiêu đề bài viết'}
            </h1>

            {article.excerpt?.vi && (
              <p className="font-sans text-lg text-[#555] leading-relaxed italic border-l-2 border-[#F27D26] pl-4">
                {article.excerpt.vi}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2 font-mono-tech text-xs text-[#666]">
              <div className="w-8 h-8 rounded-full bg-[#151515] text-[#F27D26] flex items-center justify-center font-bold">
                DQ
              </div>
              <div>
                <span className="font-bold text-[#151515] block uppercase">{article.author || 'Ban Kỹ Thuật DEBRIQ'}</span>
                <span className="text-[11px] text-[#888]">DEBRIQ ENGINEERING EDITORIAL DESK</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          {article.heroImage && (
            <div className="border border-[#D9D8D3] bg-[#1E1E1E] overflow-hidden shadow-lg">
              <img
                src={article.heroImage}
                alt=""
                className="w-full max-h-[450px] object-cover"
              />
            </div>
          )}

          {/* Render Rich Content Blocks */}
          <div className="font-sans">
            <ContentBlockRenderer blocks={article.contentBlocks} />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EAE9E4] border-t border-[#D9D8D3] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#151515] text-white rounded text-xs font-mono-tech uppercase font-bold hover:bg-[#F27D26] transition-colors cursor-pointer"
          >
            ĐÓNG BẢN XEM TRƯỚC
          </button>
        </div>

      </div>
    </div>
  );
};
