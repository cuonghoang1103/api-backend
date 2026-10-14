#!/usr/bin/env node
/**
 * codelab-kiem-de-web.mjs — kiểm bộ đề Code Lab "Nền tảng Web" (track web-foundations-practice).
 * ─────────────────────────────────────────────────────────────────────────────
 * Đọc nguồn đề ở content/codelab/web-foundations-practice/nguon/*.mjs và:
 *   1. kiểm ĐỦ TRƯỜNG từng đề (theo luật của codelab-seed-authored.mjs + luật riêng:
 *      ≥1 ví dụ, đúng 2 gợi ý trở lên, có lời giải + giải thích + lỗi hay gặp, có bộ kiểm);
 *   2. đếm đề theo module / độ khó (module phải có 6–8 đề, sắp EASY → MEDIUM → HARD);
 *   3. CHẠY bộ kiểm (testsJson) trên LỜI GIẢI bằng jsdom ⇒ phải ĐẠT hết,
 *      và trên CODE KHỞI ĐẦU ⇒ phải TRƯỢT ít nhất một (bộ kiểm không được rỗng nghĩa);
 *   4. so JSON payload (đầu vào của seed) với nguồn; `--xuat` ghi lại JSON + _track.json.
 *
 *   node scripts/codelab-kiem-de-web.mjs            # kiểm, không ghi gì
 *   node scripts/codelab-kiem-de-web.mjs --xuat     # kiểm rồi ghi JSON
 *   node scripts/codelab-kiem-de-web.mjs --chi wf-3-3-flexbox   # một module
 *   node scripts/codelab-kiem-de-web.mjs --chi-tiet # in từng kiểm
 *
 * Từ Ch4–Ch5 (đợt đề 2) có thêm máy chấm JS — xem _luoc-do.mjs mục "MỞ RỘNG CH4–CH5":
 *   loại 'js' / 'console' / 'module' chạy bằng node:vm (scripts/codelab-cham-js.mjs: realm mới mỗi
 *   kiểm, hẹn giờ + fetch GIẢ, trần CPU 1000ms); loại 'dom' có `chayScript` chạy <script> trong jsdom
 *   rồi làm các bước `truoc` (click/nhập/gửi form/phím). Loại 'module' cần vm.SourceTextModule ⇒
 *   script tự chạy lại chính nó với `--experimental-vm-modules` (không cần gõ cờ).
 *
 * jsdom: repo gốc không cài; script tự tìm ở node_modules của gốc, frontend/, desktop/
 * (frontend kéo jsdom gián tiếp, desktop có trong devDependencies). Worktree chưa
 * `npm ci` frontend thì chỉ đường: JSDOM_TU=/đường/tới/thư-mục-có-node_modules.
 * Không có jsdom ⇒ vẫn kiểm trường + đếm, bỏ phần chạy kiểm và báo VÀNG.
 *
 * GIỚI HẠN CỦA jsdom (máy chấm thật ở đợt 2 chạy trong trình duyệt, không vướng):
 *   - Không có bố cục: getBoundingClientRect() = 0. Loại 'kich-thuoc' và 'so-cot'
 *     được ƯỚC LƯỢNG từ giá trị khai báo (px, box-sizing, padding/border/margin của
 *     tổ tiên, repeat(auto-fit, minmax(Apx, …))). Giá trị không phải px ⇒ BỎ QUA (báo rõ).
 *   - Không hiểu @media: script tự "làm phẳng" — khối @media khớp với beRong được
 *     mở ra tại chỗ, khối không khớp bị bỏ (hỗ trợ min-/max-width theo px/em/rem, and, dấu phẩy).
 *   - Không mở shorthand `flex-flow`, `text-decoration`, `list-style` (script tự đọc phần cần), không giải
 *     var(); `gap` đọc được nhưng không tách ra column-gap/row-gap. Lời giải viết longhand.
 *   - Độ dài 0 chưa ai đặt trả về "0" (trình duyệt: "0px") ⇒ kiểm số 0 viết khop '^0(px)?$'.
 *   - Bảng kiểu mặc định của jsdom bị tính như CSS tác giả (`:link` (0,1,0) thắng `nav a`);
 *     script vá bằng cách bọc nó trong :where() lúc nạp. Hai !important đánh nhau thì jsdom lấy
 *     cái sau cùng (trình duyệt so độ đặc hiệu) — chỉ ảnh hưởng code khởi đầu cố ý có !important.
 *   - Trình duyệt có margin mặc định 8px cho body; jsdom không ⇒ script chèn
 *     `body{margin:8px}` làm bảng kiểu đầu tiên (tác giả đè được như thật).
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

// loại 'module' cần vm.SourceTextModule ⇒ chạy lại chính mình với cờ (một lần, truyền nguyên tham số)
if (!vm.SourceTextModule && !process.env.CODELAB_KIEM_DA_BAT_CO) {
  const r = spawnSync(process.execPath, ['--experimental-vm-modules', '--no-warnings', ...process.argv.slice(1)], {
    stdio: 'inherit', env: { ...process.env, CODELAB_KIEM_DA_BAT_CO: '1' },
  });
  process.exit(r.status ?? 1);
}
const { chamKiemJs, chamKiemModule, laMongDoiLoi } = await import('./codelab-cham-js.mjs');

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THU_MUC = path.join(GOC, 'content/codelab/web-foundations-practice');
const NGUON = path.join(THU_MUC, 'nguon');
const TRACK = 'web-foundations-practice';

const args = process.argv.slice(2);
const co = (f) => args.includes(f);
const lay = (f) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const XUAT = co('--xuat');
const CHI_TIET = co('--chi-tiet');
const CHI = lay('--chi');

const { xuatDe } = await import(pathToFileURL(path.join(NGUON, '_luoc-do.mjs')).href);

// ─── tìm jsdom ────────────────────────────────────────────────────────────
// jsdom coi bảng kiểu mặc định của nó (default-stylesheet.css) như CSS của TÁC GIẢ: `:link { color }`
// (0,1,0) thắng `nav a` (0,0,2) của người học — trình duyệt thật thì luật tác giả LUÔN thắng luật
// user-agent bất kể độ đặc hiệu. Vá: trước khi nạp jsdom, bọc mọi bộ chọn của tệp đó trong :where(…)
// (độ đặc hiệu 0) — nó được xử lý đầu tiên nên mọi luật tác giả cùng thuộc tính đều đè được.
const _docTep = fs.readFileSync;
fs.readFileSync = function (tep, ...rest) {
  const kq = _docTep.call(this, tep, ...rest);
  if (typeof tep === 'string' && tep.endsWith('default-stylesheet.css') && typeof kq === 'string') {
    return kq.replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[{}])(\s*)([^{}@;]+?)(\s*)\{/g, (m, a, s1, sel, s2) => (sel.includes('::') ? m : `${a}${s1}:where(${sel})${s2}{`));
  }
  return kq;
};

function timJsdom() {
  const coSo = [process.env.JSDOM_TU, GOC, path.join(GOC, 'frontend'), path.join(GOC, 'desktop')].filter(Boolean);
  for (const c of coSo) {
    try {
      const req = createRequire(path.join(c, 'package.json'));
      const j = req('jsdom');
      return { JSDOM: j.JSDOM, VirtualConsole: j.VirtualConsole, requestInterceptor: j.requestInterceptor, tu: c };
    } catch { /* thử chỗ kế */ }
  }
  return null;
}
const JS = timJsdom();

// ─── dựng trang như máy chấm trình duyệt ──────────────────────────────────
const UA_CSS = 'body{margin:8px}';

function ghepTep(files, tepHtml) {
  let html = files[tepHtml];
  if (html == null) throw new Error(`thiếu tệp ${tepHtml}`);
  html = html.replace(/<link\b[^>]*>/gi, (tag) => {
    if (!/rel\s*=\s*["']?stylesheet/i.test(tag)) return tag;
    const m = tag.match(/href\s*=\s*["']([^"']+)["']/i);
    if (!m || files[m[1]] == null) return tag;
    // giữ thẻ <link> (để kiểm cấu trúc head) và chèn nội dung tệp ngay sau nó — đúng vị trí cascade
    return `${tag}<style data-tu="${m[1]}">\n${files[m[1]]}\n</style>`;
  });
  return html;
}

const PX_DON_VI = (n, dv) => (dv === 'em' || dv === 'rem' ? n * 16 : n);

function khopMedia(text, w) {
  return text.split(',').some((phan) => {
    let p = phan.trim().toLowerCase();
    if (!p) return false;
    let phu = false;
    if (p.startsWith('not ')) { phu = true; p = p.slice(4); }
    p = p.replace(/^only\s+/, '');
    const cacVe = p.split(/\s+and\s+/);
    let dung = true;
    for (const v of cacVe) {
      const t = v.trim();
      if (t === 'all' || t === 'screen') continue;
      if (t === 'print' || t === 'speech') { dung = false; continue; }
      let m = t.match(/^\(\s*(min|max)-width\s*:\s*([\d.]+)(px|em|rem)\s*\)$/);
      if (m) {
        const g = PX_DON_VI(parseFloat(m[2]), m[3]);
        if (m[1] === 'min' ? !(w >= g) : !(w <= g)) dung = false;
        continue;
      }
      m = t.match(/^\(\s*width\s*(>=|<=|>|<)\s*([\d.]+)(px|em|rem)\s*\)$/);
      if (m) {
        const g = PX_DON_VI(parseFloat(m[2]), m[3]);
        const ok = { '>=': w >= g, '<=': w <= g, '>': w > g, '<': w < g }[m[1]];
        if (!ok) dung = false;
        continue;
      }
      dung = false; // đặc tính lạ (orientation, prefers-*) ⇒ coi như không khớp
    }
    return phu ? !dung : dung;
  });
}

function lamPhangMedia(doc, w) {
  for (const st of [...doc.querySelectorAll('style')]) {
    const sheet = st.sheet;
    if (!sheet) continue;
    const ra = [];
    const di = (rules) => {
      for (const r of rules) {
        if (r.constructor.name === 'CSSMediaRule') { if (khopMedia(r.media.mediaText, w)) di(r.cssRules); }
        else if (r.constructor.name === 'CSSStyleRule' && r.selectorText.includes('::')) {
          // jsdom bỏ CẢ quy tắc khi danh sách bộ chọn có giả phần tử (*, *::before …) — trình duyệt
          // thì không. Giả phần tử không ảnh hưởng phần tử thật ⇒ lược chúng khỏi danh sách.
          const con = r.selectorText.split(',').map((x) => x.trim()).filter((x) => !x.includes('::'));
          if (con.length) ra.push(`${con.join(', ')} { ${r.style.cssText} }`);
        } else ra.push(r.cssText);
      }
    };
    di(sheet.cssRules);
    st.textContent = ra.join('\n');
  }
}

const boNho = new Map();
function dungTrang(files, tepHtml, w, moi = false) {
  const khoa = `${w}\u0000${tepHtml}\u0000${JSON.stringify(files)}`;
  if (!moi && boNho.has(khoa)) return boNho.get(khoa);
  const dom = new JS.JSDOM(ghepTep(files, tepHtml));
  // bảng kiểu "trình duyệt" đứng TRƯỚC mọi bảng kiểu của tác giả — chèn bằng DOM làm con đầu
  // của <html> (không vào <head>, để kiểm kiểu "meta charset là con đầu của head" không lệch)
  const ua = dom.window.document.createElement('style');
  ua.setAttribute('data-ua', '');
  ua.textContent = UA_CSS;
  dom.window.document.documentElement.insertBefore(ua, dom.window.document.documentElement.firstChild);
  lamPhangMedia(dom.window.document, w);
  const kq = { win: dom.window, doc: dom.window.document, w };
  if (!moi) boNho.set(khoa, kq);
  return kq;
}

// ─── trang có chạy script (dom + chayScript, Bài 4.5) ─────────────────────
const fmtLog = (v) => {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null || ['number', 'boolean', 'bigint'].includes(typeof v)) return String(v);
  if (typeof v === 'function') return '[Function]';
  if (v && typeof v === 'object' && typeof v.name === 'string' && typeof v.message === 'string' && 'stack' in v) return `${v.name}: ${v.message}`;
  try { return JSON.stringify(v); } catch { return String(v); }
};

/** script cổ điển không defer/async có src là tệp trong bài ⇒ chèn nội tuyến đúng chỗ (chặn parser như trình duyệt) */
function ghepTepScript(files, tepHtml) {
  return ghepTep(files, tepHtml).replace(/<script\b([^>]*)>\s*<\/script>/gi, (tag, attrs) => {
    const m = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    if (!m || files[m[1]] == null) return tag;
    if (/\b(defer|async)\b/i.test(attrs) || /type\s*=\s*["']?module/i.test(attrs)) return tag;
    const conLai = attrs.replace(/\bsrc\s*=\s*["'][^"']+["']/i, ` data-tu="${m[1]}"`);
    return `<script${conLai}>\n${files[m[1]].replace(/<\/script/gi, '<\\/script')}\n</script>`;
  });
}

const choTick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function dungTrangScript(files, tepHtml, w, truoc) {
  const log = [], loi = [];
  const ghi = (...a) => log.push(a.map(fmtLog).join(' '));
  // dựng (hoặc dựng LẠI — trình duyệt tải lại trang khi form gửi đi mà không preventDefault)
  async function tao() {
    const vc = new JS.VirtualConsole();
    for (const lv of ['log', 'info', 'warn', 'error', 'debug']) vc.on(lv, ghi);
    vc.on('jsdomError', (e) => { if (e.type === 'unhandled-exception' || (!e.type && /^Uncaught/.test(e.message))) loi.push(fmtLog(e.cause || e)); });
    const dom = new JS.JSDOM(ghepTepScript(files, tepHtml), {
      runScripts: 'dangerously',
      url: `https://bai.local/${tepHtml}`,
      virtualConsole: vc,
      pretendToBeVisual: true,
      resources: {
        interceptors: [JS.requestInterceptor((req) => {
          const p = decodeURIComponent(new URL(req.url).pathname.slice(1));
          return /\.m?js$/.test(p) && files[p] != null
            ? new Response(files[p], { headers: { 'content-type': 'text/javascript' } })
            : new Response('Not Found', { status: 404 });
        })],
      },
    });
    const win = dom.window, doc = win.document;
    if (doc.readyState !== 'complete') await new Promise((r) => { win.addEventListener('load', r); setTimeout(r, 3000); });
    await choTick();
    const ua = doc.createElement('style');
    ua.setAttribute('data-ua', '');
    ua.textContent = UA_CSS;
    doc.documentElement.insertBefore(ua, doc.documentElement.firstChild);
    lamPhangMedia(doc, w);
    // theo dõi submit: listener gắn SAU script của trang ⇒ chạy sau handler của người học
    const t = { win, doc, w, log, loi, guiChuaChan: false, taiLai: 0 };
    doc.addEventListener('submit', (e) => { setTimeout(() => { if (!e.defaultPrevented) t.guiChuaChan = true; }, 0); });
    return t;
  }
  let t = await tao();
  let taiLai = 0;
  for (const b of truoc || []) {
    const el = b.selector ? t.doc.querySelector(b.selector) : null;
    if (b.selector && !el) return { ...t, hong: `không có ${b.selector} để ${b.hanhDong}` };
    const { win } = t;
    try {
      switch (b.hanhDong) {
        case 'click': for (let i = 0; i < (b.lan || 1); i++) el.click(); break;
        case 'nhap': el.value = b.giaTri; el.dispatchEvent(new win.Event('input', { bubbles: true })); break;
        case 'doi': if (b.giaTri !== undefined) el.value = b.giaTri; el.dispatchEvent(new win.Event('change', { bubbles: true })); break;
        case 'gui': (el.tagName === 'FORM' ? el : el.form).requestSubmit(); break;
        case 'phim': el.dispatchEvent(new win.KeyboardEvent('keydown', { key: b.phim, bubbles: true, cancelable: true })); break;
        default: return { ...t, hong: `hành động lạ ${b.hanhDong}` };
      }
    } catch (e) { loi.push(fmtLog(e)); }
    await choTick();
    await choTick();
    if (t.guiChuaChan) {        // form gửi đi thật ⇒ trình duyệt tải lại trang: mọi thay đổi DOM mất
      taiLai++;
      t = await tao();
    }
  }
  t.taiLai = taiLai;
  return t;
}

// ─── chuẩn hoá giá trị CSS ────────────────────────────────────────────────
function chuanCss(v) {
  return String(v ?? '').trim().toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
    .replace(/(-?[\d.]+)rem\b/g, (_, n) => `${+(parseFloat(n) * 16).toFixed(4)}px`);
}
const gonChu = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const regex = (k) => new RegExp(k, 'i');

/** đọc một thuộc tính computed; bù chỗ jsdom không tách shorthand thành longhand */
function docCss(cs, prop) {
  if (prop === 'text-decoration-line') {
    const t = String(cs.getPropertyValue('text-decoration') || '');
    const m = t.match(/\b(none|underline|overline|line-through)\b/g);
    if (m) return m.join(' ');
  }
  if (prop === 'list-style-type') {
    const t = String(cs.getPropertyValue('list-style') || '');
    const m = t.match(/\b(none|disc|circle|square|decimal|lower-alpha|upper-alpha|lower-roman|upper-roman)\b/);
    if (m) return m[1];
  }
  return cs.getPropertyValue(prop);
}

// ─── ước lượng bố cục (jsdom không có layout) ─────────────────────────────
const px = (v) => { const m = String(v).trim().match(/^(-?[\d.]+)px$/); return m ? parseFloat(m[1]) : null; };
const pxHoac0 = (v) => px(chuanCss(v)) ?? 0;

/** bề rộng vùng nội dung của el (px) tại bề rộng khung nhìn w — ước lượng, null nếu không tính được */
function beRongNoiDung(win, el, w) {
  const chuoi = [];
  for (let e = el; e && e.nodeType === 1; e = e.parentElement) chuoi.unshift(e);
  let W = w;
  for (const e of chuoi) {
    const cs = win.getComputedStyle(e);
    const ngang = (a) => pxHoac0(cs.getPropertyValue(`${a}-left${a === 'border' ? '-width' : ''}`))
      + pxHoac0(cs.getPropertyValue(`${a}-right${a === 'border' ? '-width' : ''}`));
    const pad = ngang('padding'), bor = ngang('border');
    const mar = ['margin-left', 'margin-right'].map((p) => px(chuanCss(cs.getPropertyValue(p))) ?? 0).reduce((a, b) => a + b, 0);
    const bb = cs.getPropertyValue('box-sizing') === 'border-box';
    const wKhai = chuanCss(cs.getPropertyValue('width'));
    const maxW = px(chuanCss(cs.getPropertyValue('max-width')));
    let hop; // bề rộng hộp viền
    // phần tử con của grid/flex: "không gian cha cho" không phải cả bề rộng cha
    const cha = e.parentElement;
    const csCha = cha ? win.getComputedStyle(cha) : null;
    const hienCha = csCha ? chuanCss(csCha.getPropertyValue('display')) : '';
    if (hienCha === 'grid' && (!wKhai || wKhai === 'auto')) {
      const ranh = cacRanhCot(win, cha, W);
      if (!ranh) return null;
      const vt = [...cha.children].indexOf(e) % ranh.length; // tự xếp, không span
      hop = ranh[vt] - mar;
    } else if (hienCha === 'flex' && px(wKhai) == null) {
      const huong = chuanCss(csCha.getPropertyValue('flex-direction'));
      const canh = chuanCss(csCha.getPropertyValue('align-items'));
      if (!/^column/.test(huong) || !/^(normal|stretch|)$/.test(canh)) return null; // flex hàng: cần bố cục thật
      hop = W - mar;
    } else if (px(wKhai) != null) hop = bb ? px(wKhai) : px(wKhai) + pad + bor;
    else if (/%$/.test(wKhai)) { const p = parseFloat(wKhai) / 100 * W; hop = bb ? p : p + pad + bor; }
    else if (!wKhai || wKhai === 'auto') hop = W - mar;
    else return null;
    if (maxW != null) hop = Math.min(hop, bb ? maxW : maxW + pad + bor);
    W = hop - pad - bor;
  }
  return W;
}

function hopVien(win, el, w, truc) {
  const cs = win.getComputedStyle(el);
  const [a, b] = truc === 'width' ? ['left', 'right'] : ['top', 'bottom'];
  const pad = pxHoac0(cs.getPropertyValue(`padding-${a}`)) + pxHoac0(cs.getPropertyValue(`padding-${b}`));
  const bor = pxHoac0(cs.getPropertyValue(`border-${a}-width`)) + pxHoac0(cs.getPropertyValue(`border-${b}-width`));
  const bb = cs.getPropertyValue('box-sizing') === 'border-box';
  const raw = chuanCss(cs.getPropertyValue(truc));
  const v = px(raw);
  if (v != null) return bb ? v : v + pad + bor;
  if (truc === 'width' && /%$/.test(raw)) {
    const cha = el.parentElement ? beRongNoiDung(win, el.parentElement, w) : w;
    if (cha == null) return null;
    const p = parseFloat(raw) / 100 * cha;
    return bb ? p : p + pad + bor;
  }
  if (truc === 'width') {
    const cha = el.parentElement ? beRongNoiDung(win, el.parentElement, w) : w;
    if (cha == null) return null;
    const ml = px(chuanCss(cs.getPropertyValue('margin-left'))) ?? 0;
    const mr = px(chuanCss(cs.getPropertyValue('margin-right'))) ?? 0;
    const hien = chuanCss(cs.getPropertyValue('display'));
    if (hien === 'block' || hien === 'flex' || hien === 'grid') {
      let hop = cha - ml - mr;
      const maxW = px(chuanCss(cs.getPropertyValue('max-width')));
      if (maxW != null) hop = Math.min(hop, bb ? maxW : maxW + pad + bor);
      return hop;
    }
  }
  return null;
}

/** tách theo khoảng trắng ở độ sâu ngoặc 0, bỏ tên đường kẻ [..] */
function tachRanh(s) {
  const ra = []; let sau = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') sau++;
    if (ch === ')') sau--;
    if (ch === ' ' && sau === 0) { if (cur) ra.push(cur); cur = ''; } else cur += ch;
  }
  if (cur) ra.push(cur);
  return ra.filter((t) => !t.startsWith('['));
}

/** bề rộng từng rãnh cột của grid `el` khi vùng nội dung của nó rộng W — ước lượng (px, %, fr,
 *  minmax(Apx, Nfr), repeat(n|auto-fit|auto-fill, …)); null nếu gặp thứ khác */
function cacRanhCot(win, el, W) {
  const cs = win.getComputedStyle(el);
  const gtc = chuanCss(cs.getPropertyValue('grid-template-columns'));
  if (!gtc || gtc === 'none') return null;
  const gap = px(chuanCss(cs.getPropertyValue('column-gap'))) ?? px(chuanCss(cs.getPropertyValue('gap')).split(' ').pop()) ?? 0;
  const ranh = [];
  for (const t of tachRanh(gtc)) {
    const m = t.match(/^repeat\((auto-fit|auto-fill|\d+), (.+)\)$/);
    if (!m) { ranh.push(t); continue; }
    if (/^\d+$/.test(m[1])) { for (let i = 0; i < +m[1]; i++) ranh.push(...tachRanh(m[2])); continue; }
    const mm = m[2].match(/^minmax\(([\d.]+)px, /) || m[2].match(/^([\d.]+)px$/);
    if (!mm) return null;
    const A = parseFloat(mm[1]);
    const n = Math.max(1, Math.floor((W + gap) / (A + gap)));
    for (let i = 0; i < n; i++) ranh.push(m[2]);
  }
  const conLai = W - gap * (ranh.length - 1);
  let coDinh = 0, tongFr = 0;
  const loai = ranh.map((t) => {
    let m = t.match(/^([\d.]+)px$/); if (m) { coDinh += +m[1]; return { px: +m[1] }; }
    m = t.match(/^([\d.]+)%$/); if (m) { const v = +m[1] / 100 * W; coDinh += v; return { px: v }; }
    m = t.match(/^([\d.]+)fr$/); if (m) { tongFr += +m[1]; return { fr: +m[1] }; }
    m = t.match(/^minmax\(([\d.]+)px, ([\d.]+)fr\)$/); if (m) { tongFr += +m[2]; return { fr: +m[2], min: +m[1] }; }
    return null;
  });
  if (loai.some((x) => !x)) return null;
  const moiFr = tongFr ? Math.max(0, conLai - coDinh) / tongFr : 0;
  return loai.map((x) => (x.px != null ? x.px : Math.max(x.min || 0, x.fr * moiFr)));
}

/** tỉ lệ bề rộng cột 1 / cột 2 của grid (từ fr hoặc px khai báo) — null nếu không tính được */
function tiLeCot(win, el) {
  const gtc = chuanCss(win.getComputedStyle(el).getPropertyValue('grid-template-columns'))
    .replace(/repeat\((\d+), ([^()]+)\)/g, (_, n, t) => Array(+n).fill(t).join(' '));
  const t = gtc.split(' ').filter((x) => !x.startsWith('['));
  if (t.length < 2) return null;
  const so = t.slice(0, 2).map((x) => { const m = x.match(/^([\d.]+)(fr|px)$/); return m ? { v: +m[1], dv: m[2] } : null; });
  if (so.some((x) => !x) || so[0].dv !== so[1].dv) return null;
  return so[0].v / so[1].v;
}

function demCot(win, el, w) {
  const gtc = chuanCss(win.getComputedStyle(el).getPropertyValue('grid-template-columns'));
  if (!gtc || gtc === 'none') return 0;
  const W = beRongNoiDung(win, el, w);
  if (W == null) return null;
  const r = cacRanhCot(win, el, W);
  return r ? r.length : null;
}

// ─── chạy MỘT kiểm ────────────────────────────────────────────────────────
function boChuThich(s, ten = '') {
  let r = s.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  // JS: bỏ chú thích // (đầu dòng hoặc sau khoảng trắng — không đụng 'https://' trong chuỗi)
  if (/\.m?js$/.test(ten)) r = r.replace(/(^|[ \t;{}(),])\/\/[^\n]*/gm, '$1');
  return r;
}

const LOAI_JS = new Set(['js', 'console', 'module']);

async function chayKiem(k, files, tj) {
  if (k.kiem === 'ma-nguon') return chayKiemDom(k, files, tj.tepHtml, null);
  if (tj.loai === 'module') return chamKiemModule(tj, k, files);
  if (LOAI_JS.has(tj.loai)) return chamKiemJs(tj, k, files);
  if (tj.chayScript) {
    const w = k.beRong || 1024;
    const khoa = `S${w}\u0000${tj.tepHtml}\u0000${JSON.stringify(files)}`;
    let trang;
    if (!k.truoc?.length && k.kiem !== 'hop-le' && boNho.has(khoa)) trang = boNho.get(khoa);
    else {
      trang = await dungTrangScript(files, tj.tepHtml, w, k.truoc);
      if (!k.truoc?.length && k.kiem !== 'hop-le') boNho.set(khoa, trang);
    }
    if (trang.hong) return { dat: false, thay: trang.hong };
    if (k.kiem === 'console') return { dat: JSON.stringify(trang.log) === JSON.stringify(k.mongDoi), thay: JSON.stringify(trang.log) };
    if (k.kiem === 'khong-tai-lai') return { dat: trang.taiLai === 0, thay: trang.taiLai ? `trang tải lại ${trang.taiLai} lần (form gửi đi thật — thiếu preventDefault?)` : 'không tải lại' };
    if (k.kiem === 'khong-loi-js') return { dat: trang.loi.length === 0, thay: trang.loi.length ? trang.loi.join(' | ') : 'không lỗi' };
    return chayKiemDom(k, files, tj.tepHtml, trang);
  }
  return chayKiemDom(k, files, tj.tepHtml, null);
}

function chayKiemDom(k, files, tepHtml, trang) {
  const w = k.beRong || 1024;
  const can = ['hop-le'].includes(k.kiem);
  const { win, doc } = trang || (k.kiem === 'ma-nguon' ? {} : dungTrang(files, tepHtml, w, can));
  const tatCa = k.tatCa !== false;
  const chon = () => (k.selector ? [...doc.querySelectorAll(k.selector)] : []);
  const moiCai = (els, f) => (els.length > 0 && (tatCa ? els.every(f) : els.some(f)));
  const soGT = (v) => (k.giaTri !== undefined ? v === k.giaTri : regex(k.khop).test(v));
  switch (k.kiem) {
    case 'doctype': return { dat: doc.doctype?.name === 'html' };
    case 'ton-tai': return { dat: chon().length > 0 };
    case 'khong-ton-tai': { const n = chon().length; return { dat: n === 0, thay: `${n} phần tử` }; }
    case 'so-luong': {
      const n = chon().length;
      const dat = k.giaTri !== undefined ? n === k.giaTri : (n >= (k.min ?? -Infinity) && n <= (k.max ?? Infinity));
      return { dat, thay: `${n}` };
    }
    case 'thuoc-tinh': {
      const els = chon();
      return {
        dat: moiCai(els, (e) => e.hasAttribute(k.thuocTinh)
          && (k.giaTri === undefined && !k.khop ? true : soGT(e.getAttribute(k.thuocTinh).trim()))),
        thay: els.map((e) => e.getAttribute(k.thuocTinh)).slice(0, 4).join(' | '),
      };
    }
    case 'text': {
      const els = chon();
      return { dat: moiCai(els, (e) => soGT(gonChu(e.textContent))), thay: els.map((e) => gonChu(e.textContent)).slice(0, 3).join(' | ') };
    }
    case 'css': {
      const els = chon();
      const vals = els.map((e) => chuanCss(docCss(win.getComputedStyle(e), k.thuocTinh)));
      const mong = k.giaTri !== undefined ? chuanCss(k.giaTri) : null;
      const f = (v) => (mong !== null ? v === mong : regex(k.khop).test(v));
      return { dat: vals.length > 0 && (tatCa ? vals.every(f) : vals.some(f)), thay: vals.slice(0, 3).join(' | ') };
    }
    case 'kich-thuoc': {
      const els = chon();
      if (!els.length) return { dat: false, thay: 'không có phần tử' };
      const vs = els.map((e) => hopVien(win, e, w, k.thuocTinh));
      if (vs.some((v) => v == null)) return { boQua: 'giá trị không phải px — cần bố cục thật' };
      return { dat: vs.every((v) => Math.abs(v - k.giaTri) <= 0.5), thay: vs.join(' | ') + ' (ước lượng)', uocLuong: true };
    }
    case 'so-cot': {
      const els = chon();
      if (!els.length) return { dat: false, thay: 'không có phần tử' };
      const n = demCot(win, els[0], w);
      if (n == null) return { boQua: 'không ước lượng được số cột — cần bố cục thật' };
      return { dat: n === k.giaTri, thay: `${n} cột (ước lượng)`, uocLuong: true };
    }
    case 'ti-le-cot': {
      const els = chon();
      if (!els.length) return { dat: false, thay: 'không có phần tử' };
      const r = tiLeCot(win, els[0]);
      if (r == null) return { boQua: 'không tính được tỉ lệ cột từ giá trị khai báo — cần bố cục thật' };
      return { dat: Math.abs(r - k.giaTri) <= 0.05, thay: `cột1/cột2 = ${+r.toFixed(3)}` };
    }
    case 'co-nhan': {
      const els = chon();
      const coNhan = (e) => (e.labels && e.labels.length > 0) || !!(e.getAttribute('aria-label') || '').trim()
        || !!(e.getAttribute('aria-labelledby') || '').trim();
      const thieu = els.filter((e) => !coNhan(e)).map((e) => e.id || e.name || e.tagName.toLowerCase());
      return { dat: els.length > 0 && thieu.length === 0, thay: thieu.length ? `thiếu nhãn: ${thieu.join(', ')}` : `${els.length} ô` };
    }
    case 'neo-hop-le': {
      const els = chon();
      const hong = els.filter((a) => { const id = decodeURIComponent((a.getAttribute('href') || '').slice(1)); return !id || !doc.getElementById(id); });
      return { dat: els.length > 0 && hong.length === 0, thay: hong.length ? `hỏng: ${hong.map((a) => a.getAttribute('href')).join(', ')}` : `${els.length} neo` };
    }
    case 'tieu-de': {
      const pham = doc.querySelector(k.selector || 'body');
      const hs = pham ? [...pham.querySelectorAll('h1,h2,h3,h4,h5,h6')] : [];
      const cap = hs.map((h) => +h.tagName[1]);
      const soH1 = cap.filter((c) => c === 1).length;
      let nhay = null;
      for (let i = 1; i < cap.length; i++) if (cap[i] > cap[i - 1] + 1) { nhay = `h${cap[i - 1]} → h${cap[i]}`; break; }
      if (cap.length && cap[0] !== 1) nhay = nhay || `mở đầu bằng h${cap[0]}`;
      return { dat: soH1 === 1 && !nhay, thay: `${soH1} h1${nhay ? `, nhảy cấp ${nhay}` : ''}` };
    }
    case 'thu-tu': {
      const els = k.cacSelector.map((s) => doc.querySelector(s));
      if (els.some((e) => !e)) return { dat: false, thay: `thiếu: ${k.cacSelector.filter((_, i) => !els[i]).join(', ')}` };
      for (let i = 1; i < els.length; i++) {
        if (!(els[i - 1].compareDocumentPosition(els[i]) & 4)) return { dat: false, thay: `${k.cacSelector[i]} đứng trước ${k.cacSelector[i - 1]}` };
      }
      return { dat: true };
    }
    case 'hop-le': {
      for (const [s, v] of Object.entries(k.dien || {})) { const e = doc.querySelector(s); if (!e) return { dat: false, thay: `không có ${s}` }; e.value = v; }
      for (const s of k.chon || []) { const e = doc.querySelector(s); if (!e) return { dat: false, thay: `không có ${s}` }; e.checked = true; }
      const el = doc.querySelector(k.selector);
      if (!el) return { dat: false, thay: `không có ${k.selector}` };
      const v = el.checkValidity();
      return { dat: v === k.giaTri, thay: `checkValidity() = ${v}` };
    }
    case 'thuoc-tinh-js': {
      const els = chon();
      const vals = els.map((e) => e[k.thuocTinh]);
      return { dat: moiCai(els, (e) => JSON.stringify(e[k.thuocTinh]) === JSON.stringify(k.giaTri)), thay: vals.slice(0, 4).map((v) => JSON.stringify(v)).join(' | ') };
    }
    case 'ma-nguon': {
      const ten = k.tep ? [k.tep] : Object.keys(files);
      const khop = ten.some((t) => regex(k.khop).test(k.giuChuThich ? (files[t] ?? '') : boChuThich(files[t] ?? '', t)));
      return { dat: k.phuDinh ? !khop : khop };
    }
    default: return { dat: false, thay: `loại kiểm lạ: ${k.kiem}` };
  }
}

const LOAI = new Set(['doctype', 'ton-tai', 'khong-ton-tai', 'so-luong', 'thuoc-tinh', 'text', 'css', 'kich-thuoc',
  'so-cot', 'ti-le-cot', 'co-nhan', 'neo-hop-le', 'tieu-de', 'thu-tu', 'hop-le', 'ma-nguon']);
const LOAI_SCRIPT = new Set(['console', 'khong-loi-js', 'thuoc-tinh-js', 'khong-tai-lai']); // chỉ khi chayScript
const CAN_SELECTOR = new Set(['ton-tai', 'khong-ton-tai', 'so-luong', 'thuoc-tinh', 'text', 'css', 'kich-thuoc', 'so-cot', 'ti-le-cot', 'co-nhan', 'neo-hop-le', 'hop-le', 'thuoc-tinh-js']);
const HANH_DONG = new Set(['click', 'nhap', 'doi', 'gui', 'phim']);

/** kiểm hình dạng một kiểm của loại js / console / module */
function kiemLuocDoJs(k, tj) {
  const loi = [];
  if (!k.moTa || k.moTa.length < 8) loi.push('thiếu moTa');
  if (k.kiem === 'ma-nguon') { if (!k.khop) loi.push('thiếu khop'); return loi; }
  if (k.kiem === 'nap-duoc') { if (tj.loai !== 'module') loi.push("'nap-duoc' chỉ cho loại module"); return loi; }
  if (k.kiem !== undefined) loi.push(`loại lạ "${k.kiem}"`);
  if (k.so && !['giaTri', 'console'].includes(k.so)) loi.push(`so lạ "${k.so}"`);
  const so = k.so || (tj.loai === 'console' ? 'console' : 'giaTri');
  if (k.mongDoi === undefined) loi.push('thiếu mongDoi');
  if (so === 'console' && !Array.isArray(k.mongDoi) && !laMongDoiLoi(k.mongDoi)) loi.push('so console cần mongDoi là mảng dòng');
  if (so === 'console' && Array.isArray(k.mongDoi) && k.mongDoi.some((x) => typeof x !== 'string')) loi.push('mongDoi console phải là mảng CHUỖI');
  if (so === 'giaTri' && !k.goi) loi.push('thiếu goi');
  for (const t of [k.goi, k.chuanBi].filter(Boolean)) {
    try { new Function(`return (async () => { ${k.chuanBi || ''}\n return (${k.goi || 'undefined'}); })`); } catch (e) { loi.push(`goi/chuanBi sai cú pháp: ${e.message}`); break; }
    void t;
  }
  return loi;
}

function kiemLuocDo(k, tj = { loai: 'dom' }) {
  if (LOAI_JS.has(tj.loai)) return kiemLuocDoJs(k, tj);
  const loi = [];
  if (!k.moTa || k.moTa.length < 8) loi.push('thiếu moTa');
  if (LOAI_SCRIPT.has(k.kiem) && !tj.chayScript) loi.push(`"${k.kiem}" cần chayScript`);
  if (k.kiem === 'console' && !Array.isArray(k.mongDoi)) loi.push('console cần mongDoi là mảng');
  if (k.kiem === 'thuoc-tinh-js' && (!k.thuocTinh || k.giaTri === undefined)) loi.push('thiếu thuocTinh/giaTri');
  if (k.truoc) {
    if (!tj.chayScript) loi.push('truoc cần chayScript');
    for (const b of k.truoc) {
      if (!HANH_DONG.has(b.hanhDong)) loi.push(`hành động lạ "${b.hanhDong}"`);
      if (!b.selector) loi.push('bước thiếu selector');
    }
  }
  if (!LOAI.has(k.kiem) && !LOAI_SCRIPT.has(k.kiem)) loi.push(`loại lạ "${k.kiem}"`);
  if (CAN_SELECTOR.has(k.kiem) && !k.selector) loi.push('thiếu selector');
  if (['thuoc-tinh', 'css', 'kich-thuoc'].includes(k.kiem) && !k.thuocTinh) loi.push('thiếu thuocTinh');
  if (['text', 'css'].includes(k.kiem) && k.giaTri === undefined && !k.khop) loi.push('thiếu giaTri/khop');
  if (['kich-thuoc', 'so-cot', 'ti-le-cot', 'hop-le'].includes(k.kiem) && k.giaTri === undefined) loi.push('thiếu giaTri');
  if (k.kiem === 'so-luong' && k.giaTri === undefined && k.min === undefined && k.max === undefined) loi.push('thiếu giaTri/min/max');
  if (k.kiem === 'ma-nguon' && !k.khop) loi.push('thiếu khop');
  if (k.kiem === 'thu-tu' && !(Array.isArray(k.cacSelector) && k.cacSelector.length >= 2)) loi.push('thiếu cacSelector');
  if (k.selector) { try { (JS ? new JS.JSDOM('').window.document : null)?.querySelector(k.selector); } catch { loi.push(`selector hỏng: ${k.selector}`); } }
  return loi;
}

// ─── kiểm trường của một đề đã xuất (khớp luật seed + luật bộ này) ─────────
const BAC = { EASY: 0, MEDIUM: 1, HARD: 2 };
function kiemTruong(ex) {
  const loi = [];
  for (const t of ['title', 'problemHtml', 'inputSpec', 'outputSpec', 'constraints', 'solutionExplanationHtml']) if (!String(ex[t] ?? '').trim()) loi.push(`thiếu ${t}`);
  if (!(ex.difficulty in BAC)) loi.push(`độ khó lạ ${ex.difficulty}`);
  if (String(ex.problemHtml).length < 300) loi.push('problemHtml < 300 ký tự (seed từ chối)');
  if (!/<h4>Yêu cầu<\/h4>\s*<ul>/.test(ex.problemHtmlVi || ex.problemHtml)) loi.push('đề thiếu mục Yêu cầu');
  if (!Array.isArray(ex.examplesJson) || !ex.examplesJson.length) loi.push('thiếu ví dụ');
  else ex.examplesJson.forEach((v, i) => { if (!v.input || !v.output || !v.explanation) loi.push(`ví dụ ${i + 1} thiếu input/output/explanation`); });
  if (!Array.isArray(ex.hintsJson) || ex.hintsJson.length < 2) loi.push('cần ≥ 2 gợi ý');
  if (!ex.starterCodeJson?.length) loi.push('thiếu code khởi đầu');
  if (!ex.solutionCodeJson?.length) loi.push('thiếu lời giải');
  const sol = (ex.solutionCodeJson || []).map((b) => b.code).join('');
  if (sol.length < 200) loi.push('lời giải < 200 ký tự (seed từ chối)');
  if (/(\/\/|#|\/\*|\*)\s*(TODO|FIXME)\b/.test(sol) || /…|rest omitted|omitted for brevity/i.test(sol)) loi.push('lời giải còn dấu "chưa xong" (seed từ chối)');
  if (!/<!--|\/\*|\/\/ /.test(sol)) loi.push('lời giải không có chú thích');
  if (!/<h4>Lỗi hay gặp<\/h4>/.test(ex.solutionExplanationHtmlVi || ex.solutionExplanationHtml)) loi.push('giải thích thiếu mục Lỗi hay gặp');
  if (!ex.estimatedMinutes) loi.push('thiếu estimatedMinutes');
  const tj = ex.testsJson;
  if (!tj || !['dom', ...LOAI_JS].includes(tj.loai) || !Array.isArray(tj.kiem) || tj.kiem.length < 3) loi.push('bộ kiểm cần ≥ 3 kiểm');
  else tj.kiem.forEach((k, i) => { const l = kiemLuocDo(k, tj); if (l.length) loi.push(`kiểm #${i + 1}: ${l.join(', ')}`); });
  if (tj && LOAI_JS.has(tj.loai) && !tj.kiem?.some((k) => k.kiem !== 'ma-nguon')) loi.push('bộ kiểm JS cần ít nhất một kiểm CHẠY code (không chỉ ma-nguon)');
  // tệp gốc phải có ở CẢ khởi đầu lẫn lời giải (khởi đầu thiếu ⇒ người học không biết viết vào đâu)
  for (const [nhan, khoi] of [['khởi đầu', ex.starterCodeJson], ['lời giải', ex.solutionCodeJson]]) {
    const ten = new Set((khoi || []).map((b) => b.name));
    const can = tj?.loai === 'dom' ? [tj.tepHtml] : (tj?.loai === 'module' ? [tj.tepChinh] : (tj?.tepNap || [tj?.tepChinh]));
    for (const t of can) if (tj && !ten.has(t)) loi.push(`không có tệp ${t} trong ${nhan}`);
  }
  return loi;
}

const tepMap = (blocks) => Object.fromEntries(blocks.map((b) => [b.name, b.code]));

// ─── chạy ─────────────────────────────────────────────────────────────────
const tepNguon = fs.readdirSync(NGUON).filter((f) => /^wf-.*\.mjs$/.test(f)).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
const modules = [];
for (const f of tepNguon) {
  const m = (await import(pathToFileURL(path.join(NGUON, f)).href)).default;
  if (CHI && m.slug !== CHI) continue;
  if (`${m.slug}.mjs` !== f) console.log(`✗ ${f}: slug "${m.slug}" không trùng tên tệp`);
  modules.push(m);
}

console.log(`── kiểm bộ đề ${TRACK}: ${modules.length} module ──`);
console.log(JS ? `jsdom: ${path.relative(GOC, JS.tu) || '.'}${process.env.JSDOM_TU === JS.tu ? ' (JSDOM_TU)' : ''}` : '⚠ KHÔNG tìm thấy jsdom — bỏ phần chạy kiểm (đặt JSDOM_TU=… để chạy)');

let soLoi = 0, tongDe = 0, tongKiem = 0, datKiem = 0, boQuaKiem = 0, uocLuong = 0;
const bang = [];
const slugDaThay = new Set(), tieuDeDaThay = new Set();

for (const m of modules) {
  const payload = {
    trackSlug: TRACK,
    moduleSlug: m.slug,
    lesson: { course: 'web-foundations', slug: m.slug },
    exercises: m.de.map((d) => xuatDe(d, { baiHoc: m.baiHoc, ngonNgu: m.ngonNgu, loaiKiem: m.loaiKiem })),
  };
  const dem = { EASY: 0, MEDIUM: 0, HARD: 0 };
  const loiModule = [];
  if (payload.exercises.length < 6 || payload.exercises.length > 8) loiModule.push(`có ${payload.exercises.length} đề (cần 6–8)`);
  let bacTruoc = 0;
  for (const ex of payload.exercises) {
    tongDe++;
    dem[ex.difficulty] = (dem[ex.difficulty] || 0) + 1;
    if (BAC[ex.difficulty] < bacTruoc) loiModule.push(`"${ex.title}" (${ex.difficulty}) đứng sau đề khó hơn`);
    bacTruoc = Math.max(bacTruoc, BAC[ex.difficulty] ?? 0);
    const t = ex.title.trim().toLowerCase();
    if (tieuDeDaThay.has(t)) loiModule.push(`trùng tiêu đề "${ex.title}"`);
    tieuDeDaThay.add(t);
    const l = kiemTruong(ex);
    const dong = [];
    if ((JS || LOAI_JS.has(ex.testsJson?.loai)) && !l.some((x) => x.startsWith('không có tệp') || x.startsWith('bộ kiểm cần'))) {
      const giai = tepMap(ex.solutionCodeJson), dau = tepMap(ex.starterCodeJson);
      let truotDau = 0;
      for (const [i, k] of ex.testsJson.kiem.entries()) {
        tongKiem++;
        let r;
        try { r = await chayKiem(k, giai, ex.testsJson); } catch (e) { r = { dat: false, thay: `lỗi: ${e.message}` }; }
        if (r.boQua) { boQuaKiem++; dong.push(`      ~ #${i + 1} BỎ QUA (${r.boQua}): ${k.moTa}`); continue; }
        if (r.uocLuong) uocLuong++;
        if (r.dat) datKiem++;
        else l.push(`lời giải TRƯỢT kiểm #${i + 1} "${k.moTa}" (thấy: ${r.thay ?? '—'})`);
        if (CHI_TIET) dong.push(`      ${r.dat ? '✓' : '✗'} #${i + 1} ${k.moTa}${r.thay ? `  [${r.thay}]` : ''}`);
        let rd;
        try { rd = await chayKiem(k, dau, ex.testsJson); } catch { rd = { dat: false }; }
        if (!rd.boQua && !rd.dat) truotDau++;
      }
      if (truotDau === 0) l.push('code khởi đầu đã ĐẠT mọi kiểm — bộ kiểm không phân biệt được');
      else if (CHI_TIET) dong.push(`      (khởi đầu trượt ${truotDau}/${ex.testsJson.kiem.length} kiểm — đúng mong đợi)`);
    }
    const slugDuKien = ex.title.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
    if (slugDaThay.has(slugDuKien)) l.push('slug sẽ trùng đề khác');
    slugDaThay.add(slugDuKien);
    if (l.length) { soLoi += l.length; console.log(`  ✗ [${m.slug}] ${ex.difficulty} "${ex.title}"`); for (const x of l) console.log(`      - ${x}`); }
    else if (CHI_TIET) console.log(`  ✓ [${m.slug}] ${ex.difficulty} "${ex.title}" — ${ex.testsJson.kiem.length} kiểm`);
    for (const d of dong) console.log(d);
  }
  for (const x of loiModule) { soLoi++; console.log(`  ✗ [${m.slug}] ${x}`); }
  bang.push({ module: m.slug, de: payload.exercises.length, ...dem, kiem: payload.exercises.reduce((s, e) => s + e.testsJson.kiem.length, 0) });

  const tepJson = path.join(THU_MUC, `${TRACK}__${m.slug}.json`);
  const moi = JSON.stringify(payload, null, 2) + '\n';
  if (XUAT) fs.writeFileSync(tepJson, moi);
  else if (!fs.existsSync(tepJson) || fs.readFileSync(tepJson, 'utf8') !== moi) {
    soLoi++; console.log(`  ✗ ${path.relative(GOC, tepJson)} lệch nguồn — chạy với --xuat`);
  }
}

// _track.json — module slug = slug bài học (codelab-create-track.mjs dùng m.slug)
if (!CHI) {
  const track = {
    groupSlug: 'cuongthai',
    slug: TRACK,
    name: 'Nền tảng Web — Luyện tập',
    language: 'html',
    color: '#e34f26',
    docsUrl: 'https://developer.mozilla.org/vi/docs/Learn',
    status: 'PUBLISHED', // chủ web duyệt công khai 14/10/2026 (đã nạp prod)
    level: 'BEGINNER',
    description: `Bộ luyện đi kèm khoá Nền tảng Web: mỗi bài học có video một bộ đề riêng, sắp từ dễ đến khó, có bộ kiểm máy chấm được. ${[['wf-2-', 'Chương 2 HTML'], ['wf-3-', 'Chương 3 CSS'], ['wf-4-', 'Chương 4 JavaScript'], ['wf-5-', 'Chương 5 JS bất đồng bộ & modules']].filter(([p]) => modules.some((m) => m.slug.startsWith(p))).map(([, t]) => t).join(' + ')}.`,
    modules: modules.map((m) => ({ slug: m.slug, name: m.ten, level: m.level || 'BEGINNER', description: m.moTa })),
  };
  const tepTrack = path.join(THU_MUC, '_track.json');
  const moi = JSON.stringify(track, null, 2) + '\n';
  if (XUAT) fs.writeFileSync(tepTrack, moi);
  else if (!fs.existsSync(tepTrack) || fs.readFileSync(tepTrack, 'utf8') !== moi) { soLoi++; console.log('  ✗ _track.json lệch nguồn — chạy với --xuat'); }
}

console.log('\n module                       đề  EASY MEDIUM HARD  kiểm');
for (const r of bang) console.log(` ${r.module.padEnd(28)} ${String(r.de).padStart(2)}  ${String(r.EASY).padStart(4)} ${String(r.MEDIUM).padStart(6)} ${String(r.HARD).padStart(4)}  ${String(r.kiem).padStart(4)}`);
const S = (k) => bang.reduce((s, r) => s + r[k], 0);
console.log(` ${'TỔNG'.padEnd(28)} ${String(tongDe).padStart(2)}  ${String(S('EASY')).padStart(4)} ${String(S('MEDIUM')).padStart(6)} ${String(S('HARD')).padStart(4)}  ${String(S('kiem')).padStart(4)}`);
if (JS) console.log(`\nChạy kiểm trên lời giải: ${datKiem}/${tongKiem - boQuaKiem} đạt · ${boQuaKiem} bỏ qua (cần bố cục thật) · ${uocLuong} là ước lượng bố cục`);
console.log(soLoi ? `\n✗ ${soLoi} lỗi` : `\n✓ sạch${XUAT ? ' — đã ghi JSON' : ''}`);
process.exit(soLoi ? 1 : 0);
