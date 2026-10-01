import { buildNodeUrl } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import { parseOpeningHours } from "../StoreLocatorApp/hours.js";
import type { Store } from "../StoreLocatorApp/types.js";

/** Keeps an absolute http(s) URL, and nothing else. */
export const safeWebUrl = (value: string | null | undefined): string => {
  const url = (value ?? "").trim();
  return /^https?:\/\/[^\s"'<>\\]+$/i.test(url) ? url : "";
};

/** Builds a `tel:` URI from a free-text phone number: digits only, with a leading "+" kept. */
export const telephoneHref = (value: string | null | undefined): string => {
  const raw = (value ?? "").trim();
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return `tel:${raw.startsWith("+") ? "+" : ""}${digits}`;
};

const readString = (node: JCRNodeWrapper, name: string): string => {
  try {
    return node.hasProperty(name) ? node.getProperty(name).getString() : "";
  } catch {
    return "";
  }
};

const readStrings = (node: JCRNodeWrapper, name: string): string[] => {
  try {
    if (!node.hasProperty(name)) return [];
    const property = node.getProperty(name);
    if (!property.isMultiple()) return [property.getString()];
    const values = property.getValues();
    const result: string[] = [];
    for (let i = 0; i < values.length; i++) result.push(values[i].getString());
    return result;
  } catch {
    return [];
  }
};

const readCoordinate = (node: JCRNodeWrapper, name: string, limit: number): number | null => {
  const value = Number.parseFloat(readString(node, name));
  return Number.isFinite(value) && Math.abs(value) <= limit ? value : null;
};

const readImageUrl = (node: JCRNodeWrapper): string => {
  try {
    if (!node.hasProperty("image")) return "";
    const image = node.getProperty("image").getNode() as JCRNodeWrapper | null;
    return image ? buildNodeUrl(image) : "";
  } catch {
    return "";
  }
};

const readPageUrl = (node: JCRNodeWrapper): string => {
  try {
    return buildNodeUrl(node);
  } catch {
    return "";
  }
};

/**
 * Reads a jsstorelocnt:store node into plain data for the views and the island. Links are checked
 * here, once: the views render `url` and `telephoneHref` as they are.
 */
export function readStore(node: JCRNodeWrapper): Store {
  const latitude = readCoordinate(node, "latitude", 90);
  const longitude = readCoordinate(node, "longitude", 180);
  const telephone = readString(node, "telephone");
  return {
    id: node.getIdentifier(),
    name: readString(node, "name") || node.getDisplayableName(),
    description: readString(node, "description"),
    telephone,
    telephoneHref: telephoneHref(telephone),
    url: safeWebUrl(readString(node, "url")),
    pageUrl: readPageUrl(node),
    image: readImageUrl(node),
    priceRange: readString(node, "priceRange"),
    amenityFeature: readStrings(node, "amenityFeature").filter(Boolean),
    geo: latitude !== null && longitude !== null ? { latitude, longitude } : null,
    address: {
      streetAddress: readString(node, "streetAddress"),
      addressLocality: readString(node, "addressLocality"),
      addressRegion: readString(node, "addressRegion"),
      postalCode: readString(node, "postalCode"),
      addressCountry: readString(node, "addressCountry"),
    },
    openingHoursSpecification: parseOpeningHours(readStrings(node, "openingHours")),
  };
}
