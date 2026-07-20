db.orders.drop()
db.orders.insertMany([{ _id: 1, total: 10 }, { _id: 2, total: 20 }], { writeConcern: { w: "majority" } })
db.inventory.drop()
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
session.endSession()
