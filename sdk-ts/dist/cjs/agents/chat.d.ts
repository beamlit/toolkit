import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { Model } from "../client/types.gen.js";
import { OpenAIVoiceReactAgent } from "./voice/openai.js";
/**
 * Retrieves the chat model and its details based on the provided name and agent model.
 * @param name - The name of the model.
 * @param agentModel - Optional Model object to override the default.
 * @returns An object containing the chat model, provider, and model name.
 */
export declare function getChatModel(name: string, agentModel?: Model): Promise<OpenAIVoiceReactAgent | BaseChatModel<import("@langchain/core/language_models/chat_models.js").BaseChatModelCallOptions, import("@langchain/core/messages.js").AIMessageChunk>>;
/**
 * Retrieves the full chat model details, including the provider and model configuration.
 * @param name - The name of the model.
 * @param agentModel - Optional Model object to override the default.
 * @returns An object containing the chat model, provider, and model name.
 */
export declare function getChatModelFull(name: string, agentModel?: Model): Promise<{
    chat: BaseChatModel | OpenAIVoiceReactAgent;
    provider: string;
    model: string;
}>;
