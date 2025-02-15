"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggerProviderInstance = getLoggerProviderInstance;
exports.getLogger = getLogger;
exports.instrumentApp = instrumentApp;
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */
/**
 * Instrumentation utilities for performance monitoring and tracing.
 */
const api_1 = require("@opentelemetry/api");
const api_logs_1 = require("@opentelemetry/api-logs");
const exporter_logs_otlp_http_1 = require("@opentelemetry/exporter-logs-otlp-http");
const exporter_metrics_otlp_http_1 = require("@opentelemetry/exporter-metrics-otlp-http");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const instrumentation_1 = require("@opentelemetry/instrumentation");
const instrumentation_fastify_1 = require("@opentelemetry/instrumentation-fastify");
const instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
const instrumentation_pino_1 = require("@opentelemetry/instrumentation-pino");
const resources_1 = require("@opentelemetry/resources");
const sdk_logs_1 = require("@opentelemetry/sdk-logs");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const sdk_trace_base_1 = require("@opentelemetry/sdk-trace-base");
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
let tracerProvider = null;
let meterProvider = null;
let loggerProvider = null;
const otelLogger = null;
// Define mapping of instrumentor info: (module path, class name, required package)
const instrumentationMap = {
    anthropic: {
        modulePath: "@traceloop/instrumentation-anthropic",
        className: "AnthropicInstrumentation",
        requiredPackages: ["anthropic-ai/sdk"],
    },
    azure: {
        modulePath: "@traceloop/instrumentation-azure",
        className: "AzureInstrumentation",
        requiredPackages: ["azure/openai"],
    },
    bedrock: {
        modulePath: "@traceloop/instrumentation-bedrock",
        className: "BedrockInstrumentation",
        requiredPackages: ["aws-sdk/client-bedrock-runtime"],
    },
    chromadb: {
        modulePath: "@traceloop/instrumentation-chromadb",
        className: "ChromaDBInstrumentation",
        requiredPackages: ["chromadb"],
    },
    cohere: {
        modulePath: "@traceloop/instrumentation-cohere",
        className: "CohereInstrumentation",
        requiredPackages: ["cohere-js"],
    },
    langchain: {
        modulePath: "@traceloop/instrumentation-langchain",
        className: "LangChainInstrumentation",
        requiredPackages: [
            "langchain",
            "@langchain/core",
            "@langchain/community",
            "@langchain/langgraph",
        ],
    },
    llamaindex: {
        modulePath: "@traceloop/instrumentation-llamaindex",
        className: "LlamaIndexInstrumentation",
        requiredPackages: ["llamaindex"],
    },
    openai: {
        modulePath: "@traceloop/instrumentation-openai",
        className: "OpenAIInstrumentation",
        requiredPackages: ["openai"],
    },
    pinecone: {
        modulePath: "@traceloop/instrumentation-pinecone",
        className: "PineconeInstrumentation",
        requiredPackages: ["pinecone-database/pinecone"],
    },
    qdrant: {
        modulePath: "@traceloop/instrumentation-qdrant",
        className: "QdrantInstrumentation",
        requiredPackages: ["qdrant/js-client-rest"],
    },
    vertexai: {
        modulePath: "@traceloop/instrumentation-vertexai",
        className: "VertexAIInstrumentation",
        requiredPackages: ["google-cloud/aiplatform"],
    },
};
let isInstrumentationInitialized = false;
instrumentApp()
    .then(() => { })
    .catch((error) => {
    console.error("Error initializing instrumentation:", error);
});
process.on("SIGINT", () => {
    shutdownInstrumentation().catch((error) => {
        console.debug("Fatal error during shutdown:", error);
        process.exit(0);
    });
});
process.on("SIGTERM", () => {
    shutdownInstrumentation().catch((error) => {
        console.debug("Fatal error during shutdown:", error);
        process.exit(0);
    });
});
/**
 * Retrieve authentication headers.
 */
async function authHeaders() {
    const getAuthenticationHeaders = require("../authentication/authentication.js");
    const headers = await getAuthenticationHeaders.getAuthenticationHeaders();
    return {
        "x-beamlit-authorization": headers?.["X-Beamlit-Authorization"] || "",
        "x-beamlit-workspace": headers?.["X-Beamlit-Workspace"] || "",
    };
}
/**
 * Initialize and return the LoggerProvider.
 */
function getLoggerProviderInstance() {
    if (!loggerProvider) {
        throw new Error("LoggerProvider is not initialized");
    }
    return loggerProvider;
}
/**
 * Get resource attributes for OpenTelemetry.
 */
async function getResourceAttributes() {
    const getSettings = require("./settings.js");
    const settings = getSettings.getSettings();
    const resource = await resources_1.envDetector.detect();
    return {
        ...resource.attributes,
        "service.name": settings.name,
        workspace: settings.workspace,
    };
}
/**
 * Initialize and return the OTLP Metric Exporter.
 */
async function getMetricExporter() {
    const getSettings = require("./settings.js");
    const settings = getSettings.getSettings();
    if (!settings.enableOpentelemetry) {
        return null;
    }
    const headers = await authHeaders();
    return new exporter_metrics_otlp_http_1.OTLPMetricExporter({
        headers: headers,
    });
}
/**
 * Initialize and return the OTLP Trace Exporter.
 */
async function getTraceExporter() {
    const getSettings = require("./settings.js");
    const settings = getSettings.getSettings();
    if (!settings.enableOpentelemetry) {
        return null;
    }
    const headers = await authHeaders();
    return new exporter_trace_otlp_http_1.OTLPTraceExporter({
        headers: headers,
    });
}
/**
 * Initialize and return the OTLP Log Exporter.
 */
async function getLogExporter() {
    const getSettings = require("./settings.js");
    const settings = getSettings.getSettings();
    if (!settings.enableOpentelemetry) {
        return null;
    }
    const headers = await authHeaders();
    return new exporter_logs_otlp_http_1.OTLPLogExporter({
        headers: headers,
    });
}
function getLogger() {
    if (!otelLogger) {
        throw new Error("Logger is not initialized");
    }
    return otelLogger;
}
/**
 * Check if a package is installed
 */
function isPackageInstalled(packageName) {
    try {
        require.resolve(packageName);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Import and instantiate an instrumentation class
 */
async function importInstrumentationClass(modulePath, className) {
    try {
        const module = await import(modulePath);
        return module[className];
    }
    catch (e) {
        console.debug(`Could not import ${className} from ${modulePath}: ${e}`);
        return null;
    }
}
async function loadInstrumentation() {
    const instrumentations = [];
    for (const [name, info] of Object.entries(instrumentationMap)) {
        if (info.requiredPackages.some((pkg) => isPackageInstalled(pkg))) {
            const module = await importInstrumentationClass(info.modulePath, info.className);
            if (module) {
                try {
                    const instrumentor = new module();
                    instrumentor.enable();
                    instrumentations.push(instrumentor);
                    if (name === "langchain") {
                        const langchain = instrumentor;
                        const RunnableModule = require("@langchain/core/runnables");
                        const ToolsModule = require("@langchain/core/tools");
                        const ChainsModule = require("langchain/chains");
                        const AgentsModule = require("langchain/agents");
                        const VectorStoresModule = require("@langchain/core/vectorstores");
                        langchain.manuallyInstrument({
                            runnablesModule: RunnableModule,
                            toolsModule: ToolsModule,
                            chainsModule: ChainsModule,
                            agentsModule: AgentsModule,
                            vectorStoreModule: VectorStoresModule,
                        });
                    }
                }
                catch (error) {
                    console.debug(`Failed to instrument ${name}: ${error}`);
                }
            }
        }
    }
    return instrumentations;
}
/**
 * Instrument the Fastify application with OpenTelemetry.
 */
async function instrumentApp() {
    if (!(process.env.BL_ENABLE_OPENTELEMETRY === "true" ||
        isInstrumentationInitialized)) {
        return;
    }
    isInstrumentationInitialized = true;
    const pinoInstrumentation = new instrumentation_pino_1.PinoInstrumentation();
    const fastifyInstrumentation = new instrumentation_fastify_1.FastifyInstrumentation();
    const httpInstrumentation = new instrumentation_http_1.HttpInstrumentation();
    const instrumentations = await loadInstrumentation();
    instrumentations.push(fastifyInstrumentation);
    instrumentations.push(httpInstrumentation);
    instrumentations.push(pinoInstrumentation);
    const resource = new resources_1.Resource(await getResourceAttributes());
    // Initialize Logger Provider with exporter
    const logExporter = await getLogExporter();
    if (!logExporter) {
        throw new Error("Log exporter is not initialized");
    }
    loggerProvider = new sdk_logs_1.LoggerProvider({
        resource,
    });
    loggerProvider.addLogRecordProcessor(new sdk_logs_1.BatchLogRecordProcessor(logExporter));
    api_logs_1.logs.setGlobalLoggerProvider(loggerProvider);
    // Initialize Tracer Provider with exporter
    const traceExporter = await getTraceExporter();
    if (!traceExporter) {
        throw new Error("Trace exporter is not initialized");
    }
    tracerProvider = new sdk_trace_node_1.NodeTracerProvider({
        resource,
        sampler: new sdk_trace_base_1.AlwaysOnSampler(),
        spanProcessors: [new sdk_trace_base_1.BatchSpanProcessor(traceExporter)],
    });
    tracerProvider.register(); // This registers it as the global tracer provider
    // Initialize Meter Provider with exporter
    const metricExporter = await getMetricExporter();
    if (!metricExporter) {
        throw new Error("Metric exporter is not initialized");
    }
    meterProvider = new sdk_metrics_1.MeterProvider({
        resource,
        readers: [
            new sdk_metrics_1.PeriodicExportingMetricReader({
                exporter: metricExporter,
                exportIntervalMillis: 60000,
            }),
        ],
    });
    // Register as global meter provider
    api_1.metrics.setGlobalMeterProvider(meterProvider);
    (0, instrumentation_1.registerInstrumentations)({
        instrumentations: instrumentations,
    });
}
/**
 * Shutdown OpenTelemetry instrumentation.
 */
async function shutdownInstrumentation() {
    try {
        const shutdownPromises = [];
        if (tracerProvider) {
            shutdownPromises.push(tracerProvider
                .shutdown()
                .catch((error) => console.debug("Error shutting down tracer provider:", error)));
        }
        if (meterProvider) {
            shutdownPromises.push(meterProvider
                .shutdown()
                .catch((error) => console.debug("Error shutting down meter provider:", error)));
        }
        if (loggerProvider) {
            shutdownPromises.push(loggerProvider
                .shutdown()
                .catch((error) => console.debug("Error shutting down logger provider:", error)));
        }
        // Wait for all providers to shutdown with a timeout
        await Promise.race([
            Promise.all(shutdownPromises),
            new Promise((resolve) => setTimeout(resolve, 5000)), // 5 second timeout
        ]);
        process.exit(0);
    }
    catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    }
}
