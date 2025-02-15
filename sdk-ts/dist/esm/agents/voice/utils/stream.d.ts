import WebSocket from "ws";
/**
 * Merges multiple async generators into a single async generator.
 * @param streams - An object mapping stream keys to their respective async generators.
 * @returns An async generator yielding tuples of stream key and data.
 */
export declare function mergeStreams<T>(streams: Record<string, AsyncGenerator<T>>): AsyncGenerator<[string, T]>;
/**
 * Creates an async generator that yields parsed JSON messages from a WebSocket.
 * @param ws - The WebSocket instance to listen to.
 * @returns An async generator yielding parsed JSON objects.
 * @throws If the WebSocket connection is not active.
 */
export declare function createStreamFromWebsocket(ws: WebSocket): AsyncGenerator<any, void, unknown>;
