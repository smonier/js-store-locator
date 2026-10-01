import type { ReactNode } from "react";
import { groupOpeningHours } from "./hours.js";
import type { StoreLocatorTranslation } from "./translation.js";
import type { Store } from "./types.js";
import classes from "./StoreLocatorApp.module.css";

type HeadingTag = "h2" | "h3" | "h4" | "h5" | "h6";

/** A heading of the given level, clamped to h2-h6 (the page template owns the h1). */
export function Heading({
  level,
  children,
  ...rest
}: {
  level: number;
  children: ReactNode;
  id?: string;
  className?: string;
  tabIndex?: number;
}) {
  const Tag = `h${Math.min(6, Math.max(2, level))}` as HeadingTag;
  return <Tag {...rest}>{children}</Tag>;
}

const countryName = (code: string, language: string) => {
  if (!/^[A-Za-z]{2}$/.test(code)) return code;
  try {
    return new Intl.DisplayNames([language], { type: "region" }).of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
};

export const directionsUrl = (store: Store) =>
  store.geo
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${store.geo.latitude},${store.geo.longitude}`,
      )}`
    : "";

/** City line of a store: "Paris" or "Lyon, Rhône". */
export const storeLocation = (store: Store) =>
  [store.address.addressLocality, store.address.addressRegion].filter(Boolean).join(", ");

/**
 * The details of a store: description, address and directions, contact links, amenities and
 * opening hours. Shared by the island's details panel and the server views of a store, so a
 * visitor without JavaScript reads the same information. `level` is the level of the section
 * headings ("Address", "Opening hours"); `openNow` is left null where the visitor's clock is not
 * known (server rendering), and the open/closed status is then not shown.
 */
export function StoreInfo({
  store,
  level,
  translation,
  openNow,
  idPrefix,
}: {
  store: Store;
  level: number;
  translation: StoreLocatorTranslation;
  openNow: boolean | null;
  idPrefix: string;
}) {
  const { t, language } = translation;
  const { streetAddress, postalCode, addressLocality, addressRegion, addressCountry } =
    store.address;
  const cityLine = [postalCode, addressLocality].filter(Boolean).join(" ");
  const hasAddress = Boolean(streetAddress || cityLine || addressRegion || addressCountry);
  const directions = directionsUrl(store);
  const hoursId = `${idPrefix}-hours`;
  const rows = store.openingHoursSpecification.length
    ? groupOpeningHours(store.openingHoursSpecification, t, language)
    : [];

  return (
    <div className={classes.info}>
      {store.description && <p className={classes.description}>{store.description}</p>}

      {(hasAddress || directions) && (
        <div className={classes.infoSection}>
          <Heading level={level} className={classes.infoTitle}>
            {t("storedetails.address")}
          </Heading>
          {hasAddress && (
            <p className={classes.infoContent}>
              {streetAddress && (
                <>
                  {streetAddress}
                  <br />
                </>
              )}
              {cityLine && (
                <>
                  {cityLine}
                  <br />
                </>
              )}
              {addressRegion && (
                <>
                  {addressRegion}
                  <br />
                </>
              )}
              {addressCountry && countryName(addressCountry, language)}
            </p>
          )}
          {directions && (
            <a href={directions} className={classes.infoLink}>
              {t("storedetails.directions")}
              <span className={classes.visuallyHidden}>
                {" "}
                {t("storedetails.to")} {store.name}
              </span>
            </a>
          )}
        </div>
      )}

      {(store.telephoneHref || store.url) && (
        <div className={classes.infoSection}>
          <Heading level={level} className={classes.infoTitle}>
            {t("storedetails.contact")}
          </Heading>
          <ul className={classes.plainList}>
            {store.telephoneHref && (
              <li>
                {t("storedetails.phone")}{" "}
                <a href={store.telephoneHref} className={classes.infoLink}>
                  {store.telephone}
                </a>
              </li>
            )}
            {store.url && (
              <li>
                <a href={store.url} className={classes.infoLink}>
                  {t("storedetails.website")}
                  <span className={classes.visuallyHidden}>
                    {" "}
                    {t("storedetails.of")} {store.name}
                  </span>
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      {store.amenityFeature.length > 0 && (
        <div className={classes.infoSection}>
          <Heading level={level} className={classes.infoTitle}>
            {t("storedetails.amenities")}
          </Heading>
          <ul className={classes.badgeContainer}>
            {store.amenityFeature.map((amenity) => (
              <li key={amenity} className={classes.badge}>
                {amenity}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rows.length > 0 && (
        <div className={classes.infoSection}>
          <div className={classes.hoursHeader}>
            <Heading level={level} className={classes.infoTitle} id={hoursId}>
              {t("storedetails.hours")}
            </Heading>
            {openNow !== null && (
              <span className={openNow ? classes.open : classes.closed}>
                <span aria-hidden="true" className={classes.statusIcon}>
                  {openNow ? "●" : "○"}
                </span>{" "}
                {openNow ? t("storedetails.open") : t("storedetails.closed")}
              </span>
            )}
          </div>
          <table className={classes.hoursTable} aria-labelledby={hoursId}>
            <thead className={classes.visuallyHidden}>
              <tr>
                <th scope="col">{t("storedetails.day")}</th>
                <th scope="col">{t("storedetails.hours")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.days}>
                  <th scope="row">{row.days}</th>
                  <td>{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
