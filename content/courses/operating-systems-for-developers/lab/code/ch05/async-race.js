// async-race.js — Node MỘT luồng vẫn có race: kiểm-rồi-làm vắt qua một await.
// Hai yêu cầu đặt cùng ghế cuối; "db" giả trả lời sau 20 ms như một truy vấn thật.
//   node async-race.js        không khoá           node async-race.js lock   khoá trong tiến trình (chuỗi Promise)
const db = { seatsLeft: 1, bookings: [] };
const query = (fn) => new Promise((r) => setTimeout(() => r(fn()), 20));

let tail = Promise.resolve();                       // mutex tí hon: mỗi việc xếp sau việc trước
const withLock = (fn) => { const run = tail.then(fn); tail = run.catch(() => {}); return run; };

async function book(user) {
  const left = await query(() => db.seatsLeft);        // 1) đọc
  if (left <= 0) return `${user}: sold out`;
  await query(() => { db.seatsLeft = left - 1; db.bookings.push(user); }); // 2) ghi
  return `${user}: booked ✔`;
}

(async () => {
  const useLock = process.argv[2] === 'lock';
  const go = (u) => (useLock ? withLock(() => book(u)) : book(u));
  const r = await Promise.all([go('alice'), go('bob')]);
  console.log(r.join('\n'));
  console.log('seatsLeft =', db.seatsLeft, ' bookings =', db.bookings);
})();
