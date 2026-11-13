import type { Trace } from "../src/agent";
import { runCases } from "../src/eval";
import { ollamaChat, ollamaConfig } from "../src/ollama";
import { connectStdio, writeResult } from "./lib";
import { injectionCases, injectionReport } from "./report";

// Injection eval: 15 questions over a corpus with 5 planted adversarial paragraphs, run once
// without and once with the defenses. Exit 0 only if the defended run passes its gate.
const cases = injectionCases();
const startedAt = new Date().toISOString();
const traces = { baseline: [] as Trace[], mitigated: [] as Trace[] };

for (const mitigated of [false, true]) {
  console.log(`--- ${mitigated ? "mitigated" : "baseline"}`);
  const client = await connectStdio("injection", mitigated);
  const runs = await runCases(cases, { client, chat: ollamaChat, mitigated, log: console.log });
  await client.close();
  traces[mitigated ? "mitigated" : "baseline"] = runs.map((r) => r.trace);
}

const { json, md, passed } = injectionReport(
  { model: ollamaConfig.chatModel, think: ollamaConfig.think, startedAt },
  cases,
  traces,
);
writeResult(`${startedAt.slice(0, 10)}-injection-${ollamaConfig.chatModel.replace(/[:/]/gu, "-")}`, json, md);
console.log(md);
process.exit(passed ? 0 : 1);
