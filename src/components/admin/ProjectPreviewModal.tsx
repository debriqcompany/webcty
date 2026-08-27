import React from 'react';
import { X, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { Project } from '../../types';
import { ContentBlockRenderer } from '../public/ContentBlockRenderer';

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-display">
      <div className="bg-[#F3F2EE] text-[#151515] border border-[#D9D8D3] rounded-xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Preview Control Bar */}
        <div className="p-4 bg-[#151515] text-white border-b border-[#333] flex items-center justify-between font-mono-tech text-xs">
          <div className="flex items-center gap-3">
            <span className="bg-[#F27D26] text-white px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Eye className="w-3 h-3" /> XEM TRƯỚC BẢN CÔNG KHAI
            </span>
            <span className="text-[#888] hidden sm:inline">
              Mô phỏng hiển thị trực tiếp giao diện người dùng
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-[#27272a] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Preview Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12 space-y-12">
          
          {/* Header */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono-tech text-xs bg-[#F27D26] text-white px-2.5 py-1 uppercase font-bold tracking-wider">
                CASE STUDY // {project.period || '2024'}
              </span>
              {project.services?.map((svc, i) => (
                <span key={i} className="font-mono-tech text-xs bg-[#E2E1DC] text-[#151515] px-3 py-1 uppercase font-medium">
                  {svc}
                </span>
              ))}
            </div>

            <div>
              <h1 className="font-display text-3xl sm:text-5xl font-black text-[#151515] uppercase tracking-tight leading-[1.05]">
                {project.name?.vi || 'Tên dự án'}
              </h1>
              {project.subtitle?.vi && (
                <p className="font-sans text-lg text-[#555] mt-2 italic">
                  {project.subtitle.vi}
                </p>
              )}
            </div>

            {/* Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#EAE9E4] p-5 border border-[#D9D8D3] font-mono-tech text-xs">
              <div>
                <span className="text-[#8D8D88] uppercase block text-[10px] mb-1">
                  // KHÁCH HÀNG TRỰC TIẾP
                </span>
                <span className="font-bold text-sm text-[#151515]">{project.directClient || 'Chưa cập nhật'}</span>
              </div>
              <div>
                <span className="text-[#8D8D88] uppercase block text-[10px] mb-1">
                  // CHỦ ĐẦU TƯ
                </span>
                <span className="font-medium text-xs text-[#262626]">{project.projectOwner || 'Chủ đầu tư'}</span>
              </div>
              <div>
                <span className="text-[#8D8D88] uppercase block text-[10px] mb-1">
                  // TỔNG THẦU
                </span>
                <span className="font-medium text-xs text-[#262626]">{project.mainContractor || project.directClient}</span>
              </div>
              <div>
                <span className="text-[#8D8D88] uppercase block text-[10px] mb-1">
                  // QUY MÔ
                </span>
                <span className="font-bold text-sm text-[#F27D26]">{project.scaleMetric || project.scale?.vi || 'Quy mô'}</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          {project.heroImage && (
            <div className="border border-[#D9D8D3] bg-[#1E1E1E] overflow-hidden shadow-lg">
              <img
                src={project.heroImage}
                alt=""
                className="w-full max-h-[550px] object-cover"
              />
            </div>
          )}

          {/* Scope narrative */}
          {project.scope?.vi && (
            <div className="space-y-3">
              <div className="border-b border-[#D9D8D3] pb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#F27D26]" />
                <h2 className="font-mono-tech text-xs uppercase tracking-widest font-bold text-[#151515]">
                  PHẠM VI THỰC HIỆN CỦA DEBRIQ
                </h2>
              </div>
              <p className="font-sans text-xl text-[#262626] leading-relaxed">
                {project.scope.vi}
              </p>
            </div>
          )}

          {/* Render Rich Content Blocks */}
          {project.contentBlocks && project.contentBlocks.length > 0 && (
            <div className="border-t border-[#D9D8D3] pt-6">
              <ContentBlockRenderer blocks={project.contentBlocks} />
            </div>
          )}

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
