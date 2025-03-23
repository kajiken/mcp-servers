#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE_URL = "https://readwise.io/api/v3";
const API_TOKEN = process.env.READWISE_API_TOKEN;
if (!API_TOKEN) {
  throw new Error("READWISE_API_TOKEN environment variable is required");
}

interface Document {
  id: string;
  url: string;
  source_url: string;
  title: string;
  author: string;
  source: string;
  category: "article" | "email" | "rss" | "highlight" | "tweet";
  location: "new" | "later" | "shortlist" | "archive" | "feed";
  tags: Record<string, string> | null;
  site_name: string | null;
  word_count: number;
  created_at: string;
  updated_at: string;
  notes: string | null;
  published_date: string;
  summary: string;
  image_url: string | null;
  parent_id: string | null;
  reading_progress: number | null;
  first_opened_at: string | null;
  last_opened_at: string | null;
  saved_at: string;
  last_moved_at: string;
}

interface DocumentListResponse {
  results: Document[];
  count: number;
  nextPageCursor: string | null;
}

const server = new McpServer({
  name: "mcp-server-readwise",
  version: "0.1.0",
});

async function fetchDocuments<T>(query: string): Promise<T | null> {
  try {
    const url = `${BASE_URL}/lists/?${query}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${API_TOKEN}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch documents:", error);
    return null;
  }
}

server.tool(
  "list_documents",
  "List documents from Readwise Reader",
  {
    updatedAfter: z
      .string()
      .optional()
      .describe("Fetch only documents updated after this date."),
    location: z
      .enum(["new", "later", "shortlist", "archive", "feed"])
      .optional()
      .describe(
        "The document's location, could be one of: new, later, shortlist, archive, feed"
      ),
    category: z
      .enum(["article", "email", "rss", "highlight", "tweet"])
      .optional()
      .describe(
        "The document's category, could be one of: article, email, rss, highlight, tweet"
      ),
    pageCursor: z
      .string()
      .optional()
      .describe(
        "A string returned by a previous request to this endpoint. Use it to get the next page of documents if there are too many for one request."
      ),
    withHtmlContent: z
      .boolean()
      .optional()
      .describe(
        "Include the html_content field in each document's data. Please note that enabling this feature may slightly increase request processing time. Could be one of: true, false."
      ),
  },
  async (params) => {
    const documents = await fetchDocuments<DocumentListResponse>(
      params.toString()
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(documents),
        },
      ],
    };
  }
);

server.tool(
  "get_document",
  "Get a specific document by ID from Readwise Reader",
  {
    documentId: z
      .string()
      .describe(
        "The document's unique id. Using this parameter it will return just one document, if found."
      ),
  },
  async (params) => {
    const documents = await fetchDocuments<DocumentListResponse>(
      params.toString()
    );
    const document = documents?.results.find((d) => d.id === params.documentId);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(document),
        },
      ],
    };
  }
);

/**
 * Main function to start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Readwise MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
