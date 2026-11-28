/**
 * Ảnh AI cho TỪ VỰNG CT Language (28/11/2026) — một nguồn cho web, app desktop, app iOS.
 *
 * Kho từ `content/ctlanguage/chu-de-tu/<nn>/*.json` + `content/ctlanguage/tu-vung/<nn>/*.json` (trường `anh` = tên ảnh
 * `hoc/hinh/<tên>.webp`; máy chủ trả `anhUrl` cho app iOS/web/desktop ⇒ gắn một lần là mọi nơi có ảnh, KHÔNG cần phát
 * hành lại app). Từ nào chưa có `anh` ⇒ vẽ bằng Antigravity (ve-ai.mts).
 *
 * Gộp theo NGHĨA tiếng Việt (chuẩn hoá): "quả táo" ở en/ja/zh dùng CHUNG một ảnh ⇒ vẽ ít hơn, đồng nhất giữa các thứ tiếng.
 * Tên ảnh: `ai-tu-<slug nghĩa không dấu>-<4 hex băm nghĩa có dấu>` (băm để "bà" ≠ "ba").
 *
 *   npx tsx scripts/hinh/tu-vung-ai.mts --lap      # ghi scripts/hinh/ai/tu-vung.json (tên → prompt), xếp cấp dễ trước
 *   npx tsx scripts/hinh/tu-vung-ai.mts --gan      # ảnh nào ĐÃ có trên R2 ⇒ ghi `anh` vào từ (chỉ từ đang trống `anh`)
 * Vẽ: `npx tsx scripts/hinh/ve-ai.mts --nhom tu-vung --phan 1/3` (chạy 3 luồng: 1/3, 2/3, 3/3).
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const GOC = path.resolve(import.meta.dirname, '../..');
const KHO = ['chu-de-tu', 'tu-vung'].map((d) => path.join(GOC, 'content/ctlanguage', d));
const RA = path.join(import.meta.dirname, 'ai/tu-vung.json');
const TEN_NN: Record<string, string> = { en: 'English', ja: 'Japanese', zh: 'Chinese' };

type Tu = { chu: string; nghia?: string; loai?: string; cap?: string; nhom?: string; viDu?: string; viDuNghia?: string; anh?: string };
type Tep = { f: string; nn: string; j: { tu?: Tu[]; ten?: string; ma?: string } };

function napTep(): Tep[] {
  const ra: Tep[] = [];
  for (const kho of KHO) for (const nn of ['en', 'ja', 'zh']) {
    const d = path.join(kho, nn);
    let ds: string[] = [];
    try { ds = readdirSync(d).filter((x) => x.endsWith('.json') && !x.startsWith('_')); } catch { continue; }
    for (const x of ds) {
      const f = path.join(d, x);
      const j = JSON.parse(readFileSync(f, 'utf8'));
      if (Array.isArray(j.tu)) ra.push({ f, nn, j });
    }
  }
  return ra;
}

const chuanNghia = (s: string) => s.normalize('NFC').toLowerCase().replace(/\s*\([^)]*\)\s*/g, ' ').split(/[;|]/)[0]!.trim().replace(/\s+/g, ' ');
const khongDau = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
export function tenAnh(nghia: string): string {
  const n = chuanNghia(nghia);
  const slug = khongDau(n).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40).replace(/-$/, '') || 'x';
  return `ai-tu-${slug}-${createHash('sha1').update(n).digest('hex').slice(0, 4)}`;
}
const BAC: Record<string, number> = { A1: 1, N5: 1, HSK1: 1, A2: 2, N4: 2, HSK2: 2, B1: 3, N3: 3, HSK3: 3, HSK4: 4, B2: 4, N2: 4, HSK5: 5, C1: 5, N1: 5, HSK6: 6, C2: 6 };

/** Ghi lại tệp GIỮ đúng kiểu gốc: chu-de-tu = mỗi từ một dòng (`{"ma":…,"tu":[\n    {…},\n  ]}`); tu-vung = JSON thụt 1. */
export function vietLai(goc: string, j: Record<string, unknown>): string {
  if (goc.startsWith('{"ma"') && goc.includes('"tu":[\n')) {
    const { tu, ...dau } = j as { tu: unknown[] };
    const duoi = /\n( *)\]\}\n?$/.exec(goc)?.[1] ?? '  ';
    return JSON.stringify(dau).slice(0, -1) + ',"tu":[\n' + tu.map((e) => '    ' + JSON.stringify(e)).join(',\n') + `\n${duoi}]}` + (goc.endsWith('\n') ? '\n' : '');
  }
  const thut = /\n( +|\t)"/.exec(goc)?.[1] ?? 2;
  return JSON.stringify(j, null, thut) + (goc.endsWith('\n') ? '\n' : '');
}

const che = process.argv[2];
if (che === '--thu-viet') { // kiểm: viết lại không đổi gì phải ra y hệt tệp gốc
  let lech = 0;
  for (const t of napTep()) { const g = readFileSync(t.f, 'utf8'); if (vietLai(g, t.j) !== g) { lech++; console.error('lệch:', path.relative(GOC, t.f)); } }
  console.log(lech ? `✗ ${lech} tệp viết lại bị lệch` : '✓ viết lại giữ nguyên mọi tệp'); process.exit(lech ? 1 : 0);
}
if (che === '--lap') {
  const nhom = new Map<string, { bac: number; mau: { nn: string; chu: string; nghia: string; loai?: string; chuDe?: string; viDuNghia?: string }[] }>();
  let trong = 0;
  for (const t of napTep()) for (const w of t.j.tu!) {
    if (w.anh || !w.nghia?.trim()) continue;
    trong++;
    const ten = tenAnh(w.nghia);
    const g = nhom.get(ten) ?? { bac: 9, mau: [] };
    g.bac = Math.min(g.bac, BAC[w.cap ?? ''] ?? 7);
    if (g.mau.length < 3) g.mau.push({ nn: t.nn, chu: w.chu, nghia: w.nghia, loai: w.loai, chuDe: w.nhom ?? t.j.ten, viDuNghia: w.viDuNghia });
    nhom.set(ten, g);
  }
  const ds = [...nhom.entries()].sort((a, b) => a[1].bac - b[1].bac || a[0].localeCompare(b[0]));
  const out: Record<string, string> = {};
  for (const [ten, g] of ds) {
    const m = g.mau[0]!;
    const cacTu = g.mau.map((x) => `"${x.chu}" (${TEN_NN[x.nn]})`).join(', ');
    out[ten] = `Vocabulary flashcard picture that makes the meaning instantly clear to a learner. Meaning (Vietnamese): "${chuanNghia(m.nghia)}"`
      + ` — word(s): ${cacTu}${m.loai ? `, part of speech: ${m.loai}` : ''}${m.chuDe ? `, topic: ${m.chuDe}` : ''}.`
      + (m.viDuNghia ? ` Example sentence meaning: "${m.viDuNghia}".` : '')
      + ' Show ONE simple, concrete object, action or everyday scene that expresses exactly this meaning (for abstract words, a small situation with people that shows it).';
  }
  writeFileSync(RA, JSON.stringify(out, null, 1) + '\n');
  console.log(`${trong} từ chưa có ảnh ⇒ ${ds.length} ảnh (gộp theo nghĩa) ⇒ ${path.relative(GOC, RA)}`);
} else if (che === '--gan') {
  const { headObject } = await import('../../src/config/r2.js');
  const can = new Set<string>();
  const tep = napTep();
  for (const t of tep) for (const w of t.j.tu!) if (!w.anh && w.nghia?.trim()) can.add(tenAnh(w.nghia));
  const co = new Set<string>();
  const ds = [...can]; let i = 0;
  await Promise.all(Array.from({ length: 24 }, async () => {
    while (i < ds.length) { const s = ds[i++]!; if (await headObject(`hoc/hinh/${s}.webp`)) co.add(s); }
  }));
  let gan = 0, sua = 0;
  for (const t of tep) {
    let doi = false;
    for (const w of t.j.tu!) if (!w.anh && w.nghia?.trim() && co.has(tenAnh(w.nghia))) { w.anh = tenAnh(w.nghia); gan++; doi = true; }
    if (doi) { writeFileSync(t.f, vietLai(readFileSync(t.f, 'utf8'), t.j)); sua++; }
  }
  console.log(`${co.size}/${can.size} ảnh đã có trên R2 ⇒ gắn ${gan} từ trong ${sua} tệp`);
} else {
  console.error('Dùng: --lap | --gan'); process.exit(2);
}
