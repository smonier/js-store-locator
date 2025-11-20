import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "../../i18n"; // Dedicated i18n instance for this module
import "leaflet/dist/leaflet.css"; // Bundle Leaflet styles to ensure tiles render
import type { Store } from "./types";
import classes from "./StoreLocatorApp.module.css";

interface StoreLocatorClientProps {
  title: string;
  welcomeTitle?: string;
  welcomeMessage?: string;
  stores: Store[];
  locale: string;
}

export default function StoreLocatorClient({
  title,
  welcomeTitle,
  welcomeMessage,
  stores,
  locale,
}: StoreLocatorClientProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <StoreLocatorClientInner
        title={title}
        welcomeTitle={welcomeTitle}
        welcomeMessage={welcomeMessage}
        stores={stores}
        locale={locale}
      />
    </I18nextProvider>
  );
}

function StoreLocatorClientInner({
  title,
  welcomeTitle,
  welcomeMessage,
  stores,
  locale,
}: StoreLocatorClientProps) {
  const { t, i18n } = useTranslation();
  const [i18nReady, setI18nReady] = useState(i18n.isInitialized);

  useEffect(() => {
    if (i18n.isInitialized) {
      setI18nReady(true);
      return;
    }
    const handleInit = () => setI18nReady(true);
    i18n.on("initialized", handleInit);
    return () => {
      i18n.off("initialized", handleInit);
    };
  }, [i18n]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [leafletDeps, setLeafletDeps] = useState<{
    L: any;
    defaultIcon: any;
  } | null>(null);

  // Initialize i18n with locale
  useEffect(() => {
    if (locale) {
      const normalizedLocale = locale.toLowerCase().split(/[-_]/)[0];
      i18n.changeLanguage(normalizedLocale);
    }
  }, [locale, i18n]);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load Leaflet on client only to avoid SSR issues
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadLeaflet = async () => {
      console.info("[store-locator] loading Leaflet resources");
      try {
        const [leaflet, iconUrl, shadowUrl] = await Promise.all([
          import("leaflet"),
          import("leaflet/dist/images/marker-icon.png"),
          import("leaflet/dist/images/marker-shadow.png"),
        ]);

        const L = leaflet.default;
        const resolvedIconUrl = (iconUrl as any).default ?? iconUrl;
        const resolvedShadowUrl = (shadowUrl as any).default ?? shadowUrl;
        const defaultIcon = L.icon({
          iconUrl: resolvedIconUrl as string,
          shadowUrl: resolvedShadowUrl as string,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          shadowSize: [41, 41],
        });

        setLeafletDeps({
          L,
          defaultIcon,
        });
        console.info("[store-locator] Leaflet ready");
      } catch (error) {
        console.error("[store-locator] Error loading Leaflet", error);
      }
    };

    loadLeaflet();
  }, []);

  // Filter stores
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    const lc = searchQuery.toLowerCase();
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(lc) ||
        store.address.addressLocality.toLowerCase().includes(lc) ||
        store.address.addressRegion.toLowerCase().includes(lc)
    );
  }, [stores, searchQuery]);

  const handleStoreSelect = useCallback((store: Store) => {
    setSelectedStore(store);
    setShowStoreDetails(true);
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const handleResetStores = useCallback(() => {
    setSelectedStore(null);
    setShowStoreDetails(false);
    setSearchQuery("");
    setResetToken((v) => v + 1);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setShowStoreDetails(false);
  }, []);

  if (!i18nReady) {
    return <div className={classes.loadingMap}>Loading...</div>;
  }

  return (
    <div className={classes.app}>
      <div className={classes.container}>
        {/* Sidebar */}
        <div
          className={`${classes.sidebar} ${
            sidebarOpen ? classes.sidebarOpen : classes.sidebarClosed
          } ${isMobile ? classes.sidebarMobile : classes.sidebarDesktop}`}
        >
          <div className={classes.sidebarHeader}>
            <h1 className={classes.title}>{title}</h1>
            <div className={classes.headerActions}>
              <button className={classes.resetButton} onClick={handleResetStores}>
                {t("storelist.reset")}
              </button>
              {isMobile && (
                <button className={classes.closeButton} onClick={() => setSidebarOpen(false)}>
                  ✕
                </button>
              )}
            </div>
          </div>

          {(welcomeTitle || welcomeMessage) && (
            <div className={classes.welcomeBlock}>
              {welcomeTitle && <h2 className={classes.welcomeTitle}>{welcomeTitle}</h2>}
              {welcomeMessage && <p className={classes.welcomeMessage}>{welcomeMessage}</p>}
            </div>
          )}

          <div className={classes.searchContainer}>
            <SearchBar query={searchQuery} setQuery={setSearchQuery} />
          </div>

          <div className={classes.storeListContainer}>
            <StoreList
              stores={filteredStores}
              selectedStore={selectedStore}
              onStoreSelect={handleStoreSelect}
            />
          </div>
        </div>

        {/* Mobile Sidebar Toggle */}
        {isMobile && !sidebarOpen && (
          <button className={classes.toggleButton} onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
        )}

        {/* Collapse button on Desktop */}
        {!isMobile && (
          <button
            className={`${classes.collapseButton} ${
              sidebarOpen
                ? classes.collapseButtonOpen
                : classes.collapseButtonClosed
            }`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ›
          </button>
        )}

        {/* Map + Store Details */}
        <div className={classes.mapContainer}>
          <StoreMap
            leafletDeps={leafletDeps}
            resetToken={resetToken}
            stores={filteredStores}
            selectedStore={selectedStore}
            onStoreSelect={handleStoreSelect}
            debug={!leafletDeps}
          />
          
          {selectedStore && showStoreDetails && (
            <div className={classes.storeDetailsContainer}>
              <StoreDetails store={selectedStore} onClose={handleCloseDetails} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Search Bar Component
function SearchBar({ query, setQuery }: { query: string; setQuery: (q: string) => void }) {
  const { t } = useTranslation();

  return (
    <div className={classes.searchForm}>
      <div className={classes.inputContainer}>
        <span className={classes.searchIcon}>🔍</span>
        <input
          type="text"
          className={classes.searchInput}
          placeholder={t("searchbar.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}

// Store List Component
function StoreList({
  stores,
  selectedStore,
  onStoreSelect,
}: {
  stores: Store[];
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
}) {
  const { t } = useTranslation();

  if (stores.length === 0) {
    return (
      <div className={classes.noStores}>
        <p>{t("storelist.nostore")}</p>
      </div>
    );
  }

  return (
    <div className={classes.storeListWrapper}>
      {stores.map((store) => (
        <StoreListItem
          key={store.id}
          store={store}
          isSelected={selectedStore?.id === store.id}
          onSelect={() => onStoreSelect(store)}
        />
      ))}
    </div>
  );
}

function StoreListItem({
  store,
  isSelected,
  onSelect,
}: {
  store: Store;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  const isOpen = isStoreOpen(store);

  return (
    <div
      className={isSelected ? classes.storeItemSelected : classes.storeItem}
      onClick={onSelect}
    >
      <div className={classes.itemContent}>
        <div>
          <h3 className={isSelected ? `${classes.storeName} ${classes.storeNameSelected}` : classes.storeName}>
            {store.name}
          </h3>
          <p className={classes.storeLocation}>
            {store.address.addressLocality}
            {store.address.addressRegion ? `, ${store.address.addressRegion}` : ""}
          </p>
        </div>
        {store.openingHoursSpecification && (
          <div>
            <span className={isOpen ? classes.openBadge : classes.closedBadge}>
              {isOpen ? t("storelist.open") : t("storelist.closed")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Store Map Component
function StoreMap({
  leafletDeps,
  resetToken,
  stores,
  selectedStore,
  onStoreSelect,
  debug,
}: {
  leafletDeps: {
    L: any;
    defaultIcon: any;
  } | null;
  resetToken: number;
  stores: Store[];
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
  debug: boolean;
}) {
  if (!leafletDeps) {
    if (debug) {
      console.warn("[store-locator] Leaflet dependencies not ready yet");
    }
    return <div className={classes.loadingMap}>Loading map...</div>;
  }

  const { L, defaultIcon } = leafletDeps;

  const defaultCenter: [number, number] = [48.8566, 2.3522];

  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;
    const map = L.map(mapRef.current, {
      center: defaultCenter,
      zoom: 12,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    leafletMapRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);
  }, [L, defaultCenter]);

  useEffect(() => {
    const map = leafletMapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    stores.forEach((store) => {
      const marker = L.marker([store.geo.latitude, store.geo.longitude], { icon: defaultIcon });
      marker.on("click", () => onStoreSelect(store));
      marker.bindTooltip(
        `${store.name}<br />${store.address.addressLocality}${store.address.addressRegion ? `, ${store.address.addressRegion}` : ""}`,
        { direction: "top", offset: [0, -20], opacity: 1 },
      );
      marker.addTo(layer);
    });

    if (stores.length > 0) {
      const bounds = L.latLngBounds(
        stores.map((store) => [store.geo.latitude, store.geo.longitude] as [number, number]),
      );
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      map.setView(defaultCenter, 12);
    }
  }, [stores, onStoreSelect, defaultIcon, L, resetToken]);

  useEffect(() => {
    const map = leafletMapRef.current;
    if (map && selectedStore) {
      map.flyTo([selectedStore.geo.latitude, selectedStore.geo.longitude], 13, { duration: 0.5 });
    }
  }, [selectedStore]);

  return <div className={classes.map} ref={mapRef} />;
}

// Store Details Component
function StoreDetails({ store, onClose }: { store: Store; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "en";

  const formatAddress = () => {
    const { streetAddress, addressLocality, addressRegion, postalCode } = store.address;
    return `${streetAddress}, ${addressLocality}, ${addressRegion} ${postalCode}`;
  };

  const groupedHours = groupOpeningHours(store.openingHoursSpecification || [], t, locale);
  const isOpen = isStoreOpenNow(store);

  return (
    <div className={classes.card}>
      <div className={classes.cardContent}>
        <div className={classes.flexRow}>
          {/* Column 1: Image */}
          {store.image && (
            <div className={classes.columnQuarter}>
              <div className={classes.imageContainer}>
                <img
                  src={store.image}
                  alt={store.name}
                  className={classes.image}
                />
                <button onClick={onClose} className={classes.closeButton}>
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className={classes.verticalDivider} />

          {/* Column 2: Name & Description */}
          <div className={classes.columnQuarter}>
            <h2 className={classes.detailTitle}>{store.name}</h2>
            {store.description && <p className={classes.description}>{store.description}</p>}
            
            {store.amenityFeature && store.amenityFeature.length > 0 && (
              <div className={classes.amenities}>
                <div className={classes.amenityHeader}>
                  <span className={classes.amenityIcon}>♿</span>
                  <h3 className={classes.amenityTitle}>{t("storedetails.amenities")}</h3>
                </div>
                <div className={classes.badgeContainer}>
                  {store.amenityFeature.map((amenity) => (
                    <span key={amenity} className={classes.badge}>
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={classes.verticalDivider} />

          {/* Column 3: Address & Contact */}
          <div className={classes.columnQuarter}>
            <div className={classes.infoSection}>
              <span className={classes.infoIcon}>📍</span>
              <div>
                <h3 className={classes.infoTitle}>{t("storedetails.address")}</h3>
                <p className={classes.infoContent}>{formatAddress()}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${store.geo.latitude},${store.geo.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.infoLink}
                >
                  {t("storedetails.directions")}
                </a>
              </div>
            </div>

            {store.telephone && (
              <div className={classes.contactItem}>
                <span className={classes.contactIcon}>📞</span>
                <a href={`tel:${store.telephone}`} className={classes.contactLink}>
                  {store.telephone}
                </a>
              </div>
            )}

            {store.url && (
              <div className={classes.contactItem}>
                <span className={classes.contactIcon}>🌐</span>
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.contactLink}
                >
                  {t("storedetails.website")}
                </a>
              </div>
            )}
          </div>

          <div className={classes.verticalDivider} />

          {/* Column 4: Hours */}
          {store.openingHoursSpecification && (
            <div className={classes.columnQuarter}>
              <div className={classes.infoSection}>
                <span className={classes.infoIcon}>🕒</span>
                <div>
                  <div className={classes.hoursHeader}>
                    <h3 className={classes.hoursTitle}>{t("storedetails.hours")}</h3>
                    <span className={isOpen ? classes.open : classes.closed}>
                      {isOpen ? t("storedetails.open") : t("storedetails.closed")}
                    </span>
                  </div>
                  <div>
                    {groupedHours.map((group, i) => (
                      <div key={i} className={classes.hoursItem}>
                        <span>{group.days}</span>
                        <span>{group.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function isStoreOpen(store: Store): boolean {
  if (!store.openingHoursSpecification || store.openingHoursSpecification.length === 0) {
    return false;
  }

  const now = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = days[now.getDay()];

  const todayHours = store.openingHoursSpecification.find((spec) => spec.dayOfWeek === today);

  if (!todayHours) return false;

  const currentTime = now.getHours() * 100 + now.getMinutes();
  const opensTime = parseInt(todayHours.opens.replace(":", ""));
  const closesTime = parseInt(todayHours.closes.replace(":", ""));

  return currentTime >= opensTime && currentTime < closesTime;
}

function isStoreOpenNow(store: Store): boolean {
  return isStoreOpen(store);
}

function groupOpeningHours(
  hours: Array<{ dayOfWeek: string; opens: string; closes: string }>,
  t: (key: string) => string,
  locale: string
): Array<{ days: string; hours: string }> {
  const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const sortedHours = [...hours].sort(
    (a, b) => daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek)
  );

  const result: Array<{ days: string; hours: string }> = [];
  let currentGroup: typeof hours = [];

  sortedHours.forEach((hour, index) => {
    if (
      index === 0 ||
      hour.opens !== sortedHours[index - 1].opens ||
      hour.closes !== sortedHours[index - 1].closes
    ) {
      if (currentGroup.length > 0) {
        result.push(formatHourGroup(currentGroup, t, locale));
        currentGroup = [];
      }
      currentGroup.push(hour);
    } else {
      currentGroup.push(hour);
    }

    if (index === sortedHours.length - 1 && currentGroup.length > 0) {
      result.push(formatHourGroup(currentGroup, t, locale));
    }
  });

  return result;
}

function formatHourGroup(
  group: Array<{ dayOfWeek: string; opens: string; closes: string }>,
  t: (key: string) => string,
  locale: string
): { days: string; hours: string } {
  const days = group.map((h) => h.dayOfWeek);
  let daysText = "";

  const translateDay = (day: string) => t(`days.${day.toLowerCase()}`);

  if (days.length === 1) {
    daysText = translateDay(days[0]);
  } else if (days.length === 7) {
    daysText = t("days.everyday");
  } else if (["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].every((d) => days.includes(d)) && days.length === 5) {
    daysText = t("days.weekdays");
  } else if (days.includes("Saturday") && days.includes("Sunday") && days.length === 2) {
    daysText = t("days.weekends");
  } else {
    daysText = days.map(translateDay).join(", ");
  }

  const hours =
    group[0].opens === "00:00" && group[0].closes === "23:59"
      ? t("storedetails.allday")
      : `${formatTime(group[0].opens, locale)} - ${formatTime(group[0].closes, locale)}`;

  return { days: daysText, hours };
}

function formatTime(time: string, locale: string = "en"): string {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);

  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
