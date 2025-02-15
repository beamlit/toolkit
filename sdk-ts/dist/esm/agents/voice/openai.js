"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIVoiceReactAgent = void 0;
const ws_1 = __importDefault(require("ws"));
const zod_to_json_schema_1 = require("zod-to-json-schema");
const logger_1 = require("../../common/logger");
const stream_1 = require("./utils/stream");
const EVENTS_TO_IGNORE = [
    "response.function_call_arguments.delta",
    "rate_limits.updated",
    "response.audio_transcript.delta",
    "response.created",
    "response.content_part.added",
    "response.content_part.done",
    "conversation.item.created",
    "response.audio.done",
    "session.created",
    "session.updated",
    "response.done",
    "response.output_item.done",
];
/**
 * Manages the WebSocket connection to the OpenAI API for voice interactions.
 */
class OpenAIWebSocketConnection {
    ws;
    url;
    headers;
    model;
    /**
     * Constructs a new OpenAIWebSocketConnection instance.
     * @param params - Configuration parameters including URL, headers, and model name.
     */
    constructor(params) {
        this.url = params.url;
        this.headers = params.headers;
        this.model = params.model;
    }
    /**
     * Establishes a WebSocket connection with the OpenAI API.
     * @throws If the connection fails or times out.
     */
    async connect() {
        const finalUrl = `${this.url}/realtime?model=${this.model}`;
        this.ws = new ws_1.default(finalUrl, {
            headers: { ...this.headers, "OpenAI-Beta": "realtime=v1" },
        });
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Connection timed out after 10 seconds."));
            }, 10000);
            this.ws?.once("open", () => {
                clearTimeout(timeout);
                resolve();
            });
            this.ws?.once("error", (error) => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    }
    /**
     * Sends an event to the OpenAI API via WebSocket.
     * @param event - The event data to send.
     * @throws If the WebSocket connection is not active.
     */
    sendEvent(event) {
        const formattedEvent = JSON.stringify(event);
        if (this.ws === undefined) {
            throw new Error("Socket connection is not active, call .connect() first");
        }
        this.ws?.send(formattedEvent);
    }
    /**
     * Creates an async generator to stream events from the WebSocket.
     * @returns An async generator yielding chat completion chunks.
     * @throws If the WebSocket connection is not active.
     */
    async *eventStream() {
        if (!this.ws) {
            throw new Error("Socket connection is not active, call .connect() first");
        }
        yield* (0, stream_1.createStreamFromWebsocket)(this.ws);
    }
}
/**
 * Executes tools based on incoming tool calls and handles their outputs.
 */
class VoiceToolExecutor {
    toolsByName;
    triggerPromise = null;
    triggerResolve = null;
    lock = null;
    /**
     * Constructs a new VoiceToolExecutor instance.
     * @param toolsByName - A mapping of tool names to StructuredTool instances.
     */
    constructor(toolsByName) {
        this.toolsByName = toolsByName;
    }
    /**
     * Triggers the execution of a tool function.
     * @returns A promise that resolves when the tool is triggered.
     */
    async triggerFunc() {
        if (!this.triggerPromise) {
            this.triggerPromise = new Promise((resolve) => {
                this.triggerResolve = resolve;
            });
        }
        return this.triggerPromise;
    }
    /**
     * Adds a tool call to be processed.
     * @param toolCall - The tool call data.
     * @throws If a tool call is already in progress.
     */
    async addToolCall(toolCall) {
        while (this.lock) {
            await this.lock;
        }
        this.lock = (async () => {
            if (this.triggerResolve) {
                this.triggerResolve(toolCall);
                this.triggerPromise = null;
                this.triggerResolve = null;
            }
            else {
                throw new Error("Tool call adding already in progress");
            }
        })();
        await this.lock;
        this.lock = null;
    }
    /**
     * Creates a task to execute a tool call.
     * @param toolCall - The tool call data.
     * @returns The result of the tool call.
     * @throws If the tool is not found or arguments are invalid.
     */
    async createToolCallTask(toolCall) {
        const tool = this.toolsByName[toolCall.name];
        if (!tool) {
            throw new Error(`Tool ${toolCall.name} not found. Must be one of ${Object.keys(this.toolsByName)}`);
        }
        let args;
        try {
            args = JSON.parse(toolCall.arguments);
        }
        catch {
            throw new Error(`Failed to parse arguments '${toolCall.arguments}'. Must be valid JSON.`);
        }
        const result = await tool.call(args);
        const resultStr = typeof result === "string" ? result : JSON.stringify(result);
        return {
            type: "conversation.item.create",
            item: {
                id: toolCall.call_id,
                call_id: toolCall.call_id,
                type: "function_call_output",
                output: resultStr,
            },
        };
    }
    /**
     * An async generator that yields tool execution results.
     * @returns An async generator yielding chat completion chunks.
     */
    async *outputIterator() {
        while (true) {
            const toolCall = await this.triggerFunc();
            try {
                const result = await this.createToolCallTask(toolCall);
                yield result;
            }
            catch (error) {
                yield {
                    type: "conversation.item.create",
                    item: {
                        id: toolCall.call_id,
                        call_id: toolCall.call_id,
                        type: "function_call_output",
                        output: `Error: ${error.message}`,
                    },
                };
            }
        }
    }
}
/**
 * Represents an OpenAI Voice React Agent for handling voice interactions.
 */
class OpenAIVoiceReactAgent {
    connection;
    instructions;
    tools;
    /**
     * Constructs a new OpenAIVoiceReactAgent instance.
     * @param params - Configuration parameters including URL, model, headers, instructions, and tools.
     */
    constructor(params) {
        this.connection = new OpenAIWebSocketConnection({
            url: params.url.replace("http", "ws"),
            headers: params.headers,
            model: params.model,
        });
        this.instructions = params.instructions;
        this.tools = params.tools ?? [];
    }
    /**
     * Binds a set of tools to the agent.
     * @param tools - An array of StructuredTool instances.
     */
    bindTools(tools) {
        this.tools = tools;
    }
    /**
     * Connects to the OpenAI API and handles sending and receiving messages.
     * @param websocketOrStream - An async generator or WebSocket instance for input.
     * @param sendOutputChunk - A callback function to send output chunks.
     */
    async connect(websocketOrStream, sendOutputChunk) {
        let inputStream;
        if ("next" in websocketOrStream) {
            inputStream = websocketOrStream;
        }
        else {
            inputStream = (0, stream_1.createStreamFromWebsocket)(websocketOrStream);
        }
        const toolsByName = this.tools.reduce((toolsByName, tool) => {
            toolsByName[tool.name] = tool;
            return toolsByName;
        }, {});
        const toolExecutor = new VoiceToolExecutor(toolsByName);
        await this.connection.connect();
        const modelReceiveStream = this.connection.eventStream();
        // Send tools and instructions with initial chunk
        const toolDefs = Object.values(toolsByName).map((tool) => ({
            type: "function",
            name: tool.name,
            description: tool.description,
            parameters: (0, zod_to_json_schema_1.zodToJsonSchema)(tool.schema),
        }));
        this.connection.sendEvent({
            type: "session.update",
            session: {
                instructions: this.instructions,
                input_audio_transcription: {
                    model: "whisper-1",
                },
                tools: toolDefs,
            },
        });
        for await (const [streamKey, dataRaw] of (0, stream_1.mergeStreams)({
            input_mic: inputStream,
            output_speaker: modelReceiveStream,
            tool_outputs: toolExecutor.outputIterator(),
        })) {
            let data;
            try {
                data = typeof dataRaw === "string" ? JSON.parse(dataRaw) : dataRaw;
            }
            catch {
                logger_1.logger.error("Error decoding data:", dataRaw);
                continue;
            }
            if (streamKey === "input_mic") {
                this.connection.sendEvent(data);
            }
            else if (streamKey === "tool_outputs") {
                logger_1.logger.info("tool output", data);
                this.connection.sendEvent(data);
                this.connection.sendEvent({ type: "response.create", response: {} });
            }
            else if (streamKey === "output_speaker") {
                const { type } = data;
                if (type === "response.audio.delta") {
                    sendOutputChunk(JSON.stringify(data));
                }
                else if (type === "response.audio_buffer.speech_started") {
                    logger_1.logger.info("interrupt");
                    sendOutputChunk(JSON.stringify(data));
                }
                else if (type === "error") {
                    console.error("error:", data);
                }
                else if (type === "response.function_call_arguments.done") {
                    logger_1.logger.info("tool call", data);
                    toolExecutor.addToolCall(data);
                }
                else if (type === "response.audio_transcript.done") {
                    logger_1.logger.info("model:", data.transcript);
                }
                else if (type === "conversation.item.input_audio_transcription.completed") {
                    logger_1.logger.info("user:", data.transcript);
                }
                else if (!EVENTS_TO_IGNORE.includes(type)) {
                    logger_1.logger.info(type);
                }
            }
        }
    }
}
exports.OpenAIVoiceReactAgent = OpenAIVoiceReactAgent;
