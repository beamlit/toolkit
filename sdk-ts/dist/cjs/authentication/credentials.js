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
exports.listContextWorkspaces = listContextWorkspaces;
exports.currentContext = currentContext;
exports.setCurrentWorkspace = setCurrentWorkspace;
exports.loadCredentials = loadCredentials;
exports.loadCredentialsFromSettings = loadCredentialsFromSettings;
exports.createHomeDirIfMissing = createHomeDirIfMissing;
exports.saveCredentials = saveCredentials;
exports.clearCredentials = clearCredentials;
const fs_1 = require("fs");
const yaml = __importStar(require("js-yaml"));
const os_1 = require("os");
const path_1 = require("path");
const logger_js_1 = require("../common/logger.js");
/**
 * Loads the application configuration from the user's home directory.
 * @returns The loaded configuration object.
 */
function loadConfig() {
    const config = {
        workspaces: [],
        context: {
            workspace: "",
        },
    };
    const homeDir = (0, os_1.homedir)();
    if (homeDir) {
        const configPath = (0, path_1.join)(homeDir, ".beamlit", "config.yaml");
        if ((0, fs_1.existsSync)(configPath)) {
            try {
                const data = yaml.load((0, fs_1.readFileSync)(configPath, "utf8"));
                if (data) {
                    const workspaces = [];
                    for (const ws of data.workspaces || []) {
                        const creds = {
                            apiKey: ws.credentials?.apiKey || "",
                            access_token: ws.credentials?.access_token || "",
                            refresh_token: ws.credentials?.refresh_token || "",
                            expires_in: ws.credentials?.expires_in || 0,
                            device_code: ws.credentials?.device_code || "",
                            client_credentials: ws.credentials?.client_credentials || "",
                        };
                        workspaces.push({ name: ws.name, credentials: creds });
                    }
                    config.workspaces = workspaces;
                    if (data.context) {
                        config.context = data.context;
                    }
                }
            }
            catch {
                // Invalid YAML, use empty config
            }
        }
    }
    return config;
}
/**
 * Saves the application configuration to the user's home directory.
 * @param config - The configuration to save.
 */
function saveConfig(config) {
    const homeDir = (0, os_1.homedir)();
    if (!homeDir) {
        throw new Error("Could not determine home directory");
    }
    const configDir = (0, path_1.join)(homeDir, ".beamlit");
    const configFile = (0, path_1.join)(configDir, "config.yaml");
    (0, fs_1.mkdirSync)(configDir, { recursive: true, mode: 0o700 });
    (0, fs_1.writeFileSync)(configFile, yaml.dump({
        workspaces: config.workspaces.map((ws) => ({
            name: ws.name,
            credentials: {
                apiKey: ws.credentials.apiKey,
                access_token: ws.credentials.access_token,
                refresh_token: ws.credentials.refresh_token,
                expires_in: ws.credentials.expires_in,
                device_code: ws.credentials.device_code,
            },
        })),
        context: config.context,
    }));
}
/**
 * Lists all workspace names in the current context.
 * @returns An array of workspace names.
 */
function listContextWorkspaces() {
    const config = loadConfig();
    return config.workspaces.map((workspace) => workspace.name);
}
/**
 * Retrieves the current context configuration.
 * @returns The current context configuration.
 */
function currentContext() {
    const config = loadConfig();
    return config.context;
}
/**
 * Sets the current workspace in the context.
 * @param workspaceName - The name of the workspace to set.
 */
function setCurrentWorkspace(workspaceName) {
    const config = loadConfig();
    config.context.workspace = workspaceName;
    saveConfig(config);
}
/**
 * Loads the credentials for a specified workspace.
 * @param workspaceName - The name of the workspace.
 * @returns The credentials associated with the workspace.
 */
function loadCredentials(workspaceName) {
    const config = loadConfig();
    const workspace = config.workspaces.find((ws) => ws.name === workspaceName);
    if (workspace) {
        return workspace.credentials;
    }
    return {
        apiKey: "",
        access_token: "",
        refresh_token: "",
        expires_in: 0,
        device_code: "",
        client_credentials: "",
    };
}
/**
 * Loads the credentials from the application settings.
 * @param settings - The application settings.
 * @returns The loaded credentials.
 */
function loadCredentialsFromSettings(settings) {
    return {
        apiKey: settings.authentication?.apiKey || "",
        access_token: settings.authentication?.jwt || "",
        client_credentials: settings.authentication?.clientCredentials || "",
    };
}
/**
 * Ensures the home directory exists, creating it if necessary.
 */
function createHomeDirIfMissing() {
    const homeDir = (0, os_1.homedir)();
    if (!homeDir) {
        logger_js_1.logger.error("Error getting home directory");
        return;
    }
    const credentialsDir = (0, path_1.join)(homeDir, ".beamlit");
    const credentialsFile = (0, path_1.join)(credentialsDir, "credentials.json");
    if ((0, fs_1.existsSync)(credentialsFile)) {
        logger_js_1.logger.warn("You are already logged in. Enter a new API key to overwrite it.");
    }
    else {
        try {
            (0, fs_1.mkdirSync)(credentialsDir, { recursive: true, mode: 0o700 });
        }
        catch (e) {
            logger_js_1.logger.error(`Error creating credentials directory: ${e}`);
        }
    }
}
/**
 * Saves the provided credentials for a specified workspace.
 * @param workspaceName - The name of the workspace.
 * @param credentials - The credentials to save.
 */
function saveCredentials(workspaceName, credentials) {
    createHomeDirIfMissing();
    if (!credentials.access_token && !credentials.apiKey) {
        logger_js_1.logger.info("No credentials to save, error");
        return;
    }
    const config = loadConfig();
    let found = false;
    for (let i = 0; i < config.workspaces.length; i++) {
        if (config.workspaces[i].name === workspaceName) {
            config.workspaces[i].credentials = credentials;
            found = true;
            break;
        }
    }
    if (!found) {
        config.workspaces.push({ name: workspaceName, credentials });
    }
    saveConfig(config);
}
/**
 * Clears the credentials for a specified workspace.
 * @param workspaceName - The name of the workspace.
 */
function clearCredentials(workspaceName) {
    const config = loadConfig();
    config.workspaces = config.workspaces.filter((ws) => ws.name !== workspaceName);
    if (config.context.workspace === workspaceName) {
        config.context.workspace = "";
    }
    saveConfig(config);
}
