import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
/**
 * Client transport for WebSocket: this will connect to a server over the WebSocket protocol.
 */
export declare class WebSocketClientTransport implements Transport {
    private _socket?;
    private _url;
    private _headers;
    onclose?: () => void;
    onerror?: (error: Error) => void;
    onmessage?: (message: JSONRPCMessage) => void;
    constructor(url: URL, headers: Record<string, string>);
    start(): Promise<void>;
    private _connect;
    close(): Promise<void>;
    send(message: JSONRPCMessage): Promise<void>;
}
