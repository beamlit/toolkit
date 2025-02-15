"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
exports.runApp = runApp;
const websocket_1 = __importDefault(require("@fastify/websocket"));
const async_hooks_1 = require("async_hooks");
const fastify_1 = require("fastify");
const http_1 = require("http");
const uuid_1 = require("uuid");
const error_js_1 = require("../common/error.js");
require("../common/instrumentation.js"); // Ensure instrumentation is initialized
const logger_js_1 = require("../common/logger.js");
const module_js_1 = require("../common/module.js");
const settings_js_1 = require("../common/settings.js");
/**
 * Creates and configures the Fastify application.
 * @param funcDefault - Optional default function to use.
 * @returns A promise that resolves to a FastifyInstance.
 * @throws Will throw an error if the server module fails to import.
 */
async function createApp(funcDefault = null) {
    const app = (0, fastify_1.fastify)();
    const asyncLocalStorage = new async_hooks_1.AsyncLocalStorage();
    const settings = (0, settings_js_1.init)();
    logger_js_1.logger.info(`Importing server module: ${settings.server.module}`);
    let func = funcDefault || (0, module_js_1.importModule)();
    if (!func) {
        throw new Error(`Failed to import server module from ${settings.server.module}`);
    }
    // Check if function accepts request as first parameter
    const funcParams = func
        .toString()
        .match(/\((.*?)\)/)?.[1]
        .split(",")
        .map((p) => p.trim());
    if (!funcParams || funcParams[0] === "") {
        if (func.constructor.name === "AsyncFunction") {
            func = await func();
        }
        else if (typeof func === "function") {
            func = func();
        }
    }
    logger_js_1.logger.info(`Running server on ${settings.server.host}:${settings.server.port}`);
    /**
     * Handles the WebSocket connection.
     * @param socket - The WebSocket connection.
     */
    if (func.stream) {
        logger_js_1.logger.info("Starting websocket server");
        app.register(websocket_1.default);
        app.register(async function (app) {
            app.get("/ws", { websocket: true }, async (socket) => {
                try {
                    if (func instanceof Promise) {
                        const fn = await func;
                        await fn.run(socket, http_1.request);
                    }
                    else if (typeof func.run === "function") {
                        await func.run(socket, http_1.request);
                    }
                    else if (func.constructor.name === "AsyncFunction") {
                        await func(socket, http_1.request);
                    }
                    else {
                        func(socket, http_1.request);
                    }
                }
                catch (e) {
                    logger_js_1.logger.error(e);
                }
            });
        });
    }
    /**
     * Middleware to add a correlation ID to each request.
     */
    app.addHook("onRequest", (request, reply, done) => {
        const requestId = request.headers["x-beamlit-request-id"] || (0, uuid_1.v4)();
        request.raw.timeStart = process.hrtime();
        asyncLocalStorage.run(requestId, () => {
            reply.header("x-beamlit-request-id", requestId);
            done();
        });
    });
    /**
     * Middleware to add the process time header to each response.
     */
    app.addHook("onResponse", (request, reply, done) => {
        const processTime = process.hrtime(request.raw.timeStart);
        const processTimeString = `${(processTime[0] * 1000 +
            processTime[1] / 1000000).toFixed(2)}ms`;
        reply.header("X-Process-Time", processTimeString);
        const requestId = reply.getHeader("x-beamlit-request-id");
        logger_js_1.logger.info(`${request.method} ${processTimeString} ${request.url} rid=${requestId}`);
        done();
    });
    /**
     * Health check endpoint.
     * @returns An object indicating the status.
     */
    app.get("/health", async () => {
        return { status: "ok" };
    });
    /**
     * Handles POST requests to the root endpoint.
     * @param request - The Fastify request object.
     * @param reply - The Fastify reply object.
     */
    if (!func.stream) {
        app.post("/", async (request, reply) => {
            try {
                let response;
                if (func instanceof Promise) {
                    const fn = await func;
                    response = await fn.run(request);
                }
                else if (typeof func.run === "function") {
                    response = await func.run(request);
                }
                else if (func.constructor.name === "AsyncFunction") {
                    response = await func(request);
                }
                else {
                    if (typeof func === "function") {
                        response = func(request);
                    }
                    else {
                        response = func;
                    }
                }
                if (typeof response === "string") {
                    return reply
                        .code(200)
                        .header("Content-Type", "text/plain")
                        .send(response);
                }
                return reply.code(200).send(response);
            }
            catch (e) {
                if (e instanceof error_js_1.HTTPError) {
                    const content = {
                        error: e.message,
                        status_code: e.status_code,
                        traceback: e.stack,
                    };
                    logger_js_1.logger.error(`${e.status_code} ${e.stack}`);
                    return reply.code(e.status_code).send(content);
                }
                const content = {
                    error: `Internal server error, ${e}`,
                    traceback: e instanceof Error ? e.stack : String(e),
                };
                logger_js_1.logger.error(e instanceof Error ? e.stack : String(e));
                return reply.code(500).send(content);
            }
        });
    }
    return app;
}
/**
 * Starts the Fastify application.
 * @param app - The Fastify instance to run.
 * @returns A promise that resolves when the server starts listening.
 */
async function runApp(app) {
    const settings = (0, settings_js_1.getSettings)();
    return await app.listen({
        host: settings.server.host,
        port: settings.server.port,
    });
}
