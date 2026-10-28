// build.js — một "bản build" giả: bộ nhớ leo dần lên đỉnh rồi trả lại, như next build (Chương 8).
//   node build.js <tên> <MB đỉnh>
// Dùng Buffer (bộ nhớ NGOÀI heap V8) nên --max-old-space-size không chặn nó — chỉ giới hạn của cgroup chặn được.
const [name = 'build', peak = '300'] = process.argv.slice(2);
const step = 16, held = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  console.log(`${name}: start (pid ${process.pid})`);
  for (let mb = step; mb <= +peak; mb += step) {
    held.push(Buffer.alloc(step << 20, 1));          // cấp + ghi 16 MB
    if (mb % 96 === 0) console.log(`${name}: ${mb} MB`);
    await sleep(40);
  }
  await sleep(1500);                                   // giữ đỉnh một lúc (giai đoạn "tối ưu trang")
  console.log(`${name}: done, peak ${peak} MB, rss ${Math.round(process.memoryUsage().rss / 1048576)} MB`);
})();
