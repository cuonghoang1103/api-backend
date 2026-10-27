/**
 * ĐỀ LỚN = "BẢN IN" (Code Lab đợt Academy 28/10/2026 — KE-HOACH-CODELAB §8.6) — bộ dựng dùng chung.
 * ═══════════════════════════════════════════════════════════════════════════════════════════════
 * Lab chương / Deep Lab / PE luyện / dự án được viết như một OBJECT có cấu trúc (xem content/codelab/
 * README.md mục "Đề lớn"); hàm ở đây dựng:
 *   - problemHtml (EN) + problemHtmlVi: HTML với các lớp `.bi-*` mà trang làm bài (BanIn.tsx) trình bày
 *     thành tờ đề và in ra A4 (nút "Tải đề PDF") — CÙNG một nguồn;
 *   - testsJson.thangDiem: thang điểm theo chức năng (mỗi kiểm gắn `nhom: 'f<số>'`);
 *   - demoHtml: trang demo TỰ CHỨA chạy lời giải (React UMD + mã đã biên dịch bằng sucrase) cho nút
 *     "▶ Live demo" — người học bấm thử đúng hành vi mong đợi mà không thấy mã.
 *
 * Mọi chuỗi đề là HTML nội tuyến (được dùng <code>, <b>…). Code mẫu/cây thư mục/wireframe là chữ thô
 * (tự escape).
 */
import { createRequire } from 'node:module';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pre = (s, lop = '') => `<pre${lop ? ` class="${lop}"` : ''}>${esc(String(s).replace(/^\n/, '').replace(/\s+$/, ''))}</pre>`;
const ul = (ds) => (ds && ds.length ? `<ul>\n${ds.map((x) => `  <li>${x}</li>`).join('\n')}\n</ul>` : '');

/** Nhãn mục theo ngôn ngữ. */
const NHAN = {
  en: {
    tongQuan: 'Overview', chinh: 'Main features', chung: 'General requirements', cay: 'Required project structure',
    wire: 'UI wireframe', mohinh: 'Data model', mau: 'Sample data', cn: 'Functional requirements', yc: 'Requirements',
    hook: 'Must use', khoa: 'Local Storage key', vd: 'Example', id: 'Element ids / classes used by the auto-grader',
    thang: 'Grading rubric', tru: 'Common deductions', nop: 'Submission', diem: 'marks', diem1: 'mark', cotDiem: 'Marks', truong: 'Field', kieu: 'Type', ghiChu: 'Notes',
    phanTu: 'Selector', vaiTro: 'Purpose', chucNang: 'Feature', tong: 'Total',
  },
  vi: {
    tongQuan: 'Tổng quan', chinh: 'Chức năng chính', chung: 'Yêu cầu chung', cay: 'Cấu trúc thư mục bắt buộc',
    wire: 'Wireframe giao diện', mohinh: 'Mô hình dữ liệu', mau: 'Dữ liệu mẫu', cn: 'Yêu cầu chức năng', yc: 'Yêu cầu',
    hook: 'Bắt buộc dùng', khoa: 'Khoá Local Storage', vd: 'Ví dụ', id: 'id / class máy chấm dùng',
    thang: 'Thang điểm', tru: 'Lỗi hay bị trừ điểm', nop: 'Nộp bài', diem: 'điểm', diem1: 'điểm', cotDiem: 'Điểm', truong: 'Trường', kieu: 'Kiểu', ghiChu: 'Ghi chú',
    phanTu: 'Selector', vaiTro: 'Vai trò', chucNang: 'Chức năng', tong: 'Tổng',
  },
};

/** Lấy chuỗi theo ngôn ngữ: giá trị có thể là chuỗi (chung) hoặc { en, vi }. */
const L = (v, lang) => (v && typeof v === 'object' && !Array.isArray(v) && ('en' in v || 'vi' in v) ? (v[lang] ?? v.en) : v);
const LS = (ds, lang) => (Array.isArray(ds) ? ds.map((x) => L(x, lang)) : L(ds, lang) || []);

/**
 * Dựng HTML tờ đề.
 * b = { tieuDe, phu, moTa, chucNangChinh[], yeuCauChung[], cayThuMuc, wireframe, moHinh: { ten, truong: [[ten,kieu,ghiChu]] },
 *       duLieuMau, chucNang: [{ ten, diem, moTa, yeuCau[], hook[], khoa?, viDu? }], idBatBuoc: [[selector, vaiTro]], truDiem[], nopBai }
 * Mọi trường chữ nhận chuỗi hoặc { en, vi }.
 */
export function dungBanIn(b, lang = 'en') {
  const N = NHAN[lang];
  const tong = b.chucNang.reduce((s, c) => s + c.diem, 0);
  const out = [];
  out.push(`<h1>${esc(L(b.tieuDe, lang))}</h1>`);
  if (b.phu) out.push(`<p class="bi-phu">${L(b.phu, lang)}</p>`);
  out.push(`<h2>1. ${N.tongQuan}</h2>`, L(b.moTa, lang));
  if (b.chucNangChinh) out.push(`<h3>${N.chinh}</h3>`, ul(LS(b.chucNangChinh, lang)));
  if (b.yeuCauChung) out.push(`<h3>${N.chung}</h3>`, ul(LS(b.yeuCauChung, lang)));
  out.push(`<h2>2. ${N.cay}</h2>`, pre(b.cayThuMuc));
  if (b.wireframe) out.push(`<h2>3. ${N.wire}</h2>`, pre(b.wireframe, 'bi-wire'));
  out.push(`<h2>${b.wireframe ? 4 : 3}. ${N.mohinh}</h2>`);
  out.push(`<p><b>${esc(b.moHinh.ten)}</b></p>`);
  out.push(`<table><thead><tr><th>${N.truong}</th><th>${N.kieu}</th><th>${N.ghiChu}</th></tr></thead><tbody>${b.moHinh.truong.map(([t, k, g]) => `<tr><td><code>${esc(t)}</code></td><td>${esc(k)}</td><td>${L(g, lang)}</td></tr>`).join('')}</tbody></table>`);
  if (b.duLieuMau) out.push(`<h3>${N.mau}</h3>`, pre(b.duLieuMau));
  let so = b.wireframe ? 5 : 4;
  out.push(`<h2>${so++}. ${N.cn}</h2>`);
  b.chucNang.forEach((c, i) => {
    out.push(`<div class="bi-cn"><h3>${i + 1}. ${esc(L(c.ten, lang))} <span class="bi-diem">${c.diem} ${c.diem === 1 ? N.diem1 : N.diem}</span></h3>`);
    if (c.moTa) out.push(`<p>${L(c.moTa, lang)}</p>`);
    out.push(`<p><b>${N.yc}:</b></p>`, ul(LS(c.yeuCau, lang)));
    if (c.hook?.length) out.push(`<p><b>${N.hook}:</b> ${c.hook.map((h) => `<span class="bi-hook">${esc(h)}</span>`).join(' ')}</p>`);
    if (c.khoa) out.push(`<p><b>${N.khoa}:</b> <code>${esc(c.khoa)}</code></p>`);
    if (c.viDu) out.push(`<p><b>${N.vd}:</b></p>`, pre(L(c.viDu, lang)));
    out.push('</div>');
  });
  if (b.idBatBuoc?.length) {
    out.push(`<h2>${so++}. ${N.id}</h2>`);
    out.push(`<table><thead><tr><th>${N.phanTu}</th><th>${N.vaiTro}</th></tr></thead><tbody>${b.idBatBuoc.map(([s, v]) => `<tr><td><code>${esc(s)}</code></td><td>${L(v, lang)}</td></tr>`).join('')}</tbody></table>`);
  }
  out.push(`<h2>${so++}. ${N.thang}</h2>`);
  out.push(`<table><thead><tr><th>#</th><th>${N.chucNang}</th><th>${N.cotDiem}</th></tr></thead><tbody>${b.chucNang.map((c, i) => `<tr><td>${i + 1}</td><td>${esc(L(c.ten, lang))}</td><td>${c.diem}</td></tr>`).join('')}<tr><td></td><td><b>${N.tong}</b></td><td><b>${tong}</b></td></tr></tbody></table>`);
  if (b.truDiem?.length) out.push(`<h3>${N.tru}</h3>`, ul(LS(b.truDiem, lang)));
  if (b.nopBai) out.push(`<h2>${so++}. ${N.nop}</h2>`, `<p>${L(b.nopBai, lang)}</p>`);
  return out.filter(Boolean).join('\n');
}

/** Thang điểm cho testsJson: f1..fN theo thứ tự chức năng. */
export function thangDiemTu(b) {
  return b.chucNang.map((c, i) => ({ ma: `f${i + 1}`, ten: `${i + 1}. ${L(c.ten, 'en')}`, diem: c.diem }));
}

// ─── demo tự chứa ───────────────────────────────────────────────────────────────────

const CDN = 'https://cdn.jsdelivr.net/npm/';
const THU_VIEN_DEMO = {
  react: ['react@18.3.1/umd/react.production.min.js', 'react-dom@18.3.1/umd/react-dom.production.min.js'],
  'prop-types': ['prop-types@15.8.1/prop-types.min.js'],
  'react-router-dom': ['@remix-run/router@1.19.2/dist/router.umd.min.js', 'react-router@6.26.2/dist/umd/react-router.production.min.js', 'react-router-dom@6.26.2/dist/umd/react-router-dom.production.min.js'],
  'react-bootstrap': ['react-bootstrap@2.10.5/dist/react-bootstrap.min.js'],
};

/**
 * Trang demo tự chứa từ LỜI GIẢI (React): biên dịch mọi tệp .js/.jsx/.ts/.tsx bằng sucrase (CommonJS + JSX
 * automatic), gói vào một runtime require tí hon, nạp React UMD từ jsdelivr. Chạy trong iframe sandbox gốc
 * mờ ⇒ localStorage thật bị chặn: dùng kho trong bộ nhớ (demo không nhớ qua lần mở). confirm() ⇒ true.
 */
export function dungDemoReact(files, { tepChinh = 'src/index.js', thuVien = [], tieuDe = 'Live demo', htmlThan = '<div id="root"></div>' } = {}) {
  // sucrase: repo gốc không cài; frontend/desktop có (gián tiếp qua tailwind) — tìm lần lượt
  let transform;
  for (const goc of ['../../../package.json', '../../../frontend/package.json', '../../../desktop/package.json']) {
    try { ({ transform } = createRequire(new URL(goc, import.meta.url))('sucrase')); break; } catch { /* thử chỗ kế */ }
  }
  if (!transform) throw new Error('Không tìm thấy gói sucrase (cần frontend/node_modules) để dựng demo');
  const mods = {};
  const css = [];
  for (const [ten, code] of Object.entries(files)) {
    if (/\.css$/.test(ten)) { css.push([ten, code]); continue; }
    if (!/\.(m?jsx?|tsx?)$/.test(ten)) continue;
    mods[ten] = transform(code, {
      transforms: /\.tsx?$/.test(ten) ? ['typescript', 'jsx', 'imports'] : ['jsx', 'imports'],
      jsxRuntime: 'automatic', production: true, filePath: ten,
    }).code;
  }
  const lib = ['react', ...thuVien].flatMap((t) => THU_VIEN_DEMO[t] ?? []).map((u) => `<script src="${CDN}${u}" crossorigin="anonymous"></script>`).join('\n');
  const goi = `(function(){
var M=${JSON.stringify(mods).replace(/</g, '\\u003c')};
var CSS=${JSON.stringify(Object.fromEntries(css)).replace(/</g, '\\u003c')};
function kho(){var m={};var k={getItem:function(x){x=String(x);return Object.prototype.hasOwnProperty.call(m,x)?m[x]:null},setItem:function(x,v){m[String(x)]=String(v)},removeItem:function(x){delete m[String(x)]},clear:function(){m={}},key:function(i){return Object.keys(m)[i]||null}};Object.defineProperty(k,'length',{get:function(){return Object.keys(m).length}});return k}
try{Object.defineProperty(window,'localStorage',{value:kho(),configurable:true})}catch(e){}
try{Object.defineProperty(window,'sessionStorage',{value:kho(),configurable:true})}catch(e){}
window.confirm=function(){return true};window.alert=function(m){console.log('[alert]',m)};
var R=window.React;var tach=function(p,k){var q=Object.assign({},p);var c=q.children;delete q.children;if(k!==undefined)q.key=k;return[q,c]};
var j=function(t,p,k){var x=tach(p,k);return x[1]===undefined?R.createElement(t,x[0]):R.createElement(t,x[0],x[1])};
var js=function(t,p,k){var x=tach(p,k);return R.createElement.apply(null,[t,x[0]].concat(x[1]||[]))};
var LIB={'react':R,'react-dom':window.ReactDOM,'react-dom/client':window.ReactDOM,'react/jsx-runtime':{jsx:j,jsxs:js,Fragment:R.Fragment},'react/jsx-dev-runtime':{jsxDEV:j,Fragment:R.Fragment},'prop-types':window.PropTypes,'react-router-dom':window.ReactRouterDOM,'react-bootstrap':window.ReactBootstrap};
var C={};
function dd(tu,s){var p=tu.split('/').slice(0,-1);s.split('/').forEach(function(x){if(x==='.'||x==='')return;if(x==='..')p.pop();else p.push(x)});return p.join('/')}
function tim(p){var d=['','.js','.jsx','.ts','.tsx','/index.js','/index.jsx'];for(var i=0;i<d.length;i++){if(M[p+d[i]]!=null||CSS[p+d[i]]!=null)return p+d[i]}return null}
function req(tu,s){if(LIB[s])return LIB[s];if(/\\.css$/.test(s)&&!/^\\./.test(s))return{};var p=tim(dd(tu,s));if(!p)throw new Error('Cannot find module '+s);return nap(p)}
function nap(p){if(C[p])return C[p].exports;if(CSS[p]!=null){var st=document.createElement('style');st.textContent=CSS[p];document.head.appendChild(st);C[p]={exports:{}};return{}}var m={exports:{}};C[p]=m;new Function('require','module','exports',M[p])(function(s){return req(p,s)},m,m.exports);return m.exports}
nap(${JSON.stringify(tepChinh)});
})();`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(tieuDe)}</title>
${lib}
</head><body>${htmlThan}<script>${goi.replace(/<\/script/gi, '<\\/script')}</script></body></html>`;
}
