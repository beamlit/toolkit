import { ChatOpenAI } from "@langchain/openai";
/**
 * Extends the ChatOpenAI class to create a ChatXAI agent with additional configurations.
 */
export declare class ChatXAI extends ChatOpenAI {
    /**
     * Returns the name of the class for LangChain serialization.
     * @returns The class name as a string.
     */
    static lc_name(): string;
    /**
     * Specifies the type of the language model.
     * @returns The type of the LLM as a string.
     */
    _llmType(): string;
    /**
     * Specifies the secrets required for serialization.
     * @returns An object mapping secret names to their keys.
     */
    get lc_secrets(): {
        apiKey: string;
    };
    /**
     * Constructs a new ChatXAI instance.
     * @param fields - Configuration fields, including the API key.
     * @throws If the API key is not provided.
     */
    constructor(fields: any);
    /**
     * Serializes the instance to JSON, removing sensitive information.
     * @returns The serialized JSON object.
     */
    toJSON(): import("@langchain/core/dist/load/serializable").Serialized;
    /**
     * Retrieves parameters for LangChain based on provided options.
     * @param options - Additional options for parameter retrieval.
     * @returns An object containing LangChain parameters.
     */
    getLsParams(options: any): import("@langchain/core/language_models/chat_models").LangSmithParams;
}
