import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../settings/locales/en.json";
import frTranslations from "../settings/locales/fr.json";

// Use a dedicated instance to avoid conflicts with other modules on the page
const i18n = i18next.createInstance();

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    fr: { translation: frTranslations },
  },
  lng: "en", // default language
  fallbackLng: "en",
  supportedLngs: ["en", "fr"],
  load: "languageOnly", // Normalize en_US -> en
  defaultNS: "translation",
  ns: ["translation"],
  returnEmptyString: false,
  initImmediate: false, // Synchronous init so first render has translations
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
