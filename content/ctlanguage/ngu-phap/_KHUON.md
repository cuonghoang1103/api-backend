# Khuôn thư viện ngữ pháp CT Language

Tệp: `content/ctlanguage/ngu-phap/<nn>/<tên>.json` (`nn` = `ja | zh | en`). Một cấp chia được nhiều tệp (`n5-1.json`, `n5-2.json`…);
thứ tự hiển thị = thứ tự tên tệp rồi thứ tự trong mảng (soạn từ dễ đến khó, điểm cùng `nhom` đứng liền nhau).
Kiểu dữ liệu + luật kiểm: `src/services/ctlanguage/nguPhapThuan.ts`. Kiểm: `npx tsx scripts/ctlanguage-kiem-ngu-phap.mts [ja/n5-1]`.

⛔ **TỰ SOẠN, ĐÚNG HƠN NHIỀU.** Không chép nguyên văn sách (Minna, Dekiru, Shin Kanzen, HSK Standard Course, English Grammar in Use…).
Danh sách điểm ngữ pháp theo chuẩn cấp là kiến thức chung; câu ví dụ + lời giải thích tự viết. Không chắc một cách dùng ⇒ bỏ, đừng bịa.

```jsonc
{ "nn": "ja", "cap": "N5",
  "diem": [
    { "id": "ja-n5-te-mo-ii",                 // <nn>-<cấp thường>-<tên ngắn a-z0-9->, duy nhất cả thư viện
      "nhom": "Thể て",                        // nhóm trong cấp (4–12 nhóm/cấp)
      "tieuDe": "〜てもいいです",               // tên như trong sách
      "mau": "V-て + も + いいです",            // mẫu cấu trúc
      "nghia": "được phép làm ~, làm ~ cũng được",   // MỘT dòng ≤ 90 ký tự
      "giaiThich": "Dùng để cho phép hoặc xin phép làm một việc. Thêm か ở cuối thành câu xin phép…",   // 1–5 câu tiếng Việt
      "cachGhep": ["Động từ thể て + もいいです", "Xin phép: V-て + もいいですか", "Thân mật: V-て + もいい / V-て + いい"],
      "viDu": [                                // 3–5 câu, từ vựng trong phạm vi cấp
        { "c": "ここで写真を撮ってもいいですか。", "d": "ここで しゃしんを とっても いいですか。", "v": "Tôi chụp ảnh ở đây có được không?" }
      ],
      "luuY": ["Trả lời từ chối không nói thẳng いいえ、だめです với người trên; dùng すみません、ちょっと…", "Lỗi hay gặp: chia sai thể て (書いて, không phải 書きて)."],
      "soSanh": ["ja-n5-te-wa-ikemasen"],      // id điểm dễ nhầm (phải tồn tại — kể cả ở tệp khác / cấp khác, cùng ngôn ngữ)
      "tuKhoa": ["te mo ii", "temoii", "xin phép", "cho phép", "được phép"],   // romaji / pinyin không dấu / tên gọi khác / tiếng Việt
      "quiz": [                                // ĐÚNG 3 câu, rải vị trí đáp án
        { "h": "ここに 座って（　）いいですか。", "lc": ["も", "は", "が", "を"], "da": 0, "gt": "Mẫu xin phép là V-て + も + いいですか." }
      ] } ] }
```

- **ja** — `d`: cả câu viết bằng kana (hiragana/katakana), tách cụm bằng dấu cách cho dễ đọc; KHÔNG còn chữ Hán. Bộ kiểm so kana của `c`
  với `d` theo thứ tự (chép nhầm là bị bắt). Chữ Hán trong `c` dùng trong phạm vi cấp (N5: ít chữ Hán, từ khó viết kana).
- **zh** — `c` chữ giản thể; `d`: pinyin CÓ DẤU THANH (nǐ hǎo, không ni3 hao3; `ü` không viết `v`), thanh nhẹ không dấu (de, le, ma),
  biến điệu ghi theo chuẩn từ điển (不 bù → bú trước thanh 4: bú shì; 一 yī → yí/yì theo ngữ cảnh). Viết hoa chữ đầu câu + tên riêng.
- **en** — không có `d`. Câu ví dụ tự nhiên, đúng chính tả Anh–Mỹ thống nhất trong một điểm.
- `v`: nghĩa tiếng Việt tự nhiên, có dấu.
- `luuY`: ≥ 1 dòng; ưu tiên **lỗi người Việt hay mắc** (dịch word-by-word từ tiếng Việt, quên chia, thừa/thiếu trợ từ, nhầm trật tự).
- `quiz`: câu hỏi kiểm ĐÚNG điểm này; mỗi câu đúng MỘT đáp án (đừng để 2 lựa chọn cùng chấp nhận được); `gt` nói vì sao.
  Câu hỏi viết bằng chữ ngôn ngữ đang học (chỗ trống `___` hoặc `（　）`) hoặc tiếng Việt ("Câu nào đúng?").
- `nhom` gợi ý — ja: Câu danh từ · Trợ từ · Động từ thể ます · Tính từ · Thể て · Thể ない · Thể từ điển / thể た · Thể thường · Cho–nhận ·
  Khả năng · Ý chí – dự định · Điều kiện · Bị động – sai khiến · Suy đoán – truyền đạt · Kính ngữ · Liên từ – nối câu · Mức độ – so sánh…
  zh: Câu cơ bản · Câu hỏi · Phó từ · Trợ từ · Lượng từ · Giới từ · Bổ ngữ · Trợ từ động thái · So sánh · Câu đặc biệt (把 / 被 / 是…的) · Liên từ – câu phức…
  en: Các thì · Động từ to be · Danh từ – mạo từ · Đại từ · Tính từ – trạng từ · So sánh · Động từ khuyết thiếu · Câu hỏi · Giới từ ·
  Câu điều kiện · Bị động · Mệnh đề quan hệ · Câu tường thuật · Danh động từ – động từ nguyên mẫu · Liên từ – câu phức…
