"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToolsToGenAI = convertToolsToGenAI;
const generative_ai_1 = require("@google/generative-ai");
const function_calling_1 = require("@langchain/core/utils/function_calling");
const base_1 = require("@langchain/core/language_models/base");
const common_js_1 = require("./common.js");
const zod_to_genai_parameters_js_1 = require("./zod_to_genai_parameters.js");
function convertToolsToGenAI(tools, extra) {
    // Extract function declaration processing to a separate function
    const genAITools = processTools(tools);
    // Simplify tool config creation
    const toolConfig = createToolConfig(genAITools, extra);
    return { tools: genAITools, toolConfig };
}
function processTools(tools) {
    let functionDeclarationTools = [];
    const genAITools = [];
    tools.forEach((tool) => {
        if ((0, function_calling_1.isLangChainTool)(tool)) {
            const [convertedTool] = (0, common_js_1.convertToGenerativeAITools)([
                tool,
            ]);
            if (convertedTool.functionDeclarations) {
                functionDeclarationTools.push(...convertedTool.functionDeclarations);
            }
        }
        else if ((0, base_1.isOpenAITool)(tool)) {
            const { functionDeclarations } = convertOpenAIToolToGenAI(tool);
            if (functionDeclarations) {
                functionDeclarationTools.push(...functionDeclarations);
            }
            else {
                throw new Error("Failed to convert OpenAI structured tool to GenerativeAI tool");
            }
        }
        else {
            genAITools.push(tool);
        }
    });
    const genAIFunctionDeclaration = genAITools.find((t) => "functionDeclarations" in t);
    if (genAIFunctionDeclaration) {
        return genAITools.map((tool) => {
            if (functionDeclarationTools?.length > 0 &&
                "functionDeclarations" in tool) {
                const newTool = {
                    functionDeclarations: [
                        ...(tool.functionDeclarations || []),
                        ...functionDeclarationTools,
                    ],
                };
                // Clear the functionDeclarationTools array so it is not passed again
                functionDeclarationTools = [];
                return newTool;
            }
            return tool;
        });
    }
    return [
        ...genAITools,
        ...(functionDeclarationTools.length > 0
            ? [
                {
                    functionDeclarations: functionDeclarationTools,
                },
            ]
            : []),
    ];
}
function convertOpenAIToolToGenAI(tool) {
    return {
        functionDeclarations: [
            {
                name: tool.function.name,
                description: tool.function.description,
                parameters: (0, zod_to_genai_parameters_js_1.removeAdditionalProperties)(tool.function.parameters),
            },
        ],
    };
}
function createToolConfig(genAITools, extra) {
    if (!genAITools.length || !extra)
        return undefined;
    const { toolChoice, allowedFunctionNames } = extra;
    const modeMap = {
        any: generative_ai_1.FunctionCallingMode.ANY,
        auto: generative_ai_1.FunctionCallingMode.AUTO,
        none: generative_ai_1.FunctionCallingMode.NONE,
    };
    if (toolChoice && ["any", "auto", "none"].includes(toolChoice)) {
        return {
            functionCallingConfig: {
                mode: modeMap[toolChoice] ?? "MODE_UNSPECIFIED",
                allowedFunctionNames,
            },
        };
    }
    if (typeof toolChoice === "string" || allowedFunctionNames) {
        return {
            functionCallingConfig: {
                mode: generative_ai_1.FunctionCallingMode.ANY,
                allowedFunctionNames: [
                    ...(allowedFunctionNames ?? []),
                    ...(toolChoice && typeof toolChoice === "string" ? [toolChoice] : []),
                ],
            },
        };
    }
    return undefined;
}
