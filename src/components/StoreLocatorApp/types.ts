export interface StoreLocatorAppProps {
  "jcr:title"?: string;
  "welcomeTitle"?: string;
  "welcomeMessage"?: string;
  "storesFolder"?: any; // JCRNodeWrapper | undefined
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

export interface Store {
  id: string;
  name: string;
  description?: string;
  telephone?: string;
  url?: string;
  image?: string;
  address: StoreAddress;
  geo: StoreGeoCoordinates;
  openingHoursSpecification?: OpeningHoursSpecification[];
  priceRange?: string;
  amenityFeature?: string[];
  distance?: number;
}
