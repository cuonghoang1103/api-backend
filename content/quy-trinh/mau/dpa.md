# Thoả thuận xử lý dữ liệu cá nhân (Data Processing Agreement — DPA)

> ⚠️ **MẪU THAM KHẢO — CẦN LUẬT SƯ RÀ SOÁT TRƯỚC KHI SỬ DỤNG.** Đây không phải tư vấn pháp lý. Điều khoản, căn cứ pháp lý và văn bản hiện hành phải được luật sư của hai bên kiểm tra cho từng giao dịch.
>
> **Mục đích:** khi Bên B (nhà phát triển / vận hành) chạm vào dữ liệu cá nhân của người dùng Bên A — trong lúc phát triển, chuyển dữ liệu, kiểm thử, vận hành hay bảo trì — hai bên ghi rõ ai quyết định, ai làm theo chỉ dẫn, được làm gì với dữ liệu, bảo vệ thế nào, báo vi phạm ra sao, và dữ liệu đi đâu khi kết thúc.
> **Ai điền:** Pháp lý & Tài chính chủ trì; Kiến trúc giải pháp + DevOps điền phần dữ liệu, hệ thống, bên xử lý phụ; AppSec điền biện pháp bảo vệ; luật sư hai bên rà soát.
> **Khi nào:** giai đoạn 04 · Hợp đồng, pháp lý & khởi động — ký cùng hợp đồng khung (MSA) / SOW, làm phụ lục. Cập nhật lại khi thêm bên xử lý phụ hoặc khi thay đổi mục đích xử lý.
>
> ⚖️ **Về căn cứ pháp lý — đọc trước khi dùng:** mẫu này được dựng theo khung của **Nghị định 13/2023/NĐ-CP** về bảo vệ dữ liệu cá nhân. Từ **01/01/2026**, **Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15** có hiệu lực và **Nghị định 356/2025/NĐ-CP** (quy định chi tiết Luật) **thay thế Nghị định 13/2023/NĐ-CP**. Các khái niệm cốt lõi (Bên Kiểm soát, Bên Xử lý, hồ sơ đánh giá tác động, chuyển dữ liệu ra nước ngoài, thông báo vi phạm) vẫn còn, nhưng **số điều, thời hạn, cơ quan tiếp nhận và mẫu hồ sơ phải được luật sư đối chiếu theo văn bản đang có hiệu lực**. Chỗ nào dưới đây ghi số điều của Nghị định 13 là để truy vết nguồn gốc, không phải căn cứ hiện hành.

---

## Căn cứ (cần luật sư cập nhật)
- Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (hiệu lực 01/01/2026);
- Nghị định 356/2025/NĐ-CP quy định chi tiết Luật Bảo vệ dữ liệu cá nhân (thay thế Nghị định 13/2023/NĐ-CP);
- Nghị định 13/2023/NĐ-CP — khung tham chiếu gốc của mẫu này (đã được thay thế);
- Bộ luật Dân sự 2015; Luật An ninh mạng 2018 (24/2018/QH14) [luật sư xác nhận phạm vi áp dụng];
- Hợp đồng khung (MSA) số [...] và SOW số [...] giữa hai bên.

## Các bên & vai trò
| | Bên A | Bên B |
|---|---|---|
| Tên pháp nhân | [...] | [...] |
| Người đại diện · chức vụ | [...] | [...] |
| **Vai trò dữ liệu** | **Bên Kiểm soát dữ liệu cá nhân** (Controller) — quyết định mục đích và phương tiện xử lý | **Bên Xử lý dữ liệu cá nhân** (Processor) — xử lý thay mặt Bên A, theo chỉ dẫn của Bên A |
| Đầu mối bảo vệ dữ liệu (DPO / người phụ trách) | [họ tên, email, điện thoại] | [họ tên, email, điện thoại] |

> Nếu Bên B cũng tự quyết định mục đích xử lý một phần dữ liệu (ví dụ: dùng log để cải thiện sản phẩm của chính mình) thì phần đó Bên B **không còn là Bên Xử lý** — phải tách riêng và luật sư xác định lại vai trò (Bên Kiểm soát và xử lý).

## Điều 1. Phạm vi xử lý (mô tả xử lý — Processing details)
| Mục | Nội dung |
|---|---|
| Mục đích xử lý | [ví dụ: phát triển, kiểm thử, chuyển dữ liệu sang hệ thống mới, vận hành và bảo trì hệ thống "..." theo SOW số ...] |
| Hoạt động xử lý | [thu thập / lưu trữ / chỉnh sửa / truy xuất / sao lưu / xoá — chọn đúng việc Bên B thật sự làm] |
| Chủ thể dữ liệu | [khách hàng của Bên A / nhân viên / người dùng ứng dụng / ...] |
| Loại dữ liệu cá nhân **cơ bản** | [họ tên, email, số điện thoại, địa chỉ, ...] |
| Loại dữ liệu cá nhân **nhạy cảm** (nếu có) | [ví dụ: sức khoẻ, tài chính, vị trí, sinh trắc học ... — ghi "không có" nếu không có; có thì cần biện pháp tăng cường và luật sư xác nhận nghĩa vụ riêng] |
| Số lượng ước tính | [... bản ghi / ... chủ thể] |
| Hệ thống / nơi lưu trữ | [môi trường prod / staging / máy phát triển — ghi rõ môi trường nào được phép có dữ liệu thật] |
| Thời hạn xử lý | Từ [...] đến [khi SOW / hợp đồng bảo trì kết thúc] |

**Nguyên tắc tối thiểu hoá:** môi trường phát triển và kiểm thử dùng **dữ liệu giả hoặc đã ẩn danh**; chỉ môi trường [...] được chứa dữ liệu thật, trừ khi Bên A đồng ý bằng văn bản cho từng trường hợp.

## Điều 2. Nghĩa vụ của Bên B (Bên Xử lý)
1. Chỉ xử lý dữ liệu theo **chỉ dẫn bằng văn bản** của Bên A (bao gồm hợp đồng, SOW, phiếu yêu cầu đã duyệt, email từ đầu mối được chỉ định); báo ngay nếu cho rằng một chỉ dẫn trái pháp luật.
2. Không dùng dữ liệu cho mục đích riêng của Bên B; không bán, không chia sẻ; không dùng để huấn luyện mô hình AI.
3. Bảo đảm mọi người được tiếp cận dữ liệu có nghĩa vụ bảo mật và chỉ tiếp cận ở mức cần thiết.
4. Áp dụng các biện pháp bảo vệ tại Điều 4.
5. Hỗ trợ Bên A đáp ứng yêu cầu của chủ thể dữ liệu (truy cập, chỉnh sửa, xoá, rút lại đồng ý, hạn chế xử lý...) trong vòng [...] ngày làm việc kể từ khi Bên A yêu cầu.
6. Hỗ trợ Bên A lập **hồ sơ đánh giá tác động xử lý dữ liệu cá nhân** và hồ sơ chuyển dữ liệu ra nước ngoài (nếu có) bằng cách cung cấp thông tin kỹ thuật về hệ thống và biện pháp bảo vệ.
7. Lưu nhật ký (log) truy cập và thao tác trên dữ liệu cá nhân trong [...] tháng; cung cấp khi Bên A yêu cầu.
8. Cho phép Bên A (hoặc đơn vị kiểm toán độc lập do Bên A chỉ định, có cam kết bảo mật) kiểm tra việc tuân thủ, báo trước [...] ngày làm việc, tối đa [...] lần / năm, trừ khi có sự cố.

## Điều 3. Nghĩa vụ của Bên A (Bên Kiểm soát)
- Bảo đảm có **cơ sở pháp lý** cho việc xử lý (sự đồng ý của chủ thể dữ liệu hoặc trường hợp không cần đồng ý theo luật) và đã thông báo cho chủ thể dữ liệu theo quy định;
- Đưa chỉ dẫn rõ ràng, hợp pháp; chỉ chuyển cho Bên B lượng dữ liệu cần thiết;
- Thực hiện các thủ tục với cơ quan chức năng thuộc trách nhiệm của Bên Kiểm soát (hồ sơ đánh giá tác động, thông báo vi phạm...).

## Điều 4. Biện pháp bảo vệ (Technical & organisational measures)
| Nhóm | Biện pháp tối thiểu (điền / sửa theo hệ thống thật) |
|---|---|
| Kiểm soát truy cập | Tài khoản riêng từng người; MFA cho quản trị; quyền tối thiểu; thu hồi trong [...] giờ khi người rời dự án |
| Mã hoá | TLS khi truyền; mã hoá khi lưu với dữ liệu nhạy cảm [thuật toán / cơ chế quản lý khoá: ...] |
| Tách môi trường | Dữ liệu thật chỉ ở [...]; dev/test dùng dữ liệu giả hoặc đã ẩn danh |
| Sao lưu | Tần suất [...]; mã hoá bản sao lưu; thử khôi phục [...] / lần |
| Nhật ký & giám sát | Log truy cập dữ liệu cá nhân; cảnh báo truy cập bất thường |
| Bí mật & khoá | Không để khoá / mật khẩu trong mã nguồn; lưu trong [kho bí mật ...] |
| Con người | Cam kết bảo mật; đào tạo nhận thức bảo mật / dữ liệu cá nhân [...] / năm |
| Thiết bị | Mã hoá ổ đĩa máy làm việc; không lưu dữ liệu thật trên thiết bị cá nhân |

## Điều 5. Bên xử lý phụ (Sub-processors)
- Bên B chỉ dùng bên xử lý phụ có trong danh sách dưới đây hoặc được Bên A **chấp thuận bằng văn bản**.
- Thêm / thay bên xử lý phụ: Bên B báo trước [...] ngày; Bên A có quyền phản đối có lý do trong [...] ngày.
- Bên B ràng buộc bên xử lý phụ bằng nghĩa vụ bảo vệ dữ liệu không thấp hơn thoả thuận này và chịu trách nhiệm trước Bên A về họ.

| Bên xử lý phụ | Dịch vụ (vd hạ tầng / lưu trữ / email / LLM / giám sát lỗi) | Dữ liệu tiếp cận | Nơi lưu / xử lý (quốc gia, vùng) | Có chuyển ra nước ngoài? | Bên A chấp thuận ngày |
|---|---|---|---|---|---|
| [...] | [...] | [...] | [...] | [có / không] | [...] |
| [...] | [...] | [...] | [...] | [có / không] | [...] |
| [...] | [...] | [...] | [...] | [có / không] | [...] |

> Với dịch vụ **LLM / AI**: ghi rõ dữ liệu cá nhân có được gửi vào lời nhắc (prompt) không, nhà cung cấp có lưu / dùng dữ liệu để huấn luyện không, và thời gian lưu. Mặc định nên **không** gửi dữ liệu cá nhân, hoặc che (mask) trước khi gửi.

## Điều 6. Thông báo vi phạm (Personal data breach notification)
- Bên B thông báo cho đầu mối của Bên A **ngay khi phát hiện, chậm nhất [...] giờ** kể từ khi phát hiện vi phạm hoặc nghi ngờ vi phạm (luật sư đề xuất con số — phải đủ sớm để Bên A kịp làm nghĩa vụ của mình với cơ quan chức năng).
- Nội dung thông báo tối thiểu: mô tả sự việc, thời điểm, loại và số lượng dữ liệu / chủ thể bị ảnh hưởng, hậu quả có thể xảy ra, biện pháp đã và sẽ thực hiện, đầu mối liên hệ. Thông tin chưa đủ thì báo phần đã có và bổ sung dần.
- Bên A, với vai trò Bên Kiểm soát, thông báo cho **cơ quan chuyên trách bảo vệ dữ liệu cá nhân (Bộ Công an)** theo thời hạn luật định. Ghi chú truy vết: **Nghị định 13/2023/NĐ-CP, Điều 23** quy định Bên Kiểm soát thông báo **chậm nhất 72 giờ** sau khi xảy ra hành vi vi phạm, và Bên Xử lý thông báo cho Bên Kiểm soát nhanh nhất có thể. Thời hạn và thủ tục theo Luật 91/2025/QH15 + Nghị định 356/2025/NĐ-CP: [luật sư điền].
- Bên B phối hợp điều tra, khắc phục, lưu bằng chứng; không tự công bố ra ngoài khi chưa thống nhất với Bên A (trừ khi pháp luật buộc).
- Hai bên lập biên bản sự cố / postmortem (xem mẫu `bao-cao-su-co-postmortem.md`).

## Điều 7. Chuyển dữ liệu cá nhân ra nước ngoài (Cross-border transfer)
- Bên B **không** chuyển / lưu / cho truy cập dữ liệu cá nhân từ ngoài lãnh thổ Việt Nam, trừ các trường hợp ghi trong bảng bên xử lý phụ ở Điều 5 và đã được Bên A chấp thuận.
- Trường hợp có chuyển ra nước ngoài (kể cả dùng cloud / API đặt máy chủ ở nước ngoài): bên chuyển dữ liệu phải lập **hồ sơ đánh giá tác động chuyển dữ liệu cá nhân ra nước ngoài** và thực hiện thủ tục với cơ quan chức năng theo quy định. Ghi chú truy vết: Nghị định 13/2023/NĐ-CP, Điều 25. Thủ tục, thời hạn nộp và trường hợp miễn theo văn bản hiện hành: [luật sư điền].
- Bên B cung cấp cho Bên A thông tin cần cho hồ sơ: bên nhận ở nước ngoài, quốc gia, loại dữ liệu, mục đích, biện pháp bảo vệ.

## Điều 8. Kết thúc: trả và xoá dữ liệu (Return & deletion)
Trong vòng [...] ngày kể từ khi hợp đồng / SOW chấm dứt, theo lựa chọn của Bên A:
- [ ] **Trả** toàn bộ dữ liệu cá nhân ở định dạng [CSV / bản dump cơ sở dữ liệu / ...] qua kênh an toàn [...], rồi xoá; hoặc
- [ ] **Xoá** toàn bộ dữ liệu, bao gồm bản sao trên môi trường phát triển, máy làm việc, bên xử lý phụ;
- Bản sao lưu: xoá khi hết vòng đời sao lưu, tối đa [...] ngày; trong thời gian đó vẫn chịu nghĩa vụ bảo vệ;
- Bên B lập **biên bản xoá dữ liệu** (phạm vi, phương pháp, thời điểm, người thực hiện, người xác nhận) — xem mẫu `ke-hoach-ngung-he-thong.md`;
- Trường hợp pháp luật buộc lưu giữ lâu hơn: ghi rõ dữ liệu nào, căn cứ nào, đến khi nào.

## Điều 9. Trách nhiệm
- Mỗi bên chịu trách nhiệm về vi phạm của mình theo hợp đồng chính và pháp luật; [giới hạn trách nhiệm cho vi phạm dữ liệu — luật sư soạn, thường tách khỏi mức trần chung của MSA].

## Điều 10. Hiệu lực & thứ tự ưu tiên
- DPA là phụ lục của MSA / SOW số [...]; hiệu lực từ ngày ký đến khi Bên B hoàn tất Điều 8.
- Về dữ liệu cá nhân, khi mâu thuẫn: DPA ưu tiên hơn MSA và SOW.

| | Đại diện Bên A (Bên Kiểm soát) | Đại diện Bên B (Bên Xử lý) |
|---|---|---|
| Họ tên, chức vụ | | |
| Chữ ký / chữ ký số | | |
| Ngày | | |

---

### Checklist nội bộ trước khi ký
- [ ] Bảng Điều 1 điền đủ, đúng việc Bên B thật sự làm (không chép mẫu nguyên xi)
- [ ] Có dữ liệu nhạy cảm không? Có thì luật sư xác nhận nghĩa vụ tăng cường
- [ ] Danh sách bên xử lý phụ khớp hạ tầng thật (cloud, email, giám sát lỗi, LLM...)
- [ ] Có chuyển dữ liệu ra nước ngoài không? Có thì đã lên kế hoạch hồ sơ đánh giá tác động
- [ ] Thời hạn thông báo vi phạm của Bên B đủ ngắn so với thời hạn luật định của Bên A
- [ ] Căn cứ pháp lý đã được luật sư cập nhật theo Luật 91/2025/QH15 + Nghị định 356/2025/NĐ-CP

---
*Mẫu tham khảo, không phải tư vấn pháp lý — https://cuongthai.com/about/quy-trinh. Bắt buộc có luật sư rà soát.*
