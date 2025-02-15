import { Knowledgebase } from "../client/types.gen.js";
import { KnowledgebaseClass } from "./types.js";
export type KnowledgebaseConfig = {
    type: string;
    knowledgeBase: Knowledgebase;
    connection: {
        url?: string;
        secrets?: any;
        config?: any;
    };
};
export declare class KnowledgebaseFactory {
    static create(config: KnowledgebaseConfig): Promise<KnowledgebaseClass>;
}
