# Exp Hub — deepen thin docs (runbook)

**Branch:** `feat/code-lab`. **Status:** code done, `tsc` + build green. NOT deployed, NOT run yet
(so the running VPS AI jobs are untouched). Trigger the steps below only when the VPS is idle.

## What changed (code)
- `src/services/snippets.aiDoc.service.ts`
  - Prompt minimums are now **hard requirements** (≥26 blocks, ≥6 real multi-line code blocks, ≥2 mermaid,
    final links block; no early stop / summarizing).
  - `maxTokens` 12000→**16000**, timeout 150s→200s (room for the full 26-45 block guide without truncating).
  - **Depth gate + auto-retry:** after the first draft, if it's still thin (`isThinDoc`) it regenerates ONCE
    with an explicit "expand" instruction and keeps the deeper draft. Already-rich docs pass on attempt 1 →
    no extra tokens spent. This also upgrades the single-doc admin "AI viết doc" button.
  - New exported helpers: `docDepth()`, `isThinDoc()` (thresholds: `<22` blocks / `<4` code / `<5000` chars).
- `scripts/exphub-doc-bulk-gen.mjs`
  - New `--regen-thin` flag: re-writes ONLY categories whose existing doc is shallow (per `isThinDoc`),
    leaving the ~9 already-deep docs alone. Targeted + cheap.
- `scripts/exphub-prune-empty-groups.mjs` (new)
  - Lists/deletes empty junk root groups (Game, Lab211, Next.Js, Node.JS). `--dry` by default.

## Audit baseline (2026-07-19, prod)
157 tech docs, 14 real groups, 100% have a doc. But **148/157 were thin** (avg ~3.1k chars, ~16 blocks,
0 diagrams, 1-4 tiny snippets — cheat-sheets, not reference chapters). Only 9 were genuinely deep
(Git, Claude, Fedora, AI Coding, Ollama, Hugging Face, ChatGPT, Gemini, VS Code). Same pipeline proved it
CAN go deep → the thin ones just need regeneration with the strong model + the new depth gate.

## Steps to run (on the VPS, only when other AI jobs are done)
1. Deploy the branch first (a normal `bash deploy.sh` — this rebuilds the container `dist/` so the new
   generator + `--regen-thin` flag exist there). Do this only when no AI job is mid-run, since deploy
   restarts the backend and would kill an in-flight job.
2. Dry-run to see what would be regenerated (no writes, but NOTE: `--dry` still calls the LLM per category):
   ```bash
   docker exec cuonghoangdev_backend node scripts/exphub-doc-bulk-gen.mjs --regen-thin --limit 3 --dry
   ```
3. Upgrade the thin docs for real, throttled against the shared token window:
   ```bash
   docker exec -e LLM_MODEL_GENERATION=claude-opus-4-8 cuonghoangdev_backend \
     node scripts/exphub-doc-bulk-gen.mjs --regen-thin --budget 3000000
   ```
   Resumable — re-running skips docs that are now deep enough. Each thin doc may cost up to 2 LLM calls
   (draft + expand retry); the budget throttle paces it.
4. (Optional) Prune the empty junk groups:
   ```bash
   docker exec cuonghoangdev_backend node scripts/exphub-prune-empty-groups.mjs           # preview
   docker exec cuonghoangdev_backend node scripts/exphub-prune-empty-groups.mjs --apply    # delete
   ```
5. (Optional, separate) Add real **Next.js** and **Node.js** tech leaves (they currently exist only as empty
   groups). Best via the admin panel or the taxonomy seed, then generate their docs — not automated here.

## Verify after the run
```bash
# spot-check depth of a previously-thin doc (expect blocks up, chars up, >=1 mermaid):
curl -s https://cuongthai.com/api/v1/snippets/categories/49/doc | \
  node -e 'let d="";process.stdin.on("data",c=>d+=c);process.stdin.on("end",()=>{const b=(JSON.parse(d).data.blocks||[]);let ch=0,co=0,mm=0;for(const x of b){ch+=JSON.stringify(x).length;if(x.type==="code")co++;if(x.type==="mermaid")mm++;}console.log("blocks",b.length,"chars",ch,"code",co,"mermaid",mm);})'
```

## Constraints (respected)
- Do NOT deploy or run the bulk job while other AI jobs are running on the VPS — a deploy restart kills them,
  and the bulk job competes for the shared 5h token window.
- The scripts import compiled `dist/`, so the container must be rebuilt (deployed) before the new behavior
  is live.
