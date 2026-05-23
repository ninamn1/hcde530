# Mini Project 2 — Project Declaration

## Working title
**Transcript Prep Assistant** — a computational tool to speed up UX interview transcript review before affinity mapping.

## Problem
Reviewing user interview transcripts is necessary but tedious: researchers skim long text to capture unique points and pull quotes for affinity mapping. That work is easy to procrastinate on, yet it blocks downstream synthesis, analysis, and strategic thinking.

## Users
**Primary:** UX researchers and others in HCD who regularly work with qualitative interview data.

**Value:** Reduce time on repetitive transcript reading so researchers can spend more effort on analysis, pattern-finding, and strategic decisions. The tool supports prep; it does not replace researcher judgment.

## Data

| | Description |
|---|---|
| **Inputs (MVP)** | Raw interview transcripts (text upload or paste). |
| **Inputs (stretch)** | Audio (only if transcribed first); optional researcher notes highlighting key moments. |
| **Outputs** | Bullet points suitable for affinity-mapping prep; quote snippets with enough context to cite; a short preliminary analysis (themes, patterns, open questions). |
| **Batch (stretch)** | Run the same pipeline on multiple transcripts and produce one combined preliminary analysis. |

**Data source (TBD):** May use a de-identified real transcript if available; otherwise public or sample interview transcripts from the web. Data choice will be updated once confirmed.

## Definition of done

**Must have (MVP):**
- A working prototype in **Jupyter Notebook**, developed with **Cursor**
- Processes **at least one real (or realistic) transcript** end-to-end
- Produces:
  - A list of bullet "unique points" for affinity prep
  - Selected quote snippets
  - A brief preliminary analysis (themes / early observations)

**Nice to have (if time allows):**
- Optional notes file to steer highlights
- Process **multiple transcripts** and output a merged preliminary analysis

## Out of scope (for MP2)
- Full affinity-mapping or clustering UI
- Team collaboration, accounts, or shared workspaces
- Custom speech-to-text / production transcription pipeline
- Formal accuracy evaluation vs. human coding
- PII/consent management beyond using de-identified or public sample data

## Constraints

| Constraint | Detail |
|---|---|
| **Timeline** | 2–3 weeks |
| **Effort** | ~3–5 hours per week (~6–15 hours total) |
| **Tech** | Jupyter Notebook + Cursor |
| **Team** | Solo project |
| **Data** | Source not finalized; may use public/sample transcripts |
| **Complexity** | Intentionally simple — assistive prep tool, not a full research platform |

## Open questions (to update later)
- Exact transcript source and anonymization approach
- Whether to use an LLM API (and any course/cost/privacy rules)
- Syllabus deliverables beyond the notebook (demo, write-up, video)
- Minimum format for quotes (speaker labels, timestamps, participant IDs)
