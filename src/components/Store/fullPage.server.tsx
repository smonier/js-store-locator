import { jahiaComponent } from "@jahia/javascript-modules-library";
import { StoreView } from "./StoreView.js";

/** The store's own page (main resource): the store name is the page's h1. */
export default jahiaComponent(
  {
    componentType: "view",
    nodeType: "jsstorelocnt:store",
    name: "fullPage",
    displayName: "Full page",
  },
  (_props: Record<string, never>, { currentNode, renderContext }) => (
    <StoreView node={currentNode} renderContext={renderContext} level={1} />
  ),
);
