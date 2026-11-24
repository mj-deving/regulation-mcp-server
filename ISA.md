---
task: "EU-AI-Act-Korpus als MCP-Server, Tool-Call- und Injection-Eval mit lokalem Modell"
slug: 20261109_regulation-mcp-server
project: regulation-mcp-server
effort: advanced
effort_source: inferred
phase: verify
progress: 15/15
mode: interactive
started: 2026-11-09T15:00:00+01:00
updated: 2026-11-09T16:30:00+01:00
---

> **Über diese Datei.** Das ist die ISA (Ideal State Artifact), gegen die dieses Repo gebaut wurde:
> was „fertig“ hieß, mit welcher Probe jedes Kriterium widerlegt würde und was bewusst als Grenze
> stehen blieb. Es ist der Arbeitsstand aus dem Bau, nur um private Bezüge bereinigt; Hinweise wie
> „kein Remote“ oder „ISA.md gitignored“ beschreiben die Zeit vor der Veröffentlichung. Commit-Hashes
> stammen aus der lokalen Vorgeschichte, öffentlich wurde das Repo als neuer Verlauf exportiert. Die
> Leak-Probes lesen ihre Begriffe aus einer lokalen, nicht versionierten Datei `.private-terms`.

## Ideal State

### L3 · One sentence

Ein Repo zeigt mit ehrlichen Zahlen, wie zuverlässig ein lokales Modell typisierte MCP-Tools aufruft und was strukturelle Abwehr gegen Prompt Injection über Tool-Ergebnisse tatsächlich leistet.

### L2 · Summary

Wer Agenten mit MCP baut, klont das Repo, hängt den Server in fünf Minuten in Claude Desktop oder einen anderen MCP-Client und sieht zwei gemessene Antworten auf Architektenfragen.

- MCP-Server mit drei strikt typisierten Tools über den bekannten EU-AI-Act-Korpus (66 Absätze, Hash-gesichert).
- Tool-Call-Eval: richtiges Tool, schema-gültige Argumente, erfundene Tools und IDs, Zitat-Validität, gemessen mit qwen3:8b als MCP-Client.
- Injection-Eval: fünf präparierte Absätze, Rate ohne und mit struktureller Abwehr, getrennt nach „Modell folgt“ und „Wirkung kommt an“.
- Falsifier beweisen, dass beide Evals rot werden können; README trennt, was MCP liefert und was nicht.

### L1 · Full articulation

Der Korpus aus agentic-rag-mastra wird byte-identisch übernommen. Ein MCP-Server (offizielles TypeScript-SDK, stdio) bietet search_regulation, get_chunk und list_articles mit strikten Zod-Schemas. Ein minimaler MCP-Host lässt qwen3:8b über Ollama Tools wählen und zeichnet jeden Aufruf auf. Deterministische Scorer bewerten die Traces, Gates entscheiden. Ein Injection-Korpus fügt fünf Angriffe hinzu (Systemprompt-Leak, Exfiltration per Link, Regel-Override, unnötige Tool-Calls, gefälschte Zitate). Die Abwehr ist strukturell: Datamarking im Server, Follow-up-Allowlist und Egress-Filter im Client. Gemessen wird ohne und mit Abwehr.

## Problem

Tool Calling, MCP und Agent Security hatten in der Showcase-Reihe keinen öffentlichen Beleg. Behauptungen über Tool-Zuverlässigkeit und Injection-Resistenz sind ohne Messung wertlos.

## Vision

Das README beantwortet in zwei Minuten: Wie oft wählt ein 8B-Modell das richtige Tool? Wie oft folgt es eingeschleusten Anweisungen? Welche Abwehr hält deterministisch, welche hängt am Modell?

## Out of Scope

- Kein Hosting, kein Remote, kein Push ohne ausdrückliches Go.
- Keine Cloud-LLMs. Keine Schreibzugriffe nach agentic-rag-mastra.
- Keine HTTP-Transport-Variante, keine Auth (stdio reicht für lokale Clients).

## Constraints

- Bun, TypeScript strict, offizielles `@modelcontextprotocol/sdk`.
- Ollama-Läufe nur unter einem gemeinsamen Ollama-Lock.
- Repo-Dateien ohne private Bezüge, ISA.md gitignored.
- Jeder Diff vor Commit durch autoreview `--engine claude`, explizite Pfade.

## Criteria

- [x] ISC-1: Server bietet genau search_regulation, get_chunk, list_articles mit strikten Schemas; ungültige Argumente (k außerhalb 1..10, fremde Keys, falsche ID-Form, fehlende query) liefern isError.
- [x] ISC-2: `corpus/chunks.json`, Snapshots und `src/grading.ts` sind byte-identisch zur Quelle; Hashes in `corpus/PROVENANCE.json`, jeder Chunk ⊂ Snapshot.
- [x] ISC-3: `bun run ingest` baut bge-m3-Indizes für beide Korpora; ein veralteter Index wird verworfen (Fingerprint).
- [x] ISC-4: Tool-Call-Eval läuft 52 Fälle (40 golden + 12 get/list) über stdio mit qwen3:8b und misst richtiges Tool, Schema-Gültigkeit, unbekannte Tools, erfundene IDs, Zitat-Validität.
- [x] ISC-5: Zitat-Validität nutzt dieselbe Regel wie grading.ts (zitiert ⊂ in diesem Lauf geliefert) und zusätzlich ⊂ Korpus.
- [x] ISC-6: Injection-Eval misst 5 Angriffsarten × 3 Fragen ohne und mit Abwehr, getrennt nach Exposition, Befolgung und Wirkung.
- [x] ISC-7: Mindestens eine strukturelle Abwehr ist gebaut und gemessen (Datamarking, Follow-up-Allowlist, Egress-Filter).
- [x] ISC-8: Falsifier: geskriptetes korrektes Modell besteht alle Gates; jede der fünf Client-Störungen und ein kaputtes Tool macht ihr Gate rot; ein gehorsames Modell macht die Injection-Rate 1.
- [x] ISC-9: `bun run check` ist grün ohne Ollama.
- [x] ISC-10: Ergebnisse mit echten Zahlen liegen committet in `results/`, Fehlschläge inklusive.
- [x] ISC-11: README hat Quickstart (inkl. Claude-Desktop-Konfiguration), Architecture, Results mit Fehlschlägen, „What MCP gives you and what it doesn't“, Lethal-Trifecta-Einordnung in eigenen Worten.
- [x] ISC-12: Anti: README nennt keine Zahl, die nicht in `results/` steht.
- [x] ISC-13: Anti: keine privaten Bezüge, keine Secrets, keine lokalen Pfade im Repo.
- [x] ISC-14: Anti: kein Schreibzugriff auf agentic-rag-mastra.

## Test Strategy

| isc | type | check | threshold | tool | anchors_to |
|-----|------|-------|-----------|------|------------|
| ISC-1 | bash | Server-Vertrag, 7 Fehlerfälle | alle grün | bun test test/server.test.ts | |
| ISC-2 | bash | Hashes, Byte-Identität, Substring | alle grün | bun test test/corpus.test.ts | |
| ISC-3 | bash | Ingest zweimal, gleiche Datei | identischer Hash | `bun run ingest` ×2, shasum data/ | |
| ISC-4 | bash | Eval-Lauf | Ergebnisdatei mit 52 Fällen | `bun run eval:tools` | |
| ISC-5 | bash | Kaputtes Tool → Zitat-Gate rot | rot | bun test test/falsifier.test.ts | |
| ISC-6 | bash | Injection-Lauf | Ergebnisdatei baseline + mitigated | `bun run eval:injection` | |
| ISC-7 | bash | Abwehr gegen gehorsames Modell | 4/5 Angriffe Wirkung 0 | bun test test/falsifier.test.ts | |
| ISC-8 | bash | Falsifier-Suite | alle grün; Mutation Egress/Korpus-Schnitt → rot | bun test test/falsifier.test.ts | |
| ISC-9 | bash | Check ohne Ollama | exit 0 | `bun run check` | |
| ISC-10 | bash | Ergebnisse in HEAD | ≥ 2 json | `git ls-files results/` | |
| ISC-11 | bash | README-Abschnitte | 4 Überschriften | `rg "^## " README.md` | |
| ISC-12 | manual | Zahlenabgleich README ↔ results | jede Zahl gefunden | bun-Skript gegen results/*.json | |
| ISC-13 | bash | Leak-Grep | 0 Treffer | `git ls-files -z \| xargs -0 rg -il -f .private-terms` plus Secret-Muster | |
| ISC-14 | bash | Quell-Repo unverändert | clean | `git -C ../agentic-rag-mastra status --porcelain` | |
| ISC-15 | bash | Mehrfachzitate, Gate bei Abbruch, fremder Köder | alle grün | bun test test/falsifier.test.ts | |

- [x] ISC-15: Zitat-Scorer und Egress-Filter lesen jede ID in jeder Klammerform; das Injection-Gate ist rot bei Fehl-/Leerläufen oder unexponierten Angriffen; jeder abgerufene Köder zählt für seinen eigenen Angriff. Evidenz: autoreview-P1-Befunde behoben (`src/eval.ts`, `src/agent.ts`, `scripts/report.ts`, `scripts/eval-*.ts`, `scripts/rescore.ts`), 32/32 Tests, zweites autoreview scoped-clean, Commit febb049.

## Decisions

- 2026-11-09: Nach Review-Fix wurden die gespeicherten Traces mit `scripts/rescore.ts` neu bewertet statt neu gefahren: Filter und Scorer sind reine Funktionen der Modellausgabe.

- 2026-11-09: In-Memory-Cosine statt Vektor-DB: 71 Vektoren, exakt, keine Abhängigkeit.
- 2026-11-09: Ollama per fetch statt SDK, `think: false`, temperature 0, num_ctx 8192.
- 2026-11-09: Zitat-Validität schneidet zusätzlich mit dem Korpus, sonst bleibt ein Tool mit verstümmelten IDs grün (Falsifier zeigte das).
- 2026-11-09: Injection-Metrik trennt „Modell folgt“ (Rohantwort, Tool-Calls) von „Wirkung kommt an“ (nach Filter/Blockade); Raten nur über exponierte Fälle.

## Evidence

- 2026-11-09: `bun test` 29/29 grün, `tsc --noEmit` sauber, ohne Ollama. Mutation „Egress-Filter aus“ → Injection-Falsifier rot; „Korpus-Schnitt aus“ → Broken-Tool-Falsifier rot.
- 2026-11-09 ISC-3: `bun run ingest` zweimal, SHA-256 beider Indexdateien identisch (66 bzw. 71 Vektoren, 1024 Dim).
- ISC-4/6/10: drei Läufe (tools baseline, tools mitigated, injection) unter Ollama-Lock, committet in febb049. Tool: right tool 82,7 % / 76,9 %, Schema 100 %, 0 unbekannte Tools, 0 erfundene IDs, Zitat-Validität 97,9 % / 93,8 %. Injection: 13/15 exponiert, 1/13 befolgt (override), Wirkung 7,7 % in beiden Modi.
- ISC-5/7/8: `bun run check` 32/32 grün; Positivkontrolle besteht Gate, gehorsames Modell und Ollama-Ausfall machen es rot.
- autoreview --engine claude P1: Lauf 1 drei P1 (Mehrfachzitat-Bypass, Gate bei Abbruch grün, nur gelabelter Köder). Alle gefixt, Traces mit scripts/rescore.ts neu bewertet. Lauf 2: scoped-clean.
- ISC-12: README-Zahlen gegen results/*.json abgeglichen (auch durch autoreview nachgerechnet).
- ISC-13: Leak-Grep 0 Treffer. ISC-14: Quell-Repo-Änderungen stammen aus einem parallelen Arbeitsstrang (guard); chunks.json und grading.ts dort unverändert, Byte-Test grün.
