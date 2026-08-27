import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
  openQuoteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate, openQuoteModal }) => {
  const { lang, setLanguage } = useLanguage();
  const { settings } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/projects', labelVi: 'DỰ ÁN', labelEn: 'PROJECTS' },
    { path: '/services', labelVi: 'DỊCH VỤ', labelEn: 'SERVICES' },
    { path: '/insights', labelVi: 'GÓC NHÌN KỸ THUẬT', labelEn: 'INSIGHTS' },
    { path: '/about', labelVi: 'VỀ CHÚNG TÔI', labelEn: 'ABOUT US' },
    { path: '/partners', labelVi: 'ĐỐI TÁC', labelEn: 'PARTNERS' },
    { path: '/join-debriq', labelVi: 'MẠNG LƯỚI KỸ SƯ', labelEn: 'ENGINEER NETWORK' },
    { path: '/contact', labelVi: 'LIÊN HỆ', labelEn: 'CONTACT' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F3F2EE]/95 backdrop-blur-md border-b border-[#D9D8D3] transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Brand Mark */}
          <button 
            onClick={() => handleNav('/')} 
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            aria-label="DEBRIQ Home"
          >
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={settings.displayName || 'DEBRIQ'} 
                className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
              />
            ) : (
              /* Isometric Brick Emblem */
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#151515] p-1 flex items-center justify-center shrink-0 shadow group-hover:bg-[#F27D26] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none" className="w-full h-full">
                  <g transform="translate(64, 64) scale(0.7) translate(-100, -100)">
                    <polygon points="100,16 35,53 65,70 130,33" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round"/>
                    <polygon points="35,53 65,70 65,108 35,91" fill="#D9D8D3" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round"/>
                    <polygon points="138,38 73,75 103,92 168,55" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round"/>
                    <polygon points="73,75 103,92 103,130 73,113" fill="#D9D8D3" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round"/>
                    <polygon points="103,92 168,55 168,93 103,130" fill="#B5B4AE" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round"/>
                    <polygon points="35,103 100,140 100,178 35,141" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round"/>
                    <polygon points="100,140 130,123 130,161 100,178" fill="#D9D8D3" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round"/>
                    <polygon points="138,118 168,101 168,139 138,156" fill="#F27D26" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round"/>
                  </g>
                </svg>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[#151515] leading-none group-hover:text-[#F27D26] transition-colors">
                {settings?.displayName || 'DEBRIQ'}
              </span>
              <span className="font-mono-tech text-[8px] sm:text-[9px] font-medium tracking-[0.14em] text-[#767670] uppercase mt-0.5">
                ENGINEERING
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-[12px] font-medium tracking-[0.06em] uppercase font-sans">
            {navLinks.map((item) => {
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`transition-colors relative py-1 focus:outline-none cursor-pointer ${
                    isActive 
                      ? 'text-[#F27D26] font-semibold' 
                      : 'text-[#2D2D2A] hover:text-[#F27D26]'
                  }`}
                >
                  {lang === 'vi' ? item.labelVi : item.labelEn}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#F27D26]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar: Language Switcher & Quote CTA */}
          <div className="hidden sm:flex items-center gap-6 font-sans">
            {/* Language Switcher */}
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] uppercase">
              <button
                onClick={() => setLanguage('vi')}
                className={`transition-colors cursor-pointer ${
                  lang === 'vi' ? 'text-[#F27D26]' : 'text-[#767670] hover:text-[#151515]'
                }`}
              >
                VN
              </button>
              <span className="text-[#D9D8D3]">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={`transition-colors cursor-pointer ${
                  lang === 'en' ? 'text-[#F27D26]' : 'text-[#767670] hover:text-[#151515]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Primary Quote CTA */}
            <button
              onClick={openQuoteModal}
              className="group relative inline-flex items-center gap-2 bg-[#F27D26] hover:bg-[#151515] text-white px-5 py-2.5 font-semibold text-xs tracking-[0.06em] uppercase transition-colors duration-200 cursor-pointer"
            >
              <span>{lang === 'vi' ? 'NHẬN BÁO GIÁ' : 'GET A QUOTE'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase">
              <button
                onClick={() => setLanguage('vi')}
                className={lang === 'vi' ? 'text-[#F27D26]' : 'text-[#8D8D88]'}
              >
                VN
              </button>
              <span className="text-[#D9D8D3]">|</span>
              <button
                onClick={() => setLanguage('en')}
                className={lang === 'en' ? 'text-[#F27D26]' : 'text-[#8D8D88]'}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#151515] hover:bg-[#EAE9E4] border border-[#D9D8D3] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#151515]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#D9D8D3] bg-[#F3F2EE] px-6 pt-3 pb-6 space-y-4">
          <div className="flex flex-col divide-y divide-[#E2E1DC]">
            {navLinks.map((item) => {
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`py-3.5 text-left text-xs font-bold tracking-[0.15em] uppercase flex justify-between items-center ${
                    isActive ? 'text-[#F27D26]' : 'text-[#151515]'
                  }`}
                >
                  <span>{lang === 'vi' ? item.labelVi : item.labelEn}</span>
                  {isActive && <span className="w-1.5 h-1.5 bg-[#F27D26]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openQuoteModal();
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#F27D26] hover:bg-[#151515] text-white py-3.5 font-bold text-xs tracking-[0.1em] uppercase transition-colors"
            >
              <span>{lang === 'vi' ? 'NHẬN BÁO GIÁ DỊCH VỤ' : 'GET A QUOTE'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
