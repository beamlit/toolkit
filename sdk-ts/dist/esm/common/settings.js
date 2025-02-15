"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsServer = exports.SettingsAuthentication = exports.SettingsAgent = exports.Settings = void 0;
exports.getSettings = getSettings;
exports.init = init;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("yaml"));
const zod_1 = require("zod");
const credentials_js_1 = require("../authentication/credentials.js");
global.SETTINGS = null;
/**
 * Schema for agent settings.
 */
const SettingsAgent = zod_1.z.object({
    agent: zod_1.z.any().nullable().default(null),
    chain: zod_1.z.array(zod_1.z.any()).nullable().default(null),
    model: zod_1.z.any().nullable().default(null),
    functions: zod_1.z.array(zod_1.z.any()).nullable().default(null),
    functionsDirectory: zod_1.z.string().default("src/functions"),
    chatModel: zod_1.z.any().nullable().default(null),
    module: zod_1.z.string().default("main.main"),
});
exports.SettingsAgent = SettingsAgent;
/**
 * Schema for authentication settings.
 */
const SettingsAuthentication = zod_1.z.object({
    apiKey: zod_1.z.string().nullable().default(null),
    jwt: zod_1.z.string().nullable().default(null),
    clientCredentials: zod_1.z.string().nullable().default(null),
});
exports.SettingsAuthentication = SettingsAuthentication;
/**
 * Schema for server settings.
 */
const SettingsServer = zod_1.z.object({
    module: zod_1.z.string().default("agent.agent"),
    port: zod_1.z.number().default(80),
    host: zod_1.z.string().default("0.0.0.0"),
    directory: zod_1.z.string().default("src"),
});
exports.SettingsServer = SettingsServer;
/**
 * Schema for overall settings.
 */
const Settings = zod_1.z.object({
    workspace: zod_1.z.string(),
    remote: zod_1.z.boolean().default(false),
    type: zod_1.z.string().default("agent"),
    name: zod_1.z.string().default("beamlit-agent"),
    baseUrl: zod_1.z
        .string()
        .regex(/^https?:\/\/[^\s/$.?#].[^\s]*$/, "Invalid URL format")
        .default("https://api.beamlit.com/v0"),
    appUrl: zod_1.z
        .string()
        .regex(/^https?:\/\/[^\s/$.?#].[^\s]*$/, "Invalid URL format")
        .default("https://app.beamlit.com"),
    runUrl: zod_1.z
        .string()
        .regex(/^https?:\/\/[^\s/$.?#].[^\s]*$/, "Invalid URL format")
        .default("https://run.beamlit.com"),
    runInternalHostname: zod_1.z.string().default("internal.run.beamlit.net"),
    registryUrl: zod_1.z
        .string()
        .regex(/^https?:\/\/[^\s/$.?#].[^\s]*$/, "Invalid URL format")
        .default("https://us.registry.beamlit.com"),
    logLevel: zod_1.z.string().default("INFO"),
    enableOpentelemetry: zod_1.z.boolean().default(false),
    agent: SettingsAgent.default({ chain: null, functions: null }),
    server: SettingsServer.default({}),
    authentication: SettingsAuthentication.default({
        apiKey: null,
        jwt: null,
        clientCredentials: null,
    }),
    deploy: zod_1.z.boolean().default(false),
});
exports.Settings = Settings;
/**
 * Retrieves the current settings, initializing if not already done.
 * @returns The current settings object.
 */
function getSettings() {
    if (!global.SETTINGS) {
        global.SETTINGS = init();
    }
    return global.SETTINGS;
}
/**
 * Parses an environment variable value to its appropriate type.
 * @param value - The environment variable value as a string.
 * @returns The parsed value as boolean, number, or string.
 */
function parseEnv(value) {
    if (value.toLowerCase() === "true") {
        return true;
    }
    else if (value.toLowerCase() === "false") {
        return false;
    }
    else {
        const numberValue = Number(value);
        if (!isNaN(numberValue)) {
            return numberValue;
        }
        return value;
    }
}
/**
 * Handles nested environment variable settings.
 * @param envData - The current environment data object.
 * @param settingKey - The key of the setting.
 * @param value - The value of the environment variable.
 * @param nestedKey - The nested key within the settings.
 * @returns The updated nested environment data.
 */
function handleNestedEnvironment(envData, settingKey, value, nestedKey) {
    const key = (settingKey
        .replace(nestedKey, "")
        .split("_")
        .join("")
        .charAt(0)
        .toLowerCase() +
        settingKey.replace(nestedKey, "").split("_").join("").slice(1));
    if (!envData[nestedKey]) {
        envData[nestedKey] = {};
    }
    if (envData[nestedKey] && key) {
        envData[nestedKey][key] = parseEnv(value);
    }
    return envData[nestedKey];
}
/**
 * Initializes the settings by merging configurations from YAML, environment variables, and options.
 * @param options - Optional settings to override defaults.
 * @returns The initialized settings object.
 */
function init(options = {}) {
    // Try to read beamlit.yaml from current directory
    let yamlData = {};
    try {
        const yamlFile = fs.readFileSync(path.join(process.cwd(), "beamlit.yaml"), "utf8");
        yamlData = yaml.parse(yamlFile);
    }
    catch {
        // Do nothing it is not a problem
    }
    // Process environment variables
    const envData = {};
    for (const [key, value] of Object.entries(process.env)) {
        if (key.startsWith("BL_") && value !== undefined) {
            const settingKey = key
                .slice(3) // Remove BL_ prefix
                .toLowerCase()
                .split("_")
                .map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1))
                .join("");
            if (settingKey.startsWith("authentication")) {
                envData.authentication = handleNestedEnvironment(envData, settingKey, value, "authentication");
            }
            else if (settingKey.startsWith("agent")) {
                envData.agent = handleNestedEnvironment(envData, settingKey, value, "agent");
            }
            else if (settingKey.startsWith("server")) {
                envData.server = handleNestedEnvironment(envData, settingKey, value, "server");
            }
            else {
                envData[settingKey] = parseEnv(value);
            }
        }
    }
    // Special handling for dev environment
    if (process.env.BL_ENV === "dev") {
        envData.baseUrl = process.env.BL_BASE_URL || "https://api.beamlit.dev/v0";
        envData.runUrl = process.env.BL_RUN_URL || "https://run.beamlit.dev";
        envData.registryUrl =
            process.env.BL_REGISTRY_URL || "https://eu.registry.beamlit.dev";
        envData.appUrl = process.env.BL_APP_URL || "https://app.beamlit.dev";
    }
    const context = (0, credentials_js_1.currentContext)();
    // Merge configurations with precedence: options > env > yaml
    global.SETTINGS = Settings.parse({
        workspace: context.workspace,
        ...yamlData,
        ...envData,
        ...options,
        authentication: {
            ...yamlData.authentication,
            ...envData.authentication,
            ...options.authentication,
        },
        server: {
            ...yamlData.server,
            ...envData.server,
            ...options.server,
        },
        agent: {
            ...yamlData.agent,
            ...envData.agent,
            ...options.agent,
        },
    });
    return global.SETTINGS;
}
