/**
 * Secret management class
 */
export declare class Secret {
    /**
     * Get a secret value from environment variables
     * @param name Secret name
     * @returns Secret value or undefined if not found
     */
    static get(name: string): string | undefined;
    /**
     * Set a secret value in environment variables
     * @param name Secret name
     * @param value Secret value
     */
    static set(name: string, value: string): void;
}
