/**
 * ============================================================
 * Phản xạ — hai đường tắt bỏ qua LLM
 * ============================================================
 *
 * Đo ngày 12/08/2026, bóc trọn 2,4 giây từ lúc người dùng nói xong tới
 * lúc robot mở miệng:
 *
 *     STT (whisper-large-v3-turbo)  ~500 ms
 *     LLM tới câu đầu               ~1500 ms
 *     TTS byte đầu                  ~250 ms
 *
 * Cả ba đều đã chạm sàn: model đã là nhanh nhất trong bốn model đo được
 * ở cổng, prompt dưới 5.000 ký tự không ảnh hưởng tới chữ đầu, TTS đã
 * chảy theo luồng. Không còn gì để siết.
 *
 * Nên chuyển hướng: thay vì làm nó NHANH HƠN, làm cho khoảng chờ không
 * còn là khoảng lặng.
 *
 * ── Đường 1: tiếng đệm ──
 * Phát "Ừmmm" ngay khi nghe xong, trong lúc LLM đang chạy. Không nhanh
 * hơn một mili giây nào, nhưng người ta nghe thấy robot ĐÃ NGHE THẤY
 * mình sau ~0,6 giây thay vì đứng im 2,4 giây. Đây là chỗ khác nhau
 * giữa "nó đang nghĩ" và "nó có nghe không đấy".
 *
 * ── Đường 2: lệnh không cần nghĩ ──
 * "Tăng âm lượng" hiện đi trọn vòng STT → LLM → TTS mất 2,4 giây cho
 * một việc chỉ cần khớp chuỗi. Bắt ngay sau STT rồi thi hành thẳng.
 *
 * ⚠️ Danh sách khớp phải HẸP. Bắt nhầm một câu hỏi thành lệnh thì robot
 * trả lời trật lất mà không có đường nào sửa — người dùng chỉ thấy nó
 * "bị ngu đi". Thà bỏ sót vài lệnh (rơi về LLM, vẫn đúng, chỉ chậm hơn)
 * còn hơn bắt nhầm một câu.
 */

import { logger } from '../../utils/logger.js';
import { validateCommand, type ValidatedCommand } from './commands.js';

/** Tiếng đệm phát trong lúc LLM đang nghĩ. */
export const CHU_DEM = 'Ừmmm';

/**
 * Kho tiếng đệm đã sinh, theo từng giọng.
 *
 * Sinh MỘT lần rồi dùng mãi: nếu mỗi lượt lại gọi TTS cho "Ừmmm" thì
 * chính nó tốn 250 ms — tức là mất đúng cái thứ nó sinh ra để cứu.
 *
 * Khoá theo giọng chứ không phải theo nhà cung cấp: người dùng đổi giọng
 * mà đệm vẫn giọng cũ thì nghe như hai người nói xen nhau.
 */
const kho = new Map<string, Buffer>();

/** Xoá kho khi đổi giọng — gọi từ chỗ lưu persona. */
export function quenTiengDem(): void {
  kho.clear();
}

/**
 * Lấy tiếng đệm dạng PCM 16 kHz cho giọng đang dùng.
 *
 * Trả `null` khi chưa sinh được — bên gọi PHẢI coi đó là chuyện thường
 * và đi tiếp, không được chờ. Tiếng đệm là thứ làm đẹp; để nó chặn lượt
 * nói thì lợi bất cập hại.
 */
export async function layTiengDem(persona: {
  voiceProvider: string;
  voiceId: string | null;
  speechRate: number;
}): Promise<Buffer | null> {
  const khoa = `${persona.voiceProvider}:${persona.voiceId ?? ''}:${CHU_DEM}`;
  const co = kho.get(khoa);
  if (co) return co;

  try {
    const { streamCuongMini } = await import('./tts.js');
    if (persona.voiceProvider !== 'cuongmini') return null;

    const mau: Buffer[] = [];
    await streamCuongMini(
      CHU_DEM,
      { voice: persona.voiceId ?? undefined, speakingRate: persona.speechRate },
      async (pcm) => {
        mau.push(pcm);
        return true;
      },
    );
    if (!mau.length) return null;
    const pcm = Buffer.concat(mau);
    kho.set(khoa, pcm);
    logger.info('MakerLab đã sinh tiếng đệm', {
      giong: persona.voiceId,
      giay: +(pcm.length / 2 / 16000).toFixed(2),
    });
    return pcm;
  } catch (e) {
    logger.warn('MakerLab không sinh được tiếng đệm', {
      error: e instanceof Error ? e.message : String(e),
    });
    return null;
  }
}

/**
 * Lấy tiếng đệm CHỈ khi đã có sẵn; chưa có thì sinh NGẦM rồi trả `null`.
 *
 * Vì sao không `await` lần sinh đầu: nó mất ~250 ms, tức đúng lượt đầu
 * tiên thì thứ sinh ra để CỨU độ trễ lại CỘNG THÊM vào độ trễ. Bỏ qua
 * một lượt là giá quá rẻ để không bao giờ mắc chuyện đó.
 *
 * Cũng chặn sinh chồng: người nói liên tiếp ba câu trước khi mẻ đầu xong
 * thì ba lần gọi TTS cùng lúc, và cái đó tranh đúng cái máy đang phải
 * đọc câu trả lời thật.
 */
const dangSinh = new Set<string>();

export function layTiengDemNgay(persona: {
  voiceProvider: string;
  voiceId: string | null;
  speechRate: number;
}): Buffer | null {
  const khoa = `${persona.voiceProvider}:${persona.voiceId ?? ''}:${CHU_DEM}`;
  const co = kho.get(khoa);
  if (co) return co;
  if (!dangSinh.has(khoa)) {
    dangSinh.add(khoa);
    void layTiengDem(persona).finally(() => dangSinh.delete(khoa));
  }
  return null;
}

/** Kết quả khớp một lệnh nhanh. */
export interface LenhNhanh {
  say: string;
  actions: ValidatedCommand[];
}

/**
 * Dựng kết quả, nhưng BẮT BUỘC đi qua `validateCommand` như lệnh của LLM.
 *
 * Không tự tay dựng payload: mọi giới hạn (âm lượng 10-100, tên trường,
 * kiểu dữ liệu) nằm trong đó. Viết tay ở đây nghĩa là có HAI nơi định
 * nghĩa cùng một luật, và cái thứ hai sẽ lặng lẽ trôi khỏi cái thứ nhất.
 */
function lam(say: string, type: string, payload: Record<string, unknown>): LenhNhanh | null {
  const cmd = validateCommand(type, payload);
  return cmd ? { say, actions: [cmd] } : null;
}

/** Bỏ dấu để khớp cả khi Whisper nghe thiếu dấu. */
function khongDau(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Khớp một câu nói với lệnh thi hành ngay, hoặc `null` để đi đường LLM.
 *
 * Chỉ nhận câu NGẮN: một lệnh thật thì ngắn, còn câu dài gần như luôn là
 * hội thoại có chứa từ khoá. "Tắt nhạc đi" là lệnh; "hôm qua em nghe bài
 * này hay mà giờ muốn tắt nhạc đi ngủ" thì không, và bắt nhầm nó thành
 * lệnh là robot im bặt giữa lúc người ta đang kể chuyện.
 */
export function khopLenhNhanh(heard: string): LenhNhanh | null {
  const s = khongDau(heard);
  if (!s || s.length > 32) return null;

  // ── Âm lượng đặt thẳng: "âm lượng 50", "để 70 phần trăm" ──
  const so = s.match(/\b(\d{1,3})\s*(phan tram|%)?\b/);
  if (so && /(am luong|volume|tieng)/.test(s)) {
    const v = Math.max(10, Math.min(100, parseInt(so[1], 10)));
    return lam(`Âm lượng ${v} phần trăm.`, 'volume', { percent: v });
  }

  if (/(to len|to hon|lon len|lon hon|tang am luong|tang tieng|noi to)/.test(s)) {
    return lam('Dạ, em nói to hơn.', 'volume', { percent: 100 });
  }
  if (/(nho lai|nho hon|be lai|giam am luong|giam tieng|noi nho)/.test(s)) {
    return lam('Dạ, em nói nhỏ lại.', 'volume', { percent: 45 });
  }

  // ── Nhạc ──
  if (/(tat nhac|dung nhac|ngung nhac|tat bai nay|dung bai nay)/.test(s)) {
    return lam('Dạ, em tắt nhạc.', 'stop_music', {});
  }

  // ── Dừng chuyển động ──
  if (/^(dung lai|dung|dung ngay|dung het|stop|khoan)$/.test(s)) {
    return lam('Dạ.', 'stop', {});
  }

  // ⚠️ KHÔNG bắt "im đi" / "thôi" ở đây. Chúng là lệnh CHEN LỜI, đã có
  // đường riêng bằng cảm biến chạm và khung `{t:'stop'}` — xử lý lại ở
  // đây nghĩa là robot phải NÓI "dạ" để bảo rằng nó sẽ thôi nói, đúng
  // thứ người ta vừa bảo đừng làm.

  return null;
}
