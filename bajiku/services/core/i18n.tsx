import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize'; // For detecting locale
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from './locales/en.json'; // Import English translations
import es from './locales/es.json'; // Import Spanish translations

// Define languages resources
const resources = {
  en: { translation: en },
  es: { translation: es }
};

// Initialize i18next
i18n
  .use(initReactI18next) // Bind the react-i18next instance to i18n
  .init({
    resources,
    fallbackLng: 'en', // Default language is English
    interpolation: {
      escapeValue: false, // Not needed for React Native
    },
    detection: {
      // Use 'react-native-localize' to detect the device language
      order: ['device', 'querystring', 'cookie'],
      caches: ['localStorage'], // Cache the language selection in localStorage
    },
    debug: true,
    lng: 'en', // Default language on initialization
    react: {
      useSuspense: false, // Disable Suspense for now
    },
  });

// Function to change the language
i18n.on('languageChanged', (lang) => {
  AsyncStorage.setItem('language', lang); // Store the user's language choice
});

// Detect the user's language and apply it
const setLanguage = async () => {
  const storedLang = await AsyncStorage.getItem('language');
  const deviceLanguage = Localization.getLocales()[0].languageCode; // Get device language
  const language = storedLang || deviceLanguage || 'en'; // Fallback to 'en' if no language is stored
  i18n.changeLanguage(language); // Change the language in i18next
};

setLanguage();

export default i18n;


