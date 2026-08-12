/**
 * ============================================================
 * Phản xạ — lệnh đơn giản không đi qua LLM
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
 * ── Lệnh không cần nghĩ ──
 * "Tăng âm lượng" hiện đi trọn vòng STT → LLM → TTS mất 2,4 giây cho
 * một việc chỉ cần khớp chuỗi. Bắt ngay sau STT rồi thi hành thẳng.
 *
 * ⚠️ ĐÃ TỪNG CÓ "tiếng đệm" ở đây — phát "Ừmmm" trong lúc model nghĩ.
 * Gỡ ngày 12/08/2026 vì hai lý do, và lý do thứ hai mới là lý do thật:
 *
 * 1. Người dùng nghe thấy lạ tai.
 * 2. Nó tự bóp cổ chính mình. Mỗi lượt đều hỏi kho đệm; kho chỉ đầy khi
 *    lần sinh ngầm THÀNH CÔNG. Lần sinh đó hỏng (máy đọc kẹt) ⇒ kho mãi
 *    rỗng ⇒ lượt nào cũng đẻ thêm một việc sinh ngầm, tất cả xếp hàng
 *    trên CÙNG một khoá mô hình, chèn ngay trước câu trả lời thật. Càng
 *    nói nhiều càng tắc. Robot im 42 giây, `firstAudioMs: 0`.
 *
 * Bài học không phải "đừng làm tiếng đệm" mà là: một thứ CHỈ để làm đẹp
 * thì tuyệt đối không được nằm chung hàng đợi với thứ bắt buộc phải
 * chạy. Muốn làm lại thì sinh sẵn lúc lưu persona, không sinh lúc đang
 * phục vụ.
 *
 * ⚠️ Danh sách khớp phải HẸP. Bắt nhầm một câu hỏi thành lệnh thì robot
 * trả lời trật lất mà không có đường nào sửa — người dùng chỉ thấy nó
 * "bị ngu đi". Thà bỏ sót vài lệnh (rơi về LLM, vẫn đúng, chỉ chậm hơn)
 * còn hơn bắt nhầm một câu.
 */

import { validateCommand, type ValidatedCommand } from './commands.js';

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
