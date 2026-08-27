import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Heading,
  AlignLeft,
  Quote,
  Image as ImageIcon,
  Columns,
  Grid,
  List,
  ListOrdered,
  AlertCircle,
  Code2,
  Minus,
  Sparkles,
  Layers,
  Upload,
  Globe
} from 'lucide-react';
import { ContentBlock, ContentBlockType, ContentBlockImage } from '../../types';
import { MediaPickerModal } from './MediaPickerModal';

interface RichContentEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
  token: string | null;
  activeLanguage?: 'vi' | 'en';
}

export const RichContentEditor: React.FC<RichContentEditorProps> = ({
  blocks = [],
  onChange,
  token,
  activeLanguage = 'vi'
}) => {
  const safeBlocks = Array.isArray(blocks) ? blocks : [];
  const [langTab, setLangTab] = useState<'vi' | 'en'>(activeLanguage);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<{
    blockId: string;
    subIndex?: number;
    mode: 'single' | 'gallery' | 'two_col_1' | 'two_col_2';
  } | null>(null);

  // Add block helper
  const addBlock = (type: ContentBlockType) => {
    const newId = `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let newBlock: ContentBlock;

    switch (type) {
      case 'heading':
        newBlock = {
          id: newId,
          type: 'heading',
          level: 2,
          content: { vi: 'Tiêu đề phân đoạn mới', en: 'New Section Heading' }
        };
        break;
      case 'paragraph':
        newBlock = {
          id: newId,
          type: 'paragraph',
          content: {
            vi: 'Nội dung chi tiết phân tích biện pháp thi công, bản vẽ hoặc phương án kỹ thuật triển khai...',
            en: 'Detailed technical analysis, shopdrawing specifications, or construction methodologies...'
          }
        };
        break;
      case 'quote':
        newBlock = {
          id: newId,
          type: 'quote',
          content: {
            vi: 'Giải pháp Shopdrawing tối ưu giúp tiết giảm 3.5% hao hụt cốt thép và đẩy nhanh tiến độ nghiệm thu.',
            en: 'Optimized rebar shopdrawings reduced scrap rate by 3.5% and expedited handover cycles.'
          },
          caption: { vi: 'Ban Chỉ Huy Công Trường', en: 'Site Management Board' }
        };
        break;
      case 'image':
        newBlock = {
          id: newId,
          type: 'image',
          src: '/assets/blueprint-placeholder.svg',
          alt: 'Chi tiết bản vẽ kỹ thuật',
          alignment: 'center',
          caption: { vi: 'Bản vẽ mặt bằng kết cấu dầm sàn', en: 'Structural floor plan detailing' }
        };
        break;
      case 'two_column_image':
        newBlock = {
          id: newId,
          type: 'two_column_image',
          images: [
            {
              url: '/assets/blueprint-placeholder.svg',
              alt: 'Bản vẽ 2D',
              caption: { vi: 'Chi tiết cốt thép dầm 2D', en: '2D Rebar Detailing' }
            },
            {
              url: '/assets/blueprint-placeholder.svg',
              alt: 'Mô hình 3D Revit',
              caption: { vi: 'Mô hình 3D Revit phối hợp', en: '3D Revit Model Coordination' }
            }
          ]
        };
        break;
      case 'gallery':
        newBlock = {
          id: newId,
          type: 'gallery',
          images: [
            {
              url: '/assets/blueprint-placeholder.svg',
              alt: 'Ảnh công trường 1',
              caption: { vi: 'Lắp dựng cốt thép dầm chuyển', en: 'Transfer beam rebar assembly' }
            },
            {
              url: '/assets/blueprint-placeholder.svg',
              alt: 'Ảnh công trường 2',
              caption: { vi: 'Nghiệm thu cốt thép dầm sàn', en: 'Beam & slab rebar inspection' }
            },
            {
              url: '/assets/blueprint-placeholder.svg',
              alt: 'Ảnh công trường 3',
              caption: { vi: 'Hoàn thiện hồ sơ nghiệm thu', en: 'Quality assurance sign-off' }
            }
          ]
        };
        break;
      case 'bullet_list':
        newBlock = {
          id: newId,
          type: 'bullet_list',
          items: [
            { vi: 'Kiểm soát xung đột không gian cốt thép tại nút khung dầm cột', en: 'Eliminate spatial congestion at beam-column nodes' },
            { vi: 'Tối ưu hóa bảng thống kê cốt thép (BBS) giảm hao hụt', en: 'Optimize Bar Bending Schedules to minimize scrap' },
            { vi: 'Bám sát nhịp điệu và thứ tự đổ bê tông thực tế', en: 'Synchronize detailing with site concrete pour sequences' }
          ]
        };
        break;
      case 'numbered_list':
        newBlock = {
          id: newId,
          type: 'numbered_list',
          items: [
            { vi: 'Tiếp nhận và rà soát hồ sơ thiết kế cơ sở (IFC/Tender)', en: 'Review Tender/IFC documentation for clash detection' },
            { vi: 'Mô hình hóa chi tiết cốt thép và nút giao kỹ thuật', en: 'Model detailed rebar geometry and technical joints' },
            { vi: 'Trình duyệt hồ sơ và hỗ trợ kỹ thuật tại công trường', en: 'Submit shopdrawings and provide on-site technical support' }
          ]
        };
        break;
      case 'callout':
        newBlock = {
          id: newId,
          type: 'callout',
          title: { vi: 'Lưu ý kỹ thuật quan trọng', en: 'Key Technical Consideration' },
          content: {
            vi: 'Đảm bảo chiều dài đoạn neo nối thép tuân thủ TCVN 5574:2018 và chỉ dẫn kỹ thuật riêng của dự án.',
            en: 'Ensure rebar lap and anchorage lengths strictly comply with TCVN 5574:2018 and project technical specifications.'
          }
        };
        break;
      case 'tech_box':
        newBlock = {
          id: newId,
          type: 'tech_box',
          title: { vi: 'QUY TRÌNH QA/QC DEBRIQ', en: 'DEBRIQ QA/QC WORKFLOW' },
          content: {
            vi: '100% bản vẽ đều qua 2 vòng kiểm duyệt nội bộ (Kỹ sư chủ trì & Trưởng ban Kỹ thuật) trước khi phát hành cho Ban chỉ huy.',
            en: '100% of shopdrawings undergo dual-tier peer review (Lead Engineer & Technical Director) prior to field issuance.'
          }
        };
        break;
      case 'divider':
        newBlock = {
          id: newId,
          type: 'divider'
        };
        break;
      default:
        newBlock = {
          id: newId,
          type: 'paragraph',
          content: { vi: '', en: '' }
        };
    }

    onChange([...safeBlocks, newBlock]);
  };

  // Block manipulations
  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    const updated = safeBlocks.map(b => (b.id === id ? { ...b, ...updates } : b));
    onChange(updated);
  };

  const deleteBlock = (id: string) => {
    onChange(safeBlocks.filter(b => b.id !== id));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === safeBlocks.length - 1) return;

    const newBlocks = [...safeBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    onChange(newBlocks);
  };

  const duplicateBlock = (block: ContentBlock) => {
    const newBlock: ContentBlock = {
      ...JSON.parse(JSON.stringify(block)),
      id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    const index = safeBlocks.findIndex(b => b.id === block.id);
    const newBlocks = [...safeBlocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
  };

  // Media selection handler
  const handleMediaSelected = (media: { url: string; altText?: string }) => {
    if (!activeMediaTarget) return;
    const { blockId, subIndex, mode } = activeMediaTarget;
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    if (mode === 'single') {
      updateBlock(blockId, {
        src: media.url,
        alt: media.altText || block.alt || 'Bản vẽ kỹ thuật DEBRIQ'
      });
    } else if (mode === 'gallery') {
      const images = [...(block.images || [])];
      if (subIndex !== undefined && subIndex < images.length) {
        images[subIndex] = {
          ...images[subIndex],
          url: media.url,
          alt: media.altText || images[subIndex].alt
        };
      } else {
        images.push({
          url: media.url,
          alt: media.altText || 'Ảnh dự án',
          caption: { vi: media.altText || 'Chi tiết hình ảnh', en: media.altText || 'Image detail' }
        });
      }
      updateBlock(blockId, { images });
    } else if (mode === 'two_col_1' || mode === 'two_col_2') {
      const images = [...(block.images || [{ url: '', caption: { vi: '', en: '' } }, { url: '', caption: { vi: '', en: '' } }])];
      const colIndex = mode === 'two_col_1' ? 0 : 1;
      images[colIndex] = {
        ...images[colIndex],
        url: media.url,
        alt: media.altText || images[colIndex]?.alt
      };
      updateBlock(blockId, { images });
    }
  };

  // Helper for bilingual content values
  const getBilingualValue = (val: string | { vi: string; en: string } | undefined, lang: 'vi' | 'en'): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[lang] || '';
  };

  const setBilingualValue = (
    currentVal: string | { vi: string; en: string } | undefined,
    newValue: string,
    lang: 'vi' | 'en'
  ): { vi: string; en: string } => {
    if (typeof currentVal === 'string') {
      return {
        vi: lang === 'vi' ? newValue : currentVal,
        en: lang === 'en' ? newValue : currentVal
      };
    }
    return {
      vi: lang === 'vi' ? newValue : currentVal?.vi || '',
      en: lang === 'en' ? newValue : currentVal?.en || ''
    };
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => {
          setMediaPickerOpen(false);
          setActiveMediaTarget(null);
        }}
        onSelect={handleMediaSelected}
        token={token}
      />

      {/* Editor Top Bar: Language tabs & Block count */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#18181b] p-3.5 rounded-lg border border-[#27272a]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#f27d26]" />
          <span className="text-xs font-semibold text-white uppercase tracking-wider">
            Khối nội dung chi tiết ({safeBlocks.length})
          </span>
          <span className="text-[11px] text-neutral-400">
            • Soạn thảo linh hoạt theo dạng Block như WordPress
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#121215] p-1 rounded-lg border border-[#27272a]">
          <button
            type="button"
            onClick={() => setLangTab('vi')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              langTab === 'vi'
                ? 'bg-[#f27d26] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🇻🇳 Tiếng Việt (Mặc định)
          </button>
          <button
            type="button"
            onClick={() => setLangTab('en')}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              langTab === 'en'
                ? 'bg-[#f27d26] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🇬🇧 English
          </button>
        </div>
      </div>

      {/* Blocks List */}
      <div className="space-y-4">
        {safeBlocks.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-[#27272a] rounded-xl text-center space-y-3 bg-[#18181b]/50">
            <Sparkles className="w-8 h-8 mx-auto text-[#f27d26]" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">Chưa có khối nội dung nào</p>
              <p className="text-xs text-neutral-400">
                Thêm các đoạn văn bản, tiêu đề, ảnh bản vẽ, bảng liệt kê hoặc hộp chú thích kỹ thuật bên dưới
              </p>
            </div>
          </div>
        ) : (
          safeBlocks.map((block, index) => {
            return (
              <div
                key={block.id}
                className="bg-[#18181b] border border-[#27272a] hover:border-[#3f3f46] rounded-xl p-4 sm:p-5 transition-all shadow-sm group"
              >
                {/* Block Card Header */}
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3 mb-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#27272a] text-[#f27d26] flex items-center justify-center font-bold text-[10px]">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      {block.type === 'heading' && <><Heading className="w-3.5 h-3.5 text-[#f27d26]" /> Tiêu đề phân đoạn ({block.level === 3 ? 'H3' : 'H2'})</>}
                      {block.type === 'paragraph' && <><AlignLeft className="w-3.5 h-3.5 text-blue-400" /> Đoạn văn bản mô tả</>}
                      {block.type === 'quote' && <><Quote className="w-3.5 h-3.5 text-amber-400" /> Trích dẫn / Đánh giá</>}
                      {block.type === 'image' && <><ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Hình ảnh / Bản vẽ đơn</>}
                      {block.type === 'two_column_image' && <><Columns className="w-3.5 h-3.5 text-purple-400" /> Hai ảnh so sánh 2 cột</>}
                      {block.type === 'gallery' && <><Grid className="w-3.5 h-3.5 text-cyan-400" /> Bộ sưu tập ảnh (Gallery)</>}
                      {block.type === 'bullet_list' && <><List className="w-3.5 h-3.5 text-orange-400" /> Danh sách gạch đầu dòng</>}
                      {block.type === 'numbered_list' && <><ListOrdered className="w-3.5 h-3.5 text-yellow-400" /> Danh sách theo thứ tự bước</>}
                      {block.type === 'callout' && <><AlertCircle className="w-3.5 h-3.5 text-red-400" /> Hộp lưu ý quan trọng</>}
                      {block.type === 'tech_box' && <><Code2 className="w-3.5 h-3.5 text-teal-400" /> Khung thông số kỹ thuật</>}
                      {block.type === 'divider' && <><Minus className="w-3.5 h-3.5 text-neutral-400" /> Đường phân cách</>}
                    </span>
                  </div>

                  {/* Block Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveBlock(index, 'up')}
                      className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 rounded hover:bg-[#27272a] transition-colors cursor-pointer"
                      title="Di chuyển lên"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === blocks.length - 1}
                      onClick={() => moveBlock(index, 'down')}
                      className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 rounded hover:bg-[#27272a] transition-colors cursor-pointer"
                      title="Di chuyển xuống"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateBlock(block)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-[#27272a] transition-colors cursor-pointer"
                      title="Nhân bản khối này"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteBlock(block.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-950/40 transition-colors cursor-pointer ml-1"
                      title="Xóa khối"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Block Content Inputs */}
                <div className="space-y-3">
                  {/* 1. HEADING */}
                  {block.type === 'heading' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={block.level || 2}
                          onChange={(e) => updateBlock(block.id, { level: Number(e.target.value) as 2 | 3 })}
                          className="bg-[#121215] border border-[#3f3f46] rounded px-2 py-1 text-xs text-white"
                        >
                          <option value={2}>Cỡ H2 (Tiêu đề lớn)</option>
                          <option value={3}>Cỡ H3 (Tiêu đề phụ)</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={getBilingualValue(block.content, langTab)}
                        onChange={(e) => {
                          const updated = setBilingualValue(block.content, e.target.value, langTab);
                          updateBlock(block.id, { content: updated });
                        }}
                        placeholder={langTab === 'vi' ? 'Nhập tiêu đề phân đoạn...' : 'Enter section heading...'}
                        className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-[#f27d26]"
                      />
                    </div>
                  )}

                  {/* 2. PARAGRAPH */}
                  {block.type === 'paragraph' && (
                    <textarea
                      rows={4}
                      value={getBilingualValue(block.content, langTab)}
                      onChange={(e) => {
                        const updated = setBilingualValue(block.content, e.target.value, langTab);
                        updateBlock(block.id, { content: updated });
                      }}
                      placeholder={langTab === 'vi' ? 'Nhập nội dung văn bản chi tiết (hỗ trợ xuống dòng)...' : 'Enter paragraph text...'}
                      className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg p-3 text-xs text-neutral-200 leading-relaxed focus:outline-none focus:border-[#f27d26]"
                    />
                  )}

                  {/* 3. QUOTE */}
                  {block.type === 'quote' && (
                    <div className="space-y-2.5">
                      <textarea
                        rows={2}
                        value={getBilingualValue(block.content, langTab)}
                        onChange={(e) => {
                          const updated = setBilingualValue(block.content, e.target.value, langTab);
                          updateBlock(block.id, { content: updated });
                        }}
                        placeholder="Nội dung câu trích dẫn hoặc nhận xét..."
                        className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg p-3 text-xs italic text-amber-200 focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        value={getBilingualValue(block.caption, langTab)}
                        onChange={(e) => {
                          const updated = setBilingualValue(block.caption, e.target.value, langTab);
                          updateBlock(block.id, { caption: updated });
                        }}
                        placeholder="Tác giả / Ban chỉ huy / Nguồn trích dẫn..."
                        className="w-full bg-[#121215] border border-[#3f3f46] rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-[#f27d26]"
                      />
                    </div>
                  )}

                  {/* 4. SINGLE IMAGE */}
                  {block.type === 'image' && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="relative w-full sm:w-48 aspect-video bg-[#121215] border border-[#3f3f46] rounded-lg overflow-hidden shrink-0">
                          {block.src ? (
                            <img src={block.src} alt={block.alt || ''} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-neutral-500 text-xs">
                              Chưa có ảnh
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-2.5 w-full">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMediaTarget({ blockId: block.id, mode: 'single' });
                                setMediaPickerOpen(true);
                              }}
                              className="px-3 py-1.5 bg-[#f27d26] text-white rounded text-xs font-semibold hover:bg-[#d96716] flex items-center gap-1.5 cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Chọn từ Media / Tải ảnh lên</span>
                            </button>
                            
                            <select
                              value={block.alignment || 'center'}
                              onChange={(e) => updateBlock(block.id, { alignment: e.target.value as any })}
                              className="bg-[#121215] border border-[#3f3f46] rounded px-2.5 py-1.5 text-xs text-white"
                            >
                              <option value="center">Căn giữa</option>
                              <option value="full">Tràn viền (Full Width)</option>
                              <option value="left">Căn trái</option>
                              <option value="right">Căn phải</option>
                            </select>
                          </div>

                          <input
                            type="text"
                            value={block.src || ''}
                            onChange={(e) => updateBlock(block.id, { src: e.target.value })}
                            placeholder="URL hình ảnh (hoặc dùng nút Chọn Media ở trên)"
                            className="w-full bg-[#121215] border border-[#3f3f46] rounded px-3 py-1.5 text-xs text-neutral-300 font-mono focus:outline-none focus:border-[#f27d26]"
                          />

                          <input
                            type="text"
                            value={getBilingualValue(block.caption, langTab)}
                            onChange={(e) => {
                              const updated = setBilingualValue(block.caption, e.target.value, langTab);
                              updateBlock(block.id, { caption: updated });
                            }}
                            placeholder="Chú thích dưới chân hình ảnh..."
                            className="w-full bg-[#121215] border border-[#3f3f46] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. TWO COLUMN IMAGES */}
                  {block.type === 'two_column_image' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[0, 1].map((colIdx) => {
                        const img = block.images?.[colIdx] || { url: '', caption: { vi: '', en: '' } };
                        return (
                          <div key={colIdx} className="bg-[#121215] p-3 rounded-lg border border-[#27272a] space-y-2.5">
                            <div className="flex items-center justify-between text-xs text-neutral-400">
                              <span className="font-medium text-white">Cột ảnh #{colIdx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMediaTarget({
                                    blockId: block.id,
                                    mode: colIdx === 0 ? 'two_col_1' : 'two_col_2'
                                  });
                                  setMediaPickerOpen(true);
                                }}
                                className="text-[#f27d26] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Upload className="w-3 h-3" /> Chọn ảnh
                              </button>
                            </div>

                            <div className="aspect-video bg-[#18181b] rounded border border-[#3f3f46] overflow-hidden">
                              {img.url ? (
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="flex items-center justify-center h-full text-neutral-500 text-xs">
                                  Chưa chọn ảnh
                                </div>
                              )}
                            </div>

                            <input
                              type="text"
                              value={img.url || ''}
                              onChange={(e) => {
                                const newImages = [...(block.images || [{ url: '', caption: { vi: '', en: '' } }, { url: '', caption: { vi: '', en: '' } }])];
                                newImages[colIdx] = { ...newImages[colIdx], url: e.target.value };
                                updateBlock(block.id, { images: newImages });
                              }}
                              placeholder="URL ảnh cột..."
                              className="w-full bg-[#18181b] border border-[#3f3f46] rounded px-2.5 py-1 text-xs text-neutral-300 font-mono"
                            />

                            <input
                              type="text"
                              value={getBilingualValue(img.caption, langTab)}
                              onChange={(e) => {
                                const newImages = [...(block.images || [{ url: '', caption: { vi: '', en: '' } }, { url: '', caption: { vi: '', en: '' } }])];
                                const updatedCaption = setBilingualValue(img.caption, e.target.value, langTab);
                                newImages[colIdx] = { ...newImages[colIdx], caption: updatedCaption };
                                updateBlock(block.id, { images: newImages });
                              }}
                              placeholder="Chú thích ảnh cột..."
                              className="w-full bg-[#18181b] border border-[#3f3f46] rounded px-2.5 py-1 text-xs text-white"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* 6. GALLERY */}
                  {block.type === 'gallery' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">
                          Danh sách ảnh ({block.images?.length || 0} ảnh):
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMediaTarget({ blockId: block.id, mode: 'gallery' });
                            setMediaPickerOpen(true);
                          }}
                          className="px-3 py-1 bg-[#f27d26] text-white rounded text-xs font-semibold hover:bg-[#d96716] flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Thêm ảnh vào Gallery
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {block.images?.map((img, imgIdx) => (
                          <div key={imgIdx} className="bg-[#121215] p-2 rounded-lg border border-[#27272a] space-y-2 relative group/item">
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = block.images?.filter((_, i) => i !== imgIdx);
                                updateBlock(block.id, { images: newImages });
                              }}
                              className="absolute top-3 right-3 p-1 bg-red-600 text-white rounded shadow opacity-0 group-hover/item:opacity-100 transition-opacity cursor-pointer z-10"
                              title="Xóa ảnh này khỏi Gallery"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>

                            <div className="aspect-video bg-[#18181b] rounded overflow-hidden">
                              <img src={img.url} alt="" className="w-full h-full object-cover" />
                            </div>

                            <input
                              type="text"
                              value={getBilingualValue(img.caption, langTab)}
                              onChange={(e) => {
                                const newImages = [...(block.images || [])];
                                const updatedCaption = setBilingualValue(img.caption, e.target.value, langTab);
                                newImages[imgIdx] = { ...newImages[imgIdx], caption: updatedCaption };
                                updateBlock(block.id, { images: newImages });
                              }}
                              placeholder="Chú thích ảnh..."
                              className="w-full bg-[#18181b] border border-[#3f3f46] rounded px-2 py-1 text-xs text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 7 & 8. BULLET & NUMBERED LIST */}
                  {(block.type === 'bullet_list' || block.type === 'numbered_list') && (
                    <div className="space-y-2.5">
                      {block.items?.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2">
                          <span className="w-6 text-neutral-400 font-mono text-xs text-center shrink-0">
                            {block.type === 'bullet_list' ? '•' : `${itemIdx + 1}.`}
                          </span>
                          <input
                            type="text"
                            value={getBilingualValue(item, langTab)}
                            onChange={(e) => {
                              const newItems = [...(block.items || [])];
                              newItems[itemIdx] = setBilingualValue(item, e.target.value, langTab);
                              updateBlock(block.id, { items: newItems });
                            }}
                            placeholder={`Mục danh sách #${itemIdx + 1}...`}
                            className="flex-1 bg-[#121215] border border-[#3f3f46] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#f27d26]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = block.items?.filter((_, i) => i !== itemIdx);
                              updateBlock(block.id, { items: newItems });
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-[#27272a] transition-colors cursor-pointer"
                            title="Xóa mục"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const newItems = [...(block.items || []), { vi: '', en: '' }];
                          updateBlock(block.id, { items: newItems });
                        }}
                        className="px-3 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-neutral-200 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer mt-1"
                      >
                        <Plus className="w-3 h-3" /> Thêm dòng
                      </button>
                    </div>
                  )}

                  {/* 9. CALLOUT */}
                  {block.type === 'callout' && (
                    <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg space-y-2">
                      <input
                        type="text"
                        value={getBilingualValue(block.title, langTab)}
                        onChange={(e) => {
                          const updated = setBilingualValue(block.title, e.target.value, langTab);
                          updateBlock(block.id, { title: updated });
                        }}
                        placeholder="Tiêu đề hộp lưu ý..."
                        className="w-full bg-[#121215] border border-red-900/50 rounded px-3 py-1.5 text-xs font-bold text-red-200"
                      />
                      <textarea
                        rows={3}
                        value={getBilingualValue(block.content, langTab)}
                        onChange={(e) => {
                          const updated = setBilingualValue(block.content, e.target.value, langTab);
                          updateBlock(block.id, { content: updated });
                        }}
                        placeholder="Nội dung chi tiết cảnh báo hoặc chỉ dẫn..."
                        className="w-full bg-[#121215] border border-[#3f3f46] rounded p-2.5 text-xs text-neutral-200 leading-relaxed"
                      />
                    </div>
                  )}

                  {/* 10. TECH BOX */}
                  {block.type === 'tech_box' && (
                    <div className="p-3 bg-teal-950/20 border border-teal-900/40 rounded-lg space-y-2">
                      <input
                        type="text"
                        value={getBilingualValue(block.title, langTab)}
                        onChange={(e) => {
                          const updated = setBilingualValue(block.title, e.target.value, langTab);
                          updateBlock(block.id, { title: updated });
                        }}
                        placeholder="Tiêu đề bảng thông số kỹ thuật..."
                        className="w-full bg-[#121215] border border-teal-900/50 rounded px-3 py-1.5 text-xs font-bold text-teal-200"
                      />
                      <textarea
                        rows={3}
                        value={getBilingualValue(block.content, langTab)}
                        onChange={(e) => {
                          const updated = setBilingualValue(block.content, e.target.value, langTab);
                          updateBlock(block.id, { content: updated });
                        }}
                        placeholder="Nội dung chi tiết thông số, quy chuẩn QA/QC..."
                        className="w-full bg-[#121215] border border-[#3f3f46] rounded p-2.5 text-xs text-neutral-200 leading-relaxed font-mono"
                      />
                    </div>
                  )}

                  {/* 11. DIVIDER */}
                  {block.type === 'divider' && (
                    <div className="py-2">
                      <hr className="border-t border-[#3f3f46]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Block Floating / Bar Menu */}
      <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
          <Plus className="w-4 h-4 text-[#f27d26]" />
          <span>Thêm khối nội dung mới vào trang:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => addBlock('heading')}
            className="p-2.5 bg-[#121215] hover:bg-[#27272a] border border-[#27272a] hover:border-[#f27d26] rounded-lg text-left transition-all cursor-pointer space-y-1"
          >
            <Heading className="w-4 h-4 text-[#f27d26]" />
            <span className="text-xs font-medium text-white block">Tiêu đề (H2/H3)</span>
            <span className="text-[10px] text-neutral-400 block">Phân đoạn bài</span>
          </button>

          <button
            type="button"
            onClick={() => addBlock('paragraph')}
            className="p-2.5 bg-[#121215] hover:bg-[#27272a] border border-[#27272a] hover:border-blue-500 rounded-lg text-left transition-all cursor-pointer space-y-1"
          >
            <AlignLeft className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium text-white block">Đoạn văn</span>
            <span className="text-[10px] text-neutral-400 block">Văn bản chi tiết</span>
          </button>

          <button
            type="button"
            onClick={() => addBlock('image')}
            className="p-2.5 bg-[#121215] hover:bg-[#27272a] border border-[#27272a] hover:border-emerald-500 rounded-lg text-left transition-all cursor-pointer space-y-1"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-white block">Hình ảnh đơn</span>
            <span className="text-[10px] text-neutral-400 block">Bản vẽ hoặc ảnh</span>
          </button>

          <button
            type="button"
            onClick={() => addBlock('two_column_image')}
            className="p-2.5 bg-[#121215] hover:bg-[#27272a] border border-[#27272a] hover:border-purple-500 rounded-lg text-left transition-all cursor-pointer space-y-1"
          >
            <Columns className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-white block">Ảnh 2 cột</span>
            <span className="text-[10px] text-neutral-400 block">So sánh song song</span>
          </button>

          <button
            type="button"
            onClick={() => addBlock('gallery')}
            className="p-2.5 bg-[#121215] hover:bg-[#27272a] border border-[#27272a] hover:border-cyan-500 rounded-lg text-left transition-all cursor-pointer space-y-1"
          >
            <Grid className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-white block">Bộ sưu tập ảnh</span>
            <span className="text-[10px] text-neutral-400 block">Nhiều ảnh lưới</span>
          </button>

          <button
            type="button"
            onClick={() => addBlock('bullet_list')}
            className="p-2.5 bg-[#121215] hover:bg-[#27272a] border border-[#27272a] hover:border-orange-500 rounded-lg text-left transition-all cursor-pointer space-y-1"
          >
            <List className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-medium text-white block">Danh sách điểm</span>
            <span className="text-[10px] text-neutral-400 block">Gạch đầu dòng</span>
          </button>

          <button
            type="button"
            onClick={() => addBlock('numbered_list')}
            className="p-2.5 bg-[#121215] hover:bg-[#27272a] border border-[#27272a] hover:border-yellow-500 rounded-lg text-left transition-all cursor-pointer space-y-1"
          >
            <ListOrdered className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-medium text-white block">Danh sách bước</span>
            <span className="text-[10px] text-neutral-400 block">Quy trình 1, 2, 3</span>
          </button>

          <button
            type="button"
            onClick={() => addBlock('quote')}
            className="p-2.5 bg-[#121215] hover:bg-[#27272a] border border-[#27272a] hover:border-amber-500 rounded-lg text-left transition-all cursor-pointer space-y-1"
          >
            <Quote className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-white block">Trích dẫn</span>
            <span className="text-[10px] text-neutral-400 block">Lời đánh giá</span>
          </button>

          <button
            type="button"
            onClick={() => addBlock('callout')}
            className="p-2.5 bg-[#121215] hover:bg-[#27272a] border border-[#27272a] hover:border-red-500 rounded-lg text-left transition-all cursor-pointer space-y-1"
          >
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-medium text-white block">Hộp lưu ý</span>
            <span className="text-[10px] text-neutral-400 block">Cảnh báo kỹ thuật</span>
          </button>

          <button
            type="button"
            onClick={() => addBlock('tech_box')}
            className="p-2.5 bg-[#121215] hover:bg-[#27272a] border border-[#27272a] hover:border-teal-500 rounded-lg text-left transition-all cursor-pointer space-y-1"
          >
            <Code2 className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-medium text-white block">Khung thông số</span>
            <span className="text-[10px] text-neutral-400 block">Quy chuẩn QA/QC</span>
          </button>

          <button
            type="button"
            onClick={() => addBlock('divider')}
            className="p-2.5 bg-[#121215] hover:bg-[#27272a] border border-[#27272a] hover:border-neutral-400 rounded-lg text-left transition-all cursor-pointer space-y-1"
          >
            <Minus className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-medium text-white block">Đường kẻ ngăn</span>
            <span className="text-[10px] text-neutral-400 block">Phân cách đoạn</span>
          </button>
        </div>
      </div>
    </div>
  );
};
