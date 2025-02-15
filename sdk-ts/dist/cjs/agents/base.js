"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAgent = void 0;
const messages_1 = require("@langchain/core/messages");
const langgraph_1 = require("@langchain/langgraph");
const prebuilt_1 = require("@langchain/langgraph/prebuilt");
const authentication_js_1 = require("../authentication/authentication.js");
const sdk_gen_js_1 = require("../client/sdk.gen.js");
const logger_js_1 = require("../common/logger.js");
const settings_js_1 = require("../common/settings.js");
const common_js_1 = require("../functions/common.js");
const factory_js_1 = require("../knowledgebase/factory.js");
const chat_js_1 = require("./chat.js");
const openai_js_1 = require("./voice/openai.js");
/**
 * Handles the context management for an agent by retrieving relevant memories and constructing messages.
 * @param agent - The agent configuration object.
 * @param state - The current state of messages in the conversation.
 * @param knowledgebase - The memory store instance for retrieving historical context.
 * @param embeddingModel - The embedding model used for semantic similarity search.
 * @returns A promise resolving to an array of BaseMessage objects containing the context and current messages.
 */
const handleContext = async (agent, state, config, knowledgebase) => {
    const messages = [];
    const prompt = agent?.spec?.prompt || "";
    try {
        const memories = await knowledgebase.search(state.messages[state.messages.length - 1].content);
        if (memories.length > 0) {
            let context = "Relevant information from previous conversations:\n";
            memories.forEach((memory) => {
                context += `- ${memory.value} (score: ${memory.similarity})\n`;
            });
            const message = new messages_1.SystemMessage(prompt + context);
            messages.push(message);
        }
        else {
            messages.push(new messages_1.SystemMessage(prompt));
        }
    }
    catch (error) {
        let context = "";
        if (error instanceof Error && "status" in error) {
            context = ` Could not retrieve memories from store: ${error.status} - ${error.message}`;
        }
        else {
            context = ` Could not retrieve memories from store: ${error}`;
        }
        logger_js_1.logger.warn(context);
        const message = new messages_1.SystemMessage(prompt + context);
        messages.push(message);
    }
    messages.push(...state.messages);
    return messages;
};
const initKnowledgebase = async (agent, client, settings) => {
    if (!agent?.spec?.knowledgebase) {
        return null;
    }
    let knowledgebase = null;
    const { data: kb } = await (0, sdk_gen_js_1.getKnowledgebase)({
        client,
        path: { knowledgebaseName: agent.spec.knowledgebase },
    });
    if (kb && kb.spec) {
        let config = {
            ...(kb.spec.options || {}),
        };
        let secrets = {};
        if (kb.spec.integrationConnections && kb.spec.integrationConnections[0]) {
            const { data: integrationConnection } = await (0, sdk_gen_js_1.getIntegrationConnection)({
                client,
                path: { connectionName: kb.spec?.integrationConnections[0] },
            });
            if (integrationConnection?.spec) {
                if (integrationConnection?.spec?.config) {
                    config = { ...config, ...integrationConnection?.spec?.config };
                }
                if (integrationConnection?.spec?.secret) {
                    secrets = {
                        ...secrets,
                        ...integrationConnection?.spec?.secret,
                        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwiZXhwIjoxNzQ2NDY3MzI0fQ.75MdQ62X0X3gLxgaJ6Du19_qsMVsdz6srMjD42IRd90",
                    };
                }
                knowledgebase = await factory_js_1.KnowledgebaseFactory.create({
                    type: integrationConnection.spec.integration || "qdrant",
                    knowledgeBase: kb,
                    connection: {
                        config,
                        secrets,
                    },
                });
            }
        }
    }
    else {
        logger_js_1.logger.warn(`Knowledgebase ${agent.spec.knowledgebase} not found. Please create one at ${settings.appUrl}/${settings.workspace}/global-inference-network/knowledgebases/create`);
    }
    return knowledgebase;
};
/**
 * Wraps a callback function into an AgentBase, configuring it based on the provided options and settings.
 * @param func - The callback function to wrap.
 * @param options - Optional agent configuration options.
 * @returns A promise resolving to an AgentBase object.
 */
const wrapAgent = async (func, options = null) => {
    const settings = (0, settings_js_1.getSettings)();
    if (settings.deploy) {
        return {
            async run(request) {
                return await func(request);
            },
            agent: options?.agent ?? null,
            remoteFunctions: options?.remoteFunctions ?? [],
        };
    }
    const client = (0, authentication_js_1.newClient)();
    const { agent, overrideAgent, overrideModel, remoteFunctions } = options ?? {};
    if (overrideModel) {
        settings.agent.model = overrideModel;
    }
    if (overrideAgent) {
        settings.agent.agent = overrideAgent;
    }
    if (agent?.spec?.model) {
        const { response, data } = await (0, sdk_gen_js_1.getModel)({
            client,
            path: { modelName: agent.spec.model },
        });
        if (response.status === 200) {
            settings.agent.model = data;
        }
    }
    const functions = await (0, common_js_1.getFunctions)({
        client,
        dir: settings.agent.functionsDirectory,
        remoteFunctions,
        chain: agent?.spec?.agentChain,
        warning: settings.agent.model !== null,
    });
    settings.agent.functions = functions;
    if (!settings.agent.agent) {
        if (!settings.agent.model) {
            const { response, data: models } = await (0, sdk_gen_js_1.listModels)({
                client,
                throwOnError: false,
            });
            if (models?.length) {
                let modelError = "";
                if (agent?.spec?.model) {
                    modelError = `Model ${agent.spec.model} not found.\n`;
                }
                throw new Error(`${modelError}You must provide a model.\n${models?.join(", ")}\nYou can create one at ${settings.appUrl}/${settings.workspace}/global-inference-network/models/create`);
            }
            else {
                throw new Error(`Cannot initialize agent. No models found. Response: ${response.status}`);
            }
        }
        const { chat } = await (0, chat_js_1.getChatModelFull)(settings.agent.model.metadata.name, settings.agent.model);
        settings.agent.chatModel = chat;
        if (chat instanceof openai_js_1.OpenAIVoiceReactAgent) {
            settings.agent.agent = chat;
        }
        else {
            const knowledgebase = await initKnowledgebase(agent, client, settings);
            settings.agent.agent = (0, prebuilt_1.createReactAgent)({
                llm: chat,
                tools: settings.agent.functions ?? [],
                checkpointSaver: new langgraph_1.MemorySaver(),
                stateModifier: async (state, config) => {
                    if (knowledgebase) {
                        return await handleContext(agent, state, config, knowledgebase);
                    }
                    const prompt = agent?.spec?.prompt || "";
                    const messages = [new messages_1.SystemMessage(prompt), ...state.messages];
                    return messages;
                },
            });
        }
    }
    if (functions.length === 0 && !overrideAgent) {
        logger_js_1.logger.warn(`
      You can define this function in directory ${settings.agent.functionsDirectory}. Here is a sample function you can use:\n\n
      import { wrapFunction } from '@beamlit/sdk/functions'\n\n
      wrapFunction(() => return 'Hello, world!', { name: 'hello_world', description: 'This is a sample function' })
      `);
    }
    if (settings.agent.agent instanceof openai_js_1.OpenAIVoiceReactAgent) {
        return {
            run: async (ws, request) => {
                const args = {
                    agent: settings.agent.agent,
                    model: settings.agent.model,
                    functions: settings.agent.functions,
                };
                return await func(ws, request, args);
            },
            agent: options?.agent ?? null,
            remoteFunctions: options?.remoteFunctions ?? [],
            stream: true,
        };
    }
    return {
        run: async (request) => {
            const args = {
                agent: settings.agent.agent,
                model: settings.agent.model,
                functions: settings.agent.functions,
            };
            if (func.constructor.name === "AsyncFunction") {
                return await func(request, args);
            }
            return func(request, args);
        },
        remoteFunctions: options?.remoteFunctions ?? [],
        agent: options?.agent ?? null,
    };
};
exports.wrapAgent = wrapAgent;
