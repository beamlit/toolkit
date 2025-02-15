import { FastifyRequest } from "fastify";
/**
 * Retrieves the default thread identifier from the Fastify request.
 * @param request - The incoming Fastify request.
 * @returns The thread identifier as a string.
 */
export declare function getDefaultThread(request: FastifyRequest): string;
