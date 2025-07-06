#!/usr/bin/env node
// @ts-check

import { OpenAPIServer } from "@ivotoby/openapi-mcp-server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const BASE_URL = "https://management-api.fpjs.io";
const OPEN_API_SPEC_URL = "https://management-api.fpjs.io/docs-yaml";

function getManagementAPIKey() {
  const managementAPIKey = process.env.FINGERPRINT_MANAGEMENT_API_KEY;
  if (!managementAPIKey) {
    throw new Error("FINGERPRINT_MANAGEMENT_API_KEY is not set");
  }
  return managementAPIKey;
}

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
      apiBaseUrl: BASE_URL,
      openApiSpec: OPEN_API_SPEC_URL,
      specInputMethod: "url",
      // Alternative undocumented way to pass the spec
      // inlineSpecContent: "spec as text",
      // specInputMethod: "inline",
      headers: {
        Authorization: `Bearer ${getManagementAPIKey()}`,
        "X-API-Version": "2024-05-20",
        "User-Agent": "Fingerprint Management API MCP Server",
      },
      transportType: "stdio",
      toolsMode: "all",
    };

    // Create and start the server
    const server = new OpenAPIServer(config);
    const transport = new StdioServerTransport();

    await server.start(transport);
    console.error("Fingerprint Management API MCP Server running on stdio");
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Run the server
main();
