import { StructuredTool } from "@langchain/core/tools";
import WebSocket from "ws";
/**
 * Manages the WebSocket connection to the OpenAI API for voice interactions.
 */
declare class OpenAIWebSocketConnection {
    ws?: WebSocket;
    url: string;
    headers: Record<string, string>;
    model: string;
    /**
     * Constructs a new OpenAIWebSocketConnection instance.
     * @param params - Configuration parameters including URL, headers, and model name.
     */
    constructor(params: {
        url: string;
        headers: Record<string, string>;
        model: string;
    });
    /**
     * Establishes a WebSocket connection with the OpenAI API.
     * @throws If the connection fails or times out.
     */
    connect(): Promise<void>;
    /**
     * Sends an event to the OpenAI API via WebSocket.
     * @param event - The event data to send.
     * @throws If the WebSocket connection is not active.
     */
    sendEvent(event: Record<string, unknown>): void;
    /**
     * Creates an async generator to stream events from the WebSocket.
     * @returns An async generator yielding chat completion chunks.
     * @throws If the WebSocket connection is not active.
     */
    eventStream(): AsyncGenerator<any, void, unknown>;
}
/**
 * Represents an OpenAI Voice React Agent for handling voice interactions.
 */
export declare class OpenAIVoiceReactAgent {
    protected connection: OpenAIWebSocketConnection;
    protected instructions?: string;
    protected tools: StructuredTool[];
    /**
     * Constructs a new OpenAIVoiceReactAgent instance.
     * @param params - Configuration parameters including URL, model, headers, instructions, and tools.
     */
    constructor(params: {
        url: string;
        model: string;
        headers: Record<string, string>;
        instructions?: string;
        tools?: StructuredTool[];
    });
    /**
     * Binds a set of tools to the agent.
     * @param tools - An array of StructuredTool instances.
     */
    bindTools(tools: StructuredTool[]): void;
    /**
     * Connects to the OpenAI API and handles sending and receiving messages.
     * @param websocketOrStream - An async generator or WebSocket instance for input.
     * @param sendOutputChunk - A callback function to send output chunks.
     */
    connect(websocketOrStream: AsyncGenerator<string> | WebSocket, sendOutputChunk: (chunk: string) => void | Promise<void>): Promise<void>;
}
export {};
