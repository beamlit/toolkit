import { StructuredTool, tool } from "@langchain/core/tools";
import { FastifyRequest } from "fastify";
import { Function, FunctionSchema, FunctionSpec } from "../client/types.gen.js";
import { getSettings } from "../common/settings.js";
import { slugify } from "../common/slugify.js";
import { logger, newClient } from "../index.js";
import { schemaToZodSchema } from "./common.js";
import { RemoteToolkit } from "./remote.js";

/**
 * A variadic callback function.
 * @param args - Arguments of any type.
 * @returns Any type.
 */
export type CallbackFunctionVariadic = (...args: any[]) => any;

/**
 * Type for wrapping functions with additional options.
 * @param func - The callback function to wrap.
 * @param options - Optional function options.
 * @returns A promise that resolves to a FunctionBase object.
 */
export type WrapFunctionType = (
  func: CallbackFunctionVariadic,
  options?: FunctionOptions
) => Promise<FunctionBase>;

/**
 * Base structure for a function.
 */
export type FunctionBase = {
  /**
   * Executes the function with the given request.
   * @param request - The Fastify request object.
   * @returns A promise resolving to any type.
   */
  run(request: FastifyRequest): Promise<any>;

  /**
   * The function metadata.
   */
  function: Function;

  /**
   * An array of structured tools associated with the function.
   */
  tools: StructuredTool[];
};

/**
 * Options for configuring a function.
 */
export type FunctionOptions = {
  /**
   * The Function object.
   */
  function?: Function;

  /**
   * The name of the function.
   */
  name?: string;

  /**
   * A description of the function.
   */
  description?: string;

  /**
   * Schema for the function.
   */
  schema?: FunctionSchema;
};

/**
 * Wraps a callback function with additional functionality.
 * @param func - The callback function to wrap.
 * @param options - Optional function options.
 * @returns A promise that resolves to a FunctionBase object.
 */
export const wrapFunction: WrapFunctionType = async (
  func: CallbackFunctionVariadic,
  options: FunctionOptions | null = null
): Promise<FunctionBase> => {
  const settings = getSettings();
  const client = newClient();

  const description =
    options?.function?.spec?.description ?? options?.description ?? "";

  const schema: FunctionSchema =
    options?.schema ?? options?.function?.spec?.schema ?? {};

  const functionSpec: FunctionSpec = {
    description,
    schema,
    ...(options?.function?.spec ? { ...options.function.spec } : {}),
  };
  const name = slugify(
    options?.name || options?.function?.metadata?.name || ""
  );
  const functionBlaxel: Function = {
    metadata: {
      name: name || slugify(func.name),
      displayName:
        options?.function?.metadata?.displayName || name || slugify(func.name),
    },
    spec: functionSpec,
  };

  const zodSchema = schemaToZodSchema(schema);
  let toolBlaxel: StructuredTool[];
  if (settings.remote) {
    const toolkit = new RemoteToolkit(
      client,
      functionBlaxel.metadata?.name || ""
    );
    await toolkit.initialize();
    toolBlaxel = await toolkit.getTools();
  } else {
    toolBlaxel = [
      tool(
        (options) => {
          logger.info(
            `Tool call ${
              functionBlaxel.metadata?.name
            } with arguments: ${JSON.stringify(options)}`
          );
          return func(options);
        },
        {
          name: functionBlaxel.metadata?.name || "",
          description: functionBlaxel.spec?.description || "",
          schema: zodSchema,
        }
      ),
    ];
  }
  return {
    async run(request: FastifyRequest): Promise<any> {
      try {
        const body = await request.body;
        if (func.constructor.name === "AsyncFunction") {
          return await func(body);
        }
        return func(body);
      } catch (error) {
        logger.error(
          `Error running function ${functionBlaxel.metadata?.name}: ${error}`
        );
        throw error;
      }
    },
    function: functionBlaxel,
    tools: toolBlaxel,
  };
};
