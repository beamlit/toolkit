"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteToolkit = void 0;
exports.getRemoteTool = getRemoteTool;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const tools_1 = require("@langchain/core/tools");
const sdk_gen_js_1 = require("../client/sdk.gen.js");
const settings_js_1 = require("../common/settings.js");
const run_js_1 = require("../run.js");
const common_js_1 = require("./common.js");
const mcp_js_1 = require("./mcp.js");
const websocket_js_1 = require("./transport/websocket.js");
const authentication_js_1 = require("../authentication/authentication.js");
/**
 * Creates a StructuredTool for remote functions, enabling their invocation via the RunClient.
 *
 * @param {RunClient} client - The client instance used to execute the function.
 * @param {string} name - The name of the remote function.
 * @param {string} description - A description of what the function does.
 * @param {z.ZodType} schema - The Zod schema for the function's input parameters.
 * @returns {StructuredTool} The structured tool representing the remote function.
 */
function getRemoteTool(client, name, description, schema) {
    return (0, tools_1.tool)(async (args) => {
        const data = await client.run({
            resourceType: "function",
            resourceName: name,
            method: "POST",
            json: args,
        });
        return data;
    }, {
        name,
        description,
        schema,
    });
}
/**
 * Toolkit for managing and interacting with remote toolkits and MCP services.
 */
class RemoteToolkit {
    client;
    modelContextProtocolClient;
    _mcpToolkit = null;
    fallbackUrl = null;
    functionName;
    _function = null;
    runClient;
    settings;
    /**
     * Creates an instance of RemoteToolkit.
     *
     * @param {Client} client - The HTTP client instance.
     * @param {string} functionName - The name of the remote function to manage.
     */
    constructor(client, functionName) {
        this.settings = (0, settings_js_1.getSettings)();
        this.client = client;
        this.functionName = functionName;
        this.runClient = new run_js_1.RunClient(client);
        this.modelContextProtocolClient = new index_js_1.Client({
            name: this.settings.name,
            version: "1.0.0"
        }, {
            capabilities: {
                tools: {}
            }
        });
    }
    /**
     * Initializes the toolkit by retrieving the specified function and its associated tools.
     *
     * @returns {Promise<void>} Resolves when initialization is complete.
     * @throws Will throw an error if the function retrieval fails.
     */
    async initialize() {
        if (!this._function) {
            const { response, data } = await (0, sdk_gen_js_1.getFunction)({
                client: this.client,
                path: { functionName: this.functionName },
            });
            if (response.status >= 400) {
                const { data: listData } = await (0, sdk_gen_js_1.listFunctions)({
                    client: this.client,
                });
                const names = listData?.map((f) => f.metadata?.name || "") || [];
                throw new Error(`error ${response.status}. Available functions: ${names.join(", ")}`);
            }
            this._function = data || null;
        }
        if (this._function &&
            this._function.metadata &&
            this._function.spec?.integrationConnections) {
            let url = `${this.settings.runUrl}/${this.settings.workspace}/functions/${this._function.metadata.name}`;
            let transport;
            const headers = await (0, authentication_js_1.getAuthenticationHeaders)();
            const envVar = toEnvVar(this._function.metadata.name || "");
            if (process.env[`BL_FUNCTION_${envVar}_SERVICE_NAME`]) {
                this.fallbackUrl = url;
                url = `https://${process.env[`BL_FUNCTION_${envVar}_SERVICE_NAME`]}.${this.settings.runInternalHostname}`;
                transport = new websocket_js_1.WebSocketClientTransport(new URL(url), {
                    "x-beamlit-authorization": headers?.["X-Beamlit-Authorization"] || "",
                    "x-beamlit-workspace": headers?.["X-Beamlit-Workspace"] || "",
                });
            }
            else {
                transport = new websocket_js_1.WebSocketClientTransport(new URL(url), {
                    "x-beamlit-authorization": headers?.["X-Beamlit-Authorization"] || "",
                    "x-beamlit-workspace": headers?.["X-Beamlit-Workspace"] || "",
                });
            }
            try {
                await this.modelContextProtocolClient.connect(transport);
                const mcpClient = new mcp_js_1.MCPClient(this.modelContextProtocolClient);
                const mcpToolkit = new mcp_js_1.MCPToolkit(mcpClient);
                this._mcpToolkit = mcpToolkit;
                await mcpToolkit.initialize();
            }
            catch {
                if (this.fallbackUrl) {
                    transport = new websocket_js_1.WebSocketClientTransport(new URL(this.fallbackUrl), {
                        "x-beamlit-authorization": headers?.["X-Beamlit-Authorization"] || "",
                        "x-beamlit-workspace": headers?.["X-Beamlit-Workspace"] || "",
                    });
                    await this.modelContextProtocolClient.connect(transport);
                    const mcpClient = new mcp_js_1.MCPClient(this.modelContextProtocolClient);
                    const mcpToolkit = new mcp_js_1.MCPToolkit(mcpClient);
                    this._mcpToolkit = mcpToolkit;
                    try {
                        await mcpToolkit.initialize();
                    }
                    catch {
                        throw new Error("Failed to initialize MCP toolkit");
                    }
                }
                else {
                    throw new Error("Failed to initialize MCP toolkit");
                }
            }
        }
    }
    /**
     * Retrieves the list of structured tools from the remote function. If the function has integration connections,
     * it utilizes the MCPToolkit to manage them.
     *
     * @returns {Promise<StructuredTool[]>} An array of structured tools.
     * @throws Will throw an error if the toolkit has not been initialized.
     */
    async getTools() {
        if (!this._function) {
            throw new Error("Must initialize the toolkit first");
        }
        if (this._mcpToolkit) {
            return this._mcpToolkit.getTools();
        }
        return [
            getRemoteTool(this.runClient, this._function.metadata?.name || "", this._function.spec?.description || "", (0, common_js_1.parametersToZodSchema)(this._function.spec?.parameters || [])),
        ];
    }
}
exports.RemoteToolkit = RemoteToolkit;
function toEnvVar(name) {
    return name.replace(/-/g, "_").toUpperCase();
}
