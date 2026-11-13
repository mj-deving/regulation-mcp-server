import { runCases } from "../src/eval";
import { ollamaChat, ollamaConfig } from "../src/ollama";
import { connectStdio, writeResult } from "./lib";
import { toolCases, toolReport } from "./report";

// Tool-call eval: 40 golden questions (expect search_regulation first) plus 12 cases that need
// get_chunk or list_articles. `--mitigated` reruns the same cases with all injection defenses on,
// to measure what the defenses cost on benign traffic.
const mitigated = process.argv.includes("--mitigated");
const cases = toolCases();
const startedAt = new Date().toISOString();

const client = await connectStdio("eu-ai-act", mitigated);
const runs = await runCases(cases, { client, chat: ollamaChat, mitigated, log: console.log });
await client.close();

const mode = mitigated ? "mitigated" : "baseline";
const { json, md, passed } = toolReport(
  { model: ollamaConfig.chatModel, think: ollamaConfig.think, startedAt, mode },
  cases,
  runs.map((r) => r.trace),
);
writeResult(`${startedAt.slice(0, 10)}-tools-${ollamaConfig.chatModel.replace(/[:/]/gu, "-")}-${mode}`, json, md);
console.log(md.split("## Failing")[0]);
process.exit(passed ? 0 : 1);
