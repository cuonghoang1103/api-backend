/**
 * Khung chat CuongMini Code trong VS Code. DOM thuần (nhẹ, không React) — nhận
 * sự kiện AI Code từ extension và vẽ: chữ chảy (markdown), dòng tool, thẻ duyệt
 * (sửa file / lệnh / git / MCP / ghi chú), kế hoạch, kết quả lệnh; cộng phần
 * "làm việc" như Claude Code: lịch sử việc, lệnh `/`, nhắc file bằng `@`, kéo
 * thả file/thư mục, chọn model/mức/chế độ ngay dưới ô chat, mic, giờ gửi,
 * dòng trạng thái "đang làm gì".
 *
 * ⚠️ Chữ của model đi qua `marked` rồi `DOMPurify` — webview vẫn là trình
 * duyệt, chèn HTML thô của model là cửa cho mã lạ.
 */
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { LENH_AGENT, chuanHoa, tachLenh, type LenhGach } from 'ct-lenh';
import { gui, goi, nhanKetQua } from './rpc';
import { chayLenh, giaoDienCtwVsc, type BoiCanhLenh } from './lenh';
import { hoiGanDoan, homNay as homNayCtw, hoiCtworkMotLan, kiemTinCtw, laLoiXacThucCtw, veDongCtw, xongViec as xongViecCtw, type DongCtw } from '../../../desktop/src/renderer/features/chat/ctworkLenh';

type SuKien = { loai: string; [k: string]: any };
type Muc = { kieu: string; text?: string; ten?: string; tomTat?: string; anh?: string[]; [k: string]: unknown };
type ModelMuc = {
  id: string; ten: string; mo: string; dungDuoc: boolean; dat?: boolean;
  /** Cổng (17/10/2026): `anthropic` = Claude chính hãng; còn lại = cổng chính. */
  cong?: 'rambo' | 'modelapi' | 'anthropic';
  /** Model cần khoá chưa có vé ⇒ TỐI HƠN + ổ khoá, chọn là hỏi khoá. */
  canMoKhoa?: boolean;
  /** 19/10/2026: tài khoản miễn phí — model cần gói Pro (chỉ CuongMini Default dùng được). */
  canPro?: boolean;
  mienPhi?: boolean;
  /** 18/10/2026: mô tả tiếng Anh + tên cổng hiển thị (CuongMini …). */
  moEn?: string;
  nhom?: string;
};
/** Một cổng trong lời mời khi cổng chính hỏng (khung `cong` `CONG_CHINH_HONG_FREE`). */
type CongNangCap = { cong: 'anthropic' | 'modelapi'; ten: string; daBat: boolean; canMatKhau: boolean; models: ModelMuc[] };
type MucNoLuc = { id: string; ten: string; mo: string };

// ─── Hằng ────────────────────────────────────────────────────────

const CHE_DO: Array<{ id: string; ten: string; ngan: string; mo: string; icon: string }> = [
  { id: 'keHoach', ten: 'Lập kế hoạch', ngan: 'Kế hoạch', mo: 'Chỉ đọc — không sửa, không chạy lệnh', icon: '📝' },
  { id: 'hoi', ten: 'Hỏi trước mọi việc', ngan: 'Hỏi trước', mo: 'Mỗi lần sửa/chạy lệnh đều hỏi bạn', icon: '✋' },
  { id: 'tuSua', ten: 'Tự sửa file', ngan: 'Tự sửa', mo: 'Sửa file không hỏi, lệnh vẫn hỏi', icon: '✏️' },
  { id: 'tuSuaVaLenh', ten: 'Tự sửa + lệnh an toàn', ngan: 'Tự động', mo: 'Sửa + chạy lệnh an toàn không hỏi', icon: '⚡' },
  { id: 'boQuaHet', ten: 'Bỏ qua tất cả', ngan: 'Bỏ qua hết', mo: 'Không hỏi gì — chỉ dùng khi tin tưởng', icon: '🚀' },
];
/** Chỉ khi máy chủ CŨ chưa khai `models` (18/10/2026: máy chủ gửi bảng CuongMini). */
const MODEL_DU_PHONG: ModelMuc[] = [
  { id: 'cm-default', ten: 'CuongMini Default', mo: 'Mặc định', dungDuoc: true },
];
const MUC_DU_PHONG: MucNoLuc[] = [
  { id: 'thap', ten: 'Thấp', mo: 'hỏi nhanh' }, { id: 'vua', ten: 'Vừa', mo: 'mặc định' }, { id: 'cao', ten: 'Cao', mo: 'đọc rộng, tự test' },
  { id: 'ratCao', ten: 'Rất cao', mo: 'nhiều agent phụ' }, { id: 'toiDa', ten: 'Tối đa', mo: 'việc rất lớn' },
];
/** Câu chờ lúc model đang nghĩ (chưa gọi tool, chưa có chữ) — đổi mỗi vài giây cho thấy nó còn sống. */
const NGHI = ['Đang suy nghĩ', 'Đang ngẫm nghĩ', 'Đang sắp xếp ý', 'Đang lục trí nhớ', 'Đang cân nhắc', 'Đang phân tích', 'Đang tìm cách hay nhất', 'Đang học ngữ cảnh'];
const SAO = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];

const VIEC_TOOL: Record<string, string> = {
  read_file: 'Đang đọc file', list_dir: 'Đang xem thư mục', grep: 'Đang tìm trong mã', glob: 'Đang tìm file',
  edit_file: 'Đang code', create_file: 'Đang tạo file', sua_nhieu_cho: 'Đang code', xoa_file: 'Đang xoá file', doi_ten_file: 'Đang đổi tên file',
  run_command: 'Đang chạy lệnh', chay_lenh_nen: 'Đang chạy lệnh nền', git_status: 'Đang xem git', git_diff: 'Đang xem thay đổi',
  git_commit: 'Đang commit', git_day: 'Đang đẩy lên GitHub', tao_pr: 'Đang mở Pull Request', github_ket_noi: 'Đang kết nối GitHub',
  github_dang_du_an: 'Đang đưa dự án lên GitHub', cai_cong_cu: 'Đang cài công cụ', web_mo: 'Đang mở trang web', web_doc: 'Đang đọc trang web',
  doc_web: 'Đang đọc trang web', tim_web: 'Đang tra cứu trên web', giao_viec_phu: 'Agent phụ đang làm', cap_nhat_ke_hoach: 'Đang lập kế hoạch',
  dung_ky_nang: 'Đang dùng skill', ghi_nho: 'Đang ghi nhớ bài học', doc_anh: 'Đang xem ảnh', sua_anh: 'Đang sửa ảnh',
};
const TOOL_GHI = new Set(['edit_file', 'create_file', 'sua_nhieu_cho', 'xoa_file', 'doi_ten_file']);
const NHAN_TOOL: Record<string, string> = {
  read_file: 'Đọc', list_dir: 'Thư mục', grep: 'Tìm', glob: 'Tìm file', edit_file: 'Sửa', create_file: 'Tạo',
  sua_nhieu_cho: 'Sửa', xoa_file: 'Xoá', doi_ten_file: 'Đổi tên', run_command: 'Lệnh', chay_lenh_nen: 'Lệnh nền',
  git_status: 'Git', git_diff: 'Diff', git_commit: 'Commit', git_day: 'Đẩy GitHub', tao_pr: 'Pull Request',
  github_ket_noi: 'GitHub', github_dang_du_an: 'Lên GitHub', cai_cong_cu: 'Cài công cụ', xin_quyen_thu_muc: 'Xin quyền thư mục', web_mo: 'Mở web',
  web_doc: 'Đọc web', tim_web: 'Tìm web', doc_web: 'Đọc web', giao_viec_phu: 'Agent phụ', dung_ky_nang: 'Skill',
  cap_nhat_ke_hoach: 'Kế hoạch', ghi_nho: 'Ghi nhớ',
  // Đủ MỌI tool (18/10/2026 — trước đây lộ tên thô `web_lien_ket`, `web_anh`…)
  web_anh: 'Chụp trang', web_lien_ket: 'Liên kết', web_console: 'Console', web_bam: 'Bấm', web_go: 'Gõ', web_tai: 'Tải về', web_tai_nhieu: 'Tải nhiều',
  sua_o_notebook: 'Notebook', ghi_file_ngoai: 'Ghi ngoài dự án', doc_dau_ra_nen: 'Đầu ra nền', dung_lenh_nen: 'Dừng nền',
  terminal_mo: 'Terminal', terminal_gui: 'Gõ terminal', terminal_doc: 'Đọc terminal', terminal_dong: 'Đóng terminal',
  nho_bai_hoc: 'Ghi nhớ', doc_bo_nho: 'Đọc bộ nhớ', quen_bai_hoc: 'Quên', sua_anh: 'Sửa ảnh', xuat_so_do: 'Xuất sơ đồ',
  notes_search: 'Tìm ghi chú', notes_read: 'Đọc ghi chú', notes_tree: 'Cây ghi chú', notes_tao: 'Tạo ghi chú', notes_ghi: 'Ghi ghi chú',
  giao_viec_ghi: 'Agent phụ ghi', gop_viec_phu: 'Gộp agent phụ', hoi_nguoi_dung: 'Hỏi bạn', cho_doi: 'Chờ', hen_goi_lai: 'Hẹn',
  huy_hen: 'Huỷ hẹn', liet_ke_phien: 'Phiên khác', nhan_phien: 'Nhắn phiên',
};

const ICON = {
  lichSu: '<svg viewBox="0 0 16 16" width="16" height="16"><path fill="none" stroke="currentColor" stroke-width="1.3" d="M8 3.5V8l3 2"/><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
  moi: '<svg viewBox="0 0 16 16" width="16" height="16"><path fill="none" stroke="currentColor" stroke-width="1.4" d="M8 3v10M3 8h10"/></svg>',
  them: '<svg viewBox="0 0 16 16" width="16" height="16"><circle cx="3.5" cy="8" r="1.2" fill="currentColor"/><circle cx="8" cy="8" r="1.2" fill="currentColor"/><circle cx="12.5" cy="8" r="1.2" fill="currentColor"/></svg>',
  mic: '<svg viewBox="0 0 16 16" width="15" height="15"><rect x="5.5" y="1.8" width="5" height="8" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path fill="none" stroke="currentColor" stroke-width="1.3" d="M3.3 7.5a4.7 4.7 0 0 0 9.4 0M8 12.3V14.5"/></svg>',
  gui: '<svg viewBox="0 0 16 16" width="15" height="15"><path fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M8 13V3.5M3.8 7.5 8 3.3l4.2 4.2"/></svg>',
  dung: '<svg viewBox="0 0 16 16" width="13" height="13"><rect x="3.5" y="3.5" width="9" height="9" rx="1.5" fill="currentColor"/></svg>',
  kep: '<svg viewBox="0 0 16 16" width="15" height="15"><path fill="none" stroke="currentColor" stroke-width="1.4" d="M8 3v10M3 8h10"/></svg>',
  gach: '<svg viewBox="0 0 16 16" width="15" height="15"><rect x="2" y="2" width="12" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.2"/><path stroke="currentColor" stroke-width="1.3" d="M9.8 4.6 6.2 11.4"/></svg>',
  a: '<svg viewBox="0 0 16 16" width="15" height="15"><circle cx="8" cy="8" r="2.4" fill="none" stroke="currentColor" stroke-width="1.3"/><path fill="none" stroke="currentColor" stroke-width="1.3" d="M10.4 8v1.1a1.9 1.9 0 0 0 3.8 0V8A6.2 6.2 0 1 0 11 13.4"/></svg>',
  chep: '<svg viewBox="0 0 16 16" width="13" height="13"><rect x="5" y="5" width="8.5" height="8.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.2"/><path fill="none" stroke="currentColor" stroke-width="1.2" d="M3 10.5V3.8A1.3 1.3 0 0 1 4.3 2.5H11"/></svg>',
  ghim: '<svg viewBox="0 0 16 16" width="13" height="13"><path fill="none" stroke="currentColor" stroke-width="1.3" d="M4.5 2h7v11.5L8 10.8l-3.5 2.7z"/></svg>',
  lai: '<svg viewBox="0 0 16 16" width="13" height="13"><path fill="none" stroke="currentColor" stroke-width="1.3" d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3"/></svg>',
  lui: '<svg viewBox="0 0 16 16" width="13" height="13"><path fill="none" stroke="currentColor" stroke-width="1.3" d="M5 3 2 6l3 3M2.3 6H10a4 4 0 0 1 0 8H6"/></svg>',
};

// ─── Trạng thái ──────────────────────────────────────────────────

const logo = document.body.dataset.logo ?? '';
const S = {
  /** Đợt 8A: ngữ cảnh % của phiên (cho `/usage`). */
  nguCanhPhanTram: null as number | null,
  /** Đợt 8A: gợi ý bước tiếp của lượt vừa xong (chữ mờ trong ô nhập — Tab nhận). */
  goiY: [] as string[],
  ketNoi: false,
  cheDoKetNoi: 'app' as 'app' | 'docLap',
  phienBan: '',
  ws: null as null | { name?: string; path?: string; branch?: string | null; cheDoQuyen?: string; mucNoLuc?: string; model?: string; choTrinhDuyet?: boolean },
  info: null as null | { models?: ModelMuc[]; mucNoLuc?: Array<{ id: string; ten: string; buoc: number; viecPhu: number }>; model?: string | null; pro?: boolean },
  dangChay: false,
  batDauLuot: 0,
  luocNghi: 0,
  pha: 'cho' as 'cho' | 'nghi' | 'viet' | 'tool' | 'duyet',
  toolDang: '' as string,
  toolCuoi: '' as string,
  buoc: null as null | { nay: number; tran: number },
  tienPhien: 0,
  soFileDaSua: 0,
  tieuDe: '',
  muc: [] as Muc[],
  lenhDuAn: [] as Array<{ ten: string; mo: string; than: string }>,
  choDuyetKeHoach: false,
  daCompact: false,
  /** Chữ AI viết trong lượt đang chạy — nút "Chép" dưới câu trả lời lấy ở đây. */
  chuLuot: '',
  /** Tin người dùng của lượt đang chạy — để báo "Đã gửi" khi máy nhận. */
  tinDangGui: null as HTMLElement | null,
  /** Cổng chính hãng báo THẬT là model đang suy nghĩ (khung `nghi`). */
  suyNghi: false,
};
/** Tin đã ghim (đánh dấu để quay lại) — kiểu Bookmarks của Claude Code. */
const ghimDs: Array<{ el: HTMLElement; chu: string }> = [];
let anhDinh: string[] = [];
let kemNguCanh = true;
let nguCanh: { file: string | null; chon?: { tu: number; den: number } | null } = { file: null };

// ─── Khung ───────────────────────────────────────────────────────

const goc = document.getElementById('goc')!;
goc.innerHTML = `
<header class="dau">
  <div class="thuong-hieu" title="CuongMini Code — AI lập trình của CuongThai">
    <img class="logo" src="${logo}" alt="">
    <div class="tieude"><b class="ten-thuong-hieu">CuongMini <span>Code</span></b><span id="duAn" class="phu">đang kết nối…</span></div>
  </div>
  <div class="cong-cu-dau">
    <button id="nutLichSu" class="icon" title="Lịch sử việc">${ICON.lichSu}</button>
    <button id="nutMoi" class="icon" title="Việc mới">${ICON.moi}</button>
    <button id="nutThem" class="icon" title="Thêm">${ICON.them}</button>
  </div>
</header>
<section id="lichSu" class="lich-su" hidden>
  <div class="lich-su-dau"><input id="timPhien" placeholder="Tìm việc cũ…"><button id="dongLichSu" class="icon" title="Đóng">✕</button></div>
  <div id="dsPhien" class="ds-phien"></div>
</section>
<main id="bang" class="bang"></main>
<div id="banner" class="banner" hidden></div>
<div id="trangThai" class="trang-thai" hidden><span class="sao">✻</span><span class="chu"></span><span class="dem"></span></div>
<footer class="soan">
  <div id="menu" class="menu-noi" hidden></div>
  <div id="khung" class="khung-nhap">
    <div id="chip" class="chip-dai"></div>
    <div id="anh" class="anh-dai"></div>
    <textarea id="o" rows="1" placeholder="Hỏi hoặc giao việc cho CuongMini…"></textarea>
    <div class="thanh-duoi">
      <button id="nutKep" class="icon nho" title="Đính kèm file, thư mục, ảnh — hoặc kéo vào khung chat, GIỮ Shift khi thả">${ICON.kep}</button>
      <button id="nutGach" class="icon nho" title="Lệnh  (gõ /)">${ICON.gach}</button>
      <button id="nutA" class="icon nho" title="Nhắc file / thư mục / hàm  (gõ @)">${ICON.a}</button>
      <button id="nutModel" class="chip-chon" title="Model và mức nỗ lực"></button>
      <span class="gian"></span>
      <span id="oNguCanh" class="o-ngu-canh" hidden title="Ngữ cảnh đã dùng"></span>
      <button id="nutCheDo" class="chip-chon che-do" title="Chế độ quyền"></button>
      <button id="nutMic" class="icon nho" title="Nói thay vì gõ">${ICON.mic}</button>
      <button id="nutGui" class="nut-gui" title="Gửi (Enter)">${ICON.gui}</button>
    </div>
  </div>
  <div id="dongCtw" class="dong-ctw" hidden title="CT Work"></div>
  <div class="meo">Enter gửi · Shift+Enter xuống dòng · <b>/</b> lệnh · <b>@</b> nhắc file · Esc dừng · Kéo file/thư mục từ Finder hay Explorer: giữ <b>Shift</b> khi thả</div>
</footer>
<div id="keoTha" class="keo-tha" hidden><div>📎 Thả vào để AI đọc<br><span class="phu">Kéo từ Explorer: giữ <b>Shift</b> khi thả</span></div></div>`;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const bang = $('bang');
const o = $<HTMLTextAreaElement>('o');
const nutGui = $<HTMLButtonElement>('nutGui');
const banner = $('banner');
const menu = $('menu');
const thanhTT = $('trangThai');

// ─── Tiện ích vẽ ─────────────────────────────────────────────────

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const gio = (d = new Date()) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
const giay = (ms: number) => (ms < 60_000 ? `${Math.round(ms / 1000)}s` : `${Math.floor(ms / 60_000)}m ${Math.round((ms % 60_000) / 1000)}s`);

function cuonXuong(ep = false): void {
  const gan = bang.scrollHeight - bang.scrollTop - bang.clientHeight < 200;
  if (gan || ep) bang.scrollTop = bang.scrollHeight;
}

function the(lop: string, html = ''): HTMLElement {
  const d = document.createElement('div');
  d.className = lop;
  if (html) d.innerHTML = html;
  bang.appendChild(d);
  cuonXuong();
  return d;
}

function md(chu: string): string {
  return DOMPurify.sanitize(marked.parse(chu, { async: false, gfm: true, breaks: true }) as string);
}

/** Bấm link `http(s)` mở trình duyệt; bấm `đường/dẫn.ts` mở file; khối code có nút Chép / Chèn. */
function lamGiau(el: HTMLElement): void {
  el.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const href = a.getAttribute('href') ?? '';
      if (/^https?:/.test(href)) gui({ loai: 'moLink', url: href });
      else if (href) gui({ loai: 'moFile', duong: href });
    });
  });
  el.querySelectorAll('code').forEach((c) => {
    const t = c.textContent ?? '';
    if (c.parentElement?.tagName !== 'PRE' && /^[\w./\\@-]+\.[a-z0-9]{1,6}(:\d+(-\d+)?)?$/i.test(t) && t.length < 200) {
      c.classList.add('file');
      c.title = 'Mở file';
      c.addEventListener('click', () => gui({ loai: 'moFile', duong: t }));
    }
  });
  el.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.code-cc')) return;
    const code = pre.querySelector('code');
    const ngonNgu = /language-([\w+-]+)/.exec(code?.className ?? '')?.[1] ?? '';
    const cc = document.createElement('div');
    cc.className = 'code-cc';
    cc.innerHTML = `${ngonNgu ? `<span class="ngon-ngu">${esc(ngonNgu)}</span>` : ''}<button class="nut-nho" data-v="chep" title="Chép">${ICON.chep}</button><button class="nut-nho" data-v="chen" title="Chèn vào chỗ con trỏ trong editor">Chèn</button>`;
    cc.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('button');
      if (!b) return;
      const chu = code?.textContent ?? pre.textContent ?? '';
      if (b.dataset.v === 'chep') { void navigator.clipboard.writeText(chu); b.classList.add('da'); setTimeout(() => b.classList.remove('da'), 1200); }
      else void goi('vsc:chenCode', { code: chu }).catch((er: Error) => thongBao(er.message, true));
    });
    pre.prepend(cc);
  });
}

function thongBao(chu: string, loi = false): void {
  the(loi ? 'tin loi' : 'tin ket', `${loi ? '⚠️ ' : 'ℹ️ '}${esc(chu)}`);
}

/** Câu trả lời CỤC BỘ của lệnh `/` — không vào hội thoại gửi model. */
function traLoiHeThong(chu: string | null): void {
  if (chu === null) return;
  const el = the('tin he-thong md', md(chu));
  lamGiau(el);
}

/** Đợt 4 — hàng nút hành động dưới câu trả lời hệ thống vừa in (`/mcp`…). */
function nutHeThong(ds: Array<{ nhan: string; chinh?: boolean; so?: string; lam: () => void | Promise<void> }>): void {
  if (!ds.length) return;
  const cuoi = bang.querySelector<HTMLElement>('.tin.he-thong:last-of-type') ?? bang.lastElementChild as HTMLElement | null;
  if (!cuoi) return;
  const h = document.createElement('div');
  h.className = 'nut-hang';
  // Đợt 5: hàng nút có số (thẻ lựa chọn) ⇒ gõ số ở ô nhập TRỐNG là bấm; bấm xong cả hàng khoá lại (như CLI đóng thẻ).
  const coSo = ds.some((n) => n.so);
  if (coSo) h.dataset.theChon = '1';
  for (const n of ds) {
    const btn = document.createElement('button');
    btn.className = `nut${n.chinh ? ' chinh' : ''}`;
    btn.textContent = n.nhan;
    if (n.so) btn.dataset.so = n.so;
    btn.addEventListener('click', () => {
      if (coSo) { h.querySelectorAll('button').forEach((x) => { x.disabled = true; }); btn.classList.add('da-chon'); delete h.dataset.theChon; }
      void Promise.resolve(n.lam()).catch((e: Error) => thongBao(e.message, true));
    });
    h.appendChild(btn);
  }
  cuoi.appendChild(h);
}

/** Đợt 5: thẻ lựa chọn CÒN MỞ gần nhất (hàng nút có số, chưa bấm) — để phím số ở ô nhập trống chọn được. */
function theChonMo(): HTMLElement | null {
  const ds = bang.querySelectorAll<HTMLElement>('.nut-hang[data-the-chon="1"]');
  return ds.length ? ds[ds.length - 1]! : null;
}

// ─── Tin người dùng / AI ─────────────────────────────────────────

let traLoi: { el: HTMLElement; than: HTMLElement; chu: string; hen: number | null } | null = null;
let khoiMayLuot: HTMLElement | null = null;

function veTraLoi(): void {
  if (!traLoi) return;
  traLoi.than.innerHTML = md(traLoi.chu);
  traLoi.hen = null;
  lamGiau(traLoi.than);
  cuonXuong();
}
function themChu(delta: string): void {
  if (!traLoi) {
    const el = the('tin may');
    el.innerHTML = '<div class="than md"></div>';
    traLoi = { el, than: el.querySelector('.than')!, chu: '', hen: null };
    khoiMayLuot = el;
  }
  traLoi.chu += delta;
  if (traLoi.hen === null) traLoi.hen = requestAnimationFrame(veTraLoi);
}
function ketThucTraLoi(): void {
  if (traLoi) {
    if (traLoi.hen) cancelAnimationFrame(traLoi.hen);
    veTraLoi();
    if (traLoi.chu.trim()) {
      S.muc.push({ kieu: 'may', text: traLoi.chu });
      S.chuLuot += `${S.chuLuot ? '\n\n' : ''}${traLoi.chu}`;
    }
  }
  traLoi = null;
}

function ganNutTin(el: HTMLElement, layChu: () => string, k?: number): void {
  if (el.querySelector('.hanh-dong')) return;
  const chu = layChu();
  const hd = document.createElement('span');
  hd.className = 'hanh-dong';
  hd.innerHTML = `<button class="nut-nho" data-v="chep" title="Chép">${ICON.chep}</button>${k ? `<button class="nut-nho" data-v="lui" title="Quay về câu này (cắt hội thoại + lùi file)">${ICON.lui}</button>` : ''}`;
  hd.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest('button');
    if (!b) return;
    if (b.dataset.v === 'chep') { void navigator.clipboard.writeText(chu); b.classList.add('da'); setTimeout(() => b.classList.remove('da'), 1200); }
    if (b.dataset.v === 'lui' && k && !S.dangChay) void chayLenh(`/rewind ${k}`, boiCanh());
  });
  (el.querySelector('.chan-tin') ?? el).appendChild(hd);
}

/** Trạng thái gửi dưới tin người dùng: đang gửi → ✓ đã gửi (máy đã nhận) / ✕ lỗi + gửi lại. */
function datTrangGui(el: HTMLElement | null, tt: 'dang' | 'ok' | 'loi', loi?: string): void {
  const o2 = el?.querySelector<HTMLElement>('.trang-gui');
  if (!o2) return;
  o2.className = `trang-gui ${tt}`;
  o2.textContent = tt === 'dang' ? 'Đang gửi…' : tt === 'ok' ? '✓ Đã gửi' : '✕ Chưa gửi được';
  o2.title = loi ?? '';
  if (tt === 'loi') {
    const b = document.createElement('button');
    b.className = 'nut-nho';
    b.innerHTML = `${ICON.lai} Gửi lại`;
    b.addEventListener('click', () => { if (!S.dangChay && cauHoiCuoi) { b.remove(); o.value = cauHoiCuoi; void guiCauHoi(); } });
    o2.after(b);
  }
}

function batTatGhim(el: HTMLElement, chu: string, nut?: HTMLElement): void {
  const i = ghimDs.findIndex((g) => g.el === el);
  if (i >= 0) { ghimDs.splice(i, 1); el.classList.remove('ghim'); nut?.classList.remove('bat'); return; }
  ghimDs.push({ el, chu });
  el.classList.add('ghim');
  nut?.classList.add('bat');
}

function veNguoi(text: string, anh: string[] = [], luc?: number): HTMLElement {
  const k = S.muc.filter((m) => m.kieu === 'nguoi').length + 1;
  S.muc.push({ kieu: 'nguoi', text, anh, luc });
  const el = the('tin nguoi', `<div class="than">${esc(text).replace(/@([\w./\\#:-]+)/g, '<span class="nhac">@$1</span>').replace(/\n/g, '<br>')}${anh.length ? `<div class="anh-nho">${anh.map((a) => `<img src="${a}" alt="">`).join('')}</div>` : ''}</div>
<div class="chan-tin">${luc ? `<span class="gio">${gio(new Date(luc))}</span><span>·</span><span class="trang-gui dang">Đang gửi…</span>` : ''}</div>`);
  ganNutTin(el, () => text, k);
  if (!S.tieuDe) datTieuDe(text);
  return el;
}

function datTieuDe(t: string): void {
  S.tieuDe = t.replace(/\s+/g, ' ').trim().slice(0, 80);
  capNhatDau();
}

function capNhatDau(): void {
  const ws = S.ws;
  const duAn = ws?.name ? `${ws.name}${ws.branch ? ` · ${ws.branch}` : ''}` : 'chưa mở thư mục';
  $('duAn').textContent = S.tieuDe ? `${S.tieuDe}` : duAn;
  $('duAn').title = `${S.tieuDe ? `${S.tieuDe}\n` : ''}${duAn}${S.cheDoKetNoi === 'docLap' ? '\nChạy ngay trong VS Code' : '\nChạy qua app CuongThai'}`;
}

// ─── Dòng trạng thái "đang làm gì" ───────────────────────────────

let henTT: number | null = null;
function batTrangThai(): void {
  thanhTT.hidden = false;
  if (henTT === null) henTT = window.setInterval(veTrangThai, 120);
  veTrangThai();
}
function tatTrangThai(): void {
  thanhTT.hidden = true;
  if (henTT !== null) { clearInterval(henTT); henTT = null; }
}
function cauTrangThai(): string {
  switch (S.pha) {
    case 'duyet': return 'Đang chờ bạn duyệt';
    case 'viet': return 'Đang viết câu trả lời';
    case 'tool': return VIEC_TOOL[S.toolDang] ?? (S.toolDang.startsWith('mcp__') ? 'Đang gọi công cụ ngoài' : 'Đang làm');
    case 'nghi':
      if (S.suyNghi) return 'Đang suy nghĩ';
      if (S.toolCuoi && TOOL_GHI.has(S.toolCuoi)) return 'Đang code';
      if (S.toolCuoi === 'run_command') return 'Đang xem kết quả lệnh';
      if (S.toolCuoi) return 'Đang đọc mã dự án';
      return NGHI[Math.floor((Date.now() - S.batDauLuot) / 3500) % NGHI.length]!;
    default: return 'Đang khởi động';
  }
}
function veTrangThai(): void {
  const t = Date.now();
  const cho = S.pha === 'duyet';
  (thanhTT.querySelector('.sao') as HTMLElement).textContent = cho ? '⏸' : SAO[Math.floor(t / 120) % SAO.length]!;
  thanhTT.classList.toggle('cho', cho);
  (thanhTT.querySelector('.chu') as HTMLElement).textContent = `${cauTrangThai()}${cho ? '' : '…'}`;
  const phan = [giay(t - S.batDauLuot)];
  if (S.buoc?.nay) phan.push(S.buoc.tran - S.buoc.nay <= 10 ? `bước ${S.buoc.nay}/${S.buoc.tran}` : `bước ${S.buoc.nay}`);
  phan.push('esc để dừng');
  (thanhTT.querySelector('.dem') as HTMLElement).textContent = `(${phan.join(' · ')})`;
}

// ─── Sự kiện AI Code ─────────────────────────────────────────────

function veDiff(diff: { dong: Array<{ loai: string; text: string }>; soThem: number; soBo: number; quaLon: boolean } | undefined): string {
  if (!diff) return '';
  const dong = diff.dong.slice(0, 400).map((d) => `<div class="d ${d.loai}">${d.loai === 'them' ? '+' : d.loai === 'bo' ? '−' : ' '} ${esc(d.text)}</div>`).join('');
  return `<div class="diff"><div class="diff-dau"><span class="xanh">+${diff.soThem}</span> <span class="do">−${diff.soBo}</span>${diff.quaLon ? ' · quá dài, chỉ hiện một phần' : ''}</div>${dong}</div>`;
}

const toolDangChay = new Map<string, HTMLElement>();
let khoiLenh: HTMLElement | null = null;

function nhanTool(ten: string): string {
  if (ten.startsWith('mcp__ctwork__')) return `CT Work · ${ten.slice('mcp__ctwork__'.length)}`;
  if (ten.startsWith('mcp__')) return ten.split('__').slice(1).join(' · ');
  const t = NHAN_TOOL[ten];
  if (t) return t;
  const g = ten.replace(/_/g, ' ').trim();
  return g ? g[0]!.toUpperCase() + g.slice(1) : ten;
}

/* ── Đợt 3 (18/10/2026): hỏi lựa chọn · chờ/hẹn · tin phiên ── */
const NHAN_PHU = (phuId: unknown): string => (phuId ? `<span class="phu">🤖 Agent phụ · </span>` : '');

function veHoi(id: string, cauHoi: Array<{ cauHoi: string; tieuDe?: string; luaChon: Array<{ nhan: string; moTa?: string }>; nhieu?: boolean }>): void {
  S.pha = 'duyet';
  const chon: string[][] = cauHoi.map(() => []);
  const el = the('duyet thuong hoi', `${cauHoi.map((q, i) => `<div class="hoi-cau" data-i="${i}"><div class="duyet-dau">❓ ${esc(q.cauHoi)}${q.nhieu ? ' <span class="phu">(chọn nhiều)</span>' : ''}</div>
<div class="nut-hang">${q.luaChon.map((l, k) => `<button class="nut" data-i="${i}" data-n="${esc(l.nhan)}" title="${esc(l.moTa ?? '')}">${cauHoi.length === 1 ? `${k + 1}. ` : ''}${esc(l.nhan)}</button>`).join('')}</div>
${q.luaChon.some((l) => l.moTa) ? `<ul class="ly-do">${q.luaChon.filter((l) => l.moTa).map((l) => `<li><b>${esc(l.nhan)}</b> — ${esc(l.moTa!)}</li>`).join('')}</ul>` : ''}
<input class="hoi-khac" data-i="${i}" placeholder="Khác — gõ câu trả lời của bạn…"/></div>`).join('')}
<div class="nut-hang"><button class="nut chinh" data-v="gui">Gửi câu trả lời</button><button class="nut phu2" data-v="bo">Bỏ qua</button></div>`);
  el.dataset.id = id;
  const xong = (tra: Array<{ chon: string[]; khac?: string }> | null) => {
    el.querySelectorAll<HTMLButtonElement | HTMLInputElement>('button,input').forEach((x) => { x.disabled = true; });
    void goi('agent:traLoiHoi', { id, traLoi: tra }).catch(() => undefined);
  };
  const thu = () => cauHoi.map((_, i) => {
    const k = el.querySelector<HTMLInputElement>(`input.hoi-khac[data-i="${i}"]`)?.value.trim();
    return { chon: chon[i]!, ...(k ? { khac: k } : {}) };
  });
  el.querySelectorAll<HTMLButtonElement>('button[data-n]').forEach((b) => b.addEventListener('click', () => {
    const i = Number(b.dataset.i); const n = b.dataset.n!; const q = cauHoi[i]!;
    chon[i] = q.nhieu ? (chon[i]!.includes(n) ? chon[i]!.filter((x) => x !== n) : [...chon[i]!, n]) : [n];
    el.querySelectorAll<HTMLButtonElement>(`button[data-i="${i}"]`).forEach((x) => x.classList.toggle('chinh', chon[i]!.includes(x.dataset.n!)));
    if (cauHoi.length === 1 && !q.nhieu) xong(thu());
  }));
  el.querySelectorAll<HTMLInputElement>('input.hoi-khac').forEach((x) => x.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') xong(thu()); }));
  el.querySelector<HTMLButtonElement>('button[data-v="gui"]')!.addEventListener('click', () => xong(thu()));
  el.querySelector<HTMLButtonElement>('button[data-v="bo"]')!.addEventListener('click', () => xong(null));
}

let khoiHenCho: HTMLElement | null = null;
function veHenCho(cho: Array<{ id: string; moTa: string; hetLuc: number }>, hen: Array<{ id: string; lyDo: string; luc: number; lap: boolean; phut: number; conLai: number }>): void {
  if (!cho.length && !hen.length) { khoiHenCho?.remove(); khoiHenCho = null; return; }
  if (!khoiHenCho) {
    khoiHenCho = document.createElement('div');
    khoiHenCho.className = 'hen-cho';
    const soan = document.querySelector('footer.soan');
    if (soan) soan.insertAdjacentElement('beforebegin', khoiHenCho); else document.body.appendChild(khoiHenCho);
  }
  const gioP = (t: number) => new Date(t).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  khoiHenCho.innerHTML = [
    ...cho.map((c) => `<div>⏳ Đang chờ: ${esc(c.moTa)} <button class="nut-nho" data-cho="${esc(c.id)}" data-cach="xongNgay">Tiếp ngay</button><button class="nut-nho" data-cho="${esc(c.id)}" data-cach="boCho">Bỏ chờ</button></div>`),
    ...hen.map((h) => `<div>⏰ Hẹn quay lại lúc ${gioP(h.luc)}${h.lap ? ` (lặp mỗi ${h.phut}′, còn ${h.conLai}×)` : ''} — ${esc(h.lyDo.slice(0, 160))} <span class="phu">· chỉ chạy khi VS Code còn mở</span> <button class="nut-nho" data-hen="${esc(h.id)}">Huỷ</button></div>`),
  ].join('');
  khoiHenCho.querySelectorAll<HTMLButtonElement>('button[data-cho]').forEach((b) => b.addEventListener('click', () => void goi('agent:huyCho', { id: b.dataset.cho, cach: b.dataset.cach }).catch(() => undefined)));
  khoiHenCho.querySelectorAll<HTMLButtonElement>('button[data-hen]').forEach((b) => b.addEventListener('click', () => void goi('agent:huyHen', { id: b.dataset.hen }).catch(() => undefined)));
}

function theDuyet(id: string, tieuDe: string, than: string, cacNut: Array<[string, string, string?]>, muc = 'cankiem'): void {
  S.pha = 'duyet';
  const el = the(`duyet ${muc}`, `<div class="duyet-dau">${tieuDe}</div>${than}<div class="nut-hang">${cacNut.map(([q, t, lop]) => `<button class="nut ${lop ?? ''}" data-q="${q}">${t}</button>`).join('')}</div>`);
  el.dataset.id = id;
  el.querySelectorAll<HTMLButtonElement>('button[data-q]').forEach((b) => b.addEventListener('click', () => {
    el.querySelectorAll('button').forEach((x) => { x.disabled = true; });
    gui({ loai: 'traLoi', id, quyetDinh: b.dataset.q });
  }));
  el.querySelectorAll<HTMLElement>('.file-link').forEach((a) => a.addEventListener('click', () => gui({ loai: 'moFile', duong: a.dataset.duong })));
}

const DUYET_CHUAN: Array<[string, string, string?]> = [['choPhep', 'Cho phép', 'chinh'], ['choPhepCaFile', 'Cho phép cả việc này'], ['tuChoi', 'Từ chối', 'phu2']];

/**
 * AGENT PHỤ (`giao_viec_phu`) — trước 18/10/2026 khung VS Code bỏ qua hẳn ba sự
 * kiện này nên người dùng chỉ thấy "Agent phụ đang làm" rồi im, trong khi app
 * desktop và CLI vẽ được. Nay: một khối gập/mở cho mỗi agent phụ — nhiệm vụ,
 * từng tool nó gọi, kết quả + chi phí. Chữ của agent phụ chỉ nằm TRONG khối,
 * không bao giờ lẫn vào câu trả lời chính (`themChu` không được gọi ở đây).
 */
const phuDangChay = new Map<string, HTMLElement>();
const MAX_DONG_PHU = 60;

function xuLyPhu(e: SuKien): void {
  const id = String(e.phuId ?? '');
  if (e.loai === 'phuBatDau') {
    ketThucTraLoi();
    const el = the('tool phu-agent', `<details><summary><span class="cham dang"></span><b>Agent phụ</b> <span class="phu">${esc(String(e.kieuAgent ?? ''))} · ${esc(String(e.nhiemVu ?? '').slice(0, 140))}</span><span class="mo-rong">›</span></summary><div class="ben-trong"><div class="phu-buoc"></div></div></details>`);
    phuDangChay.set(id, el);
    return;
  }
  const el = phuDangChay.get(id);
  if (!el) return;
  if (e.loai === 'phuSuKien') {
    const con = (e.e ?? {}) as SuKien;
    if (con.loai !== 'tool') return;
    const buoc = el.querySelector<HTMLElement>('.phu-buoc');
    if (!buoc || buoc.childElementCount >= MAX_DONG_PHU) return;
    const d = document.createElement('div');
    d.className = 'phu';
    d.textContent = `• ${nhanTool(String(con.ten ?? ''))}${con.tomTat ? ` — ${String(con.tomTat).slice(0, 160)}` : ''}`;
    buoc.appendChild(d);
    return;
  }
  if (e.loai === 'phuXong') {
    phuDangChay.delete(id);
    el.querySelector('.cham')?.classList.replace('dang', e.ok ? 'xong' : 'hong');
    const tien = Number(e.tienUsd ?? 0);
    const tok = Number(e.tokenVao ?? 0) + Number(e.tokenRa ?? 0);
    const ben = el.querySelector<HTMLElement>('.ben-trong');
    if (ben) {
      const kq = document.createElement('pre');
      kq.className = 'chitiet';
      kq.textContent = String(e.tomTat ?? '').slice(0, 12000) || (e.ok ? '(không có tóm tắt)' : 'Agent phụ dừng giữa chừng.');
      ben.appendChild(kq);
      const phi = document.createElement('div');
      phi.className = 'phu';
      phi.textContent = `${tok ? `${tok.toLocaleString('vi-VN')} token` : ''}${tien > 0 ? ` · ~${tien.toFixed(3)} $` : ''}`;
      if (phi.textContent) ben.appendChild(phi);
    }
  }
}

function xuLy(e: SuKien): void {
  /* Sự kiện BÊN TRONG agent phụ đi BỌC trong `phuSuKien` — vẽ riêng trong khối
     của nó (xem `xuLyPhu`), KHÔNG chạy xuống luồng chính bên dưới. */
  if (e.loai === 'phuBatDau' || e.loai === 'phuSuKien' || e.loai === 'phuXong') { xuLyPhu(e); return; }
  if (e.loai !== 'nghi') S.suyNghi = false;
  switch (e.loai) {
    case 'nghi':
      S.suyNghi = true;
      if (S.pha === 'cho' || S.pha === 'viet') S.pha = 'nghi';
      break;
    case 'batDau':
      if (S.tinDangGui) { datTrangGui(S.tinDangGui, 'ok'); S.tinDangGui = null; }
      S.dangChay = true;
      if (!S.batDauLuot) S.batDauLuot = Date.now();
      if (S.pha === 'cho' || S.pha === 'tool' || S.pha === 'viet') S.pha = 'nghi';
      if (typeof e.buoc === 'number') S.buoc = { nay: e.buoc, tran: Number(e.tranBuoc ?? 0) };
      capNhatNut();
      break;
    case 'chu':
      S.pha = 'viet';
      themChu(String(e.delta ?? ''));
      break;
    case 'toolBatDau': {
      ketThucTraLoi();
      S.pha = 'tool';
      S.toolDang = String(e.ten);
      const laLenh = e.ten === 'run_command' || e.ten === 'chay_lenh_nen';
      const el = the('tool', `<details${laLenh ? ' open' : ''}><summary><span class="cham dang"></span><b>${esc(nhanTool(e.ten))}</b> <span class="phu">đang chạy…</span><span class="mo-rong">›</span></summary><div class="ben-trong">${laLenh ? '<pre class="lenh-ra"></pre>' : '<div class="phu">Đang chạy…</div>'}</div></details>`);
      toolDangChay.set(e.id, el);
      khoiLenh = laLenh ? el.querySelector<HTMLElement>('.lenh-ra') : null;
      break;
    }
    case 'tool': {
      ketThucTraLoi();
      S.pha = 'nghi';
      S.toolCuoi = String(e.ten);
      S.muc.push({ kieu: 'tool', ten: e.ten, tomTat: e.tomTat ?? '' });
      const cu = e.id ? toolDangChay.get(e.id) : undefined;
      const el = cu ?? the('tool');
      if (e.id) toolDangChay.delete(e.id);
      el.className = 'tool';
      const file = e.duongDan ? ` <a class="file-link" data-duong="${esc(e.duongDan)}">${esc(e.duongDan)}</a>` : '';
      const daChay = el.querySelector<HTMLElement>('.lenh-ra')?.textContent ?? '';
      const ra = String(e.chiTiet ?? '') || daChay;
      const hong = /^(lỗi|error|thất bại|failed)|exit code [1-9]|mã thoát [1-9]/i.test(String(e.tomTat ?? ''));
      // Đợt 5: tool CT Work ⇒ một dòng `CT Work · sprint_current — Sprint 2 · 14 thẻ`, mở ra là BẢNG GỌN (không JSON thô).
      const laCtw = String(e.ten).startsWith('mcp__ctwork__');
      const chiTiet = e.diff ? veDiff(e.diff)
        : laCtw && typeof e.xemGon === 'string' && e.xemGon ? `<div class="md ctw-gon">${md(e.xemGon)}</div>`
          : ra ? `${e.ten === 'run_command' && e.tomTat ? `<div class="nhan-lenh">$ ${esc(String(e.tomTat))}</div>` : ''}<pre class="chitiet">${esc(ra.slice(-12000))}</pre>`
            : '<div class="phu">Không có đầu ra.</div>';
      const thamCtw = laCtw && e.thamSo ? `<span class="phu">(${esc(String(e.thamSo))})</span>` : '';
      el.innerHTML = `<details><summary><span class="cham ${hong ? 'hong' : 'xong'}"></span><b>${esc(nhanTool(e.ten))}</b>${thamCtw}${file} <span class="phu">${laCtw ? '— ' : ''}${esc(e.tomTat ?? '')}</span><span class="mo-rong">›</span></summary><div class="ben-trong">${chiTiet}</div></details>`;
      khoiLenh = null;
      el.querySelector<HTMLElement>('.file-link')?.addEventListener('click', (ev) => { ev.preventDefault(); gui({ loai: 'moFile', duong: e.duongDan }); });
      break;
    }
    case 'lenhRa': {
      if (!khoiLenh) {
        const el = the('tool', '<details open><summary><span class="cham dang"></span><b>Lệnh</b> <span class="phu">đang chạy…</span><span class="mo-rong">›</span></summary><div class="ben-trong"><pre class="lenh-ra"></pre></div></details>');
        khoiLenh = el.querySelector<HTMLElement>('.lenh-ra');
      }
      if (!khoiLenh) break;
      khoiLenh.textContent = ((khoiLenh.textContent ?? '') + e.mau).slice(-8000);
      khoiLenh.scrollTop = khoiLenh.scrollHeight;
      cuonXuong();
      break;
    }
    case 'xinPhep':
      ketThucTraLoi();
      theDuyet(e.id, `${NHAN_PHU(e.phuId)}${e.taoMoi ? '📄 Tạo file' : '✏️ Sửa file'} <a class="file-link" data-duong="${esc(e.duongDan)}">${esc(e.duongDan)}</a>`, veDiff(e.diff), DUYET_CHUAN);
      break;
    case 'xinPhepLenh': {
      ketThucTraLoi();
      const pl = e.phanLoai ?? { muc: 'thuong', lyDo: [], choNho: true };
      const lyDo = pl.lyDo?.length ? `<ul class="ly-do">${pl.lyDo.map((x: string) => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
      const nut: Array<[string, string, string?]> = [['choPhep', 'Chạy', 'chinh']];
      if (pl.choNho) nut.push(['choPhepCaFile', 'Luôn cho lệnh này']);
      // Đợt 3: theo TIỀN TỐ (lõi chặn lệnh nối ; && | $(…) khỏi khớp).
      if (pl.choNho && e.tienTo && e.tienTo !== String(e.lenh ?? '').trim()) nut.push(['choPhepTienTo', `Luôn cho <code>${esc(e.tienTo)} …</code>`]);
      nut.push(['tuChoi', 'Từ chối', 'phu2']);
      theDuyet(e.id, `${NHAN_PHU(e.phuId)}⌨️ Chạy lệnh`, `<pre class="lenh">${esc(e.lenh)}</pre>${lyDo}`, nut, pl.muc);
      break;
    }
    case 'xinPhepMcp':
      ketThucTraLoi();
      if (e.xemTruoc) {
        // Đợt 5: GHI lên CT Work — thẻ nào, việc gì, nội dung gì (không phải JSON tham số).
        const x = e.xemTruoc as { the: string | null; viec: string; noiDung: string };
        theDuyet(e.id, `✍ CT Work · ${esc(x.viec)}${x.the ? ` → <b>${esc(x.the)}</b>` : ''}`,
          `${x.noiDung.trim() ? `<div class="md ctw-xem">${md(x.noiDung)}</div>` : ''}<div class="phu">${esc(L(`tool ${e.tool} · ghi CT Work luôn hỏi (kể cả "Bỏ qua hết") — tắt hỏi: /ctwork tu-ghi on`, `tool ${e.tool} · CT Work writes always ask (even in Bypass) — stop asking: /ctwork auto-write on`))}</div>`,
          [['choPhep', L('Có, ghi lên CT Work', 'Yes, write to CT Work'), 'chinh'], ['tuChoi', L('Không', 'No'), 'phu2']]);
        break;
      }
      theDuyet(e.id, `🔌 Gọi công cụ ${esc(e.server)} · ${esc(e.tool)}`, `<pre class="chitiet">${esc(String(e.args).slice(0, 3000))}</pre>`,
        [['choPhep', 'Cho phép', 'chinh'], ['tuChoi', 'Từ chối', 'phu2']]);
      break;
    case 'dinhKemCtwork': {
      // Đợt 5: `LF-123` trong tin ⇒ lõi đã đính kèm tóm tắt thẻ — chip 📎 dưới tin người dùng.
      const nguoi = bang.querySelectorAll<HTMLElement>('.tin.nguoi');
      const cuoiNguoi = nguoi.length ? nguoi[nguoi.length - 1]! : null;
      const khoa = (Array.isArray(e.khoa) ? e.khoa : []) as string[];
      if (cuoiNguoi && khoa.length) cuoiNguoi.querySelector('.than')?.insertAdjacentHTML('beforeend', `<div class="chip-ctw">${khoa.map((k) => `<span class="chip">📎 ${esc(k)}</span>`).join(' ')}</div>`);
      break;
    }
    case 'xinPhepGit': {
      ketThucTraLoi();
      /* 28/10/2026: `xin_quyen_thu_muc` — xin truy cập thư mục NGOÀI dự án. Mặc định CHỈ ĐỌC; "đọc + sửa" là nút riêng. */
      if (e.viec === 'thuMuc' || e.viec === 'thuMucDoc') {
        theDuyet(e.id, `${NHAN_PHU(e.phuId)}📁 Truy cập thư mục ngoài dự án`, `<pre class="chitiet">${esc(e.chiTiet)}</pre>`, [
          ['choPhep', 'Cho phép đọc', 'chinh'],
          ...(e.viec === 'thuMuc' ? [['choPhepCaFile', 'Cho phép đọc + sửa (mỗi lần sửa vẫn hỏi)'] as [string, string]] : []),
          ['tuChoi', 'Không', 'phu2'],
        ], 'cankiem');
        break;
      }
      const tieu = NHAN_PHU(e.phuId) + ({ commit: '🌿 Commit', pr: '🔀 Đẩy nhánh + mở Pull Request', day: '⬆️ Đẩy lên GitHub', cai: '🧰 Cài công cụ', gop: '🔀 Gộp thay đổi của agent phụ vào dự án' }[e.viec as string] ?? 'Git');
      const nhan = { commit: 'Commit', pr: 'Đẩy và mở PR', day: 'Đẩy lên GitHub', cai: 'Cài', gop: 'Gộp vào dự án' }[e.viec as string] ?? 'Đồng ý';
      theDuyet(e.id, tieu, `<pre class="chitiet">${esc(e.chiTiet)}</pre>`, [['choPhep', nhan, 'chinh'], ['tuChoi', 'Từ chối', 'phu2']],
        e.viec === 'pr' || e.viec === 'day' ? 'nguyhiem' : 'cankiem');
      break;
    }
    case 'xinPhepNote':
      ketThucTraLoi();
      theDuyet(e.id, e.viec === 'tao' ? '🗒 Tạo ghi chú' : '🗒 Ghi vào ghi chú', `<pre class="chitiet">${esc(String(e.chiTiet).slice(0, 4000))}</pre>`,
        [['choPhep', 'Ghi', 'chinh'], ['tuChoi', 'Từ chối', 'phu2']]);
      break;
    case 'xongXinPhep': {
      S.pha = 'nghi';
      const el = bang.querySelector<HTMLElement>(`.duyet[data-id="${CSS.escape(e.id)}"]`);
      if (el) {
        el.classList.add('xong');
        el.querySelector('.nut-hang')!.innerHTML = `<span class="phu">${e.dongY ? '✓ Đã đồng ý' : '✕ Đã từ chối'}</span>`;
      }
      break;
    }
    /* ── Đợt 3 ── */
    case 'hoiLuaChon':
      ketThucTraLoi();
      veHoi(String(e.id), (e.cauHoi ?? []) as Parameters<typeof veHoi>[1]);
      break;
    case 'xongHoi': {
      S.pha = 'nghi';
      const el = bang.querySelector<HTMLElement>(`.hoi[data-id="${CSS.escape(String(e.id))}"]`);
      if (el) { el.classList.add('xong'); el.innerHTML = `<div class="phu">✓ Bạn trả lời: ${esc(String(e.tomTat ?? ''))}</div>`; }
      break;
    }
    case 'henCho':
      veHenCho((e.cho ?? []) as Parameters<typeof veHenCho>[0], (e.hen ?? []) as Parameters<typeof veHenCho>[1]);
      break;
    case 'tinPhien': {
      const tu = (e.tu ?? {}) as { ten?: string; noi?: string; id?: string };
      the('tool', `<details><summary><span class="cham xong"></span><b>📨 Tin từ phiên ${esc(tu.ten ?? '?')}</b> <span class="phu">${esc(tu.noi ?? '')} · agent đọc ở lượt kế</span><span class="mo-rong">›</span></summary><div class="ben-trong"><pre class="chitiet">${esc(String(e.noiDung ?? '').slice(0, 8000))}</pre></div></details>`);
      break;
    }
    case 'tuDanhThuc': {
      // App tự mở lượt theo lời hẹn của agent.
      document.querySelector('.chao')?.remove();
      veNguoi(`⏰ ${String(e.cauHoi ?? '').split('\n')[0]}`, [], Date.now());
      S.dangChay = true; S.batDauLuot = Date.now(); S.pha = 'cho'; S.buoc = null;
      batTrangThai(); capNhatNut();
      break;
    }
    case 'tienTrinh':
      // Tiền của vòng giữ lại: lượt kết thúc bằng Dừng/lỗi thì không có `xong` mang tổng (QA 18/10: tiền mất trắng sau khi dừng).
      tienLuot += Number(e.tienUsd ?? 0);
      // Đợt 4: ô ngữ cảnh % + nhắc 80/95% (như CLI).
      if (e.nguCanh && typeof e.nguCanh.phanTram === 'number') capNhatNguCanh(e.nguCanh.phanTram);
      break;
    case 'daChen':
      // Đợt 4: tin gõ giữa lượt đã vào lượt đang chạy.
      the('tin ket', `↳ ${esc(e.cach === 'cuoiLuot' ? L('Đã chèn tin của bạn — agent làm tiếp với nó.', 'Your message was inserted — the agent continues with it.') : L('Đã chèn tin của bạn vào lượt đang chạy (sau tool vừa xong).', 'Your message was inserted into the running turn (after the last tool).'))}`);
      break;
    case 'keHoach': {
      ketThucTraLoi();
      let el = bang.querySelector<HTMLElement>('.ke-hoach:last-of-type');
      if (!el || el !== bang.lastElementChild) el = the('ke-hoach');
      el.innerHTML = `<div class="duyet-dau">🗺 Kế hoạch</div>${(e.viec as Array<{ ten: string; trangThai: string }>).map((v) =>
        `<div class="viec ${v.trangThai}">${v.trangThai === 'xong' ? '☑' : v.trangThai === 'dang' ? '◐' : '☐'} ${esc(v.ten)}</div>`).join('')}`;
      break;
    }
    case 'xong': {
      ketThucTraLoi();
      void napDongCtw();
      S.tienPhien += Math.max(Number(e.tienUsd ?? 0), tienLuot);
      tienLuot = 0;
      S.soFileDaSua = Number(e.soFileDaSua ?? S.soFileDaSua);
      if (e.nguCanh && typeof e.nguCanh.phanTram === 'number') capNhatNguCanh(e.nguCanh.phanTram);
      ketLuot(`${S.soFileDaSua ? `${S.soFileDaSua} file đã sửa` : ''}`);
      /* Đợt 8A: gợi ý bước tiếp (máy chủ tách khỏi câu trả lời) ⇒ chữ mờ ô nhập (Tab) + hàng nút dưới câu trả lời. */
      S.goiY = Array.isArray(e.goiY) ? (e.goiY as unknown[]).filter((x): x is string => typeof x === 'string' && x.trim().length > 0).slice(0, 3) : [];
      if (S.goiY.length) nutHeThong(S.goiY.map((g) => ({ nhan: `↳ ${g}`, lam: () => { o.value = g; S.goiY = []; capNhatNut(); tuCao(); o.focus(); } })));
      capNhatNut();
      /* Đợt 8A: câu vừa rồi nhắc `KEY-123` khớp dự án mà thư mục chưa gắn ⇒ hỏi gắn MỘT lần. */
      if (hoiGanCho) { const d = hoiGanCho; hoiGanCho = null; hoiGanDoan(giaoDienCtwVsc(boiCanh()), d, 'key'); }
      if (S.choDuyetKeHoach) veDuyetKeHoach();
      /* Đợt 6: lượt xong bình thường ⇒ gợi ý bước tiếp CT Work đúng luật dự án (lõi chỉ trả khi nhánh của thẻ có thay đổi
         git mới) + một lần kiểm tin theo dõi. */
      else void xongViecCtw(giaoDienCtwVsc(boiCanh()), undefined, { tuDong: true }).catch(() => undefined);
      void baoTinCtw();
      break;
    }
    case 'loi': {
      ketThucTraLoi();
      /* 18/10/2026: cổng hỏng ⇒ máy chủ đã tự sang model free tương đương — MỘT dòng mờ, không lặp, không kết thúc lượt. */
      if (e.ma === 'DOI_CONG_TU_DONG') {
        const chu = L(String(e.thongDiep ?? ''), String(e.thongDiepEn ?? e.thongDiep ?? ''));
        if (dongDoiCongCuoi !== chu) { dongDoiCongCuoi = chu; the('tin ket mo', esc(chu)); }
        break;
      }
      if (['DOI_CONG', 'KHOI_PHUC', 'LAM_TIEP', 'COMPACT', 'DOI_CHE_DO', 'TU_GO_ANH', 'CONG_CHINH_HONG_FREE'].includes(e.ma)) {
        if (e.ma === 'COMPACT') S.daCompact = true;
        const el = the('tin ket', `ℹ️ ${esc(e.thongDiep ?? '')}`);
        /* Cổng chính hỏng ⇒ máy chủ đã tự sang CuongMini Free; mời chọn cổng cao hơn. */
        if (e.ma === 'CONG_CHINH_HONG_FREE' && Array.isArray(e.cacCong) && e.cacCong.length) veMoiNangCap(el, e.cacCong as CongNangCap[]);
        break;
      }
      S.tienPhien += tienLuot;
      tienLuot = 0;
      ketLuot('', true);
      S.muc.push({ kieu: 'loi', text: e.thongDiep ?? '' });
      const el = the('tin loi', `⚠️ ${esc(e.thongDiep ?? 'Có lỗi.')}`);
      if (e.ma === 'RAMBO_BAO_TRI') veODuPhong(el);
      /* Mã gia hạn theo $ (19/10/2026): chạm trần tiền gia hạn được ⇒ thẻ "Nhập mã gia hạn để dùng tiếp". */
      if (laGiaHanTien(e.giaHanTien)) veTheGiaHan(el, e.giaHanTien);
      /* Cổng Claude chính hãng (17/10/2026). Vé chết ⇒ lõi đã xoá vé; hỏi lại mật khẩu. */
      if (e.ma === 'CONG_ANTHROPIC_KHOA') {
        if (e.daBat === false) el.insertAdjacentHTML('beforeend', `<div class="phu">${esc(L('Quản trị chưa đặt khoá cho model này.', 'The admin has not set a key for this model.'))}</div>`);
        else veOMatKhauAnthropic(el, () => { if (cauHoiCuoi) { o.value = cauHoiCuoi; void guiCauHoi(); } });
      }
      /* 18/10/2026: hết trần / cổng hỏng ⇒ không còn mời cổng dự phòng; chọn model khác ở menu. */
      if (e.ma === 'PRO_REQUIRED') {
        const n = document.createElement('div');
        n.className = 'nut-hang';
        /* 19/10/2026: tài khoản miễn phí dùng được CuongMini Default — mời chọn nó, kèm nút xem gói Pro. */
        el.insertAdjacentHTML('beforeend', `<div class="phu">${esc(L('Tài khoản miễn phí dùng được CuongMini Default — chọn nó ở menu Model.', 'Free accounts can use CuongMini Default — pick it in the Model menu.'))}</div>`);
        n.innerHTML = `<button class="nut chinh">${esc(L('Xem gói Pro', 'See Pro'))}</button>`;
        n.querySelector('button')!.addEventListener('click', () => gui({ loai: 'moLink', url: 'https://cuongthai.com/pro' }));
        el.appendChild(n);
      }
      if (e.ma === '401' || e.ma === 'UNAUTHORIZED' || e.ma === 'NO_SESSION') gui({ loai: 'hetPhien' });
      break;
    }
    case 'huy':
      ketThucTraLoi();
      S.tienPhien += tienLuot;
      tienLuot = 0;
      /* Đợt 6: từ chối kèm "bảo CuongMini làm khác đi" ⇒ dừng CHỜ chỉ dẫn. */
      if (e.lyDo === 'tuChoi') {
        ketLuot(L('đã dừng — gõ CuongMini nên làm gì khác', 'stopped — tell CuongMini what to do instead'));
        o.placeholder = L('CuongMini nên làm gì khác? Gõ chỉ dẫn rồi Enter…', 'What should CuongMini do instead? Type and press Enter…');
        o.focus();
      } else ketLuot('đã dừng');
      break;
    case 'traChen': {
      /* Đợt 6: tin gõ giữa lượt chưa tới agent (Esc / lỗi) ⇒ trả về ô nhập (trước chữ đang gõ). */
      const ds = Array.isArray(e.ds) ? (e.ds as unknown[]).filter((x): x is string => typeof x === 'string') : [];
      if (ds.length) {
        o.value = [...ds, o.value].filter(Boolean).join('\n');
        o.dispatchEvent(new Event('input'));
        /* QA đợt 6: tin chưa tới model không còn là "câu hỏi" — `/rewind <n>` đếm theo S.muc, lõi đếm hội thoại thật. */
        for (const t of ds) {
          const i = S.muc.map((m) => m.kieu === 'nguoi' && m.text === `↳ ${t}`).lastIndexOf(true);
          if (i >= 0) S.muc.splice(i, 1);
        }
        the('tin ket', `↩ ${esc(L(`${ds.length} tin bạn gõ thêm chưa kịp tới agent — đã trả về ô nhập.`, `${ds.length} message(s) you added did not reach the agent — they are back in the input.`))}`);
      }
      break;
    }
    case 'ctwHoiGan':
      hoiGanCho = (e as { doan?: typeof hoiGanCho }).doan ?? null;
      break;
    case 'ctwHuongDanNhom':
      the('tin ket mo', `📎 ${esc(e.laAgents ? L(`Đọc hướng dẫn của nhóm: ${e.nguon}`, `Read the team instructions: ${e.nguon}`) : L(`Đọc bối cảnh dự án từ CT Work: ${e.nguon}`, `Read the project context from CT Work: ${e.nguon}`))}`);
      break;
    case 'daXoa':
      xoaBang();
      break;
  }
}

/** Đợt 4 — hẹn ĐÃ LỠ lúc VS Code/lõi tắt ⇒ thẻ hỏi chạy bù hay bỏ (một lần mỗi lần nối). */
let daHoiHenLo = false;
async function hoiHenLo(): Promise<void> {
  if (daHoiHenLo) return;
  daHoiHenLo = true;
  const r = await goi<{ ds: Array<{ id: string; lyDo: string; luc: number }> }>('agent:henLo').catch(() => null);
  const ds = r?.ds ?? [];
  if (!ds.length) return;
  const el = the('tin ket', `⏰ <b>${esc(L(`Đã lỡ ${ds.length} hẹn lúc CuongMini tắt`, `Missed ${ds.length} schedule(s) while CuongMini was closed`))}</b>`
    + `<div class="phu">${ds.slice(0, 5).map((h) => `• ${esc(new Date(h.luc).toLocaleString())} — ${esc(h.lyDo.slice(0, 100))}`).join('<br>')}</div>`
    + `<div class="nut-hang"><button class="nut chinh" data-v="chay">${esc(L('Chạy bù', 'Run now'))}</button><button class="nut" data-v="bo">${esc(L('Bỏ', 'Drop'))}</button></div>`);
  el.querySelectorAll<HTMLButtonElement>('button[data-v]').forEach((b) => b.addEventListener('click', () => {
    const cach = b.dataset.v === 'chay' ? 'chay' : 'bo';
    void goi<{ n: number }>('agent:xuLyHenLo', { cach }).then((x) => {
      el.querySelector('.nut-hang')!.innerHTML = `<span class="phu">${esc(cach === 'chay' ? L(`Đang chạy bù ${x?.n ?? 0} hẹn — chạy nền trong đúng việc cũ của nó; xem kết quả ở Lịch sử.`, `Running ${x?.n ?? 0} schedule(s) in the background, each in its own task — see the result in History.`) : L(`Đã bỏ ${x?.n ?? 0} hẹn.`, `Dropped ${x?.n ?? 0}.`))}</span>`;
    }).catch(() => undefined);
  }));
}

/** Tiền các vòng của lượt đang chạy (`tienTrinh`). */
let tienLuot = 0;

/** Đợt 4 — chữ hai thứ tiếng theo ngôn ngữ giao diện VS Code (webview nhận `navigator.language` của VS Code). */
function L(vi: string, en: string): string { return /^vi/i.test(navigator.language || 'vi') ? vi : en; }

/** Đợt 4 — ô ngữ cảnh % ở thanh dưới + nhắc một lần mỗi mốc 80/95% mỗi việc (như CLI). */
let daNhacNguCanh = 0;
function capNhatNguCanh(p: number): void {
  S.nguCanhPhanTram = Math.round(p);
  const el = document.getElementById('oNguCanh');
  if (el) {
    el.hidden = p <= 0;
    el.textContent = `${Math.round(p)}%`;
    el.dataset.muc = p >= 95 ? 'do' : p >= 80 ? 'vang' : '';
    el.title = L(`Ngữ cảnh đã dùng ${Math.round(p)}% — /compact để tóm tắt phần cũ, /context xem chi tiết`, `Context used ${Math.round(p)}% — /compact to summarize older turns, /context for details`);
  }
  const moc = p >= 95 ? 95 : p >= 80 ? 80 : 0;
  if (!moc || moc <= daNhacNguCanh) return;
  daNhacNguCanh = moc;
  the('tin ket', `⚠️ ${esc(L(`Ngữ cảnh đã dùng ${Math.round(p)}% — gõ /compact (kèm điều cần giữ) để tóm tắt phần cũ, hoặc /clear bắt đầu việc mới. Máy chủ sẽ tự cắt lượt cũ khi đầy.`, `Context is ${Math.round(p)}% full — run /compact (with what to keep) to summarize older turns, or /clear to start fresh. The server trims old turns automatically when full.`))}`);
}

/** Kết một lượt: tắt trạng thái, ghi giờ xong + thời lượng dưới câu trả lời (như Claude Code). */
function ketLuot(ghiChu: string, loi = false): void {
  const tong = S.batDauLuot ? Date.now() - S.batDauLuot : 0;
  S.dangChay = false;
  if (cheDoCho) { const id = cheDoCho; cheDoCho = null; void doiCheDo(id).catch((e: Error) => thongBao(e.message, true)); }
  S.pha = 'cho';
  S.toolDang = '';
  S.toolCuoi = '';
  S.batDauLuot = 0;
  tatTrangThai();
  capNhatNut();
  if (S.tinDangGui) { datTrangGui(S.tinDangGui, loi ? 'loi' : 'ok'); S.tinDangGui = null; }
  if (!loi) {
    const phan = [`CuongMini · ${gio()}`];
    if (tong) phan.push(giay(tong));
    if (ghiChu) phan.push(ghiChu);
    const chu = S.chuLuot;
    const khoi = khoiMayLuot;
    const el = the('ket-luot', `<span class="dau-xong">✓</span><span>${esc(phan.join(' · '))}</span><span class="hanh-dong">
${chu ? `<button class="nut-nho" data-v="chep" title="Chép câu trả lời">${ICON.chep} Chép</button>` : ''}
<button class="nut-nho" data-v="ghim" title="Ghim để quay lại sau">${ICON.ghim} Ghim</button>
<button class="nut-nho" data-v="lai" title="Hỏi lại câu này">${ICON.lai} Thử lại</button></span>`);
    el.addEventListener('click', (ev) => {
      const b = (ev.target as HTMLElement).closest('button');
      if (!b) return;
      if (b.dataset.v === 'chep') { void navigator.clipboard.writeText(chu); b.classList.add('da'); b.lastChild!.textContent = ' Đã chép'; setTimeout(() => { b.classList.remove('da'); b.lastChild!.textContent = ' Chép'; }, 1400); }
      if (b.dataset.v === 'ghim') batTatGhim(khoi ?? el, chu || el.textContent || '', b);
      if (b.dataset.v === 'lai' && !S.dangChay) {
        const cuoi = [...S.muc].reverse().find((m) => m.kieu === 'nguoi');
        if (cuoi?.text) { o.value = cuoi.text; void guiCauHoi(); }
      }
    });
  }
  S.chuLuot = '';
  khoiMayLuot = null;
}

function veDuyetKeHoach(): void {
  S.choDuyetKeHoach = false;
  const el = the('duyet thuong', '<div class="duyet-dau">🗺 Duyệt kế hoạch?</div><div class="phu">Lượt vừa rồi chỉ đọc. Đồng ý thì CuongMini làm theo đúng kế hoạch trên.</div><div class="nut-hang"><button class="nut chinh" data-v="ok">Làm theo kế hoạch</button><button class="nut phu2" data-v="ko">Chưa</button></div>');
  el.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.addEventListener('click', () => {
    el.querySelectorAll('button').forEach((x) => { x.disabled = true; });
    if (b.dataset.v === 'ok') void chayLenh('__duyetKeHoach', boiCanh());
  }));
}

/** Ô mật khẩu cổng dự phòng — giống hộp trong app (`CongDuPhong.tsx`). */
let cauHoiCuoi = '';
/** Dòng tự chuyển cổng gần nhất — không vẽ lặp mỗi bước. */
let dongDoiCongCuoi = '';
let oDangCho: { kq: HTMLElement; nut: HTMLButtonElement; khiXong?: () => void } | null = null;
/** Ô mật khẩu cổng Claude chính hãng đang chờ trả lời từ host. */
let oAnthropicCho: { kq: HTMLElement; nut: HTMLButtonElement; khiXong: () => void } | null = null;

// ─── Mã gia hạn theo $ (19/10/2026) — `src/services/agent/maGiaHanTien.ts` ───

interface GiaHanTien {
  tran: string; ky: 'ngay' | 'thang' | 'cuaSo'; ten: string; tenEn: string; mucUsd: number; daDungUsd: number; tranUsd: number;
  canDuyet: boolean; dangCho: number | null; lanThu: number; duongDan: string;
}
type KetQuaGiaHan =
  | { ketQua: 'daCap'; id: number; soUsd: number; lanThu: number }
  | { ketQua: 'choDuyet'; id: number; soUsd: number; lanThu: number }
  | { ketQua: 'tuChoi'; id: number; soUsd: number; lyDo: string | null }
  | { ketQua: 'hetKy'; id: number; soUsd: number };
function laGiaHanTien(x: unknown): x is GiaHanTien {
  const g = x as Partial<GiaHanTien> | null;
  return !!g && typeof g === 'object' && typeof g.tran === 'string' && g.tran.length > 0 && g.tran.length <= 60
    && (g.ky === 'ngay' || g.ky === 'thang' || g.ky === 'cuaSo') && typeof g.mucUsd === 'number' && typeof g.ten === 'string';
}
const usdGH = (n: number): string => `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })} $`;
/** Một bộ đếm tự kiểm lại mỗi lúc (≥ 30 s). */
let henKiemGiaHan: ReturnType<typeof setInterval> | null = null;

/** Làm tiếp đúng lượt vừa bị chặn (lõi gửi lại nguyên hội thoại). */
function lamTiepSauGiaHan(): void {
  if (S.dangChay) return;
  gui({ loai: 'lamTiep' });
  S.dangChay = true; S.batDauLuot = Date.now(); S.pha = 'cho'; S.buoc = null;
  batTrangThai(); capNhatNut();
}

/** QA đợt 7: câu hỏi cuối của hội thoại (đối tượng) — thẻ ghi lại lúc bị chặn; duyệt MUỘN chỉ tự làm tiếp khi chưa đổi. */
function cauNguoiCuoi(): unknown {
  for (let i = S.muc.length - 1; i >= 0; i--) if (S.muc[i]!.kieu === 'nguoi') return S.muc[i];
  return null;
}

function veTheGiaHan(el: HTMLElement, g: GiaHanTien): void {
  const dauLuc = cauNguoiCuoi();
  const o2 = document.createElement('div');
  o2.className = 'du-phong';
  o2.dataset.giaHanTien = g.tran;
  const ten = L(g.ten, g.tenEn);
  o2.innerHTML = `<div class="phu"><b>${esc(L(`Đã chạm giới hạn ${ten} (${usdGH(g.daDungUsd)}/${usdGH(g.tranUsd)}) · Nhập mã gia hạn để dùng tiếp`, `Limit reached: ${ten} (${usdGH(g.daDungUsd)}/${usdGH(g.tranUsd)}) · Enter an extension code to continue`))}</b></div>
<div class="phu">${esc(g.canDuyet
    ? L(`Lần ${g.lanThu} trong kỳ — mã đúng sẽ gửi yêu cầu, admin duyệt rồi mới cộng +${usdGH(g.mucUsd)}.`, `Attempt ${g.lanThu} this period — a correct code sends a request; +${usdGH(g.mucUsd)} after an admin approves.`)
    : L(`Mã đúng ⇒ cộng ngay +${usdGH(g.mucUsd)} và CuongMini làm tiếp chỗ dở.`, `Correct code ⇒ +${usdGH(g.mucUsd)} right away and CuongMini continues.`))}</div>
<div class="hang"><input type="password" placeholder="${esc(L('Mã gia hạn', 'Extension code'))}" autocomplete="off"><button class="nut chinh">${esc(L('Gia hạn', 'Extend'))}</button></div>
<div class="phu kq"></div>`;
  el.appendChild(o2);
  const hang = o2.querySelector<HTMLElement>('.hang')!;
  const inp = o2.querySelector('input')!;
  const nut = o2.querySelector('button')!;
  const kq = o2.querySelector<HTMLElement>('.kq')!;
  const dung = () => { if (henKiemGiaHan) clearInterval(henKiemGiaHan); henKiemGiaHan = null; };
  const ap = (r: KetQuaGiaHan, tuNhap: boolean): void => {
    if (r.ketQua === 'choDuyet') {
      hang.style.display = 'none';
      kq.textContent = L(`⏳ Đã gửi yêu cầu #${r.id}, chờ admin duyệt — tự kiểm lại mỗi 30 giây.`, `⏳ Request #${r.id} sent, waiting for an admin — re-checking every 30 seconds.`);
      dung();
      henKiemGiaHan = setInterval(() => { void goi<KetQuaGiaHan>('agent:giaHanTienKiem', { id: r.id }).then((k) => { if (k.ketQua !== 'choDuyet') ap(k, false); }).catch(() => undefined); }, 30_000);
      return;
    }
    dung();
    if (r.ketQua === 'daCap') {
      hang.style.display = 'none';
      /* QA đợt 7: duyệt tới khi người dùng đã hỏi câu khác / mở việc khác / đang chạy ⇒ KHÔNG tự gửi lại hội thoại. */
      const diTiep = S.dangChay || cauNguoiCuoi() !== dauLuc;
      kq.textContent = diTiep
        ? L(`✓ Admin đã duyệt: +${usdGH(r.soUsd)}. Gửi lại câu hỏi khi cần dùng tiếp.`, `✓ Approved: +${usdGH(r.soUsd)}. Resend your question when you want to continue.`)
        : tuNhap
          ? L(`✓ Đã cộng +${usdGH(r.soUsd)} — CuongMini làm tiếp chỗ dở.`, `✓ +${usdGH(r.soUsd)} added — CuongMini continues.`)
          : L(`✓ Admin đã duyệt: +${usdGH(r.soUsd)} — đang làm tiếp.`, `✓ Approved: +${usdGH(r.soUsd)} — continuing.`);
      if (!diTiep) lamTiepSauGiaHan();
    } else if (r.ketQua === 'tuChoi') {
      hang.style.display = '';
      nut.disabled = false;
      kq.textContent = L(`✗ Admin đã từ chối yêu cầu #${r.id}${r.lyDo ? `: ${r.lyDo}` : '.'} Nhập mã lần nữa để gửi yêu cầu mới.`, `✗ An admin rejected request #${r.id}${r.lyDo ? `: ${r.lyDo}` : '.'} Enter the code again to ask again.`);
    } else {
      hang.style.display = 'none';
      kq.textContent = L('Kỳ đã qua — giới hạn đã tự làm mới, cứ gửi lại câu hỏi.', 'The period ended — the limit already reset; just resend.');
    }
  };
  if (g.dangCho) {
    ap({ ketQua: 'choDuyet', id: g.dangCho, soUsd: g.mucUsd, lanThu: g.lanThu }, false);
    void goi<KetQuaGiaHan>('agent:giaHanTienKiem', { id: g.dangCho }).then((k) => { if (k.ketQua !== 'choDuyet') ap(k, false); }).catch(() => undefined);
    return;
  }
  const guiMa = () => {
    const ma = inp.value.trim();
    if (!ma) return;
    nut.disabled = true;
    kq.textContent = L('Đang kiểm mã…', 'Checking the code…');
    inp.value = '';
    goi<KetQuaGiaHan>('agent:giaHanTien', { ma, tran: g.tran })
      .then((r) => ap(r, true))
      .catch((er: Error) => { nut.disabled = false; kq.textContent = `⚠️ ${er.message}`; });
  };
  nut.addEventListener('click', guiMa);
  inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') guiMa(); });
  setTimeout(() => inp.focus(), 0);
}

/** Ô nhập KHOÁ model CuongMini (18/10/2026: khoá chung hoặc khoá Invisible — máy chủ tự nhận). */
function veOMatKhauAnthropic(el: HTMLElement, khiXong: () => void, model?: string): void {
  const o2 = document.createElement('div');
  o2.className = 'du-phong';
  o2.innerHTML = `<div class="phu">${esc(L('Nhập khoá do quản trị cấp để mở model này (vé 48 giờ):', 'Enter the admin-issued key to unlock this model (48-hour pass):'))}</div>
<div class="hang"><input type="password" placeholder="${esc(L('Khoá CuongMini', 'CuongMini key'))}" autocomplete="off"><button class="nut chinh">${esc(L('Mở khoá', 'Unlock'))}</button></div>
<div class="phu kq"></div>`;
  el.appendChild(o2);
  const inp = o2.querySelector('input')!;
  const nut = o2.querySelector('button')!;
  const kq = o2.querySelector<HTMLElement>('.kq')!;
  const mo = () => {
    if (!inp.value) return;
    nut.disabled = true;
    kq.textContent = 'Đang mở khoá…';
    oAnthropicCho = { kq, nut, khiXong };
    gui({ loai: 'moCongAnthropic', matKhau: inp.value, ...(model ? { model } : {}) });
    inp.value = '';
  };
  nut.addEventListener('click', mo);
  inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') mo(); });
  setTimeout(() => inp.focus(), 0);
}

/** Nút chọn model của MỘT cổng (sau khi đã mở khoá). */
function veChonModelCong(el: HTMLElement, models: ModelMuc[], chon: (m: ModelMuc) => Promise<void>): void {
  const h = document.createElement('div');
  h.className = 'nut-hang';
  for (const m of models) {
    const b = document.createElement('button');
    b.className = 'nut';
    b.disabled = !m.dungDuoc;
    b.title = m.mo;
    b.textContent = m.ten;
    b.addEventListener('click', () => {
      if (m.dat && !confirm(`${m.ten} đắt hơn hẳn các model khác. Vẫn chọn?`)) return;
      h.querySelectorAll('button').forEach((x) => { x.disabled = true; });
      void chon(m).then(() => {
        h.insertAdjacentHTML('afterend', `<div class="phu">✓ Đã chọn <b>${esc(m.ten)}</b>. Gửi lại câu hỏi (hoặc gõ "tiếp tục") để làm tiếp.</div>`);
      }).catch((er: Error) => { thongBao(er.message, true); h.querySelectorAll('button').forEach((x) => { x.disabled = false; }); });
    });
    h.appendChild(b);
  }
  el.appendChild(h);
}

/**
 * Lời mời khi cổng chính hỏng (máy chủ đã TỰ sang CuongMini Free): chọn Claude
 * chính hãng (model `cl-*`, mật khẩu riêng) hoặc modelapi (GPT, mật khẩu dự
 * phòng). Mỗi nút mở đúng ô mật khẩu của cổng đó, rồi chọn model.
 */
function veMoiNangCap(el: HTMLElement, cacCong: CongNangCap[]): void {
  const vung = document.createElement('div');
  vung.className = 'moi-nang-cap';
  const hang = document.createElement('div');
  hang.className = 'nut-hang';
  const than = document.createElement('div');
  vung.append(hang, than);
  el.appendChild(vung);
  const an = cacCong.find((c) => c.cong === 'anthropic');
  const ma = cacCong.find((c) => c.cong === 'modelapi');
  const moCong = (c: CongNangCap): void => {
    than.innerHTML = '';
    if (!c.daBat) { than.innerHTML = '<div class="phu">Quản trị chưa bật cổng này.</div>'; return; }
    const chonModel = (): void => veChonModelCong(than, c.models, async (m) => {
      if (c.cong === 'anthropic') {
        await doiModel(m.id);
        await goi('agent:datCongPhu', { cong: null });
      } else {
        await goi('agent:datCongPhu', { cong: 'modelapi', model: m.id });
      }
    });
    if (!c.canMatKhau) { chonModel(); return; }
    if (c.cong === 'anthropic') veOMatKhauAnthropic(than, () => { than.innerHTML = ''; chonModel(); });
    else { veODuPhong(than); if (oDangCho) oDangCho.khiXong = () => { than.innerHTML = ''; chonModel(); }; }
  };
  if (an) {
    const b = document.createElement('button');
    b.className = 'nut chinh';
    b.textContent = 'Dùng Claude chính hãng (model cao hơn)';
    b.addEventListener('click', () => moCong(an));
    hang.appendChild(b);
  }
  if (ma) {
    const b = document.createElement('button');
    b.className = 'nut';
    b.textContent = 'Dùng modelapi (GPT)';
    b.addEventListener('click', () => moCong(ma));
    hang.appendChild(b);
  }
}

function veODuPhong(el: HTMLElement): void {
  const o2 = document.createElement('div');
  o2.className = 'du-phong';
  o2.innerHTML = `<div class="phu">Dùng cổng dự phòng trong lúc chờ? Nhập mật khẩu quản trị cấp:</div>
<div class="hang"><input type="password" placeholder="Mật khẩu cổng dự phòng" autocomplete="off"><button class="nut chinh">Mở khoá</button></div>
<div class="phu kq"></div>`;
  el.appendChild(o2);
  const inp = o2.querySelector('input')!;
  const nut = o2.querySelector('button')!;
  const kq = o2.querySelector<HTMLElement>('.kq')!;
  const mo = () => {
    if (!inp.value) return;
    nut.disabled = true;
    kq.textContent = 'Đang mở khoá…';
    gui({ loai: 'moDuPhong', matKhau: inp.value });
    inp.value = '';
  };
  nut.addEventListener('click', mo);
  inp.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') mo(); });
  oDangCho = { kq, nut };
}

// ─── Màn chào / màn trống ────────────────────────────────────────

function xoaBang(): void {
  bang.innerHTML = '';
  daNhacNguCanh = 0;
  const oNc = document.getElementById('oNguCanh');
  if (oNc) oNc.hidden = true;
  S.muc = [];
  S.tieuDe = '';
  S.tienPhien = 0;
  S.soFileDaSua = 0;
  S.daCompact = false;
  capNhatDau();
  loiChao();
}

const VIEC_HOC: Array<[string, string]> = [
  ['Nhờ CuongMini viết code', 'Viết hàm kiểm tra email hợp lệ và thêm test cho nó.'],
  ['Bôi đen code rồi hỏi', ''],
  ['Dạy CuongMini quy tắc dự án', '/init'],
  ['Cho CuongMini tự sửa không dừng', ''],
  ['Lập kế hoạch cho thay đổi lớn', '/plan '],
];

function loiChao(): void {
  if (bang.children.length) return;
  const el = the('chao', `<div class="logo-lon"><img src="${logo}" alt=""><div class="ten-lon">CuongMini <span>Code</span></div></div>
<p class="phu">AI lập trình của <b>CuongThai</b> — đọc, sửa code, chạy lệnh, dùng skill và đưa dự án lên GitHub ngay trong thư mục bạn đang mở.</p>
<div class="the-hoc">
  <div class="the-hoc-dau">🎓 Làm quen CuongMini Code</div>
  ${VIEC_HOC.map(([t], i) => `<button class="viec-hoc" data-i="${i}"><span class="o-tick"></span>${t}</button>`).join('')}
</div>
<div class="goi-y-nhanh">
  <button data-cau="Giải thích dự án này: cấu trúc thư mục, công nghệ, cách chạy.">🧭 Giải thích dự án</button>
  <button data-cau="Tìm và sửa lỗi đang có trong dự án (chạy build/test để kiểm).">🐞 Tìm &amp; sửa lỗi</button>
  <button data-cau="Đưa dự án này lên GitHub giúp mình (repo riêng tư).">🐙 Đưa lên GitHub</button>
</div>`);
  el.querySelectorAll<HTMLButtonElement>('.goi-y-nhanh button').forEach((b) => b.addEventListener('click', () => { o.value = b.dataset.cau ?? ''; void guiCauHoi(); }));
  el.querySelectorAll<HTMLButtonElement>('.viec-hoc').forEach((b) => b.addEventListener('click', () => {
    b.classList.add('da');
    const i = Number(b.dataset.i);
    if (i === 1) { thongBao('Bôi đen một đoạn code trong editor — chip 📄 hiện số dòng, CuongMini sẽ đọc đúng đoạn đó. Hoặc chuột phải › "Hỏi AI về đoạn đang chọn" (Cmd/Ctrl+Alt+L).'); return; }
    if (i === 3) { moMenuCheDo(); return; }
    o.value = VIEC_HOC[i]![1];
    tuCao();
    o.focus();
  }));
}

// ─── Đăng nhập (chế độ độc lập) ──────────────────────────────────

function veDangNhap(nhacNho: string): void {
  if (!nhacNho && document.querySelector('.dang-nhap')) return; // đang hiện ⇒ giữ chữ người dùng đang gõ
  bang.innerHTML = '';
  const k = the('dang-nhap', `<div class="logo-lon"><img src="${logo}" alt=""><div class="ten-lon">CuongMini <span>Code</span></div></div>
<p>Đăng nhập tài khoản <b>cuongthai.com</b> để dùng AI Code ngay trong VS Code — không cần cài thêm gì.</p>
${nhacNho ? `<div class="tin loi">${esc(nhacNho)}</div>` : ''}
<div class="nha">
  <button class="nut" data-nha="google">Tiếp tục với Google</button>
  <button class="nut" data-nha="github">Tiếp tục với GitHub</button>
  <button class="nut" data-nha="apple">Tiếp tục với Apple</button>
</div>
<div class="hoac"><span>hoặc</span></div>
<form class="mk">
  <input name="ten" placeholder="Tên đăng nhập hoặc email" autocomplete="username" required>
  <input name="mk" type="password" placeholder="Mật khẩu" autocomplete="current-password" required>
  <button class="nut chinh" type="submit">Đăng nhập</button>
</form>
<div class="phu kq"></div>
<p class="phu nho">Chưa có tài khoản? <a href="#" data-link="https://cuongthai.com/register">Đăng ký trên cuongthai.com</a><br>
Có app desktop CuongThai? <a href="#" id="dnMoApp">Mở app</a> — extension sẽ tự chạy qua app.</p>`);
  const kq = k.querySelector<HTMLElement>('.kq')!;
  const khoa = () => k.querySelectorAll<HTMLButtonElement>('button').forEach((b) => { b.disabled = true; });
  k.querySelectorAll<HTMLButtonElement>('[data-nha]').forEach((b) => b.addEventListener('click', () => {
    khoa();
    kq.textContent = 'Đã mở trình duyệt — đăng nhập xong sẽ tự quay lại đây…';
    gui({ loai: 'dangNhapNha', nha: b.dataset.nha });
  }));
  const f = k.querySelector<HTMLFormElement>('form')!;
  f.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const ten = (f.elements.namedItem('ten') as HTMLInputElement).value.trim();
    const mkO = f.elements.namedItem('mk') as HTMLInputElement;
    if (!ten || !mkO.value) return;
    khoa();
    kq.textContent = 'Đang đăng nhập…';
    gui({ loai: 'dangNhapMatKhau', ten, matKhau: mkO.value });
    mkO.value = '';
  });
  k.querySelectorAll<HTMLAnchorElement>('[data-link]').forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); gui({ loai: 'moLink', url: a.dataset.link }); }));
  k.querySelector('#dnMoApp')?.addEventListener('click', (ev) => { ev.preventDefault(); gui({ loai: 'moApp' }); });
}

// ─── Model / mức / chế độ ────────────────────────────────────────

/* 18/10/2026: máy chủ gửi TÊN CuongMini (xếp năng lực cao → thấp) — hiện nguyên; đổi tên "Claude …" chỉ cho máy chủ cũ. */
const dsModel = (): ModelMuc[] => (S.info?.models?.length ? S.info.models : MODEL_DU_PHONG)
  .map((m) => ({ ...m, mo: L(m.mo, m.moEn || m.mo), ten: m.ten.replace(/^Claude Sonnet\b/, 'Cuong Sonnet').replace(/^Claude Opus\b/, 'CuongMini Max').replace(/^Claude Haiku\b/, 'Cuong Haiku').replace(/^Claude Fable\b/, 'Cuong Fable') }));
const dsMuc = (): MucNoLuc[] => (S.info?.mucNoLuc?.length
  ? S.info.mucNoLuc.map((m) => ({ id: m.id, ten: m.ten, mo: `${m.buoc} bước${m.viecPhu ? ` · ${m.viecPhu} agent phụ` : ''}` }))
  : MUC_DU_PHONG);

function capNhatChon(): void {
  const m = dsModel().find((x) => x.id === (S.ws?.model ?? S.info?.model)) ?? dsModel()[0];
  const muc = dsMuc().find((x) => x.id === (S.ws?.mucNoLuc ?? 'vua'));
  $('nutModel').innerHTML = `<span>${esc((m?.ten ?? 'Model').replace(/^Cuong(Mini)? /, ''))}</span>${muc ? `<span class="phu">${esc(muc.ten)}</span>` : ''}<span class="mui">▾</span>`;
  const cd = CHE_DO.find((x) => x.id === (S.ws?.cheDoQuyen ?? 'keHoach')) ?? CHE_DO[0]!;
  $('nutCheDo').innerHTML = `<span>${cd.icon}</span><span>${esc(cd.ngan)}</span>${S.ws?.choTrinhDuyet ? '<span title="Đang cho điều khiển trình duyệt">🌐</span>' : ''}`;
  $('nutCheDo').dataset.che = cd.id;
}

async function doiModel(id: string): Promise<void> {
  await goi('agent:datModel', { model: id });
  S.info = await goi('agent:getInfo').catch(() => S.info) as typeof S.info;
  if (S.ws) S.ws.model = id;
  capNhatChon();
}
async function doiMuc(id: string): Promise<void> {
  await goi('agent:datMucNoLuc', { muc: id });
  if (S.ws) S.ws.mucNoLuc = id;
  capNhatChon();
}
/** Cho AI điều khiển trình duyệt thật (Chrome/Edge trên máy) — mở trang, đọc, bấm, gõ, chụp, tải file. */
async function batTatTrinhDuyet(): Promise<void> {
  const bat = !S.ws?.choTrinhDuyet;
  try {
    const ws = await goi('agent:datCheDoTrinhDuyet', { bat }) as typeof S.ws;
    if (ws) S.ws = ws;
    capNhatChon();
    thongBao(bat ? '🌐 Đã cho CuongMini điều khiển trình duyệt — nó sẽ mở cửa sổ Chrome/Edge riêng khi cần (mỗi thao tác vẫn theo chế độ quyền).' : 'Đã tắt điều khiển trình duyệt.');
  } catch (e) {
    thongBao((e as Error).message, true);
  }
}

/**
 * QA 5c: lõi TỪ CHỐI đổi chế độ giữa lượt ("Việc này đang chạy dở — hãy dừng trước khi đổi chế độ") ⇒ như CLI (đợt 4):
 * đang chạy thì HOÃN tới cuối lượt, không ném lỗi vào mặt người dùng.
 */
let cheDoCho: string | null = null;
async function doiCheDo(id: string): Promise<void> {
  if (S.dangChay) {
    cheDoCho = id;
    thongBao(L(`Sẽ đổi sang "${CHE_DO.find((c) => c.id === id)?.ten ?? id}" khi lượt này xong.`, `Will switch to "${CHE_DO.find((c) => c.id === id)?.ten ?? id}" when this turn ends.`));
    return;
  }
  const ws = await goi('agent:datCheDoQuyen', { cheDo: id }) as typeof S.ws;
  if (ws) S.ws = ws;
  capNhatChon();
}

// ─── Menu nổi (kiểu bảng lệnh của Claude Code) ───────────────────

interface MucMenu { nhom?: string; ten: string; mo?: string; phai?: string; chon?: boolean; tat?: boolean; toi?: boolean; lam?: () => void; html?: string }
let menuMo: { ds: MucMenu[]; chi: number; loc: boolean; luaChon: MucMenu[]; khiDong?: () => void } | null = null;

function moMenu(ds: MucMenu[], o2: { loc?: boolean; goiY?: string; khiDong?: () => void } = {}): void {
  menuMo = { ds, chi: 0, loc: o2.loc ?? false, luaChon: ds, khiDong: o2.khiDong };
  menu.hidden = false;
  menu.innerHTML = `${o2.loc ? `<input class="loc" placeholder="${esc(o2.goiY ?? 'Lọc…')}">` : ''}<div class="ds"></div>`;
  const loc = menu.querySelector<HTMLInputElement>('.loc');
  if (loc) {
    loc.addEventListener('input', () => locMenu(loc.value));
    loc.addEventListener('keydown', phimMenu);
    setTimeout(() => loc.focus(), 0);
  }
  veMenu();
}
function locMenu(q: string): void {
  if (!menuMo) return;
  const qq = chuanHoa(q);
  menuMo.luaChon = qq ? menuMo.ds.filter((m) => !m.html && chuanHoa(`${m.ten} ${m.mo ?? ''} ${m.nhom ?? ''}`).includes(qq)) : menuMo.ds;
  menuMo.chi = 0;
  veMenu();
}
function veMenu(): void {
  if (!menuMo) return;
  const d = menu.querySelector('.ds')!;
  let nhomCu = '';
  const chon = menuMo.luaChon.filter((m) => !m.html);
  d.innerHTML = menuMo.luaChon.map((m) => {
    const dauNhom = m.nhom && m.nhom !== nhomCu ? `<div class="nhom">${esc(m.nhom)}</div>` : '';
    if (m.nhom) nhomCu = m.nhom;
    if (m.html) return dauNhom + m.html;
    const i = chon.indexOf(m);
    return `${dauNhom}<div class="muc-menu ${i === menuMo!.chi ? 'dang' : ''} ${m.tat ? 'tat' : ''} ${m.toi ? 'toi' : ''}" data-i="${i}">
<span class="ten">${m.chon ? '✓ ' : ''}${esc(m.ten)}</span>${m.mo ? `<span class="mo">${esc(m.mo)}</span>` : ''}${m.phai ? `<span class="phai">${esc(m.phai)}</span>` : ''}</div>`;
  }).join('') || '<div class="trong">Không có gì khớp.</div>';
  d.querySelectorAll<HTMLElement>('.muc-menu').forEach((el) => {
    el.addEventListener('mousedown', (ev) => { ev.preventDefault(); chonMuc(Number(el.dataset.i)); });
    el.addEventListener('mousemove', () => { if (menuMo && menuMo.chi !== Number(el.dataset.i)) { menuMo.chi = Number(el.dataset.i); danhDau(); } });
  });
  d.querySelectorAll<HTMLElement>('[data-hanh]').forEach((el) => el.addEventListener('mousedown', (ev) => {
    ev.preventDefault();
    const f = (el as unknown as { _lam?: () => void })._lam;
    f?.();
  }));
  danhDau();
}
function danhDau(): void {
  menu.querySelectorAll<HTMLElement>('.muc-menu').forEach((el) => el.classList.toggle('dang', Number(el.dataset.i) === menuMo?.chi));
  menu.querySelector('.muc-menu.dang')?.scrollIntoView({ block: 'nearest' });
}
function chonMuc(i: number): void {
  if (!menuMo) return;
  const m = menuMo.luaChon.filter((x) => !x.html)[i];
  if (!m || m.tat) return;
  dongMenu();
  m.lam?.();
}
function dongMenu(): void {
  const f = menuMo?.khiDong;
  menuMo = null;
  menu.hidden = true;
  menu.innerHTML = '';
  f?.();
}
function phimMenu(ev: KeyboardEvent): boolean {
  if (!menuMo) return false;
  const n = menuMo.luaChon.filter((x) => !x.html).length;
  if (ev.key === 'ArrowDown') { menuMo.chi = (menuMo.chi + 1) % Math.max(1, n); danhDau(); ev.preventDefault(); return true; }
  if (ev.key === 'ArrowUp') { menuMo.chi = (menuMo.chi - 1 + n) % Math.max(1, n); danhDau(); ev.preventDefault(); return true; }
  if (ev.key === 'Enter' || ev.key === 'Tab') { ev.preventDefault(); chonMuc(menuMo.chi); return true; }
  if (ev.key === 'Escape') { ev.preventDefault(); dongMenu(); o.focus(); return true; }
  return false;
}
document.addEventListener('mousedown', (ev) => {
  if (menuMo && !menu.contains(ev.target as Node) && !(ev.target as HTMLElement).closest('.thanh-duoi, .cong-cu-dau')) dongMenu();
});

function moMenuModel(): void {
  const hienModel = S.ws?.model ?? S.info?.model;
  const hienMuc = S.ws?.mucNoLuc ?? 'vua';
  const mucHtml = `<div class="hang-muc">${dsMuc().map((m) => `<button class="cham-muc ${m.id === hienMuc ? 'bat' : ''}" data-muc="${m.id}" title="${esc(`${m.ten} — ${m.mo}`)}"></button>`).join('')}</div>`;
  moMenu([
    /* 18/10/2026: MỘT danh sách theo năng lực (thứ tự máy chủ), CHỈ tên CuongMini; cần khoá ⇒ tối hơn + 🔒. */
    ...dsModel().map((m) => ({
      nhom: 'Model',
      ten: `${m.canMoKhoa || m.canPro ? '🔒 ' : ''}${m.ten}`,
      mo: m.canPro ? L('cần gói Pro — cuongthai.com/pro', 'needs Pro — cuongthai.com/pro')
        : !m.dungDuoc ? L('tạm thời chưa dùng được', 'temporarily unavailable') : m.canMoKhoa ? `${L('cần khoá', 'needs a key')} — ${m.mo}` : m.mo,
      chon: m.id === hienModel, tat: !m.dungDuoc && !m.canPro, toi: m.canMoKhoa === true || m.canPro === true,
      lam: () => {
        if (m.canMoKhoa) { hoiMatKhauRoiChon(m); return; }
        if (m.canPro) { gui({ loai: 'moLink', url: 'https://cuongthai.com/pro' }); return; }
        if (m.dat && !confirm(`${m.ten} tốn nhiều hơn hẳn các model khác. Vẫn chọn?`)) return;
        void doiModel(m.id).catch((e: Error) => thongBao(e.message, true));
      },
    })),
    { nhom: `Mức nỗ lực — ${dsMuc().find((x) => x.id === hienMuc)?.ten ?? ''}`, ten: '', html: mucHtml },
    ...dsMuc().map((m) => ({ nhom: 'Mức nỗ lực', ten: m.ten, mo: m.mo, chon: m.id === hienMuc, lam: () => void doiMuc(m.id).catch((e: Error) => thongBao(e.message, true)) })),
  ]);
  menu.querySelectorAll<HTMLButtonElement>('.cham-muc').forEach((b) => b.addEventListener('mousedown', (ev) => {
    ev.preventDefault();
    dongMenu();
    void doiMuc(b.dataset.muc!).catch((e: Error) => thongBao(e.message, true));
  }));
}

/** Model cao chính hãng bị khoá ⇒ thẻ mật khẩu ngay trong bảng ghi, mở xong thì chọn luôn. */
function hoiMatKhauRoiChon(m: ModelMuc): void {
  const el = the('tin ket', `🔒 <b>${esc(m.ten)}</b> ${esc(L('cần khoá.', 'needs a key.'))}`);
  veOMatKhauAnthropic(el, () => {
    if (m.dat && !confirm(L(`${m.ten} đắt hơn hẳn các model khác. Vẫn chọn?`, `${m.ten} costs much more than the others. Use it anyway?`))) return;
    void doiModel(m.id).then(() => thongBao(L(`Đã chọn ${m.ten}.`, `Selected ${m.ten}.`))).catch((e: Error) => thongBao(e.message, true));
  }, m.id);
  cuonXuong(true);
}

function moMenuCheDo(): void {
  const hien = S.ws?.cheDoQuyen ?? 'keHoach';
  moMenu([
    ...CHE_DO.map((c) => ({ nhom: 'Chế độ quyền', ten: `${c.icon}  ${c.ten}`, mo: c.mo, chon: c.id === hien, lam: () => void doiCheDo(c.id).catch((e: Error) => thongBao(e.message, true)) })),
    { nhom: 'Công cụ', ten: '🌐  Điều khiển trình duyệt', mo: 'Mở trang, đọc, bấm, gõ, chụp, tải file', chon: S.ws?.choTrinhDuyet === true, lam: () => void batTatTrinhDuyet() },
  ]);
}

/** Bảng lệnh đầy đủ (nút `/` dưới ô chat) — như "Filter actions…" của Claude Code. */
function moBangLenh(): void {
  const model = dsModel().find((x) => x.id === (S.ws?.model ?? S.info?.model));
  const muc = dsMuc().find((x) => x.id === (S.ws?.mucNoLuc ?? 'vua'));
  const chay = (lenh: string) => () => { void chayLenh(lenh, boiCanh()); };
  moMenu([
    { nhom: 'Ngữ cảnh', ten: 'Đính kèm file…', lam: () => void dinhKemFile() },
    { nhom: 'Ngữ cảnh', ten: 'Nhắc file trong dự án…', phai: '@', lam: () => chenVaoO('@') },
    { nhom: 'Ngữ cảnh', ten: 'Việc mới (xoá hội thoại)', phai: '/clear', lam: chay('/clear') },
    { nhom: 'Ngữ cảnh', ten: 'Quay về câu hỏi trước', phai: '/rewind', lam: chay('/rewind') },
    { nhom: 'Ngữ cảnh', ten: 'Lịch sử việc', phai: '/resume', lam: () => void moLichSu() },
    { nhom: 'Ngữ cảnh', ten: 'Xuất hội thoại (Markdown)', phai: '/export', lam: chay('/export') },
    { nhom: 'Model', ten: 'Đổi model…', phai: model?.ten.replace(/^Cuong(Mini)? /, '') ?? '', lam: moMenuModel },
    { nhom: 'Model', ten: 'Mức nỗ lực…', phai: muc?.ten ?? '', lam: moMenuModel },
    { nhom: 'Công cụ', ten: S.ws?.choTrinhDuyet ? 'Tắt điều khiển trình duyệt' : 'Cho AI điều khiển trình duyệt', phai: '🌐', lam: () => void batTatTrinhDuyet() },
    { nhom: 'Model', ten: 'Chế độ quyền…', phai: CHE_DO.find((c) => c.id === S.ws?.cheDoQuyen)?.ngan ?? '', lam: moMenuCheDo },
    ...LENH_AGENT.filter((l) => !['/offline'].includes(l.ten)).map((l: LenhGach) => ({
      nhom: 'Lệnh', ten: l.ten, mo: l.mo, lam: () => { if (l.thamSo && /^</.test(l.thamSo)) chenVaoO(`${l.ten} `); else void chayLenh(l.ten, boiCanh()); },
    })),
    ...S.lenhDuAn.map((l) => ({ nhom: 'Lệnh của dự án', ten: l.ten, mo: l.mo, lam: () => chenVaoO(`${l.ten} `) })),
  ], { loc: true, goiY: 'Lọc lệnh và thao tác…' });
}

function moMenuThem(): void {
  moMenu([
    ...ghimDs.map((g) => ({ nhom: `Đã ghim (${ghimDs.length})`, ten: `📌 ${g.chu.replace(/\s+/g, ' ').slice(0, 60)}`, lam: () => { g.el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } })),
    /* 28/10/2026: kéo thả trong VS Code cần giữ Shift (VS Code phủ lớp chặn lên webview khi đang kéo) — nói ngay ở đây. */
    { nhom: 'Tệp', ten: 'Đính kèm file / thư mục / ảnh…', lam: () => void dinhKemFile() },
    { nhom: 'Tệp', ten: 'Cho CuongMini đọc một thư mục ngoài dự án…', lam: () => void chonThuMucNgoai() },
    { nhom: 'Tệp', ten: 'Kéo từ Finder/Explorer: giữ Shift khi thả', lam: () => thongBao('VS Code phủ một lớp lên khung chat khi bạn đang kéo, nên phải GIỮ Shift lúc thả thì file mới vào được đây (giới hạn của VS Code, extension không tắt được). Thư mục kéo vào được cấp quyền CHỈ ĐỌC.') },
    { nhom: 'Việc', ten: 'Lịch sử việc', lam: () => void moLichSu() },
    { nhom: 'Việc', ten: 'Xuất hội thoại (Markdown)', lam: () => void chayLenh('/export', boiCanh()) },
    { nhom: 'Việc', ten: 'Ngữ cảnh đã dùng', lam: () => void chayLenh('/context', boiCanh()) },
    { nhom: 'Việc', ten: 'Hạn mức', lam: () => void chayLenh('/usage', boiCanh()) },
    { nhom: 'Công cụ', ten: 'Bộ nhớ bài học', lam: () => void chayLenh('/memory', boiCanh()) },
    { nhom: 'Công cụ', ten: 'Máy chủ MCP', lam: () => void chayLenh('/mcp', boiCanh()) },
    { nhom: 'Công cụ', ten: 'Chẩn đoán', lam: () => void chayLenh('/doctor', boiCanh()) },
    { nhom: 'Công cụ', ten: 'Trợ giúp — mọi lệnh /', lam: () => void chayLenh('/help', boiCanh()) },
    { nhom: 'Tài khoản', ten: S.cheDoKetNoi === 'docLap' ? 'Đăng xuất' : 'Đang chạy qua app CuongThai', tat: S.cheDoKetNoi !== 'docLap', lam: () => gui({ loai: 'dangXuat' }) },
    { nhom: 'Tài khoản', ten: 'Cài đặt extension', lam: () => gui({ loai: 'moCaiDat' }) },
  ]);
}

// ─── Gợi ý khi gõ: `/lệnh` và `@file` ────────────────────────────

let henTim: number | null = null;
let soTim = 0;

function tokenTruocConTro(): { kieu: '/' | '@'; q: string; dau: number } | null {
  const truoc = o.value.slice(0, o.selectionStart ?? o.value.length);
  if (/^\/[^\s]*$/.test(truoc)) return { kieu: '/', q: truoc.slice(1), dau: 0 };
  const m = /(^|\s)@([^\s@]*)$/.exec(truoc);
  if (m) return { kieu: '@', q: m[2]!, dau: truoc.length - m[2]!.length - 1 };
  return null;
}

function thayToken(dau: number, chu: string): void {
  const cuoi = o.selectionStart ?? o.value.length;
  o.value = o.value.slice(0, dau) + chu + o.value.slice(cuoi);
  const vt = dau + chu.length;
  o.setSelectionRange(vt, vt);
  tuCao();
  o.focus();
}

function chenVaoO(chu: string): void {
  const vt = o.selectionStart ?? o.value.length;
  const truoc = o.value.slice(0, vt);
  const can = truoc && !/\s$/.test(truoc) && chu.startsWith('@') ? ' ' : '';
  o.value = truoc + can + chu + o.value.slice(vt);
  const moi = vt + can.length + chu.length;
  o.setSelectionRange(moi, moi);
  tuCao();
  o.focus();
  goiYKhiGo();
}

function goiYKhiGo(): void {
  const t = tokenTruocConTro();
  if (!t) { if (menuMo && !menu.querySelector('.loc')) dongMenu(); return; }
  if (t.kieu === '/') {
    const q = chuanHoa(t.q);
    const ds: MucMenu[] = [
      // Khớp TÊN lệnh (hoặc bí danh) lên trước, khớp mô tả xuống sau.
      ...LENH_AGENT.map((l) => ({ l, d: !q ? 1 : [l.ten, ...(l.khac ?? [])].some((k) => chuanHoa(k).startsWith(q)) ? 0
        : [l.ten, ...(l.khac ?? [])].some((k) => chuanHoa(k).includes(q)) ? 1 : chuanHoa(l.mo).includes(q) ? 2 : 9 }))
        .filter((x) => x.d < 9 && x.l.ten !== '/offline').sort((a, b) => a.d - b.d)
        .map(({ l }) => ({ nhom: 'Lệnh', ten: l.ten + (l.thamSo ? ` ${l.thamSo}` : ''), mo: l.mo, lam: () => thayToken(0, `${l.ten} `) })),
      ...S.lenhDuAn.filter((l) => !q || chuanHoa(l.ten).includes(q)).map((l) => ({ nhom: 'Lệnh của dự án', ten: l.ten, mo: l.mo, lam: () => thayToken(0, `${l.ten} `) })),
    ];
    if (!ds.length) { dongMenu(); return; }
    moMenu(ds.slice(0, 40));
    return;
  }
  // `@`: hỏi extension (file + thư mục trong dự án, hàm/lớp qua bộ ký hiệu của VS Code).
  if (henTim) clearTimeout(henTim);
  const so = ++soTim;
  henTim = window.setTimeout(async () => {
    const kq = await goi<Array<{ loai: string; nhan: string; chen: string; mo?: string }>>('vsc:timNhac', { q: t.q }).catch(() => []);
    if (so !== soTim || !tokenTruocConTro()) return;
    const icon: Record<string, string> = { dangMo: '📄', chon: '✂️', file: '📄', thuMuc: '📁', kyHieu: 'ƒ' };
    const nhom: Record<string, string> = { dangMo: 'Đang mở', chon: 'Đang mở', file: 'File', thuMuc: 'Thư mục', kyHieu: 'Hàm · lớp · biến' };
    if (!kq.length) { moMenu([{ ten: 'Không tìm thấy file nào khớp', tat: true }]); return; }
    moMenu(kq.map((x) => ({ nhom: nhom[x.loai] ?? 'File', ten: `${icon[x.loai] ?? '📄'} ${x.nhan}`, mo: x.mo, lam: () => { const t2 = tokenTruocConTro(); if (t2) thayToken(t2.dau, `${x.chen} `); } })));
  }, 90);
}

// ─── Gửi ─────────────────────────────────────────────────────────

/** Đường dẫn được nhắc bằng `@` ⇒ thêm một dòng nhắc model đọc chúng (chữ thường chắc ăn hơn ký hiệu). */
function phuLucNhac(text: string): string {
  const ds = [...new Set([...text.matchAll(/(?:^|\s)@([\w./\\-][^\s]*)/g)].map((m) => m[1]!))].slice(0, 20);
  if (!ds.length) return text;
  return `${text}\n\nFile/thư mục tôi nhắc tới (đọc bằng read_file / list_dir trước khi trả lời):\n${ds.map((d) => `- ${d}`).join('\n')}`;
}

/** Đợt 8A: hỏi gắn CT Work chờ lượt xong (sự kiện `ctwHoiGan`). */
let hoiGanCho: { key: string; projectId: number | null; workspaceId: number | null; workspace: string | null } | null = null;

async function guiCauHoi(): Promise<void> {
  const text = o.value.trim();
  if (!text) return;
  S.goiY = [];
  /* Đợt 4 — GÕ THÊM khi agent đang chạy: chèn vào lượt (lõi nối vào kết quả tool kế tiếp). Lệnh `/` đợi lượt xong. */
  if (S.dangChay) {
    if (text.startsWith('/')) { thongBao(L('Đang chạy — lệnh / chạy được sau khi lượt xong (Esc để dừng).', 'Running — slash commands work after the turn ends (Esc to stop).')); return; }
    const r = await goi<{ chen?: boolean }>('agent:chenTin', { text: text.slice(0, 8000) }).catch(() => null);
    if (r?.chen) { veNguoi(`↳ ${text}`, [], Date.now()); o.value = ''; tuCao(); cuonXuong(true); }
    else thongBao(L('Không chèn được (lượt vừa xong?) — gửi lại sau.', 'Could not insert (did the turn just end?) — send again.'), true);
    return;
  }
  dongMenu();
  if (text.startsWith('/')) {
    const l = tachLenh(text);
    if (l || text.startsWith('/') && S.lenhDuAn.some((x) => text.split(/\s/)[0] === x.ten)) {
      o.value = '';
      tuCao();
      await chayLenh(text, boiCanh());
      return;
    }
  }
  guiThat(text, {});
}

/** Gửi một câu cho agent (đã qua xử lý lệnh). `hienThi` = chữ hiện trên bảng (vd lệnh gốc `/plan …`). */
function guiThat(text: string, o2: { chiDoc?: boolean; hienThi?: string }): void {
  document.querySelector('.chao')?.remove();
  const luc = Date.now();
  S.tinDangGui = veNguoi(o2.hienThi ?? text, anhDinh, luc);
  S.chuLuot = '';
  cauHoiCuoi = text;
  gui({ loai: 'gui', text: phuLucNhac(text), anh: anhDinh, kem: kemNguCanh, ...(o2.chiDoc ? { chiDoc: true } : {}) });
  o.value = '';
  anhDinh = [];
  veAnh();
  tuCao();
  S.dangChay = true;
  S.batDauLuot = luc;
  S.pha = 'cho';
  S.buoc = null;
  batTrangThai();
  capNhatNut();
  cuonXuong(true);
}

function boiCanh(): BoiCanhLenh {
  return {
    S, goi, gui, guiThat, traLoi: traLoiHeThong, nut: nutHeThong, thongBao, xoaBang, moLichSu, doiModel, doiMuc, doiCheDo, dsModel, dsMuc,
    datNhap: (t: string) => { o.value = t; tuCao(); o.focus(); },
    moMenuModel, moMenuCheDo,
    lamMoiCtwork: () => { void napDongCtw(); },
  };
}

/** Đợt 5: dòng CT Work dưới ô nhập (dự án · sprint · còn N ngày · ▶ thẻ). Lõi đệm 5 phút. */
async function napDongCtw(): Promise<void> {
  const el = document.getElementById('dongCtw');
  if (!el) return;
  const r = await goi<{ ok: boolean; dong?: DongCtw | null }>('agent:ctworkHe', { viec: 'dong', ngonNgu: /^vi/i.test(navigator.language || 'vi') ? 'vi' : 'en' }).catch(() => null);
  const chu = veDongCtw(r?.ok ? r.dong ?? null : null, /^vi/i.test(navigator.language || 'vi') ? 'vi' : 'en', 140);
  el.hidden = !chu;
  el.textContent = chu;
  // Token hết hạn / bị thu hồi giữa phiên ⇒ đề nghị cấp lại một chạm.
  if (laLoiXacThucCtw(r?.dong?.loi) && !S.dangChay) void hoiCtworkMotLan(giaoDienCtwVsc(boiCanh())).catch(() => undefined);
}
let daHoiCtw = false;
/** Đợt 6: theo dõi nhẹ (lõi tự giới hạn ≥ 60 s; chỉ khi thư mục gắn dự án; tắt bằng /ctwork theo-doi off). */
async function baoTinCtw(): Promise<void> {
  const tin = await kiemTinCtw(giaoDienCtwVsc(boiCanh())).catch(() => [] as string[]);
  for (const t of tin) the('tin ket mo', esc(t));
}
setInterval(() => { void napDongCtw(); void baoTinCtw(); }, 60_000);

function capNhatNut(): void {
  nutGui.classList.toggle('dung', S.dangChay);
  nutGui.innerHTML = S.dangChay ? ICON.dung : ICON.gui;
  nutGui.title = S.dangChay ? 'Dừng (Esc)' : 'Gửi (Enter)';
  o.placeholder = S.dangChay ? L('CuongMini đang làm… gõ thêm để chèn vào lượt · Esc để dừng', 'CuongMini is working… type to add to this turn · Esc to stop')
    /* Đợt 8A: gợi ý bước tiếp = chữ mờ (placeholder) — Tab điền vào ô, Enter gửi. */
    : S.goiY.length ? `${S.goiY[0]}   ⇥ Tab` : 'Hỏi hoặc giao việc cho CuongMini…';
  if (S.dangChay) batTrangThai(); else tatTrangThai();
}

function tuCao(): void {
  o.style.height = 'auto';
  o.style.height = `${Math.min(240, o.scrollHeight)}px`;
}

function veChip(): void {
  const chip = $('chip');
  if (!nguCanh.file) { chip.innerHTML = ''; return; }
  const ten = nguCanh.file.split(/[\\/]/).pop();
  const dong = nguCanh.chon ? ` · dòng ${nguCanh.chon.tu}–${nguCanh.chon.den}` : '';
  chip.innerHTML = `<button class="chip ${kemNguCanh ? 'bat' : ''}" title="${esc(nguCanh.file)} — bấm để bật/tắt gửi kèm">${kemNguCanh ? '👁' : '◌'} ${esc(ten ?? '')}${dong}</button>`;
  chip.querySelector('button')!.addEventListener('click', () => { kemNguCanh = !kemNguCanh; veChip(); });
}

function veAnh(): void {
  const d = $('anh');
  d.innerHTML = anhDinh.map((a, i) => `<span class="anh-the"><img src="${a}" alt=""><button data-i="${i}">✕</button></span>`).join('');
  d.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.addEventListener('click', () => { anhDinh.splice(Number(b.dataset.i), 1); veAnh(); }));
}

function themAnhTuFile(f: File): void {
  if (anhDinh.length >= 8) return;
  const r = new FileReader();
  r.onload = () => { anhDinh.push(String(r.result)); veAnh(); };
  r.readAsDataURL(f);
}

/** 28/10/2026: chọn một thư mục NGOÀI dự án ⇒ cấp quyền CHỈ ĐỌC (đúng đường kéo-thả) ⇒ chèn `@đường/`. */
async function chonThuMucNgoai(ten: string | null = null): Promise<void> {
  try {
    const kq = await goi<{ chen: string[]; anh: string[] }>(ten ? 'vsc:thaThuMuc' : 'vsc:chonThuMucNgoai', ten ? { ten } : {});
    if (kq.chen.length) { chenVaoO(`${kq.chen.join(' ')} `); thongBao(`Đã cho CuongMini ĐỌC ${kq.chen.join(', ')} (chỉ đọc, chỉ phiên này).`); }
  } catch (e) {
    thongBao((e as Error).message, true);
  }
}

async function dinhKemFile(): Promise<void> {
  try {
    const kq = await goi<{ chen: string[]; anh: string[] }>('vsc:dinhKem');
    for (const a of kq.anh) if (anhDinh.length < 8) anhDinh.push(a);
    veAnh();
    if (kq.chen.length) chenVaoO(`${kq.chen.join(' ')} `);
  } catch (e) {
    thongBao((e as Error).message, true);
  }
}

// ─── Lịch sử việc ────────────────────────────────────────────────

type Phien = { id: string; tieuDe: string; duAn: string | null; luucLuc: number; soTinNhan: number; ghim?: boolean; luuTru?: boolean };
let dsPhienCache: Phien[] = [];

function luc(t: number): string {
  const d = Date.now() - t;
  if (d < 60_000) return 'vừa xong';
  if (d < 3_600_000) return `${Math.floor(d / 60_000)} phút trước`;
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)} giờ trước`;
  if (d < 7 * 86_400_000) return `${Math.floor(d / 86_400_000)} ngày trước`;
  return new Date(t).toLocaleDateString('vi-VN');
}

async function moLichSu(): Promise<void> {
  const ls = $('lichSu');
  ls.hidden = false;
  $('dsPhien').innerHTML = '<div class="trong">Đang tải…</div>';
  try {
    dsPhienCache = await goi<Phien[]>('agent:dsPhien');
  } catch (e) {
    $('dsPhien').innerHTML = `<div class="trong">${esc((e as Error).message)}</div>`;
    return;
  }
  veDsPhien($<HTMLInputElement>('timPhien').value);
  $<HTMLInputElement>('timPhien').focus();
}

function veDsPhien(q: string): void {
  const qq = chuanHoa(q);
  const ds = dsPhienCache
    .filter((p) => !p.luuTru && (!qq || chuanHoa(`${p.tieuDe} ${p.duAn ?? ''}`).includes(qq)))
    .sort((a, b) => Number(b.ghim === true) - Number(a.ghim === true) || b.luucLuc - a.luucLuc);
  const el = $('dsPhien');
  if (!ds.length) { el.innerHTML = `<div class="trong">${dsPhienCache.length ? 'Không có việc nào khớp.' : 'Chưa có việc nào được lưu.'}</div>`; return; }
  el.innerHTML = ds.map((p) => `<div class="phien" data-id="${esc(p.id)}">
<div class="phien-than"><div class="phien-ten">${p.ghim ? '📌 ' : ''}${esc(p.tieuDe || 'Việc chưa đặt tên')}</div>
<div class="phu">${p.duAn ? `${esc(p.duAn)} · ` : ''}${luc(p.luucLuc)} · ${p.soTinNhan} tin</div></div>
<div class="phien-nut"><button class="nut-nho" data-v="ghim" title="${p.ghim ? 'Bỏ ghim' : 'Ghim'}">📌</button><button class="nut-nho" data-v="ten" title="Đổi tên">✎</button><button class="nut-nho" data-v="xoa" title="Xoá">🗑</button></div></div>`).join('');
  el.querySelectorAll<HTMLElement>('.phien').forEach((row) => row.addEventListener('click', async (ev) => {
    const id = row.dataset.id!;
    const p = dsPhienCache.find((x) => x.id === id);
    const b = (ev.target as HTMLElement).closest('button');
    try {
      if (b?.dataset.v === 'ghim') { await goi('agent:ghimPhien', { id, bat: !p?.ghim }); if (p) p.ghim = !p.ghim; veDsPhien($<HTMLInputElement>('timPhien').value); return; }
      if (b?.dataset.v === 'ten') {
        const ten = prompt('Tên mới cho việc này:', p?.tieuDe ?? '');
        if (ten?.trim()) { await goi('agent:doiTenPhien', { id, ten: ten.trim() }); if (p) p.tieuDe = ten.trim(); veDsPhien($<HTMLInputElement>('timPhien').value); }
        return;
      }
      if (b?.dataset.v === 'xoa') {
        if (!confirm(`Xoá việc "${p?.tieuDe ?? ''}"? Không lấy lại được.`)) return;
        await goi('agent:xoaPhien', { id });
        dsPhienCache = dsPhienCache.filter((x) => x.id !== id);
        veDsPhien($<HTMLInputElement>('timPhien').value);
        return;
      }
      await moPhien(id, p?.tieuDe ?? '');
    } catch (e) {
      thongBao((e as Error).message, true);
    }
  }));
}

async function moPhien(id: string, tieuDe: string): Promise<void> {
  if (S.dangChay) { thongBao('Việc này đang chạy — dừng lại hoặc đợi xong rồi mới mở việc khác.', true); return; }
  const r = await goi<{ muc: Array<{ kieu: string; text?: string; ten?: string; tomTat?: string }> } | null>('agent:moPhien', { id });
  $('lichSu').hidden = true;
  if (!r) { thongBao('Không mở được việc này (file phiên đã mất).', true); return; }
  bang.innerHTML = '';
  S.muc = [];
  S.tieuDe = '';
  for (const m of r.muc) {
    if (m.kieu === 'nguoi') veNguoi(m.text ?? '');
    else if (m.kieu === 'may') {
      const el = the('tin may', `<div class="than md">${md(m.text ?? '')}</div>`);
      lamGiau(el);
      S.muc.push({ kieu: 'may', text: m.text });
      ganNutTin(el, () => m.text ?? '');
    } else if (m.kieu === 'tool') {
      S.muc.push({ kieu: 'tool', ten: m.ten, tomTat: m.tomTat });
      the('tool', `<details><summary><span class="cham xong"></span><b>${esc(nhanTool(m.ten ?? ''))}</b> <span class="phu">${esc(m.tomTat ?? '')}</span></summary></details>`);
    }
  }
  if (tieuDe) datTieuDe(tieuDe);
  the('tin ket', `↺ Đã mở lại việc cũ${tieuDe ? ` "${esc(tieuDe)}"` : ''} — hỏi tiếp là CuongMini nhớ toàn bộ ngữ cảnh.`);
  cuonXuong(true);
}

$<HTMLInputElement>('timPhien').addEventListener('input', (e) => veDsPhien((e.target as HTMLInputElement).value));
$<HTMLInputElement>('timPhien').addEventListener('keydown', (e) => { if (e.key === 'Escape') $('lichSu').hidden = true; });
$('dongLichSu').addEventListener('click', () => { $('lichSu').hidden = true; });

// ─── Mic ─────────────────────────────────────────────────────────

let dangGhi = false;
async function batTatMic(): Promise<void> {
  const nut = $('nutMic');
  if (!dangGhi) {
    try {
      await goi('vsc:ghiAm', { bat: true });
      dangGhi = true;
      nut.classList.add('ghi');
      nut.title = 'Đang nghe… bấm lần nữa để dừng';
    } catch (e) {
      thongBao((e as Error).message, true);
    }
    return;
  }
  dangGhi = false;
  nut.classList.remove('ghi');
  nut.classList.add('nghe');
  nut.title = 'Đang nhận dạng…';
  try {
    const chu = await goi<string>('vsc:ghiAm', { bat: false });
    if (chu.trim()) chenVaoO(chu.trim());
    else thongBao('Không nghe rõ — thử nói gần micro hơn.');
  } catch (e) {
    thongBao((e as Error).message, true);
  } finally {
    nut.classList.remove('nghe');
    nut.title = 'Nói thay vì gõ';
  }
}

// ─── Kéo thả file / thư mục ──────────────────────────────────────

let demKeo = 0;
const keoTha = $('keoTha');
document.addEventListener('dragenter', (e) => { e.preventDefault(); demKeo += 1; keoTha.hidden = false; });
document.addEventListener('dragleave', () => { demKeo = Math.max(0, demKeo - 1); if (!demKeo) keoTha.hidden = true; });
document.addEventListener('dragover', (e) => { e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'; });
document.addEventListener('drop', (e) => {
  e.preventDefault();
  demKeo = 0;
  keoTha.hidden = true;
  void thaVao(e.dataTransfer);
});

async function thaVao(dt: DataTransfer | null): Promise<void> {
  if (!dt) return;
  // Từ Explorer/tab editor của VS Code: danh sách URI.
  const uriTho = dt.getData('application/vnd.code.uri-list') || dt.getData('text/uri-list');
  const uris = uriTho.split(/\r?\n/).map((x) => x.trim()).filter((x) => x && !x.startsWith('#'));
  if (uris.length) {
    try {
      const kq = await goi<{ chen: string[]; anh: string[] }>('vsc:thaUri', { uris });
      for (const a of kq.anh) if (anhDinh.length < 8) anhDinh.push(a);
      veAnh();
      if (kq.chen.length) chenVaoO(`${kq.chen.join(' ')} `);
    } catch (er) {
      thongBao((er as Error).message, true);
    }
    return;
  }
  // Từ Finder/Explorer của hệ điều hành: nội dung file.
  const files = [...dt.files];
  /* 28/10/2026: THƯ MỤC từ Finder đến dưới dạng File 0 byte, không đường dẫn ⇒ đừng "đính kèm" (hỏng); xin cấp quyền
     CHỈ ĐỌC qua extension (dò thư mục cùng tên hoặc hộp chọn thư mục). */
  const laThuMuc = (i: number): boolean => {
    const it = dt.items?.[i] as (DataTransferItem & { webkitGetAsEntry?: () => { isDirectory: boolean } | null }) | undefined;
    const en = it?.webkitGetAsEntry?.();
    return en ? en.isDirectory : (files[i]!.size === 0 && !files[i]!.type && !/\.[a-z0-9]{1,8}$/i.test(files[i]!.name));
  };
  const thuMuc = files.map((f, i) => (laThuMuc(i) ? f.name : null));
  for (const [i, f] of files.slice(0, 10).entries()) {
    if (thuMuc[i]) { await chonThuMucNgoai(thuMuc[i]!); continue; }
    if (f.type.startsWith('image/')) { themAnhTuFile(f); continue; }
    if (f.size > 20 * 1024 * 1024) { thongBao(`${f.name} quá lớn (> 20MB).`, true); continue; }
    const b64 = await new Promise<string>((ok) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1] ?? ''); r.readAsDataURL(f); });
    try {
      const kq = await goi<{ chen: string }>('vsc:thaFile', { ten: f.name, base64: b64 });
      chenVaoO(`${kq.chen} `);
    } catch (er) {
      thongBao((er as Error).message, true);
    }
  }
  if (!files.length) {
    const chu = dt.getData('text/plain');
    if (chu) chenVaoO(chu);
  }
}

// ─── Sự kiện giao diện ───────────────────────────────────────────

o.addEventListener('input', () => { if (o.value && S.goiY.length) { S.goiY = []; capNhatNut(); } tuCao(); goiYKhiGo(); });
o.addEventListener('click', () => goiYKhiGo());
o.addEventListener('keydown', (e) => {
  if (menuMo && !menu.querySelector('.loc') && phimMenu(e)) return;
  // Đợt 5: thẻ lựa chọn đang mở + ô nhập trống ⇒ phím số chọn, Esc đóng (như CLI).
  if (!o.value && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const tc = theChonMo();
    if (tc && /^[0-9]$/.test(e.key)) {
      const b = tc.querySelector<HTMLButtonElement>(`button[data-so="${e.key}"]`);
      if (b && !b.disabled) { e.preventDefault(); b.click(); return; }
    }
    if (tc && e.key === 'Escape' && !S.dangChay) { e.preventDefault(); tc.querySelectorAll('button').forEach((x) => { x.disabled = true; }); delete tc.dataset.theChon; return; }
  }
  /* Đợt 8A: ô TRỐNG + có gợi ý bước tiếp ⇒ Tab điền câu đầu (Enter mới gửi). Menu `/`/`@` đã xử lý ở trên. */
  if (e.key === 'Tab' && !e.shiftKey && !o.value && S.goiY.length && !S.dangChay) {
    e.preventDefault();
    o.value = S.goiY[0]!;
    S.goiY = [];
    capNhatNut();
    tuCao();
    return;
  }
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); void guiCauHoi(); return; }
  if (e.key === 'Escape' && S.dangChay) { e.preventDefault(); gui({ loai: 'dung' }); }
});
o.addEventListener('paste', (e) => {
  const tep = [...(e.clipboardData?.items ?? [])].filter((i) => i.kind === 'file' && i.type.startsWith('image/')).map((i) => i.getAsFile()).filter(Boolean) as File[];
  if (!tep.length) return;
  e.preventDefault();
  for (const f of tep.slice(0, 8 - anhDinh.length)) themAnhTuFile(f);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && S.dangChay && document.activeElement !== o && !menuMo) gui({ loai: 'dung' });
});
nutGui.addEventListener('click', () => { if (S.dangChay) gui({ loai: 'dung' }); else void guiCauHoi(); });
$('nutMoi').addEventListener('click', () => { if (!S.dangChay) void chayLenh('/clear', boiCanh()); });
$('nutLichSu').addEventListener('click', () => { if ($('lichSu').hidden) void moLichSu(); else $('lichSu').hidden = true; });
$('nutThem').addEventListener('click', () => (menuMo ? dongMenu() : moMenuThem()));
$('nutKep').addEventListener('click', () => void dinhKemFile());
$('nutGach').addEventListener('click', () => (menuMo ? dongMenu() : moBangLenh()));
$('nutA').addEventListener('click', () => chenVaoO('@'));
$('nutModel').addEventListener('click', () => (menuMo ? dongMenu() : moMenuModel()));
$('nutCheDo').addEventListener('click', () => (menuMo ? dongMenu() : moMenuCheDo()));
$('nutMic').addEventListener('click', () => void batTatMic());

function veWs(ws: typeof S.ws): void {
  if (!ws) return;
  S.ws = ws;
  capNhatDau();
  capNhatChon();
}

window.addEventListener('message', (ev) => {
  const m = ev.data as SuKien;
  switch (m.loai) {
    case 'rpcKq': nhanKetQua(m as never); break;
    case 'ketNoi':
      if (!m.ok && (m.lyDo === 'chuaDangNhap' || m.lyDo === 'hetPhien')) {
        banner.hidden = true;
        S.ketNoi = false;
        veDangNhap(m.lyDo === 'hetPhien' ? 'Phiên đăng nhập đã hết hạn — đăng nhập lại nhé.' : '');
        $('duAn').textContent = 'chưa đăng nhập';
        return;
      }
      if (!m.ok && m.lyDo === 'loiKhoiDong') {
        banner.hidden = false;
        banner.innerHTML = `<b>Không khởi động được CuongMini Code.</b><br>${esc(String(m.chu ?? ''))}<div class="nut-hang"><button class="nut" id="nutThuLai">Thử lại</button></div>`;
        document.getElementById('nutThuLai')?.addEventListener('click', () => gui({ loai: 'thuLai' }));
        return;
      }
      if (!m.ok) {
        S.ketNoi = false;
        banner.hidden = false;
        banner.innerHTML = m.lyDo === 'matKetNoi'
          ? '⚡ Mất kết nối với app CuongThai — đang nối lại…'
          : '<b>Chưa thấy app CuongThai đang chạy.</b><br>Cài đặt <code>cuongthai.cheDo</code> đang là "app". Mở app, hoặc đổi về "tuDong" để chạy ngay trong VS Code.<div class="nut-hang"><button class="nut chinh" id="nutMoApp">Mở app CuongThai</button><button class="nut" id="nutThuLai">Thử lại</button></div>';
        document.getElementById('nutMoApp')?.addEventListener('click', () => gui({ loai: 'moApp' }));
        document.getElementById('nutThuLai')?.addEventListener('click', () => gui({ loai: 'thuLai' }));
        $('duAn').textContent = 'chưa kết nối';
        return;
      }
      banner.hidden = true;
      document.querySelector('.dang-nhap')?.remove();
      S.ketNoi = true;
      S.cheDoKetNoi = m.cheDo === 'docLap' ? 'docLap' : 'app';
      S.phienBan = String(m.phienBan ?? '');
      S.info = m.info ?? S.info;
      veWs(m.ws);
      if (m.bangGhi?.dangChay) { S.dangChay = true; S.batDauLuot = Date.now(); S.pha = 'nghi'; capNhatNut(); }
      if (m.bangGhi?.muc?.length && !bang.querySelector('.tin')) {
        for (const x of m.bangGhi.muc as Array<{ kieu: string; text?: string; ten?: string; tomTat?: string }>) {
          if (x.kieu === 'nguoi') veNguoi(x.text ?? '');
          else if (x.kieu === 'may') { const el = the('tin may', `<div class="than md">${md(x.text ?? '')}</div>`); lamGiau(el); S.muc.push({ kieu: 'may', text: x.text }); }
          else if (x.kieu === 'tool') the('tool', `<details><summary><span class="cham xong"></span><b>${esc(nhanTool(x.ten ?? ''))}</b> <span class="phu">${esc(x.tomTat ?? '')}</span></summary></details>`);
        }
      }
      loiChao();
      void goi<Array<{ ten: string; mo: string; than: string }>>('agent:lenhDuAn').then((ds) => { S.lenhDuAn = ds ?? []; }).catch(() => undefined);
      void hoiHenLo();
      // Đợt 5: dòng CT Work + hỏi MỘT lần (kết nối / cấp lại token / gắn dự án đoán từ AGENTS.md).
      void napDongCtw();
      /* Đợt 6: không có gì để hỏi (đã nối + đã gắn) ⇒ "Hôm nay" (lõi: một lần mỗi ngày mỗi thư mục). */
      if (!daHoiCtw) { daHoiCtw = true; setTimeout(() => { void hoiCtworkMotLan(giaoDienCtwVsc(boiCanh())).then((coHoi) => { if (!coHoi) void homNayCtw(giaoDienCtwVsc(boiCanh()), { tuDong: true }).catch(() => undefined); }).catch(() => undefined); }, 1200); }
      break;
    case 'ws': veWs(m.ws); break;
    case 'info': S.info = m.info; capNhatChon(); break;
    case 'suKien': xuLy(m.e as SuKien); break;
    case 'daXoa': xoaBang(); break;
    case 'nguCanh': nguCanh = m as never; if (m.bat === false) kemNguCanh = false; veChip(); break;
    case 'loiCuc': {
      thongBao(String(m.chu), true);
      ketLuot('', true);
      break;
    }
    case 'thongBao': thongBao(String(m.chu)); break;
    case 'duPhongMo': {
      const cho = oDangCho;
      if (cho) {
        cho.nut.disabled = false;
        cho.kq.textContent = m.ok ? (cho.khiXong ? `✓ Đã mở ${m.ten}.` : `✓ Đã mở ${m.ten}. Đang gửi lại câu hỏi…`) : `✕ ${m.loi}`;
      }
      /* Ô trong lời mời nâng cấp có bước kế tiếp riêng (chọn model) — không tự gửi lại. */
      if (m.ok && cho?.khiXong) { oDangCho = null; cho.khiXong(); break; }
      if (m.ok && cauHoiCuoi) { o.value = cauHoiCuoi; void guiCauHoi(); }
      break;
    }
    case 'congAnthropicMo': {
      const cho = oAnthropicCho;
      oAnthropicCho = null;
      if (m.info) { S.info = m.info; capNhatChon(); }
      if (cho) {
        cho.nut.disabled = false;
        cho.kq.textContent = m.ok ? L('✓ Đã mở khoá (vé 48 giờ).', '✓ Unlocked (48-hour pass).') : `✕ ${m.loi}`;
        if (m.ok) cho.khiXong();
      }
      break;
    }
    case 'dangNhapKq': {
      const kq = document.querySelector<HTMLElement>('.dang-nhap .kq');
      document.querySelectorAll<HTMLButtonElement>('.dang-nhap button').forEach((b) => { b.disabled = false; });
      if (kq) kq.textContent = m.ok ? '✓ Đã đăng nhập, đang khởi động…' : `✕ ${String(m.loi ?? 'Không đăng nhập được.')}`;
      break;
    }
    case 'dien':
      o.value = String(m.text ?? '') + (m.guiLuon ? '' : o.value);
      tuCao();
      o.focus();
      if (m.guiLuon) void guiCauHoi();
      break;
    case 'chenNhac':
      chenVaoO(`${String(m.chen ?? '')} `);
      break;
    case 'lichSu': void moLichSu(); break;
  }
});

capNhatNut();
capNhatChon();
gui({ loai: 'sanSang' });
