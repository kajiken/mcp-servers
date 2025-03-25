// JIRA API Types
export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  active: boolean;
}

export interface JiraStatus {
  id: string;
  name: string;
  statusCategory: {
    id: number;
    key: string;
    name: string;
  };
}

export interface JiraPriority {
  id: string;
  name: string;
  iconUrl?: string;
}

export interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
}

export interface JiraIssueFields {
  summary: string;
  description?: string;
  created: string;
  updated: string;
  status: JiraStatus;
  assignee?: JiraUser;
  reporter?: JiraUser;
  priority?: JiraPriority;
  issuetype: JiraIssueType;
  project: {
    id: string;
    key: string;
    name: string;
  };
}

export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: JiraIssueFields;
}

export interface JiraSearchResponse {
  expand?: string[];
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraIssue[];
}

// MCP Tool Parameter Types
export interface SearchIssuesParams {
  jql: string;
  startAt?: number;
  maxResults?: number;
  fields?: string[];
}

export interface GetIssueParams {
  issueKey: string;
  fields?: string[];
}
