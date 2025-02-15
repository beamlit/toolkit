"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctions = exports.retrieveWrapperFunction = exports.parametersToZodSchema = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const zod_1 = __importDefault(require("zod"));
const chain_js_1 = require("../agents/chain.js");
const authentication_js_1 = require("../authentication/authentication.js");
const logger_js_1 = require("../common/logger.js");
const settings_js_1 = require("../common/settings.js");
const run_js_1 = require("../run.js");
const local_js_1 = require("./local.js");
const remote_js_1 = require("./remote.js");
/**
 * Converts an array of `StoreFunctionParameter` objects into a Zod schema for validation.
 *
 * @param {StoreFunctionParameter[]} parameters - The parameters to convert.
 * @returns {z.ZodObject<any>} A Zod object schema representing the parameters.
 */
const parametersToZodSchema = (parameters) => {
    const shape = {};
    parameters
        .filter((param) => param.name)
        .forEach((param) => {
        let zodType;
        switch (param.type) {
            case "boolean":
                zodType = zod_1.default.boolean();
                break;
            case "number":
                zodType = zod_1.default.number();
                break;
            default:
                zodType = zod_1.default.string();
        }
        if (param.description) {
            zodType = zodType.describe(param.description);
        }
        shape[param?.name || ""] = param.required ? zodType : zodType.optional();
    });
    return zod_1.default.object(shape);
};
exports.parametersToZodSchema = parametersToZodSchema;
/**
 * Recursively retrieves and wraps functions from the specified directory.
 *
 * @param {string} dir - The directory to scan for function files.
 * @param {boolean} warning - Whether to log warnings on import errors.
 * @returns {Promise<FunctionBase[]>} An array of wrapped `FunctionBase` objects.
 */
const retrieveWrapperFunction = async (dir, warning) => {
    const functions = [];
    const entries = fs_1.default.readdirSync(dir, { withFileTypes: true });
    const modules = [];
    for (const entry of entries) {
        const fullPath = path_1.default.join(dir, entry.name);
        if (entry.isDirectory()) {
            functions.push(...(await (0, exports.retrieveWrapperFunction)(fullPath, warning)));
        }
        else if (entry.name.endsWith(".ts") || entry.name.endsWith(".js")) {
            try {
                const modulePath = `${path_1.default.resolve(fullPath)}`;
                const moduleName = modulePath.replace(".ts", "").replace(".js", "");
                if (modules.includes(moduleName)) {
                    continue;
                }
                modules.push(moduleName);
                const module = require(moduleName); // eslint-disable-line
                for (const exportedItem of Object.values(module)) {
                    const functionBase = (await exportedItem);
                    if (functionBase?.tools) {
                        functions.push(functionBase);
                    }
                }
            }
            catch (error) {
                if (warning) {
                    logger_js_1.logger.warn(`Error importing function from ${fullPath}: ${error}`);
                }
            }
        }
    }
    return functions;
};
exports.retrieveWrapperFunction = retrieveWrapperFunction;
/**
 * Aggregates available functions based on provided options, including remote functions and agent chains.
 *
 * @param {GetFunctionsOptions} [options={}] - Configuration options for retrieving functions.
 * @returns {Promise<StructuredTool[]>} An array of structured tools representing available functions.
 */
const getFunctions = async (options = {}) => {
    const settings = (0, settings_js_1.getSettings)();
    let { client, dir } = options;
    const { warning } = options;
    const { remoteFunctions, chain, localFunctions } = options;
    if (!client) {
        client = (0, authentication_js_1.newClient)();
    }
    if (!dir) {
        dir = settings.agent.functionsDirectory;
    }
    const functions = [];
    if (dir && fs_1.default.existsSync(dir)) {
        logger_js_1.logger.info(`Importing functions from ${dir}`);
        const functionsBeamlit = await (0, exports.retrieveWrapperFunction)(dir, warning ?? false);
        functionsBeamlit.forEach((func) => {
            functions.push(...func.tools);
        });
    }
    if (remoteFunctions) {
        await Promise.all(remoteFunctions.map(async (name) => {
            try {
                const toolkit = new remote_js_1.RemoteToolkit(client, name);
                await toolkit.initialize();
                functions.push(...(await toolkit.getTools()));
            }
            catch (error) {
                logger_js_1.logger.warn(`Failed to initialize remote function ${name}: ${error}`);
            }
        }));
    }
    if (chain) {
        const runClient = new run_js_1.RunClient(client);
        const toolkit = new chain_js_1.ChainToolkit(runClient, chain);
        await toolkit.initialize();
        functions.push(...toolkit.getTools());
    }
    if (localFunctions) {
        await Promise.all(localFunctions.map(async (func) => {
            const toolkit = new local_js_1.LocalToolkit(client, func.name, func.url);
            await toolkit.initialize(func.name);
            functions.push(...(await toolkit.getTools()));
        }));
    }
    return functions;
};
exports.getFunctions = getFunctions;
