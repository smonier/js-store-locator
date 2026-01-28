import React, { createContext, useContext, useMemo } from "react";
import enTranslations from "../../../settings/locales/en.json";
import frTranslations from "../../../settings/locales/fr.json";

type Locale = "en" | "fr";

const resources: Record<Locale, Record<string, unknown>> = {
  en: enTranslations,
  fr: frTranslations,
};

const DEFAULT_LOCALE: Locale = "en";

const normalizeLocale = (locale?: string | null): Locale => {
  if (!locale) return DEFAULT_LOCALE;
  const normalized = locale.toLowerCase().split(/[-_]/)[0];
  return normalized === "fr" ? "fr" : "en";
};

const getValue = (target: any, path: string[]): string | undefined => {
  let current = target;
  for (const segment of path) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    current = current[segment];
  }
  return typeof current === "string" ? current : undefined;
};

const translateKey = (key: string, locale: Locale, fallback?: string): string => {
  const path = key.split(".");
  return (
    getValue(resources[locale], path) ??
    getValue(resources[DEFAULT_LOCALE], path) ??
    fallback ??
    key
  );
};

export interface StoreLocatorTranslation {
  t: (key: string, fallback?: string) => string;
  language: Locale;
}

const StoreLocatorTranslationContext = createContext<StoreLocatorTranslation | null>(null);

export const useStoreLocatorTranslation = () => {
  const context = useContext(StoreLocatorTranslationContext);
  if (context) {
    return context;
  }
  const jahiaLang =
    typeof window !== "undefined"
      ? (window as Window & { jahia?: { i18n?: { language?: string } } })?.jahia?.i18n?.language
      : undefined;
  const language = normalizeLocale(jahiaLang);
  return {
    t: (key: string, fallback?: string) => translateKey(key, language, fallback),
    language,
  };
};

export const StoreLocatorTranslationProvider: React.FC<{
  locale?: string;
  children: React.ReactNode;
}> = ({ locale, children }) => {
  const language = normalizeLocale(locale);
  const value = useMemo<StoreLocatorTranslation>(
    () => ({
      t: (key: string, fallback?: string) => translateKey(key, language, fallback),
      language,
    }),
    [language],
  );

  return (
    <StoreLocatorTranslationContext.Provider value={value}>
      {children}
    </StoreLocatorTranslationContext.Provider>
  );
};
