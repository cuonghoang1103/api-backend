// pool.js — 8 lệnh crypto.pbkdf2 BẤT ĐỒNG BỘ cùng lúc. Chúng không chạy trên luồng JS mà trên thread pool của libuv
// (mặc định 4 luồng, đổi bằng UV_THREADPOOL_SIZE). In lúc từng việc xong + số luồng của tiến trình.
const crypto = require('crypto');
const fs = require('fs');
const threads = () => fs.readFileSync('/proc/self/status', 'utf8').match(/Threads:\s+(\d+)/)[1];
console.log(`UV_THREADPOOL_SIZE=${process.env.UV_THREADPOOL_SIZE || '(default)'}  threads before: ${threads()}`);
const t0 = Date.now();
const done = [];
for (let i = 1; i <= 8; i++)
  crypto.pbkdf2('secret', 'salt', 300000, 64, 'sha512', () => {
    done.push(`#${i}@${Date.now() - t0}ms`);
    if (done.length === 8) {
      console.log('finished:', done.join(' '));
      console.log('threads after:', threads(), '| names:', [...new Set(fs.readdirSync('/proc/self/task')
        .map((t) => fs.readFileSync(`/proc/self/task/${t}/comm`, 'utf8').trim()))].join(', '));
    }
  });
