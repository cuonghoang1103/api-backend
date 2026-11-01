// mistakes/book-wrong.ts — ba lỗi hay gặp khi gọi API bằng tay; với client có kiểu, tsc bắt TRƯỚC khi chạy
import createClient from 'openapi-fetch';
import type { paths } from '../client/labflow.d.ts';

const api = createClient<paths>({ baseUrl: 'http://localhost:4000/v2' });

const { data } = await api.POST('/bookings', {
  body: { labID: 'lab_2', period: { start: '2027-03-03T13:00:00+07:00', end: '2027-03-03T15:00:00+07:00' } },
});
if (data) {
  console.log(data.purpose.length);                 // purpose có thể là null
  if (data.status === 'CONFIRMED') console.log('ok'); // không có trạng thái này
}
await api.GET('/bookings/{id}', {});               // quên tham số đường dẫn id
