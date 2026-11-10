#!/usr/bin/env npx tsx
/* eslint-disable no-console */
/**
 * SOẠN NHÁP bài "Học mỗi ngày" bằng LLM — KHÔNG đăng, KHÔNG sửa thư viện.
 * ─────────────────────────────────────────────────────────────────────────
 *   LLM_BACKGROUND_ENABLED=true npx tsx scripts/feed-hoc-soan.ts --chu-de "CSS specificity"
 *   LLM_BACKGROUND_ENABLED=true npx tsx scripts/feed-hoc-soan.ts --chu-de "..." --nhom til --dinh-dang meo-code --so 2
 *   npx tsx scripts/feed-hoc-soan.ts --kiem-lai <nhap.json>     # chỉ kiểm lại tệp nháp, KHÔNG gọi LLM
 *
 *   --ra <tệp>   nơi ghi nháp (mặc định $TMPDIR/feed-hoc-nhap/<giờ>.json — cố ý NGOÀI repo)
 *   Bỏ --nhom / --dinh-dang ⇒ tự chọn nhóm đang thiếu nhất so với TI_TRONG và định dạng ít bài nhất.
 *
 * Luồng:
 *   1. Cầu dao `budget.ts` (việc NỀN ⇒ trần mềm) — chạm trần thì dừng trước khi gọi.
 *   2. `llmComplete` purpose `news_bulletin` (model rẻ của bản đồ gateway), feature `news` (việc nền:
 *      cần LLM_BACKGROUND_ENABLED=true, giống mọi đợt sinh nội dung khác).
 *   3. MÁY KIỂM từng nháp — LLM hay bịa đúng ở những chỗ này:
 *      • chạy lại code `node`/`node-loi`/`python` và THAY `out` bằng output THẬT (cả `anh.output` nếu cùng code);
 *        code chạy hỏng ⇒ lỗi; `khong` mà có `out` ⇒ xoá `out`; `pg` ⇒ nhắc chạy tay trên PostgreSQL.
 *      • gõ lại MỌI URL (khoá học qua API /api/v1/courses/<slug>, YouTube qua oEmbed) — chết ⇒ lỗi.
 *      • câu trích tiếng Anh trong ngoặc kép phải có NGUYÊN VĂN trên một trang nguồn — không thấy ⇒ lỗi.
 *      • video phải nằm trong content/course-videos/*.mjs; id/dòng đầu không trùng thư viện; dòng đầu ≤ 80 ký tự;
 *        poll có `dapan`; ảnh dựng được.
 *   4. Ghi tệp nháp + danh sách lỗi/cảnh báo từng bài. Người duyệt sửa, chép vào `thuVien.ts`,
 *      rồi chạy `npx tsx scripts/feed-hoc-kiem.ts --url` như mọi bài khác.
 */
import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import type { BaiHoc, DinhDang, Khoi, NhomChuDe } from '../src/services/techTrends/hocFeed/kieu.js';
import { THU_VIEN } from '../src/services/techTrends/hocFeed/thuVien.js';
import { TI_TRONG } from '../src/services/techTrends/hocFeed/lichHoc.js';
import { dongDau } from '../src/services/techTrends/hocFeed/dungBai.js';
import { dungSvg } from '../src/services/techTrends/hocFeed/veAnh.js';

const a = process.argv.slice(2);
const co = (f: string) => a.includes(f);
const sau = (f: string) => (a.includes(f) ? a[a.indexOf(f) + 1] : undefined);

const NHOM: NhomChuDe[] = ['so-sanh', 'su-nghiep', 'bug', 'cs-sau', 'til', 'case-study', 'phong-van', 'tai-nguyen', 'lich-su', 'fun-fact', 'cong-cu-ai'];
const DINH_DANG: DinhDang[] = ['meo-code', 'bug', 'truoc-sau', 'quiz', 'eli5', 'so-do', 'thread', 'con-so', 'trich-dan', 'tai-nguyen', 'anh-that'];
/** Định dạng ⇒ mẫu ảnh tương ứng (xem mauAnh.ts). */
const MAU_THEO_DINH_DANG: Record<DinhDang, string> = {
  'meo-code': 'code', bug: 'loi', 'truoc-sau': 'truocSau', quiz: 'quiz', eli5: 'eli5', 'so-do': 'soDo',
  thread: 'slide', 'con-so': 'conSo', 'trich-dan': 'trichDan', 'tai-nguyen': 'sach', 'anh-that': 'anh',
};
const UA = 'Mozilla/5.0 cuongthai-feed-check';

interface Nhap { bai: BaiHoc; kiem: { loi: string[]; canhBao: string[]; daSua: string[] } }

// ───────────────────────────── Dữ liệu tham chiếu ─────────────────────────────

/** Video đã kiểm oEmbed sẵn trong repo: id → credit. */
function docVideoRepo(): Map<string, string> {
  const dir = join(process.cwd(), 'content/course-videos');
  const m = new Map<string, string>();
  if (!existsSync(dir)) return m;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.mjs'))) {
    const s = readFileSync(join(dir, f), 'utf8');
    for (const x of s.matchAll(/yt:\s*['"]([\w-]{11})['"]\s*,\s*credit:\s*(['"])(.*?)\2/g)) m.set(x[1], x[3]);
  }
  return m;
}

/** Slug các khoá học đang có thật trên cuongthai.com. */
async function docKhoaHoc(): Promise<string[]> {
  try {
    const r = await fetch('https://cuongthai.com/api/v1/courses?size=200', { signal: AbortSignal.timeout(20_000) });
    const j = (await r.json()) as { data?: unknown };
    const d = j.data as { items?: Array<{ slug: string }>; courses?: Array<{ slug: string }> } | Array<{ slug: string }> | undefined;
    const ds = Array.isArray(d) ? d : (d?.items ?? d?.courses ?? []);
    return ds.map((c) => c.slug).filter(Boolean);
  } catch {
    return [];
  }
}

/** Nhóm thiếu nhất so với tỉ trọng mục tiêu (bỏ qua công cụ AI), định dạng ít bài nhất. */
function chonMacDinh(): { nhom: NhomChuDe; dinhDang: DinhDang } {
  const n = THU_VIEN.length;
  const dem = (k: (b: BaiHoc) => string, v: string) => THU_VIEN.filter((b) => k(b) === v).length;
  const nhom = NHOM.filter((x) => x !== 'cong-cu-ai')
    .sort((x, y) => (TI_TRONG[y] - dem((b) => b.nhom, y) / n) - (TI_TRONG[x] - dem((b) => b.nhom, x) / n))[0];
  const dinhDang = [...DINH_DANG].sort((x, y) => dem((b) => b.dinhDang, x) - dem((b) => b.dinhDang, y))[0];
  return { nhom, dinhDang };
}

// ───────────────────────────── Gọi LLM ─────────────────────────────

function heThong(khoa: string[], video: Array<[string, string]>): string {
  const daCo = THU_VIEN.map((b) => `- ${b.id}: ${b.tieuDe}`).join('\n');
  return `Bạn soạn bài "Học mỗi ngày" cho Bảng tin cuongthai.com — bài GIÁO DỤC ngắn cho sinh viên IT Việt Nam.
Trả về DUY NHẤT một mảng JSON (không markdown, không lời dẫn) gồm các object đúng kiểu TypeScript sau:

interface BaiHoc {
  id: string;            // slug a-z0-9-, KHÔNG trùng danh sách "đã có"
  nhom: ${NHOM.map((x) => `'${x}'`).join(' | ')};
  dinhDang: ${DINH_DANG.map((x) => `'${x}'`).join(' | ')};
  emoji: string;         // MỘT emoji
  tieuDe: string;        // tiếng Việt, tối đa 70 ký tự, không trùng bài đã có
  mo: string;            // 1–2 câu mở gây tò mò
  khoi: Khoi[];          // 2–6 khối
  nguon: { ten: string; url: string }[];     // 1–3 nguồn CHÍNH THỐNG (MDN, docs chính thức, RFC, Wikipedia, blog kỹ thuật của chính công ty)
  hocThem?: { ten: string; url: string }[];  // CHỈ khoá học và video trong danh sách cho phép bên dưới
  poll?: { cauHoi: string; luaChon: string[]; dung: number };  // BẮT BUỘC khi dinhDang = 'quiz' (4 lựa chọn, dung = chỉ số 0-based)
  anh: AnhSpec;
  tags: string[];        // 2–4 tag chữ thường không dấu
}
type Khoi =
  | { k: 'chu'; t: string }
  | { k: 'code'; lang: string; src: string; out?: string; chay: 'node' | 'node-loi' | 'python' | 'pg' | 'khong'; ten?: string }
  | { k: 'dapan'; t: string };   // đáp án ẩn — BẮT BUỘC khi có poll

Mẫu ảnh 'anh.mau' theo định dạng: ${Object.entries(MAU_THEO_DINH_DANG).map(([k, v]) => `${k}→${v}`).join(', ')}.
  code: { mau:'code', tieuDe, code, lang, output?, tenTep? }
  loi: { mau:'loi', tieuDe, lenh?, loi, goiY }
  truocSau: { mau:'truocSau', tieuDe, truoc, sau, lang, nhanTruoc?, nhanSau? }
  quiz: { mau:'quiz', cauHoi, luaChon, code?, lang? }
  eli5: { mau:'eli5', khaiNiem, viDu, dong: string[4] }
  soDo: { mau:'soDo', tieuDe, nut: {ten, phu?}[3..6], chuThich? }
  conSo: { mau:'conSo', so (≤ 7 ký tự), donVi?, yNghia, nguon, nen? }
  trichDan: { mau:'trichDan', cau, tacGia, xuatXu? }
  sach: { mau:'sach', ten, tacGia (≤ 24 ký tự), loai, vi: string[4], mauBia? }
  slide: { mau:'slide', mauNen?, slides: {laBia?, tieuDe, than?, code?, lang?}[4..6] }
  anh: { mau:'anh', url (ảnh Wikimedia Commons), chuThich, giayPhep, trang }

LUẬT (bài vi phạm sẽ bị loại):
1. Code 'node' chạy được bằng Node 22 (ESM, .mjs, top-level await được) và KHÔNG phụ thuộc mạng, thời gian thực, số ngẫu nhiên hay múi giờ trong output. 'node-loi' = code cố ý ném lỗi, 'out' là dòng lỗi. 'khong' = minh hoạ, KHÔNG có 'out'. Output sẽ được máy chạy lại và GHI ĐÈ — đừng bịa.
2. Mọi URL phải là trang có thật, ổn định. Không bịa URL. Câu trích tiếng Anh đặt trong ngoặc kép phải là NGUYÊN VĂN có trên một trang trong 'nguon' (máy sẽ dò).
3. KHÔNG emoji trong mọi trường của 'anh' (phông chữ máy chủ không có emoji).
4. Viết tiếng Việt có dấu, rõ ràng, có ví dụ thật; ưu tiên kiến thức nền bền vững, không quảng cáo công cụ AI.

Khoá học cho phép (url = https://cuongthai.com/courses/<slug>): ${khoa.join(', ') || '(không lấy được — bỏ hocThem khoá học)'}
Video cho phép (url = https://www.youtube.com/watch?v=<id>):
${video.map(([id, c]) => `- ${id}: ${c}`).join('\n') || '(không có video khớp chủ đề — bỏ video)'}

Bài đã có (KHÔNG trùng id/chủ đề):
${daCo}`;
}

function tachJson(text: string): unknown[] {
  const s = text.replace(/^```(?:json)?\s*/m, '').replace(/```\s*$/m, '');
  const i = Math.min(...['[', '{'].map((c) => s.indexOf(c)).filter((x) => x >= 0));
  if (!Number.isFinite(i)) throw new Error('LLM không trả JSON');
  const v = JSON.parse(s.slice(i, s.lastIndexOf(s[i] === '[' ? ']' : '}') + 1)) as unknown;
  return Array.isArray(v) ? v : [v];
}

async function goiLlm(chuDe: string, nhom: NhomChuDe, dinhDang: DinhDang, so: number, video: Map<string, string>): Promise<{ bai: unknown[]; model: string }> {
  const { checkBudget, budgetMessage } = await import('../src/services/llm/budget.js');
  const v = await checkBudget('background');
  if (!v.allowed) throw new Error(budgetMessage(v));
  const { llmComplete } = await import('../src/services/interview/llm/index.js');

  // Chỉ gửi video có từ khoá chủ đề trong credit — danh sách đầy đủ là hàng nghìn dòng.
  const tu = chuDe.toLowerCase().split(/[^\p{L}\p{N}+#.]+/u).filter((w) => w.length >= 3);
  const vid = [...video.entries()].filter(([, c]) => tu.some((w) => c.toLowerCase().includes(w))).slice(0, 40);
  const khoa = await docKhoaHoc();

  const r = await llmComplete({
    step: 'generation',
    purpose: 'news_bulletin',
    feature: 'news',
    system: heThong(khoa, vid),
    messages: [{ role: 'user', content: `Soạn ${so} bài về chủ đề: "${chuDe}". nhom = '${nhom}', dinhDang = '${dinhDang}' (anh.mau = '${MAU_THEO_DINH_DANG[dinhDang]}'). Mỗi bài một góc nhìn khác nhau.` }],
    maxTokens: Math.min(12_000, 3_500 * so),
  });
  return { bai: tachJson(r.text), model: r.model };
}

// ───────────────────────────── Máy kiểm ─────────────────────────────

const chuanHoa = (t: string) => t
  .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;|&#34;/g, '"')
  .replace(/&#39;|&#x27;|&rsquo;|&lsquo;|&#8217;|[‘’]/g, "'").replace(/&ldquo;|&rdquo;|[“”]/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').toLowerCase();

async function moUrl(u: string): Promise<{ ok: boolean; status: number; text: string }> {
  try {
    const m = u.match(/^https:\/\/cuongthai\.com\/courses\/([a-z0-9-]+)$/);
    if (m) {
      const r = await fetch(`https://cuongthai.com/api/v1/courses/${m[1]}`, { signal: AbortSignal.timeout(20_000) });
      return { ok: r.ok && ((await r.json()) as { success?: boolean }).success === true, status: r.status, text: '' };
    }
    if (u.startsWith('https://www.youtube.com/watch')) {
      const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(u)}`, { signal: AbortSignal.timeout(20_000) });
      return { ok: r.ok, status: r.status, text: '' };
    }
    const r = await fetch(u, { redirect: 'follow', headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(20_000) });
    const ct = r.headers.get('content-type') ?? '';
    return { ok: r.ok, status: r.status, text: ct.includes('text') ? chuanHoa(await r.text()) : '' };
  } catch (e) {
    return { ok: false, status: 0, text: (e as Error).message };
  }
}

/** Chạy một khối code; trả output thật (stdout, hoặc dòng lỗi với node-loi). */
function chay(k: Extract<Khoi, { k: 'code' }>, thuMuc: string, ten: string): { out?: string; loi?: string; boQua?: string } {
  if (k.chay === 'python' && spawnSync('python3', ['--version']).status !== 0) return { boQua: 'máy không có python3' };
  const tep = join(thuMuc, `${ten}.${k.chay === 'python' ? 'py' : 'mjs'}`);
  writeFileSync(tep, k.src);
  const r = spawnSync(k.chay === 'python' ? 'python3' : process.execPath, [tep], { encoding: 'utf8', timeout: 10_000, cwd: thuMuc });
  if (r.error) return { loi: `không chạy được: ${r.error.message}` };
  if (k.chay === 'node-loi') {
    if (r.status === 0) return { loi: 'chay=node-loi nhưng code KHÔNG ném lỗi' };
    const dong = r.stderr.split('\n').find((l) => /^\s*(\w*Error|Error)\b.*:/.test(l));
    return dong ? { out: dong.trim() } : { loi: `không tìm thấy dòng lỗi trong stderr: ${r.stderr.slice(0, 160)}` };
  }
  if (r.status !== 0) return { loi: `code chạy hỏng (exit ${r.status}): ${(r.stderr.split('\n').find((l) => /Error/.test(l)) ?? r.stderr).slice(0, 200)}` };
  return { out: r.stdout.replace(/[ \t]+$/gm, '').replace(/\s+$/, '') };
}

const danhSachId = new Set(THU_VIEN.map((b) => b.id));
const danhSachDongDau = new Set(THU_VIEN.map((b) => dongDau(b)));

async function kiemMot(tho: unknown, video: Map<string, string>, thuMuc: string): Promise<Nhap> {
  const bai = tho as BaiHoc;
  const loi: string[] = [];
  const canhBao: string[] = [];
  const daSua: string[] = [];

  // Cấu trúc.
  if (!bai || typeof bai !== 'object' || !bai.id || !bai.tieuDe || !Array.isArray(bai.khoi) || !bai.anh) {
    return { bai, kiem: { loi: ['thiếu trường bắt buộc (id/tieuDe/khoi/anh)'], canhBao, daSua } };
  }
  if (!/^[a-z0-9-]+$/.test(bai.id)) loi.push(`id không hợp lệ: ${bai.id}`);
  if (danhSachId.has(bai.id)) loi.push(`id trùng thư viện: ${bai.id}`);
  if (!NHOM.includes(bai.nhom)) loi.push(`nhom lạ: ${bai.nhom}`);
  if (!DINH_DANG.includes(bai.dinhDang)) loi.push(`dinhDang lạ: ${bai.dinhDang}`);
  else if (bai.anh.mau !== MAU_THEO_DINH_DANG[bai.dinhDang]) canhBao.push(`anh.mau '${bai.anh.mau}' khác mẫu thường dùng '${MAU_THEO_DINH_DANG[bai.dinhDang]}'`);
  const dau = dongDau(bai);
  if (dau.length > 80) loi.push(`dòng đầu ${dau.length} ký tự (> 80)`);
  if (danhSachDongDau.has(dau)) loi.push('tiêu đề trùng một bài đã có');
  if (!bai.nguon?.length) loi.push('thiếu nguồn');
  if (bai.dinhDang === 'quiz' && !bai.poll) loi.push('quiz thiếu poll');
  if (bai.poll) {
    if (!(bai.poll.dung >= 0 && bai.poll.dung < bai.poll.luaChon.length)) loi.push('poll.dung ngoài phạm vi');
    if (!bai.khoi.some((k) => k.k === 'dapan')) loi.push('có poll mà không có khối dapan');
  }
  if (/\p{Extended_Pictographic}/u.test(JSON.stringify(bai.anh))) loi.push('ảnh có emoji (phông máy chủ không vẽ được)');
  try {
    if (bai.anh.mau !== 'anh' && !dungSvg(bai.anh).length) loi.push('không dựng được ảnh');
  } catch (e) {
    loi.push(`dựng ảnh lỗi: ${(e as Error).message}`);
  }

  // Code: chạy lại, ghi đè output bằng output THẬT.
  for (const [i, k] of bai.khoi.entries()) {
    if (k.k !== 'code') continue;
    const nhan = `khối code #${i} (${k.chay})`;
    if (k.chay === 'khong') {
      if (k.out) { delete k.out; daSua.push(`${nhan}: xoá out (không chạy thì không có output)`); }
      continue;
    }
    if (k.chay === 'pg') { canhBao.push(`${nhan}: chạy tay trên PostgreSQL rồi dán output nguyên văn`); continue; }
    const kq = chay(k, thuMuc, `${bai.id}-${i}`);
    if (kq.boQua) { canhBao.push(`${nhan}: ${kq.boQua}`); continue; }
    if (kq.loi) { loi.push(`${nhan}: ${kq.loi}`); continue; }
    if (kq.out !== undefined && kq.out !== (k.out ?? '').replace(/[ \t]+$/gm, '').trim()) {
      daSua.push(`${nhan}: thay out LLM viết bằng output thật`);
    }
    if (bai.anh.mau === 'code' && bai.anh.code === k.src && bai.anh.output !== kq.out) {
      bai.anh.output = kq.out;
      daSua.push('anh.output: đồng bộ theo output thật');
    }
    k.out = kq.out;
  }
  if (bai.anh.mau === 'code' && bai.anh.output) {
    const thats = bai.khoi.flatMap((k) => (k.k === 'code' && k.out ? [k.out] : []));
    if (!thats.includes(bai.anh.output)) canhBao.push('anh.output không khớp output thật của khối nào — soát tay');
  }

  // URL: gõ lại tất cả; giữ nội dung trang nguồn để dò câu trích.
  const trangNguon: string[] = [];
  const urls = [...bai.nguon.map((n) => ({ ...n, loai: 'nguon' })), ...(bai.hocThem ?? []).map((n) => ({ ...n, loai: 'hocThem' }))];
  if (bai.anh.mau === 'anh') urls.push({ ten: 'ảnh', url: bai.anh.url, loai: 'anh' });
  for (const n of urls) {
    const r = await moUrl(n.url);
    if (!r.ok) loi.push(`URL chết (${r.status}) ${n.url}`);
    else if (n.loai === 'nguon') trangNguon.push(r.text);
    const yt = n.url.match(/youtube\.com\/watch\?v=([\w-]{11})/);
    if (yt && !video.has(yt[1])) loi.push(`video ${yt[1]} không nằm trong content/course-videos (chưa được repo kiểm)`);
    if (n.loai === 'hocThem' && !/^https:\/\/(cuongthai\.com\/courses\/|www\.youtube\.com\/watch)/.test(n.url)) canhBao.push(`hocThem không phải khoá học/video: ${n.url}`);
  }

  // Câu trích tiếng Anh trong ngoặc kép ⇒ phải có nguyên văn trên một trang nguồn.
  const chu = bai.khoi.flatMap((k) => (k.k === 'chu' || k.k === 'dapan' ? [k.t] : []));
  // Thẻ trích dẫn trong ảnh cũng là câu trích (có thể không bọc ngoặc) ⇒ bọc lại để dò như trên.
  if (bai.anh.mau === 'trichDan') chu.push(`"${bai.anh.cau.replace(/^["“\s]+|["”\s]+$/g, '')}"`);
  for (const t of chu) {
    for (const m of t.matchAll(/["“]([^"”]{20,})["”]/g)) {
      const cau = m[1];
      const latin = (cau.match(/[A-Za-z]/g) ?? []).length / cau.length;
      if (latin < 0.6 || /[À-ỹ]/.test(cau)) continue; // câu tiếng Việt / không phải trích dẫn
      const tim = chuanHoa(cau).replace(/[.…]+$/, '');
      if (trangNguon.some((p) => p.includes(tim))) continue;
      // ≤ 8 từ thường là TÊN (sách, bài báo, mục) chứ không phải câu trích ⇒ chỉ cảnh báo.
      const thongBao = `câu trong ngoặc KHÔNG thấy nguyên văn trên trang nguồn: "${cau.slice(0, 90)}"`;
      if (cau.trim().split(/\s+/).length <= 8) canhBao.push(thongBao);
      else loi.push(thongBao);
    }
  }
  return { bai, kiem: { loi, canhBao, daSua } };
}

// ───────────────────────────── Chạy ─────────────────────────────

const video = docVideoRepo();
const thuMuc = mkdtempSync(join(tmpdir(), 'feed-hoc-soan-'));
let thoDs: unknown[];
let meta: Record<string, unknown>;

try {
  if (co('--kiem-lai')) {
    const tep = sau('--kiem-lai')!;
    const j = JSON.parse(readFileSync(tep, 'utf8')) as { nhap?: Array<{ bai: unknown }> } | unknown[];
    thoDs = Array.isArray(j) ? j : (j.nhap ?? []).map((x) => x.bai);
    meta = { kiemLaiTu: tep };
  } else {
    const chuDe = sau('--chu-de');
    if (!chuDe) {
      console.error('Thiếu --chu-de "<chủ đề>" (hoặc --kiem-lai <tệp nháp>). Xem đầu tệp để biết cách dùng.');
      process.exit(2);
    }
    const md = chonMacDinh();
    const nhom = (sau('--nhom') as NhomChuDe | undefined) ?? md.nhom;
    const dinhDang = (sau('--dinh-dang') as DinhDang | undefined) ?? md.dinhDang;
    if (!NHOM.includes(nhom) || !DINH_DANG.includes(dinhDang)) {
      console.error(`--nhom phải thuộc ${NHOM.join(', ')}; --dinh-dang phải thuộc ${DINH_DANG.join(', ')}`);
      process.exit(2);
    }
    const so = Math.max(1, Math.min(4, Number(sau('--so')) || 1));
    console.log(`Soạn ${so} nháp · chủ đề "${chuDe}" · nhóm ${nhom} · định dạng ${dinhDang}`);
    const r = await goiLlm(chuDe, nhom, dinhDang, so, video);
    thoDs = r.bai;
    meta = { chuDe, nhom, dinhDang, model: r.model };
  }

  const nhap: Nhap[] = [];
  for (const t of thoDs) nhap.push(await kiemMot(t, video, thuMuc));

  const ra = sau('--ra') ?? join(tmpdir(), 'feed-hoc-nhap', `${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  mkdirSync(dirname(ra), { recursive: true });
  writeFileSync(ra, `${JSON.stringify({ taoLuc: new Date().toISOString(), ...meta, nhap }, null, 2)}\n`);

  for (const n of nhap) {
    const { loi, canhBao, daSua } = n.kiem;
    console.log(`\n• ${n.bai?.id ?? '(không id)'} — ${loi.length ? `✗ ${loi.length} lỗi` : '✓ qua máy kiểm'}`);
    for (const x of loi) console.log(`  ✗ ${x}`);
    for (const x of canhBao) console.log(`  ⚠ ${x}`);
    for (const x of daSua) console.log(`  ↻ ${x}`);
  }
  console.log(`\nNháp: ${ra}`);
  console.log('Chưa đăng gì. Người duyệt: sửa lỗi, đối chiếu lại nội dung, chép vào thuVien.ts, rồi chạy feed-hoc-kiem.ts --url.');
  process.exitCode = nhap.some((n) => n.kiem.loi.length) ? 1 : 0;
} finally {
  rmSync(thuMuc, { recursive: true, force: true });
}
