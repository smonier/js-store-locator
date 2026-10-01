import { jahiaComponent, getChildNodes, AddResources, buildModuleFileUrl } from "@jahia/javascript-modules-library";
import type { StoreLocatorAppProps } from "./types.js";
import { createTranslator, fill } from "./translation.js";
import styles from "../Store/Store.module.css";

const PREVIEW_COUNT = 5;

/** Content-manager preview of the app: its texts and the first stores it lists. */
export default jahiaComponent(
  {
    componentType: "view",
    nodeType: "jsstorelocnt:storeLocatorApp",
    name: "cm",
    displayName: "Content Manager View",
  },
  (props: StoreLocatorAppProps, { currentNode, renderContext }) => {
    const { "jcr:title": title, welcomeTitle, welcomeMessage, storesFolder } = props;
    const { t } = createTranslator(renderContext.getMainResourceLocale().toString());

    const storeParent =
      storesFolder && typeof storesFolder.getNodes === "function" ? storesFolder : currentNode;
    const storeNodes = getChildNodes(storeParent, -1, 0, (node) =>
      node.isNodeType("jsstorelocnt:store"),
    );
    const storeCount = storeNodes.length;

    return (
      <div className={`${styles.card} ${styles.cardBorderPrimary}`}>
        <AddResources type="css" resources={buildModuleFileUrl("dist/assets/style.css")} />
        <div className={`${styles.cardHeader} ${styles.cardHeaderPrimary}`}>
          <h2 className={`${styles.cardTitle} ${styles.mb0}`}>{title || t("title")}</h2>
        </div>
        <div className={styles.cardBody}>
          {welcomeTitle && <p className={`${styles.cardSubtitle} ${styles.mb2}`}>{welcomeTitle}</p>}
          {welcomeMessage && <p className={styles.cardText}>{welcomeMessage}</p>}

          <p className={`${styles.badge} ${styles.badgePrimary} ${styles.badgePill}`}>
            {fill(t(storeCount === 1 ? "storelist.count_one" : "storelist.count_other"), {
              count: String(storeCount),
            })}
          </p>

          {storeCount === 0 && (
            <p className={`${styles.alert} ${styles.alertInfo} ${styles.mt3} ${styles.mb0}`}>
              {t("cm.empty")}
            </p>
          )}

          {storeCount > 0 && (
            <ul className={`${styles.listGroup} ${styles.listGroupFlush}`}>
              {storeNodes.slice(0, PREVIEW_COUNT).map((storeNode) => {
                const storeName =
                  storeNode.getPropertyAsString("name") || storeNode.getDisplayableName();
                const city = storeNode.getPropertyAsString("addressLocality");
                return (
                  <li key={storeNode.getIdentifier()} className={`${styles.listGroupItem} ${styles.px0}`}>
                    <strong>{storeName}</strong>
                    {city && <span className={styles.textMuted}> - {city}</span>}
                  </li>
                );
              })}
              {storeCount > PREVIEW_COUNT && (
                <li className={`${styles.listGroupItem} ${styles.px0} ${styles.textMuted}`}>
                  {fill(t("cm.more"), { count: String(storeCount - PREVIEW_COUNT) })}
                </li>
              )}
            </ul>
          )}
        </div>
        <div className={`${styles.cardFooter} ${styles.textMuted}`}>
          <span className={styles.small}>{t("cm.footer")}</span>
        </div>
      </div>
    );
  },
);
