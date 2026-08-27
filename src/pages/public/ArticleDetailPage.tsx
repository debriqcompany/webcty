import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  BookOpen, 
  ArrowUpRight 
} from 'lucide-react';
import { ContentBlockRenderer } from '../../components/public/ContentBlockRenderer';

interface ArticleDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
  openQuoteModal: () => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug, navigate, openQuoteModal }) => {
  const { lang, t } = useLanguage();
  const { articles, getArticleBySlug } = useData();

  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F3F2EE] px-4 font-mono-tech">
        <h1 className="text-2xl font-bold text-[#151515] mb-2">404 — KHÔNG TÌM THẤY BÀI VIẾT</h1>
        <p className="text-xs text-[#777] mb-6">Bài viết yêu cầu không tồn tại hoặc đã được gỡ bỏ.</p>
        <button
          onClick={() => navigate('/insights')}
          className="inline-flex items-center gap-2 bg-[#151515] text-white px-5 py-2.5 text-xs uppercase cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VỀ DANH MỤC BÀI VIẾT</span>
        </button>
      </div>
    );
  }

  // Related articles (exclude current)
  const relatedArticles = articles
    .filter(a => a.id !== article.id && a.published)
    .slice(0, 2);

  return (
    <div className="bg-[#F3F2EE] min-h-screen text-[#151515] font-display selection:bg-[#F27D26] selection:text-white">
      {/* Top Breadcrumb & Return Bar */}
      <div className="border-b border-[#D9D8D3] bg-[#EAE9E4] py-3.5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between font-mono-tech text-xs">
          <button
            onClick={() => navigate('/insights')}
            className="inline-flex items-center gap-2 text-[#262626] hover:text-[#F27D26] uppercase transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'QUAY LẠI TẤT CẢ BÀI VIẾT' : 'BACK TO INSIGHTS'}</span>
          </button>

          <div className="flex items-center gap-2 text-[#8D8D88] hidden sm:flex">
            <span>TECHNICAL INSIGHTS</span>
            <span>/</span>
            <span className="text-[#151515] font-semibold truncate max-w-xs">{t(article.title)}</span>
          </div>
        </div>
      </div>

      {/* Article Header Banner */}
      <section className="py-12 sm:py-20 border-b border-[#D9D8D3] bg-[#F3F2EE]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-6">
          
          <div className="flex flex-wrap items-center gap-3 font-mono-tech text-xs">
            <span className="bg-[#F27D26] text-white px-2.5 py-1 uppercase font-bold tracking-wider">
              {article.category.replace(/-/g, ' ')}
            </span>
            {article.readingTimeMinutes && (
              <span className="bg-[#E2E1DC] text-[#151515] px-3 py-1 uppercase font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#F27D26]" /> {article.readingTimeMinutes} min read
              </span>
            )}
            <span className="text-[#777]">
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'ARCHIVE'}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black text-[#151515] uppercase tracking-tight leading-[1.1]">
            {t(article.title)}
          </h1>

          {article.excerpt && (
            <p className="font-sans text-lg sm:text-xl text-[#555] leading-relaxed italic border-l-2 border-[#F27D26] pl-4">
              {t(article.excerpt)}
            </p>
          )}

          {/* Author info */}
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
      </section>

      {/* Main Content Body */}
      <section className="py-16 border-b border-[#D9D8D3]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-12">
          
          {/* Main Hero Visual Presentation */}
          {article.heroImage && (
            <div className="border border-[#D9D8D3] bg-[#1E1E1E] overflow-hidden shadow-lg">
              <img
                src={article.heroImage}
                alt={t(article.title)}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Render Rich Content (HTML from WYSIWYG or Legacy Blocks) */}
          <div className="font-sans text-[#222] text-base leading-relaxed">
            {article.contentHtml ? (
              <div 
                className="prose prose-neutral max-w-none space-y-4 leading-relaxed font-sans"
                dangerouslySetInnerHTML={{
                  __html: typeof article.contentHtml === 'object'
                    ? ((article.contentHtml as any)[lang] || (article.contentHtml as any).vi || '')
                    : article.contentHtml
                }}
              />
            ) : (
              <ContentBlockRenderer blocks={article.contentBlocks} />
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-8 border-t border-[#D9D8D3] flex flex-wrap items-center gap-2 font-mono-tech text-xs">
              <span className="text-[#888] uppercase mr-1">TAGS:</span>
              {article.tags.map((tag, i) => (
                <span key={i} className="bg-[#EAE9E4] border border-[#D9D8D3] px-2.5 py-1 text-[#333]">
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-[#EAE9E4] border-b border-[#D9D8D3]">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono-tech text-xs text-[#F27D26] uppercase font-bold tracking-widest block">
                  // {lang === 'vi' ? 'BÀI VIẾT LIÊN QUAN' : 'RELATED INSIGHTS'}
                </span>
                <h3 className="text-2xl font-black uppercase text-[#151515] tracking-tight mt-1">
                  {lang === 'vi' ? 'TÀI LIỆU KỸ THUẬT KHÁC' : 'FURTHER READING'}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/insights/${rel.slug}`)}
                  className="bg-[#F3F2EE] border border-[#D9D8D3] hover:border-[#151515] p-6 cursor-pointer group transition-all space-y-4"
                >
                  <span className="font-mono-tech text-[10px] text-[#F27D26] uppercase font-bold">
                    {rel.category.replace(/-/g, ' ')}
                  </span>
                  <h4 className="text-xl font-bold uppercase text-[#151515] group-hover:text-[#F27D26] transition-colors leading-tight">
                    {t(rel.title)}
                  </h4>
                  <p className="text-xs text-[#555] line-clamp-2 font-sans">
                    {t(rel.excerpt)}
                  </p>
                  <div className="pt-2 flex items-center gap-1 font-mono-tech text-xs font-bold text-[#151515]">
                    <span>{lang === 'vi' ? 'ĐỌC TIẾP' : 'READ ARTICLE'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
