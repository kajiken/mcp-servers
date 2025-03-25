export const DEFAULT_TIMEZONE = "UTC";

export const RELATIVE_DATE_EXPRESSIONS = {
  TODAY: "today",
  TOMORROW: "tomorrow",
  YESTERDAY: "yesterday",
  THIS_WEEK: "this week",
  NEXT_WEEK: "next week",
  LAST_WEEK: "last week",
  THIS_MONTH: "this month",
  NEXT_MONTH: "next month",
  LAST_MONTH: "last month",
} as const;

export const RELATIVE_DATE_PATTERNS = {
  DAYS_AGO: /(\d+)\s*days?\s*ago/,
  DAYS_LATER: /(\d+)\s*days?\s*later/,
  WEEKS_AGO: /(\d+)\s*weeks?\s*ago/,
  WEEKS_LATER: /(\d+)\s*weeks?\s*later/,
  MONTHS_AGO: /(\d+)\s*months?\s*ago/,
  MONTHS_LATER: /(\d+)\s*months?\s*later/,
} as const;
