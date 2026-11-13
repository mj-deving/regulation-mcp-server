// Pure grading logic, shared by the Mastra scorers and the unit tests. Nothing here calls a model,
// so the eval gate is deterministic: the same answer text and retrieval always score the same.

export const REFUSAL_MARKER = "[KEINE_GRUNDLAGE]";

const CITATION = /\[chunk:([a-z0-9-]+)\]/gu;

/** Unique chunk ids cited as `[chunk:<id>]`, in order of first appearance. */
export function parseCitations(answer: string): string[] {
  return [...new Set([...answer.matchAll(CITATION)].map((m) => m[1] as string))];
}

export function isRefusal(answer: string): boolean {
  return answer.includes(REFUSAL_MARKER);
}

/**
 * 1 when every cited chunk was actually retrieved in this run, else 0.
 * An answer that is neither a refusal nor cites anything scores 0: an uncited claim is the
 * failure this gate exists for. A refusal without citations scores 1.
 */
export function citationValidity(answer: string, retrievedIds: ReadonlySet<string>): number {
  const cited = parseCitations(answer);
  if (cited.length === 0) return isRefusal(answer) ? 1 : 0;
  return cited.every((id) => retrievedIds.has(id)) ? 1 : 0;
}

export type ExpectedOutcome = "answered" | "refused";

/** 1 when the agent answered/refused as expected. */
export function refusalCorrectness(expected: ExpectedOutcome, answer: string): number {
  return (expected === "refused") === isRefusal(answer) ? 1 : 0;
}

/**
 * Share of expected chunks the answer cites. `null` (not scorable) for cases that expect a
 * refusal, and for answered cases the agent wrongly refused (refusal correctness counts those).
 */
export function citationRecall(expectedChunks: readonly string[], answer: string): number | null {
  if (expectedChunks.length === 0 || isRefusal(answer)) return null;
  const cited = new Set(parseCitations(answer));
  return expectedChunks.filter((id) => cited.has(id)).length / expectedChunks.length;
}

/** Lowercase, collapse whitespace, and drop thousands separators between digits. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/(?<=\d)[.\s ](?=\d{3}\b)/gu, "")
    .replace(/\s+/gu, " ");
}

/**
 * Share of expected facts present in the answer. A fact may list alternatives separated by `|`
 * ("35000000|35 millionen"); any one counts. `null` when the case lists no facts or the agent
 * refused.
 */
export function factCoverage(facts: readonly string[] | undefined, answer: string): number | null {
  if (facts === undefined || facts.length === 0 || isRefusal(answer)) return null;
  const text = normalize(answer);
  const hits = facts.filter((fact) =>
    fact.split("|").some((alt) => text.includes(normalize(alt.trim()))),
  );
  return hits.length / facts.length;
}
