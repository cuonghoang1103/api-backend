/**
 * ÔN THI CUỐI KỲ JPD123 (Bài 4–7) — khoá できる日本語 (`/language/ja/dekiru`).
 *
 * 8 bài ôn, id `cuoi-ky-…`:
 *   1 cấu trúc đề + cách tính điểm + chiến lược · 2 ngữ pháp B4–7 tổng hợp · 3 chữ Hán B4–7 ·
 *   4 chia động từ (ます/て…) · 5 luyện nghe (kịch bản MỚI) · 6 thi nói · 7 đề luyện cuối kỳ ·
 *   8 chữa Slot 20 Test 2 + Slot 30 Ôn tập.
 *
 * Nguồn khuôn: bộ ôn của cô (on cuoi ky ngu phap jpd2 b4~7, on cuoi ky chu han b4~7, Slot 20/30,
 * HD thi nói + Speaking Demo JPD123). Mọi câu, hội thoại, kịch bản nghe, bài đọc đều VIẾT MỚI
 * (không chép sách/CD/đề). Furigana `{漢字|かな}`; romaji mọi câu tiếng Nhật.
 * Chữ Hán đứng TRẦN (không furigana) chỉ ở chỗ cố ý thử đọc chữ (đáp án trắc nghiệm chữ Hán, `readkanji`).
 */
import type { Block, Ex, Lesson, Voice } from '@/components/sach-hoc/types';

/** Câu ví dụ gọn: (tiếng Nhật, romaji, nghĩa Việt). */
const E = (en: string, ro: string, vi: string): Ex => ({ en, ro, vi });

/**
 * Đáp án gõ tay: viết một lần bằng {漢字|かな}, hàm sinh đủ cách viết chữ Hán / kana
 * (máy chấm đã tự bỏ dấu câu, dấu cách và đổi chữ số toàn khổ). Phần tử đầu = dạng toàn chữ Hán.
 */
const V = (...xs: string[]): string[] => {
  const out = new Set<string>();
  for (const x of xs) {
    const slots = x
      .split(/(\{[^|}]+\|[^}]+\})/)
      .filter(Boolean)
      .map((p) => {
        const m = /^\{([^|}]+)\|([^}]+)\}$/.exec(p);
        return m ? [m[1], m[2]] : [p];
      });
    const n = slots.filter((s) => s.length > 1).length;
    if (n <= 8) {
      let acc = [''];
      for (const s of slots) acc = acc.flatMap((a) => s.map((c) => a + c));
      acc.forEach((a) => out.add(a));
    } else {
      out.add(slots.map((s) => s[0]).join(''));
      out.add(slots.map((s) => s[s.length - 1]).join(''));
      slots.forEach((s, i) => {
        if (s.length > 1) out.add(slots.map((t, j) => (j === i ? t[1] : t[0])).join(''));
      });
    }
  }
  return [...out];
};

/**
 * Câu trắc nghiệm: `ok` = đáp án đúng, `bad` = các đáp án sai, `at` = vị trí (0…) của đáp án đúng trong
 * danh sách hiển thị (đổi `at` cho đáp án không dồn một chỗ). `why` = giải thích.
 */
const M = (q: string, ok: string, bad: string[], why: string, at = 0) => {
  const options = [...bad];
  options.splice(Math.min(at, options.length), 0, ok);
  return { q, options, correct: Math.min(at, bad.length), why };
};

/* ═══════════════════ 1. CẤU TRÚC ĐỀ · ĐIỂM · CHIẾN LƯỢC ═══════════════════ */

const CAU_TRUC: Lesson = {
  id: 'cuoi-ky-cau-truc',
  kind: 'review',
  title: 'Ôn thi cuối kỳ JPD123 (Bài 4–7) — cấu trúc đề, cách tính điểm, chiến lược từng phần',
  goal: 'Biết đề cuối kỳ JPD123 gồm những phần nào, thi nói chấm thế nào, và có sẵn một chiến lược + lịch ôn 7 ngày để học trước khi thi.',
  minutes: 25,
  blocks: [
    {
      t: 'recap',
      title: 'Đọc 1 phút trước khi ôn',
      items: [
        'Cuối kỳ JPD123 có **hai mảng**: bài thi **viết trên máy** (nghe · chữ Hán · trợ từ · từ để hỏi · chọn đáp án · chia từ · đọc hiểu · dịch câu) và bài **thi nói vấn đáp** riêng.',
        'Phạm vi: **Bài 4–7** (nhưng Bài 1–3 là nền: trợ từ は・の・を・に, số, giờ, ます-form).',
        'Thi nói **100 điểm = Reading 45 + Q&A 45 + tác phong/độ trôi chảy/phát âm/chào hỏi 10**. Đề Reading và Q&A đều nằm trong dạng đã biết trước.',
        'Phần ôn này có 8 bài: cấu trúc → ngữ pháp → chữ Hán → chia động từ → nghe → nói → đề luyện đủ phần → chữa đề của cô.',
      ],
    },
    { t: 'h', text: '1. Đề viết gồm những phần nào? (theo bộ đề ôn của cô)' },
    {
      t: 'p',
      text: 'Bảng dưới lấy **khuôn của bộ đề ôn cô phát** (file ôn ngữ pháp B4–7, file ôn chữ Hán B4–7, các slide nghe Slot 30). **Số câu** là số câu của đề ôn; đề thật có thể ít hơn hay nhiều hơn một chút, nhưng **dạng câu thì giữ nguyên**. Điểm chi tiết của từng phần trong bài thi viết **không có trong tài liệu cô gửi** — hỏi cô hoặc xem thông báo của khảo thí.',
    },
    {
      t: 'table',
      head: ['Phần', 'Dạng câu', 'Số câu (đề ôn)', 'Ôn ở bài nào'],
      rows: [
        ['① {聴解|ちょうかい} Nghe', 'Nghe hội thoại ngắn, điền chỗ trống / chọn đáp án (dạng やってみよう Bài 4–7)', 'Không ghi rõ', 'Bài 5 — Luyện nghe'],
        ['② {漢字|かんじ} Chữ Hán', 'Nhìn chữ Hán chọn cách đọc (18 câu) · nghe cách đọc chọn chữ Hán, đáp án nhiễu na ná (18 câu)', '36', 'Bài 3 — Chữ Hán B4–7'],
        ['③ I. Trợ từ', 'Điền trợ từ vào ô trống, **điền X nếu không cần**; mỗi câu có 1–3 ô', '12', 'Bài 2 + Bài 7'],
        ['④ II. Từ để hỏi', 'Nhìn câu trả lời để chọn từ để hỏi (どんな・何が・どうして・どこへ・どう・どちら・どれ・何・どこに・だれ…)', '11', 'Bài 2 + Bài 7'],
        ['⑤ III. Chọn đáp án đúng', 'Ngữ pháp + từ vựng (quá khứ, thể て, より, います/あります, tính từ な/い, từ nối, từ vựng bếp–tiệc…)', '18', 'Bài 2 + Bài 7'],
        ['⑥ IV. Chia từ', 'Chia từ trong ngoặc cho đúng dạng (tính từ, động từ ~に行きます, ~ています, ~てください, ~ましょうか…)', '9', 'Bài 4 + Bài 7'],
        ['⑦ V. Đọc hiểu', 'Một đoạn ngắn có chỗ trống (từ nối, tính từ) + câu hỏi nội dung đúng/sai', '1 bài (3 câu)', 'Bài 7'],
        ['⑧ Phần viết', 'Dịch Việt → Nhật (8 câu) và Nhật → Việt (8 câu)', '16', 'Bài 7'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi nhớ: đề thi nói KHÔNG nằm trong bảng này',
      items: [
        'Thi nói là **buổi vấn đáp riêng** với giám thị (xem bài 6). Bài thi viết ở trên chỉ chấm chữ.',
        'Hai mảng dùng chung kiến thức: câu hỏi thi nói chính là câu hỏi trong phần từ để hỏi — luyện một lần ăn điểm cả hai.',
      ],
    },
    { t: 'h', text: '2. Thi nói JPD123: cách tính điểm' },
    {
      t: 'table',
      head: ['Phần', 'Điểm', 'Làm gì', 'Chuẩn bị'],
      rows: [
        ['READING', '45', 'Bốc thăm mã đề (A-1, A-2…), **chuẩn bị 20 giây**, rồi đọc to một đoạn khoảng **150 chữ** (ngoài hiragana có ít nhất 5–7 chữ Hán và 2–4 chữ katakana)', 'Đọc to mỗi ngày, quen mặt chữ Hán trần, katakana'],
        ['Q&A', '45', 'Trả lời **3 câu hỏi** của giám thị: **1 câu có tranh + 2 câu không tranh** (đề bốc ngẫu nhiên, mã B-1, B-2…)', 'Học khung câu trả lời đủ dạng Bài 4–7 (bài 6)'],
        ['Tác phong · lưu loát · phát âm · chào hỏi', '10', 'Chào khi vào và khi ra, nói rõ, không im lâu', 'Tập câu chào ở bài 6'],
      ],
    },
    {
      t: 'note',
      title: 'Những điều chắc chắn theo hướng dẫn thi nói của cô (JPD123)',
      items: [
        'Mang **giấy tờ có ảnh** (CCCD / thẻ SV), vào theo thứ tự gọi tên. **Không được đổi đề**.',
        'Mỗi câu hỏi được hỏi **tối đa 3 lần**, mỗi lần hỏi bạn **không được nghĩ quá 10 giây**. Nghe chưa rõ → xin nhắc lại ngay (câu xin nhắc có ở bài 6).',
        'Mã đề Reading và mã đề Q&A **không nhất thiết trùng số** (có thể bốc A3 và B9).',
      ],
    },
    {
      t: 'note',
      title: 'Cách trừ điểm: phần chưa rõ cho JPD123 (chỉ để tham khảo)',
      items: [
        'Tài liệu JPD123 **không ghi** mức trừ điểm chi tiết. Hướng dẫn thi nói môn **JPD113 (06/2025)** có ghi: sai một ký tự khi đọc trừ 0,2 điểm; sai làm hiểu sai cả câu thì mất hết điểm câu đó; **sai trợ từ trừ 2 điểm**; quên **はい／いいえ** ở câu đúng–sai trừ tới 5 điểm; đúng ngữ pháp nhưng dùng sai từ vựng tối đa 3 điểm.',
        'JPD123 nhiều khả năng chấm theo tinh thần tương tự → **luyện đúng trợ từ, nói đủ はい／いいえ, nói trọn câu** là cách an toàn. Đây là suy luận từ tài liệu JPD113, không phải quy định đã được xác nhận cho JPD123.',
      ],
    },
    { t: 'h', text: '3. Chiến lược từng phần' },
    {
      t: 'table',
      head: ['Phần', 'Làm theo thứ tự', 'Bẫy cần tránh'],
      rows: [
        ['**Trợ từ**', '① Gạch chân **động từ/tính từ cuối câu**. ② Hỏi: ô trống là *nơi tồn tại / đích đến / nơi làm / vật bị tác động / cùng với ai / dụng cụ / chủ đề / chủ ngữ*? ③ Tra bảng quyết định ở bài 2. ④ Câu có 2–3 ô: điền cả câu rồi **đọc lại nghe có tự nhiên không**.', 'Nhầm に ↔ で; に ↔ へ chỉ là một kiểu; が ↔ は ở すき/わかります/ほしい; quên **X** (ví dụ **あるいて** không thêm で; **１つ** いくらですか — giữa số lượng và いくら không cần trợ từ).'],
        ['**Từ để hỏi**', 'Nhìn **câu trả lời**: số lượng → いくつ/何枚; người → だれ; nơi → どこ; lý do (…から) → どうして; “thế nào” (đẹp, ngon) → どう; “nơi/người như thế nào” + danh từ → どんな; chọn 1 trong 2 → どちら; chọn trong 3+ → どれ/どの.', 'どう (đứng một mình) ↔ どんな (+ N); どれ ↔ どの (+ N); どこ ↔ どちら; 何 đọc なに/なん tuỳ chữ sau.'],
        ['**Chọn đáp án**', 'Xác định **loại từ** ở chỗ trống: đứng trước danh từ (い-adj nguyên, な-adj + な), cuối câu (です…), sau から… Rồi loại 2 đáp án sai dạng trước, còn 2 mới đọc nghĩa.', 'いる/ある; きれい luôn là **な**-adj; quá khứ phủ định いい → **よくなかった**; thể て nhóm 1 (行って, không phải 行いて).'],
        ['**Chia từ**', 'Đọc **cụm đứng sau ngoặc** để biết cần dạng nào: ~に行きます → bỏ ます; ~ています / ~てください → thể て; ~ましょうか → bỏ ます; ~たいです → bỏ ます; ~から → thể thường hoặc です.', 'Nhóm động từ (nhóm 1 / 2 / 3); 帰る・入る・切る… trông như nhóm 2 nhưng là nhóm 1.'],
        ['**Đọc hiểu**', 'Đọc **câu hỏi trước** (1 phút), rồi đọc đoạn; chỗ trống: nhìn từ nối **trước và sau** (そして = thêm cùng chiều; でも/が = ngược chiều; それから = thứ tự).', 'Chọn đáp án “có vẻ đúng” nhưng đoạn văn **không nói**; đáp án có “mọi/mỗi ngày/rất nhiều” mà đoạn chỉ nói “1 ngày”.'],
        ['**Dịch**', 'Việt → Nhật: tìm **động từ/tính từ chính**, rồi gắn trợ từ theo công thức bài 2. Nhật → Việt: tách theo trợ từ (は… に… で… を… V).', 'Viết thiếu です/ます; dịch “nhất” bằng いちばん; quên どちら/より; đọc câu 〜から là “từ” thay vì “vì”.'],
        ['**Chữ Hán**', 'Đọc chữ **trong từ** (学生), không đọc chữ rời. Với đáp án nhiễu: nhìn **bộ** (氵nước, 言 lời nói, 門 cổng…).', '聞/間/問/開 · 買/貝 · 午/牛 · 今/合 · 小/少 · 大/犬/太.'],
        ['**Nghe**', 'Trước khi nghe: đọc câu hỏi + **gạch từ hỏi** (ai/ở đâu/mấy giờ/bao lâu). Nghe lần 1: ghi **số, giờ, tên, ○×**. Lần 2: kiểm bằng từ nối và từ phủ định.', 'Bẫy “nói A rồi sửa thành B”: lấy thông tin **cuối cùng**; nghe thấy tên địa điểm mà đề hỏi **ai đi**.'],
        ['**Thi nói**', 'Reading: 20 giây đọc **thầm một lượt**, đánh dấu chữ Hán/katakana khó. Q&A: **nghe cả câu → trả lời trọn câu** theo khung, thêm 1 câu phụ nếu còn thời gian.', 'Im lặng > 5 giây; trả lời cụt (chỉ nói “ハノイです”) khi câu hỏi cần cả câu; quên はい／いいえ; nuốt trợ từ.'],
      ],
    },
    { t: 'h', text: '4. Lịch ôn gợi ý: 7 ngày trước khi thi' },
    {
      t: 'table',
      head: ['Ngày', 'Việc chính', 'Bài trong phần này'],
      rows: [
        ['1', 'Đọc ngữ pháp B4 + B5, làm kiểm nhanh', 'Bài 2 (phần A, B)'],
        ['2', 'Đọc ngữ pháp B6 + B7, làm kiểm nhanh; lập bảng trợ từ riêng', 'Bài 2 (phần C, D)'],
        ['3', 'Chia động từ: học bảng て, làm hết bài tập', 'Bài 4'],
        ['4', 'Chữ Hán 49 chữ (B4–7) — đọc theo từ; làm 36 câu', 'Bài 3'],
        ['5', 'Nghe: làm hết các đoạn, nghe lại chỗ sai; luyện đọc to 3 đoạn Reading', 'Bài 5 + Bài 6'],
        ['6', '**Làm thử đề cuối kỳ bấm giờ**, không xem đáp án giữa chừng', 'Bài 7'],
        ['7', 'Chữa lại câu sai; xem bài chữa đề của cô; nói thử toàn bộ Q&A to thành tiếng', 'Bài 8 + Bài 6'],
      ],
    },
    {
      t: 'mcq',
      id: 'ck-ct-kiem-tra',
      title: 'Kiểm tra: bạn nhớ cấu trúc đề chưa?',
      items: [
        {
          q: 'Điểm thi nói JPD123 chia thế nào?',
          options: ['Reading 45 · Q&A 45 · tác phong 10', 'Reading 30 · Q&A 60 · tác phong 10', 'Reading 40 · Q&A 55 · tác phong 5', 'Reading 50 · Q&A 50'],
          correct: 0,
          why: 'Theo hướng dẫn JPD123: **Reading 45 + Q&A 45 + tác phong, lưu loát, phát âm, chào hỏi 10**. Đáp án 2 là cơ cấu của JPD113 cũ; đáp án 3 là JPD113 (2025).',
        },
        {
          q: 'Phần Q&A của thi nói JPD123 có mấy câu?',
          options: ['2 câu (1 có tranh)', '3 câu (1 có tranh, 2 không tranh)', '4 câu (3 có tranh)', '5 câu không tranh'],
          correct: 1,
          why: '**3 câu**: 1 câu có tranh và 2 câu không có tranh.',
        },
        {
          q: 'Thời gian chuẩn bị bài Reading là bao lâu?',
          options: ['10 giây', '20 giây', '30 giây', '1 phút'],
          correct: 1,
          why: 'JPD123: **20 giây** (con số 30 giây là của JPD113).',
        },
        {
          q: 'Giám thị hỏi mỗi câu tối đa mấy lần?',
          options: ['1 lần', '2 lần', '3 lần', 'Không giới hạn'],
          correct: 2,
          why: 'Mỗi câu được hỏi **tối đa 3 lần**, mỗi lần bạn không nghĩ quá 10 giây.',
        },
        {
          q: 'Trong phần điền trợ từ, ký hiệu “X” nghĩa là gì?',
          options: ['Điền chữ X', 'Không cần trợ từ ở chỗ này', 'Câu sai', 'Bỏ qua câu'],
          correct: 1,
          why: 'Điền **X** khi chỗ đó **không cần trợ từ** (ví dụ 「うちからえきまであるいて（X）５分です」 — giữa あるいて và ５分 không có trợ từ).',
        },
        {
          q: 'Câu “何で学校へ行きますか。…あるいて行きます。” cho thấy điều gì khi làm bài trợ từ?',
          options: ['あるいて cần thêm で', 'あるいて **không** thêm で', 'あるいて cần を', 'あるいて cần に'],
          correct: 1,
          why: 'Đi bộ = **あるいて**, không thêm で (khác 電車で・バスで・車で).',
        },
      ],
    },
  ],
};

/* ═══════════════════ 2. NGỮ PHÁP B4–7 TỔNG HỢP ═══════════════════ */

const NGU_PHAP: Lesson = {
  id: 'cuoi-ky-ngu-phap',
  kind: 'grammar',
  title: 'Ngữ pháp Bài 4–7 tổng hợp — mọi mẫu câu, công thức, ví dụ, lỗi hay mắc',
  goal: 'Có trong tay MỘT trang tổng hợp toàn bộ ngữ pháp Bài 4–7 theo thứ tự bài ôn cuối kỳ của cô: công thức, ví dụ có romaji, cặp hỏi–đáp, bảng phân biệt các cặp dễ nhầm và lỗi người Việt hay mắc.',
  minutes: 60,
  blocks: [
    {
      t: 'recap',
      title: 'Bản đồ ngữ pháp B4–7 (bám file ôn ngữ pháp + Slot 30 của cô)',
      items: [
        '**Bài 4** — N1 は N2 の N3 · から～まで～で～くらい · tính từ い/な (khẳng định, phủ định, bổ nghĩa danh từ) · とても/すこし/あまり · どう/どんな · そして/が · ね · N に N が あります.',
        '**Bài 5** — Vました/ませんでした · quá khứ tính từ & danh từ · と (cùng) · それから · どうして～から · が すき/きらい/ほしい · V-たい · ～に行きます (mục đích) · どこかへ.',
        '**Bài 6** — ませんか/ましょう · N が あります (hẹn, việc) · N で N が あります · ～まい · いちばん · より · どちら/のほう · もう/まだ · N はどうですか · よ/ね.',
        '**Bài 7** — あります/います (vị trí) · thể て · てください · ています · ましょうか · V-かた · まだ/もう (còn/hết) · だれが · どれ/どの · で (dụng cụ).',
      ],
    },

    /* ───────────────────────── A. BÀI 4 ───────────────────────── */
    { t: 'h', text: 'A. BÀI 4 — Nơi chốn, đi lại, tính từ, thời tiết (ポイント 24–36)' },
    { t: 'h', text: 'A1. Vị trí và thời gian đi lại' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は N2 の N3 です',
          vi: 'N1 nằm ở phía N3 của N2. N3 = {北|きた} (bắc) · {南|みなみ} (nam) · {東|ひがし} (đông) · {西|にし} (tây) · {真|ま}ん{中|なか} (chính giữa).',
          examples: [
            E('{大阪|おおさか}は{日本|にほん}の{西|にし}です。', 'Oosaka wa Nihon no nishi desu.', 'Osaka ở phía tây Nhật Bản.'),
            E('ダナンはベトナムの{真|ま}ん{中|なか}です。', 'Danan wa Betonamu no mannaka desu.', 'Đà Nẵng ở chính giữa Việt Nam.'),
            E('ここはベトナムのどこですか。…ベトナムの{北|きた}です。', 'Koko wa Betonamu no doko desu ka. Betonamu no kita desu.', 'Đây là chỗ nào của Việt Nam? — Phía bắc Việt Nam.'),
          ],
        },
        {
          formula: 'N1 から N2 まで N3 で ～くらい です',
          vi: 'Từ N1 đến N2, đi bằng N3 mất khoảng ~. Hỏi: **どのくらいですか**. Đi bộ nói **{歩|ある}いて** (KHÔNG thêm で).',
          examples: [
            E('ハノイからホーチミンまで{飛行機|ひこうき}で{二時間|にじかん}くらいです。', 'Hanoi kara Hoochimin made hikouki de nijikan kurai desu.', 'Từ Hà Nội đến TP.HCM đi máy bay khoảng 2 tiếng.'),
            E('うちから{学校|がっこう}まで{歩|ある}いて{十分|じゅっぷん}です。', 'Uchi kara gakkou made aruite juppun desu.', 'Từ nhà đến trường đi bộ 10 phút.'),
            E('{東京|とうきょう}から{大阪|おおさか}まで{新幹線|しんかんせん}で{二時間半|にじかんはん}くらいです。', 'Toukyou kara Oosaka made shinkansen de nijikan han kurai desu.', 'Từ Tokyo đến Osaka đi Shinkansen khoảng 2 tiếng rưỡi.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: '～{分|ふん} (phút) và ～{時間|じかん} (tiếng) — hai bảng hay ra đề',
      head: ['Số', '～phút', '～tiếng', 'Số', '～phút', '～tiếng'],
      rows: [
        ['1', 'いっぷん', 'いちじかん', '6', 'ろっぷん', 'ろくじかん'],
        ['2', 'にふん', 'にじかん', '7', 'ななふん', 'ななじかん／しちじかん'],
        ['3', 'さんぷん', 'さんじかん', '8', 'はっぷん', 'はちじかん'],
        ['4', 'よんぷん', '**よ**じかん', '9', 'きゅうふん', '**く**じかん'],
        ['5', 'ごふん', 'ごじかん', '10', 'じゅっぷん', 'じゅうじかん'],
        ['？', 'なんぷん', 'なんじかん', '～rưỡi', '—', '～じかん**はん**'],
      ],
    },
    {
      t: 'note',
      title: 'Cẩn thận: ～時 (giờ) khác ～時間 (tiếng)',
      items: [
        '「{三時|さんじ}です」= **3 giờ** (thời điểm). 「{三時間|さんじかん}です」= **3 tiếng** (khoảng thời gian). Hỏi mất bao lâu dùng **どのくらい** hoặc **{何時間|なんじかん}**.',
        '～ぐらい／～くらい đều đúng (khoảng ~). Đứng ngay sau lượng thời gian, trước です.',
        '**Phương tiện + で**: {電車|でんしゃ}で・バスで・{車|くるま}で・{飛行機|ひこうき}で・{新幹線|しんかんせん}で. **Đi bộ = あるいて** (không で).',
      ],
    },

    { t: 'h', text: 'A2. Tính từ い／な — chia, nối, bổ nghĩa danh từ' },
    {
      t: 'table',
      caption: 'Bảng chia 4 loại từ (hiện tại + quá khứ). Phần quá khứ thuộc Bài 5 nhưng thi chung.',
      head: ['Loại', 'Ví dụ', 'Hiện tại (+)', 'Hiện tại (−)', 'Quá khứ (+)', 'Quá khứ (−)'],
      rows: [
        ['い-adj', '{高|たか}い', 'たかいです', 'たかくないです', 'たかかったです', 'たかくなかったです'],
        ['い-adj đặc biệt', 'いい', 'いいです', '**よ**くないです', '**よ**かったです', '**よ**くなかったです'],
        ['な-adj', 'しずか', 'しずかです', 'しずかじゃありません', 'しずかでした', 'しずかじゃありませんでした'],
        ['Danh từ', '{雨|あめ}', 'あめです', 'あめじゃありません', 'あめでした', 'あめじゃありませんでした'],
      ],
    },
    {
      t: 'note',
      title: 'Sai nhầm thường gặp ở tính từ',
      items: [
        '~~きれいくないです~~ → **きれいじゃありません**. **きれい・ゆうめい・きらい** tuy đuôi い nhưng là **な-adj**.',
        '~~いいくないです~~ → **よくないです**; ~~いいかったです~~ → **よかったです**.',
        '~~しずかい／しずかいところ~~ → **しずかなところ**. な-adj + **な** + danh từ.',
        '~~あまり高いです~~ → **あまり高くないです**. **あまり** luôn đi với câu phủ định.',
        'Phủ định lịch sự còn có dạng **～くありません／～ではありません** — cùng nghĩa, thi đều chấp nhận; trong bài ôn này dùng **くないです／じゃありません** như cô.',
        '{高|たか}い = **cao** hoặc **đắt**; {低|ひく}い chỉ là **thấp** (không dùng cho giá — “rẻ” là {安|やす}い).',
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Aい ＋ N　／　Aな ＋ な ＋ N',
          vi: 'Tính từ đứng **trước** danh từ. い-adj giữ nguyên; な-adj thêm **な**.',
          examples: [
            E('これは{古|ふる}いお{寺|てら}です。', 'Kore wa furui otera desu.', 'Đây là ngôi chùa cổ.'),
            E('ホーチミンはにぎやかな{町|まち}です。', 'Hoochimin wa nigiyaka na machi desu.', 'TP.HCM là thành phố nhộn nhịp.'),
            E('これは{小|ちい}さい{教会|きょうかい}じゃありません。', 'Kore wa chiisai kyoukai ja arimasen.', 'Đây không phải nhà thờ nhỏ.'),
          ],
        },
        {
          formula: 'S は A です。そして、A です　／　A ですが、A です',
          vi: '**そして** = và (cùng hướng) · **が** = nhưng (ngược hướng). **そして** nối 2 CÂU; **が** nối 2 vế trong một câu.',
          examples: [
            E('{私|わたし}の{町|まち}はにぎやかです。そして、{人|ひと}が{多|おお}いです。', 'Watashi no machi wa nigiyaka desu. Soshite, hito ga ooi desu.', 'Thành phố tôi nhộn nhịp. Và đông người nữa.'),
            E('このビルは{新|あたら}しいですが、きれいじゃありません。', 'Kono biru wa atarashii desu ga, kirei ja arimasen.', 'Toà nhà này mới nhưng không đẹp/sạch.'),
          ],
        },
      ],
    },

    { t: 'h', text: 'A3. Thời tiết, mức độ, từ để hỏi, ね, あります' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N（国・町）は［mùa・tháng・{一年中|いちねんじゅう}］、A です',
          vi: 'Ở nơi nào đó, vào thời gian nào đó thì thời tiết ~. Có dấu phẩy sau thời gian, **không cần に**.',
          examples: [
            E('タイは{一年中|いちねんじゅう}、{暑|あつ}いです。', 'Tai wa ichinenjuu, atsui desu.', 'Thái Lan nóng quanh năm.'),
            E('{私|わたし}の{町|まち}は{十二月|じゅうにがつ}、{寒|さむ}いです。', 'Watashi no machi wa juunigatsu, samui desu.', 'Thành phố tôi tháng 12 thì lạnh.'),
          ],
        },
        {
          formula: 'とても／{少|すこ}し A です　・　あまり A くないです／Aじゃありません',
          vi: 'とても = rất · すこし = hơi, một chút · あまり + **phủ định** = không ~ lắm.',
          examples: [
            E('{今日|きょう}はとても{暑|あつ}いです。', 'Kyou wa totemo atsui desu.', 'Hôm nay rất nóng.'),
            E('{今日|きょう}はあまり{暑|あつ}くないです。', 'Kyou wa amari atsuku nai desu.', 'Hôm nay không nóng lắm.'),
            E('この{町|まち}はあまりにぎやかじゃありません。', 'Kono machi wa amari nigiyaka ja arimasen.', 'Thành phố này không nhộn nhịp lắm.'),
          ],
        },
        {
          formula: 'N は どうですか　／　N は どんな N ですか',
          vi: '**どう** (đứng một mình) hỏi cảm nhận/tình trạng. **どんな + N** hỏi tính chất của người/nơi/vật.',
          examples: [
            E('タイはどうですか。…とても{暑|あつ}いです。', 'Tai wa dou desu ka. Totemo atsui desu.', 'Thái Lan thế nào? — Rất nóng.'),
            E('タイはどんな{国|くに}ですか。…{暑|あつ}い{国|くに}です。', 'Tai wa donna kuni desu ka. Atsui kuni desu.', 'Thái Lan là nước như thế nào? — Là nước nóng.'),
          ],
        },
        {
          formula: 'N1（{場所|ばしょ}）で　{季節|きせつ}に　{何|なに}を V ますか',
          vi: '**で** = ở (nơi làm hành động) · **に** = vào (thời điểm: mùa, ngày).',
          examples: [
            E('ホアさんの{国|くに}で{夏|なつ}に{何|なに}を{飲|の}みますか。…{冷|つめ}たいお{茶|ちゃ}を{飲|の}みます。', 'Hoa-san no kuni de natsu ni nani o nomimasu ka. Tsumetai ocha o nomimasu.', 'Ở nước bạn Hoa, mùa hè uống gì? — Uống trà lạnh.'),
          ],
        },
        {
          formula: 'N1（{場所|ばしょ}）に N2 が あります',
          vi: 'Ở N1 **có** N2 (đồ vật, công trình). Hỏi: **{何|なに}がありますか**. Phủ định: ありません.',
          examples: [
            E('{箱根|はこね}に{温泉|おんせん}があります。', 'Hakone ni onsen ga arimasu.', 'Ở Hakone có suối nước nóng.'),
            E('{町|まち}に{何|なに}がありますか。…{古|ふる}いお{寺|てら}があります。', 'Machi ni nani ga arimasu ka. Furui otera ga arimasu.', 'Trong thành phố có gì? — Có ngôi chùa cổ.'),
          ],
        },
        {
          formula: '＿＿ね',
          vi: 'Cuối câu: **ね** kêu gọi người nghe đồng tình (“nhỉ”) hoặc xác nhận lại thông tin.',
          examples: [E('{今日|きょう}は{寒|さむ}いですね。…そうですね。', 'Kyou wa samui desu ne. Sou desu ne.', 'Hôm nay lạnh nhỉ. — Ừ nhỉ.')],
        },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc ở Bài 4',
      items: [
        '~~ハノイはどんですか~~ → **どうですか** (hoặc どんな**ところ**ですか). **どんな luôn đi với danh từ.**',
        'Hỏi thời gian đi đường dùng **どのくらい** (バスでどのくらいですか) — không dùng ~~いくら~~ (いくら là hỏi **giá tiền**).',
        '“Ở Hakone có suối nước nóng” → **に** {温泉|おんせん}**が**あります (không dùng は, không dùng で).',
        'Quên **な**: ~~しずかところ~~ → しずか**な**ところ. Thừa **な**: ~~おおきいなまち~~ → おおきいまち.',
      ],
    },

    /* ───────────────────────── B. BÀI 5 ───────────────────────── */
    { t: 'h', text: 'B. BÀI 5 — Quá khứ, thích/muốn, đi để làm gì (ポイント 37–47)' },
    {
      t: 'table',
      caption: 'Tổng kết động từ: 4 dạng',
      head: ['', 'Khẳng định', 'Phủ định'],
      rows: [
        ['Hiện tại / tương lai', '～ます', '～ません'],
        ['Quá khứ', '～ました', '～ませんでした'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'Vました　／　Vませんでした',
          vi: 'Đã làm / đã không làm. Hỏi: **{何|なに}をしましたか**. Câu **“không đi đâu cả”**: どこ**へも**{行|い}きませんでした.',
          examples: [
            E('{昨日|きのう}、デパートで{買|か}い{物|もの}をしました。', 'Kinou, depaato de kaimono o shimashita.', 'Hôm qua tôi đi mua sắm ở trung tâm thương mại.'),
            E('{先週|せんしゅう}の{日曜日|にちようび}、どこへも{行|い}きませんでした。', 'Senshuu no nichiyoubi, doko e mo ikimasen deshita.', 'Chủ nhật tuần trước tôi không đi đâu cả.'),
          ],
        },
        {
          formula: 'N（người）と V　／　N（人）と いっしょに V',
          vi: '**と** = cùng với. Đi một mình = **{一人|ひとり}で**.',
          examples: [
            E('{家族|かぞく}と{日本|にほん}へ{行|い}きました。', 'Kazoku to Nihon e ikimashita.', 'Tôi đã đi Nhật cùng gia đình.'),
            E('{私|わたし}は{一人|ひとり}で{日本|にほん}へ{行|い}きました。', 'Watashi wa hitori de Nihon e ikimashita.', 'Tôi đã đi Nhật một mình.'),
          ],
        },
        {
          formula: 'V1 ました。それから、V2 ました',
          vi: '**それから** = sau đó, rồi thì (nối hai việc theo thứ tự thời gian).',
          examples: [E('{友達|ともだち}の{家|いえ}へ{行|い}きました。それから、ゲームをしました。', 'Tomodachi no ie e ikimashita. Sorekara, geemu o shimashita.', 'Tôi đến nhà bạn. Rồi chơi game.')],
        },
        {
          formula: 'N は A かったです／A でした　・　N は A くなかったです／A じゃありませんでした',
          vi: 'Quá khứ của tính từ và danh từ (xem bảng chia ở A2). Hỏi cảm nhận: **～はどうでしたか**.',
          examples: [
            E('{去年|きょねん}の{夏|なつ}はとても{暑|あつ}かったです。', 'Kyonen no natsu wa totemo atsukatta desu.', 'Mùa hè năm ngoái rất nóng.'),
            E('{日本語|にほんご}のテストは{簡単|かんたん}でした。', 'Nihongo no tesuto wa kantan deshita.', 'Bài kiểm tra tiếng Nhật đã dễ.'),
            E('{昨日|きのう}は{雨|あめ}じゃありませんでした。', 'Kinou wa ame ja arimasen deshita.', 'Hôm qua trời không mưa.'),
          ],
        },
        {
          formula: 'どうして～ですか。…～から',
          vi: 'Hỏi lý do – trả lời bằng **câu lý do + から**.',
          examples: [E('どうしてパソコンを{買|か}いませんでしたか。…{高|たか}かったですから。', 'Doushite pasokon o kaimasen deshita ka. Takakatta desu kara.', 'Vì sao bạn không mua máy tính? — Vì nó đắt.')],
        },
        {
          formula: 'N が {好|す}きです／{嫌|きら}いです／ほしいです',
          vi: 'Thích / ghét / muốn có N. **Đối tượng đi với が** (không dùng を). すき・きらい là **な-adj**.',
          examples: [
            E('{私|わたし}は{日本語|にほんご}が{好|す}きです。', 'Watashi wa nihongo ga suki desu.', 'Tôi thích tiếng Nhật.'),
            E('{私|わたし}はお{金|かね}がほしいです。', 'Watashi wa okane ga hoshii desu.', 'Tôi muốn có tiền.'),
            E('{日本語|にほんご}が{嫌|きら}いじゃありません。', 'Nihongo ga kirai ja arimasen.', 'Tôi không ghét tiếng Nhật.'),
          ],
        },
        {
          formula: 'V（ます bỏ ます）＋ たいです',
          vi: 'Muốn làm V. Chia như **い-adj**: ～たくないです · ～たかったです. Đối tượng dùng **を** (hoặc が).',
          examples: [
            E('{私|わたし}はコーヒーを{飲|の}みたいです。', 'Watashi wa koohii o nomitai desu.', 'Tôi muốn uống cà phê.'),
            E('{今|いま}は{何|なに}も{食|た}べたくないです。', 'Ima wa nani mo tabetakunai desu.', 'Bây giờ tôi không muốn ăn gì cả.'),
          ],
        },
        {
          formula: 'N1（{場所|ばしょ}）へ　［V（bỏ ます）／N2（{勉強|べんきょう}・{買|か}い{物|もの}…）］に　{行|い}きます・{来|き}ます・{帰|かえ}ります',
          vi: 'Đi/đến/về N1 **để** làm gì. Danh từ + **に** hoặc động từ bỏ ます + **に**.',
          examples: [
            E('{大学|だいがく}へ{日本語|にほんご}を{勉強|べんきょう}しに{行|い}きます。', 'Daigaku e nihongo o benkyou shi ni ikimasu.', 'Tôi đến trường đại học để học tiếng Nhật.'),
            E('{大学|だいがく}へ{日本語|にほんご}の{勉強|べんきょう}に{行|い}きます。', 'Daigaku e nihongo no benkyou ni ikimasu.', '(Cùng nghĩa, dùng danh từ 勉強 + に.)'),
            E('デパートへ{服|ふく}を{買|か}いに{行|い}きます。', 'Depaato e fuku o kai ni ikimasu.', 'Tôi đi trung tâm thương mại để mua quần áo.'),
          ],
        },
        {
          formula: 'どこか（へ）{行|い}きましたか。…はい、～へ{行|い}きました。／いいえ、どこ（へ）も{行|い}きませんでした',
          vi: 'Hỏi “có đi đâu đó không”. Phủ định dùng **どこへも／どこも**.',
          examples: [E('{日曜日|にちようび}、どこかへ{行|い}きましたか。…はい、{渋谷|しぶや}へ{行|い}きました。', 'Nichiyoubi, dokoka e ikimashita ka. Hai, Shibuya e ikimashita.', 'Chủ nhật bạn có đi đâu không? — Có, tôi đã đi Shibuya.')],
        },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc ở Bài 5',
      items: [
        '~~きのうはあついでした~~ → **{暑|あつ}かったです**. い-adj quá khứ đổi **い → かった**, không thêm でした.',
        '~~しずかかったです~~ → **しずかでした** (な-adj/danh từ dùng でした).',
        '~~日本語を好きです~~ → 日本語**が**好きです. ~~お金をほしい~~ → お金**が**ほしいです.',
        '~~買い物に行きます~~ đúng; ~~買い物を行きます~~ sai. ~~勉強をしに~~ đúng; ~~勉強しにを~~ sai.',
        'Câu hỏi có **どうして** → trả lời bắt buộc có **から** ở cuối vế lý do.',
        '**ほしい** muốn có VẬT (N が ほしい) · **たい** muốn LÀM (V-たい). ~~ビールをほしいです~~ không đúng.',
      ],
    },

    /* ───────────────────────── C. BÀI 6 ───────────────────────── */
    { t: 'h', text: 'C. BÀI 6 — Rủ rê, hẹn, so sánh, đã/chưa (ポイント 48–60)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'いっしょに V ませんか　→　いいですね。V ましょう　／　すみません、～はちょっと……。～から',
          vi: '**ませんか** = rủ lịch sự. Nhận: いいですね + **ましょう**. Từ chối khéo: **すみません + ちょっと…… + lý do から**.',
          examples: [
            E('{今晩|こんばん}、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。', 'Konban, issho ni gohan o tabemasen ka.', 'Tối nay cùng ăn cơm nhé?'),
            E('いいですね。{食|た}べましょう。', 'Ii desu ne. Tabemashou.', 'Hay đấy. Ăn thôi.'),
            E('すみません。{今晩|こんばん}はちょっと……。{用事|ようじ}がありますから。', 'Sumimasen. Konban wa chotto. Youji ga arimasu kara.', 'Xin lỗi. Tối nay thì hơi… vì tôi có việc bận.'),
          ],
        },
        {
          formula: 'N が あります（{約束|やくそく}・{用事|ようじ}・{時間|じかん}）',
          vi: 'Có hẹn, có việc, có thời gian (ở đây **あります = có**, không nói về vị trí).',
          examples: [E('{明日|あした}、{約束|やくそく}があります。', 'Ashita, yakusoku ga arimasu.', 'Ngày mai tôi có hẹn.')],
        },
        {
          formula: 'N1（{場所|ばしょ}）で N2 が あります',
          vi: 'Sự kiện (trận đấu, buổi hoà nhạc…) **diễn ra** ở đâu → dùng **で**.',
          examples: [E('{横浜|よこはま}で{野球|やきゅう}の{試合|しあい}があります。', 'Yokohama de yakyuu no shiai ga arimasu.', 'Ở Yokohama có trận bóng chày.')],
        },
        {
          formula: 'N が　số + {枚|まい}・つ　あります',
          vi: 'Có bao nhiêu. **～まい** đếm vật mỏng, phẳng (vé, giấy, áo phông); **～つ** đếm chung. Số đứng **trước あります**.',
          examples: [
            E('サッカーのチケットが{二枚|にまい}あります。', 'Sakkaa no chiketto ga nimai arimasu.', 'Tôi có 2 vé bóng đá.'),
            E('りんごが{三|みっ}つあります。', 'Ringo ga mittsu arimasu.', 'Có 3 quả táo.'),
          ],
        },
        {
          formula: 'N1 で N2 が いちばん A です',
          vi: 'Trong phạm vi N1, N2 **A nhất**. Hỏi: **N1 で {何|なに}／だれ／どこ／{何月|なんがつ}／いつ が いちばん A ですか**.',
          examples: [
            E('ベトナム{料理|りょうり}で{何|なに}がいちばん{好|す}きですか。…フォーがいちばん{好|す}きです。', 'Betonamu ryouri de nani ga ichiban suki desu ka. Foo ga ichiban suki desu.', 'Trong món Việt bạn thích món nào nhất? — Tôi thích phở nhất.'),
            E('{日本|にほん}でどこがいちばんきれいですか。', 'Nihon de doko ga ichiban kirei desu ka.', 'Ở Nhật, nơi nào đẹp nhất?'),
          ],
        },
        {
          formula: 'N1 は N2 より A です',
          vi: 'N1 **hơn** N2 (so với N2).',
          examples: [E('ハノイはホーチミンより{涼|すず}しいです。', 'Hanoi wa Hoochimin yori suzushii desu.', 'Hà Nội mát hơn TP.HCM.')],
        },
        {
          formula: 'N1 と N2 と どちらが A ですか。…N1 の ほうが A です／どちらも A です',
          vi: 'Hỏi chọn **1 trong 2**. Trả lời: **N の ほうが** ～ (bên đó hơn) hoặc **どちらも** ～ (cả hai).',
          examples: [
            E('{春|はる}と{夏|なつ}とどちらが{好|す}きですか。…{春|はる}のほうが{好|す}きです。', 'Haru to natsu to dochira ga suki desu ka. Haru no hou ga suki desu.', 'Xuân và hè, bạn thích mùa nào hơn? — Tôi thích xuân hơn.'),
            E('どちらも{好|す}きです。', 'Dochira mo suki desu.', 'Tôi thích cả hai.'),
          ],
        },
        {
          formula: 'もう V ましたか。…はい、もう V ました。／いいえ、まだです',
          vi: 'Đã … chưa? **Chưa** = **いいえ、まだです** (KHÔNG nói ~~いいえ、V ません~~).',
          examples: [
            E('もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。', 'Mou hirugohan o tabemashita ka.', 'Bạn ăn trưa chưa?'),
            E('はい、もう{食|た}べました。／いいえ、まだです。', 'Hai, mou tabemashita. / Iie, mada desu.', 'Rồi, tôi ăn rồi. / Chưa ạ.'),
          ],
        },
        {
          formula: 'N は どうですか（đề xuất）',
          vi: 'Gợi ý: “N thì sao?”. Phân biệt với どうですか hỏi cảm nhận (Bài 4).',
          examples: [E('コーヒーはどうですか。…いいですね。', 'Koohii wa dou desu ka. Ii desu ne.', 'Cà phê thì sao ạ? — Hay đấy.')],
        },
        {
          formula: '＿＿よ　／　＿＿ね',
          vi: '**よ**: báo thông tin **mới** cho người nghe, hoặc nhấn mạnh ý kiến. **ね**: tìm sự đồng tình, hoặc xác nhận lại.',
          examples: [
            E('この{店|みせ}のラーメンはおいしいですよ。', 'Kono mise no raamen wa oishii desu yo.', '(Tôi nói cho bạn biết) mì ở quán này ngon đấy.'),
            E('{明日|あした}は{木曜日|もくようび}ですね。…はい、そうです。', 'Ashita wa mokuyoubi desu ne. Hai, sou desu.', 'Mai là thứ Năm nhỉ. (xác nhận) — Vâng đúng.'),
          ],
        },
      ],
    },
    {
      t: 'table',
      caption: 'Bộ đếm ～{枚|まい} và ～つ',
      head: ['Số', '～まい', '～つ', 'Số', '～まい', '～つ'],
      rows: [
        ['1', 'いちまい', 'ひとつ', '6', 'ろくまい', 'むっつ'],
        ['2', 'にまい', 'ふたつ', '7', 'ななまい', 'ななつ'],
        ['3', 'さんまい', 'みっつ', '8', 'はちまい', 'やっつ'],
        ['4', 'よんまい', 'よっつ', '9', 'きゅうまい', 'ここのつ'],
        ['5', 'ごまい', 'いつつ', '10', 'じゅうまい', 'とお'],
        ['？', 'なんまい', 'いくつ', '', '', ''],
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc ở Bài 6',
      items: [
        'Đáp lại **もう～ましたか** khi chưa làm: **いいえ、まだです**. Nói ~~いいえ、食べません~~ nghĩa là “không ăn” → sai.',
        'So sánh 2 vật dùng **どちら**, KHÔNG dùng ~~何が~~. So sánh 3 vật trở lên / trong một nhóm dùng **いちばん**.',
        'Trả lời **どちらが～ですか** chỉ bằng danh từ (~~ハノイです~~) là thiếu → nói đủ **ハノイのほうが～です** (hoặc **どちらも～です**).',
        'Từ chối không nói “いいえ、行きません” thẳng — nói **すみません、ちょっと……+ lý do から**.',
        '**あります** ở Bài 6 = có (hẹn/việc/sự kiện); sự kiện ở đâu → **で**; vật ở đâu → **に** (Bài 4/7).',
      ],
    },

    /* ───────────────────────── D. BÀI 7 ───────────────────────── */
    { t: 'h', text: 'D. BÀI 7 — Vị trí, nhờ vả, đang làm gì, đề nghị giúp (ポイント 61–71)' },
    {
      t: 'table',
      caption: 'Từ chỉ vị trí',
      head: ['Từ', 'Cách đọc', 'Nghĩa', 'Từ', 'Cách đọc', 'Nghĩa'],
      rows: [
        ['{上|うえ}', 'ue', 'trên', '{隣|となり}', 'tonari', 'sát bên cạnh (cùng loại)'],
        ['{下|した}', 'shita', 'dưới', '{横|よこ}', 'yoko', 'bên cạnh, ngang'],
        ['{中|なか}', 'naka', 'trong', '{近|ちか}く', 'chikaku', 'gần, chỗ gần'],
        ['{外|そと}', 'soto', 'ngoài', '{間|あいだ}', 'aida', 'giữa (A と B の間)'],
        ['{前|まえ}', 'mae', 'trước', '{後|うし}ろ', 'ushiro', 'sau'],
      ],
    },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'N1 は N2（vị trí）に あります／います　・　N2 に N1 が あります／います',
          vi: '**います** cho NGƯỜI và CON VẬT; **あります** cho ĐỒ VẬT và CÔNG TRÌNH (kể cả cây cối). Nói “N1 ở đâu” → **は**; nói “ở chỗ ấy có gì” → **が**.',
          examples: [
            E('あのビルの{後|うし}ろに{交番|こうばん}があります。', 'Ano biru no ushiro ni kouban ga arimasu.', 'Sau toà nhà kia có đồn công an.'),
            E('{交番|こうばん}はあのビルの{後|うし}ろにあります。', 'Kouban wa ano biru no ushiro ni arimasu.', 'Đồn công an ở sau toà nhà kia.'),
            E('{交番|こうばん}の{前|まえ}にパクさんがいます。', 'Kouban no mae ni Paku-san ga imasu.', 'Trước đồn công an có anh Park.'),
            E('パクさんは{交番|こうばん}の{前|まえ}にいます。', 'Paku-san wa kouban no mae ni imasu.', 'Anh Park đang ở trước đồn công an.'),
            E('{銀行|ぎんこう}は{本屋|ほんや}とパン{屋|や}の{間|あいだ}にあります。', 'Ginkou wa hon-ya to pan-ya no aida ni arimasu.', 'Ngân hàng nằm giữa hiệu sách và tiệm bánh.'),
          ],
        },
        {
          formula: '～は どこに ありますか／いますか　・　～に {何|なに}が ありますか／だれが いますか',
          vi: 'Hỏi vị trí / hỏi “có gì, có ai”. Phủ định: **ありません／いません**; “không có gì” = **{何|なに}もありません**; “không có ai” = **だれもいません**.',
          examples: [
            E('{駅|えき}はどこにありますか。…あそこです。', 'Eki wa doko ni arimasu ka. Asoko desu.', 'Nhà ga ở đâu? — Ở đằng kia.'),
            E('{箱|はこ}の{中|なか}に{何|なに}がありますか。…{何|なに}もありません。', 'Hako no naka ni nani ga arimasu ka. Nani mo arimasen.', 'Trong hộp có gì? — Không có gì cả.'),
          ],
        },
        {
          formula: 'V て ください',
          vi: 'Hãy V — nhờ, bảo, mời (lịch sự). Thể **て** xem bài 4. Mở lời bằng **すみませんが**.',
          examples: [
            E('ペンで{名前|なまえ}を{書|か}いてください。', 'Pen de namae o kaite kudasai.', 'Hãy viết tên bằng bút.'),
            E('すみませんが、{窓|まど}を{開|あ}けてください。…いいですよ。', 'Sumimasen ga, mado o akete kudasai. Ii desu yo.', 'Xin lỗi, hãy mở giúp cửa sổ. — Được thôi.'),
          ],
        },
        {
          formula: 'V て います',
          vi: 'Đang V (hành động đang diễn ra). Hỏi: **{何|なに}をしていますか**; hỏi người: **だれが～ていますか**.',
          examples: [
            E('パクさんは{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。', 'Paku-san wa daidokoro de osara o aratte imasu.', 'Anh Park đang rửa đĩa trong bếp.'),
            E('ワンさんは{何|なに}をしていますか。…{電話|でんわ}をかけています。', 'Wan-san wa nani o shite imasu ka. Denwa o kakete imasu.', 'Anh Wang đang làm gì vậy? — Đang gọi điện.'),
          ],
        },
        {
          formula: 'V ましょうか',
          vi: 'Để tôi V nhé? — **đề nghị giúp** người khác. Khác **V ましょう** (cùng làm nhé).',
          examples: [
            E('{料理|りょうり}を{作|つく}りましょうか。', 'Ryouri o tsukurimashou ka.', 'Để tôi nấu ăn nhé?'),
            E('この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えましょうか。', 'Kono kanji no yomikata o oshiemashou ka.', 'Để tôi chỉ cách đọc chữ Hán này nhé?'),
          ],
        },
        {
          formula: '（N の）V（bỏ ます）{方|かた}',
          vi: 'Cách làm V: danh từ chỉ cách thức. Đối tượng nối bằng **の** (không dùng を).',
          examples: [
            E('パソコンの{使|つか}い{方|かた}を{教|おし}えてください。', 'Pasokon no tsukaikata o oshiete kudasai.', 'Hãy chỉ tôi cách dùng máy tính.'),
            E('この{漢字|かんじ}の{書|か}き{方|かた}がわかりません。', 'Kono kanji no kakikata ga wakarimasen.', 'Tôi không biết cách viết chữ Hán này.'),
          ],
        },
        {
          formula: 'まだ あります　／　もう ありません',
          vi: '**まだ** = vẫn còn · **もう + phủ định** = không còn nữa (hết rồi).',
          examples: [
            E('お{酒|さけ}はまだあります。', 'Osake wa mada arimasu.', 'Rượu vẫn còn.'),
            E('{砂糖|さとう}はもうありません。', 'Satou wa mou arimasen.', 'Đường hết rồi.'),
          ],
        },
        {
          formula: 'だれが V ましたか。…N さんが V ました',
          vi: 'Từ để hỏi làm **chủ ngữ** thì đi với **が**, và câu trả lời cũng dùng **が**.',
          examples: [E('だれがこのケーキを{作|つく}りましたか。…アンナさんが{作|つく}りました。', 'Dare ga kono keeki o tsukurimashita ka. Anna-san ga tsukurimashita.', 'Ai đã làm chiếc bánh này? — Anna làm.')],
        },
        {
          formula: 'どれ　／　どの + N',
          vi: '**どれ** đứng **một mình** (cái nào, trong 3 thứ trở lên). **どの + N** luôn có danh từ.',
          examples: [
            E('あなたのかさはどれですか。…あれです。', 'Anata no kasa wa dore desu ka. Are desu.', 'Ô của bạn là cái nào? — Cái kia.'),
            E('どのかさですか。…あの{赤|あか}いかさです。', 'Dono kasa desu ka. Ano akai kasa desu.', 'Cái ô nào ạ? — Cái ô đỏ kia.'),
          ],
        },
        {
          formula: 'N（{道具|どうぐ}・{手段|しゅだん}）で V ます',
          vi: '**で** = bằng (dụng cụ, cách thức). Hỏi: **{何|なん}で**.',
          examples: [
            E('{日本人|にほんじん}ははしでご{飯|はん}を{食|た}べます。', 'Nihonjin wa hashi de gohan o tabemasu.', 'Người Nhật ăn cơm bằng đũa.'),
            E('{何|なん}でりんごを{切|き}りますか。…ナイフで{切|き}ります。', 'Nan de ringo o kirimasu ka. Naifu de kirimasu.', 'Bạn cắt táo bằng gì? — Bằng dao.'),
          ],
        },
      ],
    },
    {
      t: 'note',
      title: 'Lỗi hay mắc ở Bài 7',
      items: [
        '~~ねこがあります~~ → ねこが**います** (con vật = います). ~~つくえがいます~~ → つくえが**あります**.',
        '~~パクさんはだいどころにお皿を洗っています~~ → だいどころ**で** (nơi làm hành động = で; nơi tồn tại = に).',
        '~~お皿をテーブルの上に置いて~~ (thiếu **ください**) → 置いて**ください**. Nhờ vả mà thiếu ください là câu bỏ lửng.',
        '~~どれかさですか~~ → **どの**かさですか (có danh từ ⇒ どの). ~~どのですか~~ → **どれ**ですか.',
        '~~ナイフを切ります~~ → ナイフ**で**切ります (dụng cụ = で). Ăn bằng đũa: **はしで**.',
        'Nhóm động từ khi chia thể て: **{行|い}って** (không phải 行いて) · **{切|き}って** (nhóm 1) · **{入|い}れて** (nhóm 2, khác {入|はい}って).',
      ],
    },

    /* ───────────────────────── E. TỔNG HỢP ───────────────────────── */
    { t: 'h', text: 'E. Bảng tổng hợp trợ từ B4–7 (gạch đầu dòng này là phần điểm dễ nhất)' },
    {
      t: 'table',
      head: ['Trợ từ', 'Dùng khi', 'Ví dụ ngắn'],
      rows: [
        ['**は** (wa)', 'Chủ đề của câu', '{私|わたし}は{学生|がくせい}です'],
        ['**が**', 'Chủ ngữ của あります／います · sau từ để hỏi (だれが, 何が) · đối tượng của すき/きらい/ほしい/わかります · nối “nhưng”', '{町|まち}に{公園|こうえん}があります · {漢字|かんじ}がわかります'],
        ['**を** (o)', 'Vật bị tác động của động từ', 'パンを{食|た}べます'],
        ['**に**', 'Nơi tồn tại (あります/います) · thời điểm (７時に, 夏に) · đích đến của động từ vào (入ります, 会います) · mục đích (買いに行きます) · nhận từ ai (…に聞きます)', '{交番|こうばん}の{前|まえ}にいます · {友達|ともだち}に{会|あ}います'],
        ['**へ** (e)', 'Hướng đi (行きます, 来ます, 帰ります); thay cho に được', '{日本|にほん}へ{行|い}きます'],
        ['**で**', 'Nơi làm hành động · dụng cụ/phương tiện/cách thức · phạm vi so sánh nhất', '{公園|こうえん}で{遊|あそ}びます · はしで{食|た}べます · {日本|にほん}で{一番|いちばん}'],
        ['**と**', 'Cùng với (người) · “A と B” (liệt kê đầy đủ, hoặc so sánh 2 thứ A と B と どちら)', '{友達|ともだち}と{行|い}きます'],
        ['**の**', 'Sở hữu · bổ nghĩa danh từ · thay danh từ (…のです)', '{私|わたし}の{本|ほん} · {日本|にほん}の{北|きた}'],
        ['**から／まで**', 'Từ … đến …', '{９時|くじ}から{５時|ごじ}まで'],
        ['**も**', 'Cũng; だれも/何も/どこも + phủ định', '{何|なに}もありません'],
        ['**より**', 'So sánh hơn: N1 は N2 より A', 'ハノイはホーチミンより{涼|すず}しい'],
        ['**ね／よ／か**', 'Xác nhận · báo tin · nghi vấn', 'いい{天気|てんき}ですね'],
        ['**X (không có trợ từ)**', 'あるいて・数量の前 (１つ いくら)・とても/あまり + A・ぐらい', '{歩|ある}いて{５分|ごふん}です'],
      ],
    },
    { t: 'h', text: 'F. Bảng phân biệt các cặp hay nhầm' },
    {
      t: 'table',
      head: ['Cặp dễ nhầm', 'Cách phân biệt nhanh', 'Ví dụ'],
      rows: [
        ['**あります ↔ います**', 'Có sự sống di chuyển được (người, con vật) = います; còn lại = あります. Cây, hoa = あります.', 'ねこが**いる** · ケーキが**ある**'],
        ['**に ↔ で**', 'Tồn tại / đích / thời điểm = に; làm hành động / dụng cụ = で.', 'うちに**いる** · うちで**食べる**'],
        ['**どう ↔ どんな**', 'どう đứng một mình (câu hỏi cảm nhận); どんな + N.', '{町|まち}は**どう**ですか · どんな{町|まち}ですか'],
        ['**どれ ↔ どの ↔ どちら ↔ どこ**', 'どれ = cái nào (3+), どの+N, どちら = 1 trong 2 (hoặc “đâu” lịch sự), どこ = chỗ nào.', 'どれ/どのかさ/どちらが/どこ'],
        ['**もう ↔ まだ**', '(Bài 6) もう～ましたか → まだです. (Bài 7) まだあります/もうありません.', 'もう{食|た}べました · もうありません'],
        ['**ほしい ↔ ～たい**', 'ほしい: muốn CÓ vật (N が). ～たい: muốn LÀM (V ます bỏ ます).', 'お{金|かね}が**ほしい** · {飲|の}み**たい**'],
        ['**から（vì） ↔ から（từ）**', 'Câu + から = vì; N + から = từ (N から N まで).', '{高|たか}かったですから · うちから'],
        ['**ましょう ↔ ましょうか ↔ ませんか**', 'ましょう = cùng làm nhé; ましょうか = để tôi làm nhé; ませんか = rủ.', '{行|い}きましょう/{手伝|てつだ}いましょうか/{行|い}きませんか'],
        ['**そして ↔ それから ↔ が**', 'そして = cùng chiều; それから = thứ tự; が = ngược chiều.', 'きれいです。**そして** · {食|た}べました。**それから**'],
        ['**よ ↔ ね**', 'よ = thông tin mới/nhấn mạnh; ね = đồng tình/xác nhận.', '{行|い}きます**よ** · いい{天気|てんき}です**ね**'],
      ],
    },

    {
      t: 'mcq',
      id: 'ck-ngp-kiem-nhanh',
      title: 'Kiểm nhanh ngữ pháp B4–7 (15 câu)',
      items: [
        { q: 'ホーチミンはにぎやか（　）まちです。', options: ['の', 'な', 'で', 'い'], correct: 1, why: 'にぎやか là **な-adj** → にぎやか**な**まち.' },
        { q: '{去年|きょねん}の{冬|ふゆ}はあまり{寒|さむ}（　）。', options: ['くなかったです', 'かったです', 'いでした', 'くないでした'], correct: 0, why: 'あまり + **phủ định**; quá khứ phủ định い-adj = **～くなかったです**.' },
        { q: '{町|まち}に{古|ふる}いお{寺|てら}（　）あります。', options: ['は', 'を', 'が', 'で'], correct: 2, why: 'Nơi に N **が** あります (Bài 4).' },
        { q: 'うちから{学校|がっこう}まで{歩|ある}いて{十五分|じゅうごふん}です。「{歩|ある}いて」の{後|あと}に（　）。', options: ['で', 'に', 'を', 'trợ từ không cần (X)'], correct: 3, why: 'あるいて **không thêm で** (đi bộ).' },
        { q: '{私|わたし}は{新|あたら}しいパソコン（　）ほしいです。', options: ['を', 'が', 'に', 'で'], correct: 1, why: 'ほしい: đối tượng đi với **が**.' },
        { q: '{日曜日|にちようび}、{友達|ともだち}と{映画|えいが}を{見|み}（　）{行|い}きます。', options: ['ます', 'に', 'で', 'ました'], correct: 1, why: 'V(bỏ ます) **に** 行きます = đi để làm gì.' },
        { q: '「もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。」{食|た}べていないとき、{答|こた}えは？', options: ['いいえ、{食|た}べません。', 'いいえ、まだです。', 'いいえ、もうです。', 'はい、まだです。'], correct: 1, why: 'Chưa = **いいえ、まだです**.' },
        { q: '{夏|なつ}と{冬|ふゆ}と（　）が{好|す}きですか。', options: ['どれ', 'どちら', 'どの', 'どこ'], correct: 1, why: 'Chọn 1 trong 2 → **どちら**.' },
        { q: 'ハノイはホーチミン（　）{涼|すず}しいです。', options: ['から', 'より', 'まで', 'のほう'], correct: 1, why: 'N1 は N2 **より** A です (hơn).' },
        { q: 'テーブルの{上|うえ}にお{皿|さら}が（　）。', options: ['います', 'あります', 'ありません', 'いません'], correct: 1, why: 'お皿 là đồ vật → **あります**.' },
        { q: 'パクさんは{台所|だいどころ}（　）お{皿|さら}を{洗|あら}っています。', options: ['に', 'で', 'を', 'へ'], correct: 1, why: 'Nơi làm hành động = **で**.' },
        { q: 'すみませんが、{窓|まど}を{開|あ}け（　）ください。', options: ['って', 'いて', 'て', 'ます'], correct: 2, why: '開ける là nhóm 2 → bỏ る + **て**: 開け**て**.' },
        { q: '{砂糖|さとう}はまだありますか。…いいえ、（　）ありません。', options: ['まだ', 'もう', 'とても', 'あまり'], correct: 1, why: 'Hết rồi = **もう** + phủ định.' },
        { q: '（　）がこのケーキを{作|つく}りましたか。…アンナさんです。', options: ['だれ', 'どれ', 'どこ', 'いつ'], correct: 0, why: 'Hỏi người → **だれ** (+ が).' },
        { q: '{日本人|にほんじん}は{何|なん}（　）ご{飯|はん}を{食|た}べますか。…はしで{食|た}べます。', options: ['を', 'に', 'で', 'と'], correct: 2, why: 'Dụng cụ → **で**: 何**で**.' },
      ],
    },
  ],
};

/* ═══════════════════ 3. CHỮ HÁN B4–7 ═══════════════════ */

const CHU_HAN: Lesson = {
  id: 'cuoi-ky-chu-han',
  kind: 'kanji',
  title: 'Chữ Hán Bài 4–7 — 42 chữ theo file ôn của cô: cách đọc, nghĩa, từ đi chung, chữ nhiễu hay nhầm',
  goal: 'Đọc đúng và nhận mặt đủ 42 chữ Hán Bài 4–7 theo từ (như đề thi), phân biệt được các chữ na ná dùng làm đáp án nhiễu.',
  minutes: 60,
  blocks: [
    {
      t: 'recap',
      title: 'Phần chữ Hán của đề cuối kỳ',
      items: [
        'Đề ôn của cô có **36 câu**: 18 câu **nhìn chữ Hán → chọn cách đọc** và 18 câu **nghe cách đọc → chọn đúng chữ Hán** (đáp án nhiễu là chữ na ná).',
        'Cô chia chữ thành **4 lần**: Bài 4 (9 chữ) · Bài 5 (12 chữ) · lần 6 (14 chữ: 今来帰会社聞読書話 + 寺言貝田力門) · lần 7 (7 chữ: 肉料理野半大小). Tổng **42 chữ**.',
        'Học chữ **THEO TỪ** (学生 = がくせい), không học âm rời từng chữ. Trong từ ghép Hán–Hán thường đọc **On** (カタカナ); chữ + kana đuôi (食べます) đọc **Kun**.',
        'Cách làm bài đáp án nhiễu: nhìn **bộ** và **nét khác nhau nhỏ** (聞 có 耳, 間 có 日, 問 có 口).',
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú về cách chia chữ của cô',
      items: [
        'Trong khoá học này, 寺・言・貝・田・力・門 đặt ở **Bài 7**, còn file ôn cô gộp ở **lần 6**. Không ảnh hưởng gì khi thi — chỉ cần học đủ 42 chữ.',
        'Từ **半日**: slide của cô ghi cả はんじつ lẫn はんにち; từ điển thông dụng dùng **はんにち**. Nếu đề chỉ có một đáp án hợp lý, chọn はんにち.',
      ],
    },

    { t: 'h', text: 'Bài 4 — 東 京 名 前 国 男 女 区 市 (9 chữ)' },
    { t: 'hanlop', bai: 4 },
    {
      t: 'table',
      head: ['Chữ', 'Hán Việt · nghĩa', 'On / Kun', 'Từ hay gặp (cô chép)', 'Chữ dễ nhầm'],
      rows: [
        ['東', 'ĐÔNG · phía đông', 'トウ / ひがし', '{東京|とうきょう} · {東|ひがし}', '車 · 束'],
        ['京', 'KINH · kinh đô', 'キョウ・ケイ', '{東京|とうきょう} · {京都|きょうと}', '景 · 涼'],
        ['名', 'DANH · tên', 'メイ / な', '{名前|なまえ} · {有名|ゆうめい}', '各 · 石'],
        ['前', 'TIỀN · trước', 'ゼン / まえ', '{名前|なまえ} · {前日|ぜんじつ} · {午前|ごぜん}', '煎 · 刖'],
        ['国', 'QUỐC · nước', 'コク / くに', '{国|くに} · {外国|がいこく} · {帰国|きこく}', '回 · 困 · 園'],
        ['男', 'NAM · đàn ông', 'ダン / おとこ', '{男|おとこ}の{人|ひと}', '田 · 力 (男 = 田 + 力)'],
        ['女', 'NỮ · phụ nữ', 'ジョ / おんな', '{女|おんな}の{人|ひと} · {女子|じょし}', '母 · 安'],
        ['区', 'KHU · khu, quận', 'ク', '{区|く} · {北区|きたく}', '匠 · 医'],
        ['市', 'THỊ · thành phố, chợ', 'シ / いち', '{市|し} · {市場|いちば}', '巾 · 布'],
      ],
    },

    { t: 'h', text: 'Bài 5 — 先 週 毎 午 後 見 食 飲 買 物 行 休 (12 chữ)' },
    { t: 'hanlop', bai: 5 },
    {
      t: 'table',
      head: ['Chữ', 'Hán Việt · nghĩa', 'On / Kun', 'Từ hay gặp (cô chép)', 'Chữ dễ nhầm'],
      rows: [
        ['先', 'TIÊN · trước', 'セン / さき', '{先週|せんしゅう} · {先月|せんげつ} · {先生|せんせい}', '洗 · 光'],
        ['週', 'CHU · tuần', 'シュウ', '{今週|こんしゅう} · {毎週|まいしゅう} · {一週間|いっしゅうかん}', '道 · 周'],
        ['毎', 'MỖI · mỗi', 'マイ', '{毎週|まいしゅう} · {毎月|まいつき} · {毎日|まいにち}', '母 · 海'],
        ['午', 'NGỌ · trưa', 'ゴ', '{午前|ごぜん} · {午後|ごご}', '牛 · 干'],
        ['後', 'HẬU · sau', 'ゴ・コウ / あと・うし(ろ)', '{午後|ごご} · {後|うし}ろ', '役 · 復'],
        ['見', 'KIẾN · nhìn, xem', 'ケン / み(る)', '{見|み}ます · {見|み}せます', '貝 · 目'],
        ['食', 'THỰC · ăn', 'ショク / た(べる)', '{食|た}べます · {食|た}べ{物|もの} · {食事|しょくじ}', '良 · 飲'],
        ['飲', 'ẨM · uống', 'イン / の(む)', '{飲|の}みます · {飲|の}み{物|もの} · {飲食|いんしょく}', '飯 · 食'],
        ['買', 'MÃI · mua', 'バイ / か(う)', '{買|か}います · {買|か}い{物|もの}', '貝 · 見'],
        ['物', 'VẬT · đồ vật', 'ブツ・モツ / もの', '{食|た}べ{物|もの} · {買|か}い{物|もの} · {人物|じんぶつ}', '牧 · 勿'],
        ['行', 'HÀNH · đi', 'コウ・ギョウ / い(く)', '{行|い}きます · {行|い}って', '往 · 待'],
        ['休', 'HƯU · nghỉ', 'キュウ / やす(む)', '{休|やす}みます · {休|やす}み · {休日|きゅうじつ}', '体 · 本'],
      ],
    },

    { t: 'h', text: 'Lần 6 (cô gộp) — 今 来 帰 会 社 聞 読 書 話 ＋ 寺 言 貝 田 力 門 (14 chữ)' },
    { t: 'hanlop', bai: 6 },
    { t: 'hanlop', bai: 7 },
    {
      t: 'table',
      head: ['Chữ', 'Hán Việt · nghĩa', 'On / Kun', 'Từ hay gặp (cô chép)', 'Chữ dễ nhầm'],
      rows: [
        ['今', 'KIM · bây giờ, nay', 'コン / いま', '{今|いま} · {今週|こんしゅう} · {今月|こんげつ} · {今年|ことし} · {今日|きょう}', '合 · 令'],
        ['来', 'LAI · đến; (thời gian) tới', 'ライ / く(る)・き(ます)', '{来|き}ます · {来週|らいしゅう} · {来年|らいねん} · {来日|らいにち}', '米 · 未'],
        ['帰', 'QUY · về', 'キ / かえ(る)', '{帰|かえ}ります · {帰国|きこく}', '掃 · 婦'],
        ['会', 'HỘI · gặp; hội họp', 'カイ / あ(う)', '{会|あ}います · {会社|かいしゃ} · {会話|かいわ}', '合 · 今'],
        ['社', 'XÃ · công ty; xã hội', 'シャ', '{会社|かいしゃ} · {社会|しゃかい}', '杜 · 礼'],
        ['聞', 'VĂN · nghe, hỏi', 'ブン / き(く)', '{聞|き}きます', '間 · 問 · 開'],
        ['読', 'ĐỘC · đọc', 'ドク / よ(む)', '{読|よ}みます · {読書|どくしょ}', '続 · 説'],
        ['書', 'THƯ · viết', 'ショ / か(く)', '{書|か}きます · {読書|どくしょ}', '画 · 昼'],
        ['話', 'THOẠI · nói chuyện', 'ワ / はな(す)', '{話|はな}します · {会話|かいわ}', '語 · 詰'],
        ['寺', 'TỰ · chùa', 'ジ / てら', '{寺|てら}', '持 · 時 · 待'],
        ['言', 'NGÔN · nói', 'ゲン / い(う)', '{言|い}います · {言語|げんご}', '信 · 計'],
        ['貝', 'BỐI · con sò', '— / かい', '{貝|かい}', '見 · 目'],
        ['田', 'ĐIỀN · ruộng', 'デン / た', '{田|た} · {水田|すいでん}', '由 · 甲 · 申'],
        ['力', 'LỰC · sức', 'リョク・リキ / ちから', '{力|ちから} · {水力|すいりょく} · {火力|かりょく}', '刀 · 方'],
        ['門', 'MÔN · cổng', 'モン', '{門|もん}', '問 · 間 · 聞'],
      ],
    },

    { t: 'h', text: 'Lần 7 — 肉 料 理 野 半 大 小 (7 chữ)' },
    {
      t: 'table',
      head: ['Chữ', 'Hán Việt · nghĩa', 'On / Kun', 'Từ hay gặp (cô chép)', 'Chữ dễ nhầm'],
      rows: [
        ['肉', 'NHỤC · thịt', 'ニク', '{肉|にく} · {焼|や}き{肉|にく}', '内 · 丙'],
        ['料', 'LIỆU · nguyên liệu, phí', 'リョウ', '{料理|りょうり} · {料金|りょうきん}', '科 · 斗'],
        ['理', 'LÝ · lý lẽ; sắp xếp', 'リ', '{料理|りょうり}', '里 · 埋'],
        ['野', 'DÃ · cánh đồng', 'ヤ / の', '{野菜|やさい} · {野球|やきゅう}', '里 · 予'],
        ['半', 'BÁN · một nửa, rưỡi', 'ハン / なか(ば)', '{半分|はんぶん} · {半年|はんとし} · {一時半|いちじはん} · {半月|はんつき}', '羊 · 平'],
        ['大', 'ĐẠI · to, lớn', 'ダイ・タイ / おお(きい)', '{大|おお}きい · {大学|だいがく} · {大人|おとな} · {大会|たいかい} · {大半|たいはん}', '犬 · 太 · 天'],
        ['小', 'TIỂU · nhỏ', 'ショウ / ちい(さい)・こ', '{小|ちい}さい · {小学校|しょうがっこう} · {小学生|しょうがくせい} · {小人|こびと}', '少 · 水'],
      ],
    },

    { t: 'h', text: 'Từ đọc đặc biệt và cặp đọc dễ sai' },
    {
      t: 'table',
      head: ['Từ', 'Đọc', 'Nghĩa', 'Chú ý'],
      rows: [
        ['{今日|きょう}', 'kyou', 'hôm nay', 'Đọc đặc biệt (không phải こんにち).'],
        ['{今年|ことし}', 'kotoshi', 'năm nay', 'Đặc biệt. Cùng họ: {来年|らいねん}, {去年|きょねん}.'],
        ['{大人|おとな}', 'otona', 'người lớn', 'Đặc biệt; {大人|だいにん} là sai.'],
        ['{小人|こびと}', 'kobito', 'người tí hon', 'Khác {小人|しょうにん} (trẻ em, giá vé trẻ em).'],
        ['{半分|はんぶん}', 'hanbun', 'một nửa', 'ぶん, không phải ふん/ぷん.'],
        ['{一時半|いちじはん}', 'ichiji han', '1 rưỡi', 'はん = nửa.'],
        ['{帰国|きこく}', 'kikoku', 'về nước', 'こく, không phải ごく.'],
        ['{読書|どくしょ}', 'dokusho', 'đọc sách', 'どく (đục) + しょ.'],
        ['{会社|かいしゃ} ↔ {社会|しゃかい}', 'kaisha / shakai', 'công ty ↔ xã hội', 'Đảo hai chữ = đổi nghĩa.'],
        ['{毎週|まいしゅう} · {毎月|まいつき}', 'maishuu / maitsuki', 'mỗi tuần / mỗi tháng', 'Tháng đọc つき, tuần đọc しゅう.'],
      ],
    },

    { t: 'h', text: 'Bảng chữ nhiễu: nhìn BỘ để loại đáp án sai' },
    {
      t: 'table',
      head: ['Nhóm hay nhầm', 'Cách phân biệt'],
      rows: [
        ['**聞 · 間 · 問 · 開** (+ 門)', 'Cùng bộ 門 (cổng). Ở trong: **耳** (tai) = 聞 (nghe); **日** = 間 (giữa); **口** = 問 (hỏi); **一 + 廾** = 開 (mở).'],
        ['**買 · 貝 · 見**', '貝 = con sò (bộ vỏ sò); 買 = **罒 trên 貝** (mua); 見 = **目 trên 儿** (nhìn).'],
        ['**午 · 牛 · 年**', '午 (trưa) và 牛 (con bò) rất giống nhau, chỉ khác nét ngang trên cùng — **đừng đoán theo nét**, hãy nhớ theo từ 午前・午後. 年 (năm) dài hơn, có thêm nét ngang dưới.'],
        ['**今 · 合 · 会 · 令**', '今: mái 人 + **フ**; 合: mái 人 + **口**; 会: mái 人 + **二 + ム**.'],
        ['**大 · 犬 · 太 · 天**', '犬 (chó) có **chấm** ở góc trên bên phải; 太 chấm **dưới**; 天 (trời) thêm **một nét ngang** trên.'],
        ['**来 · 米 · 未**', '来: có nét ngang dài ở trên rồi hai nét chấm hai bên nét dọc; 米 (gạo): bốn chấm quanh chữ 十; 未 (chưa): hai nét ngang, nét trên **ngắn hơn** nét dưới (末 thì ngược lại).'],
        ['**帰 · 掃 · 婦**', 'Cả ba cùng có phần 帚 ở bên phải. 掃 = **扌** (tay) + 帚; 婦 = **女** + 帚; **帰 không có 扌 hay 女** ở bên trái.'],
        ['**読 · 続 · 説 · 話 · 語**', 'Bên trái: **言** (lời nói) cho 読/説/話/語; 続 là **糸**. 読 có 売; 話 có 舌; 語 có 吾.'],
        ['**寺 · 持 · 時 · 待**', '寺 trơn (chùa); 持 thêm **扌** (cầm); 時 thêm **日** (giờ); 待 thêm **彳** (chờ).'],
        ['**男 · 田 · 力**', '**男 = 田 (ruộng) + 力 (sức)** — người đàn ông có sức làm ruộng.'],
        ['**休 · 体 · 本 · 木**', '休 = **人 + 木** (người dựa vào cây nghỉ); 体 = người + 本 (cơ thể).'],
        ['**小 · 少 · 水**', '少 = 小 + **ノ**; 水 có nét móc ở giữa.'],
        ['**料 · 科 · 斗**', '料 có **米** (gạo) bên trái; 科 có **禾** (lúa).'],
        ['**半 · 羊 · 平**', '半: hai chấm ở trên, **2** nét ngang + nét dọc; 羊: hai chấm ở trên, **3** nét ngang + nét dọc; 平 khác hẳn (một ngang dài + chấm hai bên).'],
      ],
    },

    /* ── Trắc nghiệm đọc ── */
    {
      t: 'mcq',
      id: 'ck-han-doc',
      title: 'Phần A — Nhìn chữ Hán, chọn cách đọc (28 câu)',
      items: [
        M('「午前」', 'ごぜん', ['ごご', 'うまえ', 'ごまえ'], '**午前** ごぜん = buổi sáng (trước 12 giờ). 午後 = ごご.', 0),
        M('「毎週」', 'まいしゅう', ['まいつき', 'まいにち', 'まいしゅ'], '**毎週** まいしゅう = mỗi tuần. 毎月 = まいつき.', 1),
        M('「買い物」', 'かいもの', ['かいぶつ', 'かいもつ', 'ばいもの'], '**買い物** かいもの: 買う (かう) → かい + もの.', 2),
        M('「食事」', 'しょくじ', ['しょっじ', 'たべごと', 'しょくごと'], '**食事** しょくじ (On + On) = bữa ăn.', 3),
        M('「来月」', 'らいげつ', ['らいつき', 'くるげつ', 'こんげつ'], '**来月** らいげつ = tháng sau. こんげつ = tháng này (今月).', 0),
        M('「帰ります」', 'かえります', ['かいります', 'きります', 'もどります'], '**帰る** かえる → かえります. Nhóm 1.', 1),
        M('「会社」', 'かいしゃ', ['あいしゃ', 'かいじゃ', 'かいせき'], '**会社** かいしゃ = công ty. 会 đọc かい trong từ ghép.', 2),
        M('「言語」', 'げんご', ['ごんご', 'げんこ', 'ことば'], '**言語** げんご = ngôn ngữ. 言 đọc げん; 語 đọc ご (đục).', 3),
        M('「今年」', 'ことし', ['こんねん', 'いまとし', 'きょうとし'], '**今年** ことし = năm nay (đọc đặc biệt).', 0),
        M('「女の人」', 'おんなのひと', ['おとこのひと', 'じょのひと', 'めのひと'], '**女** おんな = phụ nữ; 男 おとこ = đàn ông.', 1),
        M('「外国」', 'がいこく', ['そとくに', 'げこく', 'がいごく'], '**外国** がいこく = nước ngoài. 国 = こく (không đục).', 2),
        M('「小学校」', 'しょうがっこう', ['しょがっこう', 'こがっこう', 'ちいがっこう'], '**小学校** しょうがっこう = trường tiểu học (がっこう có っ).', 3),
        M('「半年」', 'はんとし', ['はんねん', 'はんどし', 'なかとし'], '**半年** はんとし = nửa năm.', 0),
        M('「大学」', 'だいがく', ['たいがく', 'おおがく', 'だいがっ'], '**大学** だいがく = đại học. 大 đọc だい (không phải たい).', 1),
        M('「料理」', 'りょうり', ['りょり', 'ろうり', 'りょうい'], '**料理** りょうり = món ăn, nấu ăn.', 2),
        M('「聞きます」', 'ききます', ['かきます', 'いきます', 'みます'], '**聞く** きく → ききます (nghe, hỏi).', 3),
        M('「読書」', 'どくしょ', ['とくしょ', 'どくしゃ', 'よみかき'], '**読書** どくしょ = đọc sách. 読 đọc どく (đục).', 0),
        M('「水力」', 'すいりょく', ['みずちから', 'すいりき', 'すいちから'], '**水力** すいりょく = thuỷ lực. 力 = りょく trong từ ghép.', 1),
        M('「名前」', 'なまえ', ['なめえ', 'めいぜん', 'みょうぜん'], '**名前** なまえ = tên. (Chữ 名 và 前 đọc Kun.)', 2),
        M('「東」', 'ひがし', ['にし', 'きた', 'みなみ'], '**東** ひがし = phía đông. 西 にし · 南 みなみ · 北 きた.', 3),
        M('「休み」', 'やすみ', ['ひめみ', 'きゅうみ', 'やすめ'], '**休み** やすみ = ngày nghỉ. Danh từ của 休む.', 0),
        M('「来日」', 'らいにち', ['きにち', 'らいひ', 'くるひ'], '**来日** らいにち = đến Nhật. 日 đọc にち trong từ ghép.', 1),
        M('「北区」', 'きたく', ['きたいく', 'ほっく', 'ぎたく'], '**北区** きたく = quận Bắc. 区 = ク.', 2),
        M('「大人」', 'おとな', ['だいにん', 'おおひと', 'たいじん'], '**大人** おとな = người lớn (đọc đặc biệt).', 3),
        M('「先月」', 'せんげつ', ['さきつき', 'せんつき', 'せんがつ'], '**先月** せんげつ = tháng trước. 先週 = せんしゅう.', 0),
        M('「書きます」', 'かきます', ['しょきます', 'ききます', 'かかます'], '**書く** かく → かきます (viết).', 1),
        M('「話します」', 'はなします', ['わします', 'ことします', 'いいます'], '**話す** はなす → はなします (nói chuyện).', 2),
        M('「野球」', 'やきゅう', ['のきゅう', 'やぎゅう', 'やきゅ'], '**野球** やきゅう = bóng chày. 野 đọc や trong từ ghép.', 3),
      ],
    },
    /* ── Trắc nghiệm chọn chữ ── */
    {
      t: 'mcq',
      id: 'ck-han-chon-chu',
      title: 'Phần B — Cách đọc → chọn đúng chữ Hán, đáp án nhiễu na ná (26 câu)',
      items: [
        M('ききます', '聞きます', ['間きます', '問きます', '開きます'], '**聞** (VĂN): 門 + **耳**. 間 có 日, 問 có 口, 開 là mở.', 0),
        M('かいもの', '買い物', ['貝い物', '見い物', '買い勿'], '**買** = 罒 + 貝. 貝 trơn là con sò. **物** = 牜 (bộ bò) + 勿 — chữ 勿 đứng một mình thiếu bộ 牜.', 1),
        M('ごご', '午後', ['牛後', '午役', '牛復'], '**午** nét dọc không xuyên; **後** có 彳. 牛 là con bò.', 2),
        M('らいねん', '来年', ['米年', '未年', '来牛'], '**来**: có 人 hai bên. 米 gạo, 未 chưa.', 3),
        M('かえります', '帰ります', ['掃ります', '婦ります', '皈ります'], '**帰** (QUY): bên trái không có 扌 hay 女; 掃 có 扌, 婦 có 女.', 0),
        M('かいしゃ', '会社', ['合社', '会杜', '今社'], '**会**: 人 + 二 + ム. **社**: bộ 礻 + 土.', 1),
        M('どくしょ', '読書', ['続書', '読画', '説書'], '**読**: 言 + 売. 続 bên trái là 糸.', 2),
        M('はなします', '話します', ['語します', '詰します', '読します'], '**話**: 言 + 舌 (lưỡi). 語 có 吾, 読 có 売.', 3),
        M('おとこ', '男', ['田', '力', '女'], '**男** = 田 + 力.', 0),
        M('くに', '国', ['回', '困', '園'], '**国**: khung 囗 + **玉**. 回 là 2 khung lồng nhau.', 1),
        M('なまえ', '名前', ['各前', '名刖', '石前'], '**名**: 夕 + 口. 各 có 夂.', 2),
        M('ひがし', '東', ['車', '束', '来'], '**東**: có 日 nằm trong 木 (mặt trời mọc sau cây). 車 là xe.', 3),
        M('しょくじ', '食事', ['良事', '飲事', '食書'], '**食** có 良 ở dưới mái 人. 事 chứ không phải 書.', 0),
        M('のみもの', '飲み物', ['飯み物', '飲み勿', '食み物'], '**飲**: 食 + 欠 (há miệng). 飯 là cơm (食 + 反).', 1),
        M('おおきい', '大きい', ['犬きい', '太きい', '天きい'], '**大**: không chấm. 犬 có chấm ở phải.', 2),
        M('ちから', '力', ['刀', '方', '九'], '**力** (sức): nét phẩy nhô lên **qua** nét ngang; **刀** (dao): nét phẩy nằm **dưới** nét móc.', 3),
        M('てら', '寺', ['持', '時', '待'], '**寺**: 土 + 寸, không có bộ bên trái.', 0),
        M('もん', '門', ['問', '間', '聞'], '**門** là cổng; ba chữ kia có thêm chữ bên trong.', 1),
        M('にく', '肉', ['内', '円', '向'], '**肉** (thịt): khung 冂 với hai nét 人 xếp trong. 内 chỉ có một chữ 入.', 2),
        M('やすみ', '休み', ['体み', '木み', '伏み'], '**休**: 人 + 木 (人 ở **trái**).', 3),
        M('せんしゅう', '先週', ['洗週', '先周', '光週'], '**先**: 土 + 儿 + 丿; **週**: 辶 + 周.', 0),
        M('いま', '今', ['合', '令', '会'], '**今**: mái 人 + フ.', 1),
        M('しょうがくせい', '小学生', ['少学生', '小字生', '水学生'], '**小**: ba nét; 少 thêm ノ; **学** có 子 ở dưới.', 2),
        M('りょうきん', '料金', ['科金', '料全', '斗金'], '**料**: 米 + 斗. 科 có 禾.', 3),
        M('やさい', '野菜', ['埜菜', '野茶', '里菜'], '**野**: 里 + 予. **菜**: 艹 + 采.', 0),
        M('げんご', '言語', ['信語', '言話', '言読'], '**言語**: 言 + 語, hai chữ đều có bộ 言.', 1),
      ],
    },

    /* ── Đọc chữ trần ── */
    {
      t: 'readkanji',
      id: 'ck-han-doc-cau',
      title: 'Phần C — Đọc câu KHÔNG furigana (15 câu)',
      note: 'Tự đọc to từng câu rồi bấm hiện cách đọc để tự chấm. Câu tự soạn, chỉ dùng chữ Hán Bài 1–7.',
      items: [
        { text: '{来週|らいしゅう}、{会社|かいしゃ}へ{行|い}きます。', ro: 'Raishuu, kaisha e ikimasu.', vi: 'Tuần sau tôi đến công ty.' },
        { text: '{毎週|まいしゅう}、{友達|ともだち}と{会|あ}います。', ro: 'Maishuu, tomodachi to aimasu.', vi: 'Mỗi tuần tôi gặp bạn.' },
        { text: '{午後|ごご}、{買|か}い{物|もの}に{行|い}きます。', ro: 'Gogo, kaimono ni ikimasu.', vi: 'Buổi chiều tôi đi mua sắm.' },
        { text: '{先月|せんげつ}、{日本|にほん}から{帰|かえ}りました。', ro: 'Sengetsu, Nihon kara kaerimashita.', vi: 'Tháng trước tôi đã từ Nhật về.' },
        { text: '{今|いま}、{新|あたら}しい{本|ほん}を{読|よ}んでいます。', ro: 'Ima, atarashii hon o yonde imasu.', vi: 'Bây giờ tôi đang đọc quyển sách mới.' },
        { text: '{私|わたし}は{肉|にく}と{野菜|やさい}を{食|た}べます。', ro: 'Watashi wa niku to yasai o tabemasu.', vi: 'Tôi ăn thịt và rau.' },
        { text: '{男|おとこ}の{人|ひと}と{女|おんな}の{人|ひと}が{話|はな}しています。', ro: 'Otoko no hito to onna no hito ga hanashite imasu.', vi: 'Một người đàn ông và một người phụ nữ đang nói chuyện.' },
        { text: '{東京|とうきょう}の{大|おお}きい{寺|てら}を{見|み}ました。', ro: 'Toukyou no ookii tera o mimashita.', vi: 'Tôi đã xem ngôi chùa lớn ở Tokyo.' },
        { text: '{今年|ことし}の{夏|なつ}、{外国|がいこく}へ{行|い}きます。', ro: 'Kotoshi no natsu, gaikoku e ikimasu.', vi: 'Mùa hè năm nay tôi đi nước ngoài.' },
        { text: '{小学生|しょうがくせい}は{休|やす}みです。', ro: 'Shougakusei wa yasumi desu.', vi: 'Học sinh tiểu học đang nghỉ.' },
        { text: '{大人|おとな}は{会社|かいしゃ}で{働|はたら}きます。', ro: 'Otona wa kaisha de hatarakimasu.', vi: 'Người lớn làm việc ở công ty.' },
        { text: '{名前|なまえ}を{書|か}いてください。', ro: 'Namae o kaite kudasai.', vi: 'Hãy viết tên.' },
        { text: '{半分|はんぶん}は{私|わたし}のです。', ro: 'Hanbun wa watashi no desu.', vi: 'Một nửa là của tôi.' },
        { text: '{料理|りょうり}の{本|ほん}を{買|か}いました。', ro: 'Ryouri no hon o kaimashita.', vi: 'Tôi đã mua sách nấu ăn.' },
        { text: '{飲|の}み{物|もの}は{何|なに}がいいですか。', ro: 'Nomimono wa nani ga ii desu ka.', vi: 'Đồ uống thì bạn thích gì?' },
      ],
    },
    {
      t: 'write',
      id: 'ck-han-viet',
      title: 'Phần D — Tập viết các từ hay vào đề',
      chars: ['東京', '名前', '国', '男女', '先週', '毎週', '午後', '食べ物', '飲み物', '買い物', '休み', '今週', '来年', '帰国', '会社', '読書', '言語', '大学', '料理', '半分', '小学生'],
      note: 'Viết từng từ, nhìn mẫu rồi che mẫu đi viết lại. Ưu tiên nhận mặt chữ (đề thi chỉ chọn đáp án).',
      goi: {
        '東京': 'とうきょう · Tokyo', '名前': 'なまえ · tên', '国': 'くに · nước', '男女': 'だんじょ · nam nữ',
        '先週': 'せんしゅう · tuần trước', '毎週': 'まいしゅう · mỗi tuần', '午後': 'ごご · buổi chiều',
        '食べ物': 'たべもの · đồ ăn', '飲み物': 'のみもの · đồ uống', '買い物': 'かいもの · mua sắm', '休み': 'やすみ · ngày nghỉ',
        '今週': 'こんしゅう · tuần này', '来年': 'らいねん · sang năm', '帰国': 'きこく · về nước', '会社': 'かいしゃ · công ty',
        '読書': 'どくしょ · đọc sách', '言語': 'げんご · ngôn ngữ', '大学': 'だいがく · đại học', '料理': 'りょうり · món ăn',
        '半分': 'はんぶん · một nửa', '小学生': 'しょうがくせい · học sinh tiểu học',
      },
    },
  ],
};

/* ═══════════════════ 4. CHIA ĐỘNG TỪ ═══════════════════ */

const CHIA_DONG_TU: Lesson = {
  id: 'cuoi-ky-chia-dong-tu',
  kind: 'grammar',
  title: 'Chia động từ — thể ます, thể て (và các dạng ませんか・ましょう・たい・かた) — bảng, luyện, đáp án',
  goal: 'Nhận ra nhóm 1 / 2 / 3, chia đúng thể ます và đặc biệt thể て cho 49 động từ trong bài tập của cô, rồi dùng được trong てください・ています・ましょうか.',
  minutes: 50,
  blocks: [
    {
      t: 'recap',
      title: 'Ba việc phải nhớ',
      items: [
        '**Nhóm 1**: ます-stem tận cùng bằng cột **い** (かいます, のみます, ききます, はなします…). **Nhóm 2**: tận cùng **え** (たべます, あけます…) + vài từ đặc biệt đuôi い (**おきます, みます, います, かります**). **Nhóm 3**: **きます, します, N します**.',
        '**Thể て nhóm 1**: い・ち・り → **って** · き → **いて** (行きます → **行って**) · ぎ → **いで** · み・び・に → **んで** · し → **して**. **Nhóm 2**: bỏ ます + **て**. **Nhóm 3**: きて · して.',
        '**Cẩn thận** các từ trông như nhóm 2 nhưng là **nhóm 1**: **帰ります・入ります・切ります**. Và **おきます** có hai nghĩa: {起|お}きます (thức dậy, nhóm 2 → おきて) và {置|お}きます (đặt, nhóm 1 → おいて).',
      ],
    },

    { t: 'h', text: '1. Nhận ra nhóm của động từ' },
    {
      t: 'table',
      head: ['Nhóm', 'Nhận biết (nhìn dạng ます)', 'Ví dụ', 'Hay nhầm'],
      rows: [
        ['**Nhóm 1**', 'Âm trước ます thuộc cột **い** (い・き・ぎ・し・ち・に・び・み・り)', '{買|か}います · {聞|き}きます · {話|はな}します · {待|ま}ちます · {読|よ}みます · {作|つく}ります', '**{帰|かえ}ります · {入|はい}ります · {切|き}ります** (trông như nhóm 2, vẫn là nhóm 1)'],
        ['**Nhóm 2**', 'Âm trước ます thuộc cột **え** (け・べ・め・れ・て…) **và** 4 từ đặc biệt: おきます (起) · みます (見) · います · かります (借)', '{食|た}べます · {開|あ}けます · {教|おし}えます · {寝|ね}ます · {見|み}ます · {起|お}きます · {借|か}ります', '{置|お}きます (đặt) là nhóm **1**; {入|い}れます (cho vào) là nhóm 2, khác {入|はい}ります'],
        ['**Nhóm 3**', 'Chỉ có **きます**, **します** và **danh từ + します**', '{来|き}ます · します · {勉強|べんきょう}します · {買|か}い{物|もの}します · {持|も}って{来|き}ます', '—'],
      ],
    },

    { t: 'h', text: '2. Các dạng từ ます-form (từ dạng ます)' },
    {
      t: 'table',
      caption: '10 động từ mẫu — đủ cả nhóm',
      head: ['Từ điển', 'ます', 'ません', 'ました', 'ませんでした', 'ましょう', 'たい', 'かた', 'て'],
      rows: [
        ['{食|た}べる', '{食|た}べます', '{食|た}べません', '{食|た}べました', '{食|た}べませんでした', '{食|た}べましょう', '{食|た}べたい', '{食|た}べ{方|かた}', '{食|た}べて'],
        ['{見|み}る', '{見|み}ます', '{見|み}ません', '{見|み}ました', '{見|み}ませんでした', '{見|み}ましょう', '{見|み}たい', '{見|み}{方|かた}', '{見|み}て'],
        ['{行|い}く', '{行|い}きます', '{行|い}きません', '{行|い}きました', '{行|い}きませんでした', '{行|い}きましょう', '{行|い}きたい', '{行|い}き{方|かた}', '{行|い}って'],
        ['{飲|の}む', '{飲|の}みます', '{飲|の}みません', '{飲|の}みました', '{飲|の}みませんでした', '{飲|の}みましょう', '{飲|の}みたい', '{飲|の}み{方|かた}', '{飲|の}んで'],
        ['{書|か}く', '{書|か}きます', '{書|か}きません', '{書|か}きました', '{書|か}きませんでした', '{書|か}きましょう', '{書|か}きたい', '{書|か}き{方|かた}', '{書|か}いて'],
        ['{話|はな}す', '{話|はな}します', '{話|はな}しません', '{話|はな}しました', '{話|はな}しませんでした', '{話|はな}しましょう', '{話|はな}したい', '{話|はな}し{方|かた}', '{話|はな}して'],
        ['{買|か}う', '{買|か}います', '{買|か}いません', '{買|か}いました', '{買|か}いませんでした', '{買|か}いましょう', '{買|か}いたい', '{買|か}い{方|かた}', '{買|か}って'],
        ['{帰|かえ}る', '{帰|かえ}ります', '{帰|かえ}りません', '{帰|かえ}りました', '{帰|かえ}りませんでした', '{帰|かえ}りましょう', '{帰|かえ}りたい', '{帰|かえ}り{方|かた}', '{帰|かえ}って'],
        ['{来|く}る', '{来|き}ます', '{来|き}ません', '{来|き}ました', '{来|き}ませんでした', '{来|き}ましょう', '{来|き}たい', '{来|き}{方|かた}', '{来|き}て'],
        ['する', 'します', 'しません', 'しました', 'しませんでした', 'しましょう', 'したい', 'し{方|かた}', 'して'],
      ],
    },
    {
      t: 'note',
      title: 'Cách dùng từng dạng (nhớ kèm mẫu câu)',
      items: [
        '**～ます／ません／ました／ませんでした**: hiện tại · phủ định · quá khứ · quá khứ phủ định (Bài 3, 5).',
        '**～ましょう** (cùng làm nhé) · **～ませんか** (rủ) · **～ましょうか** (để tôi làm nhé) (Bài 6, 7).',
        '**～たい(です)**: muốn làm — chia như い-adj: ～たくないです · ～たかったです (Bài 5).',
        '**～に行きます**: bỏ ます + に (買い物に行きます, 見に行きます) (Bài 5).',
        '**～かた**: bỏ ます + かた = cách V (書き方, 使い方) (Bài 7).',
        '**～て**: ～てください · ～ています (Bài 7).',
      ],
    },

    { t: 'h', text: '3. Thể て — quy tắc' },
    {
      t: 'table',
      head: ['Nhóm', 'Âm cuối (trước ます)', 'Quy tắc', 'Ví dụ ます → て'],
      rows: [
        ['1', '**い・ち・り**', 'bỏ ます, thêm **って**', '{買|か}います → {買|か}**って** · {持|も}ちます → {持|も}**って** · {帰|かえ}ります → {帰|かえ}**って**'],
        ['1', '**み・び・に**', 'bỏ ます, thêm **んで**', '{飲|の}みます → {飲|の}**んで** · {遊|あそ}びます → {遊|あそ}**んで**'],
        ['1', '**き**', 'bỏ ます, thêm **いて**', '{書|か}きます → {書|か}**いて** · {聞|き}きます → {聞|き}**いて**'],
        ['1', '**ぎ**', 'bỏ ます, thêm **いで**', 'およぎます → およ**いで** (Bài 9)'],
        ['1', '**し**', 'bỏ ます, thêm **て**', '{話|はな}します → {話|はな}**して** · {貸|か}します → {貸|か}**して**'],
        ['1 (ngoại lệ)', '{行|い}きます', '**{行|い}って** (không phải ~~行いて~~)', '{行|い}きます → {行|い}**って** · {持|も}って{行|い}きます → {持|も}って{行|い}**って**'],
        ['2', 'え段 + 4 từ đặc biệt', 'bỏ ます, thêm **て**', '{食|た}べます → {食|た}べ**て** · {見|み}ます → {見|み}**て** · {借|か}ります → {借|か}り**て**'],
        ['3', 'きます / します', '**きて / して**', '{来|き}ます → {来|き}**て** · {勉強|べんきょう}します → {勉強|べんきょう}**して**'],
      ],
    },
    {
      t: 'rule',
      formula: 'い・ち・り → って　／　み・び・に → んで　／　き → いて　／　ぎ → いで　／　し → して',
      vi: 'Câu thần chú thể て nhóm 1 (行きます là ngoại lệ → 行って).',
    },
    {
      t: 'note',
      title: 'Cẩn thận: những cặp dễ chia sai',
      items: [
        '~~帰ります → かえりて~~ ✗ → **かえって** ✓ (nhóm 1: り → って).',
        '~~切ります → きて~~ ✗ → **きって** ✓ (nhóm 1). Còn {着|き}ます (mặc áo, Bài 13) mới là nhóm 2 → きて.',
        '~~入ります → いれて~~ ✗ (đó là {入|い}れます) → {入|はい}**って** ✓.',
        '~~置きます → おきて~~ ✗ → **おいて** ✓. {起|お}きます (thức dậy) → **おきて** ✓.',
        '~~あります → あて~~ ✗ → **あって** ✓. ~~います → いって~~ ✗ → **いて** ✓ ({行|い}きます mới là いって).',
      ],
    },

    { t: 'h', text: '4. Bảng đáp án đủ 49 động từ (khuôn bài tập “chia thể て Bài 7” của cô)' },
    { t: 'p', text: 'Cột cuối là nghĩa. Che cột て lại, tự chia, rồi mở ra so — rồi làm các bài luyện bên dưới.' },
    {
      t: 'table',
      caption: 'Nhóm 1 (30 từ)',
      head: ['ます', 'て', 'Romaji (て)', 'Nghĩa'],
      rows: [
        ['{行|い}きます', '{行|い}って', 'itte', 'đi'],
        ['{帰|かえ}ります', '{帰|かえ}って', 'kaette', 'về'],
        ['{飲|の}みます', '{飲|の}んで', 'nonde', 'uống'],
        ['{買|か}います', '{買|か}って', 'katte', 'mua'],
        ['{聞|き}きます', '{聞|き}いて', 'kiite', 'nghe; hỏi'],
        ['{働|はたら}きます', '{働|はたら}いて', 'hataraite', 'làm việc'],
        ['{読|よ}みます', '{読|よ}んで', 'yonde', 'đọc'],
        ['{会|あ}います', '{会|あ}って', 'atte', 'gặp'],
        ['{作|つく}ります', '{作|つく}って', 'tsukutte', 'làm, nấu'],
        ['{登|のぼ}ります', '{登|のぼ}って', 'nobotte', 'leo'],
        ['{入|はい}ります', '{入|はい}って', 'haitte', 'vào'],
        ['{撮|と}ります', '{撮|と}って', 'totte', 'chụp (ảnh)'],
        ['あります', 'あって', 'atte', 'có (đồ vật)'],
        ['{遊|あそ}びます', '{遊|あそ}んで', 'asonde', 'chơi'],
        ['{洗|あら}います', '{洗|あら}って', 'aratte', 'rửa'],
        ['{置|お}きます', '{置|お}いて', 'oite', 'đặt, để'],
        ['{書|か}きます', '{書|か}いて', 'kaite', 'viết'],
        ['{貸|か}します', '{貸|か}して', 'kashite', 'cho mượn'],
        ['{切|き}ります', '{切|き}って', 'kitte', 'cắt'],
        ['{使|つか}います', '{使|つか}って', 'tsukatte', 'dùng'],
        ['{手伝|てつだ}います', '{手伝|てつだ}って', 'tetsudatte', 'giúp'],
        ['{取|と}ります', '{取|と}って', 'totte', 'lấy'],
        ['{持|も}って{行|い}きます', '{持|も}って{行|い}って', 'motteitte', 'mang đi'],
        ['わかります', 'わかって', 'wakatte', 'hiểu'],
        ['{出|だ}します', '{出|だ}して', 'dashite', 'lấy ra; nộp'],
        ['{歌|うた}います', '{歌|うた}って', 'utatte', 'hát'],
        ['{吸|す}います', '{吸|す}って', 'sutte', 'hút (thuốc)'],
        ['{話|はな}します', '{話|はな}して', 'hanashite', 'nói chuyện'],
        ['{弾|ひ}きます', '{弾|ひ}いて', 'hiite', 'chơi (đàn)'],
        ['{持|も}ちます', '{持|も}って', 'motte', 'cầm, mang'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 2 (11 từ)',
      head: ['ます', 'て', 'Romaji (て)', 'Nghĩa'],
      rows: [
        ['{食|た}べます', '{食|た}べて', 'tabete', 'ăn'],
        ['{見|み}ます', '{見|み}て', 'mite', 'xem, nhìn'],
        ['{起|お}きます', '{起|お}きて', 'okite', 'thức dậy'],
        ['{寝|ね}ます', '{寝|ね}て', 'nete', 'ngủ'],
        ['{借|か}ります', '{借|か}りて', 'karite', 'mượn'],
        ['います', 'いて', 'ite', 'có, ở (người, con vật)'],
        ['{入|い}れます', '{入|い}れて', 'irete', 'cho vào'],
        ['{教|おし}えます', '{教|おし}えて', 'oshiete', 'dạy; chỉ'],
        ['{開|あ}けます', '{開|あ}けて', 'akete', 'mở'],
        ['{閉|し}めます', '{閉|し}めて', 'shimete', 'đóng'],
        ['かけます', 'かけて', 'kakete', 'gọi (điện)'],
      ],
    },
    {
      t: 'table',
      caption: 'Nhóm 3 (8 từ)',
      head: ['ます', 'て', 'Romaji (て)', 'Nghĩa'],
      rows: [
        ['します', 'して', 'shite', 'làm'],
        ['{勉強|べんきょう}します', '{勉強|べんきょう}して', 'benkyoushite', 'học'],
        ['{来|き}ます', '{来|き}て', 'kite', 'đến'],
        ['{買|か}い{物|もの}します', '{買|か}い{物|もの}して', 'kaimonoshite', 'mua sắm'],
        ['{食事|しょくじ}します', '{食事|しょくじ}して', 'shokujishite', 'ăn uống'],
        ['{洗濯|せんたく}します', '{洗濯|せんたく}して', 'sentakushite', 'giặt giũ'],
        ['{掃除|そうじ}します', '{掃除|そうじ}して', 'soujishite', 'dọn dẹp'],
        ['{持|も}って{来|き}ます', '{持|も}って{来|き}て', 'mottekite', 'mang đến'],
      ],
    },

    { t: 'h', text: '5. Dùng thể て trong câu (Bài 7)' },
    {
      t: 'patterns',
      rows: [
        {
          formula: 'V て ください',
          vi: 'Hãy V (nhờ, bảo, mời). Mở đầu: すみませんが、～',
          examples: [
            E('ここに{名前|なまえ}を{書|か}いてください。', 'Koko ni namae o kaite kudasai.', 'Hãy viết tên vào đây.'),
            E('すみませんが、{塩|しお}を{取|と}ってください。', 'Sumimasen ga, shio o totte kudasai.', 'Xin lỗi, hãy lấy giúp tôi lọ muối.'),
            E('{冷蔵庫|れいぞうこ}からジュースを{出|だ}してください。', 'Reizouko kara juusu o dashite kudasai.', 'Hãy lấy nước ép ra khỏi tủ lạnh.'),
          ],
        },
        {
          formula: 'V て います',
          vi: 'Đang V.',
          examples: [
            E('ダニエルさんはギターを{弾|ひ}いています。', 'Danieru-san wa gitaa o hiite imasu.', 'Daniel đang chơi ghi-ta.'),
            E('ワンさんは{電話|でんわ}をかけています。', 'Wan-san wa denwa o kakete imasu.', 'Anh Wang đang gọi điện.'),
          ],
        },
      ],
    },

    { t: 'h', text: '6. Ngoài phạm vi B4–7: thể ない (Bài 10) — chỉ để biết' },
    {
      t: 'p',
      text: 'Đề cuối kỳ JPD123 (Bài 4–7) **không ra thể ない**. Bảng dưới để bạn thấy quy luật chung trước khi sang JPD sau; nếu thi gấp, **bỏ qua bảng này**.',
    },
    {
      t: 'table',
      head: ['Từ điển', 'ます', 'ない', 'Quy tắc'],
      rows: [
        ['{食|た}べる', '{食|た}べます', '{食|た}べない', 'nhóm 2: bỏ る + ない'],
        ['{見|み}る', '{見|み}ます', '{見|み}ない', 'nhóm 2: bỏ る + ない'],
        ['{行|い}く', '{行|い}きます', '{行|い}かない', 'nhóm 1: đổi đuôi → hàng あ (+ない)'],
        ['{飲|の}む', '{飲|の}みます', '{飲|の}まない', 'nhóm 1: đổi đuôi → hàng あ (+ない)'],
        ['{書|か}く', '{書|か}きます', '{書|か}かない', 'nhóm 1: đổi đuôi → hàng あ (+ない)'],
        ['{話|はな}す', '{話|はな}します', '{話|はな}さない', 'nhóm 1: đổi đuôi → hàng あ (+ない)'],
        ['{買|か}う', '{買|か}います', '{買|か}わない', 'nhóm 1: đổi đuôi → hàng あ (+ない)'],
        ['ある', 'あります', 'ない', 'nhóm 1: đổi đuôi → hàng あ (+ない)'],
        ['{来|く}る', '{来|き}ます', '{来|こ}ない', 'bất quy tắc'],
        ['する', 'します', 'しない', 'bất quy tắc'],
      ],
    },

    /* ── Luyện ── */
    {
      t: 'quiz',
      id: 'ck-chia-te-n1',
      title: 'Luyện 1 — Thể て của nhóm 1 (30 câu). Gõ bằng chữ Hán hoặc hiragana.',
      kind: 'fill',
      grammar: 'Nhóm 1: い・ち・り → って · み・び・に → んで · き → いて · ぎ → いで · し → して · 行きます → 行って',
      items: [
        { q: '{行|い}きます → thể て', answers: V('{行|い}って'), hint: 'đi' },
        { q: '{帰|かえ}ります → thể て', answers: V('{帰|かえ}って'), hint: 'về' },
        { q: '{飲|の}みます → thể て', answers: V('{飲|の}んで'), hint: 'uống' },
        { q: '{買|か}います → thể て', answers: V('{買|か}って'), hint: 'mua' },
        { q: '{聞|き}きます → thể て', answers: V('{聞|き}いて'), hint: 'nghe; hỏi' },
        { q: '{働|はたら}きます → thể て', answers: V('{働|はたら}いて'), hint: 'làm việc' },
        { q: '{読|よ}みます → thể て', answers: V('{読|よ}んで'), hint: 'đọc' },
        { q: '{会|あ}います → thể て', answers: V('{会|あ}って'), hint: 'gặp' },
        { q: '{作|つく}ります → thể て', answers: V('{作|つく}って'), hint: 'làm, nấu' },
        { q: '{登|のぼ}ります → thể て', answers: V('{登|のぼ}って'), hint: 'leo' },
        { q: '{入|はい}ります → thể て', answers: V('{入|はい}って'), hint: 'vào' },
        { q: '{撮|と}ります → thể て', answers: V('{撮|と}って'), hint: 'chụp (ảnh)' },
        { q: 'あります → thể て', answers: V('あって'), hint: 'có (đồ vật)' },
        { q: '{遊|あそ}びます → thể て', answers: V('{遊|あそ}んで'), hint: 'chơi' },
        { q: '{洗|あら}います → thể て', answers: V('{洗|あら}って'), hint: 'rửa' },
        { q: '{置|お}きます → thể て', answers: V('{置|お}いて'), hint: 'đặt, để' },
        { q: '{書|か}きます → thể て', answers: V('{書|か}いて'), hint: 'viết' },
        { q: '{貸|か}します → thể て', answers: V('{貸|か}して'), hint: 'cho mượn' },
        { q: '{切|き}ります → thể て', answers: V('{切|き}って'), hint: 'cắt' },
        { q: '{使|つか}います → thể て', answers: V('{使|つか}って'), hint: 'dùng' },
        { q: '{手伝|てつだ}います → thể て', answers: V('{手伝|てつだ}って'), hint: 'giúp' },
        { q: '{取|と}ります → thể て', answers: V('{取|と}って'), hint: 'lấy' },
        { q: '{持|も}って{行|い}きます → thể て', answers: V('{持|も}って{行|い}って'), hint: 'mang đi' },
        { q: 'わかります → thể て', answers: V('わかって'), hint: 'hiểu' },
        { q: '{出|だ}します → thể て', answers: V('{出|だ}して'), hint: 'lấy ra; nộp' },
        { q: '{歌|うた}います → thể て', answers: V('{歌|うた}って'), hint: 'hát' },
        { q: '{吸|す}います → thể て', answers: V('{吸|す}って'), hint: 'hút (thuốc)' },
        { q: '{話|はな}します → thể て', answers: V('{話|はな}して'), hint: 'nói chuyện' },
        { q: '{弾|ひ}きます → thể て', answers: V('{弾|ひ}いて'), hint: 'chơi (đàn)' },
        { q: '{持|も}ちます → thể て', answers: V('{持|も}って'), hint: 'cầm, mang' },
      ],
    },
    {
      t: 'quiz',
      id: 'ck-chia-te-n23',
      title: 'Luyện 2 — Thể て của nhóm 2 và nhóm 3 (19 câu)',
      kind: 'fill',
      grammar: 'Nhóm 2: bỏ ます + て · Nhóm 3: きて / して',
      items: [
        { q: '{食|た}べます → thể て', answers: V('{食|た}べて'), hint: 'ăn' },
        { q: '{見|み}ます → thể て', answers: V('{見|み}て'), hint: 'xem, nhìn' },
        { q: 'します → thể て', answers: V('して'), hint: 'làm' },
        { q: '{起|お}きます → thể て', answers: V('{起|お}きて'), hint: 'thức dậy' },
        { q: '{寝|ね}ます → thể て', answers: V('{寝|ね}て'), hint: 'ngủ' },
        { q: '{勉強|べんきょう}します → thể て', answers: V('{勉強|べんきょう}して'), hint: 'học' },
        { q: '{来|き}ます → thể て', answers: V('{来|き}て'), hint: 'đến' },
        { q: '{買|か}い{物|もの}します → thể て', answers: V('{買|か}い{物|もの}して'), hint: 'mua sắm' },
        { q: '{食事|しょくじ}します → thể て', answers: V('{食事|しょくじ}して'), hint: 'ăn uống' },
        { q: '{洗濯|せんたく}します → thể て', answers: V('{洗濯|せんたく}して'), hint: 'giặt giũ' },
        { q: '{掃除|そうじ}します → thể て', answers: V('{掃除|そうじ}して'), hint: 'dọn dẹp' },
        { q: '{借|か}ります → thể て', answers: V('{借|か}りて'), hint: 'mượn' },
        { q: 'います → thể て', answers: V('いて'), hint: 'có, ở (người, con vật)' },
        { q: '{入|い}れます → thể て', answers: V('{入|い}れて'), hint: 'cho vào' },
        { q: '{教|おし}えます → thể て', answers: V('{教|おし}えて'), hint: 'dạy; chỉ' },
        { q: '{開|あ}けます → thể て', answers: V('{開|あ}けて'), hint: 'mở' },
        { q: '{閉|し}めます → thể て', answers: V('{閉|し}めて'), hint: 'đóng' },
        { q: 'かけます → thể て', answers: V('かけて'), hint: 'gọi (điện)' },
        { q: '{持|も}って{来|き}ます → thể て', answers: V('{持|も}って{来|き}て'), hint: 'mang đến' },
      ],
    },
    {
      t: 'quiz',
      id: 'ck-chia-ngu-canh',
      title: 'Luyện 3 — Chia từ trong ngoặc theo ngữ cảnh (20 câu, như phần IV của đề)',
      kind: 'fill',
      grammar: 'Đọc cụm đứng SAU chỗ trống để chọn dạng: ください/います → て · たい/に行きます/かた → bỏ ます · ましょうか → bỏ ます',
      items: [
        { q: '{窓|まど}を（{開|あ}けます）ください。', answers: V('{開|あ}けて'), hint: '開けます' },
        { q: 'ペンを（{貸|か}します）ください。', answers: V('{貸|か}して'), hint: '貸します' },
        { q: 'パクさんは{今|いま}、へやで{本|ほん}を（{読|よ}みます）います。', answers: V('{読|よ}んで'), hint: '読みます' },
        { q: 'ワンさんは{台所|だいどころ}でお{皿|さら}を（{洗|あら}います）います。', answers: V('{洗|あら}って'), hint: '洗います' },
        { q: 'この{漢字|かんじ}の（{書|か}きます）かたを{教|おし}えてください。', answers: V('{書|か}き'), hint: '書きます → 書き' },
        { q: 'コーヒーを（{飲|の}みます）たいです。', answers: V('{飲|の}み'), hint: '飲みます → 飲み' },
        { q: '{昨日|きのう}、どこへも（{行|い}きます）ませんでした。', answers: V('{行|い}き'), hint: '行きます → 行き' },
        { q: '{友達|ともだち}に（{会|あ}います）に{行|い}きます。', answers: V('{会|あ}い'), hint: '会います → 会い' },
        { q: 'この{町|まち}はあまり（きれいです）。', answers: V('きれいじゃありません', 'きれいではありません'), hint: 'きれいです → phủ định' },
        { q: '{昨日|きのう}は（{寒|さむ}いです）。', answers: V('{寒|さむ}かったです'), hint: '寒いです → quá khứ' },
        { q: '{去年|きょねん}の{冬|ふゆ}はあまり（{寒|さむ}いです）。', answers: V('{寒|さむ}くなかったです'), hint: '寒いです → quá khứ phủ định' },
        { q: '{先週|せんしゅう}のテストは（{簡単|かんたん}です）。', answers: V('{簡単|かんたん}でした'), hint: '簡単です → quá khứ' },
        { q: 'この{店|みせ}のラーメンはあまり（いいです）。', answers: V('よくないです', 'よくありません'), hint: 'いいです → phủ định' },
        { q: '{昨日|きのう}は（{雨|あめ}です）。', answers: V('{雨|あめ}じゃありませんでした', '{雨|あめ}ではありませんでした'), hint: '雨です → quá khứ phủ định' },
        { q: 'このお{寺|てら}はあまり（{有名|ゆうめい}です）。', answers: V('{有名|ゆうめい}じゃありません', '{有名|ゆうめい}ではありません'), hint: '有名です → phủ định' },
        { q: '{私|わたし}が（{手伝|てつだ}います）か。', answers: V('{手伝|てつだ}いましょう'), hint: '手伝います → ましょう (đề nghị giúp)' },
        { q: 'すみませんが、{少|すこ}し（{手伝|てつだ}います）ください。', answers: V('{手伝|てつだ}って'), hint: '手伝います → て' },
        { q: 'すみませんが、{傘|かさ}を（{持|も}って{来|き}ます）ください。', answers: V('{持|も}って{来|き}て'), hint: '持って来ます → て' },
        { q: 'パクさんは{何|なに}を（{書|か}きます）いますか。', answers: V('{書|か}いて'), hint: '書きます → て' },
        { q: '{今晩|こんばん}、ビールを（{飲|の}みます）ませんか。', answers: V('{飲|の}み'), hint: '飲みます → 飲み (rủ)' },
      ],
    },
    {
      t: 'mcq',
      id: 'ck-chia-nhom',
      title: 'Luyện 4 — Trắc nghiệm nhóm động từ và thể て (18 câu)',
      items: [
        M('Động từ nào thuộc **nhóm 2**?', 'みます (見ます)', ['かいます', 'よみます', 'あそびます'], 'みます (見る) là **nhóm 2** đặc biệt (đuôi い nhưng chia như nhóm 2). Ba từ còn lại là nhóm 1.', 0),
        M('{切|き}ります → thể て', 'きって', ['きて', 'きいて', 'きんで'], '**切ります** là nhóm 1 (り → って).', 1),
        M('{行|い}きます → thể て', 'いって', ['いきて', 'いいて', 'いんで'], 'Ngoại lệ duy nhất của き: **行って**.', 2),
        M('{飲|の}みます → thể て', 'のんで', ['のみて', 'のって', 'のいて'], 'み → **んで**.', 3),
        M('{遊|あそ}びます → thể て', 'あそんで', ['あそびて', 'あそって', 'あそいで'], 'び → **んで**.', 0),
        M('{書|か}きます → thể て', 'かいて', ['かって', 'かんで', 'かきて'], 'き → **いて**.', 1),
        M('{話|はな}します → thể て', 'はなして', ['はないて', 'はなって', 'はなんで'], 'し → **して**.', 2),
        M('{起|お}きます (thức dậy) → thể て', 'おきて', ['おいて', 'おきって', 'おんで'], '起きます là **nhóm 2** → bỏ ます + て = おきて.', 3),
        M('{置|お}きます (đặt, để) → thể て', 'おいて', ['おきて', 'おって', 'おんで'], '置きます là **nhóm 1** (き → いて) = おいて.', 0),
        M('{来|き}ます → thể て', 'きて', ['きって', 'くて', 'いて'], '**来ます → 来て** (nhóm 3).', 1),
        M('{勉強|べんきょう}します → thể て', 'べんきょうして', ['べんきょうって', 'べんきょうきて', 'べんきょうしって'], '**します → して**.', 2),
        M('{借|か}ります → thể て', 'かりて', ['かって', 'かりって', 'かんで'], '**借ります** là nhóm 2 (đặc biệt) → かりて.', 3),
        M('{帰|かえ}ります → thể て', 'かえって', ['かえりて', 'かえいて', 'かえんで'], '**帰ります** là nhóm 1 → かえって.', 0),
        M('{入|はい}ります (đi vào) → thể て', 'はいって', ['はいれて', 'はいて', 'はいんで'], '入ります nhóm 1 → はいって. (入れます mới → いれて.)', 1),
        M('わかります → thể て', 'わかって', ['わかりて', 'わかいて', 'わかんで'], 'り → **って**.', 2),
        M('あります → thể て', 'あって', ['あて', 'あいて', 'ありて'], 'あります nhóm 1 → **あって**.', 3),
        M('います (có, ở) → thể て', 'いて', ['いって', 'いんで', 'いきて'], 'います là nhóm 2 → **いて**. (いって là của 行きます.)', 0),
        M('{手伝|てつだ}います → thể て', 'てつだって', ['てつだいて', 'てつだんで', 'てつだして'], 'い → **って**.', 1),
      ],
    },
  ],
};

/* ═══════════════════ 5. LUYỆN NGHE (kịch bản MỚI) ═══════════════════ */

type LL = { who: string; voice: Voice; text: string; ro: string; vi: string };
/** Một dòng thoại: giọng nữ (F) / giọng nam (N). */
const F = (who: string, text: string, ro: string, vi: string): LL => ({ who, voice: 'ja-nu', text, ro, vi });
const N = (who: string, text: string, ro: string, vi: string): LL => ({ who, voice: 'ja-nam', text, ro, vi });
/** Một đoạn nghe. */
const LS = (id: string, title: string, lines: LL[], note?: string): Block => ({ t: 'listen', id, title, note, lines });

const NGHE_B4: Block[] = [
  { t: 'h', text: 'Bài 4 — Quê quán, đi lại, thành phố, thời tiết, món ăn (dạng やってみよう 1–3)' },
  { t: 'p', text: 'Mỗi đoạn có nút nghe; lời thoại ẩn cho tới khi bạn muốn xem. Nghe **hai lần**: lần 1 chỉ ghi số/tên/○×, lần 2 mới trả lời câu hỏi.' },
  LS('ck-ng-4-01', '① Quê của Daniel', [
    F('リン', 'ダニエルさんのおくにはどちらですか。', 'Danieru-san no okuni wa dochira desu ka.', 'Quê của Daniel là ở đâu?'),
    N('ダニエル', 'オーストラリアです。シドニーです。', 'Oosutoraria desu. Shidonii desu.', 'Là Úc. Là Sydney.'),
    F('リン', 'シドニー？シドニーはどこですか。', 'Shidonii? Shidonii wa doko desu ka.', 'Sydney? Sydney ở đâu?'),
    N('ダニエル', 'オーストラリアの{東|ひがし}です。', 'Oosutoraria no higashi desu.', 'Ở phía đông nước Úc.'),
    F('リン', 'そうですか。{日本|にほん}からシドニーまでどのくらいですか。', 'Sou desu ka. Nihon kara Shidonii made dono kurai desu ka.', 'Vậy à. Từ Nhật đến Sydney mất bao lâu?'),
    N('ダニエル', '{飛行機|ひこうき}で{九時間|くじかん}くらいです。', 'Hikouki de kujikan kurai desu.', 'Đi máy bay khoảng 9 tiếng.'),
  ]),
  LS('ck-ng-4-02', '② Từ nhà đến trường', [
    N('マルコ', 'パクさんのうちから{大学|だいがく}までどのくらいですか。', 'Paku-san no uchi kara daigaku made dono kurai desu ka.', 'Từ nhà Park đến trường đại học mất bao lâu?'),
    F('パク', '{電車|でんしゃ}で{四十分|よんじゅっぷん}くらいです。', 'Densha de yonjuppun kurai desu.', 'Đi tàu điện khoảng 40 phút.'),
    N('マルコ', '{遠|とお}いですね。', 'Tooi desu ne.', 'Xa nhỉ.'),
    F('パク', 'ええ。でも、{駅|えき}から{大学|だいがく}まで{歩|ある}いて{五分|ごふん}です。', 'Ee. Demo, eki kara daigaku made aruite gofun desu.', 'Vâng. Nhưng từ ga đến trường đi bộ 5 phút.'),
  ]),
  LS('ck-ng-4-03', '③ Thị trấn của Anna', [
    F('リン', 'アンナさんの{町|まち}は{大|おお}きいですか。', 'Anna-san no machi wa ookii desu ka.', 'Thị trấn của Anna có lớn không?'),
    F('アンナ', 'いいえ、{大|おお}きくないです。{小|ちい}さい{町|まち}です。でも、きれいですよ。', 'Iie, ookikunai desu. Chiisai machi desu. Demo, kirei desu yo.', 'Không, không lớn. Là thị trấn nhỏ. Nhưng đẹp đấy.'),
    F('リン', '{何|なに}がありますか。', 'Nani ga arimasu ka.', 'Có những gì?'),
    F('アンナ', '{古|ふる}い{教会|きょうかい}と、きれいな{川|かわ}があります。', 'Furui kyoukai to, kirei na kawa ga arimasu.', 'Có một nhà thờ cổ và một con sông đẹp.'),
  ]),
  LS('ck-ng-4-04', '④ Bắc Kinh', [
    N('ワン', 'ペキンはどんなところですか。', 'Pekin wa donna tokoro desu ka.', 'Bắc Kinh là nơi như thế nào?'),
    F('パク', 'とても{大|おお}きいです。そして、にぎやかです。{人|ひと}が{多|おお}いです。', 'Totemo ookii desu. Soshite, nigiyaka desu. Hito ga ooi desu.', 'Rất lớn. Và nhộn nhịp. Đông người.'),
    N('ワン', '{山|やま}がありますか。', 'Yama ga arimasu ka.', 'Có núi không?'),
    F('パク', 'いいえ、{山|やま}はありません。でも、{古|ふる}いお{城|しろ}があります。', 'Iie, yama wa arimasen. Demo, furui oshiro ga arimasu.', 'Không, không có núi. Nhưng có một toà thành cổ.'),
  ]),
  LS('ck-ng-4-05', '⑤ Quê của Marco', [
    N('ダニエル', 'マルコさんの{町|まち}はにぎやかですか。', 'Maruko-san no machi wa nigiyaka desu ka.', 'Thị trấn của Marco có nhộn nhịp không?'),
    N('マルコ', 'いいえ、にぎやかじゃありません。{静|しず}かなところです。{緑|みどり}が{多|おお}いです。', 'Iie, nigiyaka ja arimasen. Shizuka na tokoro desu. Midori ga ooi desu.', 'Không, không nhộn nhịp. Là nơi yên tĩnh. Nhiều cây xanh.'),
    N('ダニエル', '{温泉|おんせん}がありますか。', 'Onsen ga arimasu ka.', 'Có suối nước nóng không?'),
    N('マルコ', 'はい、あります。{有名|ゆうめい}な{温泉|おんせん}です。', 'Hai, arimasu. Yuumei na onsen desu.', 'Có. Là suối nước nóng nổi tiếng.'),
  ]),
  LS('ck-ng-4-06', '⑥ Tháng 12 ở đâu cũng lạnh?', [
    F('リン', '{今日|きょう}は{寒|さむ}いですね。', 'Kyou wa samui desu ne.', 'Hôm nay lạnh nhỉ.'),
    N('パク', 'そうですね。ダニエルさんの{国|くに}も{十二月|じゅうにがつ}、{寒|さむ}いですか。', 'Sou desu ne. Danieru-san no kuni mo juunigatsu, samui desu ka.', 'Ừ nhỉ. Nước Daniel tháng 12 cũng lạnh à?'),
    N('ダニエル', 'いいえ、{寒|さむ}くないです。{十二月|じゅうにがつ}は{夏|なつ}です。とても{暑|あつ}いです。', 'Iie, samukunai desu. Juunigatsu wa natsu desu. Totemo atsui desu.', 'Không, không lạnh. Tháng 12 là mùa hè. Rất nóng.'),
  ]),
  LS('ck-ng-4-07', '⑦ Mùa hè Nhật Bản', [
    N('ワン', '{日本|にほん}の{夏|なつ}はどうですか。', 'Nihon no natsu wa dou desu ka.', 'Mùa hè Nhật thế nào?'),
    F('アンナ', 'とても{暑|あつ}いです。そして、{雨|あめ}が{多|おお}いです。', 'Totemo atsui desu. Soshite, ame ga ooi desu.', 'Rất nóng. Và mưa nhiều.'),
    N('ワン', 'ベトナムは{一年中|いちねんじゅう}{暑|あつ}いです。でも、{雪|ゆき}は{見|み}ません。', 'Betonamu wa ichinenjuu atsui desu. Demo, yuki wa mimasen.', 'Việt Nam nóng quanh năm. Nhưng không thấy tuyết.'),
  ]),
  LS('ck-ng-4-08', '⑧ Quả dưa lưới', [
    F('リン', 'これは{何|なん}ですか。', 'Kore wa nan desu ka.', 'Đây là gì?'),
    N('マルコ', 'メロンです。{甘|あま}いですよ。どうぞ。', 'Meron desu. Amai desu yo. Douzo.', 'Là dưa lưới. Ngọt đấy. Mời bạn.'),
    F('リン', 'ありがとうございます。わあ、{冷|つめ}たいですね。おいしいです。', 'Arigatou gozaimasu. Waa, tsumetai desu ne. Oishii desu.', 'Cảm ơn. Oa, mát lạnh nhỉ. Ngon quá.'),
  ]),
  LS('ck-ng-4-09', '⑨ Món cà ri', [
    N('パク', 'このカレーは{辛|から}いですか。', 'Kono karee wa karai desu ka.', 'Món cà ri này có cay không?'),
    F('アンナ', 'はい、とても{辛|から}いです。でも、{冷|つめ}たいジュースがありますよ。', 'Hai, totemo karai desu. Demo, tsumetai juusu ga arimasu yo.', 'Có, rất cay. Nhưng có nước ép lạnh đấy.'),
    N('パク', 'ありがとう。{少|すこ}しだけ{食|た}べます。', 'Arigatou. Sukoshi dake tabemasu.', 'Cảm ơn. Tôi chỉ ăn một chút thôi.'),
  ]),
  LS('ck-ng-4-10', '⑩ Hội thoại dài (もう{一度|いちど}{聞|き}こう): Đà Lạt', [
    F('アンナ', 'リンさんの{町|まち}はどこですか。', 'Rin-san no machi wa doko desu ka.', 'Thành phố của Linh ở đâu?'),
    F('リン', 'ダラットです。ベトナムの{南|みなみ}です。', 'Daratto desu. Betonamu no minami desu.', 'Là Đà Lạt. Ở phía nam Việt Nam.'),
    F('アンナ', 'ダラット？ダラットはどんなところですか。', 'Daratto? Daratto wa donna tokoro desu ka.', 'Đà Lạt? Đà Lạt là nơi như thế nào?'),
    F('リン', '{山|やま}が{多|おお}いです。そして、とても{静|しず}かです。', 'Yama ga ooi desu. Soshite, totemo shizuka desu.', 'Nhiều núi. Và rất yên tĩnh.'),
    F('アンナ', '{暑|あつ}いですか。', 'Atsui desu ka.', 'Có nóng không?'),
    F('リン', 'いいえ、{暑|あつ}くないです。{一年中|いちねんじゅう}{涼|すず}しいです。', 'Iie, atsukunai desu. Ichinenjuu suzushii desu.', 'Không, không nóng. Quanh năm mát mẻ.'),
    F('アンナ', 'いいですね。{何|なに}がありますか。', 'Ii desu ne. Nani ga arimasu ka.', 'Hay quá. Có những gì?'),
    F('リン', 'きれいな{花|はな}があります。そして、{有名|ゆうめい}なコーヒーもあります。', 'Kirei na hana ga arimasu. Soshite, yuumei na koohii mo arimasu.', 'Có hoa đẹp. Và có cả cà phê nổi tiếng.'),
    F('アンナ', 'ホーチミンからダラットまでどのくらいですか。', 'Hoochimin kara Daratto made dono kurai desu ka.', 'Từ TP.HCM đến Đà Lạt mất bao lâu?'),
    F('リン', 'バスで{六時間|ろくじかん}くらいです。', 'Basu de rokujikan kurai desu.', 'Đi xe buýt khoảng 6 tiếng.'),
  ]),
  {
    t: 'mcq',
    id: 'ck-ng-4-hoi',
    title: 'Câu hỏi nghe Bài 4 (19 câu)',
    items: [
      M('① Quê của Daniel ở đâu?', 'Sydney, nước Úc', ['Sydney, nước Anh', 'Tokyo, Nhật', 'Hà Nội, Việt Nam'], 'Daniel: オーストラリア → シドニー.', 0),
      M('① Sydney nằm ở phía nào của nước Úc?', 'Phía đông', ['Phía tây', 'Phía bắc', 'Chính giữa'], 'オーストラリアの**東** (ひがし).', 1),
      M('① Từ Nhật đến Sydney đi máy bay mất bao lâu?', '9 tiếng', ['6 tiếng', '5 tiếng', '10 tiếng'], '**九時間 = くじかん** (không phải きゅうじかん). Chú ý: 9 tiếng ≠ 9 giờ.', 2),
      M('② Từ nhà Park đến trường đi tàu điện mất bao lâu?', '40 phút', ['4 phút', '14 phút', '50 phút'], '**よんじゅっぷん** = 40 phút. Cẩn thận よんふん (4) và よんじゅう (40).', 3),
      M('② Từ ga đến trường Park đi thế nào?', 'Đi bộ 5 phút', ['Đi xe buýt 5 phút', 'Đi bộ 15 phút', 'Đi tàu 5 phút'], '**歩いて五分**.', 0),
      M('③ Thị trấn của Anna thế nào?', 'Nhỏ và đẹp', ['Lớn và đẹp', 'Nhỏ và không đẹp', 'Lớn và nhộn nhịp'], '大きくない、小さい、きれい.', 1),
      M('③ Ở thị trấn của Anna có gì? (chọn đúng cả hai)', 'Nhà thờ cổ và con sông đẹp', ['Chùa cổ và núi', 'Nhà thờ mới và sông', 'Thành cổ và suối nước nóng'], '古い**教会**ときれいな**川**.', 2),
      M('④ Bắc Kinh KHÔNG có gì?', 'Núi', ['Thành cổ', 'Người đông', 'Nhộn nhịp'], '**山はありません**. 古いお城はある.', 0),
      M('④ Bắc Kinh được miêu tả thế nào?', 'Lớn, nhộn nhịp, đông người', ['Nhỏ, yên tĩnh', 'Lớn, yên tĩnh', 'Nhỏ, nhộn nhịp'], 'とても大きい、にぎやか、人が多い.', 1),
      M('⑤ Thị trấn của Marco thế nào?', 'Yên tĩnh, nhiều cây xanh', ['Nhộn nhịp, nhiều người', 'Yên tĩnh, ít cây', 'Nhộn nhịp, nhiều cây'], 'にぎやか**じゃありません**。静か、緑が多い.', 2),
      M('⑤ Ở thị trấn Marco có gì nổi tiếng?', 'Suối nước nóng', ['Nhà thờ', 'Núi lửa', 'Lâu đài'], '有名な**温泉**.', 3),
      M('⑥ Tháng 12 ở nước Daniel thế nào?', 'Mùa hè, rất nóng', ['Mùa đông, lạnh', 'Mùa xuân, mát', 'Mùa thu, mát'], 'Bẫy: Park hỏi “lạnh không?” nhưng Daniel đáp **寒くない**; 12月は夏.', 0),
      M('⑦ Mùa hè Nhật Bản thế nào?', 'Rất nóng và mưa nhiều', ['Rất nóng, ít mưa', 'Mát, mưa nhiều', 'Lạnh, có tuyết'], '暑い**そして**雨が多い.', 1),
      M('⑦ Wang nói gì về Việt Nam?', 'Nóng quanh năm, không thấy tuyết', ['Lạnh quanh năm', 'Mùa đông có tuyết', 'Nóng, nhiều mưa'], '**一年中**暑い. 雪は見ません.', 2),
      M('⑧ Quả dưa lưới thế nào?', 'Ngọt và mát lạnh, ngon', ['Chua và cay', 'Đắng và nóng', 'Ngọt nhưng không ngon'], '甘い、冷たい、おいしい.', 3),
      M('⑨ Món cà ri thế nào?', 'Rất cay', ['Rất ngọt', 'Hơi chua', 'Rất lạnh'], '**とても辛い**.', 0),
      M('⑩ Đà Lạt nằm ở đâu của Việt Nam?', 'Phía nam', ['Phía bắc', 'Chính giữa', 'Phía tây'], 'ベトナムの**南**.', 1),
      M('⑩ Khí hậu Đà Lạt thế nào?', 'Mát mẻ quanh năm', ['Nóng quanh năm', 'Lạnh có tuyết', 'Mùa hè nóng'], '**暑くない**。一年中涼しい.', 2),
      M('⑩ Từ TP.HCM đến Đà Lạt đi xe buýt mất bao lâu?', '6 tiếng', ['9 tiếng', '4 tiếng', '16 tiếng'], '**六時間 = ろくじかん**.', 3),
    ],
  },
  {
    t: 'quiz',
    id: 'ck-ng-4-dien',
    title: 'Nghe điền chỗ trống Bài 4 (như dạng Slot 30): nghe lại ①, ③, ⑥ rồi điền',
    kind: 'fill',
    items: [
      { q: 'リン：ダニエルさんのおくには＿＿＿ですか。', answers: V('どちら'), hint: 'どちら' },
      { q: 'ダニエル：{日本|にほん}からシドニーまで{飛行機|ひこうき}で＿＿＿くらいです。', answers: V('{九時間|くじかん}'), hint: '' },
      { q: 'アンナ：いいえ、＿＿＿ないです。{小|ちい}さい{町|まち}です。', answers: V('{大|おお}きく'), hint: '' },
      { q: 'アンナ：{古|ふる}い＿＿＿と、きれいな{川|かわ}があります。', answers: V('{教会|きょうかい}'), hint: '' },
      { q: 'パク：ダニエルさんの{国|くに}も{十二月|じゅうにがつ}、＿＿＿ですか。', answers: V('{寒|さむ}い'), hint: '' },
      { q: 'ダニエル：{十二月|じゅうにがつ}は＿＿＿です。とても{暑|あつ}いです。', answers: V('{夏|なつ}'), hint: '' },
    ],
  },
];

const NGHE_B5: Block[] = [
  { t: 'h', text: 'Bài 5 — Cuối tuần, cảm tưởng, thích/muốn, đi để làm gì (dạng やってみよう 1–3)' },
  LS('ck-ng-5-01', '① Chủ nhật của Marco', [
    N('パク', 'マルコさん、{日曜日|にちようび}、どこかへ{行|い}きましたか。', 'Maruko-san, nichiyoubi, dokoka e ikimashita ka.', 'Marco, Chủ nhật bạn có đi đâu không?'),
    N('マルコ', 'はい。{友達|ともだち}と{海|うみ}へ{行|い}きました。', 'Hai. Tomodachi to umi e ikimashita.', 'Có. Tôi đi biển với bạn.'),
    N('パク', '{何|なに}をしましたか。', 'Nani o shimashita ka.', 'Bạn đã làm gì?'),
    N('マルコ', '{写真|しゃしん}を{撮|と}りました。そして、おいしい{魚|さかな}を{食|た}べました。', 'Shashin o torimashita. Soshite, oishii sakana o tabemashita.', 'Tôi chụp ảnh. Và ăn cá ngon.'),
  ]),
  LS('ck-ng-5-02', '② Cuối tuần ở nhà', [
    F('リン', 'ダニエルさんは{先週|せんしゅう}の{週末|しゅうまつ}、{何|なに}をしましたか。', 'Danieru-san wa senshuu no shuumatsu, nani o shimashita ka.', 'Cuối tuần trước Daniel làm gì?'),
    N('ダニエル', 'どこへも{行|い}きませんでした。{洗濯|せんたく}をしました。それから、ゲームをしました。', 'Doko e mo ikimasen deshita. Sentaku o shimashita. Sorekara, geemu o shimashita.', 'Tôi không đi đâu cả. Tôi giặt đồ. Sau đó chơi game.'),
    F('リン', 'そうですか。どのくらいゲームをしましたか。', 'Sou desu ka. Dono kurai geemu o shimashita ka.', 'Vậy à. Bạn chơi game bao lâu?'),
    N('ダニエル', '{三時間|さんじかん}くらいです。', 'Sanjikan kurai desu.', 'Khoảng 3 tiếng.'),
  ]),
  LS('ck-ng-5-03', '③ Mua sắm hôm qua', [
    F('アンナ', '{昨日|きのう}、デパートへ{行|い}きました。', 'Kinou, depaato e ikimashita.', 'Hôm qua tôi đã đi trung tâm thương mại.'),
    N('ワン', '{何|なに}を{買|か}いましたか。', 'Nani o kaimashita ka.', 'Bạn mua gì?'),
    F('アンナ', '{服|ふく}を{買|か}いました。{安|やす}かったです。', 'Fuku o kaimashita. Yasukatta desu.', 'Tôi mua quần áo. Rẻ lắm.'),
    N('ワン', 'いいですね。', 'Ii desu ne.', 'Hay quá.'),
  ]),
  LS('ck-ng-5-04', '④ Chuyến đi Kyoto', [
    N('パク', '{京都|きょうと}はどうでしたか。', 'Kyouto wa dou deshita ka.', 'Kyoto thế nào?'),
    F('リン', 'とても{良|よ}かったです。お{寺|てら}がきれいでした。', 'Totemo yokatta desu. Otera ga kirei deshita.', 'Rất tuyệt. Các ngôi chùa đẹp.'),
    N('パク', '{天気|てんき}はどうでしたか。', 'Tenki wa dou deshita ka.', 'Thời tiết thế nào?'),
    F('リン', '{雨|あめ}でした。でも、{寒|さむ}くなかったです。', 'Ame deshita. Demo, samukunakatta desu.', 'Trời mưa. Nhưng không lạnh.'),
  ]),
  LS('ck-ng-5-05', '⑤ Bài kiểm tra hôm qua', [
    N('マルコ', 'ワンさん、{昨日|きのう}のテストはどうでしたか。', 'Wan-san, kinou no tesuto wa dou deshita ka.', 'Wang, bài kiểm tra hôm qua thế nào?'),
    F('ワン', '{難|むずか}しかったです。{漢字|かんじ}が{多|おお}かったです。', 'Muzukashikatta desu. Kanji ga ookatta desu.', 'Khó. Nhiều chữ Hán.'),
    N('マルコ', '{私|わたし}は{簡単|かんたん}でしたよ。', 'Watashi wa kantan deshita yo.', 'Tôi thấy dễ đấy.'),
  ]),
  LS('ck-ng-5-06', '⑥ Cái bạn muốn nhất', [
    F('アンナ', 'パクさん、{今|いま}、{何|なに}がいちばんほしいですか。', 'Paku-san, ima, nani ga ichiban hoshii desu ka.', 'Park, bây giờ bạn muốn có gì nhất?'),
    N('パク', '{新|あたら}しいパソコンがほしいです。', 'Atarashii pasokon ga hoshii desu.', 'Tôi muốn có một cái máy tính mới.'),
    F('アンナ', 'どうしてですか。', 'Doushite desu ka.', 'Tại sao vậy?'),
    N('パク', '{今|いま}のパソコンは{古|ふる}いですから。', 'Ima no pasokon wa furui desu kara.', 'Vì máy tính hiện giờ đã cũ.'),
  ]),
  LS('ck-ng-5-07', '⑦ Tháng sau muốn làm gì', [
    F('リン', '{来月|らいげつ}、{何|なに}をしたいですか。', 'Raigetsu, nani o shitai desu ka.', 'Tháng sau bạn muốn làm gì?'),
    N('ダニエル', '{日本|にほん}で{温泉|おんせん}に{入|はい}りたいです。', 'Nihon de onsen ni hairitai desu.', 'Tôi muốn tắm suối nước nóng ở Nhật.'),
    F('リン', 'いいですね。{私|わたし}は{友達|ともだち}と{山|やま}に{登|のぼ}りたいです。', 'Ii desu ne. Watashi wa tomodachi to yama ni noboritai desu.', 'Hay quá. Tôi muốn leo núi cùng bạn.'),
  ]),
  LS('ck-ng-5-08', '⑧ Ngày mai đi đâu', [
    N('ワン', '{明日|あした}、どこへ{行|い}きますか。', 'Ashita, doko e ikimasu ka.', 'Ngày mai bạn đi đâu?'),
    N('マルコ', '{図書館|としょかん}へ{行|い}きます。{本|ほん}を{借|か}りに{行|い}きます。', 'Toshokan e ikimasu. Hon o kari ni ikimasu.', 'Tôi đi thư viện. Tôi đi mượn sách.'),
    N('ワン', 'そうですか。{私|わたし}は{友達|ともだち}に{会|あ}いに{行|い}きます。', 'Sou desu ka. Watashi wa tomodachi ni ai ni ikimasu.', 'Vậy à. Tôi đi gặp bạn.'),
  ]),
  LS('ck-ng-5-09', '⑨ Hội thoại dài (もう{一度|いちど}{聞|き}こう): Hakone và ở nhà', [
    N('パク', 'アンナさん、{日曜日|にちようび}、{何|なに}をしましたか。', 'Anna-san, nichiyoubi, nani o shimashita ka.', 'Anna, Chủ nhật bạn làm gì?'),
    F('アンナ', '{友達|ともだち}と{山|やま}へ{行|い}きました。', 'Tomodachi to yama e ikimashita.', 'Tôi đi núi cùng bạn.'),
    N('パク', '{山|やま}？どこの{山|やま}ですか。', 'Yama? Doko no yama desu ka.', 'Núi? Núi nào vậy?'),
    F('アンナ', '{箱根|はこね}です。{温泉|おんせん}に{入|はい}りました。', 'Hakone desu. Onsen ni hairimashita.', 'Là Hakone. Tôi đã tắm suối nước nóng.'),
    N('パク', 'いいですね。{天気|てんき}はどうでしたか。', 'Ii desu ne. Tenki wa dou deshita ka.', 'Hay quá. Thời tiết thế nào?'),
    F('アンナ', 'とても{良|よ}かったです。{景色|けしき}がきれいでした。', 'Totemo yokatta desu. Keshiki ga kirei deshita.', 'Rất đẹp trời. Cảnh đẹp lắm.'),
    N('パク', '{写真|しゃしん}を{撮|と}りましたか。', 'Shashin o torimashita ka.', 'Bạn có chụp ảnh không?'),
    F('アンナ', 'はい、たくさん{撮|と}りました。パクさんは？', 'Hai, takusan torimashita. Paku-san wa?', 'Có, tôi chụp nhiều. Còn Park?'),
    N('パク', '{私|わたし}はどこへも{行|い}きませんでした。{雨|あめ}でしたから、{家|いえ}で{映画|えいが}を{見|み}ました。', 'Watashi wa doko e mo ikimasen deshita. Ame deshita kara, ie de eiga o mimashita.', 'Tôi không đi đâu cả. Vì trời mưa nên tôi xem phim ở nhà.'),
  ]),
  {
    t: 'mcq',
    id: 'ck-ng-5-hoi',
    title: 'Câu hỏi nghe Bài 5 (20 câu)',
    items: [
      M('① Marco đi đâu vào Chủ nhật?', 'Đi biển với bạn', ['Đi núi với bạn', 'Đi biển một mình', 'Ở nhà'], '友達と**海**へ. Bẫy: と = cùng với (không đi một mình).', 0),
      M('① Marco đã làm gì ở đó? (chọn đúng cả hai)', 'Chụp ảnh và ăn cá', ['Tắm biển và chụp ảnh', 'Ăn cá và đi dạo', 'Mua đồ và ăn cá'], '写真を撮りました + 魚を食べました.', 1),
      M('② Daniel cuối tuần trước đi đâu?', 'Không đi đâu cả', ['Đi giặt đồ', 'Đi chơi game', 'Đi siêu thị'], '**どこへも行きませんでした**.', 2),
      M('② Daniel làm theo thứ tự nào?', 'Giặt đồ → chơi game', ['Chơi game → giặt đồ', 'Học bài → chơi game', 'Giặt đồ → học bài'], '洗濯 → **それから** ゲーム.', 3),
      M('② Daniel chơi game bao lâu?', 'Khoảng 3 tiếng', ['Khoảng 2 tiếng', 'Khoảng 3 phút', 'Khoảng 30 phút'], '**三時間** さんじかん.', 0),
      M('③ Anna đã mua gì?', 'Quần áo', ['Giày', 'Máy tính', 'Sách'], '**服** (ふく).', 1),
      M('③ Quần áo thế nào?', 'Rẻ', ['Đắt', 'Cũ', 'Khó'], '**安かった** = đã rẻ. (高かった mới là đắt.)', 2),
      M('④ Chuyến Kyoto của Linh thế nào?', 'Rất tuyệt, chùa đẹp', ['Chán, chùa xấu', 'Mệt, chùa đẹp', 'Tạm được, chùa cổ'], 'とても**良かった**。お寺がきれいでした.', 3),
      M('④ Thời tiết ở Kyoto?', 'Trời mưa nhưng không lạnh', ['Trời nắng và lạnh', 'Mưa và rất lạnh', 'Nắng và nóng'], '雨でした。でも寒**くなかった**.', 0),
      M('⑤ Bài kiểm tra của Wang thế nào?', 'Khó, nhiều chữ Hán', ['Dễ, ít chữ Hán', 'Khó, ít chữ Hán', 'Dễ, nhiều chữ Hán'], '難しかった。漢字が多かった.', 1),
      M('⑤ Marco thấy bài kiểm tra thế nào?', 'Dễ', ['Khó', 'Dài', 'Chán'], '簡単**でした** (な-adj quá khứ).', 2),
      M('⑥ Park muốn có gì nhất?', 'Máy tính mới', ['Điện thoại mới', 'Tiền', 'Quần áo'], '新しいパソコンが**ほしい**.', 3),
      M('⑥ Vì sao Park muốn?', 'Vì máy hiện tại đã cũ', ['Vì máy hiện tại bị hỏng', 'Vì rẻ', 'Vì bạn có'], '古いですから (から = vì).', 0),
      M('⑦ Daniel muốn làm gì ở Nhật?', 'Tắm suối nước nóng', ['Leo núi', 'Mua sắm', 'Xem phim'], '温泉に入りたい.', 1),
      M('⑦ Linh muốn làm gì?', 'Leo núi cùng bạn', ['Tắm suối nước nóng', 'Đi biển', 'Ăn cá'], '友達と山に登りたい.', 2),
      M('⑧ Marco ngày mai đi thư viện để làm gì?', 'Mượn sách', ['Trả sách', 'Học bài', 'Đọc báo'], '本を**借り**に行きます.', 3),
      M('⑧ Wang ngày mai đi làm gì?', 'Đi gặp bạn', ['Đi mua đồ', 'Đi thư viện', 'Đi biển'], '友達に**会い**に行きます.', 0),
      M('⑨ Anna Chủ nhật đã đi đâu và làm gì?', 'Hakone, tắm suối nước nóng', ['Biển, tắm biển', 'Hakone, leo núi', 'Ở nhà, xem phim'], '箱根 + 温泉に入りました.', 1),
      M('⑨ Thời tiết hôm Anna đi thế nào?', 'Rất đẹp, cảnh đẹp', ['Mưa', 'Lạnh', 'Nóng'], 'とても良かった。景色がきれい.', 2),
      M('⑨ Hôm đó Park đã làm gì?', 'Ở nhà xem phim vì trời mưa', ['Đi Hakone', 'Đi mua sắm', 'Đi biển'], 'どこへも行きませんでした。雨でしたから家で映画を見ました.', 3),
    ],
  },
  {
    t: 'quiz',
    id: 'ck-ng-5-dien',
    title: 'Nghe điền chỗ trống Bài 5: nghe lại ①, ⑥, ⑧ rồi điền',
    kind: 'fill',
    items: [
      { q: 'マルコ：{友達|ともだち}と＿＿＿へ{行|い}きました。', answers: V('{海|うみ}'), hint: '' },
      { q: 'マルコ：{写真|しゃしん}を＿＿＿。そして、おいしい{魚|さかな}を{食|た}べました。', answers: V('{撮|と}りました'), hint: '' },
      { q: 'パク：{新|あたら}しいパソコンが＿＿＿です。', answers: V('ほしい'), hint: '' },
      { q: 'パク：{今|いま}のパソコンは{古|ふる}い＿＿＿。', answers: V('ですから'), hint: '' },
      { q: 'マルコ：{図書館|としょかん}へ{行|い}きます。{本|ほん}を＿＿＿{行|い}きます。', answers: V('{借|か}りに'), hint: '' },
      { q: 'ワン：{私|わたし}は{友達|ともだち}に＿＿＿{行|い}きます。', answers: V('{会|あ}いに'), hint: '' },
    ],
  },
];

const NGHE_B6: Block[] = [
  { t: 'h', text: 'Bài 6 — Rủ rê ○×, chọn lựa, so sánh, vé, hẹn (dạng やってみよう 1–3)' },
  { t: 'p', text: 'Phần 1 (①–⑤) là dạng **ai nhận lời, ai từ chối**: nhớ thông tin **cuối cùng**. Phần 2 (⑥–⑧) là so sánh. Phần 3 (⑨–⑪) là もう/まだ, vé và hẹn giờ.' },
  LS('ck-ng-6-01', '① Rủ đi xem phim', [
    F('リン', 'ダニエルさん、{土曜日|どようび}、{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。', 'Danieru-san, doyoubi, issho ni eiga o mi ni ikimasen ka.', 'Daniel, thứ Bảy cùng đi xem phim không?'),
    N('ダニエル', 'いいですね。ぜひ{行|い}きたいです。', 'Ii desu ne. Zehi ikitai desu.', 'Hay quá. Tôi rất muốn đi.'),
    F('リン', 'じゃ、{土曜日|どようび}の{午後|ごご}{二時|にじ}に{駅|えき}で{会|あ}いましょう。', 'Ja, doyoubi no gogo niji ni eki de aimashou.', 'Vậy thứ Bảy 2 giờ chiều gặp nhau ở ga nhé.'),
    N('ダニエル', 'はい、わかりました。', 'Hai, wakarimashita.', 'Vâng, tôi hiểu rồi.'),
  ]),
  LS('ck-ng-6-02', '② Rủ đi lái xe', [
    N('パク', 'ワンさん、{日曜日|にちようび}、{一緒|いっしょ}にドライブに{行|い}きませんか。', 'Wan-san, nichiyoubi, issho ni doraibu ni ikimasen ka.', 'Wang, Chủ nhật cùng đi lái xe chơi không?'),
    F('ワン', 'ああ、{日曜日|にちようび}ですか。すみません、{日曜日|にちようび}はちょっと……。うちで{友達|ともだち}と{料理|りょうり}を{作|つく}りますから。', 'Aa, nichiyoubi desu ka. Sumimasen, nichiyoubi wa chotto. Uchi de tomodachi to ryouri o tsukurimasu kara.', 'À, Chủ nhật à. Xin lỗi, Chủ nhật thì hơi… Vì tôi nấu ăn với bạn ở nhà.'),
    N('パク', 'そうですか。{残念|ざんねん}です。', 'Sou desu ka. Zannen desu.', 'Vậy à. Tiếc quá.'),
  ]),
  LS('ck-ng-6-03', '③ Đổi sang ngày khác', [
    N('マルコ', 'アンナさん、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。', 'Anna-san, issho ni gohan o tabemasen ka.', 'Anna, cùng ăn cơm không?'),
    F('アンナ', '{金曜日|きんようび}はちょっと……。でも、{土曜日|どようび}はどうですか。', 'Kinyoubi wa chotto. Demo, doyoubi wa dou desu ka.', 'Thứ Sáu thì hơi… Nhưng thứ Bảy thì sao?'),
    N('マルコ', 'いいですよ。{土曜日|どようび}にしましょう。', 'Ii desu yo. Doyoubi ni shimashou.', 'Được chứ. Vậy chọn thứ Bảy nhé.'),
  ]),
  LS('ck-ng-6-04', '④ Có vé nhưng có hẹn', [
    F('リン', 'パクさん、{来週|らいしゅう}、{一緒|いっしょ}にコンサートに{行|い}きませんか。チケットが{二枚|にまい}あります。', 'Paku-san, raishuu, issho ni konsaato ni ikimasen ka. Chiketto ga nimai arimasu.', 'Park, tuần sau cùng đi hoà nhạc không? Mình có 2 vé.'),
    N('パク', 'いいですね。あ、でも{来週|らいしゅう}は{約束|やくそく}があります。すみません。', 'Ii desu ne. A, demo raishuu wa yakusoku ga arimasu. Sumimasen.', 'Hay đấy. À, nhưng tuần sau tôi có hẹn. Xin lỗi.'),
    F('リン', 'そうですか。また{今度|こんど}。', 'Sou desu ka. Mata kondo.', 'Vậy à. Hẹn lần sau nhé.'),
  ]),
  LS('ck-ng-6-05', '⑤ Rủ ăn thịt nướng', [
    N('ダニエル', 'ワンさん、{明日|あした}の{昼|ひる}、{一緒|いっしょ}に{焼|や}き{肉|にく}を{食|た}べませんか。', 'Wan-san, ashita no hiru, issho ni yakiniku o tabemasen ka.', 'Wang, trưa mai cùng ăn thịt nướng không?'),
    F('ワン', 'いいですね！{食|た}べましょう。どこで{食|た}べますか。', 'Ii desu ne! Tabemashou. Doko de tabemasu ka.', 'Hay quá! Ăn nhé. Mình ăn ở đâu?'),
    N('ダニエル', '{駅|えき}の{近|ちか}くの{店|みせ}はどうですか。', 'Eki no chikaku no mise wa dou desu ka.', 'Quán gần ga thì sao?'),
    F('ワン', 'いいですよ。', 'Ii desu yo.', 'Được chứ.'),
  ]),
  LS('ck-ng-6-06', '⑥ Chọn quán', [
    F('リン', 'ラーメンの{店|みせ}とお{好|この}み{焼|や}きの{店|みせ}と、どちらがいいですか。', 'Raamen no mise to okonomiyaki no mise to, dochira ga ii desu ka.', 'Quán ramen và quán okonomiyaki, quán nào tốt hơn?'),
    N('パク', 'ラーメンの{店|みせ}のほうが{近|ちか}いです。でも、お{好|この}み{焼|や}きの{店|みせ}のほうが{安|やす}いです。', 'Raamen no mise no hou ga chikai desu. Demo, okonomiyaki no mise no hou ga yasui desu.', 'Quán ramen gần hơn. Nhưng quán okonomiyaki rẻ hơn.'),
    F('リン', 'じゃ、お{好|この}み{焼|や}きの{店|みせ}にしましょう。', 'Ja, okonomiyaki no mise ni shimashou.', 'Vậy chọn quán okonomiyaki nhé.'),
  ]),
  LS('ck-ng-6-07', '⑦ Nơi đẹp nhất nước Nhật', [
    F('アンナ', '{日本|にほん}でどこがいちばんきれいですか。', 'Nihon de doko ga ichiban kirei desu ka.', 'Ở Nhật nơi nào đẹp nhất?'),
    N('マルコ', '{京都|きょうと}がいちばんきれいです。', 'Kyouto ga ichiban kirei desu.', 'Kyoto đẹp nhất.'),
    F('アンナ', 'そうですか。{私|わたし}は{北海道|ほっかいどう}が{好|す}きです。', 'Sou desu ka. Watashi wa Hokkaidou ga suki desu.', 'Vậy à. Tôi thích Hokkaido.'),
    N('マルコ', '{北海道|ほっかいどう}は{京都|きょうと}より{寒|さむ}いですよ。', 'Hokkaidou wa Kyouto yori samui desu yo.', 'Hokkaido lạnh hơn Kyoto đấy.'),
  ]),
  LS('ck-ng-6-08', '⑧ Mùa hè hay mùa đông', [
    N('ワン', '{夏|なつ}と{冬|ふゆ}と、どちらが{好|す}きですか。', 'Natsu to fuyu to, dochira ga suki desu ka.', 'Mùa hè và mùa đông, bạn thích mùa nào hơn?'),
    N('パク', '{冬|ふゆ}のほうが{好|す}きです。{夏|なつ}はとても{暑|あつ}いですから。', 'Fuyu no hou ga suki desu. Natsu wa totemo atsui desu kara.', 'Tôi thích mùa đông hơn. Vì mùa hè rất nóng.'),
    N('ワン', '{私|わたし}はどちらも{好|す}きです。', 'Watashi wa dochira mo suki desu.', 'Tôi thích cả hai.'),
  ]),
  LS('ck-ng-6-09', '⑨ Đã ăn trưa chưa', [
    N('パク', 'マルコさん、もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。', 'Maruko-san, mou hirugohan o tabemashita ka.', 'Marco, bạn ăn trưa chưa?'),
    N('マルコ', 'いいえ、まだです。', 'Iie, mada desu.', 'Chưa ạ.'),
    N('パク', 'じゃ、{一緒|いっしょ}に{食|た}べませんか。', 'Ja, issho ni tabemasen ka.', 'Vậy cùng ăn không?'),
    N('マルコ', 'いいですね。{食|た}べましょう。', 'Ii desu ne. Tabemashou.', 'Hay quá. Ăn thôi.'),
  ]),
  LS('ck-ng-6-10', '⑩ Vé bóng đá', [
    F('アンナ', 'サッカーのチケットが{三枚|さんまい}あります。{一緒|いっしょ}に{行|い}きませんか。', 'Sakkaa no chiketto ga sanmai arimasu. Issho ni ikimasen ka.', 'Mình có 3 vé bóng đá. Cùng đi không?'),
    N('ダニエル', 'いつですか。', 'Itsu desu ka.', 'Khi nào vậy?'),
    F('アンナ', '{来週|らいしゅう}の{土曜日|どようび}です。{横浜|よこはま}で{試合|しあい}があります。', 'Raishuu no doyoubi desu. Yokohama de shiai ga arimasu.', 'Thứ Bảy tuần sau. Có trận đấu ở Yokohama.'),
    N('ダニエル', 'いいですね。{行|い}きましょう。', 'Ii desu ne. Ikimashou.', 'Hay quá. Đi thôi.'),
  ]),
  LS('ck-ng-6-11', '⑪ Hội thoại dài (もう{一度|いちど}{聞|き}こう): Hẹn đi xem phim', [
    F('リン', 'パクさん、{今度|こんど}の{土曜日|どようび}、{時間|じかん}がありますか。', 'Paku-san, kondo no doyoubi, jikan ga arimasu ka.', 'Park, thứ Bảy này bạn có rảnh không?'),
    N('パク', '{土曜日|どようび}ですか。{午前|ごぜん}は{約束|やくそく}がありますが、{午後|ごご}はひまです。', 'Doyoubi desu ka. Gozen wa yakusoku ga arimasu ga, gogo wa hima desu.', 'Thứ Bảy à. Buổi sáng tôi có hẹn nhưng buổi chiều thì rảnh.'),
    F('リン', 'よかった。{一緒|いっしょ}に{映画|えいが}を{見|み}に{行|い}きませんか。', 'Yokatta. Issho ni eiga o mi ni ikimasen ka.', 'Tốt quá. Cùng đi xem phim không?'),
    N('パク', 'いいですね。{何|なん}の{映画|えいが}ですか。', 'Ii desu ne. Nan no eiga desu ka.', 'Hay đấy. Phim gì vậy?'),
    F('リン', 'コメディーです。チケットが{二枚|にまい}あります。', 'Komedii desu. Chiketto ga nimai arimasu.', 'Phim hài. Mình có 2 vé.'),
    N('パク', 'コメディーはおもしろいですね。{何時|なんじ}からですか。', 'Komedii wa omoshiroi desu ne. Nanji kara desu ka.', 'Phim hài thú vị nhỉ. Từ mấy giờ vậy?'),
    F('リン', '{三時|さんじ}からです。', 'Sanji kara desu.', 'Từ 3 giờ.'),
    N('パク', 'じゃ、{二時|にじ}に{映画館|えいがかん}の{前|まえ}で{会|あ}いましょう。', 'Ja, niji ni eigakan no mae de aimashou.', 'Vậy 2 giờ gặp nhau trước rạp chiếu phim nhé.'),
    F('リン', 'はい。{映画|えいが}の{後|あと}で、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。', 'Hai. Eiga no ato de, issho ni gohan o tabemasen ka.', 'Vâng. Sau phim cùng ăn cơm nhé?'),
    N('パク', 'いいですね。{行|い}きましょう。', 'Ii desu ne. Ikimashou.', 'Hay quá. Đi thôi.'),
  ]),
  {
    t: 'mcq',
    id: 'ck-ng-6-hoi',
    title: 'Câu hỏi nghe Bài 6 (24 câu)',
    items: [
      M('① Daniel nhận lời hay từ chối?', '○ Nhận lời', ['× Từ chối'], 'いいですね。**ぜひ行きたい**です → nhận lời.', 0),
      M('① Hai người gặp nhau lúc mấy giờ?', '2 giờ chiều', ['12 giờ trưa', '3 giờ chiều', '2 giờ sáng'], '**午後二時** (ごご にじ).', 1),
      M('① Hai người gặp nhau ở đâu?', 'Ở ga', ['Ở rạp phim', 'Ở nhà Linh', 'Ở công viên'], '駅で会いましょう.', 2),
      M('② Wang nhận lời hay từ chối?', '× Từ chối', ['○ Nhận lời'], '**ちょっと……** + lý do **から** → từ chối.', 0),
      M('② Vì sao Wang từ chối?', 'Phải nấu ăn với bạn ở nhà', ['Phải đi làm', 'Phải đi học', 'Bị ốm'], '友達と料理を作りますから.', 1),
      M('③ Ngày cuối cùng hai người chốt là?', 'Thứ Bảy', ['Thứ Sáu', 'Chủ nhật', 'Thứ Năm'], 'Anna từ chối thứ Sáu nhưng đề nghị **土曜日**; Marco: 土曜日にしましょう.', 2),
      M('③ Cuối cùng hai người cùng ăn hay không?', '○ Có (vào thứ Bảy)', ['× Không'], 'Bẫy: nghe thấy ちょっと nhưng sau đó đồng ý ngày khác.', 0),
      M('④ Park nhận lời hay từ chối?', '× Từ chối', ['○ Nhận lời'], 'Mở đầu いいですね nhưng sau đó **約束があります。すみません** → từ chối.', 1),
      M('④ Linh có bao nhiêu vé?', '2 vé', ['1 vé', '3 vé', '4 vé'], '**二枚** にまい.', 2),
      M('⑤ Hai người ăn ở đâu?', 'Quán gần ga', ['Quán trong trường', 'Ở nhà Wang', 'Quán xa ga'], '**駅の近くの店**.', 3),
      M('⑤ Ăn món gì?', 'Thịt nướng (yakiniku)', ['Ramen', 'Sushi', 'Okonomiyaki'], '焼き肉.', 0),
      M('⑥ Quán nào gần hơn?', 'Quán ramen', ['Quán okonomiyaki', 'Cả hai như nhau'], 'ラーメンの店の**ほうが近い**.', 0),
      M('⑥ Quán nào rẻ hơn?', 'Quán okonomiyaki', ['Quán ramen', 'Cả hai như nhau'], 'お好み焼きの店のほうが**安い**.', 1),
      M('⑥ Cuối cùng chọn quán nào?', 'Quán okonomiyaki', ['Quán ramen', 'Chưa chọn'], 'じゃ、お好み焼きの店にしましょう.', 0),
      M('⑦ Marco thấy nơi nào đẹp nhất?', 'Kyoto', ['Hokkaido', 'Tokyo', 'Osaka'], '京都がいちばんきれい.', 1),
      M('⑦ Nơi nào lạnh hơn?', 'Hokkaido', ['Kyoto', 'Như nhau'], '北海道は京都**より**寒い.', 2),
      M('⑧ Park thích mùa nào hơn?', 'Mùa đông', ['Mùa hè', 'Cả hai'], '冬のほうが好き.', 3),
      M('⑧ Wang thích mùa nào?', 'Cả hai', ['Mùa hè', 'Mùa đông'], '**どちらも**好き.', 0),
      M('⑨ Marco đã ăn trưa chưa?', 'Chưa', ['Rồi', 'Không muốn ăn'], 'いいえ、**まだです** = chưa.', 1),
      M('⑩ Anna có mấy vé?', '3 vé', ['2 vé', '1 vé', '4 vé'], '**三枚** さんまい.', 2),
      M('⑩ Trận bóng ở đâu, khi nào?', 'Yokohama, thứ Bảy tuần sau', ['Tokyo, thứ Bảy tuần này', 'Yokohama, Chủ nhật tuần sau', 'Osaka, thứ Bảy tuần sau'], '横浜で、来週の土曜日.', 0),
      M('⑪ Park buổi nào của thứ Bảy rảnh?', 'Buổi chiều', ['Buổi sáng', 'Cả ngày', 'Buổi tối'], '午前は約束がある、**午後はひま**.', 1),
      M('⑪ Phim bắt đầu lúc mấy giờ?', '3 giờ', ['2 giờ', '4 giờ', '5 giờ'], '**三時から**. Bẫy: 2 giờ là giờ hẹn gặp.', 2),
      M('⑪ Sau phim hai người làm gì?', 'Cùng ăn cơm', ['Về nhà', 'Đi mua đồ', 'Xem phim nữa'], '映画の後で、ご飯を食べませんか → いいですね.', 3),
    ],
  },
  {
    t: 'quiz',
    id: 'ck-ng-6-dien',
    title: 'Nghe điền chỗ trống Bài 6: nghe lại ②, ⑥, ⑩ rồi điền',
    kind: 'fill',
    items: [
      { q: 'パク：ワンさん、{日曜日|にちようび}、＿＿＿ドライブに{行|い}きませんか。', answers: V('{一緒|いっしょ}に'), hint: '' },
      { q: 'ワン：すみません、{日曜日|にちようび}は＿＿＿……。', answers: V('ちょっと'), hint: '' },
      { q: 'パク：ラーメンの{店|みせ}の＿＿＿が{近|ちか}いです。', answers: V('ほう'), hint: '' },
      { q: 'パク：お{好|この}み{焼|や}きの{店|みせ}のほうが＿＿＿です。', answers: V('{安|やす}い'), hint: '' },
      { q: 'アンナ：サッカーのチケットが＿＿＿あります。', answers: V('{三枚|さんまい}'), hint: '' },
      { q: 'アンナ：{横浜|よこはま}＿＿＿{試合|しあい}があります。', answers: V('で'), hint: '' },
    ],
  },
];

const NGHE_B7: Block[] = [
  { t: 'h', text: 'Bài 7 — Vị trí, nhờ vả, đang làm gì, ai làm, còn/hết (dạng やってみよう 1–3)' },
  LS('ck-ng-7-01', '① Gọi điện hỏi đang ở đâu', [
    F('リン', 'もしもし、パクさん。いま、どこにいますか。', 'Moshimoshi, Paku-san. Ima, doko ni imasu ka.', 'A lô, Park. Bây giờ bạn đang ở đâu?'),
    N('パク', '{駅|えき}の{前|まえ}にいます。', 'Eki no mae ni imasu.', 'Tôi đang ở trước ga.'),
    F('リン', '{駅|えき}の{前|まえ}？{改札|かいさつ}の{前|まえ}ですか。', 'Eki no mae? Kaisatsu no mae desu ka.', 'Trước ga? Trước cổng soát vé à?'),
    N('パク', 'いいえ、{交番|こうばん}の{前|まえ}です。', 'Iie, kouban no mae desu.', 'Không, trước đồn công an.'),
    F('リン', 'わかりました。すぐ{行|い}きます。', 'Wakarimashita. Sugu ikimasu.', 'Tôi hiểu rồi. Tôi đến ngay.'),
  ]),
  LS('ck-ng-7-02', '② Hỏi đường đến ngân hàng', [
    N('マルコ', 'すみません、{銀行|ぎんこう}はどこにありますか。', 'Sumimasen, ginkou wa doko ni arimasu ka.', 'Xin lỗi, ngân hàng ở đâu ạ?'),
    F('{女|おんな}の{人|ひと}', 'あのビルの{後|うし}ろにありますよ。', 'Ano biru no ushiro ni arimasu yo.', 'Ở phía sau toà nhà kia đấy.'),
    N('マルコ', 'ビルの{後|うし}ろですか。', 'Biru no ushiro desu ka.', 'Phía sau toà nhà ạ?'),
    F('{女|おんな}の{人|ひと}', 'ええ。コンビニの{隣|となり}です。', 'Ee. Konbini no tonari desu.', 'Vâng. Ngay bên cạnh cửa hàng tiện lợi.'),
  ]),
  LS('ck-ng-7-03', '③ Gần đây có gì', [
    N('ワン', 'この{近|ちか}くに{何|なに}がありますか。', 'Kono chikaku ni nani ga arimasu ka.', 'Gần đây có gì vậy?'),
    F('アンナ', '{駅|えき}の{前|まえ}に{本屋|ほんや}があります。{本屋|ほんや}とパン{屋|や}の{間|あいだ}に{郵便局|ゆうびんきょく}があります。', 'Eki no mae ni hon-ya ga arimasu. Hon-ya to pan-ya no aida ni yuubinkyoku ga arimasu.', 'Trước ga có hiệu sách. Giữa hiệu sách và tiệm bánh có bưu điện.'),
    N('ワン', 'ありがとうございます。', 'Arigatou gozaimasu.', 'Cảm ơn bạn.'),
  ]),
  LS('ck-ng-7-04', '④ Lấy nước ép ra', [
    F('アンナ', 'すみませんが、{冷蔵庫|れいぞうこ}からジュースを{出|だ}してください。', 'Sumimasen ga, reizouko kara juusu o dashite kudasai.', 'Xin lỗi, hãy lấy nước ép ra khỏi tủ lạnh giúp tôi.'),
    N('パク', 'はい。どのジュースですか。', 'Hai. Dono juusu desu ka.', 'Vâng. Nước ép nào ạ?'),
    F('アンナ', '{赤|あか}いジュースです。', 'Akai juusu desu.', 'Nước ép màu đỏ.'),
    N('パク', 'これですね。', 'Kore desu ne.', 'Cái này nhỉ.'),
  ]),
  LS('ck-ng-7-05', '⑤ Xếp đĩa lên bàn', [
    F('リン', 'ダニエルさん、お{皿|さら}をテーブルの{上|うえ}に{置|お}いてください。', 'Danieru-san, osara o teeburu no ue ni oite kudasai.', 'Daniel, hãy đặt đĩa lên bàn.'),
    N('ダニエル', 'はい。{何枚|なんまい}ですか。', 'Hai. Nanmai desu ka.', 'Vâng. Mấy cái ạ?'),
    F('リン', '{五枚|ごまい}です。', 'Gomai desu.', '5 cái.'),
    N('ダニエル', 'わかりました。', 'Wakarimashita.', 'Tôi hiểu rồi.'),
  ]),
  LS('ck-ng-7-06', '⑥ Đề nghị giúp thái rau', [
    N('ワン', '{手伝|てつだ}いましょうか。', 'Tetsudaimashou ka.', 'Để tôi giúp nhé?'),
    F('アンナ', 'ありがとうございます。じゃ、{野菜|やさい}を{切|き}ってください。', 'Arigatou gozaimasu. Ja, yasai o kitte kudasai.', 'Cảm ơn. Vậy hãy thái rau giúp tôi.'),
    N('ワン', 'ナイフはどこにありますか。', 'Naifu wa doko ni arimasu ka.', 'Dao ở đâu ạ?'),
    F('アンナ', 'テーブルの{上|うえ}にありますよ。', 'Teeburu no ue ni arimasu yo.', 'Ở trên bàn đấy.'),
    N('ワン', 'これですね。', 'Kore desu ne.', 'Cái này nhỉ.'),
  ]),
  LS('ck-ng-7-07', '⑦ Cái ô của Daniel', [
    N('ワン', 'ダニエルさんの{傘|かさ}はどれですか。', 'Danieru-san no kasa wa dore desu ka.', 'Ô của Daniel là cái nào?'),
    N('ダニエル', 'あの{青|あお}い{傘|かさ}です。', 'Ano aoi kasa desu.', 'Cái ô xanh kia.'),
    N('ワン', 'どの{傘|かさ}ですか。', 'Dono kasa desu ka.', 'Cái ô nào cơ?'),
    N('ダニエル', 'あのテーブルの{隣|となり}のです。', 'Ano teeburu no tonari no desu.', 'Cái ở bên cạnh cái bàn kia.'),
  ]),
  LS('ck-ng-7-08', '⑧ Mọi người đang làm gì', [
    F('リン', 'パクさんは{何|なに}をしていますか。', 'Paku-san wa nani o shite imasu ka.', 'Park đang làm gì vậy?'),
    F('アンナ', '{台所|だいどころ}でお{皿|さら}を{洗|あら}っています。', 'Daidokoro de osara o aratte imasu.', 'Đang rửa đĩa trong bếp.'),
    F('リン', 'ダニエルさんは？', 'Danieru-san wa?', 'Còn Daniel?'),
    F('アンナ', 'ギターを{弾|ひ}いています。', 'Gitaa o hiite imasu.', 'Đang chơi ghi-ta.'),
  ]),
  LS('ck-ng-7-09', '⑨ Ai làm bánh', [
    N('マルコ', 'だれがこのケーキを{作|つく}りましたか。', 'Dare ga kono keeki o tsukurimashita ka.', 'Ai đã làm chiếc bánh này vậy?'),
    N('ワン', 'アンナさんが{作|つく}りました。', 'Anna-san ga tsukurimashita.', 'Anna làm đấy.'),
    N('マルコ', 'おいしいですね。', 'Oishii desu ne.', 'Ngon nhỉ.'),
    N('ワン', 'ええ。まだありますよ。', 'Ee. Mada arimasu yo.', 'Ừ. Vẫn còn đấy.'),
  ]),
  LS('ck-ng-7-10', '⑩ Rượu còn không', [
    N('ダニエル', 'お{酒|さけ}はまだありますか。', 'Osake wa mada arimasu ka.', 'Rượu còn không?'),
    N('パク', 'いいえ、もうありません。', 'Iie, mou arimasen.', 'Không, hết rồi.'),
    N('ダニエル', 'じゃ、ジュースはどうですか。', 'Ja, juusu wa dou desu ka.', 'Vậy nước ép thì sao?'),
    N('パク', 'ジュースはまだありますよ。', 'Juusu wa mada arimasu yo.', 'Nước ép vẫn còn đấy.'),
  ]),
  LS('ck-ng-7-11', '⑪ Nhờ chỉ cách đọc chữ Hán', [
    N('パク', 'すみません、この{漢字|かんじ}の{読|よ}み{方|かた}を{教|おし}えてください。', 'Sumimasen, kono kanji no yomikata o oshiete kudasai.', 'Xin lỗi, hãy chỉ cho tôi cách đọc chữ Hán này.'),
    F('ワン', 'どの{漢字|かんじ}ですか。', 'Dono kanji desu ka.', 'Chữ Hán nào vậy?'),
    N('パク', 'これです。', 'Kore desu.', 'Chữ này.'),
    F('ワン', 'ああ、「かいしゃ」です。', 'Aa, "kaisha" desu.', 'À, đó là “kaisha”.'),
  ]),
  LS('ck-ng-7-12', '⑫ Ăn cơm bằng gì', [
    F('アンナ', 'ダニエルさんは、はしでご{飯|はん}を{食|た}べますか。', 'Danieru-san wa, hashi de gohan o tabemasu ka.', 'Daniel ăn cơm bằng đũa à?'),
    N('ダニエル', 'はい、{食|た}べます。でも、オーストラリアではナイフとフォークで{食|た}べます。', 'Hai, tabemasu. Demo, Oosutoraria dewa naifu to fooku de tabemasu.', 'Có. Nhưng ở Úc thì ăn bằng dao và nĩa.'),
  ]),
  LS('ck-ng-7-13', '⑬ Hội thoại dài (もう{一度|いちど}{聞|き}こう): Chuẩn bị tiệc', [
    F('アンナ', 'ダニエルさん、パーティーの{準備|じゅんび}をしましょう。', 'Danieru-san, paatii no junbi o shimashou.', 'Daniel, chuẩn bị cho bữa tiệc thôi.'),
    N('ダニエル', 'はい。{何|なに}をしましょうか。', 'Hai. Nani o shimashou ka.', 'Vâng. Mình làm gì đây?'),
    F('アンナ', 'じゃ、テーブルの{上|うえ}にお{皿|さら}とコップを{置|お}いてください。', 'Ja, teeburu no ue ni osara to koppu o oite kudasai.', 'Vậy hãy đặt đĩa và cốc lên bàn.'),
    N('ダニエル', 'お{皿|さら}は{何枚|なんまい}ですか。', 'Osara wa nanmai desu ka.', 'Đĩa mấy cái ạ?'),
    F('アンナ', '{六枚|ろくまい}です。コップも{六|むっ}つです。', 'Rokumai desu. Koppu mo muttsu desu.', '6 cái. Cốc cũng 6 cái.'),
    N('ダニエル', 'わかりました。ナイフとフォークはどこにありますか。', 'Wakarimashita. Naifu to fooku wa doko ni arimasu ka.', 'Tôi hiểu rồi. Dao và nĩa ở đâu?'),
    F('アンナ', '{冷蔵庫|れいぞうこ}の{隣|となり}の{箱|はこ}の{中|なか}にあります。', 'Reizouko no tonari no hako no naka ni arimasu.', 'Ở trong cái hộp cạnh tủ lạnh.'),
    F('アンナ', 'それから、{冷蔵庫|れいぞうこ}から{飲|の}み{物|もの}を{出|だ}してください。お{酒|さけ}もお{願|ねが}いします。', 'Sorekara, reizouko kara nomimono o dashite kudasai. Osake mo onegai shimasu.', 'Rồi, hãy lấy đồ uống ra khỏi tủ lạnh. Nhờ bạn lấy cả rượu nữa.'),
    N('ダニエル', 'お{酒|さけ}はもうありません。', 'Osake wa mou arimasen.', 'Rượu hết rồi.'),
    F('アンナ', 'えっ。じゃ、パクさんに{電話|でんわ}をかけてください。パクさんが{買|か}いに{行|い}きます。', 'E. Ja, Paku-san ni denwa o kakete kudasai. Paku-san ga kai ni ikimasu.', 'Ơ. Vậy hãy gọi điện cho Park. Park sẽ đi mua.'),
    N('ダニエル', 'わかりました。', 'Wakarimashita.', 'Tôi hiểu rồi.'),
  ]),
  {
    t: 'mcq',
    id: 'ck-ng-7-hoi',
    title: 'Câu hỏi nghe Bài 7 (26 câu)',
    items: [
      M('① Park đang ở đâu?', 'Trước đồn công an', ['Trước cổng soát vé', 'Trước ngân hàng', 'Trong ga'], 'Linh đoán 改札, Park sửa: **交番の前**. Bẫy: lấy thông tin cuối cùng.', 0),
      M('② Ngân hàng ở đâu?', 'Sau toà nhà, cạnh cửa hàng tiện lợi', ['Trước toà nhà', 'Giữa hiệu sách và tiệm bánh', 'Trước ga'], 'ビルの**後ろ**、コンビニの**隣**.', 1),
      M('③ Bưu điện ở đâu?', 'Giữa hiệu sách và tiệm bánh', ['Trước ga', 'Cạnh hiệu sách', 'Sau tiệm bánh'], '本屋とパン屋の**間**に郵便局.', 2),
      M('③ Trước ga có gì?', 'Hiệu sách', ['Tiệm bánh', 'Bưu điện', 'Ngân hàng'], '駅の前に**本屋**.', 3),
      M('④ Anna nhờ Park lấy gì từ đâu?', 'Nước ép từ tủ lạnh', ['Nước ép từ bàn', 'Rượu từ tủ lạnh', 'Đĩa từ tủ lạnh'], '冷蔵庫**から**ジュースを出して.', 0),
      M('④ Nước ép màu gì?', 'Màu đỏ', ['Màu xanh', 'Màu vàng', 'Màu trắng'], '赤いジュース.', 1),
      M('⑤ Đĩa đặt ở đâu?', 'Trên bàn', ['Trong tủ lạnh', 'Dưới bàn', 'Cạnh bàn'], 'テーブルの**上**に置いて.', 2),
      M('⑤ Có bao nhiêu cái đĩa?', '5 cái', ['4 cái', '6 cái', '3 cái'], '**五枚** ごまい.', 0),
      M('⑥ Anna nhờ Wang làm gì?', 'Thái rau', ['Rửa đĩa', 'Nấu cơm', 'Lấy dao'], '野菜を**切って**ください.', 1),
      M('⑥ Con dao ở đâu?', 'Trên bàn', ['Trong tủ lạnh', 'Trong bếp', 'Trong hộp'], 'テーブルの上にあります.', 2),
      M('⑦ Ô của Daniel màu gì?', 'Màu xanh', ['Màu đỏ', 'Màu đen', 'Màu trắng'], '**青い**傘.', 3),
      M('⑦ Ô ở vị trí nào?', 'Bên cạnh cái bàn kia', ['Trên bàn', 'Dưới bàn', 'Trước ga'], 'テーブルの**隣**.', 0),
      M('⑧ Park đang làm gì?', 'Rửa đĩa', ['Chơi ghi-ta', 'Nấu ăn', 'Gọi điện'], '台所でお皿を**洗っています**.', 1),
      M('⑧ Daniel đang làm gì?', 'Chơi ghi-ta', ['Rửa đĩa', 'Ăn bánh', 'Đọc sách'], 'ギターを**弾いています**.', 0),
      M('⑨ Ai làm bánh?', 'Anna', ['Wang', 'Marco', 'Park'], 'アンナさん**が**作りました.', 2),
      M('⑨ Bánh còn không?', 'Còn', ['Hết', 'Không rõ'], '**まだありますよ**.', 0),
      M('⑩ Rượu còn không?', 'Hết rồi', ['Còn', 'Còn một ít'], '**もうありません**.', 1),
      M('⑩ Nước ép còn không?', 'Còn', ['Hết', 'Không có'], 'ジュースは**まだあります**.', 2),
      M('⑪ Park nhờ Wang điều gì?', 'Chỉ cách đọc một chữ Hán', ['Chỉ cách viết chữ Hán', 'Mượn sách', 'Chỉ đường'], '漢字の**読み方**を教えて.', 0),
      M('⑫ Daniel ăn cơm bằng gì ở Nhật?', 'Đũa', ['Dao và nĩa', 'Thìa', 'Tay'], 'はしで食べます. (Ở Úc mới là ナイフとフォーク.)', 1),
      M('⑬ Daniel phải đặt gì lên bàn?', 'Đĩa và cốc', ['Dao và nĩa', 'Rượu', 'Nước ép'], 'お皿とコップ.', 2),
      M('⑬ Có bao nhiêu cái đĩa?', '6 cái', ['5 cái', '4 cái', '3 cái'], '**六枚** ろくまい.', 3),
      M('⑬ Dao và nĩa ở đâu?', 'Trong hộp cạnh tủ lạnh', ['Trên bàn', 'Trong tủ lạnh', 'Trong bếp'], '冷蔵庫の隣の箱の**中**.', 0),
      M('⑬ Vì sao phải gọi điện cho Park?', 'Hết rượu nên nhờ Park đi mua', ['Park chưa đến', 'Park làm bánh', 'Park quên đồ'], 'お酒はもうありません → パクさんが買いに行きます.', 1),
      M('⑬ Daniel gọi điện cho ai?', 'Park', ['Anna', 'Wang', 'Linh'], 'パクさん**に**電話をかけて.', 2),
    ],
  },
  {
    t: 'quiz',
    id: 'ck-ng-7-dien',
    title: 'Nghe điền chỗ trống Bài 7: nghe lại ①, ⑥, ⑩ rồi điền',
    kind: 'fill',
    items: [
      { q: 'パク：{駅|えき}の＿＿＿にいます。', answers: V('{前|まえ}'), hint: '' },
      { q: 'パク：いいえ、＿＿＿の{前|まえ}です。', answers: V('{交番|こうばん}'), hint: '' },
      { q: 'ワン：＿＿＿ましょうか。', answers: V('{手伝|てつだ}い'), hint: '' },
      { q: 'アンナ：{野菜|やさい}を{切|き}って＿＿＿。', answers: V('ください'), hint: '' },
      { q: 'ダニエル：お{酒|さけ}は＿＿＿ありますか。', answers: V('まだ'), hint: '' },
      { q: 'パク：いいえ、＿＿＿ありません。', answers: V('もう'), hint: '' },
    ],
  },
];

const NGHE: Lesson = {
  id: 'cuoi-ky-nghe',
  kind: 'listening',
  title: 'Luyện nghe Bài 4–7 — 43 đoạn kịch bản MỚI theo dạng Slot 30 (nghe điền, nghe chọn ○×, hội thoại dài)',
  goal: 'Luyện đúng các dạng nghe của đề cuối kỳ: nghe lấy số/giờ/vị trí, nghe ○ ×, nghe điền chỗ trống, hội thoại dài; mỗi đoạn có đáp án và chỗ bẫy cần chú ý.',
  minutes: 90,
  blocks: [
    {
      t: 'recap',
      title: 'Luyện nghe thế nào cho hiệu quả',
      items: [
        '**Slot 30 “Ôn nghe Bài 4–7”** của cô theo dạng **やってみよう** (nghe hội thoại ngắn, điền chỗ trống, nghe lấy thông tin) và **もう一度聞こう** (hội thoại dài). Bài này có **43 đoạn kịch bản mới** theo đúng dạng đó: Bài 4 (10 đoạn) · Bài 5 (9) · Bài 6 (11) · Bài 7 (13).',
        'Cách làm: **nghe lần 1** chỉ ghi lại số, giờ, địa điểm, tên; **nghe lần 2** trả lời câu hỏi; chỉ **mở lời thoại** ra khi đã làm xong để đối chiếu.',
        'Bẫy thường gặp: **người nói đổi ý** (lấy thông tin CUỐI); **số và giờ** (九時間 = くじかん, 四十分 = よんじゅっぷん, 六枚, 三枚); **ちょっと……** = từ chối; **まだです** = chưa; **もうありません** = hết.',
        'Giọng đọc là giọng máy tổng hợp tiếng Nhật; các đoạn do giọng nữ / nam xen kẽ để quen cả hai.',
      ],
    },
    {
      t: 'table',
      caption: 'Hay nghe sai: số, giờ, lượng (nghe nhiều lần cho quen)',
      head: ['Cần nghe ra', 'Chú ý'],
      rows: [
        ['～{時間|じかん} (tiếng): 4 = **よ**じかん · 9 = **く**じかん · 7 = しち／なな', '4 và 9 đọc khác thường'],
        ['～{分|ふん／ぷん}: 1 いっぷん · 3 さんぷん · 4 よんぷん · 6 ろっぷん · 8 はっぷん · 10 じゅっぷん · 40 よんじゅっぷん', 'ふん／ぷん đổi theo số'],
        ['～{枚|まい}: いち・に・さん・よん・ご・ろく・なな・はち・きゅう・じゅう', 'よんまい (không phải しまい)'],
        ['～{時|じ} (giờ): 4時 = **よ**じ · 7時 = **しち**じ · 9時 = **く**じ', 'Phân biệt với ～時間'],
        ['Từ hỏi: どのくらい · いつ · だれ · どこ · {何|なに}を · {何時|なんじ}', 'Gạch từ hỏi trước khi nghe'],
      ],
    },
    ...NGHE_B4,
    ...NGHE_B5,
    ...NGHE_B6,
    ...NGHE_B7,
  ],
};

/* ═══════════════════ 6. THI NÓI ═══════════════════ */

/** Một cặp hỏi–đáp của thi nói (giám thị ↔ bạn). */
const QA = (q: string, qro: string, qvi: string, a: string, aro: string, avi: string): { who: string; role: 'examiner' | 'candidate'; text: string; ro: string; vi: string }[] => [
  { who: 'Giám thị', role: 'examiner', text: q, ro: qro, vi: qvi },
  { who: 'Bạn', role: 'candidate', text: a, ro: aro, vi: avi },
];

const THI_NOI: Lesson = {
  id: 'cuoi-ky-noi',
  kind: 'speaking',
  title: 'Thi nói JPD123 — hướng dẫn thi, Speaking Demo của cô, mẫu trả lời đủ dạng, mô tả tranh, đọc to, mẹo khi quên từ',
  goal: 'Nắm quy trình thi nói (Reading 45 + Q&A 45 + tác phong 10), có sẵn mẫu trả lời cho MỌI dạng câu hỏi Bài 4–7 trong hướng dẫn của cô, biết mô tả tranh, đọc to đúng và xử lý khi nghe không rõ hoặc quên từ.',
  minutes: 90,
  blocks: [
    {
      t: 'recap',
      title: 'Tóm tắt thi nói JPD123',
      items: [
        '**Reading 45 điểm**: bốc đề (A-1, A-2…), **chuẩn bị 20 giây**, đọc to đoạn khoảng 150 chữ (ngoài hiragana có 5–7 chữ Hán và 2–4 chữ katakana).',
        '**Q&A 45 điểm**: **3 câu** — 1 câu **có tranh**, 2 câu **không tranh**. Mỗi câu hỏi tối đa **3 lần**, mỗi lần bạn nghĩ không quá **10 giây**.',
        '**Tác phong 10 điểm**: chào hỏi, độ trôi chảy, phát âm. Mang theo **giấy tờ có ảnh**; không được đổi đề.',
        'Công thức trả lời an toàn: **câu hỏi → trả lời TRỌN CÂU (có trợ từ, です/ます) → thêm 1 câu phụ** (lý do, cảm nhận). Đừng trả lời cụt kiểu “ハノイです”.',
      ],
    },

    { t: 'h', text: '1. Ngày thi từng bước — và câu nói tương ứng' },
    {
      t: 'table',
      head: ['Bước', 'Bạn làm', 'Câu nói (romaji · nghĩa)'],
      rows: [
        ['1', 'Gõ cửa, vào phòng, **chào**, đưa giấy tờ', '「しつれいします。」 *shitsurei shimasu* — Xin phép (cho tôi vào).'],
        ['2', 'Giám thị kiểm giấy tờ; bạn bốc thăm đề Reading', '「おねがいします。」 *onegai shimasu* — Xin nhờ thầy/cô.'],
        ['3', '20 giây chuẩn bị: đọc thầm đoạn, đánh dấu chữ Hán/katakana khó', '(Không nói gì — đọc thầm một lượt.)'],
        ['4', 'Đọc to đoạn văn', '(Đọc chậm, rõ, không dừng lâu; sai thì đọc lại từ đó.)'],
        ['5', 'Trả lời 3 câu hỏi (1 có tranh, 2 không tranh)', 'Xem mục 3–5.'],
        ['6', 'Hết bài: **cảm ơn và chào** trước khi ra', '「ありがとうございました。」 *arigatou gozaimashita* · 「しつれいします。」 *shitsurei shimasu*'],
      ],
    },
    { t: 'h', text: '2. Câu cứu nguy: nghe không rõ, không hiểu, đang nghĩ' },
    {
      t: 'table',
      head: ['Tình huống', 'Câu nói', 'Romaji', 'Nghĩa'],
      rows: [
        ['Nghe chưa rõ → xin nhắc lại (được tối đa 3 lần)', '「もういちど おねがいします。」', 'Mou ichido onegai shimasu.', 'Xin hỏi lại một lần nữa.'],
        ['Nghe nhanh quá', '「ゆっくり おねがいします。」', 'Yukkuri onegai shimasu.', 'Xin nói chậm lại.'],
        ['Không hiểu từ trong câu hỏi', '「すみません、わかりません。」', 'Sumimasen, wakarimasen.', 'Xin lỗi, tôi không hiểu.'],
        ['Đang nghĩ câu trả lời', '「えーと……」「そうですね……」', 'Eeto… / Sou desu ne…', 'Ừm… / Để xem nào…'],
        ['Xác nhận lại câu hỏi', '「～ですか。」', '～ desu ka.', 'Có phải câu hỏi là ～ không ạ?'],
      ],
    },
    {
      t: 'note',
      title: 'Mẹo khi QUÊN TỪ (đừng im lặng)',
      items: [
        '**Đổi sang từ khác bạn nhớ**: quên 大学 → nói 「がっこう」. Quên 温泉 → 「おふろ」 cũng được hiểu.',
        '**Nói bằng katakana (từ mượn)**: コーヒー, ジュース, パソコン, スポーツ, デパート — rất nhiều từ giám thị cho điểm.',
        '**Kéo dài câu bằng từ bạn chắc chắn**: 「とても きれいです。そして、にぎやかです。」 hoặc thêm lý do 「～から。」',
        '**Lặp lại khung câu hỏi** để lấy thời gian: Hỏi 「どんなところですか」 → 「ダナンは きれいな ところです。」 rồi mới nghĩ tiếp.',
        'Câu đúng nhưng **dùng sai một từ vựng** chỉ bị trừ một phần (theo hướng dẫn JPD113 — xem bài 1); **im lặng mất cả câu**.',
        'Không nhớ số/giờ → nói số đơn giản bạn chắc chắn và **くらい**: 「にじかん くらいです。」',
      ],
    },

    { t: 'h', text: '3. Speaking Demo của cô (Đề A-0 · B-0) — phân tích và mẫu trả lời' },
    {
      t: 'p',
      text: 'Cô phát một đề demo: **Part 1 Reading** — đọc đoạn văn kể về chuyến đi Việt Nam vào tháng 8 (đã đi Hà Nội, gặp bạn, đi một nhà thờ nổi tiếng rất đẹp, ăn nhiều món ngon, không đi TP.HCM vì không có thời gian, muốn đi lần nữa). **Part 2 Q&A (B-0)** có 3 câu như dưới. Điểm cần luyện trong đoạn Reading: **quá khứ ～ました／ませんでした**, **～に{会|あ}いました** (に), **それから**, **～たいです**, **～から** (lý do).',
    },
    {
      t: 'dialogue',
      title: 'Q&A B-0 của cô — mẫu trả lời',
      lines: [
        ...QA('ハノイからホーチミンまでどのくらいですか。', 'Hanoi kara Hoochimin made dono kurai desu ka.', 'Từ Hà Nội đến TP.HCM mất bao lâu?', '{飛行機|ひこうき}で{二時間|にじかん}くらいです。', 'Hikouki de nijikan kurai desu.', 'Đi máy bay khoảng 2 tiếng.'),
        ...QA('{今|いま}、{何|なに}がほしいですか。', 'Ima, nani ga hoshii desu ka.', 'Bây giờ bạn muốn có gì?', '{新|あたら}しいパソコンがほしいです。', 'Atarashii pasokon ga hoshii desu.', 'Tôi muốn có một cái máy tính mới.'),
        ...QA('{春|はる}と{夏|なつ}とどちらが{好|す}きですか。', 'Haru to natsu to dochira ga suki desu ka.', 'Mùa xuân và mùa hè bạn thích mùa nào hơn?', '{春|はる}のほうが{好|す}きです。{春|はる}は{暖|あたた}かいですから。', 'Haru no hou ga suki desu. Haru wa atatakai desu kara.', 'Tôi thích mùa xuân hơn. Vì mùa xuân ấm áp.'),
      ],
    },
    {
      t: 'note',
      title: 'Cách mở rộng câu trả lời (thêm 1 câu phụ)',
      items: [
        'Hỏi 「どのくらい」 → thêm phương tiện khác: 「でんしゃで {三十時間|さんじゅうじかん}くらいです。」 (Hà Nội – TP.HCM bằng tàu hoả).',
        'Hỏi 「何がほしい」 → thêm **lý do**: 「いまの パソコンは ふるいですから。」',
        'Hỏi 「どちらが好き」 → thêm lý do: 「～は あついですから。」',
      ],
    },

    { t: 'h', text: '4. Câu hỏi KHÔNG tranh — mẫu trả lời đủ mọi dạng trong hướng dẫn của cô' },
    { t: 'p', text: 'Hướng dẫn của cô liệt kê **dạng câu hỏi** cho từng bài. Dưới đây là **mẫu trả lời cho từng dạng** (thay nội dung bằng thông tin thật của bạn nhưng **giữ khung câu**). Học thuộc khung rồi hoán đổi từ.' },
    { t: 'h', text: 'Bài 4 (9 dạng)' },
    {
      t: 'dialogue',
      title: 'Bài 4 — mẫu hỏi đáp',
      lines: [
        ...QA('ハノイからホーチミンまでどのくらいですか。', 'Hanoi kara Hoochimin made dono kurai desu ka.', '（～から～までどのくらい）', '{飛行機|ひこうき}で{二時間|にじかん}くらいです。', 'Hikouki de nijikan kurai desu.', 'Đi máy bay khoảng 2 tiếng.'),
        ...QA('うちから{大学|だいがく}までバスでどのくらいですか。', 'Uchi kara daigaku made basu de dono kurai desu ka.', 'Từ nhà đến trường đi xe buýt mất bao lâu?', 'バスで{三十分|さんじゅっぷん}くらいです。', 'Basu de sanjuppun kurai desu.', 'Đi xe buýt khoảng 30 phút.'),
        ...QA('ベトナムはどんな{国|くに}ですか。', 'Betonamu wa donna kuni desu ka.', '（～はどんな国／町／大学／人）', '{暑|あつ}い{国|くに}です。そして、{人|ひと}が{多|おお}いです。', 'Atsui kuni desu. Soshite, hito ga ooi desu.', 'Là nước nóng. Và đông người.'),
        ...QA('ダナンはどんな{町|まち}ですか。', 'Danan wa donna machi desu ka.', 'Đà Nẵng là thành phố như thế nào?', 'きれいな{町|まち}です。{海|うみ}があります。', 'Kirei na machi desu. Umi ga arimasu.', 'Là thành phố đẹp. Có biển.'),
        ...QA('{私|わたし}たちの{大学|だいがく}はどんな{大学|だいがく}ですか。', 'Watashitachi no daigaku wa donna daigaku desu ka.', 'Trường đại học của chúng ta là trường như thế nào?', '{新|あたら}しい{大学|だいがく}です。そして、{大|おお}きいです。', 'Atarashii daigaku desu. Soshite, ookii desu.', 'Là trường mới. Và lớn.'),
        ...QA('{山田|やまだ}さんの{町|まち}はどんなところですか。', 'Yamada-san no machi wa donna tokoro desu ka.', '（～さんのまちはどんなところ）', '{静|しず}かなところです。{山|やま}と{川|かわ}があります。', 'Shizuka na tokoro desu. Yama to kawa ga arimasu.', 'Là nơi yên tĩnh. Có núi và sông.'),
        ...QA('{日本|にほん}の{食|た}べ{物|もの}はどうですか。', 'Nihon no tabemono wa dou desu ka.', '（～はどうですか — hỏi cảm nhận）', 'とてもおいしいです。でも、{少|すこ}し{高|たか}いです。', 'Totemo oishii desu. Demo, sukoshi takai desu.', 'Rất ngon. Nhưng hơi đắt.'),
        ...QA('あなたの{町|まち}はにぎやかですか。', 'Anata no machi wa nigiyaka desu ka.', '（～のまちはにぎやかですか）', 'はい、にぎやかです。／いいえ、にぎやかじゃありません。{静|しず}かです。', 'Hai, nigiyaka desu. / Iie, nigiyaka ja arimasen. Shizuka desu.', 'Vâng, nhộn nhịp. / Không, không nhộn nhịp. Yên tĩnh.'),
        ...QA('あなたの{町|まち}は{大|おお}きいですか。', 'Anata no machi wa ookii desu ka.', '（～のまちは大きいですか）', 'いいえ、{大|おお}きくないです。{小|ちい}さい{町|まち}です。', 'Iie, ookikunai desu. Chiisai machi desu.', 'Không, không lớn. Là thị trấn nhỏ.'),
        ...QA('あなたの{町|まち}に{寺|てら}がありますか。', 'Anata no machi ni tera ga arimasu ka.', '（～のまちにきょうかい／おてら／やまがありますか）', 'はい、あります。{古|ふる}いお{寺|てら}があります。／いいえ、{山|やま}はありません。', 'Hai, arimasu. Furui otera ga arimasu. / Iie, yama wa arimasen.', 'Có. Có ngôi chùa cổ. / Không, không có núi.'),
        ...QA('ハノイは{十二月|じゅうにがつ}、どうですか。', 'Hanoi wa juunigatsu, dou desu ka.', '（～は～月／はる、どうですか／あついですか）', '{寒|さむ}いです。', 'Samui desu.', 'Lạnh.'),
        ...QA('ベトナムは{八月|はちがつ}、{暑|あつ}いですか。', 'Betonamu wa hachigatsu, atsui desu ka.', 'Tháng 8 Việt Nam nóng không?', 'はい、とても{暑|あつ}いです。', 'Hai, totemo atsui desu.', 'Vâng, rất nóng.'),
      ],
    },
    { t: 'h', text: 'Bài 5 (8 dạng)' },
    {
      t: 'dialogue',
      title: 'Bài 5 — mẫu hỏi đáp',
      lines: [
        ...QA('{昨日|きのう}、{何|なに}をしましたか。', 'Kinou, nani o shimashita ka.', '（きのう／せんしゅう、何をしましたか）', 'うちで{日本語|にほんご}を{勉強|べんきょう}しました。それから、ゲームをしました。', 'Uchi de nihongo o benkyou shimashita. Sorekara, geemu o shimashita.', 'Tôi học tiếng Nhật ở nhà. Sau đó chơi game.'),
        ...QA('{昨日|きのう}、どこかへ{行|い}きましたか。', 'Kinou, dokoka e ikimashita ka.', '（きのうどこかへ行きましたか）', 'はい、デパートへ{行|い}きました。／いいえ、どこへも{行|い}きませんでした。', 'Hai, depaato e ikimashita. / Iie, doko e mo ikimasen deshita.', 'Có, tôi đã đến trung tâm thương mại. / Không, tôi không đi đâu cả.'),
        ...QA('{先週|せんしゅう}、だれと{映画|えいが}を{見|み}ましたか。', 'Senshuu, dare to eiga o mimashita ka.', '（せんしゅう、だれと～Vましたか）', '{友達|ともだち}と{見|み}ました。／{一人|ひとり}で{見|み}ました。', 'Tomodachi to mimashita. / Hitori de mimashita.', 'Tôi xem cùng bạn. / Tôi xem một mình.'),
        ...QA('どうして{昨日|きのう}{学校|がっこう}へ{行|い}きませんでしたか。', 'Doushite kinou gakkou e ikimasen deshita ka.', '（どうして学校へ行きませんでしたか）', '{日曜日|にちようび}でしたから、{行|い}きませんでした。', 'Nichiyoubi deshita kara, ikimasen deshita.', 'Vì hôm đó là Chủ nhật nên tôi không đi.'),
        ...QA('{今|いま}、{何|なに}がいちばんほしいですか。', 'Ima, nani ga ichiban hoshii desu ka.', '（何がいちばんほしいですか）', '{新|あたら}しいパソコンがいちばんほしいです。', 'Atarashii pasokon ga ichiban hoshii desu.', 'Tôi muốn có máy tính mới nhất.'),
        ...QA('{今|いま}、{何|なに}がいちばん{好|す}きですか。', 'Ima, nani ga ichiban suki desu ka.', '（何がいちばんすきですか）', 'ゲームがいちばん{好|す}きです。', 'Geemu ga ichiban suki desu.', 'Tôi thích chơi game nhất.'),
        ...QA('お{金|かね}がたくさんあります。{何|なに}をしたいですか。', 'Okane ga takusan arimasu. Nani o shitai desu ka.', '（お金がたくさんあります。何をしたいですか）', '{日本|にほん}へ{行|い}きたいです。そして、{温泉|おんせん}に{入|はい}りたいです。', 'Nihon e ikitai desu. Soshite, onsen ni hairitai desu.', 'Tôi muốn đi Nhật. Và muốn tắm suối nước nóng.'),
        ...QA('{明日|あした}、{何|なに}をしに{行|い}きますか。', 'Ashita, nani o shi ni ikimasu ka.', '（あした何をしに行きますか）', 'デパートへ{買|か}い{物|もの}に{行|い}きます。', 'Depaato e kaimono ni ikimasu.', 'Tôi đi trung tâm thương mại để mua sắm.'),
      ],
    },
    { t: 'h', text: 'Bài 6 (8 dạng)' },
    {
      t: 'dialogue',
      title: 'Bài 6 — mẫu hỏi đáp',
      lines: [
        ...QA('{今晩|こんばん}、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。', 'Konban, issho ni gohan o tabemasen ka.', '（こんばん、いっしょに～Vませんか）', 'いいですね。{食|た}べましょう。／すみません、{今晩|こんばん}はちょっと……。{用事|ようじ}がありますから。', 'Ii desu ne. Tabemashou. / Sumimasen, konban wa chotto. Youji ga arimasu kara.', 'Hay quá. Ăn thôi. / Xin lỗi, tối nay thì hơi… vì tôi có việc.'),
        ...QA('{横浜|よこはま}で{何|なに}がありますか。', 'Yokohama de nani ga arimasu ka.', '（～で何がありますか — sự kiện）', '{野球|やきゅう}の{試合|しあい}があります。', 'Yakyuu no shiai ga arimasu.', 'Có trận bóng chày.'),
        ...QA('ベトナム{料理|りょうり}で{何|なに}がいちばんおいしいですか。', 'Betonamu ryouri de nani ga ichiban oishii desu ka.', '（～で何がいちばんAですか）', 'フォーがいちばんおいしいです。', 'Foo ga ichiban oishii desu.', 'Phở là ngon nhất.'),
        ...QA('かぞくでだれがいちばんいそがしいですか。', 'Kazoku de dare ga ichiban isogashii desu ka.', '（～でだれがいちばんAですか）', 'ちちがいちばんいそがしいです。', 'Chichi ga ichiban isogashii desu.', 'Bố tôi bận nhất.'),
        ...QA('ベトナムでどこがいちばんきれいですか。', 'Betonamu de doko ga ichiban kirei desu ka.', '（～でどこがいちばんAですか）', 'ダナンがいちばんきれいです。', 'Danan ga ichiban kirei desu.', 'Đà Nẵng đẹp nhất.'),
        ...QA('ハノイで{何月|なんがつ}がいちばん{寒|さむ}いですか。', 'Hanoi de nangatsu ga ichiban samui desu ka.', '（～で何月がいちばんAですか）', '{一月|いちがつ}がいちばん{寒|さむ}いです。', 'Ichigatsu ga ichiban samui desu.', 'Tháng 1 lạnh nhất.'),
        ...QA('{犬|いぬ}とねことどちらが{好|す}きですか。', 'Inu to neko to dochira ga suki desu ka.', '（～と～とどちらがAですか）', '{犬|いぬ}のほうが{好|す}きです。／どちらも{好|す}きです。', 'Inu no hou ga suki desu. / Dochira mo suki desu.', 'Tôi thích chó hơn. / Tôi thích cả hai.'),
        ...QA('もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。', 'Mou hirugohan o tabemashita ka.', '（もう～Vましたか）', 'はい、もう{食|た}べました。／いいえ、まだです。', 'Hai, mou tabemashita. / Iie, mada desu.', 'Rồi, tôi ăn rồi. / Chưa ạ.'),
      ],
    },
    { t: 'h', text: 'Bài 7 (9 dạng)' },
    {
      t: 'dialogue',
      title: 'Bài 7 — mẫu hỏi đáp',
      lines: [
        ...QA('あなたのうちはどこにありますか。', 'Anata no uchi wa doko ni arimasu ka.', '（～さんのうち／FPT大学はどこにありますか）', '{私|わたし}のうちは{駅|えき}の{近|ちか}くにあります。', 'Watashi no uchi wa eki no chikaku ni arimasu.', 'Nhà tôi ở gần ga.'),
        ...QA('FPT{大学|だいがく}はどこにありますか。', 'Efu-pii-tii daigaku wa doko ni arimasu ka.', 'Đại học FPT ở đâu?', 'FPT{大学|だいがく}はハノイの{西|にし}にあります。', 'Efu-pii-tii daigaku wa Hanoi no nishi ni arimasu.', 'Đại học FPT ở phía tây Hà Nội.'),
        ...QA('ねこはどこにいますか。', 'Neko wa doko ni imasu ka.', '（～さん／ねこ／いぬはどこにいますか）', 'テーブルの{下|した}にいます。', 'Teeburu no shita ni imasu.', 'Nó ở dưới bàn.'),
        ...QA('{駅|えき}の{近|ちか}くに{何|なに}がありますか。', 'Eki no chikaku ni nani ga arimasu ka.', '（～の近くに何がありますか）', '{本屋|ほんや}とコンビニがあります。', 'Hon-ya to konbini ga arimasu.', 'Có hiệu sách và cửa hàng tiện lợi.'),
        ...QA('あなたのうちの{近|ちか}くに{何|なに}がありますか。', 'Anata no uchi no chikaku ni nani ga arimasu ka.', '（～さんのうちの近くに何がありますか）', '{公園|こうえん}とスーパーがあります。', 'Kouen to suupaa ga arimasu.', 'Có công viên và siêu thị.'),
        ...QA('{何|なん}でりんごを{切|き}りますか。', 'Nan de ringo o kirimasu ka.', '（何でパン／やさい／りんごをきりますか）', 'ナイフで{切|き}ります。', 'Naifu de kirimasu.', 'Cắt bằng dao.'),
        ...QA('ベトナム{人|じん}はフォークとナイフでご{飯|はん}を{食|た}べますか。', 'Betonamu jin wa fooku to naifu de gohan o tabemasu ka.', '（ベトナム人はフォークとナイフで…）', 'いいえ、{食|た}べません。はしやスプーンで{食|た}べます。', 'Iie, tabemasen. Hashi ya supuun de tabemasu.', 'Không. Họ ăn bằng đũa hoặc thìa.'),
        ...QA('{日本人|にほんじん}は{何|なん}でご{飯|はん}を{食|た}べますか。', 'Nihonjin wa nan de gohan o tabemasu ka.', '（日本人／ベトナム人／アメリカ人は何でご飯を食べますか）', 'はしで{食|た}べます。アメリカ{人|じん}はナイフとフォークで{食|た}べます。', 'Hashi de tabemasu. Amerika jin wa naifu to fooku de tabemasu.', 'Ăn bằng đũa. Người Mỹ ăn bằng dao và nĩa.'),
        ...QA('{今|いま}、{何|なに}をしていますか。', 'Ima, nani o shite imasu ka.', '（～さんは何をしていますか）', '{日本語|にほんご}を{勉強|べんきょう}しています。', 'Nihongo o benkyou shite imasu.', 'Tôi đang học tiếng Nhật.'),
        ...QA('だれがギターを{弾|ひ}いていますか。', 'Dare ga gitaa o hiite imasu ka.', '（だれが～Vていますか）', 'ダニエルさんが{弾|ひ}いています。', 'Danieru-san ga hiite imasu.', 'Anh Daniel đang chơi.'),
      ],
    },
    {
      t: 'note',
      title: 'Bẫy chấm điểm khi trả lời không tranh',
      items: [
        'Câu hỏi **はい／いいえ** (にぎやかですか, ありますか, 食べますか): **luôn nói はい／いいえ trước** — quên là bị trừ.',
        'Câu hỏi có **どうして**: kết thúc bằng **～から** (日曜日でしたから). Câu hỏi **どちら**: dùng **のほうが**. Câu hỏi **いちばん**: dùng **N がいちばん A**.',
        'Câu hỏi **もう～ましたか** → chưa làm = **いいえ、まだです** (không nói いいえ、～ません).',
        'Đừng nuốt trợ từ: **に・で・を・が・と・の** — sai trợ từ bị trừ điểm riêng.',
      ],
    },

    { t: 'h', text: '5. Câu hỏi CÓ tranh — cách mô tả và 6 tranh luyện (tranh viết thành bảng)' },
    {
      t: 'note',
      title: 'Khung xử lý câu hỏi có tranh',
      items: [
        '**Nhìn tranh 3 giây**: ai, ở đâu, đang làm gì, có số/giờ/giá không.',
        'Nghe giám thị hỏi gì → chỉ trả lời **đúng điều được hỏi**, bằng từ có trong tranh.',
        'Các kiểu hỏi hay gặp: **これは何ですか · ここはどこですか · だれが～していますか · ～は何をしていますか · いくらですか · 何時からですか · どちらが～ですか · ～はどこにありますか／いますか**.',
      ],
    },
    { t: 'h', text: 'Tranh T1 — Bản đồ phố' },
    {
      t: 'table',
      head: ['Trong tranh có', 'Vị trí'],
      rows: [
        ['Đồn công an (こうばん)', 'Ở **trước** nhà ga'],
        ['Siêu thị (スーパー)', 'Ở **sau** nhà ga'],
        ['Cửa hàng tiện lợi (コンビニ)', 'Ở **giữa** hiệu sách và tiệm bánh'],
        ['Công viên (こうえん)', 'Có một cái cây (き) **trong** công viên; con mèo (ねこ) **ở dưới** cái cây'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Q&A tranh T1',
      lines: [
        ...QA('{交番|こうばん}はどこにありますか。', 'Kouban wa doko ni arimasu ka.', 'Đồn công an ở đâu?', '{駅|えき}の{前|まえ}にあります。', 'Eki no mae ni arimasu.', 'Ở trước nhà ga.'),
        ...QA('スーパーはどこにありますか。', 'Suupaa wa doko ni arimasu ka.', 'Siêu thị ở đâu?', '{駅|えき}の{後|うし}ろにあります。', 'Eki no ushiro ni arimasu.', 'Ở sau nhà ga.'),
        ...QA('コンビニはどこにありますか。', 'Konbini wa doko ni arimasu ka.', 'Cửa hàng tiện lợi ở đâu?', '{本屋|ほんや}とパン{屋|や}の{間|あいだ}にあります。', 'Hon-ya to pan-ya no aida ni arimasu.', 'Nằm giữa hiệu sách và tiệm bánh.'),
        ...QA('ねこはどこにいますか。', 'Neko wa doko ni imasu ka.', 'Con mèo ở đâu?', '{木|き}の{下|した}にいます。', 'Ki no shita ni imasu.', 'Nó ở dưới cái cây.'),
      ],
    },
    { t: 'h', text: 'Tranh T2 — Bữa tiệc ở nhà' },
    {
      t: 'table',
      head: ['Ai', 'Đang làm gì', 'Ở đâu'],
      rows: [
        ['パクさん', 'Rửa đĩa', 'Trong bếp'],
        ['ダニエルさん', 'Chơi ghi-ta', 'Trong phòng khách'],
        ['アンナさん', 'Nấu ăn', 'Trong bếp'],
        ['ワンさん', 'Gọi điện', 'Trong phòng khách'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Q&A tranh T2',
      lines: [
        ...QA('パクさんは{何|なに}をしていますか。', 'Paku-san wa nani o shite imasu ka.', 'Park đang làm gì?', 'お{皿|さら}を{洗|あら}っています。', 'Osara o aratte imasu.', 'Đang rửa đĩa.'),
        ...QA('だれがギターを{弾|ひ}いていますか。', 'Dare ga gitaa o hiite imasu ka.', 'Ai đang chơi ghi-ta?', 'ダニエルさんが{弾|ひ}いています。', 'Danieru-san ga hiite imasu.', 'Anh Daniel đang chơi.'),
        ...QA('パクさんはどこでお{皿|さら}を{洗|あら}っていますか。', 'Paku-san wa doko de osara o aratte imasu ka.', 'Park rửa đĩa ở đâu?', '{台所|だいどころ}で{洗|あら}っています。', 'Daidokoro de aratte imasu.', 'Rửa ở trong bếp.'),
        ...QA('ワンさんは{何|なに}をしていますか。', 'Wan-san wa nani o shite imasu ka.', 'Wang đang làm gì?', '{電話|でんわ}をかけています。', 'Denwa o kakete imasu.', 'Đang gọi điện.'),
      ],
    },
    { t: 'h', text: 'Tranh T3 — Chủ nhật của một người (Bài 5)' },
    {
      t: 'table',
      head: ['Buổi', 'Trong tranh'],
      rows: [
        ['Sáng', 'Giặt quần áo ở nhà (せんたく)'],
        ['Trưa', 'Ở trung tâm thương mại mua một cái áo (ふく)'],
        ['Tối', 'Cùng bạn xem phim ở rạp'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Q&A tranh T3',
      lines: [
        ...QA('{日曜日|にちようび}、{何|なに}をしましたか。', 'Nichiyoubi, nani o shimashita ka.', 'Chủ nhật bạn đã làm gì?', '{洗濯|せんたく}をしました。それから、デパートで{買|か}い{物|もの}をしました。', 'Sentaku o shimashita. Sorekara, depaato de kaimono o shimashita.', 'Tôi giặt đồ. Sau đó mua sắm ở trung tâm thương mại.'),
        ...QA('どこで{服|ふく}を{買|か}いましたか。', 'Doko de fuku o kaimashita ka.', 'Bạn mua áo ở đâu?', 'デパートで{買|か}いました。', 'Depaato de kaimashita.', 'Mua ở trung tâm thương mại.'),
        ...QA('だれと{映画|えいが}を{見|み}ましたか。', 'Dare to eiga o mimashita ka.', 'Bạn xem phim cùng ai?', '{友達|ともだち}と{見|み}ました。', 'Tomodachi to mimashita.', 'Tôi xem cùng bạn.'),
      ],
    },
    { t: 'h', text: 'Tranh T4 — Áp phích trận bóng (Bài 6)' },
    {
      t: 'table',
      head: ['Thông tin trên áp phích', 'Giá trị'],
      rows: [
        ['Sự kiện', 'サッカーの試合 (trận bóng đá)'],
        ['Địa điểm', '横浜'],
        ['Ngày', '土曜日'],
        ['Giờ bắt đầu', '午後 5 時'],
        ['Vé', '2,000 円 · bạn có 2 vé'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Q&A tranh T4',
      lines: [
        ...QA('いつ、どこで{試合|しあい}がありますか。', 'Itsu, doko de shiai ga arimasu ka.', 'Khi nào và ở đâu có trận đấu?', '{土曜日|どようび}に{横浜|よこはま}で{試合|しあい}があります。', 'Doyoubi ni Yokohama de shiai ga arimasu.', 'Thứ Bảy có trận đấu ở Yokohama.'),
        ...QA('{何時|なんじ}からですか。', 'Nanji kara desu ka.', 'Từ mấy giờ?', '{午後|ごご}{五時|ごじ}からです。', 'Gogo goji kara desu.', 'Từ 5 giờ chiều.'),
        ...QA('チケットはいくらですか。', 'Chiketto wa ikura desu ka.', 'Vé bao nhiêu tiền?', '{二千円|にせんえん}です。', 'Nisen en desu.', '2.000 yên.'),
        ...QA('チケットは{何枚|なんまい}ありますか。', 'Chiketto wa nanmai arimasu ka.', 'Bạn có mấy vé?', '{二枚|にまい}あります。', 'Nimai arimasu.', 'Tôi có 2 vé.'),
      ],
    },
    { t: 'h', text: 'Tranh T5 — So sánh hai quán (Bài 6)' },
    {
      t: 'table',
      head: ['', 'Quán A (ラーメン)', 'Quán B (お好み焼き)'],
      rows: [
        ['Từ ga đi bộ', '5 phút', '15 phút'],
        ['Giá', '800 yên', '600 yên'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Q&A tranh T5',
      lines: [
        ...QA('どちらが{近|ちか}いですか。', 'Dochira ga chikai desu ka.', 'Quán nào gần hơn?', 'ラーメンの{店|みせ}のほうが{近|ちか}いです。', 'Raamen no mise no hou ga chikai desu.', 'Quán ramen gần hơn.'),
        ...QA('どちらが{安|やす}いですか。', 'Dochira ga yasui desu ka.', 'Quán nào rẻ hơn?', 'お{好|この}み{焼|や}きの{店|みせ}のほうが{安|やす}いです。', 'Okonomiyaki no mise no hou ga yasui desu.', 'Quán okonomiyaki rẻ hơn.'),
        ...QA('ラーメンの{店|みせ}は{駅|えき}からどのくらいですか。', 'Raamen no mise wa eki kara dono kurai desu ka.', 'Quán ramen cách ga bao lâu?', '{歩|ある}いて{五分|ごふん}です。', 'Aruite gofun desu.', 'Đi bộ 5 phút.'),
      ],
    },
    { t: 'h', text: 'Tranh T6 — Bốn mùa ở Nhật (Bài 4)' },
    {
      t: 'table',
      head: ['Mùa', 'Trong tranh'],
      rows: [
        ['{春|はる}', 'Hoa anh đào, trời ấm'],
        ['{夏|なつ}', 'Biển, trời rất nóng'],
        ['{秋|あき}', 'Lá đỏ, trời mát'],
        ['{冬|ふゆ}', 'Tuyết, trời lạnh'],
      ],
    },
    {
      t: 'dialogue',
      title: 'Q&A tranh T6',
      lines: [
        ...QA('{夏|なつ}、どうですか。', 'Natsu, dou desu ka.', 'Mùa hè thế nào?', 'とても{暑|あつ}いです。', 'Totemo atsui desu.', 'Rất nóng.'),
        ...QA('{冬|ふゆ}、{何|なに}がありますか。', 'Fuyu, nani ga arimasu ka.', 'Mùa đông có gì?', '{雪|ゆき}があります。', 'Yuki ga arimasu.', 'Có tuyết.'),
        ...QA('{秋|あき}はどんな{季節|きせつ}ですか。', 'Aki wa donna kisetsu desu ka.', 'Mùa thu là mùa như thế nào?', '{涼|すず}しい{季節|きせつ}です。', 'Suzushii kisetsu desu.', 'Là mùa mát mẻ.'),
      ],
    },

    { t: 'h', text: '6. Reading — đọc to (45 điểm)' },
    {
      t: 'note',
      title: 'Cách đọc được điểm tối đa',
      items: [
        '**20 giây chuẩn bị** = đọc thầm cả đoạn một lượt, gạch **chữ Hán** và **katakana** khó.',
        'Đọc **chậm, đều**, không cần nhanh. Sai một ký tự thì **đọc lại ngay** từ chỗ đó, đừng bỏ qua.',
        '**は đọc wa · を đọc o · へ đọc e**; katakana kéo dài ー đọc dài (コーヒー koohii); âm ngắt っ (チケット chiketto).',
        'Số và giờ: 四時 よじ · 七時 しちじ · 九時 くじ · 二時間半 にじかんはん · 十分 じゅっぷん · 三十分 さんじゅっぷん.',
      ],
    },
    {
      t: 'readkanji',
      id: 'ck-noi-doc',
      title: '8 đoạn Reading luyện đọc (khoảng 100–150 chữ — tự đọc to rồi bấm hiện cách đọc)',
      note: 'Mỗi đoạn có 5–7 chữ Hán và 2–4 từ katakana, giống khuôn đề. Tự soạn mới. Bật “hiện cách đọc” chỉ sau khi đọc xong.',
      items: [
        {
          text: '{先週|せんしゅう}の{日曜日|にちようび}に{友達|ともだち}と{海|うみ}へ{行|い}きました。ドライブをしました。{海|うみ}はとてもきれいでした。そして、おいしい{魚|さかな}を{食|た}べました。カメラで{写真|しゃしん}もたくさん{撮|と}りました。また{行|い}きたいです。',
          ro: 'Senshuu no nichiyoubi ni tomodachi to umi e ikimashita. Doraibu o shimashita. Umi wa totemo kirei deshita. Soshite, oishii sakana o tabemashita. Kamera de shashin mo takusan torimashita. Mata ikitai desu.',
          vi: 'Chủ nhật tuần trước tôi đi biển cùng bạn. Chúng tôi lái xe đi chơi. Biển rất đẹp. Và tôi ăn cá ngon. Tôi còn chụp nhiều ảnh bằng máy ảnh. Tôi muốn đi lần nữa.',
        },
        {
          text: '{私|わたし}の{町|まち}はハノイです。ベトナムの{北|きた}です。{大|おお}きい{町|まち}です。そして、にぎやかです。{古|ふる}いお{寺|てら}があります。{有名|ゆうめい}なコーヒーもあります。ハノイからホーチミンまで{飛行機|ひこうき}で{二時間|にじかん}くらいです。',
          ro: 'Watashi no machi wa Hanoi desu. Betonamu no kita desu. Ookii machi desu. Soshite, nigiyaka desu. Furui otera ga arimasu. Yuumei na koohii mo arimasu. Hanoi kara Hoochimin made hikouki de nijikan kurai desu.',
          vi: 'Thành phố của tôi là Hà Nội. Ở phía bắc Việt Nam. Là thành phố lớn. Và nhộn nhịp. Có ngôi chùa cổ. Cũng có cà phê nổi tiếng. Từ Hà Nội đến TP.HCM đi máy bay khoảng 2 tiếng.',
        },
        {
          text: '{今晩|こんばん}、{友達|ともだち}と{焼|や}き{肉|にく}を{食|た}べに{行|い}きます。{駅|えき}の{近|ちか}くの{店|みせ}です。{安|やす}いですが、おいしいですよ。ビールも{飲|の}みたいですが、{明日|あした}はテストがありますから、ジュースを{飲|の}みます。',
          ro: 'Konban, tomodachi to yakiniku o tabe ni ikimasu. Eki no chikaku no mise desu. Yasui desu ga, oishii desu yo. Biiru mo nomitai desu ga, ashita wa tesuto ga arimasu kara, juusu o nomimasu.',
          vi: 'Tối nay tôi đi ăn thịt nướng cùng bạn. Là quán gần ga. Rẻ nhưng ngon đấy. Tôi cũng muốn uống bia, nhưng mai có bài kiểm tra nên tôi uống nước ép.',
        },
        {
          text: '{日曜日|にちようび}に{友達|ともだち}のうちでパーティーがあります。{私|わたし}は{台所|だいどころ}で{料理|りょうり}を{作|つく}ります。パクさんはテーブルの{上|うえ}にお{皿|さら}とコップを{置|お}きます。お{酒|さけ}はもうありませんから、ダニエルさんが{買|か}いに{行|い}きます。',
          ro: 'Nichiyoubi ni tomodachi no uchi de paatii ga arimasu. Watashi wa daidokoro de ryouri o tsukurimasu. Paku-san wa teeburu no ue ni osara to koppu o okimasu. Osake wa mou arimasen kara, Danieru-san ga kai ni ikimasu.',
          vi: 'Chủ nhật có tiệc ở nhà bạn. Tôi nấu ăn trong bếp. Park đặt đĩa và cốc lên bàn. Vì rượu hết rồi nên Daniel đi mua.',
        },
        {
          text: '{昨日|きのう}、{友達|ともだち}とデパートへ{買|か}い{物|もの}に{行|い}きました。{新|あたら}しい{服|ふく}がほしかったですから。でも、{高|たか}かったです。ですから、{何|なに}も{買|か}いませんでした。それから、{映画|えいが}を{見|み}ました。コメディーでした。おもしろかったです。',
          ro: 'Kinou, tomodachi to depaato e kaimono ni ikimashita. Atarashii fuku ga hoshikatta desu kara. Demo, takakatta desu. Desu kara, nani mo kaimasen deshita. Sorekara, eiga o mimashita. Komedii deshita. Omoshirokatta desu.',
          vi: 'Hôm qua tôi đi mua sắm ở trung tâm thương mại cùng bạn. Vì tôi muốn có quần áo mới. Nhưng đắt. Vì vậy tôi không mua gì cả. Sau đó tôi xem phim. Là phim hài. Rất thú vị.',
        },
        {
          text: '{日本|にほん}で{東京|とうきょう}がいちばんにぎやかです。{京都|きょうと}は{東京|とうきょう}より{静|しず}かですが、きれいな{寺|てら}がたくさんあります。{京都|きょうと}のラーメンとホテルは{安|やす}いです。{私|わたし}は{京都|きょうと}のほうが{好|す}きです。{来月|らいげつ}、{新幹線|しんかんせん}で{行|い}きます。',
          ro: 'Nihon de Toukyou ga ichiban nigiyaka desu. Kyouto wa Toukyou yori shizuka desu ga, kirei na tera ga takusan arimasu. Kyouto no raamen to hoteru wa yasui desu. Watashi wa Kyouto no hou ga suki desu. Raigetsu, shinkansen de ikimasu.',
          vi: 'Ở Nhật, Tokyo là nơi nhộn nhịp nhất. Kyoto yên tĩnh hơn Tokyo nhưng có nhiều ngôi chùa đẹp. Ramen và khách sạn ở Kyoto rẻ. Tôi thích Kyoto hơn. Tháng sau tôi sẽ đi bằng tàu Shinkansen.',
        },
        {
          text: '{私|わたし}のうちの{近|ちか}くに{公園|こうえん}があります。{公園|こうえん}の{中|なか}に{古|ふる}い{寺|てら}があります。{寺|てら}の{前|まえ}に{小|ちい}さいコンビニがあります。{毎朝|まいあさ}、コンビニでコーヒーを{買|か}います。それから、{公園|こうえん}で{本|ほん}を{読|よ}みます。',
          ro: 'Watashi no uchi no chikaku ni kouen ga arimasu. Kouen no naka ni furui tera ga arimasu. Tera no mae ni chiisai konbini ga arimasu. Maiasa, konbini de koohii o kaimasu. Sorekara, kouen de hon o yomimasu.',
          vi: 'Gần nhà tôi có công viên. Trong công viên có ngôi chùa cổ. Trước chùa có cửa hàng tiện lợi nhỏ. Mỗi sáng tôi mua cà phê ở cửa hàng tiện lợi. Rồi tôi đọc sách ở công viên.',
        },
        {
          text: '{毎週|まいしゅう}、{日曜日|にちようび}に{家族|かぞく}と{川|かわ}へ{行|い}きます。{川|かわ}の{隣|となり}に{大|おお}きい{公園|こうえん}があります。{公園|こうえん}でサッカーをします。スポーツの{中|なか}でサッカーがいちばん{好|す}きです。{去年|きょねん}の{夏|なつ}はとても{暑|あつ}かったですから、{行|い}きませんでした。',
          ro: 'Maishuu, nichiyoubi ni kazoku to kawa e ikimasu. Kawa no tonari ni ookii kouen ga arimasu. Kouen de sakkaa o shimasu. Supootsu no naka de sakkaa ga ichiban suki desu. Kyonen no natsu wa totemo atsukatta desu kara, ikimasen deshita.',
          vi: 'Mỗi tuần, Chủ nhật tôi cùng gia đình đi ra sông. Cạnh sông có một công viên lớn. Tôi chơi bóng đá ở công viên. Trong các môn thể thao tôi thích bóng đá nhất. Mùa hè năm ngoái rất nóng nên tôi không đi.',
        },
      ],
    },

    {
      t: 'mcq',
      id: 'ck-noi-kiem-tra',
      title: 'Kiểm tra: chọn câu trả lời TỐT NHẤT cho từng câu hỏi của giám thị (12 câu)',
      items: [
        M('「ハノイからホーチミンまでどのくらいですか。」', '{飛行機|ひこうき}で{二時間|にじかん}くらいです。', ['{飛行機|ひこうき}です。', '{二時間|にじかん}ですか。', 'いいえ、{行|い}きません。'], 'Hỏi **どのくらい** → trả lời **phương tiện + thời gian + くらい**.', 0),
        M('「{今|いま}、{何|なに}がほしいですか。」', '{新|あたら}しいパソコンがほしいです。', ['{新|あたら}しいパソコンを{買|か}いました。', '{新|あたら}しいパソコンがあります。', 'パソコンですか。'], 'ほしい → **N がほしいです**.', 1),
        M('「{春|はる}と{夏|なつ}とどちらが{好|す}きですか。」', '{春|はる}のほうが{好|す}きです。', ['{春|はる}が{好|す}きです。', '{春|はる}がいちばん{好|す}きです。', 'はい、{好|す}きです。'], 'どちら → **のほうが**. (いちばん dùng cho 3 thứ trở lên.)', 2),
        M('「ベトナム{料理|りょうり}で{何|なに}がいちばん{好|す}きですか。」', 'フォーがいちばん{好|す}きです。', ['フォーのほうが{好|す}きです。', 'フォーです。', 'フォーを{食|た}べました。'], '**で + 何が + いちばん** → N がいちばん ~です.', 3),
        M('「{昨日|きのう}、どこかへ{行|い}きましたか。」（đi đâu cả → không）', 'いいえ、どこへも{行|い}きませんでした。', ['いいえ、どこも{行|い}きます。', 'いいえ、{行|い}きません。', 'はい、どこへも{行|い}きませんでした。'], 'Không đi đâu = **どこへも～ませんでした** (quá khứ phủ định).', 0),
        M('「どうして{学校|がっこう}へ{行|い}きませんでしたか。」', '{日曜日|にちようび}でしたから、{行|い}きませんでした。', ['{日曜日|にちようび}です。', '{日曜日|にちようび}に{行|い}きます。', 'いいえ、{行|い}きました。'], 'どうして → **～から**.', 1),
        M('「もう{昼|ひる}ご{飯|はん}を{食|た}べましたか。」（chưa ăn）', 'いいえ、まだです。', ['いいえ、{食|た}べません。', 'いいえ、もう{食|た}べませんでした。', 'はい、まだです。'], 'Chưa = **まだです**.', 2),
        M('「{今晩|こんばん}、{一緒|いっしょ}にご{飯|はん}を{食|た}べませんか。」（bận → từ chối khéo）', 'すみません、{今晩|こんばん}はちょっと……。{用事|ようじ}がありますから。', ['いいえ、{食|た}べません。', 'いいえ、{用事|ようじ}です。', 'ちょっとです。'], 'Từ chối khéo: **すみません + ちょっと…… + lý do から**.', 0),
        M('「{駅|えき}の{近|ちか}くに{何|なに}がありますか。」', '{本屋|ほんや}とコンビニがあります。', ['{本屋|ほんや}とコンビニにいます。', '{本屋|ほんや}とコンビニです。', '{駅|えき}の{近|ちか}くにありません。'], 'Vật/công trình → **あります** (không います).', 1),
        M('「ねこはどこにいますか。」', 'テーブルの{下|した}にいます。', ['テーブルの{下|した}にあります。', 'テーブルの{下|した}です。', 'テーブルの{下|した}で{寝|ね}ます。'], 'Con vật → **います**.', 2),
        M('「{何|なん}でりんごを{切|き}りますか。」', 'ナイフで{切|き}ります。', ['ナイフを{切|き}ります。', 'ナイフにあります。', 'ナイフと{切|き}ります。'], 'Dụng cụ → **N で**.', 3),
        M('「パクさんは{何|なに}をしていますか。」（đang rửa đĩa）', 'お{皿|さら}を{洗|あら}っています。', ['お{皿|さら}を{洗|あら}います。', 'お{皿|さら}を{洗|あら}いました。', 'お{皿|さら}を{洗|あら}ってください。'], 'Đang làm = **V ています**.', 0),
      ],
    },
    {
      t: 'speak',
      id: 'ck-noi-ghi-am',
      part: '1',
      questions: [
        'ハノイから ホーチミンまで どのくらいですか。',
        'うちから だいがくまで バスで どのくらいですか。',
        'ベトナムは どんな くにですか。',
        'あなたの まちは にぎやかですか。',
        'あなたの まちに おてらが ありますか。',
        'ハノイは じゅうにがつ、どうですか。',
        'きのう、なにを しましたか。',
        'きのう、どこかへ いきましたか。',
        'せんしゅう、だれと えいがを みましたか。',
        'いま、なにが いちばん ほしいですか。',
        'おかねが たくさん あります。なにを したいですか。',
        'あした、なにを しに いきますか。',
        'こんばん、いっしょに ごはんを たべませんか。',
        'ベトナムりょうりで なにが いちばん おいしいですか。',
        'なつと ふゆと どちらが すきですか。',
        'もう ひるごはんを たべましたか。',
        'あなたの うちは どこに ありますか。',
        'うちの ちかくに なにが ありますか。',
        'にほんじんは なんで ごはんを たべますか。',
        'いま、なにを していますか。',
      ],
    },
  ],
};

/* ═══════════════════ 7. ĐỀ LUYỆN CUỐI KỲ ═══════════════════ */

const DE_LUYEN: Lesson = {
  id: 'cuoi-ky-de-luyen',
  kind: 'review',
  title: 'Đề luyện cuối kỳ JPD123 (Bài 4–7) — làm thử như Final test: 8 phần, 100+ câu, có giải thích',
  goal: 'Làm thử một đề đủ các phần như đề ôn của cô (trợ từ, từ để hỏi, chọn đáp án, chia từ, đọc hiểu, dịch, chữ Hán), bấm giờ, tự chấm và biết mình yếu ở đâu.',
  minutes: 75,
  blocks: [
    {
      t: 'recap',
      title: 'Cách làm đề',
      items: [
        '**Bấm giờ 60 phút** cho cả đề (nghe làm riêng ở bài 5). **Không mở bài ôn** khi đang làm.',
        'Làm theo thứ tự **I → VIII**. Cuối mỗi phần, bấm nộp để xem đáp án và giải thích. Ghi lại **số câu sai theo phần**.',
        'Tự chấm: ≥ 85% = sẵn sàng · 70–85% = ôn lại phần sai · < 70% = đọc lại bài ngữ pháp + chữ Hán rồi làm lại sau 1 ngày.',
        'Câu hỏi **tự soạn mới**, cùng dạng với đề ôn cô phát, chỉ dùng từ và ngữ pháp Bài 1–7.',
      ],
    },
    {
      t: 'table',
      caption: 'Cấu trúc đề luyện',
      head: ['Phần', 'Dạng', 'Số câu'],
      rows: [
        ['I', 'Điền trợ từ (nhiều ô trống, có X)', '13'],
        ['II', 'Điền từ để hỏi', '12'],
        ['III', 'Chọn đáp án đúng (ngữ pháp + từ vựng)', '18'],
        ['IV', 'Chia từ trong ngoặc', '9'],
        ['V', 'Đọc hiểu (3 chỗ trống + 2 câu nội dung)', '5'],
        ['VI', 'Dịch: Việt → Nhật (8) và Nhật → Việt (8)', '16'],
        ['VII', 'Chữ Hán (đọc 6 + chọn chữ 6)', '12'],
        ['Tổng', '', '**85 câu**'],
      ],
    },

    { t: 'h', text: 'Phần I — Điền trợ từ vào ô trống (X = không cần trợ từ)' },
    {
      t: 'mcq',
      id: 'ck-de-i',
      title: 'I. Trợ từ (13 câu) — chọn cặp/bộ trợ từ đúng cho các ô ①②③',
      items: [
        M('ベトナム（①）{夏|なつ}（②）{暑|あつ}いです。', '① は　② X', ['① が　② に', '① の　② は', '① は　② に'], 'ポイント 26: N は［mùa］、A です — sau mùa chỉ có **dấu phẩy**, **không に**.', 0),
        M('{家族|かぞく}（①）だれ（②）いちばん{忙|いそが}しいですか。', '① で　② が', ['① は　② が', '① で　② は', '① の　② を'], '**phạm vi + で** · từ để hỏi **だれが**.', 1),
        M('{漢字|かんじ}（①）{読|よ}み{方|かた}（②）わかりますか。', '① の　② が', ['① を　② が', '① の　② を', '① は　② を'], 'N **の** V方 · わかります đi với **が**.', 2),
        M('おすし（①）てんぷら（②）、どちら（③）{好|す}きですか。', '① と　② と　③ が', ['① と　② は　③ が', '① や　② と　③ を', '① と　② の　③ が'], '**A と B と どちらが**.', 3),
        M('{私|わたし}（①）{肉|にく}（②）{食|た}べませんが、{魚|さかな}（③）{好|す}きです。', '① は　② を　③ が', ['① が　② を　③ が', '① は　② が　③ を', '① は　② を　③ を'], '食べます→**を**; 好きです→**が**.', 0),
        M('{本屋|ほんや}は{駅|えき}（①）{銀行|ぎんこう}（②）{間|あいだ}（③）あります。', '① と　② の　③ に', ['① と　② に　③ の', '① の　② と　③ に', '① と　② の　③ で'], '**N1 と N2 の間 に** あります.', 1),
        M('{金曜日|きんようび}、{友達|ともだち}（①）{約束|やくそく}（②）あります。', '① と　② が', ['① に　② が', '① と　② を', '① の　② が'], '**友達と約束があります** (có hẹn với bạn); あります → **が**.', 2),
        M('ポストの{前|まえ}（①）{男|おとこ}の{子|こ}（②）います。', '① に　② が', ['① で　② が', '① に　② は', '① へ　② を'], 'Nơi tồn tại **に** · N が います.', 3),
        M('このレストランは{料理|りょうり}（①）おいしくないです（②）、{高|たか}いです。', '① は　② が', ['① が　② が', '① は　② を', '① は　② で'], '**は** đặt chủ đề tương phản · **が** = nhưng.', 0),
        M('{来週|らいしゅう}（①）{土曜日|どようび}、{家族|かぞく}（②）{公園|こうえん}へ{遊|あそ}び（③）{行|い}きます。', '① の　② と　③ に', ['① の　② に　③ に', '① に　② と　③ を', '① の　② で　③ に'], '**来週の土曜日** · **家族と** · **V(bỏ ます) に 行きます**.', 1),
        M('すみませんが、この{傘|かさ}（①）テーブル（②）{上|うえ}（③）{置|お}いてください。', '① を　② の　③ に', ['① を　② の　③ で', '① が　② の　③ に', '① を　② に　③ に'], '傘**を** · テーブル**の**上 · 上**に** 置く.', 2),
        M('{山田|やまだ}さんは{台所|だいどころ}（①）{皿|さら}（②）{洗|あら}っています。', '① で　② を', ['① に　② を', '① で　② が', '① へ　② を'], 'Nơi làm hành động **で** · 洗う → **を**.', 3),
        M('うち（①）{駅|えき}（②）{歩|ある}いて（③）{十分|じゅっぷん}です。', '① から　② まで　③ X', ['① から　② まで　③ に', '① の　② まで　③ で', '① から　② は　③ X'], 'から～まで; **あるいて** + thời gian: **không có trợ từ**.', 0),
      ],
    },

    { t: 'h', text: 'Phần II — Điền từ để hỏi phù hợp' },
    {
      t: 'mcq',
      id: 'ck-de-ii',
      title: 'II. Từ để hỏi (12 câu) — nhìn câu trả lời để chọn',
      items: [
        M('ダナンは（　）{町|まち}ですか。…{海|うみ}がある{町|まち}です。', 'どんな', ['どう', 'どれ', 'どこ'], 'Có danh từ **町** đứng sau → **どんな**.', 0),
        M('{一年|いちねん}で（　）がいちばん{暑|あつ}いですか。…{七月|しちがつ}です。', '{何月|なんがつ}', ['{何時|なんじ}', '{何曜日|なんようび}', '{何枚|なんまい}'], 'Đáp án là một tháng → **何月**.', 1),
        M('（　）{朝|あさ}ご{飯|はん}を{食|た}べませんでしたか。…{時間|じかん}がありませんでしたから。', 'どうして', ['どう', 'どんな', 'いつ'], 'Trả lời bằng **から** → hỏi lý do **どうして**.', 2),
        M('{週末|しゅうまつ}（　）{行|い}きましたか。…はい、{京都|きょうと}へ{行|い}きました。', 'どこかへ', ['どこへも', 'どこで', 'どれ'], '**どこかへ行きましたか** (có đi đâu không?) → はい、～へ行きました.', 3),
        M('{昨日|きのう}の{映画|えいが}は（　）でしたか。…おもしろかったです。', 'どう', ['どんな', 'どこ', 'だれ'], 'Hỏi **cảm nhận** (không có danh từ) → **どう**.', 0),
        M('{肉|にく}と{魚|さかな}と（　）が{好|す}きですか。…{肉|にく}のほうが{好|す}きです。', 'どちら', ['どれ', 'どの', 'どこ'], 'Chọn 1 trong **2** → **どちら**.', 1),
        M('{駅|えき}の{前|まえ}に（　）がいますか。…{交番|こうばん}の{人|ひと}がいます。', 'だれ', ['{何|なに}', 'どこ', 'どれ'], 'Người → **だれ** (いますか).', 2),
        M('あなたの{傘|かさ}は（　）ですか。…あの{青|あお}い{傘|かさ}です。', 'どれ', ['どの', 'どんな', 'どう'], '**どれ** đứng một mình (không có N theo sau).', 3),
        M('この{皿|さら}は（　）ですか。…{三百円|さんびゃくえん}です。', 'いくら', ['いくつ', '{何枚|なんまい}', 'どのくらい'], 'Giá tiền → **いくら**.', 0),
        M('（　）{傘|かさ}が{田中|たなか}さんのですか。…あの{黒|くろ}い{傘|かさ}です。', 'どの', ['どれ', 'どんな', 'どう'], 'Có danh từ **傘** theo sau → **どの**.', 1),
        M('ホーチミンから{東京|とうきょう}まで{飛行機|ひこうき}で（　）ですか。…{六時間|ろくじかん}くらいです。', 'どのくらい', ['いくら', 'いくつ', '{何時|なんじ}'], 'Thời gian đi đường → **どのくらい**.', 2),
        M('りんごが（　）ありますか。…{三|みっ}つあります。', 'いくつ', ['いくら', 'どのくらい', 'どれ'], 'Số lượng (đếm つ) → **いくつ**.', 3),
      ],
    },

    { t: 'h', text: 'Phần III — Chọn đáp án đúng' },
    {
      t: 'mcq',
      id: 'ck-de-iii',
      title: 'III. Chọn đáp án đúng (18 câu)',
      items: [
        M('{去年|きょねん}の{冬|ふゆ}はあまり（　）。', '{寒|さむ}くなかったです', ['{寒|さむ}かったです', '{寒|さむ}くないでした', '{寒|さむ}いでした'], 'あまり + phủ định; い-adj quá khứ phủ định **～くなかったです**.', 2),
        M('{窓|まど}を（　）ください。', '{閉|し}めて', ['{閉|し}めって', '{閉|し}め', '{閉|し}まって'], '閉めます (nhóm 2) → **閉めて**.', 0),
        M('{大阪|おおさか}は{京都|きょうと}（　）{大|おお}きいです。', 'より', ['から', 'まで', 'のほう'], '**N1 は N2 より A**.', 3),
        M('バス{停|てい}にたくさんの{人|ひと}が（　）。', 'います', ['あります', 'いきます', 'ありません'], 'Người → **います**.', 1),
        M('ホーチミンは（　）まちです。', 'にぎやかな', ['にぎやか', 'にぎやかの', 'にぎやかい'], 'な-adj + **な** + N.', 1),
        M('この{公園|こうえん}はとても（　）です。', '{静|しず}か', ['{静|しず}かな', '{静|しず}かい', '{静|しず}かの'], 'とても + な-adj + **です** (không な).', 3),
        M('{先週|せんしゅう}の{日曜日|にちようび}は（　）。', '{雨|あめ}でした', ['{雨|あめ}です', '{雨|あめ}ではありません', '{雨|あめ}いでした'], 'Quá khứ danh từ **でした**.', 0),
        M('このレストランの{料理|りょうり}はあまり（　）。', 'おいしくないです', ['おいしいくないです', 'おいしじゃありません', 'おいしいじゃありません'], 'い-adj phủ định **～くないです**.', 2),
        M('この{町|まち}は{静|しず}かです。（　）、きれいです。', 'そして', ['でも', 'ですから', 'それから'], 'Hai ý cùng chiều → **そして**.', 3),
        M('{北海道|ほっかいどう}は{緑|みどり}が（　）ところです。', '{多|おお}い', ['{多|おお}いな', '{多|おお}いの', '{多|おお}く'], 'い-adj đứng trước danh từ giữ nguyên **多い**.', 1),
        M('パソコンの（　）を{教|おし}えてください。', '{使|つか}い{方|かた}', ['{使|つか}い', '{使|つか}いのかた', '{使|つか}う'], '**V(bỏ ます)＋かた**.', 0),
        M('コーヒーに（　）を{入|い}れます。', 'さとう', ['いす', 'はし', 'まど'], 'さとう (đường) cho vào cà phê.', 2),
        M('{友達|ともだち}に{電話|でんわ}を（　）。', 'かけました', ['ひきました', 'すいました', 'ききました'], '電話を**かける** (gọi điện).', 1),
        M('うちは{駅|えき}から（　）です。{歩|ある}いて{二分|にふん}です。', '{近|ちか}い', ['{遠|とお}い', '{広|ひろ}い', '{高|たか}い'], 'Đi bộ 2 phút → **gần**.', 3),
        M('あしたは{友達|ともだち}と（　）があります。いっしょに{映画|えいが}を{見|み}ます。', '{約束|やくそく}', ['{試合|しあい}', '{地図|ちず}', '{水着|みずぎ}'], '**約束がある** = có hẹn.', 0),
        M('{朝|あさ}から{晩|ばん}まではたらきます。（　）です。', '{大変|たいへん}', ['{冷|つめ}たい', '{甘|あま}い', 'すっぱい'], 'Làm việc cả ngày → **たいへん** (vất vả).', 2),
        M('{日本|にほん}は{夏|なつ}、{雨|あめ}が（　）です。', '{多|おお}い', ['{青|あお}い', '{苦|にが}い', '{広|ひろ}い'], '雨が**多い** (mưa nhiều).', 3),
        M('ここに{名前|なまえ}を（　）ください。', '{書|か}いて', ['{書|か}って', '{書|か}んで', '{書|か}きて'], '書きます (nhóm 1, き) → **書いて**.', 1),
      ],
    },

    { t: 'h', text: 'Phần IV — Chia từ trong ngoặc sang dạng phù hợp' },
    {
      t: 'quiz',
      id: 'ck-de-iv',
      title: 'IV. Chia từ (9 câu) — gõ dạng đúng của từ trong ngoặc',
      kind: 'fill',
      grammar: 'Nhìn từ đứng sau ngoặc: N / ください / います / たい / に行きます / ましょうか / から',
      items: [
        { q: 'ここは（{有名|ゆうめい}です）{町|まち}です。', answers: V('{有名|ゆうめい}な'), hint: '有名です + N' },
        { q: '{私|わたし}は{日本|にほん}で{日本語|にほんご}を（{勉強|べんきょう}します）たいです。', answers: V('{勉強|べんきょう}し'), hint: '勉強します + たい' },
        { q: '{友達|ともだち}に（{会|あ}います）に{行|い}きます。', answers: V('{会|あ}い'), hint: '会います + に行きます' },
        { q: 'この{町|まち}はあまり（{静|しず}かです）。', answers: V('{静|しず}かじゃありません', '{静|しず}かではありません'), hint: 'あまり + phủ định' },
        { q: '{先週|せんしゅう}の{日曜日|にちようび}は（{雨|あめ}です）から、どこへも{行|い}きませんでした。', answers: V('{雨|あめ}でした'), hint: '雨です → quá khứ' },
        { q: '{昨日|きのう}は（{天気|てんき}がいいです）。', answers: V('{天気|てんき}がよかったです'), hint: 'いいです → quá khứ' },
        { q: '{今|いま}、{何|なに}を（します）いますか。', answers: V('して'), hint: 'します → て' },
        { q: 'ここに{名前|なまえ}を（{書|か}きます）ください。', answers: V('{書|か}いて'), hint: '書きます → て' },
        { q: 'ナタポンさん、（{手伝|てつだ}います）ましょうか。', answers: V('{手伝|てつだ}い'), hint: '手伝います → 手伝い + ましょうか' },
      ],
    },

    { t: 'h', text: 'Phần V — Đọc hiểu' },
    {
      t: 'passage',
      title: 'Đoạn văn',
      intro: 'Đọc đoạn văn, rồi trả lời các câu hỏi.',
      paras: [
        {
          text: '{私|わたし}の{町|まち}はとても（　①　）です。{夏|なつ}は{三十五度|さんじゅうごど}ぐらいで、{一年中|いちねんじゅう}（　①　）です。ですから、{私|わたし}は（　②　）{飲|の}み{物|もの}がいちばん{好|す}きです。{毎日|まいにち}、{冷|つめ}たいジュースを{飲|の}みます。そして、{夜|よる}は{友達|ともだち}と{川|かわ}の{近|ちか}くの{公園|こうえん}へ{行|い}きます。{公園|こうえん}は{静|しず}かです。（　③　）、{涼|すず}しいですから、{気持|きも}ちがいいです。',
        },
      ],
    },
    {
      t: 'mcq',
      id: 'ck-de-v',
      title: 'V. Đọc hiểu (5 câu)',
      items: [
        M('① に入る言葉は？', '{暑|あつ}い', ['{寒|さむ}い', '{広|ひろ}い', '{静|しず}か'], 'Câu sau nói 35 độ, quanh năm → **暑い**.', 1),
        M('② に入る言葉は？', '{冷|つめ}たい', ['{熱|あつ}い', '{古|ふる}い', '{新|あたら}しい'], 'Vì trời nóng nên thích đồ uống **lạnh** (câu sau: 冷たいジュース).', 2),
        M('③ に入る言葉は？', 'そして', ['でも', 'ですから', 'どうして'], '“静かです。**そして**、涼しいです” — hai ý cùng chiều.', 2),
        M('この{人|ひと}について、正しいのは？', '{毎日|まいにち}、{冷|つめ}たいジュースを{飲|の}む。', ['{町|まち}は{冬|ふゆ}、{寒|さむ}い。', '{公園|こうえん}は{大|おお}きい。', '{川|かわ}の{近|ちか}くに{住|す}んでいる。'], 'Đoạn văn chỉ nói uống nước ép lạnh mỗi ngày. Các ý còn lại **không có** trong đoạn.', 3),
        M('この{人|ひと}は{夜|よる}、{何|なに}をしますか。', '{友達|ともだち}と{公園|こうえん}へ{行|い}く。', ['うちで{寝|ね}る。', '{一人|ひとり}で{勉強|べんきょう}する。', '{川|かわ}でジュースを{買|か}う。'], '夜は友達と川の近くの公園へ行きます.', 2),
      ],
    },

    { t: 'h', text: 'Phần VI — Dịch Việt → Nhật và Nhật → Việt' },
    {
      t: 'quiz',
      id: 'ck-de-vi-vn-jp',
      title: 'VI-A. Dịch Việt → Nhật (8 câu). Gõ bằng chữ Hán hoặc hiragana.',
      kind: 'translate',
      grammar: 'Giữ khung câu của bài ôn: いちばん · から · に～があります · V ましょうか · ています · から～まで',
      items: [
        { q: 'Trong các mùa, tôi thích mùa xuân nhất.', answers: V('{季節|きせつ}で{春|はる}がいちばん{好|す}きです。', '{私|わたし}は{季節|きせつ}で{春|はる}がいちばん{好|す}きです。'), hint: '季節, 春, 好き' },
        { q: 'Hôm qua trời nóng nên tôi không đi đâu cả.', answers: V('{昨日|きのう}は{暑|あつ}かったですから、どこへも{行|い}きませんでした。', '{昨日|きのう}は{暑|あつ}かったですから、どこも{行|い}きませんでした。'), hint: '昨日, 暑い, どこへも' },
        { q: 'Trên bàn có sách, bút và một cái cốc.', answers: V('テーブルの{上|うえ}に{本|ほん}とペンとコップがあります。', 'テーブルの{上|うえ}に{本|ほん}やペンやコップがあります。'), hint: 'テーブル, 上, あります' },
        { q: 'Tuần trước tôi đã đi bảo tàng mỹ thuật cùng bạn.', answers: V('{先週|せんしゅう}、{友達|ともだち}と{美術館|びじゅつかん}へ{行|い}きました。', '{私|わたし}は{先週|せんしゅう}、{友達|ともだち}と{美術館|びじゅつかん}へ{行|い}きました。'), hint: '先週, 友達, 美術館' },
        { q: 'Để tôi chỉ cách dùng máy tính cho bạn nhé!', answers: V('パソコンの{使|つか}い{方|かた}を{教|おし}えましょうか。'), hint: '使い方, 教えます' },
        { q: 'Anh Park đang đọc sách một mình trong phòng à?', answers: V('パクさんは{部屋|へや}で{一人|ひとり}で{本|ほん}を{読|よ}んでいますか。', 'パクさんは{一人|ひとり}で{部屋|へや}で{本|ほん}を{読|よ}んでいますか。'), hint: '部屋, 一人で, 読みます' },
        { q: 'Cô Yamada là một giáo viên tốt và còn xinh nữa.', answers: V('{山田|やまだ}さんはいい{先生|せんせい}です。そして、きれいです。'), hint: '先生, いい, きれい' },
        { q: 'Từ nhà tôi đến ga đi bộ mất 10 phút.', answers: V('{私|わたし}のうちから{駅|えき}まで{歩|ある}いて{十分|じゅっぷん}です。', '{私|わたし}のうちから{駅|えき}まで{歩|ある}いて10{分|ぷん}です。', '{私|わたし}のうちから{駅|えき}まで{歩|ある}いて10分です。'), hint: '歩いて, 十分' },
      ],
    },
    {
      t: 'mcq',
      id: 'ck-de-vi-jp-vn',
      title: 'VI-B. Dịch Nhật → Việt (8 câu) — chọn bản dịch đúng nhất',
      items: [
        M('{私|わたし}のまちにきれいな{川|かわ}があります。', 'Ở thành phố tôi có một con sông đẹp.', ['Thành phố của tôi là một con sông đẹp.', 'Tôi sống cạnh một con sông.', 'Thành phố tôi không có sông.'], 'N1 に N2 が あります = ở N1 có N2.', 1),
        M('{今晩|こんばん}、{家族|かぞく}と{映画|えいが}を{見|み}に{行|い}きます。', 'Tối nay tôi đi xem phim cùng gia đình.', ['Tối qua tôi xem phim ở nhà.', 'Tối nay gia đình tôi đến rạp chiếu phim.', 'Hôm nay tôi định xem phim một mình.'], '～に行きます (đi để làm gì) + と (cùng).', 3),
        M('{勉強|べんきょう}が{忙|いそが}しいですから、{時間|じかん}がほしいです。', 'Vì việc học bận nên tôi muốn có thời gian.', ['Vì tôi có thời gian nên tôi muốn học.', 'Tôi muốn học vì có nhiều thời gian.', 'Vì không có thời gian nên tôi không học.'], '～から = vì; ほしい = muốn có.', 2),
        M('{今日|きょう}は{明日|あした}よりひまですか。', 'Hôm nay có rảnh hơn ngày mai không?', ['Hôm nay rảnh nhất phải không?', 'Ngày mai có rảnh hơn hôm nay không?', 'Hôm nay có việc không?'], 'N1 は N2 より A: so sánh hơn; 今日 so với 明日.', 0),
        M('おすしとてんぷらとどちらが{好|す}きですか。', 'Sushi và tempura, bạn thích món nào hơn?', ['Bạn thích sushi nhất hay tempura nhất?', 'Sushi và tempura bạn đã ăn món nào rồi?', 'Bạn ghét sushi hay tempura hơn?'], 'A と B と どちらが ～ = chọn 1 trong 2.', 3),
        M('だれがこのケーキを{作|つく}りましたか。', 'Ai đã làm chiếc bánh này vậy?', ['Bạn đã làm chiếc bánh này ở đâu?', 'Chiếc bánh này là của ai?', 'Chiếc bánh này khi nào làm xong?'], 'だれが + V ました = ai đã làm.', 1),
        M('すみません、その{箱|はこ}をここへ{持|も}って{来|き}てください。', 'Xin lỗi, hãy mang cái hộp đó đến đây.', ['Xin lỗi, hãy mang cái hộp này đi giúp tôi.', 'Xin lỗi, cái hộp đó ở đâu?', 'Xin lỗi, tôi sẽ mang cái hộp đó đến.'], '持って来る = mang đến (phía người nói); ください = hãy.', 2),
        M('パクさん、この{漢字|かんじ}の{書|か}き{方|かた}がわかりませんから、{教|おし}えてください。', 'Anh Park, tôi không biết cách viết chữ Hán này nên anh chỉ giúp tôi.', ['Anh Park, tôi không đọc được chữ Hán này nên anh hãy viết giúp.', 'Anh Park, chữ Hán này khó nên tôi không học.', 'Anh Park, hãy chỉ tôi cách đọc chữ Hán.'], '書き方 = cách VIẾT; わかりません = không biết; ～から = vì.', 0),
      ],
    },

    { t: 'h', text: 'Phần VII — Chữ Hán' },
    {
      t: 'mcq',
      id: 'ck-de-vii',
      title: 'VII. Chữ Hán (12 câu)',
      items: [
        M('「一週間」', 'いっしゅうかん', ['いちしゅうかん', 'いっしゅかん', 'ひとしゅうかん'], '**一週間** いっしゅうかん (いっ + しゅう + かん).', 1),
        M('「読み物」', 'よみもの', ['どくもの', 'よむもの', 'よみぶつ'], '**読み物** よみもの (Kun + Kun).', 3),
        M('「男の子」', 'おとこのこ', ['だんのこ', 'おとこのし', 'おとなのこ'], '**男** おとこ + の + **子** こ.', 0),
        M('「市場」', 'いちば', ['しじょう', 'しば', 'いちじょう'], '**市場** いちば (đọc Kun) — khác しじょう (thị trường).', 2),
        M('「今月」', 'こんげつ', ['いまつき', 'きんげつ', 'こんつき'], '**今月** こんげつ.', 1),
        M('「小学生」', 'しょうがくせい', ['こがくせい', 'しょがくせい', 'ちいがくせい'], '**小学生** しょうがくせい.', 3),
        M('いちじはん', '一時半', ['一時羊', '一時平', '二時半'], '**半**: hai chấm + 二 + nét dọc; 羊 ba ngang.', 2),
        M('おんなのひと', '女の人', ['母の人', '安の人', '好の人'], '**女** nét uốn; 母 có 2 chấm bên trong.', 0),
        M('まいにち', '毎日', ['母日', '海日', '梅日'], '**毎** (MỖI): giống 母 nhưng có nét ngang trên.', 3),
        M('らいげつ', '来月', ['米月', '未月', '来日'], '**来** (LAI); 米 gạo; 来日 là らいにち.', 1),
        M('がいこく', '外国', ['外困', '外回', '内国'], '**国** có 玉 trong khung; 外 ≠ 内.', 0),
        M('かいしゃ', '会社', ['合社', '会杜', '今社'], '**会社**: 会 (人 + 二 + ム) + 社 (礻).', 2),
      ],
    },
    {
      t: 'note',
      title: 'Sau khi làm đề',
      items: [
        'Tính điểm từng phần; phần nào dưới 70% thì quay về bài tương ứng (trợ từ/từ để hỏi → bài 2; chia từ → bài 4; chữ Hán → bài 3).',
        '**Phần nghe** làm riêng ở bài 5 (43 đoạn). **Thi nói** luyện ở bài 6.',
        'Chữa chi tiết các câu trong slide của cô (Slot 20 Test 2 + Slot 30 Ôn tập) ở **bài 8**.',
      ],
    },
  ],
};

/* ═══════════════════ 8. CHỮA SLOT 20 TEST 2 + SLOT 30 ÔN TẬP ═══════════════════ */

const CHUA_SLOT: Lesson = {
  id: 'cuoi-ky-chua-slot',
  kind: 'review',
  title: 'Chữa chi tiết Slot 20 (Test 2) và Slot 30 (Ôn tập) của cô — trợ từ, từ để hỏi, chữ Hán, nghe',
  goal: 'Làm lại và hiểu từng câu trong bộ slide ôn tập của cô (文法復習 4 bộ, 漢字 4 lần + từ ghép, 聴解 Bài 4–7), biết vì sao mỗi đáp án đúng và đính chính chỗ slide viết dễ hiểu nhầm.',
  minutes: 60,
  blocks: [
    {
      t: 'recap',
      title: 'Slot 20 và Slot 30 là gì?',
      items: [
        '**Slot 20 “Test 2 + ÔN TẬP”** và **Slot 30 “ÔN TẬP”** dùng **chung một bộ slide** (Slot 20 có thêm trang tiêu đề “TEST 2 (Bài 6 + Bài 7)”). Nội dung: ① tóm tắt ngữ pháp Bài 4–7 (đã gom ở bài 2 của phần ôn này) → ② **文法復習** (bài tập trợ từ + từ để hỏi) → ③ **漢字** 4 lần + từ ghép → ④ **聴解** (nghe Bài 4–7).',
        'Trong file slide, **câu hỏi của 文法復習 là hình ảnh, đáp án chồng trên hình** nên máy đọc chỉ còn một phần chữ. Mục dưới **dựng lại các câu đọc được**; chỗ nào slide chỉ còn một nửa thì **ghi rõ “chưa chắc”** — hãy hỏi lại cô.',
        'Cách học: **làm trước, xem giải thích sau**. Mỗi câu trợ từ có 1–4 ô trống; chọn bộ đáp án đúng cho các ô ①②③…',
      ],
    },

    { t: 'h', text: 'A. 文法復習 — Bộ 1: điền trợ từ' },
    {
      t: 'mcq',
      id: 'ck-c8-b1',
      title: 'Bộ 1 (6 câu) — trợ từ',
      items: [
        M('さかな（①）{食|た}べませんね。ラオさん（②）さかな（③）きらいですか。', '① を　② は　③ が', ['① が　② は　③ を', '① を　② が　③ が', '① は　② は　③ が'], '食べます → **を** · chủ đề **は** · きらい → **が** (đối tượng của すき/きらい).', 0),
        M('あなた（①）かんじ（②）わかりますか。…いいえ、わかりません。', '① は　② が', ['① が　② を', '① は　② を', '① の　② が'], 'Chủ đề **は**; わかります → **が**.', 1),
        M('{先週|せんしゅう}（①）{火曜日|かようび}、{会社|かいしゃ}（②）{休|やす}みました。', '① の　② を', ['① に　② を', '① の　② に', '① X　② で'], '**先週の火曜日** (の nối hai danh từ thời gian). **会社を休みました** = nghỉ làm (không đi làm): 休みます đi với **を** khi nói nghỉ một việc cố định.', 2),
        M('そのはこ（①）なか（②）{何|なに}（③）ありますか。…{何|なに}（④）ありません。', '① の　② に　③ が　④ も', ['① の　② に　③ を　④ も', '① は　② に　③ が　④ は', '① の　② で　③ が　④ も'], 'はこ**の**なか · 中**に**ある · 何**が** · **何も** + phủ định (không có gì cả).', 3),
        M('さとう：{昨日|きのう}（①）どこ（②）{行|い}きましたか。', '① X　② へ', ['① に　② へ', '① X　② を', '① は　② で'], '**きのう** (từ chỉ thời điểm tương đối) **không cần に**; đích đến **へ**.', 0),
        M('すずき：こうえんのレストラン（①）ともだち（②）{会|あ}いました。それから、いっしょにひるごはん（③）{食|た}べました。', '① で　② に　③ を', ['① に　② に　③ を', '① で　② と　③ が', '① で　② に　③ に'], '**レストランで** (nơi làm hành động) · **ともだちに会う** (会います đi với に) · ひるごはん**を**食べます.', 1),
      ],
    },
    {
      t: 'note',
      title: 'Chưa chắc ở Bộ 1',
      items: [
        'Câu 6, vế trả lời **すずき：となりのまち（　）…** trong slide chỉ còn đáp án in chồng, không rõ có phải 「となりのまちへ行きました」 hay không. Nếu đề hỏi 「どこへ行きましたか」 thì đáp **となりのまちへ行きました** (へ/に đều đúng).',
        'Câu 1 của Bộ 1 không đọc được từ slide.',
      ],
    },

    { t: 'h', text: 'A. 文法復習 — Bộ 2: trợ từ (so sánh, nhất, từ–đến)' },
    {
      t: 'mcq',
      id: 'ck-c8-b2',
      title: 'Bộ 2 (7 câu) — trợ từ',
      items: [
        M('スポーツ（①）{何|なに}（②）いちばん（③）すきですか。', '① で　② が　③ X', ['① は　② が　③ に', '① で　② を　③ X', '① の　② が　③ が'], '**phạm vi + で** · 何**が** · **いちばん** đứng thẳng trước tính từ (không trợ từ).', 0),
        M('あまいもの（①）からいもの（②）、どちら（③）すきですか。…どちら（④）すきです。', '① と　② と　③ が　④ も', ['① と　② と　③ を　④ も', '① や　② と　③ が　④ は', '① と　② の　③ が　④ も'], '**A と B と どちらが** · **どちらも** = cả hai.', 1),
        M('スーパー（①）はいりました（②）、{何|なに}（③）{買|か}いませんでした。', '① に　② が　③ も', ['① を　② が　③ も', '① に　② から　③ を', '① で　② が　③ は'], '入ります → **に**; **が** = nhưng; **何も + phủ định**.', 2),
        M('きのうともだち（①）デパート（②）{買|か}い{物|もの}しました。', '① と　② で', ['① に　② で', '① と　② を', '① が　② へ'], '**ともだち と** (cùng) · **デパート で** (nơi mua sắm).', 3),
        M('うち（①）えき（②）あるいて（③）５{分|ふん}です。', '① から　② まで　③ X', ['① から　② まで　③ に', '① の　② まで　③ で', '① から　② は　③ X'], '**から～まで**; **あるいて + thời gian** → không trợ từ.', 0),
        M('このりんご（①）１つ（②）いくらですか。', '① は　② X', ['① が　② は', '① を　② の', '① は　② が'], 'Chủ đề **は**; số lượng đứng thẳng trước いくら (không trợ từ).', 1),
        M('ほんやはぎんこう（①）パンや（②）あいだ（③）あります。', '① と　② の　③ に', ['① と　② に　③ の', '① の　② と　③ に', '① と　② の　③ で'], '**N1 と N2 の間 に** あります.', 2),
      ],
    },
    {
      t: 'note',
      title: 'Chưa chắc ở Bộ 2',
      items: [
        'Câu 8 của Bộ 2 (これ… きむらさん… そのじしょ…) trong slide chỉ còn các đáp án rời **は・の・も・の** (khoảng 「これはきむらさんの じしょです。そのじしょも…」); không dựng lại được cả câu. Công thức: **これ は** (chủ đề) · **きむらさん の じしょ** (sở hữu) · **も** (cũng).',
        'Câu 1 của Bộ 2 không đọc được.',
      ],
    },

    { t: 'h', text: 'A. 文法復習 — Bộ 3: từ để hỏi (nhìn câu trả lời)' },
    {
      t: 'mcq',
      id: 'ck-c8-b3',
      title: 'Bộ 3 (11 câu) — từ để hỏi',
      items: [
        M('あなたのくるまは（　）ですか。…あのしろいくるまです。', 'どれ', ['どの', 'どこ', 'どんな'], 'Chọn một cái trong nhiều cái, đứng một mình → **どれ**.', 0),
        M('（　）{学校|がっこう}を{休|やす}みましたか。…ねつがありましたから。', 'どうして', ['どう', 'いつ', 'どんな'], 'Trả lời bằng **から** → hỏi lý do **どうして**.', 1),
        M('てんきは（　）でしたか。…とてもよかったです。', 'どう', ['どんな', 'どれ', 'どこ'], 'Hỏi cảm nhận về thời tiết → **どう**.', 2),
        M('たまごが（　）ありますか。…３つあります。', 'いくつ', ['いくら', 'どのくらい', '{何時|なんじ}'], 'Đếm bằng つ → **いくつ**.', 3),
        M('（　）シャツを{買|か}いに{行|い}きますか。…{今日|きょう}の{午後|ごご}{行|い}きます。', 'いつ', ['どこ', 'だれ', 'どう'], 'Câu trả lời là thời gian → **いつ**.', 0),
        M('{東京|とうきょう}ビルまで（　）かかりますか。…バスで３０{分|ぷん}ぐらいです。', 'どのくらい', ['いくら', 'いくつ', 'どれ'], 'Thời gian đi đường → **どのくらい**. (かかります = mất, tốn — từ này chưa học trong B4–7 nhưng xuất hiện ở slide.)', 1),
        M('あの{女|おんな}の{人|ひと}は（　）ですか。…ハンさんです。', 'だれ', ['{何|なに}', 'どこ', 'どれ'], 'Hỏi người → **だれ**.', 2),
        M('{今日|きょう}は（　）ですか。…{木曜日|もくようび}です。', '{何曜日|なんようび}', ['{何月|なんがつ}', '{何日|なんにち}', '{何時|なんじ}'], 'Đáp là một thứ trong tuần → **何曜日**.', 3),
        M('ゆうびんきょくは（　）からですか。…９{時|じ}からです。', '{何時|なんじ}', ['{何曜日|なんようび}', 'いつ', 'どこ'], 'Đáp là giờ → **何時**. (いつ cũng hỏi thời gian nhưng không dùng với giờ cụ thể trong câu này.)', 0),
        M('そのくろいくつは（　）ですか。…7,500{円|えん}です。', 'いくら', ['いくつ', '{何枚|なんまい}', 'どのくらい'], 'Giá tiền → **いくら**.', 1),
        M('（　）を{飲|の}みたいですか。…つめたいジュースを{飲|の}みたいです。', '{何|なに}', ['どんな', 'どれ', 'どこ'], '「どんな」 cần danh từ sau nó (どんな**ジュース**を…). Đứng trước を thì dùng **何**.', 2),
      ],
    },

    { t: 'h', text: 'A. 文法復習 — Bộ 4: từ để hỏi trong hội thoại ngắn' },
    {
      t: 'mcq',
      id: 'ck-c8-b4',
      title: 'Bộ 4 (8 câu) — từ để hỏi',
      items: [
        M('あれは（　）ですか。…いすです。', '{何|なん}', ['どれ', 'どの', 'どこ'], 'Hỏi tên đồ vật → **何** (なん).', 0),
        M('（　）と{東京|とうきょう}へ{行|い}きましたか。…{一人|ひとり}で{行|い}きました。', 'だれ', ['{何|なに}', 'どこ', 'いつ'], '**だれと** (đi với ai) → trả lời “một mình” (一人で).', 1),
        M('（　）{国|くに}へ{帰|かえ}りますか。…{来年|らいねん}{帰|かえ}ります。', 'いつ', ['どこ', 'だれ', 'どう'], 'Đáp “sang năm” → **いつ**.', 2),
        M('{今|いま}（　）ですか。…８{時|じ}２０{分|ぷん}です。', '{何時|なんじ}', ['{何曜日|なんようび}', 'いつ', 'いくつ'], 'Đáp giờ → **何時**.', 3),
        M('（　）で{学校|がっこう}へ{行|い}きますか。…あるいて{行|い}きます。', '{何|なん}', ['どこ', 'いつ', 'だれ'], 'Phương tiện/cách đi → **何で**.', 0),
        M('これは（　）のパソコンですか。…アメリカのです。', 'どこ', ['だれ', '{何|なん}', 'どれ'], 'Đáp là tên nước → **どこの** (của nước nào).', 1),
        M('{先週|せんしゅう}の{日曜日|にちようび}（　）へ{行|い}きましたか。…{美術館|びじゅつかん}へ{行|い}きました。', 'どこ', ['だれ', 'いつ', '{何|なに}'], 'Đích đến → **どこへ**.', 2),
        M('ヨーネンは（　）の{会社|かいしゃ}ですか。…チョコレートの{会社|かいしゃ}です。', '{何|なん}', ['だれ', 'どこ', 'どれ'], '**何の会社** (công ty gì).', 3),
      ],
    },
    {
      t: 'note',
      title: 'Lưu ý khi chữa 文法復習',
      items: [
        'Câu 「たまごが（いくつ）ありますか。…３つあります」 xuất hiện **hai lần** trong slide (Bộ 3 và Bộ 4) — chỉ là lặp.',
        'Câu số 1 của mỗi bộ trong slide không đọc được. Các bộ đều ôn **cùng một số điểm**: trợ từ に・で・を・が・は・の・と・も・へ · から～まで · いちばん · どちら · どれ/どの · どうして · いくつ/いくら · 何時/何曜日.',
        'Trong slide, **何** được in cả dạng 「何」 lẫn 「どんな」 ở cùng một ô — đó là **đáp án nhiễu**, không phải hai đáp án đúng.',
      ],
    },

    { t: 'h', text: 'B. 漢字 — các lần ôn và từ ghép của cô' },
    {
      t: 'p',
      text: 'Slide có 4 lần chữ (Bài 4 · 5 · 6 · 7) rồi **bảng từ ghép**: một cột **cách đọc** hiragana, một cột **chữ Hán**, và học viên **nối** cho đúng. Bảng dưới là **toàn bộ từ trong slide**, xếp theo lần, kèm nghĩa. Che cột Hán lại, tự viết ra; rồi làm bài gõ chữ Hán cuối mục.',
    },
    {
      t: 'table',
      caption: 'Lần 4 (東京 名前 国 男女 区 市)',
      head: ['Cách đọc', 'Chữ Hán', 'Nghĩa'],
      rows: [
        ['とうきょう', '{東京|とうきょう}', 'Tokyo'], ['なまえ', '{名前|なまえ}', 'tên'], ['くに', '{国|くに}', 'đất nước'],
        ['がいこく', '{外国|がいこく}', 'nước ngoài'], ['おとこのひと', '{男|おとこ}の{人|ひと}', 'người đàn ông'], ['おんなのひと', '{女|おんな}の{人|ひと}', 'người phụ nữ'],
        ['く', '{区|く}', 'quận, khu'], ['し', '{市|し}', 'thành phố'], ['ひがし', '{東|ひがし}', 'phía đông'],
        ['ぜんじつ', '{前日|ぜんじつ}', 'ngày hôm trước'],
      ],
    },
    {
      t: 'table',
      caption: 'Lần 5 (先 週 毎 午 後 見 食 飲 買 物 行 休)',
      head: ['Cách đọc', 'Chữ Hán', 'Nghĩa'],
      rows: [
        ['いっしゅうかん', '{一週間|いっしゅうかん}', 'một tuần lễ'], ['せんせい', '{先生|せんせい}', 'giáo viên'], ['ごご', '{午後|ごご}', 'buổi chiều'],
        ['ごぜん', '{午前|ごぜん}', 'buổi sáng'], ['まいしゅう', '{毎週|まいしゅう}', 'mỗi tuần'], ['まいつき', '{毎月|まいつき}', 'mỗi tháng'],
        ['せんげつ', '{先月|せんげつ}', 'tháng trước'], ['たべもの', '{食|た}べ{物|もの}', 'đồ ăn'], ['のみもの', '{飲|の}み{物|もの}', 'đồ uống'],
        ['かいもの', '{買|か}い{物|もの}', 'mua sắm'], ['しょくじ', '{食事|しょくじ}', 'bữa ăn'], ['たべます', '{食|た}べます', 'ăn'],
        ['のみます', '{飲|の}みます', 'uống'], ['かいます', '{買|か}います', 'mua'], ['みます', '{見|み}ます', 'xem'],
        ['みせます', '{見|み}せます', 'cho xem'], ['いきます', '{行|い}きます', 'đi'], ['やすみます', '{休|やす}みます', 'nghỉ'],
        ['やすみ', '{休|やす}み', 'ngày nghỉ'], ['うしろ', '{後|うし}ろ', 'phía sau'], ['もの', '{物|もの}', 'đồ vật'],
      ],
    },
    {
      t: 'table',
      caption: 'Lần 6 (今 来 帰 会 社 聞 読 書 話 寺 言 貝 田 力 門)',
      head: ['Cách đọc', 'Chữ Hán', 'Nghĩa'],
      rows: [
        ['こんしゅう', '{今週|こんしゅう}', 'tuần này'], ['こんげつ', '{今月|こんげつ}', 'tháng này'], ['ことし', '{今年|ことし}', 'năm nay'],
        ['きょう', '{今日|きょう}', 'hôm nay'], ['いま', '{今|いま}', 'bây giờ'], ['きます', '{来|き}ます', 'đến'],
        ['らいねん', '{来年|らいねん}', 'năm sau'], ['らいげつ', '{来月|らいげつ}', 'tháng sau'], ['らいにち', '{来日|らいにち}', 'đến Nhật'],
        ['かえります', '{帰|かえ}ります', 'về'], ['きこく', '{帰国|きこく}', 'về nước'], ['あいます', '{会|あ}います', 'gặp'],
        ['かいしゃ', '{会社|かいしゃ}', 'công ty'], ['しゃかい', '{社会|しゃかい}', 'xã hội'], ['かいわ', '{会話|かいわ}', 'hội thoại'],
        ['ききます', '{聞|き}きます', 'nghe, hỏi'], ['よみます', '{読|よ}みます', 'đọc'], ['どくしょ', '{読書|どくしょ}', 'đọc sách'],
        ['よみもの', '{読|よ}み{物|もの}', 'đồ để đọc'], ['かきます', '{書|か}きます', 'viết'], ['かきもの', '{書|か}き{物|もの}', 'thứ để viết (ít dùng)'],
        ['はなします', '{話|はな}します', 'nói chuyện'], ['いいます', '{言|い}います', 'nói'], ['げんご', '{言語|げんご}', 'ngôn ngữ'],
        ['てら', '{寺|てら}', 'chùa'], ['かい', '{貝|かい}', 'con sò'], ['た', '{田|た}', 'ruộng'],
        ['すいでん', '{水田|すいでん}', 'ruộng nước'], ['ちから', '{力|ちから}', 'sức'], ['すいりょく', '{水力|すいりょく}', 'thuỷ lực'],
        ['かりょく', '{火力|かりょく}', 'hoả lực, sức nóng'], ['もん', '{門|もん}', 'cổng'],
      ],
    },
    {
      t: 'table',
      caption: 'Lần 7 (肉 料 理 野 半 大 小)',
      head: ['Cách đọc', 'Chữ Hán', 'Nghĩa'],
      rows: [
        ['にく', '{肉|にく}', 'thịt'], ['りょうり', '{料理|りょうり}', 'món ăn'], ['りょうきん', '{料金|りょうきん}', 'phí, cước'],
        ['はんぶん', '{半分|はんぶん}', 'một nửa'], ['はんとし', '{半年|はんとし}', 'nửa năm'], ['はんつき', '{半月|はんつき}', 'nửa tháng'],
        ['はんにち', '{半日|はんにち}', 'nửa ngày'], ['いちじはん', '{一時半|いちじはん}', '1 rưỡi'], ['なかば', '{半|なか}ば', 'một nửa, giữa chừng'],
        ['たいはん', '{大半|たいはん}', 'phần lớn'], ['おおきい', '{大|おお}きい', 'to'], ['だいがく', '{大学|だいがく}', 'đại học'],
        ['おとな', '{大人|おとな}', 'người lớn'], ['たいかい', '{大会|たいかい}', 'đại hội, cuộc thi'], ['しょうがくせい', '{小学生|しょうがくせい}', 'học sinh tiểu học'],
        ['しょうがっこう', '{小学校|しょうがっこう}', 'trường tiểu học'], ['こびと', '{小人|こびと}', 'người tí hon'],
      ],
    },
    {
      t: 'note',
      title: 'Ghi chú về bảng từ của cô',
      items: [
        '**半日**: slide ghi cả はんじつ / はんにち. Dùng **はんにち**.',
        '**聞き物・書き物・読み物** trong slide: ききもの, かきもの, よみもの. Trong tiếng Nhật thông dụng chỉ **読み物 (よみもの)** hay gặp; 聞き物・書き物 hiếm. Nếu đề ra, đọc theo kun như slide.',
        '**今日 きょう**, **今年 ことし**, **大人 おとな**, **小人 こびと** là các từ đọc đặc biệt — học thuộc cả từ.',
      ],
    },
    {
      t: 'quiz',
      id: 'ck-c8-han-go',
      title: 'Gõ chữ Hán từ cách đọc (30 từ trong slide của cô)',
      kind: 'fill',
      items: [
        { q: 'いっしゅうかん', answers: ['一週間', 'いっしゅうかん'], hint: 'một tuần lễ' },
        { q: 'せんせい', answers: ['先生', 'せんせい'], hint: 'giáo viên' },
        { q: 'ごご', answers: ['午後', 'ごご'], hint: 'buổi chiều' },
        { q: 'まいしゅう', answers: ['毎週', 'まいしゅう'], hint: 'mỗi tuần' },
        { q: 'たべもの', answers: ['食べ物', 'たべもの'], hint: 'đồ ăn' },
        { q: 'かいもの', answers: ['買い物', 'かいもの'], hint: 'mua sắm' },
        { q: 'しょくじ', answers: ['食事', 'しょくじ'], hint: 'bữa ăn' },
        { q: 'せんげつ', answers: ['先月', 'せんげつ'], hint: 'tháng trước' },
        { q: 'のみもの', answers: ['飲み物', 'のみもの'], hint: 'đồ uống' },
        { q: 'にく', answers: ['肉', 'にく'], hint: 'thịt' },
        { q: 'はんぶん', answers: ['半分', 'はんぶん'], hint: 'một nửa' },
        { q: 'りょうり', answers: ['料理', 'りょうり'], hint: 'món ăn' },
        { q: 'しょうがくせい', answers: ['小学生', 'しょうがくせい'], hint: 'học sinh tiểu học' },
        { q: 'おとな', answers: ['大人', 'おとな'], hint: 'người lớn' },
        { q: 'しゃかい', answers: ['社会', 'しゃかい'], hint: 'xã hội' },
        { q: 'かえります', answers: ['帰ります', 'かえります'], hint: 'về' },
        { q: 'こんしゅう', answers: ['今週', 'こんしゅう'], hint: 'tuần này' },
        { q: 'いいます', answers: ['言います', 'いいます'], hint: 'nói' },
        { q: 'あいます', answers: ['会います', 'あいます'], hint: 'gặp' },
        { q: 'はなします', answers: ['話します', 'はなします'], hint: 'nói chuyện' },
        { q: 'かいしゃ', answers: ['会社', 'かいしゃ'], hint: 'công ty' },
        { q: 'げんご', answers: ['言語', 'げんご'], hint: 'ngôn ngữ' },
        { q: 'なまえ', answers: ['名前', 'なまえ'], hint: 'tên' },
        { q: 'がいこく', answers: ['外国', 'がいこく'], hint: 'nước ngoài' },
        { q: 'とうきょう', answers: ['東京', 'とうきょう'], hint: 'Tokyo' },
        { q: 'いちじはん', answers: ['一時半', 'いちじはん', '1時半'], hint: '1 rưỡi' },
        { q: 'しょうがっこう', answers: ['小学校', 'しょうがっこう'], hint: 'trường tiểu học' },
        { q: 'はんとし', answers: ['半年', 'はんとし'], hint: 'nửa năm' },
        { q: 'ことし', answers: ['今年', 'ことし'], hint: 'năm nay' },
        { q: 'らいげつ', answers: ['来月', 'らいげつ'], hint: 'tháng sau' },
      ],
    },

    { t: 'h', text: 'C. Những điểm trong slide tóm tắt cần đọc kỹ' },
    {
      t: 'note',
      title: 'Đính chính và ghi nhớ — chỗ slide dễ hiểu nhầm',
      items: [
        '**Bảng tổng kết tính từ** trong slide ghi tắt: **いくない** và **いかった** để chỉ “đổi い thành く＋ない / かっ＋た”. Viết đầy đủ: たか**くない**です · たか**かった**です · たか**くなかった**です. Riêng **いい → よくない / よかった / よくなかった** (slide có ghi “いい よかった”).',
        '**Slide Bài 6** gọi mẫu 「S はもう V ました」 là “nói về kinh nghiệm đã từng làm gì”. Thực ra mẫu này hỏi **đã làm xong chưa** (もう…ましたか → はい、もう…ました／いいえ、まだです). Nói về kinh nghiệm “đã từng” là ngữ pháp khác (học sau) — **đừng nhầm** khi làm bài.',
        '**Slide Bài 7** ghi “Nhóm 1: các động từ có đuôi i” — ý là **âm trước ます** thuộc cột い (かいます, のみます…). Và cô nhắc 4 động từ đặc biệt thuộc nhóm 2: **おきます, みます, います, かります**.',
        '**Slide Bài 5**: 「N ＋ と」 là **cùng với** (と + động từ); khác **A と B** (liệt kê). Hai nghĩa đều xuất hiện trong bài trợ từ.',
        'Mẫu **「～で～mùa／ngày に なにを V か」** (slide Bài 4) nghĩa: ở (nơi) vào (mùa/ngày) làm gì?  で = nơi, に = thời điểm.',
        '**Mẫu 「N が ほしい／すき／きらい」**: đối tượng đi với **が**; còn “muốn làm” là **V たい**. Slide đặt chung một trang nên dễ nhầm.',
      ],
    },

    { t: 'h', text: 'D. 聴解 — nghe Bài 4–7 trong Slot 30' },
    {
      t: 'p',
      text: 'Slide nghe của cô có **một kịch bản hội thoại với chỗ trống** cho từng やってみよう của Bài 4 và Bài 5 (điền theo băng CD). Với Bài 6 và Bài 7, slide **chỉ ghi mã file băng** (B06, B10, B15, B20, B26, B31) và **không có chữ** — nên không chữa được từng câu; hãy luyện bằng 43 đoạn mới ở bài 5. File CD gốc có bản quyền nên **không đăng lên web**.',
    },
    {
      t: 'table',
      caption: 'Phần nghe Bài 4, 5 trong Slot 30 — mỗi đoạn hỏi gì và cần nghe ra từ khoá nào',
      head: ['Đoạn', 'Nội dung đoạn nghe (tóm tắt)', 'Từ khoá cần nghe ra', 'Chú ý'],
      rows: [
        ['B4 – やってみよう 1', 'Hỏi quê của Wang, nơi đó nằm ở đâu, từ Nhật đến đó mất bao lâu', 'Tên nước · tên thành phố · phương hướng (きた) · thời gian + くらい', 'Số giờ dạng **N じかん はん** (3 tiếng rưỡi)'],
        ['B4 – やってみよう 2 (1)', 'Hỏi thị trấn của Marco: lớn không, đông người không, có gì', 'おおきい · ひとが おおい · ふるい きょうかい · きれい', '**そして** nối hai ý cùng hướng'],
        ['B4 – やってみよう 2 (2)', 'Park đến từ Busan: nơi đó thế nào, có gì', 'どんな ところ → にぎやか · たかい ビル · うみ · みどり', '**どんな ところ** → trả lời **にぎやかな ところ**'],
        ['B4 – やってみよう 2 (3, 4)', 'Hai đoạn tự giới thiệu thị trấn (Yamaguchi, Kimura)', 'しずか · みどり · かわ · にぎやかじゃありません · こうえん · おてら · ゆうめい', 'Phủ định な-adj: **じゃありません**'],
        ['B4 – やってみよう 3 (1)', 'Tháng 12: ở Nhật lạnh, nhưng ở nơi bạn kia là mùa hè', 'さむい · さむくない · なつ · あつい · あめが すくない · バーベキュー', '**さむくない** (phủ định い-adj)'],
        ['B4 – やってみよう 3 (2)', 'Tháng 8 ở Iran: nóng; uống gì khi nóng', 'あつい · メロンの ジュース · あまい · つめたい · おいしい', 'あつい (ngày nóng) / **つめたい** (nước lạnh)'],
        ['B5 – やってみよう 1 (1)', 'Chủ nhật: ai đi đâu, cùng ai, làm gì, mua gì', 'どこへ · だれと · なにを かいました · デパート · こうえん', '**と** (cùng) · **で** (nơi làm)'],
        ['B5 – やってみよう 1 (2)', 'Hai người kể cuối tuần: một người ở nhà, một người đến nhà bạn', 'どこへも いきませんでした · それから · ～じかん くらい · りょうりを つくりました', '**どこへも** + phủ định · **それから** · thời lượng'],
      ],
    },
    {
      t: 'note',
      title: 'Cách làm dạng “nghe điền” của cô',
      items: [
        'Trước khi nghe: đọc các chỗ trống, đoán **loại từ** cần điền (danh từ / tính từ / số + giờ).',
        'Nghe lần 1: ghi nhanh bằng **kana**, bỏ qua trợ từ. Nghe lần 2: điền trợ từ và **な／じゃありません／くないです**.',
        'Kiểm tra: đọc lại cả hội thoại, xem câu có **tự nhiên** không (ví dụ 「にぎやか＿＿ところ」 phải là な).',
        'Dạng này **khác** với nghe chọn đáp án — đề cuối kỳ có thể ra một trong hai. Luyện cả hai ở bài 5.',
      ],
    },
  ],
};

/* ═══════════════════ XUẤT ═══════════════════ */

export const ON_CUOI_KY: Lesson[] = [CAU_TRUC,NGU_PHAP,CHU_HAN,CHIA_DONG_TU,NGHE,THI_NOI,DE_LUYEN,CHUA_SLOT];
