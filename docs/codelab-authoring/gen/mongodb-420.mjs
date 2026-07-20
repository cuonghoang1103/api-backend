// Generator for MongoDB module 420 (replica-sets-and-high-availability) — 10 exercises.
// Track language is "javascript"; solutions are mongosh commands (modern driver API).
// Verified against a REAL three-node replica set (mongo:7, rs0 = cl_rs1 priority 3,
// cl_rs2 priority 2, cl_rs3 priority 1). Every state name, error code and count below
// was produced by running the exact solution strings — including a real stepDown,
// a real election, and a real priority takeover.
import fs from 'node:fs';
import path from 'node:path';

const trackSlug = 'mongodb';
const moduleSlug = 'replica-sets-and-high-availability';
const L = 'javascript';

const SEED_DESC =
  'A three-member replica set named rs0: cl_rs1 (priority 3), cl_rs2 (priority 2) and cl_rs3 (priority 1), ' +
  'all data-bearing voting members, connected through the URI ' +
  'mongodb://cl_rs1:27017,cl_rs2:27017,cl_rs3:27017/shop?replicaSet=rs0. The shop.orders collection is ' +
  'reset at the start of each task; unless a task says otherwise it holds two documents, ' +
  '{ _id: 1, total: 10 } and { _id: 2, total: 20 }.';

const RESET = `db.orders.drop()
db.orders.insertMany([{ _id: 1, total: 10 }, { _id: 2, total: 20 }], { writeConcern: { w: "majority" } })`;

// For the tasks that read from a secondary, the seed is written with w:3 so
// EVERY member holds it. With w:"majority" only two of three are guaranteed,
// so a secondary read can legitimately return nothing — which is the hazard
// exercise 8 measures on purpose, and noise everywhere else.
const RESET_ALL = `db.orders.drop()
db.orders.insertMany([{ _id: 1, total: 10 }, { _id: 2, total: 20 }], { writeConcern: { w: 3 } })`;

// Waiting for a stable primary is the single most useful helper when a task
// causes an election; it appears in the tasks that trigger one.
const WAIT_PRIMARY = `function waitForPrimary(seconds) {
  for (let i = 0; i < seconds * 2; i++) {
    try {
      const s = rs.status()
      const p = s.members.find(m => m.stateStr === "PRIMARY")
      if (p) return p.name
    } catch (e) { /* during an election the node may refuse the command */ }
    sleep(500)
  }
  return null
}`;

const exercises = [
  {
    title: 'Read the Topology: Members, States, and Who Is Primary',
    difficulty: 'EASY', estimatedMinutes: 15, points: 10,
    concepts: ['rs.status', 'hello command', 'member states', 'voting members', 'election metadata'],
    prerequisites: ['mongosh basics', 'connecting to a cluster'],
    tags: ['replica-set', 'topology', 'mongodb', 'operations', 'hello'],
    problemHtml: `<p>A replica set is a group of <code>mongod</code> processes holding the same data, exactly one of which accepts writes. Everything else about high availability — failover, read scaling, durable writes — follows from that arrangement, so the first skill is reading the current arrangement rather than assuming it.</p>
<p>Two commands answer different questions. <code>rs.status()</code> is the operator's view: every member, its state, its last applied operation, its heartbeat. <code>db.hello()</code> is the <em>driver's</em> view: the seed list, which host is primary, and whether the node you are talking to accepts writes. Drivers call it constantly, which is how they discover a new primary without you restarting anything.</p>
<p>Against the <code>rs0</code> set:</p>
<ul>
<li>Run <code>rs.status()</code> and print <code>members N</code> — the number of members — then <code>states ...</code>, each member as <code>name=STATE</code> joined by <code>&nbsp;| </code>, in configured order.</li>
<li>Print <code>primaries N</code>, the number of members reporting <code>PRIMARY</code>. There is never more than one.</li>
<li>Run <code>db.hello()</code> and print <code>hosts N</code> and <code>writable ...</code> — the value of <code>isWritablePrimary</code> for the node the shell is connected to.</li>
<li>Print <code>setName ...</code> from the same response, the name a driver uses to verify it reached the right cluster.</li>
</ul>`,
    inputSpec: SEED_DESC,
    outputSpec:
      'members 3; states cl_rs1:27017=PRIMARY | cl_rs2:27017=SECONDARY | cl_rs3:27017=SECONDARY; primaries 1; ' +
      'hosts 3; writable true; setName rs0.',
    constraints: 'Read the topology from the commands — do not hard-code hostnames. Use rs.status() for member states and db.hello() for the driver view.',
    examplesJson: [
      { input: 'rs.status().members.map(m => m.name + "=" + m.stateStr).join(" | ")', output: 'cl_rs1:27017=PRIMARY | cl_rs2:27017=SECONDARY | cl_rs3:27017=SECONDARY', explanation: 'One member accepts writes; the other two replicate from it and stand ready to be elected.' },
      { input: 'db.hello().hosts.length', output: '3', explanation: 'The hosts array is the seed list a driver keeps refreshing so it can find the primary after a failover.' },
      { input: 'db.hello().isWritablePrimary', output: 'true', explanation: 'True only when the node answering is the current primary — the field a driver checks before sending a write.' },
    ],
    hintsJson: [
      'rs.status().members is an array with stateStr on each entry.',
      'Exactly one member may report PRIMARY — count them to prove it.',
      'db.hello() replaced the old isMaster command; the field is isWritablePrimary.',
      'setName is how a driver confirms it connected to the intended replica set.',
    ],
    solution: `const status = rs.status()
print("members " + status.members.length)
print("states " + status.members.map(m => m.name + "=" + m.stateStr).join(" | "))
print("primaries " + status.members.filter(m => m.stateStr === "PRIMARY").length)
const hello = db.hello()
print("hosts " + hello.hosts.length)
print("writable " + hello.isWritablePrimary)
print("setName " + hello.setName)`,
    solutionExplanationHtml: `<p>The two commands exist for two audiences. <code>rs.status()</code> is diagnostic and expensive-ish: it reports each member's state, the last operation it applied, when it was last heard from, and why the last election happened — the things an operator needs during an incident. <code>db.hello()</code> is the protocol-level handshake drivers run on every connection and then repeat on a timer, which is what makes failover transparent to application code: nobody reconfigures anything, the driver simply notices that <code>isWritablePrimary</code> moved to a different host.</p>
<p><code>PRIMARY</code> and <code>SECONDARY</code> are only two of the states worth recognising. <code>STARTUP2</code> means a member is performing its initial sync and is not yet usable. <code>RECOVERING</code> means it is alive but temporarily unable to serve reads. <code>ROLLBACK</code> means it is undoing writes that never reached the majority — the situation exercise 3's write concern exists to prevent. <code>(not reachable/healthy)</code> means the heartbeat is failing, which is what an operator sees when a node is genuinely down.</p>
<p>The invariant that at most one member is <code>PRIMARY</code> is enforced by the election protocol rather than by convention: a candidate needs votes from a strict majority, and a majority cannot be granted twice at the same time. That is also why an even number of voting members is a poor design — four members still need three votes, so it tolerates exactly one failure, the same as three, while costing more. When a third data-bearing copy is not wanted, the usual answer is an arbiter, a voting member that stores no data; it should be a last resort, because it can vote for a primary while contributing nothing to the majority that acknowledges writes.</p>
<p>Note finally that <code>isWritablePrimary</code> describes the node answering, not the cluster. Connect the shell to a secondary and it reports <code>false</code> while <code>primary</code> still names the real one — which is exactly the information a driver needs to route a write to the right place.</p>`,
    diagramMermaid: `flowchart TD
  A[client driver] -->|hello every few seconds| B[cl_rs1 PRIMARY]
  A --> C[cl_rs2 SECONDARY]
  A --> D[cl_rs3 SECONDARY]
  B -->|oplog replication| C
  B -->|oplog replication| D
  A -->|writes go only to the primary| B`,
    reset: RESET,
    expect: `members 3\nstates cl_rs1:27017=PRIMARY | cl_rs2:27017=SECONDARY | cl_rs3:27017=SECONDARY\nprimaries 1\nhosts 3\nwritable true\nsetName rs0`,
  },
  {
    title: 'Follow a Write Through the Oplog',
    difficulty: 'EASY', estimatedMinutes: 20, points: 10,
    concepts: ['oplog as a capped collection', 'idempotent operation entries', 'op codes i u d', 'namespace filtering', 'replication mechanism'],
    prerequisites: ['inserts and updates', 'querying a collection'],
    tags: ['oplog', 'replication', 'mongodb', 'internals', 'capped'],
    problemHtml: `<p>Replication is not magic and it is not a file copy: the primary records every change in a special capped collection, <code>local.oplog.rs</code>, and each secondary tails it and applies the entries in order. Everything else — failover safety, change streams, point-in-time restore — is built on that log, so reading it directly is the fastest way to understand what "replicated" actually means.</p>
<p>Against the reset <code>orders</code> collection:</p>
<ul>
<li>Insert <code>{ _id: 3, total: 30 }</code>, update document 1 with <code>$set: { total: 11 }</code>, and delete document 2.</li>
<li>Query <code>local.oplog.rs</code> for entries whose <code>ns</code> is <code>shop.orders</code>, sorted by natural order descending, limited to the three most recent. Print <code>ops ...</code> — their <code>op</code> codes oldest-first, joined by a comma.</li>
<li>Print <code>insertedDoc ...</code> — the <code>o</code> field of the insert entry rendered as <code>_id:total</code>.</li>
<li>Print <code>capped ...</code> and <code>sizeMB N</code> from <code>db.getSiblingDB("local").oplog.rs.stats()</code>, rounding the configured maximum size down to whole megabytes.</li>
<li>Print <code>idempotent ...</code> — whether the update entry stores the <em>resulting</em> value rather than the expression you wrote, by checking that its <code>o</code> mentions <code>total</code>.</li>
</ul>`,
    inputSpec: SEED_DESC,
    outputSpec:
      'ops i,u,d; insertedDoc 3:30; capped true; sizeMB is the configured oplog size in whole megabytes; idempotent true.',
    constraints: 'Read the oplog from the local database — never write to it. Filter by namespace so unrelated entries do not appear.',
    examplesJson: [
      { input: 'the three most recent shop.orders oplog entries after an insert, an update and a delete', output: 'ops i,u,d', explanation: 'One entry per change, in the order the primary applied them.' },
      { input: 'the o field of the insert entry', output: 'insertedDoc 3:30', explanation: 'An insert entry carries the whole document, which is what makes replaying it safe.' },
      { input: 'oplog.rs.stats().capped', output: 'capped true', explanation: 'The oplog is a fixed-size ring: old entries are overwritten, which is why a secondary offline for too long can never catch up.' },
    ],
    hintsJson: [
      'The oplog lives in the local database, which is never replicated itself.',
      'Sort by $natural descending to get the newest entries first, then reverse for chronological order.',
      'The op field is a single letter: i, u, d, n for a no-op, c for a command.',
      'stats() reports maxSize in bytes — divide by 1024 twice for megabytes.',
    ],
    solution: `db.orders.insertOne({ _id: 3, total: 30 })
db.orders.updateOne({ _id: 1 }, { $set: { total: 11 } })
db.orders.deleteOne({ _id: 2 })
const oplog = db.getSiblingDB("local").oplog.rs
const recent = oplog.find({ ns: "shop.orders" }).sort({ $natural: -1 }).limit(3).toArray().reverse()
print("ops " + recent.map(e => e.op).join(","))
const ins = recent.find(e => e.op === "i")
print("insertedDoc " + ins.o._id + ":" + ins.o.total)
const stats = oplog.stats()
print("capped " + stats.capped)
print("sizeMB " + Math.floor(stats.maxSize / 1024 / 1024))
const upd = recent.find(e => e.op === "u")
print("idempotent " + (JSON.stringify(upd.o).indexOf("total") !== -1))`,
    solutionExplanationHtml: `<p>The oplog is the replication protocol made visible. A secondary does not re-run your commands; it tails this collection and applies the entries, which is why the entries are written in a form that is safe to apply <strong>more than once</strong>. An insert entry carries the complete document. An update entry records the resulting field values, not the expression you typed — so <code>{ $inc: { total: 1 } }</code> is stored as a set of the new value, because replaying an increment twice would corrupt the data while replaying a set twice cannot.</p>
<p>Its capped nature is the operational fact that matters most. The oplog is a fixed-size ring buffer: when it fills, the oldest entries are overwritten regardless of whether every secondary has consumed them. A member that stays offline longer than the oplog window therefore falls off the end and cannot resume replication — it needs a full initial sync, which on a large data set means hours of copying. The window is a duration, not a size, and it shrinks exactly when you can least afford it: during a bulk import, write volume spikes and hours of headroom become minutes.</p>
<p>Two details are worth carrying away. The <code>local</code> database is not itself replicated, so each member has its own oplog and its own view of history — you cannot query one member's oplog from another. And the ordering key is a <code>ts</code> timestamp that also defines resumability: change streams, which module 726 covers, are a supported API over this same log, and the token they hand you is a position in it.</p>`,
    reset: RESET,
    expectPattern: `ops i,u,d\ninsertedDoc 3:30\ncapped true\nsizeMB \\d+\nidempotent true`,
  },
  {
    title: 'Choose a Write Concern and Watch One Fail',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['w:1 versus w:majority', 'durability guarantees', 'wtimeout', 'UnsatisfiableWriteConcern', 'rollback risk'],
    prerequisites: ['inserts', 'replica set topology'],
    tags: ['write-concern', 'durability', 'mongodb', 'replication', 'errors'],
    problemHtml: `<p>A write concern is the answer to "how many members must have this write before you tell me it succeeded". It is the single most consequential setting in a replica set, because it decides whether an acknowledged write can still disappear.</p>
<p>With <code>w: 1</code> the primary answers as soon as <em>it</em> has the write. If that primary crashes before any secondary has replicated it, the write is gone — and worse, when the old primary rejoins it must roll back operations the rest of the set never saw. With <code>w: "majority"</code> the acknowledgement waits until a majority holds the write, which is precisely the condition under which no future election can lose it.</p>
<p>Against the reset collection:</p>
<ul>
<li>Insert <code>{ _id: 10, total: 100 }</code> with <code>w: 1</code> and print <code>fast ...</code> — the <code>acknowledged</code> flag.</li>
<li>Insert <code>{ _id: 11, total: 110 }</code> with <code>w: "majority"</code> and <code>wtimeout: 5000</code>, and print <code>durable ...</code>.</li>
<li>Insert <code>{ _id: 12, total: 120 }</code> with <code>w: 3</code> — every member — and print <code>all ...</code>.</li>
<li>Attempt an insert of <code>{ _id: 13, total: 130 }</code> with <code>w: 4</code> and <code>wtimeout: 2000</code>, catch the failure, and print <code>tooMany ...</code> with the error's <code>codeName</code>. The set has three members, so this can never be satisfied.</li>
<li>Now check what that failure actually means: print <code>failedButStored N</code> — the count of document 13 — and <code>docs N</code>, the collection total. Read the numbers before assuming what they will be.</li>
</ul>`,
    inputSpec: SEED_DESC,
    outputSpec:
      'fast true; durable true; all true; tooMany UnsatisfiableWriteConcern; failedButStored 1; docs 6 — the rejected write concern did not prevent the document from being written.',
    constraints: 'Pass the write concern per operation. Do not change the replica set configuration to make w:4 satisfiable.',
    examplesJson: [
      { input: 'insertOne({ _id: 11, total: 110 }, { writeConcern: { w: "majority", wtimeout: 5000 } })', output: 'durable true', explanation: 'The acknowledgement waits until two of the three members hold the write — the condition that makes it survive any election.' },
      { input: 'insertOne(doc, { writeConcern: { w: 4, wtimeout: 2000 } })', output: 'tooMany UnsatisfiableWriteConcern', explanation: 'Requesting more members than exist fails immediately with code 100 rather than waiting for the timeout.' },
      { input: 'counting document 13 after that error', output: 'failedButStored 1 and docs 6', explanation: 'A write concern error reports that the durability guarantee was not met — it does not undo the write, which is already in the collection.' },
    ],
    hintsJson: [
      'The writeConcern option goes in the second argument of the write method.',
      'w:"majority" is a rule, not a number — it keeps working when you add or remove members.',
      'wtimeout bounds the wait; without it a write can block indefinitely when members are down.',
      'Catch the error and read codeName rather than matching on the message text.',
    ],
    solution: `const fast = db.orders.insertOne({ _id: 10, total: 100 }, { writeConcern: { w: 1 } })
print("fast " + fast.acknowledged)
const durable = db.orders.insertOne({ _id: 11, total: 110 }, { writeConcern: { w: "majority", wtimeout: 5000 } })
print("durable " + durable.acknowledged)
const all = db.orders.insertOne({ _id: 12, total: 120 }, { writeConcern: { w: 3 } })
print("all " + all.acknowledged)
try {
  db.orders.insertOne({ _id: 13, total: 130 }, { writeConcern: { w: 4, wtimeout: 2000 } })
  print("tooMany none")
} catch (e) {
  print("tooMany " + e.codeName)
}
print("failedButStored " + db.orders.countDocuments({ _id: 13 }))
print("docs " + db.orders.countDocuments())`,
    solutionExplanationHtml: `<p>The choice is a trade between latency and durability, and the honest way to frame it is by what you are willing to lose. <code>w: 1</code> costs one network hop and risks exactly one failure mode: the primary dies between acknowledging and replicating, and the write vanishes. That is rare, and on a high-volume metrics collection it may be an acceptable price. On an order or a payment it is not, because the customer has already been told it worked.</p>
<p><code>w: "majority"</code> is the setting that makes an acknowledgement meaningful. A write held by a majority is guaranteed to be present on at least one member of any future majority, and since an election requires a majority of votes, every possible new primary already has it. That is the whole argument, and it explains why <code>majority</code> rather than a specific number is the right expression: add a fourth and fifth member and the rule still means "enough to survive an election", while <code>w: 3</code> silently becomes weaker than intended.</p>
<p><code>w: 3</code> — every member — is stronger still and usually a mistake, because it turns any single node's slowness into a stall for every write. Prefer <code>majority</code> and let a lagging member lag. And note <code>wtimeout</code>: without it a write concern that cannot currently be satisfied waits indefinitely, so a routine maintenance window on one node becomes an application outage. With it, you get an error you can handle.</p>
<p>The last two lines are the point of the exercise, and they surprise almost everyone: <strong>document 13 is in the collection.</strong> A write concern error is not a rejection of the write — the primary applied it and then reported that the requested durability guarantee could not be met. The same is true of a <code>wtimeout</code>: the write may well replicate a moment after the error is returned. So a write concern failure means "I cannot promise this survived", never "this did not happen", and code that retries such a write must be idempotent or it will duplicate data. This is exactly why a deterministic <code>_id</code> matters in the retry loop of exercise 10.</p>
<p>The impossible concern also fails differently and usefully: <code>UnsatisfiableWriteConcern</code> (code 100) is returned immediately rather than after the timeout, because the server can tell from the configuration that no amount of waiting will help. Seeing that error in production almost always means a member was removed and a hard-coded numeric <code>w</code> was left behind.</p>`,
    diagramMermaid: `sequenceDiagram
  participant App
  participant P as Primary
  participant S1 as Secondary 1
  participant S2 as Secondary 2
  App->>P: insert with w majority
  P->>S1: replicate via oplog
  P->>S2: replicate via oplog
  S1-->>P: applied
  P-->>App: acknowledged once a majority holds it
  Note over App,S2: with w 1 the reply comes before replication and an election can lose the write`,
    reset: RESET,
    expect: `fast true\ndurable true\nall true\ntooMany UnsatisfiableWriteConcern\nfailedButStored 1\ndocs 6`,
  },
  {
    title: 'Route Reads with a Read Preference — and Fail to Write to a Secondary',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['read preference modes', 'secondary reads', 'stale reads', 'NotWritablePrimary', 'scaling reads is not free'],
    prerequisites: ['replica set topology', 'find queries'],
    tags: ['read-preference', 'scaling', 'mongodb', 'replication', 'errors'],
    problemHtml: `<p>By default every read goes to the primary, which is the only member guaranteed to hold the newest data. A <strong>read preference</strong> lets you send reads elsewhere: <code>secondary</code> forces them onto replicas, <code>secondaryPreferred</code> uses replicas when available and falls back to the primary, <code>nearest</code> picks by network latency, and <code>primaryPreferred</code> is the reverse fallback.</p>
<p>The catch is that a secondary is always <em>some</em> distance behind. Reading from one trades consistency for capacity, and the trade is only safe when the caller can tolerate data that is a moment old.</p>
<p>Against the reset collection:</p>
<ul>
<li>Read with the default preference and print <code>primaryRead N</code>, the document count.</li>
<li>Read the same collection with <code>readPref("secondary")</code> and print <code>secondaryRead N</code>.</li>
<li>Read with <code>readPref("secondaryPreferred")</code> and print <code>preferred N</code>.</li>
<li>Print <code>servedBy ...</code> — whether the node that answered the secondary read reports <code>isWritablePrimary</code> as false — by checking <code>db.hello()</code> on a connection pinned to a secondary.</li>
<li>Attempt an insert on a connection pinned directly to a secondary, catch the failure, and print <code>writeToSecondary ...</code> with the error's <code>codeName</code>.</li>
</ul>`,
    inputSpec: SEED_DESC,
    outputSpec:
      'All three reads return 2 documents; the secondary that served the read reports isWritablePrimary false; and the write attempt against a secondary fails with NotWritablePrimary.',
    constraints: 'Do not change the replica set configuration. The failing write must be attempted against a secondary, not merely predicted.',
    examplesJson: [
      { input: 'db.orders.find().readPref("secondary").itcount()', output: 'secondaryRead 2', explanation: 'The read is routed to a replica, which holds the same two documents once replication has caught up.' },
      { input: 'db.hello().isWritablePrimary on a secondary connection', output: 'servedBy false', explanation: 'The node answering is not the primary — which is exactly why the read was allowed and a write will not be.' },
      { input: 'inserting through a connection pinned to a secondary', output: 'writeToSecondary NotWritablePrimary', explanation: 'Writes are refused by any member that is not currently primary; the driver normally reroutes them for you.' },
    ],
    hintsJson: [
      'readPref applies per query; the default is primary.',
      'secondaryPreferred is the safe choice for reporting: it uses replicas but does not fail when none are available.',
      'Connect with directConnection=true to pin the shell to one specific node.',
      'A secondary refuses writes with NotWritablePrimary — code 10107.',
    ],
    solution: `print("primaryRead " + db.orders.find().itcount())
print("secondaryRead " + db.orders.find().readPref("secondary").itcount())
print("preferred " + db.orders.find().readPref("secondaryPreferred").itcount())

const status = rs.status()
const secondaryName = status.members.filter(m => m.stateStr === "SECONDARY")[0].name
const direct = new Mongo("mongodb://" + secondaryName + "/?directConnection=true")
const directDb = direct.getDB("shop")
print("servedBy " + directDb.hello().isWritablePrimary)
try {
  directDb.orders.insertOne({ _id: 99, total: 990 })
  print("writeToSecondary none")
} catch (e) {
  print("writeToSecondary " + e.codeName)
}`,
    solutionExplanationHtml: `<p>Read preference is a routing instruction the driver evaluates against the topology it discovered with <code>hello</code>. Nothing on the server changes; the driver simply picks a different member. That is why the setting is per query — an analytics aggregation can read from a secondary while the checkout path on the same connection pool keeps reading from the primary.</p>
<p>The reason "just read from secondaries to scale" is bad advice is that replication is asynchronous. A secondary applies the oplog a little behind, so a read there can miss a write that already returned successfully — the read-your-own-writes problem, which shows up as a user saving a form and immediately seeing the old value. Worse, the lag is not constant: it grows precisely under the load that made you want to scale reads in the first place. Use secondary reads for work that is naturally tolerant — reporting, exports, search indexing — and keep anything a user just wrote on the primary, or use the causal-consistency session of exercise 8, which gets read-your-writes from a secondary explicitly.</p>
<p><code>secondaryPreferred</code> is usually the right mode when you do choose replicas, because plain <code>secondary</code> fails outright when no secondary is available — turning a degraded set into an outage for those reads. And the refused write is the mirror image of the same rule: a member that is not primary rejects writes with <code>NotWritablePrimary</code>. You rarely see that error in application code, because the driver routes writes to whichever node currently reports <code>isWritablePrimary</code>; it appears when something pins a connection to one host, exactly as <code>directConnection=true</code> does here.</p>`,
    reset: RESET_ALL,
    expect: `primaryRead 2\nsecondaryRead 2\npreferred 2\nservedBy false\nwriteToSecondary NotWritablePrimary`,
  },
  {
    title: 'Ask for Committed Data with a Read Concern',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['read concern local', 'read concern majority', 'majority-committed snapshot', 'rollback window', 'pairing read and write concern'],
    prerequisites: ['write concern', 'read preference'],
    tags: ['read-concern', 'consistency', 'mongodb', 'durability', 'replication'],
    problemHtml: `<p>Write concern decides when a write is acknowledged; <strong>read concern</strong> decides which writes a read is allowed to see. They are independent, and the interesting case is the gap between them: with <code>readConcern: "local"</code> — the default — a read on the primary can return a write that has not yet reached any secondary, and therefore a write that could still be rolled back if that primary fails right now.</p>
<p><code>readConcern: "majority"</code> returns only data that a majority of members already holds. Such data cannot be rolled back, so what you read is what the cluster will still agree on afterwards.</p>
<p>Against the reset collection:</p>
<ul>
<li>Insert <code>{ _id: 20, total: 200 }</code> with <code>w: "majority"</code>.</li>
<li>Read the collection with <code>readConcern("local")</code> and print <code>local N</code>.</li>
<li>Read it with <code>readConcern("majority")</code> and print <code>majority N</code>. Both see the write, because it was acknowledged by a majority before either read ran.</li>
<li>Insert <code>{ _id: 21, total: 210 }</code> with <code>w: 1</code>, then print <code>localAfterFast N</code> and <code>majorityAfterFast N</code>. Explain to yourself why they may or may not differ on a healthy set.</li>
<li>Print <code>snapshotOk ...</code> by running a <code>find</code> with <code>readConcern("majority")</code> against a secondary and reporting whether it returned without error.</li>
</ul>`,
    inputSpec: SEED_DESC,
    outputSpec:
      'local 3 and majority 3 after the majority write; localAfterFast 4 and majorityAfterFast 4 once replication has caught up on a healthy set; snapshotOk true.',
    constraints: 'Do not add sleeps to force the counts to agree beyond what the exercise states. Read concern is per query, like read preference.',
    examplesJson: [
      { input: 'find().readConcern("majority").itcount() after a w:"majority" insert', output: 'majority 3', explanation: 'The write is already majority-committed, so the strictest read concern sees it.' },
      { input: 'find().readConcern("local") on the primary', output: 'local 3', explanation: 'The default sees everything the primary has applied, committed or not.' },
      { input: 'a majority read routed to a secondary', output: 'snapshotOk true', explanation: 'Secondaries maintain a majority-committed snapshot, so the stronger read concern works there too.' },
    ],
    hintsJson: [
      'readConcern is a cursor option, exactly like readPref.',
      'On a healthy set replication takes milliseconds, so the two counts usually agree — the difference appears under lag or failure.',
      'Majority-committed data is by definition not rollback-able.',
      'Pair w:"majority" with readConcern:"majority" when correctness matters more than latency.',
    ],
    solution: `db.orders.insertOne({ _id: 20, total: 200 }, { writeConcern: { w: "majority" } })
print("local " + db.orders.find().readConcern("local").itcount())
print("majority " + db.orders.find().readConcern("majority").itcount())

db.orders.insertOne({ _id: 21, total: 210 }, { writeConcern: { w: 1 } })
print("localAfterFast " + db.orders.find().readConcern("local").itcount())
sleep(500)
print("majorityAfterFast " + db.orders.find().readConcern("majority").itcount())

let ok = true
try {
  db.orders.find().readPref("secondary").readConcern("majority").itcount()
} catch (e) {
  ok = false
}
print("snapshotOk " + ok)`,
    solutionExplanationHtml: `<p>The two concerns bound different ends of the same risk. Write concern answers "when may I tell the user it worked"; read concern answers "what am I allowed to see". <code>local</code>, the default, shows everything the node has applied — on the primary that includes writes not yet replicated, which is fast and occasionally wrong, because those writes are exactly the ones a failover can roll back.</p>
<p><code>majority</code> restricts the read to data a majority already holds. The guarantee is symmetric with the write side: majority-held data survives any election, so a majority read cannot show you something that later disappears. Each member maintains a majority-committed snapshot for this purpose, which is why the stronger read concern also works against a secondary — that is what makes "consistent reporting from a replica" possible at all.</p>
<p>On a healthy set the numbers agree, because replication takes milliseconds; the difference is not visible in a demo, it is visible in an incident. When a secondary is down or badly lagged, the majority-committed point stops advancing, and a <code>majority</code> read starts returning data that is deliberately slightly behind while a <code>local</code> read races ahead into territory that may be rolled back. Seeing the two diverge is a strong signal about replication health.</p>
<p>The practical rule is to pair them. Money movement and anything a user is told is final: <code>w: "majority"</code> plus <code>readConcern: "majority"</code>. Feeds, counters and logs: the defaults, which are faster and lose little. And a third level exists for the case where even that is not enough — <code>linearizable</code>, which additionally confirms the node is still primary before answering, at the cost of a round trip and only for single-document reads on the primary.</p>`,
    reset: RESET,
    expect: `local 3\nmajority 3\nlocalAfterFast 4\nmajorityAfterFast 4\nsnapshotOk true`,
  },
  {
    title: 'Trigger an Election and Watch the Set Heal Itself',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['stepDown', 'elections and majority votes', 'priority and takeover', 'driver reconnection', 'measuring failover time'],
    prerequisites: ['topology', 'write concern'],
    tags: ['failover', 'election', 'mongodb', 'high-availability', 'operations'],
    problemHtml: `<p>High availability is a claim until you test it. <code>replSetStepDown</code> asks the current primary to become a secondary and refuse to seek re-election for a given number of seconds, which is exactly what a rolling restart does — and what a crash does, minus the courtesy.</p>
<p>The remaining members hold an election. A candidate needs votes from a strict majority, so a three-member set survives losing one; the survivors compare how much of the oplog each has applied and prefer the most up-to-date, with <code>priority</code> breaking ties in favour of a preferred host.</p>
<p>Against the <code>rs0</code> set:</p>
<ul>
<li>Print <code>before ...</code> — the current primary's name.</li>
<li>Step the primary down for 20 seconds with <code>db.adminCommand({ replSetStepDown: 20, secondaryCatchUpPeriodSecs: 5 })</code>. The command closes the connection, so wrap it in a <code>try</code>.</li>
<li>Wait for a new primary with a helper that polls <code>rs.status()</code> — a real driver does the equivalent internally — and print <code>after ...</code>.</li>
<li>Print <code>changed ...</code>, whether the two names differ, and <code>writable ...</code> after inserting <code>{ _id: 30, total: 300 }</code> with <code>w: "majority"</code> against the new primary.</li>
<li>Print <code>restored ...</code> — the primary's name once <strong>priority takeover</strong> has returned leadership to the original member. Poll for that specific member rather than sleeping a fixed time and reading whoever leads: takeover timing varies, and a fixed sleep makes the check pass or fail by luck.</li>
</ul>`,
    inputSpec: SEED_DESC + ' cl_rs1 holds priority 3, cl_rs2 priority 2 and cl_rs3 priority 1, so leadership is preferred in that order.',
    outputSpec:
      'before cl_rs1:27017; after cl_rs2:27017; changed true; writable true; restored cl_rs1:27017 once the step-down window expires and the highest-priority member takes over again.',
    constraints: 'Do not reconfigure the set or restart any node. Recover by waiting and polling, exactly as a driver does.',
    examplesJson: [
      { input: 'db.adminCommand({ replSetStepDown: 20, secondaryCatchUpPeriodSecs: 5 })', output: 'after cl_rs2:27017', explanation: 'The next-highest-priority member wins the election while the former primary is frozen.' },
      { input: 'inserting with w:"majority" against the new primary', output: 'writable true', explanation: 'The set is fully writable again within seconds — no human intervention and no configuration change.' },
      { input: 'waiting past the step-down window', output: 'restored cl_rs1:27017', explanation: 'Priority takeover returns leadership to the preferred host once it is eligible again.' },
    ],
    hintsJson: [
      'stepDown closes your connection on purpose — catch the error and reconnect.',
      'Poll rs.status() until a member reports PRIMARY rather than sleeping a fixed amount.',
      'secondaryCatchUpPeriodSecs lets a secondary finish replicating before it takes over, avoiding a rollback.',
      'Priority takeover happens on its own once the frozen member is eligible again — poll for it rather than sleeping a fixed amount.',
    ],
    solution: `${WAIT_PRIMARY}

const before = waitForPrimary(30)
print("before " + before)

try {
  db.getSiblingDB("admin").runCommand({ replSetStepDown: 20, secondaryCatchUpPeriodSecs: 5 })
} catch (e) {
  // Expected: stepping down closes every connection to that node.
}

const after = waitForPrimary(30)
print("after " + after)
print("changed " + (before !== after))

const write = db.orders.insertOne({ _id: 30, total: 300 }, { writeConcern: { w: "majority", wtimeout: 10000 } })
print("writable " + write.acknowledged)

// Poll for the SPECIFIC member to lead again. A fixed sleep followed by
// "whoever is primary now" passes or fails depending on timing.
function waitForNamedPrimary(name, seconds) {
  for (let i = 0; i < seconds * 2; i++) {
    try {
      const p = rs.status().members.find(m => m.stateStr === "PRIMARY")
      if (p && p.name === name) return p.name
    } catch (e) { /* an election may briefly refuse the command */ }
    sleep(500)
  }
  return "not-restored"
}
print("restored " + waitForNamedPrimary(before, 90))`,
    solutionExplanationHtml: `<p>Failover is an election, and an election needs a strict majority of votes. That single rule explains most replica set design advice: three members tolerate one failure, five tolerate two, and an even number buys nothing — four members still need three votes. It also explains the failure mode people fear most and rarely see: if a network partition leaves no side with a majority, <em>no</em> primary is elected and the whole set becomes read-only, which is deliberate. Refusing to elect two primaries is what prevents a split brain and the divergent histories that follow.</p>
<p><code>secondaryCatchUpPeriodSecs</code> is the humane part of a planned step-down: the primary waits up to that long for a secondary to catch up before yielding, so the new primary starts from the same point in the oplog and nothing has to be rolled back. A crash offers no such courtesy, which is why <code>w: "majority"</code> matters — it guarantees the write is already on a member that can win the election.</p>
<p><code>priority</code> expresses a preference, not a guarantee: after the frozen window expires, the highest-priority eligible member calls an election and takes over, which is what returns leadership to <code>cl_rs1</code> here. That behaviour is useful for keeping the primary in a chosen data centre, but it also means a flapping high-priority node can cause repeated elections — each one a brief write outage. When a member should never lead, <code>priority: 0</code> says so explicitly.</p>
<p>The most important thing this exercise demonstrates is what the application had to do: nothing. The driver discovers the new primary through its own <code>hello</code> polling and routes the next write there, and retryable writes — enabled by default in modern drivers — resend a write that was in flight when the connection dropped. The polling helper here is a hand-rolled version of that discovery loop, which is worth writing once precisely so you never write it again.</p>`,
    diagramMermaid: `sequenceDiagram
  participant App
  participant P1 as cl_rs1 priority 3
  participant P2 as cl_rs2 priority 2
  participant P3 as cl_rs3 priority 1
  App->>P1: writes
  P1->>P1: stepDown for 20 seconds
  P2->>P3: request votes
  P3-->>P2: vote granted majority reached
  App->>P2: writes resume after the driver rediscovers the primary
  P1->>P1: window expires and priority takeover begins
  P1-->>App: primary again`,
    reset: RESET,
    expect: `before cl_rs1:27017\nafter cl_rs2:27017\nchanged true\nwritable true\nrestored cl_rs1:27017`,
  },
  {
    title: 'Measure Replication Lag Before It Becomes an Incident',
    difficulty: 'MEDIUM', estimatedMinutes: 30, points: 15,
    concepts: ['optimeDate per member', 'lag as a time difference', 'heartbeat freshness', 'why lag matters for reads', 'alerting thresholds'],
    prerequisites: ['topology', 'oplog'],
    tags: ['monitoring', 'replication-lag', 'mongodb', 'operations', 'observability'],
    problemHtml: `<p>Replication lag is how far behind a secondary is, expressed in time: the difference between the primary's last applied operation and the secondary's. It is the number that decides whether secondary reads are safe, whether <code>w: "majority"</code> will be slow, and how much data a crash could lose. Lag is normal and small; lag that <em>grows</em> is an incident forming.</p>
<p>Against the <code>rs0</code> set:</p>
<ul>
<li>Take <code>rs.status()</code> and identify the primary's <code>optimeDate</code>.</li>
<li>For each secondary, compute lag in seconds as the primary's <code>optimeDate</code> minus the secondary's. Print <code>lags ...</code> — each member as <code>name=Ns</code>, joined by <code>&nbsp;| </code>.</li>
<li>Print <code>maxLag N</code>, the largest of them, and <code>healthy ...</code> — whether every secondary is within a 10-second threshold.</li>
<li>Print <code>heartbeats ...</code> — whether every member was heard from within the last 30 seconds, using <code>lastHeartbeatRecv</code> where present.</li>
<li>Write 500 documents with <code>w: 1</code>, re-measure, and print <code>afterWrites ...</code> — whether the set is still within the threshold.</li>
</ul>
<p>Report lag from the members' own reported times rather than by writing a marker document and polling for it.</p>`,
    inputSpec: SEED_DESC,
    outputSpec:
      'Two per-member lag figures, a maximum within the threshold, healthy true, heartbeats true, and afterWrites true — a healthy set on a local network stays within a second even under a burst of writes.',
    constraints: 'Derive lag from optimeDate in rs.status(). Do not shell out to an external monitoring tool, and do not use a fixed sleep as the measurement.',
    examplesJson: [
      { input: 'primary optimeDate minus secondary optimeDate', output: 'lags cl_rs2:27017=0s | cl_rs3:27017=0s', explanation: 'On a healthy local set replication is effectively instantaneous, so the difference rounds to zero seconds.' },
      { input: 'the largest of those values against a 10-second threshold', output: 'maxLag 0 and healthy true', explanation: 'A threshold turns a raw number into an alertable condition.' },
      { input: 'the same measurement after inserting 500 documents', output: 'afterWrites true', explanation: 'Bursts of writes are exactly when lag grows, which is why the measurement is repeated under load.' },
    ],
    hintsJson: [
      'rs.status().members carries optimeDate on every entry.',
      'Subtracting two Date objects gives milliseconds — divide by 1000 for seconds.',
      'lastHeartbeatRecv is absent for the member you are connected to, so guard before reading it.',
      'Alert on lag that is growing over time, not on a single sample.',
    ],
    solution: `function lagReport() {
  const status = rs.status()
  const primary = status.members.find(m => m.stateStr === "PRIMARY")
  const secondaries = status.members.filter(m => m.stateStr === "SECONDARY")
  return secondaries.map(m => ({
    name: m.name,
    lag: Math.round((primary.optimeDate - m.optimeDate) / 1000),
  }))
}

const report = lagReport()
print("lags " + report.map(r => r.name + "=" + r.lag + "s").join(" | "))
const maxLag = Math.max.apply(null, report.map(r => r.lag))
print("maxLag " + maxLag)
print("healthy " + (maxLag <= 10))

const now = new Date()
const stale = rs.status().members.filter(m => m.lastHeartbeatRecv && (now - m.lastHeartbeatRecv) / 1000 > 30)
print("heartbeats " + (stale.length === 0))

const bulk = []
for (let i = 0; i < 500; i++) bulk.push({ _id: 1000 + i, total: i })
db.orders.insertMany(bulk, { writeConcern: { w: 1 } })
sleep(1000)
const after = lagReport()
print("afterWrites " + (Math.max.apply(null, after.map(r => r.lag)) <= 10))`,
    solutionExplanationHtml: `<p>Lag is measured in time rather than in operations because time is what the consequences are expressed in: how stale a secondary read may be, how long <code>w: "majority"</code> will block, and how much work is at risk if the primary dies. Each member reports the timestamp of the last operation it applied, so the difference against the primary is the lag — no marker documents or polling required.</p>
<p>What matters operationally is the trend, not the sample. A steady second of lag on a busy set is unremarkable; a figure climbing minute over minute means the secondary is applying slower than the primary is producing, and the endpoint of that curve is the oplog window running out and the member needing a full resync. Common causes are worth memorising: a secondary on slower disks or a smaller instance, an index build, a long-running query holding resources, a saturated network link, or the primary simply out-writing the replica's capacity.</p>
<p>The measurement has two subtleties. First, on a completely idle set the numbers can look strange, because a secondary with nothing to apply keeps reporting an older optime — which is why sets emit periodic no-op entries and why a lag alert should require sustained writes to be meaningful. Second, <code>lastHeartbeatRecv</code> is absent for the member you are connected to, so reading it unguarded throws on exactly one entry of the array; treating heartbeat freshness as a separate signal from lag is deliberate, because a member that is merely unreachable reports no lag at all.</p>
<p>Tie the number to the decision it informs. If reports read from secondaries, the lag threshold <em>is</em> the staleness contract you are offering their users. If <code>w: "majority"</code> latency matters, lag on the second-fastest member is what sets it. And the burst measurement here is the honest test, because lag is never a problem when the system is idle.</p>`,
    reset: RESET,
    expectPattern: `lags \\S+=\\d+s \\| \\S+=\\d+s\nmaxLag \\d+\nhealthy true\nheartbeats true\nafterWrites true`,
  },
  {
    title: 'Make Two Collections Agree with a Multi-Document Transaction',
    difficulty: 'MEDIUM', estimatedMinutes: 40, points: 20,
    concepts: ['sessions', 'startTransaction and commit', 'abort rolls everything back', 'isolation from outside readers', 'transactions require a replica set'],
    prerequisites: ['write concern', 'read concern'],
    tags: ['transactions', 'acid', 'mongodb', 'sessions', 'consistency'],
    problemHtml: `<p>A single document update is atomic in MongoDB on its own. Two updates that must both happen — moving stock as an order is placed, debiting one balance to credit another — are not, and that is what multi-document transactions are for. They exist <strong>only</strong> on a replica set or a sharded cluster, because the guarantee is built on the same majority machinery as write concern.</p>
<p>A transaction runs inside a <em>session</em>: start it, do the work through that session's database handles, then commit or abort. Until commit, no reader outside the session sees any of it.</p>
<p>Against the reset collection plus an <code>inventory</code> collection:</p>
<ul>
<li>Seed <code>inventory</code> with <code>{ _id: "sku1", qty: 5 }</code>.</li>
<li>Open a session, start a transaction with <code>readConcern: "snapshot"</code> and <code>writeConcern: { w: "majority" }</code>, insert <code>{ _id: 40, total: 400, sku: "sku1" }</code> into <code>orders</code> and decrement <code>inventory.sku1</code> by one.</li>
<li><strong>Before</strong> committing, read both collections from outside the session and print <code>hiddenOrder N</code> and <code>hiddenQty N</code> — the outside world must still see the old state.</li>
<li>Commit, then print <code>committedOrder N</code> and <code>committedQty N</code>.</li>
<li>Start a second transaction that inserts order 41 and decrements the stock again, then <strong>abort</strong> it, and print <code>abortedOrder N</code> and <code>abortedQty N</code> — both changes must be gone.</li>
</ul>`,
    inputSpec: SEED_DESC + ' An inventory collection is created with a single document { _id: "sku1", qty: 5 }.',
    outputSpec:
      'Outside the uncommitted transaction the order is invisible and the quantity is still 5; after committing the order exists and the quantity is 4; after the aborted transaction the order count is unchanged and the quantity is still 4.',
    constraints: 'All transactional work must go through the session’s database handles. Do not simulate the rollback by writing compensating updates.',
    examplesJson: [
      { input: 'reading orders from outside an uncommitted transaction', output: 'hiddenOrder 0', explanation: 'Uncommitted writes are invisible to everyone but the session that made them.' },
      { input: 'after commitTransaction()', output: 'committedOrder 1 and committedQty 4', explanation: 'Both changes become visible together — that atomicity is the entire point.' },
      { input: 'after abortTransaction()', output: 'abortedOrder 0 and abortedQty 4', explanation: 'The aborted insert and the aborted decrement both vanish; no compensating write is needed.' },
    ],
    hintsJson: [
      'db.getMongo().startSession() returns the session; use session.getDatabase("shop") for the transactional handles.',
      'A read through the normal db handle is outside the transaction — that is how you prove isolation.',
      'snapshot read concern gives the transaction a consistent view of the data as of its start.',
      'Always end a transaction: commit or abort, and abort in the catch branch.',
    ],
    solution: `db.inventory.drop()
db.inventory.insertOne({ _id: "sku1", qty: 5 }, { writeConcern: { w: "majority" } })

const session = db.getMongo().startSession()
const sdb = session.getDatabase("shop")

session.startTransaction({ readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } })
sdb.orders.insertOne({ _id: 40, total: 400, sku: "sku1" })
sdb.inventory.updateOne({ _id: "sku1" }, { $inc: { qty: -1 } })

print("hiddenOrder " + db.orders.countDocuments({ _id: 40 }))
print("hiddenQty " + db.inventory.findOne({ _id: "sku1" }).qty)

session.commitTransaction()
print("committedOrder " + db.orders.countDocuments({ _id: 40 }))
print("committedQty " + db.inventory.findOne({ _id: "sku1" }).qty)

session.startTransaction({ readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } })
sdb.orders.insertOne({ _id: 41, total: 410, sku: "sku1" })
sdb.inventory.updateOne({ _id: "sku1" }, { $inc: { qty: -1 } })
session.abortTransaction()

print("abortedOrder " + db.orders.countDocuments({ _id: 41 }))
print("abortedQty " + db.inventory.findOne({ _id: "sku1" }).qty)
session.endSession()`,
    solutionExplanationHtml: `<p>The session is the unit that carries the transaction, which is why the work must go through <code>session.getDatabase(...)</code>. A write issued through the ordinary <code>db</code> handle inside the same block is <em>not</em> part of the transaction: it commits immediately and survives an abort. That mistake is silent — the code looks transactional and behaves atomically in testing, then leaves half-applied state the first time something fails.</p>
<p>Isolation is demonstrated by the reads before the commit. Outside the session the order does not exist and the quantity is untouched, because uncommitted writes live in the session's own view; at commit they become visible together. The <code>snapshot</code> read concern gives the transaction a consistent picture of the data as of its start, so a concurrent change elsewhere cannot make its two reads disagree.</p>
<p>Transactions require a replica set for a structural reason rather than an arbitrary one: the commit protocol is built on the same majority machinery as write concern, so a standalone <code>mongod</code> has nothing to build it on. That is also why a <code>w: "majority"</code> write concern on the commit is the meaningful choice — it is the commit, not the individual writes, that must be durable.</p>
<p>The real caution is that transactions in MongoDB are more expensive than in a relational database and are meant to be the exception. They hold resources, they have a default 60-second limit, and under contention they fail with a <code>TransientTransactionError</code> that the application is expected to retry — which is what the driver helper <code>withTransaction</code> does for you, and why it is preferred over hand-rolled commit and abort. Before reaching for one, check whether the schema can make the operation single-document: embedding the data that must change together is the idiomatic answer, and it is both faster and simpler than a transaction.</p>`,
    diagramMermaid: `sequenceDiagram
  participant S as Session transaction
  participant O as Outside reader
  participant DB as Replica set
  S->>DB: insert order and decrement stock
  O->>DB: read orders and inventory
  DB-->>O: old state only uncommitted work is invisible
  S->>DB: commitTransaction
  O->>DB: read again
  DB-->>O: both changes visible together`,
    reset: RESET,
    expect: `hiddenOrder 0\nhiddenQty 5\ncommittedOrder 1\ncommittedQty 4\nabortedOrder 0\nabortedQty 4`,
  },
  {
    title: 'Read Your Own Writes From a Secondary with a Causal Session',
    difficulty: 'HARD', estimatedMinutes: 45, points: 25,
    concepts: ['causal consistency', 'session cluster time', 'afterClusterTime', 'read-your-writes across members', 'monotonic reads'],
    prerequisites: ['read preference', 'read concern', 'sessions'],
    tags: ['causal-consistency', 'sessions', 'mongodb', 'replication', 'consistency'],
    problemHtml: `<p>Secondary reads scale, and they break the assumption every user interface makes: that data you just saved is data you can immediately see. A causally consistent <strong>session</strong> fixes exactly that, without giving up secondary reads. The session remembers the cluster time of your last write, and any subsequent read in the session waits until the member it is talking to has applied at least that far.</p>
<p>Against the reset collection:</p>
<ul>
<li>Measure the hazard rather than asserting it. Without a session, loop twenty times: write a document with <code>w: 1</code> and immediately read it back from a secondary, counting how often it is <strong>not there yet</strong>. Print <code>naiveMisses N</code>.</li>
<li>Repeat the identical loop inside a session opened with <code>{ causalConsistency: true }</code>, writing and reading through that session's handles with <code>readPref("secondary")</code>. Print <code>causalMisses N</code> — this one is guaranteed to be zero, not merely usually zero.</li>
<li>Print <code>hasClusterTime ...</code> — whether the session exposes an <code>operationTime</code> after the write, the token that makes the guarantee work.</li>
<li>Do one more causal write and read and print <code>monotonic 2</code>, showing reads never go backwards within the session.</li>
<li>Print <code>total N</code> — the collection count from the primary — as the ground truth.</li>
</ul>`,
    inputSpec: SEED_DESC,
    outputSpec:
      'The naive read usually finds the document on a healthy local set; the causal read is guaranteed to find it; the session exposes an operation time; the monotonic read finds both causal documents; and the primary holds five documents in total: the two seeded plus the three written here.',
    constraints: 'The causal read must go through the same session as the write and must target a secondary. Do not add sleeps to make the naive case pass.',
    examplesJson: [
      { input: 'twenty w:1 writes each followed immediately by a secondary read', output: 'naiveMisses 11', explanation: 'Eleven of twenty reads did not see the write that had just been acknowledged — on an idle local set, with no load and no network latency at all.' },
      { input: 'the same twenty inside a causallyConsistent session', output: 'causalMisses 0', explanation: 'Each read carries afterClusterTime, so the secondary waits until it has applied the write before answering. Zero is guaranteed rather than lucky.' },
      { input: 'session.getOperationTime() after the write', output: 'hasClusterTime true', explanation: 'That timestamp is the causal token the session attaches to every subsequent read.' },
    ],
    hintsJson: [
      'startSession({ causalConsistency: true }) then use session.getDatabase(...) for everything in the chain.',
      'The guarantee is per session — a read on a different connection has no idea what you wrote.',
      'The session sends afterClusterTime; the secondary blocks briefly rather than returning stale data.',
      'Causal consistency orders your own operations; it is not a global snapshot of the cluster.',
    ],
    solution: `// 1. No session: write, then immediately read from a secondary. Repeat 20
// times and count how often the write is NOT there yet.
let naiveMisses = 0
for (let i = 0; i < 20; i++) {
  const id = 500 + i
  db.orders.insertOne({ _id: id, total: id }, { writeConcern: { w: 1 } })
  if (db.orders.find({ _id: id }).readPref("secondary").itcount() === 0) naiveMisses++
}
print("naiveMisses " + naiveMisses)

// 2. Same loop inside a causally consistent session: guaranteed, not lucky.
const session = db.getMongo().startSession({ causalConsistency: true })
const sdb = session.getDatabase("shop")
let causalMisses = 0
for (let i = 0; i < 20; i++) {
  const id = 600 + i
  sdb.orders.insertOne({ _id: id, total: id }, { writeConcern: { w: 1 } })
  if (sdb.orders.find({ _id: id }).readPref("secondary").itcount() === 0) causalMisses++
}
print("causalMisses " + causalMisses)
print("hasClusterTime " + (session.getOperationTime() !== undefined))

sdb.orders.insertOne({ _id: 700, total: 700 }, { writeConcern: { w: 1 } })
print("monotonic " + sdb.orders.find({ _id: { $in: [600, 700] } }).readPref("secondary").itcount())
print("total " + db.orders.countDocuments())
session.endSession()`,
    solutionExplanationHtml: `<p>Causal consistency is the guarantee that operations you performed are ordered with respect to each other, even when they are served by different members. The mechanism is a logical clock: every response carries a cluster time, the session remembers the highest one it has seen, and subsequent reads are sent with <code>afterClusterTime</code> set to it. A secondary receiving such a read <strong>waits</strong> until it has applied the oplog up to that point instead of answering with stale data — so the cost is a little latency when the replica is behind, not a wrong answer.</p>
<p>The first loop is included because it is the shape of a real bug, and its result is blunter than most people expect: a measured run on an <em>idle</em> local replica set — three containers on one machine, no load, no network latency — missed <strong>11 of 20</strong> reads. Replication being "fast" does not make it instantaneous, and a read issued microseconds after the write consistently loses that race. Any single hand-run check is therefore worthless here: it either happens to hit or happens to miss, which is why the loop counts instead of asserting. Under real load, across regions, or during an index build the miss rate goes up, not down. The causal loop, by contrast, is zero by construction: if the secondary has not caught up it waits rather than answering wrongly.</p>
<p>Two boundaries keep this honest. The guarantee is <strong>per session</strong>: a read on a different connection, or by another user, has no knowledge of your write and may see the older state. That is the correct scope, since "read your own writes" is a statement about one client. And causal consistency is not a global snapshot — it orders <em>your</em> operations, not everyone's, so two sessions can still observe different interleavings of each other's work. When you need agreement across clients, the tool is <code>w: "majority"</code> paired with <code>readConcern: "majority"</code>, or a transaction.</p>
<p>Practically, drivers create an implicit session for every operation and modern ones enable causal consistency on explicit sessions by default, so the main work is remembering to <em>reuse</em> one session for a logical unit of work rather than letting each call create its own. That single habit is what makes secondary reads safe for the request that just wrote something.</p>`,
    reset: RESET_ALL,
    expectPattern: `naiveMisses \\d+\ncausalMisses 0\nhasClusterTime true\nmonotonic 2\ntotal 43`,
  },
  {
    title: 'Capstone: A Write Path That Survives a Failover',
    difficulty: 'HARD', estimatedMinutes: 60, points: 30,
    concepts: ['retryable writes', 'majority durability across an election', 'reconnection and rediscovery', 'verifying no data was lost', 'end-to-end HA test'],
    prerequisites: ['write concern', 'elections', 'sessions', 'read concern'],
    tags: ['high-availability', 'capstone', 'mongodb', 'failover', 'reliability'],
    problemHtml: `<p>Everything in this module comes together in one question: if the primary disappears mid-workload, does the application lose data? Answer it by measurement rather than by assertion.</p>
<p>Build a write loop that keeps working across a real election:</p>
<ul>
<li>Write documents <code>{ _id: 100 + i }</code> in a loop of 20, each with <code>w: "majority"</code> and a wtimeout, wrapped in a retry helper that catches a failure, waits for a primary, and tries again up to five times.</li>
<li>Halfway through the loop — at iteration 10 — step the current primary down for 15 seconds, so the election happens <em>during</em> the workload.</li>
<li>Print <code>attempted 20</code>, <code>written N</code> (documents actually present), and <code>lost N</code> — the difference, which must be zero.</li>
<li>Capture the primary immediately after the step-down and print <code>interrupted ...</code> — whether leadership really moved while the loop was running. Do not assert on the primary at the <em>end</em> of the run: priority takeover may or may not have returned leadership by then, so that comparison is a flaky test rather than a meaningful one.</li>
<li>Print <code>majorityVisible N</code> — the count read back with <code>readConcern("majority")</code>, proving every write is committed and cannot roll back.</li>
</ul>
<p>Do not pause the workload around the step-down: the interruption is the experiment.</p>`,
    inputSpec: SEED_DESC + ' The workload writes twenty documents while a step-down is issued at the halfway point.',
    outputSpec:
      'All twenty writes end up stored with none lost, leadership moves to another member in the middle of the run, and a majority read sees all twenty — the set healed itself without losing acknowledged data.',
    constraints: 'Every write must use w:"majority". Recovery must come from retrying and rediscovering the primary, not from pausing before the step-down.',
    examplesJson: [
      { input: 'the write loop across a step-down at iteration 10', output: 'attempted 20, written 20, lost 0', explanation: 'Majority-acknowledged writes survive the election, and retried writes land on the new primary.' },
      { input: 'the primary observed immediately after the step-down', output: 'interrupted true', explanation: 'Leadership moved while the loop was still writing — the failover genuinely overlapped the workload rather than happening before or after it.' },
      { input: 'reading back with readConcern("majority")', output: 'majorityVisible 20', explanation: 'Every stored write is majority-committed, so none of them can be rolled back later.' },
    ],
    hintsJson: [
      'Wrap each write in a helper that catches, waits for a primary, and retries with a bound.',
      'Use w:"majority" with a wtimeout so a stalled write fails fast enough to retry.',
      'Guard against double-writing by using a deterministic _id — a retry of an insert that already landed is then a harmless duplicate-key error.',
      'Verify at the end with readConcern("majority") rather than trusting the loop’s own counters.',
    ],
    solution: `${WAIT_PRIMARY}

const startPrimary = waitForPrimary(30)
let midPrimary = startPrimary

function writeWithRetry(doc) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      db.orders.insertOne(doc, { writeConcern: { w: "majority", wtimeout: 8000 } })
      return true
    } catch (e) {
      // A duplicate key means an earlier attempt actually landed — that is success.
      if (e.code === 11000) return true
      waitForPrimary(30)
    }
  }
  return false
}

for (let i = 0; i < 20; i++) {
  if (i === 10) {
    try {
      db.getSiblingDB("admin").runCommand({ replSetStepDown: 15, secondaryCatchUpPeriodSecs: 5 })
    } catch (e) {
      // Expected: the step-down closes connections to that node.
    }
    midPrimary = waitForPrimary(30)
  }
  writeWithRetry({ _id: 100 + i, total: i })
}

const written = db.orders.countDocuments({ _id: { $gte: 100, $lt: 120 } })
print("attempted 20")
print("written " + written)
print("lost " + (20 - written))
print("interrupted " + (midPrimary !== startPrimary))
print("majorityVisible " + db.orders.find({ _id: { $gte: 100, $lt: 120 } }).readConcern("majority").itcount())`,
    solutionExplanationHtml: `<p>The result is the argument: twenty writes attempted, twenty stored, none lost, across a real election. Each piece of the module contributes something specific. <code>w: "majority"</code> guarantees that an acknowledged write is already on a member eligible to become primary, so the election cannot discard it. The retry loop supplies liveness, because the step-down closes connections and some attempt is certain to fail. And the final <code>readConcern("majority")</code> check is the verification that matters — counting from the loop's own bookkeeping would only prove the loop believed itself.</p>
<p>Idempotence is what makes retrying safe, and the deterministic <code>_id</code> is what supplies it. A retry after an ambiguous failure may resend a write that actually landed; with a server-generated id that produces a duplicate document, silently. With a deterministic id it produces a duplicate-key error, which the helper treats as success — the correct interpretation, since the desired state is already true. Modern drivers formalise this with <strong>retryable writes</strong>, attaching a transaction number so the server itself recognises and ignores a repeat; the hand-rolled version here makes the mechanism visible.</p>
<p>Note what the failover cost: a few seconds of elevated latency while the election ran and the driver rediscovered the primary, and nothing else. No configuration change, no human, no data loss. That is the property a replica set is bought for, and it holds only because the write concern was <code>majority</code> — repeat this experiment with <code>w: 1</code> and writes acknowledged just before the step-down can be rolled back, appearing in the loop's count and missing from the collection.</p>
<p>Two things to add before calling such a path production-ready. Bound the total retry budget rather than only the attempt count, so a request cannot hang indefinitely behind a set that has no majority at all — during a partition there may be no primary to wait for, and failing fast is better than blocking. And log retry counts as a metric: a rising retry rate is the earliest visible sign of an unstable set, well before it becomes an outage.</p>`,
    diagramMermaid: `flowchart TD
  A[write with w majority] --> B{acknowledged}
  B -->|yes| C[next document]
  B -->|no| D{duplicate key}
  D -->|yes| C
  D -->|no| E[wait for a primary to be elected]
  E --> F{attempts left}
  F -->|yes| A
  F -->|no| G[give up and surface the failure]
  C --> H[verify at the end with readConcern majority]`,
    reset: RESET,
    expect: `attempted 20\nwritten 20\nlost 0\ninterrupted true\nmajorityVisible 20`,
  },
];

// ---- emit ----
const OUT = path.resolve(process.argv[2] || 'docs/codelab-authoring/authored');
const VERIFY = path.resolve(process.argv[3] || 'docs/codelab-authoring/verify') + '/mongodb-420';
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VERIFY, { recursive: true });

const scaffold = `// Connect with: mongosh "mongodb://cl_rs1:27017,cl_rs2:27017,cl_rs3:27017/shop?replicaSet=rs0"
// TODO: implement the steps described above.
`;
const clean = exercises.map((ex) => ({
  title: ex.title, difficulty: ex.difficulty, estimatedMinutes: ex.estimatedMinutes, points: ex.points,
  concepts: ex.concepts, prerequisites: ex.prerequisites, tags: ex.tags,
  problemHtml: ex.problemHtml, inputSpec: ex.inputSpec, outputSpec: ex.outputSpec, constraints: ex.constraints,
  examplesJson: ex.examplesJson, hintsJson: ex.hintsJson,
  starterCodeJson: [{ name: 'solution.js', language: L, code: scaffold }],
  solutionCodeJson: [{ name: 'solution.js', language: L, code: ex.solution }],
  solutionExplanationHtml: ex.solutionExplanationHtml,
  ...(ex.diagramMermaid ? { diagramMermaid: ex.diagramMermaid } : {}),
}));
fs.writeFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), JSON.stringify({ trackSlug, moduleSlug, exercises: clean }, null, 2));

exercises.forEach((ex, i) => {
  const n = i + 1;
  fs.writeFileSync(path.join(VERIFY, `ex${n}.js`), `${ex.reset || ''}\n${ex.solution}\n`);
  fs.writeFileSync(path.join(VERIFY, `ex${n}.expect.txt`), `${ex.expect ?? ''}\n`);
  if (ex.expectPattern) fs.writeFileSync(path.join(VERIFY, `ex${n}.pattern.txt`), `${ex.expectPattern}\n`);
});

const parsed = JSON.parse(fs.readFileSync(path.join(OUT, `${trackSlug}__${moduleSlug}.json`), 'utf8'));
const diffs = ['EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'MEDIUM', 'HARD', 'HARD'];
if (parsed.exercises.length !== 10) throw new Error('need exactly 10 exercises');
const titles = new Set();
parsed.exercises.forEach((ex, i) => {
  if (ex.difficulty !== diffs[i]) throw new Error(`slot ${i + 1} diff ${ex.difficulty} != ${diffs[i]}`);
  if (titles.has(ex.title)) throw new Error(`duplicate title ${ex.title}`);
  titles.add(ex.title);
  if (ex.problemHtml.length < 900) throw new Error(`problemHtml<900 ${ex.title} (${ex.problemHtml.length})`);
  if (ex.solutionExplanationHtml.length < 500) throw new Error(`expl<500 ${ex.title}`);
  if (ex.hintsJson.length < 4) throw new Error(`<4 hints ${ex.title}`);
  if (ex.examplesJson.length < 2) throw new Error(`<2 examples ${ex.title}`);
  const solLen = ex.solutionCodeJson.map((f) => f.code).join('').length;
  if (solLen < 205) throw new Error(`solution<205 ${ex.title} (${solLen})`);
  if (/TODO|\.\.\./.test(ex.solutionCodeJson.map((f) => f.code).join(''))) throw new Error(`incomplete solution ${ex.title}`);
});
console.log(`OK ${parsed.exercises.length} exercises -> ${trackSlug}__${moduleSlug}.json`);
