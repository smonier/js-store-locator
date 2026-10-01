import { AddResources, buildModuleFileUrl } from "@jahia/javascript-modules-library";
import type { JCRNodeWrapper } from "org.jahia.services.content";
import type { RenderContext } from "org.jahia.services.render";
import { Heading, StoreInfo, storeLocation } from "../StoreLocatorApp/StoreInfo.js";
import { createTranslator } from "../StoreLocatorApp/translation.js";
import { readStore } from "./storeData.js";
import classes from "../StoreLocatorApp/StoreLocatorApp.module.css";

/**
 * A store rendered on the server: its name as a heading of `level`, then its details. On the
 * store's own page the name is the page's h1 (`level` 1); elsewhere it links to that page.
 */
export function StoreView({
  node,
  renderContext,
  level,
}: {
  node: JCRNodeWrapper;
  renderContext: RenderContext;
  level: 1 | 2;
}) {
  const store = readStore(node);
  const translation = createTranslator(renderContext.getMainResourceLocale().toString());
  const location = storeLocation(store);
  const idPrefix = `jsstoreloc-${store.id}`;
  return (
    <article className={`${classes.app} ${classes.storeView}`} aria-labelledby={`${idPrefix}-name`}>
      <AddResources type="css" resources={buildModuleFileUrl("dist/assets/style.css")} />
      {level === 1 ? (
        <h1 className={classes.storeViewTitle} id={`${idPrefix}-name`}>
          {store.name}
        </h1>
      ) : (
        <Heading level={2} className={classes.storeViewTitle} id={`${idPrefix}-name`}>
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
