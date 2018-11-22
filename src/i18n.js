import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { reactI18nextModule } from "react-i18next";

import translationEN from './translations/en/common.json';
import translationDE from './translations/de/common.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  de: {
    translation: translationDE
  }
};

i18n
  .use(detector)
  .use(reactI18nextModule)
  .init({
    resources,
    // lng: "en",
    fallbackLng: "en", // use en if detected lng is not available
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  });
  export default i18n;
