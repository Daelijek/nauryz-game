import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import kz from './locales/kz.json';
import ru from './locales/ru.json';
import en from './locales/en.json';

const STORAGE_KEY = 'nauryz-game-lang';

const savedLang = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
const initialLanguage = savedLang && ['kz', 'ru', 'en'].includes(savedLang) ? savedLang : 'ru';

i18n.use(initReactI18next).init({
  resources: {
    kz: { translation: kz },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lng);
  }
});

export default i18n;
