db.orders.drop()
db.orders.insertMany([{ _id: 1, total: 10 }, { _id: 2, total: 20 }], { writeConcern: { w: "majority" } })
function lagReport() {
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
print("afterWrites " + (Math.max.apply(null, after.map(r => r.lag)) <= 10))
