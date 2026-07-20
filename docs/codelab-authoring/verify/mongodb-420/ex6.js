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
print("restored " + waitForNamedPrimary(before, 90))
