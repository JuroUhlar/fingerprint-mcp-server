#!/usr/bin/env node

import { OpenAPIServer } from "@ivotoby/openapi-mcp-server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

function getBaseUrl() {
  const region = process.env.FINGERPRINT_SERVER_API_REGION;
  if (region === "eu") {
    return "https://eu.api.fpjs.io";
  }
  if (region === "ap") {
    return "https://ap.api.fpjs.io";
  }
  return "https://api.fpjs.io";
}

function getServerAPIKey() {
  const serverAPIKey = process.env.FINGERPRINT_SERVER_API_KEY;
  if (!serverAPIKey) {
    throw new Error("FINGERPRINT_SERVER_API_KEY is not set");
  }
  return serverAPIKey;
}

/**
 * Basic example of using mcp-openapi-server as a library
 * This creates a dedicated MCP server for a specific API
 */
async function main(): Promise<void> {
  try {
    // Configure your API server
    const config = {
      name: "Fingerprint Server API MCP Server",
      version: "1.0.0",
      apiBaseUrl: getBaseUrl(),
      openApiSpec:
        "https://fingerprintjs.github.io/fingerprint-pro-server-api-openapi/schemas/fingerprint-server-api.yaml",
      specInputMethod: "url",
      headers: {
        "Auth-API-Key": getServerAPIKey(),
        "User-Agent": "Fingerprint Server API MCP Server",
      },
      transportType: "stdio" as const,
      toolsMode: "all" as const,
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
