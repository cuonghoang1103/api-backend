// Generator for Redis module 426 (redis-persistence-and-backup) — 10 exercises.
// Track language is "text"; solutions are pure redis-cli command sequences (NO comment lines,
// because redis-cli pipe mode executes every line and `#` is not a comment there).
// Documented outputs use the decorated --no-raw format a learner actually sees.
// The verify script is derived from solutionCodeJson so what runs IS what ships. The harness adds
// a stock-defaults prologue, FLUSHALL + ECHO between exercises, and a 1s BLPOP pause so background
// children (BGSAVE / BGREWRITEAOF) are reaped by serverCron before the next exercise runs.
// Run:  docker exec -i cl_redis redis-cli --no-raw < docs/codelab-authoring/verify/redis-426.txt
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'redis';
const moduleSlug = 'redis-persistence-and-backup';
const L = 'text';

const DEFAULT_SAVE = '3600 1 300 100 60 10000';

const exercises = [
  {
    title: 'Discover What a Fresh Redis Server Persists by Default',
    difficulty: 'EASY',
    estimatedMinutes: 15,
    points: 10,
    concepts: ['CONFIG GET', 'save directives', 'dir and dbfilename', 'LASTSAVE', 'appendonly'],
    prerequisites: ['redis-cli basics', 'SET', 'DBSIZE'],
    tags: ['persistence', 'config', 'rdb', 'lastsave', 'redis'],
    problemHtml: `<p>Everything the previous four modules built — strings, hashes, lists, sets, TTLs — lived in RAM. RAM is why Redis answers in microseconds, and it is also why a power cut, an OOM kill, or a <code>docker restart</code> can wipe the entire dataset in an instant. Persistence is the machinery that writes memory to disk so a restarted server can come back with its data. Before you configure any of it, you have to know what your server is <strong>already</strong> doing, because a stock Redis is not unconfigured: it ships with snapshotting on and the append-only log off, and most people never find out until the day they need the file.</p>
<p>Using <code>redis-cli</code>, interrogate the running server:</p>
<ul>
<li>Check the current key count with <code>DBSIZE</code>.</li>
<li>Read the two settings that decide <strong>where the snapshot file lands</strong>: <code>CONFIG GET dir</code> (the working directory, <code>/data</code> in the official image) and <code>CONFIG GET dbfilename</code> (<code>dump.rdb</code>). Together they give the full path <code>/data/dump.rdb</code>.</li>
<li>Read <code>CONFIG GET save</code>. The default value is the string <code>3600 1 300 100 60 10000</code> — three <em>seconds threshold</em> pairs meaning "snapshot after 3600s if at least 1 key changed, after 300s if at least 100 changed, after 60s if at least 10000 changed".</li>
<li>Read <code>CONFIG GET appendonly</code> and confirm it is <code>no</code> — the append-only file is <strong>off</strong> by default, so RDB snapshots are the only durability you have. Read <code>CONFIG GET appendfsync</code> too: it already holds <code>everysec</code>, the policy that would apply <em>if</em> the log were switched on.</li>
<li>Read <code>CONFIG GET stop-writes-on-bgsave-error</code>, which is <code>yes</code>. That default means a server whose snapshots keep failing will eventually start <strong>rejecting writes</strong> rather than pretend all is well — a behaviour that surprises people during their first disk-full incident.</li>
<li>Read <code>LASTSAVE</code>, the Unix timestamp of the last successful snapshot.</li>
<li>Write two keys with <code>SET</code>, confirm <code>DBSIZE</code> grew to <code>2</code>, read back <code>GET cache:homepage</code>, then read <code>LASTSAVE</code> again. It is <strong>unchanged</strong>: an accepted write lives only in memory until a save point fires, so those two keys are currently one crash away from gone.</li>
</ul>
<p>The scaffold lists the commands with the configuration parameter names left blank.</p>`,
    inputSpec: 'A running Redis 7 server at stock configuration and a redis-cli session. The "input" is the command sequence itself.',
    outputSpec: 'DBSIZE returns (integer) 0 on an empty database. CONFIG GET dir returns "dir" then "/data"; CONFIG GET dbfilename returns "dbfilename" then "dump.rdb"; CONFIG GET save returns "save" then "3600 1 300 100 60 10000"; CONFIG GET appendonly returns "appendonly" then "no"; CONFIG GET appendfsync returns "everysec"; CONFIG GET stop-writes-on-bgsave-error returns "yes". LASTSAVE returns an integer Unix timestamp. Both SET calls return OK, the second DBSIZE returns (integer) 2, GET cache:homepage returns "rendered-html", and the final LASTSAVE returns exactly the same timestamp as the first — writing keys does not save anything to disk.',
    constraints: 'Read-only inspection plus two SET calls. Do not run SAVE, BGSAVE, or any CONFIG SET in this exercise — the point is to observe the stock configuration, not to change it. Do not assume dir is /data on your own machine; read it.',
    examplesJson: [
      {
        input: 'CONFIG GET dir then CONFIG GET dbfilename',
        output: '1) "dir"\n2) "/data"\n1) "dbfilename"\n2) "dump.rdb"',
        explanation: 'CONFIG GET always replies with a flat array of name/value pairs, so the parameter name is echoed back before its value. Joining the two gives the snapshot path /data/dump.rdb.',
      },
      {
        input: 'CONFIG GET save then CONFIG GET appendonly',
        output: '1) "save"\n2) "3600 1 300 100 60 10000"\n1) "appendonly"\n2) "no"',
        explanation: 'The default save policy is three seconds/changes pairs, and the append-only log is disabled, so a stock server relies entirely on periodic RDB snapshots.',
      },
      {
        input: 'LASTSAVE then SET cache:homepage "rendered-html" then SET session:1001 "user=ann" then GET cache:homepage then LASTSAVE',
        output: '(integer) 1784511344\nOK\nOK\n"rendered-html"\n(integer) 1784511344',
        explanation: 'The timestamp is identical before and after the writes: Redis acknowledged both SETs from memory without touching dump.rdb. Your own timestamp will be a different number, but the two readings must match.',
      },
    ],
    hintsJson: [
      'Every persistence setting is just a normal configuration parameter, so one command family answers all of these questions.',
      'CONFIG GET parameter returns a two-element array: the parameter name, then its current value.',
      'The snapshot path is built from two separate parameters, dir and dbfilename; the snapshot schedule is the single parameter named save; the append-only log is the parameter named appendonly.',
      'LASTSAVE returns the Unix time of the last successful save. Read it, write your keys, and read it again — if it did not move, nothing reached the disk.',
    ],
    starter: `DBSIZE
CONFIG GET ____
CONFIG GET ____
CONFIG GET ____
CONFIG GET ____
CONFIG GET ____
CONFIG GET stop-writes-on-bgsave-error
LASTSAVE
SET cache:homepage "rendered-html"
SET session:1001 "user=ann"
DBSIZE
GET cache:homepage
LASTSAVE`,
    solution: `DBSIZE
CONFIG GET dir
CONFIG GET dbfilename
CONFIG GET save
CONFIG GET appendonly
CONFIG GET appendfsync
CONFIG GET stop-writes-on-bgsave-error
LASTSAVE
SET cache:homepage "rendered-html"
SET session:1001 "user=ann"
DBSIZE
GET cache:homepage
LASTSAVE`,
    solutionExplanationHtml: `<p>Redis is an in-memory database with <em>optional</em> disk persistence bolted on, and this exercise makes the "optional" concrete. <code>CONFIG GET</code> is the universal reader for the running configuration — it takes a parameter name (globs are allowed, so <code>CONFIG GET *append*</code> lists every AOF setting) and replies with a flat array of name/value pairs, which is why every answer prints two lines. The four parameters read here are the whole default persistence story: <strong>dir</strong> plus <strong>dbfilename</strong> locate the snapshot at <code>/data/dump.rdb</code>, <strong>save</strong> schedules when a snapshot is taken automatically, and <strong>appendonly</strong> being <code>no</code> means there is no second, finer-grained log behind it.</p>
<p>Read the <code>save</code> value carefully, because it is the single most important number in your durability budget. <code>3600 1</code> means an hour may pass before a lightly-written database is snapshotted at all; <code>300 100</code> and <code>60 10000</code> tighten that as write volume rises. The rule to internalise: <strong>a save point is a promise about how much you are willing to lose</strong>, not about how fresh the file is. Between two snapshots, every accepted write exists only in RAM, which the final <code>LASTSAVE</code> proves — the timestamp does not budge after two successful <code>SET</code>s, because Redis replied <code>OK</code> from memory and scheduled nothing.</p>
<p>The habit worth taking from this is to never trust a remembered configuration. A server may have been started with a <code>redis.conf</code>, with command-line flags, or mutated at runtime by a previous <code>CONFIG SET</code>, and only <code>CONFIG GET</code> tells you what is true right now. That matters most in containers: the official image runs <code>redis-server</code> with no config file at all, so <code>/data</code> must be a mounted volume or the snapshot you are relying on disappears with the container. Everything later in this module — forcing a save, turning on the AOF, tuning fsync, backing the files up — is a modification of the four values you just read.</p>`,
    diagramMermaid: `flowchart TD
  A[Client SET command] --> B[Redis memory dataset]
  B --> C[Reply OK immediately]
  B --> D[Save point fires from save directives]
  D --> E[Snapshot file dir plus dbfilename]
  E --> F[Restart reloads dump.rdb]
  B --> G[Crash before save point loses writes since LASTSAVE]`,
  },

  {
    title: 'Force a Synchronous Snapshot with SAVE and Age It with LASTSAVE and TIME',
    difficulty: 'EASY',
    estimatedMinutes: 20,
    points: 10,
    concepts: ['SAVE', 'LASTSAVE', 'TIME', 'snapshot age', 'blocking commands'],
    prerequisites: ['CONFIG GET', 'DBSIZE', 'MSET'],
    tags: ['persistence', 'rdb', 'save', 'lastsave', 'redis'],
    problemHtml: `<p>Waiting for a save point is fine for a background process and useless for an operator who is about to restart a server on purpose. <code>SAVE</code> writes the whole dataset to <code>dump.rdb</code> immediately and does not return until the file is on disk — which is exactly why it is dangerous in production: Redis is single-threaded, so a <code>SAVE</code> on a 20 GB dataset blocks <strong>every other client</strong> for as long as the write takes. On a small maintenance database it is the simplest possible durability button, and it is the right way to learn what a snapshot is before adding the background variant.</p>
<p><code>LASTSAVE</code> tells you when the last snapshot succeeded, but a raw Unix timestamp means nothing on its own. Pair it with <code>TIME</code>, which returns the server's current clock as two elements — seconds and microseconds — and the subtraction gives you the one number that matters: <strong>how old your on-disk copy is</strong>.</p>
<p>Using <code>redis-cli</code>:</p>
<ul>
<li>Confirm the database is empty with <code>DBSIZE</code>, then load three orders in one <code>MSET</code>: <code>order:1</code>=<code>"pending"</code>, <code>order:2</code>=<code>"paid"</code>, <code>order:3</code>=<code>"shipped"</code>. <code>DBSIZE</code> is now <code>3</code>.</li>
<li>Record the snapshot age <em>before</em> saving: run <code>LASTSAVE</code>, then <code>TIME</code>, and note the gap between them.</li>
<li>Run <code>SAVE</code>. It replies <code>OK</code> only after <code>dump.rdb</code> has been rewritten.</li>
<li>Run <code>LASTSAVE</code> and <code>TIME</code> again. The two values are now the same second (or one apart): the snapshot is fresh.</li>
<li>Write a fourth key, <code>order:4</code>=<code>"cancelled"</code>, check <code>DBSIZE</code> is <code>4</code>, and read <code>LASTSAVE</code> once more. It has <strong>not</strong> moved — the file on disk still contains three orders, and the fourth exists only in RAM.</li>
<li>Close that gap: run <code>SAVE</code> again, read <code>LASTSAVE</code> and <code>TIME</code>, then confirm the protected dataset with <code>MGET order:1 order:2 order:3 order:4</code> and a final <code>DBSIZE</code>.</li>
</ul>
<p>The scaffold gives the command skeleton with the save command and the timestamp reads left blank.</p>`,
    inputSpec: 'A running Redis 7 server with an empty keyspace. Four string keys are written from redis-cli.',
    outputSpec: 'The first DBSIZE returns (integer) 0; MSET returns OK; DBSIZE returns (integer) 3. The first LASTSAVE returns an older Unix timestamp and TIME returns a two-element array of seconds and microseconds. SAVE returns OK. The second LASTSAVE now equals the second returned by the following TIME, give or take one second. SET order:4 returns OK, DBSIZE returns (integer) 4, and the following LASTSAVE returns exactly the same timestamp as the post-SAVE reading. The second SAVE returns OK, after which LASTSAVE is equal to or greater than the previous reading (equal if both saves landed in the same clock second), MGET returns "pending", "paid", "shipped", "cancelled" and the final DBSIZE returns (integer) 4.',
    constraints: 'Use SAVE, not BGSAVE, in this exercise. Do not change any configuration. Do not compute the snapshot age from your laptop clock — use the server clock returned by TIME, because the server may be in a different timezone or drift from your machine.',
    examplesJson: [
      {
        input: 'MSET order:1 "pending" order:2 "paid" order:3 "shipped" then DBSIZE',
        output: 'OK\n(integer) 3',
        explanation: 'One MSET writes all three keys in memory; DBSIZE counts keys in the current database, not bytes on disk.',
      },
      {
        input: 'LASTSAVE then TIME then SAVE then LASTSAVE then TIME',
        output: '(integer) 1784511344\n1) "1784511474"\n2) "41394"\nOK\n(integer) 1784511474\n1) "1784511474"\n2) "42857"',
        explanation: 'Before SAVE the snapshot was 130 seconds old. SAVE blocks until the file is written and returns OK, after which LASTSAVE matches the current second reported by TIME. Your timestamps will differ; the relationship between them is what must hold.',
      },
      {
        input: 'SET order:4 "cancelled" then DBSIZE then LASTSAVE then SAVE then MGET order:1 order:2 order:3 order:4',
        output: 'OK\n(integer) 4\n(integer) 1784511474\nOK\n1) "pending"\n2) "paid"\n3) "shipped"\n4) "cancelled"',
        explanation: 'Memory holds four orders while dump.rdb still holds three, and LASTSAVE has not advanced — that gap is precisely what a crash would destroy. The second SAVE closes it, and MGET confirms what the file now contains.',
      },
    ],
    hintsJson: [
      'One command writes the snapshot right now instead of waiting for a save point.',
      'SAVE is synchronous: it returns OK only when dump.rdb has been fully written, and it blocks every other client meanwhile.',
      'LASTSAVE gives the Unix time of the last successful save; TIME gives the server clock as a two-element array of seconds and microseconds.',
      'Snapshot age is TIME seconds minus LASTSAVE. Read LASTSAVE again after writing another key: if it did not change, that key is not in the file.',
    ],
    starter: `DBSIZE
MSET order:1 "pending" order:2 "paid" order:3 "shipped"
DBSIZE
____
TIME
____
LASTSAVE
TIME
SET order:4 "cancelled"
DBSIZE
____
SAVE
LASTSAVE
TIME
MGET order:1 order:2 order:3 order:4
DBSIZE`,
    solution: `DBSIZE
MSET order:1 "pending" order:2 "paid" order:3 "shipped"
DBSIZE
LASTSAVE
TIME
SAVE
LASTSAVE
TIME
SET order:4 "cancelled"
DBSIZE
LASTSAVE
SAVE
LASTSAVE
TIME
MGET order:1 order:2 order:3 order:4
DBSIZE`,
    solutionExplanationHtml: `<p><code>SAVE</code> serialises the entire dataset into <code>dir/dbfilename</code> and only then replies <code>OK</code>. Because Redis executes commands on a single thread, that reply is a guarantee <em>and</em> a warning: nothing else ran while the file was being written. On the few megabytes here it is instantaneous; on a production instance holding tens of gigabytes it is a multi-second freeze in which every client times out, which is why the next exercise replaces it with <code>BGSAVE</code> and why the only sane uses of <code>SAVE</code> are a controlled shutdown, a maintenance window, or a lab.</p>
<p>The <code>LASTSAVE</code> and <code>TIME</code> pairing is the operational skill here. A monitoring check that alerts on "snapshot older than N seconds" is written exactly like this — subtract <code>LASTSAVE</code> from the first element of <code>TIME</code> — and it is far more useful than checking that the process is alive, because a Redis whose forks keep failing stays up while silently persisting nothing. Note the granularity trap: both are Unix <strong>seconds</strong>, so if you run <code>LASTSAVE</code>, <code>SAVE</code>, and <code>LASTSAVE</code> fast enough, the before and after values can be identical even though the save really happened. Never use "the timestamp changed" as your proof that a save occurred; use the <code>OK</code> reply, and for background saves use the status field covered in the next exercise.</p>
<p>The last three commands are the point of the whole module. <code>SET order:4 "cancelled"</code> returns <code>OK</code>, <code>DBSIZE</code> says <code>4</code>, and <code>LASTSAVE</code> is unchanged — memory and disk have diverged, and they will keep diverging until the next save point or explicit save. That divergence is not a bug to be eliminated; it is a dial. Snapshot more often and you lose less on a crash but pay more CPU, more fork copy-on-write memory, and more I/O. Snapshot less often and you pay almost nothing until the day you lose an hour of writes. Choosing where to sit on that dial per workload is what this module builds toward.</p>`,
  },

  {
    title: 'Fork a Non-Blocking Snapshot with BGSAVE and Confirm It Succeeded',
    difficulty: 'MEDIUM',
    estimatedMinutes: 25,
    points: 15,
    concepts: ['BGSAVE', 'fork and copy-on-write', 'INFO persistence', 'rdb_last_bgsave_status', 'rdb_saves'],
    prerequisites: ['SAVE', 'LASTSAVE', 'CONFIG GET'],
    tags: ['persistence', 'rdb', 'bgsave', 'info', 'redis'],
    problemHtml: `<p><code>SAVE</code> freezes the server; <code>BGSAVE</code> does not. It <strong>forks a child process</strong> that inherits a copy-on-write view of memory and writes the snapshot from there while the parent keeps serving traffic. This is the mechanism behind every automatic save point, and it has a cost worth knowing: pages the parent modifies during the save are duplicated, so a write-heavy instance can transiently need well above its normal memory footprint. Because the reply comes back before the file exists, <code>BGSAVE</code> also changes how you confirm success — <code>OK</code> no longer means "saved".</p>
<p>The answer lives in <code>INFO persistence</code>, the section every Redis operator should be able to read from memory. Using <code>redis-cli</code>:</p>
<ul>
<li>Check <code>DBSIZE</code>, load three users with one <code>MSET</code> (<code>user:1</code>=<code>"ann"</code>, <code>user:2</code>=<code>"bob"</code>, <code>user:3</code>=<code>"cara"</code>), and confirm <code>DBSIZE</code> is <code>3</code>.</li>
<li>Read <code>LASTSAVE</code>, then read two settings that shape the file itself: <code>CONFIG GET rdbcompression</code> and <code>CONFIG GET rdbchecksum</code>, both <code>yes</code> by default — the snapshot is LZF-compressed and carries a CRC64 so a corrupted file is detected at load rather than half-loaded.</li>
<li>Run <code>BGSAVE</code>. Its reply is the status line <code>Background saving started</code>, not <code>OK</code> — the fork has been created, nothing is on disk yet.</li>
<li>Run <code>INFO persistence</code> immediately and locate four fields by name: <code>rdb_bgsave_in_progress</code> (<code>1</code> while the child is alive), <code>rdb_last_bgsave_status</code> (must read <code>ok</code>), <code>rdb_last_bgsave_time_sec</code> (how long the previous background save took), and <code>rdb_saves</code> (a lifetime counter of successful saves).</li>
<li>Pause one second with <code>BLPOP rdb:wait 1</code>. Nothing ever pushes to <code>rdb:wait</code>, so the command simply blocks for its timeout and returns <code>(nil)</code> — a portable one-second sleep from <code>redis-cli</code>, and long enough for Redis to reap the finished child on its next cron tick.</li>
<li>Run <code>INFO persistence</code> again: <code>rdb_bgsave_in_progress</code> is now <code>0</code> and <code>rdb_changes_since_last_save</code> has fallen to <code>0</code>, because the completed save cleared it. Note that <code>rdb_saves</code> is the <strong>same</strong> in both readings — Redis increments it when the save is <em>initiated</em>, not when the child finishes, so it counts saves attempted and only <code>rdb_last_bgsave_status</code> tells you they worked. Read <code>LASTSAVE</code> again: it has advanced to the completion time of the background save.</li>
<li>Finish with <code>DBSIZE</code> and <code>GET user:2</code> to prove the server stayed fully usable throughout.</li>
</ul>
<p>Never pin an alert on the in-progress flag, which is a liveness signal that flips within milliseconds; pin it on <code>rdb_last_bgsave_status</code>. The scaffold leaves the save command, the pause and the INFO section blank.</p>`,
    inputSpec: 'A running Redis 7 server with an empty keyspace. Three string keys are written, then a background snapshot is requested.',
    outputSpec: 'The first DBSIZE returns (integer) 0, MSET returns OK, DBSIZE returns (integer) 3. LASTSAVE returns a Unix timestamp. CONFIG GET rdbcompression and CONFIG GET rdbchecksum both return "yes". BGSAVE replies with the simple status string Background saving started. The first INFO persistence prints the section starting with # Persistence; in it rdb_bgsave_in_progress reads 1, rdb_last_bgsave_status reads ok, and aof_enabled reads 0 because the AOF is still off. BLPOP rdb:wait 1 returns (nil) after about a second (redis-cli also prints the elapsed time in parentheses). In the second INFO persistence rdb_bgsave_in_progress reads 0, rdb_changes_since_last_save reads 0, and rdb_saves is unchanged from the first reading because it counts saves started rather than saves finished; its absolute value is environment-specific. The second LASTSAVE is greater than or equal to the first. The final DBSIZE returns (integer) 3, GET user:2 returns "bob", and MGET user:1 user:3 returns "ann" and "cara".',
    constraints: 'Use BGSAVE, not SAVE. Do not issue a second BGSAVE while one is in progress — Redis rejects it with (error) ERR Background save already in progress, which is exactly why the one-second pause is there. Do not assert an exact value for rdb_saves or rdb_last_save_time; those depend on the server history. Judge success by rdb_last_bgsave_status, never by the BGSAVE reply alone.',
    examplesJson: [
      {
        input: 'MSET user:1 "ann" user:2 "bob" user:3 "cara" then BGSAVE',
        output: 'OK\nBackground saving started',
        explanation: 'BGSAVE returns a status string as soon as the fork succeeds. The snapshot is being written by a child process; the parent has already moved on to the next command.',
      },
      {
        input: 'INFO persistence immediately after BGSAVE, reading the four RDB fields',
        output: '# Persistence\nrdb_changes_since_last_save:3\nrdb_bgsave_in_progress:1\nrdb_last_bgsave_status:ok\nrdb_saves:6',
        explanation: 'Abridged to the fields that matter. in_progress is 1 because the child has not been reaped yet; status ok describes the previous completed save; rdb_saves is a lifetime total and will differ on your server.',
      },
      {
        input: 'BLPOP rdb:wait 1 then INFO persistence again then DBSIZE then GET user:2',
        output: '(nil)\nrdb_changes_since_last_save:0\nrdb_bgsave_in_progress:0\nrdb_last_bgsave_status:ok\n(integer) 3\n"bob"',
        explanation: 'One second later the child has been reaped: the in-progress flag is clear and the dirty counter has been reset by the completed save. Reads were served normally throughout, which is the entire reason BGSAVE exists.',
      },
    ],
    hintsJson: [
      'You want the snapshot without freezing the server, so the command must hand the work to another process.',
      'BGSAVE forks a child and replies immediately with a status string rather than OK.',
      'Because the reply precedes the file, success has to be read from the INFO persistence section afterwards.',
      'The field to trust is rdb_last_bgsave_status, which reads ok or err; rdb_bgsave_in_progress only tells you whether a child is running right now, and rdb_saves counts saves started, not saves completed. To see the flag clear, wait a second — BLPOP on a key nobody pushes to, with a timeout of 1, is a sleep you can type into redis-cli.',
    ],
    starter: `DBSIZE
MSET user:1 "ann" user:2 "bob" user:3 "cara"
DBSIZE
LASTSAVE
CONFIG GET rdbcompression
CONFIG GET rdbchecksum
____
INFO ____
BLPOP rdb:wait ____
INFO ____
LASTSAVE
DBSIZE
GET user:2
MGET user:1 user:3`,
    solution: `DBSIZE
MSET user:1 "ann" user:2 "bob" user:3 "cara"
DBSIZE
LASTSAVE
CONFIG GET rdbcompression
CONFIG GET rdbchecksum
BGSAVE
INFO persistence
BLPOP rdb:wait 1
INFO persistence
LASTSAVE
DBSIZE
GET user:2
MGET user:1 user:3`,
    solutionExplanationHtml: `<p><code>BGSAVE</code> calls <code>fork()</code>. The child gets a frozen, consistent view of the dataset at the instant of the fork and serialises it to a temporary file, renaming it over <code>dump.rdb</code> only on success — so the snapshot is atomic from a reader's point of view and never half-written. The parent returns to the event loop immediately, which is why <code>DBSIZE</code> and <code>GET user:2</code> answer normally while the save is in flight. The price is <strong>copy-on-write</strong>: the two processes share physical pages until the parent writes to one, at which point the kernel duplicates it. A mostly-read instance therefore forks almost for free, while an instance rewriting its whole keyspace during the save can approach double its resident memory — the classic cause of an OOM kill that appears only under load.</p>
<p>The consequence for correctness is that <code>Background saving started</code> is an <em>acknowledgement of the fork</em>, not of the save. A fork can fail outright when <code>vm.overcommit_memory</code> is <code>0</code> and the kernel refuses the allocation, and a child can die halfway. That is what <code>rdb_last_bgsave_status</code> is for: it reads <code>ok</code> or <code>err</code>, and if it reads <code>err</code> your last automatic snapshots have been silently failing while the server happily serves traffic. Worse, with the default <code>stop-writes-on-bgsave-error yes</code>, Redis eventually starts <em>rejecting writes</em> to protect you — an outage whose root cause is invisible unless you know this field. Alert on it.</p>
<p>The other three fields complete the picture. <code>rdb_bgsave_in_progress</code> is a liveness flag, not a result, and it flips to <code>0</code> only when the parent reaps the child on a cron tick, so a fast script can observe <code>1</code> immediately after issuing the command and <code>0</code> a moment later; a second <code>BGSAVE</code> during that window is rejected with <em>Background save already in progress</em>. <code>rdb_last_bgsave_time_sec</code> is your fork-cost trend — if it climbs from milliseconds to seconds, your dataset has grown into territory where snapshot frequency needs rethinking. <code>rdb_saves</code> counts saves <em>started</em> over the lifetime of the process — it is already incremented in the first reading, which is why it does not move again after the pause, and why it is a workload signal rather than a success signal. What the one-second pause does demonstrate is the pair that actually matters: the in-progress flag back to <code>0</code> and <code>rdb_changes_since_last_save</code> reset to <code>0</code> by the completed save.</p>
<p>The two file-format settings read along the way are worth knowing before you ever inspect a snapshot by hand. <code>rdbcompression yes</code> applies LZF compression to string values, trading a little CPU in the child for a much smaller file — worth keeping on almost always, since the fork is already the expensive part. <code>rdbchecksum yes</code> appends a CRC64 to the file so that a truncated or corrupted snapshot is <em>rejected at load</em> instead of being partially applied, which is the difference between a server that refuses to start and one that starts with silently missing data. Both cost you nothing on a healthy system and save you from the worst class of failure, so treat turning them off as an optimisation of last resort.</p>`,
    diagramMermaid: `sequenceDiagram
  participant C as Client
  participant P as Redis parent process
  participant K as Kernel fork
  participant F as dump.rdb on disk
  C->>P: BGSAVE
  P->>K: fork child with copy on write memory
  P-->>C: Background saving started
  C->>P: GET user:2 served normally
  K->>F: child writes temp file then renames
  K-->>P: child exits and parent reaps on cron tick
  C->>P: INFO persistence
  P-->>C: rdb_last_bgsave_status ok`,
  },

  {
    title: 'Quantify Crash Exposure with rdb_changes_since_last_save',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['rdb_changes_since_last_save', 'CONFIG SET save', 'disabling snapshots', 'dirty counter', 'data-loss window'],
    prerequisites: ['SAVE', 'INFO persistence', 'CONFIG GET'],
    tags: ['persistence', 'rdb', 'info', 'config-set', 'redis'],
    problemHtml: `<p>"How much would we lose right now?" is the question a snapshot-only setup must be able to answer, and Redis answers it precisely. <code>rdb_changes_since_last_save</code> is the server's <em>dirty counter</em>: the number of key-space changes accepted since the last successful save. It is reset to zero by every save, incremented by every write that modifies data, and it is the exact quantity a crash would discard. It is also the counter the <code>save</code> directives compare against — <code>save 60 10000</code> literally means "when 60 seconds have passed and this counter is at least 10000, fork a BGSAVE".</p>
<p>Using <code>redis-cli</code>, watch the counter move and then remove the safety net:</p>
<ul>
<li>Run <code>SAVE</code> to establish a clean baseline, then <code>INFO persistence</code> and confirm <code>rdb_changes_since_last_save:0</code>.</li>
<li>Disable automatic snapshots entirely with <code>CONFIG SET save ""</code> — an empty string means "no save points". Confirm with <code>CONFIG GET save</code>, which now returns an empty value. This is the correct setting for a pure cache, and a footgun everywhere else.</li>
<li>Perform six modifications: <code>MSET cart:1 "2 items" cart:2 "5 items" cart:3 "1 item"</code>, then <code>SET cart:4 "3 items"</code>, then <code>INCR visits:today</code>, then <code>DEL cart:1</code>. Note that a deletion is a change too.</li>
<li>Run <code>INFO persistence</code> again: <code>rdb_changes_since_last_save</code> now reads <code>6</code>, and <code>rdb_bgsave_in_progress</code> is <code>0</code> because nothing was scheduled — with no save points, that counter will grow forever.</li>
<li>Read <code>LASTSAVE</code> and confirm it still shows the baseline save.</li>
<li>Run <code>SAVE</code> again and verify <code>INFO persistence</code> reports <code>rdb_changes_since_last_save:0</code>.</li>
<li>Restore the default schedule with <code>CONFIG SET save "3600 1 300 100 60 10000"</code> and confirm with <code>CONFIG GET save</code>. Leaving a lab server with snapshots disabled is how a colleague loses a day of work.</li>
</ul>
<p>The scaffold leaves the two <code>CONFIG SET save</code> values blank.</p>`,
    inputSpec: 'A running Redis 7 server with an empty keyspace and the default save schedule. Five keys are written and one is deleted.',
    outputSpec: 'The first SAVE returns OK and the following INFO persistence shows rdb_changes_since_last_save:0. CONFIG SET save "" returns OK and CONFIG GET save returns "save" then an empty string "". MSET returns OK, SET returns OK, INCR visits:today returns (integer) 1, DEL cart:1 returns (integer) 1. The second INFO persistence shows rdb_changes_since_last_save:6 with rdb_bgsave_in_progress:0. LASTSAVE returns the baseline timestamp unchanged. The second SAVE returns OK and the third INFO persistence shows rdb_changes_since_last_save:0. CONFIG SET save "3600 1 300 100 60 10000" returns OK and CONFIG GET save returns that string.',
    constraints: 'The dirty counter must reach exactly 6, so issue exactly the six modifications listed and no others. Do not use BGSAVE here — a background save clears the counter only when the child completes, which makes the reading racy. You must restore the default save schedule at the end; never leave a server with save "" unless it is deliberately a cache.',
    examplesJson: [
      {
        input: 'SAVE then INFO persistence, reading the dirty counter',
        output: 'OK\nrdb_changes_since_last_save:0',
        explanation: 'A successful save resets the counter, so zero means memory and dump.rdb are identical at this instant.',
      },
      {
        input: 'CONFIG SET save "" then CONFIG GET save',
        output: 'OK\n1) "save"\n2) ""',
        explanation: 'An empty save value removes every automatic save point. Redis will now never snapshot on its own; only an explicit SAVE or BGSAVE writes the file.',
      },
      {
        input: 'MSET cart:1 "2 items" cart:2 "5 items" cart:3 "1 item" then SET cart:4 "3 items" then INCR visits:today then DEL cart:1 then INFO persistence',
        output: 'OK\nOK\n(integer) 1\n(integer) 1\nrdb_changes_since_last_save:6',
        explanation: 'Three keys from the MSET, one SET, one INCR and one DEL make six key-space changes. Deletions and in-place increments count exactly like new keys — this is a change counter, not a key counter.',
      },
    ],
    hintsJson: [
      'The number you want is already in the INFO persistence section; you only have to make it move.',
      'A successful SAVE or BGSAVE resets rdb_changes_since_last_save to 0, and every write that modifies the keyspace increments it by one per key affected.',
      'CONFIG SET save "" removes all automatic save points; the parameter is a single space-separated string of seconds/changes pairs, so quote it.',
      'Count carefully: MSET with three pairs contributes 3, and DEL of an existing key contributes 1, giving 6 for the listed sequence. Restore the schedule with CONFIG SET save "3600 1 300 100 60 10000".',
    ],
    starter: `SAVE
INFO persistence
CONFIG SET save ____
CONFIG GET save
MSET cart:1 "2 items" cart:2 "5 items" cart:3 "1 item"
SET cart:4 "3 items"
INCR visits:today
DEL cart:1
INFO persistence
LASTSAVE
SAVE
INFO persistence
CONFIG SET save ____
CONFIG GET save`,
    solution: `SAVE
INFO persistence
CONFIG SET save ""
CONFIG GET save
MSET cart:1 "2 items" cart:2 "5 items" cart:3 "1 item"
SET cart:4 "3 items"
INCR visits:today
DEL cart:1
INFO persistence
LASTSAVE
SAVE
INFO persistence
CONFIG SET save "${DEFAULT_SAVE}"
CONFIG GET save`,
    solutionExplanationHtml: `<p>The dirty counter is the bridge between the abstract idea of a data-loss window and a number you can graph. Redis increments it once per modified key — three for the <code>MSET</code>, one for the <code>SET</code>, one for the <code>INCR</code>, one for the <code>DEL</code> — and resets it on every successful save. Read together with <code>LASTSAVE</code>, the two fields describe your exposure on both axes at once: <em>how long</em> since the last durable copy, and <em>how many changes</em> are riding on RAM. A monitoring rule built on both ("alert if changes exceed 50000 or the snapshot is older than 10 minutes") catches far more real incidents than either alone, because a busy instance blows the change budget long before the time budget and an idle one does the opposite.</p>
<p><code>CONFIG SET</code> is the runtime half of the configuration story that <code>CONFIG GET</code> opened. Almost every persistence parameter is mutable without a restart, and <code>save</code> takes the whole schedule as a single quoted string — <code>CONFIG SET save "900 1"</code> installs one save point, and <code>CONFIG SET save ""</code> installs none. Disabling snapshots is a legitimate, deliberate choice for a pure cache where every key can be recomputed from the source of truth and the fork cost is pure waste. It is a catastrophe for a session store. The trap this exercise walks you into on purpose is that <strong>nothing warns you</strong>: with no save points the server runs perfectly, <code>LASTSAVE</code> quietly stays where it was, and the counter climbs without limit until the process dies and takes everything with it.</p>
<p>Two details protect you from mis-reading the counter. First, <code>SAVE</code> is used here rather than <code>BGSAVE</code> precisely because it is synchronous: a background save only clears the counter when the child finishes, so an <code>INFO</code> issued immediately after <code>BGSAVE</code> can legitimately show a non-zero value that is neither stale nor wrong. Second, the counter tracks <em>key-space changes</em>, not commands and not keys currently stored — deleting is dirtying, and rewriting the same key ten times contributes ten. Finally, remember that runtime <code>CONFIG SET</code> changes live only in memory: they vanish on restart unless you either edit the config file or persist them with <code>CONFIG REWRITE</code>, which the closing exercises cover.</p>`,
  },

  {
    title: 'Enable the Append-Only File at Runtime and Read Its Multi-Part Layout',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['appendonly', 'CONFIG SET at runtime', 'appenddirname', 'multi-part AOF', 'aof_enabled'],
    prerequisites: ['CONFIG GET', 'CONFIG SET', 'INFO persistence'],
    tags: ['persistence', 'aof', 'appendonly', 'config-set', 'redis'],
    problemHtml: `<p>A snapshot is a photograph; the append-only file is a diary. Instead of periodically dumping the whole dataset, the AOF appends every write command to a log as it is executed, so recovery means replaying the log rather than loading a point-in-time image. That changes the loss window from "everything since the last snapshot" to "at most the last fraction of a second", which is why any Redis holding data you cannot regenerate should have it on. It is <strong>off by default</strong>, and — importantly — it can be switched on without restarting: Redis performs an initial rewrite to seed the log from current memory, then starts appending.</p>
<p>Redis 7 also changed the on-disk shape. Instead of one growing <code>appendonly.aof</code>, the AOF is now a <strong>multi-part</strong> set inside a directory: a <em>base</em> file holding a snapshot of the dataset at the last rewrite, one or more <em>incr</em> files holding commands appended since, and a <em>manifest</em> that lists them. That is why there are four separate parameters to read.</p>
<p>Using <code>redis-cli</code>:</p>
<ul>
<li>Confirm the starting state with <code>CONFIG GET appendonly</code> (<code>no</code>), then write two keys with <code>MSET ledger:1 "open" ledger:2 "open"</code>.</li>
<li>Turn the log on with <code>CONFIG SET appendonly yes</code> and confirm with <code>CONFIG GET appendonly</code>.</li>
<li>Read the three parameters that describe the layout: <code>CONFIG GET appendfsync</code> (<code>everysec</code>), <code>CONFIG GET appenddirname</code> (<code>appendonlydir</code>), and <code>CONFIG GET appendfilename</code> (<code>appendonly.aof</code>). Combined with <code>dir</code>, the files live in <code>/data/appendonlydir/</code> as <code>appendonly.aof.1.base.rdb</code>, <code>appendonly.aof.1.incr.aof</code>, and <code>appendonly.aof.manifest</code>.</li>
<li>Write one more key, <code>SET ledger:3 "open"</code>, which is now appended to the incr file as well as applied in memory.</li>
<li>Run <code>INFO persistence</code> and read the AOF fields by name: <code>aof_enabled</code> is now <code>1</code>, <code>aof_last_bgrewrite_status</code> reads <code>ok</code>, and two fields that only appear once the AOF is on — <code>aof_current_size</code> and <code>aof_base_size</code> — report the total log size and the size of the base file in bytes.</li>
</ul>
<p>Enabling the AOF schedules a rewrite immediately, so <code>aof_rewrite_in_progress</code> may read <code>1</code> in that first instant. The scaffold leaves the enabling command and the parameter names blank.</p>`,
    inputSpec: 'A running Redis 7 server with the AOF disabled and an empty keyspace. Three string keys are written around the switch-over.',
    outputSpec: 'The first CONFIG GET appendonly returns "appendonly" then "no". MSET returns OK. CONFIG SET appendonly yes returns OK and CONFIG GET appendonly then returns "yes". CONFIG GET appendfsync returns "everysec", CONFIG GET appenddirname returns "appendonlydir", CONFIG GET appendfilename returns "appendonly.aof". SET ledger:3 returns OK. INFO persistence now contains aof_enabled:1, aof_last_bgrewrite_status:ok, aof_rewrite_in_progress reading 1 or 0 depending on whether the initial rewrite child has been reaped, plus the AOF-only fields aof_current_size and aof_base_size whose byte values are environment-specific.',
    constraints: 'Enable the AOF with CONFIG SET only — do not restart the server and do not edit a configuration file. Do not run BGREWRITEAOF in this exercise: enabling appendonly already starts a rewrite, and a second request while one is in progress is rejected. Do not assert exact byte values for aof_current_size or aof_base_size.',
    examplesJson: [
      {
        input: 'CONFIG GET appendonly then CONFIG SET appendonly yes then CONFIG GET appendonly',
        output: '1) "appendonly"\n2) "no"\nOK\n1) "appendonly"\n2) "yes"',
        explanation: 'The AOF is off on a stock server and can be enabled live; Redis seeds the log with a rewrite of the current dataset before it starts appending, so no data is missing from the log.',
      },
      {
        input: 'CONFIG GET appenddirname then CONFIG GET appendfilename',
        output: '1) "appenddirname"\n2) "appendonlydir"\n1) "appendfilename"\n2) "appendonly.aof"',
        explanation: 'In Redis 7 appendfilename is a base name, not a single file: the real files are appendonly.aof.1.base.rdb, appendonly.aof.1.incr.aof and appendonly.aof.manifest inside dir/appendonlydir.',
      },
      {
        input: 'INFO persistence after enabling, reading the AOF fields',
        output: 'aof_enabled:1\naof_rewrite_in_progress:1\naof_last_bgrewrite_status:ok\naof_current_size:259\naof_base_size:102',
        explanation: 'Abridged to the AOF fields. aof_enabled flips to 1 immediately; the size fields exist only while the AOF is on and their byte values depend on what you wrote.',
      },
    ],
    hintsJson: [
      'The append-only log is just another configuration parameter, so it can be turned on the same way you read it.',
      'CONFIG SET appendonly yes enables it live and triggers an initial rewrite so the log starts from a complete picture of memory.',
      'Three more parameters describe the layout: appendfsync for durability policy, appenddirname for the directory, appendfilename for the base name.',
      'Verify in INFO persistence: aof_enabled becomes 1 and the AOF-only fields aof_current_size and aof_base_size appear at the end of the section.',
    ],
    starter: `CONFIG GET appendonly
MSET ledger:1 "open" ledger:2 "open"
CONFIG SET ____ yes
CONFIG GET appendonly
CONFIG GET ____
CONFIG GET ____
CONFIG GET ____
SET ledger:3 "open"
INFO persistence`,
    solution: `CONFIG GET appendonly
MSET ledger:1 "open" ledger:2 "open"
CONFIG SET appendonly yes
CONFIG GET appendonly
CONFIG GET appendfsync
CONFIG GET appenddirname
CONFIG GET appendfilename
SET ledger:3 "open"
INFO persistence`,
    solutionExplanationHtml: `<p>Turning <code>appendonly</code> on at runtime is safe because Redis does not simply start appending from that moment — that would leave the log missing everything written before the switch. Instead it immediately performs an <strong>initial rewrite</strong>: a child process serialises the current dataset into a new base file, and commands accepted from that instant are appended to an incr file. The result is a log that can reconstruct the full dataset, including the two <code>ledger</code> keys written before the switch, which is why <code>aof_rewrite_in_progress</code> can read <code>1</code> in the same millisecond that <code>aof_enabled</code> reads <code>1</code>.</p>
<p>The Redis 7 multi-part layout is worth understanding rather than memorising blindly, because it explains the file names you will meet during a real recovery. <code>appenddirname</code> (default <code>appendonlydir</code>) is a directory under <code>dir</code>; inside it, <code>appendonly.aof.N.base.rdb</code> is a compact snapshot in RDB format taken at the last rewrite, <code>appendonly.aof.N.incr.aof</code> holds the RESP-encoded commands appended since, and <code>appendonly.aof.manifest</code> is a small text file naming the current members of the set. Startup reads the manifest, loads the base, then replays the incrs. The practical consequences are concrete: <strong>backing up "the AOF" means copying the whole directory</strong>, not one file, and copying an incr file without its manifest and base yields something unloadable. Pre-7 single-file AOFs are still readable, and Redis 7 upgrades them into the new layout on first rewrite.</p>
<p>Two fields deserve a permanent place in your mental model. <code>aof_base_size</code> is the size of the log at the end of the last rewrite and <code>aof_current_size</code> is its size now; their ratio is what drives automatic rewrites through <code>auto-aof-rewrite-percentage</code> (default 100, meaning "rewrite when the log has doubled") and <code>auto-aof-rewrite-min-size</code> (default 64mb, which stops it thrashing on tiny datasets). <code>aof_last_bgrewrite_status</code> is the AOF twin of <code>rdb_last_bgsave_status</code> and deserves the same alert: if rewrites keep failing, the log grows without bound and eventually fills the disk, which takes the server down far more abruptly than any data-loss window. Finally, note what this exercise did <em>not</em> do — it did not disable RDB. Both mechanisms are now running together, which is the recommended production posture and the subject of a later exercise.</p>`,
  },

  {
    title: 'Trade Durability for Throughput with appendfsync everysec, always, and no',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['appendfsync', 'OS page cache versus fsync', 'durability window', 'aof_last_write_status', 'runtime reconfiguration'],
    prerequisites: ['appendonly', 'CONFIG SET', 'INFO persistence'],
    tags: ['persistence', 'aof', 'appendfsync', 'durability', 'redis'],
    problemHtml: `<p>Appending a command to the AOF does not put it on the disk. <code>write()</code> hands the bytes to the operating system's page cache, and only <code>fsync()</code> forces them onto stable storage. Everything interesting about AOF durability lives in that gap, and <code>appendfsync</code> is the dial that sets how often Redis closes it:</p>
<ul>
<li><code>always</code> — fsync before replying to every write. Effectively zero loss, and the slowest option by a wide margin because each write costs a real disk sync; on rotational disks it is brutal, on NVMe merely expensive.</li>
<li><code>everysec</code> — fsync once per second from a background thread. The default and the right answer for almost everything: worst case you lose about one second of writes, and throughput stays close to the no-fsync ceiling.</li>
<li><code>no</code> — never fsync explicitly; let the kernel flush when it feels like it (typically up to 30 seconds). Fastest, and the loss window is whatever the OS decides, so it is only sane when the data is regenerable.</li>
</ul>
<p>Crucially this is a <strong>runtime</strong> parameter: you can tighten it before a risky migration and relax it afterwards without a restart. Using <code>redis-cli</code>, with the AOF already enabled from the previous exercise:</p>
<ul>
<li>Ensure the log is on with <code>CONFIG SET appendonly yes</code> (a no-op if it already is), then read the current policy with <code>CONFIG GET appendfsync</code> — <code>everysec</code>.</li>
<li>Switch to the strictest policy with <code>CONFIG SET appendfsync always</code>, confirm it, and write <code>SET tx:1 "committed"</code>. That reply is returned only after the command is durably on disk.</li>
<li>Switch to <code>CONFIG SET appendfsync no</code>, confirm it, and write <code>SET tx:2 "committed"</code>. This reply says nothing about the disk at all.</li>
<li>Return to <code>CONFIG SET appendfsync everysec</code> and confirm.</li>
<li>Run <code>INFO persistence</code> and read <code>aof_last_write_status</code> (must be <code>ok</code>), plus <code>aof_enabled</code> and <code>aof_current_size</code> to see the log has grown by the two transactions.</li>
</ul>
<p>The scaffold leaves the three policy values blank.</p>`,
    inputSpec: 'A running Redis 7 server with the AOF enabled. Two string keys are written, one under each of the two non-default fsync policies.',
    outputSpec: 'CONFIG SET appendonly yes returns OK. CONFIG GET appendfsync returns "appendfsync" then "everysec". Each CONFIG SET appendfsync returns OK and the following CONFIG GET echoes the new value: first "always", then "no", then "everysec" again. Both SET commands return OK. INFO persistence shows aof_enabled:1 and aof_last_write_status:ok; aof_current_size and aof_base_size are byte counts whose exact values are environment-specific.',
    constraints: 'Change the policy with CONFIG SET only; no restart, no config file edit. You must finish on everysec — leaving a shared server on no silently removes its durability guarantee, and leaving it on always can cripple throughput. Do not confuse appendfsync with appendonly: the former chooses how often the log is synced, the latter whether there is a log at all.',
    examplesJson: [
      {
        input: 'CONFIG GET appendfsync then CONFIG SET appendfsync always then CONFIG GET appendfsync',
        output: '1) "appendfsync"\n2) "everysec"\nOK\n1) "appendfsync"\n2) "always"',
        explanation: 'The default policy is everysec and it can be tightened live. Under always, the OK returned by the next write means the command is already on stable storage.',
      },
      {
        input: 'CONFIG SET appendfsync no then SET tx:2 "committed" then CONFIG SET appendfsync everysec',
        output: 'OK\nOK\nOK\n',
        explanation: 'Under no, the OK for tx:2 only means the bytes reached the OS page cache; the kernel decides when they hit the disk, so the loss window is out of your control. The third OK restores the default.',
      },
      {
        input: 'INFO persistence, reading the write-status field',
        output: 'aof_enabled:1\naof_last_write_status:ok\n',
        explanation: 'aof_last_write_status reports whether the most recent AOF write succeeded. If it ever reads err, the disk is full or failing and Redis will start refusing writes.',
      },
    ],
    hintsJson: [
      'One parameter decides how often the log is flushed to stable storage, and it accepts exactly three values.',
      'appendfsync always is per-write durability, everysec is once-per-second from a background thread, and no defers entirely to the kernel.',
      'All three are settable at runtime with CONFIG SET appendfsync <value>, so the trade-off can be changed for a maintenance window and changed back.',
      'Confirm each change with CONFIG GET appendfsync, and check aof_last_write_status in INFO persistence — it must read ok, or the log is not being written at all.',
    ],
    starter: `CONFIG SET appendonly yes
CONFIG GET appendfsync
CONFIG SET appendfsync ____
CONFIG GET appendfsync
SET tx:1 "committed"
CONFIG SET appendfsync ____
CONFIG GET appendfsync
SET tx:2 "committed"
CONFIG SET appendfsync ____
CONFIG GET appendfsync
INFO persistence`,
    solution: `CONFIG SET appendonly yes
CONFIG GET appendfsync
CONFIG SET appendfsync always
CONFIG GET appendfsync
SET tx:1 "committed"
CONFIG SET appendfsync no
CONFIG GET appendfsync
SET tx:2 "committed"
CONFIG SET appendfsync everysec
CONFIG GET appendfsync
INFO persistence`,
    solutionExplanationHtml: `<p>The whole exercise turns on one distinction: <code>write()</code> versus <code>fsync()</code>. Redis appends every mutating command to the AOF with a <code>write()</code> that normally returns in microseconds because the data lands in the kernel's page cache, not on the platter. If the Redis process crashes, those cached bytes survive — the kernel still owns them and will flush them. If the <em>machine</em> loses power or the kernel panics, they are gone. <code>appendfsync</code> therefore does not protect you from a Redis crash, which the page cache already handles; it protects you from a host failure, and the cost of that protection is what you are choosing.</p>
<p><code>always</code> makes every reply a durability statement: the client's <code>OK</code> arrives after the command is on stable storage, which is what a payment ledger or an idempotency-key store needs. The price is one disk sync per write — often an order of magnitude fewer operations per second, and much worse on network-attached storage where each sync is a round trip. <code>everysec</code> is the default because it is the honest middle: a dedicated background thread syncs once per second, so a host failure costs at most about one second of writes, and the main thread almost never blocks. The subtlety people miss is that the guarantee is "about one second", not "exactly one second" — if the background fsync is still running when the next one is due, Redis will briefly delay the write rather than let the buffer grow unbounded, which is why <code>aof_delayed_fsync</code> exists as a counter and why a sudden climb in it means your disk cannot keep up. <code>no</code> hands the schedule to the kernel entirely (commonly up to 30 seconds of dirty pages), which is only defensible for data you can rebuild.</p>
<p>Two operational habits follow. First, treat the policy as a <strong>dial you may move</strong>: tighten to <code>always</code> for a data migration or a one-off import you cannot repeat, then return to <code>everysec</code>, all without a restart. Second, alert on <code>aof_last_write_status</code>. Unlike the rewrite status, this field reports the health of ordinary appends, and when it flips to <code>err</code> — disk full, read-only filesystem, failing device — Redis starts rejecting writes to avoid acknowledging data it cannot log. Combined with <code>rdb_last_bgsave_status</code> from the RDB side, these two fields are the minimum viable persistence alerting for any Redis you actually depend on.</p>`,
    diagramMermaid: `flowchart TD
  A[Write command accepted] --> B[Append bytes to AOF buffer]
  B --> C[write syscall into OS page cache]
  C --> D{appendfsync policy}
  D -->|always| E[fsync before replying so loss window is zero]
  D -->|everysec| F[background thread fsyncs once per second so loss is about one second]
  D -->|no| G[kernel flushes on its own schedule so loss window is unbounded]
  E --> H[Bytes on stable storage]
  F --> H
  G --> H`,
  },

  {
    title: 'Compact a Churning Log with BGREWRITEAOF',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 20,
    concepts: ['BGREWRITEAOF', 'aof_rewrite_in_progress', 'aof_rewrites', 'aof_current_size versus aof_base_size', 'auto-aof-rewrite thresholds'],
    prerequisites: ['appendonly', 'INFO persistence', 'BGSAVE'],
    tags: ['persistence', 'aof', 'bgrewriteaof', 'compaction', 'redis'],
    problemHtml: `<p>An append-only log records <em>history</em>, not state, and history is unboundedly larger than state. A counter incremented a million times leaves a million entries in the AOF and one integer in memory; a key that is written and then deleted leaves two entries and nothing at all. Left alone, the log outgrows the dataset by orders of magnitude, replay on startup slows to minutes, and the disk eventually fills. <strong>Rewriting</strong> solves it: Redis forks a child that writes the shortest command sequence capable of reproducing current memory, then swaps that in as the new base and discards the superseded history.</p>
<p>Redis does this automatically when the log has grown by <code>auto-aof-rewrite-percentage</code> (default 100 — a doubling) past <code>auto-aof-rewrite-min-size</code> (default 64mb). <code>BGREWRITEAOF</code> is the manual trigger, and like <code>BGSAVE</code> it returns before the work is finished.</p>
<p>Using <code>redis-cli</code>, with the AOF enabled:</p>
<ul>
<li>Ensure the log is on with <code>CONFIG SET appendonly yes</code>, then pause one second with <code>BLPOP aof:wait 1</code> so that any rewrite triggered by that command is finished before you request another. <code>BLPOP</code> on a key nobody ever pushes to is a portable one-second sleep from <code>redis-cli</code>; it returns <code>(nil)</code>.</li>
<li>Read the two thresholds that drive automatic rewrites: <code>CONFIG GET auto-aof-rewrite-percentage</code> returns <code>100</code> and <code>CONFIG GET auto-aof-rewrite-min-size</code> returns <code>67108864</code> — the default 64mb expressed in bytes.</li>
<li>Generate churn that inflates history without inflating state: <code>SET churn 0</code>, then <code>INCR churn</code> three times, then <code>SET tmp:1 "x"</code> followed by <code>DEL tmp:1</code>. Six log entries; the surviving state is a single key holding <code>3</code>.</li>
<li>Run <code>INFO persistence</code> and note <code>aof_current_size</code>, <code>aof_base_size</code>, and <code>aof_rewrites</code>.</li>
<li>Trigger compaction with <code>BGREWRITEAOF</code>. The reply is the status string <code>Background append only file rewriting started</code>.</li>
<li>Pause again with <code>BLPOP aof:wait 1</code> so the child finishes and is reaped, then run <code>INFO persistence</code> once more. <code>aof_rewrites</code> has increased by one, <code>aof_last_bgrewrite_status</code> reads <code>ok</code>, <code>aof_rewrite_in_progress</code> is back to <code>0</code>, and <code>aof_current_size</code> has dropped sharply and now equals <code>aof_base_size</code> — the whole log is the freshly written base with nothing appended after it.</li>
<li>Finish with <code>GET churn</code> to prove compaction changed the log, not the data.</li>
</ul>
<p>The scaffold leaves the rewrite command and the waits blank.</p>`,
    inputSpec: 'A running Redis 7 server with the AOF enabled and an empty keyspace. Six write commands create churn against a one-key final state.',
    outputSpec: 'CONFIG SET appendonly yes returns OK; CONFIG GET auto-aof-rewrite-percentage returns "100" and CONFIG GET auto-aof-rewrite-min-size returns "67108864"; each BLPOP aof:wait 1 returns (nil) after about a second (redis-cli also prints the elapsed time in parentheses). SET churn 0 returns OK; the three INCR calls return (integer) 1, (integer) 2, (integer) 3; SET tmp:1 returns OK and DEL tmp:1 returns (integer) 1. BGREWRITEAOF replies with the status string Background append only file rewriting started. In the final INFO persistence, aof_last_bgrewrite_status reads ok, aof_rewrite_in_progress reads 0, aof_rewrites is one higher than in the first INFO, and aof_current_size has fallen to the same value as aof_base_size (in one observed run 295 bytes fell to 102). GET churn returns "3".',
    constraints: 'Only one rewrite child may exist at a time: a BGREWRITEAOF issued while another rewrite is in progress fails with (error) ERR Background append only file rewriting already in progress, which is why the one-second pauses are required. Do not assert exact byte counts for aof_current_size or aof_base_size — assert that after the rewrite they are equal and much smaller than before. Do not use SAVE or BGSAVE here.',
    examplesJson: [
      {
        input: 'SET churn 0 then INCR churn three times then SET tmp:1 "x" then DEL tmp:1',
        output: 'OK\n(integer) 1\n(integer) 2\n(integer) 3\nOK\n(integer) 1',
        explanation: 'Six commands are appended to the log, but the state they leave behind is one key holding 3 — exactly the gap that rewriting reclaims.',
      },
      {
        input: 'BGREWRITEAOF then BLPOP aof:wait 1 then INFO persistence',
        output: 'Background append only file rewriting started\n(nil)\naof_rewrite_in_progress:0\naof_last_bgrewrite_status:ok\naof_rewrites:5\naof_current_size:102\naof_base_size:102',
        explanation: 'INFO output abridged to the AOF fields. The child has been reaped, the rewrite succeeded, and current size equals base size because the new base was just written and nothing has been appended since.',
      },
      {
        input: 'INFO persistence before the rewrite, reading the size fields',
        output: 'aof_current_size:295\naof_base_size:183',
        explanation: 'Before compaction the log is the old base plus every command since. Once aof_current_size exceeds aof_base_size by auto-aof-rewrite-percentage, Redis would trigger this rewrite for you.',
      },
    ],
    hintsJson: [
      'The log needs compacting, not the data — so the command rewrites the file in the background, mirroring BGSAVE.',
      'BGREWRITEAOF forks a child that writes the minimal command set reproducing current memory, and replies with a status string immediately.',
      'Only one rewrite child can run at a time, so leave a moment between enabling the AOF and requesting a rewrite; BLPOP on an unused key with a timeout of 1 is an easy one-second pause.',
      'Compare aof_current_size with aof_base_size in INFO persistence before and after: a completed rewrite makes them equal, and aof_rewrites increases by one while aof_last_bgrewrite_status stays ok.',
    ],
    starter: `CONFIG SET appendonly yes
BLPOP aof:wait ____
CONFIG GET auto-aof-rewrite-percentage
CONFIG GET auto-aof-rewrite-min-size
SET churn 0
INCR churn
INCR churn
INCR churn
SET tmp:1 "x"
DEL tmp:1
INFO persistence
____
BLPOP aof:wait ____
INFO persistence
GET churn`,
    solution: `CONFIG SET appendonly yes
BLPOP aof:wait 1
CONFIG GET auto-aof-rewrite-percentage
CONFIG GET auto-aof-rewrite-min-size
SET churn 0
INCR churn
INCR churn
INCR churn
SET tmp:1 "x"
DEL tmp:1
INFO persistence
BGREWRITEAOF
BLPOP aof:wait 1
INFO persistence
GET churn`,
    solutionExplanationHtml: `<p>Rewriting is not compression and it is not a truncation of old entries — it is a <strong>regeneration from state</strong>. The child process walks the live dataset and emits the shortest sequence of commands that recreates it, so three <code>INCR</code>s collapse into one value and the created-then-deleted <code>tmp:1</code> disappears entirely. In Redis 7 the child writes a new <code>appendonly.aof.N.base.rdb</code>, a fresh incr file is opened for commands accepted during the rewrite, and the manifest is atomically replaced to point at the new set; the old members are then deleted. That atomic manifest swap is why a crash mid-rewrite is safe: either the old set or the new one is complete, never a mixture.</p>
<p>The size fields make the mechanism visible. Before the rewrite, <code>aof_current_size</code> is the old base plus everything appended since, so it exceeds <code>aof_base_size</code>. Immediately after a successful rewrite the two are equal, because the log <em>is</em> the new base and nothing has been appended yet. This is also precisely the ratio the automatic trigger watches: <code>auto-aof-rewrite-percentage 100</code> means "rewrite once the log has grown to twice the size it was after the last rewrite", and <code>auto-aof-rewrite-min-size 64mb</code> stops that rule from firing constantly on a small dataset. Manual <code>BGREWRITEAOF</code> is for the cases the heuristic cannot see coming — after a bulk delete that shrank the dataset by 90%, before taking a backup so you copy the smallest possible directory, or as the recovery step when a disk-space incident left the log oversized.</p>
<p>The scheduling rules are the trap. <code>BGREWRITEAOF</code> forks, so only one rewrite may run at a time and a second request is rejected outright; and if a <code>BGSAVE</code> child is already running, Redis does not reject the request but replies that the rewrite has been <em>scheduled</em> to start when the current save finishes. Both facts matter in automation: a script that issues a rewrite and treats any non-<code>started</code> reply as failure will page someone at 3am for a perfectly healthy server. Judge the outcome afterwards from <code>aof_last_bgrewrite_status</code> and a rising <code>aof_rewrites</code>, not from the immediate reply. And keep the fork cost in mind — a rewrite has the same copy-on-write profile as a background save, so on a large, write-heavy instance it is a memory event, not just an I/O one.</p>`,
  },

  {
    title: 'Run RDB and AOF Together and Prove Durability with DEBUG RELOAD',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 25,
    concepts: ['RDB plus AOF together', 'AOF precedence on startup', 'DEBUG RELOAD', 'TTL survival', 'aof_enabled'],
    prerequisites: ['SAVE', 'appendonly', 'INFO persistence', 'EXPIRE'],
    tags: ['persistence', 'aof', 'rdb', 'debug-reload', 'redis'],
    problemHtml: `<p>RDB and AOF are not alternatives. The recommended production posture is <strong>both</strong>: the AOF bounds your loss window to about a second, while the RDB snapshot gives you a single compact file that is fast to load, cheap to ship offsite, and trivially restorable to a point in time. They cost different things — the snapshot costs a periodic fork, the log costs continuous I/O — and they fail differently, which is exactly why running both is a real safety improvement rather than duplicated effort.</p>
<p>When both are enabled there is one rule to remember about restart: <strong>if <code>appendonly</code> is <code>yes</code>, Redis loads the AOF and ignores <code>dump.rdb</code> entirely</strong>, because the log is the more complete record. The snapshot is then a backup artifact, not a recovery path — which also means that restoring from an RDB file requires you to turn the AOF off first, a step covered in the next exercise.</p>
<p>Proving that data really survives a load cycle normally means restarting the server. <code>DEBUG RELOAD</code> does it without downtime: it saves the dataset and immediately reloads it from that serialised form, exercising the same code path a restart takes. Redis 7 gates the <code>DEBUG</code> command by default, so the server must have been started with <code>--enable-debug-command yes</code> (or <code>local</code>); otherwise the command is refused.</p>
<p>Using <code>redis-cli</code>:</p>
<ul>
<li>Enable both mechanisms: <code>CONFIG SET appendonly yes</code> and <code>CONFIG SET save "3600 1 300 100 60 10000"</code>.</li>
<li>Build a mixed dataset so the reload has to reconstruct several types: <code>MSET cfg:site "cuongthai" cfg:env "prod"</code>, <code>RPUSH jobs "j1" "j2" "j3"</code>, <code>HSET session:9 user "ann" role "admin"</code>, and <code>SET otp:9 "483920" EX 600</code>. Confirm <code>DBSIZE</code> is <code>5</code>.</li>
<li>Take a snapshot with <code>SAVE</code>, then check <code>INFO persistence</code> shows <code>aof_enabled:1</code> alongside <code>rdb_last_bgsave_status:ok</code> — both systems are live at once.</li>
<li>Run <code>DEBUG RELOAD</code>.</li>
<li>Verify nothing was lost: <code>DBSIZE</code> is still <code>5</code>, <code>MGET cfg:site cfg:env</code> returns both strings, <code>LRANGE jobs 0 -1</code> returns the three jobs <em>in order</em>, <code>HGETALL session:9</code> returns both fields, <code>TYPE jobs</code> is <code>list</code>, and — the detail most people expect to break — <code>TTL otp:9</code> still reports roughly <code>600</code> rather than <code>-1</code>. Expiry times are absolute and are serialised with the key.</li>
</ul>
<p>The scaffold leaves the reload command and the TTL check blank.</p>`,
    inputSpec: 'A running Redis 7 server started with --enable-debug-command yes, with an empty keyspace. Five keys of four different types, one carrying a TTL, are created before the reload.',
    outputSpec: 'Both CONFIG SET commands return OK. MSET returns OK, RPUSH returns (integer) 3, HSET returns (integer) 2, SET otp:9 with EX returns OK, DBSIZE returns (integer) 5. SAVE returns OK and INFO persistence shows aof_enabled:1 with rdb_last_bgsave_status:ok. DEBUG RELOAD returns OK on a server where DEBUG is enabled; on a stock Redis 7 it is refused with (error) ERR DEBUG command not allowed. If the enable-debug-command option is set to "local", you can run it from a local connection, otherwise you need to set this option in the configuration file, and then restart the server. After a successful reload DBSIZE is still (integer) 5, MGET returns "cuongthai" and "prod", LRANGE jobs 0 -1 returns j1, j2, j3 in order, HGETALL session:9 returns user/ann and role/admin, TYPE jobs returns list, and TTL otp:9 returns (integer) 600 or 599.',
    constraints: 'DEBUG RELOAD requires a server started with --enable-debug-command yes or local; never enable DEBUG on a production instance, since other DEBUG subcommands can crash or corrupt the server. Do not restart the container to test durability in this exercise. Do not assert TTL equals exactly 600 — a second may elapse during the reload, so accept 600 or 599.',
    examplesJson: [
      {
        input: 'MSET cfg:site "cuongthai" cfg:env "prod" then RPUSH jobs "j1" "j2" "j3" then HSET session:9 user "ann" role "admin" then SET otp:9 "483920" EX 600 then DBSIZE',
        output: 'OK\n(integer) 3\n(integer) 2\nOK\n(integer) 5',
        explanation: 'Five keys across strings, a list, a hash and a volatile string give the reload something of every shape to reconstruct.',
      },
      {
        input: 'DEBUG RELOAD then DBSIZE then LRANGE jobs 0 -1 then TYPE jobs',
        output: 'OK\n(integer) 5\n1) "j1"\n2) "j2"\n3) "j3"\nlist',
        explanation: 'The dataset is serialised and loaded back through the same code path a restart uses. List order is part of the value, so it survives exactly.',
      },
      {
        input: 'HGETALL session:9 then TTL otp:9 after the reload',
        output: '1) "user"\n2) "ann"\n3) "role"\n4) "admin"\n(integer) 600',
        explanation: 'Hash fields come back intact and the TTL is preserved rather than reset, because Redis stores an absolute expiry timestamp and serialises it with the key. A reload that takes over a second would show 599.',
      },
    ],
    hintsJson: [
      'Both mechanisms can be on at the same time; enabling one does not disable the other.',
      'On startup the AOF wins whenever appendonly is yes, so dump.rdb becomes a backup artifact rather than the recovery path.',
      'DEBUG RELOAD serialises the dataset and loads it straight back, which exercises the restart code path without any downtime.',
      'Check more than DBSIZE after the reload: read a list to confirm order, a hash to confirm fields, and TTL on the volatile key to confirm the absolute expiry time was serialised with it.',
    ],
    starter: `CONFIG SET appendonly yes
CONFIG SET save "3600 1 300 100 60 10000"
MSET cfg:site "cuongthai" cfg:env "prod"
RPUSH jobs "j1" "j2" "j3"
HSET session:9 user "ann" role "admin"
SET otp:9 "483920" EX 600
DBSIZE
SAVE
INFO persistence
____
DBSIZE
MGET cfg:site cfg:env
LRANGE jobs 0 -1
HGETALL session:9
TYPE jobs
____ otp:9`,
    solution: `CONFIG SET appendonly yes
CONFIG SET save "${DEFAULT_SAVE}"
MSET cfg:site "cuongthai" cfg:env "prod"
RPUSH jobs "j1" "j2" "j3"
HSET session:9 user "ann" role "admin"
SET otp:9 "483920" EX 600
DBSIZE
SAVE
INFO persistence
DEBUG RELOAD
DBSIZE
MGET cfg:site cfg:env
LRANGE jobs 0 -1
HGETALL session:9
TYPE jobs
TTL otp:9`,
    solutionExplanationHtml: `<p><code>DEBUG RELOAD</code> is the cheapest honest test of persistence you can run: it serialises the whole dataset and immediately loads it back through the same routines a cold start uses. If a value cannot survive that round trip, it will not survive a restart either. The reason to check four different things afterwards rather than just <code>DBSIZE</code> is that key count proves almost nothing — it would still be <code>5</code> if every list had come back empty. Reading <code>LRANGE jobs 0 -1</code> proves ordering survived, <code>HGETALL session:9</code> proves field/value structure survived, <code>TYPE jobs</code> proves the encoding was restored as a list rather than degraded to a string, and <code>TTL otp:9</code> proves the expiry survived.</p>
<p>That last one is the detail worth carrying away. Redis stores expiry as an <strong>absolute Unix timestamp in milliseconds</strong>, not as a countdown, and that timestamp is written into both the RDB and the AOF alongside the key. So a key with 600 seconds left comes back with roughly 600 seconds left, and — the flip side — a key whose expiry passed while the server was down is simply not loaded, or is dropped on access. Had TTLs been stored as remaining durations, every restart would have silently extended every session in the system.</p>
<p>The configuration point behind the exercise is that RDB and AOF coexist by design. <code>INFO persistence</code> shows <code>aof_enabled:1</code> and healthy RDB fields simultaneously because they are independent subsystems writing different files from different forks. Startup, however, is not symmetric: <strong>with <code>appendonly yes</code>, Redis loads only the AOF</strong> and never looks at <code>dump.rdb</code>. That asymmetry causes a specific, common disaster — an operator copies a good <code>dump.rdb</code> into <code>/data</code>, restarts, and finds an empty database, because the server loaded an empty AOF directory instead and then <em>overwrote</em> the good snapshot at the next save point. The rule that prevents it: to restore from an RDB file on a server that uses the AOF, stop the server, put the file in place, start with <code>appendonly no</code>, verify the data, then turn the AOF back on with <code>CONFIG SET appendonly yes</code> so a fresh log is rewritten from the restored memory. That procedure is the subject of the next exercise.</p>`,
    diagramMermaid: `flowchart TD
  A[Redis starts up] --> B{appendonly is yes}
  B -->|yes| C[Read appendonlydir manifest]
  C --> D[Load base file then replay incr files]
  B -->|no| E[Load dump.rdb from dir]
  D --> F[Dataset in memory]
  E --> F
  F --> G[dump.rdb remains a backup artifact when AOF is on]`,
  },

  {
    title: 'Write a Backup and Restore Runbook for a Live Instance',
    difficulty: 'HARD',
    estimatedMinutes: 50,
    points: 25,
    concepts: ['backup procedure', 'atomic rename of dump.rdb', 'restore with appendonly no', 'replica-based backup', 'INFO replication'],
    prerequisites: ['SAVE', 'BGSAVE', 'appendonly', 'INFO persistence', 'CONFIG GET dir'],
    tags: ['persistence', 'backup', 'restore', 'replication', 'redis'],
    problemHtml: `<p>Persistence writes files; a backup gets those files somewhere the machine's failure cannot reach. The two are routinely confused, and the confusion is only discovered during an incident. This exercise assembles the commands side of a runbook you could actually follow at 3am, and names the file operations that go with them.</p>
<p>Two properties make Redis backups unusually easy. First, <code>dump.rdb</code> is written to a temporary file and <strong>atomically renamed</strong> into place, so a copy taken at any moment is either the previous complete snapshot or the new complete one — never a torn file. Second, the snapshot is self-contained: one file restores the whole dataset. The AOF is not one file, so backing it up means copying the entire <code>appendonlydir</code> including its manifest.</p>
<p>Using <code>redis-cli</code>, produce the evidence a runbook needs:</p>
<ul>
<li>Locate the artifacts: <code>CONFIG GET dir</code>, <code>CONFIG GET dbfilename</code>, and <code>CONFIG GET appenddirname</code>. These three give you <code>/data/dump.rdb</code> and <code>/data/appendonlydir/</code>.</li>
<li>Load the data to be protected: <code>MSET acct:1 "100" acct:2 "250"</code> and <code>HSET acct:meta owner "ann" region "sg"</code>. Confirm <code>DBSIZE</code> is <code>3</code>.</li>
<li>Cut a fresh snapshot with <code>SAVE</code>, then record the exact backup point with <code>LASTSAVE</code>. Copy the file <em>after</em> this, never before.</li>
<li>Verify the snapshot is trustworthy before shipping it: <code>INFO persistence</code> must show <code>rdb_last_bgsave_status:ok</code> and <code>rdb_changes_since_last_save:0</code>. A backup taken while the status reads <code>err</code> copies a stale file with full confidence — the worst possible failure mode.</li>
<li>Consider the alternative source: <code>INFO replication</code>, reading <code>role</code> and <code>connected_slaves</code>. Taking backups from a replica moves the fork cost off the instance serving traffic.</li>
<li>Assert this instance's role explicitly with <code>REPLICAOF NO ONE</code>, which returns <code>OK</code> and makes a server a master (a no-op here, and the exact command used to promote a replica after its master dies).</li>
<li>Confirm the dataset is intact with <code>MGET acct:1 acct:2</code> and <code>HGETALL acct:meta</code>.</li>
</ul>
<p>The file half of the runbook, which you cannot run from <code>redis-cli</code>: copy <code>/data/dump.rdb</code> to dated offsite storage; to restore, stop the server, put the file back as <code>dir/dbfilename</code>, start with <code>appendonly no</code>, verify with <code>DBSIZE</code>, then re-enable the AOF with <code>CONFIG SET appendonly yes</code>. The scaffold leaves the verification commands blank.</p>`,
    inputSpec: 'A running Redis 7 server with the AOF enabled from earlier exercises and an empty keyspace. Three keys are created, snapshotted and verified.',
    outputSpec: 'CONFIG GET dir returns "/data", dbfilename returns "dump.rdb", appenddirname returns "appendonlydir". MSET returns OK, HSET returns (integer) 2, DBSIZE returns (integer) 3. SAVE returns OK and LASTSAVE returns the Unix timestamp of that save. INFO persistence shows rdb_changes_since_last_save:0 and rdb_last_bgsave_status:ok, with aof_enabled:1. INFO replication prints the section beginning # Replication with role:master and connected_slaves:0; master_replid and master_repl_offset are environment-specific. REPLICAOF NO ONE returns OK. MGET returns "100" and "250", and HGETALL acct:meta returns owner/ann and region/sg.',
    constraints: 'Take the snapshot before copying the file, never after. Do not copy an AOF incr file without its manifest and base — back up the whole appenddirname directory or nothing. Do not restore an RDB file onto a server running with appendonly yes; the AOF would be loaded instead and the restored snapshot overwritten at the next save. Use SAVE here because the runbook needs a synchronous confirmation before the copy step; on a large production instance substitute BGSAVE and poll rdb_bgsave_in_progress and LASTSAVE until it completes.',
    examplesJson: [
      {
        input: 'CONFIG GET dir then CONFIG GET dbfilename then CONFIG GET appenddirname',
        output: '1) "dir"\n2) "/data"\n1) "dbfilename"\n2) "dump.rdb"\n1) "appenddirname"\n2) "appendonlydir"',
        explanation: 'The three parameters resolve every persistence artifact on disk: the snapshot at /data/dump.rdb and the AOF set inside /data/appendonlydir.',
      },
      {
        input: 'SAVE then LASTSAVE then INFO persistence, reading the two verification fields',
        output: 'OK\n(integer) 1784511519\nrdb_changes_since_last_save:0\nrdb_last_bgsave_status:ok',
        explanation: 'The zero change counter proves the file matches memory as of the LASTSAVE timestamp, and the ok status proves the write actually succeeded — together they are the go signal for the copy step.',
      },
      {
        input: 'INFO replication then REPLICAOF NO ONE',
        output: '# Replication\nrole:master\nconnected_slaves:0\nOK',
        explanation: 'This instance is a standalone master with no replicas, so backups must be taken here. With a replica attached you would run SAVE and copy the file on the replica instead, keeping the fork off the primary. REPLICAOF NO ONE asserts master status and is also how a replica is promoted during a failover.',
      },
    ],
    hintsJson: [
      'A runbook needs three things from the server: where the files are, a fresh copy of them, and proof that the copy is good.',
      'dir plus dbfilename locate the snapshot; dir plus appenddirname locate the AOF set, which is a directory of base, incr and manifest files.',
      'After SAVE returns OK, check rdb_changes_since_last_save is 0 and rdb_last_bgsave_status is ok before copying anything offsite; LASTSAVE records exactly which point in time the copy represents.',
      'For the restore direction remember the precedence rule: a server with appendonly yes loads the AOF and ignores dump.rdb, so start the restored server with appendonly no, verify, then turn the AOF back on so a fresh log is rewritten from restored memory.',
    ],
    starter: `CONFIG GET dir
CONFIG GET dbfilename
CONFIG GET ____
MSET acct:1 "100" acct:2 "250"
HSET acct:meta owner "ann" region "sg"
DBSIZE
SAVE
____
INFO persistence
INFO ____
REPLICAOF NO ONE
MGET acct:1 acct:2
HGETALL acct:meta`,
    solution: `CONFIG GET dir
CONFIG GET dbfilename
CONFIG GET appenddirname
MSET acct:1 "100" acct:2 "250"
HSET acct:meta owner "ann" region "sg"
DBSIZE
SAVE
LASTSAVE
INFO persistence
INFO replication
REPLICAOF NO ONE
MGET acct:1 acct:2
HGETALL acct:meta`,
    solutionExplanationHtml: `<p>The order of the commands is the whole lesson. <code>SAVE</code> first, then <code>LASTSAVE</code> to stamp the backup, then <code>INFO persistence</code> to verify, and only then the file copy. Reversing any two of those produces a plausible-looking backup that is wrong: copying before saving ships a stale snapshot, and copying without checking <code>rdb_last_bgsave_status</code> ships whatever was last successfully written — possibly days old — with complete confidence. <code>rdb_changes_since_last_save:0</code> is the tightest assertion available that the file on disk equals memory, and <code>LASTSAVE</code> converts the copy into a point-in-time you can name in an incident report.</p>
<p>Copying is safe while the server runs because Redis writes the snapshot to a temporary file and <strong>renames</strong> it over <code>dump.rdb</code>; rename is atomic within a filesystem, so a reader sees either the old complete file or the new complete file. That guarantee does <em>not</em> extend to the AOF, which in Redis 7 is a set of files described by a manifest. Copying <code>appendonly.aof.1.incr.aof</code> on its own yields something unloadable; copying the incr file with a manifest that has since been replaced by a rewrite yields something worse — a set that appears valid and loads the wrong history. Back up <code>appenddirname</code> as a unit, and prefer to do it right after a <code>BGREWRITEAOF</code> when the directory is at its smallest.</p>
<p>Restoring is where the precedence rule bites. A server started with <code>appendonly yes</code> reads the AOF and never opens <code>dump.rdb</code>, so dropping a good snapshot into <code>/data</code> and restarting an AOF-enabled server produces an empty database and then destroys the snapshot at the next save point. The safe sequence is: stop the server, place the file at <code>dir/dbfilename</code> with the right ownership, start with <code>appendonly no</code>, confirm with <code>DBSIZE</code> and a few spot reads, then <code>CONFIG SET appendonly yes</code> — which triggers a rewrite that seeds a brand-new log from the restored memory. Persist that change to the config file afterwards, or the next restart reverts to snapshot-only.</p>
<p>The replication angle solves the cost problem. Every snapshot on a busy primary is a fork with copy-on-write pressure and a burst of disk I/O. Attach a replica with <code>REPLICAOF host port</code> and run the backup <em>there</em>: the replica holds the same dataset, its <code>SAVE</code> disturbs no client traffic, and the resulting file is a valid restore source for the primary. Watch <code>role</code> and <code>connected_slaves</code> in <code>INFO replication</code> to confirm the topology before relying on it, and remember that replication is asynchronous — a replica can lag, so its snapshot is a slightly older point in time, which is fine for backups and not a substitute for durability on the primary. <code>REPLICAOF NO ONE</code>, harmless on a master, is the promotion command that turns that replica into the new primary when the original is gone.</p>`,
    diagramMermaid: `flowchart TD
  A[Decide backup point] --> B[SAVE or BGSAVE on primary or replica]
  B --> C[LASTSAVE records the point in time]
  C --> D{Verify INFO persistence}
  D -->|status ok and changes zero| E[Copy dump.rdb offsite with a dated name]
  D -->|status err| F[Do not copy and fix the failing save first]
  E --> G[Restore stop server and place file at dir plus dbfilename]
  G --> H[Start with appendonly no and verify DBSIZE]
  H --> I[CONFIG SET appendonly yes to rebuild a fresh log]`,
  },

  {
    title: 'Choose and Apply a Persistence Profile for Cache, Session Store, and Queue',
    difficulty: 'HARD',
    estimatedMinutes: 60,
    points: 30,
    concepts: ['workload-driven configuration', 'save directives', 'appendonly', 'appendfsync', 'CONFIG REWRITE', 'restoring defaults'],
    prerequisites: ['CONFIG SET', 'appendfsync', 'INFO persistence', 'BGREWRITEAOF', 'backup procedure'],
    tags: ['persistence', 'configuration', 'capstone', 'config-rewrite', 'redis'],
    problemHtml: `<p>Every setting in this module is a position on one trade-off — how much data you are willing to lose against how much throughput, memory and I/O you are willing to spend. There is no globally correct answer, only an answer per workload. This capstone makes you commit to three of them on the same server and justify each choice.</p>
<p>The three workloads:</p>
<ol>
<li><strong>Page-fragment cache.</strong> Every value is recomputable from PostgreSQL in milliseconds. Losing the entire dataset costs a brief spike in database load and nothing else. Snapshot forks and AOF writes are pure overhead.</li>
<li><strong>Session store.</strong> Losing a session logs a user out mid-checkout. The data is not recomputable from anywhere, but a second of lost sessions at the moment of a host failure is survivable.</li>
<li><strong>Job queue holding financial instructions.</strong> A lost job is a payment that never happens and nobody knows it was dropped. Throughput is modest — a few hundred jobs a second — and correctness dominates.</li>
</ol>
<p>Using <code>redis-cli</code>, apply and verify each profile in turn:</p>
<ul>
<li><strong>Cache profile:</strong> <code>CONFIG SET save ""</code> and <code>CONFIG SET appendonly no</code>. Verify both with <code>CONFIG GET</code>, write <code>SET frag:home "cached-html"</code>, and confirm <code>INFO persistence</code> shows <code>aof_enabled:0</code>.</li>
<li><strong>Session profile:</strong> <code>CONFIG SET save "300 100"</code>, <code>CONFIG SET appendonly yes</code>, <code>CONFIG SET appendfsync everysec</code>. Verify all three, write <code>SET sess:abc "user=ann"</code>, and confirm <code>INFO persistence</code> shows <code>aof_enabled:1</code>.</li>
<li><strong>Queue profile:</strong> <code>CONFIG SET appendfsync always</code> and <code>CONFIG SET save "900 1"</code>. Verify both, then <code>RPUSH payments "pay-1" "pay-2"</code> and read the queue back with <code>LRANGE payments 0 -1</code>. Each <code>OK</code> now means the instruction is on stable storage.</li>
<li><strong>Persist or discard:</strong> run <code>CONFIG REWRITE</code>, which rewrites the server's configuration file so these runtime changes survive a restart. On a server started without a config file — the default for the official Docker image — it fails with <code>(error) ERR The server is running without a config file</code>, which is itself the lesson: runtime <code>CONFIG SET</code> changes are <strong>ephemeral</strong> unless something writes them down.</li>
<li><strong>Restore the lab server:</strong> <code>CONFIG SET appendfsync everysec</code>, <code>CONFIG SET appendonly no</code>, <code>CONFIG SET save "3600 1 300 100 60 10000"</code>, and verify all three with <code>CONFIG GET</code>. Finish with <code>DBSIZE</code>.</li>
</ul>
<p>Then write your justification — one short paragraph per workload naming the setting and the failure it accepts. The official solution's explanation is the model answer. The scaffold leaves every configuration value blank.</p>`,
    inputSpec: 'A running Redis 7 server carrying whatever persistence settings the previous exercises left, with an empty keyspace. Three keys are written across the three profiles: two strings and one list.',
    outputSpec: 'Every CONFIG SET returns OK. CONFIG GET save returns "" for the cache profile, "300 100" for the session profile and "900 1" for the queue profile; CONFIG GET appendonly returns "no" then "yes"; CONFIG GET appendfsync returns "everysec" then "always" then "everysec". SET frag:home and SET sess:abc return OK. The first INFO persistence shows aof_enabled:0, the second aof_enabled:1. RPUSH payments returns (integer) 2 and LRANGE payments 0 -1 returns "pay-1" and "pay-2". CONFIG REWRITE returns OK on a server started from a config file and (error) ERR The server is running without a config file otherwise. After the restore block CONFIG GET save returns "3600 1 300 100 60 10000", appendonly returns "no", appendfsync returns "everysec", and DBSIZE returns (integer) 3 — two string keys plus the payments list.',
    constraints: 'Apply each profile with CONFIG SET at runtime — no restarts, no config file edits. Every CONFIG SET must be followed by a CONFIG GET that proves it took effect. You must leave the server on stock defaults: save "3600 1 300 100 60 10000", appendonly no, appendfsync everysec. Do not use FLUSHALL between profiles; the three keys accumulate. Treat the CONFIG REWRITE error as an expected outcome in a container, not a failure of your solution.',
    examplesJson: [
      {
        input: 'Cache profile: CONFIG SET save "" then CONFIG SET appendonly no then CONFIG GET save then CONFIG GET appendonly',
        output: 'OK\nOK\n1) "save"\n2) ""\n1) "appendonly"\n2) "no"',
        explanation: 'No save points and no log: the server never forks and never writes, which is exactly right when every value can be recomputed and a cold cache is the only cost of losing everything.',
      },
      {
        input: 'Queue profile: CONFIG SET appendfsync always then CONFIG GET appendfsync then RPUSH payments "pay-1" "pay-2" then LRANGE payments 0 -1',
        output: 'OK\n1) "appendfsync"\n2) "always"\n(integer) 2\n1) "pay-1"\n2) "pay-2"',
        explanation: 'Under always, RPUSH returns only after both instructions are fsynced, so an acknowledged enqueue cannot be lost to a host failure. The cost is a disk sync per write, acceptable at a few hundred jobs a second.',
      },
      {
        input: 'CONFIG REWRITE on the official redis:7 image, then the restore block',
        output: '(error) ERR The server is running without a config file\nOK\nOK\nOK\n1) "save"\n2) "3600 1 300 100 60 10000"',
        explanation: 'The container starts redis-server with no config file, so there is nothing to rewrite and every CONFIG SET above would vanish on restart. The restore block then returns the lab server to stock defaults.',
      },
    ],
    hintsJson: [
      'Start from the failure, not the setting: ask what breaks if this dataset disappears, then pick the cheapest configuration that makes that failure acceptable.',
      'Recomputable data needs no persistence at all, so the cache profile is save "" plus appendonly no — the only profile where forking is pure waste.',
      'Data that cannot be recomputed needs the AOF; the question is only how tight the fsync policy has to be. everysec costs about a second of exposure, always costs throughput instead.',
      'Runtime CONFIG SET changes are lost on restart unless CONFIG REWRITE persists them, and CONFIG REWRITE only works if the server was started from a config file. Restore the defaults at the end: save "3600 1 300 100 60 10000", appendonly no, appendfsync everysec.',
    ],
    starter: `CONFIG SET save ____
CONFIG SET appendonly ____
CONFIG GET save
CONFIG GET appendonly
SET frag:home "cached-html"
INFO persistence
CONFIG SET save ____
CONFIG SET appendonly ____
CONFIG SET appendfsync ____
CONFIG GET save
CONFIG GET appendonly
CONFIG GET appendfsync
SET sess:abc "user=ann"
INFO persistence
CONFIG SET appendfsync ____
CONFIG SET save ____
CONFIG GET appendfsync
CONFIG GET save
RPUSH payments "pay-1" "pay-2"
LRANGE payments 0 -1
CONFIG REWRITE
CONFIG SET appendfsync ____
CONFIG SET appendonly ____
CONFIG SET save ____
CONFIG GET appendfsync
CONFIG GET appendonly
CONFIG GET save
DBSIZE`,
    solution: `CONFIG SET save ""
CONFIG SET appendonly no
CONFIG GET save
CONFIG GET appendonly
SET frag:home "cached-html"
INFO persistence
CONFIG SET save "300 100"
CONFIG SET appendonly yes
CONFIG SET appendfsync everysec
CONFIG GET save
CONFIG GET appendonly
CONFIG GET appendfsync
SET sess:abc "user=ann"
INFO persistence
CONFIG SET appendfsync always
CONFIG SET save "900 1"
CONFIG GET appendfsync
CONFIG GET save
RPUSH payments "pay-1" "pay-2"
LRANGE payments 0 -1
CONFIG REWRITE
CONFIG SET appendfsync everysec
CONFIG SET appendonly no
CONFIG SET save "${DEFAULT_SAVE}"
CONFIG GET appendfsync
CONFIG GET appendonly
CONFIG GET save
DBSIZE`,
    solutionExplanationHtml: `<p><strong>Cache: <code>save ""</code>, <code>appendonly no</code>.</strong> The correct amount of persistence for recomputable data is none. Every snapshot fork costs copy-on-write memory and a burst of I/O to produce a file nobody will ever restore, and every AOF append costs disk bandwidth to record values that PostgreSQL can regenerate in milliseconds. The failure this profile accepts is total: a restart returns an empty cache, the hit rate collapses, and the database absorbs a traffic spike until the cache refills. That is a capacity-planning problem — size the database for a cold-cache event — not a data-loss problem. The one thing this profile must be paired with is a <code>maxmemory</code> limit and an eviction policy such as <code>allkeys-lru</code>, because a cache with no persistence and no eviction ceiling simply grows until the OOM killer makes the decision for you.</p>
<p><strong>Session store: <code>appendonly yes</code>, <code>appendfsync everysec</code>, <code>save "300 100"</code>.</strong> Sessions cannot be recomputed from anywhere, so the AOF is mandatory; the only question is the fsync policy. <code>everysec</code> accepts losing roughly one second of session writes on a host failure — a handful of users who must log in again — in exchange for keeping write latency at memory speed. <code>always</code> would buy those few users nothing worth the throughput cost, since being logged out is annoying rather than incorrect. The snapshot schedule stays on as a <em>backup</em> mechanism rather than a recovery path: <code>300 100</code> produces a compact, self-contained <code>dump.rdb</code> every few minutes that is cheap to ship offsite, while startup still loads the AOF because <code>appendonly</code> is <code>yes</code>. This profile is the default answer for most non-cache Redis usage.</p>
<p><strong>Queue of financial instructions: <code>appendfsync always</code>, <code>save "900 1"</code>, AOF on.</strong> Here the loss window must be zero, because a dropped payment instruction is silent and unrecoverable — nothing downstream knows the job existed. <code>always</code> makes the <code>OK</code> from <code>RPUSH</code> a durability guarantee: the bytes are fsynced before the producer is told the job is queued, so a producer that got its acknowledgement can be certain. The cost is one disk sync per write, which is affordable at a few hundred jobs a second on SSD and would be unaffordable at fifty thousand — at that volume the right answer changes to <code>everysec</code> plus an idempotent producer that can re-enqueue. <code>save "900 1"</code> keeps a slow snapshot cadence purely for the offsite copy. Even so, a single Redis with <code>always</code> is not a durability story on its own: the host can still be destroyed, so a real payment queue adds a replica and, where the consequences justify it, <code>WAIT</code> to require acknowledgement from that replica before considering the write safe.</p>
<p>The <code>CONFIG REWRITE</code> step carries the sharpest operational lesson in the module. Everything applied here lives in memory only. <code>CONFIG REWRITE</code> writes the running configuration back into the file the server was started from, preserving comments and structure; without a config file it fails with <em>ERR The server is running without a config file</em>, which is the normal state of the official Docker image. So in a container the durable place for these settings is the image's command line, a mounted <code>redis.conf</code>, or your orchestration manifest — never a <code>CONFIG SET</code> typed during an incident, which will silently revert at the next restart and take your durability with it. Restoring the defaults at the end matters for the same reason a lab must be left as it was found: the next person to use this server will read <code>CONFIG GET</code> and trust what it says.</p>`,
  },
];

// ---- emit payload + verify (verify built from solutionCodeJson) ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VERIFY, { recursive: true });

const clean = exercises.map((ex) => ({
  title: ex.title, difficulty: ex.difficulty, estimatedMinutes: ex.estimatedMinutes, points: ex.points,
  concepts: ex.concepts, prerequisites: ex.prerequisites, tags: ex.tags,
  problemHtml: ex.problemHtml, inputSpec: ex.inputSpec, outputSpec: ex.outputSpec, constraints: ex.constraints,
  examplesJson: ex.examplesJson, hintsJson: ex.hintsJson,
  starterCodeJson: [{ name: 'commands.redis', language: L, code: ex.starter }],
  solutionCodeJson: [{ name: 'commands.redis', language: L, code: ex.solution }],
  solutionExplanationHtml: ex.solutionExplanationHtml,
  ...(ex.diagramMermaid ? { diagramMermaid: ex.diagramMermaid } : {}),
}));
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));

// Harness: stock-defaults prologue, then per exercise ECHO + FLUSHALL + solution + 1s pause so
// BGSAVE / BGREWRITEAOF children are reaped by serverCron before the next exercise runs.
let cmds = `ECHO "========== PROLOGUE: reset to stock defaults =========="
CONFIG SET appendonly no
CONFIG SET appendfsync everysec
CONFIG SET save "${DEFAULT_SAVE}"
FLUSHALL
BLPOP __verify_wait__ 1
`;
exercises.forEach((ex, i) => {
  cmds += `ECHO "========== EX ${i + 1}: ${ex.title.replace(/"/g, '')} =========="\n`;
  cmds += 'FLUSHALL\n' + ex.solution + '\nBLPOP __verify_wait__ 1\n';
});
cmds += `ECHO "========== EPILOGUE: confirm stock defaults restored =========="
CONFIG GET save
CONFIG GET appendonly
CONFIG GET appendfsync
`;
fs.writeFileSync(path.join(VERIFY, `redis-426.txt`), cmds);

const parsed = JSON.parse(fs.readFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), 'utf8'));
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
const titles = new Set();
parsed.exercises.forEach((ex, i) => {
  if (ex.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} diff ${ex.difficulty} != ${diffs[i]}`);
  if (titles.has(ex.title)) throw new Error(`duplicate title ${ex.title}`);
  titles.add(ex.title);
  if (ex.problemHtml.length < 900) throw new Error(`problemHtml<900 ${ex.title} (${ex.problemHtml.length})`);
  if (ex.solutionExplanationHtml.length < 500) throw new Error(`expl<500 ${ex.title}`);
  if (ex.hintsJson.length < 4) throw new Error(`<4 hints ${ex.title}`);
  if (ex.examplesJson.length < 2) throw new Error(`<2 examples ${ex.title}`);
  if (/^\s*[#/]/m.test(ex.solutionCodeJson.map((f) => f.code).join('\n'))) throw new Error(`comment line in solution ${ex.title}`);
  if (/____/.test(ex.solutionCodeJson.map((f) => f.code).join('\n'))) throw new Error(`blank left in solution ${ex.title}`);
  const solLen = ex.solutionCodeJson.map((f) => f.code).join('').length;
  if (solLen < 205) throw new Error(`solution<205 (seeder floor 200) ${ex.title} (${solLen})`);
});
console.log(`OK ${parsed.exercises.length} exercises -> ${trackSlug}__${moduleSlug}.json`);
