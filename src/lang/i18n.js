import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from '../locales/en.json';
import tr from '../locales/tr.json';

const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
