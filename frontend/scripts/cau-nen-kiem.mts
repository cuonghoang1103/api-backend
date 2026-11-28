// Bộ kiểm nội dung "1000 câu nền — dịch 2 chiều" (/language/en/cau-nen). Chạy từ thư mục frontend:
//   npm run cau-nen:kiem                 # kiểm các ngày đã soạn
//   npm run cau-nen:kiem -- --nghiem     # bắt buộc đủ 30 ngày + ≥ 1000 câu (chạy ở prebuild)
//   npm run cau-nen:kiem -- --xuat       # kiểm xong thì xuất JSON cho app iOS: public/sach-hoc/cau-nen/{index,ngay-N}.json
// Kiểm: id `cn<N>-NN` liên tiếp, không trùng · mỗi câu có vi/en/khung · en chỉ ký tự ASCII hợp lệ, viết hoa đầu, có dấu cuối ·
// câu mẫu tự khớp bộ chấm, alt không trùng câu mẫu sau chuẩn hoá · không trùng câu (en hay vi) giữa các ngày · số câu khớp mục
// lục · tuần 1 (ngày 1–7) câu ≤ 8 từ · bài khung đủ phần · từ vựng 12–20 từ, ảnh có trong danh mục Fluent hoặc đã khai prompt ai-* ·
// hội thoại / đoạn mẫu cùng luật ký tự · khối ngữ pháp thuộc loại được phép.
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const GOC = dirname(fileURLToPath(import.meta.url));
const DIR = join(GOC, '..', 'src/app/language/[code]/cau-nen');
const args = process.argv.slice(2);
const NGHIEM = args.includes('--nghiem');
const XUAT = args.includes('--xuat');
const la = args.filter((a) => !['--nghiem', '--xuat'].includes(a));
if (la.length) { console.error(`Cờ lạ: ${la.join(' ')} — dùng --nghiem / --xuat`); process.exit(2); }

const { MUC_LUC } = await import(pathToFileURL(join(DIR, 'muc-luc.ts')).href) as { MUC_LUC: { n: number; ten: string; soCau: number; anh: string }[] };
const { chuanHoa, khop, dapAn, soTu8 } = await import(pathToFileURL(join(DIR, 'chamCau.ts')).href) as typeof import('../src/app/language/[code]/cau-nen/chamCau.ts');

// Trong ảnh Docker (chỉ có frontend/) không có scripts/ ở gốc repo ⇒ BỎ QUA kiểm tên ảnh (máy dev/CI vẫn kiểm đủ).
// 28/11: thiếu cái này làm vỡ build frontend ở máy nhà (ENOENT fluent-catalog.json).
const CAT_FILE = join(GOC, '..', '..', 'scripts/hinh/fluent-catalog.json');
const CO_DANH_MUC = existsSync(CAT_FILE);
const CAT = (CO_DANH_MUC ? JSON.parse(readFileSync(CAT_FILE, 'utf8')).hinh : {}) as Record<string, string>;
const AI: Record<string, string> = {};
const AI_DIR = join(GOC, '..', '..', 'scripts/hinh/ai');
if (CO_DANH_MUC) for (const f of readdirSync(AI_DIR).filter((x) => x.endsWith('.json'))) Object.assign(AI, JSON.parse(readFileSync(join(AI_DIR, f), 'utf8')));
else console.warn('⚠ không thấy scripts/hinh/ ở gốc repo (build Docker) — bỏ qua kiểm tên ảnh');

const EN_OK = /^[A-Za-z0-9 ,.'?!:;$%&()\-/]+$/;
const KHOI_NP = new Set(['h', 'p', 'patterns', 'table', 'note', 'examples', 'recap', 'rule', 'sodo', 'hinh', 'canh']);
let loi = 0;
let canhBao = 0;
const bao = (n: number | string, x: string) => { loi++; console.error(`✗ N${n}: ${x}`); };
const nhac = (n: number | string, x: string) => { canhBao++; console.warn(`⚠ N${n}: ${x}`); };
const kiemEn = (n: number, ten: string, en: string, cau = true) => {
  if (!en || !EN_OK.test(en)) bao(n, `${ten}: ký tự lạ / rỗng trong "${en}"`);
  else if (/\s{2,}|^\s|\s$/.test(en)) bao(n, `${ten}: khoảng trắng thừa "${en}"`);
  else if (cau && !/^[A-Z0-9"']/.test(en)) bao(n, `${ten}: chưa viết hoa đầu câu "${en}"`);
  else if (cau && !/[.?!]$/.test(en)) bao(n, `${ten}: thiếu dấu câu cuối "${en}"`);
};
const kiemAnh = (n: number, anh: string | undefined, ten: string) => {
  if (!anh || !CO_DANH_MUC) return;
  if (anh.startsWith('ai-')) { if (!AI[anh]) bao(n, `${ten}: ảnh ${anh} chưa khai prompt trong scripts/hinh/ai/*.json`); }
  else if (!CAT[anh]) bao(n, `${ten}: ảnh "${anh}" không có trong fluent-catalog.json`);
};

const enToanBo = new Map<string, string>();
const viToanBo = new Map<string, string>();
const daNap: { n: number; d: any }[] = [];
let tong = 0;

for (const m of MUC_LUC) {
  kiemAnh(m.n, m.anh, 'thẻ ngày');
  const tep = join(DIR, 'du-lieu', `ngay${m.n}.ts`);
  if (!existsSync(tep)) { (NGHIEM ? bao : nhac)(m.n, 'chưa soạn (thiếu du-lieu/ngay' + m.n + '.ts)'); continue; }
  let d: any;
  try { d = (await import(pathToFileURL(tep).href))[`NGAY_${m.n}`]; } catch (e) { bao(m.n, `không nạp được: ${(e as Error).message.split('\n')[0]}`); continue; }
  if (!d || d.n !== m.n) { bao(m.n, `không export NGAY_${m.n} đúng số ngày`); continue; }
  if (!d.ten || !d.mucTieu) bao(m.n, 'thiếu ten / mucTieu');
  if (!!d.on !== !!m.on) bao(m.n, 'cờ `on` lệch mục lục');
  // Bài khung
  const b = d.bai ?? {};
  if ((b.y?.length ?? 0) < 3) bao(m.n, 'bai.y < 3 ý');
  if (!b.khung?.length) bao(m.n, 'bai.khung rỗng');
  if ((b.soSanh?.length ?? 0) < 2) bao(m.n, 'bai.soSanh < 2 dòng');
  for (const x of b.soSanh ?? []) { kiemEn(m.n, 'soSanh', x.en); if (!x.vi || !x.tungChu || !x.viSao) bao(m.n, 'soSanh thiếu trường'); }
  if ((b.viDu?.length ?? 0) < 3 || b.viDu.length > 5) bao(m.n, `bai.viDu cần 3–5 (có ${b.viDu?.length ?? 0})`);
  for (const x of b.viDu ?? []) { kiemEn(m.n, 'viDu', x.en); if (!x.vi) bao(m.n, `viDu thiếu vi: ${x.en}`); }
  // Ngữ pháp
  for (const k of d.nguPhap ?? []) {
    if (!KHOI_NP.has(k.t)) bao(m.n, `nguPhap: khối "${k.t}" không được phép`);
    if (k.t === 'examples') for (const x of k.items) kiemEn(m.n, 'nguPhap.examples', x.en);
    if (k.t === 'sodo' && k.kind === 'compare') for (const c of k.cols) kiemAnh(m.n, c.anh, 'nguPhap.compare');
  }
  if (m.n <= 10 && !d.nguPhap?.length) bao(m.n, 'thiếu nguPhap (bắt buộc ngày 1–10)');
  // Từ vựng
  const tv = d.tuVung ?? [];
  if (tv.length && (tv.length < 12 || tv.length > 20)) bao(m.n, `tuVung cần 12–20 từ (có ${tv.length})`);
  if (m.n <= 10 && !tv.length) bao(m.n, 'thiếu tuVung (bắt buộc ngày 1–10)');
  const tuNgay = new Set<string>();
  for (const t of tv) {
    if (!t.w || !t.vi || !t.loai || !t.ex || !t.exVi) bao(m.n, `tuVung "${t.w}" thiếu trường`);
    if (tuNgay.has(t.w.toLowerCase())) bao(m.n, `tuVung trùng "${t.w}"`);
    tuNgay.add(t.w.toLowerCase());
    kiemEn(m.n, `tuVung.w`, t.w, false);
    kiemEn(m.n, `tuVung.ex(${t.w})`, t.ex);
    kiemAnh(m.n, t.anh, `tuVung ${t.w}`);
  }
  // Hội thoại + viết
  for (const l of d.hoiThoai?.luot ?? []) { kiemEn(m.n, 'hoiThoai', l.en); if (!l.vi || !l.ten) bao(m.n, 'hoiThoai thiếu vi/ten'); }
  if (m.n <= 10 && (d.hoiThoai?.luot?.length ?? 0) < 4) bao(m.n, 'hoiThoai < 4 lượt (bắt buộc ngày 1–10)');
  if (d.viet) {
    if (d.viet.y.length < 3) bao(m.n, 'viet.y < 3');
    if (d.viet.chinhTa.length < 2) bao(m.n, 'viet.chinhTa < 2');
    if (d.viet.mau.length < 3 || d.viet.mau.length > 6) bao(m.n, 'viet.mau cần 3–6 câu');
    for (const x of d.viet.mau) kiemEn(m.n, 'viet.mau', x.en);
  } else if (m.n <= 10) bao(m.n, 'thiếu viet (bắt buộc ngày 1–10)');
  // Câu
  const cau = d.cau ?? [];
  if (cau.length !== m.soCau) bao(m.n, `có ${cau.length} câu, mục lục ghi ${m.soCau}`);
  if (cau.length < 30) bao(m.n, `mới ${cau.length} câu (cần ≥ 30)`);
  cau.forEach((c: any, i: number) => {
    const id = `cn${m.n}-${String(i + 1).padStart(2, '0')}`;
    if (c.id !== id) bao(m.n, `id ${c.id} — cần ${id} (liên tiếp)`);
    if (!c.vi?.trim() || !c.en?.trim() || !c.khung?.trim()) bao(m.n, `${c.id}: thiếu vi / en / khung`);
    kiemEn(m.n, c.id, c.en);
    for (const a of c.alt ?? []) kiemEn(m.n, `${c.id}.alt`, a);
    if (!khop(c.en, dapAn(c))) bao(m.n, `${c.id}: câu mẫu không tự khớp bộ chấm`);
    const ds = dapAn(c).map(chuanHoa);
    if (new Set(ds).size !== ds.length) bao(m.n, `${c.id}: alt trùng câu mẫu sau chuẩn hoá (thừa) — ${JSON.stringify(c.alt)}`);
    if (m.n <= 7 && soTu8(c.en) > 8) bao(m.n, `${c.id}: tuần 1 câu ≤ 8 từ — "${c.en}" có ${soTu8(c.en)} từ`);
    if (/[.!?]$/.test(c.vi) === false) bao(m.n, `${c.id}: câu Việt thiếu dấu cuối "${c.vi}"`);
    const ke = chuanHoa(c.en);
    if (enToanBo.has(ke)) bao(m.n, `${c.id}: trùng câu Anh với ${enToanBo.get(ke)} — "${c.en}"`); else enToanBo.set(ke, c.id);
    const kv = c.vi.toLowerCase().replace(/[.,!?]/g, '').trim();
    if (viToanBo.has(kv)) bao(m.n, `${c.id}: trùng câu Việt với ${viToanBo.get(kv)} — "${c.vi}"`); else viToanBo.set(kv, c.id);
  });
  tong += cau.length;
  daNap.push({ n: m.n, d });
  console.log(`${loi ? '…' : '✓'} N${m.n}: ${cau.length} câu · ${tv.length} từ · ${d.nguPhap?.length ?? 0} khối ngữ pháp · hội thoại ${d.hoiThoai?.luot?.length ?? 0} lượt`);
}

const duNgay = daNap.length === MUC_LUC.length;
if (tong < 1000 && (NGHIEM || duNgay)) bao('*', `tổng ${tong} câu < 1000`);
console.log(`\nTổng: ${daNap.length}/${MUC_LUC.length} ngày · ${tong} câu · ${enToanBo.size} câu Anh khác nhau · ${loi} lỗi · ${canhBao} cảnh báo`);

if (XUAT && !loi) {
  // JSON cho app iOS CT Language — cùng chỗ các khoá sách khác (public/sach-hoc/, .gitignore, sinh lúc build).
  const RA = join(GOC, '..', 'public', 'sach-hoc', 'cau-nen');
  mkdirSync(RA, { recursive: true });
  const bam = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);
  const tep: Record<string, string> = {};
  for (const { n, d } of daNap) { const s = JSON.stringify(d); writeFileSync(join(RA, `ngay-${n}.json`), s); tep[`ngay-${n}.json`] = bam(s); }
  const muc = { khoa: 'cau-nen', ten: '1000 câu nền — dịch 2 chiều', stage: 'caunen1', tongCau: tong, mucLuc: MUC_LUC, tep };
  const phienBan = bam(JSON.stringify(muc));
  writeFileSync(join(RA, 'index.json'), JSON.stringify({ ...muc, phienBan }));
  console.log(`→ public/sach-hoc/cau-nen/: index.json + ${daNap.length} tệp ngày (phienBan ${phienBan})`);
}
process.exit(loi ? 1 : 0);
