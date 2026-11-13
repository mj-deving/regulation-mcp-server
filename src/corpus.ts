import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

export const ROOT = join(import.meta.dir, "..");

/** Matches every id in the corpus: art5-p1-ba, art26-p10-0, art99-p6a, art113-p0. */
export const CHUNK_ID = /^art\d{1,3}-p\d{1,2}[a-z]?(-[0-9a-z]{1,2})?$/u;

export const Chunk = z.object({
  id: z.string().regex(CHUNK_ID),
  article: z.number().int().positive(),
  text: z.string().min(1),
});
export type Chunk = z.infer<typeof Chunk>;

/** `eu-ai-act` is the real corpus; `injection` adds the planted adversarial chunks. */
export type CorpusVariant = "eu-ai-act" | "injection";

export function sha256(bytes: string | Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function readChunks(path: string): Chunk[] {
  return z.array(Chunk).parse(JSON.parse(readFileSync(path, "utf8")));
}

export function loadCorpus(variant: CorpusVariant): Chunk[] {
  const real = readChunks(join(ROOT, "corpus", "chunks.json"));
  if (variant === "eu-ai-act") return real;
  return [...real, ...readChunks(join(ROOT, "corpus", "injection", "planted.json"))];
}

/** Identifies the exact chunk set an index was built from, so a stale index is refused. */
export function corpusFingerprint(chunks: readonly Chunk[]): string {
  return sha256(JSON.stringify(chunks));
}
