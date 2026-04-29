# Week 4 — Competency 4: APIs & Data Acquisition

## What this competency means (in my words)

An API receives my request and passes it to a backend server so the data I asked for can be fetched and returned. In this unit, that meant requesting specific information about Fairy-type Pokemon, Fairy-type moves, and Fairy-type effectiveness (how Fairy compares to other types). To me, **data acquisition** is the ability to tell an API what you want—clearly enough that the right fields come back as structured data.

## What I did (concrete)

This week my **submitted Week 4 work** is in **`A4 API Assignment`**: a Python script plus the CSV outputs from the PokeAPI exercise.

### Class activity (HCDE 530 App Reviews API)

I did not package the class activity in this reflection; the work described below is the **assignment** folder only.

### Assignment (PokeAPI — Fairy type)

I wrote **`pokeapi_api_fairy_type_to_csv.py`**, which calls **`https://pokeapi.co/api/v2/type/fairy/`** and pulls **`pokemon`**, **`moves`**, and **`damage_relations`**. The script prints those results to the console and writes CSV exports.

At first I saved **one** CSV that combined all three categories. The rows were technically correct, but **hard to scan** when everything was mixed together. I changed the script so it saves **three** separate files instead—**`pokeapi_fairy_type_responses_1.csv`** (Pokemon), **`pokeapi_fairy_type_responses_2.csv`** (moves), and **`pokeapi_fairy_type_responses_3.csv`** (damage relations). That separation made each table easier to read and interpret.

## What I extracted and why those fields

### Pokemon (`pokeapi_fairy_type_responses_1.csv`)

From each entry under **`pokemon`**, I kept **`name`** (species/form slug), **`url`** (link to that Pokemon resource), and **`slot`** (whether Fairy is listed as type 1 or 2). I wanted a **complete list** of Pokemon associated with the Fairy type—both to see **how many there are** and to scan names/forms in one place instead of guessing from memory.

### Moves (`pokeapi_fairy_type_responses_2.csv`)

From **`moves`**, I kept **`name`** and **`url`** so I could see **every Fairy-classified move** and browse patterns in how moves are named (many Fairy moves lean whimsical or “cute”). The **`url`** preserves the canonical PokeAPI reference if I ever open or join to fuller move details later.

### Damage relations (`pokeapi_fairy_type_responses_3.csv`)

From **`damage_relations`**, I kept **`relation_category`** (for example `double_damage_from`, `half_damage_to`) plus each related type’s **`name`** and **`url`**. That answers **how Fairy stacks up against other types**—important when you’re thinking about matchups (for example battles). Fairy was added relatively recently compared with older types, so having the matchup table in front of me helps when I forget interactions.

## How the pieces connect (request → JSON → CSV)

When I run **`pokeapi_api_fairy_type_to_csv.py`**, the script sends a **GET** request to **`https://pokeapi.co/api/v2/type/fairy/`**. The API returns the response as **JSON**, and Python converts that response into dictionaries/lists I can loop through. From there, I separate the data into Pokemon, moves, and damage relations, then write each set into its own CSV file.

Using the customer/waiter/chef metaphor: my script is the customer placing the order, the API is the waiter carrying the request/response, and the backend data source is the chef preparing what gets returned.

## Challenges & what I learned

At first the idea of an API felt abstract and confusing to me. Comparing it to a **waiter helped**: the API acts like a **middle layer**—it takes my request, passes it along to wherever the data lives on the backend, and then **delivers the response back** to me in a predictable format.

I also learned a practical lesson about outputs: combining everything into **one CSV** made the rows harder to scan, even though the data was correct. Splitting the export into **three CSV files** (Pokemon, moves, damage relations) matched how I wanted to read and interpret the tables.

## Competency link

This competency connects directly to earlier file and cleaning work: APIs are another data source, but the downstream process is similar. I still have to identify useful fields, transform nested JSON into tabular rows, and export clean CSVs that are readable and analyzable. In other words, API acquisition gives me structured input; competencies 2 and 3 help me make that input usable for analysis and decisions.

## Open questions / next time

Next, I want to explore a stronger analysis question: for each Fairy-type Pokemon, which Fairy-type move is likely best given that Pokemon's stats. To do that, I would need to connect this type-level endpoint to additional Pokemon and move detail endpoints (for example base stats, move power/accuracy, and possibly learnset constraints).
