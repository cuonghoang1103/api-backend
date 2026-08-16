/**
 * ============================================================
 * Maker Lab — Voice loop
 * ============================================================
 *
 *   mic (PCM 16 kHz) → WAV wrapper → Groq Whisper → LLM(persona)
 *                                                      ↓
 *   speaker ← MP3 ← TTS ←── { say, actions[] } ────────┘
 *                                  ↓
 *                          validated commands → motors / eyes / LEDs
 *
 * Budget on the current VPS (measured RTT to the board's network is
 * ~25 ms, so the network is not the problem):
 *   Whisper large-v3-turbo on Groq   ~250–400 ms
 *   llama-3.1-8b-instant on Groq     ~200–400 ms
 *   Edge TTS                         ~250–500 ms
 *   ────────────────────────────────────────────
 *   ≈ 1 second from end-of-speech to first audio.
 *
 * Everything here is fail-soft. A robot that answers "tôi nghe không
 * rõ" is fine; a robot whose backend throws and goes silent is not.
 */

import OpenAI from 'openai';
import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { canTraCuu, tinMoiNhat, timTrenWeb, dungDoanTraCuu } from './web.js';
import { timKienThuc, dungDoanKienThuc } from './kienThuc.js';
import { transcribeWithGroq } from '../interview/voice/stt.js';
import {
  loadPersona,
  buildSystemPrompt,
  buildFewShot,
  khoiTrangThai,
  canTrangThai,
  type PersonaConfig,
} from './persona.js';
import { validateCommand, type ValidatedCommand } from './commands.js';
import { synthesizeSpeech } from './tts.js';
import { checkHeardSpeech } from './hallucination.js';
import { PCM_SAMPLE_RATE } from './audio.js';
import { gatewayKey, gatewayRoot, modelFor, endpointFor } from '../llm/gateway.js';
import { xinSlot } from '../llm/hangDoi.js';
import { khopLenhNhanh } from './phanXa.js';
import { CHE_DO, khopDoiCheDo, type CheDo } from './cheDo.js';
import { goiYNghe } from './goiYNghe.js';
import { timDanhThuc, moCong, dangThuc } from './danhThuc.js';
import { khopDoiTinhCach } from './tinhCach.js';
import { khopDoiKieuNoi, CHAO_DOI_KIEU, tuGoiYNghe, type KieuNoi } from './mienTrung.js';

/**
 * Ghép các phần gợi ý cho Whisper, CẮT theo trần cứng của Groq.
 *
 * ⛔⛔ GROQ TỪ CHỐI CẢ LƯỢT NẾU PROMPT QUÁ 896 KÝ TỰ.
 *
 *     groq stt HTTP 400: prompt length must be 896 characters or fewer,
 *                        but provided prompt contains 1482 characters
 *
 * Không phải cắt bớt — nó ném cả request. Nghĩa là MỌI lượt nói chết ở
 * khâu đầu, robot im hoàn toàn, và người dùng chỉ thấy "nói mà nó không
 * trả lời". Log thì đầy lỗi, nhưng log nằm trên máy chủ.
 *
 * Xảy ra thật 15/08/2026, ngay sau khi mồi từ điển miền Trung vào đây:
 * người dùng nhập 164 từ, chuỗi gợi ý phình lên 1.482 ký tự, và robot
 * câm suốt từ lúc deploy.
 *
 * ⚠️ BÀI HỌC: `goiYNghe()` ĐÃ có trần riêng 380 ký tự, nên tôi tưởng
 * phần mình thêm cũng an toàn. Trần của từng mảnh KHÔNG bảo vệ được cái
 * tổng — chỉ có trần đặt ở CHỖ GHÉP mới bảo vệ được.
 *
 * Cắt ở ranh giới dấu phẩy: một từ bị chặt đôi thành thứ Whisper chưa
 * từng thấy, và nó sẽ cố nghe ra thứ đó.
 */
const TRAN_GOI_Y = 850; // dưới 896 một khoảng, chừa cho dấu nối

function catGoiY(phan: string[]): string {
  const s = phan.filter(Boolean).join(', ');
  if (s.length <= TRAN_GOI_Y) return s;
  const cat = s.slice(0, TRAN_GOI_Y);
  const i = cat.lastIndexOf(',');
  return (i > TRAN_GOI_Y * 0.5 ? cat.slice(0, i) : cat).trim();
}
import {
  CAU,
  NHAC_MOI,
  conHan,
  doTieng,
  khopCoKhong,
  tiengCuaCheDo,
  type ChoXacNhan,
} from './lechTieng.js';
import { khopDoiNao, CHAO_DOI_NAO, type Nao } from './nao.js';

// ─── Conversation memory ───────────────────────────────────
//
// Lưu ở DATABASE (`maker_conversations`), không còn trong RAM.
//
// Luật cũ vẫn đúng và đừng quên: mỗi lượt cũ là token phải trả lại trên
// đường nóng của MỌI câu sau. Đo thật hồi còn 4 lượt: prompt cơ bản 885
// token, lúc dùng thật phình lên 2096 — hơn một nửa là lịch sử, và thời
// gian nghĩ tỉ lệ thẳng với số token vào.
/**
 * ⚠️ Vì thế con số này KHÔNG phải "càng to càng tốt". Nới 4 → 30 ngày
 * 13/08/2026 vì đo thật cho thấy trần cũ đến từ model cũ chứ không phải
 * từ nhu cầu:
 *
 *   4 lượt   →  681 ms   (model cục bộ)
 *   60 lượt  → 1.187 ms
 *   400 lượt → 6.288 ms
 *
 * 30 lượt là chỗ robot nhớ được cả buổi nói chuyện mà vẫn dưới một giây.
 *
 * ⚠️⚠️ HẠ 30 → 12 NGÀY 15/08/2026, VÌ PHÉP ĐO TRÊN ĐÃ LỖI THỜI.
 *
 * Bảng số kia đo lúc prompt hệ thống còn gọn. Từ đó tới nay nó phình:
 * từ điển miền Trung (~950 ký tự), sáu mẫu đối thoại tiếng Nghệ, bảng
 * lệnh, ba luật làm việc. Mỗi lượt lịch sử vì thế cũng nặng hơn.
 *
 * Đo thật trên lượt robot 15/08 (llama.cpp `print_timing`):
 *
 *     một lượt xử lý 8.692 token   ← prompt ~8.500
 *     nạp prompt 1.481 token/giây  → ~5,7 giây CHỈ để đọc lại lịch sử
 *     sinh chữ      56 token/giây
 *     tiếng đầu ra sau 4-8 giây
 *
 * Người dùng thấy chậm tới mức bỏ máy nhà chuyển sang cổng trả phí. Mà
 * máy nhà KHÔNG chậm — nó chỉ đang phải đọc lại 8.500 token mỗi câu.
 *
 * 12 lượt ≈ 6 lượt hỏi-đáp gần nhất: vẫn đủ một mạch trò chuyện, mà cắt
 * quá nửa prompt.
 *
 * ⚠️ Con số này phải ĐO LẠI mỗi khi prompt hệ thống to thêm. Nó không
 * phải hằng số của robot, nó là hằng số của MỘT KÍCH CỠ PROMPT — và
 * chính đó là chỗ bảng đo cũ hoá sai mà không ai để ý.
 *
 * Đổi được bằng env `ROBOT_HISTORY_TURNS` mà không cần deploy.
 */
const MAX_HISTORY_TURNS = Number(process.env.ROBOT_HISTORY_TURNS) || 12;

/**
 * Bao lâu không nói thì coi như sang câu chuyện khác.
 *
 * Cũ là 30 phút, và nó không phải một lựa chọn — nó là hệ quả của việc
 * lịch sử nằm trong RAM. 24 giờ để "sáng kể, chiều hỏi lại" vẫn nhớ, thứ
 * mà bản cũ không làm được kể cả khi người dùng ngồi đó cả ngày.
 */
const HISTORY_TTL_MS = (Number(process.env.ROBOT_HISTORY_TTL_HOURS) || 24) * 60 * 60 * 1000;

/** Giữ lại bao lâu rồi mới dọn. Bảng này lớn nhanh như `MakerTelemetry`. */
const HISTORY_PRUNE_DAYS = Number(process.env.ROBOT_HISTORY_PRUNE_DAYS) || 30;

interface Turn {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Lịch sử nằm ở DATABASE, không phải RAM.
 *
 * Bản cũ dùng `new Map()` trong tiến trình. Ba thứ hỏng cùng lúc và không
 * cái nào hiện ra trong log:
 *   • restart backend (mỗi lần deploy) ⇒ mọi robot quên sạch;
 *   • chạy nhiều tiến trình ⇒ mỗi tiến trình một trí nhớ khác nhau, robot
 *     nhớ hay quên tuỳ vào request rơi vào đâu;
 *   • không xem lại được robot đã nói gì với ai.
 */
async function getHistory(deviceId: number): Promise<Turn[]> {
  const tuLuc = new Date(Date.now() - HISTORY_TTL_MS);
  // Lấy N lượt MỚI NHẤT (nên phải desc) rồi đảo lại cho đúng thứ tự kể
  // chuyện. Lấy asc + take là lấy nhầm phần ĐẦU của cuộc nói chuyện.
  //
  // ⚠️ SẮP THEO `id`, KHÔNG PHẢI `createdAt`. Câu hỏi và câu đáp của cùng
  //    một lượt được ghi bằng MỘT `createMany`, nên chúng trùng timestamp
  //    tới từng mili giây. Sắp theo cột có giá trị bằng nhau thì thứ tự
  //    Postgres trả về là tuỳ ý — đo 13/08/2026: robot đọc được lịch sử
  //    XÁO TRỘN, câu đáp đứng trước câu hỏi, và nó "quên" thứ vừa được kể.
  //    Nhìn y hệt model kém trí nhớ. `id` là SERIAL nên luôn tăng đúng thứ
  //    tự ghi. `createdAt` vẫn dùng để lọc TTL, chỉ không dùng để sắp.
  const rows = await prisma.makerConversation.findMany({
    where: { deviceId, createdAt: { gte: tuLuc } },
    orderBy: { id: 'desc' },
    take: MAX_HISTORY_TURNS * 2,
    select: { role: true, content: true },
  });
  return rows.reverse().map((r) => ({ role: r.role === 'user' ? 'user' : 'assistant', content: r.content }));
}

/**
 * Ghi lượt vừa nói.
 *
 * KHÔNG `await` ở chỗ gọi: đây là đường nói thời gian thực, ghi log không
 * được bắt người ta chờ. Hỏng thì nuốt lỗi và ghi lại — mất một lượt trí
 * nhớ còn hơn làm robot câm giữa câu.
 */
function pushHistory(deviceId: number, ...turns: Turn[]): void {
  if (!turns.length) return;
  prisma.makerConversation
    .createMany({ data: turns.map((t) => ({ deviceId, role: t.role, content: t.content })) })
    .catch((e) => logger.warn('MakerLab khong ghi duoc hoi thoai', { deviceId, err: String(e) }));
}

/**
 * Dọn hội thoại cũ. Gọi từ cron, không phải từ đường nói.
 */
export async function donHoiThoaiCu(): Promise<number> {
  const truoc = new Date(Date.now() - HISTORY_PRUNE_DAYS * 24 * 60 * 60 * 1000);
  const r = await prisma.makerConversation.deleteMany({ where: { createdAt: { lt: truoc } } });
  if (r.count) logger.info('MakerLab don hoi thoai cu', { xoa: r.count, truocNgay: truoc.toISOString() });
  return r.count;
}

/**
 * Dựng mảng messages cho một lượt nói. `thinkAndSpeak` và `think` dựng y
 * hệt nhau — tách ra một chỗ để lần sau sửa là sửa cho cả hai, chứ không
 * vá một nơi rồi quên nơi kia.
 *
 * ⛔ ĐOẠN TRA INTERNET KHÔNG ĐƯỢC MANG VAI `system`.
 *
 * Nó từng là system message THỨ HAI. Cổng modelapi.vn dễ tính nên chuyện
 * đó nằm im hàng tháng. Đo với model cục bộ ngày 13/08/2026 thì mọi câu
 * hỏi tin tức/tra cứu chết ngay:
 *
 *     HTTP 500 — Jinja Exception: System message must be at the beginning.
 *
 * Template chat của Qwen3.5 (và nhiều model mở khác) chỉ cho đúng MỘT
 * system message, ở vị trí đầu tiên. Vai `user` thì cả hai bên đều nhận —
 * đã thử thật với cả `user` lẫn `assistant`, đều OK.
 *
 * Ý đồ cũ giữ nguyên: dữ liệu đứng NGAY TRƯỚC câu người dùng vừa nói.
 * Đặt lên đầu cùng tính cách thì model lẫn nó với "mày là ai" rồi đọc lại
 * cả danh sách như đọc mục lục. Khác một điểm so với bản cũ: giờ nó nằm
 * SAU lịch sử hội thoại — trước kia code nói "ngay trước câu người dùng"
 * nhưng lại chèn trước cả 4 lượt lịch sử, tức cách câu hỏi 8 tin nhắn.
 */
async function dungMessages(
  persona: PersonaConfig,
  ctx: { deviceName?: string; battery?: number | null },
  deviceId: number,
  heard: string,
  doanTraCuu: string,
): Promise<Array<{ role: 'system' | 'user' | 'assistant'; content: string }>> {
  // Kho kiến thức chạy SONG SONG với lịch sử: cả hai đều là truy vấn DB vài
  // mili giây, nối tiếp nhau thì cộng dồn vô nghĩa trên đường nói.
  const [lichSu, mauKienThuc] = await Promise.all([
    getHistory(deviceId),
    persona.projectId ? timKienThuc(persona.projectId, heard, 3) : Promise.resolve([]),
  ]);
  const doanKienThuc = dungDoanKienThuc(mauKienThuc);

  return [
    { role: 'system', content: buildSystemPrompt(persona, ctx) },
    ...buildFewShot(persona),
    ...lichSu,
    // Cùng chỗ với đoạn tra web, cùng lý do: sát câu hỏi thì model dùng nó,
    // và vai `user` vì template Qwen3.5 chỉ cho một system message ở đầu.
    ...(doanKienThuc ? [{ role: 'user' as const, content: doanKienThuc }] : []),
    ...(doanTraCuu ? [{ role: 'user' as const, content: doanTraCuu }] : []),
    /**
     * ⚠️ SỐ LIỆU TRẠNG THÁI CHỈ ĐƯA KHI NGƯỜI TA HỎI TỚI.
     *
     * Hai lý do, và lý do thứ nhất là do chính tôi gây ra:
     *
     * 1. Bản trước gộp khối số liệu vào MỌI câu người dùng nói, để cache
     *    ăn. Model đọc nó như thể người dùng vừa đọc mấy dòng đó ra, nên
     *    nó đáp lại — mỗi lượt. Người dùng báo: "câu nào cuối cùng nó
     *    cũng kèm câu đang chạy trên CuongMini với tên wifi tốc độ".
     *
     * 2. Lượt thường không có chữ động nào thì phần chung giữa hai lượt
     *    là TOÀN BỘ prompt cộng toàn bộ lịch sử — cache ăn trọn, tốt hơn
     *    hẳn so với "ăn tới chỗ khối động".
     *
     * Hỏi "mấy giờ rồi", "pin còn bao nhiêu", "wifi gì" thì mới đưa. Lúc
     * đó cache có đứt cũng đáng: người ta đang hỏi đúng cái đó.
     */
    {
      role: 'user',
      content: canTrangThai(heard) ? `${khoiTrangThai(ctx)}\n\n${heard}` : heard,
    },
  ];
}

/**
 * Lưu chế độ tiếng vào `traits.cheDo`.
 *
 * Đọc-sửa-ghi thay vì ghi đè cả `traits`: cột đó còn giữ kiến thức huấn
 * luyện và tốc độ đọc. Ghi đè nguyên khối là xoá sạch phần Huấn luyện —
 * đúng cái bẫy đã ghi trong `makerLab.service.ts`.
 */
async function luuCheDo(projectId: number, cheDo: CheDo): Promise<void> {
  const row = await prisma.makerPersona.findFirst({
    where: { projectId },
    select: { id: true, traits: true },
  });
  if (!row) return;
  const cu = (row.traits as Record<string, unknown> | null) ?? {};
  await prisma.makerPersona.update({
    where: { id: row.id },
    data: { traits: { ...cu, cheDo } },
  });
}

/** Ghi bộ tính cách đang bật vào `traits`. */
async function luuTinhCach(projectId: number, khoa: string): Promise<void> {
  const row = await prisma.makerPersona.findFirst({
    where: { projectId },
    select: { id: true, traits: true },
  });
  if (!row) return;
  const cu = (row.traits as Record<string, unknown> | null) ?? {};
  await prisma.makerPersona.update({
    where: { id: row.id },
    data: { traits: { ...cu, tinhCachDangDung: khoa } as never },
  });
}

/** Ghim kiểu nói (phổ thông / miền Trung) — sống qua deploy và mất điện. */
async function luuKieuNoi(projectId: number, kieu: KieuNoi): Promise<void> {
  const row = await prisma.makerPersona.findFirst({
    where: { projectId },
    select: { id: true, traits: true },
  });
  if (!row) return;
  const cu = (row.traits as Record<string, unknown> | null) ?? {};
  await prisma.makerPersona.update({
    where: { id: row.id },
    data: { traits: { ...cu, kieuNoi: kieu } as never },
  });
}

/** Ghi/xoá trạng thái "đang chờ trả lời có-không cho việc đổi tiếng". */
async function luuChoXacNhan(projectId: number, c: ChoXacNhan | null): Promise<void> {
  const row = await prisma.makerPersona.findFirst({
    where: { projectId },
    select: { id: true, traits: true },
  });
  if (!row) return;
  const cu = (row.traits as Record<string, unknown> | null) ?? {};
  const moi: Record<string, unknown> = { ...cu };
  if (c) moi.choXacNhan = c;
  else delete moi.choXacNhan;
  await prisma.makerPersona.update({ where: { id: row.id }, data: { traits: moi as never } });
}

/**
 * Ghim não cho robot. `null` = bỏ ghim, quay về theo cấu hình máy chủ.
 *
 * Đọc-sửa-ghi y như `luuCheDo`, và vì đúng một lý do: `traits` còn giữ
 * kiến thức huấn luyện, tốc độ đọc và chế độ tiếng. Ghi đè nguyên khối là
 * xoá sạch phần Huấn luyện.
 */
export async function luuNao(projectId: number, nao: Nao | null): Promise<void> {
  const row = await prisma.makerPersona.findFirst({
    where: { projectId },
    select: { id: true, traits: true },
  });
  if (!row) return;
  const cu = (row.traits as Record<string, unknown> | null) ?? {};
  const moi: Record<string, unknown> = { ...cu };
  if (nao) moi.nao = nao;
  else delete moi.nao;
  await prisma.makerPersona.update({
    where: { id: row.id },
    data: { traits: moi as Prisma.InputJsonValue },
  });
}

/**
 * Người dùng vừa bảo quên hết? Khớp HẸP, đòi động từ, chỉ nhận câu ngắn.
 *
 * Xoá trí nhớ là việc KHÔNG hoàn tác được, nên chốt phải chặt hơn mọi
 * lệnh khác. "Tôi quên mất cái đó rồi" là kể chuyện, không phải lệnh.
 */
export function khopQuenHet(heard: string): boolean {
  const s = heard
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!s || s.length > 34) return false;
  return /\b(quen|xoa|reset|clear)\b(\s+\S+){0,2}\s+(het|sach|tri nho|lich su|bo nho|all|memory|history)\b/.test(s);
}

/** Xoá trí nhớ của MỘT robot — nút "quên hết đi" trên trang quản trị. */
export async function clearHistory(deviceId: number): Promise<void> {
  await prisma.makerConversation.deleteMany({ where: { deviceId } });
}

// ─── Chốt chặn chi phí ─────────────────────────────────────
/**
 * Trần số lượt nói mỗi ngày, mỗi thiết bị.
 *
 * Không phải lo xa. Đúng hôm nay, VAD đặt ngưỡng cố định đã bắt nhầm
 * tiếng phòng và tự mở lượt liên tục — mỗi lượt là một lần gọi LLM
 * cộng một lần gọi TTS. Bộ lọc câu bịa chặn được phần lớn, nhưng nó
 * chặn SAU khi Whisper đã chạy, và một con robot cắm điện 24/7 cạnh
 * cái quạt là thứ có thể tiêu tiền cả đêm mà không ai biết.
 *
 * 2000 lượt/ngày rộng hơn nhiều so với mức dùng thật của một con
 * robot để bàn (nói cả ngày cũng khó quá 300), nên nó không bao giờ
 * chặn nhầm việc dùng bình thường — nó chỉ chặn lúc có gì đó hỏng.
 */
const DAILY_TURN_CAP = Number(process.env.MAKERLAB_DAILY_TURN_CAP) || 2000;
const turnCounts = new Map<number, { day: string; n: number }>();

function overDailyCap(deviceId: number): boolean {
  if (DAILY_TURN_CAP <= 0) return false; // 0 = tắt trần
  const day = new Date().toISOString().slice(0, 10);
  const c = turnCounts.get(deviceId);
  if (!c || c.day !== day) {
    turnCounts.set(deviceId, { day, n: 1 });
    return false;
  }
  c.n += 1;
  if (c.n === DAILY_TURN_CAP + 1)
    logger.warn('MakerLab chạm trần lượt nói trong ngày', { deviceId, cap: DAILY_TURN_CAP });
  return c.n > DAILY_TURN_CAP;
}

// ─── LLM client ────────────────────────────────────────────
// Its own client rather than reusing AIService: the robot wants the
// fastest small model, not the best one, and it must not inherit the
// chat product's RAG context or model switching.
/**
 * Nhà cung cấp model — đổi bằng BIẾN MÔI TRƯỜNG, không sửa code.
 *
 *   MAKERLAB_LLM_PROVIDER = compat | groq | openai | custom
 *   MAKERLAB_LLM_MODEL    = tên model
 *
 * Mặc định là `compat`: dùng lại đúng cổng modelapi.vn mà CV Builder
 * và Jobs AI đã cấu hình sẵn (`OPENAI_COMPAT_BASE_URL` +
 * `OPENAI_COMPAT_API_KEY`). Không thêm khoá mới, không thêm hoá đơn
 * mới — robot tiêu chung một ví với phần còn lại của web.
 *
 * ⚠️ Cổng Rambo (`LLM_BASE_URL` + các model `rb-*`) ĐÃ HẾT HẠN, đừng
 * trỏ về đó nữa dù mã cũ vẫn còn nhắc tới nó.
 *
 * Model trên modelapi.vn (đọc từ trang Rankings công khai, 10/08/2026):
 *   gpt-5.6-sol · gpt-5.6-terra · gpt-5.6-luna · gpt-5.5 · gpt-5.4
 *   gpt-5.4-mini · deepseek-v4-flash · grok-4.5
 *   claude-opus-5 · claude-sonnet-5 · claude-fable-5 · …
 *
 * Với robot đối thoại thì độ trễ quan trọng ngang độ thông minh —
 * mỗi 100 ms đều nghe ra được. `gpt-5.6-terra` là mức cân bằng, và
 * nếu thấy chậm thì `gpt-5.4-mini` hoặc `deepseek-v4-flash` rẻ và
 * nhanh hơn rõ; đổi chỉ là một biến môi trường.
 */
interface LlmProvider {
  baseURL: string;
  key: string | undefined;
  label: string;
}

function providerNamed(which: string): LlmProvider {
  switch (which) {
    case 'groq':
      return { baseURL: 'https://api.groq.com/openai/v1', key: process.env.GROQ_API_KEY, label: 'groq' };
    case 'openai':
      return { baseURL: 'https://api.openai.com/v1', key: process.env.OPENAI_API_KEY, label: 'openai' };
    case 'custom':
      return {
        baseURL: (process.env.MAKERLAB_LLM_BASE_URL || '').replace(/\/+$/, ''),
        key: process.env.MAKERLAB_LLM_API_KEY,
        label: 'custom',
      };
    default:
      // Cùng cổng, cùng khoá với cả web — xem src/services/llm/gateway.ts.
      return { baseURL: `${gatewayRoot()}/v1`, key: gatewayKey(), label: 'compat' };
  }
}

function usable(p: LlmProvider): boolean {
  return !!p.key && !!p.baseURL;
}

/**
 * ============================================================
 * Bộ ngắt mạch — nhà nào vừa chết thì tạm thời BỎ QUA
 * ============================================================
 *
 * ⚠️ CÓ LƯỚI ĐỠ KHÔNG CÓ NGHĨA LÀ ĐỠ MƯỢT.
 *
 * Chuỗi dự phòng đã có sẵn (máy nhà → cổng → Groq) và nó hoạt động. Cái
 * thiếu là TRÍ NHỚ: nhà mất điện thì mỗi lượt nói đều thử máy nhà
 * TRƯỚC, chờ nó hết giờ, rồi mới tụt xuống cổng. Robot vẫn trả lời được
 * — nhưng lượt nào cũng cõng thêm quãng chờ đó, và người dùng nghe ra
 * là "robot chậm hẳn" chứ không nghe ra là "máy nhà chết".
 *
 * Nhớ lại vài chục giây thì lượt ĐẦU chịu quãng chờ, các lượt sau đi
 * thẳng xuống cổng. Hết hạn thì thử lại — điện có lại là tự quay về, ai
 * cũng không phải làm gì.
 *
 * Vì sao không dùng healthcheck định kỳ: `/health` trả 200 không chứng
 * minh model chạy được (đúng bài học đã học với máy đọc). Lấy chính lượt
 * nói thật làm phép thử thì không bao giờ sai.
 */
const _nhaChet = new Map<string, number>();
const NGHI_MS = 60_000;

function dangChet(label: string): boolean {
  const den = _nhaChet.get(label);
  if (!den) return false;
  if (Date.now() >= den) {
    _nhaChet.delete(label);
    logger.info('MakerLab thử lại nhà LLM sau thời gian nghỉ', { provider: label });
    return false;
  }
  return true;
}

export function baoNhaHong(label: string, err: unknown): void {
  // Cổng và Groq là lưới đỡ CUỐI — đánh dấu chúng chết thì không còn gì
  // để tụt xuống nữa, tức là biến một lỗi tạm thành robot câm.
  if (label !== 'may-nha') return;
  _nhaChet.set(label, Date.now() + NGHI_MS);
  logger.warn('MakerLab tạm bỏ qua máy nhà, chuyển sang cổng', {
    provider: label,
    nghiGiay: NGHI_MS / 1000,
    error: err instanceof Error ? err.message : String(err),
  });
}

/** Trạng thái cho trang quản trị / tab Điều khiển. */
export function trangThaiNao(): { mayNhaChet: boolean; conNghiGiay: number } {
  const den = _nhaChet.get('may-nha');
  const con = den ? Math.max(0, Math.round((den - Date.now()) / 1000)) : 0;
  return { mayNhaChet: con > 0, conNghiGiay: con };
}

/**
 * Nhà chính, và nhà dự phòng nếu nhà chính chưa cấu hình.
 *
 * Một con robot không nên câm chỉ vì hết credit hay sai một biến môi
 * trường. Groq miễn phí nên nó là cái lưới đỡ phía dưới — chậm hơn,
 * kém hơn, nhưng còn nói được.
 */
function llmChain(nao: Nao | null = null, boQuaMayNha = false): LlmProvider[] {
  const chain: LlmProvider[] = [];

  // ── Người dùng GHIM não nào thì nghe người dùng ──
  //
  // `nao` đè lên `LLM_LOCAL_PURPOSES`. Đây là đường thoát khi model mới nói
  // không vừa ý: một câu "đổi về model cũ đi" là xong, không cần deploy,
  // không cần sửa biến môi trường, không cần ai ngồi trước máy chủ.
  // Ghim 'cong' thì BỎ HẲN máy nhà khỏi chuỗi — ghim mà vẫn thử máy nhà
  // trước thì ghim để làm gì.
  if (nao === 'cong') {
    const congP = providerNamed('compat');
    if (usable(congP)) chain.push(congP);
    const groqP = providerNamed('groq');
    if (usable(groqP) && !chain.some((c) => c.baseURL === groqP.baseURL)) chain.push(groqP);
    if (!chain.length) chain.push(congP);
    return chain;
  }

  // ── Máy nhà đứng ĐẦU nếu được ghim, hoặc `robot_voice` bật trong env ──
  //
  // Đo 13/08/2026 trên đúng đề bài production: chữ đầu 96–333 ms so với
  // 2.119–4.575 ms của cổng. Với robot thì đó là khác biệt giữa "nói chuyện
  // được" và "chờ đèn đỏ".
  //
  // `boQuaMayNha` = hàng đợi máy nhà đã từ chối lượt này (xem `hangDoi.ts`).
  // Bỏ nó khỏi chuỗi chứ đừng để nó đứng đầu rồi hỏng: đứng đầu mà không có
  // vé thì lượt nào cũng cõng thêm một phép thử thất bại trước khi tụt xuống
  // cổng — đúng cái bệnh "robot chậm hẳn" mà bộ ngắt mạch ở trên sinh ra để
  // chữa.
  const ep = nao === 'may-nha' ? { ...endpointFor('robot_voice'), local: true } : endpointFor('robot_voice');
  if (ep.local && ep.key && !dangChet('may-nha') && !boQuaMayNha) {
    chain.push({ baseURL: `${ep.root}/v1`, key: ep.key, label: 'may-nha' });
  }

  const primary = providerNamed((process.env.MAKERLAB_LLM_PROVIDER || 'compat').toLowerCase());
  if (usable(primary) && !chain.some((c) => c.baseURL === primary.baseURL)) chain.push(primary);

  // ⚠️ CỔNG phải nằm TRƯỚC Groq trong lưới đỡ.
  //
  // Trước 13/08/2026 lưới đỡ duy nhất là Groq — hợp lý hồi cổng là thứ đắt
  // nhất. Giờ nhà chính là MÁY NHÀ, và máy nhà thì mất điện, mất mạng, hay
  // đang bận train giọng. Rơi thẳng xuống Groq nghĩa là mỗi lần cúp điện ở
  // nhà là robot đổi hẳn sang một model khác hẳn — kèm rủi ro 429 của bậc
  // miễn phí (đã dính một lần). Cổng mới là thứ tương đương gần nhất.
  const congP = providerNamed('compat');
  if (usable(congP) && !chain.some((c) => c.baseURL === congP.baseURL)) chain.push(congP);

  const groqP = providerNamed('groq');
  if (usable(groqP) && !chain.some((c) => c.baseURL === groqP.baseURL)) chain.push(groqP);

  if (!chain.length) chain.push(primary); // để lỗi nói rõ là thiếu gì
  return chain;
}

const _clients = new Map<string, OpenAI>();
function clientFor(p: LlmProvider): OpenAI {
  let c = _clients.get(p.baseURL);
  if (!c) {
    if (!p.key) throw new Error(`Thiếu khoá API cho nhà cung cấp "${p.label}"`);
    if (!p.baseURL) throw new Error(`Thiếu base URL cho nhà cung cấp "${p.label}"`);
    c = new OpenAI({ baseURL: p.baseURL, apiKey: p.key });
    _clients.set(p.baseURL, c);
    logger.info('MakerLab dùng LLM', { provider: p.label, baseURL: p.baseURL });
  }
  return c;
}

function robotModel(p: LlmProvider): string {
  if (process.env.MAKERLAB_LLM_MODEL) return process.env.MAKERLAB_LLM_MODEL;
  switch (p.label) {
    case 'groq':
      return 'llama-3.3-70b-versatile';
    case 'openai':
      return 'gpt-4o-mini';
    default:
      // Cùng bản đồ model với phần còn lại của web (src/services/llm/gateway.ts)
      // → đổi model robot bằng `LLM_MODEL_ROBOT_VOICE`, không cần sửa mã.
      return modelFor('robot_voice');
  }
}

// ─── PCM → WAV ─────────────────────────────────────────────

/**
 * Whisper needs a container, the ESP32 sends raw samples. A 44-byte
 * RIFF header is all it takes — cheaper than making the firmware do
 * any encoding.
 */
export function pcmToWav(pcm: Buffer, sampleRate = 16_000, channels = 1, bits = 16): Buffer {
  const header = Buffer.alloc(44);
  const byteRate = (sampleRate * channels * bits) / 8;
  const blockAlign = (channels * bits) / 8;
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // format = PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bits, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

// ─── Reply parsing ─────────────────────────────────────────

export interface RobotReply {
  say: string;
  actions: ValidatedCommand[];
}

/**
 * The model is asked for strict JSON, and mostly complies. When it
 * doesn't — a stray sentence before the brace, a markdown fence — we
 * salvage rather than fail: worst case the whole response becomes the
 * spoken line, which is still a working robot.
 */
/**
 * Trần độ dài câu nói, tính bằng ký tự.
 *
 * Từng là 500 — và đó là chỗ cắt cụt câu trả lời dài, không phải trần
 * token. `max_tokens` trong DB là 800, tức model viết thoải mái được
 * ~1.500 ký tự tiếng Việt, rồi bị dòng `slice(0, 500)` này xén mất quá
 * nửa. Người nghe thấy robot đang nói ngon lành thì im bặt giữa chừng,
 * và không có gì trong log nói ra chuyện đó.
 *
 * 2.000 để `max_tokens` trở lại làm cái trần thật — muốn robot nói ngắn
 * hay dài thì chỉnh ở đó, chỗ có tên đúng với việc nó làm, chứ không
 * phải ở một hằng số giấu trong hàm phân tích JSON.
 */
const MAX_SAY_CHARS = 2_000;

export function parseRobotReply(raw: string): RobotReply {
  const text = raw.trim();
  const candidates: string[] = [];

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) candidates.push(fenced[1].trim());
  const braced = text.match(/\{[\s\S]*\}/);
  if (braced) candidates.push(braced[0]);
  candidates.push(text);

  for (const c of candidates) {
    try {
      const obj = JSON.parse(c) as Record<string, unknown>;
      const say = String(obj.say ?? obj.text ?? '').trim();
      if (!say) continue;
      const actions: ValidatedCommand[] = [];
      if (Array.isArray(obj.actions)) {
        for (const a of obj.actions.slice(0, 3)) {
          if (!a || typeof a !== 'object') continue;
          const rec = a as Record<string, unknown>;
          const cmd = validateCommand(String(rec.type ?? ''), rec.payload, { llmOnly: true });
          if (cmd) actions.push(cmd);
        }
      }
      return { say: say.slice(0, MAX_SAY_CHARS), actions };
    } catch {
      /* try the next candidate */
    }
  }

  // Not JSON at all — strip any braces and speak whatever is left.
  return {
    say: text.replace(/[{}[\]"]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_SAY_CHARS),
    actions: [],
  };
}

// ─── Báo trạng thái cổng đánh thức bằng MẮT ────────────────
//
// Không dùng loa. Firmware đã gỡ sạch tiếng báo theo yêu cầu của user:
// trong một căn phòng, thứ robot phát ra bằng loa nên là NỘI DUNG, còn
// TRẠNG THÁI thì đã có màn hình. Mắt lim dim = đang ngủ, mắt mở bừng =
// vừa nghe gọi tên. Nhìn là biết, không phải đoán.

/**
 * Gửi thẳng một lệnh đổi mắt, KHÔNG qua bảng `MakerCommand`.
 *
 * Cố ý không ghi sổ: đây là tín hiệu trạng thái, mỗi lượt nói một cái,
 * ghi hết thì bảng lệnh ngập rác và tab Lệnh không còn đọc được. Đánh
 * đổi nhỏ: bo vẫn `sendAck(id=0)`, server không tìm thấy hàng nào và
 * nuốt lỗi im lặng (`handleAck` có `.catch`), nên chỉ thừa một dòng
 * `command:update` vô hại trong Live Console.
 */
function baoMat(deviceId: number, emotion: string, ms: number): void {
  void import('../../socket/device.gateway.js')
    .then(({ notifyDevice }) =>
      notifyDevice(deviceId, { t: 'cmd', type: 'face', payload: { emotion, ms } }),
    )
    .catch(() => undefined);
}

/**
 * Hẹn giờ cho mắt lim dim lại đúng lúc cổng đóng.
 *
 * Không có cái này thì mắt cứ mở sau khi hết giờ, và người dùng tưởng
 * robot vẫn đang nghe — tức là chỉ báo trạng thái nói dối, còn tệ hơn
 * không có chỉ báo.
 *
 * `.unref()` để hẹn giờ không giữ tiến trình sống. Mất khi restart cũng
 * không sao: `dangThuc()` đọc mốc thời gian thật, hẹn giờ chỉ lo phần
 * hình ảnh, và lượt nói kế tiếp sẽ dựng lại đúng trạng thái.
 */
const _henNgu = new Map<number, NodeJS.Timeout>();
function henNguLai(deviceId: number, giay: number): void {
  clearTimeout(_henNgu.get(deviceId));
  const t = setTimeout(() => {
    _henNgu.delete(deviceId);
    baoMat(deviceId, 'sleepy', 0);
  }, giay * 1000 + 500);
  t.unref?.();
  _henNgu.set(deviceId, t);
}

// ─── The turn ──────────────────────────────────────────────

export interface VoiceTurnInput {
  deviceId: number;
  projectId: number;
  /** Raw mic audio. Either this or `text` must be provided. */
  pcm16?: Buffer;
  /** Pre-transcribed input (device-side STT, or a web console message). */
  text?: string;
  /** Console messages shouldn't play out of the robot's speaker unless asked. */
  speak?: boolean;
}

export interface VoiceTurnResult {
  heard: string;
  said: string;
  actions: ValidatedCommand[];
  spoken: boolean;
  ms: { stt: number; llm: number; tts: number; total: number };
}

/**
 * One full exchange. Called by the device gateway on `audio_end`,
 * and by the REST console when you type at the robot from the web.
 */
export async function runVoiceTurn(input: VoiceTurnInput): Promise<VoiceTurnResult> {
  const started = Date.now();
  const timing = { stt: 0, llm: 0, tts: 0, total: 0 };

  const device = await prisma.makerDevice.findUnique({
    where: { id: input.deviceId },
    select: {
      id: true,
      name: true,
      batteryPct: true,
      // Bản ghi telemetry MỚI NHẤT. `MakerDevice` không giữ số liệu mạng
      // (chỉ có batteryPct), còn số liệu thô thì nằm ở bảng riêng —
      // dùng chính bảng đó thay vì thêm cột mới và một migration.
      telemetry: {
        orderBy: { recordedAt: 'desc' as const },
        take: 1,
        select: { payload: true },
      },
    },
  });

  // ── 1. Hear ──
  let heard = (input.text ?? '').trim();
  // Ngôn ngữ Whisper tự nhận — dùng lại ở bước dò nói-lệch-tiếng bên
  // dưới. Rỗng khi gõ chữ từ web, hoặc khi chế độ ép sẵn ngôn ngữ.
  let tiengWhisper: string | null = null;
  if (!heard && input.pcm16?.length) {
    const t0 = Date.now();
    const wav = pcmToWav(input.pcm16);
    const persona0 = await loadPersona(input.projectId);
    // Ngôn ngữ nghe lấy theo CHẾ ĐỘ đang bật, không lấy theo `persona.language`.
    // Hai thứ đó khác nhau: `language` là cấu hình gốc của persona, còn chế độ
    // là thứ người dùng vừa đổi bằng giọng nói. Lấy nhầm thì robot nghe tiếng
    // Anh bằng bộ nhận tiếng Việt — và triệu chứng là "nó nghe không ra", chứ
    // không phải "sai ngôn ngữ", nên rất khó lần ra.
    // `null` = để Whisper tự nhận. Groq nhận `language` rỗng nghĩa là
    // tự dò, nên chỉ truyền khi chế độ thật sự muốn ép.
    const lang = CHE_DO[persona0.cheDo].stt ?? '';
    const tr = await transcribeWithGroq(wav, 'turn.wav', 'audio/wav', {
      language: lang,
      // Mồi vốn từ cho Whisper — tên riêng người dùng tự dạy, từ điều
      // khiển, thuật ngữ công nghệ. Không tốn thêm gì, và nó chữa đúng
      // loại lỗi khó chịu nhất: nghe sai TÊN và THUẬT NGỮ.
      hints: catGoiY([
        goiYNghe(persona0.cheDo, persona0.knowledge, persona0.name, persona0.wakeWord),
        // ⚠️ ĐÂY MỚI LÀ CHỖ CHỮA "ROBOT KHÔNG HIỂU GIỌNG MIỀN TRUNG".
        //
        // LLM vốn hiểu "nỏ biết mô". Khâu hỏng là WHISPER: nó học chủ yếu
        // tiếng phổ thông nên nghe "nỏ" thành "nó", "chộ" thành "chỗ" —
        // và LLM nhận được một câu đã sai từ trước khi tới lượt nó.
        //
        // Mồi vào đây thì Whisper bám theo. Chỉ mồi khi ĐANG ở kiểu miền
        // Trung: gửi kèm ở kiểu phổ thông là đẩy Whisper nghe ra từ địa
        // phương ở những câu vốn không có, tức đổi một lỗi lấy một lỗi.
        persona0.cheDo === 'vi' && persona0.kieuNoi === 'mien-trung'
          ? tuGoiYNghe(persona0.tuDienRieng)
          : '',
      ]),
      detail: true,
    });
    heard = tr.text.trim();
    timing.stt = Date.now() - t0;

    /**
     * ⚠️ TỰ DÒ NGÔN NGỮ THÌ WHISPER ĐOÁN CẢ NGÔN NGỮ, VÀ NÓ ĐOÁN BỪA.
     *
     * Chế độ ngoại ngữ để Whisper tự nhận (`stt: null`) — cần thiết, vì
     * ép ngôn ngữ là nhốt người dùng trong chế độ đó. Nhưng cái giá đo
     * được ngay trong giờ đầu dùng thật 13/08/2026:
     *
     *   "ว่า อี ซอ น ิ ม"           ← tiếng Thái
     *   "Продолжение следует..."   ← tiếng Nga, "còn tiếp"
     *
     * Cả hai là tiếng ồn phòng bị dựng thành chữ. Whisper không bao giờ
     * nói "tôi không nghe thấy gì"; ở chế độ tự dò nó chọn luôn một ngôn
     * ngữ để đoán cho khớp.
     *
     * Robot này chỉ nói hai thứ tiếng. Nghe ra thứ ba nghĩa là KHÔNG
     * nghe được — bỏ qua, đừng bắt LLM trả lời một câu tiếng Nga bịa ra.
     */
    const tiengNhanRa = String(tr.language || '').toLowerCase();
    tiengWhisper = tiengNhanRa || null;
    const CHO_PHEP = new Set(['vi', 'vietnamese', 'en', 'english', '']);
    if (heard && tiengNhanRa && !CHO_PHEP.has(tiengNhanRa)) {
      logger.info('MakerLab bỏ qua — Whisper nhận ra ngôn ngữ lạ', {
        deviceId: input.deviceId,
        tieng: tiengNhanRa,
        heard: heard.slice(0, 60),
      });
      heard = '';
    }

    // Whisper luôn trả về CHỮ, kể cả khi chỉ nghe thấy tiếng quạt — và
    // chữ nó bịa ra là phụ đề YouTube. Không chặn ở đây thì LLM sẽ trả
    // lời rất nghiêm túc câu "đừng quên đăng ký kênh" mà không ai nói,
    // và người dùng kết luận là con AI bị ngu.
    // Độ dài đoạn tiếng là bằng chứng mạnh nhất chống lại chuyện bịa —
    // xem hallucination.ts. Không truyền xuống thì tầng lọc đó tắt câm.
    const audioSec = input.pcm16.length / 2 / PCM_SAMPLE_RATE;
    const check = checkHeardSpeech(heard, { ...tr, audioSec });
    if (!check.ok) {
      // Báo cho bo biết là KHÔNG hiểu, để nó bíp hai nốt đi xuống.
      //
      // Không có tín hiệu này thì người dùng đứng chờ một câu trả lời
      // không bao giờ tới, rồi tự hỏi lại — và câu hỏi thứ hai đè lên
      // lượt đang xử lý. Im lặng là phản hồi tệ nhất có thể.
      void import('../../socket/device.gateway.js')
        .then(({ notifyDevice }) => notifyDevice(input.deviceId, { t: 'nak' }))
        .catch(() => undefined);
      logger.info('MakerLab bỏ lượt: Whisper bịa', {
        deviceId: input.deviceId,
        heard: heard.slice(0, 80),
        reason: check.reason,
        noSpeechProb: tr.noSpeechProb,
        bytes: input.pcm16.length,
      });
      timing.total = Date.now() - started;
      return { heard: '', said: '', actions: [], spoken: false, ms: timing };
    }
  }

  if (!heard) {
    timing.total = Date.now() - started;
    return { heard: '', said: '', actions: [], spoken: false, ms: timing };
  }

  emitTranscript(input.deviceId, 'user', heard);

  // ── 2. Think ──
  const persona = await loadPersona(input.projectId);

  // ── Cổng đánh thức: im cho tới khi được gọi tên ─────────────
  //
  // Đứng TRƯỚC `overDailyCap`: một câu người ta nói với nhau trong
  // phòng không được ăn mất một lượt trong hạn mức ngày.
  //
  // Đứng SAU `emitTranscript`: Live Console vẫn phải hiện câu đã nghe kể
  // cả khi bỏ qua. Không có dòng đó thì lúc cổng nhận hụt, màn hình
  // trống trơn và không tài nào biết Whisper đã chép ra cái gì.
  //
  // ⚠️ BA ĐIỀU KIỆN, thiếu một là cổng KHÔNG chạy:
  //  1. Cờ bật (`congDanhThuc`) — người dùng tắt được từ web.
  //  2. `wakeWord` KHÔNG rỗng. Chốt hãm quan trọng nhất: ô trống mà vẫn
  //     gác thì robot câm vĩnh viễn và trông y như hỏng. Prod trước
  //     16/08/2026 chính là ô trống.
  //  3. `speak !== false` — đường GÕ CHỮ từ web Console luôn lọt. Người
  //     ta vừa gõ vào ô chat của robot thì đã là cố ý nói với nó rồi;
  //     bắt gõ thêm "Odin" là vô nghĩa. Đây cũng là ĐƯỜNG THOÁT khi
  //     cổng nhận hụt: web vẫn sai khiến được robot đang ngủ.
  const gacCong =
    persona.congDanhThuc && !!persona.wakeWord?.trim() && input.speak !== false;

  if (gacCong) {
    const goi = timDanhThuc(heard, persona.wakeWord);

    if (goi.trung) {
      moCong(input.deviceId, persona.giayThucGiac);
      henNguLai(input.deviceId, persona.giayThucGiac);
      // Mắt mở bừng — ĐÂY LÀ TOÀN BỘ tín hiệu "tôi nghe đây". Cố ý
      // không kêu bíp: firmware đã gỡ sạch mọi tiếng báo, vì thứ robot
      // phát ra loa nên là NỘI DUNG, còn TRẠNG THÁI thuộc về màn hình.
      baoMat(input.deviceId, 'surprised', 1500);

      // Gọi tên suông ("Odin ơi") thì đừng đẩy vào LLM — nó sẽ bịa ra
      // câu trả lời cho một câu hỏi không tồn tại. Mở cổng rồi im, đợi
      // câu sau. Mắt mở là đủ để người ta biết nói tiếp được.
      if (!goi.conLai) {
        logger.info('MakerLab thức dậy, đợi lệnh', {
          deviceId: input.deviceId,
          khop: goi.khop,
          giay: persona.giayThucGiac,
        });
        timing.total = Date.now() - started;
        return { heard, said: '', actions: [], spoken: false, ms: timing };
      }
      // Cắt tên ra khỏi câu lệnh. Để nguyên "Odin đi tới đây" thì model
      // coi tên là một phần yêu cầu và hay chào lại thay vì đi.
      heard = goi.conLai;
    } else if (dangThuc(input.deviceId)) {
      // Đang trong cuộc nói chuyện — mỗi lượt đẩy hạn ra xa, nên không
      // phải gọi tên lại giữa chừng.
      moCong(input.deviceId, persona.giayThucGiac);
      henNguLai(input.deviceId, persona.giayThucGiac);
    } else {
      baoMat(input.deviceId, 'sleepy', 0);
      logger.info('MakerLab bỏ lượt: chưa gọi tên', {
        deviceId: input.deviceId,
        heard: heard.slice(0, 80),
        // `suyt` là chỗ bảng phiên âm lớn lên bằng dữ liệu thật: gọi mà
        // robot không dậy thì đọc dòng này, thấy Whisper chép thành gì,
        // rồi thêm thẳng chuỗi đó vào `PHIEN_AM_THEM` trong danhThuc.ts.
        suytTrung: goi.suyt || undefined,
        tuDanhThuc: persona.wakeWord,
      });
      timing.total = Date.now() - started;
      return { heard, said: '', actions: [], spoken: false, ms: timing };
    }
  }

  if (overDailyCap(input.deviceId)) {
    timing.total = Date.now() - started;
    return { heard, said: '', actions: [], spoken: false, ms: timing };
  }

  // ── Đổi chế độ tiếng: xử lý TRƯỚC mọi thứ khác ──
  //
  // Phải đứng trước cả lệnh nhanh lẫn LLM, vì câu "nói tiếng Anh đi" mà
  // rơi vào LLM thì model sẽ TRẢ LỜI về việc nói tiếng Anh thay vì ĐỔI
  // sang tiếng Anh — nghe rất giống nhau nhưng không có gì thay đổi cả.
  if (input.speak !== false) {
    const moi = khopDoiCheDo(heard);
    if (moi && moi !== persona.cheDo) {
      await luuCheDo(input.projectId, moi);
      const cf = CHE_DO[moi];
      // Đọc câu chào bằng ĐÚNG giọng của chế độ mới — đó là cách người
      // dùng biết lệnh đã ăn, không cần nhìn màn hình.
      const spokenDoi = await speakOnce(
        {
          ...persona,
          cheDo: moi,
          voiceId: cf.giong ?? persona.voiceId,
          // Đổi tên giọng mà quên nhà cung cấp = gửi `robot-walle` cho
          // Google. Nó không biết tên đó, hỏng, rơi xuống giọng dự
          // phòng — và người dùng nghe câu chào bằng giọng cũ nên tưởng
          // lệnh đổi chưa ăn.
          voiceProvider: cf.nhaCungCap ?? persona.voiceProvider,
        },
        cf.chaoDoi,
        input.deviceId,
      );
      timing.total = Date.now() - started;
      emitTranscript(input.deviceId, 'bot', cf.chaoDoi);
      logger.info('MakerLab đổi chế độ tiếng', {
        deviceId: input.deviceId,
        tu: persona.cheDo,
        sang: moi,
        heard,
      });
      return { heard, said: cf.chaoDoi, actions: [], spoken: spokenDoi, ms: timing };
    }

    /**
     * ── "Quên hết đi": xoá trí nhớ hội thoại ──
     *
     * ⚠️ VÁ ĐẦU VÀO KHÔNG XOÁ ĐƯỢC THỨ ĐÃ NẰM TRONG LỊCH SỬ.
     *
     * Bản 09:43 hôm nay ngăn không đưa số liệu thiết bị vào prompt nữa.
     * Nhưng robot VẪN đọc wifi ở cuối mỗi câu — vì 38 câu trả lời CŨ
     * trong lịch sử đều làm thế, và model giữ 30 lượt gần nhất làm ngữ
     * cảnh. Nó nhìn thấy chính nó làm thế 38 lần rồi cứ thế làm tiếp.
     *
     * Cùng cơ chế đã gây ra lỗi độ dài: model bắt chước cái nó THẤY, và
     * lịch sử cũng là thứ nó thấy. Sửa nguồn không hoàn tác được quá
     * khứ — phải xoá quá khứ.
     *
     * `clearHistory` đã có sẵn từ lâu nhưng KHÔNG route, KHÔNG nút — một
     * hàm không ai gọi tới được. Nay có ba đường: câu lệnh này, nút trên
     * web, và route admin.
     */
    if (khopQuenHet(heard)) {
      await clearHistory(input.deviceId);
      const cau = 'Rồi, tôi quên sạch rồi. Bắt đầu lại từ đầu nhé.';
      const noiDuoc = await speakOnce(persona, cau, input.deviceId);
      emitTranscript(input.deviceId, 'bot', cau);
      logger.info('MakerLab xoá trí nhớ theo lệnh giọng nói', { deviceId: input.deviceId });
      timing.total = Date.now() - started;
      return { heard, said: cau, actions: [], spoken: noiDuoc, ms: timing };
    }

    /**
     * ── Đổi BỘ TÍNH CÁCH bằng giọng nói ──
     *
     * Đặt ngay sau lệnh đổi tiếng và trước LLM, vì đúng lý do: câu "đổi
     * sang giọng nghiêm túc đi" mà rơi vào LLM thì model sẽ TRẢ LỜI về
     * việc nghiêm túc thay vì ĐỔI sang nghiêm túc.
     *
     * Chỉ chạy khi người dùng đã soạn ít nhất một bộ — chưa soạn thì
     * không có gì để đổi, và bắt khớp từ khoá trong kho rỗng chỉ tổ tốn
     * một phép so mỗi lượt.
     */
    if (persona.khoTinhCach) {
      const boMoi = khopDoiTinhCach(heard, persona.khoTinhCach);
      if (boMoi && boMoi !== persona.tinhCachDangDung) {
        await luuTinhCach(input.projectId, boMoi);
        const bo = persona.khoTinhCach[boMoi];
        const cau = bo.chaoDoi || `Rồi, tôi đổi sang ${bo.nhan}.`;
        const noiDuoc = await speakOnce(persona, cau, input.deviceId);
        emitTranscript(input.deviceId, 'bot', cau);
        logger.info('MakerLab đổi bộ tính cách', {
          deviceId: input.deviceId,
          tu: persona.tinhCachDangDung,
          sang: boMoi,
          heard,
        });
        timing.total = Date.now() - started;
        return { heard, said: cau, actions: [], spoken: noiDuoc, ms: timing };
      }
    }

    /**
     * ── Đổi KIỂU NÓI bằng giọng: phổ thông ↔ miền Trung ──
     *
     * Bắt trước khi vào LLM, cùng lý do với lệnh đổi tính cách ngay trên:
     * "nói giọng miền Trung đi" mà rơi vào LLM thì model sẽ TRẢ LỜI về
     * giọng miền Trung thay vì ĐỔI sang nói giọng đó.
     *
     * Chỉ có nghĩa trong tiếng Việt — ở chế độ EN thì "miền Trung" không
     * phải một lựa chọn, và bắt lệnh ở đó là bắt nhầm một câu kể chuyện.
     */
    if (persona.cheDo === 'vi') {
      const kieuMoi = khopDoiKieuNoi(heard);
      if (kieuMoi && kieuMoi !== persona.kieuNoi) {
        await luuKieuNoi(input.projectId, kieuMoi);
        const cau = CHAO_DOI_KIEU[kieuMoi];
        const noiDuoc = await speakOnce(persona, cau, input.deviceId);
        emitTranscript(input.deviceId, 'bot', cau);
        logger.info('MakerLab đổi kiểu nói', {
          deviceId: input.deviceId,
          tu: persona.kieuNoi,
          sang: kieuMoi,
          heard,
        });
        timing.total = Date.now() - started;
        return { heard, said: cau, actions: [], spoken: noiDuoc, ms: timing };
      }
    }

    /**
     * ── Nói LỆCH TIẾNG: hỏi lại thay vì đọc bừa ──
     *
     * Đang ở chế độ tiếng Anh mà người ta nói tiếng Việt (hoặc ngược
     * lại). Bản trước cứ thế trả lời và đọc lên, tức là bắt GIỌNG TIẾNG
     * ANH phát âm chữ tiếng Việt — nghe không ra chữ nào.
     *
     * Đứng ở đây, sau lệnh đổi tiếng và trước LLM, vì hai lý do:
     *   · sau lệnh đổi → "nói tiếng Việt đi" vẫn là LỆNH, không bị hiểu
     *     nhầm thành "đang nói lệch tiếng"
     *   · trước LLM   → không tốn một lượt gọi model cho câu mà ta biết
     *     trước là sẽ đọc không nghe được
     */
    const tiengDangBat = tiengCuaCheDo(persona.cheDo);
    const cho = (persona.traits as { choXacNhan?: ChoXacNhan } | null)?.choXacNhan ?? null;
    const dangCho = conHan(cho, Date.now()) ? cho : null;

    // Vừa hỏi xong mà người ta trả lời gọn "có"/"không" thì xử ngay,
    // đừng đưa vào LLM — model sẽ bàn luận về chữ "có" thay vì làm.
    if (dangCho) {
      const tl = khopCoKhong(heard);
      if (tl === 'co') {
        const sangCheDo: CheDo = dangCho.sang === 'vi' ? 'vi' : 'en';
        await luuCheDo(input.projectId, sangCheDo);
        await luuChoXacNhan(input.projectId, null);
        const cfMoi = CHE_DO[sangCheDo];
        const noiDuoc = await speakOnce(
          {
            ...persona,
            cheDo: sangCheDo,
            voiceId: cfMoi.giong ?? persona.voiceId,
            voiceProvider: cfMoi.nhaCungCap ?? persona.voiceProvider,
            language: cfMoi.ngonNgu ?? persona.language,
          },
          cfMoi.chaoDoi,
          input.deviceId,
        );
        emitTranscript(input.deviceId, 'bot', cfMoi.chaoDoi);
        logger.info('MakerLab đổi tiếng sau khi người dùng đồng ý', {
          deviceId: input.deviceId,
          sang: sangCheDo,
        });
        timing.total = Date.now() - started;
        return { heard, said: cfMoi.chaoDoi, actions: [], spoken: noiDuoc, ms: timing };
      }
      if (tl === 'khong') {
        await luuChoXacNhan(input.projectId, null);
        const cau = CAU.oLai[tiengDangBat];
        const noiDuoc = await speakOnce(persona, cau, input.deviceId);
        emitTranscript(input.deviceId, 'bot', cau);
        timing.total = Date.now() - started;
        return { heard, said: cau, actions: [], spoken: noiDuoc, ms: timing };
      }
    }

    const doDuoc = doTieng(heard, tiengWhisper);
    if (doDuoc.tieng && doDuoc.tieng !== tiengDangBat) {
      const lanThu = (dangCho?.nhac ?? 0) + 1;
      await luuChoXacNhan(input.projectId, {
        sang: doDuoc.tieng,
        luc: Date.now(),
        nhac: lanThu,
      });

      /**
       * Lần đầu thì HỎI. Những lần sau chỉ nhắc, và nhắc thưa.
       *
       * Nhắc mỗi lượt thì robot thành cái máy cằn nhằn — mà người bị cằn
       * nhằn nhiều nhất lại chính là người đang TẬP nói thứ tiếng đó,
       * tức đối tượng cần được để yên nhất.
       */
      const cau =
        lanThu === 1
          ? CAU.hoiDoi[tiengDangBat]
          : lanThu % NHAC_MOI === 0
            ? CAU.nhacNoiLai[tiengDangBat]
            : null;

      if (cau) {
        const noiDuoc = await speakOnce(persona, cau, input.deviceId);
        emitTranscript(input.deviceId, 'bot', cau);
        logger.info('MakerLab người dùng nói lệch tiếng', {
          deviceId: input.deviceId,
          dangBat: tiengDangBat,
          nghe: doDuoc.tieng,
          tiLe: Number(doDuoc.tiLe.toFixed(2)),
          soTu: doDuoc.soTu,
          lanThu,
        });
        timing.total = Date.now() - started;
        return { heard, said: cau, actions: [], spoken: noiDuoc, ms: timing };
      }

      // Lượt im lặng giữa hai lần nhắc: vẫn KHÔNG đưa vào LLM, vì câu
      // trả lời sẽ lại bị đọc bằng giọng sai tiếng. Báo cho web biết là
      // đã nghe, rồi thôi.
      logger.info('MakerLab bỏ lượt: nói lệch tiếng, chưa tới lượt nhắc', {
        deviceId: input.deviceId,
        dangBat: tiengDangBat,
        nghe: doDuoc.tieng,
        lanThu,
      });
      timing.total = Date.now() - started;
      return { heard, said: '', actions: [], spoken: false, ms: timing };
    }

    // Nói đúng tiếng rồi thì xoá lời hỏi còn treo — nếu không, một tiếng
    // "có" cho câu hỏi KHÁC ở lượt sau sẽ bị hiểu là đồng ý đổi tiếng.
    if (dangCho) await luuChoXacNhan(input.projectId, null);

    // ── Đổi NÃO: cũng phải đứng trước LLM, và vì đúng lý do như trên ──
    //
    // "đổi về model cũ đi" mà rơi vào LLM thì model sẽ NÓI VỀ việc đổi
    // model thay vì ĐỔI. Tệ hơn nữa: nếu não hiện tại đang là thứ người
    // ta muốn bỏ, câu trả lời đó lại do chính nó nói ra.
    const naoMoi = khopDoiNao(heard);
    if (naoMoi && naoMoi !== persona.nao) {
      await luuNao(input.projectId, naoMoi);
      const cau = CHAO_DOI_NAO[naoMoi];
      const spokenNao = await speakOnce(persona, cau, input.deviceId);
      timing.total = Date.now() - started;
      emitTranscript(input.deviceId, 'bot', cau);
      logger.info('MakerLab doi nao', {
        deviceId: input.deviceId,
        tu: persona.nao ?? '(theo cau hinh)',
        sang: naoMoi,
        heard,
      });
      return { heard, said: cau, actions: [], spoken: spokenNao, ms: timing };
    }
  }

  // ⚠️ LỆNH ĐƠN GIẢN THÌ ĐỪNG GỌI LLM.
  //
  // "Tăng âm lượng" đi trọn vòng STT → LLM → TTS mất 2,4 giây cho một
  // việc chỉ cần khớp chuỗi. Đo 12/08/2026: LLM chiếm ~1,5 giây trong đó
  // và không siết thêm được (model đã nhanh nhất trong bốn model ở cổng).
  // Bỏ hẳn nó cho nhóm lệnh này là cắt được đúng 1,5 giây, không phải
  // tối ưu vài phần trăm.
  //
  // Đặt SAU `loadPersona` để lời đáp vẫn đọc bằng giọng riêng, và SAU bộ
  // lọc "Whisper bịa" ở trên — nếu không thì một câu bịa có chứa "dừng
  // lại" sẽ thành lệnh thật.
  if (input.speak !== false) {
    const nhanh = khopLenhNhanh(heard);
    if (nhanh) {
      const t = Date.now();
      const spokenNhanh = await speakOnce(persona, nhanh.say, input.deviceId);
      timing.tts = Date.now() - t;
      timing.total = Date.now() - started;
      emitTranscript(input.deviceId, 'bot', nhanh.say);
      pushHistory(
        input.deviceId,
        { role: 'user', content: heard },
        { role: 'assistant', content: JSON.stringify({ say: nhanh.say, actions: nhanh.actions }) },
      );
      for (const a of nhanh.actions) await dispatchAction(input.deviceId, a);
      logger.info('MakerLab lệnh nhanh (bỏ qua LLM)', {
        deviceId: input.deviceId,
        heard,
        lenh: nhanh.actions[0]?.type,
        ms: timing.total,
      });
      return {
        heard,
        said: nhanh.say,
        actions: nhanh.actions,
        spoken: spokenNhanh,
        ms: timing,
      };
    }
  }
  // Số liệu mạng lấy từ gói telemetry gần nhất của bo. Không hỏi lại
  // thiết bị ở đây: người dùng đang chờ nghe tiếng, mà một lần hỏi-đáp
  // qua WebSocket rồi chờ trả lời là thêm cả giây vào độ trễ — trong khi
  // bo vẫn tự gửi số liệu mỗi giây.
  const tele = (device?.telemetry?.[0]?.payload ?? {}) as Record<string, unknown>;
  const soOrNull = (v: unknown) => (typeof v === 'number' ? v : null);
  const ctx = {
    deviceName: device?.name,
    battery: device?.batteryPct ?? null,
    ssid: typeof tele.ssid === 'string' ? tele.ssid : null,
    rssi: soOrNull(tele.rssi),
    pingMs: soOrNull(tele.pingMs),
  };
  // ── 1b. Tra internet, NẾU câu hỏi cần ──
  //
  // Chạy trước khi gọi model, không phải sau. Xem lý do dài trong
  // `web.ts`: cách chuẩn của ngành là để model tự gọi công cụ rồi gọi
  // model LẦN HAI kèm kết quả, mà một lượt gọi ở đây là 1,6 giây tới
  // chữ đầu tiên — người ta đang đứng chờ nghe tiếng.
  /**
   * Câu hỏi phụ thuộc NƠI CHỐN thì phải tra kèm nơi chốn.
   *
   * ⚠️ Người dùng báo 14/08/2026: hỏi "thời tiết thế nào", robot đáp "tôi
   * biết mình ở đâu rồi nhưng không biết thời tiết hiện tại".
   *
   * `canTraCuu` CÓ nhận chữ "thời tiết" nên nó vẫn tra web — nhưng tra
   * đúng nguyên văn câu hỏi, tức "thời tiết thế nào" trần trụi. Kết quả
   * về là mấy trang thời tiết chung chung, không có số cho nơi nào cả,
   * nên model đọc xong vẫn không có gì để nói.
   *
   * Vị trí nằm sẵn trong persona rồi; chỉ là chưa ai ghép nó vào câu tra.
   */
  const CAN_NOI_CHON =
    /\b(th[ờo]i ti[ếe]t|nhi[ệe]t đ[ộo]|m[ưu]a|n[ắa]ng|b[ãa]o|quanh đ[âa]y|g[ầa]n đ[âa]y|[ởo] đ[âa]y|ch[ỗo] n[àa]y)\b/i;
  function themViTri(cau: string, viTri: string | null): string {
    if (!viTri || !CAN_NOI_CHON.test(cau)) return cau;
    return `${cau} ${viTri}`;
  }

  let doanTraCuu = '';
  const kieuTra = canTraCuu(heard);
  if (kieuTra) {
    const t = Date.now();
    const muc =
      kieuTra === 'tim'
        ? await timTrenWeb(themViTri(heard, persona.viTri), 5)
        : await tinMoiNhat(8, kieuTra === 'tin-cong-nghe');
    doanTraCuu = dungDoanTraCuu(muc, kieuTra);
    logger.info('MakerLab tra internet', {
      deviceId: input.deviceId,
      kieu: kieuTra,
      soMuc: muc.length,
      ms: Date.now() - t,
    });
  }

  const t1 = Date.now();

  // ── 2+4. Vừa nghĩ vừa nói ──
  //
  // Trước đây hai bước này nối tiếp: đợi model viết XONG cả câu trả
  // lời, rồi mới đọc thành tiếng, rồi mới gửi. Đo trên robot thật:
  // người dùng chờ 4,5 giây mới nghe được chữ đầu tiên, mà 3 giây
  // trong đó chỉ là ngồi đợi model viết nốt những câu chưa ai cần
  // nghe vội.
  //
  // Giờ câu đầu tiên vừa xong là đọc và gửi ngay, phần sau chảy tiếp
  // trong lúc robot đang nói — giống cách người ta nói chuyện thật.
  let reply: RobotReply;
  let spoken = false;

  if (input.speak !== false) {
    const r = await thinkAndSpeak(persona, heard, input.deviceId, ctx, timing, doanTraCuu);
    reply = r.reply;
    spoken = r.spoken;
    timing.llm = r.llmMs;
  } else {
    reply = await think(persona, heard, input.deviceId, ctx, doanTraCuu);
    timing.llm = Date.now() - t1;
  }

  pushHistory(
    input.deviceId,
    { role: 'user', content: heard },
    { role: 'assistant', content: JSON.stringify({ say: reply.say, actions: reply.actions }) },
  );

  for (const action of reply.actions) {
    void dispatchAction(input.deviceId, action);
  }

  if (!spoken) emitTranscript(input.deviceId, 'bot', reply.say);

  timing.total = Date.now() - started;
  logger.info('MakerLab voice turn', {
    deviceId: input.deviceId,
    heard: heard.slice(0, 60),
    // Ghi cả độ dài tiếng của lượt ĐƯỢC NHẬN, không chỉ lượt bị loại.
    // Chỉ có log của bên được nhận mới cho biết ngưỡng đang cắt nhầm
    // vào đâu — bên bị loại thì đằng nào cũng đã bị loại.
    ...(input.pcm16 ? { giay: +(input.pcm16.length / 2 / PCM_SAMPLE_RATE).toFixed(2) } : {}),
    actions: reply.actions.length,
    ...timing,
  });

  return { heard, said: reply.say, actions: reply.actions, spoken, ms: timing };
}

/**
 * Nghĩ và nói cùng lúc: mỗi câu vừa viết xong là đọc thành tiếng và
 * gửi ngay xuống loa.
 *
 * Hỏng ở bất kỳ đâu thì lùi về đường cũ (nghĩ xong hết rồi mới nói).
 * Một con robot nói chậm vẫn tốt hơn một con robot câm, và đường mới
 * này có nhiều mắt xích hơn nên phải có chỗ lùi.
 */
/**
 * Đọc MỘT câu ngắn rồi đóng luồng. Dùng cho lệnh nhanh và tiếng đệm.
 *
 * Không gọi lại `thinkAndSpeak`: ở đây đã biết trước nguyên văn câu nói,
 * nên mọi thứ liên quan tới model — cắt câu, gom mẩu, chờ JSON — đều
 * thừa, mà mỗi thứ thừa là một chỗ chờ.
 */
async function speakOnce(
  persona: Awaited<ReturnType<typeof loadPersona>>,
  text: string,
  deviceId: number,
): Promise<boolean> {
  const gw = await import('../../socket/device.gateway.js');
  const seq = gw.speakStreamBegin(deviceId, PCM_SAMPLE_RATE);
  if (seq === null) return false;
  let spoken = false;
  try {
    if (persona.voiceProvider === 'cuongmini') {
      const { streamCuongMini } = await import('./tts.js');
      const byte = await streamCuongMini(
        text,
        { voice: persona.voiceId ?? undefined, speakingRate: persona.speechRate },
        async (pcm) => {
          const ok = await gw.speakStreamPushPcm(deviceId, pcm, seq);
          if (ok) spoken = true;
          return ok;
        },
      );
      if (byte > 0) return spoken;
    }
    const tts = await synthesizeSpeech(text, {
      provider: persona.voiceProvider as never,
      voice: persona.voiceId ?? undefined,
      language: persona.language,
      speakingRate: persona.speechRate,
    });
    spoken = await gw.speakStreamPush(deviceId, tts.audio, seq);
  } catch (e) {
    logger.warn('MakerLab speakOnce hỏng', { error: e instanceof Error ? e.message : String(e) });
  } finally {
    gw.speakStreamEnd(deviceId, seq, text);
  }
  return spoken;
}

/**
 * Vỏ xếp hàng cho đường nghĩ-và-nói.
 *
 * Robot là hạng ưu tiên cao nhất trên máy nhà (`hangDoi.ts`) nên gần như nó
 * luôn lấy được vé ngay. Hai chuyện vé này lo giúp:
 *
 *  1. Nó CHIẾM slot suốt lượt nói, nên một khách bấm chat giữa chừng bị đẩy
 *     ra cổng thay vì chen vào làm robot nghẹn.
 *  2. Lúc `tra()`, nó mở cửa sổ giữ chỗ 20 giây cho robot — đủ cho nhịp
 *     nghe → nghĩ → nói → nghe tiếp mà không ai cướp máy giữa hai lượt.
 *
 * Hết giờ chờ mà vẫn không có vé (máy nhà đang kẹt thật) thì `boQuaMayNha`
 * bỏ nó khỏi chuỗi và robot nói bằng cổng. Chậm hơn, nhưng nói được.
 */
async function thinkAndSpeak(
  persona: PersonaConfig,
  heard: string,
  deviceId: number,
  ctx: { deviceName?: string; battery?: number | null },
  timing: { tts: number },
  doanTraCuu = '',
): Promise<{ reply: RobotReply; spoken: boolean; llmMs: number }> {
  // Chỉ xin vé khi máy nhà thật sự là đích đến — hỏi hàng đợi trong lúc
  // robot đang ghim 'cong' là tự bịa ra một phép chờ vô nghĩa.
  const diMayNha = llmChain(persona.nao)[0]?.label === 'may-nha';
  const ve = diMayNha ? await xinSlot('robot') : null;
  if (ve && !ve.duoc) {
    logger.warn('MakerLab máy nhà kẹt, robot nói bằng cổng lượt này', {
      deviceId,
      lyDo: ve.lyDo,
      choMs: ve.choMs,
    });
  }
  try {
    return await thinkAndSpeakLoi(persona, heard, deviceId, ctx, timing, doanTraCuu, !!ve && !ve.duoc);
  } finally {
    // ⚠️ `finally`, không phải cuối thân hàm: đường này có `return` ở cả
    // nhánh thành công lẫn nhánh `catch`, bỏ sót một nhánh là rò slot.
    ve?.tra();
  }
}

async function thinkAndSpeakLoi(
  persona: PersonaConfig,
  heard: string,
  deviceId: number,
  ctx: { deviceName?: string; battery?: number | null },
  timing: { tts: number },
  doanTraCuu = '',
  boQuaMayNha = false,
): Promise<{ reply: RobotReply; spoken: boolean; llmMs: number }> {
  const started = Date.now();
  const gw = await import('../../socket/device.gateway.js');
  const { PCM_SAMPLE_RATE } = await import('./audio.js');

  const messages = await dungMessages(persona, ctx, deviceId, heard, doanTraCuu);

  const chain = llmChain(persona.nao, boQuaMayNha);
  const p = chain[0];
  const model = robotModel(p);

  let seq: number | null = null;
  let spoken = false;
  let firstAudioMs = 0;

  // TẦNG MIỆNG: chế độ tiếng Anh dùng giọng riêng của nó. Giọng nhân bản
  // của chủ là giọng VIỆT — bắt nó đọc tiếng Anh là quay lại đúng lỗi
  // "file → phi lê" vừa chữa xong, chỉ khác là cả câu đều sai.
  const giongCheDo = CHE_DO[persona.cheDo].giong ?? persona.voiceId;

  // ⚠️ GIỌNG RỖNG PHẢI KÊU NGAY, đừng đợi máy đọc báo lỗi.
  //
  // Hôm qua tôi đã thêm cảnh báo cho ca "voice not found", nhưng ca
  // "voiceId rỗng" lọt lưới — và nó chính là ca xảy ra hôm nay. Máy đọc
  // nhận `voice: undefined`, không có tên nào để tra, hỏng, rồi cả chuỗi
  // lặng lẽ rơi xuống giọng Google. Người dùng thấy ba triệu chứng rời
  // rạc mà không thấy nguyên nhân.
  if (persona.voiceProvider === 'cuongmini' && !giongCheDo) {
    logger.error(
      'MakerLab CHƯA CHỌN GIỌNG — persona dùng nhà cung cấp "cuongmini" nhưng voiceId trống. ' +
        'Robot sẽ nói bằng giọng dự phòng (nghe vấp, cắt khúc). ' +
        'Vào Maker Lab → Tính cách chọn lại giọng.',
      { deviceId, cheDo: persona.cheDo },
    );
  }

  /**
   * ============================================================
   * Tách việc SINH khỏi việc ĐẨY
   * ============================================================
   *
   * ⚠️ `await speakPiece()` TUẦN TỰ LÀ NGUỒN GỐC CỦA "ĐẦU TO, SAU NHỎ".
   *
   * Bản trước đẩy từng mẩu PCM xuống bo NGAY trong `onChunk`, và chờ bo
   * nhận xong mới chảy tiếp. Đệm bo chỉ 2 giây, nên đẩy một mẩu 16 giây
   * tiếng mất ~14 giây thật. Xong mới bắt đầu SINH mẩu sau, mất thêm ~4
   * giây — và suốt 4 giây đó bo không có gì để phát.
   *
   * Đo trên bo thật 13/08/2026, câu trả lời 1.127 chữ (~68 giây tiếng):
   *
   *     RƠI BYTE : 0                  ← không tràn
   *     ĐÓI ĐỆM  : 1 lần / 27.406 ms  ← đói suốt 27 giây
   *
   * Tức hơn một phần ba lượt nói là khoảng lặng. Người dùng nghe thành
   * "nói được một đoạn rồi nhỏ dần, giật".
   *
   * Máy đọc sinh nhanh gấp ~4 lần thời gian thực, nên nó THỪA SỨC chạy
   * trước. Cái chặn nó là phép chờ ở `onChunk`. Bỏ phép chờ đó ra:
   * `onChunk` chỉ NỐI việc đẩy vào một chuỗi rồi trả về ngay, còn máy
   * đọc cứ chảy hết tốc lực vào bộ nhớ máy chủ.
   *
   * Chuỗi giữ ĐÚNG THỨ TỰ — tiếng mà đảo mẩu thì còn tệ hơn im lặng.
   *
   * Cái giá: PCM nằm tạm trong bộ nhớ VPS. Một lượt dài nhất (trần 180
   * giây tiếng) là ~5,7 MB — không đáng kể, và nó đổi lấy việc bo không
   * bao giờ phải ngồi chờ.
   */
  let chuoiDay: Promise<boolean> = Promise.resolve(true);
  const noiVaoChuoi = (pcm: Buffer) => {
    chuoiDay = chuoiDay.then(async (con) => {
      if (!con || seq === null) return false;
      const ok = await gw.speakStreamPushPcm(deviceId, pcm, seq as number);
      if (ok && !firstAudioMs) firstAudioMs = Date.now() - started;
      if (ok) spoken = true;
      return ok;
    });
  };

  const speakPiece = async (piece: string) => {
    if (seq === null) return;
    const t = Date.now();

    // ── Đường LUỒNG, chỉ cho giọng tự dựng ──
    //
    // Chuyển tiếp từng mẩu PCM xuống bo NGAY khi máy nhà sinh ra, thay vì
    // đợi cả đoạn xong. Đo 12/08: byte đầu tiên về sau 105 ms thay vì
    // 3.500 ms, và tiếng chảy nhanh gấp 3,5 lần tốc độ phát — đệm của bo
    // không còn lý do gì để cạn.
    //
    // Hỏng thì rơi xuống đường thường ngay dưới: máy ở nhà có thể đang
    // tắt, và robot mất giọng riêng vẫn hơn robot câm.
    if (persona.voiceProvider === 'cuongmini') {
      try {
        const { streamCuongMini } = await import('./tts.js');
        const byte = await streamCuongMini(
          piece,
          {
            voice: giongCheDo ?? undefined,
            speakingRate: persona.speechRate,
            // Chế độ tiếng Anh KHÔNG phiên âm: ở đó chính tả gốc mới
            // đúng, đổi "deploy" thành "đi-pờ-loi" là biến nó thành từ vô
            // nghĩa với máy đọc tiếng Anh.
            phienAm: CHE_DO[persona.cheDo].phienAm,
          },
          async (pcm) => {
            // Trả `true` NGAY, không chờ bo. Máy đọc cứ chảy hết tốc
            // lực; việc đẩy xuống bo đi theo chuỗi riêng, đúng thứ tự.
            noiVaoChuoi(pcm);
            return true;
          },
        );
        if (byte > 0) {
          timing.tts += Date.now() - t;
          return;
        }
      } catch (err) {
        // ⚠️ TỤT HẠNG THÌ PHẢI KÊU TO, không được lặng lẽ.
        //
        // 12/08/2026: người dùng xoá giọng nhân bản mà robot đang dùng
        // (`Linh Linh 123`). VieNeu ném `Voice not found`, dòng này ghi
        // `warn`, rồi cả chuỗi lặng lẽ rơi xuống giọng Google miễn phí —
        // thứ cắt văn bản thành mẩu ~200 ký tự rồi dán lại, nghe vấp
        // liên tục. Người dùng báo "robot nói lắp", và tôi đi đo đệm,
        // đo DMA, đo chỗ nối mẩu — ba vòng, đều sai chỗ, vì mọi số đo
        // đều lấy trên đường VieNeu mà đường đó không còn ai đi qua.
        //
        // Một lần tụt hạng âm thầm tốn nhiều giờ hơn hẳn một lỗi ồn ào.
        const li = err instanceof Error ? err.message : String(err);
        const mat = /not found|404|500/i.test(li);
        logger[mat ? 'error' : 'warn'](
          mat
            ? `MakerLab GIỌNG RIÊNG KHÔNG DÙNG ĐƯỢC — persona đang trỏ vào "${
                persona.voiceId ?? '(trống)'
              }" mà máy đọc không có giọng đó. Robot sẽ nói bằng giọng dự phòng (nghe vấp, cắt khúc). Vào Maker Lab → Tính cách để chọn lại giọng. Chi tiết: ${li}`
            : `MakerLab luồng tiếng hỏng, rơi về đường thường: ${li}`,
        );
      }
    }

    const tts = await synthesizeSpeech(piece, {
      provider: persona.voiceProvider as never,
      voice: persona.voiceId ?? undefined,
      language: persona.language,
      speakingRate: persona.speechRate,
    });
    timing.tts += Date.now() - t;
    const ok = await gw.speakStreamPush(deviceId, tts.audio, seq);
    if (ok) {
      spoken = true;
      if (!firstAudioMs) firstAudioMs = Date.now() - started;
    }
  };

  // Để NGOÀI `try`: chỗ lùi bên dưới cần biết model đã nói tới đâu, nếu
  // không nó sẽ hỏi lại model từ đầu và đọc một câu trả lời KHÁC chồng
  // lên phần đã nói.
  let raw = '';
  let emitted = 0;

  try {
    if (noJsonMode.has(model)) throw new Error('model không nhận json_object — dùng đường cũ');

    const stream = await clientFor(p).chat.completions.create({
      model,
      messages,
      temperature: persona.temperature,
      max_tokens: persona.maxTokens,
      response_format: { type: 'json_object' },
      stream: true,
    });

    /**
     * Gom câu trước khi gọi TTS — xem ghi chú dài ở vòng lặp dưới.
     *
     * 150 ký tự ≈ 10 giây tiếng: đủ dài để mối nối thưa hẳn, mà vẫn đủ
     * ngắn để mẩu tiếp theo kịp về trước khi bo phát hết mẩu trước.
     */
    // 150 → 400. Mỗi mẩu TTS là một mối nối, và đo trên bo thật cho
    // thấy mối nối MỚI là thứ nghe thành "giật", chứ không phải đói đệm
    // (`hut dem 0 lan / 0 ms` ở mọi lượt, kể cả lượt 20 giây). Gom dài
    // hơn ⇒ ít mối nối hơn. Mẩu ĐẦU vẫn gửi ngay khi có một câu nên độ
    // trễ mở miệng không đổi; chỉ các mẩu sau mới gom, và lúc đó bo
    // đang bận phát mẩu đầu nên có thừa thời gian.
    // 400 → 220. Con số này phải cân hai thứ NGƯỢC NHAU, và cán cân đã
    // đổi khi robot chuyển sang đọc bằng máy ở nhà:
    //
    //   gom DÀI  → ít mối nối, nghe liền mạch — nhưng mẩu sau về muộn
    //   gom NGẮN → mẩu về đều, không đói đệm — nhưng nhiều mối nối
    //
    // Hồi dùng Google, TTS mất ~1,2 giây mỗi mẩu nên gom dài là đúng:
    // mối nối là vấn đề duy nhất. Giờ qua đường hầm về máy nhà, TTS mất
    // 3,2-3,7 giây, và bo phát hết mẩu trước khi mẩu sau về — đo được
    // `hut dem 2 lan / 2052 ms` trong một lượt 10 giây.
    //
    // 220 ký tự ≈ 14 giây tiếng, vẫn đủ dài để mối nối thưa, mà mẩu về
    // sớm hơn gần một giây so với 400.
    /**
     * ⚠️ CỠ MẨU PHẢI THEO MÁY ĐỌC, KHÔNG PHẢI MỘT SỐ CHUNG.
     *
     * 220 được chỉnh cho VieNeu, thứ sinh THEO LUỒNG: byte đầu về sau
     * ~165 ms bất kể đoạn dài bao nhiêu, nên gom to chỉ có lợi (ít mối
     * nối hơn) mà không tốn gì.
     *
     * Chatterbox thì ngược hẳn — nó làm xong CẢ ĐOẠN rồi mới trả byte
     * đầu. Đo thật: 120 ký tự → 3,7 giây; 220 → 7,1 giây; 320 → 9,4
     * giây. Gom to ở đây là tự cộng thẳng vào độ trễ mở miệng, và vượt
     * hạn chờ thì cả mẩu bị vứt, tụt xuống giọng Google đọc tiếng Anh
     * bằng âm tiếng Việt — đúng lỗi người dùng gặp: "nói được một hai
     * câu là nó nhảy về giọng Google".
     *
     * 120 ký tự cho ~7,3 giây tiếng trong 3,7 giây sinh, tức bo phát
     * gần gấp đôi thời gian máy cần cho mẩu sau. Thừa chỗ.
     */
    /**
     * Cỡ mẩu TĂNG DẦN, không phải một con số cố định.
     *
     * ⚠️ MẨU ĐẦU NHỎ LÀM MIỆNG MỞ SỚM, NHƯNG ĐỂ LẠI MỘT CÁI HỐ NGAY SAU NÓ.
     *
     * Đo trên bo thật 13/08/2026, chế độ tiếng Anh:
     *
     *   mẩu 60 ký tự   → sinh 2,3 s, ra 3,6 s tiếng
     *   mẩu 120 ký tự  → sinh 3,7 s, ra 7,3 s tiếng
     *
     * Bo phát ngay khi có mẩu đầu. Nó phát hết 3,6 giây, mà mẩu thứ hai
     * phải 3,7 giây mới sinh xong ⇒ đệm CẠN trước khi mẩu sau về. Bộ đếm
     * trên bo báo `1 lần / 10.677 ms` — nằm cạn suốt mười giây, tai nghe
     * thành "giật giật và nhỏ đi ngay giữa câu".
     *
     * Bản sáng nay làm mẩu đầu nhỏ lại để mở miệng sớm hơn, và đã đổi
     * một lỗi lấy một lỗi khác.
     *
     * Luật đúng: mỗi mẩu phải sinh xong TRƯỚC KHI bo phát hết mẩu trước
     * nó. Mẩu đầu nhỏ thì mẩu thứ hai cũng phải nhỏ theo, rồi mới nới
     * dần khi đệm đã dày.
     *
     *   mẩu 2  ~90 ký tự  → sinh 2,9 s < 3,6 s bo đang phát  ✓
     *   mẩu 3+ nới dần    → ít mối nối hơn, mà đệm đã đủ dày để chịu
     *
     * Chế độ tiếng Việt KHÔNG cần chuyện này: VieNeu sinh theo luồng,
     * byte đầu về sau ~165 ms bất kể mẩu dài bao nhiêu, nên gom to chỉ
     * có lợi.
     */
    /**
     * Luật rút từ số đo, không phải một bảng số đoán sẵn.
     *
     * Gọi a1 = thời lượng tiếng của mẩu trước, g2 = thời gian sinh mẩu
     * sau. Bo bắt đầu phát mẩu trước ĐÚNG LÚC máy chủ bắt đầu sinh mẩu
     * sau (vì mẩu sau chỉ được gửi đi sau khi mẩu trước sinh xong). Nên
     * điều kiện không đói đệm là:
     *
     *     a1 ≥ g2
     *
     * Chatterbox đo được sinh ở ~0,5× thời gian thực (2,3 s cho 3,6 s
     * tiếng; 3,7 s cho 7,3 s tiếng), tức g2 ≈ 0,5 × a2. Thay vào:
     *
     *     a1 ≥ 0,5 × a2   ⟺   a2 ≤ 2 × a1
     *
     * Mẩu sau được phép DÀI GẤP ĐÔI mẩu trước, không hơn. Tính theo ký
     * tự vì thời lượng tỉ lệ với số ký tự.
     *
     * Một bảng số cố định thì không chịu được mẩu đầu ngắn: mẩu đầu cắt
     * ở mệnh đề nên có khi chỉ 22 ký tự, và lúc đó 90 đã là gấp bốn.
     * Luật nhân đôi tự co theo.
     *
     * Trần 260: quá đó thì mối nối thưa tới mức không còn cải thiện gì,
     * mà một mẩu hỏng lại mất nhiều tiếng hơn.
     */
    const TRAN_MAU = 260;
    let mauTruoc = 0;
    const gomToiThieu = () => (mauTruoc ? Math.min(mauTruoc * 2, TRAN_MAU) : TRAN_MAU);
    const cho: string[] = [];
    let daGuiMauDau = false;

    for await (const chunk of stream) {
      raw += chunk.choices[0]?.delta?.content ?? '';
      const say = partialSay(raw);
      if (say.length <= emitted) continue;

      const { sentences, consumed } = takeSentences(say, emitted, !daGuiMauDau);
      if (!sentences.length) continue;

      if (seq === null) {
        seq = gw.speakStreamBegin(deviceId, PCM_SAMPLE_RATE);
        if (seq === null) break; // bo rớt mạng giữa chừng
      }

      // ⚠️ GOM CÂU LẠI, đừng gọi TTS từng câu một.
      //
      // Bản trước làm `for (const s of sentences) await speakPiece(s)`
      // — mỗi câu một lần gọi TTS. Câu trả lời bốn câu thành bốn đoạn
      // tiếng ghép lại, mà mỗi đoạn TTS trả về đều có khoảng lặng đệm
      // ở đầu và cuối. Ghép bốn đoạn là có bốn cặp khoảng lặng chen
      // vào giữa lời nói.
      //
      // Người nghe gọi đó là "giật giật", nhưng nó KHÔNG phải đói đệm:
      // log của bo cho `hut dem 0 lan / 0 ms` ở mọi lượt, kể cả lượt
      // dài 19 giây. Đo trước rồi mới biết vá đúng chỗ — bản vá ghìm
      // nhịp sáng nay chữa đúng bệnh khác.
      //
      // Cách gom: mẩu ĐẦU gửi ngay khi có một câu, để tiếng ra sớm và
      // độ trễ đối đáp không đổi. Từ mẩu thứ hai trở đi mới gom cho đủ
      // dài — lúc đó bo đang phát mẩu đầu nên có thời gian, và ít mối
      // nối hơn nghĩa là nghe liền mạch hơn.
      for (const s of sentences) {
        cho.push(s);
        const dai = cho.join(' ').length;
        if (!daGuiMauDau || dai >= gomToiThieu()) {
          const mau = cho.join(' ');
          // Mốc đo: MẨU ĐẦU rời khỏi model lúc nào. Không có mốc này thì
          // `firstAudioMs` là một cục 3,8-9,0 giây không tách được — phần
          // nào của nó là model nghĩ, phần nào là máy đọc sinh.
          if (!daGuiMauDau) {
            logger.info('MakerLab mẩu đầu rời model', {
              deviceId,
              ms: Date.now() - started,
              soChu: mau.length,
            });
          }
          await speakPiece(mau);
          cho.length = 0;
          daGuiMauDau = true;
          // Chế độ Việt sinh theo luồng nên không có ràng buộc này —
          // giữ nguyên cách gom to như cũ.
          mauTruoc = persona.cheDo === 'vi' ? TRAN_MAU : mau.length;
        }
      }
      emitted += consumed;
    }

    const parsed = parseRobotReply(raw);
    if (!parsed.say) throw new Error('model trả về rỗng');

    // ⚠️ MỘT mẩu cuối, không phải hai.
    //
    // Bản trước gọi TTS hai lần liền nhau ở đây: một lần cho phần đang
    // chờ gom, rồi ngay sau đó một lần nữa cho phần đuôi chưa có dấu
    // kết câu. Mỗi lần gọi TTS trả về một đoạn tiếng có khoảng lặng đệm
    // ở hai đầu, nên hai lần liền nhau là nhét hai mối nối vào đúng vài
    // giây cuối của câu trả lời.
    //
    // User báo đúng chỗ đó: "câu dài vẫn bị vấp ở CUỐI". Càng dài thì
    // càng dễ còn dư cả hai phần, nên câu ngắn không thấy mà câu dài
    // thì lần nào cũng thấy.
    const tail = parsed.say.slice(emitted).trim();
    const conLai = [...cho, tail].filter(Boolean).join(' ');
    cho.length = 0;
    if (conLai) {
      if (seq === null) seq = gw.speakStreamBegin(deviceId, PCM_SAMPLE_RATE);
      if (seq !== null) await speakPiece(conLai);
    }

    // ⚠️ CHỜ CHUỖI ĐẨY XONG RỒI MỚI BÁO HẾT LƯỢT.
    //
    // Từ khi việc đẩy tách khỏi việc sinh, `speakPiece` trả về lúc máy
    // đọc sinh xong — chứ KHÔNG phải lúc bo nhận xong. Báo `say_end`
    // ngay lúc đó là cắt cụt đuôi câu, và bo còn coi mọi byte tới sau
    // `say_end` là của lượt SAU nên nó vứt luôn.
    await chuoiDay;
    if (seq !== null) gw.speakStreamEnd(deviceId, seq, parsed.say);
    // Ghi luôn ĐUÔI câu và số token ra: đó là hai thứ phân biệt được
    // "model bị cắt ở trần token" với "tiếng bị cắt lúc phát". Không có
    // hai con số này thì cả hai trông giống hệt nhau từ phía người nghe.
    const tailChar = parsed.say.slice(-1);
    logger.info('MakerLab nghĩ-và-nói', {
      deviceId,
      provider: p.label,
      model,
      firstAudioMs,
      totalMs: Date.now() - started,
      chuCuoi: tailChar,
      tronCau: /[.!?…"')\]]/.test(tailChar),
      soChu: parsed.say.length,
      daDoc: emitted,
    });
    return { reply: parsed, spoken, llmMs: Date.now() - started };
  } catch (err) {
    // Chỉ đánh dấu khi model KHÔNG nói được câu nào. Hỏng giữa chừng sau
    // khi đã phát tiếng là chuyện khác — mạng chớp một cái chẳng hạn —
    // và đánh dấu chết vì thế là bỏ qua máy nhà oan trong cả phút.
    if (!spoken) baoNhaHong(p.label, err);
    logger.warn('MakerLab đường nghĩ-và-nói hỏng, lùi về đường cũ', {
      deviceId,
      provider: p.label,
      error: err instanceof Error ? err.message : String(err),
    });
    if (seq !== null) gw.speakStreamEnd(deviceId, seq);

    /**
     * ⚠️ ĐÃ NÓI ĐƯỢC MỘT PHẦN THÌ TUYỆT ĐỐI KHÔNG HỎI LẠI MODEL.
     *
     * Bản trước rơi thẳng vào `think()` — một lượt gọi LLM MỚI, ra một
     * câu trả lời KHÁC — rồi đọc TOÀN BỘ câu mới đó. Người nghe nhận
     * được: hai câu đầu của câu trả lời A, rồi nguyên một câu trả lời B
     * bằng giọng khác. Người dùng mô tả đúng như thế: "nghe được 2 câu
     * đầu, mấy câu sau nó tự chuyển giọng".
     *
     * Và nó còn tự làm mình chậm thêm: cùng một nội dung bị sinh tiếng
     * HAI LẦN trên một mô hình chỉ chạy được một lượt tại một thời điểm.
     * Log máy đọc ghi rõ cặp `job Anh: 12.96s` / `Anh: 12.96s` cách nhau
     * bảy giây, và lượt nào cũng leo lên 45-49 giây.
     *
     * Đúng việc phải làm: đọc NỐT phần còn lại của chính câu trả lời
     * đang dở. Không còn gì để đọc thì dừng — nói cụt vẫn hơn nói sang
     * chuyện khác.
     */
    if (spoken) {
      const daCo = parseRobotReply(raw);
      const conLai = (daCo.say || '').slice(emitted).trim();
      if (conLai) {
        try {
          const t = Date.now();
          const tts = await synthesizeSpeech(conLai, {
            provider: persona.voiceProvider as never,
            voice: persona.voiceId ?? undefined,
            language: persona.language,
            speakingRate: persona.speechRate,
          });
          timing.tts += Date.now() - t;
          await gw.speakOnDevice(deviceId, tts.audio, { mime: tts.mime, text: conLai });
        } catch {
          /* nói cụt còn hơn nói sang chuyện khác */
        }
      }
      return { reply: daCo, spoken, llmMs: Date.now() - started };
    }

    const reply = await think(persona, heard, deviceId, ctx);
    if (reply.say) {
      try {
        const t = Date.now();
        const tts = await synthesizeSpeech(reply.say, {
          provider: persona.voiceProvider as never,
          voice: persona.voiceId ?? undefined,
          language: persona.language,
        });
        timing.tts += Date.now() - t;
        spoken = await gw.speakOnDevice(deviceId, tts.audio, {
          mime: tts.mime,
          text: reply.say,
        });
      } catch {
        /* câm nốt thì đành chịu — transcript vẫn lên console */
      }
    }
    return { reply, spoken, llmMs: Date.now() - started };
  }
}

// ─── Đọc câu ra khỏi dòng JSON đang chảy ───────────────────
/**
 * Model trả về `{"say":"...","actions":[...]}`. Khi đang chảy theo
 * dòng thì ta chỉ có JSON dở dang, chưa `JSON.parse` được — nhưng
 * trường `say` đứng đầu nên moi được nó ra sớm.
 *
 * Vì sao đáng làm: thời gian sinh chữ tỉ lệ với SỐ CHỮ SINH RA. Đợi
 * model viết xong cả đoạn rồi mới nói là bắt người dùng chờ luôn cả
 * những câu họ chưa cần nghe. Đo trên robot thật: 3031 ms cho một câu
 * trả lời, mà câu ĐẦU TIÊN đã xong sau chưa tới 1 giây.
 */
function partialSay(raw: string): string {
  const m = raw.match(/"say"\s*:\s*"((?:[^"\\]|\\.)*)/);
  if (!m) return '';
  // Bỏ dấu gạch chéo lẻ ở cuối — nó là nửa đầu của một chuỗi thoát bị
  // cắt giữa chừng, để nguyên thì JSON.parse ném lỗi.
  const body = m[1].replace(/\\$/, '');
  try {
    return JSON.parse(`"${body}"`) as string;
  } catch {
    return '';
  }
}

/**
 * Cắt phần chữ mới thành câu trọn vẹn.
 *
 * Chỉ cắt ở dấu kết câu CÓ khoảng trắng theo sau, để "3.5 giây" hay
 * "gpt-5.4-mini" không bị xé đôi giữa con số.
 */
function takeSentences(
  text: string,
  from: number,
  mauDau = false,
): { sentences: string[]; consumed: number } {
  const rest = text.slice(from);
  const out: string[] = [];
  let consumed = 0;
  const re = /[.!?…]+["')\]]*(\s+|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rest))) {
    const end = m.index + m[0].length;
    const piece = rest.slice(consumed, end).trim();
    if (piece.length >= 2) {
      out.push(piece);
      consumed = end;
    }
  }

  /**
   * MẨU ĐẦU TIÊN được cắt ở DẤU PHẨY, không đợi hết câu.
   *
   * ⚠️ ĐÂY LÀ ĐÒN DUY NHẤT CÒN LẠI CHO ĐỘ TRỄ MỞ MIỆNG, VÌ MODEL VÔ CAN.
   *
   * Đo 13/08/2026 trên chính LLM máy nhà, đúng kiểu production gọi
   * (streaming + json_object), ba vòng:
   *
   *   chữ đầu 99-316 ms · CÂU đầu 272-569 ms · trọn câu trả lời 396-965 ms
   *
   * Model ra trọn một câu trong DƯỚI 0,6 giây. Mà robot mất 9,1-9,5 giây
   * mới phát ra tiếng. Toàn bộ phần chênh nằm ở máy đọc sinh mẩu đầu.
   *
   * Mà thời gian sinh tỉ lệ với ĐỘ DÀI mẩu: 40 ký tự → 1,7 giây; 120 →
   * 3,7 giây. Nên mẩu đầu càng ngắn thì miệng càng mở sớm, và phần còn
   * lại vẫn kịp về vì bo đang bận phát mẩu đầu.
   *
   * Chỉ áp cho mẩu ĐẦU. Cắt ở dấu phẩy suốt lượt thì nhiều mối nối, và
   * mối nối mới là thứ nghe thành "giật" — bài học đã trả giá rồi.
   */
  if (mauDau && !out.length) {
    // Ưu tiên cắt ở ranh giới mệnh đề gần nhất trong tầm — nghe tự nhiên
    // hơn hẳn cắt giữa chừng.
    const NGAN_NHAT = 22;
    const DAI_NHAT = 60;
    let cat = -1;
    const re2 = /[,;:—–]\s/g;
    let m2: RegExpExecArray | null;
    while ((m2 = re2.exec(rest))) {
      if (m2.index + 1 >= NGAN_NHAT && m2.index + 1 <= DAI_NHAT) cat = m2.index + 1;
      if (m2.index + 1 > DAI_NHAT) break;
    }
    // Không có ranh giới nào thì cắt ở KHOẢNG TRẮNG cuối cùng trong tầm.
    // Chỗ cắt hơi lửng, nhưng nó chỉ là mẩu ĐẦU và đổi lại là miệng mở
    // sớm hơn nhiều giây — người nghe nhận ra quãng im, không nhận ra
    // một dấu phẩy thiếu.
    if (cat < 0 && rest.length >= DAI_NHAT) {
      const sp = rest.lastIndexOf(' ', DAI_NHAT);
      if (sp >= NGAN_NHAT) cat = sp;
    }
    if (cat >= NGAN_NHAT) {
      const piece = rest.slice(0, cat).trim();
      if (piece.length >= NGAN_NHAT) return { sentences: [piece], consumed: cat };
    }
  }

  return { sentences: out, consumed };
}

/** Model nào không nhận `response_format` thì hỏi lại lần nữa, bỏ trường đó. */
type ChatArgs = {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature: number;
  max_tokens: number;
};

const noJsonMode = new Set<string>();

async function withJsonFallback(client: OpenAI, args: ChatArgs) {
  if (!noJsonMode.has(args.model)) {
    try {
      return await client.chat.completions.create({
        ...args,
        response_format: { type: 'json_object' },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const looksUnsupported = /response_format|400|invalid|unsupported/i.test(msg);
      if (!looksUnsupported) throw err;
      // Nhớ lại để lượt sau khỏi tốn thêm một vòng gọi hỏng.
      noJsonMode.add(args.model);
      logger.info('MakerLab model không nhận json_object, chuyển sang hỏi thường', {
        model: args.model,
      });
    }
  }
  return client.chat.completions.create(args);
}

async function think(
  persona: PersonaConfig,
  heard: string,
  deviceId: number,
  ctx: { deviceName?: string; battery?: number | null },
  doanTraCuu = '',
): Promise<RobotReply> {
  const messages = await dungMessages(persona, ctx, deviceId, heard, doanTraCuu);

  // Thử nhà chính, hỏng thì tụt xuống nhà dự phòng. Không lặp lại
  // trên cùng một nhà: đây là đường thời gian thực, thà trả lời câu
  // đỡ hay còn hơn để người dùng ngồi chờ thêm hai giây nữa.
  for (const p of llmChain(persona.nao)) {
    const model = robotModel(p);
    // Máy nhà chỉ có MỘT luồng. Xin vé trước; không có vé thì bỏ qua nó và
    // đi thẳng nhà kế tiếp trong chuỗi, chứ đừng ngồi chờ (xem `hangDoi.ts`).
    const ve = p.label === 'may-nha' ? await xinSlot('robot') : null;
    if (ve && !ve.duoc) continue;
    try {
      // `response_format: json_object` là thứ ĐẦU TIÊN vỡ khi đổi model.
      // Cổng gộp nhiều nhà: model OpenAI hiểu trường này, model Claude
      // hay DeepSeek đi qua tuyến tương thích thì có nhà trả 400. Đổi
      // model xong robot câm mà log chỉ nói "HTTP 400" là mất cả buổi.
      // Nên hỏng vì trường này thì bỏ nó ra hỏi lại — parseRobotReply
      // vốn đã tự vớt được JSON lẫn trong văn xuôi.
      const res = await withJsonFallback(clientFor(p), {
        model,
        messages,
        temperature: persona.temperature,
        max_tokens: persona.maxTokens,
      });
      const raw = res.choices[0]?.message?.content ?? '';
      const parsed = parseRobotReply(raw);
      if (parsed.say) {
        const u = res.usage;
        logger.info('MakerLab LLM ok', {
          deviceId,
          provider: p.label,
          model,
          inTok: u?.prompt_tokens ?? 0,
          outTok: u?.completion_tokens ?? 0,
        });
        return parsed;
      }
    } catch (err) {
      baoNhaHong(p.label, err);
      logger.warn('MakerLab LLM failed', {
        deviceId,
        provider: p.label,
        model,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      ve?.tra();
    }
  }

  // Fail-soft: say something in character rather than nothing at all.
  return {
    say: 'Tôi nghe không rõ, nói lại giúp tôi được không.',
    actions: [{ type: 'face', payload: { emotion: 'confused', ms: 2000 } }],
  };
}

/**
 * Ghi lệnh vào sổ (để console thấy) rồi đẩy xuống bo.
 *
 * Trừ nhạc: `play_music` và `stop_music` do SERVER làm, không đẩy
 * xuống bo. Bo không biết đường ra Internet lấy file, cũng không có
 * chỗ chứa một bài bốn phút — server tải, đổi mã, rồi rót xuống theo
 * đúng đường tiếng đang dùng để nói.
 */
async function dispatchAction(deviceId: number, action: ValidatedCommand): Promise<void> {
  if (action.type === 'play_music' || action.type === 'stop_music') {
    try {
      const music = await import('./music.js');
      if (action.type === 'stop_music') {
        const had = music.stopMusicOn(deviceId);
        logger.info('MakerLab tắt nhạc', { deviceId, dangPhat: had });
      } else {
        const q = String((action.payload as { query?: unknown }).query ?? '');
        const note = await music.playMusicOn(deviceId, q);
        logger.info('MakerLab bật nhạc', { deviceId, query: q, note });
      }
    } catch (err) {
      logger.warn('MakerLab lệnh nhạc hỏng', {
        deviceId,
        type: action.type,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    return;
  }

  try {
    const row = await prisma.makerCommand.create({
      data: {
        deviceId,
        type: action.type,
        payload: action.payload as object,
        issuedById: null, // authored by the robot itself
      },
    });
    const { pushCommand } = await import('../../socket/device.gateway.js');
    pushCommand(deviceId, { id: row.id, type: row.type, payload: row.payload });
  } catch (err) {
    logger.warn('MakerLab action dispatch failed', {
      deviceId,
      type: action.type,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

function emitTranscript(deviceId: number, role: 'user' | 'bot', text: string): void {
  if (!text) return;
  void import('../../socket/messaging.socket.js')
    .then(({ getIO }) => {
      getIO()
        ?.to(`maker:device:${deviceId}`)
        .emit('maker:device:transcript', {
          deviceId,
          role,
          text,
          at: new Date().toISOString(),
        });
    })
    .catch(() => undefined);
}
