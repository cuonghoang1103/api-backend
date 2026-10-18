/**
 * ============================================================
 * TÓM TẮT LƯỢT ĐÃ BỎ — agent quên ít hơn khi hội thoại chạm trần
 * ============================================================
 *
 * `catCu.ts` bỏ hẳn những lượt cũ nhất khi hội thoại vượt 600k ký tự. Agent làm
 * tiếp được, nhưng QUÊN sạch phần đó — kể cả đề bài gốc và những câu dặn kiểu
 * "đừng sửa file X". Người dùng thấy trên app: "↺3 · agent KHÔNG còn nhớ phần đó"
 * (02/10/2026, xin "nâng cấp để tôi dùng không gián đoạn").
 *
 * File này đổi "quên sạch" thành "nhớ đại ý":
 *   1. GHIM tin nhắn ĐẦU TIÊN của người dùng (thường là đề bài) — không bao giờ mất.
 *   2. TÓM TẮT các lượt bị bỏ thành một bản ghi: mục tiêu, ràng buộc, quyết định,
 *      file đã sửa, việc còn dở.
 *
 * ─── 18/10/2026: TÓM TẮT BẰNG CHÍNH MODEL CỦA CUỘC ───
 * Trước đây dùng model RẺ (`cv_parse`). Bản ghi nhớ là thứ DUY NHẤT agent còn về
 * phần đã bỏ, nên model rẻ = agent quên chi tiết. Nay `turn.ts` và `/agent/compact`
 * truyền `goi` = lời gọi bằng đúng model người dùng đang dùng (`goiTomTatBangModel`).
 * Khoá đệm có thêm MÃ model ⇒ đổi model là tóm tắt lại, không lẫn bản cũ.
 * Không truyền `goi` (lời gọi cũ) ⇒ đường model rẻ như trước.
 *
 * ─── VÌ SAO PHẢI LƯU ĐỆM ───
 * App gửi LẠI TOÀN BỘ lịch sử ở mỗi lượt (máy chủ không giữ phiên), nên lượt nào
 * cũng bị cắt lại. Không đệm thì MỌI lượt sau khi chạm trần đều tốn thêm một lần
 * gọi model + chờ thêm vài giây. Khoá đệm = băm nội dung các lượt bị bỏ:
 *   · cùng phần bị bỏ ⇒ trúng đệm, 0 lời gọi;
 *   · bỏ thêm lượt mới ⇒ lấy bản tóm tắt đã có của phần ngắn hơn rồi chỉ tóm tắt
 *     PHẦN THÊM (tăng dần), không đọc lại từ đầu.
 * Đệm nằm trong bộ nhớ tiến trình: khởi động lại thì tóm tắt lại một lần, không sao.
 *
 * KHÔNG BAO GIỜ NÉM: hỏng ⇒ trả `null`, chỗ gọi dùng lại lời nhắc cũ của catCu.
 */
import { createHash } from 'node:crypto';
import type { AgentMessage } from './turn.js';
import { chatUrlOf, costUsd, endpointFor, gatewayKeyFor, gatewayRoot, modelFor } from '../llm/gateway.js';
import { hangSo, laLoiCongHong, tuongDuongFree, type MucModel } from './bangModel.js';
import { logger } from '../../utils/logger.js';

/** Trần chữ của đề bài được ghim. */
const TRAN_GHIM = 6_000;
/** Trần chữ đưa vào MỘT lần tóm tắt — đủ để model đọc mà không tự vượt trần. */
/* 18/10/2026 (model của cuộc, cửa sổ ≥ 400K token): 90.000 → 400.000 ký tự vào,
   400 → 1.500 ký tự mỗi kết quả tool, 300 → 800 ký tự tham số. */
const TRAN_VAO = 400_000;
/** Mỗi kết quả tool chỉ cần biết nó trả gì đại khái. */
const TRAN_KQ_TOOL = 1_500;
const TRAN_THAM_SO = 800;
const DEM_TOI_DA = 400;

const dem = new Map<string, string>();
function nhoDem(k: string, v: string): void {
  if (dem.has(k)) dem.delete(k);
  dem.set(k, v);
  while (dem.size > DEM_TOI_DA) dem.delete(dem.keys().next().value as string);
}

function chuCua(m: AgentMessage): string {
  if (typeof m.content === 'string') return m.content;
  if (Array.isArray(m.content)) {
    return m.content.map((k) => (k.type === 'text' ? k.text : '[ảnh]')).join('\n');
  }
  return '';
}

/** Một lượt → chữ thuần cho model tóm tắt đọc. Kết quả tool chỉ giữ đầu. */
function chepLuot(luot: readonly AgentMessage[]): string {
  const ra: string[] = [];
  for (const m of luot) {
    if (m.role === 'user') ra.push(`NGƯỜI DÙNG: ${chuCua(m)}`);
    else if (m.role === 'assistant') {
      const chu = chuCua(m).trim();
      if (chu) ra.push(`AGENT: ${chu}`);
      for (const c of m.tool_calls ?? []) {
        ra.push(`AGENT GỌI ${c.function.name}(${c.function.arguments.slice(0, TRAN_THAM_SO)})`);
      }
    } else if (m.role === 'tool') {
      ra.push(`KẾT QUẢ: ${chuCua(m).slice(0, TRAN_KQ_TOOL)}`);
    }
  }
  return ra.join('\n');
}

function bam(s: string): string {
  return createHash('sha1').update(s).digest('hex');
}

/** Chia mảng thành các lượt: mỗi lượt bắt đầu ở một tin nhắn `user`. */
function chiaLuot(messages: readonly AgentMessage[]): AgentMessage[][] {
  const ra: AgentMessage[][] = [];
  for (const m of messages) {
    if (m.role === 'user' || ra.length === 0) ra.push([m]);
    else ra[ra.length - 1]!.push(m);
  }
  return ra;
}

const NHAC = `Bạn tóm tắt phần ĐẦU của một phiên làm việc giữa người dùng và một agent lập trình. Phần này sắp bị bỏ khỏi ngữ cảnh vì hội thoại quá dài; bản tóm tắt của bạn là thứ DUY NHẤT agent còn nhớ về nó để làm tiếp.

GIỮ (gạch đầu dòng, cụ thể, có đường dẫn file/tên lệnh thật):
- Mục tiêu và yêu cầu của người dùng, kể cả câu dặn/ràng buộc ("đừng…", "phải…", phong cách, ngôn ngữ).
- Quyết định đã chốt và lý do ngắn.
- File đã tạo/sửa/xoá và đã làm gì ở đó.
- Lệnh/phép kiểm đã chạy và kết quả (đạt/hỏng, lỗi chính).
- Việc đang dở hoặc đã hứa làm tiếp.
BỎ: lời chào, đoạn suy nghĩ lan man, nội dung file dài, log thừa.
Không bịa thứ không có trong đoạn đọc. Tiếng Việt (giữ nguyên thuật ngữ/tên kỹ thuật). Tối đa khoảng 1.800 từ — đủ chi tiết để làm tiếp mà không phải hỏi lại.`;

/** Lời gọi tóm tắt: (lời dặn hệ thống, nội dung) ⇒ chữ hoặc `null`. */
export type GoiTomTat = (system: string, user: string) => Promise<string | null>;

async function goiTomTat(dauVao: string, banCu: string | null, ghiChu?: string, goi?: GoiTomTat): Promise<string | null> {
  const chu = dauVao.length > TRAN_VAO
    ? `${dauVao.slice(0, TRAN_VAO / 3)}\n[… lược bớt phần giữa …]\n${dauVao.slice(-(TRAN_VAO * 2) / 3)}`
    : dauVao;
  const than = banCu
    ? `BẢN TÓM TẮT ĐÃ CÓ (phần trước đó):\n${banCu}\n\nPHẦN MỚI CẦN GỘP VÀO:\n${chu}\n\nViết lại MỘT bản tóm tắt gộp cả hai.`
    : chu;
  /* `/compact <ghi chú>` (03/10/2026): người dùng dặn giữ gì khi tóm tắt. Đặt
     SAU nội dung để model đọc nó như chỉ dẫn cuối, không lẫn vào hội thoại. */
  const user = ghiChu ? `${than}\n\nNGƯỜI DÙNG DẶN KHI TÓM TẮT (ưu tiên giữ): ${ghiChu}` : than;
  if (goi) {
    try {
      const t = ((await goi(NHAC, user)) ?? '').trim();
      return t.length >= 40 ? t : null;
    } catch (e) {
      logger.warn('tóm tắt lượt cũ (model của cuộc): lỗi gọi', { error: (e as Error).message });
      return null;
    }
  }
  try {
    const ep = endpointFor('cv_parse'); // việc máy đọc ⇒ model rẻ (cùng lựa chọn với datTen.ts)
    const res = await fetch(chatUrlOf(ep), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ep.key ?? ''}` },
      signal: AbortSignal.timeout(45_000),
      body: JSON.stringify({
        model: modelFor('cv_parse', ep),
        max_tokens: 2_000,
        messages: [{ role: 'system', content: NHAC }, { role: 'user', content: user }],
      }),
    });
    if (!res.ok) {
      logger.warn('tóm tắt lượt cũ: cổng trả lỗi', { status: res.status });
      return null;
    }
    const j = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    const t = (j.choices?.[0]?.message?.content ?? '').trim();
    return t.length >= 40 ? t : null;
  } catch (e) {
    logger.warn('tóm tắt lượt cũ: lỗi gọi', { error: (e as Error).message });
    return null;
  }
}

export interface GhiNhoLuotCu {
  /** Tin nhắn đầu tiên của người dùng (đề bài), đã cắt trần. */
  deBai: string | null;
  /** Bản tóm tắt các lượt bị bỏ; `null` nếu không tóm tắt được. */
  tomTat: string | null;
  /** Có phải gọi model ở lượt này không (để hiện tiến trình). */
  daGoiModel: boolean;
}

/**
 * Dựng phần "ghi nhớ" cho các lượt bị bỏ.
 *
 * @param messagesGoc toàn bộ hội thoại app gửi lên
 * @param soConLai    số tin nhắn còn giữ (đuôi) sau khi `catLuotCu` cắt
 */
export async function ghiNhoLuotDaBo(
  messagesGoc: readonly AgentMessage[],
  soConLai: number,
  /** Lời dặn của `/compact <ghi chú>` — đổi khoá đệm, không lẫn với bản không dặn. */
  ghiChu?: string,
  /** Lời gọi bằng model của cuộc (`goiTomTatBangModel`). Bỏ trống ⇒ model rẻ (đường cũ). */
  goi?: GoiTomTat & { maModel?: string },
): Promise<GhiNhoLuotCu> {
  const daBo = messagesGoc.slice(0, messagesGoc.length - soConLai);
  const dauTien = messagesGoc.find((m) => m.role === 'user');
  const deBai = dauTien ? chuCua(dauTien).trim().slice(0, TRAN_GHIM) || null : null;
  const luot = chiaLuot(daBo);
  if (luot.length === 0) return { deBai, tomTat: null, daGoiModel: false };

  const chep = luot.map(chepLuot);
  // Khoá theo tiền tố: khoa[k] = băm của k lượt đầu (k = 1..n).
  const khoa: string[] = [];
  let gop = `${goi?.maModel ? `\u0002${goi.maModel}` : ''}${ghiChu ? `\u0001${ghiChu}` : ''}`;
  for (const c of chep) { gop += `\n\u0000${c}`; khoa.push(bam(gop)); }

  const n = luot.length;
  const trung = dem.get(khoa[n - 1]!);
  if (trung) return { deBai, tomTat: trung, daGoiModel: false };

  // Tìm tiền tố dài nhất đã có tóm tắt ⇒ chỉ tóm tắt phần thêm.
  let k = n - 1;
  while (k > 0 && !dem.has(khoa[k - 1]!)) k--;
  const banCu = k > 0 ? dem.get(khoa[k - 1]!)! : null;
  const moi = chep.slice(k).join('\n\n---\n\n');
  const tomTat = await goiTomTat(moi, banCu, ghiChu, goi);
  if (tomTat) nhoDem(khoa[n - 1]!, tomTat);
  return { deBai, tomTat: tomTat ?? banCu, daGoiModel: true };
}

/**
 * Lời gọi tóm tắt bằng ĐÚNG model của cuộc (18/10/2026). Cổng của model đó hỏng ⇒
 * thử model free tương đương ở cổng kia (như lượt agent). Ghi sổ `interview_llm_call_logs`
 * (feature `agent`, đúng model) ⇒ tính vào trần theo model của người dùng.
 */
export function goiTomTatBangModel(muc: MucModel, userId: number): GoiTomTat & { maModel: string } {
  const goi = async (system: string, user: string): Promise<string | null> => {
    const thu = async (m: MucModel): Promise<string> => {
      if (m.cong === 'anthropic') {
        const { goiVanBanChinhHang } = await import('./anthropicChinhHang/dinhTuyen.js');
        const kq = await goiVanBanChinhHang({
          system, messages: [{ role: 'user', content: user }], model: m.model, hang: hangSo(m),
          maxTokens: 16_000, userId, viec: 'agent_code', signal: AbortSignal.timeout(240_000),
        });
        void ghiSoTomTat(userId, m.model, 0, 0, kq.usd);
        return kq.text;
      }
      const res = await fetch(`${gatewayRoot()}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${gatewayKeyFor(m.model) ?? ''}` },
        signal: AbortSignal.timeout(240_000),
        body: JSON.stringify({
          model: m.model, max_tokens: 16_000, reasoning_effort: 'medium',
          messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text().catch(() => '')).slice(0, 200)}`);
      const j = await res.json() as { choices?: Array<{ message?: { content?: string } }>; usage?: { prompt_tokens?: number; completion_tokens?: number } };
      void ghiSoTomTat(userId, m.model, j.usage?.prompt_tokens ?? 0, j.usage?.completion_tokens ?? 0);
      return j.choices?.[0]?.message?.content ?? '';
    };
    try {
      return await thu(muc);
    } catch (e) {
      const msg = (e as Error).message || '';
      const thay = laLoiCongHong(msg, (e as { code?: string }).code) ? tuongDuongFree(muc) : null;
      if (!thay) throw e;
      logger.warn('tóm tắt lượt cũ: cổng hỏng — dùng model tương đương', { tu: muc.id, sang: thay.id });
      return thu(thay);
    }
  };
  return Object.assign(goi, { maModel: muc.id });
}

async function ghiSoTomTat(userId: number, model: string, vao: number, ra: number, usd?: number): Promise<void> {
  try {
    const { prisma } = await import('../../config/database.js');
    await prisma.interviewLLMCallLog.create({
      data: {
        userId, feature: 'agent', step: 'interview', provider: 'gateway', model,
        inputTokens: vao, outputTokens: ra, costUsd: usd ?? costUsd(model, vao, ra), success: true,
      },
    });
  } catch (err) {
    logger.warn('tóm tắt lượt cũ: không ghi được sổ', { error: (err as Error).message });
  }
}
