# Week 5 — C5: Data Analysis with Pandas (competency reflection)

**Competency claim:** Using pandas to answer a real question about a dataset—filtering rows, grouping, aggregating, handling missing values; choosing the right pandas operation for what you are trying to find out; and interpreting the result.

This document summarizes a short interview on that competency, with answers refined for clarity.

---

## 1. Question → analysis

**Question:** What makes a pandas analysis “answer a real question” instead of just running code on a table?

**Answer:** Pandas helps retrieve and summarize the parts of the data that speak to a specific research question. The important part is checking that the code actually implements *that* question—not a different one. For example, for one assignment task the analysis needed the **top 10 studios by number of titles** (with average score among those), but the code initially surfaced **studios ranked by highest score** instead. The code could run without error while still answering the wrong thing, so aligning operations with the precise wording of the question matters as much as getting a table out.

---

## 2. Filtering rows

**Question:** What does filtering rows mean, and what changes if you forget that some rows are gone afterward?

**Answer:** Filtering means keeping only rows that meet your criteria (valid inputs, date ranges, etc.) and excluding the rest. Everything after that step—counts, means, groupbys—only sees the rows that remain. Pandas usually isn’t “hiding” rows on its own; `dropna`, `loc` conditions, merges, and similar calls drop rows by rule. The risk is **forgetting** that those rows are excluded when interpreting totals or averages, which is why checking the raw data and the pipeline steps helps.

---

## 3. Missing values (drop vs. “Unknown”)

**Question:** Compare dropping rows with missing `year` vs. keeping them in a group like `"Unknown"`. What does each imply for totals and averages?

**Answer:** If missing years were filled in (correctly or not), group means and rankings could change—so conclusions depend on what you assume about missingness. **Dropping** missing `year` removes those titles from every decade bucket; subgroup totals are smaller and decade averages reflect only titles with a known year in range. **An `"Unknown"` group** keeps those titles visible: you see how many lack a year and their average score, and counts across groups can align with the full sample (if nothing else is dropped). For this project, not imputing missing years was a reasonable scope choice; choosing drop vs. `Unknown` is mainly about **transparency** of missingness in the output.

---

## 4. Group + aggregate

**Question:** What does `groupby(...).agg(mean=..., count=...)` do, and why include both mean and count?

**Answer:** `groupby` splits the table into one subset per category (e.g. each decade or studio). `agg` summarizes each subset with the metrics you name—here, mean score and how many rows (`count`) fall in that group. Reporting **count** alongside **mean** gives context: a high mean from **one** title is much less stable than a mean from **many** titles, so comparisons are easier to read fairly.

---

## 5. Right tool: raw `value_counts` vs. parse → `explode` → `value_counts`

**Question:** Why is `value_counts()` on a raw `genres` cell different from parse → `explode` → `value_counts()` on genre names? When pick the second?

**Answer:** On the raw column, each cell is often one **whole stored value** (e.g. a long string or one blob for the full genre combination for that anime). `value_counts()` then counts **how many anime share that exact full cell**—i.e. repeated **combinations**, not “how often does Action appear.” After **parsing** into a list and **`explode`**, each genre becomes its own row; `value_counts()` on names counts **how many anime tagged each single genre** (a title with Action and Drama adds one to each). Use **parse + explode** when the question is **which individual genres appear most often**; raw `value_counts` fits when the question is really about **most common exact stored strings** (often less useful for “genre popularity”).

---

## 6. Interpretation (small sample in a group)

**Question:** If one decade has the highest average score but only a few anime in the sample, how should you word the conclusion?

**Answer:** Call out the **limitation**: with only a few titles in that bucket, the average is **easy to move** with one or two scores, so it is not strong evidence that that era is “best” overall. Good phrasing ties the claim to **this dataset and filter** (“among top-100 titles with known years in range…”) and notes **small n**. A larger list (e.g. 200–300 titles) can be a design choice to stabilize counts, but it is a scope/sample decision, not a substitute for stating uncertainty when *n* is tiny.

---

## 7. Sanity check

**Question:** Name one quick check to trust a grouped table before writing it up.

**Answer:** Walk the **steps the code actually runs** and confirm they match a workflow you could explain: e.g. separate titles **with** vs. **without** year, bin the dated ones into decade ranges, assign **Unknown** for missing year, then **count** titles per group and **average** score. Tracing the pipeline (and comparing to expectations from raw data) catches mismatches between intent and implementation. Tools like Cursor can implement that workflow quickly; the learner still verifies that the sequence matches the question and their own reasoning.

---

## Takeaway

Pandas is effective when each step is **explicitly tied** to the research question: correct **filters**, clear **handling of missing values**, **`groupby`/`agg`** that match the comparison you want, and **interpretation** that respects **sample size** and **what was excluded**. Checking that outputs answer the *intended* question—not just a plausible one—was illustrated with the studios example (top by title count vs. top by score).
