export class DateServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DateServerError";
  }
}

export class InvalidTimezoneError extends DateServerError {
  constructor(timezone: string) {
    super(
      `Invalid timezone: "${timezone}". Please use a valid IANA timezone identifier (e.g., "UTC", "Asia/Tokyo").`
    );
    this.name = "InvalidTimezoneError";
  }
}

export class InvalidDateExpressionError extends DateServerError {
  constructor(expression: string) {
    super(
      `Invalid date expression: "${expression}". Please use a supported date expression.`
    );
    this.name = "InvalidDateExpressionError";
  }
}

export class DateResolutionError extends DateServerError {
  constructor(message: string) {
    super(`Failed to resolve date: ${message}`);
    this.name = "DateResolutionError";
  }
}
