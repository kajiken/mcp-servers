# Date MCP Server

A date resolution server for LLMs that converts relative date expressions (e.g., "today", "tomorrow", "3 days later") into absolute dates (YYYY-MM-DD format).

## Features

- 🌍 Timezone Support
- 🔄 Relative Date Resolution
- 📊 Confidence Scoring
- 🛡️ Error Handling
- 🤖 MCP (Model Context Protocol) Support

## Installation

```bash
npm install @modelcontextprotocol/mcp-server-date
```

## Usage

### As MCP Server

```bash
# Set environment variables (optional)
export TIME_ZONE=Asia/Tokyo

# Start the server
npx mcp-server-date
```

### MCP Tools

#### resolve_date

Converts relative date expressions to absolute dates.

```typescript
// Parameters
{
  "expression": string;  // Date expression (e.g., 'today', 'tomorrow', '3 days later')
  "timezone"?: string;   // Timezone (e.g., 'UTC', 'Asia/Tokyo')
}

// Response
{
  "content": [
    {
      "type": "text",
      "text": JSON.stringify({
        "success": boolean,
        "date"?: string,        // YYYY-MM-DD format
        "timezone"?: string,
        "error"?: string,
        "confidence": number    // 0-1
      })
    }
  ]
}
```

#### set_timezone

Sets the default timezone for date resolution.

```typescript
// Parameters
{
  "timezone": string;  // Timezone to set (e.g., 'UTC', 'Asia/Tokyo')
}

// Response
{
  "content": [
    {
      "type": "text",
      "text": JSON.stringify({
        "success": boolean,
        "message"?: string,
        "error"?: string
      })
    }
  ]
}
```

### As Library

```typescript
import { DateServer } from "@modelcontextprotocol/mcp-server-date";

const server = new DateServer();

const result = server.resolve({
  expression: "tomorrow",
  timezone: "Asia/Tokyo",
});

console.log(result);
// {
//   success: true,
//   date: '2024-03-26',
//   timezone: 'Asia/Tokyo',
//   confidence: 1.0
// }
```

## Supported Date Expressions

### Basic Expressions

- `today`
- `tomorrow`
- `yesterday`
- `this week`
- `next week`
- `last week`
- `this month`
- `next month`
- `last month`

### Relative Expressions

- `N days ago` (e.g., "3 days ago")
- `N days later` (e.g., "3 days later")
- `N weeks ago` (e.g., "2 weeks ago")
- `N weeks later` (e.g., "2 weeks later")
- `N months ago` (e.g., "1 month ago")
- `N months later` (e.g., "1 month later")

## Configuration

Environment Variables:

| Variable  | Description      | Default |
| --------- | ---------------- | ------- |
| TIME_ZONE | Default timezone | UTC     |

## Development

### Requirements

- Node.js 18.0.0+
- npm 9.0.0+

### Dependencies

- @modelcontextprotocol/sdk
- date-fns
- date-fns-tz
- zod

### Setup

```bash
# Install packages
npm install

# Start development server
npm run dev

# Build
npm run build

# Start production server
npm run start
```

## License

MIT
