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
let ws = { path: process.cwd(), name: require('node:path').basename(process.cwd()), branch: 'main', cheDoQuyen: 'keHoach', mucNoLuc: 'vua', model: 'sonnet-5', choSua: false, choChayLenh: false };
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

async function kichBan(text) {
  huy = false;
  lanGui += 1;
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
  async datThuMuc(id, duong) { ws = { ...ws, path: duong, name: require('node:path').basename(duong), cheDoQuyen: 'keHoach' }; return ws; },
  async moDuPhong(mk) { if (mk !== 'dung') throw new Error('Sai mật khẩu cổng dự phòng.'); return 'cổng dự phòng (modelapi)'; },
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
        ],
        mucNoLuc: [{ id: 'thap', ten: 'Thấp', buoc: 8, viecPhu: 1 }, { id: 'vua', ten: 'Vừa', buoc: 30, viecPhu: 3 }, { id: 'cao', ten: 'Cao', buoc: 60, viecPhu: 3 }, { id: 'ratCao', ten: 'Rất cao', buoc: 100, viecPhu: 5 }],
      };
      case 'agent:datCheDoQuyen': ws = { ...ws, cheDoQuyen: d.cheDo }; return ws;
      case 'agent:datModel': ws = { ...ws, model: d.model }; return null;
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
