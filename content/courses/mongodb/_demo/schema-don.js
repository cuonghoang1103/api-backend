// Bài 1.3 — schema đơn hàng CT Shop dạng $jsonSchema. Nạp trong mongosh: load('/demo/schema-don.js') ⇒ có biến schemaDon.
schemaDon = { $jsonSchema: {
  bsonType: 'object',
  required: ['customerId', 'status', 'items', 'total', 'createdAt'],
  properties: {
    customerId: { bsonType: 'string', pattern: '^KH[0-9]{4}$' },
    status: { enum: ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'] },
    items: { bsonType: 'array', minItems: 1, items: {
      bsonType: 'object', required: ['productId', 'price', 'qty'],
      properties: { price: { bsonType: 'decimal' }, qty: { bsonType: 'int', minimum: 1 } } } },
    total: { bsonType: 'decimal', minimum: 0 },
    createdAt: { bsonType: 'date' },
  },
} };
