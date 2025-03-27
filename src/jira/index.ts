#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { JiraClient } from "./client.js";
import { jiraConfig } from "./config.js";
import { CommentResponseFormatter } from "./formatters/comment-formatter.js";
import { ResponseFormatter } from "./formatters/response-formatter.js";
import type { GetIssueCommentsParams } from "./types/jira-comment.js";
import type { JiraMcpResponse } from "./types/jira-response.js";

const server = new McpServer({
  name: "mcp-server-jira",
  version: "0.1.0",
});

const client = new JiraClient(
  jiraConfig.baseUrl,
  jiraConfig.email,
  jiraConfig.apiToken
);

// Tool: Search issues using JQL
server.tool(
  "search_issues",
  "Search JIRA issues using JQL",
  {
    jql: z.string().describe("JQL query string"),
    startAt: z
      .number()
      .optional()
      .describe("Starting index of the search results"),
    maxResults: z
      .number()
      .optional()
      .describe("Maximum number of results to return"),
    fields: z.array(z.string()).optional().describe("List of fields to return"),
  },
  async (params) => {
    try {
      const response = await client.searchIssues({
        jql: params.jql,
        startAt: params.startAt,
        maxResults: params.maxResults,
        fields: params.fields,
      });
      return ResponseFormatter.format(response);
    } catch (error) {
      return ResponseFormatter.formatError(
        error instanceof Error ? error : new Error("Unknown error occurred")
      );
    }
  }
);

// Tool: Get issue by key
server.tool(
  "get_issue",
  "Get JIRA issue details by key",
  {
    issueKey: z.string().describe("JIRA issue key (e.g., 'PROJECT-123')"),
    fields: z.array(z.string()).optional().describe("List of fields to return"),
  },
  async (params) => {
    try {
      const response = await client.getIssue(params.issueKey, params.fields);
      return ResponseFormatter.format({
        expand: "",
        startAt: 0,
        maxResults: 1,
        total: 1,
        issues: [response],
      });
    } catch (error) {
      return ResponseFormatter.formatError(
        error instanceof Error ? error : new Error("Unknown error occurred")
      );
    }
  }
);

// Tool: Get issue comments
server.tool(
  "get_issue_comments",
  "Get JIRA issue comments by issue key",
  {
    issueIdOrKey: z.string().describe("JIRA issue key (e.g., 'PROJECT-123')"),
    startAt: z.number().optional().describe("Starting index of the comments"),
    maxResults: z
      .number()
      .optional()
      .describe("Maximum number of comments to return"),
    orderBy: z
      .string()
      .optional()
      .describe("Order of comments (e.g., 'created', '-created')"),
    expand: z.string().optional().describe("Additional information to include"),
  },
  async (params) => {
    try {
      const response = await client.getIssueComments({
        issueIdOrKey: params.issueIdOrKey,
        startAt: params.startAt,
        maxResults: params.maxResults,
        orderBy: params.orderBy,
        expand: params.expand,
      });
      return CommentResponseFormatter.format(response);
    } catch (error) {
      return CommentResponseFormatter.formatError(
        error instanceof Error ? error : new Error("Unknown error occurred")
      );
    }
  }
);

/**
 * Main function to start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("JIRA MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

/**
 * JIRA MCP Server
 */
export class JiraServer {
  private client: JiraClient;

  constructor(baseUrl: string, email: string, apiToken: string) {
    this.client = new JiraClient(baseUrl, email, apiToken);
  }

  /**
   * Search JIRA issues using JQL
   */
  async searchIssues(params: {
    jql: string;
    fields?: string[];
    startAt?: number;
    maxResults?: number;
  }): Promise<JiraMcpResponse> {
    try {
      const response = await this.client.searchIssues(params);
      return ResponseFormatter.format(response);
    } catch (error) {
      return ResponseFormatter.formatError(
        error instanceof Error ? error : new Error("Unknown error occurred")
      );
    }
  }

  /**
   * Get JIRA issue by key
   */
  async getIssue(params: {
    issueKey: string;
    fields?: string[];
  }): Promise<JiraMcpResponse> {
    try {
      const response = await this.client.getIssue(
        params.issueKey,
        params.fields
      );
      return ResponseFormatter.format({
        expand: "",
        startAt: 0,
        maxResults: 1,
        total: 1,
        issues: [response],
      });
    } catch (error) {
      return ResponseFormatter.formatError(
        error instanceof Error ? error : new Error("Unknown error occurred")
      );
    }
  }

  /**
   * Get JIRA issue comments
   */
  async getIssueComments(
    params: GetIssueCommentsParams
  ): Promise<JiraMcpResponse> {
    try {
      const response = await this.client.getIssueComments(params);
      return CommentResponseFormatter.format(response);
    } catch (error) {
      return CommentResponseFormatter.formatError(
        error instanceof Error ? error : new Error("Unknown error occurred")
      );
    }
  }
}
