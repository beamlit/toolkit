"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PineconeKnowledgebase = void 0;
/* eslint-disable @typescript-eslint/no-require-imports */
const sdk_gen_js_1 = require("../client/sdk.gen.js");
const settings_js_1 = require("../common/settings.js");
const embeddings_js_1 = require("./embeddings.js");
class PineconeKnowledgebase {
    client;
    index;
    collectionName;
    scoreThreshold;
    limit;
    config;
    secrets;
    embeddingModel;
    constructor(connection, knowledgeBase) {
        const { Pinecone } = require("@pinecone-database/pinecone");
        const settings = (0, settings_js_1.getSettings)();
        this.config = connection.config || {};
        this.secrets = connection.secrets || {};
        this.client = new Pinecone({ apiKey: this.secrets.apiKey });
        this.collectionName = this.config.collectionName || settings.name;
        this.scoreThreshold = this.config.scoreThreshold || 0.25;
        this.limit = this.config.limit || 5;
        this.embeddingModel = new embeddings_js_1.EmbeddingModel({
            model: knowledgeBase.spec?.embeddingModel || "",
            modelType: knowledgeBase.spec?.embeddingModelType || "",
            client: sdk_gen_js_1.client,
        });
        this.index = this.client.index(this.config.indexName, this.config.indexHost);
    }
    async add(key, value, infos) {
        const embedding = await this.embeddingModel.embed(value);
        await this.index.namespace(this.collectionName).upsert([
            {
                id: key,
                values: embedding,
                metadata: { ...infos, value, name: "test" },
            },
        ]);
    }
    async search(query, filters, scoreThreshold, limit) {
        const embedding = await this.embeddingModel.embed(query);
        const result = await this.index.namespace(this.collectionName).query({
            vector: embedding,
            topK: limit || this.limit,
            includeValues: true,
            includeMetadata: true,
        });
        const results = [];
        result.matches.forEach((match) => {
            results.push({
                key: match.id,
                value: match.metadata.value,
                similarity: match.score,
            });
        });
        return results;
    }
    async delete(key) {
        await this.client.delete(this.collectionName, {
            points: [key],
        });
    }
}
exports.PineconeKnowledgebase = PineconeKnowledgebase;
