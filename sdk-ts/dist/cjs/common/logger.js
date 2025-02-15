"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.logger = void 0;
/* eslint-disable @typescript-eslint/no-require-imports */
const api_logs_1 = require("@opentelemetry/api-logs");
const instrumentation_js_1 = require("./instrumentation.js");
let isInstrumentationInitialized = false;
const initializeInstrumentation = async () => {
    if (!isInstrumentationInitialized) {
        try {
            await (0, instrumentation_js_1.instrumentApp)();
            isInstrumentationInitialized = true;
        }
        catch (error) {
            console.error("Failed to initialize instrumentation:", error);
        }
    }
};
/**
 * Lazy-initialized singleton logger instance.
 */
exports.logger = new Proxy({}, {
    get: (target, property) => {
        // Initialize instrumentation if needed
        if (!isInstrumentationInitialized) {
            initializeInstrumentation().catch(console.error);
        }
        const pino = require("pino");
        const loggerConfiguration = {
            level: process.env.BL_LOG_LEVEL || "info",
            transport: {
                target: "pino-pretty",
                options: {
                    colorizeObjects: false,
                    translateTime: false,
                    hideObject: true,
                    messageFormat: "\x1B[37m{msg}",
                    ignore: "pid,hostname,time",
                },
            },
        };
        // Only create instance if it doesn't exist
        if (!target.__instance) {
            const instance = pino(loggerConfiguration);
            target.__instance = instance;
            // Get OpenTelemetry logger
            try {
                const otelLogger = api_logs_1.logs.getLogger("beamlit");
                if (otelLogger) {
                    target.__otelLogger = otelLogger;
                }
            }
            catch {
                // OpenTelemetry logger not available
            }
        }
        // Try to use OpenTelemetry logger if available
        if (target.__otelLogger &&
            property in target.__otelLogger) {
            return target.__otelLogger[property];
        }
        return target.__instance[property];
    },
});
exports.log = {
    info: async (msg, ...args) => {
        const loggerInstance = await exports.logger.info;
        loggerInstance(msg, ...args);
    },
    error: async (msg, ...args) => {
        const loggerInstance = await exports.logger.error;
        loggerInstance(msg, ...args);
    },
    warn: async (msg, ...args) => {
        const loggerInstance = await exports.logger.warn;
        loggerInstance(msg, ...args);
    },
    debug: async (msg, ...args) => {
        const loggerInstance = await exports.logger.debug;
        loggerInstance(msg, ...args);
    },
};
