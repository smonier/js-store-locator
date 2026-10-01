import { AddResources, buildModuleFileUrl, server } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { RenderContext } from "org.jahia.services.render";
import { Heading, StoreInfo, storeLocation } from "../StoreLocatorApp/StoreInfo.js";
import { headingLevelFor } from "../StoreLocatorApp/headingLevel.js";
import { createTranslator } from "../StoreLocatorApp/translation.js";
import { readStore, storeImageNode } from "./storeData.js";
import classes from "../StoreLocatorApp/StoreLocatorApp.module.css";

/**
 * Level of a store's name: the page's h1 when the store is the main resource (its own page),
 * otherwise one level below the container it is placed in.
 */
export const storeHeadingLevel = (currentNode: JCRNodeWrapper, mainNode: JCRNodeWrapper) =>
  mainNode.getIdentifier() === currentNode.getIdentifier() ? 1 : headingLevelFor(currentNode);

/**
 * A store rendered on the server: its name as a heading of `level`, then its details. At level 1
 * the name is the page's h1; at any other level it links to the store's own page.
 */
export function StoreView({
  node,
  renderContext,
  level,
}: {
  node: JCRNodeWrapper;
  renderContext: RenderContext;
  level: number;
}) {
  const store = readStore(node);
  const image = storeImageNode(node);
  if (image) server.render.addCacheDependency({ node: image }, renderContext);
  const translation = createTranslator(renderContext.getMainResourceLocale().toString());
  const location = storeLocation(store);
  // Unique per rendering, so a store shown twice on a page keeps distinct ids.
  const idPrefix = `jsstoreloc-${store.id}-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <article className={`${classes.app} ${classes.storeView}`} aria-labelledby={`${idPrefix}-name`}>
      <AddResources type="css" resources={buildModuleFileUrl("dist/assets/style.css")} />
      {level === 1 ? (
        <h1 className={classes.storeViewTitle} id={`${idPrefix}-name`}>
          {store.name}
        </h1>
      ) : (
        <Heading level={level} className={classes.storeViewTitle} id={`${idPrefix}-name`}>
          {store.pageUrl ? (
            <a href={store.pageUrl} className={classes.storeViewLink}>
              {store.name}
            </a>
          ) : (
            store.name
          )}
        </Heading>
      )}
      {location && <p className={classes.storeLocation}>{location}</p>}
      <div className={classes.detailsBody}>
        {store.image && <img src={store.image} alt="" className={classes.image} />}
        <StoreInfo
          store={store}
          level={level + 1}
          translation={translation}
          openNow={null}
          idPrefix={idPrefix}
        />
      </div>
    </article>
  );
}
