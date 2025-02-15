import { Knowledgebase } from "../client/types.gen.js";
import { KnowledgebaseClass, KnowledgebaseSearchResult } from "./types.js";
export declare class PineconeKnowledgebase implements KnowledgebaseClass {
    private client;
    private index;
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
    add(key: string, value: string, infos?: any): Promise<void>;
    search(query: string, filters?: any, scoreThreshold?: number, limit?: number): Promise<Array<KnowledgebaseSearchResult>>;
    delete(key: string): Promise<void>;
}
