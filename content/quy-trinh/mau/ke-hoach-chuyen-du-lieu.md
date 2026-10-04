# Kế hoạch chuyển dữ liệu & đối soát (Data Migration & Reconciliation Plan)

> **Mục đích:** đưa dữ liệu từ hệ thống cũ sang hệ thống mới đầy đủ, đúng, hợp pháp — được tập dượt trước và có đường quay lui.
> **Ai điền:** Dữ liệu & AI chủ trì; BA (quy tắc nghiệp vụ), Dev (script), QA (đối soát), DevOps (cutover); chủ sở hữu dữ liệu phía khách xác nhận.
> **Khi nào:** giai đoạn 10 · Chuyển đổi & di trú dữ liệu; thực hiện thật ở giai đoạn 16 · Triển khai & bàn giao.
> **Chuẩn tham chiếu:** DAMA-DMBOK2, ISO/IEC 25012:2008 (chất lượng dữ liệu), quy định hiện hành về dữ liệu cá nhân.

---

## 1. Phạm vi
| Hệ thống nguồn | Đối tượng dữ liệu | Số bản ghi ước tính | Chủ sở hữu | Chuyển / bỏ / lưu trữ riêng |
|---|---|---|---|---|

## 2. Đánh giá chất lượng dữ liệu nguồn
| Đối tượng | Đầy đủ | Trùng lặp | Sai định dạng | Mồ côi (khoá ngoại hỏng) | Ghi chú |
|---|---|---|---|---|---|

## 3. Dữ liệu cá nhân
| Trường | Cần cho hệ mới? | Cơ sở xử lý | Xử lý (giữ / ẩn danh / bỏ) |
|---|---|---|---|

Nguyên tắc: chỉ chuyển trường thật sự cần (tối thiểu hoá); bản sao dùng thử được xoá sau khi xong.

## 4. Bảng ánh xạ trường (Field mapping)
| Bảng nguồn.trường | Kiểu nguồn | Bảng đích.trường | Kiểu đích | Quy tắc chuyển đổi | Giá trị mặc định | Ghi chú |
|---|---|---|---|---|---|---|

**Quy tắc chung:** múi giờ (lưu UTC, hiển thị +07:00), mã hoá ký tự (UTF-8), định dạng số / tiền tệ, chuẩn hoá chữ hoa thường, xử lý trùng (giữ bản mới nhất / gộp).

## 5. Script & cách chạy
- Kho mã / đường dẫn script; chạy lại được không nhân đôi (idempotent — upsert theo khoá tự nhiên).
- Chạy theo lô, ghi log từng lô (số đọc / ghi / lỗi).
- Thứ tự nạp theo phụ thuộc khoá ngoại.

## 6. Chạy thử (Rehearsal)
| Lần | Ngày | Nguồn dữ liệu (bản sao ngày …) | Thời gian chạy | Lỗi | Đối soát khớp? | Ghi chú |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |

## 7. Đối soát (Reconciliation)
| Đối tượng | Số bản ghi nguồn | Số bản ghi đích | Chênh lệch & lý do | Tổng kiểm (checksum / tổng tiền) nguồn | Đích | Mẫu ngẫu nhiên đã kiểm (n) | Người kiểm |
|---|---|---|---|---|---|---|---|

Kiểm sau nạp: khoá ngoại, ràng buộc, tổng số tiền / số lượng theo nhóm, mẫu do người dùng nghiệp vụ mở trên giao diện.

## 8. Kế hoạch cutover
| Bước | Thời điểm | Người làm | Lệnh / thao tác | Kiểm tra | Điểm quyết định tiếp / lùi |
|---|---|---|---|---|---|
| 1 | T-1 ngày | | Thông báo đóng băng dữ liệu | | |
| 2 | T0 | | Backup hệ thống cũ | Backup đọc được | |
| 3 | | | Chạy script | Log không lỗi | |
| 4 | | | Đối soát | Khớp | ☐ Tiếp ☐ Quay lui |
| 5 | | | Mở hệ thống mới | Smoke test xanh | |

## 9. Quay lui (Roll-back)
Điều kiện quay lui; các bước; thời gian ước tính; người quyết định.

## 10. Xác nhận
| Vai trò | Họ tên | Ngày | Kết quả |
|---|---|---|---|
| Chủ sở hữu dữ liệu (khách) | | | |
| Dữ liệu & AI | | | |
| QA | | | |

Lỗi dữ liệu còn lại được khách chấp nhận: …

---
*Mẫu tham khảo — https://cuongthai.com/about/quy-trinh. Đối soát bằng truy vấn và thao tác thật, không suy ra từ mã nguồn.*
