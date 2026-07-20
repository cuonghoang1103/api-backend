db.orders.drop()
db.orders.insertMany([{ _id: 1, total: 10 }, { _id: 2, total: 20 }], { writeConcern: { w: "majority" } })
function waitForPrimary(seconds) {
  for (let i = 0; i < seconds * 2; i++) {
    try {
      const s = rs.status()
      const p = s.members.find(m => m.stateStr === "PRIMARY")
      if (p) return p.name
    } catch (e) { /* during an election the node may refuse the command */ }
    sleep(500)
  }
  return null
}

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
print("majorityVisible " + db.orders.find({ _id: { $gte: 100, $lt: 120 } }).readConcern("majority").itcount())
