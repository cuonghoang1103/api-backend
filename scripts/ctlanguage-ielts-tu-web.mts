/**
 * CT Language — đưa đề IELTS của WEB (phòng thi máy tính `frontend/…/ielts/thi-may/de/*.ts`, tự soạn 10–11/2026) lên app
 * theo đúng khuôn thi thử (`content/ctlanguage/de-thi/_KHUON.md`) — KHÔNG chép tay: chạy lại script là có bản mới.
 *
 *   npx tsx scripts/ctlanguage-ielts-tu-web.mts          # ghi đè ielts-de-*.json, ielts-viet-de-*.json, de-thi-noi/ielts-noi-de-*.json
 *
 * Mỗi bộ web (Listening + Reading + Writing + Speaking) ⇒ 3 đề app:
 *   · `ielts-de-N`       (cap IELTS)      Listening 40 câu (4 part, mỗi part MỘT bài nghe liền) + Reading 40 câu (3 passage)
 *   · `ielts-viet-de-N`  (cap IELTS-VIET) Writing Task 1 + Task 2 (`kieu: viet`, AI chấm qua /ielts/thi-may/cham-viet)
 *   · `de-thi-noi/ielts-noi-de-N` (cap IELTS-NOI) kịch bản giám khảo Part 1–2–3 (`services/ctlanguage/thiNoi.ts`)
 * Đổi dạng câu: ô điền ⇒ `dien`; mcq / T-F-NG / nối / tiêu đề / bản đồ ⇒ `chon` (hộp chữ cái thành danh sách lựa chọn);
 * "Choose TWO" ⇒ hai câu `chon` (chữ cái đứng trước / đứng sau theo bảng chữ cái). Hình (bản đồ, sơ đồ) giữ nguyên khuôn `hinh`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { kiemDe, type BangBand, type CauThi, type DeThi, type NhomCau, type PhanThi } from '../src/services/ctlanguage/thiThuan.js';
import { kiemDeNoi, deNoiIelts, type NguonNoiIelts } from '../src/services/ctlanguage/thiNoiThuan.js';

const GOC = path.join(process.cwd(), 'frontend/src/app/language/[code]/ielts/thi-may/de');
const RA = path.join(process.cwd(), 'content/ctlanguage/de-thi');
const RA_NOI = path.join(process.cwd(), 'content/ctlanguage/de-thi-noi');

/** Bộ đề web ⇒ số đề trên app (xếp theo độ khó tăng dần; Đề 0 web là test đầu vào bậc thang ⇒ đề 4). */
const BO = [
  { so: 1, nghe: 'nghe-de1', doc: 'doc-de1', viet: 'viet-de1', noi: 'noi-de1', muc: 'band 3.5–4.5' },
  { so: 2, nghe: 'nghe-de2', doc: 'doc-de2', viet: 'viet-de2', noi: 'noi-de2', muc: 'band 4.5' },
  { so: 3, nghe: 'nghe-de3', doc: 'doc-de3', viet: 'viet-de3', noi: 'noi-de3', muc: 'band 5.0' },
  { so: 4, nghe: 'nghe-00', doc: 'doc-00', viet: 'viet-00', noi: 'noi-00', muc: 'bậc thang band 4.0–8.0' },
  { so: 5, nghe: 'nghe-01', doc: 'doc-01', viet: 'viet-01', noi: 'noi-06', muc: 'band 6.0–7.5' },
];

const BAND_NGHE: BangBand = [[39, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5], [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 2]];
const BAND_DOC: BangBand = [[39, 9], [37, 8.5], [35, 8], [33, 7.5], [30, 7], [27, 6.5], [23, 6], [19, 5.5], [15, 5], [13, 4.5], [10, 4], [8, 3.5], [6, 3], [4, 2.5], [0, 2]];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Bat = any;
async function nap(id: string): Promise<Bat> {
  const m = await import(path.join(GOC, `${id}.ts`));
  const v = Object.values(m).find((x) => x && typeof x === 'object' && (x as Bat).id === id);
  if (!v) throw new Error(`không thấy đề ${id}`);
  return v;
}

const boDam = (s: string) => String(s ?? '').replace(/\*\*/g, '');
/** Giải thích của web: bỏ **đậm**, bỏ câu dẫn về bài học web (📘 Ôn …). */
const giaiThich = (vi: string) => {
  const s = boDam(vi).replace(/\s*📘[^.]*\.(?=\s|$)/g, '').replace(/\s+/g, ' ').trim();
  return s.length >= 20 ? s : `${s} (Xem lại đoạn chứa đáp án trong bài.)`;
};
/** `[[n]]` của câu đang hỏi ⇒ `___`; ô của câu khác ⇒ `(n) …`. */
const oTrong = (s: string, n: number) => boDam(s).replace(/\[\[(\d+)\]\]/g, (_, k) => (Number(k) === n ? '___' : `(${k}) …`));
const coO = (s: string, n: number) => s.includes(`[[${n}]]`);
const dongSach = (s: string) => boDam(s).replace(/^## /, '').replace(/^→ /, '→ ').replace(/\[\[(\d+)\]\]/g, '($1) ______');

function chiSo(ds: { k: string }[], a: string, o: string): number {
  const i = ds.findIndex((x) => x.k.toLowerCase() === a.trim().toLowerCase());
  if (i < 0) throw new Error(`${o}: đáp án "${a}" không có trong hộp ${ds.map((x) => x.k).join('')}`);
  return i;
}

/** Một nhóm web ⇒ các câu app (+ phần chữ chung của nhóm để ghép vào `doan`). */
function doiNhom(g: Bat, dapAn: Record<number, Bat>, o: string, tienTo: string): { cau: CauThi[]; khung: string } {
  const cau: CauThi[] = [];
  const hd = boDam(g.huongDan).replace(/\n/g, ' ');
  const dau = `Câu ${g.tu}–${g.den}. ${hd}`;
  let khung = '';
  const them = (n: number, c: Omit<CauThi, 'id' | 'giaiThich'>) => {
    const d = dapAn[n];
    if (!d) throw new Error(`${o}: thiếu đáp án câu ${n}`);
    cau.push({ id: `${tienTo}${n}`, ...c, giaiThich: giaiThich(d.vi) });
  };
  const hop: { k: string; t: string }[] | undefined = g.hop?.ds;
  const luaChonHop = () => hop!.map((x) => (x.t === x.k ? x.k : `${x.k}. ${boDam(x.t)}`));

  if (g.nhieu) {
    const ns: number[] = g.nhieu.ns;
    const chon: { k: string; t: string }[] = g.nhieu.chon;
    const dung = [...new Set(ns.flatMap((n) => dapAn[n].a as string[]))].map((a) => chiSo(chon, a, o)).sort((a, b) => a - b);
    if (dung.length !== ns.length) throw new Error(`${o}: mcq2 cần ${ns.length} đáp án khác nhau`);
    ns.forEach((n, i) => them(n, {
      kieu: 'chon',
      de: `${hd}\n${boDam(g.nhieu.s)}\n(Câu ${ns.join(' và ')} cùng một câu hỏi — ở câu này chọn đáp án đứng ${i === 0 ? 'TRƯỚC' : 'SAU'} theo bảng chữ cái.)`,
      luaChon: chon.map((x) => boDam(x.t)), dapAn: dung[i]!,
    }));
    return { cau, khung };
  }

  const dong: string[] = g.dong ?? [];
  if (g.bang) {
    const b = g.bang as { dau: string[]; hang: string[][] };
    khung = [g.tieuDe ? boDam(g.tieuDe).toUpperCase() : '', dau, ...b.hang.map((h) => h.map((x, i) => `${b.dau[i]}: ${dongSach(x)}`).join(' · '))].filter(Boolean).join('\n');
    for (let n = g.tu; n <= g.den; n++) {
      const h = b.hang.find((r) => r.some((x) => coO(x, n)));
      if (!h) throw new Error(`${o}: không thấy ô [[${n}]] trong bảng`);
      const i = h.findIndex((x) => coO(x, n));
      const ngu = h.filter((x, j) => j !== i && !/\[\[/.test(x)).slice(0, 1).map((x) => boDam(x));
      them(n, { kieu: 'dien', de: `${hd}\n${g.tieuDe ? `${boDam(g.tieuDe)} — ` : ''}${ngu.length ? `${ngu[0]} — ` : ''}${b.dau[i]}: ${oTrong(h[i]!, n)}`, dapAn: dapAn[n].a });
    }
    return { cau, khung };
  }
  if (dong.length && !g.cau) {
    khung = [g.tieuDe ? boDam(g.tieuDe).toUpperCase() : '', dau, ...dong.map(dongSach)].filter(Boolean).join('\n');
    for (let n = g.tu; n <= g.den; n++) {
      if (g.hinh?.ve?.some((v: Bat) => v.t === 'o' && v.n === n) && !dong.some((d) => coO(d, n))) {
        them(n, { kieu: 'dien', de: `${hd}\n${g.tieuDe ? `${boDam(g.tieuDe)} — ` : ''}Ô số ${n} trên hình: ___`, dapAn: dapAn[n].a });
        continue;
      }
      const d = dong.find((x) => coO(x, n));
      if (!d) throw new Error(`${o}: không thấy ô [[${n}]]`);
      const chon = hop ? { kieu: 'chon' as const, luaChon: luaChonHop(), dapAn: chiSo(hop, dapAn[n].a[0], o) } : { kieu: 'dien' as const, dapAn: dapAn[n].a as string[] };
      them(n, { ...chon, de: `${hd}\n${g.tieuDe ? `${boDam(g.tieuDe)} — ` : ''}${oTrong(d.replace(/^## |^• |^→ /, ''), n)}` });
    }
    return { cau, khung };
  }
  if (g.hinh && !g.cau) {
    // Sơ đồ chỉ có ô số trên hình.
    for (let n = g.tu; n <= g.den; n++) them(n, { kieu: 'dien', de: `${hd}\n${g.tieuDe ? `${boDam(g.tieuDe)} — ` : ''}Ô số ${n} trên hình: ___`, dapAn: dapAn[n].a });
    return { cau, khung };
  }
  for (const c of (g.cau ?? []) as { n: number; s: string; chon?: { k: string; t: string }[] }[]) {
    const a: string[] = dapAn[c.n].a;
    const de = `${hd}\n${g.tieuDe ? `${boDam(g.tieuDe)} — ` : ''}${oTrong(c.s, c.n)}`;
    if (c.chon) them(c.n, { kieu: 'chon', de, luaChon: c.chon.map((x) => boDam(x.t)), dapAn: chiSo(c.chon, a[0]!, o) });
    else if (g.dang === 'tfng' || g.dang === 'ynng') {
      const lc = g.dang === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN'];
      const i = lc.indexOf(a[0]!.toUpperCase());
      if (i < 0) throw new Error(`${o}: đáp án ${a[0]} lạ ở câu ${c.n}`);
      them(c.n, { kieu: 'chon', de, luaChon: lc, dapAn: i });
    } else if (hop) them(c.n, { kieu: 'chon', de, luaChon: luaChonHop(), dapAn: chiSo(hop, a[0]!, o) });
    else them(c.n, { kieu: 'dien', de: de.includes('___') ? de : `${de}\n___`, dapAn: a });
  }
  return { cau, khung };
}

function phanNghe(d: Bat): PhanThi {
  const nhom: NhomCau[] = d.phan.map((p: Bat) => {
    const con = (p.nhom as Bat[]).map((g) => ({ g, ...doiNhom(g, d.dapAn, `${d.id}/${g.id}`, 'L') }));
    const hinh = con.find((x) => x.g.hinh)?.g.hinh;
    const khung = con.map((x) => x.khung).filter(Boolean).join('\n\n');
    const tu = Math.min(...con.map((x) => x.g.tu)), den = Math.max(...con.map((x) => x.g.den));
    return {
      huongDan: `Part ${p.so} — Câu ${tu}–${den}. ${p.boiCanh.split(/(?<=[.!?])\s/)[0]} Cả part là MỘT bài nghe liền, chỉ nghe MỘT lần — bấm nghe rồi lướt qua các câu của part trong lúc nghe.`,
      ...(khung ? { doan: khung } : {}),
      nghe: [{ g: 'uk-nu', t: boDam(p.dan) }, ...(p.loi as Bat[]).map((l) => ({ g: l.giong, t: boDam(l.s) }))],
      ngheLan: 1,
      ...(hinh ? { hinh } : {}),
      cau: con.flatMap((x) => x.cau),
    } satisfies NhomCau;
  });
  return { id: 'nghe', ten: 'Listening', kyNang: 'nghe', phut: d.phut ?? 30, diemToiDa: 40, band: BAND_NGHE, nhom };
}

function phanDoc(d: Bat): PhanThi {
  const nhom: NhomCau[] = [];
  for (const p of d.phan as Bat[]) {
    const bai = [`READING PASSAGE ${p.so}`, boDam(p.tieuDe).toUpperCase(), p.phuDe ? boDam(p.phuDe) : '', '', ...(p.doan as Bat[]).map((x) => `${x.nhan ? `${x.nhan}  ` : ''}${boDam(x.s)}`)].filter((x, i) => x !== '' || i === 3).join('\n');
    for (const g of p.nhom as Bat[]) {
      const { cau, khung } = doiNhom(g, d.dapAn, `${d.id}/${g.id}`, 'R');
      nhom.push({
        huongDan: `Passage ${p.so} — Câu ${g.tu}–${g.den}. ${boDam(g.huongDan).replace(/\n/g, ' ')}`,
        doan: khung ? `${bai}\n\n────────\n${khung}` : bai,
        ...(g.hinh ? { hinh: g.hinh } : {}),
        cau,
      });
    }
  }
  return { id: 'doc', ten: 'Academic Reading', kyNang: 'doc', phut: d.phut ?? 60, diemToiDa: 40, band: BAND_DOC, nhom };
}

/** Số liệu Task 1 ở dạng chữ (app không vẽ biểu đồ) — CHỈ số liệu, không kèm phần "Main features" của `moTaSo`. */
function soLieu(t: Bat): string | undefined {
  const mot = (f: Bat): string => {
    const dong = [`${f.title}${f.unit ? ` (${f.unit})` : ''}`];
    if (f.series?.length) for (const s of f.series) dong.push(`${s.name}: ${(f.categories ?? []).map((c: string, i: number) => `${c} — ${s.values[i]}`).join('; ')}`);
    if (f.slices?.length) dong.push(f.slices.map((s: Bat) => `${s.label} — ${s.value}%`).join('; '));
    if (f.steps?.length) dong.push(f.steps.map((s: Bat, i: number) => `${i + 1}. ${s.label}${s.note ? ` (${s.note})` : ''}`).join(' → '));
    return dong.join('\n');
  };
  if (t.figure) return [mot(t.figure), t.figure2 ? mot(t.figure2) : ''].filter(Boolean).join('\n\n');
  if (t.bieuDo?.loai === 'cot') return [`${t.bieuDo.tieuDe} (${t.bieuDo.donVi})`, ...t.bieuDo.chuoi.map((s: Bat) => `${s.ten}: ${t.bieuDo.nhom.map((c: string, i: number) => `${c} — ${s.so[i]}`).join('; ')}`)].join('\n');
  if (t.bieuDo?.loai === 'bang') return [t.bieuDo.tieuDe, t.bieuDo.dau.join(' | '), ...t.bieuDo.hang.map((h: string[]) => h.join(' | '))].join('\n');
  return t.moTaSo ? String(t.moTaSo).split(/Main features?:/i)[0]!.trim() : undefined;
}

function deViet(so: number, muc: string, d: Bat): DeThi {
  return {
    id: `ielts-viet-de-${so}`, nn: 'en', kyThi: 'IELTS', cap: 'IELTS-VIET', ten: `IELTS Writing · Đề ${so}`,
    moTa: `Academic Writing ${muc}: ${String(d.moTa).replace(/\s+/g, ' ')}`.slice(0, 300), diemDat: 60, xepHang: false,
    phan: [{
      id: 'viet', ten: 'Academic Writing', kyNang: 'viet', phut: d.phut ?? 60, diemToiDa: 90,
      nhom: (d.task as Bat[]).map((t) => {
        const hinh = t.so === 1 ? soLieu(t) : undefined;
        return {
          huongDan: `Writing Task ${t.so} — nên dành khoảng ${t.phut} phút, viết ít nhất ${t.minTu} từ.${t.so === 2 ? ' Task 2 tính điểm gấp đôi Task 1.' : ' App chưa vẽ biểu đồ: số liệu của đề ghi bằng chữ ngay dưới đề.'}`,
          cau: [{
            id: String(t.so), kieu: 'viet', vietTask: t.so, vietToiThieu: t.minTu, diem: t.so,
            de: boDam(t.de), ...(hinh ? { moTaHinh: hinh } : {}),
            mau: boDam(t.mau.s),
            giaiThich: `Gợi ý làm bài: ${(t.goiY as string[]).map(boDam).join(' · ')} — Bài mẫu ${t.mau.band}: ${(t.mau.phanTich as string[]).map(boDam).join(' ')}`.slice(0, 4000),
          } satisfies CauThi],
        } satisfies NhomCau;
      }),
    }],
  };
}

fs.mkdirSync(RA_NOI, { recursive: true });
let loi = 0;
const ghi = (tep: string, v: unknown) => fs.writeFileSync(tep, `${JSON.stringify(v, null, 1)}\n`);
for (const b of BO) {
  const [nghe, doc, viet, noi] = await Promise.all([nap(b.nghe), nap(b.doc), nap(b.viet), nap(b.noi)]);
  const de: DeThi = {
    id: `ielts-de-${b.so}`, nn: 'en', kyThi: 'IELTS', cap: 'IELTS', ten: `IELTS Academic · Đề ${b.so}`,
    moTa: `Listening + Reading đủ 80 câu, ${b.muc}. Nghe: ${String(nghe.moTa).split(' · ').slice(0, 2).join(' · ')}… Đọc: ${String(doc.moTa).split(' · ')[0]}…`.slice(0, 300),
    diemDat: 46, xepHang: true, phan: [phanNghe(nghe), phanDoc(doc)],
  };
  const v = deViet(b.so, b.muc, viet);
  const n = deNoiIelts(b.so, b.muc, noi as NguonNoiIelts, b.noi);
  for (const [ten, l] of [[de.id, kiemDe(de)], [v.id, kiemDe(v)], [n.id, kiemDeNoi(n)]] as const) {
    if (l.length) { loi++; console.error(`✗ ${ten}:`); for (const x of l.slice(0, 20)) console.error(`    ${x}`); }
  }
  ghi(path.join(RA, `${de.id}.json`), de);
  ghi(path.join(RA, `${v.id}.json`), v);
  ghi(path.join(RA_NOI, `${n.id}.json`), n);
  console.log(`✓ ${de.id} (${de.phan.map((p) => `${p.ten} ${p.nhom.reduce((a, g) => a + g.cau.length, 0)}`).join(' · ')}) · ${v.id} · ${n.id} (${n.buoc.length} bước)`);
}
if (loi) process.exit(1);
