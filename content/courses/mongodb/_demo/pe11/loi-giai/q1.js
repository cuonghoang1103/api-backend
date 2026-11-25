// Q1 (1,5 điểm) — validator cho collection ve. Chạy một lần; chạy lại vẫn đúng (collMod).
db.runCommand({
  collMod: 've',
  validator: { $jsonSchema: {
    bsonType: 'object',
    required: ['khachId', 'suatId', 'ghe', 'tong', 'trangThai', 'taoLuc'],
    properties: {
      khachId: { bsonType: 'string', pattern: '^K[0-9]{4}$' },
      suatId: { bsonType: 'string' },
      ghe: { bsonType: 'array', minItems: 1, maxItems: 8, uniqueItems: true, items: { bsonType: 'string', pattern: '^[A-H]([1-9]|10)$' } },
      tong: { bsonType: 'decimal', minimum: NumberDecimal('0') },
      trangThai: { enum: ['DA_THANH_TOAN', 'HUY'] },
      taoLuc: { bsonType: 'date' },
    },
  } },
  validationLevel: 'strict',
  validationAction: 'error',
});
