/*
 * Plain helpers for the values a store carries: they read no repository node, so the views, the
 * island and the unit tests share them.
 */

const WEB_URL = /^https?:\/\/[^\s\p{Cc}"<>\\/?#]+(?:[/?#][^\s\p{Cc}"<>\\]*)?$/iu;

/**
 * Keeps an absolute http(s) URL, and nothing else. A value that starts with "www." is read as an
 * https address. Returns an empty string when the value is not a web address.
 */
export const safeWebUrl = (value: string | null | undefined): string => {
  const trimmed = (value ?? "").trim();
  const url = /^www\./i.test(trimmed) ? `https://${trimmed}` : trimmed;
  return WEB_URL.test(url) ? url : "";
};

/** Where an extension starts: "ext. 12", "extension 12", "poste 12", "x204", "#12", ";ext=12", ",12". */
const EXTENSION = /(?:ext(?:ension)?\.?|poste|x|#|;|,)\s*[=:]?\s*\d/i;

/** "+33 (0)1 ...": the national trunk prefix written after a country code is not dialled. */
const TRUNK_AFTER_COUNTRY_CODE = /^(\+\d{1,3})\s*\(0\)/;

/**
 * Builds a `tel:` URI from a free-text phone number: the digits of the number itself, with a
 * leading "+" kept. An extension is left out of the URI (the visible text keeps it), and a "(0)"
 * written after the country code is dropped. Returns an empty string when there is no number.
 */
export const telephoneHref = (value: string | null | undefined): string => {
  const raw = (value ?? "").trim();
  const extension = raw.search(EXTENSION);
  const number = (extension >= 0 ? raw.slice(0, extension) : raw).replace(
    TRUNK_AFTER_COUNTRY_CODE,
    "$1",
  );
  const digits = number.replace(/\D/g, "");
  if (!digits) return "";
  return `tel:${number.startsWith("+") ? "+" : ""}${digits}`;
};

/** Trimmed, non-empty values, each listed once, in their first order. */
export const uniqueValues = (values: readonly string[]): string[] => [
  ...new Set(values.map((value) => value.trim()).filter(Boolean)),
];
