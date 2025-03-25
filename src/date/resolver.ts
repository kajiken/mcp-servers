import {
  addDays,
  addMonths,
  addWeeks,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Config } from "./config";
import { DateResolutionError } from "./errors";

export class DateResolver {
  private config: Config;

  constructor() {
    this.config = Config.getInstance();
  }

  public resolve(
    parsedDate: {
      type: "fixed" | "relative";
      value: string | number;
      unit?: "day" | "week" | "month";
      direction?: "past" | "future";
    },
    timezone: string
  ): Date {
    try {
      const base = new Date();
      const zonedBase = toZonedTime(base, timezone);

      if (parsedDate.type === "fixed") {
        throw new DateResolutionError("Fixed date type is not yet supported");
      }

      if (typeof parsedDate.value === "string") {
        switch (parsedDate.value) {
          case "TODAY":
            return zonedBase;
          case "TOMORROW":
            return addDays(zonedBase, 1);
          case "YESTERDAY":
            return subDays(zonedBase, 1);
          default:
            throw new DateResolutionError(
              `Unsupported relative date value: ${parsedDate.value}`
            );
        }
      }

      if (!parsedDate.unit || !parsedDate.direction) {
        throw new DateResolutionError(
          "Missing unit or direction for relative date"
        );
      }

      const value = parsedDate.value as number;
      const { unit, direction } = parsedDate;

      if (direction === "future") {
        switch (unit) {
          case "day":
            return addDays(zonedBase, value);
          case "week":
            return addWeeks(zonedBase, value);
          case "month":
            return addMonths(zonedBase, value);
          default:
            throw new DateResolutionError(`Unsupported unit: ${unit}`);
        }
      } else {
        switch (unit) {
          case "day":
            return subDays(zonedBase, value);
          case "week":
            return subWeeks(zonedBase, value);
          case "month":
            return subMonths(zonedBase, value);
          default:
            throw new DateResolutionError(`Unsupported unit: ${unit}`);
        }
      }
    } catch (error) {
      if (error instanceof DateResolutionError) {
        throw error;
      }
      throw new DateResolutionError(
        error instanceof Error ? error.message : String(error)
      );
    }
  }
}
