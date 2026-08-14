/**
 * ============================================================
 * Nhiều BỘ TÍNH CÁCH, đổi bằng nút hoặc bằng giọng nói
 * ============================================================
 *
 * ⚠️ VÌ SAO PHẢI TÁCH THÀNH NHIỀU BỘ, KHÔNG TRỘN CHUNG MỘT CHỖ.
 *
 * Robot học cách nói từ MẪU ĐỐI THOẠI, không từ mấy dòng tính từ. Nên
 * trộn ba mẫu "hỗn" với ba mẫu "nghiêm túc" vào cùng một bộ là đưa cho
 * model hai tín hiệu mâu thuẫn cho cùng một loại câu hỏi — nó không học
 * được "khi nào thì hỗn", nó chỉ thấy "câu kiểu này lúc đáp thế này lúc
 * đáp thế kia" rồi chọn bừa.
 *
 * Đây ĐÚNG cơ chế vừa gây ra lỗi độ dài 13/08/2026: tám mẫu cùng dài
 * 187-271 ký tự dạy model "luôn 220 chữ", và nó tuân răm rắp ở mọi câu
 * hỏi — kể cả "mấy giờ rồi". Mẫu có sức nặng thật, và sức nặng đó cắt cả
 * hai chiều.
 *
 * Tách bộ thì mỗi lúc model chỉ thấy MỘT phong cách, tín hiệu sạch. Muốn
 * đổi thì đổi cả bộ, không pha.
 *
 * ── Vì sao cất trong `traits` chứ không thêm bảng ──
 *
 * `prisma migrate dev` hỏng sẵn trong repo này (xem CLAUDE.md), nên mỗi
 * bảng mới là một file SQL viết tay cộng một lần `migrate deploy`. Không
 * đáng cho một cột JSON mà `traits` đã làm sẵn — nó đang giữ kiến thức
 * huấn luyện, giọng theo chế độ, âm lượng, tốc độ đọc.
 */

/** Một bộ tính cách: giọng văn + mẫu đối thoại đi kèm. */
export interface BoTinhCach {
  /** Tên hiện trên web, ví dụ "Hỗn", "Nghiêm túc". */
  nhan: string;
  /**
   * Đè lên `systemPrompt` của persona. Để trống = giữ nguyên bản gốc,
   * chỉ đổi mẫu đối thoại.
   */
  systemPrompt?: string;
  /**
   * Mẫu đối thoại RIÊNG của bộ này — đây mới là thứ tạo ra phong cách.
   *
   * ⚠️ Bộ nào cũng phải TỰ ĐỦ. Để trống nghĩa là dùng mẫu gốc, và lúc đó
   * bộ này không khác gì bộ gốc — người dùng sẽ bấm đổi rồi tưởng hỏng.
   */
  sampleDialogues?: Array<{ user: string; bot: string }>;
  /**
   * Từ khoá để đổi bằng giọng nói, không dấu, chữ thường.
   * Ví dụ `['hon', 'ca khia', 'lao ca']`.
   */
  tuKhoa?: string[];
  /** Câu robot nói ngay khi vừa đổi sang bộ này. */
  chaoDoi?: string;
}

export type KhoTinhCach = Record<string, BoTinhCach>;

/** Bỏ dấu để khớp cả khi Whisper nghe thiếu dấu. */
function khongDau(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Người dùng vừa bảo đổi tính cách? Trả khoá của bộ, hoặc `null`.
 *
 * ⚠️ KHỚP HẸP, ĐÒI ĐỘNG TỪ, VÀ CHỈ NHẬN CÂU NGẮN.
 *
 * Cùng luật đã dùng cho lệnh đổi tiếng, và vì cùng một lý do đã trả giá:
 * "anh đang học tiếng Anh nên muốn em dạy vài từ" có chứa "tiếng anh"
 * nhưng KHÔNG phải lệnh đổi. Bắt nhầm thì robot đột ngột đổi giọng văn
 * giữa cuộc trò chuyện và người dùng không hiểu vì sao.
 *
 * Ở đây còn nguy hơn: tên bộ do người dùng tự đặt, nên có thể trùng với
 * từ thường ngày ("vui", "buồn"). Đòi động từ chuyển đổi là chốt chặn
 * duy nhất giữ cho tính năng này không thành phiền toái.
 */
export function khopDoiTinhCach(heard: string, kho: KhoTinhCach): string | null {
  const s = khongDau(heard);
  if (!s || s.length > 44) return null;

  /**
   * ⚠️ ĐỘNG TỪ PHẢI ĐỨNG TRƯỚC TÊN BỘ, CÁCH TỐI ĐA HAI TỪ ĐỆM.
   *
   * Tìm động từ ở bất cứ đâu trong câu là bắt nhầm, và bộ thử lộ ra ngay
   * một ca độc: bộ tên "Kể chuyện" khớp với câu thường "kể chuyện hôm
   * qua đi". Bỏ dấu thì `chuyện` (câu chuyện) trùng `chuyển` (đổi) —
   * nên câu đó vừa có "động từ" vừa có tên bộ, và robot đổi tính cách
   * giữa lúc người ta đang xin nghe chuyện.
   *
   * Bắt buộc THỨ TỰ động-từ-rồi-mới-tên thì "chuyển sang hỗn" ăn, còn
   * "kể chuyện hôm qua" trượt — vì ở đó tên bộ đứng TRƯỚC động từ.
   */
  const DONG_TU = 'doi|chuyen|sang|dung|bat|switch|change|act|mode';

  // Khớp từ khoá DÀI trước: "nghiem tuc" phải thắng "nghiem" nếu có cả
  // hai, nếu không thì bộ có tên ngắn hơn luôn ăn trước một cách vô lý.
  const ds: Array<{ khoa: string; tu: string }> = [];
  for (const [khoa, bo] of Object.entries(kho)) {
    for (const t of [khoa, bo.nhan, ...(bo.tuKhoa ?? [])]) {
      const k = khongDau(String(t || ''));
      if (k.length >= 2) ds.push({ khoa, tu: k });
    }
  }
  ds.sort((a, b) => b.tu.length - a.tu.length);

  for (const { khoa, tu } of ds) {
    const ten = tu.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`\\b(${DONG_TU})\\b(\\s+\\S+){0,2}\\s+${ten}(\\s|$)`).test(s)) {
      return khoa;
    }
  }
  return null;
}

/** Kho hợp lệ hay không — dùng khi nhận từ web/API. */
export function chuanKhoTinhCach(raw: unknown): KhoTinhCach | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const ra: KhoTinhCach = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!k.trim() || !v || typeof v !== 'object' || Array.isArray(v)) continue;
    const b = v as Record<string, unknown>;
    const nhan = typeof b.nhan === 'string' && b.nhan.trim() ? b.nhan.trim().slice(0, 60) : k;
    const bo: BoTinhCach = { nhan };
    if (typeof b.systemPrompt === 'string' && b.systemPrompt.trim())
      bo.systemPrompt = b.systemPrompt.slice(0, 8000);
    if (Array.isArray(b.sampleDialogues)) {
      const mau = b.sampleDialogues
        .filter((x): x is { user: string; bot: string } => {
          const o = x as { user?: unknown; bot?: unknown };
          return typeof o?.user === 'string' && typeof o?.bot === 'string';
        })
        .map((x) => ({ user: x.user.slice(0, 600), bot: x.bot.slice(0, 2000) }))
        .filter((x) => x.user.trim() && x.bot.trim())
        .slice(0, 20);
      if (mau.length) bo.sampleDialogues = mau;
    }
    if (Array.isArray(b.tuKhoa)) {
      const tk = b.tuKhoa
        .filter((x): x is string => typeof x === 'string')
        .map((x) => x.trim().slice(0, 40))
        .filter(Boolean)
        .slice(0, 8);
      if (tk.length) bo.tuKhoa = tk;
    }
    if (typeof b.chaoDoi === 'string' && b.chaoDoi.trim())
      bo.chaoDoi = b.chaoDoi.trim().slice(0, 300);
    ra[k.trim().slice(0, 40)] = bo;
  }
  return Object.keys(ra).length ? ra : null;
}
