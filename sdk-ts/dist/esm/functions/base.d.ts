import { StructuredTool } from "@langchain/core/tools";
import { FastifyRequest } from "fastify";
import { Function, StoreFunctionParameter } from "../client/types.gen.js";
/**
 * A variadic callback function.
 * @param args - Arguments of any type.
 * @returns Any type.
 */
export type CallbackFunctionVariadic = (...args: any[]) => any;
/**
 * Type for wrapping functions with additional options.
 * @param func - The callback function to wrap.
 * @param options - Optional function options.
 * @returns A promise that resolves to a FunctionBase object.
 */
export type WrapFunctionType = (func: CallbackFunctionVariadic, options?: FunctionOptions) => Promise<FunctionBase>;
/**
 * Base structure for a function.
 */
export type FunctionBase = {
    /**
     * Executes the function with the given request.
     * @param request - The Fastify request object.
     * @returns A promise resolving to any type.
     */
    run(request: FastifyRequest): Promise<any>;
    /**
     * The function metadata.
     */
    function: Function;
    /**
     * An array of structured tools associated with the function.
     */
    tools: StructuredTool[];
};
/**
 * Options for configuring a function.
 */
export type FunctionOptions = {
    /**
     * The Function object.
     */
    function?: Function;
    /**
     * The name of the function.
     */
    name?: string;
    /**
     * A description of the function.
     */
    description?: string;
    /**
     * Parameters for the function.
     */
    parameters?: StoreFunctionParameter[];
};
/**
 * Wraps a callback function with additional functionality.
 * @param func - The callback function to wrap.
 * @param options - Optional function options.
 * @returns A promise that resolves to a FunctionBase object.
 */
export declare const wrapFunction: WrapFunctionType;
