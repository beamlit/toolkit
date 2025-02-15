import { Tool as GenerativeAITool, ToolConfig } from "@google/generative-ai";
import { ToolChoice } from "@langchain/core/language_models/chat_models";
import { GoogleGenerativeAIToolType } from "../types.js";
export declare function convertToolsToGenAI(tools: GoogleGenerativeAIToolType[], extra?: {
    toolChoice?: ToolChoice;
    allowedFunctionNames?: string[];
}): {
    tools: GenerativeAITool[];
    toolConfig?: ToolConfig;
};
