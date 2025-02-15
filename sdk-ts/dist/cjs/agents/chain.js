"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainToolkit = exports.ChainInputSchema = void 0;
exports.getChainTool = getChainTool;
const tools_1 = require("@langchain/core/tools");
const zod_1 = require("zod");
const sdk_gen_js_1 = require("../client/sdk.gen.js");
/**
 * Creates a chain tool for managing agent chains.
 * @param client - The RunClient instance.
 * @param name - The name of the tool.
 * @param description - A description of the tool.
 * @param schema - The Zod schema for the tool's input.
 * @returns A StructuredTool instance.
 */
function getChainTool(client, name, description, schema) {
    return (0, tools_1.tool)(async (args) => {
        const result = await client.run({
            resourceType: "agent",
            resourceName: name,
            method: "POST",
            json: args,
        });
        return result;
    }, {
        name,
        description,
        schema,
    });
}
/**
 * Schema for chain input.
 */
exports.ChainInputSchema = zod_1.z.object({
    inputs: zod_1.z.string(),
});
/**
 * Remote toolkit for managing agent chains
 */
class ChainToolkit {
    client;
    chain;
    _chain = null;
    /**
     * Initializes the ChainToolkit with a client and a chain configuration.
     * @param client - The RunClient instance.
     * @param chain - An array of AgentChain configurations.
     */
    constructor(client, chain) {
        this.client = client;
        this.chain = chain;
    }
    /**
     * Initializes the session and retrieves the list of tools.
     * @returns A promise that resolves when initialization is complete.
     */
    async initialize() {
        if (!this._chain) {
            const agents = await (0, sdk_gen_js_1.listAgents)({ client: this.client.client });
            const chainEnabled = this.chain.filter((chain) => chain.enabled);
            const agentsChain = [];
            if (!agents.data) {
                throw new Error("No agents found");
            }
            for (const chain of chainEnabled) {
                const agent = agents.data.find((agent) => agent.metadata?.name === chain.name);
                if (agent && agent.spec) {
                    agent.spec.prompt = chain.prompt || agent.spec.prompt;
                    agent.spec.description = chain.description || agent.spec.description;
                    agentsChain.push(agent);
                }
            }
            this._chain = agentsChain;
        }
    }
    /**
     * Retrieves the list of StructuredTools based on the initialized chain.
     * @returns An array of StructuredTool instances.
     */
    getTools() {
        if (!this._chain) {
            throw new Error("Must initialize the toolkit first");
        }
        return this._chain
            .map((agent) => agent.metadata?.name && agent.spec
            ? getChainTool(this.client, agent.metadata.name, agent.spec.description || agent.spec.prompt || "", exports.ChainInputSchema)
            : null)
            .filter((tool) => tool !== null);
    }
}
exports.ChainToolkit = ChainToolkit;
