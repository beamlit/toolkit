import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { AgentChain } from "../client/types.gen.js";
import { RunClient } from "../run.js";
/**
 * Creates a chain tool for managing agent chains.
 * @param client - The RunClient instance.
 * @param name - The name of the tool.
 * @param description - A description of the tool.
 * @param schema - The Zod schema for the tool's input.
 * @returns A StructuredTool instance.
 */
export declare function getChainTool(client: RunClient, name: string, description: string, schema: z.ZodType): import("@langchain/core/tools").DynamicStructuredTool<z.ZodType<any, z.ZodTypeDef, any>>;
/**
 * Schema for chain input.
 */
export declare const ChainInputSchema: z.ZodObject<{
    inputs: z.ZodString;
}, "strip", z.ZodTypeAny, {
    inputs: string;
}, {
    inputs: string;
}>;
/**
 * Remote toolkit for managing agent chains
 */
export declare class ChainToolkit {
    private client;
    private chain;
    private _chain;
    /**
     * Initializes the ChainToolkit with a client and a chain configuration.
     * @param client - The RunClient instance.
     * @param chain - An array of AgentChain configurations.
     */
    constructor(client: RunClient, chain: AgentChain[]);
    /**
     * Initializes the session and retrieves the list of tools.
     * @returns A promise that resolves when initialization is complete.
     */
    initialize(): Promise<void>;
    /**
     * Retrieves the list of StructuredTools based on the initialized chain.
     * @returns An array of StructuredTool instances.
     */
    getTools(): StructuredTool[];
}
