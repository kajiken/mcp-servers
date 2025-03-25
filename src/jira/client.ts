import { Config } from "./config.js";
import {
  GetIssueParams,
  JiraIssue,
  JiraSearchResponse,
  SearchIssuesParams,
} from "./types.js";

export class JiraClient {
  private readonly baseUrl: string;
  private readonly headers: HeadersInit;

  constructor(config: Config) {
    this.baseUrl = `${config.host}/rest/api/3`;
    this.headers = {
      Authorization: `Basic ${Buffer.from(
        `${config.userEmail}:${config.apiToken}`
      ).toString("base64")}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  }

  /**
   * Search for issues using JQL
   */
  async searchIssues(params: SearchIssuesParams): Promise<JiraSearchResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append("jql", params.jql);

    if (params.startAt !== undefined) {
      searchParams.append("startAt", params.startAt.toString());
    }

    if (params.maxResults !== undefined) {
      searchParams.append("maxResults", params.maxResults.toString());
    }

    if (params.fields) {
      searchParams.append("fields", params.fields.join(","));
    }

    const response = await fetch(
      `${this.baseUrl}/search?${searchParams.toString()}`,
      {
        method: "GET",
        headers: this.headers,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to search issues: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Get issue by key
   */
  async getIssue(params: GetIssueParams): Promise<JiraIssue> {
    const searchParams = new URLSearchParams();

    if (params.fields) {
      searchParams.append("fields", params.fields.join(","));
    }

    const queryString = searchParams.toString();
    const url = `${this.baseUrl}/issue/${params.issueKey}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.headers,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Issue ${params.issueKey} not found`);
      }
      throw new Error(
        `Failed to get issue: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  /**
   * Helper method to handle API errors
   */
  private async handleApiError(response: Response): Promise<never> {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.errorMessages?.length > 0) {
        errorMessage += `: ${errorJson.errorMessages.join(", ")}`;
      } else if (errorJson.message) {
        errorMessage += `: ${errorJson.message}`;
      }
    } catch {
      errorMessage += `: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
}
