/**
 * Thẻ bài học "100 Ngày Tiếng Anh" — Ngày 1: Bắt đầu từ số 0 (mở khoá)
 *
 * File DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này.
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/en-day-01.mjs
 *
 * ⚠ Thẻ tiếng Anh KHÔNG có `verify` (không chạy code) và thường KHÔNG dùng block
 * `code` — bộ tô màu cú pháp của gen-lesson-card tô theo từ khoá Java, sẽ tô
 * nhầm các từ tiếng Anh trùng tên (for/if/this/new/return…). Nội dung đặt trong
 * `notes` (đi qua rich(): chỉ **đậm** và `mã`) và khối `proof` (đọc-to).
 */
export default {
  series: '100 NGÀY TIẾNG ANH',
  day: 1,
  total: 100,
  titleLead: 'Ngày 1:',
  titleAccent: 'Bắt đầu từ số 0',
  subtitle: 'Vì sao người Việt học mãi không nói được — và cách sửa 🇬🇧',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. VÌ SAO HỌC MÃI KHÔNG NÓI ĐƯỢC 🤔',
      notes: [
        { mark: 'no', text: 'Học **ngữ pháp** nhiều, **nghe–nói** gần như không luyện' },
        { mark: 'no', text: 'Dịch trong đầu Việt → Anh rồi mới nói → chậm, bí' },
        { mark: 'no', text: '**Sợ sai** nên không mở miệng → không bao giờ quen' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. HỌC ĐÚNG: NGHE & NÓI TRƯỚC ✅',
      notes: [
        { mark: 'ok', text: '**Nghe nhiều** trước — tai quen âm thì miệng mới bắt chước được' },
        { mark: 'ok', text: '**Nói to, nhại theo** (shadowing) — không học thầm' },
        { mark: 'ok', text: 'Mỗi ngày **một viên gạch nhỏ**, đều đặn hơn học dồn' },
      ],
    },
    {
      tone: 'pink',
      title: '3. LUYỆN NGAY TRONG MY LANGUAGE 📱',
      notes: [
        { mark: 'dot', text: '**1248** từ vựng · **207** mẫu hội thoại · **87** điểm ngữ pháp' },
        { mark: 'dot', text: 'Nghe (audio) · Đọc song ngữ · Viết có **AI chấm**' },
        { mark: 'ok', text: 'Mỗi ngày bài này sẽ chỉ bạn luyện đúng phần nào' },
      ],
    },
    {
      tone: 'green',
      title: '4. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Mất gốc **không sao** — 100 ngày đi từ số 0, thực dụng, dùng được liền' },
        { mark: 'ok', text: 'Sai là chuyện thường. **Cứ nói.** Sai rồi sửa mới nhớ' },
        { mark: 'next', text: '**Ngày 2**: âm tiếng Anh khác tiếng Việt ở đâu (vì sao ta phát âm sai)' },
      ],
    },
  ],

  /* Khối "đọc to": 5 câu dùng được NGAY hôm nay. Âm chuẩn luyện qua audio trong
     My Language + Ngày 2 (đây chỉ là nghĩa để bắt đầu nói, chưa phải phiên âm). */
  proof: {
    label: '5 CÂU DÙNG ĐƯỢC NGAY — đọc to 3 lần',
    lines: [
      'Hello! / Hi!          ->  Xin chao! / Chao!',
      'Thank you.            ->  Cam on.',
      'Sorry. / Excuse me.   ->  Xin loi. / Cho hoi.',
      'Yes. / No.            ->  Co / Dung. / Khong.',
      "I don't understand.   ->  Toi khong hieu.",
      'Nice to meet you.     ->  Rat vui duoc gap ban.',
    ],
  },
};
