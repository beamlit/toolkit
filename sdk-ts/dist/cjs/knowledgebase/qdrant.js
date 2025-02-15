"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QdrantKnowledgebase = void 0;
/* eslint-disable @typescript-eslint/no-require-imports */
const sdk_gen_js_1 = require("../client/sdk.gen.js");
const settings_js_1 = require("../common/settings.js");
const embeddings_js_1 = require("./embeddings.js");
class QdrantKnowledgebase {
    client;
    collectionName;
    scoreThreshold;
    limit;
    config;
    secrets;
    embeddingModel;
    constructor(connection, knowledgeBase) {
        const { QdrantClient } = require("@qdrant/js-client-rest");
        const settings = (0, settings_js_1.getSettings)();
        this.config = connection.config || {};
        this.secrets = connection.secrets || {};
        this.client = new QdrantClient({
            url: this.config.url || "http://localhost:6333",
            apiKey: this.secrets.apiKey || "",
            checkCompatibility: false,
        });
        this.collectionName = this.config.collectionName || settings.name;
        this.scoreThreshold = this.config.scoreThreshold || 0.25;
        this.limit = this.config.limit || 5;
        this.embeddingModel = new embeddings_js_1.EmbeddingModel({
            model: knowledgeBase.spec?.embeddingModel || "",
            modelType: knowledgeBase.spec?.embeddingModelType || "",
            client: sdk_gen_js_1.client,
        });
    }
    handleError(action, error) {
        if (error instanceof Error && "status" in error) {
            if ("data" in error &&
                typeof error.data === "object" &&
                error.data &&
                "status" in error.data &&
                typeof error.data.status === "object" &&
                error.data.status &&
                "error" in error.data.status) {
                return new Error(`Qdrant http error for ${action}: ${error.status} - ${error.data.status.error}`);
            }
            else {
                return new Error(`Qdrant http error for ${action}: ${error.status} - ${error.message}`);
            }
        }
        return error;
    }
    async getOrCreateCollection(embeddings) {
        try {
            const response = await this.client.getCollections();
            if (!response.collections.find((collection) => collection.name === this.config.collectionName)) {
                await this.client.createCollection(this.config.collectionName, {
                    vectors: {
                        default: {
                            size: embeddings.size,
                            distance: embeddings.distance,
                        },
                    },
                });
            }
        }
        catch (error) {
            if (error instanceof Error &&
                error.message.includes("Error creating collection ApiError: Conflict")) {
                return this.getOrCreateCollection(embeddings);
            }
            throw this.handleError("creating collection", error);
        }
    }
    async add(key, value, infos) {
        try {
            const embedding = await this.embeddingModel.embed(value);
            await this.getOrCreateCollection({
                size: embedding.length,
                distance: infos?.distance || "Cosine",
            });
            await this.client.upsert(this.collectionName, {
                points: [
                    {
                        id: key,
                        vector: {
                            default: embedding,
                        },
                        payload: {
                            text: value,
                            ...infos,
                        },
                    },
                ],
            });
        }
        catch (error) {
            throw this.handleError("adding", error);
        }
    }
    async search(query, filters, scoreThreshold, limit) {
        try {
            const embedding = await this.embeddingModel.embed(query);
            const results = await this.client.query(this.collectionName, {
                query: embedding,
                using: "default",
                with_payload: true,
                score_threshold: scoreThreshold || this.scoreThreshold,
                limit: limit || this.limit,
            });
            return results.points.map((point) => {
                return {
                    key: point.id,
                    value: JSON.stringify(point.payload),
                    similarity: point.score,
                };
            });
        }
        catch (error) {
            throw this.handleError("searching", error);
        }
    }
    async delete(key) {
        try {
            await this.client.delete(this.collectionName, {
                points: [key],
            });
        }
        catch (error) {
            throw this.handleError("deleting", error);
        }
    }
}
exports.QdrantKnowledgebase = QdrantKnowledgebase;
