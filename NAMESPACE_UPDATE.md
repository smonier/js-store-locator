# Namespace Update Summary

## Overview
All content definitions and namespaces have been updated to align with the module name **js-store-locator**.

## Namespace Changes

### Old Namespaces (Removed)
- `slocnt` (storelocator node types)
- `slocmix` (storelocator mixins)

### New Namespaces (Applied)
- `jsstorelocnt` (js-store-locator node types)
- `jsstorelocmix` (js-store-locator mixins)

## Updated Files

### 1. Content Definitions (CND)

#### `settings/definitions.cnd`
- **Old:** `<slocnt = 'http://www.jahia.org/storelocator/nt/1.0'>`
- **New:** `<jsstorelocnt = 'http://www.jahia.org/js-store-locator/nt/1.0'>`
- **Old:** `<slocmix = 'http://www.jahia.org/storelocator/mix/1.0'>`
- **New:** `<jsstorelocmix = 'http://www.jahia.org/js-store-locator/mix/1.0'>`

**Content Types Renamed:**
- `[slocmix:storeLocator]` → `[jsstorelocmix:component]`
- `[slocmix:address]` → `[jsstorelocmix:address]`
- `[slocmix:geo]` → `[jsstorelocmix:geo]`
- `[slocnt:store]` → `[jsstorelocnt:store]`

#### `src/components/StoreLocatorApp/definition.cnd`
- `[slocnt:storeLocatorApp]` → `[jsstorelocnt:storeLocatorApp]`

### 2. Server Component

#### `src/components/StoreLocatorApp/default.server.tsx`
- `nodeType: "slocnt:storeLocatorApp"` → `nodeType: "jsstorelocnt:storeLocatorApp"`
- `node.isNodeType("slocnt:store")` → `node.isNodeType("jsstorelocnt:store")`

### 3. Resource Bundles

#### `settings/resources/js-store-locator_en.properties`
All property keys updated:
- `slocnt_storeLocatorApp` → `jsstorelocnt_storeLocatorApp`
- `slocnt_store` → `jsstorelocnt_store`
- `slocmix_storeLocator` → `jsstorelocmix_component`
- `slocmix_address` → `jsstorelocmix_address`
- `slocmix_geo` → `jsstorelocmix_geo`

Plus all nested properties like:
- `slocnt_storeLocatorApp.welcomeTitle` → `jsstorelocnt_storeLocatorApp.welcomeTitle`
- `slocnt_store.name` → `jsstorelocnt_store.name`
- `slocmix_address.streetAddress` → `jsstorelocmix_address.streetAddress`
- etc.

#### `settings/resources/js-store-locator_fr.properties`
Same updates as English file.

### 4. Content Editor Form Overrides

**Files Renamed:**
- `settings/content-editor-forms/fieldsets/slocnt_store.json` → `jsstorelocnt_store.json`
- `settings/content-editor-forms/fieldsets/slocnt_storeLocatorApp.json` → `jsstorelocnt_storeLocatorApp.json`

**Content Updated:**
- JSON `"name"` field: `"slocnt:store"` → `"jsstorelocnt:store"`
- JSON `"name"` field: `"slocnt:storeLocatorApp"` → `"jsstorelocnt:storeLocatorApp"`

### 5. Documentation

All documentation files updated:
- `MODULE_README.md`
- `IMPLEMENTATION_SUMMARY.md`
- `CONTENT_EXAMPLES.md`

All references changed:
- `slocnt:storeLocatorApp` → `jsstorelocnt:storeLocatorApp`
- `slocnt:store` → `jsstorelocnt:store`
- `slocmix:address` → `jsstorelocmix:address`
- `slocmix:geo` → `jsstorelocmix:geo`

## Content Type Structure

### Current Namespace Structure

```
jsstorelocnt (Node Types)
├── jsstorelocnt:storeLocatorApp
│   └── extends: jnt:content, jmix:droppableContent, jmix:editorialContent, mix:title, jsstorelocmix:component
└── jsstorelocnt:store
    └── extends: jnt:content, jmix:mainResource, mix:title, jsstorelocmix:address, jsstorelocmix:geo, jmix:structuredContent, jsstorelocmix:component

jsstorelocmix (Mixins)
├── jsstorelocmix:component (category mixin)
├── jsstorelocmix:address (address properties)
└── jsstorelocmix:geo (geolocation coordinates)
```

## Migration Notes

### For Fresh Installations
No migration needed - just install and use the new namespaces.

### For Existing Installations (If Any Content Exists)
If you had previously deployed with `slocnt`/`slocmix` namespaces:

1. **Before upgrading**, export any existing content
2. **Remove old definitions** via Jahia tools browser:
   - Navigate to: `http://localhost:8080/cms/login?redirect=/modules/tools/definitionsBrowser.jsp`
   - Delete old `slocnt` and `slocmix` definitions
3. **Deploy new module** with updated namespaces
4. **Recreate content** using new node types

**⚠️ Warning:** Changing namespaces after content creation will break existing content. This update should be applied before creating any production content.

## Verification

To verify the namespace update was successful:

1. **Check CND files**:
   ```bash
   grep -r "slocnt\|slocmix" settings/ src/
   ```
   Should return no matches.

2. **Check for new namespaces**:
   ```bash
   grep -r "jsstorelocnt\|jsstorelocmix" settings/ src/
   ```
   Should return all updated references.

3. **Build the module**:
   ```bash
   yarn build
   ```
   Should complete without errors.

4. **Deploy and test**:
   - Deploy to Jahia
   - Create a `jsstorelocnt:storeLocatorApp` content item
   - Add `jsstorelocnt:store` items as children
   - Verify in Content Editor that labels display correctly

## Benefits of This Update

1. **Consistency**: Namespace now matches module name (`js-store-locator`)
2. **Clarity**: Clear distinction from generic "store locator" to this specific module
3. **Standards**: Follows Jahia module naming conventions
4. **Maintenance**: Easier to identify which module owns which content types
5. **Uniqueness**: Reduces risk of namespace collisions with other modules

## Date
Updated: November 19, 2025
