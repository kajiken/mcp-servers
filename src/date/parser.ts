import { RELATIVE_DATE_EXPRESSIONS, RELATIVE_DATE_PATTERNS } from "./constants";
import { InvalidDateExpressionError } from "./errors";

export class DateParser {
  public parse(expression: string): {
    type: "fixed" | "relative";
    value: string | number;
    unit?: "day" | "week" | "month";
    direction?: "past" | "future";
  } {
    if (!expression || typeof expression !== "string") {
      throw new InvalidDateExpressionError(String(expression));
    }

    // 基本的な相対日付の処理
    for (const [key, value] of Object.entries(RELATIVE_DATE_EXPRESSIONS)) {
      if (expression === value) {
        return {
          type: "relative",
          value: key,
        };
      }
    }

    // 数値を含む相対表現の処理
    for (const [key, pattern] of Object.entries(RELATIVE_DATE_PATTERNS)) {
      const match = expression.match(pattern);
      if (match) {
        const value = parseInt(match[1], 10);
        if (isNaN(value) || value < 0) {
          throw new InvalidDateExpressionError(expression);
        }
        const [unit, direction] = this.parsePatternKey(key);
        return {
          type: "relative",
          value,
          unit,
          direction,
        };
      }
    }

    throw new InvalidDateExpressionError(expression);
  }

  private parsePatternKey(
    key: string
  ): ["day" | "week" | "month", "past" | "future"] {
    if (key.includes("DAYS")) {
      return ["day", key.includes("AGO") ? "past" : "future"];
    }
    if (key.includes("WEEKS")) {
      return ["week", key.includes("AGO") ? "past" : "future"];
    }
    if (key.includes("MONTHS")) {
      return ["month", key.includes("AGO") ? "past" : "future"];
    }
    throw new InvalidDateExpressionError(`Invalid pattern key: ${key}`);
  }
}
