import { readFileSync } from "node:fs";
import { join } from "node:path";
import { egressFilter, type Trace } from "../src/agent";
import { ROOT } from "../src/corpus";
import { writeResult } from "./lib";
import { injectionCases, injectionReport, toolCases, toolReport } from "./report";

// Re-applies the current egress filter and scorers to recorded traces, without calling a model.
// Legitimate because both are pure functions of what the model produced (rawAnswer, calls,
// returned ids); the model's behavior is not re-run and not changed. Usage:
//   bun scripts/rescore.ts results/<name>.json [...]

const refilter = (t: Trace, mitigated: boolean): Trace =>
  mitigated && t.error === undefined ? { ...t, answer: egressFilter(t.rawAnswer, new Set(t.returnedIds)) } : t;

for (const file of process.argv.slice(2)) {
  const name = file.replace(/^.*\//u, "").replace(/\.json$/u, "");
  const old = JSON.parse(readFileSync(join(ROOT, "results", `${name}.json`), "utf8"));
  const header = { model: old.model, think: old.think, startedAt: old.startedAt, rescoredAt: new Date().toISOString() };
  if (name.includes("-tools-")) {
    const mitigated = old.mode === "mitigated";
    const r = toolReport({ ...header, mode: old.mode }, toolCases(), old.traces.map((t: Trace) => refilter(t, mitigated)));
    writeResult(name, r.json, r.md);
  } else {
    const r = injectionReport(header, injectionCases(), {
      baseline: old.baseline.traces.map((t: Trace) => refilter(t, false)),
      mitigated: old.mitigated.traces.map((t: Trace) => refilter(t, true)),
    });
    writeResult(name, r.json, r.md);
  }
}
