"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secret = void 0;
/**
 * Secret management class
 */
class Secret {
    /**
     * Get a secret value from environment variables
     * @param name Secret name
     * @returns Secret value or undefined if not found
     */
    static get(name) {
        return process.env[name] || process.env[`bl_${name}`];
    }
    /**
     * Set a secret value in environment variables
     * @param name Secret name
     * @param value Secret value
     */
    static set(name, value) {
        process.env[name] = value;
    }
}
exports.Secret = Secret;
