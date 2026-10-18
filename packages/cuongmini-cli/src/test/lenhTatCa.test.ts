/**
 * CHẠY TỪNG LỆNH `/` trong `/help` (18/10/2026 — "kiểm tra all lệnh, nó nhiều lỗi"): không tham số +
 * có tham số, tiếng Việt + English, với lõi giả ghi lại mọi kênh được gọi. Kiểm: không ném, có phản
 * hồi (chữ / menu / gửi cho agent / gọi lõi), và KHÔNG vứt tham số người dùng đã gõ.
 * Kết quả từng lệnh in ra cuối (node --test hiện ở phần diagnostic) để ghi báo cáo.
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

/*
 * `ct-lenh` là bí danh esbuild (build.mjs) trỏ vào file của app desktop ⇒ dựng một gói ESM nhỏ
 * (lenh + kho + i18n CHUNG một bản, để đổi ngôn ngữ có tác dụng) rồi nạp.
 */
// HOME tạm: lệnh ghi file (/export lùi về thư mục nhà) không được rơi vào nhà thật.
process.env.HOME = mkdtempSync(path.join(os.tmpdir(), 'cm-lenh-home-'));
process.env.USERPROFILE = process.env.HOME;
// KHÔNG gọi máy chủ thật trong test (/usage, /doctor…): trỏ API vào một cổng chết.
process.env.CUONGTHAI_API_ORIGIN = 'http://127.0.0.1:9';
const src = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Trong node_modules của gói ⇒ các gói ngoài (string-width, marked…) vẫn tìm được.
const goiTam = path.resolve(src, '../node_modules/.cache/cm-lenh-test.mjs');
await build({
  stdin: { contents: `export * from './lenh'; export { datNgonNgu } from './i18n'; export { KhoChat } from './kho';`, resolveDir: src, loader: 'ts' },
  bundle: true, platform: 'node', format: 'esm', outfile: goiTam, logLevel: 'silent', packages: 'external',
  alias: { 'ct-lenh': path.resolve(src, '../../../desktop/src/renderer/features/chat/lenhGach.ts') },
});
const M = await import(pathToFileURL(goiTam).href) as typeof import('../lenh') & { datNgonNgu: (n: 'vi' | 'en') => void; KhoChat: typeof KhoChatT };
const { chayLenh, LENH_GOI_Y, MODEL_DU_PHONG, MUC_DU_PHONG, datNgonNgu } = M;
const KhoChat = M.KhoChat;

process.env.CUONGMINI_HOME = mkdtempSync(path.join(os.tmpdir(), 'cm-lenh-'));
process.env.CUONGMINI_KHONG_MO_TRINH_DUYET = '1';

interface Ghi { kenh: Array<[string, unknown]>; cb: string[]; gui: string[] }

const TRA: Record<string, unknown> = {
  'agent:dsQuyenLau': { goc: '/tmp/duan', khoa: ['npm test', 'tien-to:npm run lint'] },
  'agent:mcpTrangThai': { duongDan: '/tmp/mcp.json', server: [{ ten: 'ctwork', ok: true, soTool: 40 }] },
  'agent:dsPhien': [{ id: 'p1', tieuDe: 'Việc cũ', capNhat: Date.now(), duAn: 'duan', soTin: 3 }],
  'agent:nguCanhChiTiet': { deBai: 1, lichSu: 2, ketQuaTool: 3, soAnh: 0, byteAnh: 0, tong: 6, soTin: 2, soLuot: 1, tongGui: 6, tomTat: null },
  'agent:compact': { ok: true, soTinDaGop: 4, soLuotDaGop: 2, kyTuTruoc: 1000, kyTuSau: 200 },
  'agent:chanDoan': [{ ten: 'Mạng', ok: true, chiTiet: 'ok' }],
  'agent:kyNangDs': [],
  'agent:boNhoDs': [],
  'agent:khoTim': [],
  'agent:dsPhienMang': { toi: { id: 'abc123', ten: 'cli·duan' }, ds: [{ id: 'def456', ten: 'desktop·api', noi: 'desktop', thuMuc: '/tmp/api', trangThai: 'ranh' }] },
  'agent:doiTenPhienMang': { id: 'abc123', ten: 'backend' },
  'agent:themTienTo': { ok: true, khoa: 'tien-to:npm test' },
  'agent:dsWorktree': [{ duongDan: '/tmp/duan', nhanh: 'main', laChinh: true, cuaApp: false, dangDung: true }],
  'agent:taoWorktree': { ok: true },
  'agent:xoaWorktree': { ok: true },
  'agent:henCho': { cho: [], hen: [{ id: 'h1', lyDo: 'xem CI', luc: Date.now() + 60_000, phut: 5, lap: false, conLai: 1 }] },
  'agent:huyHen': 1,
  'agent:ctwork': { ok: true, soTool: 40, coToken: false, server: null },
  'agent:getWorkspace': { path: '/tmp/duan', name: 'duan', branch: 'main', cheDoQuyen: 'hoi' },
  'agent:xoaQuyenLau': 1,
  'agent:hoanTac': { soFile: 0, loi: [] },
  'agent:lenhDuAn': [],
};

function taoBoiCanh(rong = false): { b: BoiCanhLenh; g: Ghi } {
  const g: Ghi = { kenh: [], cb: [], gui: [] };
  const kho = new KhoChat(true);
  kho.S.ws = { path: '/tmp/duan', name: 'duan', branch: 'main', cheDoQuyen: 'hoi', mucNoLuc: 'vua', model: 'sonnet-5' } as typeof kho.S.ws;
  kho.S.muc.push({ kieu: 'nguoi', text: 'câu hỏi một' }, { kieu: 'may', text: 'trả lời một' });
  const kn = {
    nguoi: { userId: 7, username: 'thu', fullName: 'Thử', token: 't' },
    trinhDuyet: false, moCuoi: null as null | { duong: string; ok: boolean },
    goi: async (kenh: string, du?: unknown) => { g.kenh.push([kenh, du]); if (kenh === 'agent:mcpMoCauHinh' || kenh === 'agent:hookMoCauHinh') kn.moCuoi = { duong: '/tmp/x.json', ok: false }; return rong ? null : TRA[kenh] ?? null; },
    apTrinhDuyet: async () => kho.S.ws,
    datNguoi: () => undefined,
  };
  const ghiCb = (ten: string) => (...a: unknown[]) => { g.cb.push(`${ten}(${a.map((x) => JSON.stringify(x)).join(',')})`); return Promise.resolve(); };
  const b: BoiCanhLenh = {
    kho, kn: kn as unknown as BoiCanhLenh['kn'], thuMuc: '/tmp/duan', phienBan: '0.4.0',
    guiThat: (text) => { g.gui.push(text); },
    doiModel: ghiCb('doiModel') as BoiCanhLenh['doiModel'], doiMuc: ghiCb('doiMuc') as BoiCanhLenh['doiMuc'], doiCheDo: ghiCb('doiCheDo') as BoiCanhLenh['doiCheDo'],
    dsModel: () => MODEL_DU_PHONG, dsMuc: () => MUC_DU_PHONG,
    moMenu: ghiCb('moMenu') as BoiCanhLenh['moMenu'], moKhoaModel: ghiCb('moKhoaModel') as BoiCanhLenh['moKhoaModel'],
    datToanManHinh: ghiCb('datToanManHinh') as BoiCanhLenh['datToanManHinh'], datChuot: ghiCb('datChuot') as BoiCanhLenh['datChuot'],
    doiNgonNgu: ghiCb('doiNgonNgu') as BoiCanhLenh['doiNgonNgu'], doiTheme: ghiCb('doiTheme') as BoiCanhLenh['doiTheme'],
    datNhap: ghiCb('datNhap') as BoiCanhLenh['datNhap'], xoaManHinh: ghiCb('xoaManHinh') as BoiCanhLenh['xoaManHinh'],
    dangXuat: ghiCb('dangXuat') as BoiCanhLenh['dangXuat'], dangNhapLai: ghiCb('dangNhapLai') as BoiCanhLenh['dangNhapLai'], thoat: ghiCb('thoat') as BoiCanhLenh['thoat'],
  };
  return { b, g };
}

/** Lệnh nguy hiểm khi chạy trong test (đăng xuất xoá phiên thật / thoát) — chỉ kiểm có gọi đúng callback. */
const CHI_GOI: Record<string, string> = { '/logout': 'dangXuat', '/exit': 'thoat', '/login': 'dangNhapLai' };

/** Tham số mẫu theo lệnh. */
const THAM_SO: Record<string, string[]> = {
  '/model': ['opus'], '/effort': ['cao', 'high'], '/compact': ['giữ tên file'], '/plan': ['thêm nút đăng xuất'], '/review': ['src/api'],
  '/rewind': ['1'], '/resume': ['1', 'việc'], '/kynang': ['docker'], '/quyen': ['them npm test', 'xoa 1', 'add npm run lint'],
  '/sessions': [], '/rename': ['backend api'], '/worktree': ['list', 'tinh-nang-a', 'xoa /tmp/wt'], '/hen': ['huy h1', 'cancel'],
  '/mcp': ['mo', 'mở', 'nap'], '/copy': ['1', 'q', 'all'], '/browser': ['on', 'off'], '/fullscreen': ['on', 'off'], '/mouse': ['on', 'off'],
  '/language': ['en', 'vi'], '/theme': ['sang', 'dark'], '/add-dir': ['..'], '/ctwork': ['doc', 'ghi', 'off'],
};

test('mọi lệnh `/` trong /help: không ném, có phản hồi, giữ tham số — VI + EN', async () => {
  const bang: string[] = [];
  for (const nn of ['vi', 'en'] as const) {
    datNgonNgu(nn);
    for (const l of LENH_GOI_Y) {
      const bienThe = ['', ...(THAM_SO[l.ten] ?? [])];
      for (const ts of bienThe) {
        const cau = `${l.ten}${ts ? ` ${ts}` : ''}`;
        const { b, g } = taoBoiCanh();
        const truoc = b.kho.S.bang.length;
        let loi: Error | null = null;
        try { await chayLenh(cau, b); } catch (e) { loi = e as Error; }
        assert.equal(loi, null, `${nn} ${cau} ném: ${loi?.message}`);
        // Lỗi kiểu lập trình (đọc thuộc tính của null…) lọt ra thành câu trả lời = lỗi thật.
        const loiLapTrinh = b.kho.S.bang.slice(truoc).find((m) => /Cannot read properties|is not a function|undefined \(reading/.test(JSON.stringify(m)));
        assert.equal(loiLapTrinh, undefined, `${nn} ${cau}: ${JSON.stringify(loiLapTrinh)}`);
        const traLoi = b.kho.S.bang.slice(truoc).map((m) => ('text' in m ? String((m as { text?: unknown }).text) : ('tieuDe' in m ? String((m as { tieuDe?: unknown }).tieuDe) : m.loai))).join(' | ');
        const coPhanHoi = traLoi.length > 0 || g.cb.length > 0 || g.gui.length > 0 || g.kenh.length > 0;
        if (CHI_GOI[l.ten]) assert.ok(g.cb.some((x) => x.startsWith(CHI_GOI[l.ten]!)), `${cau} phải gọi ${CHI_GOI[l.ten]}`);
        else assert.ok(coPhanHoi, `${nn} ${cau}: không có phản hồi nào`);
        // Lệnh "không phản hồi bằng chữ" vẫn phải có hiệu ứng (menu / gửi agent / gọi lõi).
        bang.push(`${nn} ${cau.padEnd(28)} → ${(traLoi || g.cb.join(' ') || g.gui.map((x) => `gửi agent: ${x.slice(0, 40)}`).join(' ') || g.kenh.map(([k]) => k).join(',')).replace(/\s+/g, ' ').slice(0, 110)}`);
        // ── Không vứt tham số ──
        const kenh = (k: string) => g.kenh.filter(([x]) => x === k).map(([, d]) => JSON.stringify(d ?? {})).join(' ');
        if (cau === '/mcp mo' || cau === '/mcp mở') assert.ok(g.kenh.some(([k]) => k === 'agent:mcpMoCauHinh'), `${cau} phải MỞ file cấu hình, không in danh sách`);
        if (cau === '/compact giữ tên file') assert.match(kenh('agent:compact'), /giữ tên file/);
        if (cau.startsWith('/plan ')) assert.ok(g.gui.some((x) => x.includes('thêm nút đăng xuất')), '/plan phải gửi nguyên việc');
        if (cau.startsWith('/review ')) assert.ok(g.gui.some((x) => x.includes('src/api')), '/review phải giữ phạm vi');
        if (cau === '/quyen them npm test') assert.match(kenh('agent:themTienTo'), /npm test/);
        if (cau === '/quyen add npm run lint') assert.match(kenh('agent:themTienTo'), /npm run lint/);
        if (cau === '/quyen xoa 1') assert.match(kenh('agent:xoaQuyenLau'), /npm test/, '/quyen xoa <số> ⇒ đúng mục số đó');
        if (cau === '/rename backend api') assert.match(kenh('agent:doiTenPhienMang'), /backend api/);
        if (cau === '/worktree tinh-nang-a') assert.match(kenh('agent:taoWorktree'), /tinh-nang-a/);
        if (cau === '/hen huy h1') assert.match(kenh('agent:huyHen'), /h1/);
        if (cau === '/ctwork ghi') assert.match(kenh('agent:ctwork'), /"quyen":"ghi"/);
        if (cau === '/effort cao' || cau === '/effort high') assert.ok(g.cb.some((x) => x.startsWith('doiMuc(')), `${cau} phải đổi mức`);
        if (cau === '/model opus') assert.ok(g.cb.some((x) => /doiModel|moKhoaModel|moMenu/.test(x)), `${cau} phải đổi/chọn model`);
        if (cau === '/mouse on') assert.ok(g.cb.includes('datChuot(true)'));
        if (cau === '/fullscreen off') assert.ok(g.cb.includes('datToanManHinh(false)'));
      }
    }
  }
  datNgonNgu('vi');
  // Bảng kết quả từng lệnh (để ghi báo cáo): `node --test` in ở phần diagnostic.
  console.log(`\n${bang.join('\n')}\n`);
});

test('lõi trả null/lỗi cho MỌI kênh (lõi cũ, lõi giả): không lệnh nào lộ lỗi lập trình', async () => {
  const hong: string[] = [];
  for (const nn of ['vi', 'en'] as const) {
    datNgonNgu(nn);
    for (const l of LENH_GOI_Y) {
      if (CHI_GOI[l.ten]) continue;
      for (const ts of ['', ...(THAM_SO[l.ten] ?? [])]) {
        const cau = `${l.ten}${ts ? ` ${ts}` : ''}`;
        const { b } = taoBoiCanh(true);
        await chayLenh(cau, b);
        const loi = b.kho.S.bang.find((m) => /Cannot read properties|is not a function|is not iterable|undefined \(reading/.test(JSON.stringify(m)));
        if (loi) hong.push(`${nn} ${cau}: ${JSON.stringify(loi).slice(0, 160)}`);
      }
    }
  }
  datNgonNgu('vi');
  assert.deepEqual(hong, []);
});
