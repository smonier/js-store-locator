# JS Store Locator

A Jahia JavaScript module that adds a store locator to a site: editors manage stores as content, and visitors find them through a searchable list, an OpenStreetMap map rendered with Leaflet, and a details panel with address, contact links, amenities and opening hours. Each store also has its own page. The module ships a Content Editor selector so editors set opening hours with drop-down lists instead of typing JSON.

## Features

- **Store locator component** (`jsstorelocnt:storeLocatorApp`): a searchable list of stores, a map with one marker per store, and a details panel.
- **Search** by store name, city, region or postal code, ignoring case and accents ("orleans" finds "Orléans"). The number of results is announced.
- **Open or closed now**, computed in the visitor's browser and refreshed every minute.
- **Opening hours** shown as a weekly table, with consecutive days that share the same hours grouped ("Monday to Friday"). Several slots per day, all-day slots and slots that run past midnight are supported.
- **Store pages**: a store is a main resource with its own URL; its views render the same details as the locator.
- **Works without JavaScript**: the list is rendered on the server and each store name links to the store's page.
- **Responsive**: list and map side by side when the component is at least 48rem wide, stacked below that, down to 320 px.
- **Themeable** through `--jsstoreloc-*` CSS custom properties, including a dark host theme.
- **Opening-hours editor** for Content Editor, delivered as a jContent UI extension.
- **English and French** for visitors and editors.

## Requirements

| Requirement                 | Version                                                        |
| --------------------------- | -------------------------------------------------------------- |
| Jahia                       | 8.2.0.0 or later (`required-version` in `package.json`)        |
| javascript-modules-engine   | 1.x (`javascript-modules-engine=[1,2)`)                        |
| Node.js and Yarn (to build) | Node 22 or later (`.node-version`: 22), Yarn 4 (`yarn@4.10.3`) |

The only module dependencies are `default` and `javascript-modules-engine`. The module does not depend on jExperience or any other add-on.

## Installation

### From a GitHub release

1. Download `js-store-locator-v<version>.tgz` from the [Releases page](https://github.com/smonier/js-store-locator/releases).
2. In Jahia, open **Administration > Server > Modules and Extensions > Modules** and upload the file.
3. Enable the module on your site (**Administration > Sites**, or the site's module settings).

### From source

```bash
yarn install
yarn build      # type-check, build the views, the island and the UI extension, then pack dist/package.tgz
yarn deploy     # send dist/package.tgz to the Jahia instance configured in .env
```

See [Development](#development) for the `.env` settings.

## Usage for editors

1. **Create a content folder for the stores**, for example `stores` under the site's contents.
2. **Add stores** (`Store` content type) to that folder. Fill in the name, address, coordinates and the other fields described in [Content model](#content-model). Stores without valid latitude and longitude are listed but not placed on the map.
3. **Set the opening hours.** The Opening hours field is multiple: add one value per time slot. Each value has three drop-down lists: day of the week, opening time and closing time, in 30-minute steps from 00:00 to 23:30.
   - Several values for the same day give several slots (for example a lunch break).
   - A slot that opens and closes at the same time (for example 00:00 to 00:00) means open 24 hours.
   - A slot that closes earlier than it opens (for example 18:00 to 02:00) runs past midnight into the next day.
   - A day with no slot is shown as closed.
4. **Add the Store Locator App** (`Store Locator App` content type, in the Store Locator Component category) to a page area.
5. **Point it to the folder** with the Stores Folder field, and optionally set a Welcome Title and a Welcome Message.
6. **Publish** the folder, the stores, their images and the page.

The locator lists the stores that are direct children of the selected folder; stores in sub-folders are not listed. If no folder is set, the locator looks for stores among its own child nodes; the content type declares no child node definition, so in practice set the folder.

The Welcome Title is the locator's heading; when it is empty, the component's title is used instead.

The locator's rendering is refreshed when the folder, any listed store or any store image changes.

## Content model

Namespaces: `jsstorelocnt` (`http://www.jahia.org/js-store-locator/nt/1.0`) for node types, `jsstorelocmix` (`http://www.jahia.org/js-store-locator/mix/1.0`) for mixins.

### `jsstorelocnt:storeLocatorApp`

Supertypes: `jnt:content`, `jmix:droppableContent`, `jmix:editorialContent`, `mix:title`, `jsstorelocmix:component`.

| Property         | Type                          | Purpose                                                   |
| ---------------- | ----------------------------- | --------------------------------------------------------- |
| `jcr:title`      | string (from `mix:title`)     | Component title; the heading when no welcome title is set |
| `welcomeTitle`   | string, internationalized     | Heading of the locator                                    |
| `welcomeMessage` | string, internationalized     | Short introduction under the heading                      |
| `storesFolder`   | weakreference (folder picker) | Folder that holds the `jsstorelocnt:store` nodes to list  |

Views: `default` (the locator) and `cm` (a Content Manager preview with the store count and the first five stores).

### `jsstorelocnt:store`

Supertypes: `jnt:content`, `jmix:editorialContent`, `jmix:mainResource`, `mix:title`, `jmix:structuredContent`, `jsstorelocmix:address`, `jsstorelocmix:geo`, `jsstorelocmix:component`.

| Property         | Type                                         | Purpose                                                                                                   |
| ---------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `jcr:title`      | string (from `mix:title`)                    | Node title; used as the store name when `name` is empty                                                   |
| `name`           | string, internationalized                    | Store name shown to visitors                                                                              |
| `description`    | string, internationalized                    | Plain-text description                                                                                    |
| `url`            | string                                       | Website. Only `http` and `https` addresses are linked; a value starting with `www.` is read as `https://` |
| `telephone`      | string                                       | Phone number as displayed; the `tel:` link is built from its digits, without an extension or a "(0)"      |
| `image`          | weakreference to `jmix:image` (image picker) | Store photo, shown in the details panel and on the store page                                             |
| `priceRange`     | string, choice of `$` to `$$$$`              | Price level; shown in the Content Manager preview only                                                    |
| `amenityFeature` | string, multiple, internationalized          | Amenities, shown as a list; duplicates and empty values are dropped                                       |
| `openingHours`   | string, multiple, not indexed                | One JSON value per slot, edited with the opening-hours selector (see below)                               |

### `jsstorelocmix:address`

| Property          | Type   | Purpose                                                                                                                                  |
| ----------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `streetAddress`   | string | Street and number                                                                                                                        |
| `addressLocality` | string | City; searchable                                                                                                                         |
| `addressRegion`   | string | State or region; searchable                                                                                                              |
| `postalCode`      | string | Postal code; searchable                                                                                                                  |
| `addressCountry`  | string | Two-letter country code (for example `FR`), displayed as the country name in the visitor's language; any other value is shown as entered |

### `jsstorelocmix:geo`

| Property    | Type                | Purpose                                                       |
| ----------- | ------------------- | ------------------------------------------------------------- |
| `latitude`  | double, not indexed | Between -90 and 90; places the marker and the directions link |
| `longitude` | double, not indexed | Between -180 and 180                                          |

### Opening-hours values

Each value of `openingHours` is one JSON object:

```json
{ "dayOfWeek": "Monday", "opens": "09:00", "closes": "18:00" }
```

- `dayOfWeek` is one of `Monday` to `Sunday` (English names).
- `opens` and `closes` are `HH:MM`, 24-hour clock.
- `opens` equal to `closes`, or `00:00` to `23:59`, means open all day.
- `closes` earlier than `opens` means the slot ends after midnight.

Values that are not valid JSON, name an unknown day or carry a malformed time are ignored at render time.

### `jsstorelocmix:component`

A mixin (`jmix:droppableContent`, `jmix:editorialContent`) that groups the module's types under one category in the content type selector.

### Store views

| View       | Use                                                                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default`  | A store placed on a page, or the store's own page. On its own page the store name is the `h1`; elsewhere it is a heading linked to the store page |
| `fullPage` | The store's own page, for template sets that render a main resource with a `fullPage` view. Hidden from the editors' view picker                  |
| `cm`       | Content Manager preview card                                                                                                                      |

## Map, tiles and content security policy

The map uses [Leaflet](https://leafletjs.com) 1.9 with OpenStreetMap tiles from `https://tile.openstreetmap.org/{z}/{x}/{y}.png` (maximum zoom 19). The map credits ("Leaflet | © OpenStreetMap contributors") are shown in a line below the map. The tile URL is set in `src/components/StoreLocatorApp/interactive.island.client.tsx`; using another tile provider means changing it there. Review the [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/) for high-traffic sites.

The map fits all located stores; with none, it shows a default view centred on Paris. Selecting a store centres the map on it.

Everything else is served from the module:

- The stylesheet, including Leaflet's, is `dist/assets/style.css`, added to the page by the views.
- Leaflet's script is a separate chunk under `dist/assets`, loaded when the island starts.
- The marker images and Leaflet's control images are inlined as `data:` URIs.

If the site sends a `Content-Security-Policy` header, allow:

| Directive    | Sources                                                                            |
| ------------ | ---------------------------------------------------------------------------------- |
| `img-src`    | `'self'`, `data:`, `https://tile.openstreetmap.org`                                |
| `script-src` | `'self'` (module files), plus what the JavaScript modules engine needs for islands |
| `style-src`  | `'self'`                                                                           |

The "Get directions" link opens Google Maps directions to the store's coordinates in a normal navigation; the page itself makes no request to Google.

## Accessibility

The module targets RGAA 4.1.2 and WCAG 2.1 level AA.

**Structure**

- The store list is the text equivalent of the map: every store, with its address, contact links, amenities and opening hours, is reachable without the map. A visually hidden note on the map says so.
- Headings follow the page: the locator's heading is an `h2`, or an `h3` inside a titled container; store names are one level below, and detail sections one level below that. On a store's own page the store name is the `h1`.
- The map is a named region (`role="region"`). Opening hours are a table with row headers. The search form has `role="search"`.
- Store photos are decorative (`alt=""`); the store name is given as text next to them.

**Keyboard and focus**

- Every control is reachable with Tab and shows a visible focus ring (3 px outline, colour `--jsstoreloc-color-focus`).
- Markers are buttons named after the store and its city and region; Enter or Space opens the details. Arrow keys move the map and the zoom buttons have translated names.
- Opening the details, from the list or a marker, moves the focus to the store name in the panel. Escape or the close button closes the panel and returns the focus to the control that opened it, or to another visible control for the same store, the search field or the list toggle when that one is hidden.
- A search that leaves out the open store closes its details while the focus stays in the search field.
- Buttons and the search field are at least 44 px (2.75rem) high; a store's list card is its name's click target.

**Screen readers**

- The search field has a visible label; the result count is a live region (`role="status"`).
- The selected store in the list carries `aria-current`. The list toggle exposes `aria-expanded` and `aria-controls`.
- Links that repeat ("Get directions", "Visit the website", "Store page") include the store name in visually hidden text; the close button reads "Close the details of {store}".

**Without JavaScript**

- The island is rendered on the server: the heading, welcome message, result count and the full list are in the HTML, and each store name links to the store's page, which shows all the details. Search, the map and the open/closed status start once the script runs.

**Colour and motion**

- Open or closed is shown as text with a symbol (● or ○), not by colour alone. The selected store has a thicker border as well as a colour change, and uses the system highlight colour in forced-colours mode.
- Animations (map zoom and pan, transitions) are turned off when the visitor prefers reduced motion.
- The default colours meet 4.5:1 for text and 3:1 for control borders and the focus ring. When you override the custom properties, keep these ratios against the surface colour.

**Known limitation**

- The open/closed status uses the visitor's clock and time zone. The content model has no time zone per store, so a visitor in another time zone sees the status for their own local time. The opening-hours table is shown as entered.

## Structured data

The module does not output schema.org structured data (no JSON-LD or microdata). The property names follow the schema.org `LocalBusiness` and `PostalAddress` vocabulary (`telephone`, `priceRange`, `amenityFeature`, `streetAddress`, `addressLocality`, `latitude`, and so on), and each opening-hours value matches the shape of an `OpeningHoursSpecification`, so a template set can map them directly if it emits its own structured data.

## Theming

Every colour, radius, shadow and the font of the locator read a `--jsstoreloc-*` custom property, with the module's light look as the fallback. Set them on any ancestor of the component (for example `:root` or a theme class) to map them to your site's tokens.

| Custom property                    | Default                           | Used for                                                  |
| ---------------------------------- | --------------------------------- | --------------------------------------------------------- |
| `--jsstoreloc-color-text`          | `#1e293b`                         | Text                                                      |
| `--jsstoreloc-color-text-muted`    | `#475569`                         | Secondary text, placeholder, result count                 |
| `--jsstoreloc-color-surface`       | `#ffffff`                         | Panel, list items, inputs, buttons                        |
| `--jsstoreloc-color-surface-alt`   | `#f8fafc`                         | Hover background                                          |
| `--jsstoreloc-color-border`        | `#e2e8f0`                         | Panel and separator borders                               |
| `--jsstoreloc-color-border-strong` | `#64748b`                         | Control and list item borders                             |
| `--jsstoreloc-color-accent`        | `#1d4ed8`                         | Links, selected store                                     |
| `--jsstoreloc-color-accent-subtle` | `#eff6ff`                         | Selected store background                                 |
| `--jsstoreloc-color-focus`         | `#1d4ed8`                         | Focus ring                                                |
| `--jsstoreloc-color-open-bg`       | `#dcfce7`                         | "Open" badge background                                   |
| `--jsstoreloc-color-open-text`     | `#166534`                         | "Open" badge text                                         |
| `--jsstoreloc-color-closed-bg`     | `#fee2e2`                         | "Closed" badge background                                 |
| `--jsstoreloc-color-closed-text`   | `#991b1b`                         | "Closed" badge text                                       |
| `--jsstoreloc-radius`              | `0.375rem`                        | Corner radius                                             |
| `--jsstoreloc-shadow`              | `0 4px 6px -1px rgb(0 0 0 / 0.1)` | Panel shadow                                              |
| `--jsstoreloc-font-family`         | `inherit`                         | Font                                                      |
| `--jsstoreloc-color-scheme`        | `light`                           | `color-scheme` of the locator (form controls, scrollbars) |

**Light and dark.** The locator keeps a light panel by default: it sets its own text colour and `color-scheme`, so it stays readable on a dark page. To follow a dark host theme, map the colours and set `--jsstoreloc-color-scheme: dark`:

```css
:root {
  --jsstoreloc-color-text: var(--site-color-text);
  --jsstoreloc-color-surface: var(--site-color-surface);
  --jsstoreloc-color-accent: var(--site-color-link);
  --jsstoreloc-color-focus: var(--site-color-focus);
}

@media (prefers-color-scheme: dark) {
  :root {
    --jsstoreloc-color-scheme: dark;
    --jsstoreloc-color-surface: #0f172a;
    --jsstoreloc-color-surface-alt: #1e293b;
    --jsstoreloc-color-text: #e2e8f0;
    --jsstoreloc-color-text-muted: #94a3b8;
    /* ...and the other colours, keeping 4.5:1 for text and 3:1 for borders and focus */
  }
}
```

**Store views.** A store rendered by its `default` or `fullPage` view is page content rather than a panel: it takes the host's text colour, background and colour scheme unless the `--jsstoreloc-*` properties are set, and then paints the matching surface under the text.

The map tiles themselves are not themed.

## Internationalisation

| Audience                                                | Files                                                                 |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| Visitors (views, island) and the opening-hours selector | `settings/locales/en.json`, `settings/locales/fr.json`                |
| Editors (type, field and tooltip labels)                | `settings/resources/js-store-locator_en.properties`, `_fr.properties` |

The views and the island use a small translation helper (`src/components/StoreLocatorApp/translation.tsx`) that reads these JSON files directly, so the module does not start its own i18next instance. The locale is the page's rendering locale: French for `fr` and its variants, English for every other language. Missing keys fall back to English. Times and country names are formatted with the browser's or server's `Intl` APIs in that language.

Store content (`name`, `description`, `welcomeTitle`, `welcomeMessage`, `amenityFeature`) is internationalized in the repository and translated by editors as usual.

## Development

### Prerequisites

- Node.js 22 (see `.node-version`) and Yarn 4 through Corepack (`corepack enable`).
- A local Jahia 8.2. The included `docker-compose.yml` starts `jahia/jahia-ee:8.2` with PostgreSQL 16 and installs `javascript-modules-engine` 1.0.1 at startup (`docker/provisioning.yml`):

  ```bash
  docker compose up --wait
  ```

### Scripts

| Script         | Description                                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `yarn build`   | Type-check, build the views and the island (`dist/`), build the UI extension (`javascript/apps/`), then pack `dist/package.tgz`                                          |
| `yarn package` | Pack the module into `dist/package.tgz`                                                                                                                                  |
| `yarn deploy`  | Upload `dist/package.tgz` to Jahia through the provisioning API (`jahia-deploy`)                                                                                         |
| `yarn dev`     | Build the UI extension once, then watch the views and the island; each successful build packs and deploys (alias `yarn watch`). Rerun it after changing the UI extension |
| `yarn test`    | Unit tests (Vitest) for opening hours, search, website and phone links                                                                                                   |
| `yarn lint`    | ESLint                                                                                                                                                                   |
| `yarn format`  | Prettier                                                                                                                                                                 |
| `yarn clean`   | Remove `dist/`                                                                                                                                                           |

### Two builds

`vite.config.ts` holds two builds:

- The default mode builds the server views and the client island into `dist/` with `@jahia/vite-plugin`; React comes from the JavaScript modules engine.
- `--mode ui` builds the jContent UI extension into `javascript/apps/` with `@jahia/vite-federation-plugin` (Module Federation, React 18 shared with jContent). `src/init.tsx` registers the `OpeningHoursSelector` selector type on `jahiaApp-init:20`, and `settings/content-editor-forms/fieldsets/jsstorelocnt_store.json` assigns it to the `openingHours` field.

`package.json` declares `/dist/client`, `/dist/assets` and `/javascript/apps` as static resources.

### Deploying to a local Jahia

`yarn deploy` reads a `.env` file at the project root (not committed):

```properties
JAHIA_HOST=http://localhost:8080
JAHIA_USER=root:<password>
```

`JAHIA_USER` is `user:password`. The defaults are `http://localhost:8080` and `root:root1234`. A dedicated deployment user with only the required permissions is recommended for shared or CI environments.

### Continuous integration

`.github/workflows/build.yml` runs on every push: `yarn install --immutable`, `yarn lint`, `yarn test` and `yarn build` on Node 22, then uploads `dist/package.tgz` as a build artifact.

### Project layout

```
.
├── settings/
│   ├── definitions.cnd                 # namespaces and the jsstorelocmix:component mixin
│   ├── content-editor-forms/fieldsets/ # Content Editor overrides (price range, opening hours)
│   ├── content-types-icons/            # content type icons
│   ├── locales/                        # visitor-facing texts (en, fr)
│   └── resources/                      # editor labels and tooltips (en, fr)
├── src/
│   ├── components/
│   │   ├── StoreLocatorApp/            # locator type, server views, island, hours and search helpers
│   │   ├── Store/                      # store type and mixins, store views, data reading
│   │   └── OpeningHoursSelector/       # Content Editor selector (UI extension)
│   ├── init.tsx                        # UI extension registration
│   └── init.entry.ts
├── docker/provisioning.yml             # local Jahia provisioning
├── docker-compose.yml
├── vite.config.ts                      # views/island build and UI extension build
└── vitest.config.mjs
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

Released under the [MIT License](LICENSE).
