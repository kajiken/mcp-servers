import { DEFAULT_TIMEZONE } from "./constants";
import { InvalidTimezoneError } from "./errors";
import { ServerConfig } from "./types";

// タイムゾーンのリスト
// https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
const VALID_TIMEZONES = new Set([
  // 主要なタイムゾーン
  "UTC",
  "GMT",

  // アジア
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Seoul",
  "Asia/Hong_Kong",
  "Asia/Dubai",

  // 北米
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Denver",
  "America/Toronto",
  "America/Vancouver",

  // ヨーロッパ
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Amsterdam",
  "Europe/Moscow",

  // オセアニア
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Perth",
  "Pacific/Auckland",

  // その他
  "Asia/Kolkata",
  "Asia/Jakarta",
  "America/Sao_Paulo",
  "Africa/Cairo",
]);

export class Config {
  private static instance: Config;
  private config: ServerConfig;

  private constructor() {
    const timezone = process.env.TIME_ZONE || DEFAULT_TIMEZONE;
    if (!this.isValidTimezone(timezone)) {
      throw new InvalidTimezoneError(timezone);
    }
    this.config = { timezone };
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public getConfig(): ServerConfig {
    return { ...this.config };
  }

  public setTimezone(timezone: string): void {
    if (!this.isValidTimezone(timezone)) {
      throw new InvalidTimezoneError(timezone);
    }
    this.config.timezone = timezone;
  }

  private isValidTimezone(timezone: string): boolean {
    if (!timezone) return false;

    // タイムゾーンの形式チェック
    // 基本的な形式: 'Area/Location' または 'UTC', 'GMT'
    const timezonePattern = /^(UTC|GMT|[A-Za-z]+\/[A-Za-z_]+)$/;
    if (!timezonePattern.test(timezone)) {
      return false;
    }

    // 既知のタイムゾーンリストとの照合
    return VALID_TIMEZONES.has(timezone);
  }

  // テスト用のメソッド
  public static resetInstance(): void {
    Config.instance = undefined as any;
  }

  // 有効なタイムゾーンのリストを取得
  public static getValidTimezones(): string[] {
    return Array.from(VALID_TIMEZONES).sort();
  }
}
