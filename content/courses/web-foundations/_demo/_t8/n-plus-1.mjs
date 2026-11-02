// chay: tay — Lesson 8.4: "N+1 queries" vs one JOIN, counted and timed (Node 22.23, node:sqlite, 1 000 posts by 100 users).
// node --no-warnings content/courses/web-foundations/_demo/_t8/n-plus-1.mjs > content/courses/web-foundations/_demo/_t8/out/n-plus-1.out.txt
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
  CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), title TEXT NOT NULL);
  WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 100) INSERT INTO users SELECT i, 'user ' || i FROM n;
  WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 1000) INSERT INTO posts SELECT i, (i % 100) + 1, 'post ' || i FROM n;
`);
let queries = 0;
const q = (sql) => { const st = db.prepare(sql); return { all: (...a) => { queries++; return st.all(...a); }, get: (...a) => { queries++; return st.get(...a); } }; };

// ❌ N+1: one query for the list, then one more for EACH post's author
function feedNPlus1() {
  const posts = q('SELECT id, title, user_id FROM posts ORDER BY id').all();
  const author = q('SELECT name FROM users WHERE id = ?');
  return posts.map((p) => ({ title: p.title, author: author.get(p.user_id).name }));
}
// ✅ one JOIN
function feedJoin() {
  return q('SELECT posts.title, users.name AS author FROM posts JOIN users ON users.id = posts.user_id ORDER BY posts.id').all();
}
function measure(label, fn) {
  queries = 0;
  const t0 = performance.now();
  let rows;
  for (let i = 0; i < 20; i++) rows = fn();
  const ms = (performance.now() - t0) / 20;
  console.log(label.padEnd(12), '→', rows.length, 'rows,', queries / 20, 'queries,', ms.toFixed(2), 'ms per page (in-memory SQLite)');
  return rows;
}
const a = measure('N+1', feedNPlus1);
const b = measure('one JOIN', feedJoin);
console.log('same result:', JSON.stringify(a) === JSON.stringify(b.map((r) => ({ title: r.title, author: r.author }))));
console.log('first row  :', JSON.stringify(b[0]));
