import { AgentBase } from "./base";
/**
 * Recursively retrieves and wraps agents from a specified directory.
 * @param dir - The directory to search for agent files.
 * @param warning - Whether to log warnings on import errors.
 * @returns A promise resolving to an array of AgentBase instances.
 */
export declare const retrieveWrapperAgent: (dir: string, warning: boolean) => Promise<AgentBase[]>;
