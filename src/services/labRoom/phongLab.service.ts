/**
 * ============================================================
 * PHÒNG LAB — luyện LAB211 theo mục tiêu LOC, có gia sư AI kèm
 * ============================================================
 *
 * Người học chọn một nhóm bài trong track (54 bài LAB211), tổng LOC cộng dồn
 * lên, rồi lập một "phòng" có mục tiêu LOC. Trong phòng, mỗi lần làm ĐÚNG một
 * bài, với bốn việc AI làm cho bài đó:
 *
 *   1. `gioiThieuBai`    giảng đề trước khi gõ dòng đầu tiên
 *   2. `chat`            kèm trong lúc làm — từng dòng, từng method, từng lớp
 *   3. `chamBaiNop`      nộp .zip project, AI chấm THAY THẦY và hỏi vặn
 *   4. `huongDanReview`  sau khi đạt: dạy cách trình bày với thầy
 *
 * ─── MỌI CÂU AI NÓI ĐỀU ĐỨNG TRÊN `quyTacThay.ts` ───
 * Không có prompt nào ở đây tự chế ra quy tắc. Bộ quy tắc là một hằng số dùng
 * chung, rút từ chính bài giảng đang chạy trên web (Academy LAB211, bài giảng
 * Code Lab 847, PRO192 3.1/N2.1). Đó là điều kiện để lời AI nói và lời thầy
 * dạy không mâu thuẫn — thứ mà một prompt viết vội cho từng tính năng chắc
 * chắn sẽ phá vỡ sau vài lần sửa.
 *
 * ─── VÌ SAO CỔNG RIÊNG + MODEL MẠNH NHẤT ───
 * purpose `lab_room` nằm trong `RAMBO_PURPOSES_CO_DINH` và trỏ
 * `claude-opus-4-8`. Chấm một project Java rồi hỏi vặn đúng kiểu thầy hỏi là
 * việc khó nhất trong cả web tính theo chất lượng đầu ra — và chấm sai ở đây
 * không chỉ tốn tiền, nó dạy sai một người đang ôn thi.
 */
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import {
  llmComplete, checkTokenQuota, isAiAvailable, aiOffReason, circuitReopensInMs,
} from '../interview/llm/index.js';
import { isProEffective } from '../pro.service.js';
import { buildProjectDigest } from '../interview/projectZip.service.js';
import { logger } from '../../utils/logger.js';
import { heThong, NGAN_HANG_VAN_DAP } from './quyTacThay.js';

const LOC_GOAL_MAC_DINH = 750;
const LOC_GOAL_MIN = 50;
const LOC_GOAL_MAX = 20_000;
const MAX_BAI_MOI_PHONG = 54;
const MAX_CAU_HOI = 4_000;
const MAX_LICH_SU = 16;          // lượt hội thoại gửi kèm để nối mạch
const MAX_DIGEST = 60_000;       // ký tự digest của zip đưa vào prompt

// ─── quyền & tình trạng AI ──────────────────────────────────────

async function assertAi(userId: number) {
  if (!(await isProEffective(userId))) {
    throw new ForbiddenError('Phòng Lab dùng model mạnh nhất nên là tính năng Pro.');
  }
  if (!isAiAvailable('codelab')) {
    const ly = aiOffReason('codelab');
    throw new BadRequestError(
      ly === 'circuit'
        ? `AI đang nghỉ sau vài lỗi cổng liên tiếp, khoảng ${Math.ceil(circuitReopensInMs('codelab') / 1000)}s nữa mở lại.`
        : ly === 'static'
          ? 'AI đang tắt trên máy chủ này (FORCE_STATIC_MODE).'
          : 'Máy chủ này chưa cấu hình AI.',
    );
  }
  if (!(await checkTokenQuota(userId))) {
    throw new BadRequestError('Bạn đã dùng hết hạn mức AI của hôm nay.');
  }
}

// ─── LOC ────────────────────────────────────────────────────────

/**
 * Số dòng code của một bài, đọc từ chính dữ liệu bài chứ không đoán.
 *
 * LAB211 nhét LOC vào tiêu đề đúng dạng `... (37 LOC)` — đo thật: 54/54 bài
 * đều có, và 54/54 problemHtml cũng nhắc lại. Tiêu đề trước vì nó ngắn và
 * người học nhìn thấy đúng con số đó trên màn hình chọn bài; problemHtml là
 * đường lùi cho bài mà ai đó đã sửa tiêu đề.
 */
export function locCuaBai(ex: { title?: string | null; problemHtml?: string | null }): number {
  const tuTieuDe = /\((\d{1,4})\s*LOC\)/i.exec(ex.title || '');
  if (tuTieuDe) return Number(tuTieuDe[1]);
  const tuDe = /(\d{1,4})\s*LOC/i.exec(ex.problemHtml || '');
  return tuDe ? Number(tuDe[1]) : 0;
}

// ─── đọc/ghi phòng ──────────────────────────────────────────────

/**
 * Cột đủ để VẼ một dòng trong phòng. Cố ý KHÔNG có `problemHtml`.
 *
 * Một phòng 20 bài mà kéo cả 20 thân đề HTML về chỉ để hiện tên bài thì mỗi lần
 * mở phòng là vài trăm KB không ai đọc. Thân đề chỉ cần đúng hai lúc: lúc CHỐT
 * SỐ LOC (xem `CHON_BAI_LOC`) và lúc dựng ngữ cảnh cho AI (`nganhCanh`).
 */
const CHON_BAI = {
  id: true, slug: true, title: true, difficulty: true, language: true,
  estimatedMinutes: true,
} as const;

/** Thêm thân đề — chỉ dùng lúc chọn bài vào phòng, để `locCuaBai` có đường lùi. */
const CHON_BAI_LOC = { ...CHON_BAI, problemHtml: true } as const;

async function phongCuaToi(userId: number, roomId: number) {
  const room = await prisma.codeLabRoom.findUnique({
    where: { id: roomId },
    include: {
      track: { select: { id: true, slug: true, name: true, color: true } },
      items: {
        orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        include: { exercise: { select: CHON_BAI } },
      },
    },
  });
  if (!room) throw new NotFoundError('Không tìm thấy phòng Lab.');
  // Kiểm quyền Ở ĐÂY, không phải ở route: một service tin caller đã kiểm là
  // một lần refactor nữa sẽ thành ai cũng đọc được phòng của người khác.
  if (room.userId !== userId) throw new ForbiddenError('Đây không phải phòng của bạn.');
  return room;
}

type PhongDayDu = Awaited<ReturnType<typeof phongCuaToi>>;

function tomTat(room: PhongDayDu) {
  const items = room.items.map((it) => ({
    id: it.id,
    exerciseId: it.exerciseId,
    slug: it.exercise.slug,
    title: it.exercise.title,
    difficulty: it.exercise.difficulty,
    estimatedMinutes: it.exercise.estimatedMinutes,
    loc: it.loc,
    status: it.status,
    passedAt: it.passedAt,
    coGioiThieu: it.introJson != null,
    coKetQuaCham: it.reviewJson != null,
    coHuongDanReview: it.guideJson != null,
  }));
  const locDaDat = items.filter((i) => i.status === 'PASSED').reduce((a, b) => a + b.loc, 0);
  const locDaChon = items.reduce((a, b) => a + b.loc, 0);
  return {
    id: room.id,
    name: room.name,
    locGoal: room.locGoal,
    locDaDat,
    locDaChon,
    soBaiDat: items.filter((i) => i.status === 'PASSED').length,
    soBai: items.length,
    activeItemId: room.activeItemId,
    track: room.track,
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    items,
  };
}

export type PhongTomTat = ReturnType<typeof tomTat>;

// ─── 1. tạo / liệt kê / sửa phòng ───────────────────────────────

export async function taoPhong(userId: number, body: {
  trackSlug?: string; trackId?: number;
  exerciseIds?: unknown; name?: string; locGoal?: unknown;
}): Promise<PhongTomTat> {
  const ids = Array.isArray(body.exerciseIds)
    ? [...new Set(body.exerciseIds.map(Number).filter((n) => Number.isInteger(n) && n > 0))]
    : [];
  if (!ids.length) throw new BadRequestError('Hãy chọn ít nhất một bài.');
  if (ids.length > MAX_BAI_MOI_PHONG) throw new BadRequestError(`Một phòng nhận tối đa ${MAX_BAI_MOI_PHONG} bài.`);

  const track = body.trackId
    ? await prisma.codeTrack.findUnique({ where: { id: Number(body.trackId) }, select: { id: true, name: true } })
    : await prisma.codeTrack.findUnique({ where: { slug: String(body.trackSlug || '') }, select: { id: true, name: true } });
  if (!track) throw new NotFoundError('Không tìm thấy track.');

  const baiHopLe = await prisma.codeExercise.findMany({
    where: { id: { in: ids }, trackId: track.id, status: 'PUBLISHED' },
    select: CHON_BAI_LOC,
  });
  if (!baiHopLe.length) throw new BadRequestError('Không có bài nào hợp lệ trong track này.');

  // Giữ đúng thứ tự người dùng đã chọn — họ chọn theo LOC tăng dần, và đảo thứ
  // tự đó là đảo luôn lộ trình họ vừa tự vạch.
  const theoId = new Map(baiHopLe.map((e) => [e.id, e]));
  const theoThuTu = ids.map((id) => theoId.get(id)).filter((e): e is typeof baiHopLe[number] => !!e);

  const goal = Number(body.locGoal);
  const locGoal = Number.isFinite(goal)
    ? Math.min(LOC_GOAL_MAX, Math.max(LOC_GOAL_MIN, Math.round(goal)))
    : LOC_GOAL_MAC_DINH;

  const room = await prisma.codeLabRoom.create({
    data: {
      userId,
      trackId: track.id,
      name: (String(body.name || '').trim() || `Phòng ${track.name}`).slice(0, 200),
      locGoal,
      items: {
        create: theoThuTu.map((e, i) => ({
          exerciseId: e.id,
          loc: locCuaBai(e),
          sortOrder: i,
        })),
      },
    },
    select: { id: true },
  });
  return tomTat(await phongCuaToi(userId, room.id));
}

export async function dsPhong(userId: number) {
  const rooms = await prisma.codeLabRoom.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    include: {
      track: { select: { id: true, slug: true, name: true, color: true } },
      items: { select: { id: true, loc: true, status: true } },
    },
  });
  return rooms.map((r) => ({
    id: r.id,
    name: r.name,
    locGoal: r.locGoal,
    locDaDat: r.items.filter((i) => i.status === 'PASSED').reduce((a, b) => a + b.loc, 0),
    locDaChon: r.items.reduce((a, b) => a + b.loc, 0),
    soBai: r.items.length,
    soBaiDat: r.items.filter((i) => i.status === 'PASSED').length,
    track: r.track,
    updatedAt: r.updatedAt,
  }));
}

export async function layPhong(userId: number, roomId: number): Promise<PhongTomTat> {
  return tomTat(await phongCuaToi(userId, roomId));
}

export async function suaPhong(userId: number, roomId: number, body: { name?: string; locGoal?: unknown }) {
  await phongCuaToi(userId, roomId);
  const data: { name?: string; locGoal?: number } = {};
  if (typeof body.name === 'string' && body.name.trim()) data.name = body.name.trim().slice(0, 200);
  if (body.locGoal != null) {
    const g = Number(body.locGoal);
    if (!Number.isFinite(g)) throw new BadRequestError('Mục tiêu LOC phải là một số.');
    data.locGoal = Math.min(LOC_GOAL_MAX, Math.max(LOC_GOAL_MIN, Math.round(g)));
  }
  if (!Object.keys(data).length) throw new BadRequestError('Không có gì để sửa.');
  await prisma.codeLabRoom.update({ where: { id: roomId }, data });
  return tomTat(await phongCuaToi(userId, roomId));
}

export async function xoaPhong(userId: number, roomId: number) {
  await phongCuaToi(userId, roomId);
  // Gỡ bài đang mở trước: `active_item_id` trỏ vào chính bảng con, và Postgres
  // không cho xoá hàng cha khi khoá ngoại còn trỏ tới.
  await prisma.codeLabRoom.update({ where: { id: roomId }, data: { activeItemId: null } });
  await prisma.codeLabRoom.delete({ where: { id: roomId } });
  return { ok: true };
}

export async function themBai(userId: number, roomId: number, exerciseIds: unknown) {
  const room = await phongCuaToi(userId, roomId);
  const ids = Array.isArray(exerciseIds)
    ? [...new Set(exerciseIds.map(Number).filter((n) => Number.isInteger(n) && n > 0))]
    : [];
  if (!ids.length) throw new BadRequestError('Hãy chọn ít nhất một bài.');
  const daCo = new Set(room.items.map((i) => i.exerciseId));
  const them = await prisma.codeExercise.findMany({
    where: { id: { in: ids.filter((i) => !daCo.has(i)) }, trackId: room.trackId, status: 'PUBLISHED' },
    select: CHON_BAI_LOC,
  });
  if (!them.length) {
    // Im lặng trả về phòng y nguyên là câu trả lời tệ nhất: người dùng vừa tick
    // năm bài, bấm Thêm, và màn hình không đổi gì — họ không biết là đã có sẵn
    // hay là hỏng.
    throw new BadRequestError('Những bài bạn chọn đã có sẵn trong phòng này rồi.');
  }
  if (room.items.length + them.length > MAX_BAI_MOI_PHONG) {
    throw new BadRequestError(`Một phòng nhận tối đa ${MAX_BAI_MOI_PHONG} bài.`);
  }
  let n = room.items.length;
  await prisma.codeLabRoomItem.createMany({
    data: them.map((e) => ({ roomId, exerciseId: e.id, loc: locCuaBai(e), sortOrder: n++ })),
  });
  await prisma.codeLabRoom.update({ where: { id: roomId }, data: { updatedAt: new Date() } });
  return tomTat(await phongCuaToi(userId, roomId));
}

export async function boBai(userId: number, roomId: number, itemId: number) {
  const room = await phongCuaToi(userId, roomId);
  const it = room.items.find((i) => i.id === itemId);
  if (!it) throw new NotFoundError('Bài này không có trong phòng.');
  if (room.activeItemId === itemId) {
    await prisma.codeLabRoom.update({ where: { id: roomId }, data: { activeItemId: null } });
  }
  await prisma.codeLabRoomItem.delete({ where: { id: itemId } });
  return tomTat(await phongCuaToi(userId, roomId));
}

/** Mở một bài trong phòng. Bài PASSED mở lại được — để xem lại kết quả chấm. */
export async function chonBai(userId: number, roomId: number, itemId: number) {
  const room = await phongCuaToi(userId, roomId);
  const it = room.items.find((i) => i.id === itemId);
  if (!it) throw new NotFoundError('Bài này không có trong phòng.');
  await prisma.codeLabRoom.update({ where: { id: roomId }, data: { activeItemId: itemId } });
  if (it.status === 'PENDING') {
    await prisma.codeLabRoomItem.update({ where: { id: itemId }, data: { status: 'IN_PROGRESS' } });
  }
  return tomTat(await phongCuaToi(userId, roomId));
}

// ─── ngữ cảnh đề bài cho AI ─────────────────────────────────────

function chuThuan(html: string | null | undefined, cap = 9000): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h[1-6]|tr|pre|div)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n')
    .trim().slice(0, cap);
}

async function nganhCanh(itemId: number) {
  const it = await prisma.codeLabRoomItem.findUnique({
    where: { id: itemId },
    include: {
      exercise: {
        select: {
          id: true, slug: true, title: true, language: true, difficulty: true,
          problemHtml: true, inputSpec: true, outputSpec: true, constraints: true,
          concepts: true, hintsJson: true,
        },
      },
      room: { select: { id: true, userId: true, locGoal: true } },
    },
  });
  if (!it) throw new NotFoundError('Không tìm thấy bài trong phòng.');
  const ex = it.exercise;
  const phan = [
    `ASSIGNMENT: ${ex.title}`,
    `LANGUAGE: ${ex.language} · DIFFICULTY: ${ex.difficulty} · SIZE: ${it.loc} LOC`,
    '',
    'THE BRIEF (verbatim):',
    chuThuan(ex.problemHtml),
  ];
  if (ex.inputSpec) phan.push('', 'INPUT SPEC:', chuThuan(ex.inputSpec, 1200));
  if (ex.outputSpec) phan.push('', 'OUTPUT SPEC:', chuThuan(ex.outputSpec, 1200));
  if (ex.constraints) phan.push('', 'CONSTRAINTS:', chuThuan(ex.constraints, 1200));
  if (Array.isArray(ex.concepts) && ex.concepts.length) {
    phan.push('', `CONCEPTS: ${(ex.concepts as unknown[]).map(String).join(', ')}`);
  }
  return { it, ex, brief: phan.join('\n') };
}

/** Lấy khối JSON đầu tiên trong câu trả lời, kể cả khi nó bị bọc trong ```json. */
function docJson<T>(raw: string): T | null {
  const text = (raw || '').trim();
  const fenced = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  const body = fenced ? fenced[1]! : text;
  const a = body.indexOf('{');
  const b = body.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(body.slice(a, b + 1)) as T; } catch { return null; }
}

// ─── 2. giảng đề trước khi gõ dòng đầu tiên ─────────────────────

const NHIEM_VU_GIOI_THIEU = `
YOUR TASK NOW: brief this student on ONE assignment before they write a line of code.

Return ONLY JSON, no prose around it:
{
 "tongQuan": "3-6 sentences: what this brief is REALLY asking for, in plain Vietnamese. Name the skill it tests.",
 "yeuCauBatBuoc": ["every requirement the Guidelines state, one per entry, quoting the exact method signature or message string where the sheet gives one"],
 "kienTruc": {
   "tang": [{"goi": "entity", "file": "Contact.java", "viec": "what it holds and what it must NOT do"}],
   "viSao": "2-4 sentences justifying THIS layer set for THIS assignment: the responsibility test first, the file count as the cross-check. If the Guidelines say the methods go 'in startup code', say so and put them in Main."
 },
 "cacBuoc": ["the build order, one feature at a time, each step ending in something runnable"],
 "bayCanTranh": ["traps specific to THIS brief — a lenient date, a locale-sensitive %f, an off-by-one, a message the screen and the Guidelines disagree on"],
 "cauHoiVanDap": ["3-5 questions the examiner will ask about THIS assignment"],
 "locUocTinh": <integer: the LOC the sheet states>
}

Rules for this task:
* Read the brief and report what IS there. Never invent a requirement.
* If the expected screen and the Guidelines disagree, say so explicitly in
  "bayCanTranh" — noticing it earns marks.
* Do NOT write the solution. This is the briefing, not the answer. Name the
  classes and their responsibilities; do not hand over method bodies.
`.trim();

export async function gioiThieuBai(userId: number, roomId: number, itemId: number, lamMoi = false) {
  const room = await phongCuaToi(userId, roomId);
  if (!room.items.some((i) => i.id === itemId)) throw new NotFoundError('Bài này không có trong phòng.');

  const cu = await prisma.codeLabRoomItem.findUnique({ where: { id: itemId }, select: { introJson: true } });
  if (cu?.introJson && !lamMoi) return cu.introJson;

  await assertAi(userId);
  const { brief } = await nganhCanh(itemId);

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    purpose: 'lab_room',
    system: heThong(NHIEM_VU_GIOI_THIEU),
    messages: [{ role: 'user', content: brief }],
    maxTokens: 4_000,
    maxRetries: 1,
    timeoutMs: 180_000,
    userId,
  });

  const out = docJson<Record<string, unknown>>(res.text);
  if (!out?.tongQuan) throw new BadRequestError('AI chưa soạn được phần giới thiệu. Thử lại giúp mình.');
  await prisma.codeLabRoomItem.update({ where: { id: itemId }, data: { introJson: out as object } });
  return out;
}

// ─── 3. gia sư kèm trong lúc làm ────────────────────────────────

const NHIEM_VU_CHAT = `
YOUR TASK NOW: you are sitting next to this student while they build ONE assignment.

Answer whatever they ask about it: what to do next, how to write a class, what a
line means, why a rule exists, how to fix an error, what to name something.

* Write real Java when they ask for code — a whole class, a whole method, or a
  single line — and put a comment on the decision, not on the syntax.
* When you hand over code, immediately say in one sentence what an examiner would
  ask about it, and what the answer is. They must be able to defend every line.
* When they ask "just give me the answer", give it AND make them able to explain
  it. Refusing to help is not teaching; handing over code they cannot defend is
  worse than refusing.
* Stay inside THIS brief. If they ask something the brief does not require, say
  it is not required and why adding it would cost marks here.
* Use Markdown. Java in \`\`\`java fences.
`.trim();

export interface LuotChat { role: 'user' | 'assistant'; content: string }

export async function lichSuChat(userId: number, roomId: number, itemId: number): Promise<LuotChat[]> {
  const room = await phongCuaToi(userId, roomId);
  if (!room.items.some((i) => i.id === itemId)) throw new NotFoundError('Bài này không có trong phòng.');
  const rows = await prisma.codeLabRoomMessage.findMany({
    where: { itemId },
    orderBy: { createdAt: 'asc' },
    select: { role: true, content: true },
  });
  return rows.map((r) => ({ role: r.role === 'assistant' ? 'assistant' : 'user', content: r.content }));
}

export async function chat(userId: number, roomId: number, itemId: number, cauHoi: string) {
  const room = await phongCuaToi(userId, roomId);
  if (!room.items.some((i) => i.id === itemId)) throw new NotFoundError('Bài này không có trong phòng.');
  const hoi = (cauHoi || '').trim();
  if (!hoi) throw new BadRequestError('Bạn chưa nhập câu hỏi.');
  if (hoi.length > MAX_CAU_HOI) throw new BadRequestError('Câu hỏi dài quá, rút gọn giúp mình.');
  await assertAi(userId);

  const { brief } = await nganhCanh(itemId);
  const truoc = await prisma.codeLabRoomMessage.findMany({
    where: { itemId },
    orderBy: { createdAt: 'desc' },
    take: MAX_LICH_SU,
    select: { role: true, content: true },
  });
  const lichSu: LuotChat[] = truoc.reverse().map((r) => ({
    role: r.role === 'assistant' ? 'assistant' : 'user',
    content: r.content,
  }));

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    purpose: 'lab_room',
    system: heThong(NHIEM_VU_CHAT, `THE ASSIGNMENT THIS CONVERSATION IS ABOUT:\n${brief}`),
    messages: [...lichSu, { role: 'user', content: hoi }],
    maxTokens: 6_000,
    maxRetries: 1,
    timeoutMs: 180_000,
    userId,
  });

  const traLoi = (res.text || '').trim();
  if (!traLoi) throw new BadRequestError('AI chưa trả lời được. Thử hỏi lại giúp mình.');
  await prisma.codeLabRoomMessage.createMany({
    data: [
      { roomId, itemId, role: 'user', content: hoi },
      { roomId, itemId, role: 'assistant', content: traLoi },
    ],
  });
  await prisma.codeLabRoom.update({ where: { id: roomId }, data: { updatedAt: new Date() } });
  return { answer: traLoi };
}

export async function xoaChat(userId: number, roomId: number, itemId: number) {
  const room = await phongCuaToi(userId, roomId);
  if (!room.items.some((i) => i.id === itemId)) throw new NotFoundError('Bài này không có trong phòng.');
  await prisma.codeLabRoomMessage.deleteMany({ where: { itemId } });
  return { ok: true };
}

// ─── 4. nộp .zip — AI chấm thay thầy ────────────────────────────

const NHIEM_VU_CHAM = `
YOUR TASK NOW: you are the lecturer at the review desk. The student has just
handed you their NetBeans project for this assignment. Mark it.

Return ONLY JSON:
{
 "dat": true|false,
 "diem": <0-10>,
 "chay": {
   "bienDichDuoc": true|false|null,
   "lyDo": "if it cannot compile, name the file and the reason; null-safe short text",
   "khopManHinh": "khop" | "lech" | "khong-chac",
   "lechChoNao": ["each place the console would differ from the expected screen, with the exact expected text and the exact produced text"]
 },
 "theoQuyTac": [
   {"muc":"the rule, named", "ket":"dat"|"thieu"|"sai", "chiTiet":"what you saw, quoting the code", "file":"src/...", "dong": <int|null>}
 ],
 "thieuSoVoiDe": ["every Guidelines requirement that is missing or wrong: a method not implemented, a signature that differs, a message string that does not match"],
 "hieuBaiKhong": [
   {"hoi":"a question about THEIR OWN code — this for loop, this method, this field", "viSao":"what the question is really testing", "traLoiTot":"the answer a student who understands would give, 2-4 sentences"}
 ],
 "phaiSuaTruocKhiNop": ["ordered, concrete, each one a single change"],
 "diemManh": ["only what is genuinely good; empty array if nothing is"],
 "nhanXet": "4-8 sentences, spoken to the student, direct. Say plainly what is wrong."
}

HOW TO MARK
* Judge against the BRIEF first and the RULES second. A program that ignores a
  Guidelines requirement fails even if the code is beautiful.
* "hieuBaiKhong" must ask about THEIR code, quoting it — "what is the for loop
  in Main.java line 42 for", "why is this field private", "this method has no
  comment saying what it does — what does it do", "what happens if I type abc
  here". Six to ten questions. This is the part that separates someone who wrote
  it from someone who pasted it.
* Check comments: is every non-obvious method explained by a comment that says
  WHY, not what? A method with no comment and a non-obvious job is a finding.
* Check the NetBeans header is gone, the naming, the access modifiers, the
  Validator contract, the locale on every %f, strict dates, @Override, and that
  no bo prints.
* "dat" is true ONLY when ALL of these hold: it compiles; every Guidelines
  requirement is implemented with the stated signature; bad input cannot crash
  it; the console matches the expected screen; and there is no code a student
  could not explain. Anything less is false — do not be kind, be useful.
* You are reading a DIGEST of the uploaded zip, not running it. Where you cannot
  be sure the program runs, say "khong-chac" rather than guessing, and explain
  what you would have to run to be sure.
`.trim();

export interface KetQuaCham {
  dat?: boolean; diem?: number;
  [k: string]: unknown;
}

export async function chamBaiNop(userId: number, roomId: number, itemId: number, zip: Buffer, zipName?: string) {
  const room = await phongCuaToi(userId, roomId);
  const it = room.items.find((i) => i.id === itemId);
  if (!it) throw new NotFoundError('Bài này không có trong phòng.');
  await assertAi(userId);

  const digest = buildProjectDigest(zip, zipName);
  const noiDung = digest.digest.slice(0, MAX_DIGEST);
  const { brief } = await nganhCanh(itemId);

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    purpose: 'lab_room',
    system: heThong(NGAN_HANG_VAN_DAP, NHIEM_VU_CHAM),
    messages: [{ role: 'user', content: `${brief}\n\n=================\nWHAT THEY SUBMITTED\n=================\n${noiDung}` }],
    maxTokens: 10_000,
    maxRetries: 1,
    timeoutMs: 300_000,
    userId,
  });

  const out = docJson<KetQuaCham>(res.text);
  if (!out) throw new BadRequestError('AI chưa chấm được bài này. Thử nộp lại giúp mình.');

  const diem = Number(out.diem);
  // Đạt cần CẢ HAI: AI nói đạt, và điểm không dưới 8. Chỉ tin một mình cờ `dat`
  // thì một lượt rộng tay là bài được đánh dấu qua trong khi vẫn còn thiếu
  // yêu cầu của đề — và người học mang đúng bài đó đi gặp thầy.
  const dat = out.dat === true && Number.isFinite(diem) && diem >= 8;
  const ketQua = { ...out, dat, diem: Number.isFinite(diem) ? diem : null, chamLuc: new Date().toISOString() };

  // Nộp lại một bài ĐÃ ĐẠT rồi trượt thì KHÔNG gỡ dấu đạt, và LOC không bị trừ:
  // cái mốc đó họ đã đạt thật một lần, còn bản nộp mới có thể chỉ là đang thử
  // sửa thêm. Nhận xét mới vẫn được ghi đè nên họ đọc được cái vừa sai.
  await prisma.codeLabRoomItem.update({
    where: { id: itemId },
    data: {
      reviewJson: ketQua as object,
      ...(dat ? { status: 'PASSED' as const, passedAt: it.passedAt ?? new Date() } : {}),
    },
  });
  await prisma.codeLabRoom.update({ where: { id: roomId }, data: { updatedAt: new Date() } });

  logger.info('phong-lab: đã chấm bài nộp', {
    roomId, itemId, userId, dat, diem: ketQua.diem, soFile: digest.stats.filesIncluded,
  });
  return { ketQua, phong: tomTat(await phongCuaToi(userId, roomId)) };
}

/**
 * Đọc lại kết quả chấm đã lưu, không gọi AI.
 *
 * Người học đóng tab rồi mở lại phải thấy nguyên bản nhận xét cũ — chấm lại chỉ
 * để có cùng một nội dung là đốt một lượt Opus cho không.
 */
export async function ketQuaChamCu(userId: number, roomId: number, itemId: number) {
  const room = await phongCuaToi(userId, roomId);
  if (!room.items.some((i) => i.id === itemId)) throw new NotFoundError('Bài này không có trong phòng.');
  const it = await prisma.codeLabRoomItem.findUnique({ where: { id: itemId }, select: { reviewJson: true } });
  return it?.reviewJson ?? null;
}

// ─── 5. sau khi đạt: dạy cách trình bày với thầy ────────────────

const NHIEM_VU_HUONG_DAN = `
YOUR TASK NOW: this student's program has just passed. Teach them to PRESENT it
to their lecturer so that the lecturer thinks: "this one understands their own
code and knows how to walk me through it."

Return ONLY JSON:
{
 "moDau": "the two or three sentences to open with, written out word for word in Vietnamese, naming the assignment and what it does",
 "thuTuTrinhBay": [
   {"buoc":"what to show", "noiGi":"the sentences to say, written out", "moFileNao":"src/... — the file to have open on screen", "viSao":"why this order"}
 ],
 "chiVaoDau": [
   {"khiThayHoi":"the question", "moFileNao":"src/...", "noiGi":"the one-sentence answer"}
 ],
 "cauHoiChacChanBiHoi": [{"hoi":"...", "traLoiNgan":"one or two sentences, in their own code's terms"}],
 "dungLam": ["what NOT to do — reading the code out loud line by line, apologising, saying 'em copy trên mạng', opening a file you cannot explain"],
 "chotHa": "the closing sentence that invites the change-a-requirement question instead of fearing it"
}

* Everything quoted must be sayable out loud in Vietnamese by a nervous student
  in under 15 seconds. Short sentences.
* Ground every step in THEIR code: name the real file, the real method.
* The whole point of the presentation is to demonstrate they can navigate their
  own design. Structure it so each step opens exactly one file and answers one
  question.
`.trim();

export async function huongDanReview(userId: number, roomId: number, itemId: number, lamMoi = false) {
  const room = await phongCuaToi(userId, roomId);
  const it = room.items.find((i) => i.id === itemId);
  if (!it) throw new NotFoundError('Bài này không có trong phòng.');
  if (it.status !== 'PASSED') {
    throw new BadRequestError('Bài này chưa đạt — nộp và qua vòng chấm trước đã.');
  }
  const cu = await prisma.codeLabRoomItem.findUnique({ where: { id: itemId }, select: { guideJson: true, reviewJson: true } });
  if (cu?.guideJson && !lamMoi) return cu.guideJson;

  await assertAi(userId);
  const { brief } = await nganhCanh(itemId);
  const cham = cu?.reviewJson ? `\n\nWHAT THE MARKING FOUND (use it — the weak spots are what the lecturer will probe):\n${JSON.stringify(cu.reviewJson).slice(0, 12_000)}` : '';

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    purpose: 'lab_room',
    system: heThong(NGAN_HANG_VAN_DAP, NHIEM_VU_HUONG_DAN),
    messages: [{ role: 'user', content: `${brief}${cham}` }],
    maxTokens: 6_000,
    maxRetries: 1,
    timeoutMs: 180_000,
    userId,
  });

  const out = docJson<Record<string, unknown>>(res.text);
  if (!out?.moDau) throw new BadRequestError('AI chưa soạn được hướng dẫn. Thử lại giúp mình.');
  await prisma.codeLabRoomItem.update({ where: { id: itemId }, data: { guideJson: out as object } });
  return out;
}
