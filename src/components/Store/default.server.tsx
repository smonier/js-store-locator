import { jahiaComponent } from "@jahia/javascript-modules-library";
import { StoreView } from "./StoreView.js";

/**
 * A store placed on a page, or opened at its own URL by a template set that renders the main
 * resource with its default view.
 */
export default jahiaComponent(
  {
    componentType: "view",
    nodeType: "jsstorelocnt:store",
    name: "default",
    displayName: "Default View",
  },
  (_props: Record<string, never>, { currentNode, mainNode, renderContext }) => (
    <StoreView
      node={currentNode}
      renderContext={renderContext}
      level={mainNode.getIdentifier() === currentNode.getIdentifier() ? 1 : 2}
    />
  ),
);
