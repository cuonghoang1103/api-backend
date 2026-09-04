/**
 * SỔ CỦA MỘT CUỘC HỘI THOẠI.
 *
 * Từ khi app mở được nhiều cuộc cùng lúc, mọi trạng thái "đang làm dở" phải
 * thuộc về MỘT cuộc chứ không thuộc về app. Trước đó chúng là biến module —
 * đúng khi chỉ có một cuộc, và sai câm lặng ngay khi có hai:
 *
 *   • `nhatKyHoanTac` chung ⇒ bấm Hoàn tác ở tab A lùi luôn file tab B vừa sửa.
 *   • `quyenDaCap` chung ⇒ duyệt `npm test` ở tab A thì tab B cũng tự chạy, mà
 *     người dùng chưa từng nhìn thấy nó.
 *
 * Cả hai đều không báo lỗi. Chúng chỉ làm sai thứ người dùng tin là đúng.
 */
export interface SoCuoc {
  /** Nội dung file TRƯỚC lần cuộc này chạm vào đầu tiên. `null` = file chưa từng tồn tại. */
  nhatKyHoanTac: Map<string, string | null>;
  /** Khoá đã được "cho phép cả …" trong cuộc này. Không bao giờ ghi xuống đĩa. */
  quyenDaCap: Set<string>;
  /**
   * Thư mục người dùng đã chọn cho `web_tai` ghi vào, của RIÊNG cuộc này.
   *
   * ⚠️ Đây là ranh giới cho phép của việc tải file, và nó phải là một lựa chọn
   * CÓ Ý THỨC chứ không phải mặc định: `web_tai` ghi ra ổ đĩa thật, ngoài thư
   * mục dự án, nên không có `jail.ts` nào đỡ. Người dùng tự chọn bằng hộp thoại
   * hệ điều hành ở lần tải đầu tiên; sau đó mọi file của cuộc này rơi vào đúng
   * đó và không hỏi lại nữa — hỏi 200 lần cho 200 file thì họ sẽ bấm bừa.
   *
   * `null` = chưa chọn. Không kế thừa sang cuộc khác, không ghi xuống đĩa.
   */
  thuMucTai: string | null;
  /**
   * Lượt hỏi hiện tại, đếm từ 1. Tăng mỗi khi người dùng gửi một câu mới.
   *
   * Đây là mốc neo cho việc LÙI FILE về đúng một điểm trong hội thoại. Nó phải
   * dùng CÙNG cách đếm với `quayLui` ở `loop.ts` — "câu hỏi thứ k của người
   * dùng" — vì đó là thứ duy nhất dịch được giữa bảng ghi trên màn hình và
   * lịch sử giao thức. Đếm theo bất cứ thứ gì khác (số vòng, số tool) là hai
   * bên trôi khỏi nhau và nút lùi trỏ sai chỗ mà không ai thấy.
   */
  luot: number;
  /**
   * Nội dung file TRƯỚC lần đụng đầu tiên TRONG TỪNG LƯỢT.
   *
   * Khác `nhatKyHoanTac` ở đúng một điểm, và đó là cả lý do nó tồn tại:
   * `nhatKyHoanTac` chỉ nhớ trạng thái trước lần đụng đầu tiên của CẢ CUỘC, nên
   * nó chỉ trả lời được câu "về lại lúc bắt đầu". Sổ này nhớ theo lượt, nên trả
   * lời được "về lại lúc trước câu hỏi thứ k".
   *
   * Lùi về lượt k = duyệt NGƯỢC từ cuối, khôi phục mọi mục có `luot >= k`. Đi
   * ngược thì bản ghi SỚM NHẤT của mỗi file là bản được ghi sau cùng — đúng là
   * trạng thái ngay trước lượt k.
   */
  buocGhi: Array<{ luot: number; duong: string; truoc: string | null }>;
}

export function taoSoCuoc(): SoCuoc {
  return { nhatKyHoanTac: new Map(), quyenDaCap: new Set(), thuMucTai: null, luot: 1, buocGhi: [] };
}

/**
 * Ghi lại trạng thái TRƯỚC của một file, vào cả hai sổ.
 *
 * MỘT chỗ duy nhất thay vì rắc `if (!so.nhatKyHoanTac.has(...))` ra bốn nơi
 * trong `tools.ts`: thêm một tool ghi file mới mà quên một trong hai sổ thì
 * nút hoàn tác hoặc nút lùi lặng lẽ bỏ sót đúng file đó — không lỗi, chỉ mất.
 */
export function ghiSoTruoc(so: SoCuoc, duong: string, truoc: string | null): void {
  if (!so.nhatKyHoanTac.has(duong)) so.nhatKyHoanTac.set(duong, truoc);
  // Trong MỘT lượt, chỉ giữ lần đụng đầu tiên của mỗi file.
  const daCoTrongLuot = so.buocGhi.some((b) => b.luot === so.luot && b.duong === duong);
  if (!daCoTrongLuot) so.buocGhi.push({ luot: so.luot, duong, truoc });
}
