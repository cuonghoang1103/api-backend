# Chính sách sử dụng AI trong dự án (AI Usage Policy)

> ⚠️ **MẪU THAM KHẢO — CẦN LUẬT SƯ RÀ SOÁT TRƯỚC KHI SỬ DỤNG.** Đây không phải tư vấn pháp lý. Đặc biệt phần sở hữu trí tuệ với sản phẩm do AI hỗ trợ tạo ra: pháp luật Việt Nam và nhiều nước chưa có quy định rõ — luật sư hai bên phải xác nhận cho từng hợp đồng.
>
> **Mục đích:** hai bên thống nhất trước khi làm: Bên B (nhà phát triển) được dùng công cụ AI nào, dữ liệu nào tuyệt đối không được đưa vào AI, thay đổi có AI hỗ trợ được gắn nhãn và review ra sao, ai chịu trách nhiệm, và ai sở hữu kết quả.
> **Ai điền:** Pháp lý & Tài chính chủ trì; Kiến trúc giải pháp + DevOps điền danh sách công cụ và giới hạn quyền; AppSec điền phần dữ liệu; khách hàng duyệt.
> **Khi nào:** giai đoạn 04 · Hợp đồng, pháp lý & khởi động — ký làm phụ lục cùng MSA / SOW / DPA. Áp dụng xuyên suốt giai đoạn 09 · Phát triển và 11 · Kiểm thử. Cập nhật khi thêm công cụ hoặc đổi nhà cung cấp AI.
> **Liên quan:** Thoả thuận xử lý dữ liệu cá nhân (DPA) — danh sách bên xử lý phụ; Checklist Spec Fidelity — cổng đặc tả trước khi giao việc cho AI.

---

| Dự án | Phiên bản chính sách | Ngày hiệu lực | Đầu mối Bên A | Đầu mối Bên B |
|---|---|---|---|---|
| [...] | [v1.0] | [...] | [...] | [...] |

## 1. Phạm vi
Chính sách áp dụng cho mọi công cụ dùng mô hình AI (trợ lý lập trình, agent sửa mã, chatbot, công cụ sinh test / tài liệu / hình ảnh) mà Bên B và cộng tác viên của Bên B dùng khi làm dự án này — trên máy cá nhân, trong CI, hay trên hạ tầng của Bên A.

Chính sách này **không** điều chỉnh tính năng AI nằm bên trong sản phẩm giao cho Bên A — phần đó được đặc tả trong SRS và DPA.

## 2. Công cụ được phép
| Công cụ / dịch vụ | Dùng cho | Nhà cung cấp / nơi xử lý dữ liệu | Có trong DPA? | Ghi chú (chế độ quyền, gói dịch vụ) |
|---|---|---|---|---|
| [vd: AI Code — app desktop CuongThai] | [đọc / sửa mã trên máy dev] | [cổng LLM ...] | [có / không] | [chế độ hỏi trước mỗi lần sửa file hoặc chạy lệnh] |
| [...] | [...] | [...] | [...] | [...] |

- Công cụ ngoài bảng này **không được dùng** với tài liệu, mã nguồn hay dữ liệu của dự án cho tới khi Bên A đồng ý bằng văn bản và bảng được cập nhật.
- Ưu tiên gói dịch vụ có cam kết không dùng dữ liệu đầu vào để huấn luyện mô hình; nếu nhà cung cấp không cam kết, ghi rõ ở cột Ghi chú để Bên A quyết định.
- Lựa chọn chặt hơn (nếu Bên A yêu cầu): dùng tài khoản AI của chính Bên A, hoặc mô hình chạy cục bộ trên hạ tầng của Bên A.

## 3. Dữ liệu KHÔNG được đưa vào AI
Trừ khi Bên A đồng ý bằng văn bản cho từng trường hợp:
- [ ] Dữ liệu cá nhân của người dùng Bên A (họ tên, email, số điện thoại, CCCD, vị trí, ...) — kể cả trong log, ảnh chụp màn hình, file dump CSDL
- [ ] Dữ liệu cá nhân nhạy cảm (sức khoẻ, tài chính, sinh trắc học, ...) — **không bao giờ**, kể cả khi đã có đồng ý chung
- [ ] Bí mật: mật khẩu, khoá API, khoá riêng, chuỗi kết nối CSDL, token, file `.env`
- [ ] Tài liệu được đánh dấu mật theo NDA
- [ ] Mã nguồn của Bên A ngoài phạm vi repo dự án [ghi rõ repo được phép]
- [ ] [bổ sung theo dự án]

Dữ liệu dùng với AI trong phát triển và kiểm thử là **dữ liệu giả hoặc đã ẩn danh**. Lỡ đưa nhầm dữ liệu thuộc danh sách trên vào AI ⇒ xử lý như một sự cố bảo mật: báo đầu mối Bên A trong [...] giờ, ghi vào sổ sự cố.

## 4. Nhãn và truy vết (provenance)
Mỗi thay đổi có AI hỗ trợ đáng kể (mã, test, tài liệu, cấu hình) phải nối được bốn thứ:

| Thứ cần ghi | Ghi ở đâu | Ví dụ |
|---|---|---|
| Nhãn "AI-assisted" | Mô tả PR / thẻ việc | `AI-assisted: yes` |
| Công cụ và model | Mô tả PR | [tên công cụ · tên model] |
| Phiên bản đặc tả đã dùng | Mô tả PR — ID yêu cầu + phiên bản SRS | `REQ-012 · SRS v1.3` |
| Kết quả cổng kiểm | PR / CI | người review, CI xanh, test liên quan |

"Đáng kể" nghĩa là AI viết hoặc sửa phần logic, test hay cấu hình — không tính gợi ý tự hoàn thành một dòng. Ranh giới cụ thể: [hai bên thống nhất].

## 5. Review độc lập và quyền phát hành
- AI **không tự duyệt phát hành** thứ chính nó viết. Mọi thay đổi có nhãn AI-assisted được **một người khác** người giao việc cho AI review trước khi merge.
- Test do AI viết hoặc sửa không được dùng làm bằng chứng duy nhất cho chính đoạn mã AI vừa viết — cần ít nhất một bước kiểm độc lập (test do người viết, tiêu chí chấp nhận đã ký, hoặc review thủ công phần đó).
- Phần nhạy cảm (xác thực, phân quyền, thanh toán, xử lý dữ liệu cá nhân, migration CSDL) do AppSec / người có thẩm quyền review, kể cả khi AI chỉ sửa ít.
- Agent AI **không có quyền ghi trên production**; quyền đọc / ghi / chạy lệnh của agent trên môi trường dev và CI được liệt kê ở bảng mục 2.

## 6. Trách nhiệm
- Người bấm duyệt (review / merge) chịu trách nhiệm về thay đổi như với mã do người viết. "Do AI viết" không phải lý do miễn trừ.
- Bên B chịu trách nhiệm với Bên A về chất lượng sản phẩm theo hợp đồng, không phụ thuộc phần nào có AI hỗ trợ.
- Bảo hành áp dụng như nhau cho mọi phần sản phẩm.

## 7. Sở hữu trí tuệ với sản phẩm có AI hỗ trợ (luật sư xác nhận)
- Quyền sở hữu sản phẩm bàn giao chuyển cho Bên A theo điều khoản sở hữu trí tuệ của MSA / SOW, **không phân biệt** phần nào có AI hỗ trợ.
- Lưu ý pháp lý: việc kết quả do AI tạo ra có được bảo hộ quyền tác giả hay không **chưa có quy định rõ** ở Việt Nam và còn khác nhau giữa các nước. Phần đóng góp sáng tạo của con người (thiết kế, chọn lọc, sửa đổi, review) cần được ghi nhận qua lịch sử commit và nhãn ở mục 4. [Luật sư hai bên xác nhận cách xử lý.]
- Bên B kiểm mã do AI gợi ý để tránh chép nguyên văn mã có giấy phép không tương thích (vd copyleft): bật bộ lọc trùng mã công khai nếu công cụ có; quét giấy phép phụ thuộc trong CI.
- Điều khoản sử dụng của nhà cung cấp AI (quyền với đầu ra, giới hạn sử dụng) được đính kèm hoặc dẫn link tại bảng mục 2.

## 8. Thay đổi chính sách
- Thêm công cụ, đổi nhà cung cấp, hoặc mở rộng loại dữ liệu được đưa vào AI ⇒ cập nhật phiên bản chính sách và Bên A duyệt bằng văn bản **trước** khi áp dụng.
- Bên A có quyền yêu cầu ngừng dùng một công cụ AI bất kỳ lúc nào; ảnh hưởng tới tiến độ / chi phí xử lý qua phiếu yêu cầu thay đổi (CR).

## Ký xác nhận
| | Bên A | Bên B |
|---|---|---|
| Họ tên · chức vụ | [...] | [...] |
| Chữ ký · ngày | [...] | [...] |

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh. Khái niệm tách quyền tổng hợp / quyền phát hành và truy vết tham khảo báo cáo kỹ thuật SDAD (arXiv:2608.20341, chưa bình duyệt).*
