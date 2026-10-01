import { fill } from "./translation.js";
import type { OpeningHoursSpecification } from "./types.js";

/** Days in display order (ISO week, Monday first), as stored in the opening-hours JSON. */
export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Parses the stored opening-hours values (one JSON object per value) and keeps only well-formed
 * entries: a known day and two HH:MM times. Anything else is dropped.
 */
export function parseOpeningHours(values: string[]): OpeningHoursSpecification[] {
  const result: OpeningHoursSpecification[] = [];
  for (const value of values) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch {
      continue;
    }
    if (typeof parsed !== "object" || parsed === null) continue;
    const { dayOfWeek, opens, closes } = parsed as Record<string, unknown>;
    if (
      typeof dayOfWeek === "string" &&
      (DAYS as readonly string[]).includes(dayOfWeek) &&
      typeof opens === "string" &&
      TIME.test(opens) &&
      typeof closes === "string" &&
      TIME.test(closes)
    ) {
      result.push({ dayOfWeek, opens, closes });
    }
  }
  return result;
}

const minutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

/** True when the store is open at `now` (visitor's clock). A slot may run past midnight. */
export function isOpenAt(hours: OpeningHoursSpecification[], now: Date): boolean {
  const jsDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = jsDays[now.getDay()];
  const yesterday = jsDays[(now.getDay() + 6) % 7];
  const current = now.getHours() * 60 + now.getMinutes();
  return hours.some((slot) => {
    const opens = minutes(slot.opens);
    const closes = minutes(slot.closes);
    if (slot.dayOfWeek === today) {
      return closes > opens ? current >= opens && current < closes : current >= opens;
    }
    // A slot of yesterday that closes after midnight
    return slot.dayOfWeek === yesterday && closes <= opens && current < closes;
  });
}

const formatTime = (time: string, locale: string) => {
  const [h, m] = time.split(":").map(Number);
  // A fixed date in UTC, formatted in UTC: the result never depends on the server time zone.
  return new Intl.DateTimeFormat(locale, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2000, 0, 3, h, m)));
};

export interface HoursRow {
  days: string;
  hours: string;
}

/**
 * Groups consecutive days with the same hours into rows ("Monday to Friday: 9:00 to 18:00").
 * Days without hours are listed as closed, so the table always covers the whole week.
 */
export function groupOpeningHours(
  hours: OpeningHoursSpecification[],
  t: (key: string) => string,
  locale: string,
): HoursRow[] {
  const perDay = DAYS.map((day) => {
    const slots = hours
      .filter((slot) => slot.dayOfWeek === day)
      .sort((a, b) => minutes(a.opens) - minutes(b.opens));
    if (slots.length === 0) return t("storedetails.closedDay");
    return slots
      .map((slot) =>
        slot.opens === "00:00" && (slot.closes === "23:59" || slot.closes === "00:00")
          ? t("storedetails.allday")
          : fill(t("storedetails.timeRange"), {
              opens: formatTime(slot.opens, locale),
              closes: formatTime(slot.closes, locale),
            }),
      )
      .join(", ");
  });

  const dayName = (index: number) => t(`days.${DAYS[index].toLowerCase()}`);
  const rows: HoursRow[] = [];
  let start = 0;
  for (let i = 1; i <= DAYS.length; i++) {
    if (i === DAYS.length || perDay[i] !== perDay[start]) {
      const end = i - 1;
      let days: string;
      if (start === 0 && end === DAYS.length - 1) days = t("days.everyday");
      else if (start === end) days = dayName(start);
      else days = fill(t("days.range"), { from: dayName(start), to: dayName(end) });
      rows.push({ days, hours: perDay[start] });
      start = i;
    }
  }
  return rows;
}
