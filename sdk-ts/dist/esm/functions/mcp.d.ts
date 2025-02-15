import { StructuredTool } from "@langchain/core/tools";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { ListToolsResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
/**
 * Creates a StructuredTool for MCP tools based on their specifications.
 *
 * @param {MCPClient} client - The MCP client instance.
 * @param {string} name - The name of the tool.
 * @param {string} description - A description of the tool.
 * @param {z.ZodType} schema - The Zod schema for the tool's input.
 * @returns {StructuredTool} The structured tool instance.
 */
export declare function getMCPTool(client: MCPClient, name: string, description: string, schema: z.ZodType): import("@langchain/core/tools").DynamicStructuredTool<z.ZodType<any, z.ZodTypeDef, any>>;
/**
 * Client for interacting with MCP (Model Context Protocol) services.
 */
export declare class MCPClient {
    private client;
    /**
     * Creates an instance of MCPClient.
     *
     * @param {Client} client - The Model Context Protocol client instance.
     */
    constructor(client: Client);
    /**
     * Retrieves a list of available tools from the MCP service.
     *
     * @returns {Promise<ListToolsResult>} The result containing the list of tools.
     * @throws Will throw an error if the request fails.
     */
    listTools(): Promise<ListToolsResult>;
    /**
     * Calls a specific tool with provided arguments.
     *
     * @param {string} toolName - The name of the tool to invoke.
     * @param {any} args - Arguments to pass to the tool.
     * @returns {Promise<any>} The result from the tool invocation.
     * @throws Will throw an error if the call fails or if the tool returns an error.
     */
    callTool(toolName: string, args: any): Promise<any>;
}
/**
 * Toolkit for managing and interacting with MCP tools.
 */
export declare class MCPToolkit {
    private client;
    private _tools;
    /**
     * Creates an instance of MCPToolkit.
     *
     * @param {MCPClient} client - The MCP client instance.
     */
    constructor(client: MCPClient);
    /**
     * Initializes the toolkit by retrieving the list of available tools.
     *
     * @returns {Promise<void>} Resolves when initialization is complete.
     */
    initialize(): Promise<void>;
    /**
     * Retrieves the list of structured tools managed by the toolkit.
     *
     * @returns {Promise<StructuredTool[]>} An array of structured tools.
     * @throws Will throw an error if the toolkit has not been initialized.
     */
    getTools(): Promise<StructuredTool[]>;
}
