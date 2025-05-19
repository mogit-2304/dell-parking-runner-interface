
import { useLanguage } from '@/context/LanguageContext';
import translations from '@/utils/translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key: string, fallback?: string) => {
    const currentLanguage = language as keyof typeof translations;
    
    if (translations[currentLanguage] && translations[currentLanguage][key as keyof typeof translations[typeof currentLanguage]]) {
      return translations[currentLanguage][key as keyof typeof translations[typeof currentLanguage]];
    }
    
    return fallback || key;
  };
  
  return { t };
};
