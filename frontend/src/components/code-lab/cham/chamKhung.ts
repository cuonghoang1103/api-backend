/**
 * Máy chấm KHUNG (iframe sandbox) — loại 'dom' (HTML/CSS[/JS]) và 'react' (đợt Academy 28/10/2026).
 *
 * Dựng trang của người học trong một iframe `sandbox="allow-scripts allow-forms"` (gốc MỜ: không chạm
 * được cookie/localStorage/DOM của cuongthai.com), chèn tác tử chấm (domAgent.ts) TRƯỚC mọi script
 * của trang, nhận kết quả qua postMessage. Mỗi kiểm có `truoc` (bấm/nhập/gửi…) hoặc 'hop-le' dựng
 * khung RIÊNG (trang mới tinh như máy chấm Node); kiểm tĩnh dùng chung một khung theo bề rộng.
 *
 * Cách dựng trang (khớp `ghepTep` / `ghepTepScript` của scripts/codelab-kiem-de-web.mjs):
 *   - <link rel=stylesheet href="X"> mà X là tệp trong bài ⇒ giữ thẻ link + chèn <style> ngay sau;
 *   - KHÔNG chạy <script> (đổi type) trừ khi `chayScript` — khi đó script cổ điển có src là tệp trong
 *     bài được chèn nội tuyến đúng chỗ (defer/async/module giữ nguyên ⇒ không chạy, như Node);
 *   - khung rộng `beRong` (mặc định 1024) × cao 768.
 * React: trang tự dựng — React 18 UMD + (tuỳ đề) prop-types/react-router-dom/react-bootstrap/bootstrap
 * CSS từ cdn.jsdelivr.net (CSP của web đã cho), JSX/TS biên dịch bằng sucrase (+esm) NGAY TRONG khung.
 *
 * CSP: srcdoc THỪA KẾ CSP của trang. Web: script-src có 'unsafe-inline' 'unsafe-eval' cdn.jsdelivr.net
 * ⇒ chạy được. App desktop cấm script nội tuyến ⇒ dùng trang HỘP CÁT `__CT_HOP_CAT_KHUNG__` (CSP riêng —
 * desktop/src/main/security.ts) rồi gửi HTML vào bằng postMessage.
 */
import { AGENT_SRC } from './domAgent';
import { kiemMaNguon } from './chamJs';
import type { Kiem, KetQuaKiem, TepMap, TestsJson } from './kieu';

const CDN = 'https://cdn.jsdelivr.net/npm/';
// Bản production (~140 KB) chứ không phải development (~1,2 MB): mỗi kiểm có `truoc` dựng MỘT khung mới,
// và khung gốc mờ không dùng chung bộ đệm HTTP với trang ⇒ bản dev làm bài 30 kiểm tải 36 MB.
export const THU_VIEN_CDN: Record<string, string[]> = {
  react: ['react@18.3.1/umd/react.production.min.js', 'react-dom@18.3.1/umd/react-dom.production.min.js'],
  'prop-types': ['prop-types@15.8.1/prop-types.min.js'],
  'react-router-dom': [
    '@remix-run/router@1.19.2/dist/router.umd.min.js',
    'react-router@6.26.2/dist/umd/react-router.production.min.js',
    'react-router-dom@6.26.2/dist/umd/react-router-dom.production.min.js',
  ],
  'react-bootstrap': ['react-bootstrap@2.10.5/dist/react-bootstrap.min.js'],
  // Redux (29/10/2026 — FER202 Ch12): RTK 1.9.7 + react-redux 8.1.3 là hai bản CUỐI còn bản UMD (2.x/9.x bỏ UMD).
  // 'redux' trỏ cùng RTK (RTK xuất lại createStore/combineReducers/applyMiddleware…); redux-thunk tác tử tự có.
  '@reduxjs/toolkit': ['@reduxjs/toolkit@1.9.7/dist/redux-toolkit.umd.min.js'],
  'react-redux': ['react-redux@8.1.3/dist/react-redux.min.js'],
};
/** CSS của gói: CSP style-src của web KHÔNG cho jsdelivr ⇒ tải bằng fetch (connect-src cho) rồi nhét <style>. */
export const CSS_CDN: Record<string, string> = {
  bootstrap: 'bootstrap@5.3.3/dist/css/bootstrap.min.css',
};

/**
 * Biên dịch JSX/TS → CommonJS NGAY Ở TRANG MẸ bằng sucrase (gói npm, nạp lười — chỉ khi chấm React).
 * Không nạp trình biên dịch trong khung: bản `+esm` của sucrase trên jsdelivr hỏng (đo 28/10/2026:
 * "@jridgewell/sourcemap-codec does not provide an export named 'encode'"), và app desktop cấm nạp
 * thêm thứ gì. Khung chỉ còn chạy mã đã biên dịch.
 */
export async function bienDichReact(files: TepMap): Promise<{ maDich: Record<string, string> } | { loi: string }> {
  const { transform } = await import('sucrase');
  const maDich: Record<string, string> = {};
  for (const [ten, code] of Object.entries(files)) {
    if (!/\.(m?jsx?|tsx?)$/.test(ten)) continue;
    try {
      // Vite: import.meta.env.VITE_* — mã chạy như script thường (không phải module) ⇒ đổi sang biến của tác tử
      maDich[ten] = transform(code.replace(/\bimport\.meta\.env\b/g, 'window.__CL_ENV__'), {
        transforms: /\.tsx?$/.test(ten) ? ['typescript', 'jsx', 'imports'] : ['jsx', 'imports'],
        jsxRuntime: 'automatic', production: true, filePath: ten,
      }).code;
    } catch (e) {
      return { loi: `Lỗi cú pháp ở ${ten}: ${e instanceof Error ? e.message : String(e)}` };
    }
  }
  return { maDich };
}

const escScript = (s: string) => s.replace(/<\/script/gi, '<\\/script');
/** JSON nhúng an toàn trong <script> (không để `</script>` hay `<!--` trong chuỗi phá thẻ). */
const jsonNhung = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c').replace(new RegExp('\\u2028', 'g'), '\\u2028').replace(new RegExp('\\u2029', 'g'), '\\u2029');

function chenSauDoctype(html: string, chen: string): string {
  const m = /^\s*<!doctype[^>]*>/i.exec(html);
  return m ? html.slice(0, m[0].length) + chen + html.slice(m[0].length) : chen + html;
}

function ghepCss(html: string, files: TepMap): string {
  return html.replace(/<link\b[^>]*>/gi, (tag) => {
    if (!/rel\s*=\s*["']?stylesheet/i.test(tag)) return tag;
    const m = tag.match(/href\s*=\s*["']([^"']+)["']/i);
    if (!m || files[m[1]] == null) return tag;
    return `${tag}<style data-tu="${m[1]}">\n${files[m[1]].replace(/<\/style/gi, '<\\/style')}\n</style>`;
  });
}

function ghepScript(html: string, files: TepMap): string {
  // `defer`/`async` có src là tệp trong bài ⇒ chạy SAU khi parse xong (Node/jsdom nạp chúng qua bộ chặn
  // request). srcdoc không có "tệp" để nạp ⇒ dời thành script nội tuyến ở CUỐI tài liệu, giữ thứ tự.
  const doiCuoi: string[] = [];
  const ra = html.replace(/<script\b([^>]*)>\s*<\/script>/gi, (tag, attrs: string) => {
    const m = attrs.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
    if (!m || files[m[1]] == null) return tag;
    if (/type\s*=\s*["']?module/i.test(attrs)) return tag; // module: Node không chạy ⇒ cũng không chạy
    if (/\b(defer|async)\b/i.test(attrs)) {
      // giữ thẻ gốc ĐÚNG CHỖ (kiểm `script[src][defer]` trong head vẫn thấy) nhưng trơ (type lạ ⇒ không tải
      // src); bản chạy thật nằm cuối tài liệu và tự gỡ khi chạy (đếm thẻ script không lệch)
      doiCuoi.push(`<script data-tu="${m[1]}">try{document.currentScript.remove()}catch(e){}\n${escScript(files[m[1]])}\n</script>`);
      return `<script type="text/x-cl-doi-cuoi"${attrs}></script>`;
    }
    const conLai = attrs.replace(/\bsrc\s*=\s*["'][^"']+["']/i, ` data-tu="${m[1]}"`);
    return `<script${conLai}>\n${escScript(files[m[1]])}\n</script>`;
  });
  if (!doiCuoi.length) return ra;
  const i = ra.search(/<\/body\s*>/i);
  return i >= 0 ? ra.slice(0, i) + doiCuoi.join('\n') + ra.slice(i) : ra + doiCuoi.join('\n');
}

/** Ch2–Ch3: không chạy script — đổi type (thuộc tính TRÙNG thì cái ĐẦU thắng khi parse). */
const tatScript = (html: string) => html.replace(/<script\b/gi, '<script type="text/x-cl-tat"');

function theCfgAgent(cfg: Record<string, unknown>): string {
  return `<script>window.__CL_CFG__=${jsonNhung(cfg)};try{document.currentScript.remove()}catch(e){}</script><script>${AGENT_SRC}</script>`;
}

export function dungTrangDom(tj: TestsJson, files: TepMap, cfg: Record<string, unknown>): string {
  const tepHtml = String(tj.tepHtml || 'index.html');
  const goc = files[tepHtml];
  if (goc == null) throw new Error(`thiếu tệp ${tepHtml}`);
  let html = ghepCss(goc, files);
  html = tj.chayScript ? ghepScript(html, files) : tatScript(html);
  return chenSauDoctype(html, theCfgAgent(cfg));
}

// ─── thư viện: trang mẹ tải MỘT lần (bộ đệm của trang), nhúng nội tuyến vào mọi khung ─────────────
const boNhoThuVien = new Map<string, Promise<string | null>>();
function taiVanBan(url: string): Promise<string | null> {
  let p = boNhoThuVien.get(url);
  if (!p) {
    p = fetch(url).then((r) => (r.ok ? r.text() : null)).catch(() => null);
    boNhoThuVien.set(url, p);
  }
  return p;
}
/** Nguồn thư viện cho một đề React: { url, text } — `text` null (app desktop: connect-src không cho) ⇒ khung tự nạp bằng <script src>. */
export async function napThuVien(tj: TestsJson): Promise<Array<{ url: string; text: string | null; css?: boolean }>> {
  const thuVien = new Set(['react', ...((tj.thuVien as string[] | undefined) ?? [])]);
  const js = [...thuVien].flatMap((t) => THU_VIEN_CDN[t] ?? []).map((u) => `${CDN}${u}`);
  const css = [...thuVien].map((t) => CSS_CDN[t]).filter(Boolean).map((u) => `${CDN}${u}`);
  // App desktop: connect-src của renderer không cho jsdelivr ⇒ đừng thử (chỉ sinh lỗi CSP) — khung hộp cát tự nạp.
  if ((globalThis as { __CT_HOP_CAT_KHUNG__?: string }).__CT_HOP_CAT_KHUNG__) {
    return [...js.map((url) => ({ url, text: null })), ...css.map((url) => ({ url, text: null, css: true }))];
  }
  return Promise.all([
    ...js.map(async (url) => ({ url, text: await taiVanBan(url) })),
    ...css.map(async (url) => ({ url, text: await taiVanBan(url), css: true })),
  ]);
}

export function dungTrangReact(tj: TestsJson, files: TepMap, cfg: Record<string, unknown>, nguon?: Array<{ url: string; text: string | null; css?: boolean }>): string {
  const thuVien = new Set(['react', ...((tj.thuVien as string[] | undefined) ?? [])]);
  const ds = nguon ?? [...thuVien].flatMap((t) => THU_VIEN_CDN[t] ?? []).map((u) => ({ url: `${CDN}${u}`, text: null as string | null, css: false }));
  const scripts = ds.filter((x) => !x.css).map((x) => (x.text != null
    ? `<script data-tu="${x.url}">${escScript(x.text)}</script>`
    : `<script src="${x.url}" crossorigin="anonymous"></script>`)).join('\n');
  const cssCo = ds.filter((x) => x.css && x.text != null).map((x) => `<style data-thu-vien>${(x.text as string).replace(/<\/style/gi, '<\\/style')}</style>`).join('');
  const cssThieu = ds.filter((x) => x.css && x.text == null).map((x) => x.url);
  const napCss = cssCo + (cssThieu.length
    ? `<script>${cssThieu.map((u) => `fetch(${JSON.stringify(u)}).then(function(r){return r.text()}).then(function(t){var s=document.createElement('style');s.setAttribute('data-thu-vien','');s.textContent=t;document.head.insertBefore(s,document.head.firstChild)}).catch(function(){})`).join(';')}</script>`
    : '');
  const than = typeof tj.htmlThan === 'string' ? tj.htmlThan : '<div id="root"></div>';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">${theCfgAgent(cfg)}
${scripts}
${napCss}
<style>body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}</style>
</head><body>${than}</body></html>`;
}

// ─── chạy MỘT khung ────────────────────────────────────────────────────────────────

interface KetQuaKhung { ketQua?: Array<{ dat: boolean; thay?: string }>; taiLai?: boolean; batDauTuBuoc?: number; hong?: string; log?: string[]; loi?: string[] }

let demId = 0;

function chayKhung(html: string, id: string, beRong: number, hetMs: number): Promise<KetQuaKhung | null> {
  return new Promise((resolve) => {
    const f = document.createElement('iframe');
    f.setAttribute('sandbox', 'allow-scripts allow-forms');
    f.setAttribute('aria-hidden', 'true');
    f.setAttribute('tabindex', '-1');
    f.title = 'Khung chấm bài';
    // phải nằm TRONG khung nhìn (trình duyệt hãm timer/rAF của khung ngoài màn hình) nhưng vô hình
    f.style.cssText = `position:fixed;left:0;top:0;width:${beRong}px;height:768px;border:0;opacity:0.001;pointer-events:none;z-index:-1;`;
    let xong = false;
    const ket = (v: KetQuaKhung | null) => {
      if (xong) return;
      xong = true;
      clearTimeout(hen);
      window.removeEventListener('message', nghe);
      f.remove();
      resolve(v);
    };
    const nghe = (e: MessageEvent) => {
      if (e.source !== f.contentWindow) return;
      const d = e.data as KetQuaKhung & { __clCham?: string };
      if (!d || d.__clCham !== id) return;
      ket(d);
    };
    window.addEventListener('message', nghe);
    const hen = setTimeout(() => ket(null), hetMs);
    const hopCat = (globalThis as { __CT_HOP_CAT_KHUNG__?: string }).__CT_HOP_CAT_KHUNG__;
    if (hopCat) {
      f.addEventListener('load', () => f.contentWindow?.postMessage({ __napTrang: html }, '*'), { once: true });
      f.src = hopCat;
    } else {
      f.srcdoc = html;
    }
    document.body.appendChild(f);
  });
}

// ─── điều phối ─────────────────────────────────────────────────────────────────────

/** Bỏ trường chỉ dùng ở trang mẹ trước khi gửi kiểm vào khung. */
function gonKiem(k: Kiem): Kiem {
  const { i: _i, moTa, ...rest } = k;
  void _i;
  return { moTa, ...rest };
}

function laReact(tj: TestsJson) { return tj.loai === 'react'; }

/**
 * Chấm danh sách kiểm (đã lọc: Chạy thử = kiểm mẫu, Nộp = đủ). `onTung` báo từng kết quả để giao
 * diện hiện dần. Song song tối đa 3 khung.
 */
export async function chamKhung(tj: TestsJson, kiem: Kiem[], files: TepMap, onTung?: (r: KetQuaKiem) => void): Promise<KetQuaKiem[]> {
  const out: KetQuaKiem[] = new Array(kiem.length);
  const react = laReact(tj);
  const xong = (idx: number, r: { dat: boolean; thay?: string; boQua?: string }, ms?: number) => {
    const k = kiem[idx];
    const kq: KetQuaKiem = { i: typeof k.i === 'number' ? k.i : idx, dat: r.dat, an: !!k.an, nhom: (k.nhom as string) ?? null, moTa: k.moTa, thay: r.thay, ...(r.boQua ? { boQua: r.boQua } : {}), ...(ms != null ? { ms } : {}) };
    out[idx] = kq;
    onTung?.(kq);
  };

  // React: biên dịch + tải thư viện MỘT lần cho mọi khung
  let maDich: Record<string, string> | null = null;
  let nguon: Awaited<ReturnType<typeof napThuVien>> | undefined;
  if (react) {
    nguon = await napThuVien(tj);
    const r = await bienDichReact(files);
    if ('loi' in r) {
      kiem.forEach((k, idx) => (k.kiem === 'ma-nguon' ? xong(idx, kiemMaNguon(k, files)) : xong(idx, { dat: false, thay: r.loi })));
      return out;
    }
    maDich = r.maDich;
  }

  // nhóm khung
  const nhom = new Map<string, number[]>();
  kiem.forEach((k, idx) => {
    if (k.kiem === 'ma-nguon') { xong(idx, kiemMaNguon(k, files)); return; }
    const w = Number(k.beRong) || (react ? 1280 : 1024);
    // kiểm có môi trường RIÊNG (fetch giả, json-server, localStorage, confirm/prompt) cũng phải có khung riêng —
    // khung dùng chung lấy cấu hình của kiểm ĐẦU nhóm
    const moiTruongRieng = k.jsonServer != null || k.fetchGia != null || k.khoCucBo != null || k.confirm !== undefined || k.prompt !== undefined;
    const rieng = (Array.isArray(k.truoc) && k.truoc.length > 0) || k.kiem === 'hop-le' || moiTruongRieng;
    // kiểm tĩnh dùng chung khung theo bề rộng + URL đầu của router (`url`)
    const khoa = rieng ? `r${idx}` : `w${w}|${String(k.url ?? '')}`;
    nhom.set(khoa, [...(nhom.get(khoa) ?? []), idx]);
  });

  const viec = [...nhom.entries()].map(([khoa, ds]) => async () => {
    const dau = kiem[ds[0]];
    const w = Number(dau.beRong) || (react ? 1280 : 1024);
    const t0 = performance.now();
    let batDau = 0;
    let taiLai = 0;
    for (;;) {
      const id = `cl${Date.now().toString(36)}${(demId++).toString(36)}`;
      const cfg: Record<string, unknown> = {
        id,
        kiem: ds.map((i) => gonKiem(kiem[i])),
        truoc: khoa.startsWith('r') ? (dau.truoc ?? []) : [],
        batDauTuBuoc: batDau,
        taiLai,
        choToiDa: react ? 1000 : 0,
        khoCucBo: (dau.khoCucBo as Record<string, string> | undefined) ?? (tj.khoCucBo as Record<string, string> | undefined) ?? null,
        fetchGia: react || tj.fetchGia || dau.fetchGia ? { ...((tj.fetchGia as object) ?? {}), ...((dau.fetchGia as object) ?? {}) } : null,
        confirm: dau.confirm ?? tj.confirm,
        prompt: dau.prompt ?? tj.prompt,
        // React Router: URL mở đầu (BrowserRouter chạy bằng MemoryRouter trong khung) · json-server giả có trạng thái
        url: dau.url ?? tj.url ?? null,
        jsonServer: dau.jsonServer ?? tj.jsonServer ?? null,
      };
      let html: string;
      try {
        if (react) {
          if (!maDich) throw new Error('chưa biên dịch');
          cfg.react = { tepChinh: tj.tepChinh ?? null, renderTu: tj.renderTu ?? (tj.tepChinh ? null : 'src/App.js') };
          cfg.files = files;
          cfg.maDich = maDich;
          html = dungTrangReact(tj, files, cfg, nguon);
        } else {
          html = dungTrangDom(tj, files, cfg);
        }
      } catch (e) {
        const ly = e instanceof Error ? e.message : String(e);
        ds.forEach((i) => xong(i, { dat: false, thay: ly }));
        return;
      }
      const kq = await chayKhung(html, id, w, react ? 25000 : 8000);
      const ms = Math.round(performance.now() - t0);
      if (!kq) {
        ds.forEach((i) => xong(i, { dat: false, thay: react ? 'khung chấm không phản hồi (mạng chậm, CDN không tải được, hay vòng lặp vô hạn?)' : 'khung chấm không phản hồi (vòng lặp vô hạn?)' }, ms));
        return;
      }
      if (kq.taiLai && taiLai < 3) { taiLai++; batDau = kq.batDauTuBuoc ?? 0; continue; }
      ds.forEach((i, j) => xong(i, kq.ketQua?.[j] ?? { dat: false, thay: 'khung không trả kết quả' }, ms));
      return;
    }
  });

  // song song tối đa 3 khung
  let con = 0;
  const chay = async () => { while (con < viec.length) { const v = viec[con++]; await v(); } };
  await Promise.all([chay(), chay(), chay()]);
  return out;
}
