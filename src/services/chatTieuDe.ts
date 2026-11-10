/**
 * Tiêu đề cuộc trò chuyện của AI Chat (/chat web + app) — tự đặt như claude.ai (10/11/2026).
 *
 * Trước đây mọi cuộc mang tên tạm `Chat 02:07:19 10/11/2026` (hoặc `Trò chuyện bằng giọng nói` của robot
 * desktop) ⇒ danh sách lịch sử toàn tên giống nhau, người dùng phải mở từng cuộc mới biết là gì.
 *
 * Nay: lượt hỏi ĐẦU TIÊN có trả lời xong ⇒ hỏi model rẻ (Groq — đường miễn phí của CuongMini 3.11, qua
 * `chatWithFallback`) một tiêu đề 3–7 chữ; hỏng/chậm ⇒ lấy mấy chữ đầu câu hỏi. Chỉ đổi khi tên hiện tại
 * còn là tên TẠM — tên người dùng tự đặt không bao giờ bị đè.
 */
import { prisma } from '../config/database.js';
import { chatWithFallback, type ChatRequest, type ChatResponse } from './aiProviders.js';

const TEN_TAM = [/^Chat \d/, /^New chat$/i, /^Trò chuyện bằng giọng nói$/, /^Cuộc trò chuyện mới$/];

/** Tên còn là tên tạm (máy đặt) ⇒ được phép thay bằng tiêu đề tự sinh. */
export function laTieuDeTam(t: string | null | undefined): boolean {
  const s = (t ?? '').trim();
  return !s || TEN_TAM.some((r) => r.test(s));
}

/** Tiêu đề lùi: mấy chữ đầu câu hỏi, bỏ ký hiệu markdown/xuống dòng, tối đa ~60 ký tự. */
export function tieuDeLui(cauHoi: string): string {
  const sach = (cauHoi ?? '')
    .normalize('NFC')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[`*_#>|[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!sach) return 'Cuộc trò chuyện mới';
  const tu = sach.split(' ');
  let out = '';
  for (const w of tu) {
    if ((out + ' ' + w).trim().length > 60) break;
    out = (out + ' ' + w).trim();
    if (out.split(' ').length >= 9) break;
  }
  out = out || sach.slice(0, 60);
  return out.charAt(0).toUpperCase() + out.slice(1);
}

/** Làm sạch câu model trả: bỏ ngoặc kép, "Tiêu đề:", dấu chấm cuối; quá dài/rỗng ⇒ null. */
export function lamSachTieuDe(raw: string): string | null {
  let s = (raw ?? '').normalize('NFC').split('\n').map((x) => x.trim()).find(Boolean) ?? '';
  s = s.replace(/^(tiêu đề|title)\s*[:：-]\s*/i, '').replace(/^["'“”«»*#\s]+/, '').replace(/["'“”«»*.。\s]+$/, '').trim();
  if (!s || s.length < 2 || s.length > 80) return null;
  return s;
}

type Goi = (r: ChatRequest) => Promise<ChatResponse>;

/** Sinh tiêu đề từ lượt đầu. Không bao giờ ném lỗi; tối đa ~6 giây. */
export async function sinhTieuDe(cauHoi: string, traLoi: string, goi: Goi = chatWithFallback): Promise<string> {
  const lui = tieuDeLui(cauHoi);
  try {
    const hen = new Promise<null>((r) => setTimeout(() => r(null), 6000));
    const kq = await Promise.race([
      goi({
        messages: [
          {
            role: 'system',
            content: 'Bạn đặt tiêu đề cho cuộc trò chuyện. Trả về DUY NHẤT một tiêu đề 3–7 chữ, cùng ngôn ngữ với câu hỏi, '
              + 'nêu đúng chủ đề, không ngoặc kép, không dấu chấm cuối, không emoji.',
          },
          { role: 'user', content: `Câu hỏi: ${cauHoi.slice(0, 600)}\n\nTrả lời (trích): ${traLoi.slice(0, 400)}\n\nTiêu đề:` },
        ],
        maxTokens: 24,
        temperature: 0.3,
      }),
      hen,
    ]);
    return (kq && lamSachTieuDe(kq.text)) || lui;
  } catch {
    return lui;
  }
}

/**
 * Sau lượt trả lời: nếu cuộc còn tên tạm ⇒ đặt tiêu đề mới, trả về tiêu đề (để đẩy khung SSE `title`).
 * Cuộc đã có tên thật ⇒ null (không gọi model).
 */
export async function datTieuDeNeuCan(sessionId: string, cauHoi: string, traLoi: string, goi?: Goi): Promise<string | null> {
  if (!sessionId || !cauHoi?.trim()) return null;
  const phien = await prisma.chatSession.findUnique({ where: { id: sessionId }, select: { title: true } });
  if (!phien || !laTieuDeTam(phien.title)) return null;
  const tieuDe = await sinhTieuDe(cauHoi, traLoi, goi);
  // Chỉ ghi khi tên VẪN còn tạm (người dùng có thể vừa đổi tên trong lúc model đang nghĩ).
  const { count } = await prisma.chatSession.updateMany({
    where: { id: sessionId, title: phien.title },
    data: { title: tieuDe },
  });
  return count > 0 ? tieuDe : null;
}
