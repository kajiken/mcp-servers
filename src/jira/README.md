# JIRA MCP Server

A Model Context Protocol (MCP) server for interacting with JIRA Cloud. This server provides tools to search and retrieve JIRA issues through MCP.

## Features

- Search JIRA issues using JQL queries
- Retrieve detailed information about specific JIRA issues
- Configurable field selection for both search and get operations

## Installation

```bash
npm install -g @modelcontextprotocol/mcp-server-jira
```

## Configuration

The server requires the following environment variables to be set:

```bash
JIRA_HOST=your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
```

To obtain an API token:

1. Log in to https://id.atlassian.com/manage/api-tokens
2. Click "Create API token"
3. Name your token and click "Create"
4. Copy the token value (you won't be able to see it again)

You can create a `.env` file in your project root with these variables:

```env
JIRA_HOST=your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
```

## Usage

### Starting the Server

```bash
mcp-server-jira
```

### Available Tools

#### search_issues

Search for JIRA issues using JQL (JIRA Query Language).

Parameters:

- `jql` (string, required): JQL query string
- `startAt` (number, optional): Starting index for pagination
- `maxResults` (number, optional): Maximum number of results to return
- `fields` (string[], optional): List of fields to include in the response

Example:

```json
{
  "jql": "project = 'MY-PROJECT' AND status = 'In Progress'",
  "maxResults": 10,
  "fields": ["key", "summary", "status"]
}
```

#### get_issue

Retrieve detailed information about a specific JIRA issue.

Parameters:

- `issueKey` (string, required): JIRA issue key (e.g., 'PROJECT-123')
- `fields` (string[], optional): List of fields to include in the response

Example:

```json
{
  "issueKey": "PROJECT-123",
  "fields": ["summary", "description", "status", "assignee"]
}
```

## Development

### Prerequisites

- Node.js 18 or later
- npm 7 or later

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your JIRA credentials

### Build

```bash
npm run build
```

### Run in Development Mode

```bash
npm run dev
```

## License

MIT
