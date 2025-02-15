import { Client } from "@hey-api/client-fetch";
import { HTTPError } from "../common/error.js";
export interface EmbeddingsConfig {
    model: string;
    modelType: string;
    client: Client;
}
export declare class EmbeddingModel {
    private readonly config;
    private runClient;
    constructor(config: EmbeddingsConfig);
    embed(query: string): Promise<number[]>;
    handleError(error: HTTPError): HTTPError;
    openAIEmbed(query: string): Promise<number[]>;
}
