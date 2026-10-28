// threads.js — Node có bao nhiêu luồng, trước và sau lần ĐẦU dùng fs (pool libuv chỉ khởi động khi cần).
const fs = require('node:fs');
const count = () => fs.readdirSync('/proc/self/task').length;
console.log('threads at start:', count());
fs.readFile('/etc/hostname', () => console.log('threads after first fs.readFile:', count()));
