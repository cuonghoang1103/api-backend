/**
 * Thẻ bài học "100 Ngày Tiếng Anh" — Ngày 2: Âm tiếng Anh ≠ âm tiếng Việt
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/en-day-02.mjs
 *
 * ⚠ KHÔNG đặt ký hiệu IPA (θ ð ʃ ə …) vào thẻ: font thẻ chỉ nạp subset
 * vietnamese+latin nên ký hiệu IPA sẽ ra ô vuông. Mô tả âm bằng lời + từ ví dụ.
 */
export default {
  series: '100 NGÀY TIẾNG ANH',
  day: 2,
  total: 100,
  titleLead: 'Ngày 2:',
  titleAccent: 'Âm Anh ≠ Âm Việt',
  subtitle: 'Vì sao ta phát âm sai — và cách sửa từ gốc 🔊',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. CÓ ÂM TIẾNG VIỆT KHÔNG HỀ CÓ 👅',
      notes: [
        { mark: 'dot', text: 'Âm "th" trong **think, three**: đặt lưỡi **giữa hai răng**, thổi hơi ra' },
        { mark: 'no', text: 'Tiếng Việt không có âm này → ta hay đọc nhầm thành "t" hoặc "s"' },
        { mark: 'dot', text: 'Âm "th" trong **this, that**: cũng lưỡi giữa răng nhưng **rung cổ**' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. ĐỪNG "NUỐT" ÂM CUỐI ✂️',
      notes: [
        { mark: 'no', text: 'Người Việt quen bỏ phụ âm cuối → nghe bị "cụt", dễ hiểu nhầm' },
        { mark: 'ok', text: '**book** → **books**: thiếu "s" cuối là mất số nhiều' },
        { mark: 'ok', text: '**like** → **liked**: thiếu "d" cuối là mất thì quá khứ' },
      ],
    },
    {
      tone: 'pink',
      title: '3. NHẤN ĐÚNG TRỌNG ÂM 🎵',
      notes: [
        { mark: 'dot', text: 'Từ nhiều âm tiết có **một chỗ nhấn mạnh**: ba-NA-na (nhấn giữa)' },
        { mark: 'no', text: 'Nhấn sai chỗ → người bản xứ **không nhận ra** từ bạn nói' },
        { mark: 'ok', text: 'Nghe từ mới thì nghe luôn **chỗ nhấn**, đừng chỉ nhớ mặt chữ' },
      ],
    },
    {
      tone: 'green',
      title: '4. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Phát âm sai **không phải do bạn dở** — do tiếng Việt thiếu vài âm đó' },
        { mark: 'ok', text: 'Sửa bằng cách **nghe kỹ + nhại to**, không phải học thuộc quy tắc' },
        { mark: 'next', text: '**Ngày 3**: bảng chữ cái tiếng Anh & cách đánh vần tên bạn' },
      ],
    },
  ],

  proof: {
    label: 'LUYỆN HÔM NAY — nghe & nhại to',
    lines: [
      'think / three      ->  luoi giua rang, thoi hoi (khong phai "t")',
      'this  / that       ->  luoi giua rang, co rung',
      'book  -> books     ->  nho bat am "s" cuoi (so nhieu)',
      'like  -> liked     ->  nho bat am "t/d" cuoi (qua khu)',
      'ba-NA-na           ->  nhan am giua, khong nhan deu',
    ],
  },
};
