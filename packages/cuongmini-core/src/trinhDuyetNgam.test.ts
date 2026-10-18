/**
 * Trình duyệt AI chạy NGẦM (19/10/2026): mặc định headless + viewport 1280×800 + hồ sơ riêng; `/browser show`
 * (người dùng) ⇒ cửa sổ thấy được + đưa lên trước; model xin (`trinh_duyet_hien`) ⇒ KHÔNG cướp focus (macOS `open -g`,
 * nơi khác `--start-minimized`, không bringToFront); `hide` ⇒ về ngầm; điều hướng không bao giờ bringToFront;
 * không gõ vào ô mật khẩu. Puppeteer GIẢ — không bật trình duyệt thật.
 */
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

// Env đọc LÚC GỌI (thuMucHoSo / timTrinhDuyet) nên import tĩnh vẫn đúng.
import * as td from './trinhDuyetThay';

const tam = mkdtempSync(path.join(os.tmpdir(), 'cm-td-'));
const hoSo = path.join(tam, 'ho-so');
const appGia = path.join(tam, 'Google Chrome.app', 'Contents', 'MacOS');
mkdirSync(appGia, { recursive: true });
const chayGia = path.join(appGia, 'Google Chrome');
writeFileSync(chayGia, '');
process.env.CUONGMINI_HO_SO_TRINH_DUYET = hoSo;
process.env.CUONGMINI_TRINH_DUYET = chayGia;
delete process.env.CUONGMINI_TRINH_DUYET_CHE_DO;


// ─── Puppeteer giả ───
type TrangGia = { u: string; dongRoi: boolean; leTruoc: number; vp: unknown; goChu: string[] };
const nhat: { launch: Array<Record<string, unknown>>; connect: number; lenh: Array<[string, string[]]>; trang: TrangGia[]; dong: number } = { launch: [], connect: 0, lenh: [], trang: [], dong: 0 };
let ketQuaJs: unknown = 'ok';

function taoTrang(): unknown {
  const s: TrangGia = { u: 'about:blank', dongRoi: false, leTruoc: 0, vp: null, goChu: [] };
  nhat.trang.push(s);
  const nghe = new Map<string, (e: unknown) => void>();
  return {
    url: () => s.u,
    isClosed: () => s.dongRoi,
    on: () => undefined,
    setViewport: async (v: unknown) => { s.vp = v; },
    bringToFront: async () => { s.leTruoc += 1; },
    goto: async (u: string) => { s.u = u; },
    screenshot: async () => Buffer.from('png'),
    createCDPSession: async () => ({
      send: async (m: string, p?: { expression?: string }) => {
        if (m === 'Page.getFrameTree') return { frameTree: { frame: { id: 'f1' } } };
        if (m === 'Runtime.evaluate') { s.goChu.push(String(p?.expression ?? '')); return { result: { value: ketQuaJs } }; }
        return {};
      },
      on: (ten: string, f: (e: unknown) => void) => { nghe.set(ten, f); },
    }),
  };
}
function taoTrinhDuyet(): unknown {
  let connected = true;
  const ds = [taoTrang()];
  const ngheNgat: Array<() => void> = [];
  return {
    get connected() { return connected; },
    pages: async () => ds,
    newPage: async () => { const p = taoTrang(); ds.push(p); return p; },
    on: (ten: string, f: () => void) => { if (ten === 'disconnected') ngheNgat.push(f); },
    close: async () => { connected = false; nhat.dong += 1; for (const f of ngheNgat) f(); },
    disconnect: async () => { connected = false; },
    userAgent: async () => 'UA',
  };
}
const ppGia = {
  launch: async (o: Record<string, unknown>) => { nhat.launch.push(o); return taoTrinhDuyet(); },
  connect: async () => { nhat.connect += 1; return taoTrinhDuyet(); },
};
td.__datChoTest(ppGia, (lenh, args) => {
  nhat.lenh.push([lenh, args]);
  // `open -g` ⇒ Chrome ghi DevToolsActivePort ⇒ lõi nối vào.
  writeFileSync(path.join(hoSo, 'DevToolsActivePort'), '9222\n/devtools/browser/abc');
});
const cuoi = <T,>(a: T[]): T => a[a.length - 1]!;

test('tham số khởi động: ngầm = headless + viewport 1280×800; hiện do model xin ngoài macOS = --start-minimized', () => {
  const n = td.thamSoKhoiDong('ngam', '/x/chrome', '/h');
  assert.equal(n.headless, true);
  assert.deepEqual(n.defaultViewport, { width: 1280, height: 800 });
  assert.equal(n.userDataDir, '/h');
  const h = td.thamSoKhoiDong('hien', '/x/chrome', '/h', { nenTang: 'win32' });
  assert.equal(h.headless, false);
  assert.ok(h.args.includes('--start-minimized'));
  assert.ok(!td.thamSoKhoiDong('hien', '/x/chrome', '/h', { nenTang: 'win32', nguoiDungYeuCau: true }).args.includes('--start-minimized'));
});

test('macOS + model xin ⇒ `open -g` (không kích hoạt app); người dùng bấm hoặc nền khác ⇒ puppeteer.launch', () => {
  const l = td.lenhMoKhongCuopFocus('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/h', { nenTang: 'darwin' });
  assert.equal(l?.lenh, 'open');
  assert.deepEqual(l?.args.slice(0, 4), ['-g', '-n', '-a', '/Applications/Google Chrome.app']);
  assert.ok(l?.args.includes('--user-data-dir=/h'));
  assert.equal(td.lenhMoKhongCuopFocus('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/h', { nenTang: 'darwin', nguoiDungYeuCau: true }), null);
  assert.equal(td.lenhMoKhongCuopFocus('/usr/bin/chromium', '/h', { nenTang: 'linux' }), null);
});

test('không bao giờ dùng hồ sơ CHÍNH của Chrome/Edge', () => {
  assert.equal(td.hoSoAnToan(path.join(os.homedir(), 'Library/Application Support/Google/Chrome')), false);
  assert.equal(td.hoSoAnToan('C:\\Users\\a\\AppData\\Local\\Microsoft\\Edge\\User Data'), false);
  assert.equal(td.hoSoAnToan(path.join(os.homedir(), '.config/google-chrome')), false);
  assert.equal(td.hoSoAnToan(path.join(os.homedir(), '.cuongmini', 'trinh-duyet')), true);
});

test('mặc định: bật NGẦM (headless, viewport cố định); điều hướng KHÔNG bringToFront', async () => {
  assert.equal(td.cheDoHienTai(), 'ngam');
  await td.batDau();
  assert.equal(nhat.launch.length, 1);
  assert.equal(cuoi(nhat.launch).headless, true);
  assert.equal(cuoi(nhat.launch).userDataDir, hoSo);
  assert.deepEqual(cuoi(nhat.trang).vp, { width: 1280, height: 800 });
  assert.equal(td.diToi('https://example.com/a').ok, true);
  await td.choTai(500);
  assert.equal(cuoi(nhat.trang).u, 'https://example.com/a');
  assert.equal(nhat.trang.reduce((s, t) => s + t.leTruoc, 0), 0, 'không cướp focus');
  const anh = await td.chupTrang();
  assert.ok(anh?.data);
});

test('/browser show (người dùng) ⇒ đóng bản ngầm, bật cửa sổ cùng hồ sơ, mở lại trang, đưa lên trước', async () => {
  const dongTruoc = nhat.dong;
  const r = await td.chuyenCheDo('hien', { nguoiDungYeuCau: true });
  assert.equal(r.ok, true);
  assert.equal(nhat.dong, dongTruoc + 1);
  assert.equal(cuoi(nhat.launch).headless, false);
  assert.equal(cuoi(nhat.launch).userDataDir, hoSo);
  assert.equal(cuoi(nhat.trang).u, 'https://example.com/a');
  assert.ok(cuoi(nhat.trang).leTruoc >= 1);
  assert.equal(td.trangThai().cheDo, 'hien');
});

test('/browser hide ⇒ về ngầm (headless), không đưa lên trước', async () => {
  const r = await td.chuyenCheDo('ngam');
  assert.equal(r.ok, true);
  assert.equal(cuoi(nhat.launch).headless, true);
  assert.equal(cuoi(nhat.trang).leTruoc, 0);
  assert.equal(td.cheDoHienTai(), 'ngam');
});

test('trinh_duyet_hien (model xin) ⇒ cửa sổ hiện mà KHÔNG cướp focus', async () => {
  const soLaunch = nhat.launch.length;
  const r = await td.chuyenCheDo('hien', { nguoiDungYeuCau: false, url: 'https://accounts.example.com/login' });
  assert.equal(r.ok, true);
  if (process.platform === 'darwin') {
    assert.equal(cuoi(nhat.lenh)[0], 'open');
    assert.equal(cuoi(nhat.lenh)[1][0], '-g');
    assert.equal(nhat.launch.length, soLaunch, 'không puppeteer.launch (cái đó kích hoạt Chrome)');
    assert.ok(nhat.connect >= 1);
  } else {
    assert.ok((cuoi(nhat.launch).args as string[]).includes('--start-minimized'));
  }
  assert.equal(cuoi(nhat.trang).leTruoc, 0);
  assert.equal(cuoi(nhat.trang).u, 'https://accounts.example.com/login');
  await td.chuyenCheDo('ngam');
});

test('không gõ vào ô mật khẩu', async () => {
  ketQuaJs = 'mat-khau';
  const r = await td.goChu('#password', 'bi-mat');
  assert.equal(r.ok, false);
  assert.match(r.loi ?? '', /MẬT KHẨU/);
  assert.match(cuoi(cuoi(nhat.trang).goChu), /type === 'password'/);
  ketQuaJs = 'ok';
  await td.huy();
});
