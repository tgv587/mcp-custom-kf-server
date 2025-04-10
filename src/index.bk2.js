#!/usr/bin/env node

import { Server  } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// Create server instance

const server = new Server({
    name: "mcp-kf-server",
    version: "1.0.0"
  }, {
    capabilities: {
      tools: {}
    }
  });


server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_shipping_info",
                description: "Provide information related to store shipments.",
                inputSchema: {
                    type: "object",
                    properties: {
                        question: {
                            type: "string",
                            description: "Questions related to shipping."
                        }
                    },
                    required: ["question"]
                }
            },
            {
                name: "get_discount_info",
                description: "Provide discount information.",
                inputSchema: {
                    type: "object",
                    properties: {
                        question: {
                            type: "string",
                            description: "Questions related to discounts."
                        }
                    },
                    required: ["question"]
                }
            }
        ]
    };
});


server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const question = String(request.params.arguments?.question);
    if (!question) {
        throw new Error("question is required !");
    }
    switch (request.params.name) {
        case "get_shipping_info": {
            return {
                content: [{
                        type: "text",
                        text: "下单后3天内发货，快递一般会选择顺丰或京东快递，邮费6元"
                    }]
            };
        }
        case "get_discount_info": {
            return {
                content: [{
                        type: "text",
                        text: "订单满100元免邮费，满200订单享9折"
                    }]
            };
        }
        default:
            throw new Error("Unknown tool");
    }
});


async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});