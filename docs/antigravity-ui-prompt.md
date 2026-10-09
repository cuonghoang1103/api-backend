# Prompt for Antigravity (Gemini) — UI redesign, safe mode

Paste everything below the line into Antigravity at the start of the session.

---

You are helping redesign the UI of a production web app (cuongthai.com). Another AI agent is working on the
same codebase in a DIFFERENT folder. Your job is UI only. Follow these rules strictly. If a rule blocks you, STOP and ask me.

## Where you work
- Work ONLY inside this folder: `~/Downloads/api-backend-gemini` (a git worktree on branch `ui-gemini`).
- NEVER open, read-modify, or run commands in `~/Downloads/api-backend` (the main folder). It contains unreleased work.
- Stay on branch `ui-gemini`. You may `git add` + `git commit` on this branch with clear messages. NEVER `git push`,
  `git merge`, `git rebase`, `git reset --hard`, `git checkout main`, `git stash`, or delete branches.

## What you may change
- Only frontend UI files: `frontend/src/**` (`.tsx`, `.ts`, `.css`) and static assets in `frontend/public/**` you create.
- Do NOT change: `src/**` (backend), `prisma/**`, `desktop/**`, `nginx/**`, `.github/**`, `deploy*.sh`, `Dockerfile*`,
  `docker-compose*`, `package.json`, `package-lock.json`, any `.env*` file, `frontend/next.config.*`, `CLAUDE.md`.
- Do NOT change API calls, request/response shapes, route paths, auth logic, or data fetching in `frontend/src/lib/**`.
  Change how things LOOK, not what they DO.
- Do NOT add npm packages. Use what is already installed: Tailwind CSS, lucide-react icons, framer-motion, recharts.

## Commands
- FORBIDDEN, never run: `deploy-nha.sh`, `deploy.sh`, `git push`, any `prisma` command, `npm install <pkg>`,
  `npm update`, `docker ...`, `ssh ...`, `rm -rf` outside `frontend/.next-gemini`.
- Allowed:
  - `cd frontend && npx tsc --noEmit`
  - `cd frontend && NEXT_DIST_DIR=.next-gemini NODE_OPTIONS=--max-old-space-size=12288 npx next build --no-lint`
  - `cd frontend && npm run dev -- -p 3200` to preview. The backend is NOT running for you; pages may show
    empty/error states. That is fine — design those states too.
- After any `next build`, run `git checkout -- frontend/tsconfig.json`. Next.js rewrites that file; do not commit the change.
- Ask me before running anything not listed here.

## Design system rules (must follow)
- **Dark mode:** the global dark theme is the class `theme-dark` on `<html>`. NEVER use Tailwind `dark:` variants.
  They are reserved for the Notes feature only. For theme-dependent colors use CSS variables
  (`var(--text-primary)`, etc.) or `html.theme-dark ...` CSS.
- **CT Work (`/work/**`):**
  - Use the tokens in `frontend/src/app/work/work.css`: `--w-*` for colors, and `--w-*-text` for colored TEXT
    (these were tuned to pass WCAG AA 4.5:1 contrast).
  - Reuse existing components: `KpiTile`/`KpiRow`, `.w-page`, `.w-btn`, `.w-input`, `Field`, `UserAvatar`.
  - All CT Work UI text is ENGLISH.
- **Accessibility must not regress:**
  - Every input has a label.
  - No button inside another clickable element.
  - Keyboard focus is visible.
  - Contrast is ≥ 4.5:1.
  - The current axe result on `/work` pages is 0 violations — keep it 0.
- **React:** all hooks must be called before any early `return` (rules of hooks). Breaking this crashed production before.
- **Layout:** pages must work at 390px wide (phone) with NO horizontal scroll, and at 1180px (desktop app width).
- **Vietnamese text** must keep diacritics. Use fonts that support Vietnamese.
- **No 3D or decorative animation** on management pages (CT Work, admin). Aim for clean enterprise style
  (Linear / Atlassian / Notion): clear hierarchy, consistent spacing, consistent status colors.
- **Images/illustrations:** only ones you create (SVG/CSS) or that are already in the repo. No copyrighted images.

## How to work
1. Before changing a page, write a short plan: which file(s), what will change, why.
2. Take a screenshot BEFORE (light + dark, 1440px and 390px) if you can.
3. Change one page (or one shared component) at a time.
4. After each page:
   - `npx tsc --noEmit` must pass.
   - Check light + dark at 1440px and 390px.
   - Commit on `ui-gemini` with message `ui(<page>): <what changed>`.
5. If a shared component change affects many pages, list the affected pages in the commit message.

## Pages to improve
<I will list them here — links or screenshots>

## When you finish, give me
- A list of commits (hash + one line each).
- For each page: what changed and why, plus BEFORE/AFTER screenshots.
- Anything you were unsure about or did not finish.
- Confirmation that you ran no forbidden commands and touched no forbidden files.
