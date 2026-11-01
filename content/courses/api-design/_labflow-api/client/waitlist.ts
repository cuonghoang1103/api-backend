// client/waitlist.ts — Lab 7: client viết TRƯỚC khi server có hàng chờ (chạy với mock Prism, rồi với server thật)
import createClient from 'openapi-fetch';
import type { paths } from './labflow.d.ts';

const baseUrl = process.env.BASE ?? 'http://localhost:4000/v2';
const api = createClient<paths>({ baseUrl });
const token = process.env.TOKEN ?? 'mock-token';

const { data, error, response } = await api.POST('/labs/{labId}/waitlist', {
  params: { path: { labId: 'lab_2' } },
  headers: { Authorization: `Bearer ${token}` },
  body: { period: { start: '2027-03-09T08:00:00+07:00', end: '2027-03-09T10:00:00+07:00' } },
});
if (error) console.log(response.status, error.code);
else console.log(response.status, data.id, data.status, `vị trí ${data.position}`, response.headers.get('location'));
