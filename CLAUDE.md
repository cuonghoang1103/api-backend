# Claude Code Instructions - api-backend

## Project Overview
This is a full-stack application with:
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: Next.js
- **Deployment**: Docker containers on VPS via GitHub Actions

## Critical Rules - MUST FOLLOW

### 1. BEFORE COMMITTING/DEPLOYING - Mandatory Checklist

**ALWAYS run these commands BEFORE pushing code:**

```bash
# 1. TypeScript check for backend
npx tsc --noEmit

# 2. Prisma generate (when schema changes)
npx prisma generate

# 3. Prisma format (when schema changes)
npx prisma format
```

**ALWAYS check these BEFORE pushing:**

- [ ] `npx tsc --noEmit` passes (no TypeScript errors)
- [ ] `npx prisma generate` succeeds (Prisma client generated)
- [ ] Frontend builds successfully: `cd frontend && npm run build`
- [ ] No JSX syntax errors (missing/extra closing tags)
- [ ] All new Prisma models have proper back-relations defined

### 2. Prisma Schema Rules

**CRITICAL: When adding new models, you MUST:**

1. Define the model with all fields
2. Add back-relation in parent models using unique `@relation("Name")` attributes
3. Run `npx prisma generate` to generate client
4. Create migration: `npx prisma migrate dev --name descriptive_name`
5. Verify migration file is created in `prisma/migrations/`

**Back-relation pattern:**
```prisma
model Parent {
  id        Int      @id
  children  Child[]  @relation("ChildRelation")
}

model Child {
  id       Int   @id
  parentId Int
  parent   Parent @relation("ChildRelation", fields: [parentId], references: [id])
}
```

**Common errors to avoid:**
- Missing opposite relation field in parent model
- Duplicate `@relation()` names
- Ambiguous relations (two fields pointing to same model without distinct names)

### 3. Frontend JSX/TSX Rules

**CRITICAL: Always verify JSX structure:**
- Match every opening tag with closing tag
- No duplicate closing tags
- Proper nesting of elements

**Before building frontend:**
```bash
cd frontend && npm run build
```

### 4. GitHub Actions Deploy Rules

**Deploy workflow (`deploy-ghcr.yml`) runs:**
1. CI - Lint & Type Check (must pass)
2. Deploy via GHCR (builds Docker images)
3. Deploy Backend to VPS (pushes to server)
4. Prisma migration (runs on VPS)

**If deploy fails:**
1. Check GitHub Actions logs for specific error
2. Common failures:
   - TypeScript errors → Run `npx tsc --noEmit` locally
   - Frontend build errors → Check JSX syntax
   - Prisma errors → Run `npx prisma generate`

## Previous Errors - DO NOT REPEAT

### Error 1: Deploy Failed - JSX Syntax Error
**Date:** 2026-06-29
**File:** `frontend/src/components/notes/NotesShareManagerModal.tsx`
**Issue:** Missing closing `</div>` tag in conditional render block
**Fix:** Verify JSX structure, ensure every opening tag has matching close

### Error 2: Deploy Failed - Prisma Schema Relations
**Date:** 2026-06-29
**Issue:** Missing back-relation fields in Prisma models
**Models affected:**
- `NoteSubjectShare` - missing back-relation in `NoteSubject`
- `NoteSubjectShareRecipient` - missing back-relations in `NoteSubject` and `User`

**Fix:** Add proper `@relation()` attributes and back-relation arrays:
```prisma
// In NoteSubject model
shares         NoteSubjectShare[]
shareRecipients NoteSubjectShareRecipient[] @relation("SubjectShareRecipients")

// In NoteSubjectShare model
recipients NoteSubjectShareRecipient[]

// In NoteSubjectShareRecipient model
share    NoteSubjectShare @relation(...)
subject  NoteSubject     @relation("SubjectShareRecipients", ...)
user     User           @relation("UserShareRecipients", ...)
```

### Error 3: Prisma Generate Failed
**Issue:** Schema validation errors
**Fix:** Always run `npx prisma format` after editing schema

### Error 4: Prisma Unique Constraint Naming
**Date:** 2026-06-29
**File:** `src/services/notesShare.service.ts`
**Issue:** Wrong unique constraint name `subjectId_recipientId` instead of `uk_note_subject_share`
**Fix:** When using `@@unique` with custom name, use that name in Prisma queries:
```typescript
// Wrong
where: { subjectId_recipientId: { subjectId, recipientId } }

// Correct
where: { uk_note_subject_share: { subjectId, recipientId } }
```

### Error 5: Migration Failed - Table Already Exists
**Date:** 2026-06-29
**Issue:** Migration failed because table already exists in DB
**Fix:** Make migrations idempotent:
```sql
CREATE TABLE IF NOT EXISTS "table_name" (...);
-- For constraints:
DO $$ BEGIN IF NOT EXISTS (...) THEN ALTER TABLE ... END $$;
```

### Error 6: Migration Stuck in Failed State (P3009)
**Date:** 2026-06-29
**Issue:** Previous failed migration blocks new migrations
**Fix:** In deploy workflow, handle P3009 by marking as rolled back:
```bash
npx prisma migrate resolve --rolled-back "migration_name"
```

## Feature Implementation Guidelines

### Adding New Features

1. **Plan first:** Understand the full scope
2. **Backend first:**
   - Add Prisma models (with proper relations)
   - Run `npx prisma generate`
   - Create migration
   - Add service layer
   - Add routes
3. **Frontend second:**
   - Add API methods
   - Add components
   - Test locally
4. **Verify:**
   - TypeScript passes
   - Frontend builds
   - Commit and push

### Notes Sharing Feature (Phase 4)

**Backend:**
- Service: `src/services/notesShare.service.ts`
- Routes: `src/routes/notesShare.routes.ts`

**Frontend:**
- Component: `frontend/src/components/notes/NotesShareManagerModal.tsx`
- API: `noteShareApi` in `frontend/src/lib/api.ts`

**Database:**
- `note_subject_shares` - stores share records
- `note_subject_share_recipients` - tracks seen status

## Testing Checklist

Before deploying any feature:
- [ ] `npx tsc --noEmit` passes
- [ ] `npx prisma generate` succeeds
- [ ] `cd frontend && npm run build` succeeds
- [ ] All new migrations created
- [ ] GitHub Actions CI passes

## Useful Commands

```bash
# Backend
npx tsc --noEmit                    # Type check
npx prisma generate                  # Generate Prisma client
npx prisma format                    # Format schema
npx prisma migrate dev --name <name> # Create migration

# Frontend
cd frontend && npm run build        # Build
cd frontend && npm run lint          # Lint

# Git
git status                          # Check changes
git log --oneline -5                 # Recent commits
gh run list                         # Check GitHub Actions
```
