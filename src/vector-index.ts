import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type Chunk, type CorpusVariant, corpusFingerprint, ROOT } from "./corpus";
import type { Embedder } from "./ollama";

// 66 vectors fit in memory; a brute-force cosine scan is exact and needs no vector database.
// ponytail: linear scan, swap for an ANN index if the corpus grows past ~100k chunks.

export type VectorIndex = {
  model: string;
  corpusFingerprint: string;
  ids: string[];
  vectors: number[][];
};

export function indexPath(variant: CorpusVariant): string {
  return join(ROOT, "data", `index-${variant}.json`);
}

export async function buildIndex(chunks: Chunk[], embed: Embedder, model: string): Promise<VectorIndex> {
  return {
    model,
    corpusFingerprint: corpusFingerprint(chunks),
    ids: chunks.map((c) => c.id),
    vectors: await embed(chunks.map((c) => c.text)),
  };
}

/** Loads the index for a corpus, or null if it is missing or was built from other chunks. */
export function loadIndex(variant: CorpusVariant, chunks: Chunk[]): VectorIndex | null {
  const path = indexPath(variant);
  if (!existsSync(path)) return null;
  const index = JSON.parse(readFileSync(path, "utf8")) as VectorIndex;
  return index.corpusFingerprint === corpusFingerprint(chunks) ? index : null;
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i] as number;
    const y = b[i] as number;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function topK(index: VectorIndex, query: number[], k: number): { id: string; score: number }[] {
  return index.vectors
    .map((v, i) => ({ id: index.ids[i] as string, score: cosine(query, v) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
