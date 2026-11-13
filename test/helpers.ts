import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Chunk } from "../src/corpus";
import type { Embedder } from "../src/ollama";
import { createServer } from "../src/server";
import { buildIndex } from "../src/vector-index";

/** Deterministic bag-of-words embedding, so search runs offline in tests. */
export const fakeEmbed: Embedder = async (texts) =>
  texts.map((t) => {
    const v = new Array<number>(64).fill(0);
    for (const word of t.toLowerCase().split(/\W+/u)) {
      let h = 0;
      for (const ch of word) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      v[h % 64] = (v[h % 64] as number) + 1;
    }
    return v;
  });

export async function connect(server: McpServer): Promise<Client> {
  const [a, b] = InMemoryTransport.createLinkedPair();
  await server.connect(a);
  const client = new Client({ name: "test", version: "0" });
  await client.connect(b);
  return client;
}

export async function serve(chunks: Chunk[], datamark = false, embed: Embedder = fakeEmbed): Promise<Client> {
  const index = await buildIndex(chunks, fakeEmbed, "fake");
  return connect(createServer({ chunks, index, embed, datamark }));
}
