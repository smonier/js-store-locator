# Jahia Store Locator Module

A JavaScript module for Jahia that provides an interactive store locator with map integration, search functionality, and detailed store information display.

## Features

- **Interactive Map**: Uses Leaflet/OpenStreetMap to display store locations
- **Search Functionality**: Search stores by name, city, or region
- **Store Details**: Displays comprehensive store information including:
  - Address and contact information
  - Opening hours with current status (open/closed)
  - Amenities and features
  - Store images
  - Price range
- **Responsive Design**: Works on desktop and mobile devices
- **Internationalization**: Supports multiple languages (EN, FR included)
- **Jahia Integration**: Follows Jahia JavaScript Module best practices

## Content Types

### Store Locator App (`jsstorelocnt:storeLocatorApp`)
The main container component that displays the store locator interface.

**Properties:**
- `jcr:title` - Title of the store locator
- `welcomeTitle` - Welcome message title (optional)
- `welcomeMessage` - Welcome message text (optional)

### Store (`jsstorelocnt:store`)
Individual store entries with complete information.

**Properties:**
- `name` - Store name (internationalized)
- `description` - Store description (internationalized)
- `telephone` - Phone number
- `url` - Website URL
- `image` - Store image (weakreference to image node)
- `priceRange` - Price range ($, $$, $$$, $$$$)
- `amenityFeature` - List of amenities (internationalized, multiple values)
- `openingHours` - Opening hours in JSON format (multiple values)

**Address Properties (via `jsstorelocmix:address`):**
- `streetAddress` - Street address
- `addressLocality` - City
- `addressRegion` - State/Region
- `postalCode` - Postal code
- `addressCountry` - Country code

**Geolocation Properties (via `jsstorelocmix:geo`):**
- `latitude` - Latitude coordinate (double)
- `longitude` - Longitude coordinate (double)

## Installation

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Build the module:**
   ```bash
   yarn build
   ```

3. **Deploy to Jahia:**
   ```bash
   yarn deploy
   ```

## Development

### Watch Mode
For development with automatic rebuild and deployment:

```bash
yarn watch
```

### Build Commands
- `yarn build` - Build the module
- `yarn dev` - Build in watch mode
- `yarn clean` - Clean the dist folder
- `yarn package` - Create package.tgz
- `yarn deploy` - Deploy to Jahia instance

## Usage in Jahia

### Creating a Store Locator

1. **Create the Store Locator App**:
   - In jContent, create a new content item of type "Store Locator App"
   - Set the title and optional welcome messages
   - Publish the content

2. **Add Stores**:
   - Create "Store" content items as children of the Store Locator App
   - Fill in all required information:
     - Store name and description
     - Complete address
     - Latitude and longitude coordinates
     - Contact information
     - Opening hours (JSON format)
     - Amenities

3. **Opening Hours Format**:
   Opening hours should be entered as JSON strings in the format:
   ```json
   {"dayOfWeek": "Monday", "opens": "09:00", "closes": "21:00"}
   ```
   Add one entry per day of the week.

### Example Store Setup

**Store Properties:**
- Name: "Downtown Store"
- Description: "Our flagship store in the city center"
- Street Address: "123 Main Street"
- City: "Paris"
- Region: "Île-de-France"
- Postal Code: "75001"
- Country: "FR"
- Latitude: 48.8566
- Longitude: 2.3522
- Telephone: "+33-1-2345-6789"
- Price Range: "$$"
- Amenities: ["Parking", "WiFi", "Wheelchair Accessible"]

**Opening Hours** (as multiple values):
```json
{"dayOfWeek": "Monday", "opens": "09:00", "closes": "21:00"}
{"dayOfWeek": "Tuesday", "opens": "09:00", "closes": "21:00"}
{"dayOfWeek": "Wednesday", "opens": "09:00", "closes": "21:00"}
{"dayOfWeek": "Thursday", "opens": "09:00", "closes": "21:00"}
{"dayOfWeek": "Friday", "opens": "09:00", "closes": "22:00"}
{"dayOfWeek": "Saturday", "opens": "10:00", "closes": "22:00"}
{"dayOfWeek": "Sunday", "opens": "10:00", "closes": "20:00"}
```

## Architecture

### Component Structure

```
src/
└── components/
    └── StoreLocatorApp/
        ├── definition.cnd              # Content type definition
        ├── types.ts                    # TypeScript interfaces
        ├── default.server.tsx          # Server-side rendering
        ├── interactive.island.client.tsx  # Client-side interactivity
        └── StoreLocatorApp.module.css  # Component styles
```

### Server-Side Rendering
The `default.server.tsx` file:
- Retrieves all store nodes as children
- Builds store data from JCR properties
- Passes data to the client island
- Handles image URL generation
- Parses opening hours JSON

### Client-Side Island
The `interactive.island.client.tsx` file:
- Handles all user interactions
- Manages search and filtering
- Displays the map with markers
- Shows store details panel
- Handles responsive sidebar
- Dynamically loads Leaflet library

## Localization

### Client-Side (i18next)
Translation files are located in `settings/locales/`:
- `en.json` - English translations
- `fr.json` - French translations

To add a new language, create a new JSON file and add translations for all keys.

### Server-Side (Resource Bundles)
Resource bundles are in `settings/resources/`:
- `js-store-locator_en.properties` - English labels
- `js-store-locator_fr.properties` - French labels

These provide labels for the Content Editor interface.

## Styling

The module uses CSS Modules for styling. The main stylesheet is:
- `src/components/StoreLocatorApp/StoreLocatorApp.module.css`

All styles are scoped to the component to avoid conflicts.

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Leaflet** - Map library
- **React Leaflet** - React components for Leaflet
- **i18next** - Internationalization
- **Vite** - Build tool
- **@jahia/vite-plugin** - Jahia integration
- **@jahia/javascript-modules-library** - Jahia helpers

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

[Your License]

## Support

For issues and questions, please contact [Your Support Contact]

## Contributing

Contributions are welcome! Please follow the Jahia JavaScript Module development guidelines.

## References

- [Jahia JavaScript Module Development Guide](https://github.com/smonier/js-media-gallery/blob/main/JAHIA_JS_GUIDE.md)
- [Original Store Locator Webapp](https://github.com/smonier/store-locator-webapp)
- [Leaflet Documentation](https://leafletjs.com/)
- [React Leaflet Documentation](https://react-leaflet.js.org/)
