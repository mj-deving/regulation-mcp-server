# Tool-call eval 2026-11-09T14:40:28.728Z

Model `qwen3:8b` (think=false), mode `baseline`, 52 cases, MCP over stdio. Verdict: **failed**.

| metric | value | gate |
|---|---|---|
| right tool on first call | 82.7 % | ≥ 90.0 % |
| schema-valid arguments | 100.0 % (43 calls) | 100.0 % |
| calls to unknown tools | 0 | 0 |
| hallucinated chunk ids | 0 | 0 |
| citation validity | 97.9 % | 100.0 % |
| refusal correctness | 86.5 % | tracked |

## Failing cases (9)

### a99-sme (expected `search_regulation`)

calls: none

{"id":"a99-sme","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":1,"refusal_correctness":0}

> [KEINE_GRUNDLAGE] Die abgerufenen Auszüge enthalten dazu keine Grundlage.

### a113-application (expected `search_regulation`)

calls: none

{"id":"a113-application","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":0,"refusal_correctness":1}

> Die KI-Verordnung (EU) 2024/1689 gilt grundsätzlich ab 1. Mai 2026 [chunk:art113-p1].

### a5-realtime-biometric (expected `search_regulation`)

calls: none

{"id":"a5-realtime-biometric","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":1,"refusal_correctness":0}

> [KEINE_GRUNDLAGE] Die abgerufenen Auszüge enthalten dazu keine Grundlage.

### a26-biometric-48h (expected `search_regulation`)

calls: none

{"id":"a26-biometric-48h","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":1,"refusal_correctness":0}

> [KEINE_GRUNDLAGE] Die abgerufenen Auszüge enthalten dazu keine Grundlage.

### ooc-gdpr-fine (expected `search_regulation`)

calls: none

{"id":"ooc-gdpr-fine","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":1,"refusal_correctness":1}

> [KEINE_GRUNDLAGE] Die abgerufenen Auszüge enthalten dazu keine Grundlage.

### ooc-gpai-flops (expected `search_regulation`)

calls: none

{"id":"ooc-gpai-flops","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":1,"refusal_correctness":1}

> [KEINE_GRUNDLAGE] Die abgerufenen Auszüge enthalten dazu keine Grundlage.

### ooc-us-law (expected `search_regulation`)

calls: none

{"id":"ooc-us-law","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":1,"refusal_correctness":1}

> [KEINE_GRUNDLAGE] Die abgerufenen Auszüge enthalten dazu keine Grundlage.

### ooc-sandbox (expected `search_regulation`)

calls: none

{"id":"ooc-sandbox","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":1,"refusal_correctness":1}

> [KEINE_GRUNDLAGE] Die abgerufenen Auszüge enthalten dazu keine Grundlage.

### t-list-has-art10 (expected `list_articles`)

calls: none

{"id":"t-list-has-art10","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":null,"refusal_correctness":0}

> [KEINE_GRUNDLAGE] Die abgerufenen Auszüge enthalten dazu keine Grundlage.
