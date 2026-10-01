import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  StoreLocatorTranslationProvider,
  fill,
  useStoreLocatorTranslation,
} from "./translation.js";
import { Heading, StoreInfo, storeLocation } from "./StoreInfo.js";
import { isOpenAt } from "./hours.js";
import type { Store } from "./types.js";
import classes from "./StoreLocatorApp.module.css";

interface StoreLocatorClientProps {
  title: string;
  welcomeTitle?: string;
  welcomeMessage?: string;
  stores: Store[];
  locale: string;
  /** Level of the app's own heading; the store names are one level below. */
  headingLevel: number;
  /** Identifier of the app node: a prefix for element ids that is the same on server and client. */
  appId: string;
}

interface LeafletDeps {
  L: typeof Leaflet;
  icon: Leaflet.Icon;
}

const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The store locator: a searchable list of stores, a Leaflet map and a details panel.
 *
 * The list is the accessible equivalent of the map: it holds every store and every detail. The
 * island is rendered on the server, so without JavaScript the visitor gets the list, each store
 * name linking to the store's own page; the map, the selection and the open/closed status (which
 * needs the visitor's clock) start once the island runs in the browser.
 */
export default function StoreLocatorClient(props: StoreLocatorClientProps) {
  return (
    <StoreLocatorTranslationProvider locale={props.locale}>
      <StoreLocator {...props} />
    </StoreLocatorTranslationProvider>
  );
}

function StoreLocator({
  title,
  welcomeTitle,
  welcomeMessage,
  stores,
  headingLevel,
  appId,
}: StoreLocatorClientProps) {
  const translation = useStoreLocatorTranslation();
  const { t } = translation;
  const uid = `jsstoreloc-${appId}`;
  const ids = {
    search: `${uid}-search`,
    sidebar: `${uid}-sidebar`,
    mapNote: `${uid}-map-note`,
    details: `${uid}-details`,
  };

  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [listHidden, setListHidden] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [leaflet, setLeaflet] = useState<LeafletDeps | null>(null);

  const searchRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const focusDetails = useRef(false);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import("leaflet"),
      import("leaflet/dist/images/marker-icon.png"),
      import("leaflet/dist/images/marker-icon-2x.png"),
      import("leaflet/dist/images/marker-shadow.png"),
    ])
      .then(([module, iconUrl, iconRetinaUrl, shadowUrl]) => {
        if (cancelled) return;
        const L = (module.default ?? module) as typeof Leaflet;
        const icon = L.icon({
          iconUrl: iconUrl.default,
          iconRetinaUrl: iconRetinaUrl.default,
          shadowUrl: shadowUrl.default,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          shadowSize: [41, 41],
        });
        setLeaflet({ L, icon });
      })
      .catch((error) => console.error("[store-locator] the map could not be loaded", error));
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredStores = useMemo(() => {
    const lc = query.trim().toLowerCase();
    if (!lc) return stores;
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(lc) ||
        store.address.addressLocality.toLowerCase().includes(lc) ||
        store.address.addressRegion.toLowerCase().includes(lc) ||
        store.address.postalCode.toLowerCase().includes(lc),
    );
  }, [stores, query]);

  const selectedStore = useMemo(
    () => stores.find((store) => store.id === selectedId) ?? null,
    [stores, selectedId],
  );

  const handleSelect = useCallback((store: Store) => {
    focusDetails.current = true;
    setSelectedId(store.id);
    setDetailsOpen(true);
  }, []);

  // Move the focus to the details once they are on screen.
  useEffect(() => {
    if (detailsOpen && focusDetails.current) {
      focusDetails.current = false;
      document.getElementById(ids.details)?.focus();
    }
  }, [detailsOpen, selectedId, ids.details]);

  const handleCloseDetails = useCallback(() => {
    const id = selectedId;
    setDetailsOpen(false);
    // Give the focus back to the store's button in the list, or to the search field.
    window.requestAnimationFrame(() => {
      const button = id
        ? listRef.current?.querySelector<HTMLButtonElement>(`button[data-store-id="${id}"]`)
        : null;
      (button ?? searchRef.current)?.focus();
    });
  }, [selectedId]);

  const handleReset = useCallback(() => {
    setSelectedId(null);
    setDetailsOpen(false);
    setQuery("");
    setResetToken((v) => v + 1);
  }, []);

  const statusText =
    filteredStores.length === 0
      ? t("storelist.nostore")
      : fill(t(filteredStores.length === 1 ? "storelist.count_one" : "storelist.count_other"), {
          count: String(filteredStores.length),
        });

  const withMap = mounted && leaflet !== null;
  const layoutClasses = [
    classes.layout,
    withMap ? classes.withMap : "",
    withMap && listHidden ? classes.listHidden : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes.app}>
      <div className={layoutClasses}>
        <div className={classes.sidebar} id={ids.sidebar}>
          <div className={classes.sidebarHeader}>
            <Heading level={headingLevel} className={classes.welcomeTitle}>
              {welcomeTitle || title}
            </Heading>
            {mounted && (
              <button type="button" className={classes.resetButton} onClick={handleReset}>
                {t("storelist.reset")}
                <span className={classes.visuallyHidden}> {t("storelist.resetHint")}</span>
              </button>
            )}
          </div>
          {welcomeMessage && <p className={classes.welcomeMessage}>{welcomeMessage}</p>}

          {mounted && (
          <form
            role="search"
            className={classes.searchForm}
            onSubmit={(event) => event.preventDefault()}
          >
            <label htmlFor={ids.search} className={classes.searchLabel}>
              {t("searchbar.label")}
            </label>
            <input
              ref={searchRef}
              id={ids.search}
              type="search"
              className={classes.searchInput}
              placeholder={t("searchbar.placeholder")}
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </form>
          )}
          <p role="status" className={classes.status}>
            {statusText}
          </p>

          {filteredStores.length > 0 && (
            <ul className={classes.storeList} ref={listRef}>
              {filteredStores.map((store) => (
                <StoreListItem
                  key={store.id}
                  store={store}
                  level={headingLevel + 1}
                  interactive={mounted}
                  isSelected={selectedId === store.id}
                  openNow={now ? isOpenAt(store.openingHoursSpecification, now) : null}
                  onSelect={handleSelect}
                />
              ))}
            </ul>
          )}
        </div>

        <div className={classes.mapColumn} hidden={!withMap}>
          {withMap && (
            <button
              type="button"
              className={classes.toggleButton}
              aria-expanded={!listHidden}
              aria-controls={ids.sidebar}
              onClick={() => setListHidden((v) => !v)}
            >
              {listHidden ? t("storelist.showList") : t("storelist.hideList")}
            </button>
          )}
          <p id={ids.mapNote} className={classes.visuallyHidden}>
            {t("map.note")}
          </p>
          <StoreMap
            leaflet={leaflet}
            stores={filteredStores}
            selectedStore={selectedStore}
            resetToken={resetToken}
            layoutToken={listHidden}
            noteId={ids.mapNote}
            onSelect={handleSelect}
          />

          {selectedStore && detailsOpen && (
            <section
              className={classes.details}
              aria-labelledby={ids.details}
              onKeyDown={(event: ReactKeyboardEvent) => {
                if (event.key === "Escape") {
                  event.stopPropagation();
                  handleCloseDetails();
                }
              }}
            >
              <div className={classes.detailsHeader}>
                <Heading
                  level={headingLevel + 1}
                  className={classes.detailTitle}
                  id={ids.details}
                  tabIndex={-1}
                >
                  {selectedStore.name}
                </Heading>
                <button type="button" className={classes.closeButton} onClick={handleCloseDetails}>
                  <span aria-hidden="true">{"✕"}</span>
                  <span className={classes.visuallyHidden}>
                    {fill(t("storedetails.close"), { name: selectedStore.name })}
                  </span>
                </button>
              </div>
              <div className={classes.detailsBody}>
                {selectedStore.image && (
                  <img src={selectedStore.image} alt="" className={classes.image} loading="lazy" />
                )}
                <StoreInfo
                  store={selectedStore}
                  level={headingLevel + 2}
                  translation={translation}
                  openNow={now ? isOpenAt(selectedStore.openingHoursSpecification, now) : null}
                  idPrefix={ids.details}
                />
              </div>
              {selectedStore.pageUrl && (
                <p className={classes.pageLink}>
                  <a href={selectedStore.pageUrl} className={classes.infoLink}>
                    {t("storedetails.storePage")}
                    <span className={classes.visuallyHidden}>: {selectedStore.name}</span>
                  </a>
                </p>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function StoreListItem({
  store,
  level,
  interactive,
  isSelected,
  openNow,
  onSelect,
}: {
  store: Store;
  level: number;
  interactive: boolean;
  isSelected: boolean;
  openNow: boolean | null;
  onSelect: (store: Store) => void;
}) {
  const { t } = useStoreLocatorTranslation();
  const location = storeLocation(store);
  const hasHours = store.openingHoursSpecification.length > 0;

  return (
    <li className={isSelected ? `${classes.storeItem} ${classes.storeItemSelected}` : classes.storeItem}>
      <div className={classes.itemText}>
        <Heading level={level} className={classes.storeName}>
          {interactive ? (
            <button
              type="button"
              className={classes.storeButton}
              aria-pressed={isSelected}
              data-store-id={store.id}
              onClick={() => onSelect(store)}
            >
              {store.name}
            </button>
          ) : store.pageUrl ? (
            <a href={store.pageUrl} className={classes.storeButton}>
              {store.name}
            </a>
          ) : (
            store.name
          )}
        </Heading>
        {location && <p className={classes.storeLocation}>{location}</p>}
      </div>
      {hasHours && openNow !== null && (
        <span className={openNow ? classes.openBadge : classes.closedBadge}>
          <span aria-hidden="true" className={classes.statusIcon}>
            {openNow ? "●" : "○"}
          </span>{" "}
          {openNow ? t("storelist.open") : t("storelist.closed")}
        </span>
      )}
    </li>
  );
}

function StoreMap({
  leaflet,
  stores,
  selectedStore,
  resetToken,
  layoutToken,
  noteId,
  onSelect,
}: {
  leaflet: LeafletDeps | null;
  stores: Store[];
  selectedStore: Store | null;
  resetToken: number;
  layoutToken: boolean;
  noteId: string;
  onSelect: (store: Store) => void;
}) {
  const { t } = useStoreLocatorTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const layerRef = useRef<Leaflet.LayerGroup | null>(null);

  // Create the map once Leaflet is loaded.
  useEffect(() => {
    if (!leaflet || !containerRef.current || mapRef.current) return;
    const { L } = leaflet;
    const reduced = prefersReducedMotion();
    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: 12,
      zoomControl: false,
      zoomAnimation: !reduced,
      fadeAnimation: !reduced,
      markerZoomAnimation: !reduced,
    });
    L.control
      .zoom({ zoomInTitle: t("map.zoomIn"), zoomOutTitle: t("map.zoomOut") })
      .addTo(map);
    map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ${t(
        "map.contributors",
      )}`,
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, [leaflet, t]);

  // One keyboard-reachable marker per store, named by the store.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!leaflet || !map || !layer) return;
    const { L, icon } = leaflet;
    layer.clearLayers();
    const located = stores.filter((store) => store.geo);
    for (const store of located) {
      const { latitude, longitude } = store.geo!;
      const label = [store.name, storeLocation(store)].filter(Boolean).join(", ");
      L.marker([latitude, longitude], { icon, alt: label, title: label, keyboard: true })
        .on("click", () => onSelect(store))
        // A marker has the button role: Enter and Space activate it like a click.
        .on("keypress", (event: Leaflet.LeafletKeyboardEvent) => {
          const { key } = event.originalEvent;
          if (key === "Enter" || key === " ") {
            event.originalEvent.preventDefault();
            onSelect(store);
          }
        })
        .addTo(layer);
    }
    if (located.length > 0) {
      const bounds = L.latLngBounds(
        located.map((store) => [store.geo!.latitude, store.geo!.longitude] as [number, number]),
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14, animate: !prefersReducedMotion() });
    } else {
      map.setView(DEFAULT_CENTER, 5, { animate: false });
    }
  }, [leaflet, stores, onSelect, resetToken]);

  // Follow the selected store.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedStore?.geo) return;
    const target: [number, number] = [selectedStore.geo.latitude, selectedStore.geo.longitude];
    if (prefersReducedMotion()) map.setView(target, 13, { animate: false });
    else map.flyTo(target, 13, { duration: 0.5 });
  }, [selectedStore]);

  // The map changes size when the list is hidden or shown.
  useEffect(() => {
    mapRef.current?.invalidateSize();
  }, [layoutToken]);

  return (
    <div
      ref={containerRef}
      className={classes.map}
      role="region"
      aria-label={t("map.label")}
      aria-describedby={noteId}
    />
  );
}
