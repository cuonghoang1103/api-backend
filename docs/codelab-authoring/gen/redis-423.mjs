// Generator for Redis module 423 (core-data-structures) — 10 exercises.
// Track language is "text"; solutions are pure redis-cli command sequences (NO comment lines,
// because redis-cli pipe mode executes every line and `#` is not a comment there).
// Documented outputs use the decorated --no-raw format a learner actually sees:
//   (integer) N, "string", (nil), 1) "elem", (empty array), (empty list or set).
// The verify script is derived from solutionCodeJson so what runs IS what ships.
// Run:  docker exec -i cl_redis redis-cli --no-raw < docs/codelab-authoring/verify/redis-423.txt
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'redis';
const moduleSlug = 'core-data-structures';
const L = 'text';

const exercises = [
  {
    title: 'Build an Ordered Task List with RPUSH, LPUSH, and LRANGE',
    difficulty: 'EASY',
    estimatedMinutes: 15,
    points: 10,
    concepts: ['RPUSH', 'LPUSH', 'LRANGE', 'LLEN', 'list index semantics'],
    prerequisites: ['SET', 'GET', 'redis-cli basics'],
    tags: ['lists', 'rpush', 'lrange', 'ordering', 'redis'],
    problemHtml: `<p>A Redis list is an ordered sequence of strings with a cheap head and a cheap tail: you can push or pop at either end in constant time. That makes it the natural type for anything where <strong>insertion order matters</strong> — a to-do list, a job backlog, a recent-activity feed. Unlike a string key, a list holds many values under one key, and unlike a set it keeps duplicates and position.</p>
<p>Using <code>redis-cli</code>, build the list <code>tasks</code> and inspect it:</p>
<ul>
<li>Append <code>"write-spec"</code>, <code>"review-code"</code>, and <code>"deploy"</code> to the <strong>tail</strong> with three separate <code>RPUSH</code> calls; each returns the new length, so you see <code>1</code>, <code>2</code>, <code>3</code>.</li>
<li>Read the whole list with <code>LRANGE tasks 0 -1</code> and confirm <code>LLEN tasks</code> is <code>3</code>.</li>
<li>Push <code>"urgent-hotfix"</code> onto the <strong>head</strong> with <code>LPUSH</code> so it becomes element 0, then read the list again — the order is now hotfix first.</li>
<li>Slice the list two ways: <code>LRANGE tasks 0 1</code> (the first two) and <code>LRANGE tasks -2 -1</code> (the last two). Both index bounds are <strong>inclusive</strong>.</li>
<li>Ask for an out-of-range window, <code>LRANGE tasks 5 9</code>, and observe Redis returns an empty result rather than an error.</li>
<li>Finally query <code>missing:list</code>, a key you never created: <code>LLEN</code> reports <code>0</code> and <code>LRANGE</code> returns empty — a missing list behaves exactly like an empty one.</li>
</ul>
<p>The scaffold lists the commands with the pushed values and index bounds left blank.</p>`,
    inputSpec: 'A clean Redis database. You issue redis-cli commands; the "input" is the command sequence itself.',
    outputSpec: 'The three RPUSH calls return 1, 2, 3; LRANGE tasks 0 -1 lists write-spec, review-code, deploy in that order; LLEN is 3; LPUSH returns 4 and puts urgent-hotfix at index 0; LRANGE 0 1 returns the first two, LRANGE -2 -1 the last two; LRANGE 5 9 returns an empty array; LLEN missing:list returns 0 and LRANGE on it returns an empty array.',
    constraints: 'Use only RPUSH, LPUSH, LRANGE, and LLEN. Do not create missing:list. Remember LRANGE bounds are inclusive on both ends and -1 means the last element.',
    examplesJson: [
      {
        input: 'RPUSH tasks "write-spec" then RPUSH tasks "review-code" then LRANGE tasks 0 -1',
        output: '(integer) 1\n(integer) 2\n1) "write-spec"\n2) "review-code"',
        explanation: 'Each RPUSH appends at the tail and returns the resulting length; LRANGE 0 -1 prints the whole list as a numbered array in order.',
      },
      {
        input: 'LRANGE tasks 5 9 on a 4-element list, then LLEN missing:list',
        output: '(empty array)\n(integer) 0',
        explanation: 'An out-of-range window yields an empty array, not an error, and a key that was never created behaves as a zero-length list.',
      },
    ],
    hintsJson: [
      'One key holds the whole sequence; the two push commands differ only in which end they touch.',
      'RPUSH appends at the tail (right), LPUSH prepends at the head (left); both return the new length.',
      'LRANGE key start stop reads a window; 0 -1 means "from the first to the last element".',
      'Negative indices count back from the end, so LRANGE tasks -2 -1 returns the final two elements, and both bounds are inclusive.',
    ],
    starter: `RPUSH tasks ____
RPUSH tasks ____
RPUSH tasks ____
LRANGE tasks 0 -1
LLEN tasks
LPUSH tasks ____
LRANGE tasks 0 -1
LLEN tasks
LRANGE tasks 0 ____
LRANGE tasks ____ -1
LRANGE tasks 5 9
LLEN missing:list
LRANGE missing:list 0 -1`,
    solution: `RPUSH tasks "write-spec"
RPUSH tasks "review-code"
RPUSH tasks "deploy"
LRANGE tasks 0 -1
LLEN tasks
LPUSH tasks "urgent-hotfix"
LRANGE tasks 0 -1
LLEN tasks
LRANGE tasks 0 1
LRANGE tasks -2 -1
LRANGE tasks 5 9
LLEN missing:list
LRANGE missing:list 0 -1`,
    solutionExplanationHtml: `<p>A list keys one name to an ordered sequence, and the two push commands simply choose an end: <code>RPUSH</code> appends at the tail, <code>LPUSH</code> prepends at the head. Both return the list's new length, which is why the three appends report <code>1</code>, <code>2</code>, <code>3</code> and the later <code>LPUSH</code> reports <code>4</code>. Pushing to a key that does not exist creates the list implicitly — you never initialise it — and both operations are O(1) regardless of how long the list already is, because Redis stores it as a quicklist with cheap access at either end.</p>
<p><code>LRANGE</code> is where the mistakes happen. Its bounds are <strong>inclusive on both ends</strong>, so <code>LRANGE tasks 0 1</code> returns two elements, not one, and the idiom <code>LRANGE key 0 -1</code> means "everything" because <code>-1</code> addresses the last element. Negative indices count backwards from the tail, making <code>-2 -1</code> a clean "last two" slice without knowing the length. Out-of-range windows such as <code>5 9</code> are not errors: Redis clamps them and returns an empty array, and the same forgiving behaviour applies to a key that does not exist at all — <code>LLEN missing:list</code> is <code>0</code> and <code>LRANGE missing:list 0 -1</code> is empty, because in Redis a non-existent key and an empty collection are the same thing. The one performance note to carry forward: <code>LRANGE</code> costs O(S+N) where S is the offset it must walk to, so reading a window near the head or tail is cheap while paging deep into a million-element list is not — and that is exactly why the capped-log pattern in a later exercise keeps lists short.</p>`,
  },

  {
    title: 'Represent a User Object as a Hash Instead of Four String Keys',
    difficulty: 'EASY',
    estimatedMinutes: 20,
    points: 10,
    concepts: ['HSET', 'HGET', 'HGETALL', 'HDEL', 'HEXISTS', 'HLEN'],
    prerequisites: ['SET', 'GET', 'key namespacing'],
    tags: ['hashes', 'hset', 'hgetall', 'objects', 'redis'],
    problemHtml: `<p>The foundations module modelled a user profile as four separate string keys — <code>user:1:name</code>, <code>user:1:email</code>, and so on. That works, but it spreads one logical object across four keys, costs four round trips to read, and gives you no way to ask "what fields does this user have". A <strong>hash</strong> stores all of those fields under a single key as a field-to-value map, which is how objects are normally modelled in Redis.</p>
<p>Using <code>redis-cli</code>, model user 42 as one hash:</p>
<ul>
<li>Write all four fields in <strong>one</strong> <code>HSET user:42 ...</code> call: <code>name</code>=<code>"Ann"</code>, <code>email</code>=<code>"ann@example.com"</code>, <code>city</code>=<code>"Hanoi"</code>, <code>role</code>=<code>"member"</code>. <code>HSET</code> returns how many fields were <em>newly added</em>, so this returns <code>4</code>.</li>
<li>Read one field with <code>HGET user:42 name</code>, then read a field that was never set, <code>HGET user:42 phone</code>, and observe <code>(nil)</code>.</li>
<li>Dump the whole object with <code>HGETALL user:42</code>: the reply alternates field, value, field, value.</li>
<li>Test membership with <code>HEXISTS</code> for <code>email</code> (<code>1</code>) and <code>phone</code> (<code>0</code>), and count fields with <code>HLEN</code>.</li>
<li>Update <code>city</code> to <code>"Da Nang"</code> with another <code>HSET</code> — because the field already existed, the return value is <code>0</code>, not an error. Read it back to confirm the write happened.</li>
<li>Remove <code>role</code> with <code>HDEL</code> (returns <code>1</code>), verify <code>HEXISTS user:42 role</code> is now <code>0</code>, and check <code>HLEN</code> dropped.</li>
</ul>
<p>The scaffold lists the commands with the field values left blank.</p>`,
    inputSpec: 'A clean Redis database. All commands operate on the single hash key user:42.',
    outputSpec: 'The first HSET returns 4; HGET name returns "Ann" and HGET phone returns (nil); HGETALL returns the four field/value pairs; HEXISTS returns 1 then 0; HLEN returns 4; the update HSET returns 0 and HGET city then returns "Da Nang"; HDEL returns 1, HEXISTS role becomes 0, and HLEN drops to 3.',
    constraints: 'Store the profile in exactly one key. Set all four fields with a single HSET call — do not issue four separate writes. Use HDEL to remove a field, never DEL (which would destroy the whole object).',
    examplesJson: [
      {
        input: 'HSET user:42 name "Ann" email "ann@example.com" city "Hanoi" role "member" then HGET user:42 name',
        output: '(integer) 4\n"Ann"',
        explanation: 'One command writes four fields; HSET counts only the fields it newly created, so it returns 4. HGET reads a single field back.',
      },
      {
        input: 'HSET user:42 city "Da Nang" then HGET user:42 city',
        output: '(integer) 0\n"Da Nang"',
        explanation: 'The field already existed, so nothing was newly added and HSET returns 0 — but the value is still overwritten, as the HGET proves.',
      },
      {
        input: 'HEXISTS user:42 phone then HGET user:42 phone',
        output: '(integer) 0\n(nil)',
        explanation: 'A field that was never written does not exist (0) and reading it yields (nil), exactly as a missing string key would.',
      },
    ],
    hintsJson: [
      'One key, many named fields — the commands are the string commands with an H in front and one extra argument.',
      'HSET key field value [field value ...] writes; HGET key field reads one field.',
      'HGETALL returns every field and value; HLEN counts fields; HEXISTS answers presence with 1 or 0.',
      'HSET returns the number of NEW fields, so updating an existing field returns 0 while still overwriting. HDEL key field removes one field without touching the rest.',
    ],
    starter: `HSET user:42 name ____ email ____ city ____ role ____
HGET user:42 name
HGET user:42 phone
HGETALL user:42
HEXISTS user:42 email
HEXISTS user:42 phone
HLEN user:42
HSET user:42 city ____
HGET user:42 city
HDEL user:42 role
HEXISTS user:42 role
HLEN user:42
HGETALL user:42`,
    solution: `HSET user:42 name "Ann" email "ann@example.com" city "Hanoi" role "member"
HGET user:42 name
HGET user:42 phone
HGETALL user:42
HEXISTS user:42 email
HEXISTS user:42 phone
HLEN user:42
HSET user:42 city "Da Nang"
HGET user:42 city
HDEL user:42 role
HEXISTS user:42 role
HLEN user:42
HGETALL user:42`,
    solutionExplanationHtml: `<p>A hash is a map nested inside one key, and that single change of shape buys three things over four parallel string keys. First, <strong>one round trip</strong>: <code>HGETALL user:42</code> fetches the entire object where four <code>GET</code>s would cost four network hops, and one <code>HSET</code> writes every field atomically instead of four writes that could interleave with a reader and expose a half-updated profile. Second, <strong>introspection</strong>: <code>HLEN</code> and <code>HKEYS</code> can enumerate the object's fields, something a flat keyspace cannot answer without a dangerous <code>KEYS user:42:*</code> scan. Third, <strong>memory</strong>: a small hash is encoded internally as a compact listpack, so a few dozen fields under one key use dramatically less overhead than the same data spread across a few dozen top-level keys, each of which carries its own key object and dictionary entry.</p>
<p>Two return values catch people out. <code>HSET</code> reports the number of fields <em>newly created</em>, not the number written, which is why updating <code>city</code> returns <code>0</code> even though the value definitely changed — never treat that <code>0</code> as a failure. And a missing field returns <code>(nil)</code> from <code>HGET</code>, exactly matching the missing-key behaviour of <code>GET</code>, so the same "nil means absent, empty string means a stored empty value" discipline applies inside hashes. The other trap is deletion: <code>HDEL user:42 role</code> removes one field and leaves the object intact, whereas <code>DEL user:42</code> would delete the entire user. Note also that when the last field is removed, Redis deletes the key itself — an empty hash does not exist. The main thing a hash gives up compared with separate keys is per-field expiry: a TTL applies to the whole key, so if different attributes must expire independently, separate keys remain the right model.</p>`,
    diagramMermaid: `flowchart LR
  A[Four string keys] --> B[user 1 name]
  A --> C[user 1 email]
  A --> D[user 1 city]
  A --> E[user 1 role]
  F[One hash key user 42] --> G[field name value Ann]
  F --> H[field email value ann at example]
  F --> I[field city value Hanoi]
  F --> J[field role value member]`,
  },

  {
    title: 'Drive a FIFO Queue and a LIFO Stack from the Same List Type',
    difficulty: 'MEDIUM',
    estimatedMinutes: 25,
    points: 15,
    concepts: ['LPOP', 'RPOP', 'FIFO queue', 'LIFO stack', 'pop on empty list'],
    prerequisites: ['RPUSH', 'LPUSH', 'LRANGE', 'LLEN'],
    tags: ['lists', 'queue', 'stack', 'lpop', 'redis'],
    problemHtml: `<p>A Redis list is not "a queue" or "a stack" — it is both, and which one you get depends entirely on <em>which ends you pair</em>. Push and pop at <strong>opposite</strong> ends and you have a first-in-first-out queue, the shape behind every background job worker. Push and pop at the <strong>same</strong> end and you have a last-in-first-out stack, the shape behind an undo history. Getting this pairing wrong is a real bug: a job queue that accidentally pops from the wrong end starves its oldest jobs forever.</p>
<p>Using <code>redis-cli</code>, build one of each:</p>
<ul>
<li><strong>Queue.</strong> <code>RPUSH jobs:queue</code> the values <code>"job-1"</code>, <code>"job-2"</code>, <code>"job-3"</code> in that order, then <code>LPOP jobs:queue</code> once. Because you pushed right and popped left, the value you get is the <strong>oldest</strong>, <code>"job-1"</code>. Confirm with <code>LRANGE</code> that <code>job-2</code> and <code>job-3</code> remain.</li>
<li><strong>Stack.</strong> <code>LPUSH undo:stack</code> the values <code>"edit-1"</code>, <code>"edit-2"</code>, <code>"edit-3"</code> in that order, then <code>LPOP undo:stack</code>. Pushing and popping the same end returns the <strong>newest</strong>, <code>"edit-3"</code>. Confirm the remainder with <code>LRANGE</code>.</li>
<li><strong>The other end.</strong> Back on the queue, <code>RPOP jobs:queue</code> takes the newest job, <code>"job-3"</code> — showing you can drain either end of the same key.</li>
<li><strong>Empty behaviour.</strong> <code>LPOP jobs:queue</code> once more to take the last element, then <code>LPOP</code> again on the now-empty list and observe <code>(nil)</code>. Finish with <code>LLEN jobs:queue</code>, which is <code>0</code> — Redis deleted the key when its last element was removed.</li>
</ul>
<p>The scaffold gives the command skeleton with the pushed values blank.</p>`,
    inputSpec: 'A clean Redis database. Two independent list keys, jobs:queue and undo:stack, are built and drained.',
    outputSpec: 'The queue pushes return 1, 2, 3; LPOP returns "job-1" and LRANGE then shows job-2 and job-3. The stack pushes return 1, 2, 3; LPOP returns "edit-3" and LRANGE shows edit-2 and edit-1. RPOP jobs:queue returns "job-3", the next LPOP returns "job-2", the following LPOP on the empty list returns (nil), and LLEN jobs:queue is 0.',
    constraints: 'Use RPUSH/LPOP for the FIFO queue and LPUSH/LPOP for the LIFO stack — do not reverse the results in application code. Push values one per command so each return value is visible. Do not use DEL; let the list disappear by being emptied.',
    examplesJson: [
      {
        input: 'RPUSH jobs:queue "job-1", "job-2", "job-3" then LPOP jobs:queue',
        output: '(integer) 1\n(integer) 2\n(integer) 3\n"job-1"',
        explanation: 'Pushed at the tail and popped from the head, so the element that has waited longest comes out first — FIFO.',
      },
      {
        input: 'LPUSH undo:stack "edit-1", "edit-2", "edit-3" then LPOP undo:stack then LRANGE undo:stack 0 -1',
        output: '(integer) 1\n(integer) 2\n(integer) 3\n"edit-3"\n1) "edit-2"\n2) "edit-1"',
        explanation: 'Pushing and popping the same end returns the most recent item — LIFO. LPUSH also means the list reads newest-first.',
      },
      {
        input: 'LPOP on an emptied jobs:queue then LLEN jobs:queue',
        output: '(nil)\n(integer) 0',
        explanation: 'Popping an empty or missing list returns (nil) instead of erroring, and the key stops existing once its last element is removed.',
      },
    ],
    hintsJson: [
      'The data type is identical for both; only the choice of ends differs.',
      'Opposite ends give FIFO: push at the tail with RPUSH, take from the head with LPOP.',
      'The same end gives LIFO: LPUSH then LPOP both work on the head, so the newest item comes back first.',
      'RPOP takes from the tail, and popping an empty list returns (nil) rather than an error — Redis removes a list key as soon as it becomes empty, so LLEN then reports 0.',
    ],
    starter: `RPUSH jobs:queue ____
RPUSH jobs:queue ____
RPUSH jobs:queue ____
LPOP jobs:queue
LRANGE jobs:queue 0 -1
LPUSH undo:stack ____
LPUSH undo:stack ____
LPUSH undo:stack ____
LPOP undo:stack
LRANGE undo:stack 0 -1
RPOP jobs:queue
LRANGE jobs:queue 0 -1
LPOP jobs:queue
LPOP jobs:queue
LLEN jobs:queue`,
    solution: `RPUSH jobs:queue "job-1"
RPUSH jobs:queue "job-2"
RPUSH jobs:queue "job-3"
LPOP jobs:queue
LRANGE jobs:queue 0 -1
LPUSH undo:stack "edit-1"
LPUSH undo:stack "edit-2"
LPUSH undo:stack "edit-3"
LPOP undo:stack
LRANGE undo:stack 0 -1
RPOP jobs:queue
LRANGE jobs:queue 0 -1
LPOP jobs:queue
LPOP jobs:queue
LLEN jobs:queue`,
    solutionExplanationHtml: `<p>The list type carries no policy of its own; the discipline lives in the <em>pairing</em> of commands. <code>RPUSH</code> + <code>LPOP</code> touches opposite ends, so an element must traverse the whole list before it is served: that is a FIFO queue, and it is why <code>LPOP</code> returns <code>"job-1"</code> even though <code>"job-3"</code> was pushed most recently. <code>LPUSH</code> + <code>LPOP</code> touches one end, so the last thing in is the first thing out: a LIFO stack, returning <code>"edit-3"</code>. The mirror pairings work identically — <code>LPUSH</code> + <code>RPOP</code> is also FIFO, <code>RPUSH</code> + <code>RPOP</code> is also a stack — so the rule to memorise is <em>opposite ends means queue, same end means stack</em>, not the specific command names.</p>
<p>The practical consequence is the one this exercise makes visible with <code>RPOP jobs:queue</code>: a single key can be drained from either end, so nothing but your own convention prevents a worker from silently servicing the newest jobs and leaving the oldest to starve. Fix the convention in one place in your code. Two behaviours round out the picture. Popping an empty or non-existent list returns <code>(nil)</code> rather than raising, so a worker loop can poll safely — though in production you would use the blocking <code>BLPOP</code> instead of a busy poll, since it parks the client until an element arrives. And Redis <strong>deletes a collection key when it becomes empty</strong>, which is why <code>LLEN jobs:queue</code> ends at <code>0</code> and <code>EXISTS</code> would report <code>0</code> too; there is no such thing as a stored empty list. Both push and pop are O(1) at either end, so queues built this way stay fast no matter how deep the backlog grows.</p>`,
    diagramMermaid: `flowchart LR
  subgraph Queue FIFO
    P1[RPUSH at tail] --> Q[job-1 job-2 job-3]
    Q --> P2[LPOP at head returns job-1]
  end
  subgraph Stack LIFO
    S1[LPUSH at head] --> S[edit-3 edit-2 edit-1]
    S --> S2[LPOP at head returns edit-3]
  end`,
  },

  {
    title: 'Cap an Activity Log with LTRIM and Prune Entries with LREM',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['LTRIM', 'LREM', 'capped list', 'variadic RPUSH', 'negative count semantics'],
    prerequisites: ['RPUSH', 'LRANGE', 'LLEN', 'list index semantics'],
    tags: ['lists', 'ltrim', 'lrem', 'capped-log', 'redis'],
    problemHtml: `<p>A recent-activity list grows forever unless something bounds it, and an unbounded list in an in-memory database is a slow memory leak. <code>LTRIM</code> solves this in one command: it keeps a window of the list and throws the rest away, so calling it after each push turns any list into a <strong>capped log</strong> of the last N events. <code>LREM</code> is the other pruning tool — it deletes elements by <em>value</em> rather than position, with a count argument that also chooses the search direction.</p>
<p>Using <code>redis-cli</code>, maintain <code>log:user:7</code>:</p>
<ul>
<li>Append five events one at a time with <code>RPUSH</code>: <code>"login"</code>, <code>"view-post"</code>, <code>"like-post"</code>, <code>"view-post"</code>, <code>"logout"</code>. Confirm <code>LLEN</code> is <code>5</code>. Note <code>"view-post"</code> appears twice — lists permit duplicates.</li>
<li>Remove only the <strong>first</strong> occurrence of <code>"view-post"</code> with <code>LREM log:user:7 1 "view-post"</code>. A positive count scans from the head and stops after that many removals, so it returns <code>1</code> and the later <code>"view-post"</code> survives. Verify with <code>LRANGE</code>.</li>
<li>Append three more events in a <strong>single variadic</strong> call: <code>RPUSH log:user:7 "login" "view-post" "comment"</code>. It returns the new length <code>7</code>.</li>
<li>Cap the log to its 3 most recent entries with <code>LTRIM log:user:7 -3 -1</code>. It replies <code>OK</code> — <code>LTRIM</code> mutates in place and returns no data. Confirm with <code>LRANGE</code> and <code>LLEN</code>.</li>
<li>Push one more <code>"comment"</code>, then delete the <strong>last</strong> occurrence with a negative count: <code>LREM log:user:7 -1 "comment"</code>, which scans from the tail. Verify the surviving order.</li>
</ul>
<p>The scaffold lists the commands with the counts and trim bounds blank.</p>`,
    inputSpec: 'A clean Redis database. One list key, log:user:7, receives events and is pruned.',
    outputSpec: 'The five RPUSH calls return 1..5 and LLEN is 5; LREM with count 1 returns 1 and leaves login, like-post, view-post, logout; the variadic RPUSH returns 7 and LLEN is 7; LTRIM returns OK and the list becomes login, view-post, comment with LLEN 3; after RPUSH "comment" (returns 4), LREM with count -1 returns 1 and LRANGE shows login, view-post, comment.',
    constraints: 'Use LTRIM to enforce the cap — do not pop elements in a loop. Use LREM with an explicit count sign to control direction: positive scans from the head, negative from the tail. Do not use DEL. LTRIM bounds are inclusive.',
    examplesJson: [
      {
        input: 'List login, view-post, like-post, view-post, logout then LREM log:user:7 1 "view-post" then LRANGE log:user:7 0 -1',
        output: '(integer) 1\n1) "login"\n2) "like-post"\n3) "view-post"\n4) "logout"',
        explanation: 'Count 1 scans from the head and removes only the first matching element, returning how many it removed; the second "view-post" is untouched.',
      },
      {
        input: 'A 7-element log then LTRIM log:user:7 -3 -1 then LLEN log:user:7',
        output: 'OK\n(integer) 3',
        explanation: 'LTRIM keeps only the window -3..-1 (the last three elements) and discards everything else in one O(N) pass, replying OK.',
      },
      {
        input: 'List login, view-post, comment, comment then LREM log:user:7 -1 "comment"',
        output: '(integer) 1',
        explanation: 'A negative count scans from the tail, so the trailing duplicate is removed and the earlier "comment" survives.',
      },
    ],
    hintsJson: [
      'Bounding the list is a single command, not a loop of pops.',
      'LTRIM key start stop keeps that inclusive window and deletes everything outside it, replying OK.',
      'To keep the newest N entries of a tail-appended log, trim to -N -1; to keep the newest N of a head-prepended log, trim to 0 N-1.',
      'LREM key count value deletes by value: count 1 removes the first match scanning from the head, count -1 the last match scanning from the tail, and count 0 removes every match. It returns how many it removed.',
    ],
    starter: `RPUSH log:user:7 "login"
RPUSH log:user:7 "view-post"
RPUSH log:user:7 "like-post"
RPUSH log:user:7 "view-post"
RPUSH log:user:7 "logout"
LLEN log:user:7
LREM log:user:7 ____ "view-post"
LRANGE log:user:7 0 -1
RPUSH log:user:7 "login" "view-post" "comment"
LLEN log:user:7
LTRIM log:user:7 ____ -1
LRANGE log:user:7 0 -1
LLEN log:user:7
RPUSH log:user:7 "comment"
LREM log:user:7 ____ "comment"
LRANGE log:user:7 0 -1`,
    solution: `RPUSH log:user:7 "login"
RPUSH log:user:7 "view-post"
RPUSH log:user:7 "like-post"
RPUSH log:user:7 "view-post"
RPUSH log:user:7 "logout"
LLEN log:user:7
LREM log:user:7 1 "view-post"
LRANGE log:user:7 0 -1
RPUSH log:user:7 "login" "view-post" "comment"
LLEN log:user:7
LTRIM log:user:7 -3 -1
LRANGE log:user:7 0 -1
LLEN log:user:7
RPUSH log:user:7 "comment"
LREM log:user:7 -1 "comment"
LRANGE log:user:7 0 -1`,
    solutionExplanationHtml: `<p><code>LTRIM key start stop</code> is the capped-log primitive: it keeps the inclusive window you name and discards everything else, returning <code>OK</code> because it is a mutation, not a read. The production idiom is to pair it with every push — <code>RPUSH log x</code> followed by <code>LTRIM log -100 -1</code> — so the list can never exceed 100 entries no matter how long the process runs. Which window you trim to depends on which end you append: a tail-appended log keeps its newest N with <code>-N -1</code>, as here, while a head-prepended (<code>LPUSH</code>) log keeps its newest N with <code>0 N-1</code>. Getting that backwards silently keeps the <em>oldest</em> entries and discards every new one, and because <code>LTRIM</code> never errors, the bug shows up only as a log that stopped updating.</p>
<p><code>LREM</code> removes by value and its <code>count</code> argument encodes both a limit and a direction, which is the part worth memorising: <strong>positive</strong> scans from the head and stops after <code>count</code> removals, <strong>negative</strong> scans from the tail, and <strong>zero</strong> removes every occurrence. That is why <code>LREM log:user:7 1 "view-post"</code> deletes the earlier duplicate while <code>LREM log:user:7 -1 "comment"</code> deletes the later one. It returns the number of elements actually removed, so <code>0</code> means "no match found" rather than an error. Two costs to keep in mind: <code>LREM</code> is O(N) because it must walk the list comparing values, and <code>LTRIM</code> is O(M) in the number of elements it removes — both are fine on a list you are keeping short, which is precisely the reason to keep it short. If you need the whole history rather than a recent window, a list is the wrong type: use a Redis Stream, which is built for an append-only log with consumer tracking.</p>`,
  },

  {
    title: 'Count Per-Field Metrics with HINCRBY and a Global INCR',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['HINCRBY', 'INCR', 'INCRBY', 'atomic field counters', 'implicit field creation'],
    prerequisites: ['HSET', 'HGET', 'HGETALL', 'INCR'],
    tags: ['hashes', 'hincrby', 'counters', 'atomic', 'redis'],
    problemHtml: `<p>Post analytics need several counters that belong to the same object — views, likes, shares — plus a site-wide total that belongs to nobody. Redis gives you an atomic increment at both levels: <code>HINCRBY</code> adds to a single <em>field</em> inside a hash, and <code>INCR</code>/<code>INCRBY</code> add to a plain string key. Both do the read-modify-write on the server, so concurrent updates never lose a count the way an application-side read-add-write would.</p>
<p>Using <code>redis-cli</code>, track statistics for post 9:</p>
<ul>
<li>Initialise <code>stats:post:9</code> with <code>HSET</code> setting <code>views</code>, <code>likes</code>, and <code>shares</code> all to <code>0</code>; it returns <code>3</code>.</li>
<li>Record traffic with <code>HINCRBY</code>: <code>views</code> by <code>1</code> (returns <code>1</code>), <code>views</code> by <code>9</code> (returns <code>10</code>), <code>likes</code> by <code>3</code>, <code>shares</code> by <code>1</code>. Each call returns the field's <strong>new</strong> value as an integer.</li>
<li><code>HGET stats:post:9 views</code> returns the count as the quoted string <code>"10"</code> — hash values are always strings, and <code>HINCRBY</code> merely interprets them numerically. Dump everything with <code>HGETALL</code>.</li>
<li><code>HINCRBY stats:post:9 comments 5</code> on a field that does <strong>not exist</strong>: the field is created at <code>0</code> first, so it returns <code>5</code>. Confirm <code>HLEN</code> is now <code>4</code>.</li>
<li>Maintain the site-wide total on a separate string key: <code>INCR stats:global:views</code> (returns <code>1</code>), <code>INCRBY stats:global:views 99</code> (returns <code>100</code>), then <code>GET</code> it — <code>"100"</code>.</li>
<li>Retire the <code>shares</code> metric with <code>HDEL</code> and dump the hash again.</li>
</ul>
<p>The scaffold lists the commands with the increment amounts blank.</p>`,
    inputSpec: 'A clean Redis database. The hash stats:post:9 holds per-post counters; the string key stats:global:views holds a site-wide total.',
    outputSpec: 'HSET returns 3; the HINCRBY calls return 1, 10, 3, 1; HGET views returns "10"; HGETALL shows views 10, likes 3, shares 1; HINCRBY on the missing comments field returns 5 and HLEN becomes 4; INCR returns 1, INCRBY 99 returns 100, GET returns "100"; HDEL shares returns 1 and the final HGETALL shows views, likes, and comments.',
    constraints: 'Never read a counter, add in your client, and write it back — all arithmetic must happen inside Redis. Use HINCRBY for per-post fields and INCR/INCRBY for the global key. Do not pre-create the comments field or the global key.',
    examplesJson: [
      {
        input: 'HINCRBY stats:post:9 views 1 then HINCRBY stats:post:9 views 9 then HGET stats:post:9 views',
        output: '(integer) 1\n(integer) 10\n"10"',
        explanation: 'Each HINCRBY returns the field\'s new integer value, but HGET reads it back as a string because every hash value is stored as a string.',
      },
      {
        input: 'HINCRBY stats:post:9 comments 5 on a field that was never set, then HLEN stats:post:9',
        output: '(integer) 5\n(integer) 4',
        explanation: 'A missing field is treated as 0 and created by the increment, so the result is 5 and the hash now has four fields.',
      },
      {
        input: 'INCR stats:global:views then INCRBY stats:global:views 99 then GET stats:global:views',
        output: '(integer) 1\n(integer) 100\n"100"',
        explanation: 'A missing string key also starts at 0; INCRBY adds a chosen amount and GET returns the counter as a string.',
      },
    ],
    hintsJson: [
      'Counters that belong to one object should live in that object\'s key, one field each.',
      'HINCRBY key field amount adds to a single hash field and returns the new value.',
      'A missing field or a missing key is treated as 0, so counters never need initialising — the first increment creates them.',
      'Use INCR key for a plain +1 on a string key and INCRBY key n for a larger step; the arithmetic must stay server-side so it is atomic.',
    ],
    starter: `HSET stats:post:9 views 0 likes 0 shares 0
HINCRBY stats:post:9 views ____
HINCRBY stats:post:9 views ____
HINCRBY stats:post:9 likes ____
HINCRBY stats:post:9 shares ____
HGET stats:post:9 views
HGETALL stats:post:9
HINCRBY stats:post:9 comments ____
HLEN stats:post:9
INCR stats:global:views
INCRBY stats:global:views ____
GET stats:global:views
HDEL stats:post:9 shares
HGETALL stats:post:9`,
    solution: `HSET stats:post:9 views 0 likes 0 shares 0
HINCRBY stats:post:9 views 1
HINCRBY stats:post:9 views 9
HINCRBY stats:post:9 likes 3
HINCRBY stats:post:9 shares 1
HGET stats:post:9 views
HGETALL stats:post:9
HINCRBY stats:post:9 comments 5
HLEN stats:post:9
INCR stats:global:views
INCRBY stats:global:views 99
GET stats:global:views
HDEL stats:post:9 shares
HGETALL stats:post:9`,
    solutionExplanationHtml: `<p><code>HINCRBY</code> is <code>INCRBY</code> scoped to one field of one hash, and it carries the same guarantee that makes counters correct: Redis runs each command to completion before the next, so the read, add, and write are one indivisible step. Emulating it with <code>HGET</code> then <code>HSET</code> in your client opens a window in which another process can increment the same field, and one of the two updates is silently lost. Every call returns the field's <strong>new</strong> value, which is exactly what a caller needs to make a decision — the rate-limiter pattern is built on that return value.</p>
<p>Three behaviours are worth fixing in memory. First, <strong>a missing field is treated as zero and created on the spot</strong>: <code>HINCRBY stats:post:9 comments 5</code> returns <code>5</code> on a hash that had no <code>comments</code> field, so counters never need initialising and the explicit <code>HSET ... 0</code> here is documentation rather than necessity. Second, hash values are always <em>strings</em>; <code>HINCRBY</code> parses the string as a 64-bit integer, adds, and stores the result back as a string, which is why <code>HINCRBY</code> shows <code>(integer) 10</code> while <code>HGET</code> shows <code>"10"</code>. The consequence is a real error case: if the field holds something non-numeric such as <code>"12x"</code>, the command fails with <em>hash value is not an integer</em>, so never mix a counter field with free-text content. For fractional amounts use <code>HINCRBYFLOAT</code>. Third, choosing between a hash field and a top-level key is a modelling decision, not a style one: counters that share an object's lifetime belong in that object's hash so they are fetched in one <code>HGETALL</code>, deleted with the object, and cheap in memory, while a global aggregate like <code>stats:global:views</code> belongs on its own key because nothing owns it and it may need its own expiry.</p>`,
  },

  {
    title: 'Enforce Uniqueness with a Set of Tags',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    points: 20,
    concepts: ['SADD', 'SMEMBERS', 'SISMEMBER', 'SREM', 'SCARD', 'unordered uniqueness'],
    prerequisites: ['RPUSH', 'LRANGE', 'key namespacing'],
    tags: ['sets', 'sadd', 'sismember', 'uniqueness', 'redis'],
    problemHtml: `<p>A list happily stores the same value twice and answers "does it contain X" only by scanning every element. When the requirement is <strong>a collection of distinct values with a fast membership test</strong> — the tags on a post, the users who liked something, the IP addresses seen today — the right type is a set. Redis sets deduplicate automatically, answer <code>SISMEMBER</code> in O(1), and deliberately do <strong>not</strong> preserve insertion order.</p>
<p>Using <code>redis-cli</code>, manage the tags on post 1:</p>
<ul>
<li>Add three tags in one variadic call: <code>SADD post:1:tags "redis" "database" "cache"</code>. <code>SADD</code> returns the number of members <strong>actually added</strong>, so this returns <code>3</code>.</li>
<li>Add <code>"redis"</code> again. It is already present, so nothing changes and the call returns <code>0</code> — no error, no duplicate. Confirm <code>SCARD post:1:tags</code> is still <code>3</code>.</li>
<li>Test membership with <code>SISMEMBER</code> for <code>"cache"</code> (<code>1</code>) and <code>"mongodb"</code> (<code>0</code>), then list everything with <code>SMEMBERS</code>.</li>
<li>Remove <code>"cache"</code> with <code>SREM</code> (returns <code>1</code>), check <code>SCARD</code> and <code>SMEMBERS</code>, then try <code>SREM post:1:tags "mongodb"</code> — it was never there, so it returns <code>0</code> rather than failing.</li>
<li>Add a mixed batch, <code>SADD post:1:tags "nosql" "redis"</code>: only <code>"nosql"</code> is new, so the return value is <code>1</code>. Finish with <code>SCARD</code> and <code>SMEMBERS</code>.</li>
</ul>
<p>Treat the order in which <code>SMEMBERS</code> prints members as <strong>undefined</strong> — never write code that depends on it. The scaffold lists the commands with the tag values blank.</p>`,
    inputSpec: 'A clean Redis database. One set key, post:1:tags, holds the distinct tags of a post.',
    outputSpec: 'The first SADD returns 3; re-adding "redis" returns 0 and SCARD stays 3; SISMEMBER returns 1 for "cache" and 0 for "mongodb"; SMEMBERS lists the three tags in unspecified order; SREM "cache" returns 1 and SCARD becomes 2; SREM "mongodb" returns 0; SADD "nosql" "redis" returns 1 and SCARD becomes 3.',
    constraints: 'Use only SADD, SMEMBERS, SISMEMBER, SREM, and SCARD. Do not deduplicate in application code — rely on the set. Do not assume any particular ordering from SMEMBERS. Use SCARD, never SMEMBERS plus a client-side count, to get the size.',
    examplesJson: [
      {
        input: 'SADD post:1:tags "redis" "database" "cache" then SADD post:1:tags "redis" then SCARD post:1:tags',
        output: '(integer) 3\n(integer) 0\n(integer) 3',
        explanation: 'SADD returns how many members were newly added; the duplicate adds nothing (0) and the cardinality is unchanged.',
      },
      {
        input: 'SISMEMBER post:1:tags "cache" then SISMEMBER post:1:tags "mongodb"',
        output: '(integer) 1\n(integer) 0',
        explanation: 'Membership is a constant-time hash lookup returning 1 for present and 0 for absent, regardless of set size.',
      },
      {
        input: 'SREM post:1:tags "cache" then SREM post:1:tags "mongodb" then SADD post:1:tags "nosql" "redis"',
        output: '(integer) 1\n(integer) 0\n(integer) 1',
        explanation: 'SREM and SADD both return counts of members actually changed, so removing an absent member gives 0 and a batch containing one new value gives 1.',
      },
    ],
    hintsJson: [
      'The requirement is "each value at most once, and answer membership fast" — that names the data type.',
      'SADD key member [member ...] adds and deduplicates in one step; it returns how many members were new.',
      'SCARD gives the size and SISMEMBER gives a 1/0 membership answer without transferring the set.',
      'SREM key member removes and returns how many it removed, so removing something absent yields 0. SMEMBERS returns everything but in no defined order.',
    ],
    starter: `SADD post:1:tags ____ ____ ____
SADD post:1:tags ____
SCARD post:1:tags
SISMEMBER post:1:tags "cache"
SISMEMBER post:1:tags "mongodb"
SMEMBERS post:1:tags
SREM post:1:tags "cache"
SCARD post:1:tags
SMEMBERS post:1:tags
SREM post:1:tags "mongodb"
SADD post:1:tags ____ ____
SCARD post:1:tags
SMEMBERS post:1:tags`,
    solution: `SADD post:1:tags "redis" "database" "cache"
SADD post:1:tags "redis"
SCARD post:1:tags
SISMEMBER post:1:tags "cache"
SISMEMBER post:1:tags "mongodb"
SMEMBERS post:1:tags
SREM post:1:tags "cache"
SCARD post:1:tags
SMEMBERS post:1:tags
SREM post:1:tags "mongodb"
SADD post:1:tags "nosql" "redis"
SCARD post:1:tags
SMEMBERS post:1:tags`,
    solutionExplanationHtml: `<p>A set enforces uniqueness inside the database, so the application never has to check "is this tag already there" before writing. <code>SADD</code> is idempotent: adding <code>"redis"</code> a second time is a no-op that returns <code>0</code>, and a mixed batch like <code>"nosql" "redis"</code> returns <code>1</code> because only one member was new. That count-of-changed return is the same convention as <code>HSET</code> and <code>DEL</code>, and reading it as a success flag is the usual mistake — <code>0</code> means "already in the state you asked for", not "failed". <code>SREM</code> mirrors it, returning <code>0</code> when the member was not present, which makes cleanup code safe to run twice.</p>
<p>The performance argument is what makes a set the right choice rather than a list. <code>SISMEMBER</code> is O(1) because the set is backed by a hash table, so "has this user already liked this post" stays instant whether the set holds ten members or ten million; the same question against a list costs an O(N) scan of every element. <code>SCARD</code> is also O(1) since Redis maintains the count, so never fetch <code>SMEMBERS</code> just to count it in the client — that transfers the entire set over the network to compute a number Redis already knows, and on a large set it can stall the server. The property you give up is ordering: <code>SMEMBERS</code> returns members in whatever order the internal encoding happens to produce, and that order can change when the set grows past the small-encoding threshold and is rehashed. Code that depends on it will pass in development and break in production, so if you need order, reach for a list (insertion order) or a sorted set (score order). One production caution: <code>SMEMBERS</code> on a very large set is O(N) and blocks the single-threaded server, so iterate with <code>SSCAN</code> instead.</p>`,
  },

  {
    title: 'Find Mutual and Exclusive Followers with SINTER, SUNION, and SDIFF',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 20,
    concepts: ['SINTER', 'SUNION', 'SDIFF', 'SINTERCARD', 'SINTERSTORE', 'server-side set algebra'],
    prerequisites: ['SADD', 'SMEMBERS', 'SCARD', 'SISMEMBER'],
    tags: ['sets', 'sinter', 'sdiff', 'set-algebra', 'redis'],
    problemHtml: `<p>Once relationships are stored as sets, questions that would be joins in SQL become single Redis commands evaluated <strong>server-side</strong>: mutual followers is an intersection, the combined audience is a union, and "follows Ann but not Bob" is a difference. The alternative — fetching both sets to the client and intersecting them there — transfers everything over the network and scales terribly, which is precisely what these commands exist to avoid.</p>
<p>Using <code>redis-cli</code>, model two follower sets and query them:</p>
<ul>
<li><code>SADD followers:ann "u1" "u2" "u3" "u4"</code> (returns <code>4</code>) and <code>SADD followers:bob "u3" "u4" "u5"</code> (returns <code>3</code>).</li>
<li><code>SINTER followers:ann followers:bob</code> &rarr; the members in <strong>both</strong> sets: <code>u3</code> and <code>u4</code>.</li>
<li><code>SUNION followers:ann followers:bob</code> &rarr; every distinct member across both, five in total.</li>
<li><code>SDIFF followers:ann followers:bob</code> &rarr; members of the <strong>first</strong> set not in the second: <code>u1</code>, <code>u2</code>. Then run <code>SDIFF followers:bob followers:ann</code> and observe you get <code>u5</code> instead — difference is <strong>not</strong> symmetric, so argument order is part of the question.</li>
<li>When you only need the size, avoid transferring members: <code>SINTERCARD 2 followers:ann followers:bob</code> returns <code>2</code>. Note the mandatory <em>numkeys</em> argument, which <code>SINTER</code> does not take.</li>
<li>Persist a result for reuse with <code>SINTERSTORE mutual:ann:bob followers:ann followers:bob</code>; it returns the cardinality of the stored set. Verify with <code>SMEMBERS</code> and <code>SISMEMBER mutual:ann:bob "u3"</code>.</li>
</ul>
<p>Result ordering from these commands is undefined. The scaffold lists the commands with the member lists and key arguments blank.</p>`,
    inputSpec: 'A clean Redis database. Two set keys, followers:ann and followers:bob, hold user ids; a third key mutual:ann:bob is produced by SINTERSTORE.',
    outputSpec: 'The two SADD calls return 4 and 3; SINTER returns u3 and u4; SUNION returns all five distinct ids; SDIFF ann bob returns u1 and u2 while SDIFF bob ann returns u5; SCARD followers:ann is 4; SINTERCARD 2 returns 2; SINTERSTORE returns 2, SMEMBERS mutual:ann:bob lists u3 and u4, and SISMEMBER mutual:ann:bob "u3" returns 1. Member order in every multi-value reply is unspecified.',
    constraints: 'Perform all set algebra on the server — do not fetch both sets and compare in the client. SINTERCARD requires an explicit numkeys argument; SINTER, SUNION, SDIFF, and SINTERSTORE do not. Do not assume SDIFF is symmetric. Do not rely on result ordering.',
    examplesJson: [
      {
        input: 'followers:ann = u1 u2 u3 u4, followers:bob = u3 u4 u5; SINTER followers:ann followers:bob',
        output: '1) "u3"\n2) "u4"',
        explanation: 'The intersection is the members present in every listed set — the mutual followers — computed entirely on the server.',
      },
      {
        input: 'SDIFF followers:ann followers:bob then SDIFF followers:bob followers:ann',
        output: '1) "u1"\n2) "u2"\n1) "u5"',
        explanation: 'Difference subtracts the later sets from the first, so swapping the arguments answers a different question: Ann-only followers versus Bob-only followers.',
      },
      {
        input: 'SINTERCARD 2 followers:ann followers:bob then SINTERSTORE mutual:ann:bob followers:ann followers:bob',
        output: '(integer) 2\n(integer) 2',
        explanation: 'SINTERCARD returns just the size (numkeys is mandatory); SINTERSTORE writes the intersection into a new key and returns its cardinality.',
      },
    ],
    hintsJson: [
      'Mutual, combined, and exclusive are the three classic set operations — and Redis has a command for each.',
      'SINTER key1 key2 gives members in both; SUNION gives every distinct member; SDIFF gives members of the first key that are in none of the others.',
      'SDIFF is order-sensitive: SDIFF a b and SDIFF b a answer different questions.',
      'SINTERCARD numkeys key1 key2 returns only the count and needs the numkeys argument; SINTERSTORE dest key1 key2 saves the intersection into dest and returns its size.',
    ],
    starter: `SADD followers:ann ____ ____ ____ ____
SADD followers:bob ____ ____ ____
SINTER followers:ann followers:bob
SUNION followers:ann followers:bob
SDIFF followers:ann followers:bob
SDIFF ____ ____
SCARD followers:ann
SINTERCARD ____ followers:ann followers:bob
SINTERSTORE mutual:ann:bob followers:ann followers:bob
SMEMBERS mutual:ann:bob
SISMEMBER mutual:ann:bob "u3"
SCARD mutual:ann:bob`,
    solution: `SADD followers:ann "u1" "u2" "u3" "u4"
SADD followers:bob "u3" "u4" "u5"
SINTER followers:ann followers:bob
SUNION followers:ann followers:bob
SDIFF followers:ann followers:bob
SDIFF followers:bob followers:ann
SCARD followers:ann
SINTERCARD 2 followers:ann followers:bob
SINTERSTORE mutual:ann:bob followers:ann followers:bob
SMEMBERS mutual:ann:bob
SISMEMBER mutual:ann:bob "u3"
SCARD mutual:ann:bob`,
    solutionExplanationHtml: `<p>Storing relationships as sets turns relational questions into single commands. <code>SINTER</code> returns members present in <em>every</em> listed key — mutual followers, users in both an "active" and a "premium" segment, tags shared by two articles. <code>SUNION</code> returns every distinct member across the keys, deduplicating for free. <code>SDIFF</code> subtracts: it returns members of the <strong>first</strong> key that appear in none of the rest, which is how you express "follows Ann but not Bob", "signed up but never purchased", or "online yesterday but not today". The asymmetry demonstrated by the two <code>SDIFF</code> calls is the trap: <code>SDIFF a b</code> gives <code>u1</code> and <code>u2</code> while <code>SDIFF b a</code> gives <code>u5</code>, so argument order encodes half the meaning. Intersection and union, by contrast, are commutative.</p>
<p>The decisive advantage is that all of this runs inside Redis. Pulling two follower sets to the application and intersecting them there costs the full size of both sets in network traffic and client memory, whereas <code>SINTER</code> ships back only the answer; Redis also optimises by starting from the smallest set, so the work is bounded by the smallest input rather than the largest. Two variants sharpen this further. <code>SINTERCARD numkeys key ...</code> returns just the size when you only need a count — the mandatory <em>numkeys</em> argument exists because it accepts an optional <code>LIMIT</code> after the keys, and forgetting it is the most common error with this command. The <code>...STORE</code> family (<code>SINTERSTORE</code>, <code>SUNIONSTORE</code>, <code>SDIFFSTORE</code>) writes the result into a destination key and returns its cardinality, letting you cache an expensive computation and then query the cached set cheaply with <code>SISMEMBER</code>, as the last commands do. Remember the stored result is a snapshot that does not track later changes to its inputs, and give it a TTL if it should not live forever. In Redis Cluster these multi-key commands require all keys in the same hash slot, which is what hash tags such as <code>followers:{ann}</code> are for.</p>`,
    diagramMermaid: `flowchart TD
  A[followers ann u1 u2 u3 u4] --> I[SINTER gives u3 u4]
  B[followers bob u3 u4 u5] --> I
  A --> U[SUNION gives u1 u2 u3 u4 u5]
  B --> U
  A --> D1[SDIFF ann bob gives u1 u2]
  B --> D2[SDIFF bob ann gives u5]
  I --> S[SINTERSTORE saves mutual ann bob]`,
  },

  {
    title: 'Rank Players on a Live Leaderboard with a Sorted Set',
    difficulty: 'MEDIUM',
    estimatedMinutes: 35,
    points: 20,
    concepts: ['ZADD', 'ZSCORE', 'ZINCRBY', 'ZREVRANGE WITHSCORES', 'ZRANK', 'ZREVRANK'],
    prerequisites: ['SADD', 'SCARD', 'HINCRBY', 'atomic counters'],
    tags: ['sorted-sets', 'zadd', 'leaderboard', 'ranking', 'redis'],
    problemHtml: `<p>A leaderboard needs three things at once: unique players, a score per player, and the ability to read the top N and one player's rank instantly. A set gives uniqueness but no scores; a hash gives scores but no ordering, so ranking would mean fetching every player and sorting in the client. A <strong>sorted set</strong> gives all three — it is a set of unique members where each member carries a floating-point score, and Redis keeps the members permanently ordered by that score.</p>
<p>Using <code>redis-cli</code>, run the <code>leaderboard</code> key:</p>
<ul>
<li>Seed four players in one <code>ZADD</code>: <code>ann</code> 1500, <code>bob</code> 1200, <code>cy</code> 1800, <code>di</code> 900. It returns <code>4</code> (members added). Confirm <code>ZCARD</code> is <code>4</code>.</li>
<li><code>ZSCORE leaderboard "ann"</code> returns the score as the string <code>"1500"</code>; <code>ZSCORE leaderboard "zoe"</code> returns <code>(nil)</code>.</li>
<li>Award Bob 400 points with <code>ZINCRBY leaderboard 400 "bob"</code>, which returns the new score <code>"1600"</code>. Read it back with <code>ZSCORE</code>.</li>
<li>Show the top three with <code>ZREVRANGE leaderboard 0 2 WITHSCORES</code> — highest score first, each member followed by its score. Then run <code>ZRANGE leaderboard 0 -1</code> to see the default <strong>ascending</strong> order, lowest first.</li>
<li>Look up Ann's position both ways: <code>ZRANK</code> (ascending, so <code>1</code>) and <code>ZREVRANK</code> (descending, so <code>2</code>). Ranks are <strong>0-based</strong>, so leaderboard position is rank + 1. Fetch the single leader with <code>ZREVRANGE leaderboard 0 0</code>.</li>
<li>Re-add an existing member with a new score: <code>ZADD leaderboard 2000 "ann"</code> returns <code>0</code> because no member was <em>added</em> — the score was updated and Ann moves to the top. Confirm with a final <code>ZREVRANGE leaderboard 0 -1 WITHSCORES</code>.</li>
</ul>
<p>The scaffold lists the commands with the scores and range bounds blank.</p>`,
    inputSpec: 'A clean Redis database. One sorted set key, leaderboard, maps player names to numeric scores.',
    outputSpec: 'ZADD returns 4 and ZCARD is 4; ZSCORE "ann" returns "1500" and ZSCORE "zoe" returns (nil); ZINCRBY returns "1600"; ZREVRANGE 0 2 WITHSCORES lists cy 1800, bob 1600, ann 1500; ZRANGE 0 -1 lists di, ann, bob, cy ascending; ZRANK "ann" is 1 and ZREVRANK "ann" is 2; ZREVRANGE 0 0 returns cy; the re-ADD returns 0 and the final ZREVRANGE WITHSCORES lists ann 2000, cy 1800, bob 1600, di 900.',
    constraints: 'Do not sort in the client — every ordering must come from the sorted set. Use ZINCRBY to adjust a score rather than reading it and re-adding. Ranks are 0-based. ZADD on an existing member updates its score and returns 0.',
    examplesJson: [
      {
        input: 'ZADD leaderboard 1500 "ann" 1200 "bob" 1800 "cy" 900 "di" then ZINCRBY leaderboard 400 "bob"',
        output: '(integer) 4\n"1600"',
        explanation: 'ZADD returns the count of members newly added. ZINCRBY adds to an existing score atomically and returns the new score as a string.',
      },
      {
        input: 'ZREVRANGE leaderboard 0 2 WITHSCORES after Bob reaches 1600',
        output: '1) "cy"\n2) "1800"\n3) "bob"\n4) "1600"\n5) "ann"\n6) "1500"',
        explanation: 'WITHSCORES flattens the reply into alternating member and score entries, and ZREVRANGE walks from the highest score down, giving the top three directly.',
      },
      {
        input: 'ZRANK leaderboard "ann" then ZREVRANK leaderboard "ann" then ZADD leaderboard 2000 "ann"',
        output: '(integer) 1\n(integer) 2\n(integer) 0',
        explanation: 'Ranks are 0-based and mirror each other across the four members. Re-adding an existing member updates its score, adding nobody, so ZADD returns 0.',
      },
    ],
    hintsJson: [
      'You need uniqueness, a numeric score, and instant ordering — only one Redis type gives all three.',
      'ZADD key score member [score member ...] inserts or updates; ZSCORE key member reads one score back.',
      'ZRANGE walks ascending by score and ZREVRANGE descending, so the top N is ZREVRANGE key 0 N-1; add WITHSCORES to get the scores too.',
      'ZINCRBY key amount member adjusts a score atomically and returns the new one. ZRANK is the 0-based ascending position and ZREVRANK the descending one, so display position is rank plus 1.',
    ],
    starter: `ZADD leaderboard ____ "ann" ____ "bob" ____ "cy" ____ "di"
ZCARD leaderboard
ZSCORE leaderboard "ann"
ZSCORE leaderboard "zoe"
ZINCRBY leaderboard ____ "bob"
ZSCORE leaderboard "bob"
ZREVRANGE leaderboard 0 ____ WITHSCORES
ZRANGE leaderboard 0 -1
ZRANK leaderboard "ann"
ZREVRANK leaderboard "ann"
ZREVRANGE leaderboard 0 0
ZADD leaderboard ____ "ann"
ZREVRANGE leaderboard 0 -1 WITHSCORES`,
    solution: `ZADD leaderboard 1500 "ann" 1200 "bob" 1800 "cy" 900 "di"
ZCARD leaderboard
ZSCORE leaderboard "ann"
ZSCORE leaderboard "zoe"
ZINCRBY leaderboard 400 "bob"
ZSCORE leaderboard "bob"
ZREVRANGE leaderboard 0 2 WITHSCORES
ZRANGE leaderboard 0 -1
ZRANK leaderboard "ann"
ZREVRANK leaderboard "ann"
ZREVRANGE leaderboard 0 0
ZADD leaderboard 2000 "ann"
ZREVRANGE leaderboard 0 -1 WITHSCORES`,
    solutionExplanationHtml: `<p>A sorted set is a set plus a score per member, kept permanently ordered by that score. Because the ordering is maintained on write (in a skip list, with a hash table alongside for member lookups), reads that would otherwise require sorting are cheap: <code>ZREVRANGE leaderboard 0 2</code> returns the top three in O(log N + 3) no matter how many players exist, and <code>ZRANK</code> answers "where does this player stand" in O(log N) without touching anyone else's score. Doing the same with a hash would mean fetching every player and sorting client-side on every page load — the whole reason this type exists.</p>
<p>Several details are load-bearing. <strong>Direction:</strong> <code>ZRANGE</code> is ascending (lowest score first) and <code>ZREVRANGE</code> descending, so a leaderboard almost always wants <code>ZREVRANGE</code>; <code>ZRANK</code> and <code>ZREVRANK</code> mirror them, and both are <strong>0-based</strong>, which is why Ann sits at rank <code>1</code> ascending and <code>2</code> descending among four players — display position is rank + 1. <strong>Return types:</strong> ranks and counts come back as integers, but scores come back as <em>strings</em> (<code>"1500"</code>, <code>"1600"</code>) because they are IEEE doubles formatted for transport, so parse them client-side and expect no trailing <code>.0</code> for whole numbers. A missing member yields <code>(nil)</code> from <code>ZSCORE</code>, which is how you distinguish "not on the board" from "scored zero". <strong>Upsert semantics:</strong> <code>ZADD</code> on an existing member updates its score and returns <code>0</code>, since the return value counts <em>added</em> members, not modified ones — use the <code>CH</code> flag if you want changed members counted, and <code>GT</code>/<code>LT</code>/<code>NX</code>/<code>XX</code> to make the update conditional, for instance <code>ZADD leaderboard GT 1400 "ann"</code> to record only a personal best. <strong>Atomicity:</strong> prefer <code>ZINCRBY</code> over reading a score and re-adding it, for the same lost-update reason that <code>INCR</code> beats <code>GET</code>-then-<code>SET</code>. Finally, ties: members with equal scores are ordered lexicographically by member name, so if you need a deterministic tie-break by time, fold a timestamp into the score itself.</p>`,
  },

  {
    title: 'Query a Time-Ordered Event Index with ZRANGEBYSCORE',
    difficulty: 'HARD',
    estimatedMinutes: 45,
    points: 25,
    concepts: ['ZRANGEBYSCORE', 'exclusive range syntax', 'ZCOUNT', 'LIMIT offset count', 'ZREMRANGEBYSCORE', 'member uniqueness'],
    prerequisites: ['ZADD', 'ZRANGE', 'ZSCORE', 'ZCARD'],
    tags: ['sorted-sets', 'zrangebyscore', 'time-series', 'index', 'redis'],
    problemHtml: `<p>A score does not have to be a game score. Put a <strong>Unix timestamp</strong> in it and the sorted set becomes a time index: members stay ordered by time, "everything between 09:00 and 10:00" is one range query, and pruning old data is one command. This is the standard way to store a user's recent events, a sliding-window rate limiter's request log, or a delayed-job schedule in Redis.</p>
<p>Using <code>redis-cli</code>, build and query <code>events:user:7</code>:</p>
<ul>
<li>Add four events with timestamps as scores: <code>1700000100 "login"</code>, <code>1700000200 "view:post:9"</code>, <code>1700000350 "comment:post:9"</code>, <code>1700000500 "logout"</code> — four separate <code>ZADD</code> calls, each returning <code>1</code>.</li>
<li>The user logs in again at <code>1700000900</code>. Run <code>ZADD events:user:7 1700000900 "login"</code> and study the result: it returns <code>0</code> and <code>ZCARD</code> is still <code>4</code>. A sorted set holds <strong>unique members</strong>, so the second login did not create a second entry — it <em>moved</em> the existing <code>"login"</code> member to the new time, destroying the original record.</li>
<li>Query the closed range <code>ZRANGEBYSCORE events:user:7 1700000150 1700000500</code>, then repeat it <code>WITHSCORES</code>. Both bounds are <strong>inclusive</strong>.</li>
<li>Use the infinity bounds: <code>ZRANGEBYSCORE events:user:7 -inf +inf</code> returns everything in time order.</li>
<li>Make a bound <strong>exclusive</strong> with a leading parenthesis: <code>ZRANGEBYSCORE events:user:7 (1700000200 +inf</code> excludes the event scored exactly 1700000200.</li>
<li>Count without transferring members: <code>ZCOUNT events:user:7 1700000000 1700000400</code>. Then page a range with <code>ZRANGEBYSCORE events:user:7 -inf +inf LIMIT 0 2</code>.</li>
<li>Prune everything older than <code>1700000200</code> inclusive with <code>ZREMRANGEBYSCORE events:user:7 -inf 1700000200</code>, which returns how many members it removed, and dump the survivors with <code>ZRANGE events:user:7 0 -1 WITHSCORES</code>.</li>
</ul>
<p>The scaffold lists the commands with the range bounds blank.</p>`,
    inputSpec: 'A clean Redis database. One sorted set key, events:user:7, uses Unix timestamps as scores and event names as members.',
    outputSpec: 'The first four ZADD calls return 1; the repeated "login" ZADD returns 0 and ZCARD stays 4. ZRANGEBYSCORE 1700000150 1700000500 returns view:post:9, comment:post:9, logout, and WITHSCORES adds their timestamps. -inf +inf returns those three plus login last (score 1700000900). The exclusive bound (1700000200 drops view:post:9. ZCOUNT 1700000000 1700000400 returns 2. LIMIT 0 2 returns the first two members of the full range. ZREMRANGEBYSCORE -inf 1700000200 returns 1, and the final ZRANGE WITHSCORES shows comment:post:9 1700000350, logout 1700000500, login 1700000900.',
    constraints: 'Scores are Unix timestamps; do not store times as members. Use -inf and +inf rather than hard-coded extreme numbers. Prefix a bound with ( to make it exclusive. Use ZCOUNT when only the count is needed and ZREMRANGEBYSCORE to prune — do not fetch and delete member by member.',
    examplesJson: [
      {
        input: 'ZADD events:user:7 1700000900 "login" when "login" already exists at 1700000100, then ZCARD events:user:7',
        output: '(integer) 0\n(integer) 4',
        explanation: 'Members are unique: the second ZADD updated the existing "login" score instead of inserting a row, so nothing was added and the cardinality is unchanged.',
      },
      {
        input: 'ZRANGEBYSCORE events:user:7 1700000150 1700000500 then ZRANGEBYSCORE events:user:7 (1700000200 +inf',
        output: '1) "view:post:9"\n2) "comment:post:9"\n3) "logout"\n1) "comment:post:9"\n2) "logout"\n3) "login"',
        explanation: 'The first range is inclusive at both ends. The leading ( makes 1700000200 exclusive, so view:post:9 drops out, and +inf extends to the newest event.',
      },
      {
        input: 'ZCOUNT events:user:7 1700000000 1700000400 then ZREMRANGEBYSCORE events:user:7 -inf 1700000200',
        output: '(integer) 2\n(integer) 1',
        explanation: 'ZCOUNT reports how many members fall in the window without transferring them; ZREMRANGEBYSCORE deletes the window in one command and returns the number removed.',
      },
    ],
    hintsJson: [
      'Sorted-set scores are just doubles — nothing stops the score from being a Unix timestamp, which makes time ranges into score ranges.',
      'ZRANGEBYSCORE key min max returns members whose score lies in the window, already in time order, with both bounds inclusive.',
      'Use -inf and +inf for open-ended windows, and prefix a bound with ( to exclude it, as in (1700000200 +inf.',
      'ZCOUNT gives just the size of a window, LIMIT offset count pages a range like SQL, and ZREMRANGEBYSCORE deletes a whole window and returns the number removed. Remember members are unique, so re-adding one moves it rather than appending.',
    ],
    starter: `ZADD events:user:7 1700000100 "login"
ZADD events:user:7 1700000200 "view:post:9"
ZADD events:user:7 1700000350 "comment:post:9"
ZADD events:user:7 1700000500 "logout"
ZADD events:user:7 1700000900 "login"
ZCARD events:user:7
ZRANGEBYSCORE events:user:7 ____ ____
ZRANGEBYSCORE events:user:7 1700000150 1700000500 WITHSCORES
ZRANGEBYSCORE events:user:7 ____ ____
ZRANGEBYSCORE events:user:7 ____ +inf
ZCOUNT events:user:7 1700000000 1700000400
ZRANGEBYSCORE events:user:7 -inf +inf LIMIT 0 ____
ZREMRANGEBYSCORE events:user:7 -inf ____
ZRANGE events:user:7 0 -1 WITHSCORES
ZCARD events:user:7`,
    solution: `ZADD events:user:7 1700000100 "login"
ZADD events:user:7 1700000200 "view:post:9"
ZADD events:user:7 1700000350 "comment:post:9"
ZADD events:user:7 1700000500 "logout"
ZADD events:user:7 1700000900 "login"
ZCARD events:user:7
ZRANGEBYSCORE events:user:7 1700000150 1700000500
ZRANGEBYSCORE events:user:7 1700000150 1700000500 WITHSCORES
ZRANGEBYSCORE events:user:7 -inf +inf
ZRANGEBYSCORE events:user:7 (1700000200 +inf
ZCOUNT events:user:7 1700000000 1700000400
ZRANGEBYSCORE events:user:7 -inf +inf LIMIT 0 2
ZREMRANGEBYSCORE events:user:7 -inf 1700000200
ZRANGE events:user:7 0 -1 WITHSCORES
ZCARD events:user:7`,
    solutionExplanationHtml: `<p>Because a sorted-set score is an arbitrary double, using a Unix timestamp turns the structure into a time index with no extra machinery. Members come back in chronological order for free, and "what happened between T1 and T2" becomes <code>ZRANGEBYSCORE key T1 T2</code>, executed in O(log N + M) where M is the number of results — Redis binary-searches to the start of the window and walks forward, so a narrow window over a huge history is cheap. Three pieces of range syntax do most of the work: both bounds are <strong>inclusive</strong> by default; <code>-inf</code> and <code>+inf</code> express open-ended windows without inventing magic numbers; and a leading <code>(</code> makes a bound <strong>exclusive</strong>, which is what drops <code>view:post:9</code> from the <code>(1700000200 +inf</code> query. That parenthesis is easy to forget and produces an off-by-one that silently double-counts boundary events when you page through time in consecutive windows — page with an exclusive lower bound.</p>
<p>Two companions avoid moving data you do not need. <code>ZCOUNT</code> answers the size of a window server-side, so "how many events in the last hour" never transfers the events; a sliding-window rate limiter is exactly this, plus <code>ZREMRANGEBYSCORE</code> to drop what has aged out. <code>ZREMRANGEBYSCORE key -inf T</code> prunes an entire time window in one command and returns how many members it deleted, which is far better than fetching ids and deleting them one by one. <code>LIMIT offset count</code> pages a range the way SQL's <code>LIMIT</code> does, but note the same caveat: a large offset still walks the skipped elements, so prefer advancing the score bound over growing the offset when paging deep.</p>
<p>The trap this exercise is built around is <strong>member uniqueness</strong>. A sorted set is a set first: the second <code>ZADD ... 1700000900 "login"</code> returned <code>0</code> and left <code>ZCARD</code> at <code>4</code> because it updated the existing member's score rather than appending a second login — the original 1700000100 login is simply gone. Any event log with repeatable event names must therefore make each member unique, typically by embedding an event id or the timestamp itself (<code>"login:1700000900"</code>) and keeping the payload elsewhere, for instance in a hash keyed by that id. If you genuinely need an append-only log with duplicates and consumer groups, a Redis Stream is the purpose-built type; the sorted-set index shines when you need arbitrary range queries and cheap pruning by time.</p>`,
  },

  {
    title: 'Assemble a Post Feed Backend from Four Data Structures',
    difficulty: 'HARD',
    estimatedMinutes: 60,
    points: 30,
    concepts: ['structure selection', 'hash for object fields', 'capped list feed', 'set for unique likers', 'sorted set for trending', 'INCR for global totals'],
    prerequisites: ['HSET', 'HINCRBY', 'LPUSH', 'LTRIM', 'SADD', 'SINTER', 'ZADD', 'ZINCRBY', 'INCR'],
    tags: ['capstone', 'data-modelling', 'feed', 'redis', 'structures'],
    problemHtml: `<p>Real Redis work is rarely about one command — it is about picking the right structure for each requirement and letting each do the job it is good at. This capstone builds the storage layer of a small social feed, using a different type for each requirement and nothing else.</p>
<p>The requirements, and the structure each one dictates:</p>
<ul>
<li><strong>A global count of posts ever created</strong> &rarr; a string counter, because it is a single number owned by nobody: <code>INCR stats:posts:total</code> (returns <code>1</code>).</li>
<li><strong>Post 1001's attributes plus its like count</strong> &rarr; a hash, because they are named fields of one object read together: <code>HSET post:1001 author "ann" title "Redis data types" likes 0</code> (returns <code>3</code>).</li>
<li><strong>User 7's feed of the 3 most recent post ids, newest first</strong> &rarr; a capped list. <code>LPUSH feed:user:7</code> the ids <code>"1001"</code>, <code>"1002"</code>, <code>"1003"</code>, <code>"1004"</code> in that order, then cap it with <code>LTRIM feed:user:7 0 2</code>. Because you prepend, the newest-N window is <code>0 2</code>, not <code>-3 -1</code>. Read it with <code>LRANGE feed:user:7 0 -1</code>.</li>
<li><strong>Who liked each post, with no double-likes</strong> &rarr; sets. <code>SADD post:1001:likers "u2" "u5" "u9"</code> (returns <code>3</code>), then <code>SADD post:1001:likers "u5"</code> again (returns <code>0</code> — the set absorbs the duplicate). Add <code>SADD post:1002:likers "u5" "u7"</code>. Check <code>SCARD post:1001:likers</code> and <code>SISMEMBER post:1001:likers "u9"</code>, and find who liked <strong>both</strong> posts with <code>SINTER post:1001:likers post:1002:likers</code>.</li>
<li><strong>Post 1001's denormalised like count</strong> &rarr; <code>HINCRBY post:1001 likes 3</code> so a feed render needs one <code>HGETALL</code> instead of an <code>SCARD</code> per post.</li>
<li><strong>A trending board ordered by engagement</strong> &rarr; a sorted set: <code>ZADD trending 3 "1001"</code>, then <code>ZINCRBY trending 5 "1002"</code> and <code>ZINCRBY trending 1 "1001"</code> as engagement arrives. Read the whole board with <code>ZREVRANGE trending 0 -1 WITHSCORES</code>.</li>
<li>Finish by dumping <code>HGETALL post:1001</code> and <code>GET stats:posts:total</code>.</li>
</ul>
<p>The scaffold gives the command skeleton with values, amounts, and trim bounds blank. Every structure must be used for the requirement it fits — do not, for example, keep the feed in a sorted set or the likers in a list.</p>`,
    inputSpec: 'A clean Redis database. Keys created: the string stats:posts:total, the hash post:1001, the list feed:user:7, the sets post:1001:likers and post:1002:likers, and the sorted set trending.',
    outputSpec: 'INCR returns 1; HSET returns 3; the four LPUSH calls return 1..4; LTRIM returns OK and LRANGE feed:user:7 0 -1 gives 1004, 1003, 1002 in that order; SADD returns 3 then 0 then 2; SCARD post:1001:likers is 3; SISMEMBER "u9" is 1; SINTER returns u5; HINCRBY likes 3 returns 3; ZADD returns 1; ZINCRBY returns "5" then "4"; ZREVRANGE trending 0 -1 WITHSCORES gives 1002 5 then 1001 4; HGETALL post:1001 shows author ann, title Redis data types, likes 3; GET stats:posts:total returns "1".',
    constraints: 'Use exactly one structure per requirement as stated: string counter, hash, capped list, sets, sorted set. The feed must be prepended with LPUSH and capped with a single LTRIM — no pop loops. Likers must be sets so duplicates are impossible. All arithmetic (post total, like count, trending score) must be done by INCR, HINCRBY, or ZINCRBY inside Redis, never read-modify-write in the client.',
    examplesJson: [
      {
        input: 'LPUSH feed:user:7 with "1001", "1002", "1003", "1004" then LTRIM feed:user:7 0 2 then LRANGE feed:user:7 0 -1',
        output: 'OK\n1) "1004"\n2) "1003"\n3) "1002"',
        explanation: 'LPUSH prepends, so the list already reads newest-first; capping a head-prepended feed to the newest three is the window 0 2, and 1001 is discarded.',
      },
      {
        input: 'SADD post:1001:likers "u2" "u5" "u9" then SADD post:1001:likers "u5" then SINTER post:1001:likers post:1002:likers',
        output: '(integer) 3\n(integer) 0\n1) "u5"',
        explanation: 'The set makes a repeat like a no-op returning 0, and the intersection with post 1002 likers finds u5 as the only user who liked both.',
      },
      {
        input: 'ZADD trending 3 "1001" then ZINCRBY trending 5 "1002" then ZINCRBY trending 1 "1001" then ZREVRANGE trending 0 -1 WITHSCORES',
        output: '(integer) 1\n"5"\n"4"\n1) "1002"\n2) "5"\n3) "1001"\n4) "4"',
        explanation: 'ZINCRBY creates a missing member at 0 before adding, returning the new score as a string; ZREVRANGE then reads the board highest-first with scores interleaved.',
      },
    ],
    hintsJson: [
      'Read each requirement and ask what it demands — a single number, named fields, order, uniqueness, or ranking. Each answer names one type.',
      'Object fields go in a hash, a bounded newest-first feed is an LPUSH list plus LTRIM, "no double likes" is a set, and "ordered by engagement" is a sorted set.',
      'Because the feed is prepended with LPUSH, the newest three live at indices 0 through 2, so cap it with LTRIM key 0 2 — using -3 -1 would keep the oldest three instead.',
      'ZINCRBY creates a missing member at score 0 before adding, so a trending board needs no seeding; SINTER answers "liked both posts" server-side; and HINCRBY keeps the denormalised like count next to the post fields.',
    ],
    starter: `INCR stats:posts:total
HSET post:1001 author ____ title ____ likes 0
LPUSH feed:user:7 ____
LPUSH feed:user:7 ____
LPUSH feed:user:7 ____
LPUSH feed:user:7 ____
LTRIM feed:user:7 ____ ____
LRANGE feed:user:7 0 -1
SADD post:1001:likers ____ ____ ____
SADD post:1001:likers ____
SADD post:1002:likers ____ ____
SCARD post:1001:likers
SISMEMBER post:1001:likers "u9"
SINTER post:1001:likers post:1002:likers
HINCRBY post:1001 likes ____
ZADD trending ____ "1001"
ZINCRBY trending ____ "1002"
ZINCRBY trending ____ "1001"
ZREVRANGE trending 0 -1 WITHSCORES
HGETALL post:1001
GET stats:posts:total`,
    solution: `INCR stats:posts:total
HSET post:1001 author "ann" title "Redis data types" likes 0
LPUSH feed:user:7 "1001"
LPUSH feed:user:7 "1002"
LPUSH feed:user:7 "1003"
LPUSH feed:user:7 "1004"
LTRIM feed:user:7 0 2
LRANGE feed:user:7 0 -1
SADD post:1001:likers "u2" "u5" "u9"
SADD post:1001:likers "u5"
SADD post:1002:likers "u5" "u7"
SCARD post:1001:likers
SISMEMBER post:1001:likers "u9"
SINTER post:1001:likers post:1002:likers
HINCRBY post:1001 likes 3
ZADD trending 3 "1001"
ZINCRBY trending 5 "1002"
ZINCRBY trending 1 "1001"
ZREVRANGE trending 0 -1 WITHSCORES
HGETALL post:1001
GET stats:posts:total`,
    solutionExplanationHtml: `<p>The skill this capstone trains is <strong>matching a requirement to a structure</strong>, and each choice here is forced by the requirement rather than by taste. A single global number owned by no object is a string key incremented with <code>INCR</code>. Named attributes read together as one unit are a hash, so one <code>HGETALL post:1001</code> renders a card in a single round trip. An ordered, bounded, newest-first list of ids is a list with <code>LPUSH</code> plus <code>LTRIM</code>. "The same user must not like twice" is uniqueness, which is a set — and once likers are sets, "who liked both posts" is the free bonus <code>SINTER</code>, computed server-side. "Ordered by engagement, updated continuously, top N read often" is exactly the sorted set's job, with <code>ZINCRBY</code> creating a missing member at <code>0</code> before adding so the board needs no seeding.</p>
<p>The subtle correctness point is the trim window. Because the feed is <em>prepended</em> with <code>LPUSH</code>, the newest element sits at index <code>0</code>, so keeping the newest three is <code>LTRIM feed:user:7 0 2</code>. Reusing the tail-append idiom <code>-3 -1</code> here would keep the three <em>oldest</em> ids and silently discard every new post — a bug that never errors and only shows up as a feed that stopped moving. Pair the direction of your push with the direction of your trim, and encode it in one helper so the two can never drift apart. The second modelling point is the deliberate <strong>denormalisation</strong> of <code>likes</code> into the post hash alongside the authoritative <code>post:1001:likers</code> set. The set is the source of truth for <em>who</em> liked, but calling <code>SCARD</code> for every post while rendering a feed of 50 posts costs 50 extra commands; keeping a counter in the hash means the count arrives with the post's other fields. The price is that two writes must stay in step — a real implementation would do the <code>SADD</code> and the <code>HINCRBY</code> together in a <code>MULTI</code>/<code>EXEC</code> transaction or a Lua script, and would only increment when <code>SADD</code> returns <code>1</code>, so a repeated like does not inflate the count.</p>
<p>Two habits generalise beyond this exercise. First, every key name here encodes its owner and its role — <code>post:1001</code>, <code>post:1001:likers</code>, <code>feed:user:7</code> — so the model is legible from the keyspace alone; a flat keyspace with no convention becomes unmaintainable fast. Second, all arithmetic stays inside Redis (<code>INCR</code>, <code>HINCRBY</code>, <code>ZINCRBY</code>) rather than being read into the client, added, and written back, which is what keeps every counter correct under concurrency. What is still missing is lifetime management: none of these keys expires, and a per-user feed for a departed user would live forever. Attaching TTLs and reasoning about key management is the next module's subject.</p>`,
    diagramMermaid: `flowchart TD
  R[Requirement] --> A[Single global number uses string INCR]
  R --> B[Named fields of one object uses hash HSET HINCRBY]
  R --> C[Ordered bounded newest first uses list LPUSH plus LTRIM]
  R --> D[No duplicates plus fast membership uses set SADD SINTER]
  R --> E[Ranked by score uses sorted set ZADD ZINCRBY ZREVRANGE]`,
  },
];

// ---- emit payload + verify (verify built from solutionCodeJson, FLUSHALL between) ----
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

let cmds = '';
exercises.forEach((ex, i) => {
  cmds += `ECHO "========== EX ${i + 1}: ${ex.title.replace(/"/g, '')} =========="\n`;
  cmds += 'FLUSHALL\n' + ex.solution + '\n';
});
fs.writeFileSync(path.join(VERIFY, `redis-423.txt`), cmds);

const parsed = JSON.parse(fs.readFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), 'utf8'));
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
parsed.exercises.forEach((ex, i) => {
  if (ex.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} diff ${ex.difficulty} != ${diffs[i]}`);
  if (ex.problemHtml.length < 900) throw new Error(`problemHtml<900 ${ex.title} (${ex.problemHtml.length})`);
  if (ex.solutionExplanationHtml.length < 500) throw new Error(`expl<500 ${ex.title}`);
  if (ex.hintsJson.length < 4) throw new Error(`<4 hints ${ex.title}`);
  if (ex.examplesJson.length < 2) throw new Error(`<2 examples ${ex.title}`);
  if (/^\s*[#/]/m.test(ex.solutionCodeJson.map((f) => f.code).join('\n'))) throw new Error(`comment line in solution ${ex.title}`);
  const solLen = ex.solutionCodeJson.map((f) => f.code).join('').length;
  if (solLen < 205) throw new Error(`solution<205 (seeder floor 200) ${ex.title} (${solLen})`);
});
console.log(`OK ${parsed.exercises.length} exercises -> ${trackSlug}__${moduleSlug}.json`);
