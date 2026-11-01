// client/book.ts — bài 7.3: client CÓ KIỂU sinh từ openapi.yaml (openapi-typescript + openapi-fetch)
import createClient from 'openapi-fetch';
import type { paths } from './labflow.d.ts';

const api = createClient<paths>({ baseUrl: 'http://localhost:4000/v2' });

const login = await api.POST('/auth/login', {
  body: { email: 'an@student.labflow.example', password: 'an-lab-2026' },
});
if (!login.data) throw new Error(login.error.detail);
const auth = { Authorization: `Bearer ${login.data.accessToken}` };

const { data, error, response } = await api.POST('/bookings', {
  headers: auth,
  body: { labId: 'lab_2', period: { start: '2027-03-03T13:00:00+07:00', end: '2027-03-03T15:00:00+07:00' } },
});
if (error) console.log(response.status, error.code, error.detail);
else console.log(response.status, data.id, data.status, data.period.start, response.headers.get('location'));
