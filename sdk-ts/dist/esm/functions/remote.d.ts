import { Client } from "@hey-api/client-fetch";
import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { RunClient } from "../run.js";
/**
 * Creates a StructuredTool for remote functions, enabling their invocation via the RunClient.
 *
 * @param {RunClient} client - The client instance used to execute the function.
 * @param {string} name - The name of the remote function.
 * @param {string} description - A description of what the function does.
 * @param {z.ZodType} schema - The Zod schema for the function's input parameters.
 * @returns {StructuredTool} The structured tool representing the remote function.
 */
export declare function getRemoteTool(client: RunClient, name: string, description: string, schema: z.ZodType): import("@langchain/core/tools").DynamicStructuredTool<z.ZodType<any, z.ZodTypeDef, any>>;
/**
 * Toolkit for managing and interacting with remote toolkits and MCP services.
 */
export declare class RemoteToolkit {
    private client;
    private modelContextProtocolClient;
    private _mcpToolkit;
    private fallbackUrl;
    private functionName;
    private _function;
    private runClient;
    private settings;
    /**
     * Creates an instance of RemoteToolkit.
     *
     * @param {Client} client - The HTTP client instance.
     * @param {string} functionName - The name of the remote function to manage.
     */
    constructor(client: Client, functionName: string);
    /**
     * Initializes the toolkit by retrieving the specified function and its associated tools.
     *
     * @returns {Promise<void>} Resolves when initialization is complete.
     * @throws Will throw an error if the function retrieval fails.
     */
    initialize(): Promise<void>;
    /**
     * Retrieves the list of structured tools from the remote function. If the function has integration connections,
     * it utilizes the MCPToolkit to manage them.
     *
     * @returns {Promise<StructuredTool[]>} An array of structured tools.
     * @throws Will throw an error if the toolkit has not been initialized.
     */
    getTools(): Promise<StructuredTool[]>;
}
