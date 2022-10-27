import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { enStrings } from './locales/en';
import { roStrings } from './locales/ro';

const userData = JSON.parse(localStorage.getItem('userData'));

i18n.use(initReactI18next).init({
  lng: userData?.user.language,
  fallbackLng: 'EN',
  debug: true,
  interpolation: {
    escapeValue: false,
  },
  react: {
    bindI18n: 'loaded languageChanged',
    bindI18nStore: 'added',
    useSuspense: true,
  },
  resources: {
    EN: enStrings,
    RO: roStrings,
  },
});
