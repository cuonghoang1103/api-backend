/**
 * My Language — Roadmap (learning path) service.
 *
 * A per-language visual roadmap (roadmap.sh style): ordered stages, each with
 * nodes that deep-link into the existing section pages. Public read + per-user
 * manual "done" toggle + ADMIN CRUD + an idempotent seeder for the two priority
 * languages (English 0→IELTS 7.5, Japanese 0→N2).
 *
 * Fully additive — reuses the existing `Language` + section pages; no change to
 * any existing table or flow.
 */
import { prisma } from '../config/database.js';
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js';

export interface RoadmapNodeDto {
  id: number;
  stage: number;
  stageLabel: string;
  order: number;
  side: string;
  kind: string;
  title: string;
  subtitle: string | null;
  level: string | null;
  icon: string | null;
  description: string | null;
  linkType: string | null;
  linkRef: string | null;
}
export interface RoadmapStageDto {
  stage: number;
  stageLabel: string;
  nodes: RoadmapNodeDto[];
}
export interface RoadmapDto {
  language: { id: number; code: string; name: string; nameEn: string; flagEmoji: string };
  stages: RoadmapStageDto[];
  doneNodeIds: number[];
  total: number;
}

const LINK_TYPES = new Set([
  'alphabet', 'vocab', 'grammar', 'listening', 'conversation', 'reading', 'qna', 'roleplay', 'writing', 'external',
]);
const SIDES = new Set(['center', 'left', 'right']);
const KINDS = new Set(['primary', 'alternative', 'info']);

function toDto(n: {
  id: number; stage: number; stageLabel: string; order: number; side: string; kind: string;
  title: string; subtitle: string | null; level: string | null; icon: string | null;
  description: string | null; linkType: string | null; linkRef: string | null;
}): RoadmapNodeDto {
  return {
    id: n.id, stage: n.stage, stageLabel: n.stageLabel, order: n.order, side: n.side, kind: n.kind,
    title: n.title, subtitle: n.subtitle, level: n.level, icon: n.icon,
    description: n.description, linkType: n.linkType, linkRef: n.linkRef,
  };
}

async function findLanguageByCode(code: string) {
  const language = await prisma.language.findUnique({
    where: { code: String(code || '').trim() },
    select: { id: true, code: true, name: true, nameEn: true, flagEmoji: true },
  });
  if (!language) throw new NotFoundError('Không tìm thấy ngôn ngữ.');
  return language;
}

/** Public: the whole roadmap for a language, grouped into stages (+ user's done set). */
export async function getRoadmap(code: string, userId?: number): Promise<RoadmapDto> {
  const language = await findLanguageByCode(code);
  const nodes = await prisma.langRoadmapNode.findMany({
    where: { languageId: language.id },
    orderBy: [{ stage: 'asc' }, { order: 'asc' }, { id: 'asc' }],
  });

  const stages: RoadmapStageDto[] = [];
  for (const n of nodes) {
    let s = stages.find((x) => x.stage === n.stage);
    if (!s) {
      s = { stage: n.stage, stageLabel: n.stageLabel, nodes: [] };
      stages.push(s);
    }
    s.nodes.push(toDto(n));
  }

  let doneNodeIds: number[] = [];
  if (userId && nodes.length) {
    const done = await prisma.langRoadmapDone.findMany({
      where: { userId, nodeId: { in: nodes.map((n) => n.id) } },
      select: { nodeId: true },
    });
    doneNodeIds = done.map((d) => d.nodeId);
  }

  return { language, stages, doneNodeIds, total: nodes.length };
}

/** Authed user: toggle a node's completion. Returns the new state. */
export async function toggleDone(userId: number, nodeId: number): Promise<{ nodeId: number; done: boolean }> {
  if (!Number.isInteger(nodeId) || nodeId <= 0) throw new BadRequestError('nodeId không hợp lệ.');
  const node = await prisma.langRoadmapNode.findUnique({ where: { id: nodeId }, select: { id: true } });
  if (!node) throw new NotFoundError('Không tìm thấy chặng.');
  const existing = await prisma.langRoadmapDone.findUnique({
    where: { userId_nodeId: { userId, nodeId } },
    select: { id: true },
  });
  if (existing) {
    await prisma.langRoadmapDone.delete({ where: { id: existing.id } });
    return { nodeId, done: false };
  }
  await prisma.langRoadmapDone.create({ data: { userId, nodeId } });
  return { nodeId, done: true };
}

// ─── Admin CRUD ──────────────────────────────────────────────────
function sanitizeNodeInput(body: Record<string, unknown>) {
  const str = (v: unknown, max = 255): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const optStr = (v: unknown, max = 255): string | null => {
    const s = str(v, max);
    return s ? s : null;
  };
  const side = String(body.side ?? 'center');
  const kind = String(body.kind ?? 'primary');
  const linkType = body.linkType != null ? String(body.linkType) : null;
  return {
    stage: Number.isFinite(Number(body.stage)) ? Math.trunc(Number(body.stage)) : 0,
    stageLabel: str(body.stageLabel, 120),
    order: Number.isFinite(Number(body.order)) ? Math.trunc(Number(body.order)) : 0,
    side: SIDES.has(side) ? side : 'center',
    kind: KINDS.has(kind) ? kind : 'primary',
    title: str(body.title, 255),
    subtitle: optStr(body.subtitle, 255),
    level: optStr(body.level, 20),
    icon: optStr(body.icon, 48),
    description: optStr(body.description, 4000),
    linkType: linkType && LINK_TYPES.has(linkType) ? linkType : null,
    linkRef: optStr(body.linkRef, 255),
  };
}

export async function adminListNodes(code: string): Promise<RoadmapNodeDto[]> {
  const language = await findLanguageByCode(code);
  const nodes = await prisma.langRoadmapNode.findMany({
    where: { languageId: language.id },
    orderBy: [{ stage: 'asc' }, { order: 'asc' }, { id: 'asc' }],
  });
  return nodes.map(toDto);
}

export async function adminCreateNode(languageId: number, body: Record<string, unknown>): Promise<RoadmapNodeDto> {
  const data = sanitizeNodeInput(body);
  if (!data.title) throw new BadRequestError('Thiếu tiêu đề chặng.');
  if (!data.stageLabel) throw new BadRequestError('Thiếu tên nhóm chặng (stageLabel).');
  const node = await prisma.langRoadmapNode.create({ data: { ...data, languageId } });
  return toDto(node);
}

export async function adminUpdateNode(id: number, body: Record<string, unknown>): Promise<RoadmapNodeDto> {
  const data = sanitizeNodeInput(body);
  if (!data.title) throw new BadRequestError('Thiếu tiêu đề chặng.');
  if (!data.stageLabel) throw new BadRequestError('Thiếu tên nhóm chặng (stageLabel).');
  const node = await prisma.langRoadmapNode.update({ where: { id }, data });
  return toDto(node);
}

export async function adminDeleteNode(id: number): Promise<{ id: number }> {
  await prisma.langRoadmapNode.delete({ where: { id } });
  return { id };
}

export async function adminReorder(items: Array<{ id: number; stage?: number; order?: number; side?: string }>): Promise<{ updated: number }> {
  const list = Array.isArray(items) ? items : [];
  let updated = 0;
  for (const it of list) {
    const id = Number(it?.id);
    if (!Number.isInteger(id) || id <= 0) continue;
    const data: { stage?: number; order?: number; side?: string } = {};
    if (Number.isFinite(Number(it.stage))) data.stage = Math.trunc(Number(it.stage));
    if (Number.isFinite(Number(it.order))) data.order = Math.trunc(Number(it.order));
    if (it.side && SIDES.has(String(it.side))) data.side = String(it.side);
    if (!Object.keys(data).length) continue;
    await prisma.langRoadmapNode.update({ where: { id }, data }).then(() => { updated++; }).catch(() => {});
  }
  return { updated };
}

// ─── Auto-assign vocab categories to stages ──────────────────────
/**
 * Bind the language's vocab categories to the roadmap's vocab nodes so the
 * Practice path groups lessons by stage out-of-the-box. Distributes eligible
 * categories (≥4 words) across the ordered vocab nodes as evenly as possible.
 *
 * Additive & safe: by default it only fills vocab nodes that have NO linkRef yet
 * and skips categories already bound to some node (so manual bindings and reruns
 * are preserved). `force` clears all vocab-node linkRefs first and reassigns.
 */
export async function autoAssignCategories(
  code: string,
  opts: { force?: boolean } = {},
): Promise<{ code: string; boundNodes: number; assignedCategories: number; vocabNodes: number; eligibleCategories: number }> {
  const language = await findLanguageByCode(code);

  const vocabNodes = await prisma.langRoadmapNode.findMany({
    where: { languageId: language.id, linkType: 'vocab' },
    orderBy: [{ stage: 'asc' }, { order: 'asc' }, { id: 'asc' }],
    select: { id: true, linkRef: true },
  });
  if (!vocabNodes.length) {
    return { code: language.code, boundNodes: 0, assignedCategories: 0, vocabNodes: 0, eligibleCategories: 0 };
  }

  if (opts.force) {
    await prisma.langRoadmapNode.updateMany({
      where: { languageId: language.id, linkType: 'vocab' },
      data: { linkRef: null },
    });
    for (const n of vocabNodes) n.linkRef = null;
  }

  const cats = await prisma.langVocabCategory.findMany({
    where: { languageId: language.id },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
    include: { _count: { select: { words: true } } },
  });
  const eligible = cats.filter((c) => c._count.words >= 4);

  // Categories already bound to any node stay put (idempotent reruns).
  const boundCatIds = new Set<number>();
  for (const n of vocabNodes) {
    const cid = Number(n.linkRef);
    if (Number.isInteger(cid) && cid > 0) boundCatIds.add(cid);
  }
  const freeCats = eligible.filter((c) => !boundCatIds.has(c.id));
  const openNodes = vocabNodes.filter((n) => !(n.linkRef && n.linkRef.trim()));
  if (!openNodes.length || !freeCats.length) {
    return {
      code: language.code, boundNodes: 0, assignedCategories: 0,
      vocabNodes: vocabNodes.length, eligibleCategories: eligible.length,
    };
  }

  // One category per open node, in order (linkRef is a single-value anchor).
  // Any surplus categories stay unbound and surface under the "Từ vựng khác"
  // unit via the practice service's leftover fallback — no data lost.
  const n = Math.min(openNodes.length, freeCats.length);
  for (let i = 0; i < n; i++) {
    await prisma.langRoadmapNode.update({ where: { id: openNodes[i].id }, data: { linkRef: String(freeCats[i].id) } });
  }

  return {
    code: language.code, boundNodes: n, assignedCategories: n,
    vocabNodes: vocabNodes.length, eligibleCategories: eligible.length,
  };
}

// ─── Seeder (idempotent) ─────────────────────────────────────────
type NodeSeed = Omit<RoadmapNodeDto, 'id'>;

/**
 * Seed the roadmap for one language. Idempotent: if the language already has
 * roadmap nodes, it does nothing (returns skipped) unless `force` re-seeds after
 * clearing. Only knows the two priority languages 'en' and 'ja'.
 */
export async function seedRoadmap(code: string, opts: { force?: boolean } = {}): Promise<{ code: string; created: number; skipped: boolean }> {
  const c = String(code || '').trim().toLowerCase();
  const seed = ROADMAP_SEED[c];
  if (!seed) throw new BadRequestError(`Chưa có dữ liệu lộ trình mẫu cho "${code}". Hiện hỗ trợ: en, ja.`);
  const language = await findLanguageByCode(c);

  const existing = await prisma.langRoadmapNode.count({ where: { languageId: language.id } });
  if (existing > 0 && !opts.force) return { code: c, created: 0, skipped: true };
  if (existing > 0 && opts.force) {
    await prisma.langRoadmapNode.deleteMany({ where: { languageId: language.id } });
  }

  await prisma.langRoadmapNode.createMany({
    data: seed.map((n) => ({ ...n, languageId: language.id })),
  });
  return { code: c, created: seed.length, skipped: false };
}

/** Seed all known priority languages that exist in the DB. */
export async function seedAllRoadmaps(opts: { force?: boolean } = {}): Promise<Array<{ code: string; created: number; skipped: boolean }>> {
  const out: Array<{ code: string; created: number; skipped: boolean }> = [];
  for (const code of Object.keys(ROADMAP_SEED)) {
    const lang = await prisma.language.findUnique({ where: { code }, select: { id: true } });
    if (!lang) { out.push({ code, created: 0, skipped: true }); continue; }
    out.push(await seedRoadmap(code, opts));
  }
  return out;
}

// Helper to keep the seed data terse.
function node(
  stage: number, stageLabel: string, order: number, side: RoadmapNodeDto['side'],
  title: string, level: string | null, icon: string, linkType: string | null,
  description: string, kind: RoadmapNodeDto['kind'] = 'primary', subtitle: string | null = null,
): NodeSeed {
  return { stage, stageLabel, order, side, kind, title, subtitle, level, icon, description, linkType, linkRef: null };
}

// ── English: 0 → IELTS 7.5 ──────────────────────────────────────
const EN_SEED: NodeSeed[] = [
  // Stage 0 — Khởi động (A1)
  node(0, 'Khởi động (A1)', 0, 'center', 'Phát âm & bảng IPA cơ bản', 'A1', 'Type', 'alphabet', 'Làm quen 44 âm tiếng Anh và bảng phiên âm IPA. Phát âm đúng từ đầu giúp bạn nghe tốt hơn và tránh sửa lỗi về sau — nền tảng cho cả 4 kỹ năng.'),
  node(0, 'Khởi động (A1)', 1, 'right', '500 từ vựng cốt lõi', 'A1', 'BookOpen', 'vocab', 'Nhóm từ thông dụng nhất (chào hỏi, số đếm, gia đình, đồ vật quanh ta). 500 từ đầu tiên đã phủ phần lớn hội thoại hằng ngày.'),
  node(0, 'Khởi động (A1)', 2, 'center', 'Ngữ pháp nền: to be, thì hiện tại đơn', 'A1', 'GraduationCap', 'grammar', 'Động từ to be, thì hiện tại đơn, mạo từ a/an/the và trật tự câu cơ bản (S-V-O). Đây là bộ khung để nói câu đúng ngay từ đầu.'),
  node(0, 'Khởi động (A1)', 3, 'left', 'Chào hỏi & giao tiếp cơ bản', 'A1', 'MessagesSquare', 'conversation', 'Các mẫu câu chào hỏi, giới thiệu bản thân, hỏi-đáp đơn giản. Luyện nói to theo mẫu để quen nhịp điệu tiếng Anh.'),
  node(0, 'Khởi động (A1)', 4, 'center', 'Nghe hội thoại chậm', 'A1', 'Headphones', 'listening', 'Nghe các đoạn hội thoại ngắn, tốc độ chậm, có phụ đề. Tập bắt âm và nối âm — kỹ năng nghe cần vào sớm.'),

  // Stage 1 — Sơ cấp (A2)
  node(1, 'Sơ cấp (A2)', 0, 'center', '1000 từ chủ đề đời sống', 'A2', 'BookOpen', 'vocab', 'Mở rộng vốn từ theo chủ đề (công việc, mua sắm, du lịch, sức khỏe). Học từ theo cụm và ví dụ để nhớ lâu.'),
  node(1, 'Sơ cấp (A2)', 1, 'right', 'Thì quá khứ/tương lai, câu hỏi Wh-', 'A2', 'GraduationCap', 'grammar', 'Quá khứ đơn, tương lai (will/going to), câu hỏi Wh-. Bắt đầu kể lại việc đã xảy ra và nói về kế hoạch.'),
  node(1, 'Sơ cấp (A2)', 2, 'left', 'Giới từ & danh từ đếm được', 'A2', 'GraduationCap', 'grammar', 'Giới từ thời gian/nơi chốn (in/on/at), danh từ đếm được – không đếm được, some/any. Những điểm người Việt hay sai.'),
  node(1, 'Sơ cấp (A2)', 3, 'center', 'Đọc đoạn văn ngắn', 'A2', 'Newspaper', 'reading', 'Đọc hiểu đoạn ngắn (email, thông báo, mẩu tin). Tập đoán nghĩa từ ngữ cảnh thay vì tra từng từ.'),
  node(1, 'Sơ cấp (A2)', 4, 'center', 'Viết câu & đoạn ngắn (AI chấm)', 'A2', 'PenLine', 'writing', 'Viết câu và đoạn 3–5 câu, để AI chỉ lỗi và gợi ý bản viết lại. Viết sớm giúp củng cố ngữ pháp vừa học.'),

  // Stage 2 — Trung cấp (B1)
  node(2, 'Trung cấp (B1)', 0, 'center', '2000 từ + collocations', 'B1', 'BookOpen', 'vocab', 'Học từ theo collocation (make/do, strong tea…) và cụm động từ (phrasal verbs) thông dụng. Đây là bước tạo sự tự nhiên.'),
  node(2, 'Trung cấp (B1)', 1, 'right', 'Hoàn thành, bị động, câu điều kiện', 'B1', 'GraduationCap', 'grammar', 'Hiện tại hoàn thành, câu bị động, câu điều kiện loại 1–2. Nhóm ngữ pháp trung tâm của trình độ B1.'),
  node(2, 'Trung cấp (B1)', 2, 'left', 'Nghe podcast & hội thoại', 'B1', 'Headphones', 'listening', 'Nghe hội thoại/podcast tốc độ tự nhiên về chủ đề quen thuộc. Luyện nghe ý chính và chi tiết.'),
  node(2, 'Trung cấp (B1)', 3, 'center', 'Đọc bài báo dễ', 'B1', 'Newspaper', 'reading', 'Đọc tin/bài viết ngắn, luyện skimming (đọc lướt ý chính) và scanning (tìm thông tin). Kỹ năng lõi cho IELTS Reading.'),
  node(2, 'Trung cấp (B1)', 4, 'center', 'Nói chủ đề quen thuộc (Hội thoại AI)', 'B1', 'Bot', 'roleplay', 'Nhập vai hội thoại với AI (đặt phòng, phỏng vấn, kể chuyện). Được sửa lỗi nhẹ nhàng ngay khi nói.'),

  // Stage 3 — IELTS nền (B2 · 5.5–6.5)
  node(3, 'IELTS nền (B2 · band 5.5–6.5)', 0, 'center', 'Academic vocabulary (word families)', 'B2', 'BookOpen', 'vocab', 'Từ vựng học thuật theo họ từ (analyse → analysis → analytical) và cách paraphrase. Nâng band Lexical Resource.'),
  node(3, 'IELTS nền (B2 · band 5.5–6.5)', 1, 'right', 'Mệnh đề quan hệ, linking words, câu phức', 'B2', 'GraduationCap', 'grammar', 'Mệnh đề quan hệ, từ nối (however, therefore…) và cách viết câu phức mạch lạc — nền cho Writing & Speaking band 6+.'),
  node(3, 'IELTS nền (B2 · band 5.5–6.5)', 2, 'left', 'IELTS Listening: Section 1–4', 'B2', 'Headphones', 'listening', 'Chiến lược cho 4 phần Listening: dự đoán đáp án, bẫy thường gặp, chính tả số/tên. Luyện theo dạng đề.', 'alternative'),
  node(3, 'IELTS nền (B2 · band 5.5–6.5)', 3, 'right', 'IELTS Reading: dạng câu hỏi', 'B2', 'Newspaper', 'reading', 'Xử lý từng dạng câu hỏi (T/F/NG, Matching Headings, Gap-fill) và quản lý thời gian 60 phút cho 3 bài đọc.', 'alternative'),
  node(3, 'IELTS nền (B2 · band 5.5–6.5)', 4, 'left', 'IELTS Writing Task 1 (mô tả biểu đồ)', 'B2', 'PenLine', 'writing', 'Cấu trúc bài mô tả biểu đồ/bảng/quy trình, ngôn ngữ so sánh và xu hướng. Để AI chấm theo tiêu chí band.', 'alternative'),
  node(3, 'IELTS nền (B2 · band 5.5–6.5)', 5, 'right', 'IELTS Writing Task 2 (cấu trúc essay)', 'B2', 'PenLine', 'writing', 'Dàn ý 4 đoạn, câu chủ đề, phát triển luận điểm với ví dụ. Đây là phần chiếm nhiều điểm nhất của Writing.', 'alternative'),
  node(3, 'IELTS nền (B2 · band 5.5–6.5)', 6, 'center', 'IELTS Speaking Part 1–3 (fluency)', 'B2', 'Bot', 'roleplay', 'Luyện trả lời 3 phần Speaking với AI, tập độ trôi chảy (fluency) và mở rộng câu trả lời. Dùng chấm phát âm để sửa âm.', 'alternative'),

  // Stage 4 — IELTS 7.0–7.5 (C1)
  node(4, 'IELTS 7.0–7.5 (C1)', 0, 'center', 'Lexical resource band 7+ (paraphrase & idiom)', 'C1', 'BookOpen', 'vocab', 'Từ vựng chính xác theo ngữ cảnh, paraphrase linh hoạt và cách dùng thành ngữ tự nhiên — điều kiện để đạt band 7 về từ vựng.'),
  node(4, 'IELTS 7.0–7.5 (C1)', 1, 'right', 'Ngữ pháp nâng cao & độ chính xác', 'C1', 'GraduationCap', 'grammar', 'Đa dạng cấu trúc câu với độ chính xác cao (đảo ngữ, mệnh đề rút gọn, cleft). Band 7 yêu cầu ít lỗi và câu đa dạng.'),
  node(4, 'IELTS 7.0–7.5 (C1)', 2, 'left', 'Writing Task 2 band 7 (coherence & lập luận)', 'C1', 'PenLine', 'writing', 'Nâng mạch lạc (coherence & cohesion), lập luận sâu và ví dụ thuyết phục. AI chấm sát 4 tiêu chí IELTS.', 'alternative'),
  node(4, 'IELTS 7.0–7.5 (C1)', 3, 'right', 'Speaking band 7 (phát âm & mạch lạc)', 'C1', 'Bot', 'roleplay', 'Luyện phát âm, ngữ điệu, và trả lời mạch lạc có chiều sâu. Dùng chấm phát âm AI để đạt tiêu chí Pronunciation.', 'alternative'),
  node(4, 'IELTS 7.0–7.5 (C1)', 4, 'center', 'Đề thi thử 4 kỹ năng + phân tích lỗi', 'C1', 'Newspaper', 'reading', 'Làm full test định kỳ, bấm giờ như thật, rồi phân tích lỗi từng kỹ năng để tối ưu band. Bước cuối trước phòng thi.'),
];

// ── Japanese: 0 → N2 ────────────────────────────────────────────
const JA_SEED: NodeSeed[] = [
  // Stage 0 — Kana & nền
  node(0, 'Kana & nền', 0, 'center', 'Hiragana ひらがな', null, 'Type', 'alphabet', 'Học trọn bảng Hiragana qua 9 chặng (nhận mặt chữ → viết tay). Đây là hệ chữ đầu tiên, bắt buộc trước mọi thứ khác.'),
  node(0, 'Kana & nền', 1, 'right', 'Katakana カタカナ', null, 'Type', 'alphabet', 'Bảng Katakana dùng cho từ mượn/tên riêng. Học ngay sau Hiragana để đọc được biển hiệu, thực đơn, tên nước ngoài.'),
  node(0, 'Kana & nền', 2, 'center', 'Phát âm & số đếm', null, 'BookOpen', 'vocab', 'Cách phát âm chuẩn (trường âm, âm ngắt), số đếm và đơn vị. Nền để nghe – nói tự nhiên ngay từ đầu.'),

  // Stage 1 — N5
  node(1, 'N5', 0, 'center', 'Kanji N5 (~100 chữ)', 'N5', 'BookOpen', 'vocab', 'Khoảng 100 kanji cơ bản (số, ngày tháng, người, đồ vật). Học kèm âm on/kun và ghép từ để nhớ lâu.'),
  node(1, 'N5', 1, 'right', '800 từ vựng N5', 'N5', 'BookOpen', 'vocab', 'Vốn từ nền tảng N5 theo chủ đề đời sống. Kết hợp flashcard + ôn tập ngắt quãng (SRS) để ghi nhớ.'),
  node(1, 'N5', 2, 'center', 'Ngữ pháp N5: は/が/を/に, thể ます', 'N5', 'GraduationCap', 'grammar', 'Trợ từ cơ bản (は/が/を/に/へ), thể lịch sự ます/です, tính từ đuôi い/な và て-form khởi đầu. Bộ khung câu N5.'),
  node(1, 'N5', 3, 'left', 'Hội thoại chào hỏi', 'N5', 'MessagesSquare', 'conversation', 'Mẫu câu chào hỏi, mua bán, hỏi đường đơn giản. Luyện nói to theo hội thoại để quen ngữ điệu.'),
  node(1, 'N5', 4, 'center', 'Nghe N5', 'N5', 'Headphones', 'listening', 'Nghe hội thoại ngắn tốc độ chậm. Tập bắt trợ từ và đuôi câu — chìa khóa hiểu tiếng Nhật.'),

  // Stage 2 — N4
  node(2, 'N4', 0, 'center', 'Kanji N4 (~300 chữ)', 'N4', 'BookOpen', 'vocab', 'Nâng lên ~300 kanji. Chú ý các chữ nhiều âm đọc và cách ghép từ Hán tự để đoán nghĩa.'),
  node(2, 'N4', 1, 'right', '1500 từ vựng N4', 'N4', 'BookOpen', 'vocab', 'Mở rộng vốn từ N4 theo chủ đề công việc, đi lại, cảm xúc. Học theo cụm và ví dụ.'),
  node(2, 'N4', 2, 'center', 'Ngữ pháp N4: thể thường, điều kiện と/ば/たら', 'N4', 'GraduationCap', 'grammar', 'Thể thường (普通形), khả năng (可能), ý chí, các mẫu điều kiện と/ば/たら/なら và kính ngữ sơ cấp. Cầu nối lên trung cấp.'),
  node(2, 'N4', 3, 'left', 'Nghe hội thoại đời thường', 'N4', 'Headphones', 'listening', 'Nghe hội thoại tốc độ gần tự nhiên trong tình huống hằng ngày. Tập nghe ý và phản xạ.'),
  node(2, 'N4', 4, 'center', 'Đọc đoạn ngắn', 'N4', 'Newspaper', 'reading', 'Đọc hiểu đoạn văn ngắn (email, nhật ký, thông báo). Luyện đọc trôi không dịch từng chữ.'),

  // Stage 3 — N3 (cầu nối)
  node(3, 'N3 (cầu nối)', 0, 'center', 'Kanji N3 (~650 chữ)', 'N3', 'BookOpen', 'vocab', 'Khoảng 650 kanji — bước nhảy lớn về lượng. Ôn tập ngắt quãng đều đặn để không quên chữ cũ.'),
  node(3, 'N3 (cầu nối)', 1, 'right', '3700 từ vựng N3', 'N3', 'BookOpen', 'vocab', 'Vốn từ N3 trừu tượng hơn (ý kiến, xã hội, công việc). Đây là chặng quyết định để lên N2.'),
  node(3, 'N3 (cầu nối)', 2, 'center', 'Ngữ pháp N3: bị động/sai khiến, kính ngữ', 'N3', 'GraduationCap', 'grammar', 'Thể bị động (受身), sai khiến (使役), kính ngữ (敬語) và nhiều mẫu trung cấp. Nhóm ngữ pháp bản lề của tiếng Nhật.'),
  node(3, 'N3 (cầu nối)', 3, 'left', 'Dokkai: đọc đoạn văn', 'N3', 'Newspaper', 'reading', 'Đọc đoạn văn dài hơn, luyện nắm ý và mạch lập luận. Chuẩn bị cho phần đọc N2.', 'alternative'),
  node(3, 'N3 (cầu nối)', 4, 'right', 'Nghe tốc độ tự nhiên', 'N3', 'Headphones', 'listening', 'Nghe hội thoại/độc thoại tốc độ thật. Tập nghe hàm ý và thái độ người nói.', 'alternative'),

  // Stage 4 — N2
  node(4, 'N2', 0, 'center', 'Kanji N2 (~1000 chữ)', 'N2', 'BookOpen', 'vocab', 'Nâng lên ~1000 kanji, đủ để đọc báo. Học kanji trong ngữ cảnh từ ghép thay vì học rời.'),
  node(4, 'N2', 1, 'right', '6000 từ vựng N2', 'N2', 'BookOpen', 'vocab', 'Vốn từ rộng cho chủ đề xã hội, kinh tế, công việc. Ưu tiên từ hay gặp trong đề JLPT và báo chí.'),
  node(4, 'N2', 2, 'center', 'Ngữ pháp N2: mẫu trang trọng & sắc thái', 'N2', 'GraduationCap', 'grammar', 'Các mẫu ngữ pháp N2 mang sắc thái trang trọng/nhấn mạnh và những cặp dễ nhầm. Cần phân biệt sắc thái chính xác.'),
  node(4, 'N2', 3, 'left', 'Dokkai: báo & bài luận', 'N2', 'Newspaper', 'reading', 'Đọc bài báo, bài luận và văn bản dài. Luyện tốc độ đọc và trả lời câu hỏi suy luận.', 'alternative'),
  node(4, 'N2', 4, 'right', 'Choukai: tin tức', 'N2', 'Headphones', 'listening', 'Nghe tin tức và hội thoại dài, tốc độ nhanh. Rèn nghe ý chính khi không kịp bắt từng từ.', 'alternative'),
  node(4, 'N2', 5, 'center', 'Luyện đề JLPT N2 (Moji-Goi / Bunpou / Dokkai / Choukai)', 'N2', 'Bot', 'roleplay', 'Làm đề JLPT N2 theo từng phần, bấm giờ như thật, rồi rà lỗi. Kết hợp Quiz AI và hội thoại AI để lấp lỗ hổng.'),
];

const ROADMAP_SEED: Record<string, NodeSeed[]> = {
  en: EN_SEED,
  ja: JA_SEED,
};
