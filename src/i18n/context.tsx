import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
import { Language } from '../types';

interface I18nContextType {
  lang: Language;
  dir: 'ltr' | 'rtl';
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations['fr']) => string;
  formatPrice: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('optique_lang') as Language;
      return saved === 'ar' || saved === 'fr' ? saved : 'fr';
    } catch {
      return 'fr';
    }
  });

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    try {
      localStorage.setItem('optique_lang', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = dir;
    } catch {
      // ignore
    }
  }, [lang, dir]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const t = (key: keyof typeof translations['fr']): string => {
    const dict = translations[lang] || translations.fr;
    return dict[key] || translations.fr[key] || String(key);
  };

  const formatPrice = (amount: number): string => {
    const symbol = t('currencySymbol');
    if (lang === 'ar') {
      return `${amount.toLocaleString('ar-MA')} ${symbol}`;
    }
    return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${symbol}`;
  };

  const formatDate = (dateString: string): string => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(lang === 'ar' ? 'ar-MA' : 'fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <I18nContext.Provider value={{ lang, dir, setLang, t, formatPrice, formatDate }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
