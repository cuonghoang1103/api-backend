# Writing a LAB211 solution — the standard to meet

Read this in full before writing a line of Java. Everything here was paid for
by a mistake someone already made.

## The one rule

**Compiling proves nothing about behaviour. Only running it proves that.**

A solution is finished when `solkit.verify_all(only=[...])` prints `LỖI=0` —
which means the whole project compiled AND every scripted run's console matched
the expectation exactly. Never write an expected output from imagination: run
`solkit.capture('<LAB>')`, read the real console, and paste that back.

Never report a lab as done that has not gone green. A solution a student pastes
in and cannot build is the worst possible failure of teaching material.

## Where things are

```
docs/codelab-authoring/lab211/
├── payload.json          the 54 briefs as shipped — READ THE BRIEF FROM HERE
└── solutions/
    ├── solkit.py         solution() / verify_all() / capture() / dump()
    ├── batch1..N.py      the finished solutions — READ ONE FIRST for the style
    └── shipsol.mjs       the shipper (matched by LAB code in the title)
```

Read the brief for a lab:

```bash
cd docs/codelab-authoring/lab211
python3 -c "
import json,re,html
P={e['lab']:e for e in json.load(open('payload.json'))}
e=P['J1.S.P00XX']
t=re.sub(r'<br\s*/?>','\n',e['problemHtml'])
t=re.sub(r'</(p|div|li|h1|h2|h3|h4|tr|pre)>','\n',t)
print(html.unescape(re.sub(r'<[^>]+>','',t)).strip())"
```

Verify only your own labs (fast, and does not touch anyone else's):

```bash
cd solutions
python3 -c "import solkit, batchN; solkit.verify_all()"
python3 -c "import solkit, batchN; solkit.capture('J1.S.P00XX')"
```

## Project shape — measured from the user's own passing submissions

This is not a convention someone invented. It was counted across 17 real
projects that were marked and passed:

| files | layers | examples |
|---|---|---|
| 2–4 | `entity` + `ui` + `utils`, **no `bo`** | fibonacci(2), BinarySearch(3), CalculatorBill(4) |
| 4–6 | add `bo` | MatrixOOP(4), ChangeBaseNumber(5), ManagerFruit(6) |
| ≥7 | add `controller` | ManageStudent(7), TaskManagement(7), ManagerWorker(9) |

Every project with ≥7 files had a `controller`; every project with ≤3 had no
`bo`. So **add a layer only where this program needs one** — and be ready to
say why. An empty controller in a 40-line assignment is a mark lost, not gained.

Inside the layers:

- `entity` — POJO, `implements Serializable`, private fields, full constructor,
  getters/setters, `toString`. No rules, no printing.
- `bo` — holds the collection and the rules. **Throws `Exception` with the
  brief's own message**; never prints.
- `controller` — reads input via the validator, calls `bo`, reports the outcome.
- `ui` / `Main` — the menu loop and the screen. Nothing else.
- `utils/Validator` — `private static final Scanner SCANNER`, a **private
  constructor**, all methods static. Every keyboard read in one place.

**Delete the NetBeans template header** ("To change this license header…") — it
is the signature of generated code. Replace it with a Javadoc that says WHY the
class exists, not what it is.

## Comments

Write the comment that explains the decision, not the one that restates the
code. `// increment i` is noise. "A LinkedHashMap rather than a HashMap: lookup
is instant either way, but this keeps the file's line order stable between
runs, and a file that reshuffles itself is hard to trust" is the standard.

Comments are in English. So is every class, method and variable name.

## When the brief contradicts itself

Several sheets do. **The Guidelines section is the contract; the expected-screen
picture is not.** Follow the Guidelines, and say in the walkthrough that the two
disagree — an examiner counts noticing it in your favour. Known cases:

| Brief | Screen says | Guidelines say |
|---|---|---|
| P0063 | `You must input digidt.` | `Exception("You must input digit.")` |
| P0064 | `Phone number must is number` | `must be number` |
| P0067 | `Perfect Square Numbers: [321, 22]` | "using Math.sqrt" — neither is a square |
| P0061 | `Area: ` for one shape, `Area:` for another | copied as-is; the marker diffs screens |

Where the marker diffs the screen character by character, copy the brief's
wording **exactly**, inconsistencies included.

## Randomness and files

- A program using `Math.random()` cannot be diffed against fixed text. Pass a
  **predicate** as the expectation instead — it receives the real stdout and
  returns `(ok, why)`. Check relationships ("the sorted line is the unsorted
  line in order", "five distinct cards, 47 left"). A lucky run must not pass.
- Prompts printed with `print()` (no newline) end up on the SAME line as the
  next output when stdin is piped. Predicates must `re.search`, not `startswith`.
- Runs share a working directory, in order. Use that: a program with a data file
  should be proven by a SECOND run, in a new process, finding what the first one
  saved. That is the only real proof the file works.

## What to deliver per lab

`solution(...)` in your batch file, with:

- `files` — `[('src/<pkg>/<Class>.java', SOURCE)]`
- `main_class`, `runs` — the marker's keystrokes and the verified console
- `explain_en` / `explain_vi` — the walkthrough, HTML, **matched paragraph for
  paragraph**. Explain the DECISIONS: why this layer, why this collection, why
  this type, what the traps are, how it was verified, what an examiner asks.
  Do NOT prepend a project tree — `solkit.dump()` generates it for you.
- `hints_en` / `hints_vi` — 4–5 short hints that point without solving.
- A `VI` dict at the end of the file mapping lab → the brief translated into
  Vietnamese HTML (`<h3>`/`<p>`/`<ul>`/`<pre>`), keeping every message string
  the program prints in English, then:

```python
for s in SOLUTIONS:
    if s['lab'] in VI:
        s['problemVi'] = VI[s['lab']]
```

Import `SOLUTIONS` alongside `solution` from `solkit`.

## Finish line

```bash
python3 -c "import solkit, batchN; print(solkit.verify_all())"   # must be True
```

Report: which labs are green, the file count and layers of each, anything the
brief got wrong, and any decision you were unsure about. Do not ship — the
parent session ships everything together.
