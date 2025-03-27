/**
 * JIRA Comment interfaces
 */

import type { ADFDocument } from "./adf.js";
import type { JiraUser } from "./jira-issue.js";

/**
 * JIRA Comment visibility
 */
export interface JiraCommentVisibility {
  type: "role" | "group";
  value: string;
  identifier?: string;
}

/**
 * JIRA Comment interface (API response)
 */
export interface JiraApiComment {
  id: string;
  self: string;
  author: JiraUser;
  body: ADFDocument;
  updateAuthor: JiraUser;
  created: string;
  updated: string;
  visibility?: JiraCommentVisibility;
}

/**
 * JIRA Comment interface (formatted with Markdown body)
 */
export interface JiraComment {
  id: string;
  self: string;
  author: JiraUser;
  body: string; // Markdown converted text
  updateAuthor: JiraUser;
  created: string;
  updated: string;
  visibility?: JiraCommentVisibility;
}

/**
 * JIRA Comments API response
 */
export interface JiraApiCommentsResponse {
  startAt: number;
  maxResults: number;
  total: number;
  comments: JiraApiComment[];
}

/**
 * JIRA Comments formatted response
 */
export interface JiraCommentsResponse {
  startAt: number;
  maxResults: number;
  total: number;
  comments: JiraComment[];
}

/**
 * JIRA Get Issue Comments parameters
 */
export interface GetIssueCommentsParams {
  issueIdOrKey: string;
  startAt?: number;
  maxResults?: number;
  orderBy?: string;
  expand?: string;
}
