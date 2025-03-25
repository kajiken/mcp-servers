import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Config } from "./config";

export class DateFormatter {
  private config: Config;

  constructor() {
    this.config = Config.getInstance();
  }

  public format(date: Date, timezone?: string): string {
    const tz = timezone || this.config.getConfig().timezone;
    const zonedDate = toZonedTime(date, tz);
    return format(zonedDate, "yyyy-MM-dd");
  }
}
