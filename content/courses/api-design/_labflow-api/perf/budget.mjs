// perf/budget.mjs — bài 8.4: SLO đổi ra thời gian được phép hỏng, và vì sao nối tiếp nhiều phụ thuộc làm tụt tính sẵn sàng
const MIN_30D = 30 * 24 * 60;
const fmt = (m) => (m >= 60 ? `${(m / 60).toFixed(1)} giờ` : m >= 1 ? `${m.toFixed(1)} phút` : `${(m * 60).toFixed(0)} giây`);
console.log('SLO       hỏng tối đa / 30 ngày   / tuần        lỗi được phép trên 1 triệu request');
for (const slo of [99, 99.5, 99.9, 99.95, 99.99]) {
  const bad = 1 - slo / 100;
  console.log(`${String(slo).padEnd(8)}  ${fmt(MIN_30D * bad).padEnd(22)}  ${fmt(7 * 24 * 60 * bad).padEnd(12)}  ${Math.round(1e6 * bad)}`);
}
// Một request đặt phòng phải qua: load balancer → LabFlow → PostgreSQL → dịch vụ email (gửi xác nhận, nếu làm ĐỒNG BỘ)
const chain = [['load balancer', 99.99], ['LabFlow (2 bản)', 99.95], ['PostgreSQL', 99.95], ['email provider', 99.9]];
let all = 1;
for (const [, a] of chain) all *= a / 100;
console.log(`\nNối tiếp ${chain.map(([n, a]) => `${n} ${a}%`).join(' × ')}`);
console.log(`  = ${(all * 100).toFixed(3)}%  ⇒ ${fmt(MIN_30D * (1 - all))} hỏng mỗi 30 ngày — thấp hơn MỌI thành phần`);
const noEmail = chain.slice(0, 3).reduce((p, [, a]) => p * a / 100, 1);
console.log(`Bỏ email ra khỏi đường đồng bộ (gửi sau qua hàng đợi): ${(noEmail * 100).toFixed(3)}% ⇒ ${fmt(MIN_30D * (1 - noEmail))}`);
