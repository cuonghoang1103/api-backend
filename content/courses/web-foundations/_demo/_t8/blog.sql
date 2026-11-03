-- Chapter 8 sample database: a tiny blog. Run: sqlite3 blog.db < blog.sql
PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id         INTEGER PRIMARY KEY,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE posts (
  id        INTEGER PRIMARY KEY,
  user_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title     TEXT    NOT NULL,
  views     INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0),
  published INTEGER NOT NULL DEFAULT 0,          -- 0 = draft, 1 = published
  created_at TEXT   NOT NULL
);

CREATE TABLE comments (
  id      INTEGER PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  body    TEXT    NOT NULL
);

INSERT INTO users (id, name, email, created_at) VALUES
  (1, 'Lan',  'lan@example.com',  '2026-09-01 08:00:00'),
  (2, 'Minh', 'minh@example.com', '2026-09-03 10:30:00'),
  (3, 'An',   'an@example.com',   '2026-10-15 19:45:00');

INSERT INTO posts (id, user_id, title, views, published, created_at) VALUES
  (1, 1,    'Hello World',      120, 1, '2026-09-02 09:00:00'),
  (2, 1,    'Learning SQL',      45, 1, '2026-09-10 14:20:00'),
  (3, 2,    'Draft Post',         3, 0, '2026-09-12 08:05:00'),
  (4, 2,    'Node.js Basics',   300, 1, '2026-09-20 17:40:00'),
  (5, 1,    'Old Announcement',  80, 1, '2026-08-30 12:00:00'),
  (6, NULL, 'Orphan Draft',       0, 0, '2026-10-01 11:11:00');

INSERT INTO comments (id, post_id, user_id, body) VALUES
  (1, 1, 2, 'Welcome!'),
  (2, 1, 3, 'Nice start'),
  (3, 4, 1, 'Very clear, thanks'),
  (4, 4, 3, 'Can you cover Express next?'),
  (5, 2, 2, 'SQL finally makes sense');
