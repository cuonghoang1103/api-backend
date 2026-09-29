/**
 * _dv-chung.mjs — giao diện cho các deck của khoá "Deploy lên VPS" (deck dv-00 … dv-15).
 *
 *   node scripts/_render-slides.mjs --deck scripts/slides-src/dv-03.mjs --out <dir>
 *
 * Dùng LẠI toàn bộ thư viện của khoá Linux (`_lx-chung.mjs`: sh() tô màu VS Code, term(), pipe(),
 * perms(), diagram(), host(), layers(), sv/R/T/A, …) và `yaml()` của khoá Docker (compose/Dockerfile/
 * workflow GitHub Actions có ghi chú bên lề), rồi phủ lớp theme riêng: xanh "máy chủ" #38bdf8 + tím.
 * ⚠️ KHÔNG sửa `_lx-chung.mjs` / `_dk-chung.mjs` / `_git-chung.mjs` / `_cr-chung.mjs` — khoá khác đang dùng.
 *
 * Màu đặt bằng tên: dv (xanh máy chủ) · lx (vàng) · grn · blu · tea · amb · ora · vio · pnk · red · dim.
 * (Khối của CR — cards/bars/seg/kpis/flow/steps — KHÔNG hiểu 'dv'/'lx' ⇒ dùng 'blu'/'tea'.)
 */
import * as LX from './_lx-chung.mjs';
import { yaml as dkYaml } from './_dk-chung.mjs';
import { G as GG } from './_git-chung.mjs';

export * from './_lx-chung.mjs';

export const D = { ...LX.D, dv: '#38bdf8' };
if (!GG.dv) GG.dv = D.dv;
LX.D.dv = D.dv; // cho sv/R/T/A/diagram của _lx-chung hiểu tên màu 'dv'

export const DV_CSS = `<style>
:root{--dv:${D.dv}}
.slide{background:
 radial-gradient(900px 480px at 100% 0%,rgba(56,189,248,.13),transparent 60%),
 radial-gradient(820px 460px at 0% 100%,rgba(167,139,250,.10),transparent 60%),
 linear-gradient(180deg,#0b1018,#070a10)}
.slide .bar{background:linear-gradient(90deg,${D.dv},${D.blu} 35%,${D.vio} 70%,${D.pnk})}
.slide .hd span:first-child::before{background:${D.dv};box-shadow:0 0 12px ${D.dv}}
.slide h1::after{background:linear-gradient(90deg,${D.dv},${D.vio})}
.slide.cover{background:
 radial-gradient(700px 420px at 78% 30%,rgba(56,189,248,.26),transparent 62%),
 radial-gradient(760px 480px at 18% 80%,rgba(167,139,250,.18),transparent 62%),
 #06090f}
.slide.cover h1::after{background:linear-gradient(90deg,${D.dv},${D.vio},${D.pnk})}
.c-cov .chip{background:rgba(56,189,248,.14);border-color:rgba(56,189,248,.6)}
.c-cov .chip i{background:${D.dv};box-shadow:0 0 12px ${D.dv}}
.c-mm .ctr{background:linear-gradient(135deg,#0284c7,${D.dv});color:#04111c;box-shadow:0 10px 40px rgba(56,189,248,.30)}
.g-term{background:#05080d}
.g-term .tb{background:#0f1520}
.l-sh .a{color:${D.dv}}
.l-pp .ar{color:${D.dv}}
</style>`;

/** Bọc mảng slide: CSS của khoá Linux + lớp theme Deploy. */
export const S = (slides) => LX.S(slides).map((s) => ({ ...s, body: s.body.replace(LX.LX_CSS, LX.LX_CSS + DV_CSS) }));

/** Slide bìa. chap: 'CHƯƠNG 5' | 'MỤC 0' … */
export const cover = ({ t, sub, chap, meta = 'Deploy lên VPS · cuongthai.com' }) => {
  const c = LX.cover({ t, sub, chap, meta });
  // Hình trang trí: laptop → mây → máy chủ thay cho dấu nhắc của khoá Linux.
  return { ...c, body: c.body.replace(/<svg viewBox="0 0 300 64"[\s\S]*?<\/svg>/, shipArt()) };
};

const shipArt = () => `<svg viewBox="0 0 320 70" width="320" height="70">` +
  `<rect x="6" y="14" width="74" height="44" rx="8" fill="#0b1220" stroke="${D.blu}" stroke-width="2.5"/>` +
  `<text x="43" y="42" font-family="SF Mono,Menlo,monospace" font-size="15" fill="#e6edf3" text-anchor="middle">git</text>` +
  `<path d="M88 36 L138 36" stroke="${D.dv}" stroke-width="3" stroke-dasharray="6 5"/>` +
  `<rect x="142" y="14" width="74" height="44" rx="8" fill="#0b1220" stroke="${D.vio}" stroke-width="2.5"/>` +
  `<text x="179" y="42" font-family="SF Mono,Menlo,monospace" font-size="15" fill="#e6edf3" text-anchor="middle">build</text>` +
  `<path d="M224 36 L262 36" stroke="${D.dv}" stroke-width="3"/><path d="M256 30 L266 36 L256 42 z" fill="${D.dv}"/>` +
  `<rect x="270" y="10" width="44" height="52" rx="6" fill="#0b1220" stroke="${D.dv}" stroke-width="2.5"/>` +
  `<circle cx="282" cy="24" r="3" fill="${D.grn}"/><circle cx="282" cy="36" r="3" fill="${D.grn}"/><circle cx="282" cy="48" r="3" fill="${D.amb}"/>` +
  `</svg>`;

/** yaml() của khoá Docker — compose.yaml / Dockerfile / workflow GitHub Actions / unit systemd có ghi chú bên lề. */
export const yaml = dkYaml;

/** sv() của _lx-chung chỉ tạo marker mũi tên cho các màu cố định ⇒ thêm marker 'm-dv' để A(…, {c:'dv'}) có đầu mũi tên. */
export const sv = (w, h, inner) => LX.sv(w, h, inner).replace('<defs>',
  `<defs><marker id="m-dv" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${D.dv}"/></marker>`);
