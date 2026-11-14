/*DU_LIEU*/
const DU_LIEU = {
 "n20-5:file:mig/app-v1.sh": "#!/bin/sh\n# app v1 — reads users.name\nsqlite3 \"$1\" \"SELECT 'v1 sees: ' || name FROM users ORDER BY id LIMIT 2;\"\n",
 "n20-5:file:mig/app-v2.sh": "#!/bin/sh\n# app v2 — the column was renamed to full_name\nsqlite3 \"$1\" \"SELECT 'v2 sees: ' || full_name FROM users ORDER BY id LIMIT 2;\"\n",
 "n20-5:file:mig/002_rename.sql": "-- migration shipped with v2\nALTER TABLE users RENAME COLUMN name TO full_name;\n",
 "n20-5:mig": "$ cd mig && sqlite3 prod.db \"CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT); INSERT INTO users(name) VALUES ('An'),('Binh');\" && sh app-v1.sh prod.db\nv1 sees: An\nv1 sees: Binh\n$ deploy v2: run the migration, then start app v2\nv2 sees: An\nv2 sees: Binh\n$ v2 has a bug → roll back the CODE to v1 (git revert / old image)\nParse error in 2nd command line argument: no such column: name\n  SELECT 'v1 sees: ' || name FROM users ORDER BY id LIMIT 2;\n$ cd mig && sqlite3 prod.db \".schema users\"\nCREATE TABLE users(id INTEGER PRIMARY KEY, full_name TEXT);",
 "n20-5:data": "$ sqlite3 local.db \"CREATE TABLE posts(id INTEGER PRIMARY KEY, title TEXT); INSERT INTO posts(title) VALUES ('Lesson 1'),('Lesson 2'),('Lesson 3');\" && echo \"local.db posts: $(sqlite3 local.db 'SELECT count(*) FROM posts')\"\nlocal.db posts: 3\n$ deploy = new image (code) — production keeps its OWN database\nprod.db posts after deploy: 0\nwhat the image carries: node_modules package.json public server.js ",
 "n20-5:lui": "$ docker run -d --name nxj-prod -p 127.0.0.1:19347:3000 nxj-std:v2 >/dev/null; sleep 4; echo \"running v2: /api/hello → $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:19347/api/hello)\"\nrunning v2: /api/hello → 200\n$ rollback: the previous image is still here — swap back\nrolled back to the old image in 2.6 s · /api/hello → 404 · /ver → 200\n$ docker images --format '{{.Repository}}:{{.Tag}} {{.ID}} {{.CreatedSince}}' | grep '^nxj-std'\nnxj-std:v2 03a0ca7398cb 38 seconds ago\nnxj-std:latest 6ff8e07407ee 3 minutes ago",
 "n20-5:cay": "$ edit a file, do NOT commit, deploy\n M src/app/ver/page.tsx\n$ echo \"working tree:  $(grep -o 'Release v[0-9a-z-]*' src/app/ver/page.tsx)\"; echo \"committed HEAD: $(git show HEAD:src/app/ver/page.tsx | grep -o 'Release v[0-9a-z-]*')\"\nworking tree:  Release v1-hotfix\ncommitted HEAD: Release v1",
 "n20-5:dung": "$ docker ps -a --format '{{.Names}}' | grep -c '^nxj-' | sed 's/^/containers nxj- còn lại: /'\ncontainers nxj- còn lại: 0",
 "n20-5:kho": "$ grep -n '^info \"' deploy-nha.sh | sed -E 's/^([0-9]+):info \"/\\1: /; s/\\.\\.\\.\"$//' | head -16\n507: Kiểm máy nhà\n552: Gửi mã (commit ${SHA}) sang máy nhà\n577: Build backend + frontend SONG SONG ở máy nhà (đo trước: ~6 phút)\n633: Kiểm ảnh backend có chạy nổi không (libc ↔ engine Prisma)\n676: Đẩy ảnh lên GHCR\n708: Tráo container trên VPS (có khoá chống hai phiên cùng tráo)\n789: Nạp lại nginx ngay (tráo container có thể đã đổi IP upstream)\n807: Kiểm từ NGOÀI (qua nginx, đúng đường người dùng đi)\n827: Chạy migration\n866: Chạy seed nội dung (Step 3.5→3.17 từ deploy.sh)\n911: Chờ backend khoẻ\n931: Smoke-test các route lõi\n953:   ${SO_ROUTE} route\"\n994: Kiểm nginx.conf trên VPS\n1161: Dọn ảnh deploy CŨ trên VPS (giữ ${SHA} + latest)\n1273: Kiểm lại: container có đang chạy đúng ảnh vừa tráo không\n$ grep -n \"git revert <bad_commit_sha>\\|NEVER.*migrate reset\" CLAUDE.md | cut -c1-110 | head -2\n50:- **NEVER** run `npx prisma migrate reset` — it wipes ALL data\n350:git revert <bad_commit_sha>"
};
/*HET_DU_LIEU*/
import { lamDeck, tsx, tn, box, two, steps, kw, c, icards, thucTe4 } from './_nxj-chung.mjs';

// ── số đo (n20-5 · lab c20 · sqlite3 (macOS) · Docker Desktop 29.8 · ảnh nxj-std / nxj-std:v2 · kho api-backend 14/11/2026)
export const deck = { key: 'nxj-20-5', code: 'NXJ 20.5', title: 'After deploy: migrations, rollback, and a safe flow', sub: 'Chapter 20 · Lesson 20.5' };
const O = (k) => { const v = DU_LIEU[`n20-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const D = (...a) => `<div>${a.join('')}</div>`;
const sach = (ds) => ds.map((l) => l.trim()).filter(Boolean);
const tim = (ds, re) => { const l = ds.find((x) => re.test(x)); if (!l) throw new Error('thiếu dòng ' + re); return l; };
const MIG = O('mig').split('\n'), DATA = O('data').split('\n'), LUI = O('lui').split('\n'), CAY = O('cay').split('\n');
const KHO = O('kho').split('\n'), KS = KHO.slice(1, KHO.findIndex((l, i) => i > 0 && l.startsWith('$ ')));
const T_LUI = +tim(LUI, /rolled back/).match(/in ([\d.]+) s/)[1];
if (!/RENAME COLUMN name TO full_name/.test(O('file:mig/002_rename.sql'))) throw new Error('mã lab đổi');
const gon = (ds) => sach(ds).map((l) => l.replace(/^\$ cd mig && /, '$ ').replace(/ && sh app-v1\.sh prod\.db$/, ' && sh app-v1.sh prod.db'));

export const S = [
  { cover: true, nhan: 'Chapter 20 · Lesson 20.5 · Course finale', t: 'After deploy: migrations,<br>rollback, and a safe flow', sub: 'A deploy ships code, not data — a rollback that brings back a crash, an image swap in seconds, and the deploy that shipped the wrong files',
    en: 'Lesson twenty point five, the course finale: after deploy, migrations, rollback, and a safe flow. A deploy ships code, not data. A rollback that brings back a crash, an image swap in seconds, and the deploy that ships the wrong files.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>A deploy ships <b>code</b>: local DB 3 posts, production 0 after “deploying”</li>
    <li>Migrate, then roll the code back: v1 crashes with <b>no such column: name</b></li>
    <li>Keep the previous image: rollback in <b>${T_LUI} s</b> here</li>
    <li>An uncommitted edit: the working tree says <i>hotfix</i>, the commit does not</li>
    <li>One script, checks inside it, verified after — the whole course in one flow</li></ul>`,
    en: `Five takeaways. A deploy ships code, not data. Migrate, then roll the code back, and the old code crashes. Keep the previous image and a rollback takes about ${T_LUI} seconds. An uncommitted edit is not what ships. And one script with the checks inside it.` },
  { t: 'A deploy ships code, not data', body: two(D(tn(sach(DATA).join('\n'), { fs: 15, wrap: 60, title: 'local DB vs production DB vs the image (real)' })),
    D(box('Your local data stays local', 'Seeding three lessons into <code>local.db</code> does nothing to production. The image carries <code>server.js</code>, <code>public</code>, <code>node_modules</code> — no database.', 'do2'),
      box('cuongthai.com’s biggest deploy lesson', 'Content seeded locally, then “deployed” — production stayed empty until someone looked. Since then the deploy runs the content seed on the server (step “Chạy seed nội dung”).', 'lam')), 'r64'),
    en: 'A deploy ships code, not data. Three lessons in the local database; after deploying, the production database has zero. The image carries the server, public files and node modules, never your database. This course’s site learned it the hard way, and its deploy now runs the content seed on the server.' },
  { t: 'Migration: the database changes shape', body: two(D(tsx(O('file:mig/002_rename.sql').trim() + "\n\n# app v1: SELECT name FROM users\n# app v2: SELECT full_name FROM users", { hl: [2] }),
      tn(gon(MIG.slice(0, MIG.findIndex((l) => l.includes('v2 has a bug')))).join('\n'), { fs: 14, wrap: 64, title: 'sqlite3 prod.db (real)' })),
    D(box('Code and data move together', 'v2 needs the renamed column, so the deploy runs the migration first, then starts v2. Both versions worked — each with its own schema.', 'lam'),
      box('The rules this repo writes down', 'Never <code>migrate reset</code> on production; never auto-“resolve” a failed migration — stop and look first.', 'xanh')), 'r46'),
    en: 'A migration changes the shape of the database. Release two renames name to full name, so the deploy runs the migration, then starts the new code. Both versions work, each with its own schema. This repository’s rules: never reset production, never auto-resolve a failed migration.' },
  { t: 'Roll back the code — the database stays', body: two(D(tn(gon(MIG.slice(MIG.findIndex((l) => l.includes('v2 has a bug')))).join('\n'), { fs: 14, wrap: 64, title: 'rollback to v1, same database (real)' })),
    D(box('Reverting code does not revert a migration', 'v1 asks for <code>name</code>; the column is <code>full_name</code> now. The rollback brought back an <i>outage</i>.', 'do2'),
      box('Expand, then contract', 'Add the new column (keep the old) → deploy code that writes both → backfill → only later drop the old one. Every step can be rolled back.', 'xanh')), 'r64'),
    en: 'Roll the code back, and the database stays where it is. Version one asks for the name column, which no longer exists: no such column. The rollback brought back an outage. The safe pattern is expand, then contract: add the new column, run code that handles both, and drop the old one much later.' },
  { t: `Keep the previous image: rollback in ${T_LUI} s`, body: two(D(tn(sach(LUI).join('\n'), { fs: 14, wrap: 64, title: 'docker: v2 → back to the previous image (real)' })),
    D(box('Swap, don’t rebuild', `The old image was still on the machine: remove the container, start the old tag, ${T_LUI} s until it answers. A rebuild took ~2 minutes in 20.3.`, 'xanh'),
      box('cuongthai.com', 'The deploy keeps the previous image on the VPS; CLAUDE.md documents re-tagging an orphan image and starting it — “~40 s instead of a 15-minute rebuild”.', 'lam')), 'r64'),
    en: `Keep the previous image. Release two answered on the new route; swap back to the previous image: ${T_LUI} seconds until it answers, the new route is gone, the old pages are back. Rebuilding took about two minutes. This course’s deploy keeps old images on the server for exactly this.` },
  { t: 'Deploy from a commit, not from your working tree', body: two(D(tn(sach(CAY).join('\n'), { fs: 15, wrap: 60, title: 'an edit you did not commit (real)' })),
    D(box('Two answers to “what ships?”', 'A deploy that copies the working tree ships <i>hotfix</i> — and anyone else’s half-saved file. One that builds a commit ships <i>v1</i>. Both directions have bitten real teams.', 'do2'),
      box('cuongthai.com chose the commit', '<code>deploy-nha.sh</code> builds the exact SHA (git push to the build machine), and asks <code>[y/N]</code> if the tree is dirty.', 'xanh')), 'r64'),
    en: 'Deploy from a commit, not from your working tree. Edit a file without committing: the working tree says hotfix, the commit says v1. Which one ships depends on the deploy mechanism. This course’s deploy builds the exact commit and warns when the tree is dirty.' },
  { t: 'A flow that is hard to get wrong', body: two(steps([
      `Check locally: ${c('tsc')} · ${c('next build')} · tests (Ch. 19)`,
      'Commit; deploy that SHA with ONE script',
      'Build image → push → swap; migrate; seed content',
      'Smoke-test from outside; compare the running image',
      'Keep the previous image; know how to swap back',
    ]), D(tn(KS.join('\n'), { fs: 13, wrap: 60, title: 'deploy-nha.sh — its steps (real)' })), 'r46'),
    en: 'A flow that is hard to get wrong. Check locally: type-check, build, tests. Commit, and deploy that exact commit with one script. Build, push, swap, migrate, seed. Smoke-test from outside and compare the running image. And keep the previous image ready. On the right, the real steps of this course’s deploy script.' },
  { t: 'The whole course, in one breath', to: true, body: icards([
      ['code', 'React (Ch. 1–7)', 'JSX, components, state, effects, hooks, lists — and how React re-renders.'],
      ['layers', 'App Router (Ch. 8–12)', 'Server vs Client Components, data, cache, streaming, routes, Server Actions.'],
      ['shield', 'Real apps (Ch. 13–17)', 'Styling, state, auth with cookies, forms and uploads, rendering and SEO.'],
      ['rocket', 'Production (Ch. 18–20)', 'Measure, test, build, ship — and prove what is running.'],
    ], 2),
    en: 'The whole course in one breath. React: JSX, components, state, effects and re-rendering. The App Router: Server and Client Components, data, caching, streaming, Server Actions. Real apps: styling, state, auth, forms, uploads, rendering and SEO. And production: measure, test, build, ship, and prove what is running.' },
  { t: 'Not learning in a vacuum: real life, what if, the attacker', to: true, body: thucTe4({
      doi: ['🗄️', '“I deployed, where is my content?”', ['local seed ≠ production data', 'production stayed empty']],
      neu: ['❓', 'What if you roll back after a migration?', ['old code, new schema', 'the rollback is the outage']],
      xau: ['🕵️', 'A dirty tree is a supply-chain hole', ['whatever is on disk gets shipped', 'another session’s file, a debug flag']],
      phong: ['🛡️', 'Commit, migrate safely, keep the old image', ['deploy a SHA; expand→contract', 'smoke-test; swap back in seconds']],
    }),
    en: 'Real life: I deployed, where is my content? Local data never ships. What if you roll back after a migration? Old code, new schema: the rollback is the outage. A dirty working tree is a supply-chain hole: whatever is on disk gets shipped. Deploy a commit, migrate in safe steps, and keep the old image.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Migration', 'the DB changes shape'), kw('Code ≠ data', 'a deploy ships code'), kw('Seed', 'content put into a DB'), kw('Rollback', 'back to a known-good release'),
      kw('Expand / contract', 'migrations you can undo'), kw('Image tag', 'keep the previous one'), kw('git revert', 'undo forward, not force-push'), kw('Working tree', 'not what should ship'), kw('Smoke test', 'proof after the swap'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: migration; code is not data; seed; rollback; expand and contract; image tag; git revert; working tree; and smoke test.' },
  { t: 'Your turn — and congratulations', body: two(steps([
      'Rename a column with a migration; roll the code back; read the error',
      'Redo it as expand → contract; roll back at every step',
      `Tag images by commit; practise a swap back; time it`,
      'Write your deploy as ONE script with the checks inside',
    ]), box('You made it', `<ul><li>Production runs the build</li><li>Code ships, data does not</li><li>Rollback = previous image, not a hope</li><li>Prove what is running</li></ul><p style="margin-top:8px">Next: the Code Lab track and the final project.</p>`, 'lam'), ''),
    en: 'Your turn, one last time: rename a column, roll the code back and read the error; redo it as expand and contract; tag images by commit and practise a swap back; and write your deploy as one script with the checks inside. You made it to the end of the course.' },
];
export const slides = lamDeck({ chuong: 'Chapter 20 — Build and deploy to production', bai: '20.5' }, S);
