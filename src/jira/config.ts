import { z } from "zod";

// Configuration schema
const configSchema = z.object({
  host: z.string().url("JIRA_HOST must be a valid URL"),
  apiToken: z.string().min(1, "JIRA_API_TOKEN is required"),
  userEmail: z.string().email("JIRA_USER_EMAIL must be a valid email address"),
});

// Configuration type
export type Config = z.infer<typeof configSchema>;

// Load and validate configuration
export function loadConfig(): Config {
  const config = {
    host: process.env.JIRA_HOST,
    apiToken: process.env.JIRA_API_TOKEN,
    userEmail: process.env.JIRA_USER_EMAIL,
  };

  try {
    return configSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(`Invalid configuration:\n${messages.join("\n")}`);
    }
    throw error;
  }
}

// Default configuration
export const config = loadConfig();

/**
 * JIRA configuration
 */
export interface JiraConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
}

export const jiraConfig: JiraConfig = {
  baseUrl: config.host || "",
  email: config.userEmail || "",
  apiToken: config.apiToken || "",
};
