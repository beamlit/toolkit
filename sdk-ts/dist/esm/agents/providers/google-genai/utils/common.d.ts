import { EnhancedGenerateContentResponse, Content, Part, type FunctionDeclarationsTool as GoogleGenerativeAIFunctionDeclarationsTool, POSSIBLE_ROLES } from "@google/generative-ai";
import { BaseMessage, UsageMetadata } from "@langchain/core/messages";
import { ChatGenerationChunk, ChatResult } from "@langchain/core/outputs";
import { GoogleGenerativeAIToolType } from "../types.js";
export declare function getMessageAuthor(message: BaseMessage): string;
/**
 * Maps a message type to a Google Generative AI chat author.
 * @param message The message to map.
 * @param model The model to use for mapping.
 * @returns The message type mapped to a Google Generative AI chat author.
 */
export declare function convertAuthorToRole(author: string): (typeof POSSIBLE_ROLES)[number];
export declare function convertMessageContentToParts(message: BaseMessage, isMultimodalModel: boolean): Part[];
export declare function convertBaseMessagesToContent(messages: BaseMessage[], isMultimodalModel: boolean, convertSystemMessageToHumanContent?: boolean): Content[];
export declare function mapGenerateContentResultToChatResult(response: EnhancedGenerateContentResponse, extra?: {
    usageMetadata: UsageMetadata | undefined;
}): ChatResult;
export declare function convertResponseContentToChatGenerationChunk(response: EnhancedGenerateContentResponse, extra: {
    usageMetadata?: UsageMetadata | undefined;
    index: number;
}): ChatGenerationChunk | null;
export declare function convertToGenerativeAITools(tools: GoogleGenerativeAIToolType[]): GoogleGenerativeAIFunctionDeclarationsTool[];
