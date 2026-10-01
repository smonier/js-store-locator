import { describe, expect, it } from "vitest";
import { groupOpeningHours, isAllDay, isOpenAt, parseOpeningHours } from "./hours.js";
import { createTranslator } from "./translation.js";
import type { OpeningHoursSpecification } from "./types.js";

const slot = (dayOfWeek: string, opens: string, closes: string): OpeningHoursSpecification => ({
  dayOfWeek,
  opens,
  closes,
});

const json = (value: unknown) => JSON.stringify(value);

// 5 October 2026 is a Monday. Dates are built on the local clock, as the visitor's browser does.
const at = (day: number, hours: number, minutes = 0) => new Date(2026, 9, 5 + day, hours, minutes);
const MONDAY = 0;
const TUESDAY = 1;
const SUNDAY = 6;

describe("parseOpeningHours", () => {
  it.each<[string, string[], OpeningHoursSpecification[]]>([
    [
      "well-formed entries",
      [json(slot("Monday", "09:00", "18:00")), json(slot("Saturday", "10:00", "13:00"))],
      [slot("Monday", "09:00", "18:00"), slot("Saturday", "10:00", "13:00")],
    ],
    ["not JSON", ["Monday 9-18", "{"], []],
    ["JSON that is not an object", ["null", "42", '"Monday"', "[]"], []],
    [
      "unknown day",
      [json(slot("Mon", "09:00", "18:00")), json(slot("monday", "09:00", "18:00"))],
      [],
    ],
    [
      "malformed times",
      [
        json(slot("Monday", "9:00", "18:00")),
        json(slot("Monday", "09:00", "24:00")),
        json(slot("Monday", "09:60", "18:00")),
        json({ dayOfWeek: "Monday", opens: 900, closes: "18:00" }),
        json({ dayOfWeek: "Monday", opens: "09:00" }),
      ],
      [],
    ],
    [
      "extra properties dropped",
      [json({ ...slot("Friday", "08:30", "12:00"), note: "x" })],
      [slot("Friday", "08:30", "12:00")],
    ],
    ["no values", [], []],
  ])("%s", (_label, values, expected) => {
    expect(parseOpeningHours(values)).toEqual(expected);
  });
});

describe("isAllDay", () => {
  it.each([
    [slot("Monday", "00:00", "23:59"), true],
    [slot("Monday", "00:00", "00:00"), true],
    [slot("Monday", "09:00", "09:00"), true],
    [slot("Monday", "00:00", "18:00"), false],
    [slot("Monday", "09:00", "23:59"), false],
  ])("%j: %s", (input, expected) => {
    expect(isAllDay(input)).toBe(expected);
  });
});

describe("isOpenAt", () => {
  const weekday = [slot("Monday", "09:00", "18:00")];
  const overnight = [slot("Monday", "22:00", "02:00")];
  const untilMidnight = [slot("Monday", "18:00", "00:00")];
  const untilEndOfDay = [slot("Monday", "09:00", "23:59")];
  const allDay = [slot("Monday", "00:00", "23:59")];
  const allDayZero = [slot("Monday", "00:00", "00:00")];
  const sameTime = [slot("Monday", "09:00", "09:00")];
  const split = [slot("Monday", "09:00", "12:00"), slot("Monday", "14:00", "18:00")];
  const sundayNight = [slot("Sunday", "20:00", "01:00")];

  it.each<[string, OpeningHoursSpecification[], Date, boolean]>([
    ["before opening", weekday, at(MONDAY, 8, 59), false],
    ["at opening", weekday, at(MONDAY, 9, 0), true],
    ["during the day", weekday, at(MONDAY, 12, 30), true],
    ["at closing", weekday, at(MONDAY, 18, 0), false],
    ["another day", weekday, at(TUESDAY, 12, 0), false],
    ["overnight, evening", overnight, at(MONDAY, 23, 0), true],
    ["overnight, before it opens", overnight, at(MONDAY, 21, 59), false],
    ["overnight, next morning", overnight, at(TUESDAY, 1, 59), true],
    ["overnight, next morning at closing", overnight, at(TUESDAY, 2, 0), false],
    ["overnight, early the same morning", overnight, at(MONDAY, 1, 0), false],
    ["closing at 00:00, late evening", untilMidnight, at(MONDAY, 23, 59), true],
    ["closing at 00:00, next day", untilMidnight, at(TUESDAY, 0, 0), false],
    ["closing at 23:59, last minute", untilEndOfDay, at(MONDAY, 23, 59), true],
    ["closing at 23:59, next day", untilEndOfDay, at(TUESDAY, 0, 0), false],
    ["00:00 to 23:59, midnight", allDay, at(MONDAY, 0, 0), true],
    ["00:00 to 23:59, last minute", allDay, at(MONDAY, 23, 59), true],
    ["00:00 to 23:59, next day", allDay, at(TUESDAY, 0, 0), false],
    ["00:00 to 00:00, during the day", allDayZero, at(MONDAY, 15, 0), true],
    ["00:00 to 00:00, next day", allDayZero, at(TUESDAY, 0, 30), false],
    ["same opening and closing, before that time", sameTime, at(MONDAY, 8, 0), true],
    ["same opening and closing, next morning", sameTime, at(TUESDAY, 8, 0), false],
    ["split day, lunch break", split, at(MONDAY, 13, 0), false],
    ["split day, afternoon", split, at(MONDAY, 15, 0), true],
    ["Sunday night into Monday", sundayNight, at(MONDAY, 0, 30), true],
    ["Sunday night, Sunday evening", sundayNight, at(SUNDAY, 21, 0), true],
    ["no hours", [], at(MONDAY, 12, 0), false],
  ])("%s", (_label, hours, now, expected) => {
    expect(isOpenAt(hours, now)).toBe(expected);
  });
});

describe("groupOpeningHours", () => {
  const fr = createTranslator("fr");
  const en = createTranslator("en");
  const week = (opens: string, closes: string, days: string[]) =>
    days.map((day) => slot(day, opens, closes));
  const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const ALL_DAYS = [...WEEKDAYS, "Saturday", "Sunday"];
  // Intl may separate "AM"/"PM" with a narrow no-break space.
  const plain = (rows: { days: string; hours: string }[]) =>
    rows.map((row) => ({ days: row.days, hours: row.hours.replace(/\s/g, " ") }));

  it.each<
    [
      string,
      OpeningHoursSpecification[],
      ReturnType<typeof createTranslator>,
      string,
      { days: string; hours: string }[],
    ]
  >([
    [
      "weekdays grouped, weekend closed (fr)",
      week("09:00", "18:00", WEEKDAYS),
      fr,
      "fr",
      [
        { days: "Du lundi au vendredi", hours: "9:00 à 18:00" },
        { days: "Du samedi au dimanche", hours: "Fermé" },
      ],
    ],
    [
      "weekdays grouped, weekend closed (en)",
      week("09:00", "18:00", WEEKDAYS),
      en,
      "en",
      [
        { days: "Monday to Friday", hours: "9:00 AM to 6:00 PM" },
        { days: "Saturday to Sunday", hours: "Closed" },
      ],
    ],
    [
      "same hours every day",
      week("10:00", "20:00", ALL_DAYS),
      fr,
      "fr",
      [{ days: "Tous les jours", hours: "10:00 à 20:00" }],
    ],
    [
      "single days and a split day, slots sorted",
      [
        slot("Monday", "14:00", "18:00"),
        slot("Monday", "09:00", "12:00"),
        slot("Wednesday", "09:00", "12:00"),
      ],
      fr,
      "fr",
      [
        { days: "Lundi", hours: "9:00 à 12:00, 14:00 à 18:00" },
        { days: "Mardi", hours: "Fermé" },
        { days: "Mercredi", hours: "9:00 à 12:00" },
        { days: "Du jeudi au dimanche", hours: "Fermé" },
      ],
    ],
    [
      "all-day slots",
      [
        slot("Monday", "00:00", "23:59"),
        slot("Tuesday", "00:00", "00:00"),
        slot("Wednesday", "09:00", "09:00"),
        ...week("00:00", "23:59", ["Thursday", "Friday", "Saturday", "Sunday"]),
      ],
      en,
      "en",
      [{ days: "Every day", hours: "Open 24 hours" }],
    ],
    [
      "overnight slot shown as it runs",
      [slot("Friday", "22:00", "02:00")],
      fr,
      "fr",
      [
        { days: "Du lundi au jeudi", hours: "Fermé" },
        { days: "Vendredi", hours: "22:00 à 2:00" },
        { days: "Du samedi au dimanche", hours: "Fermé" },
      ],
    ],
    ["no hours", [], fr, "fr", [{ days: "Tous les jours", hours: "Fermé" }]],
  ])("%s", (_label, hours, translator, locale, expected) => {
    expect(plain(groupOpeningHours(hours, translator.t, locale))).toEqual(expected);
  });
});
