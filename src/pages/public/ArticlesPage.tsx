import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { 
  BookOpen, 
  ArrowUpRight, 
  Clock, 
  Tag, 
  Search, 
  Filter, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Article } from '../../types';

interface ArticlesPageProps {
  navigate: (path: string) => void;
  openQuoteModal: () => void;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({ navigate, openQuoteModal }) => {
  const { lang, t } = useLanguage();
  const { articles } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: { vi: 'TẤT CẢ BÀI VIẾT', en: 'ALL ARTICLES' } },
    { id: 'shopdrawing-standard', label: { vi: 'TIÊU CHUẨN SHOPDRAWING', en: 'SHOPDRAWING STANDARDS' } },
    { id: 'rebar-optimization', label: { vi: 'TỐI ƯU HÓA CỐT THÉP', en: 'REBAR OPTIMIZATION' } },
    { id: 'bim-revit-coordination', label: { vi: 'BIM / REVIT PHỐI HỢP', en: 'BIM / REVIT' } },
    { id: 'site-qa-qc', label: { vi: 'QA/QC & NGHIỆM THU', en: 'SITE QA/QC' } },
    { id: 'case-study', label: { vi: 'PHÂN TÍCH CA ĐIỂN HÌNH', en: 'CASE STUDIES' } }
  ];

  // Filter articles
  const filteredArticles = articles.filter(article => {
    if (!article.published) return false;
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const titleVi = article.title?.vi?.toLowerCase() || '';
    const titleEn = article.title?.en?.toLowerCase() || '';
    const excerptVi = article.excerpt?.vi?.toLowerCase() || '';
    const excerptEn = article.excerpt?.en?.toLowerCase() || '';
    const matchesQuery = !q || titleVi.includes(q) || titleEn.includes(q) || excerptVi.includes(q) || excerptEn.includes(q);
    return matchesCategory && matchesQuery;
  });

  const featuredArticle = articles.find(a => a.featured && a.published) || articles[0];

  return (
    <div className="bg-[#F3F2EE] min-h-screen text-[#151515] font-display selection:bg-[#F27D26] selection:text-white">
      {/* Header Banner */}
      <section className="border-b border-[#D9D8D3] bg-[#EAE9E4] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-4">
            <span className="font-mono-tech text-xs tracking-widest text-[#F27D26] uppercase block font-bold">
              // {lang === 'vi' ? 'HỒ SƠ CHUYÊN MÔN & KỸ THUẬT' : 'TECHNICAL INSIGHTS & ENGINEERING STANDARDS'}
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#151515] uppercase leading-none">
              {lang === 'vi' ? 'GÓC NHÌN CHUYÊN MÔN' : 'ENGINEERING INSIGHTS'}
            </h1>
            <p className="font-sans text-lg text-[#555] leading-relaxed">
              {lang === 'vi'
                ? 'Tổng hợp các bài phân tích kỹ thuật, quy chuẩn shopdrawing cốt thép, giải pháp phối hợp BIM và kinh nghiệm nghiệm thu thực tế trên công trường cao tầng.'
                : 'Curated technical analyses, rebar detailing standards, BIM coordination best practices, and field-tested handover workflows from high-rise job sites.'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 border-b border-[#D9D8D3]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
          
          {/* Featured Headline Article Banner (if exists) */}
          {featuredArticle && (
            <div 
              onClick={() => navigate(`/insights/${featuredArticle.slug}`)}
              className="bg-[#151515] text-[#D9D8D3] border border-[#262626] p-6 sm:p-10 rounded-none cursor-pointer group transition-all hover:border-[#F27D26] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-[#F27D26] text-white px-2.5 py-0.5 font-mono-tech text-[10px] uppercase font-bold tracking-wider">
                    {lang === 'vi' ? 'BÀI NỔI BẬT' : 'FEATURED INSIGHT'}
                  </span>
                  <span className="font-mono-tech text-xs text-[#888] uppercase">
                    {featuredArticle.category.replace(/-/g, ' ')}
                  </span>
                  {featuredArticle.readingTimeMinutes && (
                    <span className="font-mono-tech text-xs text-[#888] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featuredArticle.readingTimeMinutes} min read
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white group-hover:text-[#F27D26] transition-colors leading-tight uppercase">
                  {t(featuredArticle.title)}
                </h2>

                <p className="text-sm sm:text-base text-[#A0A09A] line-clamp-3 leading-relaxed font-sans">
                  {t(featuredArticle.excerpt)}
                </p>

                <div className="pt-2 flex items-center gap-2 font-mono-tech text-xs text-[#F27D26] font-bold uppercase tracking-wider">
                  <span>{lang === 'vi' ? 'ĐỌC TOÀN BỘ PHÂN TÍCH' : 'READ FULL ARTICLE'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="lg:col-span-5 aspect-[16/10] bg-[#222] border border-[#333] overflow-hidden">
                {featuredArticle.heroImage ? (
                  <img
                    src={featuredArticle.heroImage}
                    alt={t(featuredArticle.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono-tech text-xs">
                    DEBRIQ TECHNICAL ARCHIVE
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Search & Category Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-[#D9D8D3] pb-6">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 font-mono-tech text-xs uppercase tracking-wider transition-colors cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-[#151515] text-white border-[#151515]'
                      : 'bg-[#EAE9E4] text-[#444] border-[#D9D8D3] hover:border-[#151515] hover:text-[#151515]'
                  }`}
                >
                  {t(cat.label)}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'vi' ? 'Tìm bài viết...' : 'Search insights...'}
                className="w-full bg-[#EAE9E4] border border-[#D9D8D3] focus:border-[#151515] pl-9 pr-3.5 py-2 text-xs text-[#151515] font-mono-tech focus:outline-none"
              />
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-[#D9D8D3] bg-[#EAE9E4] p-8 space-y-3 font-mono-tech">
              <BookOpen className="w-10 h-10 mx-auto text-[#888]" />
              <p className="text-sm font-bold text-[#151515] uppercase">
                {lang === 'vi' ? 'KHÔNG TÌM THẤY BÀI VIẾT NÀO PHÙ HỢP' : 'NO MATCHING ARTICLES FOUND'}
              </p>
              <p className="text-xs text-[#666]">
                {lang === 'vi' ? 'Vui lòng thử chọn danh mục khác hoặc nhập từ khóa tìm kiếm khác.' : 'Please select another category or refine your query.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => navigate(`/insights/${article.slug}`)}
                  className="bg-[#EAE9E4] border border-[#D9D8D3] hover:border-[#151515] transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-4">
                    {/* Cover image */}
                    <div className="aspect-[16/10] bg-[#1a1a1a] overflow-hidden border-b border-[#D9D8D3]">
                      {article.heroImage ? (
                        <img
                          src={article.heroImage}
                          alt={t(article.title)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600 font-mono-tech text-xs">
                          DEBRIQ ENGINEERING
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between font-mono-tech text-[10px] text-[#777] uppercase">
                        <span className="text-[#F27D26] font-bold">{article.category.replace(/-/g, ' ')}</span>
                        {article.readingTimeMinutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {article.readingTimeMinutes} min
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold tracking-tight text-[#151515] uppercase group-hover:text-[#F27D26] transition-colors leading-tight">
                        {t(article.title)}
                      </h3>

                      <p className="text-xs text-[#555] line-clamp-3 leading-relaxed font-sans">
                        {t(article.excerpt)}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-[#D9D8D3]/50 flex items-center justify-between font-mono-tech text-xs text-[#151515] font-bold uppercase mt-4">
                    <span className="text-[11px] text-[#777]">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'ARCHIVE'}
                    </span>
                    <div className="flex items-center gap-1 group-hover:text-[#F27D26] transition-colors">
                      <span>{lang === 'vi' ? 'XEM CHI TIẾT' : 'READ MORE'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
