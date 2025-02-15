"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeStreams = mergeStreams;
exports.createStreamFromWebsocket = createStreamFromWebsocket;
const ws_1 = __importDefault(require("ws"));
/**
 * Merges multiple async generators into a single async generator.
 * @param streams - An object mapping stream keys to their respective async generators.
 * @returns An async generator yielding tuples of stream key and data.
 */
async function* mergeStreams(streams) {
    // start the first iteration of each output iterator
    const tasks = new Map(Object.entries(streams).map(([key, stream]) => {
        return [key, stream.next().then((result) => ({ key, stream, result }))];
    }));
    // yield chunks as they become available,
    // starting new iterations as needed,
    // until all iterators are done
    while (tasks.size) {
        const { key, result, stream } = await Promise.race(tasks.values());
        tasks.delete(key);
        if (!result.done) {
            yield [key, result.value];
            tasks.set(key, stream.next().then((result) => ({ key, stream, result })));
        }
    }
}
/**
 * Creates an async generator that yields parsed JSON messages from a WebSocket.
 * @param ws - The WebSocket instance to listen to.
 * @returns An async generator yielding parsed JSON objects.
 * @throws If the WebSocket connection is not active.
 */
async function* createStreamFromWebsocket(ws) {
    const messageQueue = [];
    let resolveMessage = null;
    let rejectMessage = null;
    const onMessage = (data) => {
        const message = data.toString();
        if (resolveMessage) {
            resolveMessage(message);
            resolveMessage = null;
            rejectMessage = null;
        }
        else {
            messageQueue.push(message);
        }
    };
    const onError = (error) => {
        if (rejectMessage) {
            rejectMessage(error);
            resolveMessage = null;
            rejectMessage = null;
        }
    };
    ws.on("message", onMessage);
    ws.on("error", onError);
    try {
        while (ws.readyState === ws_1.default.OPEN) {
            let message;
            if (messageQueue.length > 0) {
                message = messageQueue.shift();
            }
            else {
                message = await new Promise((resolve, reject) => {
                    resolveMessage = resolve;
                    rejectMessage = reject;
                });
            }
            yield JSON.parse(message);
        }
    }
    finally {
        ws.off("message", onMessage);
        ws.off("error", onError);
    }
}
