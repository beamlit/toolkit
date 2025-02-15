import { BaseLLMOutputParser } from "@langchain/core/output_parsers";
import { JsonOutputKeyToolsParserParams } from "@langchain/core/output_parsers/openai_tools";
import { ChatGeneration } from "@langchain/core/outputs";
import type { z } from "zod";
interface GoogleGenerativeAIToolsOutputParserParams<T extends Record<string, any>> extends JsonOutputKeyToolsParserParams<T> {
}
export declare class GoogleGenerativeAIToolsOutputParser<T extends Record<string, any> = Record<string, any>> extends BaseLLMOutputParser<T> {
    static lc_name(): string;
    lc_namespace: string[];
    returnId: boolean;
    /** The type of tool calls to return. */
    keyName: string;
    /** Whether to return only the first tool call. */
    returnSingle: boolean;
    zodSchema?: z.ZodType<T>;
    constructor(params: GoogleGenerativeAIToolsOutputParserParams<T>);
    protected _validateResult(result: unknown): Promise<T>;
    parseResult(generations: ChatGeneration[]): Promise<T>;
}
export {};
