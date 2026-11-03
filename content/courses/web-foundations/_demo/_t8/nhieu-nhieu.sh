#!/bin/bash
# chay: tay — Bài 8.4: quan hệ nhiều-nhiều (bài ↔ thẻ) bằng bảng nối, sqlite3 3.54 trên blog.sql.
# bash content/courses/web-foundations/_demo/_t8/nhieu-nhieu.sh
set -u
cd "$(dirname "$0")"
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
sqlite3 "$TMP/blog.db" < blog.sql
q() { printf 'sqlite> %s\n' "$1"; printf '%s\n' "$1" | sqlite3 -cmd ".mode table" -cmd "PRAGMA foreign_keys=ON" "$TMP/blog.db" 2>&1; echo; }
{
  q "CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);
CREATE TABLE post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  INTEGER NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
INSERT INTO tags (id, name) VALUES (1, 'sql'), (2, 'beginner'), (3, 'node');
INSERT INTO post_tags VALUES (1, 2), (2, 1), (2, 2), (4, 3), (4, 2);"
  q "SELECT p.title, group_concat(t.name, ', ') AS tags FROM posts p JOIN post_tags pt ON pt.post_id = p.id JOIN tags t ON t.id = pt.tag_id GROUP BY p.id ORDER BY p.id;"
  q "SELECT t.name, count(*) AS posts FROM tags t JOIN post_tags pt ON pt.tag_id = t.id GROUP BY t.id ORDER BY posts DESC;"
  q "INSERT INTO post_tags VALUES (2, 1);"
} > out/many-to-many.out.txt
echo ok
