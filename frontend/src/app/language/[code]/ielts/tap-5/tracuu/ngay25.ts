/**
 * Mục TRA CÔNG THỨC — IELTS Tập 5 · Ngày 25 (soạn cùng `tap-5/ngay/ngay25.ts`, 24/11/2026).
 * Người ghép chép các khối này vào `tap-5/tracuu-chang5.ts` (chặng Ngày 25–30) và đánh số liên tục cả chặng.
 * Dạng câu thi → bài ôn: xem `bai-on-ngay25.txt` (9 dạng Reading → t5d25-doc; 7 dạng Listening → t5d25-nghe).
 */
import type { Block } from '@/components/sach-hoc/types';

export const TRA_25: Block[] = [
  { t: "h", text: "(Ngày 25 · Bài 1 mục 2) Giới từ cố định của process và discussion" },
  {
    t: "table",
    head: ["Nhóm", "Cụm đúng"],
    rows: [
      ["Process — đích / sản phẩm", "sorted by / according to colour · turned / converted / made into · reduced to · spun / knitted / formed into"],
      ["Process — nhiệt độ, dòng chảy", "heated to 60°C (đạt tới) · kept / stored at 4°C (giữ ở) · passed / forced through · fed into · transferred / delivered to"],
      ["Process — cấu tạo", "consists of (không bị động) · is made up of · is composed of · left to cool for X hours"],
      ["Discussion", "responsible for · accountable to sb for sth · return / hand back sth to sb · entitled to · the right to + V · access to · on the grounds that + câu / of + N · benefit from · point to"],
    ],
  },
  { t: "rule", formula: "according TO · responsible FOR · entitled TO · return sth TO sb · consists OF · heated TO / kept AT · turned INTO · passed THROUGH", vi: "Khoanh mọi giới từ sau tính từ và sau động từ quy trình — đọc cả cụm như một từ." },

  { t: "h", text: "(Ngày 25 · Bài 1 mục 3) Hoà hợp chủ – vị — năm chỗ còn lọt" },
  {
    t: "table",
    head: ["Chỗ", "Luật", "Ví dụ"],
    rows: [
      ["Con số + danh từ", "đếm từng cái ⇒ số nhiều · một lượng ⇒ số ít", "25 bottles are needed · £400 was spent"],
      ["Chủ ngữ dài có of / which", "che phần giữa rồi đọc", "The number of steps… is eleven."],
      ["each / every / none / neither", "số ít (none of: viết học thuật chọn số ít)", "Each of the stages ends…"],
      ["Mệnh đề / V-ing / to V làm chủ ngữ", "số ít", "Whether museums should… is · What they offer is…"],
      ["Mệnh đề quan hệ", "chia theo danh từ được thay thế", "one of the objects that were taken"],
    ],
  },
  { t: "rule", formula: "đếm từng cái ⇒ số nhiều · một lượng ⇒ số ít · che cụm of / which rồi đọc · mệnh đề làm chủ ngữ ⇒ số ít", vi: "Ba câu cuối mỗi bài là nơi lỗi này hay nằm." },

  { t: "h", text: "(Ngày 25 · Bài 1 mục 4) Mạo từ với danh từ trừu tượng và lần nhắc thứ hai" },
  {
    t: "table",
    head: ["Danh từ", "Dùng"],
    rows: [
      ["humanity · society · mankind", "luôn Ø (nghĩa “nhân loại / xã hội”)"],
      ["history · culture · art · heritage", "Ø khi nói chung · the + N + of… khi xác định"],
      ["the public · the past · the world", "luôn the"],
      ["process: a + N lần đầu", "the + N / they từ lần nhắc thứ hai"],
    ],
  },
  { t: "rule", formula: "Ø humanity / history / culture   ·   the public / the past   ·   a recycling plant → the plant", vi: "Hỏi trước mỗi the: người đọc có chỉ ra được ĐÚNG cái nào không?" },

  { t: "h", text: "(Ngày 25 · Bài 1 mục 5) Process — bị động và rút gọn không lỗi" },
  {
    t: "patterns",
    rows: [
      { formula: "S + is / are + V3", vi: "Mỗi bước một mệnh đề đủ — không chép cụm danh từ của sơ đồ.", examples: [{ en: "The bottles are then washed in hot water.", vi: "Chai sau đó được rửa bằng nước nóng." }] },
      { formula: "After / Before / Once + being + V3, S + is / are + V3", vi: "Rút gọn bị động — tránh chủ ngữ treo.", examples: [{ en: "After being stretched, the threads are cut into short fibres.", vi: "Sau khi được kéo giãn, sợi được cắt thành xơ ngắn." }] },
      { formula: "Having been + V3, S + V", vi: "Phân từ hoàn thành bị động.", examples: [{ en: "Having been collected from bins, the bottles arrive in bales.", vi: "Sau khi được thu gom, chai đến nhà máy theo kiện." }] },
    ],
  },
  { t: "rule", formula: "S + is / are + V3 · after / before / once + being + V3 · having been + V3 · …, which are then + V3", vi: "V3 bất quy tắc hay gặp: spun · sewn · ground · fed · frozen · woven · wound · laid · dug." },

  { t: "h", text: "(Ngày 25 · Bài 1 mục 6) Ngữ pháp của lập luận — bốn khuôn đúng" },
  {
    t: "patterns",
    rows: [
      { formula: "While I accept that + S + V, I believe that + S + V", vi: "Nhượng bộ — không thêm but (cũng vậy với Although).", examples: [{ en: "While I accept that these objects are well cared for, I believe they should be returned.", vi: "Dù tôi thừa nhận hiện vật được chăm sóc tốt, tôi tin chúng nên được trả lại." }] },
      { formula: "The issue is not + wh- …, but + wh- …", vi: "Hai vế đối lập cùng dạng.", examples: [{ en: "The issue is not where an object can be seen, but who has the right to decide.", vi: "Vấn đề không phải hiện vật được xem ở đâu, mà là ai có quyền quyết định." }] },
      { formula: "It is (rather) like + V-ing", vi: "like là giới từ.", examples: [{ en: "It is rather like declining to return a borrowed book.", vi: "Nó giống như từ chối trả một cuốn sách đã mượn." }] },
      { formula: "These are serious points, but + S + V", vi: "Ghi nhận rồi chuyển hướng — câu nối thân 1 sang thân 2.", examples: [{ en: "These are serious points, but they answer a different question.", vi: "Đó là lập luận nghiêm túc, nhưng chúng trả lời một câu hỏi khác." }] },
    ],
  },

  { t: "h", text: "(Ngày 25 · Bài 1 mục 7) Lượt soát 4 phút theo dạng đề" },
  {
    t: "table",
    head: ["Dạng đề", "Bốn lượt"],
    rows: [
      ["Task 1 process", "động từ (be + V3) → rút gọn (being / having been) → giới từ sau động từ quy trình → con số + danh từ, đủ bước"],
      ["Task 1 chart / table", "thì theo năm → so sánh → giới từ của số (by / to / of / at) → số khớp hình"],
      ["Task 2 discussion / opinion", "lập trường mở bài = kết bài → nhượng bộ (Although… but) → danh từ trừu tượng (mạo từ) → giới từ sau tính từ / danh từ"],
    ],
  },

  { t: "h", text: "(Ngày 25 · Bài 3 mục 5) Mười kiểu câu tín hiệu khi nghe" },
  {
    t: "table",
    head: ["Kiểu", "Ví dụ", "Đáp án ở…"],
    rows: [
      ["Bác lời đồn", "No, the money didn't run out.", "câu ngay sau"],
      ["Bác kỳ vọng", "You might imagine X. Instead / In fact…", "sau Instead / In fact"],
      ["Chuỗi phủ định", "not A, or B… came from C · not days, never months… two weeks", "vế khẳng định cuối"],
      ["Phỏng đoán đầu bị sửa", "His first thought was… In fact…", "sau In fact"],
      ["Câu chẻ", "What let him down was… · What does bother me is…", "sau is / was"],
      ["Số sắp bị rút", "normally… which would make… But since…", "số sau But"],
      ["Giả định", "which would've made four", "số sau câu giả định"],
      ["Quy định cũ", "that was true up to last year", "câu có now"],
      ["Báo điểm thay đổi", "The one difference you'll notice is…", "ngay sau"],
      ["Nhượng bộ rồi lý do thật", "It would, and honestly… But…", "sau But"],
    ],
  },

  { t: "h", text: "(Ngày 25 · Bài 3 mục 6) 2 phút kiểm của bài thi máy — bảy bước" },
  { t: "rule", formula: "① ô trống → đoán  ② giới hạn từ  ③ số ít / nhiều  ④ chính tả từ đã đánh vần  ⑤ định dạng số (6.4 · không lặp £)  ⑥ Choose TWO đủ hai chữ  ⑦ chữ cái không lặp", vi: "Làm từ trên xuống; hết giờ ở đâu dừng ở đó — bước đầu lấy lại nhiều điểm nhất." },
];
