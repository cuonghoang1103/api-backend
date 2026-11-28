/**
 * Xuất dữ liệu "câu nền" cho app iOS CT Language (28/11/2026) — hợp đồng: ios-app/docs/ctlanguage-cau-nen-hop-dong.md.
 *   - en: "1000 câu nền" (frontend/src/app/language/[code]/cau-nen/du-lieu/ngayN.ts) — đơn vị = NGÀY.
 *   - ja: "Luyện câu Dekiru Bài 1–10" (frontend/src/app/language/[code]/dekiru/bai/luyenCau*.ts, khối `luyenCau`) — đơn vị = BÀI.
 * Ra content/ctlanguage/cau-nen/{en,ja}.json — tuyến GET /api/v1/ctlanguage/cau-nen đọc thẳng (không DB).
 * Kiểm (hỏng ⇒ thoát 1): id duy nhất · mỗi câu có cau + vi · `vi` không trùng trong một đơn vị · ≥ 4 câu/đơn vị ·
 * `manh` ghép lại = câu bỏ ruby + khoảng trắng.
 *   npx tsx scripts/xuat-cau-nen.mts
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const GOC = path.resolve(import.meta.dirname, '..');
const LANG = path.join(GOC, 'frontend/src/app/language/[code]');
const RA = path.join(GOC, 'content/ctlanguage/cau-nen');
const PHIEN_BAN = new Date().toISOString().slice(0, 10);

type Cau = { id: string; cau: string; vi: string; doc?: string; ro?: string; khung?: string; dapAnKhac?: string[]; goiY?: string[]; manh?: string[]; ghiChu?: string };
type Khung = { ma: string; mau: string; vi?: string; giaiThich?: string; viDu?: string[] };
type DonVi = { so: number; ma: string; ten: string; moTa?: string; chuDe?: string; bieuTuong?: string; soCau: number; khung: Khung[]; cau: Cau[] };

const boRuby = (s: string) => s.replace(/\{([^|}]+)\|[^}]+\}/g, '$1');
const kanaRuby = (s: string) => s.replace(/\{[^|}]+\|([^}]+)\}/g, '$1');
const bam = (s: string) => createHash('sha1').update(s).digest('hex').slice(0, 8);
const ngan = (s: string, n = 14) => (s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…');

/** Tách câu Nhật thành mảnh xếp câu: cắt SAU trợ từ / dấu câu, không cắt giữa cụm ruby. Mảnh là chữ bỏ ruby. */
function manhNhat(cau: string): string[] {
  const dv: string[] = []; // đơn vị không tách: một cụm ruby hoặc một ký tự
  for (const m of cau.matchAll(/\{[^}]+\}|[\s\S]/g)) dv.push(m[0]);
  const TRO = new Set(['は', 'が', 'を', 'に', 'へ', 'で', 'と', 'も', 'の', 'か', 'ね', 'よ', '、', '。', '？', '！', '——']);
  const ra: string[] = []; let cur = '';
  for (let i = 0; i < dv.length; i++) {
    const x = dv[i]!;
    if (/^\s$/.test(x)) { if (cur) { ra.push(cur); cur = ''; } continue; }
    cur += boRuby(x);
    const sau = dv[i + 1] ?? '';
    if (TRO.has(x) && !TRO.has(sau) && cur.length >= 2) { ra.push(cur); cur = ''; }
  }
  if (cur) ra.push(cur);
  // gộp mảnh 1 ký tự dấu câu vào mảnh trước
  return ra.reduce<string[]>((a, m) => { if (/^[、。？！]$/.test(m) && a.length) a[a.length - 1] += m; else a.push(m); return a; }, []);
}

/** Mảnh từ DSL (có ruby) ⇒ bỏ ruby; trợ từ / dấu câu đứng riêng thì dính vào mảnh trước ("私" + "は" ⇒ "私は"). */
function ghepTroTu(tu: string[]): string[] {
  const ra: string[] = [];
  for (const t0 of tu) {
    const t = boRuby(t0);
    if (ra.length && /^(は|が|を|に|へ|で|と|も|の|か|ね|よ|や|から|まで|より|には|では|へは|とは|にも|でも|、|。|？|！|——)+$/.test(t)) ra[ra.length - 1] += t;
    else ra.push(t);
  }
  return ra;
}

async function xuatEn(): Promise<DonVi[] | null> {
  const f = path.join(LANG, 'cau-nen/du-lieu/index.ts');
  if (!existsSync(f)) return null;
  const { napNgay } = await import(f);
  const ds: DonVi[] = [];
  for (let n = 1; n <= 30; n++) {
    const p = napNgay(n); if (!p) continue;
    const d = await p; if (!d?.cau?.length) continue;
    const maKhung = new Map<string, string>();
    const khung: Khung[] = [];
    for (const c of d.cau) if (c.khung && !maKhung.has(c.khung)) {
      const ma = `k${maKhung.size + 1}`; maKhung.set(c.khung, ma);
      const k = d.bai?.khung?.find((x: { mau: string }) => x.mau === c.khung);
      khung.push({ ma, mau: c.khung, vi: k?.vi, viDu: d.cau.filter((x: { khung: string }) => x.khung === c.khung).slice(0, 2).map((x: { en: string }) => x.en) });
    }
    ds.push({
      so: n, ma: `en-d${String(n).padStart(2, '0')}`, ten: d.ten, moTa: d.mucTieu, chuDe: ngan(d.ten.replace(/\s*\(.*$/, '')),
      bieuTuong: d.on ? 'arrow.triangle.2.circlepath' : 'text.bubble.fill', soCau: d.cau.length, khung,
      cau: d.cau.map((c: { id: string; en: string; vi: string; alt?: string[]; khung: string; loi?: string; goi?: string }) => ({
        id: `en-${c.id}`, cau: c.en, vi: c.vi, khung: maKhung.get(c.khung), dapAnKhac: c.alt?.length ? c.alt : undefined,
        goiY: c.goi ? c.goi.split(/[,;·]\s*/).filter(Boolean) : undefined, ghiChu: c.loi,
      })),
    });
  }
  return ds;
}

async function xuatJa(): Promise<DonVi[]> {
  const ds: DonVi[] = [];
  const nguon: Record<number, unknown[]> = {};
  for (const t of ['luyenCauB13.ts', 'luyenCauB47.ts', 'luyenCauB810.ts']) {
    const m = await import(path.join(LANG, 'dekiru/bai', t));
    for (const [k, v] of Object.entries(m.LUYEN_CAU as Record<string, unknown[]>)) nguon[+k] = v;
  }
  for (const n of Object.keys(nguon).map(Number).sort((a, b) => a - b)) {
    const cau: Cau[] = []; const np = new Map<string, string>(); let ten = `Bài ${n}`;
    const duyet = (x: unknown): void => {
      if (Array.isArray(x)) { x.forEach(duyet); return; }
      if (!x || typeof x !== 'object') return;
      const o = x as Record<string, unknown>;
      if (o.id === `b${n}-luyen-cau` && typeof o.title === 'string') ten = o.title.split('|||').pop()!.trim();
      if (o.t === 'luyenCau' && Array.isArray(o.cau)) {
        for (const c of o.cau as { vi: string; ja: string; ro: string; alt?: string[]; np?: string; goi?: string; tu?: string[] }[]) {
          if (c.np && !np.has(c.np)) np.set(c.np, `m${np.size + 1}`);
          cau.push({
            id: `ja-b${n}-${bam(c.ja)}`, cau: c.ja, vi: c.vi, doc: kanaRuby(c.ja), ro: c.ro, khung: c.np ? np.get(c.np) : undefined,
            dapAnKhac: c.alt?.length ? c.alt : undefined, goiY: c.goi ? [c.goi] : undefined, manh: c.tu?.length ? ghepTroTu(c.tu) : manhNhat(c.ja),
          });
        }
        return;
      }
      for (const v of Object.values(o)) duyet(v);
    };
    duyet(nguon[n]);
    if (!cau.length) continue;
    // bỏ câu trùng (cùng ja) — giữ câu đầu
    const thay = new Set<string>(); const sach = cau.filter((c) => (thay.has(c.id) ? false : (thay.add(c.id), true)));
    ds.push({
      so: n, ma: `ja-b${String(n).padStart(2, '0')}`, ten, chuDe: ngan(ten.replace(/^Bài\s*\d+\s*[·:—-]?\s*/, '')), bieuTuong: 'character.book.closed.fill',
      soCau: sach.length, khung: [...np.entries()].map(([mau, ma]) => ({ ma, mau, viDu: sach.filter((c) => c.khung === ma).slice(0, 2).map((c) => c.cau) })),
      cau: sach,
    });
  }
  return ds;
}

function kiem(nn: string, ds: DonVi[]): string[] {
  const loi: string[] = []; const id = new Set<string>();
  for (const d of ds) {
    if (d.cau.length < 4) loi.push(`${nn} ${d.ma}: chỉ ${d.cau.length} câu (< 4)`);
    const vi = new Set<string>();
    for (const c of d.cau) {
      if (id.has(c.id)) loi.push(`${nn} id trùng ${c.id}`); id.add(c.id);
      if (!c.cau?.trim() || !c.vi?.trim()) loi.push(`${nn} ${c.id}: thiếu cau/vi`);
      if (vi.has(c.vi)) loi.push(`${nn} ${d.ma}: vi trùng "${c.vi}"`); vi.add(c.vi);
      if (c.manh && c.manh.join('').replace(/\s/g, '') !== boRuby(c.cau).replace(/\s/g, '')) loi.push(`${nn} ${c.id}: manh không ghép lại thành câu`);
    }
  }
  return loi;
}

mkdirSync(RA, { recursive: true });
const en = await xuatEn(); const ja = await xuatJa();
const loi = [...(en ? kiem('en', en) : []), ...kiem('ja', ja)];
if (en) writeFileSync(path.join(RA, 'en.json'), JSON.stringify({ nn: 'en', ten: '1000 câu nền', moTa: '30 ngày nói được câu tiếng Anh từ số 0 — dịch 2 chiều, nghe, nói, viết tay', kieu: 'ngay', mucTieuNgay: 34, phienBan: PHIEN_BAN, donVi: en }) + '\n');
writeFileSync(path.join(RA, 'ja.json'), JSON.stringify({ nn: 'ja', ten: 'Luyện câu Dekiru Bài 1–10', moTa: 'JPD113 (Bài 1–3) + JPD123 (Bài 4–7) — dịch 2 chiều, nghe – chép, viết tay', kieu: 'bai', mucTieuNgay: 20, phienBan: PHIEN_BAN, donVi: ja }) + '\n');
console.log(`en: ${en ? `${en.length} ngày · ${en.reduce((a, d) => a + d.cau.length, 0)} câu` : 'chưa có dữ liệu'} · ja: ${ja.length} bài · ${ja.reduce((a, d) => a + d.cau.length, 0)} câu`);
if (loi.length) { console.error(`✗ ${loi.length} lỗi:\n` + loi.slice(0, 30).join('\n')); process.exit(1); }
console.log('✓ kiểm sạch');
