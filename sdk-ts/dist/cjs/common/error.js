"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = void 0;
/**
 * Represents an HTTP error with a status code and message.
 */
class HTTPError extends Error {
    status_code;
    message;
    /**
     * Constructs a new HTTPError instance.
     * @param status_code - The HTTP status code.
     * @param message - The error message.
     */
    constructor(status_code, message) {
        super(message);
        this.status_code = status_code;
        this.message = message;
        // Set the prototype explicitly to maintain proper inheritance
        Object.setPrototypeOf(this, HTTPError.prototype);
    }
    /**
     * Returns a string representation of the HTTPError.
     * @returns A string combining the status code and message.
     */
    toString() {
        return `${this.status_code} ${this.message}`;
    }
}
exports.HTTPError = HTTPError;
