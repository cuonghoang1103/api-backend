/**
 * MÃ GIA HẠN THEO $ (19/10/2026) — PTY THẬT + LÕI THẬT (`dist/loi.cjs`) + máy chủ CuongThai GIẢ:
 *   1. câu hỏi ⇒ máy chủ chặn `CUONGMINI_HET_TRAN` kèm `giaHanTien` ⇒ thẻ "Đã chạm giới hạn … · Nhập mã gia hạn để dùng tiếp",
 *      ô nhập ẨN ký tự (chỉ thấy •••);
 *   2. mã SAI ⇒ ô mở lại ngay kèm "Còn 4 lần thử"; mã ĐÚNG (lần 1) ⇒ "Đã gia hạn +3 $" ⇒ lõi LÀM TIẾP (`/agent/turn` lần 2,
 *      KHÔNG thêm câu hỏi mới vào hội thoại);
 *   3. câu sau ⇒ chặn lần nữa (lần 2 trong kỳ) ⇒ thẻ nói "cần admin duyệt" ⇒ mã đúng ⇒ "Đã gửi yêu cầu #42, chờ admin duyệt";
 *   4. câu sau ⇒ máy chủ báo `dangCho: 99` ⇒ CLI KHÔNG hỏi mã, kiểm lại ngay ⇒ đã duyệt ⇒ "Admin đã duyệt" ⇒ làm tiếp.
 * Mã không bao giờ xuất hiện trên màn hình hay trong ~/.cuongmini. Không chạm máy chủ thật nào.
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

const MA = 'MA-DUNG-7788';
let tam = '';
let may: Server | null = null;
let cong = 0;
const ghi = { turn: [] as Array<Record<string, any>>, nhap: [] as Array<Record<string, any>>, kiem: [] as string[] };

const G = (o: Record<string, unknown> = {}) => ({
  tran: 'model:cm-solid', ky: 'ngay', ten: 'CuongMini Solid · hôm nay', tenEn: 'CuongMini Solid · today', mucUsd: 3, daDungUsd: 3.1, tranUsd: 3,
  canDuyet: false, dangCho: null, lanThu: 1, duongDan: 'https://cuongthai.com/cuongmini/gia-han', ...o,
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
const chan = (g: Record<string, unknown>) => [{ type: 'error', code: 'CUONGMINI_HET_TRAN',
  error: 'Bạn đã dùng hết hạn mức CuongMini Solid hôm nay (3.1 $/3 $). Có mã gia hạn? Vào cuongthai.com/cuongmini/gia-han để nhập mã gia hạn.', giaHanTien: g }];

before(async () => {
  if (boQua) return;
  tam = mkdtempSync(path.join(os.tmpdir(), 'cm-giahan-pty-'));
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
        /* 1: chặn (lần 1) · 2: làm tiếp · 3: chặn (lần 2, cần duyệt) · 4: chặn (đang chờ #99) · 5: làm tiếp sau duyệt */
        if (n === 1) return sse(res, chan(G()));
        if (n === 3) return sse(res, chan(G({ canDuyet: true, lanThu: 2 })));
        if (n === 4) return sse(res, chan(G({ canDuyet: true, lanThu: 3, dangCho: 99 })));
        return sse(res, xong(n === 2 ? 'Làm tiếp xong việc A.' : 'Làm tiếp xong sau khi duyệt.'));
      }
      if (url === '/api/v1/agent/gia-han-tien' && req.method === 'POST') {
        const b = JSON.parse(than) as { ma?: string; tran?: string };
        ghi.nhap.push(b);
        if (b.ma !== MA) return json(res, 403, { success: false, code: 'GIA_HAN_MA_SAI', message: 'Mã gia hạn không đúng (hoặc admin đã đổi mã). Còn 4 lần thử.' });
        const dung = ghi.nhap.filter((x) => x.ma === MA).length;
        return dung === 1
          ? json(res, 200, { success: true, data: { ketQua: 'daCap', id: 41, soUsd: 3, lanThu: 1 } })
          : json(res, 202, { success: true, data: { ketQua: 'choDuyet', id: 42, soUsd: 3, lanThu: 2, moi: true } });
      }
      const m = /^\/api\/v1\/agent\/gia-han-tien\/yeu-cau\/(\d+)$/.exec(url);
      if (m) {
        ghi.kiem.push(m[1]!);
        return json(res, 200, { success: true, data: { id: Number(m[1]), trangThai: m[1] === '99' ? 'DA_CAP' : 'CHO_DUYET', soUsd: 3, lanThu: 3, lyDoTuChoi: null } });
      }
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
      CUONGMINI_CTW_TRE_MS: '600000',
      TERM: 'xterm-256color', LANG: 'vi_VN.UTF-8', TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.10', CUONGMINI_NGON_NGU: 'vi',
    },
    bo_env: ['CI', 'GITHUB_ACTIONS', 'CONTINUOUS_INTEGRATION', 'BUILD_NUMBER', 'BUILD_ID', 'RUN_ID', 'TF_BUILD', 'GITLAB_CI', 'CTWORK_TOKEN', 'CUONGMINI_LOI'],
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

test('PTY lõi thật: chạm trần ⇒ thẻ nhập mã (ẩn ký tự) ⇒ sai mở lại ⇒ đúng cộng ngay + làm tiếp ⇒ lần 2 chờ duyệt ⇒ đang chờ thì tự kiểm lại', { skip: boQua, timeout: 120_000 }, async () => {
  const { phatLai } = await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: (g: unknown, t?: number) => Promise<{ manHinh: string[]; tatCa: string[] }> };
  const home = path.join(tam, 'home');
  const duAn = path.join(tam, 'du-an');
  mkdirSync(path.join(home, '.cuongmini'), { recursive: true });
  mkdirSync(duAn, { recursive: true });
  writeFileSync(path.join(home, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'an', fullName: 'An', token: 'tk-thu', luu: new Date().toISOString() }));

  const g = await chay(duAn, home, [
    [2.0, 'việc A', 'Hỏi hoặc giao việc'], [2.4, '\r'],
    [5.0, 'sai-ma-1', 'Nhập mã gia hạn để dùng tiếp'], [5.6, '\r'],
    [8.0, MA, 'Còn 4 lần thử'], [8.6, '\r'],
    [12.0, 'việc B', 'Làm tiếp xong việc A'], [12.4, '\r'],
    [15.0, MA, 'Lần 2 trong kỳ'], [15.6, '\r'],
    [19.0, 'việc C', 'chờ admin duyệt'], [19.4, '\r'],
  ], 25);
  const man = async (t: number) => (await phatLai(g, t)).manHinh;
  const co = (m: string[], s: string | RegExp) => m.some((d) => (typeof s === 'string' ? d.includes(s) : s.test(d)));
  const xem = (m: string[]) => m.join('\n');
  if (process.env.CUONGMINI_PTY_IN === '1') for (const t of [4.9, 5.5, 7.9, 8.5, 11.9, 14.9, 18.9, 24.5]) console.log(`\n──── t=${t}s ────\n${xem(await man(t))}`);

  // 1. Thẻ + ô ẩn ký tự.
  const m1 = await man(4.9);
  assert.ok(co(m1, /Đã chạm giới hạn CuongMini Solid · hôm nay · Nhập mã gia hạn để dùng tiếp/), `thẻ gia hạn:\n${xem(m1)}`);
  assert.ok(co(m1, /Đã dùng 3\.1 \$ \/ 3 \$\./), xem(m1));
  assert.ok(co(m1, /Mã đúng ⇒ cộng ngay \+3 \$/) && co(m1, /Mã gia hạn/), xem(m1));
  const m1b = await man(5.5);
  assert.ok(co(m1b, /Mã gia hạn\s+❯ •{8}/), `ô nhập phải ẩn ký tự:\n${xem(m1b)}`);
  assert.ok(!co(m1b, 'sai-ma-1'), 'mã không hiện ra màn hình');

  // 2. Sai ⇒ mở lại kèm số lần còn; đúng ⇒ cộng ngay + làm tiếp (lượt 2 không thêm câu hỏi).
  const m2 = await man(7.9);
  assert.ok(co(m2, /⚠ Mã gia hạn không đúng .* Còn 4 lần thử/) && co(m2, /Nhập mã gia hạn để dùng tiếp/), `mã sai ⇒ ô mở lại:\n${xem(m2)}`);
  const m3 = await man(11.9);
  assert.ok(co(m3, /Đã gia hạn \+3 \$ — CuongMini làm tiếp chỗ dở/), `cộng ngay:\n${xem(m3)}`);
  assert.ok(co(m3, /Làm tiếp xong việc A/), `lõi làm tiếp:\n${xem(m3)}`);
  assert.equal(ghi.nhap[0]!.tran, 'model:cm-solid');
  assert.equal(ghi.turn.length >= 2, true);
  const nguoi = (b: Record<string, any>) => (b.messages as Array<{ role: string }>).filter((x) => x.role === 'user').length;
  assert.equal(nguoi(ghi.turn[1]!), nguoi(ghi.turn[0]!), 'làm tiếp KHÔNG thêm câu hỏi mới');

  // 3. Lần 2 trong kỳ ⇒ chờ duyệt.
  const m4 = await man(14.9);
  assert.ok(co(m4, /Lần 2 trong kỳ — mã đúng sẽ gửi yêu cầu, admin duyệt rồi mới cộng \+3 \$/), `thẻ lần 2:\n${xem(m4)}`);
  const m5 = await man(18.9);
  assert.ok(co(m5, /Đã gửi yêu cầu gia hạn #42, chờ admin duyệt — CuongMini tự kiểm lại mỗi 30 giây/), `chờ duyệt:\n${xem(m5)}`);

  // 4. Đang chờ #99 ⇒ không hỏi mã, kiểm lại ngay ⇒ đã duyệt ⇒ làm tiếp.
  const m6 = await man(24.5);
  assert.ok(co(m6, /Yêu cầu gia hạn #99 đang chờ admin duyệt/), `đang chờ:\n${xem(m6)}`);
  assert.ok(co(m6, /Admin đã duyệt yêu cầu gia hạn #99: \+3 \$/), `tự kiểm lại thấy đã duyệt:\n${xem(m6)}`);
  assert.ok(co(m6, /Làm tiếp xong sau khi duyệt/), `làm tiếp sau duyệt:\n${xem(m6)}`);
  assert.ok(ghi.kiem.includes('99'));
  assert.equal(ghi.nhap.length, 3, 'đang chờ ⇒ không hỏi mã lần nữa');

  // Mã không bao giờ rời khỏi thân yêu cầu: không trên màn hình, không trong ~/.cuongmini.
  const tatCa = (await phatLai(g)).tatCa.join('\n');
  assert.ok(!tatCa.includes(MA) && !tatCa.includes('sai-ma-1'), 'mã hiện trên màn hình');
  const dia = docHet(path.join(home, '.cuongmini'));
  assert.ok(!dia.includes(MA) && !dia.includes('sai-ma-1'), 'mã bị ghi xuống đĩa');
});
