import csv

# Fixed ValueError: Originally couldn't run the script because of an invalid string literal.
# Parse numeric cells: digits first, then a small word list (e.g. "fifteen" -> 15) so analysis can use real numbers.
def parse_int(value: str) -> int | None:
    if value is None:
        return None

    text = str(value).strip()
    if not text:
        return None

    try:
        return int(text)
    except (TypeError, ValueError):
        pass

    word_to_int = {
        "zero": 0,
        "one": 1,
        "two": 2,
        "three": 3,
        "four": 4,
        "five": 5,
        "six": 6,
        "seven": 7,
        "eight": 8,
        "nine": 9,
        "ten": 10,
        "eleven": 11,
        "twelve": 12,
        "thirteen": 13,
        "fourteen": 14,
        "fifteen": 15,
        "sixteen": 16,
        "seventeen": 17,
        "eighteen": 18,
        "nineteen": 19,
        "twenty": 20,
    }

    return word_to_int.get(text.lower())

# For each department, count people and average years of experience (uses parse_int for years).
def department_experience_summary(rows: list[dict[str, str]]) -> list[tuple[str, int, float]]:
    """Summarize participants by department and average experience.

    Args:
        rows: List of CSV rows (each row is a dict from column name to value).

    Returns:
        A list of tuples: (department, n_participants, avg_years_experience).

        - `department` is normalized with `.strip().title()`. Missing departments become "(Missing)".
        - `n_participants` counts all rows in that department (even if experience is missing/non-numeric).
        - `avg_years_experience` uses `parse_int` on `experience_years`. Digit strings and mapped word
          numbers (e.g. "fifteen" -> 15) count toward the average; anything `parse_int` cannot read is
          skipped. If a department has no usable experience values, its average is 0.0.

    Note:
        This function does not sort the output; sort the returned list at the call site.
    """
    dept_counts: dict[str, int] = {}
    dept_exp_sum: dict[str, int] = {}
    dept_exp_n: dict[str, int] = {}

    for row in rows:
        dept = (row.get("department") or "").strip().title() or "(Missing)"
        dept_counts[dept] = dept_counts.get(dept, 0) + 1

        years = parse_int((row.get("experience_years") or "").strip())
        if years is None:
            continue

        dept_exp_sum[dept] = dept_exp_sum.get(dept, 0) + years
        dept_exp_n[dept] = dept_exp_n.get(dept, 0) + 1

    summary: list[tuple[str, int, float]] = []
    for dept, n_participants in dept_counts.items():
        n_years = dept_exp_n.get(dept, 0)
        avg_years = (dept_exp_sum.get(dept, 0) / n_years) if n_years else 0.0
        summary.append((dept, n_participants, avg_years))

    return summary


# Write one results CSV with tagged sections (roles, departments, overall average, top satisfaction).
def write_analysis_csv(
    output_path: str,
    role_counts: dict[str, int],
    dept_summary: list[tuple[str, int, float]],
    avg_experience: float,
    top5: list[tuple[str, int]],
) -> None:
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["section", "key", "value", "extra"],
        )
        writer.writeheader()

        for role, count in sorted(role_counts.items()):
            writer.writerow(
                {"section": "role_counts", "key": role, "value": count, "extra": ""}
            )

        for dept, n_participants, avg_years in dept_summary:
            writer.writerow(
                {
                    "section": "dept_avg_experience",
                    "key": dept,
                    "value": f"{avg_years:.2f}",
                    "extra": f"n={n_participants}",
                }
            )

        writer.writerow(
            {
                "section": "overall_avg_experience",
                "key": "all_participants",
                "value": f"{avg_experience:.2f}",
                "extra": "",
            }
        )

        for name, score in top5:
            writer.writerow(
                {"section": "top5_satisfaction", "key": name, "value": score, "extra": ""}
            )


# Cleaning function: trim fields, title-case labels, parse numeric columns into digit strings (or blank).
def clean_survey_rows(rows: list[dict[str, str]], fieldnames: list[str]) -> list[dict[str, str]]:
    cleaned: list[dict[str, str]] = []

    for row in rows:
        out: dict[str, str] = {}

        for field in fieldnames:
            out[field] = (row.get(field) or "").strip()

        if "role" in out:
            out["role"] = out["role"].title()
        if "department" in out:
            out["department"] = out["department"].title()
        if "primary_tool" in out:
            out["primary_tool"] = out["primary_tool"].title()

        if "experience_years" in out:
            years = parse_int(out["experience_years"])
            out["experience_years"] = "" if years is None else str(years)

        if "satisfaction_score" in out:
            score = parse_int(out["satisfaction_score"])
            out["satisfaction_score"] = "" if score is None else str(score)

        cleaned.append(out)

    return cleaned


# Read messy CSV → clean_survey_rows → write a new cleaned CSV (original file unchanged).
def write_clean_survey_csv(
    input_path: str,
    output_path: str,
) -> None:
    with open(input_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            raise ValueError("Input CSV has no header row.")
        cleaned = clean_survey_rows(list(reader), list(reader.fieldnames))

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(cleaned[0].keys()) if cleaned else [])
        writer.writeheader()
        writer.writerows(cleaned)


# Part 1: Cleaned the messy survey data and wrote a new cleaned CSV file.
# a) Load messy survey into memory.
filename = "week3_survey_messy.csv"
rows = []

with open(filename, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append(row)

# b) Write cleaned survey to a new file.
cleaned_filename = "week3_survey_cleaned.csv"
write_clean_survey_csv(filename, cleaned_filename)
print(f"Wrote cleaned survey CSV: {cleaned_filename}")


# Part 2: Created a new analysis CSV file with the summarized analysis.
# a) Count responses by role (normalize capitalization so the same role strings match).
role_counts = {}

for row in rows:
    role = row["role"].strip().title()
    if role in role_counts:
        role_counts[role] += 1
    else:
        role_counts[role] = 1

print("Responses by role:")
for role, count in sorted(role_counts.items()):
    print(f"  {role}: {count}")

# b) Department averages (highest average first in the printout).
dept_summary = department_experience_summary(rows)
dept_summary.sort(key=lambda x: x[2], reverse=True)
print("\nDepartments by average experience (high -> low):")
for dept, n_participants, avg_years in dept_summary:
    print(f"  {dept}: avg {avg_years:.1f} years (n={n_participants})")


# c) Overall average years of experience (same parse_int rule as elsewhere so word-years count if mapped).
total_experience = 0
valid_experience_rows = 0

for row in rows:
    years = parse_int((row.get("experience_years") or "").strip())
    if years is None:
        continue
    total_experience += years
    valid_experience_rows += 1

avg_experience = total_experience / valid_experience_rows
print(f"\nAverage years of experience: {avg_experience:.1f}")

# d) Top 5 satisfaction scores (sort, take top five, print highest-first).
# Fixed logic bug: Originally took the lowest 5 satisfaction scores instead of the highest 5.
scored_rows = []
for row in rows:
    if row["satisfaction_score"].strip():
        scored_rows.append((row["participant_name"], int(row["satisfaction_score"])))

scored_rows.sort(key=lambda x: x[1])
top5 = scored_rows[-5:]
top5.sort(key=lambda x: x[1], reverse=True)

print("\nTop 5 satisfaction scores:")
for name, score in top5:
    print(f"  {name}: {score}")

# e) Save analysis summary to CSV.
output_csv = "week3_analysis_results.csv"
write_analysis_csv(output_csv, role_counts, dept_summary, avg_experience, top5)
print(f"\nWrote analysis CSV: {output_csv}")
