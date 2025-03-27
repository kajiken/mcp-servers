import type {
  JiraApiComment,
  JiraApiCommentsResponse,
  JiraComment,
  JiraCommentsResponse,
} from "../types/jira-comment.js";
import type { JiraMcpResponse } from "../types/jira-response.js";
import { ADFConverter } from "../utils/adf-converter.js";

/**
 * Formats JIRA API comment responses into MCP response format
 */
export class CommentResponseFormatter {
  /**
   * Format a single JIRA comment
   */
  public static formatComment(comment: JiraApiComment): JiraComment {
    return {
      id: comment.id,
      self: comment.self,
      author: comment.author,
      body: ADFConverter.convert(comment.body),
      updateAuthor: comment.updateAuthor,
      created: comment.created,
      updated: comment.updated,
      visibility: comment.visibility,
    };
  }

  /**
   * Format JIRA API comments response
   */
  public static formatResponse(
    response: JiraApiCommentsResponse
  ): JiraCommentsResponse {
    return {
      startAt: response.startAt,
      maxResults: response.maxResults,
      total: response.total,
      comments: response.comments.map(this.formatComment),
    };
  }

  /**
   * Format JIRA comments for MCP response
   */
  public static format(response: JiraApiCommentsResponse): JiraMcpResponse {
    const formattedResponse = this.formatResponse(response);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(formattedResponse, null, 2),
        },
      ],
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
