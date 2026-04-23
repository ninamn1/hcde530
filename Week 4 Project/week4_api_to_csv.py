import csv
import json
import time
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional

from pathlib import Path


BASE_URL = "https://hcde530-week4-api.onrender.com"
REVIEWS_URL = f"{BASE_URL}/reviews"


def http_get_json(url: str, params: Optional[Dict[str, Any]] = None, timeout_s: int = 30) -> Any:
    if params:
        query = urllib.parse.urlencode(params)
        url = f"{url}?{query}"

    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout_s) as resp:
        body = resp.read().decode("utf-8")
    return json.loads(body)


def _get_helpful_votes(review: Dict[str, Any]) -> Optional[int]:
    # The API uses helpful_votes; this keeps the script resilient if naming varies.
    for key in ("helpful_votes", "helpfulVotes", "helpful votes"):
        if key in review:
            try:
                return int(review[key])
            except (TypeError, ValueError):
                return None
    return None


def fetch_all_reviews(limit: int = 200, sleep_s: float = 0.0) -> List[Dict[str, Any]]:
    reviews: List[Dict[str, Any]] = []
    offset = 0

    while True:
        payload = http_get_json(REVIEWS_URL, params={"limit": limit, "offset": offset}, timeout_s=30)

        page = payload.get("reviews", [])
        if not page:
            break

        reviews.extend(page)
        offset += len(page)

        total = payload.get("total")
        if isinstance(total, int) and offset >= total:
            break

        if sleep_s:
            time.sleep(sleep_s)

    return reviews


def normalize_yyyy_mm_dd(date_value: Any) -> Optional[str]:
    if date_value is None:
        return None
    s = str(date_value).strip()
    if not s:
        return None
    # API currently returns YYYY-MM-DD; this also tolerates ISO timestamps.
    if "T" in s:
        s = s.split("T", 1)[0]
    if " " in s:
        s = s.split(" ", 1)[0]
    return s


def main() -> None:
    # 1) Calls the endpoint (base URL) just to verify the API is reachable.
    http_get_json(BASE_URL + "/", timeout_s=30)

    # 2) Requests data about rating and date (pulled from /reviews).
    reviews = fetch_all_reviews()

    # 3) Loops over results and prints app + date (YYYY-MM-DD).
    rows: List[Dict[str, Any]] = []
    for r in reviews:
        app = r.get("app")
        date_ymd = normalize_yyyy_mm_dd(r.get("date"))
        rating = r.get("rating")
        print(f"{app}\t{date_ymd}")
        rows.append({"app": app, "date": date_ymd, "rating": rating})

    # 4) Saves results to CSV.
    out_path = Path(__file__).with_name("week4_review_responses_2.csv")
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["app", "date", "rating"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nSaved {len(rows)} rows to {out_path}")


if __name__ == "__main__":
    main()
