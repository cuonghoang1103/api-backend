# Writing a LAB211 solution — the standard to meet

Read this in full before writing a line of Java. Everything here was paid for
by a mistake someone already made.

## The one rule

**Compiling proves nothing about behaviour. Only running it proves that.**

A solution is finished when `solkit.verify_all_locales(only=[...])` prints
`LỖI=0` **twice** — once at home, once with the marker's Vietnamese locale —
which means the whole project compiled AND every scripted run's console matched
the expectation exactly on both. Never write an expected output from
imagination: run `solkit.capture('<LAB>')`, read the real console, and paste
that back.

**Why twice.** `String.format("%.2f", 3.5)` follows the DEFAULT locale, so it
prints `3.50` here and `3,50` on the Vietnamese machine in the FPTU lab. Eight
solutions shipped green under `verify_all()` alone and would have printed
commas at the marker's desk — an exact-match failure, which is zero for that
run. Pin every numeric format: `String.format(Locale.US, "%.2f", x)` or
`printf(Locale.US, ...)`. Same for a date pattern with a text month
(`dd-MMM-yyyy` needs `Locale.ENGLISH`, or "Apr" is not a month name).

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
python3 -c "import solkit, batchN; solkit.verify_all_locales()"   # both locales
python3 -c "import solkit, batchN; solkit.verify_all()"            # home only, faster
python3 -c "import solkit, batchN; solkit.capture('J1.S.P00XX')"
python3 khopchuky.py                                               # tên khớp đề chưa
```

**`khopchuky.py` là phép kiểm thứ hai, và nó bắt thứ `javac` không thấy.** Người
chấm dò theo TÊN: một bài chạy đúng, in đúng, mà đặt tên `add` trong khi đề viết
`addWord` thì ô đối chiếu trong phiếu chấm không tích được — còn `verify_all()`
vẫn xanh, vì nó chỉ biết chương trình in ra cái gì. Đã lọt lưới ba lần trước khi
có nó: P0068 (`sortStudent` khai `void` thay vì trả `List`), P0058 (bốn tên sai
một lúc), P0053 (thiếu hẳn `checkIn`, `sortAscending`, `sortDescending`).

## Project shape — measured from the user's own passing submissions

**Decide by what the program DOES, then use the file count only to sanity-check.**

* A `bo` appears when there is a business rule or an algorithm worth keeping off
  the screen. That happens in **three-file** projects too — the sorting and
  searching briefs put the algorithm in a `bo` with no `entity` in sight.
* A `controller` appears when the program performs **several distinct operations
  on one stored collection** — add / update / delete / search / save. Not when
  it is merely large.

Both sentences are measured. Counting the kinds of collection operation each of
the 54 reference solutions performs:

| | kinds of collection operation |
|---|---|
| projects **with** a controller (11) | **≈ 4.8** on average |
| projects **without** one | **≈ 0.9** on average |

File count does **not** separate those two groups, so it cannot be the rule. The
clearest proof is `P0080` Shapes: **ten files and correctly no controller**,
because nine of them are shape classes, not features — the program performs zero
collection operations. "It keeps `main()` short" is not the reason either: main
averages 58 lines with a controller and 67 without.

As a rough cross-check only, counted across 17 passing submissions:

| files | what they usually did | examples |
|---|---|---|
| 2–3 | no `bo` | fibonacci(2), BinarySearch(3) |
| **4** | **both ways** — the count settles nothing here | CalculatorBill(4) *without*, MatrixOOP(4) *with* |
| 5–6 | a `bo` | ChangeBaseNumber(5), ManagerFruit(6) |
| ≥7 | a `controller` | ManageStudent(7), TaskManagement(7), ManagerWorker(9) |

So **add a layer only where this program needs one** — and be ready to say why,
in terms of the operations the program performs, never a file count. An empty
controller in a 40-line assignment is a mark lost, not gained.

**And the Guidelines outrank all of it — but read the sheet before acting on
them.** "Student must implement methods X, Y *in startup code*" means *these are
the methods you must write in the project you hand in*. It does **not** by
itself say which class they go in:

* The brief names no class and hands the collection in as a parameter
  (`addContact(List<Contact> list, Contact c)`) → they go in `Main`. **P0054,
  P0063, P0068** are that case, and a manager class there would hold no state
  and enforce no rule.
* The brief **names** a class to hold them → that name is what a marker looks
  for. **P0055** is that case: its Suggestion says *"Class **DoctorHash**
  contains adding, editing, deleting and searching functions"*, so the class is
  called `DoctorHash` and the four methods live in it.

Getting this backwards costs marks in both directions.

Inside the layers:

- `entity` — POJO, private fields, full constructor, getters/setters,
  `toString`. No rules, no printing. `implements Serializable` **only when the
  program writes objects with `ObjectOutputStream`** — measured across all 54:
  **not one does**, every file assignment here writes text, CSV or a `.dat`
  written as text. So in this track it is a habit, not a requirement; 22 of the
  solutions keep it because a marker expects it, and the walkthrough should be
  ready for "you never serialize anything, why is this Serializable?".
- `bo` — holds the collection and the rules. **Throws `Exception` with the
  brief's own message**; never prints.
- `controller` — reads input via the validator, calls `bo`, reports the outcome.
- `ui` / `Main` — the menu loop and the screen. Nothing else.
- `utils/Validator` — `private static final Scanner SCANNER`, a **private
  constructor**, all methods static. Every keyboard read in one place.

**Reading and writing the data file belongs in `bo`** — never `utils`, never the
controller, never the entity. Whether it gets a class of its own is a judgement
call and both answers pass. Counted across the 54: **15 touch a file at all; 11
keep a separate class for it, 4 merge it into the business class**, and all 11
separate classes live in `bo/` — `VehicleFile`, `DataStore`, `FileProcessor`,
`CSVFormatter`, `CopyManager`, `ZipManager`, `WordSearcher`,
`DocumentFileManager`, `FileManager`, `FileProcessing` — ten names for eleven
projects, `DataStore` serving both `P0014` and `P0015`.

- **Merge** when one `bo` owns one file for one entity (`FruitManager` +
  `fruits.txt`). A `FileHelper` there is an indirection with nothing behind it.
- **Split** when several `bo` classes share one file — `DataStore` in
  `P0014`/`P0015` serves `AssetStore`, `EmployeeStore`, `RequestStore`,
  `BorrowStore` — or when the file format **is** the assignment: zip, CSV,
  copying, searching a file for a word.
- The only file writing in `utils/` across all 54 is `SampleData`, which creates
  the demo input so the first run has something to read.

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
python3 -c "import solkit, batchN; print(solkit.verify_all_locales())"   # must be True
python3 khopchuky.py                                                     # must print 0
```

Report: which labs are green, the file count and layers of each, anything the
brief got wrong, and any decision you were unsure about. Do not ship — the
parent session ships everything together.
