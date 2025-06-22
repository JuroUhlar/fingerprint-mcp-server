# Fingerprint MCP Servers

[MCP Servers](https://modelcontextprotocol.io/introduction) enabling AI assistants to interact with Fingerprint's ([fingerprint.com](https://fingerprint.com)) server-side APIs:

* [Server API MCP Server](./server-api-mcp-server) — search and update visitor identification events.
* [Management API MCP Server](./management-api-mcp-server) — manage your Fingerprint workspace (API keys, environments, filtering rule)

## Server API MCP Server

This MCP Server enables AI assistants to interact with Fingerprint's [Server API](https://dev.fingerprint.com/reference/server-api).

### Setup

You will need to know the [Secret API key](https://dev.fingerprint.com/docs/quick-start-guide#2-get-your-api-key) and [region](https://dev.fingerprint.com/docs/regions) of your Fingerprint workspace.

Next, configure your [MCP client](https://modelcontextprotocol.io/clients) (such as Cursor, ChatGPT, etc.) to use this server. Most MCP clients store the configuration as JSON in the following format:

```json
{
  "mcpServers": {
    "fingerprint-server-api": {
      "command": "npx tsx",
      "args": ["./src/index.ts"],
      "env": {
        "FINGERPRINT_SERVER_API_KEY": "<YOUR_SECRET_API_KEY>",
        "FINGERPRINT_SERVER_API_REGION": "<YOUR_REGION>"
      }
    }
  }
}
```


## Management API MCP Server

TBD


