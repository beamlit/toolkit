import { FastifyInstance } from "fastify";
import "../common/instrumentation.js";
/**
 * Creates and configures the Fastify application.
 * @param funcDefault - Optional default function to use.
 * @returns A promise that resolves to a FastifyInstance.
 * @throws Will throw an error if the server module fails to import.
 */
export declare function createApp(funcDefault?: any): Promise<FastifyInstance>;
/**
 * Starts the Fastify application.
 * @param app - The Fastify instance to run.
 * @returns A promise that resolves when the server starts listening.
 */
export declare function runApp(app: FastifyInstance): Promise<string>;
