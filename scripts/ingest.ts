import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { type CorpusVariant, loadCorpus } from "../src/corpus";
import { ollamaConfig, ollamaEmbed } from "../src/ollama";
import { buildIndex, indexPath } from "../src/vector-index";

// Embeds both corpora with bge-m3. Idempotent: same chunks in, same file out.
for (const variant of ["eu-ai-act", "injection"] satisfies CorpusVariant[]) {
  const chunks = loadCorpus(variant);
  const index = await buildIndex(chunks, ollamaEmbed, ollamaConfig.embedModel);
  const path = indexPath(variant);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(index));
  console.log(`indexed ${index.ids.length} chunks (${variant}, ${index.vectors[0]?.length} dims) -> ${path}`);
}
