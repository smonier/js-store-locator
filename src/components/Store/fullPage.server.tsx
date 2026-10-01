import { jahiaComponent } from "@jahia/javascript-modules-library";
import { StoreView, storeHeadingLevel } from "./StoreView.js";

/**
 * The store's own page, for template sets that render a main resource with a "fullPage" view: the
 * store name is the page's h1. The view is not offered in the editors' view picker.
 */
export default jahiaComponent(
  {
    componentType: "view",
    nodeType: "jsstorelocnt:store",
    name: "fullPage",
    displayName: "Full page",
    properties: { visible: "false" },
  },
  (_props: Record<string, never>, { currentNode, mainNode, renderContext }) => (
    <StoreView
      node={currentNode}
      renderContext={renderContext}
      level={storeHeadingLevel(currentNode, mainNode)}
    />
  ),
);
