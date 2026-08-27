import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, BilingualText } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  setLanguage: (lang: Language) => void;
  toggleLang: () => void;
  t: (textObj: any, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('debriq_lang');
      if (saved === 'vi' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'vi'; // Default Vietnamese
  });

  useEffect(() => {
    try {
      localStorage.setItem('debriq_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState(prev => (prev === 'vi' ? 'en' : 'vi'));
  };

  const t = (textObj: any, fallback = ''): string => {
    if (!textObj) return fallback;
    if (typeof textObj === 'string') return textObj;
    if (typeof textObj === 'object') {
      return textObj[lang] || textObj.vi || textObj.en || fallback;
    }
    return String(textObj);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, setLanguage: setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
