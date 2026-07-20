db = db.getSiblingDB('cl_mongo415')
print("========== EX 1: Select Rows with the Comparison Operators $eq, $gt, $gte, $lt, $lte and $ne ==========")
db.products.drop(); db.products.insertMany([
  { _id: 1, name: "Keyboard", price: 49.9, stock: 12, category: "input" },
  { _id: 2, name: "Mouse", price: 19, stock: 40, category: "input" },
  { _id: 3, name: "Monitor", price: 150, stock: 5, category: "display" },
  { _id: 4, name: "Cable", price: 12, stock: 0, category: "cable" },
  { _id: 5, name: "Desk Pad", price: 30, stock: 7, category: "desk" },
  { _id: 6, name: "Lamp", price: 25, stock: 3 }
])
print("---- solution output ----")
db.products.find({ price: { $gte: 30 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ price: { $lt: 20 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ price: { $gt: 12, $lte: 49.9 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ category: { $ne: "input" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ price: { $eq: 150 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
print("========== EX 2: Match Against a Set of Values with $in and $nin ==========")
db.products.drop(); db.products.insertMany([
  { _id: 1, name: "Keyboard", price: 49.9, stock: 12, category: "input" },
  { _id: 2, name: "Mouse", price: 19, stock: 40, category: "input" },
  { _id: 3, name: "Monitor", price: 150, stock: 5, category: "display" },
  { _id: 4, name: "Cable", price: 12, stock: 0, category: "cable" },
  { _id: 5, name: "Desk Pad", price: 30, stock: 7, category: "desk" },
  { _id: 6, name: "Lamp", price: 25, stock: 3 }
])
print("---- solution output ----")
db.products.find({ category: { $in: ["input", "display"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ category: { $nin: ["input", "cable"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ category: { $nin: ["input", "cable"], $exists: true } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ price: { $in: [12, 19, 150] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.countDocuments({ category: { $in: ["input", "display"] } })
print("========== EX 3: Combine Conditions with $and, $or, $nor and $not ==========")
db.products.drop(); db.products.insertMany([
  { _id: 1, name: "Keyboard", price: 49.9, stock: 12, category: "input" },
  { _id: 2, name: "Mouse", price: 19, stock: 40, category: "input" },
  { _id: 3, name: "Monitor", price: 150, stock: 5, category: "display" },
  { _id: 4, name: "Cable", price: 12, stock: 0, category: "cable" },
  { _id: 5, name: "Desk Pad", price: 30, stock: 7, category: "desk" },
  { _id: 6, name: "Lamp", price: 25, stock: 3 }
])
print("---- solution output ----")
db.products.find({ $or: [{ price: { $lt: 15 } }, { price: { $gt: 100 } }] }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ $and: [{ $or: [{ category: "input" }, { category: "display" }] }, { price: { $lt: 100 } }] }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ $nor: [{ category: "input" }, { price: { $gt: 100 } }] }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ stock: { $not: { $gte: 10 } } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.countDocuments({ $or: [{ price: { $lt: 15 } }, { price: { $gt: 100 } }] })
print("========== EX 4: Probe Field Presence and BSON Type with $exists and $type ==========")
db.users.drop(); db.users.insertMany([
  { _id: 1, name: "ana", age: 30, email: "ana@example.com" },
  { _id: 2, name: "bo", age: "31" },
  { _id: 3, name: "cy", age: null, email: "cy@example.com" },
  { _id: 4, name: "di", email: null },
  { _id: 5, name: "ed", age: 28.5, email: "ed@example.com" }
])
print("---- solution output ----")
db.users.find({ email: { $exists: true } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ email: { $exists: false } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: { $type: "string" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: { $type: "number" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: { $type: "int" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: { $type: "double" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: null }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.users.find({ age: { $type: "null" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
print("========== EX 5: Pattern-Match and Compute in the Filter with $regex and $mod ==========")
db.products.drop(); db.products.insertMany([
  { _id: 1, name: "Keyboard", price: 49.9, stock: 12, category: "input" },
  { _id: 2, name: "Mouse", price: 19, stock: 40, category: "input" },
  { _id: 3, name: "Monitor", price: 150, stock: 5, category: "display" },
  { _id: 4, name: "Cable", price: 12, stock: 0, category: "cable" },
  { _id: 5, name: "Desk Pad", price: 30, stock: 7, category: "desk" },
  { _id: 6, name: "Lamp", price: 25, stock: 3 }
])
print("---- solution output ----")
db.products.find({ name: { $regex: "^M" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ name: { $regex: "pad", $options: "i" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ name: /o/ }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ stock: { $mod: [2, 0] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.products.find({ stock: { $mod: [5, 0] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
print("========== EX 6: Query Arrays: Element Match, Whole-Array Equality, $all and $size ==========")
db.articles.drop(); db.articles.insertMany([
  { _id: 1, title: "Alpha", tags: ["mongodb", "database"] },
  { _id: 2, title: "Beta", tags: ["database", "sql", "mongodb"] },
  { _id: 3, title: "Gamma", tags: ["mongodb"] },
  { _id: 4, title: "Delta", tags: ["nosql", "database"] },
  { _id: 5, title: "Epsilon", tags: [] }
])
print("---- solution output ----")
db.articles.find({ tags: "mongodb" }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.find({ tags: ["mongodb", "database"] }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.find({ tags: ["database", "mongodb"] }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.find({ tags: { $all: ["mongodb", "database"] } }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.find({ tags: { $size: 1 } }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.find({ tags: { $size: 0 } }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
db.articles.countDocuments({ tags: "database" })
print("========== EX 7: Constrain a Single Array Element with $elemMatch ==========")
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customer: "ana", items: [{ sku: "A", qty: 2, price: 10 }, { sku: "B", qty: 5, price: 3 }] },
  { _id: 2, customer: "bo", items: [{ sku: "A", qty: 9, price: 20 }, { sku: "C", qty: 1, price: 50 }] },
  { _id: 3, customer: "cy", items: [{ sku: "D", qty: 6, price: 45 }] },
  { _id: 4, customer: "di", items: [{ sku: "B", qty: 1, price: 3 }] }
])
print("---- solution output ----")
db.orders.find({ "items.qty": { $gte: 5 }, "items.price": { $gte: 40 } }, { customer: 1, _id: 0 }).sort({ customer: 1 }).toArray()
db.orders.find({ items: { $elemMatch: { qty: { $gte: 5 }, price: { $gte: 40 } } } }, { customer: 1, _id: 0 }).sort({ customer: 1 }).toArray()
db.orders.find({ "items.sku": "A" }, { customer: 1, _id: 0 }).sort({ customer: 1 }).toArray()
db.orders.find({ items: { $elemMatch: { sku: "B", qty: { $gt: 3 } } } }, { customer: 1, _id: 0 }).sort({ customer: 1 }).toArray()
db.orders.countDocuments({ "items.price": { $gt: 40 } })
print("========== EX 8: Reach into Nested Documents and Shape Results with $slice and $elemMatch Projection ==========")
db.students.drop(); db.students.insertMany([
  { _id: 1, name: "Ana", address: { city: "Hanoi", zip: "10000" }, scores: [{ subject: "math", score: 90 }, { subject: "cs", score: 75 }, { subject: "eng", score: 60 }] },
  { _id: 2, name: "Bo", address: { city: "Hue", zip: "53000" }, scores: [{ subject: "math", score: 55 }, { subject: "cs", score: 95 }] },
  { _id: 3, name: "Cy", address: { city: "Hanoi", zip: "10001" }, scores: [{ subject: "eng", score: 88 }] }
])
print("---- solution output ----")
db.students.find({ "address.city": "Hanoi" }, { name: 1, "address.city": 1, _id: 0 }).sort({ name: 1 }).toArray()
db.students.find({ address: { city: "Hanoi", zip: "10000" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.students.find({ address: { zip: "10000", city: "Hanoi" } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.students.find({}, { name: 1, scores: { $slice: 2 }, _id: 0 }).sort({ name: 1 }).toArray()
db.students.find({ "scores.subject": "cs" }, { name: 1, scores: { $elemMatch: { subject: "cs" } }, _id: 0 }).sort({ name: 1 }).toArray()
db.students.find({ scores: { $elemMatch: { subject: "math", score: { $gt: 80 } } } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
print("========== EX 9: Page a Result Set with sort, skip and limit, then Replace it with Keyset Paging ==========")
db.ledger.drop(); db.ledger.insertMany([
  { _id: 1, code: "OD-01", amount: 10 },
  { _id: 2, code: "OD-02", amount: 20 },
  { _id: 3, code: "OD-03", amount: 30 },
  { _id: 4, code: "OD-04", amount: 40 },
  { _id: 5, code: "OD-05", amount: 50 },
  { _id: 6, code: "OD-06", amount: 60 },
  { _id: 7, code: "OD-07", amount: 70 },
  { _id: 8, code: "OD-08", amount: 80 },
  { _id: 9, code: "OD-09", amount: 90 }
])
print("---- solution output ----")
db.ledger.find({}, { code: 1, _id: 0 }).sort({ _id: 1 }).limit(3).toArray()
db.ledger.find({}, { code: 1, _id: 0 }).sort({ _id: 1 }).skip(6).limit(3).toArray()
db.ledger.find({ _id: { $gt: 6 } }, { code: 1, _id: 0 }).sort({ _id: 1 }).limit(3).toArray()
db.ledger.find({}, { code: 1, amount: 1, _id: 0 }).sort({ amount: -1 }).skip(3).limit(3).toArray()
db.ledger.countDocuments()
db.ledger.estimatedDocumentCount()
db.ledger.countDocuments({ _id: { $gt: 6 } })
print("========== EX 10: Build a Catalogue Health Report with $expr and Combined Filters ==========")
db.catalog.drop(); db.catalog.insertMany([
  { _id: 1, name: "Alpha Laptop", price: 1200, cost: 900, stock: 4, category: "computer", specs: { brand: "Acme", warrantyMonths: 24 }, tags: ["portable", "work"], reviews: [{ user: "ana", rating: 5 }, { user: "bo", rating: 3 }] },
  { _id: 2, name: "Beta Phone", price: 700, cost: 720, stock: 0, category: "phone", specs: { brand: "Acme", warrantyMonths: 12 }, tags: ["portable"], reviews: [{ user: "cy", rating: 4 }] },
  { _id: 3, name: "Gamma Monitor", price: 300, cost: 200, stock: 11, category: "display", specs: { brand: "Vista", warrantyMonths: 36 }, tags: ["desk", "work"], reviews: [{ user: "ana", rating: 2 }, { user: "di", rating: 5 }] },
  { _id: 4, name: "Delta Mouse", price: 25, cost: 30, stock: 60, category: "input", specs: { brand: "Vista", warrantyMonths: 12 }, tags: ["desk"], reviews: [] },
  { _id: 5, name: "Epsilon Keyboard", price: 80, cost: 45, stock: 7, category: "input", specs: { brand: "Acme", warrantyMonths: 24 }, tags: ["desk", "work", "portable"], reviews: [{ user: "bo", rating: 4 }] },
  { _id: 6, name: "Zeta Dock", price: 150, cost: 150, stock: 2, category: "accessory", specs: { brand: "Nova" }, tags: [], reviews: [{ user: "ed", rating: 1 }] }
])
print("---- solution output ----")
db.catalog.find({ $expr: { $gte: ["$cost", "$price"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.find({ stock: { $lte: 7 }, $nor: [{ category: "phone" }, { price: { $lt: 100 } }] }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.find({ "specs.warrantyMonths": { $exists: false } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.find({ "specs.brand": "Acme", "specs.warrantyMonths": { $gte: 24 } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.find({ tags: { $all: ["desk", "work"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.find({ reviews: { $elemMatch: { rating: { $lte: 2 } } } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.catalog.distinct("specs.brand")
db.catalog.countDocuments({ tags: { $size: 0 } })
db.catalog.find({}, { name: 1, price: 1, reviews: { $slice: 1 }, _id: 0 }).sort({ price: -1 }).limit(2).toArray()
