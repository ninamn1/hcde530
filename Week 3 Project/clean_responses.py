import argparse
import csv
from pathlib import Path
from typing import Iterable


def clean_rows(rows: Iterable[dict[str, str]]) -> list[dict[str, str]]:
    cleaned: list[dict[str, str]] = []

    for row in rows:
        name = (row.get("name") or "").strip()
        if not name:
            continue

        row["name"] = name

        if "role" in row and row["role"] is not None:
            row["role"] = row["role"].strip().upper()

        cleaned.append(row)

    return cleaned


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Clean responses CSV: drop blank names; uppercase role."
    )
    parser.add_argument(
        "--input",
        default="responses.csv",
        help="Input CSV filename (default: responses.csv)",
    )
    parser.add_argument(
        "--output",
        default="responses_cleaned.csv",
        help="Output CSV filename (default: responses_cleaned.csv)",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)

    with input_path.open("r", newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            raise ValueError("Input CSV has no header row.")
        if "name" not in reader.fieldnames:
            raise KeyError(
                "Input CSV is missing required column 'name'. "
                f"Found columns: {', '.join(reader.fieldnames)}"
            )
        rows = clean_rows(reader)
        fieldnames = list(reader.fieldnames)

    with output_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} rows to {output_path}")


if __name__ == "__main__":
    main()

