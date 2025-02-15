import { Client } from "@hey-api/client-fetch";
/**
 * Options for executing a run operation.
 * @typedef {Object} RunOptions
 * @property {string} resourceType - The type of resource to operate on
 * @property {string} resourceName - The name of the specific resource
 * @property {('GET'|'POST'|'PUT'|'DELETE'|'PATCH'|'HEAD'|'OPTIONS'|'CONNECT'|'TRACE')} method - HTTP method to use
 * @property {string} [path] - Optional additional path segments
 * @property {Record<string, string>} [headers] - Optional HTTP headers to include
 * @property {Record<string, any>} [json] - Optional JSON payload
 * @property {string} [data] - Optional raw data payload
 * @property {Record<string, string>} [params] - Optional query parameters
 */
export type RunOptions = {
    resourceType: string;
    resourceName: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | "CONNECT" | "TRACE";
    path?: string;
    headers?: Record<string, string>;
    json?: Record<string, any>;
    data?: string;
    params?: Record<string, string>;
};
/**
 * Client for executing run operations against the Hey API.
 * This client handles authentication, path construction, and error handling
 * for resource-based operations.
 */
export declare class RunClient {
    client: Client;
    /**
     * Creates an instance of RunClient.
     * @param {Client} client - The HTTP client used to make requests
     */
    constructor(client: Client);
    /**
     * Executes a run operation against a specified resource.
     *
     * @param {RunOptions} options - The options for the run operation
     * @returns {Promise<any>} The response data from the API
     * @throws {HTTPError} When the API returns a status code >= 400
     *
     * @example
     * const client = new RunClient(httpClient);
     * const result = await client.run({
     *   resourceType: 'function',
     *   resourceName: 'myFunction',
     *   method: 'POST',
     *   json: { key: 'value' }
     * });
     */
    run(options: RunOptions): Promise<unknown>;
}
