import type { Store } from "./types.js";

/** Lower case, without accents: "Orléans" and "orleans" read the same. */
export const foldText = (value: string): string =>
  value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

/** True when the store's name, city, region or postal code contains the query. */
export function matchesQuery(store: Store, query: string): boolean {
  const folded = foldText(query.trim());
  if (!folded) return true;
  const { addressLocality, addressRegion, postalCode } = store.address;
  return [store.name, addressLocality, addressRegion, postalCode].some((value) =>
    foldText(value).includes(folded),
  );
}
