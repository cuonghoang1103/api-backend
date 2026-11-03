// chay: tay — Lesson 8.3: building SQL by gluing strings vs using parameters (Node 22.23, node:sqlite, the blog.sql data).
// node --no-warnings content/courses/web-foundations/_demo/_t8/injection.mjs > content/courses/web-foundations/_demo/_t8/out/injection.out.txt
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

const db = new DatabaseSync(':memory:');
db.exec(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'blog.sql'), 'utf8'));

// ❌ the query is built by gluing the user's text into SQL
function findPostsUnsafe(search) {
  const sql = "SELECT id, title FROM posts WHERE published = 1 AND title LIKE '%" + search + "%'";
  console.log('  SQL sent:', sql);
  return db.prepare(sql).all();
}
// ✅ the query has a placeholder; the value travels separately
function findPostsSafe(search) {
  return db.prepare("SELECT id, title FROM posts WHERE published = 1 AND title LIKE '%' || ? || '%'").all(search);
}
const show = (rows) => console.log('  →', rows.length, 'rows:', rows.map((r) => Object.values(r).join(' ')).join(' | ') || '(none)');

console.log('Search box: "SQL"');
show(findPostsUnsafe('SQL'));
console.log('\nSearch box: "%\' OR 1=1 --"   (unsafe)');
show(findPostsUnsafe("%' OR 1=1 --"));
console.log('\nSearch box: "x\' UNION SELECT id, email FROM users --"   (unsafe)');
show(findPostsUnsafe("x' UNION SELECT id, email FROM users --"));
console.log('\nThe same two inputs with a parameter (safe):');
show(findPostsSafe("%' OR 1=1 --"));
show(findPostsSafe("x' UNION SELECT id, email FROM users --"));
console.log('\nSearch box: "Bob\'s" — an honest apostrophe:');
try { show(findPostsUnsafe("Bob's")); } catch (err) { console.log('  unsafe →', err.message); }
show(findPostsSafe("Bob's"));
