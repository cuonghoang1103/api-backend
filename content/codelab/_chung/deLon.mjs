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
  '@reduxjs/toolkit': ['@reduxjs/toolkit@1.9.7/dist/redux-toolkit.umd.min.js'],
  'react-redux': ['react-redux@8.1.3/dist/react-redux.min.js'],
};
/** CSS gói: style-src của web không cho jsdelivr ⇒ demo tải bằng fetch (connect-src cho) rồi nhét <style>. */
const CSS_DEMO = { bootstrap: 'bootstrap@5.3.3/dist/css/bootstrap.min.css' };

/**
 * RUNTIME của demo (ES5, chạy trong iframe sandbox gốc mờ). Bản sao các phần tương ứng của tác tử chấm
 * (frontend/src/components/code-lab/cham/domAgent.ts): kho localStorage giả, json-server GIẢ có trạng thái,
 * axios giả (qua fetch), React Router chạy bằng MemoryRouter (+ thanh địa chỉ nhỏ để thấy URL), .env,
 * redux-thunk. ⚠ Sửa json-server/router ở đây thì sửa cả domAgent.ts.
 * Chỗ trống: __MODS__ __CSS__ __CHINH__ __DB__ __BASE__ __URL__ __THANH__
 */
const RUNTIME_DEMO = String.raw`(function(){
var M=__MODS__;var CSS=__CSS__;var DB=__DB__;var BASE=__BASE__;var URL0=__URL__;var THANH=__THANH__;
function kho(){var m={};var k={getItem:function(x){x=String(x);return Object.prototype.hasOwnProperty.call(m,x)?m[x]:null},setItem:function(x,v){m[String(x)]=String(v)},removeItem:function(x){delete m[String(x)]},clear:function(){m={}},key:function(i){return Object.keys(m)[i]||null}};Object.defineProperty(k,'length',{get:function(){return Object.keys(m).length}});return k}
try{Object.defineProperty(window,'localStorage',{value:kho(),configurable:true})}catch(e){}
try{Object.defineProperty(window,'sessionStorage',{value:kho(),configurable:true})}catch(e){}
window.confirm=function(){return true};window.alert=function(m){console.log('[alert]',m);var t=document.getElementById('cl-demo-alert');if(!t){t=document.createElement('div');t.id='cl-demo-alert';t.style.cssText='position:fixed;right:12px;bottom:12px;z-index:99999;max-width:320px;padding:10px 14px;border-radius:10px;background:#0f172a;color:#fff;font:13px system-ui;box-shadow:0 6px 24px rgba(0,0,0,.25)';document.body.appendChild(t)}t.textContent='alert: '+m;clearTimeout(t.__h);t.__h=setTimeout(function(){t.remove()},2600)};
var ENV={NODE_ENV:'production',MODE:'production',PROD:true,DEV:false,BASE_URL:'/'};
String(M['.env']||'').split(/\r?\n/).forEach(function(d){var m=/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/.exec(d);if(m)ENV[m[1]]=m[2].replace(/^(['"])(.*)\1$/,'$2')});
window.__CL_ENV__=ENV;if(!window.process)window.process={env:ENV};
// json-server giả (bản sao domAgent.ts)
var jsDb=DB?JSON.parse(JSON.stringify(DB)):null;
function tl(st,b){return new Response(b===undefined?'{}':JSON.stringify(b),{status:st,headers:{'content-type':'application/json'}})}
function lay(o,k){return String(k).split('.').reduce(function(a,p){return a==null?undefined:a[p]},o)}
function mot(t){return /ies$/.test(t)?t.slice(0,-3)+'y':t.replace(/s$/,'')}
function xuLy(method,url,body){var u=new URL(url);var ph=u.pathname.replace(/^\/+|\/+$/g,'').split('/').filter(Boolean).map(decodeURIComponent);var ten=ph[0],id=ph[1];
if(!ten||!(ten in jsDb))return tl(404,{});var bang=jsDb[ten];var dl=null;if(body!=null&&body!==''){try{dl=JSON.parse(body)}catch(e){return tl(400,{})}}
if(!Array.isArray(bang)){if(method==='GET')return tl(200,bang);if(method==='PUT'||method==='POST'){jsDb[ten]=dl||{};return tl(200,jsDb[ten])}if(method==='PATCH'){jsDb[ten]=Object.assign({},bang,dl||{});return tl(200,jsDb[ten])}return tl(404,{})}
var vt=function(x){return bang.findIndex(function(r){return String(r.id)===String(x)})};
var mr=function(r){var o=Object.assign({},r);u.searchParams.getAll('_expand').forEach(function(e){var b=jsDb[e+'s']||jsDb[e];if(Array.isArray(b))o[e]=b.find(function(x){return String(x.id)===String(r[e+'Id'])})});u.searchParams.getAll('_embed').forEach(function(e){var b=jsDb[e];if(Array.isArray(b)){var k=mot(ten)+'Id';o[e]=b.filter(function(x){return String(x[k])===String(r.id)})}});return o};
if(method==='GET'){if(id!=null){var i=vt(id);return i<0?tl(404,{}):tl(200,mr(bang[i]))}var ds=bang.slice();var loc={};u.searchParams.forEach(function(v,k){if(k.charAt(0)!=='_'&&k!=='q')(loc[k]=loc[k]||[]).push(v)});
Object.keys(loc).forEach(function(k){var vs=loc[k],m=/^(.*)_(like|gte|lte|ne)$/.exec(k);ds=ds.filter(function(r){if(m){var gv=lay(r,m[1]);return vs.every(function(v){if(m[2]==='like')return new RegExp(v,'i').test(String(gv));if(m[2]==='ne')return String(gv)!==v;var a=Number(gv),b=Number(v);var so=!isNaN(a)&&!isNaN(b);return m[2]==='gte'?(so?a>=b:String(gv)>=v):(so?a<=b:String(gv)<=v)})}var g=lay(r,k);return vs.some(function(v){return String(g)===v})})});
var qq=u.searchParams.get('q');if(qq)ds=ds.filter(function(r){return JSON.stringify(r).toLowerCase().indexOf(qq.toLowerCase())>=0});
var sx=u.searchParams.get('_sort');if(sx){var tr=sx.split(','),th=(u.searchParams.get('_order')||'asc').split(',');ds.sort(function(a,b){for(var t=0;t<tr.length;t++){var f=tr[t].replace(/^-/,''),gi=tr[t].charAt(0)==='-'||(th[t]||th[0])==='desc';var x=lay(a,f),y=lay(b,f);var c=(typeof x==='number'&&typeof y==='number')?x-y:String(x).localeCompare(String(y));if(c)return gi?-c:c}return 0})}
var gh=u.searchParams.get('_limit'),pg=u.searchParams.get('_page');if(pg){var n=Number(gh)||10;ds=ds.slice((Number(pg)-1)*n,Number(pg)*n)}else if(gh)ds=ds.slice(0,Number(gh));return tl(200,ds.map(mr))}
if(method==='POST'){if(id!=null)return tl(404,{});var mo=Object.assign({},dl||{});if(mo.id==null){var so2=bang.length&&bang.every(function(r){return typeof r.id==='number'});mo.id=so2||!bang.length?bang.reduce(function(mx,r){return Math.max(mx,Number(r.id)||0)},0)+1:Math.random().toString(16).slice(2,6)}bang.push(mo);return tl(201,mo)}
if(id==null)return tl(404,{});var j=vt(id);if(j<0)return tl(404,{});
if(method==='PUT'){bang[j]=Object.assign({},dl||{},{id:bang[j].id});return tl(200,bang[j])}if(method==='PATCH'){bang[j]=Object.assign({},bang[j],dl||{},{id:bang[j].id});return tl(200,bang[j])}if(method==='DELETE'){bang.splice(j,1);return tl(200,{})}return tl(404,{})}
if(jsDb){window.fetch=function(url,init){init=init||{};var s=String(url&&url.url?url.url:url);var me=String(init.method||'GET').toUpperCase();return new Promise(function(res){setTimeout(function(){if(s.indexOf(BASE+'/')!==0)return res(new Response('Not Found',{status:404}));try{res(xuLy(me,s,init.body))}catch(e){res(tl(500,{error:String(e)}))}},120)})}}
function axiosGia(){function goi(method,url,data,cfg){cfg=cfg||{};var u=(cfg.baseURL||'')+url;if(cfg.params){var sp=new URLSearchParams(cfg.params).toString();if(sp)u+=(u.indexOf('?')>=0?'&':'?')+sp}var init={method:method.toUpperCase(),headers:Object.assign({'Content-Type':'application/json'},cfg.headers||{})};if(data!==undefined)init.body=typeof data==='string'?data:JSON.stringify(data);
return window.fetch(u,init).then(function(res){return res.text().then(function(t){var d;try{d=JSON.parse(t)}catch(e){d=t}var out={data:d,status:res.status,statusText:res.statusText,headers:{},config:cfg};if(res.status>=200&&res.status<300)return out;var err=new Error('Request failed with status code '+res.status);err.response=out;err.name='AxiosError';throw err})})}
function tao(base){var a=function(cfg){return goi(cfg.method||'get',cfg.url,cfg.data,Object.assign({},base,cfg))};['get','delete','head'].forEach(function(m){a[m]=function(url,cfg){return goi(m,url,undefined,Object.assign({},base,cfg))}});['post','put','patch'].forEach(function(m){a[m]=function(url,data,cfg){return goi(m,url,data,Object.assign({},base,cfg))}});a.create=function(c){return tao(Object.assign({},base,c))};a.defaults=base;a.interceptors={request:{use:function(){}},response:{use:function(){}}};a.isAxiosError=function(e){return!!(e&&e.name==='AxiosError')};return a}
var ax=tao({});ax.default=ax;return ax}
var R=window.React;var tach=function(p,k){var q=Object.assign({},p);var c=q.children;delete q.children;if(k!==undefined)q.key=k;return[q,c]};
var j=function(t,p,k){var x=tach(p,k);return x[1]===undefined?R.createElement(t,x[0]):R.createElement(t,x[0],x[1])};
var js=function(t,p,k){var x=tach(p,k);return R.createElement.apply(null,[t,x[0]].concat(x[1]||[]))};
// React Router: MemoryRouter + thanh địa chỉ (gõ URL được — thử ?status=ACTIVE, /items/2…)
var viTri=null,routerBoc=null,dieuHuong=null;
function datThanh(v){var o=document.getElementById('cl-demo-url');if(o&&document.activeElement!==o)o.value='http://localhost:3000'+v}
function routerGia(){var RRD=window.ReactRouterDOM;if(!RRD)return null;if(routerBoc)return routerBoc;
function Ghi(){var l=RRD.useLocation();var nav=RRD.useNavigate();dieuHuong=nav;viTri=l.pathname+l.search+l.hash;R.useEffect(function(){datThanh(viTri)});return null}
function RG(p){var d=R.useState(function(){return[viTri||URL0||'/']})[0];return R.createElement(RRD.MemoryRouter,{initialEntries:d,basename:p.basename},R.createElement(Ghi),p.children)}
function tr(routes,opts){var r=RRD.createMemoryRouter(routes,Object.assign({},opts||{},{initialEntries:[viTri||URL0||'/']}));var g=function(s){viTri=s.location.pathname+s.location.search+s.location.hash;datThanh(viTri)};g(r.state);r.subscribe(g);dieuHuong=function(to){r.navigate(to)};return r}
routerBoc=Object.assign({},RRD,{BrowserRouter:RG,HashRouter:RG,createBrowserRouter:tr,createHashRouter:tr});return routerBoc}
var thunk=function(api){return function(next){return function(a){return typeof a==='function'?a(api.dispatch,api.getState):next(a)}}};
var LIB={'react':R,'react-dom':window.ReactDOM,'react-dom/client':window.ReactDOM,'react/jsx-runtime':{jsx:j,jsxs:js,Fragment:R.Fragment},'react/jsx-dev-runtime':{jsxDEV:j,Fragment:R.Fragment},'prop-types':window.PropTypes,'react-bootstrap':window.ReactBootstrap,'@reduxjs/toolkit':window.RTK,'redux':window.RTK,'react-redux':window.ReactRedux,'redux-thunk':{'default':thunk,thunk:thunk}};
var C={};
function dd(tu,s){var p=tu.split('/').slice(0,-1);s.split('/').forEach(function(x){if(x==='.'||x==='')return;if(x==='..')p.pop();else p.push(x)});return p.join('/')}
function tim(p){var d=['','.js','.jsx','.ts','.tsx','.json','/index.js','/index.jsx'];for(var i=0;i<d.length;i++){if(M[p+d[i]]!=null||CSS[p+d[i]]!=null)return p+d[i]}return null}
function req(tu,s){if(s==='axios')return axiosGia();if(s==='react-router-dom'||s==='react-router')return routerGia();if(LIB[s])return LIB[s];if(/\.css$/.test(s)&&!/^\./.test(s))return{};var p=tim(dd(tu,s));if(!p)throw new Error('Cannot find module '+s);return nap(p)}
function nap(p){if(C[p])return C[p].exports;if(CSS[p]!=null){var st=document.createElement('style');st.textContent=CSS[p];document.head.appendChild(st);C[p]={exports:{}};return{}}var m={exports:{}};C[p]=m;if(/\.json$/.test(p)){m.exports=JSON.parse(M[p]);return m.exports}new Function('require','module','exports',M[p])(function(s){return req(p,s)},m,m.exports);return m.exports}
if(THANH){var bar=document.createElement('form');bar.style.cssText='position:sticky;top:0;z-index:99998;display:flex;gap:6px;align-items:center;padding:6px 10px;background:#e2e8f0;border-bottom:1px solid #cbd5e1;font:12px system-ui';bar.innerHTML='<span style="color:#475569">URL</span><input id="cl-demo-url" style="flex:1;padding:4px 8px;border:1px solid #cbd5e1;border-radius:6px;font:12px ui-monospace,monospace" aria-label="Address bar"><button style="padding:3px 10px;border-radius:6px;border:1px solid #94a3b8;background:#fff;cursor:pointer">Go</button>';
bar.addEventListener('submit',function(e){e.preventDefault();var v=document.getElementById('cl-demo-url').value.replace(/^https?:\/\/[^/]+/,'')||'/';if(dieuHuong)dieuHuong(v)});document.body.insertBefore(bar,document.body.firstChild);datThanh(URL0||'/')}
nap(__CHINH__);
})();`;

/**
 * Trang demo tự chứa từ LỜI GIẢI (React): biên dịch mọi tệp .js/.jsx/.ts/.tsx bằng sucrase (CommonJS + JSX
 * automatic), gói vào một runtime require tí hon, nạp React UMD từ jsdelivr. Chạy trong iframe sandbox gốc
 * mờ ⇒ localStorage thật bị chặn: dùng kho trong bộ nhớ (demo không nhớ qua lần mở). confirm() ⇒ true.
 * `jsonServer: { base, db }` ⇒ json-server GIẢ có trạng thái (thêm/sửa/xoá thấy ngay); app có React Router ⇒
 * thanh địa chỉ nhỏ trên cùng (URL hiện tại, gõ được). `url` = URL mở đầu.
 */
export function dungDemoReact(files, { tepChinh = 'src/index.js', thuVien = [], tieuDe = 'Live demo', htmlThan = '<div id="root"></div>', jsonServer = null, url = null } = {}) {
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
    if (ten === '.env' || /\.json$/.test(ten)) { mods[ten] = code; continue; }
    if (!/\.(m?jsx?|tsx?)$/.test(ten)) continue;
    mods[ten] = transform(code.replace(/\bimport\.meta\.env\b/g, 'window.__CL_ENV__'), {
      transforms: /\.tsx?$/.test(ten) ? ['typescript', 'jsx', 'imports'] : ['jsx', 'imports'],
      jsxRuntime: 'automatic', production: true, filePath: ten,
    }).code;
  }
  const ds = ['react', ...thuVien];
  const lib = ds.flatMap((t) => THU_VIEN_DEMO[t] ?? []).map((u) => `<script src="${CDN}${u}" crossorigin="anonymous"></script>`).join('\n');
  const cssGoi = ds.map((t) => CSS_DEMO[t]).filter(Boolean)
    .map((u) => `<script>fetch(${JSON.stringify(CDN + u)}).then(function(r){return r.text()}).then(function(t){var s=document.createElement('style');s.textContent=t;document.head.insertBefore(s,document.head.firstChild)}).catch(function(){})</script>`).join('');
  const J = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
  const goi = RUNTIME_DEMO
    .replace('__MODS__', () => J(mods)).replace('__CSS__', () => J(Object.fromEntries(css)))
    .replace('__DB__', () => J(jsonServer?.db ?? null)).replace('__BASE__', () => J(String(jsonServer?.base || 'http://localhost:9999').replace(/\/+$/, '')))
    .replace('__URL__', () => J(url)).replace('__THANH__', () => J(ds.includes('react-router-dom')))
    .replace('__CHINH__', () => J(tepChinh));
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(tieuDe)}</title>
${lib}
${cssGoi}
</head><body>${htmlThan}<script>${goi.replace(/<\/script/gi, '<\\/script')}</script></body></html>`;
}
