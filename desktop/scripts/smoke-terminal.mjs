/**
 * Smoke TERMINAL THẬT — chạy trong ELECTRON thật, bản dựng thật (26/09/2026).
 *
 * Kiểm đúng đoạn dây typecheck không thấy được: PTY nạp được trong tiến trình
 * main của Electron (module native ngoài bundle), IPC `pty:*` qua preload, và
 * byte về renderer bằng sự kiện `pty:du`. Và kịch bản cả tính năng sinh ra để
 * làm: một lệnh HỎI MẬT KHẨU, người dùng gõ vào, lệnh chạy tiếp.
 *
 * Chạy: npm run build && node scripts/smoke-terminal.mjs
 * Dùng userData TẠM ⇒ không đụng cấu hình/phiên đăng nhập thật.
 */
import { _electron as electron } from 'playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'ct-smoke-term-'));
let loi = 0;
const check = (ten, ok, chiTiet = '') => { console.log(`${ok ? '  ✓' : '  ✗'} ${ten}${!ok && chiTiet ? `\n      ${chiTiet}` : ''}`); if (!ok) loi++; };

const app = await electron.launch({
  args: [`--user-data-dir=${userData}`, path.join(root, 'dist/main/index.cjs')],
  env: { ...process.env, CT_RENDERER: 'bundle' },
});
try {
  let w = null;
  for (let i = 0; i < 50 && !w; i++) {
    for (const p of app.windows()) if (!p.url().endsWith('/robot.html')) w = p;
    if (!w) await new Promise((r) => setTimeout(r, 200));
  }
  await w.waitForLoadState('domcontentloaded');

  const may = await w.evaluate(() => globalThis.cuongthai.pty.mayCo());
  check('PTY nạp được trong Electron (không lùi về chế độ ống)', may.co === true, JSON.stringify(may));

  const kq = await w.evaluate(async () => {
    const c = globalThis.cuongthai;
    const cuocId = await c.agent.taoCuoc();
    let ra = '';
    const trangThai = [];
    c.on('pty:du', (e) => { ra += e.du; });
    c.on('pty:trangThai', (e) => trangThai.push(e));
    const cho = (dk, ms = 10000) => new Promise((ok) => {
      const t0 = Date.now();
      const h = setInterval(() => { if (dk() || Date.now() - t0 > ms) { clearInterval(h); ok(dk()); } }, 50);
    });
    const mo = await c.pty.mo(cuocId, 100, 30);
    if (!mo.ok) return { mo };
    const id = mo.phien.id;
    await cho(() => ra.length > 0);
    const isWin = navigator.userAgent.includes('Windows');
    await c.pty.gui(id, isWin ? 'echo XIN-CHAO-PTY\r' : 'echo XIN-CHAO-PTY; tty\r');
    const coEcho = await cho(() => /XIN-CHAO-PTY\r?\n/.test(ra.replace(/\x1b\[[0-9;?]*[a-zA-Z]/g, '')));
    let coMatKhau = null;
    if (!isWin) {
      await c.pty.gui(id, `bash -c 'read -s -p "Password: " x; echo; echo "NHAN:$x"'\r`);
      await cho(() => ra.includes('Password:'));
      await c.pty.gui(id, 'mat-khau-thu\r');
      coMatKhau = await cho(() => ra.includes('NHAN:mat-khau-thu'));
    }
    const ds = await c.pty.ds(cuocId);
    const tho = await c.pty.demTho(id);
    await c.pty.dong(id);
    const dsSau = await c.pty.ds(cuocId);
    return { mo: { ok: mo.ok, pty: mo.phien.pty }, coEcho, coTty: /\/dev\/(tty|pts)/.test(ra), coMatKhau, soPhien: ds.length, thoDai: tho.length, soSau: dsSau.length, soTrangThai: trangThai.length };
  });
  check('mở được terminal qua IPC pty:mo', kq.mo?.ok === true, JSON.stringify(kq.mo));
  check('phiên là PTY thật', kq.mo?.pty === true);
  check('gõ lệnh → byte về renderer qua sự kiện pty:du', kq.coEcho === true);
  if (process.platform !== 'win32') {
    check('có /dev/tty thật (ssh/sudo sẽ hỏi được)', kq.coTty === true);
    check('lệnh HỎI MẬT KHẨU: gõ vào → lệnh chạy tiếp', kq.coMatKhau === true);
  }
  check('pty:ds thấy phiên, pty:demTho có đệm', kq.soPhien === 1 && kq.thoDai > 0);
  check('pty:dong đóng và dọn phiên', kq.soSau === 0);
  check('có sự kiện pty:trangThai (mở/đóng)', kq.soTrangThai >= 2);
} finally {
  await app.close().catch(() => {});
  fs.rmSync(userData, { recursive: true, force: true });
}
console.log(loi ? `\n✗ ${loi} phép kiểm hỏng` : '\n✓ Terminal thật chạy trong Electron');
process.exit(loi ? 1 : 0);
