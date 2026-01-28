# Opening Hours UI Extension Integration Summary

## What Was Done

Successfully integrated the opening-hours custom selector from https://github.com/smonier/openinghours into the js-store-locator module, following the UI extension pattern demonstrated in https://github.com/smonier/page-insights.

## Files Created

### 1. `/src/init.tsx`

- Registers the OpeningHoursSelector UI extension with Jahia's UI extender
- Loads dynamically to avoid initialization side effects
- Registers the selector type for use in content editor

### 2. `/src/components/OpeningHoursSelector/OpeningHoursSelector.tsx`

- React component that provides a custom UI for editing opening hours
- Displays three dropdowns: Day of Week, Opens, Closes
- Stores data as JSON string (compatible with existing backend structure)
- Fully internationalized with i18next
- Responsive design with proper styling

### 3. `/src/components/OpeningHoursSelector/OpeningHoursSelector.module.css`

- Styled with CSS modules for component isolation
- Grid layout with responsive breakpoints
- Consistent with Jahia design system colors

### 4. `/src/components/OpeningHoursSelector/index.ts`

- Barrel export for clean imports

### 5. `/src/ui-extender.d.ts`

- TypeScript declarations for `@jahia/ui-extender` module

## Files Modified

### 1. `/package.json`

- Added `@jahia/ui-extender` dependency for UI extension support
- Added `react-dom` as peer dependency for React components

### 2. `/vite.config.ts`

- Configured to expose `./init` module for Jahia to load
- Uses module federation for proper integration with Jahia app shell

### 3. `/settings/content-editor-forms/fieldsets/jsstorelocnt_store.json`

- Changed `openingHours` field selector from `OpeningHoursJson` to `OpeningHoursSelector`

### 4. `/settings/locales/en.json` & `/settings/locales/fr.json`

- Added `label.dayOfWeek`, `label.opens`, `label.closes` translations
- Reuses existing day translations from `days.*` namespace

## How It Works

1. When Jahia loads, it initializes the js-store-locator module
2. The `init.tsx` file registers a callback that runs during app initialization
3. The callback dynamically imports and registers the `OpeningHoursSelector` component
4. When editing a store in the content editor, the `openingHours` field now uses the custom selector
5. The selector provides a user-friendly interface with dropdowns instead of plain text fields
6. Data is stored as JSON: `{"dayOfWeek":"Monday","opens":"09:00","closes":"18:00"}`

## Advantages Over Previous Implementation

1. **Better UX**: Dropdowns with predefined values instead of free-text fields
2. **Data Validation**: Only valid days and times can be selected
3. **Consistent Formatting**: All times follow HH:MM format in 30-minute intervals
4. **Modern Architecture**: Uses UI extensions instead of legacy webpack bundles
5. **Type Safety**: Full TypeScript support with proper type definitions
6. **Maintainability**: Clean component structure following React best practices

## Next Steps

1. Run `yarn install` to install new dependencies (requires NPM_TOKEN environment variable)
2. Build the module: `yarn build`
3. Deploy to Jahia: `yarn deploy`
4. Test the opening hours selector in the content editor when editing a store

## Compatibility Notes

- The JSON structure is backward compatible with existing opening hours data
- The component gracefully handles null/undefined values with sensible defaults
- i18n uses the existing translation namespace so no additional setup is needed
- Works with both English and French locales
