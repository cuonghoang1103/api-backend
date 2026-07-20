// Redis module 735 (redis-streams-and-event-driven-architecture) — 10 exercises.
// Track language text; pure redis-cli command sequences. Documented outputs use --no-raw.
// EVERY XADD uses an EXPLICIT id (1-1, 2-1, ...) so output is deterministic; XPENDING is always
// the SUMMARY form and XINFO GROUPS is used (no idle/inactive fields) so nothing depends on wall
// time. Verified by piping the exact shipped solution to a real redis:7.4.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'redis';
const moduleSlug = 'redis-streams-and-event-driven-architecture';
const L = 'text';

const exercises = [
  {
    title: 'Append Events to a Stream with XADD and Count with XLEN',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['stream', 'XADD', 'entry ID', 'field-value pairs', 'XLEN'],
    prerequisites: ['redis-cli', 'key basics'],
    tags: ['streams', 'xadd', 'xlen', 'append-log', 'redis'],
    problemHtml: `<p>A Redis <strong>stream</strong> is an append-only log of entries. Each entry has an <em>ID</em> and an arbitrary set of field-value pairs — like a row with a timestamp and columns. This makes streams the natural structure for event-driven systems: producers append events, and one or more consumers read them in order, now or later. An entry ID has the form <code>ms-seq</code> (milliseconds-sequence); passing <code>*</code> lets Redis generate a time-based ID, but you can also supply an explicit ID as long as each new ID is strictly greater than the last.</p>
<p>Using <code>redis-cli</code>, build a small order log with explicit IDs so the results are reproducible:</p>
<ul>
<li><code>XADD orders 1-1 item book qty 2</code> appends an entry and returns its ID <code>"1-1"</code>. Add two more: <code>2-1</code> (pen, qty 5) and <code>3-1</code> (lamp, qty 1).</li>
<li><code>XLEN orders</code> reports how many entries the stream holds — <code>3</code>.</li>
<li><code>XRANGE orders - +</code> lists all entries in ID order, each as its ID followed by its flattened field-value pairs.</li>
<li>Append a fourth entry <code>4-1</code> (mug, qty 3); <code>XLEN orders</code> is now <code>4</code>.</li>
<li>Read just the first entry with <code>XRANGE orders - + COUNT 1</code>, and read a single entry directly with <code>XRANGE orders 4-1 4-1</code>.</li>
</ul>
<p>Every entry carries its own fields, and IDs always increase. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database. Entries are appended with explicit increasing IDs.',
    outputSpec: 'XADD returns each ID ("1-1", "2-1", "3-1"); XLEN is 3, then 4 after the fourth append; XRANGE lists entries in ID order with their fields.',
    constraints: 'Use explicit IDs (1-1, 2-1, ...) so results are reproducible. Each ID must be strictly greater than the previous. Do not use the * auto-ID here.',
    examplesJson: [
      { input: 'XADD orders 1-1 item book qty 2', output: '"1-1"', explanation: 'XADD appends the entry and returns the ID you supplied.' },
      { input: 'XLEN orders after three appends', output: '(integer) 3', explanation: 'XLEN counts the entries currently stored in the stream.' },
      { input: 'XRANGE orders - + (first entry)', output: '1) "1-1" 2) ["item","book","qty","2"]', explanation: 'Each entry is its ID followed by the flattened field-value list.' },
    ],
    hintsJson: [
      'A stream is an append-only log; XADD adds one entry with an ID and field-value pairs.',
      'XADD key id field value [field value ...] returns the entry ID.',
      'Use explicit increasing IDs like 1-1, 2-1, 3-1 for reproducible output.',
      'XLEN key returns the number of entries; XRANGE key - + lists them all.',
    ],
    starter: `XADD orders 1-1 item book qty 2
XADD orders 2-1 item pen qty 5
XADD orders 3-1 item lamp qty 1
XLEN orders
XRANGE orders - +
XADD orders 4-1 item mug qty 3
XLEN orders
XRANGE orders - + COUNT 1
XRANGE orders 4-1 4-1`,
    solution: `XADD orders 1-1 item book qty 2
XADD orders 2-1 item pen qty 5
XADD orders 3-1 item lamp qty 1
XLEN orders
XRANGE orders - +
XADD orders 4-1 item mug qty 3
XLEN orders
XRANGE orders - + COUNT 1
XRANGE orders 4-1 4-1`,
    solutionExplanationHtml: `<p><code>XADD</code> appends one entry to a stream and returns its ID. An entry is an ID plus any number of field-value pairs, so <code>XADD orders 1-1 item book qty 2</code> stores <code>{item: book, qty: 2}</code> under ID <code>1-1</code> and echoes back <code>"1-1"</code>. The ID has two parts, <code>ms-seq</code>: the left part is a millisecond timestamp and the right part a sequence number that disambiguates entries created in the same millisecond. Here explicit IDs (<code>1-1</code>, <code>2-1</code>, <code>3-1</code>) are used purely so the output is reproducible; in production you almost always pass <code>*</code> and let Redis assign a real time-based ID, which guarantees monotonic ordering for free.</p>
<p>The one hard rule is monotonicity: each new ID must be strictly greater than the stream's current last ID, or <code>XADD</code> errors with <em>The ID specified in XADD is equal or smaller than the target stream top item</em>. That is what makes a stream a true ordered log — entries can never be inserted in the past. <code>XLEN</code> returns the logical number of entries (here 3, then 4), and <code>XRANGE key - +</code> reads them all in ID order, where <code>-</code> and <code>+</code> are the special minimum and maximum IDs. Unlike a Redis list, a stream keeps each entry's ID and structured fields and supports range queries and consumer groups — the features the rest of this module builds on.</p>`,
  },
  {
    title: 'Read Entries by Range with XRANGE and XREVRANGE',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['XRANGE', 'XREVRANGE', 'range boundaries', 'COUNT limit', 'reverse order'],
    prerequisites: ['XADD', 'entry ID'],
    tags: ['streams', 'xrange', 'xrevrange', 'range', 'redis'],
    problemHtml: `<p>Once events are in a stream you query them by ID range. <code>XRANGE key start end</code> returns entries with IDs between <code>start</code> and <code>end</code> inclusive, in ascending order; <code>XREVRANGE key end start</code> returns them descending. The special IDs <code>-</code> (smallest possible) and <code>+</code> (largest possible) mean "from the very beginning" and "to the very end". A <code>COUNT n</code> clause caps how many entries come back, which is how you page through a large log.</p>
<p>Populate a log and query it with <code>redis-cli</code>:</p>
<ul>
<li>Append five entries with IDs <code>1-1</code> … <code>5-1</code>, each a single field <code>msg</code> = a, b, c, d, e.</li>
<li><code>XRANGE log - +</code> returns all five in order.</li>
<li><code>XRANGE log - + COUNT 2</code> returns only the first two (<code>1-1</code>, <code>2-1</code>).</li>
<li><code>XRANGE log 2-1 4-1</code> returns the three entries in that inclusive ID window.</li>
<li><code>XREVRANGE log + - COUNT 1</code> returns just the newest entry (<code>5-1</code>).</li>
<li>Page forward past an entry with the exclusive bound <code>(</code>: <code>XRANGE log (2-1 + COUNT 2</code> starts strictly after <code>2-1</code>, returning <code>3-1</code> and <code>4-1</code>.</li>
</ul>
<p>Boundaries are inclusive unless prefixed with <code>(</code>, and <code>COUNT</code> limits the page size. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database with five entries (IDs 1-1..5-1, field msg a..e).',
    outputSpec: 'XRANGE - + returns all five; COUNT 2 returns the first two; XRANGE 2-1 4-1 returns three; XREVRANGE + - COUNT 1 returns only entry 5-1.',
    constraints: 'Use - and + for open boundaries. Use COUNT to limit results. XREVRANGE takes its bounds in reverse order (end first, then start).',
    examplesJson: [
      { input: 'XRANGE log - + COUNT 2', output: 'entries 1-1 (msg a) and 2-1 (msg b)', explanation: 'Ascending order from the start, capped at two entries by COUNT.' },
      { input: 'XREVRANGE log + - COUNT 1', output: 'entry 5-1 (msg e)', explanation: 'XREVRANGE walks newest-first, so COUNT 1 returns the most recent entry.' },
      { input: 'XRANGE log 2-1 4-1', output: 'entries 2-1, 3-1, 4-1', explanation: 'Both bounds are inclusive, so the window returns three entries.' },
    ],
    hintsJson: [
      'XRANGE reads a range of entries by ID; the bounds are inclusive.',
      'Use - for the minimum ID and + for the maximum ID to read everything.',
      'COUNT n limits how many entries return — the basis for pagination.',
      'XREVRANGE key + - walks the stream newest-first (note the reversed bounds).',
    ],
    starter: `XADD log 1-1 msg a
XADD log 2-1 msg b
XADD log 3-1 msg c
XADD log 4-1 msg d
XADD log 5-1 msg e
XRANGE log - +
XRANGE log - + COUNT 2
XRANGE log 2-1 4-1
XREVRANGE log + - COUNT 1
XREVRANGE log + -
XRANGE log (2-1 + COUNT 2`,
    solution: `XADD log 1-1 msg a
XADD log 2-1 msg b
XADD log 3-1 msg c
XADD log 4-1 msg d
XADD log 5-1 msg e
XRANGE log - +
XRANGE log - + COUNT 2
XRANGE log 2-1 4-1
XREVRANGE log + - COUNT 1
XREVRANGE log + -
XRANGE log (2-1 + COUNT 2`,
    solutionExplanationHtml: `<p><code>XRANGE</code> is the fundamental read for streams: it returns every entry whose ID falls in <code>[start, end]</code>, ascending. The special bounds <code>-</code> and <code>+</code> stand for the smallest and largest possible IDs, so <code>XRANGE log - +</code> reads the whole stream, while an explicit window like <code>XRANGE log 2-1 4-1</code> returns exactly the three entries in that inclusive range. Because IDs sort numerically by <code>ms</code> then <code>seq</code>, ranges are cheap: the stream is stored as a radix tree, so range scans are efficient even on large logs.</p>
<p>The <code>COUNT n</code> clause is what turns range reads into pagination. To page forward through a big stream you read <code>XRANGE key <last-seen-id> + COUNT n</code> repeatedly — but note the boundary is inclusive, so to avoid re-reading the last entry you advance the start using the exclusive form <code>(</code> (for example <code>XRANGE log (2-1 + COUNT 2</code> starts strictly after <code>2-1</code>). <code>XREVRANGE</code> is the mirror image and takes its bounds reversed — <code>end</code> first, then <code>start</code> — so <code>XREVRANGE log + - COUNT 1</code> is the idiomatic way to fetch just the latest entry. Between them, <code>XRANGE</code> and <code>XREVRANGE</code> cover time-travel reads, tailing the head, and paging, all without consuming or removing anything — reads never mutate a stream.</p>`,
  },
  {
    title: 'Consume New Entries with XREAD',
    difficulty: 'MEDIUM', estimatedMinutes: 25, points: 15,
    concepts: ['XREAD', 'last-seen ID', 'exclusive read', 'COUNT', 'multiple streams'],
    prerequisites: ['XADD', 'XRANGE'],
    tags: ['streams', 'xread', 'consume', 'cursor', 'redis'],
    problemHtml: `<p>Where <code>XRANGE</code> queries by a fixed window, <code>XREAD</code> is designed for <em>consuming</em>: you tell it the last ID you have already seen, and it returns only entries with a <strong>greater</strong> ID. That makes the ID your cursor — pass the ID of the last entry you processed and you get just the ones after it. <code>XREAD</code> can watch several streams at once and, with a <code>BLOCK</code> option (not used here), wait for new data; without <code>BLOCK</code> it returns immediately with whatever is available.</p>
<p>Using <code>redis-cli</code>:</p>
<ul>
<li>Append three entries to <code>stream</code> with IDs <code>1-1</code>, <code>2-1</code>, <code>3-1</code> (field <code>v</code> = one, two, three).</li>
<li><code>XREAD COUNT 2 STREAMS stream 0</code> reads from the beginning (ID <code>0</code> means "greater than 0"), returning the first two entries.</li>
<li><code>XREAD STREAMS stream 2-1</code> returns only entries after <code>2-1</code> — just <code>3-1</code>.</li>
<li><code>XREAD COUNT 5 STREAMS stream 0</code> returns all three.</li>
<li><code>XREAD COUNT 1 STREAMS stream 1-1</code> returns only <code>2-1</code> (the next entry after the cursor).</li>
<li><code>XREAD STREAMS stream 3-1</code> returns <code>(nil)</code> — there is nothing newer than the last entry.</li>
</ul>
<p>The ID after <code>STREAMS</code> is a last-seen cursor, and the match is strictly greater-than. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database with three entries in stream (IDs 1-1,2-1,3-1; field v one/two/three).',
    outputSpec: 'XREAD ... 0 COUNT 2 returns entries 1-1 and 2-1; XREAD ... 2-1 returns only 3-1; XREAD ... 0 COUNT 5 returns all three. Output is nested under the stream name.',
    constraints: 'The ID after STREAMS is the last-seen cursor and the match is exclusive (strictly greater). Do not use BLOCK (it would wait). Use 0 to read from the start.',
    examplesJson: [
      { input: 'XREAD STREAMS stream 2-1', output: 'only entry 3-1 (v three)', explanation: 'XREAD returns entries with an ID strictly greater than the given cursor 2-1.' },
      { input: 'XREAD COUNT 2 STREAMS stream 0', output: 'entries 1-1 and 2-1', explanation: 'Cursor 0 means from the beginning; COUNT caps the batch at two.' },
      { input: 'XREAD result shape', output: '1) 1) "stream" 2) [entries]', explanation: 'Results are grouped by stream: the name, then its matching entries.' },
    ],
    hintsJson: [
      'XREAD consumes forward: it returns entries newer than a last-seen ID.',
      'XREAD [COUNT n] STREAMS key id — the id is your cursor and the match is exclusive.',
      'Pass 0 as the id to read from the very beginning of the stream.',
      'Results nest under the stream name so one call can read several streams at once.',
    ],
    starter: `XADD stream 1-1 v one
XADD stream 2-1 v two
XADD stream 3-1 v three
XREAD COUNT 2 STREAMS stream 0
XREAD STREAMS stream 2-1
XREAD COUNT 5 STREAMS stream 0
XLEN stream
XREAD COUNT 1 STREAMS stream 1-1
XREAD STREAMS stream 3-1`,
    solution: `XADD stream 1-1 v one
XADD stream 2-1 v two
XADD stream 3-1 v three
XREAD COUNT 2 STREAMS stream 0
XREAD STREAMS stream 2-1
XREAD COUNT 5 STREAMS stream 0
XLEN stream
XREAD COUNT 1 STREAMS stream 1-1
XREAD STREAMS stream 3-1`,
    solutionExplanationHtml: `<p><code>XREAD</code> treats an entry ID as a cursor and returns only entries strictly newer than it, which is exactly what a consumer needs: process a batch, remember the last ID, and next time ask for everything after it. <code>XREAD COUNT 2 STREAMS stream 0</code> starts from <code>0</code> (a synthetic "before everything" cursor, so it returns entries with ID &gt; 0) and <code>COUNT</code> caps the batch at two; <code>XREAD STREAMS stream 2-1</code> passes <code>2-1</code> as the cursor and therefore returns only <code>3-1</code>. The reply is grouped by stream — <code>1) 1) "stream" 2) [entries]</code> — because a single <code>XREAD</code> can read from many streams in one round trip by listing several keys and then an equal number of cursors.</p>
<p>Two design points matter. First, the match is <em>exclusive</em>: you never re-receive the entry whose ID you passed, so there is no off-by-one when advancing the cursor. Second, in a real consumer you replace the fixed <code>0</code> with the special <code>$</code> id, which means "only entries added after this call blocks", and add <code>BLOCK ms</code> so the connection parks until new data arrives instead of busy-polling — the classic <code>XREAD BLOCK 0 STREAMS key $</code> tailing loop. Those are omitted here only because blocking would stall a scripted run. Plain <code>XREAD</code>, however, has one big limitation for scaling out: every consumer that reads the same stream sees <em>every</em> entry, and Redis tracks nothing about what each has processed. To split work across a pool of workers with server-side tracking and acknowledgements, you need consumer groups — the subject of the next exercises.</p>`,
  },
  {
    title: 'Cap Stream Length with MAXLEN and XTRIM',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 20,
    concepts: ['MAXLEN', 'XTRIM', 'capped stream', 'approximate trimming', 'MINID'],
    prerequisites: ['XADD', 'XLEN'],
    tags: ['streams', 'maxlen', 'xtrim', 'retention', 'redis'],
    problemHtml: `<p>A stream grows forever unless you bound it, and an unbounded event log will eventually exhaust memory. Redis gives you two trimming tools: an inline <code>MAXLEN</code> clause on <code>XADD</code> that caps the length as you append, and the standalone <code>XTRIM</code> command that trims an existing stream. Trimming always removes the <em>oldest</em> entries first, keeping the most recent ones.</p>
<p>Using <code>redis-cli</code> with exact (not approximate) trimming:</p>
<ul>
<li>Append entries <code>1-1</code>, <code>2-1</code>, <code>3-1</code> (field <code>n</code> = 1,2,3).</li>
<li><code>XADD cap MAXLEN 3 4-1 n 4</code> appends the fourth and trims to 3, dropping the oldest — <code>XLEN</code> is <code>3</code> and <code>XRANGE</code> shows <code>2-1</code>…<code>4-1</code>.</li>
<li><code>XADD cap MAXLEN 3 5-1 n 5</code> keeps it at 3 — now <code>3-1</code>…<code>5-1</code>.</li>
<li><code>XTRIM cap MAXLEN 2</code> trims further to the newest 2 — <code>XLEN</code> is <code>2</code>, showing <code>4-1</code> and <code>5-1</code>.</li>
<li><code>XTRIM cap MINID 5</code> trims by ID instead of count, dropping everything older than <code>5-1</code> — <code>XLEN</code> is <code>1</code>, leaving only <code>5-1</code>.</li>
</ul>
<p>Oldest entries go first; the newest survive. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database; entries appended with explicit IDs and capped with MAXLEN/XTRIM.',
    outputSpec: 'After MAXLEN 3 appends, XLEN is 3 (entries 2-1..4-1, then 3-1..5-1). After XTRIM MAXLEN 2, XLEN is 2 (entries 4-1, 5-1). Oldest entries are removed first.',
    constraints: 'Use the exact form MAXLEN n (not MAXLEN ~ n). Trimming removes the oldest entries. XTRIM returns the number of entries removed.',
    examplesJson: [
      { input: 'XADD cap MAXLEN 3 4-1 n 4 (stream had 1-1,2-1,3-1)', output: 'XLEN 3, entries 2-1,3-1,4-1', explanation: 'Adding the 4th with MAXLEN 3 drops the oldest entry 1-1.' },
      { input: 'XTRIM cap MAXLEN 2', output: '(integer) 1, leaving entries 4-1,5-1', explanation: 'XTRIM removes the oldest entry to reach length 2 and returns how many it removed.' },
    ],
    hintsJson: [
      'A stream needs a retention bound or it grows without limit.',
      'XADD key MAXLEN n id ... caps the length while appending, dropping oldest entries.',
      'XTRIM key MAXLEN n trims an existing stream and returns the number removed.',
      'For performance in production, MAXLEN ~ n trims approximately; MINID caps by age instead of count.',
    ],
    starter: `XADD cap 1-1 n 1
XADD cap 2-1 n 2
XADD cap 3-1 n 3
XADD cap MAXLEN 3 4-1 n 4
XLEN cap
XRANGE cap - +
XADD cap MAXLEN 3 5-1 n 5
XLEN cap
XRANGE cap - +
XTRIM cap MAXLEN 2
XLEN cap
XRANGE cap - +
XTRIM cap MINID 5
XLEN cap
XRANGE cap - +`,
    solution: `XADD cap 1-1 n 1
XADD cap 2-1 n 2
XADD cap 3-1 n 3
XADD cap MAXLEN 3 4-1 n 4
XLEN cap
XRANGE cap - +
XADD cap MAXLEN 3 5-1 n 5
XLEN cap
XRANGE cap - +
XTRIM cap MAXLEN 2
XLEN cap
XRANGE cap - +
XTRIM cap MINID 5
XLEN cap
XRANGE cap - +`,
    solutionExplanationHtml: `<p>Trimming keeps a stream bounded by discarding its oldest entries. The inline <code>XADD cap MAXLEN 3 4-1 n 4</code> appends entry <code>4-1</code> and then enforces a maximum length of 3, so the oldest entry <code>1-1</code> is evicted and the stream holds <code>2-1</code>…<code>4-1</code>. Appending <code>5-1</code> under the same cap evicts <code>2-1</code>, leaving <code>3-1</code>…<code>5-1</code>. <code>XTRIM cap MAXLEN 2</code> then trims independently of any append, removing the oldest until only the newest two remain (<code>4-1</code>, <code>5-1</code>) and returning the count of entries it removed. Trimming is always from the head (oldest), never the tail, because a stream is an ordered log and the recent entries are the ones consumers still care about.</p>
<p>In production two refinements matter. Exact trimming (<code>MAXLEN 3</code>) must remove entries precisely, which can be costly under load, so Redis offers <em>approximate</em> trimming with the <code>~</code> modifier (<code>XADD cap MAXLEN ~ 1000 ...</code>): it trims in efficient whole-node batches and may temporarily keep a few extra entries, trading exactness for speed — almost always the right choice for a capped buffer. The alternative bound is <code>MINID</code>, which trims by ID rather than count (<code>XTRIM cap MINID <id></code> or <code>XADD ... MINID <id> ...</code>), letting you drop everything older than, say, a timestamp-derived ID for time-based retention. Note that <code>MAXLEN</code> caps physical length but does not by itself track whether consumer groups have processed the trimmed entries — trimming can discard entries a lagging group has not yet read, so size the cap against your slowest consumer.</p>`,
  },
  {
    title: 'Remove Entries with XDEL and Understand the ID Space',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 20,
    concepts: ['XDEL', 'logical length', 'ID monotonicity', 'tombstone', 'XLEN vs last-id'],
    prerequisites: ['XADD', 'XLEN', 'XRANGE'],
    tags: ['streams', 'xdel', 'delete', 'id-space', 'redis'],
    problemHtml: `<p>Sometimes you must remove a specific entry — a bad event, a GDPR erasure — rather than trim by age. <code>XDEL key id [id ...]</code> deletes entries by ID and returns how many it actually removed. A subtle but important property: deleting entries does <strong>not</strong> rewind the stream's internal last-ID counter, so IDs keep marching forward and you can never reuse a deleted ID. <code>XLEN</code> reflects the logical count of surviving entries.</p>
<p>Using <code>redis-cli</code>:</p>
<ul>
<li>Append <code>1-1</code>, <code>2-1</code>, <code>3-1</code> (field <code>a</code> = x,y,z). <code>XLEN</code> is <code>3</code>.</li>
<li><code>XDEL s 2-1</code> removes the middle entry (returns <code>1</code>); <code>XLEN</code> drops to <code>2</code> and <code>XRANGE</code> shows only <code>1-1</code> and <code>3-1</code>.</li>
<li><code>XDEL s 1-1 3-1</code> removes both remaining (returns <code>2</code>); <code>XLEN</code> is <code>0</code>.</li>
<li>Append <code>4-1</code> — it succeeds because the last-ID counter is still at <code>3-1</code>, so <code>4-1</code> is a valid, strictly-greater ID even though the stream is otherwise empty.</li>
<li><code>XDEL s 9-9</code> on an ID that was never added returns <code>0</code> — nothing matched.</li>
<li>Append <code>5-1</code> and <code>6-1</code>, then <code>XDEL s 5-1</code> (returns <code>1</code>); <code>XLEN</code> is <code>2</code> and the survivors are <code>4-1</code> and <code>6-1</code>.</li>
</ul>
<p>Deleted IDs are gone forever; the counter never goes back. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database; three entries appended then selectively deleted.',
    outputSpec: 'XDEL returns the number removed (1, then 2). XLEN falls 3 -> 2 -> 0. A later XADD 4-1 still succeeds because the stream last-ID stays at 3-1.',
    constraints: 'XDEL removes by exact ID and returns the count removed. Deleting does not reset the last-ID counter, so a new ID must still be greater than the highest ID ever used.',
    examplesJson: [
      { input: 'XDEL s 2-1 (stream has 1-1,2-1,3-1)', output: '(integer) 1', explanation: 'One entry matched and was removed; XLEN then reports 2.' },
      { input: 'XADD s 4-1 a w after deleting everything', output: '"4-1"', explanation: 'The last-ID counter is still 3-1, so 4-1 is valid even though the stream is empty.' },
    ],
    hintsJson: [
      'XDEL removes specific entries by ID, unlike XTRIM which drops the oldest by count.',
      'XDEL key id [id ...] returns how many of the given IDs were actually present and removed.',
      'Deleting entries does not lower the stream last-ID; the ID counter only ever moves forward.',
      'So after deleting everything, a new XADD must still use an ID greater than the highest ever used.',
    ],
    starter: `XADD s 1-1 a x
XADD s 2-1 a y
XADD s 3-1 a z
XLEN s
XDEL s 2-1
XLEN s
XRANGE s - +
XDEL s 1-1 3-1
XLEN s
XADD s 4-1 a w
XRANGE s - +
XDEL s 9-9
XADD s 5-1 a v
XADD s 6-1 a u
XDEL s 5-1
XLEN s
XRANGE s - +
XREVRANGE s + -`,
    solution: `XADD s 1-1 a x
XADD s 2-1 a y
XADD s 3-1 a z
XLEN s
XDEL s 2-1
XLEN s
XRANGE s - +
XDEL s 1-1 3-1
XLEN s
XADD s 4-1 a w
XRANGE s - +
XDEL s 9-9
XADD s 5-1 a v
XADD s 6-1 a u
XDEL s 5-1
XLEN s
XRANGE s - +
XREVRANGE s + -`,
    solutionExplanationHtml: `<p><code>XDEL</code> removes entries by exact ID and returns how many of the supplied IDs it actually deleted, so <code>XDEL s 2-1</code> returns <code>1</code> and drops the logical length to 2, while <code>XDEL s 1-1 3-1</code> returns <code>2</code> and empties the stream. This is the tool for surgical removal — one bad event, a record that must be erased — as opposed to <code>XTRIM</code>, which bulk-drops the oldest entries by a length or ID bound. After a delete, <code>XRANGE</code> confirms the survivors, and <code>XLEN</code> always reports the current logical count.</p>
<p>The property to internalise is that deletion never rewinds the ID space. A stream stores its highest-ever ID as a "last generated" watermark, and that watermark is <em>not</em> lowered by <code>XDEL</code> — even emptying the stream leaves it at <code>3-1</code>, which is why the later <code>XADD s 4-1</code> succeeds (4-1 is still strictly greater) whereas an attempt to reuse <code>3-1</code> would fail. This guarantees IDs are globally monotonic for the life of the stream, so a consumer's stored cursor can never accidentally collide with a recycled ID. One efficiency caveat: <code>XDEL</code> marks entries as deleted within the stream's macro-node structure but does not always reclaim the memory immediately — the space is freed when the whole node is eventually trimmed away — so <code>XDEL</code> is for correctness (removing specific entries), while <code>XTRIM</code>/<code>MAXLEN</code> remain the tools for bounding overall memory.</p>`,
  },
  {
    title: 'Create a Consumer Group and Read with XREADGROUP',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['XGROUP CREATE', 'XREADGROUP', 'consumer group', 'special > ID', 'pending entries list'],
    prerequisites: ['XADD', 'XREAD'],
    tags: ['streams', 'consumer-groups', 'xreadgroup', 'xgroup', 'redis'],
    problemHtml: `<p>Plain <code>XREAD</code> delivers every entry to every reader — useless for splitting work across a pool of workers. A <strong>consumer group</strong> fixes that: the group has one shared cursor, and each entry is delivered to exactly one consumer in the group, which must later acknowledge it. This is Redis's built-in work queue with at-least-once delivery.</p>
<p>Using <code>redis-cli</code>:</p>
<ul>
<li>Append three jobs to <code>tasks</code> (IDs <code>1-1</code>, <code>2-1</code>, <code>3-1</code>; field <code>job</code> = a,b,c).</li>
<li><code>XGROUP CREATE tasks g1 0</code> creates a group whose cursor starts at <code>0</code> (the beginning), so it will deliver every existing entry.</li>
<li><code>XREADGROUP GROUP g1 worker1 COUNT 2 STREAMS tasks &gt;</code> reads as <code>worker1</code>. The special ID <code>&gt;</code> means "entries never delivered to this group", so it returns <code>1-1</code> and <code>2-1</code> and records them as pending for <code>worker1</code>.</li>
<li>A second <code>XREADGROUP … &gt;</code> returns the remaining <code>3-1</code>.</li>
<li><code>XACK tasks g1 1-1</code> acknowledges one; <code>XPENDING tasks g1</code> shows the still-unacknowledged count.</li>
</ul>
<p>The <code>&gt;</code> ID and per-consumer pending tracking are the core ideas. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database with three entries in tasks; a group g1 is created at 0.',
    outputSpec: 'XREADGROUP with > delivers new entries once (1-1,2-1 then 3-1) and records them as pending. After XACK 1-1, XPENDING summary shows 2 pending (2-1..3-1) for worker1.',
    constraints: 'Create the group with XGROUP CREATE (start id 0 to consume from the beginning). Use the special ID > to get never-yet-delivered entries. Acknowledge with XACK.',
    examplesJson: [
      { input: 'XREADGROUP GROUP g1 worker1 COUNT 2 STREAMS tasks >', output: 'entries 1-1 and 2-1', explanation: 'The > ID delivers new entries and records them as pending for worker1.' },
      { input: 'XPENDING tasks g1 after XACK 1-1', output: '1) (integer) 2 2) "2-1" 3) "3-1" 4) worker1 -> 2', explanation: 'One entry was acknowledged; two remain pending, both owned by worker1.' },
    ],
    hintsJson: [
      'A consumer group shares one cursor and hands each entry to exactly one consumer.',
      'XGROUP CREATE key group id — use 0 to start at the beginning, $ to start at only-new.',
      'XREADGROUP GROUP g consumer STREAMS key > delivers entries never yet given to the group.',
      'Delivered-but-unacknowledged entries sit in the Pending Entries List until XACK.',
    ],
    starter: `XADD tasks 1-1 job a
XADD tasks 2-1 job b
XADD tasks 3-1 job c
XGROUP CREATE tasks g1 0
XREADGROUP GROUP g1 worker1 COUNT 2 STREAMS tasks >
XREADGROUP GROUP g1 worker1 STREAMS tasks >
XACK tasks g1 1-1
XPENDING tasks g1`,
    solution: `XADD tasks 1-1 job a
XADD tasks 2-1 job b
XADD tasks 3-1 job c
XGROUP CREATE tasks g1 0
XREADGROUP GROUP g1 worker1 COUNT 2 STREAMS tasks >
XREADGROUP GROUP g1 worker1 STREAMS tasks >
XACK tasks g1 1-1
XPENDING tasks g1`,
    solutionExplanationHtml: `<p>A consumer group turns a stream into a shared work queue. <code>XGROUP CREATE tasks g1 0</code> registers a group named <code>g1</code> whose delivery cursor starts at <code>0</code>, meaning it will hand out every entry from the beginning (pass <code>$</code> instead to start with only entries added after creation). Each call to <code>XREADGROUP GROUP g1 worker1 ... STREAMS tasks &gt;</code> reads on behalf of a named consumer, and the special ID <code>&gt;</code> requests entries the group has <em>never</em> delivered to anyone. So the first call gives <code>worker1</code> entries <code>1-1</code> and <code>2-1</code>, the second gives <code>3-1</code>, and no entry is ever delivered to two consumers of the same group — that is how work is partitioned across a pool.</p>
<p>The other half of the mechanism is tracking. When an entry is delivered via <code>&gt;</code>, Redis records it in the group's <strong>Pending Entries List</strong> (PEL) against the consumer that received it, and it stays there until the consumer calls <code>XACK tasks g1 <id></code>. <code>XACK</code> confirms successful processing and removes the entry from the PEL; here acknowledging <code>1-1</code> leaves two pending. <code>XPENDING tasks g1</code> in its summary form reports the total pending count, the smallest and largest pending IDs, and a per-consumer breakdown. This delivered-then-acknowledged model is what gives streams <em>at-least-once</em> delivery: if a consumer crashes after receiving but before acknowledging, the entry remains in the PEL and can be recovered — the subject of the claiming exercises ahead. Reading with an explicit ID other than <code>&gt;</code> (for example <code>0</code>) re-reads a consumer's own pending entries instead of new ones, which is how a restarted worker resumes its unfinished work.</p>`,
    diagramMermaid: `flowchart TD
  S[stream tasks] --> G[group g1 shared cursor]
  G -->|entry 1-1| W1[worker1]
  G -->|entry 2-1| W1
  G -->|entry 3-1| W1
  W1 -->|XACK| A[removed from PEL]
  W1 -->|no XACK| P[stays pending]`,
  },
  {
    title: 'Distribute and Track Work with XPENDING Across Consumers',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['competing consumers', 'load distribution', 'XPENDING summary', 'per-consumer PEL', 'partial acknowledgement'],
    prerequisites: ['consumer group', 'XREADGROUP', 'XACK'],
    tags: ['streams', 'xpending', 'consumers', 'load-balancing', 'redis'],
    problemHtml: `<p>The point of a consumer group is horizontal scaling: run several consumers and each takes a share of the entries. Redis hands new entries (<code>&gt;</code>) to whichever consumer asks, so two workers reading concurrently naturally split the load. <code>XPENDING</code> is your visibility into who is holding what and whether anything is stuck unacknowledged.</p>
<p>Using <code>redis-cli</code>, simulate two workers on a four-entry stream:</p>
<ul>
<li>Append <code>1-1</code>…<code>4-1</code> (field <code>t</code> = a,b,c,d) and create group <code>g</code> at <code>0</code>.</li>
<li><code>XREADGROUP GROUP g wA COUNT 2 STREAMS q &gt;</code> gives <code>wA</code> entries <code>1-1</code>, <code>2-1</code>.</li>
<li><code>XREADGROUP GROUP g wB COUNT 2 STREAMS q &gt;</code> gives <code>wB</code> entries <code>3-1</code>, <code>4-1</code>.</li>
<li><code>XPENDING q g</code> summary now shows <code>4</code> pending, min <code>1-1</code>, max <code>4-1</code>, split <code>wA:2, wB:2</code>.</li>
<li><code>XACK q g 1-1 2-1</code> acknowledges <code>wA</code>'s work; <code>XPENDING q g</code> now shows <code>2</code> pending, all owned by <code>wB</code>.</li>
</ul>
<p>Each consumer has its own slice of the PEL. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database with four entries; group g and two consumers wA, wB.',
    outputSpec: 'wA claims 1-1,2-1; wB claims 3-1,4-1. XPENDING summary shows 4 pending split wA:2/wB:2, then after XACK of wA\'s entries, 2 pending all under wB (min 3-1, max 4-1).',
    constraints: 'Two consumers read with > and each gets a distinct slice. Use the XPENDING summary form (no start/end/count) so the output has no idle-time fields. XACK can acknowledge several IDs at once.',
    examplesJson: [
      { input: 'XPENDING q g after both workers read', output: '1) (integer) 4 2) "1-1" 3) "4-1" 4) [[wA,2],[wB,2]]', explanation: 'Four entries pending, split two-and-two between the consumers.' },
      { input: 'XPENDING q g after XACK 1-1 2-1', output: '1) (integer) 2 2) "3-1" 3) "4-1" 4) [[wB,2]]', explanation: 'wA\'s entries are acknowledged; only wB\'s two remain pending.' },
    ],
    hintsJson: [
      'Run several consumers in one group and each XREADGROUP > takes a different slice.',
      'XPENDING key group (summary form) returns total, min id, max id, and a per-consumer count.',
      'XACK key group id [id ...] can acknowledge multiple entries in one call.',
      'Use the summary form (no IDLE/start/end) to avoid time-dependent output.',
    ],
    starter: `XADD q 1-1 t a
XADD q 2-1 t b
XADD q 3-1 t c
XADD q 4-1 t d
XGROUP CREATE q g 0
XREADGROUP GROUP g wA COUNT 2 STREAMS q >
XREADGROUP GROUP g wB COUNT 2 STREAMS q >
XPENDING q g
XACK q g 1-1 2-1
XPENDING q g`,
    solution: `XADD q 1-1 t a
XADD q 2-1 t b
XADD q 3-1 t c
XADD q 4-1 t d
XGROUP CREATE q g 0
XREADGROUP GROUP g wA COUNT 2 STREAMS q >
XREADGROUP GROUP g wB COUNT 2 STREAMS q >
XPENDING q g
XACK q g 1-1 2-1
XPENDING q g`,
    solutionExplanationHtml: `<p>This is the competing-consumers pattern that makes streams scale. Because <code>XREADGROUP … &gt;</code> hands each never-delivered entry to whichever consumer asks next, running <code>wA</code> and <code>wB</code> against the same group <code>g</code> splits the four entries two-and-two: <code>wA</code> holds <code>1-1</code>, <code>2-1</code> and <code>wB</code> holds <code>3-1</code>, <code>4-1</code>. Add more consumers and throughput rises without any change to the producer — the group is the coordination point. Each consumer's delivered-but-unacknowledged entries live in its own slice of the group's Pending Entries List.</p>
<p><code>XPENDING q g</code> in summary form is the at-a-glance health check: it returns the total number of pending entries, the smallest and largest pending IDs, and a per-consumer count — here <code>4</code> pending split <code>wA:2, wB:2</code>. After <code>XACK q g 1-1 2-1</code> clears <code>wA</code>'s two entries, the summary shows <code>2</code> pending, min <code>3-1</code>, max <code>4-1</code>, all under <code>wB</code>. This visibility is operationally essential: a consumer whose pending count keeps climbing is failing to acknowledge — stuck, crashing mid-task, or too slow — and the min pending ID tells you how far back the oldest unprocessed entry is. The extended form <code>XPENDING q g - + 10 [consumer]</code> drills into individual entries with their idle time and delivery count (used to find and reclaim stuck work), but the summary form is what you poll for a dashboard. The summary form is used here precisely because it contains no idle-time field, so its output is deterministic.</p>`,
  },
  {
    title: 'Reassign Stuck Entries with XAUTOCLAIM',
    difficulty: 'MEDIUM', estimatedMinutes: 35, points: 20,
    concepts: ['XAUTOCLAIM', 'ownership transfer', 'min-idle-time', 'recovery cursor', 'XCLAIM'],
    prerequisites: ['consumer group', 'XPENDING', 'XACK'],
    tags: ['streams', 'xautoclaim', 'recovery', 'ownership', 'redis'],
    problemHtml: `<p>When a consumer dies, its delivered-but-unacknowledged entries are stranded in the Pending Entries List under its name. Another consumer must take them over so the work still gets done — that is <strong>claiming</strong>. <code>XAUTOCLAIM</code> scans a group's pending entries older than a minimum idle time and transfers ownership to a new consumer in one command, returning a cursor to page through more.</p>
<p>Using <code>redis-cli</code>:</p>
<ul>
<li>Append <code>1-1</code>, <code>2-1</code>, <code>3-1</code> (field <code>t</code> = a,b,c) and create group <code>g</code> at <code>0</code>.</li>
<li><code>XREADGROUP GROUP g wA COUNT 3 STREAMS j &gt;</code> gives all three to <code>wA</code>, which then "crashes" (never acknowledges). <code>XPENDING j g</code> shows all 3 under <code>wA</code>.</li>
<li><code>XAUTOCLAIM j g wB 0 0</code> — with min-idle-time <code>0</code> and start cursor <code>0</code> — transfers all three pending entries to <code>wB</code>, returning the next cursor <code>0-0</code>, the claimed entries, and an empty deleted-list.</li>
<li><code>XPENDING j g</code> now shows all 3 under <code>wB</code>; after <code>XACK j g 1-1 2-1 3-1</code>, <code>XPENDING</code> shows <code>0</code> and <code>XINFO GROUPS j</code> confirms <code>pending 0</code>.</li>
</ul>
<p>Ownership moved from the dead consumer to the live one. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database; three entries all pending under a crashed consumer wA.',
    outputSpec: 'XAUTOCLAIM (min-idle 0, cursor 0) returns next cursor 0-0, the three entries, and an empty deleted list; ownership moves wA -> wB. After XACK of all three, XPENDING reports 0 pending.',
    constraints: 'Use XAUTOCLAIM group consumer min-idle-time start. Use min-idle-time 0 here so entries qualify immediately (deterministic). The returned cursor 0-0 means the scan is complete.',
    examplesJson: [
      { input: 'XAUTOCLAIM j g wB 0 0 (3 entries pending under wA)', output: '1) "0-0" 2) [entries 1-1,2-1,3-1] 3) (empty array)', explanation: 'All pending entries are reassigned to wB; cursor 0-0 signals no more to scan.' },
      { input: 'XPENDING j g after XACK of all three', output: '1) (integer) 0 2) (nil) 3) (nil) 4) (nil)', explanation: 'Every entry is acknowledged, so the group has nothing pending.' },
    ],
    hintsJson: [
      'A crashed consumer leaves entries stuck in its pending list; another consumer must claim them.',
      'XAUTOCLAIM key group new-consumer min-idle-time start reassigns matching pending entries.',
      'Use min-idle-time 0 to claim immediately (in production use e.g. 60000 ms so you only grab truly stale work).',
      'The first element of the reply is a cursor; 0-0 means the scan finished.',
    ],
    starter: `XADD j 1-1 t a
XADD j 2-1 t b
XADD j 3-1 t c
XGROUP CREATE j g 0
XREADGROUP GROUP g wA COUNT 3 STREAMS j >
XPENDING j g
XAUTOCLAIM j g wB 0 0
XPENDING j g
XACK j g 1-1 2-1 3-1
XPENDING j g
XLEN j
XINFO GROUPS j`,
    solution: `XADD j 1-1 t a
XADD j 2-1 t b
XADD j 3-1 t c
XGROUP CREATE j g 0
XREADGROUP GROUP g wA COUNT 3 STREAMS j >
XPENDING j g
XAUTOCLAIM j g wB 0 0
XPENDING j g
XACK j g 1-1 2-1 3-1
XPENDING j g
XLEN j
XINFO GROUPS j`,
    solutionExplanationHtml: `<p>Claiming is how a consumer group survives a dead worker. When <code>wA</code> reads three entries and never acknowledges them, they sit in the group's PEL owned by <code>wA</code> forever — no other consumer would ever get them via <code>&gt;</code>, because <code>&gt;</code> only delivers never-seen entries. <code>XAUTOCLAIM j g wB 0 0</code> solves this: it scans the pending entries whose idle time is at least the given minimum (<code>0</code> here, so everything qualifies), starting from cursor <code>0</code>, and transfers ownership of the matching entries to <code>wB</code>. The reply has three parts — the next cursor (<code>0-0</code>, meaning the scan is complete), the list of claimed entries with their data, and a list of IDs that were dropped because they no longer exist in the stream (empty here). After the claim, <code>XPENDING</code> shows all three under <code>wB</code>, and once <code>wB</code> acknowledges them the group's pending count is <code>0</code>.</p>
<p>The <code>min-idle-time</code> argument is the safety mechanism you must get right in production. Setting it to a realistic threshold such as <code>60000</code> (60 seconds) ensures you only reclaim entries that have genuinely been abandoned, not ones a healthy consumer is still actively processing — claiming too eagerly causes double processing. Because delivery is at-least-once, a reclaimed-then-processed entry may have been partly processed by the original owner, so handlers must be idempotent. <code>XAUTOCLAIM</code> (added in Redis 6.2) supersedes the older two-step dance of <code>XPENDING</code> to list stale IDs followed by <code>XCLAIM key group consumer min-idle id...</code> to grab specific ones; <code>XCLAIM</code> is still useful when you want to claim exact IDs with fine control, but <code>XAUTOCLAIM</code>'s cursor-based scan is the modern default for a periodic recovery sweep. A typical reaper loops <code>XAUTOCLAIM</code> with a real idle threshold, paging by the returned cursor until it comes back <code>0-0</code>.</p>`,
  },
  {
    title: 'Build a Reliable At-Least-Once Consumer with Crash Recovery',
    difficulty: 'HARD', estimatedMinutes: 50, points: 25,
    concepts: ['at-least-once delivery', 'crash recovery', 'partial acknowledgement', 'reclaim workflow', 'idempotency'],
    prerequisites: ['XREADGROUP', 'XACK', 'XPENDING', 'XAUTOCLAIM'],
    tags: ['streams', 'reliability', 'recovery', 'consumer-groups', 'redis'],
    problemHtml: `<p>This exercise assembles the full reliable-worker workflow: deliver, acknowledge what succeeds, and reclaim what a crashed worker left behind — the pattern behind durable job queues on Redis Streams. The guarantee is <em>at-least-once</em>: every entry is processed by someone, even across crashes, at the cost of possibly being processed twice (so handlers must be idempotent).</p>
<p>Simulate a five-order fulfilment flow with <code>redis-cli</code>:</p>
<ul>
<li>Append orders <code>1-1</code>…<code>5-1</code> (field <code>sku</code> = A…E) and create group <code>fulfil</code> at <code>0</code>.</li>
<li>Worker <code>wA</code> reads all five with <code>XREADGROUP … COUNT 5 … &gt;</code>, then acknowledges only <code>1-1</code> and <code>2-1</code> before it crashes. <code>XPENDING orders fulfil</code> shows <code>3</code> pending (<code>3-1</code>…<code>5-1</code>) under <code>wA</code>.</li>
<li>Recovery worker <code>wB</code> runs <code>XAUTOCLAIM orders fulfil wB 0 0</code> to take over the three stranded entries, then acknowledges all of them.</li>
<li><code>XPENDING orders fulfil</code> reports <code>0</code>; <code>XINFO GROUPS orders</code> confirms <code>pending 0</code>, <code>last-delivered-id "5-1"</code>, <code>entries-read 5</code>, <code>lag 0</code>.</li>
</ul>
<p>No order is lost despite the crash. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database; five orders, group fulfil. wA processes some then crashes; wB recovers the rest.',
    outputSpec: 'After wA acks 1-1,2-1 and crashes, XPENDING shows 3 pending under wA. XAUTOCLAIM moves them to wB; after wB acks all, XPENDING is 0 and XINFO GROUPS shows pending 0, last-delivered-id 5-1, entries-read 5, lag 0.',
    constraints: 'Model a partial ack then reclaim the rest with XAUTOCLAIM (min-idle 0). Every entry must end acknowledged. Use XINFO GROUPS (deterministic fields) to confirm the final state.',
    examplesJson: [
      { input: 'XPENDING orders fulfil after wA acks 1-1,2-1 and crashes', output: '1) (integer) 3 2) "3-1" 3) "5-1" 4) [[wA,3]]', explanation: 'Three unacknowledged orders remain, all still owned by the crashed wA.' },
      { input: 'XINFO GROUPS orders after wB recovers and acks all', output: 'pending 0, last-delivered-id "5-1", entries-read 5, lag 0', explanation: 'All five delivered and acknowledged; nothing pending and the group has fully caught up.' },
    ],
    hintsJson: [
      'Combine the pieces: read with >, ack successes, and reclaim the rest after a crash.',
      'A partial ack (only some IDs) leaves the others in the crashed consumer\'s pending list.',
      'XAUTOCLAIM orders fulfil wB 0 0 moves the stranded entries to the recovery worker.',
      'XINFO GROUPS shows pending, last-delivered-id, entries-read and lag to confirm a clean finish.',
    ],
    starter: `XADD orders 1-1 sku A
XADD orders 2-1 sku B
XADD orders 3-1 sku C
XADD orders 4-1 sku D
XADD orders 5-1 sku E
XGROUP CREATE orders fulfil 0
XREADGROUP GROUP fulfil wA COUNT 5 STREAMS orders >
XACK orders fulfil 1-1 2-1
XPENDING orders fulfil
XAUTOCLAIM orders fulfil wB 0 0
XACK orders fulfil 3-1 4-1 5-1
XPENDING orders fulfil
XINFO GROUPS orders`,
    solution: `XADD orders 1-1 sku A
XADD orders 2-1 sku B
XADD orders 3-1 sku C
XADD orders 4-1 sku D
XADD orders 5-1 sku E
XGROUP CREATE orders fulfil 0
XREADGROUP GROUP fulfil wA COUNT 5 STREAMS orders >
XACK orders fulfil 1-1 2-1
XPENDING orders fulfil
XAUTOCLAIM orders fulfil wB 0 0
XACK orders fulfil 3-1 4-1 5-1
XPENDING orders fulfil
XINFO GROUPS orders`,
    solutionExplanationHtml: `<p>The workflow strings together every consumer-group primitive into the reliability guarantee that matters. Worker <code>wA</code> pulls all five orders with <code>XREADGROUP … &gt;</code>, which records them as pending under <code>wA</code>. It finishes and acknowledges only <code>1-1</code> and <code>2-1</code> before crashing, so <code>XPENDING</code> shows exactly three orders (<code>3-1</code>…<code>5-1</code>) still owned by <code>wA</code> — delivered but never confirmed. Those orders are not lost and are not silently redelivered to anyone else via <code>&gt;</code>; they wait in the PEL until claimed. The recovery worker <code>wB</code> runs <code>XAUTOCLAIM</code> to take ownership of the stranded three, processes them, and acknowledges them, driving the pending count to <code>0</code>. <code>XINFO GROUPS</code> then confirms a clean finish: <code>pending 0</code>, <code>last-delivered-id 5-1</code>, <code>entries-read 5</code>, and <code>lag 0</code> (no unread backlog).</p>
<p>This is at-least-once delivery in practice, and its two consequences drive real designs. First, nothing is acknowledged until processing genuinely succeeds — acknowledging on receipt would turn the queue back into fire-and-forget and reintroduce loss on crash. Second, because a reclaimed entry may have been partly processed by the dead worker, every handler must be <strong>idempotent</strong>: writing with a deterministic key, an upsert, or a dedupe check on the entry ID, so reprocessing order <code>3-1</code> a second time is harmless. In production the reclaim step is not manual — a background reaper periodically runs <code>XAUTOCLAIM</code> with a realistic <code>min-idle-time</code> (say 60s) so only genuinely abandoned work is taken, and entries whose delivery-count grows past a threshold are routed to a dead-letter stream for inspection rather than retried forever. The result is a durable, horizontally scalable job queue built entirely on native stream commands.</p>`,
    diagramMermaid: `sequenceDiagram
  participant P as Producer
  participant S as orders stream
  participant A as worker wA
  participant B as worker wB
  P->>S: XADD 1-1..5-1
  A->>S: XREADGROUP read 5
  A->>S: XACK 1-1 2-1
  Note over A: crash before acking 3-1..5-1
  B->>S: XAUTOCLAIM stranded 3
  B->>S: XACK 3-1 4-1 5-1
  Note over S: pending 0 lag 0`,
  },
  {
    title: 'Fan Out One Stream to Independent Consumer Groups',
    difficulty: 'HARD', estimatedMinutes: 55, points: 30,
    concepts: ['fan-out', 'independent groups', 'per-group cursor', 'event sourcing', 'lag'],
    prerequisites: ['consumer group', 'XREADGROUP', 'XINFO GROUPS'],
    tags: ['streams', 'fan-out', 'event-sourcing', 'consumer-groups', 'redis'],
    problemHtml: `<p>A single event often drives several independent subsystems — a new order must be billed <em>and</em> indexed for search <em>and</em> emailed. Streams model this with multiple <strong>consumer groups</strong> on one stream: every group receives every entry independently, each with its own cursor and pending list, so the subsystems neither block nor skip one another. This is the durable cousin of pub/sub, and the basis of event sourcing.</p>
<p>Using <code>redis-cli</code>:</p>
<ul>
<li>Append three events to <code>events</code> (IDs <code>1-1</code>, <code>2-1</code>, <code>3-1</code>; field <code>kind</code> = created, updated, deleted).</li>
<li>Create two groups at <code>0</code>: <code>billing</code> and <code>search</code>.</li>
<li><code>billing</code>'s consumer <code>b1</code> reads and acknowledges all three. <code>search</code>'s consumer <code>s1</code> reads only the first so far.</li>
<li><code>XINFO GROUPS events</code> shows the two groups at different positions: <code>billing</code> caught up (<code>last-delivered-id "3-1"</code>, <code>lag 0</code>, <code>pending 0</code>), <code>search</code> behind (<code>last-delivered-id "1-1"</code>, <code>lag 2</code>, <code>pending 1</code>).</li>
<li><code>s1</code> reads the remaining two; <code>XINFO GROUPS</code> now shows <code>search</code> at <code>last-delivered-id "3-1"</code>, <code>lag 0</code>, <code>pending 3</code> (it read but has not acknowledged).</li>
</ul>
<p>The two groups advance completely independently. The scaffold lists the commands.</p>`,
    inputSpec: 'A clean Redis database with three events; two independent groups billing and search.',
    outputSpec: 'billing reads+acks all 3 (last-delivered 3-1, lag 0, pending 0). search first reads 1 (last-delivered 1-1, lag 2, pending 1), then reads the rest (last-delivered 3-1, lag 0, pending 3). Each group tracks progress independently.',
    constraints: 'Two groups on one stream, each created at 0. Each group sees every entry once. Confirm independent positions via XINFO GROUPS (deterministic fields: last-delivered-id, entries-read, lag, pending). Do not use pub/sub — it does not persist.',
    examplesJson: [
      { input: 'XINFO GROUPS events after billing acks all and search read one', output: 'billing: last-delivered 3-1, lag 0, pending 0; search: last-delivered 1-1, lag 2, pending 1', explanation: 'Each group has its own cursor; billing is caught up while search still has a backlog of 2.' },
      { input: 'XINFO GROUPS events after search reads the remaining two', output: 'search: last-delivered 3-1, lag 0, pending 3', explanation: 'search has now been delivered all three; pending is 3 because it has not acknowledged them yet.' },
    ],
    hintsJson: [
      'Create several groups on the same stream; each receives every entry independently.',
      'A group\'s cursor and pending list are private to that group — one group acking does not affect another.',
      'XINFO GROUPS shows each group\'s last-delivered-id, entries-read, pending, and lag.',
      'lag is entries added minus entries the group has read; pending is delivered-but-unacknowledged.',
    ],
    starter: `XADD events 1-1 kind created
XADD events 2-1 kind updated
XADD events 3-1 kind deleted
XGROUP CREATE events billing 0
XGROUP CREATE events search 0
XREADGROUP GROUP billing b1 COUNT 3 STREAMS events >
XREADGROUP GROUP search s1 COUNT 1 STREAMS events >
XACK events billing 1-1 2-1 3-1
XINFO GROUPS events
XREADGROUP GROUP search s1 STREAMS events >
XINFO GROUPS events`,
    solution: `XADD events 1-1 kind created
XADD events 2-1 kind updated
XADD events 3-1 kind deleted
XGROUP CREATE events billing 0
XGROUP CREATE events search 0
XREADGROUP GROUP billing b1 COUNT 3 STREAMS events >
XREADGROUP GROUP search s1 COUNT 1 STREAMS events >
XACK events billing 1-1 2-1 3-1
XINFO GROUPS events
XREADGROUP GROUP search s1 STREAMS events >
XINFO GROUPS events`,
    solutionExplanationHtml: `<p>Multiple consumer groups on one stream give you fan-out with durability. Creating <code>billing</code> and <code>search</code> both at <code>0</code> means each will independently be delivered all three events — the group is the unit of "a subsystem that must see every event", while consumers <em>within</em> a group compete to share that group's work. Because each group owns a private cursor (<code>last-delivered-id</code>) and a private pending list, they advance at their own pace: after <code>billing</code>'s <code>b1</code> reads and acknowledges all three while <code>search</code>'s <code>s1</code> reads only one, <code>XINFO GROUPS</code> shows <code>billing</code> caught up (<code>last-delivered-id 3-1</code>, <code>lag 0</code>, <code>pending 0</code>) and <code>search</code> behind (<code>last-delivered-id 1-1</code>, <code>lag 2</code>, <code>pending 1</code>). When <code>s1</code> reads the remaining two, <code>search</code> reaches <code>last-delivered-id 3-1</code> with <code>lag 0</code>, but its <code>pending</code> is <code>3</code> because it has been delivered all three and acknowledged none — <code>pending</code> and <code>lag</code> measure different things.</p>
<p>Those two counters are the key operational signals. <code>lag</code> is how many entries the group has not yet been <em>delivered</em> (entries-added minus entries-read) — a read backlog; <code>pending</code> is how many have been delivered but not yet <em>acknowledged</em> — an in-flight or stuck backlog. A healthy caught-up group has both near zero. This architecture is what distinguishes streams from pub/sub: pub/sub fans out too, but a subscriber that is offline misses messages permanently and there is no acknowledgement or replay. With stream groups, a subsystem that is down simply accumulates <code>lag</code> and catches up when it returns, and because the entries persist you can add a brand-new group later and replay history from <code>0</code> — the essence of event sourcing, where the stream is the source of truth and each consumer projects it into its own state. Size retention (<code>MAXLEN</code>/<code>MINID</code>) against your slowest or most-often-replayed group so trimming never discards entries a group still needs.</p>`,
    diagramMermaid: `flowchart TD
  S[events stream 1-1 2-1 3-1] --> B[group billing cursor]
  S --> R[group search cursor]
  B --> B1[consumer b1 reads all three]
  R --> R1[consumer s1 reads at own pace]
  B1 --> BD[last-delivered 3-1 lag 0]
  R1 --> RD[independent position and lag]`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VERIFY, { recursive: true });
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
exercises.forEach((e, i) => { cmds += `ECHO "===== EX ${i + 1}: ${e.title.replace(/"/g, '')} ====="\nFLUSHALL\n` + e.solution + '\n'; });
fs.writeFileSync(path.join(VERIFY, `redis-735.txt`), cmds);

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
