"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgebaseFactory = void 0;
const chroma_js_1 = require("./chroma.js");
const pinecone_js_1 = require("./pinecone.js");
const qdrant_js_1 = require("./qdrant.js");
class KnowledgebaseFactory {
    static async create(config) {
        switch (config.type) {
            case "qdrant":
                return new qdrant_js_1.QdrantKnowledgebase(config.connection, config.knowledgeBase);
            case "chroma":
                return new chroma_js_1.ChromaKnowledgebase(config.connection, config.knowledgeBase);
            case "pinecone":
                return new pinecone_js_1.PineconeKnowledgebase(config.connection, config.knowledgeBase);
            default:
                throw new Error(`Unsupported memory store type: ${config.type}`);
        }
    }
}
exports.KnowledgebaseFactory = KnowledgebaseFactory;
