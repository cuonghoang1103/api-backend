/**
 * Xuất các khoá kiểu sách (Dekiru, IELTS nền tảng, JP, CH) ra JSON tĩnh cho
 * APP iOS NATIVE đọc — `public/sach-hoc/<khoa>/…`, phục vụ ở
 * `https://cuongthai.com/sach-hoc/<khoa>/index.json`.
 *
 * Vì sao JSON tĩnh: nội dung các khoá này nằm TRONG MÃ frontend (data.ts +
 * bai/*.ts, ~8 MB TypeScript), không có API. Script gọi NGUYÊN VĂN code của web
 * — `defineCourse` (course.load → loadBai/loadNgay, chenHanLop, Theo slide,
 * Luyện thêm, Theo sách) — nên luật ghép bài chỉ có MỘT chỗ; web đổi gì thì
 * lần build sau app thấy y như vậy. Không chép luật, không chép nội dung.
 *
 *   npm run sach-hoc:xuat                    # mọi khoá (chạy ở `prebuild`)
 *   npm run sach-hoc:xuat -- --khoa dekiru   # một khoá
 *   npm run sach-hoc:xuat -- --nghiem        # lỗi ⇒ exit 1 (mặc định chỉ cảnh báo)
 *
 * Tệp ra (mỗi khoá):
 *   index.json       mục lục: meta khoá, Mở đầu (đủ blocks), danh sách buổi + bài con
 *                    (từ manifest), mục tra cứu (extras), băm từng tệp, `phienBan`
 *   bai-<n>.json     nội dung đủ của buổi n (n = Day.n của web; Dekiru: Bài n−1)
 *   phu-<id>.json    một mục tra cứu (extras: Chia động từ, Ôn thẻ, đề luyện…)
 *   chu-han.json     (khoá có `kanji()`) dữ liệu thẻ chữ Hán
 *   chia.json        (khoá tiếng Nhật) bảng chia mọi động từ/tính từ trong sách —
 *                    tính bằng chính `conjugate`/`conjugateAdj` của web
 *
 * `phienBan` và `hash` từng tệp = sha256 NỘI DUNG (không gồm giờ sinh) ⇒ app chỉ
 * tải lại tệp đã đổi; nội dung không đổi thì phiên bản không đổi dù build lại.
 * nginx dán `no-store` lên `/` — chấp nhận: app tự đệm theo phiên bản.
 *
 * Mức truy cập: các trang khoá này CÔNG KHAI (không chặn đăng nhập/Pro — xem
 * dekiru/page.tsx), JSON tĩnh giữ đúng mức đó. 📷 Sách gốc (riêng tư, mã hoá)
 * KHÔNG nằm trong đây.
 *
 * Chạy bằng Node thuần (tách kiểu TS) + móc alias `scripts/lib/nap-ts-alias.mjs`
 * — image frontend không có tsx. `npx tsx scripts/sach-hoc-xuat.mts` cũng chạy.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type Lesson = { id: string; kind: string; title: string; goal: string; minutes: number; blocks?: unknown[]; ready?: boolean };
type Day = { n: number; lessons: Lesson[] };

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANG = join(ROOT, 'src/app/language/[code]');
const OUT = join(ROOT, 'public/sach-hoc');
const load = (p: string) => import(pathToFileURL(p).href);

/** Phiên bản định dạng — app từ chối (báo "cần cập nhật app") khi số này lớn hơn số nó hiểu. */
const SCHEMA = 1;

type Spec = {
  khoa: string;
  /** Tệp data.ts + tên export `defineCourse(...)`. */
  data: string;
  ten: string;
  /**
   * (Tuỳ chọn) Nhóm hiển thị của từng bài trong mục lục app ("Bài học", "Theo slide lớp",
   * "Luyện thêm", "Theo sách"). Suy từ NGUỒN của bài (tệp nào export nó), không đoán theo tên.
   */
  nhom?: () => Promise<(l: Lesson) => string | undefined>;
};

/** Mọi bài (Lesson[]) mà các tệp khớp `re` trong thư mục export ra — để biết bài đến từ nguồn nào. */
async function idTuTep(dir: string, re: RegExp): Promise<Set<string>> {
  const ids = new Set<string>();
  for (const f of readdirSync(dir).filter((x) => re.test(x))) {
    const m = await load(join(dir, f));
    for (const v of Object.values(m)) {
      const ls = Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : [];
      for (const l of ls) if (l && typeof l === 'object' && typeof (l as Lesson).id === 'string' && 'kind' in (l as object)) ids.add((l as Lesson).id);
    }
  }
  return ids;
}

const SPECS: Spec[] = [
  {
    khoa: 'dekiru',
    data: join(LANG, 'dekiru/data.ts'),
    ten: 'DEKIRU',
    nhom: async () => {
      const dir = join(LANG, 'dekiru/bai');
      const slide = await idTuTep(dir, /^slideB\d+\.ts$/);
      const luyen = await idTuTep(dir, /^luyenThem.*\.ts$/);
      const sach = await idTuTep(dir, /^sach\d*\.ts$/);
      return (l) => (luyen.has(l.id) ? 'Luyện thêm' : slide.has(l.id) ? 'Theo slide lớp' : sach.has(l.id) || /-sach$/.test(l.id) ? 'Theo sách' : 'Bài học');
    },
  },
  { khoa: 'ielts', data: join(LANG, 'ielts/data.ts'), ten: 'IELTS' },
  { khoa: 'jp', data: join(LANG, 'jp/data.ts'), ten: 'JP' },
  { khoa: 'ch', data: join(LANG, 'ch/data.ts'), ten: 'CH' },
];

const bam = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);
const KINDS = ['intro', 'grammar', 'vocab', 'listening', 'reading', 'writing', 'speaking', 'homework', 'conversation', 'kanji', 'kana', 'review'] as const;

/** Bỏ cờ `ready` (chỉ có nghĩa ở mục lục) khỏi bài đầy đủ. */
const baiDu = (l: Lesson) => ({ id: l.id, kind: l.kind, title: l.title, goal: l.goal, minutes: l.minutes, blocks: l.blocks ?? [] });
const baiMeta = (l: Lesson, nhom?: (l: Lesson) => string | undefined) => ({
  id: l.id, kind: l.kind, title: l.title, goal: l.goal, minutes: l.minutes,
  ready: l.ready ?? !!l.blocks?.length,
  ...(nhom?.(l) ? { nhom: nhom(l) } : {}),
});

type Tep = { tep: string; hash: string; kb: number };

async function xuatKhoa(spec: Spec): Promise<string> {
  const mod = await load(spec.data);
  const c = mod[spec.ten];
  if (!c?.days || !c?.load) throw new Error(`${relative(ROOT, spec.data)} không export ${spec.ten} (defineCourse)`);
  const nhom = spec.nhom ? await spec.nhom() : undefined;
  const dir = join(OUT, spec.khoa);
  // Dọn bản cũ: một buổi bị bỏ khỏi khoá thì tệp của nó cũng phải biến mất.
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  const ghi = (ten: string, obj: unknown): Tep => {
    const s = JSON.stringify(obj);
    writeFileSync(join(dir, ten), s);
    return { tep: ten, hash: bam(s), kb: Math.round(s.length / 102.4) / 10 };
  };

  // Video gắn theo bài (YouTube/mp4) và theo MỤC (mp4) — đi cùng nội dung buổi.
  const videoCua = (id: string) => {
    const v: Record<string, unknown> = {};
    if (c.videos?.[id]) v.videos = c.videos[id];
    if (c.videoNeo?.[id]) v.videoNeo = c.videoNeo[id];
    return v;
  };

  const buoi = [];
  let tongBai = 0;
  for (const d of c.days as Day[]) {
    const ls: Lesson[] = await c.load(d.n);
    // Mục lục (manifest) phải khớp nội dung — y như kiểm của course.load ở web.
    const want = d.lessons.map((l) => l.id).join(',');
    const got = ls.map((l) => l.id).join(',');
    if (want !== got) console.warn(`  ⚠ ${spec.khoa} buổi ${d.n}: mục lục ≠ nội dung — dùng NỘI DUNG (chạy npm run course:manifest)`);
    const coNoiDung = ls.some((l) => l.blocks?.length);
    const tep = coNoiDung ? ghi(`bai-${d.n}.json`, { schema: SCHEMA, khoa: spec.khoa, n: d.n, bai: ls.map((l) => ({ ...baiDu(l), ...videoCua(l.id) })) }) : null;
    const sum = c.summary(d) as { grammar: string[]; vocab: unknown[]; quizzes: { id: string; title: string; lessonId: string; count: number }[]; minutes: number };
    tongBai += ls.filter((l) => l.blocks?.length).length;
    buoi.push({
      n: d.n,
      so: c.shownNum ? c.shownNum(d.n) : d.n,
      ten: c.dayName(d.n),
      phut: sum.minutes,
      nguPhap: sum.grammar,
      soTu: sum.vocab.length,
      baiTap: sum.quizzes,
      // Bài con lấy từ NỘI DUNG vừa nạp (luôn đúng), cờ ready theo blocks.
      bai: ls.map((l) => baiMeta(l, nhom)),
      ...(tep ?? {}),
    });
  }

  const phu = [];
  for (const l of (c.extras ?? []) as Lesson[]) {
    const t = ghi(`phu-${l.id}.json`, { schema: SCHEMA, khoa: spec.khoa, bai: { ...baiDu(l), ...videoCua(l.id) } });
    phu.push({ ...baiMeta(l), ...t });
  }

  const them: Record<string, Tep> = {};
  if (c.kanji) them.chuHan = ghi('chu-han.json', await c.kanji());
  if (c.lang === 'ja' && spec.khoa === 'dekiru') them.chia = ghi('chia.json', await bangChia());

  const index = {
    schema: SCHEMA,
    khoa: spec.khoa,
    tieuDe: c.title,
    donVi: c.unit,
    chuHuyHieu: c.badgeWord,
    ngonNgu: c.lang,
    giong: c.voice,
    stage: c.stage,
    duongWeb: c.backHref,
    nhanLoai: Object.fromEntries(KINDS.map((k) => [k, c.label(k)])),
    nhanLoaiPhu: Object.fromEntries(KINDS.map((k) => [k, c.en(k)])),
    mauLoai: Object.fromEntries(KINDS.map((k) => [k, c.hue(k)])),
    gioiThieu: baiDu(c.intro),
    buoi,
    phu,
    ...them,
  };
  // Phiên bản = băm của mục lục (đã gồm băm từng tệp) ⇒ một bài đổi là phiên bản đổi.
  const s0 = JSON.stringify(index);
  const phienBan = bam(s0);
  const s = JSON.stringify({ ...index, phienBan, sinhLuc: new Date().toISOString() });
  writeFileSync(join(dir, 'index.json'), s);
  const tong = readdirSync(dir).length;
  return `${spec.khoa}: ${buoi.length} buổi · ${tongBai} bài · ${phu.length} mục tra cứu · ${tong} tệp · phiên bản ${phienBan}`;
}

/**
 * Bảng chia của mọi động từ/tính từ trong sách — tính bằng CHÍNH hàm của web
 * (`components/sach-hoc/nhat/chia.ts`, có test 105 động từ). Nhãn hàng lấy theo
 * mục "Tra nhanh" của ChiaDongTu.tsx (tệp .tsx — Node không nạp được — nên ghi
 * lại ở đây; chỉ là NHÃN, không phải luật chia).
 */
async function bangChia() {
  const ch = await load(join(ROOT, 'src/components/sach-hoc/nhat/chia.ts'));
  const dongTu = (ch.VERBS as { d: string; vi: string; nhom: number; bai: number }[]).map((v) => ({ ...v, the: ch.conjugate(v.d, v.nhom) }));
  const tinhTu = (ch.ADJS as { d: string; vi: string; loai: 'i' | 'na'; bai: number }[]).map((a) => ({ ...a, the: ch.conjugateAdj(a.d, a.loai) }));
  return {
    dongTu,
    tinhTu,
    nhomDongTu: [
      { ten: 'Lịch sự (ます)', hang: [['Hiện tại', 'masu', 'B3'], ['Phủ định', 'masen', 'B3'], ['Quá khứ', 'mashita', 'B5'], ['Quá khứ phủ định', 'masendeshita', 'B5'], ['Rủ: …nhé', 'mashou', 'B6'], ['Muốn …', 'tai', 'B5'], ['Cách …', 'kata', 'B7']] },
      { ten: 'Thể thường (普通形)', hang: [['Từ điển (hiện tại)', 'jisho', 'B9'], ['ない (phủ định)', 'nai', 'B10'], ['た (quá khứ)', 'ta', 'B11'], ['なかった (quá khứ phủ định)', 'nakatta', 'B11']] },
      { ten: 'Thể nối và mẫu hay dùng', hang: [['て', 'te', 'B7'], ['ないで (xin đừng…)', 'naide', 'B10'], ['たら (nếu…)', 'tara', 'B15'], ['ても (dù…)', 'temo', 'B15']] },
    ],
    hangTinhTu: [['Hiện tại', 'hien'], ['Phủ định', 'phu'], ['Quá khứ', 'qua'], ['Quá khứ phủ định', 'quaPhu'], ['Bổ nghĩa N', 'bn'], ['Nối câu (て)', 'te'], ['Trở nên', 'naru'], ['Thường · hiện tại', 'ffHien'], ['Thường · phủ định', 'ffPhu'], ['Thường · quá khứ', 'ffQua'], ['Thường · quá khứ phủ định', 'ffQuaPhu'], ['Nếu… thì', 'tara'], ['Dù… cũng', 'temo']],
    tenNhom: { 1: 'Nhóm I', 2: 'Nhóm II', 3: 'Nhóm III' },
  };
}

const args = process.argv.slice(2);
const nghiem = args.includes('--nghiem');
const iK = args.indexOf('--khoa');
const chon = iK >= 0 ? args[iK + 1] : null;
const ds = chon ? SPECS.filter((s) => s.khoa === chon) : SPECS;
if (!ds.length) { console.error(`✗ không có khoá "${chon}" (có: ${SPECS.map((s) => s.khoa).join(', ')})`); process.exit(1); }

let loi = 0;
const t0 = Date.now();
for (const spec of ds) {
  try {
    console.log(`✓ sach-hoc ${await xuatKhoa(spec)}`);
  } catch (e) {
    loi++;
    // Mặc định KHÔNG làm đổ `next build`: web vẫn chạy, app giữ bản đã đệm. CI/chạy tay dùng --nghiem.
    console.error(`✗ sach-hoc ${spec.khoa}: ${(e as Error).stack ?? e}`);
  }
}
console.log(`  → ${relative(ROOT, OUT)}/ (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
if (loi && nghiem) process.exit(1);
