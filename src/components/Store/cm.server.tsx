import { jahiaComponent, AddResources, buildModuleFileUrl, buildNodeUrl } from "@jahia/javascript-modules-library";
import type { StoreProps } from "./types";
import styles from "./Store.module.css";

export default jahiaComponent(
  {
    componentType: "view",
    nodeType: "jsstorelocnt:store",
    name: "cm",
    displayName: "Content Manager View",
  },
  (props: StoreProps) => {
    const {
      "jcr:title": title,
      name,
      description,
      url,
      telephone,
      priceRange,
      amenityFeature,
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode,
      addressCountry,
      latitude,
      longitude,
      image,
    } = props;

    const storeName = name || title;
    const hasAddress = streetAddress || addressLocality || addressRegion || postalCode;
    const hasCoordinates = latitude && longitude;
    const cityLine =
      [addressLocality, addressRegion].filter(Boolean).join(", ") || addressCountry || "";
    const fullAddress = [streetAddress, cityLine, postalCode].filter(Boolean).join(" · ");
    let imageUrl: string | undefined;
    if (image) {
      if (typeof image === "object" && "url" in image) {
        imageUrl = (image as { url: string }).url;
      } else {
        try {
          imageUrl = buildNodeUrl(image as any);
        } catch (e) {
          imageUrl = undefined;
        }
      }
    }

    return (
      <div className={styles.simpleCard}>
        <AddResources type="css" resources={buildModuleFileUrl("dist/assets/style.css")} />
        <AddResources type="css" resources="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

        <div className={styles.heroSection}>
          {imageUrl ? (
            <img src={imageUrl} alt={storeName} className={styles.heroImage} />
          ) : (
            <div className={styles.heroFallback}>{storeName?.charAt(0) ?? "S"}</div>
          )}
          {priceRange && <span className={styles.pricePill}>{priceRange}</span>}
        </div>

        <div className={styles.content}>
          <div className={styles.headerRow}>
            <div>
              <h3 className={styles.storeTitle}>{storeName}</h3>
              {cityLine && <div className={styles.subtleText}>{cityLine}</div>}
            </div>
            {hasCoordinates && (
              <span className={styles.coordText}>
                {latitude?.toFixed(2)} · {longitude?.toFixed(2)}
              </span>
            )}
          </div>

          {description && <p className={styles.description}>{description}</p>}

          <div className={styles.infoStack}>
            {fullAddress && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Address</span>
                <span className={styles.infoValue}>{fullAddress}</span>
              </div>
            )}
            {telephone && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Phone</span>
                <a className={styles.infoValue} href={`tel:${telephone}`}>
                  {telephone}
                </a>
              </div>
            )}
            {url && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Website</span>
                <a className={styles.infoValue} href={url} target="_blank" rel="noopener noreferrer">
                  Visit site
                </a>
              </div>
            )}
          </div>

          {amenityFeature && amenityFeature.length > 0 && (
            <div className={styles.badgeGroup}>
              {amenityFeature.map((amenity) => (
                <span key={amenity} className={styles.chip}>
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);
