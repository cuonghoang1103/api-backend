// doc-ghi.js — một tiến trình GHI lưu lại config.json liên tục, một tiến trình ĐỌC đọc nó liên tục (như app nạp lại
// cấu hình khi file đổi). Đếm số lần người đọc thấy file rỗng hoặc JSON hỏng.   node doc-ghi.js <inplace|rename> <số lần ghi>
const fs = require('fs');
const { fork } = require('child_process');
const file = '/tmp/config.json';

if (process.argv[2] === 'reader') {                 // ---- tiến trình đọc
  let reads = 0, empty = 0, broken = 0;
  const loop = () => {
    for (let i = 0; i < 200; i++) {
      reads++;
      let s;
      try { s = fs.readFileSync(file, 'utf8'); } catch { broken++; continue; }   // file không tồn tại cũng là hỏng
      if (s.length === 0) { empty++; continue; }
      try { JSON.parse(s); } catch { broken++; }
    }
    setImmediate(loop);
  };
  process.on('message', () => { process.send({ reads, empty, broken }); process.exit(0); });
  loop();
} else {                                            // ---- tiến trình ghi
  const [mode, n] = [process.argv[2], +process.argv[3]];
  const body = (i) => JSON.stringify({ version: i, features: Array.from({ length: 400 }, (_, k) => `flag-${k}`) });
  fs.writeFileSync(file, body(0));
  const reader = fork(__filename, ['reader']);
  setTimeout(() => {
    for (let i = 1; i <= n; i++) {
      if (mode === 'inplace') fs.writeFileSync(file, body(i));
      else { fs.writeFileSync(file + '.tmp', body(i)); fs.renameSync(file + '.tmp', file); }
    }
    reader.send('done');
    reader.on('message', (r) => console.log(`${mode}: ${n} writes, ${r.reads} reads, ${r.empty} empty, ${r.broken} broken JSON`));
  }, 300);
}
