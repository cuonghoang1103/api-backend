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
import { chayLenh, type BoiCanhLenh } from './lenh';

type SuKien = { loai: string; [k: string]: any };
type Muc = { kieu: string; text?: string; ten?: string; tomTat?: string; anh?: string[]; [k: string]: unknown };
type ModelMuc = { id: string; ten: string; mo: string; dungDuoc: boolean; dat?: boolean };
type MucNoLuc = { id: string; ten: string; mo: string };

// ─── Hằng ────────────────────────────────────────────────────────

const CHE_DO: Array<{ id: string; ten: string; ngan: string; mo: string; icon: string }> = [
  { id: 'keHoach', ten: 'Lập kế hoạch', ngan: 'Kế hoạch', mo: 'Chỉ đọc — không sửa, không chạy lệnh', icon: '📝' },
  { id: 'hoi', ten: 'Hỏi trước mọi việc', ngan: 'Hỏi trước', mo: 'Mỗi lần sửa/chạy lệnh đều hỏi bạn', icon: '✋' },
  { id: 'tuSua', ten: 'Tự sửa file', ngan: 'Tự sửa', mo: 'Sửa file không hỏi, lệnh vẫn hỏi', icon: '✏️' },
  { id: 'tuSuaVaLenh', ten: 'Tự sửa + lệnh an toàn', ngan: 'Tự động', mo: 'Sửa + chạy lệnh an toàn không hỏi', icon: '⚡' },
  { id: 'boQuaHet', ten: 'Bỏ qua tất cả', ngan: 'Bỏ qua hết', mo: 'Không hỏi gì — chỉ dùng khi tin tưởng', icon: '🚀' },
];
const MODEL_DU_PHONG: ModelMuc[] = [
  { id: 'sonnet-5', ten: 'Cuong Sonnet 5', mo: 'Mặc định — nhanh, rẻ', dungDuoc: true },
  { id: 'opus-4-8', ten: 'CuongMini Max 4.8', mo: 'Mạnh nhất cho việc khó', dungDuoc: true },
  { id: 'gpt-sol', ten: 'GPT 6 Sol', mo: 'Ý kiến thứ hai', dungDuoc: true },
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
  github_ket_noi: 'GitHub', github_dang_du_an: 'Lên GitHub', cai_cong_cu: 'Cài công cụ', web_mo: 'Mở web',
  web_doc: 'Đọc web', tim_web: 'Tìm web', doc_web: 'Đọc web', giao_viec_phu: 'Agent phụ', dung_ky_nang: 'Skill',
  cap_nhat_ke_hoach: 'Kế hoạch', ghi_nho: 'Ghi nhớ',
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
      <button id="nutKep" class="icon nho" title="Đính kèm file, thư mục, ảnh">${ICON.kep}</button>
      <button id="nutGach" class="icon nho" title="Lệnh  (gõ /)">${ICON.gach}</button>
      <button id="nutA" class="icon nho" title="Nhắc file / thư mục / hàm  (gõ @)">${ICON.a}</button>
      <button id="nutModel" class="chip-chon" title="Model và mức nỗ lực"></button>
      <span class="gian"></span>
      <button id="nutCheDo" class="chip-chon che-do" title="Chế độ quyền"></button>
      <button id="nutMic" class="icon nho" title="Nói thay vì gõ">${ICON.mic}</button>
      <button id="nutGui" class="nut-gui" title="Gửi (Enter)">${ICON.gui}</button>
    </div>
  </div>
  <div class="meo">Enter gửi · Shift+Enter xuống dòng · <b>/</b> lệnh · <b>@</b> nhắc file · Esc dừng</div>
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
  if (ten.startsWith('mcp__')) return ten.split('__').slice(1).join(' · ');
  return NHAN_TOOL[ten] ?? ten;
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

function xuLy(e: SuKien): void {
  switch (e.loai) {
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
      const chiTiet = e.diff ? veDiff(e.diff)
        : ra ? `${e.ten === 'run_command' && e.tomTat ? `<div class="nhan-lenh">$ ${esc(String(e.tomTat))}</div>` : ''}<pre class="chitiet">${esc(ra.slice(-12000))}</pre>`
        : '<div class="phu">Không có đầu ra.</div>';
      el.innerHTML = `<details><summary><span class="cham ${hong ? 'hong' : 'xong'}"></span><b>${esc(nhanTool(e.ten))}</b>${file} <span class="phu">${esc(e.tomTat ?? '')}</span><span class="mo-rong">›</span></summary><div class="ben-trong">${chiTiet}</div></details>`;
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
      theDuyet(e.id, `${e.taoMoi ? '📄 Tạo file' : '✏️ Sửa file'} <a class="file-link" data-duong="${esc(e.duongDan)}">${esc(e.duongDan)}</a>`, veDiff(e.diff), DUYET_CHUAN);
      break;
    case 'xinPhepLenh': {
      ketThucTraLoi();
      const pl = e.phanLoai ?? { muc: 'thuong', lyDo: [], choNho: true };
      const lyDo = pl.lyDo?.length ? `<ul class="ly-do">${pl.lyDo.map((x: string) => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
      const nut: Array<[string, string, string?]> = [['choPhep', 'Chạy', 'chinh']];
      if (pl.choNho) nut.push(['choPhepCaFile', 'Luôn cho lệnh này']);
      nut.push(['tuChoi', 'Từ chối', 'phu2']);
      theDuyet(e.id, '⌨️ Chạy lệnh', `<pre class="lenh">${esc(e.lenh)}</pre>${lyDo}`, nut, pl.muc);
      break;
    }
    case 'xinPhepMcp':
      ketThucTraLoi();
      theDuyet(e.id, `🔌 Gọi công cụ ${esc(e.server)} · ${esc(e.tool)}`, `<pre class="chitiet">${esc(String(e.args).slice(0, 3000))}</pre>`,
        [['choPhep', 'Cho phép', 'chinh'], ['tuChoi', 'Từ chối', 'phu2']]);
      break;
    case 'xinPhepGit': {
      ketThucTraLoi();
      const tieu = { commit: '🌿 Commit', pr: '🔀 Đẩy nhánh + mở Pull Request', day: '⬆️ Đẩy lên GitHub', cai: '🧰 Cài công cụ' }[e.viec as string] ?? 'Git';
      const nhan = { commit: 'Commit', pr: 'Đẩy và mở PR', day: 'Đẩy lên GitHub', cai: 'Cài' }[e.viec as string] ?? 'Đồng ý';
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
      S.tienPhien += Number(e.tienUsd ?? 0);
      S.soFileDaSua = Number(e.soFileDaSua ?? S.soFileDaSua);
      ketLuot(`${S.soFileDaSua ? `${S.soFileDaSua} file đã sửa` : ''}`);
      if (S.choDuyetKeHoach) veDuyetKeHoach();
      break;
    }
    case 'loi': {
      ketThucTraLoi();
      if (['DOI_CONG', 'KHOI_PHUC', 'LAM_TIEP', 'COMPACT', 'DOI_CHE_DO', 'TU_GO_ANH'].includes(e.ma)) {
        if (e.ma === 'COMPACT') S.daCompact = true;
        the('tin ket', `ℹ️ ${esc(e.thongDiep ?? '')}`);
        break;
      }
      ketLuot('', true);
      S.muc.push({ kieu: 'loi', text: e.thongDiep ?? '' });
      const el = the('tin loi', `⚠️ ${esc(e.thongDiep ?? 'Có lỗi.')}`);
      if (e.ma === 'RAMBO_BAO_TRI') veODuPhong(el);
      if (e.ma === 'PRO_REQUIRED') {
        const n = document.createElement('div');
        n.className = 'nut-hang';
        n.innerHTML = '<button class="nut chinh">Xem gói Pro</button>';
        n.querySelector('button')!.addEventListener('click', () => gui({ loai: 'moLink', url: 'https://cuongthai.com/pro' }));
        el.appendChild(n);
      }
      if (e.ma === '401' || e.ma === 'UNAUTHORIZED' || e.ma === 'NO_SESSION') gui({ loai: 'hetPhien' });
      break;
    }
    case 'huy':
      ketThucTraLoi();
      ketLuot('đã dừng');
      break;
    case 'daXoa':
      xoaBang();
      break;
  }
}

/** Kết một lượt: tắt trạng thái, ghi giờ xong + thời lượng dưới câu trả lời (như Claude Code). */
function ketLuot(ghiChu: string, loi = false): void {
  const tong = S.batDauLuot ? Date.now() - S.batDauLuot : 0;
  S.dangChay = false;
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
let oDangCho: { kq: HTMLElement; nut: HTMLButtonElement } | null = null;
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

const dsModel = (): ModelMuc[] => (S.info?.models?.length ? S.info.models : MODEL_DU_PHONG)
  .map((m) => ({ ...m, ten: m.ten.replace(/^Claude Sonnet\b/, 'Cuong Sonnet').replace(/^Claude Opus\b/, 'CuongMini Max').replace(/^Claude Haiku\b/, 'Cuong Haiku').replace(/^Claude Fable\b/, 'Cuong Fable') }));
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

async function doiCheDo(id: string): Promise<void> {
  const ws = await goi('agent:datCheDoQuyen', { cheDo: id }) as typeof S.ws;
  if (ws) S.ws = ws;
  capNhatChon();
}

// ─── Menu nổi (kiểu bảng lệnh của Claude Code) ───────────────────

interface MucMenu { nhom?: string; ten: string; mo?: string; phai?: string; chon?: boolean; tat?: boolean; lam?: () => void; html?: string }
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
    return `${dauNhom}<div class="muc-menu ${i === menuMo!.chi ? 'dang' : ''} ${m.tat ? 'tat' : ''}" data-i="${i}">
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
    ...dsModel().map((m) => ({
      nhom: 'Model', ten: m.ten, mo: m.dungDuoc ? m.mo : 'chưa mở trên máy chủ', chon: m.id === hienModel, tat: !m.dungDuoc,
      lam: () => {
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

async function guiCauHoi(): Promise<void> {
  const text = o.value.trim();
  if (!text || S.dangChay) return;
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
    S, goi, gui, guiThat, traLoi: traLoiHeThong, thongBao, xoaBang, moLichSu, doiModel, doiMuc, doiCheDo, dsModel, dsMuc,
    datNhap: (t: string) => { o.value = t; tuCao(); o.focus(); },
    moMenuModel, moMenuCheDo,
  };
}

function capNhatNut(): void {
  nutGui.classList.toggle('dung', S.dangChay);
  nutGui.innerHTML = S.dangChay ? ICON.dung : ICON.gui;
  nutGui.title = S.dangChay ? 'Dừng (Esc)' : 'Gửi (Enter)';
  o.placeholder = S.dangChay ? 'CuongMini đang làm… (Esc để dừng)' : 'Hỏi hoặc giao việc cho CuongMini…';
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
  for (const f of files.slice(0, 10)) {
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

o.addEventListener('input', () => { tuCao(); goiYKhiGo(); });
o.addEventListener('click', () => goiYKhiGo());
o.addEventListener('keydown', (e) => {
  if (menuMo && !menu.querySelector('.loc') && phimMenu(e)) return;
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
    case 'duPhongMo':
      if (oDangCho) {
        oDangCho.nut.disabled = false;
        oDangCho.kq.textContent = m.ok ? `✓ Đã mở ${m.ten}. Đang gửi lại câu hỏi…` : `✕ ${m.loi}`;
      }
      if (m.ok && cauHoiCuoi) { o.value = cauHoiCuoi; void guiCauHoi(); }
      break;
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
