/**
 * pr-12-5 — Prisma ORM · Chapter 12 · Lesson 12.5 "What you know now, and where to go next" (deck video, 12/11/2026). Bài web: pr-12-5-ket-khoa.
 * Bài tổng kết: không chạy mới; mọi con số trích lại đúng như đã đo ở các bài trước (ghi bài nguồn): 9.1 N+1 44 truy vấn · 9.4 pool mặc định 21 · 11.1 bảy phút 502 ·
 * 11.3 ALTER chờ 9 s · 11.4 190.000 hàng nạp bù tiếp được · 11.5 PID 1 ⇒ 137 sau 10 s · 12.1 P1017 × 5 trước P1001 × 180.
 */
import { lamDeck, two, box, cards, c, tbl, steps, icards, cmp, bars, tiers, flow, hub } from './_pr-chung.mjs';

export const deck = { key: 'pr-12-5', code: 'PR 12.5', title: 'What you know now, and where to go next', sub: 'Chapter 12 · Lesson 12.5' };

export const slides = lamDeck({ chuong: 'Chapter 12 — Diagnosing Prisma, and where to go next', bai: '12.5' }, [
  /* 1 */ { cover: true, nhan: 'Chapter 12 · Lesson 12.5', t: 'What you know now, and where to go next', sub: 'Thirteen sections, six ideas, one project to prove it' },
  /* 2 */ { t: 'The course, in four arcs', body: tiers([
      ['page', 'Model it · sections 0–3', 'why an ORM · the schema language · relations', '#336791'],
      ['code', 'Use it · sections 4–5', 'reading, writing, querying deeply', '#336791'],
      ['shield', 'Keep data safe · sections 6–8', 'migrations · transactions · the generated types', '#b85a2b'],
      ['server', 'Run it · sections 9–12', 'performance · escape hatches · production · diagnosis', '#2f7d32'],
    ], { th: 66, gap: 22 }) + box('Every section ended in something you ran', 'Each number on these slides came from a measurement in a lab — not from documentation, and not from memory.', 'lam') },
  /* 3 */ { t: 'Six ideas worth keeping when the syntax changes', body: hub('six\nideas', [
      ['eye', 'Prisma writes SQL', 'so read the SQL'],
      ['type', 'The schema is the truth', 'and it is checked'],
      ['layers', 'Migrations are history', 'append-only, not a diff tool'],
      ['clock', 'Deploys have a window', 'old code meets new schema'],
      ['gauge', 'Measure first', 'then change one thing'],
      ['check', 'Green build ≠ runnable', 'verify the artefact'],
    ], { h: 360 }) },
  /* 4 */ { t: 'Numbers this course measured', body: cmp(['Measured', 'Value', 'Lesson'], [
      ['an N+1 feed page', '44 queries for one page', '9.1'],
      ['default pool on the lab machine', '21 connections', '9.4'],
      ['an engine for the wrong platform', '7 minutes of 502 (CuongThai)', '11.1'],
      ['an "instant" ALTER behind a 10 s transaction', 'waited 9 s; a plain SELECT timed out', '11.3'],
      ['a killed backfill, restarted', '190,000 rows continued, none redone', '11.4'],
      ['Node as PID 1 without a handler', 'exit 137 after 10 s', '11.5'],
      ['a database that disappeared', 'P1017 × 5 came before P1001 × 180', '12.1'],
    ]) },
  /* 5 */ { t: 'Prove it to yourself: one project, six milestones', body: steps([
      `<b>Schema</b> with three relation kinds — users, posts, self-referencing comments, tags (many-to-many)`,
      `<b>A feed endpoint with no N+1</b> — cursor pagination, ${c('select')}, ${c('_count')}; prove it with the query log`,
      `<b>One transaction</b> — a vote or a transfer; write the racy version first and break it`,
      `<b>One thing the builder cannot say</b> — a leaderboard or a comment tree in raw SQL, typed`,
      `<b>A column rename across three deploys</b> — expand, resumable backfill, contract`,
      `<b>A Dockerfile you verified</b> — runtime-base generate, and a check that awaits a query in the image`,
    ]) },
  /* 6 */ { t: 'What "done" looks like for each milestone', body: icards([
      ['check', 'A test or a log, not a claim', 'the query count, the error code, the exit code'],
      ['flag', 'One deliberate failure each', 'break it, read the failure, fix it'],
      ['list', 'A README with the numbers', 'machine, version, what you measured'],
      ['code', 'In the Code Lab track', 'cuongthai.com/code-lab/prisma-orm'],
    ], 2) + tbl(['Milestone', 'Proof that it is done'], [
      ['feed without N+1', 'the query log shows a fixed number of queries per page'],
      ['transaction', 'the racy version loses an update; the fixed one does not'],
      ['rename in three deploys', 'the old image still works after each deploy'],
      ['verified Dockerfile', 'the check fails on a wrong binaryTarget, passes on the right one'],
    ]) },
  /* 7 */ { t: 'Where to go next', body: hub('after\nPrisma', [
      ['db', 'PostgreSQL course', 'indexes, locks, monitoring'],
      ['bolt', 'Redis course', 'caching what you measured'],
      ['box', 'Docker course', 'images, compose, deploy'],
      ['server', 'Node.js course', 'deploys without downtime'],
      ['type', 'TypeScript course', 'the types under Chapter 8'],
      ['link', 'API Design course', 'what the endpoints promise'],
    ], { h: 360 }) },
  /* 8 */ { t: 'Before you go: the final exam', body: flow([
      { t: '12.6 final quiz', s: 'the whole course' },
      { t: 'Code Lab', s: '16 modules × 10' },
      { t: 'your project', s: 'six milestones', mau: '#2f7d32' },
    ], { h: 130 }) + box('The quiz checks ideas, the project checks hands', 'Take the 12.6 quiz now while the chapters are fresh; build the project over the next weeks, one milestone at a time.', 'lam') +
      icards([
        ['list', 'Final exam 12.6', 'one quiz across all thirteen sections'],
        ['code', 'Code Lab · prisma-orm', '16 modules, 10 exercises each'],
        ['flag', 'Exam room', 'practice tests PT1–PT3, PE and FE for this course'],
      ], 3) + box('Where to find them', 'The final quiz is lesson 12.6 of this course. The Code Lab track is at cuongthai.com/code-lab/prisma-orm. The practice tests are in the Exam room, under Prisma ORM.', 'xanh') },
  /* 9 */ { t: 'Thank you — and what to keep', body: two(steps([
      `Read the SQL Prisma sends`,
      `Trust the schema; never copy its types`,
      `Treat migrations as history`,
      `Plan for the deploy window`,
      `Measure before changing anything`,
      `Verify the image, not the build`,
    ]), box('Keep going', `<ul><li>Take the 12.6 final quiz</li><li>Build the six-milestone project</li><li>Continue with PostgreSQL or Docker</li></ul>`, 'xanh'), '') },
]);
