# LAB211 authoring kit

Everything used to build the LAB211 track: the importer that turned the original
FPT assignment sheets into Code Lab exercises, the bilingual lesson generators,
and the solutions with their verifier.

This lives in the repo rather than a scratch directory because a scratch
directory belongs to one session and disappears with it.

## Layout

```
lab211/
├── extract_docx.py     Word .docx  -> ordered blocks (text, images, tables, TEXT BOXES)
├── from_pdf.py         PDF         -> ordered blocks, and clips figures out as PNG
├── meta.py             pulls Type / Code / LOC / Slot(s) / Title out of any source
├── build.py            blocks      -> problemHtml, concepts, difficulty, slug
├── mkpdf.py            (unused fallback) renders a brief to PDF without LibreOffice
├── api-usage.json      which of the 54 briefs needs which Java API — MEASURED, not guessed
├── payload.json        the 54 exercises as shipped
├── lesson/             the four bilingual reference lessons
└── solutions/          the worked solutions and their verifier
```

## Lessons (`lesson/`)

`kit.py` provides the block helpers — `h/p/ul/table/code/out/mermaid/part/practice`
— each taking English and Vietnamese. `verify_java.py` compiles every Java
snippet with `javac`, **runs** the ones that declare an expected output, and
diffs the console against what the lesson claims.

```bash
cd lesson
python3 main.py            # main lesson  -> blocks.json      (module 847)
python3 build_api.py       # API ref      -> blocks_api.json  (module 855)
python3 build_algo.py      # algorithm ref-> blocks_algo.json (module 856)
python3 build_err.py       # error book   -> blocks_err.json  (module 857)
python3 verify_java.py java.json          # javac + run + diff
./gen_errors.sh                           # regenerate REAL javac messages
```

Ship with the batch file the write script expects:

```bash
python3 -c "import json;\
 json.dump([{'moduleId':847,'blocks':json.load(open('blocks.json'))}],\
 open('batch.json','w'),ensure_ascii=False)"
scp batch.json root@VPS:/tmp/lesson-batch.json
ssh root@VPS 'docker cp /tmp/lesson-batch.json cuonghoangdev_backend:/tmp/ && \
  docker exec cuonghoangdev_backend sh -c "cat /tmp/lesson-batch.json | node scripts/codelab-lesson-write.mjs"'
```

The backend must already be deployed with the block types a lesson uses —
`normalizeBlock` silently drops anything it does not know, and reports success.

## Solutions (`solutions/`)

`solkit.py` is the whole method. A solution is a real NetBeans-shaped project
(`entity` / `bo` / `controller` / `ui` / `utils`, the layout of the user's own
passing submissions), and it is verified the way a marker verifies:

1. write every file into its package directory,
2. `javac` the whole project,
3. `java <mainClass>` with **the keystrokes a marker would type**,
4. diff the console against the brief's own expected screen.

For a program with a random element, the expectation is a *predicate* over the
real output instead of fixed text — "the sorted line is the unsorted line in
order" is still a hard check, and a lucky run cannot pass it.

```bash
cd solutions
python3 -c "import solkit, batch1, batch2, batch3, batch4, batch5, batch6, batch7, batch8; \
            solkit.verify_all()"                       # compile + run everything
python3 -c "import solkit, batch8; solkit.capture('J1.S.P0058')"   # see the real console
python3 -c "import solkit, batch1, …, batch8; solkit.dump('payload_sol.json')"
scp payload_sol.json root@VPS:/tmp/lab211-solutions.json
ssh root@VPS 'docker cp /tmp/lab211-solutions.json cuonghoangdev_backend:/tmp/ && \
  docker exec cuonghoangdev_backend node /tmp/shipsol.mjs'
```

`shipsol.mjs` matches an exercise by the LAB code in its title
(`title startsWith '<LAB>_'`), never by slug — saving an exercise in the admin
UI used to rewrite the slug, and a slug lookup then created a duplicate.

## Adding the next solution

1. Read the brief: `python3 -c "import json,re,html; P={e['lab']:e for e in
   json.load(open('../payload.json'))}; print(html.unescape(re.sub(r'<[^>]+>','\n',
   P['J1.S.P00XX']['problemHtml'])))"`
2. Write the files in the `entity` / `bo` / `utils` / `ui` layout. Add a layer
   only where the program needs one — a 21-line assignment gets no empty
   controller.
3. `capture()` it, read the real console, then paste that console back as the
   expectation. Never write the expected output from imagination.
4. Translate the brief into `problemVi` and write both walkthroughs.
5. Verify everything, dump, ship.

## Things the briefs get wrong

Several assignment sheets contradict themselves. The Guidelines section is the
contract; the expected-screen picture is not. Say so in the walkthrough — an
examiner counts noticing it in your favour.

| Brief | Screen says | Guidelines say |
|---|---|---|
| P0063 | `You must input digidt.` | `Exception("You must input digit.")` |
| P0064 | `Phone number must is number` | `Phone number must be number` |
| P0067 | `Perfect Square Numbers: [321, 22]` | "using Math.sqrt" — neither number is a square |
| P0061 | `Area: ` for the rectangle, `Area:` for the circle | — (copied as-is; the marker diffs screens) |
