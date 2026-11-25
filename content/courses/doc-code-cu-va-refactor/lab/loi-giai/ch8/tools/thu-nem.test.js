// Người review hỏi: "nếu xuLy ném lỗi đồng bộ thì lượt sau có chạy không?"
const express = require('express');
const request = require('supertest');
const tuanTu = require(process.env.TUAN_TU);

test('lượt đầu ném lỗi đồng bộ ⇒ lượt sau vẫn được phục vụ', async () => {
  const app = express();
  let lan = 0;
  app.post('/x', tuanTu((req, res) => { lan++; if (lan === 1) throw new Error('loi dong bo'); res.status(201).end(); }));
  app.use((err, req, res, next) => res.status(500).end());
  const dau = await request(app).post('/x').timeout(1000).catch((e) => ({ status: 'treo: ' + e.code }));
  const sau = await request(app).post('/x').timeout(1000).catch((e) => ({ status: 'treo: ' + e.code }));
  expect([dau.status, sau.status]).toEqual([500, 201]);
});
