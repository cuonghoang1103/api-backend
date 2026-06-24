# 📒 Notes Feature — Handoff for Phase 3

Personal study-notebooks feature (per-user, no admin) at `/notes`.
**Phase 1 + Phase 2 are DONE and LIVE.** This doc hands off the rest.

> For whoever continues (Claude Code): read **Conventions** first — they are
> non-negotiable and were chosen to match the existing codebase.

---

## 0. Conventions (MUST follow)

- **Per-user, no admin** — mirror `src/routes/hub.routes.ts`:
  - `router.use(authenticate)`; every service fn takes `req.userId!` as 1st arg.
  - Every query has `userId` in the WHERE.
  - Mutations use `updateMany` / `deleteMany({ id, userId })` then check
    `result.count === 0` → throw `AppError(..., 404)`. (cross-tenant guard)
- **Idempotent saves** — update by id; never insert a new row for an existing
  entity (duplicate-on-save was a recurring bug — avoid it).
- **Uploads** — reuse `fileApi.upload(file, category)` → `POST /files/upload`
  (multer→R2). Read the URL at `res.data.data.url`. Do NOT add new storage.
- **API envelope** — `{ success, data }`; frontend reads `res.data.data`.
- **DB** — deploy runs `prisma db push` (additive). Prod does NOT have
  `projects.search_vector`; never let a migration/push drop it. New tables for
  Notes already exist (created in Phase 1).
- **Mobile-safe** — inputs ≥16px, touch targets ≥44px, `100dvh` for full-height,
  add bottom padding to clear the global mobile bottom nav bar; keep `md:/lg:`
  desktop styles untouched (scope mobile to base/`sm:`).
- **Design** — "calm study workspace": one restrained **teal** accent, generous
  reading width/line-height, **no** animated background.
- **Deploy** — `bash deploy.sh` (rsyncs working tree → VPS → build → db push →
  health check). Auto-prunes Docker images. Verify: containers healthy +
  protected endpoint returns 401 (mounted) + `db push` "already in sync".

---

## 1. DONE — Phase 1 (live)

- **Schema** (`prisma/schema.prisma`, migration
  `prisma/migrations/20260627120000_add_notes_feature`): 6 models, all
  `userId`-scoped + cascade —
  `NoteSubject → NoteChapter → Note` (+ `NoteAttachment`, `NoteLink`,
  `NoteVocabEntry`). `note_vocab_entries` table EXISTS but has no API yet.
- **API** `/api/v1/notes` (`src/routes/notes.routes.ts`,
  `src/services/notes.service.ts`): tree + recent, CRUD subject/chapter/note,
  reorder (subjects/chapters/notes), full note read, idempotent note save
  (`contentJson` + cached `contentHtml`).
- **UI**: sidebar tree (add / inline-rename / delete), TipTap editor
  (StarterKit + Placeholder + Image) with debounced **auto-save** + **image
  paste / drag-drop** upload, mobile drawer, "Notes" nav link (authOnly).
- Fixes shipped: live title rename, image no longer traps the cursor, mobile
  drawer button overlap.

## 2. DONE — Phase 2 (live)

- **API**: attachments + links at **note OR subject** level
  (`resolveParent` enforces exactly one owned parent), link type auto-detect
  (YouTube vs web), `getSubject`, **full-text search** (`title` + `contentHtml`,
  filters: `subjectId` + `tag`, returns snippet), `listTags`.
- **UI**: `NoteResourcePanel` (file upload, YouTube lazy embed, web favicon
  card), `SubjectView` (subject resources + note list), `NotesSearch` modal
  (⌘/Ctrl+K, subject+tag filters, jump-to-note). Resources drawer + search
  button in the toolbar; open-subject from sidebar; sidebar row actions made
  touch-reachable.

---

## 3. TODO — remaining work

### Phase 2.5 — Drag-reorder (do FIRST, small PR)
- API already exists: `reorderSubjects`, `reorderChapters`, `reorderNotes`.
- Add dnd-kit drag handlers in `NotesSidebar.tsx`; call the reorder endpoints on
  drop. Mobile-friendly (long-press to drag). Respect `prefers-reduced-motion`.

### Phase 3a — Vocabulary
- **API** (add to `notes.service.ts` + routes under `/notes/vocab`, mirror the
  attachments pattern): create / update / delete / reorder `NoteVocabEntry`
  (belongs to a note). Fields: `term, reading, meaning, example, sortOrder`.
- **UI**: editable vocab table per note (term | reading | meaning | example),
  drag-reorderable, in the note resource drawer or a dedicated tab.

### Phase 3b — Flashcards + TTS
- Flashcard review generated from a note's vocab: 3D flip, mark known/unknown.
  Respect `prefers-reduced-motion`.
- Pronunciation: speaker button using browser `SpeechSynthesis`, correct lang
  voice (ja / zh / en) from the subject or a per-note language hint.

### Phase 3c — Rich editor upgrade
- Code blocks: **reuse `frontend/src/components/markdown/CodeBlock.tsx` (Shiki)**
  via a Tiptap **NodeView** (don't add lowlight). Same language list.
- **KaTeX** inline `$..$` + block `$$..$$` via a custom Tiptap Node —
  **lazy-loaded** (dynamic import; only on the notes editor).
- Slash menu (`/`) to insert blocks; markdown shortcuts; callouts
  (tip/note/warning); toggle/collapsible; table; checklist; hr.
- Auto-generated **Table of Contents** from headings.

### Phase 3d — Quality-of-life
- Export a note to **PDF / print**.
- **Archive** view, **Favorites** view, **Needs-review** view. DB flags already
  exist on `Note`: `isArchived`, `isFavorite`, `needsReview`, `reviewDate`.

---

## 4. Decisions (locked in)

| # | Topic | Decision |
|---|-------|----------|
| 1 | KaTeX math | **Yes**, but **lazy-load** (user has Math notes) |
| 2 | Code highlight | **Reuse `CodeBlock.tsx` (Shiki)** via Tiptap NodeView — no lowlight |
| 3 | Drag-reorder | **Separate Phase 2.5, do first** (API already exists) |
| 4 | Phase 3 order | **3a vocab → 3b flashcard+TTS → 3c editor → 3d QoL** |
| 5 | Vocab API | **In `notes.service.ts`**, routes `/notes/vocab`, mirror attachments |
| 6 | Tests | **Manual UI + `tsx` smoke scripts** for critical paths (no Playwright) |
| 7 | Deploy | **One branch per sub-phase**, merge to main after verify |
| 8 | Bundle | **Lazy-load** all Phase 3 extensions (note: 2.7GB is `.next` *cache*, not the shipped bundle) |

**Build order:** 2.5 → 3a → 3b → 3c → 3d. Each sub-phase: lazy-load new deps,
own branch, typecheck both sides, `tsx` smoke test on the critical path,
`bash deploy.sh`, verify healthy + 401, merge `main`.

---

## 5. File map

**Backend**
- `src/services/notes.service.ts` — all logic (add vocab here)
- `src/routes/notes.routes.ts` — routes (add `/notes/vocab*` here), mounted in
  `src/index.ts` as `app.use('/api/v1/notes', notesRoutes)`
- `prisma/schema.prisma` — `Note*` models (Phase 1)

**Frontend**
- `src/app/notes/page.tsx` — orchestrator (state, layout, drawers, search)
- `src/components/notes/`
  - `NotesSidebar.tsx` — tree (add dnd-kit here for 2.5)
  - `NoteEditor.tsx` — TipTap editor (extend for 3c)
  - `NoteResourcePanel.tsx` — attachments + links (add vocab table near here)
  - `SubjectView.tsx` — subject resources view
  - `NotesSearch.tsx` — global search modal
- `src/lib/api.ts` — `notesApi` (add vocab methods)
- `src/types/index.ts` — `Note*` types
- `src/app/globals.css` — `.note-prose` editor styles
- `src/components/layout/Navbar.tsx` — `TOP_NAV_LINKS` has the Notes entry
- Reuse: `src/components/markdown/CodeBlock.tsx` (Shiki) for 3c

**Installed deps (frontend):** `@tiptap/react @tiptap/pm @tiptap/starter-kit
@tiptap/extension-placeholder @tiptap/extension-image` (v2.27.x).
Phase 3 will add (lazy): `katex`, `@tiptap/extension-table` (+ row/cell/header),
`@tiptap/extension-task-list` + `task-item`, a custom KaTeX node, dnd-kit
(already used elsewhere in the repo — check before adding).

---

## 6. Smoke-test recipe (reuse for new endpoints)

Write a temp `_smoke.ts` at repo root, run `npx tsx _smoke.ts`, then delete it.
Pick a real user, exercise the new service fns directly, assert: round-trips,
**no duplicates** after repeated saves, and **cross-user access is blocked**
(call with `userId + 999999` → expect throw / empty). See git history of Phase
1/2 commits for the exact pattern.
