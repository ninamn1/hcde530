"""Load survey responses from CSV and report per-response word counts plus summary stats."""
import csv

filename = "demo_responses.csv"
responses = []

# DictReader: each row is a dict keyed by column name (participant_id, role, response).
# UTF-8 + newline="" keep special characters and tricky line breaks from breaking the file read.
with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        responses.append(row)

def count_words(response):
    """Count the number of words in a response string.

    Takes a string, splits it on whitespace, and returns the word count.
    Used to measure response length across all participants.
    """
    return len(response.split())


# Count words in each response and print a row-by-row summary so that we have readable output
print(f"{'ID':<6} {'Role':<22} {'Words':<6} {'Response (first 60 chars)'}")
print("-" * 75)

word_counts = []

# Per row: ID, role, word count, and a text snippet so we can scan answers without reopening the CSV.
for row in responses:
    participant = row["participant_id"]
    role = row["role"]
    response = row["response"]

    count = count_words(response)
    word_counts.append(count)

    # 60 chars: long answers stay skimmable in a fixed-width terminal column.
    if len(response) > 60:
        preview = response[:60] + "..."
    else:
        preview = response

    print(f"{participant:<6} {role:<22} {count:<6} {preview}")

# Quantitative overview: how many responses, range of lengths, and average next to the detailed table.
print()
print("── Summary ─────────────────────────────────")
print(f"  Total responses : {len(word_counts)}")
print(f"  Shortest        : {min(word_counts)} words")
print(f"  Longest         : {max(word_counts)} words")
print(f"  Average         : {sum(word_counts) / len(word_counts):.1f} words")