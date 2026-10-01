import { jahiaComponent, AddResources, buildModuleFileUrl, buildNodeUrl } from "@jahia/javascript-modules-library";
import { createTranslator } from "../StoreLocatorApp/translation.js";
import { safeWebUrl, telephoneHref, uniqueValues } from "./storeValues.js";
import type { StoreProps } from "./types.js";
import styles from "./Store.module.css";

export default jahiaComponent(
  {
    componentType: "view",
    nodeType: "jsstorelocnt:store",
    name: "cm",
    displayName: "Content Manager View",
  },
  (props: StoreProps, { renderContext }) => {
    const { t } = createTranslator(renderContext.getMainResourceLocale().toString());
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
    const amenities = uniqueValues(
      Array.isArray(amenityFeature) ? amenityFeature : amenityFeature ? [amenityFeature] : [],
    );
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
          imageUrl = buildNodeUrl(image);
        } catch {
          imageUrl = undefined;
        }
      }
    }

    return (
      <div className={styles.simpleCard}>
        <AddResources type="css" resources={buildModuleFileUrl("dist/assets/style.css")} />

        <div className={styles.heroSection}>
          {imageUrl ? (
            <img src={imageUrl} alt="" className={styles.heroImage} />
          ) : (
            <div className={styles.heroFallback} aria-hidden="true">
              {storeName?.charAt(0)}
            </div>
          )}
          {priceRange && <span className={styles.pricePill}>{priceRange}</span>}
        </div>

        <div className={styles.content}>
          <div className={styles.headerRow}>
            <div>
              <h2 className={styles.storeTitle}>{storeName}</h2>
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
                <span className={styles.infoLabel}>{t("storedetails.address")}</span>
                <span className={styles.infoValue}>{fullAddress}</span>
              </div>
            )}
            {telephone && telephoneHref(telephone) && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>{t("storedetails.phone")}</span>
                <a className={styles.infoValue} href={telephoneHref(telephone)}>
                  {telephone}
                </a>
              </div>
            )}
            {safeWebUrl(url) && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>{t("cm.website")}</span>
                <a className={styles.infoValue} href={safeWebUrl(url)}>
                  {t("storedetails.website")}
                </a>
              </div>
            )}
          </div>

          {amenities.length > 0 && (
            <div className={styles.badgeGroup}>
              {amenities.map((amenity) => (
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
