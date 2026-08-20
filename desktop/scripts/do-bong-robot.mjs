/**
 * Đo bong bóng chữ của robot NỔI, ở mọi nấc cỡ và mọi loại tin.
 *
 * ─── Vì sao cần một phép kiểm riêng ───
 * Lỗi "chữ bị xén" ở đây đã lọt HAI lần liên tiếp, mỗi lần vì một nguyên nhân
 * khác, và không lần nào có lỗi để thấy — build xanh, `tsc` xanh, chỉ có chữ
 * mất. Người dùng phải gửi ảnh cả hai lần.
 *
 *  Lần 1 (20/08): `.rb-bong` đặt `position: absolute; right: calc(100% + 6px)`
 *    trong khối chứa co vừa con robot ⇒ bề rộng khả dụng ÂM ⇒ hộp lùi về từ
 *    dài nhất. Đo được: 71px ở CẢ BA cỡ cửa sổ.
 *  Lần 2 (cùng ngày, sau khi "đã vá"): `button.rb-bong { font: inherit }` —
 *    viết tắt `font:` nuốt luôn `font-size: 12px` ⇒ bong bóng THẬT vẽ ở 16px
 *    còn ô đo (<div>) đo ở 12px ⇒ cửa sổ tính hụt ⇒ xén dòng cuối.
 *
 * ─── Phép kiểm này bắt gì ───
 * Chạy trọn vòng lặp thật: đo ô đo → tính cỡ cửa sổ y như `coNoi()` trong
 * `robotNoi.ts` → dựng lại ở đúng cỡ đó → kiểm bong bóng thật có bị xén không.
 *
 * ⚠️ BA CHỐT CHỐNG TỰ-LỪA, vì bộ đo này đã tự báo xanh sai một lần:
 *  1. Ô đo và bong bóng thật phải là HAI phần tử khác nhau (đã có lần
 *     `querySelector` bắt trúng cùng một cái rồi báo "khớp hoàn hảo").
 *  2. Font đã tính của hai bên phải GIỐNG nhau — đây chính là lỗi lần 2.
 *  3. Đo lại ô đo Ở CỠ MỚI: số phải không đổi. Đổi nghĩa là vòng lặp
 *     "đo → chỉnh cửa sổ" tự khoá, và cửa sổ kẹt ở cỡ nhỏ vĩnh viễn.
 *
 * Con số phải khớp `robotNoi.ts`. Lệch là phép kiểm nói dối.
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const GOC = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const doc = (p) => readFileSync(path.join(GOC, p), 'utf8');
const CSS = doc('src/renderer/robot.css') + doc('src/renderer/features/odin/odin.css');

/* ── Phải khớp `src/main/robotNoi.ts` ── */
const GON = { w: 150, h: 190 };
const HE_SO = [1, 0.82, 0.66, 0.52];
const DEM = 16, KHE = 8, RONG_TD = 300, CAO_TD = 240;
/* ── Phải khớp `src/renderer/robot.tsx` ── */
const CO_ROBOT = 104, TI_LE_ROBOT = 0.98;
/* ── Phải khớp `font-size` khai trong `.rb-bong` (robot.css) ── */
const CO_CHU = '12px';

const TIN = [
  ['nhạc ngắn', 'nhac', '♪ SƠN TÙNG M-TP | SKY'],
  ['nhạc dài', 'nhac', '♪ Justin Bieber - Ghost — JustinBieberVEVO'],
  ['bản mới', 'thong-bao', 'Có bản 0.5.60 — bấm để khởi động lại'],
  ['tin nhắn', 'tin-nhan', 'Có 3 tin nhắn mới'],
  ['đang nghĩ', 'cho', 'Chờ tớ suy nghĩ xíu nhé…'],
  ['agent dài', 'agent', 'Mình vừa đọc kho mã và thấy phần đăng nhập gọi thẳng vào máy chủ mà chưa kiểm hạn của thẻ, nên phiên hết hạn sẽ im lặng.'],
  ['rất dài', 'agent', 'Mình đã đọc hết bốn tệp bạn kéo vào rồi. '.repeat(6)],
];

function trang(chu, loai, nac) {
  const S = Math.round(CO_ROBOT * HE_SO[nac]);
  const H = Math.round(S * TI_LE_ROBOT);
  const esc = chu.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<style>:root{--odin-screen:#2b2f52;--odin-eye:#7ef0c0;--odin-body:#8b8af5;
    --odin-body-light:#a5a4f7;--ct-ease:ease;--ct-accent:#7c6cf0}${CSS}</style>
    <div class="rb" data-rong="false">
      <button class="rb-bong rb-do" data-loai="${loai}" tabindex="-1" aria-hidden>${esc}</button>
      <button class="rb-bong" data-loai="${loai}">${esc}</button>
      <div class="rb-than"><svg width="${S}" height="${H}"><rect width="${S}" height="${H}" fill="#345"/></svg></div>
      <div class="rb-noi"><button class="odin-mic"><svg width="16" height="16"></svg></button></div>
    </div>`;
}

const DO_O = () => {
  const d = document.querySelector('.rb-do');
  const r = d.getBoundingClientRect();
  return { w: r.width, h: r.height, font: getComputedStyle(d).font };
};

const DO_THAT = () => {
  const e = document.querySelector('.rb-bong:not(.rb-do)');
  const d = document.querySelector('.rb-do');
  if (!e || !d) throw new Error('BỘ ĐO HỎNG: thiếu phần tử');
  if (e === d) throw new Error('BỘ ĐO HỎNG: bắt trúng cùng một phần tử');
  const b = e.getBoundingClientRect();
  const mic = document.querySelector('.rb-noi').getBoundingClientRect();
  return {
    w: Math.round(b.width), h: Math.round(b.height),
    t: Math.round(b.top), b: Math.round(b.bottom),
    can: e.scrollHeight, co: e.clientHeight,
    micDay: Math.round(mic.bottom),
    font: getComputedStyle(e).font,
    fontDo: getComputedStyle(d).font,
    coChu: getComputedStyle(e).fontSize,
  };
};

const b = await chromium.launch();
let hong = 0, tong = 0;

for (const nac of HE_SO.keys()) {
  const g = { w: Math.round(GON.w * HE_SO[nac]), h: Math.round(GON.h * HE_SO[nac]) };
  console.log(`\n── nấc ${nac} · robot ${Math.round(HE_SO[nac] * 100)}% · gon ${g.w}×${g.h} ──`);

  for (const [ten, loai, chu] of TIN) {
    tong += 1;
    // B1 — đo ô đo trong cửa sổ NHỎ NHẤT. Ô đo nằm ngoài màn hình với
    //      `max-width` cố định nên số phải độc lập với cửa sổ.
    const p1 = await b.newPage({ viewport: { width: g.w, height: g.h } });
    await p1.setContent(trang(chu, loai, nac));
    const o = await p1.evaluate(DO_O);
    await p1.close();

    // B2 — `coNoi()` của robotNoi.ts, chép nguyên phép tính.
    const W = Math.max(g.w, Math.ceil(Math.min(o.w, RONG_TD)) + DEM);
    const H = g.h + KHE + Math.ceil(Math.min(o.h, CAO_TD));

    // B3 — dựng lại ở đúng cỡ đó rồi soi bong bóng THẬT.
    const p2 = await b.newPage({ viewport: { width: W, height: H } });
    await p2.setContent(trang(chu, loai, nac));
    const r = await p2.evaluate(DO_THAT);
    const o2 = await p2.evaluate(DO_O);
    await p2.close();

    const loi = [];
    if (r.can > r.co + 1) loi.push(`XÉN ${r.can - r.co}px chữ`);
    if (r.t < 0 || r.b > H) loi.push('tràn khỏi cửa sổ');
    if (r.micDay > H) loi.push('nút micro bị cắt');
    if (r.font !== r.fontDo) loi.push(`FONT LỆCH: thật "${r.font}" ≠ đo "${r.fontDo}"`);
    /* ⚠️ Chốt này có vì bản thân bộ đo từng MÙ với lỗi font. Sau khi ô đo đổi
       thành <button> giống bản thật, cả hai cùng ăn `font: inherit` nên cùng
       sai 16px, cùng khớp nhau, và phép so ở trên vẫn xanh. Kiểm CỠ THẬT so
       với con số khai trong CSS mới bắt được `font:` viết tắt nuốt mất nó. */
    if (r.coChu !== CO_CHU) loi.push(`CỠ CHỮ SAI: ${r.coChu} (phải ${CO_CHU}) — nghi 'font:' viết tắt nuốt 'font-size'`);
    if (Math.abs(o2.w - o.w) > 1 || Math.abs(o2.h - o.h) > 1) loi.push('ô đo TỰ KHOÁ (số đổi theo cửa sổ)');
    if (r.w < 90) loi.push(`bong bóng hẹp bất thường (${r.w}px) — nghi bề rộng khả dụng = 0`);

    if (loi.length) hong += 1;
    console.log(`  ${ten.padEnd(11)} cửa sổ ${String(W).padStart(3)}×${String(H).padStart(3)}` +
      `  bong ${String(r.w).padStart(3)}×${String(r.h).padStart(3)}` +
      `  ${loi.length ? `\x1b[31m❌ ${loi.join(' · ')}\x1b[0m` : '\x1b[32m✓\x1b[0m'}`);
  }
}

await b.close();
console.log(hong === 0
  ? `\n\x1b[32m${tong}/${tong} bong bóng hiện đủ chữ\x1b[0m`
  : `\n\x1b[31m${hong}/${tong} trường hợp hỏng\x1b[0m`);
process.exit(hong ? 1 : 0);
