// fake-next.js — giả lập "next start": giống Next.js thật, nó ĐỔI TÊN tiến trình thành "next-server (v…)" ngay khi chạy.
// Hệ quả (sự cố 30/07/2026 của dự án): pkill -f "next start" / "standalone/server.js" không còn khớp ⇒ server cũ sống tiếp.
process.title = 'next-server (v14.2.15)';
require('http').createServer((q, s) => s.end('next ok\n')).listen(3000, () => console.log(`ready on :3000 pid=${process.pid}`));
