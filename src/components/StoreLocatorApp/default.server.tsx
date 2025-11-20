import {
  jahiaComponent,
  AddResources,
  buildModuleFileUrl,
  Island,
  getChildNodes,
} from "@jahia/javascript-modules-library";
import type { StoreLocatorAppProps } from "./types";
import StoreLocatorClient from "./interactive.island.client";

export default jahiaComponent(
  {
    componentType: "view",
    nodeType: "jsstorelocnt:storeLocatorApp",
    name: "default",
    displayName: "Default View",
  },
  (props: StoreLocatorAppProps, { renderContext, currentNode }) => {
    const { "jcr:title": title, welcomeTitle, welcomeMessage, storesFolder } = props;

    // If storesFolder is set and is a node, use it as the parent for stores
    let storeParent = currentNode;
    if (storesFolder && typeof storesFolder.getNodes === "function") {
      storeParent = storesFolder;
    }

    // Get all store nodes that are children or descendants of the selected folder (or self)
    const storeNodes = getChildNodes(storeParent, -1, 0, (node) =>
      node.isNodeType("jsstorelocnt:store"),
    );

    // Build store data array from child nodes
    const stores = storeNodes.map((storeNode) => {
      const getProperty = (name: string) => {
        try {
          const prop = storeNode.getProperty(name);
          return prop ? prop.getString() : null;
        } catch (e) {
          return null;
        }
      };

      const getMultiProperty = (name: string) => {
        try {
          const prop = storeNode.getProperty(name);
          if (!prop) return [];
          const values = prop.getValues();
          const result: string[] = [];
          for (let i = 0; i < values.length; i++) {
            result.push(values[i].getString());
          }
          return result;
        } catch (e) {
          return [];
        }
      };

      const getImageUrl = () => {
        try {
          const imageProp = storeNode.getProperty("image");
          if (!imageProp) return null;
          const imageNode = imageProp.getNode();
          if (imageNode) {
            return `/files/${renderContext.getWorkspace()}${imageNode.getPath()}`;
          }
        } catch (e) {
          return null;
        }
        return null;
      };

      // Parse opening hours JSON strings
      const openingHoursRaw = getMultiProperty("openingHours");
      const openingHours = openingHoursRaw
        .map((hourStr) => {
          try {
            return JSON.parse(hourStr);
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean);

      return {
        id: storeNode.getIdentifier(),
        name: getProperty("name") || storeNode.getDisplayableName(),
        description: getProperty("description") || "",
        telephone: getProperty("telephone") || "",
        url: getProperty("url") || "",
        image: getImageUrl() || "",
        priceRange: getProperty("priceRange") || "",
        amenityFeature: getMultiProperty("amenityFeature"),
        geo: {
          latitude: parseFloat(getProperty("latitude") || "0"),
          longitude: parseFloat(getProperty("longitude") || "0"),
        },
        address: {
          streetAddress: getProperty("streetAddress") || "",
          addressLocality: getProperty("addressLocality") || "",
          addressRegion: getProperty("addressRegion") || "",
          postalCode: getProperty("postalCode") || "",
          addressCountry: getProperty("addressCountry") || "",
        },
        openingHoursSpecification: openingHours,
      };
    });

    return (
      <>
        <AddResources type="css" resources="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <AddResources type="css" resources={buildModuleFileUrl("dist/assets/style.css")} />
        <Island
          clientOnly={true}
          component={StoreLocatorClient}
          props={{
            title: title || "Store Locator",
            welcomeTitle,
            welcomeMessage,
            stores,
            locale: renderContext.getMainResourceLocale().toString(),
          }}
        >
          <div>Loading Store Locator...</div>
        </Island>
      </>
    );
  },
);
