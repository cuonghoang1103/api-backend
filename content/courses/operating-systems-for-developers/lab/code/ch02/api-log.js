// api-log.js — API tí hon chạy dưới systemd: mỗi giây ghi một dòng truy cập; cứ 5 giây một lần "DB chậm" ghi lỗi.
// Dòng bắt đầu "<3>" = journald hiểu là mức err (SyslogLevelPrefix của systemd) ⇒ lọc được bằng journalctl -p err.
let n = 0;
console.log(`api started pid=${process.pid}`);
setInterval(() => {
  n++;
  console.log(`GET /api/v1/feed 200 ${12 + (n % 7)}ms`);
  if (n % 5 === 0) console.log(`<3>ERROR GET /api/v1/orders 500 db timeout after 3000ms (request ${n})`);
}, 1000);
