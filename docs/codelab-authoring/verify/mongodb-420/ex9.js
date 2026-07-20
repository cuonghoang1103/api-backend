db.orders.drop()
db.orders.insertMany([{ _id: 1, total: 10 }, { _id: 2, total: 20 }], { writeConcern: { w: 3 } })
// 1. No session: write, then immediately read from a secondary. Repeat 20
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
session.endSession()
