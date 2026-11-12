/**
 * CT Language — NHẬP TỪ ĐIỂN vào Postgres (bảng ctl_tu · ctl_khoa_tra · ctl_chu_han). docs/ct-language-app.md bước 3.
 *
 *   npx tsx scripts/ctlanguage/nhap-tu-dien.mts [--thu-muc <dir>] [--nn zh,ja,en] [--tai] [--kho-web]
 *
 * Nguồn (GIẤY PHÉP MỞ — ghi công trong app › Tôi › Giới thiệu):
 *   CC-CEDICT (CC BY-SA 4.0, mdbg.net) · JMdict_e + KANJIDIC2 (CC BY-SA 4.0, EDRDG) · Unihan (Unicode License).
 *   Thư mục mặc định `$CTL_DU_LIEU` hoặc `~/Downloads/ctl-du-lieu`; `--tai` ⇒ thiếu tệp nào tải tệp đó (dùng trên VPS,
 *   khỏi đưa ~24 MB dữ liệu vào git).
 * Lõi nghĩa Việt: kho soạn tay `lang_vocab_words` (đọc ngay trong CSDL đang chạy) — THẮNG nguồn mở khi trùng chữ.
 *
 * Mỗi ngôn ngữ: XOÁ hết mục của `nn` rồi nạp lại (khoá tra xoá theo cascade). `ctl_chu_han` nạp lại toàn bộ.
 * Chạy lại an toàn, không đụng bảng nào khác.
 */
import 'dotenv/config';
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createGunzip, gunzipSync } from 'node:zlib';
import { createInterface } from 'node:readline';
import { execFileSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import { coKana, khoaTra, laChuHan, pinyinCoDau, romaji, sapHanViet } from '../../src/services/ctlanguage/tuDienChuan.ts';

const arg = (k: string) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
const DIR = arg('--thu-muc') ?? process.env.CTL_DU_LIEU ?? join(homedir(), 'Downloads', 'ctl-du-lieu');
const NN = (arg('--nn') ?? 'zh,ja,en').split(',');
const TAI = process.argv.includes('--tai');

const NGUON: Record<string, string> = {
  'cedict_1_0_ts_utf-8_mdbg.txt.gz': 'https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz',
  'JMdict_e.gz': 'http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz',
  'kanjidic2.xml.gz': 'http://www.edrdg.org/kanjidic/kanjidic2.xml.gz',
  'Unihan.zip': 'https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip',
};

function tep(ten: string): string {
  const p = join(DIR, ten);
  if (existsSync(p)) return p;
  if (!TAI) throw new Error(`Thiếu ${p} — chạy với --tai để tự tải.`);
  mkdirSync(DIR, { recursive: true });
  console.log(`  tải ${NGUON[ten]}`);
  execFileSync('curl', ['-sSL', '--fail', '--max-time', '600', '-o', p, NGUON[ten]], { stdio: 'inherit' });
  return p;
}

const db = new PrismaClient();
const t0 = Date.now();
const log = (...a: unknown[]) => console.log(`[${((Date.now() - t0) / 1000).toFixed(1)}s]`, ...a);

// ─── Unihan ──────────────────────────────────────────────────

type Han = { hv?: string[]; py?: string; on?: string; kun?: string; en?: string; bo?: number; net?: number; phon?: string; gian?: string; tanSuat?: number };
const unihan = new Map<string, Han>();
const cp = (u: string) => String.fromCodePoint(parseInt(u.slice(2), 16));

function napUnihan() {
  const thu = join(DIR, 'unihan');
  if (!existsSync(join(thu, 'Unihan_Readings.txt'))) {
    mkdirSync(thu, { recursive: true });
    execFileSync('unzip', ['-o', '-q', tep('Unihan.zip'), '-d', thu]);
  }
  const doc = (ten: string, f: (ch: string, k: string, v: string) => void) => {
    for (const dong of readFileSync(join(thu, ten), 'utf8').split('\n')) {
      if (!dong.startsWith('U+')) continue;
      const [u, k, v] = dong.split('\t');
      f(cp(u), k, v);
    }
  };
  const lay = (ch: string) => { let h = unihan.get(ch); if (!h) { h = {}; unihan.set(ch, h); } return h; };
  doc('Unihan_Readings.txt', (ch, k, v) => {
    const h = lay(ch);
    if (k === 'kVietnamese') h.hv = v.split(' ').filter(Boolean);
    else if (k === 'kMandarin') h.py = v.split(' ')[0];
    else if (k === 'kDefinition') h.en = v;
    else if (k === 'kJapaneseOn') h.on = v.toLowerCase();
    else if (k === 'kJapaneseKun') h.kun = v.toLowerCase();
  });
  doc('Unihan_RadicalStrokeCounts.txt', (ch, k, v) => { if (k === 'kRSUnicode') lay(ch).bo = parseInt(v, 10); });
  doc('Unihan_IRGSources.txt', (ch, k, v) => {
    if (k === 'kTotalStrokes') lay(ch).net = parseInt(v, 10);
    if (k === 'kRSUnicode') lay(ch).bo = parseInt(v, 10);
  });
  doc('Unihan_Variants.txt', (ch, k, v) => {
    const dau = cp(v.split(' ')[0].split('<')[0]);
    if (k === 'kTraditionalVariant' && dau !== ch) lay(ch).phon = dau;
    if (k === 'kSimplifiedVariant' && dau !== ch) lay(ch).gian = dau;
  });
  doc('Unihan_DictionaryLikeData.txt', (ch, k, v) => { if (k === 'kFrequency') lay(ch).tanSuat = parseInt(v, 10); });
  log('Unihan', unihan.size, 'chữ');
}

// ─── KANJIDIC2 ───────────────────────────────────────────────

type Kanji = { on: string[]; kun: string[]; en: string[]; vn: string[]; py: string[]; lop?: number; net?: number; tanSuat?: number; jlpt?: number; bo?: number };
const kanjidic = new Map<string, Kanji>();

function napKanjidic() {
  const xml = gunzipSync(readFileSync(tep('kanjidic2.xml.gz'))).toString('utf8');
  for (const m of xml.matchAll(/<character>([\s\S]*?)<\/character>/g)) {
    const c = m[1];
    const chu = /<literal>(.*?)<\/literal>/.exec(c)?.[1];
    if (!chu) continue;
    const doc = (t: string) => [...c.matchAll(new RegExp(`<reading r_type="${t}">(.*?)</reading>`, 'g'))].map((x) => x[1]);
    const so = (re: RegExp) => { const v = re.exec(c)?.[1]; return v ? parseInt(v, 10) : undefined; };
    kanjidic.set(chu, {
      on: doc('ja_on'), kun: doc('ja_kun'), vn: doc('vietnam'), py: doc('pinyin'),
      en: [...c.matchAll(/<meaning>(.*?)<\/meaning>/g)].map((x) => x[1]),
      lop: so(/<grade>(\d+)<\/grade>/), net: so(/<stroke_count>(\d+)<\/stroke_count>/), tanSuat: so(/<freq>(\d+)<\/freq>/),
      jlpt: so(/<jlpt>(\d+)<\/jlpt>/), bo: so(/<rad_value rad_type="classical">(\d+)<\/rad_value>/),
    });
  }
  log('KANJIDIC2', kanjidic.size, 'kanji');
}

/** Các âm Hán Việt của MỘT chữ, âm chính đứng đầu (`sapHanViet`: tương ứng thanh điệu + giao Unihan/KANJIDIC2).
 *  Ứng viên gom từ chính chữ + dạng phồn thể + dạng giản thể (学 không có âm trong Unihan, 學 có). */
const hvNho = new Map<string, string[]>();
function hanVietCacAm(ch: string): string[] {
  const nho = hvNho.get(ch);
  if (nho) return nho;
  const h = unihan.get(ch);
  const ho = [ch, h?.phon, h?.gian].filter(Boolean) as string[];
  const kd = ho.flatMap((c) => kanjidic.get(c)?.vn ?? []);
  const uh = ho.flatMap((c) => unihan.get(c)?.hv ?? []);
  const py = h?.py ?? (h?.phon ? unihan.get(h.phon)?.py : undefined) ?? kanjidic.get(ch)?.py[0];
  const ra = kd.length || uh.length ? sapHanViet(kd, uh, py) : [];
  hvNho.set(ch, ra);
  return ra;
}
const hanVietChu = (ch: string): string | undefined => hanVietCacAm(ch)[0];

/** Hán Việt của cả từ — chỉ khi MỌI chữ đều là chữ Hán và đều có âm (thiếu một chữ ⇒ không đoán). */
function hanVietTu(tu: string): string | null {
  const chu = [...tu];
  if (!chu.length || !chu.every(laChuHan)) return null;
  const am = chu.map(hanVietChu);
  return am.every(Boolean) ? am.join(' ') : null;
}

// ─── Kho soạn tay (nghĩa Việt) ───────────────────────────────

type Kho = { word: string; vi: string; doc?: string; viDu?: string; viDuVi?: string };
const KHO_WEB = process.argv.includes('--kho-web');

async function napKho(nn: string): Promise<Kho[]> {
  // Máy dev không có kho soạn tay ⇒ `--kho-web` đọc bản công khai của production (GET /my-language/<nn>/dictionary —
  // không có câu ví dụ). Production KHÔNG cần cờ này: kho nằm ngay trong CSDL.
  if (KHO_WEB) {
    const r = await fetch(`https://cuongthai.com/api/v1/my-language/${nn}/dictionary`);
    const j = (await r.json()) as { data?: { word: string; meaningVi: string | null; pronunciations?: { value?: string }[] }[] };
    return (j.data ?? []).filter((w) => w.meaningVi).map((w) => ({ word: w.word.replace(/\{([^|}]+)\|[^}]+\}/g, '$1').trim(), vi: w.meaningVi!, doc: w.pronunciations?.[0]?.value }));
  }
  const ws = await db.langVocabWord.findMany({
    where: { category: { language: { code: nn } } },
    select: { word: true, meaningVi: true, exampleSentence: true, exampleMeaning: true, pronunciations: { select: { value: true }, orderBy: { order: 'asc' }, take: 1 } },
  });
  return ws.map((w) => ({ word: w.word.replace(/\{([^|}]+)\|[^}]+\}/g, '$1').trim(), vi: w.meaningVi, doc: w.pronunciations[0]?.value, viDu: w.exampleSentence ?? undefined, viDuVi: w.exampleMeaning ?? undefined }));
}

// ─── Ghi CSDL ────────────────────────────────────────────────

type Muc = {
  chu: string; chuPhu?: string | null; doc?: string | null; docLatin?: string | null; hanViet?: string | null;
  nghiaVi?: string | null; nghiaEn?: string | null; loai?: string | null; viDu?: string | null; viDuVi?: string | null;
  thongDung?: boolean; uuTien?: number; nguon: string; khoa: string[];
};

async function ghi(nn: string, ds: Muc[]) {
  await db.ctlTu.deleteMany({ where: { nn } });
  const LO = 4000;
  let soKhoa = 0;
  for (let i = 0; i < ds.length; i += LO) {
    const lo = ds.slice(i, i + LO);
    const ids = await db.ctlTu.createManyAndReturn({
      data: lo.map(({ khoa: _k, ...m }) => ({ nn, ...m, chu: m.chu.slice(0, 160), chuPhu: m.chuPhu?.slice(0, 160), doc: m.doc?.slice(0, 240), docLatin: m.docLatin?.slice(0, 240), hanViet: m.hanViet?.slice(0, 160), loai: m.loai?.slice(0, 120) })),
      select: { id: true },
    });
    const khoa = lo.flatMap((m, j) => [...new Set(m.khoa.map(khoaTra).filter((k) => k && k.length <= 200))].map((k) => ({ tuId: ids[j].id, nn, khoa: k })));
    soKhoa += khoa.length;
    for (let k = 0; k < khoa.length; k += 20000) await db.ctlKhoaTra.createMany({ data: khoa.slice(k, k + 20000) });
    if ((i / LO) % 10 === 0) log(`  ${nn}: ${Math.min(i + LO, ds.length)}/${ds.length}`);
  }
  log(`${nn}: ${ds.length} mục · ${soKhoa} khoá tra`);
}

// ─── Trung: CC-CEDICT ────────────────────────────────────────

async function nhapZh() {
  const kho = await napKho('zh');
  const khoTheoChu = new Map(kho.map((k) => [k.word, k]));
  const daCo = new Set<string>();
  const ds: Muc[] = [];
  const rl = createInterface({ input: createReadStream(tep('cedict_1_0_ts_utf-8_mdbg.txt.gz')).pipe(createGunzip()) });
  for await (const dong of rl) {
    if (dong.startsWith('#')) continue;
    const m = /^(\S+) (\S+) \[([^\]]*)\] \/(.*)\/$/.exec(dong);
    if (!m) continue;
    const [, phon, gian, pySo, nghia] = m;
    const k = khoTheoChu.get(gian) ?? khoTheoChu.get(phon);
    if (k) daCo.add(k.word);
    const py = pinyinCoDau(pySo);
    const thuong = !/^[A-Z]/.test(pySo); // tên riêng viết hoa pinyin
    ds.push({
      chu: gian, chuPhu: phon !== gian ? phon : null, doc: py, docLatin: pySo, hanViet: hanVietTu(phon) ?? hanVietTu(gian),
      nghiaVi: k?.vi ?? null, nghiaEn: nghia.split('/').filter((x) => !x.startsWith('CL:')).slice(0, 8).join('; '),
      viDu: k?.viDu, viDuVi: k?.viDuVi, thongDung: !!k,
      uuTien: (k ? 100 : 0) + (thuong ? 10 : 0) + Math.max(0, 8 - [...gian].length) + (unihan.get(gian)?.tanSuat ? 6 - unihan.get(gian)!.tanSuat! : 0),
      nguon: k ? 'kho' : 'cedict',
      khoa: [gian, phon, py, pySo.replace(/\s+/g, ''), ...(hanVietTu(phon) ?? hanVietTu(gian) ? [(hanVietTu(phon) ?? hanVietTu(gian))!] : [])],
    });
  }
  for (const k of kho) if (!daCo.has(k.word)) ds.push({ chu: k.word, doc: k.doc, hanViet: hanVietTu(k.word), nghiaVi: k.vi, viDu: k.viDu, viDuVi: k.viDuVi, thongDung: true, uuTien: 100, nguon: 'kho', khoa: [k.word, ...(k.doc ? [k.doc] : [])] });
  log('CC-CEDICT', ds.length, 'mục (kho khớp', daCo.size, '/', kho.length, ')');
  await ghi('zh', ds);
}

// ─── Nhật: JMdict ────────────────────────────────────────────

async function nhapJa() {
  const kho = await napKho('ja');
  const khoTheoChu = new Map(kho.map((k) => [k.word, k]));
  const daCo = new Set<string>();
  const ds: Muc[] = [];
  const xml = gunzipSync(readFileSync(tep('JMdict_e.gz'))).toString('utf8');
  const PRI = /<(?:ke|re)_pri>(news1|ichi1|spec1|spec2|gai1)<\//;
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const e = m[1];
    const keb = [...e.matchAll(/<keb>(.*?)<\/keb>/g)].map((x) => x[1]);
    const reb = [...e.matchAll(/<reb>(.*?)<\/reb>/g)].map((x) => x[1]);
    if (!reb.length) continue;
    const senses = [...e.matchAll(/<sense>([\s\S]*?)<\/sense>/g)].map((x) => x[1]);
    const nghiaEn = senses.slice(0, 4).map((s) => [...s.matchAll(/<gloss[^>]*>(.*?)<\/gloss>/g)].map((g) => g[1]).join(', ')).filter(Boolean).join('; ');
    const loai = senses[0] ? [...senses[0].matchAll(/<pos>&([\w-]+);<\/pos>/g)].map((x) => x[1]).join(', ') : '';
    const chu = keb[0] ?? reb[0];
    const k = khoTheoChu.get(chu) ?? (keb.length ? undefined : khoTheoChu.get(reb[0])) ?? keb.map((x) => khoTheoChu.get(x)).find(Boolean);
    if (k) daCo.add(k.word);
    const thong = PRI.test(e);
    ds.push({
      chu, chuPhu: keb.slice(1, 4).join('・') || null, doc: reb[0], docLatin: romaji(reb[0]), hanViet: keb[0] ? hanVietTu(keb[0]) : null,
      nghiaVi: k?.vi ?? null, nghiaEn, loai, viDu: k?.viDu, viDuVi: k?.viDuVi, thongDung: thong || !!k,
      uuTien: (k ? 100 : 0) + (thong ? 50 : 0) + Math.max(0, 8 - [...chu].length),
      nguon: k ? 'kho' : 'jmdict',
      khoa: [...keb, ...reb, ...reb.map(romaji), ...(keb[0] && hanVietTu(keb[0]) ? [hanVietTu(keb[0])!] : [])],
    });
  }
  for (const k of kho) if (!daCo.has(k.word)) ds.push({ chu: k.word, doc: coKana(k.word) ? null : k.doc, docLatin: k.doc, hanViet: hanVietTu(k.word), nghiaVi: k.vi, viDu: k.viDu, viDuVi: k.viDuVi, thongDung: true, uuTien: 100, nguon: 'kho', khoa: [k.word, ...(k.doc ? [k.doc] : []), ...(coKana(k.word) ? [romaji(k.word)] : [])] });
  log('JMdict', ds.length, 'mục (kho khớp', daCo.size, '/', kho.length, ')');
  await ghi('ja', ds);
}

// ─── Anh: kho soạn tay ───────────────────────────────────────

async function nhapEn() {
  const kho = await napKho('en');
  const gop = new Map<string, Muc>();
  for (const k of kho) {
    const cu = gop.get(k.word.toLowerCase());
    if (cu) { if (!cu.nghiaVi?.includes(k.vi)) cu.nghiaVi = `${cu.nghiaVi}; ${k.vi}`; continue; }
    gop.set(k.word.toLowerCase(), { chu: k.word, doc: k.doc, nghiaVi: k.vi, viDu: k.viDu, viDuVi: k.viDuVi, thongDung: true, uuTien: 100 + Math.max(0, 12 - k.word.length), nguon: 'kho', khoa: [k.word] });
  }
  log('Anh (kho)', gop.size, 'mục');
  await ghi('en', [...gop.values()]);
}

// ─── Chữ Hán ─────────────────────────────────────────────────

async function nhapChuHan() {
  const chu = new Set<string>([...kanjidic.keys()]);
  for (const [ch, h] of unihan) if (h.py && (h.tanSuat || h.hv)) chu.add(ch);
  const ds = [...chu].map((ch) => {
    const h = unihan.get(ch) ?? {};
    const k = kanjidic.get(ch);
    return {
      chu: ch, hanViet: hanVietCacAm(ch).slice(0, 4).join(' · ') || null, pinyin: h.py ?? k?.py[0] ?? null,
      onYomi: k?.on.join('、') || null, kunYomi: k?.kun.join('、') || null,
      nghiaEn: k?.en.join('; ') || h.en || null, boThu: k?.bo ?? h.bo ?? null, soNet: k?.net ?? h.net ?? null,
      jlptCu: k?.jlpt ?? null, lop: k?.lop ?? null, tanSuat: k?.tanSuat ?? null, phonThe: h.phon ?? null, gianThe: h.gian ?? null,
    };
  });
  await db.ctlChuHan.deleteMany({});
  for (let i = 0; i < ds.length; i += 5000) await db.ctlChuHan.createMany({ data: ds.slice(i, i + 5000) });
  log('Chữ Hán', ds.length);
}

async function main() {
  log('Thư mục dữ liệu:', DIR, '· ngôn ngữ:', NN.join(','));
  if (NN.includes('zh') || NN.includes('ja')) { napUnihan(); napKanjidic(); await nhapChuHan(); }
  if (NN.includes('zh')) await nhapZh();
  if (NN.includes('ja')) await nhapJa();
  if (NN.includes('en')) await nhapEn();
  writeFileSync(join(DIR, 'lan-nhap-cuoi.txt'), new Date().toISOString());
  log('XONG');
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => db.$disconnect());
