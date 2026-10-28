// build.js — giả lập "next build": vừa dịch module vừa giữ AST/bundle trong heap V8, bộ nhớ tăng dần tới đích (MB) rồi xong.
// Chạy: node --max-old-space-size=4096 build.js 700 [tên] [giữ-giây]  (Next đặt trần heap cao như vậy cho build lớn)
const target = Number(process.argv[2] || 700), name = process.argv[3] || 'build', hold = Number(process.argv[4] || 0);
const keep = []; let mb = 0;
const step = () => {
  for (let i = 0; i < 4; i++) { keep.push(new Array(262144).fill(mb + i)); }   // 4 × ~2 MB trên heap V8
  mb += 8;
  if (mb % 200 === 0) console.log(`[${name}] compiled ${mb / 8 * 25} modules, rss=${Math.round(process.memoryUsage().rss / 1048576)} MB`);
  if (mb >= target) { console.log(`[${name}] ✓ build done`); if (hold) setTimeout(() => keep.length, hold * 1000); return; }
  setTimeout(step, 15);
};
step();
