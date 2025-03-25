#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { JiraClient } from "./client.js";
import { config } from "./config.js";

const server = new McpServer({
  name: "mcp-server-jira",
  version: "0.1.0",
});

const client = new JiraClient(config);

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

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text:
              error instanceof Error ? error.message : "Unknown error occurred",
          },
        ],
      };
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
      const issue = await client.getIssue({
        issueKey: params.issueKey,
        fields: params.fields,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(issue, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text:
              error instanceof Error ? error.message : "Unknown error occurred",
          },
        ],
      };
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
