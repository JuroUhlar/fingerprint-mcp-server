#!/usr/bin/env node
// @ts-check

import { OpenAPIServer } from "@ivotoby/openapi-mcp-server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getBaseUrl, getServerAPIKey } from "./fp-utils.js";

const OPEN_API_SPEC_URL =
  "https://fingerprintjs.github.io/fingerprint-pro-server-api-openapi/schemas/fingerprint-server-api.yaml";

/**
 * Basic example of using mcp-openapi-server as a library
 * This creates a dedicated MCP server for a specific API
 */
async function main() {
  try {
    // Configure your API server
    const config = {
      name: "Fingerprint Server API MCP Server",
      version: "1.0.0",
      apiBaseUrl: getBaseUrl(),
      openApiSpec: OPEN_API_SPEC_URL,
      specInputMethod: "url",
      headers: {
        "Auth-API-Key": getServerAPIKey(),
        "User-Agent": "Fingerprint Server API MCP Server",
      },
      transportType: "stdio",
      toolsMode: "all",
    };

    // Create and start the server
    const server = new OpenAPIServer(config);
    const transport = new StdioServerTransport();

    await server.start(transport);
    console.error("My API MCP Server running on stdio");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Run the server
main();
