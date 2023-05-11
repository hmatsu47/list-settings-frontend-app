import { expect, test } from "vitest";
import {
  formatDateTimeDisplay,
  formatDateTimeInput,
  formatDateTimeStore,
} from "../src/formatDateTime";

describe("formatDateTime", () => {
  const dateTime = [
    {
      date: new Date(2022, 0, 1, 0, 0),
      display: "2022-01-01 00:00",
      input: "2022-01-01T00:00",
    },
    {
      date: new Date(2022, 8, 8, 19, 30),
      display: "2022-09-08 19:30",
      input: "2022-09-08T19:30",
    },
    {
      date: new Date(2022, 11, 31, 23, 59),
      display: "2022-12-31 23:59",
      input: "2022-12-31T23:59",
    },
  ];
  dateTime.forEach((testCase) => {
    test(`formatDateTimeDisplay & formatDateTimeInput（date=${testCase.date}）`, async () => {
      const display = formatDateTimeDisplay(testCase.date);
      expect(display).toBe(testCase.display);
      const input = formatDateTimeInput(testCase.date);
      expect(input).toBe(testCase.input);
    });
  });

  const dateTimeStore = [
    {
      dateTimeString: "2022-01-01T00:00",
      store: "2022-01-01T00:00:00+09:00",
    },
    {
      dateTimeString: "2022-12-31T23:59",
      store: "2022-12-31T23:59:00+09:00",
    },
  ];
  dateTimeStore.forEach((testCase) => {
    test(`formatDateTimeStore（dateTimeString=${testCase.dateTimeString}）`, async () => {
      const store = formatDateTimeStore(testCase.dateTimeString);
      expect(store).toBe(testCase.store);
    });
  });
});
