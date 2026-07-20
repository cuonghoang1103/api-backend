db = db.getSiblingDB("cl418")
db.dropDatabase()
const statuses = ["pending", "shipped", "delivered", "cancelled"]
const regions = ["north", "south", "east", "west"]
const tagPool = ["fragile", "gift", "bulk", "express", "cold"]
let batch = []
for (let i = 1; i <= 60000; i++) {
  const doc = {
    _id: i,
    sku: "SKU-" + i,
    customerId: 1000 + (i % 5000),
    status: statuses[i % 4],
    region: regions[Math.floor(i / 5) % 4],
    amount: ((i * 7) % 499) + 1,
    createdAt: new Date(Date.UTC(2024, 0, 1) + i * 60000),
    tags: [tagPool[i % 5], tagPool[(i + 2) % 5]]
  }
  if (i % 100 === 0) doc.couponCode = "SAVE" + (i / 100)
  batch.push(doc)
  if (batch.length === 5000) { const r = db.orders.insertMany(batch, { ordered: false }); batch = [] }
}
if (batch.length) { const r = db.orders.insertMany(batch, { ordered: false }) }
print("SEED orders=" + db.orders.countDocuments() + " coupons=" + db.orders.countDocuments({ couponCode: { $exists: true } }))
print("========== EX 1: Measure a Collection Scan and Kill It with a Single-Field Index ==========")
db.orders.dropIndexes()
function plan(e) {
  const s = e.executionStats, stages = [];
  for (let p = e.queryPlanner.winningPlan; p; p = p.inputStage) stages.push(p.stage);
  return { stages: stages.join(" <- "), nReturned: s.nReturned, keys: s.totalKeysExamined, docs: s.totalDocsExamined };
}

plan(db.orders.find({ sku: "SKU-42137" }).explain("executionStats"))

db.orders.createIndex({ sku: 1 })

plan(db.orders.find({ sku: "SKU-42137" }).explain("executionStats"))

db.orders.find({ sku: "SKU-42137" }).explain("executionStats").queryPlanner.winningPlan
print("========== EX 2: Inventory Indexes and Retire One Safely with hideIndex ==========")
db.orders.dropIndexes()
function plan(e) {
  const s = e.executionStats, stages = [];
  for (let p = e.queryPlanner.winningPlan; p; p = p.inputStage) stages.push(p.stage);
  return { stages: stages.join(" <- "), nReturned: s.nReturned, keys: s.totalKeysExamined, docs: s.totalDocsExamined };
}

db.orders.createIndex({ customerId: 1 })
db.orders.createIndex({ status: 1, createdAt: -1 }, { name: "status_recent" })

db.orders.getIndexes()

db.orders.hideIndex("status_recent")
plan(db.orders.find({ status: "shipped" }).sort({ createdAt: -1 }).limit(5).explain("executionStats"))

db.orders.unhideIndex("status_recent")
plan(db.orders.find({ status: "shipped" }).sort({ createdAt: -1 }).limit(5).explain("executionStats"))

db.orders.dropIndex("status_recent")
db.orders.getIndexes().map(i => i.name)
print("========== EX 3: Compound Index Prefixes: Why Key Order Decides Which Queries Are Fast ==========")
db.orders.dropIndexes()
function plan(e) {
  const s = e.executionStats, stages = [];
  for (let p = e.queryPlanner.winningPlan; p; p = p.inputStage) stages.push(p.stage);
  return { stages: stages.join(" <- "), nReturned: s.nReturned, keys: s.totalKeysExamined, docs: s.totalDocsExamined };
}

db.orders.createIndex({ region: 1, status: 1, amount: 1 })

plan(db.orders.find({ region: "north" }).explain("executionStats"))
plan(db.orders.find({ region: "north", status: "shipped" }).explain("executionStats"))
plan(db.orders.find({ status: "shipped" }).explain("executionStats"))
plan(db.orders.find({ region: "north", status: "shipped", amount: { $gt: 490 } }).explain("executionStats"))

db.orders.find({ region: "north", status: "shipped", amount: { $gt: 490 } }).explain("executionStats").queryPlanner.winningPlan.inputStage.indexBounds
print("========== EX 4: Order a Compound Index by the ESR Rule to Remove a Blocking Sort ==========")
db.orders.dropIndexes()
function plan(e) {
  const s = e.executionStats, stages = [];
  for (let p = e.queryPlanner.winningPlan; p; p = p.inputStage) stages.push(p.stage);
  return { stages: stages.join(" <- "), nReturned: s.nReturned, keys: s.totalKeysExamined, docs: s.totalDocsExamined };
}

db.orders.createIndex({ status: 1, amount: 1, createdAt: -1 }, { name: "esr_bad" })
db.orders.createIndex({ status: 1, createdAt: -1, amount: 1 }, { name: "esr_good" })

const q = () => db.orders.find({ status: "shipped", amount: { $gt: 400 } }).sort({ createdAt: -1 }).limit(20)

plan(q().hint("esr_bad").explain("executionStats"))
plan(q().hint("esr_good").explain("executionStats"))
plan(q().explain("executionStats"))
print("========== EX 5: Build a Covered Query That Never Touches a Document ==========")
db.orders.dropIndexes()
function plan(e) {
  const s = e.executionStats, stages = [];
  for (let p = e.queryPlanner.winningPlan; p; p = p.inputStage) stages.push(p.stage);
  return { stages: stages.join(" <- "), nReturned: s.nReturned, keys: s.totalKeysExamined, docs: s.totalDocsExamined };
}

db.orders.createIndex({ status: 1, amount: 1 })

const f = { status: "shipped", amount: { $gt: 490 } }

plan(db.orders.find(f, { _id: 0, status: 1, amount: 1 }).explain("executionStats"))
plan(db.orders.find(f, { _id: 0, status: 1, amount: 1, sku: 1 }).explain("executionStats"))
plan(db.orders.find(f, { status: 1, amount: 1 }).explain("executionStats"))
plan(db.orders.find(f, { _id: 0, amount: 1 }).sort({ amount: 1 }).explain("executionStats"))
print("========== EX 6: Multikey Indexes on Arrays and the Three Limits They Impose ==========")
db.orders.dropIndexes(); db.parallel.drop()
function plan(e) {
  const s = e.executionStats, stages = [];
  for (let p = e.queryPlanner.winningPlan; p; p = p.inputStage) stages.push(p.stage);
  return { stages: stages.join(" <- "), nReturned: s.nReturned, keys: s.totalKeysExamined, docs: s.totalDocsExamined };
}

db.orders.createIndex({ tags: 1 })
const e1 = db.orders.find({ tags: "gift" }).explain("executionStats")
plan(e1)
e1.queryPlanner.winningPlan.inputStage.isMultiKey

plan(db.orders.find({ tags: { $all: ["gift", "cold"] } }).explain("executionStats"))

db.orders.createIndex({ tags: 1, status: 1 }, { name: "tags_status" })
plan(db.orders.find({ tags: "gift", status: "shipped" }, { _id: 0, tags: 1, status: 1 }).hint("tags_status").explain("executionStats"))

db.parallel.drop()
db.parallel.createIndex({ a: 1, b: 1 })
try { db.parallel.insertOne({ a: [1, 2], b: [3, 4] }) } catch (err) { print(err.message) }
print("========== EX 7: Shrink an Index with partialFilterExpression and sparse ==========")
db.orders.dropIndexes()
function plan(e) {
  const s = e.executionStats, stages = [];
  for (let p = e.queryPlanner.winningPlan; p; p = p.inputStage) stages.push(p.stage);
  return { stages: stages.join(" <- "), nReturned: s.nReturned, keys: s.totalKeysExamined, docs: s.totalDocsExamined };
}

db.orders.createIndex({ createdAt: -1 }, { name: "pending_recent", partialFilterExpression: { status: "pending" } })

plan(db.orders.find({ status: "pending" }).sort({ createdAt: -1 }).limit(10).explain("executionStats"))
plan(db.orders.find({ status: "shipped" }).sort({ createdAt: -1 }).limit(10).explain("executionStats"))

db.orders.createIndex({ couponCode: 1 }, { name: "coupon_sparse", sparse: true })

plan(db.orders.find({ couponCode: "SAVE7" }).explain("executionStats"))
plan(db.orders.find({ couponCode: { $exists: false } }).limit(3).explain("executionStats"))
print("========== EX 8: Enforce Uniqueness and Read the E11000 Duplicate Key Error ==========")
db.orders.dropIndexes(); db.orders.deleteOne({ _id: 999999 }); db.orders.updateOne({ _id: 200 }, { $unset: { couponCode: "" } })
function plan(e) {
  const s = e.executionStats, stages = [];
  for (let p = e.queryPlanner.winningPlan; p; p = p.inputStage) stages.push(p.stage);
  return { stages: stages.join(" <- "), nReturned: s.nReturned, keys: s.totalKeysExamined, docs: s.totalDocsExamined };
}

db.orders.createIndex({ sku: 1 }, { unique: true })

try {
  db.orders.insertOne({ _id: 999999, sku: "SKU-42137" })
} catch (err) { print(err.code); print(err.message) }

try {
  db.orders.createIndex({ customerId: 1 }, { unique: true })
} catch (err) { print(err.code + " " + err.codeName) }

db.orders.createIndex({ couponCode: 1 }, { unique: true, partialFilterExpression: { couponCode: { $type: "string" } }, name: "coupon_unique" })

try {
  db.orders.updateOne({ _id: 200 }, { $set: { couponCode: "SAVE1" } })
} catch (err) { print(err.message) }

db.orders.getIndexes().map(i => i.name)
print("========== EX 9: Special-Purpose Indexes: Full-Text Search and TTL Expiry ==========")
db.orders.dropIndexes(); db.tickets.drop(); db.sessions.drop()
db.tickets.drop()
db.tickets.insertMany([
  { _id: 1, subject: "Payment failed at checkout", body: "The card was declined during checkout" },
  { _id: 2, subject: "Refund request", body: "I want a refund for my declined payment" },
  { _id: 3, subject: "Shipping delay", body: "My parcel is late and tracking is stuck" },
  { _id: 4, subject: "Checkout page blank", body: "The checkout page renders blank on mobile" }
])

db.tickets.createIndex({ subject: "text", body: "text" }, { name: "ticket_text", weights: { subject: 5, body: 1 } })

db.tickets.find({ $text: { $search: "checkout" } }, { subject: 1, score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } }).toArray()
db.tickets.find({ $text: { $search: "\"declined payment\"" } }, { subject: 1 }).toArray()
db.tickets.find({ $text: { $search: "checkout -blank" } }, { subject: 1 }).toArray()

try {
  db.tickets.createIndex({ body: "text" }, { name: "second_text" })
} catch (err) { print(err.code + " " + err.message.slice(0, 90)) }

db.sessions.drop()
db.sessions.createIndex({ lastSeen: 1 }, { name: "session_ttl", expireAfterSeconds: 1800 })
db.sessions.insertMany([
  { _id: 1, user: "a", lastSeen: new Date(Date.now() - 3600 * 1000) },
  { _id: 2, user: "b", lastSeen: new Date(Date.now() - 7200 * 1000) },
  { _id: 3, user: "c", lastSeen: new Date() }
])
print("before=" + db.sessions.countDocuments())
sleep(75000)
print("after=" + db.sessions.countDocuments())
db.sessions.find({}, { user: 1 }).toArray()
print("========== EX 10: Audit an Over-Indexed Collection with $indexStats and Measure the Write Cost ==========")
db.orders.dropIndexes(); db.wa_plain.drop(); db.wa_indexed.drop()
function plan(e) {
  const s = e.executionStats, stages = [];
  for (let p = e.queryPlanner.winningPlan; p; p = p.inputStage) stages.push(p.stage);
  return { stages: stages.join(" <- "), nReturned: s.nReturned, keys: s.totalKeysExamined, docs: s.totalDocsExamined };
}

db.orders.createIndex({ status: 1 })
db.orders.createIndex({ region: 1 })
db.orders.createIndex({ customerId: 1 })
db.orders.createIndex({ amount: 1 })

const before = db.orders.find({ status: "shipped", region: "north" }).explain("executionStats")
plan(before)
before.queryPlanner.rejectedPlans.map(p => p.inputStage.stage)

db.orders.createIndex({ status: 1, region: 1 }, { name: "status_region" })
plan(db.orders.find({ status: "shipped", region: "north" }).explain("executionStats"))

db.orders.find({ status: "shipped", region: "north" }).limit(5).toArray().length
db.orders.find({ customerId: 1234 }).toArray().length

const unused = db.orders.aggregate([{ $indexStats: {} }]).toArray().filter(s => s.name !== "_id_" && Number(s.accesses.ops) === 0).map(s => s.name).sort()
unused
unused.forEach(n => db.orders.dropIndex(n))
db.orders.getIndexes().map(i => i.name)

const docs = []
for (let i = 1; i <= 20000; i++) docs.push({ _id: i, a: i, b: i % 97, c: "x" + i, d: new Date(1700000000000 + i) })
db.wa_plain.drop(); db.wa_indexed.drop()
db.wa_indexed.createIndex({ a: 1 })
db.wa_indexed.createIndex({ b: 1 })
db.wa_indexed.createIndex({ c: 1 })
db.wa_indexed.createIndex({ d: 1 })
db.wa_indexed.createIndex({ b: 1, d: -1 })
const t0 = Date.now()
const r1 = db.wa_plain.insertMany(docs, { ordered: false })
const plainMs = Date.now() - t0
const t1 = Date.now()
const r2 = db.wa_indexed.insertMany(docs, { ordered: false })
const indexedMs = Date.now() - t1
print("plainMs=" + plainMs + " (indexes: " + db.wa_plain.getIndexes().length + ")")
print("indexedMs=" + indexedMs + " (indexes: " + db.wa_indexed.getIndexes().length + ")")
