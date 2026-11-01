/** Bảng nhỏ của bài giảng dùng chung cho nhiều module (tệp "_" ⇒ bộ xuất bỏ qua). */
import { pre } from './_chung.mjs';

/** Bảng `note` của Chương 4 (bài 4.1 tạo + 'Quick draft' chèn ở mục "Let DEFAULT do the work"). */
export const NOTE = `CREATE TABLE note (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title      text NOT NULL,
  author     text NOT NULL,
  tag        text,
  views      int NOT NULL DEFAULT 0,
  pinned     boolean NOT NULL DEFAULT false,
  created_at date NOT NULL
);
INSERT INTO note (title, author, tag, views, pinned, created_at) VALUES
  ('Intro to SQL',         'Cuong', 'sql',  120, true,  '2026-01-10'),
  ('Indexes deep dive',    'Cuong', 'sql',   90, false, '2026-02-14'),
  ('Timezones done right', 'Lan',   'date',  45, false, '2026-03-01'),
  ('JSONB in practice',    'Lan',   'sql',   30, false, '2026-03-05'),
  ('My reading list',      'Minh',  NULL,     8, false, '2026-03-20'),
  ('Backup strategy',      'Cuong', 'ops',   12, true,  '2026-04-02');
INSERT INTO note (title, author, tag, created_at) VALUES ('Quick draft', 'Minh', NULL, '2026-04-10');`;

export const LD_NOTE = {
  en: `<h4>Sample table: note (chapter 4)</h4>${pre(`note (id identity PK, title, author, tag text NULL, views int DEFAULT 0, pinned boolean DEFAULT false, created_at date)
 1 Intro to SQL          Cuong sql   120 pinned  2026-01-10
 2 Indexes deep dive     Cuong sql    90         2026-02-14
 3 Timezones done right  Lan   date   45         2026-03-01
 4 JSONB in practice     Lan   sql    30         2026-03-05
 5 My reading list       Minh  NULL    8         2026-03-20
 6 Backup strategy       Cuong ops    12 pinned  2026-04-02
 7 Quick draft           Minh  NULL    0         2026-04-10`)}<p>Full script: the <code>note.sql</code> tab.</p>`,
  vi: `<h4>Bảng mẫu: note (chương 4)</h4>${pre(`note (id identity PK, title, author, tag text NULL, views int DEFAULT 0, pinned boolean DEFAULT false, created_at date)
 1 Intro to SQL          Cuong sql   120 ghim    2026-01-10
 2 Indexes deep dive     Cuong sql    90         2026-02-14
 3 Timezones done right  Lan   date   45         2026-03-01
 4 JSONB in practice     Lan   sql    30         2026-03-05
 5 My reading list       Minh  NULL    8         2026-03-20
 6 Backup strategy       Cuong ops    12 ghim    2026-04-02
 7 Quick draft           Minh  NULL    0         2026-04-10`)}<p>Script đầy đủ: tab <code>note.sql</code>.</p>`,
};
export const O_NOTE = { csdl: NOTE, tenCsdl: 'note', ld: LD_NOTE };

/** App ghi chú của Chương 5–6 (app_user, note, note_stat, comment, employee, sz, col) — tên bảng/cột đúng bài giảng. */
export const APP = `CREATE TABLE app_user (id int PRIMARY KEY, name text NOT NULL, city text);
INSERT INTO app_user VALUES (1, 'Cuong', 'Hanoi'), (2, 'Lan', 'Danang'), (3, 'Minh', 'Hanoi'), (4, 'Hoa', 'Hue');
CREATE TABLE note (
  id      int PRIMARY KEY,
  user_id int REFERENCES app_user(id),      -- NULL = orphan draft (no author yet)
  title   text NOT NULL,
  tag     text,
  views   int,                              -- NULL = not measured yet
  pinned  boolean NOT NULL DEFAULT false
);
INSERT INTO note VALUES
  (1, 1, 'Intro to SQL', 'sql', 120, true), (2, 1, 'Indexes', 'sql', 90, false), (3, 2, 'Timezones', 'date', 45, false),
  (4, 3, 'Backup', 'ops', 12, true), (5, NULL, 'Orphan draft', NULL, NULL, false), (6, 1, 'JSONB tips', 'sql', 30, false),
  (7, 2, 'Date math', 'date', NULL, false);
CREATE TABLE note_stat (id int PRIMARY KEY REFERENCES note(id), reads int NOT NULL);
INSERT INTO note_stat VALUES (1, 500), (2, 300), (3, 120), (4, 60), (5, 5), (6, 40);
CREATE TABLE comment (id int PRIMARY KEY, note_id int NOT NULL REFERENCES note(id), user_id int NOT NULL REFERENCES app_user(id), body text NOT NULL);
INSERT INTO comment VALUES (1, 1, 2, 'Great intro'), (2, 1, 3, 'Thanks!'), (3, 1, 4, 'Bookmarked'), (4, 3, 1, 'Very useful'),
  (5, 2, 2, 'Saved'), (6, 4, 1, 'Do you test restores?');
CREATE TABLE employee (id int PRIMARY KEY, name text NOT NULL, manager_id int REFERENCES employee(id));
INSERT INTO employee VALUES (1, 'An', NULL), (2, 'Binh', 1), (3, 'Chi', 1), (4, 'Dung', 2), (5, 'Em', 2), (6, 'Giang', 4);
CREATE TABLE sz (size text PRIMARY KEY);
INSERT INTO sz VALUES ('S'), ('M'), ('L');
CREATE TABLE col (color text PRIMARY KEY);
INSERT INTO col VALUES ('black'), ('white');`;

const LD_APP_TXT = `app_user  (id PK, name, city)                    1 Cuong Hanoi · 2 Lan Danang · 3 Minh Hanoi · 4 Hoa Hue (no notes)
note      (id PK, user_id → app_user NULL, title, tag NULL, views NULL, pinned)
          1 Intro to SQL (1, sql, 120, pinned) · 2 Indexes (1, sql, 90) · 3 Timezones (2, date, 45) · 4 Backup (3, ops, 12, pinned)
          5 Orphan draft (no user, no tag, views NULL) · 6 JSONB tips (1, sql, 30) · 7 Date math (2, date, views NULL)
note_stat (id PK → note.id, reads)              notes 1–6 (note 7 has no stat row)
comment   (id PK, note_id → note, user_id → app_user, body)   6 comments: 3 on note 1, 1 each on notes 2, 3, 4
employee  (id PK, name, manager_id → employee)  An (boss) ← Binh, Chi · Binh ← Dung, Em · Dung ← Giang
sz (size) S, M, L · col (color) black, white`;
export const LD_APP = {
  en: `<h4>Sample tables: the Notes app of chapters 5–6</h4>${pre(LD_APP_TXT)}<p>Full script: the <code>notes-app.sql</code> tab.</p>`,
  vi: `<h4>Bảng mẫu: app ghi chú của chương 5–6</h4>${pre(LD_APP_TXT)}<p>Script đầy đủ: tab <code>notes-app.sql</code>.</p>`,
};
export const O_APP = { csdl: APP, tenCsdl: 'notes-app', ld: LD_APP };

/** Bảng `sale` của Chương 8 (giang/pg-08-1.mjs — đúng 8 dòng của bài). */
export const SALE = `CREATE TABLE sale (
  id int PRIMARY KEY, region text NOT NULL, seller text NOT NULL,
  amount numeric(10,2) NOT NULL, sold_on date NOT NULL
);
INSERT INTO sale VALUES
 (1, 'North', 'Alice', 100, '2026-01-05'), (2, 'North', 'Alice', 150, '2026-02-10'),
 (3, 'North', 'Bob',   200, '2026-01-20'), (4, 'North', 'Bob',   150, '2026-03-01'),
 (5, 'South', 'Carol', 300, '2026-01-15'), (6, 'South', 'Carol', 250, '2026-02-20'),
 (7, 'South', 'Dave',  180, '2026-02-05'), (8, 'South', 'Dave',  220, '2026-03-10');`;
const LD_SALE_TXT = `sale (id PK, region, seller, amount numeric(10,2), sold_on date) — the 8 rows of lesson 8.1
 1 North Alice 100 2026-01-05 · 2 North Alice 150 2026-02-10 · 3 North Bob 200 2026-01-20 · 4 North Bob 150 2026-03-01
 5 South Carol 300 2026-01-15 · 6 South Carol 250 2026-02-20 · 7 South Dave 180 2026-02-05 · 8 South Dave 220 2026-03-10`;
export const O_SALE = { csdl: SALE, tenCsdl: 'sale', ld: { en: `<h4>Sample table (chapter 8)</h4>${pre(LD_SALE_TXT)}`, vi: `<h4>Bảng mẫu (chương 8)</h4>${pre(LD_SALE_TXT)}` } };

/**
 * Bảng `event` của Chương 9–10 (bài giảng: 500 000 dòng; ở đây 20 000 dòng TẤT ĐỊNH sinh bằng generate_series — không random()
 * — rồi ANALYZE, để bộ lập kế hoạch có thống kê thật và chọn kế hoạch giống nhau ở mọi máy). Nạp ~0,2 s mỗi kiểm.
 * status: 'pending' 1 % (g % 100 = 0) · 'done' ~33 % · 'active' ~66 % · user_id 1–2000 (10 sự kiện mỗi user)
 * Kèm bảng users (2 000 dòng) và các hàm kiểm kế hoạch PLAN_ALL (plan_nodes / plan_text / plan_rows / plan_analyze).
 */
import { PLAN_ALL } from './_chung.mjs';
export const EVENT = `SET TimeZone = 'UTC';
CREATE TABLE event (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    int           NOT NULL,
  status     text          NOT NULL,   -- 'active' | 'done' | 'pending'
  amount     numeric(10,2) NOT NULL,
  email      text          NOT NULL,
  created_at timestamptz   NOT NULL,
  props      jsonb         NOT NULL
);
INSERT INTO event (user_id, status, amount, email, created_at, props)
SELECT g % 2000 + 1,
       CASE WHEN g % 100 = 0 THEN 'pending' WHEN g % 3 = 0 THEN 'done' ELSE 'active' END,
       (g % 500) + 0.99,
       'user' || g || '@example.com',
       timestamptz '2024-01-01 00:00+00' + g * interval '10 minutes',
       jsonb_build_object('plan', CASE WHEN g % 10 = 0 THEN 'pro' ELSE 'free' END,
                          'device', (ARRAY['ios', 'android', 'web'])[g % 3 + 1])
FROM generate_series(1, 20000) g;
CREATE TABLE users (id int PRIMARY KEY, name text NOT NULL, country text NOT NULL);
INSERT INTO users SELECT g, 'user ' || g, (ARRAY['VN', 'JP', 'US', 'FR'])[g % 4 + 1] FROM generate_series(1, 2000) g;
ANALYZE event; ANALYZE users;
-- grader helpers (functions that print plans) — not part of the lesson schema
${PLAN_ALL}`;
const LD_EVENT_TXT = `event (id identity PK, user_id int, status text, amount numeric(10,2), email text, created_at timestamptz, props jsonb)
      20 000 rows: user_id 1–2000 (10 events each) · status pending 1 %, done ~33 %, active ~66 %
      email 'user<g>@example.com' (unique) · created_at every 10 minutes from 2024-01-01 · props {"plan": "free"|"pro", "device": …}
users (id PK, name, country)   2 000 rows
No index except the primary keys. Statistics are collected (ANALYZE) so the planner behaves like on a real server.
Helpers: plan_nodes(q) / plan_text(q) / plan_rows(q) / plan_analyze(q) print the plan of query text q.`;
export const O_EVENT = {
  csdl: EVENT, tenCsdl: 'event',
  ld: { en: `<h4>Sample tables (chapters 9–10)</h4>${pre(LD_EVENT_TXT)}<p>The lesson used 500 000 rows; 20 000 deterministic rows are enough for the planner to make the same choices. The grader is PostgreSQL 18 (WASM).</p>`, vi: `<h4>Bảng mẫu (chương 9–10)</h4>${pre(LD_EVENT_TXT)}<p>Bài giảng dùng 500 000 dòng; 20 000 dòng tất định đủ để bộ lập kế hoạch chọn giống vậy. Máy chấm là PostgreSQL 18 (WASM).</p>` },
};

/** users + notes của Chương 12 (bài 12.1: 20 user, 500 ghi chú, views = (id * 37) % 101 — tất định). */
export const NOTES12 = `SET TimeZone = 'Asia/Ho_Chi_Minh';
CREATE TABLE users (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, email text NOT NULL UNIQUE);
INSERT INTO users (email) SELECT 'user' || g || '@notes.vn' FROM generate_series(1, 20) g;
CREATE TABLE notes (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    int NOT NULL REFERENCES users(id),
  title      text NOT NULL,
  body       text,
  views      int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT '2020-01-01 08:00+07',
  updated_at timestamptz NOT NULL DEFAULT '2020-01-01 08:00+07'
);
INSERT INTO notes (user_id, title, body, views)
SELECT (g % 20) + 1, 'Note ' || g, 'Body of note ' || g, 0 FROM generate_series(1, 500) g;
UPDATE notes SET views = (id * 37) % 101;   -- deterministic, like the lesson`;
const LD12 = `users (id identity PK, email UNIQUE)                         20 rows user1@notes.vn … user20@notes.vn
notes (id identity PK, user_id → users, title, body, views int DEFAULT 0, created_at, updated_at)
      500 rows, 25 per user; views = (id * 37) % 101 (0 … 100); created_at = updated_at = 2020-01-01 08:00`;
export const O_NOTES12 = { csdl: NOTES12, tenCsdl: 'notes12', ld: { en: `<h4>Sample tables (chapter 12)</h4>${pre(LD12)}`, vi: `<h4>Bảng mẫu (chương 12)</h4>${pre(LD12)}` } };
