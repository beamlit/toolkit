"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClientTransport = void 0;
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const logger_js_1 = require("../../common/logger.js");
//const SUBPROTOCOL = "mcp";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
// Helper function to wait
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/**
 * Client transport for WebSocket: this will connect to a server over the WebSocket protocol.
 */
class WebSocketClientTransport {
    _socket;
    _url;
    _headers;
    onclose;
    onerror;
    onmessage;
    constructor(url, headers) {
        this._url = new URL(url.toString().replace("http", "ws"));
        this._headers = headers;
    }
    async start() {
        if (this._socket) {
            throw new Error("WebSocketClientTransport already started! If using Client class, note that connect() calls start() automatically.");
        }
        let attempts = 0;
        while (attempts < MAX_RETRIES) {
            try {
                await this._connect();
                return;
            }
            catch (error) {
                attempts++;
                if (attempts === MAX_RETRIES) {
                    throw error;
                }
                logger_js_1.logger.debug(`WebSocket connection attempt ${attempts} failed, retrying in ${RETRY_DELAY_MS}ms...`);
                await delay(RETRY_DELAY_MS);
            }
        }
    }
    _connect() {
        return new Promise((resolve, reject) => {
            this._socket = new WebSocket(this._url, {
                //protocols: SUBPROTOCOL,
                headers: this._headers,
            });
            this._socket.onerror = (event) => {
                const error = "error" in event
                    ? event.error
                    : new Error(`WebSocket error: ${JSON.stringify(event)}`);
                reject(error);
                this.onerror?.(error);
            };
            this._socket.onopen = () => {
                logger_js_1.logger.info("WebSocket opened");
                resolve();
            };
            this._socket.onclose = () => {
                logger_js_1.logger.info("WebSocket closed");
                this.onclose?.();
            };
            this._socket.onmessage = (event) => {
                logger_js_1.logger.info("WebSocket message received");
                let message;
                try {
                    message = types_js_1.JSONRPCMessageSchema.parse(JSON.parse(event.data));
                }
                catch (error) {
                    logger_js_1.logger.error(`Error parsing message: ${event.data}`);
                    this.onerror?.(error);
                    return;
                }
                this.onmessage?.(message);
            };
        });
    }
    async close() {
        this._socket?.close();
    }
    async send(message) {
        let attempts = 0;
        while (attempts < MAX_RETRIES) {
            try {
                if (!this._socket) {
                    throw new Error("Not connected");
                }
                await new Promise((resolve) => {
                    this._socket?.send(JSON.stringify(message));
                    resolve();
                });
                return;
            }
            catch (error) {
                attempts++;
                if (attempts === MAX_RETRIES) {
                    throw error;
                }
                logger_js_1.logger.warn(`WebSocket send attempt ${attempts} failed, retrying in ${RETRY_DELAY_MS}ms...`);
                await delay(RETRY_DELAY_MS);
            }
        }
    }
}
exports.WebSocketClientTransport = WebSocketClientTransport;
