/**
 * Phép kiểm cho CÂU BÁO LỖI của máy đọc máy nhà.
 *
 * Sinh ra từ một lỗi thật: mọi hỏng hóc đều ra cùng một câu "máy có thể đang
 * tắt", trong khi máy đang bật và thủ phạm là GPU hết VRAM. Câu báo sai không
 * làm hỏng tính năng — nó làm hỏng việc CHỮA tính năng, và đó là kiểu tốn thời
 * gian khó thấy nhất.
 */
import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import test, { after, before } from 'node:test';

let may: Server;
let traLoiHealth: { ma: number; than: string } = { ma: 200, than: '{"ok":true,"daNap":false}' };

before(async () => {
  may = createServer((req, res) => {
    if (req.url === '/health') {
      res.writeHead(traLoiHealth.ma, { 'content-type': 'application/json' });
      res.end(traLoiHealth.than);
      return;
    }
    res.writeHead(500); res.end('Internal Server Error');
  });
  await new Promise<void>((x) => may.listen(0, '127.0.0.1', x));
  const cong = (may.address() as { port: number }).port;
  process.env.F5_TTS_URL = `http://127.0.0.1:${cong}`;
});

after(() => { may.close(); });

test('máy nhà SỐNG nhưng chưa nạp được giọng ⇒ nói tới VRAM, KHÔNG nói máy tắt', async () => {
  const { vinaoF5Hong } = await import('./voiceMini.routes.js');
  traLoiHealth = { ma: 200, than: '{"ok":true,"daNap":false}' };
  const cau = await vinaoF5Hong(new Error('f5 HTTP 500'));
  assert.match(cau, /VRAM/i, 'phải nhắc tới VRAM — đó là nguyên nhân thật');
  assert.doesNotMatch(cau, /đang tắt/i, 'máy đang chạy mà lại bảo nó tắt');
});

test('máy nhà SỐNG và đã nạp giọng ⇒ báo lỗi đọc, vẫn KHÔNG đổ cho máy tắt', async () => {
  const { vinaoF5Hong } = await import('./voiceMini.routes.js');
  traLoiHealth = { ma: 200, than: '{"ok":true,"daNap":true}' };
  const cau = await vinaoF5Hong(new Error('f5 HTTP 500'));
  assert.doesNotMatch(cau, /đang tắt/i);
});

test('KHÔNG có phản hồi nào ⇒ MỚI được nói máy có thể đang tắt', async () => {
  const { vinaoF5Hong } = await import('./voiceMini.routes.js');
  // Lỗi mạng thật không mang chuỗi "HTTP <mã>".
  const cau = await vinaoF5Hong(new Error('fetch failed'));
  assert.match(cau, /đang tắt|đường hầm/i);
});

// ════════════════════════════════════════════════════════════════
// Ô CHẠY — sinh ra từ lỗi thật 09/09/2026: nút "Nghe" trong AI Chat của app
// iOS bấm mãi không đọc. Hai thủ phạm nằm ở đây, và cả hai đều IM LẶNG.
// ════════════════════════════════════════════════════════════════

test('người gọi đọc từ `userId` — KHÔNG phải `id` (trường đó không tồn tại)', async () => {
  const { aiDangGoi } = await import('./voiceMini.routes.js');
  // Đúng hình dạng `authenticate` gán: req.user = decoded (JwtPayload).
  const nhuThat = { user: { userId: 77, username: 'a', email: 'b', roles: [], roleVersion: 1 } };
  assert.equal(aiDangGoi(nhuThat as never), 77, 'bản cũ trả 0 cho MỌI người — cả web chung một xô');

  // req.userId cũng được gán, dùng làm đường dự phòng.
  assert.equal(aiDangGoi({ userId: 42 } as never), 42);
  // Không đăng nhập thì mới được là 0.
  assert.equal(aiDangGoi({} as never), 0);
});

test('ô bỏ dở TỰ RỤNG — không thì hai lần bỏ ngang là khoá chết máy đọc', async () => {
  const { ghiViec, demViecDangChay } = await import('./voiceMini.routes.js');
  const ai = 987654;
  const t0 = 1_000_000_000_000;

  // Hai việc bị bỏ ngang: app không bao giờ hỏi tới kết quả.
  ghiViec(ai, 'viec-a', t0);
  ghiViec(ai, 'viec-b', t0);
  assert.equal(demViecDangChay(ai, t0 + 1_000), 2, 'vừa đặt xong thì phải còn bận');

  // Đúng hành vi CŨ: mãi mãi là 2 ⇒ mọi lượt sau nhận 429 tới khi restart.
  assert.equal(demViecDangChay(ai, t0 + 2 * 60_000), 2, 'chưa quá hạn thì trần vẫn phải giữ');

  // Sau hạn 3 phút thì ô phải tự về.
  assert.equal(demViecDangChay(ai, t0 + 4 * 60_000), 0, 'ô quá hạn phải tự rụng');
});
