/**
 * Giao diện khung chat trong VS Code. Dựng bằng DOM thuần (nhẹ, không React) —
 * nhận sự kiện AI Code từ extension và vẽ: chữ chảy (markdown), dòng tool, thẻ
 * duyệt (sửa file / lệnh / git / MCP / ghi chú), kế hoạch, kết quả lệnh.
 *
 * ⚠️ Chữ của model đi qua `marked` rồi `DOMPurify` — webview vẫn là trình
 * duyệt, chèn HTML thô của model là cửa cho mã lạ.
 */
import DOMPurify from 'dompurify';
import { marked } from 'marked';

declare function acquireVsCodeApi(): { postMessage(m: unknown): void; getState(): unknown; setState(s: unknown): void };
const vsc = acquireVsCodeApi();
const gui = (m: unknown) => vsc.postMessage(m);

type SuKien = { loai: string; [k: string]: any };

const CHE_DO: Array<[string, string]> = [
  ['keHoach', '📝 Lập kế hoạch (chỉ đọc)'],
  ['hoi', '✋ Hỏi trước mọi việc'],
  ['tuSua', '✏️ Tự sửa file'],
  ['tuSuaVaLenh', '⚡ Tự sửa + lệnh an toàn'],
  ['boQuaHet', '🚀 Bỏ qua tất cả'],
];
const MUC: Array<[string, string]> = [['thap', 'Nhanh'], ['vua', 'Vừa'], ['cao', 'Kỹ'], ['ratCao', 'Rất kỹ'], ['toiDa', 'Tối đa']];

const logo = document.body.dataset.logo ?? '';
const goc = document.getElementById('goc')!;
goc.innerHTML = `
<header class="dau">
  <img class="logo" src="${logo}" alt="">
  <div class="tieude"><b>AI Code</b><span id="duAn" class="phu">đang nối app…</span></div>
  <button id="nutMoi" class="icon" title="Việc mới">＋</button>
</header>
<div class="thanh">
  <select id="cheDo" title="Chế độ quyền"></select>
  <select id="model" title="Model"></select>
  <select id="muc" title="Mức nỗ lực"></select>
</div>
<main id="bang" class="bang"></main>
<div id="banner" class="banner" hidden></div>
<footer class="soan">
  <div id="chip" class="chip-dai"></div>
  <div id="anh" class="anh-dai"></div>
  <textarea id="o" rows="1" placeholder="Hỏi hoặc giao việc cho AI… (Enter gửi, Shift+Enter xuống dòng, dán ảnh được)"></textarea>
  <div class="hang">
    <span class="goi-y">@ file đang mở tự đi kèm</span>
    <button id="nutDung" class="nut phu2" hidden>■ Dừng</button>
    <button id="nutGui" class="nut chinh">Gửi ➤</button>
  </div>
</footer>`;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const bang = $('bang');
const o = $<HTMLTextAreaElement>('o');
const nutGui = $<HTMLButtonElement>('nutGui');
const nutDung = $<HTMLButtonElement>('nutDung');
const banner = $('banner');
const selCheDo = $<HTMLSelectElement>('cheDo');
const selModel = $<HTMLSelectElement>('model');
const selMuc = $<HTMLSelectElement>('muc');

for (const [v, t] of CHE_DO) selCheDo.add(new Option(t, v));
for (const [v, t] of MUC) selMuc.add(new Option(t, v));
selMuc.value = 'vua';

let dangChay = false;
let anhDinh: string[] = [];
let kemNguCanh = true;
let nguCanh: { file: string | null; chon?: { tu: number; den: number } | null } = { file: null };

// ─── Vẽ ────────────────────────────────────────────────────────────

function cuonXuong(): void {
  const gan = bang.scrollHeight - bang.scrollTop - bang.clientHeight < 160;
  if (gan) bang.scrollTop = bang.scrollHeight;
}

function the(lop: string, html = ''): HTMLElement {
  const d = document.createElement('div');
  d.className = lop;
  if (html) d.innerHTML = html;
  bang.appendChild(d);
  cuonXuong();
  return d;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

function md(chu: string): string {
  return DOMPurify.sanitize(marked.parse(chu, { async: false, gfm: true, breaks: true }) as string);
}

let traLoi: { el: HTMLElement; chu: string; hen: number | null } | null = null;
function veTraLoi(): void {
  if (!traLoi) return;
  traLoi.el.innerHTML = md(traLoi.chu);
  traLoi.hen = null;
  ganLinkFile(traLoi.el);
  cuonXuong();
}
function themChu(delta: string): void {
  if (!traLoi) traLoi = { el: the('ai md'), chu: '', hen: null };
  traLoi.chu += delta;
  if (traLoi.hen === null) traLoi.hen = requestAnimationFrame(veTraLoi);
}
function ketThucTraLoi(): void {
  if (traLoi?.hen) { cancelAnimationFrame(traLoi.hen); veTraLoi(); }
  traLoi = null;
}

/** Bấm link `http(s)` mở trình duyệt; bấm `đường/dẫn.ts` trong code mở file. */
function ganLinkFile(el: HTMLElement): void {
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
    if (c.parentElement?.tagName !== 'PRE' && /^[\w./\\-]+\.[a-z0-9]{1,6}(:\d+)?$/i.test(t) && t.length < 200) {
      c.classList.add('file');
      c.title = 'Mở file';
      c.addEventListener('click', () => gui({ loai: 'moFile', duong: t.replace(/:\d+$/, '') }));
    }
  });
}

function veDiff(diff: { dong: Array<{ loai: string; text: string }>; soThem: number; soBo: number; quaLon: boolean } | undefined): string {
  if (!diff) return '';
  const dong = diff.dong.slice(0, 400).map((d) => `<div class="d ${d.loai}">${d.loai === 'them' ? '+' : d.loai === 'bo' ? '−' : ' '} ${esc(d.text)}</div>`).join('');
  return `<div class="diff"><div class="diff-dau"><span class="xanh">+${diff.soThem}</span> <span class="do">−${diff.soBo}</span>${diff.quaLon ? ' · quá dài, chỉ hiện một phần' : ''}</div>${dong}</div>`;
}

const toolDangChay = new Map<string, HTMLElement>();
let khoiLenh: HTMLElement | null = null;

const NHAN_TOOL: Record<string, string> = {
  read_file: '📖 Đọc', list_dir: '📂 Xem thư mục', grep: '🔎 Tìm', glob: '🔎 Tìm file', edit_file: '✏️ Sửa', create_file: '📄 Tạo',
  sua_nhieu_cho: '✏️ Sửa', xoa_file: '🗑 Xoá', doi_ten_file: '↪ Đổi tên', run_command: '⌨️ Chạy lệnh', chay_lenh_nen: '⚙️ Lệnh nền',
  git_status: '🌿 Git', git_diff: '🌿 Diff', git_commit: '🌿 Commit', git_day: '⬆️ Đẩy GitHub', tao_pr: '🔀 Mở PR',
  github_ket_noi: '🐙 GitHub', github_dang_du_an: '🐙 Lên GitHub', cai_cong_cu: '🧰 Cài công cụ', web_mo: '🌐 Mở web',
  web_doc: '🌐 Đọc web', tim_web: '🌐 Tìm web', doc_web: '🌐 Đọc web', giao_viec_phu: '🤖 Agent phụ', dung_ky_nang: '🎯 Skill',
};

function nhanTool(ten: string): string {
  if (ten.startsWith('mcp__')) return `🔌 ${ten.split('__').slice(1).join(' · ')}`;
  return NHAN_TOOL[ten] ?? `🛠 ${ten}`;
}

function nutDuyet(id: string, cacNut: Array<[string, string, string?]>): string {
  return `<div class="nut-hang">${cacNut.map(([q, t, lop]) => `<button class="nut ${lop ?? ''}" data-id="${esc(id)}" data-q="${q}">${t}</button>`).join('')}</div>`;
}

function theDuyet(id: string, tieuDe: string, than: string, cacNut: Array<[string, string, string?]>, muc = 'cankiem'): void {
  const el = the(`duyet ${muc}`, `<div class="duyet-dau">${tieuDe}</div>${than}${nutDuyet(id, cacNut)}`);
  el.dataset.id = id;
  el.querySelectorAll<HTMLButtonElement>('button[data-q]').forEach((b) => b.addEventListener('click', () => {
    el.querySelectorAll('button').forEach((x) => { x.disabled = true; });
    gui({ loai: 'traLoi', id, quyetDinh: b.dataset.q });
  }));
}

const DUYET_CHUAN: Array<[string, string, string?]> = [['choPhep', 'Cho phép', 'chinh'], ['choPhepCaFile', 'Cho phép cả việc này'], ['tuChoi', 'Từ chối', 'phu2']];

function xuLy(e: SuKien): void {
  switch (e.loai) {
    case 'batDau':
      dangChay = true;
      capNhatNut();
      break;
    case 'chu':
      themChu(String(e.delta ?? ''));
      break;
    case 'toolBatDau': {
      ketThucTraLoi();
      const el = the('tool dang', `<span class="xoay"></span><b>${esc(nhanTool(e.ten))}</b> <span class="phu">đang chạy…</span>`);
      toolDangChay.set(e.id, el);
      khoiLenh = null;
      break;
    }
    case 'tool': {
      ketThucTraLoi();
      const cu = e.id ? toolDangChay.get(e.id) : undefined;
      const el = cu ?? the('tool');
      if (e.id) toolDangChay.delete(e.id);
      el.className = 'tool';
      const file = e.duongDan ? ` <a class="file-link" data-duong="${esc(e.duongDan)}">${esc(e.duongDan)}</a>` : '';
      const chiTiet = e.diff ? veDiff(e.diff) : e.chiTiet ? `<pre class="chitiet">${esc(String(e.chiTiet).slice(0, 6000))}</pre>` : '';
      el.innerHTML = `<details><summary><span class="tick">✓</span><b>${esc(nhanTool(e.ten))}</b>${file} <span class="phu">${esc(e.tomTat ?? '')}</span></summary>${chiTiet}</details>`;
      el.querySelector<HTMLElement>('.file-link')?.addEventListener('click', (ev) => { ev.preventDefault(); gui({ loai: 'moFile', duong: e.duongDan }); });
      break;
    }
    case 'lenhRa': {
      if (!khoiLenh) khoiLenh = the('lenh-ra');
      khoiLenh.textContent = ((khoiLenh.textContent ?? '') + e.mau).slice(-8000);
      khoiLenh.scrollTop = khoiLenh.scrollHeight;
      cuonXuong();
      break;
    }
    case 'xinPhep':
      ketThucTraLoi();
      theDuyet(e.id, `${e.taoMoi ? '📄 Tạo file' : '✏️ Sửa file'} <a class="file-link">${esc(e.duongDan)}</a>`, veDiff(e.diff), DUYET_CHUAN);
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
      dangChay = false;
      capNhatNut();
      const phan = [e.soFileDaSua ? `${e.soFileDaSua} file đã sửa` : '', e.hanMuc?.conLai != null ? '' : ''].filter(Boolean);
      the('ket', `✓ Xong${phan.length ? ` · ${phan.join(' · ')}` : ''}`);
      break;
    }
    case 'loi': {
      ketThucTraLoi();
      dangChay = false;
      capNhatNut();
      the('loi', `⚠️ ${esc(e.thongDiep ?? 'Có lỗi.')}`);
      break;
    }
    case 'huy':
      ketThucTraLoi();
      dangChay = false;
      capNhatNut();
      the('ket', '■ Đã dừng');
      break;
    case 'daXoa':
      bang.innerHTML = '';
      loiChao();
      break;
  }
}

function loiChao(): void {
  if (bang.children.length) return;
  the('chao', `<img src="${logo}" alt=""><h2>Chào bạn 👋</h2>
<p>Mình là <b>AI Code</b> của CuongThai — đọc, sửa code, chạy lệnh, dùng skill và đưa dự án lên GitHub ngay trong thư mục bạn đang mở.</p>
<div class="goi-y-nhanh">
  <button data-cau="Giải thích dự án này: cấu trúc thư mục, công nghệ, cách chạy.">🧭 Giải thích dự án</button>
  <button data-cau="Tìm và sửa lỗi đang có trong dự án (chạy build/test để kiểm).">🐞 Tìm & sửa lỗi</button>
  <button data-cau="Đưa dự án này lên GitHub giúp mình (repo riêng tư).">🐙 Đưa lên GitHub</button>
</div>`);
  bang.querySelectorAll<HTMLButtonElement>('.goi-y-nhanh button').forEach((b) => b.addEventListener('click', () => {
    o.value = b.dataset.cau ?? '';
    guiCauHoi();
  }));
}

function capNhatNut(): void {
  nutDung.hidden = !dangChay;
  nutGui.disabled = dangChay;
  o.placeholder = dangChay ? 'AI đang làm… (bấm Dừng để ngắt)' : 'Hỏi hoặc giao việc cho AI… (Enter gửi, Shift+Enter xuống dòng, dán ảnh được)';
}

function veChip(): void {
  const chip = $('chip');
  if (!nguCanh.file) { chip.innerHTML = ''; return; }
  const ten = nguCanh.file.split(/[\\/]/).pop();
  const dong = nguCanh.chon ? ` · dòng ${nguCanh.chon.tu}–${nguCanh.chon.den}` : '';
  chip.innerHTML = `<button class="chip ${kemNguCanh ? 'bat' : ''}" title="${esc(nguCanh.file)} — bấm để bật/tắt gửi kèm">📄 ${esc(ten ?? '')}${dong}</button>`;
  chip.querySelector('button')!.addEventListener('click', () => { kemNguCanh = !kemNguCanh; veChip(); });
}

function veAnh(): void {
  const d = $('anh');
  d.innerHTML = anhDinh.map((a, i) => `<span class="anh-the"><img src="${a}" alt=""><button data-i="${i}">✕</button></span>`).join('');
  d.querySelectorAll<HTMLButtonElement>('button').forEach((b) => b.addEventListener('click', () => { anhDinh.splice(Number(b.dataset.i), 1); veAnh(); }));
}

function guiCauHoi(): void {
  const text = o.value.trim();
  if (!text || dangChay) return;
  document.querySelector('.chao')?.remove();
  the('nguoi', `${esc(text).replace(/\n/g, '<br>')}${anhDinh.length ? `<div class="anh-nho">${anhDinh.map((a) => `<img src="${a}" alt="">`).join('')}</div>` : ''}`);
  gui({ loai: 'gui', text, anh: anhDinh, kem: kemNguCanh });
  o.value = '';
  anhDinh = [];
  veAnh();
  tuCao();
  dangChay = true;
  capNhatNut();
}

function tuCao(): void {
  o.style.height = 'auto';
  o.style.height = `${Math.min(200, o.scrollHeight)}px`;
}

// ─── Sự kiện giao diện ─────────────────────────────────────────────

o.addEventListener('input', tuCao);
o.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); guiCauHoi(); }
});
o.addEventListener('paste', (e) => {
  const tep = [...(e.clipboardData?.items ?? [])].filter((i) => i.kind === 'file' && i.type.startsWith('image/')).map((i) => i.getAsFile()).filter(Boolean) as File[];
  if (!tep.length) return;
  e.preventDefault();
  for (const f of tep.slice(0, 8 - anhDinh.length)) {
    const r = new FileReader();
    r.onload = () => { anhDinh.push(String(r.result)); veAnh(); };
    r.readAsDataURL(f);
  }
});
nutGui.addEventListener('click', guiCauHoi);
nutDung.addEventListener('click', () => gui({ loai: 'dung' }));
$('nutMoi').addEventListener('click', () => { if (!dangChay) gui({ loai: 'viecMoi' }); });
selCheDo.addEventListener('change', () => gui({ loai: 'datCheDo', cheDo: selCheDo.value }));
selModel.addEventListener('change', () => gui({ loai: 'datModel', model: selModel.value }));
selMuc.addEventListener('change', () => gui({ loai: 'datMuc', muc: selMuc.value }));

function veWs(ws: any): void {
  if (!ws) return;
  $('duAn').textContent = ws.name ? `${ws.name}${ws.branch ? ` · ${ws.branch}` : ''}` : 'chưa mở thư mục — làm ở thư mục nhà';
  if (ws.cheDoQuyen) selCheDo.value = ws.cheDoQuyen;
}

function veInfo(info: any): void {
  if (!info) return;
  selModel.innerHTML = '';
  for (const m of info.models ?? []) {
    const op = new Option(`${m.ten}${m.dungDuoc ? '' : ' (chưa mở)'}`, m.id);
    op.disabled = !m.dungDuoc;
    selModel.add(op);
  }
  if (info.model) selModel.value = info.model;
  selModel.hidden = !(info.models?.length);
}

window.addEventListener('message', (ev) => {
  const m = ev.data as SuKien;
  switch (m.loai) {
    case 'ketNoi':
      if (!m.ok) {
        banner.hidden = false;
        banner.innerHTML = m.lyDo === 'matKetNoi'
          ? '⚡ Mất kết nối với app CuongThai — đang nối lại…'
          : `<b>Chưa thấy app CuongThai đang chạy.</b><br>AI Code chạy bằng app desktop (cùng skill, model, quyền như trong app).<div class="nut-hang"><button class="nut chinh" id="nutMoApp">Mở app CuongThai</button><button class="nut" id="nutThuLai">Thử lại</button></div>`;
        document.getElementById('nutMoApp')?.addEventListener('click', () => gui({ loai: 'moApp' }));
        document.getElementById('nutThuLai')?.addEventListener('click', () => gui({ loai: 'thuLai' }));
        $('duAn').textContent = 'chưa nối app';
        return;
      }
      banner.hidden = true;
      veWs(m.ws);
      veInfo(m.info);
      if (m.mucNoLuc && [...selMuc.options].some((x) => x.value === m.mucNoLuc)) selMuc.value = m.mucNoLuc;
      if (m.bangGhi?.dangChay) { dangChay = true; capNhatNut(); }
      loiChao();
      break;
    case 'ws': veWs(m.ws); break;
    case 'info': veInfo(m.info); break;
    case 'suKien': xuLy(m.e as SuKien); break;
    case 'daXoa': bang.innerHTML = ''; loiChao(); break;
    case 'nguCanh': nguCanh = m as any; if (m.bat === false) kemNguCanh = false; veChip(); break;
    case 'loiCuc': the('loi', `⚠️ ${esc(String(m.chu))}`); dangChay = false; capNhatNut(); break;
    case 'thongBao': the('ket', esc(String(m.chu))); break;
    case 'dien':
      o.value = String(m.text ?? '') + (m.guiLuon ? '' : o.value);
      tuCao();
      o.focus();
      if (m.guiLuon) guiCauHoi();
      break;
  }
});

capNhatNut();
gui({ loai: 'sanSang' });
