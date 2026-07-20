db = db.getSiblingDB("cl416")
db.dropDatabase()
print("========== EX 1: Embed a One-to-Few Relationship: Customer Addresses ==========")
db.customers.drop()
db.customers.insertOne({
  _id: 1,
  name: "Mai Tran",
  addresses: [
    { label: "home", city: "Hanoi", zip: "10000" },
    { label: "work", city: "Da Nang", zip: "55000" }
  ]
})
db.customers.findOne({ _id: 1 })
db.customers.find({ "addresses.city": "Da Nang" }, { name: 1, _id: 0 }).toArray()
db.customers.updateOne({ _id: 1 }, { $push: { addresses: { label: "billing", city: "Hue", zip: "53000" } } })
db.customers.findOne({ _id: 1 }, { _id: 0, "addresses.label": 1 })
db.customers.countDocuments({ "addresses.label": "billing" })
print("========== EX 2: Reference a One-to-Many Relationship: Authors and Books ==========")
db.authors.drop(); db.books.drop()
db.authors.insertMany([{ _id: 1, name: "Ursula Le Guin" }, { _id: 2, name: "Ted Chiang" }])
db.books.insertMany([
  { _id: 11, title: "A Wizard of Earthsea", authorId: 1, year: 1968 },
  { _id: 12, title: "The Dispossessed", authorId: 1, year: 1974 },
  { _id: 13, title: "Exhalation", authorId: 2, year: 2019 }
])
db.books.find({ authorId: 1 }, { title: 1, _id: 0 }).sort({ title: 1 }).toArray()
const author = db.authors.findOne({ name: "Ted Chiang" })
db.books.find({ authorId: author._id }, { title: 1, _id: 0 }).toArray()
db.books.countDocuments({ authorId: 1 })
db.books.insertOne({ _id: 14, title: "The Left Hand of Darkness", authorId: 1, year: 1969 })
db.books.countDocuments({ authorId: 1 })
db.authors.findOne({ _id: 1 })
print("========== EX 3: Model Many-to-Many Enrolments with an Array of References ==========")
db.students.drop(); db.courses.drop()
db.courses.insertMany([
  { _id: "cs101", title: "Intro to Programming", credits: 4 },
  { _id: "ma102", title: "Linear Algebra", credits: 3 },
  { _id: "ph103", title: "Mechanics", credits: 3 }
])
db.students.insertMany([
  { _id: 1, name: "An", courseIds: ["cs101", "ma102"] },
  { _id: 2, name: "Binh", courseIds: ["cs101"] },
  { _id: 3, name: "Chi", courseIds: ["ph103", "cs101"] }
])
db.students.find({ courseIds: "cs101" }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
db.courses.find({ _id: { $in: db.students.findOne({ _id: 3 }).courseIds } }, { title: 1 }).sort({ _id: 1 }).toArray()
db.students.updateOne({ _id: 2 }, { $addToSet: { courseIds: "ph103" } })
db.students.updateOne({ _id: 2 }, { $addToSet: { courseIds: "ph103" } })
db.students.countDocuments({ courseIds: "ph103" })
db.students.find({ courseIds: { $all: ["cs101", "ph103"] } }, { name: 1, _id: 0 }).sort({ name: 1 }).toArray()
print("========== EX 4: Fix an Unbounded Array with the Bucket Pattern ==========")
db.device_log.drop(); db.readings.drop()
db.device_log.insertOne({ _id: "d1", readings: [] })
db.device_log.updateOne({ _id: "d1" }, { $push: { readings: { $each: [ { t: 1, v: 20.1 }, { t: 2, v: 20.4 }, { t: 3, v: 20.9 }, { t: 4, v: 21.2 } ] } } })
bsonsize(db.device_log.findOne({ _id: "d1" }))
db.readings.updateOne({ deviceId: "d1", count: { $lt: 3 } }, { $push: { measurements: { t: 1, v: 20.1 } }, $inc: { count: 1 } }, { upsert: true })
db.readings.updateOne({ deviceId: "d1", count: { $lt: 3 } }, { $push: { measurements: { t: 2, v: 20.4 } }, $inc: { count: 1 } }, { upsert: true })
db.readings.updateOne({ deviceId: "d1", count: { $lt: 3 } }, { $push: { measurements: { t: 3, v: 20.9 } }, $inc: { count: 1 } }, { upsert: true })
db.readings.updateOne({ deviceId: "d1", count: { $lt: 3 } }, { $push: { measurements: { t: 4, v: 21.2 } }, $inc: { count: 1 } }, { upsert: true })
db.readings.find({}, { deviceId: 1, count: 1, _id: 0 }).sort({ count: -1 }).toArray()
db.readings.countDocuments()
print("========== EX 5: Extended Reference: Denormalise a Product into Order Line Items ==========")
db.products.drop(); db.orders.drop()
db.products.insertMany([{ _id: 1, name: "Keyboard", price: 49.9 }, { _id: 2, name: "Mouse", price: 19 }])
db.orders.insertMany([
  { _id: 100, items: [ { productId: 1, name: "Keyboard", unitPrice: 49.9, qty: 1 }, { productId: 2, name: "Mouse", unitPrice: 19, qty: 2 } ] },
  { _id: 101, items: [ { productId: 1, name: "Keyboard", unitPrice: 49.9, qty: 3 } ] }
])
db.orders.findOne({ _id: 100 })
db.products.updateOne({ _id: 1 }, { $set: { name: "Keyboard Pro", price: 59.9 } })
db.orders.updateMany({ "items.productId": 1 }, { $set: { "items.$[e].name": "Keyboard Pro" } }, { arrayFilters: [{ "e.productId": 1 }] })
db.orders.findOne({ _id: 100 }, { _id: 0, "items.name": 1, "items.unitPrice": 1 })
db.orders.find({}, { "items.name": 1, "items.unitPrice": 1 }).sort({ _id: 1 }).toArray()
db.products.findOne({ _id: 1 })
print("========== EX 6: Version and Migrate a Schema In Place with schemaVersion ==========")
db.users.drop()
db.users.insertMany([
  { _id: 1, schemaVersion: 1, name: "An Nguyen", email: "an@example.com" },
  { _id: 2, schemaVersion: 1, name: "Binh Le", email: "binh@example.com" }
])
db.users.insertOne({ _id: 3, schemaVersion: 2, firstName: "Chi", lastName: "Tran", contacts: [{ type: "email", value: "chi@example.com" }] })
db.users.countDocuments({ schemaVersion: 1 })
db.users.find({ schemaVersion: 1 }).forEach(d => {
  const parts = d.name.split(" ");
  db.users.updateOne(
    { _id: d._id },
    {
      $set: {
        schemaVersion: 2,
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
        contacts: [{ type: "email", value: d.email }]
      },
      $unset: { name: "", email: "" }
    }
  );
})
db.users.countDocuments({ schemaVersion: 1 })
db.users.find({}, { firstName: 1, lastName: 1, contacts: 1, schemaVersion: 1 }).sort({ _id: 1 }).toArray()
print("========== EX 7: Maintain a Pre-Aggregated Rating with the Computed Pattern ==========")
db.movies.drop(); db.ratings.drop()
db.movies.insertOne({ _id: 1, title: "Dune", ratingCount: 0, ratingSum: 0, ratingAvg: 0 })
db.ratings.insertOne({ movieId: 1, score: 5 })
db.movies.updateOne({ _id: 1 }, [
  { $set: { ratingCount: { $add: ["$ratingCount", 1] }, ratingSum: { $add: ["$ratingSum", 5] } } },
  { $set: { ratingAvg: { $round: [{ $divide: ["$ratingSum", "$ratingCount"] }, 2] } } }
])
db.ratings.insertOne({ movieId: 1, score: 4 })
db.movies.updateOne({ _id: 1 }, [
  { $set: { ratingCount: { $add: ["$ratingCount", 1] }, ratingSum: { $add: ["$ratingSum", 4] } } },
  { $set: { ratingAvg: { $round: [{ $divide: ["$ratingSum", "$ratingCount"] }, 2] } } }
])
db.ratings.insertOne({ movieId: 1, score: 3 })
db.movies.updateOne({ _id: 1 }, [
  { $set: { ratingCount: { $add: ["$ratingCount", 1] }, ratingSum: { $add: ["$ratingSum", 3] } } },
  { $set: { ratingAvg: { $round: [{ $divide: ["$ratingSum", "$ratingCount"] }, 2] } } }
])
db.movies.findOne({ _id: 1 })
db.ratings.countDocuments({ movieId: 1 })
print("========== EX 8: Handle a Viral Document with the Outlier Pattern ==========")
db.posts.drop(); db.post_comments.drop()
db.posts.insertOne({
  _id: 1,
  title: "Indexing basics",
  comments: [ { user: "an", text: "clear" }, { user: "binh", text: "thanks" } ]
})
db.posts.insertOne({
  _id: 2,
  title: "Why we left the cloud",
  hasExtras: true,
  comments: [ { user: "chi", text: "brave" }, { user: "dung", text: "numbers please" }, { user: "em", text: "same here" } ]
})
db.post_comments.insertMany([
  { postId: 2, user: "f1", text: "what about egress" },
  { postId: 2, user: "f2", text: "we did the same" },
  { postId: 2, user: "f3", text: "any downtime" },
  { postId: 2, user: "f4", text: "great write up" }
])
function loadComments(id) {
  const post = db.posts.findOne({ _id: id });
  if (!post) return [];
  if (!post.hasExtras) return post.comments;
  return post.comments.concat(db.post_comments.find({ postId: id }).toArray());
}
print("post 1 comments: " + loadComments(1).length)
print("post 2 comments: " + loadComments(2).length)
db.posts.countDocuments({ hasExtras: true })
db.posts.countDocuments({ hasExtras: { $ne: true } })
print("========== EX 9: Enforce a Contract with $jsonSchema and validationAction ==========")
db.payments.drop()
db.createCollection("payments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["orderId", "amount", "currency", "status"],
      properties: {
        orderId: { bsonType: "number" },
        amount: { bsonType: "number", minimum: 0.01 },
        currency: { enum: ["USD", "EUR", "VND"] },
        status: { enum: ["pending", "paid", "refunded"] }
      }
    }
  },
  validationAction: "error",
  validationLevel: "strict"
})
db.payments.insertOne({ _id: 1, orderId: 100, amount: 25.5, currency: "USD", status: "paid" })
try {
  db.payments.insertOne({ _id: 2, orderId: 101, amount: 25.5, currency: "GBP", status: "paid" })
} catch (e) {
  print("REJECTED: " + e.message + " | code " + e.code);
  printjson(e.errInfo.details.schemaRulesNotSatisfied);
}
try {
  db.payments.insertOne({ _id: 3, orderId: 102, amount: 25.5, currency: "USD" })
} catch (e) {
  print("REJECTED: " + e.message + " | code " + e.code);
  printjson(e.errInfo.details.schemaRulesNotSatisfied);
}
try {
  db.payments.insertOne({ _id: 4, orderId: 103, amount: 0, currency: "USD", status: "pending" })
} catch (e) {
  print("REJECTED: " + e.message + " | code " + e.code);
  printjson(e.errInfo.details.schemaRulesNotSatisfied);
}
db.runCommand({ collMod: "payments", validationAction: "warn" })
db.payments.insertOne({ _id: 4, orderId: 103, amount: 0, currency: "USD", status: "pending" })
db.payments.countDocuments()
print("========== EX 10: Design an E-Commerce Order End to End and Defend the Choices ==========")
db.customers.drop(); db.products.drop(); db.orders.drop(); db.payments_log.drop()
db.customers.insertOne({ _id: 7, name: "Mai Tran", email: "mai@example.com" })
db.products.insertMany([{ _id: 1, name: "Keyboard", price: 49.9 }, { _id: 2, name: "Mouse", price: 19 }])
db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["schemaVersion", "customerId", "status", "items", "totals"],
      properties: {
        schemaVersion: { enum: [2] },
        customerId: { bsonType: "number" },
        status: { enum: ["cart", "placed", "shipped", "cancelled"] },
        items: {
          bsonType: "array",
          minItems: 1,
          items: {
            bsonType: "object",
            required: ["productId", "name", "unitPrice", "qty"],
            properties: {
              productId: { bsonType: "number" },
              name: { bsonType: "string" },
              unitPrice: { bsonType: "number", minimum: 0 },
              qty: { bsonType: "number", minimum: 1 }
            }
          }
        },
        totals: { bsonType: "object", required: ["subtotal", "itemCount"] }
      }
    }
  },
  validationAction: "error"
})
db.orders.insertOne({
  _id: 5001,
  schemaVersion: 2,
  customerId: 7,
  status: "placed",
  items: [
    { productId: 1, name: "Keyboard", unitPrice: 49.9, qty: 1 },
    { productId: 2, name: "Mouse", unitPrice: 19, qty: 2 }
  ],
  totals: { subtotal: 0, itemCount: 0 }
})
db.orders.updateOne({ _id: 5001 }, [
  {
    $set: {
      "totals.subtotal": { $round: [{ $sum: { $map: { input: "$items", as: "i", in: { $multiply: ["$$i.unitPrice", "$$i.qty"] } } } }, 2] },
      "totals.itemCount": { $sum: "$items.qty" }
    }
  }
])
db.orders.findOne({ _id: 5001 }, { totals: 1 })
try {
  db.orders.insertOne({ _id: 5002, schemaVersion: 2, customerId: 7, status: "placed", items: [], totals: { subtotal: 0, itemCount: 0 } })
} catch (e) {
  print("REJECTED empty items: " + e.message + " | code " + e.code);
  printjson(e.errInfo.details.schemaRulesNotSatisfied);
}
try {
  db.orders.insertOne({ _id: 5003, schemaVersion: 2, customerId: 7, status: "paid", items: [{ productId: 1, name: "Keyboard", unitPrice: 49.9, qty: 1 }], totals: { subtotal: 49.9, itemCount: 1 } })
} catch (e) {
  print("REJECTED bad status: " + e.message + " | code " + e.code);
  printjson(e.errInfo.details.schemaRulesNotSatisfied);
}
db.products.updateOne({ _id: 1 }, { $set: { price: 59.9 } })
db.orders.findOne({ _id: 5001 }, { _id: 0, "items.name": 1, "items.unitPrice": 1 })
db.payments_log.insertMany([
  { _id: 900, orderId: 5001, method: "card", amount: 87.9, last4: "4242", brand: "visa" },
  { _id: 901, orderId: 5001, method: "transfer", amount: 87.9, bankCode: "VCB", reference: "TX-5001" }
])
db.payments_log.find({ orderId: 5001 }).sort({ _id: 1 }).toArray()
db.orders.find({ customerId: 7, status: "placed" }, { totals: 1 }).sort({ _id: 1 }).toArray()
