import { describe, expect, it } from "vitest";
import { safeWebUrl, telephoneHref, uniqueValues } from "./storeValues.js";

describe("telephoneHref", () => {
  it.each([
    ["01 23 45 67 89", "tel:0123456789"],
    ["+33 1 23 45 67 89", "tel:+33123456789"],
    ["+33 (0)1 23 45 67 89", "tel:+33123456789"],
    ["+33(0)1.23.45.67.89", "tel:+33123456789"],
    ["+44 (0) 20 7946 0958", "tel:+442079460958"],
    ["+1 (555) 010-0100", "tel:+15550100100"],
    ["(555) 010-0100", "tel:5550100100"],
    ["01 23 45 67 89 ext. 12", "tel:0123456789"],
    ["01 23 45 67 89 extension 12", "tel:0123456789"],
    ["01 23 45 67 89 poste 12", "tel:0123456789"],
    ["+1 555-0100 x204", "tel:+15550100"],
    ["+1 555-0100x204", "tel:+15550100"],
    ["+1-555-0100;ext=204", "tel:+15550100"],
    ["+1 555 0100 #204", "tel:+15550100"],
    ["  +41 22 123 45 67  ", "tel:+41221234567"],
    ["", ""],
    ["   ", ""],
    ["call us", ""],
    [null, ""],
    [undefined, ""],
  ])("%j gives %j", (input, expected) => {
    expect(telephoneHref(input)).toBe(expected);
  });
});

describe("safeWebUrl", () => {
  it.each([
    ["https://example.fr", "https://example.fr"],
    ["http://example.fr/stores?id=1#map", "http://example.fr/stores?id=1#map"],
    ["HTTPS://EXAMPLE.FR/", "HTTPS://EXAMPLE.FR/"],
    ["  https://example.fr/paris  ", "https://example.fr/paris"],
    ["https://example.fr/l'atelier", "https://example.fr/l'atelier"],
    ["https://example.fr/caf%C3%A9", "https://example.fr/caf%C3%A9"],
    ["www.example.fr", "https://www.example.fr"],
    ["WWW.example.fr/paris", "https://WWW.example.fr/paris"],
    ["example.fr", ""],
    ["ftp://example.fr", ""],
    ["mailto:shop@example.fr", ""],
    ["javascript:alert(1)", ""],
    ["//example.fr", ""],
    ["https://", ""],
    ["https:///path", ""],
    ["https://example.fr/a b", ""],
    ['https://example.fr/"x"', ""],
    ["https://example.fr/<x>", ""],
    ["", ""],
    [null, ""],
    [undefined, ""],
  ])("%j gives %j", (input, expected) => {
    expect(safeWebUrl(input)).toBe(expected);
  });
});

describe("uniqueValues", () => {
  it.each([
    [
      ["Wi-Fi", "Parking", "Wi-Fi"],
      ["Wi-Fi", "Parking"],
    ],
    [[" Wi-Fi", "Wi-Fi "], ["Wi-Fi"]],
    [["", "  ", "Parking"], ["Parking"]],
    [[], []],
  ])("%j gives %j", (input, expected) => {
    expect(uniqueValues(input)).toEqual(expected);
  });
});
