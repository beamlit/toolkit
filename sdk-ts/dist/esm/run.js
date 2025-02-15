"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunClient = void 0;
const authentication_js_1 = require("./authentication/authentication.js");
const error_js_1 = require("./common/error.js");
const settings_js_1 = require("./common/settings.js");
/**
 * Client for executing run operations against the Hey API.
 * This client handles authentication, path construction, and error handling
 * for resource-based operations.
 */
class RunClient {
    client;
    /**
     * Creates an instance of RunClient.
     * @param {Client} client - The HTTP client used to make requests
     */
    constructor(client) {
        this.client = client;
    }
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
    async run(options) {
        const settings = (0, settings_js_1.getSettings)();
        let headers = options.headers || {};
        const params = options.params || {};
        const authHeaders = await (0, authentication_js_1.getAuthenticationHeaders)();
        headers = { ...headers, ...authHeaders };
        // Build the path
        let path;
        const resourceType = options.resourceType.toLowerCase();
        const pluralResourceType = resourceType.endsWith("s")
            ? resourceType
            : `${resourceType}s`;
        if (options.path) {
            path = `${settings.workspace}/${pluralResourceType}/${options.resourceName}/${options.path}`;
        }
        else {
            path = `${settings.workspace}/${pluralResourceType}/${options.resourceName}`;
        }
        // Try internal URL first if available
        const serviceEnvVar = `BL_${options.resourceType.toUpperCase()}_${toEnvVar(options.resourceName)}_SERVICE_NAME`;
        if (process.env[serviceEnvVar]) {
            try {
                const internalUrl = `https://${process.env[serviceEnvVar]}.${settings.runInternalHostname}`;
                const internalPath = options.path || "";
                const { response, data } = await this.client.request({
                    baseUrl: internalUrl,
                    url: internalPath,
                    method: options.method,
                    body: options.json || options.data,
                    query: params,
                    headers,
                });
                if (response.status < 400) {
                    return data;
                }
            }
            catch {
                // Silently fall through to external URL if internal fails
            }
        }
        // Fall back to external URL
        const { response, data } = await this.client.request({
            baseUrl: settings.runUrl,
            url: path,
            method: options.method,
            body: options.json || options.data,
            query: { ...params },
            headers,
        });
        if (response.status >= 400) {
            throw new error_js_1.HTTPError(response.status, JSON.stringify(data));
        }
        return data;
    }
}
exports.RunClient = RunClient;
function toEnvVar(name) {
    return name.replace(/-/g, "_").toUpperCase();
}
