import { jahiaComponent, getChildNodes, AddResources } from "@jahia/javascript-modules-library";
import type { StoreLocatorAppProps } from "./types";
import styles from "./StoreLocatorApp.module.css";

export default jahiaComponent(
  {
    componentType: "view",
    nodeType: "jsstorelocnt:storeLocatorApp",
    name: "cm",
    displayName: "Content Manager View",
  },
  (props: StoreLocatorAppProps, { currentNode }) => {
    const { "jcr:title": title, welcomeTitle, welcomeMessage } = props;

    // Get all store nodes that are children
    const storeNodes = getChildNodes(currentNode, -1, 0, (node) =>
      node.isNodeType("jsstorelocnt:store"),
    );

    const storeCount = storeNodes.length;

    return (
      <div className={`${styles.card} ${styles.cardBorderPrimary}`}>
        <AddResources type="css" resources="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <div className={`${styles.cardHeader} ${styles.cardHeaderPrimary}`}>
          <h5 className={`${styles.cardTitle} ${styles.mb0}`}>
            <svg
              className={`${styles.icon} ${styles.me2}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
            </svg>
            {title || "Store Locator App"}
          </h5>
        </div>
        <div className={styles.cardBody}>
          {welcomeTitle && (
            <h6 className={`${styles.cardSubtitle} ${styles.mb2}`}>{welcomeTitle}</h6>
          )}
          {welcomeMessage && <p className={styles.cardText}>{welcomeMessage}</p>}

          <div className={styles.mt3}>
            <div className={`${styles.dFlex} ${styles.alignItemsCenter}`}>
              <svg
                className={`${styles.icon} ${styles.me2}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                style={{ color: "#0d6efd" }}
              >
                <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z" />
              </svg>
              <span className={`${styles.badge} ${styles.badgePrimary} ${styles.badgePill}`}>
                {storeCount} {storeCount === 1 ? "Store" : "Stores"}
              </span>
            </div>
          </div>

          {storeCount === 0 && (
            <div
              className={`${styles.alert} ${styles.alertInfo} ${styles.mt3} ${styles.mb0}`}
              role="alert"
            >
              <svg
                className={`${styles.icon} ${styles.me2}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              No stores have been added yet. Add store content items as children to populate the
              store locator.
            </div>
          )}

          {storeCount > 0 && (
            <div className={styles.mt3}>
              <h6 className={`${styles.textMuted} ${styles.mb2}`}>Stores:</h6>
              <ul className={`${styles.listGroup} ${styles.listGroupFlush}`}>
                {storeNodes.slice(0, 5).map((storeNode) => {
                  const storeName =
                    storeNode.getProperty("name")?.getString() ||
                    storeNode.getProperty("jcr:title")?.getString() ||
                    storeNode.getName();
                  const city = storeNode.getProperty("addressLocality")?.getString();

                  return (
                    <li
                      key={storeNode.getIdentifier()}
                      className={`${styles.listGroupItem} ${styles.px0}`}
                    >
                      <svg
                        className={`${styles.icon} ${styles.me2}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        style={{ color: "#6c757d" }}
                      >
                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                      </svg>
                      <strong>{storeName}</strong>
                      {city && <span className={styles.textMuted}> - {city}</span>}
                    </li>
                  );
                })}
                {storeCount > 5 && (
                  <li className={`${styles.listGroupItem} ${styles.px0} ${styles.textMuted}`}>
                    <svg
                      className={`${styles.icon} ${styles.me2}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                    </svg>
                    and {storeCount - 5} more...
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        <div className={`${styles.cardFooter} ${styles.textMuted}`}>
          <span className={styles.small}>
            <svg
              className={`${styles.icon} ${styles.me1}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            This component displays an interactive store locator on the page
          </span>
        </div>
      </div>
    );
  },
);
