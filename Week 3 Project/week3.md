# Week 3 — Competency 3: Data Cleaning & File Handling

## What this competency means (in my words)

Data cleaning and file handling mean **standardizing messy inputs** so analysis tools and scripts can **run reliably** and **summarize data correctly**. If values are skipped, misread, or dropped, **conclusions can shift** — so cleaning isn’t cosmetic; it protects the integrity of what we report.

## What I did (concrete)

I started with **`week3_survey_messy.csv`** and **`week3_analysis_buggy.py`**. The script reads survey data from the messy CSV; I inspected the script, **identified and fixed bugs**, and those fixes fed into a cleaned output file, **`week3_survey_cleaned.csv`**. I then **added functions** to `week3_analysis_buggy.py`, and the extended analysis was written out as **`week3_analysis_results.csv`**.

## What was messy in the data

The main issues were **inconsistent capitalization** across text fields (e.g. roles, departments) and **numbers written as words** (e.g. years of experience). Those were **normalized** so word-form numbers could be treated as **integers** for analysis and for the cleaned CSV output.

## Cleaning strategy

For numeric fields, I used a **`parse_int`** helper that first tries normal digit strings (`int(...)`), then falls back to a **word-to-number dictionary** (e.g. `"fifteen"` → `15`) so spelled-out values still count in averages and appear as integers in the cleaned file. That logic lives in `week3_analysis_buggy.py` (roughly the first lines of the script). For text fields, capitalization was normalized separately (e.g. title case on roles/departments/tools).

## File-handling flow

I opened **`week3_survey_messy.csv`** and **`week3_analysis_buggy.py`**, then **ran the script** to surface the bug. After fixing it, the script **produced a cleaned CSV** (`week3_survey_cleaned.csv`) with **consistent capitalization** and **numeric correction** (including word-form numbers as integers). I then **added functions** to `week3_analysis_buggy.py` and wrote **`week3_analysis_results.csv`** with the summarized analysis.

I wasn’t blocked by Windows paths or encoding this week, but I sometimes **double-check filenames** or **keep related files open in tabs** so I can flip between the messy data, the script, and the outputs.

## Why cleaning mattered for analysis

If **experience** was left as text (e.g. a number spelled out as a word), the script could **crash** or **drop** that value when computing numeric summaries. That would change **measures of central tendency** for `experience_years` (like the mean) and any **department-level averages** that depend on valid integers. Converting those values to integers keeps the **experience math trustworthy**.

## Challenges & how I addressed them

**Understanding functions:** At first I wasn’t sure **why functions exist** or **why they’re often placed at the top** of a script. After talking with **Brock**, I understood that Python runs **top to bottom**, so defining a function **first** is like writing a **named set of instructions** that the rest of the program can **call** later. That keeps logic reusable and avoids repeating the same code.

**Git / staging:** In Week 2 I accidentally treated a commit message as if it “applied” to a whole folder in a confusing way. This week I learned to **stage commits deliberately** — I can **choose which files go into each commit** and give **each commit its own message** (even if that means multiple smaller commits instead of one big one).

## Tools & patterns I used

- **Python:** `csv` module (`DictReader` / `DictWriter`), **functions** for reusable logic (e.g. department summaries, writing outputs), and **parsing helpers** (`parse_int` with digit strings plus word-to-number fallback).
- **Files:** Read **`week3_survey_messy.csv`** → write **`week3_survey_cleaned.csv`** and **`week3_analysis_results.csv`**.
- **Git:** More deliberate **staging** so each commit matches the story I intend (instead of bundling unrelated changes).

## Evidence I could point to in an interview

I can walk through **`week3_analysis_buggy.py`** (cleaning + analysis logic), show the before/after data in **`week3_survey_messy.csv`** vs **`week3_survey_cleaned.csv`**, and point to **`week3_analysis_results.csv`** as exported summary output from the script.

## Interview soundbite (two sentences)

When you analyze survey or research data, **standardizing formats** helps tools render summaries correctly. If a value is **overlooked or thrown away** because it didn’t parse cleanly, your **conclusions can change** — so cleaning is part of doing responsible analysis.

## What I’d do differently next time

I’d keep practicing **small, intentional commits** (stage only the files that belong together) and **double-check filenames and tabs** before running a script, so I’m always executing against the dataset I think I’m using.
