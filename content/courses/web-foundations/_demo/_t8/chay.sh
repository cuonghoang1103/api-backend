#!/bin/bash
# chay: tay — chụp output thật cho Chương 8 bằng sqlite3 3.54 (macOS). Mỗi khối dựng CSDL mới từ blog.sql trong thư mục tạm.
# bash content/courses/web-foundations/_demo/_t8/chay.sh
set -u
cd "$(dirname "$0")"
mkdir -p out
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
moi() { rm -f "$TMP/blog.db"; sqlite3 "$TMP/blog.db" < blog.sql; }
# q "SQL" — in lệnh như ở dấu nhắc sqlite3, rồi kết quả dạng bảng (hoặc lỗi)
q() { printf 'sqlite> %s\n' "$1"; printf '%s\n' "$1" | sqlite3 -cmd ".mode table" -cmd "PRAGMA foreign_keys=ON" "$TMP/blog.db" 2>&1; echo; }

# ── 8.1 ──
moi
{
  echo 'sqlite> .schema users'
  sqlite3 "$TMP/blog.db" '.schema users'
  echo
  q "SELECT * FROM users;"
} > out/schema.out.txt
moi
{
  q "INSERT INTO users (name, email) VALUES ('Lan 2', 'lan@example.com');"
  q "INSERT INTO users (name, email) VALUES (NULL, 'x@example.com');"
  q "INSERT INTO posts (user_id, title, views, created_at) VALUES (1, 'Bad', -5, '2026-11-02');"
  q "INSERT INTO posts (user_id, title, created_at) VALUES (99, 'Ghost author', '2026-11-02');"
  q "SELECT count(*) AS users, (SELECT count(*) FROM posts) AS posts FROM users;"
} > out/constraints.out.txt

# ── 8.2 ──
moi
{
  q "SELECT title, views FROM posts;"
  q "SELECT title, views FROM posts WHERE published = 1 AND views >= 80;"
  q "SELECT title FROM posts WHERE title LIKE '%SQL%' OR user_id IN (2, 3);"
} > out/select-where.out.txt
{
  q "SELECT title, views FROM posts WHERE published = 1 ORDER BY views DESC LIMIT 2;"
  q "SELECT id, title FROM posts ORDER BY id LIMIT 2 OFFSET 2;"
} > out/order-limit.out.txt
{
  q "SELECT count(*) FROM posts WHERE user_id = NULL;"
  q "SELECT id, title FROM posts WHERE user_id IS NULL;"
  q "SELECT count(*) AS all_rows, count(user_id) AS with_author FROM posts;"
} > out/null.out.txt
{
  q "SELECT count(*) AS posts, sum(views) AS total_views, round(avg(views), 1) AS avg_views FROM posts WHERE published = 1;"
  q "SELECT user_id, count(*) AS posts, sum(views) AS views FROM posts GROUP BY user_id ORDER BY views DESC;"
  q "SELECT user_id, count(*) AS posts FROM posts GROUP BY user_id HAVING count(*) >= 2;"
} > out/aggregate.out.txt

# index: 300 000 rows, the same query before and after CREATE INDEX
rm -f "$TMP/big.db"
sqlite3 "$TMP/big.db" "CREATE TABLE events (id INTEGER PRIMARY KEY, user_id INTEGER, type TEXT, created_at TEXT);
WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 300000)
INSERT INTO events (user_id, type, created_at) SELECT abs(random()) % 10000, 'view', datetime('2026-01-01', '+' || (i % 300) || ' days') FROM n;"
{
  echo "-- table events: $(sqlite3 "$TMP/big.db" 'SELECT count(*) FROM events') rows, user_id between 0 and 9999"
  echo 'sqlite> EXPLAIN QUERY PLAN SELECT count(*) FROM events WHERE user_id = 4242;'
  sqlite3 "$TMP/big.db" 'EXPLAIN QUERY PLAN SELECT count(*) FROM events WHERE user_id = 4242;'
  echo 'sqlite> .timer on'
  echo 'sqlite> SELECT count(*) FROM events WHERE user_id = 4242;   -- run 20 times, average:'
  node -e "
    const { execFileSync } = require('node:child_process');
    let t = 0;
    for (let i = 0; i < 20; i++) { const s = process.hrtime.bigint(); execFileSync('sqlite3', [process.argv[1], 'SELECT count(*) FROM events WHERE user_id = 4242;']); t += Number(process.hrtime.bigint() - s); }
    console.log('  about ' + (t / 20 / 1e6).toFixed(1) + ' ms per query (including starting sqlite3)');
  " "$TMP/big.db"
  echo
  echo 'sqlite> CREATE INDEX idx_events_user ON events(user_id);'
  sqlite3 "$TMP/big.db" 'CREATE INDEX idx_events_user ON events(user_id);'
  echo 'sqlite> EXPLAIN QUERY PLAN SELECT count(*) FROM events WHERE user_id = 4242;'
  sqlite3 "$TMP/big.db" 'EXPLAIN QUERY PLAN SELECT count(*) FROM events WHERE user_id = 4242;'
  echo 'sqlite> SELECT count(*) FROM events WHERE user_id = 4242;   -- run 20 times, average:'
  node -e "
    const { execFileSync } = require('node:child_process');
    let t = 0;
    for (let i = 0; i < 20; i++) { const s = process.hrtime.bigint(); execFileSync('sqlite3', [process.argv[1], 'SELECT count(*) FROM events WHERE user_id = 4242;']); t += Number(process.hrtime.bigint() - s); }
    console.log('  about ' + (t / 20 / 1e6).toFixed(1) + ' ms per query (including starting sqlite3)');
  " "$TMP/big.db"
  echo "-- file size: $(du -k "$TMP/big.db" | cut -f1) KB with the index"
} > out/index.out.txt

# ── 8.3 ──
moi
{
  q "INSERT INTO posts (user_id, title, created_at) VALUES (3, 'My first post', '2026-11-02 10:00:00') RETURNING id, title, views, published;"
  q "UPDATE posts SET published = 1, views = views + 1 WHERE id = 7 RETURNING id, title, views, published;"
  q "DELETE FROM posts WHERE id = 3 RETURNING id, title;"
  q "SELECT id, title FROM posts ORDER BY id;"
} > out/crud.out.txt
moi
{
  q "UPDATE posts SET title = 'Hello World!' WHERE id = 1; SELECT changes() AS rows_changed;"
  q "UPDATE posts SET views = 0; SELECT changes() AS rows_changed;"
  q "SELECT id, title, views FROM posts;"
} > out/no-where.out.txt
# a money transfer: without and with a transaction
cat > "$TMP/bank.sql" <<'SQL'
CREATE TABLE accounts (id INTEGER PRIMARY KEY, owner TEXT, balance INTEGER NOT NULL CHECK (balance >= 0));
INSERT INTO accounts VALUES (1, 'Lan', 500000), (2, 'Minh', 100000);
SQL
TX=$(printf '%s\n' 'BEGIN;' 'UPDATE accounts SET balance = balance + 700000 WHERE id = 1;' 'UPDATE accounts SET balance = balance - 700000 WHERE id = 2;' 'COMMIT;')
{
  rm -f "$TMP/bank.db"; sqlite3 "$TMP/bank.db" < "$TMP/bank.sql"
  echo '-- (a) Move 700 000 from Minh to Lan with two separate statements, no transaction:'
  printf '%s\n' "$TX" | sed -n '2,3p' | sed 's/^/sqlite> /'
  printf '%s\n' "$TX" | sed -n '2,3p' | sqlite3 "$TMP/bank.db" 2>&1
  sqlite3 -cmd '.mode table' "$TMP/bank.db" 'SELECT * FROM accounts;'
  echo
  rm -f "$TMP/bank.db"; sqlite3 "$TMP/bank.db" < "$TMP/bank.sql"
  echo '-- (b) Inside BEGIN … COMMIT, but the script keeps going after the error:'
  printf '%s\n' "$TX" | sed 's/^/sqlite> /'
  printf '%s\n' "$TX" | sqlite3 "$TMP/bank.db" 2>&1
  sqlite3 -cmd '.mode table' "$TMP/bank.db" 'SELECT * FROM accounts;'
  echo
  rm -f "$TMP/bank.db"; sqlite3 "$TMP/bank.db" < "$TMP/bank.sql"
  echo '-- (c) Inside BEGIN … COMMIT, stopping at the first error (sqlite3 -bail) — the transaction is rolled back:'
  printf '%s\n' "$TX" | sqlite3 -bail "$TMP/bank.db" 2>&1
  sqlite3 -cmd '.mode table' "$TMP/bank.db" 'SELECT * FROM accounts;'
} > out/transaction.out.txt

# ── 8.4 ──
moi
{
  q "SELECT posts.title, users.name FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.id;"
  q "SELECT posts.title, users.name FROM posts LEFT JOIN users ON posts.user_id = users.id ORDER BY posts.id;"
} > out/joins.out.txt
{
  q "SELECT users.name, count(posts.id) AS posts FROM users LEFT JOIN posts ON posts.user_id = users.id GROUP BY users.id ORDER BY posts DESC;"
  q "SELECT users.name, count(posts.id) AS posts FROM users INNER JOIN posts ON posts.user_id = users.id GROUP BY users.id ORDER BY posts DESC;"
  q "SELECT p.title, u.name AS commenter, c.body FROM comments c JOIN posts p ON p.id = c.post_id JOIN users u ON u.id = c.user_id ORDER BY c.id;"
} > out/joins-count.out.txt
{
  q "SELECT (SELECT count(*) FROM posts) AS posts, (SELECT count(*) FROM comments) AS comments;"
  q "DELETE FROM posts WHERE id = 1;"
  q "SELECT (SELECT count(*) FROM posts) AS posts, (SELECT count(*) FROM comments) AS comments;"
  q "SELECT id, post_id, body FROM comments ORDER BY id;"
} > out/cascade.out.txt
moi
{
  q "DELETE FROM users WHERE id = 2;"
  q "SELECT count(*) AS comments_by_minh FROM comments WHERE user_id = 2;"
} > out/restrict.out.txt
echo ok
