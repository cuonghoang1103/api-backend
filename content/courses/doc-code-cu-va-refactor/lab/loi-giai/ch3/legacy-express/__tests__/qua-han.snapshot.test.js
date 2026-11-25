// Golden master kiểu Jest: lần đầu GHI snapshot, các lần sau SO với nó.
const request = require('supertest');
const app = require('../app');

test('danh sách quá hạn', async () => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2026-11-24T10:00:00+07:00'));
  const res = await request(app).get('/api/phieu/qua-han');
  jest.useRealTimers();
  expect(res.body).toMatchSnapshot();
});
