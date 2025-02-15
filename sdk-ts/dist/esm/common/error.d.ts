/**
 * Represents an HTTP error with a status code and message.
 */
export declare class HTTPError extends Error {
    status_code: number;
    message: string;
    /**
     * Constructs a new HTTPError instance.
     * @param status_code - The HTTP status code.
     * @param message - The error message.
     */
    constructor(status_code: number, message: string);
    /**
     * Returns a string representation of the HTTPError.
     * @returns A string combining the status code and message.
     */
    toString(): string;
}
