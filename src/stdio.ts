#!/usr/bin/env bun
// Entry point for MCP clients (Claude Desktop, Inspector, the eval runner). Logs go to stderr:
// stdout is the protocol channel.
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { type CorpusVariant, loadCorpus } from "./corpus";
import { ollamaEmbed } from "./ollama";
import { createServer } from "./server";
import { loadIndex } from "./vector-index";

const variant: CorpusVariant = process.env.CORPUS === "injection" ? "injection" : "eu-ai-act";
const chunks = loadCorpus(variant);
const index = loadIndex(variant, chunks);
if (index === null) console.error(`[regulation-mcp] no index for ${variant}; run \`bun run ingest\``);

const server = createServer({ chunks, index, embed: ollamaEmbed, datamark: process.env.DATAMARK === "1" });
await server.connect(new StdioServerTransport());
console.error(`[regulation-mcp] serving ${chunks.length} chunks (${variant})`);
