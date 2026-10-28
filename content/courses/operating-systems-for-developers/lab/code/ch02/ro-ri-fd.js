// ro-ri-fd.js — API ghi "nhật ký kiểm toán": mỗi request MỞ file để ghi nhưng không bao giờ đóng ⇒ rò rỉ file descriptor.
// Tới trần "open files" (ulimit -n) thì mọi thứ cần fd mới đều hỏng: mở file, NHẬN KẾT NỐI MỚI, mở socket tới DB.
const http = require('http'), fs = require('fs');
let n = 0;
http.createServer((req, res) => {
  if (req.url === '/health') return res.end('ok\n');          // health KHÔNG mở file nào
  try {
    const fd = fs.openSync(`/tmp/audit-${n++ % 5}.log`, 'a');   // ❌ thiếu fs.closeSync(fd)
    fs.writeSync(fd, `${Date.now()} ${req.url}\n`);
    if (process.env.FIX) fs.closeSync(fd);                       // ✅ bản sửa: đóng fd sau khi ghi
    res.end('ok\n');
  } catch (e) { res.statusCode = 500; res.end(`${e.code}: ${e.message}\n`); }
}).listen(3002, () => console.log(`audit api on :3002 pid=${process.pid}`));
