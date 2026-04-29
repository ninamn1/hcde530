"""Read pokeapi_fairy_type_responses_*.csv and write pokeapi_fairy_dashboard.html."""

from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
CSV_POKEMON = HERE / "pokeapi_fairy_type_responses_1.csv"
CSV_MOVES = HERE / "pokeapi_fairy_type_responses_2.csv"
CSV_DAMAGE = HERE / "pokeapi_fairy_type_responses_3.csv"
OUT_HTML = HERE / "pokeapi_fairy_dashboard.html"


def load_csv_rows(path: Path) -> list[dict[str, str]]:
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def main() -> None:
    pokemon = load_csv_rows(CSV_POKEMON)
    moves = load_csv_rows(CSV_MOVES)
    damage = load_csv_rows(CSV_DAMAGE)

    for row in pokemon:
        row["slot"] = row.get("slot", "").strip()

    slots = Counter(row["slot"] for row in pokemon if row["slot"])
    rel_groups: Counter[str] = Counter()
    for row in damage:
        rel_groups[row.get("relation_category", "")] += 1

    move_lengths = [{"name": m["name"], "len": len(m["name"])} for m in moves]
    move_lengths.sort(key=lambda x: (-x["len"], x["name"]))

    payload = {
        "pokemon": pokemon,
        "moves": moves,
        "damage": damage,
        "slotCounts": dict(slots),
        "relationCounts": dict(rel_groups),
        "moveLengths": move_lengths,
        "stats": {
            "pokemon_total": len(pokemon),
            "moves_total": len(moves),
            "damage_rows": len(damage),
        },
    }

    data_json = json.dumps(payload, ensure_ascii=False)

    template = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Fairy type — API dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <style>
    :root {
      --bg: #0f1419;
      --panel: #1a2332;
      --text: #e8eef7;
      --muted: #8b9bb4;
      --accent: #f472b6;
      --accent2: #93c5fd;
      --border: #2d3a4d;
      --radius: 12px;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", system-ui, sans-serif;
      background: linear-gradient(165deg, var(--bg) 0%, #151d28 50%, #0c1018 100%);
      color: var(--text);
      min-height: 100vh;
      line-height: 1.45;
    }
    .wrap {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem 1.25rem 3rem;
    }
    header {
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.25rem;
    }
    header h1 {
      margin: 0 0 0.35rem;
      font-size: 1.65rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    header p {
      margin: 0;
      color: var(--muted);
      font-size: 0.95rem;
      max-width: 52ch;
    }
    header code { font-size: 0.85em; color: var(--accent2); }
    .kpis {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .kpi {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem 1.15rem;
    }
    .kpi .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--muted);
      margin-bottom: 0.35rem;
    }
    .kpi .value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--accent);
    }
    .grid {
      display: grid;
      gap: 1.5rem;
    }
    @media (min-width: 860px) {
      .grid-2 { grid-template-columns: 1fr 1fr; }
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.25rem;
    }
    .panel h2 {
      margin: 0 0 1rem;
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--accent2);
    }
    canvas { max-height: 320px; }
    .chart-tall canvas { max-height: 480px; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
    }
    th, td {
      text-align: left;
      padding: 0.5rem 0.65rem;
      border-bottom: 1px solid var(--border);
    }
    th {
      color: var(--muted);
      font-weight: 600;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    tr:hover td { background: rgba(255,255,255,0.03); }
    a {
      color: var(--accent2);
      text-decoration: none;
    }
    a:hover { text-decoration: underline; }
    .footnote {
      margin-top: 2rem;
      font-size: 0.8rem;
      color: var(--muted);
    }
    input[type="search"] {
      width: 100%;
      margin-bottom: 0.75rem;
      padding: 0.5rem 0.65rem;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: var(--bg);
      color: var(--text);
      font: inherit;
    }
    .scroll {
      max-height: 280px;
      overflow: auto;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>Fairy type — PokéAPI snapshot</h1>
      <p>
        Built from <code>pokeapi_fairy_type_responses_1.csv</code>,
        <code>pokeapi_fairy_type_responses_2.csv</code>, and
        <code>pokeapi_fairy_type_responses_3.csv</code>.
        <em>Slot</em> is whether Fairy is listed as type 1 or type 2 for that Pokémon.
      </p>
    </header>

    <div class="kpis" id="kpis"></div>

    <div class="grid grid-2">
      <div class="panel">
        <h2>Fairy slot (type 1 vs type 2)</h2>
        <canvas id="chartSlots" aria-label="Slot distribution"></canvas>
      </div>
      <div class="panel">
        <h2>Damage relation groups (count per category)</h2>
        <canvas id="chartRelations" aria-label="Damage relations"></canvas>
      </div>
    </div>

    <div class="panel chart-tall" style="margin-top:1.5rem;">
      <h2>Move names by character length</h2>
      <p style="margin:0 0 1rem; color: var(--muted); font-size: 0.88rem;">
        Sorted by longest name first. Compound names (e.g. some special moves) tend to rank higher.
      </p>
      <canvas id="chartMoveLen" aria-label="Move name lengths"></canvas>
    </div>

    <div class="grid" style="margin-top:1.5rem;">
      <div class="panel">
        <h2>Pokémon (filterable)</h2>
        <input type="search" id="filterPoke" placeholder="Filter by name…" autocomplete="off" />
        <div class="scroll">
          <table>
            <thead><tr><th>Name</th><th>Slot</th><th>Link</th></tr></thead>
            <tbody id="tblPoke"></tbody>
          </table>
        </div>
      </div>
      <div class="panel">
        <h2>Moves (filterable)</h2>
        <input type="search" id="filterMove" placeholder="Filter by name…" autocomplete="off" />
        <div class="scroll">
          <table>
            <thead><tr><th>Move</th><th>Link</th></tr></thead>
            <tbody id="tblMoves"></tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="panel" style="margin-top:1.5rem;">
      <h2>Damage relations (full table)</h2>
      <div class="scroll" style="max-height:360px;">
        <table>
          <thead><tr><th>Category</th><th>Related type</th><th>Link</th></tr></thead>
          <tbody id="tblDamage"></tbody>
        </table>
      </div>
    </div>

    <p class="footnote">
      Regenerate: <code>python build_fairy_dashboard.py</code> in this folder after updating the CSVs.
    </p>
  </div>

  <script id="dashboard-data" type="application/json">__DATA_JSON__</script>
  <script>
(function () {
  const DATA = JSON.parse(document.getElementById("dashboard-data").textContent);

  const k = document.getElementById("kpis");
  k.innerHTML =
    '<div class="kpi"><div class="label">Fairy Pokémon listed</div><div class="value">' +
    DATA.stats.pokemon_total +
    '</div></div>' +
    '<div class="kpi"><div class="label">Fairy moves</div><div class="value">' +
    DATA.stats.moves_total +
    '</div></div>' +
    '<div class="kpi"><div class="label">Damage relation rows</div><div class="value">' +
    DATA.stats.damage_rows +
    "</div></div>";

  const slotLabels = Object.keys(DATA.slotCounts).sort();
  const slotValues = slotLabels.map(function (s) { return DATA.slotCounts[s]; });
  new Chart(document.getElementById("chartSlots"), {
    type: "doughnut",
    data: {
      labels: slotLabels.map(function (s) { return "Slot " + s; }),
      datasets: [
        {
          data: slotValues,
          backgroundColor: ["#f472b6", "#60a5fa", "#a78bfa"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: "bottom", labels: { color: "#e8eef7" } },
      },
      maintainAspectRatio: false,
    },
  });

  const relLabels = Object.keys(DATA.relationCounts).sort();
  const relVals = relLabels.map(function (k) { return DATA.relationCounts[k]; });
  new Chart(document.getElementById("chartRelations"), {
    type: "bar",
    data: {
      labels: relLabels,
      datasets: [
        {
          label: "Related types listed",
          data: relVals,
          backgroundColor: "#93c5fd",
          borderRadius: 6,
        },
      ],
    },
    options: {
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: "#8b9bb4", precision: 0 },
          grid: { color: "#2d3a4d" },
        },
        y: {
          ticks: { color: "#e8eef7", font: { size: 10 } },
          grid: { display: false },
        },
      },
      maintainAspectRatio: false,
    },
  });

  var ml = DATA.moveLengths;
  new Chart(document.getElementById("chartMoveLen"), {
    type: "bar",
    data: {
      labels: ml.map(function (m) { return m.name; }),
      datasets: [
        {
          label: "Characters",
          data: ml.map(function (m) { return m.len; }),
          backgroundColor: "rgba(244, 114, 182, 0.65)",
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (ctx) {
              return "Length: " + ctx.raw;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: "#8b9bb4", precision: 0 },
          grid: { color: "#2d3a4d" },
        },
        y: {
          ticks: { color: "#e8eef7", font: { size: 9 }, autoSkip: false },
          grid: { display: false },
        },
      },
      maintainAspectRatio: false,
    },
  });

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeAttr(s) {
    return String(s).replace(/"/g, "&quot;");
  }

  function rowsPoke(rows) {
    var tb = document.getElementById("tblPoke");
    tb.innerHTML = rows
      .map(function (r) {
        return (
          "<tr><td>" +
          escapeHtml(r.name) +
          "</td><td>" +
          escapeHtml(r.slot) +
          '</td><td><a href="' +
          escapeAttr(r.url) +
          '">API</a></td></tr>'
        );
      })
      .join("");
  }
  function rowsMoves(rows) {
    var tb = document.getElementById("tblMoves");
    tb.innerHTML = rows
      .map(function (r) {
        return (
          "<tr><td>" +
          escapeHtml(r.name) +
          '</td><td><a href="' +
          escapeAttr(r.url) +
          '">API</a></td></tr>'
        );
      })
      .join("");
  }
  function rowsDamage(rows) {
    var tb = document.getElementById("tblDamage");
    tb.innerHTML = rows
      .map(function (r) {
        return (
          "<tr><td>" +
          escapeHtml(r.relation_category) +
          "</td><td>" +
          escapeHtml(r.related_type_name) +
          '</td><td><a href="' +
          escapeAttr(r.related_type_url) +
          '">API</a></td></tr>'
        );
      })
      .join("");
  }

  rowsPoke(DATA.pokemon);
  rowsMoves(DATA.moves);
  rowsDamage(DATA.damage);

  document.getElementById("filterPoke").addEventListener("input", function (e) {
    var q = e.target.value.trim().toLowerCase();
    rowsPoke(DATA.pokemon.filter(function (r) { return r.name.toLowerCase().indexOf(q) !== -1; }));
  });
  document.getElementById("filterMove").addEventListener("input", function (e) {
    var q = e.target.value.trim().toLowerCase();
    rowsMoves(DATA.moves.filter(function (r) { return r.name.toLowerCase().indexOf(q) !== -1; }));
  });
})();
  </script>
</body>
</html>
"""

    OUT_HTML.write_text(template.replace("__DATA_JSON__", data_json), encoding="utf-8")
    print(f"Wrote {OUT_HTML}")


if __name__ == "__main__":
    main()
