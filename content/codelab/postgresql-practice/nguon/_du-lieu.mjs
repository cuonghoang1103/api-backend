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
