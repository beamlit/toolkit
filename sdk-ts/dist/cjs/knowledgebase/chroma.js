"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromaKnowledgebase = void 0;
/* eslint-disable @typescript-eslint/no-require-imports */
const sdk_gen_js_1 = require("../client/sdk.gen.js");
const settings_js_1 = require("../common/settings.js");
const embeddings_js_1 = require("./embeddings.js");
class ChromaKnowledgebase {
    client;
    collectionName;
    scoreThreshold;
    limit;
    config;
    secrets;
    embeddingModel;
    constructor(connection, knowledgeBase) {
        const { ChromaClient } = require("chromadb");
        const settings = (0, settings_js_1.getSettings)();
        this.config = connection.config || {};
        this.secrets = connection.secrets || {};
        const auth = this.secrets.password && this.config.username
            ? {
                provider: "basic",
                credentials: Buffer.from(`${this.config.username}:${this.secrets.password}`).toString("base64"),
            }
            : null;
        const options = {
            url: this.config.url || "http://localhost:8000",
        };
        if (auth)
            options.auth = auth;
        this.client = new ChromaClient(options);
        this.collectionName = this.config.collectionName || settings.name;
        this.scoreThreshold = this.config.scoreThreshold || 0.25;
        this.limit = this.config.limit || 5;
        this.embeddingModel = new embeddings_js_1.EmbeddingModel({
            model: knowledgeBase.spec?.embeddingModel || "",
            modelType: knowledgeBase.spec?.embeddingModelType || "",
            client: sdk_gen_js_1.client,
        });
    }
    async getCollection() {
        return await this.client.getOrCreateCollection({
            name: this.collectionName,
        });
    }
    async add(key, value, infos) {
        const embedding = await this.embeddingModel.embed(value);
        const collection = await this.getCollection();
        await collection.add({
            ids: [key],
            embeddings: [embedding],
            metadatas: [infos],
            documents: [value],
        });
    }
    async search(query, filters, scoreThreshold, limit) {
        const collection = await this.getCollection();
        const embedding = await this.embeddingModel.embed(query);
        const result = await collection.query({
            queryEmbeddings: embedding,
            nResults: limit || this.limit,
        });
        const results = [];
        result.ids.forEach((document, docIndex) => {
            document.forEach((id, index) => {
                const distance = result.distances[docIndex][index];
                const value = result.documents[docIndex][index];
                if (distance >= (scoreThreshold || this.scoreThreshold)) {
                    results.push({
                        key: id,
                        value: value,
                        similarity: distance,
                    });
                }
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
exports.ChromaKnowledgebase = ChromaKnowledgebase;
