/**
 * ============================================================
 * XUẤT SƠ ĐỒ — draw.io / SVG / Mermaid / HTML ⇒ PNG / PDF
 * ============================================================
 *
 * Module THUẦN (không import `electron`): dựng trang HTML theo loại nguồn, đo
 * khung sơ đồ, chụp PNG / in PDF, rồi dựng ẢNH KIỂM cho model nhìn. Nó chỉ nói
 * chuyện với trình duyệt qua một kênh CDP (`KenhVe`), nên dùng chung cho:
 *   • app: `boVeSoDo.ts` — `BrowserWindow` ẩn + `webContents.debugger`;
 *   • lõi ngoài app (VS Code / CLI): `boVeSoDoThay.ts` — Chrome/Edge headless.
 * Cùng một đường vẽ ⇒ cùng một ảnh ở hai nơi.
 *
 * ─── VÌ SAO PHẢI TRẢ ẢNH KIỂM ───
 * "Xuất xong không lỗi" không nói được gì về tấm ảnh: chữ tràn khỏi hình, nhãn
 * mũi tên đè lên nhau, ký tự tiếng Việt thành ô vuông khi thiếu font — tất cả
 * đều cho ra một file PNG hợp lệ. Chỉ NHÌN mới thấy, nên tool luôn gửi kèm ảnh
 * của chính kết quả (với PDF: trang 1 vẽ lại TỪ FILE PDF bằng pdf.js — kiểm
 * đúng thứ sẽ được in, kể cả font đã nhúng).
 *
 * ─── VÌ SAO ĐO BẰNG getBoundingClientRect ───
 * draw.io không ghi kích thước trong XML; viewer tự tính khung sau khi vẽ (chữ
 * HTML, font thật). Đo phần tử SVG đã vẽ là cách duy nhất ra đúng khung.
 */
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// ─── Kênh tới trình duyệt ─────────────────────────────────────────

export interface KenhCdp { send(phuongThuc: string, thamSo?: Record<string, unknown>): Promise<any> }
export interface TuyChonIn { rongIn: number; caoIn: number; nen: boolean; chiTrangDau: boolean }
export interface KenhVe {
  cdp: KenhCdp;
  /** In PDF bằng API riêng của môi trường (Electron) — vắng thì dùng `Page.printToPDF`. */
  inPdf?: (o: TuyChonIn) => Promise<Buffer>;
  dong(): Promise<void>;
}
export type MoKenhVe = () => Promise<KenhVe>;

// ─── Loại nguồn ───────────────────────────────────────────────────

export type LoaiNguon = 'drawio' | 'svg' | 'mermaid' | 'html';

export const DUOI_NGUON: Readonly<Record<string, LoaiNguon>> = {
  '.drawio': 'drawio', '.dio': 'drawio', '.xml': 'drawio',
  '.svg': 'svg', '.mmd': 'mermaid', '.mermaid': 'mermaid', '.html': 'html', '.htm': 'html',
};

/** Bản CỤ THỂ của thư viện vẽ trên CDN — bản trôi nổi là ảnh đổi theo ngày. */
export const CDN = {
  drawio: 'https://viewer.diagrams.net/js/viewer-static.min.js',
  mermaid: 'https://cdn.jsdelivr.net/npm/mermaid@11.17.2/dist/mermaid.esm.min.mjs',
  pdfjs: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs',
  pdfjsWorker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs',
} as const;

/** Lề trắng quanh sơ đồ (px CSS) — sát mép quá thì nét viền ngoài cùng bị cắt nửa. */
const VIEN = 12;
/** Cạnh tối đa (điểm ảnh) Chrome chụp được trong một lần. */
const CANH_TOI_DA = 16_000;
const TRAN_BYTE_NGUON = 10 * 1024 * 1024;

export function nhanLoaiNguon(duong: string): LoaiNguon | null {
  return DUOI_NGUON[path.extname(duong).toLowerCase()] ?? null;
}

export interface TuyChonXuat {
  dinhDang: 'png' | 'pdf';
  /** Độ phân giải: 2 = gấp đôi px CSS (sắc trên màn Retina / khi in). */
  tiLe?: number;
  /** Trang draw.io: số (1 = trang đầu) hoặc TÊN trang. */
  trang?: number | string;
  /** Màu nền CSS (#fff, white…) hoặc "trong-suot". Mặc định trắng. */
  nen?: string;
}

export interface KetQuaXuat {
  byte: Buffer;
  /** Khung sơ đồ, px CSS (đã gồm lề). */
  rong: number;
  cao: number;
  /** Tỉ lệ THẬT đã dùng (có thể bị hạ cho vừa trần cạnh). */
  tiLe: number;
  /** PNG để model nhìn (PDF ⇒ trang 1 vẽ lại từ file PDF). */
  anhKiem: Buffer | null;
  anhKiemTuPdf: boolean;
  soTrangPdf?: number;
  /** Tên các trang draw.io (khi file có nhiều trang). */
  tenTrang?: string[];
  trangDaXuat?: number;
  ghiChu: string[];
  cach: 'trinh-duyet' | 'drawio-cli';
}

export class LoiXuat extends Error {}

/** `undefined` ⇒ trắng; "trong-suot"/transparent/none ⇒ `null`; còn lại phải là màu CSS đơn giản. */
export function chuanHoaNen(nen?: string): string | null {
  const t = (nen ?? '').trim();
  if (!t) return '#ffffff';
  if (/^(trong[- ]?su[oố]t|transparent|none)$/i.test(t)) return null;
  if (/^#[0-9a-f]{3,8}$/i.test(t) || /^[a-z]{3,24}$/i.test(t)) return t;
  throw new LoiXuat(`"nen" không hợp lệ: "${t}". Dùng #rrggbb, tên màu (white…) hoặc "trong-suot".`);
}

/** Tên các trang `<diagram name="…">` của file draw.io (rỗng nếu không phải mxfile). */
export function tenTrangDrawio(xml: string): string[] {
  return [...xml.matchAll(/<diagram\b[^>]*?\bname="([^"]*)"/g)].map((m) => giaiThucThe(m[1] ?? ''));
}

function giaiThucThe(s: string): string {
  return s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

/** Chọn trang draw.io ⇒ chỉ số 0-based. Sai thì ném lỗi KỂ TÊN các trang có. */
export function chonTrang(ten: string[], trang?: number | string): number {
  if (trang === undefined || trang === null || trang === '') return 0;
  const so = typeof trang === 'number' ? trang : /^\d+$/.test(String(trang).trim()) ? Number(trang) : NaN;
  const ds = ten.length ? ten.map((t, i) => `${i + 1}. ${t || '(không tên)'}`).join(', ') : '1 trang';
  if (Number.isFinite(so)) {
    const tong = Math.max(1, ten.length);
    if (so < 1 || so > tong) throw new LoiXuat(`Không có trang ${so}. File có: ${ds}.`);
    return so - 1;
  }
  const i = ten.findIndex((t) => t.trim().toLowerCase() === String(trang).trim().toLowerCase());
  if (i < 0) throw new LoiXuat(`Không có trang tên "${trang}". File có: ${ds}.`);
  return i;
}

/**
 * Gắn `width`/`height` THẬT vào thẻ `<svg>` gốc. SVG chỉ có `viewBox` (hay
 * `width="100%"`) khi vẽ trong `<img>` sẽ ra 300×150 — kích thước mặc định của
 * phần tử thay thế — và sơ đồ bị co bé tí.
 */
export function chuanHoaSvg(svg: string): { svg: string; rong: number; cao: number } {
  const m = /<svg\b[^>]*>/i.exec(svg);
  if (!m) throw new LoiXuat('File không có thẻ <svg>.');
  const the = m[0];
  const thuocTinh = (ten: string): string | null => new RegExp(`\\s${ten}\\s*=\\s*["']([^"']*)["']`, 'i').exec(the)?.[1] ?? null;
  const soPx = (v: string | null): number | null => {
    if (!v) return null;
    const k = /^\s*([\d.]+)\s*(px)?\s*$/i.exec(v);
    return k ? Number(k[1]) : null;
  };
  const vb = (thuocTinh('viewBox') ?? '').trim().split(/[\s,]+/).map(Number);
  const vbR = vb.length === 4 && vb[2]! > 0 ? vb[2]! : null;
  const vbC = vb.length === 4 && vb[3]! > 0 ? vb[3]! : null;
  let rong = soPx(thuocTinh('width'));
  let cao = soPx(thuocTinh('height'));
  if (!rong && !cao) { rong = vbR; cao = vbC; } else if (!rong && cao && vbR && vbC) rong = (cao * vbR) / vbC;
  else if (rong && !cao && vbR && vbC) cao = (rong * vbC) / vbR;
  if (!rong || !cao) throw new LoiXuat('SVG không có width/height lẫn viewBox — không biết vẽ cỡ nào.');
  let moi = the.replace(/\s(width|height)\s*=\s*["'][^"']*["']/gi, '');
  moi = moi.replace(/<svg\b/i, `<svg width="${rong}" height="${cao}"`);
  return { svg: svg.replace(the, moi), rong, cao };
}

/** JSON an toàn để nhúng trong `<script>` (không để `</script>` trong dữ liệu cắt đứt thẻ). */
function jsonNhung(v: unknown): string {
  return JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

/** Khung trang chung: body không lề, sơ đồ trong `#khung` inline-block có lề `VIEN`. */
function trangKhung(nen: string | null, than: string, kichBan: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;padding:0;background:${nen ?? 'transparent'};}
#khung{display:inline-block;padding:${VIEN}px;line-height:0;}
@page{margin:0;}
</style></head><body><div id="khung">${than}</div>
<script>window.__soDo=null;function __loi(ma,ct){if(!window.__soDo)window.__soDo={loi:ma,chiTiet:String(ct||'')};}
function __do(them){var k=document.getElementById('khung').getBoundingClientRect();
window.__soDo=Object.assign({xong:true,x:k.x,y:k.y,rong:k.width,cao:k.height},them||{});}
function __hai(){return new Promise(function(r){requestAnimationFrame(function(){requestAnimationFrame(r);});});}</script>
${kichBan}</body></html>`;
}

/** Trang HTML vẽ một nguồn draw.io / SVG / Mermaid. (HTML thì nạp thẳng file, không qua đây.) */
export function dungTrang(loai: Exclude<LoaiNguon, 'html'>, noiDung: string, nen: string | null, trang = 0): string {
  if (loai === 'drawio') {
    const cauHinh = {
      xml: noiDung, page: trang, toolbar: '', nav: false, lightbox: false,
      resize: false, 'auto-fit': false, border: 0, highlight: 'none', zoom: 1,
      /* Viewer CHỜ khung có bề rộng mới vẽ (MutationObserver) — khung co-theo-
         nội-dung của ta rộng 0 cho tới khi có hình, nên không tắt là chờ mãi. */
      'check-visible-state': false,
    };
    /* Viewer chừa sẵn 26px phía trên cho thanh công cụ (margin-top) và cắt
       tràn của khung — ảnh ra thừa một dải trắng trên đầu, nét mép phải hụt
       1px (đo được: svg 644px trong khung 643px). Gỡ cả hai. */
    return trangKhung(nen, '<style>#dich{margin:0 !important;overflow:visible !important}</style><div id="dich"></div>', `<script>
function __ve(){try{
  if(typeof GraphViewer==='undefined')return __loi('nap-viewer');
  var el=document.getElementById('dich');
  el.setAttribute('data-mxgraph',JSON.stringify(${jsonNhung(cauHinh)}));
  GraphViewer.createViewerForElement(el,function(v){
    document.fonts.ready.then(__hai).then(function(){
      var s=el.querySelector('svg');if(!s)return __loi('khong-ve','viewer không tạo ra SVG');
      __do({soTrang:(v&&v.diagrams&&v.diagrams.length)||1});
    });
  });
}catch(e){__loi('ve-hong',e&&e.message);}}
setTimeout(function(){__loi('qua-han','viewer không vẽ xong sau 25 giây');},25000);
</script><script src="${CDN.drawio}" onload="__ve()" onerror="__loi('nap-viewer')"></script>`);
  }
  if (loai === 'svg') {
    const { svg } = chuanHoaSvg(noiDung);
    /* Vẽ qua <img>, KHÔNG chèn thẳng vào DOM: SVG là file của người khác, có
       thể mang `onload=`/`<script>` — trong <img> không gì trong nó được chạy. */
    const src = `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
    return trangKhung(nen, `<img id="dich" alt="" src="${src}">`, `<script>
(function(){var i=document.getElementById('dich');
i.decode().then(__hai).then(function(){__do({});}).catch(function(e){__loi('svg-hong',(e&&e.message)||'trình duyệt không vẽ được SVG này');});})();
</script>`);
  }
  return trangKhung(nen, '<div id="dich"></div>', `<script type="module">
let m;
try { m = (await import(${jsonNhung(CDN.mermaid)})).default; } catch (e) { __loi('nap-mermaid', e && e.message); }
if (m) {
  try {
    m.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'default' });
    const { svg } = await m.render('so-do-mermaid', ${jsonNhung(noiDung)});
    const dich = document.getElementById('dich');
    dich.innerHTML = svg;
    const s = dich.querySelector('svg');
    /* Mermaid ra width="100%" + max-width: trong khung co-theo-nội-dung thì
       "100%" của cái không có bề rộng là 0. Gắn cỡ thật từ viewBox. */
    const vb = s && s.viewBox && s.viewBox.baseVal;
    if (vb && vb.width) { s.setAttribute('width', vb.width); s.setAttribute('height', vb.height); s.style.maxWidth = 'none'; }
    await document.fonts.ready; await __hai();
    __do({});
  } catch (e) { __loi('cu-phap', (e && (e.message || e.str)) || String(e)); }
}
</script>`);
}

// ─── Nói chuyện với trang ─────────────────────────────────────────

async function danhGia(cdp: KenhCdp, bieuThuc: string): Promise<any> {
  const r = await cdp.send('Runtime.evaluate', { expression: bieuThuc, returnByValue: true, awaitPromise: true });
  if (r?.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r?.result?.value;
}

const ngu = (ms: number): Promise<void> => new Promise((x) => { setTimeout(x, ms); });

interface SoDo { xong?: boolean; loi?: string; chiTiet?: string; x: number; y: number; rong: number; cao: number; soTrang?: number }

/** Chờ trang báo `window.__soDo` (vẽ xong hoặc hỏng). Đánh giá lỗi giữa lúc trang đang thay = chưa xong. */
async function choVe(cdp: KenhCdp, hanMs: number): Promise<SoDo> {
  const het = Date.now() + hanMs;
  while (Date.now() < het) {
    const v = await danhGia(cdp, 'window.__soDo || null').catch(() => null) as SoDo | null;
    if (v) return v;
    await ngu(150);
  }
  throw new LoiXuat(`Trang vẽ không xong sau ${Math.round(hanMs / 1000)} giây.`);
}

async function napNoiDung(cdp: KenhCdp, html: string): Promise<void> {
  const cay = await cdp.send('Page.getFrameTree');
  await cdp.send('Page.setDocumentContent', { frameId: cay.frameTree.frame.id, html });
}

/** Mở một FILE .html và chờ nó yên (tải xong + font + vài khung hình cho JS vẽ). */
async function napFileHtml(cdp: KenhCdp, duong: string, hanMs: number): Promise<SoDo> {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await cdp.send('Page.navigate', { url: pathToFileURL(duong).toString() });
  const het = Date.now() + hanMs;
  while (Date.now() < het) {
    const xong = await danhGia(cdp, 'document.readyState === "complete" && location.protocol === "file:"').catch(() => false);
    if (xong) break;
    await ngu(150);
  }
  await danhGia(cdp, 'document.fonts.ready.then(() => new Promise(r => setTimeout(r, 400)))').catch(() => undefined);
  /* Cắt theo NỘI DUNG, không theo khung nhìn: scrollHeight không bao giờ nhỏ
     hơn cửa sổ 1280×800, nên một tấm thẻ 600×200 ra ảnh toàn khoảng trắng.
     Lấy mép phải/dưới xa nhất của các khối con của body (cộng margin), giữ
     gốc (0,0) để lề trái/trên của chính trang vẫn còn. */
  const co = await danhGia(cdp, `(() => { const d = document.documentElement, b = document.body || d;
    let r = 0, c = 0;
    for (const e of b.querySelectorAll('body > *:not(script):not(style):not(link):not(meta)')) {
      const k = e.getBoundingClientRect(); if (!k.width && !k.height) continue;
      const st = getComputedStyle(e);
      r = Math.max(r, k.right + (parseFloat(st.marginRight) || 0) + scrollX);
      c = Math.max(c, k.bottom + (parseFloat(st.marginBottom) || 0) + scrollY);
    }
    const toanR = Math.max(d.scrollWidth, b.scrollWidth), toanC = Math.max(d.scrollHeight, b.scrollHeight);
    return { rong: Math.ceil(Math.min(toanR, r || toanR)), cao: Math.ceil(Math.min(toanC, c || toanC)) }; })()`) as { rong: number; cao: number };
  return { xong: true, x: 0, y: 0, rong: co.rong, cao: co.cao };
}

/** Khung chụp, làm tròn RA NGOÀI (làm tròn vào trong là mất nửa nét viền ngoài cùng). */
function lamTronKhung(s: SoDo): { x: number; y: number; rong: number; cao: number } {
  const x = Math.max(0, Math.floor(s.x));
  const y = Math.max(0, Math.floor(s.y));
  return { x, y, rong: Math.ceil(s.x + s.rong) - x, cao: Math.ceil(s.y + s.cao) - y };
}

async function chup(cdp: KenhCdp, k: { x: number; y: number; rong: number; cao: number }, tiLe: number, trongSuot: boolean): Promise<Buffer> {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: Math.max(400, k.x + k.rong), height: Math.max(300, k.y + k.cao), deviceScaleFactor: tiLe, mobile: false,
  });
  if (trongSuot) await cdp.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
  await danhGia(cdp, 'new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))').catch(() => undefined);
  const kq = await cdp.send('Page.captureScreenshot', {
    format: 'png', clip: { x: k.x, y: k.y, width: k.rong, height: k.cao, scale: 1 }, captureBeyondViewport: true, fromSurface: true,
  });
  return Buffer.from(kq.data as string, 'base64');
}

async function inPdf(kenh: KenhVe, k: { rong: number; cao: number }, nen: boolean, chiTrangDau: boolean): Promise<Buffer> {
  await kenh.cdp.send('Emulation.clearDeviceMetricsOverride').catch(() => undefined);
  // +1px: làm tròn khổ giấy xuống một chút là nét cuối tràn sang trang 2 trắng.
  const o: TuyChonIn = { rongIn: (k.rong + 1) / 96, caoIn: (k.cao + 1) / 96, nen, chiTrangDau };
  if (kenh.inPdf) return await kenh.inPdf(o);
  const kq = await kenh.cdp.send('Page.printToPDF', {
    printBackground: nen, paperWidth: o.rongIn, paperHeight: o.caoIn,
    marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0, preferCSSPageSize: false,
    ...(chiTrangDau ? { pageRanges: '1' } : {}),
  });
  return Buffer.from(kq.data as string, 'base64');
}

/** Đếm trang PDF thô (đủ để báo "PDF 3 trang" — không cần trình đọc PDF). */
export function demTrangPdf(b: Buffer): number {
  return (b.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
}

/**
 * Vẽ lại TRANG 1 của một PDF thành PNG bằng pdf.js — để kiểm đúng thứ đã in
 * (font nhúng, khổ giấy, trang trắng), không phải trang HTML trước khi in.
 */
export async function veTrangPdf(moKenh: MoKenhVe, pdf: Buffer, tiLe: number): Promise<Buffer> {
  const kenh = await moKenh();
  try {
    return await veTrangPdfTrenKenh(kenh.cdp, pdf, tiLe);
  } finally {
    await kenh.dong().catch(() => undefined);
  }
}

/**
 * Như trên nhưng trên kênh ĐANG MỞ (cùng cửa sổ vừa vẽ sơ đồ). Điều hướng về
 * about:blank trước: tài liệu mới = `window` mới, không sót `__soDo` của lần
 * vẽ trước. Một cửa sổ cho cả lượt xuất thay vì hai — app tạo cửa sổ ẩn không rẻ.
 */
async function veTrangPdfTrenKenh(cdp: KenhCdp, pdf: Buffer, tiLe: number): Promise<Buffer> {
  await cdp.send('Emulation.clearDeviceMetricsOverride').catch(() => undefined);
  await cdp.send('Emulation.setDefaultBackgroundColorOverride', {}).catch(() => undefined);
  await cdp.send('Page.navigate', { url: 'about:blank' });
  for (let i = 0; i < 40; i += 1) {
    if (await danhGia(cdp, 'location.href === "about:blank" && !window.__soDo && document.readyState === "complete"').catch(() => false)) break;
    await ngu(50);
  }
  {
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff}canvas{display:block}</style></head>
<body><canvas id="c"></canvas><script type="module">
window.__soDo = null;
try {
  const pdfjs = await import(${jsonNhung(CDN.pdfjs)});
  pdfjs.GlobalWorkerOptions.workerSrc = ${jsonNhung(CDN.pdfjsWorker)};
  const b = Uint8Array.from(atob(${jsonNhung(pdf.toString('base64'))}), (c) => c.charCodeAt(0));
  const doc = await pdfjs.getDocument({ data: b, isEvalSupported: false }).promise;
  const p = await doc.getPage(1);
  const vp = p.getViewport({ scale: ${tiLe} * 96 / 72 });
  const c = document.getElementById('c');
  c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
  await p.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
  const r = c.getBoundingClientRect();
  window.__soDo = { xong: true, x: r.x, y: r.y, rong: r.width, cao: r.height, soTrang: doc.numPages };
} catch (e) { window.__soDo = { loi: 'pdfjs', chiTiet: String((e && e.message) || e) }; }
</script></body></html>`;
    await napNoiDung(cdp, html);
    const s = await choVe(cdp, 30_000);
    if (s.loi) throw new LoiXuat(`pdf.js không vẽ được trang 1 (${s.loi}: ${s.chiTiet ?? ''})`);
    return await chup(cdp, lamTronKhung(s), 1, false);
  }
}

// ─── draw.io desktop (đường lùi khi không nạp được viewer) ────────

/** CLI của draw.io desktop nếu máy có cài — dùng khi mất mạng (viewer nằm trên CDN). */
export function timDrawioCli(): string | null {
  const ep = process.env.CUONGMINI_DRAWIO?.trim();
  if (ep) return existsSync(ep) ? ep : null;
  const ds: string[] = [];
  if (process.platform === 'darwin') {
    ds.push('/Applications/draw.io.app/Contents/MacOS/draw.io', path.join(os.homedir(), 'Applications/draw.io.app/Contents/MacOS/draw.io'));
  } else if (process.platform === 'win32') {
    for (const g of [process.env.PROGRAMFILES, process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs')]) {
      if (g) ds.push(path.win32.join(g, 'draw.io', 'draw.io.exe'));
    }
  } else {
    for (const d of (process.env.PATH ?? '').split(path.delimiter).filter(Boolean)) ds.push(path.join(d, 'drawio'));
    ds.push('/opt/drawio/drawio', '/snap/bin/drawio', '/usr/bin/drawio');
  }
  return ds.find((p) => existsSync(p)) ?? null;
}

async function xuatBangDrawioCli(cli: string, nguon: string, o: { dinhDang: 'png' | 'pdf'; tiLe: number; trang: number; trongSuot: boolean }): Promise<Buffer> {
  const tam = await fs.mkdtemp(path.join(os.tmpdir(), 'xuat-so-do-'));
  const ra = path.join(tam, `ra.${o.dinhDang}`);
  try {
    const thamSo = [
      '-x', '-f', o.dinhDang, '-s', String(o.tiLe), '-b', String(VIEN), '-p', String(o.trang + 1),
      ...(o.trongSuot && o.dinhDang === 'png' ? ['-t'] : []), ...(o.dinhDang === 'pdf' ? ['--crop'] : []),
      '-o', ra, nguon,
    ];
    await new Promise<void>((xong, hong) => {
      execFile(cli, thamSo, { timeout: 90_000, windowsHide: true }, (e, _o, err) => (e ? hong(new Error(String(err || e.message).trim().split('\n')[0])) : xong()));
    });
    return await fs.readFile(ra);
  } finally {
    await fs.rm(tam, { recursive: true, force: true }).catch(() => undefined);
  }
}

// ─── Cửa vào ──────────────────────────────────────────────────────

const LOI_MANG: Record<string, string> = {
  'nap-viewer': `không nạp được draw.io viewer (${CDN.drawio}) — máy đang mất mạng hoặc tường lửa chặn`,
  'nap-mermaid': 'không nạp được thư viện Mermaid từ cdn.jsdelivr.net — máy đang mất mạng hoặc tường lửa chặn',
};

/**
 * Xuất một file sơ đồ. KHÔNG ghi file đích — trả byte để tool tự hỏi quyền rồi
 * ghi (cùng cửa quyền với `create_file`).
 */
export async function xuatSoDo(moKenh: MoKenhVe, duongNguon: string, tc: TuyChonXuat): Promise<KetQuaXuat> {
  const loai = nhanLoaiNguon(duongNguon);
  if (!loai) throw new LoiXuat(`Không nhận "${path.extname(duongNguon) || duongNguon}". Nhận: ${Object.keys(DUOI_NGUON).join(' ')}`);
  const st = await fs.stat(duongNguon);
  if (st.size > TRAN_BYTE_NGUON) throw new LoiXuat(`File nguồn ${(st.size / 1048576).toFixed(1)}MB — quá trần ${TRAN_BYTE_NGUON / 1048576}MB.`);
  const nen = chuanHoaNen(tc.nen);
  let tiLe = Math.min(4, Math.max(0.5, Number.isFinite(Number(tc.tiLe)) && Number(tc.tiLe) > 0 ? Number(tc.tiLe) : 2));
  const ghiChu: string[] = [];

  let noiDung = '';
  let tenTrang: string[] | undefined;
  let trang = 0;
  if (loai !== 'html') {
    noiDung = await fs.readFile(duongNguon, 'utf8');
    if (!noiDung.trim()) throw new LoiXuat('File nguồn rỗng.');
  }
  if (loai === 'drawio') {
    if (!/<mxfile\b|<mxGraphModel\b/.test(noiDung)) throw new LoiXuat('File không phải sơ đồ draw.io (thiếu <mxfile> / <mxGraphModel>).');
    tenTrang = tenTrangDrawio(noiDung);
    trang = chonTrang(tenTrang, tc.trang);
  } else if (tc.trang !== undefined && tc.trang !== '') {
    ghiChu.push('"trang" chỉ dùng cho draw.io — đã bỏ qua.');
  }

  const kenh = await moKenh();
  let s: SoDo;
  let png: Buffer | null = null;
  let tuPdf = false;
  let byte: Buffer;
  let k: { x: number; y: number; rong: number; cao: number };
  try {
    if (loai === 'html') {
      s = await napFileHtml(kenh.cdp, duongNguon, 30_000);
      if (nen === null) ghiChu.push('Nền trong suốt với HTML chỉ có tác dụng khi chính trang không tô nền.');
    } else {
      await napNoiDung(kenh.cdp, dungTrang(loai, noiDung, nen, trang));
      s = await choVe(kenh.cdp, 40_000);
    }
    if (s.loi) {
      const cli = s.loi === 'nap-viewer' ? timDrawioCli() : null;
      if (cli) {
        ghiChu.push(`${LOI_MANG['nap-viewer']} — đã xuất bằng draw.io desktop (${cli}).`);
        const b = await xuatBangDrawioCli(cli, duongNguon, { dinhDang: tc.dinhDang, tiLe, trang, trongSuot: nen === null });
        let anhKiem: Buffer | null = tc.dinhDang === 'png' ? b : null;
        let tuPdf = false;
        if (tc.dinhDang === 'pdf') {
          try { anhKiem = await veTrangPdf(moKenh, b, Math.min(tiLe, 2)); tuPdf = true; } catch (e) {
            ghiChu.push(`Không dựng được ảnh kiểm của PDF: ${(e as Error).message}`);
          }
        }
        return {
          byte: b, rong: 0, cao: 0, tiLe, anhKiem, anhKiemTuPdf: tuPdf, cach: 'drawio-cli', ghiChu,
          ...(tc.dinhDang === 'pdf' ? { soTrangPdf: demTrangPdf(b) } : {}),
          ...(tenTrang?.length ? { tenTrang, trangDaXuat: trang + 1 } : {}),
        };
      }
      if (s.loi in LOI_MANG) {
        throw new LoiXuat(`${LOI_MANG[s.loi]}.${loai === 'drawio' ? ' Cài draw.io desktop (https://www.drawio.com) thì xuất được cả khi không có mạng.' : ''}`);
      }
      if (s.loi === 'cu-phap') throw new LoiXuat(`Mermaid báo lỗi cú pháp: ${s.chiTiet}`);
      throw new LoiXuat(`Không vẽ được (${s.loi}${s.chiTiet ? `: ${s.chiTiet}` : ''}).`);
    }
    k = lamTronKhung(s);
    if (k.rong < 2 || k.cao < 2) throw new LoiXuat('Sơ đồ vẽ ra rỗng (khung 0×0) — file có hình nào không?');
    const canh = Math.max(k.rong, k.cao);
    if (canh * tiLe > CANH_TOI_DA) {
      const cu = tiLe;
      tiLe = Math.max(0.25, Math.floor((CANH_TOI_DA / canh) * 100) / 100);
      ghiChu.push(`Sơ đồ to (${k.rong}×${k.cao}px) — hạ tỉ lệ ${cu} → ${tiLe} cho vừa trần ${CANH_TOI_DA}px.`);
    }
    if (tc.dinhDang === 'png') {
      byte = await chup(kenh.cdp, k, tiLe, nen === null);
    } else {
      // Ảnh dự phòng trước khi in: pdf.js mà không nạp được thì vẫn có thứ để nhìn.
      png = await chup(kenh.cdp, k, Math.min(tiLe, 2), false).catch(() => null);
      byte = await inPdf(kenh, k, nen !== null, loai !== 'html');
      try {
        png = await veTrangPdfTrenKenh(kenh.cdp, byte, Math.min(tiLe, 2));
        tuPdf = true;
      } catch (e) {
        ghiChu.push(`Ảnh kiểm là bản chụp trang trước khi in, KHÔNG phải vẽ lại từ PDF (${(e as Error).message}).`);
      }
    }
  } finally {
    await kenh.dong().catch(() => undefined);
  }

  const anhKiem: Buffer | null = tc.dinhDang === 'png' ? byte : png;
  return {
    byte, rong: k.rong, cao: k.cao, tiLe, anhKiem, anhKiemTuPdf: tuPdf, cach: 'trinh-duyet', ghiChu,
    ...(tc.dinhDang === 'pdf' ? { soTrangPdf: demTrangPdf(byte) } : {}),
    ...(tenTrang?.length ? { tenTrang, trangDaXuat: trang + 1 } : {}),
  };
}
