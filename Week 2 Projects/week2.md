# Week 2 — Competency 2: Code literacy and documentation

## What this competency means (my take)

Competency 2 is about being able to **read a block of code** and **explain what it does** in plain language—not just run it, but say what steps happen, what data moves through, and why those lines matter. **Documentation** is how you make that reasoning visible to others (and to yourself later): comments, structure, and anything that answers “what is this for?”

## Artifacts I’m using to show this

| Focus | File / code | What I’m practicing |
|--------|-------------|---------------------|
| List of app reviews → word counts + summary | `app_review_word_count.py` | Processing text, looping, aggregating (shortest / longest / average length). |
| Reading structured data from a file | `demo_word_count.py` — **CSV read loop** (`csv.DictReader`, `for row in reader`, appending rows) | Loading rows from `demo_responses.csv` so each row is a dictionary keyed by column name. |

Together, these show **the same kind of thinking** in two setups: data baked into the script vs. data loaded from a CSV.

## Documentation I added

I used **comments in the code** to flag what matters. For example, in `app_review_word_count.py` line 4 (right before `main()`):

```text
# Function to count the words in a review
```

That comment signals what the **main script block** is responsible for: walking through reviews, counting words in each one, and printing the summary—not the tiny `count_words` helper above it.

## Notes for later (optional edits)

- Add a one-line note in the README on **how to run** each script and **from which folder** (working directory matters for the CSV path in `demo_word_count.py`).
- If the assignment asks for a specific format, paste the rubric language into a short “Evidence” subsection and map each bullet to a file or line range.
