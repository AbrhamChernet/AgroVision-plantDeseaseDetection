import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  am: {
    // Navbar
    navHome: 'ቤት',
    navDetect: 'ምርመራ',
    navDiseases: 'የበሽታዎች ዝርዝር',
    navHistory: 'የምርመራ ታሪክ',
    navDashboard: 'መቆጣጠሪያ ሰሌዳ',
    navLogin: 'ግባ',
    navRegister: 'ተመዝገብ',
    navLogout: 'ውጣ',

    // Home Page
    heroTitle: 'የሰብል በሽታ ምርመራ — በሰከንዶች ውስጥ',
    heroSub: 'በዘመናዊ የሊኩዊድ AI ቴክኖሎጂ የታገዘ የበቆሎ እና የስንዴ ቅጠል በሽታዎችን በስልክዎ መርምረው ፈጣን መፍትሄ ያግኙ።',
    heroBtn: 'ምስል ስቀል',
    featureFast: 'ፈጣን ምርመራ',
    featureFastDesc: 'የቅጠሉን ፎቶ እንደሰቀሉ AI ቴክኖሎጂው በሰከንዶች ውስጥ ውጤቱን ያሳውቅዎታል።',
    featureAmh: 'በአማርኛ ቋንቋ',
    featureAmhDesc: 'ሁሉም በሽታዎች፣ ምልክቶቻቸው እና መፍትሄዎቻቸው ሙሉ በሙሉ በአማርኛ ተዘጋጅተዋል።',
    featureFree: 'ነፃ አገልግሎት',
    featureFreeDesc: 'ምንም ዓይነት ክፍያ ሳይጠየቁ ሰብልዎን መርምረው የምክር አገልግሎት ያገኛሉ።',
    howItWorks: 'እንዴት እንደሚሰራ',
    step1: 'ምስል ይምረጡ',
    step1Desc: 'የበቆሎ ወይም የስንዴ ቅጠል ፎቶ ያንሱ ወይም ከጋለሪ ይጫኑ።',
    step2: 'AI ትንተና',
    step2Desc: 'የእኛ ዘመናዊ AI ቴክኖሎጂ የቅጠሉን በሽታ በጥልቀት ይተነትናል።',
    step3: 'ውጤት ያግኙ',
    step3Desc: 'የበሽታውን ዓይነት፣ ደረጃ እና ሳይንሳዊ መፍትሄዎችን በድምፅ ጭምር ያግኙ።',
    cropSelectorTitle: 'ለመመርመር የሚፈልጉትን ሰብል ይምረጡ',
    cropMaize: 'በቆሎ (Maize)',
    cropWheat: 'ስንዴ (Wheat)',
    cropTeff: 'ጤፍ (Teff)',
    comingSoon: 'በቅርቡ ይመጣል',
    footerText: 'አግሮቪዥን AI — ለኢትዮጵያ ገበሬዎች ዘመናዊ የግብርና እገዛ።',

    // Detection Page
    detectTitle: 'የሰብል ቅጠል በሽታ ምርመራ ሰሌዳ',
    stepSelectCrop: '1. መጀመሪያ ሰብልዎን ይምረጡ',
    stepUpload: '2. የሰብል ቅጠል ምስል ይስቀሉ',
    dragDropText: 'ምስሉን እዚህ ይጎትቱ ወይም ይጫኑ',
    orTake: 'ወይም ፎቶ ያንሱ',
    cameraText: 'ካሜራ ክፈት',
    maxSizeWarn: 'ምስሉ ከ 2MB መብለጥ የለበትም። እባክዎ አነስ ያለ ምስል ይጫኑ።',
    analyzingCycle1: 'ምስሉን በመጫን ላይ...',
    analyzingCycle2: 'AI እየተነተነ ነው...',
    analyzingCycle3: 'ውጤት በማዘጋጀት ላይ...',
    resultTitle: 'የምርመራ ውጤት',
    confidenceScore: 'የእርግጠኝነት ደረጃ',
    severityBadge: 'የጉዳት ደረጃ',
    recommendation: 'የሚመከር መፍትሄ',
    tryAgain: 'ድጋሚ ሞክር',
    last5History: 'የመጨረሻዎቹ 5 ምርመራዎችዎ',
    severityHigh: 'ከፍተኛ',
    severityMedium: 'መካከለኛ',
    severityLow: 'ዝቅተኛ',
    severityNone: 'ጤናማ',
    shareWhatsApp: 'ውጤቱን በዋትስአፕ ያጋሩ',

    // Disease Info Page
    searchPlaceholder: 'በሽታዎችን ይፈልጉ...',
    readMore: 'ተጨማሪ ያንብቡ',
    causes: 'ምክንያቶች',
    symptoms: 'ምልክቶች',
    prevention: 'መከላከያ መንገዶች',
    closeBtn: 'ዝጋ',

    // Authentication
    fullName: 'ሙሉ ስም',
    phoneNum: 'የስልክ ቁጥር (+251...)',
    password: 'የይለፍ ቃል',
    confirmPassword: 'የይለፍ ቃል ያረጋግጡ',
    profilePic: 'የመገለጫ ፎቶ (አማራጭ)',
    rememberMe: 'አስታውሰኝ',
    noAccount: 'አካውንት የለዎትም? ይመዝገቡ',
    hasAccount: 'አካውንት አለዎት? ይግቡ',
    regTitle: 'አዲስ ገበሬ ምዝገባ',
    logTitle: 'ወደ አካውንትዎ ይግቡ',

    // Dashboard
    welcomeUser: 'እንኳን ደህና መጡ',
    quickActions: 'ፈጣን ተግባራት',
    newDetectBtn: 'አዲስ ምርመራ',
    statsWeek: 'በዚህ ሳምንት የተደረጉ ምርመራዎች',
    mostDetected: 'ብዙ ጊዜ የታየ በሽታ',
    cropBreakdown: 'የሰብሎች ስርጭት ገበታ',
    recentActivity: 'የቅርብ ጊዜ እንቅስቃሴዎች',
    weatherWidget: 'የአዲስ አበባ የአየር ሁኔታ',
    temp: 'የሙቀት መጠን',
    humidity: 'እርጥበት',
    wind: 'የንፋስ ፍጥነት',
    weatherRiskHigh: 'የአየር ሁኔታው ለፈንገስ መራባት አመቺ ነው፤ ጥንቃቄ ያድርጉ!',
    weatherRiskLow: 'ዝቅተኛ የበሽታ ስርጭት ስጋት።',
    ethiopianSeasons: 'የኢትዮጵያ የግብርና ወቅቶችና ምክሮች',
    meherSeason: 'የመኸር ወቅት (Meher)',
    meherDesc: 'የሰብል ክትትልና የፈንገስ መከላከያ መድኃኒቶችን በወቅቱ መጠቀም ይመከራል።',
    belgSeason: 'የበልግ ወቅት (Belg)',
    belgDesc: 'የአፈር ዝግጅትና ምርጥ ዘሮችን የመምረጥ ወቅት።',

    // History Page
    totalScans: 'ጠቅላላ ምርመራዎች',
    diseasesFound: 'የተገኙ በሽታዎች',
    lastScanDate: 'የመጨረሻ የምርመራ ቀን',
    exportPDF: 'ውጤቶችን በፒዲኤፍ (PDF) አውርድ',
    cropCol: 'የሰብል ዓይነት',
    diseaseCol: 'የታየው በሽታ',
    dateCol: 'ቀንና ሰዓት',
    actionsCol: 'ተግባራት',
    viewDetails: 'ዝርዝር እይ',
    deleteBtn: 'ሰርዝ',
    notLoggedIn: 'እባክዎ መጀመሪያ ይግቡ።'
  },
  en: {
    // Navbar
    navHome: 'Home',
    navDetect: 'Detect',
    navDiseases: 'Diseases',
    navHistory: 'History',
    navDashboard: 'Dashboard',
    navLogin: 'Login',
    navRegister: 'Register',
    navLogout: 'Logout',

    // Home Page
    heroTitle: 'Crop Disease Detection — In Seconds',
    heroSub: 'Powered by liquid AI to analyze corn and wheat leaf pathology on your mobile. Get localized remedies instantly.',
    heroBtn: 'Upload Image',
    featureFast: 'Fast Detection',
    featureFastDesc: 'Get AI diagnostic evaluation in seconds right after submitting leaf photos.',
    featureAmh: 'Amharic First',
    featureAmhDesc: 'Fully localized advisory system translating diagnostics and remedies into Amharic.',
    featureFree: 'Free to Use',
    featureFreeDesc: 'Accessible crop health scans without any cost barriers for smallholders.',
    howItWorks: 'How It Works',
    step1: 'Pick Leaf Photo',
    step1Desc: 'Capture wheat/maize leaves via camera or select files from gallery.',
    step2: 'AI Analysis',
    step2Desc: 'Our agricultural neural models extract leaf lesion characteristics.',
    step3: 'Get Advisory',
    step3Desc: 'Receive detailed localized diagnostics and remedies in text and audio formats.',
    cropSelectorTitle: 'Select the Crop to Diagnose',
    cropMaize: 'Maize (በቆሎ)',
    cropWheat: 'Wheat (ስንዴ)',
    cropTeff: 'Teff (ጤፍ)',
    comingSoon: 'Coming Soon',
    footerText: 'AgroVision AI — Smarter farming tools for Ethiopian agriculture.',

    // Detection Page
    detectTitle: 'Crop Disease Detection Workspace',
    stepSelectCrop: '1. Select Your Crop Category First',
    stepUpload: '2. Upload Leaf Photograph',
    dragDropText: 'Drag & drop image here, or browse files',
    orTake: 'Or take a live photo',
    cameraText: 'Open Camera',
    maxSizeWarn: 'File size must not exceed 2MB. Upload a compressed image.',
    analyzingCycle1: 'Uploading image...',
    analyzingCycle2: 'AI analyzing crop markers...',
    analyzingCycle3: 'Preparing final results...',
    resultTitle: 'Detection Results',
    confidenceScore: 'Confidence Rating',
    severityBadge: 'Severity Level',
    recommendation: 'Recommended Remedy',
    tryAgain: 'Try Again',
    last5History: 'Your Recent 5 Scans',
    severityHigh: 'High',
    severityMedium: 'Medium',
    severityLow: 'Low',
    severityNone: 'Healthy',
    shareWhatsApp: 'Share Result via WhatsApp',

    // Disease Info Page
    searchPlaceholder: 'Search diseases...',
    readMore: 'Read More',
    causes: 'Causes',
    symptoms: 'Symptoms',
    prevention: 'Prevention',
    closeBtn: 'Close',

    // Authentication
    fullName: 'Full Name',
    phoneNum: 'Phone Number (+251...)',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    profilePic: 'Profile Photo (Optional)',
    rememberMe: 'Remember Me',
    noAccount: "Don't have an account? Register",
    hasAccount: 'Already have an account? Login',
    regTitle: 'Create Farmer Profile',
    logTitle: 'Access Your Dashboard',

    // Dashboard
    welcomeUser: 'Welcome back',
    quickActions: 'Quick Actions',
    newDetectBtn: 'New Scan',
    statsWeek: 'Detections Completed This Week',
    mostDetected: 'Most Common Disease Found',
    cropBreakdown: 'Crop Scan Analytics',
    recentActivity: 'Recent Scanning History',
    weatherWidget: 'Addis Ababa Weather Feed',
    temp: 'Temperature',
    humidity: 'Humidity',
    wind: 'Wind Speed',
    weatherRiskHigh: 'High humidity detected! Elevated fungal outbreak risks warning.',
    weatherRiskLow: 'Low disease outbreak risk vectors.',
    ethiopianSeasons: 'Ethiopian Agriculture Advisory Feed',
    meherSeason: 'Meher Planting Cycle',
    meherDesc: 'Intense weeding and chemical spray checks recommended on crop lines.',
    belgSeason: 'Belg Prep Cycle',
    belgDesc: 'Active soil tilling and selection of hybrid certified crop cultivars.',

    // History Page
    totalScans: 'Total Scans',
    diseasesFound: 'Diseases Found',
    lastScanDate: 'Last Scan Date',
    exportPDF: 'Export Diagnostics PDF',
    cropCol: 'Crop',
    diseaseCol: 'Disease Identified',
    dateCol: 'Date & Time',
    actionsCol: 'Actions',
    viewDetails: 'Details',
    deleteBtn: 'Delete',
    notLoggedIn: 'Please log in to proceed.'
  }
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    // Default always to 'am' (Amharic) on first load
    const saved = localStorage.getItem('agrovision_locale');
    return saved ? saved : 'am';
  });

  const toggleLanguage = () => {
    const nextLocale = locale === 'am' ? 'en' : 'am';
    setLocale(nextLocale);
    localStorage.setItem('agrovision_locale', nextLocale);
  };

  const t = (key) => {
    return translations[locale][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
