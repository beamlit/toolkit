"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultThread = getDefaultThread;
/**
 * Retrieves the default thread identifier from the Fastify request.
 * @param request - The incoming Fastify request.
 * @returns The thread identifier as a string.
 */
function getDefaultThread(request) {
    if (request.headers["x-beamlit-thread-id"]) {
        return request.headers["x-beamlit-thread-id"];
    }
    if (request.headers["thread-id"]) {
        return request.headers["thread-id"];
    }
    return "";
}
