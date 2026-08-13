/**
 * ============================================================
 * Ba chế độ tiếng của robot
 * ============================================================
 *
 *   vi     tiếng Việt, giọng nhân bản của chủ + phiên âm từ tiếng Anh
 *   en     tiếng Anh, giọng Chatterbox chạy trên GPU máy nhà
 *   robot  tiếng Anh, giọng robot (CHƯA có — đang chờ mẫu thoại nhân vật)
 *
 * ── Vì sao phải là MỘT chỗ, không phải ba biến rời ──
 *
 * Đổi ngôn ngữ đụng vào BA tầng, và quên một tầng là hỏng theo kiểu khó
 * đoán nhất:
 *
 *   tai     Whisper phải biết đang nghe tiếng gì — bỏ sót thì nó phiên
 *           âm bậy, và triệu chứng là "robot nghe không ra" chứ không
 *           phải "sai ngôn ngữ".
 *   đầu     LLM phải được bảo trả lời bằng tiếng gì — bỏ sót thì robot
 *           nghe tiếng Anh rồi đáp tiếng Việt.
 *   miệng   giọng đọc phải khớp — bỏ sót thì giọng Việt đọc chữ tiếng
 *           Anh, tức quay lại đúng lỗi "phi lê" đã chữa.
 *
 * Gom cả ba vào một bảng nghĩa là thêm chế độ thứ tư sau này chỉ là thêm
 * một dòng, và không thể quên tầng nào — thiếu trường là TypeScript báo
 * ngay chứ không đợi người dùng phát hiện bằng tai.
 */

export type CheDo = 'vi' | 'en' | 'robot';

export interface CauHinhCheDo {
  /**
   * Mã ISO-639-1 cho Whisper, hoặc `null` = ĐỂ NÓ TỰ NHẬN.
   *
   * ⚠️ ÉP NGÔN NGỮ Ở CHẾ ĐỘ NGOẠI NGỮ LÀ TỰ NHỐT NGƯỜI DÙNG.
   *
   * Bản đầu ép `en` cho chế độ tiếng Anh. Hậu quả đo thật 13/08/2026:
   * người dùng nói tiếng Việt thì Whisper ép thành từ tiếng Anh gần
   * giống nhất — log ghi `"Thank you."` sáu lần liền, `"Go."`,
   * `"What's your name?"` cho những câu tiếng Việt hoàn toàn.
   *
   * Và không có đường ra: muốn về tiếng Việt phải nói "nói tiếng Việt
   * đi", mà chính câu đó cũng bị chép sai. Chỉ nút trên web mới cứu
   * được — tức tính năng "đổi bằng giọng nói" chết một chiều.
   *
   * Nên chế độ ngoại ngữ để `null`: Whisper tự nhận, nghe được cả hai
   * thứ tiếng, và lệnh đổi về luôn có đường. Chế độ `vi` vẫn ép `vi` vì
   * đó là đường dùng chính và ép giúp chính xác hơn với câu ngắn.
   */
  stt: string | null;
  /** Câu lệnh chèn vào prompt hệ thống. */
  nhacLlm: string;
  /** Tên giọng gửi cho máy đọc. `null` = giữ giọng đang cấu hình. */
  giong: string | null;
  /**
   * Nhà cung cấp giọng bắt buộc cho chế độ này. `null` = giữ cái đang đặt.
   *
   * ⚠️ ĐỔI GIỌNG MÀ QUÊN ĐỔI NHÀ CUNG CẤP LÀ ĐỔI SANG MỘT CÁI TÊN VÔ NGHĨA.
   *
   * `en-cham` và `robot-walle` chỉ tồn tại ở dịch vụ tự dựng
   * (`cuongmini`). Persona của người dùng đang để `google`, nên khi đổi
   * sang chế độ robot mà chỉ đổi tên giọng thì Google nhận tên
   * `robot-walle`, không biết nó là gì, hỏng — và cả chuỗi lặng lẽ rơi
   * xuống giọng dự phòng. Không ném lỗi nào, chỉ có giọng lạ phát ra
   * loa: đúng kiểu hỏng đã tốn cả buổi sáng nay để tìm.
   */
  nhaCungCap: string | null;
  /** Có phiên âm từ tiếng Anh sang chính tả Việt không. */
  phienAm: boolean;
  /** Câu robot nói ngay khi vừa đổi sang chế độ này. */
  chaoDoi: string;
  /** Nhãn hiện trên web. */
  nhan: string;
}

export const CHE_DO: Record<CheDo, CauHinhCheDo> = {
  vi: {
    stt: 'vi',
    nhacLlm: 'Trả lời HOÀN TOÀN bằng tiếng Việt, tự nhiên như đang nói chuyện.',
    giong: null, // giữ giọng nhân bản đang đặt trong persona
    nhaCungCap: null,
    phienAm: true,
    chaoDoi: 'Dạ, em nói tiếng Việt.',
    nhan: 'Tiếng Việt',
  },
  en: {
    stt: null, // tự nhận — xem ghi chú ở `stt`
    nhacLlm:
      'Reply ENTIRELY in English, in a natural conversational tone. ' +
      'Keep it short — 3 or 4 sentences at most, because your words are read aloud.',
    giong: 'en-cham',
    nhaCungCap: 'cuongmini',
    // KHÔNG phiên âm ở chế độ tiếng Anh: ở đây chính tả GỐC mới là thứ
    // đúng, và đổi "deploy" thành "đi-pờ-loi" là biến nó thành một từ vô
    // nghĩa với máy đọc tiếng Anh.
    phienAm: false,
    chaoDoi: 'Okay, I will speak English now.',
    nhan: 'English',
  },
  robot: {
    stt: null, // tự nhận — xem ghi chú ở `stt`
    nhacLlm:
      'Reply ENTIRELY in English, short and playful, like a small cartoon robot. ' +
      'Keep it to 2 or 3 short sentences.',
    // Giọng nhân bản từ đoạn thoại nhân vật người dùng gửi (13/08/2026),
    // nằm ở dịch vụ Chatterbox trên máy nhà. Người dùng đã nghe và duyệt.
    //
    // KHÔNG đắp thêm bộ lọc robot bằng ffmpeg nữa: bản lọc (điều biến
    // vòng + giảm bit) đã bị từ chối vì nghe rè và mất chữ. Chất robot
    // giờ đến từ chính giọng mẫu, tự nhiên hơn hẳn.
    giong: 'robot-walle',
    nhaCungCap: 'cuongmini',
    phienAm: false,
    chaoDoi: 'Beep boop! Robot mode on.',
    nhan: 'Giọng robot',
  },
};

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
 * Người dùng vừa bảo đổi chế độ? Trả `null` nếu không.
 *
 * ⚠️ Khớp HẸP và chỉ nhận câu ngắn. "Anh đang học tiếng Anh nên muốn em
 * dạy anh vài từ" có chứa "tiếng anh" nhưng KHÔNG phải lệnh đổi — bắt
 * nhầm thì robot đột ngột chuyển sang tiếng Anh giữa cuộc trò chuyện, và
 * người dùng không hiểu vì sao.
 *
 * Vì thế mọi mẫu đều đòi một ĐỘNG TỪ chuyển đổi đi kèm (nói/chuyển/đổi/
 * switch/speak), không chấp nhận mỗi tên ngôn ngữ trần.
 */
export function khopDoiCheDo(heard: string): CheDo | null {
  const s = khongDau(heard);
  if (!s || s.length > 40) return null;

  const coDongTu = /(noi|chuyen|doi|switch|speak|change|talk|use)/.test(s);
  if (!coDongTu) return null;

  if (/(giong robot|robot mode|robot voice|kieu robot)/.test(s)) return 'robot';
  if (/(tieng anh|english|tieng my)/.test(s)) return 'en';
  if (/(tieng viet|vietnamese|viet nam)/.test(s)) return 'vi';
  return null;
}

/** Chế độ hợp lệ hay không — dùng khi nhận từ web/API. */
export function laCheDo(x: unknown): x is CheDo {
  return x === 'vi' || x === 'en' || x === 'robot';
}
