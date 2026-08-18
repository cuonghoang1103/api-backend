/**
 * ============================================================
 * KHI NÀO CẦN TÌM WEB
 * ============================================================
 *
 * ─── VÌ SAO DÙNG LUẬT, KHÔNG HỎI MODEL ───
 * Cách "đúng bài" là để model tự quyết bằng tool. Nhưng đường chat hiện tại
 * không có vòng gọi tool, và thêm một lời gọi model chỉ để hỏi "có cần tìm
 * không" thì MỌI câu đều phải trả thêm ~1-2 giây và thêm một lượt tiền —
 * kể cả câu "chào bạn".
 *
 * Bộ luật dưới đây chạy trong micro-giây, tốn 0 đồng, và bắt đúng nhóm câu
 * thật sự cần: hỏi về thứ MỚI, thứ ĐỔI THEO THỜI GIAN, hoặc thứ model
 * không thể biết vì nó xảy ra sau ngày cắt dữ liệu.
 *
 * ⚠️ NGUYÊN TẮC: THÀ BỎ SÓT CÒN HƠN TÌM BỪA. Tìm nhầm thì kết quả rác lọt
 * vào ngữ cảnh và model bịa dựa trên rác — tệ hơn hẳn việc nó trả lời bằng
 * kiến thức sẵn có. Nên mọi dấu hiệu ở đây đều phải là dấu hiệu MẠNH.
 */

/** Người dùng nói thẳng là muốn tra cứu. */
const NOI_THANG = [
  'tìm giúp', 'tìm trên mạng', 'tra cứu', 'search', 'google', 'tìm web',
  'tìm kiếm', 'lên mạng', 'tra giúp',
];

/** Hỏi về thứ ĐỔI THEO THỜI GIAN — kiến thức sẵn có gần như chắc chắn cũ. */
const THEO_THOI_GIAN = [
  'mới nhất', 'hiện nay', 'hiện tại', 'bây giờ', 'gần đây', 'vừa rồi',
  'năm nay', 'tháng này', 'hôm nay', 'đang', 'cập nhật',
  'giá', 'bao nhiêu tiền', 'tỷ giá', 'thời tiết', 'tin tức', 'lịch thi đấu',
  'phiên bản mới', 'ra mắt', 'sắp ra',
];

/** Năm từ 2026 trở đi — sau ngày cắt dữ liệu của phần lớn model. */
const NAM_MOI = /\b20(2[6-9]|[3-9]\d)\b/;

/** Có địa chỉ web trong câu hỏi ⇒ người dùng đang muốn nói về trang đó. */
const CO_URL = /https?:\/\/\S+|\bwww\.\S+/i;

export interface QuyetDinh {
  can: boolean;
  /** Câu đưa cho máy tìm kiếm. Thường là chính câu hỏi, đã cắt bớt. */
  cauTim: string;
  /** Vì sao — cho log và cho việc gỡ lỗi sau này. */
  viSao: string;
}

export function canTimWeb(cauHoi: string): QuyetDinh {
  const q = (cauHoi ?? '').trim();
  const thuong = q.toLowerCase();
  const khong: QuyetDinh = { can: false, cauTim: '', viSao: '' };

  // Câu quá ngắn thì không đủ nghĩa để tìm ("ok", "cảm ơn", "ừ").
  if (q.length < 8) return khong;

  // Câu chào/cảm ơn — chặn sớm, vì chúng hay chứa từ "hiện tại", "bây giờ".
  if (/^(chào|hi|hello|cảm ơn|cám ơn|thanks|ok|được rồi)\b/i.test(thuong)) return khong;

  const dau = (ds: string[]): string | null => ds.find((t) => thuong.includes(t)) ?? null;

  const noiThang = dau(NOI_THANG);
  if (noiThang) return { can: true, cauTim: catCauTim(q), viSao: `người dùng nói thẳng: "${noiThang}"` };

  if (CO_URL.test(q)) return { can: true, cauTim: catCauTim(q), viSao: 'câu hỏi có địa chỉ web' };

  if (NAM_MOI.test(q)) {
    return { can: true, cauTim: catCauTim(q), viSao: 'hỏi về năm sau ngày cắt dữ liệu' };
  }

  const thoiGian = dau(THEO_THOI_GIAN);
  if (thoiGian) {
    // ⚠️ Một dấu hiệu thời gian ĐƠN LẺ chưa đủ. "đang" và "giá" xuất hiện
    // trong vô số câu chẳng liên quan gì tới tra cứu ("giá trị của biến",
    // "đang chạy hàm nào"). Đòi thêm dấu hiệu thứ hai: câu phải là câu HỎI.
    if (/[?？]|^(cho|hỏi|xem|kiểm tra)\b|\b(là gì|bao nhiêu|thế nào|ở đâu|khi nào|ai là)\b/i.test(thuong)) {
      return { can: true, cauTim: catCauTim(q), viSao: `dấu hiệu thời gian: "${thoiGian}"` };
    }
  }

  return khong;
}

/**
 * Cắt câu hỏi thành câu tìm.
 *
 * Máy tìm kiếm làm việc kém với câu dài lê thê. Bỏ phần xưng hô và cắt còn
 * ~200 ký tự — phần đầu câu hỏi gần như luôn chứa ý chính.
 */
function catCauTim(q: string): string {
  return q
    .replace(/^(bạn|em|anh|chị|cậu|tớ)\s+(ơi|à|này)?[,\s]*/i, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);
}
