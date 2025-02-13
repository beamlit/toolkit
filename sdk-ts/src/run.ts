import { Client } from "@hey-api/client-fetch";
import { getAuthenticationHeaders } from "./authentication/authentication.js";
import { HTTPError } from "./common/error.js";
import { getSettings } from "./common/settings.js";

/**
 * Options for executing a run operation.
 * @typedef {Object} RunOptions
 * @property {string} resourceType - The type of resource to operate on
 * @property {string} resourceName - The name of the specific resource
 * @property {string} environment - The environment to execute the run in
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
  environment: string;
  method:
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH"
    | "HEAD"
    | "OPTIONS"
    | "CONNECT"
    | "TRACE";
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
export class RunClient {
  /**
   * Creates an instance of RunClient.
   * @param {Client} client - The HTTP client used to make requests
   */
  constructor(public client: Client) {}

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
   *   environment: 'production',
   *   method: 'POST',
   *   json: { key: 'value' }
   * });
   */
  async run(options: RunOptions) {
    const settings = getSettings();
    let headers = options.headers || {};
    const params = options.params || {};

    const authHeaders = await getAuthenticationHeaders();
    headers = { ...headers, ...authHeaders };

    // Build the path
    let path;
    const resourceType = options.resourceType.toLowerCase();
    const pluralResourceType = resourceType.endsWith("s")
      ? resourceType
      : `${resourceType}s`;
    if (options.path) {
      path = `${settings.workspace}/${pluralResourceType}/${options.resourceName}/${options.path}`;
    } else {
      path = `${settings.workspace}/${pluralResourceType}/${options.resourceName}`;
    }

    const { response, data } = await this.client.request({
      baseUrl: settings.runUrl,
      url: path,
      method: options.method,
      body: options.json || options.data,
      query: { environment: options.environment, ...params },
      headers,
    });

    if (response.status >= 400) {
      console.log(response);
      console.log({
        baseUrl: settings.runUrl,
        url: path,
        method: options.method,
        body: options.json || options.data,
        query: { environment: options.environment, ...params },
        headers,
      });
      throw new HTTPError(response.status, JSON.stringify(data));
    }
    return data;
  }
}
