/**
 * Mục lục đề phòng thi máy tính. Thêm đề mới:
 *   1. tạo `de/<id>.ts` (xem types.ts — quy ước `[[n]]`, `ev` nguyên văn),
 *   2. thêm MỘT dòng vào MUC_LUC + một dòng trong `TEP_DE`,
 *   3. gom vào một bộ trong `BO_DE` (Đề N đủ 4 kỹ năng — docs/ielts-lo-trinh-0-8.md mục 4.2),
 *   4. thêm đề vào `frontend/src/lib/ielts/thiMayCham.test.ts` rồi chạy
 *      `npx tsx --test frontend/src/lib/ielts/thiMayCham.test.ts` — duyệt đủ đáp án,
 *      `ev` là chuỗi con thật, đáp án có trong bài, số câu 1–40 liên tục, đáp án chuẩn ra 40/40.
 * Nội dung đề tải lười (import() theo id) ⇒ trang chọn đề không tải cả kho.
 *
 * 12/11/2026: thêm kỹ năng `noi` (Speaking, giám khảo AI) và `sangloc` (10′ sàng lọc của Đề 0 — test đầu vào);
 * Đề 0 (`sangloc-00`, `nghe-00`, `doc-00`, `viet-00`, `noi-00`, phiên soạn đề) đã đăng ký. Bộ đề tham chiếu id chưa
 * có tệp ⇒ giao diện hiện "sắp có" cho kỹ năng đó, không hỏng.
 */
import type { BoDeDu, De, KyNang, MucDe } from './types';

export const MUC_LUC: MucDe[] = [
  // Đề 0 — Test đầu vào (phiên soạn đề, 12/11/2026): sàng lọc 10′ + 4 kỹ năng bậc thang band 4.0 → 8.0.
  { id: 'sangloc-00', kyNang: 'sangloc', ten: 'Placement Test — 10-minute screening', boDe: 'Đề 0 · Test đầu vào', capDo: 'A1 → B2 (bậc thang)', phut: 10, soCau: 30,
    moTa: '25 câu ngữ pháp + từ vựng A1 → B2 · 5 câu True/False/Not Given trên đoạn đọc ngắn', dang: ['mcq', 'tfng'] },
  { id: 'nghe-00', kyNang: 'nghe', ten: 'Placement Test — Listening', boDe: 'Đề 0 · Test đầu vào', capDo: 'Band 4.0 → 8.0 (bậc thang)', phut: 30, soCau: 40,
    moTa: 'Pottery course enquiry · City farm induction & map · Museum visitor study (3 speakers) · Lecture on Roman concrete',
    dang: ['form', 'map', 'mcq', 'match-feature', 'mcq2', 'flow', 'note', 'sentence', 'table'] },
  { id: 'doc-00', kyNang: 'doc', ten: 'Placement Test — Academic Reading', boDe: 'Đề 0 · Test đầu vào', capDo: 'Band 4.0 → 8.0 (bậc thang)', phut: 60, soCau: 40,
    moTa: 'A short history of the pencil · The return of the night train · Is handwriting worth saving?',
    dang: ['sentence', 'table', 'tfng', 'heading', 'match-info', 'summary', 'ynng', 'mcq', 'mcq2', 'match-ending'] },
  { id: 'viet-00', kyNang: 'viet', ten: 'Placement Test — Academic Writing', boDe: 'Đề 0 · Test đầu vào', capDo: 'Band 4.0 → 8.0', phut: 60, soCau: 2,
    moTa: 'Task 1: time spent reading by age group (single bar chart) · Task 2: is online learning as effective as the classroom? (opinion)' },
  { id: 'noi-00', kyNang: 'noi', ten: 'Placement Test — Speaking', boDe: 'Đề 0 · Test đầu vào', capDo: 'Band 4.0 → 8.0', phut: 13, soCau: 3,
    moTa: 'Part 1: work or study · hometown · Part 2: a person you admire · Part 3: role models, fame and admiration' },
  // Đề 1 — thi cuối Tập 1 (Ngày 15), band 3.5 → 4.5 (soạn 12/11/2026). Mã tệp `-de1` vì `-01` đã là Đề 6.
  { id: 'nghe-de1', kyNang: 'nghe', ten: 'Listening — Đề 1 (thi cuối Tập 1)', boDe: 'Đề 1', capDo: 'Band 3.5 → 4.5', phut: 30, soCau: 40,
    moTa: 'Joining a public library · Bus service changes & bus station plan · Two students choose a presentation topic · Lecture on sleep',
    dang: ['form', 'note', 'mcq', 'map', 'match-feature', 'summary'] },
  { id: 'doc-de1', kyNang: 'doc', ten: 'Academic Reading — Đề 1 (thi cuối Tập 1)', boDe: 'Đề 1', capDo: 'Band 3.5 → 4.5', phut: 60, soCau: 40,
    moTa: 'The story of the traffic light · Turning the classroom upside down · The barcode: lines that changed shopping',
    dang: ['sentence', 'table', 'tfng', 'match-feature', 'flow', 'short', 'summary-box'] },
  { id: 'viet-de1', kyNang: 'viet', ten: 'Academic Writing — Đề 1 (thi cuối Tập 1)', boDe: 'Đề 1', capDo: 'Band 3.5 → 4.5', phut: 60, soCau: 2,
    moTa: 'Task 1: visitors to three city attractions, 2014–2024 (line graph) · Task 2: should students bring mobile phones to school? (opinion)' },
  { id: 'noi-de1', kyNang: 'noi', ten: 'Speaking — Đề 1 (thi cuối Tập 1)', boDe: 'Đề 1', capDo: 'Band 3.5 → 4.5', phut: 12, soCau: 3,
    moTa: 'Part 1: daily routine · family · Part 2: a place you like to go to · Part 3: places to relax, public places in cities' },
  // Đề 6 (đầu Tập 4).
  { id: 'doc-01', kyNang: 'doc', ten: 'Academic Reading — Test 1', boDe: 'Đề 6', capDo: 'Band 6 → 7.5', phut: 60, soCau: 40, moTa: 'Mangroves · The shipping container · The hidden value of boredom',
    dang: ['note', 'diagram', 'tfng', 'heading', 'match-feature', 'summary-box', 'ynng', 'mcq', 'mcq2', 'sentence'] },
  { id: 'nghe-01', kyNang: 'nghe', ten: 'Listening — Test 1', boDe: 'Đề 6', capDo: 'Band 6 → 7.5', phut: 30, soCau: 40, moTa: 'Paddle club form · Market hall map · Urban heat project · Reef sounds lecture',
    dang: ['form', 'map', 'mcq', 'match-feature', 'mcq2', 'flow', 'note'] },
  { id: 'viet-01', kyNang: 'viet', ten: 'Academic Writing — Test 1', boDe: 'Đề 6', capDo: 'Band 6 → 7.5', phut: 60, soCau: 2, moTa: 'Task 1 bar chart (commuting) · Task 2 discuss both views (university purpose)' },
  { id: 'noi-06', kyNang: 'noi', ten: 'Speaking — Test 1', boDe: 'Đề 6', capDo: 'Band 6 → 7.5', phut: 13, soCau: 3,
    moTa: 'Part 1: art · neighbours · Part 2: an important decision you made · Part 3: decisions, advice, choice and technology' },
];

/** id → hàm tải tệp đề (mỗi tệp một chunk). */
const TEP_DE: Record<string, () => Promise<De>> = {
  'doc-01': () => import('./doc-01').then((m) => m.DOC_01),
  'nghe-01': () => import('./nghe-01').then((m) => m.NGHE_01),
  'viet-01': () => import('./viet-01').then((m) => m.VIET_01),
  'sangloc-00': () => import('./sangloc-00').then((m) => m.SANGLOC_00),
  'nghe-00': () => import('./nghe-00').then((m) => m.NGHE_00),
  'doc-00': () => import('./doc-00').then((m) => m.DOC_00),
  'viet-00': () => import('./viet-00').then((m) => m.VIET_00),
  'noi-00': () => import('./noi-00').then((m) => m.NOI_00),
  'nghe-de1': () => import('./nghe-de1').then((m) => m.NGHE_DE1),
  'doc-de1': () => import('./doc-de1').then((m) => m.DOC_DE1),
  'viet-de1': () => import('./viet-de1').then((m) => m.VIET_DE1),
  'noi-de1': () => import('./noi-de1').then((m) => m.NOI_DE1),
  'noi-06': () => import('./noi-06').then((m) => m.NOI_06),
};

export function taiDe(id: string): Promise<De> | null {
  const f = TEP_DE[id];
  return f ? f() : null;
}

/** Đề có tệp thật chưa (bộ đề có thể tham chiếu id chưa soạn ⇒ "sắp có"). */
export const coDe = (id: string | undefined): id is string => !!id && id in TEP_DE;

export const TEN_KY_NANG: Record<KyNang, string> = { nghe: 'Listening', doc: 'Reading', viet: 'Writing', noi: 'Speaking', sangloc: 'Sàng lọc' };

/** Thứ tự thi thật của một bộ đề đủ: (sàng lọc) → Listening → Reading → Writing → nghỉ → Speaking. */
export const THU_TU_THI: KyNang[] = ['sangloc', 'nghe', 'doc', 'viet', 'noi'];

/**
 * Bộ đề đủ 4 kỹ năng ("Đề N", docs/ielts-lo-trinh-0-8.md mục 4.2). Đề 0 = test đầu vào (mục 4.3).
 * Đề 1 (thi cuối Tập 1) = `nghe-de1` · `doc-de1` · `viet-de1` · `noi-de1` (mã `-de1` vì `-01` đã thuộc Đề 6).
 * Đề 6 (đầu Tập 4) = `nghe-01` · `doc-01` · `viet-01` · `noi-06`.
 */
export const BO_DE: BoDeDu[] = [
  {
    id: 'bo-00', so: 0, ten: 'Test đầu vào', capDo: 'Band 4.0 → 8.0 (bậc thang)', viTri: 'Làm TRƯỚC khi học — xếp đúng tập + ngày',
    sangLoc: 'sangloc-00', nghe: 'nghe-00', doc: 'doc-00', viet: 'viet-00', noi: 'noi-00',
  },
  {
    id: 'bo-01', so: 1, ten: 'Đề 1', capDo: 'Band 3.5 → 4.5', viTri: 'Thi cuối Tập 1 (Ngày 15)',
    nghe: 'nghe-de1', doc: 'doc-de1', viet: 'viet-de1', noi: 'noi-de1',
  },
  {
    id: 'bo-06', so: 6, ten: 'Đề 6', capDo: 'Band 6.0 → 7.5', viTri: 'Đầu Tập 4 (Ngày 1)',
    nghe: 'nghe-01', doc: 'doc-01', viet: 'viet-01', noi: 'noi-06',
  },
];

/** id các đề (theo kỹ năng) của một bộ — chỉ những kỹ năng có khai. */
export function deCuaBo(b: BoDeDu): { kyNang: KyNang; id: string }[] {
  const ds: { kyNang: KyNang; id: string }[] = [];
  if (b.sangLoc) ds.push({ kyNang: 'sangloc', id: b.sangLoc });
  if (b.nghe) ds.push({ kyNang: 'nghe', id: b.nghe });
  if (b.doc) ds.push({ kyNang: 'doc', id: b.doc });
  if (b.viet) ds.push({ kyNang: 'viet', id: b.viet });
  if (b.noi) ds.push({ kyNang: 'noi', id: b.noi });
  return ds;
}

/** Bộ chứa một đề (để thẻ đề hiện "Đề 6"). */
export const boCuaDe = (deId: string): BoDeDu | undefined => BO_DE.find((b) => deCuaBo(b).some((d) => d.id === deId));
