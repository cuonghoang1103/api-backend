// demo3/sessions-dump.mjs — lesson 3.1: what one session row looks like (the digest shortened; the token is not there at all).
import { pool } from '../src/db.js';
await pool.query("SET TIME ZONE 'Asia/Ho_Chi_Minh'");
const { rows } = await pool.query(`SELECT left(digest, 12) || '…' AS digest, user_id, to_char(created_at, 'HH24:MI:SS') AS created,
  to_char(expires_at, 'DD/MM HH24:MI') AS expires, to_char(last_seen_at, 'HH24:MI:SS') AS last_seen, ip, left(user_agent, 12) AS ua
  FROM sessions ORDER BY created_at`);
console.table(rows);
await pool.end();
