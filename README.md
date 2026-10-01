# JS Store Locator

Jahia module that delivers a fully operational store locator experience—content types, UI, and map—built with React and Leaflet. Includes ongoing translations plus a custom OpeningHours selector so editors edit hours with friendlier dropdowns instead of raw JSON.

## Quick Start

```bash
yarn install
docker compose up --wait   # boots Jahia locally
yarn dev                   # watch + rebuild
```

To deploy:

```bash
yarn build
yarn package
yarn deploy                # or copy dist/package.tgz to your Jahia
```

## Requirements

- Node.js 22+
- Yarn 4+
- Docker (for running Jahia locally)
- No external OpeningHours selector needed: the module registers its own `selectorType: "OpeningHoursSelector"` and constrains it to `jsstorelocnt:store`.

## Content Types

- `jsstorelocnt:storeLocatorApp`
  - Properties: `welcomeTitle`, `welcomeMessage`, optional `storesFolder`
  - Views: interactive island (default), Content Manager preview
- `jsstorelocnt:store`
  - Properties include `name`, `description`, `url`, `telephone`, `image`, `priceRange`, `amenityFeature`, `openingHours`, plus address/geolocation mixins
  - Views: `fullPage` (the store's own page, used by template sets that render a main resource with that view), default, Content Manager preview card

All overrides live under `settings/content-editor-forms/fieldsets` and icons under `settings/content-types-icons`.

## Frontend Behavior

- Leaflet map with zooming markers, tooltips, and a sidebar details panel
- Search filters by store name, city, or region
- Reset button clears the selection and re-centers the map on all stores
- Welcome block displays the per-site title/message
- Custom translation context drives all UI—including the selector—so no module-specific `i18next` initialization conflicts with Jahia

## Internationalization

- JS translations: `settings/locales/en.json` and `settings/locales/fr.json`
- Content-editor labels: `settings/resources/js-store-locator_en.properties` and `_fr.properties`
- Translation context (`src/components/StoreLocatorApp/translation.tsx`) reads the locale, serves keys from the JSON files, and exposes `useStoreLocatorTranslation` to the React UI, avoiding another `i18next` instance.

## Styling

- CSS Modules per component, e.g. `src/components/StoreLocatorApp/StoreLocatorApp.module.css`
- Leaflet CSS bundled via the island client import (`import "leaflet/dist/leaflet.css"`)
- The locator keeps a light panel of its own. A host theme can map these custom properties (set them on an ancestor of the app): `--jsstoreloc-color-text`, `--jsstoreloc-color-text-muted`, `--jsstoreloc-color-surface`, `--jsstoreloc-color-surface-alt`, `--jsstoreloc-color-border`, `--jsstoreloc-color-border-strong`, `--jsstoreloc-color-accent`, `--jsstoreloc-color-accent-subtle`, `--jsstoreloc-color-focus`, `--jsstoreloc-color-open-bg`, `--jsstoreloc-color-open-text`, `--jsstoreloc-color-closed-bg`, `--jsstoreloc-color-closed-text`, `--jsstoreloc-radius`, `--jsstoreloc-shadow`, `--jsstoreloc-font-family` and `--jsstoreloc-color-scheme`. Keep text at 4.5:1 and control borders and the focus ring at 3:1 against the surface.

## Accessibility

- The store list is the text equivalent of the map: every store, with its address, contact links, amenities and opening hours, is reachable without the map. The island is rendered on the server, so without JavaScript the list links each store to its own page.
- Headings start one level below the container's title (h3 in a titled section, h2 elsewhere); the store page renders the store name as its h1.
- The search field has a visible label, and the number of results is announced (`role="status"`).
- Markers are keyboard buttons named after the store; Enter or Space opens the details, the focus moves to them, and Escape or the close button returns it to the list.
- The open/closed status is text with a symbol, computed in the visitor's browser.

## Scripts

| Script          | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `yarn build`    | Type-check, build the views and island, then the UI extension      |
| `yarn package`  | Packs the module into `dist/package.tgz`                           |
| `yarn deploy`   | Pushes the build artifact to the configured Jahia instance         |
| `yarn dev`      | Watch mode (alias `yarn watch`)                                    |
| `yarn lint`     | ESLint                                                             |
| `yarn format`   | Prettier                                                           |
| `yarn clean`    | Remove build output                                                |

## Troubleshooting

- **Map shows no tiles**: ensure Leaflet can load OpenStreetMap tiles (CSP/network) and the CSS bundle (`leaflet/dist/leaflet.css`) is served.
- **Opening hours field blank**: the module registers the selector locally, but if the field type is missing from Jahia, re-import the module’s fieldset definitions.
- **Translations stay as keys**: the module’s translation context reads `settings/locales/*.json`; double-check that files exist and the locale matches what Jahia passes to the component.
