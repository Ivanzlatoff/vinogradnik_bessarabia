import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend)
    // detect user language
    .use(LanguageDetector)
    // pass the i18 instance to react-i18next.
    .use(initReactI18next)
    // init i18next
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
            "topbar", 
            "sidebar", 
            "featuredInfo", 
            "home", 
            "widgetSm", 
            "widgetLg", 
            "userList", 
            "orderList", 
            "order", 
            "user", 
            "newUser",
            "productList",
            "product",
            "newProduct",
            "messageList",
            "message"
        ],
        react: {
            // wait: true,
            useSuspense: true,
        },
    });

export default i18n;