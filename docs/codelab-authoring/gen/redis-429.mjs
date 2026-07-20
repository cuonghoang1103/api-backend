// Redis module 429 (performance-scripting-and-production-patterns) — 10 exercises.
// Track language text; pure redis-cli command sequences. Documented outputs use --no-raw.
// Verified by piping the exact shipped solution to a real redis:7. Script SHA is deterministic.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'redis';
const moduleSlug = 'performance-scripting-and-production-patterns';
const L = 'text';
const SHA_INCR = '2bab3b661081db58bd2341920e0ba7cf5dc77b25'; // sha1 of "return redis.call('incr', KEYS[1])"

const exercises = [
  {
    title: 'Group Commands Atomically with MULTI and EXEC',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['MULTI', 'EXEC', 'transaction', 'queued commands', 'atomic batch'],
    prerequisites: ['SET', 'INCR'],
    tags: ['transactions', 'multi', 'exec', 'atomic', 'redis'],
    problemHtml: `<p>A Redis transaction groups commands so they execute as one atomic unit with no other client's commands interleaved. <code>MULTI</code> starts the transaction; each following command replies <code>QUEUED</code> instead of running immediately; <code>EXEC</code> then runs the whole queue in order and returns an array of every command's result.</p>
<p>Using <code>redis-cli</code>, run a transaction that initialises and adjusts a counter atomically:</p>
<ul>
<li><code>MULTI</code> to begin. Queue <code>SET counter 10</code>, then <code>INCR counter</code>, then <code>INCRBY counter 5</code> — each replies <code>QUEUED</code>.</li>
<li><code>EXEC</code> runs them, returning an array: <code>OK</code>, then <code>11</code>, then <code>16</code>.</li>
<li><code>GET counter</code> confirms the final value <code>"16"</code>.</li>
<li>Start a second transaction, queue an <code>INCR counter</code>, and confirm the queued command has not yet applied by checking that until <code>EXEC</code> the value is unchanged; then <code>EXEC</code> and <code>GET</code> to see <code>"17"</code>.</li>
</ul>
<p>The whole queue applies together at <code>EXEC</code>. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database. The transaction builds and adjusts a counter.',
    outputSpec: 'Queued commands reply QUEUED; EXEC returns [OK, 11, 16]; GET counter is "16"; after a second transaction with INCR, GET is "17".',
    constraints: 'Use MULTI/EXEC. Commands between them must reply QUEUED (not run early). Do not use WATCH here.',
    examplesJson: [
      { input: 'MULTI; SET counter 10; INCR counter; INCRBY counter 5; EXEC', output: 'QUEUED x3 then 1) OK 2) (integer) 11 3) (integer) 16', explanation: 'Each queued command replies QUEUED; EXEC runs them in order and returns each result.' },
      { input: 'GET counter after EXEC', output: '"16"', explanation: 'The transaction applied SET 10, INCR to 11, then INCRBY 5 to 16.' },
    ],
    hintsJson: [
      'A transaction is bracketed by MULTI and EXEC; commands in between are only queued.',
      'Between MULTI and EXEC each command replies QUEUED and does not run yet.',
      'EXEC runs the whole queue atomically and returns an array of results.',
      'GET after EXEC shows the applied value.',
    ],
    starter: `MULTI
SET counter 10
INCR counter
INCRBY counter 5
EXEC
GET counter
MULTI
INCR counter
EXEC
GET counter
MULTI
INCRBY counter 3
DECR counter
EXEC
GET counter
SET tally 0
MULTI
INCR tally
INCR tally
INCR tally
EXEC
GET tally`,
    solution: `MULTI
SET counter 10
INCR counter
INCRBY counter 5
EXEC
GET counter
MULTI
INCR counter
EXEC
GET counter
MULTI
INCRBY counter 3
DECR counter
EXEC
GET counter
SET tally 0
MULTI
INCR tally
INCR tally
INCR tally
EXEC
GET tally`,
    solutionExplanationHtml: `<p><code>MULTI</code> opens a transaction and switches the connection into queuing mode: each subsequent command is validated and parked, replying <code>QUEUED</code> rather than executing. <code>EXEC</code> then runs the entire queue as one atomic step — no other client's commands can interleave — and returns an array with one entry per queued command, so you see <code>OK</code> for the <code>SET</code>, <code>11</code> for the first <code>INCR</code>, and <code>16</code> for the <code>INCRBY</code>. Until <code>EXEC</code>, none of the effects are visible; the whole batch lands together.</p>
<p>Two properties matter in production. First, atomicity: because the queue runs without interruption, invariants that span several keys stay consistent. Second, and often misunderstood: Redis transactions are <em>not</em> like SQL transactions — there is no rollback. If a queued command fails at runtime (for example an <code>INCR</code> on a non-numeric value), the other commands still execute; <code>EXEC</code> returns an array where that one entry is an error. Only <em>syntax</em> errors detected at queue time abort the whole transaction. So <code>MULTI</code>/<code>EXEC</code> guarantees "all run together, uninterrupted", not "all-or-nothing on error". When you need conditional logic or true all-or-nothing with a data-dependent decision, a Lua script (later in this module) is the better tool, because it runs atomically <em>and</em> can branch. <code>DISCARD</code> abandons a queued transaction, and <code>WATCH</code> adds optimistic concurrency — both covered next.</p>`,
  },
  {
    title: 'Abandon a Queued Transaction with DISCARD',
    difficulty: 'EASY', estimatedMinutes: 15, points: 10,
    concepts: ['DISCARD', 'aborting a transaction', 'queued state', 'no side effects', 'MULTI'],
    prerequisites: ['MULTI', 'EXEC'],
    tags: ['transactions', 'discard', 'abort', 'multi', 'redis'],
    problemHtml: `<p>Sometimes, after queuing commands in a transaction, you decide not to proceed. <code>DISCARD</code> throws away the queued commands and exits transaction mode without applying anything — the queued commands never run, so there are no side effects.</p>
<p>Using <code>redis-cli</code>:</p>
<ul>
<li>Set a baseline: <code>SET balance 100</code>.</li>
<li><code>MULTI</code>, then queue <code>INCRBY balance 50</code> and <code>SET note "changed"</code> (each replies <code>QUEUED</code>).</li>
<li><code>DISCARD</code> — the queue is thrown away (replies <code>OK</code>).</li>
<li>Confirm nothing changed: <code>GET balance</code> is still <code>"100"</code> and <code>EXISTS note</code> is <code>0</code>.</li>
<li>Show the contrast: run a real <code>MULTI</code> / <code>INCRBY balance 50</code> / <code>EXEC</code>, then <code>GET balance</code> is <code>"150"</code>.</li>
</ul>
<p>DISCARD is the "cancel" to EXEC's "commit". The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database with balance initialised to 100.',
    outputSpec: 'After DISCARD, balance stays "100" and note does not exist (EXISTS 0). After a committed MULTI/EXEC, balance is "150".',
    constraints: 'Use DISCARD to abort the first transaction. The queued commands must not apply. Then demonstrate a committed transaction for contrast.',
    examplesJson: [
      { input: 'MULTI; INCRBY balance 50; SET note "changed"; DISCARD', output: 'QUEUED, QUEUED, OK', explanation: 'The two commands are queued, then DISCARD throws them away and replies OK.' },
      { input: 'GET balance and EXISTS note after DISCARD', output: '"100" and (integer) 0', explanation: 'Nothing applied — balance is unchanged and note was never created.' },
    ],
    hintsJson: [
      'DISCARD is the cancel button for a MULTI you have started.',
      'Queue commands after MULTI, then DISCARD instead of EXEC.',
      'The queued commands never run, so no key changes.',
      'Verify with GET/EXISTS that the queued effects did not happen.',
    ],
    starter: `SET balance 100
MULTI
INCRBY balance 50
SET note "changed"
DISCARD
GET balance
EXISTS note
MULTI
INCRBY balance 50
EXEC
GET balance
MULTI
DECRBY balance 30
SET flag "x"
DISCARD
GET balance
EXISTS flag
MULTI
DECRBY balance 50
EXEC
GET balance`,
    solution: `SET balance 100
MULTI
INCRBY balance 50
SET note "changed"
DISCARD
GET balance
EXISTS note
MULTI
INCRBY balance 50
EXEC
GET balance
MULTI
DECRBY balance 30
SET flag "x"
DISCARD
GET balance
EXISTS flag
MULTI
DECRBY balance 50
EXEC
GET balance`,
    solutionExplanationHtml: `<p><code>DISCARD</code> is the counterpart to <code>EXEC</code>: where <code>EXEC</code> runs the queued commands, <code>DISCARD</code> throws them away and leaves transaction mode, applying nothing. Because commands after <code>MULTI</code> are only queued and never executed until <code>EXEC</code>, discarding them has zero side effects — <code>balance</code> remains <code>"100"</code> and <code>note</code> is never created, so <code>EXISTS note</code> is <code>0</code>. The subsequent committed transaction, ending in <code>EXEC</code>, does apply the increment and takes <code>balance</code> to <code>"150"</code>, making the contrast concrete.</p>
<p>This is useful whenever application logic, after building up a batch, hits a condition that means the batch should not proceed — a validation failure, a changed precondition, a user cancelling. Rather than executing and trying to undo (which Redis cannot do, since there is no rollback), you simply <code>DISCARD</code> before <code>EXEC</code>. It also implicitly clears any <code>WATCH</code>es on the connection. One practical note: <code>DISCARD</code> only makes sense inside a <code>MULTI</code> block; calling it without an open transaction is an error. In client libraries the transaction is usually wrapped so that an exception during queue-building triggers <code>DISCARD</code> automatically, keeping the connection clean for the next operation. Together, <code>MULTI</code>, <code>EXEC</code>, and <code>DISCARD</code> give you begin, commit, and cancel for a queued batch.</p>`,
  },
  {
    title: 'Run Server-Side Logic with EVAL',
    difficulty: 'MEDIUM', estimatedMinutes: 25, points: 15,
    concepts: ['EVAL', 'Lua scripting', 'return types', 'Lua to Redis conversion', 'atomic script'],
    prerequisites: ['SET', 'GET'],
    tags: ['scripting', 'lua', 'eval', 'atomic', 'redis'],
    problemHtml: `<p>Redis can run Lua scripts server-side with <code>EVAL</code>, and each script executes <strong>atomically</strong> — no other command runs while it does. This lets you do multi-step logic in one round trip with transactional guarantees stronger than <code>MULTI</code>/<code>EXEC</code>, because a script can branch on values it reads. First, understand how a script's return value maps back to a Redis reply.</p>
<p>Using <code>redis-cli</code>, run these scripts (the number after the script is how many <code>KEYS</code> it takes — <code>0</code> here):</p>
<ul>
<li><code>EVAL "return 42" 0</code> &rarr; the integer <code>42</code>.</li>
<li><code>EVAL "return 'hello'" 0</code> &rarr; the bulk string <code>"hello"</code>.</li>
<li><code>EVAL "return {1, 2, 'three'}" 0</code> &rarr; a Lua table becomes an array reply: <code>1) 1  2) 2  3) "three"</code>.</li>
<li><code>EVAL "return redis.status_reply('DONE')" 0</code> &rarr; a status reply <code>DONE</code>.</li>
<li><code>EVAL "return true" 0</code> &rarr; Lua <code>true</code> becomes <code>1</code>; <code>EVAL "return false" 0</code> &rarr; <code>false</code> becomes <code>(nil)</code>.</li>
</ul>
<p>These conversion rules are essential to reading script results correctly. The scaffold lists the scripts.</p>`,
    inputSpec: 'A clean Redis database; these scripts take no keys.',
    outputSpec: 'EVAL returns: 42 (integer), "hello" (string), [1,2,"three"] (array), DONE (status), 1 (from true), (nil) (from false).',
    constraints: 'Use EVAL with numkeys 0. Rely on the Lua-to-Redis conversion rules (true->1, false->nil, table->array).',
    examplesJson: [
      { input: 'EVAL "return {1, 2, \'three\'}" 0', output: '1) (integer) 1\n2) (integer) 2\n3) "three"', explanation: 'A Lua table is converted to a Redis array reply, element by element.' },
      { input: 'EVAL "return true" 0 and EVAL "return false" 0', output: '(integer) 1 and (nil)', explanation: 'Lua true becomes the integer 1; Lua false (and nil) becomes a nil reply.' },
    ],
    hintsJson: [
      'EVAL script numkeys [key ...] [arg ...] runs Lua on the server atomically.',
      'The number right after the script string is how many KEYS follow (0 here).',
      'A Lua number returns as an integer; a Lua string as a bulk string; a Lua table as an array.',
      'Lua true converts to 1 and false to nil — a frequent surprise.',
    ],
    starter: `EVAL "return 42" 0
EVAL "return 'hello'" 0
EVAL "return {1, 2, 'three'}" 0
EVAL "return redis.status_reply('DONE')" 0
EVAL "return true" 0
EVAL "return false" 0
EVAL "return 3.99" 0
EVAL "return #KEYS" 0
EVAL "return tostring(10)" 0
EVAL "return {ok='FINE'}" 0`,
    solution: `EVAL "return 42" 0
EVAL "return 'hello'" 0
EVAL "return {1, 2, 'three'}" 0
EVAL "return redis.status_reply('DONE')" 0
EVAL "return true" 0
EVAL "return false" 0
EVAL "return 3.99" 0
EVAL "return #KEYS" 0
EVAL "return tostring(10)" 0
EVAL "return {ok='FINE'}" 0`,
    solutionExplanationHtml: `<p><code>EVAL</code> runs a Lua script inside the Redis server, and the whole script executes atomically — Redis is single-threaded for command execution, so while your script runs no other client's commands interleave. That gives a script stronger guarantees than <code>MULTI</code>/<code>EXEC</code>: it can read a value, branch on it, and write, all as one indivisible operation. The argument immediately after the script is <code>numkeys</code>, the count of key names that follow (here <code>0</code>); keys go in <code>KEYS[]</code> and other arguments in <code>ARGV[]</code>, a separation that matters for cluster routing.</p>
<p>The conversion rules between Lua and Redis replies are what you must internalise to read results correctly. A Lua number returns as a Redis <em>integer</em> (fractions are truncated), a Lua string as a bulk string, and a Lua table as an <em>array</em> reply built from its sequential elements (stopping at the first <code>nil</code>). Booleans are the classic trap: Lua <code>true</code> becomes the integer <code>1</code>, and Lua <code>false</code> — like Lua <code>nil</code> — becomes a Redis <code>(nil)</code> reply. For explicit status or error replies you use the helpers <code>redis.status_reply()</code> and <code>redis.error_reply()</code>. Because scripts are atomic and run where the data lives, they eliminate round trips and races for compound operations; the cost is that a long-running script blocks the whole server, so scripts must be fast and must not call blocking commands. The next exercises use <code>KEYS</code> and <code>ARGV</code> to make scripts operate on real data.</p>`,
  },
  {
    title: 'Pass Keys and Arguments to a Script',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 20,
    concepts: ['KEYS array', 'ARGV array', 'redis.call', 'parameterised script', 'reusable logic'],
    prerequisites: ['EVAL', 'SET', 'GET'],
    tags: ['scripting', 'lua', 'keys-argv', 'redis-call', 'redis'],
    problemHtml: `<p>A useful script operates on real keys and values, passed in through the <code>KEYS</code> and <code>ARGV</code> arrays. Inside the script, <code>redis.call(...)</code> invokes Redis commands. Keeping key names in <code>KEYS</code> (not hard-coded) is not just style — it is what lets Redis route the script correctly in a cluster.</p>
<p>Using <code>redis-cli</code>:</p>
<ul>
<li>Set two fields atomically in one script: <code>EVAL "redis.call('set', KEYS[1], ARGV[1]); redis.call('set', KEYS[2], ARGV[2]); return 'OK'" 2 user:name user:role Ann admin</code>.</li>
<li>Read them back: <code>GET user:name</code> &rarr; <code>"Ann"</code>, <code>GET user:role</code> &rarr; <code>"admin"</code>.</li>
<li>Run a script that reads and computes: <code>EVAL "return redis.call('get', KEYS[1]) .. '/' .. redis.call('get', KEYS[2])" 2 user:name user:role</code> &rarr; <code>"Ann/admin"</code>.</li>
<li>Run a script using <code>ARGV</code> arithmetic: <code>EVAL "return redis.call('incrby', KEYS[1], ARGV[1])" 1 score 5</code> on a fresh <code>score</code> &rarr; <code>5</code>.</li>
</ul>
<p>The <code>2</code> and <code>1</code> after each script are the key counts. The scaffold lists the scripts.</p>`,
    inputSpec: 'A clean Redis database; the script sets and reads keys via KEYS/ARGV.',
    outputSpec: 'The two-set script returns "OK" and stores Ann/admin; the concat script returns "Ann/admin"; the INCRBY-by-ARGV script returns 5.',
    constraints: 'Pass key names in KEYS and values in ARGV — do not hard-code key names in the script body. Use redis.call to invoke commands.',
    examplesJson: [
      { input: "EVAL sets KEYS[1]=ARGV[1], KEYS[2]=ARGV[2] with 2 user:name user:role Ann admin", output: '"OK", and GET user:name -> "Ann"', explanation: 'The script sets both keys atomically using the passed keys and args.' },
      { input: "EVAL concatenating the two values", output: '"Ann/admin"', explanation: 'redis.call reads both keys and Lua concatenates them with the .. operator.' },
    ],
    hintsJson: [
      'Pass key names as KEYS and values as ARGV so the script is reusable and cluster-safe.',
      'Inside the script, redis.call(\'set\', KEYS[1], ARGV[1]) runs a command.',
      'The number after the script body is numkeys; keys come first, then args.',
      'Lua concatenates strings with the .. operator.',
    ],
    starter: `EVAL "redis.call('set', KEYS[1], ARGV[1]); redis.call('set', KEYS[2], ARGV[2]); return 'OK'" 2 user:name user:role Ann admin
GET user:name
GET user:role
EVAL "return redis.call('get', KEYS[1]) .. '/' .. redis.call('get', KEYS[2])" 2 user:name user:role
EVAL "return redis.call('incrby', KEYS[1], ARGV[1])" 1 score 5`,
    solution: `EVAL "redis.call('set', KEYS[1], ARGV[1]); redis.call('set', KEYS[2], ARGV[2]); return 'OK'" 2 user:name user:role Ann admin
GET user:name
GET user:role
EVAL "return redis.call('get', KEYS[1]) .. '/' .. redis.call('get', KEYS[2])" 2 user:name user:role
EVAL "return redis.call('incrby', KEYS[1], ARGV[1])" 1 score 5`,
    solutionExplanationHtml: `<p>Scripts become reusable and correct when their inputs come through <code>KEYS</code> and <code>ARGV</code> rather than being baked into the body. <code>KEYS[1]</code>, <code>KEYS[2]</code>, … are the key names you list after <code>numkeys</code>; <code>ARGV[1]</code>, <code>ARGV[2]</code>, … are the remaining arguments. Inside, <code>redis.call('set', KEYS[1], ARGV[1])</code> executes a normal Redis command, and because the whole script is atomic, setting <code>user:name</code> and <code>user:role</code> together happens with no interleaving — a mini transaction with logic. Lua's <code>..</code> operator concatenates, so the third script reads both values and returns <code>"Ann/admin"</code>, and the fourth performs server-side arithmetic via <code>INCRBY</code> with the amount taken from <code>ARGV[1]</code>.</p>
<p>Passing keys through <code>KEYS</code> is more than convention. In Redis Cluster, the server uses the declared keys to check they all live in the same hash slot and to route the script; a key name hidden inside the script body would defeat that and can raise a cross-slot error. So the rule is firm: every key a script touches must arrive via <code>KEYS</code>. A second best practice is choosing between <code>redis.call</code> and <code>redis.pcall</code>: <code>redis.call</code> raises and aborts the script on a command error (propagating the error to the client), while <code>redis.pcall</code> returns the error as a value for you to handle — use <code>pcall</code> when a failure is expected and you want to branch on it. Parameterised, key-declaring scripts are the foundation for the atomic patterns that follow.</p>`,
  },
  {
    title: 'Implement Atomic Compare-and-Set in Lua',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['compare-and-set', 'conditional script', 'atomic read-modify-write', 'Lua branching', 'concurrency safety'],
    prerequisites: ['EVAL', 'KEYS and ARGV', 'redis.call'],
    tags: ['scripting', 'lua', 'cas', 'atomic', 'redis'],
    problemHtml: `<p>A compare-and-set (CAS) updates a key only if its current value matches an expected one — the building block of optimistic locking and safe lock release. Doing it with separate <code>GET</code> then <code>SET</code> has a race; doing it in a Lua script is atomic, because the read and the conditional write happen with no interleaving.</p>
<p>Write and run a CAS script that sets <code>KEYS[1]</code> to <code>ARGV[2]</code> only if its current value equals <code>ARGV[1]</code>, returning <code>1</code> on success and <code>0</code> on mismatch:</p>
<ul>
<li><code>SET config "v1"</code> to start.</li>
<li>Run the CAS with expected <code>v1</code>, new <code>v2</code>: it matches, so it sets and returns <code>1</code>; <code>GET config</code> is <code>"v2"</code>.</li>
<li>Run the CAS again with expected <code>v1</code> (now stale), new <code>v3</code>: the current value is <code>v2</code>, so it does <strong>not</strong> match, returns <code>0</code>, and <code>GET config</code> stays <code>"v2"</code>.</li>
</ul>
<p>The script body is <code>if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('set', KEYS[1], ARGV[2]) and 1 else return 0 end</code>. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database; config starts at "v1".',
    outputSpec: 'The first CAS (expected v1) returns 1 and sets config to "v2"; the second CAS (expected v1, but current is v2) returns 0 and leaves config "v2".',
    constraints: 'Do the compare and the set in one Lua script (atomic). Return 1 on match, 0 on mismatch. Do not use a separate GET then SET.',
    examplesJson: [
      { input: 'CAS on config: expected "v1", new "v2" (current is v1)', output: '(integer) 1, and GET config -> "v2"', explanation: 'The current value matches the expected, so the script sets the new value and returns 1.' },
      { input: 'CAS again: expected "v1", new "v3" (current is now v2)', output: '(integer) 0, and GET config stays "v2"', explanation: 'The expected value is stale, so the compare fails and nothing changes.' },
    ],
    hintsJson: [
      'A safe conditional update must read and write atomically — a script does that.',
      'Inside Lua: if redis.call(\'get\', KEYS[1]) == ARGV[1] then ... else return 0 end.',
      'On match, set the new value and return 1; on mismatch return 0.',
      'redis.call(\'set\', ...) returns a status; use "and 1" to return the integer 1 on success.',
    ],
    starter: `SET config "v1"
EVAL "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('set', KEYS[1], ARGV[2]) and 1 else return 0 end" 1 config v1 v2
GET config
EVAL "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('set', KEYS[1], ARGV[2]) and 1 else return 0 end" 1 config v1 v3
GET config`,
    solution: `SET config "v1"
EVAL "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('set', KEYS[1], ARGV[2]) and 1 else return 0 end" 1 config v1 v2
GET config
EVAL "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('set', KEYS[1], ARGV[2]) and 1 else return 0 end" 1 config v1 v3
GET config`,
    solutionExplanationHtml: `<p>The script reads the current value with <code>redis.call('get', KEYS[1])</code>, compares it to the expected <code>ARGV[1]</code>, and only if they are equal writes the new <code>ARGV[2]</code>, returning <code>1</code>; otherwise it returns <code>0</code> and changes nothing. Because the entire script runs atomically, there is no window between the read and the conditional write in which another client could change the value — which is exactly the guarantee a compare-and-set needs and which a client-side <code>GET</code>-then-<code>SET</code> cannot provide. The first call matches (<code>v1</code> is current) and advances <code>config</code> to <code>v2</code>; the second call carries a now-stale expectation (<code>v1</code>) while the current value is <code>v2</code>, so it correctly refuses and returns <code>0</code>.</p>
<p>This CAS primitive is the heart of several production patterns. It is how you release a distributed lock <em>safely</em>: store a unique token as the lock value, and release with a CAS that deletes the key only if the token still matches yours, so a lock that already expired and was re-acquired by someone else is never deleted by the previous holder. It is also the atomic core of optimistic concurrency — read a version, do work, then CAS the new state only if the version is unchanged. The Lua approach is generally preferred over the <code>WATCH</code>-based alternative (next exercise) because it is a single round trip and expresses the condition directly. The one detail in the code — <code>redis.call('set', ...) and 1</code> — coerces the <code>SET</code>'s status reply into the integer <code>1</code> so the script returns a clean numeric success flag rather than a status object.</p>`,
    diagramMermaid: `flowchart TD
  A[EVAL CAS script] --> B{current equals expected}
  B -- yes --> C[SET new value return 1]
  B -- no --> D[return 0 no change]`,
  },
  {
    title: 'Cap a Counter Atomically in a Script',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['atomic increment with limit', 'Lua branching', 'rollback in script', 'quota enforcement', 'server-side logic'],
    prerequisites: ['EVAL', 'INCR', 'Lua branching'],
    tags: ['scripting', 'lua', 'counter', 'quota', 'redis'],
    problemHtml: `<p>"Increment this counter, but never above N" is a quota check that must be atomic — otherwise two clients can both push it over the limit. A Lua script does the increment and the limit check as one indivisible operation, undoing the increment if it would exceed the cap.</p>
<p>Write a script that increments <code>KEYS[1]</code> but caps it at <code>ARGV[1]</code>: increment, and if the new value exceeds the cap, decrement back and return <code>-1</code>; otherwise return the new value. Test with a cap of <code>3</code>:</p>
<ul>
<li>Run it four times on a fresh <code>slots</code> key with cap <code>3</code>: returns <code>1</code>, <code>2</code>, <code>3</code>, then <code>-1</code> (the fourth is rejected).</li>
<li><code>GET slots</code> confirms the value stayed at <code>"3"</code> — the rejected increment was rolled back.</li>
</ul>
<p>The body is <code>local v = redis.call('incr', KEYS[1]); if v > tonumber(ARGV[1]) then redis.call('decr', KEYS[1]); return -1 end; return v</code>. The scaffold lists the four calls.</p>`,
    inputSpec: 'A clean Redis database; slots does not exist. Cap is 3.',
    outputSpec: 'Four calls return 1, 2, 3, -1; GET slots stays "3" because the fourth increment was rolled back inside the script.',
    constraints: 'Do the increment, limit check, and rollback in one atomic Lua script. Return -1 when the cap is exceeded and the value must be unchanged. Use tonumber on ARGV.',
    examplesJson: [
      { input: 'the script run 3 times on a fresh key, cap 3', output: '(integer) 1, then 2, then 3', explanation: 'Each call increments and stays within the cap, returning the new value.' },
      { input: 'the 4th call (would exceed cap 3)', output: '(integer) -1, and GET slots stays "3"', explanation: 'The increment to 4 exceeds the cap, so the script decrements back to 3 and returns -1.' },
    ],
    hintsJson: [
      'Increment first, then check the cap, then undo if over — all in one atomic script.',
      'local v = redis.call(\'incr\', KEYS[1]) reads the incremented value.',
      'Compare with tonumber(ARGV[1]) because ARGV values are strings.',
      'If over the cap, redis.call(\'decr\', KEYS[1]) and return -1; otherwise return v.',
    ],
    starter: `EVAL "local v = redis.call('incr', KEYS[1]); if v > tonumber(ARGV[1]) then redis.call('decr', KEYS[1]); return -1 end; return v" 1 slots 3
EVAL "local v = redis.call('incr', KEYS[1]); if v > tonumber(ARGV[1]) then redis.call('decr', KEYS[1]); return -1 end; return v" 1 slots 3
EVAL "local v = redis.call('incr', KEYS[1]); if v > tonumber(ARGV[1]) then redis.call('decr', KEYS[1]); return -1 end; return v" 1 slots 3
EVAL "local v = redis.call('incr', KEYS[1]); if v > tonumber(ARGV[1]) then redis.call('decr', KEYS[1]); return -1 end; return v" 1 slots 3
GET slots`,
    solution: `EVAL "local v = redis.call('incr', KEYS[1]); if v > tonumber(ARGV[1]) then redis.call('decr', KEYS[1]); return -1 end; return v" 1 slots 3
EVAL "local v = redis.call('incr', KEYS[1]); if v > tonumber(ARGV[1]) then redis.call('decr', KEYS[1]); return -1 end; return v" 1 slots 3
EVAL "local v = redis.call('incr', KEYS[1]); if v > tonumber(ARGV[1]) then redis.call('decr', KEYS[1]); return -1 end; return v" 1 slots 3
EVAL "local v = redis.call('incr', KEYS[1]); if v > tonumber(ARGV[1]) then redis.call('decr', KEYS[1]); return -1 end; return v" 1 slots 3
GET slots`,
    solutionExplanationHtml: `<p>The script performs three steps — increment, check, conditional rollback — as one atomic unit. <code>local v = redis.call('incr', KEYS[1])</code> bumps the counter and captures the new value; <code>tonumber(ARGV[1])</code> converts the cap (arguments arrive as strings) so the comparison is numeric; and if <code>v</code> exceeds the cap, <code>redis.call('decr', KEYS[1])</code> undoes the increment and the script returns <code>-1</code>. Because no other command can run between the <code>INCR</code> and the <code>DECR</code>, the counter is never observable above the cap and two concurrent callers can never both slip over the limit — the exact failure a naive "INCR then check in the client, and DECR if over" suffers, where both clients can increment to 4 before either checks.</p>
<p>This "increment, verify, roll back if needed" shape is the atomic core of resource quotas: concurrent connection limits, seats in a room, tickets in a sale, tokens in a bucket. The rollback-inside-the-script technique generalises to any "do a tentative write, then undo it atomically if a condition fails" requirement. It is worth noting that returning <code>-1</code> as a sentinel is a convention — you could instead return the remaining headroom, or a two-element table of <code>{allowed, current}</code> for richer client logic. The key property is that the whole decision is made server-side in one atomic pass, so the limit holds under any level of concurrency. The next exercise caches such a script by its SHA so you do not resend the body every call.</p>`,
  },
  {
    title: 'Cache Scripts with SCRIPT LOAD and EVALSHA',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 20,
    concepts: ['SCRIPT LOAD', 'EVALSHA', 'script cache', 'SHA1 digest', 'bandwidth saving'],
    prerequisites: ['EVAL', 'KEYS and ARGV'],
    tags: ['scripting', 'evalsha', 'script-load', 'cache', 'redis'],
    problemHtml: `<p>Sending a full script body on every call wastes bandwidth. Redis caches scripts on the server: <code>SCRIPT LOAD</code> stores a script and returns its <strong>SHA1 digest</strong>, and <code>EVALSHA</code> runs a cached script by that digest. Because the digest is deterministic (a hash of the exact script text), it is stable across calls and clients.</p>
<p>Using <code>redis-cli</code>:</p>
<ul>
<li><code>SET score 5</code> to start.</li>
<li><code>SCRIPT LOAD "return redis.call('incr', KEYS[1])"</code> &rarr; returns the SHA1 <code>${SHA_INCR}</code>.</li>
<li><code>SCRIPT EXISTS ${SHA_INCR}</code> &rarr; <code>1</code> (the script is cached).</li>
<li><code>EVALSHA ${SHA_INCR} 1 score</code> &rarr; runs the cached script, incrementing <code>score</code> to <code>6</code>.</li>
<li><code>EVALSHA ${SHA_INCR} 1 score</code> again &rarr; <code>7</code>.</li>
</ul>
<p>The SHA is the same every time you load that exact script. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database; score starts at 5.',
    outputSpec: `SCRIPT LOAD returns the SHA1 ${SHA_INCR}; SCRIPT EXISTS returns 1; EVALSHA increments score to 6, then 7.`,
    constraints: 'Use SCRIPT LOAD to cache and EVALSHA to run by digest. The SHA is deterministic for the exact script text. Handle the case where a script is not cached (NOSCRIPT) by falling back to EVAL in real code.',
    examplesJson: [
      { input: "SCRIPT LOAD \"return redis.call('incr', KEYS[1])\"", output: `"${SHA_INCR}"`, explanation: 'The server caches the script and returns its SHA1 digest, which is deterministic.' },
      { input: `EVALSHA ${SHA_INCR} 1 score (score is 5)`, output: '(integer) 6', explanation: 'EVALSHA runs the cached script by digest, incrementing score.' },
    ],
    hintsJson: [
      'Avoid resending the script body: cache it once, then call by its hash.',
      'SCRIPT LOAD script returns the SHA1 digest string.',
      'EVALSHA sha numkeys key... runs the cached script.',
      'SCRIPT EXISTS sha tells you whether it is cached (1) or not (0); on NOSCRIPT, fall back to EVAL.',
    ],
    starter: `SET score 5
SCRIPT LOAD "return redis.call('incr', KEYS[1])"
SCRIPT EXISTS ${SHA_INCR}
EVALSHA ${SHA_INCR} 1 score
EVALSHA ${SHA_INCR} 1 score
GET score`,
    solution: `SET score 5
SCRIPT LOAD "return redis.call('incr', KEYS[1])"
SCRIPT EXISTS ${SHA_INCR}
EVALSHA ${SHA_INCR} 1 score
EVALSHA ${SHA_INCR} 1 score
GET score`,
    solutionExplanationHtml: `<p>Redis keeps a server-side cache of Lua scripts keyed by the SHA1 hash of their source. <code>SCRIPT LOAD</code> compiles and stores the script, returning that digest — here <code>${SHA_INCR}</code> — and because the hash is computed purely from the exact script text, loading the same script anywhere yields the same SHA. <code>EVALSHA sha numkeys ...</code> then runs the cached script by digest, so after the first load you send a 40-character hash instead of the whole body on every call, which matters when a script is large or invoked millions of times. <code>SCRIPT EXISTS</code> reports whether a digest is currently cached.</p>
<p>The operational subtlety every client must handle is the <code>NOSCRIPT</code> error: the script cache is not persisted and is cleared by <code>SCRIPT FLUSH</code>, a server restart, or a failover to a replica that never saw the <code>LOAD</code>. So <code>EVALSHA</code> can fail with <em>NOSCRIPT No matching script</em> even for a digest you loaded earlier. The standard, robust pattern — which good client libraries implement for you — is: try <code>EVALSHA</code>; if it returns <code>NOSCRIPT</code>, fall back to <code>EVAL</code> with the full body (which also re-caches it), then continue with <code>EVALSHA</code>. This gives you the bandwidth savings in the common case and correctness in the edge case. Because <code>EVAL</code> itself caches on first use, some setups skip the explicit <code>SCRIPT LOAD</code> entirely and just alternate <code>EVALSHA</code>/<code>EVAL</code>. Either way, cached scripts make server-side atomic logic cheap to invoke at scale.</p>`,
  },
  {
    title: 'Guard a Transaction with WATCH',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['WATCH', 'optimistic locking', 'check-and-set', 'MULTI EXEC with WATCH', 'aborted on change'],
    prerequisites: ['MULTI', 'EXEC'],
    tags: ['transactions', 'watch', 'optimistic-locking', 'cas', 'redis'],
    problemHtml: `<p><code>WATCH</code> adds optimistic concurrency to <code>MULTI</code>/<code>EXEC</code>: you mark keys as watched, and if any of them is modified by another client before you <code>EXEC</code>, the transaction is <strong>aborted</strong> and <code>EXEC</code> returns <code>(nil)</code>. This lets you build a safe read-modify-write without holding a lock: read, compute, then <code>MULTI</code>/<code>EXEC</code> — and retry if it was aborted.</p>
<p>Demonstrate the successful path (no concurrent change) using <code>redis-cli</code>:</p>
<ul>
<li><code>SET stock 10</code>.</li>
<li><code>WATCH stock</code> (reply <code>OK</code>), read it with <code>GET stock</code> (<code>"10"</code>), decide to decrement by 3.</li>
<li><code>MULTI</code>, queue <code>DECRBY stock 3</code>, <code>EXEC</code> — since <code>stock</code> was not changed by anyone else, <code>EXEC</code> succeeds and returns the array <code>1) (integer) 7</code>.</li>
<li><code>GET stock</code> is <code>"7"</code>.</li>
</ul>
<p>If another client had written <code>stock</code> between <code>WATCH</code> and <code>EXEC</code>, <code>EXEC</code> would have returned <code>(nil)</code> and you would retry. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database; stock starts at 10. No concurrent writer in this run.',
    outputSpec: 'WATCH replies OK; the MULTI/EXEC succeeds (no concurrent change) returning [7]; GET stock is "7".',
    constraints: 'Use WATCH before reading, then MULTI/EXEC. In this single-client run EXEC succeeds; understand that a concurrent write to a watched key makes EXEC return (nil).',
    examplesJson: [
      { input: 'WATCH stock; GET stock; MULTI; DECRBY stock 3; EXEC (no concurrent change)', output: 'EXEC returns 1) (integer) 7', explanation: 'Because stock was not modified after WATCH, the transaction commits and DECRBY yields 7.' },
      { input: 'if another client wrote stock after WATCH', output: 'EXEC returns (nil)', explanation: 'A change to a watched key aborts the transaction; the client would retry the read-modify-write.' },
    ],
    hintsJson: [
      'WATCH marks keys; if they change before EXEC, the transaction is cancelled.',
      'Pattern: WATCH key, GET key, decide, MULTI, queue the write, EXEC.',
      'A successful EXEC returns the results array; an aborted one returns (nil).',
      'On (nil), loop back and retry the whole read-modify-write.',
    ],
    starter: `SET stock 10
WATCH stock
GET stock
MULTI
DECRBY stock 3
EXEC
GET stock
UNWATCH
WATCH stock
GET stock
MULTI
DECRBY stock 2
EXEC
GET stock
WATCH stock
UNWATCH
INCR stock
GET stock
WATCH stock
MULTI
INCRBY stock 10
DECR stock
EXEC
GET stock
UNWATCH`,
    solution: `SET stock 10
WATCH stock
GET stock
MULTI
DECRBY stock 3
EXEC
GET stock
UNWATCH
WATCH stock
GET stock
MULTI
DECRBY stock 2
EXEC
GET stock
WATCH stock
UNWATCH
INCR stock
GET stock
WATCH stock
MULTI
INCRBY stock 10
DECR stock
EXEC
GET stock
UNWATCH`,
    solutionExplanationHtml: `<p><code>WATCH</code> turns <code>MULTI</code>/<code>EXEC</code> into an optimistic check-and-set. After <code>WATCH stock</code>, Redis monitors that key; you then read it, compute your change in the client, and enter <code>MULTI</code>/<code>EXEC</code>. At <code>EXEC</code>, Redis checks whether any watched key was modified since the <code>WATCH</code> — if not, the queued commands run and <code>EXEC</code> returns their results (here <code>[7]</code>); if a watched key <em>did</em> change, the whole transaction is discarded and <code>EXEC</code> returns <code>(nil)</code>, signalling that your read was stale and you should retry. In this single-client run nothing else touches <code>stock</code>, so the commit succeeds and the stock becomes <code>"7"</code>.</p>
<p>This is optimistic concurrency: instead of locking the key for the duration (pessimistic), you proceed hopefully and detect conflicts at commit time, which scales better when contention is low. The correct usage is always a retry loop — <code>WATCH</code>, read, <code>MULTI</code>, <code>EXEC</code>, and if <code>EXEC</code> is <code>(nil)</code>, start over — because a conflict is a normal outcome, not an error. Two caveats: <code>WATCH</code> must come <em>before</em> you read the value you are protecting, or you are not guarding the right snapshot; and <code>EXEC</code> (and <code>DISCARD</code>) clear all watches, while <code>UNWATCH</code> clears them without executing. For a simple conditional update, a Lua CAS script (earlier in this module) is usually preferable — it is one round trip and cannot be interrupted — but <code>WATCH</code> shines when the "compute" step is complex client-side logic that would be awkward to express in Lua.</p>`,
  },
  {
    title: 'Build an Atomic Rate Limiter in One Script',
    difficulty: 'HARD', estimatedMinutes: 45, points: 25,
    concepts: ['rate limiter in Lua', 'atomic INCR plus EXPIRE', 'fixed window', 'no race window', 'production pattern'],
    prerequisites: ['EVAL', 'INCR', 'EXPIRE', 'Lua branching'],
    tags: ['scripting', 'lua', 'rate-limiting', 'atomic', 'redis'],
    problemHtml: `<p>The fixed-window rate limiter you can build from <code>INCR</code> + <code>EXPIRE</code> has a subtle gap: those are two commands, and a crash between them can leave a counter with no expiry. A Lua script closes the gap by doing the increment <em>and</em> the conditional expiry as one atomic operation.</p>
<p>Write a script that, for a rate key, increments it and — only when the count is <code>1</code> (the first request of a window) — sets the window TTL, returning the current count. Simulate a limit of <strong>5 per 60 seconds</strong>:</p>
<ul>
<li>The script body: <code>local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c</code>.</li>
<li>Run it 6 times on a fresh <code>rl:user:1</code> with window <code>60</code>: returns <code>1, 2, 3, 4, 5, 6</code>. The caller treats any return greater than 5 as "rejected".</li>
<li><code>TTL rl:user:1</code> is about <code>60</code> — set once, on the first request.</li>
</ul>
<p>The whole increment-and-set-window is atomic, so it is crash-safe. The scaffold lists the calls.</p>`,
    inputSpec: 'A clean Redis database; rl:user:1 does not exist. Window 60s, limit 5.',
    outputSpec: 'Six script calls return 1..6; TTL rl:user:1 stays ~60 (set only on the first call). Counts above 5 mean the request is rejected by the caller.',
    constraints: 'Do the INCR and the conditional EXPIRE in ONE Lua script (atomic), not two separate commands. EXPIRE only when the count is 1. Return the count for the caller to compare to the limit.',
    examplesJson: [
      { input: 'first script call on a fresh key, window 60', output: '(integer) 1, and TTL becomes ~60', explanation: 'The count is 1, so the script also sets the 60-second window; the value 1 is under the limit.' },
      { input: 'the 6th call', output: '(integer) 6', explanation: 'The count exceeds the limit of 5, so the caller rejects the request; the window TTL is untouched.' },
    ],
    hintsJson: [
      'The INCR and the EXPIRE must be one atomic step — put them in a single script.',
      'local c = redis.call(\'incr\', KEYS[1]) gets the count.',
      'Only when c == 1 (the first request), redis.call(\'expire\', KEYS[1], ARGV[1]) sets the window.',
      'Return c; the caller compares it to the limit and rejects when it exceeds.',
    ],
    starter: `EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
TTL rl:user:1`,
    solution: `EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
EVAL "local c = redis.call('incr', KEYS[1]); if c == 1 then redis.call('expire', KEYS[1], ARGV[1]) end; return c" 1 rl:user:1 60
TTL rl:user:1`,
    solutionExplanationHtml: `<p>This is the fixed-window rate limiter promoted to a single atomic operation. The script increments the per-user counter, captures the new count in <code>c</code>, and — only when <code>c == 1</code>, the first request of a fresh window — sets the window TTL with <code>EXPIRE</code>; it then returns the count for the caller to compare against the limit (rejecting anything above 5). Running it six times returns 1 through 6, and the TTL is set exactly once, staying near 60 for the whole window.</p>
<p>Doing it in Lua fixes the flaw of the two-command version. With a plain <code>INCR</code> followed by a separate <code>EXPIRE</code>, a crash or a network failure between the two can leave the counter with no expiry — a key that never resets, silently turning the rate limit into a permanent block for that user. The script makes the increment and the conditional expiry one indivisible unit, so either both happen or neither does; the window can never be orphaned. The rule to apply the <code>EXPIRE</code> only on the first request (<code>c == 1</code>) is still essential: resetting the TTL on every request would slide the window forward indefinitely for an active user, and the window would never close. Two production refinements build on this exact skeleton: caching the script via <code>EVALSHA</code> so each check is a 40-byte call, and returning richer data (remaining quota, seconds-to-reset) as a Lua table so the client can set standard rate-limit response headers. The fixed window still allows bursts at the boundary, which sliding-window or token-bucket scripts refine — but the atomic increment-and-window here is the correct, crash-safe foundation.</p>`,
    diagramMermaid: `flowchart TD
  A[EVAL rate script] --> B[INCR count]
  B --> C{count equals 1}
  C -- yes --> D[EXPIRE window]
  C -- no --> E[leave TTL]
  D --> F[return count]
  E --> F
  F --> G{count over limit}
  G -- no --> H[allow]
  G -- yes --> I[reject]`,
  },
  {
    title: 'Build a Reliable Work Queue with LMOVE',
    difficulty: 'HARD', estimatedMinutes: 50, points: 30,
    concepts: ['reliable queue', 'LMOVE', 'processing list', 'at-least-once delivery', 'crash recovery'],
    prerequisites: ['lists', 'LPUSH RPUSH', 'atomic operations'],
    tags: ['patterns', 'queue', 'lmove', 'reliability', 'redis'],
    problemHtml: `<p>A naive queue pops a task with <code>LPOP</code> and processes it — but if the worker crashes after popping and before finishing, the task is lost. The <strong>reliable queue</strong> pattern uses <code>LMOVE</code> to atomically move a task from the pending list to a per-worker <em>processing</em> list, so an in-flight task is never lost: after a crash it is still in the processing list and can be recovered.</p>
<p>Simulate the pattern with <code>redis-cli</code>:</p>
<ul>
<li>Producer enqueues three tasks: <code>RPUSH queue task1 task2 task3</code> (returns <code>3</code>).</li>
<li>Worker atomically claims one: <code>LMOVE queue processing LEFT RIGHT</code> &rarr; returns <code>"task1"</code> and moves it to <code>processing</code>. <code>LRANGE processing 0 -1</code> shows <code>task1</code> is now in flight.</li>
<li>Worker finishes task1 and acknowledges by removing it: <code>LREM processing 1 task1</code> (returns <code>1</code>).</li>
<li>Claim the next: <code>LMOVE queue processing LEFT RIGHT</code> &rarr; <code>"task2"</code>. Leave it in <code>processing</code> to simulate a crash: <code>LRANGE processing 0 -1</code> shows <code>task2</code> — recoverable.</li>
<li>Check remaining pending: <code>LRANGE queue 0 -1</code> shows only <code>task3</code>.</li>
</ul>
<p>The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database. Producer pushes three tasks; a worker claims and processes them.',
    outputSpec: 'RPUSH returns 3; LMOVE returns "task1" (then "task2"); after ack, processing holds only the in-flight task2; queue holds only task3.',
    constraints: 'Use LMOVE (atomic pop-and-push) to claim tasks into a processing list. Acknowledge by LREM from processing. Do not use a plain LPOP that would lose an in-flight task on crash.',
    examplesJson: [
      { input: 'LMOVE queue processing LEFT RIGHT (queue has task1,task2,task3)', output: '"task1", now in processing', explanation: 'LMOVE atomically removes task1 from the head of queue and appends it to processing.' },
      { input: 'after claiming task2 and NOT acking (simulated crash)', output: 'LRANGE processing shows task2', explanation: 'The in-flight task remains in the processing list, so it is recoverable rather than lost.' },
    ],
    hintsJson: [
      'A plain LPOP loses a task if the worker dies mid-processing; move it to a processing list instead.',
      'LMOVE source dest LEFT RIGHT atomically pops from source head and pushes to dest tail, returning the value.',
      'Acknowledge a finished task with LREM processing 1 value.',
      'A task left in processing after a crash can be requeued by a recovery process.',
    ],
    starter: `RPUSH queue task1 task2 task3
LMOVE queue processing LEFT RIGHT
LRANGE processing 0 -1
LREM processing 1 task1
LMOVE queue processing LEFT RIGHT
LRANGE processing 0 -1
LRANGE queue 0 -1
LLEN queue
LLEN processing
LREM processing 1 task2
LMOVE queue processing LEFT RIGHT
LRANGE processing 0 -1
LRANGE queue 0 -1`,
    solution: `RPUSH queue task1 task2 task3
LMOVE queue processing LEFT RIGHT
LRANGE processing 0 -1
LREM processing 1 task1
LMOVE queue processing LEFT RIGHT
LRANGE processing 0 -1
LRANGE queue 0 -1
LLEN queue
LLEN processing
LREM processing 1 task2
LMOVE queue processing LEFT RIGHT
LRANGE processing 0 -1
LRANGE queue 0 -1`,
    solutionExplanationHtml: `<p>The reliability comes from never having a task exist <em>nowhere</em>. <code>LMOVE queue processing LEFT RIGHT</code> is a single atomic command that pops from the head of <code>queue</code> and pushes to the tail of <code>processing</code>, returning the task — so at every instant the task is either in <code>queue</code> (pending) or in <code>processing</code> (in flight), never in a gap between two commands where a crash would drop it. The worker processes the task, then acknowledges completion by removing it from <code>processing</code> with <code>LREM</code>. If the worker crashes after claiming but before acknowledging — simulated here by leaving <code>task2</code> in <code>processing</code> — the task is still there, so a recovery process can move it back to <code>queue</code> and it is retried. That is at-least-once delivery.</p>
<p>Contrast the naive <code>LPOP</code>: it removes the task and returns it in one step, but the moment the worker holds the value in memory and dies, the task is gone from Redis entirely and lost. <code>LMOVE</code> (which superseded the older <code>RPOPLPUSH</code>) closes that hole with its atomic move to a durable holding list. The full production pattern adds two things this simulation omits: a blocking claim with <code>BLMOVE</code> so workers wait efficiently for new tasks instead of polling, and a reaper that periodically scans each <code>processing</code> list for tasks older than a timeout and requeues them (often keyed with a claim timestamp). The trade-off is at-least-once semantics — a task may be processed twice if a worker finishes but crashes before acknowledging — so task handlers should be idempotent. For richer needs (consumer groups, acknowledgements, and delivery tracking built in), Redis Streams provide this pattern natively, but the list-based reliable queue remains a clear, dependency-free foundation.</p>`,
    diagramMermaid: `sequenceDiagram
  participant P as Producer
  participant Q as queue
  participant W as Worker
  participant PR as processing
  P->>Q: RPUSH task1 task2 task3
  W->>Q: LMOVE to processing
  Q->>PR: task1 in flight
  W->>PR: LREM ack task1`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });
const clean = exercises.map((e) => ({
  title: e.title, difficulty: e.difficulty, estimatedMinutes: e.estimatedMinutes, points: e.points,
  concepts: e.concepts, prerequisites: e.prerequisites, tags: e.tags,
  problemHtml: e.problemHtml, inputSpec: e.inputSpec, outputSpec: e.outputSpec, constraints: e.constraints,
  examplesJson: e.examplesJson, hintsJson: e.hintsJson,
  starterCodeJson: [{ name: 'commands.redis', language: L, code: e.starter }],
  solutionCodeJson: [{ name: 'commands.redis', language: L, code: e.solution }],
  solutionExplanationHtml: e.solutionExplanationHtml,
  ...(e.diagramMermaid ? { diagramMermaid: e.diagramMermaid } : {}),
}));
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));

let cmds = '';
exercises.forEach((e, i) => { cmds += `ECHO "===== EX ${i + 1}: ${e.title.replace(/"/g, '')} ====="\nFLUSHALL\nSCRIPT FLUSH\n` + e.solution + '\n'; });
fs.writeFileSync(path.join(VERIFY, `redis-429.txt`), cmds);

const parsed = JSON.parse(fs.readFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), 'utf8'));
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
if (parsed.exercises.length !== 10) throw new Error('need 10');
parsed.exercises.forEach((e, i) => {
  if (e.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} ${e.difficulty}`);
  if (e.problemHtml.length < 900) throw new Error(`problemHtml<900 ${e.title} (${e.problemHtml.length})`);
  if (e.solutionExplanationHtml.length < 500) throw new Error(`expl<500 ${e.title}`);
  if (e.hintsJson.length < 4) throw new Error(`<4 hints ${e.title}`);
  if (e.examplesJson.length < 2) throw new Error(`<2 ex ${e.title}`);
  const sl = e.solutionCodeJson.map((f) => f.code).join('').length;
  if (sl < 205) throw new Error(`sol<205 ${e.title} (${sl})`);
});
console.log(`OK ${parsed.exercises.length} -> ${trackSlug}__${moduleSlug}.json`);
