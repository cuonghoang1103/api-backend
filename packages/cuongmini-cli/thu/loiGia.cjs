/**
 * LÕI GIẢ cho CuongMini CLI — cùng mặt giao tiếp `LoiApi` với `dist/loi.cjs`
 * nhưng không gọi máy chủ nào: mỗi câu hỏi phát một kịch bản sự kiện mẫu
 * (nghĩ → kế hoạch → đọc file → xin phép sửa (diff) → chạy lệnh (đầu ra chảy)
 * → trả lời markdown có bảng + khối code → xong).
 *
 * Dùng để chụp màn hình / thử giao diện mà KHÔNG đăng nhập tài khoản thật:
 *   CUONGMINI_LOI=thu/loiGia.cjs node dist/cuongmini.mjs
 * `LOI_GIA_NHANH=1` rút ngắn mọi khoảng chờ.
 */
'use strict';

let vo = null;
let cuoc = 'cuoc-gia-1';
let ws = { path: process.cwd(), name: require('node:path').basename(process.cwd()), branch: 'main', cheDoQuyen: 'hoi', mucNoLuc: 'vua', model: 'sonnet-5', choSua: false, choChayLenh: false };
let choDuyet = null;
let huy = false;
let lanGui = 0;
const nhanh = process.env.LOI_GIA_NHANH === '1';
const ngu = (ms) => new Promise((r) => setTimeout(r, nhanh ? Math.min(ms, 30) : ms));
const phat = (e) => vo && vo.phatSuKien('agent:event', { cuocId: cuoc, ...e });

const DIFF = {
  soThem: 4, soBo: 1, quaLon: false,
  dong: [
    { loai: 'giu', soCu: 10, soMoi: 10, text: "import { z } from 'zod';" },
    { loai: 'giu', soCu: 11, soMoi: 11, text: '' },
    { loai: 'bo', soCu: 12, soMoi: null, text: 'export const laEmail = (s: string) => s.includes("@");' },
    { loai: 'them', soCu: null, soMoi: 12, text: '/** Kiểm email theo RFC 5322 (rút gọn) — chặn cả "a@" và "@b". */' },
    { loai: 'them', soCu: null, soMoi: 13, text: 'export function laEmail(s: string): boolean {' },
    { loai: 'them', soCu: null, soMoi: 14, text: '  return z.string().email().safeParse(s.trim()).success;' },
    { loai: 'them', soCu: null, soMoi: 15, text: '}' },
    { loai: 'giu', soCu: 13, soMoi: 16, text: '' },
  ],
};

const TRA_LOI = `## Đã sửa xong \`laEmail\`

Hàm cũ chỉ kiểm có dấu \`@\` nên **"a@"** cũng lọt. Giờ dùng \`zod\`:

| Đầu vào | Trước | Sau |
|---|---|---|
| \`cuong@cuongthai.com\` | ✓ | ✓ |
| \`a@\` | ✓ (sai) | ✗ |
| \` x@y.vn \` | ✗ | ✓ (tự cắt khoảng trắng) |

\`\`\`ts
export function laEmail(s: string): boolean {
  // 42 là số test đã chạy qua
  return z.string().email().safeParse(s.trim()).success;
}
\`\`\`

- Đã chạy \`npm test\`: **12/12** qua
- Không đổi API công khai — chỗ gọi cũ giữ nguyên
`;

/**
 * Kịch bản AGENT PHỤ chạy song song + một lệnh nền — ĐÚNG thứ tự sự kiện của lõi thật
 * (`loop.ts › chayViecPhu`): toolBatDau → tool không id (nhiệm vụ cắt 60) → phuBatDau →
 * phuSuKien… → phuXong (tomTat = câu trả lời) → tool có id ("xong (n/N)").
 */
async function kichBanPhu() {
  phat({ loai: 'batDau', model: 'sonnet-5', buoc: 1, tranBuoc: 60 });
  await ngu(800);
  for (const m of ['Việc này lớn — mình giao ', 'hai agent phụ chạy song song ', 'và bật dev server ở nền.']) { phat({ loai: 'chu', delta: m }); await ngu(100); }
  phat({ loai: 'keHoach', viec: [{ ten: 'Khảo sát API cũ', trangThai: 'dang' }, { ten: 'Soát bảo mật', trangThai: 'dang' }, { ten: 'Tổng hợp', trangThai: 'cho' }] });
  const giao = (id, loai, nv) => {
    phat({ loai: 'toolBatDau', id, ten: 'giao_viec_phu', vong: 'may' });
    phat({ loai: 'tool', ten: 'giao_viec_phu', tomTat: `${loai ? `[${loai}] ` : ''}${nv.slice(0, 60)}…`, vong: 'may' });
    phat({ loai: 'phuBatDau', phuId: id, kieuAgent: loai || 'general-purpose', nhiemVu: nv, model: ws.model });
  };
  giao('call_g1', '', 'Tìm mọi chỗ gọi `fetch` tới /api/v1/** trong src/, liệt kê file:dòng, đánh dấu chỗ thiếu xử lý lỗi.');
  giao('call_g2', 'code-reviewer', 'Soát src/auth/** tìm lỗ hổng: token lộ ra log, so sánh chuỗi không hằng thời gian, thiếu kiểm hạn.');
  phat({ loai: 'toolBatDau', id: 'n1', ten: 'chay_lenh_nen', vong: 'may' });
  phat({ loai: 'tool', id: 'n1', ten: 'chay_lenh_nen', tomTat: 'nền dev01', vong: 'may', chiTiet: 'Đã khởi động ở nền, mã "dev01".', lenh: 'npm run dev' });
  for (const id of ['call_g1', 'call_g2']) {
    phat({ loai: 'phuSuKien', phuId: id, e: { loai: 'batDau', model: 'claude-haiku-4-5', buoc: 1, tranBuoc: 30 } });
    phat({ loai: 'phuSuKien', phuId: id, e: { loai: 'nghi' } });
  }
  await ngu(700);
  const buoc = [
    ['call_g1', 'grep', null, '38 kết quả'], ['call_g2', 'glob', null, '14 file'], ['call_g1', 'read_file', 'src/api/client.ts', '210/210 dòng'],
    ['call_g2', 'read_file', 'src/auth/token.ts', '96/96 dòng'], ['call_g1', 'read_file', 'src/pages/orders.tsx', '340/340 dòng'],
    ['call_g2', 'grep', null, '3 kết quả'], ['call_g1', 'grep', null, '9 kết quả'], ['call_g2', 'read_file', 'src/auth/session.ts', '120/120 dòng'],
  ];
  let k = 0;
  for (const [id, ten, duong, tt] of buoc) {
    if (huy) return;
    k += 1;
    phat({ loai: 'phuSuKien', phuId: id, e: { loai: 'toolBatDau', id: `p${k}`, ten, vong: 'may' } });
    await ngu(900);
    phat({ loai: 'phuSuKien', phuId: id, e: { loai: 'tool', id: `p${k}`, ten, tomTat: tt, vong: 'may', ...(duong ? { duongDan: duong } : {}) } });
    phat({ loai: 'phuSuKien', phuId: id, e: { loai: 'xong', hanMuc: null, tienUsd: 0.0011, daLuoc: 0, soFileDaSua: 0 } });
  }
  phat({ loai: 'toolBatDau', id: 'n2', ten: 'doc_dau_ra_nen', vong: 'may' });
  phat({ loai: 'tool', id: 'n2', ten: 'doc_dau_ra_nen', tomTat: 'đang chạy (9s)', vong: 'may', chiTiet: 'Lệnh: npm run dev\nTrạng thái: đang chạy (9s)\n\n> demo@1.0.0 dev\n> vite\n\n  VITE v6.0.0  ready in 412 ms\n  ➜  Local:   http://localhost:5173/' });
  await ngu(1500);
  const kq1 = '**38 chỗ** gọi API; **6 chỗ** thiếu `try/catch`: orders.tsx:88, client.ts:41…';
  phat({ loai: 'phuSuKien', phuId: 'call_g1', e: { loai: 'chu', delta: kq1 } });
  phat({ loai: 'phuXong', phuId: 'call_g1', ok: true, tomTat: kq1, tienUsd: 0.0046, tokenVao: 41_200, tokenRa: 2_300 });
  phat({ loai: 'tool', id: 'call_g1', ten: 'giao_viec_phu', tomTat: 'xong (1/3)', vong: 'may', chiTiet: `KẾT QUẢ VIỆC PHỤ — "Tìm mọi chỗ gọi fetch"\n\n${kq1}\n- src/pages/orders.tsx:88\n- src/api/client.ts:41` });
  await ngu(2500);
  const kq2 = 'Không thấy token lộ ra log. `session.ts:57` so sánh chuỗi bằng `===` — nên dùng `timingSafeEqual`.';
  phat({ loai: 'phuSuKien', phuId: 'call_g2', e: { loai: 'chu', delta: kq2 } });
  phat({ loai: 'phuXong', phuId: 'call_g2', ok: true, tomTat: kq2, tienUsd: 0.0039, tokenVao: 30_100, tokenRa: 1_500 });
  phat({ loai: 'tool', id: 'call_g2', ten: 'giao_viec_phu', tomTat: 'xong (2/3)', vong: 'may', chiTiet: `KẾT QUẢ VIỆC PHỤ — "Soát src/auth"\n\n${kq2}` });
  phat({ loai: 'keHoach', viec: [{ ten: 'Khảo sát API cũ', trangThai: 'xong' }, { ten: 'Soát bảo mật', trangThai: 'xong' }, { ten: 'Tổng hợp', trangThai: 'xong' }] });
  for (const m of ['## Tổng hợp\n\n- 6 chỗ gọi API thiếu xử lý lỗi\n', '- `session.ts:57` nên dùng `timingSafeEqual`\n']) { phat({ loai: 'chu', delta: m }); await ngu(120); }
  phat({ loai: 'xong', hanMuc: { daDung: 1, tran: 2, phanTram: 62, hoiLucNao: null }, tienUsd: 0.0187, daLuoc: 0, soFileDaSua: 0, nguCanh: { kyTu: 1, tran: 2, phanTram: 31, soLuotDaBo: 0 } });
}

// ─── Cổng Claude chính hãng (docs/cong-anthropic-chinh-hang.md) ───
let veCH = false;
let veDp = false;
let congPhu = null;
let modelDp = 'gpt-6-sol';
const CL_CAO = new Set(['cl-sonnet-5-5', 'cl-opus-5-5', 'cl-fable-5-1']);
const cacCong = () => [
  { cong: 'anthropic', ten: 'Anthropic chính hãng', daBat: true, canMatKhau: !veCH, models: [
    { id: 'cl-sonnet-5-5', ten: 'Claude Sonnet 5.5 · chính hãng', mo: 'Cân bằng, thinking', dungDuoc: true },
    { id: 'cl-opus-5-5', ten: 'Claude Opus 5.5 · chính hãng', mo: 'Mạnh nhất', dungDuoc: true },
    { id: 'cl-fable-5-1', ten: 'Claude Fable 5.1 · chính hãng', mo: 'Rất đắt', dungDuoc: true, dat: true },
  ] },
  { cong: 'modelapi', ten: 'modelapi', daBat: true, canMatKhau: !veDp, models: [
    { id: 'gpt-6-sol', ten: 'GPT 6 Sol', mo: 'Nhìn được ảnh, rẻ trong vòng lặp', dungDuoc: true },
    { id: 'gpt-6-astra', ten: 'GPT 6 Astra', mo: 'Nhanh', dungDuoc: true },
  ] },
];
const ngoiTraLoi = async (model, chu) => {
  phat({ loai: 'batDau', model, buoc: 1, tranBuoc: 30 });
  await ngu(400);
  phat({ loai: 'nghi' });
  await ngu(2600);
  for (let i = 0; i < chu.length; i += 20) { if (huy) return; phat({ loai: 'chu', delta: chu.slice(i, i + 20) }); await ngu(40); }
  phat({ loai: 'xong', hanMuc: null, tienUsd: 0.0042, daLuoc: 0, soFileDaSua: 0 });
};

/** Lượt đi cổng nào — giống máy chủ: cl-* cao không vé ⇒ 403 KHOA; tab chọn modelapi ⇒ GPT. */
async function kichBanCong(text) {
  if (CL_CAO.has(ws.model) && !veCH) {
    await ngu(300);
    phat({ loai: 'loi', ma: 'CONG_ANTHROPIC_KHOA', thongDiep: 'Claude Opus 5.5 · chính hãng cần mật khẩu cổng Claude chính hãng. Nhập mật khẩu do quản trị cấp để mở khoá.', daBat: true });
    return true;
  }
  if (/hethanmuc|het han muc/i.test(text)) {
    await ngu(300);
    phat({ loai: 'loi', ma: 'CONG_ANTHROPIC_HET_HAN_MUC', thongDiep: 'Bạn đã dùng hết hạn mức tháng của cổng Claude chính hãng (20 $). Hạn mức làm mới ngày 1.' });
    return true;
  }
  if (/free|sự cố|su co/i.test(text) && congPhu !== 'modelapi') {
    phat({ loai: 'batDau', model: 'claude-haiku-5-5', buoc: 1, tranBuoc: 30 });
    await ngu(300);
    phat({ loai: 'loi', ma: 'CONG_CHINH_HONG_FREE', thongDiep: 'Cổng chính đang gặp sự cố — đang tự chuyển sang model CuongMini Free.', moiNangCap: true, cacCong: cacCong() });
    await ngu(300);
    phat({ loai: 'nghi' });
    await ngu(2600);
    const chu = 'Mình đang trả lời bằng **CuongMini Free** (Claude Haiku 5.5). Câu hỏi của bạn: hàm `laEmail` nên dùng `zod` để kiểm.';
    for (let i = 0; i < chu.length; i += 20) { if (huy) return true; phat({ loai: 'chu', delta: chu.slice(i, i + 20) }); await ngu(40); }
    phat({ loai: 'xong', hanMuc: null, tienUsd: 0.0006, daLuoc: 0, soFileDaSua: 0 });
    if (/song lai|sống lại/i.test(text)) { await ngu(600); phat({ loai: 'loi', ma: 'RAMBO_SONG_LAI', thongDiep: 'Cổng chính CuongMini đã hoạt động lại. Bạn muốn làm tiếp ở cổng chính hay ở lại CuongMini Free?' }); }
    return true;
  }
  if (congPhu === 'modelapi') { await ngoiTraLoi(modelDp, `Trả lời qua **modelapi** (${modelDp}).`); return true; }
  if (CL_CAO.has(ws.model)) { await ngoiTraLoi(ws.model.replace(/^cl-/, 'claude-'), `Trả lời qua **Claude chính hãng** (${ws.model}) — có thinking.`); return true; }
  return false;
}

async function kichBan(text) {
  huy = false;
  lanGui += 1;
  if (/agent|song song|parallel/i.test(text)) { await kichBanPhu(); return; }
  if (await kichBanCong(text)) return;
  if (/baotri/i.test(text)) {
    await ngu(400);
    phat({ loai: 'loi', ma: 'RAMBO_BAO_TRI', thongDiep: 'Cổng AI chính đang bảo trì (dự kiến 10 phút).' });
    return;
  }
  phat({ loai: 'batDau', model: 'sonnet-5', buoc: 1, tranBuoc: 60 });
  await ngu(1800);
  for (const m of ['Mình sẽ xem ', 'cấu trúc dự án, ', 'sửa hàm `laEmail` ', 'rồi chạy test nhé.']) { phat({ loai: 'chu', delta: m }); await ngu(120); }
  phat({ loai: 'keHoach', viec: [{ ten: 'Đọc cấu trúc dự án', trangThai: 'dang' }, { ten: 'Sửa hàm laEmail', trangThai: 'cho' }, { ten: 'Chạy npm test', trangThai: 'cho' }] });
  phat({ loai: 'toolBatDau', id: 't1', ten: 'read_file', vong: 'may' });
  await ngu(700);
  phat({ loai: 'tool', id: 't1', ten: 'read_file', tomTat: '120/120 dòng', vong: 'may', duongDan: 'src/email.ts', chiTiet: '…' });
  phat({ loai: 'batDau', model: 'sonnet-5', buoc: 2, tranBuoc: 60 });
  phat({ loai: 'keHoach', viec: [{ ten: 'Đọc cấu trúc dự án', trangThai: 'xong' }, { ten: 'Sửa hàm laEmail', trangThai: 'dang' }, { ten: 'Chạy npm test', trangThai: 'cho' }] });
  await ngu(900);
  if (huy) return;
  phat({ loai: 'toolBatDau', id: 't2', ten: 'edit_file', vong: 'may' });
  const tuDuyet = ws.cheDoQuyen === 'tuSua' || ws.cheDoQuyen === 'tuSuaVaLenh' || ws.cheDoQuyen === 'boQuaHet';
  let dongY = true;
  if (!tuDuyet) {
    phat({ loai: 'xinPhep', id: 'p1', ten: 'edit_file', duongDan: 'src/email.ts', taoMoi: false, diff: DIFF });
    dongY = await new Promise((r) => { choDuyet = r; });
    phat({ loai: 'xongXinPhep', id: 'p1', dongY });
  }
  phat({ loai: 'tool', id: 't2', ten: 'edit_file', tomTat: dongY ? `+4 −1${tuDuyet ? ' (tự duyệt)' : ''}` : 'bị từ chối', vong: 'may', duongDan: 'src/email.ts', ...(dongY ? { diff: DIFF } : {}) });
  phat({ loai: 'batDau', model: 'sonnet-5', buoc: 3, tranBuoc: 60 });
  phat({ loai: 'keHoach', viec: [{ ten: 'Đọc cấu trúc dự án', trangThai: 'xong' }, { ten: 'Sửa hàm laEmail', trangThai: 'xong' }, { ten: 'Chạy npm test', trangThai: 'dang' }] });
  await ngu(500);
  phat({ loai: 'toolBatDau', id: 't3', ten: 'run_command', vong: 'may' });
  if (ws.cheDoQuyen !== 'tuSuaVaLenh' && ws.cheDoQuyen !== 'boQuaHet') {
    phat({ loai: 'xinPhepLenh', id: 'p2', lenh: 'npm test', phanLoai: { muc: 'thuong', lyDo: [], choNho: true } });
    const ok = await new Promise((r) => { choDuyet = r; });
    phat({ loai: 'xongXinPhep', id: 'p2', dongY: ok });
    if (!ok) { phat({ loai: 'tool', id: 't3', ten: 'run_command', tomTat: 'bị từ chối', vong: 'may' }); }
  }
  const ra = ['\n> demo@1.0.0 test\n> node --test\n\n', '▶ laEmail\n', '  ✔ nhận email hợp lệ (0.4ms)\n', '  ✔ chặn "a@" (0.1ms)\n', '  ✔ cắt khoảng trắng (0.1ms)\n', '▶ laEmail (1.2ms)\n', 'ℹ tests 12\nℹ pass 12\nℹ fail 0\n'];
  let tong = '';
  for (const r of ra) { if (huy) return; phat({ loai: 'lenhRa', mau: r }); tong += r; await ngu(450); }
  phat({ loai: 'tool', id: 't3', ten: 'run_command', tomTat: 'xong 3s', vong: 'may', chiTiet: `$ npm test\n(mã thoát 0 · 3.1s)\n\n${tong}` });
  phat({ loai: 'keHoach', viec: [{ ten: 'Đọc cấu trúc dự án', trangThai: 'xong' }, { ten: 'Sửa hàm laEmail', trangThai: 'xong' }, { ten: 'Chạy npm test', trangThai: 'xong' }] });
  phat({ loai: 'batDau', model: 'sonnet-5', buoc: 4, tranBuoc: 60 });
  await ngu(600);
  for (let i = 0; i < TRA_LOI.length; i += 24) { if (huy) return; phat({ loai: 'chu', delta: TRA_LOI.slice(i, i + 24) }); await ngu(40); }
  phat({ loai: 'xong', hanMuc: null, tienUsd: 0.0123, daLuoc: 0, soFileDaSua: 1, nguCanh: { kyTu: 138000, tran: 600000, phanTram: 23, soLuotDaBo: 0 } });
}

module.exports = {
  khoiDong(v) { vo = v; },
  datPhien() {},
  async datThuMuc(id, duong) { ws = { ...ws, path: duong, name: require('node:path').basename(duong), cheDoQuyen: 'hoi', choTrinhDuyet: true }; return ws; },
  async moDuPhong(mk) { if (mk !== 'dung') throw new Error('Sai mật khẩu cổng dự phòng.'); veDp = true; return 'cổng dự phòng (modelapi)'; },
  async moCongAnthropic(mk) { if (mk !== 'dung') throw new Error('Sai mật khẩu.'); veCH = true; return { ten: 'Claude chính hãng', hetHan: Date.now() + 30 * 864e5 }; },
  async chuanHoaAnh(d) { return d; },
  async goi(kenh, d) {
    switch (kenh) {
      case 'agent:taoCuoc': return cuoc;
      case 'agent:getWorkspace': return ws;
      case 'agent:getInfo': return {
        pro: true, configured: true, model: ws.model,
        models: [
          { id: 'sonnet-5', ten: 'Claude Sonnet 5', mo: 'Mặc định — nhanh, rẻ', dungDuoc: true },
          { id: 'opus-4-8', ten: 'Claude Opus 4.8', mo: 'Mạnh nhất cho việc khó', dungDuoc: true },
          { id: 'gpt-sol', ten: 'GPT 6 Sol', mo: 'Ý kiến thứ hai', dungDuoc: true },
          { id: 'fable-5', ten: 'Claude Fable 5', mo: 'Đắt ×3,5', dungDuoc: true, dat: true },
          { id: 'cl-free', ten: 'CuongMini Free', mo: 'Tự bật khi cổng chính gặp sự cố', dungDuoc: true, cong: 'anthropic', hang: 'free', mienPhi: true, canMoKhoa: false },
          { id: 'cl-sonnet-5-5', ten: 'Claude Sonnet 5.5 · chính hãng', mo: 'Cân bằng, thinking', dungDuoc: true, cong: 'anthropic', hang: 'cao', canMoKhoa: !veCH },
          { id: 'cl-opus-5-5', ten: 'Claude Opus 5.5 · chính hãng', mo: 'Mạnh nhất', dungDuoc: true, cong: 'anthropic', hang: 'cao', canMoKhoa: !veCH },
          { id: 'cl-fable-5-1', ten: 'Claude Fable 5.1 · chính hãng', mo: 'Rất đắt', dungDuoc: true, cong: 'anthropic', hang: 'cao', canMoKhoa: !veCH, dat: true },
        ].map((m) => (m.cong ? m : { ...m, cong: 'rambo' })),
        mucNoLuc: [{ id: 'thap', ten: 'Thấp', buoc: 8, viecPhu: 1 }, { id: 'vua', ten: 'Vừa', buoc: 30, viecPhu: 3 }, { id: 'cao', ten: 'Cao', buoc: 60, viecPhu: 3 }, { id: 'ratCao', ten: 'Rất cao', buoc: 100, viecPhu: 5 }],
      };
      case 'agent:datCheDoQuyen': ws = { ...ws, cheDoQuyen: d.cheDo }; return ws;
      case 'agent:datCheDoTrinhDuyet': ws = { ...ws, choTrinhDuyet: d.bat }; return ws;
      case 'agent:datModel': ws = { ...ws, model: d.model }; return null;
      case 'agent:moCongAnthropic': return module.exports.moCongAnthropic(d.matKhau);
      case 'agent:congAnthropic': return { coKey: true, daBat: true, laAdmin: false, veHopLe: veCH, modelCaoDuoc: veCH, congChinhDangHong: false, cacCong: cacCong(), coVe: veCH };
      case 'agent:datCongPhu': congPhu = d.cong; if (d.model) modelDp = d.model; return null;
      case 'agent:veCongChinh': congPhu = null; return null;
      case 'agent:datMucNoLuc': ws = { ...ws, mucNoLuc: d.muc }; return null;
      case 'agent:lenhDuAn': return [{ ten: '/trien-khai', mo: 'Triển khai lên VPS', than: 'Triển khai: $ARGUMENTS' }];
      case 'agent:send': void kichBan(String(d.text)); return null;
      case 'agent:traLoiXinPhep': { const f = choDuyet; choDuyet = null; f && f(d.quyetDinh !== 'tuChoi'); return null; }
      case 'agent:cancel': huy = true; if (choDuyet) { const f = choDuyet; choDuyet = null; f(false); } setTimeout(() => phat({ loai: 'huy' }), 50); return null;
      case 'agent:reset': return null;
      case 'agent:dsPhien': return [
        { id: 'a1', tieuDe: 'Sửa lỗi đăng nhập Google', duAn: ws.name, luucLuc: Date.now() - 3600e3, soTinNhan: 14, ghim: true },
        { id: 'a2', tieuDe: 'Thêm trang cài đặt', duAn: ws.name, luucLuc: Date.now() - 86400e3, soTinNhan: 8 },
        { id: 'a3', tieuDe: 'Viết test cho API', duAn: 'khac', luucLuc: Date.now() - 3 * 86400e3, soTinNhan: 22 },
      ];
      case 'agent:moPhien': return { muc: [{ kieu: 'nguoi', text: 'Sửa lỗi đăng nhập Google' }, { kieu: 'tool', ten: 'read_file', tomTat: '80/80 dòng' }, { kieu: 'may', text: 'Đã sửa: callback thiếu `state`.' }] };
      case 'agent:hoanTac': return { soFile: 1, loi: [] };
      case 'agent:nguCanhChiTiet': return { deBai: 12000, lichSu: 30000, ketQuaTool: 90000, soAnh: 0, byteAnh: 0, tong: 132000, soTin: 18, soLuot: 3, tongGui: 132000, tomTat: null };
      case 'agent:chanDoan': return [{ ten: 'Mạng', muc: 'ok', chiTiet: 'tới được máy chủ' }, { ten: 'Cổng AI', muc: 'canh', chiTiet: 'lõi giả — không gọi thật' }];
      case 'agent:dsQuyenLau': return { goc: ws.path, khoa: [] };
      case 'agent:boNhoDs': return [];
      case 'agent:mcpTrangThai': return { duongDan: '~/.cuongmini/data/mcp.json', server: [] };
      case 'agent:compact': return { ok: true, soTinDaGop: 0 };
      default: return null;
    }
  },
};
