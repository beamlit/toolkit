import { Client as ModelContextProtocolClient } from "@modelcontextprotocol/sdk/client/index.js";
import { Function } from "../client/index.js";
import settings from "../common/settings.js";
import { WebSocketClientTransport } from "./transport/websocket.js";
import { Tool } from "./types.js";
import { schemaToZodSchema } from './zodSchema.js';

const McpToolCache = new Map<string, McpTool>()

class McpTool {
  private name: string
  private client: ModelContextProtocolClient
  constructor(name: string) {
    this.name = name
    this.client = new ModelContextProtocolClient(
      {
        name: this.name,
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
  }

  get url() {
    return new URL(`${settings.runUrl}/${settings.workspace}/functions/${this.name}`)
  }

  async refresh() {
    const transport = new WebSocketClientTransport(this.url, settings.headers);
    await this.client.connect(transport);
  }

  async listTools(): Promise<Tool[]> {
    const {tools} = (await this.client.listTools()) as any;
    return tools.map((tool: any) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: schemaToZodSchema(tool.inputSchema),
      call: (input: any) => {
        return this.call(tool.name, input)
      }
    }))
  }

  async call(toolName: string, args: any) {
    console.debug("TOOLCALLING: mcp", toolName, args)
    return this.client.callTool({
      name: toolName,
      arguments: args,
    });
  }
}

export const retrieveMCPClient = async(name: string): Promise<McpTool> => {
  if (McpToolCache.has(name)) {
    return McpToolCache.get(name) as McpTool
  }
  const tool = new McpTool(name)
  McpToolCache.set(name, tool)
  return tool
}

export const getMcpTool = async (functionData: Function): Promise<Tool[]> => {
  const mcpClient = await retrieveMCPClient(functionData.metadata?.name || "")
  await mcpClient.refresh()
  return await mcpClient.listTools()
}
