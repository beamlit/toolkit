"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalToolkit = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const authentication_js_1 = require("../authentication/authentication.js");
const settings_js_1 = require("../common/settings.js");
const run_js_1 = require("../run.js");
const mcp_js_1 = require("./mcp.js");
const websocket_js_1 = require("./transport/websocket.js");
/**
 * Toolkit for managing and interacting with remote toolkits and MCP services.
 */
class LocalToolkit {
    _client;
    modelContextProtocolClient;
    url;
    _functionName;
    _function = null;
    _runClient;
    settings;
    /**
     * Creates an instance of RemoteToolkit.
     *
     * @param {Client} client - The HTTP client instance.
     * @param {string} functionName - The name of the remote function to manage.
     */
    constructor(client, functionName, url) {
        this.settings = (0, settings_js_1.getSettings)();
        this._client = client;
        this.modelContextProtocolClient = new index_js_1.Client({
            name: this.settings.name,
            version: "1.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this._functionName = functionName;
        this.url = url;
        this._runClient = new run_js_1.RunClient(client);
    }
    /**
     * Initializes the toolkit by retrieving the specified function and its associated tools.
     *
     * @returns {Promise<void>} Resolves when initialization is complete.
     * @throws Will throw an error if the function retrieval fails.
     */
    async initialize(name) {
        this._function = {
            metadata: {
                name: name,
            },
            spec: {
                integrationConnections: [],
            },
        };
        const headers = await (0, authentication_js_1.getAuthenticationHeaders)();
        const transport = new websocket_js_1.WebSocketClientTransport(new URL(this.url), {
            "x-beamlit-authorization": headers?.["X-Beamlit-Authorization"] || "",
            "x-beamlit-workspace": headers?.["X-Beamlit-Workspace"] || "",
        });
        await this.modelContextProtocolClient.connect(transport);
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
        if (this._function.metadata &&
            this._function.spec?.integrationConnections) {
            const mcpClient = new mcp_js_1.MCPClient(this.modelContextProtocolClient);
            const mcpToolkit = new mcp_js_1.MCPToolkit(mcpClient);
            await mcpToolkit.initialize();
            return mcpToolkit.getTools();
        }
        return [];
    }
}
exports.LocalToolkit = LocalToolkit;
