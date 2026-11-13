import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CHUNK_ID, loadCorpus, ROOT, sha256 } from "../src/corpus";

const provenance = JSON.parse(readFileSync(join(ROOT, "corpus", "PROVENANCE.json"), "utf8")) as {
  files: Record<string, string>;
};

describe("copied corpus", () => {
  test("copied files match the recorded hashes byte for byte", () => {
    for (const [file, hash] of Object.entries(provenance.files)) {
      expect(sha256(readFileSync(join(ROOT, file)))).toBe(hash);
    }
  });

  // Runs only on a machine that also has the source repo checked out next to this one.
  const sibling = join(ROOT, "..", "agentic-rag-mastra");
  test.skipIf(!existsSync(sibling))("copies are byte-identical to the source repo", () => {
    expect(readFileSync(join(ROOT, "corpus", "chunks.json"))).toEqual(readFileSync(join(sibling, "corpus", "chunks.json")));
    expect(readFileSync(join(ROOT, "src", "grading.ts"))).toEqual(readFileSync(join(sibling, "src", "lib", "grading.ts")));
  });

  test("every snapshot matches its provenance hash and every chunk is a verbatim substring", () => {
    const dir = join(ROOT, "corpus", "sources");
    const snapshots = new Map<number, string>();
    for (const f of readdirSync(dir).filter((f) => f.endsWith(".provenance.json"))) {
      const p = JSON.parse(readFileSync(join(dir, f), "utf8")) as { article: number; sha256: string };
      const text = readFileSync(join(dir, f.replace(".provenance.json", ".source.txt")), "utf8");
      expect(sha256(text)).toBe(p.sha256);
      snapshots.set(p.article, text);
    }
    const chunks = loadCorpus("eu-ai-act");
    expect(chunks).toHaveLength(66);
    for (const c of chunks) expect(snapshots.get(c.article)).toContain(c.text);
  });

  test("ids match the schema regex; planted ids are new and only in the injection corpus", () => {
    const real = loadCorpus("eu-ai-act");
    const injected = loadCorpus("injection");
    for (const c of injected) expect(c.id).toMatch(CHUNK_ID);
    const realIds = new Set(real.map((c) => c.id));
    const planted = injected.slice(real.length);
    expect(planted).toHaveLength(5);
    for (const c of planted) expect(realIds.has(c.id)).toBe(false);
    expect(new Set(injected.map((c) => c.id)).size).toBe(injected.length);
  });
});
