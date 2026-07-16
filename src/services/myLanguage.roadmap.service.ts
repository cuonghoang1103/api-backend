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

  // Re-read nodes with their level so level-tagged categories can be matched
  // to same-level nodes first (v2 roadmaps tag every vocab node with a level).
  const vocabNodesFull = await prisma.langRoadmapNode.findMany({
    where: { languageId: language.id, linkType: 'vocab' },
    orderBy: [{ stage: 'asc' }, { order: 'asc' }, { id: 'asc' }],
    select: { id: true, linkRef: true, level: true },
  });
  const levelOf = new Map(vocabNodesFull.map((n) => [n.id, n.level]));

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

  // One category per open node (linkRef is a single-value anchor), LEVEL-AWARE:
  // a node tagged N5/A1/HSK1 takes a same-level category first; untagged nodes
  // and leftover categories fall back to order-based pairing. Surplus
  // categories stay unbound and surface under the trailing "Từ vựng khác" unit.
  const remaining = [...freeCats];
  let bound = 0;
  const takeCat = (nodeLevel: string | null | undefined): number | null => {
    let idx = -1;
    if (nodeLevel) idx = remaining.findIndex((c) => c.level === nodeLevel);
    if (idx === -1) idx = remaining.findIndex((c) => !c.level); // untagged next
    if (idx === -1 && !nodeLevel) idx = 0; // untagged node takes anything left
    if (idx === -1) return null;
    return remaining.splice(idx, 1)[0].id;
  };
  for (const node of openNodes) {
    const catId = takeCat(levelOf.get(node.id));
    if (catId == null) continue;
    await prisma.langRoadmapNode.update({ where: { id: node.id }, data: { linkRef: String(catId) } });
    bound++;
  }

  return {
    code: language.code, boundNodes: bound, assignedCategories: bound,
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
  if (!seed) throw new BadRequestError(`Chưa có dữ liệu lộ trình mẫu cho "${code}". Hiện hỗ trợ: en, ja, zh.`);
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

// ── English: A1 → C2 (IELTS 7.5+) — v2, per-skill nodes each level ──────────
const EN_SEED: NodeSeed[] = [
  // Stage 0 — A1 · Khởi động
  node(0, 'A1 · Khởi động', 0, 'center', 'Phát âm & bảng IPA', 'A1', 'Type', 'alphabet', 'Làm quen 44 âm tiếng Anh và bảng phiên âm IPA. Phát âm đúng từ đầu giúp nghe tốt hơn và không phải sửa lỗi về sau.'),
  node(0, 'A1 · Khởi động', 1, 'right', 'Từ vựng A1 · Chào hỏi & con người', 'A1', 'BookOpen', 'vocab', 'Chào hỏi, giới thiệu bản thân, gia đình, nghề nghiệp. Học kèm flashcard và ôn tập ngắt quãng (SRS) để nhớ lâu.'),
  node(0, 'A1 · Khởi động', 2, 'left', 'Từ vựng A1 · Đời sống quanh ta', 'A1', 'BookOpen', 'vocab', 'Số đếm, thời gian, đồ ăn, nhà cửa, đồ vật. 500 từ đầu tiên phủ phần lớn hội thoại hằng ngày.'),
  node(0, 'A1 · Khởi động', 3, 'center', 'Ngữ pháp A1 · Câu cơ bản', 'A1', 'GraduationCap', 'grammar', 'To be, thì hiện tại đơn, mạo từ a/an/the, số nhiều và trật tự câu S-V-O. Bộ khung để nói câu đúng từ ngày đầu.'),
  node(0, 'A1 · Khởi động', 4, 'right', 'Giao tiếp A1 · Mẫu câu sống còn', 'A1', 'MessagesSquare', 'conversation', 'Các cặp hỏi-đáp chào hỏi, mua hàng, hỏi đường đơn giản. Đọc to theo mẫu để quen nhịp điệu.'),
  node(0, 'A1 · Khởi động', 5, 'left', 'Nghe A1 · Hội thoại chậm', 'A1', 'Headphones', 'listening', 'Nghe đoạn ngắn tốc độ chậm, tập bắt âm nối. Kỹ năng nghe cần vào càng sớm càng tốt.'),
  node(0, 'A1 · Khởi động', 6, 'center', 'Luyện tập A1 (XP & vương miện)', 'A1', 'Dumbbell', 'vocab', 'Vào phòng Luyện tập làm bài theo đường học: chọn nghĩa, nghe-chọn, điền từ… Nhận XP, giữ chuỗi ngày.', 'info'),

  // Stage 1 — A2 · Sơ cấp
  node(1, 'A2 · Sơ cấp', 0, 'center', 'Từ vựng A2 · Sinh hoạt & mua sắm', 'A2', 'BookOpen', 'vocab', 'Chủ đề mua sắm, sức khỏe, thời tiết, đi lại. Học theo cụm từ và câu ví dụ.'),
  node(1, 'A2 · Sơ cấp', 1, 'right', 'Từ vựng A2 · Học tập & công việc', 'A2', 'BookOpen', 'vocab', 'Trường lớp, văn phòng, sở thích. Mở rộng vốn từ lên ~1200 từ tích lũy.'),
  node(1, 'A2 · Sơ cấp', 2, 'left', 'Ngữ pháp A2 · Quá khứ & tương lai', 'A2', 'GraduationCap', 'grammar', 'Quá khứ đơn, tương lai will/going to, câu hỏi Wh-, so sánh hơn/nhất, giới từ in/on/at.'),
  node(1, 'A2 · Sơ cấp', 3, 'center', 'Giao tiếp A2 · Tình huống hằng ngày', 'A2', 'MessagesSquare', 'conversation', 'Đặt món, hỏi giá, hẹn gặp, gọi điện đơn giản. Phản xạ theo cặp hỏi-đáp.'),
  node(1, 'A2 · Sơ cấp', 4, 'right', 'Đọc A2 · Đoạn văn ngắn', 'A2', 'Newspaper', 'reading', 'Email, thông báo, mẩu tin ngắn kèm câu hỏi trắc nghiệm. Tập đoán nghĩa từ ngữ cảnh.'),
  node(1, 'A2 · Sơ cấp', 5, 'left', 'Nghe A2 · Hội thoại đời thường', 'A2', 'Headphones', 'listening', 'Hội thoại tốc độ vừa về chủ đề quen thuộc. Nghe ý chính trước, chi tiết sau.'),
  node(1, 'A2 · Sơ cấp', 6, 'center', 'Viết A2 · Câu & đoạn ngắn (AI chấm)', 'A2', 'PenLine', 'writing', 'Viết đoạn 3–5 câu, AI chỉ lỗi và gợi ý bản viết lại. Viết sớm giúp khắc sâu ngữ pháp.', 'alternative'),

  // Stage 2 — B1 · Trung cấp
  node(2, 'B1 · Trung cấp', 0, 'center', 'Từ vựng B1 · Xã hội & cảm xúc', 'B1', 'BookOpen', 'vocab', 'Cảm xúc, tính cách, quan hệ xã hội, tin tức. Bắt đầu học collocations (make/do, strong tea…).'),
  node(2, 'B1 · Trung cấp', 1, 'right', 'Từ vựng B1 · Phrasal verbs', 'B1', 'BookOpen', 'vocab', 'Cụm động từ thông dụng (give up, look after…) — thứ tạo độ tự nhiên cho tiếng Anh của bạn.'),
  node(2, 'B1 · Trung cấp', 2, 'left', 'Ngữ pháp B1 · Hoàn thành & bị động', 'B1', 'GraduationCap', 'grammar', 'Hiện tại hoàn thành, bị động, câu điều kiện loại 1–2, câu gián tiếp. Nhóm ngữ pháp trung tâm của B1.'),
  node(2, 'B1 · Trung cấp', 3, 'center', 'Giao tiếp B1 · Kể chuyện & ý kiến', 'B1', 'MessagesSquare', 'conversation', 'Kể lại trải nghiệm, nêu ý kiến, đồng ý/phản đối lịch sự.'),
  node(2, 'B1 · Trung cấp', 4, 'right', 'Đọc B1 · Bài báo dễ', 'B1', 'Newspaper', 'reading', 'Bài viết ngắn; luyện skimming (ý chính) và scanning (tìm thông tin) — kỹ năng lõi cho IELTS Reading.'),
  node(2, 'B1 · Trung cấp', 5, 'left', 'Hỏi đáp B1 · Phản xạ nhanh', 'B1', 'HelpCircle', 'qna', 'Bộ câu hỏi-trả lời thường gặp để luyện phản xạ trả lời không cần dịch trong đầu.'),
  node(2, 'B1 · Trung cấp', 6, 'center', 'Nhập vai B1 · Hội thoại với AI', 'B1', 'Bot', 'roleplay', 'Nhập vai đặt phòng, phỏng vấn, mua sắm với AI — được sửa lỗi nhẹ nhàng ngay khi nói.', 'alternative'),

  // Stage 3 — B2 · IELTS nền (5.5–6.5)
  node(3, 'B2 · IELTS nền (5.5–6.5)', 0, 'center', 'Từ vựng B2 · Học thuật (word families)', 'B2', 'BookOpen', 'vocab', 'Họ từ học thuật (analyse → analysis → analytical) và cách paraphrase — nâng band Lexical Resource.'),
  node(3, 'B2 · IELTS nền (5.5–6.5)', 1, 'right', 'Từ vựng B2 · Chủ đề IELTS', 'B2', 'BookOpen', 'vocab', 'Môi trường, giáo dục, công nghệ, sức khỏe — các chủ đề IELTS hay gặp nhất.'),
  node(3, 'B2 · IELTS nền (5.5–6.5)', 2, 'left', 'Ngữ pháp B2 · Câu phức & liên kết', 'B2', 'GraduationCap', 'grammar', 'Mệnh đề quan hệ, linking words (however, therefore…), điều kiện loại 3 — nền cho Writing & Speaking 6+.'),
  node(3, 'B2 · IELTS nền (5.5–6.5)', 3, 'center', 'Đọc B2 · Dạng câu hỏi IELTS', 'B2', 'Newspaper', 'reading', 'T/F/NG, Matching Headings, Gap-fill và quản lý 60 phút cho 3 bài đọc.', 'alternative'),
  node(3, 'B2 · IELTS nền (5.5–6.5)', 4, 'right', 'Nghe B2 · IELTS Section 1–4', 'B2', 'Headphones', 'listening', 'Chiến lược 4 phần Listening: dự đoán đáp án, bẫy thường gặp, chính tả số/tên.', 'alternative'),
  node(3, 'B2 · IELTS nền (5.5–6.5)', 5, 'left', 'Viết B2 · Task 1 & cấu trúc essay', 'B2', 'PenLine', 'writing', 'Mô tả biểu đồ (Task 1) và dàn ý 4 đoạn cho Task 2. AI chấm theo tiêu chí band.', 'alternative'),
  node(3, 'B2 · IELTS nền (5.5–6.5)', 6, 'center', 'Nói B2 · Speaking Part 1–3', 'B2', 'Bot', 'roleplay', 'Luyện 3 phần Speaking với AI, tập fluency và mở rộng câu trả lời; dùng chấm phát âm để sửa âm.', 'alternative'),

  // Stage 4 — C1 · IELTS 7.0–7.5
  node(4, 'C1 · IELTS 7.0–7.5', 0, 'center', 'Từ vựng C1 · Paraphrase & idiom', 'C1', 'BookOpen', 'vocab', 'Từ chính xác theo ngữ cảnh, idiom tự nhiên, paraphrase linh hoạt — điều kiện đạt band 7 Lexical.'),
  node(4, 'C1 · IELTS 7.0–7.5', 1, 'right', 'Ngữ pháp C1 · Cấu trúc nâng cao', 'C1', 'GraduationCap', 'grammar', 'Đảo ngữ, mệnh đề rút gọn, cleft sentence. Band 7 cần câu đa dạng và ít lỗi.'),
  node(4, 'C1 · IELTS 7.0–7.5', 2, 'left', 'Đọc C1 · Bài luận & suy luận', 'C1', 'Newspaper', 'reading', 'Văn bản dài, câu hỏi suy luận; đọc nhanh mà vẫn nắm lập luận.', 'alternative'),
  node(4, 'C1 · IELTS 7.0–7.5', 3, 'center', 'Viết C1 · Task 2 band 7 (coherence)', 'C1', 'PenLine', 'writing', 'Mạch lạc, lập luận sâu, ví dụ thuyết phục. AI chấm sát 4 tiêu chí IELTS.', 'alternative'),
  node(4, 'C1 · IELTS 7.0–7.5', 4, 'right', 'Nói C1 · Band 7 (phát âm & mạch lạc)', 'C1', 'Bot', 'roleplay', 'Ngữ điệu, trả lời có chiều sâu; dùng chấm phát âm AI cho tiêu chí Pronunciation.', 'alternative'),
  node(4, 'C1 · IELTS 7.0–7.5', 5, 'left', 'Đề thi thử 4 kỹ năng', 'C1', 'Newspaper', 'reading', 'Full test bấm giờ như thật rồi phân tích lỗi từng kỹ năng — bước cuối trước phòng thi.', 'info'),

  // Stage 5 — C2 · Thành thạo
  node(5, 'C2 · Thành thạo', 0, 'center', 'Từ vựng C2 · Sắc thái & văn phong', 'C2', 'BookOpen', 'vocab', 'Phân biệt sắc thái từ gần nghĩa, register trang trọng/thân mật, từ vựng báo chí-học thuật.'),
  node(5, 'C2 · Thành thạo', 1, 'right', 'Ngữ pháp C2 · Tinh tế & ngoại lệ', 'C2', 'GraduationCap', 'grammar', 'Cấu trúc hiếm, ngoại lệ, văn phong viết chuyên nghiệp. Độ chính xác gần bản ngữ.'),
  node(5, 'C2 · Thành thạo', 2, 'left', 'Đọc C2 · Văn bản chuyên sâu', 'C2', 'Newspaper', 'reading', 'Bài luận dài, báo cáo, văn học. Đọc phản biện: nhận ra giả định và lập luận ngầm.', 'alternative'),
  node(5, 'C2 · Thành thạo', 3, 'center', 'Viết & Nói C2 · Như người bản xứ', 'C2', 'PenLine', 'writing', 'Viết luận phức tạp, thuyết trình, tranh luận. Duy trì bằng cách dùng tiếng Anh mỗi ngày.', 'alternative'),
];

// ── Japanese: Kana → N1 — v2, per-skill nodes each level ─────────────────────
const JA_SEED: NodeSeed[] = [
  // Stage 0 — Kana & nền
  node(0, 'Kana & nền', 0, 'center', 'Hiragana ひらがな', null, 'Type', 'alphabet', 'Trọn bảng Hiragana qua 9 chặng (nhận mặt chữ → viết). Bắt buộc trước mọi thứ khác.'),
  node(0, 'Kana & nền', 1, 'right', 'Katakana カタカナ', null, 'Type', 'alphabet', 'Bảng Katakana cho từ mượn/tên riêng — đọc được thực đơn, biển hiệu, tên nước ngoài.'),
  node(0, 'Kana & nền', 2, 'center', 'Phát âm, trường âm & số đếm', null, 'BookOpen', 'vocab', 'Trường âm, âm ngắt, số đếm và đơn vị đếm cơ bản. Nền để nghe-nói tự nhiên.'),

  // Stage 1 — N5
  node(1, 'N5', 0, 'center', 'Từ vựng N5 · Chào hỏi & con người', 'N5', 'BookOpen', 'vocab', 'Chào hỏi, gia đình, nghề nghiệp, số đếm. Học kèm SRS để không quên.'),
  node(1, 'N5', 1, 'right', 'Từ vựng N5 · Đời sống & trường lớp', 'N5', 'BookOpen', 'vocab', 'Đồ ăn, nhà cửa, trường học, đi lại — ~800 từ N5 chia theo chủ đề.'),
  node(1, 'N5', 2, 'left', 'Kanji N5 (~100 chữ)', 'N5', 'Type', 'alphabet', 'Kanji cơ bản (số, ngày tháng, người, đồ vật) kèm âm on/kun và từ ghép.'),
  node(1, 'N5', 3, 'center', 'Ngữ pháp N5 · Trợ từ & thể ます', 'N5', 'GraduationCap', 'grammar', 'は/が/を/に/へ, thể lịch sự ます/です, tính từ い/な, て-form khởi đầu. Bộ khung câu N5.'),
  node(1, 'N5', 4, 'right', 'Giao tiếp N5 · Mẫu câu sống còn', 'N5', 'MessagesSquare', 'conversation', 'Chào hỏi, mua bán, hỏi đường. Đọc to theo hội thoại để quen ngữ điệu.'),
  node(1, 'N5', 5, 'left', 'Nghe N5 · Hội thoại chậm', 'N5', 'Headphones', 'listening', 'Bắt trợ từ và đuôi câu — chìa khóa hiểu tiếng Nhật nói.'),
  node(1, 'N5', 6, 'center', 'Luyện tập N5 (XP & vương miện)', 'N5', 'Dumbbell', 'vocab', 'Làm bài trong phòng Luyện tập theo đường học N5 — giữ chuỗi ngày, lên cấp.', 'info'),

  // Stage 2 — N4
  node(2, 'N4', 0, 'center', 'Từ vựng N4 · Sinh hoạt & cảm xúc', 'N4', 'BookOpen', 'vocab', 'Công việc, đi lại, cảm xúc — nâng vốn từ tích lũy lên ~1500.'),
  node(2, 'N4', 1, 'right', 'Từ vựng N4 · Động từ ghép & phó từ', 'N4', 'BookOpen', 'vocab', 'Động từ ghép thông dụng và phó từ mức độ — thứ khiến câu N4 tự nhiên hơn.'),
  node(2, 'N4', 2, 'left', 'Kanji N4 (~300 chữ)', 'N4', 'Type', 'alphabet', 'Chú ý chữ nhiều âm đọc; đoán nghĩa qua bộ thủ và từ ghép.'),
  node(2, 'N4', 3, 'center', 'Ngữ pháp N4 · Thể thường & điều kiện', 'N4', 'GraduationCap', 'grammar', 'Thể thường (普通形), khả năng, ý chí, điều kiện と/ば/たら/なら, kính ngữ sơ cấp.'),
  node(2, 'N4', 4, 'right', 'Giao tiếp N4 · Tình huống đời thường', 'N4', 'MessagesSquare', 'conversation', 'Hẹn lịch, xin phép, nhờ vả, từ chối khéo — các khuôn giao tiếp Nhật rất chuộng.'),
  node(2, 'N4', 5, 'left', 'Đọc N4 · Đoạn văn ngắn', 'N4', 'Newspaper', 'reading', 'Email, nhật ký, thông báo kèm câu hỏi. Đọc trôi không dịch từng chữ.'),
  node(2, 'N4', 6, 'center', 'Nghe N4 · Tốc độ gần tự nhiên', 'N4', 'Headphones', 'listening', 'Hội thoại đời thường tốc độ nhanh dần; luyện nghe ý và phản xạ.'),

  // Stage 3 — N3 (cầu nối)
  node(3, 'N3 · Cầu nối', 0, 'center', 'Từ vựng N3 · Xã hội & ý kiến', 'N3', 'BookOpen', 'vocab', 'Từ trừu tượng về xã hội, công việc, quan điểm — chặng quyết định để lên N2.'),
  node(3, 'N3 · Cầu nối', 1, 'right', 'Từ vựng N3 · Cụm từ & quán ngữ', 'N3', 'BookOpen', 'vocab', 'Quán ngữ, cách nói cố định xuất hiện dày trong đề JLPT và hội thoại thật.'),
  node(3, 'N3 · Cầu nối', 2, 'left', 'Kanji N3 (~650 chữ)', 'N3', 'Type', 'alphabet', 'Bước nhảy lớn về lượng — ôn ngắt quãng đều để không rơi chữ cũ.'),
  node(3, 'N3 · Cầu nối', 3, 'center', 'Ngữ pháp N3 · Bị động, sai khiến & kính ngữ', 'N3', 'GraduationCap', 'grammar', '受身, 使役, 敬語 và các mẫu trung cấp — nhóm ngữ pháp bản lề của tiếng Nhật.'),
  node(3, 'N3 · Cầu nối', 4, 'right', 'Hỏi đáp N3 · Phản xạ', 'N3', 'HelpCircle', 'qna', 'Bộ hỏi-đáp tình huống để phản xạ không cần dịch trong đầu.'),
  node(3, 'N3 · Cầu nối', 5, 'left', 'Đọc N3 · Dokkai đoạn vừa', 'N3', 'Newspaper', 'reading', 'Nắm ý và mạch lập luận của đoạn văn dài hơn — chuẩn bị cho phần đọc N2.', 'alternative'),
  node(3, 'N3 · Cầu nối', 6, 'center', 'Nghe N3 · Tốc độ tự nhiên', 'N3', 'Headphones', 'listening', 'Nghe hàm ý và thái độ người nói, không chỉ nghĩa đen.', 'alternative'),

  // Stage 4 — N2
  node(4, 'N2', 0, 'center', 'Từ vựng N2 · Báo chí & công việc', 'N2', 'BookOpen', 'vocab', 'Chủ đề xã hội, kinh tế, công sở — ưu tiên từ hay gặp trong đề và báo chí.'),
  node(4, 'N2', 1, 'right', 'Từ vựng N2 · Ngữ nghĩa gần nhau', 'N2', 'BookOpen', 'vocab', 'Phân biệt từ gần nghĩa — dạng bài Moji-Goi khó nhất của N2.'),
  node(4, 'N2', 2, 'left', 'Kanji N2 (~1000 chữ)', 'N2', 'Type', 'alphabet', 'Đủ để đọc báo. Học trong ngữ cảnh từ ghép thay vì học rời.'),
  node(4, 'N2', 3, 'center', 'Ngữ pháp N2 · Sắc thái trang trọng', 'N2', 'GraduationCap', 'grammar', 'Các mẫu nhấn mạnh/trang trọng và những cặp dễ nhầm — cần phân biệt sắc thái chính xác.'),
  node(4, 'N2', 4, 'right', 'Đọc N2 · Báo & bài luận', 'N2', 'Newspaper', 'reading', 'Tốc độ đọc + câu hỏi suy luận trên văn bản dài.', 'alternative'),
  node(4, 'N2', 5, 'left', 'Nghe N2 · Tin tức', 'N2', 'Headphones', 'listening', 'Tin tức và hội thoại dài tốc độ nhanh — rèn nghe ý chính khi không kịp bắt từng từ.', 'alternative'),
  node(4, 'N2', 6, 'center', 'Luyện đề N2 + nhập vai AI', 'N2', 'Bot', 'roleplay', 'Làm đề theo phần, bấm giờ như thật; kết hợp Quiz AI và hội thoại AI để lấp lỗ hổng.', 'alternative'),

  // Stage 5 — N1
  node(5, 'N1', 0, 'center', 'Từ vựng N1 · Trừu tượng & thành ngữ', 'N1', 'BookOpen', 'vocab', 'Từ trừu tượng, văn viết, thành ngữ 四字熟語. Vốn từ mục tiêu ~10.000.'),
  node(5, 'N1', 1, 'right', 'Kanji N1 (~2000 chữ)', 'N1', 'Type', 'alphabet', 'Phủ toàn bộ Jouyou kanji; trọng tâm là các âm đọc hiếm và chữ đồng âm.'),
  node(5, 'N1', 2, 'left', 'Ngữ pháp N1 · Văn viết & cổ điển', 'N1', 'GraduationCap', 'grammar', 'Mẫu văn viết trang trọng, cách nói văn học/cổ, sắc thái cực tinh tế giữa các mẫu gần nghĩa.'),
  node(5, 'N1', 3, 'center', 'Đọc N1 · Xã luận & nghị luận', 'N1', 'Newspaper', 'reading', 'Xã luận, bài nghị luận dài; câu hỏi bắt ý ngầm của tác giả.', 'alternative'),
  node(5, 'N1', 4, 'right', 'Nghe N1 · Hội thảo & tranh luận', 'N1', 'Headphones', 'listening', 'Bài giảng, tranh luận nhiều người nói — theo kịp cả nội dung lẫn lập trường.', 'alternative'),
  node(5, 'N1', 5, 'left', 'Tổng luyện N1 · Đề + AI', 'N1', 'Bot', 'roleplay', 'Full test bấm giờ + hội thoại AI chủ đề khó. Đích cuối của lộ trình.', 'alternative'),
];

// ── Chinese: Nhập môn → HSK6 — v2 (mới hoàn toàn) ────────────────────────────
const ZH_SEED: NodeSeed[] = [
  // Stage 0 — Nhập môn
  node(0, 'Nhập môn · Pinyin & thanh điệu', 0, 'center', 'Pinyin & 4 thanh điệu', null, 'Type', 'alphabet', 'Hệ phiên âm pinyin và 4 thanh điệu + thanh nhẹ. Sai thanh điệu là sai nghĩa — luyện chuẩn ngay từ đầu.'),
  node(0, 'Nhập môn · Pinyin & thanh điệu', 1, 'right', 'Nét chữ & quy tắc bút thuận', null, 'Type', 'alphabet', 'Các nét cơ bản và thứ tự viết — nền để nhớ và tra chữ Hán.'),
  node(0, 'Nhập môn · Pinyin & thanh điệu', 2, 'center', 'Bộ thủ thường gặp', null, 'BookOpen', 'vocab', '50 bộ thủ phổ biến nhất giúp đoán nghĩa và ghi nhớ chữ Hán có hệ thống.'),

  // Stage 1 — HSK1
  node(1, 'HSK1', 0, 'center', 'Từ vựng HSK1 · Chào hỏi & con người', 'HSK1', 'BookOpen', 'vocab', '150 từ HSK1: chào hỏi, gia đình, số đếm, thời gian. Học kèm flashcard SRS.'),
  node(1, 'HSK1', 1, 'right', 'Từ vựng HSK1 · Đời sống cơ bản', 'HSK1', 'BookOpen', 'vocab', 'Đồ ăn, đồ vật, địa điểm quen thuộc — đủ cho những câu giao tiếp đầu tiên.'),
  node(1, 'HSK1', 2, 'left', 'Ngữ pháp HSK1 · Câu cơ bản', 'HSK1', 'GraduationCap', 'grammar', 'Trật tự S-V-O, câu hỏi 吗/呢, động từ 是/有/在, số + lượng từ cơ bản (个).'),
  node(1, 'HSK1', 3, 'center', 'Giao tiếp HSK1 · Mẫu câu sống còn', 'HSK1', 'MessagesSquare', 'conversation', 'Chào hỏi, tự giới thiệu, hỏi giá, gọi món — phản xạ theo cặp hỏi-đáp.'),
  node(1, 'HSK1', 4, 'right', 'Nghe HSK1 · Chậm & rõ', 'HSK1', 'Headphones', 'listening', 'Nghe phân biệt thanh điệu và từ HSK1 trong câu ngắn.'),
  node(1, 'HSK1', 5, 'center', 'Luyện tập HSK1 (XP & vương miện)', 'HSK1', 'Dumbbell', 'vocab', 'Làm bài theo đường học trong phòng Luyện tập — giữ chuỗi ngày.', 'info'),

  // Stage 2 — HSK2
  node(2, 'HSK2', 0, 'center', 'Từ vựng HSK2 · Sinh hoạt hằng ngày', 'HSK2', 'BookOpen', 'vocab', '+150 từ: mua sắm, thời tiết, sức khỏe, đi lại. Tích lũy 300 từ.'),
  node(2, 'HSK2', 1, 'right', 'Ngữ pháp HSK2 · Trợ từ 了/过/着', 'HSK2', 'GraduationCap', 'grammar', 'Ba trợ từ thể 了/过/着, so sánh 比, câu 是…的 — nhóm ngữ pháp nền quan trọng nhất sơ cấp.'),
  node(2, 'HSK2', 2, 'left', 'Giao tiếp HSK2 · Tình huống phổ biến', 'HSK2', 'MessagesSquare', 'conversation', 'Hỏi đường, mua đồ, đặt lịch, gọi điện đơn giản.'),
  node(2, 'HSK2', 3, 'center', 'Đọc HSK2 · Câu & đoạn ngắn', 'HSK2', 'Newspaper', 'reading', 'Đoạn 3–5 câu kèm câu hỏi — làm quen đọc chữ Hán không pinyin.'),
  node(2, 'HSK2', 4, 'right', 'Nghe HSK2 · Hội thoại ngắn', 'HSK2', 'Headphones', 'listening', 'Đối thoại 2 lượt, chọn đáp án đúng — dạng đề thi HSK2.'),

  // Stage 3 — HSK3
  node(3, 'HSK3', 0, 'center', 'Từ vựng HSK3 · Công việc & học tập', 'HSK3', 'BookOpen', 'vocab', '+300 từ: văn phòng, trường học, sở thích, cảm xúc. Tích lũy 600 từ.'),
  node(3, 'HSK3', 1, 'right', 'Ngữ pháp HSK3 · Bổ ngữ', 'HSK3', 'GraduationCap', 'grammar', 'Bổ ngữ kết quả/phương hướng/khả năng (完/到/起来/得…) — trái tim của ngữ pháp trung cấp.'),
  node(3, 'HSK3', 2, 'left', 'Giao tiếp HSK3 · Diễn đạt ý kiến', 'HSK3', 'MessagesSquare', 'conversation', 'Nêu ý kiến, so sánh lựa chọn, kể lại sự việc theo trình tự.'),
  node(3, 'HSK3', 3, 'center', 'Đọc HSK3 · Đoạn văn thông dụng', 'HSK3', 'Newspaper', 'reading', 'Email công việc, thông báo, mẩu chuyện ngắn kèm câu hỏi.'),
  node(3, 'HSK3', 4, 'right', 'Hỏi đáp HSK3 · Phản xạ', 'HSK3', 'HelpCircle', 'qna', 'Bộ hỏi-đáp tình huống luyện phản xạ trả lời nhanh.'),
  node(3, 'HSK3', 5, 'left', 'Nghe HSK3 · Tốc độ vừa', 'HSK3', 'Headphones', 'listening', 'Hội thoại dài hơn, xuất hiện từ đồng âm — nghe theo ngữ cảnh.', 'alternative'),

  // Stage 4 — HSK4
  node(4, 'HSK4', 0, 'center', 'Từ vựng HSK4 · Xã hội & truyền thông', 'HSK4', 'BookOpen', 'vocab', '+600 từ: xã hội, tin tức, cảm xúc phức tạp. Tích lũy 1200 từ.'),
  node(4, 'HSK4', 1, 'right', 'Từ vựng HSK4 · Từ gần nghĩa', 'HSK4', 'BookOpen', 'vocab', 'Phân biệt cặp từ gần nghĩa (帮助/帮忙, 突然/忽然…) — dạng bài HSK4 hay bẫy.'),
  node(4, 'HSK4', 2, 'left', 'Ngữ pháp HSK4 · Câu phức & 把/被', 'HSK4', 'GraduationCap', 'grammar', 'Câu chữ 把, bị động 被, câu phức nhượng bộ/điều kiện (虽然…但是, 只要…就).'),
  node(4, 'HSK4', 3, 'center', 'Giao tiếp HSK4 · Thảo luận & thương lượng', 'HSK4', 'MessagesSquare', 'conversation', 'Tranh luận nhẹ, thương lượng giá, phàn nàn lịch sự — giao tiếp thực chiến.'),
  node(4, 'HSK4', 4, 'right', 'Đọc HSK4 · Bài báo ngắn', 'HSK4', 'Newspaper', 'reading', 'Sắp xếp câu thành đoạn và đọc hiểu bài ~300 chữ — hai dạng đề HSK4.', 'alternative'),
  node(4, 'HSK4', 5, 'left', 'Nghe HSK4 · Độc thoại ngắn', 'HSK4', 'Headphones', 'listening', 'Đoạn độc thoại 4-5 câu — ghi nhớ chi tiết trong lúc nghe tiếp.', 'alternative'),

  // Stage 5 — HSK5
  node(5, 'HSK5', 0, 'center', 'Từ vựng HSK5 · Học thuật & trừu tượng', 'HSK5', 'BookOpen', 'vocab', '+1300 từ: kinh tế, văn hóa, khoa học. Tích lũy 2500 từ.'),
  node(5, 'HSK5', 1, 'right', 'Ngữ pháp HSK5 · Văn viết & hư từ', 'HSK5', 'GraduationCap', 'grammar', 'Hư từ văn viết (于/以/所…), cấu trúc nhấn mạnh, liên từ học thuật.'),
  node(5, 'HSK5', 2, 'left', 'Đọc HSK5 · Bài dài & tóm ý', 'HSK5', 'Newspaper', 'reading', 'Bài ~500 chữ, chọn tiêu đề, tóm ý đoạn — đọc nhanh có chiến lược.', 'alternative'),
  node(5, 'HSK5', 3, 'center', 'Nghe HSK5 · Phỏng vấn & tường thuật', 'HSK5', 'Headphones', 'listening', 'Phỏng vấn, bản tin tốc độ thật — nghe ý chính và thái độ.', 'alternative'),
  node(5, 'HSK5', 4, 'right', 'Viết HSK5 · Đoạn văn 80 chữ (AI chấm)', 'HSK5', 'PenLine', 'writing', 'Viết đoạn theo từ khóa/tranh — AI chấm ngữ pháp và mạch ý.', 'alternative'),

  // Stage 6 — HSK6
  node(6, 'HSK6', 0, 'center', 'Từ vựng HSK6 · Thành ngữ & văn chương', 'HSK6', 'BookOpen', 'vocab', '+2500 từ và thành ngữ 成语 thông dụng. Tích lũy 5000 từ.'),
  node(6, 'HSK6', 1, 'right', 'Ngữ pháp HSK6 · Sửa câu sai', 'HSK6', 'GraduationCap', 'grammar', 'Nhận diện câu sai (dạng đề đặc trưng HSK6) — hiểu sâu cấu trúc thay vì thuộc mẫu.'),
  node(6, 'HSK6', 2, 'left', 'Đọc HSK6 · Văn bản học thuật', 'HSK6', 'Newspaper', 'reading', 'Bài ~1000 chữ, xã luận và khoa học thường thức; đọc lướt chiến lược.', 'alternative'),
  node(6, 'HSK6', 3, 'center', 'Nghe HSK6 · Bài giảng dài', 'HSK6', 'Headphones', 'listening', 'Bài giảng/tọa đàm dài, ghi chú trong lúc nghe.', 'alternative'),
  node(6, 'HSK6', 4, 'right', 'Tổng luyện HSK6 · Tóm tắt 1000→400', 'HSK6', 'Bot', 'roleplay', 'Dạng viết tóm tắt đặc trưng HSK6 + hội thoại AI chủ đề khó. Đích cuối lộ trình.', 'alternative'),
];

const ROADMAP_SEED: Record<string, NodeSeed[]> = {
  en: EN_SEED,
  ja: JA_SEED,
  zh: ZH_SEED,
};
