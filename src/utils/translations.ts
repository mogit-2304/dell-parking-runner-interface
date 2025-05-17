
export const translations = {
  english: {
    // App Header
    logout: "Logout",
    
    // Login Page
    guardLogin: "Guard Login",
    enterPhoneDesc: "Enter your registered phone number to receive a one-time password.",
    enterCodeDesc: (phone: string) => `Enter the 6-digit code sent to ${phone}`,
    phoneNumber: "Phone Number",
    phoneNumberPlaceholder: "Enter 10-digit phone number",
    oneTimePassword: "One-Time Password",
    otpExpires: (time: string) => `OTP expires in ${time}`,
    sendOTP: "Send OTP",
    verifying: "Verifying...",
    verifyOTP: "Verify OTP",
    changePhoneNumber: "Change Phone Number",
    resendOTP: "Resend OTP",
    
    // Login error messages
    phoneNotRecognized: "Phone number not recognized",
    otpExpired: "OTP expired. Please request a new one.",
    invalidOTP: "Invalid OTP",
    tooManyAttempts: "Too many attempts—try again in 15 minutes",
    accountLocked: "Account is locked. Please try again later.",
    unexpectedError: "An unexpected error occurred. Please try again.",
    
    // Login toast messages
    otpSent: "OTP Sent",
    otpSentTo: (phone: string) => `A one-time password has been sent to ${phone}`,
    newOtpSent: "New OTP Sent",
    newOtpSentTo: (phone: string) => `A new one-time password has been sent to ${phone}`,
    loginSuccessful: "Login Successful",
    loginSuccessDesc: "You have been successfully logged in.",
    attemptsRemaining: (attempts: number) => `${attempts} attempts remaining before lockout.`,
    
    // Home Page
    welcome: "Welcome to DELL Parking Management",
    useOptions: "Use the options above to manage parking spaces",
    
    // Select Office Page
    officeLocation: "Office Location",
    selectOffice: "Select an office",
    parkingStatus: (name: string) => `${name} Parking Status`,
    currentOccupancy: "Current Parking Occupancy",
    parkingFull: "Parking is full",
    occupiedPercentage: (percentage: number) => `${percentage}% occupied`,
    availableSlots: "Available Parking Slots",
    noSpaces: "No spaces available",
    availablePercentage: (percentage: number) => `${percentage}% available`,
    vehicleEntryExit: "Vehicle Entry/Exit",
    pleaseSelectOffice: "Please select an office to manage parking",
    
    // Select Office toast messages
    officeUpdated: "Office Updated",
    occupancyUpdated: (name: string, number: number) => `${name} occupancy updated to ${number}`,
    
    // Office Actions Component
    slideToEnter: "Slide to Enter →",
    releaseToEnter: "Release to Enter",
    vehicleEntered: "Vehicle Entered",
    slideToExit: "← Slide to Exit",
    releaseToExit: "Release to Exit",
    vehicleExited: "Vehicle Exited",
    recentActivity: "Recent Activity",
    
    // Office Actions toast messages
    noVehiclesToExit: "No vehicles to exit",
    parkingAtCapacity: (name: string) => `${name} parking is at capacity.`,
    parkingEmpty: (name: string) => `${name} parking is already empty.`,
    errorUpdatingOccupancy: "Error updating occupancy",
    failedToUpdate: "Failed to update parking occupancy. Please try again.",
    
    // Not Found Page
    notFoundCode: "404",
    pageNotFound: "Oops! Page not found",
    returnHome: "Return to Home",
    
    // App Header toast messages
    logoutSuccessful: "Logout successful",
    logoutFailed: "Logout failed",
    logoutIssue: "There was an issue logging out. Please try again."
  },
  kannada: {
    // App Header
    logout: "ಲಾಗ್ ಔಟ್",
    
    // Login Page
    guardLogin: "ಗಾರ್ಡ್ ಲಾಗಿನ್",
    enterPhoneDesc: "ಒಂದು-ಸಮಯ ಗುಪ್ತಪದ ಪಡೆಯಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ನೋಂದಾಯಿತ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
    enterCodeDesc: (phone: string) => `${phone} ಗೆ ಕಳುಹಿಸಲಾದ 6-ಅಂಕಿ ಕೋಡ್ ಅನ್ನು ನಮೂದಿಸಿ.`,
    phoneNumber: "ಫೋನ್ ಸಂಖ್ಯೆ",
    phoneNumberPlaceholder: "10-ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
    oneTimePassword: "ಒಂದು-ಸಮಯ ಗುಪ್ತಪದ",
    otpExpires: (time: string) => `OTP ಅಮಾನ್ಯವಾಗಲು ${time} ಅಗಿದೆ`,
    sendOTP: "OTP ಕಳುಹಿಸಿ",
    verifying: "ಸರಿಹೊಂದುತ್ತಿದೆ...",
    verifyOTP: "OTP ಪರಿಶೀಲಿಸಿ",
    changePhoneNumber: "ಫೋನ್ ಸಂಖ್ಯೆ ಬದಲಿಸಿ",
    resendOTP: "OTP ಮರುಕಳುಹಿಸಿ",
    
    // Login error messages
    phoneNotRecognized: "ಫೋನ್ ಸಂಖ್ಯೆ ಗುರುತಿಸಲಾಗಲಿಲ್ಲ",
    otpExpired: "OTP ಅವಧಿ ಮುಗಿದಿದೆ. ದಯವಿಟ್ಟು ಹೊಸದು ಕೇಳಿ.",
    invalidOTP: "ಅಮಾನ್ಯ OTP",
    tooManyAttempts: "ಪ್ರಯತ್ನಗಳು ಹೆಚ್ಚು—15 ನಿಮಿಷಗಳಲ್ಲಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    accountLocked: "ಖಾತೆ ಲಾಕ್ ಆಗಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    unexpectedError: "ಅನಿರೀಕ್ಷಿತ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    
    // Login toast messages
    otpSent: "OTP ಕಳುಹಿಸಲಾಗಿದೆ",
    otpSentTo: (phone: string) => `ಒಂದು-ಸಮಯ ಗುಪ್ತಪದವನ್ನು ${phone} ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ`,
    newOtpSent: "New OTP Sent",
    newOtpSentTo: (phone: string) => `ಹೊಸ ಒಂದು-ಸಮಯ ಗುಪ್ತಪದವನ್ನು ${phone} ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ`,
    loginSuccessful: "ಲಾಗಿನ್ ಯಶಸ್ವಿ",
    loginSuccessDesc: "ನೀವು ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ.",
    attemptsRemaining: (attempts: number) => `ಲಾಕ್‌ಔಟ್‌ಗೂ ಮುನ್ನ ${attempts} ಪ್ರಯತ್ನಗಳಿವೆ.`,
    
    // Home Page
    welcome: "DELL Parking Management ಗೆ ಸುಸ್ವಾಗತ",
    useOptions: "ಪಾರ್ಕಿಂಗ್ ಸ್ಥಳಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಮೇಲಿನ ಆಯ್ಕೆಗಳನ್ನು ಬಳಸಿ",
    
    // Select Office Page
    officeLocation: "ಕಚೇರಿ ಸ್ಥಳ",
    selectOffice: "ಒಂದು ಕಚೇರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    parkingStatus: (name: string) => `${name} Parking Status`,
    currentOccupancy: "ಪ್ರಸ್ತುತ ಪಾರ್ಕಿಂಗ್ ಭರ್ತಿ",
    parkingFull: "Parking is full",
    occupiedPercentage: (percentage: number) => `${percentage}% occupied`,
    availableSlots: "ಲಭ್ಯವಿರುವ ಪಾರ್ಕಿಂಗ್ ಸ್ಲಾಟ್‌ಗಳು",
    noSpaces: "ಯಾವುದೇ ಸ್ಥಳ ಲಭ್ಯವಿಲ್ಲ",
    availablePercentage: (percentage: number) => `${percentage}% available`,
    vehicleEntryExit: "ವಾಹನ ಪ್ರವೇಶ/ನಿರ್ಗಮನ",
    pleaseSelectOffice: "ಪಾರ್ಕಿಂಗ್ ನಿರ್ವಹಿಸಲು ದಯವಿಟ್ಟು ಒಂದು ಕಚೇರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    
    // Select Office toast messages
    officeUpdated: "ಕಚೇರಿ ನವೀಕರಿಸಲಾಗಿದೆ",
    occupancyUpdated: (name: string, number: number) => `${name} occupancy updated to ${number}`,
    
    // Office Actions Component
    slideToEnter: "Slide to Enter →",
    releaseToEnter: "ಪ್ರವೇಶಿಸಲು ಬಿಡುಗಡೆ ಮಾಡಿ",
    vehicleEntered: "ವಾಹನ ಪ್ರವೇಶಿಸಿತು",
    slideToExit: "← Slide to Exit",
    releaseToExit: "ನಿರ್ಗಮನಕ್ಕೆ ಬಿಡುಗಡೆ ಮಾಡಿ",
    vehicleExited: "ವಾಹನ ನಿರ್ಗಮನ ಮಾಡಿತು",
    recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    
    // Office Actions toast messages
    noVehiclesToExit: "ನಿರ್ಗಮನಕ್ಕೆ ಯಾವುದೇ ವಾಹನಗಳಿಲ್ಲ",
    parkingAtCapacity: (name: string) => `${name} parking is at capacity.`,
    parkingEmpty: (name: string) => `${name} parking is already empty.`,
    errorUpdatingOccupancy: "Error updating occupancy",
    failedToUpdate: "Failed to update parking occupancy. Please try again.",
    
    // Not Found Page
    notFoundCode: "404",
    pageNotFound: "Oops! Page not found",
    returnHome: "Return to Home",
    
    // App Header toast messages
    logoutSuccessful: "Logout successful",
    logoutFailed: "Logout failed",
    logoutIssue: "There was an issue logging out. Please try again."
  }
};
