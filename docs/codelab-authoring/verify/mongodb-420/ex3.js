db.orders.drop()
db.orders.insertMany([{ _id: 1, total: 10 }, { _id: 2, total: 20 }], { writeConcern: { w: "majority" } })
const fast = db.orders.insertOne({ _id: 10, total: 100 }, { writeConcern: { w: 1 } })
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
print("docs " + db.orders.countDocuments())
