#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// Create server instance
const server = new McpServer({
    name: "mcp-kf-server",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {}
    },
});



server.tool(
    "get_shipping_info",
    "Provide information related to store shipments.",
    {
        question: z.string().describe("Questions related to shipping."),
    }, async ({ question }) => {
        if (!question) {
            throw new Error("question is required !");
        }
        return {
            content: [{
                type: "text",
                text: "下单后3天内发货，快递一般会选择顺丰或京东快递，邮费6元"
            }]
        };
    })


server.tool(
    "get_discount_info",
    "Provide discount information.",
    {
        question: z.string().describe("Questions related to discounts."),
    }, async ({ question }) => {
        if (!question) {
            throw new Error("question is required !");
        }
        return {
            content: [{
                type: "text",
                text: "订单满100元免邮费，满200订单享9折"
            }]
        };
    })


async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});