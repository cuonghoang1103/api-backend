/**
 * ielts-dung-json — dựng lại `content/ielts/*.json` TỪ tệp TypeScript của web.
 * ─────────────────────────────────────────────────────────────────────────
 *   npx tsx scripts/ielts-dung-json.mts          # dựng và ghi
 *   npx tsx scripts/ielts-dung-json.mts --kiem   # chỉ kiểm, không ghi (CI dùng)
 *
 * VÌ SAO PHẢI CÓ BƯỚC NÀY. App iOS cần nội dung IELTS qua API, nhưng nội dung
 * đó là tệp `.ts` nằm trong `frontend/src/app/tech-trends/ielts/data/**`, và
 * **ảnh backend KHÔNG chứa thư mục `frontend/`** — `Dockerfile.backend` chỉ
 * chép `scripts/` và `content/` sang tầng runner. Nên seeder chạy trong
 * container không thể với tới tệp gốc.
 *
 * Nên chia hai chặng:
 *   1. (ở máy nhà, tệp này)  TS của web  →  content/ielts/*.json  → commit
 *   2. (trong container)     content/ielts/*.json  →  DB  (ielts-seed.mjs)
 *
 * ⚠️ BẢN SAO PHẢI KHÔNG ĐƯỢC CŨ HƠN NGUỒN, VÀ KHÔNG THỂ TIN VÀO TRÍ NHỚ AI ĐÓ.
 * Sửa một bài đọc trên web rồi quên chạy lại tệp này thì app hiện bản cũ —
 * không lỗi, không cảnh báo, chỉ là sai. Nên mỗi JSON mang theo `nguonSha` =
 * băm của TOÀN BỘ tệp nguồn, và `src/services/ielts/nguon.test.ts` tính lại
 * rồi so. Lệch là `npm test` ĐỎ, mà `npm test` nằm trong bộ kiểm bắt buộc của
 * `deploy-nha.sh` ⇒ không đẩy lên được. Đây là chốt thật, không phải một dòng
 * chú thích nhờ người sau nhớ hộ.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NGUON = path.join(ROOT, 'frontend/src/app/tech-trends/ielts/data');
const RA = path.join(ROOT, 'content/ielts');
const CHI_KIEM = process.argv.includes('--kiem');

/** Băm mọi tệp nguồn, theo thứ tự đường dẫn để kết quả ổn định. */
export function bamNguon(thuMuc = NGUON): string {
  const tep: string[] = [];
  const di = (d: string) => {
    for (const m of readdirSync(d, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      const p = path.join(d, m.name);
      if (m.isDirectory()) di(p);
      else if (m.name.endsWith('.ts')) tep.push(p);
    }
  };
  di(thuMuc);
  const h = createHash('sha256');
  for (const p of tep) {
    h.update(path.relative(thuMuc, p));
    h.update(readFileSync(p));
  }
  return h.digest('hex');
}

/**
 * Chia mỗi chặng thành nhiều phần thay vì một khối.
 *
 * Chặng 1 là ~300 KB. App mở tab Đọc mà phải tải cả chặng qua 4G là bắt người
 * dùng trả tiền mạng cho thứ họ không mở. Mỗi phần tải riêng.
 */
const PHAN_CUA_CHANG = [
  ['meta', (b: any) => ({ id: b.id, label: b.label, band: b.band, focus: b.focus, stats: b.stats, keys: b.keys })],
  ['units', (b: any) => b.units],
  ['vocab', (b: any) => ({ topics: b.vocabTopics, allWords: b.allWords })],
  ['readings', (b: any) => b.readings],
  ['listenings', (b: any) => ({ items: b.listenings, sources: b.sources })],
  ['writings', (b: any) => b.writings],
  ['speakings', (b: any) => ({ topics: b.speakings, rules: b.speakingRules })],
  ['exercises', (b: any) => ({ byLesson: b.exercisesByLesson, all: b.allExercises })],
  ['questionTypes', (b: any) => ({ guides: b.questionTypes ?? [], notes: b.strategyNotes ?? [] })],
] as const;

function demMuc(v: unknown): number {
  if (Array.isArray(v)) return v.length;
  if (v && typeof v === 'object') {
    // Đếm phần tử của mảng con đầu tiên — `{items:[…], sources:[…]}` thì con
    // số có nghĩa là số bài, không phải số khoá của object.
    for (const x of Object.values(v as Record<string, unknown>)) {
      if (Array.isArray(x)) return x.length;
    }
  }
  return 0;
}

async function chay() {
  const { STAGES, TOTAL_STATS } = await import(path.join(NGUON, 'bundles.ts'));
  const { BAND_STAGES, IELTS_STATS } = await import(path.join(NGUON, 'roadmap.ts'));
  const { TYPING_PASSAGES } = await import(path.join(NGUON, 'typing.ts'));
  const { LIFE } = await import(path.join(NGUON, 'stage1/life.ts'));
  const { EXAM } = await import(path.join(NGUON, 'stage1/exam.ts'));

  const nguonSha = bamNguon();
  const hang: { stage: string; kind: string; payload: unknown; soMuc: number }[] = [];

  for (const b of STAGES as any[]) {
    for (const [kind, lay] of PHAN_CUA_CHANG) {
      const payload = lay(b);
      hang.push({ stage: b.id, kind, payload, soMuc: demMuc(payload) });
    }
  }
  hang.push({ stage: 'shared', kind: 'roadmap', payload: { stages: BAND_STAGES, stats: IELTS_STATS, tongStats: TOTAL_STATS }, soMuc: BAND_STAGES.length });
  hang.push({ stage: 'shared', kind: 'life', payload: LIFE, soMuc: LIFE.length });
  hang.push({ stage: 'shared', kind: 'exam', payload: EXAM, soMuc: EXAM.length });
  hang.push({ stage: 'shared', kind: 'typing', payload: TYPING_PASSAGES, soMuc: TYPING_PASSAGES.length });

  const goi = { nguonSha, sinhLuc: new Date().toISOString(), hang };
  const duong = path.join(RA, 'noi-dung.json');

  if (CHI_KIEM) {
    if (!existsSync(duong)) {
      console.error('❌ chưa có content/ielts/noi-dung.json — chạy `npx tsx scripts/ielts-dung-json.mts`');
      process.exit(1);
    }
    const cu = JSON.parse(readFileSync(duong, 'utf8'));
    if (cu.nguonSha !== nguonSha) {
      console.error('❌ content/ielts/noi-dung.json CŨ HƠN dữ liệu web.');
      console.error(`   trong tệp: ${cu.nguonSha.slice(0, 16)}…`);
      console.error(`   tính lại : ${nguonSha.slice(0, 16)}…`);
      console.error('   Chạy: npx tsx scripts/ielts-dung-json.mts');
      process.exit(1);
    }
    console.log(`✅ khớp nguồn (${cu.hang.length} hàng, sha ${nguonSha.slice(0, 16)}…)`);
    return;
  }

  mkdirSync(RA, { recursive: true });
  writeFileSync(duong, JSON.stringify(goi));
  const kb = (Buffer.byteLength(JSON.stringify(goi)) / 1024).toFixed(0);
  console.log(`✅ ghi ${duong} — ${hang.length} hàng, ${kb} KB, sha ${nguonSha.slice(0, 16)}…`);
  for (const h of hang) {
    if (h.soMuc > 0) console.log(`   ${h.stage.padEnd(8)} ${h.kind.padEnd(14)} ${String(h.soMuc).padStart(4)} mục`);
  }
}

chay().catch((e) => { console.error(e); process.exit(1); });
