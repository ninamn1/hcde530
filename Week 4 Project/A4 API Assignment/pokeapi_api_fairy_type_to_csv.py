"""Collect Fairy-type data from PokeAPI and export it to CSV.

Calls ``GET https://pokeapi.co/api/v2/type/fairy/`` and pulls out:

- **Pokemon**: species/forms that include the Fairy type (name, URL, slot).
- **Moves**: moves classified as Fairy-type.
- **Damage relations**: how Fairy compares to other types (for example weak to,
  resistant to, super-effective against), using PokeAPI's ``damage_relations``
  groups.

Prints those lists to the console and saves three CSV files next to this script:
``pokeapi_fairy_type_responses_1.csv`` through ``pokeapi_fairy_type_responses_3.csv``.
"""

import csv
import json
import sys
import urllib.request
from pathlib import Path
from typing import Any, Dict, List

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except OSError:
        pass

FAIRY_TYPE_URL = "https://pokeapi.co/api/v2/type/fairy/"


def http_get_json(url: str, timeout_s: int = 30) -> Dict[str, Any]:
    # PokeAPI often returns 403 unless a User-Agent is provided.
    headers = {
        "Accept": "application/json",
        "User-Agent": "hcde530-pokeapi-script/1.0 (course exercise)",
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout_s) as resp:
        body = resp.read().decode("utf-8")
    data = json.loads(body)
    if not isinstance(data, dict):
        raise TypeError("Expected a JSON object from PokeAPI")
    return data

# Identify the name of each fairy type Pokemon and the slot it appears in.
# My favorite type is fairy, so I was curious to see all the Pokemon classified as fairy type.
def print_pokemon_list(entries: List[Dict[str, Any]]) -> None:
    print("\n=== Pokemon (this type) ===")
    for item in entries:
        poke = item.get("pokemon") or {}
        name = poke.get("name", "")
        # Slot 1 is the primary type, Slot 2 is the secondary type.
        slot = item.get("slot")
        url = poke.get("url", "")
        print(f"  {name}\tslot={slot}\t{url}")


# Learn the name of each fairy type move.
# I was curious to see all the fairy type moves and how they're cutely named.
def print_moves_list(moves: List[Dict[str, Any]]) -> None:
    print("\n=== Moves (this type) ===")
    for m in moves:
        name = m.get("name", "")
        url = m.get("url", "")
        print(f"  {name}\t{url}")


# Understand how fairy type compares to other types.
# This helped remind me of how fairy type compares against other types,
# which is useful when deciding which Pokemon to use in a trainer battle.
def print_damage_relations_table(damage_relations: Dict[str, Any]) -> None:
    print("\n=== Damage relations ===")
    rel_width = 22
    type_width = 24
    header = f"{'Relation':<{rel_width}} | {'Related type':<{type_width}}"
    print(header)
    print("-" * len(header))
    for relation_key in sorted(damage_relations.keys()):
        types_list = damage_relations.get(relation_key) or []
        if not isinstance(types_list, list):
            continue
        for t in types_list:
            if not isinstance(t, dict):
                continue
            name = str(t.get("name", ""))
            print(f"{relation_key:<{rel_width}} | {name:<{type_width}}")


# Creates a readable list of Pokemon are classified as fairy type..
def pokemon_rows(pokemon_entries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    for item in pokemon_entries:
        poke = item.get("pokemon") or {}
        rows.append(
            {
                "name": poke.get("name", ""),
                "url": poke.get("url", ""),
                "slot": item.get("slot", ""),
            }
        )
    return rows


# Creates a readable list of moves are classified as fairy type.
def move_rows(moves: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    return [{"name": m.get("name", ""), "url": m.get("url", "")} for m in moves]


# Creates a readable list of how fairy type compares to other types.
def damage_relation_rows(damage_relations: Dict[str, Any]) -> List[Dict[str, Any]]:
    rows: List[Dict[str, Any]] = []
    for relation_key in sorted(damage_relations.keys()):
        types_list = damage_relations.get(relation_key) or []
        if not isinstance(types_list, list):
            continue
        for t in types_list:
            if not isinstance(t, dict):
                continue
            rows.append(
                {
                    "relation_category": relation_key,
                    "related_type_name": t.get("name", ""),
                    "related_type_url": t.get("url", ""),
                }
            )
    return rows


# Writes the lists to a CSV file, so the output can be easily read and analyzed.
def write_csv(path: Path, fieldnames: List[str], rows: List[Dict[str, Any]]) -> None:
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


# Main function that calls the API and writes the lists to CSV files.
def main() -> None:
    # 1) Call the fairy type endpoint.
    data = http_get_json(FAIRY_TYPE_URL)

    # 2) Extract pokemon, moves, damage_relations.
    pokemon_entries = data.get("pokemon") or []
    moves = data.get("moves") or []
    damage_relations = data.get("damage_relations") or {}

    if not isinstance(pokemon_entries, list):
        pokemon_entries = []
    if not isinstance(moves, list):
        moves = []
    if not isinstance(damage_relations, dict):
        damage_relations = {}

    # 3) Print lists and damage table.
    print_pokemon_list(pokemon_entries)
    print_moves_list(moves)
    print_damage_relations_table(damage_relations)

    # 4) Save three CSV files (pokemon, moves, damage relations).
    # I wanted 3 CSVs—one per extract (Pokemon, moves, damage relations),
    # so each table stays simple to open and analyze.    
    base = Path(__file__).parent
    p1 = base / "pokeapi_fairy_type_responses_1.csv"
    p2 = base / "pokeapi_fairy_type_responses_2.csv"
    p3 = base / "pokeapi_fairy_type_responses_3.csv"

    poke_rows = pokemon_rows(pokemon_entries)
    mov_rows = move_rows(moves)
    dmg_rows = damage_relation_rows(damage_relations)

    write_csv(p1, ["name", "url", "slot"], poke_rows)
    write_csv(p2, ["name", "url"], mov_rows)
    write_csv(p3, ["relation_category", "related_type_name", "related_type_url"], dmg_rows)

    print(f"\nSaved {len(poke_rows)} rows to {p1.name}")
    print(f"Saved {len(mov_rows)} rows to {p2.name}")
    print(f"Saved {len(dmg_rows)} rows to {p3.name}")


if __name__ == "__main__":
    main()
