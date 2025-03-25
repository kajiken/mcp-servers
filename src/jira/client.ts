import type { JiraIssue } from "./types/jira-issue.js";
import type { JiraApiResponse } from "./types/jira-response.js";

/**
 * JIRA API client
 */
export class JiraClient {
  private baseUrl: string;
  private auth: string;

  constructor(baseUrl: string, email: string, apiToken: string) {
    this.baseUrl = baseUrl;
    this.auth = Buffer.from(`${email}:${apiToken}`).toString("base64");
  }

  /**
   * Search JIRA issues using JQL
   */
  async searchIssues(params: {
    jql: string;
    fields?: string[];
    startAt?: number;
    maxResults?: number;
  }): Promise<JiraApiResponse> {
    const { jql, fields, startAt, maxResults } = params;
    const searchParams = new URLSearchParams();
    searchParams.append("jql", jql);
    if (fields) searchParams.append("fields", fields.join(","));
    if (startAt !== undefined)
      searchParams.append("startAt", startAt.toString());
    if (maxResults !== undefined)
      searchParams.append("maxResults", maxResults.toString());

    const response = await fetch(
      `${this.baseUrl}/rest/api/3/search?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`JIRA API error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get JIRA issue by key
   */
  async getIssue(issueKey: string, fields?: string[]): Promise<JiraIssue> {
    const searchParams = new URLSearchParams();
    if (fields) searchParams.append("fields", fields.join(","));

    const response = await fetch(
      `${this.baseUrl}/rest/api/3/issue/${issueKey}?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Basic ${this.auth}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`JIRA API error: ${response.statusText}`);
    }

    return response.json();
  }
}
