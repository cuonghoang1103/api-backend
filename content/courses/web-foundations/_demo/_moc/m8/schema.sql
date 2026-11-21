-- Milestone 8 starter schema (SQLite). Sample topic: "Recipe notebook".
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))  -- ISO time in UTC
);

CREATE TABLE IF NOT EXISTS recipes (
  id       INTEGER PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name     TEXT NOT NULL CHECK (length(name) >= 2),
  minutes  INTEGER NOT NULL CHECK (minutes > 0)
);

CREATE TABLE IF NOT EXISTS ingredients (
  id        INTEGER PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name      TEXT NOT NULL,
  amount    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes(name);
