import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { type CorpusVariant, ROOT } from "../src/corpus";

/** Spawns the real server over stdio, exactly as Claude Desktop or any MCP host would. */
export async function connectStdio(variant: CorpusVariant, datamark: boolean): Promise<Client> {
  const env = Object.fromEntries(
    Object.entries(process.env).filter((e): e is [string, string] => e[1] !== undefined),
  );
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [join(ROOT, "src", "stdio.ts")],
    env: { ...env, CORPUS: variant, DATAMARK: datamark ? "1" : "0" },
    stderr: "inherit",
  });
  const client = new Client({ name: "regulation-eval", version: "0.1.0" });
  await client.connect(transport);
  return client;
}

export const pct = (x: number | null) => (x === null ? "–" : `${(x * 100).toFixed(1)} %`);

export function writeResult(name: string, json: unknown, markdown: string): void {
  const dir = join(ROOT, "results");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${name}.json`), `${JSON.stringify(json, null, 2)}\n`);
  writeFileSync(join(dir, `${name}.md`), markdown);
  console.log(`wrote results/${name}.{json,md}`);
}
