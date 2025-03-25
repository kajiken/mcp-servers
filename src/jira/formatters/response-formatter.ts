import type { JiraIssue } from "../types/jira-issue.js";
import type {
  JiraApiResponse,
  JiraMcpResponse,
} from "../types/jira-response.js";
import { ADFConverter } from "../utils/adf-converter.js";

/**
 * Formats JIRA API response into MCP response format
 */
export class ResponseFormatter {
  /**
   * Format JIRA API response
   */
  public static format(response: JiraApiResponse): JiraMcpResponse {
    const formattedIssues = response.issues.map((issue) =>
      this.formatIssue(issue)
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              ...response,
              issues: formattedIssues,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  /**
   * Format a single JIRA issue
   */
  private static formatIssue(issue: JiraIssue): any {
    const { fields, ...rest } = issue;
    return {
      ...rest,
      fields: this.formatFields(fields),
    };
  }

  /**
   * Format issue fields
   */
  private static formatFields(fields: JiraIssue["fields"]): any {
    const { description, ...rest } = fields;

    // Convert description from ADF to Markdown if it exists and is an object
    const formattedDescription =
      typeof description === "object" && description !== null
        ? ADFConverter.convert(description as any)
        : description;

    return {
      ...rest,
      description: formattedDescription,
    };
  }

  /**
   * Format error response
   */
  public static formatError(error: Error): JiraMcpResponse {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: error.message,
        },
      ],
    };
  }
}
