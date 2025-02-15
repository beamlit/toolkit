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
                const module = await Promise.resolve(`${`${process.cwd()}/${fullPath}`}`).then(s => __importStar(require(s)));
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
