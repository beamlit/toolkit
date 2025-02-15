import { Knowledgebase } from "../client/types.gen.js";
import { KnowledgebaseClass, KnowledgebaseSearchResult } from "./types.js";
export declare class QdrantKnowledgebase implements KnowledgebaseClass {
    private client;
    private collectionName;
    private scoreThreshold;
    private limit;
    private config;
    private secrets;
    private embeddingModel;
    constructor(connection: {
        collectionName?: string;
        scoreThreshold?: number;
        limit?: number;
        config?: any;
        secrets?: any;
    }, knowledgeBase: Knowledgebase);
    handleError(action: string, error: Error): Error;
    getOrCreateCollection(embeddings: {
        size: number;
        distance: string;
    }): Promise<void>;
    add(key: string, value: string, infos?: any): Promise<void>;
    search(query: string, filters?: any, scoreThreshold?: number, limit?: number): Promise<Array<KnowledgebaseSearchResult>>;
    delete(key: string): Promise<void>;
}
