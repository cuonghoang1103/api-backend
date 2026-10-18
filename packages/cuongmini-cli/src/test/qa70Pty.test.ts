/**
 * QA đợt 7 (19/10/2026) — PTY THẬT + LÕI THẬT + máy chủ GIẢ:
 *   1. 🟠 Yêu cầu gia hạn được duyệt MUỘN (kiểm lại định kỳ) SAU KHI người dùng đã hỏi câu khác ⇒ CLI chỉ BÁO, KHÔNG tự
 *      gửi lại hội thoại (trước đây: lượt "Tiếp tục đúng từ chỗ đang dừng" tự chạy, bằng model vừa đổi sang, tốn tiền).
 *   2. Duyệt khi hội thoại CHƯA đi tiếp ⇒ vẫn tự làm tiếp như thiết kế. Lần chặn này đi đường HTTP 429 (hạn mức NHÓM,
 *      `data.giaHanTien`) thay vì khung SSE — thẻ vẫn hiện, mã gửi đúng trần `nhom:<pid>`.
 *   3. `/ket-noi figma`: ô nhập ẨN ký tự, nhãn "Token" (không phải "Mật khẩu"); Esc ⇒ không lưu, token không lên màn hình
 *      / đĩa; `status` / `off` không gọi mạng.
 *   4. `/browser mode <bậy>` ⇒ hướng dẫn; `/browser mode ngam` ⇒ lưu cài đặt, không mở cửa sổ nào.
 * Nhịp kiểm lại rút xuống 1,5 s bằng `CUONGMINI_NHIP_GIA_HAN_MS` (chỉ cho test).
 */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dist = path.join(goc, 'dist/cuongmini.mjs');
const loi = path.join(goc, 'dist/loi.cjs');
const coPython = process.platform !== 'win32' && spawnSync('python3', ['--version']).status === 0;
const boQua = !existsSync(dist) || !existsSync(loi) ? 'chưa dựng dist/ (npm run build)' : !coPython ? 'không có python3/pty' : false;

const MA = 'MA-QA70-gia-lap-55';
const TOKEN_FIGMA = 'gia-lap-figma-qa70-khong-phai-token-0001';
let tam = '';
let may: Server | null = null;
let cong = 0;
const ghi = { turn: [] as Array<Record<string, any>>, nhap: 0, kiem: [] as string[], khac: [] as string[], tran: [] as string[] };
const duyet = new Set<string>();

const G = (o: Record<string, unknown> = {}) => ({
  tran: 'model:cm-solid', ky: 'ngay', ten: 'CuongMini Solid · hôm nay', tenEn: 'CuongMini Solid · today', mucUsd: 3, daDungUsd: 6.1, tranUsd: 6,
  canDuyet: true, dangCho: null, lanThu: 2, duongDan: 'https://cuongthai.com/cuongmini/gia-han', ...o,
});
function json(res: import('node:http').ServerResponse, ma: number, v: unknown): void {
  res.writeHead(ma, { 'content-type': 'application/json' });
  res.end(JSON.stringify(v));
}
function sse(res: import('node:http').ServerResponse, khung: unknown[]): void {
  res.writeHead(200, { 'content-type': 'text/event-stream' });
  res.end(khung.map((k) => `data: ${JSON.stringify(k)}\n\n`).join(''));
}
const xong = (chu: string) => [{ type: 'start', model: 'gia' }, { type: 'text', delta: chu },
  { type: 'done', append: [{ role: 'assistant', content: chu }], stop: 'end', usage: { inputTokens: 10, outputTokens: 5, costUsd: 0.001 }, quota: null }];
const chan = (g: Record<string, unknown>) => [{ type: 'error', code: 'CUONGMINI_HET_TRAN', error: 'Bạn đã dùng hết hạn mức CuongMini Solid hôm nay.', giaHanTien: g }];

before(async () => {
  if (boQua) return;
  tam = mkdtempSync(path.join(os.tmpdir(), 'cm-qa70-pty-'));
  may = createServer((req, res) => {
    let than = '';
    req.on('data', (c) => { than += c; });
    req.on('end', () => {
      const url = req.url ?? '';
      if (url === '/api/v1/auth/refresh') return json(res, 200, { data: { userId: 7, username: 'an', fullName: 'An', token: 'tk-thu' } });
      if (url === '/api/v1/agent/turn') {
        const b = JSON.parse(than) as Record<string, any>;
        ghi.turn.push(b);
        const n = ghi.turn.length;
        /* 1: chặn (lần 2 ⇒ chờ #42) · 2: "việc D" bình thường · 3: chặn (lần 3 ⇒ chờ #43) · 4: làm tiếp sau duyệt #43 */
        if (n === 1) return sse(res, chan(G()));
        /* Lượt 3: hạn mức NHÓM chặn ở cửa route ⇒ HTTP 429 (không phải khung SSE) — `data.giaHanTien` phải tới được thẻ. */
        if (n === 3) {
          return json(res, 429, { success: false, code: 'NHOM_HET_TRAN', message: 'Bạn đã dùng hết hạn mức nhóm LF hôm nay (5.1 $/5 $).',
            data: { giaHanTien: G({ tran: 'nhom:5', ten: 'Hạn mức nhóm LF · hôm nay', tenEn: 'Team LF allowance · today', mucUsd: 5, daDungUsd: 5.1, tranUsd: 5, lanThu: 3 }) } });
        }
        return sse(res, xong(n === 2 ? 'Đã trả lời việc D.' : `Lượt ${n} trả lời.`));
      }
      if (url === '/api/v1/agent/gia-han-tien' && req.method === 'POST') {
        const b = JSON.parse(than) as { ma?: string; tran?: string };
        ghi.tran.push(String(b.tran));
        if (b.ma !== MA) return json(res, 403, { success: false, code: 'GIA_HAN_MA_SAI', message: 'Mã sai.' });
        ghi.nhap += 1;
        return json(res, 202, { success: true, data: { ketQua: 'choDuyet', id: 41 + ghi.nhap, soUsd: 3, lanThu: 1 + ghi.nhap, moi: true } });
      }
      const m = /^\/api\/v1\/agent\/gia-han-tien\/yeu-cau\/(\d+)$/.exec(url);
      if (m) {
        ghi.kiem.push(m[1]!);
        /* #42 chỉ được duyệt SAU khi người dùng đã hỏi "việc D" (lượt 2 xong) — đúng ca "duyệt muộn". */
        if (m[1] === '42' && ghi.turn.length >= 2) duyet.add('42');
        if (m[1] === '43') duyet.add('43');
        return json(res, 200, { success: true, data: { id: Number(m[1]), trangThai: duyet.has(m[1]!) ? 'DA_CAP' : 'CHO_DUYET', soUsd: 3, lanThu: 2, lyDoTuChoi: null } });
      }
      ghi.khac.push(`${req.method} ${url}`);
      return json(res, 200, { data: {} });
    });
  });
  await new Promise<void>((ok) => may!.listen(0, '127.0.0.1', ok));
  cong = (may.address() as { port: number }).port;
});
after(() => { may?.close(); if (tam) rmSync(tam, { recursive: true, force: true }); });

async function chay(cwd: string, home: string, phim: Array<[number, string] | [number, string, string]>, giayChay: number): Promise<unknown> {
  const cauHinh = path.join(tam, `pty-${Date.now()}.json`);
  const ra = path.join(tam, `ghi-${Date.now()}.json`);
  writeFileSync(cauHinh, JSON.stringify({
    cmd: [process.execPath, dist], cwd, cols: 120, rows: 42, duration: giayChay, out: ra,
    env: {
      HOME: home, CUONGMINI_HOME: path.join(home, '.cuongmini'), CUONGTHAI_API_ORIGIN: `http://127.0.0.1:${cong}`,
      CUONGMINI_KHONG_KIEM_CAP_NHAT: '1', CUONGMINI_KHONG_MO_TRINH_DUYET: '1', CUONGMINI_KHONG_DAT_TIEU_DE: '1', CUONGMINI_TIN_THU_MUC: '1',
      CUONGMINI_CTW_TRE_MS: '600000', CUONGMINI_NHIP_GIA_HAN_MS: '1500',
      TERM: 'xterm-256color', LANG: 'vi_VN.UTF-8', TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.10', CUONGMINI_NGON_NGU: 'vi',
    },
    bo_env: ['CI', 'GITHUB_ACTIONS', 'CONTINUOUS_INTEGRATION', 'BUILD_NUMBER', 'BUILD_ID', 'RUN_ID', 'TF_BUILD', 'GITLAB_CI', 'CTWORK_TOKEN', 'CUONGMINI_LOI', 'FIGMA_TOKEN', 'CUONGMINI_TRINH_DUYET_CHE_DO'],
    keys: phim,
  }));
  await new Promise<void>((ok, hong) => {
    const p = spawn('python3', [path.join(goc, 'thu/pty_chay.py'), cauHinh], { stdio: 'ignore' });
    p.on('exit', (m) => (m === 0 ? ok() : hong(new Error(`pty_chay thoát ${m}`))));
  });
  return JSON.parse(readFileSync(ra, 'utf8'));
}

function docHet(thuMuc: string): string {
  if (!existsSync(thuMuc)) return '';
  let ra = '';
  for (const t of readdirSync(thuMuc)) {
    const p = path.join(thuMuc, t);
    ra += statSync(p).isDirectory() ? docHet(p) : readFileSync(p).toString('utf8');
  }
  return ra;
}

test('PTY: duyệt MUỘN sau khi đã hỏi câu khác ⇒ chỉ báo, không tự gửi lại; duyệt khi chưa đi tiếp ⇒ tự làm tiếp; /ket-noi figma ẩn + không lưu khi Esc; /browser mode', { skip: boQua, timeout: 150_000 }, async () => {
  const { phatLai } = await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: (g: unknown, t?: number) => Promise<{ manHinh: string[]; tatCa: string[] }> };
  const home = path.join(tam, 'home');
  const duAn = path.join(tam, 'du-an');
  mkdirSync(path.join(home, '.cuongmini'), { recursive: true });
  mkdirSync(duAn, { recursive: true });
  writeFileSync(path.join(home, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'an', fullName: 'An', token: 'tk-thu', luu: new Date().toISOString() }));

  const g = await chay(duAn, home, [
    [2.0, 'việc C', 'Hỏi hoặc giao việc'], [2.4, '\r'],
    [5.0, MA, 'Lần 2 trong kỳ'], [5.6, '\r'],
    [8.0, 'việc D', 'chờ admin duyệt'], [8.4, '\r'],
    // Đợi vài nhịp kiểm lại (1,5 s) — #42 được duyệt sau lượt "việc D".
    [16.0, 'việc E', 'Gửi lại câu hỏi khi cần'], [16.4, '\r'],
    [19.0, MA, 'Hạn mức nhóm LF'], [19.6, '\r'],
    // #43 duyệt ngay ở lần kiểm đầu ⇒ hội thoại CHƯA đi tiếp ⇒ tự làm tiếp (lượt 4).
    [27.0, '/ket-noi figma', 'Lượt 4 trả lời'], [27.5, '\r'],
    [30.0, TOKEN_FIGMA, 'Kết nối Figma'], [30.8, '\u001b'],
    [33.0, '/ket-noi figma status'], [33.5, '\r'],
    [36.0, '/browser mode bay-ba'], [36.5, '\r'],
    [39.0, '/browser mode ngam'], [39.5, '\r'],
  ], 44);
  const man = async (t: number) => (await phatLai(g, t)).manHinh;
  const co = (m: string[], s: string | RegExp) => m.some((d) => (typeof s === 'string' ? d.includes(s) : s.test(d)));
  const xem = (m: string[]) => m.join('\n');
  if (process.env.CUONGMINI_PTY_IN === '1') for (const t of [7.9, 15.9, 18.9, 26.9, 30.6, 32.9, 35.9, 38.9, 43.5]) console.log(`\n──── t=${t}s ────\n${xem(await man(t))}`);

  // 1. Duyệt muộn ⇒ chỉ báo.
  const m1 = await man(15.9);
  assert.ok(co(m1, /Đã trả lời việc D/), xem(m1));
  assert.ok(co(m1, /Admin đã duyệt yêu cầu gia hạn #42: \+3 \$\. Gửi lại câu hỏi khi cần dùng tiếp\./), `chỉ báo:\n${xem(m1)}`);
  const sauD = ghi.turn.filter((b) => JSON.stringify(b.messages).includes('việc D')).length;
  assert.equal(ghi.turn.length >= 2, true);
  assert.ok(ghi.turn.slice(2).every((b) => JSON.stringify(b.messages.at(-1)).includes('việc E') || ghi.turn.indexOf(b) >= 3), 'không có lượt tự chạy sau khi #42 duyệt');
  assert.ok(sauD >= 1);

  // 2. Duyệt khi chưa đi tiếp ⇒ tự làm tiếp (lượt 4, không thêm câu hỏi).
  const m2b = await man(18.9);
  assert.ok(co(m2b, /Đã chạm giới hạn Hạn mức nhóm LF · hôm nay · Nhập mã gia hạn để dùng tiếp/), `thẻ từ HTTP 429:\n${xem(m2b)}`);
  assert.deepEqual(ghi.tran, ['model:cm-solid', 'nhom:5']);
  const m2 = await man(26.9);
  assert.ok(co(m2, /Admin đã duyệt yêu cầu gia hạn #43: \+3 \$/) && co(m2, /Lượt 4 trả lời/), `tự làm tiếp:\n${xem(m2)}`);
  assert.equal(ghi.turn.length, 4, `đúng 4 lượt gửi máy chủ (không có lượt thừa sau #42): ${ghi.turn.map((b) => JSON.stringify(b.messages.at(-1)).slice(0, 60)).join(' | ')}`);
  const nguoi = (b: Record<string, any>) => (b.messages as Array<{ role: string }>).filter((x) => x.role === 'user').length;
  assert.equal(nguoi(ghi.turn[3]!), nguoi(ghi.turn[2]!), 'làm tiếp KHÔNG thêm câu hỏi mới');

  // 3. /ket-noi figma: ô ẩn, nhãn Token; Esc ⇒ không lưu.
  const m3 = await man(30.6);
  assert.ok(co(m3, /Kết nối Figma/) && co(m3, /Token\s+❯ •{10}/), `ô token ẩn ký tự:\n${xem(m3)}`);
  assert.ok(!co(m3, /Mật khẩu\s+❯/), 'nhãn không phải "Mật khẩu"');
  const m4 = await man(35.9);
  assert.ok(co(m4, /Figma: chưa kết nối/), `Esc ⇒ không lưu:\n${xem(m4)}`);

  // 4. /browser mode.
  const m5 = await man(38.9);
  assert.ok(co(m5, /Dùng: `?\/browser mode ngam`?/), `mode bậy ⇒ hướng dẫn:\n${xem(m5)}`);
  const m6 = await man(43.5);
  assert.ok(co(m6, /Trình duyệt AI mặc định: chạy NGẦM/), xem(m6));
  const caiDat = docHet(path.join(home, '.cuongmini'));
  assert.match(caiDat, /"trinhDuyetCheDo":\s*"ngam"/, 'cài đặt bền đã lưu');

  // Mã + token không bao giờ lên màn hình / đĩa / máy chủ ngoài thân POST gia hạn.
  const tatCa = (await phatLai(g)).tatCa.join('\n');
  assert.ok(!tatCa.includes(MA) && !tatCa.includes(TOKEN_FIGMA), 'bí mật hiện trên màn hình');
  const dia = docHet(path.join(home, '.cuongmini'));
  assert.ok(!dia.includes(MA) && !dia.includes(TOKEN_FIGMA), 'bí mật bị ghi xuống đĩa');
  assert.ok(!ghi.khac.some((u) => u.includes('figma')), 'Figma không đi qua máy chủ CuongThai');
});
