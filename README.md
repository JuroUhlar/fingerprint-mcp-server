# Fingerprint MCP Servers

[MCP Servers](https://modelcontextprotocol.io/introduction) enabling AI assistants (Cursor, VS Code, Claude Code, etc.) to interact with Fingerprint's ([fingerprint.com](https://fingerprint.com)) server-side APIs:

* [Server API MCP Server](./server-api-mcp-server) — search and update visitor identification events.
* [Management API MCP Server](./management-api-mcp-server) — manage your Fingerprint workspace (API keys, environments, filtering rule)

> [!WARNING]
> This is not an official Fingerprint integration, just a personal exploration and work in progress. Use at your own risk.

## Server API MCP Server

This MCP Server enables AI assistants to interact with Fingerprint's [Server API](https://dev.fingerprint.com/reference/server-api).

### Setup

You will need to know the [Secret API key](https://dev.fingerprint.com/docs/quick-start-guide#2-get-your-api-key) and [region](https://dev.fingerprint.com/docs/regions) of your Fingerprint workspace.

Next, configure your [MCP client](https://modelcontextprotocol.io/clients) (e.g. Cursor, VS Code, etc.) to use this server. Most MCP clients store the configuration as JSON in the following format:

```json
{
  "mcpServers": {
    "fingerprint-server-api": {
      "command": "npx",
      "args": [
        "--yes",
        "--package",
        "jurouhlar/fingerprint-mcp-server",
        "server-api"
      ],
      "env": {
        "FINGERPRINT_SECRET_API_KEY": "YOUR_SECRET_API_KEY",
        "FINGERPRINT_REGION": "YOUR_REGION"
      }
    }
  }
}
```

### Usage examples

* "Analyze the history of this visitor ID and flag suspicious patterns"
* "List all IPs addresses, locations and devices used by this visitor ID"
* "Mark all events using this IP address as suspicious"
* "Delete all data for this visitor ID"

## Management API MCP Server

This MCP Server enables AI assistants to interact with Fingerprint's [Management API](https://dev.fingerprint.com/reference/management-api).

### Setup

You will need to know the [Management API key](https://dev.fingerprint.com/docs/quick-start-guide#2-get-your-api-key) of your Fingerprint workspace.

Next, configure your [MCP client](https://modelcontextprotocol.io/clients) (e.g. Cursor, VS Code, etc.) to use this server. Most MCP clients store the configuration as JSON in the following format:

```json

{
  "mcpServers": {
    "fingerprint-management-api": {
      "command": "npx",
      "args": [
        "--yes",
        "--package",
        "jurouhlar/fingerprint-mcp-server",
        "management-api"
      ],
      "env": {
        "FINGERPRINT_MANAGEMENT_API_KEY": "YOUR_MANAGEMENT_API_KEY"
      }
    }
  }
}
```

### Usage examples

* "Create 3 new Fingerprint workspace environments named 'dev', 'staging' and 'production' and create a Secret API key for each environment"
* "List filtering rules for the 'dev' environment"
* "Create a new filtering rule to block all events from IP address 1.2.3.4"
* "Create a filtering rule to only accept identification events from mywebsite.com"