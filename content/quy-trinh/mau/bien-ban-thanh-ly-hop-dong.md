# Biên bản thanh lý hợp đồng (Contract Liquidation Record)

> ⚠️ **MẪU THAM KHẢO — CẦN LUẬT SƯ VÀ KẾ TOÁN RÀ SOÁT TRƯỚC KHI SỬ DỤNG.** Đây không phải tư vấn pháp lý. Số liệu quyết toán, hoá đơn và các nghĩa vụ còn lại phải được kế toán và luật sư hai bên kiểm tra.
>
> **Mục đích:** chính thức xác nhận hợp đồng đã thực hiện xong (hoặc dừng giữa chừng): làm được bao nhiêu, đáng giá bao nhiêu, đã trả bao nhiêu, còn nợ bao nhiêu; quyền sở hữu trí tuệ, mã nguồn, tài khoản đã về tay ai; và nghĩa vụ nào **vẫn còn** sau thanh lý (bảo hành, bảo mật).
> **Ai điền:** Pháp lý & Tài chính chủ trì (giá trị, công nợ, hoá đơn); PM cung cấp khối lượng và tình trạng bàn giao; DevOps xác nhận tài khoản, quyền truy cập; người đại diện hai bên ký.
> **Khi nào:** giai đoạn 17 · Đóng dự án — sau biên bản nghiệm thu cuối và biên bản bàn giao. Cũng dùng khi **chấm dứt hợp đồng trước hạn** (ghi rõ lý do ở mục 1).
> **Khác với biên bản đóng dự án:** biên bản đóng dự án là hồ sơ **quản lý dự án** (bài học, lưu trữ, thu hồi quyền nội bộ); biên bản thanh lý là văn bản **pháp lý – tài chính** giữa hai bên, chấm dứt quyền và nghĩa vụ của hợp đồng.

---

**Số biên bản:** [...]  **Ngày lập:** [...]  **Địa điểm:** [...]

Căn cứ:
- Hợp đồng số [...] ký ngày [...] và các phụ lục, SOW số [...];
- Các phiếu yêu cầu thay đổi (CR) đã duyệt số [...];
- Biên bản nghiệm thu cuối số [...] ngày [...]; biên bản bàn giao số [...] ngày [...];
- [Thông báo chấm dứt hợp đồng số ... ngày ... — nếu chấm dứt trước hạn].

## Các bên
| | Bên A (Khách hàng) | Bên B (Nhà cung cấp) |
|---|---|---|
| Tên pháp nhân / cá nhân | [...] | [...] |
| Mã số thuế | [...] | [...] |
| Địa chỉ | [...] | [...] |
| Người đại diện · chức vụ | [...] | [...] |

Hai bên thống nhất thanh lý hợp đồng với các nội dung sau:

## 1. Tình trạng thực hiện
- [ ] Hoàn thành toàn bộ phạm vi hợp đồng và các CR đã duyệt.
- [ ] Chấm dứt trước hạn. Lý do: [...]. Bên đề nghị: [...]. Căn cứ điều khoản: [...].

## 2. Khối lượng đã thực hiện
| # | Hạng mục / mốc | Theo hợp đồng / CR | Đã thực hiện & nghiệm thu | Biên bản nghiệm thu số | Ghi chú |
|---|---|---|---|---|---|
| 1 | [...] | [...] | [...] | [...] | |
| 2 | [...] | [...] | [...] | [...] | |
| 3 | CR số [...] | [...] | [...] | [...] | |

Phần chưa thực hiện (nếu có) và cách xử lý: [...]

## 3. Giá trị & quyết toán
| Khoản | Số tiền |
|---|---|
| Giá trị hợp đồng ban đầu (trước thuế) | [...] |
| Điều chỉnh do CR (+ / −) | [...] |
| Giảm trừ do phần chưa thực hiện / phạt vi phạm (nếu có) | [...] |
| **Giá trị quyết toán (trước thuế)** | [...] |
| Thuế GTGT [... % / không chịu thuế — kế toán xác định] | [...] |
| **Giá trị quyết toán (sau thuế)** | [...] |
| Bên A đã thanh toán | [...] |
| **Còn lại phải thanh toán** (Bên A → Bên B, hoặc Bên B hoàn trả Bên A) | [...] |
| Bằng chữ | [...] |

| Đợt đã thanh toán | Ngày | Số tiền | Hoá đơn số |
|---|---|---|---|
| [...] | [...] | [...] | [...] |

Thời hạn thanh toán / hoàn trả phần còn lại: [...] ngày kể từ ngày ký biên bản này, vào tài khoản [...]. Hoá đơn điện tử cho phần còn lại: [...].

## 4. Bàn giao quyền sở hữu trí tuệ, mã nguồn, tài khoản
| Hạng mục | Tình trạng | Bằng chứng / nơi lưu | Xác nhận Bên A |
|---|---|---|---|
| Quyền tài sản đối với sản phẩm viết riêng | [Đã chuyển giao cho Bên A kể từ ngày thanh toán đủ — theo điều ... hợp đồng] | | ☐ |
| Tài sản có sẵn của Bên B (thư viện, khung, công cụ) | [Bên B giữ quyền; Bên A được dùng theo giấy phép điều ...] | | ☐ |
| Thành phần mã nguồn mở / bên thứ ba | Danh mục giấy phép đã bàn giao | [...] | ☐ |
| Mã nguồn (kho mã, toàn bộ lịch sử commit) | [Đã chuyển quyền sở hữu kho / đã bàn giao bản sao tại ...] | [...] | ☐ |
| Tài liệu (SRS, SDD, runbook, hướng dẫn sử dụng, vận hành) | [...] | [...] | ☐ |
| Tài khoản gốc: tên miền, cloud, kho ứng dụng (App Store / Google Play), email, dịch vụ trả phí | [Đứng tên Bên A / đã chuyển chủ sở hữu] | [...] | ☐ |
| Bí mật & khoá (mật khẩu, API key, chứng chỉ) | Đã bàn giao qua kênh an toàn **và đã xoay vòng (rotate)** sau bàn giao | [...] | ☐ |
| Quyền truy cập của nhân sự Bên B vào hệ thống Bên A | [Đã thu hồi ngày ... / giữ lại cho bảo hành — danh sách tại mục 5] | [...] | ☐ |
| Dữ liệu của Bên A do Bên B đang giữ | [Đã trả / đã xoá — biên bản xoá số ...] | [...] | ☐ |

## 5. Nghĩa vụ còn lại sau thanh lý
Hợp đồng chấm dứt, **trừ** các nghĩa vụ sau vẫn tiếp tục hiệu lực:
| Nghĩa vụ | Bên chịu | Đến khi | Căn cứ |
|---|---|---|---|
| Bảo hành | Bên B | [ngày ... (… tháng từ nghiệm thu cuối)] | Điều [...] hợp đồng; chính sách bảo hành |
| Bảo mật thông tin | Hai bên | [... năm kể từ ngày ...] | Điều [...] hợp đồng / NDA số [...] |
| Bảo vệ dữ liệu cá nhân, xoá dữ liệu còn lại | Bên B | [...] | DPA số [...] |
| Thanh toán phần còn lại | [...] | [...] | Mục 3 |
| Quyền truy cập giữ lại cho bảo hành | Bên B | Thu hồi khi hết bảo hành | [...] |
| [Hợp đồng bảo trì riêng, nếu có] | | | Hợp đồng số [...] |

## 6. Cam kết
- Sau khi các nghĩa vụ ở mục 3 hoàn tất, hai bên **không còn khiếu nại** nào khác liên quan đến hợp đồng, ngoài các nghĩa vụ tiếp tục ở mục 5. [luật sư rà soát câu này — đây là điều khoản quan trọng nhất của biên bản].
- Biên bản lập thành [...] bản có giá trị như nhau, mỗi bên giữ [...] bản; ký bằng chữ ký số có giá trị như bản giấy.

| | Đại diện Bên A | Đại diện Bên B |
|---|---|---|
| Họ tên, chức vụ | | |
| Chữ ký / chữ ký số, đóng dấu | | |
| Ngày | | |

---

### Checklist nội bộ trước khi ký
- [ ] Số liệu mục 3 đã đối chiếu với sổ kế toán và từng hoá đơn
- [ ] Mọi CR có phí đã nằm trong bảng; CR bị từ chối không lọt vào
- [ ] Mục 4 không còn ô "chưa rõ" — đặc biệt tài khoản gốc và bí mật đã xoay vòng
- [ ] Ngày hết bảo hành và hết nghĩa vụ bảo mật đã ghi vào lịch theo dõi
- [ ] Bản đã ký lưu cùng hồ sơ đóng dự án

---
*Mẫu tham khảo, không phải tư vấn pháp lý — https://cuongthai.com/about/quy-trinh. Bắt buộc có luật sư và kế toán rà soát.*
