print("========== EX 1: Shape Orders with a Two-Stage Match and Project Pipeline ==========")
db.customers.drop(); db.customers.insertMany([
  { _id: "c1", name: "Ana Vu", tier: "gold", city: "Hanoi" },
  { _id: "c2", name: "Bao Le", tier: "silver", city: "Da Nang" },
  { _id: "c3", name: "Chi Tran", tier: "gold", city: "Hue" },
  { _id: "c4", name: "Dat Pham", tier: "bronze", city: "Can Tho" },
  { _id: "c5", name: "En Ngo", tier: "silver", city: "Hai Phong" }
]);
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customerId: "c1", region: "north", status: "shipped", total: 90, placedAt: ISODate("2024-01-05T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 2, price: 20 }] },
  { _id: 2, customerId: "c2", region: "south", status: "pending", total: 150, placedAt: ISODate("2024-01-17T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }], coupon: "SAVE10" },
  { _id: 3, customerId: "c1", region: "north", status: "delivered", total: 20, placedAt: ISODate("2024-02-02T10:00:00Z"), items: [{ sku: "MS", qty: 1, price: 20 }] },
  { _id: 4, customerId: "c3", region: "east", status: "shipped", total: 130, placedAt: ISODate("2024-02-14T10:00:00Z"), items: [{ sku: "KB", qty: 2, price: 50 }, { sku: "CB", qty: 3, price: 10 }] },
  { _id: 5, customerId: "c4", region: "west", status: "cancelled", total: 300, placedAt: ISODate("2024-02-20T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }] },
  { _id: 6, customerId: "c2", region: "south", status: "delivered", total: 30, placedAt: ISODate("2024-03-03T10:00:00Z"), items: [{ sku: "PD", qty: 1, price: 30 }] },
  { _id: 7, customerId: "c5", region: "north", status: "shipped", total: 110, placedAt: ISODate("2024-03-11T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "PD", qty: 2, price: 30 }], coupon: "SAVE10" },
  { _id: 8, customerId: "c3", region: "east", status: "delivered", total: 160, placedAt: ISODate("2024-03-19T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "CB", qty: 1, price: 10 }] },
  { _id: 9, customerId: "c1", region: "north", status: "pending", total: 50, placedAt: ISODate("2024-04-01T10:00:00Z"), items: [{ sku: "CB", qty: 5, price: 10 }] },
  { _id: 10, customerId: "c4", region: "west", status: "shipped", total: 60, placedAt: ISODate("2024-04-08T10:00:00Z"), items: [{ sku: "MS", qty: 3, price: 20 }] },
  { _id: 11, customerId: "c5", region: "north", status: "delivered", total: 170, placedAt: ISODate("2024-04-22T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "MS", qty: 1, price: 20 }] },
  { _id: 12, customerId: "c2", region: "south", status: "shipped", total: 120, placedAt: ISODate("2024-05-02T10:00:00Z"), items: [{ sku: "PD", qty: 4, price: 30 }] },
  { _id: 13, customerId: "c3", region: "east", status: "cancelled", total: 50, placedAt: ISODate("2024-05-13T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }] },
  { _id: 14, customerId: "c1", region: "north", status: "shipped", total: 320, placedAt: ISODate("2024-05-25T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }, { sku: "CB", qty: 2, price: 10 }], coupon: "SAVE10" },
  { _id: 15, customerId: "c4", region: "west", status: "delivered", total: 70, placedAt: ISODate("2024-06-04T10:00:00Z"), items: [{ sku: "MS", qty: 2, price: 20 }, { sku: "PD", qty: 1, price: 30 }] },
  { _id: 16, customerId: "c5", region: "north", status: "pending", total: 0, placedAt: ISODate("2024-06-15T10:00:00Z"), items: [] },
  { _id: 17, customerId: "c2", region: "south", status: "shipped", total: 150, placedAt: ISODate("2024-06-21T10:00:00Z"), items: [{ sku: "KB", qty: 3, price: 50 }] },
  { _id: 18, customerId: "c3", region: "east", status: "shipped", total: 0, placedAt: ISODate("2024-07-02T10:00:00Z") },
  { _id: 19, customerId: "c4", region: "west", status: "delivered", total: 100, placedAt: ISODate("2024-07-09T10:00:00Z"), items: [{ sku: "CB", qty: 10, price: 10 }], coupon: "SAVE10" },
  { _id: 20, customerId: "c1", region: "north", status: "delivered", total: 220, placedAt: ISODate("2024-07-18T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 1, price: 20 }] }
]);
db.orders.aggregate([
  { $match: { status: "shipped" } },
  { $project: { region: 1, total: 1, totalWithVat: { $round: [{ $multiply: ["$total", 1.1] }, 2] } } },
  { $sort: { _id: 1 } }
])

db.orders.aggregate([
  { $match: { status: "shipped" } },
  { $count: "shippedOrders" }
])
print("========== EX 2: Aggregate Revenue per Region with $group Accumulators ==========")
db.customers.drop(); db.customers.insertMany([
  { _id: "c1", name: "Ana Vu", tier: "gold", city: "Hanoi" },
  { _id: "c2", name: "Bao Le", tier: "silver", city: "Da Nang" },
  { _id: "c3", name: "Chi Tran", tier: "gold", city: "Hue" },
  { _id: "c4", name: "Dat Pham", tier: "bronze", city: "Can Tho" },
  { _id: "c5", name: "En Ngo", tier: "silver", city: "Hai Phong" }
]);
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customerId: "c1", region: "north", status: "shipped", total: 90, placedAt: ISODate("2024-01-05T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 2, price: 20 }] },
  { _id: 2, customerId: "c2", region: "south", status: "pending", total: 150, placedAt: ISODate("2024-01-17T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }], coupon: "SAVE10" },
  { _id: 3, customerId: "c1", region: "north", status: "delivered", total: 20, placedAt: ISODate("2024-02-02T10:00:00Z"), items: [{ sku: "MS", qty: 1, price: 20 }] },
  { _id: 4, customerId: "c3", region: "east", status: "shipped", total: 130, placedAt: ISODate("2024-02-14T10:00:00Z"), items: [{ sku: "KB", qty: 2, price: 50 }, { sku: "CB", qty: 3, price: 10 }] },
  { _id: 5, customerId: "c4", region: "west", status: "cancelled", total: 300, placedAt: ISODate("2024-02-20T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }] },
  { _id: 6, customerId: "c2", region: "south", status: "delivered", total: 30, placedAt: ISODate("2024-03-03T10:00:00Z"), items: [{ sku: "PD", qty: 1, price: 30 }] },
  { _id: 7, customerId: "c5", region: "north", status: "shipped", total: 110, placedAt: ISODate("2024-03-11T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "PD", qty: 2, price: 30 }], coupon: "SAVE10" },
  { _id: 8, customerId: "c3", region: "east", status: "delivered", total: 160, placedAt: ISODate("2024-03-19T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "CB", qty: 1, price: 10 }] },
  { _id: 9, customerId: "c1", region: "north", status: "pending", total: 50, placedAt: ISODate("2024-04-01T10:00:00Z"), items: [{ sku: "CB", qty: 5, price: 10 }] },
  { _id: 10, customerId: "c4", region: "west", status: "shipped", total: 60, placedAt: ISODate("2024-04-08T10:00:00Z"), items: [{ sku: "MS", qty: 3, price: 20 }] },
  { _id: 11, customerId: "c5", region: "north", status: "delivered", total: 170, placedAt: ISODate("2024-04-22T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "MS", qty: 1, price: 20 }] },
  { _id: 12, customerId: "c2", region: "south", status: "shipped", total: 120, placedAt: ISODate("2024-05-02T10:00:00Z"), items: [{ sku: "PD", qty: 4, price: 30 }] },
  { _id: 13, customerId: "c3", region: "east", status: "cancelled", total: 50, placedAt: ISODate("2024-05-13T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }] },
  { _id: 14, customerId: "c1", region: "north", status: "shipped", total: 320, placedAt: ISODate("2024-05-25T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }, { sku: "CB", qty: 2, price: 10 }], coupon: "SAVE10" },
  { _id: 15, customerId: "c4", region: "west", status: "delivered", total: 70, placedAt: ISODate("2024-06-04T10:00:00Z"), items: [{ sku: "MS", qty: 2, price: 20 }, { sku: "PD", qty: 1, price: 30 }] },
  { _id: 16, customerId: "c5", region: "north", status: "pending", total: 0, placedAt: ISODate("2024-06-15T10:00:00Z"), items: [] },
  { _id: 17, customerId: "c2", region: "south", status: "shipped", total: 150, placedAt: ISODate("2024-06-21T10:00:00Z"), items: [{ sku: "KB", qty: 3, price: 50 }] },
  { _id: 18, customerId: "c3", region: "east", status: "shipped", total: 0, placedAt: ISODate("2024-07-02T10:00:00Z") },
  { _id: 19, customerId: "c4", region: "west", status: "delivered", total: 100, placedAt: ISODate("2024-07-09T10:00:00Z"), items: [{ sku: "CB", qty: 10, price: 10 }], coupon: "SAVE10" },
  { _id: 20, customerId: "c1", region: "north", status: "delivered", total: 220, placedAt: ISODate("2024-07-18T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 1, price: 20 }] }
]);
db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $group: { _id: "$region", orders: { $sum: 1 }, revenue: { $sum: "$total" }, avgTotal: { $avg: "$total" }, maxTotal: { $max: "$total" } } },
  { $project: { orders: 1, revenue: 1, avgTotal: { $round: ["$avgTotal", 2] }, maxTotal: 1 } },
  { $sort: { revenue: -1 } }
])
print("========== EX 3: Page a Ranked Report with $sort, $limit, $skip and Read the Explain Plan ==========")
db.customers.drop(); db.customers.insertMany([
  { _id: "c1", name: "Ana Vu", tier: "gold", city: "Hanoi" },
  { _id: "c2", name: "Bao Le", tier: "silver", city: "Da Nang" },
  { _id: "c3", name: "Chi Tran", tier: "gold", city: "Hue" },
  { _id: "c4", name: "Dat Pham", tier: "bronze", city: "Can Tho" },
  { _id: "c5", name: "En Ngo", tier: "silver", city: "Hai Phong" }
]);
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customerId: "c1", region: "north", status: "shipped", total: 90, placedAt: ISODate("2024-01-05T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 2, price: 20 }] },
  { _id: 2, customerId: "c2", region: "south", status: "pending", total: 150, placedAt: ISODate("2024-01-17T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }], coupon: "SAVE10" },
  { _id: 3, customerId: "c1", region: "north", status: "delivered", total: 20, placedAt: ISODate("2024-02-02T10:00:00Z"), items: [{ sku: "MS", qty: 1, price: 20 }] },
  { _id: 4, customerId: "c3", region: "east", status: "shipped", total: 130, placedAt: ISODate("2024-02-14T10:00:00Z"), items: [{ sku: "KB", qty: 2, price: 50 }, { sku: "CB", qty: 3, price: 10 }] },
  { _id: 5, customerId: "c4", region: "west", status: "cancelled", total: 300, placedAt: ISODate("2024-02-20T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }] },
  { _id: 6, customerId: "c2", region: "south", status: "delivered", total: 30, placedAt: ISODate("2024-03-03T10:00:00Z"), items: [{ sku: "PD", qty: 1, price: 30 }] },
  { _id: 7, customerId: "c5", region: "north", status: "shipped", total: 110, placedAt: ISODate("2024-03-11T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "PD", qty: 2, price: 30 }], coupon: "SAVE10" },
  { _id: 8, customerId: "c3", region: "east", status: "delivered", total: 160, placedAt: ISODate("2024-03-19T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "CB", qty: 1, price: 10 }] },
  { _id: 9, customerId: "c1", region: "north", status: "pending", total: 50, placedAt: ISODate("2024-04-01T10:00:00Z"), items: [{ sku: "CB", qty: 5, price: 10 }] },
  { _id: 10, customerId: "c4", region: "west", status: "shipped", total: 60, placedAt: ISODate("2024-04-08T10:00:00Z"), items: [{ sku: "MS", qty: 3, price: 20 }] },
  { _id: 11, customerId: "c5", region: "north", status: "delivered", total: 170, placedAt: ISODate("2024-04-22T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "MS", qty: 1, price: 20 }] },
  { _id: 12, customerId: "c2", region: "south", status: "shipped", total: 120, placedAt: ISODate("2024-05-02T10:00:00Z"), items: [{ sku: "PD", qty: 4, price: 30 }] },
  { _id: 13, customerId: "c3", region: "east", status: "cancelled", total: 50, placedAt: ISODate("2024-05-13T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }] },
  { _id: 14, customerId: "c1", region: "north", status: "shipped", total: 320, placedAt: ISODate("2024-05-25T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }, { sku: "CB", qty: 2, price: 10 }], coupon: "SAVE10" },
  { _id: 15, customerId: "c4", region: "west", status: "delivered", total: 70, placedAt: ISODate("2024-06-04T10:00:00Z"), items: [{ sku: "MS", qty: 2, price: 20 }, { sku: "PD", qty: 1, price: 30 }] },
  { _id: 16, customerId: "c5", region: "north", status: "pending", total: 0, placedAt: ISODate("2024-06-15T10:00:00Z"), items: [] },
  { _id: 17, customerId: "c2", region: "south", status: "shipped", total: 150, placedAt: ISODate("2024-06-21T10:00:00Z"), items: [{ sku: "KB", qty: 3, price: 50 }] },
  { _id: 18, customerId: "c3", region: "east", status: "shipped", total: 0, placedAt: ISODate("2024-07-02T10:00:00Z") },
  { _id: 19, customerId: "c4", region: "west", status: "delivered", total: 100, placedAt: ISODate("2024-07-09T10:00:00Z"), items: [{ sku: "CB", qty: 10, price: 10 }], coupon: "SAVE10" },
  { _id: 20, customerId: "c1", region: "north", status: "delivered", total: 220, placedAt: ISODate("2024-07-18T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 1, price: 20 }] }
]);
db.orders.aggregate([
  { $match: { status: "delivered" } },
  { $sort: { total: -1, _id: 1 } },
  { $limit: 3 },
  { $project: { region: 1, total: 1 } }
])

db.orders.aggregate([
  { $match: { status: "delivered" } },
  { $sort: { total: -1, _id: 1 } },
  { $skip: 3 },
  { $limit: 3 },
  { $project: { region: 1, total: 1 } }
])

const plan = db.orders.explain("queryPlanner").aggregate([
  { $match: { status: "delivered" } },
  { $sort: { total: -1, _id: 1 } },
  { $limit: 3 }
])
printjson(plan.queryPlanner.winningPlan)
print("========== EX 4: Explode Order Line Items with $unwind and preserveNullAndEmptyArrays ==========")
db.customers.drop(); db.customers.insertMany([
  { _id: "c1", name: "Ana Vu", tier: "gold", city: "Hanoi" },
  { _id: "c2", name: "Bao Le", tier: "silver", city: "Da Nang" },
  { _id: "c3", name: "Chi Tran", tier: "gold", city: "Hue" },
  { _id: "c4", name: "Dat Pham", tier: "bronze", city: "Can Tho" },
  { _id: "c5", name: "En Ngo", tier: "silver", city: "Hai Phong" }
]);
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customerId: "c1", region: "north", status: "shipped", total: 90, placedAt: ISODate("2024-01-05T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 2, price: 20 }] },
  { _id: 2, customerId: "c2", region: "south", status: "pending", total: 150, placedAt: ISODate("2024-01-17T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }], coupon: "SAVE10" },
  { _id: 3, customerId: "c1", region: "north", status: "delivered", total: 20, placedAt: ISODate("2024-02-02T10:00:00Z"), items: [{ sku: "MS", qty: 1, price: 20 }] },
  { _id: 4, customerId: "c3", region: "east", status: "shipped", total: 130, placedAt: ISODate("2024-02-14T10:00:00Z"), items: [{ sku: "KB", qty: 2, price: 50 }, { sku: "CB", qty: 3, price: 10 }] },
  { _id: 5, customerId: "c4", region: "west", status: "cancelled", total: 300, placedAt: ISODate("2024-02-20T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }] },
  { _id: 6, customerId: "c2", region: "south", status: "delivered", total: 30, placedAt: ISODate("2024-03-03T10:00:00Z"), items: [{ sku: "PD", qty: 1, price: 30 }] },
  { _id: 7, customerId: "c5", region: "north", status: "shipped", total: 110, placedAt: ISODate("2024-03-11T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "PD", qty: 2, price: 30 }], coupon: "SAVE10" },
  { _id: 8, customerId: "c3", region: "east", status: "delivered", total: 160, placedAt: ISODate("2024-03-19T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "CB", qty: 1, price: 10 }] },
  { _id: 9, customerId: "c1", region: "north", status: "pending", total: 50, placedAt: ISODate("2024-04-01T10:00:00Z"), items: [{ sku: "CB", qty: 5, price: 10 }] },
  { _id: 10, customerId: "c4", region: "west", status: "shipped", total: 60, placedAt: ISODate("2024-04-08T10:00:00Z"), items: [{ sku: "MS", qty: 3, price: 20 }] },
  { _id: 11, customerId: "c5", region: "north", status: "delivered", total: 170, placedAt: ISODate("2024-04-22T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "MS", qty: 1, price: 20 }] },
  { _id: 12, customerId: "c2", region: "south", status: "shipped", total: 120, placedAt: ISODate("2024-05-02T10:00:00Z"), items: [{ sku: "PD", qty: 4, price: 30 }] },
  { _id: 13, customerId: "c3", region: "east", status: "cancelled", total: 50, placedAt: ISODate("2024-05-13T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }] },
  { _id: 14, customerId: "c1", region: "north", status: "shipped", total: 320, placedAt: ISODate("2024-05-25T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }, { sku: "CB", qty: 2, price: 10 }], coupon: "SAVE10" },
  { _id: 15, customerId: "c4", region: "west", status: "delivered", total: 70, placedAt: ISODate("2024-06-04T10:00:00Z"), items: [{ sku: "MS", qty: 2, price: 20 }, { sku: "PD", qty: 1, price: 30 }] },
  { _id: 16, customerId: "c5", region: "north", status: "pending", total: 0, placedAt: ISODate("2024-06-15T10:00:00Z"), items: [] },
  { _id: 17, customerId: "c2", region: "south", status: "shipped", total: 150, placedAt: ISODate("2024-06-21T10:00:00Z"), items: [{ sku: "KB", qty: 3, price: 50 }] },
  { _id: 18, customerId: "c3", region: "east", status: "shipped", total: 0, placedAt: ISODate("2024-07-02T10:00:00Z") },
  { _id: 19, customerId: "c4", region: "west", status: "delivered", total: 100, placedAt: ISODate("2024-07-09T10:00:00Z"), items: [{ sku: "CB", qty: 10, price: 10 }], coupon: "SAVE10" },
  { _id: 20, customerId: "c1", region: "north", status: "delivered", total: 220, placedAt: ISODate("2024-07-18T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 1, price: 20 }] }
]);
db.orders.countDocuments()

db.orders.aggregate([
  { $unwind: "$items" },
  { $count: "itemRows" }
])

db.orders.aggregate([
  { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
  { $count: "rowsWithEmpties" }
])

db.orders.aggregate([
  { $match: { _id: 1 } },
  { $unwind: { path: "$items", includeArrayIndex: "idx" } },
  { $project: { idx: 1, sku: "$items.sku", qty: "$items.qty" } }
])
print("========== EX 5: Group by a Compound Key with $push, $addToSet, $first and $last ==========")
db.customers.drop(); db.customers.insertMany([
  { _id: "c1", name: "Ana Vu", tier: "gold", city: "Hanoi" },
  { _id: "c2", name: "Bao Le", tier: "silver", city: "Da Nang" },
  { _id: "c3", name: "Chi Tran", tier: "gold", city: "Hue" },
  { _id: "c4", name: "Dat Pham", tier: "bronze", city: "Can Tho" },
  { _id: "c5", name: "En Ngo", tier: "silver", city: "Hai Phong" }
]);
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customerId: "c1", region: "north", status: "shipped", total: 90, placedAt: ISODate("2024-01-05T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 2, price: 20 }] },
  { _id: 2, customerId: "c2", region: "south", status: "pending", total: 150, placedAt: ISODate("2024-01-17T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }], coupon: "SAVE10" },
  { _id: 3, customerId: "c1", region: "north", status: "delivered", total: 20, placedAt: ISODate("2024-02-02T10:00:00Z"), items: [{ sku: "MS", qty: 1, price: 20 }] },
  { _id: 4, customerId: "c3", region: "east", status: "shipped", total: 130, placedAt: ISODate("2024-02-14T10:00:00Z"), items: [{ sku: "KB", qty: 2, price: 50 }, { sku: "CB", qty: 3, price: 10 }] },
  { _id: 5, customerId: "c4", region: "west", status: "cancelled", total: 300, placedAt: ISODate("2024-02-20T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }] },
  { _id: 6, customerId: "c2", region: "south", status: "delivered", total: 30, placedAt: ISODate("2024-03-03T10:00:00Z"), items: [{ sku: "PD", qty: 1, price: 30 }] },
  { _id: 7, customerId: "c5", region: "north", status: "shipped", total: 110, placedAt: ISODate("2024-03-11T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "PD", qty: 2, price: 30 }], coupon: "SAVE10" },
  { _id: 8, customerId: "c3", region: "east", status: "delivered", total: 160, placedAt: ISODate("2024-03-19T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "CB", qty: 1, price: 10 }] },
  { _id: 9, customerId: "c1", region: "north", status: "pending", total: 50, placedAt: ISODate("2024-04-01T10:00:00Z"), items: [{ sku: "CB", qty: 5, price: 10 }] },
  { _id: 10, customerId: "c4", region: "west", status: "shipped", total: 60, placedAt: ISODate("2024-04-08T10:00:00Z"), items: [{ sku: "MS", qty: 3, price: 20 }] },
  { _id: 11, customerId: "c5", region: "north", status: "delivered", total: 170, placedAt: ISODate("2024-04-22T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "MS", qty: 1, price: 20 }] },
  { _id: 12, customerId: "c2", region: "south", status: "shipped", total: 120, placedAt: ISODate("2024-05-02T10:00:00Z"), items: [{ sku: "PD", qty: 4, price: 30 }] },
  { _id: 13, customerId: "c3", region: "east", status: "cancelled", total: 50, placedAt: ISODate("2024-05-13T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }] },
  { _id: 14, customerId: "c1", region: "north", status: "shipped", total: 320, placedAt: ISODate("2024-05-25T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }, { sku: "CB", qty: 2, price: 10 }], coupon: "SAVE10" },
  { _id: 15, customerId: "c4", region: "west", status: "delivered", total: 70, placedAt: ISODate("2024-06-04T10:00:00Z"), items: [{ sku: "MS", qty: 2, price: 20 }, { sku: "PD", qty: 1, price: 30 }] },
  { _id: 16, customerId: "c5", region: "north", status: "pending", total: 0, placedAt: ISODate("2024-06-15T10:00:00Z"), items: [] },
  { _id: 17, customerId: "c2", region: "south", status: "shipped", total: 150, placedAt: ISODate("2024-06-21T10:00:00Z"), items: [{ sku: "KB", qty: 3, price: 50 }] },
  { _id: 18, customerId: "c3", region: "east", status: "shipped", total: 0, placedAt: ISODate("2024-07-02T10:00:00Z") },
  { _id: 19, customerId: "c4", region: "west", status: "delivered", total: 100, placedAt: ISODate("2024-07-09T10:00:00Z"), items: [{ sku: "CB", qty: 10, price: 10 }], coupon: "SAVE10" },
  { _id: 20, customerId: "c1", region: "north", status: "delivered", total: 220, placedAt: ISODate("2024-07-18T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 1, price: 20 }] }
]);
db.orders.aggregate([
  { $sort: { placedAt: 1 } },
  { $group: {
      _id: { region: "$region", status: "$status" },
      orders: { $sum: 1 },
      firstOrderId: { $first: "$_id" },
      lastOrderId: { $last: "$_id" },
      ids: { $push: "$_id" },
      buyers: { $addToSet: "$customerId" },
      minTotal: { $min: "$total" },
      maxTotal: { $max: "$total" }
  } },
  { $addFields: { buyers: { $sortArray: { input: "$buyers", sortBy: 1 } } } },
  { $sort: { "_id.region": 1, "_id.status": 1 } }
])
print("========== EX 6: Derive Order Flags with $addFields, $set, $cond, $switch and $ifNull ==========")
db.customers.drop(); db.customers.insertMany([
  { _id: "c1", name: "Ana Vu", tier: "gold", city: "Hanoi" },
  { _id: "c2", name: "Bao Le", tier: "silver", city: "Da Nang" },
  { _id: "c3", name: "Chi Tran", tier: "gold", city: "Hue" },
  { _id: "c4", name: "Dat Pham", tier: "bronze", city: "Can Tho" },
  { _id: "c5", name: "En Ngo", tier: "silver", city: "Hai Phong" }
]);
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customerId: "c1", region: "north", status: "shipped", total: 90, placedAt: ISODate("2024-01-05T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 2, price: 20 }] },
  { _id: 2, customerId: "c2", region: "south", status: "pending", total: 150, placedAt: ISODate("2024-01-17T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }], coupon: "SAVE10" },
  { _id: 3, customerId: "c1", region: "north", status: "delivered", total: 20, placedAt: ISODate("2024-02-02T10:00:00Z"), items: [{ sku: "MS", qty: 1, price: 20 }] },
  { _id: 4, customerId: "c3", region: "east", status: "shipped", total: 130, placedAt: ISODate("2024-02-14T10:00:00Z"), items: [{ sku: "KB", qty: 2, price: 50 }, { sku: "CB", qty: 3, price: 10 }] },
  { _id: 5, customerId: "c4", region: "west", status: "cancelled", total: 300, placedAt: ISODate("2024-02-20T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }] },
  { _id: 6, customerId: "c2", region: "south", status: "delivered", total: 30, placedAt: ISODate("2024-03-03T10:00:00Z"), items: [{ sku: "PD", qty: 1, price: 30 }] },
  { _id: 7, customerId: "c5", region: "north", status: "shipped", total: 110, placedAt: ISODate("2024-03-11T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "PD", qty: 2, price: 30 }], coupon: "SAVE10" },
  { _id: 8, customerId: "c3", region: "east", status: "delivered", total: 160, placedAt: ISODate("2024-03-19T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "CB", qty: 1, price: 10 }] },
  { _id: 9, customerId: "c1", region: "north", status: "pending", total: 50, placedAt: ISODate("2024-04-01T10:00:00Z"), items: [{ sku: "CB", qty: 5, price: 10 }] },
  { _id: 10, customerId: "c4", region: "west", status: "shipped", total: 60, placedAt: ISODate("2024-04-08T10:00:00Z"), items: [{ sku: "MS", qty: 3, price: 20 }] },
  { _id: 11, customerId: "c5", region: "north", status: "delivered", total: 170, placedAt: ISODate("2024-04-22T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "MS", qty: 1, price: 20 }] },
  { _id: 12, customerId: "c2", region: "south", status: "shipped", total: 120, placedAt: ISODate("2024-05-02T10:00:00Z"), items: [{ sku: "PD", qty: 4, price: 30 }] },
  { _id: 13, customerId: "c3", region: "east", status: "cancelled", total: 50, placedAt: ISODate("2024-05-13T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }] },
  { _id: 14, customerId: "c1", region: "north", status: "shipped", total: 320, placedAt: ISODate("2024-05-25T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }, { sku: "CB", qty: 2, price: 10 }], coupon: "SAVE10" },
  { _id: 15, customerId: "c4", region: "west", status: "delivered", total: 70, placedAt: ISODate("2024-06-04T10:00:00Z"), items: [{ sku: "MS", qty: 2, price: 20 }, { sku: "PD", qty: 1, price: 30 }] },
  { _id: 16, customerId: "c5", region: "north", status: "pending", total: 0, placedAt: ISODate("2024-06-15T10:00:00Z"), items: [] },
  { _id: 17, customerId: "c2", region: "south", status: "shipped", total: 150, placedAt: ISODate("2024-06-21T10:00:00Z"), items: [{ sku: "KB", qty: 3, price: 50 }] },
  { _id: 18, customerId: "c3", region: "east", status: "shipped", total: 0, placedAt: ISODate("2024-07-02T10:00:00Z") },
  { _id: 19, customerId: "c4", region: "west", status: "delivered", total: 100, placedAt: ISODate("2024-07-09T10:00:00Z"), items: [{ sku: "CB", qty: 10, price: 10 }], coupon: "SAVE10" },
  { _id: 20, customerId: "c1", region: "north", status: "delivered", total: 220, placedAt: ISODate("2024-07-18T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 1, price: 20 }] }
]);
db.orders.aggregate([
  { $addFields: {
      coupon: { $ifNull: ["$coupon", "NONE"] },
      itemCount: { $size: { $ifNull: ["$items", []] } }
  } },
  { $set: {
      sizeBand: { $switch: { branches: [
        { case: { $gte: ["$total", 200] }, then: "large" },
        { case: { $gte: ["$total", 100] }, then: "medium" }
      ], default: "small" } },
      isCancelled: { $cond: [{ $eq: ["$status", "cancelled"] }, true, false] }
  } },
  { $match: { _id: { $in: [5, 14, 16, 18] } } },
  { $project: { total: 1, coupon: 1, itemCount: 1, sizeBand: 1, isCancelled: 1 } },
  { $sort: { _id: 1 } }
])
print("========== EX 7: Bucket Revenue by Month and Quarter with Date Expressions ==========")
db.customers.drop(); db.customers.insertMany([
  { _id: "c1", name: "Ana Vu", tier: "gold", city: "Hanoi" },
  { _id: "c2", name: "Bao Le", tier: "silver", city: "Da Nang" },
  { _id: "c3", name: "Chi Tran", tier: "gold", city: "Hue" },
  { _id: "c4", name: "Dat Pham", tier: "bronze", city: "Can Tho" },
  { _id: "c5", name: "En Ngo", tier: "silver", city: "Hai Phong" }
]);
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customerId: "c1", region: "north", status: "shipped", total: 90, placedAt: ISODate("2024-01-05T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 2, price: 20 }] },
  { _id: 2, customerId: "c2", region: "south", status: "pending", total: 150, placedAt: ISODate("2024-01-17T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }], coupon: "SAVE10" },
  { _id: 3, customerId: "c1", region: "north", status: "delivered", total: 20, placedAt: ISODate("2024-02-02T10:00:00Z"), items: [{ sku: "MS", qty: 1, price: 20 }] },
  { _id: 4, customerId: "c3", region: "east", status: "shipped", total: 130, placedAt: ISODate("2024-02-14T10:00:00Z"), items: [{ sku: "KB", qty: 2, price: 50 }, { sku: "CB", qty: 3, price: 10 }] },
  { _id: 5, customerId: "c4", region: "west", status: "cancelled", total: 300, placedAt: ISODate("2024-02-20T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }] },
  { _id: 6, customerId: "c2", region: "south", status: "delivered", total: 30, placedAt: ISODate("2024-03-03T10:00:00Z"), items: [{ sku: "PD", qty: 1, price: 30 }] },
  { _id: 7, customerId: "c5", region: "north", status: "shipped", total: 110, placedAt: ISODate("2024-03-11T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "PD", qty: 2, price: 30 }], coupon: "SAVE10" },
  { _id: 8, customerId: "c3", region: "east", status: "delivered", total: 160, placedAt: ISODate("2024-03-19T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "CB", qty: 1, price: 10 }] },
  { _id: 9, customerId: "c1", region: "north", status: "pending", total: 50, placedAt: ISODate("2024-04-01T10:00:00Z"), items: [{ sku: "CB", qty: 5, price: 10 }] },
  { _id: 10, customerId: "c4", region: "west", status: "shipped", total: 60, placedAt: ISODate("2024-04-08T10:00:00Z"), items: [{ sku: "MS", qty: 3, price: 20 }] },
  { _id: 11, customerId: "c5", region: "north", status: "delivered", total: 170, placedAt: ISODate("2024-04-22T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "MS", qty: 1, price: 20 }] },
  { _id: 12, customerId: "c2", region: "south", status: "shipped", total: 120, placedAt: ISODate("2024-05-02T10:00:00Z"), items: [{ sku: "PD", qty: 4, price: 30 }] },
  { _id: 13, customerId: "c3", region: "east", status: "cancelled", total: 50, placedAt: ISODate("2024-05-13T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }] },
  { _id: 14, customerId: "c1", region: "north", status: "shipped", total: 320, placedAt: ISODate("2024-05-25T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }, { sku: "CB", qty: 2, price: 10 }], coupon: "SAVE10" },
  { _id: 15, customerId: "c4", region: "west", status: "delivered", total: 70, placedAt: ISODate("2024-06-04T10:00:00Z"), items: [{ sku: "MS", qty: 2, price: 20 }, { sku: "PD", qty: 1, price: 30 }] },
  { _id: 16, customerId: "c5", region: "north", status: "pending", total: 0, placedAt: ISODate("2024-06-15T10:00:00Z"), items: [] },
  { _id: 17, customerId: "c2", region: "south", status: "shipped", total: 150, placedAt: ISODate("2024-06-21T10:00:00Z"), items: [{ sku: "KB", qty: 3, price: 50 }] },
  { _id: 18, customerId: "c3", region: "east", status: "shipped", total: 0, placedAt: ISODate("2024-07-02T10:00:00Z") },
  { _id: 19, customerId: "c4", region: "west", status: "delivered", total: 100, placedAt: ISODate("2024-07-09T10:00:00Z"), items: [{ sku: "CB", qty: 10, price: 10 }], coupon: "SAVE10" },
  { _id: 20, customerId: "c1", region: "north", status: "delivered", total: 220, placedAt: ISODate("2024-07-18T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 1, price: 20 }] }
]);
db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $group: {
      _id: { $dateToString: { format: "%Y-%m", date: "$placedAt" } },
      orders: { $sum: 1 },
      revenue: { $sum: "$total" }
  } },
  { $sort: { _id: 1 } }
])

db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $group: {
      _id: { $dateTrunc: { date: "$placedAt", unit: "quarter" } },
      revenue: { $sum: "$total" }
  } },
  { $sort: { _id: 1 } }
])
print("========== EX 8: Join Orders to Customers with $lookup in Both Forms ==========")
db.customers.drop(); db.customers.insertMany([
  { _id: "c1", name: "Ana Vu", tier: "gold", city: "Hanoi" },
  { _id: "c2", name: "Bao Le", tier: "silver", city: "Da Nang" },
  { _id: "c3", name: "Chi Tran", tier: "gold", city: "Hue" },
  { _id: "c4", name: "Dat Pham", tier: "bronze", city: "Can Tho" },
  { _id: "c5", name: "En Ngo", tier: "silver", city: "Hai Phong" }
]);
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customerId: "c1", region: "north", status: "shipped", total: 90, placedAt: ISODate("2024-01-05T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 2, price: 20 }] },
  { _id: 2, customerId: "c2", region: "south", status: "pending", total: 150, placedAt: ISODate("2024-01-17T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }], coupon: "SAVE10" },
  { _id: 3, customerId: "c1", region: "north", status: "delivered", total: 20, placedAt: ISODate("2024-02-02T10:00:00Z"), items: [{ sku: "MS", qty: 1, price: 20 }] },
  { _id: 4, customerId: "c3", region: "east", status: "shipped", total: 130, placedAt: ISODate("2024-02-14T10:00:00Z"), items: [{ sku: "KB", qty: 2, price: 50 }, { sku: "CB", qty: 3, price: 10 }] },
  { _id: 5, customerId: "c4", region: "west", status: "cancelled", total: 300, placedAt: ISODate("2024-02-20T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }] },
  { _id: 6, customerId: "c2", region: "south", status: "delivered", total: 30, placedAt: ISODate("2024-03-03T10:00:00Z"), items: [{ sku: "PD", qty: 1, price: 30 }] },
  { _id: 7, customerId: "c5", region: "north", status: "shipped", total: 110, placedAt: ISODate("2024-03-11T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "PD", qty: 2, price: 30 }], coupon: "SAVE10" },
  { _id: 8, customerId: "c3", region: "east", status: "delivered", total: 160, placedAt: ISODate("2024-03-19T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "CB", qty: 1, price: 10 }] },
  { _id: 9, customerId: "c1", region: "north", status: "pending", total: 50, placedAt: ISODate("2024-04-01T10:00:00Z"), items: [{ sku: "CB", qty: 5, price: 10 }] },
  { _id: 10, customerId: "c4", region: "west", status: "shipped", total: 60, placedAt: ISODate("2024-04-08T10:00:00Z"), items: [{ sku: "MS", qty: 3, price: 20 }] },
  { _id: 11, customerId: "c5", region: "north", status: "delivered", total: 170, placedAt: ISODate("2024-04-22T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "MS", qty: 1, price: 20 }] },
  { _id: 12, customerId: "c2", region: "south", status: "shipped", total: 120, placedAt: ISODate("2024-05-02T10:00:00Z"), items: [{ sku: "PD", qty: 4, price: 30 }] },
  { _id: 13, customerId: "c3", region: "east", status: "cancelled", total: 50, placedAt: ISODate("2024-05-13T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }] },
  { _id: 14, customerId: "c1", region: "north", status: "shipped", total: 320, placedAt: ISODate("2024-05-25T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }, { sku: "CB", qty: 2, price: 10 }], coupon: "SAVE10" },
  { _id: 15, customerId: "c4", region: "west", status: "delivered", total: 70, placedAt: ISODate("2024-06-04T10:00:00Z"), items: [{ sku: "MS", qty: 2, price: 20 }, { sku: "PD", qty: 1, price: 30 }] },
  { _id: 16, customerId: "c5", region: "north", status: "pending", total: 0, placedAt: ISODate("2024-06-15T10:00:00Z"), items: [] },
  { _id: 17, customerId: "c2", region: "south", status: "shipped", total: 150, placedAt: ISODate("2024-06-21T10:00:00Z"), items: [{ sku: "KB", qty: 3, price: 50 }] },
  { _id: 18, customerId: "c3", region: "east", status: "shipped", total: 0, placedAt: ISODate("2024-07-02T10:00:00Z") },
  { _id: 19, customerId: "c4", region: "west", status: "delivered", total: 100, placedAt: ISODate("2024-07-09T10:00:00Z"), items: [{ sku: "CB", qty: 10, price: 10 }], coupon: "SAVE10" },
  { _id: 20, customerId: "c1", region: "north", status: "delivered", total: 220, placedAt: ISODate("2024-07-18T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 1, price: 20 }] }
]);
db.orders.aggregate([
  { $match: { _id: { $in: [1, 2] } } },
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "customer" } },
  { $unwind: "$customer" },
  { $project: { total: 1, name: "$customer.name", tier: "$customer.tier" } },
  { $sort: { _id: 1 } }
])

db.customers.aggregate([
  { $lookup: {
      from: "orders",
      let: { cid: "$_id" },
      pipeline: [
        { $match: { $expr: { $and: [
          { $eq: ["$customerId", "$$cid"] },
          { $gte: ["$total", 150] },
          { $ne: ["$status", "cancelled"] }
        ] } } },
        { $project: { total: 1 } },
        { $sort: { _id: 1 } }
      ],
      as: "bigOrders"
  } },
  { $project: { name: 1, bigOrders: 1 } },
  { $sort: { _id: 1 } }
])
print("========== EX 9: Build a Multi-Branch Dashboard with $facet, $bucket and $count ==========")
db.customers.drop(); db.customers.insertMany([
  { _id: "c1", name: "Ana Vu", tier: "gold", city: "Hanoi" },
  { _id: "c2", name: "Bao Le", tier: "silver", city: "Da Nang" },
  { _id: "c3", name: "Chi Tran", tier: "gold", city: "Hue" },
  { _id: "c4", name: "Dat Pham", tier: "bronze", city: "Can Tho" },
  { _id: "c5", name: "En Ngo", tier: "silver", city: "Hai Phong" }
]);
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customerId: "c1", region: "north", status: "shipped", total: 90, placedAt: ISODate("2024-01-05T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 2, price: 20 }] },
  { _id: 2, customerId: "c2", region: "south", status: "pending", total: 150, placedAt: ISODate("2024-01-17T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }], coupon: "SAVE10" },
  { _id: 3, customerId: "c1", region: "north", status: "delivered", total: 20, placedAt: ISODate("2024-02-02T10:00:00Z"), items: [{ sku: "MS", qty: 1, price: 20 }] },
  { _id: 4, customerId: "c3", region: "east", status: "shipped", total: 130, placedAt: ISODate("2024-02-14T10:00:00Z"), items: [{ sku: "KB", qty: 2, price: 50 }, { sku: "CB", qty: 3, price: 10 }] },
  { _id: 5, customerId: "c4", region: "west", status: "cancelled", total: 300, placedAt: ISODate("2024-02-20T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }] },
  { _id: 6, customerId: "c2", region: "south", status: "delivered", total: 30, placedAt: ISODate("2024-03-03T10:00:00Z"), items: [{ sku: "PD", qty: 1, price: 30 }] },
  { _id: 7, customerId: "c5", region: "north", status: "shipped", total: 110, placedAt: ISODate("2024-03-11T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "PD", qty: 2, price: 30 }], coupon: "SAVE10" },
  { _id: 8, customerId: "c3", region: "east", status: "delivered", total: 160, placedAt: ISODate("2024-03-19T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "CB", qty: 1, price: 10 }] },
  { _id: 9, customerId: "c1", region: "north", status: "pending", total: 50, placedAt: ISODate("2024-04-01T10:00:00Z"), items: [{ sku: "CB", qty: 5, price: 10 }] },
  { _id: 10, customerId: "c4", region: "west", status: "shipped", total: 60, placedAt: ISODate("2024-04-08T10:00:00Z"), items: [{ sku: "MS", qty: 3, price: 20 }] },
  { _id: 11, customerId: "c5", region: "north", status: "delivered", total: 170, placedAt: ISODate("2024-04-22T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "MS", qty: 1, price: 20 }] },
  { _id: 12, customerId: "c2", region: "south", status: "shipped", total: 120, placedAt: ISODate("2024-05-02T10:00:00Z"), items: [{ sku: "PD", qty: 4, price: 30 }] },
  { _id: 13, customerId: "c3", region: "east", status: "cancelled", total: 50, placedAt: ISODate("2024-05-13T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }] },
  { _id: 14, customerId: "c1", region: "north", status: "shipped", total: 320, placedAt: ISODate("2024-05-25T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }, { sku: "CB", qty: 2, price: 10 }], coupon: "SAVE10" },
  { _id: 15, customerId: "c4", region: "west", status: "delivered", total: 70, placedAt: ISODate("2024-06-04T10:00:00Z"), items: [{ sku: "MS", qty: 2, price: 20 }, { sku: "PD", qty: 1, price: 30 }] },
  { _id: 16, customerId: "c5", region: "north", status: "pending", total: 0, placedAt: ISODate("2024-06-15T10:00:00Z"), items: [] },
  { _id: 17, customerId: "c2", region: "south", status: "shipped", total: 150, placedAt: ISODate("2024-06-21T10:00:00Z"), items: [{ sku: "KB", qty: 3, price: 50 }] },
  { _id: 18, customerId: "c3", region: "east", status: "shipped", total: 0, placedAt: ISODate("2024-07-02T10:00:00Z") },
  { _id: 19, customerId: "c4", region: "west", status: "delivered", total: 100, placedAt: ISODate("2024-07-09T10:00:00Z"), items: [{ sku: "CB", qty: 10, price: 10 }], coupon: "SAVE10" },
  { _id: 20, customerId: "c1", region: "north", status: "delivered", total: 220, placedAt: ISODate("2024-07-18T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 1, price: 20 }] }
]);
db.orders.aggregate([
  { $facet: {
      byTotalBucket: [
        { $bucket: {
            groupBy: "$total",
            boundaries: [0, 50, 100, 200, 400],
            default: "other",
            output: { count: { $sum: 1 }, revenue: { $sum: "$total" } }
        } }
      ],
      byStatus: [
        { $group: { _id: "$status", n: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ],
      total: [
        { $count: "orders" }
      ]
  } }
])
print("========== EX 10: Materialise a Product Sales Report with $unwind, $group and $merge ==========")
db.customers.drop(); db.customers.insertMany([
  { _id: "c1", name: "Ana Vu", tier: "gold", city: "Hanoi" },
  { _id: "c2", name: "Bao Le", tier: "silver", city: "Da Nang" },
  { _id: "c3", name: "Chi Tran", tier: "gold", city: "Hue" },
  { _id: "c4", name: "Dat Pham", tier: "bronze", city: "Can Tho" },
  { _id: "c5", name: "En Ngo", tier: "silver", city: "Hai Phong" }
]);
db.orders.drop(); db.orders.insertMany([
  { _id: 1, customerId: "c1", region: "north", status: "shipped", total: 90, placedAt: ISODate("2024-01-05T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 2, price: 20 }] },
  { _id: 2, customerId: "c2", region: "south", status: "pending", total: 150, placedAt: ISODate("2024-01-17T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }], coupon: "SAVE10" },
  { _id: 3, customerId: "c1", region: "north", status: "delivered", total: 20, placedAt: ISODate("2024-02-02T10:00:00Z"), items: [{ sku: "MS", qty: 1, price: 20 }] },
  { _id: 4, customerId: "c3", region: "east", status: "shipped", total: 130, placedAt: ISODate("2024-02-14T10:00:00Z"), items: [{ sku: "KB", qty: 2, price: 50 }, { sku: "CB", qty: 3, price: 10 }] },
  { _id: 5, customerId: "c4", region: "west", status: "cancelled", total: 300, placedAt: ISODate("2024-02-20T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }] },
  { _id: 6, customerId: "c2", region: "south", status: "delivered", total: 30, placedAt: ISODate("2024-03-03T10:00:00Z"), items: [{ sku: "PD", qty: 1, price: 30 }] },
  { _id: 7, customerId: "c5", region: "north", status: "shipped", total: 110, placedAt: ISODate("2024-03-11T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }, { sku: "PD", qty: 2, price: 30 }], coupon: "SAVE10" },
  { _id: 8, customerId: "c3", region: "east", status: "delivered", total: 160, placedAt: ISODate("2024-03-19T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "CB", qty: 1, price: 10 }] },
  { _id: 9, customerId: "c1", region: "north", status: "pending", total: 50, placedAt: ISODate("2024-04-01T10:00:00Z"), items: [{ sku: "CB", qty: 5, price: 10 }] },
  { _id: 10, customerId: "c4", region: "west", status: "shipped", total: 60, placedAt: ISODate("2024-04-08T10:00:00Z"), items: [{ sku: "MS", qty: 3, price: 20 }] },
  { _id: 11, customerId: "c5", region: "north", status: "delivered", total: 170, placedAt: ISODate("2024-04-22T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "MS", qty: 1, price: 20 }] },
  { _id: 12, customerId: "c2", region: "south", status: "shipped", total: 120, placedAt: ISODate("2024-05-02T10:00:00Z"), items: [{ sku: "PD", qty: 4, price: 30 }] },
  { _id: 13, customerId: "c3", region: "east", status: "cancelled", total: 50, placedAt: ISODate("2024-05-13T10:00:00Z"), items: [{ sku: "KB", qty: 1, price: 50 }] },
  { _id: 14, customerId: "c1", region: "north", status: "shipped", total: 320, placedAt: ISODate("2024-05-25T10:00:00Z"), items: [{ sku: "MN", qty: 2, price: 150 }, { sku: "CB", qty: 2, price: 10 }], coupon: "SAVE10" },
  { _id: 15, customerId: "c4", region: "west", status: "delivered", total: 70, placedAt: ISODate("2024-06-04T10:00:00Z"), items: [{ sku: "MS", qty: 2, price: 20 }, { sku: "PD", qty: 1, price: 30 }] },
  { _id: 16, customerId: "c5", region: "north", status: "pending", total: 0, placedAt: ISODate("2024-06-15T10:00:00Z"), items: [] },
  { _id: 17, customerId: "c2", region: "south", status: "shipped", total: 150, placedAt: ISODate("2024-06-21T10:00:00Z"), items: [{ sku: "KB", qty: 3, price: 50 }] },
  { _id: 18, customerId: "c3", region: "east", status: "shipped", total: 0, placedAt: ISODate("2024-07-02T10:00:00Z") },
  { _id: 19, customerId: "c4", region: "west", status: "delivered", total: 100, placedAt: ISODate("2024-07-09T10:00:00Z"), items: [{ sku: "CB", qty: 10, price: 10 }], coupon: "SAVE10" },
  { _id: 20, customerId: "c1", region: "north", status: "delivered", total: 220, placedAt: ISODate("2024-07-18T10:00:00Z"), items: [{ sku: "MN", qty: 1, price: 150 }, { sku: "KB", qty: 1, price: 50 }, { sku: "MS", qty: 1, price: 20 }] }
]);
db.sku_summary.drop(); db.sku_summary.insertOne({ _id: "XX", unitsSold: 0, revenue: 0, orderCount: 0 });
db.sku_snapshot.drop();
db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $unwind: "$items" },
  { $group: {
      _id: "$items.sku",
      unitsSold: { $sum: "$items.qty" },
      revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
      orderIds: { $addToSet: "$_id" }
  } },
  { $addFields: { orderCount: { $size: "$orderIds" } } },
  { $project: { orderIds: 0 } },
  { $merge: { into: "sku_summary", whenMatched: "replace", whenNotMatched: "insert" } }
])
db.sku_summary.find().sort({ revenue: -1 }).toArray()

db.orders.aggregate([
  { $match: { status: { $ne: "cancelled" } } },
  { $unwind: "$items" },
  { $group: {
      _id: "$items.sku",
      unitsSold: { $sum: "$items.qty" },
      revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
      orderIds: { $addToSet: "$_id" }
  } },
  { $addFields: { orderCount: { $size: "$orderIds" } } },
  { $project: { orderIds: 0 } },
  { $out: "sku_snapshot" }
])
db.sku_snapshot.find().sort({ revenue: -1 }).toArray()
