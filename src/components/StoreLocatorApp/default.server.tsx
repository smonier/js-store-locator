import {
  jahiaComponent,
  AddResources,
  buildModuleFileUrl,
  Island,
  getChildNodes,
  server,
} from "@jahia/javascript-modules-library";
import type { StoreLocatorAppProps } from "./types.js";
import { readStore, storeImageNode } from "../Store/storeData.js";
import { headingLevelFor } from "./headingLevel.js";
import StoreLocatorClient from "./interactive.island.client.js";

export default jahiaComponent(
  {
    componentType: "view",
    nodeType: "jsstorelocnt:storeLocatorApp",
    name: "default",
    displayName: "Default View",
  },
  (props: StoreLocatorAppProps, { renderContext, currentNode, currentResource }) => {
    const { "jcr:title": title, welcomeTitle, welcomeMessage, storesFolder } = props;

    // Stores come from the picked folder, or from the app's own children.
    const storeParent =
      storesFolder && typeof storesFolder.getNodes === "function" ? storesFolder : currentNode;
    const storeNodes = getChildNodes(storeParent, -1, 0, (node) =>
      node.isNodeType("jsstorelocnt:store"),
    );

    // The rendering reads the folder, every store and every store image: flush it when one of
    // them changes.
    const dependencies = currentResource.getDependencies();
    dependencies.add(storeParent.getPath());
    storeNodes.forEach((node) => {
      dependencies.add(node.getPath());
      const image = storeImageNode(node);
      if (image) server.render.addCacheDependency({ node: image }, renderContext);
    });

    return (
      <>
        <AddResources type="css" resources={buildModuleFileUrl("dist/assets/style.css")} />
        <Island
          component={StoreLocatorClient}
          props={{
            title: title || "",
            welcomeTitle,
            welcomeMessage,
            stores: storeNodes.map((node) => readStore(node)),
            locale: renderContext.getMainResourceLocale().toString(),
            headingLevel: headingLevelFor(currentNode),
            appId: currentNode.getIdentifier(),
          }}
        />
      </>
    );
  },
);
