// an-ram.js — mỗi 100 ms giữ thêm 8 MB cho tới khi bị giết (minh hoạ OOM trong container có -m).
const giu = [];
setInterval(() => {
  giu.push(Buffer.alloc(8 * 1024 * 1024, 1));
  console.log(`held ${giu.length * 8} MB`);
}, 100);
