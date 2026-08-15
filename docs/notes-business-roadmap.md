# Notes Business Upgrade Roadmap

## Product decision

The target is a professional, Notion-inspired knowledge workspace built on the
existing Notes module. It is not a pixel clone and it should not attempt to
reproduce Notion's entire company, infrastructure, or pricing plan in one
release.

The existing `/notes` route, data ownership rules, study-specific features, and
saved user data remain the foundation. New capabilities are added in vertical
slices that can be tested and deployed independently.

## What already exists

- A TipTap block editor with headings, lists, checklists, quotes, tables,
  images, code blocks, callouts, math, undo/redo, slash commands, and autosave.
- Subject → chapter → note hierarchy with drag-and-drop ordering and pinning.
- Multi-tab navigation, recent notes, favorites, archive, and review filters.
- Full-text search across title and cached HTML, plus subject and tag filters.
- Subject-level sharing with `view` and `edit` permission values.
- Attachments, links, PDF export, vocabulary tables, and flashcard review.
- Light, dark, and brown themes scoped to the Notes route.

## Important gaps found in the audit

1. The current `edit` share permission is stored and displayed, but shared
   notes still open in a read-only viewer. A permission label is not yet an
   editable collaboration workflow.
2. Delete is permanent. There is no trash, restore window, or retention policy.
3. There is no immutable version history, compare view, or restore operation.
4. There are no page comments, inline comments, mentions, notifications, or
   resolved discussion threads.
5. There is no real-time document protocol: no presence, cursors, conflict-free
   merge, or reconnect reconciliation.
6. Tags exist, but the page previously had no first-class property editor.
7. There is no general database engine with typed properties and table, board,
   calendar, gallery, timeline, grouped, filtered, and sorted views.
8. There are no nested page links, backlinks, relation properties, rollups, or
   graph navigation.
9. There are no reusable page/database templates or template governance.
10. There is no Notes-scoped public API, webhook delivery, integration token,
    or automation runner.
11. There is no workspace/teamspace model, private teamspace, group permission,
    row-level database permission, verified page, or domain/SSO administration.
12. There is no Notes AI layer for semantic search, RAG answers with citations,
    summarization, extraction, or self-hosted model routing.

## Phase 1 — Professional page operations

Status: implemented in the current working tree.

- Show the current subject/chapter as a page breadcrumb.
- Edit tags directly on the page.
- Move a note between subjects and chapters with server-side ownership checks.
- Set or clear a review date.
- Show created and last-updated timestamps.
- Duplicate a full note transactionally, including content, attachments, links,
  and vocabulary rows.

Acceptance:

- A failed move cannot leave a note in a chapter owned by another user.
- A duplicate appears only after all child rows have been copied.
- Mobile inputs remain at least 16px to avoid iOS focus zoom.
- All icon-only controls expose an accessible name and keyboard focus state.

## Phase 2 — Safety and history

Status: core workflow implemented in the current working tree. Audit events,
duplicate idempotency keys, and richer block-level diff highlighting remain for
a later hardening pass.

- Add `deletedAt`, `deletedById`, and a 30-day trash/restore workflow.
- Add immutable `NoteVersion` snapshots with actor, reason, and version number.
- Create versions on meaningful saves, not every keystroke; coalesce autosaves
  into a time window to prevent unbounded history growth.
- Add side-by-side compare and restore. Restoring creates a new version so restoration is
  itself reversible.
- Add duplicate idempotency keys and audit records for destructive operations.

## Phase 3 — Collaboration and permissions

Status: collaboration core implemented in the current working tree: enforced
owner/editor/commenter/viewer roles, shared rich-text editing, page discussion
threads, replies, resolve/reopen, mentions, and notification deep links. Inline
block anchors, groups/teamspaces, and granular database-row permissions remain
for later phases because they depend on stable collaborative block/database IDs.

- Replace string permissions with typed roles: owner, editor, commenter, viewer.
- Enforce shared editing on every read and mutation service, not only in the UI.
- Add page comments, inline comment anchors, replies, resolve/reopen, mentions,
  and notification delivery.
- Add workspace membership, groups, teamspaces, private teamspaces, and guest
  access.
- Add granular database row permissions after the database engine exists.

## Phase 4 — Real-time editing

- Use a CRDT document protocol (Yjs is the preferred fit for TipTap).
- Add a WebSocket collaboration gateway, short-lived document tokens,
  connection presence, cursors, reconnect, and offline update queues.
- Persist compacted CRDT state plus periodic recoverable snapshots.
- Keep PostgreSQL as metadata/history storage; do not write one database row per
  keystroke.
- Load-test concurrent editing and prove that two users cannot overwrite each
  other's changes.

## Phase 5 — Databases and views

- Introduce `NoteDatabase`, typed property definitions, rows, and cell values.
- Support text, number, select, multi-select, date, person, checkbox, URL, file,
  relation, formula, and rollup properties in deliberate increments.
- Add saved table, board, calendar, gallery, and timeline views.
- Add filter groups, multi-sort, grouping, hidden columns, view permissions, and
  CSV import/export.
- Treat forms as a view over a database; conditional form logic follows after
  the base form is stable.

## Phase 6 — Knowledge graph and discovery

- Add durable page URLs and deep links.
- Add nested pages, page mentions, backlinks, relation properties, and link
  previews.
- Move search to PostgreSQL full-text indexes, then add vector embeddings for
  semantic retrieval.
- Add verified-page status and stale-document review reminders.

## Phase 7 — AI with the self-hosted model

- Route AI through an authenticated backend service; the browser never talks
  directly to the home model host.
- Ingest only documents the requesting user can read.
- Store chunk metadata, embeddings, source page/version, and permission scope.
- Answer with citations back to the exact note and block/version.
- Add summarize, rewrite, translate, action-item extraction, quiz generation,
  and workspace Q&A.
- Redact secrets, cap context/token usage, log model latency, and support model
  unavailability without blocking normal Notes use.

## Phase 8 — Automations and integrations

- Add scoped integration tokens, outbound webhooks, retries, signatures,
  delivery logs, and dead-letter handling.
- Add database/page triggers and safe actions with execution history.
- Add calendar, GitHub, Google Drive, and other integrations only after the
  permission and audit foundations are complete.

## Phase 9 — Business administration

- Add workspace settings, member lifecycle, groups, private teamspaces, guest
  limits, page verification, and usage controls.
- Add SAML SSO and verified domains only when there is a real organization that
  needs them; these require identity-provider configuration, certificate
  rotation, and account-recovery procedures.
- Add audit-log export and retention as an enterprise-grade extension. It is not
  required to make the core editor useful.

## Delivery rules

- One vertical slice per branch and reviewable pull request.
- Every new data model includes ownership/back-relations, a hand-written
  migration for this repository, service-level permission tests, and rollback
  notes.
- Shared permissions are verified in backend services; frontend hiding is never
  considered authorization.
- No production deploy or GitHub push occurs until local checks pass and the
  owner explicitly approves it.
- Existing Notes data must remain readable throughout every phase.
