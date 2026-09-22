/**
 * _cr-chung.mjs — giao diện + thư viện hình vẽ cho các deck của khoá
 * "Content Creator" (deck cr-00 … cr-24).
 *
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/cr-05.mjs --out <dir>
 *
 * ⚠️ KHÔNG sửa `scripts/_render-slides.mjs` — file đó dùng chung cho MAE101 /
 * SWR302 / SWT301 / NWC204 / Web Foundations. Theme tối của khoá này được nhúng
 * vào body của TỪNG slide qua hàm S() bên dưới (giống cách `_wf-chung.mjs`,
 * `_nwc-chung.mjs` làm), nên các môn khác không bị ảnh hưởng.
 *
 * Cách dùng trong một deck:
 *   import { S, cover, cards, box, steps, table, vs, ... } from './_cr-chung.mjs';
 *   export const deck = { key:'cr-05', code:'CR · CHƯƠNG 5', title:'Máy quay hoạt động thế nào',
 *                         sub:'Content Creator · Chương 5' };
 *   export const slides = S([ cover({...}), { t:'Tiêu đề', body: cards([...]) }, ... ]);
 *
 * Quy ước:
 *   • Mọi class có tiền tố `c-` để không đè CSS của bộ dựng chung.
 *   • Hàm trả về chuỗi HTML/SVG. Tham số chữ đưa vào SVG được escape; tham số
 *     HTML (cards/box/steps…) nhận HTML thô — tự viết &amp; &lt; khi cần.
 *   • Khung slide 1280×720, vùng thân (.bd) rộng ~1168px, cao ~520px sau tiêu đề.
 *     Chữ đơn cách rộng ~0,6×cỡ chữ; chữ thường (SF Pro) trung bình ~0,52×cỡ chữ.
 */
import hljs from 'highlight.js';

let _id = 0;
const uid = (p = 'c') => `${p}${++_id}`;
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ─────────────────────────────── BẢNG MÀU ─────────────────────────────── */
export const C = {
  bg: '#0d1017', p1: '#151a24', p2: '#1b2230', bd: '#2a3446', tx: '#e9eef6', mu: '#a3aec0', dim: '#6f7b8f',
  red: '#ff4d5e', ora: '#ff8a3d', amb: '#ffc233', grn: '#34d399', tea: '#2dd4bf', blu: '#60a5fa', vio: '#a78bfa', pnk: '#f472b6',
};
const ACC = ['red', 'ora', 'amb', 'grn', 'tea', 'blu', 'vio', 'pnk'];
const col = (k, i = 0) => C[k] || k || C[ACC[i % ACC.length]];

/* ─────────────────────────────── THEME CSS ─────────────────────────────── */
export const CSS = `<style>
:root{--bg:${C.bg};--p1:${C.p1};--p2:${C.p2};--bd:${C.bd};--tx:${C.tx};--mu:${C.mu};--dim:${C.dim};
--red:${C.red};--ora:${C.ora};--amb:${C.amb};--grn:${C.grn};--tea:${C.tea};--blu:${C.blu};--vio:${C.vio};--pnk:${C.pnk}}
body{background:var(--bg)}
.slide{background:
 radial-gradient(900px 480px at 100% 0%,rgba(255,77,94,.10),transparent 60%),
 radial-gradient(820px 460px at 0% 100%,rgba(96,165,250,.09),transparent 60%),
 linear-gradient(180deg,#10141c,#0b0e14);color:var(--tx)}
.slide .bar{height:6px;background:linear-gradient(90deg,var(--red),var(--ora) 28%,var(--amb) 48%,var(--tea) 72%,var(--vio))}
.slide .hd{color:var(--dim);font-size:15px}
.slide .hd span:first-child::before{content:"";display:inline-block;width:10px;height:10px;border-radius:50%;
 background:var(--red);margin-right:10px;box-shadow:0 0 12px var(--red);vertical-align:0}
.slide .hd span:last-child{font-family:"SF Mono",Menlo,monospace;color:var(--mu);background:#171d28;border:1px solid var(--bd);
 padding:2px 10px;border-radius:6px;font-size:14px}
.slide h1{color:#f7f9fd;font-size:38px}
.slide h1::after{background:linear-gradient(90deg,var(--red),var(--amb));width:110px;height:5px}
.slide .bd{color:#d9e0ec;font-size:22px;line-height:1.45;gap:14px}
.slide .bd b,.slide .bd strong{color:#fff}
.slide .bd code{font-family:"SF Mono",Menlo,monospace;background:#232b3b;color:#ffd08a;padding:1px 7px;border-radius:5px;font-size:.88em}
.slide .ft{color:var(--dim);border-top:1px solid #1f2735}
/* cover */
.slide.cover{background:
 radial-gradient(700px 420px at 78% 30%,rgba(255,77,94,.28),transparent 62%),
 radial-gradient(760px 480px at 18% 80%,rgba(96,165,250,.22),transparent 62%),
 radial-gradient(500px 300px at 50% 50%,rgba(167,139,250,.12),transparent 70%),
 #0a0d13}
.slide.cover::before,.slide.cover::after{content:"";position:absolute;left:0;right:0;height:34px;
 background:repeating-linear-gradient(90deg,#000 0 22px,#1d2330 22px 40px);opacity:.9;
}
.slide.cover::before{top:0;border-bottom:2px solid #222a38}
.slide.cover::after{bottom:0;border-top:2px solid #222a38}
.slide.cover .bar{display:none}
.slide.cover h1{font-size:58px;color:#fff;letter-spacing:-.5px;text-shadow:0 4px 30px rgba(0,0,0,.6)}
.slide.cover h1::after{margin:18px auto 0;width:140px;background:linear-gradient(90deg,var(--red),var(--amb),var(--tea))}
.slide.cover .sub{font-size:26px;color:#c8d3e4;margin-top:18px;max-width:1000px}
.slide.cover .bd{flex:0;padding-top:26px}
.c-cov{display:flex;flex-direction:column;align-items:center;gap:16px}
.c-cov .chip{display:inline-flex;align-items:center;gap:10px;font-family:"SF Mono",Menlo,monospace;font-size:18px;
 color:#fff;background:rgba(255,77,94,.16);border:1.5px solid rgba(255,77,94,.55);padding:6px 16px;border-radius:30px}
.c-cov .chip i{width:11px;height:11px;border-radius:50%;background:var(--red);box-shadow:0 0 12px var(--red)}
.c-cov .meta{font-size:17px;color:#8f9bb0;letter-spacing:.3px}
/* thẻ */
.c-grid{display:grid;gap:14px}
.c-grid.g2{grid-template-columns:1fr 1fr}.c-grid.g3{grid-template-columns:repeat(3,1fr)}
.c-grid.g4{grid-template-columns:repeat(4,1fr)}.c-grid.g5{grid-template-columns:repeat(5,1fr)}
.c-card{background:linear-gradient(180deg,#171d29,#131823);border:1.5px solid var(--bd);border-radius:14px;
 padding:15px 17px 15px 20px;position:relative;overflow:hidden}
.c-card::before{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;background:var(--ac,var(--blu))}
.c-card .ic{font-size:30px;line-height:1;margin-bottom:8px;display:block}
.c-card b{display:block;font-size:21px;color:#fff;margin-bottom:5px;line-height:1.25}
.c-card p{font-size:17px;color:var(--mu);line-height:1.42}
.c-card .big{font-size:34px;font-weight:800;color:var(--ac,var(--blu));line-height:1.1;display:block;margin:2px 0 4px}
.red{--ac:var(--red)}.ora{--ac:var(--ora)}.amb{--ac:var(--amb)}.grn{--ac:var(--grn)}
.tea{--ac:var(--tea)}.blu{--ac:var(--blu)}.vio{--ac:var(--vio)}.pnk{--ac:var(--pnk)}
/* hộp nhấn mạnh */
.c-box{border-radius:12px;padding:12px 18px 12px 16px;font-size:20px;line-height:1.45;border:1.5px solid;
 display:flex;gap:12px;align-items:flex-start}
.c-box>.i{font-size:24px;line-height:1.2;flex:0 0 auto}
.c-box.tip{background:rgba(45,212,191,.09);border-color:rgba(45,212,191,.45)}
.c-box.warn{background:rgba(255,194,51,.09);border-color:rgba(255,194,51,.5)}
.c-box.bad{background:rgba(255,77,94,.10);border-color:rgba(255,77,94,.55)}
.c-box.good{background:rgba(52,211,153,.10);border-color:rgba(52,211,153,.5)}
.c-box.info{background:rgba(96,165,250,.10);border-color:rgba(96,165,250,.5)}
/* bước */
.c-steps{display:flex;flex-direction:column;gap:10px}
.c-steps .s{display:flex;gap:14px;align-items:flex-start;background:#141a24;border:1px solid #232c3c;border-radius:12px;padding:10px 14px}
.c-steps .n{flex:0 0 36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;
 font-weight:800;font-size:18px;color:#0b0e14;background:var(--ac,var(--amb))}
.c-steps .s>div{font-size:20px;line-height:1.4;padding-top:3px}
.c-steps .s>div small{display:block;font-size:16px;color:var(--mu);margin-top:2px}
.c-steps.row{flex-direction:row}.c-steps.row .s{flex:1;flex-direction:column;align-items:flex-start}
/* bảng */
.c-t{width:100%;border-collapse:separate;border-spacing:0;font-size:18px;border:1.5px solid var(--bd);border-radius:12px;overflow:hidden}
.c-t th{background:#1e2635;color:#fff;font-weight:700;text-align:left;padding:9px 12px;border-bottom:1.5px solid var(--bd)}
.c-t td{padding:8px 12px;border-bottom:1px solid #222b3a;color:#d6deea;vertical-align:top}
.c-t tr:nth-child(even) td{background:#121822}
.c-t tr:last-child td{border-bottom:none}
.c-t td.hl{background:rgba(255,194,51,.13)!important;color:#ffe4a3;font-weight:700}
.c-t td.ok{color:#7ff0c4;font-weight:700}.c-t td.no{color:#ff8b96;font-weight:700}
.c-t td.c,.c-t th.c{text-align:center}
.c-t.sm{font-size:16px}.c-t.sm td,.c-t.sm th{padding:6px 10px}
/* so sánh sai/đúng */
.c-vs{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.c-vs>div{border-radius:14px;padding:14px 18px;border:1.5px solid}
.c-vs .no{background:rgba(255,77,94,.07);border-color:rgba(255,77,94,.45)}
.c-vs .yes{background:rgba(52,211,153,.07);border-color:rgba(52,211,153,.45)}
.c-vs h4{font-size:21px;margin-bottom:8px}.c-vs .no h4{color:#ff8b96}.c-vs .yes h4{color:#7ff0c4}
.c-vs ul{padding-left:22px;font-size:18px;line-height:1.5;color:#d6deea}
/* số to */
.c-kpis{display:flex;gap:14px}
.c-kpis .k{flex:1;background:#141a24;border:1.5px solid var(--bd);border-radius:14px;padding:14px 16px;text-align:center}
.c-kpis .k b{display:block;font-size:40px;line-height:1.1;color:var(--ac,var(--amb));font-weight:800}
.c-kpis .k span{font-size:16px;color:var(--mu)}
/* luồng ngang */
.c-flow{display:flex;align-items:stretch;gap:0}
.c-flow .f{flex:1;background:#151b26;border:1.5px solid var(--bd);border-top:4px solid var(--ac,var(--blu));
 border-radius:10px;padding:10px 10px;text-align:center;position:relative;margin-right:26px}
.c-flow .f:last-child{margin-right:0}
.c-flow .f:not(:last-child)::after{content:"➜";position:absolute;right:-24px;top:50%;transform:translateY(-50%);
 color:#6f7b8f;font-size:20px}
.c-flow .f .e{font-size:26px;display:block;line-height:1.2}
.c-flow .f b{display:block;font-size:17px;color:#fff;margin-top:3px;line-height:1.2}
.c-flow .f small{display:block;font-size:14px;color:var(--mu);margin-top:3px;line-height:1.3}
/* nhãn */
.c-tag{display:inline-block;font-size:15px;font-weight:700;padding:3px 10px;border-radius:20px;
 background:rgba(255,255,255,.07);border:1px solid #334055;color:#d6deea;margin:2px 4px 2px 0}
.c-tag.red{background:rgba(255,77,94,.15);border-color:rgba(255,77,94,.5);color:#ffb3ba}
.c-tag.grn{background:rgba(52,211,153,.13);border-color:rgba(52,211,153,.5);color:#9ff5d3}
.c-tag.amb{background:rgba(255,194,51,.13);border-color:rgba(255,194,51,.5);color:#ffe29a}
.c-tag.blu{background:rgba(96,165,250,.13);border-color:rgba(96,165,250,.5);color:#bcd7ff}
.c-tag.vio{background:rgba(167,139,250,.14);border-color:rgba(167,139,250,.5);color:#d8cdff}
/* trích dẫn */
.c-quote{font-size:30px;line-height:1.35;color:#fff;border-left:6px solid var(--red);padding:6px 0 6px 24px}
.c-quote small{display:block;font-size:18px;color:var(--mu);margin-top:10px}
/* 2 cột tự do */
.c-two{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:center}
.c-two.l{grid-template-columns:1.25fr 1fr}.c-two.r{grid-template-columns:1fr 1.25fr}
.c-two.l2{grid-template-columns:1.6fr 1fr}.c-two.r2{grid-template-columns:1fr 1.6fr}
.c-list{padding-left:24px;display:flex;flex-direction:column;gap:7px;font-size:20px}
.c-list li::marker{color:var(--amb)}
.c-cap{font-size:15px;color:var(--mu);text-align:center;margin-top:4px}
.c-note{font-size:17px;color:var(--mu)}
.c-svg{display:block;max-width:100%;height:auto}
/* mã */
.c-code{background:#1e1e1e;border:1px solid #2d2d2d;border-radius:10px;padding:12px 16px;font-family:"SF Mono",Menlo,monospace;
 font-size:16.5px;line-height:1.5;color:#d4d4d4;text-align:left;overflow:hidden;white-space:pre-wrap}
.c-code .hljs-keyword,.c-code .hljs-literal{color:#569cd6}.c-code .hljs-string{color:#ce9178}.c-code .hljs-number{color:#b5cea8}
.c-code .hljs-comment{color:#6a9955;font-style:italic}.c-code .hljs-title,.c-code .hljs-built_in{color:#dcdcaa}
.c-code .hljs-variable,.c-code .hljs-attr,.c-code .hljs-params,.c-code .hljs-property{color:#9cdcfe}
.c-code .hljs-meta{color:#c586c0}.c-code .hljs-subst{color:#d4d4d4}
.slide .bd .c-code code{background:none;padding:0;color:inherit;font-size:inherit;border-radius:0}
/* bản đồ tư duy */
.c-mm{position:relative;width:1168px;height:500px}
.c-mm svg{position:absolute;inset:0}
.c-mm .ctr{position:absolute;left:434px;top:195px;width:300px;height:110px;border-radius:20px;display:flex;flex-direction:column;
 align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#ff4d5e,#ff8a3d);
 color:#fff;font-weight:800;font-size:26px;line-height:1.2;box-shadow:0 10px 40px rgba(255,77,94,.35);padding:10px}
.c-mm .ctr small{font-size:15px;font-weight:600;opacity:.9;margin-top:4px}
.c-mm .br{position:absolute;width:330px;background:#141a25;border:1.5px solid var(--bd);border-left:6px solid var(--ac);
 border-radius:12px;padding:9px 13px}
.c-mm .br b{display:block;font-size:19px;color:#fff;margin-bottom:3px}
.c-mm .br span{display:block;font-size:15px;color:var(--mu);line-height:1.4}
/* lịch */
.c-cal{display:grid;grid-template-columns:90px repeat(7,1fr);gap:6px;font-size:15px}
.c-cal .h{color:var(--mu);font-weight:700;text-align:center;padding:4px 0}
.c-cal .w{color:var(--mu);font-weight:700;display:flex;align-items:center}
.c-cal .d{background:#141a24;border:1px solid #232c3c;border-radius:8px;min-height:52px;padding:5px 6px;display:flex;flex-direction:column;gap:3px}
.c-cal .d i{font-style:normal;font-size:13px;font-weight:700;border-radius:5px;padding:2px 5px;color:#0b0e14;background:var(--ac)}
/* cây thư mục */
.c-tree{font-family:"SF Mono",Menlo,monospace;font-size:17px;line-height:1.55;background:#11161f;border:1.5px solid var(--bd);
 border-radius:12px;padding:12px 18px;white-space:pre;color:#cfd8e6}
.c-tree .fo{color:#ffc233}.c-tree .fi{color:#9cdcfe}.c-tree .cm{color:#6a9955}
/* HUD máy quay */
.c-hud{position:relative;border-radius:14px;overflow:hidden;border:2px solid #2a3446}
.c-hud .scene{position:absolute;inset:0}
.c-hud .top,.c-hud .bot{position:absolute;left:0;right:0;display:flex;justify-content:space-between;gap:10px;padding:10px 14px;
 font-family:"SF Mono",Menlo,monospace;font-size:16px;color:#fff;text-shadow:0 1px 3px #000}
.c-hud .top{top:0;background:linear-gradient(#000a,transparent)}.c-hud .bot{bottom:0;background:linear-gradient(transparent,#000c)}
.c-hud .v{display:flex;flex-direction:column;align-items:center;line-height:1.15}
.c-hud .v small{font-size:11px;color:#b9c3d3;letter-spacing:.5px}
.c-hud .v.hi{color:#ffc233}
.c-hud .rec{display:flex;align-items:center;gap:7px;color:#fff}.c-hud .rec i{width:11px;height:11px;border-radius:50%;background:#ff4d5e}
.c-hud .grid{position:absolute;inset:0;background:
 linear-gradient(90deg,transparent calc(33.33% - 1px),rgba(255,255,255,.35) calc(33.33% - 1px) 33.33%,transparent 33.33% calc(66.66% - 1px),rgba(255,255,255,.35) calc(66.66% - 1px) 66.66%,transparent 66.66%),
 linear-gradient(transparent calc(33.33% - 1px),rgba(255,255,255,.35) calc(33.33% - 1px) 33.33%,transparent 33.33% calc(66.66% - 1px),rgba(255,255,255,.35) calc(66.66% - 1px) 66.66%,transparent 66.66%)}
/* giao diện phần mềm (wireframe) */
.c-ui{position:relative;background:#0f131a;border:2px solid #2a3446;border-radius:12px;overflow:hidden}
.c-ui .rg{position:absolute;border-radius:8px;border:1.5px solid;display:flex;flex-direction:column;align-items:center;
 justify-content:center;text-align:center;padding:4px 6px}
.c-ui .rg b{font-size:17px;color:#fff;line-height:1.2}.c-ui .rg small{font-size:13px;color:#c3cddc;line-height:1.3;margin-top:2px}
.c-ui .rg .no{position:absolute;top:5px;left:7px;width:24px;height:24px;border-radius:50%;background:#0b0e14;border:1.5px solid;
 font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center}
/* bánh xe màu */
.c-wheels{display:flex;gap:22px;justify-content:center}
.c-wheel{display:flex;flex-direction:column;align-items:center;gap:8px}
.c-wheel .r{width:170px;height:170px;border-radius:50%;position:relative;
 background:radial-gradient(circle,#2a2f3a 0 30%,transparent 72%),conic-gradient(from 90deg,#ff3b30,#ff9500,#ffcc00,#34c759,#00c7be,#007aff,#af52de,#ff2d55,#ff3b30);
 box-shadow:inset 0 0 0 8px #0d1017,0 0 0 2px #2a3446}
.c-wheel .r::after{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(20,24,32,.92) 0 38%,rgba(20,24,32,.25) 70%,transparent 72%)}
.c-wheel .pk{position:absolute;width:16px;height:16px;border-radius:50%;border:2.5px solid #fff;background:#0d1017;z-index:2;
 transform:translate(-50%,-50%);box-shadow:0 0 8px #000}
.c-wheel b{font-size:19px;color:#fff}.c-wheel small{font-size:14px;color:var(--mu);text-align:center;max-width:190px;line-height:1.3}
/* dải nhiệt độ màu */
.c-kel{position:relative;height:150px}
.c-kel .strip{position:absolute;left:0;right:0;top:56px;height:34px;border-radius:17px;
 background:linear-gradient(90deg,#ff7a1a,#ffa04d 18%,#ffd08a 34%,#fff1dc 48%,#ffffff 56%,#dcebff 68%,#a8ccff 84%,#7fb2ff)}
.c-kel .m{position:absolute;top:0;transform:translateX(-50%);text-align:center;width:170px}
.c-kel .m.b{top:98px}
.c-kel .m b{display:block;font-size:17px;color:#fff;font-family:"SF Mono",Menlo,monospace}
.c-kel .m span{display:block;font-size:14px;color:var(--mu);line-height:1.25}
.c-kel .m::after{content:"";position:absolute;left:50%;width:2px;height:12px;background:#fff9}
.c-kel .m:not(.b)::after{top:44px}.c-kel .m.b::after{top:-10px}
/* thanh thời lượng */
.c-seg{display:flex;height:74px;border-radius:12px;overflow:hidden;border:1.5px solid var(--bd)}
.c-seg>div{display:flex;flex-direction:column;justify-content:center;padding:0 12px;border-right:2px solid #0b0e14;min-width:0}
.c-seg>div b{font-size:17px;color:#0b0e14;line-height:1.2}.c-seg>div small{font-size:13.5px;color:#0b0e14cc;line-height:1.2}
.c-seg-ax{display:flex;justify-content:space-between;font-family:"SF Mono",Menlo,monospace;font-size:14px;color:var(--mu);margin-top:5px}
/* node màu */
.c-nodes{display:flex;align-items:center;gap:0}
.c-nodes .nd{width:150px;background:#1a202b;border:2px solid #3a4558;border-radius:10px;overflow:hidden;position:relative}
.c-nodes .nd .th{height:62px;background:var(--th,linear-gradient(135deg,#4b5563,#9ca3af))}
.c-nodes .nd .lb{font-size:15px;color:#fff;padding:6px 8px;line-height:1.25}
.c-nodes .nd .lb i{font-style:normal;font-family:"SF Mono",Menlo,monospace;color:#ffc233;font-size:13px;display:block}
.c-nodes .ln{width:34px;height:3px;background:#34d399;position:relative}
.c-nodes .ln::before,.c-nodes .ln::after{content:"";position:absolute;top:-4px;width:10px;height:10px;border-radius:50%;background:#34d399}
.c-nodes .ln::before{left:-5px}.c-nodes .ln::after{right:-5px}
/* thanh ngang */
.c-bars{display:flex;flex-direction:column;gap:9px}
.c-bars .r{display:grid;grid-template-columns:var(--lw,300px) 1fr;gap:12px;align-items:center}
.c-bars .l{font-size:17px;color:#d6deea;text-align:right;line-height:1.25}
.c-bars .l small{display:block;font-size:13px;color:var(--mu)}
.c-bars .tr{height:30px;background:#141a24;border-radius:8px;position:relative;border:1px solid #232c3c}
.c-bars .b{position:absolute;left:0;top:0;bottom:0;border-radius:7px;background:var(--ac)}
.c-bars .v{position:absolute;top:50%;transform:translateY(-50%);font-size:16px;font-weight:800;color:#fff;
 font-family:"SF Mono",Menlo,monospace;white-space:nowrap}
/* ảnh độ sâu trường ảnh */
.c-dof{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.c-dof .ph{position:relative;aspect-ratio:16/9;border-radius:12px;overflow:hidden;border:2px solid #2a3446}
.c-dof .bgl{position:absolute;inset:-12px}
.c-dof .fg{position:absolute;left:0;right:0;bottom:0;height:92%}
.c-dof .lab{position:absolute;left:10px;top:10px;font-family:"SF Mono",Menlo,monospace;font-size:17px;color:#fff;
 background:#000a;padding:3px 10px;border-radius:6px}
</style>`;

/* ────────────────────────── KHUNG DECK & BÌA ────────────────────────── */
/** Bọc mảng slide: chèn theme vào body từng slide. */
export const S = (slides) => slides.map((s) => ({ ...s, body: CSS + (s.body || '') }));

/** Slide bìa. chap: 'CHƯƠNG 5' | 'MỤC 0' … */
export const cover = ({ t, sub, chap, meta = 'Content Creator · cuongthai.com' }) => ({
  kind: 'cover', t, sub,
  body: `<div class="c-cov">${chap ? `<span class="chip"><i></i>${chap}</span>` : ''}<span class="meta">${meta}</span></div>`,
});

/* ─────────────────────────── KHỐI HTML CƠ BẢN ─────────────────────────── */
/** cards([{ic, t, d, c, big}], cols) — c: màu red|ora|amb|grn|tea|blu|vio|pnk */
export const cards = (items, cols = items.length > 4 ? 3 : items.length) =>
  `<div class="c-grid g${cols}">${items.map((x, i) => `<div class="c-card ${x.c || ACC[(i + 5) % 8]}">` +
    `${x.ic ? `<span class="ic">${x.ic}</span>` : ''}${x.big ? `<span class="big">${x.big}</span>` : ''}` +
    `<b>${x.t}</b>${x.d ? `<p>${x.d}</p>` : ''}</div>`).join('')}</div>`;

/** box('tip'|'warn'|'bad'|'good'|'info', html, icon?) */
export const box = (kind, html, ic) => {
  const I = { tip: '💡', warn: '⚠️', bad: '⛔', good: '✅', info: 'ℹ️' };
  return `<div class="c-box ${kind}"><span class="i">${ic || I[kind] || '•'}</span><div>${html}</div></div>`;
};

/** steps([html | [html, small]], {row, colors}) */
export const steps = (items, { row = false } = {}) =>
  `<div class="c-steps${row ? ' row' : ''}">${items.map((x, i) => {
    const [h, sm] = Array.isArray(x) ? x : [x];
    return `<div class="s ${ACC[(i + 2) % 8]}"><span class="n">${i + 1}</span><div>${h}${sm ? `<small>${sm}</small>` : ''}</div></div>`;
  }).join('')}</div>`;

/** table(head[], rows[][], {sm, center:[colIdx]}) — ô bắt đầu bằng "!" = tô vàng, "+" = xanh, "-" = đỏ */
export const table = (head, rows, { sm = false, center = [] } = {}) => {
  const cell = (v, j, tag = 'td') => {
    let s = String(v ?? ''), cls = [];
    if (tag === 'td') {
      if (s.startsWith('!')) { cls.push('hl'); s = s.slice(1); }
      else if (s.startsWith('+')) { cls.push('ok'); s = s.slice(1); }
      else if (s.startsWith('-') && !/^-\d/.test(s)) { cls.push('no'); s = s.slice(1); }
    }
    if (center.includes(j)) cls.push('c');
    return `<${tag}${cls.length ? ` class="${cls.join(' ')}"` : ''}>${s}</${tag}>`;
  };
  return `<table class="c-t${sm ? ' sm' : ''}"><tr>${head.map((h, j) => cell(h, j, 'th')).join('')}</tr>` +
    rows.map((r) => `<tr>${r.map((v, j) => cell(v, j)).join('')}</tr>`).join('') + `</table>`;
};

/** vs({no:{t, items[]}, yes:{t, items[]}}) — cột sai / cột đúng */
export const vs = ({ no, yes }) =>
  `<div class="c-vs"><div class="no"><h4>❌ ${no.t}</h4><ul>${no.items.map((x) => `<li>${x}</li>`).join('')}</ul></div>` +
  `<div class="yes"><h4>✅ ${yes.t}</h4><ul>${yes.items.map((x) => `<li>${x}</li>`).join('')}</ul></div></div>`;

/** kpis([{v, l, c}]) — số to + nhãn */
export const kpis = (items) =>
  `<div class="c-kpis">${items.map((x, i) => `<div class="k ${x.c || ACC[(i + 2) % 8]}"><b>${x.v}</b><span>${x.l}</span></div>`).join('')}</div>`;

/** flow([{e, t, d, c}]) — chuỗi bước ngang có mũi tên */
export const flow = (items) =>
  `<div class="c-flow">${items.map((x, i) => `<div class="f ${x.c || ACC[i % 8]}">${x.e ? `<span class="e">${x.e}</span>` : ''}` +
    `<b>${x.t}</b>${x.d ? `<small>${x.d}</small>` : ''}</div>`).join('')}</div>`;

export const tag = (t, c = '') => `<span class="c-tag ${c}">${t}</span>`;
export const quote = (t, who) => `<div class="c-quote">${t}${who ? `<small>— ${who}</small>` : ''}</div>`;
export const two = (a, b, v = '') => `<div class="c-two ${v}"><div>${a}</div><div>${b}</div></div>`;
export const list = (items) => `<ul class="c-list">${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
export const cap = (t) => `<p class="c-cap">${t}</p>`;
export const note = (t) => `<p class="c-note">${t}</p>`;

/** Khối mã tô màu kiểu VS Code. lang: bash | javascript | json | plaintext … */
export const code = (src, lang = 'bash') => {
  const html = lang === 'plaintext' ? esc(src) : hljs.highlight(src, { language: lang }).value;
  return `<pre class="c-code"><code>${html}</code></pre>`;
};

/** tree(`lines`) — cây thư mục. Dòng kết thúc bằng "/" là thư mục; "# ..." là chú thích. */
export const tree = (src) => `<div class="c-tree">${src.split('\n').map((ln) => {
  const [a, ...c] = ln.split('#');
  const cm = c.length ? `<span class="cm">#${esc(c.join('#'))}</span>` : '';
  const m = a.match(/^(\s*(?:[│├└─ ]*))(.*?)(\s*)$/);
  const name = m[2];
  const cls = /\/$/.test(name) ? 'fo' : 'fi';
  const icon = cls === 'fo' ? '📁 ' : (name ? '🎞 ' : '');
  return `${esc(m[1])}${name ? `<span class="${cls}">${icon}${esc(name)}</span>` : ''}${m[3]}${cm}`;
}).join('\n')}</div>`;

/** mindmap(center, sub, branches[{t, d, c}]) — tối đa 6 nhánh (3 trái, 3 phải). */
export const mindmap = (center, sub, branches) => {
  const pos = [[36, 20], [36, 190], [36, 360], [802, 20], [802, 190], [802, 360]];
  const order = branches.length <= 4 ? [0, 2, 3, 5] : [0, 1, 2, 3, 4, 5];
  let svg = `<svg viewBox="0 0 1168 500" width="1168" height="500">`;
  let boxes = '';
  branches.forEach((b, i) => {
    const [x, y] = pos[order[i]];
    const left = x < 500;
    const bx = left ? x + 330 : x, by = y + 50;
    const cx = left ? 434 : 734, cy = 250;
    const cc = col(b.c, i);
    svg += `<path d="M${cx} ${cy} C ${left ? cx - 50 : cx + 50} ${cy}, ${left ? bx + 60 : bx - 60} ${by}, ${bx} ${by}" stroke="${cc}" stroke-width="3" fill="none" opacity=".8"/>`;
    svg += `<circle cx="${bx}" cy="${by}" r="5" fill="${cc}"/>`;
    boxes += `<div class="br" style="left:${x}px;top:${y}px;--ac:${cc}"><b>${b.t}</b>${b.d ? `<span>${b.d}</span>` : ''}</div>`;
  });
  svg += `</svg>`;
  return `<div class="c-mm">${svg}<div class="ctr">${center}${sub ? `<small>${sub}</small>` : ''}</div>${boxes}</div>`;
};

/** calendar(weeks[{w, days:[[{t,c}]...7]}]) — lịch nội dung */
export const calendar = (weeks, heads = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']) =>
  `<div class="c-cal"><div></div>${heads.map((h) => `<div class="h">${h}</div>`).join('')}` +
  weeks.map((wk) => `<div class="w">${wk.w}</div>` + wk.days.map((d) =>
    `<div class="d">${(d || []).map((x) => `<i style="--ac:${col(x.c)}">${x.t}</i>`).join('')}</div>`).join('')).join('') + `</div>`;

/** kelvin(marks[{k, t, below}]) — dải nhiệt độ màu 1500K → 10000K */
export const kelvin = (marks) => {
  const pct = (k) => ((Math.log(k) - Math.log(1500)) / (Math.log(10000) - Math.log(1500))) * 100;
  return `<div class="c-kel"><div class="strip"></div>${marks.map((m) =>
    `<div class="m${m.below ? ' b' : ''}" style="left:${pct(m.k).toFixed(1)}%"><b>${m.k}K</b><span>${m.t}</span></div>`).join('')}</div>`;
};

/** wheels([{t, d, x, y}]) — bánh xe màu Lift/Gamma/Gain; x,y ∈ [-1,1] là vị trí núm */
export const wheels = (items) => `<div class="c-wheels">${items.map((w) =>
  `<div class="c-wheel"><div class="r"><span class="pk" style="left:${50 + (w.x || 0) * 38}%;top:${50 - (w.y || 0) * 38}%"></span></div>` +
  `<b>${w.t}</b>${w.d ? `<small>${w.d}</small>` : ''}</div>`).join('')}</div>`;

/** seg([{t, d, w, c}], axis[]) — thanh chia đoạn thời lượng (w = độ rộng tương đối) */
export const seg = (parts, axis) => `<div class="c-seg">${parts.map((p, i) =>
  `<div style="flex:${p.w || 1};background:${col(p.c, i)}"><b>${p.t}</b>${p.d ? `<small>${p.d}</small>` : ''}</div>`).join('')}</div>` +
  (axis ? (() => {
    const tot = parts.reduce((a, p) => a + (p.w || 1), 0);
    let acc = 0;
    const xs = [0, ...parts.map((p) => (acc += (p.w || 1)) / tot * 100)];
    return `<div class="c-seg-ax" style="position:relative;height:20px">${axis.map((a, i) => a ? `<span style="position:absolute;left:${xs[i].toFixed(2)}%;transform:translateX(${i === 0 ? '0' : i === xs.length - 1 ? '-100%' : '-50%'})">${a}</span>` : '').join('')}</div>`;
  })() : '');

/** nodes([{n, t, th}]) — chuỗi node kiểu DaVinci Resolve; th = CSS background của ảnh thu nhỏ */
export const nodes = (items) => `<div class="c-nodes">${items.map((x, i) =>
  `${i ? '<span class="ln"></span>' : ''}<div class="nd" style="${x.th ? `--th:${x.th}` : ''}"><div class="th"></div>` +
  `<div class="lb"><i>${String(x.n ?? i + 1).padStart(2, '0')}</i>${x.t}</div></div>`).join('')}</div>`;

/** bars([{l, sub, v, max?, txt, c}], {lw}) — thanh ngang tỉ lệ */
export const bars = (items, { lw = 300, max } = {}) => {
  const M = max || Math.max(...items.map((x) => x.v));
  return `<div class="c-bars" style="--lw:${lw}px">${items.map((x, i) => {
    const w = Math.max(2, (x.v / M) * 100);
    const inside = w > 30;
    return `<div class="r"><div class="l">${x.l}${x.sub ? `<small>${x.sub}</small>` : ''}</div><div class="tr">` +
      `<div class="b" style="width:${w.toFixed(1)}%;--ac:${col(x.c, i + 2)}"></div>` +
      `<span class="v" style="${inside ? `left:12px` : `left:calc(${w.toFixed(1)}% + 10px)`}">${x.txt ?? x.v}</span></div></div>`;
  }).join('')}</div>`;
};

/** hud({w, h, top:[{k,v,hi}], bot:[…], scene, grid, rec}) — màn hình máy quay với thông số */
export const hud = ({ w = 560, h = 315, top = [], bot = [], scene, grid = true, rec = true }) => {
  const item = (x) => typeof x === 'string' ? `<span>${x}</span>` : `<span class="v${x.hi ? ' hi' : ''}">${x.v}<small>${x.k}</small></span>`;
  return `<div class="c-hud" style="width:${w}px;height:${h}px">` +
    `<div class="scene">${scene || personShot({ w, h, size: 'MS', at: 0.5 })}</div>` +
    `${grid ? '<div class="grid"></div>' : ''}` +
    `<div class="top">${rec ? '<span class="rec"><i></i>REC 00:02:17</span>' : ''}${top.map(item).join('')}</div>` +
    `<div class="bot">${bot.map(item).join('')}</div></div>`;
};

/** ui({w, h, regions:[{n, t, d, x, y, w, h, c}]}) — khung giao diện phần mềm (toạ độ theo %) */
export const ui = ({ w = 1100, h = 460, title, regions }) =>
  `<div class="c-ui" style="width:${w}px;height:${h}px">` +
  (title ? `<div style="position:absolute;left:0;right:0;top:0;height:26px;background:#1a202b;border-bottom:1px solid #2a3446;font-size:13px;color:#8f9bb0;display:flex;align-items:center;padding-left:12px;gap:7px"><i style="width:10px;height:10px;border-radius:50%;background:#ff5f57"></i><i style="width:10px;height:10px;border-radius:50%;background:#febc2e"></i><i style="width:10px;height:10px;border-radius:50%;background:#28c840"></i><span style="margin-left:8px">${title}</span></div>` : '') +
  regions.map((r, i) => {
    const cc = col(r.c, i);
    return `<div class="rg" style="left:${r.x}%;top:calc(${r.y}% + ${title ? 26 * (1 - r.y / 100) : 0}px);width:${r.w}%;height:calc(${r.h}% - ${title ? 26 * r.h / 100 : 0}px);` +
      `border-color:${cc};background:${cc}1f">${r.n != null ? `<span class="no" style="border-color:${cc};color:${cc}">${r.n}</span>` : ''}<b>${r.t}</b>${r.d ? `<small>${r.d}</small>` : ''}</div>`;
  }).join('') + `</div>`;

/* ─────────────────────────────── HÌNH NGƯỜI ─────────────────────────────── */
/**
 * figure() — một người đứng, toạ độ riêng: cao 200 đơn vị (đỉnh đầu y≈1, mắt y≈17.5,
 * vai y≈44, thắt lưng y≈106, chân y=200), tâm x=0.
 */
export const figure = ({ skin = '#f0c29e', hair = '#231c1a', shirt = '#3b82f6', pants = '#1f2937', shoe = '#0f172a' } = {}) => `
<g>
 <path d="M-15.5 104 L-13.5 195 L-2.5 195 L-1 120 L1 120 L2.5 195 L13.5 195 L15.5 104 Z" fill="${pants}"/>
 <rect x="-17" y="192" width="15.5" height="8" rx="3.5" fill="${shoe}"/><rect x="1.5" y="192" width="15.5" height="8" rx="3.5" fill="${shoe}"/>
 <path d="M-23.5 45 Q-33 58 -31.5 104 L-24.5 104 Q-24.5 72 -18 57 Z" fill="${shirt}" style="filter:brightness(.88)"/>
 <path d="M23.5 45 Q33 58 31.5 104 L24.5 104 Q24.5 72 18 57 Z" fill="${shirt}" style="filter:brightness(.88)"/>
 <ellipse cx="-28" cy="108.5" rx="4.6" ry="5.2" fill="${skin}"/><ellipse cx="28" cy="108.5" rx="4.6" ry="5.2" fill="${skin}"/>
 <path d="M-24 44.5 Q0 36.5 24 44.5 L18.5 108 L-18.5 108 Z" fill="${shirt}"/>
 <path d="M-6 38.5 L0 46 L6 38.5" fill="none" stroke="#0005" stroke-width="1.4"/>
 <rect x="-5.5" y="29" width="11" height="12" rx="3" fill="${skin}" style="filter:brightness(.93)"/>
 <ellipse cx="-13.2" cy="18.5" rx="2" ry="3.4" fill="${skin}"/><ellipse cx="13.2" cy="18.5" rx="2" ry="3.4" fill="${skin}"/>
 <ellipse cx="0" cy="18" rx="12.8" ry="15.8" fill="${skin}"/>
 <path d="M-13.4 16.5 Q-14.5 0.5 0 0.8 Q14.5 0.5 13.4 16.5 Q11 7.2 2 8.4 Q-3 5.5 -8 8.6 Q-11.5 10.5 -13.4 16.5 Z" fill="${hair}"/>
 <path d="M-7.6 13.2 Q-5 12 -2.6 12.9 M2.6 12.9 Q5 12 7.6 13.2" stroke="${hair}" stroke-width="1.15" fill="none" stroke-linecap="round"/>
 <ellipse cx="-4.9" cy="17.4" rx="1.75" ry="2" fill="#1d1715"/><ellipse cx="4.9" cy="17.4" rx="1.75" ry="2" fill="#1d1715"/>
 <circle cx="-4.4" cy="16.7" r=".55" fill="#fff"/><circle cx="5.4" cy="16.7" r=".55" fill="#fff"/>
 <path d="M-.2 19 Q-1.6 22.3 .9 22.7" stroke="#d9a07c" stroke-width=".7" fill="none" stroke-linecap="round"/>
 <path d="M-3.6 26 Q0 28.4 3.6 26" stroke="#a24d3e" stroke-width="1.2" fill="none" stroke-linecap="round"/>
</g>`;

/** Bối cảnh quanh người (bầu trời, núi xa, cây, đường) — để cỡ cảnh rộng có "môi trường". */
const world = (id) => `
<defs><linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2a4a"/><stop offset=".7" stop-color="#3a5a8a"/><stop offset="1" stop-color="#e7a46b"/></linearGradient>
<linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f4a3a"/><stop offset="1" stop-color="#1b2b22"/></linearGradient></defs>
<rect x="-2000" y="-1200" width="4000" height="1400" fill="url(#${id}s)"/>
<circle cx="420" cy="40" r="46" fill="#ffd59a" opacity=".9"/>
<path d="M-2000 200 L-1400 60 L-1000 150 L-640 20 L-300 140 L-60 70 L260 150 L620 30 L1000 150 L1500 60 L2000 200 Z" fill="#2c3f5c" opacity=".85"/>
<path d="M-2000 200 L-1200 130 L-700 190 L-200 120 L300 185 L800 125 L1300 190 L2000 140 L2000 200 Z" fill="#26384f"/>
<rect x="-2000" y="200" width="4000" height="700" fill="url(#${id}g)"/>
<path d="M-120 900 L-26 200 L26 200 L120 900 Z" fill="#3a3f4a" opacity=".55"/>
<g transform="translate(150 200)"><rect x="-5" y="-70" width="10" height="70" fill="#4a3526"/><circle cx="0" cy="-92" r="36" fill="#2f6b45"/><circle cx="-22" cy="-74" r="24" fill="#2a5e3d"/><circle cx="24" cy="-72" r="26" fill="#2a5e3d"/></g>
<g transform="translate(-230 200)"><rect x="-60" y="-120" width="120" height="120" fill="#394760"/><rect x="-60" y="-132" width="120" height="14" fill="#2b3549"/>
${[0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${-46 + c * 34}" y="${-108 + r * 36}" width="22" height="24" fill="${(r + c) % 2 ? '#ffd27a' : '#1e2638'}"/>`).join('')).join('')}</g>`;

/** Vùng cắt (toạ độ figure) cho từng cỡ cảnh: [chiều cao vùng, tâm-y của mắt tính theo tỉ lệ khung] */
export const SHOT = {
  ECU: { h: 17, eye: 0.5, vi: 'Đặc tả', en: 'Extreme close-up' },
  CU: { h: 46, eye: 0.42, vi: 'Cận cảnh', en: 'Close-up' },
  MCU: { h: 78, eye: 0.33, vi: 'Cận trung', en: 'Medium close-up' },
  MS: { h: 122, eye: 0.3, vi: 'Trung cảnh', en: 'Medium shot' },
  MWS: { h: 172, eye: 0.24, vi: 'Trung toàn (cowboy)', en: 'Medium wide / cowboy' },
  WS: { h: 250, eye: 0.17, vi: 'Toàn cảnh', en: 'Wide / full shot' },
  EWS: { h: 900, eye: 0.47, vi: 'Đại cảnh', en: 'Extreme wide' },
};

/**
 * personShot({w, h, size, at, eyeAt, ratio}) — "ảnh" một người ở cỡ cảnh `size`, đặt tâm người
 * ở vị trí ngang `at` (0..1) của khung. Trả về <svg> vừa khít w×h.
 */
export const personShot = ({ w = 480, h = 270, size = 'MS', at = 0.5, eyeAt, shirt, bg = true } = {}) => {
  const id = uid('w');
  const sh = SHOT[size] || SHOT.MS;
  const ch = sh.h, cw = ch * (w / h);
  const ey = eyeAt ?? sh.eye;
  const minX = -at * cw, minY = 17.4 - ey * ch;
  return `<svg class="c-svg" viewBox="${minX.toFixed(2)} ${minY.toFixed(2)} ${cw.toFixed(2)} ${ch.toFixed(2)}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice">` +
    `${bg ? world(id) : ''}${figure({ shirt })}</svg>`;
};

/** shotLadder(sizes, {cols, w}) — bảng các cỡ cảnh cạnh nhau */
export const shotLadder = (sizes = ['ECU', 'CU', 'MCU', 'MS', 'MWS', 'WS', 'EWS'], { cols = 4, w = 270, lang = 'vi' } = {}) => {
  const h = Math.round(w * 9 / 16);
  return `<div style="display:grid;grid-template-columns:repeat(${cols},${w}px);gap:14px 16px;justify-content:center">` +
    sizes.map((s, i) => `<div><div style="border-radius:10px;overflow:hidden;border:2px solid ${col(null, i)};width:${w}px;height:${h}px">` +
      personShot({ w, h, size: s }) + `</div><div style="margin-top:5px;font-size:16px;line-height:1.25"><b style="color:${col(null, i)};font-family:'SF Mono',Menlo,monospace">${s}</b> ` +
      `<span style="color:#e9eef6">${lang === 'vi' ? SHOT[s].vi : SHOT[s].en}</span></div></div>`).join('') + `</div>`;
};

/**
 * frame({w, ratio, size, at, eyeAt, thirds, verdict, label, head, look}) — khung ngắm để dạy bố cục.
 *   verdict: 'good' | 'bad' | undefined   head: true → mũi tên khoảng trống đầu
 */
export const frame = ({ w = 420, ratio = '16:9', size = 'MS', at = 0.5, eyeAt, thirds = true, verdict, label, head = false, shirt } = {}) => {
  const [rw, rh] = ratio.split(':').map(Number);
  const h = Math.round(w * rh / rw);
  const vcol = verdict === 'good' ? C.grn : verdict === 'bad' ? C.red : '#3a4558';
  const sh = SHOT[size] || SHOT.MS;
  const ey = eyeAt ?? sh.eye;
  const headTopPx = ((1 - (17.4 - ey * sh.h)) / sh.h) * h; // y của đỉnh đầu (figure y=1) trong khung
  let over = '';
  if (thirds) {
    over += [1, 2].map((k) => `<line x1="${(w * k / 3).toFixed(1)}" y1="0" x2="${(w * k / 3).toFixed(1)}" y2="${h}" stroke="#fff" stroke-opacity=".45" stroke-width="1.5" stroke-dasharray="6 5"/>` +
      `<line x1="0" y1="${(h * k / 3).toFixed(1)}" x2="${w}" y2="${(h * k / 3).toFixed(1)}" stroke="#fff" stroke-opacity=".45" stroke-width="1.5" stroke-dasharray="6 5"/>`).join('');
    over += [1, 2].map((a) => [1, 2].map((b) => `<circle cx="${(w * a / 3).toFixed(1)}" cy="${(h * b / 3).toFixed(1)}" r="4.5" fill="#ffc233"/>`).join('')).join('');
  }
  if (head && headTopPx > 28) {
    const x = Math.min(w - 26, at * w + w * 0.14);
    over += `<line x1="${x}" y1="3" x2="${x}" y2="${headTopPx - 2}" stroke="#ffc233" stroke-width="2.5"/>` +
      `<path d="M${x - 6} 9 L${x} 2 L${x + 6} 9 M${x - 6} ${headTopPx - 8} L${x} ${headTopPx - 1} L${x + 6} ${headTopPx - 8}" stroke="#ffc233" stroke-width="2.5" fill="none"/>`;
  }
  const badge = verdict ? `<g transform="translate(${w - 26} 26)"><circle r="18" fill="${vcol}"/><text y="7" text-anchor="middle" font-size="22" font-weight="800" fill="#0b0e14" font-family="-apple-system,Arial">${verdict === 'good' ? '✓' : '✕'}</text></g>` : '';
  return `<div style="width:${w}px"><div style="position:relative;width:${w}px;height:${h}px;border-radius:10px;overflow:hidden;border:2.5px solid ${vcol}">` +
    personShot({ w, h, size, at, eyeAt, shirt }) +
    `<svg style="position:absolute;inset:0" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${over}${badge}</svg></div>` +
    (label ? `<div style="font-size:16px;color:#d6deea;margin-top:6px;line-height:1.3;text-align:center">${label}</div>` : '') + `</div>`;
};

/* ─────────────────────────────── SVG MINH HOẠ ─────────────────────────────── */
const T = (x, y, s, { size = 16, fill = C.tx, anchor = 'start', weight = 400, mono = false, op } = {}) =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}"` +
  ` font-family="${mono ? "'SF Mono',Menlo,monospace" : "-apple-system,'Segoe UI',Arial,sans-serif"}"${op ? ` opacity="${op}"` : ''}>${esc(s)}</text>`;

/** Số giả ngẫu nhiên ổn định (để hình không đổi mỗi lần render). */
const rng = (seed = 7) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

/** exposureTriangle({lang}) — tam giác phơi sáng */
export const exposureTriangle = ({ w = 620, vx } = {}) => {
  const P = [[310, 112], [110, 382], [510, 382]];
  vx = vx || [
    { c: C.amb, t: 'KHẨU ĐỘ', s: 'f/1.8 sáng ⇄ f/11 tối', e: 'Xoá phông (độ sâu trường ảnh)' },
    { c: C.blu, t: 'MÀN TRẬP', s: '1/25 sáng ⇄ 1/2000 tối', e: 'Nhoè chuyển động' },
    { c: C.pnk, t: 'ISO', s: '100 sạch ⇄ 6400 nhiễu', e: 'Nhiễu hạt' },
  ];
  let s = `<svg class="c-svg" viewBox="0 0 620 500" width="${w}">`;
  s += `<defs><linearGradient id="etg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.amb}"/><stop offset=".5" stop-color="${C.blu}"/><stop offset="1" stop-color="${C.pnk}"/></linearGradient></defs>`;
  s += `<path d="M${P[0]} L${P[1]} L${P[2]} Z" fill="rgba(255,255,255,.03)" stroke="url(#etg)" stroke-width="5" stroke-linejoin="round"/>`;
  s += T(310, 300, 'PHƠI SÁNG', { size: 30, anchor: 'middle', weight: 800, fill: '#fff' });
  s += T(310, 328, 'đủ sáng = cân 3 đỉnh', { size: 17, anchor: 'middle', fill: C.mu });
  vx.forEach((v, i) => {
    const [x, y] = P[i];
    s += `<circle cx="${x}" cy="${y}" r="30" fill="#0d1017" stroke="${v.c}" stroke-width="4"/>`;
    s += T(x, y + 8, ['ƒ', '⏱', 'ISO'][i], { size: i === 2 ? 17 : 24, anchor: 'middle', weight: 800, fill: v.c });
    if (i === 0) {
      s += T(x, 26, v.t, { size: 20, anchor: 'middle', weight: 800, fill: v.c });
      s += T(x, 48, v.e, { size: 15, anchor: 'middle', fill: '#e9eef6' });
      s += T(x, 68, v.s, { size: 13.5, anchor: 'middle', fill: C.mu, mono: true });
    } else {
      s += T(x, y + 54, v.t, { size: 20, anchor: 'middle', weight: 800, fill: v.c });
      s += T(x, y + 76, v.e, { size: 15, anchor: 'middle', fill: '#e9eef6' });
      s += T(x, y + 96, v.s, { size: 13.5, anchor: 'middle', fill: C.mu, mono: true });
    }
  });
  return s + `</svg>`;
};

/** shutterDemo(rows[{t, blur, c, d}]) — quả bóng chuyển động ở các tốc độ màn trập */
export const shutterDemo = (rows = [
  { t: '1/50 (quy tắc 180° ở 25fps)', blur: 46, c: C.grn, d: 'Nhoè vừa phải — chuyển động mượt như mắt thấy' },
  { t: '1/1000', blur: 0, c: C.amb, d: 'Sắc cạnh từng khung — chuyển động giật, "lạch cạch"' },
  { t: '1/25', blur: 120, c: C.red, d: 'Nhoè quá mức — mờ bệt, mất chi tiết' },
], { w = 1100 } = {}) => {
  const H = rows.length * 110;
  let s = `<svg class="c-svg" viewBox="0 0 1100 ${H}" width="${w}">`;
  rows.forEach((r, i) => {
    const y = i * 110 + 12;
    s += `<rect x="0" y="${y}" width="560" height="88" rx="12" fill="#121821" stroke="#2a3446"/>`;
    s += `<defs><linearGradient id="sb${i}" x1="0" x2="1"><stop offset="0" stop-color="${r.c}" stop-opacity="0"/><stop offset="1" stop-color="${r.c}" stop-opacity=".95"/></linearGradient></defs>`;
    const cx = 380;
    if (r.blur) s += `<rect x="${cx - r.blur}" y="${y + 22}" width="${r.blur}" height="44" rx="22" fill="url(#sb${i})"/>`;
    s += `<circle cx="${cx}" cy="${y + 44}" r="22" fill="${r.c}"/>`;
    if (!r.blur) [120, 200, 280].forEach((gx) => { s += `<circle cx="${gx}" cy="${y + 44}" r="22" fill="none" stroke="${r.c}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="4 4"/>`; });
    s += T(470, y + 50, '→', { size: 26, fill: C.mu });
    s += T(590, y + 38, r.t, { size: 21, weight: 800, fill: r.c, mono: true });
    s += T(590, y + 66, r.d, { size: 17, fill: '#d6deea' });
  });
  return s + `</svg>`;
};

/**
 * timeline({len, tracks:[{id, a, clips:[{s, e, t, c}]}], play, marks:[{s, t, c}], w, braces:[{s,e,y,t}]})
 * — khung timeline của phần mềm dựng. a:true = track âm thanh (vẽ sóng âm).
 */
export const timeline = ({ len = 60, tracks, play, marks = [], w = 1160, step, braces = [] }) => {
  const L = 76, R = 10, rh = 30;
  const th = (t) => (t.a ? 46 : 50);
  const H = rh + tracks.reduce((a, t) => a + th(t) + 6, 0) + 10 + (braces.length ? 36 : 0);
  const px = (t) => L + (t / len) * (w - L - R);
  step = step || (len <= 20 ? 2 : len <= 60 ? 5 : len <= 180 ? 15 : 30);
  const tc = (t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  let s = `<svg class="c-svg" viewBox="0 0 ${w} ${H}" width="${w}"><rect width="${w}" height="${H}" rx="12" fill="#0f131a" stroke="#2a3446"/>`;
  s += `<rect x="${L}" y="0" width="${w - L}" height="${rh}" fill="#161c26"/>`;
  for (let t = 0; t <= len; t += step) {
    s += `<line x1="${px(t)}" y1="${rh - 9}" x2="${px(t)}" y2="${rh}" stroke="#56627a"/>`;
    if (t < len) s += T(px(t) + 4, 17, tc(t), { size: 12, fill: '#8f9bb0', mono: true });
  }
  marks.forEach((m) => { s += `<path d="M${px(m.s) - 6} 3 h12 v10 l-6 6 l-6 -6 Z" fill="${col(m.c)}"/>` + (m.t ? T(px(m.s) + 9, 13, m.t, { size: 12, fill: col(m.c), weight: 700 }) : ''); });
  let y = rh + 6;
  tracks.forEach((tr, ti) => {
    const hh = th(tr);
    s += `<rect x="6" y="${y}" width="${L - 12}" height="${hh}" rx="6" fill="#1a202b" stroke="#2a3446"/>`;
    s += T(L / 2, y + hh / 2 + 6, tr.id, { size: 16, anchor: 'middle', weight: 800, fill: tr.a ? '#7ff0c4' : '#bcd7ff', mono: true });
    s += `<rect x="${L}" y="${y}" width="${w - L - R}" height="${hh}" fill="${ti % 2 ? '#121720' : '#10151d'}"/>`;
    tr.clips.forEach((c, ci) => {
      const x1 = px(c.s), x2 = px(c.e), cc = col(c.c, tr.a ? 3 : ci + 5);
      const cid = uid('cl');
      s += `<clipPath id="${cid}"><rect x="${x1}" y="${y + 3}" width="${Math.max(2, x2 - x1)}" height="${hh - 6}" rx="6"/></clipPath>`;
      s += `<rect x="${x1}" y="${y + 3}" width="${Math.max(2, x2 - x1)}" height="${hh - 6}" rx="6" fill="${cc}" fill-opacity="${tr.a ? .28 : .78}" stroke="${cc}" stroke-width="1.5"/>`;
      if (tr.a) {
        const r = rng(ci * 31 + ti * 7 + 3);
        let d = '';
        const mid = y + hh / 2;
        for (let x = x1 + 3; x < x2 - 2; x += 3) {
          const quiet = c.quiet && c.quiet.some(([a, b]) => x >= px(a) && x <= px(b));
          const amp = quiet ? 1 + r() * 1.5 : 3 + r() * (hh / 2 - 8);
          d += `M${x.toFixed(1)} ${(mid - amp).toFixed(1)} V${(mid + amp).toFixed(1)} `;
        }
        s += `<path d="${d}" stroke="${cc}" stroke-width="1.6" clip-path="url(#${cid})"/>`;
      }
      if (c.t) {
        const lw = Math.min(x2 - x1 - 8, c.t.length * 7.6 + 12);
        if (tr.a && lw > 10) s += `<rect x="${x1 + 4}" y="${y + 5}" width="${lw}" height="18" rx="4" fill="#0b0e14" opacity=".72" clip-path="url(#${cid})"/>`;
        s += `<g clip-path="url(#${cid})">${T(x1 + 9, y + (tr.a ? 18.5 : hh / 2 + 6), c.t, { size: 14, weight: 700, fill: '#fff' })}</g>`;
      }
    });
    y += hh + 6;
  });
  braces.forEach((b) => {
    const x1 = px(b.s), x2 = px(b.e), by = H - 30;
    s += `<path d="M${x1} ${by} v8 H${x2} v-8" stroke="${col(b.c || 'amb')}" stroke-width="2.5" fill="none"/>`;
    s += T((x1 + x2) / 2, by + 26, b.t, { size: 15, anchor: 'middle', weight: 700, fill: col(b.c || 'amb') });
  });
  if (play != null) {
    s += `<line x1="${px(play)}" y1="${rh - 2}" x2="${px(play)}" y2="${H - 6 - (braces.length ? 36 : 0)}" stroke="${C.red}" stroke-width="2.5"/>`;
    s += `<path d="M${px(play) - 8} ${rh - 12} h16 v6 l-8 8 l-8 -8 Z" fill="${C.red}"/>`;
  }
  return s + `</svg>`;
};

/**
 * lightPlot({lights:[{k, x, y, t, c}], cam:{x,y}, subj:{x,y}, w, bg}) — sơ đồ đèn nhìn từ trên xuống
 *   k: 'soft' (softbox) | 'led' (đèn nhỏ) | 'window' | 'bounce' (tấm hắt) | 'practical' (đèn trang trí)
 *   toạ độ trong khung 600×420.
 */
export const lightPlot = ({ lights, cam = { x: 300, y: 385 }, subj = { x: 300, y: 190 }, w = 560, wall = true } = {}) => {
  let s = `<svg class="c-svg" viewBox="0 0 600 420" width="${w}"><rect width="600" height="420" rx="14" fill="#0f131a" stroke="#2a3446"/>`;
  s += `<defs>${lights.map((l, i) => `<radialGradient id="lb${i}" cx="0" cy=".5" r="1"><stop offset="0" stop-color="${col(l.c || 'amb')}" stop-opacity=".55"/><stop offset="1" stop-color="${col(l.c || 'amb')}" stop-opacity="0"/></radialGradient>`).join('')}</defs>`;
  if (wall) s += `<rect x="20" y="16" width="560" height="10" rx="3" fill="#2a3446"/>` + T(300, 46, 'TƯỜNG / NỀN', { size: 12, anchor: 'middle', fill: C.dim, weight: 700 });
  lights.forEach((l, i) => {
    const cc = col(l.c || 'amb');
    const ang = Math.atan2(subj.y - l.y, subj.x - l.x);
    const deg = (ang * 180) / Math.PI;
    const dist = Math.hypot(subj.x - l.x, subj.y - l.y);
    if (l.k !== 'practical') {
      const spread = l.k === 'soft' || l.k === 'window' ? 0.42 : 0.26;
      const a1 = ang - spread, a2 = ang + spread, r = dist - 6;
      s += `<path d="M${l.x} ${l.y} L${(l.x + Math.cos(a1) * r).toFixed(1)} ${(l.y + Math.sin(a1) * r).toFixed(1)} L${(l.x + Math.cos(a2) * r).toFixed(1)} ${(l.y + Math.sin(a2) * r).toFixed(1)} Z" fill="${cc}" opacity=".13"/>`;
      s += `<line x1="${l.x}" y1="${l.y}" x2="${(subj.x - Math.cos(ang) * 30).toFixed(1)}" y2="${(subj.y - Math.sin(ang) * 30).toFixed(1)}" stroke="${cc}" stroke-width="2" stroke-dasharray="5 5" opacity=".7"/>`;
    }
    const g = `<g transform="translate(${l.x} ${l.y}) rotate(${deg.toFixed(1)})">`;
    if (l.k === 'soft') s += g + `<path d="M-14 -30 L10 -18 L10 18 L-14 30 Z" fill="${cc}" opacity=".9"/><rect x="10" y="-18" width="5" height="36" fill="#fff"/></g>`;
    else if (l.k === 'window') s += g + `<rect x="-6" y="-44" width="12" height="88" fill="#7fb2ff"/><rect x="-6" y="-44" width="12" height="88" fill="none" stroke="#fff" stroke-width="1.5"/></g>`;
    else if (l.k === 'bounce') s += g + `<rect x="-3" y="-30" width="7" height="60" rx="2" fill="#f5f7fb"/></g>`;
    else if (l.k === 'practical') s += `<circle cx="${l.x}" cy="${l.y}" r="13" fill="${cc}" opacity=".3"/><circle cx="${l.x}" cy="${l.y}" r="7" fill="${cc}"/>`;
    else s += g + `<rect x="-12" y="-11" width="22" height="22" rx="4" fill="${cc}"/><rect x="10" y="-9" width="4" height="18" fill="#fff"/></g>`;
    if (l.t) {
      const lx = l.tx ?? l.x, ly = l.ty ?? (l.y + (l.y > subj.y ? 46 : -40));
      s += T(lx, ly, l.t, { size: 16, anchor: 'middle', weight: 800, fill: cc });
      if (l.d) s += T(lx, ly + 18, l.d, { size: 12.5, anchor: 'middle', fill: C.mu });
    }
  });
  // người nhìn từ trên: vai + đầu + mũi hướng về máy
  const fa = Math.atan2(cam.y - subj.y, cam.x - subj.x) * 180 / Math.PI;
  s += `<g transform="translate(${subj.x} ${subj.y}) rotate(${(fa - 90).toFixed(1)})"><ellipse cx="0" cy="0" rx="36" ry="17" fill="#3b82f6"/><circle cx="0" cy="2" r="15" fill="#231c1a"/><path d="M-5 14 L0 23 L5 14 Z" fill="#f0c29e"/></g>`;
  s += T(subj.x, subj.y - 34, 'BẠN', { size: 13, anchor: 'middle', weight: 800, fill: '#fff' });
  // máy quay
  const ca = Math.atan2(subj.y - cam.y, subj.x - cam.x) * 180 / Math.PI;
  s += `<g transform="translate(${cam.x} ${cam.y}) rotate(${ca.toFixed(1)})"><rect x="-16" y="-12" width="26" height="24" rx="4" fill="#e9eef6"/><path d="M10 -7 L22 -13 L22 13 L10 7 Z" fill="#e9eef6"/></g>`;
  s += T(cam.x + 30, cam.y + 5, 'MÁY QUAY', { size: 12.5, weight: 800, fill: C.mu });
  return s + `</svg>`;
};

/** meter(rows[{t, peak, v:'good'|'low'|'clip'}]) — đồng hồ mức âm thanh dBFS */
export const meter = (rows, { w = 1100, target = [-12, -6] } = {}) => {
  const L = 250, R = 30, bw = w - L - R, H = 40 + rows.length * 62;
  const x = (db) => L + ((db + 60) / 60) * bw;
  let s = `<svg class="c-svg" viewBox="0 0 ${w} ${H}" width="${w}">`;
  s += `<rect x="${x(target[0])}" y="4" width="${x(target[1]) - x(target[0])}" height="${H - 34}" rx="6" fill="${C.grn}" opacity=".1" stroke="${C.grn}" stroke-dasharray="5 4"/>`;
  s += T((x(target[0]) + x(target[1])) / 2, 20, `mục tiêu ${target[0]}…${target[1]} dB`, { size: 13, anchor: 'middle', fill: C.grn, weight: 700 });
  rows.forEach((r, i) => {
    const y = 34 + i * 62;
    const vc = r.v === 'good' ? C.grn : r.v === 'clip' ? C.red : C.amb;
    s += T(L - 16, y + 22, r.t, { size: 17, anchor: 'end', fill: '#e9eef6', weight: 700 });
    s += `<rect x="${L}" y="${y}" width="${bw}" height="30" rx="6" fill="#141a24" stroke="#232c3c"/>`;
    const segs = [[-60, -18, '#2fbf71'], [-18, -6, '#c9d23a'], [-6, 0, '#ff4d5e']];
    segs.forEach(([a, b, c]) => {
      const e = Math.min(b, r.peak);
      if (e > a) s += `<rect x="${x(a) + 1}" y="${y + 3}" width="${x(e) - x(a) - 2}" height="24" rx="3" fill="${c}"/>`;
    });
    s += `<rect x="${x(r.peak) - 2}" y="${y - 3}" width="4" height="36" fill="#fff"/>`;
    s += T(x(r.peak) + (r.peak > -8 ? -10 : 10), y - 6, `${r.peak > -0.1 ? 'CLIP 0' : r.peak} dB`, { size: 13, fill: vc, weight: 800, anchor: r.peak > -8 ? 'end' : 'start', mono: true });
  });
  [-60, -48, -36, -24, -18, -12, -6, 0].forEach((d) => { s += T(x(d), H - 4, String(d), { size: 12, anchor: 'middle', fill: C.dim, mono: true }); });
  return s + `</svg>`;
};

/** audioWave({len, parts:[{s,e,t,k:'talk'|'pause'|'filler'|'breath'}], w}) — sóng âm có đánh dấu đoạn cần cắt */
export const audioWave = ({ len = 20, parts = [], w = 1100, h = 170 } = {}) => {
  const px = (t) => 10 + (t / len) * (w - 20);
  const r = rng(11);
  const kindAt = (t) => (parts.find((p) => t >= p.s && t < p.e) || {}).k || 'talk';
  let d = '';
  const mid = 80;
  for (let x = 12; x < w - 10; x += 3) {
    const t = ((x - 10) / (w - 20)) * len, k = kindAt(t);
    const amp = k === 'pause' ? 1 + r() * 2 : k === 'breath' ? 3 + r() * 6 : k === 'filler' ? 8 + r() * 16 : 6 + r() * 52;
    d += `M${x} ${(mid - amp).toFixed(1)} V${(mid + amp).toFixed(1)} `;
  }
  let s = `<svg class="c-svg" viewBox="0 0 ${w} ${h}" width="${w}"><rect width="${w}" height="${h}" rx="12" fill="#0f131a" stroke="#2a3446"/>`;
  parts.filter((p) => p.k !== 'talk').forEach((p) => {
    const cc = p.k === 'pause' ? C.red : p.k === 'filler' ? C.amb : C.vio;
    s += `<rect x="${px(p.s)}" y="10" width="${px(p.e) - px(p.s)}" height="${h - 44}" fill="${cc}" opacity=".16" stroke="${cc}" stroke-dasharray="4 3"/>`;
    if (p.t) s += T((px(p.s) + px(p.e)) / 2, h - 12, p.t, { size: 14, anchor: 'middle', fill: cc, weight: 800 });
  });
  s += `<path d="${d}" stroke="${C.grn}" stroke-width="1.8"/>`;
  return s + `</svg>`;
};

/** Đường cong mượt qua các điểm (Catmull-Rom → Bézier). */
const smooth = (pts) => {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

/**
 * chart({series:[{t, c, pts:[[x,y]...]}], x:[min,max,label], y:[min,max,label], notes:[{x,y,t,c}], w, h, xfmt, yfmt})
 * — biểu đồ đường (vd đường giữ chân người xem).
 */
export const chart = ({ series, x = [0, 100, ''], y = [0, 100, ''], notes = [], w = 1100, h = 380, xt = 5, yt = 4, xfmt = (v) => v, yfmt = (v) => v }) => {
  const L = 70, B = 50, Tp = 20, R = 20;
  const X = (v) => L + ((v - x[0]) / (x[1] - x[0])) * (w - L - R);
  const Y = (v) => Tp + (1 - (v - y[0]) / (y[1] - y[0])) * (h - Tp - B);
  let s = `<svg class="c-svg" viewBox="0 0 ${w} ${h}" width="${w}"><rect width="${w}" height="${h}" rx="12" fill="#0f131a" stroke="#2a3446"/>`;
  for (let i = 0; i <= yt; i++) {
    const v = y[0] + ((y[1] - y[0]) * i) / yt;
    s += `<line x1="${L}" x2="${w - R}" y1="${Y(v)}" y2="${Y(v)}" stroke="#222b3a"/>` + T(L - 10, Y(v) + 5, String(yfmt(v)), { size: 13, anchor: 'end', fill: C.dim, mono: true });
  }
  for (let i = 0; i <= xt; i++) {
    const v = x[0] + ((x[1] - x[0]) * i) / xt;
    s += T(X(v), h - B + 22, String(xfmt(v)), { size: 13, anchor: 'middle', fill: C.dim, mono: true });
  }
  if (x[2]) s += T((L + w - R) / 2, h - 8, x[2], { size: 14, anchor: 'middle', fill: C.mu });
  if (y[2]) s += `<text transform="translate(18 ${(Tp + h - B) / 2}) rotate(-90)" font-size="14" fill="${C.mu}" text-anchor="middle" font-family="-apple-system,Arial">${esc(y[2])}</text>`;
  series.forEach((sr, i) => {
    const cc = col(sr.c, i + 2);
    const pts = sr.pts.map(([a, b]) => [X(a), Y(b)]);
    if (sr.fill) s += `<path d="${smooth(pts)} L${pts[pts.length - 1][0]} ${Y(y[0])} L${pts[0][0]} ${Y(y[0])} Z" fill="${cc}" opacity=".12"/>`;
    s += `<path d="${smooth(pts)}" stroke="${cc}" stroke-width="${sr.wd || 4}" fill="none" stroke-linecap="round"${sr.dash ? ' stroke-dasharray="9 7"' : ''}/>`;
    if (sr.t) { const [lx, ly] = pts[sr.at ?? pts.length - 1]; s += T(lx + (sr.dx ?? -8), ly + (sr.dy ?? -12), sr.t, { size: 15, anchor: sr.anchor || 'end', fill: cc, weight: 800 }); }
  });
  notes.forEach((n) => {
    const cc = col(n.c || 'amb');
    s += `<circle cx="${X(n.x)}" cy="${Y(n.y)}" r="7" fill="${cc}" stroke="#0b0e14" stroke-width="2"/>`;
    s += T(X(n.x) + (n.dx ?? 12), Y(n.y) + (n.dy ?? -12), n.t, { size: 14, fill: cc, weight: 700, anchor: n.anchor || 'start' });
  });
  return s + `</svg>`;
};

/** vectorscope({clouds:[{a, r, sp, c, n}], w, skin}) — kính màu vectorscope; a = góc (độ, 0 = 3 giờ, ngược chiều kim) */
export const vectorscope = ({ clouds = [{ a: 123, r: 0.42, sp: 0.1 }], w = 360, skin = true, label } = {}) => {
  const R = 160, cx = 180, cy = 180;
  const P = (a, r) => [cx + Math.cos((a * Math.PI) / 180) * r * R, cy - Math.sin((a * Math.PI) / 180) * r * R];
  let s = `<svg class="c-svg" viewBox="0 0 360 ${label ? 390 : 360}" width="${w}"><circle cx="${cx}" cy="${cy}" r="${R + 6}" fill="#07090d" stroke="#2a3446" stroke-width="2"/>`;
  [0.25, 0.5, 0.75, 1].forEach((k) => { s += `<circle cx="${cx}" cy="${cy}" r="${R * k}" fill="none" stroke="#1f2a24"/>`; });
  s += `<line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="#1f2a24"/><line x1="${cx}" y1="${cy - R}" x2="${cx}" y2="${cy + R}" stroke="#1f2a24"/>`;
  const tg = [['R', 103, '#ff4d5e'], ['Mg', 61, '#e879f9'], ['B', 347, '#60a5fa'], ['Cy', 283, '#2dd4bf'], ['G', 241, '#34d399'], ['Yl', 167, '#ffc233']];
  tg.forEach(([n, a, c]) => {
    const [x, y] = P(a, 0.75);
    s += `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" fill="none" stroke="${c}" stroke-width="2"/>`;
    const [lx, ly] = P(a, 0.92);
    s += T(lx, ly + 5, n, { size: 14, anchor: 'middle', fill: c, weight: 800 });
  });
  if (skin) {
    const [x, y] = P(123, 1);
    s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#ffd08a" stroke-width="2" stroke-dasharray="6 4"/>`;
  }
  const r = rng(5);
  clouds.forEach((cl) => {
    for (let i = 0; i < (cl.n || 260); i++) {
      const a = cl.a + (r() - 0.5) * 60 * (cl.sp ?? 0.1) * 3;
      const rr = Math.max(0, cl.r * (0.25 + r() * 0.9));
      const [x, y] = P(a, rr);
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.4" fill="${cl.c || '#b8f5c8'}" opacity=".7"/>`;
    }
  });
  if (label) s += T(180, 385, label, { size: 16, anchor: 'middle', fill: '#e9eef6', weight: 700 });
  return s + `</svg>`;
};

/** lumaScope({kind:'ok'|'under'|'over'|'flat', w, label}) — dạng sóng độ sáng (waveform) 0–100 */
export const lumaScope = ({ kind = 'ok', w = 360, label } = {}) => {
  const W = 360, H = 220, r = rng(kind.length * 13 + 3);
  const base = { ok: [12, 88], under: [2, 42], over: [55, 100], flat: [34, 62] }[kind] || [12, 88];
  let s = `<svg class="c-svg" viewBox="0 0 ${W} ${H + (label ? 30 : 0)}" width="${w}"><rect width="${W}" height="${H}" rx="8" fill="#07090d" stroke="#2a3446"/>`;
  [0, 25, 50, 75, 100].forEach((v) => {
    const y = 10 + (1 - v / 100) * (H - 20);
    s += `<line x1="34" x2="${W - 6}" y1="${y}" y2="${y}" stroke="${v === 0 || v === 100 ? '#5a3a3a' : '#1f2a24'}"/>` + T(28, y + 4, String(v), { size: 11, anchor: 'end', fill: C.dim, mono: true });
  });
  for (let x = 38; x < W - 8; x += 2) {
    const k = Math.sin(x / 23) * 0.5 + 0.5;
    const lo = base[0] + r() * 6, hi = base[0] + (base[1] - base[0]) * (0.55 + 0.45 * k) + r() * 5;
    for (let j = 0; j < 7; j++) {
      const v = Math.min(100, lo + r() * (hi - lo));
      const y = 10 + (1 - v / 100) * (H - 20);
      s += `<rect x="${x}" y="${y.toFixed(1)}" width="1.6" height="1.6" fill="#8ff0a8" opacity=".5"/>`;
    }
    if (kind === 'over' && r() > 0.3) s += `<rect x="${x}" y="10" width="1.8" height="2" fill="#ff6b6b"/>`;
    if (kind === 'under' && r() > 0.3) s += `<rect x="${x}" y="${H - 12}" width="1.8" height="2" fill="#ff6b6b"/>`;
  }
  if (label) s += T(W / 2, H + 22, label, { size: 15, anchor: 'middle', fill: '#e9eef6', weight: 700 });
  return s + `</svg>`;
};

/**
 * phone({w, zones, shot, caption}) — màn hình điện thoại 9:16 có lớp giao diện TikTok/Reels/Shorts
 *   zones: {top, bottom, right} là tỉ lệ (0..1) bị giao diện che — số ƯỚC LƯỢNG, ghi rõ trên slide.
 */
export const phone = ({ w = 250, zones = { top: 0.1, bottom: 0.22, right: 0.16 }, size = 'MS', label, showUi = true, zoneLabels = true } = {}) => {
  const h = Math.round(w * 16 / 9);
  const z = zones;
  let over = `<svg style="position:absolute;inset:0" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`;
  over += `<rect x="0" y="0" width="${w}" height="${h * z.top}" fill="#ff4d5e" opacity=".42"/>`;
  over += `<rect x="0" y="${h * (1 - z.bottom)}" width="${w}" height="${h * z.bottom}" fill="#ff4d5e" opacity=".42"/>`;
  over += `<rect x="${w * (1 - z.right)}" y="${h * z.top}" width="${w * z.right}" height="${h * (1 - z.top - z.bottom)}" fill="#ff4d5e" opacity=".42"/>`;
  if (zoneLabels) {
    over += T(w * 0.62, h * (1 - z.bottom / 2) + 18, 'chữ mô tả', { size: 11, anchor: 'middle', fill: '#fff', weight: 700 });
    over += `<text transform="translate(${w * (1 - z.right / 2) + 4} ${h * 0.34}) rotate(90)" font-size="11" fill="#fff" font-weight="700" text-anchor="middle" font-family="-apple-system,Arial">nút bấm</text>`;
  }
  over += `<rect x="${w * 0.04}" y="${h * z.top + 4}" width="${w * (1 - z.right) - w * 0.04 - 4}" height="${h * (1 - z.top - z.bottom) - 8}" fill="none" stroke="#34d399" stroke-width="2.5" stroke-dasharray="7 5" rx="6"/>`;
  if (showUi) {
    [0.52, 0.62, 0.72, 0.82].forEach((k, i) => { over += `<circle cx="${w * (1 - z.right / 2)}" cy="${h * k}" r="${w * 0.045}" fill="#fff" opacity=".85"/>`; });
    over += `<rect x="${w * 0.05}" y="${h * (1 - z.bottom) + 12}" width="${w * 0.45}" height="7" rx="3" fill="#fff" opacity=".9"/>`;
    over += `<rect x="${w * 0.05}" y="${h * (1 - z.bottom) + 26}" width="${w * 0.62}" height="6" rx="3" fill="#fff" opacity=".6"/>`;
    over += `<rect x="${w * 0.05}" y="${h * (1 - z.bottom) + 38}" width="${w * 0.5}" height="6" rx="3" fill="#fff" opacity=".6"/>`;
    over += `<rect x="${w * 0.3}" y="${h * 0.035}" width="${w * 0.4}" height="7" rx="3" fill="#fff" opacity=".85"/>`;
  }
  over += `</svg>`;
  return `<div style="display:inline-block;text-align:center"><div style="position:relative;width:${w}px;height:${h}px;border-radius:26px;overflow:hidden;border:7px solid #1e2533;box-shadow:0 0 0 2px #3a4558;background:linear-gradient(180deg,#34405a,#1d2433)">` +
    personShot({ w, h, size, at: 0.45, bg: false }) + over + `</div>` + (label ? `<div style="font-size:16px;color:#d6deea;margin-top:8px">${label}</div>` : '') + `</div>`;
};

/** axis180({w}) — quy tắc 180° nhìn từ trên */
export const axis180 = ({ w = 560 } = {}) => {
  let s = `<svg class="c-svg" viewBox="0 0 600 400" width="${w}"><rect width="600" height="400" rx="14" fill="#0f131a" stroke="#2a3446"/>`;
  s += `<rect x="10" y="170" width="580" height="220" rx="10" fill="${C.grn}" opacity=".07"/>`;
  s += `<line x1="20" y1="170" x2="580" y2="170" stroke="${C.amb}" stroke-width="3" stroke-dasharray="12 8"/>`;
  s += T(560, 158, 'TRỤC 180°', { size: 14, anchor: 'end', fill: C.amb, weight: 800 });
  const person = (x, rot, n, c) => `<g transform="translate(${x} 170) rotate(${rot})"><ellipse rx="30" ry="14" fill="${c}"/><circle r="13" cx="0" cy="0" fill="#231c1a"/><path d="M-5 12 L0 21 L5 12 Z" fill="#f0c29e"/></g>` + T(x, 128, n, { size: 16, anchor: 'middle', weight: 800, fill: c });
  s += person(210, -90, 'A', C.blu) + person(390, 90, 'B', C.pnk);
  const cam = (x, y, n, ok) => {
    const a = Math.atan2(170 - y, 300 - x) * 180 / Math.PI;
    const c = ok ? C.grn : C.red;
    return `<g transform="translate(${x} ${y}) rotate(${a.toFixed(1)})"><rect x="-16" y="-12" width="26" height="24" rx="4" fill="${c}"/><path d="M10 -7 L22 -13 L22 13 L10 7 Z" fill="${c}"/></g>` +
      T(x, y + (y > 170 ? 38 : -24), n, { size: 15, anchor: 'middle', weight: 800, fill: c });
  };
  s += cam(150, 320, 'Máy 1 ✓', true) + cam(450, 320, 'Máy 2 ✓', true) + cam(300, 60, 'Máy 3 ✕ vượt trục', false);
  s += T(300, 385, 'Đặt mọi máy cùng MỘT phía trục', { size: 15, anchor: 'middle', fill: C.grn, weight: 700 });
  return s + `</svg>`;
};

/** fov({lenses:[{f, t, c}], w}) — góc nhìn theo tiêu cự (tương đương 35mm), nhìn từ trên */
export const fov = ({ lenses, w = 560 } = {}) => {
  const cx = 300, cy = 400, R = 300;
  let s = `<svg class="c-svg" viewBox="0 0 600 420" width="${w}"><rect width="600" height="420" rx="14" fill="#0f131a" stroke="#2a3446"/>`;
  let leg = '';
  lenses.forEach((l, i) => {
    const hf = 2 * Math.atan(36 / (2 * l.f));
    const a1 = -Math.PI / 2 - hf / 2, a2 = -Math.PI / 2 + hf / 2;
    const cc = col(l.c, i + 1);
    const rr = R - i * 26;
    s += `<path d="M${cx} ${cy} L${(cx + Math.cos(a1) * rr).toFixed(1)} ${(cy + Math.sin(a1) * rr).toFixed(1)} A${rr} ${rr} 0 0 1 ${(cx + Math.cos(a2) * rr).toFixed(1)} ${(cy + Math.sin(a2) * rr).toFixed(1)} Z" fill="${cc}" opacity=".12" stroke="${cc}" stroke-width="2.5"/>`;
    const deg = Math.round((hf * 180) / Math.PI);
    leg += `<rect x="18" y="${18 + i * 24}" width="14" height="14" rx="3" fill="${cc}"/>` + T(40, 30 + i * 24, `${l.f}mm · ${deg}°${l.t ? ' · ' + l.t : ''}`, { size: 14.5, fill: cc, weight: 800 });
  });
  s += `<circle cx="${cx}" cy="${cy}" r="9" fill="#fff"/>` + leg;
  s += T(582, 410, 'góc nhìn ngang, tiêu cự tương đương 35mm', { size: 12, anchor: 'end', fill: C.dim });
  return s + `</svg>`;
};

/** funnel(stages[{t, d, c}]) — phễu */
export const funnel = (stages, { w = 620 } = {}) => {
  const H = stages.length * 74 + 10;
  let s = `<svg class="c-svg" viewBox="0 0 620 ${H}" width="${w}">`;
  stages.forEach((st, i) => {
    const top = 600 - i * (440 / stages.length), bot = 600 - (i + 1) * (440 / stages.length);
    const y = 5 + i * 74, cc = col(st.c, i);
    s += `<path d="M${310 - top / 2} ${y} H${310 + top / 2} L${310 + bot / 2} ${y + 66} H${310 - bot / 2} Z" fill="${cc}" opacity=".85"/>`;
    s += T(310, y + 30, st.t, { size: 19, anchor: 'middle', weight: 800, fill: '#0b0e14' });
    if (st.d) s += T(310, y + 52, st.d, { size: 14, anchor: 'middle', fill: '#0b0e14', weight: 600 });
  });
  return s + `</svg>`;
};

/** curve({kind:'s'|'lift'|'crush', w}) — đường cong độ tương phản */
export const curve = ({ kind = 's', w = 300, label } = {}) => {
  const P = { s: [[0, 0], [70, 45], [150, 150], [230, 255], [300, 300]], lift: [[0, 40], [150, 175], [300, 300]], crush: [[0, 0], [80, 20], [300, 300]] }[kind];
  const pts = P.map(([x, y]) => [20 + x, 320 - y]);
  let s = `<svg class="c-svg" viewBox="0 0 340 ${label ? 370 : 340}" width="${w}"><rect x="20" y="20" width="300" height="300" fill="#07090d" stroke="#2a3446"/>`;
  [1, 2, 3].forEach((k) => { s += `<line x1="${20 + k * 75}" y1="20" x2="${20 + k * 75}" y2="320" stroke="#1d2430"/><line x1="20" y1="${20 + k * 75}" x2="320" y2="${20 + k * 75}" stroke="#1d2430"/>`; });
  s += `<line x1="20" y1="320" x2="320" y2="20" stroke="#3a4558" stroke-dasharray="6 5"/>`;
  s += `<path d="${smooth(pts)}" stroke="#fff" stroke-width="3.5" fill="none"/>`;
  pts.slice(1, -1).forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="6" fill="${C.amb}"/>`; });
  s += T(28, 312, 'tối', { size: 13, fill: C.dim }) + T(312, 36, 'sáng', { size: 13, fill: C.dim, anchor: 'end' });
  if (label) s += T(170, 356, label, { size: 16, anchor: 'middle', fill: '#e9eef6', weight: 700 });
  return s + `</svg>`;
};

/**
 * dof({items:[{t, blur}]}) — minh hoạ độ sâu trường ảnh: nền mờ/nét theo khẩu độ.
 */
export const dof = (items = [{ t: 'f/1.8 — nền mờ, nổi chủ thể', blur: 7 }, { t: 'f/8 — nền nét, rối mắt', blur: 0 }]) => {
  const bokeh = (() => {
    const r = rng(3);
    let s = '';
    for (let i = 0; i < 16; i++) s += `<circle cx="${(r() * 100).toFixed(1)}%" cy="${(r() * 60).toFixed(1)}%" r="${6 + r() * 16}" fill="${['#ffd27a', '#ff9f68', '#8fd3ff', '#ffe9b0'][i % 4]}" opacity=".75"/>`;
    return s;
  })();
  const scene = `<svg viewBox="0 0 560 315" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="560" height="315" fill="#1d2536"/>` +
    `<rect x="20" y="30" width="170" height="230" fill="#3a2f28"/>${[0, 1, 2, 3].map((k) => `<rect x="30" y="${45 + k * 55}" width="150" height="6" fill="#5a4636"/>` + [0, 1, 2, 3, 4, 5].map((b) => `<rect x="${36 + b * 23}" y="${45 + k * 55 - 36}" width="16" height="36" fill="${['#c0392b', '#2980b9', '#27ae60', '#f39c12', '#8e44ad', '#16a085'][(b + k) % 6]}"/>`).join('')).join('')}` +
    `<rect x="380" y="60" width="150" height="100" rx="6" fill="#2b3a55"/><rect x="392" y="72" width="126" height="76" fill="#87b7e8"/>${bokeh}</svg>`;
  return `<div class="c-dof">${items.map((it) => `<div class="ph"><div class="bgl" style="filter:blur(${it.blur}px)">${scene}</div>` +
    `<div class="fg">${personShot({ w: 540, h: 280, size: 'MCU', at: 0.55, bg: false })}</div><span class="lab">${it.t}</span></div>`).join('')}</div>`;
};

/** aspect() — so sánh các tỉ lệ khung */
export const aspect = ({ items = [
  { r: '16:9', px: '1920×1080', t: 'YouTube, màn hình ngang', c: 'blu' },
  { r: '9:16', px: '1080×1920', t: 'TikTok · Reels · Shorts', c: 'red' },
  { r: '1:1', px: '1080×1080', t: 'Bài đăng vuông', c: 'amb' },
  { r: '4:5', px: '1080×1350', t: 'Feed Instagram/Facebook', c: 'vio' },
], h = 260 } = {}) =>
  `<div style="display:flex;gap:26px;align-items:flex-end;justify-content:center">${items.map((it, i) => {
    const [a, b] = it.r.split(':').map(Number);
    const hh = a > b ? h * 0.62 : h, ww = hh * a / b, cc = col(it.c, i);
    return `<div style="text-align:center"><div style="width:${ww.toFixed(0)}px;height:${hh.toFixed(0)}px;border:3px solid ${cc};border-radius:10px;background:${cc}1a;display:flex;align-items:center;justify-content:center;margin:0 auto">` +
      `<b style="font-size:26px;color:${cc};font-family:'SF Mono',Menlo,monospace">${it.r}</b></div>` +
      `<div style="font-size:15px;color:#fff;margin-top:8px;font-family:'SF Mono',Menlo,monospace">${it.px}</div><div style="font-size:15px;color:#a3aec0;max-width:${Math.max(ww, 150).toFixed(0)}px">${it.t}</div></div>`;
  }).join('')}</div>`;

/**
 * storyboard(panels[{s, t, d, size, at, kind}], {cols, w}) — bảng phân cảnh.
 *   kind: 'person' (mặc định, dùng size/at) | 'screen' | 'hands' | 'place' | 'object'
 */
export const storyboard = (panels, { cols = 4, w = 262 } = {}) => {
  const h = Math.round(w * 9 / 16);
  const pic = (p) => {
    if (!p.kind || p.kind === 'person') return personShot({ w, h, size: p.size || 'MS', at: p.at ?? 0.5 });
    const box = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#1b2230"/>`;
    if (p.kind === 'screen') return box + `<rect x="${w * .12}" y="${h * .12}" width="${w * .76}" height="${h * .62}" rx="6" fill="#1e1e1e" stroke="#4b5563" stroke-width="2"/>` +
      [0, 1, 2, 3, 4].map((k) => `<rect x="${w * .17}" y="${h * .2 + k * 13}" width="${w * (0.2 + ((k * 37) % 40) / 100)}" height="6" rx="3" fill="${['#569cd6', '#ce9178', '#dcdcaa', '#9cdcfe', '#6a9955'][k]}"/>`).join('') +
      `<rect x="${w * .4}" y="${h * .74}" width="${w * .2}" height="${h * .1}" fill="#4b5563"/><rect x="${w * .3}" y="${h * .84}" width="${w * .4}" height="5" rx="2" fill="#4b5563"/></svg>`;
    if (p.kind === 'hands') return box + `<rect x="${w * .1}" y="${h * .55}" width="${w * .8}" height="${h * .3}" rx="8" fill="#2d3444" stroke="#4b5563"/>` +
      [0, 1, 2].map((r) => Array.from({ length: 10 }, (_, k) => `<rect x="${w * .14 + k * w * .072}" y="${h * .6 + r * h * .08}" width="${w * .055}" height="${h * .055}" rx="2" fill="#4b5563"/>`).join('')).join('') +
      `<ellipse cx="${w * .34}" cy="${h * .56}" rx="${w * .09}" ry="${h * .12}" fill="#f0c29e"/><ellipse cx="${w * .64}" cy="${h * .58}" rx="${w * .09}" ry="${h * .12}" fill="#e8b890"/></svg>`;
    if (p.kind === 'place') return personShot({ w, h, size: 'EWS', at: 0.5 });
    return box + `<rect x="${w * .38}" y="${h * .25}" width="${w * .24}" height="${h * .5}" rx="8" fill="#d6a86b"/><ellipse cx="${w * .5}" cy="${h * .25}" rx="${w * .12}" ry="${h * .06}" fill="#f3d6a8"/><path d="M${w * .62} ${h * .35} q${w * .1} 0 ${w * .1} ${h * .12} t-${w * .1} ${h * .12}" stroke="#d6a86b" stroke-width="6" fill="none"/></svg>`;
  };
  return `<div style="display:grid;grid-template-columns:repeat(${cols},${w}px);gap:12px 14px;justify-content:center">${panels.map((p, i) =>
    `<div style="background:#141a24;border:1.5px solid #2a3446;border-radius:10px;padding:8px"><div style="position:relative;border-radius:6px;overflow:hidden;width:${w - 16}px;height:${Math.round((w - 16) * 9 / 16)}px">` +
    `<div style="transform:scale(${((w - 16) / w).toFixed(4)});transform-origin:0 0">${pic(p)}</div>` +
    `<span style="position:absolute;left:6px;top:6px;background:#0b0e14cc;color:#ffc233;font:800 13px 'SF Mono',Menlo,monospace;padding:2px 7px;border-radius:5px">${p.s || `#${i + 1}`}</span></div>` +
    `<div style="font-size:15.5px;color:#fff;font-weight:700;margin-top:6px;line-height:1.25">${p.t}</div>` +
    (p.d ? `<div style="font-size:13.5px;color:#a3aec0;line-height:1.3;margin-top:2px">${p.d}</div>` : '') + `</div>`).join('')}</div>`;
};

/** backup321() — sơ đồ sao lưu 3-2-1 */
export const backup321 = ({ items = [
  { ic: '💻', t: 'Bản làm việc', d: 'SSD ngoài / ổ Mac', tag: 'Bản 1', c: 'blu' },
  { ic: '🗄️', t: 'Bản sao lưu', d: 'Ổ HDD khác loại', tag: 'Bản 2', c: 'amb' },
  { ic: '☁️', t: 'Bản ở nơi khác', d: 'Máy Linux ở nhà / cloud', tag: 'Bản 3 · offsite', c: 'grn' },
] } = {}) => cards(items.map((x) => ({ ...x, big: x.tag })), 3) +
  `<div style="display:flex;gap:14px;justify-content:center;margin-top:4px">${tag('3 bản sao', 'amb')}${tag('2 loại ổ khác nhau', 'blu')}${tag('1 bản ở nơi khác', 'grn')}</div>`;
