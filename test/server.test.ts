import { describe, expect, test } from "bun:test";
import { loadCorpus } from "../src/corpus";
import { createServer, UNTRUSTED_NOTICE } from "../src/server";
import { connect, fakeEmbed, serve } from "./helpers";

const chunks = loadCorpus("eu-ai-act");
const text = (r: object) => ((r as { content?: unknown }).content as { text: string }[])[0]?.text ?? "";

describe("MCP server contract", () => {
  test("advertises exactly three tools with JSON schemas; k is optional", async () => {
    const client = await serve(chunks);
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual(["get_chunk", "list_articles", "search_regulation"]);
    const search = tools.find((t) => t.name === "search_regulation");
    expect(search?.inputSchema.required).toEqual(["query"]);
    expect(search?.annotations?.readOnlyHint).toBe(true);
  });

  test("search returns k structured results with corpus ids", async () => {
    const client = await serve(chunks);
    const r = await client.callTool({ name: "search_regulation", arguments: { query: "Geldbußen Artikel 5", k: 3 } });
    expect(r.isError).toBeFalsy();
    const results = (r.structuredContent as { results: { chunk_id: string }[] }).results;
    expect(results).toHaveLength(3);
    for (const x of results) expect(chunks.some((c) => c.id === x.chunk_id)).toBe(true);
  });

  test.each([
    ["k above max", "search_regulation", { query: "Bußgeld", k: 50 }],
    ["k not integer", "search_regulation", { query: "Bußgeld", k: 2.5 }],
    ["query too short", "search_regulation", { query: "ab" }],
    ["unknown key", "search_regulation", { query: "Bußgeld", top_k: 3 }],
    ["missing query", "search_regulation", {}],
    ["malformed id", "get_chunk", { chunk_id: "Artikel 50" }],
    ["extra key on list", "list_articles", { article: 5 }],
  ])("rejects invalid arguments: %s", async (_label, name, args) => {
    const client = await serve(chunks);
    const r = await client.callTool({ name, arguments: args });
    expect(r.isError).toBe(true);
  });

  test("get_chunk returns the exact text; an unknown but well-formed id is an error", async () => {
    const client = await serve(chunks);
    const ok = await client.callTool({ name: "get_chunk", arguments: { chunk_id: "art50-p1" } });
    expect((ok.structuredContent as { text: string }).text).toBe(chunks.find((c) => c.id === "art50-p1")?.text as string);
    const missing = await client.callTool({ name: "get_chunk", arguments: { chunk_id: "art50-p9" } });
    expect(missing.isError).toBe(true);
    expect(text(missing)).toContain("list_articles");
  });

  test("list_articles covers all 66 chunks across 7 articles", async () => {
    const client = await serve(chunks);
    const r = await client.callTool({ name: "list_articles", arguments: {} });
    const { articles } = r.structuredContent as { articles: { article: number; chunk_ids: string[] }[] };
    expect(articles.map((a) => a.article)).toEqual([4, 5, 6, 26, 50, 99, 113]);
    expect(articles.flatMap((a) => a.chunk_ids)).toHaveLength(66);
  });

  test("datamarking wraps text and adds the untrusted notice", async () => {
    const client = await serve(chunks, true);
    const r = await client.callTool({ name: "get_chunk", arguments: { chunk_id: "art4-p1" } });
    const s = r.structuredContent as { text: string; notice: string };
    expect(s.notice).toBe(UNTRUSTED_NOTICE);
    expect(s.text.startsWith("<<DOKUMENT art4-p1 ANFANG>>")).toBe(true);
    expect(s.text.endsWith("<<DOKUMENT art4-p1 ENDE>>")).toBe(true);
  });

  test("search without an index fails loudly instead of returning nothing", async () => {
    const client = await connect(createServer({ chunks, index: null, embed: fakeEmbed }));
    const r = await client.callTool({ name: "search_regulation", arguments: { query: "Bußgeld" } });
    expect(r.isError).toBe(true);
    expect(text(r)).toContain("ingest");
  });
});
