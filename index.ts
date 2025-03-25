#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Config } from "./config";
import { DateServerError } from "./errors";
import { DateFormatter } from "./formatter";
import { DateParser } from "./parser";
import { DateResolver } from "./resolver";

const server = new McpServer({
  name: "mcp-server-date",
  version: "0.1.0",
});

class DateService {
  private config: Config;
  private parser: DateParser;
  private resolver: DateResolver;
  private formatter: DateFormatter;

  constructor() {
    this.config = Config.getInstance();
    this.parser = new DateParser();
    this.resolver = new DateResolver();
    this.formatter = new DateFormatter();
  }

  public resolve(
    expression: string,
    timezone?: string
  ): {
    success: boolean;
    date?: string;
    error?: string;
    timezone?: string;
    confidence: number;
  } {
    try {
      const tz = timezone || this.config.getConfig().timezone;
      const parsedDate = this.parser.parse(expression);
      const resolvedDate = this.resolver.resolve(parsedDate, tz);
      const formattedDate = this.formatter.format(resolvedDate, tz);

      return {
        success: true,
        date: formattedDate,
        timezone: tz,
        confidence: 1.0,
      };
    } catch (error) {
      if (error instanceof DateServerError) {
        return {
          success: false,
          error: error.message,
          confidence: 0,
        };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        confidence: 0,
      };
    }
  }
}

const dateService = new DateService();

server.tool(
  "resolve_date",
  "Convert relative date expressions to absolute dates",
  {
    expression: z
      .string()
      .describe(
        "The date expression to resolve (e.g., 'today', 'tomorrow', '3 days later')"
      ),
    timezone: z
      .string()
      .optional()
      .describe(
        "The timezone to use for date resolution (e.g., 'UTC', 'Asia/Tokyo')"
      ),
  },
  async (params) => {
    const result = dateService.resolve(params.expression, params.timezone);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
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
  console.error("Date MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
