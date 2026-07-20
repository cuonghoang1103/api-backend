db.orders.drop()
db.orders.insertMany([{ _id: 1, total: 10 }, { _id: 2, total: 20 }], { writeConcern: { w: "majority" } })
db.orders.insertOne({ _id: 20, total: 200 }, { writeConcern: { w: "majority" } })
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
print("snapshotOk " + ok)
