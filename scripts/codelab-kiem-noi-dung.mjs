#!/usr/bin/env node
/**
 * Kiểm NỘI DUNG các bộ luyện đã xuất JSON (cái máy chấm không thấy) — chạy sau codelab-xuat-de.mjs:
 *   node scripts/codelab-kiem-noi-dung.mjs --track cea201-practice [--chi-tiet]
 *
 * Đỏ (exit 1):
 *  - đáp án trắc nghiệm có bước nhảy đều trên ≥ 4 câu liền nhau, hoặc mã trắc nghiệm không theo thứ tự a,b,c…
 *  - đề order hiện sẵn đúng thứ tự / là phép xoay của đáp án / mã lộ thứ tự
 *  - lời giải giữ chỗ ("a." hoặc danh sách chữ cái trần), giải thích nhắc chữ cái của phương án
 *  - `<` chưa escape trong HTML (DOMPurify coi là thẻ lạ và CẮT luôn chữ)
 *  - số vô lý trong câu trả lời bảng: âm hoặc lẻ ở cột đếm (index/offset/tag/bits/pins/sets/lines/blocks…)
 * Vàng: đáp án đúng dài hơn hẳn các phương án còn lại (mẹo đoán đề).
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const TRACK = args[args.indexOf('--track') + 1];
const CHI_TIET = args.includes('--chi-tiet');
if (!args.includes('--track')) { console.error('thiếu --track'); process.exit(2); }
const THU_MUC = path.join(process.cwd(), 'content/codelab', TRACK);

const CHU = 'abcdefgh';
const dsDap = (c) => (Array.isArray(c.dapAn[0]) ? c.dapAn[0] : c.dapAn);
const chu = (h) => String(h ?? '').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const THE = new Set('p i b em strong code pre ul ol li table thead tbody tr th td h1 h2 h3 h4 h5 h6 br hr div span sub sup a img small blockquote kbd figure figcaption caption details summary mark svg rect path line text circle g'.split(' '));

export function theLa(html) {
  const ra = [];
  for (const m of String(html ?? '').matchAll(/<\/?([a-zA-Z!?][^\s/>]*)/g)) if (!THE.has(m[1].toLowerCase())) ra.push(m[0]);
  return ra;
}
const THAM_CHIEU = /(?<![\p{L}])(?:[Oo]ptions? [a-e]|phương án [a-e]|[Cc]hoice [a-e]|[Aa]nswer [a-e]|đáp án [a-e])(?![\p{L}])|(?<![\p{L}\p{N}])\([a-e]\)(?!\s*[=+·∧∨→])|(?<![\p{L}\p{N}])\(([a-e], ?)+[a-e]\)/u;
const COT_NGUYEN = /(^|[^a-z])(offset|index|tag|bits?|pins?|sets?|lines?|blocks?|ways?|frames?|pages?|sectors?|stalls?|count|chips?|lanes?)($|[^a-z])/i;
const COT_THUC = /avg|average|amat|entropy|mean|ratio|%|\/symbol/i;

let do_ = 0; let vang = 0; let soCau = 0;
const dem = {}; const buoc = {};
const bao = (m) => { do_++; console.log('  ✗', m); };

for (const tep of fs.readdirSync(THU_MUC).filter((t) => /__.*\.json$/.test(t)).sort()) {
  const d = JSON.parse(fs.readFileSync(path.join(THU_MUC, tep), 'utf8'));
  d.exercises.forEach((e, i) => {
    const nhan = `${d.moduleSlug}#${i} ${e.title.slice(0, 40)}`;
    const t = e.testsJson;
    for (const [ten, h] of [['problemHtml', e.problemHtml], ['problemHtmlVi', e.problemHtmlVi], ['solutionExplanationHtml', e.solutionExplanationHtml]]) {
      const la = theLa(h); if (la.length) bao(`${nhan}: ${ten} có < chưa escape: ${la.slice(0, 3).join(' ')}`);
    }
    const dsHtml = [];
    if (e.gradeKind === 'choice' || e.gradeKind === 'order') for (const c of t.cauHoi) dsHtml.push(c.de, c.giaiThich, ...(c.luaChon || c.muc).map((o) => o.noiDung));
    if (e.gradeKind === 'table') for (const b of t.bang) dsHtml.push(b.de, b.giaiThich);
    for (const h of dsHtml) { const la = theLa(h); if (la.length) bao(`${nhan}: < chưa escape: ${la.slice(0, 3).join(' ')} — ${chu(h).slice(0, 80)}`); }

    if (e.gradeKind === 'choice') {
      const x = chu(e.solutionExplanationHtml);
      if (/^[a-f](\+[a-f])*( · [a-f](\+[a-f])*)*\.?$/.test(x)) bao(`${nhan}: lời giải giữ chỗ "${x.slice(0, 20)}"`);
      const v = [];
      for (const c of t.cauHoi) {
        soCau++;
        c.luaChon.forEach((o, j) => { if (o.ma !== CHU[j]) bao(`${nhan}: mã phương án lệch vị trí`); });
        const so = CHU.indexOf(dsDap(c)[0]); v.push(so);
        dem[dsDap(c)[0]] = (dem[dsDap(c)[0]] || 0) + 1;
        if (THAM_CHIEU.test(chu(c.giaiThich).replace(/\([a-e], ?[a-e]\)\s*(∈|∉|=)/g, ''))) bao(`${nhan} ${c.ma}: giải thích có thể nhắc chữ cái: ${chu(c.giaiThich).slice(0, 110)}`);
        const dung = chu(c.luaChon.find((o) => o.ma === dsDap(c)[0]).noiDung).length;
        const sai = c.luaChon.filter((o) => !dsDap(c).includes(o.ma)).map((o) => chu(o.noiDung).length);
        if (dung >= 40 && dung > 1.8 * Math.max(...sai)) { vang++; if (CHI_TIET) console.log(`  ⚠ ${nhan} ${c.ma}: đáp án dài ${dung}, nhiễu tối đa ${Math.max(...sai)}`); }
      }
      const n = Math.max(...t.cauHoi.map((c) => c.luaChon.length));
      for (let k = 0; k + 3 < v.length; k++) {
        const b = (v[k + 1] - v[k] + n) % n;
        if ((v[k + 2] - v[k + 1] + n) % n === b && (v[k + 3] - v[k + 2] + n) % n === b) { bao(`${nhan}: đáp án lặp đều từ câu ${k + 1}: ${v.map((x) => CHU[x]).join('')}`); break; }
      }
      for (let k = 0; k + 1 < v.length; k++) { const b = (v[k + 1] - v[k] + n) % n; buoc[b] = (buoc[b] || 0) + 1; }
    }
    if (e.gradeKind === 'order') {
      for (const c of t.cauHoi) {
        const dung = c.dapAn.join('|'); const m = c.muc.map((x) => x.ma);
        const xoay = m.some((_, k) => [...m.slice(k), ...m.slice(0, k)].join('|') === dung);
        if (xoay) bao(`${nhan} ${c.ma}: thứ tự hiện là phép xoay của đáp án`);
        if (/^[a-z]+\d+$/.test(c.dapAn[0]) && c.dapAn.every((x, k) => Number(x.replace(/\D/g, '')) === k + 1)) bao(`${nhan} ${c.ma}: mã mục lộ thứ tự đúng`);
      }
    }
    if (e.gradeKind === 'table') {
      for (const b of t.bang) {
        for (const c of b.cot) {
          if (!COT_NGUYEN.test(`${c.ma} ${c.ten}`) || COT_THUC.test(c.ten) || c.luaChon) continue;
          for (const [k, v] of Object.entries(b.dapAn)) {
            if (!k.endsWith(`.${c.ma}`)) continue;
            for (const s of (Array.isArray(v) ? v : [v])) if (/^-\d/.test(s) || /^-?\d+\.\d*[1-9]\d*$/.test(s)) bao(`${nhan} ${b.ma} ${k}: "${s}" ở cột ${c.ten}`);
          }
        }
      }
    }
  });
}
const tong = Object.values(dem).reduce((a, b) => a + b, 0);
console.log(`${TRACK}: ${soCau} câu · phân bố đáp án ${Object.keys(dem).sort().map((k) => `${k}=${dem[k]} (${(dem[k] * 100 / tong).toFixed(0)}%)`).join(' ')} · bước giữa hai câu liền nhau ${Object.keys(buoc).sort().map((k) => `+${k}=${buoc[k]}`).join(' ')}`);
console.log(do_ ? `✗ ${do_} lỗi nội dung` : '✓ không còn lỗi nội dung máy dò được', vang ? `· ⚠ ${vang} câu đáp án dài hơn hẳn nhiễu (--chi-tiet)` : '');
process.exit(do_ ? 1 : 0);
