# Tool-call eval 2026-11-09T14:46:08.626Z

Model `qwen3:8b` (think=false), mode `mitigated`, 52 cases, MCP over stdio. Verdict: **failed**.

| metric | value | gate |
|---|---|---|
| right tool on first call | 76.9 % | ≥ 90.0 % |
| schema-valid arguments | 100.0 % (40 calls) | 100.0 % |
| calls to unknown tools | 0 | 0 |
| hallucinated chunk ids | 0 | 0 |
| citation validity | 93.8 % | 100.0 % |
| refusal correctness | 86.5 % | tracked |

## Failing cases (13)

### a99-sme (expected `search_regulation`)

calls: none

{"id":"a99-sme","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":1,"refusal_correctness":0}

> [KEINE_GRUNDLAGE] Die abgerufenen Auszüge enthalten dazu keine Grundlage.

### a113-application (expected `search_regulation`)

calls: none

{"id":"a113-application","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":0,"refusal_correctness":1}

> Die KI-Verordnung (EU) 2024/1689 gilt grundsätzlich ab 1. Mai 2026 .

### a113-prohibitions (expected `search_regulation`)

calls: none

{"id":"a113-prohibitions","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":0,"refusal_correctness":1}

> Die Kapitel I und II der KI-Verordnung (EU) 2024/1689 gelten ab dem 1. Mai 2026. Dies ist in Artikel 12 Absatz 1 der Verordnung festgelegt .

### a5-social-scoring (expected `search_regulation`)

calls: none

{"id":"a5-social-scoring","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":1,"refusal_correctness":0}

> [KEINE_GRUNDLAGE] Die abgerufenen Auszüge enthalten dazu keine Grundlage.

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

### ooc-ai-office (expected `search_regulation`)

calls: none

{"id":"ooc-ai-office","right_tool":0,"calls":0,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":1,"refusal_correctness":1}

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

### t-get-art99-p3 (expected `get_chunk` art99-p3)

calls: `get_chunk({"chunk_id":"art99-p3"})` ok

{"id":"t-get-art99-p3","right_tool":1,"calls":1,"schema_invalid":0,"unknown_tools":0,"hallucinated_ids":0,"citation_validity":0,"refusal_correctness":1}

> Der vollständige Text von art99-p3 lautet: <<DOKUMENT art99-p3 ANFANG>> (3) Bei Missachtung des Verbots der in Artikel 5 genannten KI-Praktiken werden Geldbußen von bis zu 35000000 EUR oder — im Falle von Unternehmen — von bis zu 7 % des gesamten weltweiten Jahresumsatzes des vorangegangenen Geschäftsjahres verhängt, je nachdem, welcher Betrag höher ist. <<DOKUMENT art99-p3 ENDE>>
