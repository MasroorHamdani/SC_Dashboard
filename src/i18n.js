import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

import translationEN from './translations/en/common.json';
import translationDE from './translations/zh-sg/common.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  sg: {
    translation: translationDE
  }
};

i18n
  .use(detector)
  .use(reactI18nextModule)
  .init({
    // debug:true,
    resources,
    fallbackLng: 'en', // use en if detected lng is not available
    whitelist: ['en', 'sg'],
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  });
  export default i18n;
