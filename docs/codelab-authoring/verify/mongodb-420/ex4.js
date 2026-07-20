db.orders.drop()
db.orders.insertMany([{ _id: 1, total: 10 }, { _id: 2, total: 20 }], { writeConcern: { w: 3 } })
print("primaryRead " + db.orders.find().itcount())
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
}
