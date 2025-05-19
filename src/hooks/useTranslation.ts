
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
  
  // Office selection
  officeLocation: 'Office Location',
  selectOffice: 'Select Office',
  
  // Authentication
  logoutSuccessful: 'Logged Out Successfully',
  logoutFailed: 'Logout Failed',
  logoutIssue: 'There was an issue during logout. Please try again.',
  
  // Parking actions
  parkingAtCapacity: (officeName: string) => `Parking at ${officeName} is at full capacity.`,
  noVehiclesToExit: 'No Vehicles to Exit',
  parkingEmpty: (officeName: string) => `Parking at ${officeName} is empty.`,
  errorUpdatingOccupancy: 'Error Updating Occupancy',
  failedToUpdate: 'Failed to update occupancy. Please try again.',
  
  // Vehicle entry/exit
  vehicleEntered: 'Vehicle Entered',
  vehicleExited: 'Vehicle Exited',
  vehicleNumber: 'Vehicle Number',
  vehicleEntryDetails: 'Vehicle Entry Details',
  vehicleExitDetails: 'Vehicle Exit Details',
  
  // Slider actions
  slideToEnter: 'Slide to Enter',
  releaseToEnter: 'Release to Enter',
  slideToExit: 'Slide to Exit',
  releaseToExit: 'Release to Exit',
  
  // Vehicle dialog
  formatXXNNXXNNNN: 'Format: XX NN XX NNNN (Example: KA 01 AB 1234)',
  invalidVehicleFormat: 'Invalid format. Please use XX NN XX NNNN (Example: KA 01 AB 1234)',
  confirm: 'Confirm',
  skip: 'Skip',
  
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
  
  // Office selection
  officeLocation: 'ಕಚೇರಿ ಸ್ಥಳ',
  selectOffice: 'ಕಚೇರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  
  // Authentication
  logoutSuccessful: 'ಯಶಸ್ವಿಯಾಗಿ ಲಾಗ್ ಔಟ್ ಆಗಿದೆ',
  logoutFailed: 'ಲಾಗ್ ಔಟ್ ವಿಫಲವಾಗಿದೆ',
  logoutIssue: 'ಲಾಗ್ ಔಟ್ ಸಮಯದಲ್ಲಿ ಸಮಸ್ಯೆ ಉಂಟಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  
  // Parking actions
  parkingAtCapacity: (officeName: string) => `${officeName} ನಲ್ಲಿ ಪಾರ್ಕಿಂಗ್ ಪೂರ್ಣ ಸಾಮರ್ಥ್ಯದಲ್ಲಿದೆ.`,
  noVehiclesToExit: 'ನಿರ್ಗಮಿಸಲು ಯಾವುದೇ ವಾಹನಗಳಿಲ್ಲ',
  parkingEmpty: (officeName: string) => `${officeName} ನಲ್ಲಿ ಪಾರ್ಕಿಂಗ್ ಖಾಲಿ ಇದೆ.`,
  errorUpdatingOccupancy: 'ಆಕ್ರಮಣ ನವೀಕರಿಸುವಲ್ಲಿ ದೋಷ',
  failedToUpdate: 'ಆಕ್ರಮಣವನ್ನು ನವೀಕರಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  
  // Vehicle entry/exit
  vehicleEntered: 'ವಾಹನ ಪ್ರವೇಶಿಸಿದೆ',
  vehicleExited: 'ವಾಹನ ನಿರ್ಗಮಿಸಿದೆ',
  vehicleNumber: 'ವಾಹನ ಸಂಖ್ಯೆ',
  vehicleEntryDetails: 'ವಾಹನ ಪ್ರವೇಶ ವಿವರಗಳು',
  vehicleExitDetails: 'ವಾಹನ ನಿರ್ಗಮನ ವಿವರಗಳು',
  
  // Slider actions
  slideToEnter: 'ಪ್ರವೇಶಿಸಲು ಸ್ಲೈಡ್ ಮಾಡಿ',
  releaseToEnter: 'ಪ್ರವೇಶಿಸಲು ಬಿಡುಗಡೆ ಮಾಡಿ',
  slideToExit: 'ನಿರ್ಗಮಿಸಲು ಸ್ಲೈಡ್ ಮಾಡಿ',
  releaseToExit: 'ನಿರ್ಗಮಿಸಲು ಬಿಡುಗಡೆ ಮಾಡಿ',
  
  // Vehicle dialog
  formatXXNNXXNNNN: 'ಫಾರ್ಮ್ಯಾಟ್: XX NN XX NNNN (ಉದಾಹರಣೆ: KA 01 AB 1234)',
  invalidVehicleFormat: 'ಅಮಾನ್ಯ ಫಾರ್ಮ್ಯಾಟ್. ದಯವಿಟ್ಟು XX NN XX NNNN (ಉದಾಹರಣೆ: KA 01 AB 1234) ಬಳಸಿ',
  confirm: 'ದೃಢೀಕರಿಸಿ',
  skip: 'ಬಿಟ್ಟುಬಿಡಿ',
  
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
