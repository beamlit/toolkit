"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveWrapperAgent = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const common_1 = require("../common");
/**
 * Recursively retrieves and wraps agents from a specified directory.
 * @param dir - The directory to search for agent files.
 * @param warning - Whether to log warnings on import errors.
 * @returns A promise resolving to an array of AgentBase instances.
 */
const retrieveWrapperAgent = async (dir, warning) => {
    const agents = [];
    const entries = fs_1.default.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path_1.default.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === "node_modules")
                continue;
            const agentResources = await (0, exports.retrieveWrapperAgent)(fullPath, warning);
            agents.push(...agentResources);
        }
        else if (entry.name.endsWith(".ts") || entry.name.endsWith(".js")) {
            try {
                const module = await import(`${process.cwd()}/${fullPath}`);
                for (const exportedItem of Object.values(module)) {
                    if (typeof exportedItem === "function" &&
                        exportedItem.toString().includes("wrapAgent")) {
                        try {
                            const agentBase = (await exportedItem());
                            agents.push(agentBase);
                        }
                        catch {
                            // pass
                        }
                    }
                    else {
                        const agentBase = (await exportedItem);
                        agents.push(agentBase);
                    }
                }
            }
            catch (error) {
                if (warning) {
                    common_1.logger.warn(`Error importing agent from ${fullPath}: ${error}`);
                }
            }
        }
    }
    return agents.filter((agent) => agent.agent);
};
exports.retrieveWrapperAgent = retrieveWrapperAgent;
