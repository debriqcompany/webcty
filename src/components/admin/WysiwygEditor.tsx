import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Table as TableIcon, 
  Code, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Undo, 
  Redo, 
  RemoveFormatting,
  Sparkles,
  Upload,
  FileCode2,
  Check
} from 'lucide-react';
import { MediaPickerModal } from './MediaPickerModal';

interface WysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  token: string | null;
  minHeight?: string;
}

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Nhập nội dung bài viết kỹ thuật tại đây...',
  token,
  minHeight = '420px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlMode, setHtmlMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(value);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);

  // Sync initial content
  useEffect(() => {
    if (editorRef.current && !htmlMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setRawHtml(value || '');
  }, [value, htmlMode]);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelection(sel.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    if (savedSelection) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedSelection);
    }
  };

  const exec = (command: string, val: string | undefined = undefined) => {
    if (htmlMode) return;
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      setRawHtml(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setRawHtml(html);
    }
  };

  const handleInsertLink = () => {
    saveSelection();
    const url = prompt('Nhập đường dẫn liên kết (URL):', 'https://');
    if (url) {
      exec('createLink', url);
    }
  };

  const handleOpenMedia = () => {
    saveSelection();
    setMediaPickerOpen(true);
  };

  const handleMediaSelected = (media: { url: string; altText?: string }) => {
    setMediaPickerOpen(false);
    restoreSelection();
    
    // Insert modern figure with responsive image and caption
    const imageHtml = `
      <figure class="my-6">
        <img src="${media.url}" alt="${media.altText || 'DEBRIQ Kỹ thuật'}" class="w-full max-w-3xl mx-auto rounded border border-[#333] shadow-lg" />
        ${media.altText ? `<figcaption class="text-center text-xs text-[#888] mt-2 italic font-mono-tech">${media.altText}</figcaption>` : ''}
      </figure>
      <p><br></p>
    `;
    exec('insertHTML', imageHtml);
  };

  const handleInsertCallout = () => {
    saveSelection();
    const calloutHtml = `
      <div class="my-6 p-4 bg-[#1E1E22] border-l-4 border-[#F27D26] text-[#DDD] rounded-r space-y-1">
        <strong class="text-[#F27D26] font-mono-tech text-xs uppercase block">📌 LƯU Ý KỸ THUẬT DEBRIQ //</strong>
        <p class="text-sm font-sans">Nhập ghi chú hoặc quy tắc kiểm soát hồ sơ tại đây...</p>
      </div>
      <p><br></p>
    `;
    exec('insertHTML', calloutHtml);
  };

  const handleInsertTable = () => {
    saveSelection();
    const tableHtml = `
      <div class="overflow-x-auto my-6">
        <table class="w-full text-left text-xs border border-[#333] border-collapse">
          <thead>
            <tr class="bg-[#242428] text-white">
              <th class="border border-[#444] p-2.5 font-bold">Hạng mục cấu kiện</th>
              <th class="border border-[#444] p-2.5 font-bold">Tiêu chuẩn kỹ thuật</th>
              <th class="border border-[#444] p-2.5 font-bold">Quy cách nghiệm thu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-[#333] p-2 text-[#CCC]">Dầm chuyển nút khung</td>
              <td class="border border-[#333] p-2 text-[#CCC]">TCVN 5574:2018</td>
              <td class="border border-[#333] p-2 text-[#CCC]">Kiểm soát mật độ rebar L/3</td>
            </tr>
            <tr>
              <td class="border border-[#333] p-2 text-[#CCC]">Cốt thép sàn vượt nhịp</td>
              <td class="border border-[#333] p-2 text-[#CCC]">BBS Tối ưu hóa</td>
              <td class="border border-[#333] p-2 text-[#CCC]">Hao hụt &lt; 1.5%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><br></p>
    `;
    exec('insertHTML', tableHtml);
  };

  return (
    <div className="bg-[#141416] border border-[#333] rounded-lg overflow-hidden shadow-inner flex flex-col">
      
      {/* WYSIWYG Toolbar */}
      <div className="bg-[#1C1C20] border-b border-[#333] p-2 flex flex-wrap items-center gap-1 text-xs select-none">
        
        {/* Headings */}
        <div className="flex items-center gap-0.5 border-r border-[#333] pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => exec('formatBlock', '<h2>')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer"
            title="Tiêu đề chính (H2)"
          >
            <Heading2 className="w-4 h-4 text-[#F27D26]" />
          </button>
          <button
            type="button"
            onClick={() => exec('formatBlock', '<h3>')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer"
            title="Tiêu đề phụ (H3)"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('formatBlock', '<p>')}
            className="px-2 py-1 hover:bg-[#2A2A30] text-[11px] text-[#AAA] hover:text-white rounded cursor-pointer font-sans"
            title="Đoạn văn thường (P)"
          >
            Văn bản
          </button>
        </div>

        {/* Formatting */}
        <div className="flex items-center gap-0.5 border-r border-[#333] pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => exec('bold')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer font-bold"
            title="In đậm (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('italic')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer italic"
            title="In nghiêng (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('underline')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer underline"
            title="Gạch chân"
          >
            <Underline className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 border-r border-[#333] pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => exec('insertUnorderedList')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer"
            title="Danh sách gạch đầu dòng"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('insertOrderedList')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer"
            title="Danh sách số 1, 2, 3"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('formatBlock', '<blockquote>')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer"
            title="Trích dẫn"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Advanced Embeds */}
        <div className="flex items-center gap-1 border-r border-[#333] pr-1.5 mr-1">
          <button
            type="button"
            onClick={handleOpenMedia}
            className="px-2.5 py-1 bg-[#26262C] hover:bg-[#34343C] text-white rounded inline-flex items-center gap-1 cursor-pointer font-medium text-xs border border-[#444]"
            title="Chèn hình ảnh từ Media hoặc Upload"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#F27D26]" />
            <span>Chèn Ảnh</span>
          </button>

          <button
            type="button"
            onClick={handleInsertCallout}
            className="px-2.5 py-1 bg-[#26262C] hover:bg-[#34343C] text-white rounded inline-flex items-center gap-1 cursor-pointer font-medium text-xs border border-[#444]"
            title="Hộp lưu ý kỹ thuật nổi bật"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F27D26]" />
            <span>Hộp Ghi chú</span>
          </button>

          <button
            type="button"
            onClick={handleInsertTable}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer"
            title="Chèn bảng kỹ thuật"
          >
            <TableIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleInsertLink}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer"
            title="Chèn liên kết"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 border-r border-[#333] pr-1.5 mr-1">
          <button
            type="button"
            onClick={() => exec('justifyLeft')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer"
            title="Căn trái"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('justifyCenter')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer"
            title="Căn giữa"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('justifyRight')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#CCC] hover:text-white rounded cursor-pointer"
            title="Căn phải"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Undo / Redo & Clear */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => exec('undo')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#888] hover:text-white rounded cursor-pointer"
            title="Hoàn tác (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => exec('redo')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#888] hover:text-white rounded cursor-pointer"
            title="Làm lại (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => exec('removeFormat')}
            className="p-1.5 hover:bg-[#2A2A30] text-[#888] hover:text-white rounded cursor-pointer"
            title="Xóa định dạng"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode Switcher: Visual WYSIWYG vs Code */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              if (htmlMode && editorRef.current) {
                editorRef.current.innerHTML = rawHtml;
                onChange(rawHtml);
              }
              setHtmlMode(!htmlMode);
            }}
            className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              htmlMode 
                ? 'bg-[#F27D26] text-white border-[#F27D26]' 
                : 'bg-[#2A2A30] text-[#AAA] border-[#444] hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>{htmlMode ? 'Quay lại Soạn thảo' : 'Mã HTML'}</span>
          </button>
        </div>

      </div>

      {/* Editor Content Area */}
      <div className="p-6 bg-[#111114] text-[#E0E0DC]">
        {htmlMode ? (
          <textarea
            value={rawHtml}
            onChange={(e) => {
              setRawHtml(e.target.value);
              onChange(e.target.value);
            }}
            style={{ minHeight }}
            className="w-full bg-[#0A0A0C] text-[#38BDF8] font-mono text-xs p-4 rounded border border-[#333] focus:outline-none focus:border-[#F27D26] leading-relaxed resize-y"
            placeholder="<p>Nhập mã HTML tại đây...</p>"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={saveSelection}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            style={{ minHeight }}
            className="wysiwyg-content focus:outline-none text-[#DDD] font-sans text-sm sm:text-base leading-relaxed space-y-4 prose prose-invert max-w-none"
            data-placeholder={placeholder}
          />
        )}
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelected}
        token={token}
        title="Chọn hoặc tải lên hình ảnh để chèn vào bài viết"
        defaultCategory="articles"
      />

    </div>
  );
};
