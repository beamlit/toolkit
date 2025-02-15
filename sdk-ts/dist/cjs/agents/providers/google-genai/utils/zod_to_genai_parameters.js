"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAdditionalProperties = removeAdditionalProperties;
exports.zodToGenerativeAIParameters = zodToGenerativeAIParameters;
exports.jsonSchemaToGeminiParameters = jsonSchemaToGeminiParameters;
const zod_to_json_schema_1 = require("zod-to-json-schema");
function removeAdditionalProperties(
// eslint-disable @typescript-eslint/no-explicit-any
obj) {
    if (typeof obj === "object" && obj !== null) {
        const newObj = { ...obj };
        if ("additionalProperties" in newObj) {
            delete newObj.additionalProperties;
        }
        if ("$schema" in newObj) {
            delete newObj.$schema;
        }
        for (const key in newObj) {
            if (key in newObj) {
                if (Array.isArray(newObj[key])) {
                    newObj[key] = newObj[key].map(removeAdditionalProperties);
                }
                else if (typeof newObj[key] === "object" && newObj[key] !== null) {
                    newObj[key] = removeAdditionalProperties(newObj[key]);
                }
            }
        }
        return newObj;
    }
    return obj;
}
function zodToGenerativeAIParameters(zodObj) {
    // GenerativeAI doesn't accept either the $schema or additionalProperties
    // attributes, so we need to explicitly remove them.
    const jsonSchema = removeAdditionalProperties((0, zod_to_json_schema_1.zodToJsonSchema)(zodObj));
    const { $schema, ...rest } = jsonSchema;
    return rest;
}
function jsonSchemaToGeminiParameters(schema) {
    // Gemini doesn't accept either the $schema or additionalProperties
    // attributes, so we need to explicitly remove them.
    const jsonSchema = removeAdditionalProperties(schema);
    const { $schema, ...rest } = jsonSchema;
    return rest;
}
