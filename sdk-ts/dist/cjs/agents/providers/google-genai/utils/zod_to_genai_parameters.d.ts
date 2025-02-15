import { type SchemaType as FunctionDeclarationSchemaType, type FunctionDeclarationSchema as GenerativeAIFunctionDeclarationSchema } from "@google/generative-ai";
import type { z } from "zod";
export interface GenerativeAIJsonSchema extends Record<string, unknown> {
    properties?: Record<string, GenerativeAIJsonSchema>;
    type: FunctionDeclarationSchemaType;
}
export interface GenerativeAIJsonSchemaDirty extends GenerativeAIJsonSchema {
    properties?: Record<string, GenerativeAIJsonSchemaDirty>;
    additionalProperties?: boolean;
}
export declare function removeAdditionalProperties(obj: Record<string, any>): GenerativeAIJsonSchema;
export declare function zodToGenerativeAIParameters(zodObj: z.ZodType<any>): GenerativeAIFunctionDeclarationSchema;
export declare function jsonSchemaToGeminiParameters(schema: Record<string, any>): GenerativeAIFunctionDeclarationSchema;
