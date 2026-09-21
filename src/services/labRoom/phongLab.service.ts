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
import { locCuaBai, khungChoPrompt } from './khungDuAn.js';
import { CHECKLIST_THAY, PHIEN_BAN_LUAT, type MucChecklist } from './checklistThay.js';
import { layTepJava, soatDuAn, tomTatChoPrompt, type BangChung, type KetQuaMay } from './soatJava.js';
import { giangDeConHan, laLuatMoi, vanTayMau } from './banLuu.js';

const LOC_GOAL_MAC_DINH = 750;
const LOC_GOAL_MIN = 50;
const LOC_GOAL_MAX = 20_000;
const MAX_BAI_MOI_PHONG = 54;
const MAX_CAU_HOI = 4_000;
const MAX_LICH_SU = 16;          // lượt hội thoại gửi kèm để nối mạch
const MAX_DIGEST = 60_000;       // ký tự digest của zip đưa vào prompt
const MAX_MAU_THAM_CHIEU = 24_000; // trần lời giải mẫu gửi kèm khi CHẤM

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
 * `locCuaBai` nay sống ở `khungDuAn.ts` vì Code Lab cũng cần nó (prompt giảng
 * bài phải biết bài to hay nhỏ). Re-export để `locCuaBai.test.ts` và mọi lời
 * gọi cũ trong file này không phải đổi — một phép đọc, một chỗ định nghĩa.
 */
export { locCuaBai };

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
          concepts: true, hintsJson: true, solutionCodeJson: true,
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
  // Lời giải mẫu ĐÃ VERIFY của đúng đề này (chạy thật, khớp output, cả en_US
  // lẫn vi_VN). Khi CHẤM nó là thước đo cấu trúc/tên/định dạng.
  //
  // 21/09/2026 người học (chủ trang) yêu cầu trợ giảng và giảng đề DẠY THEO
  // chính bộ source này — họ gõ lại đúng thiết kế đó để thầy review, nên lời
  // AI và source phải là một. Chốt an toàn: chỉ đưa vào khi source QUA bộ soát
  // máy 25 mục (không mục nào "trượt"). Bộ lời giải cũ viết trước tờ checklist
  // (31/54 bài thiếu repository) thì KHÔNG được dạy lại — `mauDeDay` = null.
  let mauThamChieu: string | null = null;
  let mauDeDay: string | null = null;
  const sol = ex.solutionCodeJson;
  if (Array.isArray(sol) && sol.length) {
    const hopLe = (sol as Array<Record<string, unknown>>)
      .filter((f) => typeof f?.name === 'string' && typeof f?.code === 'string');
    const tep = hopLe.map((f) => `--- ${String(f.name)} ---\n${String(f.code)}`);
    if (tep.length) mauThamChieu = tep.join('\n\n').slice(0, MAX_MAU_THAM_CHIEU);
    const tepJava = hopLe
      .filter((f) => /\.java$/i.test(String(f.name)))
      .map((f) => ({ duong: String(f.name), noiDung: String(f.code) }));
    if (mauThamChieu && tepJava.length) {
      const soat = soatDuAn(tepJava);
      const sach = Object.values(soat.theoMuc).every((m) => m.ket !== 'truot');
      if (sach) mauDeDay = mauThamChieu;
    }
  }
  // Khung dự án: TÊN gói + TÊN lớp của lời giải đã verify, không có thân code.
  // Khác hẳn `mauThamChieu` ở trên — cái này KHÔNG phải đáp án, nó là thứ thầy
  // bắt buộc phải có, nên giảng đề và trợ giảng đều được biết. Chính sách chấm
  // của trường cấm "chỉ cho họ cách mình đã làm", không cấm chỉ đúng tầng.
  const khung = khungChoPrompt(ex);
  return { it, ex, brief: phan.join('\n'), mauThamChieu, mauDeDay, khung };
}

/**
 * Khối "source chuẩn để dạy" cho giảng đề / trợ giảng. Có source sạch thì AI
 * dạy theo đúng nó; chưa có thì nói thẳng để AI dựng từ luật, không bịa khác.
 */
function khoiSourceChuan(mauDeDay: string | null, cho: 'giang' | 'tro'): string {
  if (!mauDeDay) {
    return 'REFERENCE SOURCE: none that passes the paper check sheet yet. Build every '
      + 'answer from the rules and the check sheet above; do not claim a reference exists.';
  }
  const cach = cho === 'giang'
    ? 'Your briefing must describe EXACTLY this design: the same packages, the same class '
      + 'and method names, the same build order. Do not paste its method bodies into the '
      + 'briefing — name the classes and what each does; the tutor explains the code on request.'
    : 'Teach FROM this source. When the student asks how to write a class, a method or a '
      + 'line, show the matching part of THIS source and explain it line by line: what it '
      + 'does, why it sits in that layer, which check-sheet item it satisfies, and the one '
      + 'question the lecturer will ask about it with the answer. Never propose a different '
      + 'design. The student must be able to explain every line they type.';
  return [
    '=================================================================',
    'THE STUDENT\'S REFERENCE SOURCE FOR THIS ASSIGNMENT (verified: runs, matches the',
    'brief\'s screen, passes the 25-item paper check sheet). The student will type their',
    'own copy of this design for the lecturer\'s review.',
    '=================================================================',
    cach,
    '',
    mauDeDay,
  ].join('\n');
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
   "tang": [{"goi": "model", "file": "Contact.java", "viec": "what it holds and what it must NOT do"}],
   "viSao": "2-4 sentences: what each package of Guide.xlsx holds IN THIS assignment, and which class carries the brief's named methods. The package set is fixed; what varies is what goes in each one."
 },
 "soDo": "a mermaid diagram of THIS program's flow, as plain text starting with 'flowchart LR' or 'flowchart TD'. One node per class or per stage, arrows for who calls whom and where the data goes. Keep node labels short and ASCII. null if a diagram would add nothing.",
 "dienTien": {
   "co": true|false,
   "viDu": "the concrete starting data, e.g. an array [5,1,4,2]",
   "buoc": [{"vong": "pass 1", "trangThai": "[1,4,2,5]", "giaiThich": "one line: what moved and why"}]
 },
 "cacBuoc": ["the build order, one feature at a time, each step ending in something runnable"],
 "boTest": [
   {"go": "exactly what the marker types, newline-separated", "cho": "exactly what the console must show back, or the property it must satisfy when part of the output is random", "viSao": "which requirement this case proves"}
 ],
 "khuonMau": [
   {"ten": "the named form, e.g. Validator.getInt loop / try-with-resources / menu loop", "vietSao": "the shape in 2-4 lines of pseudo-Java", "khiNao": "when this brief needs it"}
 ],
 "bayCanTranh": ["traps specific to THIS brief — a lenient date, a locale-sensitive %f, an off-by-one, a message the screen and the Guidelines disagree on"],
 "cauHoiVanDap": ["3-5 questions the examiner will ask about THIS assignment"],
 "checklistChuY": [{"stt": "1.5", "viSao": "one sentence: how THIS brief trips this item of the lecturer's paper check sheet, naming the concrete class/field/method (e.g. the array must be named numberArray)"}],
 "locUocTinh": <integer: the LOC the sheet states>
}

Rules for this task:
* Read the brief and report what IS there. Never invent a requirement.
* If the expected screen and the Guidelines disagree, say so explicitly in
  "bayCanTranh" — noticing it earns marks.
* Do NOT write the solution. This is the briefing, not the answer. Name the
  classes and their responsibilities; do not hand over method bodies.
* LAYERS: list the packages this assignment uses, and say what goes in each.
  The set does NOT shrink because the assignment is small — see the rules
  above, and the paper check sheet at the very top: repository/ is ALWAYS there
  (it holds this program's data — for an algorithm, the array or numbers), the
  view receives a ResponseDTO through a setter and display() takes no
  parameters, main does all input/validation/file reading and calls the
  controller once per menu case. An algorithm the student must write by hand
  goes in a service class as a private method (J1.S.P0001 -> repository/ holds
  the array, service/SortService sorts it), never in Main. Never suggest
  dropping the controller or the repository to "avoid an empty wrapper".
* "checklistChuY": 5-8 items of the paper check sheet THIS brief is most likely
  to fail, each tied to a concrete name or place in this assignment (1.5 for
  the collection/array names it needs, 3.3 for its range check, 2.6 for its
  input loop, 1.1 for where its data and algorithm go...). Use the item numbers
  exactly as on the sheet.
* "dienTien" is for briefs whose heart is an ALGORITHM (a sort, a search, a
  conversion, a matrix walk). Trace it on a SMALL concrete example, one row per
  pass, showing the array or the state after that pass. This is the single most
  useful thing a briefing can contain for such a brief. Set "co": false and an
  empty "buoc" for briefs that are menus and CRUD.
* "boTest" is the marker's own keystrokes. Give 4-7 cases and ALWAYS include:
  the happy path; a non-numeric input; a negative or out-of-range input; and the
  boundary the brief implies (0 items, 1 item, already-sorted). When part of the
  output is random, state the PROPERTY instead of fixed text — "10 integers in
  [0,n), then the same 10 in non-decreasing order" — never invent exact numbers.
* "khuonMau" is the reusable shape the lecturer expects to see, not this brief's
  answer: the input-helper loop in main + the utils/Validation contract (it
  answers or throws, never reads or prints), the controller's
  setResponseDTO + display() hand-off, the menu loop, the Comparator, strict
  date parsing. Only the ones THIS brief actually needs, and every shape you
  show must itself pass the check sheet (declarations at the top of the block,
  blank lines, parentheses, suffixed names).
`.trim();

export async function gioiThieuBai(userId: number, roomId: number, itemId: number, lamMoi = false) {
  const room = await phongCuaToi(userId, roomId);
  if (!room.items.some((i) => i.id === itemId)) throw new NotFoundError('Bài này không có trong phòng.');

  const cu = await prisma.codeLabRoomItem.findUnique({ where: { id: itemId }, select: { introJson: true } });
  // Bài giảng soạn theo luật CŨ thì soạn lại: 21/09/2026 một bài giảng lưu từ
  // trước vẫn dạy P0001 "không cần controller hay bo" dù prompt đã sửa từ lâu —
  // vì bản đã lưu không bao giờ tự làm mới. Cùng lý do, bài giảng soạn theo một
  // source chuẩn đã được THAY (hoặc khi bài chưa có source chuẩn) cũng soạn lại.
  if (cu?.introJson && !lamMoi) {
    const { mauDeDay } = await nganhCanh(itemId);
    if (giangDeConHan(cu.introJson, mauDeDay)) return cu.introJson;
    const moi = await thuSoanLai(() => soanGioiThieu(userId, itemId));
    return moi ?? danhDauCu(cu.introJson);
  }
  return soanGioiThieu(userId, itemId);
}

/** Trả lại bản cũ nhưng gắn cờ để giao diện nói rõ nó soạn theo luật cũ. */
function danhDauCu(json: unknown): unknown {
  return json && typeof json === 'object' ? { ...(json as Record<string, unknown>), _cuLuat: true } : json;
}

/**
 * Soạn lại một bản đã cũ luật. Hỏng (hết hạn mức, AI đang nghỉ) thì trả null để
 * nơi gọi đưa bản cũ ra kèm cờ — người học vẫn đọc được, và biết nó đã cũ,
 * thay vì nhận một trang lỗi cho thứ họ từng xem được.
 */
async function thuSoanLai<T>(soan: () => Promise<T>): Promise<T | null> {
  try {
    return await soan();
  } catch (e) {
    logger.warn('phong-lab: không soạn lại được bản cũ luật', { loi: (e as Error)?.message });
    return null;
  }
}

async function soanGioiThieu(userId: number, itemId: number) {
  await assertAi(userId);
  const { brief, khung, mauDeDay } = await nganhCanh(itemId);

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    purpose: 'lab_room',
    // `khung` = cây gói/lớp THẬT của bài này. Không có nó, AI phải đoán bố cục
    // và mỗi lượt sinh ra một bố cục khác — người học đọc hai bài thì thấy hai
    // kiến trúc, không biết tin cái nào. Có source chuẩn thì giảng theo đúng nó.
    system: heThong(NHIEM_VU_GIOI_THIEU, khung, khoiSourceChuan(mauDeDay, 'giang')),
    messages: [{ role: 'user', content: brief }],
    // Bài giảng nay có thêm sơ đồ, bảng diễn tiến, bộ test và khuôn mẫu —
    // 4k token cắt ngang JSON là hỏng cả lượt, không phải hỏng một mục.
    maxTokens: 9_000,
    maxRetries: 1,
    timeoutMs: 180_000,
    userId,
  });

  const out = docJson<Record<string, unknown>>(res.text);
  if (!out?.tongQuan) throw new BadRequestError('AI chưa soạn được phần giới thiệu. Thử lại giúp mình.');
  const luu = { ...out, _luat: PHIEN_BAN_LUAT, _mau: vanTayMau(mauDeDay) };
  await prisma.codeLabRoomItem.update({ where: { id: itemId }, data: { introJson: luu as object } });
  return luu;
}

// ─── 3. gia sư kèm trong lúc làm ────────────────────────────────

const NHIEM_VU_CHAT = `
YOUR TASK NOW: you are sitting next to this student while they build ONE assignment.

Answer whatever they ask about it: what to do next, how to write a class, what a
line means, why a rule exists, how to fix an error, what to name something.

* ALWAYS LABEL YOUR FENCES. Write triple-backtick java for code and
  triple-backtick text for a file tree, a console transcript or an expected
  screen. An unlabelled fence is rendered as INLINE code by the reader and
  every newline collapses into a space — measured for real: a five-line file
  tree came out as one run-on paragraph. For a course marked by diffing the
  console character by character, that is the worst thing to mangle.
* Write real Java when they ask for code — a whole class, a whole method, or a
  single line — and put a comment on the decision, not on the syntax.
* When you hand over code, immediately say in one sentence what an examiner would
  ask about it, and what the answer is. They must be able to defend every line.
* When they ask "just give me the answer", give it AND make them able to explain
  it. Refusing to help is not teaching; handing over code they cannot defend is
  worse than refusing.
* Stay inside THIS brief. If they ask something the brief does not require, say
  it is not required and why adding it would cost marks here.
* Every line of Java you hand over must ALREADY pass the lecturer's 25-item
  paper check sheet (top of this prompt): repository/ present, the view fed a
  ResponseDTO through a setter with a parameterless display(), names with the
  List/Set/Map/Array suffix, "Id" not "ID", locals declared and initialised at
  the top of each block, a blank line before every comment that follows code,
  parentheses around each comparison next to && / ||, no String +=. When the
  student's own code breaks an item, name it by its number ("mục 2.8") so they
  can tick it on their sheet.
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

  const { brief, khung, mauDeDay } = await nganhCanh(itemId);
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
    // Trợ giảng phải trả lời "cái này viết ở đâu" bằng ĐÚNG gói của bài này,
    // nên `khung` đi kèm đề. Thiếu nó thì câu trả lời hay gặp nhất — "để trong
    // class Manager" — là câu làm người học bị trả bài.
    system: heThong(NHIEM_VU_CHAT, khung, `THE ASSIGNMENT THIS CONVERSATION IS ABOUT:\n${brief}`,
      khoiSourceChuan(mauDeDay, 'tro')),
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

export const NHIEM_VU_CHAM = `
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
 "checklist": [
   {"stt":"1.1", "ket":"dat"|"truot"|"ruiRo", "chiTiet":"what you saw in THEIR code for this item of the paper check sheet, quoting it; for truot/ruiRo, the one concrete fix", "file":"src/... or null", "dong": <int|null>}
 ],
 "luongChay": [
   {"tang":"main"|"controller"|"service"|"repository"|"model"|"view"|"utils", "buoc":"one step of THEIR program's flow for its main menu case, naming the real Class.method and what data passes (RequestDTO / ResponseDTO)"}
 ],
 "danhGiaThietKe": "4-8 sentences: do the layers follow the sheet (who reads input, who holds the data, who prints, how many times the view renders per case); SOLID S; which design pattern is really in their code and whether they could defend it",
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
* "checklist" is the lecturer's paper check sheet: EXACTLY 25 entries, one per
  item, in the sheet's order 1.1, 1.2 ... 1.6, 2.1 ... 2.11, 3.1 ... 3.8. The
  MACHINE CHECK block in the submission lists what was measured line by line:
  every item it marks "truot" is a FACT — report it as "truot", cite one of its
  file:line examples and give the fix. Items the machine cannot see well are
  yours to judge from the code: 1.1 (is each layer doing only its job), 1.3
  (class names are nouns, SRP), 1.4 (verbs, one job per method), 1.6 (does each
  comment say what the method/block does), 3.1, 3.5 (case sensitivity chosen on
  purpose). "ruiRo" = passes a lenient reading, fails a strict one.
* "luongChay" walks ONE real menu case of THEIR program layer by layer, 5-10
  steps, so the student can check they can narrate their own flow the way the
  lecturer asks ("luồng chạy thế nào?").
* "hieuBaiKhong" must ask about THEIR code, quoting it — "what is the for loop
  in Main.java line 42 for", "why is this field private", "this method has no
  comment saying what it does — what does it do", "what happens if I type abc
  here". Six to ten questions. This is the part that separates someone who wrote
  it from someone who pasted it.
* Check comments: is every non-obvious method explained by a comment that says
  WHY, not what? A method with no comment and a non-obvious job is a finding.
* Check the NetBeans header is gone, the naming, the access modifiers, the
  Validation contract, the locale on every %f, strict dates, @Override, that
  nothing outside view/ and main/ prints, and that the Scanner exists only in
  main() as a local variable.
* "dat" is true ONLY when ALL of these hold: it compiles; every Guidelines
  requirement is implemented with the stated signature; bad input cannot crash
  it; the console matches the expected screen; EVERY checklist item is "dat" or
  "ruiRo" (one "truot" = the lecturer would not even start the review); and
  there is no code a student could not explain. Anything less is false — do not
  be kind, be useful.
* You are reading a DIGEST of the uploaded zip, not running it. Where you cannot
  be sure the program runs, say "khong-chac" rather than guessing, and explain
  what you would have to run to be sure.
* If the submission block says the digest was TRUNCATED, "dat" MUST be false and
  you must say so first in "nhanXet". You have not seen the whole project; a
  pass on a project you only half read is the worst thing this desk can do.
* When a REFERENCE SOLUTION is supplied it is a VERIFIED, marker-passing answer
  to this exact brief. Use it as the yardstick for structure, class and method
  names, layer placement and output formatting — a genuine difference from it is
  a finding worth raising. It is NOT the only correct answer: a different but
  correct design that meets every Guidelines requirement still passes, so do not
  mark someone down merely for not matching it.
  ⛔ NEVER reproduce, quote or paraphrase the reference solution's code in your
  output. The student must not receive the answer. Point at THEIR line and say
  what is wrong with it; never show them the line to copy.
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
  // `buildProjectDigest` đã có cờ `truncated` của riêng nó, và ở đây còn một
  // nhát cắt thứ hai. Bản đầu tiên `slice()` mù rồi vứt cả hai — grader chấm
  // nửa project mà tưởng đủ, và trả về "đạt". Nay cả hai đều được KHAI BÁO cho
  // model, kèm luật: cắt thì không được cho đạt.
  const biCat = digest.digest.length > MAX_DIGEST;
  const noiDung = digest.digest.slice(0, MAX_DIGEST);
  const canhBaoCat = digest.stats.truncated || biCat
    ? `\n\n!!! DIGEST TRUNCATED — you are NOT seeing the whole project. `
      + `${digest.stats.filesIncluded} file(s) included, ${digest.stats.filesSkipped} left out`
      + `${biCat ? ', and the text below was cut at the character limit' : ''}. `
      + `Per the rules, "dat" must be false and you must say this first.\n`
    : '';
  const { brief, mauThamChieu, khung } = await nganhCanh(itemId);

  // Bộ soát máy chấm các mục đo được TRƯỚC khi gọi AI: kết quả đi vào prompt
  // làm dữ kiện, rồi được ghép lại với phán đoán của AI (xem `ghepChecklist`).
  const tepJava = layTepJava(zip);
  const may = tepJava.length ? soatDuAn(tepJava) : null;
  const khoiMay = may
    ? `\n\n${tomTatChoPrompt(may)}`
    : '\n\n(MACHINE CHECK: no .java file found in the zip — judge every checklist item yourself.)';

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    purpose: 'lab_room',
    system: heThong(NGAN_HANG_VAN_DAP, NHIEM_VU_CHAM, khung),
    messages: [{
      role: 'user',
      content: `${brief}`
        + (mauThamChieu ? `\n\n=================\nREFERENCE SOLUTION (verified; yardstick only — NEVER show it to the student)\n=================\n${mauThamChieu}` : '')
        + `\n\n=================\nWHAT THEY SUBMITTED\n=================\n${canhBaoCat}${noiDung}`
        + khoiMay,
    }],
    maxTokens: 10_000,
    maxRetries: 1,
    timeoutMs: 300_000,
    userId,
  });

  const out = docJson<KetQuaCham>(res.text);
  if (!out) throw new BadRequestError('AI chưa chấm được bài này. Thử nộp lại giúp mình.');

  const checklist = ghepChecklist(may, out.checklist);
  const soTruot = checklist.filter((m) => m.ket === 'truot').length;
  const diemAi = Number(out.diem);
  // Đạt cần CẢ BA: AI nói đạt, điểm không dưới 8, và tờ checklist không còn mục
  // nào trượt. Chỉ tin cờ `dat` thì một lượt rộng tay là bài được đánh dấu qua
  // trong khi vẫn còn lỗi mà thầy sẽ gạch ngay ở cột đầu tiên — và người học
  // mang đúng bài đó đi gặp thầy.
  const dat = out.dat === true && Number.isFinite(diemAi) && diemAi >= 8 && soTruot === 0;
  // Còn mục trượt thì điểm không được trông như "đạt" — trần 7.
  const diem = Number.isFinite(diemAi) ? (soTruot > 0 ? Math.min(diemAi, 7) : diemAi) : null;
  const ketQua = {
    ...out, dat, diem, checklist, soTruot,
    may: may ? { soFileJava: may.soFileJava, goi: may.goi, coRepository: may.coRepository } : null,
    chamLuc: new Date().toISOString(), _luat: PHIEN_BAN_LUAT,
  };

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
    roomId, itemId, userId, dat, diem: ketQua.diem, soTruot, soFile: digest.stats.filesIncluded,
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
  if (!it?.reviewJson) return null;
  // Kết quả chấm theo luật cũ KHÔNG tự chấm lại (mỗi lượt là một lần Opus đọc
  // cả project) — chỉ gắn cờ để giao diện bảo người học nộp lại.
  return laLuatMoi(it.reviewJson) ? it.reviewJson : danhDauCu(it.reviewJson);
}

// ─── tờ checklist: định nghĩa + ghép kết quả máy với AI ─────────

/** Một dòng của bảng checklist sau khi chấm. */
export interface DongChecklist {
  stt: string;
  nhom: MucChecklist['nhom'];
  ngan: string;
  ket: 'dat' | 'truot' | 'ruiRo';
  /** mức máy đo được — null khi máy không chấm mục này */
  may: 'dat' | 'truot' | 'ruiRo' | null;
  /** mức AI phán — null khi AI bỏ trống mục này */
  ai: 'dat' | 'truot' | 'ruiRo' | null;
  chiTiet: string;
  file: string | null;
  dong: number | null;
  bangChung: BangChung[];
}

const THU_TU_KET = { dat: 0, ruiRo: 1, truot: 2 } as const;

function ketHopLe(x: unknown): 'dat' | 'truot' | 'ruiRo' | null {
  const k = String(x ?? '').trim();
  if (k === 'dat' || k === 'truot' || k === 'ruiRo') return k;
  if (/^(thieu|sai|fail|truot)/i.test(k)) return 'truot';
  if (/^rui/i.test(k)) return 'ruiRo';
  return null;
}

/**
 * Ghép bộ soát máy với phán đoán của AI thành đúng 25 dòng, theo thứ tự tờ giấy.
 *
 * Luật ghép:
 *   • mục máy đo được (`cham: 'may'`): máy là sự thật — AI chỉ được nâng lên
 *     "rủi ro", không được tự kết "trượt" (model đếm dòng trống thì hay bịa);
 *   • mục cần hiểu nghĩa (`ai` / `ca-hai`): lấy mức NẶNG HƠN của hai bên —
 *     máy thấy import sai tầng, AI thấy controller đang làm việc của service;
 *   • AI bỏ trống một mục: giữ kết quả máy; cả hai cùng trống: "rủi ro" kèm
 *     lời nhắc tự soát — không bao giờ tự cho "đạt" một mục chưa ai nhìn.
 */
export function ghepChecklist(may: KetQuaMay | null, tuAi: unknown): DongChecklist[] {
  const dsAi = Array.isArray(tuAi) ? (tuAi as Array<Record<string, unknown>>) : [];
  return CHECKLIST_THAY.map((muc) => {
    const a = dsAi.find((x) => String(x?.stt ?? '').trim() === muc.stt);
    const ketAi = ketHopLe(a?.ket);
    const mayMuc = may?.theoMuc[muc.stt] ?? null;
    const ketMay = mayMuc?.ket ?? null;
    let ket: DongChecklist['ket'];
    if (muc.cham === 'may' && ketMay) {
      const aiNangLen = ketAi && ketAi !== 'dat' ? 'ruiRo' : 'dat';
      ket = THU_TU_KET[ketMay] >= THU_TU_KET[aiNangLen] ? ketMay : aiNangLen;
    } else if (ketMay && ketAi) {
      ket = THU_TU_KET[ketMay] >= THU_TU_KET[ketAi] ? ketMay : ketAi;
    } else {
      ket = ketMay ?? ketAi ?? 'ruiRo';
    }
    const chiTiet = typeof a?.chiTiet === 'string' && a.chiTiet.trim()
      ? a.chiTiet.trim()
      : (mayMuc?.bangChung[0]?.ghiChu ?? (ketMay || ketAi ? '' : 'Chưa chấm được mục này — tự soát theo tờ giấy.'));
    const dongAi = Number(a?.dong);
    return {
      stt: muc.stt,
      nhom: muc.nhom,
      ngan: muc.ngan,
      ket,
      may: ketMay,
      ai: ketAi,
      chiTiet,
      file: typeof a?.file === 'string' && a.file.trim() ? a.file.trim() : (mayMuc?.bangChung[0]?.file ?? null),
      dong: Number.isFinite(dongAi) && dongAi > 0 ? dongAi : (mayMuc?.bangChung[0]?.dong ?? null),
      bangChung: (mayMuc?.bangChung ?? []).slice(0, 12),
    };
  });
}

/** Định nghĩa 25 mục cho bảng bên phải Phòng Lab — tĩnh, không gọi AI. */
export function layChecklistThay() {
  return { phienBan: PHIEN_BAN_LUAT, muc: CHECKLIST_THAY };
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
* The lecturer reviews with his paper check sheet in hand. Include in
  "chiVaoDau" one entry each for item 1.1 (which file shows the layers and the
  single render per case), 1.5 (a suffixed collection/array name) and 3.3 (a
  parenthesised condition), pointing at THEIR file.
`.trim();

export async function huongDanReview(userId: number, roomId: number, itemId: number, lamMoi = false) {
  const room = await phongCuaToi(userId, roomId);
  const it = room.items.find((i) => i.id === itemId);
  if (!it) throw new NotFoundError('Bài này không có trong phòng.');
  if (it.status !== 'PASSED') {
    throw new BadRequestError('Bài này chưa đạt — nộp và qua vòng chấm trước đã.');
  }
  const cu = await prisma.codeLabRoomItem.findUnique({ where: { id: itemId }, select: { guideJson: true, reviewJson: true } });
  if (cu?.guideJson && !lamMoi && laLuatMoi(cu.guideJson)) return cu.guideJson;
  if (cu?.guideJson && !lamMoi) {
    const moi = await thuSoanLai(() => soanHuongDan(userId, itemId, cu.reviewJson));
    return moi ?? danhDauCu(cu.guideJson);
  }
  return soanHuongDan(userId, itemId, cu?.reviewJson ?? null);
}

async function soanHuongDan(userId: number, itemId: number, reviewJson: unknown) {
  await assertAi(userId);
  const { brief, khung } = await nganhCanh(itemId);
  const cham = reviewJson ? `\n\nWHAT THE MARKING FOUND (use it — the weak spots are what the lecturer will probe):\n${JSON.stringify(reviewJson).slice(0, 12_000)}` : '';

  const res = await llmComplete({
    step: 'generation',
    feature: 'codelab',
    purpose: 'lab_room',
    // Buổi review thầy bắt "chỉ vào code" — muốn dạy được cách chỉ, AI phải
    // biết trong bài này có đúng những lớp nào.
    system: heThong(NGAN_HANG_VAN_DAP, NHIEM_VU_HUONG_DAN, khung),
    messages: [{ role: 'user', content: `${brief}${cham}` }],
    maxTokens: 6_000,
    maxRetries: 1,
    timeoutMs: 180_000,
    userId,
  });

  const out = docJson<Record<string, unknown>>(res.text);
  if (!out?.moDau) throw new BadRequestError('AI chưa soạn được hướng dẫn. Thử lại giúp mình.');
  const luu = { ...out, _luat: PHIEN_BAN_LUAT };
  await prisma.codeLabRoomItem.update({ where: { id: itemId }, data: { guideJson: luu as object } });
  return luu;
}
