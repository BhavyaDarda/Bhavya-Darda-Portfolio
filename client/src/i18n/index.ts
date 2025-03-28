import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import languages
import enTranslation from './locales/en';
import frTranslation from './locales/fr';
import esTranslation from './locales/es';
import jaTranslation from './locales/ja';
import zhTranslation from './locales/zh';

const resources = {
  en: {
    translation: enTranslation
  },
  fr: {
    translation: frTranslation
  },
  es: {
    translation: esTranslation
  },
  ja: {
    translation: jaTranslation
  },
  zh: {
    translation: zhTranslation
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;