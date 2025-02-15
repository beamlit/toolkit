"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPToolkit = exports.MCPClient = void 0;
exports.getMCPTool = getMCPTool;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
/**
 * Creates a StructuredTool for MCP tools based on their specifications.
 *
 * @param {MCPClient} client - The MCP client instance.
 * @param {string} name - The name of the tool.
 * @param {string} description - A description of the tool.
 * @param {z.ZodType} schema - The Zod schema for the tool's input.
 * @returns {StructuredTool} The structured tool instance.
 */
function getMCPTool(client, name, description, schema) {
    return (0, tools_1.tool)(async (args) => {
        const result = await client.callTool(name, args);
        if (result.isError) {
            throw new Error(JSON.stringify(result.content));
        }
        return JSON.stringify(result.content);
    }, {
        name,
        description,
        schema,
    });
}
/**
 * Client for interacting with MCP (Model Context Protocol) services.
 */
class MCPClient {
    client;
    /**
     * Creates an instance of MCPClient.
     *
     * @param {Client} client - The Model Context Protocol client instance.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Retrieves a list of available tools from the MCP service.
     *
     * @returns {Promise<ListToolsResult>} The result containing the list of tools.
     * @throws Will throw an error if the request fails.
     */
    async listTools() {
        return this.client.listTools();
    }
    /**
     * Calls a specific tool with provided arguments.
     *
     * @param {string} toolName - The name of the tool to invoke.
     * @param {any} args - Arguments to pass to the tool.
     * @returns {Promise<any>} The result from the tool invocation.
     * @throws Will throw an error if the call fails or if the tool returns an error.
     */
    async callTool(toolName, args) {
        return this.client.callTool({
            name: toolName,
            arguments: args,
        });
    }
}
exports.MCPClient = MCPClient;
/**
 * Toolkit for managing and interacting with MCP tools.
 */
class MCPToolkit {
    client;
    _tools = null;
    /**
     * Creates an instance of MCPToolkit.
     *
     * @param {MCPClient} client - The MCP client instance.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Initializes the toolkit by retrieving the list of available tools.
     *
     * @returns {Promise<void>} Resolves when initialization is complete.
     */
    async initialize() {
        if (!this._tools) {
            this._tools = await this.client.listTools();
        }
    }
    /**
     * Retrieves the list of structured tools managed by the toolkit.
     *
     * @returns {Promise<StructuredTool[]>} An array of structured tools.
     * @throws Will throw an error if the toolkit has not been initialized.
     */
    async getTools() {
        if (!this._tools) {
            throw new Error("Must initialize the toolkit first");
        }
        return this._tools.tools.map((tool) => {
            const shape = {};
            if (tool.inputSchema?.properties) {
                if (tool.inputSchema.type === "object") {
                    for (const key in tool.inputSchema.properties) {
                        const property = tool.inputSchema.properties[key];
                        let zodType;
                        switch (property.type) {
                            case "boolean":
                                zodType = zod_1.z.boolean();
                                break;
                            case "number":
                                zodType = zod_1.z.number();
                                break;
                            default:
                                zodType = zod_1.z.string();
                        }
                        if (property.description) {
                            zodType = zodType.describe(property.description);
                        }
                        if (property.default) {
                            zodType = zodType.default(property.default);
                        }
                        shape[key] = property.required ? zodType : zodType.optional();
                    }
                }
            }
            return getMCPTool(this.client, tool.name, tool.description || "", zod_1.z.object(shape));
        });
    }
}
exports.MCPToolkit = MCPToolkit;
