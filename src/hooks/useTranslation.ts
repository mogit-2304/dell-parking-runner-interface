
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/utils/translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = <K extends keyof typeof translations['english']>(
    key: K,
    ...params: typeof translations['english'][K] extends (...args: infer P) => any ? P : never[]
  ) => {
    const translation = translations[language][key];
    
    if (typeof translation === 'function') {
      return (translation as Function)(...params);
    }
    
    return translation;
  };
  
  return { t };
};
