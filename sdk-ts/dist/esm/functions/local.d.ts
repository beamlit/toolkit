import { Client } from "@hey-api/client-fetch";
import { StructuredTool } from "@langchain/core/tools";
export type LocalFunction = {
    name: string;
    description: string;
    url: string;
};
/**
 * Toolkit for managing and interacting with remote toolkits and MCP services.
 */
export declare class LocalToolkit {
    private _client;
    private modelContextProtocolClient;
    private url;
    private _functionName;
    private _function;
    private _runClient;
    private settings;
    /**
     * Creates an instance of RemoteToolkit.
     *
     * @param {Client} client - The HTTP client instance.
     * @param {string} functionName - The name of the remote function to manage.
     */
    constructor(client: Client, functionName: string, url: string);
    /**
     * Initializes the toolkit by retrieving the specified function and its associated tools.
     *
     * @returns {Promise<void>} Resolves when initialization is complete.
     * @throws Will throw an error if the function retrieval fails.
     */
    initialize(name: string): Promise<void>;
    /**
     * Retrieves the list of structured tools from the remote function. If the function has integration connections,
     * it utilizes the MCPToolkit to manage them.
     *
     * @returns {Promise<StructuredTool[]>} An array of structured tools.
     * @throws Will throw an error if the toolkit has not been initialized.
     */
    getTools(): Promise<StructuredTool[]>;
}
