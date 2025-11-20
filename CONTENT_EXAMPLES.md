# Store Content Examples

This file provides examples of how to create store content in Jahia.

## Example 1: Basic Store

### Store Properties
```
Node Type: jsstorelocnt:store
Name: downtown-store

Properties:
- jcr:title: Downtown Store
- name: Downtown Superstore
- description: Our flagship store in the heart of downtown Paris
- telephone: +33-1-2345-6789
- url: https://example.com/downtown
- priceRange: $$

Address (jsstorelocmix:address):
- streetAddress: 101 Rue de Rivoli
- addressLocality: Paris
- addressRegion: Île-de-France
- postalCode: 75001
- addressCountry: FR

Geolocation (jsstorelocmix:geo):
- latitude: 48.8606
- longitude: 2.3376

Amenities (amenityFeature - multiple values):
- Parking
- Wheelchair Accessible
- WiFi
```

### Opening Hours (multiple string values)
```json
{"dayOfWeek": "Monday", "opens": "09:00", "closes": "21:00"}
{"dayOfWeek": "Tuesday", "opens": "09:00", "closes": "21:00"}
{"dayOfWeek": "Wednesday", "opens": "09:00", "closes": "21:00"}
{"dayOfWeek": "Thursday", "opens": "09:00", "closes": "21:00"}
{"dayOfWeek": "Friday", "opens": "09:00", "closes": "22:00"}
{"dayOfWeek": "Saturday", "opens": "10:00", "closes": "22:00"}
{"dayOfWeek": "Sunday", "opens": "10:00", "closes": "20:00"}
```

## Example 2: Store with 24/7 Hours

### Opening Hours
For stores that are open 24 hours, use:
```json
{"dayOfWeek": "Monday", "opens": "00:00", "closes": "23:59"}
{"dayOfWeek": "Tuesday", "opens": "00:00", "closes": "23:59"}
{"dayOfWeek": "Wednesday", "opens": "00:00", "closes": "23:59"}
{"dayOfWeek": "Thursday", "opens": "00:00", "closes": "23:59"}
{"dayOfWeek": "Friday", "opens": "00:00", "closes": "23:59"}
{"dayOfWeek": "Saturday", "opens": "00:00", "closes": "23:59"}
{"dayOfWeek": "Sunday", "opens": "00:00", "closes": "23:59"}
```

## Example 3: Store with Variable Hours

### Opening Hours
For stores with different weekend hours:
```json
{"dayOfWeek": "Monday", "opens": "08:00", "closes": "18:00"}
{"dayOfWeek": "Tuesday", "opens": "08:00", "closes": "18:00"}
{"dayOfWeek": "Wednesday", "opens": "08:00", "closes": "18:00"}
{"dayOfWeek": "Thursday", "opens": "08:00", "closes": "18:00"}
{"dayOfWeek": "Friday", "opens": "08:00", "closes": "20:00"}
{"dayOfWeek": "Saturday", "opens": "10:00", "closes": "17:00"}
{"dayOfWeek": "Sunday", "opens": "12:00", "closes": "16:00"}
```

## Example 4: Store Closed on Sundays

### Opening Hours
Simply omit the Sunday entry:
```json
{"dayOfWeek": "Monday", "opens": "09:00", "closes": "19:00"}
{"dayOfWeek": "Tuesday", "opens": "09:00", "closes": "19:00"}
{"dayOfWeek": "Wednesday", "opens": "09:00", "closes": "19:00"}
{"dayOfWeek": "Thursday", "opens": "09:00", "closes": "19:00"}
{"dayOfWeek": "Friday", "opens": "09:00", "closes": "19:00"}
{"dayOfWeek": "Saturday", "opens": "09:00", "closes": "19:00"}
```

## Example 5: Complete Store with All Features

```
Node Type: jsstorelocnt:store
Name: luxury-boutique

Properties:
- jcr:title: Luxury Boutique Strasbourg
- name: Luxury Boutique
- description: High-end fashion boutique in the heart of Strasbourg
- telephone: +33-3-8845-6789
- url: https://example.com/luxury-boutique
- priceRange: $$$$
- image: [reference to uploaded image node]

Address:
- streetAddress: 3 Place Kléber
- addressLocality: Strasbourg
- addressRegion: Grand Est
- postalCode: 67000
- addressCountry: FR

Geolocation:
- latitude: 48.5846
- longitude: 7.7508

Amenities:
- Parking
- Wheelchair Accessible
- WiFi
- Personal Shopper
- Coffee Shop

Opening Hours:
{"dayOfWeek": "Monday", "opens": "10:00", "closes": "19:00"}
{"dayOfWeek": "Tuesday", "opens": "10:00", "closes": "19:00"}
{"dayOfWeek": "Wednesday", "opens": "10:00", "closes": "19:00"}
{"dayOfWeek": "Thursday", "opens": "10:00", "closes": "20:00"}
{"dayOfWeek": "Friday", "opens": "10:00", "closes": "20:00"}
{"dayOfWeek": "Saturday", "opens": "10:00", "closes": "20:00"}
{"dayOfWeek": "Sunday", "opens": "14:00", "closes": "18:00"}
```

## How to Get Coordinates

### Method 1: Google Maps
1. Go to https://maps.google.com
2. Search for the address
3. Right-click on the location marker
4. Select "What's here?"
5. Click on the coordinates at the bottom to copy them

### Method 2: OpenStreetMap
1. Go to https://www.openstreetmap.org
2. Search for the address
3. Click on "Share" button
4. Copy the coordinates from the URL or info box

### Method 3: LatLong.net
1. Go to https://www.latlong.net
2. Enter the address
3. Get the latitude and longitude

## Price Range Guidelines

- `$` - Budget-friendly (Under €20)
- `$$` - Moderate (€20-€50)
- `$$$` - Upscale (€50-€100)
- `$$$$` - Luxury (Over €100)

## Common Amenities

Suggested amenity values:
- Parking
- Wheelchair Accessible
- WiFi
- Restrooms
- ATM
- Coffee Shop
- Personal Shopper
- Fitting Rooms
- Gift Wrapping
- Delivery Service
- Online Ordering
- Curbside Pickup
- Extended Returns
- Tax-Free Shopping
- Multilingual Staff

## Creating a Store Locator App

### Step 1: Create the App Container
```
Node Type: jsstorelocnt:storeLocatorApp
Name: store-locator
Path: /sites/[your-site]/contents/store-locator

Properties:
- jcr:title: Find Our Stores
- welcomeTitle: Welcome to Our Store Locator
- welcomeMessage: Find the nearest store using the search or by browsing the map
```

### Step 2: Add Store Nodes as Children
Create multiple `jsstorelocnt:store` nodes under the store locator app:
```
/sites/[your-site]/contents/store-locator/
  ├── downtown-store (jsstorelocnt:store)
  ├── westside-branch (jsstorelocnt:store)
  ├── southside-outlet (jsstorelocnt:store)
  ├── eastside-express (jsstorelocnt:store)
  └── northside-market (jsstorelocnt:store)
```

### Step 3: Add to a Page
Add the store locator app to a page using jContent page composer.

## Validation Checklist

When creating a store, ensure:
- ✅ Store name is set
- ✅ Complete address is provided (all fields)
- ✅ Latitude and longitude are valid decimal numbers
- ✅ Telephone number includes country code
- ✅ Opening hours are valid JSON strings
- ✅ All days have valid time format (HH:MM)
- ✅ Image is uploaded and referenced (optional but recommended)
- ✅ Amenities are relevant to the store
- ✅ Price range matches store type

## Troubleshooting

### Store Not Appearing on Map
- Check that latitude/longitude are set correctly
- Verify coordinates are decimal numbers (not DMS format)
- Ensure coordinates are within valid ranges:
  - Latitude: -90 to 90
  - Longitude: -180 to 180

### Opening Hours Not Displaying
- Verify JSON format is correct (use a JSON validator)
- Check that dayOfWeek values match exactly: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
- Ensure time format is HH:MM (24-hour format)
- Make sure opening time is before closing time

### Store Shows as Closed When It Should Be Open
- Check that the opening hours for today's day of week are set
- Verify the current time is between opens and closes
- Ensure time zone is correct

## Import Example (GraphQL or API)

If importing stores programmatically, use this format:

```json
{
  "nodeType": "jsstorelocnt:store",
  "name": "store-name",
  "properties": {
    "jcr:title": "Store Name",
    "name": "Store Name",
    "description": "Store description",
    "telephone": "+1-234-567-8900",
    "url": "https://example.com",
    "priceRange": "$$",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "12345",
    "addressCountry": "US",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "amenityFeature": ["Parking", "WiFi"],
    "openingHours": [
      "{\"dayOfWeek\": \"Monday\", \"opens\": \"09:00\", \"closes\": \"17:00\"}",
      "{\"dayOfWeek\": \"Tuesday\", \"opens\": \"09:00\", \"closes\": \"17:00\"}"
    ]
  }
}
```

## Best Practices

1. **Consistent Naming**: Use lowercase-with-hyphens for node names
2. **Complete Data**: Fill in all fields for best user experience
3. **Accurate Coordinates**: Double-check location pins on the map
4. **Current Hours**: Keep opening hours up to date
5. **Quality Images**: Use high-resolution store photos
6. **Descriptive Text**: Write clear, helpful descriptions
7. **Contact Info**: Always include working phone numbers
8. **Regular Updates**: Review and update store information quarterly
