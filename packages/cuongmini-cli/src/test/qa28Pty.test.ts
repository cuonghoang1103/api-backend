/**
 * QA 28/10/2026 — như NGƯỜI DÙNG THẬT: PTY thật + CLI thật (`dist/`) + LÕI THẬT + git THẬT (remote là repo TRẦN cục bộ) +
 * máy chủ CuongThai GIẢ (chỉ đăng nhập + lượt agent kịch bản sẵn).
 *   1. Mở CuongMini trong repo đang SAU origin 3 commit ⇒ thẻ "pull không?" ⇒ 1 ⇒ kéo về thật (HEAD = remote).
 *   2. Repo PHÂN KỲ ⇒ thẻ giải thích rebase/merge ⇒ "Để sau" không đổi gì ⇒ `/dong-bo` ⇒ rebase ⇒ đi trước 1, sau 0.
 *   3. Thư mục KHÔNG phải repo ⇒ lúc mở im lặng; `/dong-bo` ⇒ nói rõ.
 *   4. Mất mạng (remote không với tới) ⇒ `/dong-bo` không treo, báo "so với lần tải trước".
 *   5. Nhánh tính năng CHƯA ĐẨY thiếu commit của main ⇒ `/dong-bo` ⇒ "chưa có trên GitHub" + hỏi cập nhật (rebase khuyên).
 *   6. `xin_quyen_thu_muc`: model xin ĐỌC ~/…/SWT301-SportShop ⇒ thẻ quyền ⇒ "Cho phép đọc" ⇒ read_file tuyệt đối đọc được;
 *      lần 2 bấm "Không" ⇒ không cấp, lượt dừng, không đọc.
 */
import assert from 'node:assert/strict';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const goc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dist = path.join(goc, 'dist/cuongmini.mjs');
const coPython = process.platform !== 'win32' && spawnSync('python3', ['--version']).status === 0;
const boQua = !existsSync(dist) || !existsSync(path.join(goc, 'dist/loi.cjs')) ? 'chưa dựng dist/ (npm run build)' : !coPython ? 'không có python3/pty' : false;

let tam = '';
let may: Server | null = null;
let cong = 0;
/** Kịch bản lượt agent hiện tại (đổi theo từng bài). */
let kichBan: (b: Record<string, any>) => unknown[] = () => [];
const luot: Array<Record<string, any>> = [];

const xong = (append: unknown[], stop = 'end') => ({ type: 'done', append, stop, usage: { inputTokens: 1, outputTokens: 1, costUsd: 0 }, quota: null });
const goiTool = (id: string, ten: string, args: Record<string, unknown>) => [{ type: 'start', model: 'gia' }, { type: 'tool_call', id, name: ten, args },
  xong([{ role: 'assistant', content: null, tool_calls: [{ id, type: 'function', function: { name: ten, arguments: JSON.stringify(args) } }] }], 'tool_calls')];
const traLoiChu = (chu: string) => [{ type: 'start', model: 'gia' }, { type: 'text', delta: chu }, xong([{ role: 'assistant', content: chu }])];

const ENV_GIT = { GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 'An', GIT_AUTHOR_EMAIL: 'an@example.com', GIT_COMMITTER_NAME: 'An', GIT_COMMITTER_EMAIL: 'an@example.com' };
const g = (cwd: string, ...a: string[]) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, ...ENV_GIT, HOME: tam, GIT_CONFIG_GLOBAL: path.join(tam, 'gitconfig') } }).trim();
let dem = 0;
function dung(): { toi: string; ban: string } {
  const d = path.join(tam, `ca${dem += 1}`);
  mkdirSync(d, { recursive: true });
  g(d, 'init', '-q', '--bare', '-b', 'main', 'remote.git');
  const toi = path.join(d, 'nha-tro');
  g(d, 'clone', '-q', 'remote.git', toi);
  writeFileSync(path.join(toi, 'a.txt'), 'mot\n'); g(toi, 'add', 'a.txt'); g(toi, 'commit', '-qm', 'khoi tao'); g(toi, 'push', '-q', '-u', 'origin', 'main');
  const ban = path.join(d, 'ban');
  g(d, 'clone', '-q', 'remote.git', ban);
  return { toi, ban };
}
function banDay(ban: string, n: number, file = 'b.txt'): void {
  for (let i = 0; i < n; i += 1) { writeFileSync(path.join(ban, file), `ban ${i}\n`); g(ban, 'add', file); g(ban, 'commit', '-qm', `ban ${i}`); }
  g(ban, 'push', '-q', 'origin', 'HEAD');
}

before(async () => {
  if (boQua) return;
  tam = realpathSync(mkdtempSync(path.join(os.tmpdir(), 'cm-qa28-')));
  writeFileSync(path.join(tam, 'gitconfig'), '');
  may = createServer((req, res) => {
    let than = '';
    req.on('data', (c) => { than += c; });
    req.on('end', () => {
      const url = req.url ?? '';
      const json = (v: unknown) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(v)); };
      if (url === '/api/v1/auth/refresh') return json({ data: { userId: 7, username: 'an', fullName: 'An', token: 'tk-thu' } });
      if (url === '/api/v1/agent/turn') {
        const b = JSON.parse(than) as Record<string, any>;
        luot.push(b);
        res.writeHead(200, { 'content-type': 'text/event-stream' });
        res.end(kichBan(b).map((k) => `data: ${JSON.stringify(k)}\n\n`).join(''));
        return undefined;
      }
      return json({ data: {} });
    });
  });
  await new Promise<void>((ok) => may!.listen(0, '127.0.0.1', ok));
  cong = (may.address() as { port: number }).port;
});
after(() => { may?.close(); if (tam) rmSync(tam, { recursive: true, force: true }); });

interface Ghi { su_kien: unknown[]; thoat?: number }
async function chay(ten: string, duAn: string, phim: Array<[number, string] | [number, string, string]>, giay: number): Promise<Ghi> {
  const home = path.join(tam, `home-${ten}`);
  mkdirSync(path.join(home, '.cuongmini', 'data'), { recursive: true });
  writeFileSync(path.join(home, '.cuongmini/phien.json'), JSON.stringify({ userId: 7, username: 'an', fullName: 'An', token: 'tk-thu', luu: new Date().toISOString() }));
  // Không thử CT Work ở đây ⇒ "Không hỏi lại" thẻ kết nối (thẻ đồng bộ git vẫn hiện độc lập).
  writeFileSync(path.join(home, '.cuongmini/data/cuongthai-desktop.json'), JSON.stringify({ settings: { ctworkKhongHoi: true, robotEnabled: false }, windowState: {} }));
  const cauHinh = path.join(tam, `pty-${ten}.json`);
  const ra = path.join(tam, `ghi-${ten}.json`);
  writeFileSync(cauHinh, JSON.stringify({
    cmd: [process.execPath, dist], cwd: duAn, cols: 120, rows: 40, duration: giay, out: ra,
    env: {
      HOME: home, CUONGMINI_HOME: path.join(home, '.cuongmini'), CUONGTHAI_API_ORIGIN: `http://127.0.0.1:${cong}`,
      CUONGMINI_KHONG_KIEM_CAP_NHAT: '1', CUONGMINI_TIN_THU_MUC: '1', CUONGMINI_KHONG_MO_TRINH_DUYET: '1', CUONGMINI_CTW_TRE_MS: '700',
      CUONGMINI_KHONG_DAT_TIEU_DE: '1', TERM: 'xterm-256color', LANG: 'vi_VN.UTF-8', CUONGMINI_NGON_NGU: 'vi',
      ...ENV_GIT, GIT_CONFIG_GLOBAL: path.join(tam, 'gitconfig'),
    },
    bo_env: ['CI', 'GITHUB_ACTIONS', 'CONTINUOUS_INTEGRATION', 'BUILD_NUMBER', 'BUILD_ID', 'RUN_ID', 'TF_BUILD', 'GITLAB_CI', 'CTWORK_TOKEN', 'CUONGMINI_LOI',
      'TERM_PROGRAM', 'TERM_PROGRAM_VERSION', 'WT_SESSION', 'TMUX', 'CUONGMINI_KHONG_DONG_BO'],
    keys: phim,
  }));
  await new Promise<void>((ok, hong) => {
    const p = spawn('python3', [path.join(goc, 'thu/pty_chay.py'), cauHinh], { stdio: 'ignore' });
    p.on('exit', (m) => (m === 0 ? ok() : hong(new Error(`pty_chay thoát ${m}`))));
  });
  const gh = JSON.parse(readFileSync(ra, 'utf8')) as Ghi;
  /* CLI xoá màn hình lúc thoát ⇒ đọc NGAY TRƯỚC Ctrl-C đầu tiên của kịch bản. */
  const ctrlC = phim.find((k) => k[1] === '\x03');
  if (ctrlC) gh.thoat = ctrlC[0] - 0.05;
  return gh;
}
type PhatLai = (g: unknown, t?: number) => Promise<{ manHinh: string[]; tatCa: string[] }>;
const napPhatLai = async () => (await import(path.join(goc, 'thu/phatLai.mjs')) as { phatLai: PhatLai }).phatLai;
const IN = process.env.CUONGMINI_PTY_IN === '1';
async function tatCa(gh: Ghi): Promise<string> { const p = await napPhatLai(); const r = await p(gh, gh.thoat ?? Infinity); return [...r.tatCa, ...r.manHinh].join('\n'); }
async function manHinh(gh: Ghi, t: number): Promise<string> { const p = await napPhatLai(); const m = (await p(gh, t)).manHinh.join('\n'); if (IN) console.log(`\n──── t=${t}s ────\n${m}`); return m; }

test('QA 1 — mở trong repo đang SAU 3 commit ⇒ thẻ "pull không?" ⇒ Có ⇒ kéo về thật', { skip: boQua, timeout: 90_000 }, async () => {
  const { toi, ban } = dung();
  banDay(ban, 3);
  writeFileSync(path.join(toi, 'dang-viet.txt'), 'chưa commit\n');
  const gh = await chay('sau', toi, [[4, '1', 'pull không\\?'], [9, '\x03'], [9.3, '\x03']], 11);
  const m = await manHinh(gh, 3.9);
  assert.match(m, /Nhánh main đang sau origin\/main 3 commit — pull không\?/, m);
  assert.match(m, /1\. Có — pull \(fast-forward\)/);
  assert.match(m, /Xem 3 commit mới trước/);
  const all = await tatCa(gh);
  assert.match(all, /Đã kéo 3 commit từ origin\/main vào main/, all.slice(-2500));
  assert.equal(g(toi, 'rev-parse', 'HEAD'), g(ban, 'rev-parse', 'HEAD'), 'HEAD = remote sau khi kéo');
  assert.equal(readFileSync(path.join(toi, 'dang-viet.txt'), 'utf8'), 'chưa commit\n', 'file chưa commit giữ nguyên');
});

test('QA 2 — PHÂN KỲ ⇒ thẻ giải thích ⇒ "Để sau" không đổi gì ⇒ /dong-bo ⇒ rebase', { skip: boQua, timeout: 90_000 }, async () => {
  const { toi, ban } = dung();
  banDay(ban, 1);
  writeFileSync(path.join(toi, 'c.txt'), 'toi\n'); g(toi, 'add', 'c.txt'); g(toi, 'commit', '-qm', 'toi c');
  const truoc = g(toi, 'rev-parse', 'HEAD');
  const gh = await chay('phanky', toi, [[4, '0', 'PHÂN KỲ'], [5.5, '/dong-bo', 'Để sau'], [6, '\r'], [8.5, '1', 'PHÂN KỲ'], [12, '\x03'], [12.3, '\x03']], 14);
  const m = await manHinh(gh, 3.9);
  assert.match(m, /Nhánh main đã PHÂN KỲ với origin\/main: bạn có 1 commit chưa đẩy, trên GitHub có 1 commit bạn chưa có\./, m);
  assert.match(m, /Rebase lên origin\/main \(khuyên\)/);
  assert.match(m, /Merge origin\/main/);
  const all = await tatCa(gh);
  assert.match(all, /Để sau — gõ \/dong-bo khi muốn kiểm lại/);
  assert.match(all, /Đã rebase, nhận 1 commit từ origin\/main vào main/, all.slice(-2500));
  assert.notEqual(g(toi, 'rev-parse', 'HEAD'), truoc);
  assert.equal(g(toi, 'rev-list', '--left-right', '--count', 'HEAD...@{u}'), '1\t0');
});

test('QA 3+4 — thư mục KHÔNG phải repo im lặng lúc mở; MẤT MẠNG báo rõ, không treo', { skip: boQua, timeout: 90_000 }, async () => {
  const khongGit = path.join(tam, 'khong-git');
  mkdirSync(khongGit, { recursive: true });
  const g1 = await chay('khonggit', khongGit, [[4.5, '/dong-bo', 'Hỏi'], [5, '\r'], [8, '\x03'], [8.3, '\x03']], 10);
  const luc = await manHinh(g1, 4.3);
  /* Màn chào vốn có chữ "git" ("chạy lệnh, git, trình duyệt") + tên thư mục khong-git ⇒ soi đúng câu của thẻ đồng bộ. */
  assert.doesNotMatch(luc, /pull không|PHÂN KỲ|không phải repo git|đồng bộ|Không tải được/i, 'lúc mở không nói gì');
  assert.match(await tatCa(g1), /Thư mục này không phải repo git — không có gì để đồng bộ\./);

  const { toi } = dung();
  g(toi, 'remote', 'set-url', 'origin', 'https://127.0.0.1:9/nhom/nha-tro.git');
  const g2 = await chay('offline', toi, [[4.5, '/dong-bo', 'Hỏi'], [5, '\r'], [12, '\x03'], [12.3, '\x03']], 14);
  const all = await tatCa(g2);
  assert.match(all, /Không tải được bản mới từ origin \(mất mạng\?\) — số liệu dưới đây so với lần tải trước\./, all.slice(-2500));
});

test('QA 5 — nhánh tính năng CHƯA ĐẨY thiếu commit mới của main ⇒ báo + hỏi cập nhật (rebase khuyên)', { skip: boQua, timeout: 90_000 }, async () => {
  const { toi, ban } = dung();
  g(toi, 'switch', '-qc', 'feature/NT-24-login-form');
  writeFileSync(path.join(toi, 'login.txt'), 'x\n'); g(toi, 'add', 'login.txt'); g(toi, 'commit', '-qm', 'feat(NT-24): form');
  banDay(ban, 2);
  const gh = await chay('nhanh', toi, [[4, '0', 'cập nhật nhánh'], [6, '\x03'], [6.3, '\x03']], 8);
  const m = await manHinh(gh, 3.9);
  assert.match(m, /Nhánh feature\/NT-24-login-form thiếu 2 commit mới của origin\/main — cập nhật nhánh không\?/, m);
  assert.match(m, /Rebase lên origin\/main \(khuyên\)/);
  assert.match(await tatCa(gh), /chưa có trên GitHub \(chưa đẩy lần nào\)/);
});

test('QA 6 — xin_quyen_thu_muc: thẻ quyền ⇒ Cho phép đọc ⇒ đọc file ngoài; lần 2 Không ⇒ không cấp, không đọc', { skip: boQua, timeout: 120_000 }, async () => {
  const duAn = path.join(tam, 'SportShop');
  mkdirSync(duAn, { recursive: true });
  const ngoai = path.join(tam, 'Documents', 'SWT301-SportShop');
  mkdirSync(path.join(ngoai, 'test'), { recursive: true });
  writeFileSync(path.join(ngoai, 'test', 'LoginTest.java'), 'class LoginTest { /* TC-07 sai mật khẩu */ }\n');
  const fileNgoai = path.join(ngoai, 'test', 'LoginTest.java');
  kichBan = (b) => {
    const tool = b.messages.filter((x: { role: string }) => x.role === 'tool');
    const cuoi = String(tool.at(-1)?.content ?? '');
    if (!tool.length) return goiTool('t1', 'xin_quyen_thu_muc', { path: ngoai, ly_do: 'repo thật có test + báo cáo SWT301' });
    if (tool.length === 1 && /đã cho phép ĐỌC/.test(cuoi)) return goiTool('t2', 'read_file', { path: fileNgoai });
    return traLoiChu(`Kết quả: ${cuoi.includes('TC-07') ? 'ĐỌC ĐƯỢC TC-07' : 'không đọc'}.`);
  };
  const truoc = luot.length;
  const g1 = await chay('quyen-co', duAn, [[3.5, 'xem test ở repo thật', 'Hỏi'], [4, '\r'], [7, '1', 'Truy cập thư mục ngoài dự án'], [12, '\x03'], [12.3, '\x03']], 14);
  const m = await manHinh(g1, 6.9);
  assert.match(m, /Truy cập thư mục ngoài dự án/, m);
  assert.match(m, /CuongMini muốn ĐỌC thư mục "SWT301-SportShop"/);
  assert.match(m, /Đường dẫn: .*Documents/);
  assert.match(m, /Lý do: repo thật có test \+ báo cáo SWT301/);
  assert.match(m, /1\. Cho phép đọc/);
  assert.match(m, /2\. Cho phép đọc \+ sửa \(mỗi lần sửa vẫn hỏi\)/);
  assert.match(m, /3\. Không/);
  const l = luot.slice(truoc);
  assert.ok(l[0]!.capabilities.includes('thu_muc_ngoai'), 'lõi khai khả năng thu_muc_ngoai');
  assert.ok(l.length >= 3, `phải có 3 lượt: ${l.length}`);
  assert.match(String(l[2]!.messages.filter((x: { role: string }) => x.role === 'tool').at(-1)?.content), /TC-07 sai mật khẩu/, 'read_file tuyệt đối đọc được sau khi cho phép');
  assert.match(await tatCa(g1), /ĐỌC ĐƯỢC TC-07/);

  const truoc2 = luot.length;
  const g2 = await chay('quyen-khong', duAn, [[3.5, 'xem test ở repo thật', 'Hỏi'], [4, '\r'], [7, '3', 'Truy cập thư mục ngoài dự án'], [11, '\x03'], [11.3, '\x03']], 13);
  const l2 = luot.slice(truoc2);
  assert.equal(l2.length, 1, `bấm Không ⇒ lượt dừng, không gọi tiếp (đã gọi ${l2.length})`);
  assert.doesNotMatch(await tatCa(g2), /ĐỌC ĐƯỢC TC-07/);
});
