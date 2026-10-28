// k6-open.js — k6 với executor constant-arrival-rate: request được LÊN LỊCH 100/giây, máy chủ chậm thì k6 mở thêm VU
// để vẫn gửi đúng giờ (vòng MỞ) ⇒ không bị coordinated omission (bài 15.6).   k6 run k6-open.js
import http from 'k6/http';
export const options = {
  scenarios: { open: { executor: 'constant-arrival-rate', rate: 100, timeUnit: '1s', duration: '8s', preAllocatedVUs: 50, maxVUs: 200 } },
  summaryTrendStats: ['p(50)', 'p(95)', 'p(99)', 'max'],
};
export default function () { http.get('http://127.0.0.1:8090/'); }
