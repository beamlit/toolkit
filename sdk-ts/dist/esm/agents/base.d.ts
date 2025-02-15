import { FastifyRequest } from "fastify";
import { Agent } from "../client/types.gen.js";
/**
 * A variadic callback function type for agents.
 * @param args - The arguments passed to the function.
 * @returns The result of the callback function.
 */
export type CallbackFunctionAgentVariadic = (...args: any[]) => any;
/**
 * Represents a function that runs with a Fastify request.
 * @param request - The incoming Fastify request.
 * @returns A promise resolving to any type.
 */
export type FunctionRun = (request: FastifyRequest) => Promise<any>;
/**
 * Represents a function that runs with a WebSocket and Fastify request, returning an async generator.
 * @param ws - The WebSocket instance.
 * @param request - The incoming Fastify request.
 * @returns A promise resolving to an async generator of any type.
 */
export type FunctionRunStream = (ws: WebSocket, request: FastifyRequest) => Promise<AsyncGenerator<any>>;
/**
 * A type for wrapping agent functions.
 * @param func - The callback function to wrap.
 * @param options - Optional agent configuration options.
 * @returns A promise resolving to an AgentBase object.
 */
export type WrapAgentType = (func: CallbackFunctionAgentVariadic, options?: AgentOptions) => Promise<AgentBase>;
/**
 * Represents the base structure of an agent.
 */
export type AgentBase = {
    run: FunctionRun | FunctionRunStream;
    agent: Agent | null;
    stream?: boolean;
    remoteFunctions?: string[];
};
/**
 * Configuration options for wrapping agents.
 */
export type AgentOptions = {
    agent?: Agent;
    overrideAgent?: any;
    overrideModel?: any;
    remoteFunctions?: string[];
};
/**
 * Wraps a callback function into an AgentBase, configuring it based on the provided options and settings.
 * @param func - The callback function to wrap.
 * @param options - Optional agent configuration options.
 * @returns A promise resolving to an AgentBase object.
 */
export declare const wrapAgent: WrapAgentType;
