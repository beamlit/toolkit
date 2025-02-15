import { Client } from "@hey-api/client-fetch";
import { StructuredTool } from "@langchain/core/tools";
import z from "zod";
import { AgentChain, StoreFunctionParameter } from "../client/types.gen.js";
import { FunctionBase } from "./base.js";
import { LocalFunction } from "./local.js";
/**
 * Converts an array of `StoreFunctionParameter` objects into a Zod schema for validation.
 *
 * @param {StoreFunctionParameter[]} parameters - The parameters to convert.
 * @returns {z.ZodObject<any>} A Zod object schema representing the parameters.
 */
export declare const parametersToZodSchema: (parameters: StoreFunctionParameter[]) => z.ZodObject<any>;
/**
 * Options for retrieving functions.
 *
 * @typedef {Object} GetFunctionsOptions
 * @property {string[] | null} [remoteFunctions] - List of remote function names to include.
 * @property {AgentChain[] | null} [chain] - Agent chains to include.
 * @property {Client | null} [client] - Optional client instance.
 * @property {string | null} [dir] - Directory to search for functions.
 * @property {boolean} [warning] - Whether to log warnings on errors.
 */
export type GetFunctionsOptions = {
    remoteFunctions?: string[] | null;
    localFunctions?: LocalFunction[] | null;
    chain?: AgentChain[] | null;
    client?: Client | null;
    dir?: string | null;
    warning?: boolean;
};
/**
 * Recursively retrieves and wraps functions from the specified directory.
 *
 * @param {string} dir - The directory to scan for function files.
 * @param {boolean} warning - Whether to log warnings on import errors.
 * @returns {Promise<FunctionBase[]>} An array of wrapped `FunctionBase` objects.
 */
export declare const retrieveWrapperFunction: (dir: string, warning: boolean) => Promise<FunctionBase[]>;
/**
 * Aggregates available functions based on provided options, including remote functions and agent chains.
 *
 * @param {GetFunctionsOptions} [options={}] - Configuration options for retrieving functions.
 * @returns {Promise<StructuredTool[]>} An array of structured tools representing available functions.
 */
export declare const getFunctions: (options?: GetFunctionsOptions) => Promise<StructuredTool<z.ZodObject<any, any, any, any, {
    [x: string]: any;
}>>[]>;
