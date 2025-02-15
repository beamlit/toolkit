"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapFunction = void 0;
const tools_1 = require("@langchain/core/tools");
const settings_js_1 = require("../common/settings.js");
const slugify_js_1 = require("../common/slugify.js");
const index_js_1 = require("../index.js");
const common_js_1 = require("./common.js");
const remote_js_1 = require("./remote.js");
/**
 * Wraps a callback function with additional functionality.
 * @param func - The callback function to wrap.
 * @param options - Optional function options.
 * @returns A promise that resolves to a FunctionBase object.
 */
const wrapFunction = async (func, options = null) => {
    const settings = (0, settings_js_1.getSettings)();
    const client = (0, index_js_1.newClient)();
    const description = options?.function?.spec?.description ?? options?.description ?? "";
    const parameters = options?.parameters ?? options?.function?.spec?.parameters ?? [];
    const functionSpec = {
        description,
        parameters,
        ...(options?.function?.spec ? { ...options.function.spec } : {}),
    };
    const name = (0, slugify_js_1.slugify)(options?.name || options?.function?.metadata?.name || "");
    const functionBeamlit = {
        metadata: {
            name: name || (0, slugify_js_1.slugify)(func.name),
            displayName: options?.function?.metadata?.displayName || name || (0, slugify_js_1.slugify)(func.name),
        },
        spec: functionSpec,
    };
    const zodSchema = (0, common_js_1.parametersToZodSchema)(parameters);
    let toolBeamlit;
    if (settings.remote) {
        const toolkit = new remote_js_1.RemoteToolkit(client, functionBeamlit.metadata?.name || "");
        await toolkit.initialize();
        toolBeamlit = await toolkit.getTools();
    }
    else {
        toolBeamlit = [
            (0, tools_1.tool)(func, {
                name: functionBeamlit.metadata?.name || "",
                description: functionBeamlit.spec?.description || "",
                schema: zodSchema,
            }),
        ];
    }
    return {
        async run(request) {
            const body = await request.body;
            if (func.constructor.name === "AsyncFunction") {
                return await func(body);
            }
            return func(body);
        },
        function: functionBeamlit,
        tools: toolBeamlit,
    };
};
exports.wrapFunction = wrapFunction;
