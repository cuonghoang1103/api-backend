/**
 * HỒI QUY "khung nhập vẽ trùng" (0.3.0, ảnh iTerm2 của người dùng): chạy bản dựng THẬT trong
 * pseudo-terminal với lõi giả, đổi cỡ cửa sổ giữa chừng (hẹp lại ⇒ terminal reflow dòng cũ),
 * mở /language, /model, /effort, rồi dựng lại màn hình bằng xterm headless và ĐẾM: ô nhập
 * phải xuất hiện đúng MỘT lần — cả ở toàn màn hình lẫn chế độ in nối tiếp (đếm cả scrollback).
 * Bản 0.3.0 đếm được 3 ô nhập trên màn hình ngay sau lần thu hẹp đầu tiên.
 *
 * Cần: `npm run build` trước (đọc dist/), python3 (pty). Thiếu thì bỏ qua — chạy đủ: `npm run test:khung`.
 */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
// `CUONGMINI_DIST_THU`: thử một bản dựng khác (vd. bản cũ — để thấy test này BẮT được lỗi).
const dist = process.env.CUONGMINI_DIST_THU || path.join(goc, 'dist/cuongmini.mjs');
const coPython = process.platform !== 'win32' && spawnSync('python3', ['--version']).status === 0;
const boQua = !existsSync(dist) ? 'chưa dựng dist/ (npm run build)' : !coPython ? 'không có python3/pty' : false;

const O_NHAP = ['Ask or give a task', 'Hỏi hoặc giao việc', 'CuongMini is working', 'CuongMini đang làm'];
const R = '__resize__';
/** Lịch phím + đổi cỡ: menu ngôn ngữ ⇒ English, /model, /effort, thu hẹp, nới rộng, một lượt có sửa file. */
const LICH: Array<[number, string, (number | string)?, number?]> = [
  [2.2, '/language', 'Hỏi hoặc giao việc|Ask or give a task'], [2.5, '\r'], [3.2, '2'], [4.0, '/model'], [4.3, '\r'], [5.0, '\x1b'], [5.4, '/effort'], [5.7, '\r'], [6.3, '\x1b'],
  [6.8, R, 90, 30], [7.8, R, 140, 40], [8.6, 'sửa laEmail'], [8.9, '\r'], [10.4, '1', '1\\. (Có|Yes)'], [11.2, '1', '1\\. (Có|Yes)'], [12.6, R, 100, 28], [13.6, R, 120, 36],
];

let tam = '';
let may: Server | null = null;
let cong = 0;

before(async () => {
  if (boQua) return;
  tam = mkdtempSync(path.join(os.tmpdir(), 'ctw-khung-'));
  may = createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(req.url === '/api/v1/auth/refresh'
      ? { data: { userId: 7, username: 'thu', fullName: 'Thử', token: 'tk-thu' } }
      : { data: {} }));
  });
  await new Promise<void>((ok) => may!.listen(0, '127.0.0.1', ok));
  cong = (may.address() as { port: number }).port;
});

after(() => {
  may?.close();
  if (tam) rmSync(tam, { recursive: true, force: true });
});

async function chay(ten: string, coThem: string[]): Promise<{ su_kien: unknown[]; cols: number; rows: number }> {
  const home = path.join(tam, ten);
  mkdirSync(path.join(home, '.cuongmini'), { recursive: true });
  mkdirSync(path.join(tam, 'duan'), { recursive: true });
  writeFileSync(path.join(home, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'thu', fullName: 'Thử', token: 'tk-thu', luu: new Date().toISOString() }));
  const cauHinh = path.join(tam, `${ten}.json`);
  const ra = path.join(tam, `ghi-${ten}.json`);
  writeFileSync(cauHinh, JSON.stringify({
    cmd: [process.execPath, dist, ...coThem], cwd: path.join(tam, 'duan'), cols: 120, rows: 36, duration: 15.5, out: ra,
    env: {
      HOME: home, CUONGMINI_HOME: path.join(home, '.cuongmini'), CUONGTHAI_API_ORIGIN: `http://127.0.0.1:${cong}`,
      CUONGMINI_LOI: path.join(goc, 'thu/loiGia.cjs'), LOI_GIA_NHANH: '1', CUONGMINI_KHONG_KIEM_CAP_NHAT: '1', CUONGMINI_TIN_THU_MUC: '1', CUONGMINI_KHONG_MO_TRINH_DUYET: '1',
      TERM: 'xterm-256color', COLORTERM: 'truecolor', LANG: 'vi_VN.UTF-8', TERM_PROGRAM: '',
    },
    // Chạy trong CI: Ink thấy CI ⇒ tắt khung động, và CuongMini không bật toàn màn hình — bỏ đi để thử như terminal thật.
    bo_env: ['CI', 'GITHUB_ACTIONS', 'CONTINUOUS_INTEGRATION', 'BUILD_NUMBER', 'BUILD_ID', 'RUN_ID', 'TF_BUILD', 'GITLAB_CI'],
    keys: LICH,
  }));
  await new Promise<void>((ok, hong) => {
    const p = spawn('python3', [path.join(goc, 'thu/pty_chay.py'), cauHinh], { stdio: 'ignore' });
    p.on('exit', (m) => (m === 0 ? ok() : hong(new Error(`pty_chay thoát ${m}`))));
  });
  return JSON.parse(readFileSync(ra, 'utf8'));
}

test('khung nhập chỉ một bản sau /language, /model, /effort và đổi cỡ cửa sổ', { skip: boQua, timeout: 60_000 }, async () => {
  const { phatLai, demDong } = await import(path.join(goc, 'thu/phatLai.mjs')) as {
    phatLai: (g: unknown, t?: number) => Promise<{ manPhu: boolean; manHinh: string[]; tatCa: string[] }>;
    demDong: (d: string[], c: string[]) => number;
  };
  // Hai chế độ chạy song song cho nhanh.
  const [fs, noi] = await Promise.all([chay('fs', []), chay('noi', ['--no-fullscreen'])]);
  for (const t of [3.6, 6.0, 7.4, 8.4, 13.2, 15.4]) {
    const a = await phatLai(fs, t);
    assert.equal(a.manPhu, true, `toàn màn hình phải ở alternate screen (t=${t})`);
    assert.equal(demDong(a.manHinh, O_NHAP) <= 1, true, `toàn màn hình: ô nhập trùng ở t=${t}:\n${a.manHinh.join('\n')}`);
    const b = await phatLai(noi, t);
    assert.equal(b.manPhu, false);
    assert.equal(demDong(b.tatCa, O_NHAP) <= 1, true, `in nối tiếp: ô nhập trùng ở t=${t}:\n${b.tatCa.join('\n')}`);
    /* Đợt 4: đổi cỡ ở chế độ in nối tiếp KHÔNG còn `ESC[3J` (iTerm2 hỏi "clear scrollback?") ⇒ bảng ghi in lại
       để lại MỘT bản cũ trong scrollback — có chủ ý. Màn hình đang thấy vẫn phải chỉ một banner; ô nhập vẫn một bản
       kể cả scrollback (kiểm ở trên). Trước lần đổi cỡ đầu (t < 7) scrollback cũng chỉ một banner. */
    if (t < 7) assert.equal(demDong(b.tatCa, ['CuongMini CLI 0.']) <= 1, true, `in nối tiếp: banner trùng ở t=${t}`);
    else assert.equal(demDong(b.manHinh, ['CuongMini CLI 0.']) <= 1, true, `in nối tiếp: banner trùng trên màn hình ở t=${t}`);
  }
  // Lúc cuối (không menu, không thẻ duyệt): đúng MỘT ô nhập, và banner toàn màn hình đã sang tiếng Anh.
  const cuoiFs = await phatLai(fs);
  const cuoiNoi = await phatLai(noi);
  assert.equal(demDong(cuoiFs.manHinh, O_NHAP), 1, cuoiFs.manHinh.join('\n'));
  assert.equal(demDong(cuoiNoi.tatCa, O_NHAP), 1, cuoiNoi.tatCa.join('\n'));
  // Mọi dòng vẽ ra hẹp hơn số cột (cột cuối để trống ⇒ không bao giờ tự xuống dòng).
  for (const d of cuoiFs.manHinh) assert.ok(d.length < 120, `dòng chạm cột cuối: ${d}`);
});
