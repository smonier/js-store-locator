import type { JCRNodeWrapper } from "org.jahia.services.content";

export interface StoreProps {
  "jcr:title": string;
  "name"?: string;
  "description"?: string;
  "url"?: string;
  "telephone"?: string;
  "priceRange"?: string;
  "amenityFeature"?: string[];
  "openingHours"?: string[];
  "streetAddress"?: string;
  "addressLocality"?: string;
  "addressRegion"?: string;
  "postalCode"?: string;
  "addressCountry"?: string;
  "latitude"?: number;
  "longitude"?: number;
  "image"?: JCRNodeWrapper;
}
