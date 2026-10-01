# Store content examples

Sample stores and opening-hours patterns for the `jsstorelocnt:store` content type. The properties are described in the [Content model](README.md#content-model) section of the README.

## Example store

| Field                    | Value                                                 |
| ------------------------ | ----------------------------------------------------- |
| Node name                | `paris-rivoli`                                        |
| Title (`jcr:title`)      | Paris Rivoli                                          |
| Name (`name`)            | Paris Rivoli                                          |
| Description              | Our flagship store in the centre of Paris.            |
| Street (`streetAddress`) | 101 Rue de Rivoli                                     |
| City (`addressLocality`) | Paris                                                 |
| Region (`addressRegion`) | Île-de-France                                         |
| Postal code              | 75001                                                 |
| Country                  | `FR` (two-letter code, shown as the country name)     |
| Latitude                 | 48.8606                                               |
| Longitude                | 2.3376                                                |
| Telephone                | +33 1 23 45 67 89                                     |
| Website (`url`)          | https://www.example.com/stores/paris-rivoli           |
| Price range              | `$$`                                                  |
| Amenities                | Parking, Wheelchair access, Wi-Fi (one value each)    |
| Image                    | An image picked from the site's files, then published |

`name`, `description` and `amenityFeature` are internationalized: enter them in each language of the site.

## Opening hours

The Opening hours field takes one value per time slot. In Content Editor each value has three lists: day of the week, opening time and closing time, in 30-minute steps from 00:00 to 23:30. Each value is stored as one JSON object:

```json
{ "dayOfWeek": "Monday", "opens": "09:00", "closes": "18:00" }
```

### Same hours on weekdays, shorter on Saturday, closed on Sunday

| Day       | Opens | Closes |
| --------- | ----- | ------ |
| Monday    | 09:00 | 19:00  |
| Tuesday   | 09:00 | 19:00  |
| Wednesday | 09:00 | 19:00  |
| Thursday  | 09:00 | 19:00  |
| Friday    | 09:00 | 19:00  |
| Saturday  | 10:00 | 17:00  |

Sunday has no value, so it is shown as closed. The table groups the weekdays into one row ("Monday to Friday").

### Lunch break

Two values for the same day give two slots:

| Day    | Opens | Closes |
| ------ | ----- | ------ |
| Monday | 09:00 | 12:30  |
| Monday | 14:00 | 19:00  |

Repeat the pair for each day that has a break.

### Open 24 hours

Choose the same opening and closing time, for example 00:00 to 00:00. The day is shown as open 24 hours:

| Day    | Opens | Closes |
| ------ | ----- | ------ |
| Monday | 00:00 | 00:00  |

Values imported from another system may also use `00:00` to `23:59`; the module reads that as all day too.

### Open past midnight

A closing time earlier than the opening time ends the next day. This slot is open from Friday 18:00 to Saturday 02:00:

| Day    | Opens | Closes |
| ------ | ----- | ------ |
| Friday | 18:00 | 02:00  |

## Creating stores with GraphQL

To load stores in bulk, create them under the stores folder with the GraphQL API, then publish the folder. Internationalized properties need a `language`; multiple properties take `values`.

```graphql
mutation {
  jcr {
    mutateNode(pathOrId: "/sites/mySite/contents/stores") {
      addChild(
        name: "paris-rivoli"
        primaryNodeType: "jsstorelocnt:store"
        properties: [
          { name: "jcr:title", value: "Paris Rivoli", language: "en" }
          { name: "name", value: "Paris Rivoli", language: "en" }
          { name: "streetAddress", value: "101 Rue de Rivoli" }
          { name: "addressLocality", value: "Paris" }
          { name: "postalCode", value: "75001" }
          { name: "addressCountry", value: "FR" }
          { name: "latitude", value: "48.8606" }
          { name: "longitude", value: "2.3376" }
          { name: "telephone", value: "+33 1 23 45 67 89" }
          { name: "amenityFeature", values: ["Parking", "Wi-Fi"], language: "en" }
          {
            name: "openingHours"
            values: [
              "{\"dayOfWeek\":\"Monday\",\"opens\":\"09:00\",\"closes\":\"19:00\"}"
              "{\"dayOfWeek\":\"Tuesday\",\"opens\":\"09:00\",\"closes\":\"19:00\"}"
            ]
          }
        ]
      ) {
        uuid
      }
    }
  }
}
```

Use the times the editor offers (half-hour steps), so that editors can open and save the store without changing its hours.

## Checking a store

- **Not on the map**: latitude and longitude must both be set, as decimal numbers, between -90 and 90 and between -180 and 180. Stores without them are still listed.
- **Not listed**: the store must be a direct child of the folder selected in the locator's Stores Folder field, and published.
- **Hours missing**: each value must name a day in English (`Monday` to `Sunday`) and use `HH:MM` times; other values are ignored.
- **Open or closed looks wrong**: the status uses the visitor's clock and time zone, not the store's.

## Getting coordinates

On [OpenStreetMap](https://www.openstreetmap.org), search for the address, right-click the location and choose "Show address": the latitude and longitude are shown in the side panel.
