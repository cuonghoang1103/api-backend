/**
 * 19/10/2026 — `/browser show|hide|mode` (trình duyệt AI chạy NGẦM, hiện cửa sổ để TỰ đăng nhập) và `/ket-noi figma`
 * (token chỉ đọc nhập bằng ô ẨN, đi thẳng vào lõi `agent:figma`, không vào hội thoại). Lõi giả ghi lại kênh.
 */
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import type { BoiCanhLenh } from '../lenh';
import type { KhoChat as KhoChatT } from '../kho';

process.env.HOME = mkdtempSync(path.join(os.tmpdir(), 'cm-td-home-'));
process.env.USERPROFILE = process.env.HOME;
process.env.CUONGTHAI_API_ORIGIN = 'http://127.0.0.1:9';
const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const goiTam = path.resolve(src, '../node_modules/.cache/cm-td-test.mjs');
await build({
  stdin: { contents: `export * from './lenh'; export { datNgonNgu } from './i18n'; export { KhoChat } from './kho';`, resolveDir: src, loader: 'ts' },
  bundle: true, platform: 'node', format: 'esm', outfile: goiTam, logLevel: 'silent', packages: 'external',
  alias: { 'ct-lenh': path.resolve(src, '../../../desktop/src/renderer/features/chat/lenhGach.ts') },
});
const M = await import(pathToFileURL(goiTam).href) as typeof import('../lenh') & { datNgonNgu: (n: 'vi' | 'en') => void; KhoChat: typeof KhoChatT };
process.env.CUONGMINI_HOME = mkdtempSync(path.join(os.tmpdir(), 'cm-td-'));
process.env.CUONGMINI_TRINH_DUYET = process.execPath; // "có trình duyệt" cho phép kiểm /browser show

type HoiAn = { tieuDe: string; moTa: string; khiXong: (v: string) => void };
function boiCanh(tra: (kenh: string, du: unknown) => unknown) {
  const kenh: Array<[string, Record<string, unknown>]> = [];
  const hoi: HoiAn[] = [];
  const kho = new M.KhoChat(true);
  const kn = { goi: async (k: string, d?: Record<string, unknown>) => { kenh.push([k, d ?? {}]); return tra(k, d); }, nguoi: { userId: 1, username: 'a', fullName: 'A', token: 't' } };
  const khong = (() => undefined) as never;
  const b = {
    kho, kn, thuMuc: '/tmp/x', phienBan: '0', guiThat: khong, chon: khong, doiModel: khong, doiMuc: khong, doiCheDo: khong, dsModel: () => [], dsMuc: () => [],
    moMenu: khong, moKhoaModel: khong, datToanManHinh: khong, datChuot: khong, doiNgonNgu: khong, doiTheme: khong, datNhap: khong, xoaManHinh: khong,
    dangXuat: khong, dangNhapLai: khong, thoat: khong, hoiAn: (o: HoiAn) => { hoi.push(o); },
  } as unknown as BoiCanhLenh;
  const chu = () => JSON.stringify(kho.S.bang);
  return { b, kenh, hoi, chu };
}

test('/browser show ⇒ agent:trinhDuyetCheDo hien; hide ⇒ ngam; mode ⇒ macDinh', async () => {
  M.datNgonNgu('vi');
  const t = boiCanh((k, d) => (k === 'agent:trinhDuyetCheDo' ? { ok: true, cheDo: (d as { cheDo: string }).cheDo, url: 'https://x.test/login', hoTro: true } : null));
  await M.chayLenh('/browser show', t.b);
  assert.equal(t.kenh.at(-1)![0], 'agent:trinhDuyetCheDo');
  assert.equal(t.kenh.at(-1)![1].cheDo, 'hien');
  assert.match(t.chu(), /Tự đăng nhập/);
  await M.chayLenh('/browser hide', t.b);
  assert.equal(t.kenh.at(-1)![1].cheDo, 'ngam');
  assert.match(t.chu(), /NGẦM/);
  await M.chayLenh('/browser mode hien', t.b);
  assert.deepEqual([t.kenh.at(-1)![1].cheDo, t.kenh.at(-1)![1].macDinh], ['hien', true]);
  await M.chayLenh('/browser show https://classroom.google.com', t.b);
  assert.equal(t.kenh.at(-1)![1].url, 'https://classroom.google.com');
  // Lõi cũ (null) ⇒ câu báo, không ném.
  const cu = boiCanh(() => null);
  await M.chayLenh('/browser show', cu.b);
  assert.match(cu.chu(), /lõi bản cũ/);
  M.datNgonNgu('en');
  const en = boiCanh((k) => (k === 'agent:trinhDuyetCheDo' ? { ok: true, cheDo: 'ngam', url: '' } : null));
  await M.chayLenh('/browser hide', en.b);
  assert.match(en.chu(), /BACKGROUND/);
  M.datNgonNgu('vi');
});

test('/ket-noi figma ⇒ ô ẨN; token đi thẳng agent:figma (noi), KHÔNG vào bảng ghi', async () => {
  const TOKEN = 'gia-lap-figma-cli-4';
  const t = boiCanh((k, d) => (k === 'agent:figma' && (d as { viec: string }).viec === 'noi' ? { ok: true, coToken: true, handle: 'Long' } : { ok: true, coToken: false }));
  await M.chayLenh('/ket-noi figma', t.b);
  assert.equal(t.hoi.length, 1);
  assert.match(t.hoi[0]!.moTa, /CHỈ ĐỌC/);
  t.hoi[0]!.khiXong(TOKEN);
  await new Promise((x) => setTimeout(x, 20));
  const goiNoi = t.kenh.find(([k, d]) => k === 'agent:figma' && d.viec === 'noi');
  assert.equal(goiNoi?.[1].token, TOKEN);
  assert.ok(!t.chu().includes(TOKEN), 'token không nằm trong bảng ghi');
  assert.match(t.chu(), /Đã kết nối Figma \(Long\)/);
  await M.chayLenh('/ket-noi figma status', t.b);
  assert.match(t.chu(), /chưa kết nối|đã kết nối/);
  await M.chayLenh('/ket-noi figma off', t.b);
  assert.ok(t.kenh.some(([k, d]) => k === 'agent:figma' && d.viec === 'ngat'));
  await M.chayLenh('/ket-noi', t.b);
  assert.match(t.chu(), /ket-noi figma/);
});
