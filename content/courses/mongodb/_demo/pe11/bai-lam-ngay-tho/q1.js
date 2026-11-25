// Bài làm "ngây thơ" (mô phỏng lỗi hay gặp khi thi) — Q1
db.runCommand({ collMod: 've', validator: { $jsonSchema: {
  bsonType: 'object',
  required: ['khachId', 'suatId', 'ghe', 'tong', 'trangThai'],
  properties: {
    khachId: { bsonType: 'string' },
    ghe: { bsonType: 'array', minItems: 1 },
    tong: { bsonType: ['double', 'decimal', 'int'], minimum: 0 },
    trangThai: { enum: ['DA_THANH_TOAN', 'HUY'] },
  } } } });
