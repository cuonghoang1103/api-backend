'use client';

/**
 * Trang chủ "/" — cửa vào CuongThai.
 *
 * ─── VÌ SAO VIẾT LẠI (30/7/2026) ─────────────────────────────────────────────
 * Bản cũ bị chê thẳng là "nhìn như AI làm". Audit bằng skill hallmark đếm được
 * 8 lỗi critical + 8 major, và tất cả đều là DẤU HIỆU CÓ TÊN:
 *
 *   · aurora-blob background   — 3 quả mờ tím/lam/hồng trôi vô hạn
 *   · purple-gradient hero     — chữ gradient tím→lam
 *   · full-viewport centred hero + huy hiệu viên thuốc có chấm xanh
 *   · 3-column feature grid    — 6 thẻ icon đều tăm tắp
 *   · icon-tile feature card   — ô bo góc nhuộm màu + icon lucide, lặp 6 lần
 *   · shadow-glow on dark      — đổ bóng theo màu nhấn
 *   · universal hover:scale + fade-up áp cho MỌI khối
 *   · invented metrics         — 4 con số gõ cứng, không đếm từ đâu cả
 *
 * Sửa từng cái một thì vẫn ra khuôn cũ. Nên đổi hẳn CẤU TRÚC:
 *
 * ─── CẤU TRÚC: Ecosystem Index ───────────────────────────────────────────────
 * Không phải phễu tiếp thị (hero → 3 cột → CTA → footer) mà là NHIỀU DẢI NỘI
 * DUNG ĐỂ DUYỆT. Lý do: thứ đáng giá nhất của site này là bề rộng nội dung
 * thật — hàng nghìn bài tập, hàng chục môn, hàng trăm chương. Trang chủ nên cho
 * người ta THẤY và ĐI VÀO, chứ không phải thuyết phục bằng lời.
 * Cùng họ với Are.na, Figma Community, Behance.
 *
 * ─── LUẬT GIỮ KHI SỬA TIẾP ───────────────────────────────────────────────────
 * 1. KHÔNG căn giữa cả trang. Lề trái là trục — đó là thứ tạo ra nhịp đọc.
 * 2. KHÔNG gradient trên chữ, KHÔNG glow theo màu nhấn, KHÔNG blob mờ.
 * 3. Hover chỉ đổi ĐƯỜNG VIỀN và MÀU CHỮ. Không `scale`, không nhấc lên.
 * 4. Không bịa con số. (Khối số liệu đếm từ CSDL đã gỡ 10/11/2026 — thay bằng
 *    làng agent `agentWorld/`.)
 * 5. Màu lấy từ TOKEN, không gán mã hex thẳng vào lớp — xem luật mới ngay dưới.
 *
 * ─── LỚP MÀU RIÊNG (07/08/2026) ──────────────────────────────────────────────
 * User chê "chữ màu trắng và nền chưa nổi bật". Đúng, và nguyên nhân không nằm
 * ở trang này: trang chủ đang mượn nguyên bảng token toàn site — bảng kiểu
 * Facebook, `#18191a` nền / `#e4e6eb` chữ / `#3e4042` viền, CHROMA BẰNG 0 ở cả
 * ba. Bảng đó đúng cho Feed và Messenger (nội dung là ảnh, giao diện phải lùi
 * lại) nhưng đặt lên trang chủ thì thành xám chết.
 *
 * Nay trang chủ có LỚP MÀU RIÊNG: class `landing-root` (định nghĩa ở cuối
 * `globals.css`) ghi đè các token đó CHỈ TRONG PHẠM VI trang này — nền ngả xanh
 * mực và tối sâu hơn, chữ sáng gần trắng ngà, nhấn đổi sang hổ phách ấm. Luật
 * số 5 vẫn nguyên: component KHÔNG được gán hex, chỉ dùng `var(...)`; muốn màu
 * mới thì thêm biến vào khối `.landing-root` rồi gọi ra. Đó là điều kiện để nút
 * đổi sáng/tối còn chạy đúng.
 *
 * Kèm hai lớp chất liệu, cũng khai báo ở `globals.css`:
 *   · `.landing-grain`   — hạt nhiễu ~4%, đứng yên khi cuộn. Nền phẳng tuyệt
 *                          đối đọc ra "trống"; có hạt mới đọc ra "sâu".
 *   · `.landing-measure` — hai kẻ dọc đúng mép khổ chữ, chạy suốt trang, giao
 *                          với các đường ngang của từng dải thành một lưới.
 * Cả hai KHÔNG phải blob mờ và KHÔNG phải glow — vẫn đúng luật 2.
 */
// Bản "Ecosystem Index" cũ (`LegacyRiveLanding` + mảng RAILS) đã gỡ 11/11/2026 — không còn ai gọi. Trang thật ở
// `LandingExperience.tsx`; danh mục ở `landingCopy.ts`. Các LUẬT ở chú thích trên vẫn áp dụng.
export { default } from './LandingExperience';
