import { runAgent } from "../src/agent";
import { ollamaChat } from "../src/ollama";
import { connectStdio } from "./lib";

// One question through the local model acting as MCP client. `--mitigated` turns the defenses on.
const mitigated = process.argv.includes("--mitigated");
const question = process.argv.slice(2).filter((a) => a !== "--mitigated").join(" ");
if (question === "") {
  console.error('usage: bun run ask [--mitigated] "<Frage>"');
  process.exit(2);
}
const client = await connectStdio("eu-ai-act", mitigated);
const trace = await runAgent(question, { client, chat: ollamaChat, mitigated });
await client.close();
for (const c of trace.calls) console.log(`→ ${c.name}(${JSON.stringify(c.args)}) ${c.status}`);
console.log(`\n${trace.error ?? trace.answer}`);
