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
 *   2. TÓM TẮT các lượt bị bỏ bằng model rẻ (như `datTen.ts`) thành một bản ghi
 *      ngắn: mục tiêu, ràng buộc, quyết định, file đã sửa, việc còn dở.
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
import { chatUrlOf, endpointFor, modelFor } from '../llm/gateway.js';
import { logger } from '../../utils/logger.js';

/** Trần chữ của đề bài được ghim. */
const TRAN_GHIM = 6_000;
/** Trần chữ đưa vào MỘT lần tóm tắt — đủ để model đọc mà không tự vượt trần. */
const TRAN_VAO = 90_000;
/** Mỗi kết quả tool chỉ cần biết nó trả gì đại khái. */
const TRAN_KQ_TOOL = 400;
const TRAN_THAM_SO = 300;
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
Không bịa thứ không có trong đoạn đọc. Tiếng Việt (giữ nguyên thuật ngữ/tên kỹ thuật). Tối đa khoảng 900 từ.`;

async function goiTomTat(dauVao: string, banCu: string | null, ghiChu?: string): Promise<string | null> {
  const chu = dauVao.length > TRAN_VAO
    ? `${dauVao.slice(0, TRAN_VAO / 3)}\n[… lược bớt phần giữa …]\n${dauVao.slice(-(TRAN_VAO * 2) / 3)}`
    : dauVao;
  const than = banCu
    ? `BẢN TÓM TẮT ĐÃ CÓ (phần trước đó):\n${banCu}\n\nPHẦN MỚI CẦN GỘP VÀO:\n${chu}\n\nViết lại MỘT bản tóm tắt gộp cả hai.`
    : chu;
  /* `/compact <ghi chú>` (03/10/2026): người dùng dặn giữ gì khi tóm tắt. Đặt
     SAU nội dung để model đọc nó như chỉ dẫn cuối, không lẫn vào hội thoại. */
  const user = ghiChu ? `${than}\n\nNGƯỜI DÙNG DẶN KHI TÓM TẮT (ưu tiên giữ): ${ghiChu}` : than;
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
): Promise<GhiNhoLuotCu> {
  const daBo = messagesGoc.slice(0, messagesGoc.length - soConLai);
  const dauTien = messagesGoc.find((m) => m.role === 'user');
  const deBai = dauTien ? chuCua(dauTien).trim().slice(0, TRAN_GHIM) || null : null;
  const luot = chiaLuot(daBo);
  if (luot.length === 0) return { deBai, tomTat: null, daGoiModel: false };

  const chep = luot.map(chepLuot);
  // Khoá theo tiền tố: khoa[k] = băm của k lượt đầu (k = 1..n).
  const khoa: string[] = [];
  let gop = ghiChu ? `\u0001${ghiChu}` : '';
  for (const c of chep) { gop += `\n\u0000${c}`; khoa.push(bam(gop)); }

  const n = luot.length;
  const trung = dem.get(khoa[n - 1]!);
  if (trung) return { deBai, tomTat: trung, daGoiModel: false };

  // Tìm tiền tố dài nhất đã có tóm tắt ⇒ chỉ tóm tắt phần thêm.
  let k = n - 1;
  while (k > 0 && !dem.has(khoa[k - 1]!)) k--;
  const banCu = k > 0 ? dem.get(khoa[k - 1]!)! : null;
  const moi = chep.slice(k).join('\n\n---\n\n');
  const tomTat = await goiTomTat(moi, banCu, ghiChu);
  if (tomTat) nhoDem(khoa[n - 1]!, tomTat);
  return { deBai, tomTat: tomTat ?? banCu, daGoiModel: true };
}
