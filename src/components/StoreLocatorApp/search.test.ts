import { describe, expect, it } from "vitest";
import { foldText, matchesQuery } from "./search.js";
import type { Store } from "./types.js";

const store: Store = {
  id: "1",
  name: "Agence Orléans Centre",
  description: "",
  telephone: "",
  telephoneHref: "",
  url: "",
  pageUrl: "",
  image: "",
  address: {
    streetAddress: "1 rue Jeanne d'Arc",
    addressLocality: "Orléans",
    addressRegion: "Centre-Val de Loire",
    postalCode: "45000",
    addressCountry: "FR",
  },
  geo: null,
  openingHoursSpecification: [],
  priceRange: "",
  amenityFeature: [],
};

describe("foldText", () => {
  it.each([
    ["Orléans", "orleans"],
    ["ÎLE-DE-FRANCE", "ile-de-france"],
    ["Zürich", "zurich"],
    ["Genève", "geneve"],
    ["plain", "plain"],
  ])("%j gives %j", (input, expected) => {
    expect(foldText(input)).toBe(expected);
  });
});

describe("matchesQuery", () => {
  it.each([
    ["", true],
    ["   ", true],
    ["orleans", true],
    ["ORLÉANS", true],
    ["orléans", true],
    ["centre", true],
    ["val de loire", true],
    ["450", true],
    ["  45000 ", true],
    ["jeanne", false],
    ["lyon", false],
  ])("%j matches: %s", (query, expected) => {
    expect(matchesQuery(store, query)).toBe(expected);
  });
});
