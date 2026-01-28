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
  - Views: Content Manager preview card

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

## Scripts

| Script          | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `yarn build`    | Type-check + build client/server bundles                           |
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
