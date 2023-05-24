import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    backend: {
        // translation file path
        loadPath: "/locales/{{ns}}/{{lng}}.json",
    },
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      formatSeparator: ","
    },
    ns: [
      "common", 
      "announcement", 
      "footer", 
      "navbar", 
      "newsletter", 
      "product", 
      "productList", 
      "login", 
      "register", 
      "cart", 
      "wishlist", 
      "success", 
      "slider", 
      "pay", 
      "contact",
      "search"
    ],
    react: {
        // wait: true,
        useSuspense: true,
    }
  });

export default i18n;