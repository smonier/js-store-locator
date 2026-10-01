import {
  jahiaComponent,
  AddResources,
  buildModuleFileUrl,
  Island,
  getChildNodes,
} from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { StoreLocatorAppProps } from "./types.js";
import { readStore } from "../Store/storeData.js";
import StoreLocatorClient from "./interactive.island.client.js";

/**
 * Level of the app's heading. Under a titled container (a section that renders its title as a
 * heading, such as a free zone), the app starts one level below it; elsewhere it starts at h2.
 */
const headingLevelFor = (node: JCRNodeWrapper): number => {
  try {
    const parent = node.getParent() as JCRNodeWrapper;
    const titledContainer =
      !parent.isNodeType("jnt:page") &&
      !parent.isNodeType("jnt:area") &&
      parent.hasProperty("jcr:title") &&
      parent.getProperty("jcr:title").getString().trim() !== "";
    return titledContainer ? 3 : 2;
  } catch {
    return 2;
  }
};

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

    // The rendering reads the folder and every store: flush it when one of them changes.
    const dependencies = currentResource.getDependencies();
    dependencies.add(storeParent.getPath());
    storeNodes.forEach((node) => dependencies.add(node.getPath()));

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
