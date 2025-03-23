# Readwise MCP Server

A Model Context Protocol (MCP) server implementation for interacting with the Readwise Reader API. This server provides tools to fetch and manage documents from your Readwise Reader account.

## Features

- List documents with various filters
- Retrieve specific documents by ID
- Support for pagination
- Type-safe API interactions using Zod

## Prerequisites

- Node.js (v18 or later)
- Readwise Reader API token

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

```bash
export READWISE_API_TOKEN="your-api-token-here"
```

## Usage

### Starting the Server

```bash
npm start
```

The server will start and listen for MCP commands via stdio.

### Available Tools

#### 1. list_documents

Lists documents from your Readwise Reader account with optional filters.

Parameters:

- `updatedAfter` (optional): Fetch only documents updated after this date
- `location` (optional): Filter by document location ("new", "later", "shortlist", "archive", "feed")
- `category` (optional): Filter by document category ("article", "email", "rss", "highlight", "tweet")
- `pageCursor` (optional): Cursor for pagination
- `withHtmlContent` (optional): Include HTML content in the response

#### 2. get_document

Retrieves a specific document by its ID.

Parameters:

- `documentId`: The unique identifier of the document

## API Response Types

### Document Interface

```typescript
interface Document {
  id: string;
  url: string;
  source_url: string;
  title: string;
  author: string;
  source: string;
  category: "article" | "email" | "rss" | "highlight" | "tweet";
  location: "new" | "later" | "shortlist" | "archive" | "feed";
  tags: Record<string, string>;
  site_name: string;
  word_count: number;
  created_at: string;
  updated_at: string;
  notes: string;
  published_date: string;
  summary: string;
  image_url: string | null;
  parent_id: string | null;
  reading_progress: number;
  first_opened_at: string | null;
  last_opened_at: string | null;
  saved_at: string;
  last_moved_at: string;
}
```

## Error Handling

The server includes basic error handling for:

- Missing API token
- Failed API requests
- Invalid parameters

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Links

- [Readwise Reader API Documentation](https://readwise.io/api_deets)
- [Model Context Protocol Documentation](https://github.com/modelcontextprotocol/modelcontextprotocol)
