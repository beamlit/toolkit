"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newClientFromSettings = newClientFromSettings;
exports.newClient = newClient;
exports.newClientWithCredentials = newClientWithCredentials;
exports.getAuthenticationHeaders = getAuthenticationHeaders;
const client_fetch_1 = require("@hey-api/client-fetch");
const settings_js_1 = require("../common/settings.js");
const apikey_js_1 = require("./apikey.js");
const clientcredentials_js_1 = require("./clientcredentials.js");
const credentials_js_1 = require("./credentials.js");
const deviceMode_js_1 = require("./deviceMode.js");
const cache_js_1 = require("../common/cache.js");
/**
 * Handles public authentication when no credentials are provided.
 */
class PublicAuth {
    /**
     * Retrieves the authentication headers. For public access, returns an empty record.
     * @returns A promise resolving to an empty headers object.
     */
    async getHeaders() {
        return {};
    }
    /**
     * Intercepts a request without modifying it, as public access requires no headers.
     */
    intercept() { }
}
/**
 * Creates a new client based on the provided settings.
 * @param settings - The current application settings.
 * @returns A new client instance.
 */
function newClientFromSettings(settings) {
    const credentials = (0, credentials_js_1.loadCredentialsFromSettings)(settings);
    const clientConfig = {
        credentials,
        workspace: settings.workspace,
    };
    return newClientWithCredentials(clientConfig);
}
/**
 * Retrieves the client configuration based on the current context.
 * @returns The client configuration object.
 */
function getClientConfig() {
    const context = (0, credentials_js_1.currentContext)();
    let clientConfig;
    if (context.workspace) {
        const credentials = (0, credentials_js_1.loadCredentials)(context.workspace);
        clientConfig = {
            credentials,
            workspace: context.workspace,
        };
    }
    else {
        const settings = (0, settings_js_1.getSettings)();
        const credentials = (0, credentials_js_1.loadCredentialsFromSettings)(settings);
        clientConfig = {
            credentials,
            workspace: settings.workspace,
        };
    }
    return clientConfig;
}
/**
 * Creates a new client using the current client configuration.
 * @returns A new client instance.
 */
function newClient() {
    const clientConfig = getClientConfig();
    const client = newClientWithCredentials(clientConfig);
    return client;
}
let providerInstance = null;
/**
 * Determines the appropriate authentication provider based on the client configuration.
 * @param config - The client configuration.
 * @returns An instance of an authentication provider.
 */
function getProvider(config) {
    if (providerInstance) {
        return providerInstance;
    }
    let provider;
    const settings = (0, settings_js_1.getSettings)();
    if (config.credentials.apiKey) {
        provider = new apikey_js_1.ApiKeyAuth(config.credentials, config.workspace);
    }
    else if (config.credentials.access_token ||
        config.credentials.refresh_token) {
        provider = new deviceMode_js_1.BearerToken(config.credentials, config.workspace, settings.baseUrl);
    }
    else if (config.credentials.client_credentials) {
        provider = new clientcredentials_js_1.ClientCredentials(config.credentials, config.workspace, settings.baseUrl);
    }
    else {
        provider = new PublicAuth();
    }
    providerInstance = provider;
    return provider;
}
/**
 * Creates a new client with the specified credentials.
 * @param config - The client configuration.
 * @returns A new client instance.
 */
function newClientWithCredentials(config) {
    const settings = (0, settings_js_1.getSettings)();
    const provider = getProvider(config);
    return (0, client_fetch_1.createClient)((0, client_fetch_1.createConfig)({
        baseUrl: settings.baseUrl,
        fetch: async (req) => {
            const cache = await (0, cache_js_1.handleControlplaneCache)(req);
            if (cache) {
                return cache;
            }
            const headers = await provider.getHeaders();
            Object.entries(headers).forEach(([key, value]) => {
                req.headers.set(key, value);
            });
            return fetch(req);
        },
    }));
}
/**
 * Retrieves the authentication headers for the current client configuration.
 * @returns A promise resolving to a record of header key-value pairs.
 */
async function getAuthenticationHeaders() {
    const clientConfig = getClientConfig();
    const provider = getProvider(clientConfig);
    return await provider.getHeaders();
}
