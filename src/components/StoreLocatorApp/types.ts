import type { JCRNodeWrapper } from "org.jahia.services.content";

export interface StoreLocatorAppProps {
  "jcr:title"?: string;
  "welcomeTitle"?: string;
  "welcomeMessage"?: string;
  "storesFolder"?: JCRNodeWrapper;
}

export interface StoreAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface StoreGeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface OpeningHoursSpecification {
  dayOfWeek: string;
  opens: string;
  closes: string;
}

/**
 * Store data as the views and the island use it. Every value is plain, serialisable data; links
 * are already checked (`url` is http or https only, `telephoneHref` is a `tel:` URI or empty).
 */
export interface Store {
  id: string;
  name: string;
  description: string;
  telephone: string;
  telephoneHref: string;
  url: string;
  pageUrl: string;
  image: string;
  address: StoreAddress;
  /** Null when the store has no usable coordinates: it is then left off the map. */
  geo: StoreGeoCoordinates | null;
  openingHoursSpecification: OpeningHoursSpecification[];
  priceRange: string;
  amenityFeature: string[];
}
