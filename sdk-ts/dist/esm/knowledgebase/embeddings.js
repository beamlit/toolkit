"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmbeddingModel = void 0;
const error_js_1 = require("../common/error.js");
const run_js_1 = require("../run.js");
class EmbeddingModel {
    config;
    runClient;
    constructor(config) {
        this.config = config;
        this.config = config;
        this.runClient = new run_js_1.RunClient(config.client);
    }
    async embed(query) {
        switch (this.config.modelType) {
            case "openai":
                return this.openAIEmbed(query);
            default:
                return this.openAIEmbed(query);
        }
    }
    handleError(error) {
        const { model } = this.config;
        const message = `Error embedding request with model ${model} -> ${error.status_code} ${error.message}`;
        return new error_js_1.HTTPError(error.status_code, message);
    }
    async openAIEmbed(query) {
        try {
            const { model } = this.config;
            const data = (await this.runClient.run({
                resourceType: "model",
                resourceName: model,
                method: "POST",
                json: { input: query },
                path: "/v1/embeddings",
            }));
            return data.data[0].embedding;
        }
        catch (error) {
            if (error instanceof error_js_1.HTTPError) {
                throw this.handleError(error);
            }
            throw error;
        }
    }
}
exports.EmbeddingModel = EmbeddingModel;
