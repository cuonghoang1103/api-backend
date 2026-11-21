# Hợp đồng dữ liệu "Dự án xuyên suốt khoá" (v1, 21/11/2026)

Đọc cùng `docs/du-an-xuyen-suot-khoa.md` (đặc tả trải nghiệm). Tệp này chốt TÊN TRƯỜNG để agent hạ tầng và agent nội dung
làm song song không lệch nhau. Đổi hợp đồng ⇒ sửa tệp này trước, báo điều phối.

## 1. Trong tệp khoá (Courses `content/courses/<slug>.mjs` hoặc Academy `content/academy/<MÃ>.mjs`)
Thêm khoá `duAn` ở CẤP GỐC của default export (cạnh `course`/`sections`; Academy: cạnh các trường khoá hiện có):

```js
duAn: {
  version: 1,
  gioiThieu: 'EN html|||VI html',          // "Học xong khoá này bạn làm được gì" + vì sao làm dự án xuyên suốt + cách chấm
  deTai: [                                  // ≥ 5 đề tài
    {
      slug: 'shop-sneaker',                 // [a-z0-9-], duy nhất trong khoá
      ten: 'EN|||VI',
      moTa: 'EN|||VI',                      // 2–4 câu: sản phẩm là gì, ai dùng
      doKho: 1 | 2 | 3,
      tinhNang: ['EN|||VI', …],             // 6–12 tính năng chính
      banDoChuong: [ { moc: 1, dung: 'EN|||VI' }, … ],   // mốc nào xây phần nào của đề tài này
      thamKhaoThat: ['EN|||VI', …],         // sản phẩm thật tương tự ngoài đời (không link bịa)
      anh: 'https://…' | null,              // ảnh/khung giao diện mẫu nếu có
    },
  ],
  tuChon: {                                 // tiêu chí AI dùng để duyệt đề tài tự chọn
    yeuCauToiThieu: ['EN|||VI', …],         // vd "≥ 3 trang có điều hướng", "có form kiểm lỗi", "gọi API thật"
    goiYQuyMo: 'EN|||VI',
  },
  moc: [                                    // một mốc / chương (hoặc cụm chương), theo thứ tự học
    {
      so: 1,
      slug: '<prefix>-moc-1',               // = slug của BÀI mốc trong sections (xem §2)
      ten: 'EN|||VI',
      sauChuong: '<tiêu đề hoặc số chương>',
      yeuCau: ['EN|||VI', …],               // bắt buộc — viết CHUNG cho mọi đề tài ("trang danh sách sản phẩm/khoá học/sách… của đề tài bạn")
      nangCao: ['EN|||VI', …],              // tuỳ chọn
      datKhi: ['EN|||VI', …],               // tiêu chí kiểm được
      goiY: ['EN|||VI', …],                 // gợi ý theo tầng, không lộ lời giải trọn
      nop: ['repo', 'demo', 'anh'],         // thứ người học nộp (link repo/commit, link demo, ảnh)
    },
  ],
  baoVe: {
    rubric: [ { tieuChi: 'EN|||VI', diem: 2, moTa: 'EN|||VI' }, … ],   // tổng 10
    cauHoiMau: ['EN|||VI', …],              // ≥ 15 câu hội đồng hay hỏi
    chuanBi: ['EN|||VI', …],                // checklist trước buổi bảo vệ
  },
}
```

## 2. Bài mốc trong `sections`
Mỗi `duAn.moc[i]` có một BÀI thật trong đúng chương (thường là bài cuối chương, trước quiz chương):
`{ title: '🛠 Project milestone N — …|||🛠 Mốc dự án N — …', slug: <đúng duAn.moc[i].slug>, type: 'EXERCISE', mocDuAn: N, content: '<html ml-en/ml-vi>' }`.
`content` trình bày yêu cầu/nâng cao/đạt khi/gợi ý cho người đọc; khối nộp bài do frontend vẽ khi thấy `mocDuAn`.
Bài "Bắt đầu tại đây"/giới thiệu môn: thêm cuối nội dung câu *"Hãy đăng ký đề tài dự án cuối khoá của bạn ở bên dưới"*
và thuộc tính `dangKyDuAn: true` trên bài đó (frontend vẽ khối "🎯 Đăng ký đề tài" dưới bài có cờ này).
Cuối khoá: một bài `{ slug: '<prefix>-bao-ve-du-an', type: 'EXERCISE', baoVeDuAn: true, … }` (hoàn thiện + phòng bảo vệ AI).
KHÔNG đổi/xoá slug bài cũ; bài mới slug mới.

## 3. Quiz tiếng Anh kiểu FE
Quiz chương bổ sung theo đúng định dạng quiz hiện có của khoá (`type: 'QUIZ'`, `quiz: { timeLimitSeconds, questions: [{ id, question, options, correctIndex, points?, explanation? }] }`),
câu hỏi + đáp án TIẾNG ANH như đề FE thật của trường (có thể kèm `|||` bản Việt cho phần giải thích). Mỗi chương ≥ 10 câu,
đề cuối khoá ≥ 40 câu. Đáp án phải đúng — kiểm bằng chạy code thật khi câu hỏi về code.

## 4. Lưu DB (agent hạ tầng quyết định chi tiết, ghi lại ở đây khi xong)
- seed (course-seed / academy-seed) đưa `duAn` vào DB (vd cột jsonb `courses.du_an`) và các cờ bài `mocDuAn` / `dangKyDuAn` / `baoVeDuAn`.
- Bảng người dùng: lựa chọn đề tài (+ duyệt AI), tiến độ mốc, phiên bảo vệ — xem đặc tả §3–§5.
