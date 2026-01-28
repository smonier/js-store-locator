import React from "react";
import { useStoreLocatorTranslation } from "../StoreLocatorApp/translation";
import styles from "./OpeningHoursSelector.module.css";

interface OpeningHoursValue {
  dayOfWeek: string;
  opens: string;
  closes: string;
}

interface OpeningHoursSelectorProps {
  field: {
    readOnly?: boolean;
    name: string;
  };
  id: string;
  value: string | null;
  onChange: (value: string) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Generate time slots from 00:00 to 23:30 in 30-minute intervals
const TIMES = Array.from({ length: 48 }, (_, i) => {
  const hours = String(Math.floor(i / 2)).padStart(2, "0");
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${hours}:${minutes}`;
});

const formatOpeningHourValue = (value: string | null): OpeningHoursValue => {
  const defaultValue: OpeningHoursValue = {
    dayOfWeek: "Monday",
    opens: "09:00",
    closes: "18:00",
  };

  if (!value) {
    return defaultValue;
  }

  try {
    const parsed = JSON.parse(value);
    return {
      dayOfWeek: parsed.dayOfWeek || defaultValue.dayOfWeek,
      opens: parsed.opens || defaultValue.opens,
      closes: parsed.closes || defaultValue.closes,
    };
  } catch (_) {
    return defaultValue;
  }
};

export const OpeningHoursSelector: React.FC<OpeningHoursSelectorProps> = ({
  field,
  id,
  value,
  onChange,
}) => {
  const { t } = useStoreLocatorTranslation();
  const controlledValue = formatOpeningHourValue(value);

  const handleChange = (key: keyof OpeningHoursValue) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = {
      ...controlledValue,
      [key]: event.target.value,
    };
    onChange(JSON.stringify(newValue));
  };

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label htmlFor={`dayOfWeek-${id}`} className={styles.label}>
          {t("label.dayOfWeek", "Day of Week")}
        </label>
        <select
          id={`dayOfWeek-${id}`}
          className={styles.select}
          value={controlledValue.dayOfWeek}
          disabled={field.readOnly}
          onChange={handleChange("dayOfWeek")}
        >
          {DAYS.map((day) => (
            <option key={day} value={day}>
              {t(`days.${day.toLowerCase()}`, day)}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor={`opens-${id}`} className={styles.label}>
          {t("label.opens", "Opens")}
        </label>
        <select
          id={`opens-${id}`}
          className={styles.select}
          value={controlledValue.opens}
          disabled={field.readOnly}
          onChange={handleChange("opens")}
        >
          {TIMES.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor={`closes-${id}`} className={styles.label}>
          {t("label.closes", "Closes")}
        </label>
        <select
          id={`closes-${id}`}
          className={styles.select}
          value={controlledValue.closes}
          disabled={field.readOnly}
          onChange={handleChange("closes")}
        >
          {TIMES.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
