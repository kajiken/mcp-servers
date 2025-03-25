/**
 * JIRA User interface
 */
export interface JiraUser {
  accountId: string;
  emailAddress?: string;
  displayName: string;
  active: boolean;
  timeZone?: string;
  accountType: string;
}

/**
 * JIRA Issue interface
 */
export interface JiraIssue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: {
    labels: string[];
    assignee: JiraUser | null;
    reporter: JiraUser;
    progress: {
      progress: number;
      total: number;
    };
    issuetype: {
      id: string;
      name: string;
    };
    project: {
      id: string;
      key: string;
      name: string;
    };
    updated: string;
    customfield_10015: string; // start date
    duedate: string;
    summary: string;
    description: string; // Converted to Markdown
    status: {
      name: string;
      id: string;
    };
    creator: JiraUser;
    created: string;
    fixVersions: Array<{
      id: string;
      name: string;
      archived: boolean;
      released: boolean;
      releaseDate: string;
    }>;
  };
}
