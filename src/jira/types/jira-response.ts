/**
 * JIRA MCP Server response interface
 */
export interface JiraMcpResponse {
  [key: string]: unknown;
  content: Array<{
    type: "text";
    text: string; // Stringified JSON
  }>;
  isError?: boolean;
}

/**
 * JIRA API response interface
 */
export interface JiraApiResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraIssue[];
}

// Import this from jira-issue.ts once created
import type { JiraIssue } from "./jira-issue.js";
