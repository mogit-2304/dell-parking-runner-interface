
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'english' | 'kannada';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

// Create the context with a default value instead of undefined
const LanguageContext = createContext<LanguageContextType>({
  language: 'english',
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize language from localStorage or default to English
  const [language, setLanguage] = useState<Language>(() => {
    // Make sure we're in a browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language-preference');
      return (savedLanguage === 'english' || savedLanguage === 'kannada') 
        ? savedLanguage as Language
        : 'english';
    }
    return 'english';
  });

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language-preference', language);
      console.log('Language set to:', language);
    }
  }, [language]);

  const value = {
    language,
    setLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
