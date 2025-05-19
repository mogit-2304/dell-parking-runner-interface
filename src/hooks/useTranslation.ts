
import { useLanguage } from '@/context/LanguageContext';

// Assuming en contains translations for English and we'll create the kannada translations
const en = {
  // General
  appTitle: 'Dell Parking Runner',
  welcome: 'Welcome',
  login: 'Login',
  logout: 'Logout',
  submit: 'Submit',
  cancel: 'Cancel',
  back: 'Back',
  next: 'Next',
  save: 'Save',
  delete: 'Delete',
  
  // Parking status
  parkingStatus: (name: string) => `${name} Parking Status`,
  currentOccupancy: 'Current Occupancy',
  parkingFull: 'Parking Full',
  occupiedPercentage: (percentage: number) => `${percentage}% Occupied`,
  availableSlots: 'Available Slots',
  noSpaces: 'No spaces available',
  availablePercentage: (percentage: number) => `${percentage}% Available`,

  // Activity
  recentActivity: 'Recent Activity',

  // Actions
  checkIn: 'Check-in',
  checkOut: 'Check-out',
  vehiclePlaceholder: 'Enter vehicle number',
  enterVehicleNumber: 'Enter Vehicle Number',
  vehicleNumberRequired: 'Vehicle number is required'
};

const kannada = {
  // General
  appTitle: 'ಡೆಲ್ ಪಾರ್ಕಿಂಗ್ ರನ್ನರ್',
  welcome: 'ಸುಸ್ವಾಗತ',
  login: 'ಲಾಗಿನ್',
  logout: 'ಲಾಗ್ ಔಟ್',
  submit: 'ಸಲ್ಲಿಸು',
  cancel: 'ರದ್ದುಮಾಡು',
  back: 'ಹಿಂದೆ',
  next: 'ಮುಂದೆ',
  save: 'ಉಳಿಸು',
  delete: 'ಅಳಿಸು',
  
  // Parking status
  parkingStatus: (name: string) => `${name} ಪಾರ್ಕಿಂಗ್ ಸ್ಥಿತಿ`,
  currentOccupancy: 'ಪ್ರಸ್ತುತ ಆಕ್ರಮಣ',
  parkingFull: 'ಪಾರ್ಕಿಂಗ್ ತುಂಬಿದೆ',
  occupiedPercentage: (percentage: number) => `${percentage}% ಆಕ್ರಮಿಸಲಾಗಿದೆ`,
  availableSlots: 'ಲಭ್ಯವಿರುವ ಸ್ಲಾಟ್‌ಗಳು',
  noSpaces: 'ಸ್ಥಳಗಳು ಲಭ್ಯವಿಲ್ಲ',
  availablePercentage: (percentage: number) => `${percentage}% ಲಭ್ಯವಿದೆ`,

  // Activity
  recentActivity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',

  // Actions
  checkIn: 'ಚೆಕ್-ಇನ್',
  checkOut: 'ಚೆಕ್-ಔಟ್',
  vehiclePlaceholder: 'ವಾಹನ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
  enterVehicleNumber: 'ವಾಹನ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
  vehicleNumberRequired: 'ವಾಹನ ಸಂಖ್ಯೆ ಅಗತ್ಯವಿದೆ'
};

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const translations = {
    english: en,
    kannada: kannada
  };
  
  const t = <K extends keyof typeof translations.english>(
    key: K,
    ...params: any[]
  ): string => {
    const translation = translations[language][key];
    
    if (typeof translation === 'function') {
      return translation(...params);
    }
    
    return translation as string;
  };
  
  return { t };
};
