"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleGenerativeAIEmbeddings = void 0;
const generative_ai_1 = require("@google/generative-ai");
const env_1 = require("@langchain/core/utils/env");
const embeddings_1 = require("@langchain/core/embeddings");
const chunk_array_1 = require("@langchain/core/utils/chunk_array");
/**
 * Class that extends the Embeddings class and provides methods for
 * generating embeddings using the Google Palm API.
 * @example
 * ```typescript
 * const model = new GoogleGenerativeAIEmbeddings({
 *   apiKey: "<YOUR API KEY>",
 *   modelName: "embedding-001",
 * });
 *
 * // Embed a single query
 * const res = await model.embedQuery(
 *   "What would be a good company name for a company that makes colorful socks?"
 * );
 * console.log({ res });
 *
 * // Embed multiple documents
 * const documentRes = await model.embedDocuments(["Hello world", "Bye bye"]);
 * console.log({ documentRes });
 * ```
 */
class GoogleGenerativeAIEmbeddings extends embeddings_1.Embeddings {
    apiKey;
    modelName = "embedding-001";
    model = "embedding-001";
    taskType;
    title;
    stripNewLines = true;
    maxBatchSize = 100; // Max batch size for embedDocuments set by GenerativeModel client's batchEmbedContents call
    client;
    constructor(fields) {
        super(fields ?? {});
        this.modelName =
            fields?.model?.replace(/^models\//, "") ??
                fields?.modelName?.replace(/^models\//, "") ??
                this.modelName;
        this.model = this.modelName;
        this.taskType = fields?.taskType ?? this.taskType;
        this.title = fields?.title ?? this.title;
        if (this.title && this.taskType !== "RETRIEVAL_DOCUMENT") {
            throw new Error("title can only be sepcified with TaskType.RETRIEVAL_DOCUMENT");
        }
        this.apiKey = fields?.apiKey ?? (0, env_1.getEnvironmentVariable)("GOOGLE_API_KEY");
        if (!this.apiKey) {
            throw new Error("Please set an API key for Google GenerativeAI " +
                "in the environmentb variable GOOGLE_API_KEY " +
                "or in the `apiKey` field of the " +
                "GoogleGenerativeAIEmbeddings constructor");
        }
        this.client = new generative_ai_1.GoogleGenerativeAI(this.apiKey).getGenerativeModel({
            model: this.model,
        });
    }
    _convertToContent(text) {
        const cleanedText = this.stripNewLines ? text.replace(/\n/g, " ") : text;
        return {
            content: { role: "user", parts: [{ text: cleanedText }] },
            taskType: this.taskType,
            title: this.title,
        };
    }
    async _embedQueryContent(text) {
        const req = this._convertToContent(text);
        const res = await this.client.embedContent(req);
        return res.embedding.values ?? [];
    }
    async _embedDocumentsContent(documents) {
        const batchEmbedChunks = (0, chunk_array_1.chunkArray)(documents, this.maxBatchSize);
        const batchEmbedRequests = batchEmbedChunks.map((chunk) => ({
            requests: chunk.map((doc) => this._convertToContent(doc)),
        }));
        const responses = await Promise.allSettled(batchEmbedRequests.map((req) => this.client.batchEmbedContents(req)));
        const embeddings = responses.flatMap((res, idx) => {
            if (res.status === "fulfilled") {
                return res.value.embeddings.map((e) => e.values || []);
            }
            else {
                return Array(batchEmbedChunks[idx].length).fill([]);
            }
        });
        return embeddings;
    }
    /**
     * Method that takes a document as input and returns a promise that
     * resolves to an embedding for the document. It calls the _embedText
     * method with the document as the input.
     * @param document Document for which to generate an embedding.
     * @returns Promise that resolves to an embedding for the input document.
     */
    embedQuery(document) {
        return this.caller.call(this._embedQueryContent.bind(this), document);
    }
    /**
     * Method that takes an array of documents as input and returns a promise
     * that resolves to a 2D array of embeddings for each document. It calls
     * the _embedText method for each document in the array.
     * @param documents Array of documents for which to generate embeddings.
     * @returns Promise that resolves to a 2D array of embeddings for each input document.
     */
    embedDocuments(documents) {
        return this.caller.call(this._embedDocumentsContent.bind(this), documents);
    }
}
exports.GoogleGenerativeAIEmbeddings = GoogleGenerativeAIEmbeddings;
