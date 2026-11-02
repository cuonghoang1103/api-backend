// chay: tay — Lesson 8.1: two "requests" increment a like counter 200 times each, at the same time (Node 22.23, node:sqlite).
// node content/courses/web-foundations/_demo/_t8/json-vs-db.mjs > content/courses/web-foundations/_demo/_t8/out/json-vs-db.out.txt
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'wf8-'));
const file = path.join(dir, 'likes.json');

// 1. a JSON file: read → change → write back
await fs.writeFile(file, JSON.stringify({ likes: 0 }));
let broken = 0;
let firstError = '';
async function likeWithJsonFile() {
  let data;
  try {
    data = JSON.parse(await fs.readFile(file, 'utf8'));       // read
  } catch (err) {                                             // the other request was half-way through writing
    broken++;
    firstError ||= `${err.name}: ${err.message}`;
    return;
  }
  data.likes += 1;                                            // change
  await fs.writeFile(file, JSON.stringify(data));             // write the whole file back
}
async function user(n) { for (let i = 0; i < n; i++) await likeWithJsonFile(); }
await Promise.all([user(200), user(200)]);
const fromFile = JSON.parse(await fs.readFile(file, 'utf8')).likes;
console.log('JSON file : 2 × 200 likes →', fromFile, 'saved', fromFile === 400 ? '' : `(${400 - fromFile} likes lost)`);
console.log('            reads that found a half-written file:', broken, broken ? '— ' + firstError : '');

// 2. a database: one atomic statement
const dbFile = path.join(dir, 'likes.db');
const setup = new DatabaseSync(dbFile);
setup.exec('CREATE TABLE posts (id INTEGER PRIMARY KEY, likes INTEGER NOT NULL DEFAULT 0); INSERT INTO posts (id) VALUES (1);');
const a = new DatabaseSync(dbFile);                          // two separate connections,
const b = new DatabaseSync(dbFile);                          // like two server processes
const likeA = a.prepare('UPDATE posts SET likes = likes + 1 WHERE id = 1');
const likeB = b.prepare('UPDATE posts SET likes = likes + 1 WHERE id = 1');
async function dbUser(stmt, n) { for (let i = 0; i < n; i++) { stmt.run(); await null; } }
await Promise.all([dbUser(likeA, 200), dbUser(likeB, 200)]);
console.log('database  : 2 × 200 likes →', setup.prepare('SELECT likes FROM posts WHERE id = 1').get().likes, 'saved');

// 3. it survives a "restart": open the file again in a new connection
a.close(); b.close(); setup.close();
const again = new DatabaseSync(dbFile);
console.log('after reopening the database file:', JSON.stringify(again.prepare('SELECT * FROM posts').all()));
again.close();
await fs.rm(dir, { recursive: true });
