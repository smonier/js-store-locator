# JS Store Locator

Interactive store locator for Jahia built with React, Leaflet, and i18next. Includes Content Editor definitions, i18n resources, and ready-to-use views for both page rendering and Content Manager previews.

## Quick Start

```bash
yarn install
docker compose up --wait   # starts Jahia locally
yarn dev                   # watch & rebuild
```

Deploy a build:

```bash
yarn build
yarn package
yarn deploy                # or copy dist/package.tgz to your Jahia
```

## Requirements

- Node 22+
- Yarn 4+
- Docker (for local Jahia)
- **OpeningHours selector type installed**: the `jsstorelocnt:store` content type uses a field with `selectorType: "OpeningHoursJson"`. Ensure the corresponding selector/field type is present in your Jahia environment; otherwise, the opening hours field will not render.

## Content Types

- `jsstorelocnt:storeLocatorApp`
  - Properties: `welcomeTitle`, `welcomeMessage`, optional `storesFolder`
  - Views: default (interactive island), CM preview
- `jsstorelocnt:store`
  - Properties: `name`, `description`, `url`, `telephone`, `image`, `priceRange`, `amenityFeature` (multi), `openingHours` (multi JSON), address mixin, geo mixin
  - View: CM preview card with image + details

Fieldset overrides live in `settings/content-editor-forms/fieldsets`. Icons are under `settings/content-types-icons/`.

## Frontend Behavior

- Leaflet map with markers, tooltips, and details panel
- Search filters by name/city/region
- Reset button clears selection and re-fits map to all markers
- Welcome title/message block in the sidebar
- i18n via i18next (`settings/locales/en.json`, `settings/locales/fr.json`)

## Internationalization

- JS translations: `settings/locales/en.json`, `settings/locales/fr.json`
- Content type labels: `settings/resources/js-store-locator_en.properties`, `_fr.properties`
- i18n is initialized in `src/i18n.ts` and wrapped via `I18nextProvider` in the island client.

## Styling

- CSS Modules per component:
  - `src/components/StoreLocatorApp/StoreLocatorApp.module.css`
  - `src/components/Store/Store.module.css`
- Leaflet CSS is loaded via `AddResources` and bundled imports.

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

- Map shows no tiles or markers: confirm Leaflet CSS is loaded (we inject via `AddResources` in server views) and that tile requests to `https://{s}.tile.openstreetmap.org` aren’t blocked by CSP/network policy.
- Opening hours field missing: install/provide the `OpeningHoursJson` selector type in your Jahia environment.
- Translations show raw keys: ensure `src/i18n.ts` is executed (imported in the island) and locale JSON files are present.
